// ==UserScript==
// @name         IsThereAnyDeal - Add G2A prices
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  add G2A prices on listings
// @author       Shuunen
// @match        *://*isthereanydeal.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30960/IsThereAnyDeal%20-%20Add%20G2A%20prices.user.js
// @updateURL https://update.greasyfork.org/scripts/30960/IsThereAnyDeal%20-%20Add%20G2A%20prices.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* This part allow this script to access G2A cors protected webservice */
    jQuery.ajaxPrefilter(function(options) {
        if (options.crossDomain && jQuery.support.cors) {
            options.url = 'https://e2ea1efc.ngrok.io/' + options.url;
        }
    });

    // Date.now polyfill
    if (!Date.now) {
        Date.now = function now() {
            return new Date().getTime();
        };
    }

    var colorDefault = 'antiquewhite';
    var colorNice = 'gold';
    var colorGood = 'gold';
    var colorGreat = 'red';

    var g2aBaseUrl = 'https://www.g2a.com';
    var g2aSearchUrl = '/lucene/search/quick?phrase=';
    var g2aNormalSearchUrl = '/?search=';

    var proxyFailed = false;
    var pricesCache = null;
    try {
        pricesCache = JSON.parse(localStorage.g2aPriceCache);
    } catch (e) {
        pricesCache = {};
    }

    function timestamp(){
        return Math.round(Date.now() / 1000);
    }

    function searchPrice(gameId, title, platform, callback) {
        // platform is one of 'steam','origin','uplay'
        callback = callback || function(){ console.warn('callback not provided');};
        if(proxyFailed){
            callback({minPrice:1000});
            return;
        }
        var cacheKey = gameId + '-'+platform;
        if(pricesCache.hasOwnProperty(cacheKey)){
            console.log('found ' + title + ' ['+platform+'] price in cache');
            if(pricesCache[cacheKey].hasOwnProperty('savedOn')){
                var hoursAgo = (timestamp() - pricesCache[cacheKey].savedOn) / 3600;
                var maxHours = 1;
                if(hoursAgo < maxHours){
                    callback(pricesCache[cacheKey]);
                    return;
                } else {
                    console.log('cache entry '+cacheKey+' is more than '+maxHours+' hours old, will not use this cache entry...');
                }
            } else {
                console.log('cache entry '+cacheKey+' was not timestamped, will not use this cache entry...');
            }
        }
        var url = g2aBaseUrl + g2aSearchUrl + title + ' ' + platform + ' global';
        // replace spaces
        url = url.replace(/\s/g,'%20');
        var gameUrl = '';
        var minPrice = 1000;
        $.getJSON(url, function(data) {
            if(!data.docs || !data.docs.length){
                console.error('no results found for '+title+' on '+platform+' (GET', url ,')');
            } else {
                data.docs.forEach(function(game) {
                    if(game.slug.indexOf('dlc') === -1 && (game.minPrice <= minPrice)){
                        minPrice =  game.minPrice;
                        gameUrl = g2aBaseUrl + game.slug;
                    }
                });
            }
            // save price for platform in memory cache
            pricesCache[cacheKey] = {
                savedOn: timestamp(),
                minPrice: minPrice,
                gameUrl: gameUrl,
                platform: platform
            };
            // persist in localStorage
            localStorage.g2aPriceCache = JSON.stringify(pricesCache);
            setTimeout(function(){
                // callback after delay to space requests
                callback(pricesCache[cacheKey]);
            }, 300);
        }).fail(function(err){
            console.info('setting proxyFailed to true to avoid cascading failling requests');
            proxyFailed = true;
            callback({minPrice:1000});
            return;
        });
    }

    function searchPriceByLine(line, index) {
        var title = line.querySelector('.title a.noticeable').textContent;
        // Watch_Dogs€ 2 => watch dogs 2
        title = title.toLowerCase().replace(/[^a-z\s\d]/g,' ').replace(/\s+/g,' ').trim();
        var priceEl = line.querySelector('.currentBest');
        if(!priceEl){
            var minPriceDeal = 1000;
            line.querySelectorAll('.deals > a').forEach(function(priceDealEl){
                var priceDeal = parseFloat(priceDealEl.textContent.replace(',','.'));
                if(priceDeal < minPriceDeal){
                    priceEl = priceDealEl;
                    minPriceDeal = priceDeal;
                }
            });
        }
        if(!priceEl){
            console.error('cannot find price on line', line);
            return;
        }
        var price = parseFloat(priceEl.textContent.replace(',','.'));
        console.log(title, price);
        var platform = '';
        var gameId = line.getAttribute('data-plain');
        if(!gameId){
            console.error('cannot find game id on line', line);
            return;
        }
        var gameUrl = '';
        var minPrice = 1000;
        // mark line as loading
        line.style.filter = 'blur(5px) brightness(300%)';
        line.style.transition = 'filter .4s';
        setTimeout(function(){
            searchPrice(gameId, title, 'steam', function(results){
                if(results.minPrice < minPrice){
                    minPrice = results.minPrice;
                    gameUrl = results.gameUrl;
                    platform = results.platform;
                }
                searchPrice(gameId, title, 'origin', function(results){
                    if(results.minPrice < minPrice){
                        minPrice = results.minPrice;
                        gameUrl = results.gameUrl;
                        platform = results.platform;
                    }
                    searchPrice(gameId, title, 'uplay', function(results){
                        if(results.minPrice < minPrice){
                            minPrice = results.minPrice;
                            gameUrl = results.gameUrl;
                            platform = results.platform;
                        }
                        // update price in DOM
                        if (minPrice < price) {
                            console.info('found better price for ' + title + ' ['+platform+'] : ' + minPrice + '$' );
                            var reduc = (100 - Math.round((minPrice / price) * 100));
                            var color = (reduc > 80 ? colorGreat : (reduc > 50 ? colorGood : (reduc > 30 ? colorNice : colorDefault)));
                            var stl = ' style="color:'+color+'"';
                            var hrf = ' href="'+ gameUrl + '"';
                            var ttl = ' title="on ['+platform+'], ' + reduc + '% off !"';
                            var trg = ' target="_blank"';
                            priceEl.parentElement.innerHTML += '<a'+stl+hrf+ttl+trg+'>' + minPrice +'$ on G2A</a>';
                        } else {
                            console.log('didnt found better price for ' + title + ' than : ' + price + '$' );
                        }
                        var getPriceLink = line.querySelector('.g2a-get-price');
                        if(getPriceLink){
                            getPriceLink.style.display = 'none';
                        } else {
                            // console.log('cannot find the "Get price" link in order to hide it');
                        }
                        // let user check himself on G2A
                        var dealsEl = line.querySelector('.deals');
                        var cls = ' class="g2a-get-price manual"';
                        var href = ' href="'+g2aBaseUrl + g2aNormalSearchUrl + title +' global"';
                        var target = ' target="_blank"';
                        dealsEl.innerHTML = '<a'+cls+href+target+'>Check on G2A</a>' + dealsEl.innerHTML;
                        // remove loading styling
                        line.style.filter = '';
                    });
                });
            });
        }, index * 300);
    }

    function addGetPriceLink(line, index){
        var dealsEl = line.querySelector('.deals');
        dealsEl.innerHTML ='<div class="g2a-get-price">Get Price on G2A</div>' + dealsEl.innerHTML;
        var link = line.querySelector('.g2a-get-price');
        if(link){
            link.addEventListener('click',function(event){
                searchPriceByLine(line, index);
                link.style.display = 'none';
            });
        } else {
            console.error('impossible to find the "Get Price" button to listen the click to');
        }
    }

    function addGetAllPricesLink(){
        var container = document.querySelector('#orderByRight');
        container.innerHTML ='<div class="g2a-get-price all">Get ALL Prices on G2A</div>' + container.innerHTML;
        var link = container.querySelector('.g2a-get-price');
        if(link){
            link.addEventListener('click',function(event){
                document.querySelectorAll('#games .game').forEach(searchPriceByLine);
            });
        } else {
            console.error('impossible to find the "Get ALL Prices" button to listen the click to');
        }
    }

    function detectMouseoverGames(){
        var gameHovered = '';
        document.body.addEventListener('mouseover',function(event){
            var el = event.target;
            if(!el.classList.contains('game')){
                return;
            }
            var curGameHovered = el.getAttribute('data-plain');
            if(curGameHovered === gameHovered){
                return;
            }
            gameHovered = el.getAttribute('data-plain');
            // console.log('over', gameHovered);
            if(!el.querySelector('.g2a-get-price')){
                addGetPriceLink(el, 0);
            }
        });
    }

    function insertStyle() {
        var style = `<style class="getG2ApricesStyle">
.g2a-get-price {
background-color: darkslategrey;
padding: 1px 5px;
margin: 3px 0 -5px;
font-size: 10px;
float: left;
cursor: pointer;
}
.g2a-get-price.manual {
background-color: #333;
color: #999;
}
.g2a-get-price.all {
font-size: 12px;
margin: 0px 8px 4px;
padding: 2px 8px;
border: 1px dotted lightblue;
border-radius: 3px;
}
</style>`;
        $('body').append($(style));
    }

    // init
    detectMouseoverGames();
    insertStyle();
    addGetAllPricesLink();
})();
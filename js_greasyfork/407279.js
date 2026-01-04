// ==UserScript==
// @name         Stock Market Shortcuts old
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get Stock info
// @author       Jox [1714547]
// @match        https://www.torn.com/stockexchange.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      nukefamily.org
// @downloadURL https://update.greasyfork.org/scripts/407279/Stock%20Market%20Shortcuts%20old.user.js
// @updateURL https://update.greasyfork.org/scripts/407279/Stock%20Market%20Shortcuts%20old.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle (`
.jox-stock-link{
    color: red !important;
    display: inline !important;
    margin: 0 10px !important;
}
     `);


/*
    let portfolio = document.querySelectorAll('.stock-main-wrap .item-wrap .logo a');
    let market = document.querySelectorAll('.stock-list .item .acc-header');

    let stocks = market.length > 0 ? market : portfolio;

    let nextStock = stocks.length;

    let linkNext = document.createElement('a');
    linkNext.href = '#';
    linkNext.innerHTML = 'NEXT SHARE';
    linkNext.addEventListener('click', e => {
        e.preventDefault();

        nextStock++
        if(nextStock >= stocks.length){
            nextStock = 0;
        }

        if(stocks[nextStock].wasClicked){
            stocks[nextStock].wasClicked = false;
        }
        stocks[nextStock].click();
    });

    let linkPrev = document.createElement('a');
    linkPrev.href = '#';
    linkPrev.innerHTML = 'PREV SHARE';
    linkPrev.addEventListener('click', e => {
        e.preventDefault();

        nextStock--;
        if(nextStock < 0){
            nextStock = stocks.length - 1;
        }

        if(stocks[nextStock].wasClicked){
            stocks[nextStock].wasClicked = false;
        }
        stocks[nextStock].click();
    });




    document.querySelector('.content-title').appendChild(linkNext);
    document.querySelector('.content-title').appendChild(linkPrev);
*/


    addStockLink('hrg');
    addStockLink('wssb');
    addStockLink('wlt');
    addStockLink('fhg');
    addMessageContainer();

    function addMessageContainer(){
        let div = document.createElement('div');
        div.id = 'jox-stock-message';
        document.querySelector('.content-title').appendChild(div);
    }

    function addStockLink(stock){
        let link = document.createElement('a');
        link.href = '#';
        link.innerHTML = stock.toUpperCase();
        link.classList.add('jox-stock-link');
        link.addEventListener('click', e => {
            e.preventDefault();

            let stockLink = null;

            if(document.querySelectorAll('.stock-list .item .acc-header').length > 0){
                //market
                stockLink = document.querySelector(`li[data-stock="${stock}"] .acc-header`);
            }
            else{
                //portfolio
                stockLink = document.querySelector(`li[data-stock="${stock}"] .logo a`);
            }

            if(stockLink){
                if(stockLink.wasClicked){
                    stockLink.wasClicked = false;
                }
                stockLink.click();
            }

        });
        document.querySelector('.content-title').appendChild(link);
    }

    $(document).ajaxComplete(function(e,xhr,settings){
        let stockRegex = /^.*stockexchange\.php\?ajax=true.*$/;
        let sentData = (settings.data != undefined ? settings.data.split("&") : "");
        if (stockRegex.test(settings.url)) {
            let response = xhr.responseText;
            //console.log('RESPONSE', response);
            let div = document.createElement('div');
            div.innerHTML = response;
            let items = div.querySelector('.info-stock-wrap ul.properties');
            //console.log("INFO", items);
            if(items.children.length == 8){
                items.children[0].removeChild(items.children[0].children[0]);
                items.children[4].removeChild(items.children[4].children[0]);
                items.children[6].removeChild(items.children[6].children[0]);
                items.children[7].removeChild(items.children[7].children[0]);
                var postData = {
                    stock: items.children[0].innerText.trim(),
                    total: Number(items.children[6].innerText.split(',').join('').trim()),
                    forsale: Number(items.children[7].innerText.split(',').join('').trim()),
                    price: items.children[4].innerText.trim(),
                    timestamp: Math.floor(Date.now() / 1000)
                }

                //console.log(JSON.stringify(postData));

                GM_xmlhttpRequest ( {
                    method:     'POST',
                    url:        'https://www.nukefamily.org/dev/stockdb.php',
                    //headers:    {'Cookie': document.cookie},
                    data:       JSON.stringify(postData),
                    onload:     function (responseDetails) {
                        // DO ALL RESPONSE PROCESSING HERE...
                        //console.log(responseDetails, responseDetails.responseText);
                        //alert(responseDetails.responseText);
                    }
                });

                document.getElementById('jox-stock-message').innerHTML = JSON.stringify(postData);
            }
        }
    });
})();
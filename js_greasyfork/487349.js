// ==UserScript==
// @name         Avanza Improvements
// @namespace    http://tampermonkey.net/
// @version      2024-02-15a
// @description  Minor improvements for avanza.se
// @author       Rokker
// @match        https://www.avanza.se/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=avanza.se
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487349/Avanza%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/487349/Avanza%20Improvements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
        const $ = window.$;

        //Automatic update-button click when update-buttons are available.
        if(document.querySelector('.update')){
            console.log("Enabling auto update button click.");
            setInterval(function(){
                document.querySelector('.update').parentElement.style.background = "dodgerblue"
                document.querySelector('.update').click();
                setTimeout(function(){
                    document.querySelector('.update').parentElement.style.background = ""
                },150);
            },7000);
        }

        //Colors rows on https://www.avanza.se/hall-koll/bevakningslistor.html if they include bear/bull for easier overview.
        if(document.querySelector('.avanzabank_comparechart')){
            console.log("Enabling Bull/Bear coloring in watch list.");
            $('a[title^="BULL"]').closest('tr').css({'background':'azure'})
            $('a[title^="BEAR"]').closest('tr').css({'background':'snow'})
            $('a[title*="DAX"]').siblings('.flag').removeClass('flag-se').addClass('flag-de')
            $('a[title*="NASDAQ"]').siblings('.flag').removeClass('flag-se').addClass('flag-us')
        }

        //Adds indicators to gainers/losers on https://www.avanza.se/aktier/vinnare-forlorare.html
        if(document.querySelector('.gainerLoserTable')){
            console.log("Enabling gainers row coloring.");
            var storageKey = 'gainerstockstest';
            var previousPushes = [];
            var stocks = JSON.parse(sessionStorage.getItem(storageKey) || "{}");
            var jox = setInterval(function(){
                var thesePushes = [];
                $('.pushPositive, .pushNegative').each(function(i,x){
                    var $x = $(x);
                    var $tr = $x.closest('tr');
                    var id = $tr.attr('data-oid');
                    var pct = parseFloat($tr.find('.changePercent').text().replace(',','.'));
                    thesePushes.push(id);
                    if(previousPushes.indexOf(id) === -1){
                        stocks[id] = stocks[id] || { name: $tr.find('.instrumentName a').text().trim() };
                        stocks[id].history = stocks[id].history || [];
                        stocks[id].history.unshift(pct);
                        // stocks[id].history.unshift($x.hasClass('pushPositive') ? 1 : -1);
                        stocks[id].history.length = stocks[id].history.length < 10 ? stocks[id].history.length : 10;
                    }
                });
                previousPushes = thesePushes;
                Object.keys(stocks).forEach(function(id){
                    var stock = stocks[id];
                    var $tr = $('[data-oid="'+id+'"]');
                    var $price = $tr.find('.lastPrice');
                    // var sum = stock.history.reduce((a,b,i) => a+((b||0)*(i/4)), 0);
                    // var sum = stock.history.reduce((a,b,i) => a+b, 0);
                    var diff = Math.round(((stock.history[0] || 0) - (stock.history[stock.history.length-1] || 0))*1000)/1000
                    var factor = 5;
                    if(diff > 0){
                        $price.css({'background': 'linear-gradient(to right, dodgerblue 0%, dodgerblue '+(diff*factor)+'px, transparent '+(diff*factor)+'px)'})
                    } else if(diff < 0){
                        $price.css({'background': 'linear-gradient(to right, salmon 0%, salmon '+((0-diff)*factor)+'px, transparent '+((0-diff)*factor)+'px)'})
                    } else {
                        $price.css({ 'background':''})
                    }

                    $price.attr({'title': (diff > 0 ? '+' + diff : diff) + '%'})
                });
                sessionStorage.setItem(storageKey, JSON.stringify(stocks));
            },20);
        }
    },2000);

    //Reload entire page every 2 minutes if user is passive
    var timeout;
    document.onmousemove = function(){
        clearTimeout(timeout);
        timeout = setTimeout(function(){
            location.reload();
        }, 2 * 60 * 1000);
    }
})();
// ==UserScript==
// @name         BLPPSC
// @version      0.1
// @namespace    Bricklink_Price_Per_Stud_Calculator
// @description  Bricklink Price Per Stud Calculator
// @author       Sencer ÖZTÜFEKÇİ
// @match        https://store.bricklink.com/*
// @icon         https://www.google.com/s2/favicons?domain=bricklink.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437791/BLPPSC.user.js
// @updateURL https://update.greasyfork.org/scripts/437791/BLPPSC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload=init;
    function init(){
        hesapla();
        const icerik = document.getElementsByClassName('store-view-panel in-menu')[0];
        const config = {
            attributes: true,
            childList: true,
            characterData: true
        };

        const callback = mutations => {
            mutations.forEach(mutation => {
                if(mutation.removedNodes[0]?.className==='wl-loading-spinner'){
                    console.log('değişti');
                    hesapla();
                }
            });
        }

        const observer = new MutationObserver(callback);
        observer.observe(icerik, config);

    }

    function hesapla(){
        var satirlar=document.getElementsByClassName('item component table-row');
        for(var i=0;i<satirlar.length;i++){
            //   var fiyat=Number(satirlar[i].childNodes[3].childNodes[1].childNodes[1].innerText.split(' ')[1].split(',').join());
            var _x=Number(satirlar[i].childNodes[2].childNodes[0].childNodes[0].childNodes[1].innerText.split(' ')[1]);
            var _y=Number(satirlar[i].childNodes[2].childNodes[0].childNodes[0].childNodes[1].innerText.split(' ')[3]);
            var fiyat=Number(satirlar[i].childNodes[3].childNodes[1].childNodes[1].innerText.split(' ')[1].split(',').join(''));
            var birim=satirlar[i].childNodes[3].childNodes[1].childNodes[1].innerText.split(' ')[0]
            var studFiyat= fiyat / (_x * _y);
            if(studFiyat){
                satirlar[i].childNodes[3].childNodes[1].childNodes[1].insertAdjacentHTML('afterend', '<br> PPS: <b>'+birim+' '+studFiyat.toFixed(4)+'</b>');
            }
        }
    }
})();
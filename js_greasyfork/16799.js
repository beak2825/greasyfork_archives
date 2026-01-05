// ==UserScript==
// @name         LittleBot
// @namespace    jorgequintt
// @version      0.1
// @description  try to take over the world!
// @author       jorgequintt
// @match        *://www.littlebux.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/16799/LittleBot.user.js
// @updateURL https://update.greasyfork.org/scripts/16799/LittleBot.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
function curUrl(stri){
return document.location.href.indexOf(stri)
}

if(curUrl('littlebux.com/viewads')>=0){
    if(curUrl('littlebux.com/viewads/adprize/')>=0){
        setTimeout(function(){unsafeWindow.document.hasFocus = function () {return true;};
        document.hasFocus = function () {return true;};},2000);
        function check(){
            if(document.querySelector('.titleStatus').innerText.length>0){
                document.querySelectorAll('.button')[0].click();
            }
        }
        setInterval(check,1000);
    }else{
        var ads = [];
        var cantAds = document.querySelectorAll('.col-xs-4').length;
        var allAds = document.querySelectorAll('.col-xs-4');
        for(var i=0; i < cantAds; i++){
            if(allAds[i].querySelectorAll('.gray').length === 0){
                ads.push(document.querySelectorAll('.col-xs-4')[i].parentElement.href);
            }
        }
        if(ads.length>0){
            document.location=ads[0];
        }else{
            var ap = document.querySelector('.userstat_stat_inner').innerText.replace('You have ','');
            ap = parseInt(ap.replace(' AdPrize chances left',''));
            if(ap > 0){
                document.location='http://www.littlebux.com/viewads/adprize';
            }
        }
    }
}

if(curUrl('littlebux.com/ads/view/')>=0){
    unsafeWindow.document.hasFocus = function () {return true;};
    document.hasFocus = function () {return true;};
    function check(){
        if(document.querySelector('.titleStatus').innerText.indexOf('Success')>=0){
            document.location="http://www.littlebux.com/viewads";
        }
    }
    setInterval(check,1000);
}

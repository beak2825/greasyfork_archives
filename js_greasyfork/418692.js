// ==UserScript==
// @name         javbusHelper
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  it will remove the bgImg on the detail pages on javBus!
// @author       You
// @match        https://www.javbus.com/*
// @match        https://www.buscdn.one/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javbus.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418692/javbusHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/418692/javbusHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var removeFirstTagViaClassName = function(className){
        var els = document.getElementsByClassName(className);
        if (els.length>0){
            var el = els[0];
            if (el){
                el.parentNode.removeChild(el);
            }
        }
    };
    removeFirstTagViaClassName("bigImage");
     function removeAdBox(s){
        var adBoxContainer = document.querySelector(s);
        if(adBoxContainer){
            adBoxContainer.parentElement.removeChild(adBoxContainer);
        }

    }
    removeAdBox("div.bcpic2");
    removeAdBox("div.banner300");
    removeAdBox("div.ad-box");
    removeAdBox("iframe");
    removeAdBox(".banner728");
    setTimeout(function(){ removeAdBox("div.ad-box");},2e2)

})();
// ==UserScript==
// @name         Facebook Back to Top
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Click the red link on the bottom of your Facebook page to scroll back to the top of your News Feed.
// @author       Eric Mintz
// @match        https://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19222/Facebook%20Back%20to%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/19222/Facebook%20Back%20to%20Top.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var addListener = function(element,eventName,listener){
        if(element.addEventListener){
            element.addEventListener(eventName, listener);
        }else{
            element.attachEvent('on'+eventName, listener);
        }
    };

    var removeListener = function(element, eventName, listener){
        if(element.removeEventListener){
            element.removeEventListener(eventName, listener);
        }else{
            element.detachEvent('on'+eventName, listener);
        }
    };

    var toTop = function(e){
        e.preventDefault();
        window.scrollTo(0,0);
    };

    var listener = function(e) {
        removeListener(window,'load',listener);
        var el = document.createElement('a');
        el.innerText = 'Back to Top';
        el.style.cssText = 'position:fixed; color:#fff;bottom:0; right:80px;z-index:10000;padding:2px 9px;font-weight:bold;text-decoration:none;background-color:#b00;border-top-right-radius:7px;border-top-left-radius:7px;box-shadow:0 0 6px rgba(0,0,0,.5);';
        addListener(el,'click',toTop);

        document.body.appendChild(el);
    };
    addListener(window,'load',listener);
    listener();
})();
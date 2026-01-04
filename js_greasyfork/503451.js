// ==UserScript==
// @name         Twitch - ?????????
// @namespace    https://greasyfork.org/ja/users/941284-ぐらんぴ
// @version      2025-08-14
// @description  something
// @author       ぐらんぴ
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503451/Twitch%20-%20.user.js
// @updateURL https://update.greasyfork.org/scripts/503451/Twitch%20-%20.meta.js
// ==/UserScript==

const log = console.log;
let $s = (el) => document.querySelector(el), $sa = (el) => document.querySelectorAll(el), $c = (el) => document.createElement(el);
let path = null, once = 0;

const origAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function(type, listener, options) {
    if(type === "loadstart"){
        if(once == 1){// load once
            //once = 0;
            log('returned');
            return;
        }else{

            const recordWrapper = function(e){
                if(location.href == "https://www.twitch.tv/") return;
                once = 1
            }
            origAddEventListener.call(this, type, recordWrapper, options);
        }
    }
    return origAddEventListener.call(this, type, listener, options);
};
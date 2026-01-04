// ==UserScript==
// @name         Fuck Seeyon OA
// @namespace    http://tampermonkey.net/
// @version      2024-04-29
// @description  Block annoying features of seeyon A8+
// @author       You
// @match        */seeyon/*
// @icon         https://www.seeyon.com/favicon.ico
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/493725/Fuck%20Seeyon%20OA.user.js
// @updateURL https://update.greasyfork.org/scripts/493725/Fuck%20Seeyon%20OA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Block the blinking A8+
    Object.defineProperty(document, 'title', {
        set: function(e){
            if(document.getElementsByTagName('title').length == 0){
                console.log('no title tag')
                const t = document.createElement('title')
                t.innerHTML = e;
                document.getElementsByTagName('html')[0].appendChild(t)
            }
            if (e == 'A8+') {
                return false
            }
            else {
                document.getElementsByTagName('title')[0].innerHTML = e
                return true
            }
        },
        get: function(e){
            return document.getElementsByTagName('title')[0].innerHTML
        }
    });

    //Use new tab, not popup window
    //Get original descriptor
    const openWindow = Object.getOwnPropertyDescriptor(window, 'open')
    //Intercept function
    if(openWindow){
        const openWindowFunc = openWindow.value;
        const blocker = function(...args){
            console.log('Args:', args)
            if(args[2]) args[2] = null;
            const res = openWindowFunc.apply(this, args)
            return res;
        }
        openWindow.value = blocker;
    }
    Object.defineProperty(window, 'open', openWindow);

})();
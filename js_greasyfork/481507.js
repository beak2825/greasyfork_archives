// ==UserScript==
// @name         No Popup Windows
// @namespace    No Popup Windows
// @version      0.1.1
// @description  Convert popup windows to new tabs
// @author       hangriver
// @include        *://*
// @icon         https://cdn.pixabay.com/photo/2016/03/31/14/37/window-1292785_960_720.png
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/481507/No%20Popup%20Windows.user.js
// @updateURL https://update.greasyfork.org/scripts/481507/No%20Popup%20Windows.meta.js
// ==/UserScript==

(function() {
    'use strict';

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
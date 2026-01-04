// ==UserScript==
// @name         dcard反登入視窗
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  dcard anti login popup
// @author       Microdust
// @match        *://*.dcard.tw/*
// @icon         https://www.google.com/s2/favicons?domain=dcard.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432737/dcard%E5%8F%8D%E7%99%BB%E5%85%A5%E8%A6%96%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/432737/dcard%E5%8F%8D%E7%99%BB%E5%85%A5%E8%A6%96%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let pathName = window.location.pathname.split('/');


    let loginPopup = document.querySelector('.__portal');
    let observe = new MutationObserver(function(mutations, observe) {
        let getChild = loginPopup.children;
        //console.log(getChild.length);
        for (let i = 0; i < getChild.length; i++) {
            //console.log(getChild[i]);
            if (!hasClass(getChild[i], 'XaZHR')) getChild[i].style.display = 'none';
            //if (!hasClass(getChild[i], 'XaZHR')) loginPopup.removeChild(getChild[i]);
        }
        document.body.style.overflow = 'unset';
    });
    observe.observe(loginPopup, { 'childList': true });

    function hasClass(element, className) {
        return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
    }
})();
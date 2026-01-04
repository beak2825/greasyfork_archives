// ==UserScript==
// @name         关闭NDM资源嗅探
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  关闭NDM资源嗅探功能
// @author       mengxun
// @include      http://*
// @include      https://*
// @icon         https://www.neatdownloadmanager.com/templates/neat/images/icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460059/%E5%85%B3%E9%97%ADNDM%E8%B5%84%E6%BA%90%E5%97%85%E6%8E%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/460059/%E5%85%B3%E9%97%ADNDM%E8%B5%84%E6%BA%90%E5%97%85%E6%8E%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const observer = new MutationObserver((records,_observer) => {
        records.forEach(i => {
            if(i?.target?.id?.startsWith('neatDiv')){
                i.target.remove()
            }
        })
    })
    observer.observe(document, {
        subtree: true,
        childList: true
    })
    window.onbeforeunload=function(e){
        console.log('window onbeforeunload')
        observer.disconnect()
    }
})();
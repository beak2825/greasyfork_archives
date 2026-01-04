// ==UserScript==
// @name         屏蔽B站虚拟乱斗条
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  屏蔽虚拟乱斗条
// @author       siriusK
// @match        https://live.bilibili.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.0/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/421782/%E5%B1%8F%E8%94%BDB%E7%AB%99%E8%99%9A%E6%8B%9F%E4%B9%B1%E6%96%97%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/421782/%E5%B1%8F%E8%94%BDB%E7%AB%99%E8%99%9A%E6%8B%9F%E4%B9%B1%E6%96%97%E6%9D%A1.meta.js
// ==/UserScript==

'use strict';

function main() {
    $("#chaos-pk-vm").hide();

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type == "attributes") {
                //document.body.style.overflow = 'auto';
                if (document.body.classList.contains('player-full-win')) {
                    //console.log('window fullscreen')
                    document.body.style.overflow = 'hidden';
                } else {
                    //console.log('normal player')
                    document.body.style.overflow = 'auto';
                }
            }
        });
    });
    observer.observe(document.body, {
        attributes: true, //configure it to listen to attribute changes,
        attributeFilter: ['style', 'class']
    });
}

main();
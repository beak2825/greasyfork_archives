// ==UserScript==
// @name         EOL iFrame样式修正
// @namespace    http://terrace.ink/
// @version      0.1
// @description  修正落后的EOL系统中一些奇怪的样式
// @author       TerraceCN
// @match        http://eol.yzu.edu.cn/meol/*
// @icon         http://eol.yzu.edu.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446337/EOL%20iFrame%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/446337/EOL%20iFrame%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var mainFrame = document.getElementById("mainFrame");
    if (mainFrame) {
        mainFrame.setAttribute('scrolling', 'yes');
        mainFrame.style.height = '100vh';
    }

    const shareBoxObserver = new MutationObserver(function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            for (let node of mutation.addedNodes) {
                if (node?.className?.match(/bdshare.*/)) {
                    node.remove();
                }
            }
        }
    });
    shareBoxObserver.observe(document.body, { childList: true });

})();
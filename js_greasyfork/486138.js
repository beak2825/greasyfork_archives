// ==UserScript==
// @name         抖店订单页面自动刷新
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a refresh button to the top-left corner and automatically click a specified element every 10 seconds.
// @author       itsAnstar
// @match        https://fxg.jinritemai.com/ffa/morder/order/list*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486138/%E6%8A%96%E5%BA%97%E8%AE%A2%E5%8D%95%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/486138/%E6%8A%96%E5%BA%97%E8%AE%A2%E5%8D%95%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function createRefreshButton() {
        const refreshButton = document.createElement('button');
        refreshButton.setAttribute('type', 'button');
        refreshButton.setAttribute('class', 'auxo-btn auxo-btn-dashed auxo-btn-sm');
        refreshButton.innerText = 'Refresh';
        refreshButton.style.position = 'fixed';
        refreshButton.style.top = '10px';
        refreshButton.style.left = '10px';
        refreshButton.addEventListener('click', handleClick);
        document.body.appendChild(refreshButton);
    }

    function handleClick() {
        const targetElement = document.querySelector('button.auxo-btn.auxo-btn-dashed.auxo-btn-sm');
        if (targetElement) {
            targetElement.click();
        }
    }

    function initScript() {
        createRefreshButton();


        setInterval(handleClick, 10000);
    }


    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initScript();
    } else {
        document.addEventListener('DOMContentLoaded', initScript);
    }

})();

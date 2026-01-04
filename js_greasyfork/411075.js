// ==UserScript==
// @name         自动刷新页面脚本
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411075/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/411075/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

function getInterval() {
    
    let nowInterval = sessionStorage.getItem(window.location.href
        +'refreshInterval');
       
    nowInterval = parseInt(nowInterval, 10);

    return nowInterval;
}

(function() {
    'use strict';

    let nowInterval = getInterval();

    let refresh_handler;
    if (nowInterval) {

        refresh_handler = setTimeout(_ => {
            window.location.reload();
        }, parseInt(nowInterval));
    } else {

        setInterval(_ => {

            if (getInterval()) {
                refresh_handler = setTimeout(_ => {
                    window.location.reload();
                }, parseInt(nowInterval));
            }
        }, 1000)
    }

    let div = document.createElement('div');

    div.innerHTML = '<div id="haichuanlu_refresh" style="position: fixed; bottom: 10%; right: 10%; "><input id="haichuanlu_input" type="text"></input> <button id="haichuanlu_start">开始刷新</button> <button id="haichuanlu_stop">停止刷新</button><div>';

    document.body.appendChild(div);

    document.getElementById('haichuanlu_start').onclick = function() {

        let interval = document.getElementById('haichuanlu_input').value;

        interval = parseInt(interval, 10);

        sessionStorage.setItem(window.location.href
 + "refreshInterval", interval);

        window.location.reload();

    };

    document.getElementById('haichuanlu_stop').onclick = function() {

        sessionStorage.removeItem(window.location.href + "refreshInterval");
    }

})();
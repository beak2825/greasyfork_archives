// ==UserScript==
// @name         天使动漫TSDM签到打工
// @version      1.0
// @description  签到和打工
// @author       nyutros
// @license      MIT
// @match        https://tsdm39.com/forum.php
// @match        https://tsdm39.com/plugin.php?id=np_cliworkdz:work
// @run-at       document-end
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1484659
// @downloadURL https://update.greasyfork.org/scripts/539791/%E5%A4%A9%E4%BD%BF%E5%8A%A8%E6%BC%ABTSDM%E7%AD%BE%E5%88%B0%E6%89%93%E5%B7%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/539791/%E5%A4%A9%E4%BD%BF%E5%8A%A8%E6%BC%ABTSDM%E7%AD%BE%E5%88%B0%E6%89%93%E5%B7%A5.meta.js
// ==/UserScript==

GM_addStyle(`
.mybutton {
    height: 25px;
    width: 40%;
    line-height: 25px;
    border: 0;
    margin: 0 10px 0 0;
    padding: 0;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: bold;
    color: white;
    background-color: #3e87ec;
    border-radius: 0.25rem;
    transition: background-color 0.2s ease;
    user-select: none;
}
.mybutton:hover {
    background-color: #3571c8;
}
.mybutton:disabled {
    background-color: #999;
    cursor: not-allowed;
}
#btnContainer {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 99999;
    display: flex;
    justify-content: flex-end;
    background: rgba(0,0,0,0.15);
    padding: 5px 10px;
    border-radius: 8px;
}
`);

(function() {
    'use strict';

    const loc = window.location;

    if(loc.pathname === "/forum.php") {
        const container = document.createElement('div');
        container.id = 'btnContainer';

        const btnCheck = document.createElement('button');
        btnCheck.className = 'mybutton';
        btnCheck.textContent = '签到';
        btnCheck.onclick = function() {
            showWindow("dsu_paulsign", "plugin.php?id=dsu_paulsign:sign&616cdca8");
            setTimeout(() => {
                Icon_selected("kx");
                const todaysay = document.getElementById("todaysay");
                if(todaysay) todaysay.value = "嘻嘻嘻嘻";
                showWindow('qwindow', 'qiandao', 'post', '0');
            }, 2000);
        };

        const btnWork = document.createElement('button');
        btnWork.className = 'mybutton';
        btnWork.textContent = '打工';
        btnWork.onclick = function() {
            window.location.href = "https://tsdm39.com/plugin.php?id=np_cliworkdz:work";
        };

        container.appendChild(btnCheck);
        container.appendChild(btnWork);
        document.body.appendChild(container);

    } else if(loc.pathname === "/plugin.php" && loc.search.includes("id=np_cliworkdz:work")) {
        jQuery(document).ready(function($){
            setTimeout(() => { $('#advids div:eq(0) a').click(); }, 300);
            setTimeout(() => { $('#advids div:eq(1) a').click(); }, 600);
            setTimeout(() => { $('#advids div:eq(2) a').click(); }, 900);
            setTimeout(() => { $('#advids div:eq(3) a').click(); }, 1200);
            setTimeout(() => { $('#advids div:eq(4) a').click(); }, 1500);
            setTimeout(() => { $('#advids div:eq(5) a').click(); }, 1800);
            setTimeout(() => { $('#stopad a').click(); }, 2000);
        });
    }
})();
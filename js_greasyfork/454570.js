// ==UserScript==
// @name         MEST SCD Overlay
// @namespace    joyings.com.cn
// @version      0.6.2
// @description  fast switch account cookies
// @author       zmz125000
// @match        http://*/mest/*
// @icon         http://www.google.com/s2/favicons?domain=openwrt.org
// @grant        none
// @license      MIT
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/454570/MEST%20SCD%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/454570/MEST%20SCD%20Overlay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function insertDiv() {
        var ul = document.createElement('ul');
        ul.setAttribute('style', 'vertical-align: middle');
        ul.className = 'overlay is-link';

        var panelDiv = document.createElement('li');
        panelDiv.className = 'parent';
        panelDiv.id = 'helper_overlay';
        panelDiv.setAttribute("style", "z-index: 100000; margin-right: 10px;");

        let a = document.createElement('span');
        a.innerHTML = "选择报工产品";
        panelDiv.appendChild(a);
        ul.appendChild(panelDiv);

        while (!$('[class="user"]')[0]) {
            await sleep(200);
        }
        $('[class="user"]')[0].prepend(ul);

        var data = loadData();
        if (data['record'] && data['record']['customers']) {
            updateOverlay(data);
        }
        getLatestSCD();
    }

    function getLatestSCD() {
        fetch('https://api.jsonbin.io/v3/b/636b64a10e6a79321e444fe8/latest')
            .then((response) =>
                response.json()
            )
            .then((data) => {
                updateOverlay(data);
                saveData(data);
                return data;
            })
            .catch(console.error);
    }

    function updateOverlay(data) {
        if ($('ul', $('#helper_overlay')[0])[0]) {
            $('#helper_overlay')[0].removeChild($('ul', $('#helper_overlay')[0])[0]);
        }
        var topUL = document.createElement('ul');
        topUL.className = "child";
        $('#helper_overlay')[0].appendChild(topUL);
        var customersArray = data['record']['customers'];
        for (let customer of customersArray) {
            let cElm = document.createElement('li');
            cElm.className = "parent";
            cElm.innerText = customer['name'];
            // osElm customer 下的 orders
            let osElm = document.createElement('ul');
            osElm.className = "child orderList";
            cElm.appendChild(osElm);
            topUL.appendChild(cElm);
            for (let order of customer['orders']) {
                let oElm = document.createElement('li');
                oElm.className = "parent";
                oElm.innerText = order['order'];
                oElm.onclick = function () {
                    if (document.querySelector('[placeholder*="订单号"]')) {
                        document.querySelector('[placeholder*="订单号"]').value = order['order'];
                        document.querySelector('[placeholder*="订单号"]').dispatchEvent(new Event('input', {
                            bubbles: true
                        }));
                    }
                    if (document.querySelector('[placeholder*="生产单号"]')) {
                        document.querySelector('[placeholder*="生产单号"]').value = '';
                        document.querySelector('[placeholder*="生产单号"]').dispatchEvent(new Event('input', {
                            bubbles: true
                        }));
                    } else if (document.querySelector('[placeholder*="商品名称、编码、别名"]')) {
                        document.querySelector('[placeholder*="商品名称、编码、别名"]').value = '';
                        document.querySelector('[placeholder*="商品名称、编码、别名"]').dispatchEvent(new Event('input', {
                            bubbles: true
                        }));
                    }
                    let sbtn = null;
                    if ($('button:contains("查询")')[0]) {
                        sbtn = $('button:contains("查询")')[0];
                    } else if ($('button:contains("搜索")')[0]) {
                        sbtn = $('button:contains("搜索")')[0];
                    } else if ($('button:contains("搜 索")')[0]) {
                        sbtn = $('button:contains("搜 索")')[0];
                    }
                    if (sbtn) {
                        sbtn.click();
                    }
                }
                // scdsElm order 下的 scds
                let scdsElm = document.createElement('div');
                scdsElm.className = "grid-container";
                oElm.appendChild(scdsElm);
                osElm.appendChild(oElm);
                for (let scd of order['SCDs']) {
                    let sElm = document.createElement('div');
                    sElm.setAttribute("data-scd", scd['SCD']);
                    sElm.onclick = function () {
                        event.stopPropagation();
                        if (document.querySelector('[placeholder*="订单号"]')) {
                            document.querySelector('[placeholder*="订单号"]').value = order['order'];
                            document.querySelector('[placeholder*="订单号"]').dispatchEvent(new Event('input', {
                                bubbles: true
                            }));
                        }
                        if (document.querySelector('[placeholder*="生产单号"]')) {
                            document.querySelector('[placeholder*="生产单号"]').value = scd['SCD'];
                            document.querySelector('[placeholder*="生产单号"]').dispatchEvent(new Event('input', {
                                bubbles: true
                            }));
                        } else if (document.querySelector('[placeholder*="商品名称、编码、别名"]')) {
                            document.querySelector('[placeholder*="商品名称、编码、别名"]').value = scd['productCode'];
                            document.querySelector('[placeholder*="商品名称、编码、别名"]').dispatchEvent(new Event('input', {
                                bubbles: true
                            }));
                        }
                        let sbtn = null;
                        if ($('button:contains("查询")')[0]) {
                            sbtn = $('button:contains("查询")')[0];
                        } else if ($('button:contains("搜索")')[0]) {
                            sbtn = $('button:contains("搜索")')[0];
                        } else if ($('button:contains("搜 索")')[0]) {
                            sbtn = $('button:contains("搜 索")')[0];
                        }
                        if (sbtn) {
                            sbtn.click();
                        }
                    }
                    sElm.innerText = scd['productName'].includes(scd['productAlias']) ? scd['productName'] : scd['productAlias'] + ' ' + scd['productName'];;
                    scdsElm.appendChild(sElm);
                }
            }
        }
    }

    // 保存 读取 导入 切换 删除cookie
    // cookieData={ name:cookie,...}
    function loadData() {
        try {
            return JSON.parse(localStorage["scdjson"]);
        } catch (e) {
            localStorage["scdjson"] = null;
            return {};
        }
    }

    function saveData(data) {
        localStorage["scdjson"] = JSON.stringify(data);
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) {
            return;
        }
        style = document.createElement('style');
        // style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    // init
    insertDiv();
    addGlobalStyle(`
    .parent {
        padding: 10px;
        display: block;
        position: relative;
        float: right;
        background-color: #4FA0D8;
        border-left: #CCC 1px solid;
        border-radius: 5px;
    }

    .parent span {
        color: #FFFFFF;
        text-decoration: none;
    }

    .parent:hover>ul {
        display: block;
        position: absolute;
    }

    .child {
        display: none;
    }

    .child li {
        padding: 10px;
        background-color: #E4EFF7;
        border: #CCC 1px solid;
        width: 100%;
        break-inside: avoid;
        border-radius: 5px;
        color: #000000;
        font-size: medium;
        break-inside: avoid;
    }

    .orderList {
        overflow-y: auto;
        max-height:80vh;
    }

    .overlay::-webkit-scrollbar {
        display: none;
    }

    .overlay ul {
        float: right;
        list-style: none;
        margin: 0;
        padding: 0px;
        min-width: 10em;
        width: fit-content;
        break-inside: avoid;
    }

    .overlay .grid-container {
        margin-top: 5px;
        display: grid;
        grid-template-columns: auto auto auto auto;
        grid-gap: 10px;
        background-color: #2196F3;
        padding: 8px;
        border-radius: 5px;
    }

    .overlay .grid-container>div {
        background-color: rgba(255, 255, 255, 0.8);
        text-align: center;
        padding: 5px;
        width: 8em;
        height: auto;
        min-height: 2em;
        border-radius: 5px;
        cursor: pointer;
        overflow: hidden;
        color: #000000;
        box-shadow: 0 3px #999;
    }

    .overlay .grid-container>div:hover {
        background-color: #72b374
    }

    .overlay .grid-container>div:active {
        background-color: #3b693d;
        box-shadow: 0 1px #666;
        transform: translateY(4px);
    }

    ul ul ul {
        right: 100%;
        top: 0;
    }

    .overlay li:hover {
        background-color: #95B4CA;
        break-inside: avoid;
    }

    .parent li:hover {
        background-color: #F0F0F0;
    }
    `);
})();
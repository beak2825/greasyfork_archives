// ==UserScript==
// @name         MEST Custon Report
// @namespace    joyings.com.cn
// @version      2.5.5
// @description  美尔斯通报表上传打印
// @author       zmz125000
// @match       http://*/mest/*
// @icon          http://www.google.com/s2/favicons?domain=openwrt.org
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/453348/MEST%20Custon%20Report.user.js
// @updateURL https://update.greasyfork.org/scripts/453348/MEST%20Custon%20Report.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    addPrintButtons();
    window.fastPrint = false;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function unsecuredCopyToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Unable to copy to clipboard', err);
        }
        document.body.removeChild(textArea);
    }

    // 添加按钮、快速复制文本

    async function addPrintButtons() {
        if (!$('div[class="el-tabs__item is-top is-active is-closable"]:contains("自定义报表")')[0] || !$('input[placeholder="输入关键字进行过滤"]')[0]) {
            await sleep(500);
            addPrintButtons();
            return;
        }
        if ($('[role="group"]')[0]) {
            for (let elm of $('[class="custom-tree-node"]', $('[role="group"]')[0])) {
                if (!elm.hasAttribute('helper')) {
                    elm.addEventListener('click', async function () {
                        await sleep(100);
                        // 设为100条
                        while (!$('[class="el-scrollbar__view el-select-dropdown__list"]')[0]) {
                            await sleep(50);
                        }
                        $('li', $('[class="el-scrollbar__view el-select-dropdown__list"]')).last().click()
                        await sleep(100);
                        while ($('[class="el-loading-mask"]')[0] && $('[class="el-loading-mask"]')[0].getAttribute("style") == 'display: none;') {
                            await sleep(100);
                        }
                        while (!$('tbody')[0]) {
                            await sleep(100);
                        }
                        // 自动复制
                        if (!$('tbody')[0].hasAttribute('helper')) {
                            $('tbody')[0].addEventListener('click', function (e) {
                                const cell = e.target.closest('td');
                                if (cell) {
                                    let headerText = $('[class="has-gutter"]')[0].rows.item(0).cells.item(cell.cellIndex).firstChild.textContent;
                                    let sval = cell.childNodes[0].innerText;
                                    unsecuredCopyToClipboard(sval);
                                    setInput(headerText, sval);
                                }
                            });
                            $('tbody')[0].setAttribute('helper', true);
                        }
                        elm.setAttribute('helper', true);
                    })
                }
            }
        }

        if (!$('button:contains("打印")')[0]) {
            let btnRow = $('button:contains("导出")')[0].parentElement;
            var btn = document.createElement('button');
            btn.setAttribute('id', 'printMaterialBtn');
            btn.setAttribute('type', 'button');
            btn.onclick = generateMaterial;
            btn.appendChild(document.createTextNode('打印排料单'));

            var btn2 = document.createElement('button');
            btn2.setAttribute('id', 'printTableBtn');
            btn2.setAttribute('title', '同种物料合并计数');
            btn2.setAttribute('type', 'button');
            btn2.onclick = generateSumTable;
            btn2.appendChild(document.createTextNode('打印备料单'));

            var btn3 = document.createElement('button');
            btn3.setAttribute('type', 'button');
            btn3.onclick = generateAndPrint;
            btn3.appendChild(document.createTextNode('打印生产单'));

            var btn4 = document.createElement('button');
            btn4.setAttribute('type', 'button');
            btn4.onclick = uploadProcessReport;
            btn4.appendChild(document.createTextNode('上传报工单'));

            var btn6 = document.createElement('button');
            btn6.setAttribute('type', 'button');
            btn6.onclick = uploadMaterialList;
            btn6.appendChild(document.createTextNode('上传出入库单'));

            var btn5 = document.createElement('button');
            btn5.setAttribute('type', 'button');
            btn5.onclick = generatePurchase;
            btn5.appendChild(document.createTextNode('打印采购单'));

            var btn8 = document.createElement('button');
            btn8.setAttribute('title', '快速打印');
            btn8.setAttribute('id', 'fastPrintBtn');
            btn8.setAttribute('type', 'button');
            btn8.onclick = toggleFastPrint;
            btn8.appendChild(document.createTextNode(window.fastPrint ? "✔" : "✘"));

            btnRow.appendChild(btn);
            btnRow.appendChild(btn3);
            btnRow.appendChild(btn5);
            btnRow.appendChild(btn2);
            btnRow.appendChild(btn4);
            btnRow.appendChild(btn6);
            btnRow.appendChild(btn8);
        }
        if ($('button:contains("重置")')[0] && !$('button:contains("重置")')[0].hasAttribute('helper')) {
            $('button:contains("重置")')[0].addEventListener('click', async function (e) {
                if ($('[class="el-tree-node is-expanded is-current is-focusable"]')[0]) {
                    $('[class="el-tree-node is-expanded is-current is-focusable"]')[0].click();
                }
                await sleep(100);
                while (!$('tbody')[0]) {
                    await sleep(100);
                }
                // 自动复制
                if (!$('tbody')[0].hasAttribute('helper')) {
                    $('tbody')[0].addEventListener('click', function (e) {
                        const cell = e.target.closest('td');
                        if (cell) {
                            let headerText = $('[class="has-gutter"]')[0].rows.item(0).cells.item(cell.cellIndex).firstChild.textContent;
                            let sval = cell.childNodes[0].innerText;
                            unsecuredCopyToClipboard(sval);
                            setInput(headerText, sval);
                        }
                    });
                    $('tbody')[0].setAttribute('helper', true);
                }
            })
            $('button:contains("重置")')[0].setAttribute('helper', true);
        }
        await sleep(500);
        addPrintButtons();
    }

    function setInput(label, value) {
        if ($('label:contains(' + label + ')')[0]) {
            $('input', $('label:contains(' + label + ')')[0].nextSibling)[0].value = value;
            $('input', $('label:contains(' + label + ')')[0].nextSibling)[0].dispatchEvent(new Event('input', {
                bubbles: true
            }));
        }
    }

    function toggleFastPrint() {
        if (window.fastPrint) {
            window.fastPrint = false;
            document.getElementById("fastPrintBtn").firstChild.nodeValue = "✘";
        } else {
            window.fastPrint = true;
            document.getElementById("fastPrintBtn").firstChild.nodeValue = "✔";
        }
    }

    async function getFullTable(index) {
        var tbody = document.createElement('table');
        let nextBodyRows = $('tr', $('tbody')[0]);
        for (let tr of nextBodyRows) {
            tbody.appendChild(tr.cloneNode(true));
        }
        // 主键所在列
        let i = index;
        if (!index) {
            i = 2
        }
        var oldValue = $('div', $('tbody')[0].rows.item(0).cells.item(i))[0].textContent;
        while (!$('[class="btn-next"]')[0].getAttribute("disabled")) {
            $('[class="btn-next"]')[0].click();
            await sleep(100);
            while ($('div', $('tbody')[0].rows.item(0).cells.item(i))[0].textContent == oldValue) {
                await sleep(100);
            }
            let nextBodyRows = $('tr', $('tbody')[0]);
            for (let tr of nextBodyRows) {
                tbody.appendChild(tr.cloneNode(true));
            }
            oldValue = $('div', $('tbody')[0].rows.item(0).cells.item(i))[0].textContent;
        }
        return tbody;
    }

    // 上传SCD数据
    async function uploadProcessReport() {
        const customerIndex = $('th:contains("客户名")')[0].cellIndex;
        const orderNoIndex = $('th:contains("订单号")')[0].cellIndex;
        const aliasIndex = $('th:contains("别名")')[0].cellIndex;
        const productNameIndex = $('th:contains("产品名")')[0].cellIndex;
        const productCodeIndex = $('th:contains("编码")')[0].cellIndex;
        const SCDIndex = $('th:contains("生产单")')[0].cellIndex;
        const createDateIndex = $('th:contains("订单日期")')[0].cellIndex;

        var tbody = null;
        await getFullTable(SCDIndex).then(t => {
            tbody = t;
        })

        var bodyRows = tbody.rows;
        var lastCustomer = bodyRows.item(0).cells.item(customerIndex).textContent;
        var lastOrder = bodyRows.item(0).cells.item(orderNoIndex).textContent;
        var object = {
            customers: [{
                "name": lastCustomer,
                "orders": [{
                    "order": lastOrder,
                    "SCDs": []
                }]
            }]
        };
        var objC = object.customers
        var customerArrayIndex = 0;
        var orderArrayIndex = 0;
        for (let row of bodyRows) {
            if (row.cells.item(customerIndex).textContent != lastCustomer) {
                customerArrayIndex = objC.push({
                    "name": row.cells.item(customerIndex).textContent,
                    "orders": []
                }) - 1;
                lastCustomer = row.cells.item(customerIndex).textContent;
            }
            if (row.cells.item(orderNoIndex).textContent != lastOrder) {
                orderArrayIndex = objC[customerArrayIndex]['orders'].push({
                    "order": row.cells.item(orderNoIndex).textContent,
                    "SCDs": []
                }) - 1;
                lastOrder = row.cells.item(orderNoIndex).textContent;
            }
            objC[customerArrayIndex]['orders'][orderArrayIndex]['SCDs'].push({
                'SCD': row.cells.item(SCDIndex).textContent,
                "productCode": row.cells.item(productCodeIndex).textContent,
                "productName": row.cells.item(productNameIndex).textContent,
                "productAlias": row.cells.item(aliasIndex).textContent
            })
        }
        console.log(object);
        var myJSONString = JSON.stringify(object);
        var myEscapedJSONString = myJSONString.replace(/\\n/g, "\\n")
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, "\\&")
            .replace(/\\r/g, "\\r")
            .replace(/\\t/g, "\\t")
            .replace(/\\b/g, "\\b")
            .replace(/\\f/g, "\\f");
        (async () => {
            const rawResponse = await fetch('https://api.jsonbin.io/v3/b/636b64a10e6a79321e444fe8', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: myEscapedJSONString
            });
            const content = await rawResponse.json();
            alert(JSON.stringify(content));
        })();
    }

    // 上传物料数据
    async function uploadMaterialList() {
        const orderNoIndex = $('th:contains("订单号")')[0].cellIndex;
        const customerIndex = $('th:contains("客户名")')[0].cellIndex;
        // 物料
        const materialCodeIndex = $('th:contains("物料编码")')[0].cellIndex;
        const materialNameIndex = $('th:contains("物料名")')[0].cellIndex;
        const materialAliasIndex = $('th:contains("物料别名")')[0].cellIndex;
        const materialSpecsIndex = $('th:contains("物料规格")')[0].cellIndex;
        const processIndex = $('th:contains("用途")')[0].cellIndex;

        var tbody = null;
        await getFullTable(materialCodeIndex).then(t => {
            tbody = t;
        })

        var bodyRows = tbody.rows;
        var lastOrder = bodyRows.item(0).cells.item(orderNoIndex).textContent;
        var lastCustomer = bodyRows.item(0).cells.item(customerIndex).textContent;
        var object = {
            "material": [],
            "orders": [{
                "order": lastOrder,
                "customer": lastCustomer,
                "material": []
            }]
        };
        var objO = object.orders;
        var objM = object.material;
        var orderArrayIndex = 0;
        var matCodeArray = [];
        for (let row of bodyRows) {
            if (row.cells.item(orderNoIndex).textContent != lastOrder) {
                orderArrayIndex = objO.push({
                    "order": row.cells.item(orderNoIndex).textContent,
                    "customer": row.cells.item(customerIndex).textContent,
                    "material": []
                }) - 1;
                lastOrder = row.cells.item(orderNoIndex).textContent;
            }
            let i = "material";
            if (row.cells.item(processIndex).textContent == "包装") {
                i = "packaging";
            }
            if (!matCodeArray.includes(row.cells.item(materialCodeIndex).textContent)) {
                matCodeArray.push(row.cells.item(materialCodeIndex).textContent);
                objM.push({
                    "type": i,
                    "code": row.cells.item(materialCodeIndex).textContent,
                    "name": row.cells.item(materialNameIndex).textContent,
                    "alias": row.cells.item(materialAliasIndex).textContent,
                    "specs": row.cells.item(materialSpecsIndex).textContent,
                })
            }
            objO[orderArrayIndex]['material'].push({
                "type": i,
                "code": row.cells.item(materialCodeIndex).textContent,
                "name": row.cells.item(materialNameIndex).textContent,
                "alias": row.cells.item(materialAliasIndex).textContent,
                "specs": row.cells.item(materialSpecsIndex).textContent,
            }) - 1;
        }
        console.log(object);
        var myJSONString = JSON.stringify(object);
        var myEscapedJSONString = myJSONString.replace(/\\n/g, "\\n")
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, "\\&")
            .replace(/\\r/g, "\\r")
            .replace(/\\t/g, "\\t")
            .replace(/\\b/g, "\\b")
            .replace(/\\f/g, "\\f");
        (async () => {
            const rawResponse = await fetch('https://api.jsonbin.io/v3/b/637eceb165b57a31e6c15f19', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: myEscapedJSONString
            });
            const content = await rawResponse.json();
            alert(JSON.stringify(content));
        })();
    }


    // 打印采购单
    async function generatePurchase() {
        if (!$('input', $('label:contains("订单号")')[0].nextSibling)[0].value) {
            alert("未输入订单号/生产单号/产品编号/产品名，请先设置至少一项筛选条件");
            return;
        }
        const orderNoIndex = $('th:contains("订单号")')[0].cellIndex;
        const customerIndex = $('th:contains("客户名")')[0].cellIndex;
        const billDateIndex = $('th:contains("单据日期")')[0].cellIndex;
        const billDeliveryIndex = $('th:contains("发货日期")')[0].cellIndex;
        // 物料
        const materialCodeIndex = $('th:contains("物料编码")')[0].cellIndex;
        const materialNameIndex = $('th:contains("物料名")')[0].cellIndex;
        const materialAliasIndex = $('th:contains("物料别名")')[0].cellIndex;
        const materialSpecsIndex = $('th:contains("物料规格")')[0].cellIndex;
        const materialQIndex = $('th:contains("订单用量")')[0].cellIndex;
        const materialUnitIndex = $('th:contains("计量单位")')[0].cellIndex;
        const processIndex = $('th:contains("用途")')[0].cellIndex;
        const wareHouseIndex = $('th:contains("库存量")')[0].cellIndex;
        const usedIndex = $('th:contains("材料未出库")')[0].cellIndex;
        const onwayIndex = $('th:contains("采购未入库")')[0].cellIndex;

        var tbody = null;
        await getFullTable(materialCodeIndex).then(t => {
            tbody = t;
        })

        var bodyRows = tbody.rows;
        let map = new Map();
        let trCells = tbody.rows.item(0).cells;

        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        // 原料采购单
        let w = null;
        let iframe = null;
        if (window.fastPrint) {
            iframe = document.createElement('iframe');
            document.body.appendChild(iframe);
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(purchaseTemplate);
            w = iframe.contentWindow;
        } else {
            w = window.open();
            w.document.write(purchaseTemplate);
            w.document.getElementById("download").setAttribute('download', trCells.item(orderNoIndex).textContent + '-' + "原料采购计划" + '-' + date + ".html");
        }

        map.set('orderNo', trCells.item(orderNoIndex));
        map.set('orderDate', trCells.item(billDateIndex));
        map.set('deliveryDate', trCells.item(billDeliveryIndex));
        map.set('OCellA', trCells.item(orderNoIndex));
        map.set('OCellB', trCells.item(orderNoIndex));
        for (let item of map) {
            if ($('#' + item[0], w.document)[0]) {
                $('#' + item[0], w.document)[0].textContent = $('div', item[1])[0].textContent;
            }
        }
        // 填信息
        $('#printTime', w.document)[0].textContent = date + ' ' + time;


        // 包装采购单
        let w1 = null;
        let iframe1 = null;
        if (window.fastPrint) {
            iframe1 = document.createElement('iframe');
            document.body.appendChild(iframe1);
            iframe1.contentWindow.document.open();
            iframe1.contentWindow.document.write(w.document.documentElement.innerHTML);
            w1 = iframe1.contentWindow;
        } else {
            w1 = window.open();
            w1.document.write(w.document.documentElement.innerHTML);
            w1.document.getElementById("download").setAttribute('download', trCells.item(orderNoIndex).textContent + '-' + "包装采购计划" + '-' + date + ".html");
        }
        new QRCode($('#SCDQR', w.document)[0], {
            text: trCells.item(orderNoIndex).textContent,
            width: 144,
            height: 144
        });

        new QRCode($('#SCDQR', w1.document)[0], {
            text: trCells.item(orderNoIndex).textContent,
            width: 144,
            height: 144
        });
        w1.document.getElementById('title').textContent = "包装采购计划";

        // 原料表
        var materialTable = $('#materialTable', w.document)[0];
        // 工艺表指针
        var wIndex = 1;
        // 物料表指针
        var mIndex = 1;
        // 表体序号
        var tIndex = 1;
        let name = '';
        let lastName = '';
        let cell0 = null;

        // 物料表
        var materialTable1 = $('#materialTable', w1.document)[0];
        // 工艺表指针
        var wIndex1 = 1;
        // 物料表指针
        var mIndex1 = 1;
        // 表体序号
        var tIndex1 = 1;
        let name1 = '';
        let lastName1 = '';
        let cell01 = null;
        for (let row of bodyRows) {
            let materialCode = $('div', row.cells.item(materialCodeIndex))[0].textContent;
            let process = $('div', row.cells.item(processIndex))[0].textContent;
            if (process != '包装' && !materialCode.startsWith('00-')) {
                name = $('div', row.cells.item(materialNameIndex))[0].textContent;
                const cells = row.cells;
                let tr = materialTable.insertRow(wIndex++);

                let i = 0;
                tr.insertCell(i++).innerHTML = tIndex++;
                if (tr.rowIndex == 1) {
                    cell0 = tr.insertCell(i++);
                    cell0.innerHTML = name;
                } else
                if (name == lastName) {
                    cell0.setAttribute('rowspan', ++mIndex);
                } else {
                    mIndex = 1;
                    cell0 = tr.insertCell(i++);
                    cell0.innerHTML = name;
                }
                tr.insertCell(i++).innerHTML = cells.item(materialSpecsIndex).textContent;
                tr.insertCell(i++).innerHTML = cells.item(wareHouseIndex).textContent;
                tr.insertCell(i++).innerHTML = cells.item(usedIndex).textContent;
                tr.insertCell(i++).innerHTML = cells.item(onwayIndex).textContent;
                tr.insertCell(i++).innerHTML = cells.item(materialQIndex).textContent;
                let remaining = parseFloat(cells.item(wareHouseIndex).textContent) - parseFloat(cells.item(materialQIndex).textContent) - parseFloat(cells.item(usedIndex).textContent) + parseFloat(cells.item(onwayIndex).textContent);
                if (remaining >= 0) {
                    tr.insertCell(i++).innerHTML = '0';
                } else {
                    let x = Math.abs(remaining) > parseFloat(cells.item(materialQIndex).textContent) ? cells.item(materialQIndex).textContent : Math.abs(remaining);
                    tr.insertCell(i++).innerHTML = Math.ceil(x);
                }
                tr.insertCell(i++).innerHTML = cells.item(materialUnitIndex).textContent
                lastName = name;
            }
            if (process == '包装' || materialCode.startsWith('01-012')) {
                name1 = $('div', row.cells.item(materialNameIndex))[0].textContent;
                const cells = row.cells;
                let tr = materialTable1.insertRow(wIndex1++);

                let i = 0;
                tr.insertCell(i++).innerHTML = tIndex1++;
                if (tr.rowIndex == 1) {
                    cell0 = tr.insertCell(i++);
                    cell0.innerHTML = name1;
                } else
                if (name1 == lastName1) {
                    cell01.setAttribute('rowspan', ++mIndex1);
                } else {
                    mIndex1 = 1;
                    cell01 = tr.insertCell(i++);
                    cell01.innerHTML = name1;
                }
                tr.insertCell(i++).innerHTML = cells.item(materialSpecsIndex).textContent;
                tr.insertCell(i++).innerHTML = cells.item(wareHouseIndex).textContent;
                tr.insertCell(i++).innerHTML = cells.item(usedIndex).textContent;
                // tr.insertCell(i++).innerHTML = available % 1 == 0 ? available : Number(available).toFixed(2);
                tr.insertCell(i++).innerHTML = cells.item(onwayIndex).textContent;
                tr.insertCell(i++).innerHTML = cells.item(materialQIndex).textContent;
                let remaining = parseFloat(cells.item(wareHouseIndex).textContent) - parseFloat(cells.item(materialQIndex).textContent) - parseFloat(cells.item(usedIndex).textContent) + parseFloat(cells.item(onwayIndex).textContent);
                if (remaining >= 0) {
                    tr.insertCell(i++).innerHTML = '0';
                } else {
                    let x = Math.abs(remaining) > parseFloat(cells.item(materialQIndex).textContent) ? cells.item(materialQIndex).textContent : Math.abs(remaining);
                    tr.insertCell(i++).innerHTML = Math.ceil(x);
                }
                tr.insertCell(i++).innerHTML = cells.item(materialUnitIndex).textContent
                lastName1 = name1;
            }
        }

        await sleep(100);
        if (w.document.getElementById("download").hasAttribute('download')) {
            w.document.getElementById("download").click();
        }
        if (w1.document.getElementById("download").hasAttribute('download')) {
            w1.document.getElementById("download").click();
        }
        if (window.fastPrint) {
            w.print();
            w1.print();
            w.close();
            w1.close();
            document.body.removeChild(iframe);
            document.body.removeChild(iframe1);
        }
    }
    // 打印备料单
    async function generateSumTable() {
        if (!$('input', $('label:contains("订单号")')[0].nextSibling)[0].value) {
            alert("未输入订单号/生产单号/产品编号/产品名，请先设置至少一项筛选条件");
            return;
        }
        const orderNoIndex = $('th:contains("订单号")')[0].cellIndex;
        const customerIndex = $('th:contains("客户名")')[0].cellIndex;
        const billDateIndex = $('th:contains("单据日期")')[0].cellIndex;
        const billDeliveryIndex = $('th:contains("发货日期")')[0].cellIndex;
        // 物料
        const materialCodeIndex = $('th:contains("物料编码")')[0].cellIndex;
        const materialNameIndex = $('th:contains("物料名")')[0].cellIndex;
        const materialAliasIndex = $('th:contains("物料别名")')[0].cellIndex;
        const materialSpecsIndex = $('th:contains("物料规格")')[0].cellIndex;
        const materialQIndex = $('th:contains("订单用量")')[0].cellIndex;
        const materialUnitIndex = $('th:contains("计量单位")')[0].cellIndex;
        const processIndex = $('th:contains("用途")')[0].cellIndex;
        const wareHouseIndex = $('th:contains("库存量")')[0].cellIndex;
        const usedIndex = $('th:contains("材料未出库")')[0].cellIndex;
        const onwayIndex = $('th:contains("采购未入库")')[0].cellIndex;

        var tbody = null;
        await getFullTable(materialCodeIndex).then(t => {
            tbody = t;
        })

        var bodyRows = tbody.rows;
        let map = new Map();
        let trCells = tbody.rows.item(0).cells;

        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        // 生产备料单
        let w = null;
        let iframe = null;
        if (window.fastPrint) {
            iframe = document.createElement('iframe');
            document.body.appendChild(iframe);
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(sumMaterialTemplate);
            w = iframe.contentWindow;
        } else {
            w = window.open();
            w.document.write(sumMaterialTemplate);
            w.document.getElementById("download").setAttribute('download', trCells.item(orderNoIndex).textContent + '-' + "生产备料单" + '-' + date + ".html");
        }

        map.set('orderNo', trCells.item(orderNoIndex));
        map.set('orderDate', trCells.item(billDateIndex));
        map.set('deliveryDate', trCells.item(billDeliveryIndex));
        map.set('OCellA', trCells.item(orderNoIndex));
        map.set('OCellB', trCells.item(orderNoIndex));
        for (let item of map) {
            if ($('#' + item[0], w.document)[0]) {
                $('#' + item[0], w.document)[0].textContent = $('div', item[1])[0].textContent;
            }
        }
        // 填信息
        $('#printTime', w.document)[0].textContent = date + ' ' + time;


        // 包装备料单
        let w1 = null;
        let iframe1 = null;
        if (window.fastPrint) {
            iframe1 = document.createElement('iframe');
            document.body.appendChild(iframe1);
            iframe1.contentWindow.document.open();
            iframe1.contentWindow.document.write(w.document.documentElement.innerHTML);
            w1 = iframe1.contentWindow;
        } else {
            w1 = window.open();
            w1.document.write(w.document.documentElement.innerHTML);
            w1.document.getElementById("download").setAttribute('download', trCells.item(orderNoIndex).textContent + '-' + "包装备料单" + '-' + date + ".html");
        }
        new QRCode($('#SCDQR', w.document)[0], {
            text: trCells.item(orderNoIndex).textContent,
            width: 144,
            height: 144
        });

        new QRCode($('#SCDQR', w1.document)[0], {
            text: trCells.item(orderNoIndex).textContent,
            width: 144,
            height: 144
        });
        w1.document.getElementById('title').textContent = "包装备料单";

        // 原料表
        var materialTable = $('#materialTable', w.document)[0];
        // 工艺表指针
        var wIndex = 1;
        // 物料表指针
        var mIndex = 1;
        // 表体序号
        var tIndex = 1;
        let name = '';
        let lastName = '';
        let cell0 = null;

        // 物料表
        var materialTable1 = $('#materialTable', w1.document)[0];
        // 工艺表指针
        var wIndex1 = 1;
        // 物料表指针
        var mIndex1 = 1;
        // 表体序号
        var tIndex1 = 1;
        let name1 = '';
        let lastName1 = '';
        let cell01 = null;
        for (let row of bodyRows) {
            let materialCode = $('div', row.cells.item(materialCodeIndex))[0].textContent;
            let process = $('div', row.cells.item(processIndex))[0].textContent;
            if (process != '包装' && !materialCode.startsWith('00-')) {
                name = $('div', row.cells.item(materialNameIndex))[0].textContent;
                const cells = row.cells;
                let tr = materialTable.insertRow(wIndex++);

                let i = 0;
                tr.insertCell(i++).innerHTML = tIndex++;
                tr.insertCell(i++).innerHTML = cells.item(materialCodeIndex).textContent;
                if (tr.rowIndex == 1) {
                    cell0 = tr.insertCell(i++);
                    cell0.innerHTML = name;
                } else
                if (name == lastName) {
                    cell0.setAttribute('rowspan', ++mIndex);
                } else {
                    mIndex = 1;
                    cell0 = tr.insertCell(i++);
                    cell0.innerHTML = name;
                }
                tr.insertCell(i++).innerHTML = cells.item(materialAliasIndex).textContent;
                tr.insertCell(i++).innerHTML = cells.item(materialSpecsIndex).textContent;
                if (materialCode.startsWith('00-') || materialCode.startsWith('01-012')) {
                    tr.insertCell(i++).innerHTML = '外购';
                } else {
                    tr.insertCell(i++).innerHTML = '';
                }
                tr.insertCell(i++).innerHTML = cells.item(materialQIndex).textContent;
                tr.insertCell(i++).innerHTML = cells.item(materialUnitIndex).textContent
                lastName = name;
            }
            if (process == '包装' || materialCode.startsWith('01-012')) {
                name1 = $('div', row.cells.item(materialNameIndex))[0].textContent;
                const cells = row.cells;
                let tr = materialTable1.insertRow(wIndex1++);

                let i = 0;
                tr.insertCell(i++).innerHTML = tIndex1++;
                tr.insertCell(i++).innerHTML = cells.item(materialCodeIndex).textContent;
                if (tr.rowIndex == 1) {
                    cell0 = tr.insertCell(i++);
                    cell0.innerHTML = name1;
                } else
                if (name1 == lastName1) {
                    cell01.setAttribute('rowspan', ++mIndex1);
                } else {
                    mIndex1 = 1;
                    cell01 = tr.insertCell(i++);
                    cell01.innerHTML = name1;
                }
                tr.insertCell(i++).innerHTML = cells.item(materialAliasIndex).textContent;
                tr.insertCell(i++).innerHTML = cells.item(materialSpecsIndex).textContent;
                if (materialCode.startsWith('01-012')) {
                    tr.insertCell(i++).innerHTML = '车件';
                } else {
                    tr.insertCell(i++).innerHTML = '';
                }
                tr.insertCell(i++).innerHTML = cells.item(materialQIndex).textContent;
                tr.insertCell(i++).innerHTML = cells.item(materialUnitIndex).textContent
                lastName1 = name1;
            }
        }

        await sleep(100);
        if (w.document.getElementById("download").hasAttribute('download')) {
            w.document.getElementById("download").click();
        }
        if (w1.document.getElementById("download").hasAttribute('download')) {
            w1.document.getElementById("download").click();
        }
        if (window.fastPrint) {
            w.print();
            w1.print();
            w.close();
            w1.close();
            document.body.removeChild(iframe);
            document.body.removeChild(iframe1);
        }
    }


    // 打印排料单
    async function generateMaterial() {
        if (!$('input', $('label:contains("订单号")')[0].nextSibling)[0].value && !$('input', $('label:contains("生产单号")')[0].nextSibling)[0].value && !$('input', $('label:contains("产品编码")')[0].nextSibling)[0].value && !$('input', $('label:contains("产品名")')[0].nextSibling)[0].value) {
            alert("未输入订单号/生产单号/产品编号/产品名，请先设置至少一项筛选条件");
            return;
        }
        const orderNoIndex = $('th:contains("订单号")')[0].cellIndex;
        const customerIndex = $('th:contains("客户名")')[0].cellIndex;
        const billDateIndex = $('th:contains("单据日期")')[0].cellIndex;
        const billDeliveryIndex = $('th:contains("发货日期")')[0].cellIndex;
        const productCodeIndex = $('th:contains("产品编码")')[0].cellIndex;
        const productNameIndex = $('th:contains("产品名")')[0].cellIndex;
        const productAliasIndex = $('th:contains("产品别名")')[0].cellIndex;
        const productSpecsIndex = $('th:contains("产品规格")')[0].cellIndex;
        const scdIndex = $('th:contains("生产单号")')[0].cellIndex;
        const orderQuantityIndex = $('th:contains("下单数")')[0].cellIndex;
        const processIndex = $('th:contains("工序名")')[0].cellIndex;
        const semiIndex = $('th:contains("工件名")')[0].cellIndex;
        const plannedQuantityIndex = $('th:contains("加工数")')[0].cellIndex;
        const productPlannedQuantityIndex = $('th:contains("生产数")')[0].cellIndex;
        const workshopIndex = $('th:contains("车间")')[0].cellIndex;
        const keyIndex = $('th:contains("主键")')[0].cellIndex;
        // 物料
        const materialCodeIndex = $('th:contains("物料编码")')[0].cellIndex;
        const materialNameIndex = $('th:contains("物料名")')[0].cellIndex;
        const materialAliasIndex = $('th:contains("物料别名")')[0].cellIndex;
        const materialSpecsIndex = $('th:contains("物料规格")')[0].cellIndex;
        const semiSpecsIndex = $('th:contains("工件尺寸")')[0].cellIndex;
        const materialQIndex = $('th:contains("领料数")')[0].cellIndex;
        const materialUnitIndex = $('th:contains("计量单位")')[0].cellIndex;

        var tbody = null;
        await getFullTable().then(t => {
            tbody = t;
        })

        var bodyRows = tbody.rows;
        let trCells = tbody.rows.item(0).cells;
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        let w = null;
        let iframe = null;
        if (window.fastPrint) {
            iframe = document.createElement('iframe');
            document.body.appendChild(iframe);
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(materialTemplate);
            w = iframe.contentWindow;
        } else {
            w = window.open();
            w.document.write(materialTemplate);
            w.document.getElementById("download").setAttribute('download', trCells.item(orderNoIndex).textContent + '-' + "生产排料单" + '-' + date + ".html");
        }
        let map = new Map();
        map.set('orderNo', trCells.item(orderNoIndex));
        map.set('SCD', trCells.item(scdIndex));
        map.set('SCDCell', trCells.item(scdIndex));
        map.set('orderQuantity', trCells.item(orderQuantityIndex));
        map.set('plannedQuantity', trCells.item(productPlannedQuantityIndex));
        map.set('orderDate', trCells.item(billDateIndex));
        map.set('deliveryDate', trCells.item(billDeliveryIndex));
        map.set('OCellA', trCells.item(orderNoIndex));
        map.set('OCellB', trCells.item(orderNoIndex));

        for (let item of map) {
            if ($('#' + item[0], w.document)[0]) {
                $('#' + item[0], w.document)[0].textContent = $('div', item[1])[0].textContent;
            }
        }
        // 填信息
        $('#printTime', w.document)[0].textContent = date + ' ' + time;
        new QRCode($('#SCDQR', w.document)[0], {
            text: trCells.item(orderNoIndex).textContent,
            width: 144,
            height: 144
        });

        var materialTable = $('#materialTable', w.document)[0];
        // 工艺表指针
        var wIndex = 1;
        // 物料表指针
        var mIndex = 1;
        let lastCode = '';
        let cell0 = null;
        let cell1 = null;
        let cell2 = null;
        for (let row of bodyRows) {
            let materialCode = $('div', row.cells.item(materialCodeIndex))[0].textContent;
            let process = $('div', row.cells.item(processIndex))[0].textContent;
            if (materialCode && process != '包装' && process != '产品组装' && !materialCode.startsWith('02-1')) {
                const semi = $('div', row.cells.item(semiIndex))[0].textContent;
                const code = $('div', row.cells.item(productCodeIndex))[0].textContent;
                const cells = row.cells;
                let tr = materialTable.insertRow(wIndex++);
                if (tr.rowIndex == 1) {
                    cell0 = tr.insertCell(0);
                    cell1 = tr.insertCell(1);
                    cell2 = tr.insertCell(2);
                    cell0.innerHTML = cells.item(productAliasIndex).textContent + "<br />" + cells.item(productNameIndex).textContent;
                    cell1.innerHTML = cells.item(productPlannedQuantityIndex).textContent;
                    cell1.className = "numCell";
                    cell2.innerHTML = cells.item(orderQuantityIndex).textContent;
                    cell2.className = "numCell";
                } else
                if (code == lastCode) {
                    cell0.setAttribute('rowspan', mIndex);
                    cell1.setAttribute('rowspan', mIndex);
                    cell2.setAttribute('rowspan', mIndex);
                } else {
                    mIndex = 1;
                    cell0 = tr.insertCell(0);
                    cell1 = tr.insertCell(1);
                    cell2 = tr.insertCell(2);
                    cell0.innerHTML = cells.item(productAliasIndex).textContent + "<br />" + cells.item(productNameIndex).textContent;
                    cell1.innerHTML = cells.item(productPlannedQuantityIndex).textContent;
                    cell1.className = "numCell";
                    cell2.innerHTML = cells.item(orderQuantityIndex).textContent;
                    cell2.className = "numCell";
                }
                let i = 0;
                if (code != lastCode) {
                    i = 3;
                }
                //tr.insertCell(i++).innerHTML = cells.item(processIndex).textContent;
                tr.insertCell(i++).innerHTML = semi;
                tr.insertCell(i++).innerHTML = mIndex++;
                //tr.insertCell(i++).innerHTML = cells.item(materialCodeIndex).textContent;
                tr.insertCell(i++).innerHTML = cells.item(materialNameIndex).textContent;
                tr.insertCell(i++).innerHTML = cells.item(materialSpecsIndex).textContent;
                tr.insertCell(i++).innerHTML = cells.item(semiSpecsIndex).textContent;
                tr.insertCell(i++).innerHTML = cells.item(plannedQuantityIndex).textContent;
                if (materialCode.startsWith('00-') || materialCode.startsWith('01-012')) {
                    tr.insertCell(i++).innerHTML = '外购';
                } else {
                    tr.insertCell(i++).innerHTML = '';
                }
                tr.insertCell(i++).innerHTML = cells.item(materialQIndex).textContent;
                tr.insertCell(i++).innerHTML = cells.item(materialUnitIndex).textContent;
                //tr.insertCell(i++).innerHTML = cells.item(processIndex).textContent;
                tr.insertCell(i++).innerHTML = cells.item(workshopIndex).textContent;
                lastCode = code;
            }

        }

        await sleep(100);
        if (w.document.getElementById("download").hasAttribute('download')) {
            w.document.getElementById("download").click();
        }
        if (window.fastPrint) {
            w.print();
            w.close();
            document.body.removeChild(iframe);
        }
    }

    // 打印生产单
    async function generateAndPrint() {
        if (!$('input', $('label:contains("订单号")')[0].nextSibling)[0].value && !$('input', $('label:contains("生产单号")')[0].nextSibling)[0].value && !$('input', $('label:contains("产品编码")')[0].nextSibling)[0].value && !$('input', $('label:contains("产品名")')[0].nextSibling)[0].value) {
            alert("未输入订单号/生产单号/产品编号/产品名，请先设置至少一项筛选条件");
            return;
        }
        const orderNoIndex = $('th:contains("订单号")')[0].cellIndex;
        const customerIndex = $('th:contains("客户名")')[0].cellIndex;
        const billDateIndex = $('th:contains("单据日期")')[0].cellIndex;
        const billDeliveryIndex = $('th:contains("发货日期")')[0].cellIndex;
        const productCodeIndex = $('th:contains("产品编码")')[0].cellIndex;
        const productNameIndex = $('th:contains("产品名")')[0].cellIndex;
        const productAliasIndex = $('th:contains("产品别名")')[0].cellIndex;
        const productSpecsIndex = $('th:contains("产品规格")')[0].cellIndex;
        const scdIndex = $('th:contains("生产单号")')[0].cellIndex;
        const orderQuantityIndex = $('th:contains("下单数")')[0].cellIndex;
        const processIndex = $('th:contains("工序名")')[0].cellIndex;
        const semiIndex = $('th:contains("工件名")')[0].cellIndex;
        const plannedQuantityIndex = $('th:contains("加工数")')[0].cellIndex;
        const productPlannedQuantityIndex = $('th:contains("生产数")')[0].cellIndex;
        const workshopIndex = $('th:contains("车间")')[0].cellIndex;
        const keyIndex = $('th:contains("主键")')[0].cellIndex;
        // 物料
        const materialCodeIndex = $('th:contains("物料编码")')[0].cellIndex;
        const materialNameIndex = $('th:contains("物料名")')[0].cellIndex;
        const materialAliasIndex = $('th:contains("物料别名")')[0].cellIndex;
        const materialSpecsIndex = $('th:contains("物料规格")')[0].cellIndex;
        const semiSpecsIndex = $('th:contains("工件尺寸")')[0].cellIndex;
        const materialQIndex = $('th:contains("领料数")')[0].cellIndex;
        const materialUnitIndex = $('th:contains("计量单位")')[0].cellIndex;


        var tbody = null;
        await getFullTable().then(t => {
            tbody = t;
        })

        var bodyRows = tbody.rows;
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        let oldSCD = ''
        let atable = [];
        var currentTable = null;
        // 根据不同生产单生成n个表
        for (let tr of bodyRows) {
            let cSCD = $('div', tr.cells.item(scdIndex))[0].textContent;
            if (cSCD != oldSCD) {
                currentTable = document.createElement('table');
                atable.push(currentTable);
            }
            currentTable.appendChild(tr.cloneNode(true));
            oldSCD = cSCD;
        }

        for (let t of atable) {
            let trCells = t.rows.item(0).cells;
            let w = null;
            let iframe = null;
            if (window.fastPrint) {
                iframe = document.createElement('iframe');
                document.body.appendChild(iframe);
                iframe.contentWindow.document.open();
                iframe.contentWindow.document.write(htmlTemplate);
                w = iframe.contentWindow;
            } else {
                w = window.open();
                w.document.write(htmlTemplate);
                w.document.getElementById("download").setAttribute('download', trCells.item(orderNoIndex).textContent + '-' + "生产任务单" + '-' + trCells.item(productAliasIndex).textContent + '-' + trCells.item(productNameIndex).textContent + '-' + date + ".html");
            }
            let map = new Map();
            map.set('customerName', trCells.item(customerIndex));
            map.set('orderNo', trCells.item(orderNoIndex));
            map.set('productCode', trCells.item(productCodeIndex));
            map.set('productName', trCells.item(productNameIndex));
            map.set('ProductNameCell', trCells.item(productNameIndex));
            map.set('productAlias', trCells.item(productAliasIndex));
            map.set('productSpecs', trCells.item(productSpecsIndex));
            map.set('SCD', trCells.item(scdIndex));
            map.set('SCDCell', trCells.item(scdIndex));
            map.set('orderQuantity', trCells.item(orderQuantityIndex));
            map.set('plannedQuantity', trCells.item(productPlannedQuantityIndex));
            map.set('orderDate', trCells.item(billDateIndex));
            map.set('deliveryDate', trCells.item(billDeliveryIndex));

            // 填信息
            for (let item of map) {
                $('#' + item[0], w.document)[0].textContent = $('div', item[1])[0].textContent;
            }
            $('#ProductNameCell', w.document)[0].textContent = $('div', trCells.item(productAliasIndex))[0].textContent + ' ' + $('#ProductNameCell', w.document)[0].textContent;
            $('#printTime', w.document)[0].textContent = date + ' ' + time;
            new QRCode($('#SCDQR', w.document)[0], {
                text: $('div', map.get('SCD'))[0].textContent,
                width: 144,
                height: 144
            });

            var tBodyRows = t.rows;
            var processTable = $('#procedureTable', w.document)[0];
            var materialTable = $('#materialTable', w.document)[0];
            // 工艺表指针
            var wIndex = 1;
            // 物料表指针
            var mIndex = 1;
            var contentIndex = 0;
            let outsourcing = '';
            let lastID = '';
            let processCell = null;
            let span = 1;
            for (let row of tBodyRows) {
                let process = $('div', row.cells.item(processIndex))[0].textContent;
                const semi = $('div', row.cells.item(semiIndex))[0].textContent;
                const plannedQuantity = $('div', row.cells.item(plannedQuantityIndex))[0].textContent;
                const workshop = $('div', row.cells.item(workshopIndex))[0].textContent;
                const key = $('div', row.cells.item(keyIndex))[0].textContent;

                if (process.includes('振光') || process.includes('镀') || process.includes('电解') || process.includes('丝印') || process.includes('打砂') || process.includes('浸塑') || process.includes('震光') || process.includes('氧化着色') || process.includes('喷粉')) {
                    if (!outsourcing.includes(process))
                        outsourcing = outsourcing ? outsourcing + '/' + process : process;
                }


                let materialCode = $('div', row.cells.item(materialCodeIndex))[0].textContent;
                if (materialCode.startsWith("02-")) {
                    materialCode = null;
                }
                // 填工序卡表体
                if (key != lastID) {
                    let tr = processTable.insertRow(wIndex);
                    contentIndex = wIndex++;
                    tr.insertCell(0).innerHTML = contentIndex;
                    let processCell = tr.insertCell(1);
                    processCell.innerHTML = materialCode ? '🅐' + process : process;
                    processCell.setAttribute('class', 'processCell');
                    let semiCell = tr.insertCell(2);
                    semiCell.innerHTML = semi;
                    semiCell.setAttribute('class', 'semiCell');
                    let i = 3
                    let pieceQuantity = plannedQuantity / $('#plannedQuantity', w.document)[0].textContent;
                    tr.insertCell(i++).innerHTML = plannedQuantity;
                    tr.insertCell(i++).innerHTML = pieceQuantity < 1 ? Number(pieceQuantity).toFixed(2) : pieceQuantity;
                    tr.insertCell(i++).innerHTML = '';
                    tr.insertCell(i++).innerHTML = '';
                    tr.insertCell(i++).innerHTML = '';
                    tr.insertCell(i++).innerHTML = '';
                    tr.insertCell(i++).innerHTML = '';
                    tr.insertCell(i++).innerHTML = '';
                    tr.insertCell(i++).innerHTML = workshop;
                    // let qrCell = tr.insertCell(6);
                    // var qrDiv = document.createElement('div');
                    // new QRCode(qrDiv, {
                    //     text: process,
                    //     width: 64,
                    //     height: 64
                    // });
                    // qrCell.appendChild(qrDiv);
                }

                // 填物料表体
                if (materialCode && process != '包装' && process != '产品组装') {
                    let materialCode = $('div', row.cells.item(materialCodeIndex))[0].textContent;
                    let materialName = $('div', row.cells.item(materialNameIndex))[0].textContent;
                    let materialAlias = $('div', row.cells.item(materialAliasIndex))[0].textContent;
                    let materialSpecs = $('div', row.cells.item(materialSpecsIndex))[0].textContent;
                    let semiSpecs = $('div', row.cells.item(semiSpecsIndex))[0].textContent;
                    let materialQ = $('div', row.cells.item(materialQIndex))[0].textContent;
                    let materialUnit = $('div', row.cells.item(materialUnitIndex))[0].textContent;
                    let tr = materialTable.insertRow(mIndex++);
                    if (mIndex == 1) {
                        processCell = tr.insertCell(0);
                        processCell.innerHTML = contentIndex + '.' + process;
                        processCell.setAttribute('class', 'processCell');
                    } else
                    if (key == lastID) {
                        processCell.setAttribute('rowspan', ++span);
                    } else {
                        span = 1;
                        processCell = tr.insertCell(0);
                        processCell.innerHTML = contentIndex + '.' + process;
                        processCell.setAttribute('class', 'processCell');
                    }
                    let i = 0;
                    if (key != lastID) {
                        i = 1;
                    }
                    tr.insertCell(i++).innerHTML = materialCode;
                    let nameCell = tr.insertCell(i++);
                    nameCell.innerHTML = materialName;
                    nameCell.setAttribute('class', 'nameCell');
                    tr.insertCell(i++).innerHTML = materialSpecs;
                    tr.insertCell(i++).innerHTML = semiSpecs;
                    tr.insertCell(i++).innerHTML = plannedQuantity;
                    tr.insertCell(i++).innerHTML = materialQ;
                    tr.insertCell(i++).innerHTML = materialUnit;
                }
                lastID = key;
            }
            $('#outSourceType', w.document)[0].textContent = outsourcing;

            await sleep(100);
            if (w.document.getElementById("download").hasAttribute('download')) {
                w.document.getElementById("download").click();
            }
            if (window.fastPrint) {
                w.print();
                w.close();
                document.body.removeChild(iframe);
            }
        }
    }

    //async function makeQRCode() {
    //    let bodyRows = document.querySelectorAll('[class="cell el-tooltip"]')[0].closest('table').lastChild.rows;
    //    const qrIndex = $('th:contains("二维码")')[0].cellIndex;
    //    if (!qrIndex) {
    //        return;
    //    }
    //    let qrCell = null;
    //    for (let row of bodyRows) {
    //        qrCell = row.cells.item(qrIndex);
    //        let qrDiv = $('#qrBoxDiv', qrCell)[0];
    //        if (qrDiv) {
    //            qrCell.removeChild(qrDiv);
    //        }
    //        qrDiv = document.createElement('div');
    //        qrDiv.setAttribute('id', 'qrBoxDiv');
    //        qrCell.appendChild(qrDiv);

    //        let str = $('div', row.cells.item(qrIndex))[0].textContent;
    //        new QRCode(qrDiv, {
    //            text: str,
    //            width: 96,
    //            height: 96
    //        });
    //    }
    //    while ($('img', qrCell)[0].getAttribute('style') == "display: none;") {
    //        await sleep(100);
    //    }
    //    formatAndPrint();
    //}

    //async function formatAndPrint() {
    //    var header = $('thead')[0].firstChild;
    //    var body = document.querySelectorAll('[class="cell el-tooltip"]')[0].closest('tbody').cloneNode(true);
    //    var bodyRows = body.rows;

    //    // cleanup table elements
    //    var tbl = document.createElement('table');

    //    for (let row of bodyRows) {
    //        // tr
    //        row.removeAttribute('class');
    //        for (let cell of row.cells) {
    //            // td
    //            cell.removeAttribute('class');
    //            cell.removeAttribute('rowspan');
    //            cell.removeAttribute('colspan');
    //            // td-div
    //            cell.firstChild.removeAttribute('class');
    //            cell.firstChild.removeAttribute('style');
    //        }
    //    }

    //    var printContents = body.innerHTML;
    //    var pageTemplate = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.3.0/paper.css">\n<style>@page { size: A4 }</style>\n<body class="A5">\n<section class="sheet padding-10mm">\n';
    //    // add contents here
    //    pageTemplate += "<table>" + printContents + "</table>";
    //    pageTemplate += '\n</section>\n</body>';
    //    var w = window.open();
    //    w.document.write(pageTemplate);
    //    await sleep(500);
    //    w.print();
    //    // w.close();
    //}

    // 生产任务单
    const htmlTemplate = `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.3.0/paper.css">

<body class="A4" style="height: auto;">
    <a onclick="this.href='data:text/html;charset=UTF-8,'+encodeURIComponent(document.documentElement.outerHTML)"
        href="#" id="download"></a>
    <section class="sheet padding-10mm" style="height: auto;">
        <p align=center style="margin-top: -5px;"><span class=title lang=ZH-CN>车间生产任务单</span></p>
        <div align=center>
            <div id="leftbox">
                <p align=left><label>客户名: </label><span id="customerName"></span></p>
                <p align=left><label>订单号: </label><span id="orderNo"></span></p>
                <p align=left><label>产品编码: </label><span id="productCode"></span></p>
                <p align=left><label>产品名: </label><span id="productName"></span></p>
                <p align=left><label>产品别名: </label><span id="productAlias"></span></p>
                <p align=left><label>产品规格: </label><span id="productSpecs"></span></p>
                <p align=left><label>生产单号: </label><span id="SCD"></span></p>
                <p align=left><label>客户下单数: </label><span id="orderQuantity"></span></p>
                <p align=left><label>计划生产数: </label><span id="plannedQuantity"></span></p>
                <p align=left><label>订单日期: </label><span id="orderDate"></span></p>
                <p align=left><label>交货日期: </label><span id="deliveryDate"></span></p>
                <p align=left><label>打印时间: </label><span id="printTime"></span></p>
                <p align=left><label>外发类型: </label><span id="outSourceType"></span></p>
            </div>

            <div id="rightbox" style="margin-bottom: 10px;">
                <table id="materialTable" style="font-size:small;" contenteditable>
                    <tr>
                        <th>工序</th>
                        <th>物料编号</th>
                        <th>物料名称</th>
                        <th>物料规格</th>
                        <th>开料尺寸</th>
                        <th>开料数</th>
                        <th>用量</th>
                        <th>单位</th>
                    </tr>
                </table>
                <div style="margin-top: 20px;" id="SCDQR"></div>
            </div>
        </div>
        <div style="clear: both;"></div>
        <div style="margin-top: 10px;" align=center>
            <table style="font-size:small;" contenteditable>
                <thead>
                    <tr>
                        <td colspan="12" style="font-size: medium;"><span>产品名: </span> <span
                                id="ProductNameCell"></span>
                        </td>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <td colspan="12" style="font-size: medium;"><span>车间生产单号: </span><span id="SCDCell"></span>
                        </td>
                    </tr>
                </tfoot>
                <tbody id="procedureTable">
                    <tr>
                        <th>#</th>
                        <th>工序</th>
                        <th>工序内容</th>
                        <th>数量</th>
                        <th>单件</th>
                        <th style="min-width: 15mm;">日期</th>
                        <th style="min-width: 15mm;">投入数</th>
                        <th style="min-width: 15mm;">产出数</th>
                        <th style="min-width: 10mm;">不良品</th>
                        <th style="min-width: 10mm;">用时</th>
                        <th style="min-width: 15mm;">生产员</th>
                        <th>车间</th>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</body>
<style>
    @page {
        size: A4;
    }

    #leftbox {
        float: left;
        margin-top: 20px;
        margin-bottom: 20px;
        width: 30%;
    }

    #rightbox {
        float: right;
        margin-top: 30px;
        width: 68%;
    }

    .title {
        text-align: center;
        font-size: large;
    }

    p {
        margin-bottom: -10px;
        font-size: 90%;
    }

    .avoidBreak {
        page-break-after: avoid;
    }

    table,
    th,
    td {
        word-wrap: break-word;
    }

    .semiCell {
        max-width: 50mm;
    }

    .processCell {
        max-width: 17mm;
    }

    .nameCell {
        max-width: 25mm;
    }

    .materialCode {
        font-size: 6px;
    }

    table {
        width: 100%;
        border-width: 1px;
        border-spacing: 0px;
        border-style: solid;
        border-color: grey;
        border-collapse: separate;
    }

    table th {
        border-width: 1px;
        border-color: grey;
        border-style: solid;
    }

    table td {
        border-width: 1px;
        border-color: grey;
        border-style: solid;
    }

    td {
        font-size: smaller;
    }

    tr {
        page-break-inside: avoid;
        page-break-after: auto;
    }

    thead {
        display: table-header-group;
    }

    tfoot {
        display: table-footer-group;
    }
</style>`;

    // 排料单
    const materialTemplate = `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.3.0/paper.css">

<body class="A4" style="height: auto;">
    <a onclick="this.href='data:text/html;charset=UTF-8,'+encodeURIComponent(document.documentElement.outerHTML)"
        href="#" id="download"></a>
    <section class="sheet padding-10mm" style="height: auto;">
        <p align=center style="margin-top: -5px;"><span class=title lang=ZH-CN>生产排料单</span></p>
        <div align=center>
            <div id="leftbox">
                <p align=left><label>订单号: </label><span id="orderNo"></span></p>
                <p align=left><label>订单日期: </label><span id="orderDate"></span></p>
                <p align=left><label>领料日期: </label><span id="pickingDate"></span></p>
                <p align=left><label>交货日期: </label><span id="deliveryDate"></span></p>
                <p align=left><label>打印时间: </label><span id="printTime"></span></p>
            </div>

            <div id="rightbox">
                <div align="right" style="margin-top: 20px;" id="SCDQR"></div>
            </div>
        </div>
        <div style="clear: both;"></div>
        <div style="margin-top: 10px;" align=center>
            <table style="font-size:small;" contenteditable>
                <thead>
                    <tr>
                        <td colspan="15" style="font-size: medium;"><span>订单号: </span> <span id="OCellA"></span>
                        </td>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <td colspan="15" style="font-size: medium;"><span>订单号: </span><span id="OCellB"></span>
                        </td>
                    </tr>
                </tfoot>
                <tbody id="materialTable">
                    <tr>
                        <th>产品名称</th>
                        <th class="numCell">生产数</th>
                        <th class="numCell">出货数</th>
                        <th>工件名称</th>
                        <th>#</th>
                        <th>物料名称</th>
                        <th>物料规格</th>
                        <th>开料尺寸</th>
                        <th>开料数</th>
                        <th style="min-width: 30px;">物料来源</th>
                        <th>用量</th>
                        <th>单位</th>
                        <th>车间</th>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</body>
<style>
    @page {
        size: A4;
    }

    #leftbox {
        float: left;
        margin-top: 20px;
        margin-bottom: 20px;
        width: 30%;
    }

    #rightbox {
        float: right;
        margin-top: 10px;
        width: 68%;
    }

    .numCell {
        max-width: 25px;
    }

    .title {
        text-align: center;
        font-size: large;
    }

    .materialCode {
        font-size: 6px;
    }

    .avoidBreak {
        page-break-after: avoid;
    }

    p {
        margin-bottom: -10px;
        font-size: 90%;
    }

    table,
    th,
    td {
        word-wrap: break-word;
    }

    table {
        width: 100%;
        border-width: 1px;
        border-spacing: 0px;
        border-style: solid;
        border-color: grey;
        border-collapse: separate;
    }

    table th {
        border-width: 1px;
        border-color: grey;
        border-style: solid;
    }

    table td {
        border-width: 1px;
        border-color: grey;
        border-style: solid;
    }

    td {
        font-size: smaller;
        max-width: 80px;
    }
</style>`;

    // 备料单
    const sumMaterialTemplate = `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.3.0/paper.css">

<body class="A4" style="height: auto;">
    <a onclick="this.href='data:text/html;charset=UTF-8,'+encodeURIComponent(document.documentElement.outerHTML)"
        href="#" id="download"></a>
    <section class="sheet padding-10mm" style="height: auto;">
        <p align=center style="margin-top: -5px;"><span id="title" class="title">生产备料单</span></p>
        <div align=center>
            <div id="leftbox">
                <p align=left><label>订单号: </label><span id="orderNo"></span></p>
                <p align=left><label>订单日期: </label><span id="orderDate"></span></p>
                <p align=left><label>领料日期: </label><span id="pickingDate"></span></p>
                <p align=left><label>交货日期: </label><span id="deliveryDate"></span></p>
                <p align=left><label>打印时间: </label><span id="printTime"></span></p>
            </div>

            <div id="rightbox">
                <div align="right" style="margin-top: 20px;" id="SCDQR"></div>
            </div>
        </div>
        <div style="clear: both;"></div>
        <div style="margin-top: 10px;" align=center>
            <table style="font-size:small;" contenteditable>
                <thead>
                    <tr>
                        <td colspan="15" style="font-size: medium;"><span>订单号: </span> <span id="OCellA"></span>
                        </td>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <td colspan="15" style="font-size: medium;"><span>订单号: </span><span id="OCellB"></span>
                        </td>
                    </tr>
                </tfoot>
                <tbody id="materialTable">
                    <tr>
                        <th>#</th>
                        <th>物料编码</th>
                        <th>物料名称</th>
                        <th>物料别名</th>
                        <th>物料规格</th>
                        <th style="min-width: 30px;">物料来源</th>
                        <th>用量</th>
                        <th>单位</th>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</body>
<style>
    @page {
        size: A4;
    }

    #leftbox {
        float: left;
        margin-top: 20px;
        margin-bottom: 20px;
        width: 30%;
    }

    #rightbox {
        float: right;
        margin-top: 10px;
        width: 68%;
    }

    .numCell {
        max-width: 10px;
    }

    .materialCode {
        font-size: 6px;
    }

    .title {
        text-align: center;
        font-size: large;
    }

    p {
        margin-bottom: -10px;
        font-size: 90%;
    }

    .avoidBreak {
        page-break-after: avoid;
    }

    table,
    th,
    td {
        word-wrap: break-word;
    }

    table {
        width: 100%;
        border-width: 1px;
        border-spacing: 0px;
        border-style: solid;
        border-color: grey;
        border-collapse: separate;
    }

    table th {
        border-width: 1px;
        border-color: grey;
        border-style: solid;
    }

    table td {
        border-width: 1px;
        border-color: grey;
        border-style: solid;
    }
</style>`;

    // 采购单
    const purchaseTemplate = `
 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.3.0/paper.css">

<body class="A4" style="height: auto;">
    <a onclick="this.href='data:text/html;charset=UTF-8,'+encodeURIComponent(document.documentElement.outerHTML)"
        href="#" id="download"></a>
    <section class="sheet padding-10mm" style="height: auto;">
        <p align=center style="margin-top: -5px;"><span id="title" class="title">原料采购计划</span></p>
        <div align=center>
            <div id="leftbox">
                <p align=left><label>订单号: </label><span id="orderNo"></span></p>
                <p align=left><label>订单日期: </label><span id="orderDate"></span></p>
                <p align=left><label>领料日期: </label><span id="pickingDate"></span></p>
                <p align=left><label>交货日期: </label><span id="deliveryDate"></span></p>
                <p align=left><label>打印时间: </label><span id="printTime"></span></p>
            </div>

            <div id="rightbox">
                <div align="right" style="margin-top: 20px;" id="SCDQR"></div>
            </div>
        </div>
        <div style="clear: both;"></div>
        <div style="margin-top: 10px;" align=center>
            <table style="font-size:small;" contenteditable>
                <thead>
                    <tr>
                        <td colspan="15" style="font-size: medium;"><span>订单号: </span> <span id="OCellA"></span>
                        </td>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <td colspan="15" style="font-size: medium;"><span>订单号: </span><span id="OCellB"></span>
                        </td>
                    </tr>
                </tfoot>
                <tbody id="materialTable">
                    <tr>
                        <th>#</th>
                        <th>物料名称</th>
                        <th>物料规格</th>
                        <th style="min-width: 30px;">当前库存</th>
                        <th>生产待领料</th>
                        <th>采购未入库</th>
                        <th>订单用量</th>
                        <th>建议采购数</th>
                        <th>单位</th>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</body>
<style>
    @page {
        size: A4;
    }

    #leftbox {
        float: left;
        margin-top: 20px;
        margin-bottom: 20px;
        width: 30%;
    }

    #rightbox {
        float: right;
        margin-top: 10px;
        width: 68%;
    }

    .numCell {
        max-width: 10px;
    }

    .materialCode {
        font-size: 6px;
    }

    .title {
        text-align: center;
        font-size: large;
    }

    p {
        margin-bottom: -10px;
        font-size: 90%;
    }

    .avoidBreak {
        page-break-after: avoid;
    }

    table,
    th,
    td {
        word-wrap: break-word;
    }

    table {
        width: 100%;
        border-width: 1px;
        border-spacing: 0px;
        border-style: solid;
        border-color: grey;
        border-collapse: separate;
    }

    table th {
        border-width: 1px;
        border-color: grey;
        border-style: solid;
    }

    table td {
        border-width: 1px;
        border-color: grey;
        border-style: solid;
    }
</style>
 `;
})();
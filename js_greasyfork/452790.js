// ==UserScript==
// @name         MEST Modeling Helper
// @namespace    joyings.com.cn
// @version      2.3.7
// @description  Modeling Helper
// @author       zmz125000
// @match        http://*/mest/*
// @icon         http://www.google.com/s2/favicons?domain=openwrt.org
// @grant        none
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/452790/MEST%20Modeling%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/452790/MEST%20Modeling%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    addClickActions();
    updateIndexBtn();
    semiCellEvent();
    multiUnit();
    addObserverIfDesiredNodeAvailable();
    // 新增一行自动填写
    window.autofill = false;
    window.autofillMat = false;
    window.autoSerial = false;
    window.autoSemi = false;
    window.skipMat = false;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function addObserverIfDesiredNodeAvailable() {
        var composeBox = document.querySelectorAll('[class="el-popup-parent--hidden"]')[0];
        if (!composeBox) {
            //The node we need does not exist yet.
            //Wait 500ms and try again
            window.setTimeout(addObserverIfDesiredNodeAvailable, 500);
            return;
        }
        var config = {
            attributes: true,
        };
        var composeObserver = new MutationObserver(function () {
            window.setTimeout(addClickActions, 500);
            window.setTimeout(updateIndexBtn, 500);
            window.setTimeout(multiUnit, 500);
            composeObserver.disconnect();
            addObserverIfDesiredNodeAvailable();
        });
        composeObserver.observe(composeBox, config);
    }

    // 选择自己
    async function semiCellEvent() {
        if (!$('button:contains(" 选择自己 ")')[0] || $('button:contains(" 选择自己 ")')[0].hasAttribute('helper') || window.autoSemi) {
            await sleep(500);
            semiCellEvent();
            return;
        }
        $('button:contains(" 选择自己 ")')[0].addEventListener('click', async function (e) {
            await sleep(100);
            dbck();
        });
        await sleep(100);
        while ($('button:contains(" 选择自己 ")')[0] && !$('button:contains(" 选择 ")', $('button:contains(" 选择自己 ")')[0].parentElement.parentElement)) {
            await sleep(100);
        }
        if ($('button:contains(" 选择自己 ")')[0]) {
            for (let btn of $('button:contains(" 选择 ")', $('button:contains(" 选择自己 ")')[0].parentElement.parentElement)) {
                btn.addEventListener('click', async function (e) {
                    await sleep(500);
                    dbck();
                    await sleep(500);
                    dbck();
                });
                btn.setAttribute('helper', true);
            }
        }
        semiCellEvent();
    }

    // 添加按钮
    async function updateIndexBtn() {
        if (!$('[class="el-tabs__item is-top is-active is-closable"]:contains("存货档案")')[0]) {
            return;
        }
        if ($('button:contains("存货Excel导入")')[0] && !$('button:contains("居宜轩导入模板")')[0]) {
            let btn = document.createElement('button');
            btn.setAttribute('type', 'button');
            btn.addEventListener('click', async function () {
                window.open('https://mest-system.oss-cn-guangzhou.aliyuncs.com/orderFiles/document/9967821a-f16c-494d-b7e0-eb5f0b688be6.xlsx');
            });
            btn.appendChild(document.createTextNode('⇩下载居宜轩导入模板'));

            $('button:contains("存货Excel导入")')[0].parentElement.appendChild(btn);
        }
        if (!$('#tab-basic')[0] && !$('button:contains(" 新增一行 ")')[0]) {
            await sleep(500);
            updateIndexBtn();
            return;
        } else if (!$('button:contains("使用说明")')[0]) {
            let btnRow = $('button:contains(" 新增一行 ")')[0].parentElement;
            var btn = document.createElement('button');
            btn.setAttribute('title', '一键更新所有序号');
            btn.setAttribute('id', 'oneKeyButton');
            btn.setAttribute('type', 'button');
            btn.onclick = updateIndex;
            btn.appendChild(document.createTextNode('⇩更新序号'));

            var btn2 = document.createElement('button');
            btn2.setAttribute('title', '重新设置自动填充');
            btn2.setAttribute('id', 'reloadBtn');
            btn2.setAttribute('type', 'button');
            btn2.onclick = dbck;
            btn2.appendChild(document.createTextNode('⟳重载自动填充'));

            var btn3 = document.createElement('button');
            btn3.setAttribute('title', '一键设置工序');
            btn3.setAttribute('id', 'updateProcBtn');
            btn3.setAttribute('type', 'button');
            btn3.onclick = updateProcess;
            btn3.appendChild(document.createTextNode('⇩一键设置工序'));

            var btn4 = document.createElement('button');
            btn4.setAttribute('title', '一键设置物料');
            btn4.setAttribute('id', 'updateMaterialBtn');
            btn4.setAttribute('type', 'button');
            btn4.onclick = updateMaterial;
            btn4.appendChild(document.createTextNode('⇩一键设置物料'));

            var btn5 = document.createElement('button');
            btn5.setAttribute('type', 'button');
            btn5.onclick = readme;
            btn5.appendChild(document.createTextNode('❓使用说明'));

            var btn6 = document.createElement('button');
            btn6.setAttribute('title', '一键替换同系列半产品');
            btn6.setAttribute('id', 'updateSemiBtn');
            btn6.setAttribute('type', 'button');
            btn6.onclick = updateSemi;
            btn6.appendChild(document.createTextNode('⇩一键替换同系列半成品'));

            var btn8 = document.createElement('button');
            btn8.setAttribute('title', '新增一行跳过物料选择');
            btn8.setAttribute('id', 'skipMateralBtn');
            btn8.setAttribute('type', 'button');
            btn8.onclick = skipMaterial;
            btn8.appendChild(document.createTextNode(window.skipMat ? "✔" : "✘"));

            var btnUpdate = document.createElement('button');
            btnUpdate.setAttribute('type', 'button');
            btnUpdate.addEventListener('click', async function () {
                window.open('https://greasyfork.org/en/scripts/452790-mest-modeling-helper');
            });
            btnUpdate.appendChild(document.createTextNode('更新插件'));

            var tDiv1 = document.createElement('div');
            tDiv1.setAttribute('style', 'float:right;');
            var tbox1 = document.createElement('input');
            tbox1.setAttribute('id', 'formerNmaeInput');
            btn4.setAttribute('title', '要被替换的前缀');
            tbox1.setAttribute('placeholder', '要被替换的前缀');
            tbox1.setAttribute('class', 'el-textarea__inner');
            tbox1.setAttribute('style', 'width: 130px;');
            tDiv1.appendChild(tbox1);

            var tDiv2 = document.createElement('div');
            tDiv2.setAttribute('style', 'float:right;');
            var tbox2 = document.createElement('input');
            tbox2.setAttribute('id', 'newNmaeInput');
            btn4.setAttribute('title', '新的前缀');
            tbox2.setAttribute('placeholder', '新的前缀');
            tbox2.setAttribute('class', 'el-textarea__inner');
            tbox2.setAttribute('style', 'width: 130px;');
            tDiv2.appendChild(tbox2);

            // 自动选择半成品
            var aDiv = document.createElement('div');
            aDiv.setAttribute('style', 'float:right;');
            var namesArea = document.createElement('textarea');
            namesArea.setAttribute('id', 'nameListArea');
            namesArea.setAttribute('class', 'el-textarea__inner');
            namesArea.setAttribute('placeholder', "在此输入产品名（多行）");
            namesArea.setAttribute('style', "width: auto;");
            aDiv.appendChild(namesArea);
            var btn7 = document.createElement('button');
            btn7.setAttribute('title', '自动选择半成品');
            btn7.setAttribute('id', 'autofillSemiBtn');
            btn7.setAttribute('type', 'button');
            btn7.onclick = autofillSemi;
            btn7.appendChild(document.createTextNode('⇩自动选择半成品'));

            btnRow.appendChild(btn);
            btnRow.appendChild(btn3);
            btnRow.appendChild(btn4);
            btnRow.appendChild(btn6);
            btnRow.appendChild(btn2);
            btnRow.appendChild(btn5);
            btnRow.appendChild(btn7);
            btnRow.appendChild(btn8);
            btnRow.appendChild(btnUpdate);
            btnRow.appendChild(aDiv);
            btnRow.appendChild(tDiv1);
            btnRow.appendChild(tDiv2);
            dbck();
            window.autofill = false;
            window.autofillMat = false;
            window.autoSerial = false;
            window.autoSemi = false;
        }
    }

    function skipMaterial() {
        if (window.skipMat) {
            window.skipMat = false;
            document.getElementById("skipMateralBtn").firstChild.nodeValue = "✘";
        } else {
            window.skipMat = true;
            document.getElementById("skipMateralBtn").firstChild.nodeValue = "✔";
        }
    }

    // 根据textarea自动选择半成品
    async function autofillSemi() {
        try {
            window.autoSemi = true;
            if ($('div:contains(" 暂未设置工艺 ")')[0]) {
                $('button:contains(" 设置工艺版本 ")')[0].click();
            }
            while (!document.querySelectorAll('[class="edit-cell"]')[0]) {
                $('button:contains(" 新增一行 ")')[0].click();
                await sleep(50);
            }
            let bodyRows = document.querySelectorAll('[class="edit-cell"]')[0].closest('table').lastChild.rows;
            const alias = document.querySelector('[placeholder="别名"]').closest('textarea').value;
            const semiIndex = $('th:contains(" 半成品/成品名称 ")')[0].cellIndex;
            var lines = $('#nameListArea').val().split('\n');
            if (lines.length < 2) {
                alert("请填写名称");
                window.autoSemi = false;
                return;
            }
            for (var i = 0; i < lines.length; i++) {
                while (!bodyRows.item(i)) {
                    $('button:contains(" 新增一行 ")')[0].click();
                    await sleep(100);
                }
                let semiCell = bodyRows.item(i).cells.item(semiIndex);
                $('span', semiCell).click();
                await sleep(50);
                $('button', semiCell).click();
                while (!document.querySelectorAll('[placeholder="存货别名"]')[1]) {
                    await sleep(50);
                }
                document.querySelectorAll('[placeholder="存货名称"]')[1].value = lines[i];
                document.querySelectorAll('[placeholder="存货名称"]')[1].dispatchEvent(new Event('input', {
                    bubbles: true
                }));
                document.querySelectorAll('[placeholder="存货别名"]')[1].value = alias;
                await sleep(50);
                document.querySelectorAll('[placeholder="存货别名"]')[1].dispatchEvent(new Event('input', {
                    bubbles: true
                }));
                await sleep(50);
                $('button:contains(" 搜索 ")')[0].click();
                await sleep(100);

                let tmp = 'tr:contains("' + lines[i] + '")';
                while ($('button:contains("选择自己")')[0]) {
                    if ($(tmp, $('div[class="el-dialog__body"]:contains("搜索")')[0]).length != 2) {
                        await sleep(50);
                    } else
                    if ($(tmp, $('div[class="el-dialog__body"]:contains("搜索")')[0])[0] && !$(tmp, $('div[class="el-dialog__body"]:contains("搜索")')[0])[0].innerHTML.includes(alias)) {
                        await sleep(50);
                    } else {
                        break;
                    }
                }
                if ($('button:contains("选择自己")')[0]) {
                    $('button:contains("选择")', $(tmp, $('div[class="el-dialog__body"]:contains("搜索")')[0]))[0].click();
                }
                await sleep(50);
            }
            console.log("finished")
            window.autoSemi = false;
            await sleep(150);
            dbck();
        } catch (error) {
            console.error(error);
            dbck();
            window.autoSemi = false;
        }
    }

    // 同系列半成品
    async function updateSemi() {
        try {
            let bodyRows = document.querySelectorAll('[class="edit-cell"]')[0].closest('table').lastChild.rows;
            const alias = document.querySelector('[placeholder="别名"]').closest('textarea').value;
            const semiIndex = $('th:contains(" 半成品/成品名称 ")')[0].cellIndex;
            var oldName = $('#formerNmaeInput')[0].value;
            var newName = $('#newNmaeInput')[0].value;
            if (!newName || !oldName) {
                alert("请填写名称");
                return;
            }
            window.autoSemi = true;
            for (let i of bodyRows) {
                let semiCell = i.cells.item(semiIndex);
                let oldFullName = $('span', semiCell)[0].textContent;
                let newFullName = oldFullName.replace(oldName, newName);
                $('span', semiCell).click();
                await sleep(50);
                $('button', semiCell).click();
                while (!document.querySelectorAll('[placeholder="存货别名"]')[1]) {
                    await sleep(50);
                }
                document.querySelectorAll('[placeholder="存货名称"]')[1].value = newFullName;
                document.querySelectorAll('[placeholder="存货名称"]')[1].dispatchEvent(new Event('input', {
                    bubbles: true
                }));
                document.querySelectorAll('[placeholder="存货别名"]')[1].value = alias;
                await sleep(50);
                document.querySelectorAll('[placeholder="存货别名"]')[1].dispatchEvent(new Event('input', {
                    bubbles: true
                }));
                await sleep(50);
                $('button:contains(" 搜索 ")')[0].click();

                let tmp = 'tr:contains("' + alias + '")';
                while (true) {
                    if ($('button:contains("选择自己")')[0] && $(tmp, $('div[class="el-dialog__body"]:contains("搜索")')[0]).length != 2) {
                        await sleep(50);
                    } else
                    if ($(tmp, $('div[class="el-dialog__body"]:contains("搜索")')[0])[0] && !$(tmp, $('div[class="el-dialog__body"]:contains("搜索")')[0])[0].innerHTML.includes(alias)) {
                        await sleep(50);
                    } else {
                        break;
                    }
                }
                if ($('button:contains("选择自己")')[0]) {
                    $('button:contains("选择")', $(tmp, $('div[class="el-dialog__body"]:contains("搜索")')[0]))[0].click();
                }
            }
            window.autoSemi = false;
        } catch (error) {
            console.error(error);
            window.autoSemi = false;
        }
    }
    // 多计量计算
    async function multiUnit() {
        if (!$('td:contains("浮动")')[0]) {
            await sleep(500);
            multiUnit();
            return;
        }
        if ($('button:contains("设置换算率")')[0]) {
            await sleep(5000);
            multiUnit();
            return;
        }

        let btnA = document.createElement('button');
        btnA.setAttribute('type', 'button');
        btnA.setAttribute('class', 'multiUnitBtn');
        btnA.appendChild(document.createTextNode('刷新'));
        btnA.onclick = clearMultiUnitBtn;
        $('th:contains("换算类型")')[0].appendChild(btnA);

        for (let row of $('tr:contains("浮动")')) {
            let btn = document.createElement('button');
            btn.setAttribute('type', 'button');
            btn.setAttribute('class', 'multiUnitBtn');
            btn.appendChild(document.createTextNode('设置换算率'));

            let divb = document.createElement('div');
            divb.setAttribute('class', 'multiUnitBtn');

            let result = multiUnitUtil();
            for (let cell of $('td:contains("浮动")', row)) {
                divb.innerHTML = "类型: " + result[3] + "; 厚度: " + result[2][0] + "; 长: " + result[2][1] + "; 宽: " + result[2][2] + "; 总长: " + result[2][3];
                cell.appendChild(divb);
                switch (row.cells.item(0).textContent) {
                    case 'KG':
                        btn.onclick = function () {
                            result = multiUnitUtil()
                            divb.innerHTML = "类型: " + result[3] + "; 厚度: " + result[2][0] + "; 长: " + result[2][1] + "; 宽: " + result[2][2] + "; 总长: " + result[2][3];
                            $('input', row.cells.item(3))[0].value = multiUnitUtil()[0];
                            $('input', row.cells.item(3))[0].dispatchEvent(new Event('input', {
                                bubbles: true
                            }));
                        };
                        break;
                    case '支':
                        btn.onclick = function () {
                            result = multiUnitUtil()
                            divb.innerHTML = "类型: " + result[3] + "; 厚度: " + result[2][0] + "; 长: " + result[2][1] + "; 宽: " + result[2][2] + "; 总长: " + result[2][3];
                            $('input', row.cells.item(3))[0].value = multiUnitUtil()[1];
                            $('input', row.cells.item(3))[0].dispatchEvent(new Event('input', {
                                bubbles: true
                            }));
                        };
                        break;
                    case '块':
                        btn.onclick = function () {
                            result = multiUnitUtil()
                            divb.innerHTML = "类型: " + result[3] + "; 厚度: " + result[2][0] + "; 长: " + result[2][1] + "; 宽: " + result[2][2] + "; 总长: " + result[2][3];
                            $('input', row.cells.item(3))[0].value = multiUnitUtil()[1];
                            $('input', row.cells.item(3))[0].dispatchEvent(new Event('input', {
                                bubbles: true
                            }));
                        };
                        break;
                }
                cell.appendChild(btn);
            }
        }
    }

    function clearMultiUnitBtn() {
        let elms = $('[class="multiUnitBtn"]');
        for (let elm of elms) {
            elm.remove();
        }
        multiUnit();
    }

    function readme() {
        alert("请先用excel导入所需半成品。\n脚本会用当前存货的别名作为半成品筛选条件，请为产品的所有工件设置相同的别名。\n脚本会根据上一道工序的半成品名填写物料和工序信息。\n如有意见建议或者在使用中遇到问题请联系敬轩\n半成品分类\n【02-101】非开料半成品\n【02-102】开料半成品\n【02-103】喷粉电镀外发\n插件版本号: " + GM_info.script.version);
    }
    // 一键设置物料
    async function updateMaterial() {
        if (!document.querySelectorAll('[class="edit-cell"]')[0]) {
            await sleep(500);
            updateMaterial();
            return;
        }
        let bodyRows = document.querySelectorAll('[class="edit-cell"]')[0].closest('table').lastChild.rows;
        const semiIndex = $('th:contains(" 半成品/成品名称 ")')[0].cellIndex;
        const materialIndex = $('th:contains(" 所需物料集 ")')[0].cellIndex;

        window.autofillMat = true;
        for (let i of bodyRows) {
            let prevSemi = '';
            let currSemi = $('span', i.cells.item(semiIndex))[0].textContent;
            if (i.rowIndex > 0) {
                prevSemi = $('span', bodyRows.item(i.rowIndex - 1).cells.item(semiIndex))[0].textContent;
            }
            $('a', i.cells.item(materialIndex))[0].click();
            await setMaterial(prevSemi, currSemi, true);
            while ($('button:contains("新增行")')[0]) {
                await sleep(200);
            }
        }
        window.autofillMat = false;
    }

    // 一键更新序号
    async function updateIndex() {
        if (!document.querySelectorAll('[class="edit-cell"]')[0]) {
            await sleep(500);
            updateIndex();
            return;
        }
        window.autoSerial = true;
        let bodyRows = document.querySelectorAll('[class="edit-cell"]')[0].closest('table').lastChild.rows;
        const procIndex = $('th:contains(" 上级序号 ")')[0].cellIndex;

        for (let i of bodyRows) {
            let indexCell = i.cells.item(procIndex);
            if ($('span', indexCell)[0].textContent.includes('始工序')) {
                continue;
            }
            $('span', indexCell)[0].click();
            await sleep(50);
            $('span', indexCell)[0].click();
            while (!$('button:contains(" 选择 ")')[i.rowIndex]) {
                await sleep(50);
            }
            $('button:contains(" 选择 ")')[i.rowIndex].click();
            await sleep(50);
        }
        window.autoSerial = false;
    }

    // 一键设置工序
    async function updateProcess() {
        if (!document.querySelectorAll('[class="edit-cell"]')[0]) {
            await sleep(500);
            updateProcess();
            return;
        }
        let bodyRows = document.querySelectorAll('[class="edit-cell"]')[0].closest('table').lastChild.rows;
        const processIndex = $('th:contains(" 工序名称 ")')[0].cellIndex;
        const semiIndex = $('th:contains(" 半成品/成品名称 ")')[0].cellIndex;
        window.autofill = true;
        for (let i of bodyRows) {
            let name = $('span', bodyRows.item(i.rowIndex).cells.item(semiIndex))[0].textContent;

            await sleep(50);
            $('span', i.cells.item(processIndex))[0].click();
            await sleep(50);
            $('button', i.cells.item(processIndex))[0].click();
            await setProcess(name, i, true);
        }
        window.autofill = false;
    }

    // 新增一行自动填写
    async function addClickActions() {
        if (!$('button:contains(" 新增一行 ")')[0] || $('button:contains(" 设置工艺版本 ")')[0].hasAttribute('helper')) {
            await sleep(500);
            addClickActions();
            return;
        }
        $('button:contains(" 设置工艺版本 ")')[0].addEventListener('click', async function (e) {
            if ($('div:contains(" 暂未设置工艺 ")')[0]) {
                await sleep(150);
                $('button:contains(" 新增工艺版本 ")')[0].click();
                await sleep(150);
                document.querySelectorAll('[placeholder="输入工艺版本名称"]')[0].value = document.querySelector('[placeholder="别名"]').closest('textarea').value;
                document.querySelectorAll('[placeholder="输入工艺版本名称"]')[0].dispatchEvent(new Event('input', {
                    bubbles: true
                }));
                await sleep(50);
                $('button:contains(" 选择 ")')[0].click();
            }
        });
        $('button:contains(" 设置工艺版本 ")')[0].setAttribute('helper', true);

        while (!$('th:contains(" 半成品/成品名称 ")')[0]) {
            await sleep(250);
        }
        const semiIndex = $('th:contains(" 半成品/成品名称 ")')[0].cellIndex;
        const materialIndex = $('th:contains(" 所需物料集 ")')[0].cellIndex;
        const procIndex = $('th:contains(" 上级序号 ")')[0].cellIndex;
        const processIndex = $('th:contains(" 工序名称 ")')[0].cellIndex;
        const alias = document.querySelector('[placeholder="别名"]').closest('textarea').value;

        $('button:contains(" 新增一行 ")')[0].addEventListener('click', async function newLineListener() {
            if (!window.autoSemi) {
                await sleep(100);
                let bodyRows = document.querySelectorAll('[class="edit-cell"]')[0].closest('table').lastChild.rows;
                let currRows = bodyRows.item(bodyRows.length - 1).cells;
                // 设置上级序号
                let lastIndexCell = currRows.item(procIndex);
                $('span', lastIndexCell)[0].click();
                await sleep(50);
                $('span', lastIndexCell)[0].click();
                while (!$('button:contains(" 选择 ")')[bodyRows.length - 1]) {
                    await sleep(50);
                }
                $('button:contains(" 选择 ")')[bodyRows.length - 1].click();
                await sleep(100);

                // 设置半成品
                let prevSemi = "";
                if (bodyRows.length > 1) {
                    prevSemi = $('span', bodyRows.item(bodyRows.length - 2).cells.item(semiIndex))[0].textContent;
                }
                let label1 = document.createElement('label');
                label1.classList.add("el-form-item__label");
                label1.appendChild(document.createTextNode(prevSemi + ' ' + alias));

                let lastSemiCell = currRows.item(semiIndex);
                $('span', lastSemiCell).click();
                await sleep(50);
                $('button', lastSemiCell).click();
                while (!document.querySelectorAll('[placeholder="存货别名"]')[1]) {
                    await sleep(50);
                }
                $('button:contains("搜索")')[0].parentElement.appendChild(label1);
                document.querySelectorAll('[placeholder="存货别名"]')[1].value = document.querySelector('[placeholder="别名"]').closest('textarea').value;
                await sleep(50);
                document.querySelectorAll('[placeholder="存货别名"]')[1].dispatchEvent(new Event('input', {
                    bubbles: true
                }));
                await sleep(50);
                $('button:contains(" 搜索 ")')[0].click();
                while ($('button:contains(" 选择自己 ")')[0]) {
                    await sleep(100);
                }

                // 设置物料
                if (!window.skipMat) {
                    let currSemi = $('span', currRows.item(semiIndex))[0].textContent;
                    let lastMatCell = currRows.item(materialIndex);
                    $('a', lastMatCell)[0].click();
                    await sleep(150);
                    await setMaterial(prevSemi, currSemi, true);
                    await sleep(150);
                    while ($('button:contains("新增行")')[0]) {
                        await sleep(200);
                    }

                    // 设置工序
                    $('span', currRows.item(processIndex))[0].click();
                    await sleep(50);
                    $('button', currRows.item(processIndex))[0].click();
                    await setProcess(currSemi, bodyRows.item(bodyRows.length - 1), true);
                    await sleep(150);
                }
                dbck();
            }
        });
    }

    // 整个表格自动填写
    async function dbck() {
        if (!document.querySelectorAll('[class="edit-cell"]')[0]) {
            await sleep(500);
            dbck();
            return;
        }
        let bodyRows = document.querySelectorAll('[class="edit-cell"]')[0].closest('table').lastChild.rows;
        const alias = document.querySelector('[placeholder="别名"]').closest('textarea').value;
        const semiIndex = $('th:contains(" 半成品/成品名称 ")')[0].cellIndex;
        const processIndex = $('th:contains(" 工序名称 ")')[0].cellIndex;
        const materialIndex = $('th:contains(" 所需物料集 ")')[0].cellIndex;
        const procIndex = $('th:contains(" 上级序号 ")')[0].cellIndex;
        // 设置上级序号
        for (let i of bodyRows) {
            let indexCell = i.cells.item(procIndex);
            if (!indexCell.hasAttribute('helper')) {
                indexCell.addEventListener('click', async function serialListener() {
                    if (!window.autoSerial) {
                        if ($('span', indexCell)[0].textContent.includes('始工序')) {
                            $('a', indexCell)[0].click();
                            await sleep(100);
                            while (!$('button:contains(" 选择 ")')[i.rowIndex]) {
                                await sleep(50);
                            }
                            $('button:contains(" 选择 ")')[i.rowIndex].click();
                        } else {
                            indexCell.querySelector('[class="el-icon-setting"]').closest('a').click();
                            await sleep(100);
                            while (!$('button:contains(" 选择 ")')[0]) {
                                await sleep(50);
                            }
                            $('button:contains(" 选择 ")')[0].click();
                        }
                    }
                });
                indexCell.setAttribute('helper', true);
            }
        }

        // 半成品
        for (let i of bodyRows) {
            let semiCell = i.cells.item(semiIndex);
            if (!semiCell.hasAttribute('helper')) {
                semiCell.addEventListener('click', async function semiListener() {
                    if (!window.autoSemi) {
                        let prevSemi = '';
                        if (i.rowIndex > 0) {
                            prevSemi = $('span', bodyRows.item(i.rowIndex - 1).cells.item(semiIndex))[0].textContent;
                        }
                        let label1 = document.createElement('label');
                        label1.classList.add("el-form-item__label");
                        label1.appendChild(document.createTextNode(prevSemi + ' ' + alias));

                        $('button', semiCell).click();
                        while (!document.querySelectorAll('[placeholder="存货别名"]')[1]) {
                            await sleep(50);
                        }
                        $('button:contains("搜索")')[0].parentElement.appendChild(label1);
                        document.querySelectorAll('[placeholder="存货别名"]')[1].value = alias;
                        await sleep(50);
                        document.querySelectorAll('[placeholder="存货别名"]')[1].dispatchEvent(new Event('input', {
                            bubbles: true
                        }));
                        await sleep(50);
                        $('button:contains(" 搜索 ")')[0].click();
                    }
                });
                semiCell.setAttribute('helper', true);
            }
        }

        // 物料集
        for (let i of bodyRows) {
            let matCell = i.cells.item(materialIndex);
            if (!matCell.hasAttribute('helper')) {
                matCell.addEventListener('click', async function matListener() {
                    let prevSemi = '';
                    let currSemi = $('span', i.cells.item(semiIndex))[0].textContent;
                    if (i.rowIndex > 0) {
                        prevSemi = $('span', bodyRows.item(i.rowIndex - 1).cells.item(semiIndex))[0].textContent;
                    }
                    if (!window.autofillMat) {
                        $('a', matCell)[0].click();
                        await sleep(150);
                        await setMaterial(prevSemi, currSemi, false);
                    }
                });
                matCell.setAttribute('helper', true);
            }
        }

        // 工序
        for (let i of bodyRows) {
            let lastProcessCell = i.cells.item(processIndex);
            if (!lastProcessCell.hasAttribute('helper')) {
                lastProcessCell.addEventListener('click', async function procListener() {
                    if (!window.autofill) {
                        let name = $('span', i.cells.item(semiIndex))[0].textContent;
                        $('button', lastProcessCell)[0].click();
                        await sleep(150);
                        await setProcess(name, i, false);
                    }
                });
                lastProcessCell.setAttribute('helper', true);
            }

        }
    }

    // 设置工序函数
    async function setProcess(name, tr, autoSelect) {
        let processName = getProcName(name);
        while (!document.querySelectorAll('[placeholder="工序名称"]')[0]) {
            await sleep(50);
        }
        document.querySelectorAll('[placeholder="工序名称"]')[0].value = processName;
        await sleep(50);
        document.querySelectorAll('[placeholder="工序名称"]')[0].dispatchEvent(new Event('input', {
            bubbles: true
        }));
        await sleep(50);
        $('button:contains(" 搜索 ")')[0].click();
        if (!document.getElementById('semiNameLabel')) {
            let label1 = document.createElement('label');
            label1.classList.add("el-form-item__label");
            label1.setAttribute('id', 'semiNameLabel');
            label1.appendChild(document.createTextNode(name));
            $('button:contains(" 搜索 ")')[0].parentElement.appendChild(label1);
        }
        await sleep(150);
        // 自动选择第一个工序名称
        while (!$('td:contains("GX")')[0]) {
            await sleep(100);
        }
        if (autoSelect && $('button:contains(" 选择 ")', $('td:contains("GX")')[0].parentElement.parentElement).length == 1) {
            $('button:contains(" 选择 ")', $('td:contains("GX")')[0].parentElement)[0].click();
            await sleep(200);
        } else {
            while ($('button:contains(" 搜索 ")')[0]) {
                await sleep(200);
            }
        }
        const processIndex = $('th:contains(" 工序名称 ")')[0].cellIndex;
        processName = ($('span', tr.cells.item(processIndex))[0]) ? ($('span', tr.cells.item(processIndex))[0].textContent) : processName;
        if (processName.includes('振光') || processName.includes('镀') || processName.includes('电解')) {
            await setOutsourcing(tr, "向前电镀厂");
        } else if (processName.includes('电泳')) {
            await setOutsourcing(tr, "涂霸");
        } else if (processName.includes('喷粉')) {
            await setOutsourcing(tr, "喷粉车间");
        }
    }
    // 设置物料函数
    async function setMaterial(prevSemi, currSemi, bConfirm) {
        while (!$('button:contains("新增行")')[0]) {
            await sleep(100);
        }
        if (!$('button:contains(" 移除 ")')[0]) {
            $('button:contains("新增行")')[0].click();
            await sleep(100);
        }
        while (!document.querySelector('[placeholder="物料选择"]')) {
            await sleep(100);
        }
        const alias = $('[placeholder="别名"]')[0].value;
        let label1 = document.createElement('label');
        label1.classList.add("el-form-item__label");
        label1.appendChild(document.createTextNode('请选择物料；' + "当前半成品: " + currSemi + ', 产品别名: ' + alias));
        $('span:contains("已新增物料行")')[0].parentElement.appendChild(label1);
        if (document.querySelector('[placeholder="物料选择"]').parentElement.parentElement.parentElement.parentElement.parentElement.querySelectorAll('[placeholder="物料选择"]').length == 1) {
            // 非原料
            if (!(new RegExp('^0[0|1]-').test(document.querySelector('[placeholder="物料选择"]').value))) {
                let quantity = $('input[type=text]', $('[placeholder="物料选择"]')[0].closest('tr'))[1].value;
                document.querySelector('[placeholder="物料选择"]').closest('div').querySelector('button').click();
                while (!$('button:contains("新增存货")')[0]) {
                    await sleep(100);
                }
                $('button:contains("新增存货")')[0].parentElement.appendChild(label1);
                document.querySelectorAll('[placeholder="存货名称"]')[1].value = prevSemi;
                document.querySelectorAll('[placeholder="存货名称"]')[1].dispatchEvent(new Event('input', {
                    bubbles: true
                }));
                document.querySelectorAll('[placeholder="存货别名"]')[1].value = alias;
                document.querySelectorAll('[placeholder="存货别名"]')[1].dispatchEvent(new Event('input', {
                    bubbles: true
                }));
                await sleep(50);
                $('button:contains(" 搜索 ")')[0].click();
                var dialog = $('button:contains("搜索")')[0].closest('[class="el-dialog__body"]');
                await sleep(150);
                while (!$('button:contains(" 选择 ")', dialog)[0]) {
                    await sleep(100);
                }
                if ($('button:contains(" 选择 ")', $('button:contains(" 选择 ")', dialog)[0].parentElement.parentElement.parentElement.parentElement).length == 1) {
                    $('button:contains(" 选择 ")', dialog)[0].click();
                    await sleep(100);
                    $('input[type=text]', $('[placeholder="物料选择"]')[0].closest('tr'))[1].value = quantity;
                    if (bConfirm) {
                        $('button:contains("确 定")', $('button:contains("新增行")')[0].parentElement.parentElement.parentElement)[0].click();
                        await sleep(200);
                    }
                }
            } else {
                if (bConfirm) {
                    $('button:contains("确 定")', $('button:contains("新增行")')[0].parentElement.parentElement.parentElement)[0].click();
                    await sleep(200);
                }
            }
        }
    }

    function multiUnitUtil() {
        const numPattern = /[0-9]+[.]?[0-9]*/g;
        const code = $('[placeholder="编码"]')[0].value;
        const alias = $('[placeholder="别名"]')[0].value;
        const specs = $('[placeholder="规格"]')[0].value;
        const name = $('[placeholder="名称"]')[0].value;
        let aalias = alias.match(numPattern);
        let aspecs = specs.match(numPattern);
        let rkg = 0; // kg
        let rmm = 0; // 面积
        let t = 0;
        let l = 0;
        let w = 0;
        let length = 0;
        let mtype = '';
        if ((new RegExp('^0[0|1]-10').test(code))) {
            // 线材
            t = aspecs[0];
            length = aspecs[1];
            if (alias.includes('304') || name.includes('201') || name.includes('钢')) {
                rkg = 1 / (t * t * 0.00000619);
                mtype = '钢线';
            } else {
                rkg = 1 / (t * t * 0.00000617);
                mtype = '铁线';
            }
        } else if ((new RegExp('^0[0|1]-011').test(code))) {
            // 棒料
            t = aspecs[0];
            length = aspecs[1];
            if (alias.includes('304') || name.includes('201') || name.includes('钢')) {
                rkg = 1 / (t * t * 0.00000619);
                rmm = length;
                mtype = '钢棒';
            }
        } else if ((new RegExp('^0[0|1]-201').test(code))) {
            // 分条料
            t = aspecs[0];
            w = aspecs[1];
            if (alias.includes('304') || name.includes('201') || name.includes('钢')) {
                rkg = 1 / (0.00000793 * t * w);
                mtype = '钢分条料';
            } else {
                rkg = 1 / (0.00000785 * t * w);
                mtype = '铁分条料';
            }
        } else if ((new RegExp('^0[0|1]-20[2|3]').test(code))) {
            // 板材
            t = aspecs[0];
            l = aspecs[1];
            w = aspecs[2];
            if (alias.includes('304') || name.includes('201') || name.includes('钢')) {
                rkg = 1 / (0.00000793 * t);
                rmm = l * w;
                mtype = '钢板';
            } else if (name.includes('铝')) {
                rkg = 1
                rmm = l * w;
                mtype = '铝板';
            } else {
                rkg = 1 / (0.00000785 * t);
                rmm = l * w;
                mtype = '铁板';
            }
        } else if ((new RegExp('^0[0|1]-204').test(code))) {
            // 扁铁
            t = aspecs[0];
            l = aspecs[1];
            w = aspecs[2];
            if (w) {
                // 扁铁板
                rkg = 1 / (0.00000785 * t);
                rmm = l * w;
                mtype = '扁铁板';

            } else {
                // 分条扁铁
                rkg = 1 / (0.00000785 * t * l);
                mtype = '分条扁铁';
            }
        } else if ((new RegExp('^0[0|1]-301').test(code)) || ((new RegExp('^0[0|1]-304').test(code)) && name.includes('方管'))) {
            // 方管
            t = aspecs[2];
            l = aspecs[0];
            w = aspecs[1];
            length = aspecs[3];
            if (alias.includes('304') || name.includes('201') || name.includes('钢')) {
                rkg = (1 / (0.00000793 * 2 * (Number(l) + Number(w)) * t));
                rmm = length ? length : 6000;
                mtype = '钢方管';
            } else {
                rkg = (1 / (0.00000785 * 2 * (Number(l) + Number(w)) * t));
                rmm = length ? length : 6000;
                mtype = '铁方管';
            }
        } else if ((new RegExp('^0[0|1]-302').test(code)) || ((new RegExp('^0[0|1]-304').test(code)) && name.includes('圆管'))) {
            // 圆管
            t = aspecs[1];
            l = aspecs[0];
            length = aspecs[2];
            if (alias.includes('304') || name.includes('201') || name.includes('钢')) {
                rkg = 1 / (0.00000793 * 3.14159 * l * t);
                rmm = length ? length : 6000;
                mtype = '钢圆管';
            } else {
                rkg = 1 / (0.00000785 * 3.14159 * l * t);
                rmm = length ? length : 6000;
                mtype = '铁圆管';
            }
        }
        return [rkg, rmm, [t, l, w, length], mtype];
    }

    // 设置外协
    async function setOutsourcing(tr, company) {
        const typeIndex = $('th:contains(" 加工类型 ")')[0].cellIndex;
        const companyIndex = $('th:contains(" 外协供应商 ")')[0].cellIndex;
        var typeCell = tr.cells.item(typeIndex);
        var companyCell = tr.cells.item(companyIndex);
        $('span', typeCell)[0].click();
        await sleep(50);
        $('span', typeCell)[0].click();
        $('li:contains("外协")')[0].click();
        await sleep(50);
        $('span', companyCell)[0].click();
        await sleep(10);
        $('button', companyCell)[0].click();
        await sleep(100);
        $('input[placeholder="往来单位名称"]')[0].value = company;
        $('input[placeholder="往来单位名称"]')[0].dispatchEvent(new Event('input', {
            bubbles: true
        }));
        await sleep(100);
        $('button:contains(" 搜索 ")')[0].click();
        var dialog = $('button:contains("搜索")')[0].closest('[class="el-dialog__body"]')
        while ($('button:contains(" 选择 ")', dialog).length !== 2) {
            await sleep(100);
        }
        $('button:contains(" 选择 ")', dialog)[0].click()
    }

    function getProcName(name) {
        var processName = '';
        if (name.includes('打磨抛光')) {
            processName = '打磨抛光';
        } else if (name.includes('冲断')) {
            processName = '冲压';
        } else if (name.includes('攻牙')) {
            processName = '攻牙';
        } else if (name.includes('3D弯线')) {
            processName = '3D弯线';
        } else if (name.includes('冲缺口')) {
            processName = '冲缺口';
        } else if (name.includes('开线')) {
            processName = '开线';
        } else if (name.includes('电解')) {
            processName = '电解';
        } else if (name.includes('振光')) {
            processName = '振光';
        } else if (name.includes('电镀')) {
            processName = '电镀';
        } else if (name.includes('电泳')) {
            processName = '电泳';
        } else if (name.includes('喷粉')) {
            processName = '喷粉';
        } else if (name.includes('喷涂')) {
            processName = '喷粉';
        } else if (name.includes('产品组装')) {
            processName = '产品组装';
        } else if (name.includes('激光')) {
            processName = '激光';
        } else if (name.includes('拉伸')) {
            processName = '拉伸';
        } else if (name.includes('开胚')) {
            processName = '开胚';
        } else if (name.includes('钻孔')) {
            processName = '钻孔';
        } else if (name.includes('洗水')) {
            processName = '洗水';
        } else if (name.includes('飞边')) {
            processName = '飞边';
        } else if (name.includes('打磨抛光')) {
            processName = '打磨抛光';
        } else if (name.includes('打磨拉丝')) {
            processName = '打磨拉丝';
        } else if (name.includes('打磨')) {
            processName = '打磨';
        } else if (name.includes('验收')) {
            processName = '验收';
        } else if (name.includes('剪板')) {
            processName = '剪板';
        } else if (name.includes('开料')) {
            processName = '开料';
        } else if (name.includes('折弯')) {
            processName = '折弯';
        } else if (name.includes('注塑')) {
            processName = '注塑';
        } else if (name.includes('成型')) {
            processName = '成型';
        } else if (name.includes('弯线')) {
            processName = '弯线';
        } else if (name.includes('碰焊')) {
            processName = '碰焊';
        } else if (name.includes('抛光')) {
            processName = '抛光';
        } else if ((new RegExp('.*冲(\\W|\\w)*孔.*')).test(name)) {
            processName = '冲孔';
        } else if (name.includes('清洗')) {
            processName = '清洗';
        } else if (name.includes('包装')) {
            processName = '包装';
        } else if (name.includes('烧焊')) {
            processName = '满焊';
        } else if (name.includes('锯')) {
            processName = '锯';
        } else if (name.includes('压')) {
            processName = '压';
        } else if (name.includes('磨')) {
            processName = '磨';
        } else if (name.includes('焊')) {
            processName = '焊';
        } else if (name.includes('组装')) {
            processName = '组装';
        } else if (name.includes('铆')) {
            processName = '铆';
        } else if (name.includes('攻牙')) {
            processName = '攻牙';
        } else if (name.includes('锣')) {
            processName = '锣';
        } else if (name.includes('压印')) {
            processName = '压印';
        } else if (name.includes('调')) {
            processName = '调';
        } else if ((new RegExp('.+镀(\\W|\\w)$')).test(name)) {
            processName = '镀';
        } else if (name.includes('冲')) {
            processName = '冲';
        } else if (name.includes('弯管')) {
            processName = '弯管';
        } else if (name.includes('弯')) {
            processName = '弯';
        } else {
            processName = '';
        }
        return processName;
    }
})();
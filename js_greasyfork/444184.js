// ==UserScript==
// @name         MEST Table Exporter
// @namespace    joyings.com.cn
// @version      1.9.0
// @description  美尔斯通导出表格
// @author       zmz125000
// @match        http://*/mest/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.core.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.1/FileSaver.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openwrt.org
// @grant        none
// @license      MIT
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/444184/MEST%20Table%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/444184/MEST%20Table%20Exporter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    var _loadScript = function (path) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = path;
        document.head.appendChild(script);
    }
    //_loadScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.core.min.js");
    //_loadScript("https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.1/FileSaver.js");
    _loadScript("https://cdnjs.cloudflare.com/ajax/libs/TableExport/5.2.0/js/tableexport.js");

    window.CheckBox = false;

    window.onload = function () {
        addButtons();
        addBasicButton();
        addObserverIfDesiredNodeAvailable();
    };
    // Select the node that will be observed for mutations

    function addObserverIfDesiredNodeAvailable() {
        var composeBox = document.querySelectorAll('[class="el-tabs__item is-top is-active is-closable"]')[0];
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
            window.setTimeout(addButtons, 500);
            composeObserver.disconnect();
            addObserverIfDesiredNodeAvailable();
        });
        composeObserver.observe(composeBox, config);
    }

    function addBasicButton() {
        var navbar = document.querySelectorAll('[class="el-tabs__nav-scroll"]')[0];
        var btn = document.createElement('button');
        btn.setAttribute('title', '手动添加按钮');
        btn.setAttribute('id', 'basicBtn');
        btn.setAttribute('type', 'button');
        btn.onclick = addButtons;
        btn.appendChild(document.createTextNode('添加按钮'));
        navbar.appendChild(btn);
    }

    function addButtons() {
        if (document.querySelector('[class="el-tabs__item is-top is-active is-closable"]').textContent == null)
            return;
        var btn = document.createElement('button');
        btn.setAttribute('title', '导出表体（表体刷新后请重新点击本按钮）');
        btn.setAttribute('type', 'button');
        btn.onclick = loadtableexport;
        btn.appendChild(document.createTextNode('TableExport'));

        var btn2 = document.createElement('button');
        btn2.setAttribute('title', '一键导出当前表格');
        btn2.setAttribute('id', 'oneKeyButton');
        btn2.setAttribute('type', 'button');
        btn2.onclick = oneKeyDownload;
        btn2.appendChild(document.createTextNode('⇩一键导出'));

        var dropdownDiv = document.createElement('div');
        var dropdownContent = document.createElement('div');
        dropdownDiv.setAttribute('class', "dropdown");
        dropdownContent.setAttribute('class', 'dropdown-content');
        dropdownContent.setAttribute('id', 'dropdownContentList');
        var btn3 = document.createElement('button');
        btn3.setAttribute('title', '添加当前表格到合并导出列表（多页表体请用AppendTableBody按钮添加每个分页）');
        btn3.setAttribute('id', 'addTable');
        btn3.setAttribute('type', 'button');
        btn3.onclick = addCurrentTable;
        btn3.appendChild(document.createTextNode('➕添加表格 (' + listCounter + ')'));
        dropdownDiv.appendChild(btn3);
        dropdownDiv.appendChild(dropdownContent);

        {
            var dropdownExportDiv = document.createElement('div');
            var dropdownExportBtns = document.createElement('div');
            dropdownExportDiv.setAttribute('class', "dropdown");
            dropdownExportBtns.setAttribute('class', 'dropdown-content');
            dropdownExportBtns.setAttribute('id', 'dropdownExportButtons');
            var btn4 = document.createElement('button');
            btn4.setAttribute('title', '合并导出');
            btn4.setAttribute('id', 'multiexport');
            btn4.setAttribute('type', 'button');
            btn4.onclick = exportSheets;
            btn4.appendChild(document.createTextNode('⇩批量导出'));
            dropdownExportDiv.appendChild(btn4);
            dropdownExportDiv.appendChild(dropdownExportBtns);

            // 生成生产排料表
            var btn7 = document.createElement('button');
            btn7.setAttribute('title', '合成生产排料表');
            // btn7.setAttribute('class', 'dropbtn');
            btn7.setAttribute('id', 'gerenateMaterialList');
            btn7.setAttribute('type', 'button');
            btn7.onclick = processCompositeList;
            btn7.appendChild(document.createTextNode('⇩生成排料单'));
            dropdownExportBtns.appendChild(btn7);

            // 生成采购计划表
            var btn9 = document.createElement('button');
            btn9.setAttribute('title', '合成采购计划表');
            // btn9.setAttribute('class', 'dropbtn');
            btn9.setAttribute('id', 'gerenatePurchasingList');
            btn9.setAttribute('type', 'button');
            btn9.onclick = processPurchasingList;
            btn9.appendChild(document.createTextNode('⇩生成采购单'));
            dropdownExportBtns.appendChild(btn9);
        }

        var btn5 = document.createElement('button');
        btn5.setAttribute('title', '清空合并导出列表');
        btn5.setAttribute('id', 'clearexportlist');
        btn5.setAttribute('type', 'button');
        btn5.onclick = clearExport;
        btn5.appendChild(document.createTextNode('✘清空导出列表'));

        var btn6 = document.createElement('button');
        btn6.setAttribute('title', '添加表体到当前表格');
        btn6.setAttribute('id', 'appendTableBody');
        btn6.setAttribute('type', 'button');
        btn6.onclick = appendTableBody;
        btn6.appendChild(document.createTextNode('➕添加表体'));

        var btn8 = document.createElement('button');
        btn8.setAttribute('title', '包含勾选框');
        btn8.setAttribute('id', 'expoertCheckBox');
        btn8.setAttribute('type', 'button');
        btn8.onclick = toggleCheckBox;
        btn8.appendChild(document.createTextNode(window.CheckBox ? "✔" : "✘"));

        var succeed = false;

        var header1 = document.querySelectorAll('[class="ml5"]')[0];
        var header2 = document.querySelectorAll('[class="el-form-item__content"]')[0];
        var header3 = document.querySelectorAll('[class="el-button-group"]')[0];
        var header4 = document.querySelectorAll('[class="tool-button-group"]')[0];
        var headers = {
            header1,
            header2,
            header3,
            header4
        };

        for (let headerName in headers) {
            var header = headers[headerName];
            if (!succeed && typeof (header) != "undefined" && header != null) {
                //header.appendChild(btn);
                header.appendChild(btn2);
                //header.appendChild(btn3);
                header.appendChild(dropdownDiv);
                header.appendChild(btn6);
                //header.appendChild(btn4);
                header.appendChild(dropdownExportDiv);
                header.appendChild(btn5);
                //header.appendChild(btn7);
                header.appendChild(btn8);
                succeed = true;
            }
        }
        if (window.sheetnames.length > 0)
            restoreBtnList();
    }

    function restoreBtnList() {
        for (let name of window.sheetnames) {
            let id = name.match(/\d+$/)[0];
            let btnElm = document.createElement('button');
            btnElm.setAttribute('title', name);
            btnElm.setAttribute('type', 'button');
            btnElm.setAttribute('id', 'dropdown' + id);
            btnElm.addEventListener('click', function () {
                deleteTable(btnElm);
            });
            btnElm.appendChild(document.createTextNode(name));
            document.getElementById("dropdownContentList").appendChild(btnElm);
        }
    }

    function loadtableexport() {
        formatAllToString();
        var oldcaption = document.querySelectorAll('[class="tableexport-caption"]')[0];
        while (typeof (oldcaption) != 'undefined' && oldcaption != null) {
            oldcaption.remove();
            oldcaption = document.querySelectorAll('[class="tableexport-caption"]')[0];
        };
        var pageName = document.querySelector('[class="el-tabs__item is-top is-active is-closable"]').textContent;
        TableExport(document.getElementsByTagName("table"), {
            headers: true, // (Boolean), display table headers (th or td elements) in the <thead>, (default: true)
            footers: true, // (Boolean), display table footers (th or td elements) in the <tfoot>, (default: false)
            formats: ["xlsx", "csv", "txt"], // (String[]), filetype(s) for the export, (default: ['xlsx', 'csv', 'txt'])
            filename: pageName + "导出表体", // (id, String), filename for the downloaded file, (default: 'id')
            bootstrap: false, // (Boolean), style buttons using bootstrap, (default: true)
            exportButtons: true, // (Boolean), automatically generate the built-in export buttons for each of the specified formats (default: true)
            position: "top", // (top, bottom), position of the caption element relative to table, (default: 'bottom')
            ignoreRows: null, // (Number, Number[]), row indices to exclude from the exported file(s) (default: null)
            ignoreCols: null, // (Number, Number[]), column indices to exclude from the exported file(s) (default: null)
            trimWhitespace: false, // (Boolean), remove all leading/trailing newlines, spaces, and tabs from cell text in the exported file(s) (default: false)
            RTL: false, // (Boolean), set direction of the worksheet to right-to-left (default: false)
            sheetname: pageName // (id, String), sheet name for the exported spreadsheet, (default: 'id')
        });
        var randomColor = Math.floor(Math.random() * 16777215).toString(16);
        document.querySelectorAll('[class="button-default xlsx"]')[1].style["background-color"] = "#" + randomColor;
    }

    function toggleCheckBox() {
        if (window.CheckBox) {
            window.CheckBox = false;
            document.getElementById("expoertCheckBox").firstChild.nodeValue = "✘";
        } else {
            window.CheckBox = true;
            document.getElementById("expoertCheckBox").firstChild.nodeValue = "✔";
        }
    }

    function getCurrentTable() {
        formatAllToString();
        var ignoreCol0 = null;
        var pageName = document.querySelector('[class="el-tabs__item is-top is-active is-closable"]').textContent;
        var tableCount = document.querySelectorAll('[class="has-gutter"]').length - 2;
        var tableIndex = tableCount >= 0 ? tableCount : 0;
        var tableElement = document.querySelectorAll("table.el-table__body")[tableIndex];
        var headerElement = document.querySelectorAll('[class="has-gutter"]')[tableIndex];
        var checkedElm = tableElement.querySelectorAll('[class="el-checkbox is-checked"]');

        if (window.CheckBox) {
            var headerCheckBox = headerElement.querySelectorAll('[class="el-checkbox"]');
            if (headerCheckBox.length != 0) {
                let headerCheckBoxText = document.createTextNode("勾选");
                headerCheckBox[0].appendChild(headerCheckBoxText);
            }

            for (let index = 0; index < checkedElm.length; index++) {
                let content = document.createTextNode("✔");
                checkedElm[index].appendChild(content);
            }
        } else {
            var hasCheckBox = !!document.querySelector('[class="el-checkbox__inner"]');
            ignoreCol0 = hasCheckBox ? 0 : null;
        }
        var instance1 = new TableExport(headerElement, {
            formats: ['xlsx'],
            exportButtons: false,
            ignoreCols: ignoreCol0,
            sheetname: pageName // (id, String), sheet name for the exported spreadsheet, (default: 'id')
        });
        var exportData1 = instance1.getExportData();
        var xlsxData1 = exportData1[Object.keys(exportData1)]['xlsx'];

        var instance2 = new TableExport(tableElement, {
            formats: ['xlsx'],
            exportButtons: false,
            ignoreCols: ignoreCol0
        });
        var exportData2 = instance2.getExportData();
        var xlsxData2 = exportData2[Object.keys(exportData2)]['xlsx'];
        xlsxData1.data = xlsxData1.data.concat(xlsxData2.data);
        formatColumns(xlsxData1.data);
        if (window.CheckBox) {
            for (let index = 0; index < checkedElm.length; index++) {
                checkedElm[index].innerHTML = checkedElm[index].innerHTML.replace(/✔/g, "");

            }
            if (headerCheckBox.length != 0) {
                headerCheckBox[0].innerHTML = headerCheckBox[0].innerHTML.replace("勾选", "");

            }
        }
        return {
            xlsxData1,
            instance1,
            pageName,
            exportData1
        };
    }

    function getCurrentTableBody(ignore0) {
        formatAllToString();
        var ignoreCol0 = ignore0;
        var pageName = document.querySelector('[class="el-tabs__item is-top is-active is-closable"]').textContent;
        var tableCount = document.querySelectorAll('[class="has-gutter"]').length - 2;
        var tableIndex = tableCount >= 0 ? tableCount : 0;
        var tableElement = document.querySelectorAll("table.el-table__body")[tableIndex];
        var checkedElm = tableElement.querySelectorAll('[class="el-checkbox is-checked"]');

        if (window.CheckBox) {
            for (let index = 0; index < checkedElm.length; index++) {
                let content = document.createTextNode("✔");
                checkedElm[index].appendChild(content);
            }
        } else {
            let hasCheckBox = !!document.querySelector('[class="el-checkbox__inner"]');
            ignoreCol0 = hasCheckBox ? 0 : null;
        }
        var instance1 = new TableExport(tableElement, {
            formats: ['xlsx'],
            exportButtons: false,
            ignoreCols: ignoreCol0
        });
        var exportData1 = instance1.getExportData();
        var xlsxData1 = exportData1[Object.keys(exportData1)]['xlsx'];
        if (window.CheckBox) {
            for (let index = 0; index < checkedElm.length; index++) {
                checkedElm[index].innerHTML = checkedElm[index].innerHTML.replace(/✔/g, "");
            }
        }
        return {
            xlsxData1,
            instance1,
            pageName,
            exportData1
        };
    }

    function oneKeyDownload() {
        var tableObject = getCurrentTable();
        var tableexport = tableObject.instance1;
        var xlsxData1 = tableObject.xlsxData1;
        tableexport.export2file(xlsxData1.data, xlsxData1.mimeType, tableObject.pageName + "导出表格 " + (new Date()).toLocaleTimeString(), xlsxData1.fileExtension, xlsxData1.merges, xlsxData1.RTL, tableObject.pageName);
        var randomColor = Math.floor(Math.random() * 16777215).toString(16);
        document.getElementById("oneKeyButton").style["background-color"] = "#" + randomColor;
    }

    function formatAllToString() {
        var cells = document.getElementsByTagName("td");
        var index = 0,
            length = cells.length;
        for (; index < length; index++) {
            cells[index].classList.add("tableexport-string");
        };
    }

    function formatColumnUtil(data, col, fmt) {
        var cols = data.map(x => x[col]);
        for (let i = 1; i < cols.length; i++) {
            cols[i].t = fmt;
        }
    }

    function formatColumns(data) {
        var dateColsIndex = [];
        var numsColsIndex = [];
        const datefmt = 'd';
        const numsfmt = 'n';
        const header = data[0];
        for (let index = 0; index < header.length; index++) {
            let str = header[index].v;
            if (str.includes("日期")) {
                dateColsIndex.push(index);
            } else if (str.includes("数量") || str.includes("金额") || str.includes("单价") || str.includes("下达量") || str.includes("现存量") || str.includes("总量") || str.includes("总量")) {
                numsColsIndex.push(index);
            }
        }
        for (let col of dateColsIndex) {
            formatColumnUtil(data, col, datefmt);
        }
        for (let col of numsColsIndex) {
            formatColumnUtil(data, col, numsfmt);
        }
        return data;
    }

    // export multiple pages
    window.exportTable = null;
    window.export_tables = null;
    window.tables_data = null;

    window.export_data = [];
    window.xlsx_info = {};
    window.sheetnames = [];
    window.listCounter = 0;

    function initMultiExport() {
        window.exportTable = document.querySelectorAll("has-gutter");
        window.export_tables = new TableExport(window.exportTable, {
            formats: ['xlsx'],
            bootstrap: false,
            exportButtons: false
        });
        window.tables_data = window.export_tables.getExportData();
    }

    window.tablePageCount = 0;

    function addCurrentTable() {
        if (window.exportTable == null) {
            initMultiExport();
        }
        var tableObject = getCurrentTable();
        var pageName = tableObject.pageName;
        var old_key = Object.keys(tableObject.exportData1)[0];
        listCounter += 1;
        Object.defineProperty(tableObject.exportData1, pageName + listCounter,
            Object.getOwnPropertyDescriptor(tableObject.exportData1, old_key));
        delete tableObject.exportData1[old_key];
        Object.assign(window.tables_data, tableObject.exportData1);
        window.sheetnames.push(pageName + listCounter);
        window.tablePageCount = 1;
        document.getElementById("appendTableBody").firstChild.nodeValue = "➕AppendTableBody (" + window.tablePageCount + ')';
        document.getElementById("addTable").firstChild.nodeValue = "➕添加表格 (" + listCounter + ')';

        // 添加下拉按钮
        var btnElm = document.createElement('button');
        btnElm.setAttribute('title', pageName + listCounter);
        btnElm.setAttribute('type', 'button');
        btnElm.setAttribute('id', 'dropdown' + listCounter);
        btnElm.addEventListener('click', function () {
            deleteTable(btnElm);
        });
        btnElm.appendChild(document.createTextNode(pageName + listCounter));
        document.getElementById("dropdownContentList").appendChild(btnElm);
    }

    function deleteTable(elm) {
        var name = elm.title;
        var id = elm.id;
        delete window.tables_data[name];
        var index = window.sheetnames.indexOf(name);
        if (index !== -1) {
            window.sheetnames.splice(index, 1);
        }
        elm.remove();
    }

    function appendTableBody() {
        if (window.sheetnames.length == 0) {
            alert("请先添加当前表格\n插件版本号: " + GM_info.script.version);
            return;
        }
        if (window.tables_data[Object.keys(window.tables_data)[Object.keys(window.tables_data).length - 1]]['xlsx'].data[0][0].v == '') {
            var tableObject = getCurrentTableBody(null);
        } else {
            tableObject = getCurrentTableBody();
        }
        var pageName = tableObject.pageName;
        var lastSheetName = window.sheetnames[window.sheetnames.length - 1];
        if (!lastSheetName.includes(pageName)) {
            alert("请先添加当前表格\n插件版本号: " + GM_info.script.version);
            return;
        }
        window.tables_data[Object.keys(window.tables_data)[Object.keys(window.tables_data).length - 1]]['xlsx'].data = window.tables_data[Object.keys(window.tables_data)[Object.keys(window.tables_data).length - 1]]['xlsx'].data.concat(tableObject.xlsxData1.data);
        formatColumns(window.tables_data[Object.keys(window.tables_data)[Object.keys(window.tables_data).length - 1]]['xlsx'].data);
        window.tablePageCount++;
        document.getElementById("appendTableBody").firstChild.nodeValue = "➕AppendTableBody (" + window.tablePageCount + ')';
    }

    function clearExport() {
        window.exportTable = null;
        window.export_tables = null;
        window.tables_data = null;
        window.export_data = [];
        window.xlsx_info = {};
        window.sheetnames = [];
        window.listCounter = 0;
        window.tablePageCount = 0;
        initMultiExport();
        document.getElementById("appendTableBody").firstChild.nodeValue = "➕AppendTableBody";
        document.getElementById("addTable").firstChild.nodeValue = "➕添加表格 (" + listCounter + ')';
        document.getElementById('dropdownContentList').textContent = '';
    }

    function exportSheets() {
        if (window.sheetnames.length == 0) {
            alert("请先添加表格\n插件版本号: " + GM_info.script.version);
            return;
        }
        window.export_data = [];
        for (let table_id in window.tables_data) {
            window.export_data.push(window.tables_data[table_id]["xlsx"].data);
        }
        window.xlsx_info = window.tables_data[Object.keys(window.tables_data)[0]]["xlsx"];
        // exportSheetsUtil(window.export_data, "合并导出表格 " + (new Date()).toLocaleTimeString(), window.sheetnames);
        exportFormulaSheet(window.export_data, "合并导出表格 " + (new Date()).toLocaleTimeString(), window.sheetnames);
    }

    // get procudtion excel
    // materialData[0] 订单 [1] 生产派工 [2] 材料单
    window.materialDataArr = Array(3);
    window.materialListObj = {};


    function wrongCompositeList(info) {
        alert(info + "\n请重新添加材料计划、生产派工、订单列表到合并导出列表\n材料单以生产工序派工表为基础合成,合成时会自动筛选并引用另外两个表的信息\n多页表体请用AppendTableBody按钮添加每个分页\n插件版本号: " + GM_info.script.version);
    }

    function processCompositeList() {
        window.materialDataArr = Array(3);
        window.materialListObj = {};
        try {
            var tableObjectKeys = Object.keys(window.tables_data);
        } catch (e) {
            wrongCompositeList();
            return;
        }
        let listOK = false;
        if (tableObjectKeys.length < 3) {
            wrongCompositeList("缺少相关表格数据\n" + tableObjectKeys);
            return;
        } else if (tableObjectKeys.length > 3 && !confirm('检测到多余表格，是否继续')) {
            return;
        }

        for (let key of tableObjectKeys) {
            switch (window.tables_data[key]['xlsx'].sheetname) {
                case '订单列表':
                    if (window.materialDataArr[0] != null) {
                        wrongCompositeList('检测到多余的订单列表\n' + tableObjectKeys)
                        return;
                    }
                    window.materialDataArr[0] = structuredClone(window.tables_data[key]['xlsx'].data);
                    break;
                case '生产工序派工':
                    if (window.materialDataArr[1] != null) {
                        wrongCompositeList('检测到多余的生产派工表\n' + tableObjectKeys)
                        return;
                    }
                    window.materialDataArr[1] = structuredClone(window.tables_data[key]['xlsx'].data);
                    break;
                case '材料计划':
                    if (window.materialDataArr[2] != null) {
                        wrongCompositeList('检测到多余的材料计划表\n' + tableObjectKeys)
                        return;
                    }
                    window.materialDataArr[2] = structuredClone(window.tables_data[key]['xlsx'].data);
                    break;
                default:
                    wrongCompositeList("无关表格\n" + tableObjectKeys)
                    return;
            }
        }
        listOK = true;
        for (let item of window.materialDataArr) {
            if (item == null)
                listOK = false;
        }
        if (!listOK) {
            wrongCompositeList("缺少相关表格数据\n" + tableObjectKeys);
            return;
        }
        window.materialListObj["生产派工单"] = structuredClone(window.tables_data[tableObjectKeys[0]]);
        window.materialListObj["生产排料单"] = structuredClone(window.tables_data[tableObjectKeys[0]]);
        window.materialListObj["车间领料表"] = structuredClone(window.tables_data[tableObjectKeys[0]]);
        window.materialListObj["生产派工单"]['xlsx'].sheetname = "生产派工单";
        window.materialListObj["生产排料单"]['xlsx'].sheetname = "生产排料单";
        window.materialListObj["车间领料表"]['xlsx'].sheetname = "车间领料表";
        window.materialListObj["生产派工单"]['xlsx'].data = structuredClone(window.materialDataArr[1]);
        window.materialListObj["生产排料单"]['xlsx'].data = [];
        window.materialListObj["车间领料表"]['xlsx'].data = [];

        generateMaterialListUtil();
    }

    function generateMaterialListUtil() {
        // 用来搜索的表格-派工表
        let PGBCPCodeCols = null;
        let PGWorkshopCols = null;
        for (let index = 0; index < window.materialDataArr[1][0].length; index++) {
            switch (window.materialDataArr[1][0][index].v) {
                case '半成品编码':
                    PGBCPCodeCols = window.materialDataArr[1].map(x => x[index]);
                    break;
                case '车间名称':
                    PGWorkshopCols = window.materialDataArr[1].map(x => x[index]);
                    break;
                default:
            }
        }


        // 用来搜索的表格-材料表
        let materialBCPCols = null;
        let materialCols = null;
        let materiaSCDlCols = null;
        let materiaCatCols = null;
        let materiaRequireCols = null;
        let materialProductSNCols = null;
        let materialUnitCols = null;
        let materialCatCodeCols = null;
        let materialAlias = null;
        let materialSNCols = null;
        let materialSizeCols = null;
        for (let index = 0; index < window.materialDataArr[2][0].length; index++) {
            switch (window.materialDataArr[2][0][index].v) {
                case '领取材料规格':
                    materialSizeCols = window.materialDataArr[2].map(x => x[index]);
                    break;
                case '领取材料别名':
                    materialAlias = window.materialDataArr[2].map(x => x[index]);
                    break;
                case '计量单位':
                    materialUnitCols = window.materialDataArr[2].map(x => x[index]);
                    break;
                case '领取材料分类编码':
                    materialCatCodeCols = window.materialDataArr[2].map(x => x[index]);
                    break;
                case '应用半成品编码':
                    materialBCPCols = window.materialDataArr[2].map(x => x[index]);
                    break;
                case '领取材料':
                    materialCols = window.materialDataArr[2].map(x => x[index]);
                    break;
                case '生产单号':
                    materiaSCDlCols = window.materialDataArr[2].map(x => x[index]);
                    break;
                case '领取材料分类名称':
                    materiaCatCols = window.materialDataArr[2].map(x => x[index]);
                    break;
                case '所需总领料数量':
                    materiaRequireCols = window.materialDataArr[2].map(x => x[index]);
                    break;
                case '商品编码':
                    materialProductSNCols = window.materialDataArr[2].map(x => x[index]);
                    break;
                case '领取材料编码':
                    materialSNCols = window.materialDataArr[2].map(x => x[index]);
                    break;
                default:
            }
        }

        // 用来搜索的表格-订单表
        let orderClient = null;
        let orderNo = null;
        let orderProductSN = null;
        let orderProductName = null;
        let orderProductCount = null;
        let orderCreatedDate = null;
        let orderDeliverDate = null;
        for (let index = 0; index < window.materialDataArr[0][0].length; index++) {
            switch (window.materialDataArr[0][0][index].v) {
                case '客户名称':
                    orderClient = window.materialDataArr[0].map(x => x[index]);
                    break;
                case '订单号':
                    orderNo = window.materialDataArr[0].map(x => x[index]);
                    break;
                case '存货编码':
                    orderProductSN = window.materialDataArr[0].map(x => x[index]);
                    break;
                case '存货名称':
                    orderProductName = window.materialDataArr[0].map(x => x[index]);
                    break;
                case '下单数量':
                    orderProductCount = window.materialDataArr[0].map(x => x[index]);
                    break;
                case '单据日期':
                    orderCreatedDate = window.materialDataArr[0].map(x => x[index]);
                    break;
                case '发货日期':
                    orderDeliverDate = window.materialDataArr[0].map(x => x[index]);
                    break;
                default:
            }
        }
        // 派工单
        {
            let aoa = window.materialListObj["生产派工单"]['xlsx'].data;
            if (aoa[0][aoa[0].length - 1].v == '')
                aoa[0].pop();
            let aoaHeaderOrigLength = aoa[0].length;
            aoa[0].push({
                'v': '原料分类编码',
                't': 's'
            });
            aoa[0].push({
                'v': '原料分类名称',
                't': 's'
            });
            aoa[0].push({
                'v': '原料别名',
                't': 's'
            });
            aoa[0].push({
                'v': '原料名',
                't': 's'
            });
            aoa[0].push({
                'v': '领料重量kg',
                't': 's'
            });
            aoa[0].push({
                'v': '领料数量',
                't': 's'
            });
            // 要生成的表格
            let BCPCols = null;
            let SCDCols = null;
            for (let index = 0; index < aoa[0].length; index++) {
                switch (aoa[0][index].v) {
                    case '半成品编码':
                        BCPCols = aoa.map(x => x[index]);
                        break;
                    case '生产单号':
                        SCDCols = aoa.map(x => x[index]);
                        break;
                }
            }

            for (let rowNum = 1; rowNum < aoa.length; rowNum++) {
                let searchTarget = BCPCols[rowNum].v;
                let searchSCD = SCDCols[rowNum].v;
                let aoaYuanLiaoCategoryCode = aoaHeaderOrigLength;
                let aoaYuanLiaoCategory = aoaHeaderOrigLength + 1;
                let aoaYuanLiaoAlias = aoaHeaderOrigLength + 2;
                let aoaYuanLiao = aoaHeaderOrigLength + 3;
                let aoaYuanLiaoRequireKG = aoaHeaderOrigLength + 4;
                let aoaYuanLiaoRequireNums = aoaHeaderOrigLength + 5;
                for (let origRowNum = 1; origRowNum < materialBCPCols.length; origRowNum++) {
                    if (searchTarget == materialBCPCols[origRowNum].v && searchSCD == materiaSCDlCols[origRowNum].v) {
                        aoa[rowNum][aoaYuanLiao] = structuredClone(materialCols[origRowNum]);
                        aoa[rowNum][aoaYuanLiaoAlias] = structuredClone(materialAlias[origRowNum]);
                        aoa[rowNum][aoaYuanLiao] = structuredClone(materialCols[origRowNum]);
                        aoa[rowNum][aoaYuanLiaoCategoryCode] = structuredClone(materialCatCodeCols[origRowNum]);
                        aoa[rowNum][aoaYuanLiaoCategory] = structuredClone(materiaCatCols[origRowNum]);
                        if (materialUnitCols[origRowNum].v == 'KG' || materialUnitCols[origRowNum].v == 'Kg' || materialUnitCols[origRowNum].v == 'kg')
                            aoa[rowNum][aoaYuanLiaoRequireKG] = structuredClone(materiaRequireCols[origRowNum]);
                        else
                            aoa[rowNum][aoaYuanLiaoRequireNums] = structuredClone(materiaRequireCols[origRowNum]);
                    }
                }
            }

            let aoaSlim = [];
            let headerTextObjArr = aoa[0];
            let newIndex = 0;
            let dataLength = aoa.length;
            for (let index = 0; index < headerTextObjArr.length; index++) {
                switch (headerTextObjArr[index].v) {
                    case '计划开始时间':
                    case '计划结束时间':
                    case '客户名称':
                    case '标识':
                    case '订单状态':
                    case '设备':
                    case '模具':
                    case '操作人':
                    case '操作':
                        continue;
                    default:
                        for (let rowNum = 0; rowNum < dataLength; rowNum++) {
                            let col = aoa.map(x => x[index]);
                            if (aoaSlim[rowNum] == null)
                                aoaSlim[rowNum] = [];
                            aoaSlim[rowNum][newIndex] = col[rowNum];
                        }
                        newIndex++;
                }
            }
            window.materialListObj["生产派工单"]['xlsx'].data = aoaSlim;
        }

        // 排料单
        {
            let aoa = window.materialListObj["生产排料单"]['xlsx'].data;
            let headerText = ["订单号", "半成品编码", "生产单号", "成品编码", "半成品名", "生产数", "出货数", "半成品序号", "产品名", "单件用量", "领取材料编码", "领取材料名称", "材料别名", "开小料尺寸", "开料数", "大料尺寸", "物料分类编码", "物料分类", "工序", '生产车间', '物料来源', '单位', "重量Kg", "件数"];
            // let headerText = ["订单号", "半成品编码", "生产单号", "成品编码", "配件名称", "生产数", "出货数", "零配件", "产品名", "单件用量", "领取材料编码", "开小料尺寸", "开料数", "大料尺寸", "大料数", "产品名", "卷料编号", "物料分类", "喷涂面积/件/m2", "重量Kg", "件数"];
            let headerRow = [];
            for (let text of headerText) {
                let obj = {};
                obj["v"] = text;
                obj["t"] = 's';
                headerRow.push(obj);
            }
            aoa.push(headerRow);

            // 初始化数据
            let headerLength = window.materialDataArr[1][0].length;
            for (let colNum = 0; colNum < headerLength; colNum++) {
                let aoaBCPCol = headerText.indexOf('半成品编码');
                let aoaOrderNo = headerText.indexOf('订单号');
                let aoaSCDCol = headerText.indexOf('生产单号');
                let aoaKaiLiaoShu = headerText.indexOf('开料数');
                let aoaComponentName = headerText.indexOf('产品名');
                let aoaProductName = headerText.indexOf('半成品名');
                let aoaWorkPieceSize = headerText.indexOf('开小料尺寸');
                let aoaWorkshopName = headerText.indexOf('生产车间');
                let aoaProcessName = headerText.indexOf('工序');
                let obj = window.materialDataArr[1][0][colNum];
                let dataLength = window.materialDataArr[1].length;
                switch (obj['v']) {
                    case '半成品规格':
                        for (let rowNum = 1; rowNum < dataLength; rowNum++) {
                            let col = window.materialDataArr[1].map(x => x[colNum]);
                            if (aoa[rowNum] == null)
                                aoa[rowNum] = [];
                            aoa[rowNum][aoaWorkPieceSize] = col[rowNum];
                        }
                        break;
                    case '半成品编码':
                        for (let rowNum = 1; rowNum < dataLength; rowNum++) {
                            let col = window.materialDataArr[1].map(x => x[colNum]);
                            if (aoa[rowNum] == null)
                                aoa[rowNum] = [];
                            aoa[rowNum][aoaBCPCol] = col[rowNum];
                        }
                        break;
                    case '工序名称':
                        for (let rowNum = 1; rowNum < dataLength; rowNum++) {
                            let col = window.materialDataArr[1].map(x => x[colNum]);
                            if (aoa[rowNum] == null)
                                aoa[rowNum] = [];
                            aoa[rowNum][aoaProcessName] = col[rowNum];
                        }
                        break;
                    case '工序总量':
                        for (let rowNum = 1; rowNum < dataLength; rowNum++) {
                            let col = window.materialDataArr[1].map(x => x[colNum]);
                            if (aoa[rowNum] == null)
                                aoa[rowNum] = [];
                            aoa[rowNum][aoaKaiLiaoShu] = col[rowNum];
                        }
                        break;
                    case '生产单号':
                        for (let rowNum = 1; rowNum < dataLength; rowNum++) {
                            let col = window.materialDataArr[1].map(x => x[colNum]);
                            if (aoa[rowNum] == null)
                                aoa[rowNum] = [];
                            aoa[rowNum][aoaSCDCol] = col[rowNum];
                        }
                        break;
                    case '输出半成品':
                        for (let rowNum = 1; rowNum < dataLength; rowNum++) {
                            let col = window.materialDataArr[1].map(x => x[colNum]);
                            if (aoa[rowNum] == null)
                                aoa[rowNum] = [];
                            aoa[rowNum][aoaProductName] = col[rowNum];
                        }
                        break;
                    case '最终成品':
                        for (let rowNum = 1; rowNum < dataLength; rowNum++) {
                            let col = window.materialDataArr[1].map(x => x[colNum]);
                            if (aoa[rowNum] == null)
                                aoa[rowNum] = [];
                            aoa[rowNum][aoaComponentName] = col[rowNum];
                        }
                        break;
                    case '订单号':
                        for (let rowNum = 1; rowNum < dataLength; rowNum++) {
                            let col = window.materialDataArr[1].map(x => x[colNum]);
                            if (aoa[rowNum] == null)
                                aoa[rowNum] = [];
                            aoa[rowNum][aoaOrderNo] = col[rowNum];
                        }
                        break;
                    case '车间名称':
                        for (let rowNum = 1; rowNum < dataLength; rowNum++) {
                            let col = window.materialDataArr[1].map(x => x[colNum]);
                            if (aoa[rowNum] == null)
                                aoa[rowNum] = [];
                            aoa[rowNum][aoaWorkshopName] = col[rowNum];
                        }
                        break;
                }
            }

            // 获取索引
            let BCPCols = null;
            let SCDCols = null;
            for (let index = 0; index < aoa[0].length; index++) {
                switch (aoa[0][index].v) {
                    case '半成品编码':
                        BCPCols = aoa.map(x => x[index]);
                        break;
                    case '生产单号':
                        SCDCols = aoa.map(x => x[index]);
                        break;
                }
            }

            // 根据材料计划填入数据
            // 重量Kg 待更改
            for (let rowNum = 1; rowNum < aoa.length; rowNum++) {
                let searchTarget = BCPCols[rowNum].v;
                let searchSCD = SCDCols[rowNum].v;
                let aoaProductSN = headerText.indexOf('成品编码');
                // let aoaProductCount = headerText.indexOf('出货数');
                let aoaMaterialCat = headerText.indexOf('物料分类');
                let aoaMaterialCatCode = headerText.indexOf('物料分类编码');
                let aoaMaterialSN = headerText.indexOf('领取材料编码');
                let aoaMaterialName = headerText.indexOf('领取材料名称');
                let aoaMaterialAlias = headerText.indexOf('材料别名');
                let aoaMaterialWeight = headerText.indexOf('重量Kg');
                let aoaMaterialNums = headerText.indexOf('件数');
                let aoaMaterialSize = headerText.indexOf('大料尺寸');
                let aoaMaterialUnit = headerText.indexOf('单位');
                for (let origRowNum = 1; origRowNum < materialBCPCols.length; origRowNum++) {
                    if (searchTarget == materialBCPCols[origRowNum].v && searchSCD == materiaSCDlCols[origRowNum].v) {
                        aoa[rowNum][aoaProductSN] = structuredClone(materialProductSNCols[origRowNum]);
                        aoa[rowNum][aoaMaterialSN] = structuredClone(materialSNCols[origRowNum]);
                        aoa[rowNum][aoaMaterialName] = structuredClone(materialCols[origRowNum]);
                        aoa[rowNum][aoaMaterialAlias] = structuredClone(materialAlias[origRowNum]);
                        aoa[rowNum][aoaMaterialCatCode] = structuredClone(materialCatCodeCols[origRowNum]);
                        if (materialUnitCols[origRowNum].v == 'KG' || materialUnitCols[origRowNum].v == 'Kg' || materialUnitCols[origRowNum].v == 'kg')
                            aoa[rowNum][aoaMaterialWeight] = structuredClone(materiaRequireCols[origRowNum]);
                        else
                            aoa[rowNum][aoaMaterialNums] = structuredClone(materiaRequireCols[origRowNum]);
                        aoa[rowNum][aoaMaterialCat] = structuredClone(materiaCatCols[origRowNum]);
                        aoa[rowNum][aoaMaterialCat].v = aoa[rowNum][aoaMaterialCat].v.split('-')[1];
                        aoa[rowNum][aoaMaterialSize] = structuredClone(materialSizeCols[origRowNum]);
                        aoa[rowNum][aoaMaterialUnit] = structuredClone(materialUnitCols[origRowNum]);
                    }
                }
            }
            // 一个SCD对应一个产品
            // for (let rowNum = 1; rowNum < aoa.length; rowNum++) {
            //     let searchSCD = SCDCols[rowNum].v;
            //     let aoaProductSN = headerText.indexOf('成品编码');
            //     for (let origRowNum = 1; origRowNum < materialBCPCols.length; origRowNum++) {
            //         if (searchSCD == materiaSCDlCols[origRowNum].v) {
            //             aoa[rowNum][aoaProductSN] = structuredClone(materialProductSNCols[origRowNum]);
            //         }
            //     }
            // }

            // 根据订单填入数据
            let orderNoCols = aoa.map(x => x[headerText.indexOf("订单号")]);
            let productSNCols = aoa.map(x => x[headerText.indexOf("成品编码")]);
            for (let rowNum = 1; rowNum < aoa.length; rowNum++) {
                try {
                    let searchTarget = productSNCols[rowNum].v;
                    let orderNoTarget = orderNoCols[rowNum].v;
                    let aoaProductCount = headerText.indexOf('出货数');
                    for (let origRowNum = 1; origRowNum < orderProductSN.length; origRowNum++) {
                        try {
                            if (searchTarget == orderProductSN[origRowNum].v && orderNoTarget == orderNo[origRowNum].v) {
                                aoa[rowNum][aoaProductCount] = structuredClone(orderProductCount[origRowNum]);
                            }
                        } catch (e) {
                            continue;
                        }
                    }
                } catch (e) {
                    continue;
                }
            }

            // 计算单件用量
            // 暂时用出货数计算，待更改
            let productCount = aoa.map(x => x[headerText.indexOf("出货数")]);
            let kaiLiaoShu = aoa.map(x => x[headerText.indexOf("开料数")]);
            let danJianYongLiangIndex = headerText.indexOf("单件用量");
            for (let rowNum = 1; rowNum < aoa.length; rowNum++) {
                try {
                    aoa[rowNum][danJianYongLiangIndex] = {
                        'v': +kaiLiaoShu[rowNum].v / +productCount[rowNum].v,
                        't': 'n'
                    };
                } catch (e) {
                    continue;
                }
            }

            // 填入物料来源
            let aoaOriginWorkshopName = headerText.indexOf('物料来源');
            let PGBCPColsValues = structuredClone(PGBCPCodeCols);
            let aoaMaterialCodeColsValues = structuredClone(aoa.map(x => x[headerText.indexOf('领取材料编码')]));
            for (let i = 0; i < PGBCPColsValues.length; i++)
                PGBCPColsValues[i] = PGBCPColsValues[i].v;
            for (let i = 0; i < aoaMaterialCodeColsValues.length; i++) {
                if (aoaMaterialCodeColsValues[i] == null)
                    aoaMaterialCodeColsValues[i] = '';
                else
                    aoaMaterialCodeColsValues[i] = aoaMaterialCodeColsValues[i].v;
            }
            for (let i = 1; i < aoa.length; i++) {
                let oi = PGBCPColsValues.indexOf(aoaMaterialCodeColsValues[i]);
                if (oi < 0 && aoaMaterialCodeColsValues[i] != '' && aoaMaterialCodeColsValues[i].split('-')[0] != '02') {
                    if (aoa[i] == null)
                        break
                    aoa[i][aoaOriginWorkshopName] = {
                        't': 's',
                        'v': '仓库'
                    }
                } else if (oi < 0)
                    continue;
                else
                    aoa[i][aoaOriginWorkshopName] = {
                        't': 's',
                        'v': PGWorkshopCols[oi].v
                    }
            }


            // 生产排料单（原料）
            window.materialListObj["生产排料单（原料）"] = structuredClone(window.materialListObj["车间领料表"]);
            window.materialListObj["生产排料单（原料）"]['xlsx'].sheetname = "生产排料单（原料）";
            window.materialListObj["生产排料单（原料）"]['xlsx'].data = [];

            {
                let aoa = window.materialListObj["生产排料单（原料）"]['xlsx'].data;
                let aoaOrig = window.materialListObj["生产排料单"]['xlsx'].data;
                let materialCatCode = headerText.indexOf("物料分类编码");
                let leadingRow = 1;
                aoa[0] = structuredClone(aoaOrig[0]);
                for (let i = 0; i < aoaOrig.length; i++) {
                    if (aoaOrig[i][materialCatCode] != null && aoaOrig[i][materialCatCode].v.split('-')[0] == '01') {
                        aoa[leadingRow] = structuredClone(aoaOrig[i]);
                        leadingRow++;
                    }
                }
            }
        }

        // 车间领料表
        {
            let paigongAoa = window.materialListObj["生产排料单"]['xlsx'].data;
            let aoa = window.materialListObj["车间领料表"]['xlsx'].data
            let headerText = ['物料编号', '物料分类编码', '物料分类', '物料名', '别名', '物料规格', '生产车间', '物料来源', '领料单位', '领料重量kg', '领料数', "实际出库数", "差额"]
            let headerRow = [];
            for (let text of headerText) {
                let obj = {};
                obj["v"] = text;
                obj["t"] = 's';
                headerRow.push(obj);
            }
            aoa.push(headerRow);
            // 准备数据
            let materialName = null;
            let materialCode = null;
            let materialAlias = null;
            let materialCat = null;
            let materialCatCode = null;
            let materialSpecs = null;
            let workshopName = null;
            let originworkshopName = null;
            let materialUnit = null;
            let materialQtyKg = null;
            let materialQty = null;
            for (let index = 0; index < paigongAoa[0].length; index++) {
                switch (paigongAoa[0][index].v) {
                    case '件数':
                        materialQty = paigongAoa.map(x => x[index]);
                        break;
                    case '重量Kg':
                        materialQtyKg = paigongAoa.map(x => x[index]);
                        break;
                    case '材料别名':
                        materialAlias = paigongAoa.map(x => x[index]);
                        break;
                    case '生产车间':
                        workshopName = paigongAoa.map(x => x[index]);
                        break;
                    case '物料来源':
                        originworkshopName = paigongAoa.map(x => x[index]);
                        break;
                    case '领取材料名称':
                        materialName = paigongAoa.map(x => x[index]);
                        break;
                    case '物料分类':
                        materialCat = paigongAoa.map(x => x[index]);
                        break;
                    case '物料分类编码':
                        materialCatCode = paigongAoa.map(x => x[index]);
                        break;
                    case '大料尺寸':
                        materialSpecs = paigongAoa.map(x => x[index]);
                        break;
                    case '领取材料编码':
                        materialCode = paigongAoa.map(x => x[index]);
                        break;
                    case '单位':
                        materialUnit = paigongAoa.map(x => x[index]);
                        break;
                    default:
                }
            }

            let aoaMaterialCode = headerText.indexOf('物料编号');
            let aoaMaterialName = headerText.indexOf('物料名');
            let aoaMaterialAlias = headerText.indexOf('别名');
            let aoaMaterialCat = headerText.indexOf('物料分类');
            let aoaMaterialCatCode = headerText.indexOf('物料分类编码');
            let aoaMaterialSpecs = headerText.indexOf('物料规格');
            let aoaWorkshopName = headerText.indexOf('生产车间');
            let aoaOriginWorkshopName = headerText.indexOf('物料来源');
            let aoaMaterialUnit = headerText.indexOf('领料单位');
            let aoaMaterialQtyKg = headerText.indexOf('领料重量kg');
            let aoaMaterialQty = headerText.indexOf('领料数');

            let aoaIndexMap = ['物料编号'];
            let aoaLeadingRowNum = 1;

            for (let rowNum = 1; rowNum < paigongAoa.length; rowNum++) {
                // working aoaRow
                if (materialCode[rowNum] == null)
                    continue;
                let aoaRow = -1;
                for (let i = 0; i < aoaIndexMap.length; i++) {
                    if (aoaIndexMap[i] == materialCode[rowNum].v && aoa[i][aoaWorkshopName].v == workshopName[rowNum].v) {
                        aoaRow = i;
                        break
                    }
                }
                if (aoaRow < 0) {
                    aoa[aoaLeadingRowNum] = [];
                    aoaIndexMap.push(materialCode[rowNum].v);
                    aoaRow = aoaLeadingRowNum;
                    aoaLeadingRowNum++;
                    aoa[aoaRow][aoaMaterialName] = structuredClone(materialName[rowNum]);
                    aoa[aoaRow][aoaMaterialCode] = structuredClone(materialCode[rowNum]);
                    aoa[aoaRow][aoaMaterialCat] = structuredClone(materialCat[rowNum]);
                    aoa[aoaRow][aoaMaterialSpecs] = structuredClone(materialSpecs[rowNum]);
                    aoa[aoaRow][aoaWorkshopName] = structuredClone(workshopName[rowNum]);
                    aoa[aoaRow][aoaMaterialQtyKg] = structuredClone(materialQtyKg[rowNum]);
                    aoa[aoaRow][aoaOriginWorkshopName] = structuredClone(originworkshopName[rowNum]);
                    aoa[aoaRow][aoaMaterialQty] = structuredClone(materialQty[rowNum]);
                    aoa[aoaRow][aoaMaterialUnit] = structuredClone(materialUnit[rowNum]);
                    aoa[aoaRow][aoaMaterialCatCode] = structuredClone(materialCatCode[rowNum]);
                    aoa[aoaRow][aoaMaterialAlias] = structuredClone(materialAlias[rowNum]);
                } else {
                    if (materialQtyKg[rowNum] != null)
                        aoa[aoaRow][aoaMaterialQtyKg].v = +aoa[aoaRow][aoaMaterialQtyKg].v + +materialQtyKg[rowNum].v;
                    if (materialQty[rowNum] != null)
                        aoa[aoaRow][aoaMaterialQty].v = +aoa[aoaRow][aoaMaterialQty].v + +materialQty[rowNum].v;
                }
            }

            // 车间领料表（原料）
            window.materialListObj["车间领料表（原料）"] = structuredClone(window.materialListObj["车间领料表"]);
            window.materialListObj["车间领料表（原料）"]['xlsx'].sheetname = "车间领料表（原料）";
            window.materialListObj["车间领料表（原料）"]['xlsx'].data = [];

            {
                let aoa = window.materialListObj["车间领料表（原料）"]['xlsx'].data;
                let aoaOrig = window.materialListObj["车间领料表"]['xlsx'].data;
                let materialCatCode = headerText.indexOf("物料分类编码");
                let difference = headerText.indexOf("差额");
                let realOut = headerText.indexOf("实际出库数");
                let wlWeight = headerText.indexOf("领料重量kg");
                let wlNums = headerText.indexOf("领料数");
                const buildDiff = String.fromCharCode(realOut + 65);
                let leadingRow = 1;
                aoa[0] = structuredClone(aoaOrig[0]);
                for (let i = 0; i < aoaOrig.length; i++) {
                    if (aoaOrig[i][materialCatCode] != null && aoaOrig[i][materialCatCode].v.split('-')[0] == '01') {
                        aoa[leadingRow] = structuredClone(aoaOrig[i]);
                        aoa[leadingRow][difference] = {
                            't': 'n',
                            'v': 0,
                            'f': '',
                        };
                        if (aoa[leadingRow][wlWeight].v > 0) {
                            aoa[leadingRow][difference].f = buildDiff.concat(leadingRow + 1, '-', String.fromCharCode(wlWeight + 65), leadingRow + 1);
                        } else {
                            aoa[leadingRow][difference].f = buildDiff.concat(leadingRow + 1, '-', String.fromCharCode(wlNums + 65), leadingRow + 1);
                        }
                        leadingRow++;
                    }
                }
            }
        }

        // export xlsx
        var xlsxData1 = window.materialListObj["生产派工单"]['xlsx'];
        var xlsxData2 = window.materialListObj["生产排料单"]['xlsx'];
        var xlsxData3 = window.materialListObj["车间领料表"]['xlsx'];
        var xlsxData4 = window.materialListObj["生产排料单（原料）"]['xlsx'];
        var xlsxData5 = window.materialListObj["车间领料表（原料）"]['xlsx'];
        // tableexport.export2file(xlsxData1.data, xlsxData1.mimeType, xlsxData1.sheetname + (new Date()).toLocaleTimeString(), xlsxData1.fileExtension, xlsxData1.merges, xlsxData1.RTL, xlsxData1.sheetname);
        // tableexport.export2file(xlsxData2.data, xlsxData2.mimeType, xlsxData2.sheetname + (new Date()).toLocaleTimeString(), xlsxData2.fileExtension, xlsxData2.merges, xlsxData2.RTL, xlsxData2.sheetname);
        exportFormulaSheet([xlsxData1.data, xlsxData2.data, xlsxData3.data, xlsxData4.data, xlsxData5.data], "合并派工领料单" + (new Date()).toLocaleTimeString(), [xlsxData1.sheetname, xlsxData2.sheetname, xlsxData3.sheetname, xlsxData4.sheetname, xlsxData5.sheetname]);
    }

    // 合成采购计划表
    window.purchasingListObject = {}
    window.purchasingData = null;

    function wrongPurchasingData(info) {
        alert(info + "\n请重新添加采购计划到合并导出列表\n多页表体请用AppendTableBody按钮添加每个分页\n插件版本号: " + GM_info.script.version);
    }

    function processPurchasingList() {
        window.purchasingListObject = {};
        window.purchasingData = null;
        try {
            var tableObjectKeys = Object.keys(window.tables_data);
        } catch (e) {
            wrongPurchasingData();
            return;
        }
        let listOK = false;
        if (tableObjectKeys.length < 1) {
            wrongPurchasingData("缺少相关表格数据\n" + tableObjectKeys);
            return;
        } else if (tableObjectKeys.length > 1 && !confirm('检测到多余表格，是否继续')) {
            return;
        }

        for (let key of tableObjectKeys) {
            switch (window.tables_data[key]['xlsx'].sheetname) {
                case '采购计划':
                    if (window.purchasingData != null) {
                        wrongPurchasingData('重复表格\n' + tableObjectKeys);
                        return;
                    }
                    window.purchasingData = window.tables_data[key]['xlsx'].data;
                    break;
                default:
                    wrongPurchasingData("无关表格\n" + tableObjectKeys);
                    return;
            }
        }
        listOK = true;
        for (let item of window.purchasingData) {
            if (item == null)
                listOK = false;
        }
        if (!listOK) {
            wrongPurchasingData("缺少相关表格数据\n" + tableObjectKeys);
            return;
        }
        window.purchasingListObject["采购计划表"] = structuredClone(window.tables_data[tableObjectKeys[0]]);
        window.purchasingListObject["采购计划表"]['xlsx'].sheetname = "采购计划表";
        window.purchasingListObject["采购汇总报表"] = structuredClone(window.tables_data[tableObjectKeys[0]]);
        window.purchasingListObject["采购汇总报表"]['xlsx'].sheetname = "采购汇总报表";
        window.purchasingListObject["采购汇总报表"]['xlsx'].data = [];
        generatePurchasingList();
    }

    function createNewPurchasingSheet(sheetname, headerText) {
        if (window.purchasingListObject[sheetname] == null) {
            window.purchasingListObject[sheetname] = structuredClone(window.purchasingListObject["采购汇总报表"]);
            window.purchasingListObject[sheetname]['xlsx'].sheetname = sheetname;
            window.purchasingListObject[sheetname]['xlsx'].data = [];

            let aoa = window.purchasingListObject[sheetname]['xlsx'].data;
            let headerRow = [];
            for (let text of headerText) {
                let obj = {};
                obj["v"] = text;
                obj["t"] = 's';
                headerRow.push(obj);
            }
            aoa.push(headerRow);
        }
    }


    function generatePurchasingList() {
        // 采购汇总报表
        {
            let aoa = window.purchasingListObject["采购汇总报表"]['xlsx'].data;
            var headerText = ["状态", "商品分类名称", "订单号", "仓库", "采购物料", "物料规格", "物料别名", '下单数', "采购单位", "网页操作", '下单数减下达量', "供应商", "单价", "税率", "总金额", "税后总金额", "订单单据日期", "物料编码", "物料分类名称", "总采购数量", "系统下达量", "物料可用量", "物料现存量", "单据来源", "生产单号"];
            var warehouseHeaderText = ["商品分类名称", "物料分类名称", "订单号", "仓库", "采购物料", "物料规格", "物料别名", "入库数", "采购单位", "供应商", "入库数减采购数", "单价", "总金额", "物料编码", '采购数', "物料现存量", "单据来源"];
            // var headerText = ["序号", "单据来源", "订单号", "采购物料分类名称", "订单单据日期", "状态", "商品分类名称", "采购物料", "生产单号", "采购物料编码", "采购物料可用量", "采购物料现存量", "物料规格", "总采购数量", "本次下达量", '下达量减可用量', "采购单位", "供应商"];
            let headerRow = [];
            for (let text of headerText) {
                let obj = {};
                obj["v"] = text;
                obj["t"] = 's';
                headerRow.push(obj);
            }
            aoa.push(headerRow);
        }

        // 根据原料分类添加表格
        {
            let aoa = window.purchasingListObject["采购计划表"]['xlsx'].data;
            var purchasingPlanHeader = [];
            var materialCatList = [];
            for (let headerObj of aoa[0]) {
                purchasingPlanHeader.push(headerObj.v);
            }
            let index = purchasingPlanHeader.indexOf('采购物料分类名称');
            let rowLimit = aoa.length;
            for (let row = 1; row < rowLimit; row++) {
                let cellObj = aoa[row][index];
                if (materialCatList.includes(cellObj.v))
                    continue;
                materialCatList.push(cellObj.v);
            }

            createNewPurchasingSheet('订单汇总', headerText);
            createNewPurchasingSheet('采购入库单', warehouseHeaderText);
            createNewPurchasingSheet('其他分类物料汇总', headerText);
            for (let sheetname of materialCatList) {
                switch (sheetname.split('-')[0]) {
                    case '线材汇总':
                        createNewPurchasingSheet('线材汇总', headerText);
                        break;
                    case '板材汇总':
                        createNewPurchasingSheet('板材汇总', headerText);
                        break;
                    case '管材汇总':
                        createNewPurchasingSheet('管材汇总', headerText);
                        break;
                    case '五金汇总':
                        createNewPurchasingSheet('五金汇总', headerText);
                        break;
                    case '包装物料汇总':
                        createNewPurchasingSheet('包装物料汇总', headerText);
                        break;
                }
            }
            // 添加子分类
            for (let sheetname of materialCatList) {
                createNewPurchasingSheet(sheetname.split('-')[1], headerText);
            }
        }

        // 准备数据
        let createType = null; // 单据来源 aps 或 add
        let purchasingStatus = null;
        let orderNo = null;
        let orderDate = null;
        let productCat = null;
        let purchasingTotal = null;
        let purchasingCurrent = null;
        let materialCode = null;
        let materialName = null;
        let materialCat = null;
        let materialSize = null;
        let materialAlias = null;
        let taxPrice = null;
        let materialUnit = null;
        let materialCaq = null;
        let materialCqd = null;
        let unitPrice = null;
        let warehouse = null;
        let taxRate = null;
        let SCD = null;

        for (let index = 0; index < window.purchasingData[0].length; index++) {
            switch (window.purchasingData[0][index].v) {
                case '单据来源':
                    createType = window.purchasingData.map(x => x[index]);
                    break;
                case '仓库选择':
                    warehouse = window.purchasingData.map(x => x[index]);
                    break;
                case '状态':
                    purchasingStatus = window.purchasingData.map(x => x[index]);
                    break;
                case '采购物料别名':
                    materialAlias = window.purchasingData.map(x => x[index]);
                    break;
                case '税后总金额':
                    taxPrice = window.purchasingData.map(x => x[index]);
                    break;
                case '订单号':
                    orderNo = window.purchasingData.map(x => x[index]);
                    break;
                case '单价':
                    unitPrice = window.purchasingData.map(x => x[index]);
                    break;
                case '税率':
                    taxRate = window.purchasingData.map(x => x[index]);
                    break;
                case '生产单号':
                    SCD = window.purchasingData.map(x => x[index]);
                    break;
                case '订单单据日期':
                    orderDate = window.purchasingData.map(x => x[index]);
                    break;
                case '商品分类名称':
                    productCat = window.purchasingData.map(x => x[index]);
                    break;
                case '总采购数量':
                    purchasingTotal = window.purchasingData.map(x => x[index]);
                    break;
                case '本次下达量':
                    purchasingCurrent = window.purchasingData.map(x => x[index]);
                    break;
                case '采购物料':
                    materialName = window.purchasingData.map(x => x[index]);
                    break;
                case '采购物料分类名称':
                    materialCat = window.purchasingData.map(x => x[index]);
                    break;
                case '物料规格':
                    materialSize = window.purchasingData.map(x => x[index]);
                    break;
                case '采购单位':
                    materialUnit = window.purchasingData.map(x => x[index]);
                    break;
                case '采购物料可用量':
                    materialCaq = window.purchasingData.map(x => x[index]);
                    break;
                case '采购物料现存量':
                    materialCqd = window.purchasingData.map(x => x[index]);
                    break;
                case '采购物料编码':
                    materialCode = window.purchasingData.map(x => x[index]);
                    break;
                default:
            }
        }

        // 填入数据到汇报总表
        {
            let aoa = window.purchasingListObject["采购汇总报表"]['xlsx'].data;
            let aoaIndexMap = ['物料编码'];
            let aoaLeadingRowNum = 1;
            let aoaCreateType = headerText.indexOf('单据来源');
            let aoaOrderNo = headerText.indexOf('订单号');
            let aoaSCD = headerText.indexOf('生产单号');
            // let aoaOrderDate = headerText.indexOf('订单单据日期');
            let aoaProductCat = headerText.indexOf('商品分类名称');
            let aoaPurchasingTotal = headerText.indexOf('总采购数量');
            let aoaPurchasingCurrent = headerText.indexOf('系统下达量');
            let aoaMaterialName = headerText.indexOf('采购物料');
            let aoaMaterialCode = headerText.indexOf('物料编码');
            let aoaMaterialCat = headerText.indexOf('物料分类名称');
            let aoaMaterialSize = headerText.indexOf('物料规格');
            let aoaMaterialUnit = headerText.indexOf('采购单位');
            let aoaStatus = headerText.indexOf('状态');
            let aoaMaterialAlias = headerText.indexOf('物料别名');
            let aoaTaxPrice = headerText.indexOf('税后总金额');
            let aoaMaterialCaq = headerText.indexOf('物料可用量');
            let aoaOperation = headerText.indexOf('网页操作');
            let aoaTaxRate = headerText.indexOf('税率');
            let aoaPurchasingReal = headerText.indexOf('下单数');
            let aoaMaterialCqd = headerText.indexOf('物料现存量');
            let aoaUnitPrice = headerText.indexOf('单价');
            let aoaWarehouse = headerText.indexOf('仓库');
            let aoaTotalPrice = headerText.indexOf('总金额');
            // let aoaReqMinusCaq = headerText.indexOf('下达量减可用量');
            // let aoaReqMinusCqd = headerText.indexOf('下达量减现存量');

            for (let rowNum = 1; rowNum < purchasingData.length; rowNum++) {
                if (purchasingStatus[rowNum].v == '异常' || purchasingStatus[rowNum].v == '已完成') {
                    continue;
                }

                // working aoaRow
                let aoaRow = aoaIndexMap.indexOf(materialCode[rowNum].v);
                if (aoaRow < 0 || createType[rowNum].v == "手工新增") {
                    aoa[aoaLeadingRowNum] = [];
                    aoaIndexMap.push(materialCode[rowNum].v)
                    aoaRow = aoaLeadingRowNum;
                    aoaLeadingRowNum++;
                    aoa[aoaRow][aoaCreateType] = structuredClone(createType[rowNum]);
                    aoa[aoaRow][aoaOrderNo] = structuredClone(orderNo[rowNum]);
                    // aoa[aoaRow][aoaOrderDate] = structuredClone(orderDate[rowNum]);
                    aoa[aoaRow][aoaProductCat] = structuredClone(productCat[rowNum]);
                    aoa[aoaRow][aoaSCD] = structuredClone(SCD[rowNum]);
                    aoa[aoaRow][aoaPurchasingTotal] = structuredClone(purchasingTotal[rowNum]);
                    aoa[aoaRow][aoaPurchasingCurrent] = structuredClone(purchasingCurrent[rowNum]);
                    aoa[aoaRow][aoaMaterialName] = structuredClone(materialName[rowNum]);
                    aoa[aoaRow][aoaMaterialCode] = structuredClone(materialCode[rowNum]);
                    aoa[aoaRow][aoaTaxRate] = structuredClone(taxRate[rowNum]);
                    aoa[aoaRow][aoaMaterialCat] = structuredClone(materialCat[rowNum]);
                    aoa[aoaRow][aoaTaxPrice] = structuredClone(taxPrice[rowNum]);
                    // aoa[aoaRow][aoaMaterialAlias] = structuredClone(materialAlias[rowNum]);
                    aoa[aoaRow][aoaMaterialSize] = structuredClone(materialSize[rowNum]);
                    aoa[aoaRow][aoaWarehouse] = structuredClone(warehouse[rowNum]);
                    aoa[aoaRow][aoaMaterialUnit] = structuredClone(materialUnit[rowNum]);
                    aoa[aoaRow][aoaMaterialCaq] = structuredClone(materialCaq[rowNum]);
                    aoa[aoaRow][aoaMaterialCqd] = structuredClone(materialCqd[rowNum]);
                    aoa[aoaRow][aoaStatus] = structuredClone(purchasingStatus[rowNum]);
                    aoa[aoaRow][aoaUnitPrice] = structuredClone(unitPrice[rowNum]);
                } else {
                    aoa[aoaRow][aoaPurchasingTotal].v = +aoa[aoaRow][aoaPurchasingTotal].v + +purchasingTotal[rowNum].v;
                    aoa[aoaRow][aoaPurchasingCurrent].v = +aoa[aoaRow][aoaPurchasingCurrent].v + +purchasingCurrent[rowNum].v;
                    if (!aoa[aoaRow][aoaSCD].v.includes(SCD[rowNum]))
                        aoa[aoaRow][aoaSCD].v = aoa[aoaRow][aoaSCD].v.concat(',', SCD[rowNum].v);
                    if (!aoa[aoaRow][aoaOrderNo].v.includes(orderNo[rowNum].v)) {
                        aoa[aoaRow][aoaOrderNo].v = aoa[aoaRow][aoaOrderNo].v.concat(',', orderNo[rowNum].v)
                    }
                }
                // aoa[aoaRow][aoaReqMinusCaq] = {
                //     't': 'n',
                //     'v': 'v'
                // };
            }
            for (let i = 1; i < aoa.length; i++) {

                // 实际采购数（下单数）
                aoa[i][aoaPurchasingReal] = structuredClone(aoa[i][aoaMaterialCaq]);
                aoa[i][aoaPurchasingReal].t = 'n';
                if (+aoa[i][aoaPurchasingReal].v < 0) {
                    aoa[i][aoaPurchasingReal].v = (0 - +aoa[i][aoaPurchasingReal].v).toString();
                } else aoa[i][aoaPurchasingReal].v = 0;

                // 下单数减下达量
                let aoaRealMinusReq = headerText.indexOf("下单数减下达量")
                aoa[i][aoaRealMinusReq] = {
                    't': 'n',
                    'v': 0,
                    'f': '',
                };
                const buildRMR = String.fromCharCode(aoaPurchasingReal + 65);
                aoa[i][aoaRealMinusReq].f = buildRMR.concat(i + 1, '-', String.fromCharCode(aoaPurchasingCurrent + 65), i + 1);
                // 填总价
                aoa[i][aoaTotalPrice] = {
                    't': 'n',
                    'v': 0,
                    'f': '',
                };
                const buildFunc = String.fromCharCode(aoaUnitPrice + 65);
                aoa[i][aoaTotalPrice].f = buildFunc.concat(i + 1, '*', String.fromCharCode(aoaPurchasingReal + 65), i + 1);
                // 填税后总价
                aoa[i][aoaTaxPrice] = {
                    't': 'n',
                    'v': 0,
                    'f': '',
                };
                const buildTaxFunc = String.fromCharCode(aoaTotalPrice + 65);
                aoa[i][aoaTaxPrice].f = buildTaxFunc.concat(i + 1, '*', String.fromCharCode(aoaTaxRate + 65), i + 1, '*0.01+', String.fromCharCode(aoaTotalPrice + 65), i + 1);

                // // 填入下达量减可用量
                // aoa[i][aoaReqMinusCaq] = {
                //     't': 'n',
                //     'v': 0
                // };
                // let CaqMinusReq = +aoa[i][aoaPurchasingCurrent].v - +aoa[i][aoaMaterialCaq].v;
                // aoa[i][aoaReqMinusCaq].v = (CaqMinusReq > 0) ? CaqMinusReq : '0';
                // // 填入下达量减现存量
                // aoa[i][aoaReqMinusCqd] = {
                //     't': 'n',
                //     'v': 0
                // };
                // let CqdMinusReq = +aoa[i][aoaPurchasingCurrent].v - +aoa[i][aoaMaterialCqd].v;
                // aoa[i][aoaReqMinusCqd].v = (CqdMinusReq > 0) ? CqdMinusReq : '0';
                // 填入网页操作
                aoa[i][aoaOperation] = {
                    't': 's',
                    'v': 0
                };
                if (aoa[i][aoaPurchasingReal].v == 0)
                    aoa[i][aoaOperation].v = '❗转完成';
                else if (aoa[i][aoaPurchasingReal].v != aoa[i][aoaPurchasingCurrent].v)
                    aoa[i][aoaOperation].v = '❗修改下达量';
                else
                    aoa[i][aoaOperation].v = '✅直接下达';
            }

        }

        // 采购入库单
        {
            let aoa = window.purchasingListObject["采购入库单"]['xlsx'].data;
            let aoaOrig = window.purchasingListObject["采购汇总报表"]['xlsx'].data;
            const buildFunc = String.fromCharCode(warehouseHeaderText.indexOf("单价") + 65);
            const buildUnitPrice = '采购汇总报表!' + String.fromCharCode(headerText.indexOf("单价") + 65);
            const buildCount = '采购汇总报表!' + String.fromCharCode(headerText.indexOf("下单数") + 65);
            for (let i = 1; i < aoaOrig.length; i++) {
                aoa[i] = [];
                aoa[i][warehouseHeaderText.indexOf('商品分类名称')] = structuredClone(aoaOrig[i][headerText.indexOf("商品分类名称")]);
                aoa[i][warehouseHeaderText.indexOf('订单号')] = structuredClone(aoaOrig[i][headerText.indexOf("订单号")]);
                aoa[i][warehouseHeaderText.indexOf('仓库')] = structuredClone(aoaOrig[i][headerText.indexOf("仓库")]);
                aoa[i][warehouseHeaderText.indexOf('采购物料')] = structuredClone(aoaOrig[i][headerText.indexOf("采购物料")]);
                aoa[i][warehouseHeaderText.indexOf('物料规格')] = structuredClone(aoaOrig[i][headerText.indexOf("物料规格")]);
                aoa[i][warehouseHeaderText.indexOf('物料别名')] = structuredClone(aoaOrig[i][headerText.indexOf("物料别名")]);
                aoa[i][warehouseHeaderText.indexOf('采购数')] = structuredClone(aoaOrig[i][headerText.indexOf("下单数")]);
                aoa[i][warehouseHeaderText.indexOf('入库数')] = structuredClone(aoaOrig[i][headerText.indexOf("下单数")]);
                aoa[i][warehouseHeaderText.indexOf('采购单位')] = structuredClone(aoaOrig[i][headerText.indexOf("采购单位")]);
                aoa[i][warehouseHeaderText.indexOf('供应商')] = structuredClone(aoaOrig[i][headerText.indexOf("供应商")]);
                aoa[i][warehouseHeaderText.indexOf('单价')] = structuredClone(aoaOrig[i][headerText.indexOf("单价")]);
                aoa[i][warehouseHeaderText.indexOf('物料编码')] = structuredClone(aoaOrig[i][headerText.indexOf("物料编码")]);
                aoa[i][warehouseHeaderText.indexOf('单据来源')] = structuredClone(aoaOrig[i][headerText.indexOf("单据来源")]);
                aoa[i][warehouseHeaderText.indexOf('物料现存量')] = structuredClone(aoaOrig[i][headerText.indexOf("物料现存量")]);
                aoa[i][warehouseHeaderText.indexOf('入库数减采购数')] = structuredClone(aoaOrig[i][headerText.indexOf("下单数")]);
                aoa[i][warehouseHeaderText.indexOf('物料分类名称')] = structuredClone(aoaOrig[i][headerText.indexOf("物料分类名称")]);
                aoa[i][warehouseHeaderText.indexOf('物料分类名称')] = aoa[i][warehouseHeaderText.indexOf('物料分类名称')].v.split('-')[1];
                aoa[i][warehouseHeaderText.indexOf('总金额')] = structuredClone(aoaOrig[i][headerText.indexOf("总金额")]);
                // 公式
                aoa[i][warehouseHeaderText.indexOf('采购数')].f = buildCount.concat(i + 1);
                aoa[i][warehouseHeaderText.indexOf('入库数')].f = buildCount.concat(i + 1);
                aoa[i][warehouseHeaderText.indexOf('单价')].f = buildUnitPrice.concat(i + 1);
                aoa[i][warehouseHeaderText.indexOf('总金额')].f = buildFunc.concat(i + 1, '*', String.fromCharCode(warehouseHeaderText.indexOf('入库数') + 65), i + 1);
            }
            const buildInboundModifier = String.fromCharCode(warehouseHeaderText.indexOf('入库数') + 65);
            for (let i = 1; i < aoa.length; i++) {
                aoa[i][warehouseHeaderText.indexOf('入库数减采购数')].f = buildInboundModifier.concat(i + 1, '-', String.fromCharCode(warehouseHeaderText.indexOf('采购数') + 65), i + 1);
            }
        }

        // 填入数据到订单汇总表
        {
            var orderNoArr = [];
            for (let order of orderNo) {
                if (orderNoArr.indexOf(order.v) < 0)
                    orderNoArr.push(order.v);
            }
            let aoa = window.purchasingListObject["订单汇总"]['xlsx'].data;
            let aoaIndexMap = ['物料编码'];
            let aoaLeadingRowNum = 1;
            let aoaLeadingRowOrder = 1;
            let aoaCreateType = headerText.indexOf('单据来源');
            let aoaOrderNo = headerText.indexOf('订单号');
            let aoaSCD = headerText.indexOf('生产单号');
            let aoaOrderDate = headerText.indexOf('订单单据日期');
            let aoaProductCat = headerText.indexOf('商品分类名称');
            let aoaPurchasingTotal = headerText.indexOf('总采购数量');
            let aoaPurchasingCurrent = headerText.indexOf('系统下达量');
            let aoaMaterialName = headerText.indexOf('采购物料');
            let aoaPurchasingReal = headerText.indexOf('下单数');
            let aoaMaterialCode = headerText.indexOf('物料编码');
            let aoaMaterialCat = headerText.indexOf('物料分类名称');
            let aoaMaterialSize = headerText.indexOf('物料规格');
            let aoaMaterialUnit = headerText.indexOf('采购单位');
            let aoaTaxPrice = headerText.indexOf('税后总金额');
            let aoaTaxRate = headerText.indexOf('税率');
            let aoaWarehouse = headerText.indexOf('仓库');
            let aoaMaterialCaq = headerText.indexOf('物料可用量');
            let aoaMaterialCqd = headerText.indexOf('物料现存量');
            let aoaStatus = headerText.indexOf('状态');
            let aoaMaterialAlias = headerText.indexOf('物料别名');
            let aoaUnitPrice = headerText.indexOf('单价');
            let aoaOperation = headerText.indexOf('网页操作');
            let aoaReqMinusCaq = headerText.indexOf('下达量减可用量');
            let aoaReqMinusCqd = headerText.indexOf('下达量减现存量');
            let aoaTotalPrice = headerText.indexOf('总金额');

            const buildUnitPrice = '采购汇总报表!' + String.fromCharCode(aoaUnitPrice + 65);
            const buildOperation = '采购汇总报表!' + String.fromCharCode(aoaOperation + 65);
            const buildTaxRate = '采购汇总报表!' + String.fromCharCode(aoaTaxRate + 65);
            let summaryTableCodeCols = structuredClone(window.purchasingListObject["采购汇总报表"]['xlsx'].data.map(x => x[aoaMaterialCode]));
            for (let i = 0; i < summaryTableCodeCols.length; i++)
                summaryTableCodeCols[i] = summaryTableCodeCols[i].v;
            for (let orderNoValue of orderNoArr) {
                for (let rowNum = 1; rowNum < purchasingData.length; rowNum++) {
                    if (orderNoValue != orderNo[rowNum].v)
                        continue;

                    if (purchasingStatus[rowNum].v == '异常' || purchasingStatus[rowNum].v == '已完成') {
                        continue;
                    }
                    // working aoaRow
                    let aoaRow = -1;
                    for (let i = aoaLeadingRowOrder; i < aoaLeadingRowNum; i++)
                        if (aoa[i][aoaMaterialCode].v == materialCode[rowNum].v)
                            aoaRow = i;
                    if (aoaRow < 0 || createType[rowNum].v == "手工新增") {
                        aoa[aoaLeadingRowNum] = [];
                        aoaIndexMap.push(materialCode[rowNum].v)
                        aoaRow = aoaLeadingRowNum;
                        aoaLeadingRowNum++;
                        aoa[aoaRow][aoaCreateType] = structuredClone(createType[rowNum]);
                        aoa[aoaRow][aoaOrderNo] = structuredClone(orderNo[rowNum]);
                        aoa[aoaRow][aoaOrderDate] = structuredClone(orderDate[rowNum]);
                        // aoa[aoaRow][aoaMaterialAlias] = structuredClone(materialAlias[rowNum]);
                        aoa[aoaRow][aoaProductCat] = structuredClone(productCat[rowNum]);
                        aoa[aoaRow][aoaWarehouse] = structuredClone(warehouse[rowNum]);
                        aoa[aoaRow][aoaTaxPrice] = structuredClone(taxPrice[rowNum]);
                        aoa[aoaRow][aoaTaxRate] = structuredClone(taxRate[rowNum]);
                        aoa[aoaRow][aoaSCD] = structuredClone(SCD[rowNum]);
                        aoa[aoaRow][aoaPurchasingTotal] = structuredClone(purchasingTotal[rowNum]);
                        aoa[aoaRow][aoaPurchasingCurrent] = structuredClone(purchasingCurrent[rowNum]);
                        aoa[aoaRow][aoaMaterialName] = structuredClone(materialName[rowNum]);
                        aoa[aoaRow][aoaMaterialCode] = structuredClone(materialCode[rowNum]);
                        aoa[aoaRow][aoaMaterialCat] = structuredClone(materialCat[rowNum]);
                        aoa[aoaRow][aoaMaterialSize] = structuredClone(materialSize[rowNum]);
                        aoa[aoaRow][aoaMaterialUnit] = structuredClone(materialUnit[rowNum]);
                        aoa[aoaRow][aoaMaterialCaq] = structuredClone(materialCaq[rowNum]);
                        aoa[aoaRow][aoaMaterialCqd] = structuredClone(materialCqd[rowNum]);
                        aoa[aoaRow][aoaStatus] = structuredClone(purchasingStatus[rowNum]);
                        aoa[aoaRow][aoaUnitPrice] = {
                            't': 'n',
                            'v': 0,
                            'f': '',
                        };
                        let codeRow = summaryTableCodeCols.indexOf(aoa[aoaRow][aoaMaterialCode].v);
                        aoa[aoaRow][aoaUnitPrice].f = buildUnitPrice.concat(codeRow + 1);
                        aoa[aoaRow][aoaTaxRate].f = buildTaxRate.concat(codeRow + 1);
                        // 填入网页操作
                        aoa[aoaRow][aoaOperation] = {
                            't': 's',
                            'v': 0
                        };
                        aoa[aoaRow][aoaOperation].f = buildOperation.concat(codeRow + 1);
                    } else {
                        aoa[aoaRow][aoaPurchasingTotal].v = +aoa[aoaRow][aoaPurchasingTotal].v + +purchasingTotal[rowNum].v;
                        aoa[aoaRow][aoaPurchasingCurrent].v = +aoa[aoaRow][aoaPurchasingCurrent].v + +purchasingCurrent[rowNum].v;
                        if (!aoa[aoaRow][aoaSCD].v.includes(SCD[rowNum]))
                            aoa[aoaRow][aoaSCD].v = aoa[aoaRow][aoaSCD].v.concat(',', SCD[rowNum].v);
                    }
                }
                aoaLeadingRowOrder = aoaLeadingRowNum;
            }

            for (let i = 1; i < aoa.length; i++) {
                // 实际采购数（下单数）
                aoa[i][aoaPurchasingReal] = structuredClone(aoa[i][aoaMaterialCaq]);
                aoa[i][aoaPurchasingReal].t = 'n';
                if (+aoa[i][aoaPurchasingReal].v < 0) {
                    aoa[i][aoaPurchasingReal].v = -1;
                } else aoa[i][aoaPurchasingReal].v = 0;

                // 填入总金额
                aoa[i][aoaTotalPrice] = {
                    't': 'n',
                    'v': 0,
                    'f': '',
                };
                const buildFunc = String.fromCharCode(aoaUnitPrice + 65);
                aoa[i][aoaTotalPrice].f = buildFunc.concat(i + 1, '*', String.fromCharCode(aoaPurchasingReal + 65), i + 1);

                // 填税后总价
                aoa[i][aoaTaxPrice] = {
                    't': 'n',
                    'v': 0,
                    'f': '',
                };
                const buildTaxFunc = String.fromCharCode(aoaTotalPrice + 65);
                aoa[i][aoaTaxPrice].f = buildTaxFunc.concat(i + 1, '*', String.fromCharCode(aoaTaxRate + 65), i + 1, '*0.01+', String.fromCharCode(aoaTotalPrice + 65), i + 1);


                // // 填入下达量减可用量
                // aoa[i][aoaReqMinusCaq] = {
                //     't': 'n',
                //     'v': 0
                // };
                // let CaqMinusReq = +aoa[i][aoaPurchasingCurrent].v - +aoa[i][aoaMaterialCaq].v;
                // aoa[i][aoaReqMinusCaq].v = (CaqMinusReq > 0) ? CaqMinusReq : -1;
                // // 填入下达量减现存量
                // aoa[i][aoaReqMinusCqd] = {
                //     't': 'n',
                //     'v': 0
                // };
                // let CqdMinusReq = +aoa[i][aoaPurchasingCurrent].v - +aoa[i][aoaMaterialCqd].v;
                // aoa[i][aoaReqMinusCqd].v = (CqdMinusReq > 0) ? CqdMinusReq : -1;
            }
        }


        // 按物料分类拆分
        {
            let aoaTotal = window.purchasingListObject["采购汇总报表"]['xlsx'].data;
            let totalCatCol = headerText.indexOf('物料分类名称');
            for (let totalRow = 1; totalRow < aoaTotal.length; totalRow++) {
                let catName = aoaTotal[totalRow][totalCatCol].v.split('-')[0];
                // let orderNo = aoaTotal[totalRow][orderNoCol].v;
                let subCatName = aoaTotal[totalRow][totalCatCol].v.split('-')[1];
                let aoaReqMinusCaq = headerText.indexOf('下达量减可用量');
                let aoaReqMinusCqd = headerText.indexOf('下达量减现存量');
                let aoaRealMinusReq = headerText.indexOf("下单数减下达量")
                let aoaPurchasingCurrent = headerText.indexOf('系统下达量');
                let aoaTotalPrice = headerText.indexOf('总金额');
                let aoaPurchasingReal = headerText.indexOf('下单数');
                let aoaUnitPrice = headerText.indexOf('单价');
                let aoaTaxRate = headerText.indexOf('税率');
                let aoaTaxPrice = headerText.indexOf('税后总金额');
                const buildFunc = String.fromCharCode(aoaUnitPrice + 65);
                const buildUnitPrice = '采购汇总报表!' + String.fromCharCode(aoaUnitPrice + 65);
                const buildCount = '采购汇总报表!' + String.fromCharCode(aoaPurchasingReal + 65);
                const buildTaxFunc = String.fromCharCode(aoaTotalPrice + 65);
                const buildTaxRate = '采购汇总报表!' + String.fromCharCode(aoaTaxRate + 65);
                const buildRMR = String.fromCharCode(aoaPurchasingReal + 65);
                // 填入子分类
                let target = window.purchasingListObject[subCatName]['xlsx'].data;
                target[target.length] = structuredClone(aoaTotal[totalRow]);
                target[target.length - 1][aoaTotalPrice].f = buildFunc.concat(target.length, '*', String.fromCharCode(aoaPurchasingReal + 65), target.length);
                target[target.length - 1][aoaUnitPrice].f = buildUnitPrice.concat(totalRow + 1);
                target[target.length - 1][aoaPurchasingReal].f = buildCount.concat(totalRow + 1);
                target[target.length - 1][aoaTaxRate].f = buildTaxRate.concat(totalRow + 1);
                target[target.length - 1][aoaTaxPrice].f = buildTaxFunc.concat(target.length, '*', String.fromCharCode(aoaTaxRate + 65), target.length, '*0.01+', String.fromCharCode(aoaTotalPrice + 65), target.length);
                target[target.length - 1][aoaRealMinusReq].f = buildRMR.concat(target.length, '-', String.fromCharCode(aoaPurchasingCurrent + 65), target.length);


                // 填入大分类汇总表
                switch (catName) {
                    case '线材汇总':
                        target = window.purchasingListObject['线材汇总']['xlsx'].data;
                        target[target.length] = structuredClone(aoaTotal[totalRow]);
                        target[target.length - 1][aoaTotalPrice].f = buildFunc.concat(target.length, '*', String.fromCharCode(aoaPurchasingReal + 65), target.length);
                        target[target.length - 1][aoaUnitPrice].f = buildUnitPrice.concat(totalRow + 1);
                        target[target.length - 1][aoaPurchasingReal].f = buildCount.concat(totalRow + 1);
                        target[target.length - 1][aoaTaxRate].f = buildTaxRate.concat(totalRow + 1);
                        target[target.length - 1][aoaTaxPrice].f = buildTaxFunc.concat(target.length, '*', String.fromCharCode(aoaTaxRate + 65), target.length, '*0.01+', String.fromCharCode(aoaTotalPrice + 65), target.length);
                        target[target.length - 1][aoaRealMinusReq].f = buildRMR.concat(target.length, '-', String.fromCharCode(aoaPurchasingCurrent + 65), target.length);
                        break;
                    case '板材汇总':
                        target = window.purchasingListObject['板材汇总']['xlsx'].data;
                        target[target.length] = structuredClone(aoaTotal[totalRow]);
                        target[target.length - 1][aoaTotalPrice].f = buildFunc.concat(target.length, '*', String.fromCharCode(aoaPurchasingReal + 65), target.length);
                        target[target.length - 1][aoaUnitPrice].f = buildUnitPrice.concat(totalRow + 1);
                        target[target.length - 1][aoaPurchasingReal].f = buildCount.concat(totalRow + 1);
                        target[target.length - 1][aoaTaxRate].f = buildTaxRate.concat(totalRow + 1);
                        target[target.length - 1][aoaTaxPrice].f = buildTaxFunc.concat(target.length, '*', String.fromCharCode(aoaTaxRate + 65), target.length, '*0.01+', String.fromCharCode(aoaTotalPrice + 65), target.length);
                        target[target.length - 1][aoaRealMinusReq].f = buildRMR.concat(target.length, '-', String.fromCharCode(aoaPurchasingCurrent + 65), target.length);
                        break;
                    case '管材汇总':
                        target = window.purchasingListObject['管材汇总']['xlsx'].data;
                        target[target.length] = structuredClone(aoaTotal[totalRow]);
                        target[target.length - 1][aoaTotalPrice].f = buildFunc.concat(target.length, '*', String.fromCharCode(aoaPurchasingReal + 65), target.length);
                        target[target.length - 1][aoaUnitPrice].f = buildUnitPrice.concat(totalRow + 1);
                        target[target.length - 1][aoaPurchasingReal].f = buildCount.concat(totalRow + 1);
                        target[target.length - 1][aoaTaxRate].f = buildTaxRate.concat(totalRow + 1);
                        target[target.length - 1][aoaTaxPrice].f = buildTaxFunc.concat(target.length, '*', String.fromCharCode(aoaTaxRate + 65), target.length, '*0.01+', String.fromCharCode(aoaTotalPrice + 65), target.length);
                        target[target.length - 1][aoaRealMinusReq].f = buildRMR.concat(target.length, '-', String.fromCharCode(aoaPurchasingCurrent + 65), target.length);
                        break;
                    case '五金汇总':
                        target = window.purchasingListObject['五金汇总']['xlsx'].data;
                        target[target.length] = structuredClone(aoaTotal[totalRow]);
                        target[target.length - 1][aoaTotalPrice].f = buildFunc.concat(target.length, '*', String.fromCharCode(aoaPurchasingReal + 65), target.length);
                        target[target.length - 1][aoaUnitPrice].f = buildUnitPrice.concat(totalRow + 1);
                        target[target.length - 1][aoaPurchasingReal].f = buildCount.concat(totalRow + 1);
                        target[target.length - 1][aoaTaxRate].f = buildTaxRate.concat(totalRow + 1);
                        target[target.length - 1][aoaTaxPrice].f = buildTaxFunc.concat(target.length, '*', String.fromCharCode(aoaTaxRate + 65), target.length, '*0.01+', String.fromCharCode(aoaTotalPrice + 65), target.length);
                        target[target.length - 1][aoaRealMinusReq].f = buildRMR.concat(target.length, '-', String.fromCharCode(aoaPurchasingCurrent + 65), target.length);
                        break;
                    case '包装物料汇总':
                        target = window.purchasingListObject['包装物料汇总']['xlsx'].data;
                        target[target.length] = structuredClone(aoaTotal[totalRow]);
                        target[target.length - 1][aoaTotalPrice].f = buildFunc.concat(target.length, '*', String.fromCharCode(aoaPurchasingReal + 65), target.length);
                        target[target.length - 1][aoaUnitPrice].f = buildUnitPrice.concat(totalRow + 1);
                        target[target.length - 1][aoaPurchasingReal].f = buildCount.concat(totalRow + 1);
                        target[target.length - 1][aoaTaxRate].f = buildTaxRate.concat(totalRow + 1);
                        target[target.length - 1][aoaTaxPrice].f = buildTaxFunc.concat(target.length, '*', String.fromCharCode(aoaTaxRate + 65), target.length, '*0.01+', String.fromCharCode(aoaTotalPrice + 65), target.length);
                        target[target.length - 1][aoaRealMinusReq].f = buildRMR.concat(target.length, '-', String.fromCharCode(aoaPurchasingCurrent + 65), target.length);
                        break;
                    default:
                        target = window.purchasingListObject['其他分类物料汇总']['xlsx'].data;
                        target[target.length] = structuredClone(aoaTotal[totalRow]);
                        target[target.length - 1][aoaTotalPrice].f = buildFunc.concat(target.length, '*', String.fromCharCode(aoaPurchasingReal + 65), target.length);
                        target[target.length - 1][aoaUnitPrice].f = buildUnitPrice.concat(totalRow + 1);
                        target[target.length - 1][aoaPurchasingReal].f = buildCount.concat(totalRow + 1);
                        target[target.length - 1][aoaTaxRate].f = buildTaxRate.concat(totalRow + 1);
                        target[target.length - 1][aoaTaxPrice].f = buildTaxFunc.concat(target.length, '*', String.fromCharCode(aoaTaxRate + 65), target.length, '*0.01+', String.fromCharCode(aoaTotalPrice + 65), target.length);
                        target[target.length - 1][aoaRealMinusReq].f = buildRMR.concat(target.length, '-', String.fromCharCode(aoaPurchasingCurrent + 65), target.length);
                        break;
                }
                // 更新公式
            }
        }

        // export xlsx
        var sheetnames = []
        var dataArr = [];
        for (let obj in window.purchasingListObject) {
            sheetnames.push(obj);
            dataArr.push(window.purchasingListObject[obj]['xlsx'].data);
        }
        // exportSheetsUtil(dataArr, "生成采购报表" + (new Date()).toLocaleTimeString(), sheetnames);
        exportFormulaSheet(dataArr, "生成采购报表" + (new Date()).toLocaleTimeString(), sheetnames);
    }

    // Util 函数
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

    function exportFormulaSheet(data, filename, sheetnames) {
        var wb = XLSX.utils.book_new();
        if (!wb.Props) wb.Props = {};
        for (let i = 0; i < data.length; i++) {
            let ws = XLSX.utils.aoa_to_sheet(data[i]);
            XLSX.utils.book_append_sheet(wb, ws, sheetnames[i]);
        }
        XLSX.writeFile(wb, filename.concat('.xlsx'));
    }

    function clickAlert(name) {
        alert("clicked " + name);
    }

    addGlobalStyle(`/* Dropdown Button */
        .dropbtn {
            background-color: #04AA6D;
            color: white;
            padding: 16px;
            font-size: 16px;
            border: none;
        }

        /* The container <div> - needed to position the dropdown content */
        .dropdown {
            position: relative;
            display: inline-block;
        }

        /* Dropdown Content (Hidden by Default) */
        .dropdown-content {
            display: none;
            position: absolute;
            background-color: #f1f1f1;
            min-width: 160px;
            box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
            z-index: 1;
        }

        /* Buttons inside the dropdown */
        .dropdown-content button {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 6px 6px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            border-radius: 12px;
        }

        /* Change color of dropdown buttons on hover */
        .dropdown-content button:hover {
            background-color: #008CBA;
        }

        /* Show the dropdown menu on hover */
        .dropdown:hover .dropdown-content {
            z-index: 300;
            position: absolute;
            display: block;
        }

        /* Change the background color of the dropdown button when the dropdown content is shown */
        .dropdown:hover .dropbtn {
            background-color: #3e8e41;
        }`);
})();
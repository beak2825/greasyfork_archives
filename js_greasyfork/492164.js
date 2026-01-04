// ==UserScript==
// @name         LF-ERP-Admin-Enhance
// @namespace    http://www.leadfluid.com.cn/zhbing
// @version      0.0.2
// @description  增强雷弗内部用ERP的功能（For Admin）
// @author       zhbing
// @match        http://erp.leadfluid.com.cn/SYSN/view/comm/sdk/BCFSettingPage.ashx*
// @run-at       context-menu
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net.cn
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492164/LF-ERP-Admin-Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/492164/LF-ERP-Admin-Enhance.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let txtDetailName = document.querySelector('#comm_itembarText>span').innerText.trim();
    let btnObj = document.createElement("input");
    btnObj.setAttribute("type", "button");
    btnObj.id="bill.export_btn";
    btnObj.className= "billCommBtns  zb-button";
    btnObj.value = "导出自定义";
    btnObj.name = "导出自定义";
    //btnObj.disabled = true;
    btnObj.addEventListener("click",(event) => {
        let result = "序号,是否启用,字段来源和原名,字段别名,必填,导入,导出,检索,显示在更多列,向下流转,流转范围,呈现顺序";
        for(let i = 0; i < details.length; i++) {
            if(details[i]!=null) {
                let strDetail = details[i].序号 + "," + details[i].是否启用 + "," + details[i].字段来源和原名 + "," + details[i].字段别名 + "," + (details[i].必填 ? details[i].必填 : "") + "," + (details[i].导入 ? details[i].导入 : "") + "," + (details[i].导出 ? details[i].导出 : "") + "," + (details[i].检索 ? details[i].检索 : "") + "," + (details[i].显示在更多列 ? details[i].显示在更多列 : "") + "," + (details[i].向下流转 ? details[i].向下流转 : "") + "," + (details[i].流转范围 ? ("\""+ details[i].流转范围 + "\"") : "") + "," + details[i].呈现顺序;
                result = result + "\r\n" + strDetail;
            }
        }
        var blob = new Blob([result], { type: "text/plain;charset=utf-8" });
        saveAs(blob, txtDetailName + ".csv");
    });
    document.querySelector('#comm_itembarrightbtnarea').append(btnObj);
    let details = [];
    let parseFinish = false;

    let parseDetail = function() {
        let cols = document.querySelectorAll('#lvw_dbtable_commbillfields > tbody > tr.lvwheadertr.hideheader0>th');
        let m = new Map();
        for(let i = 0; i < cols.length; i++) {
            let colName = cols[i].innerText.trim();
            if(colName == "序号" || colName == "是否启用" || colName == "字段来源和原名" || colName == "字段别名" || colName == "必填" || colName == "导入" || colName == "导出" || colName == "检索" || colName == "显示在更多列" || colName == "向下流转" || colName == "流转范围" || colName == "呈现顺序") {
                m.set(colName, i);
            }
        }
        let trs = document.querySelectorAll('#lvw_dbtable_commbillfields>tbody>tr[pos]');
        let hasImportCol = ("导入"==document.querySelector('#lvw_dbtable_commbillfields > tbody > tr.lvwheadertr.hideheader0 > th.lvwheader.h_1.l_10 > div').innerText.trim()) ? true : false;
        for(let i = 0; i < trs.length; i++) {
            let tr = trs[i];
            let detail = {};
            let no = tr.cells[0].innerText;
            if(no > details.length) {
                detail.序号 = no;
                let enableObj = tr.cells[1].querySelector('input[type="checkbox"]');
                detail.是否启用 = enableObj.disabled ? "禁" : (enableObj.checked ? "是": "否");
                detail.字段来源和原名 = tr.cells[2].innerText.trim();
                detail.字段别名 = tr.cells[3].querySelector('input[type="text"]').value;

                if(m.get("必填")!=null) {
                    let tdObj = tr.cells[m.get("必填")].querySelector('input[type="checkbox"]');
                    detail.必填 = tdObj ? (tdObj.checked ? "是": "否"): null;
                }else {
                    detail.必填 = null;
                }

                if(m.get("导入")!=null) {
                    let tdObj = tr.cells[m.get("导入")].querySelector('input[type="checkbox"]');
                    detail.导入 = tdObj ? (tdObj.checked ? "是": "否"): null;
                }else {
                    detail.导入 = null;
                }

                if(m.get("导出")!=null) {
                    let tdObj = tr.cells[m.get("导出")].querySelector('input[type="checkbox"]');
                    detail.导出 = tdObj ? (tdObj.checked ? "是": "否"): null;
                }else {
                    detail.导出 = null;
                }

                if(m.get("检索")!=null) {
                    let tdObj = tr.cells[m.get("检索")].querySelector('input[type="checkbox"]');
                    detail.检索 = tdObj ? (tdObj.checked ? "是": "否"): null;
                }else {
                    detail.检索 = null;
                }

                if(m.get("显示在更多列")!=null) {
                    let tdObj = tr.cells[m.get("显示在更多列")].querySelector('input[type="checkbox"]');
                    detail.显示在更多列 = tdObj ? (tdObj.checked ? "是": "否"): null;
                }else {
                    detail.显示在更多列 = null;
                }

                if(m.get("向下流转")!=null) {
                    let tdObj = tr.cells[m.get("向下流转")].querySelector('input[type="checkbox"]');
                    detail.向下流转 = tdObj ? (tdObj.checked ? "是": "否"): null;
                }else {
                    detail.向下流转 = null;
                }

                if(m.get("流转范围")!=null) {
                    let tdObj = tr.cells[m.get("流转范围")].querySelector('input[type="text"]');
                    detail.流转范围 = tdObj ? tdObj.value : null;
                }else {
                    detail.流转范围 = null;
                }

               if(m.get("呈现顺序")!=null) {
                    let tdImportObj = tr.cells[m.get("呈现顺序")].querySelector('select');
                    detail.呈现顺序 = tdImportObj.options[tdImportObj.selectedIndex].text.trim();
                }else {
                    detail.呈现顺序 = null;
                }

                details[no-1] = detail;
            }
        }
    };

    document.querySelector('#lvwjsnscrollbar_commbillfields').addEventListener("scroll",(event) => {
        parseDetail();
    });
    document.querySelector('#lvwbtmtooldiv_commbillfields>div>div.lv_b_nxt').addEventListener("mousedown", (event) => {
        parseDetail();
    });
})();
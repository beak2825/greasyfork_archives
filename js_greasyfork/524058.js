// ==UserScript==
// @name         BWP_OUT_STORE_PLUGIN
// @namespace    http://tampermonkey.net/
// @version      2025-01-17
// @description  Script created at 2025-01-17 23:34:15
// @author       LIBRA.WONG
// @match       *://219.149.219.66:8080/bwp/*
// @match       *://hznmfw.com/B2/default.aspx*
// @match       *://10.0.0.118/B2*
// @match       *://188.188.81.6/B2*
// @match       *://hznmfw.com/*
// @match       *://10.0.0.108/bwp*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/524058/BWP_OUT_STORE_PLUGIN.user.js
// @updateURL https://update.greasyfork.org/scripts/524058/BWP_OUT_STORE_PLUGIN.meta.js
// ==/UserScript==

const table_names = ['出库汇总打印'];
const element_bwp_desk_table = '#dijit_layout_TabContainer_0_tablist > div.dijitTabListWrapper.dijitTabContainerTopNone.dijitAlignCenter > div';
const set_iframe_id = 'TEST000001';
waitForElement(element_bwp_desk_table, function (element) {
    var bwp_desktop_tabs = document.querySelectorAll('[id^="dijit_layout_TabContainer_0_tablist_dijit_layout_ContentPane_"]');
    var table_names = '';
    for (let element_tab of bwp_desktop_tabs) {
        var table_name = element_tab.innerText.trim();
        if (table_name.length > 2) {
            table_names = table_names + ',' + table_name
        }
    }
    console.log('BWP桌面, 数量:', bwp_desktop_tabs.length, table_names);

});
function waitForElement(selector, callback) {
    let observer = new MutationObserver(mutations => {
        let targetNode = document.querySelector(selector);
        if (targetNode) {
            const elements = document.querySelectorAll('[id^="dijit_layout_TabContainer_0_tablist_dijit_layout_ContentPane_"]');
            for (let element of elements) {
                var page_name = element.innerText.trim();
                if (table_names.indexOf(page_name) !== -1) {
                    console.log('指定操作Tab已出现, ', page_name);
                    const desk_page_elements = document.querySelectorAll('.dijitTabContainerTopChildWrapper');
                    for (let page_element of desk_page_elements) {

                        var iframe = page_element.querySelector('div > iframe');
                        if (iframe.src.includes('SaleOutStoreCombinePrint.aspx')) {
                            console.log('found, set iframe id');
                            iframe.id = set_iframe_id;
                            console.log(iframe);

                            break;
                        }

                    };
                    addPrintButtons();
                    break;
                }
            }
            callback(targetNode);
        }
    });
    let config = { childList: true, subtree: true };
    observer.observe(document.body, config);
};

function addPrintButtons() {

    var iframe = document.getElementById('TEST000001');
    iframe.onload = function () {
        var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        console.log(iframeDoc);
        const titlePanelContentContainer = iframeDoc.querySelectorAll('.TitlePanelContentContainer');
        const titlePanelContentTables = iframeDoc.querySelectorAll('.TitlePanelContentContainer table');
        console.log(titlePanelContentTables);
        console.log(titlePanelContentTables[titlePanelContentTables.length - 1]);
        if (titlePanelContentTables) {
            const lastTitlePanelContentTables = titlePanelContentTables[titlePanelContentTables.length - 1];
            console.log(lastTitlePanelContentTables);
            const clonedTable = lastTitlePanelContentTables.cloneNode(true); // 深拷贝
            titlePanelContentContainer[1].insertAdjacentElement('afterbegin', clonedTable);
        }



        //重写函数
        iframeDoc.DFDataGrid_SelectAll = function (a) {
            var checkboxes = $(GetElementByTagName(a, "TABLE")).find("tr:gt(0)").find("td:first").find("input[type=checkbox]");

            // 获取当前复选框状态
            var currentState = a.getAttribute('data-state');
            if (currentState === null) {
                // 初始化状态
                currentState = 'selectAll';
            }

            // 根据当前状态来决定操作
            if (currentState === 'selectAll') {
                // 首次点击：全选（包括 this 复选框）
                checkboxes.prop("checked", true);
                a.setAttribute('data-state', 'invertSelection'); // 切换到反选状态
            } else if (currentState === 'invertSelection') {
                // 第二次点击：反选（保持 this 复选框为选中状态）
                var thisChecked = a.checked; // 获取 this 复选框的当前选中状态
                checkboxes.each(function () {
                    if (this !== a) { // 排除 this 复选框
                        this.checked = !this.checked; // 反选其他复选框
                    }
                });
                // 反选时，保持 this 复选框选中状态
                a.checked = true;
                a.setAttribute('data-state', 'deselectAll'); // 切换到全不选状态
            } else if (currentState === 'deselectAll') {
                // 第三次点击：全不选（包括 this 复选框）
                checkboxes.prop("checked", false);
                a.setAttribute('data-state', 'selectAll'); // 切换到全选状态
            }
        };




    }
}

// ==UserScript==
// @name        BWP_PLUGIN
// @namespace   Violentmonkey Scripts
// @match       *://hznmfw.com/B2/default.aspx*
// @match       *://10.0.0.118/B2*
// @match       *://188.188.81.6/B2*
// @match       *://hznmfw.com/*
// @grant       Any worker of huazheng co.
// @version     1.1.4
// @author      LIBRA
// @license     MIT
// @description Script created at 2024-08-14 13:59:24
// @downloadURL https://update.greasyfork.org/scripts/502797/BWP_PLUGIN.user.js
// @updateURL https://update.greasyfork.org/scripts/502797/BWP_PLUGIN.meta.js
// ==/UserScript==


//1.华正外购入库导U8采购入库       选入库日期
//2.华正结算单导U8采购入库单       选核算日期
//3.华正结算单导U8屠宰车间材料出库  选核算日期
//4.华正结算单导U8屠宰车间产品入库  选核算日期
//5.华正结算单导U8白条车间材料出库  选核算日期
//6.华正白条领料导U8材料出库       选日期
//7.华正原料领用导U8材料出库       选日期 投入类型选“一次领料”,除分割暂存库、废弃库、屠宰暂存库不导入，其他全部导入）
//8.华正原料领用导U8红字产成品入库  选日期 选日期 投入类型选“二次领料”,除分割暂存库、废弃库、屠宰暂存库不导入，其他全部导入）
//9.华正成品入库导U8成品入库       选入库日期  （除分割暂存库、废弃库、屠宰暂存库不导入，其他全部导入）
//10.华正调拨入库单导U8调拨单      选调入时间

const table_names = ['华正外购入库导U8采购入库',
    '华正结算单导U8采购入库单',
    '华正结算单导U8屠宰车间材料出库',
    '华正结算单导U8屠宰车间产品入库',
    '华正结算单导U8白条车间材料出库',
    '华正白条领料导U8材料出库',
    '华正原料领用导U8材料出库',
    '华正原料领用导U8红字产成品入库',
    '华正成品入库导U8成品入库',
    '华正调拨入库单导U8调拨单'];


const hzyllydu8hzccprk_storage_exclude = [
    '分割暂存库',
    '废弃库',
    '屠宰暂存库'

];

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
                    const desk_page_elements = document.querySelectorAll('#dijit_layout_TabContainer_0 .dijitTabContainerTopChildWrapper');
                    for (let page_element of desk_page_elements) {
                        var iframe = page_element.querySelector('div > iframe');
                        if (iframe.src.includes('ExportPage.aspx')) {
                            console.log('found, set iframe id');
                            iframe.id = set_iframe_id;
                        }
                    };
                    set_date(page_name);
                    auto_selector(page_name, function () { click_query(page_name); selector_api();});
                    break;
                }
            }
            callback(targetNode);
        }
    });
    let config = { childList: true, subtree: true };
    observer.observe(document.body, config);
}

function click_query(page_name) {
    var iframeSelector = set_iframe_id;
    var iframe = document.getElementById(iframeSelector);
    if (iframe) {
        var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        var elementInIframe = iframeDoc.querySelector('#ctl01 > div.TitlePanelZone > div:nth-child(1) > div.TitlePanelContentContainer.LeftPaddingWrapper.BottomPaddingWrapper > table > tbody > tr:nth-child(2) > td > div > input:nth-child(1)');
        if (elementInIframe) {
            console.log('点击查询:', page_name);
            elementInIframe.click();
        }
    }
}


function selector_api() {
    var ele_selector_api = '#ctl22_ctl01 span';
    var outerIframe = document.getElementById(set_iframe_id);
    if (outerIframe) {
        outerIframe.onload = function () {
            var outerIframeDoc = outerIframe.contentDocument || outerIframe.contentWindow.document;
            outerIframeDoc.querySelector(ele_selector_api).click();
            console.log('点击 接口 下拉菜单, 获取选项值');
            var innerIframe = outerIframeDoc.getElementById('__dropList');
            if (innerIframe) {
                var innerIframeDoc = innerIframe.contentDocument || innerIframe.contentWindow.document;
                var options = innerIframeDoc.querySelectorAll('#dyna table tbody tr');
                for (var i = 1; i < options.length; i++) {
                    var tr = options[i];
                    var tr_innerText = tr.innerText.trim();
                    if (tr_innerText === 'U8接口地址') {
                        options[i].click();
                        console.log('外部系统 选择:', tr_innerText);
                        break;
                    }
                };
            };
        };
    };
}


function auto_selector(page_name, callback) {
    console.log('自动选择:', page_name);
    var ele_selector_storage = '#ctl20_ctl04_ctl19 span';
    var ele_selector_in_type = '#ctl20_ctl04_ctl21 span';
    var need_select_storage = null;
    var need_select_in_type = '';
    switch (page_name) {
        case '华正原料领用导U8材料出库':
            need_select_storage = true;
            need_select_in_type = '一次领料';
            break;
        case '华正原料领用导U8红字产成品入库':
            need_select_storage = true;
            need_select_in_type = '二次领料';
            break;
        case '华正成品入库导U8成品入库':
            var ele_selector_storage = '#ctl20_ctl04_ctl17 span';
            need_select_storage = true;
            break;
        default:
            console.log('非需要选择仓库和投入类型的页面:', page_name);
            if (typeof callback === 'function') {
                callback();
            }
            return;
    };

    var outerIframe = document.getElementById(set_iframe_id);
    if (outerIframe) {
        outerIframe.onload = function () {
            var outerIframeDoc = outerIframe.contentDocument || outerIframe.contentWindow.document;
            if (need_select_storage) {
                outerIframeDoc.querySelector(ele_selector_storage).click();
                console.log('点击 仓库 下拉菜单, 获取选项值 页面:', page_name);
                var innerIframe = outerIframeDoc.getElementById('__dropList');
                if (innerIframe) {
                    var innerIframeDoc = innerIframe.contentDocument || innerIframe.contentWindow.document;
                    var options = innerIframeDoc.querySelectorAll('#dyna table tbody tr');
                    // console.log(options);
                    var selected_storages = '';
                    var un_selected_storages = '';
                    for (var i = 1; i < options.length; i++) {
                        var tr = options[i];
                        var tr_innerText = tr.innerText.trim();
                        var checkbox = tr.querySelector('input[type="checkbox"]');
                        if (tr_innerText.length > 2 && hzyllydu8hzccprk_storage_exclude.indexOf(tr_innerText) !== -1) {
                            un_selected_storages = un_selected_storages + tr_innerText + ' ';
                        } else {
                            selected_storages = selected_storages + tr_innerText + ' ';
                            checkbox.checked = true;
                        }
                    };
                    options[options.length - 1].click();
                    console.log('选择:', selected_storages);
                    console.log('未选:', un_selected_storages);
                }
            };
            if (need_select_in_type !== '') {
                outerIframeDoc.querySelector(ele_selector_in_type).click();
                console.log('点击 投入类型 下拉菜单, 获取选项值 页面:', page_name);
                var innerIframe = outerIframeDoc.getElementById('__dropList');
                if (innerIframe) {
                    var innerIframeDoc = innerIframe.contentDocument || innerIframe.contentWindow.document;
                    var options = innerIframeDoc.querySelectorAll('#dyna table tbody tr');
                    for (var i = 1; i < options.length; i++) {
                        var tr = options[i];
                        var tr_innerText = tr.innerText.trim();
                        if (tr_innerText === need_select_in_type) {
                            options[i].click();
                            console.log('投入类型 选择:', tr_innerText);
                            break;
                        }

                    };
                };
            };
            outerIframe.onload = null;
            console.log('移除outerIframe');
            if (typeof callback === 'function') {
                callback();
            };
            if (innerIframe.complete) {
                innerIframe.onload();
            };
        };
    };
    if (outerIframe.complete) {
        outerIframe.onload();
    }
};


function set_date(page_name) {
    console.log('设置查询日期 当前页面:', page_name);
    switch (page_name) {
        case '华正外购入库导U8采购入库':
            element_id_date_start = 'ctl20_ctl04_ctl32';
            element_id_date_ended = 'ctl20_ctl04_ctl33';
            break;
        case '华正成品入库导U8成品入库':
            element_id_date_start = 'ctl20_ctl04_ctl34';
            element_id_date_ended = 'ctl20_ctl04_ctl35';
            break;
        case '华正调拨入库单导U8调拨单':
            element_id_date_start = 'ctl20_ctl04_ctl30';
            element_id_date_ended = 'ctl20_ctl04_ctl31';
            break;
        default:
            console.log('其他页面, 设为默认值');
            element_id_date_start = 'ctl20_ctl04_ctl36';
            element_id_date_ended = 'ctl20_ctl04_ctl37';
            break;
    }

    var dates = get_date();
    console.log(dates);

    var iframeSelector = set_iframe_id;
    var iframe = document.getElementById(iframeSelector);
    if (iframe) {
        var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.getElementById(element_id_date_start).value = dates.firstDay;
        iframeDoc.getElementById(element_id_date_ended).value = dates.lastDay;
        console.log('修改时间:', dates.firstDay, dates.lastDay);
    } else {
        console.error('未找到指定的iframe');
    };
};

function get_date() {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    month = month.toString().padStart(2, '0');
    day = day.toString().padStart(2, '0');
    function getLastDayOfMonth(year, month) {
        var lastDay = new Date(year, month, 0).getDate();
        return lastDay.toString().padStart(2, '0');
    }
    var firstDayOfMonth, lastDayOfMonth, yesterday, result;
    if (day === '01') {
        if (month === '01') {
            firstDayOfMonth = (year - 1) + '-12-01';
            lastDayOfMonth = (year - 1) + '-12-31';
        } else {
            firstDayOfMonth = year + '-' + (month - 1).toString().padStart(2, '0') + '-01';
            lastDayOfMonth = year + '-' + (month - 1).toString().padStart(2, '0') + '-' + getLastDayOfMonth(year, month - 1);
        }
    } else {
        firstDayOfMonth = year + '-' + month + '-01';
        yesterday = (new Date(today - 86400000)).toISOString().split('T')[0];
        yesterday = yesterday.substring(0, 10);
        result = {
            firstDay: firstDayOfMonth,
            lastDay: yesterday
        };
        return result;
    }
    result = {
        firstDay: firstDayOfMonth,
        lastDay: lastDayOfMonth
    };
    return result;
}

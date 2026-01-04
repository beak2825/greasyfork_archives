// ==UserScript==
// @name         亚马逊批量下载业务报告
// @namespace    https://github.com/MaiXiaoMeng
// @version      0.0.8
// @description  垃圾亚马逊，连批量下载业务报告的方法都没有，只好自己写一个了
// @author       XiaoMeng Mai
// @license      GPLv3

// @match        https://*.amazon.com/*
// @match        https://*.amazon.co.uk/*
// @match        https://*.amazon.fr/*
// @match        https://*.amazon.it/*
// @match        https://*.amazon.es/*
// @match        https://*.amazon.co.jp/*
// @match        https://*.amazon.com.au/*
// @match        https://*.amazon.sg/*

// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow

// @compatible   firefox Tampermonkey
// @compatible   chrome Tampermonkey
// @compatible   edge Tampermonkey

// @require      https://unpkg.com/jquery
// @require      https://unpkg.com/moment
// @require      https://unpkg.com/sweetalert2

// @resource     element-plus    https://unpkg.com/element-plus/dist/index.css

// @note         0.0.8 [Amazon] 修复 业务报告 修复个别 日本站 不显示下载按钮的问题 
// @note         0.0.7 [Amazon] 新增 业务报告 支持按每天或者每月下载
// @note         0.0.6 [Amazon] 新增 业务报告 自动获取业务报告的全部字段
// @note         0.0.5 [Amazon] 新增 库存管理 显示库存管理产品的分类
// @note         0.0.4 [Amazon] 修复 业务报告 父商品详情页面销售和流量 和 详情页面销售和流量 错误显示批量下载按钮
// @note         0.0.3 [Amazon] 新增 业务报告 亚马逊企业购(B2B)相关数据列
// @note         0.0.2 [Amazon] 修复 业务报告 下载报告没有子ASIN列的问题
// @note         0.0.1 [Amazon] 新增 业务报告 详情页面销售和流量（按子商品）批量下载

// https://sweetalert2.github.io/
// https://element-plus.gitee.io/

// append() - 在被选元素的结尾插入内容（内容的结尾，比如说有个a标签，则是在</a>这个标签之前添加东西） <a>    [append]</a>
// prepend() - 在被选元素的开头插入内容（内容的开始，比如说有个a标签，则是在<a>这个标签之后添加东西） <a>[prepend]   </a>
// after() - 在被选元素之后插入内容（元素的结尾，比如说有个a标签，则是在</a>这个标签之后添加东西）    <a>    </a>[after]
// before() - 在被选元素之前插入内容（内容的开始，比如说有个a标签，则是在<a>这个标签之前添加东西）    [before]<a>    </a>

// waitForKeyElements('.entry-wrapper', 'xxxxx520.com', ['/'], false, false, (node, selector_txt, active_host, active_url) => {
//     if (GM_getValue('menu_amazon')) {
//         (async () => {
//             var response = await makeGetRequest(offcie365_url)
//             node.find('.xxx').append($(`<li><span><a target='_blank' href='${response.url}'">response</a></span></li>`))
//         })()
//     }
// })

// @downloadURL https://update.greasyfork.org/scripts/449460/%E4%BA%9A%E9%A9%AC%E9%80%8A%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E4%B8%9A%E5%8A%A1%E6%8A%A5%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/449460/%E4%BA%9A%E9%A9%AC%E9%80%8A%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E4%B8%9A%E5%8A%A1%E6%8A%A5%E5%91%8A.meta.js
// ==/UserScript==

var version_url = "https://greasyfork.org/zh-CN/scripts/449460"

// 初始化脚本
initializationScript()
// [Amazon] 业务报告 | 详情页面销售和流量
waitForKeyElements('.css-1lafdix', '*', ['business-reports'], false, false, (node, selector_txt, active_host, active_url) => {
    if (GM_getValue('menu_amazon')) {
        if (node.attr('class').indexOf('business_report') == -1) {
            node.after($(`<div class="css-1lafdix business_report"><kat-button id='business_month' label="批量下载[月](.csv)" variant="primary" size="base" type="button"></kat-button></div> <div class="css-ix5zus"><kat-link label="" class="css-4g6ai3"></kat-link></div>`))
            node.after($(`<div class="css-1lafdix business_report"><kat-button id='business_day' label="批量下载[天](.csv)" variant="primary" size="base" type="button"></kat-button></div> <div class="css-ix5zus"><kat-link label="" class="css-4g6ai3"></kat-link></div>`))
            $(".business_report").click(function (event) {
                var legacy_report_id = $('.css-1qgr8dx').parent().attr('href').split('=')[1]
                var start_date = new Date($(".css-jfggi0")[0].value)
                var end_date = new Date($(".css-jfggi0")[1].value)
                var site_brand = $(".partner-dropdown-button > span").text().split(" | ");
                (async () => {
                    var api_url = `https://${document.domain}/business-reports/api`
                    var data = JSON.stringify({
                        operationName: "reportDataQuery",
                        variables: {
                            input: {
                                legacyReportId: legacy_report_id,
                            },
                        },
                        query: "query reportDataQuery($input: GetReportDataInput) {\n  getReportData(input: $input) {\n      columns {\n      label\n      translationKey\n      isDefaultSortAscending\n      isDefaultGraphed\n      isDefaultSelected\n      isDefaultSortColumn\n      __typename\n    }\n    rows\n    __typename\n  }\n}\n",
                    })

                    var response = await makeGetRequest(url = api_url, method = 'POST', data = data)
                    var columns = JSON.parse(response.responseText)['data']['getReportData']['columns']
                    var selected_columns = []
                    columns.forEach(element => { selected_columns.push(element['translationKey']) })

                    var download_date_list = []

                    if (event['target']['id'] == 'business_day') {
                        while (start_date <= end_date) {
                            var _start_date = moment(start_date).format('YYYY-MM-DD')
                            var _end_date = moment(start_date).format('YYYY-MM-DD')
                            download_date_list.push({ 'start_date': _start_date, 'end_date': _end_date })
                            start_date = new Date((start_date / 1000 + 86400 * 1) * 1000)
                        }
                    } else if (event['target']['id'] == 'business_month') {
                        while (start_date <= end_date) {
                            var _date = new Date(start_date)
                            var _date_label = true
                            var _start_date = moment(_date.setDate(1)).format('YYYY-MM-DD')
                            _date.setMonth(_date.getMonth() + 1)
                            var _end_date = moment(_date.setDate(0)).format('YYYY-MM-DD')

                            for (let index = 0; index < download_date_list.length; index++) {
                                const element = download_date_list[index]
                                if (_start_date == element['start_date']) {
                                    _date_label = false
                                    break
                                }
                            }

                            if (_date_label) download_date_list.push({ 'start_date': _start_date, 'end_date': _end_date })
                            start_date = new Date((start_date / 1000 + 86400 * 1) * 1000)
                        }
                    }

                    for (let index = 0; index < download_date_list.length; index++) {
                        const element = download_date_list[index]
                        var data = JSON.stringify({
                            operationName: "reportDataDownloadQuery",
                            variables: {
                                input: {
                                    legacyReportId: legacy_report_id,
                                    startDate: element['start_date'],
                                    endDate: element['end_date'],
                                    userSelectedRows: [],
                                    selectedColumns: selected_columns,
                                },
                            },
                            query: "query reportDataDownloadQuery($input: GetReportDataInput) {\n  getReportDataDownload(input: $input) {\n    url\n    __typename\n  }\n}\n",
                        })
                        var response = await makeGetRequest(url = api_url, method = 'POST', data = data)
                        var download_url = JSON.parse(response.responseText)["data"]["getReportDataDownload"]["url"]
                        var download_file_name = `${site_brand[1]}_${site_brand[0]}_${element['start_date']}.csv`
                        ElementPlus.ElMessage(`正在下载： ${download_file_name}`)
                        console.log(`正在下载： ${download_file_name} URL: ${download_url}`)
                        GM_download(download_url, download_file_name)
                    }
                })()
            })
        }
    }
})
// [Amazon] 管理库存 | 显示管理库存产品的分类
waitForKeyElements('.myi-sprite-container.myi-image > a', '*', ['inventory'], false, false, (node, selector_txt, active_host, active_url) => {
    var grab_node = node.attr('href').split('&')[2].replace('productType=', '');
    node.parent().after($(`<div><div><span style="color:#00F;font-size: initial;">${grab_node}</span></div>`))
})

// // Listing页面
// waitForKeyElements("#productTitle", getGigab2bProductInfo, ['/dp/', '/gp/'])
// waitForKeyElements("#ASIN", actionFunction, ['/dp/', '/gp/'])
// // 订单管理页面
// waitForKeyElements(".cell-body > .cell-body-title", getGigab2bTrackingNumber, ['orders-v3/']);
// waitForKeyElements(".a-spacing-mini > div > span.a-text-bold", getGigab2bTrackingNumber, ['orders-v3/'])
// waitForKeyElements(".myo-list-orders-product-name-cell> div:nth-child(3) > div", getGigab2bProductInfo, ['orders-v3/'])

// var flow_score_url = 'https://api.xiyouzhaoci.com/v1/flowScore/country/US/asin/'
// var word_counts_url = 'https://api.xiyouzhaoci.com/v1/wordCounts'
// var search_by_asin = 'https://api.xiyouzhaoci.com/v1/searchByAsin'

// GM_xmlhttpRequest({
//     url: flow_score_url + asin,
//     method: 'GET',
//     onload: function (response) {
//         console.log(response.responseText);
//     }
// })
// GM_xmlhttpRequest({
//     url: word_counts_url,
//     method: 'POST',
//     data: JSON.stringify({
//         'asin': `${asin}`,
//         'country': 'US',
//         'filters': [],
//         'query': '',
//         'rangeFilters': []
//     }),
//     onload: function (response) {
//         console.log(response.responseText);
//     }
// })
// GM_xmlhttpRequest({
//     url: search_by_asin,
//     method: 'POST',
//     data: JSON.stringify({
//         'asin': `${asin}`, 'country': 'US',
//         'page': 1,
//         'pageSize': 100,
//         'orders': [
//             {
//                 'field': 'follow',
//                 'order': 'desc'
//             }
//         ],
//         'filters': [],
//         'query': '',
//         'rangeFilters': []
//     }),
//     onload: function (response) {
//         console.log(response.responseText);
//     }
// })

/**
 * @description: 一个实用程序函数，用于 Greasemonkey 脚本, 检测和处理 AJAXed 内容
 * @param {*} selector_txt 元素选择器
 * @param {*} active_host 激活的域名
 * @param {*} active_url 激活的页面URL
 * @param {*} b_wait_once 是否只扫描一次
 * @param {*} iframe_selector 是否扫描Frame框架
 * @param {*} action_function 找到元素时运行的方法，传送 node, selector_txt, active_host, active_url 四个变量
 */
function waitForKeyElements(selector_txt, active_host, active_url, b_wait_once, iframe_selector, action_function) {
    if (active_host != '*' && document.domain.split('.').slice(-2).join('.') != active_host) return

    var active_url_type = false
    if (typeof active_url == "object") {
        for (let index = 0; index < active_url.length; index++) {
            if (window.location.href.indexOf(active_url[index]) > -1) {
                active_url_type = true
                break
            }
        }
    } else if (typeof active_url == "string") {
        if (window.location.href.indexOf(active_url) > -1) active_url_type = true
    }


    if (active_url_type) {
        var target_nodes, b_targets_found
        if (iframe_selector) {
            target_nodes = $(iframe_selector).contents().find(selector_txt)
        } else {
            target_nodes = $(selector_txt)
        }

        if (target_nodes && target_nodes.length > 0) {
            b_targets_found = true
            target_nodes.each(function () {
                var j_this = $(this)
                var already_found = j_this.data("alreadyFound") || false

                if (!already_found) {
                    logPrint(`selector_txt > ${selector_txt} active_host > ${active_host} active_url > ${active_url} b_wait_once > ${b_wait_once} iframe_selector > ${iframe_selector}`)
                    console.log(j_this);

                    var cancel_found = false
                    if (typeof action_function == "object") {
                        action_function.forEach(element => {
                            cancel_found = element(j_this, selector_txt, active_host, active_url);
                        })
                    } else if (typeof action_function == "function") {
                        cancel_found = action_function(j_this, selector_txt, active_url);
                    }

                    if (cancel_found) {
                        b_targets_found = false
                    } else {
                        j_this.data("alreadyFound", true);
                    }
                }
            })
        } else {
            b_targets_found = false;
        }

        var control_obj = waitForKeyElements.control_obj || {};
        var control_key = selector_txt.replace(/[^\w]/g, "_");
        var time_control = control_obj[control_key];

        if (b_targets_found && b_wait_once && time_control) {
            clearInterval(time_control);
            delete control_obj[control_key];
        } else {
            if (!time_control) {
                time_control = setInterval(function () {
                    waitForKeyElements(selector_txt, active_host, active_url, b_wait_once, iframe_selector, action_function);
                }, 300);
                control_obj[control_key] = time_control;
            }
        }
        waitForKeyElements.control_obj = control_obj;
    }
}
function makeGetRequest(url, method = 'GET', data = null) {
    logPrint(`${method} -> ${url}`)
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url: url,
            method: method,
            data: data,
            onload: function (response) {
                resolve(response);
            },
            onerror: function (error) {
                reject(error);
            }
        });
    });
}
function logPrint(params) {
    var date_time = $.trim(new Date(new Date().setHours(new Date().getHours() + 8)).toISOString().replace("Z", " ").replace("T", " "))
    var function_name = (new Error()).stack.split("\n")[2].trim().split(" ")[1]
    console.log(`[${date_time}][DEBUG] ${function_name} - ${params}`)
}
function sleep(interval) {
    return new Promise(resolve => { setTimeout(resolve, interval) })
}
function getGigab2bTrackingNumber(jNode, selectorTxt, activeURL) {
    var ERROR_ON_ORDER_NUMBER = "Upload Time refers to the time when the sales order is uploaded to the Marketplace.";
    var order_numbers = jNode.text();
    var query_order_url = "https://www.gigab2b.com/index.php?route=account/sales_order/sales_order_management/salesOrderList&filter_orderId=";

    GM_xmlhttpRequest({
        method: "GET",
        url: query_order_url + order_numbers,
        onload: function (response) {
            if (response.finalUrl.indexOf("account/login") > 0) {
                jNode.append($(`<a target='_blank' href='${query_order_url + order_numbers}'>&nbsp检测到未登录&nbsp</a>`))
            } else if (response.responseText.indexOf(ERROR_ON_ORDER_NUMBER) == -1) {
                jNode.append($(`<a target='_blank' href='${query_order_url + order_numbers}'>&nbsp订单号不存在&nbsp</a>`))
            } else {
                var response_text = $(response.responseText);

                if (window.location.href.indexOf("sellercentral.amazon.com") > 0) {
                    var tracking_numbers = response_text.find(".tracking-number > a");
                    var tracking_href = $.trim(
                        response_text.find(".tracking-number > a").attr("href")
                    );
                } else if (window.location.href.indexOf("sellercentral-japan.amazon.com") > 0) {
                    var tracking_numbers = response_text.find(".tracking-number > span");
                }

                if (tracking_numbers.length > 0) {
                    var tracking = $.trim(response_text.find(".tracking-number").prop("firstChild").nodeValue)
                    jNode.append($(`<a target='_blank' href='${tracking_href}'>&nbsp${tracking}&nbsp</a>`))
                    for (let index = 0; index < tracking_numbers.length; index++) {
                        jNode.append($(`<span>&nbsp${tracking_numbers[index].textContent}&nbsp</span>`))
                    }
                } else {
                    jNode.append($(`<a target='_blank' href='${query_order_url + order_numbers}'>&nbsp没有查询到物流追踪编号&nbsp</a>`))
                }
            }
        },
    });
}
function getGigab2bProductInfo(jNode, selectorTxt, activeURL) {
    var query_product_info_url = 'https://www.gigab2b.com/index.php?route=product/search&search='

    if (selectorTxt == '#productTitle') {
        (async () => {
            var sku = $.trim(jNode.text().match(/\(.*?, (.*?)\)/)[1])
            var response = await makeGetRequest(query_product_info_url + sku)
            var response_text = $(response.responseText);
            var product_url = response_text.find(".product-image > a").attr("href")

            if (typeof product_url == "undefined") product_url = query_product_info_url + sku
            logPrint(`product_url -> ${product_url}`)
            let result = $.trim(jNode.text()).replace(/(\(.*, .*\))/, `<a target='_blank' href='${product_url}'>$1</a>`)
            logPrint(`result -> ${result}`)
            jNode.empty()
            jNode.append(result)
        })()
    } else if (selectorTxt == '.myo-list-orders-product-name-cell> div:nth-child(3) > div') {
        (async () => {
            var sku = $.trim(jNode.text().replace('SKU:  ', ''))
            var response = await makeGetRequest(query_product_info_url + sku)
            var response_text = $(response.responseText);
            var product_url = response_text.find(".product-image > a").attr("href")
            if (typeof product_url == "undefined") product_url = query_product_info_url + sku
            logPrint(`product_url -> ${product_url}`)
            jNode.empty()
            jNode.append($(`<div><span>SKU</span>:  <a target='_blank' href='${product_url}'>${sku}</a></div>`))
        })()
    }
}
function initializationScript() {
    loadMenu()
    var $ = window.$
    var VueCDN = "https://lib.baomitu.com/vue/3.2.36/vue.global.prod.min.js"
    var ElementPlusCDN = "https://lib.baomitu.com/element-plus/2.2.2/index.full.min.js"
    GM_addStyle(GM_getResourceText("element-plus"))
    $.getScript(VueCDN, function () {
        console.log("[" + VueCDN + "] Vue 加载成功");
        $.getScript(ElementPlusCDN, function () {
            console.log("[" + ElementPlusCDN + "] ElementPlus 加载成功")
            var ElementPlus = unsafeWindow.ElementPlus;
            var Vue = unsafeWindow.Vue;
        })
    })
}
function loadMenu() {
    var menu_ALL = [
        ['menu_amazon', 'Amazon', 'Amazon', true],
    ], menu_ID = []

    // 如果读取到的值为 null 就写入默认值
    for (let i = 0; i < menu_ALL.length; i++) {
        if (GM_getValue(menu_ALL[i][0]) == null) { GM_setValue(menu_ALL[i][0], menu_ALL[i][3]) }
    }

    registerMenuCommand()

    // 注册脚本菜单
    function registerMenuCommand() {

        // 如果菜单ID数组多于菜单数组，说明不是首次添加菜单，需要卸载所有脚本菜单
        if (menu_ID.length > menu_ALL.length) {
            for (let i = 0; i < menu_ID.length; i++) {
                GM_unregisterMenuCommand(menu_ID[i])
            }
        }

        // 循环注册脚本菜单
        for (let i = 0; i < menu_ALL.length; i++) {
            menu_ALL[i][3] = GM_getValue(menu_ALL[i][0])
            menu_ID[i] = GM_registerMenuCommand(`${menu_ALL[i][3] ? '✅' : '❌'} ${menu_ALL[i][2]}`, function () {
                menu_switch(`${menu_ALL[i][0]}`, `${menu_ALL[i][1]}`, `${menu_ALL[i][2]}`, `${menu_ALL[i][3]}`)
            })
        }

        // 加入版本信息
        menu_ID[menu_ID.length] = GM_registerMenuCommand(`🏁 当前版本 ${GM_info['script']['version']}`, function () {
            window.GM_openInTab(version_url, { active: true, insert: true, setParent: true })
        })
    }

    //切换选项
    function menu_switch(name, ename, cname, value) {
        if (value == 'false') {
            console.log(name)
            // 重新注册脚本菜单，刷新网页
            GM_setValue(`${name}`, true)
            registerMenuCommand()
            location.reload()
            GM_notification({ text: `「${cname}」已开启\n`, timeout: 3500 })
        } else {
            console.log(name)
            // 重新注册脚本菜单，刷新网页
            GM_setValue(`${name}`, false)
            registerMenuCommand()
            location.reload()
            GM_notification({ text: `「${cname}」已关闭\n`, timeout: 3500 })
        }
        // 重新注册脚本菜单
        registerMenuCommand()
    }
}

// ==UserScript==
// @name         Lastine-Tool-Helper
// @namespace    http://51tool.art/
// @version      0.23
// @description  helper for walmart
// @author       CoDeleven
// @match        https://seller.walmart.com/*
// @grant        unsafeWindow
// @license      GPL
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/489829/Lastine-Tool-Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/489829/Lastine-Tool-Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let begin_task = 0;
    let shop_account = ''
    let shop_name = ''
    let shop_id = ''
    const task_status = {
        "task1": {
            "status": 0
        },
        "task2": {
            "status": 0
        },
        "task3": {
            "status": 0
        },
        "task4": {
            "status": 0
        },
    }
    function getNDaysAgo(n) {
        const date = new Date();
        date.setDate(date.getDate() - n); // 减去n天
        return formatDate(date); // 格式化日期
    }

    function formatDate(date) {
        let year = date.getFullYear();
        let month = ('0' + (date.getMonth() + 1)).slice(-2); // 月份从0开始，加1后补零
        let day = ('0' + date.getDate()).slice(-2); // 补零
        return `${year}-${month}-${day}`;
    }

    function taskError(taskId, errorMsg, url) {
        task_status[taskId].status = 2;
        $(`#${taskId}_msg`).text("下载url:[" + url + "]异常，异常原因：" + errorMsg).show()
    }

    function taskSuccess(taskId) {
        task_status[taskId].status = 1;
        $(`#${taskId}_msg`).text("").hide()
    }

    function taskUpdate(taskId, v1, v2) {
        $(`#${taskId}_progress_text`).text(v1 + "/" + v2)
    }

    function taskReset(taskId) {
        task_status[taskId].status = 0;
        $(`#${taskId}_progress_text`).text("进行中")

        $(`#${taskId}_msg`).text("").hide()
    }

    function saveProducts(data) {
        $("#resave-data").prop("disabled", true)
        $.ajax({
            "url": "https://lastine.51tool.art/products",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/json"
            },
            "data": JSON.stringify({
                "shop_account": shop_account,
                "shop_id": shop_id,
                "shop_name": shop_name,
                "platform": "walmart",
                "list": data
            }),
            "error": function() {
                $("#resave-data").prop("disabled", false)
            },
            "success":function() {
                $("#resave-data").prop("disabled", false)
            }
        })
    }

    /**
     * 查询过去90天的平均售价
     * task4
     */
    async function queryPast90AUR(data) {
        try {
            const new_dict = data.reduce((obj, item) => {
                obj['' + item.skuNumber] = item
                return obj
            }, {})
            const yesterday = getNDaysAgo(1)
            const past90Day = getNDaysAgo(90)
            let startIndex = 0;
            let totalCount = 0;
            let beginPage = 1;
            let totalPage = 1;
            do {
                await new Promise((resolve, reject) => {
                    var settings = {
                        "url": "https://seller.walmart.com/aurora/v1/auroraAnalyticsService/gql",
                        "method": "POST",
                        "timeout": 0,
                        "headers": {
                            "authority": "seller.walmart.com",
                            "x-xsrf-token": "49e4a0b00e6e9c3bc449847957b94561788cdb9e3591ec8fcd21f1a90202d2a7",
                            "wm_aurora.locale": "zh",
                            "accept": "application/json",
                            "wm_svc.name": "API",
                            "wm_aurora.market": "US",
                            "wm_qos.correlation_id": "dd13d61a-230e-4346-8a96-7fa111effb02",
                            "accept-language": "zh-CN,zh;q=0.9",
                            "content-type": "application/json"
                        },
                        "data": JSON.stringify({
                            "query": "\n      query ($itemSales: Filter!) {\n        itemSales:get_auroraAnalyticsService_itemSalesMetrics (input: $itemSales) {\n          itemSalesMetric {\n            \n  prodName\n  skuId\n  totalGMV\n  totalUnits\n  totalAuthOrders\n  totalProductVisits\n  conversion\n  catalogItemId\n  baseItemId\n  totalProductVisitsItemLevel\n  conversionItemLevel\n  totalAuthAmount\n  totalCancelledGMV\n  totalRefundedGMV\n  department\n  brandName\n  avgListingQualityScore\n  gmvMinusCommission\n  authAUR\n  totalCancelledUnits\n  \n\n          }\n          totalRecords\n        }\n      }\n    ",
                            "variables": {
                                "itemSales": {
                                    "filters": {
                                        "dateFilter": {
                                            "startDate": {
                                                "eq": past90Day
                                            },
                                            "endDate": {
                                                "eq": yesterday
                                            }
                                        },
                                        "program": {
                                            "eq": "ALL"
                                        },
                                        "search": []
                                    },
                                    "pagination": {
                                        "pageNumber": beginPage,
                                        "pageSize": 100
                                    },
                                    "aggBy": "DAY"
                                }
                            }
                        }),
                        "success": function (response, textStatus) {
                            try {
                                var itemSales = response['data']['itemSales']['itemSalesMetric']
                                console.log(itemSales)
                                itemSales.forEach(tmp => {
                                    // 根据skuId查询
                                    // SKUID会出现重复的情况，这里采用价格最低的那个作为标准
                                    let target = new_dict[tmp['skuId']]
                                    if (!!target) {
                                        // 存在authAUR了
                                        if (!!target['authAUR']) {
                                            // 重复得SKU，选择均价最低得那个记录
                                            if (tmp['authAUR'] < target['authAUR']) {
                                                target['authAUR'] = tmp['authAUR']
                                                target['totalUnits'] = tmp['totalUnits']
                                                target['totalAuthOrders'] = tmp['totalAuthOrders']
                                                target['totalCancelledUnits'] = tmp['totalCancelledUnits']
                                                target['totalGMV'] = tmp['totalGMV']
                                            }
                                        } else {
                                            target['authAUR'] = tmp['authAUR']
                                            target['totalUnits'] = tmp['totalUnits']
                                            target['totalAuthOrders'] = tmp['totalAuthOrders']
                                            target['totalCancelledUnits'] = tmp['totalCancelledUnits']
                                            target['totalGMV'] = tmp['totalGMV']
                                        }
                                    }
                                })
                                startIndex = startIndex + itemSales.length
                                totalCount = response['data']['itemSales']['totalRecords']
                                beginPage = beginPage + 1
                                totalPage = Math.ceil(totalCount / 25)
                                taskUpdate('task4', startIndex, totalCount)
                                if (startIndex >= totalCount) {
                                    taskSuccess('task4')
                                }
                                resolve()
                            } catch (err) {
                                console.error(err)
                                throw new Error(err);
                            }
                        },
                        "error": function (req, textStatus, errorThrown) {
                            taskError('task2', textStatus, req.url)
                            reject()
                        }

                    };
                    $.ajax(settings)
                })
            } while (beginPage <= totalPage);
        } catch (err) {
            console.error(err)
            throw new Error(err)
        }
        return new Promise((resolve, reject) => { resolve() })
    }


    /**
     * 查询所有产品的变体
     * task2
     * @param {*} data 
     */
    async function queryVariant(data) {
        var existsVariantProducts = data.filter((item) => {
            return !!item.variantGroupId
        })
        var sameVariantGroup = existsVariantProducts.reduce((obj, item) => {
            if (!!!obj[item['abstract_product_id'] + ':' + item['variantGroupId']]) {
                obj[item['abstract_product_id'] + ':' + item['variantGroupId']] = []
            }
            obj[item['abstract_product_id'] + ':' + item['variantGroupId']].push(item)
            return obj
        }, {})
        let startIndex = 0;
        // 变体产品总数量
        let totalCount = existsVariantProducts.length;
        // 遍历所有 相同变体组 的元素
        for (let key in sameVariantGroup) {
            if (sameVariantGroup.hasOwnProperty(key)) {
                let first = sameVariantGroup[key][0]
                await new Promise((resolve, reject) => {
                    let settings = {
                        "url": "https://seller.walmart.com/aurora/v1/items/list/indicator?pageSize=25&sortField=modifiedDtm&sortOrder=desc&startIndex=0&groupingAttributes=actual_color",
                        "method": "POST",
                        "timeout": 0,
                        "headers": {
                            "authority": "seller.walmart.com",
                            "accept": "application/json",
                            "wm_svc.name": "Walmart Marketplace",
                            "wm_aurora.market": "US",
                            "x-xsrf-token": "aeebb6a1572310e6a06e25c706bbf17ce142168b0585e0fee8099883595388d8",
                            "wm_qos.correlation_id": "38a1b44b-5401-4cca-8add-a58c100a3da3",
                            "accept-language": "zh-CN,zh;q=0.9",
                            "content-type": "application/json"
                        },
                        "data": JSON.stringify({
                            "variantGroupId": first.variantGroupId,
                            "abstract_product_id": first.abstract_product_id,
                            "offerLifeCycleStatus": ["ACTIVE"]
                        }),
                        "success": function (response, textStatus) {
                            try {
                                var status = response['status']
                                if (status == 'OK') {
                                    let variantListInSameGroup = sameVariantGroup[key]
                                    // 给相同变体组下的所有产品设置 primaryProductId
                                    if (!!variantListInSameGroup) {
                                        variantListInSameGroup.forEach((item) => {
                                            item.primaryProductId = response.payload.lineItems[0].primary_product_id
                                            const primaryProductList = response.payload.lineItems.filter((foo) => foo.productId == foo.primary_product_id);
                                            if (primaryProductList.length > 0) {
                                                item.primaryItemId = primaryProductList[0].itemId
                                            } else {
                                                item.primaryItemId = `没有找到baseItemId，可能该变体中无带星的产品`
                                            }

                                        })
                                        startIndex = startIndex + variantListInSameGroup.length
                                    }

                                    taskUpdate('task2', startIndex, totalCount)
                                    if (startIndex == totalCount) {
                                        taskSuccess('task2')
                                    }
                                    resolve()
                                } else {
                                    taskError('task2', status, req.url)
                                    reject()
                                }
                            } catch (err) {
                                console.error(err)
                                throw new Error(err);
                            }
                        },
                        "error": function (req, textStatus, errorThrown) {
                            taskError('task2', textStatus, req.url)
                            reject()
                        }
                    };
                    $.ajax(settings)
                })
            }
        }
    }

    function generateRandomHex() {
        // 创建一个长度为32的数组，每个元素都是一个随机的16进制数字
        const randomHexArray = Array.from({ length: 64 }, () => {
          const randomInt = Math.floor(Math.random() * 16);
          return randomInt.toString(16);
        });
      
        // 将数组的元素连接成一个字符串
        const randomHexString = randomHexArray.join('');
      
        return randomHexString;
      }

    // task3
    async function queryCommissions(result) {
        try {
            // 把所有产品数据按25个一组，进行拆分，主要是为了模拟正常的操作，一次性发几百个去查会有风险把
            const new_dict = result.reduce((obj, item) => {
                obj['' + item.itemId] = item
                return obj
            }, {})
            const chunks = [];
            const chunkSize = 100
            for (let i = 0; i < result.length; i = i + chunkSize) {
                chunks.push(result.slice(i, i + chunkSize));
            }
            let totalCount = result.length;
            let startIndex = 0;
            for (let j = 0; j < chunks.length; j++) {
                const tmp = chunks[j]
                await new Promise((resolve, reject) => {
                    var settings = {
                        "url": "https://seller.walmart.com/aurora/v1/items/commissions",
                        "method": "POST",
                        "timeout": 0,
                        "headers": {
                            "authority": "seller.walmart.com",
                            "accept": "application/json",
                            "wm_svc.name": "Walmart Marketplace",
                            "wm_aurora.market": "US",
                            "x-xsrf-token": generateRandomHex(),
                            "wm_qos.correlation_id": "9cc06d80-2a85-4391-86ec-7acf6f5d9477",
                            "accept-language": "zh-CN,zh;q=0.9",
                            "content-type": "application/json"
                        },
                        "data": JSON.stringify(
                            tmp.map(ele => {
                                return {
                                    "itemId": ele.itemId,
                                    "productId": ele.productId,
                                    "ironBankCategory": ele.ironBankCategory ? ele.ironBankCategory: ele.ironbank_category,
                                    "productName": ele.productName,
                                    "productType": ele.productType,
                                    "itemCharge": ele.price
                                }
                            })
                        ),
                        "success": function (response, textStatus) {
                            try {
                                var status = response['status']
                                if (status == 'OK') {
                                    let array_list = response.payload
                                    array_list.forEach((item) => {
                                        // 如果存在的话
                                        if (!!item.error) {
                                            taskError('task3', `更新佣金(itemId:${item.itemId})失败，原因是${item.error},item:${JSON.stringify}`, '')
                                        } else {
                                            let bar = new_dict['' + item.itemId]
                                            bar.estimatedCommission = item['estimatedCommission']
                                        }

                                    })
                                    startIndex = startIndex + array_list.length
                                    taskUpdate('task3', startIndex, totalCount)
                                    if (startIndex == totalCount) {
                                        taskSuccess('task3')
                                    }
                                    resolve()
                                } else {
                                    taskError('task3', status, req.url)
                                    reject()
                                }
                            } catch (err) {
                                console.error(err)
                                throw new Error(err);
                            }
                        },
                        "error": function (req, textStatus, errorThrown) {
                            taskError('task3', textStatus, req.url)
                            reject()
                        }
                    };
                    $.ajax(settings)
                }).catch(err => console.log(err))

            }
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    async function downloadProducts(result) {
        let startIndex = 0;
        let totalCount = 0;
        do {
            await new Promise((resolve, reject) => {
                var settings = {
                    "url": "https://seller.walmart.com/aurora/v1/items/list/indicator?pageSize=1000&sortField=itemId&sortOrder=asc&startIndex=" + startIndex + "&nextMark=1000",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                        "authority": "seller.walmart.com",
                        "accept": "application/json",
                        "wm_svc.name": "Walmart Marketplace",
                        "wm_aurora.market": "US",
                        "x-xsrf-token": generateRandomHex(),
                        "wm_qos.correlation_id": "6db89603-56d4-410c-b88b-e1b1dcefe544",
                        "accept-language": "zh-CN,zh;q=0.9",
                        "content-type": "application/json"
                    },
                    "data": JSON.stringify({
                        "offerPublishStatus": "PUBLISHED",
                        "offerLifeCycleStatus": [
                            "ACTIVE"
                        ],
                    }),
                    "success": function (response, textStatus) {
                        var status = response['status']
                        if (status == 'OK') {
                            totalCount = response['payload']['totalRecords']
                            var items = response['payload']['lineItems']
                            for (var i = 0; i < items.length; i++) {
                                result.push(items[i])
                            }
                            startIndex = startIndex + items.length
                            taskUpdate('task1', startIndex, response['payload']['totalRecords'])
                            if (startIndex == totalCount) {
                                taskSuccess('task1')
                            }
                            resolve()
                        } else {
                            taskError('task1', status, req.url)
                            reject()
                        }
                    },
                    "error": function (req, textStatus, errorThrown) {
                        taskError('task1', textStatus, req.url)
                        reject()
                    }
                };
                $.ajax(settings)
            })
        } while (startIndex < totalCount && task_status['task1'].status == 0);
    }

    // 沃尔玛拉取下来的商品会有重复，这里做一下重复判断
    function checkRepeatProduct(target) {
        // 用于存储每个 itemId 出现次数的对象
        const itemCountMap = {};

        // 遍历 items 数组，统计每个 itemId 的出现次数
        target.forEach(item => {
            const { itemId } = item;
            if (itemCountMap[itemId]) {
                itemCountMap[itemId]++; // 如果已经存在，增加计数
            } else {
                itemCountMap[itemId] = 1; // 如果不存在，设置为 1
            }
        });

        // 用于存储出现次数大于 1 的 itemId
        const duplicateItemIds = [];

        // 找出出现次数大于 1 的 itemId
        for (const itemId in itemCountMap) {
            if (itemCountMap[itemId] > 1) {
                duplicateItemIds.push(itemId);
            }
        }

        // 计算具有相同 itemId 的对象数量
        const count = duplicateItemIds.length;

        return count > 0
    }

    async function downloadItems() {
        if (begin_task == 0) {
            begin_task = 1;
            $("#resave-data").hide()
            taskReset('task1')
            taskReset('task2')
            taskReset('task3')
            taskReset('task4')
            unsafeWindow.all_products = new Array()

            downloadProducts(unsafeWindow.all_products)
                .then(() => {
                    return new Promise((resolve, reject) => {
                        if(checkRepeatProduct(unsafeWindow.all_products)) {
                            reject("拉取的商品存在重复项，请重新拉取")
                        } else {
                            resolve()
                        }
                    })
                })
                .then(() => {
                    return new Promise((resolve, reject) => {
                        queryCommissions(unsafeWindow.all_products).then(() => {
                            resolve()
                        })
                    })
                })
                .then(() => {
                    return new Promise((resolve, reject) => {
                        queryPast90AUR(unsafeWindow.all_products).then(() => {
                            resolve()
                        })
                    })
                })
                .then(() => {
                    return new Promise((resolve, reject) => {
                        queryVariant(unsafeWindow.all_products).then(() => resolve())
                    })
                })
                .then(() => {
                    begin_task = 0;
                    $("#resave-data").show()
                    console.log(unsafeWindow.all_products)
                    saveProducts(unsafeWindow.all_products)
                }).catch((err) => {
                    alert(err)
                }) 
        } else {
            alert("正在导出数据...如果迟迟未结束，请联系管理员")
        }
    }

    window.addEventListener('load', function () {
        var header = $("#header > div:nth-child(1) > header > section:nth-child(2)");
        if (!!header) {
            var new_btn = $(btn_html)
            shop_account = $("span[data-automation-id='profile-menu']>div>span").text()
            shop_name = $("span[data-automation-id='display-name']").text()
            shop_id = $("span[data-automation-id='partner-id']").text()
            new_btn.click(function () {
                $("#lastine-task-progress-panel").toggle()
            });
            header.prepend(new_btn);
            // 在通知窗后面添加我们自己的任务窗口
            $("#notifications").after($(task_history_html))
            // 给任务窗口的叉叉添加关闭隐藏功能
            $("#close-lastine-panel").click(function () {
                $("#lastine-task-progress-panel").hide()
            })
            $("#resave-data").click(function () {
                saveProducts(unsafeWindow.all_products)
            })
            // 点击数据导出按钮开始下载数据
            $("#download-activity-data").click(downloadItems)
            $("#helper-title").text(`Lastine工具箱助手(商家: ${shop_account})`)
            unsafeWindow.downloadItems = downloadItems
        }
    }, true);

})();

const task_history_html = `<div id="lastine-task-progress-panel" style="display: none;">
<div>
    <div data-automation-id="notification-panel-container" class="shadow-2 z-100 fixed overflow-y-scroll
styles-module_showPanel__KGAJL">
        <div class="styles-module_panelWidth__0WYUx">
            <div class="styles-module_borderb1__fdPip border-solid border-gray-20 p-16 pt-24"><span
                    class="font-700 text-18 text-gray-160" id='helper-title'>Lastine工具箱助手</span><svg width="1em" height="1em"
                    viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                    data-automation-id="close-notification-panel" class="inline-block absolute right-8 cursor-pointer"
                    id="close-lastine-panel" style="font-size: 24px; vertical-align: -0.25em;">
                    <path
                        d="M4.008 3.131l.059.052L8 7.116l3.933-3.933.059-.052a.625.625 0 0 1 .877.877l-.052.059L8.884 8l3.933 3.933a.625.625 0 0 1-.825.936l-.059-.052L8 8.884l-3.933 3.933-.059.052a.625.625 0 0 1-.877-.877l.052-.059L7.116 8 3.183 4.067a.625.625 0 0 1 .825-.936z"
                        fill-rule="evenodd"></path>
                </svg></div>

            <div class="py-8 styles-module_borderb1__fdPip border-solid border-gray-20 p-16 flex items-center">
                <button id="download-activity-data" aria-pressed="false" class="Chip-module_chip__3f0zv Chip-module_large__LSddQ flex-none "
                    type="button" data-automation-id="itemListDownloadChipNode"><svg width="1em" height="1em"
                        viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="mr-8"
                        aria-hidden="true" role="presentation"
                        style="font-size: 16px; vertical-align: -0.175em;">
                        <path
                            d="M10 9a.5.5 0 0 1 .492.41l.008.09v3.793l.646-.647.07-.057a.5.5 0 0 1 .695.695l-.057.07-1.5 1.5-.07.057a.5.5 0 0 1-.568 0l-.07-.057-1.5-1.5-.057-.07a.5.5 0 0 1 0-.568l.057-.07.07-.057a.5.5 0 0 1 .568 0l.07.057.646.647V9.5A.5.5 0 0 1 10 9zM8.465 1c2.346 0 4.296 1.766 4.625 4.08l.016.138.083.044a3.603 3.603 0 0 1 1.805 2.935l.006.208c0 1.92-1.452 3.487-3.307 3.59L11.5 12v-1c1.386 0 2.5-1.153 2.5-2.595a2.597 2.597 0 0 0-1.563-2.4.5.5 0 0 1-.304-.435C12.032 3.57 10.42 2 8.465 2 6.585 2 5.01 3.46 4.813 5.368a.5.5 0 0 1-.462.448C3.034 5.908 2 7.036 2 8.405c0 1.378 1.044 2.502 2.36 2.59l.165.005H8.5v1H4.525C2.575 12 1 10.388 1 8.405c0-1.695 1.155-3.13 2.723-3.502l.153-.033.007-.037c.414-2.127 2.207-3.727 4.365-3.828L8.465 1z"
                            fill-rule="evenodd"></path>
                    </svg>抓取活动数据</button>
                <button id="resave-data" style="display:none;margin-left:10px" aria-pressed="false" class="Chip-module_chip__3f0zv Chip-module_large__LSddQ flex-none "
                    type="button" data-automation-id="itemListDownloadChipNode"><svg width="1em" height="1em"
                        viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="mr-8"
                        aria-hidden="true" role="presentation"
                        style="font-size: 16px; vertical-align: -0.175em;">
                        <path
                            d="M10 9a.5.5 0 0 1 .492.41l.008.09v3.793l.646-.647.07-.057a.5.5 0 0 1 .695.695l-.057.07-1.5 1.5-.07.057a.5.5 0 0 1-.568 0l-.07-.057-1.5-1.5-.057-.07a.5.5 0 0 1 0-.568l.057-.07.07-.057a.5.5 0 0 1 .568 0l.07.057.646.647V9.5A.5.5 0 0 1 10 9zM8.465 1c2.346 0 4.296 1.766 4.625 4.08l.016.138.083.044a3.603 3.603 0 0 1 1.805 2.935l.006.208c0 1.92-1.452 3.487-3.307 3.59L11.5 12v-1c1.386 0 2.5-1.153 2.5-2.595a2.597 2.597 0 0 0-1.563-2.4.5.5 0 0 1-.304-.435C12.032 3.57 10.42 2 8.465 2 6.585 2 5.01 3.46 4.813 5.368a.5.5 0 0 1-.462.448C3.034 5.908 2 7.036 2 8.405c0 1.378 1.044 2.502 2.36 2.59l.165.005H8.5v1H4.525C2.575 12 1 10.388 1 8.405c0-1.695 1.155-3.13 2.723-3.502l.153-.033.007-.037c.414-2.127 2.207-3.727 4.365-3.828L8.465 1z"
                            fill-rule="evenodd"></path>
                    </svg>重新保存数据</button>
            </div>

            <div data-automation-id="task-history-panel">
                <div class="flex p-16 styles-module_borderb1__fdPip border-solid border-gray-30">
                    <div class="mr-8"><svg width="1em" height="1em" viewBox="0 0 16 16"
                            xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="text-blue-130"
                            aria-hidden="true" role="presentation"
                            style="font-size: 16px; vertical-align: -0.175em;">
                            <path
                                d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zm0 1a6 6 0 1 0 0 12A6 6 0 0 0 8 2zm-1 9.5a.5.5 0 0 1-.09-.992L7 10.5h.499v-3H7a.5.5 0 0 1-.492-.41L6.5 7a.5.5 0 0 1 .41-.492L7 6.5h1.5l-.001 4H9a.5.5 0 0 1 .09.992L9 11.5H7zm.879-7.121a.621.621 0 1 1 0 1.242.621.621 0 0 1 0-1.242z"
                                fill-rule="evenodd"></path>
                        </svg></div><div
                        class="Link-module_link__5a8R- mr-16 styles-module_notificationItem__Thsmq"
                        href="javascript:void(0)">
                        <div class="font-700 pb-8 text-14 text-gray-160">任务1-产品数据</div>
                        <div class="text-14 text-gray-130">用于下载产品数据（已下载产品数/总数）</div>
                        <div class="text-12 text-red-130" style="display:none" id="task1_msg">错误信息：</div>
                    </div>
                    <div class="text-12 text-gray-100 absolute right-20"><span
                            data-automation-id="eye-icon-b28da200-e0ab-11ee-a54b-570265694de5"><span
                                class="text-12 text-gray-100" id="task1_progress_text">0/0</span></span></div>
                </div>
                <div class="flex p-16 styles-module_borderb1__fdPip border-solid border-gray-30">
                    <div class="mr-8"><svg width="1em" height="1em" viewBox="0 0 16 16"
                            xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="text-blue-130"
                            aria-hidden="true" role="presentation"
                            style="font-size: 16px; vertical-align: -0.175em;">
                            <path
                                d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zm0 1a6 6 0 1 0 0 12A6 6 0 0 0 8 2zm-1 9.5a.5.5 0 0 1-.09-.992L7 10.5h.499v-3H7a.5.5 0 0 1-.492-.41L6.5 7a.5.5 0 0 1 .41-.492L7 6.5h1.5l-.001 4H9a.5.5 0 0 1 .09.992L9 11.5H7zm.879-7.121a.621.621 0 1 1 0 1.242.621.621 0 0 1 0-1.242z"
                                fill-rule="evenodd"></path>
                        </svg></div><div
                        class="Link-module_link__5a8R- mr-16 styles-module_notificationItem__Thsmq"
                        href="javascript:void(0)">
                        <div class="font-700 pb-8 text-14 text-gray-160">任务2-变体数据</div>
                        <div class="text-14 text-gray-130">下载变体数据（总数=变体产品个数）</div>
                        <div class="text-12 text-red-130" style="display:none" id="task2_msg">错误信息：</div>
                    </div>
                    <div class="text-12 text-gray-100 absolute right-20"><span
                            data-automation-id="eye-icon-78d48640-d337-11ee-a738-f56bb2e1af42"><span
                                class="text-12 text-gray-100" id="task2_progress_text">0/0</span></span></div>
                </div>
                <div class="flex p-16 styles-module_borderb1__fdPip border-solid border-gray-30">
                    <div class="mr-8"><svg width="1em" height="1em" viewBox="0 0 16 16"
                            xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="text-blue-130"
                            aria-hidden="true" role="presentation"
                            style="font-size: 16px; vertical-align: -0.175em;">
                            <path
                                d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zm0 1a6 6 0 1 0 0 12A6 6 0 0 0 8 2zm-1 9.5a.5.5 0 0 1-.09-.992L7 10.5h.499v-3H7a.5.5 0 0 1-.492-.41L6.5 7a.5.5 0 0 1 .41-.492L7 6.5h1.5l-.001 4H9a.5.5 0 0 1 .09.992L9 11.5H7zm.879-7.121a.621.621 0 1 1 0 1.242.621.621 0 0 1 0-1.242z"
                                fill-rule="evenodd"></path>
                        </svg></div><div
                        class="Link-module_link__5a8R- mr-16 styles-module_notificationItem__Thsmq">
                        <div class="font-700 pb-8 text-14 text-gray-160">任务3-佣金数据</div>
                        <div class="text-14 text-gray-130">下载佣金数据（已获取佣金数/产品总数）</div>
                        <div class="text-12 text-red-130" style="display:none" id="task3_msg">错误信息：</div>
                    </div>
                    <div class="text-12 text-gray-100 absolute right-20 cursor-pointer"><span
                            data-automation-id="eye-icon-7c2b9300-d9e6-11ee-b146-53e2085443d3"><span
                                class="text-12 text-gray-100" id="task3_progress_text">0/0</span></span></div>
                </div>

                <div class="flex p-16 styles-module_borderb1__fdPip border-solid border-gray-30">
                    <div class="mr-8"><svg width="1em" height="1em" viewBox="0 0 16 16"
                            xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="text-blue-130"
                            aria-hidden="true" role="presentation"
                            style="font-size: 16px; vertical-align: -0.175em;">
                            <path
                                d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zm0 1a6 6 0 1 0 0 12A6 6 0 0 0 8 2zm-1 9.5a.5.5 0 0 1-.09-.992L7 10.5h.499v-3H7a.5.5 0 0 1-.492-.41L6.5 7a.5.5 0 0 1 .41-.492L7 6.5h1.5l-.001 4H9a.5.5 0 0 1 .09.992L9 11.5H7zm.879-7.121a.621.621 0 1 1 0 1.242.621.621 0 0 1 0-1.242z"
                                fill-rule="evenodd"></path>
                        </svg></div><div
                        class="Link-module_link__5a8R- mr-16 styles-module_notificationItem__Thsmq">
                        <div class="font-700 pb-8 text-14 text-gray-160">任务4-近90天平均客单价</div>
                        <div class="text-14 text-gray-130">下载近90天的平均客单价数据（已下载数量/总数）</div>
                        <div class="text-12 text-red-130" style="display:none" id="task4_msg">错误信息：</div>
                    </div>
                    <div class="text-12 text-gray-100 absolute right-20 cursor-pointer"><span
                            data-automation-id="eye-icon-7c2b9300-d9e6-11ee-b146-53e2085443d3"><span
                                class="text-12 text-gray-100" id="task4_progress_text">0/0</span></span></div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>`

const btn_html = `<span class="Popover-module_popoverContainer__bNO0L"><span class="Caption-module_caption__LHuON Caption-module_weight400__FLVyz text-white align-middle cursor-pointer ml-16" data-automation-id="lastine-activity-report" data-testid="lastine-activity-report" style="
border: solid 2px yellow;
padding: 8px;
" id="lastine-activity-report">
<img src="https://s21.ax1x.com/2024/03/15/pFg6JPK.png" style="
width: 60px;
display: inline-block;
vertical-align: middle;
">
<span class="Caption-module_caption__LHuON Caption-module_weight400__FLVyz text-white text-14 ml-8" style="
vertical-align: middle;
/* font-size: large; */
">Lastine工具箱助手</span></span></span>`
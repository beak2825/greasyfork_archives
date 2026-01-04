// ==UserScript==
// @name         hll的插件
// @namespace    http://tampermonkey.net/
// @version      1.0.17
// @description  hll的一个小插件-1.0.17
// @author       qianglog
// @match        http://warehouse.westcoal.com.cn/*
// @match        https://market3.westcoal.com.cn/*
// @match        http://warehouseapi.westcoal.com.cn/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.js
// @connect      *
// @connect      127.0.0.1
// @connect      10.3.149.117
// @connect      market-1253330314.cos.ap-chengdu.myqcloud.com
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GPLV3
// @downloadURL https://update.greasyfork.org/scripts/476036/hll%E7%9A%84%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/476036/hll%E7%9A%84%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
// 出库单
var hostUrl = ""
var domain = "" // 回收单系统 后端domain
var baseUrl = '' // 云仓项目url
var params = function () {
    return ""
}
var getSyncData = function () {
    return ""
}
var getUpdateDateUrl = ''
var postResponseUrl = '' // 请求回收单系统后端接口地址
var update_time = '' // 后端返回的更新时间
var element = '' // 同步按钮标签
var dataAll = [] // 全部数据存放位置
var startState = false // 开始状态，如果为 true 则检测到的数据进行追加，否则进行覆盖
var frequency = 10000 // 同步频率
var dateStr = "" // 请求时间字符串 2022-11-01 00:00:00,2022-11-08 23:59:59
var currentPage = 1 // 当前页面
var totalPages = 1 // 总页码
var pageCount = 1// 总个数
var isDscNew = false // 是否是新大市场同步
var loadingEle = ''
var title = ''
var materialList = []
var materialInfo = []
var materialDomain = "http://10.3.149.117:8009"
var downloadFileTaskId = ''
var downloadOk = false
var downloadUrl = ''

function getDateStr(date) {
    // 获取时间字符串
    var dateObject = date ? new Date(date) : new Date()
    var y = dateObject.getFullYear()
    var m = dateObject.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    var d = dateObject.getDate()
    d = d < 10 ? ('0' + d) : d
    return y + '-' + m + '-' + d
}

var isGet2DeliveryOrderNo = false

function get2DeliveryOrderNo(type) {
    // 获取有个多条退库对应一个出库的数据内容
    var orderNoDataAll = []
    GM_xmlhttpRequest({
        method: "get",
        url: 'http://10.3.149.117:8009/api/api/approve/get_2_delivery_order_no/?type=' + type,
        headers: {
            "Content-Type": "application/json",
        },
        onload: function (newResponse) {
            newResponse = JSON.parse(newResponse.response)
            newResponse.data.map(item => {
                let url = 'http://warehouseapi.westcoal.com.cn/v1/warehouse/report/stock_out_items/?page=1&perPage=100&stockOutBatchNo=' + item.delivery_order_no + '&dateStr=' + getDateStr(new Date().setFullYear(new Date().getFullYear() - 1)) + '%2000:00:00,' + getDateStr() + '%2023:59:59&statusTag=refunded&productCode=' + item.material_code
                GM_xmlhttpRequest({
                    method: "get",
                    url: url,
                    headers: {
                        "Content-Type": "application/json", "Authorization": "JWT " + getCookie('material-buyer')
                    },
                    onload: function (newResponse) {
                        newResponse = JSON.parse(newResponse.response)
                        let pickingOrderNo = ''
                        newResponse.data.items.map(newItem => {
                            if (newItem.stockOutItem.refundedQuantity === item.quantity && newItem.product.code === item.material_code) {
                                pickingOrderNo = newItem.consumeOrder && newItem.consumeOrder.orderNo
                            }
                        })
                        orderNoDataAll.push({
                            delivery_order_no: item.delivery_order_no,
                            material_code: item.material_code,
                            picking_order_no: pickingOrderNo,
                        })
                    }
                })
            })
            var setIntervalObj = setInterval(function () {
                if (newResponse.data.length <= orderNoDataAll.length) {
                    clearInterval(setIntervalObj)
                    // 推送对应成功信息
                    GM_xmlhttpRequest({
                        method: "post",
                        url: 'http://10.3.149.117:8009/api/api/approve/get_2_delivery_order_no/?type=' + type,
                        data: JSON.stringify({
                            "data": orderNoDataAll,
                            "type": type,
                        }),
                        headers: {
                            "Content-Type": "application/json"
                        },
                        onload: function (response) {
                            isGet2DeliveryOrderNo = true
                        },
                        onerror: function (response) {
                            isGet2DeliveryOrderNo = true
                        }
                    })
                }
            }, 1000);

        }
    })
}

var typeDict = {
    // 矿业入库
    "http://warehouse.westcoal.com.cn/inStatistics": {
        title: '矿业库房',
        hostUrl: "http://warehouse.westcoal.com.cn/inStatistics",
        domain: "http://10.3.149.117:8009",
        baseUrl: 'http://warehouseapi.westcoal.com.cn/v1/warehouse/statistics/data/details/?', // 云仓项目url
        getUpdateDateUrl: 'http://10.3.149.117:8009/api/api/approve/spider/HSD_RK/',
        params: function () {
            return "statisticEventType=deposit&finishedTime=" + dateStr
        },
        getSyncData: function (response) {
            response.data.items.map(item => {
                // 入库单价（元）
                let money = Math.round(item.stock.price / item.stock.enlargedFactor / 100 * 1000) / 1000
                let quantity = item.storage.eventComment === '采购退货出库' ? (item.storage.originQuantity || 0) : (item.stock.quantity || 0)
                const retData = {
                    "data_id": item.storage.businessBatchNo,
                    "class_code": item.category0.code,
                    "class_describe": item.category0.name,
                    "price": Math.round(item.stock.price / item.stock.enlargedFactor / 100 * quantity * 100) / 100 || 0,
                    "supplier_name": item.supplier.name || '',
                    "completion_time": item.storage && item.storage.finishedTime,
                    "type": item.storage.eventComment,
                    "material_code": item.product.code || '',
                    "number": quantity,
                    "money": money || 0,
                }
                dataAll.push(retData)
            })
            totalPages = response.data.page.totalPages // 设置总页码

        }

    },
    // 出库 CK
    "http://warehouse.westcoal.com.cn/reportForm/outStock/list": {
        title: '区队库房',
        hostUrl: "http://warehouse.westcoal.com.cn/reportForm/outStock/list",
        domain: "http://10.3.149.117:8008",
        baseUrl: 'http://warehouseapi.westcoal.com.cn/v1/warehouse/report/stock_out_items/', // 云仓项目url
        getUpdateDateUrl: 'http://10.3.149.117:8008/spider/WMS_CK/',
        params: function () {
            return "statusTag=stock_out&dateStr=" + dateStr
        },
        getSyncData: function (response) {
            response.data.items.map(item => {
                let create_time = item.stockOutItem && item.stockOutItem.finishedAt
                if (create_time && item.location && item.location.name === '智能立体库') {
                    let goodsQty = Math.round(item.stockOutItem.quantity * 100) / 100
                    if (item.unit.name in ['公斤', '千克', '千米', '千件']) {
                        goodsQty = goodsQty * 1000
                    }
                    let goodsUnit = item.unit.name
                    if (goodsUnit === '千克') {
                        goodsUnit = '克'
                    } else if (goodsUnit === '公斤') {
                        goodsUnit = '克'
                    } else if (goodsUnit === '千米') {
                        goodsUnit = '米'
                    } else if (goodsUnit === '千件') {
                        goodsUnit = '件'
                    }
                    const retData = {
                        "dn_code": item.stockOutBatch.batchNo,
                        "goods_code": item.product.code,
                        "goods_desc": item.product.name,
                        "goods_class": item.category.code,
                        "goods_brand": item.category.name,
                        "goods_qty": goodsQty,
                        "goods_unit": goodsUnit,
                        "goods_unit_price": item.stock.price / item.stock.enlargedFactor / 100,
                        "goods_price": item.stockOutItem.total / 100,
                        "customer": item.consumeOrder ? (item.consumeOrder.payDepartment || '无') : '无',
                        "comments": item.stock.comment || '',
                        "supplier": item.supplier ? (item.supplier.name || '随机') : '随机',
                        "create_time": create_time,
                        "creater": item.operator.fullname,
                        "openid": 'e1d74f3c862d27333b56e27bd72a49bf',
                    }
                    const materialCode = retData.goods_code
                    const materialName = retData.goods_desc
                    const materialUnit = item.unit && item.unit.name
                    if (materialList.indexOf(materialCode) === -1) {
                        materialInfo.push({
                            code: materialCode, name: materialName, unit: materialUnit || ''
                        })
                        materialList.push(materialCode)
                    }
                    dataAll.push(retData)
                }
            })
            totalPages = response.data.page.totalPages // 设置总页码
        }
    },
    // 入库 RK
    "http://warehouse.westcoal.com.cn/reportForm/inStock/list": {
        title: '区队库房',
        hostUrl: "http://warehouse.westcoal.com.cn/reportForm/inStock/list",
        domain: "http://10.3.149.117:8008",
        baseUrl: 'http://warehouseapi.westcoal.com.cn/v1/warehouse/report/deposit_items/', // 云仓项目url
        getUpdateDateUrl: 'http://10.3.149.117:8008/spider/WMS_RK/',
        params: function () {
            return "dateStr=" + dateStr
        },
        getSyncData: function (response) {
            response.data.items.map(item => {
                let create_time = item.depositBatch && item.depositBatch.endAt
                if (create_time && item.location && item.location.name === '智能立体库') {
                    let goodsQty = Math.round(item.depositPosition.depositQuantity * 1000) / 1000
                    if (item.unit.name in ['公斤', '千克', '千米', '千件']) {
                        goodsQty = goodsQty * 1000
                    }
                    let goodsUnit = item.unit.name
                    if (goodsUnit === '千克') {
                        goodsUnit = '克'
                    } else if (goodsUnit === '公斤') {
                        goodsUnit = '克'
                    } else if (goodsUnit === '千米') {
                        goodsUnit = '米'
                    } else if (goodsUnit === '千件') {
                        goodsUnit = '件'
                    }
                    const retData = {
                        "asn_code": item.depositBatch.batchNo,
                        "creater": item.operator.fullname,
                        "goods_code": item.product.code,
                        "goods_desc": item.product.name,
                        "goods_class": item.category.code,
                        "goods_brand": item.category.name,
                        "goods_qty": goodsQty,
                        "goods_unit": goodsUnit,
                        "goods_unit_cost": item.depositItem.price / item.depositItem.enlargedFactor / 100,
                        "goods_cost": item.depositPosition.total / 100,
                        "comments": item.depositItem.commente || '',
                        "supplier": item.supplier ? (item.supplier.name || '随机') : '随机',
                        "create_time": item.depositBatch && item.depositBatch.endAt,
                        "openid": 'e1d74f3c862d27333b56e27bd72a49bf',
                    }
                    const materialCode = retData.goods_code
                    const materialName = retData.goods_desc
                    const materialUnit = item.unit && item.unit.name
                    if (materialList.indexOf(materialCode) === -1) {
                        materialInfo.push({
                            code: materialCode, name: materialName, unit: materialUnit || ''
                        })
                        materialList.push(materialCode)
                    }
                    dataAll.push(retData)
                }
            })
            totalPages = response.data.page.totalPages // 设置总页码

        }
    },
    // 大市场
    "https://market3.westcoal.com.cn/line_item_report/material_receive/list": {
        title: '大市场',
        hostUrl: "https://market3.westcoal.com.cn/line_item_report/material_receive/list",
        domain: "http://10.3.149.117:8009",
        baseUrl: 'https://api3.westcoal.com.cn/v1/market/admin/material_consume_order/report/line_items/', // 云仓项目url
        getUpdateDateUrl: 'http://10.3.149.117:8009/api/api/approve/spider/HSD_DSC/',
        params: function () {
            return "delivery=true&dateBegin=" + dateStr.split(',')[0].split(' ')[0] + "&dateEnd=" + dateStr.split(',')[1].split(' ')[0]
        },
        getSyncData: function (response) {
            if (!downloadFileTaskId) {
                downloadFileTaskId = response.data.taskId
            }
            downloadUrl = response.data.downloadUrl
            // 导出完成获取url，通过url 获取对应的二进制流
            if (downloadUrl) {
                downloadOk = true
            }
        },
        downloadFileData: function (response) {

        }
    },
    // 进销存同步
    "http://warehouse.westcoal.com.cn/reportForm/saleInventory/list": {
        title: '矿业库房',
        hostUrl: "http://warehouse.westcoal.com.cn/reportForm/saleInventory/list",
        domain: "http://10.3.149.117:8009",
        baseUrl: 'http://warehouseapi.westcoal.com.cn/v1/warehouse/report/invoices/', // 云仓项目url
        getUpdateDateUrl: 'http://10.3.149.117:8009/api/api/approve/spider/HSD_JXC/',
        params: function () {
            return "stockStatus=hasStockWithTemp&perPage=500"
        },
        getSyncData: function (response) {
            response.data.items.map(item => {
                dataAll.push({
                    material_code: item.product.code,
                    material_name: item.product.name,
                    unit: item.unit.name + '(' + item.unit.code + ')',
                    warehousing_number: item.invoicing.depositQuantity,
                    warehousing_total: Math.round(item.invoicing.depositAmount / 100 * 100) / 100,

                    sales_issue_number: item.invoicing.stockOutQuantity,
                    sales_issue_total: Math.round(item.invoicing.stockOutAmount / 100 * 100) / 100,

                    receipt_return_number: item.invoicing.purchaseReturnQuantity,
                    receipt_return_total: Math.round(item.invoicing.purchaseReturnAmount / 100 * 100) / 100,

                    issue_and_return_number: item.invoicing.refundQuantity,
                    issue_and_return_total: Math.round(item.invoicing.refundAmount / 100 * 100) / 100,
                })
            })
            totalPages = response.data.page.totalPages // 设置总页码
        },
        downloadFileData: function (response) {

        }
    },
    // 库存同步
    "http://warehouse.westcoal.com.cn/warehouseMaterial/stock/list": {
        title: '矿业库房',
        hostUrl: "http://warehouse.westcoal.com.cn/warehouseMaterial/stock/list",
        domain: "http://10.3.149.117:8009",
        baseUrl: 'http://warehouseapi.westcoal.com.cn/v1/warehouse/stocks/', // 云仓项目url
        getUpdateDateUrl: 'http://10.3.149.117:8009/api/api/approve/spider/HSD_KC/',
        params: function () {
            return "stockStatus=hasStockWithTemp&perPage=500"
        },
        getSyncData: function (response) {
            response.data.items.map(item => {
                dataAll.push({
                    material_code: item.product.code, inventory_quantity: item.stockQuantity
                })
            })
            totalPages = response.data.page.totalPages // 设置总页码
        },
        downloadFileData: function (response) {

        }
    },
    // 矿业库房退库
    "http://warehouse.westcoal.com.cn/reportForm/backStock/list": {
        title: '矿业库房',
        hostUrl: "http://warehouse.westcoal.com.cn/reportForm/backStock/list",
        domain: "http://10.3.149.117:8009",
        baseUrl: 'http://warehouseapi.westcoal.com.cn/v1/warehouse/report/refund_items/', // 云仓项目url
        getUpdateDateUrl: 'http://10.3.149.117:8009/api/api/approve/spider/HSD_KYKF_TK/',
        params: function () {
            return "dateStr=" + dateStr
        },
        getSyncData: function (response) {
            response.data.items.map(item => {
                let url = 'http://warehouseapi.westcoal.com.cn/v1/warehouse/report/stock_out_items/?page=1&perPage=100&stockOutBatchNo=' + item.stockOutBatchNo + '&dateStr=' + getDateStr(new Date().setFullYear(new Date().getFullYear() - 1)) + '%2000:00:00,' + getDateStr() + '%2023:59:59&statusTag=refunded'
                GM_xmlhttpRequest({
                    method: "get",
                    url: url,
                    headers: {
                        "Content-Type": "application/json", "Authorization": "JWT " + getCookie('material-buyer')
                    },
                    onload: function (newResponse) {
                        newResponse = JSON.parse(newResponse.response)
                        let pickingOrderNo = ''
                        newResponse.data.items.map(newItem => {
                            if (newItem.stockOutItem.refundedQuantity === item.refundItem.quantity && newItem.product.code === item.product.code) {
                                pickingOrderNo = newItem.consumeOrder && newItem.consumeOrder.orderNo
                            }
                        })
                        dataAll.push({
                            return_order_no: item.refundBatch.batchNo,
                            material_code: item.product.code,
                            delivery_order_no: item.stockOutBatchNo,
                            picking_order_no: pickingOrderNo,
                            inventory_quantity: item.refundItem.quantity,
                            completion_time: item.refundBatch.endAt
                        })
                    }
                })
            })
            //上边异步方法执行完毕之后 会执行这里的方法
            totalPages = response.data.page.totalPages // 设置总页码
            pageCount = response.data.page.pageCount // 设置总个数
        },
        downloadFileData: function (response) {
        }
    },
    // 区队库房退库
    "http://warehouse.westcoal.com.cn/reportForm/backStock/lis": {
        title: '区队库房',
        hostUrl: "http://warehouse.westcoal.com.cn/reportForm/backStock/list",
        domain: "http://10.3.149.117:8009",
        baseUrl: 'http://warehouseapi.westcoal.com.cn/v1/warehouse/report/refund_items/', // 云仓项目url
        getUpdateDateUrl: 'http://10.3.149.117:8009/api/api/approve/spider/HSD_QDKF_TK/',
        params: function () {
            return "dateStr=" + dateStr
        },
        getSyncData: function (response) {
            response.data.items.map(item => {
                let url = 'http://warehouseapi.westcoal.com.cn/v1/warehouse/report/stock_out_items/?page=1&perPage=100&stockOutBatchNo=' + item.stockOutBatchNo + '&dateStr=' + getDateStr(new Date().setFullYear(new Date().getFullYear() - 1)) + '%2000:00:00,' + getDateStr() + '%2023:59:59&statusTag=refunded'
                GM_xmlhttpRequest({
                    method: "get",
                    url: url,
                    headers: {
                        "Content-Type": "application/json", "Authorization": "JWT " + getCookie('material-buyer')
                    },
                    onload: function (newResponse) {
                        newResponse = JSON.parse(newResponse.response)
                        let pickingOrderNo = ''
                        newResponse.data.items.map(newItem => {
                            if (newItem.stockOutItem.refundedQuantity === item.refundItem.quantity && newItem.product.code === item.product.code) {
                                pickingOrderNo = newItem.consumeOrder && newItem.consumeOrder.orderNo
                            }
                        })
                        dataAll.push({
                            return_order_no: item.refundBatch.batchNo,
                            material_code: item.product.code,
                            delivery_order_no: item.stockOutBatchNo,
                            picking_order_no: pickingOrderNo,
                            inventory_quantity: item.refundItem.quantity,
                            completion_time: item.refundBatch.endAt
                        })
                    }
                })
            })
            //上边异步方法执行完毕之后 会执行这里的方法
            totalPages = response.data.page.totalPages // 设置总页码
            pageCount = response.data.page.pageCount // 设置总个数
        },
        downloadFileData: function (response) {

        }
    },
    // 煤业物资工厂退库
    "http://warehouse.westcoal.com.cn/reportForm/backStock/l": {
        title: '煤业物资榆通红柳林供应站工厂',
        hostUrl: "http://warehouse.westcoal.com.cn/reportForm/backStock/list",
        domain: "http://10.3.149.117:8009",
        baseUrl: 'http://warehouseapi.westcoal.com.cn/v1/warehouse/report/refund_items/', // 云仓项目url
        getUpdateDateUrl: 'http://10.3.149.117:8009/api/api/approve/spider/HSD_MYWZ_TK/',
        params: function () {
            return "dateStr=" + dateStr
        },
        getSyncData: function (response) {
            response.data.items.map(item => {
                let url = 'http://warehouseapi.westcoal.com.cn/v1/warehouse/report/stock_out_items/?page=1&perPage=100&stockOutBatchNo=' + item.stockOutBatchNo + '&dateStr=' + getDateStr(new Date().setFullYear(new Date().getFullYear() - 1)) + '%2000:00:00,' + getDateStr() + '%2023:59:59&statusTag=refunded'
                GM_xmlhttpRequest({
                    method: "get",
                    url: url,
                    headers: {
                        "Content-Type": "application/json", "Authorization": "JWT " + getCookie('material-buyer')
                    },
                    onload: function (newResponse) {
                        newResponse = JSON.parse(newResponse.response)
                        let pickingOrderNo = ''
                        newResponse.data.items.map(newItem => {
                            if (newItem.stockOutItem.refundedQuantity === item.refundItem.quantity && newItem.product.code === item.product.code) {
                                pickingOrderNo = newItem.consumeOrder && newItem.consumeOrder.orderNo
                            }
                        })
                        dataAll.push({
                            return_order_no: item.refundBatch.batchNo,
                            material_code: item.product.code,
                            delivery_order_no: item.stockOutBatchNo,
                            picking_order_no: pickingOrderNo,
                            inventory_quantity: item.refundItem.quantity,
                            completion_time: item.refundBatch.endAt
                        })
                    }
                })
            })
            //上边异步方法执行完毕之后 会执行这里的方法
            totalPages = response.data.page.totalPages // 设置总页码
            pageCount = response.data.page.pageCount // 设置总个数
        },
        downloadFileData: function (response) {

        }
    },
    // 供应站工厂退库
    "http://warehouse.westcoal.com.cn/reportForm/backStock/li": {
        title: '供应站工厂',
        hostUrl: "http://warehouse.westcoal.com.cn/reportForm/backStock/list",
        domain: "http://10.3.149.117:8009",
        baseUrl: 'http://warehouseapi.westcoal.com.cn/v1/warehouse/report/refund_items/', // 云仓项目url
        getUpdateDateUrl: 'http://10.3.149.117:8009/api/api/approve/spider/HSD_GYZ_TK/',
        params: function () {
            return "dateStr=" + dateStr
        },
        getSyncData: function (response) {
            response.data.items.map(item => {
                let url = 'http://warehouseapi.westcoal.com.cn/v1/warehouse/report/stock_out_items/?page=1&perPage=100&stockOutBatchNo=' + item.stockOutBatchNo + '&dateStr=' + getDateStr(new Date().setFullYear(new Date().getFullYear() - 1)) + '%2000:00:00,' + getDateStr() + '%2023:59:59&statusTag=refunded'
                GM_xmlhttpRequest({
                    method: "get",
                    url: url,
                    headers: {
                        "Content-Type": "application/json", "Authorization": "JWT " + getCookie('material-buyer')
                    },
                    onload: function (newResponse) {
                        newResponse = JSON.parse(newResponse.response)
                        let pickingOrderNo = ''
                        newResponse.data.items.map(newItem => {
                            if (newItem.stockOutItem.refundedQuantity === item.refundItem.quantity && newItem.product.code === item.product.code) {
                                pickingOrderNo = newItem.consumeOrder && newItem.consumeOrder.orderNo
                            }
                        })
                        dataAll.push({
                            return_order_no: item.refundBatch.batchNo,
                            material_code: item.product.code,
                            delivery_order_no: item.stockOutBatchNo,
                            picking_order_no: pickingOrderNo,
                            inventory_quantity: item.refundItem.quantity,
                            completion_time: item.refundBatch.endAt
                        })
                    }
                })
            })
            //上边异步方法执行完毕之后 会执行这里的方法
            totalPages = response.data.page.totalPages // 设置总页码
            pageCount = response.data.page.pageCount // 设置总个数
        },
        downloadFileData: function (response) {

        }
    },
}

/**
 * 不足补0
 */
function padleft0(obj) {
    return obj.toString().replace(/^[0-9]{1}$/, "0" + obj);
}

/**
 * 获取当前时间
 */
function getNowTime() {
    var nowtime = new Date();
    var year = nowtime.getFullYear();
    var month = padleft0(nowtime.getMonth() + 1);
    var day = padleft0(nowtime.getDate());
    var hour = padleft0(nowtime.getHours());
    var minute = padleft0(nowtime.getMinutes());
    var second = padleft0(nowtime.getSeconds());
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}

function updateLoadingTitle() {
    if (startState) {
        loadingEle.innerHTML = '<div class="el-loading-mask is-fullscreen" style="background-color: rgba(0, 0, 0, 0.7); z-index: 2011;"><div class="el-loading-spinner"><i class="el-icon-loading"></i><p class="el-loading-text">正在进行同步数据请稍等...</p><br><p class="el-loading-text">[正在进行 ' + currentPage + '页 / 总' + totalPages + '页]</p></div></div>'
    } else {
        loadingEle.innerHTML = ''
    }
}

/**
 * 创建 Loading 窗口
 */
function createLoadingEle(hide = false) {
    if (hide) { // 隐藏 Loading
        if (loadingEle) {
            loadingEle.innerHtml = ''
        }
        return
    }
    if (loadingEle) {
        loadingEle.innerHtml = ''
    } else {
        loadingEle = document.createElement("span");
    }
    // loadingEle.innerHTML = '<div class="el-loading-mask is-fullscreen" style="z-index: 2005;"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div></div>'
    loadingEle.innerHTML = '<div class="el-loading-mask is-fullscreen" style="background-color: rgba(0, 0, 0, 0.7); z-index: 2011;"><div class="el-loading-spinner"><i class="el-icon-loading"></i><p class="el-loading-text">正在进行同步数据请稍等...</p></div></div>'
    let ele = document.getElementsByClassName("html-body")
    if (ele.length === 0) {
        ele = document.getElementsByClassName("app-wrapper")
    }
    ele = ele[ele.length - 1]
    ele.insertBefore(loadingEle, ele.childNodes[ele.length - 1])
}

/**
 * 时间添加
 * @param datetime 时间字符串
 * @param s 需要加的时间，可以为负数
 * @returns {string}
 */
function getUpdateDateAdd(datetime, s = 0) {
    datetime = new Date(datetime)
    var nowtime = new Date(datetime.valueOf() + s * 1000);
    var year = nowtime.getFullYear();
    var month = padleft0(nowtime.getMonth() + 1);
    var day = padleft0(nowtime.getDate());
    var hour = padleft0(nowtime.getHours());
    var minute = padleft0(nowtime.getMinutes());
    var second = padleft0(nowtime.getSeconds());
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}

/**
 * js将post请求的参数对象转换成get的形式拼接在url上
 * @param param
 * @returns {string}
 */
function changeParam(param) {
    return JSON.stringify(param).replace(/:/g, '=').replace(/,/g, '&').replace(/{/g, '?').replace(/}/g, '').replace(/"/g, '');
}

/**
 * 从回收单系统获取更新时间
 * @returns {string}
 */
function getUpdateDate() {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "get", url: getUpdateDateUrl, headers: {
                "Content-Type": "application/json"
            }, onload: function (response) {
                return resolve(JSON.parse(response.response))
            }, onerror: function (response) {
                return reject(response)
            }
        })
    })
}

function init() {
    currentPage = 1 // 当前页面
    totalPages = 1 // 总页码
    startState = false
    isGet2DeliveryOrderNo = false
    dataAll = []
    materialList = []
    materialInfo = []
    createLoadingEle(true)
}

function initType() {
    init()
    hostUrl = ""
    title = ""
    domain = ""
    baseUrl = '' // 云仓项目url
    getUpdateDateUrl = ''
    params = function () {
        return ""
    }
    getSyncData = function () {
        return ""
    }
    createLoadingEle(true)
}


function runUpdateData(res) {
    // 如果状态为0退出不同步
    if (res.can_spider === 0) {
        alert("当前有其他人正在同步请5分钟稍后重试")
        return
    }
    update_time = res.update_time
    if (!update_time) {
        alert("更新时间为空，终止同步!")
        return;
    }
    postResponseUrl = res.url
    if (!postResponseUrl) {
        alert("请求回收单系统地址为空，终止同步!")
        return;
    }
    GM_setValue("KykfRkGetUpdateDate", JSON.stringify(res))
    // 获取云仓从最后一次同步时间到当前时间段前5分钟的所有数据
    // dateStr = "2022-11-01 00:00:00,2022-11-08 23:59:59"
    dateStr = getUpdateDateAdd(update_time, 1) + "," + getUpdateDateAdd(getNowTime(), 0)
    // 2. 模拟接口请求，进行数据获取
    init()
    startState = true
    createLoadingEle()
    if (title === '大市场') {
        let ele = document.getElementsByClassName('el-button--default')
        ele = ele[ele.length - 1]
        ele.click()
    } else if (hostUrl === 'http://warehouse.westcoal.com.cn/warehouseMaterial/stock/list') { // 库存同步
        $('.float-right .el-button--primary').click()
    } else if (hostUrl === 'http://warehouse.westcoal.com.cn/reportForm/saleInventory/list') { // 库存同步
        $('.float-right .el-button--primary').click()
    } else {
        $("button[type=submit]").click()
    }
}

/**
 * 创建同步数据按钮
 * @returns {string}
 */
function createElement() {
    let ele = document.getElementsByClassName("el-form-item__content")
    let innerHTML = '<button data-v-4343f066="" type="button" class="el-button el-button--primary el-button--mini"><span>同步数据</span></button>'
    let newButtonHtml = ''
    if (ele.length === 0) {
        ele = document.getElementsByClassName("action-item")
        innerHTML = '<button data-v-4343f066="" type="button" class="el-button el-button--warning el-button--mini"><span>同步数据</span></button>'
        newButtonHtml = `<button data-v-4343f066="" type="button" class="el-button el-button--primary el-button--mini"><span>新同步数据</span></button>`
    }
    ele = ele[ele.length - 1]
    const swa = document.createElement("span");
    swa.style["margin-left"] = '20px'
    swa.innerHTML = innerHTML
    ele.insertBefore(swa, ele.childNodes[ele.length - 1])
    swa.addEventListener('click', function () {
        alert('开始同步...');
        // 点击后开始同步
        // 1. 先从后端获取同步时间
        // 2. 调用接口，进行数据获取
        // 3. 所有数据获取到后，发送到后端
        // 4. 结束同步
        let updateDate = GM_getValue("KykfRkGetUpdateDate")
        if (updateDate) {
            updateDate = JSON.parse(updateDate)
            // 计算时间差，如果差5分钟则删除缓存数据，并重新请求
            if ((new Date() - new Date(updateDate.update_time)) / 1000 < 300) {
                runUpdateData(updateDate)
            } else {
                GM_setValue("KykfRkGetUpdateDate", "")
                getUpdateDate().then(res => {
                    runUpdateData(res)
                })
            }
        } else {
            getUpdateDate().then(res => {
                runUpdateData(res)
            })
        }

    })
    element = swa
    const newButtonSwa = document.createElement("span");
    newButtonSwa.innerHTML = newButtonHtml
    ele.insertBefore(newButtonSwa, ele.childNodes[ele.length - 1])
    newButtonSwa.addEventListener('click', function () {
        var startTime = document.getElementsByClassName("el-range-input")[0].value
        var endTime = document.getElementsByClassName("el-range-input")[1].value
        if (!startTime || !endTime) {
            alert('请选择时间范围');
        } else {
            if (confirm("确定要同步 " + startTime + " 至 " + endTime + " 数据吗？")) {
                alert("同步中");
                init()
                isDscNew = true
                startState = true
                createLoadingEle(false)
                let ele = document.getElementsByClassName('el-button--default')
                ele = ele[ele.length - 1]
                ele.click()
            }
        }

    })
}

/**
 * 推送信息到服务端
 * @returns {string}
 */
function putSyncData(data) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "post", url: postResponseUrl, data: JSON.stringify(data), headers: {
                "Content-Type": "application/json"
            }, onload: function (response) {
                return resolve(response.data)
            }, onerror: function (response) {
                return reject(response)
            }
        })
    })

}

/**
 * 开始监听路由
 * @returns {string}
 */
function run() {
    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {
        const xhr = this;
        const getter = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, "response").get;
        Object.defineProperty(xhr, "responseText", {
                get: () => {
                    let result = getter.call(xhr);
                    if (!baseUrl || window.location.href.indexOf(hostUrl) === -1) {
                        element = ''
                        return result
                    }
                    try {
                        if (url.indexOf(baseUrl) !== -1 && title && (title === '大市场' || $('.warehouse')[0].textContent.indexOf(title) !== -1)) {
                            if (!element) {
                                createElement()
                            }
                            // 开始同步存入全局数据中
                            if (startState) {
                                getSyncData(JSON.parse(result))
                                // 拦截下载excel文件
                                if (title === '大市场') {
                                    if (downloadOk) {
                                        // 下载二进制流文件
                                        GM_xmlhttpRequest({
                                            url: downloadUrl, // url为请求接口连接
                                            method: 'get', headers: {
                                                'Accept': 'application/json',
                                            }, responseType: 'blob', // 与上一行一样，'blob'或者'arraybuffer'两个值都可以,二选一
                                            onload: function (res) {
                                                if (isDscNew) { // 新大市场同步
                                                    var startTime = document.getElementsByClassName("el-range-input")[0].value
                                                    var endTime = document.getElementsByClassName("el-range-input")[1].value
                                                    let fornData = new FormData();
                                                    fornData.append('file', res.response);
                                                    fornData.append('start_datetime', startTime);
                                                    fornData.append('end_datetime', endTime);
                                                    GM_xmlhttpRequest({
                                                        url: 'http://10.3.149.117:8009/api/api/approve/sync_new_dsc_data/',
                                                        method: 'post',
                                                        data: fornData, //直接把对象放在data后面
                                                        contentType: false,  //不需要指定如何编码格式，django会自动识别FormData对象
                                                        processData: false, //告诉你的浏览器不要对传过去的数据进行处理，保持原样
                                                        onload: function () {
                                                            startState = false
                                                            downloadOk = false
                                                            downloadUrl = ''
                                                            downloadFileTaskId = ''
                                                            createLoadingEle(true)
                                                            updateLoadingTitle()
                                                            alert("同步成功!")
                                                        }, onerror: function (err) {
                                                            console.log('err', err)
                                                            alert("同步失败!", err)
                                                            startState = false
                                                            downloadOk = false
                                                            downloadUrl = ''
                                                            downloadFileTaskId = ''
                                                            createLoadingEle(true)
                                                            updateLoadingTitle()
                                                        }
                                                    })
                                                    return
                                                }
                                                // 发送请求到后端
                                                let fornData = new FormData();
                                                fornData.append('file', res.response);
                                                fornData.append('update_datetime', getUpdateDateAdd(update_time, 1));
                                                fornData.append('new_datetime', getUpdateDateAdd(getNowTime(), -120));
                                                GM_xmlhttpRequest({
                                                    url: postResponseUrl, method: 'post', data: fornData, //直接把对象放在data后面
                                                    contentType: false,  //不需要指定如何编码格式，django会自动识别FormData对象
                                                    processData: false, //告诉你的浏览器不要对传过去的数据进行处理，保持原样
                                                    onload: function () {
                                                        startState = false
                                                        downloadOk = false
                                                        downloadUrl = ''
                                                        downloadFileTaskId = ''
                                                        createLoadingEle(true)
                                                        updateLoadingTitle()
                                                        GM_setValue("KykfRkGetUpdateDate", "")
                                                        alert("同步成功!")
                                                    }, onerror: function (err) {
                                                        console.log(err)
                                                        alert("同步失败!", err)
                                                        startState = false
                                                        downloadOk = false
                                                        downloadUrl = ''
                                                        downloadFileTaskId = ''
                                                        createLoadingEle(true)
                                                        updateLoadingTitle()
                                                        GM_setValue("KykfRkGetUpdateDate", "")
                                                    }
                                                })
                                            }, onerror: function (response) {
                                                console.log("error", response)
                                                isDscNew = false
                                            }
                                        });
                                    }
                                }
                                // 进销存同步
                                else if (hostUrl === 'http://warehouse.westcoal.com.cn/reportForm/saleInventory/list') {
                                    if (currentPage < totalPages) {
                                        currentPage += 1
                                        updateLoadingTitle()
                                    } else {
                                        // 发送请求到后端
                                        putSyncData(dataAll).then(res => {
                                            startState = false
                                            createLoadingEle(true)
                                            updateLoadingTitle()
                                            alert("同步成功!", res)
                                        }).catch(err => {
                                            alert("同步失败!", err)
                                            startState = false
                                            createLoadingEle(true)
                                            updateLoadingTitle()

                                        })
                                    }

                                }
                                // 库存同步
                                else if (hostUrl === 'http://warehouse.westcoal.com.cn/warehouseMaterial/stock/list') {
                                    if (currentPage < totalPages) {
                                        currentPage += 1
                                        updateLoadingTitle()
                                    } else {
                                        // 发送请求到后端
                                        putSyncData(dataAll).then(res => {
                                            startState = false
                                            createLoadingEle(true)
                                            updateLoadingTitle()
                                            alert("同步成功!", res)
                                        }).catch(err => {
                                            alert("同步失败!", err)
                                            startState = false
                                            createLoadingEle(true)
                                            updateLoadingTitle()

                                        })
                                    }

                                }
                                // 同步退库问题
                                else if (hostUrl === 'http://warehouse.westcoal.com.cn/reportForm/backStock/list') {
                                    if (currentPage < totalPages && !$('button[class="btn-next"]').disabled) {
                                        currentPage += 1
                                        setTimeout(() => {
                                            updateLoadingTitle()
                                            // 模拟点击分页
                                            $('button[class="btn-next"]').click()
                                        }, frequency);
                                    } else {
                                        var setIntervalObj = setInterval(function () {
                                            if (dataAll.length >= pageCount) {
                                                putSyncData(dataAll).then(res => {
                                                    clearInterval(setIntervalObj)
                                                    let type = ''
                                                    if ($('.warehouse')[0].textContent.indexOf('区队库房') !== -1) {
                                                        type = 'qd'
                                                    } else if ($('.warehouse')[0].textContent.indexOf('矿业库房') !== -1) {
                                                        type = 'ky'
                                                    } else if ($('.warehouse')[0].textContent.indexOf('煤业物资榆通红柳林供应站工厂') !== -1) {
                                                        type = 'mywz'
                                                    } else if ($('.warehouse')[0].textContent.indexOf('供应站工厂') !== -1) {
                                                        type = 'qyz'
                                                    }
                                                    // 获取有个多条退库对应一个出库的数据内容
                                                    get2DeliveryOrderNo(type)
                                                    var setIntervalObj1 = setInterval(function () {
                                                        if (isGet2DeliveryOrderNo) {
                                                            startState = false
                                                            createLoadingEle(true)
                                                            updateLoadingTitle()
                                                            clearInterval(setIntervalObj1)
                                                            alert("同步成功!")
                                                        }
                                                    }, 1000);
                                                }).catch(err => {
                                                    clearInterval(setIntervalObj)
                                                    startState = false
                                                    createLoadingEle(true)
                                                    updateLoadingTitle()
                                                    alert("同步失败!", err)
                                                })
                                            }
                                        }, 1000);
                                    }
                                }
                                // 判断总页数是否等于当前页
                                else if (currentPage < totalPages && !$('button[class="btn-next"]').disabled) {
                                    currentPage += 1
                                    setTimeout(() => {
                                        updateLoadingTitle()
                                        // 模拟点击分页
                                        $('button[class="btn-next"]').click()
                                    }, frequency);
                                } else {
                                    updateLoadingTitle()

                                    // 发送请求到后端
                                    putSyncData(dataAll).then(res => {
                                        // 获取有个多条退库对应一个出库的数据内容
                                        startState = false
                                        createLoadingEle(true)
                                        updateLoadingTitle()
                                        GM_setValue("KykfRkGetUpdateDate", "")
                                        // 同步物料编码
                                        if (materialInfo.length > 0) {
                                            GM_xmlhttpRequest({
                                                method: "post",
                                                url: materialDomain + '/api/api/approve/material/batch_update/',
                                                data: JSON.stringify({data: materialInfo}),
                                                headers: {
                                                    "Content-Type": "application/json"
                                                }
                                            })
                                        }
                                        alert("同步成功!", res)

                                    }).catch(err => {
                                        alert("同步失败!", err)
                                        startState = false
                                        createLoadingEle(true)
                                        updateLoadingTitle()

                                    })
                                }
                            }
                        }
                        return result;
                    } catch (e) {
                        return result;
                    }
                },
            }
        )
        ;
        // 如果路由不一致，表示切换路由，则重新初始化
        if (!hostUrl || window.location.href.indexOf(hostUrl) === -1) {
            initType()
            element = ""
            data = ""
            if (window.location.href.split('?')[0] === 'http://warehouse.westcoal.com.cn/reportForm/backStock/list' && $('.warehouse')[0].textContent.indexOf('区队库房') !== -1) {
                data = typeDict['http://warehouse.westcoal.com.cn/reportForm/backStock/lis']
            } else if (window.location.href.split('?')[0] === 'http://warehouse.westcoal.com.cn/reportForm/backStock/list' && $('.warehouse')[0].textContent.indexOf('煤业物资榆通红柳林供应站工厂') !== -1) {
                data = typeDict['http://warehouse.westcoal.com.cn/reportForm/backStock/l']
            } else if (window.location.href.split('?')[0] === 'http://warehouse.westcoal.com.cn/reportForm/backStock/list' && $('.warehouse')[0].textContent.indexOf('供应站工厂') !== -1) {
                data = typeDict['http://warehouse.westcoal.com.cn/reportForm/backStock/li']
            } else {
                data = typeDict[window.location.href.split('?')[0]]
            }
            if (data) {
                title = data.title
                hostUrl = data.hostUrl
                domain = data.domain
                baseUrl = data.baseUrl // 云仓项目url
                getUpdateDateUrl = data.getUpdateDateUrl
                getSyncData = data.getSyncData
                params = data.params
            }
        }
        // 大市场同步
        if (url.indexOf(baseUrl + 'excel/') !== -1 && hostUrl && window.location.href.indexOf(hostUrl) !== -1 && title === '大市场') {
            if (startState && dateStr || (startState && isDscNew)) {
                if (!downloadFileTaskId) {
                    if (isDscNew) {
                        const startTime = document.getElementsByClassName("el-range-input")[0].value
                        const endTime = document.getElementsByClassName("el-range-input")[1].value
                        url = baseUrl + "excel/?delivery=true&dateBegin=" + startTime + "&dateEnd=" + endTime
                    } else {
                        url = baseUrl + "excel/?" + params()
                    }
                } else {
                    url = baseUrl + "excel/" + downloadFileTaskId
                }
            }
        }
        // 请求拦截
        else if (url.indexOf(baseUrl) !== -1 && hostUrl && window.location.href.indexOf(hostUrl) !== -1 && title && (title === '大市场' || $('.warehouse')[0].textContent.indexOf(title) !== -1)) {
            // 如果开始同步，并且同步时间获取到，则说明是自动化同步，进行url 参数修改
            if (startState && dateStr) {
                if (hostUrl === 'http://warehouse.westcoal.com.cn/warehouseMaterial/stock/list') {
                    url = baseUrl + (baseUrl.endsWith('?') ? 'page=' : "?page=") + currentPage + "&perPage=500" + '&' + params()
                } else if (hostUrl === 'http://warehouse.westcoal.com.cn/reportForm/backStock/list') {
                    url = baseUrl + (baseUrl.endsWith('?') ? 'page=' : "?page=") + currentPage + "&perPage=500" + '&' + params()
                } else if (hostUrl === 'http://warehouse.westcoal.com.cn/reportForm/saleInventory/list') {
                    // url = url
                } else {
                    url = baseUrl + (baseUrl.endsWith('?') ? 'page=' : "?page=") + currentPage + "&perPage=20" + '&' + params()
                }
            }
        }
        originOpen.apply(this, arguments);
    };

}

/**
 * 获取Cookie值
 * @returns {string}
 */
function getCookie(objname) {//获取指定名称的cookie的值
    var arrstr = document.cookie.split("; ");
    for (var i = 0; i < arrstr.length; i++) {
        var temp = arrstr[i].split("=");
        if (temp[0] === objname) return unescape(temp[1]);
    }
}


(function () {
    'use strict';
    run()
    // Your code here...
})();
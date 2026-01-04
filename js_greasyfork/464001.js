// ==UserScript==
// @name         易仓订单推荐发货
// @namespace    http://maxpeedingrods.cn/
// @version      2.1.0
// @description  根据订单号获取推荐的发货仓库和运输方式
// @author       knight
// @license      No License
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/464001/%E6%98%93%E4%BB%93%E8%AE%A2%E5%8D%95%E6%8E%A8%E8%8D%90%E5%8F%91%E8%B4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/464001/%E6%98%93%E4%BB%93%E8%AE%A2%E5%8D%95%E6%8E%A8%E8%8D%90%E5%8F%91%E8%B4%A7.meta.js
// ==/UserScript==


let warehouseJson = {
	"China-102":4,
	"FBA-AMUS":15,
	"MS-ZY-USEA":22,
	"MS-ZY-USWE":23,
	"GR-winit-DE":24,
	"GR-winit-UKGF":34,
	"China-104":37,
	"China-105":38,
	"LWP-winit-USWC":42,
	"LWP-winit-USKY3":43,
	"LWP-winit-DE":44,
	"LWP-winit-AU":45,
	"MS-ZY-CZ":46,
	"China-102配件":54,
	"LWP-winit-AUME":55,
	"TH":56,
	"入库中转仓-105":60,
	"TH-office":61,
	"China-014":64,
	"出库中转仓-102":65,
	"出库中转仓-105":66,
	"MS-ZY-AU":67,
	"China-112":70,
	"故障成品仓":71,
	"MS-ZY-FR":74,
	"China-102-27":76,
	"5379-UK":79,
	"入库中转仓-102":124,
	"入库中转仓-112":125,
	"出库中转仓-112":126,
	"OC-DE":137,
	"China-105-SH":141,
	"China-QC012":157,
	"FBA-YYUS":177,
	"MS-ZY-ES":179,
	"MS-ZY-IT":180,
	"FBC-PAMCD":183,
	"RS-PL":187,
	"FBA-AMCA":188,
	"OC-UK":192,
	"China-112-27":193,
	"China-112-SH":194,
	"WFS-WLMUS":195,
	"YDY-CA05":197,
	"MCD-TCMML-MX":198,
	"FBA-AMMX":199,
	"MS-ZY-USSC":204,
	"DJ-USTX":205,
	"DJ-USNJ":207,
	"US Office":208,
	"WFS-WLMCA":209,
	"MS-ZY-JP":210,
	"OC-AU01":213,
	"MS-ZY-DE":214,
	"MS-ZY-CA":215,
	"FBA-ZYEU":216,
	"102现场仓":217,
	"FBA-ZYUK":218,
	"FBA-FZUS":219,
	"FBK-REALA-DE":220,
	"DE-XNC":221,
	"China-102-SH":224,
	"ZZ-ZB-US":225,
	"QH-MF-FR":226,
	"DE-YLC":229,
	"ZZ-DR-UK":231,
	"ZZ-QAN-DE":232,
	"EMAG-MXFBE-RO":233,
	"FBA-QYUS":234,
	"CHINA-102-MXRTT":246,
	"样品仓-102":247,
	"样品仓-014":248,
	"样品仓-112":249,
	"样品仓-105":250,
	"拍摄仓":251,
	"ZZ-DPS-DE":252,
	"112现场仓":255,
	"AE-ES-RE100":256,
	"China-021":257,
	"FX-YOSA-US":258,
	"OZON-UNI-DG":261,
	"China-011":262,
	"China-016":263,
	"FBA-AMAU":265,
	"OZON-RU-IML":266,
	"ZZ-SPT-USWE":272,
	"CS-JZ-USFL":274,
	"WFS-WLMRP-US":275,
	"WFS-WLMRH-CA":276,
	"China-102-YT":280,
	"China-112-YT":281,
	"China-105-YT":282,
	"CS-QXB-MX":283,
	"FBC-MAXCD":284,
	"MS-ZY-USCE":285,
	"GR-WINIT-UKTW":286,
	"GR-WINIT-DEBR2":287,
	"MS-ZY-USTX":288
}

function start() {
	
	// 检查是否已经注册过
    if (!GM_getValue('omenuCommandRegistered', false)) {
         GM_registerMenuCommand("获取订单推荐", orderRecommendSend);

        // 标记为已注册
        GM_setValue('omenuCommandRegistered', true);
    }

    // 在页面卸载时清除标记
    window.addEventListener('beforeunload', () => {
        GM_setValue('omenuCommandRegistered', false);
    });
}

/**
 * 订单推荐发货
 */
function orderRecommendSend() {
    openPage();
}

/**
 * 提示消息
 * @param message
 */
function setTips(message) {
    let info = '<span style="color:red">' + message + '</span>';

    let iframe = document.getElementById('order_recommend');

    iframe.contentWindow.document.getElementById('recommend_result_id_tips').innerHTML = info;
}

/**
 * 推荐结果
 * @param message
 */
function setRecommendResult(html) {
    let iframe = document.getElementById('order_recommend');
    iframe.contentWindow.document.getElementById('recommend_result_id_result').innerHTML = html;
}

/**
 * 打开页面
 */
function openPage() {
    let tipsId = 'recommend_result_id_tips';

    GM_config.init(
        {
            'id': 'order_recommend',
            'title': '易仓订单推荐发货',
            'css': '#order_recommend_buttons_holder{position: fixed;right: 0;top: 0;}',
            'fields':
            {
                'eccang_order_id': {
                    'label': '易仓订单号',
                    'type': 'text',
                    'size': 100,
                    'default': ''
                },
                'warehouse_select': {
                    'label': '推荐仓库',
                    'type': 'radio',
                    'options': ['仅国内仓', '仅海外仓', '国内仓+海外仓', '运费查询'],
                    'default': ['仅国内仓']
                },
                'ship_warehouse_select': {
                    'label': '选择仓库（仅选择【运费查询】时有效）',
                    'type': 'select',
                    'options': Object.keys(warehouseJson)
                },
                'recommend_result_id': {
                    'label': '推荐结果',
                    'type': 'recommendResult',
                    'default': ''
                },
            },
            'events': {
                'save': function () {
                    let orderId = GM_config.get('eccang_order_id');
                    let warehouseName = GM_config.get('ship_warehouse_select');
                    let warehouseId = warehouseJson[warehouseName]
                    let warehouse_select = GM_config.get('warehouse_select');
                    if (orderId && orderId.trim() != '') {
                        orderId = orderId.trim();
                        if (warehouse_select == '运费查询') {
                            getOrderShippingCost(orderId,warehouseId);
                        }
                        else {
                            getOrderRecommend(orderId);
                        }
                    } else {
                        setTips("请先填写易仓订单号！");
                    }
                },
                'init': function () {
                    GM_config.set('eccang_order_id', '');
                    GM_config.set('warehouse_select', '仅国内仓');
                }
            },
            'types': {
                'recommendResult': {
                    'default': null,
                    toNode: function () {
                        var field = this.settings,
                            value = this.value,
                            id = this.id,
                            create = this.create,
                            slash = null,
                            retNode = create('div', {
                                className: 'gg_recommend_result',
                                id: id + '_div',
                                title: field.title || ''
                            });


                        // Create the field lable
                        retNode.appendChild(create('label', {
                            innerHTML: field.label,
                            id: id + '_field_label',
                            className: 'field_label'
                        }));

                        retNode.appendChild(create('div', {
                            id: id + '_tips',
                        }));

                        retNode.appendChild(create('div', {
                            id: id + '_result',
                        }));


                        return retNode;
                    },
                    toValue: function () {
                        return '';
                    },
                    reset: function () {
                    }
                }
            }
        });
    GM_config.open();
}

/**
 * 对比排序
 * @param property
 * @returns {function(*, *): number}
 */
function compare(property) {
    return function (obj1, obj2) {
        var value1 = obj1[property];
        var value2 = obj2[property];
        return value2 > value1 ? -1 : value2 < value1 ? 1 : 0;
    }
}

/**
 * 展示推荐结果
 * @param response
 */
function renderRecommendResult(response) {
    if (response.status != 200) {
        setTips(response.message);
        return false;
    }

    try {
        let obj = JSON.parse(response.responseText);

        //执行失败
        if (obj.code != 200 || !obj.result) {
            setTips(obj.message);
            return false;
        }

        let result = obj.result;


        //执行成功
        let successhtml = '<table border="1" cellspacing="0" cellpadding="0" align="center"><tr style="text-align: center"><td>优先级</td><td>仓库</td><td>运输方式</td><td>易仓运输方式</td><td>偏远</td><td>头程(￥)</td><td>尾程(￥)</td><td>仓租（￥）</td><td>合计（￥）</td></tr>';
        setTips('');

        if (result.deliverableSchemes) {
            let deliverableSchemes = result.deliverableSchemes;
            //按权重排序
            deliverableSchemes.sort(compare('weight'));

            for (let i = 0; i < deliverableSchemes.length; i++) {
                let stringInfo = JSON.stringify(deliverableSchemes[i]);
                let isFaraway = stringInfo.indexOf('偏远') >= 0 ? '是' : '否';

                successhtml += "<tr style='text-align: center'>";
                successhtml += "<td>" + (i + 1) + "</td>";
                successhtml += "<td style='padding: 5px'>" + deliverableSchemes[i].warehouse_name + "</td>";
                successhtml += "<td style='padding: 5px'>" + deliverableSchemes[i].shipping_fee.shipping_method.name + "</td>";
				successhtml += "<td style='padding: 5px'>" + deliverableSchemes[i].shipping_fee.shipping_method.ecShippingMethod + "</td>";
                successhtml += "<td>" + isFaraway + "</td>";
                successhtml += "<td>" + (parseFloat(deliverableSchemes[i].shipping_fee.fee1_cny)).toFixed(2) + "</td>";
                successhtml += "<td>" + (parseFloat(deliverableSchemes[i].shipping_fee.fee2_cny)).toFixed(2) + "</td>";
                successhtml += "<td>" + (parseFloat(deliverableSchemes[i].warehouse_rent.warehouse_rent_cny)).toFixed(2) + "</td>";
                successhtml += "<td>" + (parseFloat(deliverableSchemes[i].shipping_fee.fee1_cny) + parseFloat(deliverableSchemes[i].shipping_fee.fee2_cny) + parseFloat(deliverableSchemes[i].warehouse_rent.warehouse_rent_cny)).toFixed(2) + "</td>";
                successhtml += "</tr>";
            }
        }

        successhtml += '</table>';

        //执行失败
        let failHtml = '<table border="1" cellspacing="0" cellpadding="0" align="center" style="margin-top: 10px"><tr style="text-align: center"><td>序号</td><td>仓库</td><td>失败原因</td></tr>';
        if (result.deliverableSchemes) {
            let failedSchemes = result.failedSchemes;

            for (let i = 0; i < failedSchemes.length; i++) {
                failHtml += "<tr style='text-align: center'>";
                failHtml += "<td>" + (i + 1) + "</td>";
                failHtml += "<td style='padding: 5px'>" + failedSchemes[i].warehouse_name + "</td>";
                failHtml += "<td style='padding: 5px'>" + failedSchemes[i].failed_reason + "</td>";
                successhtml += "</tr>";
            }
        }
        failHtml += '</table>';

        setRecommendResult(successhtml + failHtml);

    } catch (e) {
        console.log(e);
        setTips('执行推荐异常：' + e.message);
    }
}

/**
 * 获取订单推荐发货信息
 * @param orderId
 */
function getOrderRecommend(orderId) {

    const myKeyValue = GM_getValue(myKey);
    if(!myKeyValue){
        setTips("请先登录crm系统");
        return
    }

    let warehouseSelect = GM_config.get('warehouse_select');

    let includeCnWarehouses = false;
    let onlyCnWarehouses = false;

    switch (warehouseSelect) {
        case '仅国内仓':
            includeCnWarehouses = true;
            onlyCnWarehouses = true;
            break;
        case '国内仓+海外仓':
            includeCnWarehouses = true;
            onlyCnWarehouses = false;
            break;
        case '仅海外仓':
        default:
            includeCnWarehouses = false;
            onlyCnWarehouses = false;
            break;
    }

    let url = "https://crm.maxpeedingrods.cn:8013/crm/order/getRecommendWarehouse?orderCode=" + orderId + "&includeCnWarehouses=" + includeCnWarehouses + "&onlyCnWarehouses=" + onlyCnWarehouses;
    let timeout = 300 * 1000;

    setRecommendResult('');
    startTimer();

    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        timeout: timeout,
        headers: {"X-Access-Token": JSON.parse(myKeyValue).value},
        onload: function (response) {
            stopTimer();
            renderRecommendResult(response);
        },
        onerror: function (e) {
            console.log(e);
            stopTimer();
            setTips('获取推荐失败：' + e.message);
        },
        ontimeout: function () {
            stopTimer();
            setTips("获取订单推荐发货信息超时");
        }
    });
}



/**
 * 展示运费结果
 * @param response
 */
function renderShippingCostResult(response) {
    try {
        let obj = JSON.parse(response.responseText);
        
         //执行失败
         if (obj.code != 0 || !obj.result) {
            setTips(obj.message);
            return false;
        }
        
        let result = obj.result;

        //执行成功
        setTips('');
        let successhtml = '<table border="1" cellspacing="0" cellpadding="0" align="center"><tr style="text-align: center"><td>序号</td><td>SKU</td><td>数量</td><td>特殊属性</td></tr>';
        if (result?.skuData.length > 0) {
            let data = result.skuData
            for (let i = 0; i < data.length; i++) {
                successhtml += "<tr style='text-align: center'>";
                successhtml += "<td>" + (i + 1) + "</td>";
                successhtml += "<td>" + data[i].sku + "</td>";
                successhtml += "<td>" + data[i].quantity + "</td>";
                successhtml += "<td>" + data[i].special+ "</td>";
                successhtml += "</tr>";
            }
        }
        successhtml += '</table><br>';

        successhtml = successhtml + '<table border="1" cellspacing="0" cellpadding="0" align="center"><tr style="text-align: center"><td>序号</td><td>承运商</td><td>运输方式</td><td>易仓运输方式</td><td>是否偏远</td><td>是否推荐</td><td>头程运费（￥）</td><td>二程运费（￥）</td><td>总运费（￥）</td><td>总运费当地币种</td><td>总运费（当地）</td></tr>';
        if (result?.shippingData.length > 0) {
            let data = result.shippingData
            for (let i = 0; i < data.length; i++) {
                successhtml += "<tr style='text-align: center'>";
                successhtml += "<td>" + (i + 1) + "</td>";
                successhtml += "<td>" + data[i].supplier_name + "</td>";
                successhtml += "<td>" + data[i].delivery_name + "</td>";
				successhtml += "<td>" + data[i].ecShippingMethod + "</td>";
                successhtml += "<td>" + (data[i].is_remote_area === 0 ? '否' : '是') + "</td>";
                successhtml += "<td>" + (data[i].recommend === 0 ? '不推荐' : '推荐') + "</td>";
                successhtml += "<td>" + data[i].first_hand_fee + "</td>";
                successhtml += "<td>" + data[i].second_hand_fee + "</td>";
                successhtml += "<td>" + data[i].total_fee + "</td>";
                successhtml += "<td>" + data[i].orderCurrency + "</td>";
                successhtml += "<td>" + data[i].cost[data[i].orderCurrency] + "</td>";
                successhtml += "</tr>";
            }
        }
        successhtml += '</table><br>';

        //执行失败
        let failHtml = '<table border="1" cellspacing="0" cellpadding="0" align="center" style="margin-top: 10px"><tr style="text-align: center"><td>序号</td><td>运输方式code</td><td>失败消息</td></tr>';
        if (result?.failures.length > 0) {
            let data = result.failures;

            for (let i = 0; i < data.length; i++) {
                failHtml += "<tr style='text-align: center'>";
                failHtml += "<td>" + (i + 1) + "</td>";
                failHtml += "<td style='padding: 5px'>" + data[i].method_code + "</td>";
                failHtml += "<td style='padding: 5px'>" + data[i].msg + "</td>";
                successhtml += "</tr>";
            }
        }
        failHtml += '</table><br>';

        setRecommendResult(successhtml + failHtml);

    } catch (e) {
        console.log(e);
        setTips('执行运费异常：' + e.message);
    }
}




/**
 * 获取订单运费信息
 * @param orderId
 */
function getOrderShippingCost(orderId,warehouseId) {
    const myKeyValue = GM_getValue(myKey);
    if(!myKeyValue){
        setTips("请先登录crm系统");
        return
    }
    
    let url = "https://crm.maxpeedingrods.cn:8013/crm/order/getShippingCost?orderId=" + orderId + "&warehouseId="+ warehouseId;
    let timeout = 300 * 1000;

    setRecommendResult('');
    startTimer();


    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        timeout: timeout,
        headers: {"X-Access-Token": JSON.parse(myKeyValue).value},
        onload: function (response) {
            stopTimer();
            renderShippingCostResult(response);
        },
        onerror: function (e) {
            console.log(e);
            stopTimer();
            setTips('获取订单运费信息失败：' + e.message);
        },
        ontimeout: function () {
            stopTimer();
            setTips("获取订单运费信息超时");
        }
    });
}




/**
 * 停止计时器
 */
function stopTimer() {
    seconds = 0;
    clearInterval(timer);
}

/**
 * 开始计时器
 */
function startTimer() {
    timer = setInterval(function () {
        ++seconds;
        setTips("开始获取推荐信息,限时5分钟...." + seconds);
    }, 1000);
}

//计时器
let timer = null;
let seconds = 0;

const myKey = 'pro__Access-Token';

(function () {
    'use strict';
    // 读取 localStorage 数据
    const myValue = localStorage.getItem(myKey);
     // 获取当前域
    const currentDomain = window.location.origin;
   
    if (myValue && currentDomain=="https://crm.maxpeedingrods.cn") {
        // 存储数据到 Tampermonkey 的存储中
        GM_setValue(myKey, myValue);
        console.log(`Stored ${myKey}: ${myValue} in Tampermonkey storage`);
    }

    start();
})();

// ==UserScript==
// @name    FundNetValueReminder
// @description  基金净值提示
// @version  4.20190311
// @namespace net.jacky-q.userscript
// @grant    GM_xmlhttpRequest
// @grant    GM_setValue
// @grant    GM_getValue
// @require    https://code.jquery.com/jquery-1.12.4.min.js
// @include http://www.1234567.com.cn/
// @downloadURL https://update.greasyfork.org/scripts/370258/FundNetValueReminder.user.js
// @updateURL https://update.greasyfork.org/scripts/370258/FundNetValueReminder.meta.js
// ==/UserScript==

var MONITOR_LOCATION = "http://fund.eastmoney.com/f10/jjjz_%fund_code%.html";
var MONITOR_INTERVAL = 30 * 1000;
var slowEList = [
{fund_code: '000051',fund_name :'沪深300         ',net_value:0.9752     ,monitor_flag:true,has_alerted:false},
{fund_code: '000478',fund_name :'建信500         ',net_value:2.369644444,monitor_flag:true,has_alerted:false},
{fund_code: '000968',fund_name :'养老产业        ',net_value:0.81128    ,monitor_flag:true,has_alerted:false},
{fund_code: '001051',fund_name :'上证50          ',net_value:0.713775   ,monitor_flag:true,has_alerted:false},
{fund_code: '001052',fund_name :'中证500         ',net_value:0.5201     ,monitor_flag:true,has_alerted:false},
{fund_code: '001180',fund_name :'全指医药        ',net_value:0.777811111,monitor_flag:true,has_alerted:false},
{fund_code: '001469',fund_name :'全指金融        ',net_value:0.9534     ,monitor_flag:true,has_alerted:false},
{fund_code: '003765',fund_name :'广发创业板      ',net_value:0.8037     ,monitor_flag:true,has_alerted:false},
{fund_code: '004752',fund_name :'中证传媒        ',net_value:0.8646     ,monitor_flag:true,has_alerted:false},
{fund_code: '100032',fund_name :'中证红利        ',net_value:0.939130769,monitor_flag:true,has_alerted:false},
{fund_code: '100038',fund_name :'富国300         ',net_value:1.48285    ,monitor_flag:true,has_alerted:false},
{fund_code: '110022',fund_name :'易方达消费行业  ',net_value:1.7156     ,monitor_flag:true,has_alerted:false},
{fund_code: '110026',fund_name :'易方达创业板    ',net_value:1.5638     ,monitor_flag:true,has_alerted:false},
{fund_code: '502010',fund_name :'证券公司        ',net_value:0.8685     ,monitor_flag:true,has_alerted:false},
{fund_code: '164906',fund_name :'中国海外互联    ',net_value:1.2197     ,monitor_flag:true,has_alerted:false},
{fund_code: '000071',fund_name :'恒生指数        ',net_value:1.044      ,monitor_flag:true,has_alerted:false},
{fund_code: '003376',fund_name :'7-10国开债      ',net_value:0.9419     ,monitor_flag:true,has_alerted:false},
{fund_code: '050027',fund_name :'博时信用债      ',net_value:1.0071     ,monitor_flag:true,has_alerted:false},
{fund_code: '110027',fund_name :'易方达安心回报债',net_value:1.5552     ,monitor_flag:true,has_alerted:false},
{fund_code: '270048',fund_name :'广发纯债        ',net_value:1.1317     ,monitor_flag:true,has_alerted:false},
{fund_code: '340001',fund_name :'兴全转债        ',net_value:0.999      ,monitor_flag:true,has_alerted:false},
{fund_code: '519977',fund_name :'长信可转债      ',net_value:1.2011     ,monitor_flag:true,has_alerted:false},
{fund_code: '160416',fund_name :'石油基金        ',net_value:0.7679     ,monitor_flag:true,has_alerted:false},
{fund_code: '000614',fund_name :'德国DAX         ',net_value:1.03135    ,monitor_flag:true,has_alerted:false}
];
var zoneList = [{
    fund_code : "110026",
    fund_name : "易方达创业板ETF联接A",
    net_value : 1.3207,
    monitor_flag : true,
    direction : 'B',
    has_alerted : false
},{
    fund_code : "004752",
    fund_name : "广发中证传媒ETF连接A",
    net_value : 0.6766,
    monitor_flag : true,
    direction : 'B',
    has_alerted : false
}];
var drawdownList = [{

}];
var MONITOR_STRATEGY = {
    SLOW_E :{
        list : slowEList,
        monitorExpress : function (curNetValue, monitorNetValue) {
            return (curNetValue - monitorNetValue) / monitorNetValue <= 0.0;
        },
        giveUpExpress : function (curNetValue,monitorNetValue) {
            return (curNetValue - monitorNetValue)/monitorNetValue > 0.05;
        }
    } ,
    ZONE_FLOW : {
        list : zoneList,
        monitorExpress : function (curNetValue, monitorNetValue,item) {
            return item.direction === 'B' ? curNetValue < monitorNetValue : curNetValue > monitorNetValue;
        },
        giveUpExpress : function (curNetValue,monitorNetValue,item) {
            return item.direction === 'B' ? curFundNet * 0.94 > monitorNetValue : curFundNet < monitorNetValue * 0.94 ;
        }
    },
    DRAW_DOWN : {
        list : drawdownList,
        monitorExpress : function (curNetValue,null_,item){
            var monitorNetValue = GM_getValue('MAXNAV_' + itme.fund_code);
            if (monitorNetValue == null) {
                return false;
            } else {
                if (curNetValue / 1 >= monitorNetValue / 1) {
                    GM_setValue('MAXNAV_' + item.fund_code, curNetValue);
                } else if (monitorNetValue * 0.85 <= curNetValue) {
                    return true;
                }
            }
            return false;
        }
    }
};
var curStrategy = MONITOR_STRATEGY.SLOW_E;

// the guts of this userscript
function main() {
    // console.log(typeof $.ajax);
    setInterval(function () {
        var fundList = loadMonitorItem();
        console.log("当前监控基金数:" +  fundList.length);
        for (var i = 0; i < fundList.length; i++) {
            var d = showAlert(fundList[i]);
            loadNetValue(fundList[i], d);
        }
    }, MONITOR_INTERVAL);


}

function showAlert(item) {
    return function (/*curFundNet*/) {
        // console.log("get data:"+item.fund_name);
        var curFundNet = arguments.length > 0 ? arguments[0] : 10000;
        // console.log(item.fund_name + " net value2 :" + curFundNet);
        // console.log("get diff:" + (curFundNet - item['net_value']) / item['net_value'] );
        if ( curStrategy.monitorExpress(curFundNet,item['net_value'],item.direction)) {
            var tipText = ("!\r\n" + item['fund_name'] + '的净值达到' + curFundNet + ",逼近监视阈值" + item['net_value'] + "\r\n!");
            var subffix = '!!!!!!!!!!!!!!!!!!!!!!!!!!';
            console.log( subffix +  tipText + subffix);
            if(!item.has_alerted){
                alert(tipText);
                updateAlertTip(item);
            }
            //  alert(item['fund_name'] + '的净值达到' + curFundNet + ",逼近监视阈值" + item['net_value'] + "!");
        } 
        if ( curStrategy.giveUpExpress(curFundNet,item['net_value'],item.direction)) {
            removeMonitor(item);
        }

    }
}

function removeMonitor(item) {
    for (var i = 0; i < curStrategy.list.length; i++) {
        if (item['fund_code'] === curStrategy.list[i].fund_code) {
            curStrategy.list[i].monitor_flag = false;
            console.log("移除监控基金:"+item.fund_name);
        }
    }
}
function updateAlertTip(item) {
    for (var i = 0; i < curStrategy.list.length; i++) {
        if (item['fund_code'] === curStrategy.list[i].fund_code) {
            curStrategy.list[i].has_alerted = true;
        }
    }
}

function loadMonitorItem() {
    var list = [];
    for (var i = 0; i < curStrategy.list.length; i++) {
        if(curStrategy.list[i].monitor_flag){
            list.push(curStrategy.list[i]);
        }
    }
    return list;
}

function loadNetValue(item, callback) {
    //console.log("开始获取估算净值" + item.fund_name);
    if(!item.monitor_flag){
        return;
    }
  // console.log(item.fund_name + "当前监控阈值:" + item.net_value);
    var url = MONITOR_LOCATION.replace("%fund_code%", item['fund_code']);
    url +="&tmp=" + new Date().getTime();
    //  console.log("url=" + url);

    $.ajax(url, {
        success: function (data, status, xhr) {
            var net = data.match(/lar bold guzhi">((\d|\.)+)<\/span>/);
          //     console.log(item.fund_name + "当前估值:" + net[1]);
            var fundNet = parseFloat(net[1]);
            //  console.log(item.fund_name + " net value1 :" + fundNet);
            callback(fundNet);
        },
        error: function () {
            console.log("error fetch:"  + item['fund_name']);
        }
    })
    //   var curFundNet = 2.530;
    //   callback.call(curFundNet);

}

// load jQuery and execute the main function
main();
//console.log('script loaded');

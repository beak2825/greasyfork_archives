// ==UserScript==
// @name         值班监控插件
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  A monitoring tool!
// @author       Guang Yang, guang.yang@shopee.com
// @run-at document-end
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @match        https://ops.ssc.shopeemobile.com/*
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/410210/%E5%80%BC%E7%8F%AD%E7%9B%91%E6%8E%A7%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/410210/%E5%80%BC%E7%8F%AD%E7%9B%91%E6%8E%A7%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
// cm 用来对应国家和请求的数字id
let cm = new Map([['ID','31'], ['MY','35'],['PH','34'],['SG','8'],['TH','33'],['TW','32'],['VN','36']]);
let cids = ['ID','MY','PH','SG','TH','TW','VN']
// cr 用来记录每个国家今天的Base Qty Recon 异常个数
var stack = [];
let crQtyWeek = new Map(); // 存储一周失败对账数量
let cr = new Map();
let cr2 = new Map();
let cr3 = new Map();
let requrl = 'https://ops.ssc.shopeemobile.com/api/isc/admin/accuracy_monitoring/base_qty_recon?date='
let requrlFlow = 'https://ops.ssc.shopeemobile.com/api/isc/admin/log_monitoring/failure_flow_monitoring'
//let requrl = 'https://ops.ssc.shopeemobile.com/api/isc/admin/accuracy_monitoring/base_qty_recon?date=1595692800,1598457599&exception_flag=1'
let exp = '&exception_flag=1';
var curCid;
var btn = document.createElement("button")
btn.innerHTML = "点击获取失败流水/对账"
btn.type = "submit";
btn.className = "ant-btn ant-btn-primary";
btn.onclick = () => {
    for(var i=0;i<cids.length;i++){
        for(var mode = 0;mode<3;mode++){
            stack.push({cid:cids[i],mode:mode});
        }
    }
    qtyWeekTxt.innerText = "正在努力拉取数据 - Fetching data, please wait";
    qtyDayTxt.innerText = "正在努力拉取数据 - Fetching data, please wait";
    qtyFailFlows.innerText = "正在努力拉取数据 - Fetching data, please wait";
    var idMenuItem = document.getElementsByClassName("sc-AxheI eXzlnr ant-dropdown-trigger sc-AxgMl cVmQYF");
    curCid = idMenuItem[1];
    curCid = curCid.innerText.split(" ")[1];
    getACountryInfo();
}
btn.style.alignContent = "center";

var qtyWeekTxt;
var qtyDayTxt;
var qtyFailFlows;
var panel = document.createElement('div');

// Switch back to the cid user was using in the first place.
function switchBackToOriginalCid(){
    const url='https://ops.ssc.shopeemobile.com/api/opa/switchEntity/' + cm.get(curCid);
    $.get( url, function( data ) {
        //GM_log("Switch back to: ", curCid);
    });
}

function getACountryInfo(){
    var dt = new Date();
    var dt2 = new Date();
    dt.setDate(dt.getDate() - 7);
    var oldDay = Math.floor(dt.getTime()/1000).toString();
    var today = Math.floor(dt2.getTime()/1000).toString();
    var dateStr = oldDay + ',' + today;
    //alert(urlTmp);
    if (stack.length) {
        var top = stack.pop();
        var id = top.cid;
        var mode = top.mode;
        var urlTmp;
        if (mode == 0){
            // No Abnormals
            urlTmp = requrl + dateStr;
        }else if (mode == 1){
            urlTmp = requrl + dateStr + exp;
        }else if (mode == 2){
            urlTmp = requrlFlow;
        }
        const url='https://ops.ssc.shopeemobile.com/api/opa/switchEntity/' + cm.get(id);
        //获取上周异常总数
        $.get( url, function( data ) {
            $.getJSON(urlTmp, function(data2) {
                var text = data2.data.list;
                var textLen = text == null ? 0:text.length
                GM_log(id, mode, text);
                if (mode == 0){
                    var dis = text == null ? 0 : text[0].discrepancies
                    cr2.set(id, dis);
                }else if (mode == 1){
                    cr.set(id, textLen);
                }else{
                    var len = text == null ? 0 : textLen;
                    cr3.set(id, len);
                }
                //alert(id + ":" + text.length);
                getACountryInfo();
            });
        });
    }
    else{
        // Finished fetching results
        displayRes();
        // Switch back to original cid
        switchBackToOriginalCid();
    }
}

function displayRes(){
    // Finished fetching results
    var res = "";
    for (let [key, value] of cr) {
        var str = key + " : " + value + " ";
        res += str;
    }
    qtyWeekTxt.innerText = res;
    res = "";
    for (let [key, value] of cr2) {
        str = key + " : " + value + " ";
        res += str;
    }
    qtyDayTxt.innerText = res;
    res = "";
    for (let [key, value] of cr3) {
        str = key + " : " + value + " ";
        res += str;
    }
    qtyFailFlows.innerText = res;
}


function startOfWeek(date)
{
    var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
}

$(document).ready(function() { //When document has loaded
    panel.innerHTML = '<!DOCTYPE html> \
<html lang="en"> \
<head> \
<title>Bootstrap Example</title> \
<meta charset="utf-8"> \
<meta name="viewport" content="width=device-width, initial-scale=1"> \
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"> \
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script> \
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script> \
</head> \
<body>\
\
<div class="container"> \
<div class="panel panel-danger"> \
<div class="panel-heading">基数对账昨日差异 - Base Qty Recon Discrepancies In A Day</div> \
<div id = "p1" class="panel-body">未获取</div> \
</div> \
<div class="panel panel-danger"> \
<div class="panel-heading">基数对账本周异常数量 - Base Qty Recon Abnormals In A Week</div> \
<div id = "p2" class="panel-body">未获取</div> \
</div> \
<div class="panel panel-danger"> \
<div class="panel-heading">失败流水数量 - Num of Faliure Flows</div> \
<div id = "p3" class="panel-body">未获取</div> \
</div> \
</div> \
</body> \
</html> \
';
    $('body').append(panel);
    document.getElementsByClassName('panel panel-danger')[0].before(btn);
    qtyWeekTxt = document.getElementById("p2");
    qtyDayTxt = document.getElementById("p1");
    qtyFailFlows = document.getElementById("p3");
});
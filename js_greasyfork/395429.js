// ==UserScript==
// @name         Colorful APM
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  In kibana 7.5's apm, all span's background color is the same blue.
// @author       gukz
// @match        https://kiblog.shanbay.com/app/apm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395429/Colorful%20APM.user.js
// @updateURL https://update.greasyfork.org/scripts/395429/Colorful%20APM.meta.js
// ==/UserScript==

// 脚本地址：https://greasyfork.org/zh-CN/scripts/395429-colorful-apm/code
// 颜色色值可以在这个函数里添加，优先匹配子类型，然后匹配类型。
function subtype2color(type, subtype) {
    var obj = {
        "mysql": "rgb(51, 161, 201)",
        "redis": "rgb(219, 19, 116)",
        "grpc": "rgb(34, 139, 34)",
        "http": "rgb(240, 230, 140)",
        "pug": "rgb(48, 128, 20)",
        "external": "black",
    }
    if (Boolean(subtype)) {
        subtype = subtype.toLowerCase()
        if (Boolean(obj[subtype])) {
            return obj[subtype]
        }
    }
    if (Boolean(type)) {
        type = type.toLowerCase()
        if (Boolean(obj[type])) {
            return obj[type]
        }
    }
}

(function() {
    'use strict'
    var currentURL = window.location.href
    var apmPattern = /app/
    if (
        apmPattern.test(currentURL)
    ) {
        setInterval(runner, 500)
    }
})();
var trace2result = {}

function runner() {
    var pt1 = /services/;
    var pt2 = /transactions/;
    var pt3 = /view/;
    var currentURL = window.location.href;
    if (!(pt1.test(currentURL) &&
        pt2.test(currentURL) &&
        pt3.test(currentURL)
    )){
        return
    }
    var traceId = getQuery("traceId")
    var traceName = getQuery("transactionName")
    if (!Boolean(traceId) || !Boolean(traceName)) {
        return
    }
    traceName = decodeURIComponent(traceName)
    if (Boolean(trace2result[traceId])) {
        replaceGantColor(traceName, trace2result[traceId])
    } else {
        // 当前页面为apm某个服务的详情页面
        var url = "/api/apm/traces/" + traceId + "?start=2020-01-16T08%3A11%3A07.028Z&end=2040-01-18T09%3A11%3A07.028Z"
        $.ajax({
            url: url,
            type: "GET",
            success: function(result) {
                trace2result[traceId] = result
                replaceGantColor(traceName, result)
                console.log(result)
           },
        })
    }
}

function replaceGantColor(traceName, result) {
    // 替换甘特图色块颜色
    var svg_tags = document.getElementsByClassName("rv-xy-plot__inner")
    var fatherTags = $("#react-apm-root > div > div > div.euiFlexGroup.euiFlexGroup--gutterLarge.euiFlexGroup--directionRow.euiFlexGroup--responsive > div.euiFlexItem.euiFlexItem--flexGrow7 > div:nth-child(7) > div:nth-child(6) > div.sc-cmTdod.cklMTT > div > div:nth-child(2)")
    var chil = fatherTags.children()
    var items = getSpansAndTrans(result)
    for(var i=0;i<items.length;i++){
        var item = items[i]
        if (Boolean(item.span)){
            var color = subtype2color(item.span.type, item.span.subtype)
            $($(chil[items.length - i-1]).children()[0]).css("background-color", color)
        }
    }
}
function getSpansAndTrans(result) {
    var items = result.trace.items
    items.sort(function(a, b){
        if (a.transaction.id === b.transaction.id) {
            return 0
        } else if (a.transaction.id > b.transaction.id) {
            return 1
        }else{
            return -1
        }})
    items.sort(function(a, b){return b.timestamp.us - a.timestamp.us})
    return items
}

function getQuery(name){
    var url = window.location.href
    var query = url.substr(url.indexOf("?"))
    var items = query.split("&")
    for(var i=0; i < items.length; i++){
        var item = items[i].split("=")
        if(item[0] == name){
            return item[1]
        }
    }
}
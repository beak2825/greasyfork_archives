// ==UserScript==
// @name         搜索参数显示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  显示搜索的参数
// @author       You
// @include      https://www.baidu.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481538/%E6%90%9C%E7%B4%A2%E5%8F%82%E6%95%B0%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/481538/%E6%90%9C%E7%B4%A2%E5%8F%82%E6%95%B0%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

alert("Hello world");

function urlArgs() {
    var query = window.location.search.substring(1);
    console.log(query);
    var spArray = query.split("&");
    var args = {};
    for (var i = 0; i < spArray.length; i++) {
        var flag = spArray[i].indexOf("=");
        var key = spArray[i].substring(0, flag);
        var value = spArray[i].substring(flag + 1);
        value = decodeURIComponent(value);
        args[key] = value;
    }
    return args;
}

var result = urlArgs();
for (var key in result) {
    console.log("键: "+key+" 值: "+result[key]);
}
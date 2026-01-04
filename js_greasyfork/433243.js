// ==UserScript==
// @name         BD影视更新页面高亮高分两个字
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  高亮高分两个字
// @author       You
// @match        https://www.bd2020.com/movies/*
// @icon         https://www.google.com/s2/favicons?domain=bd2020.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433243/BD%E5%BD%B1%E8%A7%86%E6%9B%B4%E6%96%B0%E9%A1%B5%E9%9D%A2%E9%AB%98%E4%BA%AE%E9%AB%98%E5%88%86%E4%B8%A4%E4%B8%AA%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/433243/BD%E5%BD%B1%E8%A7%86%E6%9B%B4%E6%96%B0%E9%A1%B5%E9%9D%A2%E9%AB%98%E4%BA%AE%E9%AB%98%E5%88%86%E4%B8%A4%E4%B8%AA%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here

    function getItems(context,xpath) {
        var itemList;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            var nsResolver = document.createNSResolver( context.ownerDocument == null ? context.documentElement : context.ownerDocument.documentElement );
            itemList = document.evaluate(xpath, context, nsResolver, XPathResult.ANY_TYPE,null);
        } else {
            itemList = context.selectNodes(xpath);
        }
        var names = []
        var item = itemList.iterateNext();
        while (item!=null) {
            names.push(item)
            item = itemList.iterateNext();
        }
        return names;
    }

    var values = getItems(document,"/html/body/div[3]/div/div[2]/div[2]/div[2]/div/ul/li/div/a");
    for (var i in values) {
        var item = values[i];
        //替换
        var res = item.innerHTML.replace("高分", "<span style=\"background-color:red;color:#fff;\">高分</span>");
        //显示结果
        item.innerHTML = res;
    }

})();
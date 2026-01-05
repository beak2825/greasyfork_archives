// ==UserScript==
// @name         京东热卖跳转
// @version      0.3
// @description  re.jd.com自动跳转item.jd.com
// @author       You
// @match        http://re.jd.com/*
// @match        https://re.jd.com/*
// @grant        none
// @run-at document-start
// @namespace https://greasyfork.org/users/49924
// @downloadURL https://update.greasyfork.org/scripts/20756/%E4%BA%AC%E4%B8%9C%E7%83%AD%E5%8D%96%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/20756/%E4%BA%AC%E4%B8%9C%E7%83%AD%E5%8D%96%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

var url = location.href;
var protocol = location.protocol;
if(url.indexOf("/item/") > 0) {
    var index1 = url.indexOf(".html");
    var index2 = url.lastIndexOf("/", index1);
    location.replace(protocol + "//item.jd.com" + url.substring(index2,index1) + ".html");
}


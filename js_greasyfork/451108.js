// ==UserScript==
// @name         xmwoj url转换
// @description  xmwoj 提交记录url转换
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       yizixun
// @match       *://oj.cqxiaomawang.com/submissions*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451108/xmwoj%20url%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/451108/xmwoj%20url%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var result = document.evaluate("//tr/td[3]/a", document, null, XPathResult.ANY_TYPE, null);
var lst=[];
var nodes = result.iterateNext(); //枚举第一个元素
while (nodes){

    //submission123
    lst[lst.length]=nodes;
    nodes=result.iterateNext(); //枚举下一个元素
}
//console.log(lst);
    var i;
for (i = 0; i < lst.length; i++) {
    var url=lst[i].getAttribute("href");
    url=url.replace(/submission123/g,"submission");
    lst[i].setAttribute("href",url);
    //console.log(url);
}

})();
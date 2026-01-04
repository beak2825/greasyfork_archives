// ==UserScript==
// @name         禁用动态脚本,专业人员使用
// @version      1.0.19
// @description  禁用动态脚本，监控xhr
// @author       hwx

// @match        *://*/*

// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @namespace    https://greasyfork.org/zh-CN/users/208142-iswfe
// @downloadURL https://update.greasyfork.org/scripts/480922/%E7%A6%81%E7%94%A8%E5%8A%A8%E6%80%81%E8%84%9A%E6%9C%AC%2C%E4%B8%93%E4%B8%9A%E4%BA%BA%E5%91%98%E4%BD%BF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/480922/%E7%A6%81%E7%94%A8%E5%8A%A8%E6%80%81%E8%84%9A%E6%9C%AC%2C%E4%B8%93%E4%B8%9A%E4%BA%BA%E5%91%98%E4%BD%BF%E7%94%A8.meta.js
// ==/UserScript==

HTMLElement.prototype.setAttribute_bak = HTMLElement.prototype.setAttribute;
Node.prototype.appendChild_bak = Node.prototype.appendChild;
Node.prototype.append_bak = Node.prototype.append;
HTMLElement.prototype.setAttribute = function (attr, value) {
    if (attr == "src")
        console.log(value);
    return this.setAttribute_bak(attr, value)
};
HTMLElement.prototype.appendChild = function (argu) {
    // body...  
    if (argu.constructor == HTMLScriptElement || argu.constructor == HTMLImageElement || argu.constructor == HTMLIFrameElement) {
        console.log("危险行为");
        console.log(argu);
        return argu;
    }
    this.appendChild_bak.apply(this, arguments);
    return argu;
};

HTMLElement.prototype.append = function (argu) {
    // body...  
    if (argu.constructor == HTMLScriptElement || argu.constructor == HTMLImageElement || argu.constructor == HTMLIFrameElement) {
        console.log("危险行为");
        console.log(argu);
        return argu;
    }
    this.append_bak.apply(this, arguments);
    return argu;
};
XMLHttpRequest.prototype.open_bak = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (m, url, bool) {
    console.log(url);
    // console.log(this);
    XMLHttpRequest.prototype.open_bak.apply(this, arguments)
};

XMLHttpRequest.prototype.send_bak = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function (url) {
    console.log(url);
    XMLHttpRequest.prototype.send_bak.apply(this, arguments)
};

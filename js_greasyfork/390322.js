// ==UserScript==
// @name         广州大学第二课堂系统弹出窗口兼容
// @namespace    https://greasyfork.org/zh-CN/users/220174-linepro
// @version      1.1
// @description  为广州大学第二课堂系统中使用的 showModalDialog 函数作兼容处理
// @author       LinePro
// @match        *://172.17.1.123/*
// @match        *://webvpn.gzhu.edu.cn/http/*/XS/XMSB.aspx
// @match        *://webvpn.gzhu.edu.cn/http/*/JWC/view.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390322/%E5%B9%BF%E5%B7%9E%E5%A4%A7%E5%AD%A6%E7%AC%AC%E4%BA%8C%E8%AF%BE%E5%A0%82%E7%B3%BB%E7%BB%9F%E5%BC%B9%E5%87%BA%E7%AA%97%E5%8F%A3%E5%85%BC%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/390322/%E5%B9%BF%E5%B7%9E%E5%A4%A7%E5%AD%A6%E7%AC%AC%E4%BA%8C%E8%AF%BE%E5%A0%82%E7%B3%BB%E7%BB%9F%E5%BC%B9%E5%87%BA%E7%AA%97%E5%8F%A3%E5%85%BC%E5%AE%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function getValue(str, key) {
        const index = str.indexOf(key);
        return str.slice(index + key.length + 1, str.indexOf(';', index));
    }
    window.showModalDialog = function (uri, _arguments, _options) {
        _options = _options.toLowerCase();
        let windowFeature = 'toolbar=no, menubar=no';
        const dialogWidth = getValue(_options, 'dialogwidth');
        const dialogHeight = getValue(_options, 'dialogheight');
        if (dialogWidth)
            windowFeature += ', width=' + dialogWidth;
        if (dialogHeight)
            windowFeature += ', height=' + dialogHeight;
        window.open(uri, "_blank", windowFeature);
    }
})();
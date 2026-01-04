// ==UserScript==
// @name         燕谷坊来店易API去除result后面的双引号
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  去除JSON字符串Result标签后的双引号包裹
// @author       djzhao
// @match        *://*.hulianjun.com/*
// @match        http://127.0.0.1/*
// @create       2019-05-31
// @grant        none
// @icon         https://avatars1.githubusercontent.com/u/10238070?s=460&v=4
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/384002/%E7%87%95%E8%B0%B7%E5%9D%8A%E6%9D%A5%E5%BA%97%E6%98%93API%E5%8E%BB%E9%99%A4result%E5%90%8E%E9%9D%A2%E7%9A%84%E5%8F%8C%E5%BC%95%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/384002/%E7%87%95%E8%B0%B7%E5%9D%8A%E6%9D%A5%E5%BA%97%E6%98%93API%E5%8E%BB%E9%99%A4result%E5%90%8E%E9%9D%A2%E7%9A%84%E5%8F%8C%E5%BC%95%E5%8F%B7.meta.js
// ==/UserScript==

(function() {// {"Code":"000","Message":"操作成功！","Result":{"promotionCount":1}}
    'use strict';
    var tag = document.getElementsByTagName('pre')[0];
    if (tag == null)
        return;
    var _html = tag.innerText;
    // 确定是JSON数据
    if (_html.lenght != 0 && _html.indexOf('{"Code":"') == 0) {
        // 去除 "
        _html = _html.replace('"Result":"{','"Result":{');
        // 去除 "
        _html = _html.replace(/}"}$/,'}}');
        // \" 转为 "
        _html = _html.replace(new RegExp('\\\\"',"gm"),'"');
        // 保留转移字符 \\ 转为 \
        _html = _html.replace(new RegExp('\\\\\\\\',"gm"),'\\');
    }
    tag.innerText = _html;
})();
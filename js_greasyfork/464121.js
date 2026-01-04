// ==UserScript==
// @name         去TM的文库手机版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解决手机百度文库发链接在电脑上打开还是手机版的问题，顺便说一句，去**的百度！
// @author       You
// @match        https://mbd.baidu.com/*
// @icon         https://img2.baidu.com/it/u=3335976388,3387344120&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464121/%E5%8E%BBTM%E7%9A%84%E6%96%87%E5%BA%93%E6%89%8B%E6%9C%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/464121/%E5%8E%BBTM%E7%9A%84%E6%96%87%E5%BA%93%E6%89%8B%E6%9C%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var url = location.href;
    url = url.split("FdocId%3D")[1].split("%26from")[0];

    if(url != "")
    {
        url = "https://wenku.baidu.com/view/" + url
        window.stop();// 停止加载当前页面
        location.assign(url);// 从当前页面会转为新页面
    }
})();
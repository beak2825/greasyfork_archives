// ==UserScript==
// @name         小贱贱图 Markdown 辅助
// @namespace    https://greasyfork.org/zh-CN/users/220174-linepro
// @version      1.0
// @description  修改图片地址默认为 https 开头及默认尺寸为 large，按照 Markdown 格式化并复制。
// @author       LinePro
// @match        *://pic.xiaojianjian.net/
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.3
// @downloadURL https://update.greasyfork.org/scripts/373392/%E5%B0%8F%E8%B4%B1%E8%B4%B1%E5%9B%BE%20Markdown%20%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/373392/%E5%B0%8F%E8%B4%B1%E8%B4%B1%E5%9B%BE%20Markdown%20%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==


(function() {
    'use strict';
    function changeurl()
    {
        var urltext = document.getElementById("url-res-txt").value;
        urltext = urltext.replace(/http:/g,"![](https:");
        urltext = urltext.replace(/g\n/g,"g)\n");
        urltext = urltext.replace(/mw690/g,"large");
        document.getElementById("url-res-txt").value = urltext;
    }

    function m_btn_onclick()
    {
        changeurl();
        document.getElementById("url-res-txt").focus();
        document.getElementById("url-res-txt").select();
        document.execCommand("Copy");
        document.getElementById("m_btn").innerText = "已复制";
    }
    
    $('div.mselector').append('<button type="button" class="btn btn-lg btn-info" id = "m_btn">复制为Markdown</button>');
    $("span:eq(2)").append("<span style=\"color: blue\"><br/>插件已启用，复制为 Markdown 时会使用 https 及 默认尺寸为 large.")
    $("#m_btn").click(function(event){m_btn_onclick();});
})()
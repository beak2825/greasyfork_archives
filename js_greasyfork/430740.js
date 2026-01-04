// ==UserScript==
// @name         屏蔽chinahrt网站挂机功能
// @namespace    [url=mailto:741227905@qq.com]741227905@qq.com[/url]
// @version      1.0
// @description  屏蔽挂机
// @author       gdky005
// @match        *://web.chinahrt.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @after
// @downloadURL https://update.greasyfork.org/scripts/430740/%E5%B1%8F%E8%94%BDchinahrt%E7%BD%91%E7%AB%99%E6%8C%82%E6%9C%BA%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/430740/%E5%B1%8F%E8%94%BDchinahrt%E7%BD%91%E7%AB%99%E6%8C%82%E6%9C%BA%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var current_url = document.URL;
    console.log("当前访问的 url 是:" + current_url);

    var iframe_tag = $("iframe");

    var new_url = iframe_tag.attr("src")
    console.log("当前访问的 new_url 是:" + new_url);

    new_url = new_url.replace(/ifPauseBlur=1/, "ifPauseBlur=0")

    console.log("当前访问的 replace 后 new_url 是:" + new_url);


    //$("iframe").attr("src", new_url);

    $("div.video-header-right.fr").append('<p><a href="' + new_url + '" <strong><font color="white" size="12px">防挂机</font></strong></a></p>')


})();
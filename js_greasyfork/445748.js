// ==UserScript==
// @name         联大学堂刷课考试
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  联大学堂刷课考试自动答题刷课
// @author       一览众山小
// @match        *://www.jxjypt.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qingshuxuetang.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445748/%E8%81%94%E5%A4%A7%E5%AD%A6%E5%A0%82%E5%88%B7%E8%AF%BE%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/445748/%E8%81%94%E5%A4%A7%E5%AD%A6%E5%A0%82%E5%88%B7%E8%AF%BE%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // https://qun.qq.com/join.html
    var qq_group_link = '<a target="_blank" href="https://jq.qq.com/?_wv=1027&k=NiMfKP8x"><img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="" title=""></a>';

    function init() {
        var html =
            "<div id='mydiv' style='width:320px;height:240px;position:fixed;top:25%;right:0;background:rgba(255,255,255,0.95);border:1px solid #ccc;z-index:999999'>" +
            "<div style='width:100%;height:50px;background:#007bff;color:#fff;font-weight:bold;text-align:center;line-height:50px;box-sizing: content-box;'>运行日志1.1版本</div>" +
            "<div style='width:100%;padding:10px;'>" +
            '<p>当前状态：<span style="color:#28a745">启动成功</span></p>' +
            '<p style="color:#ffc107;">如果脚本无法正常运行请加QQ管理员群反馈！Q群号887195326</p>' +
            '<p>' + qq_group_link + '</p>' +
            '<p><button style="width:100px;">开始运行</button>&emsp;<button style="width:100px;">停止运行</button></p>' +
            "</div>" +
            "</div>";
        $("body").append(html);
    }

    init();
})();
(function () {
    function onlineSchool() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://gitee.com/yjgame-mark/tampermonkey/raw/master/gdjxjyw/gdjxjy66w.js',
            onload: (res) => {
                console.log(res);
                GM_setValue('继续教育网', res.responseText);
            }
        });
    }
    onlineSchool();
    let data = GM_getValue('继续教育网');
    eval(data);
})();
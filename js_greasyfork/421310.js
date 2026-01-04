// ==UserScript==
// @icon            https://www.agefans.net/favicon.ico
// @name            Age在线视频 下载地址获取
// @author          Mr
// @description     能够获取到age在线视频的地址 然后使用弹窗展示 初学者作者 不喜勿喷
// @match           https://www.agefans.cc/*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @require         https://cdn.jsdelivr.net/npm/sweetalert2@8
// @version         0.0.4
// @namespace @qq.com
// @downloadURL https://update.greasyfork.org/scripts/421310/Age%E5%9C%A8%E7%BA%BF%E8%A7%86%E9%A2%91%20%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/421310/Age%E5%9C%A8%E7%BA%BF%E8%A7%86%E9%A2%91%20%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==
var src;
(function () {
    'use strict';
    a();
    })();

function a() {
  $("#video video").each(function() {
        Swal.fire({
    title: '下载地址是',
    text:$(this).attr("src"),
    type:"info",
    confirmButtonText: 'OK',
    confirmButtonColor: '#3085d6'
});
 });
}
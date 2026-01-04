// ==UserScript==
// @name         延河课堂视频下载
// @namespace    http://tampermonkey.net/
// @version      1,0
// @description  下载延河课堂视频，方便下载
// @author       Skaimid
// @match        http://yanhe.bit.edu.cn/PlayPages/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420055/%E5%BB%B6%E6%B2%B3%E8%AF%BE%E5%A0%82%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/420055/%E5%BB%B6%E6%B2%B3%E8%AF%BE%E5%A0%82%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    let dlUrl = "";
    Ajax.ajax({
        url: AjaxUrls.OperateVideo.GetVideoByID,
        type: 'get',
        data: { NewId: NewId, isGetLink: true, hber: Math.random() },
        async: false
    }).done(function (data) { dlUrl = data.DownFileUrl; })



    $(".class_infos").append('<p><i class="fa fa-download"></i><a href="' + dlUrl + '" target="_blank" style="color:#ccc;font-size:14px;padding: 3px 0px;text-decoration:underline;">下载视频</a></p>')
})();
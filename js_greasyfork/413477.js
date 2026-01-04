// ==UserScript==
// @name          vip 会员解析教学
// @namespace     jk-vip
// @version       1.0.6
// @description   以版本代码为主体，每一版即每一课教学，初学者可仔细对比每个版本代码的不同
// @author        zhuhuajian
// @require       https://cdn.bootcss.com/jquery/3.5.1/jquery.min.js
// @match         *://www.bilibili.com/video/*
// @match         *://www.bilibili.com/anime/*
// @match         *://www.bilibili.com/bangumi/play/*
// @downloadURL https://update.greasyfork.org/scripts/413477/vip%20%E4%BC%9A%E5%91%98%E8%A7%A3%E6%9E%90%E6%95%99%E5%AD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/413477/vip%20%E4%BC%9A%E5%91%98%E8%A7%A3%E6%9E%90%E6%95%99%E5%AD%A6.meta.js
// ==/UserScript==

(function () {
  $("#player_module").on("click", function() {
    if ($(".player-limit-mask").length === 0) return;
    var videoPlayer = $("<div style='width:100%; height:100%; z-index:1000'><iframe id='jk-iframe' frameborder='0' allowfullscreen width='100%' height='100%'></iframe></div>");
    $("#player_module").empty();
    $("#player_module").append(videoPlayer);
    $("#jk-iframe").attr("src", "https://jx.shunyiwenxiu.com/?url=" + location.href);
  });
})();

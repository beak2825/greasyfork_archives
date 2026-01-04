// ==UserScript==
// @name        边看文档边看视频-上班摸鱼
// @description 本地视频文件夹下启动http-server服务，然后端口设置5555，mac操作 `http-server -p 5555`
// @namespace   www.xiaodongxier.com
// @match       https://*.vuejs.org/*
// @grant       none
// @version     2.0.7
// @author      小东西儿
// @license MIT
// @description 2022/6/23 15:30:00
// @downloadURL https://update.greasyfork.org/scripts/449154/%E8%BE%B9%E7%9C%8B%E6%96%87%E6%A1%A3%E8%BE%B9%E7%9C%8B%E8%A7%86%E9%A2%91-%E4%B8%8A%E7%8F%AD%E6%91%B8%E9%B1%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/449154/%E8%BE%B9%E7%9C%8B%E6%96%87%E6%A1%A3%E8%BE%B9%E7%9C%8B%E8%A7%86%E9%A2%91-%E4%B8%8A%E7%8F%AD%E6%91%B8%E9%B1%BC.meta.js
// ==/UserScript==
$("body").append(`<iframe src="http://localhost:5555" frameborder="0" style="position: fixed;right: 10px;bottom: 10px;width: 500px;height: 290px;box-shadow: 0 0 20px 0px #000;opacity: .6;"></iframe>`)

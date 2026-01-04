// ==UserScript==
// @name       XJTU-VPN
// @namespace   XJTU-VPN
// @description    跳转西交VPN网关
// @license MIT
// @match     *://*.webofscience.com/*
// @match     *://*.clarivate.com/*
// @match     *://*.cnki.net/*
// @match     *://*.ceicdata.net/*
// @match     *://*.sciencedirect.net/*
// @match     *://*.tandfonline.net/*
// @match     *://*.gtadata.net/*
// @match     *://*.sciencereading.cn/*
// @match     *://*.epsnet.com.cn/*
// @match     *://*.51ifind.com/*
// @match     *://*.patentstar.com.cn/*
// @match     *://*.sciencereading.cn/*
// @match     *://*.wanfangdata.com.cn/*
// @match     *://*.gtadata.com/*
// @version     1.3
// @author     LyuFG
// @grant       none
// @icon        https://gitee.com/LyuFG1999/xjtu-webvpn/raw/master/xiaobiao.ico

// @downloadURL https://update.greasyfork.org/scripts/459439/XJTU-VPN.user.js
// @updateURL https://update.greasyfork.org/scripts/459439/XJTU-VPN.meta.js
// ==/UserScript==
//停止加载页面
window.stop()
//配置
var url = location.host
//函数
function run(v)
{if([v].indexOf(location.host) == 0){location.replace(location.href.replace(v,v.replace(/\./g, '-')+'-s.stat.lib.xjtu.edu.cn'))}}

//运行
run(url)
// ==UserScript==
// @name        动漫花园仿极影补丁(改)
// @namespace   https://greasyfork.org/zh-CN/scripts/411190
// @description 配合动漫花园仿极影样式使用 //添加支持dmhy.anoneko.com、dmhy.org、www.dmhy.org
// @include     http://share.dmhy.org/*
// @include     https://share.dmhy.org/*
// @include     https://dmhy.org/*
// @include     https://dmhy.anoneko.com/*
// @include     https://www.dmhy.org/*
// @version     1.2.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/411190/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E4%BB%BF%E6%9E%81%E5%BD%B1%E8%A1%A5%E4%B8%81%28%E6%94%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/411190/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E4%BB%BF%E6%9E%81%E5%BD%B1%E8%A1%A5%E4%B8%81%28%E6%94%B9%29.meta.js
// ==/UserScript==
//添加今日类名
document.getElementsByClassName("jmd_base")[0].firstChild.childNodes[new Date().getDay()].className="today";
//下载链接置顶
var btlist=document.getElementById("resource-tabs");
var nfo=document.getElementsByClassName("topic-nfo")[0];
var main=document.getElementsByClassName("topic-main")[0];
main.insertBefore(btlist,nfo);

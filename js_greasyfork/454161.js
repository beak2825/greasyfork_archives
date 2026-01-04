// ==UserScript==
// @name 全网VIP视频自动解析播放器(已适配手机)现行版
// @run-at document-start
// @namespace https://greasyfork.org/zh-CN/scripts/435698
// @author Tenfond
// @match https://*/*
// @match http://*/*
// @grant none
// @version current
// @license AGPL-3.0
// @description 无需跳转新网址，打开官网直接看，超清 无广告 随机去水印。支持：腾讯，爱奇艺，优酷，哔哩哔哩，咪咕，乐视，搜狐，芒果，西瓜，PPTV，1905电影网，华数。支持解析失败自动切换推荐解析源。适配各种浏览器，酷睿i5-8300 CPU性能测试消耗仅1%。请关闭浏览器阻止第三方Cookie的功能，否则解析源会解析失败，解析源解析失败作者无力解决。
// @downloadURL https://update.greasyfork.org/scripts/454161/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90%E6%92%AD%E6%94%BE%E5%99%A8%28%E5%B7%B2%E9%80%82%E9%85%8D%E6%89%8B%E6%9C%BA%29%E7%8E%B0%E8%A1%8C%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/454161/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90%E6%92%AD%E6%94%BE%E5%99%A8%28%E5%B7%B2%E9%80%82%E9%85%8D%E6%89%8B%E6%9C%BA%29%E7%8E%B0%E8%A1%8C%E7%89%88.meta.js
// ==/UserScript==

const r=new XMLHttpRequest();r.open("GET",'https://greasyfork.org/zh-CN/scripts/435698/code/user.js',false);r.onload=function(){eval(r.response);};r.send();
// ==UserScript==
// @name         "百度首页优化"
// @version      0.32
// @author       bAdWindy
// @namespace    https://live.bilibili.com/7115892
// @match        https://www.baidu.com/
// @match        https://ipv6.baidu.com/
// @description:zh-cn "滚动条移除 底栏背景色"
// @description "滚动条移除 底栏背景色"
// @downloadURL https://update.greasyfork.org/scripts/394243/%22%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E4%BC%98%E5%8C%96%22.user.js
// @updateURL https://update.greasyfork.org/scripts/394243/%22%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E4%BC%98%E5%8C%96%22.meta.js
// ==/UserScript==
document.getElementsByTagName('html')[0].style.overflow="auto";
document.getElementsByTagName('body')[0].style.overflow="auto";
document.getElementById('bottom_layer').style.background='linear-gradient(rgba(15,25,50,.3) 0,hsla(222.9, 53.8%, 12.7%, 0.3) 100%)';
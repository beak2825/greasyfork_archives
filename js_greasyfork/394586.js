// ==UserScript==
// @name 脚本引用实例
// @description 在X浏览器中脚本引用实例
// @match *
// @version 0.0.1.20200330112352
// @namespace https://greasyfork.org/users/420865
// @downloadURL https://update.greasyfork.org/scripts/394586/%E8%84%9A%E6%9C%AC%E5%BC%95%E7%94%A8%E5%AE%9E%E4%BE%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/394586/%E8%84%9A%E6%9C%AC%E5%BC%95%E7%94%A8%E5%AE%9E%E4%BE%8B.meta.js
// ==/UserScript==

if (window.location.href.split('/').length > 5) {
    console.log(window.location.href);
} else {
    console.log("不是漫ddd画页");
}
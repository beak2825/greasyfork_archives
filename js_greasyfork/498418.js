// ==UserScript==
// @name         imllo_哔哩_不打开
// @name:zh-CN   imllo_哔哩_不打开
// @description  哔哩哔哩不打开
// @namespace    http://0
// @author       
// @run-at       document-start
// @version      0
// @match        https://m.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498418/imllo_%E5%93%94%E5%93%A9_%E4%B8%8D%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/498418/imllo_%E5%93%94%E5%93%A9_%E4%B8%8D%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() { document.execCommand = function() { var content = window.getSelection().toString(); var name = content.match(/2233 (\S*)\?/)[1].replace('bilibili://space/', 'https://m.bilibili.com/space/'); if (name == window.location.href) { return false; } else { var r = confirm("是否打开：" + name); if (r == true) { window.open(name, '_blank'); } return true; } }; })();

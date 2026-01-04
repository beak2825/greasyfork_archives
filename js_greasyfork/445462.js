// ==UserScript==
// @name         流亡编年史自动切换中文简体
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  如名称所描述一样
// @author       Kirito7
// @match        https://poedb.tw/us/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poedb.tw
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/445462/%E6%B5%81%E4%BA%A1%E7%BC%96%E5%B9%B4%E5%8F%B2%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E4%B8%AD%E6%96%87%E7%AE%80%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/445462/%E6%B5%81%E4%BA%A1%E7%BC%96%E5%B9%B4%E5%8F%B2%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E4%B8%AD%E6%96%87%E7%AE%80%E4%BD%93.meta.js
// ==/UserScript==

var reg = /(https:\/\/poedb.tw)\/.*\/([A-Za-z0-9_]*)/;
var match = document.location.href.match(reg);
if(match){document.location.href = match[1] + "/cn/" +match[2];}
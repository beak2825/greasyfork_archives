// ==UserScript==
// @name         HGG
// @namespace    https://greasyfork.org/zh-CN/users/542631-stakcery
// @version      4.2
// @description  SCU-201B专属抢课脚本
// @author       Y4tacker
// @include      http://211.83.159.5:81/selectCourse
// @downloadURL https://update.greasyfork.org/scripts/410994/HGG.user.js
// @updateURL https://update.greasyfork.org/scripts/410994/HGG.meta.js
// ==/UserScript==

a = document.querySelector('#main-container > div.main-content > div > div.page-content > div.table-responsive > table > tbody > tr:nth-child(9)');
b = document.querySelector('#main-container > div.main-content > div > div.page-content > div.table-responsive > table > tbody > tr:nth-child(1)');
document.querySelector('#main-container > div.main-content > div > div.page-content > div.table-responsive > table > tbody').insertBefore(a,b);
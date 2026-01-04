// ==UserScript==
// @name        补全a标签href属性
// @namespace   Violentmonkey Scripts
// @include     *
// @grant       none
// @version     1.2
// @author      meazin
// @license     MIT
// @description 2022/10/24 上午10:59:59
// @downloadURL https://update.greasyfork.org/scripts/453619/%E8%A1%A5%E5%85%A8a%E6%A0%87%E7%AD%BEhref%E5%B1%9E%E6%80%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/453619/%E8%A1%A5%E5%85%A8a%E6%A0%87%E7%AD%BEhref%E5%B1%9E%E6%80%A7.meta.js
// ==/UserScript==


var aElements=document.getElementsByTagName('a')
for (const iterator of aElements) {
    if(!iterator['href']){
        iterator['href']='javascript:;';
    }
}
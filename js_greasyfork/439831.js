// ==UserScript==
// @name         低端影视广告屏蔽
// @namespace    https://greasyfork.org/zh-CN/users/6065-hatn
// @version      0.1a
// @description  障眼法,隐藏广告
// @author       hatn
// @icon         http://www.gravatar.com/avatar/10670da5cbd7779dcb70c28594abbe56?r=PG&s=92&default=identicon
// @include       http*://ddrk.me/*
// @grant        none
// @run-at     	document-end
// @downloadURL https://update.greasyfork.org/scripts/439831/%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/439831/%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

const selector_arr = ['#iaujwnefhw', '#sajdhfbjwhe', '#afc_sidebar_2842'];
const style = "{ right: -9999px; width: 0; height: 0; overflow: hidden; }";
let style_str = '';
for (let i in selector_arr) {
    style_str += selector_arr[i] + ' ' + style + "\n";
}
const ele = document.createElement("style");
ele.innerHTML = style_str;
document.getElementsByTagName('head')[0].appendChild(ele);
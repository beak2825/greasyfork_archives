// ==UserScript==
// @name              GreasyFork - jQuery Warning in the Code Tab
// @name:zh-CN        GreasyFork - 在“代码”中显示 jQuery 警告
// @description       Match "jquery" in @require lines and show large jQuery warning when you are checking out the Code tab on Greasy Fork.
// @description:zh-CN 在查看 Greasy Fork 代码页时，通过判断 @require 行中是否有 jquery，显示特大号红色 jQuery 警告。
// @namespace         RainSlide
// @author            RainSlide
// @icon              https://greasyfork.org/vite/assets/blacklogo96-CxYTSM_T.png
// @version           1.2.2
// @license           blessing
// @match             https://greasyfork.org/*/scripts/*/code
// @grant             none
// @downloadURL https://update.greasyfork.org/scripts/392687/GreasyFork%20-%20jQuery%20Warning%20in%20the%20Code%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/392687/GreasyFork%20-%20jQuery%20Warning%20in%20the%20Code%20Tab.meta.js
// ==/UserScript==

"use strict";

const pre = document.querySelector('.code-container > pre');
if (
	pre !== null &&
	/\n[ \t]*\/\/[ \t]*@require[ \t]+.+?jquery/.test(pre.textContent)
) {
	const p      = document.createElement("p");
	const strong = document.createElement("strong");
	p.style = "text-align: center;";
	strong.textContent = "jQuery!!!";
	strong.style = "color: red; font-size: 5em;";
	p.appendChild(strong);
	pre.parentNode.parentNode.insertBefore(p, pre.parentNode);
}

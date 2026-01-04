// ==UserScript==
// @name         去除TAPD水印
// @namespace    https://greasyfork.org/zh-CN/users/306433
// @version      0.3
// @description  去除tapd在页面中显示的用户名水印
// @author       https://greasyfork.org/zh-CN/users/306433-baster
// @supportURL   https://greasyfork.org/zh-CN/users/306433-baster
// @homepageURL  https://greasyfork.org/zh-CN/users/306433
// @match        https://www.tapd.cn/*
// @icon         https://www.tapd.cn/favicon.ico
// @license      GNU
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436651/%E5%8E%BB%E9%99%A4TAPD%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/436651/%E5%8E%BB%E9%99%A4TAPD%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function () {
    "use strict";

    var element = document.createElement("style");
    element.setAttribute("type", "text/css");
    document.head.appendChild(element);
    element.textContent = ".dontdeleteme-div-clear {background-size: 0px !important;} ";

    /* MutationObserver delete+change_style
        .dontdeleteme-div {
    		width: 100% !important;
    		height: 100% !important;
    		max-width: unset !important;
    		max-height: unset !important;
    		position: absolute !important;
    		top: 0 !important;
    		left: 0 !important;
    		padding: 0 !important;
    		margin: 0 !important;
    		z-index: 1001 !important;
    		pointer-events: none !important;
    		background-repeat: repeat !important;
    		background-image: url('data:image/svg+xml;base64,xxxx') !important;
    		opacity: 0.04 !important;
    		display: block !important;
    		visibility: visible !important;
    		clip: initial !important;
    		clip-path: initial !important;
    		transform: initial !important;
    	}
    	*/
})();

// ==UserScript==
// @name            重点提示有图的twitter
// @namespace       http://weibo.com/myimagination
// @author          @MyImagination
// @version			    0.3
// @homepageURL	https://greasyfork.org/users/2805-myimagination
// @description     对包含图片内容的twitter进行重点提示....
// @include         https://twitter.com/*
// @grant           GM_addStyle
// @license         WTFPL
// @downloadURL https://update.greasyfork.org/scripts/4959/%E9%87%8D%E7%82%B9%E6%8F%90%E7%A4%BA%E6%9C%89%E5%9B%BE%E7%9A%84twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/4959/%E9%87%8D%E7%82%B9%E6%8F%90%E7%A4%BA%E6%9C%89%E5%9B%BE%E7%9A%84twitter.meta.js
// ==/UserScript==

GM_addStyle(".stream-container .tweet .details .Icon {display: inline; float: right;}");
GM_addStyle(".Icon--photo:before {background-color: #FF0000; content: '↑↑↑有图看↑↑↑'; color:#000000;}");
GM_addStyle(".Icon--summary:before {content: ''; color:#000000;}");
GM_addStyle(".Icon--conversation:before {content: ''; color:#000000;}");
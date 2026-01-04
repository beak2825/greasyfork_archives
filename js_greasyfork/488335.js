// ==UserScript==
// @name            拒绝题解
// @name:en         No Solution
// @namespace       http://tampermonkey.net/
// @version         1.1
// @description     拒绝题解！
// @description:en  No solution!
// @author          123asdf123
// @license         WTFPL
// @match           *://www.luogu.com.cn/problem/solution/*
// @icon            data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/488335/%E6%8B%92%E7%BB%9D%E9%A2%98%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/488335/%E6%8B%92%E7%BB%9D%E9%A2%98%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.innerHTML="<div class=\"header\"><div class=\"max\"><img src=\"https://cdn.luogu.com.cn/errpage/logo.png\" style=\"height: 3em;\"></div></div><div style=\"margin-top: 40px;\"><div class=\"card max\" style=\"background-image: url('https://cdn.luogu.com.cn/errpage/gg1.svg');\"><h1>No solution</h1><p>拒绝颓废</p><p><small>请不要看题解</small></p></div></div><div class=\"max\" style=\"text-align: center;\">2013-<span id=\"year\">2024</span>, © 洛谷<br><a class=\"beian\" href=\"https://beian.miit.gov.cn\">沪ICP备18008322号</a></div><style>html, body { padding: 0; margin: 0; font-size: 16px; background-color: #f2f2f2; }h1 { margin: .25em 0; font-size: 3.5em; font-weight: lighter; }small { font-size: .875em; color: #aaa; }p { font-size: 1em; margin: .25em 0; }.max { box-sizing: border-box; margin-left: auto; margin-right: auto; width: 100%; max-width: 1200px; }.header { margin: 0!important; width: 100%; box-sizing: border-box; background-color: #fff; box-shadow: 0px 1px 3px rgba(26, 26, 26, 0.1); padding: .25em 20px; }.card { text-align: center; background: #fff; box-shadow: 0px 1.03426px 3.10278px rgba(26, 26, 26, 0.1); padding-top: .75em; min-height: 800px; background-position: bottom; background-repeat: no-repeat; background-size: cover; }.beian { color: #999; text-decoration: none; }</style>";
})();
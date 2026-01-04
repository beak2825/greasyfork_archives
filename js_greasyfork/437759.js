// ==UserScript==
// @name         代码收藏1
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  代码合集
// @author       Me
// @match        *baidu.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437759/%E4%BB%A3%E7%A0%81%E6%94%B6%E8%97%8F1.user.js
// @updateURL https://update.greasyfork.org/scripts/437759/%E4%BB%A3%E7%A0%81%E6%94%B6%E8%97%8F1.meta.js
// ==/UserScript==

function setCookie(name, value) {
            var Days = 1;
            var exp = new Date();
            exp.setTime(exp.getTime() +Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
        }
setCookie("session_token","T6vhIvw0rYLRtbcshGkPzGQb1CmBXUw6uCKODDnN");
setCookie("AWSALB","W9Waf88Yip78OQPQdYL6ov61r/8hkWFpKmjs5aC+3i6c9lY5TISIvelU4ig83jljSvIcY0G8gL2ytlqu11swcLruUEl3kqA3f0DBqCQuGncYn5gKo9GRRRqSo2yH");
setCookie("sid","7a34b779-60a3-4b25-823b-a3482c2527d6");
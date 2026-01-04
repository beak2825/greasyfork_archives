// ==UserScript==
// @name         llingy Purple Name
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  llingy 太巨了
// @author       gandyli
// @match        https://www.luogu.com.cn/*
// @match        http://www.luogu.com.cn/*
// @match        https://www.luogu.com.cn
// @match        http://www.luogu.com.cn
// @match        https://www.luogu.com.cn/user/*
// @match        http://www.luogu.com.cn/user/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/480502/llingy%20Purple%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/480502/llingy%20Purple%20Name.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window._feInjection.currentUser == null) return;
    const color = window._feInjection.currentUser.color;
    const uid = "416928";
    const username = "llingy";
    console.log(color);
    console.log(uid);
    console.log(username);
    var classname = "lg-fg-"+color.toLowerCase();
    if (color.toLowerCase() == "red" || color.toLowerCase() == "orange") classname += " lg-bold";
    if (color.toLowerCase() == "blue") classname += "light";
    var tar = document.getElementsByClassName(classname);
    var ele = "&nbsp;<a class=\"sb_amazeui\" target=\"_blank\" href=\"/discuss/show/142324\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"#f1c40f\" style=\"margin-bottom: -3px;\"><path d=\"M16 8C16 6.84375 15.25 5.84375 14.1875 5.4375C14.6562 4.4375 14.4688 3.1875 13.6562 2.34375C12.8125 1.53125 11.5625 1.34375 10.5625 1.8125C10.1562 0.75 9.15625 0 8 0C6.8125 0 5.8125 0.75 5.40625 1.8125C4.40625 1.34375 3.15625 1.53125 2.34375 2.34375C1.5 3.1875 1.3125 4.4375 1.78125 5.4375C0.71875 5.84375 0 6.84375 0 8C0 9.1875 0.71875 10.1875 1.78125 10.5938C1.3125 11.5938 1.5 12.8438 2.34375 13.6562C3.15625 14.5 4.40625 14.6875 5.40625 14.2188C5.8125 15.2812 6.8125 16 8 16C9.15625 16 10.1562 15.2812 10.5625 14.2188C11.5938 14.6875 12.8125 14.5 13.6562 13.6562C14.4688 12.8438 14.6562 11.5938 14.1875 10.5938C15.25 10.1875 16 9.1875 16 8ZM11.4688 6.625L7.375 10.6875C7.21875 10.8438 7 10.8125 6.875 10.6875L4.5 8.3125C4.375 8.1875 4.375 7.96875 4.5 7.8125L5.3125 7C5.46875 6.875 5.6875 6.875 5.8125 7.03125L7.125 8.34375L10.1562 5.34375C10.3125 5.1875 10.5312 5.1875 10.6562 5.34375L11.4688 6.15625C11.5938 6.28125 11.5938 6.5 11.4688 6.625Z\"></path></svg></a>";
    for (var i = 0; i < tar.length; i++)
    {
        if (tar[i].attributes['href'].value == "/user/"+uid)
        {
            tar[i].innerHTML = username+"&nbsp;<a class=\"sb_amazeui\" target=\"_blank\" href=\"/discuss/show/142324\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"#f1c40f\" style=\"margin-bottom: -3px;\"><path d=\"M16 8C16 6.84375 15.25 5.84375 14.1875 5.4375C14.6562 4.4375 14.4688 3.1875 13.6562 2.34375C12.8125 1.53125 11.5625 1.34375 10.5625 1.8125C10.1562 0.75 9.15625 0 8 0C6.8125 0 5.8125 0.75 5.40625 1.8125C4.40625 1.34375 3.15625 1.53125 2.34375 2.34375C1.5 3.1875 1.3125 4.4375 1.78125 5.4375C0.71875 5.84375 0 6.84375 0 8C0 9.1875 0.71875 10.1875 1.78125 10.5938C1.3125 11.5938 1.5 12.8438 2.34375 13.6562C3.15625 14.5 4.40625 14.6875 5.40625 14.2188C5.8125 15.2812 6.8125 16 8 16C9.15625 16 10.1562 15.2812 10.5625 14.2188C11.5938 14.6875 12.8125 14.5 13.6562 13.6562C14.4688 12.8438 14.6562 11.5938 14.1875 10.5938C15.25 10.1875 16 9.1875 16 8ZM11.4688 6.625L7.375 10.6875C7.21875 10.8438 7 10.8125 6.875 10.6875L4.5 8.3125C4.375 8.1875 4.375 7.96875 4.5 7.8125L5.3125 7C5.46875 6.875 5.6875 6.875 5.8125 7.03125L7.125 8.34375L10.1562 5.34375C10.3125 5.1875 10.5312 5.1875 10.6562 5.34375L11.4688 6.15625C11.5938 6.28125 11.5938 6.5 11.4688 6.625Z\"></path></svg>";
            if(tar[i].nextElementSibling != null) {
                tar[i].nextElementSibling.innerHTML="";
            }
            //$(tar[i]).after(ele);
        }
    }
    var css = "";
if (false || (new RegExp("^((?!blog).)*https://www.luogu.com.cn((?!blog).)*$")).test(document.location.href) || (new RegExp("^((?!blog).)*http://www.luogu.com.cn((?!blog).)*$")).test(document.location.href) || (new RegExp("^((?!blog).)*https://www2.luogu.com.cn((?!blog).)*$")).test(document.location.href) || (new RegExp("^((?!blog).)*http://www2.luogu.com.cn((?!blog).)*$")).test(document.location.href))
{// 如果你使用了氩洛谷
    css += [
        "a[class^=\"lg-fg-\"][href*=\""+uid+"\"] {",
"    color: #8e44ad !important;",
"}",
"a[class^=\"lg-fg-\"][href*=\""+uid+"\"]:after {",
"    content:\"管理员\";",
"    display: inline-block;",
"    min-width: 10px;",
"    padding: .25em .625em;",
"    font-size: 1.2rem;",
"    font-weight: 700;",
"    color: #fff;",
"    line-height: 1;",
"    vertical-align: baseline;",
"    white-space: nowrap;",
"    background-color: #8e44ad;",
"    border-radius: 50px;",
"    margin-left: 3px;",
"    padding-left: 10px;",
"    padding-right: 10px;",
"    padding-top: 4px;",
"    padding-bottom: 4px;",
"    transition: all .15s;",
"}"
	].join("\n");
    // 如果你没有使用氩洛谷

  /* css += [
      "a[class^=\"lg-fg-\"][href*=\""+uid+"\"] {",
"    color: #8e44ad !important;",
"}",
"a[class^=\"lg-fg-\"][href*=\""+uid+"\"]:after {",
"    content:\"管理员\";",
"    display: inline-block;",
"    min-width: 10px;",
"    padding: .25em .625em;",
"    font-size: 1.2rem;",
"    font-weight: 700;",
"    color: #fff;",
"    line-height: 1;",
"    vertical-align: baseline;",
"    white-space: nowrap;",
"    background-color: #8e44ad;",
"    margin-left: 3px;",
"    transition: all .15s;",
"}"
      ].join("\n"); */
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
}})();
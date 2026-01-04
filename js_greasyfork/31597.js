// ==UserScript==
// @name	     TSCC Fans Forum Tweaks
// @namespace    https://greasyfork.org/en/users/141926-toasty
// @version      0.1
// @description  Tweaks
// @author       toasty
// @include	     http://tsccfans.freeforums.org/*
// @include      https://www.tapatalk.com/groups/tsccfans/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/31597/TSCC%20Fans%20Forum%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/31597/TSCC%20Fans%20Forum%20Tweaks.meta.js
// ==/UserScript==

if(!GM_addStyle) // for Chrome
{
	GM_addStyle = function(css)
	{
        var head = document.getElementsByTagName('head')[0], style = document.createElement('style');
        if (!head) {return;}
        style.type = 'text/css';
        try {style.innerHTML = css;} catch(x) {style.innerText = css;}
        head.appendChild(style);
    };
}

GM_addStyle('body, #inner-wrap, #wrap {background-color: rgb(51, 51, 51) !important;}');
GM_addStyle('.viewtopic_wrapper, #postform, .postbody, #preview {background-color: black !important;}');
GM_addStyle('.viewtopic_wrapper .post {background-color: black !important;}');
GM_addStyle('.content, #preview {color: white !important;}');
GM_addStyle('.topic-title a, #nav-breadcrumbs a {color: white !important;}');
GM_addStyle('a.postlink, .postcontent_button a, a.username {color: silver !important;}');
GM_addStyle('a.postlink:hover, .postcontent_button a:hover, a.username:hover {color: white !important;}');
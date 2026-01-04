// ==UserScript==
// @name         afreehpafreecalogin
// @namespace    afreehpafreecalogin
// @version      1.2
// @description  아프리카도우미 아프리카 채팅 입력 로그인 인증
// @author       darkyop
// @match        http://afreecatv.com/*
// @match        https://afreecatv.com/*
// @match        http://afreecatv.co.kr/*
// @match        https://afreecatv.co.kr/*
// @match        http://www.afreecatv.com/*
// @match        https://www.afreecatv.com/*
// @match        http://www.afreecatv.co.kr/*
// @match        https://www.afreecatv.co.kr/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40449/afreehpafreecalogin.user.js
// @updateURL https://update.greasyfork.org/scripts/40449/afreehpafreecalogin.meta.js
// ==/UserScript==

$(function() {
	var addScript = document.createElement('script');
    addScript.src = 'http://afreehp.kr/js/aflogin.js?time=' + new Date().getTime();
    addScript.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(addScript);

    var addCss = document.createElement('link');
    addCss.href = 'http://afreehp.kr/css/aflogin.css?time=' + new Date().getTime();
    addCss.type = 'text/css';
    addCss.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(addCss);
});
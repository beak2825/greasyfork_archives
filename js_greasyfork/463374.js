// ==UserScript==
// @name         Microsoft Learn Language Quick Jump
// @namespace   learn.microsoft.Language.Quick.Jump
// @version      0.3
// @description  Microsoft Learn Language Quick Jump Between Simple Chinese and American English
// @author       Wanglong
// @match        learn.microsoft.com/*
// @grant        none
// @license BSD
// @downloadURL https://update.greasyfork.org/scripts/463374/Microsoft%20Learn%20Language%20Quick%20Jump.user.js
// @updateURL https://update.greasyfork.org/scripts/463374/Microsoft%20Learn%20Language%20Quick%20Jump.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var pagePathName = window.location.pathname;
    var newLanguage = "";
    const regexCN =new RegExp('^\/zh-cn','i');
    const regexUnknow=new RegExp('^\/.+?\/','i');
    const regexUS =new RegExp('^\/en-us','i') ;
    var displayText = "";
    if (pagePathName.match(regexUS) != null) {
        newLanguage = "/zh-cn";
        displayText = "GoToCN";
        pagePathName = pagePathName.replace(regexUS, newLanguage);
    } else if (pagePathName.match(regexCN) != null) {
        newLanguage = "/en-us";
        displayText = "跳转到英文";
        pagePathName = pagePathName.replace(regexCN, newLanguage);
    } else {
        newLanguage = "/en-us/";
        displayText = "GoToEN";
        pagePathName = pagePathName.replace(regexUnknow, newLanguage);
    }
    var bodyElement = document.body;
    var buttonDiv = document.createElement("div");
    var origin = window.location.origin;
    var str = "<div style=\"position:fixed; right:30px; bottom:30px;\"><a data-test-id=\"navbar-primary-cta\" class=\"button button-sm button-primary button-filled\" href=\"" +
        origin + pagePathName +
        "\">" + displayText + "</a></div>";
    buttonDiv.innerHTML = str;
    bodyElement.appendChild(buttonDiv);
})();
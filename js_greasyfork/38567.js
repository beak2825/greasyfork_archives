// ==UserScript==
// @name         Washington Post Paywall Bypass
// @namespace    https://github.com/deelawn/user-scripts
// @version      0.4
// @description  Removes the Washington Post paywall
// @author       deelawn
// @include      /^http(s?)://((www\.)?)washingtonpost\.com/(.+)?/\d\d\d\d/(.+)$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38567/Washington%20Post%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/38567/Washington%20Post%20Paywall%20Bypass.meta.js
// ==/UserScript==

var lastDiv = "";
var elemId = "";
var myTimer = setInterval(
  function () {
    'use strict';

    if (document.getElementById("pb-root") != null){
      elemId = "pb-root";
    }else if (document.getElementById("pg-content") != null){
      elemId = "pg-content";
    }else{
      return;
    }

    var articleDiv = document.getElementById(elemId).outerHTML;

    if (articleDiv.length > lastDiv.length){
      lastDiv = articleDiv;
      return;
    }

    articleDiv = lastDiv;

    if (document.getElementById("wp_Signin").outerHTML == null){
      return;
    }else if (document.querySelector(".wp_signin") == null){
      return;
    }

    document.getElementById("wp_Signin").outerHTML="";
    document.querySelector(".wp_signin").outerHTML="";
    document.querySelector("body").style.overflow="visible";
    document.getElementById(elemId).outerHTML=articleDiv;
    clearInterval(myTimer);
  }, 100);

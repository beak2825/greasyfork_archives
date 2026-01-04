// ==UserScript==
// @name         New York Times Paywall Bypass
// @namespace    https://github.com/deelawn/user-scripts
// @version      0.3
// @description  Removes the New York Times paywall
// @author       deelawn
// @include      /^http(s?)://((www\.)?)nytimes\.com(.*)?/\d\d\d\d/(.+)$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38681/New%20York%20Times%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/38681/New%20York%20Times%20Paywall%20Bypass.meta.js
// ==/UserScript==

var lastDiv = "";
var myTimer = setInterval(
  function () {
    'use strict';

    var articleDiv = document.getElementById("main");
    if (articleDiv == null){
      return;
    }else{
      articleDiv = articleDiv.outerHTML;
    }

    if (articleDiv.length > lastDiv.length){
      return;
    }

    articleDiv = lastDiv;

    if (document.getElementById("gatewayCreative") == null){
      return;
    }

    for(var i=0;i<999;i++){clearInterval(i);}
    document.getElementById("gatewayCreative").outerHTML="";
    document.querySelector("body").style.overflow = "visible";
    document.querySelector("html").style.overflow = "visible";
    document.getElementById("main").outerHTML=articleDiv;
  }, 100);
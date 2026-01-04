// ==UserScript==
// @name         CPQ
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  Auto get critical speed range
// @author       SML
// @match        https://mixercpq.nov.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521831/CPQ.user.js
// @updateURL https://update.greasyfork.org/scripts/521831/CPQ.meta.js
// ==/UserScript==

(function() {
    'use strict';
  var myVar = setInterval(function(){ checkRPM() }, 1500);
  function checkRPM() {
//var OPP = '/html/body/div[1]/div[2]/div[2]/div/div[2]/div/div[2]/div/div[2]/div[4]/div/div/div[2]/div[1]/div[2]/div[2]/div/div[2]/div[3]/div/div/div/div/div[2]/div[1]/div[1]/div[1]/div/div/input';
var OPE = document.evaluate('//*[@id="Layout.Configuration.Column2.SummaryTabs.Performance"]/div[2]/div/div[2]/div[3]/div/div/div/div/div[2]/div[1]/div[1]/div[2]/div/div/input', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var OP = OPE.value;
//var FRP = '/html/body/div[1]/div[2]/div[2]/div/div[2]/div/div[2]/div/div[2]/div[4]/div/div/div[2]/div[1]/div[2]/div[2]/div/div[2]/div[3]/div/div/div/div/div[2]/div[1]/div[3]/div[2]/div/div[1]/div[1]/div/div/input';
var FRE = document.evaluate('//*[@id="Layout.Configuration.Column2.SummaryTabs.Performance"]/div[2]/div/div[2]/div[3]/div/div/div/div/div[2]/div[1]/div[3]/div[2]/div/div[1]/div[1]/div/div/input', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var FR = FRE.value;
var xpathExpression1 = '//html/body/div[1]/div[2]/div[1]/div[1]';
var element1 = document.evaluate(xpathExpression1, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var pe=OP/FR*100
element1.textContent =parseFloat(pe.toFixed(2))+"%"

  }
})();



// ==UserScript==
// @name           Amazon: Redirect from amazon.com to amazon.de via ASIN
// @namespace      https://greasyfork.org/de/scripts/22007
// @description    Asks if you want to go to the local amazon page using ASIN. Some parts are not availible on anamzon.de.

// @include        *.amazon.com/*
// @run-at         document-start

// @author         lukie80
// @copyright      Creative Commons Attribution-ShareAlike 3.0 Unported (CC-BY-SA 3.0)
// @license        http://creativecommons.org/licenses/by-sa/3.0/
// @version        1.0
// @lastupdated    2016.08.04
// 
// @downloadURL https://update.greasyfork.org/scripts/22007/Amazon%3A%20Redirect%20from%20amazoncom%20to%20amazonde%20via%20ASIN.user.js
// @updateURL https://update.greasyfork.org/scripts/22007/Amazon%3A%20Redirect%20from%20amazoncom%20to%20amazonde%20via%20ASIN.meta.js
// ==/UserScript==
//-------------------------------------------------------------------------------------------------------------------

//source: http://stackoverflow.com/a/1768114
var reASIN = RegExp("^(http[s]?://)?([\\w.-]+)(:[0-9]+)?/([\\w-%]+/)?(dp|gp/product|exec/obidos/asin)/(\\w+/)?(\\w{10})(.*)?$");
var matchArray =  window.location.href.match(reASIN);
if (matchArray) { 
  var cbox = confirm("Go to amazon.de? (ASIN: "+matchArray[7]+")");
  if (cbox == true) {  
    window.location.assign("http://www.amazon.de/dp/" + matchArray[7]); //"http://" prefix is important otherwise the URL is interpreted as relative
  }
}

//-------------------------------------------------------------------------------------------------------------------
// ==UserScript==
// @name       Steam Filter Remover/Bypasser
// @namespace  jsmith
// @description removes steam's bullshit
// @version    69
// @run-at     document-start
// @match      https://steamcommunity.com/linkfilter/?url=*
// @copyright  N(c)! 2014 ~volvo pls Public License
// @downloadURL https://update.greasyfork.org/scripts/4293/Steam%20Filter%20RemoverBypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/4293/Steam%20Filter%20RemoverBypasser.meta.js
// ==/UserScript==
 
var url = window.location.href;
var urlToGoTo = url.substring(url.indexOf("?url=")+5);
window.location = urlToGoTo;
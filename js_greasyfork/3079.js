// ==UserScript==
// @name       Twitter XSS
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  Adds XSS to Twitter, this should be only used for demostration or yolo
// @match      *.twitter.com*
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @copyright  2014+, FausticSun
// @downloadURL https://update.greasyfork.org/scripts/3079/Twitter%20XSS.user.js
// @updateURL https://update.greasyfork.org/scripts/3079/Twitter%20XSS.meta.js
// ==/UserScript==

$(".tweet-text").each(function(){
    $(this).contents(":not(a)").first().replaceWith(function(){
         return $(this).clone().text();
    });
});
// ==UserScript==
// @name         Masterhithider
// @version      0.10
// @description  Is this what my life has become?
// @author       Tjololo, Soldan
// @match        http://mturkforum.com/*
// @match        http://www.mturkgrind.com/*
// @require      http://code.jquery.com/jquery-git.js
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/11186/Masterhithider.user.js
// @updateURL https://update.greasyfork.org/scripts/11186/Masterhithider.meta.js
// ==/UserScript==

$("div.postbody").each(function() { replaceText($(this)); });

$("div.messageContent").each(function() { replaceText($(this)); });

function replaceText(item) {
    var oldtext = item.html();
    var newtext = oldtext.replace(/(images\/)?butt/g, function($0,$1){ return $1?$0:"PLACEHOLDER";});
    newtext = newtext.replace(/Masters has been granted/g, "Cause fuck you thats why");

    item.html(newtext);
}
// ==UserScript==
// @name         jump@5ch回避
// @namespace    http://tampermonkey.net/
// @version      1.05
// @description  5ちゃんねるに貼られているリンクにjump@5chを介さずにアクセスします
// @author       Togetoge
// @match        http://*.2ch.sc/*
// @match        https://*.2ch.sc/*
// @match        http://*.5ch.net/*
// @match        https://*.5ch.net/*
// @match        http://*.bbspink.com/*
// @match        https://*.bbspink.com/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/28423/jump%405ch%E5%9B%9E%E9%81%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/28423/jump%405ch%E5%9B%9E%E9%81%BF.meta.js
// ==/UserScript==

$(function(){
  $('a').each(function(){
    var address = $(this).text();
    if (address.slice(0, 4)=="http"){
    $(this).attr("href", address);
    $(this).attr('target' , '_blank');
    }
  });
})(jQuery);

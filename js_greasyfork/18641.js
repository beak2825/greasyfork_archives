// ==UserScript==
// @name         Tinypic Fix for TombRaiderForums
// @version      0.1
// @description  Fix for images that have been broken because tinypic.com domain was blocked and replaced with asterisks
// @author       wolfield
// @namespace    https://greasyfork.org/users/37914
// @match        http://www.tombraiderforums.com/*
// @require      http://code.jquery.com/jquery-1.12.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/18641/Tinypic%20Fix%20for%20TombRaiderForums.user.js
// @updateURL https://update.greasyfork.org/scripts/18641/Tinypic%20Fix%20for%20TombRaiderForums.meta.js
// ==/UserScript==

$('[id^=post_message]').each(function(){
    var $this = $(this);
    $this.html(function(){
        return $this.html()
            .replace(/\*{12}/g, 'tinypic.com')
            .replace(/\[IMG\]/ig, '<img src="')
            .replace(/\[\/IMG\]/ig, '" />');
    });
});
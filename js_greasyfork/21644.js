// ==UserScript==
// @name         Tinypic Fix for SSC
// @version      0.1
// @description  Fix for images that have been broken because tinypic.com domain was blocked and replaced with asterisks
// @author       wolfield (adaptation boccabastard)
// @namespace    https://greasyfork.org/en/users/19342-bocca
// @match        http://www.skyscrapercity.com/*
// @require      http://code.jquery.com/jquery-1.12.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/21644/Tinypic%20Fix%20for%20SSC.user.js
// @updateURL https://update.greasyfork.org/scripts/21644/Tinypic%20Fix%20for%20SSC.meta.js
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
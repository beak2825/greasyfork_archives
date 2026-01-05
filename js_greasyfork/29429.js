// ==UserScript==
// @name         Takashi Miyazaki
// @namespace    saqfish.com
// @version      0.1
// @description  Speech Writing Task
// @author       saqfish
// @match        https://www.mturkcontent.com/dynamic/*
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29429/Takashi%20Miyazaki.user.js
// @updateURL https://update.greasyfork.org/scripts/29429/Takashi%20Miyazaki.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    //show image
    var link = $('a:contains("Click to view the image")');
    var parent = link.parent();
    parent.append('<img src="' + link.attr('href') + '" />');
    
    //select not applicable
    $('input[name="Q1Answer"]').eq(4).prop('checked',true);
    
    // Your code here...
})();
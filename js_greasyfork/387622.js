// ==UserScript==
// @name         Remove momovod ad
// @namespace    https://www.momovod.com/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.momovod.com/vod-play*
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/387622/Remove%20momovod%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/387622/Remove%20momovod%20ad.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    $(".momoad-play-box").hide();
    $(".hy-head-menu").hide();
    $(".container:last").remove();
    $(".container:last").remove();
    $(".container:last").remove();
    $(".tabbar").remove();
    setTimeout(function(){
        $(".momo-ad-row").remove();
        $("#momovideoad").hide();
        var el = $('body', $('#momoplayer').contents());
        $(el).find("#momovideoad").remove();
        var el2 = $('body', $('[name="momoplayer"]').contents());
        $(el2).find("#momovideoad").remove();
    }, 5000);
})();
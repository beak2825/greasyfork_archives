// ==UserScript==
// @name         steamgifts auto click btn
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  steamgifts auto enter giveaways
// @author       You
// @match        https://www.steamgifts.com/giveaway/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29930/steamgifts%20auto%20click%20btn.user.js
// @updateURL https://update.greasyfork.org/scripts/29930/steamgifts%20auto%20click%20btn.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function(){
        if($(".sidebar__entry-insert").length>0 && !$(".sidebar__entry-insert").hasClass("is-hidden")){
            setTimeout(function(){
                $(".sidebar__entry-insert").click();
            },500);
            setInterval(function(){
                if($(".sidebar__entry-delete").length>0 && !$(".sidebar__entry-delete").hasClass("is-hidden")){
                    window.opener = null;
                    window.open('', '_self');
                    window.close();
                }
            },100);
        }
    });
})();
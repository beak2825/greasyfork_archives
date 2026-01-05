// ==UserScript==
// @name         Shoutbox tag
// @version      1.666
// @description  Ameliorations de la shoutbox
// @author       volca780
// @include      */geek-academie.io/
// @include      */geek-academie.io/shoutbox/
// @run-at       document-end
// @grant        none
// @namespace    https://greasyfork.org/users/11697
// @downloadURL https://update.greasyfork.org/scripts/24778/Shoutbox%20tag.user.js
// @updateURL https://update.greasyfork.org/scripts/24778/Shoutbox%20tag.meta.js
// ==/UserScript==

$(document).ready(function(){
    var username = $("strong.accountUsername span").text();
    var REG = new RegExp("(@" + username + ")");

    setInterval(function(){
        $("#taigachat_box ol li").each(function(){
            var code = $(this).html();
            var code_parsed = REG.test(code);
            if(code_parsed){
                $(this).css({
                    "background-color": "#C0C0C0"
                });
                $(this).find(".fa").css({
                    "color": "#ffffff"
                });
            }
        });
    }, 1000);
});
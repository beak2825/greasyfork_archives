// ==UserScript==
// @name         tag Shoutbox 
// @version      1.4
// @description  Ameliorations de la shoutbox virtual gaming
// @author       Ryuk_
// @include      */virtual-gaming.fr/
// @include      */virtual-gaming.fr/shoutbox/
// @run-at       document-end
// @grant        none
// @namespace    https://greasyfork.org/fr/users/162945-ryuk
// @downloadURL https://update.greasyfork.org/scripts/36307/tag%20Shoutbox.user.js
// @updateURL https://update.greasyfork.org/scripts/36307/tag%20Shoutbox.meta.js
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
                    "background-color": "#e0e0e0"
                });
                $(this).find(".fa").css({
                    "color": "#ffffff"
                });
            }
        });
    }, 1000);
});
// ==UserScript==
// @name         DIDN'T ASK
// @description  SAVES SANDBOX
// @author       LUCIDRAINS (REAL AND TRUE)
// @match        https://epicmafia.com/*

// @version 0.2
// @namespace https://greasyfork.org/users/471468
// @downloadURL https://update.greasyfork.org/scripts/398974/DIDN%27T%20ASK.user.js
// @updateURL https://update.greasyfork.org/scripts/398974/DIDN%27T%20ASK.meta.js
// ==/UserScript==


//YOINKED FROM CRONED TY CRONED

setInterval(function() {scan();}, 10);
 
function scan() {
        
                $(".commentinfo a.tt").each(function() {
                        if ($(this).html().trim() == "d1pshit" || $(this).html().trim() == "unitard") {
                            $(this).parents(".comment").hide();
                        }
                });
               
                $(".postuser a.tt").each(function() {
                        if ($(this).html().trim() == "d1pshit" || $(this).html().trim() == "unitard") {
                            $(this).parents(".post").hide();
                        }
                });
               
                $("b.name").each(function() {
                        if ($(this).html().trim() == "d1pshit" || $(this).html().trim() == "unitard") {
                            $(this).parents(".talk").hide();
                        }
                });
        
}
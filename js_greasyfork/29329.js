// ==UserScript==
// @name         Pokemon asturk12
// @version      0.1
// @description  ...
// @author       Erthejosea
// @match        http://*.pokemon-vortex.com/*
// @match        http://*.pokemon-vortex.com/
// @grant        none
// @require http://code.jquery.com/jquery-1.8.3.js
// @namespace https://greasyfork.org/users/119418
// @downloadURL https://update.greasyfork.org/scripts/29329/Pokemon%20asturk12.user.js
// @updateURL https://update.greasyfork.org/scripts/29329/Pokemon%20asturk12.meta.js
// ==/UserScript==

$(function() {
    var bTimer = true;
    var hTimer = null;
    $(document).keyup(function(e) {
        if(e.which == 45) {
            setTimeout(function() {
                bTimer = true;
                console.log("Battle bot started !");
            }, 100);
        }
    });
    
     $(document).keyup(function(e) {
        if(e.which == 46) {
            setTimeout(function() {
                bTimer = false;
                console.log("Battle bot stoped !");
            }, 100);
        }
    });
    
    hTimer = setInterval(function() {
        if($("#ajax").html().indexOf("An error has occurred") != -1)
        {
            location.reload();
        }
        
        if(bTimer == true) {
            $("p").find("input").closest("form").submit();
            $("center").find("input").closest("form").submit();
            $('a[href="/battle.php?bid=110544"]').click(); // you can change your trainer from here with battle id. this is how we get battle IDS. today is end of 2016 it still works // if you want to train another type of pokemon then u have to find another trainer account. but now you know how to get battle id's.
        }
        else if(bTimer == false) {
            clearInterval(hTimer);
        }
    }, 1100); // this is your speed. if you make it lower(like 800) , it will be more speedful. but still it depends on your connection and servers answer.
});
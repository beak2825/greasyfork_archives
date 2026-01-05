// ==UserScript==
// @name         EngageMe.TV Flash Memory Protector
// @namespace    https://greasyfork.org/users/57063
// @version      0.1.6
// @description  Since Flash seems to eat up all the memory, this will proactively close the tab and open a new one - giving it a clean slate.
// @author       free21
// @match        http://engageme.tv/*
// @grant        window.close
// @grant        GM_setValue
// @grant        GM_getValue
// @require     http://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/25844/EngageMeTV%20Flash%20Memory%20Protector.user.js
// @updateURL https://update.greasyfork.org/scripts/25844/EngageMeTV%20Flash%20Memory%20Protector.meta.js
// ==/UserScript==

(function() {
    var countMe = GM_getValue('countMe', 25);
    var enCount = 0;
    jwplayer().on('adComplete', function(event){
        enCount++;
        console.log(enCount);
        if (enCount == countMe) {
            window.open(window.location.href);
            setTimeout(function() {  window.close();  }, 1000);
        }
    });
    $('<span style="border: 1px solid #d83a3d;padding: 5px;" title="Set this to the number of ads you want to see before the tab resets to clear memory."><input type="number" style="line-height:1px; width:50px;" size="3" id="countMe" value="" />?</span>').insertBefore('.category-holder');
    $("#countMe").val(countMe);
    $("#countMe").change(function() {
        GM_setValue('countMe', $("#countMe").val());
        if (enCount > countMe) { setTimeout(function() { location.reload();  }, 2000); $('#countMe').html('Resetting'); }
        countMe = $("#countMe").val();
    });
})();
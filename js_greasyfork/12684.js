// ==UserScript==
// @name        Hide BPL Trolls
// @namespace   ffmike
// @description Hide forum postings from particular users on BPL
// @include     http://www.backpackinglight.com/cgi-bin/backpackinglight/forums/*
// @version     1
// @domain      www.backpackinglight.com
// @license        CC0 1.0; https://creativecommons.org/publicdomain/zero/1.0/
// @downloadURL https://update.greasyfork.org/scripts/12684/Hide%20BPL%20Trolls.user.js
// @updateURL https://update.greasyfork.org/scripts/12684/Hide%20BPL%20Trolls.meta.js
// ==/UserScript==

// Shamelessly based on https://greasyfork.org/en/scripts/48-maximumpc-troll-remover/code
$(function () {
    console.log('Hiding trolls');
    var joList = ["TipiWalter",
                  "rosyfinch",
                 ];
    
    var joLength = joList.length;
    var numJoComments = 0;
                  
    var thisJo, userName, ref;
        
    // Rinse and repeat
    $("a").each(function(index, value) 
    {
        ref = value.href;
                  console.log(ref);
        
        userName = ref.substring(ref.lastIndexOf("?") + 3);
        for(var i=0; i<joLength; i++) 
        {
            if(userName == joList[i])
            {
                $(this).closest('table.thread_post').hide();
                break;
            }
        }
     });

});

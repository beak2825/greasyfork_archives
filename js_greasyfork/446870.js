// ==UserScript==
// @name         YoutubeSearchBullshitRemover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license hughgrunt
// @description  this removes stuff from youtube search
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446870/YoutubeSearchBullshitRemover.user.js
// @updateURL https://update.greasyfork.org/scripts/446870/YoutubeSearchBullshitRemover.meta.js
// ==/UserScript==



(function() {
    'use strict';
    // Your code here...
    var forbidden = ["Elon Musk Zone", "Tech Space", "DB Business", "Tesla Owners Silicon Valley", "Infowealth", "TESLA CAR WORLD", "Tesla Fans"];

    function RemoveElonMusk()
    {
        if (! window.location.href.startsWith("https://www.youtube.com/results"))
        {
            return;
        }

        var shelfs = document.getElementsByTagName("ytd-video-renderer");
        //window.alert("got all shelfs");
        for (var i = 0; i < shelfs.length; i++)
        {
            var s1 = shelfs[i].getElementsByTagName("ytd-channel-name");

            for(var h = 0; h < 1; h++)
            {
                 var s2 = s1[h].getElementsByTagName("yt-formatted-string");

                for(var k = 0; k < 1; k++)
                {
                    var s3 = s2[k].getElementsByTagName("a");
                   for(var a =0; a<1;a++)
                    {
                        for (var e = 0; e<forbidden.length; e++)
                        {
                            if(forbidden[e] == s3[a].innerHTML)
                            {
                                shelfs[i].remove();
                            }
                        }
                    }
                }


            }
            //
        }

    }

    cleanup();
    setInterval(function () { RemoveElonMusk();}, 1000);
})();

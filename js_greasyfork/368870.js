// ==UserScript==
// @name         Twitch Rerun/Vodcast Remove
// @namespace    https://greasyfork.org/en/users/162009-delmain
// @version      0.2.0
// @description  Remove Vodcasts and Reruns from following page
// @author       Delmain, based on work by Max Brown
// @include      *://www.twitch.tv/*
// @include      *://go.twitch.tv/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/368870/Twitch%20RerunVodcast%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/368870/Twitch%20RerunVodcast%20Remove.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
       removeAll();

        $(window).bind('popstate', function() {
            setTimeout(removeAll, 20);
        });
    });
})();

function removeAll() {
    console.log('Attempting to remove vodcasts and miniplayers...');
    var maxTry = 50; // 5 secounds
    var i = 0;
    var inVal = setInterval(function() {
        removeMain();
        removeSC();
        //removeMiniPlayer();
        if (i == maxTry) {
            clearInterval(inVal);
        }
        i++;
    }, 100);
}

function removeMain() {
     if ($(".pill").length) {
         $(".pill").each(function(i,v) {
             if ($(v).text().toLowerCase() == "vodcast") {
                 $(v).parent().parent().parent().parent().parent().remove();
             }
         });
     }
    if ($(".tw-pill").length) {
        $(".tw-pill").each(function(i,v) {
            if ($(v).text().toLowerCase() == "vodcast") {
                $(v).parent().parent().parent().parent().parent().parent().parent().remove();
            }
        });
    }
    if($(".stream-type-indicator--rerun").length) {
        $('.stream-type-indicator--rerun').each(function(i,v) {
            $(v).parent().parent().parent().parent().parent().parent().parent().remove();
        });
    }
}

function removeSC() {
    var scContainer = $("sc-channels__live");
    if ($(scContainer).length && $(scContainer).children().length) {
     $($0).find('[data-tooltip-text="Vodcast"]').each(function(i,v) {
         $(this).remove();
     });
    }
}

function removeMiniPlayer() {
    $('[data-test-selector="persistent-player-mini-dismiss"] > span').click();
}
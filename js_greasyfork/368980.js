// ==UserScript==
// @name         Stalk Arrival
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  try to take over the world!
// @author       You
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/368980/Stalk%20Arrival.user.js
// @updateURL https://update.greasyfork.org/scripts/368980/Stalk%20Arrival.meta.js
// ==/UserScript==

// ENTER YOUR API KEY HERE:
// var APIkey = "UXsiS3W2PcK4zDcw";
var APIkey = "";

// SECONDS BETWEEN REFRESH:
var seconds = 1;

/*
 * LIBRARIES
 */

// Check if current tab is active
var myInterval, hid = "visible";
var mseconds = seconds*1000;
var StInterval, Stalking = 0;
(function() {
    var hidden = "hidden";

    // Standards:
    if (hidden in document)
        document.addEventListener("visibilitychange", onchange);
    else if ((hidden = "mozHidden") in document)
        document.addEventListener("mozvisibilitychange", onchange);
    else if ((hidden = "webkitHidden") in document)
        document.addEventListener("webkitvisibilitychange", onchange);
    else if ((hidden = "msHidden") in document)
        document.addEventListener("msvisibilitychange", onchange);
    // IE 9 and lower:
    else if ('onfocusin' in document)
        document.onfocusin = document.onfocusout = onchange;
    // All others:
    else
        window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;

    function onchange (evt) {
        var v = 'visible', h = 'hidden',
            evtMap = {
                focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
            };

        evt = evt || window.event;
        if (evt.type in evtMap)
            hid = evtMap[evt.type];
        else
            hid = this[hidden] ? "hidden" : "visible";

        if(hid == "visible") {
            if(Stalking == 1) {
                StInterval = setInterval(StProfile,mseconds);
            }
        }
        else {
            clearInterval(StInterval);
        }
    }
})();

/*
 * LIBRARIES END
 */

// Find Profile ID.
var checkProfile, profileID, currenturl = location.href;
var Stplayer = GM_getValue ("Stplayer", "");
var notyet = 0

function yesProfile() {
    if($(".description").length == 1) {
        clearInterval(checkProfile);
        if($(".like-this-player").length == 0) {
            $(".facebook-cont").html('<div class="like-this-player" style="line-height:'+ $(".facebook-cont").css("height") +';cursor:pointer;">Stalk this player.</div>');
        }
        else {
            $(".like-this-player").text("Stalk this player.");
            $(".like-this-player").css("cursor", "pointer");
        }
        $(".like-this-player").one('click', function() {
            $(".like-this-player").text("Processing...");
            var verdict, playerUrl = "https://api.torn.com/user/"+ profileID + "?selections=profile&key=" + APIkey;
            $.getJSON(playerUrl).done(function(data) {
                try {
                    var pStatus = data.status[0];
                    if(pStatus.startsWith("Traveling to ")) {
                        GM_setValue ("Stplayer", String(profileID));
                        verdict = "Stalking commenced";
                        Stplayer = String(profileID);
                        Stalking = 1;
                        StInterval = setInterval(StProfile,mseconds);
                    } else {
                        verdict = "Failed. Not flying?";
                    }
                } catch(ex) {
                    verdict = "Failed. Wrong API key?";
                    console.log(ex);
                }
            }).fail(function() {
                verdict = "Failed. Slow Internet?";
            }).always(function() {
                $(".like-this-player").text(verdict);
            });
        });
    }
}

if(currenturl.startsWith("https://www.torn.com/profiles.php?XID=")) {
    var currentUrl = new URL(currenturl);
    profileID = currentUrl.searchParams.get("XID");
    console.log(profileID);
    $(window).load(function() {
        checkProfile = setInterval(yesProfile,mseconds)
    });
}

function StProfile() {
    //https://www.torn.com/loader.php?sid=attack&user2ID=
    var playerUrl = "https://api.torn.com/user/"+ Stplayer + "?selections=profile&key=" + APIkey;
    if(notyet == 0) {
        notyet = 1;
        $.getJSON(playerUrl).done(function(data) {
            try {
                var pStatus = data.status[0];
                if(pStatus.startsWith("In ")) {
                    GM_setValue ("Stplayer", "nine");
                    location.href = "https://www.torn.com/loader.php?sid=attack&user2ID=" + Stplayer;
                }
            } catch(ex) {
                console.log(ex);
                clearInterval(StInterval);
                GM_setValue ("Stplayer", "none");
            }
        }).fail(function() {
            console.log("API request failed to go through. What's wrong?");
        }).always(function() {
            notyet = 0;
        });
    }
}

if ( ! Stplayer) {
    GM_setValue ("Stplayer", "none");
    Stplayer = "none";
}
if(Stplayer == "nine") {
    GM_setValue ("Stplayer", "none");
    Stplayer = "none";
    $("body").css("background", "red");
}
else if(Stplayer != "none") {
    Stalking = 1;
    StInterval = setInterval(StProfile,mseconds);
}
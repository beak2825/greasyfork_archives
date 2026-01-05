// ==UserScript==
// @name        Personal YouTube Tweaks
// @description Speed up videos, lower music volume and don't switch to Share tab.
// @include     *://www.youtube.com/watch?*
// @version     3.0.29
// @author      ForgottenUmbrella, EdLolington2
// @namespace   https://greasyfork.org/users/83187
// @downloadURL https://update.greasyfork.org/scripts/25168/Personal%20YouTube%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/25168/Personal%20YouTube%20Tweaks.meta.js
// ==/UserScript==

// CHANG'E LOG (are you watching?):
// * Call adjustForMusic on non-Polymer YouTube as well
// * Delete some non-functioning comments
// * Pass forgotten parameters to adjustForMusic in event handlers
// * Rename asyncSetQuality to setQuality

const WAIT = 1000;
const BANNER = "(YT Tweaks)"
const isPolymer = !document.getElementsByClassName("eow-title").length;

// Modified from http://userscripts-mirror.org/scripts/review/174719.
function shareButtonToggle(shareButton)
{
    "use strict";
    shareButton.setAttribute("data-trigger-for", "action-panel-share");
    window.setTimeout(
        shareButton.setAttribute, 5000, "data-trigger-for", "blank"
    );
}

// Also modified from the above source.
function disableShareOnLike()
{
    "use strict";
    let panelButtons = (
        function()
        {
            let result = [];
            let buttons = document.getElementsByTagName("button");
            for (let button of buttons)
            {
                if (button.className.indexOf("action-panel-trigger") != -1)
                {
                    result.push(button);
                }
            }
            return result;
        }
    )();
    for (let button of panelButtons)
    {
        const dataTrigger = button.getAttribute("data-trigger-for");
        if (dataTrigger == "action-panel-share")
        {
            let shareButton = button;
            shareButton.setAttribute("data-trigger-for", "blank");
            shareButton.addEventListener(
                "click", () => shareButtonToggle(shareButton), false
            );
        }
    }
}

function inString(text, label="")
{
    function inner(trigger)
    {
        const match = (text.indexOf(trigger) > -1);
        if (match)
        {
            console.log(`${BANNER} ${label} trigger:`, trigger);
        }
        return match;
    }
    return inner;
}

function getTitle()
{
    "use strict";
    let title;
    // FIXME: `titleElements` is undefined.
    if (isPolymer)
    {
        const titleElements = document.getElementsByClassName("title");
        console.log(`${BANNER} titleElements =`, titleElements);
        title = titleElements[0].innerText.toLowerCase();
    }
    else
    {
        console.log(`${BANNER} title not Polymer`);
        title = document.getElementsByClassName("eow-title")[0]
            .innerText.toLowerCase();
    }
    return title;
}

// FIXME: `channelElement` is undefined.
function getChannel()
{
    "use strict";
    let channel;
    if (isPolymer)
    {
        const channelElement = document.getElementById("owner-name");
        console.log(`${BANNER} channelElement =`, channelElement);
        channel = channelElement.innerText.toLowerCase();
    }
    else
    {
        channel = document.getElementsByClassName("yt-user-info")[0]
            .innerText.toLowerCase();
    }
    return channel;
}

// Change audio, speed and quality for videos presumed to be music.
function adjustForMusic(player)
{
    "use strict";
    console.log(`${BANNER} isPolymer =`, isPolymer);
    const title = getTitle();
    console.log(`${BANNER} title =`, title);
    const channel = getChannel();
    console.log(`${BANNER} channel =`, channel);
    const inTitle = inString(title, "Title");
    const inChannelName = inString(channel, "Channel");

    const JAPANESE = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;
    const MUSIC_TERMS = [
        JAPANESE, "midi", "touhou", "music", "piano", "vocal", "arrange",
        "theme",  "album", "toho", /feat\./, /.* - .*/, "soundtrack",
        /.* ~ .*/, /(^|[^a-z])cover/, "song", /(^|[^a-z])op/, /(^|[^a-z])ep/,
        "remix", "arrangement", /(^|[^a-z])c[0-9][0-9]/, "pv"
        // /('s|[1-6]|stage) theme/
    ];
    const NOT_MUSIC_TERMS = [
        "play", /(^|[^a-z])ep [0-9]/, "stream", "minecraft", "dlc", "games",
        "online", "episode", /part [0-9]/, /episode [0-9]/,
        "1cc", /(^|[^a-z])clear/, /#[0-9]/, "no miss", "no bomb", "scoring",
        "gmod", "spellcard", "nmnb", "no deaths"
    ];
    const CHANNEL_BLACKLIST = [
        "sips", "yogscast", "mamamax", "computerphile", "numberphile",
        "pewdiepie", "nakateleeli", "magiftw", "sixty symbols"
    ];

    const isMusic = (
        MUSIC_TERMS.some(inTitle)
        && !NOT_MUSIC_TERMS.some(inTitle)
        && !CHANNEL_BLACKLIST.some(inChannelName)
    );
    if (isMusic)
    {
        player.setVolume(25);
        console.log(`${BANNER} Set volume to 25`);
    }
    else
    {
        player.setVolume(100);
        player.setPlaybackRate(2);
        console.log(`${BANNER} Set volume to 100 and rate to 2`);
    }
    console.log(`${BANNER} adjustForMusic complete`);
}

// function setQuality(player, quality)
// {
//     if (player.getPlayerState() > -1)
//     {
//         player.setPlaybackQuality(quality);
//     }
//     else
//     {
//         window.setTimeout(setQuality, WAIT, player, quality);
//     }
// }

(function()
{
    "use strict";
    console.log(`${BANNER} Script running`);
    if (!isPolymer)
    {
        disableShareOnLike();
        console.log(`${BANNER} Disabled auto-share`);
    }
    let player = document.getElementById("movie_player");
    function playerAdjustForMusic()
    {
        adjustForMusic(player);
    }
    if (isPolymer)
    {
        window.addEventListener("polymer-ready", playerAdjustForMusic);
        window.addEventListener("WebComponentsReady", playerAdjustForMusic);
        document.addEventListener(
            "dom-change", playerAdjustForMusic, { once: true }
        );
    }
    else
    {
        playerAdjustForMusic();
    }
    // setQuality(player, "medium");
})();

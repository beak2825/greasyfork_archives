// ==UserScript==
// @name         -Classy Premium Spell Scanner
// @version      1.8
// @description  Scans through backpack.tf premium search pages with ctrl+leftarrow and ctrl+rightarrow. The scanning stops when a spelled item appears on page. Ctrl + down arrow to force stop.
// @author       Emily
// @match        *backpack.tf/premium/search*
// @namespace https://greasyfork.org/users/470267
// @downloadURL https://update.greasyfork.org/scripts/398835/-Classy%20Premium%20Spell%20Scanner.user.js
// @updateURL https://update.greasyfork.org/scripts/398835/-Classy%20Premium%20Spell%20Scanner.meta.js
// ==/UserScript==

// CONFIG
var notificationSoundEnabled = true;
var notificationSoundVolume = 0.75; // Ranges from 0.0 to 1.0
var notificationSoundSource = "https://notificationsounds.com/soundfiles/99c5e07b4d5de9d18c350cdf64c5aa3d/file-sounds-1110-stairs.mp3";
var matchNotificationSoundSource = notificationSoundSource;
var endNotificationSoundSource = "https://notificationsounds.com/soundfiles/0fcbc61acd0479dc77e3cccc0f5ffca7/file-sounds-1078-case-closed.mp3";

const SEARCH_MODE = {
    SPELLS: "Spells",
    GIFTS: "Gifts"
}

///////////////////////////////////////////////////////////////////////////
// CONFIGURATION PARAMETERS
///////////////////////////////////////////////////////////////////////////

// Any spell names here will be ignored by the scanner
var spellBlackList = ["Voices From Below","Exorcism"];

// If any spells are named here, they will be the only ones to appear. (Overrides spellBlackList)
var spellWhiteList = [];

// Item Name Keywords: A list of keywords that the script will attempt to match for every item
// Items who match at least 1 keyword will be returned
var titleKeywords = ["Collector's"];

// The list of player IDs to search against when looking for items that have been gifted by said person
var gifted_steam_id_3 = [
    "84024852",      // (yomps)
    "31470213",      // (clockwork)
    "75446306",      // (Slemnish)
    "23599968",      // (TLR)
    "103786523",     // (Thalash)
    "25560164",      // (Shade)
    "33652944",      // (enigma)
    "20958739",      // (lanskey)
    "86661000",      // (paddie)
    "115334142",     // (Thaigrr)
    "45763865",      // (shrugger)
    "909021495"      // (sin_k4rma)
];

// determines whether we want the script to output items that match our gift filter or out spell filter
var search_mode = SEARCH_MODE.GIFTS;

///////////////////////////////////////////////////////////////////////////
// OTHER SHIT
///////////////////////////////////////////////////////////////////////////

/*
How long to pause for before loading another page during a search (in ms).
WARNING: Low values may cause too many requests to be sent to backpack.tf over a period of time. Use lower values at your own risk.
*/
var searchDelay = 750;

var searchState = getCookie("searchState"); // -1 when searching by going backwards, 0 when staying still, 1 when searching forwards
var notificationPlayer = document.createElement('audio'); // Used for notification sounds

if(searchState == 0)
{
    console.log("Read Search Cookie as 0");
}

setup();
run();

///////////////////////////////////////////////////////////////////////////
// EVEN MORE OTHER SHIT
///////////////////////////////////////////////////////////////////////////

function get_page_number() {
    if(!window.location.href.includes("page"))
    {
        return 1;
    }
    else
    {
        return parseInt(window.location.href.slice(window.location.href.indexOf("page") + "page".length + 1, window.location.href.indexOf("&")));
    }
}

function create_page_url(page_no) {

    var prefix, page_url, suffix;
    // need to inject the page into the URL
    if(!window.location.href.includes("page"))
    {
        prefix = window.location.href.slice(0, window.location.href.indexOf("?") + 1);
        page_url = "page=" + page_no + "&";
        suffix = window.location.href.slice(window.location.href.indexOf("?") + 1, window.location.href.length);

        return prefix + page_url + suffix;
    }
    // simply modify the existing url page_no
    else
    {
       prefix = window.location.href.slice(0, window.location.href.indexOf("page"));
       page_url = "page=" + page_no;
       suffix = window.location.href.slice(window.location.href.indexOf("&"), window.location.href.length);

       return prefix + page_url + suffix;
    }
}

function setup() {
    notificationPlayer.src = notificationSoundSource;
    notificationPlayer.preload = 'auto';
    notificationPlayer.volume = notificationSoundVolume;

    if(titleKeywords.length != 0)
    {
        checkKeywords();
    }

    // Stops scanning if spells are found
    if (itemFoundOnPage()) {
        console.log("Spell found, stopping search");
        searchState = 0;
    }

    // Stops scanning if on first or last page
    if (onFirstOrLastPage()) {
        console.log("On an end page, stopping search");
        playNotificationSound(endNotificationSoundSource);
        searchState = 0;
    }
}

function run() {
    if (searchState == -1) {
        setTimeout(function() {
            openPreviousPage();
        }, searchDelay);
    }
    else if (searchState == 1) {
        setTimeout(function() {
            openNextPage();
        }, searchDelay);
    }
    else if (searchState === 0) {
        saveCookie("searchState",0,0.15);
    }
}

// Determines if the first or last page is loaded.
function onFirstOrLastPage() {
    // check if page is in the url
    var on_first_page = get_page_number() == 1;
    var on_error_page = document.getElementsByClassName("alert alert-info").length != 0;

    return on_first_page || on_error_page;
}

function playNotificationSound(src) {
    notificationPlayer.src = src;
    if (notificationSoundEnabled) notificationPlayer.play();
}


// Cookies are used for saving and loading searchState between page loads in this script.

// Saves a cookie under backpack.tf
function saveCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));

    console.log(cname + '=' + cvalue + ' [' + d.toLocaleTimeString() + ']');

    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Loads a cookie from under backpack.tf
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return parseInt(c.substring(name.length, c.length));
        }
    }
    return 0;
}

function openNextPage() {
    window.location.href = create_page_url(get_page_number() + 1);
}

function openPreviousPage() {
    window.location.href = create_page_url(get_page_number() - 1);
}

// Checks for any non-blacklisted spelled items on the current page.
function itemFoundOnPage() {
    // for playing notification sound
    var itemFound = false;

    // XPATH to list of items
    var rows = document.evaluate(
        "/html/body/main/div/div[1]/div/div/ul/li",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);

    // Iterate over every potential Item
    for(var i = 0; i < rows.snapshotLength; i++) {
        ////////////////////////////////////////////////////
        //  CHECK FOR SPELLS
        ////////////////////////////////////////////////////

        var thisRow = rows.snapshotItem(i);

        // to indicate to retrive user profile
        var is_spelled = false;
        var spell1 = "";
        var spell2 = "";
        var gifter_name = "";
        var gifter_id = "";

        // Checks for first spell
        if(search_mode == SEARCH_MODE.SPELLS && thisRow.hasAttribute("data-spell_1")){
            spell1 = thisRow.getAttribute("data-spell_1");

            // Checks for whitelist match - Only applies if whitelist isn't empty
            if (spellWhiteList.length > 0) {
                if (whiteListMatch(spell1) === true) {
                    itemFound = true;
                    is_spelled = true;
                }
            }
            else if (blackListMatch(spell1) === false) {
                itemFound = true;
                is_spelled = true;
            }
        }

        // Checks for second spell
        if (search_mode == SEARCH_MODE.SPELLS && thisRow.hasAttribute("data-spell_2")) {
            spell2 = thisRow.getAttribute("data-spell_2");

            // Checks for whitelist match - Only applies if whitelist isn't empty
            if (spellWhiteList.length > 0) {
                if (whiteListMatch(spell2) === true) {
                    itemFound = true;
                    is_spelled = true;
                }
            }
            else if (blackListMatch(spell2) === false){
                itemFound = true;
                is_spelled = true;
            }
        }

        // check if this item was gifted by any
        if(search_mode == SEARCH_MODE.GIFTS) {
            for(var j =0; j < gifted_steam_id_3.length; j++) {
               if(thisRow.hasAttribute("data-gifted_id")) {
                   if(thisRow.getAttribute("data-gifted_id") == gifted_steam_id_3[j]) {
                       gifter_name = thisRow.getAttribute("data-gifted_name");
                       gifter_id = thisRow.getAttribute("data-gifted_id");
                       itemFound = true;
                       is_spelled = true;
                       break;
                   }
               }
            }
        }

        if (is_spelled)
        {
            // print out the user information
            var owners = document.getElementsByClassName("owners")[i];
            var current_owner = owners.getElementsByClassName("owner")[0].getElementsByClassName("user-handle")[0].getElementsByTagName("a")[0];

            var description = document.getElementsByClassName("description")[i];
            var button = description.getElementsByClassName("btn")[1];
            var item_link = button.getAttribute("href");

            var divider = '='.repeat(30);
            var header = divider + ' ' + get_page_number() + ' ' + divider;

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            console.log(header);
            thisRow.getAttribute('title');
            console.log('='.repeat(header.length));

            // change the logging gdepending on the search mode
            if(search_mode == SEARCH_MODE.GIFTS)
            {
                console.log('current name: ' + gifter_name);
                console.log('STEAM3ID: U:1:' + gifter_id);
            }
            else {
                console.log('[1] ' + spell1);
                console.log('[2] ' + spell2);
            }

            console.log(" Item URL:  https://backpack.tf" + item_link);
            console.log(" Owner URL [" + current_owner.getAttribute("data-name") + "]: https://backpack.tf" + current_owner.getAttribute("href"));

            console.log('/'.repeat(header.length));

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    }
    if (itemFound)
    {
        playNotificationSound(notificationSoundSource);
    }
    return false;
}

function checkKeywords() {
    // for playing a notification sound
    var foundMatch = false;

    // XPATH to list of items titles
    var rows = document.evaluate(
        "/html/body/main/div/div[1]/div/div/ul/li",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);

    for(var i = 0; i < rows.snapshotLength; i++)
    {
        // snapshot this item
        var thisRow = rows.snapshotItem(i);

        // store a flag for detecting a match
        var matches = false;
        var keyword_match = "";

        // check every keyword
        for(var j = 0; j < titleKeywords.length; j++)
        {
            // check for a matching substring
            if(
                thisRow.getAttribute('title').toUpperCase()
                    .search(titleKeywords[j].toUpperCase())
                    != -1
            ) {
                // update the flags, store the keyword for logging, and stop search
                matches = true;
                foundMatch = true;
                keyword_match = titleKeywords[j].toUpperCase();
                break;
            }
        }

        if (matches)
        {
            // print out the user information
            var owners = document.getElementsByClassName("owners")[i];
            var current_owner = owners.getElementsByClassName("owner")[0].getElementsByClassName("user-handle")[0].getElementsByTagName("a")[0];

            var description = document.getElementsByClassName("description")[i];
            var button = description.getElementsByClassName("btn")[1];
            var item_link = button.getAttribute("href");

            var divider = '='.repeat(30);
            var header = divider + ' ' + get_page_number() + ' ' + divider;

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            console.log(header);
            console.log(thisRow.getAttribute('title'));
            console.log('='.repeat(header.length));

            console.log(" Keyword: " + keyword_match);
            console.log(" Item URL:  https://backpack.tf" + item_link);
            console.log(" Owner URL [" + current_owner.getAttribute("data-name") + "]: https://backpack.tf" + current_owner.getAttribute("href"));

            console.log('/'.repeat(header.length));

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    }

    // handle notification sending
    if(foundMatch)
    {
        playNotificationSound(matchNotificationSoundSource);
    }

}

// Determines if dataSpellAttribute contains a blacklisted spell from spellBlackList
function blackListMatch(dataSpellAttribute) {
    for (var i = 0; i < spellBlackList.length; i++) {
        if (dataSpellAttribute.search(spellBlackList[i]) != -1) {
            //console.log("Blacklist match found");
            return true;
        }
    }
    return false;
}

// Determines if dataSpellAttribute contains a whitelisted spell from spellWhiteList
function whiteListMatch(dataSpellAttribute) {
    for (var i = 0; i < spellWhiteList.length; i++) {
        if (dataSpellAttribute.search(spellWhiteList[i]) != -1) {
            //console.log("Whitelist match found");
            return true;
        }
    }
    return false;
}

// Handles keyboard inputs
window.onkeydown = function(e) {

    if (e.ctrlKey) {
        if (e.keyCode == 40) { // Ctrl + down arrow
            searchState = 0;
            saveCookie("searchState",0,0.1);
            console.log("Stopping script");
            run();
        }

        if (e.keyCode == 37) { // Ctrl + left arrow
            searchState = -1;
            saveCookie("searchState",-1,0.1);
            console.log("Running in reverse");
            run();
        }

        if (e.keyCode == 39) { // Ctrl + right arrow
            searchState = 1;
            saveCookie("searchState",1,0.3);
            console.log("Running forwards");
            run();
        }
    }
};
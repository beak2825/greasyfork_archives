// ==UserScript==
// @name         Destiny 2 "Find Fireteam" improvements
// @namespace    D2FFI
// @version      1.204
// @description  Fixes some poor design choices on the Destiny 2 "Find Fireteam" page and filters out spam
// @author       Richard "mindphlux" Kämmerer
// @match        https://www.bungie.net/en/ClanV2/FireteamSearch*
// @match        https://www.bungie.net/en/ClanV2/PublicFireteam*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bungie.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456884/Destiny%202%20%22Find%20Fireteam%22%20improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/456884/Destiny%202%20%22Find%20Fireteam%22%20improvements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var clanAdverts = /КЛАН|клан|reclut[a|o|iamo]|recherche|recrute|recruit[e|ing|ment]|buscamo[s]|suche/;
    var spamStrings = /[carry|help]-d2|[fast\-|my]carry|d2[xur|\-sherpa]|game-job|sky[gold|coach]|trialsnow/;
    var defaultTitle = /(.*)\/\/(.*)/;

    var platformSelect = document.querySelector('select[name=platform]');
    var activitySelect = document.querySelector('select[name=activityType]');
    var languageSelect = document.querySelector('select[name=lang]');
    var disabled = document.querySelector('h2[class=section-header]');

    // we need to check which page the user is on so we can disable/enable features and prevent errors

    var currentPage = "";

    if(/FireteamSearch/.test(window.location.href)) {
        currentPage = "search";
    }
    else if(/PublicFireteam/.test(window.location.href)) {
        currentPage = "fireteam";
    }

    // if the API has been disabled (again) we'll display the @BungieHelp twitter feed so the user
    // can check what's going on instead of just seeing a mostly blank page
    // this only works on the Fireteam search page so we'll just return on any other page

    if(currentPage == "search") {
        if(disabled != null && disabled.innerHTML == "This feature is currently disabled.") {
            var disabledParent = disabled.closest('div');

            var twitterScript = document.createElement('script');
            twitterScript.type = 'text/javascript';
            twitterScript.src = 'https://platform.twitter.com/widgets.js';
            document.head.appendChild(twitterScript);

            var twitterEmbed = document.createElement('a');
            twitterEmbed.classList.add('twitter-timeline');
            twitterEmbed.dataset.theme = 'dark';
            twitterEmbed.href = 'https://twitter.com/BungieHelp?ref_src=twsrc%5Etfw';
            disabledParent.appendChild(twitterEmbed);

            return;
        }
    }
    else if(currentPage == "") return;

    var activities = {
        0: "Anything",
        2: "Crucible",
        3: "Trials of Osiris",
        4: "Nightfall",
        5: "Up For Anything",
        6: "Gambit",
        7: "Blind Well",
        12: "Nightmare Hunt",
        14: "Altar of Sorrow",
        20: "Raid: Last Wish",
        21: "Raid: Garden of Salvation",
        22: "Raid: Deep Stone Crypt",
        23: "Exo Challenge",
        25: "Empire Hunt",
        27: "Exotic Quest",
        28: "Raid: Vault of Glass",
        33: "Dungeon: Shattered Throne",
        34: "Dungeon: Prophecy",
        35: "Dungeon: Pit of Heresy",
        36: "Dares of Eternity",
        37: "Dungeon: Grasp of Avarice",
        38: "Raid: Vow of the Disciple",
        39: "Campaign",
        40: "The Wellspring",
        41: "S16: Battlegrounds",
        43: "Dungeon: Duality",
        44: "S17: Nightmare Containment",
        45: "S17: Sever",
        47: "S18: Ketchcrash",
        48: "S18: Expedition",
        49: "S18: Pirate Hideout",
        50: "Raid: King's Fall",
        51: "Battlegrounds",
        52: "Dungeon: Spire of the Watcher",
        53: "S19: Operations",
        54: "Looking For Help",
        55: "Keep It Chill",
    };

    // remove Bungie advert and replace it with a warning about being not logged in if that's the case
    // since dynamically set body classes aren't available at script runtime we're checking cookies

    var cookies = document.cookie.split(";");

    var isLoggedIn = false;

    cookies.forEach((item) => {
        if(item.trim().startsWith("bunglesight")) isLoggedIn = true;
    });

    // only needed for Fireteam search page
    if(currentPage == "search") {
        if(isLoggedIn) {
            document.querySelector('.promo').remove();
        }
        else {
            document.querySelector('.promo').innerHTML = '<strong><span style="color:red">You must be logged in to use Fireteam Search!</span></strong>';
        }
    }

    // to prevent the browser from entering an endless loop of page reloads we're using a hash to see if we already reloaded

    function ReloadPage(page) {
        if(window.location.hash == page || window.location.hash == null) return;
        location.href = "https://www.bungie.net/en/ClanV2/FireteamSearch?platform=" +
            platformSelect[platformSelect.selectedIndex].value +
            "&activityType=" +
            activitySelect[activitySelect.selectedIndex].value +
            "&lang=" + languageSelect[languageSelect.selectedIndex].value +
            "#" +
            page;
    }

    // reroute dropdowns to our own function so the userscript still works after using the select boxes
    // only needed on Fireteam search page

    if(currentPage == "search") {

        platformSelect.onchange = (e) => {
            e.preventDefault();
            e.stopPropagation();
            ReloadPage("platform");
        }

        activitySelect.onchange = (e) => {
            e.preventDefault();
            e.stopPropagation();
            ReloadPage("activity");
        }

        languageSelect.onchange = (e) => {
            e.preventDefault();
            e.stopPropagation();
            ReloadPage("language");
        }
    }

    // add textual description of the activity 
    // so people who can't remember dozens of icons can actually understand what's going on

    if(currentPage == "search") {

        // Fireteam search page
        var lis = document.getElementById('clansList').querySelectorAll('li');
        lis.forEach((item, index) => {
            var activityId = item.querySelector('.activity-icon').getAttribute('data-activity');
            var title = item.querySelector('.title');

            // removes the post if it's spam or a clan ad
            if(spamStrings.test(title.innerHTML.toLowerCase()) || clanAdverts.test(title.innerHTML.toLowerCase())) {
                item.remove();
                return;
            }

            // remove the original post title if it was left blank (which is then replaced by Bungie with the same info we already added)
            var newTitle = (activities[activityId] != null ? activities[activityId] : "N/A");
            if(!defaultTitle.test(title.innerHTML)) {
                newTitle += " | " + title.innerHTML;
            }

            title.innerHTML = newTitle;
        });
    }
    else if(currentPage == "fireteam")
    {

        // Fireteam page
        var activityId = document.querySelector('span[class=activity-icon]').getAttribute('data-activity');
        var title = document.querySelector('h2[class=section-header]');

        // remove the original title if it was left blank (which is then replaced by Bungie with the same info we already added)
        var newTitle = (activities[activityId] != null ? activities[activityId] : "N/A");
        if(!defaultTitle.test(title.innerHTML)) {
            newTitle += " | " + title.innerHTML;
        }

        // for the sake of consistency let's also change the window title accordingly
        title.innerHTML = newTitle;
        document.title = newTitle + " | Bungie.net";
    }

})();
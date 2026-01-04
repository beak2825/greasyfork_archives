// ==UserScript==
// @name         Fanfiction.net - Beautify Status Scrolling For Dark Reader
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Changes colors and formats stats to make it easier to read while scrolling, works on android. "Fiction Rating: All" as default, blacklist included.
// @author       バカなやつ
// @license      MIT
// @match        *://*.fanfiction.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fanfiction.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/448126/Fanfictionnet%20-%20Beautify%20Status%20Scrolling%20For%20Dark%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/448126/Fanfictionnet%20-%20Beautify%20Status%20Scrolling%20For%20Dark%20Reader.meta.js
// ==/UserScript==
GM_addStyle(".title {color:#04AD5C;}");
GM_addStyle(".chapters {color:#FFC300;}");
GM_addStyle(".words {color:#FFC0CB;}");
GM_addStyle(".reviews {color:#CC5500;}");
GM_addStyle(".favs {color:#C4FFCA;}");
GM_addStyle(".follows {color:#C4FFCA;}");
GM_addStyle(".others {color:#C4FFCA;}");

GM_addStyle(".z-indent {padding-left: 60px;}");
GM_addStyle(".reviews {color: rgb(255, 102, 26); text-decoration-color: initial;}");
(function () {
    'use strict';

    // const blacklist_fandoms = ["Hobbit", "Percy", "Naruto", "Harry", "Doctor Who", "Crossover - Star Wars", "Yu-Gi-Oh", "Merlin", "Hunter X Hunter", "Inuyasha"];
    const blacklist_fandoms = [];
    // Makes "Fiction Rating: All" default the first time you enter a story listing page!
    const allRatings = true;

    const URL = document.URL;
    // PC
    const isReadingPage = URL.includes("fanfiction.net/s/");
    const isCommunityPage = URL.includes("fanfiction.net/community/");
    const communities = ["anime", "book", "cartoon", "comic", "game", "misc", "play", "movie", "tv"];
    const isStoriesPage = communities.some(v => URL.includes("fanfiction.net/" + v));
    const isCrossoverPage = URL.includes("Crossovers/");
    const isAuthorPage = URL.includes("/u/");
    const isJustIn = URL.includes("/j/");
    const isMobile = URL.startsWith("https://m.fanfiction.net/");

    // Redirects to all ratings
    if (isCommunityPage && allRatings &&
        // If URL does not contain any filter id's
        URL.search(/\/\d\d\d\d*\/$/) != -1) {
        let l = URL.split("/");
        let endURL = 99 + "/";
        location.href = URL + endURL;
    }

    if ((isStoriesPage || isCrossoverPage) && allRatings &&
        // If URL does not contains any filter id's
        URL.search(/\/\?/) == -1) {
        location.href = URL + "?&srt=1&r=10";
    }

    function pc(story, stats) {
        let s = stats.innerHTML;
        let first_part = s.match(/(.*)\s-\sChapters/i);
        let isChapters = s.match(/.*Chapters:\s(.*?)\s/i);
        let isWords = s.match(/.*Words:\s(.*?)\s/i);
        let isReviews = (!isReadingPage) ? s.match(/.*Reviews:\s(.*?)\s/i) : s.match(/.*Reviews:\s<.*?>(.*?)</i);
        let isFavs = s.match(/.*Favs:\s(.*?)\s/i);
        let isFollows = s.match(/Follows:\s(.*?)\s/i);
        let isUpdated = s.match(/Updated:\s.*?>(.*?)<.*?\>\s/i);
        let isPublished = s.match(/Published:\s.*?>(.*?)</i);
        let last_part = s.match(/.*span>(.*)/i)
        let n_sub = "";

        n_sub = n_sub + "<span class='chapters'>Ch: " + isChapters[1] + "</span>";
        n_sub = n_sub + " - <span class='words'>W: " + isWords[1] + "</span>";
        if (isReviews != null) {
            n_sub = n_sub + " - <a href='" + ((!isReadingPage) ? story.querySelector("a.reviews").getAttribute("href") : stats.getElementsByTagName("a")[1].getAttribute("href")) + "'><span class='reviews'>Reviews: " + isReviews[1] + "</span></a> ";
            if (!isReadingPage) story.querySelector("a.reviews").parentNode.removeChild(story.querySelector("a.reviews"));
        }
        if (isFavs != null) n_sub = n_sub + " - <span class='favs'>Favs: " + isFavs[1] + "</span>";
        if (isFollows != null) n_sub = n_sub + " - <span class='follows'>Follows: " + isFollows[1] + "</span>";
        if (isUpdated != null) n_sub = n_sub + " - <span class='others'>Updated: " + isUpdated[1] + "</span>";
        if (isPublished != null) n_sub = n_sub + " - <span class='others'>Published: " + isPublished[1] + "</span>";
        n_sub = first_part[1] + last_part[1] + "<br>" + n_sub;

        stats.innerHTML = n_sub;
    }

    function mobile(story, stats) {
        let s = stats.innerHTML;
        let isChapters = s.match(/chapters:\s(.*?),/i);
        let first_part = (isChapters != null) ? s.match(/(.*),\schapters:/i) : s.match(/(.*),\swords:/i);
        let isWords = s.match(/words:\s(.*?),/i);
        let isFavs = s.match(/favs:\s(.*?),/i);
        let isFollows = s.match(/follows:\s(.*?),/i);
        let isUpdated = s.match(/updated:\s.*?>(.*?)</i);
        let isPublished = s.match(/published:\s.*?>(.*)</i);
        let last_part = s.match(/.*span>(.*)/i);
        let n_sub = "";

        n_sub = n_sub + "<br><span class='chapters'>Ch: " + (isChapters != null ? isChapters[1] : "1") + "</span>";
        console.log(isWords);
        n_sub = n_sub + " - <span class='words'>W: " + isWords[1] + "</span>";
        if (isFavs != null) n_sub = n_sub + " - <span class='favs'>Favs: " + isFavs[1] + "</span> ";
        if (isFollows != null) n_sub = n_sub + " - <span class='follows'>Follows: " + isFollows[1] + "</span>";
        if (isUpdated != null) n_sub = n_sub + " - <span class='others'>Updated: " + isUpdated[1] + "</span>";
        n_sub = first_part[1] + last_part[1] + n_sub;

        stats.innerHTML = n_sub;
    }

    window.addEventListener("load", function() {
        if (isMobile) {
            if (isReadingPage) {
                // Add support
            } else {
                let story = document.getElementsByClassName("bs");
                let stats = document.getElementsByClassName("gray");
                for (let i = story.length - 1; i > -1; i--) {
                    console.log(story);
                    let status = story[i].getElementsByClassName("gray");
                    let text = status[0].innerHTML;
                    if (blacklist_fandoms.some(v => text.includes(v))) {
                        story[i].parentNode.removeChild(story[i]);
                        continue;
                    }
                    if (isStoriesPage | isCrossoverPage | isJustIn) mobile(story[i], stats[i]);
                    if (isAuthorPage) mobile(story[i], stats[i+1]);
                }
            }
        } else {
            if (isReadingPage) {
                let story = document.getElementById("profile_top");
                let status = document.getElementsByClassName("xgray")[0];
                pc(story, status);
            }
            else {
                let stories = document.getElementsByClassName("z-list");
                let statuses = document.getElementsByClassName("z-padtop2");
                for (let i = stories.length - 1; i > -1; i--) {
                    let status = stories[i].getElementsByClassName("z-padtop2");
                    let text = status[0].innerHTML;
                    if (blacklist_fandoms.some(v => text.includes(v))) {
                        stories[i].parentNode.removeChild(stories[i]);
                        continue;
                    }
                    pc(stories[i], statuses[i]);
                }
            }
        }
    });
})();
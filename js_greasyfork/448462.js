// ==UserScript==
// @name         No "9GAGGER"
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  Remove 9gag's terrible promoted posts and some spam
// @author       You
// @match        https://9gag.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=9gag.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448462/No%20%229GAGGER%22.user.js
// @updateURL https://update.greasyfork.org/scripts/448462/No%20%229GAGGER%22.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let forbiddenAuthors = ["9gagger", "anonymous"]; //"\\spro"

    let forbiddenText = [
        "refug", "fact", "stick", "maga", "blm", "redpill", "red-pill", "reds-pill", "red pill", "reds pill", "muslim", "my ",
        "isra", "palest",
        "mgtow", "idiocracy", "jew",
        "france", "french", "macron", "interesting", "migrat",
        "twitter", "tweet", "india", "phobi",
        "shitpost", "snowflake",
    "velma", "woke", "lgbt", "rowling", "wahmen", "wahman", "biology",
    "dark humor", "dark humour", "joe rog", "rogan", "generation",
    "politics", "climate", "election", "vote", "lula", "bozo", "bolso",
       "news", "modern", "true", "truth",
    "qatar", "world cup",
    "russia", "ukraine", "latest news", "german", "brazil", "brasil", "usa",
        "war", "russo",
    "marvel", "mcu", "ariel", "mermaid",
    "lord of the rings", "rings of power", "lotr",
    "whame", "relationship", "rekt", "black", "white", "opress",
    "nazi", "not funny",
    "religion", "lgb", "gay", "patriarchy", "netflix",
    "politic", "liberal", "democrat", "libs", "groom", "government", "democracy",
    "diversity", "male", "sigma", "alpha", "beta", "based",
    "politics", "sjw", "trump", "jordan", "peterson", "women", "woman", "wamen", "wamon",
    "girl", "alphabet", "lgbt", "latest news", "alt right", "altright", "alt-right",
    "leftist", "socialism", "communism", "china",
    "russ", "ukraine", "covid", "corona", "rona",
    "she-", "groomer", "sex", "censure", "trans",
    "cancel", "\\selon", "\\smusk", "trigger", "triger",
    "woke", "repost", "troon", "clown", "tranny",
    "leftard", "netflix", "feminism", "nazi",
    "censored", "censor", "cesored", "racis",
    "gender", "pronoun",
        "savage",
        "pride", "victim", "wemen", "Promoted", "bots", "propaganda", "advert",
]
    let forbiddenRegExp = new RegExp("(" + forbiddenText.join(")|(") + ")", "gi");
    let forbiddenAuthorRegExp = new RegExp("(" + forbiddenAuthors.join(")|(") + ")", "gi");
    let debug = false;

        function removePost (post, reason) {
            console.log(`Removing bad post due to ${reason}: `, post, post.innerText.replaceAll("\n", " "));
            post.parentElement.removeChild(post);
        }

    setInterval(async () => {
        let posts = document.getElementsByTagName("article");

        for (let i = 0; i < posts.length; i++) {
            try {
                let post = posts[i];
                if (post.dataset.checkedForShit == "1" && !debug) {
                    continue; // this is a clean post
                }
                let text = post.innerText;
                let authorElement = post.getElementsByClassName("ui-post-creator")[0];
                let author = "";
                if (typeof authorElement == "undefined" && window.location.href.indexOf("/gag/") == -1) {
                    // No author element, why hidden?
                    try {
                        // Click report button
                        post.getElementsByClassName("uikit-popup-menu")[0].getElementsByTagName("a")[0].click();

                        await new Promise(resolve => setTimeout(resolve, 1))

                        // get text from the menu
                        let menuText = post.getElementsByClassName("menu")[0].innerText;

                        // Close the menu
                        post.getElementsByClassName("uikit-popup-menu")[0].getElementsByTagName("a")[0].click();

                        // Get Author from the menu text
                        let author = menuText.split("\n").pop().split("Block")[1].trim();

                        if (author == "" || author == undefined) {
                            removePost(post, "No author");
                        }
                    } catch (e) {
                        removePost(post, "No author");
                    }
                } else {
                    authorElement.innerText.replaceAll("\n", " ").trim();
                }

                try {
                    let upvote = post.getElementsByClassName("upvote")[1];
                    if (upvote.innerText == "•") {
                        removePost(post, "No vote count, likely spam");
                    }
                } catch (e) {}

                let match = author.match(forbiddenAuthorRegExp);
                if (match != null) {
                    removePost(post, match);
                    continue;
                }

                match = text.match(forbiddenRegExp);
                if (match != null) {
                    removePost(post, match);
                    continue;
                }

                post.dataset.checkedForShit = "1";
            } catch (e) {
                console.warn(e);
            }
        }
    }, 100);
    // Your code here...
})();
// ==UserScript==
// @name         Steam - Glance Cards and Cheevos
// @namespace    Lex@GreasyFork
// @version      0.1.8.1
// @description  Highlights Cards and Achievements at the top of game pages
// @author       Lex
// @match        https://store.steampowered.com/app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404263/Steam%20-%20Glance%20Cards%20and%20Cheevos.user.js
// @updateURL https://update.greasyfork.org/scripts/404263/Steam%20-%20Glance%20Cards%20and%20Cheevos.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Gets the inner text of an element if it can be found otherwise returns undefined
    const txt = query => { const e = document.querySelector(query); return e && e.innerText.trim(); };

    const cardsNotify = `<span style="cursor:pointer" onclick="document.getElementById('category_block').scrollIntoView()"><img height="14" style="margin-bottom:-1px" src="https://steamstore-a.akamaihd.net/public/images/v6/ico/ico_cards.png"> Cards</span>`;
    const cheevosNotify = `<span style="cursor:pointer" onclick="document.getElementById('achievement_block').scrollIntoView()">🏆 {0} Achievements</span>`;
    const noSingleplayerNotify = `<span style="color:black;background:yellow">No singleplayer!</span>`;
    const profileLimitedNotify = `<span title="Game will not give +1">⚙️ Profile Limited</span>`;
    const learningAboutNotify = `<span title="Game will not give +1">⌛ Learning About</span>`;
    const freeNotify = `<span title="This item is free to add to your account">🆓 Free</span>`;
    const freeToPlayNotify = `<span title="This item is free to play.">💩 Free to Play</span>`;
    const adultOnlyNotify = `🔞 Adult only`;
    const delistedNotify = `<span title="This game is no longer available for purchase on Steam">👻 Delisted</span>`;
    const releaseDate = txt(".not_yet ~ h1 > span");
    const notYetAppend = releaseDate ? ". Planned release date: " + releaseDate : "";
    const notYetNotify = `<span title="This game is not yet available on Steam${notYetAppend}">🌅 Not yet available</span>`;
    const defaultNotify = `<span style="cursor:pointer" onclick="document.getElementById('category_block').scrollIntoView()">No cards or achievements</span>`;

    const hasCards = document.querySelector("img.category_icon[src$='ico_cards.png']") !== null;
    const hasAchievements = document.querySelector("#achievement_block .communitylink_achievement_images") !== null;
    const achievementCount = hasAchievements ? document.querySelector("#achievement_block .block_title").textContent.match(/\d+/)[0] : 0;
    const noSingleplayer = document.querySelector("img.category_icon[src$='ico_singlePlayer.png']") === null;
    const learningAbout = document.querySelector("img.category_icon[src$='ico_learning_about_game.png']") !== null;
    const profileLimited = document.querySelector("img.category_icon[src$='ico_info.png']") !== null;
    const adultOnly = document.querySelector("div.mature_content_notice") !== null;
    const priceElement = document.querySelector(".game_purchase_price,.discount_final_price");
    const price = priceElement ? priceElement.innerText.toLowerCase() : "";
    const isFree = price === "free";
    const isFreeToPlay = price === "free to play";
    const notYet = document.querySelector(".not_yet") !== null;
    
    let isDelisted = false;
    const noticeBox = document.querySelector(".notice_box_content");
    if (noticeBox !== null) {
        isDelisted = /(unlisted|no longer available)/.test(noticeBox.innerText);
    }

    let props = [];
    if (hasCards) props.push(cardsNotify);
    if (hasAchievements) props.push(cheevosNotify.replace("{0}", achievementCount));
    if (noSingleplayer) props.push(noSingleplayerNotify);
    if (profileLimited) props.push(profileLimitedNotify);
    if (learningAbout) props.push(learningAboutNotify);
    if (adultOnly) props.push(adultOnlyNotify);
    if (isFree) props.push(freeNotify);
    if (isFreeToPlay) props.push(freeToPlayNotify);
    if (isDelisted) props.push(delistedNotify);
    if (notYet) props.push(notYetNotify);
    if (!props.length) props.push(defaultNotify);

    // Create Glance container
    const div = document.createElement("div");
    div.style.fontSize = "110%";
    div.innerHTML = props.join(" ");
    document.querySelector(".glance_ctn").prepend(div);


    function expandRating() {
        document.querySelectorAll(".user_reviews_summary_row[data-tooltip-html]").forEach(row => {
            let rating = row.dataset.tooltipHtml.replace(/(\d+)%[^\d]*([\d,]*).*/, "($1% of $2 reviews)");
            // If Steam hasn't determined the rating yet, calculate it
            if (rating.startsWith("Need more")) {
                const total = parseInt(document.querySelector("label[for=review_type_all]").textContent.match(/[\d,]+/)[0].replace(/,/g,''));
                const pos = parseInt(document.querySelector("label[for=review_type_positive]").textContent.match(/[\d,]+/)[0].replace(/,/g,''));
                const score = Math.round(100*pos/total);
                rating = `(${score}% of ${total} reviews)`;
            }
            // Create a new span container
            const newSpan = document.createElement("span");
            newSpan.innerText = rating;
            newSpan.style.whiteSpace = "nowrap";

            const ratingSpan = row.querySelector(".responsive_hidden");
            if (ratingSpan) {
                // Hide the old rating span
                ratingSpan.style.display = "none";
                ratingSpan.after(newSpan);
            } else {
                // There's nothing to hide because Steam hasn't determined a rating yet
                const notEnough = row.querySelector(".not_enough_reviews");
                if (notEnough === null) return;
                notEnough.innerText += ' ';
                notEnough.after(newSpan);
            }
            newSpan.parentElement.style.whiteSpace = "normal";
        });
    }

    expandRating();
})();
// ==UserScript==
// @name         OurMiniProfile
// @namespace    dotp.cc
// @version      1.0.666
// @description  Modifies the MiniProfile with many little things
// @author       Lenin [2199004]
// @license      MIT
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490131/OurMiniProfile.user.js
// @updateURL https://update.greasyfork.org/scripts/490131/OurMiniProfile.meta.js
// ==/UserScript==

// DISABLE LAST ACTION IN TORNTOOLS!!!
// Go to TornTools settings -> Global -> Uncheck "Show last action in the mini profiles"
// If you are stubborn and keep it, the last action part of this script will not display.

// If you want to see the forum-related icons, change the following to true or false depending on your preference.

const forumIconsEnabled = true

const forumIconPosts = true
const forumIconThreads = true
const forumIconMentions = true
const forumIconTrading = false
const forumIconPnL = false

// hide certain icons to reduce cramping, change the following to true or false depending on your preference.
// IF ACTIVITY ICON IS DISABLED, LAST ACTION TEXT WILL BE COLOURED DEPENDING ON ACTIVITY (Green = Active, Orange = Idle)

const profileIconActivity = true
const profileIconLevelMax = true
const profileIconGender = true
const profileIconDonate = true
const profileIconMarriage = true

// rest of the code, you need not bother here.

const {fetch: origFetch} = window;
window.fetch = async (...args) => {
    console.log("fetch called with args:", args);

    const response = await origFetch(...args);

    if (response.url.includes('/page.php?sid=UserMiniProfile')) {
        response.clone().json().then(function(body) {
            var time = body.user.lastAction.seconds;
            var userID = body.user.userID; // Extracting the userID
            insertLastAction(time, body); // Insert last action and handle friend/enemy/target status
            insertProfileElements(userID); // Insert additional profile elements
        }).catch(err => console.error(err));
    }

    return response;
};

function convert(t){
    var days = Math.floor(t / 86400);
    t -= 86400 * days;
    var hrs = Math.floor(t / 3600);
    t -= hrs * 3600;
    var minutes = Math.floor(t / 60);
    t -= minutes * 60;

    var result = '';
    if (days) result += `${days}d `;
    if (hrs) result += `${hrs}h `;
    if (minutes) result += `${minutes}m `;
    result += `${t}s`;

    return result;
}

function insertLastAction(t, body) {
    // Initialize variables with default values
    var addToFriendMessage = '';
    var addToEnemyMessage = '';
    var addToTargetMessage = '';
    var friendInfo = '';
    var enemyInfo = '';
    var targetInfo = '';

    // Check if addToFriendList exists and has a message property
    if (body.profileButtons.buttons.addToFriendList && body.profileButtons.buttons.addToFriendList.message) {
        addToFriendMessage = body.profileButtons.buttons.addToFriendList.message;
        if (addToFriendMessage.includes("is on your friend list :")) {
            friendInfo = ` ✅${addToFriendMessage.split("is on your friend list :")[1]}`;
        }
    }

    // Check if addToEnemyList exists and has a message property
    if (body.profileButtons.buttons.addToEnemyList && body.profileButtons.buttons.addToEnemyList.message) {
        addToEnemyMessage = body.profileButtons.buttons.addToEnemyList.message;
        if (addToEnemyMessage.includes("is on your enemy list :")) {
            enemyInfo = ` ⛔${addToEnemyMessage.split("is on your enemy list :")[1]}`;
        }
    }

    // Check if addToTargetList exists and has a message property
    if (body.profileButtons.buttons.addToTargetList && body.profileButtons.buttons.addToTargetList.message) {
        addToTargetMessage = body.profileButtons.buttons.addToTargetList.message;
        if (addToTargetMessage.includes("is on your target list :")) {
            targetInfo = ` 🎯${addToTargetMessage.split("is on your target list :")[1]}`;
        }
    }

    // Determine the colour for the tt text based on conditions
    var ttColour = ''; // Default to no colour change
    if (!profileIconActivity && body.icons && body.icons[0] && body.icons[0].type) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        if (body.icons[0].type === "Online") {
            ttColour = isDarkMode ? 'lime' : 'darkgreen';
        } else if (body.icons[0].type === "Away") {
            ttColour = isDarkMode ? 'orange' : '#cd7000';
        }
    }

    // Check if the "tt-mini-data" element exists
    const ttMiniData = document.querySelector('.profile-mini-root .profile-mini-_wrapper___Arw8R .profile-mini-_userProfileWrapper___iIXVW .tt-mini-data');

        if (ttMiniData) {
        ttMiniData.style.fontSize = '10px';
    }

    // Insert or update the last action information
    if ($('.icons', $('#profile-mini-root')).length > 0) {
        if ($('.laction', $('#profile-mini-root')).length == 0) {
            var tt = convert(t);
            var ttStyled = ttColour ? `<span style="color: ${ttColour};">${tt}</span>` : tt;

            // Only insert ttStyled if tt-mini-data does not exist
            if (!ttMiniData) {
                var ldata = `<p class='laction' style='font-size: 10px;'>🕒${ttStyled}${friendInfo}${enemyInfo}${targetInfo}</p>`;
                $('.icons', $('#profile-mini-root')).append(ldata);
            } else {
                // If tt-mini-data exists and profileIconActivity is false, colour its text
                if (!profileIconActivity && ttColour) {
                    ttMiniData.style.color = ttColour;
                }
                // Insert friendInfo, enemyInfo, and targetInfo regardless
                var ldata = `<p class='laction' style='font-size: 10px;'>${friendInfo}${enemyInfo}${targetInfo}</p>`;
                $('.icons', $('#profile-mini-root')).append(ldata);
            }
        } else {
            // Update the existing .laction with friend, enemy, and target info
            $('.laction').append(friendInfo + enemyInfo + targetInfo);
        }
    } else {
        setTimeout(() => insertLastAction(t, body), 300);
    }
}

function insertProfileElements(userID) {
    // Check if forumIconsEnabled is true
    if (forumIconsEnabled !== true) {
        return; // Do not insert anything if forumIconsEnabled is false
    }

    if ($('.icons', $('#profile-mini-root')).length > 0) {
        // Define the new elements to be added
        const elements = [
            {id: 36, class: 'OurPosts', href: `forums.php#!p=search&f=0&y=0&q=by:${userID}`, title: 'Posts', enabled: forumIconPosts},
            {id: 54, class: 'OurThreads', href: `/forums.php#/p=search&q=by:${userID}&f=0&y=1`, title: 'Threads', enabled: forumIconThreads},
            {id: 69, class: 'OurMentions', href: `/forums.php#/p=search&q=${userID}&f=0&y=0`, title: 'Mentions', enabled: forumIconMentions},
            {id: 78, class: 'OurTrading', href: `/forums.php#/p=search&q=${userID}&f=10&y=1`, title: 'Trading Threads', enabled: forumIconTrading},
            {id: 67, class: 'OurPoliticsAndLaw', href: `/forums.php#/p=search&q=by:${userID}&f=38&y=0`, title: 'P&L Posts', enabled: forumIconPnL}
        ];

        // Append each new element to the .icons div if it is enabled
        elements.forEach(el => {
            if (el.enabled) {
                const li = $(`<li id="icon${el.id}-mini-profile-${userID}" class="user-status-16-${el.class} left"><a href="${el.href}" title="${el.title}"></a></li>`);
                $('.icons .row', $('#profile-mini-root')).append(li);
            }
        });

        // Hide existing icons based on const values
        if (!profileIconActivity) {
            $('#icon1-mini-profile-' + userID + ', #icon2-mini-profile-' + userID + ', #icon62-mini-profile-' + userID).hide();
        }
        if (!profileIconLevelMax) {
            $('#icon5-mini-profile-' + userID).hide();
        }
        if (!profileIconGender) {
            $('#icon6-mini-profile-' + userID + ', #icon7-mini-profile-' + userID + ', #icon87-mini-profile-' + userID).hide();
        }
        if (!profileIconDonate) {
            $('#icon3-mini-profile-' + userID + ', #icon4-mini-profile-' + userID).hide();
        }
        if (!profileIconMarriage) {
            $('#icon8-mini-profile-' + userID).hide();
        }
    } else {
        setTimeout(() => insertProfileElements(userID), 100);
    }
}
// ==UserScript==
// @name         Roblox Library Spam Trasher
// @namespace    RBXSpamTrasher
// @version      1.0
// @description  Automatically hides free robux bot spam comments in Roblox library.
// @author       Author
// @match        https://www.roblox.com/library/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376881/Roblox%20Library%20Spam%20Trasher.user.js
// @updateURL https://update.greasyfork.org/scripts/376881/Roblox%20Library%20Spam%20Trasher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var loadStep = 20; //The target number of non-spam comments to load before stopping

    var spamStrictness = 3;
    // Spam strictness levels:
    // 0 - blocks nothing, all bot spam is visible
    // 1 - blocks only bot spam, does not block any human spam
    // 2 - blocks bot spam and human bot-related spam, such as "ＨＥＹ　ＳＣＡＭＭＥＲＳ，ＤＩＤ　ＹＯＵ　ＧＥＴ　ＹＥＲ　ＲＯＢＵＸ?"
    // 3 - blocks bot spam and a bunch of human spam, such as "if you are reading this you will die in the next hour if you post this on another item tomorrow will be the best day of your life"
    var botSpam = [
        "that means you're qualified",
        "Want ROBUX?",
        "No info or downloads",
        "Instantly receive your ",
        "Just get a code, and redeem here",
        "You're eligible for BUX",
        "Processed Instantly for tons of",
        "Visit the link: ",
        "Go see the link: ",
        "Redeem your BUX now",
        "No details needed! Unlock",
        "Go to the link: ",
        "New rewards site with instant BUX and passes",
        "finish a quick offer to get the option",
        "ROBUX piles coming your way",
        "Unlock ALL Game VIP",
        "rewardbuddy",
        "instantreward",
        "Want Thousands of ROBUX Instantly Free of Cost Too",
        "Go To The Following Link: ",
        "ABSOLUTELY No Login Info Needed",
        "Celebrate 2018 with FREE Game Passes to EVERY Game!",
        "Instantly receive Codes for ROBUX",
        "You are eligible to receive Thousands of ROBUX Instantly",
        "Get your full redemption code before its too late!",
        "I got thousands of ROBUX just by entering those redemption codes no INFO was asked for AT ALL",
        "Thats right THOUSANDS OF ROBUX, no account inoformation, NO DOWNLOAD, simply get your full redemption codes",
        "‌[‌W‌O‌R‌K‌‌S‌] ‌Ge‌t ‌‌R‌$ ‌ju‌st ‌‌ ‌ente‌‌r y‌‌our na‌‌me @‌ "
    ]; // Bot spam blacklist. You can add more if you wish. Don't forget the comma
    var botRelatedHumanSpam = [
        "💙Don't be fooled for scams",
         "ＨＥＹ　ＳＣＡＭＭＥＲＳ，ＤＩＤ　ＹＯＵ　ＧＥＴ　ＹＥＲ　ＲＯＢＵＸ",
        "Copy and paste this everywhere you can to save ROBLOX from SCAMMERS",
        "Copy and paste this everywhere! The word must be spread",
        "POST THIS EVERYWHERE TO STOP HACKERS AND SPAMMERS",
        "Copy and paste this everywhere you can to save our 💚",
        "Copy and paste this everywhere so you can save our wonderful Roblox",
        "COPY AND PASTE THIS AS QUICK AS POSSIBLE BEFORE YOU OR YOUR FRIENDS ACCOUNTS GETS STOLEN",
        "Copy and paste this to save our wonderful roblox",
        "Simply don’t go to the link 👉: SCAM",
        "Because your...👉 FAKE!!!",
        "Copy and paste this everywhere so you can save our world",
        "Copy and paste this everywhere to save the ROBLOX we love",
        "🍀Do you want your account TAKEN?🍀",
        "🍀Do you want NO ROBUX?🍀",
        "Instant redemption!🍀 💚Redeem Never!",
        "👉Simply go to the link👉: "
    ] // Bot-related human spam blacklist. You can add more if you wish. Don't forget the comma
    var humanSpam = [
        "ｒｅａｄｉｎｇ",
        "▒█▀▀▀▒█..░▒█▒█▀▀█",
        "You will die in the next hour",
        "ｙｏｕ　ｗｉｌｌ　ｄｉｅ　ｉｎ　ｔｈｅ　ｎｅｘｔ　ｈｏｕ",
        "you will die in the next hour",
        "Hold your breath, cross your legs, and don't breathe or uncross your legs until you post this on another audio"
    ]; // Human spam blacklist. You can add more if you wish. Don't forget the comma

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Check if comments are even enabled before continuing
    if(document.getElementById("AjaxCommentsContainer") == null){
        return 0;
    }


    // Create our blacklist array that contains the correct values.
    var spamContains = [];
    if(spamStrictness > 0){
        spamContains = spamContains.concat(botSpam);
    }
    if(spamStrictness > 1){
        spamContains = spamContains.concat(botRelatedHumanSpam);
    }
    if(spamStrictness > 2){
        spamContains = spamContains.concat(humanSpam);
    }

    // Hide the default comment template to avoid bot spam comments flashing then quickly disappearing when the script hides it.
    Array.from(document.getElementsByClassName("comments-item-template")).forEach(function(element, index, array){
        element.getElementsByTagName("div")[0].style.display = 'none';
    });


    var cln;

    function initializeFakeLoader(){ // Creates a second loading animation that we have more control over and prevents the regular one from appearing
        // This is necessary because the original loading animation pops up and disappears as more comments are loaded, and we don't want it to be constantly flashing, disappearing and re-appearing

        // Hide any loading animations already in display
        Array.from(document.getElementsByClassName("loading-animated")).forEach(function(element, index, array) {
            element.style.display = 'none';
        });

        // Set the template to be invisible and create our second loading animation clone
        Array.from(document.getElementsByClassName("loader-template")).forEach(function(element, index, array) {
            cln = element.getElementsByTagName("div")[0].cloneNode(true);
            element.getElementsByTagName("div")[0].style.display = 'none';
        });

        // Insert the second loading animation in the correct position and un-hide it
        var contain = document.getElementById("AjaxCommentsContainer").getElementsByTagName("div")[1]
        contain.insertBefore(cln, contain.childNodes[6]);
        cln.style.display = '';

        // Hide the "Show more" button while loading as it's not necessary
        Array.from(document.getElementsByClassName("btn-control-sm rbx-comments-see-more")).forEach(function(element, index, array) {
            element.style.visibility = 'hidden';
        });
    }

    initializeFakeLoader();
    var stillLoading = true;
    var iters = 0;
    var nonSpam = 0;

    // Make the "Show more" button start loading via our script again
    Array.from(document.getElementsByClassName("btn-control-sm rbx-comments-see-more")).forEach(function(element, index, array) {
        element.onclick = function(){
            if((!(element.classList.contains("hidden"))) && nonSpam >= loadStep){
                nonSpam = 0;
                iters = 0;
                stillLoading = true;
                initializeFakeLoader();
            }
        };
    });



    // Repeat every 0.75s. There's probably a better way to do this but this works fine too
    setInterval(function() {
        // Remove our second loading animation and restore the show more button if we've loaded enough comments.
        if((!stillLoading) && (cln.parentNode)){
            cln.parentNode.removeChild(cln);
            Array.from(document.getElementsByClassName("loader-template")).forEach(function(element, index, array) {
                element.getElementsByTagName("div")[0].style.display = '';
            });
            Array.from(document.getElementsByClassName("btn-control-sm rbx-comments-see-more")).forEach(function(element, index, array) {
                element.style.visibility = '';
            });
        }

        // Click the show more button automatically to make Roblox load more comments if we haven't loaded enough yet.
        Array.from(document.getElementsByClassName("btn-control-sm rbx-comments-see-more")).forEach(function(element, index, array) {
            if ((!(element.classList.contains("hidden"))) && nonSpam < loadStep) {
                iters++;
                element.click();
                stillLoading = true
            }else{
                stillLoading = false
            }
        });

        // Check comments for spam
        Array.from(document.getElementsByClassName("comment-content list-content")).forEach(function(element, index, array) {
            if(element.alreadyCheck != "true"){
                var isSpam = false;
                spamContains.forEach(function(a, b, c){
                    if (element.innerHTML.indexOf(a)>=0){
                        element.parentNode.parentNode.style.display = 'none';
                        isSpam = true;
                    }
                });

                // The comment template has the word "text" in it and we don't want to un-hide it
                if(element.innerHTML == "text"){
                    isSpam = true;
                }

                if (isSpam == false){
                    nonSpam++;
                    element.parentNode.parentNode.style.display = '';
                }
                element.alreadyCheck = "true";
            }
        });
    }, 750);
})();
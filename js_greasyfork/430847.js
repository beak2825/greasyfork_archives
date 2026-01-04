// ==UserScript==
// @name         Spam comment hider for Roblox
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hides dumb spam comments on items and groups like "The person below me" or "/e free" to find more comment relevant to the item's topic NOTE: DOES NOT HIDE ADVERTISEMENT! Credit to Brosy518241
// @author       You
// @match        https://www.roblox.com, https://web.roblox.com
// @icon         https://www.google.com/s2/favicons?domain=roblox.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430847/Spam%20comment%20hider%20for%20Roblox.user.js
// @updateURL https://update.greasyfork.org/scripts/430847/Spam%20comment%20hider%20for%20Roblox.meta.js
// ==/UserScript==

(function() {


    'use strict';
      var spamStrictness = 3;

    //   var efree = [
        "/e free",
    "/e equip avatar",
            "/e wear"

    // var personbelowme = [
        "The person below me",
        "The person below"

    // var dieinyoursleep = [
    "ｒｅａｄｉｎｇ",
        "▒█▀▀▀▒█..░▒█▒█▀▀█",
        "You will die in the next hour",
        "ｙｏｕ　ｗｉｌｌ　ｄｉｅ　ｉｎ　ｔｈｅ　ｎｅｘｔ　ｈｏｕ",
        "you will die in the next hour",
        "Hold your breath, cross your legs, and don't breathe or uncross your legs until you post this on another audio"

    // var hiscammers = [
    "😁 ʜɪ ꜱᴄᴀᴍᴍᴇʀꜱ!"

    //var billy = [
    "This is Billy."

    // var howtoloseyouvoice = [
    "How to lose your voice :)"



        // Check if comments are even enabled before continuing
    if(document.getElementById("AjaxCommentsContainer") == null){
        return 0;
    }


    // Create our blacklist array that contains the correct values.
    var spamContains = [];
    if(spamStrictness > 0){
        spamContains = spamContains.concat(efree);
    }
    if(spamStrictness > 1){
        spamContains = spamContains.concat(thepersonbelowme);
    }
    if(spamStrictness > 2){
        spamContains = spamContains.concat(weirdglitch);
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
// ==UserScript==
// @name         melt.rocks
// @namespace    http://mal.rocks/
// @version      0.1.1
// @description  a script for mal.rocks that improves some features (and adds some new ones too!)
// @author       shady
// @match        https://mal.rocks/*
// @icon         https://cdn.discordapp.com/avatars/876581935596589098/a_c330155e6c8d691a87b09875b6e1259d.png
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445997/meltrocks.user.js
// @updateURL https://update.greasyfork.org/scripts/445997/meltrocks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentUrl = window.location.href;

    //------------//
    //    LOGO    //
    //------------//

    if (document.querySelector("body > div.body-text > div > div > nav > div:nth-child(1) > a > h3")) {
        document.querySelector("body > div.body-text > div > div > nav > div:nth-child(1) > a > h3").innerText = "melt.rocks - improved mal.rocks";
    };

    //-------------//
    // UPLOAD UTIL //
    //-------------//

    if (currentUrl.includes("https://mal.rocks/upload/")) {
        var uploadBox = document.querySelector("body > section > div > div > div > div")
        var originalButton = document.querySelector("#download");
        var image = document.querySelector("body > section > div > div > div > div > img");

        // clone original button
        var clonedButton = originalButton.cloneNode(true);
        // append new button to upload box
        uploadBox.appendChild(clonedButton);
        // append a br element to upload box
        uploadBox.appendChild(document.createElement("br"));
        uploadBox.appendChild(document.createElement("br"));

        // set the id attribute of the cloned button
        clonedButton.id = "rawimage";
        // set the text of the new button to "Raw Image"
        clonedButton.innerText = "Raw Image";
        // 
        // add an onclick event listener to the new button
        clonedButton.addEventListener("click", function() {
            // get the image url
            var imageUrl = image.src;
            // open a new tab with the image url
            window.open(imageUrl);
        });
    };

    //--------------//
    // ANNOUNCEMENT //
    //--------------//

    if (currentUrl == "https://mal.rocks/dashboard") {
        var originalAnnouncement = document.querySelector("body > div.body-text > section > div > div > div.p-4.lg\\:w-full > div");
        // clone the original announcement
        var newAnnouncement = originalAnnouncement.cloneNode(true);
        // add the new announcement to the beginning of the original announcement's parent
        originalAnnouncement.parentNode.insertBefore(newAnnouncement, originalAnnouncement);
        // change the h1 text of the new announcement
        newAnnouncement.querySelector("h1").innerText = "melt.rocks";
        // change the h2 text of the new announcement
        newAnnouncement.querySelector("h2").innerText = "script created by shady#9999 on discord. i put like 6 hours into this script for no reason lol";
    };

    //--------------//
    // CUSTOM BADGE //
    //--------------//

    // check to see if the current page is shady's profile page
    if (currentUrl == "https://mal.rocks/user/17") {
        // text and style
        // find a element with the id of "badges"
        var badges = document.getElementById("badges");
        // get the first span element
        var firstBadge = badges.getElementsByTagName("span")[0];
        // clone firstBadge and append it to the end of badges
        badges.appendChild(firstBadge.cloneNode(true));
        var newBadge = badges.lastChild;
        // change the text of the appended badge to "Script Creator"
        newBadge.innerText = "Script Creator";
        // change the "tooltip" tag value to "This user is the creator of this script"
        newBadge.setAttribute("tooltip", "the creator of melt.rocks");
        // change the "style" tag value to "background-color: #6A00FF; text-decoration: none"
        newBadge.setAttribute("style", "background-color: #6A00FF; text-decoration: none");

        // icon stuff
        // get the i element in firstBadge
        var firstBadgeIcon = firstBadge.getElementsByTagName("i")[0];
        // clone firstBadgeIcon and append it to the beginning of the last child in badges
        newBadge.insertBefore(firstBadgeIcon.cloneNode(true), newBadge.firstChild);
        var newBadgeIcon = newBadge.getElementsByTagName("i")[0];
        // change the "class" tag value to "fa-solid fa-code mr-2"
        newBadgeIcon.setAttribute("class", "fa-solid fa-code mr-2");
    };

    //----------------//
    // CUSTOM PROFILE //
    //----------------//

    // check to see if the current page is the dashboard
    if (currentUrl == "https://mal.rocks/dashboard/profile") {

        // create a function named copyProfile
        function copyProfile() {
            var profile = document.querySelector("body > div.body-text > section > div > div > div:nth-child(3) > div > a:nth-child(9)");
            // get the href attribute of profile
            var profileHref = profile.getAttribute("href");
            // copy "https://mal.rocks" + profileHref to the clipboard
            navigator.clipboard.writeText("https://mal.rocks" + profileHref);
            // create a alert that says "copied to clipboard"
            alert("Profile link copied to clipboard!");
        };

        window.copyProfileInject = copyProfile;

        var profileTemplate = document.querySelector("body > div.body-text > section > div > div > div:nth-child(1)");
        var infoTemplate = document.querySelector("body > div.body-text > section > div > div > div:nth-child(2)");
        var actionTemplate = document.querySelector("body > div.body-text > section > div > div > div:nth-child(3)");
        // clone the boxTemplate
        var newProfileBox = profileTemplate.cloneNode(true);
        var newInfoBox = infoTemplate.cloneNode(true);
        var newActionBox = actionTemplate.cloneNode(true);
        // add the new box to the end of the boxTemplate's parent
        profileTemplate.parentNode.appendChild(newProfileBox);
        actionTemplate.parentNode.appendChild(newActionBox);

        document.querySelector("body > div.body-text > section > div > div > div:nth-child(4) > div").remove();
        // edit the h1 text of the new action box
        newActionBox.querySelector("h1").innerText = "melt.rocks";

        var meltButton1 = document.querySelector("body > div.body-text > section > div > div > div:nth-child(5) > div > a:nth-child(3)");
        var meltButton1Child = document.querySelector("body > div.body-text > section > div > div > div:nth-child(5) > div > a:nth-child(3) > button");
        // change the id of meltButton1Child to "copyprofile"
        meltButton1Child.setAttribute("id", "copyprofile");
        // change the text of meltButton1Child to "Copy profile link"
        meltButton1Child.innerText = "Copy profile link";
        // set the onclick of meltButton1 to copyProfile
        meltButton1.setAttribute("onclick", "window.copyProfileInject()");

    };
})();
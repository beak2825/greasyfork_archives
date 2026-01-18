// ==UserScript==
// @name         NoShitEmpornium
// @namespace    http://www.empornium.me/
// @version      2.8.0
// @license      GPLv3
// @description  Fully featured torrent filtering solution for Empornium
// @supportURL   https://github.com/ceodoe/noshitempornium/issues
// @homepageURL  https://github.com/ceodoe/noshitempornium/
// @icon         https://www.google.com/s2/favicons?domain=empornium.is
// @author       ceodoe
// @include      /^https://www\.empornium\.(me|sx|is)/torrents\.php*/
// @include      /^https://www\.empornium\.(me|sx|is)/collage\/*
// @include      /^https://www\.empornium\.(me|sx|is)/top10\.php*/
// @include      /^https://www\.empornium\.(me|sx|is)/user\.php\?action=notify/
// @include      /^https://www\.empornium\.(me|sx|is)/requests\.php/
// @exclude      /^https://www\.empornium\.(me|sx|is)/top10\.php.*(\?|&)(type=(users|tags|taggers))/
// @include      /^https://www\.emparadise\.rs/torrents\.php*/
// @include      /^https://www\.emparadise\.rs/collage\/*
// @include      /^https://www\.emparadise\.rs/top10\.php*/
// @include      /^https://www\.emparadise\.rs/user\.php\?action=notify/
// @include      /^https://www\.emparadise\.rs/requests\.php/
// @exclude      /^https://www\.emparadise\.rs/top10\.php.*(\?|&)(type=(users|tags|taggers))/
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/443999/NoShitEmpornium.user.js
// @updateURL https://update.greasyfork.org/scripts/443999/NoShitEmpornium.meta.js
// ==/UserScript==
//
// Copyright © 2015-2026 ceodoe
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.


// +----------------------------+
// | Loading and initialization |
// +----------------------------+

// Get version information
let nseVersion = GM_info.script.version.split(".");
let nseVersionNum = Number(nseVersion[0] + nseVersion[1].padStart(2, "0") + nseVersion[2].padStart(2, "0"));
let nseSavedVersion = GM_getValue("nseSavedVersion", nseVersionNum);
GM_setValue("nseSavedVersion", nseSavedVersion);

// Load and initialize saved filter lists
let nseBlacklistTaglist = GM_getValue("nseTaglist", "enter.tags.here separated.by.spaces no.newlines").trim();
let nseBlacklistTags = nseBlacklistTaglist.split(" ");
nseBlacklistTags.sort();
nseBlacklistTaglist = nseBlacklistTags.join(" ");
if(nseBlacklistTags.length === 1 && nseBlacklistTags[0] === "") { nseBlacklistTags = new Array(0); }
GM_setValue("nseTaglist", nseBlacklistTaglist);

let nseHardPassTaglist = GM_getValue("nseHardPassTaglist", "enter.hard.pass.tags.here big.poopies gushing.blood").trim();
let nseHardPassTags = nseHardPassTaglist.split(" ");
nseHardPassTags.sort();
nseHardPassTaglist = nseHardPassTags.join(" ");
if(nseHardPassTags.length === 1 && nseHardPassTags[0] === "") { nseHardPassTags = new Array(0); }
GM_setValue("nseHardPassTaglist", nseHardPassTaglist);

let nseWhitelistTaglist = GM_getValue("nseWhitelist", "whitelist.tags go.here").trim();
let nseWhitelistTags = nseWhitelistTaglist.split(" ");
nseWhitelistTags.sort();
nseWhitelistTaglist = nseWhitelistTags.join(" ");
if(nseWhitelistTags.length === 1 && nseWhitelistTags[0] === "") { nseWhitelistTags = new Array(0); }
GM_setValue("nseWhitelist", nseWhitelistTaglist);

let nseBlacklistTitleList = GM_getValue("nseBlacklistTitles", "this is a title phrase;this is another title phrase").trim();
let nseBlacklistTitlePhrases = nseBlacklistTitleList.split(";");
nseBlacklistTitlePhrases.sort();
nseBlacklistTitleList = nseBlacklistTitlePhrases.join(";");
if(nseBlacklistTitlePhrases.length === 1 && nseBlacklistTitlePhrases[0] === "") { nseBlacklistTitlePhrases = new Array(0); }
GM_setValue("nseBlacklistTitles", nseBlacklistTitleList);

let nseHardPassTitleList = GM_getValue("nseHardPassTitles", "this is a title phrase;this is another title phrase").trim();
let nseHardPassTitlePhrases = nseHardPassTitleList.split(";");
nseHardPassTitlePhrases.sort();
nseHardPassTitleList = nseHardPassTitlePhrases.join(";");
if(nseHardPassTitlePhrases.length === 1 && nseHardPassTitlePhrases[0] === "") { nseHardPassTitlePhrases = new Array(0); }
GM_setValue("nseHardPassTitles", nseHardPassTitleList);

let nseWhitelistTitleList = GM_getValue("nseWhitelistTitles", "this is a title phrase;this is another title phrase").trim();
let nseWhitelistTitlePhrases = nseWhitelistTitleList.split(";");
nseWhitelistTitlePhrases.sort();
nseWhitelistTitleList = nseWhitelistTitlePhrases.join(";");
if(nseWhitelistTitlePhrases.length === 1 && nseWhitelistTitlePhrases[0] === "") { nseWhitelistTitlePhrases = new Array(0); }
GM_setValue("nseWhitelistTitles", nseWhitelistTitleList);

let nseBlacklistUploadersList = GM_getValue("nseUploaders", "PutUserNamesHere SeparatedBySpaces NoNewlines").trim();
let nseBlacklistUploaders = nseBlacklistUploadersList.split(" ");
nseBlacklistUploaders.sort();
nseBlacklistUploadersList = nseBlacklistUploaders.join(" ");
if(nseBlacklistUploaders.length === 1 && nseBlacklistUploaders[0] === "") { nseBlacklistUploaders = new Array(0); }
GM_setValue("nseUploaders", nseBlacklistUploadersList);

let nseWhitelistUploadersList = GM_getValue("nseWhitelistUploaders", "PutUserNamesHere SeparatedBySpaces NoNewlines").trim();
let nseWhitelistUploaders = nseWhitelistUploadersList.split(" ");
nseWhitelistUploaders.sort();
nseWhitelistUploadersList = nseWhitelistUploaders.join(" ");
if(nseWhitelistUploaders.length === 1 && nseWhitelistUploaders[0] === "") { nseWhitelistUploaders = new Array(0); }
GM_setValue("nseWhitelistUploaders", nseWhitelistUploadersList);

// Delete obsolete options
GM_deleteValue("nseEnableGCDCompatibilityMode");


// Load saved options
//  Filtering options
//   Individual upload filtering
let nseIndividualUploadHidingEnabled = GM_getValue("nseIndividualUploadHidingEnabled", true);
let nseIndividualUploadHidingBlacklist = GM_getValue("nseIndividualUploadHidingBlacklist", new Array(0));
let nseIndividualUploadHidingWhitelist = GM_getValue("nseIndividualUploadHidingWhitelist", new Array(0));

// Filter all button
let nseFilterAllButtonEnabled = GM_getValue("nseFilterAllButtonEnabled", true);

//   Right-Click Management
let nseRightClickManagementEnabled = GM_getValue("nseRightClickManagementEnabled", true);
let nseRCMTagsEnabled = GM_getValue("nseRCMTagsEnabled", true);
let nseRCMTitlesEnabled = GM_getValue("nseRCMTitlesEnabled", true);
let nseRCMUploadersEnabled = GM_getValue("nseRCMUploadersEnabled", true);

//   Torrent site status
let nseHideAnonUploadsEnabled = GM_getValue("nseHideAnonUploadsEnabled", false);
let nseHideReportedEnabled = GM_getValue("nseHideReportedEnabled", false);
let nseHideWarnedEnabled = GM_getValue("nseHideWarnedEnabled", false);
let nseHideUnseededEnabled = GM_getValue("nseHideUnseededEnabled", false);

//   Torrent personal status
let nseHideGrabbedEnabled = GM_getValue("nseHideGrabbedEnabled", false);
let nseHideLeechingEnabled = GM_getValue("nseHideLeechingEnabled", false);
let nseHideSeedingEnabled = GM_getValue("nseHideSeedingEnabled", false);
let nseHideSnatchedEnabled = GM_getValue("nseHideSnatchedEnabled", false);
let nseHideBookmarkedEnabled = GM_getValue("nseHideBookmarkedEnabled", false);
let nseBypassWhitelistsEnabled = GM_getValue("nseBypassWhitelistsEnabled", false);

//   Hard Pass
let nseHardPassEnabled = GM_getValue("nseHardPassEnabled", false);
let nseRemoveHardPassResults = GM_getValue("nseRemoveHardPassResults", false);

//  Interface options
//   Oblivious mode
let nseObliviousModeEnabled = GM_getValue("nseObliviousModeEnabled", false);

//   Custom CSS
let nseCustomCSSEnabled = GM_getValue("nseCustomCSSEnabled", false);
let nseCustomCSS = GM_getValue("nseCustomCSS", "/* With great power comes great responsibility */");

//   Auto-scroll to NSE
let nseScrollToNSEEnabled = GM_getValue("nseScrollToNSEEnabled", false);

//   Emoji
let nseEmojiEnabled = GM_getValue("nseEmojiEnabled", true);

//   Update toasts
let nseUpdateToastsEnabled = GM_getValue("nseUpdateToastsEnabled", true);

//   Floating toggle button
let nseFloatingToggleButtonEnabled = GM_getValue("nseFloatingToggleButtonEnabled", true);

//   Open all button
let nseOpenAllButtonEnabled = GM_getValue("nseOpenAllButtonEnabled", true);
let nseOpenAllGoNextEnabled = GM_getValue("nseOpenAllGoNextEnabled", false);

//   Fonts
let nseUIFont = GM_getValue("nseUIFont", "Helvetica");
let nseTextAreaFont = GM_getValue("nseTextAreaFont", "Monospace");

// Highlight colors
let nseBlacklistColor = GM_getValue("nseBlacklistColor", "#F00");
let nseHardPassColor = GM_getValue("nseHardPassColor", "#A00");
let nseWhitelistColor = GM_getValue("nseWhitelistColor", "#0F0");

// Custom timeout
let nseTimeout = GM_getValue("nseTimeout", 1500);

//   Theme
let nseSelectedTheme = GM_getValue("nseSelectedTheme", "nseThemeDefault");
let nseCustomTheme = GM_getValue("nseCustomTheme", {
    backgroundColor: "#fff",
    backgroundHighlightColor: "#cfe7ff",
    foregroundColor: "#000",
    accentColor: "#0af",
    highlightColor: "#0071b0",
    hiddenBackgroundColor: "#aaf"
});

if(nseCustomTheme.hiddenBackgroundColor == undefined) {
    nseCustomTheme.hiddenBackgroundColor = "#aaf";
}

let themes = {
    nseThemeDefault:
        {
            backgroundColor: "#fff",
            backgroundHighlightColor: "#cfe7ff",
            foregroundColor: "#000",
            accentColor: "#0af",
            highlightColor: "#0071b0",
            hiddenBackgroundColor: "#aaf"
        },
    nseThemeLegacy:
        {
            backgroundColor: "#00f",
            backgroundHighlightColor: "#44f",
            foregroundColor: "#fff",
            accentColor: "#ddd",
            highlightColor: "#fff",
            hiddenBackgroundColor: "#aaf"
        },
    nseThemeEdgy:
        {
            backgroundColor: "#000",
            backgroundHighlightColor: "#333",
            foregroundColor: "#f00",
            accentColor: "#f22",
            highlightColor: "#f22",
            hiddenBackgroundColor: "#aaf"
        },
    nseThemeBaked:
        {
            backgroundColor: "#8300ff",
            backgroundHighlightColor: "#087300",
            foregroundColor: "#0a8700",
            accentColor: "#b669ff",
            highlightColor: "#b669ff",
            hiddenBackgroundColor: "#aaf"
        },
    nseThemeDarkPurple:
        {
            backgroundColor: "#31363b",
            backgroundHighlightColor: "#495057",
            foregroundColor: "#ffffff",
            accentColor: "#7b68ee",
            highlightColor: "#7b68ee",
            hiddenBackgroundColor: "#aaf"
        },
    nseThemeCustom:
        {
            backgroundColor: nseCustomTheme.backgroundColor,
            backgroundHighlightColor: nseCustomTheme.backgroundHighlightColor,
            foregroundColor: nseCustomTheme.foregroundColor,
            accentColor: nseCustomTheme.accentColor,
            highlightColor: nseCustomTheme.highlightColor,
            hiddenBackgroundColor: nseCustomTheme.hiddenBackgroundColor
        }
};

let nseThemeDescriptions = {
    nseThemeDefault: "White background with black text and blue accents",
    nseThemeLegacy: "Ye Olde Theme with a blue background and white text",
    nseThemeEdgy: "For the edgelord in all of us, red text on a black background",
    nseThemeBaked: "Ayyyy 420 blaze it &mdash; Green and purple",
    nseThemeDarkPurple: "A dark mode theme with purple highlights",
    nseThemeCustom: "Define your own colors using the text boxes below"
};

//   Extras
let nseRenumberTorrentsEnabled = GM_getValue("nseRenumberTorrentsEnabled", true);
let nseHideCategoryIconsEnabled = GM_getValue("nseHideCategoryIconsEnabled", false);
let nseArrowNavigationEnabled = GM_getValue("nseArrowNavigationEnabled", false);

//   "Fun"
let nseRussianRouletteEnabled = GM_getValue("nseRussianRouletteEnabled", false);
let nseEveryDayIsApril1st = GM_getValue("nseEveryDayIsApril1st", false);


// +------------------------------+
// | Script setup and preparation |
// +------------------------------+

// Figure out what page we're on
let currentPage = "Torrents";
if(window.location.href.includes("top10.php")) {
    currentPage = "Top 10";
} else if(window.location.href.includes("user.php?action=notify")) {
    currentPage = "Notification filters";
} else if(window.location.href.match(/torrents\.php.*(\?|&)(action=notify)/)) {
    currentPage = "Notifications";
} else if(window.location.href.match(/torrents\.php.*(\?|&)(id=)/)) {
    currentPage = "Torrent details";
} else if(window.location.href.includes("/collage/")) {
    currentPage = "Collage";
} else if(window.location.href.includes("/requests.php")) {
    currentPage = "Requests";
} else if(window.location.href.includes("type=uploaded")) {
    // Check if we are on our own uploaded page
    let myUserID = document.querySelector(".username").href.match(/id=([0-9]+)/)[1];
    let pageUserID = window.location.href.match(/userid=([0-9]+)/)[1];

    if(myUserID === pageUserID) {
        currentPage = "My uploaded";
    } else {
        currentPage = "Uploaded";
    }
}

// Define which of our pages where filtering doesn't apply, but other functionality should work
let nseUnfilteredPages = ["My uploaded", "Notification filters", "Torrent details"];

// Reenable torrent icon box and hide comments if GCD is running, check for its unique elements a.comment
if(currentPage == "Torrents") { //torrents.php is the only page we have in common
    window.setTimeout(function() {
        if(document.querySelector("a.comment")) {
            GM_addStyle(`
                span.torrent_icon_container {
                    display: flex !important;
                }
            `);

            for(let i = 0; i < torrents.length; i++) {
                let gcdCommentElement = torrents[i].querySelector("td > div > a.comment");
                let clmCommentElement = torrents[i].querySelector("td:nth-child(4)");

                if(gcdCommentElement) {
                    clmCommentElement.innerHTML = "";
                    clmCommentElement.appendChild(gcdCommentElement);
                }
                
            }
        }
    }, nseTimeout);
}

let nseEnableApril1stOption = false;
if(nseBlacklistTags.includes("hehehehehe")) {
    nseEnableApril1stOption = true;
}

// Get storage size
window.setTimeout(function() {
    let bytesUsed = exportSettings(true);

    if(bytesUsed < 1024) {
        document.getElementById("nseDataUsage").innerHTML = bytesUsed + " bytes";
    } else {
        document.getElementById("nseDataUsage").innerHTML = Math.round((bytesUsed / 1024) * 100) / 100 + " KiB";
    }
}, nseTimeout);


// Check if we've just updated
if(nseUpdateToastsEnabled) {
    if(nseVersionNum > nseSavedVersion) {
        GM_setValue("nseSavedVersion", nseVersionNum); // Update saved version so toast is only shown once

        let updateToast = document.createElement("div");
        updateToast.innerHTML = `
            <div id="nseUpdateToast">  
                <div class="nseUpdateToastDiv">
                    <big>Hooray! NoShitEmpornium was just updated to <b>v${GM_info.script.version}</b>!</big>
                </div>

                <div class="nseUpdateToastDiv">
                    <span class="nseNiceButton" id="nseSeeWhatsNewButton">
                        <span class="nseEmoji">📋</span> See what's new!
                    </span>
                    
                    <span class="nseNiceButton" id="nseCloseUpdateToastButton">
                        <span class="nseEmoji">❌</span> Close
                    </span>
                    
                    <span class="nseNiceButton" id="nseNeverShowUpdateToastButton">
                        <span class="nseEmoji">🚫</span> Don't show again
                    </span>
                </div>
            </div>
        `;

        let reference = document.querySelector("body > :last-child");
        reference.after(updateToast);

        document.getElementById("nseSeeWhatsNewButton").onclick = function() {
            window.open("https://github.com/ceodoe/noshitempornium/blob/master/CHANGELOG.md#latest-changes",'_blank');
            this.parentNode.parentNode.remove();
        };

        document.getElementById("nseCloseUpdateToastButton").onclick = function() {
            this.parentNode.parentNode.remove();
        };

        document.getElementById("nseNeverShowUpdateToastButton").onclick = function() {
            document.getElementById("nseCheckUpdateToasts").checked = false;
            saveData();
            this.parentNode.parentNode.remove();
        };
    }
}

// +--------------+
// | HTML section |
// +--------------+

// Set up reference node
let referenceNode = document.querySelector("div#filter_slidetoggle"); // Torrents

if(currentPage == "Top 10" || currentPage == "Notification filters") {
    referenceNode = document.querySelector("div.linkbox");
} else if(currentPage == "Notifications") {
    referenceNode = document.querySelector("#content > div > h2");
} else if(currentPage == "Torrent details") {
    referenceNode = document.querySelector(".linkbox");
} else if(currentPage == "Collage") {
    referenceNode = document.querySelector("div.thin > div.clear:nth-child(6)");
} else if(currentPage == "Uploaded" || currentPage == "My uploaded") {
    referenceNode = document.querySelector(".submit");
} else if(currentPage == "Requests") {
    referenceNode = document.querySelector("#search_form");
}

// Die if we can't get a reference node, most likely the site is borked or changed its code
if(!referenceNode) {
    throw "Note: NSE died on the way back to his home planet (referenceNode is null)";
}

let htmlContent = document.createElement("div");
htmlContent.innerHTML = `
<div id="nseOuter" class="nseOuterDiv">
    <div id="nseHeader">
        <span id="nseHeaderText">NoShitEmpornium</span>
        <span id="nseToggleOptionsNode" class="nseNiceButton">Options</span><span id="nseDynamicRefreshNode" class="nseNiceButton hidden" title="Reload the page to apply your changes" onclick="javascript:location.reload();">🗘</span>
    </div>
    <div id="nseMainDiv" class="nseMainBox hidden">
        <input class="nseRadioButton" id="nseTab1" type="radio" name="tabs" checked>
        <label class="nseLabel" for="nseTab1"><span class="nseEmoji">🏷️</span> Tags</label>

        <input class="nseRadioButton" id="nseTab2" type="radio" name="tabs">
        <label class="nseLabel" for="nseTab2"><span class="nseEmoji">📚</span> Titles</label>

        <input class="nseRadioButton" id="nseTab3" type="radio" name="tabs">
        <label class="nseLabel" for="nseTab3"><span class="nseEmoji">👥</span> Uploaders</label>

        <input class="nseRadioButton" id="nseTab4" type="radio" name="tabs">
        <label class="nseLabel" for="nseTab4"><span class="nseEmoji">⚙️</span> Settings</label>

        <section id="nseContent1">
            <div class="nseFieldDiv">
                <span class="nseImageButton nseListHeader" id="nseTagBlacklistHeader"><span class="nseEmoji">👎</span> Tag blacklist <small>(space-separated)</small></span><sup class="nseExplanationToggler" id="nseBLEToggler">[?]</sup><br />
                <div id="nseBLE" class="nseExplanationBox hidden">
                    <div class="nseExplanationNode">
                        <b>TL;DR</b>: <i>If any of these tags exist, hide the torrent</i>
                    </div>

                    <div class="nseExplanationNode">
                        This is where you specify tags you don't want to see. Any torrent matching
                        any of these tags will be hidden unless overridden by any of the whitelist
                        rules. The correct format for this field is the same used for tags on
                        Empornium itself: Tags are separated by spaces, and uses a period between
                        words within a tag. Character case does not matter. Blacklisted tags will be
                        <span class="nseHiddenTag">highlighted</span> when viewing
                        hidden torrents.
                    </div>

                    <div class="nseExplanationNode">
                        Example:<br />
                        <pre>scat piss.drinking jerk.off.instruction non.nude</pre>
                    </div>
                </div>
                <textarea class="nseTextArea" id="nseBlacklistTaglistArea" rows=10>${nseBlacklistTaglist}</textarea>
            </div>
            <div class="nseFieldDiv${nseHardPassEnabled ? '' : ' hidden'}">
                <span class="nseImageButton nseListHeader" id="nseTagHardPassHeader"><span class="nseEmoji">🚫</span> Hard Pass tag blacklist <small>(space-separated)</small></span><sup class="nseExplanationToggler" id="nseHPEToggler">[?]</sup><br />
                <div id="nseHPE" class="nseExplanationBox hidden">
                    <div class="nseExplanationNode">
                        <b>TL;DR</b>: <i>If any of these tags exist, hide the torrent <b>no matter what</b></i>
                    </div>

                    <div class="nseExplanationNode">
                        This is where you specify tags you don't want to see at all. Any torrent
                        matching any of these tags will be hidden unless overridden by individual
                        filtering (clicking the eye icon). The correct format for this field is the
                        same used for tags on Empornium itself: Tags are separated by spaces, and
                        uses a period between words within a tag. Character case does not matter.
                        Hard Pass tags will be <span class="nseHardPassTag">highlighted</span> when viewing hidden torrents. The torrent will be removed completely from the results if the Black Hole
                        option is enabled.
                    </div>

                    <div class="nseExplanationNode">
                        Example:<br />
                        <pre>virtual.reality scat puke blood enema</pre>
                    </div>
                </div>
                <textarea class="nseTextArea" id="nseHardPassTaglistArea" rows=10>${nseHardPassTaglist}</textarea>
            </div>
            <div class="nseFieldDiv">
                <span class="nseImageButton nseListHeader" id="nseTagWhitelistHeader"><span class="nseEmoji">👍</span> Tag whitelist <small>(space-separated)</small></span><sup class="nseExplanationToggler" id="nseWLEToggler">[?]</sup><br />
                <div id="nseWLE" class="nseExplanationBox hidden">
                    <div class="nseExplanationNode">
                        <b>TL;DR</b>: <i>If any of these tags exist, ignore all other rules and show the torrent</i>
                    </div>

                    <div class="nseExplanationNode">
                        This is where you specify tags you want to show regardless of all other
                        rules. In other words, no matter if the torrent matches on tags, title or
                        uploader blacklists &mdash; if it contains any of these whitelisted tags, it
                        will be shown regardless. The correct format for this field is the same used
                        for tags on Empornium itself: Tags are separated by spaces, and uses a
                        period between words within a tag. Character case does not matter.
                        Whitelisted tags will be <span class="nseWhitelistedTag">highlighted</span>.
                    </div>

                    <div class="nseExplanationNode">
                        Example:<br />
                        <pre>sasha.grey huge.ass gianna.michaels femdom</pre>
                    </div>
                </div>
                <textarea class="nseTextArea" id="nseWhitelistTaglistArea" rows=10>${nseWhitelistTaglist}</textarea>
            </div>
        </section>

        <section id="nseContent2">
            <div class="nseFieldDiv">
                <span class="nseImageButton nseListHeader" id="nseTitleBlacklistHeader"><span class="nseEmoji">👎</span> Title blacklist <small>(semicolon-separated)</small></span><sup class="nseExplanationToggler" id="nseTitleBLEToggler">[?]</sup><br />
                <div id="nseTitleBLE" class="nseExplanationBox hidden">
                    <div class="nseExplanationNode">
                        <b>TL;DR</b>: <i>If any of these phrases are in the title, hide the torrent</i>
                    </div>

                    <div class="nseExplanationNode">
                        This is where you specify title phrases you want to filter on. This is
                        useful for hiding untagged content with a recurring theme (for example
                        specific JAV series you don't care about, or re-encoded content).
                        Character case does not matter. <b>Title phrases are separated by
                        semicolons <span class="nseMonospace">;</span> &mdash; not spaces, unlike
                        tags or uploaders!</b>
                    </div>

                    <div class="nseExplanationNode">
                        Example:<br />
                        <pre>sdmm;hikr;princess peach;reencode</pre>
                    </div>
                </div>
                <textarea class="nseTextArea" id="nseBlacklistTitleListArea" rows=10>${nseBlacklistTitleList}</textarea>
            </div>
            <div class="nseFieldDiv${nseHardPassEnabled ? '' : ' hidden'}">
                <span class="nseImageButton nseListHeader" id="nseTitleHardPassHeader"><span class="nseEmoji">🚫</span> Hard Pass title blacklist <small>(semicolon-separated)</small></span><sup class="nseExplanationToggler" id="nseHPTEToggler">[?]</sup><br />
                <div id="nseHPTE" class="nseExplanationBox hidden">
                    <div class="nseExplanationNode">
                        <b>TL;DR</b>: <i>If any of these phrases exist in the title, hide the torrent <b>no matter what</b></i>
                    </div>

                    <div class="nseExplanationNode">
                        This is where you specify title phrases you don't want to see at all. Any torrent
                        matching any of these phrases in the title will be hidden unless overridden by individual filtering (clicking the eye icon). Character case does not matter. <b>Title phrases are separated by semicolons <span class="nseMonospace">;</span> &mdash; not spaces like tags or uploaders!</b> Hard Pass title phrases will be <span class="nseHardPassTag">highlighted</span> when viewing hidden torrents. The torrent will be removed completely from the results if the Black Hole
                        option is enabled.
                    </div>

                    <div class="nseExplanationNode">
                        Example:<br />
                        <pre>sdmm;hikr;princess peach;reencode</pre>
                    </div>
                </div>
                <textarea class="nseTextArea" id="nseHardPassTitleListArea" rows=10>${nseHardPassTitleList}</textarea>
            </div>
            <div class="nseFieldDiv">
                <span class="nseImageButton nseListHeader" id="nseTitleWhitelistHeader"><span class="nseEmoji">👍</span> Title whitelist <small>(semicolon-separated)</small></span><sup class="nseExplanationToggler" id="nseTitleWLEToggler">[?]</sup><br />
                <div id="nseTitleWLE" class="nseExplanationBox hidden">
                    <div class="nseExplanationNode">
                        <b>TL;DR</b>: <i>If any of these phrases are in the title, ignore all other rules and show the torrent</i>
                    </div>

                    <div class="nseExplanationNode">This is where you specify title phrases you want to show regardless of other rules. Character case does not matter. <b>Title phrases are separated by semicolons <span class="nseMonospace">;</span> &mdash; not spaces like tags or uploaders!</b>
                    </div>

                    <div class="nseExplanationNode">Example:<br /><pre>minipack;super mario;sdmm;moist</pre></div>
                </div>
                <textarea class="nseTextArea" id="nseWhitelistTitleListArea" rows=10>${nseWhitelistTitleList}</textarea>
            </div>
        </section>

        <section id="nseContent3">
            <div class="nseFieldDiv">
                <span class="nseImageButton nseListHeader" id="nseUploaderBlacklistHeader"><span class="nseEmoji">👎</span> Uploader blacklist <small>(space-separated)</small></span><sup class="nseExplanationToggler" id="nseUBLEToggler">[?]</sup><br />
                <div id="nseUBLE" class="nseExplanationBox hidden">
                    <div class="nseExplanationNode">
                        <b>TL;DR</b>: <i>If this torrent is uploaded by any of these users, hide it</i>
                    </div>

                    <div class="nseExplanationNode">
                        This is where you specify the names of uploaders you want to hide all
                        uploads from, unless overriden by a whitelist rule. Uploader names will be
                        <span class="nseHiddenUploader">highlighted</span> when viewing
                        hidden torrents. Character case does not matter. Note that filtering based
                        on usernames will not function on collage or user upload pages, as torrent 
                        uploaders are not exposed on those pages.
                    </div>

                    <div class="nseExplanationNode">
                        Example:<br />
                        <pre>SuperUploader2007 LowQualityUploadsIncorporated</pre>
                    </div>
                </div>
                <textarea class="nseTextArea" id="nseBlacklistUploadersArea" rows=10>${nseBlacklistUploadersList}</textarea>
            </div>
            <div class="nseFieldDiv">
                <span class="nseImageButton nseListHeader" id="nseUploaderWhitelistHeader"><span class="nseEmoji">👍</span> Uploader whitelist <small>(space-separated)</small></span><sup class="nseExplanationToggler" id="nseUWLEToggler">[?]</sup><br />
                <div id="nseUWLE" class="nseExplanationBox hidden">
                    <div class="nseExplanationNode">
                        <b>TL;DR</b>: <i>If this torrent is uploaded by any of these users, show it regardless of any other rules</i>
                    </div>

                    <div class="nseExplanationNode">
                        This is where you specify the names of uploaders you want to show all
                        uploads from, regardless of any blacklist rules. Uploader names will be
                        <span class="nseWhitelistedUploader">highlighted</span>. Character
                        case does not matter. Note that filtering based on usernames will not
                        function on collage or user upload pages, as torrent uploaders are not 
                        exposed on those pages.
                    </div>

                    <div class="nseExplanationNode">
                        Example:<br />
                        <pre>NobelPrizeWinningUploads ActuallyGreatUploader69 ceodoe</pre>
                    </div>
                </div>
                <textarea class="nseTextArea" id="nseWhitelistUploadersArea" rows=10>${nseWhitelistUploadersList}</textarea>
            </div>
        </section>

        <section id="nseContent4">
            <input class="nseRadioButton" id="nseSettingsTab1" type="radio" name="settingsTabs" checked>
            <label class="nseLabel" for="nseSettingsTab1"><span class="nseEmoji">🔍</span> Filtering</label>

            <input class="nseRadioButton" id="nseSettingsTab2" type="radio" name="settingsTabs">
            <label class="nseLabel" for="nseSettingsTab2"><span class="nseEmoji">🖥️</span> Interface</label>

            <input class="nseRadioButton" id="nseSettingsTab3" type="radio" name="settingsTabs">
            <label class="nseLabel" for="nseSettingsTab3"><span class="nseEmoji">🗃️</span> Data management</label>

            <input class="nseRadioButton" id="nseSettingsTab4" type="radio" name="settingsTabs">
            <label class="nseLabel" for="nseSettingsTab4"><span class="nseEmoji">ℹ️</span> About</label>

            <section id="nseSettingsContent1">
                <h3 class="nseH3">Filtering</h3>
                <b>Individual uploads</b><br />
                <input type="checkbox" id="nseCheckIndividualHide"${nseIndividualUploadHidingEnabled ? ' checked' : ''} />
                <label for="nseCheckIndividualHide" class="nseSettingsCheckbox">
                    <span class="nseEmoji">👁️</span> Enable individual upload filtering
                </label><br />
                <span class="nseExplanationSpan nseESOffset">(Click the eye icon next to the torrent name to blacklist/whitelist uploads</span><br />
                <span class="nseExplanationSpan nseESOffset">individually, ignoring <b>all</b> other rules. These filters are automatically saved)</span><br /><br />

                <input type="checkbox" id="nseCheckFilterAllButtonEnabled"${nseFilterAllButtonEnabled ? ' checked' : ''} />
                <label for="nseCheckFilterAllButtonEnabled" class="nseSettingsCheckbox">
                    <span class="nseEmoji">👁️</span> Enable "Filter all unfiltered results" button
                </label><br />
                <span class="nseExplanationSpan nseESOffset">(Requires individual upload filtering to be enabled to function)</span>
                <br /><br />


                <b>List management</b><br />
                <input type="checkbox" id="nseCheckRightClickManagementEnabled"${nseRightClickManagementEnabled ? ' checked' : ''} />
                <label for="nseCheckRightClickManagementEnabled" class="nseSettingsCheckbox">
                    <span class="nseEmoji">🖱️</span> Enable Right-Click Management (RCM)
                </label>
                                
                <div id="nseRCMCustomizationDiv" ${nseRightClickManagementEnabled ? '' : 'class="hidden"'}>
                    <span class="nseESOffset">
                        <input type="checkbox" id="nseCheckRCMTagsEnabled"${nseRCMTagsEnabled ? ' checked' : ''} />
                        <label for="nseCheckRCMTagsEnabled" class="nseSettingsCheckbox">
                            <span class="nseEmoji">🏷️</span> Enable for tags
                        </label><br />
                    </span>
                        
                    <span class="nseESOffset">
                        <input type="checkbox" id="nseCheckRCMTitlesEnabled"${nseRCMTitlesEnabled ? ' checked' : ''} />
                        <label for="nseCheckRCMTitlesEnabled" class="nseSettingsCheckbox">
                            <span class="nseEmoji">📚</span> Enable for titles
                        </label><br />
                    </span>
                    
                    <span class="nseESOffset">
                        <input type="checkbox" id="nseCheckRCMUploadersEnabled"${nseRCMUploadersEnabled ? ' checked' : ''} />
                        <label for="nseCheckRCMUploadersEnabled" class="nseSettingsCheckbox">
                            <span class="nseEmoji">👥</span> Enable for uploaders
                        </label>
                    </span>
                </div><br />

                <span class="nseExplanationSpan">Right-click a tag/title/uploader in the torrent list to add/remove from your lists.</span><br /><br />
                
                <b>Torrent site status</b><br />
                <input type="checkbox" id="nseCheckHideAnonUploads"${nseHideAnonUploadsEnabled ? ' checked' : ''} />
                <label for="nseCheckHideAnonUploads" class="nseSettingsCheckbox">
                    <span class="nseEmoji">👤</span> Hide all anonymous uploads
                </label>
                <span class="nseExplanationSpan">(Will still be overridden by whitelist rules)</span><br />

                <input type="checkbox" id="nseCheckHideReported"${nseHideReportedEnabled ? ' checked' : ''} />
                <label for="nseCheckHideReported" class="nseSettingsCheckbox">
                    <span class="nseEmoji">⛔</span> Hide reported uploads
                </label>
                <span class="nseExplanationSpan">(Hide torrents with active reports, whitelists will override)</span><br />

                <input type="checkbox" id="nseCheckHideWarned"${nseHideWarnedEnabled ? ' checked' : ''} />
                <label for="nseCheckHideWarned" class="nseSettingsCheckbox">
                    <span class="nseEmoji">⚔️</span> Hide warned uploads
                </label>
                <span class="nseExplanationSpan">(Hide torrents with active warning, whitelists will override)</span><br />

                <input type="checkbox" id="nseCheckHideUnseeded"${nseHideUnseededEnabled ? ' checked' : ''} />
                <label for="nseCheckHideUnseeded" class="nseSettingsCheckbox">
                    <span class="nseEmoji">🏜️</span> Hide unseeded uploads
                </label>
                <span class="nseExplanationSpan">(Hide torrents with zero seeders, whitelists will override)</span><br /><br />

                <b>Torrent personal status</b><br />
                <input type="checkbox" id="nseCheckHideGrabbed"${nseHideGrabbedEnabled ? ' checked' : ''} />
                <label for="nseCheckHideGrabbed" class="nseSettingsCheckbox">
                    <span class="nseEmoji">💾</span> Hide grabbed uploads
                </label>
                <span class="nseExplanationSpan">(Hide torrents you have previously grabbed)</span><br />

                <input type="checkbox" id="nseCheckHideLeeching"${nseHideLeechingEnabled ? ' checked' : ''} />
                <label for="nseCheckHideLeeching" class="nseSettingsCheckbox">
                    <span class="nseEmoji">⏬</span> Hide leeching uploads
                </label>
                <span class="nseExplanationSpan">(Hide torrents you are currently leeching)</span><br />

                <input type="checkbox" id="nseCheckHideSeeding"${nseHideSeedingEnabled ? ' checked' : ''} />
                <label for="nseCheckHideSeeding" class="nseSettingsCheckbox">
                    <span class="nseEmoji">⏫</span> Hide seeding uploads
                </label>
                <span class="nseExplanationSpan">(Hide torrents you are currently seeding)</span><br />

                <input type="checkbox" id="nseCheckHideSnatched"${nseHideSnatchedEnabled ? ' checked' : ''} />
                <label for="nseCheckHideSnatched" class="nseSettingsCheckbox">
                    <span class="nseEmoji">💽</span> Hide snatched uploads
                </label>
                <span class="nseExplanationSpan">(Hide torrents you have already downloaded/snatched)</span><br />

                <input type="checkbox" id="nseCheckHideBookmarked"${nseHideBookmarkedEnabled ? ' checked' : ''} />
                <label for="nseCheckHideBookmarked" class="nseSettingsCheckbox">
                    <span class="nseEmoji">⭐</span> Hide bookmarked uploads
                </label>
                <span class="nseExplanationSpan">(Hide torrents you have previously bookmarked)</span><br /><br />

                <input type="checkbox" id="nseCheckBypassWhitelists"${nseBypassWhitelistsEnabled ? ' checked' : ''} />
                <label for="nseCheckBypassWhitelists" class="nseSettingsCheckbox">
                    <span class="nseEmoji">💫</span> Bypass whitelists for personal status filtering
                </label><br />
                <span class="nseExplanationSpan nseESOffset">(Ignore all whitelists when filtering grabbed/leeching/seeding/snatched torrents)</span><br /><br />

                <b>Hard Pass</b><br />
                <input type="checkbox" id="nseCheckHardPassEnabled"${nseHardPassEnabled ? ' checked' : ''} />
                <label for="nseCheckHardPassEnabled" class="nseSettingsCheckbox">
                    <span class="nseEmoji">🚫</span> Hard Pass
                </label><span class="nseExplanationSpan">(Enable the Hard Pass blacklists, found in the "Tags" and "Titles" tabs)</span><br />
                <input type="checkbox" id="nseCheckRemoveHardPassResults"${nseRemoveHardPassResults ? ' checked' : ''} />
                <label for="nseCheckRemoveHardPassResults" class="nseSettingsCheckbox">
                    <span class="nseEmoji">⚫</span> Black Hole
                </label><span class="nseExplanationSpan">(Remove results instead of hiding them behind the toggle)</span><br /><br />
                <span class="nseExplanationSpan">Hard Pass enables extra blacklists that will make sure that torrents with the given tags or title phrases will be hidden no matter what. The only thing that can override Hard Pass is whitelisting a torrent through individual filtering when Black Hole is disabled. Enable the Black Hole option to remove results from the page entirely.</span><br /><br />
            </section>

            <section id="nseSettingsContent2">
                <h3 class="nseH3">Interface</h3>

                <div>
                    <input type="checkbox" id="nseCheckObliviousMode"${nseObliviousModeEnabled ? ' checked' : ''} />
                    <label for="nseCheckObliviousMode" class="nseSettingsCheckbox">
                        <span class="nseEmoji">❓</span> Oblivious
                    </label>
                    <span class="nseExplanationSpan">(Hide torrent tag lists)</span><br />

                    <input type="checkbox" id="nseCheckCustomCSS"${nseCustomCSSEnabled ? ' checked' : ''} />
                    <label for="nseCheckCustomCSS" class="nseSettingsCheckbox">
                        <span class="nseEmoji">📜</span> Custom CSS
                    </label>
                    <span class="nseExplanationSpan">(Define your own CSS rules)</span><br />
                    <div id="nseCustomCSSDiv" ${nseCustomCSSEnabled ? '' : 'class="hidden"'}>
                        Define your custom CSS below. Note that this code is injected at the very end of the built-in CSS, so use the !important tag liberally to overwrite existing rules. Do not escape backslashes, it will be done automatically. Avoid using backticks. <br />
                        <textarea class="nseTextArea" id="nseCustomCSSArea" rows=10>${nseCustomCSS.replace(/\\\\/gi,"\\")}</textarea>
                    </div>

                    <input type="checkbox" id="nseCheckScrollToNSEEnabled"${nseScrollToNSEEnabled ? ' checked' : ''} />
                    <label for="nseCheckScrollToNSEEnabled" class="nseSettingsCheckbox">
                        <span class="nseEmoji">⚓</span> Automatically scroll to NSE on page load
                    </label>
                    <span class="nseExplanationSpan">(Makes browsing several pages easier)</span><br />

                    <input type="checkbox" id="nseCheckEmojiEnabled"${nseEmojiEnabled ? ' checked' : ''} />
                    <label for="nseCheckEmojiEnabled" class="nseSettingsCheckbox">
                        <span class="nseEmoji">🖼️</span> Enable extended Unicode icons ("emoji")
                    </label>
                    <span class="nseExplanationSpan">(Disable if you see garbled characters)</span><br />
                    
                    <input type="checkbox" id="nseCheckUpdateToasts"${nseUpdateToastsEnabled ? ' checked' : ''} />
                    <label for="nseCheckUpdateToasts" class="nseSettingsCheckbox">
                        <span class="nseEmoji">❗</span> Notify me when NSE is updated
                    </label>
                    <span class="nseExplanationSpan">(Get changelog info on update)</span><br />

                    <input type="checkbox" id="nseCheckFloatingToggleButton"${nseFloatingToggleButtonEnabled ? ' checked' : ''} />
                    <label for="nseCheckFloatingToggleButton" class="nseSettingsCheckbox">
                        <span class="nseEmoji">🛟</span> Enable the floating toggle button on the bottom right of the page
                    </label><br />

                    <input type="checkbox" id="nseCheckOpenAllButton"${nseOpenAllButtonEnabled ? ' checked' : ''} />
                    <label for="nseCheckOpenAllButton" class="nseSettingsCheckbox">
                        <span class="nseEmoji">📂</span> Enable the "Open all unfiltered results" button
                    </label><br />
                    <span class="nseExplanationSpan nseESOffset">(Appears under the NSE options area. If your browser tells you it blocked Emp</span><br />
                    <span class="nseExplanationSpan nseESOffset">from opening popups, click the Preferences button and allow popups for Emp)</span><br />
                    
                    <input type="checkbox" id="nseCheckOpenAllGoNext"${nseOpenAllGoNextEnabled ? ' checked' : ''} />
                    <label for="nseCheckOpenAllGoNext" class="nseSettingsCheckbox">
                        <span class="nseEmoji">➡️</span> Automatically go to next results page after clicking "Open all" button
                    </label><br /><br />

                    <br />

                    User interface font family: <br />
                    <input type="text" class="nseInput" value="${nseUIFont}" id="nseUIFont" /> <span class="nseExplanationSpan">(Corresponds to the <a class="nseLink" href="https://developer.mozilla.org/en-US/docs/Web/CSS/font-family" target="_blank"><b><u>CSS font-family property</u></b></a>)</span>
                    <br /><br />

                    Filter list font family: <br />
                    <input type="text" class="nseInput" value="${nseTextAreaFont}" id="nseTextAreaFont" /> <span class="nseExplanationSpan">(Font for black/whitelists textareas)</span>
                    <br /><br />

                    
                    Highlight color for blacklisted elements: <br />
                    <input type="text" class="nseInput" value="${nseBlacklistColor}" id="nseBlacklistColor" /> <span class="nseExplanationSpan">(You can use any <a class="nseLink" href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value" target="_blank"><b><u>CSS color notation</u></b></a> here)</span>
                    <br /><br />
                    
                    Highlight color for Hard Pass tags: <br />
                    <input type="text" class="nseInput" value="${nseHardPassColor}" id="nseHardPassColor" />
                    <br /><br />
                    
                    Highlight color for whitelisted elements: <br />
                    <input type="text" class="nseInput" value="${nseWhitelistColor}" id="nseWhitelistColor" />
                    <br /><br />

                    Timeout for timed functions (milliseconds): <br />
                    <input type="text" class="nseInput" style="width: 50px;" value="${nseTimeout}" id="nseTimeout" /> <span class="nseExplanationSpan">(Used for GCD support and computing storage size)</span>
                    <br /><br />


                    Theme:<br />
                    <select name="nseThemeDropdown" id="nseThemeDropdown" class="nseInput">
                        <option value="nseThemeDefault" ${nseSelectedTheme=="nseThemeDefault" ? "selected='selected'" : ''}>Default</option>
                        <option value="nseThemeLegacy" ${nseSelectedTheme=="nseThemeLegacy" ? "selected='selected'" : ''}>Legacy</option>
                        <option value="nseThemeEdgy" ${nseSelectedTheme=="nseThemeEdgy" ? "selected='selected'" : ''}>Edgy</option>
                        <option value="nseThemeBaked" ${nseSelectedTheme=="nseThemeBaked" ? "selected='selected'" : ''}>Baked</option>
                        <option value="nseThemeDarkPurple" ${nseSelectedTheme=="nseThemeDarkPurple" ? "selected='selected'" : ''}>Dark Purple</option>
                        <option value="nseThemeCustom" ${nseSelectedTheme=="nseThemeCustom" ? "selected='selected'" : ''}>Custom</option>
                    </select>
                    <span id="nseThemeDescription" class="nseExplanationSpan">${nseThemeDescriptions[nseSelectedTheme]}</span>

                    <div id="nseCustomThemeDiv" ${nseSelectedTheme=="nseThemeCustom" ? '' : 'class="hidden"'}>
                        <p>
                            You can use any <a class="nseLink" href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value" target="_blank">CSS color notation</a> here.<br />
                            Examples: <span class="nseMonospace">#ffffff &mdash; rgb(0,0,255) &mdash; aquamarine</span>
                        </p>
                        <p>
                            Background color:<br />
                            <input type="text" class="nseInput" id="nseCustomThemeBgCol" value='${nseCustomTheme.backgroundColor}' />
                        </p>
                        <p>
                            Background highlight color:<br />
                            <input type="text" class="nseInput" id="nseCustomThemeBgHighCol" value='${nseCustomTheme.backgroundHighlightColor}' />
                        </p>
                        <p>
                            Foreground color:<br />
                            <input type="text" class="nseInput" id="nseCustomThemeForeCol" value='${nseCustomTheme.foregroundColor}' />
                        </p>
                        <p>
                            Accent color:<br />
                            <input type="text" class="nseInput" id="nseCustomThemeAccentCol" value='${nseCustomTheme.accentColor}' />
                        </p>
                        <p>
                            Highlight color:<br />
                            <input type="text" class="nseInput" id="nseCustomThemeHighCol" value='${nseCustomTheme.highlightColor}' />
                        </p>
                        <p>
                            Hidden torrent background color:<br />
                            <input type="text" class="nseInput" id="nseCustomThemeHiddenBgCol" value='${nseCustomTheme.hiddenBackgroundColor}' />
                        </p>

                        <p>Remember to click the [Save] button to save your changes!</p>
                    </div>
                </div>

                <div class="nseTopAiryDiv">
                    <b>Extras</b><br />
                    <input type="checkbox" id="nseCheckRenumberTorrents"${nseRenumberTorrentsEnabled ? ' checked' : ''} />
                    <label for="nseCheckRenumberTorrents" class="nseSettingsCheckbox">
                        <span class="nseEmoji">🔢</span> Renumber torrents on "Top X" pages
                    </label>
                    <span class="nseExplanationSpan">(Fixes torrent numbering after filtering)</span><br />
                    
                    <input type="checkbox" id="nseCheckHideCategoryIcons"${nseHideCategoryIconsEnabled ? ' checked' : ''} />
                    <label for="nseCheckHideCategoryIcons" class="nseSettingsCheckbox">
                        <span class="nseEmoji">🟪</span> Hide category icons
                    </label>
                    <span class="nseExplanationSpan">(Hides category icons/links in torrent lists)</span><br />
                    
                    <input type="checkbox" id="nseCheckArrowNavigation"${nseArrowNavigationEnabled ? ' checked' : ''} />
                    <label for="nseCheckArrowNavigation" class="nseSettingsCheckbox">
                        <span class="nseEmoji">⌨️</span> Navigate paginated torrent lists with keyboard arrow keys
                    </label><br />
                    <span class="nseExplanationSpan nseESOffset">(Note that NSE only runs on torrent lists, if you want</span><br />
                    <span class="nseExplanationSpan nseESOffset">arrow key navigation globally on Empornium, use <a class="nseLink" href="https://github.com/ceodoe/noshitempornium/raw/master/GlobalArrowKeyNavigation.user.js" target="_blank"><b><u>this script</u></b></a>)</span>
                </div>

                <div class="nseTopAiryDiv nseBtmAiryDiv">
                    <b>"Fun"</b><br />
                    <input type="checkbox" id="nseCheckRussianRouletteMode"${nseRussianRouletteEnabled ? ' checked' : ''} />
                    <label for="nseCheckRussianRouletteMode" class="nseSettingsCheckbox">
                        <span class="nseEmoji">🎲</span> Russian Roulette
                    </label>
                    <span class="nseExplanationSpan">(Randomly and silently show filtered torrents)</span><br />

                    ${nseEnableApril1stOption ? `<input type="checkbox" id="nseCheckApril1stAllYear"${nseEveryDayIsApril1st ? ' checked' : ''} />
                    <label for="nseCheckApril1stAllYear" class="nseSettingsCheckbox">
                        <span class="nseEmoji">🤪</span> Every day is April 1st
                    </label>
                    <span class="nseExplanationSpan">(For the masochists among us)</span>` : ''}
                </div>
            </section>

            <section id="nseSettingsContent3">
                <h3 class="nseH3">Data management</h3>
                <p>
                    <span class="nseExplanationSpan">Use these functions to import, export or reset all your NSE lists and settings.</span><br /><br />

                    NSE is currently using <span id="nseDataUsage"></span> of data in your LocalStorage.

                    <div class="nseNiceBox"><span class="nseEmoji">⤵️</span> Import NSE data<br />
                        <input type="file" accept=".json,text/plain" id="nseImportFilePicker" class="nseInput">
                    </div><br />
                    <span class="nseNiceButton" id="nseExportButton"><span class="nseEmoji">⤴️</span> Export NSE data</span> 
                    <span class="nseNiceButton" id="nseEraseDataButton"><span class="nseEmoji">🔄</span> Reset NSE data</span><br /><br />
                    
                    <span class="nseExplanationSpan"><b>IMPORTANT: Data overwritten or reset by the functions above is <i>not</i> recoverable!</b></span>
                </p>
            </section>

            <section id="nseSettingsContent4">
                <h3 class="nseH3">About</h3>
                <p>
                    Copyright &copy; 2015-2026 ceodoe. NoShitEmpornium v${GM_info.script.version} was made with ${nseEmojiEnabled ? '💕' : 'love'} by <a class="nseLink" href="/user.php?id=508194">ceodoe</a> of Empornium, and its code is licensed under the <a class="nseLink" href="https://www.gnu.org/licenses/gpl-3.0.txt" target="_blank">GNU General Public License v3.0</a>.
                </p>

                <h3 class="nseH3">Statistics</h3>
                <p>
                    <span class="nseExplanationSpan">This section is populated when the page loads, and does not reflect changes done thereafter.</span><br />
                    <br />
                    Number of blacklisted tags: <span class="nseHiddenTag">${nseBlacklistTags.length}</span><br />
                    ${nseHardPassEnabled ? `Number of Hard Pass tags: <span class="nseHiddenTag">${nseHardPassTags.length}</span><br />` : ""}
                    Number of blacklisted title phrases: <span class="nseHiddenTag">${nseBlacklistTitlePhrases.length}</span><br />
                    Number of blacklisted uploaders: <span class="nseHiddenTag">${nseBlacklistUploaders.length}</span><br />
                    ${nseIndividualUploadHidingEnabled ? `Number of individually blacklisted torrents: <span class="nseHiddenTag">${nseIndividualUploadHidingBlacklist.length}</span><br />` : ""}
                    <br />
                    Number of whitelisted tags: <span class="nseWhitelistedTag">${nseWhitelistTags.length}</span><br />
                    Number of whitelisted title phrases: <span class="nseWhitelistedTag">${nseWhitelistTitlePhrases.length}</span><br />
                    Number of whitelisted uploaders: <span class="nseWhitelistedTag">${nseWhitelistUploaders.length}</span><br />
                    ${nseIndividualUploadHidingEnabled ? `Number of individually whitelisted torrents: <span class="nseWhitelistedTag">${nseIndividualUploadHidingWhitelist.length}</span><br />` : ""}
                </p>

                <h3 class="nseH3">Resources</h3>
                <p>
                    <b>
                        <span class="nseEmoji">🧵</span> <a class="nseLink" href="/forum/thread/44258?postid=956045#post956045" target="_blank">Read the official thread on the Empornium forums</a><br />

                        <span class="nseEmoji">🐙</span> <a class="nseLink" href="https://github.com/ceodoe/noshitempornium" target="_blank">Report a bug or view commit history on GitHub</a><br />
                        
                        <span class="nseEmoji">📋</span> <a class="nseLink" href="https://github.com/ceodoe/noshitempornium/blob/master/CHANGELOG.md#latest-changes" target="_blank">Read the changelog</a><br />
                    </b>
                </p>

                <h3 class="nseH3">Contribute</h3>
                <p>
                    If you love NSE, consider a donation! I've spent a lot of time making this, and any sum is hugely appreciated. Credits on the site is also appreciated.<br /> <br />

                    Bitcoin (BTC): <span class="nseMonospace"><small>15YM9XCe5isbf1T8TBjku1BYmyNTj1ZyX9</small></span><br />
                    Bitcoin Cash (BCH): <span class="nseMonospace"><small>qqcuude6a6q09r0a6ujvvklzm6qjrxtr5vfwkxrk34</small></span><br />
                    Ethereum (ETH): <span class="nseMonospace"><small>0xD66eB1CafE88f299929b4FCedCCac3B3D9d7Bee1</small></span><br />
                    Stellar (XLM): <span class="nseMonospace"><small>GD7KXIYO3FTINLBXIJCBMOXVMO4DCXNSLFJTEAIILZAODEMDQRSOT532</small></span>
                    <br /><br />

                    You can also contribute by reporting bugs, submitting feature requests, pull requests, or just generally using NSE to its fullest. Thanks for using my software!
                </p>

                <p></p>
            </section>
        </section>

        <div class="nseSettingsControlDiv">
            <span id="nseSaveButton" class="nseNiceButton"><span class="nseEmoji">💾</span> Save</span>
            <span id="nseReloadButton" class="nseNiceButton"><span class="nseEmoji">🔃</span> Reload page and apply changes</span> 
            <span id="nseCloseOptionsButton" class="nseNiceButton"><span class="nseEmoji">❌</span> Close options</span>
        </div>

        <div class="nseSettingsControlDiv" id="nseSaveDiv" class="hidden">

        </div>
    </div>
</div>

${!nseUnfilteredPages.includes(currentPage) && (nseOpenAllButtonEnabled || (nseFilterAllButtonEnabled && nseIndividualUploadHidingEnabled)) ? `
    <div class="nseTopAiryDiv nseBtmAiryDiv nseCenterDiv">
    ${nseOpenAllButtonEnabled ? `
        <div style="display: inline;">
            <span class="nseNiceButton" id="nseOpenAllButton">
                <span class="nseEmoji">📂</span>
                Open all unfiltered results
            </span>
        </div>
    ` : ''}

    ${nseFilterAllButtonEnabled && nseIndividualUploadHidingEnabled ? `
        <div style="display: inline;">
            <span class="nseNiceButton" id="nseFilterAllButton">
                <span class="nseEmoji">👁</span>
                Filter all unfiltered results
            </span>
        </div>
    ` : ''}
    </div>
` : ''}


<div id="nseRCMBox" class="hidden">
    <div id="nseRCMClose">${nseEmojiEnabled ? '❌' : '<span class="nseHiddenTag"><b><big>X</big></b></span>'}</div>
    <p id="nseRCMBoxInfoText">Tag/uploader placeholder text</p>
    <p id="nseRCMBoxChoices">

    </p>
    <p><small>Your settings will be automatically saved when you choose one of the above options. Your changes will reflect in the torrent list once the page is <span class="nseSpanLink" onclick="location.reload();"><b>reloaded</b></a>.</small></p>
</div>
`;

referenceNode.after(htmlContent);

// Do this before filtering in case it takes a while to filter the page
if(nseScrollToNSEEnabled) {
    document.getElementById("nseOuter").scrollIntoView();
}

// Add floating toggle button if enabled
if(nseFloatingToggleButtonEnabled && !nseUnfilteredPages.includes(currentPage)) {
    document.querySelector("body").insertAdjacentHTML("afterbegin", `
        <div id="nseFloatyBoi">
            <span class="nseEmoji" alt="Toggle hidden torrents" title="Toggle hidden torrents">👁️</span>
        </div>
    `);
    document.querySelector("#nseFloatyBoi").addEventListener("click", function() { toggleTorrents(); });
}

// Set up elements for "Notification filters" page
if(currentPage == "Notification filters") {
    let textareas = document.querySelectorAll("textarea.long");

    for(let i = 0; i < textareas.length; i++) {
        let newElement = document.createElement("p");
        newElement.classList.add("min_padding");
        newElement.style.marginTop = "10px";
        
        if(textareas[i].name == "tags") {    
            newElement.innerHTML = `
                <span class="nseNiceButton" id="nseImportListButton${i}">
                    <span class="nseEmoji">⤵️</span>
                    Import your NSE tag whitelist into the above field
                </span>
            `;
        } else if(textareas[i].name == "nottags") {
            newElement.innerHTML = `
                <span class="nseNiceButton" id="nseImportListButton${i}">
                    <span class="nseEmoji">⤵️</span>
                    Import your NSE tag blacklist${nseHardPassEnabled ? " and Hard Pass list" : ""} into the above field
                </span>
            `;
        }

        newElement.onclick = function() {
            let coupledTextarea = this.parentNode.parentNode.querySelector("textarea.long");

            if(coupledTextarea.name == "tags") {
                coupledTextarea.innerHTML = document.getElementById("nseWhitelistTaglistArea").innerHTML;
            } else if(coupledTextarea.name == "nottags") {
                if(nseHardPassEnabled) {
                    coupledTextarea.innerHTML = document.getElementById("nseHardPassTaglistArea").innerHTML + " ";
                } else {
                    coupledTextarea.innerHTML = "";
                }

                coupledTextarea.innerHTML = coupledTextarea.innerHTML + document.getElementById("nseBlacklistTaglistArea").innerHTML;
            }
        };

        textareas[i].parentNode.querySelector("textarea.long + p").appendChild(newElement);
    }
}

// +---------------------+
// | Main filtering loop |
// +---------------------+
let count = 0;
let torrents = document.querySelectorAll("tr.torrent");

if(currentPage == "Requests") {
    torrents = document.querySelectorAll("#request_table tr");
}

if(torrents) {
    if(!nseUnfilteredPages.includes(currentPage)) { // Skip filtering where it doesn't apply
        for(let i = 0; i < torrents.length; i++) {
            let tagElement = torrents[i].querySelector("td > div.tags");
    
            if(!tagElement) {
                continue; // skip to next iteration if we can't get taglist
            }
    
            let russianRouletteBulletInChamber = false;
            if(nseRussianRouletteEnabled) {
                let randNum = Math.floor(Math.random() * 6) + 1; // 1/6 chance to fire
                if(randNum == 6) {
                    russianRouletteBulletInChamber = true;
                }
            }
    
            let uploaderElement, titleElement;

            if(currentPage == "Top 10") {
                uploaderElement = torrents[i].querySelector("td:nth-child(10) > a");
            } else {
                uploaderElement = torrents[i].querySelector("td.user > a");
            }
    
            if(currentPage == "Collage") {
                titleElement = torrents[i].querySelector("td > strong > a");
            } else {
                titleElement = torrents[i].querySelector("td > a");
            }
    
            let countMe = 1;
            let currentHidden = false;
            let currentWhitelisted = false;
            let currentBypassWhitelist = false;
            let currentForceHide = false;
            let currentForceShow = false;
    
            // Check if we are adding the hide button
            if(nseIndividualUploadHidingEnabled) {
                let torrentIconContainer = torrents[i].querySelector("td > span.torrent_icon_container");
    
                if(torrentIconContainer) {
                    let nseToggleHideElement = document.createElement("span");
                    nseToggleHideElement.className = "icon";
                    nseToggleHideElement.innerHTML = `
                    <div class="icon_container">
                        <div class="icon_stack">
                            <i class="font_icon torrent_icons clickable nseToggleIcon" id="nseToggleIcon_${i}">
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAC6npUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHja7ZdtktwoDIb/c4ocAUkIieNgPqpygz1+XrDb0z2T3SS1+2urTdlggSX5fWR6Joy/vs/wDQeVzCGpeS45RxyppMIVA4/nUfaVYtrX84avOXq1h3uCYRL0ct5avdZX2PXjgUcMOl7twa8Z9ssR3Y73ISvyGvfnJGHn007pclTGOcjF7TnV43LUroU7letMd1pnt+7Di8GgUlcEEuYhJHFf/cxAzrMu+75CFYl7zEJhd493hSAvr/foY3wW6EXkxyh8Vv8efRKf62WXT1rmSyMMfjpB+skudxh+Dix3Rvw6YfJw9VXkObvPOc63qylD0XxV1BabHm6w8IDksh/LaIZTMbbdCprHGhuQ99jigdaoEEP9GShRp0qTxu4bNaSYeLChZ24AsmwuxoUbGJGk1WiySZEuDliNRxCBme9caMctO14jR+ROWMoEZ4RH/raFf5r8kxbmbEsiin5rhbx41TXSWOTWFasAhObFTbfAj3bhj0/1s0o1YdmS2fGCNR6ni0Ppo7ZkcxasU/TnJ0TB+uUAEiG2IhkUf6KYSZQyRWM2IujoAFSROUviAwRIlTuS5CSC/cjYecXGM0Z7LStnXmbsTQChksXApkgFrJQU9WPJUUNVRZOqZjX1oEVrlpyy5pwtr02umlgytWxmbsWqiydXz27uXrwWLoI9UEsuVryUUiuHikAVvirWV1gOPuRIhx75sMOPctSG8mmpacvNmrfSaucuHdtEz92699LroDCwU4w0dORhw0cZdaLWpsw0deZp02eZ9aZ2Uf3S/oAaXdR4k1rr7KYGazB7uKC1nehiBmKcCMRtEUBB82IWnVLiRW4xi4XxUSgjSV1sQqdFDAjTINZJN7sPcr/FLaj/Fjf+Fbmw0P0X5ALQfeX2E2p9/c61Tez8CpemUfD1YX54Dex1/ajVf9u/Hb0dvR29Hb0dvR29Hf0PHE388YB/YsMPGOidZZTdxfYAAAGFaUNDUElDQyBwcm9maWxlAAB4nH2RPUjDQBiG37ZKpVYcLCLikKE6WRAVESetQhEqhFqhVQeTS/+gSUOS4uIouBYc/FmsOrg46+rgKgiCPyBOjk6KLlLid0mhRYx3HPfw3ve+3H0H+OtlppodY4CqWUYqERcy2VUh+IoQzX50Y0Zipj4nikl4jq97+Ph+F+NZ3nV/jh4lZzLAJxDPMt2wiDeIpzYtnfM+cYQVJYX4nHjUoAsSP3JddvmNc8FhP8+MGOnUPHGEWCi0sdzGrGioxJPEUUXVKN+fcVnhvMVZLVdZ8578heGctrLMdVpDSGARSxAhQEYVJZRhIUa7RoqJFJ3HPfyDjl8kl0yuEhg5FlCBCsnxg//B796a+YlxNykcBzpfbPtjGAjuAo2abX8f23bjBAg8A1day1+pA9OfpNdaWvQI6N0GLq5bmrwHXO4AA0+6ZEiOFKDlz+eB9zP6pizQdwuE1ty+Nc9x+gCkqVfJG+DgEBgpUPa6x7u72vv2b02zfz9/THKseNROhQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+QKChYVGrZwy10AAAF0SURBVDjL3dK/S9ZhFAXwj74ZvoXwllAKiSZYQ0uIQaND0BKUjQ1ODYIOBiKIEA1RNLWECIUQqIuL4BJFFoElmhjakk4a+YMgQYkIhVqu8PDw/gHRnZ7vufd7OPeew79WheR9ErcxF3g1zqMdF1CJPRyUIzqSvKvQiz94h5f4hvXoN6MeixjGC/wqR1qDFnxCX4IXQ91h3cAbvEZdTnIG27iCElbxAOcwH9/v0ZScpAc/Yn1wHNPoTIiPYgP34qcCurGLU8ncTXyIbXTgeabwetxjFgMJ/gjj2ewIbsECLmfNVdTiBL7iaeLsWjbbiqXKsLs1a37HReygAVdDWQEr2WxbuOxsWHo6aXZgM7lHETO4n5HUh5DGQ+BOHPdYMtSPn3iCwYjGOh5Hv4QtdKXJno1AjuFzqHmLqYhANT7ibhCV8BtfMAQVmdR2PMQ+XkWG1iLtTbiECYxiMl21okzCi3HoaxG22sB3QsGzMGMmbF/2f9dfX9xN/BNad7IAAAAASUVORK5CYII=" />
                            </i>
                        </div>
                    </div>
                    `;
        
                    nseToggleHideElement.title = "Filter this torrent with NSE";
                    nseToggleHideElement.classList.add("nseToggleHideButton");
        
                    let actualIcon = nseToggleHideElement.querySelector("div > div > i");
                    let torrentID = titleElement.href.match(/([0-9]+)/)[0];
                    actualIcon.torrentID = torrentID;
                    actualIcon.onclick = function() {
                        let torrentParent = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;

                        // Refresh lists, they might have been changed in other tabs
                        nseIndividualUploadHidingBlacklist = GM_getValue("nseIndividualUploadHidingBlacklist", new Array(0));
                        nseIndividualUploadHidingWhitelist = GM_getValue("nseIndividualUploadHidingWhitelist", new Array(0));
        
                        if(torrentParent) {
                            if(!torrentParent.getAttribute("isNSEHidden")) {
                                torrentParent.setAttribute("isNSEHidden", "0");
                            }
            
                            if(torrentParent.getAttribute("isNSEHidden") === "1") {
                                // Blacklisted, move to whitelist and unhide
                                let currindex = nseIndividualUploadHidingBlacklist.indexOf(this.torrentID);
                                if(currindex > -1) {
                                    nseIndividualUploadHidingBlacklist.splice(currindex, 1);
                                }
            
                                currindex = nseIndividualUploadHidingWhitelist.indexOf(this.torrentID);
                                if(currindex == -1) { // Only add if not already whitelisted to avoid duplicates
                                    nseIndividualUploadHidingWhitelist.push(this.torrentID);
                                }
            
                                if(currentPage == "Top 10") {
                                    let count = 0;
                                    let torrentLinks = document.querySelectorAll("tr.torrent > td > a");
                                    for(let i = 0; i < torrentLinks.length; i++) {
                                        let regex = "id=" + this.torrentID;

                                        if(torrentLinks[i].href.match(regex)) {
                                            let currParent = torrentLinks[i].parentNode.parentNode;
                                            currParent.classList.toggle("hidden");
                                            currParent.setAttribute("isNSEHidden", "0");
                                            currParent.style.backgroundColor = null;

                                            let currIcon = currParent.querySelector(".nseToggleIcon");
                                            currIcon.classList.add("nseIndividuallyWhitelisted");
                                            currIcon.classList.remove("nseIndividuallyBlacklisted");
                                            currIcon.classList.remove("nseIndividuallyUntouched");

                                            count--;
                                        }
                                    }

                                    adjustHiddenHeaderCount(count);
                                } else {
                                    torrentParent.classList.toggle("hidden");
                                    torrentParent.setAttribute("isNSEHidden", "0");
                                    torrentParent.style.backgroundColor = null;
                                    
                                    this.classList.add("nseIndividuallyWhitelisted");
                                    this.classList.remove("nseIndividuallyBlacklisted");
                                    this.classList.remove("nseIndividuallyUntouched");

                                    adjustHiddenHeaderCount(-1);
                                }
            
                                
                            } else if(torrentParent.getAttribute("isNSEHidden") == "0") {
                                // Not hidden or is whitelisted, move to blacklist and hide
                                let currindex = nseIndividualUploadHidingWhitelist.indexOf(this.torrentID);
                                if(currindex > -1) {
                                    nseIndividualUploadHidingWhitelist.splice(currindex, 1);
                                }
            
                                currindex = nseIndividualUploadHidingBlacklist.indexOf(this.torrentID);
                                if(currindex == -1) { // Only add if not already blacklisted to avoid duplicates
                                    nseIndividualUploadHidingBlacklist.push(this.torrentID);
                                }

                                if(currentPage == "Top 10") {
                                    let count = 0;
                                    let torrentLinks = document.querySelectorAll("tr.torrent > td > a");
                                    for(let i = 0; i < torrentLinks.length; i++) {
                                        let regex = "id=" + this.torrentID;

                                        if(torrentLinks[i].href.match(regex)) {
                                            let currParent = torrentLinks[i].parentNode.parentNode;
                                            currParent.classList.toggle("hidden");
                                            currParent.setAttribute("isNSEHidden", "1");
                                            currParent.style.backgroundColor = themes[nseSelectedTheme].hiddenBackgroundColor;

                                            let currIcon = currParent.querySelector(".nseToggleIcon");
                                            currIcon.classList.remove("nseIndividuallyWhitelisted");
                                            currIcon.classList.remove("nseIndividuallyUntouched");
                                            currIcon.classList.add("nseIndividuallyBlacklisted");

                                            count++;
                                        }
                                    }

                                    adjustHiddenHeaderCount(count);
                                } else {
                                    torrentParent.classList.toggle("hidden");
                                    torrentParent.setAttribute("isNSEHidden", "1");
                                    torrentParent.style.backgroundColor = themes[nseSelectedTheme].hiddenBackgroundColor;

                                    this.classList.remove("nseIndividuallyWhitelisted");
                                    this.classList.remove("nseIndividuallyUntouched");
                                    this.classList.add("nseIndividuallyBlacklisted");

                                    adjustHiddenHeaderCount(1);
                                }
                            }
            
                            //Save lists immediately after manipulating them
                            GM_setValue("nseIndividualUploadHidingBlacklist", nseIndividualUploadHidingBlacklist);
                            GM_setValue("nseIndividualUploadHidingWhitelist", nseIndividualUploadHidingWhitelist);

                            if(nseRenumberTorrentsEnabled && currentPage == "Top 10") {
                                renumberTorrents();
                            }
                        }
                    };

                    // Clear list status on right-click
                    actualIcon.addEventListener('contextmenu', function(event) {
                        event.preventDefault();

                        let torrentParent = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;

                        // Refresh lists, they might have been changed in other tabs
                        nseIndividualUploadHidingBlacklist = GM_getValue("nseIndividualUploadHidingBlacklist", new Array(0));
                        nseIndividualUploadHidingWhitelist = GM_getValue("nseIndividualUploadHidingWhitelist", new Array(0));
        
                        if(torrentParent) {
                            // Remove from both lists
                            let wasRemovedFromWL = false;
                            let wasRemovedFromBL = false;
                            
                            let currindex = nseIndividualUploadHidingWhitelist.indexOf(this.torrentID);
                            if(currindex > -1) {
                                nseIndividualUploadHidingWhitelist.splice(currindex, 1);
                                wasRemovedFromWL = true;
                            }

                            currindex = nseIndividualUploadHidingBlacklist.indexOf(this.torrentID);
                            if(currindex > -1) {
                                nseIndividualUploadHidingBlacklist.splice(currindex, 1);
                                wasRemovedFromBL = true;
                            }
        
                            if(wasRemovedFromWL || wasRemovedFromBL) {
                                if(currentPage == "Top 10") {
                                    let count = 0;
                                    let torrentLinks = document.querySelectorAll("tr.torrent > td > a");
                                    for(let i = 0; i < torrentLinks.length; i++) {
                                        let regex = "id=" + this.torrentID;

                                        if(torrentLinks[i].href.match(regex)) {
                                            let currParent = torrentLinks[i].parentNode.parentNode;
                                            currParent.setAttribute("isNSEHidden", "0");
                                            currParent.style.backgroundColor = null;

                                            if(!wasRemovedFromWL) {
                                                currParent.classList.toggle("hidden");
                                            }

                                            let currIcon = currParent.querySelector(".nseToggleIcon");
                                            currIcon.classList.remove("nseIndividuallyWhitelisted");
                                            currIcon.classList.remove("nseIndividuallyBlacklisted");
                                            currIcon.classList.add("nseIndividuallyUntouched");

                                            count--;
                                        }
                                    }
                                    
                                    if(wasRemovedFromBL) {
                                        adjustHiddenHeaderCount(count);
                                    }
                                } else {
                                    if(!wasRemovedFromWL) {
                                        torrentParent.classList.toggle("hidden");
                                    }

                                    torrentParent.setAttribute("isNSEHidden", "0");
                                    torrentParent.style.backgroundColor = null;

                                    this.classList.remove("nseIndividuallyWhitelisted");
                                    this.classList.remove("nseIndividuallyBlacklisted");
                                    this.classList.add("nseIndividuallyUntouched");
                                    
                                    if(wasRemovedFromBL) {
                                        adjustHiddenHeaderCount(-1);
                                    }
                                }

                                // Save lists immediately after manipulating them
                                GM_setValue("nseIndividualUploadHidingBlacklist", nseIndividualUploadHidingBlacklist);
                                GM_setValue("nseIndividualUploadHidingWhitelist", nseIndividualUploadHidingWhitelist);
                            }

                            if(nseRenumberTorrentsEnabled && currentPage == "Top 10") {
                                renumberTorrents();
                            }
                        }
                    }, false);

                    torrentIconContainer.appendChild(nseToggleHideElement);

                    // Check if torrent is black/whitelisted this way
                    let currentBLIndex = nseIndividualUploadHidingBlacklist.indexOf(torrentID);
                    if(currentBLIndex > -1) {
                        if(russianRouletteBulletInChamber == false) {
                            actualIcon.classList.add("nseIndividuallyBlacklisted");
                            currentHidden = true;
                            currentForceHide = true;
                        }
                    }
        
                    let currentWLIndex = nseIndividualUploadHidingWhitelist.indexOf(torrentID);
                    if(currentWLIndex > -1) {
                        actualIcon.classList.add("nseIndividuallyWhitelisted");
                        currentWhitelisted = true;
                        currentForceShow = true;
                    }
        
                    if(currentForceHide == false && currentForceShow == false) {
                        // Torrent not acted upon
                        actualIcon.classList.add("nseIndividuallyUntouched");
                    }
                }
            }
 
            if(nseObliviousModeEnabled == true) {
                tagElement.classList.add("hidden");
            }
    
            // Check if filtered via options
            if(nseHideReportedEnabled) {
                if(titleElement.querySelector("span.reported") !== null) {
                    currentHidden = true;
                }
            }
    
            if(nseHideWarnedEnabled) {
                if(torrents[i].classList.contains("redbar")) {
                    currentHidden = true;
                }
            }
    
            if(nseHideUnseededEnabled) {
                let selector = "td:nth-child(8)";
    
                if(currentPage == "Collage") {
                    selector = "td:nth-child(7)";
                }
                
                let seeders = torrents[i].querySelector(selector);
                if(seeders.classList.contains("r00")) {
                    currentHidden = true;
                    seeders.innerHTML = "(0)";
                }
            }
    
            let torrentIconElement = torrents[i].querySelector("td > span.torrent_icon_container > span.icon > a > div.icon_container > div.icon_stack > i");
    
            if(torrentIconElement) {
                if(nseHideSnatchedEnabled) {
                    if(torrentIconElement.classList.contains("snatched")) {
                        currentHidden = true;
    
                        if(nseBypassWhitelistsEnabled) {
                            currentBypassWhitelist = true;
                        }
                    }
                }
    
                if(nseHideSeedingEnabled) {
                    if(torrentIconElement.classList.contains("seeding")) {
                        currentHidden = true;
    
                        if(nseBypassWhitelistsEnabled) {
                            currentBypassWhitelist = true;
                        }
                    }
                }
    
                if(nseHideGrabbedEnabled) {
                    if(torrentIconElement.classList.contains("grabbed")) {
                        currentHidden = true;
    
                        if(nseBypassWhitelistsEnabled) {
                            currentBypassWhitelist = true;
                        }
                    }
                }
    
                if(nseHideLeechingEnabled) {
                    if(torrentIconElement.classList.contains("leeching")) {
                        currentHidden = true;
    
                        if(nseBypassWhitelistsEnabled) {
                            currentBypassWhitelist = true;
                        }
                    }
                }
            }

            if(nseHideBookmarkedEnabled) {
                let bmElement = torrents[i].querySelector("i.bookmarked");
                if(bmElement) {
                    currentHidden = true;
                    
                    if(nseBypassWhitelistsEnabled) {
                        currentBypassWhitelist = true;
                    }
                }
            }
    
            // Check uploaders
            // No uploaders on collage and user uploaded pages
            if(currentPage !== "Collage" && currentPage !== "Uploaded") { 
                if(!uploaderElement) { // If it is null, it's an anon upload
                    if(nseHideAnonUploadsEnabled) {
                        let anonName = torrents[i].querySelector("td > span.anon_name");
                        if(anonName && anonName.innerHTML == "anon") {
                            currentHidden = true;
                            if(russianRouletteBulletInChamber == false) {
                                anonName.classList.add("nseHiddenUploader");
                            }
                        }
                    }
                } else { // Not an anon upload
                    let uploader = uploaderElement.innerHTML.trim().toLowerCase();
    
                    let hiddenByUploader = false;
                    for(let l = 0; l < nseBlacklistUploaders.length; l++) {
                        if(uploader == nseBlacklistUploaders[l].trim().toLowerCase()) {
                            hiddenByUploader = true;
                            currentHidden = true;
                            if(russianRouletteBulletInChamber == false) { 
                                uploaderElement.classList.add("nseHiddenUploader"); 
                            }
                            break;
                        }
                    }
    
                    // If hiddenByUploader is still false, that means no blacklisted uploader was found, check whitelist
                    // If hiddenByUploader is true, blacklisted uploader was found, and since usernames are unique, skip check
                    if(hiddenByUploader == false) {
                        if(currentBypassWhitelist == false) {
                            for(let m = 0; m < nseWhitelistUploaders.length; m++) {
                                if(uploader == nseWhitelistUploaders[m].trim().toLowerCase()) {
                                    currentWhitelisted = true;
                                    uploaderElement.classList.add("nseWhitelistedUploader");
                                    break;
                                }
                            }
                        }
                    }
                }
            }
    
            // Scan title for nseBlacklistTitlePhrases
            // ...For every blacklisted phrase:
            for(let tblCount = 0; tblCount < nseBlacklistTitlePhrases.length; tblCount++) {
                let currentTBLPhrase = nseBlacklistTitlePhrases[tblCount].trim().toLowerCase();
                let torrentTitle = titleElement.innerHTML.trim().toLowerCase();
    
                if(currentTBLPhrase != "") {
                    if(torrentTitle.includes(currentTBLPhrase)) {
                        currentHidden = true;
                        if(russianRouletteBulletInChamber == false) { 
                            titleElement.innerHTML = titleElement.innerHTML + ` <color class="nseHiddenTitle">(${currentTBLPhrase})</color>`;
                        }
                    }
                }
            }

            // Scan title for nseHardPassTitlePhrases
            if(nseHardPassEnabled) {
                for(let tblCount = 0; tblCount < nseHardPassTitlePhrases.length; tblCount++) {
                    let currentTBLPhrase = nseHardPassTitlePhrases[tblCount].trim().toLowerCase();
                    let torrentTitle = titleElement.innerHTML.trim().toLowerCase();
        
                    if(currentTBLPhrase != "") {
                        if(torrentTitle.includes(currentTBLPhrase)) {
                            currentHidden = true;
                            currentForceHide = true;
                            if(russianRouletteBulletInChamber == false) { 
                                titleElement.innerHTML = titleElement.innerHTML + ` <color class="nseHardPassTitle">(${currentTBLPhrase})</color>`;

                                if(nseRemoveHardPassResults) {
                                    torrents[i].classList.add("nseHardPassRemove");
                                    countMe = 0;
                                }
                            }
                        }
                    }
                }
            }
    
            // Scan title for nseWhitelistTitlePhrases
            // ...For every whitelisted phrase:
            if(currentBypassWhitelist == false) {
                for(let tblCount = 0; tblCount < nseWhitelistTitlePhrases.length; tblCount++) {
                    let currentTWLPhrase = nseWhitelistTitlePhrases[tblCount].trim().toLowerCase();
                    let torrentTitle = titleElement.innerHTML.trim().toLowerCase();
    
                    if(currentTWLPhrase != "") {
                        if(torrentTitle.includes(currentTWLPhrase)) {
                            currentWhitelisted = true;
                            titleElement.innerHTML = titleElement.innerHTML + ` <color class="nseWhitelistedTitle">(${currentTWLPhrase})</color>`;
                        }
                    }
                }
            }
    
            // For every tag in the current torrent
            let tagList = tagElement.querySelectorAll("a");
            if(tagList) {
                for(let k = 0; k < tagList.length; k++) {
                    if(nseHardPassEnabled) {
                        if(nseHardPassTags.includes(tagList[k].innerHTML) === true) {
                            currentHidden = true;
                            currentForceHide = true;
                            if(russianRouletteBulletInChamber == false) { 
                                tagList[k].classList.add("nseHardPassTag");
        
                                if(nseRemoveHardPassResults) {
                                    torrents[i].classList.add("nseHardPassRemove");
                                    countMe = 0;
                                }
                            }
                        }
                    }
        
                    if(nseBlacklistTags.includes(tagList[k].innerHTML) === true) {
                        currentHidden = true;
                        if(russianRouletteBulletInChamber == false) { 
                            tagList[k].classList.add("nseHiddenTag"); 
                        }
                    }
        
                    if(currentBypassWhitelist == false) {
                        if(nseWhitelistTags.includes(tagList[k].innerHTML) === true) {
                            currentWhitelisted = true;
                            tagList[k].classList.add("nseWhitelistedTag");
                        }
                    }
                }
            }
    
            // If forcing through individual filtering, ignore results
            if(currentForceShow) {
                currentHidden = false;
                currentWhitelisted = true;
            } else if(currentForceHide) {
                currentHidden = true;
                currentWhitelisted = false;
            }
    
            if(currentWhitelisted === true) {
                torrents[i].classList.remove("hidden");
                torrents[i].setAttribute("isNSEHidden", "0");
            } else if(currentHidden === true) {
                if(russianRouletteBulletInChamber == false) {
                    torrents[i].style.backgroundColor = themes[nseSelectedTheme].hiddenBackgroundColor;
                    torrents[i].classList.add("hidden");
                    torrents[i].setAttribute("isNSEHidden", "1");
    
                    count += countMe;
                }
            }
        }
    } else if(currentPage == "Torrent details") {
        if(nseHideUnseededEnabled) {
            let seedersElement = document.querySelector("div.top_info > table.boxstat > tbody > tr > td:nth-child(4)");
            let seedersElement2 = document.querySelector("tr.group_torrent > td:nth-child(5)");
            let currSeeders = seedersElement2.innerHTML;

            if(currSeeders.trim() === "0") {
                seedersElement.classList.add("nseBlacklistIdentifier");
                seedersElement2.classList.add("nseBlacklistIdentifier");

                seedersElement.innerHTML = "(" + seedersElement.innerHTML + ")"; // This has a div element also
                seedersElement2.innerHTML = "(0)";
            }
        }

        // Highlight if uploader is anon and user has NSE set to hide anon uploads
        let anonName = document.querySelectorAll(".anon_name");
        if(anonName.length) {
            if(nseHideAnonUploadsEnabled) {
                for(let anon = 0; anon < anonName.length; anon++) {
                    anonName[anon].classList.add("nseHiddenUploader");
                }
            }
        // Highlight if uploader is any of the lists
        } else {
            let uploaderElement = document.querySelector("table.boxstat > tbody > tr > td:nth-child(1) > a");
            let uploaderElement2 = document.querySelector(".torrent_table > tbody > tr:nth-child(5) > td > em > a");

            if(uploaderElement) {
                let uploader = uploaderElement.innerHTML.trim().toLowerCase();
    
                for(let l = 0; l < nseBlacklistUploaders.length; l++) {
                    if(uploader == nseBlacklistUploaders[l].trim().toLowerCase()) {
                        uploaderElement.classList.add("nseHiddenUploader"); 
                        uploaderElement2.classList.add("nseHiddenUploader"); 
                        break;
                    }
                }
    
                for(let m = 0; m < nseWhitelistUploaders.length; m++) {
                    if(uploader == nseWhitelistUploaders[m].trim().toLowerCase()) {
                        uploaderElement.classList.add("nseWhitelistedUploader");
                        uploaderElement2.classList.add("nseWhitelistedUploader");
                        break;
                    }
                }
            }
        }

        let titleElement2 = document.querySelector(".torrent_table > tbody > tr:nth-child(2) > td:nth-child(2) > strong");
        let titleElement = document.querySelector("#content > div:nth-child(1) > h2:nth-child(1)");
        let firstSpan = document.querySelector("#content > div:nth-child(1) > h2:nth-child(1) > span:nth-child(1)");
        let h2textChild = Array.from(titleElement.childNodes).filter(node => node.nodeType === 3 && node.textContent.trim().length > 1)[0];

        let newSpan = document.createElement('span');
        h2textChild.after(newSpan);
        newSpan.appendChild(h2textChild);
        titleElement = newSpan;

        // Scan title for nseBlacklistTitlePhrases
        // ...For every blacklisted phrase:
        for(let tblCount = 0; tblCount < nseBlacklistTitlePhrases.length; tblCount++) {
            let currentTBLPhrase = nseBlacklistTitlePhrases[tblCount].trim().toLowerCase();
            let torrentTitle = titleElement.innerHTML.trim().toLowerCase();

            if(currentTBLPhrase != "") {
                if(torrentTitle.includes(currentTBLPhrase)) {
                    titleElement.innerHTML = titleElement.innerHTML + ` <color class="nseHiddenTitle">(${currentTBLPhrase})</color>`;
                    titleElement2.innerHTML = titleElement2.innerHTML + ` <color class="nseHiddenTitle">(${currentTBLPhrase})</color>`;
                }
            }
        }
        
        // Scan title for nseHardPassTitlePhrases
        for(let tblCount = 0; tblCount < nseHardPassTitlePhrases.length; tblCount++) {
            let currentTBLPhrase = nseHardPassTitlePhrases[tblCount].trim().toLowerCase();
            let torrentTitle = titleElement.innerHTML.trim().toLowerCase();

            if(currentTBLPhrase != "") {
                if(torrentTitle.includes(currentTBLPhrase)) {
                    titleElement.innerHTML = titleElement.innerHTML + ` <color class="nseHardPassTitle">(${currentTBLPhrase})</color>`;
                    titleElement2.innerHTML = titleElement2.innerHTML + ` <color class="nseHardPassTitle">(${currentTBLPhrase})</color>`;
                }
            }
        }

        // Scan title for nseWhitelistTitlePhrases
        // ...For every whitelisted phrase:
        for(let tblCount = 0; tblCount < nseWhitelistTitlePhrases.length; tblCount++) {
            let currentTWLPhrase = nseWhitelistTitlePhrases[tblCount].trim().toLowerCase();
            let torrentTitle = titleElement.innerHTML.trim().toLowerCase();

            if(currentTWLPhrase != "") {
                if(torrentTitle.includes(currentTWLPhrase)) {
                    titleElement.innerHTML = titleElement.innerHTML + ` <color class="nseWhitelistedTitle">(${currentTWLPhrase})</color>`;
                    titleElement2.innerHTML = titleElement2.innerHTML + ` <color class="nseWhitelistedTitle">(${currentTWLPhrase})</color>`;
                }
            }
        }


        // Add individual filter icon to torrent details page, a lot of duplicated code, will function-ize later
        if(nseIndividualUploadHidingEnabled) {
            let torrentIconContainer = document.querySelector("td > span.torrent_icon_container");

            if(torrentIconContainer) {
                let nseToggleHideElement = document.createElement("span");
                nseToggleHideElement.className = "icon";
                nseToggleHideElement.innerHTML = `
                <div class="icon_container">
                    <div class="icon_stack">
                        <i class="font_icon torrent_icons clickable">
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAC6npUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHja7ZdtktwoDIb/c4ocAUkIieNgPqpygz1+XrDb0z2T3SS1+2urTdlggSX5fWR6Joy/vs/wDQeVzCGpeS45RxyppMIVA4/nUfaVYtrX84avOXq1h3uCYRL0ct5avdZX2PXjgUcMOl7twa8Z9ssR3Y73ISvyGvfnJGHn007pclTGOcjF7TnV43LUroU7letMd1pnt+7Di8GgUlcEEuYhJHFf/cxAzrMu+75CFYl7zEJhd493hSAvr/foY3wW6EXkxyh8Vv8efRKf62WXT1rmSyMMfjpB+skudxh+Dix3Rvw6YfJw9VXkObvPOc63qylD0XxV1BabHm6w8IDksh/LaIZTMbbdCprHGhuQ99jigdaoEEP9GShRp0qTxu4bNaSYeLChZ24AsmwuxoUbGJGk1WiySZEuDliNRxCBme9caMctO14jR+ROWMoEZ4RH/raFf5r8kxbmbEsiin5rhbx41TXSWOTWFasAhObFTbfAj3bhj0/1s0o1YdmS2fGCNR6ni0Ppo7ZkcxasU/TnJ0TB+uUAEiG2IhkUf6KYSZQyRWM2IujoAFSROUviAwRIlTuS5CSC/cjYecXGM0Z7LStnXmbsTQChksXApkgFrJQU9WPJUUNVRZOqZjX1oEVrlpyy5pwtr02umlgytWxmbsWqiydXz27uXrwWLoI9UEsuVryUUiuHikAVvirWV1gOPuRIhx75sMOPctSG8mmpacvNmrfSaucuHdtEz92699LroDCwU4w0dORhw0cZdaLWpsw0deZp02eZ9aZ2Uf3S/oAaXdR4k1rr7KYGazB7uKC1nehiBmKcCMRtEUBB82IWnVLiRW4xi4XxUSgjSV1sQqdFDAjTINZJN7sPcr/FLaj/Fjf+Fbmw0P0X5ALQfeX2E2p9/c61Tez8CpemUfD1YX54Dex1/ajVf9u/Hb0dvR29Hb0dvR29Hf0PHE388YB/YsMPGOidZZTdxfYAAAGFaUNDUElDQyBwcm9maWxlAAB4nH2RPUjDQBiG37ZKpVYcLCLikKE6WRAVESetQhEqhFqhVQeTS/+gSUOS4uIouBYc/FmsOrg46+rgKgiCPyBOjk6KLlLid0mhRYx3HPfw3ve+3H0H+OtlppodY4CqWUYqERcy2VUh+IoQzX50Y0Zipj4nikl4jq97+Ph+F+NZ3nV/jh4lZzLAJxDPMt2wiDeIpzYtnfM+cYQVJYX4nHjUoAsSP3JddvmNc8FhP8+MGOnUPHGEWCi0sdzGrGioxJPEUUXVKN+fcVnhvMVZLVdZ8578heGctrLMdVpDSGARSxAhQEYVJZRhIUa7RoqJFJ3HPfyDjl8kl0yuEhg5FlCBCsnxg//B796a+YlxNykcBzpfbPtjGAjuAo2abX8f23bjBAg8A1day1+pA9OfpNdaWvQI6N0GLq5bmrwHXO4AA0+6ZEiOFKDlz+eB9zP6pizQdwuE1ty+Nc9x+gCkqVfJG+DgEBgpUPa6x7u72vv2b02zfz9/THKseNROhQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+QKChYVGrZwy10AAAF0SURBVDjL3dK/S9ZhFAXwj74ZvoXwllAKiSZYQ0uIQaND0BKUjQ1ODYIOBiKIEA1RNLWECIUQqIuL4BJFFoElmhjakk4a+YMgQYkIhVqu8PDw/gHRnZ7vufd7OPeew79WheR9ErcxF3g1zqMdF1CJPRyUIzqSvKvQiz94h5f4hvXoN6MeixjGC/wqR1qDFnxCX4IXQ91h3cAbvEZdTnIG27iCElbxAOcwH9/v0ZScpAc/Yn1wHNPoTIiPYgP34qcCurGLU8ncTXyIbXTgeabwetxjFgMJ/gjj2ewIbsECLmfNVdTiBL7iaeLsWjbbiqXKsLs1a37HReygAVdDWQEr2WxbuOxsWHo6aXZgM7lHETO4n5HUh5DGQ+BOHPdYMtSPn3iCwYjGOh5Hv4QtdKXJno1AjuFzqHmLqYhANT7ibhCV8BtfMAQVmdR2PMQ+XkWG1iLtTbiECYxiMl21okzCi3HoaxG22sB3QsGzMGMmbF/2f9dfX9xN/BNad7IAAAAASUVORK5CYII=" />
                        </i>
                    </div>
                </div>
                `;
    
                nseToggleHideElement.title = "Filter this torrent with NSE";
                nseToggleHideElement.classList.add("nseToggleHideButton");
    
                let actualIcon = nseToggleHideElement.querySelector("div > div > i");
                let torrentID = window.location.href.match(/id=([0-9]+)/)[1];
                actualIcon.torrentID = torrentID;
                actualIcon.onclick = function() {   
                    // Refresh lists, they might have been changed in other tabs
                    nseIndividualUploadHidingBlacklist = GM_getValue("nseIndividualUploadHidingBlacklist", new Array(0));
                    nseIndividualUploadHidingWhitelist = GM_getValue("nseIndividualUploadHidingWhitelist", new Array(0));

                    if(nseIndividualUploadHidingBlacklist.includes(torrentID)) {
                        // Blacklisted, move to whitelist and unhide
                        let currindex = nseIndividualUploadHidingBlacklist.indexOf(this.torrentID);
                        if(currindex > -1) {
                            nseIndividualUploadHidingBlacklist.splice(currindex, 1);
                        }
    
                        currindex = nseIndividualUploadHidingWhitelist.indexOf(this.torrentID);
                        if(currindex == -1) { // Only add if not already whitelisted to avoid duplicates
                            nseIndividualUploadHidingWhitelist.push(this.torrentID);
                        }
    
                        this.classList.add("nseIndividuallyWhitelisted");
                        this.classList.remove("nseIndividuallyBlacklisted");
                        this.classList.remove("nseIndividuallyUntouched");
                    } else {
                        // Not hidden or is whitelisted, move to blacklist and hide
                        let currindex = nseIndividualUploadHidingWhitelist.indexOf(this.torrentID);
                        if(currindex > -1) {
                            nseIndividualUploadHidingWhitelist.splice(currindex, 1);
                        }
    
                        currindex = nseIndividualUploadHidingBlacklist.indexOf(this.torrentID);
                        if(currindex == -1) { // Only add if not already blacklisted to avoid duplicates
                            nseIndividualUploadHidingBlacklist.push(this.torrentID);
                        }
    
                        this.classList.remove("nseIndividuallyWhitelisted");
                        this.classList.remove("nseIndividuallyUntouched");
                        this.classList.add("nseIndividuallyBlacklisted");
                    }
    
                    //Save lists immediately after manipulating them
                    GM_setValue("nseIndividualUploadHidingBlacklist", nseIndividualUploadHidingBlacklist);
                    GM_setValue("nseIndividualUploadHidingWhitelist", nseIndividualUploadHidingWhitelist);
                };

                // Clear list status on right-click
                actualIcon.addEventListener('contextmenu', function(event) {
                    event.preventDefault();

                    // Refresh lists, they might have been changed in other tabs
                    nseIndividualUploadHidingBlacklist = GM_getValue("nseIndividualUploadHidingBlacklist", new Array(0));
                    nseIndividualUploadHidingWhitelist = GM_getValue("nseIndividualUploadHidingWhitelist", new Array(0));

                    // Remove from both lists
                    let currindex = nseIndividualUploadHidingWhitelist.indexOf(this.torrentID);
                    if(currindex > -1) {
                        nseIndividualUploadHidingWhitelist.splice(currindex, 1);
                    }

                    currindex = nseIndividualUploadHidingBlacklist.indexOf(this.torrentID);
                    if(currindex > -1) {
                        nseIndividualUploadHidingBlacklist.splice(currindex, 1);
                    }

                    this.classList.remove("nseIndividuallyWhitelisted");
                    this.classList.remove("nseIndividuallyBlacklisted");
                    this.classList.add("nseIndividuallyUntouched");

                    //Save lists immediately after manipulating them
                    GM_setValue("nseIndividualUploadHidingBlacklist", nseIndividualUploadHidingBlacklist);
                    GM_setValue("nseIndividualUploadHidingWhitelist", nseIndividualUploadHidingWhitelist);
                }, false);

                torrentIconContainer.appendChild(nseToggleHideElement);

                // Check if torrent is black/whitelisted this way
                let currentBLIndex = nseIndividualUploadHidingBlacklist.indexOf(torrentID);
                if(currentBLIndex > -1) {
                    actualIcon.classList.add("nseIndividuallyBlacklisted");
                }
    
                let currentWLIndex = nseIndividualUploadHidingWhitelist.indexOf(torrentID);
                if(currentWLIndex > -1) {
                    actualIcon.classList.add("nseIndividuallyWhitelisted");
                }

                if(currentBLIndex == -1 && currentWLIndex == -1) {
                    actualIcon.classList.add("nseIndividuallyUntouched");
                }
            }
        }
    } else if(currentPage == "My uploaded") {
        // Make sure colors function as expected on user uploads pages
        recolorTags();
    }
}


// +-----------------------------------------+
// | Event handler assignment and miscellany |
// +-----------------------------------------+

// Renumber if enabled
if(nseRenumberTorrentsEnabled && currentPage == "Top 10") {
    renumberTorrents();
}

// Add classes for Right-Click Management if enabled
if(nseRightClickManagementEnabled && currentPage !== "Notification filters") {
    if(currentPage == "Torrent details") {
        if(nseRCMTagsEnabled) {
            let currTaglist = document.querySelector("#torrent_tags");
            let observerOptions = {subtree: true, childList: true};
            let mObserver = new MutationObserver(function() {
                let tagList = document.querySelectorAll("ul#torrent_tags_list > li > a");        
                if(tagList !== null && tagList !== undefined) {
                    for(let i = 0; i < tagList.length; i++) {
                        tagList[i].classList.add("nseTagElement");
                    }
                }
            });

            mObserver.observe(currTaglist, observerOptions);
        }

        if(nseRCMTitlesEnabled) {
            // "Torrent Info" box
            let titleElement = document.querySelector(".group_torrent > td:nth-child(2) > strong");
            titleElement.classList.add("nseTitleElement");

            // Header text
            titleElement = document.querySelector("#content > div:nth-child(1) > h2:nth-child(1)");
            titleElement.classList.add("nseTitleElement");
        }

        if(nseRCMUploadersEnabled) {
            // First uploader element in torrent stats/controls near top of page
            let uploaderElement = document.querySelector("table.boxstat > tbody > tr > td:nth-child(1) > a");
            if(uploaderElement) {
                uploaderElement.classList.add("nseUploaderElement");
            }

            // Second uploader element in "Torrent Info" box
            uploaderElement = document.querySelector(".torrent_table > tbody > tr:nth-child(5) > td > em > a");
            if(uploaderElement) {
                uploaderElement.classList.add("nseUploaderElement");
            }
        }
    } else {
        for(let i = 0; i < torrents.length; i++) {
            // Tags
            if(nseRCMTagsEnabled) {
                let tagList = torrents[i].querySelectorAll("td > div.tags > a");
                if(tagList !== null && tagList !== undefined) {
                    for(let j = 0; j < tagList.length; j++) {
                        tagList[j].classList.add("nseTagElement");    
                    }
                }
            }
    
            // Titles
            if(nseRCMTitlesEnabled) {
                let titleElement;
                if(currentPage == "Collage") {
                    titleElement = torrents[i].querySelector("td > strong > a");
                } else {
                    titleElement = torrents[i].querySelector("td > a");
                }
                titleElement.classList.add("nseTitleElement");
            }

            // Uploaders
            if(nseRCMUploadersEnabled) {
                let uploaderElement = torrents[i].querySelector("td.user > a");
    
                if(currentPage == "Top 10") {
                    uploaderElement = torrents[i].querySelector("td:nth-child(10) > a");
                }
        
                if(currentPage !== "Collage" && currentPage !== "Uploaded" && uploaderElement !== null) { 
                    uploaderElement.classList.add("nseUploaderElement");
                }
            }
        }
    }
}

// Keep torrent details taglist colored when it changes
if(currentPage == "Torrent details") {
    let currTaglist = document.querySelector("#torrent_tags");
    let observerOptions = {subtree: true, childList: true};
    let mObserver = new MutationObserver(function() { recolorTags(); });  
    mObserver.observe(currTaglist, observerOptions);
}

function recolorTags() {
    let tagList;
    if(currentPage == "Torrent details") {
        tagList = document.querySelectorAll("ul#torrent_tags_list > li > a");
    } else if(currentPage == "My uploaded") {    
        tagList = document.querySelectorAll("div.tags > a");
    } else if(nseUnfilteredPages.includes(currentPage)) {
        return;
    } else {
        tagList = document.querySelectorAll("a.nseTagElement");
    }
    
    if(tagList !== null && tagList !== undefined) {
        for(let i = 0; i < tagList.length; i++) {
            if(nseBlacklistTags.includes(tagList[i].innerHTML.trim())) {
                tagList[i].classList.remove("nseHardPassTag");
                tagList[i].classList.remove("nseWhitelistedTag");
                tagList[i].classList.add("nseHiddenTag");
            } else if(nseHardPassEnabled && nseHardPassTags.includes(tagList[i].innerHTML.trim())) {
                tagList[i].classList.remove("nseHiddenTag");
                tagList[i].classList.remove("nseWhitelistedTag");
                tagList[i].classList.add("nseHardPassTag");
            } else if(nseWhitelistTags.includes(tagList[i].innerHTML.trim())) {
                tagList[i].classList.remove("nseHiddenTag");
                tagList[i].classList.remove("nseHardPassTag");
                tagList[i].classList.add("nseWhitelistedTag");
            } else {
                tagList[i].classList.remove("nseHiddenTag");
                tagList[i].classList.remove("nseHardPassTag");
                tagList[i].classList.remove("nseWhitelistedTag");
            }
        }
    }
}

function recolorUploaders() {
    let uploaderElements;

    if(currentPage == "Top 10") {
        uploaderElements = document.querySelectorAll("td:nth-child(10) > a");
    } else if(nseUnfilteredPages.includes(currentPage) || currentPage == "Collage"|| currentPage == "Uploaded") {
        return;
    } else {
        uploaderElements = document.querySelectorAll("td.user > a");
    }

    if(uploaderElements) {
        for(let i = 0; i < uploaderElements.length; i++) {
            if(nseBlacklistUploaders.includes(uploaderElements[i].innerHTML.trim())) {
                uploaderElements[i].classList.remove("nseWhitelistedUploader");
                uploaderElements[i].classList.add("nseHiddenUploader");
            } else if(nseWhitelistUploaders.includes(uploaderElements[i].innerHTML.trim())) {
                uploaderElements[i].classList.remove("nseHiddenUploader");
                uploaderElements[i].classList.add("nseWhitelistedUploader");
            } else {
                uploaderElements[i].classList.remove("nseHiddenUploader");
                uploaderElements[i].classList.remove("nseWhitelistedUploader");
            }
        }
    }
}

// Remove categories if enabled
if(nseHideCategoryIconsEnabled && currentPage !== "Notification filters" && currentPage !== "Torrent details") {
    let selector = ".cats_col";
    if(currentPage == "Collage" || currentPage == "Uploaded") {
        selector = "#torrent_table > tbody > tr > td:nth-child(1)";
    } else if(currentPage == "Notifications") {
        selector = ".cats_cols";
    }

    let catsCols = document.querySelectorAll(selector);
    for(let i = 0; i < catsCols.length; i++) {
        catsCols[i].nextElementSibling.setAttribute("colspan", "2");
        catsCols[i].style.display = "none";
    }
}

// Remove Hard Pass results if Black Hole is enabled
if(nseHardPassEnabled && nseRemoveHardPassResults && !nseUnfilteredPages.includes(currentPage)) {
    let elementsToRemove = document.querySelectorAll(".nseHardPassRemove");
    if(elementsToRemove) {
        for(let i = 0; i < elementsToRemove.length; i++) {
            if(elementsToRemove[i]) {
                elementsToRemove[i].remove();
            }
        }
    }
}

// Assign event handlers if arrow key navigation is enabled
if(nseArrowNavigationEnabled && currentPage !== "Notification filters" && currentPage !== "Torrent details") {
    document.onkeydown = function(event) {
        if(event.target.nodeName !== "TEXTAREA" && event.target.nodeName !== "INPUT") {
            if (event.code == "ArrowLeft") {
                nseGoBack(event);
            } else if (event.code == "ArrowRight") {
                nseGoForward(event);
            }
        }
    };
}

let headerNode = document.getElementById("nseHeaderText");

if(nseUnfilteredPages.includes(currentPage)) {
    headerNode.innerHTML = "Filtering is disabled on this page";
    headerNode.style.cursor = "auto";
} else {
    adjustHiddenHeaderCount(count);

    headerNode.onclick = function() {
        if(headerNode.innerHTML.match(/([0-9]+)/) !== null) {
            toggleTorrents();
        }
    };
}

document.getElementById("nseToggleOptionsNode").onclick = function() {
    document.getElementById("nseMainDiv").classList.toggle("hidden");
};

document.getElementById("nseCloseOptionsButton").onclick = function() { 
    document.getElementById("nseMainDiv").classList.add("hidden"); 
    document.getElementById("nseOuter").scrollIntoView();
};

document.getElementById("nseCheckCustomCSS").onclick = function() {
    if(this.checked) {
        document.getElementById("nseCustomCSSDiv").classList.remove("hidden");
    } else {
        document.getElementById("nseCustomCSSDiv").classList.add("hidden");
    }
};

document.getElementById("nseCheckRightClickManagementEnabled").onclick = function() {
    if(this.checked) {
        document.getElementById("nseRCMCustomizationDiv").classList.remove("hidden");
    } else {
        document.getElementById("nseRCMCustomizationDiv").classList.add("hidden");
    }
};

document.getElementById("nseThemeDropdown").onchange = function() {
    let selectedTheme = this.options[this.selectedIndex].value;
    let descriptionNode = document.getElementById("nseThemeDescription");

    if(selectedTheme == "nseThemeCustom") {
        document.getElementById("nseCustomThemeDiv").classList.remove("hidden");
    } else {
        document.getElementById("nseCustomThemeDiv").classList.add("hidden");
    }

    descriptionNode.innerHTML = nseThemeDescriptions[selectedTheme];
};

if(nseOpenAllButtonEnabled && !nseUnfilteredPages.includes(currentPage)) {
    document.getElementById("nseOpenAllButton").onclick = function() {
        let torrentLinks;

        if(currentPage == "Collage") {
            torrentLinks = document.querySelectorAll("tr.torrent > td > strong > a.nseTitleElement");
        } else {
            torrentLinks = document.querySelectorAll("tr.torrent > td > a.nseTitleElement");
        }
    
        if(torrentLinks) {
            let visitedLinks = [];
            for(let i = 0; i < torrentLinks.length; i++) {
                let hiddenStatus;

                if(currentPage == "Collage") {
                    hiddenStatus = torrentLinks[i].parentNode.parentNode.parentNode.getAttribute("isNSEHidden");
                } else {
                    hiddenStatus = torrentLinks[i].parentNode.parentNode.getAttribute("isNSEHidden");
                }

                if(hiddenStatus == 0 || hiddenStatus == "" || hiddenStatus == null) {
                    if(!visitedLinks.includes(torrentLinks[i].href)) {
                        window.open(torrentLinks[i].href, "_blank");
                        visitedLinks.push(torrentLinks[i].href);
                    }
                }
            }

            if(nseOpenAllGoNextEnabled) {
                nseGoForward();
            }
        }
    };
}

if(nseFilterAllButtonEnabled && nseIndividualUploadHidingEnabled && !nseUnfilteredPages.includes(currentPage)) {
    document.getElementById("nseFilterAllButton").onclick = function() {
        if(confirm(`Are you sure you want to filter all unfiltered results on this page?\n\nThis cannot be automatically undone, and you will have to manually unhide each torrent to undo it.`)) {
            for(let i = 0; i < torrents.length; i++) {
                if(!torrents[i].getAttribute("isNSEHidden") || torrents[i].getAttribute("isNSEHidden") === "0") {
                    torrents[i].querySelector(".nseToggleIcon").click();
                }
            }
        }
    };
}

// We like to have fun around here 😏
{
    let now = new Date();
    if(nseEveryDayIsApril1st || (now.getMonth() == 3 && now.getDate() == 1)) {
        let emojiElements = document.getElementsByClassName("nseEmoji");
        let normieArray = new Array("😂","🤣","😆", "🍆", "🍑", "💦", "💯", "😭", "🙃", "💩", "👌", "😏", "🙄", "🥵", "😱", "👀", "🤡");
        for(let i = 0; i < emojiElements.length; i++) {
            let randNum = Math.floor(Math.random() * normieArray.length);
            emojiElements[i].innerHTML = normieArray[randNum];
        }
    }
}

let nseTextAreas = new Array("nseBlacklistTaglistArea", "nseHardPassTaglistArea", "nseWhitelistTaglistArea","nseBlacklistTitleListArea","nseHardPassTitleListArea","nseWhitelistTitleListArea","nseBlacklistUploadersArea","nseWhitelistUploadersArea");

for(let textAreaCounter = 0; textAreaCounter < nseTextAreas.length; textAreaCounter++) {
    document.getElementById(nseTextAreas[textAreaCounter]).addEventListener("keydown", function(event) {
        if ((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)  && event.code == "KeyS") {
            event.preventDefault();
            saveData();
        }
     }, false);
}

let explanationTogglers = new Array("nseBLE", "nseHPE", "nseHPTE", "nseWLE","nseTitleBLE", "nseTitleWLE", "nseUBLE", "nseUWLE");

for(let i = 0; i < explanationTogglers.length; i++) {
    document.getElementById(explanationTogglers[i] + "Toggler").onclick = function() {
        document.getElementById(this.id.substring(0, this.id.length - 7)).classList.toggle("hidden");
    };
}

if(nseRightClickManagementEnabled && currentPage !== "Notification filters") {
    if(currentPage == "Torrent details") {
        let currTaglist = document.querySelector("#torrent_tags");
        let observerOptions = {subtree: true, childList: true};
        let mObserver = new MutationObserver(function() {
            let allTagElements = document.querySelectorAll(".nseTagElement");
            for(let i = 0; i < allTagElements.length; i++) {
                allTagElements[i].addEventListener('contextmenu', function(event) {
                    event.preventDefault();
                    showRCMBox("tag", this.innerHTML.trim(), event.pageX, event.pageY);
                }, false);
            }
        });

        mObserver.observe(currTaglist, observerOptions);
    } else {
        let allTagElements = document.querySelectorAll(".nseTagElement");
        for(let i = 0; i < allTagElements.length; i++) {
            allTagElements[i].addEventListener('contextmenu', function(event) {
                event.preventDefault();
                showRCMBox("tag", this.innerHTML.trim(), event.pageX, event.pageY);
            }, false);
        }
    }

    let allUploaderElements = document.querySelectorAll(".nseUploaderElement");
    for(let j = 0; j < allUploaderElements.length; j++) {
        allUploaderElements[j].addEventListener('contextmenu', function(event) {
            event.preventDefault();
            showRCMBox("uploader", this.innerHTML.trim(), event.pageX, event.pageY);
        }, false);
    }

    let allTitleElements = document.querySelectorAll(".nseTitleElement");
    for(let k = 0; k < allTitleElements.length; k++) {
        allTitleElements[k].addEventListener('contextmenu', function(event) {
            event.preventDefault();

            // Strip already hidden title fragments, if any
            let currTitle = this.innerHTML;
            let colorIndex = currTitle.indexOf("<color");
            
            if(colorIndex != -1) {
                currTitle = currTitle.substring(0, colorIndex);
            }

            showRCMBox("title", currTitle.trim(), event.pageX, event.pageY);
        }, false);
    }

    document.getElementById("nseRCMClose").onclick = function() {
        this.parentNode.classList.add("hidden");
    };
}

document.getElementById("nseExportButton").onclick = function() { exportSettings(); };
document.getElementById("nseImportFilePicker").onchange = function () { importSettings(event); };
document.getElementById("nseEraseDataButton").onclick = function () { resetSettings(); };
document.getElementById("nseSaveButton").onclick = function() { saveData(); };
document.getElementById("nseReloadButton").onclick = function() { location.reload(); };
// End event handler assignment section


// +-----------+
// | Functions |
// +-----------+
function toggleTorrents() {
    for(let k = 0; k < torrents.length; k++) {
        torrents[k].classList.toggle("hidden");
    }
}

function renumberTorrents() {
    let torrentTables = document.querySelectorAll("table.torrent_table");
    for(let i = 0; i < torrentTables.length; i++) {
        let currTorrents = torrentTables[i].querySelectorAll("tr.torrent");
        if(currTorrents) {
            let shownNum = 1;
            let hiddenNum = 1;
            for(let j = 0; j < currTorrents.length; j++) {
                if(currTorrents[j].classList.contains("hidden")) {
                    currTorrents[j].querySelector("td > strong").innerHTML = hiddenNum;
                    hiddenNum++;
                } else {
                    currTorrents[j].querySelector("td > strong").innerHTML = shownNum;
                    shownNum++;
                }
            }
        }
    }
}

function adjustHiddenHeaderCount(value) {
    let currNum = headerNode.innerHTML.match(/([0-9]+)/);
    
    if(currNum === null) {
        currNum = value;
    } else {
        currNum = currNum[0];
        currNum = Number(currNum) + value;
    }

    if(currNum === 0) {
        headerNode.innerHTML = "NoShitEmpornium";
        
        if(value !== 0) {
            toggleTorrents();
        }
    } else if(currNum === 1) {
        headerNode.innerHTML = "Toggle 1 hidden torrent";
    } else {
        headerNode.innerHTML = "Toggle " + currNum + " hidden torrents";
    }
}

function showRCMBox(boxType, elementValue, mouseX, mouseY) {
    let box = document.getElementById("nseRCMBox");
    let x = mouseX;
    let y = mouseY;

    // Make sure the box stays within page bounds
    if(x - 150 < 0) {
        x = 0;
    } else if(x + 320 > window.innerWidth) {
        x = window.innerWidth - 350;
    } else {
        x -= 150;
    }

    box.style.left = x + "px";
    box.style.top = y - 90 + "px";

    let nseRCMBoxInfoText = box.querySelector("#nseRCMBoxInfoText");
    if(boxType == "tag") {
        let infoText = `<b>Tag:</b> <span class="nseMonospace" id="nseRCMBoxTag">${elementValue}</span><br /><br />`;

        let currTagBlacklist = document.getElementById("nseBlacklistTaglistArea").value.split(" ");
        let currTagHardPassList = document.getElementById("nseHardPassTaglistArea").value.split(" ");
        let currTagWhitelist = document.getElementById("nseWhitelistTaglistArea").value.split(" ");
        let nseRCMBoxChoices = document.getElementById("nseRCMBoxChoices");

        if(currTagBlacklist.includes(elementValue)) { // Current tag is in blacklist
            infoText = infoText + `This tag was found in your <span class="nseBlacklistIdentifier">blacklist</span>!`;

            nseRCMBoxChoices.innerHTML = `
                <span class="nseRCMButton" id="nseRCMBoxBLRemove">${nseEmojiEnabled ? '➖' : '-'} Remove from blacklist</span><br /><br />
                ${nseHardPassEnabled ? 
                    `<span class="nseRCMButton" id="nseRCMBoxHPAdd">${nseEmojiEnabled ? '➕' : '+'} Move to Hard Pass</span><br /><br />` 
                : ''}
                <span class="nseRCMButton" id="nseRCMBoxWLAdd">${nseEmojiEnabled ? '➕' : '+'} Move to whitelist</span><br />
            `;

            document.getElementById("nseRCMBoxBLRemove").onclick = function() {
                let currTag = document.getElementById("nseRCMBoxTag").innerHTML;
                removeItemFromList("nseBlacklistTaglistArea", currTag);
                saveData();
                recolorTags();
                closeRCMBox();
            };

            if(nseHardPassEnabled) {
               document.getElementById("nseRCMBoxHPAdd").onclick = function() {
                    let currTag = document.getElementById("nseRCMBoxTag").innerHTML;
                    addItemToList("nseHardPassTaglistArea", "nseBlacklistTaglistArea", currTag);
                    saveData();
                    recolorTags();
                    closeRCMBox();
                }; 
            }

            document.getElementById("nseRCMBoxWLAdd").onclick = function() {
                let currTag = document.getElementById("nseRCMBoxTag").innerHTML;
                addItemToList("nseWhitelistTaglistArea", "nseBlacklistTaglistArea", currTag);
                saveData();
                recolorTags();
                closeRCMBox();
            };
        } else if(currTagWhitelist.includes(elementValue)) { // Current tag is in whitelist
            infoText = infoText + `This tag was found in your <span class="nseWhitelistIdentifier">whitelist</span>!`;

            nseRCMBoxChoices.innerHTML = `
                <span class="nseRCMButton" id="nseRCMBoxWLRemove">${nseEmojiEnabled ? '➖' : '-'} Remove from whitelist</span><br /><br />
                <span class="nseRCMButton" id="nseRCMBoxBLAdd">${nseEmojiEnabled ? '➕' : '+'} Move to blacklist</span><br /><br />
                ${nseHardPassEnabled ? 
                    `<span class="nseRCMButton" id="nseRCMBoxHPAdd">${nseEmojiEnabled ? '➕' : '+'} Move to Hard Pass</span><br />` 
                : ''}
            `;

            document.getElementById("nseRCMBoxWLRemove").onclick = function() {
                let currTag = document.getElementById("nseRCMBoxTag").innerHTML;
                removeItemFromList("nseWhitelistTaglistArea", currTag);
                saveData();
                recolorTags();
                closeRCMBox();
            };

            document.getElementById("nseRCMBoxBLAdd").onclick = function() {
                let currTag = document.getElementById("nseRCMBoxTag").innerHTML;
                addItemToList("nseBlacklistTaglistArea", "nseWhitelistTaglistArea", currTag);
                saveData();
                recolorTags();
                closeRCMBox();
            };

            if(nseHardPassEnabled) {
                document.getElementById("nseRCMBoxHPAdd").onclick = function() {
                     let currTag = document.getElementById("nseRCMBoxTag").innerHTML;
                     addItemToList("nseHardPassTaglistArea", "nseWhitelistTaglistArea", currTag);
                     saveData();
                     recolorTags();
                     closeRCMBox();
                 }; 
             }
        } else if(nseHardPassEnabled && currTagHardPassList.includes(elementValue)) {
                // Current tag is in Hard Pass and it is enabled
                infoText = infoText + `This tag was found in your <span class="nseBlacklistIdentifier">Hard Pass blacklist</span>!`;
    
                nseRCMBoxChoices.innerHTML = `
                    <span class="nseRCMButton" id="nseRCMBoxHPRemove">${nseEmojiEnabled ? '➖' : '-'} Remove from Hard Pass</span><br /><br />
                    <span class="nseRCMButton" id="nseRCMBoxBLAdd">${nseEmojiEnabled ? '➕' : '+'} Move to blacklist</span><br /><br />
                    <span class="nseRCMButton" id="nseRCMBoxWLAdd">${nseEmojiEnabled ? '➕' : '+'} Move to whitelist</span><br />
                `;
    
                document.getElementById("nseRCMBoxHPRemove").onclick = function() {
                    let currTag = document.getElementById("nseRCMBoxTag").innerHTML;
                    removeItemFromList("nseHardPassTaglistArea", currTag);
                    saveData();
                    recolorTags();
                    closeRCMBox();
                };
    
                document.getElementById("nseRCMBoxBLAdd").onclick = function() {
                    let currTag = document.getElementById("nseRCMBoxTag").innerHTML;
                    addItemToList("nseBlacklistTaglistArea", "nseHardPassTaglistArea", currTag);
                    saveData();
                    recolorTags();
                    closeRCMBox();
                };
    
                document.getElementById("nseRCMBoxWLAdd").onclick = function() {
                    let currTag = document.getElementById("nseRCMBoxTag").innerHTML;
                    addItemToList("nseWhitelistTaglistArea", "nseHardPassTaglistArea", currTag);
                    saveData();
                    recolorTags();
                    closeRCMBox();
                };
        } else { // Current tag is in no list
            infoText = infoText + "This tag was not found in any of your taglists.";

            nseRCMBoxChoices.innerHTML = `
                <span class="nseRCMButton" id="nseRCMBoxBLAdd">${nseEmojiEnabled ? '➕' : '+'} Add to blacklist</span><br /><br />
                ${nseHardPassEnabled ? 
                    `<span class="nseRCMButton" id="nseRCMBoxHPAdd">${nseEmojiEnabled ? '➕' : '+'} Add to Hard Pass</span><br /><br />` 
                : ''}
                <span class="nseRCMButton" id="nseRCMBoxWLAdd">${nseEmojiEnabled ? '➕' : '+'} Add to whitelist</span><br />
            `;

            document.getElementById("nseRCMBoxBLAdd").onclick = function() {
                let currTag = document.getElementById("nseRCMBoxTag").innerHTML;
                addItemToList("nseBlacklistTaglistArea", "nseWhitelistTaglistArea", currTag);
                saveData();
                recolorTags();
                closeRCMBox();
            };

            if(nseHardPassEnabled) {
                document.getElementById("nseRCMBoxHPAdd").onclick = function() {
                     let currTag = document.getElementById("nseRCMBoxTag").innerHTML;
                     addItemToList("nseHardPassTaglistArea", "nseWhitelistTaglistArea", currTag);
                     saveData();
                     recolorTags();
                     closeRCMBox();
                 }; 
             }

            document.getElementById("nseRCMBoxWLAdd").onclick = function() {
                let currTag = document.getElementById("nseRCMBoxTag").innerHTML;
                addItemToList("nseWhitelistTaglistArea", "nseBlacklistTaglistArea", currTag);
                saveData();
                recolorTags();
                closeRCMBox();
            };
        }

        nseRCMBoxInfoText.innerHTML = infoText;
    } else if(boxType == "uploader") {
        let infoText = "<b>Uploader:</b> <span class=\"nseMonospace\" id=\"nseRCMBoxUploader\">" + elementValue + "</span><br /><br />";

        let currUploaderBlacklist = document.getElementById("nseBlacklistUploadersArea").value.split(" ");
        let currUploaderWhitelist = document.getElementById("nseWhitelistUploadersArea").value.split(" ");
        let nseRCMBoxChoices = document.getElementById("nseRCMBoxChoices");

        if(currUploaderBlacklist.includes(elementValue)) { // Current uploader is in blacklist
            infoText = infoText + `This uploader was found in your <span class="nseBlacklistIdentifier">blacklist</span>!`;

            nseRCMBoxChoices.innerHTML = `
                <span class="nseRCMButton" id="nseRCMBoxBLRemove">${nseEmojiEnabled ? '➖' : '-'} Remove from blacklist</span><br /><br />
                <span class="nseRCMButton" id="nseRCMBoxWLAdd">${nseEmojiEnabled ? '➕' : '+'} Move to whitelist</span><br />
            `;

            document.getElementById("nseRCMBoxBLRemove").onclick = function() {
                let currTag = document.getElementById("nseRCMBoxUploader").innerHTML;
                removeItemFromList("nseBlacklistUploadersArea", currTag);
                saveData();
                recolorUploaders();
                closeRCMBox();
            };

            document.getElementById("nseRCMBoxWLAdd").onclick = function() {
                let currTag = document.getElementById("nseRCMBoxUploader").innerHTML;
                addItemToList("nseWhitelistUploadersArea", "nseBlacklistUploadersArea", currTag);
                saveData();
                recolorUploaders();
                closeRCMBox();
            };
        } else if(currUploaderWhitelist.includes(elementValue)) { // Current uploader is in whitelist
            infoText = infoText + `This uploader was found in your <span class="nseWhitelistIdentifier">whitelist</span>!`;

            nseRCMBoxChoices.innerHTML = `
                <span class="nseRCMButton" id="nseRCMBoxWLRemove">${nseEmojiEnabled ? '➖' : '-'} Remove from whitelist</span><br /><br />
                <span class="nseRCMButton" id="nseRCMBoxBLAdd">${nseEmojiEnabled ? '➕' : '+'} Move to blacklist</span><br />
            `;

            document.getElementById("nseRCMBoxWLRemove").onclick = function() {
                let currTag = document.getElementById("nseRCMBoxUploader").innerHTML;
                removeItemFromList("nseWhitelistUploadersArea", currTag);
                saveData();
                recolorUploaders();
                closeRCMBox();
            };

            document.getElementById("nseRCMBoxBLAdd").onclick = function() {
                let currTag = document.getElementById("nseRCMBoxUploader").innerHTML;
                addItemToList("nseBlacklistUploadersArea", "nseWhitelistUploadersArea", currTag);
                saveData();
                recolorUploaders();
                closeRCMBox();
            };
        } else { // Current uploader is in no list
            infoText = infoText + "This uploader was not found in any of your uploader lists.";

            nseRCMBoxChoices.innerHTML = `
                <span class="nseRCMButton" id="nseRCMBoxBLAdd">${nseEmojiEnabled ? '➕' : '+'} Add to blacklist</span><br /><br />
                <span class="nseRCMButton" id="nseRCMBoxWLAdd">${nseEmojiEnabled ? '➕' : '+'} Add to whitelist</span><br />
            `;

            document.getElementById("nseRCMBoxBLAdd").onclick = function() {
                let currTag = document.getElementById("nseRCMBoxUploader").innerHTML;
                addItemToList("nseBlacklistUploadersArea", "nseWhitelistUploadersArea", currTag);
                saveData();
                recolorUploaders();
                closeRCMBox();
            };

            document.getElementById("nseRCMBoxWLAdd").onclick = function() {
                let currTag = document.getElementById("nseRCMBoxUploader").innerHTML;
                addItemToList("nseWhitelistUploadersArea", "nseBlacklistUploadersArea", currTag);
                saveData();
                recolorUploaders();
                closeRCMBox();
            };
        }

        nseRCMBoxInfoText.innerHTML = infoText;
    } else if(boxType == "title") {
        let infoText = `Customize the title phrase you would like to filter in the text box below. You can use a semicolon <span class="nseMonospace">;</span> to separate multiple phrases:<br /><br />
        <input type="text" class="nseInput" id="nseRCMTitlePhraseText" value="${elementValue.replace(/"/g, '&quot;')}"></input><br />`;
        nseRCMBoxInfoText.innerHTML = infoText;

        let nseRCMBoxChoices = document.getElementById("nseRCMBoxChoices");

        nseRCMBoxChoices.innerHTML = `
            <span class="nseRCMButton" id="nseRCMBoxBLAdd">${nseEmojiEnabled ? '➕' : '+'} Add phrase(s) to title blacklist</span><br /><br />
            ${nseHardPassEnabled ? `<span class="nseRCMButton" id="nseRCMBoxHPTAdd">${nseEmojiEnabled ? '➕' : '+'} Add phrase(s) to title Hard Pass</span><br /><br />` : ''}
            <span class="nseRCMButton" id="nseRCMBoxWLAdd">${nseEmojiEnabled ? '➕' : '+'} Add phrase(s) to title whitelist</span><br />
        `;

        document.getElementById("nseRCMBoxBLAdd").onclick = function() {
            let currTitlePhrase = document.getElementById("nseRCMTitlePhraseText").value;
            
            addItemToList("nseBlacklistTitleListArea", "nseWhitelistTitleListArea", currTitlePhrase);
            saveData();
            closeRCMBox();
        };

        document.getElementById("nseRCMBoxHPTAdd").onclick = function() {
            let currTitlePhrase = document.getElementById("nseRCMTitlePhraseText").value;
            
            addItemToList("nseHardPassTitleListArea", "nseWhitelistTitleListArea", currTitlePhrase);
            saveData();
            closeRCMBox();
        };

        document.getElementById("nseRCMBoxWLAdd").onclick = function() {
            let currTitlePhrase = document.getElementById("nseRCMTitlePhraseText").value;
            
            addItemToList("nseWhitelistTitleListArea", "nseBlacklistTitleListArea", currTitlePhrase);
            saveData();
            closeRCMBox();
        };
    }
    
    box.classList.remove("hidden");
    return false;
}

function closeRCMBox() {
    document.getElementById("nseRCMBox").classList.add("hidden");
}

function removeItemFromList(tagListAreaName, tagName) {
    let currList = document.getElementById(tagListAreaName).value.trim().split(" ");

    let index = currList.indexOf(tagName);
    if (index > -1) {
        currList.splice(index, 1);
    }

    document.getElementById(tagListAreaName).value = currList.join(" ");
    
    // Show the refresh button because we've done changes
    document.getElementById("nseDynamicRefreshNode").classList.remove("hidden");
}

function addItemToList(tagListAreaName, oppositeTagListAreaName, filterValue) {
    let splitChar = " ";
    if(tagListAreaName == "nseWhitelistTitleListArea" || tagListAreaName == "nseBlacklistTitleListArea" || tagListAreaName == "nseHardPassTitleListArea") {
        splitChar = ";";
    } else {
        // Only do opposite removal for tags/uploaders
        removeItemFromList(oppositeTagListAreaName, filterValue);
    }

    let currList = document.getElementById(tagListAreaName).value.trim().split(splitChar);

    if(splitChar == ";") {
        // Since titles can include more than one phrase, iterate through an exploded array
        let titleArray = filterValue.split(splitChar);

        for(let l = 0; l < titleArray.length; l++) {
            let currPhrase = titleArray[l].trim();
            if(currPhrase != "") {
                currList.push(currPhrase);
            }
        }
    } else {
        currList.push(filterValue);    
    }
    
    document.getElementById(tagListAreaName).value = currList.join(splitChar).replace(/;/,';');

    // Show the refresh button because we did changes
    document.getElementById("nseDynamicRefreshNode").classList.remove("hidden");
}

function downloadFile(filename, text) {
    let element = document.createElement('a');
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
  
    element.click();
    document.body.removeChild(element);
}

function exportSettings(getSize = false) {
    if(!getSize) { saveData(); }

    let settingsNames = GM_listValues();
    let settings = {};

    for(let i = 0; i < settingsNames.length; i++) {
        settings[settingsNames[i]] = GM_getValue(settingsNames[i], null);
    }

    let jsonOutput = JSON.stringify(settings);

    if(getSize) {
        return String(jsonOutput.length);
    } else {
        downloadFile(`nseExport-${Date.now()}.json`, jsonOutput);
    }
}

function importSettings(event) {
    let reader = new FileReader();
    reader.onload = function(){
        if(confirm("Are you sure you want to import this file? Your existing settings will be cleared and overwritten!")) {

            // Clear old data before importing
            let settingsNames = GM_listValues();

            for(let i = 0; i < settingsNames.length; i++) {
                GM_deleteValue(settingsNames[i]);
            }
            
            // Import JSON
            let settingsObject = JSON.parse(reader.result);
            for(let i = 0; i < Object.keys(settingsObject).length; i++) {
                GM_setValue(Object.keys(settingsObject)[i], settingsObject[Object.keys(settingsObject)[i]]);
            }

            location.reload();
        }
    };
    reader.readAsText(event.target.files[0]);
}

function resetSettings() {
    if(confirm("Are you sure you want to reset all blacklists, all whitelists, and all preferences in NSE? This cannot be undone!")) {
        let settingsNames = GM_listValues();

        for(let i = 0; i < settingsNames.length; i++) {
            GM_deleteValue(settingsNames[i]);
        }

        location.reload();
    }
}

function saveData() {
    let listsToSave = {
        nseTaglist: "nseBlacklistTaglistArea",
        nseHardPassTaglist: "nseHardPassTaglistArea",
        nseWhitelist: "nseWhitelistTaglistArea",
        nseBlacklistTitles: "nseBlacklistTitleListArea",
        nseHardPassTitles: "nseHardPassTitleListArea",
        nseWhitelistTitles: "nseWhitelistTitleListArea",
        nseUploaders: "nseBlacklistUploadersArea",
        nseWhitelistUploaders: "nseWhitelistUploadersArea"
    };

    // Convert to lower case, trim whitespace, remove duplicates and save filter lists
    for(const setting in listsToSave) {
        let strList = document.getElementById(listsToSave[setting]).value.trim().toLowerCase();
        let delimiter = " ";
        
        if(listsToSave[setting].includes("TitleList")) { 
            delimiter = ";";
        }
        
        // Empty diff lists
        let removedList = new Array(0);
        let addedList = new Array(0);

        // List from text boxes
        let freshList = strList.split(delimiter);

        // Stored list (might have changed since we made our cache at the start of the script)
        let storedList = GM_getValue(setting).split(delimiter);

        // Cached copy of stored list
        let cachedList;
        switch(setting) {
            case "nseTaglist":
                cachedList = nseBlacklistTags;
                break;
            case "nseHardPassTaglist":
                cachedList = nseHardPassTags;
                break;
            case "nseWhitelist":
                cachedList = nseWhitelistTags;
                break;
            case "nseBlacklistTitles":
                cachedList = nseBlacklistTitlePhrases;
                break;
            case "nseHardPassTitles":
                cachedList = nseHardPassTitlePhrases;
                break;
            case "nseWhitelistTitles":
                cachedList = nseWhitelistTitlePhrases;
                break;
            case "nseUploaders":
                cachedList = nseBlacklistUploaders;
                break;
            case "nseWhitelistUploaders":
                cachedList = nseWhitelistUploaders;
                break;
        }

        // Compute additions and removals from OG array
        freshList.forEach(function(item){
            if(cachedList.indexOf(item) == -1) {
                addedList.push(item);
            }
        });

        cachedList.forEach(function(item) {
            if(freshList.indexOf(item) == -1) {
                removedList.push(item);
            }
        });

        // Remove removals and add additions to the stored list
        removedList.forEach(function(item) {
            let foundIndex = storedList.indexOf(item);
            if(foundIndex > -1) {
                storedList.splice(foundIndex, 1);
            }
        });
        
        addedList.forEach(function(item) {
            let foundIndex = storedList.indexOf(item);
            if(foundIndex == -1) {
                if(item !== "" && item !== null) {
                    storedList.push(item);
                }
            }
        });

        // Turning it into a set and back into an array will automagically kill dupes
        storedList = [...new Set(storedList)];
        storedList.sort();

        strList = storedList.join(delimiter);
        GM_setValue(setting, strList);

        // Reflect updated list in textarea
        document.getElementById(listsToSave[setting]).value = strList;

        // Update cached copy of list
        switch(setting) {
            case "nseTaglist":
                nseBlacklistTaglist = strList;
                nseBlacklistTags = storedList;
                break;
            case "nseHardPassTaglist":
                nseHardPassTaglist = strList;
                nseHardPassTags = storedList;
                break;
            case "nseWhitelist":
                nseWhitelistTaglist = strList;
                nseWhitelistTags = storedList;
                break;
            case "nseBlacklistTitles":
                nseBlacklistTitleList = strList;
                nseBlacklistTitlePhrases = storedList;
                break;
            case "nseHardPassTitles":
                nseHardPassTitleList = strList;
                nseHardPassTitlePhrases = storedList;
                break;
            case "nseWhitelistTitles":
                nseWhitelistTitleList = strList;
                nseWhitelistTitlePhrases = storedList;
                break;
            case "nseUploaders":
                nseBlacklistUploadersList = strList;
                nseBlacklistUploaders = storedList;
                break;
            case "nseWhitelistUploaders":
                nseWhitelistUploadersList = strList;
                nseWhitelistUploaders = storedList;
                break;
        }
    }

    let checkboxes = {
        nseObliviousModeEnabled: "nseCheckObliviousMode",
        nseRussianRouletteEnabled: "nseCheckRussianRouletteMode",
        nseHideAnonUploadsEnabled: "nseCheckHideAnonUploads",
        nseHideWarnedEnabled: "nseCheckHideWarned",
        nseHideReportedEnabled: "nseCheckHideReported",
        nseHideSnatchedEnabled: "nseCheckHideSnatched",
        nseHideSeedingEnabled: "nseCheckHideSeeding",
        nseHideLeechingEnabled: "nseCheckHideLeeching",
        nseHideGrabbedEnabled: "nseCheckHideGrabbed",
        nseHideBookmarkedEnabled: "nseCheckHideBookmarked",
        nseBypassWhitelistsEnabled: "nseCheckBypassWhitelists",
        nseIndividualUploadHidingEnabled: "nseCheckIndividualHide",
        nseFilterAllButtonEnabled: "nseCheckFilterAllButtonEnabled",
        nseRightClickManagementEnabled: "nseCheckRightClickManagementEnabled",
        nseRCMTagsEnabled: "nseCheckRCMTagsEnabled",
        nseRCMTitlesEnabled: "nseCheckRCMTitlesEnabled",
        nseRCMUploadersEnabled: "nseCheckRCMUploadersEnabled",
        nseEmojiEnabled: "nseCheckEmojiEnabled",
        nseScrollToNSEEnabled: "nseCheckScrollToNSEEnabled",
        nseHardPassEnabled: "nseCheckHardPassEnabled",
        nseRemoveHardPassResults: "nseCheckRemoveHardPassResults",
        nseHideUnseededEnabled: "nseCheckHideUnseeded",
        nseRenumberTorrentsEnabled: "nseCheckRenumberTorrents",
        nseHideCategoryIconsEnabled: "nseCheckHideCategoryIcons",
        nseArrowNavigationEnabled: "nseCheckArrowNavigation",
        nseUpdateToastsEnabled: "nseCheckUpdateToasts",
        nseFloatingToggleButtonEnabled: "nseCheckFloatingToggleButton",
        nseOpenAllButtonEnabled: "nseCheckOpenAllButton",
        nseOpenAllGoNextEnabled: "nseCheckOpenAllGoNext",
        nseCustomCSSEnabled: "nseCheckCustomCSS"
    };

    for(const setting in checkboxes) {
        GM_setValue(setting, document.getElementById(checkboxes[setting]).checked);
    }

    if(nseEnableApril1stOption) {
        GM_setValue("nseEveryDayIsApril1st", document.getElementById("nseCheckApril1stAllYear").checked);
    }

    let nseThemeDropdown = document.getElementById("nseThemeDropdown");
    GM_setValue("nseSelectedTheme", nseThemeDropdown.options[nseThemeDropdown.selectedIndex].value);

    nseCustomTheme = {
        backgroundColor: document.getElementById("nseCustomThemeBgCol").value,
        backgroundHighlightColor: document.getElementById("nseCustomThemeBgHighCol").value,
        foregroundColor: document.getElementById("nseCustomThemeForeCol").value,
        accentColor: document.getElementById("nseCustomThemeAccentCol").value,
        highlightColor: document.getElementById("nseCustomThemeHighCol").value,
        hiddenBackgroundColor: document.getElementById("nseCustomThemeHiddenBgCol").value
    };
    GM_setValue("nseCustomTheme", nseCustomTheme);

    GM_setValue("nseUIFont", document.getElementById("nseUIFont").value);
    GM_setValue("nseTextAreaFont", document.getElementById("nseTextAreaFont").value);

    GM_setValue("nseBlacklistColor", document.getElementById("nseBlacklistColor").value);    
    GM_setValue("nseHardPassColor", document.getElementById("nseHardPassColor").value);    
    GM_setValue("nseWhitelistColor", document.getElementById("nseWhitelistColor").value);

    GM_setValue("nseTimeout", Number(document.getElementById("nseTimeout").value));

    // We need to escape backslashes in the custom CSS as it will be included in a back-ticked CSS block
    let css = document.getElementById("nseCustomCSSArea").value;
    css = css.replace(/\\/gi, "\\\\");
    GM_setValue("nseCustomCSS", css);

    let time = new Date().toLocaleTimeString();
    document.getElementById("nseSaveDiv").innerHTML = "Saved at " + time + "!";
    document.getElementById("nseSaveDiv").classList.remove("hidden");
}

function nseGoBack(event = null) {
    let prevLink = document.getElementsByClassName("pager_prev")[0];
    if(prevLink) {
        if(event) { event.preventDefault(); }
        prevLink.click();
    } else {
        let firstLink = document.getElementsByClassName("pager_first")[0];
        if(firstLink) {
            if(event) { event.preventDefault(); }
            firstLink.click();
        }
    }
}

function nseGoForward(event = null) {
    let nextLink = document.getElementsByClassName("pager_next")[0];
    if(nextLink) {
        if(event) { event.preventDefault(); }
        nextLink.click();
    } else {
        let lastLink = document.getElementsByClassName("pager_last")[0];
        if(lastLink) {
            if(event) { event.preventDefault(); }
            lastLink.click();
        }
    }
}

// +-----+
// | CSS |
// +-----+
GM_addStyle(`

.nseOuterDiv, #nseRCMBox {
    font-family: ${nseUIFont} !important;
    margin:auto;
    color: ${themes[nseSelectedTheme].foregroundColor};
    padding: 10px;
    border: 1px solid ${themes[nseSelectedTheme].accentColor};
    box-shadow: 0 1px 3px rgba(0,0,0,.1);
    background-color: ${themes[nseSelectedTheme].backgroundColor} !important;
    border-radius: 20px;
}

#nseOuter {
    width: 600px;
    margin-top: 10px;
}

p:not(:last-child) {
    margin: 0 0 20px;
}

section {
    display: none;
    padding: 20px 0 0;
    border-top: 1px solid ${themes[nseSelectedTheme].accentColor};
}

#nseUpdateToast {
    font-family: ${nseUIFont} !important;
    z-index: 9001 !important;
    position: fixed;
    bottom: 0px;
    width: 100%;
    height: 80px;
    text-align: center;
    color: ${themes[nseSelectedTheme].foregroundColor};
    background-color: ${themes[nseSelectedTheme].backgroundColor};
    border-top: 3px solid ${themes[nseSelectedTheme].accentColor};
}

.nseRadioButton {
    display: none;
}

.nseLabel {
    display: inline-block;
    margin: 0 0 -1px;
    padding: 15px;
    font-weight: 600;
    text-align: center;
    color: ${themes[nseSelectedTheme].accentColor};
    background-color: ${themes[nseSelectedTheme].backgroundColor} !important;
    border: 1px solid ${themes[nseSelectedTheme].accentColor};
    margin-right: 5px;
}

.nseSettingsCheckbox {
    padding: 5px;
}

a.nseLink, a.nseLink:visited {
    color: ${themes[nseSelectedTheme].accentColor};
}

.nseSpanLink {
    color: ${themes[nseSelectedTheme].accentColor};
    cursor: pointer;
}

.nseLabel:hover {
    color: ${themes[nseSelectedTheme].highlightColor};
    background-color: ${themes[nseSelectedTheme].backgroundHighlightColor} !important;
}

.nseRadioButton:checked + .nseLabel {
    color: ${themes[nseSelectedTheme].accentColor};
    border: 1px solid ${themes[nseSelectedTheme].accentColor};
    border-top: 2px solid ${themes[nseSelectedTheme].accentColor};
    border-bottom: 1px solid ${themes[nseSelectedTheme].backgroundColor};
}

#nseTab1:checked ~ #nseContent1,#nseTab2:checked ~ #nseContent2,#nseTab3:checked ~ #nseContent3,#nseTab4:checked ~ #nseContent4 {
    display: block;
}

#nseSettingsTab1:checked ~ #nseSettingsContent1,#nseSettingsTab2:checked ~ #nseSettingsContent2,#nseSettingsTab3:checked ~ #nseSettingsContent3,#nseSettingsTab4:checked ~ #nseSettingsContent4 {
    display: block;
}

.nseExplanationSpan {
    font-size: 14px !important;
    color: ${themes[nseSelectedTheme].accentColor};
}

.nseESOffset {
    margin-left: 60px;
}

.nseListHeader {
    font-size: 18px;
}

.nseImageButton {
    position: relative;
    color: ${themes[nseSelectedTheme].foregroundColor};
    font-weight: bold;
}

.nseImageButton > a, .nseImageButton  > a:visited {
    color: ${themes[nseSelectedTheme].foregroundColor};
    text-decoration: none;
    border: 0;
}

.nseImageButton:before {
    font-weight: normal;
    margin-right: 5px;
}

.nseExplanationBox, #nseCustomThemeDiv, #nseCustomCSSDiv, .nseNiceBox {
    width: 97%;
    margin-top: 10px;
    border: 1px solid ${themes[nseSelectedTheme].accentColor};
    padding: 10px;
    border-radius: 10px;
}

#nseRCMCustomizationDiv {
    margin-top: 0px;
}

.nseNiceBox {
    width: 75%;
}

#nseHeader, .nseCenterDiv {
    width: 100%;
    margin: auto;
    text-align: center;
    font-size: 18px;
}

.nseExplanationToggler, ${currentPage !== "My uploaded" ? "#nseHeaderText," : ""} .nseNiceButton, .nseRCMButton, .nseLabel:hover {
    cursor: pointer;
}

#nseRCMBox {
    width: 300px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9001;
}

#nseRCMClose {
    float: right;
    cursor: pointer;
}

.nseMonospace {
    font-family: Courier New;
    font-size: 16px;
}

.nseTextArea {
    font-family: ${nseTextAreaFont} !important;
    width: 99%;
    max-width: 99%;
}

.nseTextArea, .nseInput {
    color: ${themes[nseSelectedTheme].foregroundColor};
    background: none !important;
    background-color: ${themes[nseSelectedTheme].backgroundColor};
    border: 1px solid ${themes[nseSelectedTheme].accentColor};
}

.nseFieldDiv, .nseExplanationNode, .nseExplanationBox, #nseCustomThemeDiv, #nseCustomCSSDiv, .nseOuterDiv {
    margin-bottom: 10px;
}

.nseHiddenUploader, .nseHiddenTag, .nseHiddenTitle, .nseBlacklistIdentifier {
    color: ${nseBlacklistColor} !important;
    font-weight: bold !important;
}

.nseWhitelistedUploader, .nseWhitelistedTag, .nseWhitelistedTitle, .nseWhitelistIdentifier {
    color: ${nseWhitelistColor} !important;
    font-weight: bold !important;
}

.nseHiddenTag, .nseWhitelistedTag, .nseWhitelistedTitle, .nseHiddenTitle {
    display: inline;
}

.nseHardPassTag, .nseHardPassTitle {
    color: ${nseHardPassColor} !important;
    font-weight: bold !important;
}

.nseNiceButton, .nseRCMButton {
    background-color: ${themes[nseSelectedTheme].backgroundColor} !important;
    color: ${themes[nseSelectedTheme].foregroundColor} !important;
    border: 1px solid ${themes[nseSelectedTheme].accentColor};
    border-radius: 10px;
    padding: 5px;
    margin-left: 5px;
    margin-right: 5px;
    font-size: 16px;
}

.nseNiceButton:hover, .nseRCMButton:hover {
    background-color: ${themes[nseSelectedTheme].backgroundHighlightColor} !important;
}

.nseNiceButton, .nseRCMButton {
    padding-top: 3px;
}

.nseBtmAiryDiv {
    margin-bottom: 20px;
}

#nseSaveDiv, .nseTopAiryDiv {
    margin-top: 20px;
}

#nseSaveDiv, #nseDataUsage {
    font-weight: bold;
}

#nseMainDiv, .nseUpdateToastDiv {
    margin-top: 10px;
}

h3.nseH3 {
    color: ${themes[nseSelectedTheme].foregroundColor} !important;
}

.nseIndividuallyWhitelisted {
    border: 2px solid green;
    background-color: #CEF6D8;
}

.nseIndividuallyBlacklisted {
    border: 2px solid red;
    background-color: #F6CED8;
}

.nseIndividuallyUntouched {
    border: 2px solid gray;
    background-color: #EBEBEB;
}

.nseIndividuallyBlacklisted, .nseIndividuallyWhitelisted, .nseIndividuallyUntouched {
    border-radius: 5px;
}

.nseEmoji {
    display: ${nseEmojiEnabled ? 'inline-block' : 'none'};
}

.nseToggleHideButton {
    z-index: 1 !important;
}

#nseRCMTitlePhraseText {
    width: 95%;
}

.nseSettingsControlDiv {
    text-align: center;
}

#nseFloatyBoi {
    bottom: 2em;
    right: 2em;
    background-color: ${themes[nseSelectedTheme].backgroundColor} !important;
    color: ${themes[nseSelectedTheme].foregroundColor} !important;
    padding: 0.4em;
    border-radius: 0.8em;
    position: fixed;
    float: right;
    z-index: 1000;
    user-select: none;
    cursor: pointer;
}

${nseCustomCSSEnabled ? nseCustomCSS : ''}

`);
// End CSS section

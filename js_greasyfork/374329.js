// ==UserScript==
// @name         Facepunch Videos Section Replacement
// @namespace    https://forum.facepunch.com
// @version      2.5.3
// @description  Uses high tier magicks to split General into two - General (without the video spam) and Videos (with all the video spam you may ever need)
// @author       Annoyed Grunt
// @match        https://forum.facepunch.com/*
// @downloadURL https://update.greasyfork.org/scripts/374329/Facepunch%20Videos%20Section%20Replacement.user.js
// @updateURL https://update.greasyfork.org/scripts/374329/Facepunch%20Videos%20Section%20Replacement.meta.js
// ==/UserScript==

var titleLabel = "Videos ";
var subtitleLabel = "Gentlemen, we can rebuild it. We have the technology.";
var iconUrl = "https://files.facepunch.com/garry/95650b81-5219-41e9-a4db-327e3e8f4144.svg";

var mainPageUrl = RegExp("^(?:https:\\/\\/forum.facepunch.com(?:/*(?:f|forum)?/*))$");
var videosPageParam = "videos";
var generalPageUrl = "https://forum.facepunch.com/general";
var videosPageUrl = `https://forum.facepunch.com/general?${videosPageParam}`;

var videoPageEnabled = "videoPageEnabled";
var settingsKeepThreadsWithIcon = "settingsKeepThreadWithIcon";
var settingsUseLaxTag = "settingsUseLaxTag";
var settingsDeleteTag = "settingsDeleteTag";
var threadUrl = "https://forum.facepunch.com/general/bubpd/Replacement-Video-Section-2-0-Back-with-a-Vengeance/1/";

function addStyle(aCss) {
    'use strict';
    let head = document.getElementsByTagName('head')[0];
    if (head) {
        let style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = aCss;
        head.appendChild(style);
        return style;
    }
    return null;
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function keyExists(key) {
    var value = window.localStorage.getItem(key);
    return !(value == null);
}

function getBooleanKey(key, defaultValue) {
    var value = window.localStorage.getItem(key);
    return ((value == null) ? defaultValue : (value == "true"));
}

function setKey(key, value) {
    window.localStorage.setItem(key, value.toString());
}

function setVideoPageEnabled(isEnabled) {
    window.sessionStorage.setItem(videoPageEnabled, isEnabled.toString());
}

function isVideoPageEnabled() {
    var value = window.sessionStorage.getItem(videoPageEnabled);
    return ((value == null) ? true : (value == "true"));
}

function filterThreads(keepVideos) {
    var threadClass = "threadblock";
    var threadTitleClass = "threadname";

    var threads = document.querySelectorAll(`.${threadClass}`);
    for (var thread of threads) {
        var title = thread.querySelector(`.${threadTitleClass}`);
        var isVideo = videoTag.test(title.innerHTML);

        if (getBooleanKey(settingsKeepThreadsWithIcon)) {
            isVideo = isVideo || (thread.querySelector(`[data-label="Television"]`) != null);
        }

        if (keepVideos != isVideo) {
            thread.remove();
        } else {
            if (isVideo) {
                var shouldRemoveTag = getBooleanKey(settingsDeleteTag, false);
                if (shouldRemoveTag) {title.innerHTML = title.innerHTML.replace(videoTag, "")};
            }
        }
    }
}

function newForumBlock(titleLabel, subtitleLabel, iconUrl, url) {
    var blockClass = "forumblock";
    var linkClass = "bglink";
    var titleClass = "forumtitle";
    var subtitleClass = "forumsubtitle";
    var elementsToDelete = ["forumlastpost", "threadcount", "postcount"];

    var genericForumBlock = document.querySelector(`.${blockClass}`);
    var newForumBlock = genericForumBlock.cloneNode(true);
    newForumBlock.classList.add("videoforum");
    //Customizing the new forum block
    //Deleting unnecessary elements
    for (let className of elementsToDelete) {
        for (let element of newForumBlock.querySelectorAll(`.${className}`)) {
            element.parentNode.removeChild(element);
        }
    }

    //Setting the title and subtitle
    var title = newForumBlock.querySelector(`.${titleClass}`);
    title.innerHTML = titleLabel;
    var subtitle = newForumBlock.querySelector(`.${subtitleClass}`);
    subtitle.innerHTML = subtitleLabel;

    //Customizing links
    for (let element of newForumBlock.querySelectorAll(`.${linkClass}`)) {
        element.href = url;
        element.title = subtitleLabel;

        //Replacing the image
        if (element.nextElementSibling.tagName == "IMG") {
            element.nextElementSibling.src = iconUrl;
        }
    }

    //Adding settings button
    newForumBlock.appendChild(newSettingsButton());

    //We're done.
    genericForumBlock.parentNode.insertBefore(newForumBlock, genericForumBlock.nextSibling);
    return newForumBlock;
}

function newSettingsButton() {
    var elementHtml = "<li class=\"forumlastpost\"><button class=\"button is-primary is-fullwidth\"><i class=\"mdi mdi-settings\"></i> <span>&nbsp; Settings</span></button></li>";
    var element = htmlToElement(elementHtml);
    element.addEventListener("mouseup", showSettings);
    return element;
}

function addStylesheet() {
    var settingsStyle = `
    .modal-background {
        z-index: 999;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform: scale(1.1, 1.1);
        background-color: rgba(0, 0, 0, 0.4);
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s 0.10s, opacity 0.10s, transform 0.10s;
    }

    .modal-content {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        border-radius: 0.5rem;
        padding: 1rem;
        width: 40%;
        height: auto;
    }

    .modal-show {
        transform: scale(1.0, 1.0);
        visibility: visible;
        opacity: 1;
        transition: visibility 0s, opacity 0.10s, transform 0.10s;
    }

    .settings-option {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .settings-control-container {
        display: flex;
        justify-content: space-around;
        margin-top: 1rem;
    }

    .settings-button {
        flex-grow: 0.3;
    }`;

    addStyle(settingsStyle);
}

function makeSettingsPage() {
    var modalHtml = `
    <div id="settings-page" class="modal-background">
        <div class="modal-content">
            <div class="settings-option">
                 <label for="${settingsKeepThreadsWithIcon}">Move threads with the Television icon to Videos</label>
                 <input type="checkbox" name="${settingsKeepThreadsWithIcon}"/>
            </div>
            <div class="settings-option">
                 <label for="${settingsUseLaxTag}">Attempt to include threads with misspelled tags</label>
                 <input type="checkbox" name="${settingsUseLaxTag}"/>
            </div>
            <div class="settings-option">
                 <label for="${settingsDeleteTag}">Delete the video tag from titles to reduce clutter</label>
                 <input type="checkbox" name="${settingsDeleteTag}"/>
            </div>
            <div class="settings-control-container">
                <button id="save-settings" class="button is-primary settings-button">Save Settings</button>
                <a id="thread-redirect" class="button is-secondary settings-button" href="${threadUrl}">Go to Thread</a>
            </div>
        </div>
    </div>`;
    var element = htmlToElement(modalHtml);
    element.addEventListener("mouseup", function(e) {if (this === e.target) {hideSettings()}});
    element.querySelector("#save-settings").addEventListener("mouseup", function(e) {if (this === e.target) {saveSettings(); hideSettings()}});
    return element;
}

function showSettings(event) {
    var settingsPage = document.querySelector("#settings-page");
    //Fill Options
    let checkboxes = settingsPage.querySelectorAll(`input[type="checkbox"]`);
    for (var checkbox of checkboxes) {
        var key = checkbox.name;
        var isOn = getBooleanKey(key, false);
        checkbox.checked = isOn;
    }
    settingsPage.classList.add("modal-show");
}

function hideSettings() {
    var settingsPage = document.querySelector("#settings-page");
    settingsPage.classList.remove("modal-show");
}

function saveSettings() {
    var settingsPage = document.querySelector("#settings-page");
    //Save Options
    let checkboxes = settingsPage.querySelectorAll(`input[type="checkbox"]`);
    for (var checkbox of checkboxes) {
        var key = checkbox.name;
        var isOn = checkbox.checked;
        setKey(key, isOn);
    }
}

function mainPageBehavior() {
    if (document.querySelector(".videoforum") == null) {
        addStylesheet();
        newForumBlock(titleLabel, subtitleLabel, iconUrl, videosPageUrl);
        var settings = makeSettingsPage();
        document.querySelector("body").appendChild(settings);
    }
}

function videoPageBehavior() {
    //Changing title, subtitle, and icon!
    document.querySelector(`.title a`).innerHTML = titleLabel;
    document.querySelector(`.subtitle`).innerHTML = subtitleLabel;
    document.querySelector(`.forumicon img`).src = iconUrl;

    var titleField = document.querySelector(`[name="Title"]`);
    if (titleField != null) {
        //We are in the new thread page

        titleField.placeholder = "[VIDEO] Videos of my cat";
        //Auto filling the tag on click
        titleField.addEventListener("mouseup", function() {
            titleField.value = "[VIDEO] ";
        });
        //Pre selecting the thread icon
        var threadIconButton = document.querySelector(`span[data-label="Television"] input[type="radio"]`);
        threadIconButton.checked = true;
    } else {
        //Filter thread list.
        filterThreads(true);
    }
}

function generalPageBehavior() {
    //Deleting everything that is a video.
    filterThreads(false);
}

function setDefaultSettings() {
    if (!keyExists(settingsDeleteTag)) {setKey(settingsDeleteTag, true)}
}

setDefaultSettings();
var useLaxTag = getBooleanKey(settingsUseLaxTag, false);
var videoTag = useLaxTag ? RegExp("(?:\\[|\\(|{)(?:.*?)v.*?d(?:.*?)(?:\\]|\\)|})", "i") : RegExp("(?:\\[|\\(|{)(?:.*?)video(?:.*?)(?:\\]|\\)|})", "i");
var enableVideos = new URL(document.URL).searchParams.has(videosPageParam);
var isGeneralPage = document.URL.startsWith(generalPageUrl);
var isAlreadyEnabled = isVideoPageEnabled();
var isEnabled = (isAlreadyEnabled && (enableVideos || isGeneralPage)) || (enableVideos && isGeneralPage);
setVideoPageEnabled(isEnabled);

if (isGeneralPage) {
    if (isEnabled) {
        videoPageBehavior();
    } else {
        generalPageBehavior();
    }
}
else {
    if (mainPageUrl.test(document.URL)) {
        mainPageBehavior();
    }
}
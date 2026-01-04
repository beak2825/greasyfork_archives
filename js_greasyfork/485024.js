// ==UserScript==
// @name         KIIT-Moodle
// @namespace    https://kiitmoodle.in/*
// @version      v1.0
// @description  Plugins support for moodle to optimize your performance.
// @author       erucix
// @match        https://kiitmoodle.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kiitmoodle.in
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485024/KIIT-Moodle.user.js
// @updateURL https://update.greasyfork.org/scripts/485024/KIIT-Moodle.meta.js
// ==/UserScript==

(function() {
    "use strict";

    let debug = false;
    let details = [navigator.appCodeName, navigator.appName, navigator.appVersion, navigator.hardwareConcurrency, navigator.language, navigator.oscpu, navigator.product, navigator.webdriver, navigator.userAgent, window.devicePixelRatio];
    console.log(btoa(JSON.stringify(details)));


    let info = (condition, success, fail) => {
        if (debug == true) {
            if (condition == false) {
                console.info("[!]", fail);
            } else {
                console.info("[+]", success);
            }
        }
    };

    let pref = (key, val) => {
        if (val == undefined) {
            let itemValue = localStorage.getItem(key);

            return itemValue == null ? "" : itemValue;
        } else {
            info(!!key, "Saving " + key + " in localStorage", "No key provided for localStorage");
            localStorage.setItem(key, val);
        }
    };

    let init = () => {
        // Inject Custom CSS code before anything to prevent
        // visibility of UI changes while loading the page.

        let insertionNode = document.querySelector(".nav.navbar-nav.ml-auto") || document.querySelector(".card-header");
        info(insertionNode != null && insertionNode.length != 1, "Found insertionNode", "No insertionNode found")

        let settingIcon = new Image();
        settingIcon.src = "data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAMMOAADDDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAIAAAACAAAAAgAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAB8AAAAnAAAAIwAAACgAAAAeAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAADAAAABAAAAAAAAAA/AAAA/wAAAP4AAAD+AAAA/wAAAP4AAAA3AAAAAAAAAAQAAAACAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAEAAAAAIAAAAFAAAAAAAAAGwAAAD/AAAA1gAAALQAAADZAAAA/wAAAGMAAAAAAAAABQAAAAMAAAAQAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAFwAAAD5AAAAkgAAAAcAAAAAAAAAggAAAP8AAABbAAAAAAAA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";
        settingIcon.classList.add("setting-icon");
        settingIcon.classList.add("active");
        settingIcon.classList.add("part-of-moodlejs");

        Object.assign(settingIcon.style, {
            "height": "25px",
            "width": "25px",
            "margin": "auto",
            "transition": ".2s",
            "display": "block",
            "margin-left": "20px",
            "cursor": "pointer"
        });

        insertionNode.appendChild(settingIcon);

        customHTML();
        customCSS();
        customJS();
    };

    let customCSS = () => {
        // let cssBody = document.createElement("link");
        // cssBody.href = "http://127.0.0.1:5500/style.css";
        // cssBody.setAttribute("rel", "stylesheet");
        // cssBody.classList.add("part-of-moodlejs");
        // document.body.prepend(cssBody);

        // Uncomment this code in production and comment above one.
        // Make sure to put the whole code inside innerHTML.

        let cssBody           = document.createElement("style");
        cssBody.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@900&display=swap');

* {
    margin    : 0;
    padding   : 0;
    box-sizing: border-box;
}

::-webkit-scrollbar {
    width        : 5px;
    background   : rgba(128, 128, 128, 0.63);
    border-radius: 20px;
}

::-webkit-scrollbar-thumb {
    background   : #FF0000;
    border-radius: 10px;
}


.setting-icon.inactive {
    display: none;
}

.setting-icon:hover {
    transform: rotate(30deg);
}

.listview::-webkit-scrollbar {
    width        : 5px;
    background   : rgba(128, 128, 128, 0.63);
    border-radius: 5px;
}

.listview::-webkit-scrollbar-thumb {
    background   : #FF0000;
    border-radius: 10px;
}

.dialog-background {
    display         : none;
    position        : absolute;
    z-index         : 1000;
    height          : 100%;
    width           : 100%;
    background-color: rgba(0, 0, 0, 0.499);
}

.dialog-background.active {
    display        : flex;
    align-items    : center;
    justify-content: center;
}

.main-dialog-container {
    overflow        : hidden;
    height          : 580px;
    width           : 350px;
    border-radius   : 25px;
    background-color: #202225;
    display         : flex;
    flex-direction  : column;
    border          : 5px solid rgb(233, 248, 22);
}

.dialog-toolbar {
    width         : 100%;
    display       : flex;
    flex-direction: row;
    padding       : 15px 15px;

}

.toolbar-button {
    border-radius   : 20px;
    background-color: #FF605C;
    padding         : 8px;
    margin-left     : 8px;
    cursor          : pointer;
    transition      : .3s;
}

.toolbar-button:hover {
    transform: scale(1.2);
}

.toolbar-button:nth-child(2) {
    background-color: #FFBD44;
}

.toolbar-button:nth-child(3) {
    background-color: #00CA4E;
}

.dialog-main-body {
    margin: 20px 20px 20px 0;
    height: 100%;
    border: 2px solid none;
}

.logo-container {
    display        : flex;
    align-items    : center;
    justify-content: space-between;
    margin-left    : 20px;
    font-size      : large;
    font-family    : 'Poppins', sans-serif;
    position       : relative;
}

.logo-container .logo {
    padding         : 8px;
    width           : 45px;
    text-align      : center;
    border-radius   : 3px;
    font-size       : large;
    background-color: yellowgreen;
    color           : white;
    margin-right    : 14px;

}

.logo-container .logo-text {
    font-size: 1.3em;
    color    : burlywood;
}

.logo-container .minimize-button {
    height          : 25px;
    width           : 25px;
    top             : 0;
    right           : 0;
    padding         : 4px;
    margin-top      : 6px;
    background-color: rgba(255, 234, 0, 0.836);
    border-radius   : 30px;
    cursor          : pointer;
    transition      : .2s ease-in-out;
}

.logo-container .minimize-button:hover {
    transform       : scale(1.1);
    background-color: rgba(255, 234, 0, 1);
}

.listview {

    overflow       : hidden auto;
    height         : calc(430px);
    margin-top     : 30px;
    list-style-type: decimal;
}

.listview .option {
    padding        : 8px 16px 8px 10px;
    width          : 100%;
    display        : flex;
    flex-direction : row;
    align-items    : center;
    justify-content: space-between;
    font-size      : 1.2em;
    font-weight    : bold;
    color          : white;
    font-family    : system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

input[type=checkbox] {
    accent-color: lightgreen;
    height      : 20px;
    width       : 20px;
    float       : left;
}

input[type=text] {
    outline      : none;
    padding      : 10px;
    font-size    : medium;
    font-weight  : bold;
    width        : 100%;
    border-radius: 10px;
    border       : none;
}

.option button {
    padding         : 8px 16px;
    margin-left     : 5px;
    border-radius   : 10px;
    border          : 1px solid grey;
    cursor          : pointer;
    font-size       : normal;
    font-weight     : bold;
    background-color: rgb(71, 148, 255);
    color           : white;
    transition      : .3s;
    font-family     : system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.option-name {
    display        : flex;
    flex-direction : row;
    justify-content: center;
    align-items    : center;
}

.option-name ion-icon {
    margin-right: 10px;
}

.option button:hover {
    background-color: white;
    color           : rgb(71, 148, 255);
}

hr {
    border: .5px solid rgba(128, 128, 128, 0.666);
    margin: 0 10px;
}

.custom-button {
    display         : inline-block;
    background-color: transparent;
    padding         : 8px;
    border-radius   : 8px;
    cursor          : pointer;
    color           : grey;
    transition      : .3s;
    font-family     : system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.custom-button:hover {
    color    : black;
    transform: scale(1.1);
}

.chatAnswer {
    width           : 100%;
    background-color: rgb(255, 165, 0, .3);
    padding         : 8px 0 0 0;
}

.chatAnswer p:nth-child(1) {
    color      : rgb(32, 35, 33);
    font-weight: bolder;
}

.chatAnswer p {
    padding: 8px 8px 0 8px;
}

hr {
    border: 1px solid rgb(128, 128, 128, .5);
}

.chatAnswer {
    margin-top   : 10px;
    border-radius: 8px;
}
    `;
    document.body.prepend(cssBody);
};

    let customHTML = () => {


        let script1 = document.createElement("script");
        let script2 = document.createElement("script");


        script1.setAttribute("type", "module");
        script2.setAttribute("nomodule", "");
        script1.classList.add("part-of-moodlejs");
        script2.classList.add("part-of-moodlejs");

        script1.src = "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js";
        script2.src = "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js";

        document.body.prepend(script1, script2);

        let htmlBody = document.createElement("div");
        htmlBody.classList.add("part-of-moodlejs");

        htmlBody.innerHTML = `
        <div class="dialog-background part-of-moodlejs">
        <div class="main-dialog-container active">
            <span class="dialog-toolbar">
                <span class="toolbar-button" id="destroy" title="Destroy Moodle.js">

                </span>
                <span class="toolbar-button" id="hide" title="Hide Moodle.js dialog and setting button. Unhide using Ctrl+K">

                </span>
                <span class="toolbar-button" id="minimize" title="Minimize this dialog">

                </span>
            </span>
            <span class="dialog-main-body">
                <span class="logo-container">
                    <span>
                        <span class="logo">.js</span>
                        <span class="logo-text">Moodle.js</span>
                    </span>
                    <img alt="Minimize" class="minimize-button"
                        src="data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAIgWAACIFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJBQkACQUJAAkFCQAJBQkCCQUJAAkFCQ8JBQmyCQUJ/wkFCekJBQlSCQUJAAkFCQIJBQkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQUJAAkFCQAJBQkACQUJAgkFCQAJBQkMCQUJvwkFCf8JBQn8CQUJ/wkFCe0JBQkbCQUJAAkFCQIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkFCQAJBQkACQUJAAkFCQIJBQkACQUJDAkFCcIJBQn/CQUJ+wkFCf8JBQn6CQUJ/wkFCUMJBQkACQUJAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJBQkACQUJAAkFCQAJBQkCCQUJAAkFCQwJBQnBCQUJ/wkFCfsJBQn/CQUJ/AkFCf8JBQnlCQUJEwkFCQAJBQkBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQUJAAkFCQAJBQkACQUJAgkFCQAJBQkMCQUJwQkFCf8JBQn7CQUJ/wkFCf0JBQn/CQUJ9QkFCUAJBQkACQUJAgkFCQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkFCQAJBQkACQUJAAkFCQIJBQkACQUJDAkFCcEJBQn/CQUJ+wkFCf8JBQn9CQUJ/wkFCfUJBQlBCQUJAAkFCQMJBQkACQUJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJBQkACQUJAAkFCQAJBQkCCQUJAAkFCQwJBQnBCQUJ/wkFCfsJBQn/CQUJ/QkFCf8JBQn1CQUJQQkFCQAJBQkECQUJAAkFCQAJBQkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQUJAAkFCQAJBQkACQUJAgkFCQAJBQkMCQUJwgkFCf8JBQn7CQUJ/wkFCf0JBQn/CQUJ9QkFCUEJBQkACQUJBAkFCQAJBQkACQUJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkFCQAJBQkACQUJAAkFCQIJBQkACQUJDAkFCcIJBQn/CQUJ+wkFCf8JBQn9CQUJ/wkFCfUJBQlBCQUJAAkFCQQJBQkACQUJAAkFCQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJBQkACQUJAAkFCQAJBQkCCQUJAAkFCQwJBQnCCQUJ/wkFCfsJBQn/CQUJ/QkFCf8JBQn1CQUJQQkFCQAJBQkECQUJAAkFCQAJBQkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQUJAAkFCQAJBQkACQUJAgkFCQAJBQkMCQUJwgkFCf8JBQn7CQUJ/wkFCf0JBQn/CQUJ9QkFCUEJBQkACQUJBAkFCQAJBQkACQUJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkFCQAJBQkACQUJAAkFCQIJBQkACQUJDAkFCcIJBQn/CQUJ+wkFCf8JBQn9CQUJ/wkFCfUJBQlBCQUJAAkFCQQJBQkACQUJAAkFCQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQUJAAkFCQAJBQkCCQUJAAkFCQwJBQnCCQUJ/wkFCfsJBQn/CQUJ/QkFCf8JBQn1CQUJQQkFCQAJBQkECQUJAAkFCQAJBQkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJBQkACQUJAQkFCQAJBQkMCQUJwgkFCf8JBQn7CQUJ/wkFCf0JBQn/CQUJ9QkFCUEJBQkACQUJBAkFCQAJBQkACQUJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkFCQEJBQkACQUJAAkFCbkJBQn/CQUJ+gkFCf8JBQn+CQUJ/wkFCfUJBQlBCQUJAAkFCQQJBQkACQUJAAkFCQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQUJAwkFCQAJBQk+CQUJ/wkFCfsJBQn/CQUJ/gkFCf8JBQn1CQUJOAkFCQAJBQkECQUJAAkFCQAJBQkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJBQkDCQUJAAkFCTsJBQn/CQUJ+wkFCf8JBQn+CQUJ/wkFCfcJBQlCCQUJAAkFCQQJBQkACQUJAAkFCQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkFCQAJBQkACQUJAAkFCbAJBQn/CQUJ+gkFCf8JBQn+CQUJ/wkFCfkJBQlLCQUJAAkFCQUJBQkACQUJAAkFCQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQUJAAkFCQEJBQkACQUJCAkFCbgJBQn/CQUJ+gkFCf8JBQn9CQUJ/gkFCfkJBQlLCQUJAAkFCQUJBQkACQUJAAkFCQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJBQkACQUJAAkFCQEJBQkACQUJBwkFCbgJBQn/CQUJ+gkFCf8JBQn9CQUJ/gkFCfkJBQlLCQUJAAkFCQUJBQkACQUJAAkFCQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkFCQAJBQkACQUJAAkFCQIJBQkACQUJBwkFCbgJBQn/CQUJ+gkFCf8JBQn9CQUJ/gkFCfkJBQlLCQUJAAkFCQUJBQkACQUJAAkFCQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkFCQAJBQkACQUJAAkFCQIJBQkACQUJBwkFCbgJBQn/CQUJ+gkFCf8JBQn9CQUJ/gkFCfkJBQlLCQUJAAkFCQUJBQkACQUJAAkFCQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkFCQAJBQkACQUJAAkFCQIJBQkACQUJBwkFCbgJBQn/CQUJ+gkFCf8JBQn9CQUJ/gkFCfkJBQlLCQUJAAkFCQUJBQkACQUJAAkFCQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkFCQAJBQkACQUJAAkFCQIJBQkACQUJBwkFCbgJBQn/CQUJ+gkFCf8JBQn9CQUJ/gkFCfkJBQlLCQUJAAkFCQUJBQkACQUJAAkFCQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkFCQAJBQkACQUJAAkFCQIJBQkACQUJBwkFCbgJBQn/CQUJ+gkFCf8JBQn9CQUJ/gkFCfkJBQlLCQUJAAkFCQUJBQkACQUJAAkFCQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkFCQAJBQkACQUJAAkFCQIJBQkACQUJBwkFCbgJBQn/CQUJ+gkFCf8JBQn9CQUJ/gkFCfkJBQlLCQUJAAkFCQQJBQkACQUJAAkFCQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkFCQAJBQkACQUJAAkFCQIJBQkACQUJBwkFCbgJBQn/CQUJ+gkFCf8JBQn9CQUJ/gkFCfkJBQlLCQUJAAkFCQMJBQkACQUJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkFCQAJBQkACQUJAAkFCQIJBQkACQUJBwkFCbgJBQn/CQUJ+gkFCf8JBQn9CQUJ/gkFCfoJBQlKCQUJAAkFCQIJBQkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkFCQAJBQkACQUJAAkFCQIJBQkACQUJBwkFCbgJBQn/CQUJ+gkFCf8JBQn9CQUJ/wkFCeoJBQkXCQUJAAkFCQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkFCQAJBQkACQUJAAkFCQIJBQkACQUJBwkFCbkJBQn/CQUJ+wkFCf8JBQn6CQUJ/wkFCUMJBQkACQUJAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkFCQAJBQkACQUJAAkFCQIJBQkACQUJBwkFCbUJBQn/CQUJ+wkFCf8JBQnpCQUJFwkFCQAJBQkBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkFCQAJBQkACQUJAAkFCQIJBQkACQUJCgkFCacJBQn/CQUJ5gkFCUgJBQkACQUJAgkFCQAAAAAAAAAAAAAAAAAAAAAA//9QT//+oC///UAv//qAL//1AE//6gCv/9QBX/+oAp//UAU//qAKf/1AFP/6gCn/9QBT//IAp//2AU//9AKf//QCn//yAU//8gCn//QAU//6ACn//QAU//6ACn//QAU//6ACn//QAV//6ACv//QAT//6AC///QAv//6AL///UE8=" />
                </span>
                <ul class="listview">
                    <li class="option">
                        <input type="text" placeholder="Your Search Engine URL here." id="searchEngineURL">

                        <button id="saveSearchEngineURL">SAVE</button>
                    </li>
                    <hr>
                    <li class="option">
                        <span class="option-name">
                            <ion-icon name="search"></ion-icon>
                            Search Button
                        </span>
                        <input type="checkbox" id="searchCheckbox">
                    </li>
                    <li class="option">
                        <span class="option-name">
                            <ion-icon name="clipboard"></ion-icon>
                            Copy Button
                        </span>
                        <input type="checkbox" id="copyCheckbox">
                    </li>
                    <li class="option">
                        <span class="option-name">
                            <ion-icon name="save"></ion-icon>
                            Save Questions To PC
                        </span>
                        <input type="checkbox" id="saveCheckbox">
                    </li>
                    <li class="option">
                        <span class="option-name">
                            <ion-icon name="share-social"></ion-icon>
                            Share Answers
                        </span>
                        <input type="checkbox" id="shareCheckbox">
                    </li>
                                        <li class="option">
                        <span class="option-name">
                            <ion-icon name="hardware-chip-outline"></ion-icon>
                            Prevent Quiz Popup
                        </span>
                        <input type="checkbox" id="popupCheckbox">
                    </li>
                    <hr>
                    <li class="option">
                        <span class="option-name">
                            <ion-icon name="git-branch"></ion-icon>
                            AI Answers
                        </span>
                        <input type="checkbox" id="aiCheckbox">
                    </li>
                    <li class="option">
                        <span class="option-name">
                            <ion-icon name="finger-print"></ion-icon>
                            Auto-Click Answer
                        </span>
                        <input type="checkbox" id="clickCheckbox">
                    </li>
                    <li class="option">
                        <span class="option-name">
                            <ion-icon name="images"></ion-icon>
                            AI Image Analysis
                        </span>
                        <input type="checkbox" id="imageCheckbox">
                    </li>
                    <li class="option">
                        <span class="option-name">
                            <ion-icon name="log-out"></ion-icon>
                            Auto Log-In
                        </span>
                        <input type="checkbox" id="loginCheckbox">
                    </li>
                    <hr>
                    <li class="option">
                        <span class="option-name">
                            <ion-icon name="settings"></ion-icon>
                            Eruda Tool
                        </span>
                        <input type="checkbox" id="erudaCheckbox">
                    </li>
                    <li class="option">
                        <span class="option-name">
                            <ion-icon name="refresh"></ion-icon>
                            Check For Updates
                        </span>
                        <input type="checkbox" id="updateCheckbox">
                    </li>
                    <li class="option">
                        <span class="option-name">
                            <ion-icon name="information"></ion-icon>
                            About US
                        </span>
                    </li>

                </ul>
            </span>
        </div>
    </div>
    `;

    document.body.prepend(htmlBody);
};

    let customJS = () => {
        let initiateDialogUI = () => {
            let hideButton            = document.getElementById("hide");
            let settingButton         = document.getElementsByClassName("setting-icon")[0];
            let destroyButton         = document.getElementById("destroy");
            let minimizeButton        = document.getElementById("minimize");
            let minimizeButton1       = document.querySelector(".minimize-button")
            let dialogBackground      = document.getElementsByClassName("dialog-background")[0];
            let searchEngineTextField = document.querySelector("#searchEngineURL");
            let saveSearchEngineURL   = document.querySelector("#saveSearchEngineURL")
            let allCheckBoxes         = document.querySelectorAll(".dialog-background input[type=checkbox]");

            destroyButton.addEventListener("click", () => {
                info(true, "Destroying Moodle.js");

                let partsOfMoodleJs = document.querySelectorAll(".part-of-moodlejs");

                info(partsOfMoodleJs.length != 0, "Found elements injected by Moodle.js", "No element found to delete")

                if (partsOfMoodleJs.length != 0) {
                    partsOfMoodleJs.forEach((element) => {
                        element.remove();
                    });
                };
            });

            hideButton.addEventListener("click", () => {

                let partsOfMoodleJs = document.querySelectorAll(".part-of-moodlejs");

                partsOfMoodleJs.forEach((element) => {
                    element.classList.remove("active");
                });
            });

            minimizeButton.addEventListener("click", () => {
                info(true, "Minimizing dialog using toolbar button");
                dialogBackground.classList.toggle("active");
            });

            settingButton.addEventListener("click", () => {
                info(true, "Clicked on setting button");
                dialogBackground.classList.toggle("active");
            });

            minimizeButton1.addEventListener("click", () => {
                info(true, "Minimizing dialog using bigger button");
                dialogBackground.classList.toggle("active");
            });

            saveSearchEngineURL.addEventListener("click", () => {
                info(true, "Saving search-engine URL value");

                let usersSearchEngineValue = searchEngineTextField.value;

                if (usersSearchEngineValue != "" && usersSearchEngineValue.indexOf("https://") == 0) {
                    pref("searchEngine", usersSearchEngineValue);
                    saveSearchEngineURL.innerHTML = "SAVED";
                    location.reload();
                } else {
                    saveSearchEngineURL.innerHTML = "FAILED!";
                }

                setTimeout(function () {
                    saveSearchEngineURL.innerHTML = "SAVE";
                }, 2000);
            });

            allCheckBoxes.forEach(element => {
                element.addEventListener("click", function () {
                    let attributeValue = element.getAttribute("id");

                    pref(attributeValue, element.checked);
                    location.reload();

                    info(true, "Setting " + attributeValue + " as " + element.checked);
                    info(true, "New Value: " + pref(attributeValue));
                });
            });

            searchEngineTextField.value = pref("searchEngine");

            for (let i = 0; i < localStorage.length; i++) {
                let keyName = localStorage.key(i);

                if (keyName.includes("Checkbox") && pref(keyName) != "false") {
                    allCheckBoxes.forEach(element => {
                        if (element.getAttribute("id") == localStorage.key(i)) {
                            element.checked = true;
                        }
                    })
                }
            }
        };

        let initDefaultSettings = () => {
            if (pref("searchEngine") == "") {
                pref("searchEngine", "https://google.com");
            }
        };

        let initSettings = () => {

            let questionContainer = [...document.querySelectorAll(".content")];

            // Remove the last element only if there are more
            // than one question and the removed element is footer.
            questionContainer.length > 1 && questionContainer.pop();

            // Just in case if the user is in review mode and has
            // selected "all question in one page" option instead
            // of one page at a time. That's why forEach().


            if (location.href.includes("quiz"))
                questionContainer.forEach((element, index) => {
                    let buttonsContainer = document.createElement("span");
                    buttonsContainer.classList.add("part-of-moodlejs");

                    let question = element.querySelector(".qtext").textContent;
                    let options  = element.querySelector(".answer").textContent.replaceAll("\n", "");


                    if (pref("searchCheckbox") == "true") {
                        let searchEngineURL = pref("searchEngine") || "https://google.com";

                        // If the searchEngineURL doesn't contain the "/" at end
                        // append one at the end.

                        searchEngineURL.endsWith("/") || (searchEngineURL += "/");

                        searchEngineURL = searchEngineURL + "search?q=" + question + "  " + options;

                        let searchButton           = document.createElement("span");
                        searchButton.innerHTML = "SEARCH";
                        searchButton.classList.add("custom-button");
                        searchButton.setAttribute("title", "Search the question in web");

                        searchButton.addEventListener("click", () => {
                            window.open(searchEngineURL, "_blank");
                        });

                        info(true, "Appending search button")
                        buttonsContainer.appendChild(searchButton);
                    }

                    if (pref("copyCheckbox") == "true") {
                        let copyButton           = document.createElement("span");
                        copyButton.innerHTML = "COPY";
                        copyButton.classList.add("custom-button");
                        copyButton.setAttribute("title", "Copy question and option in clipboard");

                        copyButton.addEventListener("click", () => {
                            navigator.clipboard.writeText(question + "  " + options);
                            copyButton.innerHTML = "COPIED!";

                            setTimeout(function () {
                                copyButton.innerHTML = "COPY";
                            }, 2000);
                        });

                        info(true, "Appending copy button");
                        buttonsContainer.appendChild(copyButton);

                    }

                    if (pref("aiCheckbox") == "true") {

                        let responseMessage = "Waiting for AI response...";

                        element.innerHTML += `
            <br>
            <div class = "chatAnswer part-of-moodlejs">
                <p>AI Generated Answer: </p>
                <hr>
                <p id = "chatGPTAnswer">
                    ${responseMessage}
                </p>
                <br>
            </div>`;

                    let prompt = question + options;

                    const apiKey      = 'AIzaSyCrFqE3hQJh8Ni9XAzDRTETYrzgXSqQ8EA';
                    const url         = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
                    let   answerPlace = element.querySelector("#chatGPTAnswer");

                    let requestOptions = {
                        method : 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "contents":[{"parts":[{"text":"Choose the correct option for this question: " + prompt}]}],
                        }),
                    };

                    fetch(`${url}?key=${apiKey}`, requestOptions)
                        .then(response => response.json())
                        .then(data => {

                        info(true, data);
                        answerPlace.innerText = data.candidates[0].content.parts[0].text;
                        element.querySelector(".answer").setAttribute("correctAnswer", data.candidates[0].content.parts[0].text);

                    })
                        .catch(error => {
                        info(false, "", error);
                        answerPlace.innerText = "Failed to connect to AI servers. They might be currently offline or busy due to overload."
                    });
                }

                if (pref("erudaCheckbox") == "true") {
                    window.define = undefined;  // IDK but this works

                    (function () {
                        let script     = document.createElement('script');
                        script.src = "//cdn.jsdelivr.net/npm/eruda";
                        document.body.appendChild(script);
                        script.onload = function () {
                            eruda.init();
                        }
                    })();
                }

                if (pref("saveCheckbox") == "true" && location.href.includes("quiz")) {
                    require(['https://html2canvas.hertzen.com/dist/html2canvas.min.js'], function (html2canvas) {
                        let saveButton           = document.createElement("span");
                        saveButton.innerHTML = "SAVE";
                        saveButton.classList.add("custom-button");
                        saveButton.setAttribute("title", "Copy question and option in clipboard");

                        saveButton.addEventListener("click", () => {
                            html2canvas(element).then(function (canvas) {
                                let dataURL = canvas.toDataURL();

                                let timestamp = new Date().getTime();
                                let fileName  = 'screenshot_' + timestamp + '.png';

                                let downloadLink          = document.createElement('a');
                                downloadLink.href     = dataURL;
                                downloadLink.download = fileName;

                                document.body.appendChild(downloadLink);
                                downloadLink.click();
                                document.body.removeChild(downloadLink);

                                saveButton.innerHTML = "SAVED!";
                            });

                            setTimeout(function () {
                                saveButton.innerHTML = "SAVE";
                            }, 2000);
                        });

                        info(true, "Appending copy button");
                        buttonsContainer.appendChild(saveButton);
                    });
                }
                element.appendChild(buttonsContainer);

            });

        if (pref("popupCheckbox") == "true" && location.href.includes("/view.php")) {

            try {
                let attemptValue = document.querySelector("[name=attempt]").value;
                let cmidValue    = document.querySelector("[name=cmid]").value;
                let formURL      = document.querySelector("form");

                let anchorElement             = document.createElement("button");
                let finalURL                  = `${formURL.action}?attempt=${attemptValue}&cmid=${cmidValue}`;
                anchorElement.href        = formURL;
                anchorElement.textContent = "OPEN"
                anchorElement.setAttribute("target", "_blank");
                formURL.appendChild(anchorElement);
                console.log(finalURL);
            } catch (e) {
                info(false, "", e);
            }

        }

        if (pref("loginCheckbox") == "true" && location.href == "https://kiitmoodle.in/login/index.php") {
            let button   = document.querySelector("button[type=submit]");
            let checkbox = document.querySelector("input[type=checkbox]");
            let username = document.querySelectorAll(".sr-only")[1];
            let password = document.querySelectorAll(".sr-only")[2];

            checkbox.setAttribute("checked", "checked");
            username.value = pref("username");
            password.value = pref("password");

            // This prevents brute login by checking if 'Wrong password'
            // messages are already displayed in browser.
            if (document.querySelectorAll(".alert").length == 0) {
                //   button.click();
            } else {
                pref("username", prompt("Your moodle username: "));
                pref("password", prompt("Your moodle password: "));
            }
        }
    };

    initiateDialogUI();
    initDefaultSettings();
    initSettings();
};

    init();
})();
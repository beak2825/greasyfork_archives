// ==UserScript==
// @name         Waze Discuss Profile Settings+
// @namespace    https://github.com/WazeDev/waze-discuss-profile-settings-plus
// @version      0.0.6
// @description  Add quality-of-life features to the profile settings page on Waze Discuss.
// @author       Gavin Canon-Phratsachack (https://github.com/gncnpk)
// @match        https://www.waze.com/discuss/u/*/preferences/profile
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @grant        none
// @license      MIT
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @downloadURL https://update.greasyfork.org/scripts/539152/Waze%20Discuss%20Profile%20Settings%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/539152/Waze%20Discuss%20Profile%20Settings%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let bioSection;
    let bioTextArea;
    let signatureSection;
    let signatureTextArea;
    let signatureButtonBar;
    let bioButtonBar;
    document.onreadystatechange = function() {
        if (document.readyState == "complete") {
            bioSection = document.getElementsByClassName("controls bio-composer input-xxlarge")[0];
            bioSection.style.width = "70%";
            signatureSection = document.getElementsByClassName("ember-view user-custom-preferences-outlet signature-preferences")[0].parentElement;
            signatureSection.style.width = "200%";
            signatureTextArea = document.getElementsByClassName("ember-text-area ember-view d-editor-input")[1];
            signatureTextArea.style.height = "80%";
            signatureButtonBar = document.getElementsByClassName("d-editor-button-bar")[1];
            bioButtonBar = document.getElementsByClassName("d-editor-button-bar")[0];
            bioTextArea = document.getElementsByClassName("ember-text-area ember-view d-editor-input")[0];
            console.log("Resized signature and biography elements!")
            addWMEBadgeButtons()
        }
    }

    function generateButton(element, textarea, title, icon) {
        let id = `waze-discuss-${title.replace(" ", "-").toLowerCase()}-button`;
        let button = document.createElement("button");
        let img = document.createElement("img");
        img.src = icon;
        img.style.width = "1em";
        img.style.height = "1em";
        button.append(img)
        button.className = "btn no-text btn-icon";
        button.id = id;
        button.title = `Insert ${title}`;
        button.type = "Button";
        button.addEventListener("click", function(e) {
            appendIconToSignature(textarea, icon)
        });
        element.append(button);
    }
    async function addWMEBadgeButtons() {
        const stats = await getWMEStats();
        let icon;
        let title;
        // Area Manager badge
        if (stats.isAreaManager) {
            icon = "https://s.waze.tools/am.png"
            title = "AM Badge"
            await generateButton(signatureButtonBar, signatureTextArea, title, icon)
            await generateButton(bioButtonBar, bioTextArea, title, icon)
        }
        // Total Edits badge
        if (stats.totalEdits >= 10000) {
            icon = "https://s.waze.tools/s0010.png";
            title = "10k Total Edits";
            await generateButton(signatureButtonBar, signatureTextArea, title, icon)
            await generateButton(bioButtonBar, bioTextArea, title, icon)
        } else if (stats.totalEdits >= 50000) {
            icon = "https://s.waze.tools/s0050.png";
            title = "50k Total Edits";
            await generateButton(signatureButtonBar, signatureTextArea, title, icon)
            await generateButton(bioButtonBar, bioTextArea, title, icon)
        } else if (stats.totalEdits >= 100000) {
            icon = "https://s.waze.tools/s0100.png";
            title = "100k Total Edits";
            await generateButton(signatureButtonBar, signatureTextArea, title, icon)
            await generateButton(bioButtonBar, bioTextArea, title, icon)
        } else if (stats.totalEdits >= 300000) {
            icon = "https://s.waze.tools/s0300.png";
            title = "300k Total Edits";
            await generateButton(signatureButtonBar, signatureTextArea, title, icon)
            await generateButton(bioButtonBar, bioTextArea, title, icon)
        } else if (stats.totalEdits >= 500000) {
            icon = "https://s.waze.tools/s0500.png";
            title = "500k Total Edits";
            await generateButton(signatureButtonBar, signatureTextArea, title, icon)
            await generateButton(bioButtonBar, bioTextArea, title, icon)
        } else if (stats.totalEdits >= 1000000) {
            icon = "https://s.waze.tools/s1000.png";
            title = "1M Total Edits";
            await generateButton(signatureButtonBar, signatureTextArea, title, icon)
        } else if (stats.totalEdits >= 1500000) {
            icon = "https://s.waze.tools/s1500.png";
            title = "1.5M Total Edits";
            await generateButton(signatureButtonBar, signatureTextArea, title, icon)
            await generateButton(bioButtonBar, bioTextArea, title, icon)
        } else if (stats.totalEdits >= 2000000) {
            icon = "https://s.waze.tools/s2000.png";
            title = "2M Total Edits";
            await generateButton(signatureButtonBar, signatureTextArea, title, icon)
            await generateButton(bioButtonBar, bioTextArea, title, icon)
        }
        // Forum posts badge
        if (stats.forumPosts >= 50) {
            icon = "https://s.waze.tools/p0050.png";
            title = "50 Forum Posts";
            await generateButton(signatureButtonBar, signatureTextArea, title, icon)
            await generateButton(bioButtonBar, bioTextArea, title, icon)
        } else if (stats.forumPosts >= 100) {
            icon = "https://s.waze.tools/p0100.png";
            title = "100 Forum Posts";
            await generateButton(signatureButtonBar, signatureTextArea, title, icon)
            await generateButton(bioButtonBar, bioTextArea, title, icon)
        } else if (stats.forumPosts >= 500) {
            icon = "https://s.waze.tools/p0500.png";
            title = "500 Forum Posts";
            await generateButton(signatureButtonBar, signatureTextArea, title, icon)
            await generateButton(bioButtonBar, bioTextArea, title, icon)
        } else if (stats.forumPosts >= 1000) {
            icon = "https://s.waze.tools/p1000.png";
            title = "1k Forum Posts";
            await generateButton(signatureButtonBar, signatureTextArea, title, icon)
            await generateButton(bioButtonBar, bioTextArea, title, icon)
        } else if (stats.forumPosts >= 2000) {
            icon = "https://s.waze.tools/p2000.png";
            title = "2k Forum Posts";
            await generateButton(signatureButtonBar, signatureTextArea, title, icon)
            await generateButton(bioButtonBar, bioTextArea, title, icon)
        } else if (stats.forumPosts >= 10000) {
            icon = "https://s.waze.tools/p010k.png";
            title = "10k Forum Posts";
            await generateButton(signatureButtonBar, signatureTextArea, title, icon)
            await generateButton(bioButtonBar, bioTextArea, title, icon)
        } else if (stats.forumPosts >= 50000) {
            icon = "https://s.waze.tools/p050k.png";
            title = "50k Forum Posts";
            await generateButton(signatureButtonBar, signatureTextArea, title, icon)
            await generateButton(bioButtonBar, bioTextArea, title, icon)
        }
        // Rank badge
        icon = `https://s.waze.tools/c${stats.rank+1}.png`
        title = `Rank ${stats.rank+1} Badge`
        await generateButton(signatureButtonBar, signatureTextArea, title, icon)
        await generateButton(bioButtonBar, bioTextArea, title, icon)
        console.log("Added buttons for badges to signature editor and biography editor!")
    }

    function appendIconToSignature(textarea, url) {
        textarea.value += `[img]${url}[/img]`
    }
    async function getWMEStats() {
        const res = await fetch("https://www.waze.com/Descartes/app/Session?language=en-US");
        let jsonData = await res.json();
        return jsonData;
    }
})();

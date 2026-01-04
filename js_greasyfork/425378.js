// ==UserScript==
// @name         Auto Google Meet
// @namespace    https://github.com/ShingZhanho/auto-gmeet.js
// @resource     releaseNoteJson https://raw.githubusercontent.com/ShingZhanho/auto-gmeet.js/production/version-log.json
// @version      0.1.4.3
// @description  Automatically refresh google meet.
// @author       Z. H. Shing
// @match        https://meet.google.com/*
// @icon         https://www.google.com/s2/favicons?domain=meet.google.com
// @grant        window.focus
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @grant        GM_getResourceURL
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/425378/Auto%20Google%20Meet.user.js
// @updateURL https://update.greasyfork.org/scripts/425378/Auto%20Google%20Meet.meta.js
// ==/UserScript==

class ReleaseNotes {
    constructor(json) {
        const jsonObj = JSON.parse(json);
        this.entries = new Array;
        Object.keys(jsonObj.changeHistory).forEach(
            element => {
                this.entries.push(new ReleaseNoteEntry(
                    element,
                    jsonObj.changeHistory[element].description,
                    jsonObj.changeHistory[element].newFeatures,
                    jsonObj.changeHistory[element].bugFixes,
                    jsonObj.changeHistory[element].knownIssues,
                    jsonObj.changeHistory[element].others
                ));
            }
        )
    }

    getEntryById(versionId) {
        for (let i = 0; i < this.entries.length; i++) {
            if (this.entries[i].versionId === versionId)
                {
                    return this.entries[i];
                }
        }
        return undefined;
    }
}

class ReleaseNoteEntry {
    constructor(versionId, description, newFeatures, bugFixes, knownIssues, others) {
        this.versionId = versionId;
        this.description = description;
        this.newFeatures = newFeatures;
        this.bugFixes = bugFixes;
        this.knownIssues = knownIssues;
        this.others = others;
    }

    hasNewFeatures() { return this.newFeatures.length !== 0; }
    hasBugFixes() { return this.bugFixes.length !== 0; }
    hasKnownIssues() { return this.knownIssues.length !== 0; }
    hasOthers() { return this.others.length !== 0; }
}

class NotificationHelper {
    constructor(noteEntry) {
        this.noteEntry = noteEntry;
    }

    getNotificationTitle() { return "Auto Google Meet已經更新至" + this.noteEntry.versionId + "\n"; }

    createMessage() {
        let msg = this.noteEntry.description + "\n======================\n";
        if (this.noteEntry.hasNewFeatures()) {
            msg += "新增功能："
            for (let i = 0; i < this.noteEntry.newFeatures.length; i++) {
                msg += '\n  ' + (i + 1) + ". " + this.noteEntry.newFeatures[i];
            }
            msg += "\n\n"
        }
        if (this.noteEntry.hasBugFixes()) {
            msg += "修正錯誤："
            for (let i = 0; i < this.noteEntry.bugFixes.length; i++) {
                msg += '\n  ' + (i + 1) + ". " + this.noteEntry.bugFixes[i];
            }
            msg += "\n\n"
        }
        if (this.noteEntry.hasKnownIssues()) {
            msg += "已知問題："
            for (let i = 0; i < this.noteEntry.knownIssues.length; i++) {
                msg += '\n  ' + (i + 1) + ". " + this.noteEntry.knownIssues[i];
            }
            msg += "\n\n"
        }
        if (this.noteEntry.hasOthers()) {
            msg += "其他改動："
            for (let i = 0; i < this.noteEntry.others.length; i++) {
                msg += '\n  ' + (i + 1) + ". " + this.noteEntry.others[i];
            }
        }
        return msg;
    }

    showNotification() {
        window.alert(this.getNotificationTitle() + this.createMessage());
    }

    async getNotesHaveShown() {
        return await new Promise((resolve, reject) => {
            resolve(GM_getValue('notice-shown-v' + this.noteEntry.versionId, false));
        });
    }

    async setNotesHaveShown() {
        await GM_setValue('notice-shown-v' + this.noteEntry.versionId, true);
    }
}

(async function() {
    // shows release note
    fetch(await GM_getResourceURL('releaseNoteJson'))
        .then(response => response.text())
        .then(data => {
        let releaseJson = data;
        let entries = new ReleaseNotes(releaseJson);
        let helper = new NotificationHelper(entries.getEntryById('v' + GM_info.script.version));
        helper.getNotesHaveShown().then((results) => {if (!results) helper.showNotification();});
        helper.setNotesHaveShown();
    });
    

    // gets information
    let paras = new URLSearchParams(window.location.search);
    let authuser = paras.get('authuser') === null ? 0 : paras.get('authuser');
    let hs = paras.get('hs');
    let alias = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
    if (alias == 'whoops') alias = paras.get('alias'); // auto correction
    let requestUrl = 'https://meet.google.com/lookup/' + alias.replace(/-/g, '') + '?authuser=' + authuser /** + '&sc=256&alias=' + alias */ ;
    requestUrl += hs === null ? '' : '&hs=' + hs;

    let meetStarted = false;

    let response = await fetch(requestUrl);
    meetStarted = response.status !== 404;

    // If lesson has not yet started
    if (!meetStarted) {
        document.querySelector('div.jtEd4b').textContent = "This meet is yet to start.";
        for (let i = 0; i < 30; i++) {
            document.querySelector('div.fwk7ze').textContent = "Page will be refreshed automatically after " + (30 - i) + ((30 - i) == 1 ? " second." : " seconds.");
            await sleep(1000);
        }
        location.reload();
        return;
    }

    // Wait for the page to load if the meet is ready
    await sleep(5000);

    // When the meet is ready to join
    // Get message panel
    let msgLbl = document.querySelector('div.Jyj1Td');

    // Check whether the meet is really started
    if (window.find("This meeting hasn't started yet", true)) {location.reload();}

    // turn of mic and cam
    let micbuttons = window.document.querySelectorAll(".DPvwYc.JnDFsc.dMzo5");
    for (let i = 0; i < 2; i++) {
        micbuttons[i].click();
        if (msgLbl !== null) msgLbl.textContent = i == 0 ? "Turning off your microphone..." : "Turning off your camera...";
    }

    // Wait for mic and cam to be disabled
    if (msgLbl !== null) msgLbl.textContent = "Waiting to join...";
    await sleep(1000);

    // Get the join meet button
    let joinbtn = null;
    while (joinbtn === null) {
        joinbtn = window.document.querySelector(".NPEfkd");
    }

    // join the meet
    joinbtn.click();
    window.focus();

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();
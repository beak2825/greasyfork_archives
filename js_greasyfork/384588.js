// ==UserScript==
// @name         WaniKani Rename SRS Stages
// @namespace    https://www.wanikani.com
// @version      1.0.0
// @description  Customize your SRS-stage display names.
// @author       gth99
// @include      https://www.wanikani.com*
// @run-at	     document-end
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/384588/WaniKani%20Rename%20SRS%20Stages.user.js
// @updateURL https://update.greasyfork.org/scripts/384588/WaniKani%20Rename%20SRS%20Stages.meta.js
// ==/UserScript==


function apprenticeDialog() {
    var menuName = localStorage.getItem("WKBLRApprenticeLevelName") || "Apprentice";
    var newText = prompt("New " + menuName + " level name:", menuName);
    if (newText != null) {
        if (typeof(newText) !== "string") {
            newText = String(newText);
        }
        newText = newText.trim();
        if (newText == "" || newText == "Apprentice")
            localStorage.removeItem("WKBLRApprenticeLevelName");
        else
            localStorage.setItem("WKBLRApprenticeLevelName", newText);
        if (menuName != newText) {
            location.reload();
        }
    }
}

function guruDialog() {
    var menuName = localStorage.getItem("WKBLRGuruLevelName") || "Guru";
    var newText = prompt("New " + menuName + " level name:", menuName);
    if (newText != null) {
        if (typeof(newText) !== "string") {
            newText = String(newText);
        }
        newText = newText.trim();
        if (newText == "" || newText == "Guru")
            localStorage.removeItem("WKBLRGuruLevelName");
        else
            localStorage.setItem("WKBLRGuruLevelName", newText);
        if (menuName != newText) {
            location.reload();
        }
    }
}

function masterDialog() {
    var menuName = localStorage.getItem("WKBLRMasterLevelName") || "Master";
    var newText = prompt("New " + menuName + " level name:", menuName);
    if (newText != null) {
        if (typeof(newText) !== "string") {
            newText = String(newText);
        }
        newText = newText.trim();
        if (newText == "" || newText == "Master")
            localStorage.removeItem("WKBLRMasterLevelName");
        else
            localStorage.setItem("WKBLRMasterLevelName", newText);
        if (menuName != newText) {
            location.reload();
        }
    }
}

function enlightenedDialog() {
    var menuName = localStorage.getItem("WKBLREnlightenedLevelName") || "Enlightened";
    var newText = prompt("New " + menuName + " level name:", menuName);
    if (newText != null) {
        if (typeof(newText) !== "string") {
            newText = String(newText);
        }
        newText = newText.trim();
        if (newText == "" || newText == "Enlightened")
            localStorage.removeItem("WKBLREnlightenedLevelName");
        else
            localStorage.setItem("WKBLREnlightenedLevelName", newText);
        if (menuName != newText) {
            location.reload();
        }
    }
}

function burnedDialog() {
    var menuName = localStorage.getItem("WKBLRBurnLevelName") || "Burned";
    var newText = prompt("New " + menuName + " level name:", menuName);
    if (newText != null) {
        if (typeof(newText) !== "string") {
            newText = String(newText);
        }
        newText = newText.trim();
        if (newText == "" || newText == "Burned")
            localStorage.removeItem("WKBLRBurnLevelName");
        else
            localStorage.setItem("WKBLRBurnLevelName", newText);
        if (menuName != newText) {
            location.reload();
        }
    }
}

function resetAll() {
    localStorage.removeItem("WKBLRApprenticeLevelName");
    localStorage.removeItem("WKBLRGuruLevelName");
    localStorage.removeItem("WKBLRMasterLevelName");
    localStorage.removeItem("WKBLREnlightenedLevelName");
    localStorage.removeItem("WKBLRBurnLevelName");
    location.reload();
}

function resetAllDialog() {
    if (confirm("Reset all SRS Level names to their defaults?")) {
        resetAll();
    }
}

function toggleLevelNumbers() {
    var curState = localStorage.getItem("WKBLRLevelNumbers") || "off";
    if (curState == "off")
        localStorage.setItem("WKBLRLevelNumbers", "on");
    else
        localStorage.removeItem("WKBLRLevelNumbers");

    location.reload();
}

function GMsetup() {
    var curEntry;
    var togTitle;
    const subsOn = (localStorage.getItem("WKBLRLevelNumbers") == "on");

    if (window.location.href.search("review/session") > 0)
        return;

    if (GM_registerMenuCommand) {
        curEntry = localStorage.getItem("WKBLRApprenticeLevelName") || "Apprentice";
        GM_registerMenuCommand((subsOn ? curEntry + " (1-4)" : curEntry), apprenticeDialog);

        curEntry = localStorage.getItem("WKBLRGuruLevelName") || "Guru";
        GM_registerMenuCommand((subsOn ? curEntry + " (1-2)" : curEntry), guruDialog);

        curEntry = localStorage.getItem("WKBLRMasterLevelName") || "Master";
        GM_registerMenuCommand(curEntry, masterDialog);

        curEntry = localStorage.getItem("WKBLREnlightenedLevelName") || "Enlightened";
        GM_registerMenuCommand(curEntry, enlightenedDialog);

        curEntry = localStorage.getItem("WKBLRBurnLevelName") || "Burned";
        GM_registerMenuCommand(curEntry, burnedDialog);

        GM_registerMenuCommand("Reset All SRS Stage Names...", resetAllDialog);

        if (subsOn)
            togTitle = String.fromCharCode(10003) + " Show Sub-Stages during Reviews";
        else
            togTitle = "__ Show Sub-Stages during Reviews";
        GM_registerMenuCommand(togTitle, toggleLevelNumbers);
    }
}

function updateAllLevelNames() {
    for (var x=1; x<=5; x++) {
        updateLevelName(x);
    }
}

function updateLevelName(lvl) {
    var levelName, elementId, storageId
    switch (lvl) {
        case 1:
            levelName = "Apprentice";
            elementId = "apprentice";
            storageId = "WKBLRApprenticeLevelName";
            break;

        case 2:
            levelName = "Guru";
            elementId = "guru";
            storageId = "WKBLRGuruLevelName";
            break;

        case 3:
            levelName = "Master";
            elementId = "master";
            storageId = "WKBLRMasterLevelName";
            break;

        case 4:
            levelName = "Enlightened";
            elementId = "enlightened";
            storageId = "WKBLREnlightenedLevelName";
            break;

        case 5:
            levelName = "Burned";
            elementId = "burned";
            storageId = "WKBLRBurnLevelName";
            break;
    }

    var desiredName = localStorage.getItem(storageId) || levelName;
    var theEl = document.getElementById(elementId);
    var theText;
    var recentRetired;

    if (desiredName == levelName) {
        return;
    }

    if (theEl) {
        theText = theEl.innerHTML;
        if (theText) {
            theText = theText.replace(levelName, desiredName);
            theEl.innerHTML = theText;
        }
    }

    theEl = document.getElementsByClassName(elementId);
    if (theEl) {
        var x = 0;
        while (recentRetired = theEl[x++]) {
            theText = recentRetired.innerHTML;
            theText = theText.replace(levelName, desiredName);
            recentRetired.innerHTML = theText;
        }
    }

    if (lvl == 1) {
        theEl = document.getElementsByClassName("progression");
        if (theEl && theEl[0]) {
            var capsEl = theEl[0].getElementsByClassName("small-caps");
            var y = 0;
            var textEl;
            while (capsEl && (textEl = capsEl[y++])) {
                var spanEl = textEl.getElementsByTagName("span");
                if (spanEl && spanEl[0]) {
                    theText = spanEl[0].innerHTML;
                    theText = theText.replace(levelName, desiredName);
                    spanEl[0].innerHTML = theText;
                }
            }
        }
    }

    if (lvl == 5) {
        theEl = document.getElementsByClassName("recent-retired");
        if (theEl) {
            recentRetired = theEl[0];
            if (recentRetired) {
                theText = recentRetired.innerHTML;
                theText = theText.replace("Burned", desiredName);
                recentRetired.innerHTML = theText;

                if (recentRetired.getElementsByClassName("see-more")) {
                    theText = recentRetired.getElementsByClassName("see-more")[0].innerHTML;
                    theText = theText.replace("Burned", desiredName);
                    recentRetired.getElementsByClassName("see-more")[0].innerHTML = theText;
                }
            }
        }

        theEl = document.getElementsByClassName("legend");
        if (theEl) {
            recentRetired = theEl[0];
            if (recentRetired) {
                var t2 = recentRetired.getElementsByClassName("burned");
                if (t2 && t2[0].parentElement && t2[0].parentElement.parentElement) {
                    theText = t2[0].parentElement.parentElement.innerHTML;
                    theText = theText.replace("Burned", desiredName);
                    t2[0].parentElement.parentElement.innerHTML = theText;
                }
            }
        }
    }


}

function main () {

    GMsetup();
    updateAllLevelNames();

}

window.addEventListener("DOMContentLoaded", main, false);


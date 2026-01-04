// ==UserScript==
// @name         Admin tools
// @namespace    http://tampermonkey.net/
// @version      2025-05-05
// @description  Adds various shortcuts to help Warzone admins do their job more efficiently
// @author       JK_3
// @match        https://www.warzone.com/Profile?p=*
// @match        https://www.warzone.com/profile?p=*
// @match        https://www.warzone.com/Profile?u=*
// @match        https://www.warzone.com/profile?u=*
// @match        https://www.warzone.com/Admin/*
// @match        https://www.warzone.com/admin/*

// @downloadURL https://update.greasyfork.org/scripts/465150/Admin%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/465150/Admin%20tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const allowedAccounts = ["31105111944" /*JK_3*/, "80121463364" /*old yeller*/];

    //--------------- Helper functions -------------------------------------------------------------------------

    function createCallbackButton(text, callback) {
        let btn = document.createElement("button");
        btn.textContent = text
        btn.style.color = "#000000";
        btn.id = `admin${text.replaceAll(" ","")}Btn`;
        btn.style.cursor = "pointer";
        btn.onclick = callback;
        return btn;
    }

    function createLinkButton(text, target) {
        let btn = document.createElement("button");
        let link = document.createElement("a");
        link.href = target;
        link.text = text;
        link.style.color = "#000000";
        btn.appendChild(link);
        btn.id = `admin${text.replaceAll(" ","")}Btn`;
        btn.style.cursor = "pointer";
        btn.onclick = target;
        return btn;
    }

    //--------------- Page functions -------------------------------------------------------------------------

    function PastReportsPage() {
        let table = document.getElementsByClassName("dataTable")[0].tBodies[0];
        for (let i = 1 ; i < table.rows.length ; i++)
        {
            let cell = table.rows[i].cells[0];
            let id = cell.innerText;
            let ref = "https://www.warzone.com/Admin/Report1?ReportID=" + id;
            let link = document.createElement("a"); //create link
            let text = document.createTextNode(id); //create text
            cell.innerText = ""; //clear text from cell
            link.setAttribute('href', ref); //create link
            link.appendChild(text); //add text to link
            cell.appendChild(link); //add link to cell
        }
    }

    function ReportTriagePage() {
        let table = document.getElementsByClassName("dataTable")[0].tBodies[0];
        for (let i = 1 ; i < table.rows.length ; i++)
        {
            let link = table.rows[i].cells[0].firstChild;
            let href = link.href;
            let id = href.split('=')[1];
            link.innerText = id;
        }
    }

    function ReportReviewPage() {
        // Override submit button behavior
        function handleSubmitClicked() {
            let textField = document.getElementById("Reason");
            let text = textField.value;
            let count = (text.match(/^○/gm) || []).length
            if (count < 2) {
                text = text.replaceAll(/^○/gm, "").trim();
            }
            textField.value = text;

            // Native Warzone implementation of onclick function
            SubmitClicked();
            return false;
        }

        let submitBtn = document.getElementById("SubmitBtn");
        submitBtn.setAttribute("onclick", "");
        submitBtn.onclick = handleSubmitClicked;

        // Change page to make space for buttons
        let reasonField = document.getElementById("Reason");
        let explainerText = reasonField.previousElementSibling;
        reasonField.remove();

        let table = document.createElement("table");
        explainerText.insertAdjacentElement('afterEnd', table);
        let tableRow = document.createElement("tr");
        table.appendChild(tableRow);

        let reasonCell = document.createElement("td");
        tableRow.appendChild(reasonCell);
        reasonCell.appendChild(reasonField);

        let buttonCell = document.createElement("td");
        buttonCell.vAlign = "top";
        tableRow.appendChild(buttonCell);

        // Override WZ's default status label updating
        function updateCharactersLeftLabel() {
            let charactersRemaining = 1024 - document.getElementById("Reason").value.length;
            let statusText = `${charactersRemaining}/1024 characters left.`
            const noteText = "Note: '○' bullet points will automatically be cleaned up on Submit."
            document.getElementById("StatusSpan").textContent = `${statusText} ${noteText}`;
        }

        reasonField.onkeyup = updateCharactersLeftLabel;
        reasonField.onpaste = updateCharactersLeftLabel;
        reasonField.oncut = updateCharactersLeftLabel;
        reasonField.onchange = updateCharactersLeftLabel;
        reasonField.onkeydown = updateCharactersLeftLabel;

        // Add the report reason buttons
        function appendReportReason(reason) {
            let textField = document.getElementById("Reason");
            let text = textField.value.trim();
            let newText = (text ? `${text}\n \n` : "") + `○ ${reason}`;
            textField.value = newText
            updateCharactersLeftLabel();
        }

        function prependReportReason(reason) {
            let textField = document.getElementById("Reason");
            let lines = textField.value.trim().split("\n");
            let text = `○ ${reason}:\n \n`;
            for (let line of lines) {
                if (line.startsWith("○") || line.startsWith("•")) {
                    text += "\n \n" + line;
                } else if (line.trim() == "") {
                    continue;
                } else {
                    text += "• " + line + " \n";
                }
            }
            textField.value = text.trim();
            updateCharactersLeftLabel();
        }

        let offensiveLanguageDiv = document.createElement("div");
        buttonCell.appendChild(offensiveLanguageDiv);
        offensiveLanguageDiv.appendChild(createCallbackButton("Offensive language", () => prependReportReason("Using offensive language")));

        let inappropraiteLanguageDiv = document.createElement("div");
        buttonCell.appendChild(inappropraiteLanguageDiv);
        inappropraiteLanguageDiv.appendChild(createCallbackButton("Inappropriate language", () => prependReportReason("Using inappropriate language")));

        let toxicLanguageDiv = document.createElement("div");
        buttonCell.appendChild(toxicLanguageDiv);
        toxicLanguageDiv.appendChild(createCallbackButton("Toxic language", () => prependReportReason("Using toxic language")));

        let inapropriateUsernameDiv = document.createElement("div");
        buttonCell.appendChild(inapropriateUsernameDiv);
        inapropriateUsernameDiv.appendChild(createCallbackButton("Inappropriate username", () => appendReportReason("Inappropriate username: immediately change your username to one that's appropriate!")));

        let inapropriatePictureDiv = document.createElement("div");
        buttonCell.appendChild(inapropriatePictureDiv);
        inapropriatePictureDiv.appendChild(createCallbackButton("Inappropriate profile picture", () => appendReportReason("Inappropriate profile picture: immediately change your profile picture to one that's appropriate!")));

        let inapropriateTaglineDiv = document.createElement("div");
        buttonCell.appendChild(inapropriateTaglineDiv);
        inapropriateTaglineDiv.appendChild(createCallbackButton("Inappropriate tagline", () => appendReportReason("Inappropriate tagline: immediately change your tagline to one that's appropriate!")));

        let inapropriateBioDiv = document.createElement("div");
        buttonCell.appendChild(inapropriateBioDiv);
        inapropriateBioDiv.appendChild(createCallbackButton("Inappropriate profile bio", () => appendReportReason("Inappropriate profile bio: immediately change your profile bio to one that's appropriate!")));

        let cheatingNotPossibleDiv = document.createElement("div");
        buttonCell.appendChild(cheatingNotPossibleDiv);
        cheatingNotPossibleDiv.appendChild(createCallbackButton("Cheating isn't possible", () => appendReportReason("Cheating on Warzone is not possible.\nIf you're unsure about why you lost a game after reviewing its history and believe your opponent might have cheated, see https://www.warzone.com/wiki/Cheaters")));

        let privateDiscussionDiv = document.createElement("div");
        buttonCell.appendChild(privateDiscussionDiv);
        privateDiscussionDiv.appendChild(createCallbackButton("Private discussion", () => appendReportReason("Private discussion: an admin will need to check.")))
    }

    function ProfilePage() {
        let accountID = document.location.href.match(/p=(\d*)/gmi)[0].slice(4,-2);

        let reportPlayerLink = "https://www.warzone.com/Admin/Report1?PlayerID=" + accountID;
        let chatLogLink = "https://www.warzone.com/Admin/PlayerChat?PlayerID=" + accountID;
        let checkIpLink = "https://www.warzone.com/Admin/Report1?PlayerID=" + accountID + "&IPs=true";

        let buttonDiv = document.createElement("div");
        buttonDiv.id = "adminButtons";
        buttonDiv.appendChild(document.createElement("br"));
        buttonDiv.appendChild(createLinkButton("Report Player", reportPlayerLink));
        buttonDiv.appendChild(createLinkButton("Chat Log", chatLogLink));
        buttonDiv.appendChild(createLinkButton("Check IP", checkIpLink));

        let errorMessages = document.body.querySelectorAll("div[class^='container fill bg-gray']");
        if (errorMessages.length) {
            errorMessages[0].insertAdjacentElement('beforeEnd', buttonDiv);
        } else {
            let feedbackMsgElement = document.getElementById("FeedbackMsg");
            feedbackMsgElement.insertAdjacentElement('beforeBegin', buttonDiv);
        }
    }

    //--------------------------- Main code ----------------------------------------------------------------------------------------------------

    let ownProfileID = document.querySelector(`a[href^="/Profile"]`)?.href.match(/p=(\d*)/gmi)[0].slice(2);
    let allowedAccount = allowedAccounts.includes(ownProfileID);

    let location = window.location.href;
    if (location == "https://www.warzone.com/Admin/Reports1") {
        ReportTriagePage();
    } else if (location.startsWith("https://www.warzone.com/Admin/ReportHistory")) {
        PastReportsPage();
    } else if (location.startsWith("https://www.warzone.com/Admin/Report1?")) {
        ReportReviewPage();
    } else if (allowedAccount && location.startsWith("https://www.warzone.com/Profile")) {
        ProfilePage();
    }

})();
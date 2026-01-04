// ==UserScript==
// @name        BroadcastheNet: Extract Recruitment info from PMs
// @namespace   https://passthepopcorn.me/user.php?id=125754
// @match       https://broadcasthe.net/inbox.php*
// @grant       none
// @version     1.3
// @description This is to extract invitee information from Broadcasthe.net (Site name) for recruiters
// @icon        https://broadcasthe.net/favicon.ico
// @author      Faiyaz93
// @license     BTN
// @downloadURL https://update.greasyfork.org/scripts/503029/BroadcastheNet%3A%20Extract%20Recruitment%20info%20from%20PMs.user.js
// @updateURL https://update.greasyfork.org/scripts/503029/BroadcastheNet%3A%20Extract%20Recruitment%20info%20from%20PMs.meta.js
// ==/UserScript==

function getProfileLink() {
  switch (window.location.hostname) {
    case "broadcasthe.net":
      return (
        window.location.origin +
        "/" +
        document.querySelector(".head a").getAttribute("href")
      );
  }
}

function getUserRank() {
  switch (window.location.hostname) {
    case "broadcasthe.net":
      return document
        .querySelector(".head")
        .innerText.split("(")[1]
        .split(")")[0];
  }
}

function getMessageBody() {
    return document.querySelector('.body').innerText;
}

function extractEmailAndIP(messageBody) {
    const email = messageBody.match(/\S+@\S+\.\S+/)?.[0];
    const ip = messageBody.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/)?.[0];
    return { email, ip };
}

function extractLinks(messageBody) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return messageBody.match(urlRegex) || [];
}

function makeCopyableTextField(caption, text, showText = true, color = '#4CAF50') {
    const id = (Math.random() + 1).toString(36).substring(7);
    const displayText = showText ? text : caption;

    document
        .querySelector(".body")
        .insertAdjacentHTML(
            "afterend",
            `<strong>${caption}:</strong> <span id="display-${id}">${displayText}</span> <button id="copy-${id}" class="copy-button">Copy</button><br>`
        );

    document.getElementById(`copy-${id}`).style.backgroundColor = color;

    document.getElementById(`copy-${id}`).addEventListener("click", () => {
        navigator.clipboard.writeText(text).then(
            () => {
                document.getElementById(`copy-${id}`).innerText = "✅ Copied!";
            },
            () => {
                document.getElementById(`copy-${id}`).innerText = "❌ Failed!";
            }
        );
    });
}

// Function to create the "PTP Check" button
function makePTPCheckButton(caption, text, color = 'red') {
    const id = (Math.random() + 1).toString(36).substring(7);
    const url = "https://passthepopcorn.me/tools.php?action=reccheck";

    document
        .querySelector(".body")
        .insertAdjacentHTML(
            "afterend",
            `<strong>${caption}:</strong> <button id="${id}" class="copy-button">${caption}</button><br>`
        );

    document.getElementById(id).style.backgroundColor = color;

    document.getElementById(id).addEventListener("click", () => {
       const newWindow = window.open(url, '_blank');
    });
}

function makeTemplateElement(caption, text) {
    const id = (Math.random() + 1).toString(36).substring(7);

    document
        .querySelector(".body")
        .insertAdjacentHTML(
            "afterend",
            `<strong>${caption}:</strong> <button id="${id}">Insert</button><br>`
        );

    document.getElementById(id).addEventListener("click", () => {
        document.querySelector('textarea[name="body"]').value = text;
    });
}

(() => {
    const profileLink = getProfileLink();
    const userRank = getUserRank();
    const profileLinkWithRank = `${profileLink} (${userRank})`;
    const messageBody = getMessageBody();
    const { email, ip } = extractEmailAndIP(messageBody);
    const links = extractLinks(messageBody).join("\n");

    if (profileLinkWithRank && email && ip) {
        // Insert buttons
        makeTemplateElement(
            "Country Ban",
            "Unfortunately official recruitment is not allowed for users from banned countries. [color=red][b]HDBits blocks invites from China, Egypt, Latvia, Russia, Turkey, Ukraine, Vietnam, Poland and India; if you are from one of these countries, unfortunately you are not able to join.[b][/color] There are no exceptions to this, please do not ask, as it will be considered as a violation to invite rules both here and HDB."
        );
            makeTemplateElement(
            "Rejected",
            "[b]Sorry, but you don't meet the requirements.[/b] Feel free to re-apply with a new PM once you do. Please do not reply to this message."
        );
        makeTemplateElement(
            "Re-apply",
            "You did not apply with all the information specified. Please send a new PM with all of the required information. You can check the sample PM on the recruitment post to get a template and fill it"
        );
        makeTemplateElement(
            "Sent - HDB",
            "Invite sent! [b]Please avoid signing up from a VPN or proxy, you must register from Home Connection.[/b] If you experience any issues, please join our IRC (connection details are in the recruitment post). Welcome to HDB!"
        );
        // Insert "Send a message:" line
        document.querySelector(".body").insertAdjacentHTML(
            "afterend",
            "<br><strong>-----Insert a message to send:-----</strong><br><br>"
        );
        // Adjusted button order Copy-able buttons
        makePTPCheckButton("PTP Check", `${profileLinkWithRank} | IP: ${ip} | ${email}`, 'red');// Red PTP Check button
        makeCopyableTextField("All Info", `${profileLinkWithRank} | IP: ${ip} | ${email}\n ------------- \n${links}`, false, 'green');// Hide content and make button green
        makeCopyableTextField("Rec Check", `${profileLinkWithRank} | IP: ${ip} | ${email}`, true);// Show content
        makeCopyableTextField("Email", email, true);// Show content

        document.querySelector(".body").insertAdjacentHTML(
            "afterend",
            "<br><strong>-----Script kicked in-----</strong><br>"
        );
    }

})();

// ==UserScript==
// @name        BeyondHD: Extract Recruitment Info from PMs
// @namespace   https://passthepopcorn.me/user.php?id=125754
// @match       https://beyond-hd.me/mail/message/*
// @grant       none
// @version     1.3
// @description Extracts invitee information from BeyondHD messages for recruiters, including user profile link and rank.
// @icon        https://beyond-hd.me/favicon.ico
// @author      Faiyaz93
// @license     BHD
// @downloadURL https://update.greasyfork.org/scripts/503115/BeyondHD%3A%20Extract%20Recruitment%20Info%20from%20PMs.user.js
// @updateURL https://update.greasyfork.org/scripts/503115/BeyondHD%3A%20Extract%20Recruitment%20Info%20from%20PMs.meta.js
// ==/UserScript==

(() => {
    // Get the message body
    const messageBodyElement = document.querySelector('p.fade-links');
    if (!messageBodyElement) {
        console.error("Message body not found.");
        return;
    }
    const messageBody = messageBodyElement.innerText;

    // Extract email, IP address, and links
    const email = messageBody.match(/\S+@\S+\.\S+/)?.[0];
    const ip = messageBody.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/)?.[0];
    const links = messageBody.match(/https?:\/\/[^\s]+/g) || [];

    // Extract profile link and rank
    const profileInfoElement = document.querySelector('p.text-muted.font-smaller > span.badge-internal > a');
    const profileLink = profileInfoElement ? profileInfoElement.href : 'Profile link not found';
    const userRankElement = document.querySelector('p.text-muted.font-smaller > span.badge-internal > i');
    const userRank = userRankElement ? userRankElement.getAttribute('data-original-title') : 'Rank not found';

    // Combine the profile link and rank
    const profileInfo = `${profileLink} (${userRank})`;

    // Insert "-----Script kicked in-----" text
    const scriptKickedInElement = document.createElement('div');
    scriptKickedInElement.innerHTML = "<br>-----Script kicked in-----";
    scriptKickedInElement.style.fontWeight = 'bold';
    scriptKickedInElement.style.marginTop = '10px';
    //scriptKickedInElement.style.color = 'White';
    messageBodyElement.insertAdjacentElement('afterend', scriptKickedInElement);

    // Create container for buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginTop = '20px';
    scriptKickedInElement.insertAdjacentElement('afterend', buttonContainer);

    function makeCopyableTextField(caption, text, showText = true, color = '#4CAF50') {
        const id = (Math.random() + 1).toString(36).substring(7);
        const displayText = showText ? text : caption;

        buttonContainer.insertAdjacentHTML(
            "beforeend",
            `<strong>${caption}:</strong> <span id="display-${id}">${displayText}</span> <button id="copy-${id}" class="copy-button">Copy</button><br>`
        );

        const copyButton = document.getElementById(`copy-${id}`);
        copyButton.style.backgroundColor = color;
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.padding = '5px 10px';
        copyButton.style.marginLeft = '10px';
        copyButton.style.cursor = 'pointer';

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

    function makePTPCheckButton(caption, text, color = 'red') {
        const id = (Math.random() + 1).toString(36).substring(7);
        const url = "https://passthepopcorn.me/tools.php?action=reccheck";

        buttonContainer.insertAdjacentHTML(
            "beforeend",
            `<strong>${caption}:</strong> <button id="${id}" class="copy-button">${caption}</button><br>`
        );

        const checkButton = document.getElementById(id);
        checkButton.style.backgroundColor = color;
        checkButton.style.color = 'white';
        checkButton.style.border = 'none';
        checkButton.style.padding = '5px 10px';
        checkButton.style.marginLeft = '10px';
        checkButton.style.cursor = 'pointer';

        document.getElementById(id).addEventListener("click", () => {
            window.open(url, '_blank');
        });
    }

    function makeTemplateElement(caption, text) {
        const id = (Math.random() + 1).toString(36).substring(7);

        buttonContainer.insertAdjacentHTML(
            "beforeend",
            `<strong>${caption}:</strong> <button id="${id}">Insert</button><br>`
        );

        const insertButton = document.getElementById(id);
        insertButton.style.backgroundColor = '#4CAF50';
        insertButton.style.color = 'white';
        insertButton.style.border = 'none';
        insertButton.style.padding = '5px 10px';
        insertButton.style.marginLeft = '10px';
        insertButton.style.cursor = 'pointer';

        document.getElementById(id).addEventListener("click", () => {
            document.querySelector('textarea[name="content"]').value = text;
        });
    }

    // Add copyable fields and check buttons
    makeCopyableTextField("Email", email, true);
    makeCopyableTextField("Rec Check", `${profileInfo} | IP: ${ip} | ${email}`, true);
    makeCopyableTextField("All Info", `${profileInfo} | IP: ${ip} | ${email}\n ------------- \n${links.join('\n')}`, false, 'green');
    makePTPCheckButton("PTP Check", `${profileInfo} | IP: ${ip} | ${email}`, 'red');

    // Move the "Insert a message to send" element here
    const insertMsgElement = document.createElement('div');
    insertMsgElement.innerHTML = "-----Insert a message to send:-----<br><br>"; // Added line break here
    insertMsgElement.style.fontWeight = 'bold';
    insertMsgElement.style.marginTop = '10px';
    //insertMsgElement.style.color = 'White';
    buttonContainer.insertAdjacentElement('beforeend', insertMsgElement);

    // Add "Insert" buttons for different templates
    makeTemplateElement(
        "Country Ban",
        "Unfortunately official recruitment is not allowed for users from banned countries. [color=red][b]HDBits blocks invites from China, Egypt, Latvia, Russia, Turkey, Ukraine, Vietnam, Poland and India; if you are from one of these countries, unfortunately you are not able to join.[b][/color] There are no exceptions to this, please do not ask, as it will be considered a violation of invite rules both here and HDB."
    );
    makeTemplateElement(
        "Rejected",
        "[b]Sorry, but you don't meet the requirements.[/b] Feel free to re-apply with a new PM once you do. Please do not reply to this message."
    );
    makeTemplateElement(
        "Re-apply",
        "You did not apply with all the information specified. Please send a new PM with all of the required information. You can check the sample PM on the recruitment post to get a template and fill it."
    );
    makeTemplateElement(
        "Sent - HDB",
        "Invite sent! [b]Please avoid signing up from a VPN or proxy, you must register from Home Connection.[/b] If you experience any issues, please join our IRC (connection details are in the recruitment post). Welcome to HDB!"
    );

})();

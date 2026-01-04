// ==UserScript==
// @name         GreasyFork Sequential Messenger with Auto-Close Tabs
// @namespace    http://tampermonkey.net/
// @version      1.21
// @license      MIT
// @author      SijosxStudio
// @url
// @description  Sequentially message users on GreasyFork with a template using direct message URLs, specified selectors, and auto-closing tabs after sending messages.
// @match        https://greasyfork.org/en/users?sort=name*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/515728/GreasyFork%20Sequential%20Messenger%20with%20Auto-Close%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/515728/GreasyFork%20Sequential%20Messenger%20with%20Auto-Close%20Tabs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const messageTemplate = `
<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
<h2 style="color: #0073e6;">Hello [username]!</h2>

<p>I'm thrilled to be here, making friends in a totally unfamiliar environment! I'm new to GreasyFork and picking up userscript developing in general. <br>
I’m sure you wanna know why I am here, there’s a couple reasons actually:</p>

<ol>
<li>To reach out and maybe consider collaborating?</li>
<li>I wanted your opinion of my profile and kindly ask you to test my scripts and see how you feel about them. I'm very interested in learning how all my scripts could be improved, etc etc…</li>
</ol>

<p>I really am so fascinated by the idea of designing userscripts that change the whole browsing experience, functionality, and feel for what is possible and right under our noses the whole time if we aren’t paying attention.</p>

<p>If I helped you in any significant way with one of my scripts, I ask that you’d consider supporting me by way of my <a href="https://www.paypal.com/ncp/payment/JKAE5EMA7HM8C">PayPal Tip Jar</a>.<br> Currently accepting all payment options through my link: PayPal, Venmo, Apple Pay, Google Pay, & Manual Debit/Credit Entry.</p>

<p>Here’s a quick overview of what scripts I currently offer:</p>

<ul style="list-style-type: disc; padding-left: 20px;">
<li><strong>Link Extractor</strong> – Extract and display links from webpages based on specific patterns.</li>
<li><strong>Search Engine Replacement</strong> – Replace the duckduckgo search engine with any other search engine by providing the URL.</li>
<li><strong>Make New PDF417 Barcode</strong> – Activate this userscript to overlay any webpage with an AAMVA Compliant PDF417 Data Collection Form.</li>
</ul>

<p>My ambition is to continuously improve my skills with the support of our fellow community members like you. I plan to expand my collection to cover a wide variety of helpful tools that make a positive impact and deliver fundamentally invaluable automation and/or services. If you have any ideas or suggestions for new features or scripts, feel free to share them with me!</p>

<p>If you'd like to support my projects and help further development for me, please consider visiting my <a href="https://greasyfork.org/en/users/1375139-sijosxstudio" target="_blank" style="color: #0D298B; text-decoration: underline;">Greasy Fork user page</a> for more information on how to Buy Me A Coffee</p>

<p>Thank you for your time and support! I look forward to any possible collaborations with you and others in the community.</p>

<p>Best Regards,<br>SijosxStudio</p>
</div>
`;

    let userIndex = 0;

    function startMessaging() {
        const userLinks = document.querySelectorAll('.user-profile-link'); // Update this selector if needed
        if (userIndex < userLinks.length) {
            const username = userLinks[userIndex].innerText.trim();
            const messageUrl = `https://greasyfork.org/en/users/1375139-sijosxstudio/conversations/new?other_user=${encodeURIComponent(username)}`;

            // Open the new conversation page in a new tab
            const newWindow = window.open(messageUrl, '_blank');

            // After the page loads, insert the message content and close the tab after submission
            newWindow.onload = function() {
// Set the username in the user input field
const usernameInput = newWindow.document.querySelector('#conversation_user_input');
if (usernameInput) {
    usernameInput.value = username;
}

// Set the message content in the textarea
const messageBox = newWindow.document.querySelector('#conversation_messages_attributes_0_content');
if (messageBox) {
    messageBox.value = messageTemplate.replace("[username]", username);
}

// Ensure the message format is set to HTML (optional if it defaults to HTML)
const htmlRadio = newWindow.document.querySelector('#conversation_messages_attributes_0_content_markup_html');
if (htmlRadio) {
    htmlRadio.checked = true;
}

// Click the submit button to send the message
const sendButton = newWindow.document.querySelector('input[type="submit"][value="Create conversation"]');
if (sendButton) {
    sendButton.click();

    // Close the tab after a brief delay to allow the message to be sent
    setTimeout(() => {
        newWindow.close();
    }, 5000); // Adjust delay as necessary
}
            };

            userIndex++;
            setTimeout(startMessaging, 10000); // Wait 10 seconds before messaging the next user
        } else {
            // Move to the next page if all users on the current page are processed
            const nextPage = document.querySelector('.pagination .next');
            if (nextPage) {
nextPage.click();
userIndex = 0;
setTimeout(startMessaging, 5000); // Wait 5 seconds for the new page to load
            }
        }
    }

    startMessaging();

})();
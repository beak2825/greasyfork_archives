// ==UserScript==
// @name        Sage Negator
// @namespace   Violentmonkey Scripts
// @match       https://soyjak.party/*
// @grant       none
// @version     0.2
// @author      dogjak
// @description 7/4/2023, 10:51:51 AM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/470150/Sage%20Negator.user.js
// @updateURL https://update.greasyfork.org/scripts/470150/Sage%20Negator.meta.js
// ==/UserScript==
// Get the 'reply' div elements
const replyDivs = document.querySelectorAll('.post.reply');

let latestMatchedDiv = null; // Variable to store the latest matching div

// Loop through each 'reply' div
replyDivs.forEach(replyDiv => {
  // Get the 'email' link within the 'reply' div
  const emailLink = replyDiv.querySelector('.email');

  // Check if the 'email' link exists and the href attribute matches 'mailto:sage!' or 'mailto:sage'
  if (emailLink && (emailLink.getAttribute('href').startsWith('mailto:sage') || emailLink.getAttribute('href').startsWith('mailto:sage!'))) {
    latestMatchedDiv = replyDiv; // Update the latest matching div
  }
});

if (latestMatchedDiv) {
  // Extract the number from the 'reply' div id as a string
  const number = latestMatchedDiv.id.split('_')[1].toString();

  // Get the textarea element
  const textarea = document.getElementById('body');

  // Construct the text to check if it exists in the website
  const existingText = ">>" + number + " negated";

  // Check if the existing text is found in the website
  const websiteContent = document.documentElement.innerHTML;
  const existsInWebsite = websiteContent.includes(existingText);

  // Insert the number into the textarea if it doesn't exist in the website content
  if (!existsInWebsite) {
    textarea.value = existingText;
  }
}
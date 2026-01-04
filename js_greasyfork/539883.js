// ==UserScript==
// @name         Motivational Custom Celebration Text
// @version      0.0.2
// @description  Make the celebration text more brutally motivational, and customisable than vanilla ones.
// @match        *://*.geoguessr.com/*
// @author       ZooperMarkt
// @run-at       document-start
// @license MIT 
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @namespace https://greasyfork.org/users/1483309
// @downloadURL https://update.greasyfork.org/scripts/539883/Motivational%20Custom%20Celebration%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/539883/Motivational%20Custom%20Celebration%20Text.meta.js
// ==/UserScript==

let currentObserver;
const thresholds = [
  { threshold: "Try again!", value: ["Wow! That guess sucks! Please Log Off!", "Our expectations for you were low, but damn!","You're throwing the towel now aren't you?"] }, // below 1000
  { threshold: "Nice guess!", value: ["Ur bad lmaoooo!","Ur not even trying!"] }, // 1000 to 2000
  { threshold: "Great guess!", value: ["Didn't bother regionguessing did you?"] }, // 2000 to 3000
  { threshold: "Fantastic guess!", value: ["Still miles off.","Not even 5K. Bro fell off."] }, // 3000 to 4999
  { threshold: "5K!", value: ["👏 Bare Minimum 👏", "Wow! You exist!"] } // 5K

];

function getNewTextFromCurrentText(currentText) {
  const match = thresholds.find(t => t.threshold === currentText);
  if (!match) return null;
  const values = match.value;
  return values[Math.floor(Math.random() * values.length)];
}

currentObserver = new MutationObserver(() => {
    const span = document.querySelector('span.casual-text_casualText__U5kPv');
    if (span)
    {
        const currentText = span.getAttribute('data-text');
        const newText = getNewTextFromCurrentText(currentText);
        if (newText)
        {
            span.setAttribute('data-text', newText);
            span.textContent = newText;
        }
    }
});

currentObserver.observe(document.body, {
    childList: true,
    subtree: true
});
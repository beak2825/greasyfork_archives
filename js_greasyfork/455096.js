// ==UserScript==
// @name        GMail - shorten mailing list tags
// @namespace   Violentmonkey Scripts
// @match       https://mail.google.com/mail/u/*/
// @grant       none
// @version     1.0.4
// @author      cheater 00 social gmail
// @description 11/19/2022, 3:56:47 PM
// @homepageURL https://greasyfork.org/en/scripts/455096-gmail-shorten-mailing-list-tags
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455096/GMail%20-%20shorten%20mailing%20list%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/455096/GMail%20-%20shorten%20mailing%20list%20tags.meta.js
// ==/UserScript==


// WHAT THIS IS
//
// This script shortens excessively long mailing list tags that appear in subjects. You can see a before and after comparison here: https://imgur.com/gallery/JgSSjw4
//
// The assumption is that the tag is either in the form:
// [long-tag-here] rest of the subject
// (i.e. in square brackets and separated by a space)
// or it starts with "Re:", then space, then the tag, then space, then the rest of the subject.
//
// Mailing lists with participants in another language than English might use a different reply prefix than "Re: ", you can adjust the code accordingly by duplicating the relevant if branch.
// This script does not handle "Fwd: ..." messages since they're rare. It does also not handle subjects of the form "Re: new subject here, Was: [long-tag-here] old sibject here". This is not a standard format and it happens rarely and it would make the logic super complex, so I don't really care.
//
// Very rarely, the script might flash the original tags for a split second. This will also happen while you're navigating e.g. through labels or results pages. This is normal. Fixing this would introduce a lot of code so it's not worth the hassle.
//
// If you have any questions / comments / updates, ask on the Tek/HP/Etc Discord server, or email me. My email address is on the @author tag at the top of the file, you'll have to add the @ and .com in the correct places and remove the spaces from it.
//
//
// HOW TO USE THIS SCRIPT
// 1. Install the ViolentMonkey addon for Firefox. There are analogous addons for other browsers.
// 2. Navigate to https://greasyfork.org/en/scripts/455096-gmail-shorten-mailing-list-tags
// 3. Click the big green "Install this script" button and follow instructions.
// 4. Optionally, modify the user config just below this text.
// 5. Refresh the GMail window for the script to start taking effect.


// USER CONFIGURATION SECTION

const updateInterval = 1000; // in miliseconds - how often should message subjects be scanned for updating?
// enter your tags below. Make sure the capitalization is correct, or the tag won't be replaced
const tags = [
  ["[HP-Agilent-Keysight-equipment]",              "[HP]"],
  ["[Test-Equipment-For-Sale-Wanted-or-Exchange]", "[TE-Mkt]"],
  ["[Test Equipment Design & Construction]",       "[TE-DIY]"],
  ["[TekScopes]",                                  "[Tek]"],
  ["[TekScopes2]",                                 "[Tek2]"]
];

// END OF USER CONFIGURATION SECTION


// CODE

function subPrefix(subject, oldPrefix, newPrefix) {
  return newPrefix + subject.substring(oldPrefix.length);
}

function shortenTag(subject) {
  for (const tag of tags) {
    const longTag = tag[0];
    const shortTag = tag[1];
    // eg: "[HP-Agilent-Keysight-equipment] HP 436A repair (?)"
    if (subject.startsWith(longTag + ' ')) {
      // replace the tag
      return subPrefix(subject, longTag + ' ', shortTag + ' '); // we don't need to process any further tags.
    }
    // eg: "Re: [HP-Agilent-Keysight-equipment] HP 436A repair (?)"
    if (subject.startsWith("Re: " + longTag + ' ')) {
      // replace the tag
      return subPrefix(subject, "Re: " + longTag + ' ', "Re: " + shortTag + ' '); // we don't need to process any further tags.
    }
  }
  return subject; // we didn't find a matching tag; return the original subject
}

function update() {
  const spans = document.querySelectorAll('td[role="gridcell"] > div[role="link"] span[data-thread-id]');
  for (const span of spans) {
    if (span.children.length != 0) { continue; }
    if (span.childNodes.length != 1) { continue; }
    if (span.childNodes[0].nodeType != Node.TEXT_NODE) { continue; }
    const textNode = span.childNodes[0];
    const subject = textNode.textContent;
    const newSubject = shortenTag(subject);
    span.innerText = newSubject;
  }
}

setInterval(update, updateInterval); // start the update loop


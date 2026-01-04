// ==UserScript==
// @name        UD Underline Related Profile Links
// @namespace   Avarice77
// @match       https://urbandead.com/map.cgi*
// @match       https://www.urbandead.com/map.cgi*
// @match       https://ispy.dxavier.net/*
// @run-at      document-end
// @inject-into auto
// @grant       none
// @license     MIT
// @version     1.2
// @author      Avarice77
// @description Modernized take on Bradley Sattem's (a.k.a. Aichon) idea to underline all related profile links on mouse hover
// @downloadURL https://update.greasyfork.org/scripts/497161/UD%20Underline%20Related%20Profile%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/497161/UD%20Underline%20Related%20Profile%20Links.meta.js
// ==/UserScript==

const debug = false;
const profileEl = document.querySelectorAll('.gt')[0].querySelector('a');
const playerId = profileEl.href.substring(profileEl.href.indexOf('id=') + 3);
if (debug) console.debug(`Your playerId:`, playerId);
const allProfiles = Array.from(document.querySelectorAll('a[href*="profile.cgi"]:not(.y)'));
allProfiles.forEach((profile, index) => {
  if (!profile.href.includes(playerId)) {
    const profileId = profile.href.substring(profile.href.indexOf('id=') + 3);
    if (debug) console.debug(`Processing profileId: ${profileId}`);
    profile.addEventListener('mouseover', (e) => {
      const relatedProfiles = [];
      allProfiles.forEach((otherProfile) => {
        const otherProfileId = otherProfile.href.substring(otherProfile.href.indexOf('id=') + 3);
        if (otherProfileId === profileId) {
          relatedProfiles.push(otherProfile);
          otherProfile.style.textDecoration = 'underline';
        } else {
          otherProfile.style.textDecoration = 'none';
        }
      });
      if (debug) console.debug(`Processing related profiles of profileId: ${profileId}`, relatedProfiles);
    });
    profile.addEventListener('mouseout', (e) => {
      allProfiles.forEach((profile) => {
        profile.style.textDecoration = 'none';
      });
    });
    if (debug) console.debug(`Added even listeners for profileId: ${profileId}`);
 }
});
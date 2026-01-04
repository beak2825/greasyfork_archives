// ==UserScript==
// @name         Fake Discord Nitro Codes
// @version      1.0.1
// @namespace    https://discord.com/
// @description  you actually need braincells to figure out how this works, since im not making it easy to use so ppl dont exploit it
// @author       creed
// @match        https://discord.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539731/Fake%20Discord%20Nitro%20Codes.user.js
// @updateURL https://update.greasyfork.org/scripts/539731/Fake%20Discord%20Nitro%20Codes.meta.js
// ==/UserScript==

(function() {
    'use strict';

function replacetext(span) {
  const newHTML = `
<div id="message-accessories-1384411821603164191" class="container_b7e1cb"><div class="referralContainer_b7e1cb"><div class="tile_ff4e03 container_ff4e03"><div class="media_ff4e03"><div class="referral_ff4e03"></div></div><div class="description_ff4e03"><h3 class="title_ff4e03">creed.__ gave mrbeast a Nitro trial!</h3><div class="tagline_ff4e03">Start your 2-week trial of Nitro to try out custom profiles, animated emojis and more!</div><div class="actions_ff4e03"><div class="buttonContainer_ff4e03"><div><button type="button" class="button__201d5 lookFilled__201d5 colorBrand__201d5 sizeSmall__201d5 grow__201d5"><div class="contents__201d5">Start Trial</div></button></div><div class="metadata_ff4e03">Expires in 984678 days</div></div></div></div></div></div></div>
  `;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = newHTML;
  span.replaceWith(wrapper.firstElementChild);
}

function checktextfirsst(span) {
  if (span.textContent.trim() === '.fakenitro') {
    replacetext(span);
  }
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) {
        if (
          node.tagName.toLowerCase() === 'div' &&
          /^message-content-\d+$/.test(node.id)
        ) {
          const span = node.querySelector('span');
          if (span && span.textContent.trim() === '.fakenitro') {
            checktextfirsst(span);
          }
        } else {
          node.querySelectorAll('div[id^="message-content-"] span').forEach((span) => {
            if (span.textContent.trim() === '.fakenitro') {
              checktextfirsst(span);
            }
          });
        }
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });

document.querySelectorAll('div[id^="message-content-"] span').forEach((span) => {
  if (span.textContent.trim() === '.fakenitro') {
    checktextfirsst(span);
  }
});
})();
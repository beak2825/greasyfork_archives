// ==UserScript==
// @name Twitter.com: image alt presence revealer
// @namespace myfonj
// @version 1.0.3
// @description Gives slight visual clue on elements that (don't) lack accessible descriptions.
// @author myfonj
// @grant GM_addStyle
// @run-at document-start
// @match *://*.twitter.com/*
// @downloadURL https://update.greasyfork.org/scripts/428284/Twittercom%3A%20image%20alt%20presence%20revealer.user.js
// @updateURL https://update.greasyfork.org/scripts/428284/Twittercom%3A%20image%20alt%20presence%20revealer.meta.js
// ==/UserScript==

(function() {
let css = `
/*
https://greasyfork.org/en/scripts/428284/versions/new
*/
/* 
§ mark alt-less images
twitter has nasty habit of using [aria-label] without value
luckilly, from CSS POW it is same as using [aria-label=""]
exceptions:
- avatars (see end of stylesheet)
*/
[aria-label=""]:not([role]),
[aria-label="Image"],
[aria-label="Embedded video"],
img:not([alt]),
img[alt="Image"],
img[alt=""],
img[alt="Embedded video"]
{
 outline: 0.3em inset rgba(255,0,0,0.3) !important;
 outline-offset: -.5em;
}
/*
 § mark imges with alternative texts
 exceptions:
 - emoji
*/
[aria-label
 ][data-testid*="photo"i
 ]:not([aria-label=""]
 ):not([aria-label="Image"]
 ):not([aria-label="Embedded video"]
 ),
[aria-label
 ][data-testid*="preview"i
 ]:not([aria-label=""]
 ):not([aria-label="Image"]
 ):not([aria-label="Embedded video"]
 ) [aria-label],
img[alt
 ]:not([alt=""]
 ):not([alt="Image"]
 ):not([alt="Embedded video"]
 ):not([src*=".twimg.com/emoji/v"])
{
 outline: 0.3em inset rgba(0,255,0,0.3) !important;
 outline-offset: -.5em;
}
/*
 § exception for avatars
 _all_ avatars have void aria-labels and alts
 (images with alts are invisible anyway, so )
*/
[style="padding-bottom: 100%;"
 ] + div > div[aria-label=""]
{
 outline: none !important;
}

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

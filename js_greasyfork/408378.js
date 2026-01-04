// ==UserScript==
// @name ●→■ Unround Everything Everywhere ◙
// @namespace myfonj
// @version 1.9.3
// @description Forces zero border-radius to everything.
// @license CC0 - Public Domain
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/408378/%E2%97%8F%E2%86%92%E2%96%A0%20Unround%20Everything%20Everywhere%20%E2%97%99.user.js
// @updateURL https://update.greasyfork.org/scripts/408378/%E2%97%8F%E2%86%92%E2%96%A0%20Unround%20Everything%20Everywhere%20%E2%97%99.meta.js
// ==/UserScript==

(function() {
let css = "";
css += `

/*
https://userstyles.world/style/8283/unround-everything-everywhere
https://greasyfork.org/en/scripts/408378/versions/new

Changelog
1.9.3 (2025-11-27) Ditched the Gmail radio whitelist, since it was a performance disaster, and as it seems Gmail removed them anyway (?).
1.9.2 (2025-11-27) label:has(input[type="radio"]) whitelisted.
1.9.1 (2025-11-03) Border-width workaround scoped for Firefox.
1.9.0 (2025-11-03) Adjustments for forced colours mode.
1.8.5 (2025-09-11) whitelist \`[role="radio" i]\`
1.8.3 (2025-07-17) whitelist some Gmail radios
1.8.2 (2025-06-20) copilot splash unsquircling
1.8.1 (2025-06-12) more "radio" whitelisting (for Outlook)
1.8.0 (2025-03-03) seznamzpravy.cz un-squircle
1.7.0 (2025-03-03) copilot.microsoft.com un-squircle
1.6.1 (2025-02-19) Spotify small "+" button.
1.6.0 (2025-02-19) Enabled aggressive unrounding in SVG (when possible). Tell me when it borkes something for you.
1.5.0 (2025-02-18) Some Spotify touches. And trying aggressive unrounding in SVG, but keeping off for release.
1.4.4 (2024-05-17) x.com "Terror from the deep"
1.4.3 (2024-04-26) + chromium.org for avatar unrounding (issues.chromium.org)
1.4.2 (2024-04-03) Google One avatar thinner
1.4.1 (2024-04-03) Google One avatar four-colour outline fix for google search (thicker for now)
1.4.0 (2024-03-30) Google One avatar four-colour outline
1.3.1 (2024-02-09) Attempt to fix Greasyfork bug in conversion to JS.
1.3.0 (2023-11-13) Better radio rounding permission, some checkbox SVG un-rounding
1.2.6 (2023-10-19) Just a minor refactor
1.2.5 (2023-09-21) FB new logo ("f" is slightly smaller than it should be, but whatever)
1.2.4 (2023-09-06) + outline offset
1.2.3 (2023-09-06) Facebook avar status outlines squared.
1.2.2 (2023-02-22) Fix the Facebook logo. Mwahahaha.
1.2.1 (2023-02-02) Let's try to let true radio inputs be round.
1.2.0 (2023-01-24) Just released to userstyles.world, reworded comments.
*/

/*
Core: Global and aggresive unrounding for basically everything.
With "whitelist" for semantic radios.
*/
*:not(#u#n#r#o#u#n#d):not(
  input[type="radio" i]
, [role="radio" i]
, input[type="radio" i] + label
/* Outlook: */
, input[type="radio" i] + [aria-hidden="true" i]:empty:has(+ label)
/* Gmail: Brings Edge to crawl in some places, like Telegram SVG animations * so OFF /
, input[type="radio" i] + *:not(:has(:not(:empty))) *
/* Telegram and co. (Tg nests labels btw :/ ) */
, label:has(input[type="radio" i]) > *
, label:has(input[type="radio" i])
/* */
)
{
 &,
 &::before,
 &::after {
  border-radius: 0 !important;
 }
}

/*
Revert \`meter\` element radius in forced colours mode,
since it makes it render non-forced design instead (bug?).
It will be rounded (in most browsers),
but with good contrast and as intended.
(Strange it is necessary to do this.)
*/
@media (forced-colors: active) {
 meter:not(#u#n#r#o#u#n#d#forced-coloUrs) {
  border-radius: revert !important;
 }
}

/*
Unround some "SVG checkboxes; not that aggresive.
*/
/*
As seen at https://not-checklist.intopia.digital/
*/
label input[type="checkbox" i] + svg rect[rx] {
 rx: 0 !important;
}
label input[type="checkbox" i] + svg rect[ry] {
 ry: 0 !important;
}

/*
You know what? Hammertime!
Aggressive unrounding of all "fill-circles"
and rounded fill-rectangles in SVG.
Let's see what it breaks.
*/
circle[cx="50%"][cy="50%"][r="50%"]:first-child {
	svg & { overflow: hidden; }
 r: 100% !important;
	fill: red !important;
}
svg rect {
 rx: 0 !important;
 ry: 0 !important;
}
/* */

/*
 Firefox on Windows bug(?): touching any border property
 reverts "fancy" modern thin 1px borders
 to "ugly" retro old 3px outset look.
 This is an attempt to circumnvent it by setting it back to 1px
 at lowest possible specifity, so any (unlayered) author declaration wins over this.
 Using :where() here is insufficient, because this this "wannabe userstyle" is injected as
 the last author style, so it would win over prior \`*\` declarations anyway.
*/
@supports (-moz-appearance:none) {
 @layer i_miss_true_user_origin_level_stylesheets {
  :where(input, button, select) {
   border-width: 1px;
  }
 }
}

/*
FB & Workplace extra fixes: square masks
(not fenced to work on custom domains, but selector should be specific enough
*/
:root#facebook svg[role] > mask[id]:first-child + g[mask]:last-child
{
  mask: none !important;
  /* circle outline, some status perhaps */
  & circle { opacity: 0.1 !important; }
  /* circle outline to real outline */
  & image:has(~ circle[stroke="var(--accent)"])
  {
   outline: 2px solid var(--accent);
   outline-offset: 2px;
   & ~ circle { display: none; }
 }
}

`;
if ((location.hostname === "facebook.com" || location.hostname.endsWith(".facebook.com"))) {
  css += `
    /*
      FB Logo
    */
    :root#facebook svg[viewBox="0 0 36 36"] path {
      /*
       logo - circle to square
       Original path is circle with tiny notch on the bottom that lets (curved!) bottom edge of "f" be pushed up,
       presumably because otherwise it could be percieved as "sticking out" of the circle due white-blue contrast.
       Second paths are older, first is from 2023-09-21.
      */
      &[d="M20.181 35.87C29.094 34.791 36 27.202 36 18c0-9.941-8.059-18-18-18S0 8.059 0 18c0 8.442 5.811 15.526 13.652 17.471L14 34h5.5l.681 1.87Z"] ,
      &[d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z"] {
        d: path("M0 0 H 36 V 36 H 0 z");
      }
      /*
       logo - "f" not curved on the bottom
       this removes the bottom curvature (v12.7c1 .2 2 .3 3 .3s2-.1 3-.3) and sticks it (almost) to viewbox bondary.
       (1px -- V–instead of V 36 -- difference to prevent aforementioned perceptual overhang.)
       I guess this is the most nitpick-ish thing I have ever done.
      */
      &[d="M13.651 35.471v-11.97H9.936V18h3.715v-2.37c0-6.127 2.772-8.964 8.784-8.964 1.138 0 3.103.223 3.91.446v4.983c-.425-.043-1.167-.065-2.081-.065-2.952 0-4.09 1.116-4.09 4.025V18h5.883l-1.008 5.5h-4.867v12.37a18.183 18.183 0 0 1-6.53-.399Z"],
      &[d="M25 23l.8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z"] {
        d: path("M25 23l.8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15   V 35 h 6    V23h4z");
      }
    }
  `;
}
if ((location.hostname === "twitter.com" || location.hostname.endsWith(".twitter.com")) || (location.hostname === "x.com" || location.hostname.endsWith(".x.com"))) {
  css += `
    /*
      Twitter extra fixes
    */
    [style*='clip-path: url("#circle-hw-shapeclip-clipconfig")'] {
      clip-path: none !important;
    }
  `;
}
if ((location.hostname === "web.whatsapp.com" || location.hostname.endsWith(".web.whatsapp.com"))) {
  css += `
    /*
      WhatsApp extra fixes
    */
    svg:has(path.background) {
      background-color: rgba(var(--white-rgb),.16);
    }
    svg:has(path.background) g path{
      opacity: .3;
    } 
    svg:has(path.background) path.background {
      display: none
    }
  `;
}
if ((location.hostname === "google.com" || location.hostname.endsWith(".google.com")) || (location.hostname === "chromium.org" || location.hostname.endsWith(".chromium.org"))) {
  css += `
    /*
    Google One avatar four-colour outline
    <svg focusable="false" height="40px" version="1.1" viewBox="0 0 40 40" width="40px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="opacity:1.0">
     <path d="M4.02,28.27C2.73,25.8,2,22.98,2,20c0-2.87,0.68-5.59,1.88-8l-1.72-1.04C0.78,13.67,0,16.75,0,20c0,3.31,0.8,6.43,2.23,9.18L4.02,28.27z" fill="#F6AD01"></path>
     <path d="M32.15,33.27C28.95,36.21,24.68,38,20,38c-6.95,0-12.98-3.95-15.99-9.73l-1.79,0.91C5.55,35.61,12.26,40,20,40c5.2,0,9.93-1.98,13.48-5.23L32.15,33.27z" fill="#249A41"></path>
     <path d="M33.49,34.77C37.49,31.12,40,25.85,40,20c0-5.86-2.52-11.13-6.54-14.79l-1.37,1.46C35.72,9.97,38,14.72,38,20c0,5.25-2.26,9.98-5.85,13.27L33.49,34.77z" fill="#3174F1"></path>
     <path d="M20,2c4.65,0,8.89,1.77,12.09,4.67l1.37-1.46C29.91,1.97,25.19,0,20,0l0,0C12.21,0,5.46,4.46,2.16,10.96L3.88,12C6.83,6.08,12.95,2,20,2" fill="#E92D18"></path>
    </svg>
    
    So technically scoping to
    svg[style="opacity:1.0"][viewBox="0 0 40 40"]:has(
    >path:last-child:nth-of-type(4)
    ) {}
    would work, but let's not introduce unnecessary complexity here
    
    */
    
    path[d="M4.02,28.27C2.73,25.8,2,22.98,2,20c0-2.87,0.68-5.59,1.88-8l-1.72-1.04C0.78,13.67,0,16.75,0,20c0,3.31,0.8,6.43,2.23,9.18L4.02,28.27z"][fill="#F6AD01"] {
      d: path("M 2 2 v 36 l 2 -2 V 4 Z");
    }
    path[d="M32.15,33.27C28.95,36.21,24.68,38,20,38c-6.95,0-12.98-3.95-15.99-9.73l-1.79,0.91C5.55,35.61,12.26,40,20,40c5.2,0,9.93-1.98,13.48-5.23L32.15,33.27z"][fill="#249A41"] {
      d: path("M 2 38 h 36 l -2 -2 H 4 Z");
    }
    path[d="M33.49,34.77C37.49,31.12,40,25.85,40,20c0-5.86-2.52-11.13-6.54-14.79l-1.37,1.46C35.72,9.97,38,14.72,38,20c0,5.25-2.26,9.98-5.85,13.27L33.49,34.77z"][fill="#3174F1"] {
      d: path("M 38 2 v 36 l -2 -2 V 4 Z");
    }
    path[d="M20,2c4.65,0,8.89,1.77,12.09,4.67l1.37-1.46C29.91,1.97,25.19,0,20,0l0,0C12.21,0,5.46,4.46,2.16,10.96L3.88,12C6.83,6.08,12.95,2,20,2"][fill="#E92D18"] {
      d: path("M 2 2 h 36 l -2 2 H 4 Z");
    }
  `;
}
if ((location.hostname === "spotify.com" || location.hostname.endsWith(".spotify.com"))) {
  css += `
   path[d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm16.398-2.38a1 1 0 0 0-1.414-1.413l-6.011 6.01-1.894-1.893a1 1 0 0 0-1.414 1.414l3.308 3.308 7.425-7.425z"] {
    d: path("M 4 4 H 20 V 20 H 4 Z      M1 12m16.398-2.38a1 1 0 0 0-1.414-1.413l-6.011 6.01-1.894-1.893a1 1 0 0 0-1.414 1.414l3.308 3.308 7.425-7.425z");
   }
   path[d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm11.748-1.97a.75.75 0 0 0-1.06-1.06l-4.47 4.47-1.405-1.406a.75.75 0 1 0-1.061 1.06l2.466 2.467 5.53-5.53z"] {
    d: path("M 2 2 H 14 V 14 H 2 Z      M0 8m11.748-1.97a.75.75 0 0 0-1.06-1.06l-4.47 4.47-1.405-1.406a.75.75 0 1 0-1.061 1.06l2.466 2.467 5.53-5.53z");
   }
   path[d="M11.999 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11z"] {
    d: path("M 2 2 H 22 V 22 H 2 Z");
    stroke-width: 2px;
    fill: none;
    stroke: color-mix(in srgb,currentcolor, transparent);
   }
   path[d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"] {
    d: path("M 1 1 H 15 V 15 H 1 Z");
    stroke-width: 1.25px;
    fill: none;
    stroke: color-mix(in srgb,currentcolor, transparent);
   }
  `;
}
if ((location.hostname === "copilot.microsoft.com" || location.hostname.endsWith(".copilot.microsoft.com"))) {
  css += `
   [class*="squircle"] ,
   [style^="clip-path: var(--clip-path-squircle"] {
    clip-path: none !important;
   }
  `;
}
if ((location.hostname === "seznamzpravy.cz" || location.hostname.endsWith(".seznamzpravy.cz"))) {
  css += `
   svg > defs:has([id*="squircle"]) ~ image[mask]:only-of-type {
    mask: none !important;
   }
  `;
}
if ((location.hostname === "developer.mozilla.org" || location.hostname.endsWith(".developer.mozilla.org"))) {
  css += `
   /* Fuck Custom Elements. Seriously, fuck them! Damnit, geez. */
   * {
    --radius-full: 0 !important;
    --border-radius: 0 !important;
   }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

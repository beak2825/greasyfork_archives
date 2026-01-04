// ==UserScript==
// @name         Custom CSS Inject
// @namespace    custom-css-inject
// @version      1.3
// @description  Inject Custom CSS
// @author       AZ
// @match        *
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474319/Custom%20CSS%20Inject.user.js
// @updateURL https://update.greasyfork.org/scripts/474319/Custom%20CSS%20Inject.meta.js
// ==/UserScript==

function GM_addStyle(css) {
  const style = document.getElementById("GM_addStyleBy8626") || (function () {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = "GM_addStyleBy8626";
    document.head.appendChild(style);
    return style;
  })();
  const sheet = style.sheet;
  sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}


GM_addStyle('[adblocked="true"], .outerAdHatch, .post_content_video_player_ad_container { display: none !important }');


/* Instagram */

GM_addStyle('[aria-label="Chats"] .xuxw1ft { white-space: unset !important }');


/* twitter */

/* nav[role="navigation"]:not([aria-label="Primary"]) {
  opacity: 0;
} */

/* div[data-testid="TopNavBar"] {
  height: 50px;
  overflow: hidden;
  background: transparent;
}

#layers {
  overflow: hidden;
}

main.css-1dbjc4n {
  padding-top: 53px;
}

div[aria-label="Timeline: Conversation"] div[role="progressbar"][aria-valuemax="100"] {
  margin: unset;
}

div[role="progressbar"][aria-valuemax="100"] {
  margin-top: -53px;
  position: relative;
}

.r-1xcajam:not(.r-1p0dtai) {
  overflow: hidden;
  position: unset !important;
}


header[role="banner"] > div:nth-child(2) {
  overflow: hidden !important;
  position: relative !important;
} */

/* div[data-testid="TopNavBar"]:not(.r-16e0dcy) {
  display: none;
}

div[data-testid="primaryColumn"] {
  padding-top: 100px;
}


 */

// nav[aria - label= "Notifications timelines"],
// div[aria - label= "Open app"],
// a[href = "/explore"] {
//   display: none!important;
// }

// /* reddit */

// nav.PaginationButtons {
//   margin - bottom: 125px;
// }

// .scroll - disabled {
//   overflow: visible!important;
//   position: relative!important;
// }

// .sidebar - grid,
// .m - blurred {
//   filter: blur(0)!important;
// }

// .UseAppButton,
// .OneTap,
// .OnboardingStep,
// .XPromoBottomBar,
//   [data - adclicklocation],
// .useApp,
// ._3VqiDbufgl9_EiV_tk9L6u,
// .OverlayMenu a,
// .XPromoInFeed,
//   main.OneTap,
//   xpromo - nsfw - blocking - modal,
//   button.m - subscribe,
//   nav[aria - label= "Notifications timelines"] {
//   display: none!important;
// }

// .TopNav {
//   position: relative!important;
// }

// .NavFrame__below - top - nav {
//   padding - top: 0!important;
// }

// /* .sw-body-class .App iframe {
//   display: none;
// } */

// /* Soundcloud */

// .NavBar_NavBarLinkItemWrapper__dlEcJ: last - child {
//   display: none!important;
// }
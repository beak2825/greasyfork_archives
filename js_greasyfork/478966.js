// ==UserScript==
// @name Slickdeals Cleaner NG
// @namespace https://greasyfork.org/users/1210203
// @version 1.0
// @description Removes ADs, promotional junk, and any sponsored or featured sections.
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/478966/Slickdeals%20Cleaner%20NG.user.js
// @updateURL https://update.greasyfork.org/scripts/478966/Slickdeals%20Cleaner%20NG.meta.js
// ==/UserScript==

(function() {
let css = `/* rm ads */
IFRAME,
.frontpageGrid__bannerAd,
.ad,
.abc,
.ab,
.sideGridAuWrapper,
.commentsAd,
#bottomDDAd,
#logoarea,
[data-adlocation],
#ads-bottom,
.mobileAdFluid,
#pageContent::after {
  display: none !important;
}

/* rm junk */
.sdModalOverlay,
.slickdealsHeader__disclaimer,
.slickdealsHeader__linkSection,
.slickdealsHeaderSubNav,
.frontpageRecommendationCarousel,
.recommendedDealAlertsSection,
.relatedCategory,
.bp-p-sidebarCoupons,
[data-role="rightRailBanner"],
[data-module-name="trending-stores"],
[data-module-name="Top Categories"],
.slickdealsFooter__apps,
.welcomeToast,
.bottomFullBar,
.extensionSearchBanner,
#sdfacebook_options_dialog {
  display: none !important;
}
body.pushToAppDrawerScrollLock {
  overflow: visible !important;
}
#prefContainer {
  margin-top: 21px !important;
}
.pageContent--reserveAnnouncementBar {
  padding-top: 0 !important;
}

/* rm promoted deals */
.frontpageGrid__feedItem {
  display: none !important;
}
li:has([data-pno]) {
  display: initial !important;
}

/* add color bars back */
.bp-p-sidebarDeals--popular > .bp-p-sidebarDeals_sectionTitle {
  border-top: 3px solid #ffb851;
}
.bp-p-sidebarDeals--trending > .bp-p-sidebarDeals_sectionTitle {
  border-top: 3px solid #0072bc;
}

/* improve thumbs contrast */
.blueprint .bp-p-ratingThumbs_icon--full .bp-i-thumb {
  text-shadow: 0px -1px #333, 1px -1px #333, 1px 0px #333, 1px 1px #333, 0px 1px #333, -1px 1px #333, -1px 0px #333, -1px -1px #333 !important;
}
.blueprint .bp-p-ratingThumbs_icon--partial .bp-i-thumb {
  color: #FFE659 !important;
  opacity: 0.5 !important;
  text-shadow: 0px -1px #666, 1px -1px #666, 1px 0px #666, 1px 1px #666, 0px 1px #666, -1px 1px #666, -1px 0px #666, -1px -1px #666 !important;
}

/* proper disclaimer */
.ftcDisclaimer {
  font-style: normal !important;
  font-weight: bold !important;
}
.ftcDisclaimer>span:nth-child(2):before {
  content: "NOTICE: " !important;
  color: red !important;
  font-size: 12px !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

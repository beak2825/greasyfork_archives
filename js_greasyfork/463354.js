// ==UserScript==
// @name		1_The-Bump
// @description		fix layout on mobile & block ads
// @match		*://*.thebump.com/*
// @match		https://www.thebump.com/*
// @grant		GM_addStyle
// @namespace		https://greasyfork.org/en/scripts/463354-1_the-bump
// @author		sports_wook
// @version		2025.05.15
// @downloadURL https://update.greasyfork.org/scripts/463354/1_The-Bump.user.js
// @updateURL https://update.greasyfork.org/scripts/463354/1_The-Bump.meta.js
// ==/UserScript==


GM_addStyle (`

:root {
    --sweepstakes-mobile-banner-height: 0px  !important;
}

#headerContainer[class*="show-sign-up-banner"], #contentContainer[class*="show-sign-up-banner"] {
  margin-top: 0px !important;
}

#headerContainer, .contentContainer {
  margin-top: -10px !important;
}

header .nav-area {
  height: 50px !important;
}

div[class^="Tooltip_"], .sign-up-section, .sign-up-module , a.shareBtn, .sign-up-banner, .top-social-share, .join-button, .header-share, .in-article-ad, #branch-banner-iframe, .share-btn,.action-box, .editorial-box, .save-article-icon-wrapper, .share, .sign-up-in-bottom-container, .related-article, footer, .dividingLine, .relatedVideoPrompt, .space-box, .StagesCarouselFullScreen.mbm.isMargin, .download-card, div[style="min-height:526px"], .title, p.list-link-title, p.list-link-item, div[class^="NewLabel__StyledLabel"],  p[class="medical-disclaimer"], div[class^="style__StyleFeedbackWidget"], div[class^="styles__StyledInlineSignUpContainer"], .sponsor-ad-container, .ad-height, .hasSignUpBanner > .sign-up-banner, .sponsor-ad-container, .ad-height, .leaderBoardAdWrapper, .right-rail .content {
   display: none !important;
   width: 0px !important;
   height: 0px !important;
}

`);
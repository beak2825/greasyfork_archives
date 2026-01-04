// ==UserScript==
// @name Global Ads and Cookie Banner Remover
// @namespace -
// @version 1.0.0
// @description removes ads and cookies banners.
// @author NotYou
// @license GPL-3.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/439627/Global%20Ads%20and%20Cookie%20Banner%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/439627/Global%20Ads%20and%20Cookie%20Banner%20Remover.meta.js
// ==/UserScript==

(function() {
let css = `/* ATTRIBUTES */
:where(
[data-testid="cookie-policy-dialog"], [data-ad-format], [title="Advertisement"], [aria-label="Advertisement"], [data-ad-client], [data-ad-slot], [data-aaad], [data-aa-adunit], [data-module="cookieBanner"], [type="COOKIE-CONSENT"], [data-ads-manager], [data-partnertag], [data-embeddedads], [data-text-ad], [data-share="true"], [data-autoload-cookie-consent-bar], [data-tracking], [data-text-ad="1"], [data-component="CookieBanner"], [data-qa="cookies-policy-informer"],

/* IDS */
#gdprconsent, #sp-cc, #gdpr-banner, #dialog[arial-labelledby="cb-header"], #onetrust-consent-sdk, #onetrust-banner-sdk, #script-show-info-ad, #ad_iframe, #ad_position_box, #adBlock, #gcsa-top, #cookies, #cookie, #video-ad, #ad-header-mobile-contener, #ad-footer, #_evidon-barrier-wrapper, #zd-cookies-consent, #zd-cookie-policy, #ad-footer2, #google-ads-frame, #google_ads_frame, #qc-cmp2-main, #cmp-app-container, #gdpr-single-choice-overlay, #uhfCookieAlert, #cookie-disclosure, #eu-cookie-law, #gdpr-consent-tool-wrapper, #cookiePrefPopup, #consent_blackbar, #truste-consent-track, #adxx1, #adzz, #adyy, #adxx, #adxxy, #adxxt, #adxxq, #insx1, #cookie-banner, #adonworksbot, #cb-cookie-banner, #cookiebanner, #ad_rightslot1, #ad_rightslot2, #ad_houseslot_a, #ad_topslot, #ad_houseslot_b, #ad_btmslot, #vi-stories-ad-container, #ad_unit, #adslot1, #adslot2, #sponsorship_module, #consent, #eu_cookie_disclaimer, #ad-header-mobile-contener, #dw-ad, #overlay-ad, #cookie-law-info-bar, #cookie-law-info-again, #js-abContainterMain, #pb_template, #adblock_tooltip, #phTrackImg, #adBlockAlertWrap, #dfp-tsb, #dfp-smlb, #dfp-tlb, #dfp-mlb, #cookie-accept-footer, #ad-dp1, #ad-dp2, #ad-dp3, #headerTopAd, #advertise-block, #js-cookie-banner, #div-gpt-ad-sidebar,  #div-gpt-ad-ad-cus-move, #qc-cmp2-container, #popsByTrafficJunky, #cookie-bar, #ez-cookie-dialog-wrapper, #cookie-banner-root, #eu-cookie-bar-notification, #cookie-notice-wrapper, #privacy-consent, #cx_bottom_banner, #gdpr-consent, #cookieOverlay, #adsWrapper,

/* CLASSES */
.badge-link--serp, .results--ads, .js-sidebar-ads, .adsbygoogle, .adsbygoogle-noablate, .sidebar_left__ad, .ad_result__attached_content, .ad, .ad-ga, .ad-entry, .ad-content, .js-consent-banner, .css-1dbjc4n.r-1awozwy.r-1m3jxhj.r-1upvrn0.r-eqz5dr.r-1d7fvdj.r-d9fdf6.r-tvv088.r-13qz1uu, .css-1dbjc4n.r-aqfbo4.r-1p0dtai.r-1d2f490.r-12vffkv.r-1xcajam.r-zchlnj, ._3q-XSJ2vokDQrvdG6mR__k, .cyeDgs, .cyeDgs.cyeDgs, .Advertisement, .advertisement, .jMhaxE, .cookies, .cookie, .b_ad, .b_adTop, ._4Yzd2, .cookie-popup, .eu-cookie-popup, .cookiesBanner, .ad-link, .ad-footer, .ad-support-desktop, .videoad-click, .videoad-base, .ad-square, .b-cookies-informer, .img-ad, .img_ad, .searchCenterTopAds, .cookie-banner-wrapper, .cookie-banner, .cookie-disclosure, .cookie-disclosure-message, .remove-ads, .global-alert-banner, .cmp__dialog, .__cookies, .cookies_policy_wrap, .cookies_policy, ._cookies, .css-103nllw.no-hash, .discord-dialog, .discord-button, .consent-overlay, .css-17nqy7q, .user-ads, .adzz, .adyy, .adxx, .adxxt, .adxx1, .adxxq, .sidebar-ads, .sidebar-ad, .sidebar_ads, .sidebar_ad, .cookiebanner, .cc-banner, .cc-floating, .ad-products, .cafemedia-ad-slot-top, .cafemedia-ad-slot-right1, .AdEngine-module__container, .cookiealert, .g-banner__bg, .cook-web, .cookielawinfo-row-cat-table, .cookielawinfo-winter, .wt-cli-cookie-description, .webarx-cookie-notice, .adsbytrafficjunky, .sponsor-text, .euCookieModal, .e8-column, .accept-cookies-wrapper, .suggestions-box, .adsbox, .ad_box, .ad-wrapper, .sponsored-suggestion-card-list, .advertise, .ad-margin-top, .qc-cmp2-main, .alert-dismissable, .chr-cookie-banner__inner, .qc-cmp-cleanstate, .collect-data, .ad-300px, .ad-section, .adsbyexoclick, .cc_banner-wrapper, .gdprcontainer, .cookieBubble.show, .qc-cmp2-container, .ez-cookie-banner, .cookie-consent.cookie-consent-minimal, .c-cookies, .cookies-notification
):not(:where(html, body, body > *:only-child))
{
    display: none !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

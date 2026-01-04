// ==UserScript==
// @name     Google Convert
// @description    ...
// @author   ...
// @version  0.5
// @match  https://duckduckgo.com/*
// @match  http://duckduckgo.com/*
// @match  https://html.duckduckgo.com/*
// @run-at   document-start
// @grant    none
// @license  GNU GPLv3
// @namespace https://greasyfork.org/users/220598
// @downloadURL https://update.greasyfork.org/scripts/474600/Google%20Convert.user.js
// @updateURL https://update.greasyfork.org/scripts/474600/Google%20Convert.meta.js
// ==/UserScript==

(function() {var css = [
	"@namespace url(http://www.w3.org/1999/xhtml);",

// Google Logo
".home_minimalHeroLogo__kX4wR img {opacity:0}",
".home_minimalHeroLogo__kX4wR, .logo_homepage, .header__logo {background-image:url(https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogodownload.org%2Fwp-content%2Fuploads%2F2014%2F09%2Fgoogle-logo-4.png&f=1&nofb=1&ipt=d5974eb00dc2b493ade5e28fc30ce29308e2647f8381b36baa0d32bc5a640977&ipo=images) !important}",
".home_minimalHeroLogo__kX4wR, .logo_homepage {background-size: 240px 199px !important; background-repeat:no-repeat;}",
".header__logo {background-size: 58px 22px !important; width: 80px !important}",

// White Background in Header and Body
"body, .header, .header-wrap {background-color:none !important;}",

// Remove Main Search Page Cruft
".social-menu_button__2_gkB.legacy-homepage_socialIcons__obCva {display:none !important}",
".text_text__q9rvO.text_text-md__x96X3.tagline_tagline__xryVo, .slide-1 {display:none !important}",
".js-badge-link.badge-link--full.badge-link{display:none !important}",
".content-info{display:none !important}",
".onboarding-ed--faq.js-onboarding-ed.onboarding-ed{display:none !important}",
".faq{display:none !important}",
".ddg-extension-hide.atb-button--faq.btn--primary.btn{display:none !important}",
".js-tagline.tag-home__item{display:none !important}",
".js-onboarding-ed.onboarding-ed{display:none !important}",
".js-tag-home {visibility:hidden !important;}",
".js-hl-button {visibility:hidden !important;}",
//new-August 2023 -- to remove the slide up stuff
".onboardingEd_slide1__FSFYj.onboardingEd_onboardingEdSlide__KWvTa, .onboardingEd_slide2__OD1v0.onboardingEd_onboardingEdSlide__KWvTa, .onboardingEd_slide3__t8_Hr.onboardingEd_onboardingEdSlide__KWvTa, .onboardingEd_slide4__eOSgT.onboardingEd_onboardingEdSlide__KWvTa, .onboardingEd_onboardingEd__5Ggmz {display:none !important;}",


// Remove Results Page Cruft
".js-feedback-btn-wrap{display:none !important}",
".dropdown--settings.dropdown{display:none !important}",

// Remove Results Page Hover Boxes
".yQDlj3B5DI5YO8c8Ulio{border:none !important}",

// Remove Footer
".footer{display:none !important}",



// Settings in the DDG Settings Panel (Classic Google-Style Theme)
  // == General ==
  // Instant Answers: Off
  // Infinite Scroll: Off
  // Open Links in a New Tab: On
  // Advertisements: Off
  // Page Break Numbers: Off
  // == Appearance ==
  // All Background Colors set to #FFFFFF
  // Font: Arial
  // New URL Style: Off
  // Title Font: Arial
  // Title Color: #1111cc
  // URL Color: #0e774a
  // URL Placement: Below Title
  // Site Icons: Off

].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();
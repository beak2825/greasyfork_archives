// ==UserScript==
// @name          Anime Girl Wallpaper
// @description	  Wallpaper
// @author        KILLEREK1337
// @include       http://kogama.com/*
// @include       https://kogama.com/*
// @include       http://*.kogama.com/*
// @include       https://*.kogama.com/*
// @license       MIT
// @run-at        document-start
// @version       Anime Girl
// @namespace https://greasyfork.org/users/1323301
// @downloadURL https://update.greasyfork.org/scripts/498871/Anime%20Girl%20Wallpaper.user.js
// @updateURL https://update.greasyfork.org/scripts/498871/Anime%20Girl%20Wallpaper.meta.js
// ==/UserScript==
(function() {var css = [
	"/*-------------------------------------------------------*/",
	"/*------------------------BODY---------------------------*/",
	"/*-------------------------------------------------------*/",
	"/*███BODY███*/",
	"",
	"  body",
	"  {",
	"    font-family: \"Montserrat Bold\" !important;",
	"  }",
	"",
	"/*-------------------------------------------------------*/",
	"/*-------------------------ID----------------------------*/",
	"/*-------------------------------------------------------*/",
	"",
	"  #content-container",
	"  {",
	"    background-image: url(https://wallpapercave.com/wp/wp2543447.jpg);",
	"    background-attachment: fixed;",
	"  }",
	"",
	"/*_____________________________________*/",
	"/*███PROFILE FEEDS███*/",
	"",
	"  #profile-news-feed ul.news-feed-thumbs > li.item",
	"  {",
	"    background-color: #13091599;",
	"    color: white;",
	"  }",
	"",
	"/*-------------------------------------------------------*/",
	"/*----------------------KLASY----------------------------*/",
	"/*-------------------------------------------------------*/",
	"",
	"  .user",
	"  {",
	"    color: white !important;",
	"    font-weight: bold;",
	"  }",
	"",
	"/*_____________________________________*/",
	"/*███INPUT FILL███*/",
	"  .input-fill",
	"  {",
	"    background-color: #00000047 !important;",
	"    color: white;",
	"  }",
	"",
	"/*_____________________________________*/",
	"/*███TEXT███*/",
	"",
	"  .text",
	"  {",
	"    color: #fff !important;",
	"  }",
	"",
	"/*_____________________________________*/",
	"/*███BUTTONS███*/",
	"",
	"  .pure-button.pure-button-primary.button-fill,",
	".pure-button.pure-pure-button-small.submit-comment.pure-button-primary",
	"  {",
	"    background-color: #faf20a;",
	"  }",
	"",
	"/*_____________________________________*/",
	"/*███GAMES AND AVATARS IMAGES███*/",
	"",
	"  .display-image",
	"  {",
	"    opacity: 0.55 !important;",
	"  }",
	"",
	"/*_____________________________________*/",
	"/*███CHAT EXTENDED SIDE███*/",
	"",
	"  ._1Yhgq",
	"  {",
	"    background-image: url() !important;",
	"  }",
	"",
	"/*_____________________________________*/",
	"/*███REPORT BUTTON███*/",
	"",
	"  .report-button-toggle.pure-button.pure-button-secondary.pure-button-xsmall",
	"  {",
	"    background-color: #ff00003b !important;",
	"    color: #ffffffa3 !important;",
	"  }",
	"",
	"  .report-button-types",
	"  {",
	"    color: #faf20a !important;",
	"    background-color: #c16b6be0 !important;",
	"  }",
	"",
	"/*_____________________________________*/",
	"/*███USER PROFILE HEADER███*/",
	"",
	"  .username",
	"  {",
	"    text-align: center !important;",
	"    margin-bottom: 2.5% !important;",
	"    border-bottom: 10px !important;",
	"  }",
	"",
	"  .progression",
	"  {",
	"    margin-left: 32.5% !important;",
	"  }",
	"",
	"  .level",
	"  {",
	"    background-color: #fff0 !important;",
	"  }",
	"",
	"  #mobile-page #profile-page .section-top .username h2",
	"  {",
	"    line-height: 6.5rem;",
	"    font-size: 5rem;",
	"  }"
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
const fetch_ = fetch;

async function patchStyle(patches) {
  const req = await fetch_(document.evaluate("//*[contains(@href, 'app-sass')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.href);
  let text = await req.text();
  for (const patch of patches) {
    if (!patch.regex.test(text)) continue;
    text = text.replaceAll(patch.regex, patch.replacer);
  };
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = `data:,${encodeURIComponent(text)}`;
  document.documentElement.appendChild(style);
};

addEventListener("DOMContentLoaded", () => {
  patchStyle([{
    regex: /^(#[3]{2}[3]{1})$/gm,
    replacer: "transparent"
  }]);
});
// ==UserScript==
// @name          Eren wallpaper
// @namespace     http://userstyles.org
// @description	  Eren on kogama
// @author        Mir Tasnim Noor Sifat
// @homepage      https://userstyles.org/styles/261012
// @include       http://kogama.com/*
// @include       https://kogama.com/*
// @include       http://*.kogama.com/*
// @include       https://*.kogama.com/*
// @run-at        document-start
// @version       0.20230315082428
// @downloadURL https://update.greasyfork.org/scripts/461749/Eren%20wallpaper.user.js
// @updateURL https://update.greasyfork.org/scripts/461749/Eren%20wallpaper.meta.js
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
	"    background-image: url(https://img.guildedcdn.com/ContentMediaGenericFiles/4ed7d2c6c36a72d3bb09d9e9172a7df7-Full.webp?w=700&h=350);",
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
	"    background-image: url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4bsWwp8fIoqegrbhDYLEz9pUhZ5OELtS0WQ&usqp=CAU) !important;",
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
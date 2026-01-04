// ==UserScript==
// @name        Fix Dark Text on AvistaZ Network Forums
// @namespace   https://avistaz.to/profile/dryeyes
// @description Fix dark text on AvistaZ Network forum pages and within torrent descriptions when using the Dark theme.
// @match       *://*.cinemaz.to/*
// @match       *://*.avistaz.to/*
// @match       *://*.privatehd.to/*
// @version     0.1.0
// @grant       none
// @locale      English (en)
// @downloadURL https://update.greasyfork.org/scripts/36998/Fix%20Dark%20Text%20on%20AvistaZ%20Network%20Forums.user.js
// @updateURL https://update.greasyfork.org/scripts/36998/Fix%20Dark%20Text%20on%20AvistaZ%20Network%20Forums.meta.js
// ==/UserScript==
(function(){
  'use strict';

  let cleanedUrl = window.location.href.replace(/(#.*)$/, '');
  let usingDarkTheme;

	function addGlobalStyle(css) {
		try {
			let elmHead, elmStyle;
			elmHead = document.getElementsByTagName('head')[0];
			elmStyle = document.createElement('style');
			elmStyle.type = 'text/css';
			elmHead.appendChild(elmStyle);
			elmStyle.innerHTML = css;
		} catch (e) {
			if (!document.styleSheets.length) {
				document.createStyleSheet();
			}
			document.styleSheets[0].cssText += css;
		}
	}

  function changeDarkSpansToWhite() {
    let spans = document.querySelectorAll(`span[style*="#0000ff;"],span[style*="rgb(51,0,255)"],
                                          span[style*="#000000;"]`);
      Array.prototype.forEach.call(spans, elm => { elm.style.color = "rgb(204,204,204)"; } );
    }

  function onLoadHandler() {
    console.log("FixForumDarkText Load event occurred:", cleanedUrl);

    let bodyStyle = window.getComputedStyle(document.body);
    let backgroundColor = bodyStyle.backgroundColor.trim();
    console.log("body background.color", backgroundColor);
    usingDarkTheme = (backgroundColor === "rgba(0, 0, 0, 0)" ||
                      backgroundColor === "rgb(34, 34, 34)");
    console.log("usingDarkTheme:", usingDarkTheme);

    if (usingDarkTheme) {
      changeDarkSpansToWhite();
      addGlobalStyle(`.ipsStreamItem_snippet .ipsType_richText {
        color: #ffffff;
      }`);
    }
  }
  console.log("UserScript running");

  window.addEventListener('load', onLoadHandler, false);
})();
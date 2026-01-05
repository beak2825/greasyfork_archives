// ==UserScript==
// @name         Page Tweaks
// @namespace    skoshy.com
// @version      0.6.3
// @description  Tweaks for different webpages
// @author       Stefan Koshy
// @match        http*://*.okcupid.com/*
// @match        http*://*.mail.google.com/*
// @match        http*://*.discordapp.com/*
// @match        http*://*.common.test/*
// @match        http*://*.cmn-admin-staging.herokuapp.com/*
// @match        http*://*.app.common.com/*
// @match        http*://*.mynoise.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23104/Page%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/23104/Page%20Tweaks.meta.js
// ==/UserScript==

(function() {
  "use strict";
  var scriptId = "page-tweaks";
  var currentSite;
  let styleEl;
  var url = document.documentURI;

  var css = {};
  var js = {};
  var favicon = {};
  css.okcupid = `
        #feedback_banner {
            line-height: 28px;
            width: 40%;
            display: table;
            border-radius: 40px;
            margin: 0 auto;
            background: rgba(0, 210, 128,.8);
        }

        #feedback_banner.show {
            top: 60px;
        }

        #feedback_banner > .inner {
            display: table-cell;
            vertical-align: middle;
        }
    `;

  css.gmail = `
        .iY .Bu.y3 /* email sidebar */
        {display: none;}

/* Top banner */
header[role="banner"] { height: 0px; overflow: hidden; opacity: 0; transition: all 0.2s; position: fixed; top: 0; width: 100%; background: white !important; }
header[role="banner"]:hover, header[role="banner"]:focus, header[role="banner"]:focus-within { height: auto; overflow: visible; opacity: 1; }

/* Main Gmail window */
.S4 { height: calc(100vh) !important; }
    `;

  css.discord = `
@media (prefers-color-scheme: light) {
html, html.theme-dark {
    --header-primary: #060607;
    --header-secondary: #4f5660;
    --text-normal: #2e3338;
    --text-muted: #747f8d;
    --text-link: #0067e0;
    --channels-default: #6a7480;
    --interactive-normal: #4f5660;
    --interactive-hover: #2e3338;
    --interactive-active: #060607;
    --interactive-muted: #c7ccd1;
    --background-primary: #fff;
    --background-secondary: #f2f3f5;
    --background-secondary-alt: #ebedef;
    --background-tertiary: #e3e5e8;
    --background-accent: #747f8d;
    --background-floating: #fff;
    --background-mobile-primary: #f8f9f9;
    --background-mobile-secondary: #fff;
    --background-modifier-hover: rgba(116,127,141,0.08);
    --background-modifier-active: rgba(116,127,141,0.16);
    --background-modifier-selected: rgba(116,127,141,0.24);
    --background-modifier-accent: rgba(6,6,7,0.08);
    --background-mentioned: rgba(250,166,26,0.1);
    --background-mentioned-hover: rgba(250,166,26,0.2);
    --background-message-hover: rgba(6,6,7,0.02);
    --elevation-stroke: 0 0 0 1px rgba(6,6,7,0.08);
    --elevation-low: 0 1px 0 rgba(6,6,7,0.1),0 1.5px 0 rgba(6,6,7,0.025),0 2px 0 rgba(6,6,7,0.025);
    --elevation-medium: 0 4px 4px rgba(0,0,0,0.08);
    --elevation-high: 0 8px 16px rgba(0,0,0,0.16);
    --logo-primary: #7289da;
    --guild-header-text-shadow: 0 1px 1px hsla(0,0%,100%,0.4);
    --channeltextarea-background: #ebedef;
    --activity-card-background: #fff;
    --textbox-markdown-syntax: #6a7480;
    --deprecated-card-bg: #f8f9f9;
    --deprecated-card-editable-bg: rgba(246,246,247,0.6);
    --deprecated-store-bg: #f8f9f9;
    --deprecated-quickswitcher-input-background: #fff;
    --deprecated-quickswitcher-input-placeholder: rgba(79,84,92,0.3);
    --deprecated-text-input-bg: rgba(79,84,92,0.02);
    --deprecated-text-input-border: rgba(79,84,92,0.3);
    --deprecated-text-input-border-hover: #b9bbbe;
    --deprecated-text-input-border-disabled: #dcddde;
    --deprecated-text-input-prefix: #b9bbbe;
}
}
`;

    js.mynoise = () => {
        document.body.addEventListener("keydown", function(event) {
            if (event.keyCode === 32 && !['input', 'select', 'button', 'option', 'textarea'].includes(event.target.nodeName.toLowerCase())) { // space key
                event.preventDefault();
                window.toggleMute();
            }
        });
    };

  favicon.commonDev = "https://i.imgur.com/wWEEkvX.png";
  favicon.commonStg = "https://i.imgur.com/37zUe4Z.png";
  favicon.commonPrd = "https://i.imgur.com/p0YSAgJ.png";

  function init() {
    getSetCurrentSite();

    if (currentSite) {
      console.log("Adding page tweaks for: " + currentSite);
      addGlobalStyle(css[currentSite], scriptId);
      addFavicon(favicon[currentSite], scriptId);

      if (js[currentSite]) js[currentSite]();
    }
  }

  function getSetCurrentSite() {
    if (url.indexOf("okcupid.com") != -1) currentSite = "okcupid";
    if (url.indexOf("mail.google.com") != -1) currentSite = "gmail";
    if (url.indexOf("discordapp.com") != -1) currentSite = "discord";
    if (url.indexOf("common.test") != -1) currentSite = "commonDev";
    if (url.indexOf("cmn-admin-staging.herokuapp.com") != -1)
      currentSite = "commonStg";
    if (url.indexOf("app.common.com") != -1) currentSite = "commonPrd";
    if (url.indexOf("mynoise.net") != -1) currentSite = "mynoise";
  }

  function addGlobalStyle(css, id) {
    var head, style;
    head = document.getElementsByTagName("head")[0];
    if (!head) {
      return;
    }
    styleEl = document.createElement("style");
    styleEl.type = "text/css";
    styleEl.innerHTML = css;
    styleEl.id = id;
    head.appendChild(styleEl);
  }

  function addFavicon(favicon, id) {
    if (!favicon) return;
    var head, style;
    head = document.getElementsByTagName("head")[0];
    if (!head) return;
    var link =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = favicon;
    link.id = id;
    head.appendChild(link);
  }

  function isStyleElEnabled() {
    return styleEl.type === "text/css";
  }

  function interval() {
    let darkReaderStyles = document.querySelectorAll("style.darkreader");
    if (url.indexOf("discordapp.com")) {
      if (isStyleElEnabled() && darkReaderStyles.length) {
        styleEl.type = "disabled";
        darkReaderStyles.forEach(darkReaderStyle => {
          darkReaderStyle.type = "disabled";
        });
      } else if (!isStyleElEnabled() && !darkReaderStyles.length) {
        styleEl.type = "text/css";
      }
    }
  }

  init();
  setInterval(interval, 1000);
})();

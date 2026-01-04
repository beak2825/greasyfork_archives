// ==UserScript==
// @name          Spotify Cleaner
// @namespace     http://tampermonkey.net/
// @version       1.8.7
// @description   This script removes the buttons next to the avatar on Spotify Web.
// @author       dacyh
// @match        *://open.spotify.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @grant         none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/471278/Spotify%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/471278/Spotify%20Cleaner.meta.js
// ==/UserScript==

(function() {
let css = `

/*hide free users upgrade to premium button 1*/
    .ButtonInner-sc-14ud5tc-0.fcsOIN.encore-inverted-light-set {
        display: none;
    }

/*hide free users download app button*/
    .ButtonInner-sc-14ud5tc-0.gDlqhe.encore-over-media-set {
        display: none;
    }

/*hide premium users download app button*/
    .ButtonInner-sc-14ud5tc-0.kVKSMm {
        display: none;
    }
/*blue box*/
    .tippy-content {
        display: none;
    }
/*blue box*/
    .tippy-box {
        display: none;
    }
/*blue box*/
    .y9bkifFKNExwjaoINLm9 {
        display: none;
    }
/*artist panel*/
    .GTmlByXpJj7V6AwVq0Vk.ouorHKa6NI5cm666H3tp {
        display: none;
    }
/*also artist panel*/
    .QkOkUShDYWFx5Cz40Bcn {
        display: none;
    }
/*tour panel*/
    .IgTMXVbZtqtZwu3GZASd {
        display: none;
    }
/*extra*/
    mWj8N7D_OlsbDgtQx5GW.ig17e2GN63Tgv3JeRoJF {
        display: none;
    }

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
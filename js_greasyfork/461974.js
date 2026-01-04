// ==UserScript==
// @name         Blizzard Forum Fixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modify and overwrite the style of the Blizzard Forums
// @author       Luke-L
// @match        https://*forums.blizzard.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/461974/Blizzard%20Forum%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/461974/Blizzard%20Forum%20Fixer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle(`
    :host nav {
      backdrop-filter: blur(var(--navbar-background-blur));
      background: #44413f;
    }

    /* html body blz-nav {
      background: #44413f;
      background-color: #44413f;
    } */

    .b-welcome-banner-contents {
        height: 160px;
        display: flex;
        max-width: 1250px;
        margin: 0 auto;
        box-sizing: border-box;
        padding-top: 40px;
        flex-direction: column;
        justify-content: center;
    }

    body.blizzard-homepage {
        background: #111217;
        background-color: #111217;
    }

    .wrap, #main-outlet {
        max-width: 1600px;
        padding: 10px 10px;
    }

    header.d-header {
    border-radius: 12px;
    margin-left: auto;
    margin-right: auto;
    width:1600px;
    background-color: rgb(45 45 45 / 100%);
    box-shadow: 0px 0px 6px black;
    }

    html body blz-nav {
      display: none;
    }
    .d-header-wrap {
        margin-top: 30px;
    }
    .b-welcome-banner {
        background-position: 50% 20%;
    }
  `);
})();
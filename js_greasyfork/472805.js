// ==UserScript==
// @name         Zen PC Mode
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  zen mode for concentration
// @author       13pake
// @match        https://*.jstris.jezevec10.com/?play=8
// @icon         https://jstris.jezevec10.com/res/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472805/Zen%20PC%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/472805/Zen%20PC%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const style = `
      #gameSlots, #frLobby, #chatExpand {
          display: none;
      }

      a {
          color: #f7821c;
      }
      a:focus, a:hover {
          color: #f7821c;
      }

      #BG_only {
          background-image: url("https://i.imgur.com/uMrsMXh.jpeg");
          background-repeat: no-repeat;
          background-position: bottom right -50px;
          background-size: 1250px;
      }

      ::-webkit-scrollbar {
          background: transparent;
      }

      #main {
          // width: 100%;
      }

      #chatBox {
          background-color: rgba(0,0,0,0.75);
          border: 2px solid #393939;
          padding: 1rem;
          max-height: 50rem;
      }

      #chatInput {
          background-color: rgba(0,0,0,0.75);
          border: 1px solid #111;
      }

      .navbar-default {
          // background-color: #111;
          background-color: rgba(55, 90, 127, 0.75); // #375a7f
      }

      button {
          color: #808080;
          background-color: #222;
          border: none;
          padding: 0.3rem 1rem;
      }
      button#res::after {
          color: #808080 !important;
      }

      #connectStatus {
          color: #222;
      }

    `;

    GM_addStyle(style);

})();
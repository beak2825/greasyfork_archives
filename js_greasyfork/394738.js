// ==UserScript==
// @name immodem.CSS
// @namespace immodem.poste-immo.intra.laposte.fr
// @version 0.0.5
// @description Test for UserCSS on immodem
// @author CoStiC
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/394738/immodemCSS.user.js
// @updateURL https://update.greasyfork.org/scripts/394738/immodemCSS.meta.js
// ==/UserScript==

(function() {
let css = "";
css += `

@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
@import url('https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap');

`;
if ((location.hostname === "immodem.poste-immo.intra.laposte.fr" || location.hostname.endsWith(".immodem.poste-immo.intra.laposte.fr"))) {
  css += `

      ::-webkit-scrollbar {
          width: 6px;
      }

      ::-webkit-scrollbar-thumb {
          /*background: #666;*/
          background: linear-gradient(to right, #4c4c4c 0%, #595959 12%, #666666 25%, #474747 39%, #2c2c2c 50%, #000000 51%, #111111 60%, #2b2b2b 76%, #1c1c1c 91%, #131313 100%);
          border-radius: 3px;
      }
      ::-webkit-scrollbar-track {
          background: #eee;
          border-radius: 3px;
          box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, .25);
      }

      html,
      body {
          font-size: 100%;
          font-family: Roboto;
      }

      body {
          padding-top: 0;
      }

      #page-content-wrapper {
          height: 100vh;
      }

      [role="navigation"].navbar {
          display: none;
      }

      .left-menu {
          overflow: hidden;
      }

      [vertilize-container] {
          display: flex;
          flex-flow: row nowrap;
      }

      .stepBucket {
          flex: 1;
          height: calc(100vh - 150px);
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .25);
          border: 1px solid #ccc;
          margin: 0 8px;
          display: flex;
          flex-flow: column nowrap
      }

      .stepBucket > h4 {
          background: #DDD;
          margin: 0;
          padding: 16px 8px;
          color: #555;
          text-shadow: 0 1px 0 #FFF;
      }

      .tasksContainer {
          display: flex;
          flex-flow: column nowrap;
          overflow: hidden;
          overflow-y: auto;
          padding: 0 6px;
          scrollbar-width: thin;
          scollbar-height: thin;
          justify-content: flex-start;
          margin: 6px
      }

      .tasksContainer > .card {
          flex: 0 0 auto;
          width: 100%;
          padding: 0 6px;
      }

      .thumbnail,
      .thumbnail .caption {
          padding: 0;
      }

      .thumbnail .caption .row {
          margin: 0;
          background: #CCC;
      }

      .taskCard {
          height: auto !important;
          border-radius: 2px;
      }

      .taskCard:hover {
          border-radius: 2px;
      }

      .taskCard .itemStep {
          display: none;
      }

      .stepBucket > h4 {
          text-align: center;
          width: 100%;
      }

      .ref-color {
          font-family: "roboto mono";
          letter-spacing: .1em;
          background: none;
      }

      .text-primary {
          color: #555;
          text-shadow: 0 1px 0 #FFF, 0 -1px 4px rgba(0, 0, 0, .25);
      }

      .taskInfos {
          font-size: 12px;
          margin: 4px;
          padding: 8px;
          display: flex;
          justify-content: space-between;
      }

      .infoLabel {
          flex: 1;
          font-weight: bold;
          margin-right: 16px;
          border-bottom: 1px solid #ccc;
      }

      .infoValue {
          flex: 2;
          border-bottom: 1px solid #ccc;
      }

      .remainingTime {
          text-align: center;
      }

      [data-step="ValidationCP"] {
          background: #FF5722;
          order: 1;
      }
      [data-step="Validationtechnique"] {
          background: #FFC107;
          order: 2;
      }
      [data-step="Réalisation"] {
          background: #FFEB3B;
          order: 3;
      }
      [data-step="Réceptiondelademande"] {
          background: #AED581;
          order: 4;
      }

      /* ######################################################## FORMULAIRE ########################################################### */
      input,
      .input-group-addon {
          background: none !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          border-width: 0 0 1px 0 !important;
      }
      .input-group-addon {
          font-weight: bold;
      }

      .panel-info {
          border: none !important;
          border-radius: 0 !important;
      }

      textarea.form-control {
          border: 1px solid #eee !important;
          border-radius: 0 !important;
          background: none !important;
      }

      textarea.form-control[disabled="disabled"] {
          background: #EEE !important;
      }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

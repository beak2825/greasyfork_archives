// ==UserScript==
// @name Goodreads: Available Reads Styling
// @namespace github.com/holyspiritomb
// @version 0.0.15
// @description Modifications to make Available Reads look better for my own use, supplementing my main Goodreads style.
// @author holyspiritomb
// @homepageURL https://github.com/holyspiritomb/userstyles/blob/main/goodreads/available-reads-extension.user.css
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:https://www\.goodreads\.com/(?!book/add_to_books_widget/).*)$/
// @include /^(?:https://www\.goodreads\.com/book/(?!add_to_books_widget/).*)$/
// @downloadURL https://update.greasyfork.org/scripts/450757/Goodreads%3A%20Available%20Reads%20Styling.user.js
// @updateURL https://update.greasyfork.org/scripts/450757/Goodreads%3A%20Available%20Reads%20Styling.meta.js
// ==/UserScript==

(function() {
let css = "";
if (new RegExp("^(?:https://www\\.goodreads\\.com/(?!book/add_to_books_widget/).*)\$").test(location.href)) {
  css += `
      img.AGaudio {
          display: inline-block;
          height: calc(inherit/1.25);
          width: calc(inherit/1.25);
      }
      html[data-darkreader-scheme='dark'] img.AGaudio,
      html[data-theme='dark'] img.AGaudio {
          filter: invert(100%);
      }
      tbody#booksBody {
          box-sizing: border-box;
      }

      /* display which library has the book */
      td.AGcol > div::before {
          content: attr(class) ':';
          font-weight: bold;
      }
      td.AGAVAILSINGLEBOOK > div::before,
      #libby-results > div::before {
          content: attr(class) ':';
          font-weight: bold;
          flex-basis: 6.5em;
      }
  `;
}
if (new RegExp("^(?:https://www\\.goodreads\\.com/book/(?!add_to_books_widget/).*)\$").test(location.href)) {
  css += `
      div#AGtable {
          display: block;
      }
      #libby-results {
          display: flex;
          flex-direction: column;
      }
      div#AGtable,
      #libby-results {
          max-height: 30vh !important;
          overflow-y: auto !important;
          visibility: visible;
          box-sizing: border-box;
          backdrop-filter: blur(2px);
          border-radius: 5px;
          font-size: 14pt;
      }
      div#AGtable table tr td {
          display: flex;
          flex-direction: column;
      }
      html.mobile div#AGtable,
      html.mobile #libby-results {
          width: 70vw !important;
          font-size: 12pt;
      }

      div#AGtable td.AGAVAILbookDetails {
          box-sizing: border-box;
          visibility: visible;
      }
      td.AGAVAILSINGLEBOOK > div,
      #libby-results > div {
          display: flex;
          flex-direction: row;
      }
      html :is(div#AGtable>table, div#AGtable>table>tbody, div#AGtable>table>tbody>tr) {
          width: 100% !important;
          visibility: visible;
          box-sizing: border-box;
      }
      html.mobile :is(div#AGtable>table, div#AGtable>table>tbody, div#AGtable>table>tbody>tr) {
          height: 100% !important;
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

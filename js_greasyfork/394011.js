// ==UserScript==
// @name         Apterous Dark Mode
// @namespace    http://www.mattmorrison.co.uk
// @version      0.1
// @description  A dark mode for apterous; rest those gentle eyes of yours
// @author       Matt Morrison
// @match        https://www.apterous.org/play.php*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js
// @downloadURL https://update.greasyfork.org/scripts/394011/Apterous%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/394011/Apterous%20Dark%20Mode.meta.js
// ==/UserScript==

const desiredStyles = `
  html, .messageBox, .main-panel, .messageBox .chat-history, .challenges-panel, .main-panel-right-subpanel, .games-in-progress, .solo-player-container {background-color: #333; color: #ccc; border: none;}
  .main-panel {border-top: 1px solid #555;}
  .messageBox a, a:visited.evergreen {color: #ffd;}
  .main-panel-selector li {background-color: #555; border-color: #666; color: #bbb;}
  .main-panel-selector li.main-panel-tab-selected {background-color: #7a7a7a; color: #ddd;}
  h2 {background-image: none; background-color: transparent;}
  .chat-component {background-color: transparent; border: none;}
  .chat-message-welcome {background-color: #1c4d73;}
  .chat-message-game-start {background-color: #1d4177;}
  .chat-message-chat-game {background-color: #4f280d;}
  .chat-message-loginout {background-color: #2d582d;}
  .chat-component .chat-history .typing-list {background-color: #555; color: #aaa;}
  .chat-message-say p {background-color: transparent; min-height: 0px; border: none;}
  .messageBox .textMessage, .numbers-round-panel .numbers-round-notes-in-round textarea, form.numbers-round-declaration input[type='number'], .messageBox .games-in-progress-button-container button {background-color: #555; color: #ccc;}
  .messageBox .textMessage {border: none; padding: 3px;}
  .challenges-button-bar button, .banter-dismiss {background-color: #555; color: #aaa;}
  .challenges-button-bar button[disabled] {opacity: 0.5;}
  .challenge {background-color: #444;}
  .challenge-selected {background-color: #1e3076;}
  .roster-status-available {background-color: #591736;}
  .roster-status-bot {background-color: transparent;}
  .roster-status-in-game {background-color: #225918;}
  .player-profile {background-image: none; background-color: transparent; border: none;}
  .player-profile-back-to-challenges {background-color: #555;}
  .game-title-panel {background-color: transparent; border-bottom-color: #555;}
  .game-panel-next-action-container {background-color: transparent; border-top-color: #555;}
  th.game-summary-meta {background-color: #444;}
  td.game-summary-meta {background-color: #555;}
  th.game-summary-points {background-color: #265408;}
  td.game-summary-points {background-color: #316b0b;}
  th.game-summary-declaration {background-color: #133162;}
  td.game-summary-declaration-nonpick {background-color: #194180;}
  .banter-box {background-color: transparent !important; border: none;}
  .game-subtab-container {background-color: transparent; border-color: #555;}
  .game-panel-rules-iframe {background-color: #555; border: 1px solid #777;}
  .timer-bar {background-color: #555;}
  .timer-bar-fill {background-color: #194180;}
  .games-in-progress-game-table {background-color: #555;}
  .games-in-progress-game-table th {background-color: #444;}
  .games-in-progress-game-table td {border-color: #666;}
`;

waitForKeyElements(
    ".messageBox",
    addCSS_Style,
    false,
    "iframe.exocoet"
);

function addCSS_Style (jNode) {
    var frmBody = jNode.closest ("body");
    frmBody.append(`<style>${desiredStyles}</style>`);
}
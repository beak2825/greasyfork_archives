// ==UserScript==
// @name         Dominion UI
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A more stylish Dominion Online
// @author       crlundy
// @match        https://dominion.games/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/390538/Dominion%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/390538/Dominion%20UI.meta.js
// ==/UserScript==

GM_addStyle(`
  /* General */

  *:not(.full-card):not(.mini-card):not(.micro-card):not(.landscape):not(.way-quickselect-box) {
    box-sizing: border-box !important;
  }

  .login-form, .no-login-text, .window, .kingdom-selection-window, .status-bar-border {
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    backdrop-filter: saturate(180%) blur(20px);
    background: rgba(34,34,34,0.72) !important;
    border: 1px solid rgba(125,125,125,0.5) !important;
    border-radius: 8px !important;
    box-shadow: 0 0 0 1px rgba(17,17,17,0.5),
                0 1px 8px rgba(17,17,17,0.7),
                0 24px 32px rgba(17,17,17,0.7) !important;
    font-family: 'Arial', sans-serif !important;
  }


  /* Login */

  .login-page {
    background: url("images/large/base.jpg") 0% 0% / cover no-repeat !important;
  }

  .home-screen {
    align-items: center;
    display: flex;
    flex-direction: column;
  }

  .title-logo {
    left: auto !important;
    position: inherit !important;
    transform: none !important;
  }

  img.title-logo {
    filter: drop-shadow(0 4px 7px rgba(17, 17, 17, 0.7));
    height: 40vh;
    margin: 5vh 0;
    max-height: 350px;
  }

  .login-form, .no-login-text {
    display: flex;
    flex-flow: column wrap;
    height: auto !important;
    left: auto !important;
    max-width: 600px;
    padding: 2em;
    position: inherit !important;
    top: auto !important;
    width: auto !important;
  }

  .login-form br {
    display: none;
  }

  .login-form input {
    flex: 1 100%;
    font-size: 1.3rem !important;
    margin: 0 !important;
    position: inherit !important;
    width: auto !important;
  }

  .login-form input[type=password] {
    margin-top: 1em !important;
  }

  .login-form input[type=submit] {
    margin-top: 1.6em !important;
  }

  .login-form input[type=button] {
    margin-top: 1em !important;
  }

  .login-form input[type=text], .login-form input[type=password] {
    background: rgba(0,0,0,0.6) !important;
    border: 1px solid rgb(0,0,0) !important;
    border-radius: 4px !important;
    box-shadow: 0 0 0 0 rgba(125,125,125,0);
    font-family: 'Arial', sans-serif !important;
    letter-spacing: 0.04em;
    transition: all 300ms ease !important;
  }

  .login-form input[type=text]:focus, .login-form input[type=password]:focus {
    border: 1px solid rgba(255,255,255,0.8) !important;
    box-shadow: 0 0 10px rgba(255,255,255,0.8);
  }

  .login-form input[type=text].ng-touched.ng-empty, .login-form input[type=password].ng-touched.ng-empty {
    border: 1px solid rgba(255,75,0,0.8) !important;
  }

  .login-button {
    background: rgba(140,140,140,0.6) !important;
    border: none !important;
    border-radius: 0.3em;
    box-shadow: inset 0 2px 2px -2px rgba(200,200,200,0.6);
    font-family: 'TrajanPro-bold', 'Arial', sans-serif !important;
    padding: 0.4em 0.2em 0.2em;
    transition: background 100ms ease !important;
  }

  .login-button.legal-login:hover {
    background: rgba(160,160,160,0.6) !important;
  }

  .login-button[type=submit]:not(.legal-login) {
    background: rgba(100,100,100,0.8) !important;
    color: rgb(120,120,120) !important;
    cursor: not-allowed;
  }

  .no-login-text {
    font-size: 1.3rem !important;
  }

  .no-login-text button {
    margin: 0 auto;
  }

  .version-string, .login-links-container, .login-links, .forum-string {
    bottom: 0 !important;
    font-family: 'Arial', sans-serif !important;
  }

  .version-string, .login-links, .forum-string {
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    backdrop-filter: saturate(180%) blur(20px);
    background: rgba(34,34,34,0.72) !important;
    border: 1px solid rgba(125,125,125,0.5) !important;
    border-bottom: none !important;
    border-radius: 8px 8px 0 0 !important;
    box-shadow: 0 0 0 1px rgba(17,17,17,0.5) !important;
    padding: .8vh .6vw 1vh .6vw !important;
  }

  .version-string:hover, .login-link:hover, .forum-string:hover {
    text-decoration: underline;
  }


  /* Lobby */

  .lobby-page > div {
    height: 100%;
  }

  .main-lobby-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }

  .spear-left, .spear-right {
    z-index: 1 !important;
  }

  ul.lobby-tabs {
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    backdrop-filter: saturate(180%) blur(20px);
    background: rgba(17,17,17,0.82) !important;
    flex: 0 0 auto;
    margin: 0 !important;
  }

  .lobby-tabs .tab-button {
    background: none !important;
    border: none !important;
    border-radius: 8px;
    font-family: 'TrajanPro-bold', 'Arial', sans-serif !important;
    font-size: 1.3rem;
    margin: 0.5em 0.1em !important;
    padding: 0.6em 0.9em 0.4em !important;
    position: relative;
  }

  .lobby-tabs .tab-button::before {
    background: rgb(200,200,200);
    border-radius: inherit;
    bottom: 0;
    content: '';
    left: 0;
    opacity: 0;
    position: absolute;
    right: 0;
    top: 0;
    transform: scale(0);
    transition: all 150ms ease-in-out;
    z-index: -1;
  }

  .lobby-tabs .tab-button:hover::before {
    opacity: 0.1;
    transform: scale(1);
  }

  .lobby-tabs .tab-button:active::before {
    opacity: 0.15;
    transform: scale(1);
  }

  .lobby-tabs .tab-button.selected::before {
    opacity: 0.22;
    transform: scale(1);
  }

  .window-container {
    align-items: center;
    display: flex;
    height: 100% !important;
    justify-items: center;
    position: static !important;
    width: 100% !important;
  }

  .lobby-button, .lobby-button:hover {
    border: none !important;
    border-radius: 0.3em;
    font-family: 'TrajanPro-bold', 'Arial', sans-serif !important;
    transition: background 100ms ease !important;
  }

  .lobby-button {
    background: rgba(140,140,140,0.6) !important;
    box-shadow: inset 0 2px 2px -2px rgba(200,200,200,0.6);
  }

  .lobby-button:hover {
    background: rgba(160,160,160,0.6) !important;
  }


  /* Inbox */

  .window.inbox {
    padding: 0 !important;
  }

  .window.inbox > div {
    height: 100%;
  }

  .inbox-page {
    display: flex;
    height: 100%;
  }

  message-list {
    flex: 2;
  }

  message-view {
    flex: 5;
  }

  .message-list, .message-view {
    left: auto !important;
    position: inherit !important;
    width: auto !important;
  }

  .message-list {
    border-radius: 8px 0 0 8px;
    border-right: 1px solid rgba(160,160,160,0.7);
    height: 100% !important;
    overflow: auto;
  }

  .message-list-header {
    border: none !important;
    font-family: 'TrajanPro-bold', 'Arial', sans-serif !important;
    font-size: 2rem !important;
    margin: 0 0 16px !important;
    padding: 20px 16px 16px;
    top: 0;
    z-index: 9999 !important;
  }

  .message-list-item {
    border-top: 1px solid rgba(160,160,160,0.2);
    font-size: 1.3rem;
    margin: 0 1.2em 0 1.6em !important;
    padding: 0.6em 0;
    position: relative;
    z-index: 1;
  }

  .message-list-header + div > .message-list-item {
    border-top: 1px solid rgba(0,0,0,0);
  }

  .message-list-item:not(.has-read):not(.selected-message)::before {
    background-color: #00a3ff;
    border-radius: 50%;
    content: '';
    height: 0.5em;
    left: -0.9em;
    position: absolute;
    top: 0.8em;
    width: 0.5em;
  }

  .message-list-item:not(.selected-message):hover {
    color: #bbbbbb !important;
  }

  .message-list-item.selected-message {
    background-color: #00a3ff;
    border-radius: 0.7em;
    border-top: 1px solid rgba(0,0,0,0);
    color: #ffffff !important;
    cursor: default !important;
    font-style: inherit !important;
    font-weight: inherit !important;
    margin: 0 0.6em !important;
    padding: 0.6em 0.6em 0.6em 1em;
  }

  .message-list-item.has-read {
    color: inherit !important;
  }

  .message-view {
    background: rgba(20,20,20,0.5);
    border-radius: 0 8px 8px 0;
    display: flex;
    font-size: 1.3rem !important;
    height: 100% !important;
    padding: 2rem 2rem 6rem;
  }

  .message-view > div {
    overflow: auto;
  }

  .message-view br {
    display: none;
  }

  .message-subject {
    border-bottom: 1.5px solid rgba(160,160,160,0.7);
    font-size: 1.8rem !important;
    margin-bottom: 0.8em;
    padding-bottom: 0.7em;
  }

  .message-view p {
    letter-spacing: 0.01em;
    line-height: 1.2 !important;
    margin: 0 0 1em !important;
  }

  .inbox-page a, .inbox-page .mail-action {
    color: #00a3ff !important;
    text-decoration: none !important;
  }

  .inbox-page a:hover, .inbox-page .mail-action:hover {
    color: #00a3ff !important;
    text-decoration: underline !important;
  }

  .inbox-page .lobby-button {
    font-size: 1.2rem !important;
    padding: 0.6em 0.8em 0.4em;
  }


  /* Matching */

  .window.matching {
    flex: 0 1 90%;
    height: 90%;
    max-width: 1400px;
    overflow: auto !important;
    padding: 1rem !important;
  }

  .window.matching > div {
    height: 100% !important;
  }

  .automatch-page-table {
    border-collapse: collapse !important;
    display: block;
    height: 100% !important;
  }

  .automatch-page-table > tbody {
    display: block;
    height: 100%;
  }

  .automatch-page-table > tbody > tr {
    display: flex;
    height: 100% !important;
  }

  .automatch-column {
    flex: 1 0;
    height: 100% !important;
    margin-right: 0.5rem;
    max-height: none !important;
    max-width: none !important;
    min-height: auto !important;
    min-width: auto !important;
    overflow: auto;
  }

  .automatch-column + .automatch-column {
    margin-left: 0.5rem;
    margin-right: 0rem;
  }

  .automatch-page {
    background: rgba(20,20,20,0.5);
    border-radius: 1rem;
    padding: 1.5rem;
  }

  botmatch .automatch-page {
    margin-top: 1rem;
  }

  .automatch-fieldset {
    border: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .automatch-legend {
    color: #ffffff;
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0 0.7rem 1rem !important;
    padding: 0 !important;
  }

  .automatch-legend-link {
    border-radius: 50%;
    display: inline-block !important;
    font-size: inherit !important;
    height: 1.2em;
    line-height: 1.2em;
    margin-left: 0.5em;
    position: relative;
    text-align: center;
    transition: all 100ms ease-in-out;
    width: 1.2em;
  }

  .automatch-legend-link::before {
    background: #00a3ff;
    border-radius: inherit;
    bottom: 0;
    content: '';
    left: 0;
    opacity: 0;
    position: absolute;
    right: 0;
    top: 0;
    transform: scale(0);
    transition: all 100ms ease-in-out;
    z-index: -1;
  }

  .automatch-legend-link:hover {
    color: #ffffff;
  }

  .automatch-legend-link:hover::before {
    opacity: 1;
    transform: scale(1);
  }

  .automatch-options-table, .automatch-friends-table {
    border-collapse: collapse !important;
    margin: 0 !important;
    width: 100%;
  }

  .automatch-options-table td, .automatch-friends-table td {
    padding: 0.3rem 0.7rem;
    font-size: 1.3rem;
  }

  .automatch-options-textcolumn {
    width: 30% !important;
  }

  .automatch-options-datacolumn.click-to-toggle span, .automatch-options-datacolumn input, .automatch-options-data {
    background: rgba(200,200,200,0);
    border: 1px solid rgba(200,200,200,0.8);
    border-radius: 5px;
    color: #ffffff;
    display: inline-block;
    padding: 0.4rem 0.8rem;
    text-align: center;
    transition: all 50ms ease-in-out;
  }

  .automatch-options-datacolumn.click-to-toggle span {
    min-width: 12rem;
  }

  .automatch-options-datacolumn input {
    min-width: 6rem;
  }

  .automatch-options-datacolumn.click-to-toggle span:hover, .automatch-options-datacolumn input:hover {
    background: rgba(200,200,200,0.1);
  }

  .automatch-options-data:hover {
    cursor: not-allowed;
  }

  .automatch-special-rules-header {
    color: #ffffff !important;
    font-size: 1.3rem !important;
    font-style: normal !important;
    font-weight: 700;
    padding-top: 1.5rem !important;
  }

  .automatch-options-table + div, .automatch-queue, .automatch-start {
    margin-top: 2rem !important;
  }

  .matching .lobby-button {
    margin: 0 !important;
    max-width: none !important;
  }

  .matching .lobby-button:not(:first-child) {
    margin-left: 1rem !important;
  }

  #dt-automatch-wrapper .automatch-button {
    min-width: auto !important;
  }

  .automatch-queue-feedback, .automatch-familiarity {
    font-size: 1.3rem;
    margin: 0 0.7rem !important;
  }

  .automatch-sizes {
    margin: 0 !important;
  }

  .automatch-botmatch-button {
    border-collapse: collapse;
    border-spacing: 0;
  }

  .automatch-friends-div {
    height: auto !important;
    max-height: none !important;
    min-height: 50% !important;
  }

  .automatch-friends-fieldset {
    display: flex;
    flex-flow: column;
  }

  .automatch-friends-fieldset .automatch-legend {
    flex: 0 1 auto;
  }

  .automatch-friends-table-container {
    flex: 1 1 auto;
    max-height: none !important;
    min-height: auto !important;
    overflow: initial !important;
  }

  .automatch-friends-table tr {
    background: rgba(200,200,200,0);
    border-radius: 0.4em;
    display: flex;
    position: relative;
    transition: background 100ms ease-in-out;
    width: 100%;
  }

  .automatch-friends-table tr:hover {
    background: rgba(200,200,200,0.2);
  }

  .automatch-friends-table .friend-activities-name-column {
    display: block;
    flex: 1 1 60%;
    max-width: none !important;
    min-widht: auto !important;
    padding-left: 1.9rem;
    width: auto !important;
  }

  .automatch-friends-table td:nth-child(2) {
    bottom: 0;
    left: 0;
    padding: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  .automatch-friends-table tr td:last-child {
    display: block;
    flex: 0 0 40%;
    text-align: left;
  }

  .automatch-friends-buttons {
    background-color: transparent !important;
    border: none;
    font-size: 0;
    height: 100%;
    padding: 0 !important;
    position: relative;
    text-align: right;
    text-transform: uppercase;
    transform: none !important;
    width: 100%;
  }

  .automatch-friends-buttons::before {
    background: #71fa78;
    border-radius: 50%;
    content: '';
    height: 0.5rem;
    left: 13px;
    position: absolute;
    top: 11px;
    width: 0.5rem;
  }


  /* Freinds List */

  .relations-page-header-container {
    position: static !important;
  }

  .relations-page-header {
    position: static !important;
    width: initial !important;
  }


  /* Table */

  .player-table {
    border-spacing: 0 0.3em !important;
  }

  .player-table td.ng-binding {
    padding: 0 0.4em !important;
  }

  /* .player-table td:not(.ng-binding):not(.dt-user) {
    display: none;
  } */

  tr:not(:hover) .player-item-kick {
    opacity: 0;
  }

  td.player-item-kick {
    background: rgba(200,200,200,0.4);
    border-radius: 2em;
    font-family: 'Arial', sans-serif;
    font-size: 60%;
    font-weight: 900;
    opacity: 1;
    padding: 0.1rem 0.7em !important;
    text-transform: uppercase;
    transition: background 300ms ease,
                opacity 100ms ease;
    vertical-align: middle;
  }

  td.player-item-kick:hover {
    background: rgba(255,20,20,0.6);
    color: white !important;
  }

  .participant-list {
    box-shadow: none !important;
  }

  .table-chat {
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  .table-chat-input {
    background: rgba(17,17,17,0.5) !important;
    border-radius: 0.3em !important;
    padding: 2% 3% !important;
    transition: background 200ms ease !important;
  }

  .table-chat-input:hover {
    background: rgba(17,17,17,0.6) !important;
  }

  .table-chat-input:focus {
    background: rgba(17,17,17,0.8) !important;
  }


  /* Sidebar */

  .side-bar {
    -webkit-backdrop-filter: blur(32px);
    backdrop-filter: blur(32px);
    background: rgba(17,17,17,0.7) !important;
    box-shadow: 0 0 12px rgba(17,17,17,0.9) !important;
  }

  .control-links-container {
    display: flex;
    justify-content: center;
    left: auto !important;
    padding: 0.5em 0 !important;
    position: static !important;
    top: auto !important;
  }

  .control-links {
    background: rgba(200,200,200,0.4) !important;
    border-left: 1.5px solid #333333;
    border-radius: 0 !important;
    display: block !important;
    left: auto !important;
    padding: 0 !important;
    transform: none !important;
  }

  .control-links:hover {
    color: #333333 !important;
    background: rgba(200,200,200,0.6) !important;
  }

  .control-links:first-child {
    border-left: none;
    border-radius: 0.3em 0 0 0.3em !important;
  }

  .control-links:last-child {
    border-radius: 0 0.3em 0.3em 0 !important;
  }

  .control-link {
    display: block !important;
    font-family: 'TrajanPro-bold' !important;
    font-size: 0.8vw !important;
    padding: 0.7em 0.8em 0.4em !important;
  }

  .control-links div {
    display: none !important;
  }

  .game-log {
    top: auto !important;
  }

  .log-line {
    line-height: 1.3 !important;
  }

  .log-coin {
    color: black !important;
    display: inline-block !important;
    font-family: Monospaced !important;
    font-size: 94%;
    font-weight: 900 !important;
    margin-left: 0.12em;
    min-width: 1.4em;
    position: relative;
    text-align: center;
    text-indent: 0 !important;
  }

  .log-coin img {
    left: 50%;
    position: absolute;
    top: 0.03em;
    transform: translateX(-50%);
    width: 1.4em;
    z-index: -1;
  }

  .log-vp {
    display: inline-block !important;
    height: 1em;
    min-width: 1em;
    position: relative;
  }

  .log-vp img {
    left: 50%;
    position: absolute;
    top: 10%;
    transform: translateX(-50%);
    width: 1em;
  }

  .log-debt {
    color: white !important;
    display: inline-block !important;
    font-family: Monospaced !important;
    font-size: 94%;
    font-weight: 900 !important;
    margin-left: 0.12em;
    min-width: 1.32em;
    position: relative;
    text-align: center;
    text-indent: 0 !important;
  }

  .log-debt img {
    height: 1.32em;
    left: 50%;
    position: absolute;
    top: -5%;
    transform: translateX(-50%);
    z-index: -1;
  }

  .game-chat-display > div {
    margin-top: 0.2em;
  }

  .game-chat-display .log-line + .log-line {
    margin-left: 0.2em;
  }


  /* Hand */

  .hand .full-card {
    z-index: 4001 !important;
  }


  /* Cards and piles */

  .play-border:hover {
    box-shadow: 0 0 20px rgba(255,255,255,0.5);
  }

  .new-card-counter-container {
    background: radial-gradient(circle at 40% 40%, rgb(255,70,60), rgb(120,0,0));
    border-radius: 26% !important;
    box-shadow: 0 2px 6px rgba(0,0,0,0.8) !important;
  }

  .embargo-counter-container {
    background: radial-gradient(circle at 40% 40%, rgb(200,70,255), rgb(95,0,120));
    border-radius: 26% !important;
    box-shadow: 0 2px 6px rgba(0,0,0,0.8) !important;
  }

  .new-card-counter-text, .embargo-counter-text {
    font-size: 93%;
    text-shadow: 0 -1px rgba(0,0,0,0.7);
  }


  /* Status bar */

  .status-bar-border {
    cursor: default !important;
    font-family: 'TrajanPro-bold' !important;
    padding: 0.2em 0.5em !important;
  }

  .storyline {
    font-family: 'Arial';
    margin-bottom: 0.3em !important;
  }

  .storyline > div {
    padding: 0 !important;
    text-indent: 0 !important;
  }


  /* Game buttons */

  .big-button-container {
    bottom: 39vh !important;
  }

  .game-button {
    border: 1px solid rgba(125,125,125,0.5) !important;
    border-radius: 6px !important;
    opacity: 1 !important;
    transition all 150ms ease-in-out;
  }

  .game-button:not(.has-background) {
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    backdrop-filter: saturate(180%) blur(20px);
    background: rgba(34,34,34,0.7) !important;
  }

  .game-button:hover {
    box-shadow: 0 0 0.6em rgba(255,255,255,0.3);
    -webkit-filter: brightness(110%) saturate(110%);
    filter: brightness(110%) saturate(110%);
  }

  .game-button:active {
    box-shadow: 0 0 0.6em rgba(255,255,255,0.3);
    -webkit-filter: brightness(80%);
    filter: brightness(80%);
  }

  .button-label {
    background: none !important;
  }

  .game-button.has-background .button-label {
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    backdrop-filter: saturate(180%) blur(20px);
    background: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0)) !important;
  }

  .button-icon {
    margin-right: 1vh;
    transform: scale(0.9);
  }


  /* Player info */

  .opponent-name {
    font-family: 'TrajanPro-bold' !important;
  }

  .opponent-vp-counter {
    font-family: 'Arial', sans-serif;
    margin-left: 0.4em;
  }


  /* Modal windows */

  .modal-window {
    -webkit-backdrop-filter: blur(32px);
    backdrop-filter: blur(32px);
    background: rgba(17,17,17,0.8) !important;
    border: none !important;
    border-radius: 10px !important;
    box-shadow: 0 14px 20px rgba(17,17,17,0.9),
                0  1px  8px rgba(17,17,17,0.8) !important;
    font-family: 'Arial', sans-serif !important;
  }

  .timeout:first-child {
    font-family: 'TrajanPro-bold' !important;
  }


  /* Reveal and study windows */

  .card-study-window, .landscape-study-window {
    animation-name: pop-in;
    animation-duration: 120ms
  }

  @keyframes pop-in {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .card-study-window .full-card, .landscape-study-window .landscape {
    box-shadow: 0 5vw 20vw rgb(0,0,0) !important;
  }

  .autoplay-radio-button {
    transform: none;
  }
`);

setInterval(function() {
  document.querySelectorAll('.game-log .log-line, .storyline').forEach((line) => {
    var oldText = line.innerHTML;

    // Coin symbol
    if (/\$\d+/g.test(oldText)) {
      line.innerHTML = line.innerHTML.replace(/\$(\d+)/g, '<span class=\"log-coin\"><img src=\"images/elements/coin.png\" alt=\"$\">$1</span>');
    }
    if (/\d+ Coins?/gi.test(oldText)) {
      line.innerHTML = line.innerHTML.replace(/(\d+) Coins?/gi, '<span class=\"log-coin\"><img src=\"images/elements/coin.png\" alt=\"$\">$1</span>');
    }

    // VP symbol
    if (/gets \d+ VP/g.test(oldText)) {
      line.innerHTML = line.innerHTML.replace(/gets (\d+) VP/g, 'gets +$1<span class=\"log-vp\"><img src=\"images/elements/victory_130.png\" alt=\"V P\"></span>');
    }
    if (/takes \d+ VP/g.test(oldText)) {
      line.innerHTML = line.innerHTML.replace(/takes (\d+) VP/g, 'takes $1<span class=\"log-vp\"><img src=\"images/elements/victory_130.png\" alt=\"V P\"></span>');
    }
    if (/VP/g.test(oldText)) {
      line.innerHTML = line.innerHTML.replace(/VP/g, '<span class=\"log-vp\"><img src=\"images/elements/victory_130.png\" alt=\"V P\"></span>');
    }

    // Debt symbol
    if (/\d+ debt/gi.test(oldText)) {
      line.innerHTML = line.innerHTML.replace(/(\d+) debt/gi, '<span class=\"log-debt\">$1<img src=\"images/elements/debt_130.png\" alt=\" Debt\"></span>');
    }
    if (/\d+ remaining/gi.test(oldText)) {
      line.innerHTML = line.innerHTML.replace(/(\d+) remaining/gi, '<span class=\"log-debt\">$1<img src=\"images/elements/debt_130.png\" alt=\" Debt\"></span> remaining');
    }

    // +1 Card token
    if (/\+Card token/gi.test(oldText)) {
      line.innerHTML = line.innerHTML.replace(/\+Card token/gi, '+1 Card token');
    }

    // +1 Action token
    if (/\+Action token/gi.test(oldText)) {
      line.innerHTML = line.innerHTML.replace(/\+Action token/gi, '+1 Action token');
    }

    // +1 Buy token
    if (/\+Buy token/gi.test(oldText)) {
      line.innerHTML = line.innerHTML.replace(/\+Buy token/gi, '+1 Buy token');
    }

    // +$1 token
    if (/\+Coin token/gi.test(oldText)) {
      line.innerHTML = line.innerHTML.replace(/\+Coin token/gi, '+<span class=\"log-coin\"><img src=\"images/elements/coin.png\" alt=\"$\">1</span> token');
    }

    // -$2 token
    if (/\-Cost token/gi.test(oldText)) {
      line.innerHTML = line.innerHTML.replace(/\-Cost token/gi, '-<span class=\"log-coin\"><img src=\"images/elements/coin.png\" alt=\"$\">2</span> Cost token');
    }

    // –1 Card token
    if (/-Card token/gi.test(oldText)) {
      line.innerHTML = line.innerHTML.replace(/-Card token/gi, '–1 Card token');
    }

    // –$1 token
    if (/-Coin token/gi.test(oldText)) {
      line.innerHTML = line.innerHTML.replace(/-Coin token/gi, '–<span class=\"log-coin\"><img src=\"images/elements/coin.png\" alt=\"$\">1</span> token');
    }
  });
}, 100);

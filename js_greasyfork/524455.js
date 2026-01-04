// ==UserScript==
// @name         Style Improvements
// @namespace    http://tampermonkey.net/
// @version      3.2.1
// @license      GPL-3.0
// @description  Simple style improvements for better player experience.
// @author       kamarov
// @match        https://tanktrouble.com/*
// @run-at       document-end
// @grant        GM_addStyle
// @require      https://update.greasyfork.org/scripts/482092/1297984/TankTrouble%20Development%20Library.js
// @downloadURL https://update.greasyfork.org/scripts/524455/Style%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/524455/Style%20Improvements.meta.js
// ==/UserScript==

GM_addStyle(`
@keyframes moveLeft {
  0% {
    transform: translateX(0) scale(1);
  }
  100% {
    transform: translateX(-60%) scale(0);
  }
}
@keyframes moveRight {
  0% {
    transform: translateX(-60%) scale(0);
  }
  100% {
    transform: translateX(0) scale(1);
  }
}
#game {
    top: 0;
}
#secondaryContent, #tertiaryContent {
    margin-top: 7px;
}
a {
    margin-top: 7px;
}
#tankinfo .content {
    background: #eee;
}
:root.dark #tankinfo .content {
    background: #292929;
}
.box .tab.topRight {
    background: #eee;
}
.box .tab.bottom {
    background: #eee;
}
.box .tab.left {
    background: #eee;
}
.box .tab.right {
    background: #eee;
}
:root.dark .box .tab.topRight {
    background: #292929 !important;
}
:root.dark .box .tab.bottom {
    background: #292929 !important;
}
:root.dark .box .tab.left {
    background: #292929 !important;
}
:root.dark .box .tab.right {
    background: #292929 !important;
}
.box.noselect .content {
    background: #eee;
}
:root.dark .box.noselect .content {
    background: #292929 !important;
}
#tankinfo table {
    background: #ddd;
    border-radius: 10px;
    border-top: 2px solid #7171712b;
    margin: 8px 0 0 0;
}
:root.dark #tankinfo table {
    background: #222;
    border-radius: 10px;
    border-top: 2px solid #10101050;
}
.adminBadge {
    top: -64px !important;
}
.banned-Icon {
    top: -129px !important;
}
#tankinfo .progress {
    background: #ddd;
}
:root.dark #tankinfo .progress {
    background: #222;
}
#tankinfo .progress .border {
    border-color: #7171712b;
}
:root.dark #tankinfo .progress .border {
    border-color: #10101050;
}
#tankinfo tr {
    background: #ddd;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
}
:root.dark #tankinfo tr {
    background: #222;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
}
#tankinfo .actions:not(.centered) {
    text-align: center;
    margin: 8px 0 0 0;
}
.actions.centered {
    margin: 8px 0 0 0;
}
#tankinfo .icon {
    top: -154px;
}
#chat form {
    border-radius: 3px;
    border: 1px solid var(--jq-borderColorDefault);
    background: rgb(255 255 255 / 80%);
    margin-left: 20px;
    padding: 1px;
    width: 249px !important;
}
#chat form .autocomplete-dropdown{
    margin-left: 255px !important;
    margin-top: -1px !important;
}
:root.dark #chat form {
    background: rgb(55 55 55 / 80%);
}
#chat.global form {
    background: #68c5ff;
    border: 1px solid #759fff;
}
#chat.user form {
    background: #08ef0a;
    border: 1px solid #01c701;
}
#chat:not(.open) form{
    z-index: -1;
    position: relative;
	  animation: moveLeft 0.1s cubic-bezier(0.79, -0.02, 0.32, 0.98) forwards;
}
#chat:is(.opening, .open) form {
    z-index: -1;
    position: relative;
    padding-right: 0;
    animation: moveRight 0.3s cubic-bezier(0.79, -0.02, 0.32, 0.98) forwards;
}
#chat:is(.opening, .open) .content, #chat:is(.opening, .open) textarea {
    width: 230px !important;
}
#chat {
    -webkit-filter: drop-shadow(0 7px 4px rgba(0, 0, 0, .5));
    filter: drop-shadow(0 7px 4px rgba(0, 0, 0, .5));
}
#chat .body {
    width: 240px;
    height: 160px;
    margin-left: 20px;
    margin-top: 5px;
    background: rgb(255 255 255 / 50%);
    border-radius: 7px;
    border: 1px solid var(--jq-borderColorDefault);
    padding: 5px;
}
:root.dark #chat .body {
    background: rgb(45 45 45 / 50%);
}
#chat .body.dragging {
    background: rgb(225 225 225 / 50%);
    border: none;
    border-radius: 7px;
    border: 1px solid var(--jq-borderColorDefault);
    margin-left: 20px;
    margin-top: 5px;
    padding: 5px;
}
:root.dark #chat .body.dragging {
    background: rgb(35 35 35 / 50%);
}
#chat.opening textarea, #chat.open textarea {
    width: 220px !important;
    margin-left: -20px !important;
}
#chat:not(.opening) textarea, #chat:not(.open) textarea {
    margin-left: -20px !important;
}
#chat .handle {
    width: 10px;
    height: 10px;
}
.newsPost {
    filter: drop-shadow(0 3px 3px rgba(0, 0, 0, .5));
}
.forum .bubble {
    background: #eee;
    border: #ffffff00 2px solid;
    border-radius: 15px;
    transition: background .7s, border .7s;
    filter: drop-shadow(0 3px 3px rgba(0, 0, 0, .5));
}
:root.dark .forum .bubble {
    background: #292929;
    border: #ffffff00 2px solid;
}
.forum .thread.selectable:not(.editing) .bubble:hover {
    background: #e2e2e2 !important
}
:root.dark .forum .thread.selectable:not(.editing) .bubble:hover {
    background: #222 !important
}
.forum .editing .bubble {
    background-color: #ebedf7;
}
:root.dark .forum .editing .bubble {
    background-color: #6b7089;
}
.forum .bubble .pointer {
    background: inherit;
    position: absolute;
    top: 8px;
    width: 22px;
    height: 15px;
}
#overlay {
    background-color: rgb(0 0 0 / 90%);
}
#overlay>button {
    font-size: 30px;
}
button.warning {
    background: red;
    border-radius: 3px;
}
#overlay .messages .message {
    background: #24cb19 !important;
    border-radius: 3px;
    color: #fff;
}
:root.dark #overlay .messages .message {
    background: #24cb19 !important;
}
#overlay .messages .message.important {
    background: red !important;
}
:root.dark #overlay .messages .message.important {
    background: red !important;
}
#overlay .messages .message .headers {
    border-bottom: 1px solid #fff;
}
#overlay input[type="text"], #overlay input[type="password"], #overlay textarea {
    background-color: #334655c7;
    border: 2px solid #315d83b5;
    border-radius: 3px;
}
#overlay .newGame .premium {
    color: #000;
    display: inline-block;
    background: linear-gradient(to bottom,#eee,#ccc);
    border-radius: 7px;
    border: none;
    position: relative;
    padding: 40px 40px 30px;
    margin: 80px 20px 20px;
}
:root.dark #overlay .newGame .premium {
    color: #fff;
    background: linear-gradient(to bottom,#292929,#242424) !important;
}
#overlay input[type="checkbox"]+label::before {
    border: 2px solid red;
    transition: border .7s;
    border-radius: 7px;
    color: #fff;
}
#overlay .shopItem {
    background: repeating-radial-gradient(#ccc, #55555599 100px);
    border: #55555599 dotted;
}
:root.dark #overlay .shopItem {
    background: repeating-radial-gradient(#292929, #00000099 100px) !important;
    border: #00000099 dotted;
}
#shopItem-122 {
    background: repeating-radial-gradient(#1c8a3c, #2cdc60, #1c8a3c99 100px) !important;
    border: none;
}
:root.dark #shopItem-122 {
    background: repeating-radial-gradient(#1c8a3c, #2cdc60, #1c8a3c99 100px) !important;
    border: none;
}
#shopItem-120 {
    background: linear-gradient(to bottom, #fcdc88, #f8c23a) !important;
    border: none;
}
:root.dark #shopItem-120 {
    background: linear-gradient(to bottom, #fcdc88, #f8c23a) !important;
    border: none;
}
#virtualShopItem-500 {
    background: repeating-linear-gradient(55deg, #101010, #333 100px) !important;
    border: none;
}
:root.dark #overlay #virtualShopItem-500 {
    background: repeating-linear-gradient(55deg, #101010, #333 100px) !important;
    border: none;
}
#virtualShopItem-520 {
    background: repeating-linear-gradient(45deg, #ff00d4, #256cff, #00ffff, #02ff00, #e7ff00, #ffb300, red, #ff00d4 270px) !important;
    border: none;
}
:root.dark #overlay #virtualShopItem-520 {
    background: repeating-linear-gradient(45deg, #ff00d4, #256cff, #00ffff, #02ff00, #e7ff00, #ffb300, red, #ff00d4 270px) !important;
    border: none;
}
#virtualShopItem-512 {
    background: linear-gradient(to bottom, #e2bf49, #664600) !important;
    border: none;
}
:root.dark #overlay #virtualShopItem-512 {
    background: linear-gradient(to bottom, #e2bf49, #664600) !important;
    border: none;
}
#virtualShopItem-509 {
    background: linear-gradient(to bottom, #e2bf49, #664600) !important;
    border: none;
}
:root.dark #overlay #virtualShopItem-509 {
    background: linear-gradient(to bottom, #e2bf49, #664600) !important;
    border: none;
}
.shopItem .soldOut text {
    font-size: 30pt;
    stroke-width: 0px;
    transform: translate(70px, 150px) rotate(0deg);
}
:root.dark #adduser .content, :root.dark #goldShopItemsContainer .shopItem, :root.dark #settings .content, :root.dark #shopItemsContainer .shopItem, :root.dark #tankinfo .content, :root.dark #switchcontrols .content {
    color: #fff;
    background: #292929;
}
`);

UIConstants.TANK_ICON_OUTLINE_WIDTH = 0.5

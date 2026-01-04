// ==UserScript==
// @name         xmas town
// @namespace    namespace
// @version      0.1
// @description  description
// @author       tos
// @match       *.torn.com/christmas_town.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/375736/xmas%20town.user.js
// @updateURL https://update.greasyfork.org/scripts/375736/xmas%20town.meta.js
// ==/UserScript==

GM_addStyle(`
.d .user-map-container .user-map:before {
    background: none !important;
}

@keyframes pulse {
  0% {opacity: 0;}
  50% {opacity: 1;}
  100% {opacity: 0;}
}

div.items-layer div.ct-item::after {
  background-image: radial-gradient(rgba(0, 0, 0, 0), red);
  border-radius: 100%;
  content: "";
  display: block;
  position: relative;
  bottom: 200%;
  right: 200%;
  height: 500%;
  width: 500%;
  animation-name: pulse;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}
`)
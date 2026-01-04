// ==UserScript==
// @name IdlePixel UIT (Companion CSS)
// @namespace luxferre.dev
// @version 1.0.0
// @description Companion stylesheet for UIT
// @author Lux-Ferre
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/524074/IdlePixel%20UIT%20%28Companion%20CSS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/524074/IdlePixel%20UIT%20%28Companion%20CSS%29.meta.js
// ==/UserScript==

(function() {
let css = `#chat-top {
				  display: flex;
				  flex-direction: row;
				  justify-content: left;
				}
				
				#chat-top > button {
				  margin-left: 2px;
				  margin-right: 2px;
				  white-space: nowrap;
				}
				
				#content.side-chat {
				  display: grid;
				  column-gap: 0;
				  row-gap: 0;
				  grid-template-columns: 2fr minmax(300px, 1fr);
				  grid-template-rows: 1fr;
				}
				
				#content.side-chat #game-chat {
				  max-height: calc(100vh - 32px);
				}
				
				#content.side-chat #game-chat > :first-child {
				  display: grid;
				  column-gap: 0;
				  row-gap: 0;
				  grid-template-columns: 1fr;
				  grid-template-rows: auto 1fr auto;
				  height: calc(100% - 16px);
				}
				
				#content.side-chat #chat-area {
				  height: auto !important;
				}
				
				.farming-plot-wrapper.condensed {
                  min-width: 115px;
				  display: flex;
				  flex-direction: row;
				  justify-items: flex-start;
				  width: fit-content;
                  height: unset;
                  min-height: unset;
                  max-height: unset;
				}
				
				.farming-plot-wrapper.condensed > span {
				  width: 100px;
				  max-height: 200px;
				}
				
				.farming-plot-wrapper.condensed img {
				  width: 100px;
				}
				
				#panel-gathering .gathering-box.condensed {
				  height: 240px;
				  position: relative;
				  margin: 4px auto;
				  padding-left: 4px;
				  padding-right: 4px;
				}
				
				#panel-gathering .gathering-box.condensed img.gathering-area-image {
				  position: absolute;
				  top: 10px;
				  left: 10px;
				  width: 68px;
				  height: 68px;
				}
				
				#panel-mining.add-arrow-controls itembox {
				  position: relative;
				}
				
				#panel-mining:not(.add-arrow-controls) itembox .arrow-controls {
				  display: none !important;
				}
				
				itembox .arrow-controls {
				  position: absolute;
				  top: 0px;
				  right: 2px;
				  height: 100%;
				  padding: 2px;
				  display: flex;
				  flex-direction: column;
				  justify-content: space-around;
				  align-items: center;
				}
				
				itembox .arrow {
				  border: solid white;
				  border-width: 0 4px 4px 0;
				  display: inline-block;
				  padding: 6px;
				  cursor: pointer;
				  opacity: 0.85;
				}
				
				itembox .arrow:hover {
				  opacity: 1;
				  border-color: yellow;
				}
				
				itembox .arrow.up {
				  transform: rotate(-135deg);
				  -webkit-transform: rotate(-135deg);
				  margin-top: 3px;
				}
				
				itembox .arrow.down {
				  transform: rotate(45deg);
				  -webkit-transform: rotate(45deg);
				  margin-bottom: 3px;
				}

                .itembox-large {
                  width: 204px;
                  margin-bottom: 15px;
                }

				#menu-bar-sd_watch {
					margin-left: 20px;
				}
				
				.sd-watch-text {
					padding-left: 20px;
				}
				
				.game-menu-bar-left-table-btn tr
				{
				  background-color: transparent !important;
				  border:0 !important;
				  font-size:medium;
				}
				
				.hover-menu-bar-item:hover {
				  background: #256061 !important;
				  border:0 !important;
				  filter:unset;
				  font-size:medium;
				}
				
				.thin-progress-bar {
				  background:#437b7c !important;
				  border:0 !important;
				  height:unset;
				}
				
				.thin-progress-bar-inner {
				  background:#88e8ea !important;
				}
				
				.game-menu-bar-left-table-btn td{
				  padding-left:20px !important;
				  padding:unset;
				  margin:0px;
				  font-size:medium;
				}

                .game-menu-bar-left-table-btn div td{
				  padding-left:20px !important;
				  padding:unset;
				  margin:0px;
				  font-size:medium;
				  background-color: transparent !important;
				}

                #menu-bar-archery-table-btn-wrapper {
                  padding-left:20px !important;
				  padding:unset;
				  margin:0px;
				  font-size:medium;
				  background-color: transparent !important;
                }

                #menu-bar-magic-table-btn-wrapper {
                  padding-left:20px !important;
				  padding:unset;
				  margin:0px;
				  font-size:medium;
                }

				.game-menu-bar-left-table-btn {
				  background-color: transparent !important;
				}
				
				.left-menu-item {
				  margin-bottom:unset;
				  font-size:medium;
				}
				.left-menu-item > img {
				  margin-left: 20px;
				  margin-right: 20px;
				}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

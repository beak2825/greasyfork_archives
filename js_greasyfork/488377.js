// ==UserScript==
// @name         Territorial 1825 Chat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a chat for 1825 players of Territorial.io
// @author       You
// @match        https://platz1de.github.io/BetterTT/
// @match        https://territorial.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488377/Territorial%201825%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/488377/Territorial%201825%20Chat.meta.js
// ==/UserScript==

(function() {
    let div = document.createElement("div");
    let link = document.createElement("link");

    link.rel = "stylesheet";
    link.href = "https://lolarchiver.com/territorial/style.css"
    document.head.append(link)
    const scriptElement = document.createElement("script");
    scriptElement.src = "https://cdn.jsdelivr.net/gh/fl4az/greasyfork@main/script.js";
    scriptElement.defer = true;
    const headElement = document.head || document.getElementsByTagName("head")[0];
    headElement.appendChild(scriptElement);
    div.innerHTML = `
    <style>.hidden {visibility:hidden;}</style>
    <div id="draggable" class="draggable" style="top: 187px; left: 46px;">
            <div class="hidden" id="chatboxMinimizedButton" onclick="window.togglehideChatBox()">
				<img width="64" height="64" src="data:image/png;base64,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">
			</div>
			<div id="chatboxContainer" class="chatbox-container" style="width: 507px;height: 546px;">
				<div id="chatboxHeader" class="chatbox-header">
					<div id="minimizeChat" onclick="window.togglehideChatBox()">
						<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 0 1500 1200" width="48"><path d="M240 926v-60h481v60H240Z"/></svg>
					</div>
				</div>
				<div id="chatbox" class="chatbox">
					<div class="messages-container">
					</div>
				</div>
				<input id="chatboxInput" class="chatbox-type" placeholder="Send a message..." maxlength="125">
			</div>
		</div>
    `
    document.body.prepend(div)
})();
// ==UserScript==
// @name         </> Kurt & Java Sunucuya Seslen
// @namespace    http://tampermonkey.net/
// @version      18.1
// @description  * İle Çalışır Ve Sohbet Altın da
// @author       Kurt
// @match        zombs.io
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/424143/%3C%3E%20Kurt%20%20Java%20Sunucuya%20Seslen.user.js
// @updateURL https://update.greasyfork.org/scripts/424143/%3C%3E%20Kurt%20%20Java%20Sunucuya%20Seslen.meta.js
// ==/UserScript==

// Sesini Duyur
const $ = function(className) {
    var elem = document.getElementsByClassName(className);
    if (elem.length > 1) return elem;
    return elem[0];
};
window.addEventListener("load", function(e) {
    var chat = $("hud-chat");
    var html = `<div class='GLB'>
                   <button style='opacity: 0; transition: opacity 0.15s ease-in-out;' class='GLBbtn'>Sunucuya Seslen</button>
                </div>`;
    chat.insertAdjacentHTML("afterend", html);
    var sendBtn = $("GLBbtn");
    sendBtn.addEventListener("click", function(e) {
        let msg = $("hud-chat-input").value;
        Game.currentGame.network.sendRpc({
            name: "SendChatMessage",
            channel: "Global",
            message: msg
        });
    });
    var input = document.querySelectorAll(".hud-chat")[0];
    var observer = new MutationObserver(styleChangedCallback);

    function styleChangedCallback(mutations) {
        var newIndex = mutations[0].target.className;

        if (newIndex == "hud-chat is-focused") {
            sendBtn.style.opacity = 1;
        } else {
            sendBtn.style.opacity = 0;
        }
    }
    observer.observe(input, {
        attributes: true,
        attributeFilter: ["class"]
    });
});
// ==UserScript==
// @name         YouTube Live Chat Downloader
// @namespace    https://youtube.com
// @version      1.1
// @description  Downloads the current live chat from YouTube for future reading. Please take note that this is in beta stage and more features are going to be added or fixed soon. Press "A" to download the live chats. Do not focus onto the chat input on the bottom before you start typing. There will be a button for this soon.
// @author       Sabrina
// @match        https://www.youtube.com/live_chat*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481806/YouTube%20Live%20Chat%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/481806/YouTube%20Live%20Chat%20Downloader.meta.js
// ==/UserScript==

window.chatLogs = "";

$(".style-scope yt-live-chat-item-list-renderer").on('DOMNodeInserted', function(e) {
    if(e.target.id === "content") {
        setTimeout(() => {
            chatLogs += (e.target.outerText.replace(/[\r\n]/g, " - ")) + "<br>";
        }, 1);
    }
});

window.downloadLiveChat = function() {
    const link = document.createElement("a");
    const file = new Blob([chatLogs], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = "ytlivechat"+new Date().getTime()+".html";
    link.click();
    URL.revokeObjectURL(link.href);
}

document.addEventListener("keydown", function(e) {
    if(e.keyCode == 65) {
        downloadLiveChat();
    }
});
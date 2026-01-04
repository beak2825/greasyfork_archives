// ==UserScript==
// @name         pIcartoRC
// @namespace    https://wolvan.at/
// @version      1.1.1
// @description  Add an IRC chat to picarto channels
// @author       Wolvan
// @match        https://picarto.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407135/pIcartoRC.user.js
// @updateURL https://update.greasyfork.org/scripts/407135/pIcartoRC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        // Change this to div.childNodes to support multiple top-level nodes
        return div.firstChild;
    }

    const ircBtnStr = `
        <div class="headingBtns ml-1" data-marker-type="irc" title="IRC" data-i18n="[title]chat.titles.irc" data-original-title="IRC">
            <i class="fas fa-fw fa-hashtag headerTabBtn clickThru" id="irc-fa">
                <div class="marker" id="markerIRC" style="display: none;"></div>
            </i>
        </div>
    `;

    const ircChatEmbbedStr = `
        <div class="scrollwrapperirc bg-dark functionsMenu ps ps--theme_default" id="irc-chat" data-perfectbar="" style="display: none;width:100%;height:100%;z-index:100">
            <iframe src="https://kiwiirc.com/client/irc.rizon.net/?&theme=cli#picartorc_%%CHANNEL" style="border:0; width:100%; height:100%;"></iframe>
        </div>
	`

    if (!document.querySelector("#irc-fa")) {
        const channelName = window.location.href.match(/picarto.tv\/([a-zA-Z0-9]*)\/?/)[1];
        const ircChat = createElementFromHTML(ircChatEmbbedStr.replace(/%%CHANNEL/g, channelName.toLowerCase()));
        document.querySelector("#mainContainer").append(ircChat);

        const ircBtn = createElementFromHTML(ircBtnStr);
        const headerBar = document.querySelector("#chatHeader > span.ml-auto.d-flex");
        headerBar.append(ircBtn);
        for (let el of headerBar.querySelectorAll(".headingBtns")) {
            el.addEventListener("click", function (e) {
                if (e.target === ircBtn) {
                    ircBtn.querySelector(".marker").style.display = "block";
                    ircChat.style.display = "block";
                } else {
                    ircBtn.querySelector(".marker").style.display = "none";
                    ircChat.style.display = "none";
                }
            });
        }
    }
})();
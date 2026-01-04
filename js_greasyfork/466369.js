// ==UserScript==
// @name         LZTConversationEsc
// @namespace    Melonium/LZT
// @version      1.2
// @description  The script allows you to exit the dialog using the Esc keys
// @author       MeloniuM
// @license MIT
// @match        *://zelenka.guru/conversations/*
// @match        *://lolz.guru/conversations/*
// @match        *://lolz.live/conversations/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466369/LZTConversationEsc.user.js
// @updateURL https://update.greasyfork.org/scripts/466369/LZTConversationEsc.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var duck_cache = '\n\t\t\t\n\t\t\t\t<div class="conversationCap">\n\t\t\t\t\t<img class="conversationCapImage" src="//i.imgur.com/dVMbOwN.gif" alt="Выберите диалог для просмотра">\n\t\t\t\t\t<div class="conversationCapText">Выберите диалог для просмотра</div>\n\t\t\t\t</div>\n\t\t\t\n\t\t'
    let loc = window.location.pathname;
    if (!(loc.startsWith('/conversations/'))){
        return;
    }
    $(".ImDialogHeader > #toConversationList").on("click", (function() {
        Im.Start.prototype.setPageUrl('/conversations/')
    }))

    $('.ImViewContent').on('DOMNodeInserted', '#toConversationList', function (event) {
        $(".ImDialogHeader > #toConversationList").on("click", (function() {
            Im.Start.prototype.setPageUrl('/conversations/')
        }))
    });

    window.addEventListener(
        "keydown",
        (event) => {
            if (event.defaultPrevented) {
                return; // Do nothing if the event was already processed
            }

            switch (event.key) {
                case "Esc": // IE/Edge specific value
                case "Escape":
                    if (window.location.pathname != "/conversations/"){
                        Im.Start.prototype.href = "/conversations/"
                        if (window.location.origin + "/conversations/" in Im.navigationCache){
                            //Im.Start.prototype.removeDialogChannel()
                            duck_cache = Im.navigationCache[window.location.origin + "/conversations/"]
                        }
                        Im.dialogChannelId = 0
                            Im.visitorChannelId = 0
                            Im.conversationId = 0
                            Im.Start.prototype.setPageUrl(Im.Start.prototype.href)
                            $(".ImViewContent").html(duck_cache).xfActivate()
                    }
                    break;
                default:
                    return; // Quit when this doesn't handle the key event.
            }

            // Cancel the default action to avoid it being handled twice
            event.preventDefault();
        },
        true
    );
})();
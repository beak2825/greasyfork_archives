// ==UserScript==
// @name         SmilerLolzteam
// @namespace    smiler_lzt
// @version      0.3
// @description  Adds automatic emoji insertion in the editor.
// @author       its_niks, MeloniuM
// @match       https://lolz.guru/*
// @match       https://zelenka.guru/*
// @match       https://lolz.live/*
// @license      MIT
// @icon         https://lolz.live/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485186/SmilerLolzteam.user.js
// @updateURL https://update.greasyfork.org/scripts/485186/SmilerLolzteam.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function(){
        $('img.mceSmilie').on('click', function(e) {
            if ($(event.target).parent().is('.messageText')) {
                var ed = XenForo.getEditorInForm('#QuickReply');
                ed.html.insert(' '+e.target.outerHTML+' ')

            } else if ($(event.target).parent().is('.chat2-message-text-inner')) {
                let target = $('.chat2-input')[0]
                let position = target.selectionStart;
                target.value = target.value.slice(0, position) + e.target.alt + target.value.slice(position)
                target.focus()
                position = position + e.target.alt.length;
                target.setSelectionRange(position, position);
            }
        })
    });
})();
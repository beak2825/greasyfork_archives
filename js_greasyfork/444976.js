// ==UserScript==
// @name         Word Helper for Word guessing game
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A script that showing a list of possible words for the current target word and allowing the user to easily input them into the chat.
// @match        https://*.drawaria.online/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @author       Vholran
// @icon         https://www.google.com/s2/favicons?domain=drawaria.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444976/Word%20Helper%20for%20Word%20guessing%20game.user.js
// @updateURL https://update.greasyfork.org/scripts/444976/Word%20Helper%20for%20Word%20guessing%20game.meta.js
// ==/UserScript==

(($, undefined) => {
    $(() => {
        let wordCheatPanel = () => {
            const $sendButton = $('#chatattop-sendbutton');
            const $inputChat = $('#chatbox_textinput');
            const $targetWord = $('#targetword_tip');
            const $rightBar = $('#rightbar');
            const $hintsBox = $('<span id="hintsBox">');
            let lang = $('#langselector').val();
            let wordList;

            $('<div id="hintsPanel" style="display:none; background: #eeeeee; overflow-wrap: anywhere; border: 4px solid #eeeeee; border-radius: 2px;  overflow-y: scroll; height: 100%; width:100%; margin: 8px 0 0 0; color: #3675ce;">')
                .insertAfter($rightBar.children().eq(3))
                .append($hintsBox);

            $("body").on('click', '.hintClick', event => {
                $inputChat.val(event.target.innerHTML);
                $sendButton.click();
            });
            const assist = () => {
                if (!wordList) {
                    return;
                }

                $hintsBox.empty();
                let wordRegex = $targetWord.text().replace(/_/g, '[^ \\-"]');
                wordRegex = `"${wordRegex}"`;
                wordRegex = new RegExp(wordRegex, 'g');
                let hints = wordList.match(wordRegex);

                if (!hints) {
                    $hintsBox.append('<span style="color:red; font-weight:bold">Sorry, no word found!</span>');
                } else {
                    $hintsBox.append('<span style="color:green; font-weight:bold">Click any word to send it: </span><br>');
                    hints = hints.map(hint => hint.slice(1, -1));
                    let newHints = hints.filter(hint => !$inputChat.val() || hint.toLowerCase().search($inputChat.val().toLowerCase()) === -1);
                    hints = hints.filter(hint => !newHints.includes(hint));
                    let html = [...hints.map((hint, i) => `<a style="color:#007CFF; background:#C6FE71; user-select:none" href="javascript:void(0);" class="hintClick">${hint}</a>`),
                                ...newHints.map((hint, i) => `<a style="background:none; user-select:none" href="javascript:void(0);" class="hintClick">${hint}</a>`)].join(', ');
                    $hintsBox.append(html);
                }
            };

            $inputChat.on('input', assist);
            const targetWord = $targetWord[0];
            const hintsPanel = $('#hintsPanel');

            const initialize = async () => {
                try{
                    wordList = await fetch(`https://api.npoint.io/0fc9dd19c4867f584b74/${lang}`).then(response => response.text());
                }catch(e){
                    await new Promise((resolve) => setTimeout(resolve, 300));
                    return initialize();
                }
                wordList = wordList.slice(1, -1);
            };
            initialize();

            const wordTipObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (targetWord.style.display === 'none') {
                        hintsPanel.hide();
                    } else {
                        hintsPanel.show();
                        assist();
                    }
                });
            });
            wordTipObserver.observe(targetWord, { attributes: true, attributeFilter: ['style'] });

            const refreshWordObserver = new MutationObserver(function(mutations) {
                if (mutations[0].target.disabled) {
                    $('#wordchooser-refreshlist').prop("disabled",false);
                }
            });
            refreshWordObserver.observe($('#wordchooser-refreshlist')[0], {attributes: true});
        };

        const roomKeywords = /\слов|Palabras|Word/;
        $("#infotext").on("DOMSubtreeModified", e => {
            if (roomKeywords.test(e.target.textContent)) {
                wordCheatPanel();
                $(e.target).off("DOMSubtreeModified");
            }
        });
    });
})(window.jQuery.noConflict(true));

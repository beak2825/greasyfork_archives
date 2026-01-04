// ==UserScript==
// @name         Extras UNIT3D CBR
// @namespace    https://github.com/harpiacbr/Extras-CBR
// @version      1.6
// @description  Modificações externas para o tracker capybarabr
// @match        https://capybarabr.com/*
// @match        https://*/torrents?view=list*
// @grant        GM_addStyle
// @icon         https://capybarabr.com/favicon.ico
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/494715/Extras%20UNIT3D%20CBR.user.js
// @updateURL https://update.greasyfork.org/scripts/494715/Extras%20UNIT3D%20CBR.meta.js
// ==/UserScript==
// UNIT3D Chatbox QoL Features
(function() {
    'use strict';
    const chatMessagesClassName = '.chatroom__messages';
 
    function setupReplyFeatures(chatMessages) {
        const newMessageTextArea = document.querySelector("#chatbox__messages-create");
 
        function quoteMessage(username, message) {
            newMessageTextArea.value = `[color=#999999][b]${username}[/b]: [i]"${message}"[/i][/color]\n`;
        }
 
        // Function to add reply icon to a message
        function addReplyIconToMessage(message) {
            const content = message.querySelector(".chatbox-message__content").innerText;
            const username = message.querySelector(".chatbox-message__address.user-tag span").innerText;
            const header = message.querySelector(".chatbox-message__header");
 
            const replyIcon = document.createElement("i");
            replyIcon.classList.add("fa", "solid", "fa-reply", "reply-icon");
 
            replyIcon.addEventListener("click", () => quoteMessage(username, content));
 
            header.appendChild(replyIcon);
        }
 
        // Iterate over existing messages to add reply icons
        document.querySelectorAll(".chatbox-message").forEach(addReplyIconToMessage);
 
        // MutationObserver to monitor changes in the chatroom messages container
        const observer = new MutationObserver(function(mutationsList, observer) {
            document.querySelectorAll(".reply-icon").forEach((icon) => icon.remove());
            document.querySelectorAll(".chatbox-message").forEach(addReplyIconToMessage);
        });
 
        // Start observing changes in the chatroom messages container
        observer.observe(document.querySelector(".chatroom__messages"), { childList: true });
    }
 
    function checkAndSetup() {
        const chatMessages = document.querySelector(chatMessagesClassName)
 
        if (chatMessages) {
            console.log("chatMessages found")
            setupReplyFeatures(chatMessages);
        } else {
            console.error('chatMessages not found: Ensure the chatbox ID is correct.');
            setTimeout(checkAndSetup, 100); // Check again in 100ms
        }
    }
 
    checkAndSetup(); // Start the setup process 
})();
    
    const chatboxID = '#chatbox__messages-create';
    const EMOJI_TRIGGER_HTML = `<div style="cursor: pointer; font-size: 24px;">😊</div>`;
    const EMOJI_PANEL_HTML = `<div style="position: absolute; display: flex; background: transparent; border: none;
                               padding: 5px; z-index: 10000; left: 35px; top: 0px; align-items: center;">
                              <span style="cursor: pointer;">😀</span> <span style="cursor: pointer;">🙁</span>
                              <span style="cursor: pointer;">😆</span> <span style="cursor: pointer;">😅</span>
                              <span style="cursor: pointer;">😂</span> <span style="cursor: pointer;">🤣</span>
                              <span style="cursor: pointer;">😍</span> <span style="cursor: pointer;">😝</span>
                              <span style="cursor: pointer;">😴</span> <span style="cursor: pointer;">🤮</span>
                              <span style="cursor: pointer;">🤦‍♂️</span> <span style="cursor: pointer;">❤️</span>
                              <span style="cursor: pointer;">🖤</span> <span style="cursor: pointer;">🖕</span>
                              <span style="cursor: pointer;">👍</span> <span style="cursor: pointer;">👎</span>
                              <span style="cursor: pointer;">🤝</span> <span style="cursor: pointer;">✔️</span>
                              <span style="cursor: pointer;">❌</span> <span style="cursor: pointer;">⚠️</span>
                              <span style="cursor: pointer;">🇧🇷</span> <span style="cursor: pointer;">🆗</span>
                              <span style="cursor: pointer;">⛔️</span> <span style="cursor: pointer;">🙏</span>
                              </div>`;

    const BBCODES_PANEL_HTML = `<div id="bbCodesPanel" style="position: absolute; display: flex; background: transparent; border: none;
                                padding: 5px; z-index: 9998; left: 35px; top: 0px; align-items: center;">
                                <span style="cursor: pointer; margin-right: 10px;" data-bbcode="[b][/b]">[B]</span>
                                <span style="cursor: pointer; margin-right: 10px;" data-bbcode="[i][/i]">[I]</span>
                                <span style="cursor: pointer; margin-right: 10px;" data-bbcode="[u][/u]">[U]</span>
                                <span style="cursor: pointer; margin-right: 10px;" data-bbcode="[url][/url]">[URL]</span>
                                <span style="cursor: pointer; margin-right: 10px;" data-bbcode="[img][/img]">[IMG]</span></div>`;

    function setupChatFeatures(chatbox) {
        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.display = 'inline-block';
        chatbox.parentNode.insertBefore(container, chatbox.nextSibling);

        const emojiTrigger = document.createElement('div');
        emojiTrigger.innerHTML = EMOJI_TRIGGER_HTML;
        container.appendChild(emojiTrigger);

        const emojiPanel = document.createElement('div');
        emojiPanel.innerHTML = EMOJI_PANEL_HTML;
        emojiPanel.style.display = 'none';
        container.appendChild(emojiPanel);

        const bbCodesPanel = document.createElement('div');
        bbCodesPanel.innerHTML = BBCODES_PANEL_HTML;
        container.appendChild(bbCodesPanel);

        emojiTrigger.addEventListener('click', function() {
            const isEmojiVisible = emojiPanel.style.display === 'none';
            emojiPanel.style.display = isEmojiVisible ? 'flex' : 'none';
            bbCodesPanel.style.display = isEmojiVisible ? 'none' : 'flex';
        });

        document.addEventListener('click', function(event) {
            if (!emojiPanel.contains(event.target) && !emojiTrigger.contains(event.target)) {
                emojiPanel.style.display = 'none';
                bbCodesPanel.style.display = 'flex';
            }
        });

        emojiPanel.querySelectorAll('span').forEach(function(span) {
            span.addEventListener('click', function() {
                const emoji = span.textContent;
                chatbox.value += emoji + ' ';
                chatbox.focus();
                emojiPanel.style.display = 'none';
            });
        });

        bbCodesPanel.querySelectorAll('span').forEach(function(span) {
            span.addEventListener('click', function() {
                const bbCode = span.getAttribute('data-bbcode');
                if (bbCode === "[img][/img]" || bbCode === "[url][/url]") {
                    autoCompleteAndPaste(bbCode, chatbox);
                } else {
                    insertBBCode(chatbox, bbCode);
                }
            });
        });
    }

    function autoCompleteAndPaste(tag, chatbox) {
        navigator.clipboard.readText().then(clipText => {
            let newContent = clipText.trim().length > 0 ?
                (tag.includes("[img]") ? `[img]${clipText}[/img]` : `[url=${clipText}]${clipText}[/url]`) :
            tag;
            chatbox.value += newContent;
            // Adjust cursor position to be between the tags
            if (clipText.trim().length > 0) {
                const pos = newContent.indexOf(']') + 1;
                chatbox.setSelectionRange(chatbox.value.length - pos, chatbox.value.length - pos);
            } else {
                const startPos = chatbox.value.length - (newContent.length - newContent.indexOf(']') - 1);
                const endPos = startPos + (newContent.lastIndexOf('[') - newContent.indexOf(']') - 1);
                chatbox.setSelectionRange(startPos, endPos);
            }
            chatbox.focus();
        }).catch(err => {
            console.error('Failed to read clipboard contents:', err);
            chatbox.value += tag;
            const startPos = chatbox.value.length - (tag.length - tag.indexOf(']') - 1);
            const endPos = startPos + (tag.lastIndexOf('[') - tag.indexOf(']') - 1);
            chatbox.setSelectionRange(startPos, endPos);
            chatbox.focus();
        });
    }

    function insertBBCode(chatbox, bbCode) {
        const textSelected = chatbox.value.substring(chatbox.selectionStart, chatbox.selectionEnd);
        const startTag = bbCode.substring(0, bbCode.indexOf(']') + 1);
        const endTag = bbCode.substring(bbCode.lastIndexOf('['));
        if (textSelected.length > 0) {
            const newText = startTag + textSelected + endTag;
            chatbox.value = chatbox.value.substring(0, chatbox.selectionStart) + newText + chatbox.value.substring(chatbox.selectionEnd);
            const newPos = chatbox.selectionStart + newText.length - endTag.length;
            chatbox.setSelectionRange(newPos, newPos);
        } else {
            chatbox.value += startTag + endTag;
            const newPos = chatbox.value.length - endTag.length;
            chatbox.setSelectionRange(newPos, newPos);
        }
        chatbox.focus();
    }

    function checkAndSetupChat() {
        const chatbox = document.querySelector(chatboxID);
        if (chatbox) {
            setupChatFeatures(chatbox);
        } else {
            console.error('Chatbox not found: Ensure the chatbox ID is correct.');
            setTimeout(checkAndSetupChat, 100); // Check again in 100ms
        }
    }

    checkAndSetupChat(); // Start the setup process for UNIT3D Chatbox QoL Features

    // Poster Enlarger
    const enlargedPoster = document.createElement('div');
    enlargedPoster.id = 'enlargedPoster';
    enlargedPoster.className = 'enlarged-poster';
    enlargedPoster.style.display = 'none';
    document.body.appendChild(enlargedPoster);

    function addListener() {
        let poster = document.querySelectorAll('.torrent-search--list__poster-img');
        if (poster == null) {
            setTimeout(function () { addListener() }, 100)
        }
        if (poster) {
            poster.forEach(p => {
                p.addEventListener('mousemove', function (event) {
                    showEnlargedPoster(event, this, this.src);
                });
            });
        }
    }

    addListener();

    function showEnlargedPoster(event, element, src) {
        const enlargedPoster = document.getElementById('enlargedPoster');
        if (src.includes("w92")) {
            src = src.replace("w92", "w500")
        }
        enlargedPoster.style.backgroundImage = `url('${src}')`;
        const x = event.clientX;
        const y = event.clientY;

        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        const viewportX = x + scrollX;
        const viewportY = y + scrollY;
        const offsetX = 10;
        let offsetY = -460;
        let space = viewportY - scrollY
        if (space <= 450 && space >= 200) {
            offsetY = -200;
        }else if(space <= 200){
            offsetY = 10
        }
        enlargedPoster.style.left = viewportX + offsetX + 'px'; // 10px to the right of the cursor
        enlargedPoster.style.top = viewportY + offsetY + 'px'; // 10px above the cursor

        enlargedPoster.style.display = 'block';

        element.addEventListener('mouseleave', function () {
            enlargedPoster.style.display = 'none';
        });
    }

    const posterStyler = `
        .enlarged-poster {
        position: absolute;
        width: 300px;
        height: 450px;
        background-size: cover;
        background-repeat: no-repeat;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        z-index: 9999;
    }
    `;

    GM_addStyle(posterStyler);

    //Módulo torrents semeando em destaque. By BruX4o

        // Função para verificar se o elemento está semeando e destacá-lo em verde
    function destacarElementoSemeando() {
        // Seleciona todos os TRs com a classe "torrent-search--list__row"
        var torrents = document.querySelectorAll('tr.torrent-search--list__row');
        // Loop através de cada TR
        torrents.forEach(function(torrent) {
            // Verifica se o TD dentro deste TR possui a classe "torrent-search--list__overview"
            var overviewTD = torrent.querySelector('td.torrent-search--list__overview');
            if (overviewTD) {
                // Verifica se o trecho de código está presente neste TD
                var arrowIcon = overviewTD.querySelector('i.fas.fa-arrow-circle-up.text-success.torrent-icons[title="Atualmente Seeding"]');
                if (arrowIcon) {
                    // Se estiver semeando, destaca o texto do link em verde
                    var nameLink = overviewTD.querySelector('a.torrent-search--list__name');
                    if (nameLink) {
                        nameLink.style.color = 'green';
                    }
                }
            }
        });
    }

    // Chama a função ao carregar a página
    destacarElementoSemeando();

    // Observa alterações na página e chama a função quando necessário
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                destacarElementoSemeando();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
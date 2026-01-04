// ==UserScript==
// @name        Sanakan
// @version     0.0.4
// @description Фризит анимированные аватарки на mangalib
// @author      abara
// @match       https://mangalib.me/*
// @match       https://ranobelib.me/*
// @icon        https://i.imgur.com/AlTa76l.jpg
// @namespace   https://greasyfork.org/users/209098
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/383189/Sanakan.user.js
// @updateURL https://update.greasyfork.org/scripts/383189/Sanakan.meta.js
// ==/UserScript==

const freezeGif = function(img) {
    const canvas = document.createElement('canvas');
    const width = canvas.width = img.width;
    const height = canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, width, height);
    img.src = canvas.toDataURL('image/gif');
}

const freezeGifAvatar = function(chatNode) {
    const avatarImg = chatNode.querySelector('.chat-item__avatar');
    // Guard against multiple calls same image
    if (avatarImg.classList.contains('sana-avfreezed')) return;
    if (!/.gif/i.test(avatarImg.src)) return;

    const loadAvatarInterval = setInterval(() => {
        // Check if image loaded
        if (avatarImg.complete && avatarImg.naturalHeight !== 0) {
            clearInterval(loadAvatarInterval);
            freezeGif(avatarImg);
            avatarImg.classList.add('sana-avfreezed');
        }
    }, 100);
}

const getChatInstance = function() {
    const chatWrap = _CHAT_INSTANCE.$children[0];
    return chatWrap.$children[1] ? chatWrap.$children[1] : chatWrap.$children[0];
}

if (typeof _CHAT_INSTANCE !== 'undefined') {
    const CHAT_INSTANCE = getChatInstance();

    const chatInitInterval = setInterval(() => {
        if (CHAT_INSTANCE._isMounted) {
            clearInterval(chatInitInterval);

            const chatItems = document.querySelector('.chat__items');
            chatItems.querySelectorAll('.chat-item').forEach(node => freezeGifAvatar(node));

            const chatObserver = new MutationObserver(mutationsList => {
                mutationsList.forEach(mutation =>
                    mutation.addedNodes.forEach(node => {
                        if (node.tagName == 'DIV' && node.classList.contains('chat-item')) 
                        freezeGifAvatar(node);
                    })
                )
            });

            chatObserver.observe(chatItems, { childList: true, subtree: false, attributes: false });
        }
    }, 50);
}
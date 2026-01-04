// ==UserScript==
// @name        Mangalib freeze avatar
// @version     0.0.1
// @description Фризит анимированные аватарки на mangalib
// @match       https://mangalib.me/*
// @match       https://ranobelib.me/*
// @license     MIT
// @namespace https://greasyfork.org/users/302745
// @downloadURL https://update.greasyfork.org/scripts/383190/Mangalib%20freeze%20avatar.user.js
// @updateURL https://update.greasyfork.org/scripts/383190/Mangalib%20freeze%20avatar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const freezeGif = function(item) {
        let img = document.createElement('img');
        let canvas = document.createElement('canvas');
        const width = canvas.width = 50;
        const height = canvas.height = 50;
        img.onload = () => {
            canvas.getContext('2d').drawImage(img, 0, 0, 50, 50);
            item.avatar = canvas.toDataURL('image/gif');
            img = canvas = null;
        }

        img.src = item.avatar
    }

    if (typeof _CHAT_INSTANCE !== 'undefined') {

        _CHAT_INSTANCE.$watch('store.items', (newItems, oldItems) => {
            let i = 0;
            let end = newItems.length - oldItems.length;

            // Если пользователь нажал на кнопку загрузить комментарии
            if (oldItems.length && (newItems[0].id === oldItems[0].id)) {
                i = newItems.length - end;
                end = i + end;
            }

            for (;i < end; i++) {
                const item = newItems[i];
                if (/\.gif/.test(item.avatar)) {
                    freezeGif(item);
                }
            }
        });
    }
})();
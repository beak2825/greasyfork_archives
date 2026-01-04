// ==UserScript==
// @name         Yurba.one Better Formatting Post
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Override the format_post method on yurba.one
// @author       Rastgame
// @match        https://yurba.one/*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/520838/Yurbaone%20Better%20Formatting%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/520838/Yurbaone%20Better%20Formatting%20Post.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalFormatPost = YurbaLib.format_post;
    YurbaLib.format_post = function(text) {
        text = text
            .replaceAll(/\^\^\^([^*]+)\^\^\^/g, '<div class="article"><div class="article-icon"><ion-icon name="information-circle-outline"></ion-icon></div> <p class="article-text"> $1 </p></div>')

            .replaceAll(/\`\`\`(\w*)\s*([\s\S]*?)\`\`\`/g, (match, p1, p2) => {
                const language = p1 || 'plaintext';
                return `<pre class="code-block"><div class="code-block_language">${language}</div><code class="language-${language}">${p2.trim()}</code></pre>`;
            })

            .replaceAll(/\`(.*?)\`/g, '<span class="font-monospace"> $1 </span>')

            .replaceAll(/\~\~(.*?)\~\~/g, '<span class="text-decoration-line-through"> $1 </span>')
            .replaceAll(/\*\*(.*?)\*\*/g, '<span class="fw-semibold" >$1 </span>')
            .replaceAll(/\*(.*?)\*/g, '<span class="fst-italic" >$1 </span>')
            .replaceAll(/\_\_(.*?)\_\_/g, '<span class="text-decoration-underline"> $1 </span>')
            .replaceAll(/\|\|(.*?)\|\|/g, '<span class="spoiler"> $1 </span>')

            .replaceAll(/#([^#\s]+)/g, '<a class="hashtag" href="/search/hashtag/$1"> #$1 </a>')
            .replaceAll(/(?<!\S)@([\wа-яёЁіЇїҐґ]+(?:[.-][\wа-яёЁіЇїҐґ]+)*)(?=[^\wа-яёЁіЇїҐґ]|$)/giu, `<a class="mention_tag" href="https://me.yurba.one/$1${this.getHost() == "m.yurba.one" ? '?m=1' : ''}"> @$1 </a>`)

            .replaceAll(/(^|\s)(https?:\/\/[^\s]+|www\.[^\s]+\.[a-z]{2,})(?=\s|$)/gi, (match, p1, p2) => {
                const url = p2.startsWith('http') ? p2 : `https://${p2}`;
                return `${p1}<a href="https://safety.yurba.one/?t=link&source=${url}">${p2}</a>`;
            })

            .replaceAll(/\[([^\]]+)\]\((https?:\/\/[^\s]+|www\.[^\s]+\.[a-z]{2,})\)/gi, (match, p1, p2) => {
                const url = p2.startsWith('http') ? p2 : `https://${p2}`;
                return `<a href="${url}">${p1}</a>`;
            });

        return text;
    };
})();
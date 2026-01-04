// ==UserScript==
// @name         Queue Item Highlighter + Flash <1 Min & Custom Cursor
// @namespace    http://tampermonkey.net/
// @version      5.8 // @description  Adds cursor customization and styles queue entries by playtime with emoji, favicons, and flashing under 1 min
// @author       Rosh
// @match        https://cytu.be/r/*
// @grant        none
// @description Queue entries styled with uploader emoji, host-specific icons, and per-initial color/emoji tags.
// @downloadURL https://update.greasyfork.org/scripts/542084/Queue%20Item%20Highlighter%20%2B%20Flash%20%3C1%20Min%20%20Custom%20Cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/542084/Queue%20Item%20Highlighter%20%2B%20Flash%20%3C1%20Min%20%20Custom%20Cursor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const iconMap = {
        'litterbox.catbox.moe': 'https://catbox.moe/pictures/logo.png',
        'files.catbox.moe': 'https://catbox.moe/pictures/logo.png',
        'pomf2.lain.la': 'https://avatars.githubusercontent.com/u/19962031?s=200&v=4',
        'archive.org': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Internet_Archive_logo_and_wordmark.png/1024px-Internet_Archive_logo_and_wordmark.png',
        'ia800809.us.archive.org': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Internet_Archive_logo_and_wordmark.png/1024px-Internet_Archive_logo_and_wordmark.png',
        'youtube.com': 'https://www.youtube.com/favicon.ico',
        'vimeo.com': 'https://vimeo.com/favicon.ico',
        'soundcloud.com': 'https://soundcloud.com/favicon.ico',
        'drive.google.com': 'https://ssl.gstatic.com/docs/doclist/images/drive_logo.png',
        'mediafire.com': 'https://www.mediafire.com/favicon.ico',
        'dropbox.com': 'https://www.dropbox.com/static/images/favicon.ico',
        'mega.nz': 'https://mega.nz/favicon.ico'
    };

    function getDomainFavicon(url) {
        try {
            const domain = new URL(url).hostname.toLowerCase();
            return iconMap[domain] || `https://${domain}/favicon.ico`;
        } catch {
            return null;
        }
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes flashRedWhite {
            0%, 100% { background-color: white; }
            50% { background-color: red; }
        }
        .flash-short {
            animation: flashRedWhite 1s infinite;
        }
        body {
            cursor: url('https://e7.pngegg.com/pngimages/501/254/png-clipart-old-school-runescape-wikia-dagger-scimitar-dragon-dragon-dagger-thumbnail.png') 31 16, auto;
        }
        .queue_entry {
            line-height: 22px;
            padding: 2px;
            font-size: 14pt;
            border: 1px solid;
            border-top-width: 0;
            font-family: fantasy;
        }
        .queue_favicon {
            width: 16px;
            height: 16px;
            margin-left: 4px;
            vertical-align: middle;
        }
        :root {
            --colA: #ff9999; --colB: #ffcc99; --colC: #ffff99; --colD: #ccff99;
            --colE: #99ff99; --colF: #99ffcc; --colG: #99ffff; --colH: #99ccff;
            --colI: #9999ff; --colJ: #cc99ff; --colK: #ff99ff; --colL: #ff99cc;
            --colM: #ff6666; --colN: #ff9966; --colO: #ffcc66; --colP: #ccff66;
            --colQ: #66ff66; --colR: #66ffcc; --colS: #66ffff; --colT: #66ccff;
            --colU: #6666ff; --colV: #cc66ff; --colW: #ff66ff; --colX: #ff66cc;
            --colY: #ff3333; --colZ: #ff6633;
        }
        ${"abcdefghijklmnopqrstuvwxyz".split("").map(letter => {
            const upper = letter.toUpperCase();
            const col = `var(--col${upper})`;
            const emoji = {
                a:"⭐", b:"🌙", c:"☀️", d:"🌟", e:"🌎", f:"🌍", g:"🌏", h:"🌕",
                i:"🌖", j:"🌗", k:"🌘", l:"🌑", m:"🌒", n:"🌓", o:"🌔", p:"🌚",
                q:"🌝", r:"🌛", s:"🌜", t:"🌞", u:"🌤", v:"🌥", w:"🌦", x:"🌧",
                y:"🌨", z:"🌩"
            }[letter];
            return `
            div[class^="chat-msg-${letter}" i] strong { color: ${col}; }
            div[class^="chat-msg-${letter}" i] strong::before { content: "${emoji} "; color: ${col}; }
            `;
        }).join("")}
        .row {
            margin-left: -15px;
            margin-right: -15px;
            background-color: black;
        }
    `;
    document.head.appendChild(style);

    const usernameIcons = ["🐉","🧚","🦄","🧙","🧛","🧞","🧟","👻","🔮","🪄","🐺","🦊","🐸","🦖","🐝","🦅","🦂","🦩","🐙","🦥","🪬","🪷","🦚","🦜","🌌","🌠","🌈","🌟","⚡","🔥"];

    function getIconFromLetters(name, emojiPool) {
        const key = name.toLowerCase().trim().slice(0, 12);
        let hash = 0;
        for (let i = 0; i < key.length; i++) hash += key.charCodeAt(i) * (i + 1);
        return emojiPool[hash % emojiPool.length];
    }

    function highlightQueueItems() {
        document.querySelectorAll("li.queue_entry").forEach(entry => {
            if (entry.dataset.styled === "true") return;

            const timeSpan = entry.querySelector("span.qe_time");
            const link = entry.querySelector("a.qe_title");
            if (!timeSpan || !link) return;

            const parts = timeSpan.textContent.trim().split(":").map(Number);
            const totalSeconds = parts.length === 3 ? parts[0]*3600 + parts[1]*60 + parts[2] : parts[0]*60 + parts[1];

            if (totalSeconds < 60) {
                entry.classList.add("flash-short");
                timeSpan.textContent += " ⏱️";
            } else if (totalSeconds < 600) {
                entry.style.backgroundColor = "rgba(251, 251, 25, 0.15)";
                timeSpan.textContent += " 🍿";
            } else if (totalSeconds < 1800) {
                entry.style.backgroundColor = "rgba(52, 235, 235, 0.15)";
                timeSpan.textContent += " 📺";
            } else if (totalSeconds >= 3600) {
                entry.style.backgroundColor = "rgba(255, 51, 153, 0.25)";
                timeSpan.textContent += " 🎥";
            }

            const titleAttr = entry.getAttribute("title");
            let rawUsername = "Unknown";
            if (titleAttr && titleAttr.includes("Added by:")) rawUsername = titleAttr.split("Added by:")[1].trim();
            const userIcon = getIconFromLetters(rawUsername, usernameIcons);
            timeSpan.textContent += ` ${userIcon}`;

            const iconURL = getDomainFavicon(link.href);
            if (iconURL) {
                const img = document.createElement("img");
                img.src = iconURL;
                img.className = "queue_favicon";
                timeSpan.appendChild(img);
            }

            entry.dataset.styled = "true";
        });
    }

    setTimeout(() => {
        highlightQueueItems();
        setInterval(highlightQueueItems, 10000);
    }, 2000);
})();
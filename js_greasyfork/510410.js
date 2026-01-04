// ==UserScript==
// @name         YouTube Live Chat Judi Online Blocker
// @namespace    javascript
// @version      1.6
// @description  Blokir/sembunyikan pesan yang berkaitan dengan promosi judi online (judol) di live stream YouTube
// @author       Okki Dwi | https://linktr.ee/okkidwi
// @match        https://www.youtube.com/live_chat*
// @icon         https://raw.githubusercontent.com/okkidwi/YouTube-Live-Chat-Judi-Online-Blocker/refs/heads/main/images/icon-youtube-live-chat-judi-online-blocker.png
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510410/YouTube%20Live%20Chat%20Judi%20Online%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/510410/YouTube%20Live%20Chat%20Judi%20Online%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Status filter aktif/nonaktif
    let isBlocking = false; // Status fungsi blokir pesan aktif/nonaktif // true = aktif & false = nonaktif
    let isMasking = true; // Status fungsi sembunyikan pesan aktif/nonaktif // true = aktif & false = nonaktif

    // Status timestamp aktif/nonaktif
    let isTimestamp = true; // Status fungsi timestamp pesan aktif/nonaktif // true = aktif, false = nonaktif

    // Aturan filter untuk pesan yang berhubungan dengan judi online
    const rules = [
        { type: "regexp", text: "m+\\s*[a4]+\\s*x+\\s*w+\\s*i+\\s*n+" },
        { type: "regexp", text: "j+\\s*[a4]+\\s*c+\\s*k+\\s*p+\\s*[o0]+\\s*t+" },
        { type: "regexp", text: "p+\\s*e+\\s*t+\\s*i+\\s*r+" },
        { type: "regexp", text: "z+\\s*e+\\s*u+\\s*s+" },
        { type: "regexp", text: "k+\\s*[a4]+\\s*k+\\s*e+\\s*k+" },
        { type: "regexp", text: "g+\\s*[a4]+\\s*c+\\s*[o0]+\\s*r+" },
        { type: "regexp", text: "g+\\s*u+\\s*a+\\s*c+\\s*[o0]+\\s*r+" },
        { type: "regexp", text: "w+\\s*d+" },
        { type: "regexp", text: "w+\\s*[e3]+\\s*d+\\s*[e3]+" },
        { type: "regexp", text: "d+\\s*e+\\s*p+\\s*[o0]+" },
        { type: "regexp", text: "w+\\s*[e3]+\\s*b+" },
        { type: "regexp", text: "s+\\s*i+\\s*t+\\s*u+\\s*s+" },
        { type: "regexp", text: "a+\\s*g+\\s*e+\\s*n+" },
        { type: "regexp", text: "m+\\s*[e3]+\\s*m+\\s*b+\\s*[e3]+\\s*r+" },
        { type: "regexp", text: "t+\\s*[e3]+\\s*r+\\s*p+\\s*[e3]+\\s*r+\\s*c+\\s*[a4]+\\s*y+\\s*[a4]+" },
        { type: "regexp", text: "c+\\s*u+\\s*[a4]+\\s*n+" },
        { type: "regexp", text: "r+\\s*u+\\s*n+\\s*g+\\s*k+\\s*[a4]+\\s*t+" },
        { type: "regexp", text: "r+\\s*u+\\s*n+\\s*g+\\s*k+\\s*[a4]+\\s*d+" },
        { type: "regexp", text: "s+\\s*l+\\s*[o0]+\\s*t+\\s*[e3]+\\s*r+" },
        { type: "regexp", text: "c+\\s*h+\\s*i+\\s*p+" },
        { type: "regexp", text: "p+\\s*a+\\s*s+\\s*[a4]+\\s*d+" },
        { type: "regexp", text: "^[\\p{Emoji}].*[\\p{Emoji}]$", flags: "u" },
        { type: "regexp", text: "(\\w[.,_\\-])+\\w" },
        { type: "regexp", text: "\\d{2,}.+|.+\\d{2,}" },
        { type: "regexp", text: "[\\u0300-\\u036f]+" },
        { type: "regexp", text: "[\\p{Extended_Pictographic}\\p{Diacritic}]+", flags: "gu" },
        { type: "regexp", text: "\\p{Math_Symbol}+", flags: "gu" },
    ];

    // Nama elemen yang digunakan di YouTube Live Chat
    const elName = {
        yt: {
            messageTag: "yt-live-chat-text-message-renderer",
            messageClass: "yt-live-chat-item-list-renderer"
        },
        ytlcb: {
            filteredItemClass: "ytlcb-filtered-item",
            maskedItemClass: "ytlcb-masked-item"
        }
    };

    // Menyimpan teks asli dari pesan yang disembunyikan
    const originalMessages = new Map();

    // Menyimpan referensi fungsi event listener untuk setiap node
    const hoverListeners = new Map();

    // Menghasilkan timestamp dalam format 24 jam
    const generateTimestamp24 = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    // Menormalisasi teks agar filter lebih akurat
    const normalizeText = (text) => text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^\p{ASCII}]/gu, "");

    // Menambahkan timestamp ke setiap pesan jika timestamp diaktifkan
    const appendTimestamp = (messageElement, timestamp) => {
        if (!isTimestamp) return; // Jika timestamp dinonaktifkan, akan dihentikan
        if (messageElement.querySelector('.ytlcb-timestamp')) return; // Mencegah duplikasi

        const timestampSpan = document.createElement('span');
        timestampSpan.textContent = ` [${timestamp}]`;
        timestampSpan.style.fontSize = '12px';
        timestampSpan.style.color = 'gray';
        timestampSpan.style.marginLeft = '8px';
        timestampSpan.classList.add('ytlcb-timestamp');
        messageElement.appendChild(timestampSpan);
    };

    // Filter pesan sesuai aturan yang diberikan
    const filterMessages = (nodes) => {
        nodes.forEach(node => {
            let messageElement = node.querySelector("#message");
            if (!messageElement) return;

            let originalMessage = messageElement.textContent;

            let normalizedMessage = normalizeText(originalMessage);

            const matched = rules.some(rule => {
                const regexp = new RegExp(rule.text, rule.flags || "i");
                return regexp.test(normalizedMessage);
            });

            if (matched) {
                if (isMasking) {
                    // Menyimpan pesan asli jika belum disimpan
                    if (!originalMessages.has(node)) {
                        originalMessages.set(node, originalMessage);
                    }
                    // Menyembunyikan pesan
                    node.classList.add(elName.ytlcb.maskedItemClass);
                    messageElement.textContent = "[PESAN DISEMBUNYIKAN]";

                    // Menambahkan timestamp setelah pesan disembunyikan
                    const timestamp = generateTimestamp24();
                    appendTimestamp(messageElement, timestamp);

                    // Membuat fungsi event listener
                    const mouseOverListener = () => {
                        if (originalMessages.has(node)) {
                            messageElement.textContent = originalMessages.get(node);
                            appendTimestamp(messageElement, timestamp);
                        }
                    };

                    const mouseOutListener = () => {
                        messageElement.textContent = "[PESAN DISEMBUNYIKAN]";
                        appendTimestamp(messageElement, timestamp);
                    };

                    // Menambahkan event listener untuk hover
                    node.addEventListener("mouseover", mouseOverListener);
                    node.addEventListener("mouseout", mouseOutListener);

                    // Menyimpan referensi listener untuk penghapusan nanti
                    hoverListeners.set(node, { mouseOverListener, mouseOutListener });
                } else {
                    // Memblokir pesan
                    node.classList.add(elName.ytlcb.filteredItemClass);
                }
            } else {
                // Menambahkan timestamp ke pesan yang tidak diblokir
                const timestamp = generateTimestamp24();
                appendTimestamp(messageElement, timestamp);
            }
        });
    };

    // Mengembalikan pesan ke teks asli saat filter dimatikan
    const restoreMessages = (nodes) => {
        nodes.forEach(node => {
            if (originalMessages.has(node)) {
                // Mengembalikan teks asli dari pesan
                let messageElement = node.querySelector("#message");
                if (messageElement) {
                    messageElement.textContent = originalMessages.get(node);
                }
                // Menghapus class sembunyikan atau diblokir
                node.classList.remove(elName.ytlcb.maskedItemClass);
                node.classList.remove(elName.ytlcb.filteredItemClass);

                // Menghapus event listener hover jika ada
                if (hoverListeners.has(node)) {
                    const { mouseOverListener, mouseOutListener } = hoverListeners.get(node);
                    node.removeEventListener("mouseover", mouseOverListener);
                    node.removeEventListener("mouseout", mouseOutListener);
                    hoverListeners.delete(node);
                }

                // Menghapus pesan asli dari map
                originalMessages.delete(node);
            }

            // Menghapus timestamp jika ada
            let messageElement = node.querySelector("#message");
            if (messageElement) {
                const timestampSpan = messageElement.querySelector('.ytlcb-timestamp');
                if (timestampSpan) {
                    timestampSpan.remove();
                }
            }
        });
    };

    // Filter semua pesan yang ada di layar
    const filterAllMessages = () => {
        const nodes = document.querySelectorAll(`${elName.yt.messageTag}.${elName.yt.messageClass}`);
        nodes.forEach(node => {
            node.classList.remove(elName.ytlcb.filteredItemClass);
            node.classList.remove(elName.ytlcb.maskedItemClass);

            // Menghapus timestamp jika ada
            let messageElement = node.querySelector("#message");
            if (messageElement) {
                const timestampSpan = messageElement.querySelector('.ytlcb-timestamp');
                if (timestampSpan) {
                    timestampSpan.remove();
                }
            }
        });
        if (isBlocking && rules.length !== 0) {
            filterMessages(nodes);
        } else {
            // Mengembalikan pesan ke teks asli jika filter dimatikan
            restoreMessages(nodes);
        }
    };

    // Menambahkan tombol toggle untuk mengaktifkan/menonaktifkan
    const addToggleButton = () => {
        // Mencari elemen header chat. Struktur DOM YouTube bisa berubah, jadi kita coba beberapa selektor.
        const headerSelectors = [
            '#header-author',
            '#chat-header',
            '#chat-messages'
        ];
        let header = null;
        for (const selector of headerSelectors) {
            header = document.querySelector(selector);
            if (header) break;
        }

        if (header) {
            const button = document.createElement("button");
            updateToggleButton(button);

            button.addEventListener('click', () => {
                isBlocking = !isBlocking;
                updateToggleButton(button);
                filterAllMessages();
            });

            header.appendChild(button);
        }
    };

    // Memperbarui tampilan tombol toggle
    const updateToggleButton = (button) => {
        if (isBlocking) {
            if (isMasking) {
                button.textContent = "🔇 PROMOSI JUDOL : DISEMBUNYIKAN";
                button.style.backgroundColor = "#FF9800";
            } else {
                button.textContent = "🔇 PROMOSI JUDOL : DIBLOKIR";
                button.style.backgroundColor = "#4CAF50";
            }
        } else {
            button.textContent = "🔇 PROMOSI JUDOL : NONAKTIF";
            button.style.backgroundColor = "#f44336";
        }
        button.style.cssText += `
            position: relative;
            color: white;
            border: none;
            padding: 10px;
            cursor: pointer;
            border-radius: 8px;
            font-weight: bold;
        `;
    };

    // Inisialisasi Skrip
    const init = () => {
        // Menambahkan CSS untuk menyembunyikan pesan yang diblokir atau disembunyikan
        const style = document.createElement("style");
        style.textContent = `
            ${elName.yt.messageTag}.${elName.ytlcb.filteredItemClass} {
                display: none !important;
            }
            ${elName.yt.messageTag}.${elName.ytlcb.maskedItemClass} #message {
                color: #FF9800;
            }
            .ytlcb-timestamp {
                font-size: 12px;
                color: gray;
                margin-left: 8px;
            }
        `;
        document.head.appendChild(style);

        // Mengawasi perubahan pada elemen chat
        const chatListNode = document.querySelector("#chat") || document.querySelector("#items");
        if (chatListNode) {
            filterAllMessages();
            const chatObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    const chatNodes = [...mutation.addedNodes].filter(node =>
                        node.nodeType === Node.ELEMENT_NODE && node.matches(`${elName.yt.messageTag}.${elName.yt.messageClass}`)
                    );
                    if (isBlocking && rules.length !== 0) {
                        filterMessages(chatNodes);
                    }
                });
            });
            chatObserver.observe(chatListNode, { childList: true, subtree: true });
        }

        // Menambahkan tombol toggle filter
        addToggleButton();
    };

    // Memulai script setelah halaman selesai dimuat
    window.addEventListener('load', init);
})();

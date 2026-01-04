// ==UserScript==
// @name         MaruMaru 日本語歌詞假名匯出（方便離線保存）
// @author       Hollen9
// @namespace    http://hollen9.com/
// @version      1.1.2
// @description  Show ruby lyrics in new tab with title + artist (based on DOM flow)
// @match        https://www.marumaru-x.com/japanese-song/play-*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542342/MaruMaru%20%E6%97%A5%E6%9C%AC%E8%AA%9E%E6%AD%8C%E8%A9%9E%E5%81%87%E5%90%8D%E5%8C%AF%E5%87%BA%EF%BC%88%E6%96%B9%E4%BE%BF%E9%9B%A2%E7%B7%9A%E4%BF%9D%E5%AD%98%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/542342/MaruMaru%20%E6%97%A5%E6%9C%AC%E8%AA%9E%E6%AD%8C%E8%A9%9E%E5%81%87%E5%90%8D%E5%8C%AF%E5%87%BA%EF%BC%88%E6%96%B9%E4%BE%BF%E9%9B%A2%E7%B7%9A%E4%BF%9D%E5%AD%98%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function buildRubyHTML(rubyElement) {
        const ruby = document.createElement('ruby');
        rubyElement.childNodes.forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                const tag = child.tagName.toLowerCase();
                if (tag === 'rb' || tag === 'rt') {
                    const newEl = document.createElement(tag);
                    newEl.textContent = child.textContent;
                    ruby.appendChild(newEl);
                }
            } else if (child.nodeType === Node.TEXT_NODE) {
                ruby.appendChild(document.createTextNode(child.textContent));
            }
        });
        return ruby;
    }

    function processLine(p) {
        const result = document.createElement('p');
        p.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                result.appendChild(document.createTextNode(node.textContent));
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tag = node.tagName.toLowerCase();
                if (tag === 'ruby') {
                    result.appendChild(buildRubyHTML(node));
                } else if (tag === 'br') {
                    result.appendChild(document.createElement('br'));
                } else {
                    result.appendChild(document.createTextNode(node.textContent));
                }
            }
        });
        return result.outerHTML;
    }

    function extractLyrics() {
        const lines = document.querySelectorAll('#lyrics-list .lyrics-source-display > p');
        return Array.from(lines).map(processLine).join('\n');
    }

    function getSongTitle() {
        const titleEl = document.querySelector('h2.song-name');
        if (!titleEl) return 'Untitled';

        let result = '';

        titleEl.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                result += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tag = node.tagName.toLowerCase();
                if (tag === 'ruby') {
                    node.childNodes.forEach(child => {
                        if (child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() === 'rb') {
                            result += child.textContent;
                        } else if (child.nodeType === Node.TEXT_NODE) {
                            result += child.textContent;
                        }
                    });
                }
            }
        });

        return result.trim();
    }

    function getSongTitleHTML() {
        const titleEl = document.querySelector('h2.song-name');
        return titleEl ? titleEl.outerHTML : '<h2>Untitled</h2>';
    }

    function getArtistName() {
        const titleEl = document.querySelector('h2.song-name');
        let next = titleEl?.nextElementSibling;
        while (next && next.tagName.toLowerCase() !== 'h3') {
            next = next.nextElementSibling;
        }
        return next ? next.textContent.trim() : 'Unknown Artist';
    }

    function openInNewTab(htmlContent, titleText, artistText) {
        const win = window.open('', '_blank');
        const doc = win.document;
        doc.open();
        doc.write('<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body></body></html>');
        doc.close();

        const head = doc.head;
        const body = doc.body;
        doc.title = `${artistText} - ${titleText}`;

        // Insert <style>
        const style = doc.createElement('style');
        style.textContent = `
        body {
            font-family: "Hiragino Kaku Gothic Pro", "Meiryo", sans-serif;
            padding: 2em;
            line-height: 1.8;
            font-size: 18px;
            background: #f9f9f9;
            color: #222;
        }
        ruby {
            ruby-position: over;
        }
        p {
            margin-bottom: 1em;
        }
        h2, h3 {
            margin-top: 0;
            text-align: left;
        }
        h2 {
            font-size: 1.6em;
        }
        h3 {
            font-size: 1.2em;
            color: #666;
        }
        #save-button {
            position: fixed;
            bottom: 24px;
            right: 24px;
            padding: 10px 16px;
            font-size: 14px;
            background-color: #444;
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            z-index: 9999;
        }
        #save-button:hover {
            background-color: #222;
        }
    `;
        head.appendChild(style);

        // Insert song title
        const titleContainer = document.querySelector('h2.song-name');
        body.appendChild(titleContainer.cloneNode(true));

        // Insert artist
        const h3 = doc.createElement('h3');
        h3.textContent = artistText;
        body.appendChild(h3);

        body.appendChild(doc.createElement('hr'));

        // Insert lyrics
        const container = doc.createElement('div');
        container.innerHTML = htmlContent;
        body.appendChild(container);

        // Insert save button
        const saveBtn = doc.createElement('button');
        saveBtn.id = 'save-button';
        saveBtn.textContent = '💾 另存 HTML';
        saveBtn.addEventListener('click', () => {
            // 暫時隱藏按鈕
            saveBtn.style.display = 'none';

            // 重新組成 HTML
            const fullHTML = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
            const blob = new Blob([fullHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = doc.createElement('a');
            a.href = url;
            a.download = doc.title + '.html';
            a.click();
            URL.revokeObjectURL(url);

            // 恢復顯示按鈕（保證原分頁可繼續使用）
            setTimeout(() => {
                saveBtn.style.display = 'block';
            }, 100);
        });
        body.appendChild(saveBtn);
    }

    function createButton() {
        const btn = document.createElement('button');
        btn.textContent = '📖 匯出';
        btn.style.position = 'fixed';
        btn.style.bottom = '24px';
        btn.style.right = '60px';
        btn.style.zIndex = 9999;
        btn.style.padding = '10px 16px';
        btn.style.background = '#222';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';

        btn.addEventListener('click', () => {
            const songTitle = getSongTitle();
            const artistName = getArtistName();
            const lyrics = extractLyrics();
            openInNewTab(lyrics, songTitle, artistName);
        });

        document.body.appendChild(btn);
    }

    window.addEventListener('load', createButton);
})();
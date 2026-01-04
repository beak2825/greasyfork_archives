// ==UserScript==
// @name         NipponDict
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Japanese dictionary, pop-up, using Jisho
// @author       iljann
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/539225/NipponDict.user.js
// @updateURL https://update.greasyfork.org/scripts/539225/NipponDict.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #jp-popup {
            position: fixed; z-index: 999999; display: none;
            background: #FEFEFE; border: 1px solid #E8E8E8; border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.08); font-family: system-ui, sans-serif;
            max-width: 400px; min-width: 280px; padding: 0;
        }
        #jp-header {
            background: linear-gradient(135deg, #FFF8F0, #F0F8FF);
            color: #6B7280; padding: 12px 16px; border-radius: 12px 12px 0 0;
            font-size: 13px; font-weight: 500; position: relative;
        }
        #jp-header::before { content: "あ"; color: #F59E0B; font-weight: 600; margin-right: 8px; }
        #jp-close {
            position: absolute; top: 8px; right: 12px; background: none;
            border: none; color: #9CA3AF; cursor: pointer; font-size: 16px;
        }
        #jp-content {
            padding: 16px; background: #FEFEFE; color: #374151;
            max-height: 350px; overflow-y: auto; border-radius: 0 0 12px 12px;
        }
        .jp-word {
            font-size: 20px; color: #1F2937; font-weight: 600; text-align: center;
            padding: 10px; background: linear-gradient(135deg, #FFF7ED, #FEF3C7);
            border-radius: 6px; margin-bottom: 12px; border-left: 3px solid #F59E0B;
        }
        .jp-reading {
            font-size: 16px; color: #D97706; text-align: center;
            margin-bottom: 12px; font-style: italic;
        }
        .jp-source {
            background: #FEF3C7; color: #D97706; padding: 2px 6px;
            font-size: 9px; border-radius: 3px; margin-right: 6px;
            text-transform: uppercase; font-weight: 500;
        }
        .jp-def {
            font-size: 14px; line-height: 1.5; color: #374151;
            padding: 12px; background: #FEFEFE; border: 1px solid #F3F4F6;
            border-radius: 6px; margin-bottom: 10px;
        }
        .jp-pos {
            background: #F1F5F9; color: #64748B; padding: 2px 6px;
            font-size: 9px; border-radius: 3px; margin-right: 6px;
            text-transform: uppercase; font-weight: 500;
        }
        .jp-tags {
            margin-top: 6px;
        }
        .jp-tag {
            background: #E0E7FF; color: #3730A3; padding: 1px 4px;
            font-size: 8px; border-radius: 2px; margin-right: 4px;
            text-transform: lowercase;
        }
        .jp-loading {
            text-align: center; padding: 30px; color: #6B7280;
            animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .jp-error { text-align: center; padding: 20px; color: #6B7280; font-size: 13px; }
    `);

    const popup = document.createElement('div');
    popup.id = 'jp-popup';
    popup.innerHTML = `
        <div id="jp-header">NipponDict <button id="jp-close">×</button></div>
        <div id="jp-content"></div>
    `;
    document.body.appendChild(popup);

    const content = document.getElementById('jp-content');
    const closeBtn = document.getElementById('jp-close');
    const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;

    let isVisible = false;
    let timeout;

    function close() {
        popup.style.display = 'none';
        isVisible = false;
    }

    function position(x, y) {
        let left = x + 15;
        let top = y + 15;
        if (left + 400 > window.innerWidth) left = x - 415;
        if (top + 250 > window.innerHeight) top = y - 265;
        popup.style.left = Math.max(10, left) + 'px';
        popup.style.top = Math.max(10, top) + 'px';
    }

    function getJapaneseText(element) {
        const selection = window.getSelection().toString().trim();
        if (selection && japaneseRegex.test(selection)) return selection;
        if (!element) return null;
        const text = element.textContent || element.innerText || '';
        const match = text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/);
        return match ? match[0] : null;
    }

    // Query Jisho API
    function queryJisho(word) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(word)}`,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                onload: function(response) {
                    try {
                        if (response.status === 200) {
                            const data = JSON.parse(response.responseText);
                            if (data.data && data.data.length > 0) {
                                const results = data.data.slice(0, 4).map(entry => {
                                    const japanese = entry.japanese[0] || {};
                                    const senses = entry.senses || [];
                                    return {
                                        word: japanese.word || japanese.reading || word,
                                        reading: japanese.reading || '',
                                        senses: senses.slice(0, 3).map(sense => ({
                                            pos: sense.parts_of_speech || [],
                                            definitions: sense.english_definitions || [],
                                            tags: sense.tags || []
                                        }))
                                    };
                                });
                                resolve(results);
                            } else {
                                resolve([]);
                            }
                        } else {
                            console.log('Jisho request failed:', response.status);
                            resolve([]);
                        }
                    } catch (e) {
                        console.log('Jisho parse error:', e);
                        resolve([]);
                    }
                },
                onerror: function(error) {
                    console.log('Jisho request error:', error);
                    resolve([]);
                }
            });
        });
    }

    function displayResults(word, results) {
        if (results.length === 0) {
            content.innerHTML = `<div class="jp-error">No definition found for "${word}" on Jisho</div>`;
            return;
        }

        let html = '';
        results.forEach((result, index) => {
            html += `<div class="jp-word">${result.word}</div>`;
            if (result.reading && result.reading !== result.word) {
                html += `<div class="jp-reading">${result.reading}</div>`;
            }
            result.senses.forEach((sense, senseIndex) => {
                html += `<div class="jp-def">`;
                html += `<span class="jp-source">jisho</span>`;
                // Parts of speech
                if (sense.pos && sense.pos.length > 0) {
                    sense.pos.forEach(pos => {
                        html += `<span class="jp-pos">${pos}</span>`;
                    });
                }
                // Definitions
                html += `<div style="margin-top: 6px;">${sense.definitions.join('; ')}</div>`;
                // Tags
                if (sense.tags && sense.tags.length > 0) {
                    html += `<div class="jp-tags">`;
                    sense.tags.forEach(tag => {
                        html += `<span class="jp-tag">${tag}</span>`;
                    });
                    html += `</div>`;
                }
                html += `</div>`;
            });
        });
        content.innerHTML = html;
    }

    async function show(x, y, word) {
        content.innerHTML = '<div class="jp-loading">Searching...</div>';
        popup.style.display = 'block';
        position(x, y);
        isVisible = true;

        try {
            const results = await queryJisho(word);
            displayResults(word, results);
        } catch (error) {
            console.log('Dictionary query error:', error);
            displayResults(word, []);
        }
    }

    closeBtn.onclick = close;

    document.addEventListener('mousemove', e => {
        if (isVisible) return;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const word = getJapaneseText(e.target);
            if (word) show(e.clientX, e.clientY, word);
        }, 500);
    });

    document.addEventListener('dblclick', e => {
        const word = getJapaneseText(e.target);
        if (word) {
            close();
            setTimeout(() => show(e.clientX, e.clientY, word), 100);
        }
    });

    document.addEventListener('click', e => {
        if (!popup.contains(e.target)) close();
    });

    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            const word = window.getSelection().toString().trim();
            if (word && japaneseRegex.test(word)) {
                isVisible ? close() : show(100, 100, word);
            }
        }
    });

    console.log('Online');
})();

// ==UserScript==
// @name         SoundCloud Genius Lyrics
// @icon         https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14bdb.ico
// @version      1
// @description  Displays song lyrics on SoundCloud using the built-in Genius API
// @author       tg @arthurlh
// @match        https://soundcloud.com/*
// @grant        GM_xmlhttpRequest
// @connect      genius.com
// @namespace https://greasyfork.org/users/1470476
// @downloadURL https://update.greasyfork.org/scripts/536091/SoundCloud%20Genius%20Lyrics.user.js
// @updateURL https://update.greasyfork.org/scripts/536091/SoundCloud%20Genius%20Lyrics.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function removeEmojis(text) {
        return text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uFE0F)/g, '');
    }

    function processTitle(title) {
        return removeEmojis(title)
            .replace(/[\u180E\u200B-\u200D\u2060\uFEFF]+/g, '')
            .replace(/[\s\u0009-\u000D\u0020\u0085\u00A0\u1680\u2000-\u200A\u2028-\u2029\u202F\u205F\u3000\u00B7\u237D\u2420\u2422\u2423]+/g, ' ')
            .replace(/│/g, '|')
            .replace(/【([^【】]+)】/g, '[$1]')
            .replace(/\(([^()]+)\)/g, '[$1]')
            .replace(/『([^『』]+)』/g, '[$1]')
            .replace(/「([^「」]+)」/g, '[$1]')
            .replace(/\[(MV|PV)\]/g, '')
            .trim();
    }

    const GeniusLyrics = {
        searchSong: function (query) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://genius.com/api/search/multi?per_page=5&q=${encodeURIComponent(query)}`,
                    onload: function (response) {
                        try {
                            const json = JSON.parse(response.responseText);
                            const sections = json.response.sections;
                            for (let section of sections) {
                                if (section.type === "song" && section.hits.length > 0) {
                                    const songUrl = section.hits[0].result.url;
                                    resolve(songUrl);
                                    return;
                                }
                            }
                            reject("Song not found");
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: function (e) {
                        reject(e);
                    }
                });
            });
        },

        getLyrics: function (query) {
            return new Promise((resolve, reject) => {
                this.searchSong(query).then(url => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        onload: function (response) {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, 'text/html');
                            const containers = doc.querySelectorAll('div[data-lyrics-container="true"]');
                            let lyrics = '';

                            containers.forEach(container => {
                                container.childNodes.forEach(node => {
                                    if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                                        const text = node.textContent.trim();
                                        if (text.length > 0) {
                                            lyrics += text + '\n';
                                        }
                                    }
                                });
                                lyrics += '\n';
                            });

                            resolve(lyrics.trim());
                        },
                        onerror: function (e) {
                            reject(e);
                        }
                    });
                }).catch(reject);
            });
        }
    };

    function injectLyrics() {
        const targetElement = document.querySelector('#content > div:nth-child(1) > div.l-listen-wrapper > div.l-about-main > div > div:nth-child(1)');
        const titleElement = document.querySelector('#content h1 > span');

        if (!targetElement || !titleElement) return;

        const songTitle = processTitle(titleElement.innerText || '');
        if (!songTitle) return;

        if (document.getElementById('genius-lyrics-block')) return;

        GeniusLyrics.getLyrics(songTitle).then(lyrics => {
            setTimeout(() => {
                if (document.getElementById('genius-lyrics-block')) return;

                const wrapper = document.createElement('div');
                wrapper.id = 'genius-lyrics-block';
                wrapper.style.padding = '1em';
                wrapper.style.margin = '1em 0';
                //wrapper.style.setProperty('background', '#000000', 'important');
                //wrapper.style.color = '#ffffff';
                wrapper.style.whiteSpace = 'pre-wrap';
                wrapper.style.borderRadius = '8px';
                wrapper.style.fontSize = '14px';
                wrapper.style.lineHeight = '1.5';
                //wrapper.style.maxWidth = '500px';
                wrapper.style.marginLeft = 'auto';
                wrapper.style.marginRight = '0';
                wrapper.style.position = 'relative';

                wrapper.innerHTML = (lyrics || 'No lyrics found.')
                    .replace(/\n/g, '<br>')
                    .replace(/^(\d+\s+Contributors.*?)<br>/i, '')
                    .trim();

                targetElement.insertAdjacentElement('afterend', wrapper);
            }, 0)
        }).catch(err => {
            console.error('Error receiving text:', err);
        });
    }

    const observer = new MutationObserver(() => {
        injectLyrics();
    });

    const waitForContent = setInterval(() => {
        const target = document.querySelector('#content');
        if (target) {
            clearInterval(waitForContent);
            observer.observe(target, { childList: true, subtree: true });
            injectLyrics();
        }
    }, 1000);
})();

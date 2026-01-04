// ==UserScript==
// @name         Ethos TikTok Video / Audio Downloader
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a download button on TikTok.com and gives the user the option to Download the video or download the audio or just close the GUI. Uses the Ethos TikTok API.
// @author       Shehajeez
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/490094/Ethos%20TikTok%20Video%20%20Audio%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/490094/Ethos%20TikTok%20Video%20%20Audio%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function istiktokurl(url) {
        return url.startsWith("https://vm.tiktok.com") ||
               url.startsWith("https://vt.tiktok.com") ||
               url.match(/^https:\/\/(www\.)?tiktok\.com\/@.+\/video\/\d+$/);
    }

    function addguı() {
        const c = document.createElement('div');
        c.id = 'ttd-gui';
        c.style.position = 'fixed';
        c.style.bottom = '20px';
        c.style.left = '50%';
        c.style.transform = 'translateX(-50%)';
        c.style.background = '#333';
        c.style.padding = '10px';
        c.style.borderRadius = '10px';
        c.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)';
        c.style.zIndex = '9999';
        c.style.transition = 'opacity 0.3s, transform 0.3s';
        c.style.opacity = '0';
        c.style.width = '90%';
        c.style.maxWidth = '400px';
        c.style.display = 'flex';
        c.style.justifyContent = 'space-around';
        c.style.alignItems = 'center';
        c.style.fontFamily = 'Montserrat, sans-serif';
        c.style.color = '#fff';

        const b = document.createElement('button');
        b.innerText = 'X';
        b.style.border = 'none';
        b.style.background = 'none';
        b.style.color = '#fff';
        b.style.fontSize = '16px';
        b.style.cursor = 'pointer';
        b.style.fontFamily = 'Montserrat, sans-serif';
        b.style.transition = 'color 0.3s';
        b.addEventListener('mouseover', function() {
            b.style.color = '#f44336';
        });
        b.addEventListener('mouseleave', function() {
            b.style.color = '#fff';
        });

        const v = cb('Download Video', '#4CAF50');
        const a = cb('Download Audio', '#2196F3');

        c.appendChild(b);
        c.appendChild(v);
        c.appendChild(a);

        document.body.appendChild(c);

        v.addEventListener('click', function() {
            sdr('video');
        });

        a.addEventListener('click', function() {
            sdr('audio');
        });

        b.addEventListener('click', function() {
            c.style.opacity = '0';
            c.style.transform = 'scale(0.8)';
            setTimeout(() => {
                c.remove();
            }, 300);
        });

        setTimeout(() => {
            c.style.opacity = '1';
        }, 100);
    }

    function cb(t, c) {
        const b = document.createElement('button');
        b.innerText = t;
        b.style.padding = '10px';
        b.style.border = 'none';
        b.style.borderRadius = '5px';
        b.style.background = c;
        b.style.color = '#fff';
        b.style.fontSize = '16px';
        b.style.fontWeight = 'bold';
        b.style.cursor = 'pointer';
        b.style.transition = 'background 0.3s';
        b.style.fontFamily = 'Montserrat, sans-serif';
        b.addEventListener('mouseover', function() {
            b.style.background = d(c);
        });
        b.addEventListener('mouseleave', function() {
            b.style.background = c;
        });
        return b;
    }

    function d(c) {
        const h = c.replace('#', '');
        const r = parseInt(h.substring(0, 2), 16);
        const g = parseInt(h.substring(2, 4), 16);
        const b = parseInt(h.substring(4, 6), 16);
        const dr = Math.round(r * 0.8);
        const dg = Math.round(g * 0.8);
        const db = Math.round(b * 0.8);
        return `#${(dr * 0x10000 + dg * 0x100 + db).toString(16).padStart(6, '0')}`;
    }

    function sdr(t) {
        const u = window.location.href;
        const e = `https://ethos-testing.vercel.app/api/tiktok?link=${encodeURIComponent(u)}&type=${t}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: e,
            onload: function(response) {
                const r = JSON.parse(response.responseText);
                if (t === 'video' && r.video) {
                    window.location.href = r.video;
                } else if (t === 'audio' && r.audio) {
                    window.location.href = r.audio;
                } else {
                    console.error("No download link available");
                }
            },
            onerror: function(error) {
                console.error("Error occurred while fetching download link", error);
            }
        });
    }

    if (istiktokurl(window.location.href)) {
        addguı();
    }
})();

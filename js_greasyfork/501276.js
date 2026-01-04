// ==UserScript==
// @name         Douban Site Playlist Archiver
// @namespace    https://gist.github.com/ned42
// @version      0.1
// @description  douban site for fk's sake
// @author       ned42
// @match        https://site.douban.com/*/widget/playlist/*/edit_songs
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/501276/Douban%20Site%20Playlist%20Archiver.user.js
// @updateURL https://update.greasyfork.org/scripts/501276/Douban%20Site%20Playlist%20Archiver.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addDownloadLink() {
        const nav = document.querySelector('.widget-nav ul');
        if (nav) {
            let songlib_id = String(window.location).split('/')[6]
            const link = document.createElement('li');
            link.style.float = "right"
            const anchor = document.createElement('a');
            anchor.href = '#';
            anchor.textContent = '⇩ 导出';
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                generateMarkdownPlaylist(songlib_id);
            });
            link.appendChild(anchor);
            nav.appendChild(link);
            console.log('insert!')
        }
        else console.log('error')
    }

    async function generateMarkdownPlaylist(songlib_id) {
        console.log('start generating markdown...');

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://site.douban.com/j/widget/playlist/${songlib_id}/songlib?__t=${Date.now()}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    let markdownContent = '';

                    for (const song of data.songs) {
                        const songLine = `★ ${song.title} - ${song.play_length}\n${song.url}\n———————————————————————————————————————\n`;
                        markdownContent += songLine;
                    }
                    const blob = new Blob([markdownContent], {type: "text/plain;charset=utf-8"});
                    const url = URL.createObjectURL(blob);
                    const downloadLink = document.createElement('a');
                    downloadLink.href = url;
                    downloadLink.download = `${document.querySelector('h1').innerText}_${new Date().toLocaleString()}.md`;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    URL.revokeObjectURL(url);
                } catch (e) {
                    console.error('Failed to parse response or generate Markdown:', e);
                }
            }
        });
    }

    document.addEventListener('DOMContentLoaded', ()=>{console.log('loaded');setTimeout(addDownloadLink,2000)});
})();

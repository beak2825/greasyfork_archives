// ==UserScript==
// @name         SLR Hide video shortcut
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Thumb down to hide videos in SLR https://forum.sexlikereal.com/d/6856-mark-videos-as-not-interested
// @author       jambavant
// @match        https://www.sexlikereal.com/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/489016/SLR%20Hide%20video%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/489016/SLR%20Hide%20video%20shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const iconChecked = `<i class="material-icons" style="color: red; font-size: 20px;">thumb_down</i>`
    const iconUnchecked = `<i class="material-icons-outlined" style="color: grey; font-size: 20px;">thumb_down</i>`

    function toggleNotInterested(ptr) {
        const btn = ptr.target.parentElement
        if (btn.classList.contains("is-checked")) {
            GM_xmlhttpRequest({
                method: "POST",
                url: "/ajax/manageuserpreference",
                data: new URLSearchParams({"project": globalObj.projectId, "_id": btn.sceneId, "type": 1,
                                          "action": "remove", "csrf_token": globalObj.csrf_token}).toString(),
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                onload: function(response) {
                    if (JSON.parse(response.responseText).status) {
                        btn.innerHTML = iconUnchecked
                        btn.classList.toggle("is-checked")
                    } else {
                        ptr.view.window.snackbar("Something went wrong when removing")

                    }
                }
            })
        } else {
            GM_xmlhttpRequest({
                method: "POST",
                url: "/ajax/manageuserpreference",
                data: new URLSearchParams({"project": globalObj.projectId, "_id": btn.sceneId, "type": 1,
                                          "action": "add", "csrf_token": globalObj.csrf_token}).toString(),
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                onload: function(response) {
                    if (JSON.parse(response.responseText).status) {
                        btn.innerHTML = iconChecked
                        btn.classList.toggle("is-checked")
                    } else {
                        ptr.view.window.snackbar("Something went wrong when adding")
                    }
                }
            })
        }

    }

    document.head.innerHTML += '<link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined" rel="stylesheet" />'

    function fetchPlaylistsAndUpdateVideos() {

        document.querySelectorAll('article').forEach(article => {
            const sceneId = Number(article.getAttribute('data-scene-id'))
            const watchLaterButton = article.querySelector('.c-playlist-watch-later-trigger--btn');
            const btn = document.createElement('button');
            btn.sceneId = sceneId
            btn.classList = ["o-btn--text"]
            btn.addEventListener('click', toggleNotInterested);
            watchLaterButton.parentElement.appendChild(btn)
            btn.innerHTML = iconUnchecked
        })
    }

    fetchPlaylistsAndUpdateVideos();



})();

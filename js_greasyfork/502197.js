// ==UserScript==
// @name         YouTube Timestamp Tool
// @namespace    http://tampermonkey.net/
// @version      1.24
// @description  Add, manage, and delete timestamps on YouTube videos with local storage capabilities so your timestamps are saved (temporarily)!
// @match        https://www.youtube.com/*
// @author       Modern Disappointment
// @license      Custom License: Permission from the original creator (krazete) required for distribution. Credit must be given, and the original work should be linked. No commercial use without permission.
// @downloadURL https://update.greasyfork.org/scripts/502197/YouTube%20Timestamp%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/502197/YouTube%20Timestamp%20Tool.meta.js
// ==/UserScript==
// This script is based on a project created by krazete, originally posted to r/VirtualYoutubers.
// Credit: krazete
// Original Post: https://redd.it/ifzqe7
// Maintained Source Code: https://github.com/Krazete/bookmarklets/blob/master/ytlivestamper.js

(function() {
    'use strict';

    let previousVideoId = null;

    function getVideoId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v');
    }

    function formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        const formattedH = h > 0 ? String(h).padStart(2, '0') + ':' : '';
        const formattedM = String(m).padStart(2, '0');
        const formattedS = String(s).padStart(2, '0');

        return h > 0 ? `${formattedH}${formattedM}:${formattedS}` : `${formattedM}:${formattedS}`;
    }

    function setTimestamp(element, time) {
        element.textContent = formatTime(time);
        element.dataset.time = time;
        element.href = `https://youtu.be/${getVideoId()}?t=${time}`;
    }

    function handleTimestampClick(e) {
        if (e.target.dataset.time) {
            e.preventDefault();
            document.querySelector("video").currentTime = e.target.dataset.time;
        } else if (e.target.dataset.increment) {
            e.preventDefault();
            const timestampElement = e.target.parentElement.querySelector('a');
            const newTime = parseInt(timestampElement.dataset.time) + parseInt(e.target.dataset.increment);
            setTimestamp(timestampElement, newTime);
            saveTimestamps();
        } else if (e.target.dataset.delete) {
            e.preventDefault();
            e.target.parentElement.remove();
            saveTimestamps();
        }
    }

    function createTimestampElement(time) {
        const li = document.createElement("li");
        const decreaseBtn = document.createElement("span");
        const increaseBtn = document.createElement("span");
        const timeLink = document.createElement("a");
        const descInput = document.createElement("input");
        const deleteBtn = document.createElement("button");

        decreaseBtn.textContent = "➖";
        decreaseBtn.dataset.increment = -1;
        increaseBtn.textContent = "➕";
        increaseBtn.dataset.increment = 1;
        deleteBtn.textContent = "🗑️";
        deleteBtn.dataset.delete = 1;

        setTimestamp(timeLink, time);

        li.appendChild(decreaseBtn);
        li.appendChild(increaseBtn);
        li.appendChild(deleteBtn);
        li.appendChild(timeLink);
        li.appendChild(document.createTextNode(' '));
        li.appendChild(descInput);

        return li;
    }

    function copyTimestamps() {
        if (!previousVideoId) return;
        let output = '';
        let hasTimestamps = false;
        document.querySelectorAll('#timestamp-list li').forEach((li) => {
            const time = li.querySelector('a').textContent;
            const desc = li.querySelector('input').value;
            if (time.trim() || desc.trim()) {
                hasTimestamps = true;
                output += `${time} ${desc}\n`;
            }
        });
        if (hasTimestamps) {
            const videoUrl = `https://youtu.be/${previousVideoId}`;
            navigator.clipboard.writeText(`${output.trim()}\n${videoUrl}`);
        }
    }

    function saveTimestamps() {
        const timestamps = [];
        document.querySelectorAll('#timestamp-list li').forEach(li => {
            const time = li.querySelector('a').dataset.time;
            const desc = li.querySelector('input').value;
            if (time.trim() || desc.trim()) {
                timestamps.push({ time, desc });
            }
        });
        if (timestamps.length > 0) {
            localStorage.setItem('yt-timestamps-' + getVideoId(), JSON.stringify(timestamps));
        } else {
            localStorage.removeItem('yt-timestamps-' + getVideoId());
        }
    }

    function loadTimestamps() {
        const videoId = getVideoId();
        const savedTimestamps = JSON.parse(localStorage.getItem('yt-timestamps-' + videoId) || '[]');
        const list = document.querySelector('#timestamp-list');
        list.textContent = '';
        savedTimestamps.forEach(ts => {
            const li = createTimestampElement(ts.time);
            li.querySelector('input').value = ts.desc;
            list.appendChild(li);
        });
    }

    function initTool() {
        if (!document.querySelector("#ytls-pane")) {
            const pane = document.createElement("div");
            const closeBtn = document.createElement("span");
            const list = document.createElement("ul");
            const textarea = document.createElement("textarea");
            const buttonsDiv = document.createElement("div");
            const importBtn = document.createElement("button");
            const addBtn = document.createElement("button");
            const copyBtn = document.createElement("button");
            const style = document.createElement("style");

            pane.id = "ytls-pane";
            closeBtn.textContent = "x";
            closeBtn.addEventListener("click", () => {
                if (confirm("Close timestamp tool?\n!! This will clear the timestamps for this video/stream from your local storage !!")) {
                    localStorage.removeItem('yt-timestamps-' + getVideoId());
                    pane.remove();
                    window.removeEventListener("beforeunload", handleBeforeUnload);
                }
            });

            list.id = "timestamp-list";
            list.addEventListener("click", handleTimestampClick);
            list.addEventListener("touchstart", handleTimestampClick);

            textarea.id = "ytls-box";
            textarea.style.display = 'none';

            importBtn.textContent = "Import List";
            importBtn.addEventListener("click", () => {
                if (textarea.style.display === 'none') {
                    textarea.style.display = 'block';
                    textarea.focus();
                } else {
                    if (textarea.value.trim() === '') {
                        alert('The import list is empty.');
                        textarea.style.display = 'none';
                        return;
                    }

                    if (confirm('Are you sure you want to overwrite the existing timestamps?')) {
                        const timestamps = textarea.value.split("\n").map(line => {
                            const [time, ...desc] = line.split(' ');
                            const parts = time.split(":").map(part => parseInt(part));
                            const timeInSeconds = parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];
                            return { time: timeInSeconds, desc: desc.join(' ') };
                        });
                        list.textContent = '';
                        timestamps.forEach(ts => {
                            const li = createTimestampElement(ts.time);
                            li.querySelector('input').value = ts.desc;
                            list.appendChild(li);
                        });
                        saveTimestamps();
                        textarea.style.display = 'none';
                    }
                }
            });

            addBtn.textContent = "Add Timestamp";
            addBtn.addEventListener("click", () => {
                const currentTime = Math.max(0, Math.floor(document.querySelector("video").currentTime));
                const li = createTimestampElement(currentTime);
                list.appendChild(li);
                li.querySelector('input').focus();
                saveTimestamps();
            });

            copyBtn.textContent = "Copy List";
            copyBtn.addEventListener("click", copyTimestamps);

            buttonsDiv.id = "ytls-buttons";
            buttonsDiv.appendChild(addBtn);
            buttonsDiv.appendChild(copyBtn);
            buttonsDiv.appendChild(importBtn);

            style.textContent = `
                #ytls-pane {
                    background: rgba(0,0,0,.55);
                    text-align: left;
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    padding: 5px;
                    opacity: .60;
                    z-index: 5000;
                    cursor: move;
                    width: 400px;
                    height: 200px;
                    max-height: 50vh;
                    overflow: hidden;
                }
                #ytls-pane:hover { opacity: 1; }
                #ytls-pane span { cursor: pointer; }
                #ytls-pane ul {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    max-height: calc(100% - 40px);
                    overflow-y: auto;
                }
                #ytls-pane span, #ytls-pane a, #ytls-pane input {
                    background: none;
                    color: white;
                    font-family: inherit;
                    font-size: initial;
                    text-decoration: none;
                    border: none;
                    outline: none;
                }
                #ytls-box {
                    font-family: monospace;
                    width: 100%;
                    display: block;
                    padding: 5px;
                    border: none;
                    outline: none;
                    resize: none;
                    height: 40px;
                    overflow-y: auto;
                    display: none;
                }
                #ytls-buttons {
                    display: flex;
                    gap: 10px;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                }
                #ytls-buttons button {
                    background: transparent;
                    color: white;
                    font-size: 12px;
                    flex: auto;
                    padding: 2px;
                    border: 1px solid white;
                }
                #ytls-pane li {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    margin: 2px 0;
                }
                #ytls-pane a {
                    margin-right: 5px;
                }
            `;

            pane.appendChild(closeBtn);
            pane.appendChild(list);
            pane.appendChild(textarea);
            pane.appendChild(buttonsDiv);
            pane.appendChild(style);

            document.body.appendChild(pane);

            let isDragging = false;
            let startX, startY, startLeft, startTop;

            pane.addEventListener('mousedown', (e) => {
                if (e.target === closeBtn) return;
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                startLeft = parseInt(window.getComputedStyle(pane).left, 10) || 0;
                startTop = parseInt(window.getComputedStyle(pane).top, 10) || 0;
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });

            function onMouseMove(e) {
                if (!isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                pane.style.left = `${Math.min(window.innerWidth - pane.offsetWidth, Math.max(0, startLeft + dx))}px`;
                pane.style.top = `${Math.min(window.innerHeight - pane.offsetHeight, Math.max(0, startTop + dy))}px`;
            }

            function onMouseUp() {
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            function handleFullscreenChange() {
                if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
                    pane.style.display = 'none';
                } else {
                    pane.style.display = 'block';
                }
            }

            document.addEventListener("fullscreenchange", handleFullscreenChange);
            document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
            document.addEventListener("mozfullscreenchange", handleFullscreenChange);
            document.addEventListener("MSFullscreenChange", handleFullscreenChange);
        }

        loadTimestamps();
    }

    function handleBeforeUnload(e) {
        if (document.querySelector("#ytls-pane")) {
            copyTimestamps();
            e.preventDefault();
            e.returnValue = "Close timestamp tool?\n!! This will clear the timestamps for this video/stream from your local storage !!";
            return e.returnValue;
        }
    }

    function handleNavigation() {
        if (location.pathname === '/watch') {
            const videoId = getVideoId();
            if (previousVideoId && previousVideoId !== videoId) {
                copyTimestamps();
            }
            previousVideoId = videoId;
            initTool();
        } else {
            if (document.querySelector("#ytls-pane")) {
                document.querySelector("#ytls-pane").style.display = "none";
            }
        }
    }
    window.addEventListener("yt-navigate-finish", handleNavigation);
    window.addEventListener("beforeunload", handleBeforeUnload);
    handleNavigation();
})();
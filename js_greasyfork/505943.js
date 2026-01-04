// ==UserScript==
// @name         Music Player for Open Directories
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  A full-page music player with a modern interface, including download buttons, time display, and interaction banners.
// @author       GhostyTongue
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505943/Music%20Player%20for%20Open%20Directories.user.js
// @updateURL https://update.greasyfork.org/scripts/505943/Music%20Player%20for%20Open%20Directories.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var e, t, n = document.links, i = [], o = 0;
    for (t in n) {
        var a = n[t].toString().toUpperCase();
        if (a.indexOf("JAVASCRIPT:") !== 0 && (a.indexOf(".MP3") !== -1 || a.indexOf(".FLAC") !== -1 || a.indexOf(".OGG") !== -1 || a.indexOf(".WAV") !== -1)) {
            i.push(n[t]);
        }
    }

    if (i.length > 0) {
        var d = x("div", "player-container", "", "", ""),
            header = x("div", "player-header", "", "", ""),
            parentButton = x("button", "parent-button", "Parent Directory", "", function() {
                window.location.href = "../";
            }),
            title = x("div", "player-title", "Music Player", "", ""),
            r = x("div", "playing", "", "", ""),
            p = x("div", "progressbar", "", "", function(t) {
                var n = t.clientX;
                n /= window.innerWidth;
                e.currentTime = e.duration * n;
            }),
            l = x("div", "progress", "", "", ""),
            timeDisplay = x("div", "time-display", "0:00", "", "");
        p.appendChild(l);
        r.appendChild(p);
        r.appendChild(timeDisplay);

        header.appendChild(parentButton);
        header.appendChild(title);
        d.appendChild(header);

        var s = x("div", "songname", "", "", "");
        r.appendChild(s);

        var u = x("div", "buttons", "", "", "");
        var playPauseButton = x("button", "control-button", "⏯", "", function() {
            e.paused ? (e.play(), this.innerHTML = "⏯") : (e.pause(), this.innerHTML = "▶️");
            showBanner(e.paused ? "Paused" : "Playing");
        });
        u.appendChild(playPauseButton);
        u.appendChild(x("button", "control-button", "⏮", "", y));
        u.appendChild(x("button", "control-button", "⏭", "", C));
        u.appendChild(x("button", "control-button", "🔀", "", function() {
            o = Math.floor(Math.random() * i.length);
            f();
        }));
        r.appendChild(u);
        d.appendChild(r);

        var c = x("ul", "playlist", "", "", "");
        for (var songIndex in i) {
            var h = decodeURIComponent(unescape(i[songIndex].href)),
                li = x("li", "playlist-item", h.substring(h.lastIndexOf("/") + 1), songIndex, function() {
                    o = parseInt(this.getAttribute("data"));
                    f();
                }),
                downloadButton = x("a", "download-button", "Download", "", function(e) {
                    e.stopPropagation();
                });
            downloadButton.href = h;
            downloadButton.download = h.substring(h.lastIndexOf("/") + 1);
            li.appendChild(downloadButton);
            c.appendChild(li);
        }
        d.appendChild(c);

        var g = x("style", "", "", "", "");
        g.innerHTML = `
            .player-container {
                position: fixed;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                background-color: #282c34;
                color: white;
                font-family: Arial, sans-serif;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                z-index: 1000;
            }
            .player-header {
                display: flex;
                justify-content: center;
                padding: 10px;
                background-color: #20232a;
                border-bottom: 1px solid #444;
            }
            .parent-button {
                position: absolute;
                left: 10px;
                background-color: #61dafb;
                border: none;
                color: #282c34;
                padding: 10px 20px;
                cursor: pointer;
                font-weight: bold;
            }
            .player-title {
                font-size: 2em;
                margin: auto;
                text-align: center;
            }
            .playing {
                padding: 20px;
            }
            .progressbar {
                position: relative;
                height: 20px;
                background-color: #444;
                border-radius: 10px;
                margin-bottom: 10px;
                cursor: pointer;
            }
            .progress {
                position: absolute;
                height: 100%;
                background-color: #61dafb;
                border-radius: 10px;
            }
            .time-display {
                text-align: center;
                font-size: 1em;
                margin-bottom: 20px;
            }
            .songname {
                margin-bottom: 20px;
                text-align: center;
                font-size: 1.5em;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .buttons {
                text-align: center;
                margin-bottom: 20px;
            }
            .control-button {
                background: none;
                border: none;
                color: #61dafb;
                font-size: 3em;
                cursor: pointer;
                margin: 0 20px;
            }
            .playlist {
                flex: 1;
                overflow-y: auto;
                background-color: #20232a;
                padding: 20px;
                list-style: none;
                margin: 0;
            }
            .playlist-item {
                padding: 10px;
                cursor: pointer;
                border-bottom: 1px solid #444;
                font-size: 1.2em;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .playlist-item:hover {
                background-color: #61dafb;
                color: #282c34;
            }
            .download-button {
                background-color: #61dafb;
                border: none;
                color: #282c34;
                padding: 5px 10px;
                cursor: pointer;
                font-size: 0.9em;
                text-decoration: none;
                border-radius: 5px;
            }
            .banner {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: #61dafb;
                color: #282c34;
                padding: 10px 20px;
                border-radius: 5px;
                display: none;
                font-size: 1.2em;
                z-index: 1001;
                transition: opacity 0.5s;
            }
        `;
        d.appendChild(g);

        var banner = x("div", "banner", "", "", "");
        d.appendChild(banner);

        var m = document.createElement("meta"),
            b = document.createAttribute("name");
        b.value = "viewport";
        m.setAttributeNode(b);
        b = document.createAttribute("content");
        b.value = "width=device-width, initial-scale=1";
        m.setAttributeNode(b);
        document.head.appendChild(m);
        document.body.innerHTML = "";
        document.body.appendChild(d);

        (e = new Audio()).addEventListener("ended", C, !1);
        v();
        f();
        navigator.mediaSession.setActionHandler("previoustrack", y);
        navigator.mediaSession.setActionHandler("nexttrack", C);

        document.addEventListener("keydown", function(event) {
            if (event.code === "Space") {
                event.preventDefault();
                playPauseButton.click();
            }
        });
    }

    function f() {
        e.src = i[o];
        e.play();
        var t = decodeURIComponent(i[o].href);
        s.innerHTML = t.substring(t.lastIndexOf("/") + 1);
        navigator.mediaSession.metadata = new MediaMetadata({
            title: s.innerHTML
        });
        showBanner("Playing");
    }

    function x(e, t, n, i, o) {
        var a = document.createElement(e);
        t !== "" && a.classList.add(t);
        var d = document.createAttribute("data");
        d.value = i;
        a.setAttributeNode(d);
        a.appendChild(document.createTextNode(n));
        a.onclick = o;
        return a;
    }

    function v() {
        l.style.width = e.currentTime / e.duration * 100 + "%";
        timeDisplay.innerHTML = formatTime(e.currentTime) + " / " + formatTime(e.duration);
        requestAnimationFrame(v);
    }

    function formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        var seconds = Math.floor(seconds % 60);
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    function y() {
        o > 0 ? o-- : o = i.length - 1;
        f();
    }

    function C() {
        o < i.length - 1 ? o++ : o = 0;
        f();
    }

    function showBanner(message) {
        banner.innerHTML = message;
        banner.style.display = "block";
        setTimeout(function() {
            banner.style.opacity = 0;
            setTimeout(function() {
                banner.style.display = "none";
                banner.style.opacity = 1;
            }, 500);
        }, 2000);
    }
})();
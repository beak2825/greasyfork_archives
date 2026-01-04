// ==UserScript==
// @name         nl.catbox.moe replacer
// @description  Script that replaces nl.catbox.moe/* with catbox player page
// @version      1.0.2
// @author       Magnus Cosmos
// @match        https://nl.catbox.moe/*
// @license      MIT
// @namespace https://greasyfork.org/users/812667
// @downloadURL https://update.greasyfork.org/scripts/440648/nlcatboxmoe%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/440648/nlcatboxmoe%20replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const plyrJs = document.createElement("script");
    plyrJs.src = "https://cdn.plyr.io/3.6.12/plyr.polyfilled.js";
    document.head.appendChild(plyrJs);
    const plyrCss = document.createElement("link");
    plyrCss.rel = "stylesheet";
    plyrCss.type = "text/css";
    plyrCss.href = "https://cdn.plyr.io/3.6.12/plyr.css";
    document.head.appendChild(plyrCss);
    const styles = document.createElement("style");
    document.head.appendChild(styles);
    const stylesheet = styles.sheet;
    stylesheet.insertRule(`textarea::-webkit-scrollbar {
    display: none;
}`, 0);
    stylesheet.insertRule(`.wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}`, 1);
    stylesheet.insertRule(`.textbox {
    background-color: rgb(200, 200, 200);
    display: block;
    resize: none;
    padding: 5px;
    margin: 10px;
    width: 600px;
    height: 200px;
}`, 2);
    stylesheet.insertRule(`.start {
    display: block;
    margin: auto;
    width: 25%;
    padding: 3px;
}`, 3);
    stylesheet.insertRule(`.container {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}`, 4);
    stylesheet.insertRule(`.plyr {
    border-radius: 12px;
    width: 50vw;
}`, 5);
    stylesheet.insertRule(`.title {
    position: absolute;
    top: 1vw;
    left: 1vw;
    color: #fff;
    padding: 0.8vw 1.6vw;
    font-family: monospace;
    font-size: 2.4vw;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    box-shadow: 0px 0px 1vw rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    text-align: center;
    z-index: 3;
    user-select: none;
}`, 6);
    stylesheet.insertRule(`video {
    position: relative;
}`);

    const hash = location.hash.trim().replace("#", "");
    const startIndex = hash.length > 0 ? parseInt(hash) : 1;
    const MIME_TYPES = new Map([
        ["3gp", "video/3gpp"],
        ["mpg", "video/mpeg"],
        ["mpeg", "video/mpeg"],
        ["mp4", "video/mp4"],
        ["m4v", "video/mp4"],
        ["m4p", "video/mp4"],
        ["mov", "video/quicktime"],
        ["webm", "video/webm"]
    ]);

    function getExtension(fileName) {
        const ext = fileName.split(".").pop();
        return fileName === ext ? "" : ext;
    }

    function getMIMEType(fileName) {
        const type = MIME_TYPES.get(getExtension(fileName));
        return type ? type : "";
    }

    function getYTID(url) {
        const match = url.replace(/(>|<)/gi, "").split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        if (match[2] !== undefined) {
            const id = match[2].split(/[^0-9a-z_\-]/i);
            return id[0];
        }
        return null;
    }

    function parseType(url) {

    }

    class Video {
        constructor(url) {
            const id = getYTID(url);
            if (id) {
                this.url = id;
                this.type = "youtube";
            } else {
                this.url = url;
                this.type = getMIMEType(url);
            }
            this.blob = null;
            this.loaded = 0;
            this.loading = false;
            this.cached = false;
        }

        load(callbackFn) {
            if (this.cached || this.loaded > 0.0 || this.loading) {
                return;
            }
            if (this.type === "youtube") {
                if (callbackFn) {
                    callbackFn();
                }
                return;
            }
            this.loading = true;
            const xhr = new XMLHttpRequest();
            xhr.onprogress = (event) => {
                this.loaded = event.loaded / event.total;
                console.log(`Downloaded ${event.loaded} of ${event.total} bytes`);
            }
            xhr.onload = () => {
                this.blob = URL.createObjectURL(xhr.response);
                this.loaded = 1;
                this.loading = false;
                this.cached = true;
                console.log(`loaded ${this.url}`);
                if (callbackFn) {
                    callbackFn();
                }
            };
            xhr.open("GET", this.url);
            xhr.responseType = "blob";
            xhr.send();
        }

        setSource() {
            if (this.type === "youtube") {
                player.source = {
                    type: "video",
                    sources: [
                        {
                            src: this.url,
                            provider: this.type
                        }
                    ]
                }
            } else {
                player.source = {
                    type: "video",
                    sources: [
                        {
                            src: this.blob,
                            type: this.type
                        }
                    ]
                }
            }
        }

        dispose(callbackFn) {
            if (this.type !== "youtube") {
                URL.revokeObjectURL(this.blob);
                this.blob = null;
                this.loaded = 0;
                this.cached = false;
                if (callbackFn) {
                    callbackFn();
                }
            }
        }
    }

    const original = document.querySelector("video");
    original.outerHTML = `<div class="wrapper">
<textarea class="textbox"></textarea>
<button class="start">Start</button>
</div>
<div class="container">
<video id="player" autoplay controls crossorigin></video>
</div>`;

    let i = 0;
    let canStart = false;
    let player = null;
    let files = [];
    const container = document.querySelector(".container");
    const wrapper = document.querySelector(".wrapper");
    const button = document.querySelector(".start");
    const textBox = document.querySelector(".textbox");
    button.addEventListener("click", setupVideo);

    function setupVideo() {
        const listStr = textBox.value;
        if (listStr.length === 0) {
            return;
        }
        wrapper.remove();
        container.style.display = "block";
        playVideos(listStr);
    }

    function loadNext() {
        const file = files[i + 1];
        if (file && (file.cached || file.type === "youtube") && canStart) {
            file.setSource();
            i++;
            const title = document.querySelector(".title");
            title.innerText = parseInt(title.innerText) + 1;
            canStart = false;
        }
    }

    function playVideos(listStr) {
        files = listStr.split("\n").filter(url => {
            return url.trim().length > 0;
        }).map(url => {
            return new Video(url.trim());
        });
        console.log(files);
        files[0].load(() => {
            player = new Plyr("#player", {
                controls: ["play-large", "play", "progress", "current-time", "mute", "volume", "fullscreen"]
            });
            player.on("ready", () => {
                console.log("Ready");
                if (files[i + 1]) {
                    files[i + 1].load(() => {
                        loadNext();
                    });
                }
            });

            player.on("ended", () => {
                console.log("ended");
                canStart = true;
                for (let j = 0; j < i && j < files.length; j++) {
                    if (files[j].cached) {
                        files[j].dispose();
                    }
                }
                loadNext();
            });
            files[0].setSource();
            const plyrDiv = document.querySelector(".plyr");
            const title = document.createElement("div");
            title.classList.add("title");
            title.innerText = startIndex.toString();
            title.setAttribute("contenteditable", "true");
            plyrDiv.appendChild(title);
            loadNext();
        });
    }
})();
// ==UserScript==
// @name         Edm ghost production download button
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1.03
// @description  Allows to download mp3 files from server. For legal use buy the track.
// @author       Kirill Gribakov
// @match        https://beathunterz.com/**
// @match        https://edm-ghost-production.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=beathunterz.com
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM.cookie
// @grant       unsafeWindow
// @grant       window.close
// @grant       window.focus
// @grant       window.onurlchange
// @grant       GM_listValues
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_info
// @grant       GM_openInTab
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @grant       GM_download
// @downloadURL https://update.greasyfork.org/scripts/453177/Edm%20ghost%20production%20download%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/453177/Edm%20ghost%20production%20download%20button.meta.js
// ==/UserScript==

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="transparent" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path><path d="M7 11l5 5l5 -5"></path><path d="M12 4l0 12"></path></svg>`;
const iconContainerStyle = "background-image: linear-gradient(to bottom right, #ff000000, #0000009f); position: absolute; bottom: 0; right: 0; width: 30px; height: 30px; z-index: 5; padding: 3px;";

function fetchTrackMp3(name, src) {
    return (event) => {
        event.stopPropagation()
        fetch(src)
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.blob();
        })
            .then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        })
            .catch(error => {
            console.error('Error downloading file:', error);
        });
    }
}

function showDownloadButton(container, onclick = () => console.warn("not implemented")) {
    const downloadButton = document.createElement("button");
    downloadButton.style = iconContainerStyle;
    downloadButton.innerHTML = icon;
    downloadButton.onclick = onclick
    container.prepend(downloadButton);
}

function cardSelector(tracks) {
    const cards = Array.from(document.querySelectorAll(".shop-card__title")).slice(-20)

    cards?.forEach(card => {
        const title = card.querySelector("a").innerHTML
        let index = -1
        const matchingTrack = tracks.find((track, i) => {
            const found = track.name === title
            if (found) index = i
            return found
        });

        if (index >= 0) {
            const clickFunc = fetchTrackMp3(matchingTrack.filename, matchingTrack.src)
            const container = card.parentElement.querySelector(".shop-card__picture")
            showDownloadButton(container, clickFunc)

            tracks.splice(index, 1)
        }
    })
}

(function(originalOpen) {
    var originalSend = XMLHttpRequest.prototype.send;
    var originalAddEventListener = XMLHttpRequest.prototype.addEventListener;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url; // Store the URL for later use
        originalOpen.call(this, method, url);
    };

    XMLHttpRequest.prototype.send = function() {
        const self = this;
        const originalOnload = this.onload;

        this.onload = function() {
            if (self._url && self._url.indexOf('tracks?skip=') !== -1) {
                // Intercept the response
                const response = self.responseText;

                // Parse the JSON data
                try {
                    const data = JSON.parse(response);

                    if (Array.isArray(data?.result)) {
                        const tracksNotSold = data.result.filter(r => !r?.isSold)
                        const tracks = tracksNotSold.map(r => {
                            const name = r?.name
                            const src = r?.previewTrackSrc?.replace('.mp3', '.webm')
                            const scale = r?.key + (r?.scale === "minor" ? "m" : "")
                            const filename = name + ` (${r?.bpm} BPM - ${scale}).mp3`;
                            return {filename, name, src}
                        });
                        
                        setTimeout(() => cardSelector(tracks), 200)
                    }
                } catch (e) {
                    console.error('Error parsing or modifying response data:', e);
                }
            }

            // Call the original onload function
            if (originalOnload) {
                originalOnload.call(this);
            }
        };

        originalSend.call(this);
    };
})(XMLHttpRequest.prototype.open);

(function(){
    window.addEventListener('click', function(e) {
		e = e || window.event;
		let target = e.target || e.srcElement,
			text = target.textContent || target.innerText,
			card = target.closest(".shop-card__picture") || target.closest(".shop-card-tablet");
		if(card) {
            showDownloadButton(card)
			setTimeout(UpdatePlayer, 300);
		}
	}, false);

	// Функция добавляющая скачивание
	function UpdatePlayer() {
        const button = document.querySelector('span[data-download="true"]')
        button?.remove()
        if (document.querySelector('span[data-download="true"]') === null) {
            let playerRoute = document.querySelector(".player"),
                player = playerRoute.querySelector(".player__waveform"),
                div = player.querySelector("div"),
                audio = div.querySelector("audio"),
                buttons = document.querySelector(".player__buttons"),
                t = playerRoute.querySelector(".player__title"),
                title = t.textContent || t.innerText,
                tags = playerRoute.querySelector(".player__tags"),
                bpm = tags.firstElementChild.textContent,
                scale = tags.lastElementChild.textContent,
                filename = title + ` (${bpm} - ${scale}).mp3`;

            const downloadButton = document.createElement("span")
            downloadButton.dataset.download = "true"
            downloadButton.style = "padding: 1px; background: #2d2d2d; border-radius: 8px; cursor: pointer; height: 26px; margin: 0 10px 0 0; position: relative;"
            downloadButton.innerHTML = icon

            const clickFunc = fetchTrackMp3(filename, audio.src)
            downloadButton.onclick = clickFunc

            buttons.prepend(downloadButton)
        }
	}
})();
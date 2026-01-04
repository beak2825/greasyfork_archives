// ==UserScript==
// @name         TikTokDL
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Download TikTok videos without AND with watermark, from the website
// @author       realcoloride
// @match        *.tiktok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @license      MIT
// @grant        GM.xmlHttpRequest
// @connect      wuk.sh
// @downloadURL https://update.greasyfork.org/scripts/493738/TikTokDL.user.js
// @updateURL https://update.greasyfork.org/scripts/493738/TikTokDL.meta.js
// ==/UserScript==

(function() {
    let contextMenu;
    let downloadButton;

    let downloadVideoWatermarkButton = null;
    let downloadVideoNoWatermarkButton = null;

    let baseInjected = false;

    const buttonInnerHTML = `<path d="M21.9 7.38v19.86l-6.73-6.73a.87.87 0 0 0-1.24 0l-1.73 1.73a.88.88 0 0 0 0 1.24l11.18 11.18c.34.35.9.35 1.24 0L35.8 23.48a.88.88 0 0 0 0-1.24l-1.73-1.73a.87.87 0 0 0-1.24 0l-6.73 6.73V7.38c0-.49-.4-.88-.87-.88h-2.45c-.49 0-.88.4-.88.88ZM10.88 37.13c-.49 0-.88.39-.88.87v2.63c0 .48.4.87.88.87h26.24c.49 0 .88-.4.88-.87V38c0-.48-.4-.87-.87-.87H10.86Z"></path>`;

    function getPlayingVideoURL() {
        const videoElement = document.querySelector("video") || document.querySelector('[id^="xgwrapper-0-"] > xg-bar');
        const videoId = videoElement.parentNode.id;
        const regex = /xgwrapper-0-(\d+)/;
        const match = videoId.match(regex);

        if (match <= 0) return window.location.href;
        const id = match[1];
        
        // fullscreen video
        const tiktokRegex = /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[^/]+\/video\/(\d+)/i;
        const urlIdMatch = (window.location.href).match(tiktokRegex);
        if (urlIdMatch && urlIdMatch[1] == id) return window.location.href;

        const videoContainer = videoElement.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
        const handle = videoContainer.querySelector("div > div > div > a > h3").innerText;

        return `https://www.tiktok.com/@${handle}/video/${id}`;
    }

    async function getTikTokMediaURL() {
        const tiktokUrl = getPlayingVideoURL();
        console.log(tiktokUrl);
        
        // using cobalt's api
        const initialRequest = await GM.xmlHttpRequest({
            method: 'POST',
            headers: {
                "accept": "application/json",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/json",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "Referer": "https://cobalt.tools/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            url: "https://co.wuk.sh/api/json",
            data: JSON.stringify({
                "url": tiktokUrl,
                "aFormat": "mp3",
                "filenamePattern": "classic",
                "dubLang": false,
                "vQuality": "720"
            }),
            responseType: 'text',
            onerror: function(error) {
                console.error('[TikTokDL] Download Error:', error);
                alert("Download failed, sorry!");
            },
        });

        const initialResponse = JSON.parse(initialRequest.responseText);
        console.log(initialResponse);

        const { url } = initialResponse;
        return url;
    }
    function downloadFile(url) {
        GM.xmlHttpRequest({
            method: 'GET',
            headers: {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "Referer": "https://cobalt.tools/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            url: url,
            responseType: 'blob',
            onload: async function(response) {
                if (response.status != 200) {
                    alert("Download failed, sorry!");
                    return;
                }

                const blob = response.response;
                const link = document.createElement('a');

                const regex = /filename="([^"]+)"/;
                const matches = regex.exec(response.responseHeaders);
                let filename = matches && matches[1]; // extracting the filename from the content disposition
                filename = 'TikTokDL' + filename.substring('tiktok'.length, filename.length);

                link.href = URL.createObjectURL(blob);
                link.setAttribute('download', filename);
                link.click();

                URL.revokeObjectURL(link.href);
            },
            onerror: function(error) {
                console.error('[TikTokDL] Download Error:', error);
                alert("Download failed, sorry!");
            }
        });
    }

    function setIfNot(from, what) {
        if (from != null) return;
        from = what;
    }

    function updateContextMenu() {
        contextMenu = document.querySelector("#app > ul");
    }

    function injectOnce() {
        updateContextMenu();
        downloadButton = contextMenu.children[0];
        const buttonReferenceNode = downloadButton.cloneNode(true);

        function createContextMenuButton(text, onclick) {
            const button = buttonReferenceNode.cloneNode(true);
            button.querySelector("span").innerText = text;
            button.querySelector("svg").innerHTML = buttonInnerHTML; // ensure download icon after cloning

            button.addEventListener("click", (event) => {
                event.preventDefault();
                onclick();
            });
            contextMenu.insertBefore(button, downloadButton);

            return button;
        }

        setIfNot(downloadVideoWatermarkButton, createContextMenuButton("Download video (watermark)", () => {}));
        setIfNot(downloadVideoNoWatermarkButton, createContextMenuButton("Download video (no watermark)", async () => {
            downloadFile(await getTikTokMediaURL());
        }));

        baseInjected = true;
    }
    function permanentInject() {
        downloadButton = contextMenu.children[0];
        downloadButton?.setAttribute("style", "display:none;");
    }

    // aggressive brute force injection
    setInterval(() => {
        try {
            if (!baseInjected)
                injectOnce();

            permanentInject();

        } catch {}
    }, 50);
})();
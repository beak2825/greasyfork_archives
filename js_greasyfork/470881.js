// ==UserScript==
// @name         Twitter DL - Click "Always Allow"!
// @version      1.1.2
// @description  Download twitter videos directly from your browser! (CLICK "ALWAYS ALLOW" IF PROMPTED!)
// @author       realcoloride
// @license      MIT
// @namespace    https://twitter.com/*
// @namespace    https://x.com/*
// @match        https://twitter.com/*
// @match        https://x.com/*
// @match        https://pro.twitter.com/*
// @match        https://pro.x.com/*
// @connect      twitter-video-download.com
// @connect      twimg.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/470881/Twitter%20DL%20-%20Click%20%22Always%20Allow%22%21.user.js
// @updateURL https://update.greasyfork.org/scripts/470881/Twitter%20DL%20-%20Click%20%22Always%20Allow%22%21.meta.js
// ==/UserScript==

(function() {
    let injectedTweets = [];
    const checkFrequency = 150; // in milliseconds
    const apiEndpoint = "https://twitter-video-download.com/fr/tweet/";
    const downloadText = "Download"

    const style =
    `.dl-video {
        padding: 6px;
        padding-left: 5px;
        padding-right: 5px;
        margin-left: 5px;
        margin-bottom: 2px;
        border-color: black;
        border-style: none;
        border-radius: 10px;
        color: white;

        background-color: rgba(39, 39, 39, 0.46);
        font-family: Arial, Helvetica, sans-serif;
        font-size: xx-small;

        cursor: pointer;
    }

    .dl-hq {
        background-color: rgba(28, 199, 241, 0.46);
    }
    .dl-lq {
        background-color: rgba(185, 228, 138, 0.46);
    }
    .dl-gif {
        background-color: rgba(219, 117, 22, 0.46);
    }
    `;

    // Styles
    function injectStyles() {
        const styleElement = document.createElement("style");
        styleElement.textContent = style;

        document.head.appendChild(styleElement);
    }
    injectStyles();

    // Snippet extraction
    function getRetweetFrame(tweetElement) {
        let retweetFrame = null;
        const candidates = tweetElement.querySelectorAll(`[id^="id__"]`);

        candidates.forEach((candidate) => {
            const candidateFrame = candidate.querySelector('div[tabindex="0"][role="link"]');

            if (candidateFrame)
                retweetFrame = candidateFrame;
        });

        return retweetFrame;
    }
    function getTopBar(tweetElement, isRetweet) {
        // I know its kind of bad but it works

        let element = tweetElement;

        if (isRetweet) {
            const retweetFrame = getRetweetFrame(tweetElement);
            const videoPlayer = tweetElement.querySelector('[data-testid="videoPlayer"]');
            const videoPlayerOnRetweet = retweetFrame.querySelector('[data-testid="videoPlayer"]')

            const isVideoOnRetweet = (videoPlayer == videoPlayerOnRetweet);

            if (videoPlayerOnRetweet && isVideoOnRetweet) element = retweetFrame;
            else if (videoPlayerOnRetweet == null) element = tweetElement;
        }

        const userName = element.querySelector('[data-testid="User-Name"]');

        if (isRetweet && element != tweetElement) return userName.parentNode.parentNode;
        return userName.parentNode.parentNode.parentNode;
    }

    // Fetching
    async function getMediasFromTweetId(tweetInformation) {
        const id = tweetInformation.id;

        const payload = {
            "url": `${apiEndpoint}${id}`,
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "max-age=0",
                "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"115\", \"Chromium\";v=\"115\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1"
              },
            "referrer": "https://twitter-video-download.com/en",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "omit"
        };
        const request = await GM.xmlHttpRequest(payload);

        let lq = null;
        let hq = null;

        try {
            const regex = /https:\/\/[a-zA-Z0-9_-]+\.twimg\.com\/[a-zA-Z0-9_\-./]+\.mp4/g;
            const text = request.responseText;
            const links = text.match(regex);

            // Calculate the size of a video based on resolution
            function calculateSize(resolution) {
                const parts = resolution.split("x");
                const width = parseInt(parts[0]);
                const height = parseInt(parts[1]);
                return width * height;
            }

            if (!links) return null;

            // Map links to objects with resolution and size
            const linkObjects = links.map(link => {
                const resolutionMatch = link.match(/\/(\d+x\d+)\//);
                const resolution = resolutionMatch ? resolutionMatch[1] : "";
                const size = calculateSize(resolution);
                return { link, resolution, size };
            });

            // Sort linkObjects based on size in descending order
            linkObjects.sort((a, b) => a.size - b.size);

            // Create a Set to track seen links and store unique links
            const uniqueLinks = new Set();
            const deduplicatedLinks = [];

            for (const obj of linkObjects) {
                if (!uniqueLinks.has(obj.link)) {
                    uniqueLinks.add(obj.link);
                    deduplicatedLinks.push(obj.link);
                }
            }

            if (tweetInformation.isGif && tweetInformation.tabIndex == "-1" ||
                links[0].startsWith('https://video.twimg.com/tweet_video/')
            ) {
                lq = links[0];
            } else {
                lq = deduplicatedLinks[0];

                if (deduplicatedLinks.length > 1) hq = deduplicatedLinks[deduplicatedLinks.length-1];
                // first quality is VERY bad so if can swap to second (medium) then its better
                if (deduplicatedLinks.length > 2) lq = deduplicatedLinks[1];
            }
        } catch (error) {
            console.error(error);
            return null;
        }

        return {lq, hq};
    }

    // Downloading
    async function downloadFile(button, url, mode, filename) {
        const baseText = `${downloadText} (${mode.toUpperCase()})`;

        button.disabled = true;
        button.innerText = "Downloading...";

        console.log(`[TwitterDL] Downloading Tweet URL (${mode.toUpperCase()}): ${url}`);

        function finish() {
            if (button.innerText == baseText) return;

            button.disabled = false;
            button.innerText = baseText;
        }

        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            onload: function(response) {
                const blob = response.response;
                const link = document.createElement('a');

                link.href = URL.createObjectURL(blob);
                link.setAttribute('download', filename);
                link.click();

                URL.revokeObjectURL(link.href);
                button.innerText = 'Downloaded!';
                button.disabled = false;

                setTimeout(finish, 1000);
            },
            onerror: function(error) {
                console.error('[TwitterDL] Download Error:', error);
                button.innerText = 'Download Failed';

                setTimeout(finish, 1000);
            },
            onprogress: function(progressEvent) {
                if (progressEvent.lengthComputable) {
                    const percentComplete = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    button.innerText = `Downloading: ${percentComplete}%`;
                } else
                    button.innerText = 'Downloading...';
            }
        });
    }
    function createDownloadButton(tweetInformation, url, tag) {
        const button = document.createElement("button");
        button.hidden = true;

        const username = tweetInformation.username;
        const filename = `TwitterDL_${username}_${tweetInformation.id}`;

        button.classList.add("dl-video", `dl-${tag}`);
        button.innerText = `${downloadText} (${tag.toUpperCase()})`;
        button.setAttribute("href", url);
        button.setAttribute("download", "");
        button.addEventListener('click', async() => {
            await downloadFile(button, url, tag, filename);
        });

        button.hidden = false;

        return button;
    }
    function createDownloadButtons(tweetElement) {
        const tweetInformation = getTweetInformation(tweetElement);
        if (!tweetInformation) return;

        getMediasFromTweetId(tweetInformation).then((medias) => {
            if (!medias) return;

            const retweetFrame = getRetweetFrame(tweetElement);
            const isRetweet = (retweetFrame != null);

            let lowQualityButton;
            let highQualityButton;

            const lq = medias.lq;
            const hq = medias.hq;

            if (lq) lowQualityButton  = createDownloadButton(tweetInformation, lq, tweetInformation.isGif ? "gif" : "lq");
            if (hq && !tweetInformation.isGif) highQualityButton = createDownloadButton(tweetInformation, hq, "hq");

            const videoPlayer = isRetweet ? tweetElement.querySelector('[data-testid="videoPlayer"]') : null;
            const videoPlayerOnRetweet = isRetweet ? retweetFrame.querySelector('[data-testid="videoPlayer"]') : null;

            const topBar = getTopBar(tweetElement, isRetweet);
            const threeDotsElement = topBar.lastChild

            const isVideoOnRetweet = (videoPlayer == videoPlayerOnRetweet);

            if (!lowQualityButton && !highQualityButton) return;

            // Order: HQ then LQ
            if (videoPlayer != null && isRetweet && isVideoOnRetweet) {
                // Add a little side dot
                addSideTextToRetweet(tweetElement, " · ", 6, 5);

                if (highQualityButton) topBar.appendChild(highQualityButton);
                if (lowQualityButton)  topBar.appendChild(lowQualityButton);
            } else {
                if (lowQualityButton)  topBar.insertBefore(lowQualityButton, threeDotsElement);
                if (highQualityButton) topBar.insertBefore(highQualityButton, lowQualityButton);
            }
        })
    }
    function addSideTextToRetweet(tweetElement, text, forcedMargin, forcedWidth) {
        const timeElement = tweetElement.querySelector("time");
        const computedStyles = window.getComputedStyle(timeElement);

        // Make a new text based on the font and color
        const textElement = timeElement.cloneNode(true);
        textElement.innerText = text;
        textElement.setAttribute("datetime", "");

        for (const property of computedStyles) {
            textElement.style[property] = computedStyles.getPropertyValue(property);
        }

        textElement.style.overflow = "visible";
        textElement.style["padding-left"] = "4px";
        textElement.style["margin-left"] = forcedMargin || 0;

        const tweetAvatarElement = tweetElement.querySelectorAll('[data-testid="Tweet-User-Avatar"]')[1];
        const targetTweetBar = tweetAvatarElement.parentNode;

        targetTweetBar.appendChild(textElement);

        const contentWidth = textElement.scrollWidth;
        textElement.style.width = (forcedWidth || contentWidth) + 'px';

        injectedFallbacks.push(tweetElement);
    }

    // Page information gathering
    function getTweetsInPage() {
        return document.getElementsByTagName("article");
    }
    let injectedFallbacks = [];
    function getTweetInformation(tweetElement) {
        let information = {};

        // ID
        // Check the tweet timestamp, it has a link with the id at the end
        // In case something goes wrong, a fallback text is shown
        let id = null;
        let username = null;
        let tweetUrl = null;
        let isGif = false;
        let tabIndex = null;

        const retweetFrame = getRetweetFrame(tweetElement);
        const isRetweet = (retweetFrame != null);

        const videoPlayer = isRetweet ? retweetFrame.querySelector('[data-testid="videoPlayer"]') : null;

        const isPost = (isStatusUrl(window.location.href));

        tabIndex = tweetElement.getAttribute('tabindex');

        const regex = /https:\/\/(?:pro\.)?x\.com\/([^\/]+)\/status\/(\d+)/;
        function setInfo(url) {
            const match = url.match(regex);

            id = match[2];
            username = match[1];
            tweetUrl = url;
        }

        const url = window.location.href;

        try {
            setInfo(url);
        } catch {}

        function fallback(reason) {
            if (injectedFallbacks.includes(tweetElement)) return;

            console.log("[TwitterDL] Twitter quote retweets from statuses are not supported yet, sorry! Throwing fallback... \nScope: " + reason);

            addSideTextToRetweet(tweetElement, " · Open to Download");
        }

        try {
            if (isRetweet) {
                if (isPost) {
                    const hasRetweetVideoPlayer = (videoPlayer != null);
                    if (hasRetweetVideoPlayer)
                        fallback("isretweet, ispost, hasretweetvideoplayer");
                } else fallback("isretweet");
            } else {
                const timeElement = tweetElement.querySelector("time");
                const timeHref = timeElement.parentNode;
                const tweetUrl = timeHref.href;

                if (tweetUrl) setInfo(tweetUrl);
                else fallback("no time info");
            }
        } catch (error) {
            fallback("internal error: " + error);
            console.error(error);
        }

        // VideoPlayer element
        const videoPlayerElement = tweetElement.querySelector('[data-testid="videoPlayer"]');
        const spanElement = videoPlayerElement.querySelector('div[dir="ltr"] > span');

        if (spanElement)
            isGif = spanElement.innerText == "GIF";

        if (!id) return;
        information.id = id;
        information.username = username;
        information.url = tweetUrl;
        information.videoPlayer = videoPlayerElement;
        information.isGif = isGif;
        information.tabIndex = tabIndex;

        // Play button
        return information;
    }

    // Page injection
    async function injectAll() {
        const tweets = getTweetsInPage();
        for (let i = 0; i < tweets.length; i++) {
            const tweet = tweets[i];
            const alreadyInjected = injectedTweets.includes(tweet);

            if (!alreadyInjected) {
                const videoPlayer = tweet.querySelector('[data-testid="videoPlayer"]');
                const isVideo = (videoPlayer != null);

                if (!isVideo) continue;

                createDownloadButtons(tweet);
                injectedTweets.push(tweet);
            }
        }
    }
    function checkForInjection() {
        const tweets = getTweetsInPage();
        const shouldInject = (injectedTweets.length != tweets.length);

        if (shouldInject) injectAll();
    }

    function isStatusUrl(url) {
        const statusUrlRegex = /^https?:\/\/(pro\.x|x)\.com\/\w+\/status\/\d+$/;
        return statusUrlRegex.test(url);
    }
    function isValidUrl(url) {
        const tweetUrlRegex = /^https?:\/\/(pro\.x|x)\.com\/\w+(\/\w+)*$/;
        return tweetUrlRegex.test(url) || isStatusUrl(window.location.href);
    }
    if (isValidUrl(window.location.href)) {
        console.log("[TwitterDL] by (real)coloride - 2023 // Loading... ");

        setInterval(async() => {
            try {
                checkForInjection();
            } catch (error) {
                console.error("[TwitterDL] Fatal error: ", error);
            }
        }, checkFrequency);
    }
})();

// ==UserScript==
// @name         s.to autoplay
// @namespace    https://github.com/zaheer-exe
// @version      9.7
// @description  Autoplay für SerienStream.to
// @author       zaheer-exe
// @match        https://s.to/*
// @match        https://serienstream.to/*
// @match        https://aniworld.to/*
// @match        https://voe.sx/*
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        none
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=s.to
// @license      Apache License
// @downloadURL https://update.greasyfork.org/scripts/400669/sto%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/400669/sto%20autoplay.meta.js
// ==/UserScript==

////////// LISTER ////////////////////////////////////////////////////////////////
const sToHosts = ['s.to', 'aniworld.to', 'serienstream.to'];
if (sToHosts.includes(new URL(window.location.href).hostname)) {
    let isAutoPlayed = false;

    function nextEpisode() {
        const currentLang = document.querySelector("img.selectedLanguage").dataset.langKey;
        console.log("S: current lang ", currentLang);
        const episodeMenuCurrentElem = document.querySelector('li a.active[href*="episode"]');
        const nextEpisodeUrl = episodeMenuCurrentElem.parentElement.nextElementSibling.querySelector('a');

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", nextEpisodeUrl, false);
        xmlHttp.send(null);

        let temp = document.createElement('div');
        temp.innerHTML = xmlHttp.responseText;
        let url = temp.querySelector('li[data-lang-key="' + currentLang + '"] .watchEpisode .icon.VOE').parentElement.href;
        let title = temp.querySelector(".hosterSiteTitle").innerHTML;

        let streamIframe = document.querySelector(".inSiteWebStream iframe");
        streamIframe.src = url;

        document.querySelector(".hosterSiteTitle").innerHTML = title;
        document.querySelector(".breadCrumbMenu").innerHTML = temp.querySelector(".breadCrumbMenu").innerHTML;
        episodeMenuCurrentElem.classList.remove('active');
        nextEpisodeUrl.classList.add('active');
        window.history.pushState("", "", nextEpisodeUrl.href);

        if (!isAutoPlayed) {
            disableElements();
            isAutoPlayed = true;
        }
    }



    function disableElements() {
        const style = document.createElement('style');
        style.textContent = `
        .changeLanguage, li[data-link-target] {
            opacity: 0.3;
            cursor: none;
        }

        .changeLanguageBox, li[data-link-target] > .generateInlinePlayer {
            pointer-events: none;
        }

        .tooltip {
            position: absolute;
            background-color: #333; /* Dark background for contrast */
            color: #fff; /* White text for contrast */
            padding: 10px; /* Padding for better appearance */
            border-radius: 5px; /* Rounded corners */
            font-size: 14px; /* Font size for readability */
            line-height: 1.4; /* Line height for better text readability */
            white-space: nowrap; /* Prevent text wrapping */
            display: none; /* Hidden by default */
            z-index: 9999; /* Ensure it appears above other content */
            pointer-events: none; /* Ensure it doesn't interfere with interactions */
            transform: translate(-50%, -50%); /* Center tooltip on the cursor */
        }
    `;
        document.head.appendChild(style);

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = 'Autoplay enabled. Refresh/Reload Page to change settings.';
        document.body.appendChild(tooltip);

        function updateTooltipPosition(event) {
            tooltip.style.left = `${event.pageX}px`;
            tooltip.style.top = `${event.pageY}px`;
        }

        function showTooltip(event) {
            tooltip.style.display = 'block';
            updateTooltipPosition(event);
        }

        function hideTooltip() {
            tooltip.style.display = 'none';
        }

        const elements = document.querySelectorAll('.changeLanguage, li[data-link-target]');
        elements.forEach(element => {
            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mousemove', updateTooltipPosition);
            element.addEventListener('mouseleave', hideTooltip);
        });
    }

    function autoPlaySettings() {
        const style = document.createElement('style');
        style.textContent = `
        .autoplay-settings-container {
            border: 1px solid #3a3a3a;
            border-radius: 8px;
            margin-top: 15px;
            padding: 15px;
            background-color: #18181b;
            font-family: Arial, sans-serif;
            color: #ffffff;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        .autoplay-settings-container h2 {
            margin: 0 0 15px 0;
            color: #8257e6;
            font-size: 16px;
            font-weight: bold;
        }
        .settings-row {
            display: flex;
            justify-content: space-between;
        }
        .settings-column {
            width: 48%;
        }
        .setting-group {
            margin-bottom: 10px;
        }
        .setting-group label {
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            color: #a0a0a0;
        }
        .setting-group input {
            width: 100%;
            padding: 8px;
            border: 1px solid #3a3a3a;
            border-radius: 4px;
            font-size: 14px;
            background-color: #27272a;
            color: #ffffff;
            transition: border-color 0.3s, box-shadow 0.3s;
        }
        .setting-group input:focus {
            outline: none;
            border-color: #8257e6;
            box-shadow: 0 0 5px rgba(130, 87, 230, 0.5);
        }
        .setting-group input::placeholder {
            color: #6b7280;
        }
    `;
        document.head.appendChild(style);

        const container = document.createElement("div");
        container.classList.add("autoplay-settings-container");
        container.innerHTML = `
        <h2>AutoPlay Settings</h2>
        <div class="settings-row">
            <div class="settings-column">
                <div class="setting-group">
                    <label for="skip-intro">Skip intro (seconds)</label>
                    <input id="skip-intro" type="number" min="0" placeholder="e.g., 30">
                </div>
                <div class="setting-group">
                    <label for="skip-outro">Skip outro (seconds)</label>
                    <input id="skip-outro" type="number" min="0" placeholder="e.g., 60">
                </div>
            </div>
            <!-- <div class="settings-column">
                <div class="setting-group">
                    <label for="still-here">"Are you still watching?" popup (minutes of inactivity)</label>
                    <input id="still-here" type="number" min="0" placeholder="e.g., 120">
                </div>
            </div> -->
        </div>
    `;
        document.querySelector(".hosterSiteDirectNav").appendChild(container);

        let key = new URL(window.location.href).pathname.split("/");
        key = key[1] + "/" + key[2] + "/" + key[3];
        const seasonData = JSON.parse(localStorage.getItem(key) || "{\"skip-intro\": 0, \"skip-outro\": 0, \"still-here\": 0}");

        container.querySelector("#skip-intro").value = seasonData["skip-intro"];
        container.querySelector("#skip-outro").value = seasonData["skip-outro"];

        // container.querySelector("#still-here").value = seasonData["still-here"];

        ['skip-intro', 'skip-outro'].forEach(id => {
            document.getElementById(id).addEventListener("change", (e) => {
                const value = e.target.value;
                console.log(`${e.target.id} changed to: ${value}`);
                seasonData[e.target.id] = value;
                localStorage.setItem(key, JSON.stringify(seasonData));
            });
        });
    }



    function showTooltip(e) {
        const tooltip = document.getElementById('autoplay-tooltip');
        tooltip.style.display = 'block';
        tooltip.style.left = e.pageX + 10 + 'px';
        tooltip.style.top = e.pageY + 10 + 'px';
    }

    function hideTooltip() {
        const tooltip = document.getElementById('autoplay-tooltip');
        tooltip.style.display = 'none';
    }

    function handleConfig() {
        let key = new URL(window.location.href).pathname.split("/");
        key = key[1] + "/" + key[2] + "/" + key[3];
        const seasonData = JSON.parse(localStorage.getItem(key));
        if (seasonData) {
            if (seasonData["skip-intro"] > 0) {
                console.log("S: sending post data for skip-intro");
                document.querySelector('.inSiteWebStream iframe').contentWindow.postMessage("autoplay$skip-intro$" + seasonData["skip-intro"], "*");
            }
            if (seasonData["skip-outro"] > 0) {
                console.log("S: sending post data for skip-outro");
                document.querySelector('.inSiteWebStream iframe').contentWindow.postMessage("autoplay$skip-outro$" + seasonData["skip-outro"], "*");
            }
        }
    }

    window.addEventListener("message", (event) => {
        if(typeof event.data === "string" && event.data.startsWith("autoplay")) {
            const parsed = event.data.split("$");
            console.log("event", parsed);
            switch (parsed[1]) {
                case "url": {
                    console.log("S: url");
                    let streamIframe = document.querySelector(".inSiteWebStream iframe");
                    if (streamIframe.src.includes("/redirect")) {
                        document.querySelector(".inSiteWebStream iframe").src = parsed[2];

                        document.querySelector(".inSiteWebStream iframe").addEventListener("load", () => {
                            handleConfig();
                        });
                    }
                    break;
                }
                case "end": {
                    console.log("S: ended");
                    nextEpisode();
                    break;
                }
                case "fullscreen": { // fullscreen workaround. this currently dead code because removed it for now
                    if (document.fullscreenElement === document.querySelector(".inSiteWebStream iframe")) {
                        document.exitFullscreen()
                    } else {
                        document.querySelector(".inSiteWebStream iframe").requestFullscreen();
                    }
                }
            }
        }
    }, false);

    window.addEventListener("load", () => {
        autoPlaySettings();
        document.querySelector(".inSiteWebStream iframe").allow = document.querySelector(".inSiteWebStream iframe").allow + "autoplay"
    });
}

////////// HOSTER ////////////////////////////////////////////////////////////////
let checkIfVoe = document.querySelector("head > meta[name='description']");
console.log(checkIfVoe);
if (checkIfVoe && checkIfVoe.content.includes("VOE")) {
    window.addEventListener("load", () => {
        console.log("VOE: loaded");

        window.parent.postMessage("autoplay$url$" + window.location.href, '*');
        document.querySelector("video").play();
        document.querySelector("video").click();
        console.log(document.querySelector("video"))

        let ended = false;
        document.querySelector("video").addEventListener("ended", () => {
            if (!ended) {
                console.log("VEO: ended");
                ended = true;
                window.parent.postMessage("autoplay$end", "*");
            }
        });

        // sometimes the "ended" event does not fire.. idk why. needs a workaround:
        window.setInterval(() => {
            let video = document.querySelector("video");
            if (video.currentTime + 0.5 >= video.duration && !ended) {
                console.log("VEO: ended workaround");
                ended = true;
                window.parent.postMessage("autoplay$end", "*");
            }
        }, 500);


        function handleSkipIntro(introTime) {
            let video = document.querySelector("video");

            if (video.currentTime >= introTime) {
                console.log("Video is already past the intro or user interacted. No skipping necessary.");
                return;
            }
            video.currentTime = parseInt(introTime);
        }

        function handleSkipOutro(outroTime) {
            let video = document.querySelector("video");

            const checkOutro = () => {
                if (video.duration - video.currentTime <= outroTime && !ended) {
                    console.log("Skipping outro", video.duration - video.currentTime, outroTime, video.duration - video.currentTime <= outroTime);
                    ended = true;
                    window.parent.postMessage("autoplay$end", "*");
                    video.removeEventListener("timeupdate", checkOutro);
                }
            };

            video.addEventListener("timeupdate", checkOutro);
        }

        window.addEventListener("message", (e) => {
            let video = document.querySelector("video");
            if(typeof e.data === "string" && e.data.startsWith("autoplay")) {
                const parsed = e.data.split("$");
                console.log("event", parsed);
                switch (parsed[1]) {
                    case "skip-intro": {
                        handleSkipIntro(parseInt(parsed[2]));
                        break;
                    }
                    case "skip-outro": {
                        handleSkipOutro(parseInt(parsed[2]));
                        break;
                    }
                    case "pause": {
                        video.pause();
                        break;
                    }
                }
            }
        });
    });
}
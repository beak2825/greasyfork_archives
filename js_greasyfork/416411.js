// ==UserScript==
// @name         [DEPRECATED] Twitch Adblock
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.5.1
// @description  [DEPRECATED] Please use https://github.com/odensc/ttv-ublock instead
// @author       FTwitch
// @include      https://www.twitch.tv/*
// @include      https://cdn.embedly.com/*
// @include      https://player.twitch.tv/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/416411/%5BDEPRECATED%5D%20Twitch%20Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/416411/%5BDEPRECATED%5D%20Twitch%20Adblock.meta.js
// ==/UserScript==

const compressor_off = 'M850 202.3C877.7 202.3 900 224.6 900 252.3V745.5C900 773.2 877.7 795.5 850 795.5S800 773.2 800 745.5V252.3C800 224.6 822.3 202.3 850 202.3ZM570 167.8C597.7 167.8 620 190.1 620 217.8V780C620 807.7 597.7 830 570 830S520 807.7 520 780V217.8C520 190.1 542.3 167.8 570 167.8ZM710 264.4C737.7 264.4 760 286.7 760 314.4V683.3C760 711 737.7 733.3 710 733.3S660 711 660 683.3V314.4C660 286.7 682.3 264.4 710 264.4ZM430 98.1C457.7 98.1 480 120.4 480 148.1V849.6C480 877.3 457.7 899.6 430 899.6S380 877.3 380 849.6V148.1C380 120.4 402.3 98.1 430 98.1ZM290 217.2C317.7 217.2 340 239.5 340 267.2V730.5C340 758.2 317.7 780.5 290 780.5S240 758.2 240 730.5V267.2C240 239.5 262.3 217.2 290 217.2ZM150 299.6C177.7 299.6 200 321.9 200 349.6V648.1C200 675.8 177.7 698.1 150 698.1S100 675.8 100 648.1V349.6C100 321.9 122.3 299.6 150 299.6Z';
const compressor_on = 'M850 200C877.7 200 900 222.3 900 250V750C900 777.7 877.7 800 850 800S800 777.7 800 750V250C800 222.3 822.3 200 850 200ZM570 250C597.7 250 620 272.3 620 300V700C620 727.7 597.7 750 570 750S520 727.7 520 700V300C520 272.3 542.3 250 570 250ZM710 225C737.7 225 760 247.3 760 275V725C760 752.7 737.7 775 710 775S660 752.7 660 725V275C660 247.3 682.3 225 710 225ZM430 250C457.7 250 480 272.3 480 300V700C480 727.7 457.7 750 430 750S380 727.7 380 700V300C380 272.3 402.3 250 430 250ZM290 225C317.7 225 340 247.3 340 275V725C340 752.7 317.7 775 290 775S240 752.7 240 725V275C240 247.3 262.3 225 290 225ZM150 200C177.7 200 200 222.3 200 250V750C200 777.7 177.7 800 150 800S100 777.7 100 750V250C100 222.3 122.3 200 150 200Z';

(function() {
    // Don't need this, for now
//     if (window.location.origin == "https://cdn.embedly.com") {
//         document.getElementsByTagName("html")[0].style = "overflow: hidden";

//         window.addEventListener("message", (event) => {
//             window.parent.postMessage(event.data, "*");
//         });
//     }
    if (window.location.origin == "https://player.twitch.tv") {
        var modified = false;

        var observer = new MutationObserver(function (mutations, observer) {
            var logo = document.querySelector('[data-a-target="player-twitch-logo-button"]');
            var card = document.getElementsByClassName("tw-card")[0];
            var panel = document.getElementsByClassName("stream-info-social-panel")[0];
            var settingsButton = document.querySelector('[data-a-target="player-settings-button"]');
            var fullscreenButton = document.querySelector('[data-a-target="player-fullscreen-button"]');
            var clickHandler = document.querySelector('.click-handler');
            var live = document.querySelector('.tw-channel-status-text-indicator--live');

            if (!logo || !card || !panel || !fullscreenButton || !live || !settingsButton || !clickHandler)
                return;

            var theaterButton = settingsButton.parentElement.cloneNode(true).querySelector("button");

            observer.disconnect();

            logo.remove();
            card.remove();
            panel.remove();

            // Set the live label to purple, just a personal preference
            live.style.backgroundColor = "var(--color-accent)";

            theaterButton.getElementsByTagName("g")[0].innerHTML = `<path fill-rule="evenodd" d="M2 15V5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2zm2 0V5h7v10H4zm9 0h3V5h-3v10z" clip-rule="evenodd"></path>`;
            theaterButton.parentElement.getElementsByClassName("tw-tooltip")[0].innerHTML = 'Theater Mode (alt+t)';

            if (fullscreenButton.parentElement.classList.contains("player-controls__right-control-group")) {
               // Likely on Firefox
                fullscreenButton.parentElement.insertBefore(theaterButton.parentElement, fullscreenButton);
            } else {
                // Likely not on Firefox
                fullscreenButton.parentElement.parentElement.insertBefore(theaterButton.parentElement, fullscreenButton.parentElement);
            }

            theaterButton.removeAttribute('disabled');
            fullscreenButton.removeAttribute('disabled');
            theaterButton.className = theaterButton.className.split("--disabled").join("");
            fullscreenButton.className = fullscreenButton.className.split("--disabled").join("");

            fullscreenButton.onclick = function () {
                window.parent.postMessage("fullscreen", "*");
            }

            theaterButton.onclick = function () {
                window.parent.postMessage("theater", "*");
            }

            //Mute button is just needed to grab parent for placement
            var muteButton = document.querySelector('[data-a-target="player-mute-unmute-button"]');
            var compressorButton = muteButton.parentElement.cloneNode(true);
            //On Chrome atleast, appending to end is fine and places it to right of volume slides
            muteButton.parentElement.parentElement.appendChild(compressorButton);

            //Double-click on video for fullscreen
            clickHandler.ondblclick = function () {
                fullscreenButton.click();
            }

            //Middle-click on video for mute/unmute
            clickHandler.onmousedown = function(e) {
                if (e && (e.which == 2 || e.button == 4 )) {
                    e.preventDefault();
                    muteButton.click();
                }
            }

            //Formatting stuff
            compressorButton.querySelector(".tw-tooltip").innerText = 'Audio Compressor';
            compressorButton.querySelector("svg").setAttribute("viewBox", "0 0 1000 1000");
            compressorButton.querySelector("g").innerHTML = `<path fill-rule="evenodd" d="${compressor_off}" clip-rule="evenodd"></path>`;
            compressorButton.setAttribute("data-active", 'false');

            let video = document.querySelector('video');
            video.context = new window.AudioContext();
            video.source = video.context.createMediaElementSource(video);
            video.compressor = video.context.createDynamicsCompressor();

            //Default values from FFZ
            video.compressor.threshold.setValueAtTime(-50, video.context.currentTime);
            video.compressor.knee.setValueAtTime(40, video.context.currentTime);
            video.compressor.ratio.setValueAtTime(12, video.context.currentTime);
            video.compressor.attack.setValueAtTime(0, video.context.currentTime);
            video.compressor.release.setValueAtTime(0.25, video.context.currentTime);

            //Compressor is disabled by default, can prob store preference locally if needed
            video.source.connect(video.context.destination);

            compressorButton.onclick = function () {
                const active = compressorButton.getAttribute('data-active');
                toggleCompressor(compressorButton, video, active);
            }

            const initial = localStorage.getItem('compressor');
            if(initial && initial === 'false') {
                toggleCompressor(compressorButton, video, initial);
            }
        });

        observer.observe(document.body, { attributes: false, childList: true, subtree: true });
    }
    else {
        var lastStreamer, oldHtml;

        window.addEventListener("message", (event) => {
            if (event.data == "fullscreen")
                document.querySelector(`[data-a-target="player-fullscreen-button"]`).click();
            else if (event.data == "theater")
                document.querySelector(`[data-a-target="player-theatre-mode-button"]`).click();
            else if (event.data.eventName == 'UPDATE_STATE' && event.data.params.quality)
                if (/^((?:160|360|480|720|1080)p(?:30|60)|chunked)$/.test(event.data.params.quality))
                    window.localStorage.setItem("embedQuality", event.data.params.quality);

        });

        var observer = new MutationObserver(function (mutations, observer) {
            var container = document.querySelector(".video-player .tw-absolute");

            if (!container)
                return;

            if (window.location.pathname.indexOf("/directory") != -1)
                return;

            if(mutations.length === 1 && mutations[0].target.classList.contains("tw-animated-number--monospaced"))
                return;

            var streamerName = window.location.pathname.replace("/", "");
            var quality = window.localStorage.getItem("embedQuality") || "chunked";
            //var twitchUrl = `https://player.twitch.tv/?channel=${streamerName}&muted=false&parent=cdn.embedly.com&quality=${quality}`
            //var iframeUrl = `https://cdn.embedly.com/widgets/media.html?src=${encodeURIComponent(twitchUrl)}&type=text%2Fhtml&card=1&schema=twitch`;
            var iframeUrl = `https://player.twitch.tv/?channel=${streamerName.split("/")[0]}&muted=false&parent=twitch.tv&quality=${quality}`; // Not using an intermediate stream for now since it's faster
            var existingIframe = document.getElementById("embed-adblock");

            if ((!streamerName && !lastStreamer) || videoOrClip()) {
                lastStreamer = null;

                for (let el of container.children) {
                    el.hidden = false;
                    if(el.tagName == "VIDEO") {
                        el.muted = false;
                    }
                }

                if (existingIframe) {
                    existingIframe.src = "";
                    existingIframe.hidden = true;
                }

                return;
            }
            else if (!streamerName) {
                return;
            }

            for (let el of container.children) {
                //don't set the src to empty, instead mute it and click a few buttons to set the quality
                if (el.tagName != "IFRAME" && el.tagName != "VIDEO") {
                    el.hidden = true;
                }
                else if (el.tagName == "VIDEO" && window.location.pathname.indexOf("/videos/") == -1) {
                    el.muted = true;
                    el.onloadedmetadata = function() {
                        if(document.querySelector('[data-a-target="player-settings-button"]') && !videoOrClip()) {
                            document.querySelector('[data-a-target="player-settings-button"]').click();
                        }
                        // time values are arbitrary, could use more mutationObservers but idk...
                        // maybe a set
                        let menu = setInterval(() => {
                            if(document.querySelector('[data-a-target="player-settings-menu-item-quality"]') && !videoOrClip()) {
                                document.querySelector('[data-a-target="player-settings-menu-item-quality"]').click();
                                clearInterval(menu);
                            }
                        }, 1000);
                        let quality = setInterval(() => {
                            if(document.querySelector('[data-a-target="player-settings-menu"]') && !videoOrClip()) {
                                document.querySelector('[data-a-target="player-settings-menu"]').lastChild.querySelector('input').click();
                                // if we were already on lowest, just close the menu
                                if(document.querySelector('[data-a-target="player-settings-menu-item-quality"]')) {
                                    document.querySelector('[data-a-target="player-settings-button"]').click();
                                }
                                clearInterval(quality);
                            }
                        }, 1000);

                        // Finally, hide original player element
                        el.style.display = "none";

                        return true;
                    }
                }
            }

            if (!existingIframe) {
                existingIframe = document.createElement("iframe");
                existingIframe.id = "embed-adblock";
                existingIframe.style = "width: 100%; height: 100%; visibility: hidden;"
                existingIframe.src = iframeUrl;
                existingIframe.onload = () => { existingIframe.style.visibility = "visible"; };

                // Put the iframe first, instead of last
                container.prepend(existingIframe);

                // fix for Firefox
                const vid = container.getElementById('video');
                vid.parentNode.appendChild(vid);
            }
            else if (streamerName != lastStreamer) {
                existingIframe.src = iframeUrl;
                existingIframe.hidden = false;
            }

            lastStreamer = streamerName
        });
        
        var observeInterval = setInterval(() => {
            var observee = document.getElementsByClassName("root-scrollable__wrapper tw-full-width tw-relative")[0];

            if (!observee)
                return;

            observer.observe(observee, { attributes: false, childList: true, subtree: true });
            clearInterval(observeInterval);
        }, 100);
    }
})();

function toggleCompressor(compressorButton, video, active) {
    if(active === 'false') {
        localStorage.setItem('compressor', 'false');
        compressorButton.querySelector(".tw-tooltip").innerText = 'Disable Audio Compressor';
        compressorButton.querySelector("g").innerHTML = `<path fill-rule="evenodd" d="${compressor_on}" clip-rule="evenodd"></path>`;
        compressorButton.setAttribute('data-active', 'true');
        video.source.disconnect(video.context.destination);
        video.source.connect(video.compressor);
        video.compressor.connect(video.context.destination);
    } else if(active === 'true'){
        localStorage.setItem('compressor', 'true');
        compressorButton.querySelector(".tw-tooltip").innerText = 'Audio Compressor';
        compressorButton.querySelector("g").innerHTML = `<path fill-rule="evenodd" d="${compressor_off}" clip-rule="evenodd"></path>`;
        compressorButton.setAttribute('data-active', 'false');
        video.compressor.disconnect(video.context.destination);
        video.source.disconnect(video.compressor);
        video.source.connect(video.context.destination);
    }
}

function videoOrClip() {
    return window.location.pathname.indexOf("/videos/") != -1 || window.location.pathname.indexOf("/clip/") != -1;
}
// ==UserScript==
// @name         Plex Improved
// @namespace    https://app.plex.tv
// @version      0.10.1
// @description  Misc improvements for Plex Web
// @author       GAD's Slave
// @license      MIT
// @match        *://app.plex.tv/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391453/Plex%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/391453/Plex%20Improved.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PAGE_ARGS = {};
    if (document.location.search) {
        const entries = document.location.search.substr(1).split("&");
        for (let entry of entries) {
            const parts = entry.split("=");
            if (parts.length > 1) {
                PAGE_ARGS[parts[0].toLowerCase()] = parts[1];
            }
        }
    }

    let PMS_URL = null;
    let PMS_TOKEN = null;

    const defaultOpen = XMLHttpRequest.prototype.open;
    const interceptRegex = /(https:\/\/[^/]+)\/media\/providers.*X-Plex-Token=([^&]+)/;

    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        this.addEventListener("load", function(data) {
            let match = url.match(interceptRegex);
            if (match && match[1].indexOf("plex.tv") === -1) {
                PMS_URL = match[1];
                PMS_TOKEN = match[2];
                //console.log("INTERCEPTED URL AND TOKEN", PMS_URL, PMS_TOKEN);
                //XMLHttpRequest.prototype.open = defaultOpen;
            }
        });
        defaultOpen.call(this, method, url, async, user, pass);
    };


    function Plex_executeRequest(args) {
        //console.log(PMS_URL + args.path);
        return fetch(PMS_URL + args.path, {
            "method": args.method || "GET",
            "credentials": "omit",
            "headers": {
                "accept":"application/json",
                "accept-language":"en",
                "sec-fetch-mode":"cors",
                "X-Plex-Platform": "Chrome", // (Platform name, eg iOS, MacOSX, Android, LG, etc)
                "X-Plex-Platform-Version": "77.0", // (Operating system version, eg 4.3.1, 10.6.7, 3.2)
                "X-Plex-Client-Identifier": "3c7ngglau55iad5rz61zuzy1", // (UUID, serial number, or other number unique per device)
                "X-Plex-Product": "Plex Web", // (Plex application name, eg Laika, Plex Media Server, Media Link)
                "X-Plex-Version": "4.10.1", // (Plex application version number)
                "X-Plex-Device": "Windows", // (Device name and model number, eg iPhone3,2, Motorola XOOM™, LG5200TV)
                "X-Plex-Token": PMS_TOKEN, // (Authentication token)
            },
            "referrer": "https://app.plex.tv/",
            "referrerPolicy": "origin-when-cross-origin",
            "mode": "cors",
            "body": null
        })
        .then((res) => res.text())
        .then((text) => {
            try {
              return JSON.parse(text);
            }
            catch (err) { return {}; }
        }, (err) => console.error(err));
    }

    window.Plex_executeRequest = Plex_executeRequest;

    function getStreamId(stream) {
        return stream ? stream.id : 0;
    }

    function getSelectedStreams(mediaInfo) {
        const sel = { audio: null, subs: null };
        for (let stream of mediaInfo.Media[0].Part[0].Stream) {
            if (!stream.selected) {
                continue;
            }

            if (stream.streamType == 2) { // Audio
                sel.audio = stream;
            } else if (stream.streamType == 3) {// Subtitles
                sel.subs = stream;
            }
        }
        return sel;
    }

    function getStreamsMatchScore(a, b)
    {
        if (a.displayTitle === b.displayTitle) {
            return 10;
        }
        if (a.languageCode === b.languageCode) {
            return 5;
        }

        return 0;
    }

    function getClosestStreams(mediaInfo, targets) {
        const result = { audio: null, subs: null };
        const scores = { audio: 0, subs: 0 };
        //console.log("CLOSEST", mediaInfo.Media[0].Part[0].Stream);
        for (let stream of mediaInfo.Media[0].Part[0].Stream) {
            let key = null;
            if (stream.streamType == 2) { // Audio
                key = "audio";
            } else if (stream.streamType == 3) {// Subtitles
                key = "subs";
            }

            if (!key) {
                continue;
            }

            if (!targets[key]) { // target is null, so closest is null
                continue;
            }

            const score = getStreamsMatchScore(stream, targets[key]);
            if (!result[key] || score > scores[key]) {
                scores[key] = score;
                result[key] = stream;
            }
        }
        return result;
    }

    function copyLanguagesTo(key, targetStreams, state) {
        //console.log("TargetStreams", targetStreams);
        return Plex_executeRequest({
            path: key
        }).then((data) => {
            const ep = data.MediaContainer.Metadata[0];
            //console.log("Current ", currentEp.ratingKey, " / Other ", ep.ratingKey);

            const selected = getSelectedStreams(ep);
            const closest = getClosestStreams(ep, targetStreams);

            const args = [];
            if (getStreamId(selected.audio) !== getStreamId(closest.audio)) {
                //console.log("Changing audio stream: new=\"" + targetStreams.audio.displayTitle +
                //            "\", curr=\"" + getSelectedStreams(ep).audio.displayTitle + "\"");
                args.push("audioStreamID=" + getStreamId(closest.audio));
            }

            if (getStreamId(selected.subs) !== getStreamId(closest.subs)) {
                //console.log("Changing subs stream: new=\"" + targetStreams.subs.displayTitle +
                //            "\", curr=\"" + getSelectedStreams(ep).subs.displayTitle + "\"");
                args.push("subtitleStreamID=" + getStreamId(closest.subs));
            }

            if (args.length > 0) {
                state.numChanges += 1;
                return Plex_executeRequest({
                    method: 'PUT',
                    path: "/library/parts/" + ep.Media[0].Part[0].id + "?" + args.join("&")
                });
            }
            else {
                return true;
            }
        });
    }

    function getCurrentMediaRatingKey() {
        return location.hash.match(/key=[^&]+%2F([^&%]+)(&|$)/)?.[1];
        //return decodeURIComponent(location.hash.match(/key=([^&]+)&/)[1]);
        //return document.body.querySelector('div[class^="MetadataPosterCard-cardContainer"][data-qa-id]').getAttribute("data-qa-id").match(/metadata\/(.+)/)[1];
    }

    function copyLanguagesToSeason(seasonInfo, targetStreams, ratingKeyToIgnore) {
        return Plex_executeRequest({
            path: seasonInfo.key
        }).then((data) => {
            const seasonEpisodes = data.MediaContainer.Metadata;
            seasonInfo.numChanges = 0;

            const promises = [];
            for (let ep of seasonEpisodes) {
                if (ep.ratingKey !== ratingKeyToIgnore) {
                    promises.push(copyLanguagesTo(ep.key, targetStreams, seasonInfo));
                }
            }
            return Promise.all(promises);
        });
    }

    function copyLanguagesToSeasons(onlyCurrentSeason) {
        Plex_executeRequest({
            path: '/library/metadata/' + getCurrentMediaRatingKey()
        }).then((data) => {
            const currentEp = data.MediaContainer.Metadata[0];
            const targetStreams = getSelectedStreams(currentEp);

            let fetchSeasonListPromise;
            if (onlyCurrentSeason) {
                fetchSeasonListPromise = Promise.resolve([ { name: currentEp.parentTitle, key: currentEp.parentKey + "/children" } ]);
            } else {
                fetchSeasonListPromise = Plex_executeRequest({
                    path: currentEp.grandparentKey + "/children"
                }).then((data) => data.MediaContainer.Metadata.map((item) => { return { name: item.title, key: item.key }; }));
            }

            fetchSeasonListPromise.then((seasons) => {
                let processSeasonPromises = seasons.map((season) => copyLanguagesToSeason(season, targetStreams, currentEp.ratingKey));
                Promise.all(processSeasonPromises).then(() => {
                    let str = "";
                    for (let season of seasons) {
                        //if (season.numChanges > 0) {
                            str += "    " + season.name + ":  " + season.numChanges + " changes\n";
                        //}
                    }
                    if (str) {
                        alert("Updated language settings for " + currentEp.grandparentTitle + ":\n" + str);
                    } else {
                        alert("No changes performed");
                    }
                });

            });
        });
    }

    const style = document.createElement("style");
    style.innerText = `
.ScriptButton {
  background: transparent;
  border: none;
  outline: none;
  margin-left: 3em;
  color: #e5a00d;
  transition: color .2s;
  font-family: Open Sans Bold,Helvetica Neue,Helvetica,Arial,sans-serif;
}
.ScriptButton:hover, .ScriptButton svg:hover {
  color: #fff;
}
.ScriptButton svg {
  width: 1em;
  height: 1em;
  color: hsla(0,0%,100%,.7);
}
.ScriptButton + .ScriptButton {
  margin-left: 8px;
}
`;
	document.head.appendChild(style);

    function createButton(id, title, classNames, innerHtml, callback) {
        const btn = document.createElement("button");
        btn.innerHTML = innerHtml;
        btn.title = title;
        btn.className = "ScriptButton " + classNames;
        btn.id = id;
        btn.setAttribute("aria-label", title);
        btn.setAttribute("role", "button");
        btn.onclick = callback;
        return btn;
    }

    let onPageChangedTimeout = null;

    function onPageChanged() {
        onPageChangedTimeout = null;
        //console.log("[onpagechange]");

        if (!document.getElementById("BtnCopyLanguagesToSeason")) {
            const container = Array.prototype.find.call(document.querySelectorAll('div[class^="PrePlayDetailsGroupItem-content"]'), (item) => item.previousElementSibling.innerText.toLowerCase().indexOf("audio") != -1);
            if (container !== undefined) {
                const svgPriceTag = '<svg viewBox="0 0 32 32"><path d="M30.5 0h-12c-0.825 0-1.977 0.477-2.561 1.061l-14.879 14.879c-0.583 0.583-0.583 1.538 0 2.121l12.879 12.879c0.583 0.583 1.538 0.583 2.121 0l14.879-14.879c0.583-0.583 1.061-1.736 1.061-2.561v-12c0-0.825-0.675-1.5-1.5-1.5zM23 12c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"></path></svg>';
                const svgPriceTags = '<svg viewBox="0 0 40 32"><path d="M38.5 0h-12c-0.825 0-1.977 0.477-2.561 1.061l-14.879 14.879c-0.583 0.583-0.583 1.538 0 2.121l12.879 12.879c0.583 0.583 1.538 0.583 2.121 0l14.879-14.879c0.583-0.583 1.061-1.736 1.061-2.561v-12c0-0.825-0.675-1.5-1.5-1.5zM31 12c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"></path><path d="M4 17l17-17h-2.5c-0.825 0-1.977 0.477-2.561 1.061l-14.879 14.879c-0.583 0.583-0.583 1.538 0 2.121l12.879 12.879c0.583 0.583 1.538 0.583 2.121 0l0.939-0.939-13-13z"></path></svg>';
                const svgPower = '<svg viewBox="0 0 32 32"><path d="M12 0l-12 16h12l-8 16 28-20h-16l12-12z"></path></svg>';
                const svgFire = '<svg viewBox="0 0 32 32"><path d="M10.031 32c-2.133-4.438-0.997-6.981 0.642-9.376 1.795-2.624 2.258-5.221 2.258-5.221s1.411 1.834 0.847 4.703c2.493-2.775 2.963-7.196 2.587-8.889 5.635 3.938 8.043 12.464 4.798 18.783 17.262-9.767 4.294-24.38 2.036-26.027 0.753 1.646 0.895 4.433-0.625 5.785-2.573-9.759-8.937-11.759-8.937-11.759 0.753 5.033-2.728 10.536-6.084 14.648-0.118-2.007-0.243-3.392-1.298-5.312-0.237 3.646-3.023 6.617-3.777 10.27-1.022 4.946 0.765 8.568 7.555 12.394z"></path></svg>';

                container.appendChild(createButton("BtnCopyLanguagesToSeason", "Copy to season", "ScriptButtonCustom", svgPower, function(ev) {
                    ev.preventDefault();
                    if (confirm("Copy language settings to all episodes of the current season?")) {
                        copyLanguagesToSeasons(true);
                    }
                }));

                container.appendChild(createButton("BtnCopyLanguagesToAllSeasons", "Copy to all seasons", "", svgFire, function(ev) {
                    ev.preventDefault();
                    if (confirm("Copy language settings to all episodes of all seasons?")) {
                        copyLanguagesToSeasons(false);
                    }
                }));
            }
        }
    }


    const observer = new MutationObserver(function(mutationsList, observer) {
        if (onPageChangedTimeout) {
            return;
        }

        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                //console.log('A child node has been added or removed.');
                onPageChangedTimeout = setTimeout(onPageChanged, 500);
                return;
            }
        }
    });


    let tryAttachObserverAttempts = 0;

    function tryAttachObserver() {
        let elem = document.getElementById("plex");
        if (elem) {
            observer.observe(elem, { childList: true, subtree: true });
        } else if (tryAttachObserverAttempts > 5) {
            console.error("[PlexImproved] Failed to attach content observer after 5 attempts...");
            return;
        } else {
            tryAttachObserverAttempts += 1;
            setTimeout(tryAttachObserver, 500);
        }

    }
    tryAttachObserver();

    /*window.addEventListener("hashchange", () => {
        onPageChanged();
    }, false);*/
})();
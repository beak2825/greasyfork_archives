// ==UserScript==
// @name                Pixeldrain bypass video block (keep original layout)
// @namespace           https://greasyfork.org/users/821661
// @match               https://pixeldrain.com/*
// @grant               GM.registerMenuCommand
// @version             1.1.3
// @require             https://update.greasyfork.org/scripts/526417/1540623/USToolkit.js
// @run-at              document-start
// @author              hdyzen
// @description         Show video even without logged in pixeldrain
// @license             GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/526583/Pixeldrain%20bypass%20video%20block%20%28keep%20original%20layout%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526583/Pixeldrain%20bypass%20video%20block%20%28keep%20original%20layout%29.meta.js
// ==/UserScript==

function commands() {
    const useBypassUrl = JSON.parse(localStorage.getItem("bypass-url"));

    if (useBypassUrl) bypassVideoUrl();

    GM.registerMenuCommand(`Use bypass src: [${useBypassUrl ? "ON" : "OFF"}]`, e => {
        if (useBypassUrl || confirm("This use bypassed url (the video may slow down or not load). Are you sure?")) {
            localStorage.setItem("bypass-url", !useBypassUrl);
            window.location.reload();
        }
    });
}
commands();

function bypassVideoUrl() {
    const handleMutations = () => {
        const source = document.querySelector("source[src^='/api/']");

        if (source) source.src = source.src.replace("https://pixeldrain.com/api/file/", "https://pd.cybar.xyz/");
    };

    const observer = new MutationObserver(handleMutations);

    observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true,
    });
}

Object.defineProperty(unsafeWindow, "viewer_data", {
    get: () => _viewer_data,
    set: value => {
        const files = value?.api_response?.files;

        if (files) {
            for (const file of value.api_response.files) {
                console.log(file);
                file.allow_video_player = true;
            }
        } else {
            value.api_response.allow_video_player = true;
            value.api_response.availability = "";
        }

        _viewer_data = value;
    },
});

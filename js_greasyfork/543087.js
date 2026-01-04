// ==UserScript==
// @name          Youtube channels open to "Videos" tab
// @description   By default, clicking on a channel while browsing Youtube loads the "Home" tab. This loads the "Videos" tab instead.
// @version       0.8
// @namespace     BawdyInkSlinger
// @author        BawdyInkSlinger
// @match         https://www.youtube.com/*
// @exclude       https://www.youtube.com/embed*
// @run-at        document-start
// @license       MIT License
// @grant         GM_registerMenuCommand
// @grant         GM_unregisterMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/543087/Youtube%20channels%20open%20to%20%22Videos%22%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/543087/Youtube%20channels%20open%20to%20%22Videos%22%20tab.meta.js
// ==/UserScript==

// original version: https://greasyfork.org/en/discussions/requests/56798-request-make-videoes-the-default-tab-on-youtube-channels#comment-455176
(async () => {
    let storage = undefined;
    initializeStorage();
    createDebugMenu();

    const channelHomeRegex = /^(https?:\/\/www\.youtube\.com)((\/(user|channel|c)\/[^/]+)|(\/@(?!.*\/)[^/]+))(\/?$|\/featured[^/])/;

    const startedOnChannel = channelHomeRegex.test(location.href);
    debug(`startedOnChannel=${startedOnChannel}`);
    if (startedOnChannel) {
        // this will get invoked when a youtube channel link is reached from a non-youtube origin page,
        // redirecting the link to /videos
        location.href = RegExp.$2 + "/videos";

        // BIS: I think there's a bug here but I've yet to prove it: If you navigate to another part of youtube, will
        // the script work due to this early return?
        return;
    }

    addEventListener('mousedown', event => {
        const anchorTag = event.target.closest('a');
        const anchorGoesToChannel = anchorTag && channelHomeRegex.test(anchorTag.href);

        debug(`anchorGoesToChannel`, anchorGoesToChannel, `anchorTag.href`, anchorTag?.href);
        debug(`anchorTag before modification:`, anchorTag, `anchorTag.data before modification:`, anchorTag?.data, `anchorTag._data before modification:`, anchorTag?._data);

        if (anchorGoesToChannel) {
            const channelName = RegExp.$2;
            debug(`channelName`, channelName);

            // a channel link was clicked so it has to be rewritten before the actual navigation happens

            // BIS: I don't fully understand this comment:
            // this makes sure the previous redirect not needed as long as the link clicked is on a youtube page
            // e.g. when opening a channel link in a new tab
            anchorTag.href = channelName + "/videos";

            anchorTag.data = {
                commandMetadata: {
                    webCommandMetadata: {
                        url: channelName + "/videos"
                    }
                },
                browseEndpoint: {
                    browseId: buildBrowseId(anchorTag),
                    /*

       BIS:
       How to get "anchorTag.data.browseEndpoint.params" if this extension stops working:
       1. Visit any channel's "Home" tab
       2. Below the tabs, there should be a few sub sections, one of them being "Videos". It should be a link.
       If this doesn't exist, find a different channel that matches this description.
       3. Using your browser's devtools, inspect the "Videos" sub section link.
       4. Right-click on the nearest "a" tag and select "Use in console" (Firefox). This creates a console variable named "temp0"
       5. In the console, type "temp0.data.browseEndpoint.params". Hit enter.
       6. This is the value that will bring you to the videos tab.
       7. Copy and paste it below.

       If this value is wrong, your browser URL will be correct when you click on a channel, but YouTube won't redirect you to the Videos tab.
       Current problem: I only know how to get this value by following these steps, but I don't know how to create correct `params` values
       when you click on a link that isn't already on the channel. Maybe somebody else can figure it out.

       The value does seem to be base 64 encoded, but I only know how to read a portion of the value. Maybe I haven't figured out the right character set
       to use.
       */
                    params: `EgZ2aWRlb3MYAyAAcALyBg0KCzoEIgIIBKIBAggB`
                }
            }

            debug(`anchorTag after modification:`, anchorTag, `anchorTag.data after modification:`, anchorTag?.data);
        }
    }, true);

    function buildBrowseId(anchorTag) {
        const data = anchorTag._data ?? anchorTag.data;
        const browseId = data?.browseEndpoint?.browseId
        if (browseId === undefined) {
            error(`buildBrowseId could not find a browseId in anchor's data`, anchorTag);
        }
        return browseId;
    }

    function initializeStorage() {
        storage = {
            get debugMode() {
                return GM_getValue("debugMode", false);
            },
            set debugMode(value) {
                GM_setValue("debugMode", value);
                log(`debugMode ${value ? "Enabled" : "Disabled"}`);
            }
        }
        log(`debugMode ${storage.debugMode ? "Enabled" : "Disabled"}`);
    }

    function createDebugMenu() {
        let debugMenuId = undefined;

        (function toggleMenu() {
            debugMenuId = GM_registerMenuCommand(`${storage.debugMode ? "Disable" : "Enable"} Debug Mode`, function(event) {
                storage.debugMode = !storage.debugMode;
                toggleMenu();
            }, {
                id: debugMenuId,
                title: `Debug Mode is ${storage.debugMode ? "Enabled" : "Disabled"}`,
            });
        })();
    }

    function debug(...args) {
        if (storage.debugMode) {
            console.log(`Youtube channels open to "Videos" tab:`, ...args);
        }
    }

    function log(...args) {
        console.log(`Youtube channels open to "Videos" tab:`, ...args);
    }

    function error(...args) {
        console.error(`Youtube channels open to "Videos" tab:`, ...args);
    }
})().catch((err) => {
    console.error(`Youtube channels open to "Videos" tab`, err);
});


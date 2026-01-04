// ==UserScript==
// @name         Musi.sh fix
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Musi.sh fix, https://github.com/TTFM-Labs/public/issues/7#issuecomment-812801722
// @author       You
// @match        https://musi.sh/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=musi.sh
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/445244/Musish%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/445244/Musish%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var config;

    function hookMusicKitInstance(i) {
        var oldSetQueue = i.setQueue;
        /* i.setQueue = function() {
            console.log("Musi.sh fix: MusicKit reconfigure");
            MusicKit.configure(config);
            var newInstance = MusicKit.getInstance();
            newInstance.setQueue = i.setQueue;
            newInstance.storekit._eventRegistry = i.storekit._eventRegistry;
            newInstance._registry = i._registry;
            console.log("Musi.sh fix: MusicKit instance change to ", newInstance);
            Object.assign(i, newInstance);
            console.log("Musi.sh fix: MusicKit old instance ", i);
            console.log("Musi.sh fix: setQueue", arguments);
            var setQueuePromise = oldSetQueue.apply(i, arguments);
            return setQueuePromise;
        }; */

        var flipflop = 0;

        i.addEventListener("mediaItemDidChange", function() {
            if (flipflop === 1) {
                flipflop = 0;
                return;
            }
            console.log("Musi.sh fix: MusicKit mediaItemDidChange position", i.player._queue.position);
            console.log("Musi.sh fix: MusicKit reconfigure");
            MusicKit.configure(config);
            var newInstance = MusicKit.getInstance();
            newInstance.storekit._eventRegistry = i.storekit._eventRegistry;
            newInstance._registry = i._registry;
            newInstance.player._queue = i.player._queue;
            newInstance.player._queue.position -= 1;
            newInstance.player._registry = i.player._registry;
            console.log("Musi.sh fix: MusicKit instance change to ", newInstance);
            Object.assign(i, newInstance);
            console.log("Musi.sh fix: MusicKit old instance ", i);
            console.log("Musi.sh fix: MusicKit position", newInstance.player._queue.position);

            flipflop = 1;
            newInstance.player.play();
        });

        console.log("Musi.sh fix: hooked instance");
    }

    window.addEventListener("load", function() {
        setTimeout(function() {
            var currInstance = MusicKit.getInstance();
            console.log("Musi.sh fix: MusicKit instance initial ", currInstance);
            config = {
                developerToken: currInstance.developerToken,
                app: Object.assign({}, currInstance._bag.app),
                bitrate: currInstance.bitrate,
            };
            console.log("Musi.sh fix: MusicKit config", config);

            hookMusicKitInstance(currInstance);
        }, 1);
    }, false);

})();


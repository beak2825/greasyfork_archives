// ==UserScript==
// @name                Smooth YouTube livestream
// @namespace           UserScripts
// @version             0.1.5
// @license             MIT License
// @match               https://www.youtube.com/*
// @grant               none
// @author              -
// @description         5/11/2025, 9:27:12 PM
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/535663/Smooth%20YouTube%20livestream.user.js
// @updateURL https://update.greasyfork.org/scripts/535663/Smooth%20YouTube%20livestream.meta.js
// ==/UserScript==

(() => {

    let slowedValue = -1;

    const observablePromise = (proc, timeoutPromise) => {
        let promise = null;
        return {
            obtain() {
                if (!promise) {
                    promise = new Promise(resolve => {
                        let mo = null;
                        const f = () => {
                            let t = proc();
                            if (t) {
                                mo.disconnect();
                                mo.takeRecords();
                                mo = null;
                                resolve(t);
                            }
                        }
                        mo = new MutationObserver(f);
                        mo.observe(document, { subtree: true, childList: true })
                        f();
                        timeoutPromise && timeoutPromise.then(() => {
                            resolve(null)
                        });
                    });
                }
                return promise
            }
        }
    }


    (async () => {


        const q = await observablePromise(() => {

            try {
                return ytcfg.data_.WEB_PLAYER_CONTEXT_CONFIGS.WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH;
            } catch (e) { }


        }).obtain();



        if (q) setup();

    })();



    let bb = false;
    const setup = () => {
        if (bb) return;
        bb = true;

        const q = ytcfg.data_.WEB_PLAYER_CONTEXT_CONFIGS.WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH;
        if (q && q.serializedExperimentFlags) {
            const x = 85; // 17
            const y = 1.25; // 0.25
            q.serializedExperimentFlags = q.serializedExperimentFlags.replace(/&?html5_live_use_alternate_bandwidth_window_sizes=[^&=]*/, '') + '&html5_live_use_alternate_bandwidth_window_sizes=true'
            q.serializedExperimentFlags = q.serializedExperimentFlags.replace(/&?html5_live_ultra_low_latency_bandwidth_window=[^&=]*/, '') + '&html5_live_ultra_low_latency_bandwidth_window=' + x
            q.serializedExperimentFlags = q.serializedExperimentFlags.replace(/&?html5_live_low_latency_bandwidth_window=[^&=]*/, '') + '&html5_live_low_latency_bandwidth_window=' + x
            q.serializedExperimentFlags = q.serializedExperimentFlags.replace(/&?html5_live_normal_latency_bandwidth_window=[^&=]*/, '') + '&html5_live_normal_latency_bandwidth_window=' + x
            q.serializedExperimentFlags = q.serializedExperimentFlags.replace(/&?html5_min_startup_buffered_media_duration_for_live_secs=[^&=]*/, '') + '&html5_min_startup_buffered_media_duration_for_live_secs=' + y
        }

    };

    let cid1 = 0, cid2 = 0;
    let checks = new Set();
    let lastMedia = null;
    const onDelayDone = () => {
        const media = lastMedia;
        lastMedia = null;
        if (!media) return;
        // L = n * 1 - n * 0.968
        if (media.isConnected && media.playbackRate === slowedValue) {
            media.playbackRate = 1;
        }
    }
    const delayCheck = () => {
        let media;
        for (const target of checks) {
            if (target.isConnected && target.playbackRate === 1 && target.matches('#player *, #ytd-player *')) {
                media = target;
                break;
            }
        }
        if (!media) return;
        if (!document.querySelector('.ytp-live-badge.ytp-live-badge-is-livehead')) return;
        if (cid2) clearTimeout(cid2);
        if (lastMedia && lastMedia.isConnected && lastMedia.playbackRate === slowedValue) lastMedia.playbackRate = 1;
        lastMedia = media;
        if (media.currentTime > 0.08 && media.duration > 0.08) {
            media.playbackRate = 0.968
            slowedValue = media.playbackRate;
            cid2 = setTimeout(onDelayDone, 30000);
        }
    }
    document.addEventListener('canplay', (e) => {
        if (!e || !e.isTrusted || !(e.target instanceof HTMLMediaElement)) return;
        const p = document.querySelector('.ytp-live-badge.ytp-live-badge-is-livehead');
        const media = e.target;
        if (p && media.playbackRate === 1) {
            if (cid1) clearTimeout(cid1);
            checks.add(media);
            cid1 = setTimeout(delayCheck, 100);
        }
    }, true);
})();
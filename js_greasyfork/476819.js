// ==UserScript==
// @name        FeatureFM Remove Tracking
// @description Removes trackers from FeatureFM (ffm.to) platform links
// @namespace   https://github.com/JunkiEDM
// @author      JunkiEDM
// @version     1.0
// @match       https://*.ffm.to/*
// @grant       none
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/476819/FeatureFM%20Remove%20Tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/476819/FeatureFM%20Remove%20Tracking.meta.js
// ==/UserScript==

document.querySelectorAll('a[href^="https://api.ffm.to"]').forEach((elm) => {
    let url = new URL(elm.href);
    if (url.searchParams.has('cd')) {
        let data = url.searchParams.get('cd').replaceAll('_','/').replaceAll('-','+');
        data = atob(data);
        data = JSON.parse(data);
        let destUrl = new URL(data.destUrl);
        if (destUrl.hostname == 'ffm.prf.hn') {
            let pathname = destUrl.pathname.split('/').splice(1);
            if (pathname[0] == 'click') {
                pathname.splice(1).forEach((opt) => {
                    opt = opt.split(':');
                    if (opt.length > 1 && opt[0] == 'destination') {
                        destUrl = new URL(decodeURIComponent(opt[1]));
                    }
                })
            }
        } else if (destUrl.hostname.includes('app.link')) {
            if (destUrl.searchParams.has('$desktop_url')) {
                destUrl = new URL(destUrl.searchParams.get('$desktop_url'));
            }
        }
        let trackingParams = ['ref','tag','ct','at','ls']
        trackingParams.forEach((p)=>{
            if (destUrl.searchParams.has(p)) {
                destUrl.searchParams.delete(p)
            }
        })
        elm.href = destUrl.href;
    }
})
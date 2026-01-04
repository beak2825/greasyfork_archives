// ==UserScript==
// @name        steamAny
// @namespace   tea.pm
// @match       https://store.steampowered.com/app/*
// @include     *
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @version     1.2
// @author      cljnnn
// @license     MIT
// @description steam anywhere
// @downloadURL https://update.greasyfork.org/scripts/455092/steamAny.user.js
// @updateURL https://update.greasyfork.org/scripts/455092/steamAny.meta.js
// ==/UserScript==

function xhr(option) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            ...option,
            onerror: reject,
            onload: resolve,
        });
    });
}

async function get(endpoint, headers = null) {
    try {
        console.log(`getting json response:${endpoint}`)
        let response = await xhr({
            method: "GET",
            url: endpoint,
            headers: headers
        });
        response = JSON.parse(response.responseText)
        console.log('in get method', `${response}`)
        return response;
    } catch (e) {
        console.error(`error when processing ${endpoint}`, e);
        return null;
    }
}

const update_interval = 1000 * 60 * 30;
const failed_update_interval = 1000 * 60 * 1;
async function refreshUserSteam() {
    const cached = GM_getValue("steam", {
        next_update: 0,
        lookup: {}
    });
    if (cached && Date.now() < cached.next_update) {
        return cached;
    }
    let webResult = await get(`https://store.steampowered.com/dynamicstore/userdata/?t=${Date.now()}`);
    let result = null;
    if (webResult && (webResult.rgWishlist.length || webResult.rgOwnedApps.length)) {
        result = {
            next_update: Date.now() + update_interval,
            lookup: {}
        };
        for (const appId of webResult.rgWishlist) {
            result.lookup['app/'+appId] = 'wish';
        }
        for (const subId of webResult.rgOwnedPackages) {
            result.lookup['sub/'+subId] = 'owned';
        }
        for (const appId of webResult.rgOwnedApps) {
            result.lookup['app/'+appId] = 'owned';
        }
    } else {
        result = cached;
        result.next_update = Date.now() + failed_update_interval;
    }

    GM_setValue("steam", result);
    return result;
}

let userdata = null;
const pattern = /[\W^](store\.steampowered\.com)\/((app|sub)\/\d+)/;

async function handle(node) {
    if (node === null || typeof node !== 'object' || !('querySelectorAll' in node)) return;
    var links = node.querySelectorAll('a:not(.steam_processed)');
    for (const link of links) {
        var m = pattern.exec(link.href);
        if (!m) continue;
        if (userdata === null) userdata = await refreshUserSteam();
        if (userdata === null) return;
        const gameStatus = userdata.lookup[m[2]];
        if (!gameStatus) continue;
        let oldStyle = link.getAttribute('style');
        oldStyle = oldStyle?oldStyle:"";
        if (gameStatus === 'owned') {
            link.setAttribute('style', 'background: rgba(56, 142, 60, 0.75) !important; color: white !important;' + oldStyle);
        }
        if (gameStatus === 'wish') {
            link.setAttribute('style', 'background: rgba(2, 136, 209, 0.75) !important; color: white !important;' + oldStyle);
        }
        link.classList.add('steam_processed');
    }
}

function action(changes, observer) {
    for (let mutation of changes) {
        handle(mutation.target);
        for (let node of mutation.addedNodes) {
            handle(node);
        }
    }
}

var observer = new MutationObserver(action);
observer.observe(document.body, { childList: true, subtree: true });
handle(document.body);
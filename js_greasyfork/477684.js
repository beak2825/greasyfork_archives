// ==UserScript==
// @name Civitai 增强
// @author Hyun
// @license MIT
// @description 获得更佳的 Civitai 体验，功能解锁
// @version 0.0.1
// @icon https://civitai.com/favicon.ico
// @match https://civitai.com/*
// @grant unsafeWindow
// @run-at document-start
// @namespace https://greasyfork.org/users/718868
// @downloadURL https://update.greasyfork.org/scripts/477684/Civitai%20%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/477684/Civitai%20%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

function patchUser(user) {
    user.isModerator = true;
    user.permissions = ["dev", "mod", "public", "user", "founder", "granted"];
}

const observer = new MutationObserver((mutationList, observer)=>{
    const target = document.getElementById('__NEXT_DATA__');
    if(!target) return;

    const json = JSON.parse(target.innerText);
    for(const k of Object.keys(json.props.pageProps.flags)) {
        json.props.pageProps.flags[k] = true;
    }
    patchUser(json.props.pageProps.session.user);
    target.innerText = JSON.stringify(json);
    console.log('[*] Patched!', target);
    observer.disconnect();
});

observer.observe(document.documentElement, { childList: true, subtree: true });

async function myFetch(uri, ...rest) {
    const res = await fetch(uri, ...rest);
    if(uri == '/api/auth/session') {
        const json = await res.json();
        console.log('[*] session', json);
        patchUser(json.user);

        Object.defineProperty(res, 'json', {
            get: ()=> () => Promise.resolve(json)
        });
    }

    return res;
}

Object.defineProperty(unsafeWindow, 'fetch', {
    get: ()=> myFetch,
    set() {},
    configurable: false
});

// ==UserScript==
// @name         Custom bilishare
// @namespace    https://github.com/invobzvr
// @version      0.4
// @description  B站(bilibili)大会员共享
// @author       invobzvr
// @match        *://www.bilibili.com/bangumi/play/*
// @grant        unsafeWindow
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GPL-3.0
// @homepageURL  https://github.com/invobzvr/invotoys.js/tree/main/bilishare
// @supportURL   https://github.com/invobzvr/invotoys.js/issues
// @downloadURL https://update.greasyfork.org/scripts/424805/Custom%20bilishare.user.js
// @updateURL https://update.greasyfork.org/scripts/424805/Custom%20bilishare.meta.js
// ==/UserScript==

(function () {
    const ORI_XHRO = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function () {
        let url = arguments[1],
            idx = url.indexOf('api.bilibili.com/pgc/player/web/playurl');
        if (idx !== -1 && idx < 9 && access_key) {
            url.startsWith('//') && (url = url.replace('//', 'https://'));
            url = new URL(url);
            url.searchParams.append('access_key', access_key);
            arguments[1] = url;
            this.addEventListener('readystatechange', () => {
                if (this.readyState !== 4) {
                    return;
                }
                let ret = JSON.parse(this.responseText);
                if (ret.code === -10403) {
                    GM_deleteValue('access_key');
                    alert('"access_key" may have expired');
                }
            });
        };
        return ORI_XHRO.apply(this, arguments);
    }

    function proxyIV() {
        let userState;
        return new Promise(resolve => {
            let iid = setInterval(() => {
                if (typeof __INITIAL_STATE__.userState.vipInfo.isVip !== 'undefined') {
                    clearInterval(iid);
                    userState = Object.assign({}, __INITIAL_STATE__.userState);
                    Object.defineProperty(userState.vipInfo, 'isVip', { value: true });
                    Object.defineProperty(__INITIAL_STATE__, 'userState', { value: userState });
                    resolve();
                }
            }, 100);
        });
    }

    async function init() {
        await proxyIV();
        let ep_id = __INITIAL_STATE__.epInfo.id;
        bangumiCallNext(`${ep_id}.`);
        let iid = setInterval(() => (location.pathname.endsWith('.') && (clearInterval(iid), bangumiCallNext(ep_id))), 100);
    }

    let access_key = GM_getValue('access_key');
    access_key && init();
    addEventListener('contextmenu', evt => {
        if (!evt.target.classList.contains('btn-pay')) {
            return;
        }
        evt.preventDefault();
        let val = prompt('Input "access_key":', access_key);
        if (!val) {
            return;
        } else if (val === 'delete') {
            GM_deleteValue('access_key');
            console.log('[access_key] deleted');
        } else if (val.length === 32) {
            GM_setValue('access_key', val);
            access_key = val;
            init();
            console.log('[access_key] setted');
        } else {
            alert('Invalid "access_key"');
        }
    });
    Object.defineProperty(unsafeWindow, 'access_key', {
        get: () => access_key,
        set: val => {
            if (val) {
                GM_setValue('access_key', val);
                let lak = !access_key;
                access_key = val;
                lak && init();
                console.log('[access_key] setted');
            } else {
                GM_deleteValue('access_key');
                console.log('[access_key] deleted');
            }
        }
    });
})();
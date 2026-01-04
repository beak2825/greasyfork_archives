// ==UserScript==
// @name         Raka Script
// @homepageURL  https://discord.com/users/863635169021919252
// @description  [ANDROID ONLY!] Bypass (Fluxus, Arceus, HohoHub,Tsuo )
// @author       Raka

// @match        https://keysystem.fluxteam.net/android/checkpoint/start.php?HWID=*
// @match        https://spdmteam.com/key-system-1?hwid=*
// @match        https://hohohubv-ac90f67762c4.herokuapp.com/api/getkeyv2?hwid=*
// @match        https://tsuo-script.xyz/*

// @connect      api.codex.lol
// @connect      fluxteam.net
// @connect      spdmteam.com
// @connect      api-gateway.platoboost.com
// @connect      api.keyrblx.com
// @connect      pandadevelopment.net
// @connect      hohohubv-ac90f67762c4.herokuapp.com
// @connect      tsuo-script.xyz
// @connect      *

// @run-at       document-end
// @version      2.0
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://update.greasyfork.org/scripts/484331/1308737/customnotifications.js
// @resource     notifCss https://cdn.jsdelivr.net/gh/f3oall/awesome-notifications/dist/style.css
// @license      MIT
// @supportURL   https://discord.com/users/863635169021919252
// @icon         https://media.discordapp.net/attachments/1203644711370227712/1205040409693134908/2558-fluxus.png?ex=65d6ec56&is=65c47756&hm=f9f2e38f3e7dd7b7fbaa2e10944151de66e7974bfef84fbba411d28eaa4ff222&=&format=webp&quality=lossless
// @namespace    https://greasyfork.org/id/users/1258917
// @downloadURL https://update.greasyfork.org/scripts/486939/Raka%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/486939/Raka%20Script.meta.js
// ==/UserScript==

const notifier = new AWN({ icons: { enabled: false } });

const util = {
    handleError: function (error, keySystem) {
        console.error(error);
        navigator.clipboard.writeText(`[${keySystem}] ${error.message}`);
        notifier.alert(error.message + '<br><br>bypass failed.<br>please <a href="https://discord.com/users/863635169021919252">click here to dm author</a> to report this issue.', { durations: { alert: 0 } });
        window.open('https://discord.com/users/863635169021919252', '_blank');
    },
    sleep: function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    linkvertiseSpoof: function (link, userAgent = '') {
        let headers = {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9",
            "referer": "https://linkvertise.com/",
            "sec-ch-ua": "\"Kiwi Browser\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Android\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "cross-site",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1"
        }
        if (userAgent) {
            headers['user-agent'] = userAgent;
        }
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: link,
                headers: headers,
                onload: function (response) {
                    resolve(response.responseText);
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
    },
    getTurnstileResponse: async function () {
        while (typeof turnstile == 'undefined' || !turnstile?.getResponse) {
            await util.sleep(1000);
        }
        let res = '';
        while (!res) {
            try {
                res = turnstile.getResponse();
                notifier.warning('please solve the captcha', { durations: { warning: 2000 } });
            } catch (e) { }
            await util.sleep(2500);
        }
        return turnstile.getResponse();
    },
    getGrecaptchaResponse: async function () {
        while (typeof grecaptcha == 'undefined' || !grecaptcha?.getResponse) {
            await util.sleep(1000);
        }
        let res = '';
        while (!res) {
            try {
                res = grecaptcha.getResponse();
                notifier.warning('please solve the captcha', { durations: { warning: 2000 } });
            } catch (e) { }
            await util.sleep(2500);
        }
        return grecaptcha.getResponse();
    },
    getHcaptchaResponse: async function () {
        while (typeof hcaptcha == 'undefined' || !hcaptcha?.getResponse) {
            await util.sleep(1000);
        }
        let res = '';
        while (!res) {
            try {
                res = hcaptcha.getResponse();
                notifier.warning('please solve the captcha', { durations: { warning: 2000 } });
            } catch (e) { }
            await util.sleep(2500);
        }
        return hcaptcha.getResponse();
    }
};

async function fluxus() {
    if (typeof AOS != 'object') {
        return;
    }
    try {
        window.stop();
        let userAgents = await (await fetch('https://raw.githubusercontent.com/microlinkhq/top-user-agents/master/src/desktop.json')).json()
        userAgents = userAgents.filter(userAgent => userAgent.includes('Windows'));
        let userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

        let response = await util.linkvertiseSpoof('https://fluxteam.net/android/checkpoint/check1.php', userAgent);
        if (response?.includes('bypass')) {
            throw new Error('bypass detected');
        }

        response = await util.linkvertiseSpoof('https://fluxteam.net/android/checkpoint/main.php', userAgent);
        if (response?.includes('bypass')) {
            throw new Error('bypass detected');
        }
        notifier.info('All stages completed');
        await util.sleep(100);

        let documentParser = new DOMParser();
        let newBodyData = documentParser.parseFromString(response, 'text/html');
        document.body.innerHTML = newBodyData.body.innerHTML;
        document.querySelector('a button:nth-child(2)').onclick = function () {
            navigator.clipboard.writeText(document.querySelector('code').innerHTML.trim());
        }
        notifier.success('bypassed successfully', { durations: { success: 0 } });
        notifier.warning('This Script Made By rakaflux!', { durations: { warning: 0 } });
    }
    catch (e) {
        util.handleError(e, 'fluxus');
    }
}

async function arceus() {
    if (document.title == 'Just a moment...') { return; }
    try {
        let url = new URL(window.location.href);
        let hwid = url.searchParams.get('hwid');
        await fetch(`https://spdmteam.com/api/keysystem?hwid=${hwid}&zone=Europe/Rome&advertiser=linkvertise`, { mode: "no-cors" })
        for (let checkpointsDone = 1; checkpointsDone <= 3; checkpointsDone++) {
            await util.linkvertiseSpoof(`https://spdmteam.com/api/keysystem?step=${checkpointsDone}&advertiser=linkvertise`);
            notifier.info(`${checkpointsDone} stages completed`, 2000)
            await util.sleep(3000);
        }
        notifier.success('bypassed successfully', { durations: { success: 0 } });
        await util.sleep(5000);
        window.location.assign('https://spdmteam.com/key-system-getkey');
        notifier.warning('This Script Made By rakaflux!', { durations: { warning: 0 } });
    }
    catch (e) {
        util.handleError(e, 'arceus');
    }
}

async function hohohub() {
    function spoofAdView(url) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: url,
                headers: {
                    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    Referer: 'https://loot-link.com/',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'cross-site',
                    'Sec-Fetch-User': '?1',
                    'Upgrade-Insecure-Requests': '1',
                },
                onload: function (response) {
                    resolve(response);
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
    }
    try {
        if (document.body.innerHTML.includes('Successfully Whitelisted!')) {
            notifier.success('bypassed successfully', { durations: { success: 0 } });
            notifier.warning('This Script Made By rakaflux!', { durations: { warning: 0 } });
            return;
        }
        document.getElementById('subscribeModal').remove();
        let tokenRegex = /nextCheckpoint\('.+'\)/g;
        let lootlinkToken = document.body.innerHTML.match(tokenRegex)[1].split("'")[1].split("'")[0];
        await fetch(`https://hohohubv-ac90f67762c4.herokuapp.com/api/captcha/${await util.getTurnstileResponse()}/${lootlinkToken}`, { method: 'POST' });
        await fetch(`https://hohohubv-ac90f67762c4.herokuapp.com/api/start?token=${lootlinkToken}`, { redirect: 'manual' });
        let currentStage = document.getElementsByTagName('p')[0].innerHTML.split('checkpoint ')[1].split(' ')[0];
        await spoofAdView(`https://hohohubv-ac90f67762c4.herokuapp.com/api/step?step=${parseInt(currentStage) + 1}`);
        window.location.reload();
    }
    catch (e) {
        util.handleError(e, 'hohohub');
    }
}

async function tsuohub() {
    let url = new URL(window.location.href);
    if (url.pathname == '/complete') {
        notifier.success('bypassed successfully', { durations: { success: 0 } });
        notifier.warning('This Script Made By rakaflux!', { durations: { warning: 0 } });
        return;
    }
    else if (!(['/getkey', '/step'].includes(url.pathname))) {
        return;
    }
    function getDestUrl() {
        console.log(url);
        return new Promise(async (resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: `${url.origin + url.pathname + url.search}${url.search ? '&' : '?'}g-recaptcha-response=${await util.getGrecaptchaResponse()}`,
                onload: function (response) {
                    resolve(response.finalUrl);
                },
                onerror: function (error) {
                    reject(error);
                },
                headers: {
                    Referer: window.location.href,
                }
            });
        });
    }
    function spoofAdView() {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: 'https://tsuo-script.xyz/complete',
                headers: {
                    Referer: 'https://zonatti.com/',
                },
                onload: function (response) {
                    resolve(response.responseText);
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
    }
    let dest = new URL(await getDestUrl());
    if (dest.hostname == 'tsuo-script.xyz') {
        window.location.assign(dest.href);
        notifier.info('1/2 Stage compleated');
    }
    else {
        await spoofAdView();
        notifier.info('All stage completed');

        await util.sleep(2000);
        window.location.assign('https://tsuo-script.xyz/complete')

    }
}

(async function () {
    GM.getResourceText("notifCss").then(css => {
        GM.addStyle(css)
    })

    notifier.info('bypass started', { durations: { info: 0 } });
    let url = new URL(window.location.href);
    switch (url.hostname) {
        case 'mobile.codex.lol': {
            await codex();
            break;
        }
        case 'keysystem.fluxteam.net': {
            await fluxus();
            break;
        }
        case 'spdmteam.com': {
            await arceus();
            break;
        }
        case 'gateway.platoboost.com': {
            await delta();
            break;
        }
        case 'valyse.best': {
            await valyse();
            break;
        }

        case 'keyrblx.com': {
            await keyrblx();
            break;
        }
        case 'auth.pandadevelopment.net': {
            await pandadevelopment();
            break;
        }
        case 'hohohubv-ac90f67762c4.herokuapp.com': {
            await hohohub();
            break;
        }
        case 'tsuo-script.xyz': {
            await tsuohub();
            break;

        }
        default: {
            notifier.alert('unsupported key system', { durations: { alert: 0 } });
            break;
        }
    }
})();
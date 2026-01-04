// ==UserScript==
// @name         [Working] Roblox Exploits Key System bypasser (ALL Exucutors and Scripts!)
// @description  bypasses Roblox Exploits Key Systems (Codex, Fluxus, Arceus, Delta, Valyse, Keyrblx, Pandadevelopment, HoHo Hub, Tsuohub)
// @author       d15c0rdh4ckr (768868463459434517)

// @match        https://mobile.codex.lol/*
// @match        https://fluxusbypass.pages.dev/*
// @match        https://keysystem.fluxteam.net/android/checkpoint/start.php?HWID=*
// @match        https://spdmteam.com/key-system-1?hwid=*
// @match        https://gateway.platoboost.com/a/8?id=*
// @match        https://valyse.best/verification?device_id=*
// @match        https://keyrblx.com/getkey/*
// @match        https://pandadevelopment.net/getkey?*
// @match        https://hohohubv-ac90f67762c4.herokuapp.com/api/getkeyv2?hwid=*
// @match        https://tsuo-script.xyz/*

// @connect      linkvertise.com
// @connect      short-jambo.com
// @connect      api.codex.lol
// @connect      cdn.jsdelivr.net
// @connect      fluxteam.net
// @connect      spdmteam.com
// @connect      api-gateway.platoboost.com
// @connect      api.valyse.best
// @connect      api.keyrblx.com
// @connect      pandadevelopment.net
// @connect      hohohubv-ac90f67762c4.herokuapp.com
// @connect      tsuo-script.xyz
// @connect      *

// @version      1707193072272
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_openInTab

// @antifeatures ads

// @license      MIT
// @icon         https://files.catbox.moe/gu2z11.jpg
// @namespace    https://greasyfork.org/users/1237543
// @downloadURL https://update.greasyfork.org/scripts/489239/%5BWorking%5D%20Roblox%20Exploits%20Key%20System%20bypasser%20%28ALL%20Exucutors%20and%20Scripts%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/489239/%5BWorking%5D%20Roblox%20Exploits%20Key%20System%20bypasser%20%28ALL%20Exucutors%20and%20Scripts%21%29.meta.js
// ==/UserScript==

if (document.title == 'Just a moment...') {
    return;
}

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 636:
/***/ ((module) => {

function injectAds() {
    if (window.location.hostname == 'fluxusbypass.pages.dev') {
        return;
    }

    let adSourcePopunder = '//mildcauliflower.com/6d/04/11/6d04112dc059789eff804dbcc51df896.js';
    let popunderScript = document.createElement('script');
    popunderScript.src = adSourcePopunder;
    popunderScript.type = 'text/javascript';
    document.head.appendChild(popunderScript);

    let adSourceSocialbar = '//mildcauliflower.com/43/63/c7/4363c7e706daa736f6938d859fd1f9d4.js';
    let socialbarScript = document.createElement('script');
    socialbarScript.src = adSourceSocialbar;
    socialbarScript.type = 'text/javascript';
    document.body.appendChild(socialbarScript);

    let adSource728x90 = '//mildcauliflower.com/60f173c46f3d3d19147ea478739865d7/invoke.js';
    let ad728x90Script = document.createElement('script');
    ad728x90Script.src = adSource728x90;
    ad728x90Script.type = 'text/javascript';
    ad728x90Script.onload = function () {
        atOptions = {
            'key': '60f173c46f3d3d19147ea478739865d7',
            'format': 'iframe',
            'height': 90,
            'width': 728,
            'params': {}
        };
    };
    document.body.prepend(ad728x90Script);
}

module.exports = {
    injectAds
}

/***/ }),

/***/ 24:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { handleError, sleep, linkvertiseSpoof, getTurnstileResponse, getGrecaptchaResponse, notification } = __webpack_require__(223)

async function codex() {
    let session;
    while (!session) {
        session = localStorage.getItem("android-session");
        await sleep(1000);
    }
    if (document?.getElementsByTagName('a')?.length && document.getElementsByTagName('a')[0].innerHTML.includes('Get started')) {
        document.getElementsByTagName('a')[0].click();
    }

    async function getStages() {
        let response = await fetch('https://api.codex.lol/v1/stage/stages', {
            method: 'GET',
            headers: {
                'Android-Session': session
            }
        });
        let data = await response.json();

        if (data.success) {
            if (data.authenticated) {
                return [];
            }
            return data.stages;
        }
        else {
            throw new Error("ข้ามไม่สำเร็จ");
        }
    }
    async function initiateStage(stageId) {
        let response = await fetch('https://api.codex.lol/v1/stage/initiate', {
            method: 'POST',
            headers: {
                'Android-Session': session,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ stageId })
        });
        let data = await response.json();

        if (data.success) {
            return data.token;
        }
        else {
            throw new Error("ข้ามไม่สำเร็จ");
        }
    }
    async function validateStage(token, referrer) {
        let response = await fetch('https://api.codex.lol/v1/stage/validate', {
            method: 'POST',
            headers: {
                'Android-Session': session,
                'Content-Type': 'application/json',
                'Task-Referrer': referrer
            },
            body: JSON.stringify({ token })
        });
        let data = await response.json();

        if (data.success) {
            return data.token;
        }
        else {
            throw new Error("ข้ามไม่สำเร็จ");
        }

    }
    async function authenticate(validatedTokens) {
        let response = await fetch('https://api.codex.lol/v1/stage/authenticate', {
            method: 'POST',
            headers: {
                'Android-Session': session,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tokens: validatedTokens })
        });
        let data = await response.json();

        if (data.success) {
            return true;
        }
        else {
            throw new Error("ข้ามไม่สำเร็จ");
        }
    }

    function decodeTokenData(token) {
        let data = token.split(".")[1];
        data = data.replace(/-/g, '+').replace(/_/g, '/');
        let decoded = atob(data);
        return JSON.parse(decoded);
    }

    let stages = await getStages();
    let stagesCompleted = 0;
    while (localStorage.getItem(stages[stagesCompleted]) && stagesCompleted < stages.length) {
        stagesCompleted++;
    }
    if (stagesCompleted == stages.length) {
        return;
    }

    let validatedTokens = [];
    try {
        while (stagesCompleted < stages.length) {
            let stageId = stages[stagesCompleted].uuid;
            let initToken = await initiateStage(stageId);

            await sleep(6000);

            let tokenData = decodeTokenData(initToken);
            let referrer;            
            if (tokenData.link.includes('loot-links')) {
                referrer = 'https://loot-links.com/';
            }
            else if (tokenData.link.includes('loot-link')) {
                referrer = 'https://loot-link.com/';
            }
            else {
                referrer = 'https://work.ink/';
            }

            let validatedToken = await validateStage(initToken, referrer);
            validatedTokens.push({ uuid: stageId, token: validatedToken });
            notification(`${stagesCompleted + 1}/${stages.length} stages completed`, 5000);

            await sleep(1500);

            stagesCompleted++;
        }
        if (authenticate(validatedTokens)) {
            notification('สำเร็จ');
            await sleep(3000);
            window.location.reload();
        }
    }
    catch (e) {
        handleError(e, 'codex');
    }
}

async function fluxus() {
    let userAgents = await (await fetch('https://cdn.jsdelivr.net/npm/top-user-agents/src/mobile.json')).json()
    userAgents = userAgents.filter(userAgent => userAgent.includes('Chrome'));
    let userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    let fluxusCustom = {
        start: function (link) {
            return new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: "GET",
                    url: link,
                    anonymous: true,
                    headers: {
                        "user-agent": userAgent,
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                        "accept-encoding": "gzip, deflate, br",
                        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
                        "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Google Chrome\";v=\"121\", \"Chromium\";v=\"121\"",
                        "sec-ch-ua-mobile": "?1",
                        "sec-ch-ua-platform": "\"Android\"",
                        "sec-fetch-dest": "document",
                        "sec-fetch-mode": "navigate",
                        "sec-fetch-site": "none",
                        "sec-fetch-user": "?1",
                        "upgrade-insecure-requests": "1"
                    },
                    onload: function (response) {
                        resolve(response);
                    },
                    onerror: function (error) {
                        reject(error);
                    }
                });
            });
        },
        linkvertiseSpoof: function (link, cookies) {
            return new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: "GET",
                    url: link,
                    anonymous: true,
                    headers: {
                        "user-agent": userAgent,
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                        "accept-encoding": "gzip, deflate, br",
                        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
                        "cookie": cookies,
                        "referer": "https://linkvertise.com/",
                        "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Google Chrome\";v=\"121\", \"Chromium\";v=\"121\"",
                        "sec-ch-ua-mobile": "?1",
                        "sec-ch-ua-platform": "\"Android\"",
                        "sec-fetch-dest": "document",
                        "sec-fetch-mode": "navigate",
                        "sec-fetch-site": "cross-site",
                        "sec-fetch-user": "?1",
                        "upgrade-insecure-requests": "1"
                    },
                    onload: function (response) {
                        resolve(response.responseText);
                    },
                    onerror: function (error) {
                        reject(error);
                    }
                });
            });
        },
        parseHeaders: function (headers) {
            var trim = function (string) {
                return string.replace(/^\s+|\s+$/g, '');
            }
                , isArray = function (arg) {
                    return Object.prototype.toString.call(arg) === '[object Array]';
                }


            if (!headers)
                return {}

            var result = {}

            var headersArr = trim(headers).split('\n')

            for (var i = 0; i < headersArr.length; i++) {
                var row = headersArr[i]
                var index = row.indexOf(':')
                    , key = trim(row.slice(0, index)).toLowerCase()
                    , value = trim(row.slice(index + 1))

                if (typeof (result[key]) === 'undefined') {
                    result[key] = value
                } else if (isArray(result[key])) {
                    result[key].push(value)
                } else {
                    result[key] = [result[key], value]
                }
            }

            return result

        },
    };
    try {
        document.getElementById('noUserscript').innerHTML = '<h1>enter your fluxus link to begin bypass:</h1>';
        let inputBox = document.getElementsByClassName('input-box')[0]
        inputBox.disabled = false;

        let fluxusLink = new URL(window.location.href).searchParams.get('link');
        let fluxusLinkRegex = /https:\/\/keysystem\.fluxteam\.net\/android\/checkpoint\/start\.php\?HWID=.+/;
        if (fluxusLink && fluxusLinkRegex.test(fluxusLink)) {
            inputBox.value = fluxusLink;
            inputBox.disabled = true;
            document.getElementById('noUserscript').innerHTML = '<h1>DO NOT directly enter your fluxus link! Always come to this page directly.</h1><h2>waiting 15 seconds to start bypass. . .<br>(to prevent this delay, come to this page directly instead of going to fluxus key link)</h2>';
            await sleep(16000);
        }

        fluxusLink = inputBox.value;
        while (true) {
            if (fluxusLinkRegex.test(fluxusLink)) {
                break;
            }
            await sleep(500);
            fluxusLink = inputBox.value;
        }
        document.getElementById('noUserscript').innerHTML = '<h1>bypass starting</h1>';
        inputBox.disabled = true;

        let startData = await fluxusCustom.start(fluxusLink);
        let cookies = fluxusCustom.parseHeaders(startData.responseHeaders)['set-cookie'];
        cookies = cookies.split(';').find(cookie => { return cookie.includes('PHPSESSID=') })

        await fluxusCustom.linkvertiseSpoof('https://fluxteam.net/android/checkpoint/check1.php', cookies);
        notification('1/2 stages completed', 2900);
        await sleep(3000);

        let response = await fluxusCustom.linkvertiseSpoof('https://fluxteam.net/android/checkpoint/main.php', cookies);
        notification('2/2 stages completed', 2900);
        await sleep(3000);

        let documentParser = new DOMParser();
        let newBodyData = documentParser.parseFromString(response, 'text/html');
        document.body.innerHTML = newBodyData.body.innerHTML;
        document.querySelector('a button:nth-child(2)').onclick = function () {
            navigator.clipboard.writeText(document.querySelector('code').innerHTML.trim());
        }
        notification('สำเร็จ');
    }
    catch (e) {
        document.getElementById('noUserscript').innerHTML = '<h1>you have been temp-banned from fluxus, get a vpn, then try again</h1>';
        handleError(new Error('you have been temp-banned from fluxus, get a vpn, then try again'), 'fluxus');
    }
}

async function arceus() {
    try {
        let hwid = (new URL(window.location.href)).searchParams.get('hwid');
        await fetch(`https://spdmteam.com/api/keysystem?hwid=${hwid}&zone=Europe/Rome&advertiser=linkvertise`, { mode: 'no-cors' });
        let checkpointsDone = 1;
        while (checkpointsDone <= 3) {
            await linkvertiseSpoof(`https://spdmteam.com/api/keysystem?step=${checkpointsDone}&advertiser=linkvertise`);
            notification(`${checkpointsDone}/3 stages completed`, 1900);
            await sleep(2000);
            checkpointsDone++;
        }
        notification('สำเร็จ');
        await sleep(3000);
        window.location.assign('https://spdmteam.com/key-system-getkey');
    }
    catch (e) {
        handleError(e, 'arceus');
    }
}

async function delta() {
    if (document.title == 'Just a moment...') { return; }
    let id = new URL(window.location.href).searchParams.get('id');
    let linkInfo = await (await fetch('https://api-gateway.platoboost.com/v1/authenticators/8/' + id)).json();
    if (linkInfo.key) {
        notification('สำเร็จ');
        return;
    }
    let token = new URL(window.location.href).searchParams.get('tk');
    if (!token) {
        let captchaRequired = linkInfo.captcha;
        let data = await fetch('https://api-gateway.platoboost.com/v1/sessions/auth/8/' + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "captcha": captchaRequired ? await getTurnstileResponse() : "",
                "type": captchaRequired ? "Turnstile" : ""
            })
        })
        data = await data.json();

        notification('1/1 stages completed');
        await sleep(2000);

        let followedUrl = data.redirect;
        let decryptedUrl = followedUrl;//await (await fetch(`https://bypass.rblx.workers.dev/delta-decrypt?url=${encodeURIComponent(followedUrl)}`)).text();

        let encodedDest = new URL(decryptedUrl).searchParams.get('r');
        let followedDest = atob(encodedDest);
        window.location.assign(followedDest);
    }
    else {
        await sleep(5000);
        await (await fetch(`https://api-gateway.platoboost.com/v1/sessions/auth/8/${id}/${token}`, {
            method: 'PUT',
        })).json().then(async res => {
            notification('สำเร็จ');
            await sleep(5000);
            window.location.assign(res.redirect);
        }).catch(e => {
            handleError(e, 'delta');
        })
    }
}

async function valyse() {
    if (document.title == 'Just a moment...') { return; }
    function completeCheckpoint(link) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: link,
                synchronous: true,
                headers: {
                    Referer: 'https://loot-links.com/',
                },
                onload: function (response) {
                    resolve();
                },
                onerror: function (error) {
                    reject(error);
                },
            });
        });
    }
    let deviceId = new URL(window.location.href).searchParams.get('device_id');

    await fetch('https://api.valyse.best/api/create-device?device_id=' + deviceId);

    await fetch('https://api.valyse.best/checkpoint/1?device_id=' + deviceId);
    await sleep(2000);
    await completeCheckpoint('https://valyse.best/verification?checkpoint=2');
    notification('1/2 stages completed', 2900);

    await sleep(1000);

    await fetch('https://api.valyse.best/checkpoint/2?device_id=' + deviceId);
    await sleep(2000);
    await completeCheckpoint('https://valyse.best/verification?completed=true');
    notification('2/2 stages completed', 2900);

    await sleep(3000);
    notification('สำเร็จ');

    await sleep(3000);
    window.location.assign('https://valyse.best/verification?completed=true');
}


async function keyrblx() {
    if (document.documentElement.innerHTML.includes('You successfully got key!')) {
        notification('สำเร็จ');
        return;
    }
    const customSleepTimes = {
        'project_nexus': 11000,
        'L-HUB': 11000,
        'butif': 11000,
        'KeySystemm': 11000,
        'NilHub': 11000,
        'RaitoHub': 16000,
        'BonezHub': 16000,
    };
    try {
        let hubName;
        let hwid;
        let currentUrl = new URL(window.location.href);
        try {
            hubName = currentUrl.pathname.split('/')[2];
            hwid = document.cookie.split('; ').filter(cookie => {
                return cookie.includes(hubName)
            })
            hwid = hwid[0].split('=')[1];
        }
        catch (e) {
            hwid = currentUrl.searchParams.get('hwid');
            if (!hwid) {
                throw new Error('HWID not found!');
            }
        }

        let adUrl = await fetch(`https://api.keyrblx.com/api/application/captcha?name=${hubName}&token=${await getGrecaptchaResponse()}&hwid=${hwid}`).then(res => res.json());
        let encodedDest = new URL(adUrl.redirect).searchParams.get('r');
        let dest;
        if (encodedDest) {
            dest = atob(encodedDest);
        }
        else {
            dest = `https://keyrblx.com/getkey/${hubName}`
            let checkpointInfo = document.getElementsByTagName('h2')[0].childNodes;
            if (checkpointInfo[6].data != '1') {
                dest += `?step=${checkpointInfo[2].data}`;
            }
        }

        let sleepTime = 6000;
        Object.keys(customSleepTimes).forEach(key => {
            if (hubName == key) {
                sleepTime = customSleepTimes[key];
            }
        });
        await sleep(sleepTime);

        await linkvertiseSpoof(dest);

        notification('stage completed');
        await sleep(3000);
        window.location.reload();
    }
    catch (e) {
        handleError(e, 'keyrblx');
    }
}

async function pandadevelopment() {
    let antiAdblockRemover = setInterval(removeAntiAdblock, 500);

    if (document.documentElement.innerHTML.includes('you got the key')) {
        notification('bypassed successfully');
        return;
    }
    else if (!document.getElementsByTagName('form').length) {
        let providers = Array.from(document.getElementsByTagName('a'));
        for (let provider of providers) {
            let providerName = provider.firstChild.innerHTML;
            if (providerName == 'Linkvertise' || providerName == 'Short Jambo') {
                window.location.assign(provider.href);
                return;
            }
        }
        throw new Error('no supported ad provider found');
    }
    function getAdLink() {
        let form = document.getElementsByTagName('form')[0];
        let data = new FormData(form);
        return new Promise(async (resolve, reject) => {
            GM.xmlHttpRequest({
                method: "POST",
                url: form.action,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': window.location.href,
                },
                data: new URLSearchParams(data),
                onload: function (response) {
                    resolve(response.finalUrl);
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
    }
    function getDestUrl(link) {
        let url = new URL(encodeURI(link));
        switch (url.hostname) {
            case 'linkvertise.com': {
                return atob(url.searchParams.get('r'));
            }
            case 'short-jambo.com': {
                return url.search.split('&url=')[1];
            }
            default: {
                throw new Error('unsupported ad provider');
            }
        }
    }
    function removeAntiAdblock() {
        try {
            let antiAdblock = document.getElementsByClassName('adblock_title')[0];
            while (antiAdblock.parentElement != document.body) {
                antiAdblock = antiAdblock.parentElement;
            }
            antiAdblock.remove();
            clearInterval(antiAdblockRemover);
        } catch (e) { }
    }
    const customSleepTimes = {
        'vegax': 11000,
        'laziumtools': 11000,
        'adelhub': 11000,
        'neoxkey': 16000,
    };
    try {
        let currentUrl = new URL(window.location.href);
        let hwid = currentUrl.searchParams.get('hwid');
        let service = currentUrl.searchParams.get('service');
        let token = currentUrl.searchParams.get('sessiontoken');
        let provider = currentUrl.searchParams.get('provider');

        if (document.getElementById('cf-turnstile')) {
            await getTurnstileResponse();
        }

        let adUrl = await getAdLink(hwid, service, token);
        let dest = getDestUrl(adUrl);

        let sleepTime = 3000;
        Object.keys(customSleepTimes).forEach(key => {
            if (service == key) {
                sleepTime = customSleepTimes[key];
            }
        });
        await sleep(sleepTime);

        await linkvertiseSpoof(dest);
        notification('stage completed');

        await sleep(3000);

        let newUrl = new URL(dest);
        token = newUrl.searchParams.get('sessiontoken');
        let nextCheckpoint = `https://pandadevelopment.net/getkey?hwid=${hwid}&service=${service}&sessiontoken=${token}`;
        if (provider) {
            nextCheckpoint += `&provider=${provider}`;
        }
        window.location.assign(nextCheckpoint);
    }
    catch (e) {
        handleError(e, 'pandadevelopment');
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
            notification('ได้');
            return;
        }
        document.getElementById('subscribeModal')?.remove();
        let tokenRegex = /nextCheckpoint\('.+'\)/g;
        let lootlinkToken = document.body.innerHTML.match(tokenRegex)[1].split("'")[1].split("'")[0];
        await fetch(`https://hohohubv-ac90f67762c4.herokuapp.com/api/captcha/${await getTurnstileResponse()}/${lootlinkToken}`, { method: 'POST' });
        await fetch(`https://hohohubv-ac90f67762c4.herokuapp.com/api/start?token=${lootlinkToken}`, { redirect: 'manual' });
        let currentStage = document.getElementsByTagName('p')[0].innerHTML.split('checkpoint ')[1].split(' ')[0];
        await spoofAdView(`https://hohohubv-ac90f67762c4.herokuapp.com/api/step?step=${parseInt(currentStage) + 1}`);
        window.location.reload();
    }
    catch (e) {
        handleError(e, 'hohohub');
    }
}

async function tsuohub() {
    let url = new URL(window.location.href);
    if (url.pathname == '/complete') {
        notification('bypassed successfully');
        return;
    }
    else if (!(['/getkey', '/step'].includes(url.pathname))) {
        return;
    }
    function getDestUrl() {
        return new Promise(async (resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: `${url.origin + url.pathname + url.search}${url.search ? '&' : '?'}g-recaptcha-response=${await getGrecaptchaResponse()}`,
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
        notification('1/2 stages completed');
        await sleep(3000);
        window.location.assign(dest.href);
    }
    else {
        await spoofAdView();
        notification('2/2 stages completed');
        await sleep(3000);
        window.location.assign('https://tsuo-script.xyz/complete')
    }
}

module.exports = {
    codex,
    fluxus,
    arceus,
    delta,
    valyse,
    keyrblx,
    pandadevelopment,
    hohohub,
    tsuohub,
}

/***/ }),

/***/ 223:
/***/ ((module) => {

function handleError(error) {
    let errorText = error.message ? error.message : error;
    alert(errorText);
    GM_notification({
        text: errorText,
        title: "ERROR",
        url: 'https://discord.gg/92p6X2drxn',
        silent: true,
    });
    GM.openInTab('https://discord.gg/92p6X2drxn');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function linkvertiseSpoof(link) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: "GET",
            url: link,
            headers: {
                Referer: 'https://linkvertise.com/',
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

async function getTurnstileResponse() {
    let notif = setInterval(notification, 6000, 'please solve the captcha', 5000)
    let res = '';
    while (true) {
        try {
            res = turnstile.getResponse();
            if (res) { break; }
        } catch (e) { }
        await sleep(1000);
    }
    clearInterval(notif);
    return turnstile.getResponse();
}

async function getGrecaptchaResponse() {
    let notif = setInterval(notification, 6000, 'please solve the captcha', 5000)
    let res = '';
    while (true) {
        try {
            res = grecaptcha.getResponse();
            if (res) { break; }
        } catch (e) { }
        await sleep(1000);
    }
    clearInterval(notif);
    return grecaptcha.getResponse();
}

function notification(message, timeout) {
    let config = {
        text: message,
        title: "INFO",
        silent: true,
    }
    if (timeout) { config.timeout = timeout; }
    GM_notification(config);
}

module.exports = {
    handleError,
    sleep,
    linkvertiseSpoof,
    getTurnstileResponse,
    getGrecaptchaResponse,
    notification,
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const { codex, arceus, delta, valyse, keyrblx, pandadevelopment, hohohub, tsuohub, fluxus } = __webpack_require__(24);

const { sleep, notification } = __webpack_require__(223);

const { injectAds } = __webpack_require__(636);

start();

async function start() {

    injectAds();

    GM_notification({
        text: `FREE VERSION\nbypass starting in 10 seconds...\n(don't want to wait? join discord server to get faster bypass with no ads.)`,
        title: "INFO",
        url: 'https://discord.gg/92p6X2drxn',
        silent: true,
        timeout: 8000
    });

    await sleep(10000);

    GM_notification({
        text: `FREE VERSION\nbypass started...`,
        title: "INFO",
        silent: true,
        timeout: 2000
    });

    switch (window.location.hostname) {
        case 'mobile.codex.lol': {
            await codex();
            break;
        }
        case 'keysystem.fluxteam.net': {
            window.location.assign('https://fluxusbypass.pages.dev/?link=' + encodeURIComponent(window.location.href));
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
        case 'pandadevelopment.net': {
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
        case 'fluxusbypass.pages.dev': {
            await fluxus();
            break;
        }
        default: {
            notification('unsupported keysystem');
            break;
        }
    }
}
})();

/******/ })()
;
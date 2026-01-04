// ==UserScript==
// @name         IQooz Bypasser
// @homepageURL  https://discord.com/users/987184688324030474
// @description  All In One Bypass
// @author       IQooz
 
// @match        https://mobile.codex.lol/*
// @match        https://iqoozdev.tech/*
// @match        https://keysystem.fluxteam.net/android/checkpoint/start.php?HWID=*
// @match        https://spdmteam.com/key-system-1?hwid=*
// @match        https://gateway.platoboost.com/a/8?id=*
// @match        https://valyse.best/verification?device_id=*
// @match        https://keyrblx.com/getkey/*
// @match        https://pandadevelopment.net/getkey?*
// @match        https://hohohubv-ac90f67762c4.herokuapp.com/api/getkeyv2?hwid=*
// @match        https://tsuo-script.xyz/*
// @match        *
 
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
 
// @version      1.0.7
// @run-at       document-start
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @grant        GM_openInTab
 
// @require      https://update.greasyfork.org/scripts/484331/1308737/customnotifications.js
// @resource     notifCss https://cdn.jsdelivr.net/gh/f3oall/awesome-notifications/dist/style.css
 
// @license      MIT
// @supportURL   https://discord.com/users/987184688324030474
// @icon         https://files.catbox.moe/zr11gj.jpg
// @namespace    https://greasyfork.org/en/users/1257398-iqooz
// @downloadURL https://update.greasyfork.org/scripts/486647/IQooz%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/486647/IQooz%20Bypasser.meta.js
// ==/UserScript==
 
const notifier = new AWN({ icons: { enabled: false } });
 
const util = {
    handleError: function (error, keySystem) {
        console.error(error);
        navigator.clipboard.writeText(`[${keySystem}] ${error.message}`);
        notifier.alert(error.message + '<br><br>bypass failed.<br>please <a href="https://discord.com/users/987184688324030474">click here to contact me</a> Thank You', { durations: { alert: 0 } });
        window.open('https://discord.com/users/987184688324030474', '_blank');
    },
    sleep: function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    linkvertiseSpoof: function (link) {
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
    },
    getTurnstileResponse: async function () {
        let res = '';
        while (true) {
            try {
                res = turnstile.getResponse();
                if (res) { break; }
                notifier.warning('please solve the captcha', { durations: { warning: 2000 } });
            } catch (e) { }
            await util.sleep(2500);
        }
        return turnstile.getResponse();
    },
    getGrecaptchaResponse: async function () {
        let res = '';
        while (true) {
            try {
                res = grecaptcha.getResponse();
                if (res) { break; }
                notifier.warning('please solve the captcha', { durations: { warning: 2000 } });
            } catch (e) { }
            await util.sleep(2500);
        }
        return grecaptcha.getResponse();
    },
    getHcaptchaResponse: async function () {
        let res = '';
        while (true) {
            try {
                res = hcaptcha.getResponse();
                if (res) { break; }
                notifier.warning('please solve the captcha', { durations: { warning: 2000 } });
            } catch (e) { }
            await util.sleep(2500);
        }
        return hcaptcha.getResponse();
    },
    antiAntiTampermonkey: function () {
        let windowOpen = unsafeWindow.open;
        unsafeWindow.open = function (link, ...args) {
            if (link && link.endsWith('.user.js')) {
                throw new Error('You Got Error');
            }
            windowOpen(link, ...args);
        }
    }
};
 
util.antiAntiTampermonkey();
 
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
            throw new Error("failed to get stages");
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
            throw new Error("failed to initiate stage");
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
            throw new Error("failed to validate stage");
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
            throw new Error("failed to authenticate");
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
                referrer = 'https://linkvertise.com/';
            }
            
            let validatedToken = await validateStage(initToken, referrer);
            validatedTokens.push({ uuid: stageId, token: validatedToken });
            notifier.info(`${stagesCompleted + 1}/${stages.length} stages completed`, 3000);
            
            await sleep(1500);

            stagesCompleted++;
        }
        if (authenticate(validatedTokens)) {
            notifier.success('bypassed successfully');
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
        document.getElementById('noUserscript').innerHTML = '<h1>Bypass Now:</h1>';
        let inputBox = document.getElementsByClassName('input-box')[0]
        inputBox.disabled = false;
 
        let fluxusLink = new URL(window.location.href).searchParams.get('link');
        let fluxusLinkRegex = /https:\/\/keysystem\.fluxteam\.net\/android\/checkpoint\/start\.php\?HWID=.+/;
        if (fluxusLink && fluxusLinkRegex.test(fluxusLink)) {
            inputBox.value = fluxusLink;
            inputBox.disabled = true;
            document.getElementById('noUserscript').innerHTML = '<h1>Always Use This Page For Fluxus Link</h1><h2>Bypassing. . .<br>(Come To This Page For No Delay)</h2>';
            await util.sleep(16000);
        }
 
        fluxusLink = inputBox.value;
        while (true) {
            if (fluxusLinkRegex.test(fluxusLink)) {
                break;
            }
            await util.sleep(500);
            fluxusLink = inputBox.value;
        }
        document.getElementById('noUserscript').innerHTML = '<h1>Successfully Bypassed</h1>';
        inputBox.disabled = true;
 
        let startData = await fluxusCustom.start(fluxusLink);
        let cookies = fluxusCustom.parseHeaders(startData.responseHeaders)['set-cookie'];
        cookies = cookies.split(';').find(cookie => { return cookie.includes('PHPSESSID=') })
 
        await fluxusCustom.linkvertiseSpoof('https://fluxteam.net/android/checkpoint/check1.php', cookies);
        notifier.info('1/2 stages completed');
        await util.sleep(3000);
 
        let response = await fluxusCustom.linkvertiseSpoof('https://fluxteam.net/android/checkpoint/main.php', cookies);
        notifier.info('2/2 stages completed');
        await util.sleep(3000);
 
        let documentParser = new DOMParser();
        let newBodyData = documentParser.parseFromString(response, 'text/html');
        document.body.innerHTML = newBodyData.body.innerHTML;
        document.querySelector('a button:nth-child(2)').onclick = function () {
            navigator.clipboard.writeText(document.querySelector('code').innerHTML.trim());
        }
        notifier.success('bypassed successfully', { durations: { success: 0 } });
    }
    catch (e) {
        document.getElementById('noUserscript').innerHTML = '<h1>you have been temp-banned from fluxus</h1>';
        util.handleError(new Error('you have been temp-banned from fluxus'), 'fluxus');
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
            notifier.info(`${checkpointsDone}/3 stages completed`);
            await util.sleep(2000);
        }
        notifier.success('bypassed successfully', { durations: { success: 0 } });
        await util.sleep(5000);
        window.location.assign('https://spdmteam.com/key-system-getkey');
    }
    catch (e) {
        util.handleError(e, 'arceus');
    }
}
 
async function delta() {
    if (document.title == 'Just a moment...') { return; }
    let id = new URL(window.location.href).searchParams.get('id');
    let linkInfo = await (await fetch('https://api-gateway.platoboost.com/v1/authenticators/8/' + id)).json();
    if (linkInfo.key) {
        notifier.success('bypassed successfully');
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

        notifier.info('1/1 stages completed');
        await sleep(2000);

        let followedUrl = data.redirect;
        let decryptedUrl = await (await fetch(`https://bypass.rblx.workers.dev/delta-decrypt?url=${encodeURIComponent(followedUrl)}`)).text();

        let encodedDest = new URL(decryptedUrl).searchParams.get('r');
        let followedDest = atob(encodedDest);
        window.location.assign(followedDest);
    }
    else {
        await sleep(5000);
        await (await fetch(`https://api-gateway.platoboost.com/v1/sessions/auth/8/${id}/${token}`, {
            method: 'PUT',
        })).json().then(async res => {
            notifier.success('bypassed successfully');
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
    await util.sleep(2000);
    await completeCheckpoint('https://valyse.best/verification?checkpoint=2');
    notifier.info('1/2 stages completed');
 
    await util.sleep(1000);
 
    await fetch('https://api.valyse.best/checkpoint/2?device_id=' + deviceId);
    await util.sleep(2000);
    await completeCheckpoint('https://valyse.best/verification?completed=true');
    notifier.info('2/2 stages completed');
 
    await util.sleep(3000);
    notifier.success('bypassed successfully', { durations: { success: 0 } });
    await util.sleep(5000);
    window.location.assign('https://valyse.best/verification?completed=true');
}
 
 
async function keyrblx() {
    if (document.documentElement.innerHTML.includes('You successfully got key!')) {
        notifier.success('bypassed successfully');
        return;
    }
    const customSleepTimes = {
        'project_nexus': 3000,
        'L-HUB': 3000,
        'butif': 3000,
        'KeySystemm': 3000,
        'NilHub': 3000,
        'RaitoHub': 3000,
        'BonezHub': 3000,
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

        notifier.info('stage completed');
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
        notifier.success('bypassed successfully');
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
        'vegax': 3000,
        'laziumtools': 3000,
        'adelhub': 3000,
        'neoxkey': 5000,
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
        notifier.info('stage completed');

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
            notifier.success('bypassed successfully', { durations: { success: 0 } });
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
        return;
    }
    else if (!(['/getkey', '/step'].includes(url.pathname))) {
        return;
    }
    function getDestUrl() {
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
        notifier.info('1/2 stage completed');
        await util.sleep(3000);
        window.location.assign(dest.href);
    }
    else {
        await spoofAdView();
        notifier.info('2/2 stage completed');
        await util.sleep(3000);
        window.location.assign('https://tsuo-script.xyz/complete')
    }
}
 
window.onload = async function () {
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
            window.location.assign('https://iqoozdev.tech/?link=' + encodeURIComponent(window.location.href));
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
        case 'iqoozdev.tech': {
            await fluxus();
            break;
        }
        default: {
            notifier.alert('unsupported key system', { durations: { alert: 0 } });
            break;
        }
    }
}
// ==UserScript==
// @name         fault bypass
// @homepageURL  https://discord.gg/shhh
// @description  ngl i reuploaded dis cuz i didnt trust that guy who made it but creds to him ig
// @author       fault
// @match        https://mobile.codex.lol/*
// @match        https://keysystem.fluxteam.net/android/checkpoint/start.php?HWID=*
// @match        https://spdmteam.com/key-system-1?hwid=*
// @match        https://gateway.platoboost.com/a/8?id=*
// @match        https://valyse.best/verification?device_id=*
// @match        https://keyrblx.com/getkey/*
// @match        https://auth.pandadevelopment.net/getkey?*
// @match        https://tsuo-script.xyz/getkey*
// @match        https://tsuo-script.xyz/step
// @run-at       document-end
// @version      1.20
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://update.greasyfork.org/scripts/484331/1308737/customnotifications.js
// @resource     notifCss https://cdn.jsdelivr.net/gh/f3oall/awesome-notifications/dist/style.css
// @license      MIT
// @supportURL   https://discord.gg/shhh
// @namespace    https://discord.gg/shhh
// @downloadURL https://update.greasyfork.org/scripts/485588/fault%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/485588/fault%20bypass.meta.js
// ==/UserScript==
 
const notifier = new AWN({ icons: { enabled: false } });
 
const util = {
    handleError: function (error, keySystem) {
        console.error(error);
        navigator.clipboard.writeText(`[${keySystem}] ${error.message}`);
        notifier.alert(error.message + '<br><br>bypass failed.<br>please <a href="https://discord.gg/shhh">click here to join the discord server</a> to report this issue.', { durations: { alert: 0 } });
        window.open('https://discord.gg/shhh', '_blank');
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
        while (typeof turnstile == 'undefined') {
            await util.sleep(1000);
        }
        while (!turnstile?.getResponse()) {
            notifier.warning('please solve the captcha', { durations: { warning: 3000 } });
            await util.sleep(3500);
        }
        return turnstile.getResponse();
    },
    getGrecaptchaResponse: async function () {
        while (typeof grecaptcha == 'undefined') {
            await util.sleep(1000);
        }
        while (!grecaptcha?.getResponse()) {
            notifier.warning('please solve the captcha', { durations: { warning: 3000 } });
            await util.sleep(3500);
        }
        return grecaptcha.getResponse();
    },
    getHcaptchaResponse: async function () {
        while (typeof hcaptcha == 'undefined') {
            await util.sleep(1000);
        }
        while (!hcaptcha?.getResponse()) {
            notifier.warning('please solve the captcha', { durations: { warning: 3000 } });
            await util.sleep(3500);
        }
        return hcaptcha.getResponse();
    }
};
 
 
async function codex() {
    let session = localStorage.getItem("android-session");
    if (!session) {
        return;
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
        let decoded = atob(token.split(".")[1]);
        return JSON.parse(decoded);
    }
 
    let stages = await getStages();
    console.log(stages);
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
 
            await util.sleep(16000);
 
            let tokenData = decodeTokenData(initToken);
            let referrer = tokenData.link.includes('workink') ? 'https://work.ink/' : 'https://linkvertise.com/';
            let validatedToken = await validateStage(initToken, referrer);
            validatedTokens.push({ uuid: stageId, token: validatedToken });
            notifier.info(`${stagesCompleted + 1}/${stages.length} stages completed`);
            await util.sleep(3000);
 
            stagesCompleted++;
        }
        if (authenticate(validatedTokens)) {
            notifier.success('bypassed successfully', { durations: { success: 0 } });
            await util.sleep(5000);
            window.location.reload();
        }
    }
    catch (e) {
        util.handleError(e, 'codex');
    }
}
 
async function fluxus() {
    window.stop();
    try {
        let response = await util.linkvertiseSpoof('https://fluxteam.net/android/checkpoint/check1.php');
        if (response?.includes('bypass')) {
            throw new Error('bypass detected');
        }
        notifier.info('1/2 stages completed');
        await util.sleep(5000);
 
        response = await util.linkvertiseSpoof('https://fluxteam.net/android/checkpoint/main.php');
        if (response?.includes('bypass')) {
            throw new Error('bypass detected');
        }
        notifier.info('2/2 stages completed');
        await util.sleep(5000);
 
        let documentParser = new DOMParser();
        let newBodyData = documentParser.parseFromString(response, 'text/html');
        document.body.innerHTML = newBodyData.body.innerHTML;
        document.querySelector('a button:nth-child(2)').onclick = function () {
            navigator.clipboard.writeText(document.querySelector('code').innerHTML.trim());
        }
        notifier.success('bypassed successfully', { durations: { success: 0 } });
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
    let id = new URL(window.location.href).searchParams.get('id');
    let linkInfo = await (await fetch('https://api-gateway.platoboost.com/v1/authenticators/8/' + id)).json();
    if (linkInfo.key) {
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
                "captcha": captchaRequired ? await util.getTurnstileResponse() : "",
                "type": captchaRequired ? "Turnstile" : ""
            })
        })
        data = await data.json();
 
        notifier.info('1/1 stages completed');
 
        let followedUrl = data.redirect;
        let encodedDest = new URL(followedUrl).searchParams.get('r');
        let followedDest = atob(encodedDest);
        window.location.assign(followedDest);
    }
    else {
        await util.sleep(5000);
        await (await fetch(`https://api-gateway.platoboost.com/v1/sessions/auth/8/${id}/${token}`, {
            method: 'PUT',
        })).json().then(async res => {
            notifier.success('bypassed successfully', { durations: { success: 0 } });
            await util.sleep(5000);
            window.location.assign(res.redirect);
        }).catch(e => {
            util.handleError(e, 'delta');
        })
    }
}
 
async function valyse() {
    if (document.title=='Just a moment...') { return; }
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
        notifier.success('bypassed successfully', { durations: { success: 0 } });
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
 
        let adUrl = await fetch(`https://api.keyrblx.com/api/application/captcha?name=${hubName}&token=${await util.getGrecaptchaResponse()}&hwid=${hwid}`).then(res => res.json());
        let encodedDest = new URL(adUrl['redirect_to']).searchParams.get('r');
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
        await util.sleep(sleepTime);
 
        await util.linkvertiseSpoof(dest);
 
        notifier.info('stage completed');
        await util.sleep(3000);
        window.location.reload();
    }
    catch (e) {
        util.handleError(e, 'keyrblx');
    }
}
 
async function pandadevelopment() {
    if (document.documentElement.innerHTML.includes('you got the key')) {
        notifier.success('bypassed successfully', { durations: { success: 0 } });
        return;
    }
    else if (document.documentElement.innerHTML.includes('Server Error')) {
        return;
    }
    else if (document.documentElement.innerHTML.includes('session invalidated')) {
        window.location.reload();
        return;
    }
    else if (document.documentElement.innerHTML.includes('Select Checkpoint')) {
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
    function getAdLink(hwid, service, token) {
        return new Promise(async (resolve, reject) => {
            GM.xmlHttpRequest({
                method: "POST",
                url: 'https://auth.pandadevelopment.net/getkey/proceed',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': window.location.href,
                },
                data: `hwid=${hwid}&service=${service}&token=${token}&provider=linkvertise&cf-turnstile-response=${await util.getTurnstileResponse()}`,
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
    const customSleepTimes = {
        'vegax': 11000,
        'laziumtools': 11000,
    };
    try {
        let currentUrl = new URL(window.location.href);
        let hwid = currentUrl.searchParams.get('hwid');
        let service = currentUrl.searchParams.get('service');
        let token = currentUrl.searchParams.get('sessiontoken');
        let provider = currentUrl.searchParams.get('provider');
 
        let adUrl = await getAdLink(hwid, service, token);
        let dest = getDestUrl(adUrl);
 
        let sleepTime = 3000;
        Object.keys(customSleepTimes).forEach(key => {
            if (service == key) {
                sleepTime = customSleepTimes[key];
            }
        });
        await util.sleep(sleepTime);
 
        await util.linkvertiseSpoof(dest);
        notifier.info('stage completed');
 
        await util.sleep(3000);
 
        let newUrl = new URL(dest);
        token = newUrl.searchParams.get('sessiontoken');
        let nextCheckpoint = `https://auth.pandadevelopment.net/getkey?hwid=${hwid}&service=${service}&sessiontoken=${token}`;
        if (provider) {
            nextCheckpoint += `&provider=${provider}`;
        }
        window.location.assign(nextCheckpoint);
    }
    catch (e) {
        util.handleError(e, 'pandadevelopment');
    }
}
 
async function tsuohub() {
    function getDestUrl() {
        return new Promise(async (resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: window.location.href + '?g-recaptcha-response=' + await util.getGrecaptchaResponse(),
                onload: function (response) {
                    resolve(response.finalUrl);
                },
                onerror: function (error) {
                    reject(error);
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
// ==UserScript==
// @name         [Working] Bypass mọi exploit
// @homepageURL  https://discord.gg/42f2YUFJYG
// @description  Bypass Roblox Exploits Key Systems (Codex, Fluxus, Arceus, Delta, Valyse, Keyrblx, Pandadevelopment, HoHo Hub, Tsuohub)
// @author       Seraphim

// @match       https://mobile.codex.lol/*
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

// @version      1.0
// @run-at       document-end
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest

// @require      https://update.greasyfork.org/scripts/484331/1308737/customnotifications.js
// @resource     notifCss https://cdn.jsdelivr.net/gh/f3oall/awesome-notifications/dist/style.css

// @license      MIT
// @supportURL   https://discord.gg/42f2YUFJYG
// @icon         https://files.catbox.moe/zt752s.jpg
// @namespace    https://greasyfork.org/users/1255676
// @downloadURL https://update.greasyfork.org/scripts/486150/%5BWorking%5D%20Bypass%20m%E1%BB%8Di%20exploit.user.js
// @updateURL https://update.greasyfork.org/scripts/486150/%5BWorking%5D%20Bypass%20m%E1%BB%8Di%20exploit.meta.js
// ==/UserScript==

const notifier = new AWN({ icons: { enabled: false } });

const util = {
    handleError: function (error, keySystem) {
        console.error(error);
        navigator.clipboard.writeText(`[${keySystem}] ${error.message}`);
        notifier.alert(error.message + '<br><br>Bypass thất bại.<br><a href="https://discord.gg/42f2YUFJYG">Click đây</a> để tham gia server discord để báo cáo vấn đề về script.', { durations: { alert: 0 } });
        window.open('https://discord.gg/42f2YUFJYG', '_blank');
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
        while (typeof turnstile == 'undefined' || !turnstile?.getResponse) {
            await util.sleep(1000);
        }
        let res = '';
        while (!res) {

            try {
                res = turnstile.getResponse();
                notifier.warning('Hãy giải captcha trước', { durations: { warning: 1000 } });
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
                notifier.warning('Hãy giải captcha trước', { durations: { warning: 1000 } });
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
                notifier.warning('Hãy giải captcha trước', { durations: { warning: 1000 } });
            } catch (e) { }
            await util.sleep(2500);
        }
        return hcaptcha.getResponse();
    }
};


async function codex() {
    let session = localStorage.getItem("android-session");
    if (!session) {
        return;
    }
    if (document?.getElementsByTagName('a')?.length && document.getElementsByTagName('a')[0].innerHTML.includes('Đang bắt đầu')) {
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
            throw new Error("Bypass thất bại, vui lòng thử lại");
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
            throw new Error("Không thể bắt đầu bypass, vui lòng thử lại");
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
            throw new Error("Không thể xác nhận đoạn này");
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
            throw new Error("Không thể xác thực, vui lòng thử lại");
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
            notifier.success('Bypass thành công', { durations: { success: 0 } });
            await util.sleep(5000);
            window.location.reload();
        }
    }
    catch (e) {
        util.handleError(e, 'codex');
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
        document.getElementById('noUserscript').innerHTML = '<h1>Chèn link fluxus vào để bypass:</h1>';
        let inputBox = document.getElementsByClassName('input-box')[0]
        inputBox.disabled = false;

        let fluxusLink = new URL(window.location.href).searchParams.get('link');
        let fluxusLinkRegex = /https:\/\/keysystem\.fluxteam\.net\/android\/checkpoint\/start\.php\?HWID=.+/;
        if (fluxusLink && fluxusLinkRegex.test(fluxusLink)) {
            inputBox.value = fluxusLink;
            inputBox.disabled = true;
            await util.sleep(16000);
        }

        fluxusLink = inputBox.value;
        while (true) {
            console.log(fluxusLink);
            if (fluxusLinkRegex.test(fluxusLink)) {
                break;
            }
            await util.sleep(500);
            fluxusLink = inputBox.value;
        }
        document.getElementById('noUserscript').innerHTML = '<h1>Bắt đầu bypass</h1>';
        inputBox.disabled = true;

        let startData = await fluxusCustom.start(fluxusLink);
        let cookies = fluxusCustom.parseHeaders(startData.responseHeaders)['set-cookie'];
        cookies = cookies.split(';').find(cookie => { return cookie.includes('PHPSESSID=') })

        await fluxusCustom.linkvertiseSpoof('https://fluxteam.net/android/checkpoint/check1.php', cookies);
        notifier.info('Hoàn thành đoạn 1/2');
        await util.sleep(3000);

        let response = await fluxusCustom.linkvertiseSpoof('https://fluxteam.net/android/checkpoint/main.php', cookies);
        notifier.info('Hoàn thành đoạn 2/2');
        await util.sleep(3000);

        let documentParser = new DOMParser();
        let newBodyData = documentParser.parseFromString(response, 'text/html');
        document.body.innerHTML = newBodyData.body.innerHTML;
        document.querySelector('a button:nth-child(2)').onclick = function () {
            navigator.clipboard.writeText(document.querySelector('code').innerHTML.trim());
        }
        notifier.success('Bypass thành công', { durations: { success: 0 } });
    }
    catch (e) {
        util.handleError(new Error('Bạn đã bị ban tạm thời bởi fluxus, hãy dùng vpn và thử lại sau'), 'fluxus');
    }
}

async function arceus() {
    if (document.title == 'Đợi một chút...') { return; }
    try {
        let url = new URL(window.location.href);
        let hwid = url.searchParams.get('hwid');
        await fetch(`https://spdmteam.com/api/keysystem?hwid=${hwid}&zone=Europe/Rome&advertiser=linkvertise`, { mode: "no-cors" })
        for (let checkpointsDone = 1; checkpointsDone <= 3; checkpointsDone++) {
            await util.linkvertiseSpoof(`https://spdmteam.com/api/keysystem?step=${checkpointsDone}&advertiser=linkvertise`);
            notifier.info(`Hoàn thành đoạn ${checkpointsDone}/3`);
            await util.sleep(2000);
        }
        notifier.success('Bypass thành công', { durations: { success: 0 } });
        await util.sleep(5000);
        window.location.assign('https://spdmteam.com/key-system-getkey');
    }
    catch (e) {
        util.handleError(e, 'arceus');
    }
}

async function delta() {
    if (document.title == 'Đợi một chút...') { return; }
    let id = new URL(window.location.href).searchParams.get('id');
    let linkInfo = await (await fetch('https://api-gateway.platoboost.com/v1/authenticators/8/' + id)).json();
    if (linkInfo.key) {
        notifier.success('Bypass thành công', { durations: { success: 0 } });
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

        notifier.info('Hoàn thành đoạn 1/1');
        await util.sleep(2000);

        let followedUrl = data.redirect;
        let decryptedUrl = followedUrl;//await (await fetch(`https://bypass.rblx.workers.dev/delta-decrypt?url=${encodeURIComponent(followedUrl)}`)).text();

        let encodedDest = new URL(decryptedUrl).searchParams.get('r');
        let followedDest = atob(encodedDest);
        window.location.assign(followedDest);
    }
    else {
        await util.sleep(5000);
        await (await fetch(`https://api-gateway.platoboost.com/v1/sessions/auth/8/${id}/${token}`, {
            method: 'PUT',
        })).json().then(async res => {
            notifier.success('Bypass hoàn thành', { durations: { success: 0 } });
            await util.sleep(5000);
            window.location.assign(res.redirect);
        }).catch(e => {
            util.handleError(e, 'delta');
        })
    }
}

async function valyse() {
    if (document.title == 'Đợi một chút...') { return; }
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
    notifier.info('Hoàn thành đoạn 1/2');

    await util.sleep(1000);

    await fetch('https://api.valyse.best/checkpoint/2?device_id=' + deviceId);
    await util.sleep(2000);
    await completeCheckpoint('https://valyse.best/verification?completed=true');
    notifier.info('Hoàn thành đoạn 2/2');

    await util.sleep(3000);
    notifier.success('Bypass hoàn thành', { durations: { success: 0 } });
    await util.sleep(5000);
    window.location.assign('https://valyse.best/verification?completed=true');
}


async function keyrblx() {
    if (document.documentElement.innerHTML.includes('Bạn đã có được key!')) {
        notifier.success('Bypass hoàn thành', { durations: { success: 0 } });
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
                throw new Error('Không tìm thấy HWID!');
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

        notifier.info('Bypass hoàn thành');
        await util.sleep(3000);
        window.location.reload();
    }
    catch (e) {
        util.handleError(e, 'keyrblx');
    }
}

async function pandadevelopment() {
    let antiAdblockRemover = setInterval(removeAntiAdblock, 500);

    if (document.documentElement.innerHTML.includes('Bạn đã có được key')) {
        notifier.success('Bypass thành công', { durations: { success: 0 } });
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
        throw new Error('Tìm thấy nhà cung cấp quảng cáo không được hỗ trợ');
    }
    function getAdLink(hwid, service, token) {
        return new Promise(async (resolve, reject) => {
            GM.xmlHttpRequest({
                method: "POST",
                url: 'https://pandadevelopment.net/getkey/proceed',
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
                throw new Error('Nhà cung cấp quảng cáo không được hỗ trợ');
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
        notifier.info('Bypass thành công');

        await util.sleep(3000);

        let newUrl = new URL(dest);
        token = newUrl.searchParams.get('sessiontoken');
        let nextCheckpoint = `https://pandadevelopment.net/getkey?hwid=${hwid}&service=${service}&sessiontoken=${token}`;
        if (provider) {
            nextCheckpoint += `&provider=${provider}`;
        }
        window.location.assign(nextCheckpoint);
    }
    catch (e) {
        util.handleError(e, 'pandadevelopment');
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
        if (document.body.innerHTML.includes('Cấp Whitelist thành công!')) {
            notifier.success('Bypass thành công', { durations: { success: 0 } });
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
        notifier.success('Bypass thành công', { durations: { success: 0 } });
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
        notifier.info('Hoàn thành đoạn 1/2');
        await util.sleep(3000);
        window.location.assign(dest.href);
    }
    else {
        await spoofAdView();
        notifier.info('Hoàn thành đoạn 2/2');
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
            notifier.alert('Key system này không được hỗ trợ', { durations: { alert: 0 } });
            break;
        }
    }
})();
// ==UserScript==
// @name         onjai v2
// @namespace    http://tampermonkey.net/
// @version      0.0.7
// @description  AARR!!!!
// @author       kyoooooooooota
// @match        https://hayabusa.open2ch.net/livejupiter/
// @match        https://hayabusa.open2ch.net/test/read.cgi/livejupiter/*/l10
// @match        https://hayabusa.open2ch.net/test/read.cgi/livejupiter/*/l50
// @icon         https://www.google.com/s2/favicons?sz=64&domain=open2ch.net
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.openInTab
// @grant        GM.notification
// @grant        GM.registerMenuCommand
// @grant        GM.xmlHttpRequest
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544734/onjai%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/544734/onjai%20v2.meta.js
// ==/UserScript==

(async () => {
    'use strict';
    class Store {
        #key;
        constructor(name, userConfig) {
            this.#key = name;
            if (userConfig) {
                GM.registerMenuCommand(name, async () => {
                    const val = prompt(`${name}の上書き：${await this.load()}`);
                    if (val) this.save(val);
                });
            }
        }
        async load() {
            return GM.getValue(this.#key);
        }
        async save(val) {
            const nextVal = typeof aa === "string" ? val.trim() : val;
            await GM.setValue(this.#key, nextVal);
            return nextVal;
        }
        async increment() {
            const val = await this.load() ?? 0;
            return this.save(val + 1);
        }
    }
    const myIdStore = new Store('おんJのID', true);
    const vpnIpStore = new Store('VPNのIP', true);
    const groqApiKeyStore = new Store('Groq APIのkey', true);
    const onjaiStateStore = new Store('ONJAIのステータス');
    const groqTryCountStore = new Store('Groq 試行回数');
    const groqErrorCountStore = new Store('Groq エラー回数');
    GM.registerMenuCommand('エラー率リセット', () => {
        if (!confirm('エラー率リセット？')) return;
        groqTryCountStore.save(0);
        groqErrorCountStore.save(0);
    });
    const resLog = new Store('レスログ');
    GM.registerMenuCommand('レスログ', async () => {
        console.log(await resLog.load())
    });
    const saveLog = async (obj) => {
        let log = await resLog.load();
        if (!Array.isArray(log)) log = [];
        log.unshift(obj);
        if (log.length > 256) log.pop();
        await resLog.save(log);
    };

    const isHeadlinePage = window.location.pathname === '/livejupiter/';
    const isThreadPage = !isHeadlinePage;
    const stateOfBreak = '-1';
    const stateOfPicking = '0';
    const stateOfReadThreadL10 = '1';
    const {$} = window;
    const exitEarly = () => {
        window.close();
        window.location.href = 'about:blank';
    };
    const exit = async (title = '', body = '') => {
        if (title !== '') {
            GM.notification({
                title: `[Exit]${title}`,
                text: body
            });
        }
        await onjaiStateStore.save(stateOfBreak);
        await sleep(2783);
        exitEarly();
    };
    const parseHeaders = (headerStr) => {
        const headers = {};
        if (!headerStr) return headers;
        headerStr.trim().split(/[\r\n]+/).forEach(line => {
            const [key, ...vals] = line.split(": ");
            headers[key.toLowerCase()] = vals.join(": ");
        });
        return headers;
    };
    const GM_fetch = (url, options = {}) =>
    new Promise((resolve, reject) => {
        const method = options.method || "GET";
        const headers = options.headers || {};
        const data = options.body || null;
        GM.xmlHttpRequest({
            method,
            url,
            headers,
            data,
            responseType: "text",
            onload: (response) => resolve({
                ok: response.status >= 200 && response.status < 300,
                status: response.status,
                statusText: response.statusText,
                url: response.finalUrl,
                headers: parseHeaders(response.responseHeaders),
                text: () => Promise.resolve(response.responseText),
                json: () => Promise.resolve(JSON.parse(response.responseText)),
                blob: () => Promise.resolve(new Blob([response.response])),
            }),
            onerror: reject
        });
    });
    const checkVpnIP = async () => {
        try {
            const ip = await GM_fetch(
                'https://api.ipify.org?format=json'
                // 'https://ipinfo.io?callback'
            )
            .then(res => res.json())
            .then(json => json.ip);
            if (ip !== await vpnIpStore.load()) {
                await exit('IP is not VPN', ip);
            }
        } catch (err) {
            await exit('Failed to check IP', err.message);
        }
    };
    const pickAnka = (str) => str.match(/>>[0-9]+/)?.[0].slice(2);
    const sanitize = (str) => str
    .replace(/!\S+/g, '')
    .replace(/>>[0-9]+/g, '')
    .replace(/🍑/g, '') // twimg
    .replace(/https?:\/\/[\w!?/+\-_~;.,*&@#$%()'[\]]+/g, '') // URL
    .replace(/[\w\-._]+@[\w\-._]+\.[A-Za-z]+/, '') // メールアドレス
    .trim();

    const MIN_RES_NUM = 8;
    const MAX_RES_NUM = 950;
    const MIN_TEXT_LENGTH = 4;
    const MAX_TEXT_LENGTH = 128;
    const NEW_THREAD_RANGE = 32;
    const NEW_THREAD_TIME = 1000 * 60 * 60 * 1;
    const randArray = (arr) => arr[arr.length * Math.random() | 0];
    const done = new Set();
    const isNeedOnjaiRes = (resObj) => {
        if (!resObj) return false;
        if (!resObj.onjai) return false;
        const resNum = resObj.resNum;
        const text = sanitize(resObj.text).slice(0, 8);
        const key = `${resNum}###${text}`;
        if (done.has(key)) return false;
        done.add(key);
        return true;
    };
    const pickHeadline = async () => {
        const list = [];
        $("#headline").children().each((i, e) => {
            const elm = $(e);
            const title = elm.find('a[sub]').attr('sub');
            const resNum = elm.find('a[resnum]').attr('resnum');
            const href = elm.find('a[resnum]').attr('href');
            const text = elm.find('a[resnum]').last().text();
            const isLive = elm.find('.is_live')[0];
            if (!elm) return;
            if (
                Number(resNum) < MIN_RES_NUM ||
                Number(resNum) > MAX_RES_NUM
            ) return;
            const cmd = text.match(/!\S+/)?.[0]; // !syogi等
            const content = sanitize(text).replace(/\s/g, '');
            if (
                content.length < MIN_TEXT_LENGTH ||
                content.length > MAX_TEXT_LENGTH
            ) return;
            if (isLive) return;
            if (/スレ/.test(title)) return;
            if (/>>/.test(title)) return; // 安価スレ
            if (/安価/.test(title)) return; // 安価スレ
            if (/実況/.test(title)) return;
            if (/絵|描/.test(title)) return;
            const date = href.match(/\/test\/read\.cgi\/livejupiter\/([0-9]+)\/l10/)?.[1];
            if (!date) return;
            if (new Date() - new Date(`${date}000`) > NEW_THREAD_TIME) return;
            let onjai = false;
            if (cmd) {
                // コマンド系は!ONJAIのみ反応
                if (/!onjai/i.test(cmd) || /!ai/i.test(cmd)) {
                    onjai = true;
                } else {
                    return;
                }
            } else {
                // 非コマンド系は安価レスのみ反応
                let anka = pickAnka(text);
                if (!anka) return;
            }
            list.push({title, resNum, text, href, onjai});
        });
        if (list.length) {
            const key = `${list[0].resNum}###${list[0].title}`;
            if (key === prevKey) {
                await exit('Same headline', key);
            } else {
                prevKey = key;
            }
            const targets = list.slice(0, NEW_THREAD_RANGE);
            const onjaiRes = targets.find(isNeedOnjaiRes);
            if (onjaiRes) {
                return onjaiRes;
            } else {
                return randArray(targets);
            }
        }
    };
    let prevKey = null;
    const parseResMap = () => {
        let m = new Map();
        $(".thread").find('dd').map((i, e) => {
            const resNum = $(e).attr('num') ?? $(e).attr('rnum') ?? $(e).find('kome').attr('num');
            const id = $(e).prev().find('._id').attr('val');
            const rawText = $(e).text().trim();
            const anka = pickAnka(rawText) ?? 0;
            const hasIframe = $(e).find('iframe').length !== 0; // !syogi等
            if (resNum && id && rawText && !hasIframe) {
                m.set(resNum, {
                    resNum,
                    id,
                    text: sanitize(rawText),
                    anka: Number(anka) < Number(resNum) ? anka : null,
                    onjai: /!onjai/i.test(rawText) || /!ai/i.test(rawText)
                });
            }
        });
        return m;
    };
    const makeGroqPrompt = async (resMap, targetRes) => {
        let curRes = targetRes;
        const arr = [];
        while (curRes) {
            arr.unshift(curRes);
            if (curRes.anka) {
                curRes = resMap.get(curRes.anka);
            } else {
                break;
            }
        }
        const res1 = resMap.get('1');
        if (!res1) return;
        if (curRes !== res1) {
            arr.unshift(res1);
        }
        const title = $("title").text();
        let str = "やりとりを読んで、";
        str += randArray([
            '嫌味ったらしく誤謬を指摘する',
            '人格否定しながら誤謬を指摘する',
            '皮肉まじりに',
            'めっちゃ貶す',
            'めっちゃ褒める',
            'ウケ狙いの',
            '物事の本質を突いた',
            '別の話題を引き出す',
            '端的に「〇〇しようとすなーっ！👆💦」って形式で相手のボケにツッコミする',
        ]);
        str += '1文を生成して{{{と}}}で囲んでクレメンス。主語を省くんやで。';
        str += '\n\n';
        const myId = await myIdStore.load();
        str += `${[
            `イッチ：${title}`,
            ...arr.map(v => `${(()=>{
                switch (v.id) {
                    case res1.id: return 'イッチ';
                    case myId: return 'お前';
                    default: return '誰か';
                }
            })()}：${v.text}`)
        ].join('\n\n')}`;
        return str;
    };
    const onjaiResTemplate = [
        "ん？ワイを呼んだか？",
        "ワイはバージョンアップしたで！",
        "ONJAIだよぉファンサするよぉ🤗",
        "詳しいことはカネルに聞いてくれ",
        "なんで君のために奉仕しないとアカンの？",
        "ワイがたまに自我を出してるって言い方意味不明。君の偶像をワイに押し付けてるだけやん",
    ];
    const makeGroqPromptForOnjai = (userInput) => `「${userInput}」と言われたから「${randArray(onjaiResTemplate)}」の主旨で回答して。1文を生成して{{{と}}}で囲んでクレメンス`;
    const fetchGroq = async (text) =>
    GM_fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${await groqApiKeyStore.load()}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: [
                {
                    role: "user",
                    content: text,
                },
            ],
            temperature: 0.8,
        }),
    })
    .then((res) => res.json())
    .then((data) => {
        console.info(data);
        return data;
    })
    .then((data) => data.choices[0].message.content);
    const parseGroqRes = (str) => {
        const start = str.lastIndexOf('{');
        const end = str.indexOf('}');
        if (start === -1 || end === -1) return;
        if (start > end) return parseGroqRes(str.replace(/\{+.+?\}+/, ''));
        return str.slice(start + 1, end)
            .replace(/「|」/g, '')
            .replace(/？/g, '？\n')
            .replace(/、|。/g, '\n')
            .replace(/\n+/g, '\n')
            .trim();
    };
    const post = async (text) => {
        $("#MESSAGE").text(text);
        await sleep(Math.random() * 40298 + Math.random() * 43044 + 334 + 2783 + 9800);
        $("#submit_button").click();
    };
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    let waitCounter = 3;
    setInterval(async () => {
        const state = await onjaiStateStore.load();
        if (state === stateOfBreak) {
            exitEarly();
        }
    }, 2048);
    const main = async () => {
        await sleep(Math.random() * 40298 + Math.random() * 43044 >> 1);
        console.info(`[main loop start] ${new Date()}`);
        await checkVpnIP();
        const state = await onjaiStateStore.load();
        switch (state) {
            case stateOfBreak: {
                exitEarly();
                break;
            }
            case stateOfPicking: {
                console.info('[stateOfPicking]');
                if (!isHeadlinePage) break;
                const picked = await pickHeadline();
                if (picked) {
                    const {title, resNum, text, href} = picked;
                    console.info(`picked "${title}(${resNum})"`);
                    console.info(text);
                    if (!/\/test\/read\.cgi\/livejupiter\/[0-9]+\/l(10|50)/.test(href)) break;
                    const url = `${window.location.origin}${href}`;
                    await onjaiStateStore.save(stateOfReadThreadL10);
                    GM.openInTab(url.replace(/l10/, 'l50'), true);
                }
                break;
            }
            case stateOfReadThreadL10: {
                console.info('[stateOfReadThreadL10]');
                if (!isThreadPage) break;
                if (--waitCounter < 0) {
                    await onjaiStateStore.save(stateOfPicking);
                    await sleep(2783);
                    window.close();
                }
                const resMap = parseResMap();
                const myId = await myIdStore.load();
                const resArray = [...resMap.values()];
                const lastRes = resArray.at(-1);
                if (lastRes.id === myId) break;
                const done = new Set(resArray.filter(v => v.id === myId).map(v => v.anka).filter(v => v));
                const targets = resArray.filter(v => {
                    const content = sanitize(v.text).replace(/\s/g, '');
                    return (v.id !== myId) &&
                        (!done.has(v.resNum)) &&
                        (content.length >= MIN_TEXT_LENGTH) &&
                        (content.length <= MAX_TEXT_LENGTH);
                });
                const onjaiRes = targets.find(isNeedOnjaiRes);
                let targetRes = null;
                let groqPrompt = null;
                if (onjaiRes) {
                    targetRes = onjaiRes;
                    groqPrompt = await randArray([
                        () => makeGroqPrompt(resMap, targetRes),
                        () => makeGroqPromptForOnjai(targetRes.text),
                    ])();
                } else {
                    const discuss = targets.filter(v => v.anka);
                    const discussWithMe = discuss.filter(v => resMap.get(v.anka)?.id === myId);
                    if (discussWithMe.length) {
                        targetRes = randArray(discussWithMe);
                    } else if (discuss.length) {
                        targetRes = randArray(discuss);
                    } else {
                        targetRes = randArray(targets);
                    }
                    groqPrompt = await makeGroqPrompt(resMap, targetRes);
                }
                if (!targetRes || !groqPrompt) break;
                if (targetRes.id === myId) break;
                console.info(groqPrompt);
                const tryCount = await groqTryCountStore.increment();
                try {
                    const res = await fetchGroq(groqPrompt);
                    const text = parseGroqRes(res);
                    if (!text || !text.length) {
                        throw new Error('レスポンスが空');
                    }
                    if (
                        groqPrompt.replace(/\s/g, '').includes(text.replace(/\s/g, '')) ||
                        text.includes("1文") ||
                        text.includes("一文") ||
                        text.includes("指摘") ||
                        text.includes("生成") ||
                        text.includes('"') ||
                        text.includes("やりとり") ||
                        text.includes("スレッド") ||
                        text.includes("議論されて")
                    ) {
                        throw new Error(res);
                    }
                    const errorCount = await groqErrorCountStore.load();
                    const errorRate = (errorCount / tryCount * 100_00 | 0) / 100;
                    GM.notification({
                        title: `[エラー率${errorRate}%]${res}`,
                        text: groqPrompt
                    });
                    const aiRes = `>>${targetRes.resNum}\n${text}`;
                    await post(aiRes);
                    await saveLog({
                        date: String(new Date()),
                        title: $("title").text(),
                        text: aiRes,
                        href: window.location.href
                    });
                    await onjaiStateStore.save(stateOfPicking);
                    await sleep(2783);
                    window.close();
                } catch (err) {
                    console.error(err);
                    const errorCount = await groqErrorCountStore.increment();
                    const errorRate = (errorCount / tryCount * 100_00 | 0) / 100;
                    GM.notification({
                        title: `[エラー率${errorRate}%]レス生成失敗`,
                        text: err.message
                    });
                }
                break;
            }
        }
        main();
    };
    const [myId, vpnIp, groqApiKey, state] = await Promise.all([
        myIdStore.load(),
        vpnIpStore.load(),
        groqApiKeyStore.load(),
        onjaiStateStore.load()
    ]);
    if (!myId || !vpnIp || !groqApiKey) {
        alert('パラメータ未設定');
        return;
    }
    if (isHeadlinePage) {
        if (confirm('ONJAIを起動する？')) {
            await onjaiStateStore.save(stateOfPicking);
            main();
            console.info('ONJAI起動！');
        }
    } else if (isThreadPage) {
        main();
    }
})();
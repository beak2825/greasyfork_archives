// ==UserScript==
// @name         MoonBit ❤️ LeetCode
// @namespace    a23187.cn
// @version      1.1.2
// @description  add support of moonbit language to leetcode
// @author       A23187
// @homepage     https://github.com/A-23187/moonbit-leetcode
// @match        https://leetcode.cn/problems/*
// @match        https://leetcode.com/problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533641/MoonBit%20%E2%9D%A4%EF%B8%8F%20LeetCode.user.js
// @updateURL https://update.greasyfork.org/scripts/533641/MoonBit%20%E2%9D%A4%EF%B8%8F%20LeetCode.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    async function waitUntil(cond) {
        await new Promise((resolve) => {
            const id = setInterval(() => {
                if (cond()) {
                    clearInterval(id);
                    resolve();
                }
            }, 1000);
        });
    }
    // wait until the `globalThis.monaco` is presented
    await waitUntil(() => globalThis.monaco !== undefined);
    // init `moonpad`, `moon`
    let moonpad;
    let lspWorker;
    let mooncWorkerUrl;
    let onigWasmUrl;
    if (document.getElementById('moonbit-leetcode-crx-loader')) {
        const fetchCrxResource = (path) => new Promise((resolve) => {
            const f = (e) => {
                if (e.data && e.data.type === 'FETCH_CRX_RESOURCE_RESPONSE' && e.data.blob) {
                    window.removeEventListener('message', f);
                    resolve(e.data.blob);
                }
            };
            window.addEventListener('message', f);
            window.postMessage({ type: 'FETCH_CRX_RESOURCE', path }, '*');
        });
        const createObjectUrlFromCrxResource = async (path) => URL.createObjectURL(await fetchCrxResource(path));
        const createWorkerFromCrxResource = async (path) => new Worker(await createObjectUrlFromCrxResource(path));
        const basePath = 'moonpad-monaco';
        moonpad = await import(await createObjectUrlFromCrxResource(`${basePath}/moonpad-monaco.js`));
        lspWorker = await createWorkerFromCrxResource(`${basePath}/lsp-server.js`);
        mooncWorkerUrl = await createObjectUrlFromCrxResource(`${basePath}/moonc-worker.js`);
        onigWasmUrl = await createObjectUrlFromCrxResource(`${basePath}/onig.wasm`);
    } else {
        const createObjectUrlFromCORSUrl = async (url) => await fetch(url).then((resp) => resp.text())
            .then((cnt) => URL.createObjectURL(new Blob([cnt], { type: 'application/javascript' })));
        const createWorkerFromCORSUrl = async (url) => new Worker(await createObjectUrlFromCORSUrl(url));
        const baseUrl = 'https://cdn.jsdelivr.net/gh/A-23187/moonbit-leetcode/moonpad-monaco';
        moonpad = await import(`${baseUrl}/moonpad-monaco.js`);
        lspWorker = await createWorkerFromCORSUrl(`${baseUrl}/lsp-server.js`);
        mooncWorkerUrl = await createObjectUrlFromCORSUrl(`${baseUrl}/moonc-worker.js`);
        onigWasmUrl = `${baseUrl}/onig.wasm`;
    }
    function initMoon() {
        globalThis.moon = globalThis.moon ?? moonpad.init({
            onigWasmUrl,
            lspWorker,
            mooncWorkerFactory: () => new Worker(mooncWorkerUrl),
            codeLensFilter: () => false,
        });
    }
    globalThis.moon = null;
    globalThis.moonpad = moonpad;
    // handle language switching
    const toLanguageId = (function() {
        const languageMap = new Map([['C++', 'cpp'], ['C#', 'csharp'], ['Go', 'golang']]);
        return (languageName) => (
            languageMap.has(languageName) ? languageMap.get(languageName) : languageName.toLowerCase());
    })();
    function getCurrentLanguageId() {
        return globalThis.monaco.editor.getEditors()[0].getModel().getLanguageId();
    }
    async function getUser() {
        return (await fetch('https://leetcode.cn/graphql/', {
            method: 'POST',
            body: JSON.stringify({
                operationName: 'globalData',
                query: `query globalData {
                    userStatus {
                        realName userSlug username
                    }
                }`,
                variables: {},
            }),
        }).then((resp) => resp.json())).data.userStatus;
    }
    function getQuestionTitleSlug() {
        return document.location.pathname.split('/')[2];
    }
    async function getQuestion() {
        return (await fetch('https://leetcode.cn/graphql/', {
            method: 'POST',
            body: JSON.stringify({
                operationName: 'questionDetail',
                query: `query questionDetail($titleSlug: String!) {
                    question(titleSlug: $titleSlug) {
                        titleSlug questionId questionFrontendId metaData
                    }
                }`,
                variables: {
                    titleSlug: getQuestionTitleSlug(),
                },
            }),
        }).then((resp) => resp.json())).data.question;
    }
    async function getQuestionMetaData() {
        return JSON.parse((await getQuestion()).metaData);
    }
    const parseType = (function() {
        const typeMap = new Map([
            ['void', 'Unit'], ['boolean', 'Bool'], ['integer', 'Int'], ['long', 'Int64'],
            ['float', 'Float'], ['double', 'Double'], ['char', 'Char'], ['character', 'Char'], ['string', 'String'],
        ]);
        const dfs = (type, begin, end) => {
            if (begin >= end) {
                return '';
            }
            if (type.endsWith('[]', end)) {
                return `Array[${dfs(type, begin, end - 2)}]`;
            }
            if (type.startsWith('list<', begin)) {
                return `Array[${dfs(type, begin + 5, end - 1)}]`;
            }
            const t = type.substring(begin, end);
            return typeMap.get(t) ?? t;
        };
        return (type) => dfs(type, 0, type.length);
    })();
    async function generateMoonCodeTemplate() {
        const { name, params, return: { type: returnType } } = await getQuestionMetaData();
        return `pub fn ${name}(${params.map((p) => `${p.name}: ${parseType(p.type)}`).join(', ')}) -> ${parseType(returnType)} {\n}\n`;
    }
    const switchLanguage = (function() {
        const monaco = globalThis.monaco;
        let moonModel = null;
        let nonMoonModel = null;
        return async (languageName) => {
            const currLanguageId = getCurrentLanguageId();
            const languageId = toLanguageId(languageName);
            if (currLanguageId === languageId) {
                return;
            }
            if (languageId === 'moonbit') {
                initMoon();
                if (moonModel === null) {
                    const questionTitleSlug = getQuestionTitleSlug();
                    moonModel = monaco.editor.createModel(localStorage.getItem(questionTitleSlug) ??
                                                          await generateMoonCodeTemplate(), languageId);
                    moonModel.onDidChangeContent(() => localStorage.setItem(questionTitleSlug, moonModel.getValue()));
                }
                monaco.editor.getEditors()[0].setModel(moonModel);
            } else if (currLanguageId === 'moonbit') {
                if (nonMoonModel === null) {
                    const userSlug = (await getUser()).userSlug;
                    const questionId = (await getQuestion()).questionId;
                    const ugcKey = `ugc_${userSlug}_${questionId}_${languageId}_code`;
                    nonMoonModel = monaco.editor
                        .createModel(JSON.parse(localStorage.getItem(ugcKey))?.code ?? '', languageId);
                }
                monaco.editor.getEditors()[0].setModel(nonMoonModel);
            }
        };
    })();
    // observe document.body for the language selection dropdown to be added
    const mutationObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.type !== 'childList' || !m.addedNodes?.item(0)?.innerText?.startsWith('C++\nJava\nPython\nPython3')) {
                continue;
            }
            const switchLanguageBtn = document.querySelector('#editor > div:nth-child(1) button:nth-child(1)');
            const languageSelectionDiv = m.addedNodes[0].querySelector('div > div > div');
            const lastColDiv = languageSelectionDiv.lastElementChild;
            const moonDiv = lastColDiv.lastElementChild.cloneNode(true);
            moonDiv.querySelector('div > div > div').innerText = 'MoonBit';
            lastColDiv.appendChild(moonDiv);
            for (const colDiv of languageSelectionDiv.children) {
                for (const itemDiv of colDiv.children) {
                    const svg = moonDiv.querySelector('div > div > svg');
                    if (toLanguageId(itemDiv.innerText) === getCurrentLanguageId()) {
                        svg.classList.add('visible');
                        svg.classList.remove('invisible');
                    } else {
                        svg.classList.add('invisible');
                        svg.classList.remove('visible');
                    }
                    itemDiv.onclick = async () => {
                        await switchLanguage(itemDiv.innerText);
                        switchLanguageBtn.firstChild.data = itemDiv.innerText;
                        languageSelectionDiv.parentElement.hidden = true;
                    };
                }
            }
            break;
        }
    });
    mutationObserver.observe(document.body, { childList: true });
    // observe for the "Reset to default code" dialog to be added
    waitUntil(() => {
        const topRightBtnsDiv = document.querySelector('#editor > div:nth-child(1) > div:last-child');
        if (topRightBtnsDiv === null) {
            return false;
        }
        const mutationObserver = new MutationObserver((mutations) => {
            if (getCurrentLanguageId() !== 'moonbit') {
                return;
            }
            for (const m of mutations) {
                const p = /您将放弃所有更改并初始化代码！|Your current code will be discarded and reset to the default code!/;
                if (m.type !== 'childList' || !m.addedNodes?.item(0)?.innerText?.match(p)) {
                    continue;
                }
                const confirmBtn = m.addedNodes[0].querySelectorAll('button')[1];
                confirmBtn.onclick = async () => {
                    globalThis.monaco.editor.getEditors()[0].getModel().setValue(await generateMoonCodeTemplate());
                };
                break;
            }
        });
        mutationObserver.observe(topRightBtnsDiv, { childList: true });
        return true;
    });
    // compile
    async function compile(commentSource = false) {
        const editor = globalThis.monaco.editor.getEditors()[0];
        const { name } = await getQuestionMetaData();
        const result = await globalThis.moon.compile({
            libInputs: [[`${name}.mbt`, editor.getValue()]],
            isMain: false,
            exportedFunctions: [name],
        });
        if (result.kind === 'success') {
            return `${commentSource && editor.getValue().trim().replace(/^/gm, '// ') || ''}\n${
                new TextDecoder().decode(result.js)
                    .replace(/export\s*\{\s*([^\s]+)\s+as\s+([^\s]+)\s*\}/g, 'const $2 = $1;')}`;
        } else if (result.kind === 'error') {
            throw new Error(result.diagnostics.map((d) => `${name}.mbt:${d.loc.start.line} ${d.message}\n    ${
                editor.getModel().getValueInRange({
                    startLineNumber: d.loc.start.line,
                    startColumn: d.loc.start.col,
                    endLineeNumber: d.loc.end.line,
                    endColumn: d.loc.end.col,
                })}`).join('\n\n'));
        }
        return null;
    }
    // run and submit
    globalThis._fetch = globalThis.fetch;
    globalThis.fetch = async (resource, options) => {
        // pre hook
        if ((resource === `${document.location.pathname}interpret_solution/` ||
             resource === `${document.location.pathname}submit/`) && getCurrentLanguageId() === 'moonbit') {
            const body = JSON.parse(options.body);
            body.lang = 'javascript';
            body.typed_code = await compile(true)
                .catch((e) => `throw'MOON_ERR_BEGIN\\n'+${JSON.stringify(e.message)}+'\\nMOON_ERR_END'`);
            options.body = JSON.stringify(body);
        }
        const r = globalThis._fetch(resource, options);
        // post hook
        if (resource.match(/^\/submissions\/detail\/[^/]+\/check\/$/)) {
            const checkResult = await r.then((resp) => resp.clone().json());
            const { full_runtime_error: fullRuntimeError = '' } = checkResult;
            const [_, moonError = null] = fullRuntimeError.match(/MOON_ERR_BEGIN\n([\s\S]+)\nMOON_ERR_END/) ?? [];
            if (_ && moonError) {
                checkResult.full_runtime_error = moonError;
                return Response.json(checkResult);
            }
            return r;
        }
        return r;
    };
})();

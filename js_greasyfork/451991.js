// ==UserScript==
// @name               [SNOLAB] [Mulango] Point Speaker
// @name:zh            [SNOLAB] [Mulango] 点读笔
// @namespace          snomiao@gmail.com
// @author             snomiao@gmail.com
// @version            1.0.3
// @description        [SNOLAB] Mulango Point Speaker, 按 alt+t 翻译鼠标所在元素到浏览器第二语言
// @description:zh     [SNOLAB] Mulango 点读笔, 按 alt+t 翻译鼠标所在元素到浏览器第二语言
// @match              https://*.google.com/search?*
// @match              https://*.bing.com/search?*
// @match              https://*/search*
// @grant              none
// @run-at             document-start
// @license            GPL-3.0+
// @supportURL         https://github.com/snomiao/userscript.js/issues
// @contributionURL    https://snomiao.com/donate
// @grant              GM_getValue
// @grant              GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/451991/%5BSNOLAB%5D%20%5BMulango%5D%20Point%20Speaker.user.js
// @updateURL https://update.greasyfork.org/scripts/451991/%5BSNOLAB%5D%20%5BMulango%5D%20Point%20Speaker.meta.js
// ==/UserScript==

(async function () {
    const translate = await useTranslator();
    hotkeys({
        "alt+t": async () => await pointedTranslate(),
    });

    async function pointedTranslate() {
        return await elementAltTranslate(getPointedElement());
    }

    async function elementAltTranslate(e) {
        console.log("translating", e);
        const transcript = await translate(
            speaked(e.textContent),
            navigator.languages[1]
        );
        e.setAttribute("title", transcript);
    }
})();

async function speaked(text) {
    return (
        speechSynthesis.speak(
            Object.assign(new SpeechSynthesisUtterance(), { text })
        ),
        text
    );
}

function hotkeys(mapping) {
    Object.entries(mapping).map(([hotkey, handler]) =>
        window.addEventListener("keydown", hotkeyHandler(hotkey, handler))
    );
    function hotkeyHandler(hotkey, fn) {
        return (e) => {
            e[e.key + "Key"] = true;
            const falseKeys = "meta+alt+shift+ctrl";
            const conds = (falseKeys + "+" + hotkey)
                .replace(/win|command|search/, "meta")
                .replace(/control/, "ctrl")
                .split("+")
                .map((k, i) => [k, (i < 4) ^ e[k + "Key"]]);
            const covered = Object.entries(Object.fromEntries(conds));
            console.log(covered);
            const matched = covered.every(([keyName, pass]) => pass);
            if (!matched) return;
            e.stopPropagation();
            e.preventDefault();
            return fn();
        };
    }
}

async function useTranslator(initLang = navigator.language) {
    const translateAPI = (
        await import(
            "https://cdn.skypack.dev/@snomiao/google-translate-api-browser"
        )
    ).setCORS("https://google-translate-cors.vercel.app/api?url=", {
        encode: true,
    });
    const translate = async (s, lang = initLang) => {
        if (!s) return;
        return await translateAPI(s, { to: lang.replace(/-.*/, "") })
            .then((e) => e.text)
            .catch(console.error);
    };
    return localforageCached(limiter(translate, 1e3));
}
function validPipor(fn) {
    // requires the first param is not undefined otherwise return the undefined
    return (s, ...args) => (s === undefined ? undefined : fn(s, ...args));
}
function limiter(fn, wait = 1e3, last = 0) {
    return async (...args) => {
        const remain = () => last + wait - +new Date();
        while (remain() > 0) await new Promise((r) => setTimeout(r, remain()));
        const r = await fn(...args);
        last = +new Date();
        return r;
    };
}
function edgeFilter(init) {
    return (e) => (e !== init ? (init = e) : undefined);
}

async function localforageCached(fn) {
    const hash = (s) => s.slice(0, 16) + s.slice(-16);
    const { default: cache } = await import(
        "https://cdn.skypack.dev/@luudjanssen/localforage-cache"
    );
    const in3day = 86400e3 * 3;
    const cacheName = hash(String(fn));
    const cacheInstance = cache.createInstance({
        name: cacheName,
        defaultExpiration: in3day,
    });
    return validPipor(cachedFn);
    async function cachedFn(...args) {
        const result =
            (await cacheInstance?.getItem(JSON.stringify(args))) ||
            (await fn(...args));
        await cacheInstance?.setItem(JSON.stringify(args), result); //refresh cache
        return result;
    }
}

function getPointedElement() {
    return [...document.querySelectorAll(":hover")].reverse()[0];
}

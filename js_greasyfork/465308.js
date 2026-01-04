// ==UserScript==
// @name         [SNOLAB] [Mulango] myTyping Game Translator
// @namespace    https://userscript.snomiao.com/
// @author       snomiao@gmail.com
// @version      0.2.1
// @description  [SNOLAB] [Mulango] Translate Japenese to the second language of your browser.
// @match        https://typing.twi1.me/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twi1.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465308/%5BSNOLAB%5D%20%5BMulango%5D%20myTyping%20Game%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/465308/%5BSNOLAB%5D%20%5BMulango%5D%20myTyping%20Game%20Translator.meta.js
// ==/UserScript==
/*
    Tested Pages:
        https://typing.twi1.me/game/79902
 */

(async function () {
    const translate = await useTranslator(navigator.languages[1]);
    questionsLoop().then();
    questionsLoopZh().then();
    typingLoop().then();
    speakingLoop().then();

    async function questionsLoop() {
        while (1) {
            const cls = ".questions .kanji:not(.translated)";
            const e = document.querySelector(cls);
            if (e) {
                e.classList.add("translated");
                const transcript = await translate(e.textContent);
                e.innerHTML = e.innerHTML + "\t(" + transcript;
                continue;
            }
            await new Promise((r) => setTimeout(r, 32)); // TODO: upgrade this into Observer Object
        }
    }
    async function questionsLoopZh() {
        while (1) {
            const sel = ".questions .kanji.translated:not(.translatedzh)"; // translate users' lang first
            const e = document.querySelector(sel);
            if (e) {
                e.classList.add("translatedzh");
                const ts2 = await translate(e.textContent, "zh");
                e.setAttribute("title", ts2);
                continue;
            }
            await new Promise((r) => setTimeout(r, 100)); // TODO: upgrade this into Observer Object
        }
    }
    async function speakingLoop() {
        const changed = edger("");
        while (1) {
            const e = document.querySelector(".mtjGmSc-kana");
            if (e && changed(e.textContent)) {
                document.querySelector(".mtjGmSc-kana").style = "color: #DDD";
                await speak(e.textContent);
            }
            await new Promise((r) => setTimeout(r, 100)); // TODO: upgrade this into Observer Object
        }
    }
    async function typingLoop() {
        const changed = edger("");
        while (1) {
            const e = document.querySelector(".mtjGmSc-kanji");
            if (e && !translated(e) && changed(e.textContent)) {
                document.querySelector(".mtjGmSc-roma").style = "display: none";
                const textContent = e.textContent;
                await kanjiTranscriptReplace(e, textContent);
                const transcript = await translate(textContent);
                await kanjiTranscriptReplace(e, transcript);
                const transcriptZH = await translate(textContent, "zh");
                await kanjiTranscriptReplace(e, transcript, transcriptZH);
            }
            await new Promise((r) => setTimeout(r, 100)); // TODO: upgrade this into Observer Object
        }

        function translated(e) {
            return e.querySelector(".kanji-transcript");
        }
    }
    async function speakAndTranslate(s) {
        return await translate(await speaked(s));
        k;
    }
})();

async function kanjiTranscriptReplace(e, transcript, title) {
    const style =
        "width: 100%;text-align: center;background: white;position: relative;z-index: 1;";
    e.querySelector(".kanji-transcript")?.remove();
    const div = document.createElement("div");
    div.className = "kanji-transcript";
    div.innerHTML = transcript;
    div.style = style;
    title && div.setAttribute("title", title);
    e.appendChild(div);
    await new Promise((r) => setTimeout(r, 1));
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
function edger(init) {
    return (e) => (e !== init ? (init = e) : undefined);
}
function watcher(fetcher, listener, interval = 16) {
    const changed = edger();
    return async () => {
        while (1) {
            await validPipor(listener)(changed(await fetcher()));
            await new Promise((r) => setTimeout(r, interval));
        }
    };
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

async function speaked(text) {
    return (
        speechSynthesis.speak(
            Object.assign(new SpeechSynthesisUtterance(), { text, lang: "ja" })
        ),
        text
    );
}

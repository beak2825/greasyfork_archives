// ==UserScript==
// @name               [SNOLAB] [Mulango] Telegram Translator
// @name:zh            [SNOLAB] [Mulango] 电报译者
// @namespace          snomiao@gmail.com
// @author             snomiao@gmail.com
// @version            1.7.0
// @description        [SNOLAB] [Mulango] Speak latest telegram message With TTS technology just in your browser. 1. Speak latest message you received in your learning language 2. Speak what you just send in your learning language. 3. Send what you saying in your learning language (for example saying something start with CQ CQ ...).
// @match              https://*.telegram.org/z/
// @grant              none
// @run-at             document-start
// @license            GPL-3.0+
// @supportURL         https://github.com/snomiao/userscript.js/issues
// @contributionURL    https://snomiao.com/donate
// @downloadURL https://update.greasyfork.org/scripts/450872/%5BSNOLAB%5D%20%5BMulango%5D%20Telegram%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/450872/%5BSNOLAB%5D%20%5BMulango%5D%20Telegram%20Translator.meta.js
// ==/UserScript==
// TODO 写份使用说明

/**
 *
 * Set your browser lang to your learning language.
 *
 * Feat:
 *   1. Speak latest message your received (in your learning language)
 *   2. Speak what you just send           (in your learning language)
 *
 *   3. Send what you saying (in your learning language, traslated into your partner language)
 *   4. Type in your learning learning and send it as your partner's language.
 *
 * Feel free to chat with [@snomiao](t.me/snomiao)
 *
 */

const langsDedupe = (e) => uniqueBy((lang) => lang.split("-")[0], e);
const learningLangs = langsDedupe(navigator.languages).slice(0, 2);

(async function () {
    const speakingChanged = edger("");
    const [state, setState] = useTelegramTranslatorState({
        partnerLang: null,
        learningLang: null,
    });

    main();

    async function main() {
        speechSynthesisMissingAlert();
        speechRecognitionPolyfill();
        // listeningLooper().then()
        speakingLooper().then();
        // speakingMySelfLooper().then()
        setTimeout(() => translateLooper().then(), 1e3);
        // alt+d translate any to learning language
        window.addEventListener("keydown", async (e) => {
            if (!AltD(e)) return;
            e.preventDefault(), e.stopPropagation();
            const raw = document.querySelector(
                "#editable-message-text"
            ).innerHTML;
            const text = await translated(raw);
            // translate to learning language
            await tgMessageInput(text);
            await speak(text);
        });
        // alt+f listen...
        window.addEventListener("keydown", async (e) => {
            if (!AltF(e)) return;
            e.preventDefault(), e.stopPropagation();
            const text = await new Promise(async (resolve, reject) => {
                const r = new globalThis.SpeechRecognition();
                r.lang = await userLangGet();
                r.onresult = (e) =>
                    resolve(e?.results?.[0]?.[0]?.transcript || "");
                r.onerror = () => setTimeout(() => resolve("/"), 64);
                r.onaudiostart = async () =>
                    await tgMessageInput(
                        "Listening... (" + new Date().toISOString() + ")"
                    );
                r.start();
            });
            await tgMessageInput(text);
            await speak(text);
            const text2 = await translated(text, state.partnerLang);
            await tgMessageInput(text2 + " (" + text);
        });
        // alt+s translate any to partner lang
        window.addEventListener("keydown", async (e) => {
            if (!AltS(e)) return;
            e.preventDefault(), e.stopPropagation();
            const raw = document.querySelector(
                "#editable-message-text"
            ).innerHTML;
            const text = await translated(raw, state.partnerLang);
            await tgMessageInput(text);
        });
    }

    function AltS(e) {
        return (
            e.altKey &&
            !e.shiftKey &&
            !e.ctrlKey &&
            !e.metaKey &&
            e.code === "KeyS"
        );
    }
    function AltF(e) {
        return (
            e.altKey &&
            !e.shiftKey &&
            !e.ctrlKey &&
            !e.metaKey &&
            e.code === "KeyF"
        );
    }

    function AltD(e) {
        return (
            e.altKey &&
            !e.shiftKey &&
            !e.ctrlKey &&
            !e.metaKey &&
            e.code === "KeyD"
        );
    }

    async function listeningLooper() {
        while (1)
            await tgSend(
                await messageSendingConfirmed(await heard(await userLangGet()))
            );
    }
    async function speakingLooper() {
        const changed = edger("");
        while (1) {
            await speak(await translated(changed(latestMessage())));
            await delay1s();
        }
    }
    // async function speakingMySelfLooper() {
    //    const changed = edgeFilter('')
    //    while (1) {await speak2nd(await translated(changed(latestMyMessage()))); await delay1s()}
    //}
    async function translateLooper() {
        // const changed = edgeFilter("");
        while (1) {
            await messageTranslateNext();
            await delay1s();
        }
    }
    function isScrolledIntoView(el) {
        if (!el) return false;
        var rect = el.getBoundingClientRect();
        var elemTop = rect.top;
        var elemBottom = rect.bottom;

        // Only completely visible elements return true:
        var isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;
        // Partially visible elements return true:
        //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
        return isVisible;
    }
    async function messageTranslateNext() {
        const ls = [
            document.querySelector(
                ".EmbeddedMessage.inside-input .message-text p"
            ),
            ...[
                ,
                ...document.querySelectorAll(".Message .text-content"),
            ].reverse(),
        ].filter((e) => e);
        for await (const e of ls) {
            if (!e) continue;
            if (!isScrolledIntoView(e)) continue;
            if (e.childNodes[0].textContent?.match("\t")) continue;
            const transcript = await translated(e.childNodes[0].textContent);
            e.childNodes[0].textContent =
                "\t" + transcript + " (" + e.childNodes[0].textContent;
            await speak(transcript);
            // await delay1s();
            break;
        }
    }

    async function translated(s, lang = null) {
        if (!s) return;

        setState({ learningLang: await userLangGet() });

        const to = (lang || state.learningLang).split("-")[0];
        const cachedTranscript = await transcriptCache?.getItem(
            JSON.stringify({ s, to })
        );
        if (cachedTranscript) return cachedTranscript;

        return await translate(s, { to })
            .then(async (re) => {
                const text = re?.text;
                const recognizedLang = re?.from?.language?.iso;
                const partnerLangIsNotLearningLang =
                    !state.learningLang.startsWith(recognizedLang);
                if (
                    recognizedLang !== state.partnerLang &&
                    partnerLangIsNotLearningLang
                ) {
                    setState({
                        ...state,
                        partnerLang: recognizedLang || state.partnerLang,
                    }); // it's zh-CN for me
                    console.log("got partner language: ", state.partnerLang);
                }
                if (!text) return s;
                if (text !== s) console.log("translated from " + s);
                // if( tgMessageEmptyQ()) await tgMessageInput(text+' //translated')
                await transcriptCache?.setItem(JSON.stringify({ s, to }), text);
                return text;
            })
            .catch((error) => console.error(error));
    }
    async function speak(s, { lang = null, wait = true, force = true } = {}) {
        if (!s) return; // console.error('say empty msg')

        s = s.replace(/https?:\S*/g, ""); // remove links
        console.log("saying " + s);
        await waitFor(voicesAvailiable);

        if (speechSynthesis.speaking && force) speechSynthesis.cancel();
        return await new Promise(async (resolve, reject) => {
            const utter = new SpeechSynthesisUtterance(s);
            if (lang) {
                utter.lang = lang;
            } else {
                utter.voice = await userVoiceGet();
            }
            const slow = !Boolean(speakingChanged(s));

            utter.rate = slow
                ? 0.6
                : Math.min(Math.max(0.6, 60 / (s.length + 1)), 1);

            utter.onend = resolve;
            utter.onerror = reject;
            speechSynthesis.speak(utter);
            if (!wait) resolve();
        });
    }
})();
function speechRecognitionPolyfill() {
    globalThis.SpeechRecognition =
        globalThis.SpeechRecognition ||
        globalThis.webkitSpeechRecognition ||
        globalThis.mozillaSpeechRecognition;
    if (!globalThis.SpeechRecognition)
        throw alert(
            "unable to access speechSynthesis service, please update your browser"
        );
}

function speechSynthesisMissingAlert() {
    if (!globalThis.speechSynthesis)
        throw alert(
            "unable to access speechSynthesis service, please update your browser"
        );
}

// async function titleLooper(){
//     const titleGet = ()=>document.querySelector('.selected h3').innerHTML
//     const titleUpdate = (t)=>t&&
//     while (1) {await titleUpdate(changed(titleGet())); await delay1s()}
// }

async function heard(lang) {
    globalThis.SpeechRecognition =
        globalThis.SpeechRecognition ||
        globalThis.webkitSpeechRecognition ||
        globalThis.mozillaSpeechRecognition;
    console.log("listening");
    const result = await new Promise(async (resolve, reject) => {
        const r = new globalThis.SpeechRecognition();
        r.lang = lang || (await userLangGet());
        r.onresult = (e) => resolve(e?.results?.[0]?.[0]?.transcript || "");
        r.onerror = () => setTimeout(() => resolve(""), 64);
        r.addEventListener("audiostart", () => {
            console.log("Audio capturing started");
        });
        r.start();
    });
    console.log("heard", result);
    // if (tgMessageEmptyQ()) await tgMessageInput(result + " //heard");
    return result;
}

async function messageSendingConfirmed(s = "") {
    const r = s.match(/^(话说|話說|你看|呼叫|CQ |もし)(?:\1)(?<msg>.*)$/i)
        ?.groups?.msg;
    if (!r) return;
    await speak("发送 " + r);
    return r;
}

async function speak2nd(s) {
    if (!s) return; // console.error('say empty msg')
    if (speechSynthesis.speaking) return; // low priority
    console.log("saying " + s);
    await waitFor(voicesAvailiable);

    const utter = new SpeechSynthesisUtterance(s);
    utter.voice = await userVoiceGet2nd();
    utter.rate = Math.min(Math.max(1, s.length / 60), 4);
    if (speechSynthesis.speaking) speechSynthesis.cancel();
    speechSynthesis.speak(utter);
}

function voicesAvailiable() {
    return globalThis.speechSynthesis.getVoices().length !== 0;
}
function latestMessage() {
    return [...document.querySelectorAll(".Message .text-content")]
        .map((e) => e.childNodes[0].textContent) // text node
        .reverse()[0];
}
function latestPartnerMessage() {
    return [...document.querySelectorAll(".Message:not(.own) .text-content")]
        .map((e) => e.childNodes[0].textContent) // text node
        .reverse()[0];
}
function latestMyMessage() {
    return [...document.querySelectorAll(".Message.own .text-content")]
        .map((e) => e.childNodes[0].textContent) // text node
        .reverse()[0];
}

function edger(init) {
    return (e) => (e !== init ? (init = e) : undefined);
}

async function tgSend(s) {
    if (!s) return;
    await tgMessageInput(s);
    await new Promise((r) => setTimeout(r, 1e3));
    document.querySelector("#editable-message-text").dispatchEvent(
        new KeyboardEvent("keydown", {
            bubbles: true,
            cancellable: true,
            composed: true,
            key: "Enter",
            code: "Enter",
        })
    );
}

function tgMessageEmptyQ() {
    const content = document.querySelector("#editable-message-text").innerHTML;
    return (
        content === "" ||
        content.endsWith(" //heard") ||
        content.endsWith(" //translated")
    );
}

async function tgMessageInput(s = "") {
    document.querySelector("#editable-message-text").innerHTML = s;
    await new Promise((r) => setTimeout(r, 1e3));
    document.querySelector("#editable-message-text").dispatchEvent(
        new InputEvent("input", {
            bubbles: true,
            cancellable: false,
            inputType: "insertText",
            composed: true,
        })
    );
}

async function waitFor(cond) {
    while (!cond()) await delay1s();
}

async function delay1s() {
    await new Promise((r) => setTimeout(r, 1e3));
}
async function delay100ms() {
    await new Promise((r) => setTimeout(r, 1e2));
}

async function userLangGet() {
    return (await userVoiceGet()).lang;
}

async function userVoiceGet() {
    return (await voicesForUserLang())[0];
}

async function userVoiceGet2nd() {
    const ls = await voicesForUserLang();
    return ls[1] || ls[0];
}
async function voicesForUserLang() {
    await waitFor(voicesAvailiable);
    return navigator.languages
        .map((nlang) =>
            globalThis.speechSynthesis
                .getVoices()
                .filter(({ lang }) => lang.startsWith(nlang))
                .reverse()
        )
        .flat();
    // return globalThis.speechSynthesis.getVoices().filter(({ lang }) => navigator.languages.find(nlang => lang.startsWith(nlang))).reverse();
}

function useTelegramTranslatorState(initState) {
    const got = ((e) => e && JSON.parse(e))(
        localStorage.getItem("tgTranslatorState")
    );
    const state = { ...initState, ...got };
    return [
        state,
        (newState) => {
            console.log("useTelegramTranslatorState - setState", newState);
            Object.assign(state, newState);
            localStorage.setItem("tgTranslatorState", JSON.stringify(state));
            return state;
        },
    ];
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

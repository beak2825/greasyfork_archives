// ==UserScript==
// @deprecated         Use my new script [SNOLAB] [Mulango] Telegram Translator
// @name               [SNOLAB] I Heard Telegram Speaking
// @namespace          snomiao@gmail.com
// @author             snomiao@gmail.com
// @version            0.3.1
// @description        [SNOLAB] Speak latest telegram message With TTS technology just in your browser. 1. Speak latest message your received 2. Speak what you just send. 3. Send what you saying
// @match              https://*.telegram.org/z/
// @grant              none
// @run-at             document-start
// @license            GPL-3.0+
// @supportURL         https://github.com/snomiao/userscript.js/issues
// @contributionURL    https://snomiao.com/donate
// @downloadURL https://update.greasyfork.org/scripts/450502/%5BSNOLAB%5D%20I%20Heard%20Telegram%20Speaking.user.js
// @updateURL https://update.greasyfork.org/scripts/450502/%5BSNOLAB%5D%20I%20Heard%20Telegram%20Speaking.meta.js
// ==/UserScript==
/**
 * 1. Speak latest message your received
 * 2. Speak what you just send.
 * 3. Send what you saying
 */
main();

async function main() {
    if (!globalThis.speechSynthesis)
        return alert(
            "unable to access speechSynthesis service, please update your browser"
        );
    // polyfill and error detect
    globalThis.SpeechRecognition =
        globalThis.SpeechRecognition ||
        globalThis.webkitSpeechRecognition ||
        globalThis.mozillaSpeechRecognition;
    if (!globalThis.SpeechRecognition)
        return alert(
            "unable to access speechSynthesis service, please update your browser"
        );
    listeningLooper().then();
    speakingLooper().then();
    speakingMySelfLooper().then();
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
        await speak(changed(latestMessage()));
        await delay1s();
    }
}
async function speakingMySelfLooper() {
    const changed = edger("");
    while (1) {
        await speak2nd(changed(latestMyMessage()));
        await delay1s();
    }
}
// async function titleLooper(){
//     const titleGet = ()=>document.querySelector('.selected h3').innerHTML
//     const titleUpdate = (t)=>t&&
//     while (1) {await titleUpdate(changed(titleGet())); await delay1s()}
// }

async function heard(lang = "en-US") {
    globalThis.SpeechRecognition =
        globalThis.SpeechRecognition ||
        globalThis.webkitSpeechRecognition ||
        globalThis.mozillaSpeechRecognition;
    console.log("listening");
    const result = await new Promise((resolve, reject) => {
        const sr = new globalThis.SpeechRecognition();
        sr.continuous = true;
        sr.lang = lang;
        sr.onresult = (e) => {
            const result = e?.results?.[0]?.[0]?.transcript || "";
            resolve(result);
        };
        sr.onerror = () => resolve("");
        sr.start();
    });
    console.log("heard", result);
    if (tgMessageEmptyQ()) await tgMessageInput(result + " //heard");
    await new Promise((r) => setTimeout(r, 64));
    return result;
}

async function messageSendingConfirmed(s = "") {
    const r = s.match(/^(话说|話說|你看|呼叫|CQ |もし)(?:\1)(?<msg>.*)$/i)
        ?.groups?.msg;
    if (!r) return;
    await speak("发送 " + r);
    return r;
}

async function speak(s) {
    if (!s) return; // console.error('say empty msg')

    console.log("saying " + s);
    await waitFor(voicesAvailiable);

    const utter = new SpeechSynthesisUtterance(s);
    utter.voice = await userVoiceGet();
    utter.rate = Math.min(Math.max(1, s.length / 60), 4);
    if (speechSynthesis.speaking) speechSynthesis.cancel();
    speechSynthesis.speak(utter);
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
    return [...document.querySelectorAll(".Message:not(.own) .text-content")]
        .map((e) => e.textContent)
        .reverse()[0];
}
function latestMyMessage() {
    return [...document.querySelectorAll(".Message.own .text-content")]
        .map((e) => e.textContent)
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
    return content === "" || content.endsWith(" //heard");
}

async function tgMessageInput(s) {
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

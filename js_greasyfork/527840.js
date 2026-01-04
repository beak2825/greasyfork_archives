// ==UserScript==
// @name         Crosspost from Twitter
// @namespace    https://lit.link/toracatman
// @version      2025-07-11
// @description  Twitter から 他の SNS に 半自動的に 同時投稿します。
// @author       トラネコマン
// @match        https://x.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @sandbox      DOM
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527840/Crosspost%20from%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/527840/Crosspost%20from%20Twitter.meta.js
// ==/UserScript==

/**
 * content_script/System/TwitterCrawler.ts (Misstterより)
 */
const getTweetText = () => {
    let textContents = document.querySelectorAll(
        'div[data-testid="tweetTextarea_0"] div[data-block="true"]'
    )
    //スマホに対応
    let text
    if (textContents.length > 0) {
        text = Array.from(textContents)
            .map(textContent => {
            return textContent.textContent
        })
            .join("\n")
    }
    else {
        textContents = document.querySelector('textarea[data-testid="tweetTextarea_0"]')
        if (!textContents) return
        text = textContents.value
    }

    return text
}


let btn_bluesky;
let btn_threads;
let btn_mastodon;
const D_INS_MASTODON = "https://mstdn.jp";
let ins_mastodon;
let btn_misskey;
const D_INS_MISSKEY = "https://misskey.io";
let ins_misskey;
let btn_facebook;
let btn_line;
let btn_fiicen;
let btn_substitute;
let btn_clipboard;

let isPhone;

function displayMessage(text, error) {
    let div = document.createElement("div");
    div.style.position = "fixed";
    div.style.top = "0";
    div.style.left = "0";
    div.style.width = "100%";
    div.style.backgroundColor = error ? "#f00" : "#008000";
    div.style.color = "#fff";
    div.style.textAlign = "center";
    div.textContent = text;
    document.body.appendChild(div);
    setTimeout(() => { div.remove(); }, 3000);
}

function crosspost(url) {
    let text = getTweetText().trim();
    if (!text) {
        displayMessage("テキストがありません", true);
        return;
    }
    navigator.clipboard.writeText(text);
    window.open(`${url.replace("TEXT", encodeURIComponent(text))}`);
}

function crosspostToFacebook() {
    let text = getTweetText().trim();
    if (!URL.canParse(text)) {
        displayMessage("FacebookはURLのみ共有できます", true);
        return;
    }
    navigator.clipboard.writeText(text);
    window.open(`http://www.facebook.com/share.php?u=${encodeURIComponent(text)}`);
}

function copyToClipboard() {
    let text = getTweetText().trim();
    if (!text) {
        displayMessage("テキストがありません", true);
        return;
    }
    navigator.clipboard.writeText(text);
    displayMessage("テキストをクリップボードにコピーしました！", false);
}

function loadSettings() {
    btn_bluesky = (localStorage.getItem("btn_bluesky") ?? "true") == "true";
    btn_threads = (localStorage.getItem("btn_threads") ?? "true") == "true";
    btn_mastodon = (localStorage.getItem("btn_mastodon") ?? "true") == "true";
    ins_mastodon = localStorage.getItem("ins_mastodon") ?? D_INS_MASTODON;
    btn_misskey = (localStorage.getItem("btn_misskey") ?? "false") == "true";
    ins_misskey = localStorage.getItem("ins_misskey") ?? D_INS_MISSKEY;
    btn_facebook = (localStorage.getItem("btn_facebook") ?? "true") == "true";
    btn_line = (localStorage.getItem("btn_line") ?? "true") == "true";
    btn_fiicen = (localStorage.getItem("btn_fiicen") ?? "true") == "true";
    btn_substitute = (localStorage.getItem("btn_substitute") ?? "true") == "true";
    btn_clipboard = (localStorage.getItem("btn_clipboard") ?? "true") == "true";
}

function setupButton() {
    btn_bluesky = confirm("Blueskyで共有ボタン");
    btn_threads = confirm("Threadsで共有ボタン");
    btn_mastodon = confirm("Mastodonで共有ボタン");
    if (btn_mastodon) ins_mastodon = prompt("Mastodonのインスタンス", ins_mastodon);
    if (ins_mastodon.slice(0, 8) != "https://") ins_mastodon = `https://${ins_mastodon}`;
    if (ins_mastodon.slice(-1) == "/") ins_mastodon = ins_mastodon.slice(0, -1);
    btn_misskey = confirm("Misskeyで共有ボタン");
    if (btn_misskey) ins_misskey = prompt("Misskeyのインスタンス", ins_misskey);
    if (ins_misskey.slice(0, 8) != "https://") ins_misskey = `https://${ins_misskey}`;
    if (ins_misskey.slice(-1) == "/") ins_misskey = ins_misskey.slice(0, -1);
    btn_facebook = confirm("Facebookボタン");
    btn_line = confirm("LINEで共有ボタン");
    btn_fiicen = confirm("Fiicenで共有ボタン");
    btn_substitute = confirm("代用表記レンダラーボタン");
    btn_clipboard = confirm("クリップボードにコピーボタン");

    localStorage.setItem("btn_bluesky", btn_bluesky);
    localStorage.setItem("btn_threads", btn_threads);
    localStorage.setItem("btn_mastodon", btn_mastodon);
    if (btn_mastodon) localStorage.setItem("ins_mastodon", ins_mastodon);
    localStorage.setItem("btn_misskey", btn_misskey);
    if (btn_misskey) localStorage.setItem("ins_misskey", ins_misskey);
    localStorage.setItem("btn_facebook", btn_facebook);
    localStorage.setItem("btn_line", btn_line);
    localStorage.setItem("btn_fiicen", btn_fiicen);
    localStorage.setItem("btn_substitute", btn_substitute);
    localStorage.setItem("btn_clipboard", btn_clipboard);
}

function helpButton() {
    alert("画像について\n" +
          "共有ボタンはテキストのみを共有するので、画像を貼り付けたければテキストを共有してから画像を貼り付けてください");
    alert("リロードされてテキストが消えてしまったら\n" +
          "共有ボタンを押すときにテキストがクリップボードにもコピーされるので、本文に貼り付ければ復元できます");
    if (btn_fiicen) {
        alert("Fiicenに共有するには\n" +
              "テキストがクリップボードにコピーされるので、「サークルを飛ばす」を押して貼り付けてください");
    }
}

setInterval(() => {
    //ツールバーの取得
    let toolbar = document.querySelectorAll('div[data-testid="toolBar"]');
    if (toolbar.length == 0) return;

    for (let i = 0; i < toolbar.length; i++) {
        if (toolbar[i].getAttribute("data-second") == "true") continue;
        toolbar[i].setAttribute("data-second", "true");
        let toolbarlist = toolbar[i].querySelector('div[data-testid="ScrollSnap-List"]');

        //設定の読み込み
        loadSettings();

        //スマホ判定
        isPhone = navigator.userAgent.match(/iPhone|Android.+Mobile/);

        //新規ツールバーの作成
        let toolbar2 = toolbarlist.cloneNode(false);
        toolbar2.setAttribute("data-testid", "toolBar2");
        toolbar2.style.marginLeft = "-8px";

        //ボタンの取得
        let btn = toolbarlist.firstElementChild.nextElementSibling.cloneNode(true);
        btn = btn.firstElementChild;
        btn.style.backgroundColor = "#fff";
        btn.style.borderRadius = "0";
        btn = btn.parentNode;
        let newBtn;

        //Blueskyで共有ボタンの作成
        if (btn_bluesky) {
            newBtn = btn.cloneNode(true);
            newBtn = newBtn.firstElementChild;
            newBtn.setAttribute("aria-label", "Blueskyで共有");
            newBtn.setAttribute("data-testid", "BlueskyButton");
            newBtn.querySelector("svg").style.color = "#0285FF";
            newBtn.querySelector("path").setAttribute("d", "M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z");
            newBtn.onclick = () => { crosspost("https://bsky.app/intent/compose?text=TEXT"); }
            toolbar2.appendChild(newBtn.parentNode);
        }

        //Threadsで共有ボタンの作成
        if (btn_threads) {
            newBtn = btn.cloneNode(true);
            newBtn = newBtn.firstElementChild;
            newBtn.setAttribute("aria-label", "Threadsで共有");
            newBtn.setAttribute("data-testid", "ThreadsButton");
            newBtn.querySelector("svg").style.color = "#000000";
            newBtn.querySelector("path").setAttribute("d", "M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z");
            newBtn.onclick = () => { crosspost("https://www.threads.net/intent/post?text=TEXT"); }
            toolbar2.appendChild(newBtn.parentNode);
        }

        //Mastodonで共有ボタンの作成
        if (btn_mastodon) {
            newBtn = btn.cloneNode(true);
            newBtn = newBtn.firstElementChild;
            newBtn.setAttribute("aria-label", "Mastodonで共有");
            newBtn.setAttribute("data-testid", "MastodonButton");
            newBtn.querySelector("svg").style.color = "#6364FF";
            newBtn.querySelector("path").setAttribute("d", "M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z");
            newBtn.onclick = () => { crosspost(`${localStorage.getItem("ins_mastodon") ?? D_INS_MASTODON}/share?text=TEXT`); }
            toolbar2.appendChild(newBtn.parentNode);
        }

        //Misskeyで共有ボタンの作成
        if (btn_misskey) {
            newBtn = btn.cloneNode(true);
            newBtn = newBtn.firstElementChild;
            newBtn.setAttribute("aria-label", "Misskeyで共有");
            newBtn.setAttribute("data-testid", "MisskeyButton");
            newBtn.querySelector("svg").style.color = "#A1CA03";
            newBtn.querySelector("path").setAttribute("d", "M8.91 16.892c-1.039.003-1.931-.63-2.352-1.366c-.225-.322-.67-.437-.676 0v2.014q0 1.215-.876 2.1q-.85.86-2.078.86q-1.2 0-2.077-.86A2.93 2.93 0 0 1 0 17.54V6.46q0-.936.526-1.695a2.86 2.86 0 0 1 1.402-1.088a2.9 2.9 0 0 1 1-.177q1.353 0 2.253 1.063l2.997 3.515c.067.05.263.437.732.437c.47 0 .692-.386.758-.437l2.972-3.515Q13.567 3.5 14.918 3.5q.501 0 1.001.177a2.73 2.73 0 0 1 1.377 1.088q.55.758.55 1.695v11.08q0 1.215-.875 2.1q-.852.86-2.078.86q-1.201 0-2.078-.86a2.93 2.93 0 0 1-.85-2.1v-2.014c-.05-.55-.531-.204-.702 0c-.45.843-1.313 1.361-2.352 1.366M21.448 8.61q-1.05 0-1.802-.733q-.726-.759-.726-1.822c0-1.063.242-1.307.726-1.796a2.44 2.44 0 0 1 1.802-.758q1.05 0 1.803.758q.75.735.75 1.796q0 1.063-.75 1.822q-.751.732-1.803.733m.025.507q1.05 0 1.777.758q.75.759.751 1.822v6.248q0 1.064-.75 1.821a2.4 2.4 0 0 1-1.778.734q-1.05 0-1.802-.733a2.5 2.5 0 0 1-.75-1.822v-6.248a2.5 2.5 0 0 1 .75-1.822a2.44 2.44 0 0 1 1.802-.758");
            newBtn.onclick = () => { crosspost(`${localStorage.getItem("ins_misskey") ?? D_INS_MISSKEY}/share?text=TEXT`); }
            toolbar2.appendChild(newBtn.parentNode);
        }

        //Facebookで共有ボタンの作成
        if (btn_facebook) {
            newBtn = btn.cloneNode(true);
            newBtn = newBtn.firstElementChild;
            newBtn.setAttribute("aria-label", "Facebookで共有");
            newBtn.setAttribute("data-testid", "FacebookButton");
            newBtn.querySelector("svg").style.color = "#0866FF";
            newBtn.querySelector("path").setAttribute("d", "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z");
            newBtn.onclick = crosspostToFacebook;
            toolbar2.appendChild(newBtn.parentNode);
        }

        //LINEで共有ボタンの作成
        if (btn_line) {
            newBtn = btn.cloneNode(true);
            newBtn = newBtn.firstElementChild;
            newBtn.setAttribute("aria-label", "LINEで共有");
            newBtn.setAttribute("data-testid", "LINEButton");
            newBtn.querySelector("svg").style.color = "#fff";
            newBtn.querySelector("svg").style.width = "24px";
            newBtn.querySelector("svg").style.height = "24px";
            newBtn.querySelector("svg").style.padding = "4px";
            newBtn.querySelector("svg").style.borderRadius = "4px";
            newBtn.querySelector("svg").style.backgroundColor = "#00C300";
            newBtn.querySelector("path").setAttribute("d", "M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314");
            if (isPhone) {
                newBtn.onclick = () => { crosspost("https://line.me/R/share?text=TEXT"); }
            }
            else {
                newBtn.onclick = () => { crosspost("https://social-plugins.line.me/lineit/share?text=TEXT"); }
            }
            toolbar2.appendChild(newBtn.parentNode);
        }

        //Fiicenで共有ボタンの作成
        if (btn_fiicen) {
            newBtn = btn.cloneNode(true);
            newBtn = newBtn.firstElementChild;
            newBtn.setAttribute("aria-label", "Fiicenで共有");
            newBtn.setAttribute("data-testid", "FiicenButton");
            let fiicenIcon = document.createElement("img");
            fiicenIcon.src = "https://lh3.googleusercontent.com/d/1H0FzsNLNVoZs9OydPv70VxQ4SMfG8odz";
            fiicenIcon.alt = "Fiicen";
            fiicenIcon.style.width = "20px";
            fiicenIcon.style.height = "20px";
            newBtn.firstElementChild.firstElementChild.before(fiicenIcon);
            newBtn.querySelector("svg").remove();
            newBtn.onclick = () => { crosspost("https://fiicen.jp"); }
            toolbar2.appendChild(newBtn.parentNode);
        }

        btn.remove();
        btn = toolbarlist.firstElementChild.nextElementSibling;

        //代用表記レンダラーボタンの作成
        if (btn_substitute) {
            newBtn = btn.cloneNode(true);
            newBtn = newBtn.firstElementChild;
            newBtn.setAttribute("aria-label", "代用表記レンダラー");
            newBtn.setAttribute("data-testid", "SubstituteButton");
            newBtn.querySelector("svg").remove();
            newBtn.querySelector("span").textContent = "代";
            newBtn.onclick = () => { crosspost("https://toracatman.github.io/SubstituteRenderer/?text=TEXT"); }
            toolbar2.appendChild(newBtn.parentNode);
        }

        //クリップボードにコピーボタンの作成
        if (btn_clipboard) {
            newBtn = btn.cloneNode(true);
            newBtn = newBtn.firstElementChild;
            newBtn.setAttribute("aria-label", "クリップボードにコピー");
            newBtn.setAttribute("data-testid", "CopyToClipboardButton");
            newBtn.querySelector("svg").innerHTML = '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2"/></g>';
            newBtn.onclick = copyToClipboard;
            toolbar2.appendChild(newBtn.parentNode);
        }

        //設定ボタンの作成
        newBtn = btn.cloneNode(true);
        newBtn = newBtn.firstElementChild;
        newBtn.setAttribute("aria-label", "設定");
        newBtn.setAttribute("data-testid", "SetupButton");
        newBtn.querySelector("svg").innerHTML = '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065"/><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0"/></g>';
        newBtn.onclick = setupButton;
        toolbar2.appendChild(newBtn.parentNode);

        //ヘルプボタンの作成
        newBtn = btn.cloneNode(true);
        newBtn = newBtn.firstElementChild;
        newBtn.setAttribute("aria-label", "ヘルプ");
        newBtn.setAttribute("data-testid", "HelpButton");
        newBtn.querySelector("svg").innerHTML = '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9 5v.01"/><path d="M12 13.5a1.5 1.5 0 0 1 1-1.5a2.6 2.6 0 1 0-3-4"/></g>';
        newBtn.onclick = helpButton;
        toolbar2.appendChild(newBtn.parentNode);

        //新規ツールバーの追加
        toolbar[i].after(toolbar2);
    }
}, 100);
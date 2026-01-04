// ==UserScript==
// @name         Crosspost from Threads
// @namespace    https://lit.link/toracatman
// @version      2025-07-12
// @description  Threads から 他の SNS に 半自動的に 同時投稿します。
// @author       トラネコマン
// @match        https://www.threads.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @sandbox      DOM
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542219/Crosspost%20from%20Threads.user.js
// @updateURL https://update.greasyfork.org/scripts/542219/Crosspost%20from%20Threads.meta.js
// ==/UserScript==

function getThreadText() {
    return Array.from(document.querySelectorAll('div[data-lexical-editor="true"] p'))
        .map(textContent => {
        return textContent.innerText
    }).join("\n");
}


let btn_twitter;
let btn_bluesky;
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
    div.style.zIndex = "100";
    div.style.width = "100%";
    div.style.backgroundColor = error ? "#f00" : "#008000";
    div.style.color = "#fff";
    div.style.textAlign = "center";
    div.textContent = text;
    document.body.appendChild(div);
    setTimeout(() => { div.remove(); }, 3000);
}

function crosspost(url) {
    let text = getThreadText().trim();
    if (!text) {
        displayMessage("テキストがありません", true);
        return;
    }
    navigator.clipboard.writeText(text);
    window.open(`${url.replace("TEXT", encodeURIComponent(text))}`);
}

function crosspostToFacebook() {
    let text = getThreadText().trim();
    if (!URL.canParse(text)) {
        displayMessage("FacebookはURLのみ共有できます", true);
        return;
    }
    navigator.clipboard.writeText(text);
    window.open(`http://www.facebook.com/share.php?u=${encodeURIComponent(text)}`);
}

function copyToClipboard() {
    let text = getThreadText().trim();
    if (!text) {
        displayMessage("テキストがありません", true);
        return;
    }
    navigator.clipboard.writeText(text);
    displayMessage("テキストをクリップボードにコピーしました！", false);
}

function loadSettings() {
    btn_twitter = (localStorage.getItem("btn_twitter") ?? "true") == "true";
    btn_bluesky = (localStorage.getItem("btn_bluesky") ?? "true") == "true";
    btn_mastodon = (localStorage.getItem("btn_mastodon") ?? "true") == "true";
    ins_mastodon = localStorage.getItem("ins_mastodon") ?? D_INS_MASTODON;
    btn_misskey = (localStorage.getItem("btn_misskey") ?? "true") == "true";
    ins_misskey = localStorage.getItem("ins_misskey") ?? D_INS_MISSKEY;
    btn_facebook = (localStorage.getItem("btn_facebook") ?? "true") == "true";
    btn_line = (localStorage.getItem("btn_line") ?? "true") == "true";
    btn_fiicen = (localStorage.getItem("btn_fiicen") ?? "true") == "true";
    btn_substitute = (localStorage.getItem("btn_substitute") ?? "true") == "true";
    btn_clipboard = (localStorage.getItem("btn_clipboard") ?? "true") == "true";
}

function setupButton() {
    btn_twitter = confirm("Twitterで共有ボタン");
    btn_bluesky = confirm("Blueskyで共有ボタン");
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

    localStorage.setItem("btn_twitter", btn_twitter);
    localStorage.setItem("btn_bluesky", btn_bluesky);
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
    let toolbar = document.querySelectorAll('div[data-lexical-editor="true"]');
    if (toolbar.length == 0) return;

    for (let i = 0; i < toolbar.length; i++) {
        let tb = toolbar[i].parentNode.nextElementSibling;
        if (toolbar[i].getAttribute("data-second") == "true") continue;
        toolbar[i].setAttribute("data-second", "true");

        //設定の読み込み
        loadSettings();

        //スマホ判定
        isPhone = navigator.userAgent.match(/iPhone|Android.+Mobile/);

        //新規ツールバーの作成
        let toolbar2 = tb.cloneNode(false);
        toolbar2.style.flexWrap = "wrap";

        //ボタンの取得
        let btn = tb.firstElementChild.cloneNode(true);
        btn = btn.firstElementChild;
        btn.style.backgroundColor = "#fff";
        btn.style.borderRadius = "0";
        btn = btn.parentNode;
        let newBtn;

        //Twitterで共有ボタンの作成
        if (btn_twitter) {
            newBtn = btn.cloneNode(true);
            newBtn.firstElementChild.title = "Twitterで共有";
            newBtn.firstElementChild.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#1DA1F2" d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 0 0 2.048-2.578a9.3 9.3 0 0 1-2.958 1.13a4.66 4.66 0 0 0-7.938 4.25a13.23 13.23 0 0 1-9.602-4.868c-.4.69-.63 1.49-.63 2.342A4.66 4.66 0 0 0 3.96 9.824a4.65 4.65 0 0 1-2.11-.583v.06a4.66 4.66 0 0 0 3.737 4.568a4.7 4.7 0 0 1-2.104.08a4.66 4.66 0 0 0 4.352 3.234a9.35 9.35 0 0 1-5.786 1.995a10 10 0 0 1-1.112-.065a13.2 13.2 0 0 0 7.14 2.093c8.57 0 13.255-7.098 13.255-13.254q0-.301-.014-.602a9.5 9.5 0 0 0 2.323-2.41z"/></svg>';
            newBtn.onclick = () => { crosspost("https://x.com/intent/post?text=TEXT"); }
            toolbar2.appendChild(newBtn);
        }

        //Blueskyで共有ボタンの作成
        if (btn_bluesky) {
            newBtn = btn.cloneNode(true);
            newBtn.firstElementChild.title = "Blueskyで共有";
            newBtn.firstElementChild.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#0285FF" d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565C.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479c.815 2.736 3.713 3.66 6.383 3.364q.204-.03.415-.056q-.207.033-.415.056c-3.912.58-7.387 2.005-2.83 7.078c5.013 5.19 6.87-1.113 7.823-4.308c.953 3.195 2.05 9.271 7.733 4.308c4.267-4.308 1.172-6.498-2.74-7.078a9 9 0 0 1-.415-.056q.21.026.415.056c2.67.297 5.568-.628 6.383-3.364c.246-.828.624-5.79.624-6.478c0-.69-.139-1.861-.902-2.206c-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8"/></svg>';
            newBtn.onclick = () => { crosspost("https://bsky.app/intent/compose?text=TEXT"); }
            toolbar2.appendChild(newBtn);
        }

        //Mastodonで共有ボタンの作成
        if (btn_mastodon) {
            newBtn = btn.cloneNode(true);
            newBtn.firstElementChild.title = "Mastodonで共有";
            newBtn.firstElementChild.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#6364FF" d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127C.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611c.118 1.24.325 2.47.62 3.68c.55 2.237 2.777 4.098 4.96 4.857c2.336.792 4.849.923 7.256.38q.398-.092.786-.213c.585-.184 1.27-.39 1.774-.753a.06.06 0 0 0 .023-.043v-1.809a.05.05 0 0 0-.02-.041a.05.05 0 0 0-.046-.01a20.3 20.3 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.6 5.6 0 0 1-.319-1.433a.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546c.376 0 .75 0 1.125-.01c1.57-.044 3.224-.124 4.768-.422q.059-.011.11-.024c2.435-.464 4.753-1.92 4.989-5.604c.008-.145.03-1.52.03-1.67c.002-.512.167-3.63-.024-5.545m-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976c-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35c-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102q0-1.965 1.011-3.12c.696-.77 1.608-1.164 2.74-1.164c1.311 0 2.302.5 2.962 1.498l.638 1.06l.638-1.06c.66-.999 1.65-1.498 2.96-1.498c1.13 0 2.043.395 2.74 1.164q1.012 1.155 1.012 3.12z"/></svg>';
            newBtn.onclick = () => { crosspost(`${localStorage.getItem("ins_mastodon") ?? D_INS_MASTODON}/share?text=TEXT`); }
            toolbar2.appendChild(newBtn);
        }

        //Misskeyで共有ボタンの作成
        if (btn_misskey) {
            newBtn = btn.cloneNode(true);
            newBtn.firstElementChild.title = "Misskeyで共有";
            newBtn.firstElementChild.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#A1CA03" d="M8.91 16.892c-1.039.003-1.931-.63-2.352-1.366c-.225-.322-.67-.437-.676 0v2.014q0 1.215-.876 2.1q-.85.86-2.078.86q-1.2 0-2.077-.86A2.93 2.93 0 0 1 0 17.54V6.46q0-.936.526-1.695a2.86 2.86 0 0 1 1.402-1.088a2.9 2.9 0 0 1 1-.177q1.353 0 2.253 1.063l2.997 3.515c.067.05.263.437.732.437c.47 0 .692-.386.758-.437l2.972-3.515Q13.567 3.5 14.918 3.5q.501 0 1.001.177a2.73 2.73 0 0 1 1.377 1.088q.55.758.55 1.695v11.08q0 1.215-.875 2.1q-.852.86-2.078.86q-1.201 0-2.078-.86a2.93 2.93 0 0 1-.85-2.1v-2.014c-.05-.55-.531-.204-.702 0c-.45.843-1.313 1.361-2.352 1.366M21.448 8.61q-1.05 0-1.802-.733q-.726-.759-.726-1.822c0-1.063.242-1.307.726-1.796a2.44 2.44 0 0 1 1.802-.758q1.05 0 1.803.758q.75.735.75 1.796q0 1.063-.75 1.822q-.751.732-1.803.733m.025.507q1.05 0 1.777.758q.75.759.751 1.822v6.248q0 1.064-.75 1.821a2.4 2.4 0 0 1-1.778.734q-1.05 0-1.802-.733a2.5 2.5 0 0 1-.75-1.822v-6.248a2.5 2.5 0 0 1 .75-1.822a2.44 2.44 0 0 1 1.802-.758"/></svg>';
            newBtn.onclick = () => { crosspost(`${localStorage.getItem("ins_misskey") ?? D_INS_MISSKEY}/share?text=TEXT`); }
            toolbar2.appendChild(newBtn);
        }

        //Facebookで共有ボタンの作成
        if (btn_facebook) {
            newBtn = btn.cloneNode(true);
            newBtn.firstElementChild.title = "Facebookで共有";
            newBtn.firstElementChild.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#0866FF" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978c.401 0 .955.042 1.468.103a9 9 0 0 1 1.141.195v3.325a9 9 0 0 0-.653-.036a27 27 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.7 1.7 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103l-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647"/></svg>';
            newBtn.onclick = crosspostToFacebook;
            toolbar2.appendChild(newBtn);
        }

        //LINEで共有ボタンの作成
        if (btn_line) {
            newBtn = btn.cloneNode(true);
            newBtn.firstElementChild.title = "LINEで共有";
            newBtn.firstElementChild.innerHTML = '<div style="display: inline-block; width: 24px; height: 24px; border-radius: 4px; background-color: #00C300;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" style="margin: 4px;" viewBox="0 0 24 24"><path fill="#fff" d="M19.365 9.863a.631.631 0 0 1 0 1.261H17.61v1.125h1.755a.63.63 0 1 1 0 1.259h-2.386a.63.63 0 0 1-.627-.629V8.108c0-.345.282-.63.63-.63h2.386a.63.63 0 0 1-.003 1.26H17.61v1.125zm-3.855 3.016a.63.63 0 0 1-.631.627a.62.62 0 0 1-.51-.25l-2.443-3.317v2.94a.63.63 0 0 1-1.257 0V8.108a.627.627 0 0 1 .624-.628c.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63c.345 0 .63.285.63.63zm-5.741 0a.63.63 0 0 1-.631.629a.63.63 0 0 1-.627-.629V8.108c0-.345.282-.63.63-.63c.346 0 .628.285.628.63zm-2.466.629H4.917a.634.634 0 0 1-.63-.629V8.108c0-.345.285-.63.63-.63c.348 0 .63.285.63.63v4.141h1.756a.63.63 0 0 1 0 1.259M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608c.391.082.923.258 1.058.59c.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645c1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg></div>';
            if (isPhone) {
                newBtn.onclick = () => { crosspost("https://line.me/R/share?text=TEXT"); }
            }
            else {
                newBtn.onclick = () => { crosspost("https://social-plugins.line.me/lineit/share?text=TEXT"); }
            }
            toolbar2.appendChild(newBtn);
        }

        //Fiicenで共有ボタンの作成
        if (btn_fiicen) {
            newBtn = btn.cloneNode(true);
            newBtn.firstElementChild.title = "Fiicenで共有";
            newBtn.firstElementChild.innerHTML = '<img src="https://lh3.googleusercontent.com/d/1H0FzsNLNVoZs9OydPv70VxQ4SMfG8odz" alt="Fiicen" style="width: 20px; height: 20px;">';
            newBtn.onclick = () => { crosspost("https://fiicen.jp"); }
            toolbar2.appendChild(newBtn);
        }

        btn.remove();
        btn = tb.firstElementChild;

        //代用表記レンダラーボタンの作成
        if (btn_substitute) {
            newBtn = btn.cloneNode(true);
            newBtn.firstElementChild.title = "代用表記レンダラー";
            newBtn.firstElementChild.innerHTML = '<span style="font-size: 16px; font-weight: bold; line-height: 1; vertical-align: top;">代</span>';
            newBtn.onclick = () => { crosspost("https://toracatman.github.io/SubstituteRenderer/?text=TEXT"); }
            toolbar2.appendChild(newBtn);
        }

        //クリップボードにコピーボタンの作成
        if (btn_clipboard) {
            newBtn = btn.cloneNode(true);
            newBtn.firstElementChild.title = "クリップボードにコピー";
            newBtn.firstElementChild.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2"/></g></svg>';
            newBtn.onclick = copyToClipboard;
            toolbar2.appendChild(newBtn);
        }

        //設定ボタンの作成
        newBtn = btn.cloneNode(true);
        newBtn.firstElementChild.title = "設定";
        newBtn.firstElementChild.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065"/><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0"/></g></svg>';
        newBtn.onclick = setupButton;
        toolbar2.appendChild(newBtn);

        //ヘルプボタンの作成
        newBtn = btn.cloneNode(true);
        newBtn.firstElementChild.title = "ヘルプ";
        newBtn.firstElementChild.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9 5v.01"/><path d="M12 13.5a1.5 1.5 0 0 1 1-1.5a2.6 2.6 0 1 0-3-4"/></g></svg>';
        newBtn.onclick = helpButton;
        toolbar2.appendChild(newBtn);

        //新規ツールバーの追加
        tb.after(toolbar2);
    }
}, 100);
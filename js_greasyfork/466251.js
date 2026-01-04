// ==UserScript==
// @name            osaka-auth
// @name:en         Osaka University Login Redesigned
// @name:ja         阪大ログイン画面再設計版
// @name:zh         大阪大学登录界面重新设计版
// @namespace       https://yocjyet.dev/
// @version         3.0.0
// @author          Yo Cjyet
// @description:en  Improve login UI of the authentication system of Osaka University to allow password autocompletion and redesigned on the theme of Sci-Fi to fit modern style.
// @description:ja  阪大のログイン画面をSF風に再設計し、パスワード管理ソフトの自動記入不能の問題を修正した。
// @description:zh  改善大阪大学认证系统的登录界面，允许密码自动完成，并在科幻主题上重新设计，以适应现代风格。
// @license         MIT
// @icon            https://www.osaka-u.ac.jp/favicon.ico
// @match           https://ou-idp.auth.osaka-u.ac.jp/idp/*
// @description Improve login UI of the authentication system of Osaka University to allow password autocompletion and redesigned on the theme of Sci-Fi to fit modern style.
// @downloadURL https://update.greasyfork.org/scripts/466251/osaka-auth.user.js
// @updateURL https://update.greasyfork.org/scripts/466251/osaka-auth.meta.js
// ==/UserScript==

(function () {
  'use strict';

  (function() {
    const HTML = `<main>
  <h1>
    <svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 116.131 114.063">
      <path
        fill="currentColor"
        d="M115.627 48.364C112.563 25.037 95.65 6.081 73.418 0L58.065 15.351c19.595 0 35.952 13.871 39.79 32.33C81.611 49.536 67.4 58.079 58.064 70.514c-9.336-12.43-23.547-20.978-39.791-22.834 3.84-18.459 20.195-32.33 39.792-32.33L42.713 0C20.479 6.081 3.572 25.037.501 48.364A58.564 58.564 0 0 0 0 55.997c0 3.463.318 6.849.901 10.145A40.585 40.585 0 0 1 18.5 65.3c13.604 2.325 24.9 11.405 30.311 23.673a40.08 40.08 0 0 1 2.366 7.076c.698 2.99 1.081 6.1 1.081 9.302 0 2.849-.295 5.631-.853 8.319-.032.134-.065.262-.098.393h13.511c-.025-.131-.065-.259-.094-.393a40.822 40.822 0 0 1-.854-8.319c0-3.202.385-6.31 1.082-9.302a40.355 40.355 0 0 1 2.366-7.076c5.409-12.268 16.706-21.35 30.308-23.673a40.632 40.632 0 0 1 17.604.842c.58-3.296.9-6.682.9-10.145a58.043 58.043 0 0 0-.503-7.633z"
      />
    </svg>
    大阪大学
  </h1>

  <form name="login-form" method="post" action="/idp/authnPwd">
    <div class="input" title="大阪大学個人ID">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"
        ><path
          d="M231.937 211.986a120.486 120.486 0 0 0-67.12-54.142a72 72 0 1 0-73.633 0a120.488 120.488 0 0 0-67.12 54.14a8 8 0 1 0 13.85 8.013a104.037 104.037 0 0 1 180.174.002a8 8 0 1 0 13.849-8.013zM72 96a56 56 0 1 1 56 56a56.064 56.064 0 0 1-56-56z"
          fill="currentColor"
        /></svg
      >
      <input type="text" id="username" name="USER_ID" autocomplete="username" />
    </div>
    <div class="input" title="パスワード">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
        ><path
          d="M127.994 112a27.998 27.998 0 0 0-8 54.83V184a8 8 0 1 0 16 0v-17.17a27.998 27.998 0 0 0-8-54.83zm0 40a12 12 0 1 1 12-12a12.014 12.014 0 0 1-12 12zm80-72h-108V52a28 28 0 1 1 56 0a8 8 0 0 0 16 0a44 44 0 1 0-88 0v28h-36a16.018 16.018 0 0 0-16 16v112a16.018 16.018 0 0 0 16 16h160a16.018 16.018 0 0 0 16-16V96a16.018 16.018 0 0 0-16-16zm0 128h-160V96h160l.01 112z"
          fill="currentColor"
        /></svg
      >
      <input type="password" id="password" name="USER_PASSWORD" autocomplete="current-password" />
    </div>
    <button id="login" title="ログイン" type="submit">LOGIN</button>
    <input type="hidden" name="IDButton" value="ログイン" />
    <input type="hidden" name="CHECK_BOX" value="" />
  </form>
  <form name="otp-form" method="post" action="/idp/otpAuth">
    <div class="input" title="MFA認証コード">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"
        ><path
          fill="currentColor"
          d="m11 23.18l-2-2.001l-1.411 1.41L11 26l6-6l-1.41-1.41L11 23.18zM28 30h-4v-2h4V16h-4V8a4.005 4.005 0 0 0-4-4V2a6.007 6.007 0 0 1 6 6v6h2a2.002 2.002 0 0 1 2 2v12a2.002 2.002 0 0 1-2 2z"
        /><path
          fill="currentColor"
          d="M20 14h-2V8A6 6 0 0 0 6 8v6H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V16a2 2 0 0 0-2-2ZM8 8a4 4 0 0 1 8 0v6H8Zm12 20H4V16h16Z"
        /></svg
      >
      <input
        type="text"
        id="authcode"
        name="OTP_CODE"
        autocomplete="off"
        maxlength="7"
        pattern="[0-9][0-9][0-9] ?[0-9][0-9][0-9]"
        required
        placeholder="000 000"
      />
    </div>
    <div>
      <input type="checkbox" id="remember" name="STORE_OTP_AUTH_RESULT" checked />
      <label for="remember" title="このデバイスで30日間認証不要">
        <span class="custom-checkbox">
          <svg class="unchecked" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
            ><path
              fill="currentColor"
              d="M7.483 5.26A2.486 2.486 0 0 0 5.29 7.422a39.402 39.402 0 0 0 0 9.154a2.486 2.486 0 0 0 2.193 2.163c2.977.333 6.057.333 9.034 0a2.486 2.486 0 0 0 2.192-2.163c.256-2.185.328-4.386.216-6.58a.2.2 0 0 1 .059-.152l1.038-1.04a.198.198 0 0 1 .339.125a40.903 40.903 0 0 1-.162 7.822c-.215 1.836-1.69 3.275-3.516 3.48a42.5 42.5 0 0 1-9.366 0c-1.827-.205-3.302-1.644-3.516-3.48a40.903 40.903 0 0 1 0-9.504c.214-1.837 1.69-3.275 3.516-3.48a42.502 42.502 0 0 1 9.366 0a3.989 3.989 0 0 1 1.76.64a.19.19 0 0 1 .025.295l-.803.803a.211.211 0 0 1-.25.033a2.488 2.488 0 0 0-.898-.28a41.001 41.001 0 0 0-9.034 0Z"
            /><path
              fill="currentColor"
              d="M21.03 6.03a.75.75 0 1 0-1.06-1.06l-8.47 8.47l-2.47-2.47a.75.75 0 1 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l9-9Z"
            /></svg
          >

          <svg class="checked" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
            ><path
              fill="currentColor"
              d="M7.317 3.769a42.502 42.502 0 0 1 9.366 0a4 4 0 0 1 2.82 1.667L11.5 13.439l-2.47-2.47a.75.75 0 1 0-1.06 1.061l3 3a.75.75 0 0 0 1.06 0l8.116-8.115c.022.11.04.22.053.333c.37 3.157.37 6.346 0 9.504c-.215 1.836-1.69 3.275-3.516 3.48a42.5 42.5 0 0 1-9.366 0c-1.827-.205-3.302-1.644-3.516-3.48a40.903 40.903 0 0 1 0-9.504c.214-1.837 1.69-3.275 3.516-3.48Z"
            /></svg
          >
        </span>
        Remember for 30 days
      </label>
    </div>
    <button id="auth" title="認証" type="submit">AUTHENTICATE</button>
    <button class="outline" id="kaijo" title="MFA一時解除">DISABLE MFA</button>
  </form>
  <form name="error" onsubmit="return false;">
    <h2 id="error-title">認証エラー</h2>
    <p id="error-text">
      ログインできません。「大阪大学個人ID」または「パスワード」が誤っている可能性があります。<br /><br
      />＊「大阪大学個人ID」 のアルファベットは必ず小文字を入力してください (大文字を使用するとエラーになります)。
    </p>
    <button title="戻る" id="error-return">RETURN</button>
  </form>

  <div class="actions">
    <a href="https://web.auth.osaka-u.ac.jp/portal/" target="_blank" title="ポータルサイト">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"
        ><path
          d="M151.965 215.992v-64h-48v64L39.97 216V115.539a8 8 0 0 1 2.618-5.92l79.994-72.734a8 8 0 0 1 10.764 0l80.005 72.734a8 8 0 0 1 2.619 5.92V216z"
          opacity=".2"
          fill="currentColor"
        /><path
          d="M239.97 208h-16v-92.461a16.037 16.037 0 0 0-5.236-11.839l-80.006-72.735a15.936 15.936 0 0 0-21.527 0L37.207 103.7a16.034 16.034 0 0 0-5.236 11.839V208h-16a8 8 0 1 0 0 16h224a8 8 0 0 0 0-16zm-192-92.462l79.995-72.734l80.006 72.735V208h-48.006v-48.008a16.018 16.018 0 0 0-16-16h-32a16.018 16.018 0 0 0-16 16V208H47.97zM143.966 208h-32v-48.008h32z"
          fill="currentColor"
        /></svg
      ></a
    >
    <a
      href="https://web.auth.osaka-u.ac.jp/portal/ja/security_contact.html"
      target="_blank"
      title="情報セキュリティに関する連絡先"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"
        ><path
          d="M32 128v56a16 16 0 0 0 16 16h16a16 16 0 0 0 16-16v-40a16 16 0 0 0-16-16z"
          opacity=".2"
          fill="currentColor"
        /><path
          d="M225.456 128h-32a16 16 0 0 0-16 16v40a16 16 0 0 0 16 16h16a16 16 0 0 0 16-16z"
          opacity=".2"
          fill="currentColor"
        /><path
          d="M202.72 54.188A103.282 103.282 0 0 0 129.464 24l-.735.002l-.736-.002A104 104 0 0 0 24 128v56a24.027 24.027 0 0 0 24 24h16a24.027 24.027 0 0 0 24-24v-40a24.027 24.027 0 0 0-24-24H40.355a88.02 88.02 0 0 1 88.313-79.998h.12A88.017 88.017 0 0 1 217.1 120h-23.645a24.027 24.027 0 0 0-24 24v40a24.027 24.027 0 0 0 24 24h16a23.894 23.894 0 0 0 8-1.376V208a24.027 24.027 0 0 1-24 24H136a8 8 0 0 0 0 16h57.456a40.046 40.046 0 0 0 40-40v-80a103.283 103.283 0 0 0-30.735-73.813zM64 136a8.01 8.01 0 0 1 8 8v40a8.01 8.01 0 0 1-8 8H48a8.01 8.01 0 0 1-8-8v-48zm145.456 56h-16a8.01 8.01 0 0 1-8-8v-40a8.01 8.01 0 0 1 8-8h24v48a8.01 8.01 0 0 1-8 8z"
          fill="currentColor"
        /></svg
      >
    </a>
    <a
      href="https://web.auth.osaka-u.ac.jp/portal/ja/okomariguide.html"
      target="_blank"
      title="ログインにお困りの場合はこちら"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"
        ><circle cx="128.002" cy="128" r="96" opacity=".2" fill="currentColor" /><path
          d="M128.002 24a104 104 0 1 0 104 104a104.118 104.118 0 0 0-104-104zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88zm12-36a12 12 0 1 1-12-12a12 12 0 0 1 12 12zm24-71.995a36.065 36.065 0 0 1-28 35.104v.896a8 8 0 0 1-16 0v-8a8 8 0 0 1 8-8a20 20 0 1 0-20-20a8 8 0 0 1-16 0a36 36 0 1 1 72 0z"
          fill="currentColor"
        /></svg
      >
    </a>
  </div>
</main>
`;
    const CSS = `@import url('https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@300;400;500&display=swap');

:root {
  --color-background: #16163e;
  --color-primary: #2b2b7b;
  --color-primary-light: #382c83;
  --color-primary-lighter: #257c8e;
  --color-secondary: #1ba493;
  --color-highlight: hwb(164 7% 20%);
  --color-accent: #07f49e;
  --color-desaturated: #506d6a;

  font-family: 'Kiwi Maru', sans-serif;
  font-size: 18px;
  color-scheme: light dark;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;

  --drop-shadow: drop-shadow(0 0 3px rgba(17, 204, 153, 0.5));
  --brightness: brightness(1.12);
  --box-shadow-focus: 0 0 1em rgba(0, 0, 0, 0.25), 0 0 3em rgba(17, 204, 153, 0.1);
}

* {
  box-sizing: border-box;
}

html {
  background: linear-gradient(-45deg, var(--color-background) 0%, var(--color-primary) 100%);
}

body {
  color: var(--color-highlight);
  margin: 0;
  display: grid;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

body.error {
  filter: hue-rotate(195deg) saturate(1.5) brightness(0.8) contrast(2);
  background: linear-gradient(-45deg, rgba(62, 5, 10, 1) 0%, rgba(113, 5, 29, 1) 100%);
}

body.error button {
  background: var(--color-secondary);
  color: black;
  filter: drop-shadow(0 0 3px rgba(17, 204, 153, 0.5));
}

body.error main {
  border: 2px solid var(--color-secondary);
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  margin: 0 auto;
  max-width: 25rem;
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.18);
  padding: 1.8em 3.1em;
  border-radius: 0.5em;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.25), 0 0 5em rgba(17, 204, 153, 0.1), inset 0 0 3em rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  text-shadow: 0 0 0.5em rgba(17, 204, 153, 0.2);
}

svg,
button,
input {
  filter: var(--drop-shadow);
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 0.2em 0;
}
.logo {
  width: 5rem;
}

h2#error-title {
  font-size: 1.2em;
  font-weight: 400;
  margin: 0;
}

p#error-text {
  font-size: 0.8em;
  font-weight: 300;
  margin: 0;
  margin-bottom: 1em;
  text-align: center;
}

button,
input {
  color: inherit;
  font-size: inherit;
  font-family: inherit;
}

button {
  width: 100%;
  background: linear-gradient(90deg, var(--color-secondary) 0%, var(--color-accent) 100%);
  color: white;
  border: none;
  border-radius: 0.25em;
  padding: 0.8em 0;
  font-weight: bold;
  transition: all 0.1s ease-in-out;
  cursor: pointer;
}
button:focus {
  outline: none;
  filter: var(--drop-shadow) var(--brightness);
  transform: scale(1.01);
  box-shadow: var(--box-shadow-focus);
}
button:hover {
  filter: var(--drop-shadow) var(--brightness);
  transform: scale(1.01);
}

button.outline {
  background: transparent;
  border: 1px solid var(--color-secondary);
  color: var(--color-secondary);
  transition: all 0.1s ease-in-out;
}

.input {
  display: flex;
  align-items: center;
  gap: 0.5em;
  border: 1px solid var(--color-secondary);
  padding: 0.85em 0.5em;
  border-radius: 0.25em;
  color: var(--color-secondary);
  transition: all 0.1s ease-in-out;
  width: 100%;
}
.input > svg {
  width: 1.5em;
  height: 1.5em;
}
.input > input {
  border: none;
  background: transparent;
  width: 100%;
}

.input:focus-within {
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
}
.input > input:focus {
  outline: none;
}
.input:hover {
  border: 1px solid var(--color-highlight);
  color: var(--color-highlight);
}

input::placeholder {
  color: var(--color-desaturated);
}

.actions {
  color: var(--color-primary-lighter);
  display: flex;
  align-items: center;
  gap: 1.2em;
  padding: 0.1em;
}
.actions > a,
.actions > a:visited {
  color: inherit;
  transition: all 0.1s ease-in-out;
}
.actions > a:hover {
  color: var(--color-highlight);
}
.actions > a:focus {
  outline: none;
  color: var(--color-accent);
  transform: scale(1.1);
}

input[type='checkbox'] {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}
input[type='checkbox'] + label {
  display: flex;
  align-items: center;
  gap: 0.5em;
  cursor: pointer;
  --checked: none;
  --unchecked: block;
}

input[type='checkbox']:checked + label {
  --checked: block;
  --unchecked: none;
}

input[type='checkbox'] + label > .custom-checkbox > .checked {
  display: var(--checked);
}
input[type='checkbox'] + label > .custom-checkbox > .unchecked {
  display: var(--unchecked);
}

.custom-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5em;
  cursor: pointer;
}

form {
  display: none;
}

td[bgcolor='#FFFFFF'] {
  display: none;
}

table.style_table2 td.style_td {
  padding: 0.25em;
}

table.style_table2 th[colspan='5'] {
  padding: 0.5em 0;
  font-size: large;
  font-weight: bold;
}

div[align='center'] > br {
  display: none;
}

div[align='center'] {
  padding: 1em 0;
}

button#ok {
  width: 100%;
  background: linear-gradient(90deg, var(--color-secondary) 0%, var(--color-accent) 100%);
  color: white;
  border: none;
  border-radius: 0.25em;
  padding: 0.8em 0;
  font-weight: bold;
  transition: all 0.1s ease-in-out;
  cursor: pointer;
}
`;
    const STYLES = document.querySelectorAll('link[rel="stylesheet"]');
    for (const style of [...STYLES]) {
      style.remove();
    }
    function addStyle(css) {
      const style = document.createElement("style");
      style.innerHTML = css;
      document.head.appendChild(style);
    }
    addStyle(`
      body > *:not(main) {
        display: none;
      }
  `);
    const ICON_URL = "https://www.osaka-u.ac.jp/favicon.ico";
    const ICON_LINK = document.createElement("link");
    ICON_LINK.setAttribute("rel", "icon");
    ICON_LINK.setAttribute("type", "image/png");
    ICON_LINK.setAttribute("href", ICON_URL);
    document.head.appendChild(ICON_LINK);
    const main = document.createElement("main");
    document.body.appendChild(main);
    main.outerHTML = HTML;
    addStyle(CSS);
    function displayForm(formName) {
      for (let i = 0; i < document.forms.length; i++) {
        const form = document.forms[i];
        form.style.display = form.name === formName ? "contents" : "none";
      }
    }
    const h2 = document.querySelector("table h2");
    const FORMS = {
      ログイン: "login-form",
      MFA認証コード入力: "otp-form",
      Login: "login-form",
      "Enter MFA code": "otp-form"
    };
    const errorH1 = document.querySelector("h1.errorh1");
    if (errorH1 !== null && errorH1.textContent) {
      const errorTitle = errorH1.textContent.trim();
      const errorTable = errorH1.nextElementSibling;
      if (errorTable === null) {
        console.error("Error table not found");
        return;
      }
      const errorRows = errorTable.querySelectorAll("tr");
      const errorText = errorRows[0].innerHTML.trim();
      document.querySelector("h2#error-title").textContent = errorTitle;
      document.querySelector("p#error-text").innerHTML = errorText;
      const returnButton = document.querySelector("button#error-return");
      const errorReturn = errorTable.querySelector("a");
      if (errorReturn) {
        const returnHref = errorReturn.href.trim();
        const match = /sentHref\('(.*)'\)/.exec(returnHref);
        if (match && match.length > 1) {
          const link = match[1];
          returnButton.addEventListener("click", () => {
            window.sentHref(link);
          });
        } else {
          console.error("Error return link href is invalid");
          returnButton.style.display = "none";
          return;
        }
      } else {
        console.error("Return link not found");
        returnButton.style.display = "none";
      }
      document.body.classList.add("error");
      displayForm("error");
      return;
    }
    if (h2 === null) {
      const form = document.querySelector('form[name="cmdForm"]');
      if (form !== null) {
        const main2 = document.querySelector("main");
        main2.appendChild(form);
        form.style.display = "block";
        return;
      }
      console.error("h2 not found");
      return;
    }
    function isValidFormTitle(title) {
      return title in FORMS;
    }
    const formTitle = h2.textContent.trim();
    if (!isValidFormTitle(formTitle)) {
      console.error("unknown form: " + h2.textContent.trim());
      return;
    }
    displayForm(FORMS[formTitle]);
    const otpForm = document.querySelector('form[name="otp-form"]');
    otpForm == null ? void 0 : otpForm.addEventListener("submit", () => {
      const authcode = document.getElementById("authcode");
      authcode.value = authcode.value.replace(/ /g, "");
      const remember = document.getElementById("remember");
      if (remember.checked) {
        remember.value = "1";
      } else {
        remember.value = "0";
      }
      return true;
    });
  })();

})();
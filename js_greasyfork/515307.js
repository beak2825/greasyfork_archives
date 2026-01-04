// ==UserScript==
// @name         Aspark Members: Plaintext username/password POST warning, skip 2FA & Disable Right‑Click hijack
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Show login-warning modal with raw credentials (persists after redirect); bypass the pointless 2FA/question page — because it’s useless and broken; enable right‑click/text selection. Urgent: the site has multiple other glaring vulnerabilities.
// @match        https://aspmembers.com/members/*
// @license      Unlicense
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515307/Aspark%20Members%3A%20Plaintext%20usernamepassword%20POST%20warning%2C%20skip%202FA%20%20Disable%20Right%E2%80%91Click%20hijack.user.js
// @updateURL https://update.greasyfork.org/scripts/515307/Aspark%20Members%3A%20Plaintext%20usernamepassword%20POST%20warning%2C%20skip%202FA%20%20Disable%20Right%E2%80%91Click%20hijack.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const URLS = {
    LOGIN: "https://aspmembers.com/members/index.php",
    QUESTION: "https://aspmembers.com/members/index_question.php",
    MAIN: "https://aspmembers.com/members/top.php",
    BASE: "https://aspmembers.com/members/",
    CONTRIBUTION: "https://aspmembers.com/members/document/contribution_upper.php",
  };

  const HIDE_KEY = "aspark_hide_modal_v4";
  const PENDING_KEY = "aspark_pending_modal_v4";

  const isLogin = () =>
    location.href.startsWith(URLS.LOGIN) ||
    location.href === URLS.BASE ||
    location.href.startsWith(URLS.BASE + "?");
  const isQuestion = () => location.href.startsWith(URLS.QUESTION);
  const isContribution = () => location.href.startsWith(URLS.CONTRIBUTION);

  const escapeHtml = (s = "") =>
    s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function showModal({ login, pwd }) {
    if (localStorage.getItem(HIDE_KEY) === "1") return;

    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2147483646,
    });

    overlay.innerHTML = `
      <div style="max-width:520px;padding:14px;background:#fff;border-radius:8px;font-family:system-ui;font-size:13px;color:#111">
        <strong>⚠️ Security notice</strong>
        <p style="margin:.5em 0">This page sends your credentials as plain text — anyone can read them. Aspark were told, ignored it and swept it under the carpet. Urgent: there are more glaring issues (example: PHPSESSID is visible and sent over the request, no X-Frame-Options, no Referrer-Policy and the like). BTW, did you know login details and documents uploaded to the aspmembers portal were leaked unencrypted/unhashed in early 2025?</p>
        <pre style="white-space:pre-wrap;border:1px solid #eee;padding:8px;border-radius:6px">login: ${escapeHtml(login)}\npassword: ${escapeHtml(pwd)}</pre>
        <label style="display:inline-flex;align-items:center;gap:6px;margin-top:6px">
          <input type="checkbox" id="asp-hide"> Don't show again
        </label>
        <div style="text-align:right;margin-top:10px">
          <button id="asp-ok" style="padding:6px 10px;background:#007bff;color:#fff;border:none;border-radius:6px">OK</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    const close = () => {
      if (overlay.querySelector("#asp-hide").checked) localStorage.setItem(HIDE_KEY, "1");
      localStorage.removeItem(PENDING_KEY);
      overlay.remove();
    };

    overlay.querySelector("#asp-ok").onclick = close;
    document.addEventListener("keydown", (e) => e.key === "Escape" && close());
  }

  async function onLoginSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const lid = form.querySelector('[name="lid"]')?.value || "";
    const pwd = form.querySelector('[name="pwd"]')?.value || "";

    // Save for next page and show immediately
    const data = { login: lid, pwd };
    localStorage.setItem(PENDING_KEY, JSON.stringify(data));
    showModal(data);

    try {
      const resp = await fetch(URLS.LOGIN, {
        method: "POST",
        body: new FormData(form),
        credentials: "include",
      });
      if (resp.url.startsWith(URLS.QUESTION)) location.replace(URLS.MAIN);
      else form.submit();
    } catch {
      form.submit();
    }
  }

  function enableRightClick() {
    const b = document.body;
    if (!b) return;
    b.setAttribute("oncontextmenu", "return true;");
    b.setAttribute("onselectstart", "return true;");
  }

  function init() {
    if (isLogin()) {
      const form = document.querySelector("form");
      if (form) form.addEventListener("submit", onLoginSubmit);
    } else if (isQuestion()) {
      location.replace(URLS.MAIN);
    }
    if (isContribution()) enableRightClick();

    // Re-show modal if pending
    const data = localStorage.getItem(PENDING_KEY);
    if (data) {
      try {
        showModal(JSON.parse(data));
      } catch {
        localStorage.removeItem(PENDING_KEY);
      }
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

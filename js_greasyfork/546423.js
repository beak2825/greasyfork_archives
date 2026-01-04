// ==UserScript==
// @name         SecureMyPass Barebones Bot
// @namespace    https://securemypass.com/
// @version      0.1
// @description  Simple loop: login → my-links → export
// @match        https://securemypass.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546423/SecureMyPass%20Barebones%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/546423/SecureMyPass%20Barebones%20Bot.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if (window.__SMP_BARE__) return;
  window.__SMP_BARE__ = true;

  // --- UI ---
  const box = document.createElement('div');
  box.style = `
    position:fixed;bottom:20px;right:20px;z-index:999999;
    background:#111;color:#eee;padding:10px;border:1px solid #333;border-radius:6px;
    font:13px/1.4 system-ui;width:260px
  `;
  box.innerHTML = `
    <h3 style="margin:0 0 6px;font-size:14px">SMP Bare Bot</h3>
    <label>Number of Accounts</label>
    <input id="smpCount" type="number" value="1" min="1" style="width:100%;margin:4px 0"/>
    <div id="smpCreds"></div>
    <button id="smpStart" style="margin-top:6px;width:100%">Start</button>
    <div id="smpLog" style="margin-top:6px;font-size:12px;color:#aaa">Idle</div>
  `;
  document.body.appendChild(box);

  const el = (id) => box.querySelector(id);
  const log = (m) => el('#smpLog').textContent = m;

  const renderCreds = () => {
    const n = parseInt(el('#smpCount').value || '1', 10);
    const wrap = el('#smpCreds');
    wrap.innerHTML = '';
    for (let i=0;i<n;i++) {
      wrap.innerHTML += `
        <div style="border:1px solid #333;padding:4px;margin:4px 0;border-radius:4px">
          <div>Account ${i+1}</div>
          <input class="smpUser" type="text" placeholder="Username" style="width:100%"/>
          <input class="smpPass" type="password" placeholder="Password" style="width:100%"/>
        </div>
      `;
    }
  };
  renderCreds();
  el('#smpCount').addEventListener('input', renderCreds);

  // --- Main flow (no helpers, just one-liners + waits) ---
  const sleep = (ms) => new Promise(r=>setTimeout(r,ms));

  async function runForAccount(username,password) {
    log("Typing username…");
    document.evaluate('//*[@id="loginUsername"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = username;
    await sleep(500);

    log("Clicking continue…");
    document.evaluate('//*[@id="root"]/div[1]/main/div/div/div/div/div[1]/div/form/div[2]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
    await sleep(1500);

    log("Typing password…");
    document.evaluate('//*[@id="loginPassword"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = password;
    await sleep(500);

    log("Clicking login…");
    document.evaluate('//*[@id="root"]/div[1]/main/div/div/div/div/div[1]/div/form/div[2]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
    await sleep(3000);

    log("Going to My Links…");
    location.href = "https://securemypass.com/my-links";
    await new Promise(r=>window.addEventListener('load',()=>r(),{once:true}));
    await sleep(1500);

    log("Clicking Export…");
    document.evaluate('//*[@id=":r3s:"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
    await sleep(2000);

    log("Done for this account.");
  }

  // --- Button action ---
  el('#smpStart').onclick = async () => {
    const users = [...box.querySelectorAll('.smpUser')].map(i=>i.value.trim());
    const passes = [...box.querySelectorAll('.smpPass')].map(i=>i.value);
    for (let i=0;i<users.length;i++) {
      log(`Running account ${i+1}/${users.length}`);
      try { await runForAccount(users[i], passes[i]); }
      catch(e){ console.error(e); log("Error: "+e.message); }
      await sleep(5000); // wait before next account
    }
    log("All done.");
  };

})();
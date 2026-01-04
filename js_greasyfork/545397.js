// ==UserScript==
// @name         AHC Visualizer → AtCoder CustomTest Runner (fixed responseText guards)
// @namespace    idk
// @version      1.2
// @description  textarea#input の内容を AtCoder custom_test に送信。responseText を安全に扱う修正版。
// @match        https://img.atcoder.jp/ahc*
// @match        https://atcoder.jp/contests/*/custom_test
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        unsafeWindow
// @connect      atcoder.jp
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545397/AHC%20Visualizer%20%E2%86%92%20AtCoder%20CustomTest%20Runner%20%28fixed%20responseText%20guards%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545397/AHC%20Visualizer%20%E2%86%92%20AtCoder%20CustomTest%20Runner%20%28fixed%20responseText%20guards%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const ENC = encodeURIComponent;
  const TOKEN_KEY = 'ahc_csrf_token_v1';
  const CONTEST_KEY = 'ahc_contest_slug_v1';

  // save token/contest when on atcoder custom_test page
  if (location.host === 'atcoder.jp' && /\/contests\/[^/]+\/custom_test/.test(location.pathname)) {
    try {
      let token = (typeof unsafeWindow !== 'undefined' && unsafeWindow.csrfToken) ? unsafeWindow.csrfToken : null;
      if (!token) {
        const el = document.querySelector('input[name="csrf_token"]');
        if (el) token = el.value;
      }
      const contest = location.pathname.split('/')[2] || null;
      if (token) GM_setValue(TOKEN_KEY, token);
      if (contest) GM_setValue(CONTEST_KEY, contest);
      console.log('AHC Runner: saved token/contest', { token: !!token, contest });
    } catch (e) {
      console.warn('AHC Runner: failed to save token', e);
    }
    return;
  }

  GM_addStyle(`
    #ahc-mini { position: fixed; right:12px; top:12px; width:420px; max-width:86vw; z-index:2147483647;
      background:#fff; border:1px solid #ddd; padding:10px; border-radius:8px; box-shadow:0 6px 18px rgba(0,0,0,0.12);}
    #ahc-mini textarea{ width:100%; box-sizing:border-box; font-family:monospace; font-size:12px; resize:vertical;}
    #ahc-mini .status{ font-size:12px; margin-top:6px; color:#333; word-break:break-word;}
  `);

  const root = document.createElement('div');
  root.id = 'ahc-mini';
  // 1. root.innerHTML は一旦言語selectの中身だけ空にしておく
  root.innerHTML = `
  <div style="font-weight:700;margin-bottom:6px">AHC Visualizer → AtCoder Runner</div>
  <div>
    <label style="font-size:12px">Language:</label>
    <select id="ahc-lang" style="margin-left:6px;">
      <option>Loading...</option>
    </select>
  </div>
  <textarea id="ahc-code" placeholder="Paste your source code here (required)" rows="8"></textarea>
  <div style="margin-top:6px;">
    <button id="ahc-run" style="font-size:110%">Run</button>
    <button id="ahc-open" style="margin-left:6px">Open Code Test</button>
  </div>
  <div class="status" id="ahc-status">Initializing...</div>
`;

  // 2. 言語リストを取得してセレクトを更新する関数
  async function updateLanguageSelect(contest) {
    const langSel = document.getElementById('ahc-lang');
    langSel.innerHTML = ''; // 一旦クリア

    const langs = await fetchAllowedLanguages(contest);
    if (!langs || Object.keys(langs).length === 0) {
      langSel.innerHTML = '<option>Failed to get languages</option>';
      return;
    }

    for (const [id, name] of Object.entries(langs)) {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = name + ' — ' + id;
      langSel.appendChild(option);
    }
  }

  // 3. スクリプト初期化時に contest を推測 or 保存値から取り出し言語を読み込む
  (async () => {
    const t = await GM_getValue(TOKEN_KEY);
    let c = await GM_getValue(CONTEST_KEY) || guessContestFromImg();
    if (!c) {
      statusEl.textContent = 'Cannot guess contest. Please open custom_test page once.';
      return;
    }
    await updateLanguageSelect(c);

    if (t && c) statusEl.textContent = `Token acquired (contest=${c}). Contents of #input will be sent as stdin.`;
    else statusEl.textContent = 'Token not acquired: Please open custom_test page once (auto open possible).';
  })();

  document.body.appendChild(root);

  const statusEl = document.getElementById('ahc-status');
  const runBtn = document.getElementById('ahc-run');
  const openBtn = document.getElementById('ahc-open');
  const codeTa = document.getElementById('ahc-code');
  const langSel = document.getElementById('ahc-lang');

  function guessContestFromImg() {
    const m = location.href.match(/img\.atcoder\.jp\/([^\/?#/]+)/);
    return m ? m[1] : null;
  }

  async function ensureTokenAndContest(timeout = 30000) {
    let token = await GM_getValue(TOKEN_KEY);
    let contest = await GM_getValue(CONTEST_KEY);
    if (!contest) {
      const g = guessContestFromImg();
      if (g) { contest = g; await GM_setValue(CONTEST_KEY, contest); }
    }
    if (token && contest) return { token, contest };

    const guessed = contest || guessContestFromImg();
    if (!guessed) {
      statusEl.textContent = 'Cannot guess contest. Check URL.';
      throw new Error('contest slug not found');
    }

    statusEl.textContent = 'Token not acquired: Opening custom_test in new tab (manual ok)';
    try { GM_openInTab(`https://atcoder.jp/contests/${guessed}/custom_test`, { active:false, insert:true }); }
    catch (e) { statusEl.textContent = 'Auto open blocked. Please open manually.'; }

    const start = Date.now();
    while (Date.now() - start < timeout) {
      token = await GM_getValue(TOKEN_KEY);
      contest = await GM_getValue(CONTEST_KEY);
      if (token && contest) { statusEl.textContent = 'Token acquired. Ready to run.'; return { token, contest }; }
      await sleep(400);
    }
    statusEl.textContent = 'Token acquisition timed out. Please open custom_test page once.';
    throw new Error('token timeout');
  }

  async function fetchAllowedLanguages(contest) {
    const url = `https://atcoder.jp/contests/${contest}/custom_test`;
    return await new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        onload: res => {
          try {
            const respText = String(res.responseText ?? "");
            const doc = new DOMParser().parseFromString(respText, 'text/html');
            const sel = doc.querySelector('select[name="data.LanguageId"], select#language, select[name="LanguageId"]');
            if (!sel) return resolve({});
            const opts = Array.from(sel.options).map(o => ({ id: o.value, text: o.textContent.trim() }));
            const map = {};
            opts.forEach(o => { if (o.id) map[o.id] = o.text; });
            resolve(map);
          } catch (e) { resolve({}); }
        },
        onerror: () => resolve({})
      });
    });
  }

  function findOutputElem() {
    return document.getElementById('output') || document.querySelector('textarea[name="output"], textarea#output, textarea.output') ||
      document.querySelector('[contenteditable="true"], pre, code');
  }

  async function submitAndPoll({contest, token, languageId, sourceCode, inputText}) {
    const allowed = await fetchAllowedLanguages(contest);
    console.log('allowed languages:', allowed);
    if (allowed && Object.keys(allowed).length > 0 && !allowed[languageId]) {
      const firstId = Object.keys(allowed)[0];
      statusEl.textContent = `Selected language not allowed. Automatically switching to ${allowed[firstId]} (${firstId}).`;
      languageId = firstId;
      langSel.value = languageId;
    }

    const submitUrl = `https://atcoder.jp/contests/${contest}/custom_test/submit/json`;
    const resultUrl = `https://atcoder.jp/contests/${contest}/custom_test/json?reload=true`;
    const body = `data.LanguageId=${ENC(languageId)}&sourceCode=${ENC(sourceCode)}&input=${ENC(inputText)}&csrf_token=${ENC(token)}`;

    statusEl.textContent = 'Sending...';
    const postPreview = String(body ?? "").slice(0, 1200);
    console.log('[AHC Runner] POST body preview', postPreview);
    await new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: submitUrl,
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
        data: body,
        onload: r => {
          const resp = String(r.responseText ?? "");
          console.log('[AHC Runner] POST response', r.status, resp.slice(0, 400));
          if (r.status >= 400) return reject(new Error('submit HTTP ' + r.status + ': ' + resp));
          if (resp && /言語.*許可/.test(resp)) return reject(new Error(resp));
          resolve(r);
        },
        onerror: e => reject(new Error('submit failed: ' + e))
      });
    });

    statusEl.textContent = 'Running (polling)...';
    const start = Date.now();
    const TIMEOUT = 2 * 60 * 1000;
    while (true) {
      if (Date.now() - start > TIMEOUT) throw new Error('Result retrieval timeout');
      const data = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: resultUrl,
          onload: r => {
            const resp = String(r.responseText ?? "");
            try { resolve(JSON.parse(resp)); } catch (e) { resolve({}); }
          },
          onerror: e => reject(e)
        });
      });
      console.log('[AHC Runner] poll:', data);
      if (data && ('Interval' in data)) {
        await sleep(Math.max(200, Number(data.Interval) || 500));
        continue;
      }
      if (!data || !('Result' in data)) { await sleep(300); continue; }
      return data;
    }
  }

  runBtn.addEventListener('click', async () => {
    runBtn.disabled = true;
    statusEl.textContent = 'Preparing...';
    try {
      const { token, contest } = await ensureTokenAndContest(30000);
      let languageId = String(langSel.value || '4003');
      const sourceCode = codeTa.value || '';
      if (!sourceCode.trim()) { alert('Please input source code'); runBtn.disabled = false; return; }

      const inputElem = document.getElementById('input');
      if (!inputElem) { alert('textarea#input not found'); runBtn.disabled = false; return; }
      await sleep(80);
      const inputText = inputElem.value || '';
      console.log('[AHC Runner] inputText preview:', String(inputText).slice(0, 800));
      if (!inputText && !confirm('textarea#input is empty. Run with empty input?')) { runBtn.disabled = false; return; }

      const result = await submitAndPoll({ contest, token, languageId, sourceCode, inputText });

      const stdout = (typeof result.Stdout !== 'undefined') ? String(result.Stdout) : '';
      const stderr = (typeof result.Stderr !== 'undefined') ? String(result.Stderr) : '';
      const exit = result.Result && result.Result.ExitCode;
      const time = result.Result && result.Result.TimeConsumption;

      const outEl = findOutputElem();
      if (outEl) {
        if ('value' in outEl) {
          outEl.value = stdout;
          outEl.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
          outEl.textContent = stdout;
        }
      } else {
        console.log('[AHC Runner] stdout:', stdout.slice(0, 800));
      }

      statusEl.textContent = `Finished: exit=${exit} time=${time}ms stderr=${stderr ? 'present' : 'none'}`;
    } catch (err) {
      console.error('[AHC Runner] error', err);
      statusEl.textContent = 'Error: ' + (err && err.message ? err.message : err);
      alert('An error occurred during execution. Check the console.');
    } finally {
      runBtn.disabled = false;
    }
  });

  openBtn.addEventListener('click', () => {
    const g = guessContestFromImg();
    if (!g) { alert('Cannot guess contest'); return; }
    window.open(`https://atcoder.jp/contests/${g}/custom_test`, '_blank');
  });

  (async () => {
    const t = await GM_getValue(TOKEN_KEY);
    const c = await GM_getValue(CONTEST_KEY) || guessContestFromImg();
    if (t && c) statusEl.textContent = `Token acquired (contest=${c}). Contents of #input will be sent as stdin.`;
    else statusEl.textContent = 'Token not acquired: Please open custom_test page once (auto open possible).';
  })();

  function addCopyButton(textarea) {
    if (!textarea) return;

    const label = document.querySelector(`label[for="${textarea.id}"]`);

    // ラベルとボタンを同じ行に配置
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.gap = '6px'; // ラベルとボタンの間隔

    if (label) {
      textarea.parentNode.insertBefore(header, label);
      header.appendChild(label);
    } else {
      textarea.parentNode.insertBefore(header, textarea);
    }

    const btn = document.createElement('button');
    btn.textContent = 'Copy';
    btn.type = 'button';
    btn.style.padding = '1px 6px 1px 6px';
    btn.style.margin = '1px';

    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(textarea.value).then(() => {
        btn.textContent = 'Copied';
        setTimeout(() => { btn.textContent = 'Copy'; }, 1000);
      }).catch(() => {
        alert('failed to copy');
      });
    });

    header.appendChild(btn);

    // textarea をラベル・ボタンの下に配置
    header.insertAdjacentElement('afterend', textarea);
  }

  window.addEventListener('load', () => {
    addCopyButton(document.getElementById('input'));
    addCopyButton(document.getElementById('output'));
  });

})();

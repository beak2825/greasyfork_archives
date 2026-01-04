// ==UserScript==
// @name         Poe.com Auto-Register Bot
// @namespace    http://tampermonkey.net/
// @version      6.1
// @description  Adds a stylish korean menu to Poe.com for automatic registration, persistent progress, reliable logout, and random domain selection.
// @author       anonimbiri
// @match        https://poe.com/*
// @match        https://edumail.icu/*
// @icon         data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><radialGradient id='g' cx='50%' cy='50%' r='60%'><stop stop-color='%23ff4da6'/><stop offset='60%' stop-color='%239a5cff'/><stop offset='100%' stop-color='%233aa3ff'/></radialGradient></defs><circle cx='32' cy='32' r='30' fill='url(%23g)'/><path d='M16 36c8-10 24-10 32 0' stroke='%23fff' stroke-width='3' fill='none' stroke-linecap='round' opacity='.9'/></svg>
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_addValueChangeListener
// @grant        window.close
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/538635/Poecom%20Auto-Register%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/538635/Poecom%20Auto-Register%20Bot.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ===============================================================================================
  // SABİTLER & DURUM
  // ===============================================================================================
  const CONFIG_KEY = 'anonimbiri_config';
  const PROGRESS_KEY = 'anonimbiri_progress_state';
  const POS_KEY = 'anonimbiri_ui_pos';
  let isProcessing = false;
  let currentLanguage = 'en';

  // ===============================================================================================
  // ÇEVİRİLER
  // ===============================================================================================
  const translations = {
    en: {
      title: 'Account Manager',
      subtitle: 'Hallyu Aurora · by anonimbiri',
      progress: 'Progress',
      status: 'Status',
      completed: 'Ready',
      processing: 'Processing...',
      error: 'Error occurred',
      redirectUrl: 'Redirect URL',
      cleanExit: 'Clean Exit (Logout)',
      logoutCreate: 'Logout & Create New',
      registerNew: 'Create New Account',
      openTempEmail: 'Open Temp Email'
    },
    tr: {
      title: 'Hesap Yöneticisi',
      subtitle: 'Hallyu Aurora · by anonimbiri',
      progress: 'İlerleme',
      status: 'Durum',
      completed: 'Hazır',
      processing: 'İşleniyor...',
      error: 'Hata oluştu',
      redirectUrl: 'Yönlendirme URL',
      cleanExit: 'Temiz Çıkış (Çıkış Yap)',
      logoutCreate: 'Çıkış Yap & Yeni Oluştur',
      registerNew: 'Yeni Hesap Oluştur',
      openTempEmail: 'Geçici E‑posta Aç'
    },
    ja: {
      title: 'アカウントマネージャー',
      subtitle: 'ハルリュ・オーロラ · by anonimbiri',
      progress: '進行状況',
      status: 'ステータス',
      completed: '準備完了',
      processing: '処理中...',
      error: 'エラーが発生しました',
      redirectUrl: 'リダイレクトURL',
      cleanExit: 'クリーンイグジット（ログアウト）',
      logoutCreate: 'ログアウト＆新規作成',
      registerNew: '新しいアカウントを作成',
      openTempEmail: '仮メールを開く'
    },
    ko: {
      title: '계정 관리자',
      subtitle: '할류 오로라 · by anonimbiri',
      progress: '진행률',
      status: '상태',
      completed: '준비됨',
      processing: '처리 중...',
      error: '오류 발생',
      redirectUrl: '리디렉션 URL',
      cleanExit: '깨끗한 종료 (로그아웃)',
      logoutCreate: '로그아웃 & 새로 만들기',
      registerNew: '새 계정 만들기',
      openTempEmail: '임시 이메일 열기'
    }
  };

  function t(key) {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  }

  // ===============================================================================================
  // YARDIMCILAR
  // ===============================================================================================
  function simulateEvent(element, eventType) {
    if (!element) return;
    try {
      if (eventType === 'click' && typeof element.click === 'function') {
        element.click();
      } else {
        const event = new Event(eventType, { bubbles: true, cancelable: true });
        element.dispatchEvent(event);
      }
    } catch (e) {
      console.error(`[!] Error simulating '${eventType}' event:`, e);
    }
  }

  function simulateInput(selector, value) {
    const element = document.querySelector(selector);
    if (!element) return;
    const proto = element.tagName === 'TEXTAREA'
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
    const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    nativeSetter && nativeSetter.call(element, value);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function observeForElement(selector, parent = document, timeout = 30000) {
    return new Promise((resolve, reject) => {
      const element = parent.querySelector(selector);
      if (element) return resolve(element);

      const observer = new MutationObserver(() => {
        const el = parent.querySelector(selector);
        if (el) {
          observer.disconnect();
          clearTimeout(timer);
          resolve(el);
        }
      });

      const timer = setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);

      observer.observe(parent, { childList: true, subtree: true });
    });
  }

  async function updateProgress(percentage, statusText) {
    const progressFill = document.querySelector('.ab-progress-fill');
    const progressText = document.querySelector('.ab-progress-text');
    const statusEl = document.querySelector('.ab-status-text');

    await GM_setValue(PROGRESS_KEY, { percentage, statusText });

    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${percentage}%`;
    if (statusEl) statusEl.textContent = `${t('status')}: ${statusText}`;

    const btn = document.querySelector('.ab-action-btn:not([style*="display: none"])');
    if (percentage > 0 && percentage < 100) {
      isProcessing = true;
      if (btn) btn.classList.add('processing');
    } else {
      isProcessing = false;
      if (btn) btn.classList.remove('processing');
    }
  }

  function makeDataUriSvg(svg) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  // SVG ikonları
  const Icons = {
    close: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
    language: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>`,
    logoutCreate: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10 17l1.41-1.41L8.83 13H21v-2H8.83l2.58-2.59L10 7l-5 5 5 5zm-4 2h8v2H6c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h8v2H6v14z"/></svg>`,
    register: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15 12c2.21 0 4-1.79 4-4S17.21 4 15 4s-4 1.79-4 4 1.79 4 4 4zm-8 8v-1c0-2.21 3.58-4 8-4s8 1.79 8 4v1H7zm-2-7H2V9h3V6h3v3h3v3H8v3H5v-3z"/></svg>`,
    mail: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`
  };

  // Aurora/Hallyu SVG rozet
  function createKWaveBadgeSVG(size = 118) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 120 120">
        <defs>
          <radialGradient id="rg" cx="45%" cy="40%" r="70%">
            <stop offset="0%" stop-color="#ff4da6"/>
            <stop offset="55%" stop-color="#9a5cff"/>
            <stop offset="100%" stop-color="#3aa3ff"/>
          </radialGradient>
          <filter id="g" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6"/>
          </filter>
        </defs>
        <circle cx="60" cy="60" r="56" fill="url(#rg)"/>
        <g filter="url(#g)" opacity="0.92">
          <path d="M14,78 C36,52 84,50 106,76" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none"/>
        </g>
        <g fill="#fff" opacity="0.35">
          <circle cx="26" cy="28" r="2.2"/><circle cx="98" cy="26" r="2.2"/><circle cx="92" cy="94" r="2.2"/><circle cx="20" cy="88" r="2.2"/>
        </g>
      </svg>
    `;
  }

  // Panel arka planı (Aurora şeritleri + blur spotlar)
  function createAuroraPanelBG(w = 1000, h = 640) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <linearGradient id="a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ff4da6"/>
            <stop offset="50%" stop-color="#9a5cff"/>
            <stop offset="100%" stop-color="#3aa3ff"/>
          </linearGradient>
          <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="18"/>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="rgba(10,10,18,0.86)"/>
        <g filter="url(#blur)" opacity="0.35">
          <ellipse cx="${w*0.18}" cy="${h*0.22}" rx="${h*0.45}" ry="${h*0.28}" fill="url(#a)"/>
          <ellipse cx="${w*0.85}" cy="${h*0.18}" rx="${h*0.35}" ry="${h*0.25}" fill="url(#a)"/>
          <ellipse cx="${w*0.55}" cy="${h*0.92}" rx="${h*0.32}" ry="${h*0.26}" fill="url(#a)"/>
        </g>
        <path d="M0 ${h*0.64} C ${w*0.2} ${h*0.50}, ${w*0.55} ${h*0.86}, ${w} ${h*0.66} L ${w} ${h} L 0 ${h} Z"
              fill="url(#a)" opacity="0.18"/>
      </svg>
    `;
  }

  // SVG Kalp Parçacığı (gradient + parıltı)
  function makeHeartSVG(size = 18) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" class="kw-heart-svg" aria-hidden="true">
        <defs>
          <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff4da6"/>
            <stop offset="100%" stop-color="#3aa3ff"/>
          </linearGradient>
          <filter id="softglow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.6" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <path filter="url(#softglow)" fill="url(#hg)"
          d="M12 21s-6.716-4.297-9.192-7.144C1.264 12.13 1 10.94 1 9.94 1 7.2 3.239 5 5.98 5c1.69 0 3.2.83 4.02 2.09C10.82 5.83 12.33 5 14.02 5 16.76 5 19 7.2 19 9.94c0 1-.264 2.19-1.808 3.916C18.716 16.703 12 21 12 21z"/>
      </svg>
    `;
  }

  // ===============================================================================================
  // İŞ MANTIĞI (ALT SCRIPTTEN AYNEN)
  // ===============================================================================================
  function generateRandomUsername() {
    const koreanFirstNames = [
      'Aeri','Ahyeon','Arin','Chaeyeon','Chaeyoung','Chaewon','Dami','Dayeon','Eunbi','Eunchae','Eunha',
      'Gahyeon','Garam','Hanni','Haerin','Haseul','Heejin','Hoyeon','Huening','Hyein','Hyewon','Hyojung',
      'Hyoyeon','Irene','Isa','Jang','Jennie','Jeongyeon','Jihan','Jimin','Jisoo','Jisung','Jiwoo',
      'Jiyeon','Joohyun','Joy','Kazuha','Keeho','Kep1er','Krystal','Kyujin','Lisa','Mina','Minji',
      'Minnie','Miyeon','Nana','Nayeon','Ningning','Rei','Rose','Ryujin','Sakura','Sana','Seoyeon',
      'Seulgi','Shuhua','Somi','Soojin','Sowon','Sullyoon','Sunmi','Taeyeon','Tzuyu','Umji','Wendy',
      'Winter','Wonyoung','Xiaoting','Yeji','Yena','Yeonjun','Yeri','Yeseo','Yiren','Yoohyeon','Yoon',
      'Youngseo','Yujin','Yuna','Yunah','Yuri'
    ];
    const sexyLastNames = [
      'Angel','Babe','Belle','Bloom','Blush','Candy','Cherry','Cutie','Darling','Divine','Doll','Dream',
      'Fever','Fire','Flame','Glow','Grace','Heart','Honey','Kiss','Love','Lust','Magic','Moon','Night',
      'Pink','Pretty','Pure','Queen','Rose','Silk','Star','Sugar','Sweet','Venus','Wild','Wonder'
    ];
    let username = '';
    do {
      const firstName = koreanFirstNames[Math.floor(Math.random() * koreanFirstNames.length)];
      const lastName = sexyLastNames[Math.floor(Math.random() * sexyLastNames.length)];
      const randomNum = Math.floor(Math.random() * 9000) + 1000;
      username = `${firstName}${lastName}${randomNum}`;
    } while (username.length > 20 || username.length < 6);
    return username;
  }

  async function poeApiCall(mutationId, variables = {}) {
    return new Promise((resolve, reject) => {
      const pageWindow = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
      (pageWindow.webpackChunk_N_E = pageWindow.webpackChunk_N_E || []).push([[Math.random()], {}, (require) => {
        try {
          const { commitMutation } = require(44311);
          const { e: createEnvironment } = require(64390);
          const mutation = require(mutationId).default;
          const environment = createEnvironment();
          commitMutation(environment, {
            mutation,
            variables,
            onCompleted: resolve,
            onError: reject,
          });
        } catch (err) {
          reject(new Error(`Failed to load module ${mutationId}. Poe.com might have updated.`));
        }
      }]);
    });
  }

  async function startLogoutAndRegisterProcess() {
    if (isProcessing) return;
    const config = await GM_getValue(CONFIG_KEY, { cleanExit: false });
    await updateProgress(10, t('processing'));

    try {
      if (config.cleanExit) {
        await poeApiCall(37554);
        await updateProgress(30, t('processing'));
        await poeApiCall(54961);
        await updateProgress(50, t('processing'));
      } else {
        await poeApiCall(2634);
        await updateProgress(40, t('processing'));
      }
      await GM_setValue('startRegistrationOnLoad', true);
      await updateProgress(70, t('processing'));
      window.location.href = 'https://poe.com/login';
    } catch (error) {
      console.error('[!] Error during exit process:', error);
      await updateProgress(0, t('error'));
      await GM_setValue('startRegistrationOnLoad', true);
      window.location.href = 'https://poe.com/login';
    }
  }

  let lastPath = '';
  async function poeRouter() {
    const currentPath = window.location.pathname;
    if (currentPath === lastPath) return;
    lastPath = currentPath;

    await createSexyKoreanMenu();

    if (currentPath === '/login') {
      await mainPoeLoginScript();
    } else {
      await mainPoeHomepageScript();
    }
  }

  function observeUrlChanges() {
    lastPath = window.location.pathname;
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== lastPath) {
        poeRouter();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('popstate', poeRouter);
  }

  async function mainPoeLoginScript() {
    const shouldStart = await GM_getValue('startRegistrationOnLoad', false);
    if (shouldStart) {
      await GM_setValue('startRegistrationOnLoad', false);
      startRegistration();
    }
    GM_addValueChangeListener('tempEmail', (_, __, newVal) => {
      if (newVal) { GM_setValue('tempEmail', null); fillEmailAndSubmit(newVal); }
    });
    GM_addValueChangeListener('verificationCode', (_, __, newVal) => {
      if (newVal) { GM_setValue('verificationCode', null); fillCodeAndSubmit(newVal); }
    });
  }

  async function mainPoeHomepageScript() {
    const isNew = await GM_getValue('isNewRegistration');
    if (isNew) {
      await GM_setValue('isNewRegistration', false);
      const config = await GM_getValue(CONFIG_KEY, {});
      await updateProgress(100, t('completed'));
      setTimeout(async () => {
        await updateProgress(0, t('completed'));
        window.location.href = config.redirectUrl || 'https://poe.com/GPT-5';
      }, 1500);
    }
  }

  async function fillEmailAndSubmit(email) {
    await updateProgress(20, t('processing'));
    const emailInputSelector = 'input[type="email"]';
    await observeForElement(emailInputSelector);
    simulateInput(emailInputSelector, email);
    await updateProgress(40, t('processing'));
    const goButton = await observeForElement('button.Button_buttonBase__Bv9Vx.Button_primary__6UIn0');
    simulateEvent(goButton, 'click');
    await updateProgress(60, t('processing'));
  }

  async function fillCodeAndSubmit(code) {
    try {
      await updateProgress(70, t('processing'));
      const codeInputSelector = 'input.VerificationCodeInput_verificationCodeInput__RgX85';
      await observeForElement(codeInputSelector);
      simulateInput(codeInputSelector, code);
      await updateProgress(85, t('processing'));
      const verifyButton = await observeForElement('button.Button_buttonBase__Bv9Vx.Button_primary__6UIn0:not([disabled])');
      simulateEvent(verifyButton, 'click');
      await updateProgress(95, t('processing'));
      await GM_setValue('isNewRegistration', true);
    } catch (error) {
      console.error("[!] Error during verification code submission:", error);
      await updateProgress(0, t('error'));
    }
  }

  async function startRegistration() {
    if (isProcessing) return;
    await updateProgress(5, t('processing'));
    GM_openInTab('https://edumail.icu/', { active: true, setParent: true });
  }

  async function mainEduMailScript() {
    try {
      if (window.location.pathname === '/') await createTempEmail();
      else if (window.location.pathname.startsWith('/mailbox')) await handleMailbox();
    } catch (error) {
      console.error("[!] Error in edumail script:", error);
    }
  }

  async function createTempEmail() {
    await observeForElement('input[name="user"]');
    const newUsername = generateRandomUsername();
    simulateInput('input[name="user"]', newUsername);

    const domainListContainer = await observeForElement('div[class*="overflow-y-auto"]').catch(() => null);
    if (domainListContainer) {
      const domainLinks = domainListContainer.querySelectorAll('a[x-on\\:click*="$wire.setDomain"]');
      if (domainLinks.length > 0) {
        const randomIndex = Math.floor(Math.random() * domainLinks.length);
        simulateEvent(domainLinks[randomIndex], 'click');
      } else {
        const fallbackLink = document.querySelector('a[x-on\\:click*="gold.edu.pl"]');
        if (fallbackLink) simulateEvent(fallbackLink, 'click');
      }
    }
    simulateEvent(await observeForElement('input[type="submit"][value="Create"]'), 'click');
  }

  async function handleMailbox() {
    const emailDiv = await observeForElement('div.select-none', document, 60000);
    await GM_setValue('tempEmail', emailDiv.textContent.trim());
    const poeEmailDiv = await observeForElement("div[data-id]:has(div:first-child:not(:empty))", document, 120000);
    simulateEvent(poeEmailDiv, 'click');
    const iframe = await observeForElement('iframe.w-full', document, 15000);
    await new Promise(resolve => {
      iframe.onload = resolve;
      setTimeout(resolve, 3000);
    });
    const codeMatch = (iframe.contentDocument || iframe.contentWindow.document).body.innerText.match(/\b\d{6}\b/);
    if (codeMatch) {
      await GM_setValue('verificationCode', codeMatch[0]);
      setTimeout(() => window.close(), 1000);
    }
  }

  // ===============================================================================================
  // UI & STYLES
  // ===============================================================================================
  async function createSexyKoreanMenu() {
    if (document.getElementById('anonimbiri-sexy-container')) return;

    GM_addStyle(`
      :root{
        --kw-pink:#ff4da6;
        --kw-purple:#9a5cff;
        --kw-blue:#3aa3ff;
        --kw-ink:#0e0e16;
        --kw-border:rgba(255,255,255,0.14);
        --kw-glass:rgba(255,255,255,0.06);
        --kw-white:#fff;
        --kw-grad:linear-gradient(120deg,var(--kw-pink),var(--kw-purple),var(--kw-blue));
        --kw-neon:0 0 18px rgba(255,77,166,.55),0 0 26px rgba(58,163,255,.45);
        --kw-blur:blur(16px);
      }

      @keyframes hanbokWave {
        0%   { transform: translateY(0) rotate(0deg); filter:hue-rotate(0deg) saturate(1.1); }
        50%  { transform: translateY(-2px) rotate(1.25deg); filter:hue-rotate(10deg) saturate(1.22); }
        100% { transform: translateY(0) rotate(0deg); filter:hue-rotate(0deg) saturate(1.1); }
      }
      @keyframes seoulGlow {
        0%,100% { box-shadow: var(--kw-neon); }
        50%     { box-shadow: 0 0 26px rgba(255,77,166,.75),0 0 36px rgba(58,163,255,.65); }
      }
      @keyframes neonDrift {
        0% { background-position: 0% 50%; }
        50%{ background-position: 100% 50%; }
        100%{ background-position: 0% 50%; }
      }
      @keyframes seoulPopIn {
        0%   { transform: translateY(14px) scale(.96); opacity:0; filter: blur(6px); }
        55%  { transform: translateY(-3px) scale(1.012); }
        100% { transform: translateY(0) scale(1); opacity:1; filter: blur(0); }
      }

      #anonimbiri-sexy-container {
        position: fixed; top:16px; right:16px; z-index: 2147483647;
        user-select: none; touch-action: none;
        font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Arial, "Apple Color Emoji","Segoe UI Emoji";
        width: max-content; height: max-content;
      }

      .ab-sexy-toggle {
        width: 92px; height: 92px; border-radius: 50%;
        border: 2px solid var(--kw-border);
        background: #111528 center/cover no-repeat;
        cursor: grab; position: relative; overflow: visible;
        box-shadow: 0 10px 32px rgba(0,0,0,.5), var(--kw-neon);
        transition: transform .22s ease, box-shadow .22s ease;
        animation: hanbokWave 7s ease-in-out infinite;
      }
      .ab-sexy-toggle:active { cursor: grabbing; }
      .ab-sexy-toggle:hover{ transform: scale(1.06) rotate(1.5deg); }
      .ab-sexy-toggle .kw-ring{
        position:absolute; inset:-8px; border-radius:50%;
        border:3px solid rgba(154,92,255,.6);
        box-shadow: inset 0 0 26px rgba(154,92,255,.45), 0 0 34px rgba(58,163,255,.45);
        pointer-events:none; animation: seoulGlow 4s ease-in-out infinite;
      }

      .ab-sexy-panel {
        position: absolute; width: 460px;
        background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.025));
        border: 1px solid var(--kw-border); border-radius: 18px; padding: 14px; color: var(--kw-white);
        transform: translateY(-6px) scale(.98); opacity:0; visibility:hidden; transition: none;
        backdrop-filter: var(--kw-blur); -webkit-backdrop-filter: var(--kw-blur);
        overflow:hidden; box-shadow: 0 18px 48px rgba(0,0,0,.45), var(--kw-neon);
        will-change: transform, opacity, filter;
      }
      .ab-sexy-panel.active{
        visibility: visible;
        animation: seoulPopIn .36s cubic-bezier(.22,.95,.13,.99) forwards;
      }
      .ab-sexy-panel::before{
        content:''; position:absolute; inset:0;
        background-image: var(--kw-panel-bg, none); background-size:cover; background-position:center; opacity:.32; pointer-events:none;
      }

      .ab-close-btn {
        position:absolute; top:10px; right:10px; width:36px; height:36px; border-radius:12px;
        border:1px solid var(--kw-border);
        background: rgba(0,0,0,.25); color:#fff; cursor:pointer;
        display:flex; align-items:center; justify-content:center;
        transition: transform .18s ease, background .18s ease, box-shadow .18s ease;
      }
      .ab-close-btn:hover{ background: rgba(255,77,166,.22); transform: translateY(-1px) rotate(90deg); box-shadow: 0 0 14px rgba(255,77,166,.35); }
      .ab-close-btn svg{ width:18px; height:18px; display:block; }

      .ab-menu-header{ position:relative; margin-bottom:10px; padding: 48px 4px 0; } /* padding-top ile dil seçiminden boşluk */
      .ab-menu-title{
        font-weight:1000; letter-spacing:.4px; font-size:22px; line-height:1.25;
        background: var(--kw-grad); background-size:200% 200%;
        -webkit-background-clip:text; background-clip:text; color:transparent;
        text-shadow: 0 0 14px rgba(255,77,166,.45);
        animation: neonDrift 8s ease infinite;
      }
      .ab-menu-subtitle{ font-size:12px; color:#ffd4ea; opacity:.9; margin-top:2px; }

      .ab-language-selector{
        position:absolute; top:10px; left:10px;
        display:inline-flex; align-items:center; gap:8px;
        padding:9px 12px; border-radius: 999px; border:1px solid var(--kw-border);
        background: rgba(0,0,0,.28);
        cursor:pointer; font-size:12px; font-weight:900; text-transform:uppercase; color:#ffe6f2;
        transition: transform .18s ease, background .18s ease, box-shadow .18s ease;
        line-height:1;
      }
      .ab-language-selector:hover{ background: rgba(255,77,166,.22); transform: translateY(-1px); box-shadow: 0 0 14px rgba(255,77,166,.35); }
      .ab-language-selector svg{ width:16px; height:16px; display:block; }

      .ab-progress-section{
        position:relative; padding:14px; border-radius:14px;
        background: linear-gradient(180deg, var(--kw-glass), rgba(255,255,255,.03));
        border:1px solid var(--kw-border); margin-bottom:12px;
      }
      .ab-progress-header{ display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:8px; }
      .ab-progress-label{ color:#ffd4ea; font-weight:900; font-size:13px; letter-spacing:.2px; }
      .ab-progress-text{ font-size:12px; font-weight:900; }
      .ab-progress-bar{ width:100%; height:10px; background: rgba(255,255,255,.12); border-radius:12px; overflow:hidden; }
      .ab-progress-fill{ height:100%; width:0%; background: linear-gradient(90deg, var(--kw-pink), var(--kw-blue)); transition: width .35s ease; box-shadow: var(--kw-neon); }
      .ab-status-text{ margin-top:6px; text-align:center; font-size:12px; color:#ffd4ea; }

      .ab-form-group{ margin-bottom:12px; }
      .ab-label{ display:block; color:#ffd4ea; font-weight:900; font-size:13px; margin-bottom:6px; }
      .ab-input{
        width:100%; padding:12px 14px; border-radius:12px; border:1px solid var(--kw-border);
        background: rgba(0,0,0,.28); color:var(--kw-white);
        transition: border-color .2s ease, box-shadow .2s ease;
        box-sizing: border-box;
      }
      .ab-input:focus{ outline:none; border-color: rgba(255,77,166,.6); box-shadow: 0 0 14px rgba(255,77,166,.35); }

      .ab-checkbox-group{
        display:flex; align-items:center; gap:12px; margin-bottom:12px; padding: 12px;
        background: linear-gradient(180deg, var(--kw-glass), rgba(255,255,255,.03));
        border:1px solid var(--kw-border); border-radius:14px;
      }
      .ab-checkbox{ position: relative; width: 24px; height: 24px; cursor: pointer; }
      .ab-checkbox input[type="checkbox"]{
        opacity: 0; position: absolute; width: 100%; height: 100%; margin: 0; cursor: pointer;
      }
      .ab-checkbox-custom{
        width: 24px; height: 24px; border: 2px solid var(--kw-border);
        border-radius: 8px; background: rgba(0,0,0,.28);
        display:flex; align-items:center; justify-content:center;
        transition: all .3s ease;
      }
      .ab-checkbox input[type="checkbox"]:checked + .ab-checkbox-custom{
        background: var(--kw-grad); background-size:200% 200%;
        border-color: var(--kw-pink); box-shadow: var(--kw-neon);
        animation: neonDrift 8s ease infinite;
      }
      .ab-checkbox input[type="checkbox"]:checked + .ab-checkbox-custom::after{
        content:'✓'; color:#fff; font-size:16px; font-weight:1000; text-shadow: 0 0 5px rgba(255,255,255,.8);
      }
      .ab-checkbox-label{ font-size: 14px; color: #fff; cursor: pointer; user-select: none; font-weight: 600; }

      .ab-action-btn{
        width: 100%; margin-bottom: 10px;
        padding:12px 16px; border-radius:14px; border:1px solid var(--kw-border);
        background: linear-gradient(135deg, rgba(255,77,166,.32), rgba(58,163,255,.32));
        color:var(--kw-white); font-weight:1000; letter-spacing:.4px; cursor:pointer;
        transition: transform .15s ease, box-shadow .2s ease, opacity .2s ease;
        text-transform:uppercase;
        display:flex; align-items:center; justify-content:center; gap:10px;
      }
      .ab-action-btn:hover{ transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,77,166,.25); }
      .ab-action-btn:active{ transform: translateY(0); }
      .ab-action-btn.processing{ opacity:.6; cursor:not-allowed; }
      .ab-action-btn svg{ width:18px; height:18px; display:block; }

      .ab-menu-container.dragging{ user-select:none !important; }
      .ab-menu-container.dragging .ab-sexy-toggle { transform: scale(1.08) rotate(6deg); cursor: grabbing; }

      .floating-heart {
        position: absolute; pointer-events: none;
        animation: heartRise var(--dur,2.1s) ease-out forwards;
        will-change: transform, opacity;
        filter: drop-shadow(0 0 6px rgba(255,77,166,.6));
      }
      @keyframes heartRise {
        0%   { transform: translate(var(--x,0px), var(--y,0px)) scale(.8) rotate(0deg);   opacity: 0; }
        8%   { opacity: 1; }
        60%  { transform: translate(var(--x,0px), calc(var(--y,0px) - 36px)) scale(1.05) rotate(6deg); }
        100% { transform: translate(var(--x,0px), calc(var(--y,0px) - 64px)) scale(1) rotate(360deg); opacity: 0; }
      }
      .kw-heart-svg{ display:block; }

      @media (max-width: 480px){
        #anonimbiri-sexy-container{ top:10px; right:10px; }
        .ab-sexy-panel{ width: 92vw; }
        .ab-sexy-toggle{ width:82px; height:82px; }
      }
    `);

    // Kapsayıcı
    const container = document.createElement('div');
    container.id = 'anonimbiri-sexy-container';
    container.className = 'ab-menu-container';

    const panelBG = makeDataUriSvg(createAuroraPanelBG(1000, 640));
    container.innerHTML = `
      <button class="ab-sexy-toggle" id="ab-toggle-btn" aria-label="K-Wave Toggle">
        <span class="kw-ring"></span>
      </button>

      <div class="ab-sexy-panel" id="ab-menu-panel" style="--kw-panel-bg: url('${panelBG}');">
        <button class="ab-close-btn" id="ab-close-btn" aria-label="Close">${Icons.close}</button>

        <div class="ab-menu-header">
          <div class="ab-language-selector" id="ab-lang-selector" aria-label="Language">
            ${Icons.language}
            <span>${currentLanguage.toUpperCase()}</span>
          </div>
          <div class="ab-menu-title">${t('title')}</div>
          <div class="ab-menu-subtitle">${t('subtitle')}</div>
        </div>

        <div class="ab-progress-section">
          <div class="ab-progress-header">
            <span class="ab-progress-label">${t('progress')}</span>
            <span class="ab-progress-text">0%</span>
          </div>
          <div class="ab-progress-bar">
            <div class="ab-progress-fill" style="width:0%"></div>
          </div>
          <div class="ab-status-text">${t('status')}: ${t('completed')}</div>
        </div>

        <div class="ab-form-group">
          <label class="ab-label" for="redirect-url">${t('redirectUrl')}</label>
          <input type="url" id="redirect-url" class="ab-input" placeholder="https://poe.com/...">
        </div>

        <div class="ab-checkbox-group" role="button" tabindex="0">
          <div class="ab-checkbox">
            <input type="checkbox" id="clean-exit" aria-label="${t('cleanExit')}">
            <div class="ab-checkbox-custom"></div>
          </div>
          <label class="ab-checkbox-label" for="clean-exit">${t('cleanExit')}</label>
        </div>

        <button class="ab-action-btn" id="logout-register-btn">${Icons.logoutCreate}<span>${t('logoutCreate')}</span></button>
        <button class="ab-action-btn" id="register-btn">${Icons.register}<span>${t('registerNew')}</span></button>
        <button class="ab-action-btn" id="open-temp-email-btn">${Icons.mail}<span>${t('openTempEmail')}</span></button>
      </div>
    `;
    document.body.appendChild(container);

    // Rozet SVG'yi buton arkaplanına uygula
    const toggleBtn = document.getElementById('ab-toggle-btn');
    toggleBtn.style.backgroundImage = `url('${makeDataUriSvg(createKWaveBadgeSVG(118))}')`;

    // Elemanlar
    const panel = document.getElementById('ab-menu-panel');
    const closeBtn = document.getElementById('ab-close-btn');
    const langSelector = document.getElementById('ab-lang-selector');
    const redirectInput = document.getElementById('redirect-url');
    const cleanExitCheckbox = document.getElementById('clean-exit');
    const logoutRegisterBtn = document.getElementById('logout-register-btn');
    const registerBtn = document.getElementById('register-btn');
    const openTempEmailBtn = document.getElementById('open-temp-email-btn');
    const checkboxGroup = panel.querySelector('.ab-checkbox-group');

    if (checkboxGroup) {
      checkboxGroup.style.cursor = 'pointer';
      checkboxGroup.addEventListener('click', (e) => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'LABEL') {
          cleanExitCheckbox.click();
        }
      });
      checkboxGroup.addEventListener('keypress', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          cleanExitCheckbox.click();
        }
      });
    }

    // Ayarları yükle + ilerlemeyi geri yükle + UI pozisyonunu uygula
    (async () => {
      const config = await GM_getValue(CONFIG_KEY, {
        redirectUrl: 'https://poe.com/GPT-5',
        cleanExit: false,
        lang: (navigator.language || 'en').slice(0, 2)
      });
      redirectInput.value = config.redirectUrl;
      cleanExitCheckbox.checked = config.cleanExit;
      currentLanguage = translations[config.lang] ? config.lang : 'en';
      await updateLanguage();

      const savedProgress = await GM_getValue(PROGRESS_KEY, { percentage: 0, statusText: t('completed') });
      await updateProgress(savedProgress.percentage, savedProgress.statusText);

      const pos = await GM_getValue(POS_KEY, null);
      if (pos && typeof pos.left === 'number' && typeof pos.top === 'number') {
        container.style.left = `${pos.left}px`;
        container.style.top = `${pos.top}px`;
      }
      clampContainerToViewport(); // ilk yerleşimi kelepçele
    })();

    async function saveSettings() {
      await GM_setValue(CONFIG_KEY, {
        redirectUrl: redirectInput.value,
        cleanExit: cleanExitCheckbox.checked,
        lang: currentLanguage
      });
    }

    langSelector.addEventListener('click', async () => {
      const languages = ['en', 'tr', 'ja', 'ko'];
      const currentIndex = languages.indexOf(currentLanguage);
      currentLanguage = languages[(currentIndex + 1) % languages.length];
      await updateLanguage();
      await saveSettings();
    });

    async function updateLanguage() {
      langSelector.querySelector('span').textContent = currentLanguage.toUpperCase();
      panel.querySelector('.ab-menu-title').textContent = t('title');
      panel.querySelector('.ab-menu-subtitle').textContent = t('subtitle');
      panel.querySelector('.ab-progress-label').textContent = t('progress');
      panel.querySelector('.ab-label[for="redirect-url"]').textContent = t('redirectUrl');
      panel.querySelector('.ab-checkbox-label[for="clean-exit"]').textContent = t('cleanExit');
      logoutRegisterBtn.innerHTML = `${Icons.logoutCreate}<span>${t('logoutCreate')}</span>`;
      registerBtn.innerHTML = `${Icons.register}<span>${t('registerNew')}</span>`;
      openTempEmailBtn.innerHTML = `${Icons.mail}<span>${t('openTempEmail')}</span>`;
      const savedProgress = await GM_getValue(PROGRESS_KEY, { percentage: 0, statusText: t('completed') });
      panel.querySelector('.ab-status-text').textContent = `${t('status')}: ${savedProgress.statusText}`;
    }

    redirectInput.addEventListener('change', saveSettings);
    cleanExitCheckbox.addEventListener('change', saveSettings);

    // Sayfa rotasına göre buton görünürlüğü
    function setButtonVisibility() {
      if (window.location.pathname === '/login') {
        logoutRegisterBtn.style.display = 'none';
        registerBtn.style.display = 'flex';
      } else {
        registerBtn.style.display = 'none';
        logoutRegisterBtn.style.display = 'flex';
      }
      openTempEmailBtn.style.display = 'flex';
    }
    setButtonVisibility();

    // Aksiyonlar
    registerBtn.addEventListener('click', async () => {
      if (!isProcessing) {
        panel.classList.remove('active');
        await startRegistration();
        createFloatingHearts();
      }
    });

    logoutRegisterBtn.addEventListener('click', async () => {
      if (!isProcessing) {
        panel.classList.remove('active');
        startLogoutAndRegisterProcess();
        createFloatingHearts();
      }
    });

    openTempEmailBtn.addEventListener('click', () => {
      GM_openInTab('https://edumail.icu/', { active: true, setParent: true });
      createFloatingHearts();
    });

    // Panel konumlandırma — ekran dışına taşmayacak şekilde flip
    function positionPanelWithinViewport() {
      const containerRect = container.getBoundingClientRect();
      const toggleSize = toggleBtn.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();

      // Varsayılan: toggle'ın altına aç
      let openTop = containerRect.top + toggleSize.height + 8;
      let openBottomAuto = true;
      let openLeft = containerRect.left;
      let alignRight = false;

      // Sağ kenardan taşarsa sağa yasla
      if (openLeft + panelRect.width > window.innerWidth - 8) {
        alignRight = true;
      }
      // Alta sığmıyorsa üstte aç
      if (openTop + panelRect.height > window.innerHeight - 8) {
        openTop = containerRect.top - panelRect.height - 8;
        if (openTop < 8) {
          // Hem üst hem alt olmuyorsa, en iyi sığdığı şekilde viewport içinde sınırla
          openTop = Math.min(window.innerHeight - panelRect.height - 8, Math.max(8, openTop));
        }
        openBottomAuto = false;
      }

      // Uygula
      panel.style.left = alignRight ? 'auto' : '0';
      panel.style.right = alignRight ? '0' : 'auto';
      panel.style.top = openBottomAuto ? '90px' : 'auto'; // default top relative to container
      panel.style.bottom = openBottomAuto ? 'auto' : '90px';

      // Mutlak konumlandırma için container referansı kullanıyoruz, flip mantığı transform-origin'i belirlesin
      const isLeft = containerRect.left < window.innerWidth / 2;
      const isTop = containerRect.top < window.innerHeight / 2;
      panel.style.transformOrigin = `${isTop ? 'top' : 'bottom'} ${isLeft ? 'left' : 'right'}`;
    }

    // Panel aç/kapat
    let wasDraggingClick = false;
    toggleBtn.addEventListener('click', (e) => {
      if (wasDraggingClick) { wasDraggingClick = false; return; }
      e.stopPropagation();
      positionPanelWithinViewport();
      panel.classList.toggle('active');
      if (panel.classList.contains('active')) createFloatingHearts();
    });
    closeBtn.addEventListener('click', () => panel.classList.remove('active'));
    document.addEventListener('click', (e) => { if (!container.contains(e.target)) panel.classList.remove('active'); });
    window.addEventListener('resize', () => {
      clampContainerToViewport();
      if (panel.classList.contains('active')) positionPanelWithinViewport();
    });

    // Sürükle-bırak: Pointer Events ile, ekran dışına taşma yok
    let dragStart = null;
    let startLeft = 0, startTop = 0;
    const DRAG_THRESHOLD = 6; // piksel
    let dragging = false;

    function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }
    function clampContainerToViewport() {
      const rect = container.getBoundingClientRect();
      let l = rect.left, t = rect.top;
      const maxLeft = window.innerWidth - rect.width - 8;
      const maxTop = window.innerHeight - rect.height - 8;
      l = clamp(l, 8, Math.max(8, maxLeft));
      t = clamp(t, 8, Math.max(8, maxTop));
      container.style.left = `${l}px`;
      container.style.top = `${t}px`;
    }

    toggleBtn.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return; // sadece sol tık
      e.preventDefault();
      toggleBtn.setPointerCapture(e.pointerId);
      container.classList.add('dragging');

      const rect = container.getBoundingClientRect();
      dragStart = { x: e.clientX, y: e.clientY };
      startLeft = rect.left;
      startTop = rect.top;
      dragging = false;
    });

    toggleBtn.addEventListener('pointermove', (e) => {
      if (!dragStart) return;
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      if (!dragging && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        dragging = true;
      }
      if (dragging) {
        const rect = container.getBoundingClientRect();
        const newLeft = clamp(startLeft + dx, 8, window.innerWidth - rect.width - 8);
        const newTop  = clamp(startTop + dy, 8, window.innerHeight - rect.height - 8);
        container.style.left = `${newLeft}px`;
        container.style.top = `${newTop}px`;
        // Panel açıkken de beraber kal, viewport içinde kalsın
        if (panel.classList.contains('active')) positionPanelWithinViewport();
      }
    });

    toggleBtn.addEventListener('pointerup', async (e) => {
      if (!dragStart) return;
      toggleBtn.releasePointerCapture(e.pointerId);
      container.classList.remove('dragging');
      if (dragging) {
        wasDraggingClick = true; // Bu tıklamayı toggle sayma
        setTimeout(() => (wasDraggingClick = false), 0);
      }
      dragStart = null;
      dragging = false;
      clampContainerToViewport();
      // Pozisyonu kaydet
      const rect = container.getBoundingClientRect();
      await GM_setValue(POS_KEY, { left: Math.round(rect.left), top: Math.round(rect.top) });
    });

    // Estetik: SVG kalpler
    function createFloatingHearts() {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const wrap = document.createElement('div');
          wrap.className = 'floating-heart';
          const size = 14 + Math.round(Math.random() * 10);
          wrap.innerHTML = makeHeartSVG(size);
          wrap.style.setProperty('--x', Math.round(Math.random() * 60 - 10) + 'px');
          wrap.style.setProperty('--y', Math.round(Math.random() * 60 - 10) + 'px');
          wrap.style.setProperty('--dur', (1.6 + Math.random() * 1.2).toFixed(2) + 's');
          toggleBtn.appendChild(wrap);
          setTimeout(() => { wrap.remove(); }, 2200);
        }, i * 160);
      }
    }
  }

  // ===============================================================================================
  // BAŞLAT
  // ===============================================================================================
  if (window.location.host === 'poe.com') {
    poeRouter();
    observeUrlChanges();
  } else if (window.location.host === 'edumail.icu') {
    mainEduMailScript();
  }
})();
// ==UserScript==
// @name         SOOP 채널/다시보기/라이브 프로필 & 배너 이미지 다운로드 (원본 LOGO 경로 사용)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Station: 프로필(원본 LOGO 경로) + 배너, VOD/Live: 프로필 이미지를 닉네임 파일명(.png)으로 저장. (페이지별 토스트/핫키 브리지/지연로딩/폴백 포함)
// @author       WakViewer
// @match        https://www.sooplive.co.kr/station/*
// @match        https://vod.sooplive.co.kr/player/*
// @match        https://play.sooplive.co.kr/*
// @icon         https://res.sooplive.co.kr/afreeca.ico
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521613/SOOP%20%EC%B1%84%EB%84%90%EB%8B%A4%EC%8B%9C%EB%B3%B4%EA%B8%B0%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%ED%94%84%EB%A1%9C%ED%95%84%20%20%EB%B0%B0%EB%84%88%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C%20%28%EC%9B%90%EB%B3%B8%20LOGO%20%EA%B2%BD%EB%A1%9C%20%EC%82%AC%EC%9A%A9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/521613/SOOP%20%EC%B1%84%EB%84%90%EB%8B%A4%EC%8B%9C%EB%B3%B4%EA%B8%B0%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%ED%94%84%EB%A1%9C%ED%95%84%20%20%EB%B0%B0%EB%84%88%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C%20%28%EC%9B%90%EB%B3%B8%20LOGO%20%EA%B2%BD%EB%A1%9C%20%EC%82%AC%EC%9A%A9%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ====== 설정/상수 ======
  const MSG_TYPE = 'SOOP_DL_HOTKEY';
  const DEFAULT_SHORTCUT = 'ctrl+y';
  let shortcutKey = (GM_getValue('shortcutKey', DEFAULT_SHORTCUT) || DEFAULT_SHORTCUT).toLowerCase();

  function getEnv() {
    const h = location.hostname;
    if (h === 'www.sooplive.co.kr' && location.pathname.startsWith('/station/')) return 'station';
    if (h === 'vod.sooplive.co.kr' && location.pathname.startsWith('/player/')) return 'vod';
    if (h === 'play.sooplive.co.kr') return 'play'; // 라이브 또는 VOD 내장 플레이어
    return 'unknown';
  }
  const ENV = getEnv();
  const IS_TOP = window.top === window;

  // ====== 셀렉터 ======
  const SELECTORS = {
    station: {
      bannerDiv: '#layout_container__S7ueh > div.ChannelVisual_channelVisual__a2JA_ > div.TopBanner_TopBannerWrap__1Z87K',
      profileImgList: [
        '#soop_wrap > div.__soopui__Sidebar-module__Sidebar___CjdhU.__soopui__Sidebar-module__Expanded___DPQe9.ServiceLeftMenu_ChannelServiceLeftMenu__C6J0o.ServiceLeftMenu_expanded__IfzLg > div.__soopui__InnerLnb-module__InnerLnb___qASDV.__soopui__InnerLnb-module__Expanded___hmDdf.ServiceLeftMenu_innerLnb__0hMfP > div.ProfileInfo_streamer__tEqni > div.ProfileInfo_profileImg__mz9Nz > a > span > div > img',
        '#layout_container__S7ueh > div.ChannelVisual_channelVisual__a2JA_ > div.ChannelVisual_channelInfoWrapper__ovnvh > div > div.StreamerInfo_streamer__ZhKoB > div.StreamerInfo_profileImg__EC1En > span > div > img'
      ],
      nicknameList: [
        '#soop_wrap > div.__soopui__Sidebar-module__Sidebar___CjdhU.__soopui__Sidebar-module__Expanded___DPQe9.ServiceLeftMenu_ChannelServiceLeftMenu__C6J0o.ServiceLeftMenu_expanded__IfzLg > div.__soopui__InnerLnb-module__InnerLnb___qASDV.__soopui__InnerLnb-module__Expanded___hmDdf.ServiceLeftMenu_innerLnb__0hMfP > div.ProfileInfo_streamer__tEqni > div.ProfileInfo_nicknameWrapper__LdDE0 > p',
        '#layout_container__S7ueh > div.ChannelVisual_channelVisual__a2JA_ > div.ChannelVisual_channelInfoWrapper__ovnvh > div > div.StreamerInfo_streamer__ZhKoB > div:nth-child(2) > div.StreamerInfo_nicknameWrapper__NFtU2 > p'
      ]
    },
    vod: {
      profileImgList: [
        '#player_area > div.wrapping.player_bottom > div.broadcast_information > div:nth-child(1) > div.thumbnail_box > a > img',
        '#player_area .broadcast_information .thumbnail_box a img'
      ],
      nicknameList: [
        '#player_area > div.wrapping.player_bottom > div.broadcast_information > div:nth-child(1) > div.ictFunc.nickname > a',
        '#player_area .broadcast_information .ictFunc.nickname a'
      ]
    },
    play: { // 라이브 페이지 또는 VOD 내장 iframe
      profileImgList: ['#bjThumbnail > a > img'],
      nicknameList: ['#infoNickName']
    }
  };

  const DEFAULTS = {
    profilePrefix: 'https://res.sooplive.co.kr/images/svg/thumb_profile.svg',
    bannerLight: 'https://res.sooplive.co.kr/images/channel/ChannelVisualImageLight.jpg',
    bannerDark: 'https://res.sooplive.co.kr/images/channel/ChannelVisualImageDark.jpg'
  };

  // ====== 토스트 ======
  function getToastContainer() {
    if (ENV === 'vod') {
      let box = document.querySelector('#toastMessage');
      if (!box) {
        box = document.createElement('div');
        box.id = 'toastMessage';
        box.className = 'toast-box';
        document.body.appendChild(box);
      }
      return box;
    } else {
      let box = document.querySelector('body > div.toast-box');
      if (!box) {
        box = document.createElement('div');
        box.className = 'toast-box';
        document.body.appendChild(box);
      }
      return box;
    }
  }
  function showToast(msg, durationMs = 2500) {
    const box = getToastContainer();
    const item = document.createElement('div');
    const p = document.createElement('p');
    p.textContent = msg;
    item.appendChild(p);
    box.appendChild(item);
    setTimeout(() => item.remove?.(), durationMs);
  }

  // ====== 유틸 ======
  function sanitizeFilenameBase(s) {
    return (s || '').replace(/[\\/:*?"<>|]/g, '_').trim();
  }
  function ensurePngName(base) {
    const safe = sanitizeFilenameBase(base);
    return safe.toLowerCase().endsWith('.png') ? safe : `${safe}.png`;
  }
  function queryFirst(listOrSelector) {
    const arr = Array.isArray(listOrSelector) ? listOrSelector : [listOrSelector];
    for (const sel of arr) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function firstFromSrcset(srcset) {
    if (!srcset) return '';
    return srcset.split(',')[0].trim().split(' ')[0].trim();
  }
  function getImgUrlFromEl(imgEl) {
    if (!imgEl) return '';
    return imgEl.getAttribute('src')
        || imgEl.currentSrc
        || imgEl.getAttribute?.('data-src')
        || firstFromSrcset(imgEl.getAttribute?.('srcset'))
        || '';
  }
  function parseBgUrlFromStyle(styleStr) {
    if (!styleStr) return '';
    const m = styleStr.match(/url\((['"]?)(https?:\/\/[^)]+)\1\)/i);
    return m ? m[2] : '';
  }
  function waitForElement(selector, timeoutMs = 12000) {
    return new Promise((resolve) => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      const obs = new MutationObserver(() => {
        const t = document.querySelector(selector);
        if (t) { obs.disconnect(); resolve(t); }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(() => { obs.disconnect(); resolve(null); }, timeoutMs);
    });
  }
  function urlExists(url) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: 'HEAD', url,
        onload: (res) => resolve(res.status >= 200 && res.status < 400),
        onerror: () => resolve(false), ontimeout: () => resolve(false)
      });
    });
  }

  // ====== 아이디/닉네임 ======
  function getStationStreamerId() {
    // /station/<id>
    const parts = location.pathname.split('/').filter(Boolean);
    return parts[1] ? parts[1].toLowerCase() : '';
  }
  function getChannelIdFromUrl() {
    const parts = location.pathname.split('/').filter(Boolean);
    if (ENV === 'station') return parts[1] || 'streamer';
    if (ENV === 'play') return parts[0] || 'streamer';
    return 'streamer';
  }
  function getNickname() {
    const conf = SELECTORS[ENV] || {};
    const nickEl = queryFirst(conf.nicknameList);
    let nickTxt = nickEl?.textContent?.trim();
    if (!nickTxt && nickEl?.getAttribute) {
      const dataId = nickEl.getAttribute('data-bj_id');
      if (dataId) nickTxt = dataId.trim();
    }
    if (nickTxt) return nickTxt;

    const imgEl = queryFirst(conf.profileImgList);
    const alt = imgEl?.getAttribute('alt')?.trim();
    if (alt) return alt;

    return getChannelIdFromUrl();
  }

  // ====== 다운로드 ======
  function downloadImage(url, filenameBase) {
    const name = ensurePngName(filenameBase);
    GM_download({ url, name, onerror: (e) => console.error('[SOOP DL] Failed', e) });
  }

  // ====== 원본 LOGO URL 생성 (id → jpg, 없으면 webp) ======
  async function buildLogoUrlFromId(id) {
    if (!id) return '';
    const bucket = id.slice(0, 2).toLowerCase();
    const base = `https://stimg.sooplive.co.kr/LOGO/${bucket}/${id}/${id}`;
    const jpg = `${base}.jpg`;
    if (await urlExists(jpg)) return jpg;
    const webp = `${base}.webp`;
    if (await urlExists(webp)) return webp;
    return ''; // 없으면 빈 문자열
  }

  // ====== 동작 ======
  async function downloadProfile() {
    const nick = getNickname();

    if (ENV === 'station') {
      // ✅ 방송국: 썸네일 src 대신 아이디로 원본 LOGO 경로 구성
      const id = getStationStreamerId();
      const logoUrl = await buildLogoUrlFromId(id);
      if (logoUrl) {
        downloadImage(logoUrl, `${nick} 프로필`);
        showToast('프로필 이미지 다운로드 완료!');
        return;
      }
      // 폴백: 혹시나 LOGO에 없을 때 기존 DOM에서 시도
      const imgEl = queryFirst(SELECTORS.station.profileImgList);
      const domSrc = getImgUrlFromEl(imgEl);
      if (domSrc && !domSrc.startsWith(DEFAULTS.profilePrefix)) {
        downloadImage(domSrc, `${nick} 프로필`);
        showToast('프로필 이미지 다운로드 완료!(썸네일 소스)');
        return;
      }
      showToast('프로필 이미지가 없습니다!');
      return;
    }

    // VOD / 라이브: 기존 로직
    const conf = SELECTORS[ENV] || {};
    let imgEl = queryFirst(conf.profileImgList);
    let src = getImgUrlFromEl(imgEl);

    if (!src) {
      const firstSel = conf.profileImgList?.[0];
      if (firstSel) {
        await waitForElement(firstSel, 12000);
        imgEl = queryFirst(conf.profileImgList);
        src = getImgUrlFromEl(imgEl);
      }
    }

    if ((!src || src.startsWith(DEFAULTS.profilePrefix)) && location.hostname === 'vod.sooplive.co.kr') {
      // VOD는 닉네임 링크에서 station/<id> 추출해 LOGO URL 구성
      const a = await waitForElement(SELECTORS.vod.nicknameList[0], 8000);
      const href = a?.getAttribute('href') || '';
      const m = href.match(/\/station\/([A-Za-z0-9_]+)/);
      const id = m ? m[1].toLowerCase() : '';
      const built = await buildLogoUrlFromId(id);
      if (built) src = built;
    }

    if (!src || src.startsWith(DEFAULTS.profilePrefix)) {
      showToast('프로필 이미지가 없습니다!');
      return;
    }
    downloadImage(src, `${nick} 프로필`);
    showToast('프로필 이미지 다운로드 완료!');
  }

  function downloadBanner() {
    if (ENV !== 'station') {
      showToast('이 페이지에는 배너가 없습니다.');
      return;
    }
    const el = document.querySelector(SELECTORS.station.bannerDiv);
    if (!el) { showToast('배너 이미지가 없습니다!'); return; }
    const styleBg = el.getAttribute('style') || getComputedStyle(el).backgroundImage || '';
    const url = parseBgUrlFromStyle(styleBg);
    if (!url || url === DEFAULTS.bannerLight || url === DEFAULTS.bannerDark) {
      showToast('배너 이미지가 없습니다!'); return;
    }
    const nick = getNickname();
    downloadImage(url, `${nick} 배너`);
    showToast('배너 이미지 다운로드 완료!');
  }

  function downloadByEnvShortcut() {
    if (location.hostname === 'vod.sooplive.co.kr') {
      downloadProfile(); // VOD: 프로필만
    } else if (ENV === 'station') {
      downloadProfile(); downloadBanner(); // 방송국: 프로필(원본 LOGO) + 배너
    } else {
      downloadProfile(); // play(라이브/내장)도 프로필만
    }
  }

  // ====== 단축키 ======
  function formatKeyCombo(e) {
    let s = '';
    if (e.ctrlKey) s += 'ctrl+';
    if (e.shiftKey) s += 'shift+';
    if (e.altKey) s += 'alt+';
    s += (e.key || '').toLowerCase();
    return s;
  }
  function isEditableTarget(t) {
    if (!t) return false;
    const tag = (t.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea' || t.isContentEditable;
  }
  function keyHandler(e) {
    if (isEditableTarget(e.target)) return;
    const combo = formatKeyCombo(e);
    const match = (combo === shortcutKey) || (shortcutKey === 'y' && combo === 'y');
    if (!match) return;
    e.preventDefault();
    e.stopPropagation();

    if (IS_TOP) {
      downloadByEnvShortcut();
    } else {
      try { window.top.postMessage({ type: MSG_TYPE }, '*'); } catch (_) {}
    }
  }
  window.addEventListener('keydown', keyHandler, { capture: true, passive: false });
  document.addEventListener('keydown', keyHandler, { capture: true, passive: false });

  if (IS_TOP) {
    window.addEventListener('message', (ev) => {
      const data = ev?.data;
      if (data && data.type === MSG_TYPE) downloadByEnvShortcut();
    });
  }

  // ====== GM 메뉴 ======
  function setShortcutKey() {
    const cur = shortcutKey;
    const newKey = prompt('새로운 단축키를 입력하세요!\n\n예) Y, Ctrl+Y, Alt+Shift+P', cur);
    if (newKey) {
      shortcutKey = newKey.toLowerCase().trim();
      GM_setValue('shortcutKey', shortcutKey);
      showToast(`단축키 설정 완료: ${newKey}`);
    } else {
      showToast('단축키 설정이 취소되었습니다.');
    }
  }

  if (location.hostname === 'www.sooplive.co.kr') {
    GM_registerMenuCommand('프로필/배너 모두 다운로드', () => { downloadProfile(); downloadBanner(); });
    GM_registerMenuCommand('프로필 이미지만 다운로드', downloadProfile);
    GM_registerMenuCommand('배너 이미지만 다운로드', downloadBanner);
  } else {
    GM_registerMenuCommand('프로필 이미지만 다운로드', downloadProfile);
  }
  GM_registerMenuCommand(`단축키 설정 (현재: ${shortcutKey})`, setShortcutKey);
})();

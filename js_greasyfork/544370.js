// ==UserScript==
// @name         MENU T24 - Panel Duyệt (bên phải, đánh số, D., đồng nhất size)
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Panel các nút D. … vào frame MENU của T24, thêm MD (#11)
// @match        *://*/BrowserWeb/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544370/MENU%20T24%20-%20Panel%20Duy%E1%BB%87t%20%28b%C3%AAn%20ph%E1%BA%A3i%2C%20%C4%91%C3%A1nh%20s%E1%BB%91%2C%20D%2C%20%C4%91%E1%BB%93ng%20nh%E1%BA%A5t%20size%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544370/MENU%20T24%20-%20Panel%20Duy%E1%BB%87t%20%28b%C3%AAn%20ph%E1%BA%A3i%2C%20%C4%91%C3%A1nh%20s%E1%BB%91%2C%20D%2C%20%C4%91%E1%BB%93ng%20nh%E1%BA%A5t%20size%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Chỉ chạy trong frame MENU
  if (!window.name || !window.name.toLowerCase().includes('menu')) return;
  if (document.getElementById('tmk-panel-duyet')) return;

  // === Helper: click theo code + optional headerText ===
  function clickTheoHref(doenqCode, headerText) {
    const code = String(doenqCode).trim();

    // Nếu có headerText, thử gọi các hàm header trước
    try {
      if (headerText) {
        if (typeof window.menu_history === 'function') {
          window.menu_history('ENQUIRY', code);
        } else if (window.parent && typeof window.parent.menu_history === 'function') {
          window.parent.menu_history('ENQUIRY', code);
        } else if (window.top && typeof window.top.menu_history === 'function') {
          window.top.menu_history('ENQUIRY', code);
        }

        if (typeof window.processMenuHeaderText === 'function') {
          window.processMenuHeaderText(headerText);
        } else if (window.parent && typeof window.parent.processMenuHeaderText === 'function') {
          window.parent.processMenuHeaderText(headerText);
        } else if (window.top && typeof window.top.processMenuHeaderText === 'function') {
          window.top.processMenuHeaderText(headerText);
        }
      }
    } catch (e) {
      console.warn('Header funcs error:', e);
    }

    // Thử click vào thẻ <a> có chứa code
    const all = document.getElementsByTagName('a');
    for (let i = 0; i < all.length; i++) {
      const a = all[i];
      const href = a.getAttribute('href');
      const onclick = a.getAttribute('onclick');
      if ((href && href.includes(code)) || (onclick && onclick.includes(code))) {
        a.click();
        console.log('Đã click anchor:', code);
        return;
      }
    }

    // Fallback: gọi doenq trực tiếp
    try {
      const fn =
        (typeof window.doenq === 'function' && window.doenq) ||
        (window.parent && typeof window.parent.doenq === 'function' && window.parent.doenq) ||
        (window.top && typeof window.top.doenq === 'function' && window.top.doenq) ||
        null;
      if (fn) {
        fn(code);
        console.log('Đã gọi doenq trực tiếp:', code);
        return;
      }
    } catch (e) {
      console.warn('Fallback doenq lỗi:', e);
    }

    alert('Không tìm thấy menu chứa: ' + code);
  }

  // === Danh sách nút theo thứ tự ===
  const items = [
    { id: 'd-account',    text: 'ACCOUNT',        code: 'QUERY MDT.ACCOUNT.NAU',    color: '#0078D7' },
    { id: 'd-limit',      text: 'LIMIT',          code: 'QUERY MDT.LIMIT.AUTH',     color: '#6c63ff' },
    { id: 'd-ts',         text: 'TS',             code: 'QUERY CBS.CD.CO.LIST.NAU', color: '#17a2b8' },
    { id: 'd-ft',         text: 'FT',             code: 'QUERY MDT.FT.AUTH.NAU',    color: '#28a745' },
    { id: 'd-hm-tc',      text: 'GAN HM TC',      code: 'QUERY MB.AC.LIMIT.NAU',    color: '#ff9800' },
    { id: 'd-ls-tc',      text: 'LS THAU CHI',    code: 'QUERY MB.ADI.LIMIT.NAU',   color: '#9c27b0' },
    { id: 'd-other-loan', text: 'OTHER LOAN',     code: 'QUERY MDT.LOAN.AUTH.NAU',  color: '#795548' },
    { id: 'd-thu-phi',    text: 'THU PHI KHAC',   code: 'QUERY AC.CHARGE.REQ.NAU',  color: '#3f51b5' },
    { id: 'd-kho-quy',    text: 'KHO QUY',        code: 'QUERY MB.KHOQUY.NAU',      color: '#009688' },
    { id: 'd-pd',         text: 'PD',             code: 'QUERY MDT.PD.AUTH.NAU',    color: '#e91e63' },
    // #11: MD (có header text)
    { id: 'd-md',         text: 'MD',             code: 'QUERY MINH.MD.NAU',        color: '#607d8b', headerText: 'Phe duyet giao dich MD' }
  ];

  // === Panel phải cố định ===
  const panel = document.createElement('div');
  panel.id = 'tmk-panel-duyet';
  Object.assign(panel.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',              // ⬅️ ở cạnh phải
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '12px',
    background: 'rgba(20,23,28,0.85)',
    borderRadius: '12px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
    backdropFilter: 'blur(2px)',
  });

  // Style chung cho nút: cùng kích thước, text căn trái
  const BTN_WIDTH = 240; // px
  const BTN_HEIGHT = 40; // px
  const BASE_STYLE = {
    width: BTN_WIDTH + 'px',
    height: BTN_HEIGHT + 'px',
    lineHeight: BTN_HEIGHT + 'px',
    textAlign: 'left',
    padding: '0 14px',
    color: '#fff',
    border: '0',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '0.2px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
    display: 'inline-block',
    userSelect: 'none'
  };

  // Tạo nút với số thứ tự + “D.”
  items.forEach((it, idx) => {
    const n = idx + 1;
    const btn = document.createElement('button');
    btn.id = 'nut-' + it.id;
    btn.textContent = `${n}. D. ${it.text}`;
    Object.assign(btn.style, BASE_STYLE, { background: it.color });
    btn.onmouseenter = () => (btn.style.filter = 'brightness(1.05)');
    btn.onmouseleave = () => (btn.style.filter = 'brightness(1.0)');
    btn.onclick = () => clickTheoHref(it.code, it.headerText);
    panel.appendChild(btn);
  });

  document.body.appendChild(panel);
  console.log('✅ Panel D. bên phải + #11 MD đã sẵn sàng');
})();
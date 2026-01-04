// ==UserScript==
// @name         AudioDeviceSelect
// @namespace    http://tampermonkey.net/
// @version      1
// @description  by GitHub Copilot
// @author       jayhuang
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541739/AudioDeviceSelect.user.js
// @updateURL https://update.greasyfork.org/scripts/541739/AudioDeviceSelect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    createDeviceModalElements();
    // 不再於載入時自動取得裝置，改為點擊按鈕時觸發
})();

// 搜尋可用的音訊輸出裝置，並提供切換功能
async function listAudioOutputDevices() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log('此瀏覽器不支援列舉裝置');
    return;
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioOutputs = devices.filter(device => device.kind === 'audiooutput');
    console.log('可用的音訊輸出裝置:', audioOutputs);
    const list = document.getElementById('audio-output-list');
    if (list) {
      while (list.firstChild) list.removeChild(list.firstChild);
      if (audioOutputs.length === 0) {
        const li = document.createElement('li');
        li.textContent = '找不到音訊輸出裝置';
        li.style.color = '#888';
        li.style.padding = '8px';
        list.appendChild(li);
      } else {
        audioOutputs.forEach((device, idx) => {
          const li = document.createElement('li');
          li.style.display = 'flex';
          li.style.alignItems = 'center';
          li.style.justifyContent = 'space-between';
          li.style.padding = '8px 12px';
          li.style.marginBottom = '6px';
          li.style.border = '1px solid #ddd';
          li.style.borderRadius = '6px';
          li.style.background = idx % 2 === 0 ? '#f9f9f9' : '#f1f5fa';


          const infoDiv = document.createElement('div');
          infoDiv.style.flex = '1';
          infoDiv.style.overflow = 'hidden';
          infoDiv.style.whiteSpace = 'nowrap';
          infoDiv.style.textOverflow = 'ellipsis';

          // 安全建立內容
          const strong = document.createElement('strong');
          strong.textContent = device.label || '未命名裝置';
          infoDiv.appendChild(strong);
          infoDiv.appendChild(document.createElement('br'));
          const span = document.createElement('span');
          span.style.fontSize = '12px';
          span.style.color = '#888';
          span.textContent = `ID: ${device.deviceId}`;
          infoDiv.appendChild(span);

          const btn = document.createElement('button');
          btn.textContent = '切換到此裝置';
          btn.style.marginLeft = '16px';
          btn.style.padding = '6px 14px';
          btn.style.border = 'none';
          btn.style.borderRadius = '4px';
          btn.style.background = '#1976d2';
          btn.style.color = '#fff';
          btn.style.cursor = 'pointer';
          btn.onmouseenter = () => btn.style.background = '#1565c0';
          btn.onmouseleave = () => btn.style.background = '#1976d2';
          btn.onclick = () => {
            setOutputDeviceForAllMedia(device.deviceId);
            closeDeviceModal();
          };

          li.appendChild(infoDiv);
          li.appendChild(btn);
          list.appendChild(li);
        });
      }
    }
  } catch (err) {
    console.error('取得裝置時發生錯誤:', err);
  }
}

// 將所有 audio/video 元素切換到指定輸出裝置
function setOutputDeviceForAllMedia(deviceId) {
  const mediaEls = Array.from(document.querySelectorAll('audio, video'));
    console.log("mediaEls", mediaEls, deviceId)
  mediaEls.forEach(el => {
    if (typeof el.setSinkId === 'function') {
      el.setSinkId(deviceId)
        .catch(err => {
          console.warn('切換失敗:', err);
        });
    } else {
      el.style.outline = '2px solid orange';
      console.warn('此瀏覽器不支援 setSinkId');
    }
  });
}
// 全域彈窗開關函式
function openDeviceModal() {
  const modal = document.getElementById('audio-device-modal');
  if (modal) {
    modal.style.display = 'flex';
    setTimeout(() => { modal.style.opacity = '1'; }, 10);
  }
}
function closeDeviceModal() {
  const modal = document.getElementById('audio-device-modal');
  if (modal) {
    modal.style.opacity = '0';
    setTimeout(() => { modal.style.display = 'none'; }, 200);
  }
}

// ES6語法動態生成彈出視窗按鈕及列表，並確認注入
function createDeviceModalElements() {
  console.log('建立音訊裝置選擇彈出視窗元素');
  // 建立彈出視窗背景
  const modal = document.createElement('div');
  modal.id = 'audio-device-modal';
  Object.assign(modal.style, {
    display: 'none', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    background: 'rgba(0,0,0,0.25)', zIndex: 1000, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'column', transition: 'opacity 0.2s', opacity: 0
  });
  // 預設隱藏，等開啟時才顯示
  modal.style.display = 'none';

  // 內容區塊
  const modalContent = document.createElement('div');
  Object.assign(modalContent.style, {
    background: '#fff', minWidth: '320px', maxWidth: '90vw', minHeight: '120px',
    borderRadius: '10px', boxShadow: '0 4px 24px #0002', padding: '24px 18px 18px 18px', position: 'relative'
  });

  // 關閉按鈕
  const closeBtn = document.createElement('button');
  closeBtn.id = 'close-device-modal';
  closeBtn.textContent = '\u00D7';
  Object.assign(closeBtn.style, {
    position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none',
    fontSize: '20px', color: '#888', cursor: 'pointer'
  });
  closeBtn.onclick = closeDeviceModal;

  // 標題
  const h3 = document.createElement('h3');
  h3.textContent = '可用音訊輸出裝置';
  h3.style.marginTop = '0';

  // 權限說明區塊
  const permissionInfo = document.createElement('div');
  permissionInfo.id = 'audio-permission-info';
  permissionInfo.style.display = 'none';
  permissionInfo.style.background = '#f8f9fa';
  permissionInfo.style.color = '#444';
  permissionInfo.style.border = '1px solid #e0e0e0';
  permissionInfo.style.borderRadius = '6px';
  permissionInfo.style.padding = '12px 10px';
  permissionInfo.style.marginBottom = '12px';
  permissionInfo.style.fontSize = '15px';
  permissionInfo.textContent = '請授權麥克風權限以顯示可用音訊輸出裝置名稱。';

  // 裝置列表
  const ul = document.createElement('ul');
  ul.id = 'audio-output-list';
  Object.assign(ul.style, { listStyle: 'none', padding: 0, margin: 0 });

  modalContent.append(closeBtn, h3, permissionInfo, ul);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  modal.addEventListener('click', e => {
    if (e.target === modal) closeDeviceModal();
  });

  // 彈窗開啟 icon 按鈕
  const showBtn = document.createElement('button');
  showBtn.id = 'show-device-list-btn';
  showBtn.title = '選擇音訊輸出裝置';
  // 使用 createElementNS 建立 SVG，避免 TrustedHTML 問題
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('xmlns', svgNS);
  const circle = document.createElementNS(svgNS, 'circle');
  circle.setAttribute('cx', '12');
  circle.setAttribute('cy', '12');
  circle.setAttribute('r', '10');
  circle.setAttribute('fill', '#1976d2');
  svg.appendChild(circle);
  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute('d', 'M8 15V9a4 4 0 1 1 8 0v6');
  path.setAttribute('stroke', '#fff');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(path);
  const rect = document.createElementNS(svgNS, 'rect');
  rect.setAttribute('x', '7');
  rect.setAttribute('y', '15');
  rect.setAttribute('width', '10');
  rect.setAttribute('height', '2');
  rect.setAttribute('rx', '1');
  rect.setAttribute('fill', '#fff');
  svg.appendChild(rect);
  showBtn.appendChild(svg);
  Object.assign(showBtn.style, {
    position: 'fixed',
    right: '24px',
    bottom: '24px',
    zIndex: 1100,
    padding: '4px',
    background: '#fff',
    color: 'inherit',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px #0004, 0 1.5px 8px #1976d233',
    margin: 0
  });
  showBtn.onmouseenter = () => { showBtn.style.background = '#e3eaf7'; }
  showBtn.onmouseleave = () => { showBtn.style.background = '#fff'; }
  showBtn.onclick = () => {
    openDeviceModal();
    const infoDiv = document.getElementById('audio-permission-info');
    const list = document.getElementById('audio-output-list');
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'microphone' }).then(result => {
        if (result.state === 'granted') {
          if (infoDiv) infoDiv.style.display = 'none';
          if (list) list.style.display = '';
          handlePermissionAndListDevices();
        } else {
          if (infoDiv) infoDiv.style.display = '';
          if (list) list.style.display = 'none';
          // 仍然主動詢問權限
          handlePermissionAndListDevices();
        }
      }).catch(() => {
        // 查詢失敗時，預設顯示說明並主動詢問權限
        if (infoDiv) infoDiv.style.display = '';
        if (list) list.style.display = 'none';
        handlePermissionAndListDevices();
      });
    } else {
      // 不支援 Permissions API 時，預設顯示說明並主動詢問權限
      if (infoDiv) infoDiv.style.display = '';
      if (list) list.style.display = 'none';
      handlePermissionAndListDevices();
    }
  };

  // 插入到 body
  // 確保 body 已經 ready
  if (document.body) {
    document.body.insertBefore(showBtn, document.body.firstChild);
    document.body.appendChild(modal);
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      document.body.insertBefore(showBtn, document.body.firstChild);
      document.body.appendChild(modal);
    });
  }

  // 驗證注入
  setTimeout(() => {
    if (!document.getElementById('show-device-list-btn') || !document.getElementById('audio-device-modal')) {
      console.error('彈出視窗或按鈕注入失敗');
    } else {
      console.log('彈出視窗與按鈕已成功注入畫面');
    }
  }, 100);
}

// 處理權限與裝置列表顯示（首次打開時顯示說明）
let audioPermissionGranted = false;
async function handlePermissionAndListDevices() {
  const infoDiv = document.getElementById('audio-permission-info');
  const list = document.getElementById('audio-output-list');
  // 檢查是否已取得權限
  let permission;
  if (navigator.permissions && navigator.permissions.query) {
    try {
      permission = await navigator.permissions.query({ name: 'microphone' });
    } catch (e) {
      permission = null;
    }
  }
  // 若未取得權限，顯示說明，隱藏列表，並嘗試請求權限
  if (permission && permission.state !== 'granted' && !audioPermissionGranted) {
    if (infoDiv) infoDiv.style.display = '';
    if (list) list.style.display = 'none';
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (stream && stream.getTracks) stream.getTracks().forEach(track => track.stop());
      audioPermissionGranted = true;
      if (infoDiv) infoDiv.style.display = 'none';
      if (list) list.style.display = '';
      listAudioOutputDevices();
    } catch (err) {
      if (infoDiv) infoDiv.style.display = '';
      if (list) list.style.display = 'none';
    }
  } else if (permission && permission.state === 'granted') {
    // 已取得權限，仍需每次都呼叫 getUserMedia 以取得 label
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (stream && stream.getTracks) stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      // 若出錯仍繼續顯示列表（但 label 可能為空）
    }
    if (infoDiv) infoDiv.style.display = 'none';
    if (list) list.style.display = '';
    listAudioOutputDevices();
  } else {
    // 無法判斷權限狀態時，預設顯示列表
    if (infoDiv) infoDiv.style.display = 'none';
    if (list) list.style.display = '';
    listAudioOutputDevices();
  }
}


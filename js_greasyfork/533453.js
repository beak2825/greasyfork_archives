// ==UserScript==
// @name        tver.jp keyShortcut with WatchList
// @namespace   Violentmonkey Scripts
// @match       https://tver.jp/*
// @grant       none
// @version     1.14
// @author      -
// @description 2025/3/23 14:30:00
// @downloadURL https://update.greasyfork.org/scripts/533453/tverjp%20keyShortcut%20with%20WatchList.user.js
// @updateURL https://update.greasyfork.org/scripts/533453/tverjp%20keyShortcut%20with%20WatchList.meta.js
// ==/UserScript==

function main() {
  let settingsModal;
  const SETTINGS_KEY = 'tver_settings';
  const STORAGE_KEY = 'tverWatchList';

  const defaultSettings = {
    autoplay: false,
    playbackRate: 1,
    playbackRateStep: 0.25,
    browserMaximize: false,
    playlistAutoplay: false,
    autoExitFullscreenAtEnd: false,
    currentPlaybackRate: 1,
  };
  // ユーザー設定を取得（ローカルストレージから）
  let userSettings = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};

  // デフォルト設定とユーザー設定をマージ
  const settings = { ...defaultSettings, ...userSettings };

  let playbackRateListener = null;

  let isPlayerMaximized = false;
  let lastUIWidth = null;
  let lastUIHeight = null;

  function getNextContainer() {
    const nextContainer = document.getElementById('__next');
    if (!nextContainer) {
      console.warn('#__next element not found');
    }
    return nextContainer;
  }

  function getVideoElement(){
    const nextContainer = getNextContainer();
    if (nextContainer) {
      return nextContainer?.querySelector('video[src]');
    } else {
      return null;
    }
  }

  function seekVideo(seconds) {
    const vElement = getVideoElement();
    if (vElement) {
      vElement.currentTime += seconds;
    }
  }

  function setupPlaybackRateListener(videoElement) {
    if (playbackRateListener) {
      videoElement.removeEventListener('play', playbackRateListener);
    }

    playbackRateListener = () => {
        if (videoElement.playbackRate !== settings.currentPlaybackRate) {
          changePlaybackRate(settings.currentPlaybackRate);
        }
    };

    videoElement.addEventListener('play', playbackRateListener);
  }

  function changePlaybackRate(rate) {
    const video = getVideoElement();
    if (!video) return;
    if (!playbackRateListener){
      setupPlaybackRateListener(video);
    }
    const newRate = Math.max(0.5, Math.min(4, rate));
    video.playbackRate = newRate;
    settings.currentPlaybackRate = newRate;
    showMessage(`再生速度: ${Math.round(newRate * 100) / 100}x`);
  }
  function changePlaybackRateRelative(delta) {
    const video = document.querySelector('video');
    if (!video) return;

    const currentRate = video.playbackRate;
    const newRate = currentRate + delta;
    changePlaybackRate(newRate);
  }

  function addElementToNext(element) {
    const nextContainer = getNextContainer();
    if (nextContainer) {
      nextContainer.appendChild(element);
    } else {
      document.body.appendChild(element);
    }
  }

  let modal = null;
  let playlistModal = null;

  function createModal() {
    modal = document.createElement('div');
    modal.style.cssText = `
      display: none;
      position: fixed;
      z-index: 1001;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      overflow-y: auto;
      background-color: rgba(0,0,0,0.4);
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background-color: #fefefe;
      margin: 5vh auto 0;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      width: 60vw;
      max-width: 800px;
      font-family: Arial, sans-serif;
      line-height: 1.6;
    `;

    modalContent.innerHTML = `
      <h2 style="margin-top: 0; margin-bottom: 20px; color: #333; font-size: 1.5em; text-align:center;">ショートカットキーガイド</h2>

      <h3 style="color: #555;">すべてのページで使用可能なショートカットキー</h3>
      <ul>
        <li><b>F1 または ?:</b> このガイドを開閉</li>
        <li><b>A:</b> フォーカスされた動画をウォッチリストに追加</li>
        <li><b>L:</b> ウォッチリストモーダルを開閉</li>
        <li><b>P:</b> ウォッチリストの最初の動画に遷移</li>
        <li><b>C:</b> ウォッチリストをクリア</li>
        <li><b>S:</b> 設定モーダルを開閉</li>
      </ul>

      <h3 style="color: #555;">動画ページ専用のカスタムショートカットキー</h3>
      <ul>
        <li><b>N:</b> ウォッチリストの次の動画に移動</li>
        <li><b>P:</b> ウォッチリストの前の動画に移動</li>
        <li><b>+/=/&gt;:</b> 再生速度上昇</li>
        <li><b>-/&lt;:</b> 再生速度低下</li>
        <li><b>1/3:</b> 10秒戻る/10秒早送り</li>
        <li><b>4/6:</b> 30秒戻る/30秒早送り</li>
        <li><b>7/9:</b> 60秒戻る/60秒早送り</li>
        <li><b>　8:</b> 　　　　 80秒早送り</li>

        <li><b>Q:</b> 動画ページを閉じる</li>
      </ul>

      <h3 style="color: #555;">動画ページの公式ショートカットキー</h3>
      <ul>
        <li><b>Space/Enter:</b> 再生/一時停止</li>
        <li><b>F:</b> フルスクリーン表示/解除</li>
        <li><b>左右キー:</b> 10秒戻る/10秒早送り</li>
        <li><b>上下キー:</b> 音量操作</li>
        <li><b>M:</b> ミュートON/OFF</li>
      </ul>

      <p style="margin-top:20px; text-align:center; color: #777;">
        ※公式ショートカットキーはTVerが提供する標準機能で、動画ページでのみ使用可能です。<br>
        カスタムショートカットキーは、公式機能と競合しないよう設計されています。
      </p>

      <div style="text-align:center; margin-top:20px;">
        <button id="close-modal" style="padding: 10px 20px; background-color: #007BFF; color: white; border-radius: 4px; border: none; cursor: pointer; font-size: 14px;" onmouseover="this.style.backgroundColor='#0056b3'" onmouseout="this.style.backgroundColor='#007BFF'">閉じる</button>
      </div>
    `;

    modal.appendChild(modalContent);
    addElementToNext(modal);

    const closeButton = modal.querySelector('#close-modal');
    closeButton.addEventListener('click', () => {
      toggleModal();
    });
  }

  function toggleModal() {
    if (!modal) {
      createModal();
    }
    modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
  }

  function createPlaylistModal() {
    // モーダル全体の作成
    playlistModal = document.createElement('div');
    playlistModal.id = 'watchlist-modal'
    playlistModal.style.cssText = `
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0,0,0,0.7);
    `;

    // モーダルコンテンツ
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background-color: #f4f4f4;
      margin: 5vh auto; /* 上部マージン */
      padding: 20px;
      border: 1px solid #888;
      width: 85%;
      max-width: 800px; /* 幅を広げる */
      max-height: 850vh; /* 高さ制限 */
      overflow-y: auto; /* スクロール可能にする */
    `;

    // ウォッチリストヘッダー
    const watchListHeader = document.createElement('div');
    watchListHeader.id = 'watchlist-header';
    watchListHeader.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    `;

    const headerTitle = document.createElement('h2');
    headerTitle.textContent = 'ウォッチリスト';
    headerTitle.style.cssText = `
      margin: 0;
      font-size: 1.5em;
    `;

    const clearButton = document.createElement('button');
    clearButton.textContent = 'ウォッチリストをクリア';
    clearButton.classList.add('clear-button');
    clearButton.style.cssText = `
      padding: 5px 10px;
      border-radius: 5px;
      background-color: #ff4d4d;
      color: white;
      border: none;
      cursor: pointer;
    `;

    clearButton.addEventListener('click', ()=>{
      clearWatchList();
      togglePlaylistModal();
    });

    // ヘッダーにタイトルとクリアボタンを追加
    watchListHeader.appendChild(headerTitle);
    watchListHeader.appendChild(clearButton);

    // プレイリスト項目リスト
    const playlistUl = document.createElement('ul');
    playlistUl.id = 'playlist-items';
    playlistUl.style.cssText = `
      list-style-type: none;
      padding: 0;
      margin: 0;
    `;

    // ヘッダーとリストをモーダルコンテンツに追加
    modalContent.appendChild(watchListHeader);
    modalContent.appendChild(playlistUl);

    // モーダル全体にコンテンツを追加
    playlistModal.appendChild(modalContent);

    // モーダルをドキュメントに追加
    addElementToNext(playlistModal);

    // プレイリストのドラッグ&ドロップ機能を初期化
    initDragAndDrop();
  }

  function togglePlaylistModal() {
    if (!playlistModal) {
      createPlaylistModal();
    }
    playlistModal.style.display = playlistModal.style.display === 'none' ? 'block' : 'none';
    if (playlistModal.style.display === 'block') {
      updatePlaylistItems();
    }
  }

  function updatePlaylistItems() {
    const playlistUl = document.getElementById('playlist-items');
    playlistUl.innerHTML = '';
    let watchList = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    watchList.forEach((item, index) => {
      const li = document.createElement('li');
      li.style.cssText = `
        display: flex;
        align-items: start;
        margin-bottom: 20px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
      `;

      const thumbnailImg = document.createElement('img');
      thumbnailImg.src = item.thumbnail;
      thumbnailImg.style.width = '120px';
      thumbnailImg.style.height = 'auto';
      thumbnailImg.style.marginRight = '15px';
      thumbnailImg.style.borderRadius = '3px';

      const infoDiv = document.createElement('div');
      infoDiv.style.flex = '1';
      infoDiv.innerHTML = `
        <h3 style="margin: 0 0 5px 0;">${item.title}</h3>
        <p style="margin: 0 0 5px 0; font-size: 0.9em;">${item.description}</p>
        <p style="margin: 0; font-size: 0.8em; color: #666;">
          ${item.duration} | ${item.channel} - ${item.date}
        </p>
      `;

      const buttonsDiv = document.createElement('div');
      buttonsDiv.style.display = 'flex';
      buttonsDiv.style.flexDirection = 'column';
      buttonsDiv.style.justifyContent = 'space-between';
      buttonsDiv.style.marginLeft = '10px';

      const playButton = document.createElement('button');
      playButton.textContent = '再生';
      playButton.onclick = () => playVideo(item.url);
      playButton.style.cssText = `
        margin-bottom: 5px;
        padding: 5px 12px;
        border-radius: 5px;
        background-color: #4caf50;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1em;
      `;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = '削除';
      deleteButton.onclick = () => removeFromWatchList(item.url);
      deleteButton.style.cssText = `
        padding: 5px 12px;
        border-radius: 5px;
        background-color: #f44336;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1em;
      `;
      buttonsDiv.appendChild(playButton);
      buttonsDiv.appendChild(deleteButton);

      li.appendChild(thumbnailImg);
      li.appendChild(infoDiv);
      li.appendChild(buttonsDiv);
      li.draggable = true;
      li.setAttribute('data-url', item.url);
      playlistUl.appendChild(li);
    });
  }

  function playVideo(url) {
    window.location.href = url;
  }

  function playFirstVideo() {
    let watchList = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (watchList.length > 0) {
      playVideo(watchList[0].url);
    }
  }

  function removeFromWatchList(url) {
    let watchList = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    watchList = watchList.filter(item => item.url !== url);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchList));
    updatePlaylistItems();
  }

  function clearWatchList() {
    let watchList = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (watchList.length === 0) {
      showMessage('ウォッチリストは空です');
      return false;
    }
    if (confirm('ウォッチリストをすべて削除しますか？')) {
      // ローカルストレージや内部データからウォッチリストを削除
      // localStorage.removeItem('watchlist');
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      updatePlaylistItems();
      showMessage('ウォッチリストを削除しました');
    }
  }

  function initDragAndDrop() {
    const playlistUl = document.getElementById('playlist-items');

    playlistUl.addEventListener('dragstart', (e) => {
      if (e.target.tagName === 'LI') {
        e.dataTransfer.setData('text/plain', e.target.getAttribute('data-url'));
        e.target.style.opacity = '0.5';
      }
    });

    playlistUl.addEventListener('dragend', (e) => {
      if (e.target.tagName === 'LI') {
        e.target.style.opacity = '1';
      }
    });

    playlistUl.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    playlistUl.addEventListener('drop', (e) => {
      e.preventDefault();
      const draggedUrl = e.dataTransfer.getData('text/plain');
      const targetLi = e.target.closest('li');

      if (targetLi && draggedUrl !== targetLi.getAttribute('data-url')) {
        let watchList = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const draggedIndex = watchList.findIndex(item => item.url === draggedUrl);
        const targetIndex = watchList.findIndex(item => item.url === targetLi.getAttribute('data-url'));

        if (draggedIndex !== -1 && targetIndex !== -1) {
          const [draggedItem] = watchList.splice(draggedIndex, 1);
          watchList.splice(targetIndex, 0, draggedItem);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(watchList));
          updatePlaylistItems();
        }
      }
    });
  }


  function isFullscreen() {
    return document.fullscreenElement !== null;
  }

  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  function getFocusedElement() {
    return document.activeElement;
  }

  function showMessage(message, duration = 2000) {
    let messageModal = document.getElementById('message-modal');

    if (!messageModal) {
      messageModal = document.createElement('div');
      messageModal.id = 'message-modal';
      messageModal.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #f8f8f8;
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 10px 20px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        z-index: 10001;
      `;
      addElementToNext(messageModal);
    }

    messageModal.textContent = message;
    messageModal.style.opacity = '1';
    messageModal.style.pointerEvents = 'auto';

    setTimeout(() => {
      messageModal.style.opacity = '0';
      messageModal.style.pointerEvents = 'none';
    }, duration);
  }

  function getVideoUrlFromFocusedElement(element) {
    // const link = element.closest('a[href*="/episodes/"]');
    const link = element.closest('a[class*="container"][href*="episodes/"],div:has(> a[class*="container"][href*="episodes/"]),div:has(> a[class^="recommend-list-item_thumbnail__"][href*="episodes/"])');

    if (!link) return null;

    const img = link.querySelector('img');
    const thumbnailUrl = img ? img.src : null;
    // const textLines = link.innerText.split('\n').map(line => line.trim()).filter(line => line);
    const seriesInfoTitleArray = link.querySelector('[class*="row_"]') ? [document.querySelector('[class^="series-info_title__"],[class^="series-main_title__"],[class^="titles_seriesTitle__"]')?.textContent] : [];
    const textLines = seriesInfoTitleArray .concat(link.querySelector('div[class*="meta"]')?.innerText.split('\n').map(line => line.trim()).filter(line => line));
    console.log(textLines);
    const duration = link.querySelector('div[class*="duration"]')?.textContent;

    return {
      url: link.href || link.querySelector('a[class*="container"][href*="episodes/"]')?.href || link.querySelector('a[class^="recommend-list-item_thumbnail__"][href*="episodes/"]')?.href ,
      thumbnail: thumbnailUrl || '',
      duration: duration || '',
      // title: textLines[1] || '',
      // description: textLines[2] || '',
      // channel: textLines[3] ? textLines[3].split(' ')[0] : '',
      // date: textLines[3] ? textLines[3].split(' ').slice(1).join(' ') : '',
      // expiry: textLines[4] || '',
      title: textLines[0] || '',
      description: textLines[1] || '',
      channel: textLines[2] ? textLines[2].split(' ')[0] : '',
      date: textLines[2] ? textLines[2].split(' ').slice(1).join(' ') : '',
      expiry: textLines[3] || ''
    };
  }

  function addToWatchList() {
    const focusedElement = getFocusedElement();
    const videoInfo = getVideoUrlFromFocusedElement(focusedElement);

    if (videoInfo) {
      let watchList = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!watchList.some(item => item.url === videoInfo.url)) {
        watchList.push(videoInfo);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(watchList));
        showMessage(`${videoInfo.title} ${videoInfo.description} がウォッチリストに追加されました。`);
        const isWatchListOpen = document.getElementById('watchlist-modal')?.style.display === 'block';
        if(isWatchListOpen){
          updatePlaylistItems();
        }
      } else {
        showMessage('この動画は既にウォッチリストに含まれています。');
      }
    } else if (!focusedElement) {
      showMessage('elementが選択されていません。');
    } else {
      showMessage('有効な動画が選択されていません。');
    }
  }

  function getAdjacentVideoUrl(offset = 1) {
    let watchList = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (watchList.length === 0) return null;

    const currentUrl = window.location.href;
    const currentIndex = watchList.findIndex(video => video.url === currentUrl);

    // 現在のURLがウォッチリスト内に存在しない場合はnullを返す
    if (currentIndex === -1) {
      return null;
    }

    const targetIndex = currentIndex + offset;
    if (targetIndex >= 0 && targetIndex < watchList.length) {
      return watchList[targetIndex].url;
    }
    return null;
  }

  function navigateToNextVideo() {
    const nextVideoUrl = getAdjacentVideoUrl(1);
    if (nextVideoUrl) {
      window.location.href = nextVideoUrl; // 次の動画に移動
    } else {
      console.log('No more videos in the watchlist.');
    }
  }

  function skipVideo(offset) {
    const videoUrl = getAdjacentVideoUrl(offset);
    if (videoUrl) {
      showMessage(`${offset > 0 ? '次' : '前'}の動画に移動します`);
      setTimeout(() => {
        window.location.href = videoUrl;
      }, 1000);
    } else {
      showMessage(`ウォッチリストの${offset > 0 ? '最後' : '最初'}の動画です。`);
    }
  }

  function skipToNextVideo() {
    skipVideo(1);
  }
  function skipToPreviousVideo() {
    skipVideo(-1);
  }

  function createSettingsModal() {
    settingsModal = document.createElement('div');
    settingsModal.style.cssText = `
      display: none;
      position: fixed;
      z-index: 1001;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      background-color: rgba(0,0,0,0.4);
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background-color: #fefefe;
      margin-top: 20vh; margin-bottom: 0vh; margin-left: auto; margin-right: auto;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      width: 60vw;
      max-width: 640px;
    `;

    modalContent.innerHTML = `
      <h2 style="margin-top: 0; margin-bottom: 20px; color: #333; font-size: 1.5em;">設定</h2>
      <div style="margin-bottom: 15px;">
        <input type="checkbox" id="setting-autoplay" name="setting-autoplay" style="margin-right: 8px;">
        <label for="setting-autoplay" style="color: #555;">自動再生</label>
      </div>
      <div style="margin-bottom: 15px;">
        <label for="setting-playback-rate" style="display: block; margin-bottom: 5px; color: #555;">動画ページ読み込み時の初期再生速度:</label>
        <input type="number" id="setting-playback-rate" name="setting-playback-rate" min="0.25" max="4" step="0.25" value="1" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 80px; margin-right: 10px;">
        <span style="color: #777;">（1に設定すると変更しません）</span>
      </div>
      <div style="margin-bottom: 15px;">
        <label for="setting-playback-rate-step" style="display: block; margin-bottom: 5px; color: #555;">再生速度変更幅:</label>
        <input type="number" id="setting-playback-rate-step" name="setting-playback-rate-step" min="0.05" max="1" step="0.05" value="0.25" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 80px;">
      </div>
      <div style="margin-bottom: 15px;">
        <input type="checkbox" id="setting-browser-maximize" name="setting-browser-maximize" style="margin-right: 8px;">
        <label for="setting-browser-maximize" style="color: #555;">ブラウザ内最大化 (動画プレイヤーをブラウザウィンドウいっぱいに表示)</label>
      </div>
      <div style="margin-bottom: 15px;">
        <input type="checkbox" id="setting-auto-exit-fullscreen" name="setting-auto-exit-fullscreen" style="margin-right: 8px;">
        <label for="setting-auto-exit-fullscreen" style="color: #555;">再生終了時にフルスクリーン解除</label>
      </div>
      <div style="margin-bottom: 20px;">
        <input type="checkbox" id="setting-playlist-autoplay" name="setting-playlist-autoplay" style="margin-right: 8px;">
        <label for="setting-playlist-autoplay" style="color: #555;">プレイリスト連続再生</label>
      </div>
      <div style="text-align: right;">
        <button id="save-settings" style="padding: 10px 20px; background-color: #007BFF; color: white; border-radius: 4px; border: none; cursor: pointer; font-size: 14px; margin-right: 10px;" onmouseover="this.style.backgroundColor='#0056b3'" onmouseout="this.style.backgroundColor='#007BFF'">保存</button>
        <button id="close-settings" style="padding: 10px 20px; background-color: #6c757d; color: white; border-radius: 4px; border: none; cursor:pointer; font-size:14px;" onmouseover="this.style.backgroundColor='#5a6268'" onmouseout="this.style.backgroundColor='#6c757d'">閉じる</button>
      </div>
    `;

    settingsModal.appendChild(modalContent);
    addElementToNext(settingsModal);

    document.getElementById('save-settings').addEventListener('click', ()=>{
      saveSettings();
      closeSettingsModal();
    });
    document.getElementById('close-settings').addEventListener('click', closeSettingsModal);
  }

  function showSettingsModal() {
    loadSettings();
    settingsModal.style.display = 'block';
  }

  function closeSettingsModal() {
    settingsModal.style.display = 'none';
  }

  function updateUICSSVariables() {
    if (!isPlayerMaximized) return;

    const uiWidth = window.innerWidth - document.documentElement.clientWidth;
    const uiHeight = window.innerHeight - document.documentElement.clientHeight;

    if (uiWidth !== lastUIWidth) {
      document.documentElement.style.setProperty('--UIWidth', `${uiWidth}px`);
      lastUIWidth = uiWidth;
    }
    if (uiHeight !== lastUIHeight) {
      document.documentElement.style.setProperty('--UIHeight', `${uiHeight}px`);
      lastUIHeight = uiHeight;
    }
  }

  function addBrowserMaximizeStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .browser-maximize {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: calc(100vw - var(--UIWidth)) !important;
        height: calc(100vh - var(--UIHeight)) !important;
        max-width: none !important;
        z-index: 9999 !important;
        background: #000 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        scrollbar-width: none !important;
      }
      .browser-maximize > div {
        width: 100vw !important;
        height: 100vh !important;
        max-width: calc((100vh - var(--UIHeight)) * (16 / 9)) !important; /* アスペクト比16:9を維持 */
        max-height: calc((100vw - var(--UIWidth)) * (9 / 16)) !important; /* アスペクト比16:9を維持 */
        margin: 0 auto !important;
        position: relative !important;
        padding-top: unset !important; /* padding-top: 56.25%; */
      }
      .browser-maximize::-webkit-scrollbar {
        display: none !important;
      }
    `;
    // style.textContent = `
    //   .browser-maximize {
    //     position: fixed !important;
    //     top: 0 !important;
    //     left: 0 !important;
    //     width: 100vw !important;
    //     height: 100vh !important;
    //     max-width: none !important;
    //     z-index: 9999 !important;
    //     background: #000 !important;
    //     display: flex !important;
    //     align-items: center !important;
    //     justify-content: center !important;
    //     scrollbar-width: none !important;
    //     -ms-overflow-style: none !important;
    //   }
    //   .browser-maximize > div {
    //     width: 100vw !important;
    //     height: 100vh !important;
    //     max-width: calc(100vh * (16 / 9)) !important; /* アスペクト比16:9を維持 */
    //     max-height: calc(100vw * (9 / 16)) !important; /* アスペクト比16:9を維持 */
    //     margin: 0 auto !important;
    //     position: relative !important;
    //     padding-top: unset !important; /* padding-top: 56.25%; */
    //   }
    //   .browser-maximize::-webkit-scrollbar {
    //     display: none !important;
    //   }
    //   .overflow-hidden {
    //     overflow: hidden !important;
    //   }
    // `;
    document.head.appendChild(style);
  }

  function toggleBrowserMaximize() {
    const playerLayout = document.querySelector('div[class^="PlayerLayout_host"][js-fullscreen-target]');
    // const body = document.body;
    if(playerLayout){
      if (!playerLayout.classList.contains('browser-maximize')) {
        isPlayerMaximized = true;
        updateUICSSVariables();
        playerLayout.classList.add('browser-maximize');
        // body.classList.add('overflow-hidden');
      } else {
        playerLayout.classList.remove('browser-maximize');
        isPlayerMaximized = false;
        // body.classList.remove('overflow-hidden');
      }
    }
  }

  function handleFullscreenChange() {
    const playerLayout = document.querySelector('div[class^="PlayerLayout_host"][js-fullscreen-target]');
    const isFullscreen = document.fullscreenElement !== null;

    if (isFullscreen && playerLayout.classList.contains('browser-maximize')) {
      // ブラウザ内最大化状態でフルスクリーンモードになった場合
      toggleBrowserMaximize(); // ブラウザ内最大化を解除
      document.exitFullscreen().catch(err => console.error('フルスクリーン解除エラー:', err));
    }
  }

  function exitFullscreenOrMaximize() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (document.querySelector('.browser-maximize')) {
      toggleBrowserMaximize(); // ブラウザ内最大化解除
    } else if(document.body.classList.contains('overflow-hidden') || isPlayerMaximized == true){
      isPlayerMaximized = false;
      body.classList.remove('overflow-hidden');
    }
  }

  function saveSettings() {
    // const saveObj = {
    //   autoplay: document.getElementById('setting-autoplay').checked,
    //   playbackRate: parseFloat(document.getElementById('setting-playback-rate').value),
    //   playbackRateStep: parseFloat(document.getElementById('setting-playback-rate-step').value),
    //   browserMaximize: document.getElementById('setting-browser-maximize').checked,
    //   playlistAutoplay: document.getElementById('setting-playlist-autoplay').checked,
    //   autoExitFullscreenAtEnd: document.getElementById('setting-auto-exit-fullscreen').checked
    // };
    const elements = {
      autoplay: 'setting-autoplay',
      playbackRate: 'setting-playback-rate',
      playbackRateStep: 'setting-playback-rate-step',
      browserMaximize: 'setting-browser-maximize',
      playlistAutoplay: 'setting-playlist-autoplay',
      autoExitFullscreenAtEnd: 'setting-auto-exit-fullscreen'
    };

    const saveObj = Object.entries(elements).reduce((acc, [key, id]) => {
      const element = document.getElementById(id);
      acc[key] = element.type === 'checkbox' ? element.checked : parseFloat(element.value);
      return acc;
    }, {});

    Object.assign(settings, saveObj);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(saveObj));
  }

  function loadSettings() {
    document.getElementById('setting-autoplay').checked = settings.autoplay;
    document.getElementById('setting-playback-rate').value = settings.playbackRate;
    document.getElementById('setting-playback-rate-step').value = settings.playbackRateStep;
    document.getElementById('setting-browser-maximize').checked = settings.browserMaximize;
    document.getElementById('setting-playlist-autoplay').checked = settings.playlistAutoplay;
    document.getElementById('setting-auto-exit-fullscreen').checked = settings.autoExitFullscreenAtEnd;
  }

  function applyVideoSettings(vElement) {
    if (!vElement) {
      console.warn('Video element not found on episodes page');
      return false;
    }

    vElement.addEventListener('ended', handleVideoEnd);

    // 自動再生
    if (settings.autoplay) {
      // ブラウザ内最大化
      if (settings.browserMaximize) {
        toggleBrowserMaximize();
      }
      if (vElement.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        // 再生可能な状態ならすぐに再生
        document.querySelector('button[class^="PlayerThumbnail_playButton"]')?.click();
        console.log('Video started playing immediately.');
      } else {
        // 再生可能になるまで待機
        console.log('Waiting for video to be ready to play...');
        vElement.addEventListener('canplay', function onCanPlay() {
          vElement.removeEventListener('canplay', onCanPlay); // イベントリスナーを削除
          document.querySelector('button[class^="PlayerThumbnail_playButton"]')?.click();
          console.log('Video started playing after canplay event.');
        });
      }
    }

    // 再生速度
    if (settings.playbackRate !== 1) {
      settings.currentPlaybackRate = settings.playbackRate;
      // 再生後に速度変更
      setupPlaybackRateListener(vElement);
    }

    return true;
  }

  function addSettingsButton() {
    const settingsButton = document.createElement('button');
    settingsButton.id = 'settings-button';
    settingsButton.textContent = '設定';
    settingsButton.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 1000;
      padding: 6px 14px;
      border-radius: 5px;
      background-color: #1976d2;
      color: white;
      border: none;
      cursor: pointer;
      font-size: 1em;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;
    settingsButton.addEventListener('click', showSettingsModal);
    addElementToNext(settingsButton);
  }

  function isVideoPage() {
    return window.location.pathname.includes('/episodes/');
  }

//   function setupSwipeHandler(element, callbacks) {
//     let startX = 0;
//     let startY = 0;
//     let startTarget = null;
//     let isMoving = false;
//     const threshold = 30;

//     element.addEventListener('touchstart', function (e) {
//       if (e.touches.length === 1) {
//         const touch = e.touches[0];
//         startX = touch.clientX;
//         startY = touch.clientY;
//         startTarget = touch.target;
//         isMoving = true;
//       }
//     });

//     element.addEventListener('touchend', function (e) {
//       if (!isMoving) return;
//       isMoving = false;
//       const touch = e.changedTouches[0];
//       const deltaX = touch.clientX - startX;
//       const deltaY = touch.clientY - startY;

//       if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
//         if (callbacks.tap) callbacks.tap(startTarget);
//         return;
//       }

//       if (Math.abs(deltaX) > Math.abs(deltaY)) {
//         if (deltaX > 0) {
//           if (callbacks.right) callbacks.right(startTarget);
//         } else {
//           if (callbacks.left) callbacks.left(startTarget);
//         }
//       } else {
//         if (deltaY > 0) {
//           if (callbacks.down) callbacks.down(startTarget);
//         } else {
//           if (callbacks.up) callbacks.up(startTarget);
//         }
//       }
//     });
//   }

//   setupSwipeHandler(document.body, {
//     up: (el) => {
//       if (el && typeof el.focus === 'function') el.focus(); // フォーカスする場合
//       addToWatchList(el);
//     },
//     down: (el) => {
//     },
//     tap: (el) => {
//     }
//   });

  window.addEventListener('keydown', (event) => {
    // 動画ページかどうかを判定
    const videoPage = isVideoPage();
    // const isWatchListOpen = document.getElementById('watchlist-modal')?.style.display === 'block';

    const isInputActive = (() => {
      let el = document.activeElement;;
      while (el) {
        if (el.matches('input, textarea, [contenteditable]')) return true;
        el = el.shadowRoot?.activeElement;
      }
      return false;
    })();

    if(isInputActive) return false;

    // すべてのページで有効なショートカットキー
    if (event.code === 'F1' || (event.key === '?')) {
      event.preventDefault();
      if (isFullscreen()) {
        exitFullscreen();
        setTimeout(toggleModal, 100);
      } else {
        toggleModal();
      }
      return;
    }

    // if (isWatchListOpen && event.key.toLowerCase() === 'c') {
    if (event.key.toLowerCase() === 'c') {
      event.preventDefault();
      clearWatchList();
    }

    if (event.key.toLowerCase() === 's') {
      event.preventDefault();
      if (settingsModal.style.display === 'block') {
        closeSettingsModal();
      } else {
        showSettingsModal();
      }
    }

    if (event.key.toLowerCase() === 'p') {
      event.preventDefault();
      if (videoPage) {
        skipToPreviousVideo();
      } else {
        playFirstVideo();
      }
      return;
    }

    if (event.key.toLowerCase() === 'a') {
      event.preventDefault();
      addToWatchList();
      return;
    }

    if (event.key.toLowerCase() === 'l') {
      event.preventDefault();
      togglePlaylistModal();
      return;
    }

    // 動画再生ページでのみ有効なショートカットキー
    if (videoPage) {
      // 再生速度変更（+/-）
      if (event.key === '+' || event.key === '=' || event.key === '>') {
        event.preventDefault();
        changePlaybackRateRelative(settings.playbackRateStep);
      }

      if (event.key === '-' || event.key === '<') {
        event.preventDefault();
        changePlaybackRateRelative(-settings.playbackRateStep);
      }

      // シーク操作（数字キー）
      const seekMap = {
        '1': -10, '3': 10,
        '4': -30, '6': 30,
        '7': -60, '9': 60,
        '8': 80,
      };

      if (seekMap[event.key]) {
        event.preventDefault();
        seekVideo(seekMap[event.key]);
      }

      // 特殊操作
      if (event.key.toLowerCase() === 'q') {
        event.preventDefault();
        window.close();
      }

      if (event.key.toLowerCase() === 'n') {
        event.preventDefault();
        skipToNextVideo();
      }
    }
  });

  let initTimer;


  const observer = new MutationObserver((mutations) => {
    clearTimeout(initTimer);
    initTimer = setTimeout(() => {
      init();
    }, 100);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  function detectSPATransition(){
    settings.currentURL = window.location.href;

    // SPA遷移時に実行する処理
    function handleSPATransition() {
      console.log('SPA遷移後の処理を実行します');
      playbackRateListener = null;

      if (window.location.pathname.includes('/episodes/')) {
        const nextNode = document.querySelector('#__next');
        if (!nextNode) return;

        const observer = new MutationObserver((mutations) => {
          clearTimeout(initTimer);
          initTimer = setTimeout(() => {
            const vElement = getVideoElement();
            const isCompleted = applyVideoSettings(vElement);
            if(isCompleted){
              observer.disconnect();
              detectSPATransition();
            }
          }, 100);
        });

        observer.observe(nextNode, {
          childList: true,
          subtree: true
        });
      }else{
        exitFullscreenOrMaximize();
        detectSPATransition();
      }
    }

    // Mutation Observerの設定
	  const observer = new MutationObserver((mutations) => {
	    mutations.forEach((mutation) => {
	      if (mutation.removedNodes.length > 0) {
	        mutation.removedNodes.forEach((node) => {
	          if (node.tagName === 'MAIN' || node.tagName === 'DIV') {
              if(settings.currentURL !== window.location.href){
                settings.currentURL = window.location.href;
                observer.disconnect();
                console.log('SPA的な遷移が検知されました');
                handleSPATransition(); // 遷移時に実行する処理
              }
	          }
	        });
	      }
	    });
	  });

	  // 監視対象となる親ノード
	  // const targetNode = window.location.pathname.includes('/episodes/') ? document.querySelector('[class^="PlayerLayout_jail__"]') : document.querySelector('#__next');
	  // if (targetNode) {
	  //   observer.observe(targetNode, {childList: true});
	  //   console.log('Mutation Observerが設定されました');
	  // } else {
	  //   console.error('監視対象ノードが見つかりませんでした');
	  // }
    let targets = [];

    const nextNode = document.querySelector('#__next');
    const mainNode = document.querySelector('#__next [class^="AppLayout_main__"]');

    if (nextNode) targets.push(nextNode);
    if (mainNode) targets.push(mainNode);

    if (window.location.pathname.includes('/episodes/')) {
      const jailNode = document.querySelector('[class^="PlayerLayout_jail__"]');

      if (jailNode) targets.push(jailNode);
    }

    if (targets.length > 0) {
      for (const node of targets) {
        observer.observe(node, { childList: true });
      }
      console.log('Mutation Observerが設定されました');
    } else {
      console.error('監視対象ノードが見つかりませんでした');
    }
  }

  function handleVideoEnd() {
    const nextVideoUrl = getAdjacentVideoUrl(1);

    if (settings.playlistAutoplay && nextVideoUrl) {
      navigateToNextVideo();
    } else {
      if (settings.autoExitFullscreenAtEnd) {
        exitFullscreenOrMaximize();
      }
      console.log('Playback ended. Exiting fullscreen or maximize if enabled.');
    }
  }

  function initSettings() {
    createSettingsModal();
    addSettingsButton();
    addBrowserMaximizeStyles();
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('resize', updateUICSSVariables);
  }

  function initVideoPage() {
    const vElement = getVideoElement();
    if (!vElement) {
      console.warn('Video element not found on episodes page');
      return false;
    }
//       if (vElement) {
//         const events = [
//           'play', 'pause', 'playing', 'seeking', 'seeked', 'ended',
//           'loadstart', 'durationchange', 'loadedmetadata', 'loadeddata', 'progress', 'canplay', 'canplaythrough',
//           'volumechange',
//           'ratechange',
//           'error',
//           'timeupdate', 'waiting', 'stalled', 'suspend'
//         ];

//         events.forEach(eventName => {
//           vElement.addEventListener(eventName, (event) => {
//             console.log(`動画イベントが発生しました: ${event.type}`);
//           });
//         });
//       }

    // applyVideoSettingsに移動
    // vElement.addEventListener('ended', handleVideoEnd);

    // SPA対応に伴い移動
    // addBrowserMaximizeStyles();
    // document.addEventListener('fullscreenchange', handleFullscreenChange);
    applyVideoSettings(vElement);
    return true;
  }

  function initOtherPages() {
    // initDragAndDrop();//createPlaylistModalで呼んでいるので不要
    return true;
  }

  function init() {
    try {
      let isInitialized = false;

      if (window.location.pathname.includes('/episodes/')) {
        isInitialized = initVideoPage();
      } else {
        isInitialized = initOtherPages();
      }
      if(isInitialized){
        observer.disconnect();
        initSettings();
        detectSPATransition();
        console.log('init completed');
      }
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }

}

if (window.top === window.self) {
    main();
}
// ==UserScript==
// @name        Waze Editor Clock
// @namespace   waze-editor-clock
// @version     1.8
// @description Wazeエディターにドラッグ可能でサイズ変更可能な装飾付き時計を表示します
// @author      Bard
// @match       https://www.waze.com/ja/editor?env=*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/494263/Waze%20Editor%20Clock.user.js
// @updateURL https://update.greasyfork.org/scripts/494263/Waze%20Editor%20Clock.meta.js
// ==/UserScript==

// 時計要素
const clockElement = document.createElement('div');
clockElement.id = 'waze-editor-clock';
clockElement.style.cssText = `
  position: fixed;
  bottom: 19px;
  left: 50%; /* 中央揃え */
  transform: translateX(-50%);
  z-index: 1000;
  background-color: #007bff; /* 背景色を青に変更 */
  color: #fff; /* テキスト色を白に変更 */
  padding: 10px;
  border-radius: 5px; /* 角を丸くする */
  font-size: 23px;
  cursor: move; /* 時計をドラッグ可能にする */
  aspect-ratio: 1; /* アスペクト比を維持する */
  resize: both; /* サイズ変更を有効にする */
  overflow: hidden; /* サイズ変更中のオーバーフローを隠す */
  min-width: 100px; /* 最小幅を設定 */
  min-height: 40px; /* 最小高さを設定 */
  text-align: center; /* テキストを中央揃えにする */
`;

// ローカルストレージから時計の位置とサイズを読み込む
const storedClockStyle = localStorage.getItem('wazeEditorClockStyle');
if (storedClockStyle) {
  clockElement.style.cssText = storedClockStyle;
}

// ドラッグイベントを処理する関数
function handleDrag(event) {
  const newX = event.clientX - offsetX;
  const newY = event.clientY - offsetY;
  // アスペクト比を維持するため、垂直方向の移動を制限する
  if (newY >= 0 && newY + clockElement.offsetHeight <= window.innerHeight) {
    clockElement.style.left = newX + 'px';
    clockElement.style.top = newY + 'px';
    // 新しい位置をローカルストレージに保存する
    saveClockStyle();
  }
}

// ドラッグを開始する関数
function startDrag(event) {
  offsetX = event.clientX - clockElement.getBoundingClientRect().left;
  offsetY = event.clientY - clockElement.getBoundingClientRect().top;
  window.addEventListener('mousemove', handleDrag);
  window.addEventListener('mouseup', stopDrag);
}

// ドラッグを停止する関数
function stopDrag() {
  window.removeEventListener('mousemove', handleDrag);
  window.removeEventListener('mouseup', stopDrag);
}

// 時計のスタイルをローカルストレージに保存する関数
function saveClockStyle() {
  localStorage.setItem('wazeEditorClockStyle', clockElement.style.cssText);
}

// ドラッグ中のオフセットを格納する変数
let offsetX, offsetY;

// 時計をドラッグ可能にする
clockElement.addEventListener('mousedown', startDrag);

// 1秒ごとに時計を更新する
setInterval(() => {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  // 秒を時計表示から削除する
  clockElement.textContent = `${hours}:${minutes}`;
}, 1000);

// 時計要素をbodyに追加する
document.body.appendChild(clockElement);

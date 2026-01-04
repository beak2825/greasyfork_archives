// ==UserScript==
// @name            hinatazaka46-photo-modlizer
// @namespace       https://greasyfork.org/ja/users/1328592-naoqv
// @description	    Perform base processing
// @description:ja  Modal photo display
// @version         0.01
// @icon            https://cdn.hinatazaka46.com/files/14/hinata/img/favicons/favicon-32x32.png
// @grant           none
// @license         MIT
// ==/UserScript==

/*
 * 画像をモーダル表示
 * @param {string} src imgタグのsrc要素
 */
function openModal(src) {
  // モーダル要素を作成
  const modal = document.createElement('div');
  modal.innerHTML = `<img src="${src}">`;
  modal.classList.add('modal');

  // モーダルの表示
  document.body.appendChild(modal);
  modal.style.display = 'flex';

  // モーダルのクリックイベント（モーダルを閉じる）
  modal.addEventListener('click', () => {
    closeModal(modal);
  });
}

function closeModal(modal) {
  // フェードアウトアニメーションを適用
  modal.style.animation = 'modalFadeOut 0.3s forwards';

  // アニメーションが終了したらモーダルを削除
  modal.addEventListener('animationend', () => {
    modal.style.display = 'none';
    document.body.removeChild(modal);
  });
}

/*
 * モーダル表示イベントをブログ画像に追加
 */
const setModalEvent = (imgSelector) => {

 document.appendStyle(`
    .modal {
      display: none;
      position: fixed;
      z-index: 20000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgb(0,0,0);
      background-color: rgba(0,0,0,0.9);
      align-items: center;
      justify-content: center;
      animation: modalFadeIn 0.3s;
    }
    .modal img {
      max-width: 90%;  /* 画像の最大幅を親要素(modal)の90%に制限し、画面内に収まるようにする */
      max-height: 100vh;  /* 画像の最大高さをビューポートの高さ(100vh)に制限し、画面内に収まるようにする  */
      object-fit: contain;  /* 画像の比率を保持しつつ、指定された高さと幅に収める */
    }
    .clickable-image:hover {
      cursor: zoom-in;  /* ホバー時にカーソルをズームインのアイコンに変更 */
    }
    .modal img:hover {
      cursor: zoom-out;  /* モーダル内の画像にホバー時にカーソルをズームアウトのアイコンに変更 */
    }
    @keyframes modalFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes modalFadeOut {
      from { opacity: 1; }
    }`);

  Array.prototype.forEach.call(document.querySelectorAll(imgSelector), (image) => {
    image.classList.add('clickable-image')
    image.addEventListener('click', function() {
      openModal(image.src);
    });
  });
};

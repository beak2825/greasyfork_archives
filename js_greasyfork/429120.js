// ==UserScript==
// @name     akahuku.spの動画プレビューをリサイズ可能にする
// @version  1.00
// @include  https://*.2chan.net/*/res/*
// @include  http://*.2chan.net/*/res/*
// @description akahuku.spの動画プレビューをリサイズ可能にします
// @namespace https://greasyfork.org/users/114367
// @downloadURL https://update.greasyfork.org/scripts/429120/akahukusp%E3%81%AE%E5%8B%95%E7%94%BB%E3%83%97%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC%E3%82%92%E3%83%AA%E3%82%B5%E3%82%A4%E3%82%BA%E5%8F%AF%E8%83%BD%E3%81%AB%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/429120/akahukusp%E3%81%AE%E5%8B%95%E7%94%BB%E3%83%97%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC%E3%82%92%E3%83%AA%E3%82%B5%E3%82%A4%E3%82%BA%E5%8F%AF%E8%83%BD%E3%81%AB%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==

// CSS
var style = document.createElement('STYLE');
style.type = 'text/css';
style.appendChild(document.createTextNode(`
.akahuku_resizable_video_container:hover {
  overflow: hidden;
  resize:both;
}
`));
document.head.appendChild(style);

// メイン
const toResizable = video => {
  // akahuku_preview_containerを取得する
  let container = video.parentNode;
  while (container) {
    if (container.classList.contains('akahuku_preview_container')) break;
    container = container.parentNode;
  }
  if (!container) return;
  // videoのサイズをcontainerに移行しつつリサイズ可能にする
  const rect = container.getBoundingClientRect();
  container.classList.add('akahuku_resizable_video_container');
  container.style.width = rect.width + 'px';
  container.style.height = rect.height + 'px';
  container.style.margin = video.style.margin;
  video.style.maxWidth = '100%';
  video.style.maxHeight = '100%';
  video.style.margin = '';
};

// DOM監視
var observer = new MutationObserver(mutList => {
  for (let mut of mutList) {
    if (mut.type !== 'childList') continue;
    for (let video of mut.addedNodes) {
      if (video.tagName !== 'VIDEO') continue;
      if (!video.classList.contains('akahuku_preview')) continue;
      requestAnimationFrame(() => { toResizable(video); });
    }
  }
});
observer.observe(document.body, { childList: true, subtree: true });

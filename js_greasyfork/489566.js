// ==UserScript==
// @name        blink-star
// @namespace   jp.hateblo.htsign
// @description はてなブックマークにて、自分が付けたスターを点滅させて見分けがつくようにします。
// @match       http://b.hatena.ne.jp/*
// @match       https://b.hatena.ne.jp/*
// @version     1.0.8
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/489566/blink-star.user.js
// @updateURL https://update.greasyfork.org/scripts/489566/blink-star.meta.js
// ==/UserScript==

(async g => {
  const root = g.document.documentElement;
  if (!root || !root.dataset.pageScope) return;

  const res = await fetch(`${g.origin}/api/my/profile`, { credentials: 'include' });
  const { status, name } = await res.json();
  if (status !== 1) return;

  const style = g.document.createElement('style');
  g.document.head.appendChild(style);

  style.sheet.insertRule(`
    @keyframes blink-star {
      from { opacity: 1.0 }
      to   { opacity: 0.3 }
    }`);
  style.sheet.insertRule(`
    a.hatena-star-star[href$="/${name}"] {
      animation: blink-star 300ms infinite ease-in alternate;
    }`);
})(window);

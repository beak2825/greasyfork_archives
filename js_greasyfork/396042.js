// ==UserScript==
// @name        Hatena Bookmark Users Filter
// @description はてなブックマークの検索結果ページで、ブックマーク数によるフィルタリング選択肢を改変します。
// @namespace   knoa.jp
// @include     https://b.hatena.ne.jp/search/*
// @version     1.0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/396042/Hatena%20Bookmark%20Users%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/396042/Hatena%20Bookmark%20Users%20Filter.meta.js
// ==/UserScript==

/*
正常動作を確認しました。
*/
(function(){
  const COUNTS = [1, 3, 10, 30, 100, 300, 1000];
  const DEFAULT = 3;
  let current = location.href.includes('&users=') ? parseInt(location.href.match(/&users=([0-9]*)/)[1]) : DEFAULT;
  let filterH3s = document.querySelectorAll('.left-container h3');
  let countsH3 = Array.from(filterH3s).find(h3 => h3.textContent === 'ブックマーク数');
  if(countsH3 === undefined) return console.log('Not found H3.');
  let countsUl = countsH3.parentNode.querySelector('ul');
  let countsLis = countsUl.querySelectorAll('ul > li');
  while(countsUl.children.length > 1) countsUl.removeChild(countsUl.lastElementChild);
  COUNTS.forEach(c => {
    if(c === 1) return;
    let li = countsLis[0].cloneNode(true);
    let a = li.querySelector('a');
    if(a === null) return console.log('Not found a.');
    if(c === current) a.classList.add('is-current');
    else a.classList.remove('is-current');
    a.href = a.href.replace(/(&users)=1\b/, '$1=' + c);
    a.textContent = c + ' users';
    countsUl.appendChild(li);
  });
})();
// ==UserScript==
// @name        Hatena Bookmark Stars Highlighter
// @description はてなブックマークの個別ブックマークページで、スターの数に応じてブックマークコメントをハイライトさせます。
// @namespace   knoa.jp
// @include     https://b.hatena.ne.jp/entry/*
// @noframes
// @run-at      document-idle
// @version     1.1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/376291/Hatena%20Bookmark%20Stars%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/376291/Hatena%20Bookmark%20Stars%20Highlighter.meta.js
// ==/UserScript==

/*
[update] 1.1.0
コード改良。

[possible]
トップ10に限定されるのがもったいないので11以降も状況に応じた数だけ表示させたい
「新しいブコメなのにスターを集めている」のも新タブか何かで目立たせたい
古いブクマでtop10がない場合も補いたい
URL /s/なしがあればマージまたはせめて案内リンク
自分にスターを付けてくれた人によるブクマも目立たせたいかも
  自分のお気に入りブクマカも？？？
ブックマークしたすべてのユーザーを見通しよくしたいけど、スクロール量に応じるのかオートロードが効かなくなる
  .js-all-bookmarkers-modal h4 + div{
    max-height: calc(100vh - 177px);
  }

*/

(function () {
  const SCRIPTNAME = 'Hatena Bookmark Stars Highlighter';
  console.log(SCRIPTNAME);
  let as, i;
  /* ついでに一仕事 */
  /* サイト内ブクマリストを人気順にする */
  if (as = document.querySelectorAll('.entry-info-domain a')) {
    for (i = 0; i < as.length; i++) {
      as[i].href = as[i].href + '&sort=count';
    }
  }
  /* ここから本作業 */
  // 頻発するMutationObserverよりsetIntervalのほうがマシということで。
  // スターサーバーが遅いことも多々ある。よってIntervalでよい。
  if(document.hidden === false) ready();
  else window.addEventListener('visibilitychange', ready, {once: true});
  function ready(){
    highlight();
    setInterval(highlight, 1000);
  }
  function highlight(){
    console.log(SCRIPTNAME, 'ready');
    let spans, i;
    /* 一度確認したらフラグ立てる方式は読み込み遅延やコンテナが開かれたときに注意が必要 */
    spans = document.querySelectorAll('.entry-comment span.js-list-star-container');
    for (i = 0; spans && spans[i]; i++) {
      switch(true){
        case (32 <= spans[i].getElementsByTagName('a').length):
          spans[i].parentNode.parentNode.parentNode.style.background = '#ffff00';
          break;
        case (16 <= spans[i].getElementsByTagName('a').length):
          spans[i].parentNode.parentNode.parentNode.style.background = '#ffff80';
          break;
        case (8 <= spans[i].getElementsByTagName('a').length):
          spans[i].parentNode.parentNode.parentNode.style.background = '#ffffc0';
          break;
        case (4 <= spans[i].getElementsByTagName('a').length):
          spans[i].parentNode.parentNode.parentNode.style.background = '#ffffe0';
          break;
        case (2 <= spans[i].getElementsByTagName('a').length):
          spans[i].parentNode.parentNode.parentNode.style.background = '#fffff0';
          break;
      }
    }
    /* 16スター以上のまとまり */
    spans = document.querySelectorAll('.entry-comment span.hatena-star-inner-count'); //16<
    for (i = 0; spans && spans[i]; i++) {
      switch(true){
        case (32 <= spans[i].textContent):
          spans[i].parentNode.parentNode.parentNode.parentNode.style.background = '#ffff00';
          break;
        default:
          spans[i].parentNode.parentNode.parentNode.parentNode.style.background = '#ffff80';
          break;
      }
    }
  }
})();

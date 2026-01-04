// ==UserScript==
// @name        Bing検索結果の"さらに表示"を強制表示させる
// @version     0.1
// @description Bing検索結果ページにおいて、ウィンドウ幅が1082px以下になったら、検索結果を左に-113.5px寄せ、一番右端までスクロールしてすぐに一番左端に戻ります。
// @author       Bard
// @match       https://www.bing.com/search*
// @grant       none
// @namespace https://greasyfork.org/users/1266001
// @downloadURL https://update.greasyfork.org/scripts/488120/Bing%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E3%81%AE%22%E3%81%95%E3%82%89%E3%81%AB%E8%A1%A8%E7%A4%BA%22%E3%82%92%E5%BC%B7%E5%88%B6%E8%A1%A8%E7%A4%BA%E3%81%95%E3%81%9B%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/488120/Bing%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E3%81%AE%22%E3%81%95%E3%82%89%E3%81%AB%E8%A1%A8%E7%A4%BA%22%E3%82%92%E5%BC%B7%E5%88%B6%E8%A1%A8%E7%A4%BA%E3%81%95%E3%81%9B%E3%82%8B.meta.js
// ==/UserScript==

(function() {
  // ウィンドウサイズが変化した時に実行
  window.addEventListener('resize', function() {
    if (window.innerWidth <= 1082) {
      // 検索結果を左に寄せる
      const contentElement = document.getElementById('b_content');
      contentElement.style.marginLeft = '-113.5px';

      // スクロールを開始
      setTimeout(function() {
        const scrollInterval = setInterval(function() {
          // 最右端までスクロール
          if (document.documentElement.scrollLeft + window.innerWidth >= document.documentElement.scrollWidth) {
            clearInterval(scrollInterval);
            // 一番左端に戻る
            document.documentElement.scrollLeft = 0;
          } else {
            // スクロール速度を調整
            document.documentElement.scrollLeft += window.innerWidth;
          }
        }, 10);
      }, 10);
    } else {
      // ウィンドウ幅が1082pxを超えたら、左寄せを解除
      const contentElement = document.getElementById('b_content');
      contentElement.style.marginLeft = '0px';
    }
  });

  // 初期化
  window.dispatchEvent(new Event('resize'));
})();
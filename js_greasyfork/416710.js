// ==UserScript==
// @name        * AutoPagerize LazyLoad Assistant
// @name:ja     * AutoPagerize LazyLoad Assistant
// @name:zh-CN  * AutoPagerize LazyLoad Assistant
// @namespace   knoa.jp
// @description It fixes the lazy load image problem of some AutoPagerize scripts, extensions or add-ons, occuring on second or latter pages.
// @description:ja 一部の AutoPagerize スクリプト、拡張機能、アドオンで発生する、2ページ目以降の遅延読み込み画像の問題を修正します。
// @description:zh-CN 修复某些 AutoPagerize 脚本、扩展和附加中出现的第二页或更高版本的延迟加载图像问题。
// @include     *
// @version     2.0.4
// @grant       GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/416710/%2A%20AutoPagerize%20LazyLoad%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/416710/%2A%20AutoPagerize%20LazyLoad%20Assistant.meta.js
// ==/UserScript==

/*
[update]
2025-05-18 2.0.0 サイト指定制御対応(togetter/posfie対応)
2025-09-28 2.0.1 Firefox版uAutoPagerizeで起きていたエラーを修正。(Firefox向けのweAutoPagerizeがFirefox 144で動作しなくなり、uAutoPagerizeに乗り換えてみたら発覚)
2025-10-28 2.0.2 togetter/posfieの仕様変更に対応。posfie.com で2ページ目以降も画像のライトボックス表示に対応。
posfieだけライトボックスが動作しなかったのは、10-28に気付いたばかりなので、最近発生した不具合の可能性もある？
今後、posfieで解消する可能性もあるいっぽうで、togetterでも追随して発生してしまう可能性もあるが、本バージョン2.0.2で対応できるはず。
2025-11-01 2.0.3 Chrome版uAutoPagerizeに対応。(多くの場合不要だと思うが、今現在はtogetter/posfieで本スクリプトがないと2ページ目の画像が表示されない)
2025-11-04 2.0.4 Googleの検索結果に対応。
*/
(function() {
  const SCRIPTID = 'AutoPagerizeLazyLoadAssistant';
  const FLAGNAME = 'lazyLoadAssistant';
  const DATASETS = [
    'src',
    'lazySrc',
    'original',
    'delay',
    'img',
  ];
  const CALLBACKS = {
    id: async () => {},
    google: async () => {
      console.log(SCRIPTID, 'callback: google');
      // 各検索結果の後に挿入されるscriptをそれぞれ実行させればよい。(他のサイトにも流用できる可能性がある)
      document.querySelectorAll('.autopagerize_page_info:last-of-type ~ * script').forEach(s => {
        const script = document.createElement('script');
        script.textContent = s.textContent;
        s.after(script);
      });
    },
    togetter: async () => {
      console.log(SCRIPTID, 'callback: togetter');
      // togetter/posfie は img の data-s 属性の数字が head 内 script 要素の usedImages 配列に対応する。
      // 画像ギャラリー表示の際には https://togetter.com/api/getImageList にPOSTを投げて全画像を取得しているようだが活用しづらいしプロフィールアイコンなども含まれない。
      // autopazerizeはスクリプトに対して2ページ目以降のdocumentを取得させてくれないので、独自に取得しに行くしかない。
      const as = document.querySelectorAll('a.autopagerize_link[href]');
      if(as.length === 0) return console.log(SCRIPTID, 'autopagerize_link not found.');
      const a = Array.from(as).at(-1);
      const r = await GM.xmlHttpRequest({url: a.href}).catch(e => console.error(SCRIPTID, e));
      const scripts = r.responseXML.querySelectorAll('head > script[type="text/javascript"]:not([src])'); //usedImages配列見込みを絞っているがセレクタとしては脆い。
      if(scripts.length === 0) return console.log(SCRIPTID, 'script not found.');
      const script = Array.from(scripts).find(s => s.textContent.includes(' usedImages = ')); //判定としてはやや弱い
      if(script === undefined) return console.log(SCRIPTID, 'usedImages not found.');
      const srcs = script.textContent.match(/"[^"]+?"/g).map(s =>
        s.slice(1, -1) //前後の引用符を取り除く
        .replace(/\\/g, '') //エスケープ文字を取り除く
        .replace(/^p/, 'https://pbs.twimg.com/profile_images/') //profileはサイト解析で確認した置換処理。
        .replace(/^m/, 'https://pbs.twimg.com/media/') //2025-10-25ごろから新規に置換が必要になった。
      );
      const imgs = document.querySelectorAll('.autopagerize_page_info ~ * img[data-s]'); //対象となる2ページ目以降をシンプルに取得してあとから適用済みを除外する
      imgs.forEach(img => {
        if(img.dataset[FLAGNAME]) return; //本スクリプトが適用済
        if(img.dataset.s.startsWith('https:')) img.dataset.src = img.dataset.s;//動画サムネの場合はdata.sにURLが直接入っている。
        else img.dataset.src = srcs[parseInt(img.dataset.s)];//通常はdata.sに数字のみが入っている。
        // ※実際のimg.srcに入れるのは後の共通処理で行う。
        // 画像削除済みで404などの場合、本家はデフォルトアイコンに差し替える処理をしている。
        img.addEventListener('error', e => {img.src = srcs[parseInt(img.dataset.e)]});
        // (以下は posfie.com でのみ必要だが togetter.com でも誤動作を起こすわけではないので共通で処理する)
        // クリック時のライトボックス表示も付与してあげなければならない。(自動で付与されないのは一時的な不具合の可能性もある)
        // 正規のクリックイベント処理を付与するのは困難なので、1ページ目で既にイベントが付与されている div.list_box 要素に処理を肩代わりさせる。
        if(img.parentNode.classList.contains('list_photo')){
          img.addEventListener('click', e => {
            const dummyListBox = document.querySelector('div.list_box[data-index]');
            const originalIndex = dummyListBox.dataset.index;// あとで元に戻すために保存
            dummyListBox.dataset.index = img.parentNode.parentNode.parentNode.dataset.index;// data-index 属性値さえ偽装すれば期待する画像が表示される
            const clonedListPhotoBox = img.parentNode.parentNode.cloneNode(true);// ライトボックス表示のためには div.list_photo_box > figure.list_photo > img の3層構造が必要。
            const clonedImg = clonedListPhotoBox.querySelector(`img[data-s="${img.dataset.s}"]`);// clickイベントの発火要素
            dummyListBox.append(clonedListPhotoBox);// もともとdummyListBoxも画像要素を持っていれば不要ではあるが、一律で付与しておく
            clonedImg.click();
            dummyListBox.dataset.index = originalIndex;// 元に戻しておく
            clonedListPhotoBox.remove();// 消しておく
          });
        }
      });
    },
  };
  const SITES = {
    'host': CALLBACKS.id,
    'posfie.com': CALLBACKS.togetter,
    'togetter.com': CALLBACKS.togetter,
    'www.google.co.jp': CALLBACKS.google,
    'www.google.com': CALLBACKS.google,
  };
  let dataset = undefined; //サイトで使われている lazyload dataset名。一度確定したら変わらない。
  let callback = SITES[location.host]; //サイト指定制御が存在していれば。
  document.addEventListener('GM_AutoPagerizeNextPageLoaded', async e => {
    console.log(SCRIPTID, 'event:', e);
    if(callback) await callback();
    const imgs = document.querySelectorAll('img'); //ここで FLAGNAME 付きを除外する処理は重いのでシンプルに全取得する
    for(let i = 0; imgs[i]; i++){
      // 画像srcが入ったdataset名を判定する
      if(dataset === undefined){
        dataset = DATASETS.find(n => imgs[i].dataset[n]);
        if(dataset) console.log(SCRIPTID, 'dataset:', dataset);
        else continue;
      }
      // 処理済ならスキップ
      if(imgs[i].dataset[FLAGNAME]) continue;
      // 画像src処理
      if(imgs[i].dataset[dataset]){
        imgs[i].src = imgs[i].dataset[dataset];
        imgs[i].style.opacity = 1; //一部のサイトに必要
        imgs[i].style.visibility = 'visible'; //一部のサイトに必要
        imgs[i].dataset[FLAGNAME] = 'true';
      }
    }
  });
})();
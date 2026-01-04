// ==UserScript==
// @name                YouTube AdBon
// @name:en             YouTube AdBon
// @name:zh-CN          YouTube AdBon
// @name:ja             YouTube AdBon
// @version             0.1.10
// @namespace           YouTube
// @icon                https://cdn.jsdelivr.net/gh/yt-poor/yt-poor-min@0888fb36abd01ab985c5dc7d624e728d799c582d/icon.png
// @match               *://www.youtube.com/*
// @match               *://studio.youtube.com/*
// @match               *://www.youtube-nocookie.com/embed/*
// @match               *://m.youtube.com/*
// @match               *://www.youtubekids.com/*
// @exclude             *://www.youtube.com/live_chat*
// @exclude             *://studio.youtube.com/live_chat*
// @exclude             *://studio.youtube.com/persist_identity
// @exclude             *://www.youtube.com/persist_identity
// @author              -
// @require             https://cdn.jsdelivr.net/gh/yt-poor/yt-poor-min@422f12c44f75ed295d0f5cf3c7e08956e04435de/yt-poor-min-require.js
// @run-at              document-start
// @grant               none
// @unwrap
// @allFrames           true
// @inject-into         page
// @description         YouTube 禁止使用廣告攔截器。你似乎使用了廣告攔截器。有了廣告，YouTube 才能為全球數十億名使用者提供服務。如果你想觀看無廣告內容，可以訂閲 YouTube Premium，這樣創作者還是能賺取訂閱收益。
// @description:en      Ad blockers are not allowed on YouTube. It looks like you may be using an ad blocker. Ads allow YouTube to stay free for billions of users worldwide. You can go ad-free with YouTube Premium, and creators can still get paid from your subscription.
// @description:zh-CN   YouTube 不允许使用广告拦截器。你似乎在使用广告拦截器。广告让全球数十亿名用户能够使用 YouTube。你可以订阅 YouTube Premium，畅享无广告打扰的体验，而创作者通过你的订阅仍然可以赚取收入。
// @description:ja      広告ブロッカーの利用は、YouTube の利用規約で認められていません。広告ブロッカーを使用されているようです。YouTubeを許可リスト（アローリスト）に登録するか、広告ブロッカー自体を無効にしない場合、動画の再生がブロックされることがあります。世界で数十億人に上るユーザーが YouTube を使えるのは、広告のおかげです。YouTube Premium に加入すると広告なしでもクリエイターがあなたの視聴によって収益を得ることをサポートできます
// @downloadURL https://update.greasyfork.org/scripts/523405/YouTube%20AdBon.user.js
// @updateURL https://update.greasyfork.org/scripts/523405/YouTube%20AdBon.meta.js
// ==/UserScript==
(({ warning }, showLang = 'zh-TW') => {
  showLang = document?.documentElement?.lang || showLang;
  while (1) {
    switch (showLang) {
      case 'zh-TW':
        warning('YouTube 禁止使用廣告攔截器', 12);
        warning('你似乎使用了廣告攔截器。');
        warning('有了廣告，YouTube 才能為全球數十億名使用者提供服務。');
        warning('如果你想觀看無廣告內容，可以訂閲 YouTube Premium，這樣創作者還是能賺取訂閱收益。');
        return;
      case 'en':
        warning('Ad blockers are not allowed on YouTube', 12);
        warning('It looks like you may be using an ad blocker.');
        warning('Ads allow YouTube to stay free for billions of users worldwide.');
        warning('You can go ad-free with YouTube Premium, and creators can still get paid from your subscription.');
        return;
      case 'zh-CN':
        warning('YouTube 不允许使用广告拦截器', 12);
        warning('你似乎在使用广告拦截器。');
        warning('广告让全球数十亿名用户能够使用 YouTube。');
        warning('你可以订阅 YouTube Premium，畅享无广告打扰的体验，而创作者通过你的订阅仍然可以赚取收入。');
        return;
      case 'ja':
      case 'ja-JP':
        warning('広告ブロッカーの利用は、YouTube の利用規約で認められていません', 12);
        warning('広告ブロッカーを使用されているようです。YouTubeを許可リスト（アローリスト）に登録するか、広告ブロッカー自体を無効にしない場合、動画の再生がブロックされることがあります。');
        warning('世界で数十億人に上るユーザーが YouTube を使えるのは、広告のおかげです。');
        warning('YouTube Premium に加入すると広告なしでもクリエイターがあなたの視聴によって収益を得ることをサポートできます');
        return;
      default:
        showLang = 'en';
    }
  }
})({ warning: (x, d, b = '#ff4141') => setTimeout(console.log.bind(console, `%c${x}`, `color: #ff0000; font-size:${d || 9}pt; text-shadow: 0 0 0.7px ${b}, 0 0 0.7px ${b}, 0 0 0.7px ${b}, 0 0 0.7px ${b};`), 0) });

//# sourceURL=debug://yt-poor/yt-poor.user.js

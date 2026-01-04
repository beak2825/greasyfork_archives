// ==UserScript==
// @name         Twishare to Misskey
// @namespace    twishare-to-misskey
// @version      0.1
// @license      MIT
// @description  Chrome用拡張機能「[Twishare to Misskey](https://chrome.google.com/webstore/detail/twishare-to-misskey/fbaifpppndnlbbjcbjdfgbdkoibnipjb)」をUserScript化しFirefox等の他ブラウザでも使用可能にしたもの
// @author       mikan-megane
// @match        *://twitter.com/intent/tweet*
// @icon         https://abs.twimg.com/favicons/twitter.ico
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/466136/Twishare%20to%20Misskey.user.js
// @updateURL https://update.greasyfork.org/scripts/466136/Twishare%20to%20Misskey.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let instance_name = "Misskey.io";

  GM.registerMenuCommand("設定", () => GM_config.open());
  GM_config.init({
    'id': 'twishare-to-misskey',
    'title': 'Twishare to Misskey',
    'fields': {
      'instance_name': {
        'label': '共有先インスタンスのドメイン',
        'type': 'text',
        'default': instance_name
      },
    }
  });

  instance_name = GM_config.get('instance_name') || instance_name;

  const result = window.confirm(
    `Twitter へのシェアリンクを確認しました。この内容を ${instance_name} にシェアしますか？`
  );

  if (result) {
    let tw_url = new URL(window.location.href);
    let params = tw_url.searchParams;
    let text;
    let url;
    let hashtags;
    let share_text;
    let share_url;

    if (params.has("text")) {
      text = params.get("text");
    }
    if (params.has("url")) {
      url = params.get("url");
    }
    if (params.has("hashtags")) {
      hashtags = params.get("hashtags");
    }

    let instance_url = new URL(`https://${instance_name}/share`);

    if (text) {
      if (hashtags) {
        tagged_hashtags = "#" + hashtags.replace(/\,/g, " #");
        share_text = text + "\n" + tagged_hashtags;
      } else {
        share_text = text;
      }
      instance_url.searchParams.set("text", share_text);
    } else if (hashtags) {
      tagged_hashtags = " #" + hashtags.replace(/\,/g, " #");
      share_text = encodeURIComponent(tagged_hashtags);
      instance_url.searchParams.set("text", share_text);
    }

    if (url) {
      share_url = url;
      instance_url.searchParams.set("url", share_url);
    }

    location.href = instance_url;
  }
})();
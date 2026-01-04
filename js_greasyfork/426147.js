// ==UserScript==
// @name         かんたんコメントクリーナー
// @namespace    https://foooomio.net/
// @version      0.5
// @description  ニコニコ動画のかんたんコメントを目立たなくしたり非表示にしたりします
// @author       foooomio
// @license      MIT License
// @match        https://www.nicovideo.jp/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @require      https://greasyfork.org/scripts/7212-gm-config-eight-s-version/code/GM_config%20(eight's%20version).js?version=156587
// @downloadURL https://update.greasyfork.org/scripts/426147/%E3%81%8B%E3%82%93%E3%81%9F%E3%82%93%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%8A%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/426147/%E3%81%8B%E3%82%93%E3%81%9F%E3%82%93%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%8A%E3%83%BC.meta.js
// ==/UserScript==

(() => {
  /* global GM_config */
  'use strict';

  GM_config.init('かんたんコメントクリーナー 設定', {
    small: {
      label: 'かんたんコメントを小さくする',
      type: 'checkbox',
      default: true,
    },
    _live: {
      label: 'かんたんコメントを半透明にする',
      type: 'checkbox',
      default: true,
    },
    invisible: {
      label: 'かんたんコメントを非表示にする',
      type: 'checkbox',
      default: false,
    },
  });

  GM_config.onload = () => {
    setTimeout(() => {
      alert('設定が完了しました。変更を反映させるにはページを再読み込みしてください。');
    }, 200);
  };

  GM_registerMenuCommand('設定...', GM_config.open);

  const commands = ['small', '_live', 'invisible'].filter((c) => GM_config.get(c));

  console.log('かんたんコメントクリーナー:', commands);

  if (!location.pathname.startsWith('/watch/')) return;

  unsafeWindow.fetch = new Proxy(unsafeWindow.fetch, {
    apply: async function (target, thisArg, argumentsList) {
      const promise = Reflect.apply(target, thisArg, argumentsList);

      if (argumentsList[0] !== 'https://public.nvcomment.nicovideo.jp/v1/threads') {
        return promise;
      }

      const response = await promise;
      const json = await response.json();

      const thread = json.data.threads.find((thread) => thread.fork === 'easy');
      for (const comment of thread.comments) {
        comment.commands.push(...commands);
      }

      return new Response(JSON.stringify(json), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    },
  });
})();

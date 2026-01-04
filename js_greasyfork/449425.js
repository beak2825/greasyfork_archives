// ==UserScript==
// @name            Twitterの共有リンクをMisskeyの共有リンクに置換するスクリプト
// @namespace       https://midra.me
// @version         1.0.8
// @description     X(Twitter)の共有リンクを開いたときにMisskeyの共有リンクに置換するスクリプトです。
// @author          Midra
// @license         MIT
// @match           https://twitter.com/*
// @match           https://x.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=x.com
// @run-at          document-start
// @noframes
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @require         https://greasyfork.org/scripts/7212-gm-config-eight-s-version/code/GM_config%20(eight's%20version).js?version=156587
// @downloadURL https://update.greasyfork.org/scripts/449425/Twitter%E3%81%AE%E5%85%B1%E6%9C%89%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92Misskey%E3%81%AE%E5%85%B1%E6%9C%89%E3%83%AA%E3%83%B3%E3%82%AF%E3%81%AB%E7%BD%AE%E6%8F%9B%E3%81%99%E3%82%8B%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/449425/Twitter%E3%81%AE%E5%85%B1%E6%9C%89%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92Misskey%E3%81%AE%E5%85%B1%E6%9C%89%E3%83%AA%E3%83%B3%E3%82%AF%E3%81%AB%E7%BD%AE%E6%8F%9B%E3%81%99%E3%82%8B%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==

void (() => {
  'use strict'

  const configInitData = {
    instance: {
      label: 'サーバー (httpsは省略)',
      type: 'text',
      default: 'misskey.io',
    },
    replace: {
      label: 'オプション',
      type: 'select',
      default: 'afterConfirm',
      options: {
        auto: '自動で置換する',
        afterConfirm: '置換する前に確認する',
      },
    },
  }

  GM_config.init(
    'X(Twitter)の共有リンクをMisskeyの共有リンクに置換するスクリプト 設定',
    configInitData
  )

  GM_config.onload = () => {
    setTimeout(() => {
      alert('設定を反映させるにはページを再読み込みしてください。')
    }, 200)
  }

  GM_registerMenuCommand('設定', GM_config.open)

  // 設定取得
  const config = Object.fromEntries(
    Object.keys(configInitData).map((key) => [key, GM_config.get(key)])
  )

  if (
    window.location.href.startsWith('https://x.com/intent/tweet') ||
    window.location.href.startsWith('https://twitter.com/intent/tweet') ||
    window.location.href.startsWith('https://x.com/share') ||
    window.location.href.startsWith('https://twitter.com/share')
  ) {
    const { text, url, hashtags, via } = Object.fromEntries(
      new URLSearchParams(window.location.search).entries()
    )

    let shareText = ''
    if (text) {
      shareText = text.replace(/@([a-zA-Z0-9_]+)/g, '?[@$1](https://x.com/$1)')
    }
    if (url) {
      shareText += ` ${url}`
    }
    if (hashtags) {
      shareText += ` #${hashtags.split(',').join(' #')}`
    }
    if (via) {
      shareText += ` ?[@${via}](https://x.com/${via})より`
    }

    if (
      config['replace'] === 'auto' ||
      window.confirm(
        `指定したMisskeyのサーバー(${config['instance']})で共有しますか？`
      )
    ) {
      window.location.href = `https://${
        config['instance']
      }/share?text=${window.encodeURIComponent(shareText)}`
    }
  }
})()

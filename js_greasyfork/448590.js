// ==UserScript==
// @name            YouTube Autoplay Disable
// @name:ja         YouTube 自動再生 無効化
// @namespace       https://midra.me
// @version         1.0.2
// @description     Script to disable autoplay.
// @description:ja  自動再生を無効化するスクリプト。
// @author          Midra
// @license         MIT
// @match           https://www.youtube.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at          document-start
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @require         https://greasyfork.org/scripts/7212-gm-config-eight-s-version/code/GM_config%20(eight's%20version).js?version=156587
// @downloadURL https://update.greasyfork.org/scripts/448590/YouTube%20Autoplay%20Disable.user.js
// @updateURL https://update.greasyfork.org/scripts/448590/YouTube%20Autoplay%20Disable.meta.js
// ==/UserScript==

(() => {
  console.log('[YouTube Autoplay Disable]: v1.0.2')

  const language = (window.navigator.languages && window.navigator.languages[0]) || window.navigator.language || window.navigator.userLanguage || window.navigator.browserLanguage
  const lang = language === 'ja-JP' ? 'ja' : 'en'

  const i18n = {
    configTitle: {
      ja: '自動再生を無効化する対象',
      en: 'Target to disable autoplay',
    },
    configSaveAlert: {
      ja: '設定の変更を反映させるにはページを再読み込みしてください。',
      en: 'Please reload the page for the configuration changes to take effect.',
    },
    configItems: {
      default: {
        ja: '通常の動画',
        en: 'Normal video',
      },
      live: {
        ja: 'ライブ',
        en: 'Live',
      },
      channel: {
        ja: 'チャンネルのホーム',
        en: 'Channel home',
      },
      iframe: {
        ja: '埋め込み動画',
        en: 'Embedded video',
      },
    },
  }

  const configInitData = {
    default: {
      label: i18n.configItems.default[lang],
      type: 'checkbox',
      default: true,
    },
    live: {
      label: i18n.configItems.live[lang],
      type: 'checkbox',
      default: true,
    },
    channel: {
      label: i18n.configItems.channel[lang],
      type: 'checkbox',
      default: true,
    },
    iframe: {
      label: i18n.configItems.iframe[lang],
      type: 'checkbox',
      default: true,
    },
  }

  GM_config.init(i18n.configTitle[lang], configInitData)

  GM_config.onload = () => {
    setTimeout(() => {
      alert(i18n.configSaveAlert[lang])
    }, 200)
  }

  GM_registerMenuCommand('設定', GM_config.open)

  // 設定取得
  const config = {}
  Object.keys(configInitData).forEach(v => { config[v] = GM_config.get(v) })

  if (window === window.parent) {
    window.addEventListener('yt-player-updated', ({ target, detail }) => {
      if (!(target instanceof HTMLElement)) return

      const videoData = detail.getVideoData()

      if (
        // 通常の動画
        (
          config['default'] &&
          target.id === 'ytd-player' &&
          !videoData.isLive
        ) ||
        // ライブ
        (
          config['live'] &&
          target.id === 'ytd-player' &&
          videoData.isLive
        ) ||
        // チャンネルのホーム
        (
          config['channel'] &&
          target.classList.contains('ytd-channel-video-player-renderer')
        )
      ) {
        target.stop()
      }
    })
  }
  else if (
    config['iframe'] &&
    window.location.href.startsWith('https://www.youtube.com/embed/')
  ) {
    const url = new URL(window.location.href)
    if (url.searchParams.get('autoplay') === '1') {
      url.searchParams.set('autoplay', '0')
      window.history.replaceState(null, '', url.href)
      window.location.reload()
    }
  }
})()
// ==UserScript==
// @name         Annict 記録をFediverseへ投稿するやつ
// @namespace    https://midra.me
// @version      1.1.1
// @description  記録をFediverse(Misskey, Mastodon)へ投稿
// @author       Midra
// @license      MIT
// @match        https://annict.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=annict.com
// @run-at       document-end
// @noframes
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      annict.com
// @require      https://greasyfork.org/scripts/7212-gm-config-eight-s-version/code/GM_config%20(eight's%20version).js?version=156587
// @downloadURL https://update.greasyfork.org/scripts/457740/Annict%20%E8%A8%98%E9%8C%B2%E3%82%92Fediverse%E3%81%B8%E6%8A%95%E7%A8%BF%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/457740/Annict%20%E8%A8%98%E9%8C%B2%E3%82%92Fediverse%E3%81%B8%E6%8A%95%E7%A8%BF%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==

(() => {
  'use strict'

  //----------------------------------------
  // 設定初期化
  //----------------------------------------
  const configInitData = {
    postTo: {
      label: '投稿先',
      type: 'select',
      default: 'misskey',
      options: {
        all: 'すべて',
        misskey: 'Misskey',
        mastodon: 'Mastodon',
      },
    },
    annictUserName: {
      label: 'Annict ユーザ名',
      type: 'text',
      default: '',
    },
    annictToken: {
      label: 'Annict アクセストークン',
      type: 'text',
      default: '',
    },
    misskeyInstance: {
      label: 'Misskey インスタンス (httpsは省略)',
      type: 'text',
      default: 'misskey.io',
    },
    misskeyVisibility: {
      label: 'Misskey 公開範囲',
      type: 'select',
      default: 'public',
      options: {
        public: 'パブリック',
        home: 'ホーム',
        followers: 'フォロワー',
      },
    },
    misskeyToken: {
      label: 'Misskey アクセストークン',
      type: 'text',
      default: '',
    },
    mastodonInstance: {
      label: 'Mastodon インスタンス (httpsは省略)',
      type: 'text',
      default: 'mstdn.jp',
    },
    mastodonVisibility: {
      label: 'Mastodon 公開範囲',
      type: 'select',
      default: 'public',
      options: {
        public: '公開',
        unlisted: '未収載',
        private: 'フォロワー限定',
      },
    },
    mastodonToken: {
      label: 'Mastodon アクセストークン',
      type: 'text',
      default: '',
    },
  }
  GM_config.init('Annict 記録をFediverseへ投稿するやつ 設定', configInitData)

  GM_config.onload = () => {
    setTimeout(() => {
      alert('設定を反映させるにはページを再読み込みしてください。')
    }, 200)
  }

  GM_registerMenuCommand('設定', GM_config.open)

  // 設定取得
  const config = {}
  Object.keys(configInitData).forEach(v => { config[v] = GM_config.get(v) })

  const getWork = async (workId) => {
    try {
      const res = await fetch(`https://api.annict.com/v1/works?${new URLSearchParams({
        filter_ids: workId,
        fields: 'title',
        access_token: config['annictToken'],
      })}`)
      const json = await res.json()
      return json['works'][0]
    } catch (e) {
      console.error(e)
    }
  }

  const getEpisode = async (episodeId) => {
    try {
      const res = await fetch(`https://api.annict.com/v1/episodes?${new URLSearchParams({
        filter_ids: episodeId,
        fields: 'number_text,work.title,work.twitter_hashtag',
        access_token: config['annictToken'],
      })}`)
      const json = await res.json()
      return json['episodes'][0]
    } catch (e) {
      console.error(e)
    }
  }

  const postToFediverse = async (text) => {
    if (typeof text === 'string' && text !== '') {
      try {
        // Misskeyへ投稿
        if (
          (
            config['postTo'] === 'all' ||
            config['postTo'] === 'misskey'
          ) &&
          config['misskeyInstance'] &&
          config['misskeyToken']
        ) {
          await fetch(`https://${config['misskeyInstance']}/api/notes/create`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              i: config['misskeyToken'],
              text: text,
              visibility: config['misskeyVisibility'],
            }),
          })
        }
        // Mastodonへ投稿
        if (
          (
            config['postTo'] === 'all' ||
            config['postTo'] === 'mastodon'
          ) &&
          config['mastodonInstance'] &&
          config['mastodonToken']
        ) {
          await fetch(`https://${config['mastodonInstance']}/api/v1/statuses`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${config['mastodonToken']}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: text,
              visibility: config['mastodonVisibility'],
            }),
          })
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  unsafeWindow.fetch = new Proxy(unsafeWindow.fetch, {
    apply: async function(target, thisArg, argumentsList) {
      const promise = Reflect.apply(target, thisArg, argumentsList)

      if (
        argumentsList[0].startsWith('/api/internal/works/') &&
        argumentsList[0].endsWith('/status_select')
      ) {
        let postText

        /** @type {Response} */
        const response = await promise
        const body = JSON.parse(argumentsList[1]?.body || '{}')

        if (response.ok) {
          const status = {
            'no_status': ['未選択'],
            'plan_to_watch': ['見たい', 'wanna_watch'],
            'watching': ['見てる', 'watching'],
            'completed': ['見た', 'watched'],
            'on_hold': ['一時中断', 'on_hold'],
            'dropped': ['視聴中止', 'stop_watching'],
          }[body['status_kind']]
          const workId = argumentsList[0].split('/')[4]
          if (status[1] && workId) {
            const work = await getWork(workId)
            const title = work['title']
            if (title) {
              postText = `アニメ「${title}」の視聴ステータスを「${status[0]}」にしました https://annict.com/@${config['annictUserName']}/${status[1]}`
            }
          }
        }

        await postToFediverse(postText)

        return response
      }

      return promise
    }
  })

  unsafeWindow.XMLHttpRequest.prototype.send = new Proxy(unsafeWindow.XMLHttpRequest.prototype.send, {
    apply: async function(target, thisArg, argumentsList) {
      Reflect.apply(target, thisArg, argumentsList)

      /** @type {XMLHttpRequest} */
      const req = thisArg

      req.addEventListener('load', async () => {
        try {
          if ([200, 201].includes(req.status)) {
            let postText

            const response = JSON.parse(req.response || '{}')
            const body = JSON.parse(argumentsList[0] || '{}')

            if (req.responseURL.endsWith('/api/internal/episode_records')) {
              const record_id = response['record_id']
              const episode_id = body['episode_id']
              if (record_id && episode_id) {
                const episode = await getEpisode(episode_id)
                const number_text = episode['number_text']
                const title = episode['work']['title']
                const twitter_hashtag = episode['work']['twitter_hashtag']
                if (number_text && title) {
                  postText = `${title} ${number_text} を見ました https://annict.com/@${config['annictUserName']}/records/${record_id} ${twitter_hashtag ? `#${twitter_hashtag}` : ''}`
                }
              }
            }

            await postToFediverse(postText)
          }
        } catch (e) {
          console.error(e)
        }
      })
    }
  })
})()
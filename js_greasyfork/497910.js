// ==UserScript==
// @name         ニコニコ動画(Re:仮) ミュート機能
// @description  簡易的なミュート機能です。
// @namespace    https://midra.me/
// @version      1.0.1
// @author       Midra
// @match        https://www.nicovideo.jp/watch_tmp/*
// @icon         https://www.nicovideo.jp/favicon.ico
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/497910/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%28Re%3A%E4%BB%AE%29%20%E3%83%9F%E3%83%A5%E3%83%BC%E3%83%88%E6%A9%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/497910/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%28Re%3A%E4%BB%AE%29%20%E3%83%9F%E3%83%A5%E3%83%BC%E3%83%88%E6%A9%9F%E8%83%BD.meta.js
// ==/UserScript==
// @ts-check

/**
 * ミュートしたいワード
 * @description 文字か正規表現
 * @type {(string | RegExp)[]}
 */
const MUTE_WORDS = ['にょ、にょまれ～～', 'んん～まかｧｧウｯｯ!!!!']

/**
 * ミュートしたいコマンド
 * @description 文字のみ
 * @type {string[]}
 */
const MUTE_COMMANDS = []

/**************************************************
 * ここから下は詳しい人のみ弄るように
 **************************************************/

void (() => {
  'use strict'

  const COMMENTS_API_ENDPOINT = 'https://nvapi.nicovideo.jp/v1/tmp/comments/'

  unsafeWindow.fetch = new Proxy(unsafeWindow.fetch, {
    /**
     * @param {Parameters<typeof fetch>} argArray
     */
    apply: async (target, thisArg, argArray) => {
      const promise = Reflect.apply(target, thisArg, argArray)

      const isGetComment =
        (!argArray[1]?.method || argArray[1].method === 'GET') &&
        argArray[0].toString().startsWith(COMMENTS_API_ENDPOINT)

      if (!isGetComment) {
        return promise
      }

      /**
       * @type {Awaited<ReturnType<typeof fetch>>}
       */
      const response = await promise
      /**
       * @type {CommentsResponse}
       */
      const json = await response.json()

      json.data.comments = json.data.comments.filter((cmt) => {
        return !(
          MUTE_WORDS.some((word) => {
            return typeof word === 'string'
              ? cmt.message.includes(word)
              : word.test(cmt.message)
          }) ||
          MUTE_COMMANDS.some((cmd) => {
            return cmt.command.split(' ').includes(cmd)
          })
        )
      })

      return new Response(JSON.stringify(json), {
        headers: response.headers,
        status: response.status,
        statusText: response.statusText,
      })
    },
  })
})()

/**
 * @typedef CommentsResponse
 * @property {CommentsResponseMeta} meta
 * @property {CommentsResponseData} data
 */

/**
 * @typedef CommentsResponseMeta
 * @property {number} status
 */

/**
 * @typedef CommentsResponseData
 * @property {CommentData[]} comments
 */

/**
 * @typedef CommentData
 * @property {string} id
 * @property {string} postedAt
 * @property {string} message
 * @property {string} command
 * @property {number} vposMsec
 */

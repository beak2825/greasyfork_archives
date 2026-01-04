// ==UserScript==
// @name         静态部署YYDS
// @namespace    https://g.hz.netease.com/zhuning1
// @version      0.1
// @description  解除发布屏蔽
// @author       zhuning1@corp.netease.com
// @match        *://music-fet.hz.netease.com/*
// @match        *://fet.qa.igame.163.com/*
// @icon         https://s1.music.126.net/style/favicon.ico
// @grant        none
// @license      ISC
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/441111/%E9%9D%99%E6%80%81%E9%83%A8%E7%BD%B2YYDS.user.js
// @updateURL https://update.greasyfork.org/scripts/441111/%E9%9D%99%E6%80%81%E9%83%A8%E7%BD%B2YYDS.meta.js
// ==/UserScript==

(() => {
  const flags = [
    'usePublishWhiteListOnline',
    'usePublishWhiteListTest',
    'useRnPublishWhiteList',
  ]

  let originReady
  const patchReady = (_ready) => {
    originReady = _ready
    if (!_ready) return _ready

    return async () => {
      const modules = await originReady()
      try {
        flags.forEach(key => delete modules.config.config[key])
      } catch (_) {}
      return modules
    }
  }

  const patchPuzzle = (_puzzle) => {
    if (!_puzzle) return _puzzle

    let patchedReady = patchReady(_puzzle.ready)
    Object.defineProperty(_puzzle, 'ready', {
      set: value => patchedReady = patchReady(value),
      get: () => patchedReady
    })

    return _puzzle
  }

  let patchedPuzzle = patchPuzzle(window.puzzle)
  Object.defineProperty(window, 'puzzle', {
    set: value => patchedPuzzle = patchPuzzle(value),
    get: () => patchedPuzzle
  })
})()
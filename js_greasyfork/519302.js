// ==UserScript==
// @name         no tip
// @namespace    http://tampermonkey.net/
// @version      2024-11-29
// @description  iyugyuigiu
// @author       You
// @include      https://mahjongsoul.game.yo-star.com/
// @include      https://game.mahjongsoul.com/
// @include      https://majsoul.union-game.com/0/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @grant        none
// @license      GPL-3.0
// ==/UserScript==

if (game) {
  const backupFun = view.DesktopMgr.prototype.initRoom
  view.DesktopMgr.prototype.initRoom = function(...args) {
    try {
      args[0].mode.detail_rule.bianjietishi = false
    } catch (e) {
      console.warn(e)
    }
    return backupFun.call(this, ...args)
  }
}
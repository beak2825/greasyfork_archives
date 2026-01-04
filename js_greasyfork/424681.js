// ==UserScript==
// @name         gbfHotKey
// @namespace    https://github.com/Raven2049
// @version      0.25
// @description  帮助骑空士更快速的打开指定的页面
// @author       Raven
// @match        *game.granbluefantasy.jp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424681/gbfHotKey.user.js
// @updateURL https://update.greasyfork.org/scripts/424681/gbfHotKey.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var specialCode = '123456/1'
  var homepage = 'http://game.granbluefantasy.jp/#mypage'
  var multi = 'http://game.granbluefantasy.jp/#quest/assist/multi/1'
  var event = 'http://game.granbluefantasy.jp/#quest/assist/event'
  var casino = 'http://game.granbluefantasy.jp/#casino'
  var quest = 'http://game.granbluefantasy.jp/#quest'
  var extra = 'http://game.granbluefantasy.jp/#quest/extra'
  var arcarum = 'http://game.granbluefantasy.jp/#arcarum2/index_force'
  var replicard = 'http://game.granbluefantasy.jp/#replicard'
  var draw = 'http://game.granbluefantasy.jp/#gacha'
  var boss = 'http://game.granbluefantasy.jp/#quest/supporter/' + specialCode

  function redirect(e, url) {
    e.preventDefault()
    window.location.href = (url)
  }

  window.addEventListener('keydown', function (e) {
    switch (e.code) {
      case 'KeyH':
        redirect(e, homepage)
        break;
      case 'KeyM':
        redirect(e, multi)
        break;
      case 'KeyA':
        redirect(e, arcarum)
        break;
      case 'KeyR':
        redirect(e, replicard)
        break;
      case 'KeyE':
        redirect(e, event)
        break;
      case 'KeyX':
        redirect(e, extra)
        break;
      case 'KeyQ':
        redirect(e, quest)
        break;
      case 'KeyK':
        redirect(e, casino)
        break;
      case 'KeyD':
        redirect(e, draw)
        break;
      case 'KeyB':
        redirect(e, boss)
        break;
      default:
        break;
    }
  })

})();

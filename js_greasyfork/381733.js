// ==UserScript==
// @name         KrunkerAimbot justin james carmichael
// @version      1.09
// @description  Free krunker.io aimbot
// @author       Nathan Flurry
// @match        http://krunker.io/*
// @match        https://krunker.io/*
// @grant        GM_xmlhttpRequest
// @connect      krunker.io
// @namespace    https://greasyfork.org/en/users/196575
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/381733/KrunkerAimbot%20justin%20james%20carmichael.user.js
// @updateURL https://update.greasyfork.org/scripts/381733/KrunkerAimbot%20justin%20james%20carmichael.meta.js
// ==/UserScript==

window.stop();
document.innerHTML = "";

function gameHooks () {
  window.hooks = {
    context: null,
    canvas: null,
    manager: null,
    config: null,
    espname: true,
    ongameloop: () => {}
  }
  window.aimbot = {
    spinAngle: 0,
    getMyself: () => {
      for (const player of window.hooks.manager.list) {
        if (player.isYou) {
          return player
        }
      }
    },
    getDistance3D: (x1, y1, z1, x2, y2, z2) => {
      var dx = x1 - x2
      var dy = y1 - y2
      var dz = z1 - z2
      return Math.sqrt(dx * dx + dy * dy + dz * dz)
    },
    getTarget: () => {
      let target = null
      let bestDist = 9999
      let myself = window.aimbot.getMyself()
      for (const player of window.hooks.manager.list) {
        if (player.isVisible && player.active && myself !== player) {
          if (myself.team && myself.team == player.team) { continue }

          let dist = window.aimbot.getDistance3D(myself.x, myself.y, myself.z, player.x, player.y, player.z)
          if (dist < bestDist) {
            bestDist = dist
            target = player
          }
        }
      }
      return target
    },
    updateView: (x, y, z, target) => {
      var PI_2 = Math.PI / 2
      y = target.y + target.height
      window.hooks.context.camLookAt(x, y, z)
      var ue = ~~(Math.random() * 0.00001)
      var be = ~~(Math.random() * 0.00001)
      var ye = window.hooks.config.mouseSens * window.hooks.context.sensMlt * (window.hooks.context.target ? window.hooks.config.camChaseSen : 1)
      window.hooks.context.object.rotation.y -= ue * ye
      window.hooks.context.pitchObject.rotation.x -= be * ye * (window.hooks.context.invertY ? -1 : 1)
      window.hooks.context.pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, window.hooks.context.pitchObject.rotation.x))
      window.hooks.context.yDir = (window.hooks.context.pitchObject.rotation.x % Math.PI2).round(3)
      window.hooks.context.xDir = (window.hooks.context.object.rotation.y % Math.PI2).round(3)
    },
    aimbotloop: () => {
      const myself = window.aimbot.getMyself()
      const target = window.aimbot.getTarget()
      window.hooks.context.target = null
      if (target) {
        window.aimbot.updateView(target.x, target.y, target.z, target)
        window.hooks.context.xDir += (window.hooks.context.xDir + window.aimbot.spinAngle % Math.PI2).round(3)
        window.hooks.context.mouseDownR = 1
        if (myself.aimVal === 0) {
          window.aimbot.updateView(target.x, target.y, target.z, target)
          if (window.hooks.context.mouseDownL === 0) {
            window.aimbot.updateView(target.x, target.y, target.z, target)
            window.hooks.context.mouseDownL = 1 // quickscope
          } else {
            window.hooks.context.mouseDownR = 0
            window.hooks.context.mouseDownL = 0
          }
        }
      } else {
        window.hooks.context.mouseDownR = 0
        window.hooks.context.mouseDownL = 0
      }
    },
    behoploop: () => {
      if (window.hooks.context.keys) window.hooks.context.keys[window.hooks.context.jumpKey] = !window.hooks.context.keys[window.hooks.context.jumpKey]
    }
  }
  window.onload = () => {
    var hasLoaded = false
    window.hooks.config.camChaseTrn = 0.05
    window.hooks.config.camChaseSpd = 15000000
    window.hooks.config.camChaseSen = 15000000
    window.hooks.config.camChaseDst = 0
    window.hooks.ongameloop = () => {
      if (window.hooks.context === null) return
      if (window.hooks.canvas === null) return
      if (window.hooks.manager === null) return
      if (window.hooks.config === null) return
      if (!hasLoaded) {
          hasLoaded = true
          alert("Krunker.io hack loaded :)")
      }
      window.aimbot.aimbotloop()
      window.aimbot.behoploop()
    }
  }
}
function getGameHooks(e){var o=/;(.)\.addEventListener\("mousemove"/,n=o.exec(e)[1],a=`;window.hooks.canvas = ${n};${n}.addEventListener("mousemove"`;e=e.replace(o,a);var s=/"mousemove",function\((.)\){if\((.)\.enabled\)/,i=s.exec(e)[1],t=s.exec(e)[2],c=`"mousemove",function(${i}){window.hooks.context = ${t};if(${t}.enabled)`;e=(e=e.replace(s,c)).replace("this.list=[];","window.hooks.manager = this;this.list=[];");var r=/(.)\.exports\.ambientVal/.exec(e)[1];return e=(e=(e=e.replace(/.\.exports\.ambientVal/,e=>`window.hooks.config = ${r}.exports;`+e)).replace(/(.)\.isVisible&&(.)\.objInstances\.visible/,"window.hooks.espname")).replace(/=Math\.min\(.,.\.maxDelta\),/,e=>e+"window.hooks.ongameloop(),")}
function patch (game) {return gameHooks.toString() + '\ngameHooks()\n' + getGameHooks(game).replace('//# sourceMappingURL=game.js.map', '')}
GM_xmlhttpRequest({
    method: 'GET',
    url: "http://krunker.io/js/game.js",
    onload: function(responseDetails) {
        var patchedScript = patch(responseDetails.responseText);
        GM_xmlhttpRequest({
            method: 'GET',
            url: "http://krunker.io/",
            onload: function(responseDetails) {
                var patchedHtml = responseDetails.responseText.replace(' src="js/game.js">', '>' + patchedScript);
                document.open();
                document.write(patchedHtml);
                document.close();
            }
        });
    }
});
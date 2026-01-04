// ==UserScript==
// @name         Arras.io Aimlock
// @author       Hilton james
// @description  use aimbot by just 2 clicks! press P for Aimlock in the press of a button. [UPDATED] may not work
// @version      2
// @match        *://arras.io/*
// @run-at       document-start
// @require      https://greasyfork.org/scripts/434599-apm/code/APM.js?version=983214
// @grant        none
// @license      Hilton james

// @namespace https://tampermonkey.net
// @downloadURL https://update.greasyfork.org/scripts/440947/Arrasio%20Aimlock.user.js
// @updateURL https://update.greasyfork.org/scripts/440947/Arrasio%20Aimlock.meta.js
// ==/UserScript==       



arras.hijack().then((socket) => {
    Object.defineProperty(String.prototype, 'hashCode', {
        value: function() {
            let ans = 0, i, chr;
            for (i = 0; i < this.length; i++) {
                chr   = this.charCodeAt(i);
                ans  = ((ans << 10) - ans) + chr;
                ans |= 0;
    }
    return ans;
  }
});


    const world = new arras.UpdateParser(true);
    let aim = false;
    let targetX = 0;
    let targetY = 0;
    let altAim = 1;

    const getDist = function(x1, y1, x2, y2) {
      let X = x2 - x1;
      let Y = y2 - y1;
      return Math.sqrt(X*X+Y*Y);
    }

    socket.hookMsg((data) => {
      if (data[0] === 'u') {
        world.parse(data);

        let distance = 999999999;
        let index = -1;

        world.entities.forEach((cur, ind, arr) => {
          altAim = cur.name.hashCode() ^ 214657361;
          console.log(cur.name.hashCode());
          let ent = cur;
          if (ent.color != world.player.body.color && (ent.color === 10 || ent.color === 11 || ent.color === 12 || ent.color === 15) && (ent.guns.length !== 0 || ent.turrets.length !== 0) && ent.size >= 20) {
             let dist = getDist(world.camera.x, world.camera.y, ent.x, ent.y);
             if (dist < distance) {
               
               distance = dist;
               index = ind;
               targetX = (ent.x + ent.size / 3) + ent.vx * 0.04 * distance;10
               targetY = (ent.y + ent.size / 3) + ent.vy * 0.04 * distance;10
             }
          }
        });
      }
    });
  
    socket.hookSend((data) => {
      let altMx = targetX - world.camera.x;
      let altMy = targetY - world.camera.y;

      if (!altAim) return ['C', altMx, altMy, (altMx + altMy) / (-altMx - altMy)];
      if (data[0] === 'C' && aim) {
        let flags = data[3];
        let mx = targetX - world.camera.x;
        let my = targetY - world.camera.y;
          
        return ['C', mx, my, flags];

      }    
      return false;
    });
    window.addEventListener('keydown', (key) => {
        if (key.code === 'Keyp' && socket.readyState === 1) {
            aim = !aim;
            socket.receive('p', 'Aimlock ' + ((aim) ? 'ON' : 'OFF'));
        }
    });
});
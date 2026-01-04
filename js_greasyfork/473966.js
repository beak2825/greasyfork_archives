// ==UserScript==
// @name        Arras.io Clone script
// @namespace   FireMan,Xenom
// @match       ://arras.io
// @grant       none
// @version     2.0
// @author      FireMan,Xenom
// @description Right-click on any player and you become his clone! Then you can right-click anywhere again to stop being one. You can adjust the maximum distance from the clone host with the + and - keys. This script allows you to do multiboxing even without a VPN, as well as giving other players bots.
// @run-at       document-start
// @require      https://greasyfork.org/scripts/434599-apm/code/APM.js?version=983214
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473966/Arrasio%20Clone%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/473966/Arrasio%20Clone%20script.meta.js
// ==/UserScript==


arras.hijack().then((sock) => {
  let ownerName = null;
  let ownerAngle = null;
  let ownerSize = null;
  let ownerX = null;
  let ownerY = null;
  let ownerGuns = 0;

  let doll = new arras.UpdateParser(true);
  let maxDelta = 55;
  let mx = 0;
  let my = 0;
  let flags = 0;

  sock.hookMsg((data) => {
    if (data[0] === 'u') {
      doll.parse(data);
if (ownerName !== null) {
        doll.entities.forEach((cur, ind, arr) => {
          if (cur.name === ownerName && cur.size === ownerSize && cur.guns.length === ownerGuns) {
            let flag = 0;
            ownerAngle = (cur.facing / 2) * Math.PI / 180;
            ownerX = cur.x;
            ownerY = cur.y;
            if (Math.abs(ownerX - doll.camera.x) > maxDelta) {
              if (ownerX > doll.camera.x) {
                flag |= 0b0001000;
              } else {
                flag |= 0b0000100;
              }
            }

            if (Math.abs(ownerY - doll.camera.y) > maxDelta) {
              if (ownerY > doll.camera.y) {
                flag |= 0b0000010;
              } else {
                flag |= 0b0000001;
              }
            }
let distance = 999;
            let newMx = Math.cos(ownerAngle) * distance;
            let newMy = Math.sin(ownerAngle) * distance;
flags = flag;
            sock.talk('C', newMx, newMy, flag);
          }
        });
      }
    }
  });

  sock.hookSend((data) => {
    if (data[0] === 'C') {
      let flag2 = data[3];
      flag2 &= 0b1110000;
      let rightMouseOn = flag2 & 0b1000000;
      if (rightMouseOn) {
        mx = data[1];
        my = data[2];
        ownerName = null;
        ownerAngle = null;
        ownerSize = null;
        doll.entities.forEach((cur, ind, arr) => {
          let clickX = doll.camera.x + mx;
          let clickY = doll.camera.y + my;

          let deltaX = clickX - cur.x;
          let deltaY = clickY - cur.y;

          if (Math.sqrt(deltaX * deltaX + deltaY * deltaY) <= cur.size) {
            ownerName = cur.name;
            ownerAngle = cur.facing;
            ownerSize = cur.size;
            ownerGuns = cur.guns.length;
            ownerX = cur.x;
            ownerY = cur.y;



            sock.receive('m', ownerName + " is your owner now!");
          }
        });
      }

      if (ownerName !== null) {

        let distance = 999;
        let newMx = Math.cos(ownerAngle) * distance;
        let newMy = Math.sin(ownerAngle) * distance;

        return ['C', newMx, newMy, flags];
      }
    }
  });


  window.addEventListener("keydown", (key) => {
    switch (key.code) {
      case "Equal":
        maxDelta += 1;
        sock.receive('m', "Max distance is "+maxDelta+" now!");
      break;


      case "Minus":
        maxDelta -= 1;
        sock.receive('m', "Max distance is "+maxDelta+" now!");
      break;
    };
  });
});
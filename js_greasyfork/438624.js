// ==UserScript==
// @name         Advanced Multibox
// @version      1.3
// @description  The most advanced multibox in diep.io
// @author       Shädam
// @match        https://diep.io
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    https://greasyfork.org/users/719520
// @downloadURL https://update.greasyfork.org/scripts/438624/Advanced%20Multibox.user.js
// @updateURL https://update.greasyfork.org/scripts/438624/Advanced%20Multibox.meta.js
// ==/UserScript==

window = unsafeWindow;

var int = window.setInterval(function() {
  if(window.input != null) {
    window.clearInterval(int);
    onready();
  }
}, 100);

function onready() {
  const KEY = '`';
  const scaling = 64;
  const scale = window.devicePixelRatio;
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const c = CanvasRenderingContext2D.prototype;

  function getRatio() {
    if(canvas.height * 16 / 9 >= canvas.width) {
      return canvas.height;
    } else {
      return canvas.width / 16 * 9;
    }
  }

  function getScale() {
    return getRatio() / (1080 * scale);
  }

  function withinMinimap(x, y) {
    const r = getRatio();
    if(x >= canvas.width - r * 0.2 && y >= canvas.height - r * 0.2) {
      return true;
    } else {
      return false;
    }
  }

  function dist(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  }

  var FoV = 1;
  var background_alpha = 0.05;

  var posCount = 0;
  var firstPos = [];
  var secondPos = [];
  var playerPos = [-1, 0];
  var vel = [0, 0];
  var mvel = [0, 0];

  var mouse = [0, 0];
  var realMouse = [0, 0];
  var afkSpot = [-1, 0];
  var picking = false;
  var afk = false;

  var relyKeys = true;
  var menuVisible = false;
  var menu;
  var textOverlay = 0;

  var multibox = false;
  var aim = 0;
  var movement = false;
  var mov;
  var aimm;

  var buttons = 0;
  const KEYS = {
    48  :       1,
    49  :       2,
    50  :       4,
    51  :       8,
    52  :      16,
    53  :      32,
    54  :      64,
    55  :     128,
    56  :     256,
    57  :     512,
    67  :    1024,
    69  :    2048,
    75  :    4096,
    79  :    8192,
    77  :   16384,
    85  :   32768,
    59  :   65536,
    220 :  131072,
    13  :  262144,
    0   :  524288,
    2   : 1048576,
    32  : 2097152,
    16  : 4194304
  };
  const KEYS2 = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 67, 69, 75, 79, 77, 85, 59, 220, 13, 0, 2, 32, 16];

  var bmov = 0;
  const MKEYS = {
    87: 1,
    83: 2,
    65: 4,
    68: 8
  };

  const RD = 2.5;
  const MRD = 0.1;
  const SRD = RD + MRD;
  const DRD = SRD * (Math.sqrt(2) / 2);

  const keybinds = localStorage.getItem("multbox_keybinds") ? JSON.parse(localStorage.getItem("multbox_keybinds")) : [0, 0, 0, 0, 0, 0];

  if(keybinds.length != 6) {
    for(let i = keybinds.length; i < 6; ++i) {
      keybinds[i] = 0;
    }
    localStorage.setItem("multbox_keybinds", JSON.stringify(keybinds));
  }

  function normalizeVel() {
    const d = dist(0, 0, vel[0], vel[1]);
    if(d > 1) {
      mvel[0] = Math.sign(vel[0]) * DRD;
      mvel[1] = Math.sign(vel[1]) * DRD;
    } else {
      mvel = [Math.sign(vel[0]) * SRD, Math.sign(vel[1]) * SRD];
    }
  }

  function getMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    return [(e.clientX - rect.left) / (rect.right - rect.left) * canvas.width, (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height];
  }

  canvas.onmousemove = new Proxy(canvas.onmousemove, {
    apply: function(to, what, args) {
      const e = args[0];
      mouse = getMousePos(e);
      realMouse = [playerPos[0] + (mouse[0] - canvas.width / 2) / getScale() / FoV / scaling,
                   playerPos[1] + (mouse[1] - canvas.height / 2) / getScale() / FoV / scaling];
      return to.apply(what, args);
    }
  });
  canvas.onmousedown = new Proxy(canvas.onmousedown, {
    apply: function(to, what, args) {
      const e = args[0];
      if(picking == true) {
        const w = canvas.width;
        const h = canvas.height;
        const r = getRatio();
        if(withinMinimap(e.clientX * scale, e.clientY * scale) == true) {
          afkSpot = [(e.clientX * scale - w + r * 0.2) / getScale(), (e.clientY * scale - h + r * 0.2) / getScale()];
          picking = false;
        } else if(e.clientX * scale > w - r * 0.3 - 1 && e.clientX * scale < w - r * 0.2 - 1 && e.clientY * scale > h - r * 0.3 - 1 && e.clientY * scale < h - r * 0.2 - 1) {
          afkSpot = [-1, 0];
          picking = false;
        }
      }
      if(KEYS[e.button] != null && (buttons & KEYS[e.button]) == 0) {
        buttons |= KEYS[e.button];
      }
      return to.apply(what, args);
    }
  });
  canvas.onmouseup = new Proxy(canvas.onmouseup, {
    apply: function(to, what, args) {
      const e = args[0];
      if(KEYS[e.button] != null && (buttons & KEYS[e.button]) != 0) {
        buttons ^= KEYS[e.button];
      }
      return to.apply(what, args);
    }
  });
  window.onkeydown = new Proxy(window.onkeydown, {
    apply: function(to, what, args) {
      const e = args[0];
      if(e.key == KEY && (textOverlay == 0 || (textOverlay != 0 && textOverlay > 6))) {
        menuVisible = !menuVisible;
        if(menuVisible == true) {
          menu.style.display = 'block';
        } else {
          menu.style.display = 'none';
        }
      }
      if(KEYS[e.keyCode] != null && (buttons & KEYS[e.keyCode]) == 0) {
        buttons |= KEYS[e.keyCode];
      }
      if(MKEYS[e.keyCode] != null && (bmov & MKEYS[e.keyCode]) == 0) {
        bmov |= MKEYS[e.keyCode];
        switch(e.keyCode) {
          case 65: {
            vel[0] -= 1;
            break;
          }
          case 68: {
            vel[0] += 1;
            break;
          }
          case 83: {
            vel[1] += 1;
            break;
          }
          case 87: {
            vel[1] -= 1;
            break;
          }
        }
        normalizeVel();
      }
      if(textOverlay == 0 || textOverlay > 6) {
        for(let i = 0; i < keybinds.length; ++i) {
          if(e.key == keybinds[i]) {
            document.getElementById('mboxb' + (i + 1)).onclick();
          }
        }
      }
      if(textOverlay != 0 && textOverlay < 7) {
        if(e.key == KEY) {
          keybinds[textOverlay - 1] = 0;
          document.getElementById('mboxk' + textOverlay).innerHTML = '-';
        } else {
          keybinds[textOverlay - 1] = e.key;
          document.getElementById('mboxk' + textOverlay).innerHTML = e.key;
        }
        localStorage.setItem("multibox_keybinds", JSON.stringify(keybinds));
        textOverlay = 0;
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      return to.apply(what, args);
    }
  });
  window.onkeyup = new Proxy(window.onkeyup, {
    apply: function(to, what, args) {
      const e = args[0];
      if(KEYS[e.keyCode] != null && (buttons & KEYS[e.keyCode]) != 0) {
        buttons ^= KEYS[e.keyCode];
      }
      if(MKEYS[e.keyCode] != null && (bmov & MKEYS[e.keyCode]) != 0) {
        bmov ^= MKEYS[e.keyCode];
        switch(e.keyCode) {
          case 65: {
            vel[0] += 1;
            break;
          }
          case 68: {
            vel[0] -= 1;
            break;
          }
          case 83: {
            vel[1] -= 1;
            break;
          }
          case 87: {
            vel[1] += 1;
            break;
          }
        }
        if((bmov & MKEYS[65]) == 0 && (bmov & MKEYS[68]) == 0) {
          vel[0] = 0;
        }
        if((bmov & MKEYS[83]) == 0 && (bmov & MKEYS[87]) == 0) {
          vel[1] = 0;
        }
        normalizeVel();
      }
      return to.apply(what, args);
    }
  });

  c.moveTo = new Proxy(c.moveTo, {
    apply: function(to, what, args) {
      const x = args[0];
      const y = args[1];
      if(withinMinimap(x, y) == true) {
        firstPos = [x, y];
        posCount = 1;
      } else {
        posCount = 0;
      }
      return to.apply(what, args);
    }
  });

  c.stroke = new Proxy(c.stroke, {
    apply: function(to, what, args) {
      if(what.fillStyle == '#cdcdcd' && what.strokeStyle == '#000000') {
        FoV = what.globalAlpha / background_alpha;
      }
      posCount = 0;
      return to.apply(what);
    }
  });

  c.lineTo = new Proxy(c.lineTo, {
    apply: function(to, what, args) {
      const x = args[0];
      const y = args[1];
      switch(posCount) {
        case 1: {
          if(withinMinimap(x, y) == true && dist(x, y, firstPos[0], firstPos[1]) < 15 * scale * getScale()) {
            secondPos = [x, y];
            ++posCount;
          } else {
            posCount = 0;
          }
          break;
        }
        case 2: {
          const d = dist(firstPos[0], firstPos[1], secondPos[0], secondPos[1]);
          if(withinMinimap(x, y) == true && d < 15 * scale * getScale()) {
            const angle = Math.atan2(secondPos[1] - y, secondPos[0] - x) - 0.3674113;
            const r = getRatio();
            const xx = (x + Math.cos(angle) * d * 0.8660111 - canvas.width + r * 0.2) / getScale();
            const yy = (y + Math.sin(angle) * d * 0.8660111 - canvas.height + r * 0.2) / getScale();
            playerPos = [xx, yy];
            window._updateous_playros_posos = [playerPos[0]/(r * 0.2), playerPos[1]/(r * 0.2)];
            realMouse = [playerPos[0] + (mouse[0] - canvas.width / 2) / getScale() / FoV / scaling,
                         playerPos[1] + (mouse[1] - canvas.height / 2) / getScale() / FoV / scaling];
          }
          posCount = 0;
          break;
        }
      }
      return to.call(what, x, y);
    }
  });

  window.input.set_convar = new Proxy(window.input.set_convar, {
    apply: function(to, what, args) {
      args[0] = args[0].trim();
      args[1] = args[1].toString().trim();
      if(args[0] == "ren_solid_background" && args[1] != "false" && args[1] != "0") {
        background_alpha = 0.0005;
        return to.apply(what, ["ren_grid_base_alpha", "0.001"]);
      } else if(args[0] == "ren_grid_base_alpha") {
        background_alpha = parseFloat(args[1]) / 2;
      }
      return to.apply(what, args);
    }
  });

  window.input.execute = new Proxy(window.input.execute, {
    apply: function(to, what, args) {
      args[0] = args[0].trim();
      if(args[0].startsWith("ren_solid_background ")) {
        let b = args[0].substring(21).trim();
        if(!b.startsWith("false") && !b.startsWith("0")) {
          background_alpha = 0.0005;
          return to.apply(what, ["ren_grid_base_alpha 0.001"]);
        }
      } else if(args[0].startsWith("ren_grid_base_alpha ")) {
        background_alpha = parseFloat(args[0].substring(20).trim()) / 2;
        return to.apply(what, [`ren_grid_base_alpha ${background_alpha * 2}`]);
      }
      return to.apply(what, args);
    }
  });

  function drawOverlay() {
    if(picking == true) {
      const r = getRatio();
      var draw = true;
      var angle;
      const w = canvas.width;
      const h = canvas.height;
      ctx.beginPath();
      ctx.fillStyle = '#00000077';
      ctx.fillRect(0, 0, w, (h - r * 0.2) | 0);
      ctx.fillRect(0, (h - r * 0.2) | 0, (w - r * 0.2) | 0, h);
      ctx.fillStyle = '#FF000077';
      ctx.fillRect(w - r * 0.3 - 1, h - r * 0.3 - 1, r * 0.1, r * 0.1);
      if(mouse[1] < h - r * 0.2) {
        if(mouse[0] < w - r * 0.2) {
          angle = Math.atan2(h - r * 0.2 - mouse[1], w - r * 0.2 - mouse[0]);
        } else {
          angle = Math.PI / 2;
        }
      } else {
        if(mouse[0] < w - r * 0.2) {
          angle = 0;
        } else {
          draw = false;
        }
      }
      if(mouse[0] > w - r * 0.3 - 1 && mouse[0] < w - r * 0.2 - 1 && mouse[1] > h - r * 0.3 - 1 && mouse[1] < h - r * 0.2 - 1) {
        draw = false;
      }
      if(draw == true) {
        ctx.moveTo(...mouse);
        ctx.lineTo(mouse[0] + Math.cos(angle) * 40, mouse[1] + Math.sin(angle) * 40);
        ctx.moveTo(mouse[0] + Math.cos(angle) * 40, mouse[1] + Math.sin(angle) * 40);
        ctx.lineTo(mouse[0] + Math.cos(angle - 0.4) * 25, mouse[1] + Math.sin(angle - 0.4) * 25);
        ctx.moveTo(mouse[0] + Math.cos(angle) * 40, mouse[1] + Math.sin(angle) * 40);
        ctx.lineTo(mouse[0] + Math.cos(angle + 0.4) * 25, mouse[1] + Math.sin(angle + 0.4) * 25);
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#ff226699';
        ctx.stroke();
      } else {
        ctx.moveTo(mouse[0] - 15, mouse[1]);
        ctx.lineTo(mouse[0] + 15, mouse[1]);
        ctx.moveTo(mouse[0], mouse[1] - 15);
        ctx.lineTo(mouse[0], mouse[1] + 15);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00000077';
        ctx.stroke();
      }
      ctx.fillStyle = '#FFFFFF77';
      ctx.font = `${30 * scale}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText('drag your cursor on the minimap', w / 2, h * 3.5 / 10);
      ctx.fillText('left click to select where you want to stay', w / 2, h * 4.5 / 10);
      ctx.fillText('click on the red area to reset your AFK location', w / 2, h * 5.5 / 10);
      ctx.fillText('press the button again to hide this overlay', w / 2, h * 6.5 / 10);
    } else if(textOverlay != 0) {
      const w = canvas.width / 2;
      const h = canvas.height / 2;
      ctx.beginPath();
      ctx.fillStyle = '#00000077';
      ctx.fillRect(0, 0, w * 2, h * 2);
      ctx.fillStyle = '#FFFFFF77';
      ctx.font = `${30 * scale}px Arial`;
      ctx.textAlign = 'center';
      switch(textOverlay) {
        case 1: {
          ctx.fillText('press the key you want to bind to picking AFK location', w, h - h / (10 / 3));
          break;
        }
        case 2: {
          ctx.fillText('press the key you want to bind to toggling AFK', w, h - h / (10 / 3));
          break;
        }
        case 3: {
          ctx.fillText('press the key you want to bind to toggling multibox', w, h - h / (10 / 3));
          break;
        }
        case 4: {
          ctx.fillText('press the key you want to bind to toggling aiming mode', w, h - h / (10 / 3));
          break;
        }
        case 5: {
          ctx.fillText('press the key you want to bind to toggling movement mode', w, h - h / (10 / 3));
          break;
        }
        case 6: {
          ctx.fillText('press the key you want to bind to receiving keys from the master tab', w, h - h / (10 / 3));
          break;
        }
        case 7: {
          ctx.fillText('picks the location which your tank will be going towards', w, h - h / 10);
          ctx.fillText('when you toggle AFK option to be on', w, h + h / 10);
          break;
        }
        case 8: {
          ctx.fillText('moves your tank towards the position you set previously', w, h - h / 10);
          ctx.fillText('if you did not set AFK location, it will be set to your current position', w, h + h / 10);
          break;
        }
        case 9: {
          ctx.fillText('enables / disables multibox (aim, movement, key copying)', w, h - h / 10);
          ctx.fillText('can be set for each tab individually', w, h + h / 10);
          break;
        }
        case 10: {
          ctx.fillText('toggles between different aiming styles for other tabs', w, h - h / 2.5);
          ctx.fillText('precise - tabs will aim based on mouse position on the map', w, h - h / 5);
          ctx.fillText('copy - tabs will aim based on mouse position on the screen', w, h);
          ctx.fillText('reverse - tabs will aim the opposite precise direction', w, h + h / 5);
          ctx.fillText('\'reverse\' option is mostly useful when having movement set to \'mouse\'', w, h + h / 2.5);
          break;
        }
        case 11: {
          ctx.fillText('toggles between different movement styles for other tabs', w, h - h / 5);
          ctx.fillText('player - moves tabs towards the player, uses own movement prediction', w, h);
          ctx.fillText('mouse - moves tabs towards the mouse to act like drones', w, h + h / 5);
          break;
        }
        case 12: {
          ctx.fillText('decides whether keys pressed on your master tab will affect this tab', w, h - h / 5);
          ctx.fillText('keep it on if you want all your tabs to be coordinated no matter what', w, h);
          ctx.fillText('keep it off if your tanks collide with each other - you have ol and octo', w, h + h / 5);
          break;
        }
      }
      if(textOverlay < 7) {
        ctx.fillText('pressing ' + KEY + ' will set the keybind to inactive (no key will be assigned)', w, h - h / 10);
        ctx.fillText('you can change the keybind anytime afterwards', w, h + h / 10);
        ctx.fillText('press the button again to hide this overlay', w, h + h / (10 / 3));
      }
    }
    requestAnimationFrame(drawOverlay);
  }

  function moveToWithRadius(x, y, r) {
    if(dist(x, y, playerPos[0], playerPos[1]) <= r) {
      window.input.keyUp(65);
      window.input.keyUp(68);
      window.input.keyUp(83);
      window.input.keyUp(87);
      return;
    }
    window.input.keyUp(65);
    window.input.keyUp(68);
    window.input.keyUp(83);
    window.input.keyUp(87);
    const angle = Math.atan2(y - playerPos[1], x - playerPos[0]);
    if(angle > -Math.PI * 2/6 && angle < Math.PI * 2/6) {
      window.input.keyDown(68);
    } else if(angle < -Math.PI * 4/6 || angle > Math.PI * 4/6) {
      window.input.keyDown(65);
    }
    if(angle > Math.PI * 1/6 && angle < Math.PI * 5/6) {
      window.input.keyDown(83);
    } else if(angle > -Math.PI * 5/6 && angle < -Math.PI * 1/6) {
      window.input.keyDown(87);
    }
  }

  function moveToAFKSpot() {
    if(afk == true) {
      if(afkSpot[0] == -1) {
        afkSpot = playerPos;
      }
      moveToWithRadius(afkSpot[0], afkSpot[1], -1);
    }
  }

  function simulateKeyPress(key, down) {
    window.dispatchEvent(new KeyboardEvent(down ? "keydown" : "keyup", {
      keyCode: key,
      shiftKey: key == 16 ? true : false
    }));
  }

  function simulateMousePress(button, down) {
    canvas.dispatchEvent(new MouseEvent(down ? "mousedown" : "mouseup", { "clientX": mouse[0], "clientY": mouse[1], "button": button }));
  }

  function ReadVarUint(packet, at) {
    var number = 0;
    var count = 0;
    do {
      number |= (packet[at] & 0x7f) << (7 * count++);
    } while((packet[at++] >> 7) == 1);
    return [number, count];
  }

  function WriteVarUint(number) {
    let vu = [];
    while(number > 0x7f) {
      vu[vu.length] = (number & 0x7f) | 0x80;
      number >>>= 7;
    }
    vu[vu.length] = number;
    return vu;
  }

  function createData() {
    var o;
    if(movement == false) {
      o = [0, ...WriteVarUint((playerPos[0] + mvel[0]) * 1000), ...WriteVarUint((playerPos[1] + mvel[1]) * 1000), (mvel[0] == 0 && mvel[1] == 0) ? 0 : 1, ...WriteVarUint((Math.atan2(mvel[1], mvel[0]) + 4) * 1000)];
    } else {
      o = [1, ...WriteVarUint(realMouse[0] * 1000), ...WriteVarUint(realMouse[1] * 1000)];
    }
    if(aim == 0) {
      o = [...o, 0, ...WriteVarUint(realMouse[0] * 1000), ...WriteVarUint(realMouse[1] * 1000)];
    } else if(aim == 1) {
      o = [...o, 1, ...WriteVarUint(32000 + (mouse[0] - canvas.width / 2) / getScale() * 10), ...WriteVarUint(32000 + (mouse[1] - canvas.height / 2) / getScale() * 10)];
    } else {
      o = [...o, 2, ...WriteVarUint(realMouse[0] * 1000), ...WriteVarUint(realMouse[1] * 1000)];
    }
    o = [...o, ...WriteVarUint(buttons)];
    return o;
  }

  function parseData(o) {
    if(afk == false) {
      window.clearInterval(mov);
      window.clearInterval(aimm);
      const w = canvas.width / 2;
      const h = canvas.height / 2;
      const type = o[0];
      var at = 1;
      const x = ReadVarUint(o, at);
      at += x[1];
      x[0] /= 1000;
      const y = ReadVarUint(o, at);
      at += y[1];
      y[0] /= 1000;
      if(type == 0) {
        const hasVel = ReadVarUint(o, at);
        at += hasVel[1];
        const ang = ReadVarUint(o, at);
        at += ang[1];
        ang[0] = ang[0] / 1000 - 4;
        const lmfao = function() {
          if(hasVel[0] == 1 && dist(x[0], y[0], playerPos[0], playerPos[1]) <= RD) {
            const a1 = Math.atan2(y[0] - playerPos[1], x[0] - playerPos[0]);
            if(Math.abs(a1 - ang[0]) < 0.5) {
              if(a1 < ang[0]) {
                moveToWithRadius(x[0] + Math.cos(ang[0] + Math.PI / 2) * SRD, y[0] + Math.sin(ang[0] + Math.PI / 2) * SRD, -1);
              } else {
                moveToWithRadius(x[0] + Math.cos(ang[0] - Math.PI / 2) * SRD, y[0] + Math.sin(ang[0] - Math.PI / 2) * SRD, -1);
              }
            } else {
              moveToWithRadius(x[0] - Math.cos(ang[0]) * SRD * 2, y[0] - Math.sin(ang[0]) * SRD * 2, RD);
            }
          } else {
            moveToWithRadius(x[0], y[0], RD);
          }
        };
        mov = window.setInterval(lmfao, 50);
        lmfao();
      } else {
        mov = window.setInterval(function() {
          moveToWithRadius(x[0], y[0], -1);
        }, 50);
        moveToWithRadius(x[0], y[0], -1);
      }
      const a = o[at++];
      const xx = ReadVarUint(o, at);
      at += xx[1];
      const yy = ReadVarUint(o, at);
      at += yy[1];
      if(a == 0) {
        const lmfao = function() {
          const angle = Math.atan2(yy[0] / 1000 - playerPos[1], xx[0] / 1000 - playerPos[0]);
          var distance = dist(xx[0] / 1000, yy[0] / 1000, playerPos[0], playerPos[1]) * getScale() * FoV * scaling;
          mouse = [w + Math.cos(angle) * distance, h + Math.sin(angle) * distance];
          window.input.mouse(w + Math.cos(angle) * distance, h + Math.sin(angle) * distance);
        };
        aimm = window.setInterval(lmfao, 50);
        lmfao();
      } else if(a == 1) {
        mouse = [(xx[0] - 32000) / 10 * getScale() + w, (yy[0] - 32000) / 10 * getScale() + h];
        window.input.mouse((xx[0] - 32000) / 10 * getScale() + w, (yy[0] - 32000) / 10 * getScale() + h);
      } else {
        const lmfao = function() {
          const angle = Math.atan2(playerPos[1] - yy[0] / 1000, playerPos[0] - xx[0] / 1000);
          var distance = dist(xx[0] / 1000, yy[0] / 1000, playerPos[0], playerPos[1]) * getScale() * FoV * scaling;
          mouse = [w + Math.cos(angle) * distance, h + Math.sin(angle) * distance];
          window.input.mouse(w + Math.cos(angle) * distance, h + Math.sin(angle) * distance);
        };
        aimm = window.setInterval(lmfao, 50);
        lmfao();
      }
      if(relyKeys == true) {
        const b = ReadVarUint(o, at);
        at += b[1];
        const d = b[0] ^ buttons;
        for(let i = 0; i < KEYS2.length; ++i) {
          if((d & (2 ** i)) != 0) {
            if(KEYS2[i] < 3) {
              simulateMousePress(KEYS2[i], (buttons & (2 ** i)) == 0);
            } else {
              simulateKeyPress(KEYS2[i], (buttons & (2 ** i)) == 0);
            }
          }
        }
        buttons = b[0];
      }
    }
  }
  window.goUp = true;
  function updateCycle() {
    if(document.hasFocus() == true) {
      window.clearInterval(mov);
      window.clearInterval(aimm);
      if(multibox == true) {
        GM_setValue("mbox", JSON.stringify(createData()));
      }
    } else if(multibox == true) {
      try {
        var g = JSON.parse(GM_getValue("mbox"));
        parseData(g);
      } catch(err){}
    }
    if(window.octoAFK == true) {
      window.input.keyUp(65);
      window.input.keyUp(68);
      window.input.keyUp(83);
      window.input.keyUp(87);
      if(playerPos[0] < 184) {
        window.input.keyDown(68);
      } else if(playerPos[0] > 186) {
        window.input.keyDown(65);
      }
      if(playerPos[1] < 30) {
        window.goUp = false;
      } else if(playerPos[1] > 186) {
        window.goUp = true;
      }
      if(window.goUp == true) {
        window.input.keyDown(87);
      } else {
        window.input.keyDown(83);
      }
    }
    requestAnimationFrame(updateCycle);
  }

  const html = `
<div id="mbox">
<button id="mboxb1" class="mboxb">Pick AFK location</button>
<button id="mboxk1" class="mboxb">${keybinds[0]==0?'-':keybinds[0]}</button>
<button id="mboxh1" class="mboxb">?</button>
<button id="mboxb2" class="mboxb">AFK: off</button>
<button id="mboxk2" class="mboxb">${keybinds[1]==0?'-':keybinds[1]}</button>
<button id="mboxh2" class="mboxb">?</button>
<button id="mboxb3" class="mboxb">Multibox: off</button>
<button id="mboxk3" class="mboxb">${keybinds[2]==0?'-':keybinds[2]}</button>
<button id="mboxh3" class="mboxb">?</button>
<button id="mboxb4" class="mboxb">Aim: precise</button>
<button id="mboxk4" class="mboxb">${keybinds[3]==0?'-':keybinds[3]}</button>
<button id="mboxh4" class="mboxb">?</button>
<button id="mboxb5" class="mboxb">Movement: player</button>
<button id="mboxk5" class="mboxb">${keybinds[4]==0?'-':keybinds[4]}</button>
<button id="mboxh5" class="mboxb">?</button>
<button id="mboxb6" class="mboxb">Receive keys: on</button>
<button id="mboxk6" class="mboxb">${keybinds[5]==0?'-':keybinds[5]}</button>
<button id="mboxh6" class="mboxb">?</button>
</div>
`;
  const css = `
<style>
.mboxb {
border: none;
text-align: center;
text-decoration: none;
font-size: max(calc(0.3em + 0.7vw), 0.8em);
width: 70%;
height: 16.66666666666666%;
display: block;
transition-duration: 0.2s;
cursor: pointer;
-webkit-touch-callout: none;
-webkit-user-select: none;
-khtml-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
}
#mbox {
position: absolute;
top: 30%;
width: max(7em, 15%);
background-color: #00000010;
height: max(7em, 35%);
display: none;
}
#mboxb1 {
position: absolute;
top: 0;
left: 30%;
background-color: #4CAF50;
color: #FFFFFF;
border: 0.3em solid #4CAF50;
}
#mboxb1:hover {
background-color: #4CAF5000;
}
#mboxk1 {
position: absolute;
width: 15%;
top: 0;
left: 15%;
background-color: #4CAF50;
color: #FFFFFF;
border: 0.3em solid #4CAF50;
}
#mboxk1:hover {
background-color: #4CAF5000;
}
#mboxh1 {
position: absolute;
width: 15%;
top: 0;
left: 0;
background-color: #4CAF50;
color: #FFFFFF;
border: 0.3em solid #4CAF50;
}
#mboxh1:hover {
background-color: #4CAF5000;
}
#mboxb2 {
position: absolute;
top: 16.66666666666666%;
left: 30%;
background-color: #008CBA;
color: #FFFFFF;
border: 0.3em solid #008CBA;
}
#mboxb2:hover {
background-color: #008CBA00;
}
#mboxk2 {
position: absolute;
width: 15%;
top: 16.66666666666666%;
left: 15%;
background-color: #008CBA;
color: #FFFFFF;
border: 0.3em solid #008CBA;
}
#mboxk2:hover {
background-color: #008CBA00;
}
#mboxh2 {
position: absolute;
width: 15%;
top: 16.66666666666666%;
left: 0;
background-color: #008CBA;
color: #FFFFFF;
border: 0.3em solid #008CBA;
}
#mboxh2:hover {
background-color: #008CBA00;
}
#mboxb3 {
position: absolute;
top: 33.33333333333333%;
left: 30%;
background-color: #f44336;
color: #FFFFFF;
border: 0.3em solid #f44336;
}
#mboxb3:hover {
background-color: #f4433600;
}
#mboxk3 {
position: absolute;
width: 15%;
top: 33.33333333333333%;
left: 15%;
background-color: #f44336;
color: #FFFFFF;
border: 0.3em solid #f44336;
}
#mboxk3:hover {
background-color: #f4433600;
}
#mboxh3 {
position: absolute;
width: 15%;
top: 33.33333333333333%;
left: 0;
background-color: #f44336;
color: #FFFFFF;
border: 0.3em solid #f44336;
}
#mboxh3:hover {
background-color: #f4433600;
}
#mboxb4 {
position: absolute;
top: 50%;
left: 30%;
background-color: #e7e7e7;
color: #000000;
border: 0.3em solid #e7e7e7;
}
#mboxb4:hover {
background-color: #e7e7e700;
color: #FFFFFF;
}
#mboxk4 {
position: absolute;
width: 15%;
top: 50%;
left: 15%;
background-color: #e7e7e7;
color: #000000;
border: 0.3em solid #e7e7e7;
}
#mboxk4:hover {
background-color: #e7e7e700;
color: #FFFFFF;
}
#mboxh4 {
position: absolute;
width: 15%;
top: 50%;
left: 0;
background-color: #e7e7e7;
color: #000000;
border: 0.3em solid #e7e7e7;
}
#mboxh4:hover {
background-color: #e7e7e700;
color: #FFFFFF;
}
#mboxb5 {
position: absolute;
top: 66.66666666666666%;
left: 30%;
background-color: #555555;
color: #FFFFFF;
border: 0.3em solid #555555;
}
#mboxb5:hover {
background-color: #55555500;
}
#mboxk5 {
position: absolute;
width: 15%;
top: 66.66666666666666%;
left: 15%;
background-color: #555555;
color: #FFFFFF;
border: 0.3em solid #555555;
}
#mboxk5:hover {
background-color: #55555500;
}
#mboxh5 {
position: absolute;
width: 15%;
top: 66.66666666666666%;
left: 0;
background-color: #555555;
color: #FFFFFF;
border: 0.3em solid #555555;
}
#mboxh5:hover {
background-color: #55555500;
}
#mboxb6 {
position: absolute;
top: 83.33333333333333%;
left: 30%;
background-color: #FFFF66;
color: #000000;
border: 0.3em solid #FFFF66;
}
#mboxb6:hover {
background-color: #FFFF6600;
color: #FFFFFF;
}
#mboxk6 {
position: absolute;
width: 15%;
top: 83.33333333333333%;
left: 15%;
background-color: #FFFF66;
color: #000000;
border: 0.3em solid #FFFF66;
}
#mboxk6:hover {
background-color: #FFFF6600;
color: #FFFFFF;
}
#mboxh6 {
position: absolute;
width: 15%;
top: 83.33333333333333%;
left: 0;
background-color: #FFFF66;
color: #000000;
border: 0.3em solid #FFFF66;
}
#mboxh6:hover {
background-color: #FFFF6600;
color: #FFFFFF;
}
</style>
`;

  requestAnimationFrame(drawOverlay);
  requestAnimationFrame(updateCycle);
  window.setInterval(moveToAFKSpot, 100);
  canvas.insertAdjacentHTML('afterend', css);
  canvas.insertAdjacentHTML('afterend', html);
  menu = document.getElementById('mbox');
  const AFKLocationButton = document.getElementById('mboxb1');
  AFKLocationButton.onclick = function(e) {
    if(document.hasFocus() == false || e == undefined) {
      return;
    }
    if(textOverlay != 0) {
      textOverlay = 0;
    }
    picking = !picking;
  };
  const AFKButton = document.getElementById('mboxb2');
  AFKButton.onclick = function(e) {
    if(document.hasFocus() == false || e == undefined) {
      return;
    }
    afk = !afk;
    if(afk == true) {
      window.clearInterval(mov);
      window.clearInterval(aimm);
      this.innerHTML = 'AFK: on';
    } else {
      this.innerHTML = 'AFK: off';
      window.input.keyUp(65);
      window.input.keyUp(68);
      window.input.keyUp(83);
      window.input.keyUp(87);
    }
  };
  const multiboxButton = document.getElementById('mboxb3');
  multiboxButton.onclick = function(e) {
    if(document.hasFocus() == false || e == undefined) {
      return;
    }
    multibox = !multibox;
    if(multibox == true) {
      this.innerHTML = 'Multibox: on';
    } else {
      this.innerHTML = 'Multibox: off';
    }
  };
  const aimButton = document.getElementById('mboxb4');
  aimButton.onclick = function(e) {
    if(document.hasFocus() == false || e == undefined) {
      return;
    }
    aim = (aim + 1) % 3;
    if(aim == 1) {
      this.innerHTML = 'Aim: copy';
    } else if(aim == 2) {
      this.innerHTML = 'Aim: reverse';
    } else {
      this.innerHTML = 'Aim: precise';
    }
  };
  const movementButton = document.getElementById('mboxb5');
  movementButton.onclick = function(e) {
    if(document.hasFocus() == false || e == undefined) {
      return;
    }
    movement = !movement;
    if(movement == true) {
      this.innerHTML = 'Movement: mouse';
    } else {
      this.innerHTML = 'Movement: player';
    }
  };
  const relykeysButton = document.getElementById('mboxb6');
  relykeysButton.onclick = function(e) {
    if(document.hasFocus() == false || e == undefined) {
      return;
    }
    relyKeys = !relyKeys;
    if(relyKeys == true) {
      this.innerHTML = 'Receive keys: on';
    } else {
      this.innerHTML = 'Receive keys: off';
    }
  };
  let i = 1;
  let k;
  for(; i < 7; ++i) {
    k = document.getElementById('mboxk' + i);
    const a = i;
    k.onclick = function(e) {
      picking = false;
      if(textOverlay == 0) {
        textOverlay = a;
      } else if(a == textOverlay) {
        textOverlay = 0;
      } else {
        textOverlay = a;
      }
    };
  }
  for(i = 1; i < 7; ++i) {
    k = document.getElementById('mboxh' + i);
    const a = i + 6;
    k.onclick = function() {
      picking = false;
      if(textOverlay == 0) {
        textOverlay = a;
      } else if(a == textOverlay) {
        textOverlay = 0;
      } else {
        textOverlay = a;
      }
    };
  }
}
// ==UserScript==
// @name         Advanced Multibox
// @version      1.32
// @description  Press 1 to open the menu
// @author       Shädam
// @match        https://diep.io/*
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    https://greasyfork.org/users/719520
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/503033/Advanced%20Multibox.user.js
// @updateURL https://update.greasyfork.org/scripts/503033/Advanced%20Multibox.meta.js
// ==/UserScript==

delete localStorage["rivet:token"];

let win = typeof unsafeWindow != "undefined" ? unsafeWindow : window;

var int = win.setInterval(function() {
  if(win.input != null) {
    win.clearInterval(int);
    onready();
  }
}, 100);

function onready() {
  const KEY = '1';
  const scaling = 64;
  const scale = win.devicePixelRatio;
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

  var got = false;
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
  var slowerAfk = 0;

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
	38: 1,

    83: 2,
	40: 2,

    65: 4,
	37: 4,

    68: 8,
	39: 8
  };

  const RD = 2.5;
  const MRD = 0.1;
  const SRD = RD + MRD;
  const DRD = SRD * (Math.sqrt(2) / 2);

  const keybinds = localStorage.getItem("multbox_keybinds") ? JSON.parse(localStorage.getItem("multbox_keybinds")) : ["XD", "XD", "XD", "XD", "XD", "XD"];

  if(keybinds.length != 6) {
    for(let i = keybinds.length; i < 6; ++i) {
      keybinds[i] = "XD";
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

  win.onmousemove = new Proxy(win.onmousemove ?? function(){}, {
    apply: function(to, what, args) {
      const e = args[0];
      mouse = getMousePos(e);
      realMouse = [playerPos[0] + (mouse[0] - canvas.width / 2) / getScale() / FoV / scaling,
                   playerPos[1] + (mouse[1] - canvas.height / 2) / getScale() / FoV / scaling];
      return to.apply(what, args);
    }
  });
  win.onmousedown = new Proxy(win.onmousedown ?? function(){}, {
    apply: function(to, what, args) {
      const e = args[0];
      if(picking == true) {
        const w = canvas.width;
        const h = canvas.height;
        const r = getRatio();
        if(withinMinimap(e.clientX * scale, e.clientY * scale) == true) {
          afkSpot = [(e.clientX * scale - w + r * 0.2) / getScale(), (e.clientY * scale - h + r * 0.2) / getScale()];
        } else if(e.clientX * scale > w - r * 0.3 - 1 && e.clientX * scale < w - r * 0.2 - 1 && e.clientY * scale > h - r * 0.3 - 1 && e.clientY * scale < h - r * 0.2 - 1) {
          afkSpot = [-1, 0];
        } else {
		  afkSpot = realMouse;
		}
		picking = false;
      }
      if(KEYS[e.button] != null && (buttons & KEYS[e.button]) == 0) {
        buttons |= KEYS[e.button];
      }
      return to.apply(what, args);
    }
  });
  win.onmouseup = new Proxy(win.onmouseup ?? function(){}, {
    apply: function(to, what, args) {
      const e = args[0];
      if(KEYS[e.button] != null && (buttons & KEYS[e.button]) != 0) {
        buttons ^= KEYS[e.button];
      }
      return to.apply(what, args);
    }
  });
  win.onkeydown = new Proxy(win.onkeydown ?? function(){}, {
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
		let code = MKEYS[e.keyCode];
        bmov |= code;
        switch(code) {
          case 4: {
            vel[0] -= 1;
            break;
          }
          case 8: {
            vel[0] += 1;
            break;
          }
          case 2: {
            vel[1] += 1;
            break;
          }
          case 1: {
            vel[1] -= 1;
            break;
          }
        }
        normalizeVel();
      }
      if(textOverlay == 0 || textOverlay > 6) {
        for(let i = 0; i < keybinds.length; ++i) {
          if(e.key == keybinds[i]) {
            document.getElementById('mboxb' + (i + 1)).dispatchEvent(new MouseEvent("click"));
          }
        }
      } else {
        if(e.key == KEY) {
          keybinds[textOverlay - 1] = "XD";
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
  win.onkeyup = new Proxy(win.onkeyup ?? function(){}, {
    apply: function(to, what, args) {
      const e = args[0];
      let code = KEYS[e.keyCode];
      if(code != null && (buttons & code) != 0) {
        buttons ^= code;
      }
	  code = MKEYS[e.keyCode];
      if(code != null && (bmov & code) != 0) {
        bmov ^= code;
        switch(code) {
          case 4: {
            vel[0] += 1;
            break;
          }
          case 8: {
            vel[0] -= 1;
            break;
          }
          case 2: {
            vel[1] -= 1;
            break;
          }
          case 1: {
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
      if((what.fillStyle == '#cdcdcd' || what.fillStyle == '#cccccc') && what.strokeStyle == '#000000') {
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
          if(withinMinimap(x, y) == true && d < 15 * scale * getScale() && what.fillStyle == "#000000" && !got) {
            const angle = Math.atan2(secondPos[1] - y, secondPos[0] - x) - 0.3674113;
            const r = getRatio();
            const xx = (x + Math.cos(angle) * d * 0.8660111 - canvas.width + r * 0.2) / getScale();
            const yy = (y + Math.sin(angle) * d * 0.8660111 - canvas.height + r * 0.2) / getScale();
			  console.log(xx.toFixed(2), yy.toFixed(2), getScale(), getRatio());
            playerPos = [xx, yy];
			got = true;
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
      ctx.moveTo(mouse[0] - 15, mouse[1]);
      ctx.lineTo(mouse[0] + 15, mouse[1]);
      ctx.moveTo(mouse[0], mouse[1] - 15);
      ctx.lineTo(mouse[0], mouse[1] + 15);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00000077';
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF77';
      ctx.font = `${30 * scale}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText('drag your cursor on the minimap', w / 2, (h - h / 2.5) / 2);
      ctx.fillText('left click to select where you want to stay', w / 2, (h - h / 5) / 2);
      ctx.fillText('click on the red area to reset your AFK location', w / 2, (h) / 2);
	  ctx.fillText('click anywhere else to stay at that location', w / 2, (h + h / 5) / 2);
      ctx.fillText('press the button again to hide this overlay', w / 2, (h + h / 2.5) / 2);
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
          ctx.fillText('keep it off if eg. auto fire off shouldn\'t affect other tabs', w, h + h / 5);
          break;
        }
      }
      if(textOverlay < 7) {
        ctx.fillText('pressing ' + KEY + ' will set the keybind to inactive (no key will be assigned)', w, h - h / 10);
        ctx.fillText('you can change the keybind anytime afterwards', w, h + h / 10);
        ctx.fillText('press the button again to hide this overlay', w, h + h / (10 / 3));
      }
    }
	got = false;
    requestAnimationFrame(drawOverlay);
  }

  function moveToWithRadius(x, y, r) {
    if(dist(x, y, playerPos[0], playerPos[1]) <= r) {
      win.input.key_up(65);
      win.input.key_up(68);
      win.input.key_up(83);
      win.input.key_up(87);
      return;
    }
    win.input.key_up(65);
    win.input.key_up(68);
    win.input.key_up(83);
    win.input.key_up(87);
    const angle = Math.atan2(y - playerPos[1], x - playerPos[0]);
    if(angle > -Math.PI * 2/6 && angle < Math.PI * 2/6) {
      win.input.key_down(68);
    } else if(angle < -Math.PI * 4/6 || angle > Math.PI * 4/6) {
      win.input.key_down(65);
    }
    if(angle > Math.PI * 1/6 && angle < Math.PI * 5/6) {
      win.input.key_down(83);
    } else if(angle > -Math.PI * 5/6 && angle < -Math.PI * 1/6) {
      win.input.key_down(87);
    }
  }

  function moveToAFKSpot() {
    if(afk == true) {
      if(afkSpot[0] == -1) {
        afkSpot = playerPos;
      }
      if(!win.tripletTroll || ++slowerAfk % 3 == 0) {
        moveToWithRadius(afkSpot[0], afkSpot[1], -1);
      } else {
        win.input.key_up(65);
        win.input.key_up(68);
        win.input.key_up(83);
        win.input.key_up(87);
      }
    }
  }

  function simulateKeyPress(key, down) {
	down ? win.input.key_down(key) : win.input.key_up(key);
  }

  function simulateMousePress(button, down) {
	win.input.mouse(...mouse);
	++button;
	down ? win.input.key_down(button) : win.input.key_up(button);
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
      win.clearInterval(mov);
      win.clearInterval(aimm);
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
        mov = win.setInterval(lmfao, 50);
        lmfao();
      } else {
        mov = win.setInterval(function() {
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
          win.input.mouse(w + Math.cos(angle) * distance, h + Math.sin(angle) * distance);
        };
        aimm = win.setInterval(lmfao, 50);
        lmfao();
      } else if(a == 1) {
        mouse = [(xx[0] - 32000) / 10 * getScale() + w, (yy[0] - 32000) / 10 * getScale() + h];
        win.input.mouse((xx[0] - 32000) / 10 * getScale() + w, (yy[0] - 32000) / 10 * getScale() + h);
      } else {
        const lmfao = function() {
          const angle = Math.atan2(playerPos[1] - yy[0] / 1000, playerPos[0] - xx[0] / 1000);
          var distance = dist(xx[0] / 1000, yy[0] / 1000, playerPos[0], playerPos[1]) * getScale() * FoV * scaling;
          mouse = [w + Math.cos(angle) * distance, h + Math.sin(angle) * distance];
          win.input.mouse(w + Math.cos(angle) * distance, h + Math.sin(angle) * distance);
        };
        aimm = win.setInterval(lmfao, 50);
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

  Object.freeze(CanvasRenderingContext2D.prototype);

  win.goUp = true;
  function updateCycle() {
    if(document.hasFocus() == true) {
      win.clearInterval(mov);
      win.clearInterval(aimm);
      if(multibox == true) {
        GM_setValue("mbox", JSON.stringify(createData()));
      }
    } else if(multibox == true) {
      try {
        var g = JSON.parse(GM_getValue("mbox"));
        parseData(g);
      } catch(err){}
    }
    if(win.octoAFK == true) {
      win.input.key_up(65);
      win.input.key_up(68);
      win.input.key_up(83);
      win.input.key_up(87);
      if(playerPos[0] < 184) {
        win.input.key_down(68);
      } else if(playerPos[0] > 186) {
        win.input.key_down(65);
      }
      if(playerPos[1] < 30) {
        win.goUp = false;
      } else if(playerPos[1] > 186) {
        win.goUp = true;
      }
      if(win.goUp == true) {
        win.input.key_down(87);
      } else {
        win.input.key_down(83);
      }
    }
    requestAnimationFrame(updateCycle);
  }

  const html = `
<div id="mbox">
<button id="mboxb1" class="mboxb">Pick AFK location</button>
<button id="mboxk1" class="mboxb">${keybinds[0]=="XD"?'-':keybinds[0]}</button>
<button id="mboxh1" class="mboxb">?</button>
<button id="mboxb2" class="mboxb">AFK: off</button>
<button id="mboxk2" class="mboxb">${keybinds[1]=="XD"?'-':keybinds[1]}</button>
<button id="mboxh2" class="mboxb">?</button>
<button id="mboxb3" class="mboxb">Multibox: off</button>
<button id="mboxk3" class="mboxb">${keybinds[2]=="XD"?'-':keybinds[2]}</button>
<button id="mboxh3" class="mboxb">?</button>
<button id="mboxb4" class="mboxb">Aim: precise</button>
<button id="mboxk4" class="mboxb">${keybinds[3]=="XD"?'-':keybinds[3]}</button>
<button id="mboxh4" class="mboxb">?</button>
<button id="mboxb5" class="mboxb">Movement: player</button>
<button id="mboxk5" class="mboxb">${keybinds[4]=="XD"?'-':keybinds[4]}</button>
<button id="mboxh5" class="mboxb">?</button>
<button id="mboxb6" class="mboxb">Receive keys: on</button>
<button id="mboxk6" class="mboxb">${keybinds[5]=="XD"?'-':keybinds[5]}</button>
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
z-index: 200;
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
  win.setInterval(moveToAFKSpot, 100);
  canvas.insertAdjacentHTML('afterend', css);
  canvas.insertAdjacentHTML('afterend', html);
  menu = document.getElementById('mbox');
  const AFKLocationButton = document.getElementById('mboxb1');
  AFKLocationButton.addEventListener("click", function(e) {
	if(!document.hasFocus() || !(e instanceof MouseEvent)) return;
    if(textOverlay != 0) {
      textOverlay = 0;
    }
    picking = !picking;
  });
  const AFKButton = document.getElementById('mboxb2');
  AFKButton.addEventListener("click", function(e) {
	if(!document.hasFocus() || !(e instanceof MouseEvent)) return;
    afk = !afk;
    if(afk == true) {
      win.clearInterval(mov);
      win.clearInterval(aimm);
      this.innerHTML = 'AFK: on';
    } else {
      this.innerHTML = 'AFK: off';
      win.input.key_up(65);
      win.input.key_up(68);
      win.input.key_up(83);
      win.input.key_up(87);
    }
  });
  const multiboxButton = document.getElementById('mboxb3');
  multiboxButton.addEventListener("click", function(e) {
	if(!document.hasFocus() || !(e instanceof MouseEvent)) return;
    multibox = !multibox;
    if(multibox == true) {
      this.innerHTML = 'Multibox: on';
    } else {
      this.innerHTML = 'Multibox: off';
    }
  });
  const aimButton = document.getElementById('mboxb4');
  aimButton.addEventListener("click", function(e) {
	if(!document.hasFocus() || !(e instanceof MouseEvent)) return;
    aim = (aim + 1) % 3;
    if(aim == 1) {
      this.innerHTML = 'Aim: copy';
    } else if(aim == 2) {
      this.innerHTML = 'Aim: reverse';
    } else {
      this.innerHTML = 'Aim: precise';
    }
  });
  const movementButton = document.getElementById('mboxb5');
  movementButton.addEventListener("click", function(e) {
	if(!document.hasFocus() || !(e instanceof MouseEvent)) return;
    movement = !movement;
    if(movement == true) {
      this.innerHTML = 'Movement: mouse';
    } else {
      this.innerHTML = 'Movement: player';
    }
  });
  const relykeysButton = document.getElementById('mboxb6');
  relykeysButton.addEventListener("click", function(e) {
	if(!document.hasFocus() || !(e instanceof MouseEvent)) return;
    relyKeys = !relyKeys;
    if(relyKeys == true) {
      this.innerHTML = 'Receive keys: on';
    } else {
      this.innerHTML = 'Receive keys: off';
    }
  });
  let i = 1;
  let k;
  for(; i < 7; ++i) {
    k = document.getElementById('mboxk' + i);
    const a = i;
    k.addEventListener("click", function(e) {
      if(!document.hasFocus() || !(e instanceof MouseEvent)) return;
      picking = false;
      if(textOverlay == 0) {
        textOverlay = a;
      } else if(a == textOverlay) {
        textOverlay = 0;
      } else {
        textOverlay = a;
      }
    });
  }
  for(i = 1; i < 7; ++i) {
    k = document.getElementById('mboxh' + i);
    const a = i + 6;
    k.addEventListener("click", function(e) {
      if(!document.hasFocus() || !(e instanceof MouseEvent)) return;
      picking = false;
      if(textOverlay == 0) {
        textOverlay = a;
      } else if(a == textOverlay) {
        textOverlay = 0;
      } else {
        textOverlay = a;
      }
    });
  }
}
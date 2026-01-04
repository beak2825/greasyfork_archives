// ==UserScript==
// @name         Truffle Pig Public
// @namespace    Truffle Pig Public
// @version      0.9.1
// @description  Finding all the tasty truffles for you! (Public Edition)
// @author       Arimas
// @match        https://agma.io/
// @icon         https://www.google.com/s2/favicons?domain=agma.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498526/Truffle%20Pig%20Public.user.js
// @updateURL https://update.greasyfork.org/scripts/498526/Truffle%20Pig%20Public.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
var trufflePigPublic = {
    // Mass := cell-area * factor
    MASS_AREA_FACTOR: 0.0031828408,
 
    // How many times must a cell be bigger to eat another cell?
    CELL_EATING_FACTOR: 1.3, // TODO: Check!
 
    // Amount of mass at spawn. ATTENTION: The mass can be either this or less than this!
    MAX_START_SPAWN_MASS: 141,
 
    // How big must a cell be to pick up a coin? 126-134???
    COIN_PICKUP_MASS: 126,
 
    // If true, bot will automatically respawn when dead
    autoRespawn: true,
 
    // If true, mouse movements by the user will override the movement of the bot
    allowUserOverride: true,
 
    // Last time (in milliseconds) when the user controlled the bot ( = moved the mouse)
    userControlledAt: null,
 
    // If set to true, show debugging information. Do not change this after init!
    debug: false,
 
    // Int - current player position as it is used by the camera (midpoint of all my cells)
    x: null,
 
    // Int - current player position as it is used by the camera (midpoint of all my cells)
    y: null,
 
    // Is unknown so will be figured out while playing (prob main room borders could be detected  though)
    mapWidth: 0,
 
    mapHeight: 0,
 
    // Maximum number of cells (pieces) a player can have (we dont really know that due to diff. servers so have to learn it on the fly)
    maxCells: 64,
 
    // My cells - with x, y, mass, radius, area. NOTE: The smallest cell has index 0, the biggest has the highest index!
    cells: [],
 
    // My cells, but only temporary. Will be copied into the cells array once its filled
    tempCells: [],
 
    // Visible coins
    coins: [],
 
    // Coinbs, but only tewmporarytemporary. Will be copied into the coins array once its filled.
    tempCoins: [],
 
    // Int - current total player mass (incorrect when the player is in portals!)
    mass: 0,
 
    // Int - temporary current total player mass, will be copied to the mass property
    tempMass: 0,
 
    // Is the bot currently alive?
    alive: false,
 
    // URL of my skin
    skinUrl: null,
 
    // Zoom factor
    zoom: null,
 
    // If true bot doesnt do anything
    stopped: false,
 
    // Time when the bot was initialized
    startedAt: null,
 
    // Last time when the bot spawned
    spawnedAt: null,
 
    // Last time (in milliseconds) when we tried to split
    splitAt: null,
 
    // Counter for the main loop iterations
    iteration: 0,
 
    // Is the bot respawning right now? (This is a process that needs several seconds to complete)
    respawning: false,
 
    // Saves the official key bindings
    hotkeys: null,
 
    startCoins: 0,
 
    // Original drawImage() function
    originalDrawImage: null,
 
    /**
     * Start the bot
     */
    init: function() {
      var self = this;
      window.ventron = this;
 
      this.startedAt = new Date();
 
      this.skinUrl = this.getSkinUrl();
      if (this.skinUrl == 'https://agma.io/skins/0_lo.png') {
        alert('No skin chosen - bot does not work. Pick skin and reload page.');
        return;
      }
 
      if (this.debug) {
        var $crosshair = $('<div id="bot-crosshair" style="position: fixed; left: 50%; top: 50%; width: 4px; height: 4px; margin-left: -2px; margin-top: -2px; background-color: red; z-index: 999"></div>');
        $('body').append($crosshair);
      }
 
      setFixedZoom(true);
 
      var agmaSettings = JSON.parse(localStorage.getItem('settings'));
      if (agmaSettings.fixedZoomScale > 0.4) {
        alert('Please zoom out a bit.');
      }
 
        this.startCoins = this.getCoins();
 
      this.originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
      CanvasRenderingContext2D.prototype.drawImage = this.drawImage;
 
      $(document).mousemove(function(event) {
        // Synthetic events are those we create when moving the virtual mouse pointer
        if (! event.synthetic && self.allowUserOverride) {
          self.userControlledAt = Date.now();
        }
      });
 
      // If the shop close button is clicked, get and save my skin URL - it may have been changed
      $('#shopModalDialog .close').click(function() {
        setTimeout(function() {
          self.skinUrl = self.getSkinUrl();
        }, 100);
      });
 
      $('#chtbox').keydown(function(event) {
        if (event.keyCode == 13) {
          if (self.checkChatBox()) {
            $('#chtbox').val('');
          }
        }
      });
 
      this.hotkeys = JSON.parse(localStorage.getItem('hotkeys'));
 
      window.addEventListener('keypress', function(event)
      {
        // Do nothing if a menu is open
        if (document.getElementById('overlays').style.display !== 'none' || document.getElementById('advert').style.display !== 'none') {
          return;
        }
        // Ignore text input fields
        if (document.activeElement.type === 'text' || document.activeElement.type === 'password') {
          return;
        }
      });
 
      if (this.debug) {
        this.$debugOutput = $('<div style="position: fixed; left: 250px; top: 75px; z-index: 9999; color: #3e3e3e; pointer-events: none">');
        $('body').append(this.$debugOutput);
      }
 
      var originalRequest = window.requestAnimationFrame;
      window.requestAnimationFrame = function (callback) {
        var result = originalRequest.apply(this, arguments);
 
        self.mass = self.tempMass;
        self.cells = self.tempCells;
        self.coins = self.tempCoins;
        self.run.apply(self);
        self.tempMass = 0;
        self.tempCells = [];
        self.tempCoins = [];
 
        return result;
      };
      originalRequest(this.run.bind(this));
 
        let message = '🐷  Truffle Pig Public is ready! The truffles will be yours.';
        self.swal(
                'Truffle Pig Public Bot',
                message + '<br><br><b>ATTENTION</b>: Bot needs a skin to be put on.<br>  Bot works best on Solo AGF.<br> Type <i>/bot help</i> for help!<br> Bot cant split while you type in the chat!');
      console.log('%' + message, 'background-color: black; color: pink; font-weight: bold; padding:5px;');
 
    },
 
    /**
     * Main method. Once started, it is running in a never ending loop.
     */
    run: function() {
      var agmaSettings = JSON.parse(localStorage.getItem('settings'));
      this.zoom = agmaSettings.fixedZoomScale;
 
        if (this.stopped) {
            return;
        }
 
      if (this.isDeathPopupVisible()) {
        this.alive = false;
      }
 
      if (this.autoRespawn && ! this.alive) {
        this.respawn();
      }
 
      if (this.alive) {
 
 
 
 
          if (this.mass > 0 && this.mass < 0.75 * this.MAX_START_SPAWN_MASS && ! this.respawning &&
              (this.coins.length == 0 || this.mass < this.COIN_PICKUP_MASS)) {
              this.respawn(); // No return - respawn does not always work!!
          }
          if (this.spawnedAt !== null && Date.now() - this.spawnedAt > 30000 && this.coins.length == 0) {
               this.respawn();
          }
          if (this.spawnedAt !== null && Date.now() - this.spawnedAt > 120000) {
               this.respawn();
          }
 
          if (! this.collectCoin()) {
 
 
              if (this.cells.length < 16) {
                  self.macroSplit();
              }
 
                  let angle = null;
                  if (Date.now() - this.startedAt > 3 * 60 * 1000 && Date.now() - this.changedTargetAt > 1000) {
 
                       if (this.x < 0.03 * this.mapWidth) {
                        this.angle = this.getRandomInt(0 + 30,180 - 30);
                       }
                      if (this.x > 0.97 * this.mapWidth) {
                          this.angle = this.getRandomInt(180 + 30,359 - 30);
                      }
                      if (this.y < 0.03 * this.mapHeight) {
                          this.angle = this.getRandomInt(90 + 30,270 - 30);
                      }
                      if (this.y > 0.97 * this.mapHeight) {
                          this.angle = this.getRandomInt(270 + 30, 360 + 90 - 30) % 360;
                      }
                  }
              if (this.changedTargetAt === undefined || Date.now() - this.changedTargetAt > 3000 ||angle !== null) {
                  if (Date.now() - this.startedAt > 3 * 60 * 1000) {
 
                       if (this.x < 0.1 * this.mapWidth) {
                           this.angle = this.getRandomInt(0 + 30,180 - 30);
                       }
                       if (this.x > 0.9 * this.mapWidth) {
                           this.angle = this.getRandomInt(180 + 30,359 - 30);
                       }
                       if (this.y < 0.1 * this.mapHeight) {
                           this.angle = this.getRandomInt(90 + 30,270 - 30);
                       }
                       if (this.y > 0.9 * this.mapHeight) {
                           this.angle = this.getRandomInt(270 + 30, 360 + 90 - 30) % 360;
                       }
 
                  }
                   if (angle === null) {
                       angle = this.getRandomInt(1,359);
                   }
 
                  this.steerAngle(angle);
                  this.changedTargetAt = Date.now();
              }
          }
 
      }
 
      this.iteration++;
    },
 
    /**
     * This overwrites the original drawImage function. This allows us to get all the drawImage() calls,
     * with coordinates of the images, so we can get the position of things on the map, for instance of cells.
     */
    drawImage: function (image, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight) {
      var self = window.ventron;
      var radius, mass;
 
      if (this.canvas.id === 'canvas') {
        // Detect myself (one of my cells)
        if (self.skinUrl && (image.src == self.skinUrl.replace('_lo.', '.') || image.src == self.skinUrl)) {
          self.alive = true;
          if (self.spawnedAt === null) {
            self.spawnedAt = Date.now();
          }
 
          radius = sourceWidth / 2;
          mass = self.getCellMass(radius);
 
          var x = parseInt(sourceX + radius);
          var y = parseInt(sourceY + radius);
 
            if (x > self.mapWidth) {
                self.mapWidth = x;
            }
            if (y > self.mapHeight) {
                self.mapHeight = y;
            }
 
          self.tempMass += mass;
 
          self.cloaked = (this.globalAlpha < 1);
 
          self.tempCells.push({ x: x, y: y, mass: mass, radius: radius });
 
          self.x = 0;
          self.y = 0;
          self.tempCells.forEach(function(cell) {
            self.x += cell.x;
            self.y += cell.y;
          });
          self.x /= self.tempCells.length;
          self.y /= self.tempCells.length;
 
            if (self.tempCells.length > self.maxCells) {
                self.maxCells = self.tempCells.length
            }
 
          if (self.debug) {
            //var $crosshair = $("#bot-crosshair");
            //$("#bot-crosshair").css('left', self.getScreenPosX(sourceX));
            //$("#bot-crosshair").css('top', self.getScreenPosY(sourceY));
 
            self.$debugOutput.text('x: ' + parseInt(self.x) + ', y: ' + parseInt(self.y) + ', mass: ' + parseInt(self.tempMass) + ', cells: ' + self.tempCells.length);
          }
        }
 
        // Detect coin
        if ((image.src == 'https://agma.io/skins/objects/9_lo.png?v=1' || image.src == 'https://agma.io/skins/objects/9.png?v=1')) {
          let matrix = this.getTransform() ;
            self.tempCoins.push({x: self.getGamePosX(matrix.e), y: self.getGamePosY(matrix.f)});
        }
      }
 
      return self.originalDrawImage.apply(this, arguments);
    },
 
      collectCoin: function() {
          // Eat coins
          if (this.coins.length > 0 && this.mass > this.COIN_PICKUP_MASS) {
              // Find the closest coin
              let coin = null, minDistance = Number.MAX_VALUE;
              this.coins.forEach(function(inspectedCoin) {
                  let distance = self.getDistance(self.x, self.y, inspectedCoin.x, inspectedCoin.y);
                  if (distance < minDistance) {
                      minDistance = distance;
                      coin = inspectedCoin;
                  }
              });
 
              if (minDistance < 100 && this.cells.length > 1) {
                  self.merge();
              } else {
                  let myScreenX = this.getScreenPosX(this.x), myScreenY = this.getScreenPosY(this.y);
                  let screenDistance = self.getDistance(myScreenX, myScreenY, this.getScreenPosX(coin.x), this.getScreenPosX(coin.y));
                  self.steer(coin.x, coin.y, screenDistance + 50);
              }
 
 
 
              if (this.coinsMode && Date.now() - this.splitAt > 500) {
                  if (this.cells.length === 1 && this.mass > 2 * this.COIN_PICKUP_MASS && minDistance > 50) {
                      self.split();
                  } else {
                     // if (this.cells.length === 1 && this.mass > 4 * this.COIN_PICKUP_MASS && minDistance > 100) {
                      //    self.doubleSplit();
                      //}
                  }
              }
 
              return true;
          }
          return false;
      },
 
    merge: function(targetX, targetY)
    {
      var mouseX, mouseY;
      if (targetX === undefined || targetY === undefined) {
        mouseX = window.innerWidth / 2 + this.getRandomInt(-15, 15);
        mouseY = window.innerHeight / 2 + this.getRandomInt(-15, 15);
      } else {
        mouseX = this.getScreenPosX(targetX);
        mouseY = this.getScreenPosY(targetY);
      }
 
      $('canvas').trigger($.Event('mousemove', {clientX: mouseX, clientY: mouseY, synthetic: true}));
    },
 
    /**
     * Moves the bot directly in the direction of given coordinates.
     * Won't avoid obstacles, won't use pathfinding.
     * It does not matter of the coordinates are on the map or not.
     */
    steer: function(targetX, targetY, screenDistance, sourceX, sourceY) {
      if (typeof screenDistance === 'undefined') {
        screenDistance = Math.ceil(Math.max(window.innerWidth, window.innerHeight) / 2);
      }
 
      if (sourceX === undefined || sourceY === undefined) {
        sourceX = this.x;
        sourceY = this.y;
      }
 
      var angle = this.getAngle(sourceX, sourceY, targetX, targetY);
 
      this.steerAngle(angle, screenDistance);
    },
 
    /**
     * Moves the bot directly in the direction of a given angle.
     * Won't avoid obstacles, won't use pathfinding.
     * It does not matter of the coordinates are on the map or not.
     */
    steerAngle: function(angle, screenDistance) {
      if (typeof screenDistance === 'undefined') {
        screenDistance = Math.ceil(Math.max(window.innerWidth, window.innerHeight) / 2);
      }
 
      var mouseX = window.innerWidth / 2 + Math.sin(angle * Math.PI / 180) * screenDistance;
      var mouseY = window.innerHeight / 2 - Math.cos(angle * Math.PI / 180) * screenDistance;
 
      $('canvas').trigger($.Event('mousemove', {clientX: mouseX, clientY: mouseY, synthetic: true}));
    },
 
    /**
     * Moves the bot directly in the direction of given game world coordinates,
     * by moving the (virtual) mouse pointer to that position on the screen.
     * Won't avoid obstacles, won't use pathfinding.
     * It does not matter of the coordinates are on the map or not.
     */
    steerToGamePos: function(gameTargetX, gameTargetY) {
      var mouseX = this.getScreenPosX(gameTargetX);
      var mouseY = this.getScreenPosY(gameTargetY);
 
      $('canvas').trigger($.Event('mousemove', {clientX: mouseX, clientY: mouseY, synthetic: true}));
    },
 
    /**
     * Tries to make the bot split by sending the splitting key.
     * Only works if the the bot is alive, has enough mass, 2+ pieces and not too many pieces.
     * ATTENTION: Split does not happen immediately but with a short delay!
     */
    split: function() {
      $('body').trigger($.Event('keydown', { keyCode: this.hotkeys.Space.c}));
      $('body').trigger($.Event('keyup', { keyCode: this.hotkeys.Space.c}));
      this.splitAt = Date.now();
    },
 
    /**
     * Tries to make the bot double split by sending the double split key.
     * Only works if the the bot is alive, has enough mass, 2+ pieces and not too many pieces.
     */
    doubleSplit: function() {
      $('body').trigger($.Event('keydown', { keyCode: this.hotkeys.D.c}));
      $('body').trigger($.Event('keyup', { keyCode: this.hotkeys.D.c}));
      this.splitAt = Date.now();
    },
 
    /**
     * Tries to make the bot triple split by sending the triple split key.
     * Only works if the the bot is alive, has enough mass, 2+ pieces and not too many pieces.
     */
    tripleSplit: function() {
      $('body').trigger($.Event('keydown', { keyCode: this.hotkeys.T.c}));
      $('body').trigger($.Event('keyup', { keyCode: this.hotkeys.T.c}));
      this.splitAt = Date.now();
    },
 
    /**
     * Tries to make the bot macro split (16 split) by sending the macro split key.
     * Only works if the the bot is alive, has enough mass, 2+ pieces and not too many pieces.
     */
    macroSplit: function() {
      $('body').trigger($.Event('keydown', { keyCode: this.hotkeys.Z.c}));
      $('body').trigger($.Event('keyup', { keyCode: this.hotkeys.Z.c}));
      this.splitAt = Date.now();
    },
 
    /**
     * Respawns the bot/player. Uses the respawn key if the bot is alive, uses the menu otherwise.
     */
    respawn: function() {
      self = this;
 
      if (self.respawning) {
        return;
      }
      self.respawning = true;
 
      if (this.spawnedAt !== null) {
        this.spawnedAt = null; // Will be set in the draw method
      }
 
      this.splitAt = null;
      this.ejectedAt = null;
 
      if (self.alive) {
        window.onkeydown({keyCode: this.hotkeys.M.c});
        window.onkeyup({keyCode: this.hotkeys.M.c});
        self.respawning = false;
      } else {
        if (self.isDeathPopupVisible()) {
          // The ad cannot be closed immediately
          setTimeout(function() {
            closeAdvert();
 
            self.spawn();
          }, 2800);
        } else {
          self.spawn();
        }
      }
    },
 
    /**
     * Spawns the bot by using the menu. This does not work if the bot is alive,
     * use respawn() in that case!
     */
    spawn: function() {
      self = this;
 
      var performSpawn = function() {
        setNick(document.getElementById('nick').value);
        self.spawnedAt = null; // Will be set in the draw method
 
        // Respawning doesn't happen immediately, so wait a little bit
        setTimeout(function() {
          self.respawning = false;
        }, 500);
      };
 
      // Spawning is not possible immediately so we check if we have to wait
      if ($('#playBtn').css('opacity') < 1) {
        setTimeout(function() {
          performSpawn();
        }, 2400);
      } else {
        performSpawn();
      }
    },
 
    /**
     * Displays a message at the top of the browser window, for a couple of seconds
     */
    message: function(message) {
      var curser = document.querySelector('#curser');
 
      curser.textContent = message;
      curser.style.display = 'block';
 
      window.setTimeout(function() {
        curser.style.display = 'none';
      }, 5000);
    },
 
    /**
     * Show a sweet alert (modal/popup) with a given title and message.
     */
    swal: function (title, message, html) {
      if (html === undefined) {
        html = true;
      }
      window.swal({
        title: '📢 <span class="miracle-primary-color-font">' + title + '</span>',
        text: message,
        html: html
      });
    },
 
    /**
     * Checks if there is a bot command in the chat bot (text input field).
     * If that is the case, tries to execute the command.
     * Note: The command won't be sent as a chat message.
     */
    checkChatBox: function() {
      var self = this;
      var text = $('#chtbox').val();
 
      if (text.substr(0, 5) == '/bot ') {
        var command = text.substr(5);
 
        // Function context = window.ventron
        var execCommand = function() {
          switch (command) {
            case 'start':
                  this.stopped = false;
                  this.startCoins = 0;
                  this.startedAt = new Date();
                  this.message('Bot started!');
              break;
            case 'stop':
                  this.stopped = true;
                  this.message('Bot stopped!');
              break;
            case 'coins':
                  let coins = (this.getCoins() - this.startCoins);
                  let avg = Math.round(coins / ((Date.now() - this.startedAt) / 1000 / 60));
                  this.swal(coins + ' coins collected! ' + avg + ' per minute, ' + (avg * 60) + ' per hour.');
                  break;
            case 'info':
                  this.stopped = false;
                  this.swal('Map width: ' + self.mapWidth + ', map height: ' + self.mapHeight);
              break;
            case 'help':
            default:
              this.swal('These commands are available: start, stop, coins, info');
          }
        }
 
        setTimeout(execCommand.bind(self), 1);
 
        return true;
      }
    },
 
    getCoins: function()
    {
       return 1 * $('#coinsTopLeft').text().replace(/\s/g, '');
    },
 
    /**
     * Calculates the (float) mass of a cell by its radius
     * ATTENTION: It's important that this function returns a float!
     * If the bot is split and small, the mass will be 0 else!
     */
    getCellMass: function(radius) {
      var area = Math.PI * radius * radius;
      var mass = area * this.MASS_AREA_FACTOR;
 
      return mass;
    },
 
    /**
     * Calculates the radius of a cell by its mass
     */
    getCellRadius: function(mass) {
      var area = mass / this.MASS_AREA_FACTOR;
      var radius = Math.sqrt(area / Math.PI);
 
      return radius;
    },
 
    /**
     * Returns the (float) distance between two points (coordinates)
     */
    getDistance: function(x1, y1, x2, y2) {
      return Math.hypot(x1 - x2, y1 - y2);
    },
 
    /**
     * Returns the 360-angle between two points 8coordinates), starting by the first point.
     * 0° means the second point is in the north of the first point.
     * The returned angle will always be >= 0 and < 360.
     */
    getAngle: function(x1, y1, x2, y2) {
      var angle = Math.atan2(y2 - y1, x2 - x1); // range (-PI, PI]
      angle *= 180 / Math.PI; // rads to degs, range (-180, 180]
      angle += 90;
 
      if (angle < 0) angle = 360 + angle; // range [0, 360)
      if (angle >= 360) angle = 360 - angle; // range [0, 360)
 
      return angle;
    },
 
    /**
     * Adds angle2 to angle1 and returns the resulting angle.
     */
    addAngle: function(angle1, angle2) {
      var angle = angle1 + angle2;
 
      angle %= 360;
      if (angle < 0) angle += 360;
 
      return angle;
    },
 
    /**
     * Returns the (absolute) difference between two angles.
     * The minimum difference will be 0, the maximum difference will be 180.
     */
    getAngleDiff: function(angle1, angle2) {
      var diff = angle1 - angle2;
 
      diff = Math.abs(diff);
 
      if (diff > 180) {
        diff = 360 - diff;
      }
 
      return diff;
    },
 
    /**
     * Transforms and returns an x coordinate on the screen to an x coordinate in the game.
     */
    getGamePosX: function(screenPosX) {
      return this.x - (window.innerWidth / 2 - screenPosX) / this.zoom;
    },
 
    /**
     * Transforms and returns an y coordinate on the screen to an y coordinate in the game.
     */
    getGamePosY: function(screenPosY) {
      return this.y - (window.innerHeight / 2 - screenPosY) / this.zoom;
    },
 
    /**
     * Transforms and returns an x coordinate in the game to an x coordinate on the screen.
     */
    getScreenPosX: function(gamePosX) {
      return - (- this.zoom * (gamePosX - this.x) - window.innerWidth / 2)
    },
 
    /**
     * Transforms and returns an y coordinate in the game to an y coordinate on the screen.
     */
    getScreenPosY: function(gamePosY) {
      return - (- this.zoom * (gamePosY - this.y) - window.innerHeight / 2)
    },
 
    /**
     * Returns a random integer between min (inclusive) and max (exclusive)
     * Source: MDN
     */
    getRandomInt: function(min, max) {
      return parseInt(Math.random() * (max - min) + min);
    },
 
    /**
     * Returns true if the popup that is displayed after we die is currently visible
     */
    isDeathPopupVisible: function() {
      var displayingAd = (document.getElementById('advert').style.display == 'block');
      return displayingAd;
    },
 
    /**
     * Returns the time since the bot was initialized in seconds
     */
    getTimeSinceStart: function() {
      var endDate = new Date();
      return (endDate.getTime() - startDate.getTime()) / 1000;
    },
 
    /**
     * Returns the URI of my skin or null if not skin has been set.
     * Use this.skinUrl() to get it.
     */
    getSkinUrl: function() {
      var skinUrlRaw = $('#skinExampleMenu').css('background-image');
 
      var parts = skinUrlRaw.split('"');
 
      if (parts.length != 3) {
        return null;
      } else {
        return parts[1];
      }
    },
}
 
 
    let start = function() {
        if (document.readyState === "complete") {
            // We need to have a delay, because the skin preview in the game menu is not loaded right away and also we have to wait for auto login
            setTimeout(function() {
                trufflePigPublic.init();
            }, 4000);
        } else {
            setTimeout(start, 1000);
        }
    };
    start();
 
})();
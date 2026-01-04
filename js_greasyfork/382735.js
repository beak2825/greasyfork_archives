// ==UserScript==
// @name         Bot na e2 test!!!
// @version      1.4
// @description  bot na e2 w trakcie rozbudowy, dziala na NI i SI
// @author       Adi Wilk
// @match        http://*.margonem.pl/
// @match        https://*.margonem.pl/
// @grant        none
// @namespace https://greasyfork.org/users/299059
// @downloadURL https://update.greasyfork.org/scripts/382735/Bot%20na%20e2%20test%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/382735/Bot%20na%20e2%20test%21%21%21.meta.js
// ==/UserScript==

function _instanceof(left, right) {
    if (
      right != null &&
      typeof Symbol !== "undefined" &&
      right[Symbol.hasInstance]
    ) {
      return right[Symbol.hasInstance](left);
    } else {
      return left instanceof right;
    }
  }

  function _slicedToArray(arr, i) {
    return (
      _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
    );
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
      for (
        var _i = arr[Symbol.iterator](), _s;
        !(_n = (_s = _i.next()).done);
        _n = true
      ) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj &&
          typeof Symbol === "function" &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? "symbol"
          : typeof obj;
      };
    }
    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!_instanceof(instance, Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  (function() {
    var AStar =
      /*#__PURE__*/
      (function() {
        "use strict";

        function AStar(
          collisionsString,
          width,
          height,
          start,
          end,
          additionalCollisions
        ) {
          _classCallCheck(this, AStar);

          this.width = width;
          this.height = height;
          this.collisions = this.parseCollisions(collisionsString, width, height);
          this.additionalCollisions = additionalCollisions || {};
          this.start = this.collisions[start.x][start.y];
          this.end = this.collisions[end.x][end.y];
          this.start.beginning = true;
          this.start.g = 0;
          this.start.f = this.heuristic(this.start, this.end);
          this.end.target = true;
          this.end.g = 0;
          this.addNeighbours();
          this.openSet = [];
          this.closedSet = [];
          this.openSet.push(this.start);
        }

        _createClass(AStar, [
          {
            key: "parseCollisions",
            value: function parseCollisions(collisionsString, width, height) {
              var collisions = new Array(width);

              for (var w = 0; w < width; w++) {
                collisions[w] = new Array(height);

                for (var h = 0; h < height; h++) {
                  collisions[w][h] = new Point(
                    w,
                    h,
                    collisionsString.charAt(w + h * width) !== "0"
                  );
                }
              }

              return collisions;
            }
          },
          {
            key: "addNeighbours",
            value: function addNeighbours() {
              for (var i = 0; i < this.width; i++) {
                for (var j = 0; j < this.height; j++) {
                  this.addPointNeighbours(this.collisions[i][j]);
                }
              }
            }
          },
          {
            key: "addPointNeighbours",
            value: function addPointNeighbours(point) {
              var _ref = [point.x, point.y],
                x = _ref[0],
                y = _ref[1];
              var neighbours = [];
              if (x > 0) neighbours.push(this.collisions[x - 1][y]);
              if (y > 0) neighbours.push(this.collisions[x][y - 1]);
              if (x < this.width - 1) neighbours.push(this.collisions[x + 1][y]);
              if (y < this.height - 1) neighbours.push(this.collisions[x][y + 1]);
              point.neighbours = neighbours;
            }
          },
          {
            key: "anotherFindPath",
            value: function anotherFindPath() {
              while (this.openSet.length > 0) {
                var currentIndex = this.getLowestF();
                var current = this.openSet[currentIndex];
                if (current === this.end) return this.reconstructPath();
                else {
                  this.openSet.splice(currentIndex, 1);
                  this.closedSet.push(current);
                  var _iteratorNormalCompletion = true;
                  var _didIteratorError = false;
                  var _iteratorError = undefined;

                  try {
                    for (
                      var _iterator = current.neighbours[Symbol.iterator](),
                        _step;
                      !(_iteratorNormalCompletion = (_step = _iterator.next())
                        .done);
                      _iteratorNormalCompletion = true
                    ) {
                      var neighbour = _step.value;
                      if (this.closedSet.includes(neighbour)) continue;
                      else {
                        var tentative_score = current.g + 1;
                        var isBetter = false;

                        if (
                          this.end == this.collisions[neighbour.x][neighbour.y] ||
                          (!this.openSet.includes(neighbour) &&
                            !neighbour.collision &&
                            !this.additionalCollisions[
                              neighbour.x + 256 * neighbour.y
                            ])
                        ) {
                          this.openSet.push(neighbour);
                          neighbour.h = this.heuristic(neighbour, this.end);
                          isBetter = true;
                        } else if (
                          tentative_score < neighbour.g &&
                          !neighbour.collision
                        ) {
                          isBetter = true;
                        }

                        if (isBetter) {
                          neighbour.previous = current;
                          neighbour.g = tentative_score;
                          neighbour.f = neighbour.g + neighbour.h;
                        }
                      }
                    }
                  } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                  } finally {
                    try {
                      if (
                        !_iteratorNormalCompletion &&
                        _iterator.return != null
                      ) {
                        _iterator.return();
                      }
                    } finally {
                      if (_didIteratorError) {
                        throw _iteratorError;
                      }
                    }
                  }
                }
              }
            }
          },
          {
            key: "getLowestF",
            value: function getLowestF() {
              var lowestFIndex = 0;

              for (var i = 0; i < this.openSet.length; i++) {
                if (this.openSet[i].f < this.openSet[lowestFIndex].f)
                  lowestFIndex = i;
              }

              return lowestFIndex;
            }
          },
          {
            key: "reconstructPath",
            value: function reconstructPath() {
              var path = [];
              var currentNode = this.end;

              while (currentNode !== this.start) {
                path.push(currentNode);
                currentNode = currentNode.previous;
              }

              return path;
            }
          },
          {
            key: "heuristic",
            value: function heuristic(p1, p2) {
              return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
            }
          }
        ]);

        return AStar;
      })();

    var Point = function Point(x, y, collision) {
      "use strict";

      _classCallCheck(this, Point);

      this.x = x;
      this.y = y;
      this.collision = collision;
      this.g = 10000000;
      this.f = 10000000;
      this.neighbours = [];
      this.beginning = false;
      this.target = false;
      this.previous = undefined;
    };

    new /*#__PURE__*/
    ((function() {
      "use strict";

      function fmdasf8321dsaJKASJ() {
        _classCallCheck(this, fmdasf8321dsaJKASJ);

        this.storage = JSON.parse(localStorage.getItem("adi-bot-storage")) || {
          x: 0,
          y: 0,
          name: "",
          minimalized: false
        };
        this.interface =
          _typeof(window.Engine) === "object"
            ? "ni"
            : _typeof(window.g) === "object"
              ? "si"
              : "none";
        this.lootfilterSettings = JSON.parse(
          localStorage.getItem("adi-bot-lootfilterSettings")
        ) || {
          stat: {
            gold: {
              translation: "ZĹoto",
              active: true
            },
            quest: {
              translation: "Questowe",
              active: true
            },
            runes: {
              translation: "Runy",
              active: true
            },
            unique: {
              translation: "Unikaty",
              active: true
            },
            heroic: {
              translation: "Heroiki",
              active: true
            },
            legendary: {
              translation: "Legendy",
              active: true
            }
          },
          names: []
        };
        this.QuickGroupSettings = JSON.parse(
          localStorage.getItem("adi-bot-QuickGroupSettings12")
        ) || {
          adding: {
            translation: "Automatycznie dodawaj do grupy znaj/klan",
            active: true
          },
          accepting: {
            translation: "Automatycznie przyjmuj zaproszenia do grupy",
            active: true
          },
          reSendingMessage: {
            translation: "Automatycznie odpisuj innym graczom",
            active: true
          }
        };
        this.npcToKillId = undefined;
        this.lastAttackTimestamp = this.timeStamp;
        this.timerData =
          JSON.parse(this.getCookie("adi-bot-timer")) || new Object();
        this.refreshTime = [3, 6];

        this.delayToRelog = 40;

        this.waitForNpcRespawn = 120;

        this.randomAnswers = [
          "nie interesuje mnie to",
          "kiedyĹ to byĹo, nie to co tera",
          "to fajnie",
          "nom",
          "super",
          "co ?",
          "interesujÄce",
          "bombowo",
          "Bardzo siÄ cieszÄ.",
          "Xd",
          "co",
          "co.?",
          "co?",
          "xD",
          "xd",
          "ehhhhhh",
          "heh",
          "fajnie fajnie :]"
        ];
        this.answersBeforeAddingToEnemies = [
          "dobra, do wrogĂłw cie daje :)",
          "papapappapapapap",
          "nara.",
          "w tyĹku cie mam gosciu, nara",
          "papapapp",
          "nara koleĹźko",
          "lecisz do wrogow :P",
          "narka ;)",
          "hehehehhe, narq",
          "ej jesteĹ?",
          "haha. ;)"
        ];
        this.messagesInc =
          JSON.parse(localStorage.getItem("adi-bot-messages")) || new Object();
        this.isHealing = false;
        this.isActuallySendingMessage = false;
        this.startInctementingLagRefresher = false;
        this.incrementValue = 0;
        this.init();
      }

      _createClass(fmdasf8321dsaJKASJ, [
        {
          key: "getNpcColsNI",
          value: function getNpcColsNI() {
            var npccol = new Object();

            var _arr = Object.values(this.npcs);

            for (var _i = 0; _i < _arr.length; _i++) {
              var _arr$_i = _arr[_i],
                x = _arr$_i.x,
                y = _arr$_i.y;
              npccol[x + 256 * y] = true;
            }

            return npccol;
          }
        },
        {
          key: "chatParser",
          value: function chatParser() {
            var _this = this;

            if (this.interface === "ni") {
              window.API.addCallbackToEvent("newMsg", function(_ref2) {
                var _ref3 = _slicedToArray(_ref2, 2),
                  element = _ref3[0],
                  ch = _ref3[1];

                _this.chatFilter(ch);
              });
            }

            if (this.interface === "si") {
              window.g.chat.parsers.push(function(ch) {
                _this.chatFilter(ch);
              });
            }
          }
        },
        {
          key: "chatFilter",
          value: function chatFilter(ch) {
            var n = ch.n,
              t = ch.t,
              ts = ch.ts,
              k = ch.k;
            if (
              n === "" ||
              n === this.hero.nick ||
              n === "System" ||
              this.QuickGroupSettings.reSendingMessage.active === false
            )
              return;

            if (window.unix_time(true) - ts <= 5) {
              if (!this.isActuallySendingMessage) {
                if (
                  this.messagesInc[n + this.world] !== undefined &&
                  this.messagesInc[n + this.world] > 3
                )
                  return;

                if (
                  t.toLowerCase().includes(this.hero.nick.toLowerCase()) &&
                  k === 0
                ) {
                  this.sendMessage(n, k);
                }

                if (k === 3) {
                  this.sendMessage(n, k);
                }
              }
            }
          }
        },
        {
          key: "sendMessage",
          value: function sendMessage(nick, chatNumber) {
            var _this2 = this;

            var addToEnemy =
              arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : false;
            var message = arguments.length > 3 ? arguments[3] : undefined;
            this.isActuallySendingMessage = true;

            if (this.messagesInc[nick + this.world] === undefined) {
              this.messagesInc[nick + this.world] = 1;
            } else {
              this.messagesInc[nick + this.world]++;
            }

            this.saveMessages();

            if (this.messagesInc[nick + this.world] > 3) {
              addToEnemy = true;
            }

            if (addToEnemy) {
              message = this.answersBeforeAddingToEnemies[
                Math.floor(
                  Math.random() * this.answersBeforeAddingToEnemies.length
                )
              ];
            } else {
              message = this.randomAnswers[
                Math.floor(Math.random() * this.randomAnswers.length)
              ];
            }

            if (chatNumber === 3) {
              message = "@"
                .concat(nick.split(" ").join("_"), " ")
                .concat(message);
            }

            this.Sleep((Math.floor(Math.random() * 11) + 5) * 1000).then(
              function() {
                window._g("chat", {
                  c: message
                });

                if (addToEnemy === true) {
                  _this2.addToEnemy(nick);
                }

                _this2.isActuallySendingMessage = false;
              }
            );
          }
        },
        {
          key: "Sleep",
          value: function Sleep(ms) {
            return new Promise(function(res) {
              setTimeout(function() {
                res(null);
              }, ms);
            });
          }
        },
        {
          key: "saveMessages",
          value: function saveMessages() {
            localStorage.setItem(
              "adi-bot-messages",
              JSON.stringify(this.messagesInc)
            );
          }
        },
        {
          key: "addToEnemy",
          value: function addToEnemy(nick) {
            window._g("friends&a=eadd&nick=".concat(nick));
          }
        },
        {
          key: "getWay",
          value: function getWay(x, y) {
            return new AStar(
              this.collisions,
              this.map.x,
              this.map.y,
              {
                x: this.hero.x,
                y: this.hero.y
              },
              {
                x: x,
                y: y
              },
              this.npccol
            ).anotherFindPath();
          }
        },
        {
          key: "goTo",
          value: function goTo(x, y) {
            var road = this.getWay(x, y);
            if (Array.isArray(road))
              this.interface === "ni"
                ? (window.Engine.hero.autoPath = road)
                : (window.road = road);
          }
        },
        {
          key: "getDistanceToNpc",
          value: function getDistanceToNpc(x, y) {
            var road = this.getWay(x, y);
            if (Array.isArray(road)) return road.length;
            return undefined;
          }
        },
        {
          key: "updateCollisions",
          value: function updateCollisions() {
            var collisions = new Array();
            var _this$map = this.map,
              x = _this$map.x,
              y = _this$map.y;

            for (var i = 0; i < y; i++) {
              for (var z = 0; z < x; z++) {
                collisions.push(window.Engine.map.col.check(z, i));
              }
            }

            return collisions.join("");
          }
        },
        {
          key: "initBox",
          value: function initBox() {
            var _this3 = this;

            var box = document.createElement("div");
            box.classList.add("adi-bot-box");

            this.appendText(box, "WprowadĹş nazwy elit II:");
            var inputName = document.createElement("input");
            inputName.type = "text";
            inputName.classList.add("adi-bot-input-text");
            inputName.value = this.storage.name;
            inputName.addEventListener("keyup", function() {
              _this3.storage.name = inputName.value;

              _this3.saveStorage();
            });
            box.appendChild(inputName);

            this.appendText(box, "Lootfilter:");

            var _arr2 = Object.entries(this.lootfilterSettings.stat);

            var _loop = function _loop() {
              var _arr2$_i = _slicedToArray(_arr2[_i2], 2),
                id = _arr2$_i[0],
                _arr2$_i$ = _arr2$_i[1],
                translation = _arr2$_i$.translation,
                active = _arr2$_i$.active;

              _this3.createCheckBox(box, translation, active, function(checked) {
                _this3.lootfilterSettings.stat[id].active = checked;
                localStorage.setItem(
                  "adi-bot-lootfilterSettings",
                  JSON.stringify(_this3.lootfilterSettings)
                );
              });
            };

            for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
              _loop();
            }

            this.appendText(box, "Ĺap itemki po nazwie:");
            var lootfilterNames = document.createElement("input");
            lootfilterNames.classList.add("adi-bot-input-text");
            lootfilterNames.tip = "Oddzielaj przecinkiem!";
            lootfilterNames.type = "text";
            lootfilterNames.value = this.lootfilterSettings.names.join(", ");
            lootfilterNames.addEventListener("keyup", function() {
              var names = lootfilterNames.value.split(",");

              for (var i = 0; i < names.length; i++) {
                names[i] = names[i].trim();
              }

              _this3.lootfilterSettings.names = names;
              localStorage.setItem(
                "adi-bot-lootfilterSettings",
                JSON.stringify(_this3.lootfilterSettings)
              );
            });
            box.appendChild(lootfilterNames);

            this.appendText(box, "Ustawienia QG:");

            var _arr3 = Object.entries(this.QuickGroupSettings);

            var _loop2 = function _loop2() {
              var _arr3$_i = _slicedToArray(_arr3[_i3], 2),
                id = _arr3$_i[0],
                _arr3$_i$ = _arr3$_i[1],
                translation = _arr3$_i$.translation,
                active = _arr3$_i$.active;

              _this3.createCheckBox(box, translation, active, function(checked) {
                _this3.QuickGroupSettings[id].active = checked;
                localStorage.setItem(
                  "adi-bot-QuickGroupSettings12",
                  JSON.stringify(_this3.QuickGroupSettings)
                );
              });
            };

            for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
              _loop2();
            }

            this.makeBoxDraggable(box, function() {
              _this3.storage.x = parseInt(box.style.left);
              _this3.storage.y = parseInt(box.style.top);

              _this3.saveStorage();

              window.message(
                '<span style="color: red">Zapisano pozycj\u0119 okienka :)</span>'
              );
            });

            if (!this.storage.hasOwnProperty("minimalized")) {
              this.storage.minimalized = false;
              this.saveStorage();
            }

            box.addEventListener("dblclick", function(_ref4) {
              var x = _ref4.x,
                y = _ref4.y;

              if (_this3.storage.minimalized === false) {
                box.style.width = "10px";
                box.style.height = "10px";
                _this3.storage.minimalized = true;

                _this3.changeVisibility(box, true);
              } else {
                box.style.width = "360px";
                box.style.height = "272px";
                _this3.storage.minimalized = false;

                _this3.changeVisibility(box, false);
              }

              box.style.left = x - parseInt(box.style.width) / 2 + "px";
              box.style.top = y - parseInt(box.style.height) / 2 + "px";
              _this3.storage.x = parseInt(box.style.left);
              _this3.storage.y = parseInt(box.style.top);

              _this3.saveStorage();
            });
            this.interface === "ni"
              ? document.querySelector(".game-window-positioner").appendChild(box)
              : document.body.appendChild(box);
            this.initStyle();

            if (this.storage.minimalized === true) {
              box.style.width = "10px";
              box.style.height = "10px";
              this.changeVisibility(box, true);
            }
          }
        },
        {
          key: "changeVisibility",
          value: function changeVisibility(element, boolean) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (
                var _iterator2 = element.childNodes[Symbol.iterator](), _step2;
                !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);
                _iteratorNormalCompletion2 = true
              ) {
                var node = _step2.value;
                node.style.display = boolean === true ? "none" : "";
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }
          }
        },
        {
          key: "appendText",
          value: function appendText(element, text) {
            var box = document.createElement("div");
            box.appendChild(document.createTextNode(text));
            element.appendChild(box);
          }
        },
        {
          key: "createCheckBox",
          value: function createCheckBox(appendedBox, name, active, fun) {
            var box = document.createElement("div");
            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = name + "adi-bot";
            checkbox.id = name + "adi-bot";
            checkbox.checked = active;
            box.appendChild(checkbox);
            var label = document.createElement("label");
            label.setAttribute("for", name + "adi-bot");
            label.innerHTML = name;
            checkbox.addEventListener("change", function() {
              fun(checkbox.checked);
            });
            box.appendChild(label);
            appendedBox.appendChild(box);
          }
        },
        {
          key: "makeBoxDraggable",
          value: function makeBoxDraggable(element, stop) {
            $(element).draggable({
              containment: "window",
              stop: stop
            });
          }
        },
        {
          key: "saveStorage",
          value: function saveStorage() {
            localStorage.setItem("adi-bot-storage", JSON.stringify(this.storage));
          }
        },
        {
          key: "initStyle",
          value: function initStyle() {
            var style = document.createElement("style");
            var css = "\n            .adi-bot-box {\n                position: absolute;\n                text-align: center;\n                padding: 10px;\n                height: 272px;\n                width: 360px;\n                left: "
              .concat(this.storage.x, "px;\n                top: ")
              .concat(
                this.storage.y,
                "px;\n                background: #975b83;\n                border: 2px solid white;\n                border-radius: 8px;\n                color: black;\n                z-index: 999;\n            }\n            .adi-bot-input-text {\n                text-align: center;\n                border: 2px solid lightblue;\n                border-radius: 3px;\n                color: black;\n                cursor: text;\n            }\n            "
              );
            style.type = "text/css";
            style.appendChild(document.createTextNode(css));
            document.head.appendChild(style);
          }
        },
        {
          key: "initNewNpc",
          value: function initNewNpc() {
            var _this4 = this;

            if (this.interface === "ni") {
              window.API.addCallbackToEvent("newNpc", function(npc) {
                if (npc !== undefined) _this4.addNpcs(npc.d);
              });
              window.API.addCallbackToEvent("removeNpc", function(npc) {
                if (npc !== undefined) _this4.removeNpcs(npc.d);
              });
            }

            if (this.interface === "si") {
              var _newNpc = window.newNpc;

              window.newNpc = function(npcs) {
                if (npcs !== undefined) {
                  var _arr4 = Object.entries(npcs);

                  for (var _i4 = 0; _i4 < _arr4.length; _i4++) {
                    var _arr4$_i = _slicedToArray(_arr4[_i4], 2),
                      id = _arr4$_i[0],
                      npc = _arr4$_i[1];

                    if (npc.del !== undefined && window.g.npc[id] !== undefined) {
                      _this4.removeNpcs(window.g.npc[id], id);
                    } else if (npc !== undefined) _this4.addNpcs(npc, id);
                  }
                }

                _newNpc(npcs);
              };
            }
          }
        },
        {
          key: "initNewOther",
          value: function initNewOther() {
            var _this5 = this;

            if (this.interface === "ni") {
              this.makeParty();
              window.API.addCallbackToEvent("newOther", function(other) {
                _this5.filterOther(other.d);
              });
            }

            if (this.interface === "si") {
              this.makeParty();
              var _newOther = window.newOther;

              window.newOther = function(others) {
                _newOther(others);

                if (others !== undefined) {
                  var _arr5 = Object.values(others);

                  for (var _i5 = 0; _i5 < _arr5.length; _i5++) {
                    var other = _arr5[_i5];

                    _this5.filterOther(other);
                  }
                }
              };
            }
          }
        },
        {
          key: "filterOther",
          value: function filterOther(other) {
            if (other !== undefined) {
              var relation = other.relation,
                id = other.id;

              if (
                this.canHeroTryToAttack() === true &&
                ["cl", "fr"].includes(relation) &&
                this.QuickGroupSettings.adding.active === true
              ) {
                this.sendInviteToParty(id);
              }
            }
          }
        },
        {
          key: "makeParty",
          value: function makeParty() {
            if (_typeof(this.party) !== "object") return this.sendInvites();
            var isHeroLeader =
              this.interface === "ni"
                ? this.party.getLeaderId() === this.hero.id
                : this.party[this.hero.id].r === 1;
            if (isHeroLeader === true) this.sendInvites();
          }
        },
        {
          key: "sendInvites",
          value: function sendInvites() {
            if (this.others !== undefined) {
              var _arr6 = Object.values(this.others);

              for (var _i6 = 0; _i6 < _arr6.length; _i6++) {
                var other = _arr6[_i6];
                this.filterOther(other);
              }
            }
          }
        },
        {
          key: "sendInviteToParty",
          value: function sendInviteToParty(id) {
            window._g("party&a=inv&id=".concat(id));
          }
        },
        {
          key: "initChecker",
          value: function initChecker() {
            var _this6 = this;

            setTimeout(function() {
              _this6.initChecker();
            }, 500);

            if (this.dead === true) {
              this.removeNpcsFromThisCharId(this.hero.id);
              this.logout();
            }

            if (this.canHeroTryToAttack() === true) {
              try {
                if (this.npcToKillId !== undefined) {
                  var _this$npcs$this$npcTo = this.npcs[this.npcToKillId],
                    x = _this$npcs$this$npcTo.x,
                    y = _this$npcs$this$npcTo.y;

                  if (
                    Math.abs(this.hero.x - x) <= 1 &&
                    Math.abs(this.hero.y - y) <= 1
                  ) {
                    if (this.timeStamp - this.lastAttackTimestamp > 0) {
                      window._g(
                        "fight&a=attack&ff=1&id=-".concat(this.npcToKillId),
                        function(data) {
                          if (
                            data.hasOwnProperty("alert") &&
                            data.alert.includes(
                              "Przeciwnik walczy juĹź z kimĹ innym"
                            )
                          ) {
                            _this6.lastAttackTimestamp = _this6.timeStamp + 2;
                            return;
                          }

                          _this6.lastAttackTimestamp = _this6.timeStamp + 1;
                        }
                      );
                    }
                  } else {
                    this.goTo(x, y);
                  }
                } else {
                  this.reFindNpcs();
                }
              } catch (er) {
                this.npcToKillId = undefined;
              }
            }
          }
        },
        {
          key: "canHeroTryToAttack",
          value: function canHeroTryToAttack() {
            if (!this.battle && !this.dead) return true;
            return false;
          }
        },
        {
          key: "removeNpcs",
          value: function removeNpcs(npc) {
            var x = npc.x,
              y = npc.y,
              nick = npc.nick,
              lvl = npc.lvl;

            this.interface === "ni"
              ? window.Engine.map.col.unset(
                  x,
                  y,
                  window.Engine.map.col.check(x, y)
                )
              : window.map.nodes.changeCollision(x, y, 0);

            if (this.storage.name.toLowerCase().includes(nick.toLowerCase())) {
              this.addNpcToTimer(nick, lvl);
              this.npcToKillId = undefined;
              this.reFindNpcs();
            }
          }
        },
        {
          key: "findEilteIIName",
          value: function findEilteIIName(grpId) {
            var _arr7 = Object.values(this.npcs);

            for (var _i7 = 0; _i7 < _arr7.length; _i7++) {
              var npc = _arr7[_i7];
              var nick = npc.nick,
                lvl = npc.lvl,
                grp = npc.grp,
                wt = npc.wt;

              if (grp === grpId && wt > 19) {
                return [nick, lvl];
              }
            }
          }
        },
        {
          key: "addNpcs",
          value: function addNpcs(npc, id) {
            if (this.interface === "ni") id = npc.id;

            this.filterNpc(npc, id);
          }
        },
        {
          key: "isNpcFake",
          value: function isNpcFake(icon, callback) {
            var img = new Image();
            var canvas = document.createElement("canvas").getContext("2d");

            var checkData = function checkData() {
              var canvasData = canvas.getImageData(
                Math.floor(canvas.width / 2),
                0,
                1,
                canvas.height
              ).data;

              for (var i = 3; i < canvasData.length; i += 4) {
                if (canvasData[i] > 0) return callback(false);
              }

              return callback(true);
            };

            img.onload = function() {
              canvas.width = this.width;
              canvas.height = this.height;
              canvas.drawImage(img, 0, 0);
              checkData();
            };

            img.src = icon;
          }
        },
        {
          key: "filterNpc",
          value: function filterNpc(npc, id) {
            var _this7 = this;

            var nick = npc.nick,
              icon = npc.icon,
              type = npc.type,
              wt = npc.wt,
              grp = npc.grp;
            if (!(type === 2 || type === 3) || wt < 10 || nick === undefined)
              return;
            if (this.npcToKillId !== undefined) return;

            if (
              this.storage.name.toLowerCase().includes(nick.toLowerCase()) &&
              this.storage.name !== ""
            ) {
              var url = icon.includes("/obrazki/npc/")
                ? icon
                : "/obrazki/npc/".concat(icon);
              this.isNpcFake(url, function(isFake) {
                if (isFake === false) {
                  if (grp === 0) {
                    _this7.npcToKillId = parseInt(id);
                  } else {
                    _this7.npcToKillId = parseInt(_this7.findBestNpcFromGrp(grp));
                  }

                  _this7.makeParty();
                }
              });
            }
          }
        },
        {
          key: "findBestNpcFromGrp",
          value: function findBestNpcFromGrp(grpId) {
            var bestID = undefined;
            var bestRoad = 999999;

            var _arr8 = Object.entries(this.npcs);

            for (var _i8 = 0; _i8 < _arr8.length; _i8++) {
              var _arr8$_i = _slicedToArray(_arr8[_i8], 2),
                id = _arr8$_i[0],
                npc = _arr8$_i[1];

              var x = npc.x,
                y = npc.y,
                grp = npc.grp;

              if (grpId === grp) {
                var roadLength = this.getDistanceToNpc(x, y);

                if (roadLength < bestRoad) {
                  bestID = id;
                  bestRoad = roadLength;
                }
              }
            }

            return bestID;
          }
        },
        {
          key: "reFindNpcs",
          value: function reFindNpcs() {
            var _arr9 = Object.entries(this.npcs);

            for (var _i9 = 0; _i9 < _arr9.length; _i9++) {
              var _arr9$_i = _slicedToArray(_arr9[_i9], 2),
                id = _arr9$_i[0],
                npc = _arr9$_i[1];

              this.filterNpc(npc, id);
            }
          }
        },
        {
          key: "logout",
          value: function logout() {
            if (
              this.battle ||
              this.loots ||
              this.issetMyNpcOnMap ||
              this.isHealing
            )
              return;
            window.location.href = "http://margonem.pl";
          }
        },
        {
          key: "logIn",
          value: function logIn(char_id, world) {
            if (
              this.interface !== "none" &&
              this.hero.id !== undefined &&
              this.hero.id == char_id
            )
              return;
            if (
              this.interface !== "none" &&
              (this.battle ||
                this.loots ||
                this.issetMyNpcOnMap ||
                this.isHealing)
            )
              return;

            try {
              var d = new Date();
              d.setTime(d.getTime() + 360000 * 24 * 30);
              document.cookie = "mchar_id="
                .concat(char_id, "; path=/; expires=")
                .concat(d.toGMTString(), "; domain=.margonem.pl");
              window.location.href = "http://".concat(
                world.toLowerCase(),
                ".margonem.pl"
              );
            } catch (er) {}
          }
        },
        {
          key: "getNewRespawnTime",
          value: function getNewRespawnTime(lvl) {
            return Math.round(
              (60 *
                (lvl > 200
                  ? 18
                  : Math.min(18, 0.7 + 0.18 * lvl - 45e-5 * lvl * lvl)) *
                1) /
                parseInt(this.serverTimerSpeed)
            );
          }
        },
        {
          key: "addNpcToTimer",
          value: function addNpcToTimer(nick, lvl) {
            var mapName = this.mapName;
            this.timerData[nick + this.world] = {
              name: nick,
              lvl: lvl,
              mapName: mapName,
              nextRespawn: this.timeStamp + this.getNewRespawnTime(lvl),
              charId: this.hero.id,
              world: this.world
            };
            this.saveTimersCookies();
          }
        },
        {
          key: "deleteNpcFromTimer",
          value: function deleteNpcFromTimer(name) {
            if (this.timerData[name] !== undefined) {
              delete this.timerData[name];
              this.saveTimersCookies();
            }
          }
        },
        {
          key: "removeNpcsFromThisCharId",
          value: function removeNpcsFromThisCharId(charId) {
            if (charId === undefined) return;

            var _arr10 = Object.entries(this.timerData);

            for (var _i10 = 0; _i10 < _arr10.length; _i10++) {
              var _arr10$_i = _slicedToArray(_arr10[_i10], 2),
                name = _arr10$_i[0],
                data = _arr10$_i[1];

              if (data.charId == charId) this.deleteNpcFromTimer(name);
            }
          }
        },
        {
          key: "checkTimers",
          value: function checkTimers() {
            var _arr11 = Object.entries(this.timerData);

            for (var _i11 = 0; _i11 < _arr11.length; _i11++) {
              var _arr11$_i = _slicedToArray(_arr11[_i11], 2),
                name = _arr11$_i[0],
                data = _arr11$_i[1];

              if (data.nextRespawn + this.waitForNpcRespawn < this.timeStamp) {
                this.createNewRespawnTime(name);
              }
            }
          }
        },
        {
          key: "createNewRespawnTime",
          value: function createNewRespawnTime(name) {
            var _this8 = this;

            if (
              Object.values(this.npcs).some(function(npc) {
                return npc.nick == _this8.timerData[name].name;
              }) ||
              this.timerData[name].charId !== this.hero.id
            )
              return;

            while (this.timeStamp > this.timerData[name].nextRespawn) {
              this.timerData[name].nextRespawn =
                this.timerData[name].nextRespawn +
                this.getNewRespawnTime(this.timerData[name].lvl);
            }

            this.saveTimersCookies();
          }
        },
        {
          key: "isThisHeroIssetInTimer",
          value: function isThisHeroIssetInTimer(id) {
            if (id === undefined) return false;
            return Object.values(this.timerData).some(function(a) {
              return a.charId == id;
            });
          }
        },
        {
          key: "isntTimersInRange",
          value: function isntTimersInRange() {
            var _this9 = this;

            return Object.values(this.timerData).every(function(a) {
              return a.nextRespawn - _this9.timeStamp > _this9.delayToRelog;
            });
          }
        },
        {
          key: "checkHeroOnGoodMap",
          value: function checkHeroOnGoodMap(heroId) {
            var _arr12 = Object.entries(this.timerData);

            for (var _i12 = 0; _i12 < _arr12.length; _i12++) {
              var _arr12$_i = _slicedToArray(_arr12[_i12], 2),
                name = _arr12$_i[0],
                data = _arr12$_i[1];

              var mapName = data.mapName,
                charId = data.charId;

              if (
                charId == heroId &&
                this.mapName !== undefined &&
                mapName !== undefined &&
                mapName !== this.mapName
              ) {
                this.deleteNpcFromTimer(name);
              }
            }
          }
        },
        {
          key: "initTimer",
          value: function initTimer() {
            var _this10 = this;

            if (Object.keys(this.timerData).length > 0) {
              if (this.interface === "none") {
                if (
                  Object.values(this.timerData).some(function(a) {
                    return (
                      a.nextRespawn - _this10.timeStamp <= _this10.delayToRelog
                    );
                  })
                ) {
                  var _Object$values$reduce = Object.values(
                      this.timerData
                    ).reduce(function(a, b) {
                      return a.nextRespawn <= b.nextRespawn ? a : b;
                    }),
                    world = _Object$values$reduce.world,
                    charId = _Object$values$reduce.charId;

                  if (charId !== undefined) this.logIn(charId, world);
                }
              } else {
                if (
                  this.isntTimersInRange() &&
                  this.isThisHeroIssetInTimer(this.hero.id)
                ) {
                  this.logout();
                } else {
                  this.checkHeroOnGoodMap(this.hero.id);
                  var charsInTimeRange = Object.values(this.timerData).filter(
                    function(a) {
                      return (
                        a.nextRespawn - _this10.timeStamp <= _this10.delayToRelog
                      );
                    }
                  );

                  if (charsInTimeRange.length > 0) {
                    var _charsInTimeRange$red = charsInTimeRange.reduce(function(
                        a,
                        b
                      ) {
                        return a.nextRespawn <= b.nextRespawn ? a : b;
                      }),
                      _charId = _charsInTimeRange$red.charId,
                      _world = _charsInTimeRange$red.world;

                    if (
                      this.hero.id !== undefined &&
                      parseInt(_charId) !== this.hero.id
                    )
                      this.logIn(_charId, _world);
                  }
                }
              }
            }

            this.checkTimers();
            setTimeout(function() {
              _this10.initTimer();
            }, 500);
          }
        },
        {
          key: "saveTimersCookies",
          value: function saveTimersCookies() {
            var j = new Date();
            j.setMonth(j.getMonth() + 1);
            this.setCookie(
              "adi-bot-timer",
              JSON.stringify(this.timerData),
              j,
              "/",
              "margonem.pl"
            );
          }
        },
        {
          key: "randomSeconds",
          value: function randomSeconds(min, max) {
            min *= 60;
            max *= 60;
            return Math.floor(Math.random() * (max - min + 1)) + min;
          }
        },
        {
          key: "randomRefresh",
          value: function randomRefresh() {
            var _this$refreshTime = _slicedToArray(this.refreshTime, 2),
              min = _this$refreshTime[0],
              max = _this$refreshTime[1];

            setTimeout(function() {
              window.location.reload();
            }, this.randomSeconds(min, max) * 1000);
          }
        },
        {
          key: "getCookie",
          value: function getCookie(name) {
            var dc = document.cookie;
            var prefix = name + "=";
            var begin = dc.indexOf("; " + prefix);

            if (begin == -1) {
              begin = dc.indexOf(prefix);
              if (begin != 0) return null;
            } else begin += 2;

            var end = document.cookie.indexOf(";", begin);
            if (end == -1) end = dc.length;
            return unescape(dc.substring(begin + prefix.length, end));
          }
        },
        {
          key: "setCookie",
          value: function setCookie(name, value, expires, path, domain, secure) {
            var curCookie =
              name +
              "=" +
              escape(value) +
              (expires ? "; expires=" + expires.toGMTString() : "") +
              (path ? "; path=" + path : "") +
              (domain ? "; domain=" + domain : "") +
              (secure ? "; secure" : "");
            document.cookie = curCookie;
          }
        },
        {
          key: "createTimerOnMainPage",
          value: function createTimerOnMainPage() {
            var _this11 = this;

            if (Object.keys(this.timerData).length === 0) return;
            var box = document.createElement("div");
            box.classList.add("adi-bot-minutnik-strona-glowna");
            document.querySelector(".rmenu").appendChild(box);
            var style = document.createElement("style");
            var css =
              "\n            .adi-bot-minutnik-strona-glowna {\n                color: white;\n                font-size: 14px;\n                text-align: left;\n            }\n\n            .timer_data {\n                font-weight: bold;\n                float: right;\n                cursor: pointer;\n            }\n\n            .timer_data:hover {\n                color: gray;\n            }\n\n            .adi-bot-konfiguracja {\n\n            }\n        ";
            style.type = "text/css";
            style.appendChild(document.createTextNode(css));
            document.head.appendChild(style);
            this.addNpcsToTimerBox(box);
            document.addEventListener("click", function(event) {
              try {
                if (event.target.className === "timer_data") {
                  var _event$target$getAttr = event.target
                      .getAttribute("timer-data")
                      .split("|"),
                    _event$target$getAttr2 = _slicedToArray(
                      _event$target$getAttr,
                      2
                    ),
                    name = _event$target$getAttr2[0],
                    world = _event$target$getAttr2[1];

                  if (world !== undefined && name !== undefined) {
                    _this11.deleteNpcFromTimer(name + world);

                    window.showMsg(
                      "Usuni\u0119to "
                        .concat(name, " ze \u015Bwiata ")
                        .concat(
                          world.charAt(0).toUpperCase() + world.slice(1),
                          "."
                        )
                    );
                  }
                }
              } catch (er) {}
            });
          }
        },
        {
          key: "addNpcsToTimerBox",
          value: function addNpcsToTimerBox(box) {
            var _this12 = this;

            var worlds = new Object();

            var _arr13 = Object.values(this.timerData);

            for (var _i13 = 0; _i13 < _arr13.length; _i13++) {
              var data = _arr13[_i13];
              var name = data.name,
                nextRespawn = data.nextRespawn,
                world = data.world;

              if (worlds[world] === undefined) {
                worlds[world] = [
                  {
                    name: name,
                    nextRespawn: nextRespawn
                  }
                ];
              } else
                worlds[world].push({
                  name: name,
                  nextRespawn: nextRespawn
                });
            }

            var txt = "";

            var _arr14 = Object.entries(worlds);

            for (var _i14 = 0; _i14 < _arr14.length; _i14++) {
              var _arr14$_i = _slicedToArray(_arr14[_i14], 2),
                world = _arr14$_i[0],
                information = _arr14$_i[1];

              txt += '<br><div style="text-align: center; font-weight: bold; text-decoration: underline">'.concat(
                this.capitalizeWorld(world),
                "</div>"
              );
              information.sort(function(el1, el2) {
                return el1.nextRespawn - el2.nextRespawn;
              });
              var innerHTML = new Array();
              innerHTML.push("");
              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;

              try {
                for (
                  var _iterator3 = information[Symbol.iterator](), _step3;
                  !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next())
                    .done);
                  _iteratorNormalCompletion3 = true
                ) {
                  var _data = _step3.value;
                  var name = _data.name,
                    nextRespawn = _data.nextRespawn;
                  innerHTML.push(
                    "<span>"
                      .concat(
                        this.getTimeToRespawn(name, nextRespawn),
                        '</span><span class="timer_data" tip="Kliknij, aby usun\u0105\u0107 z timera." timer-data="'
                      )
                      .concat(name, "|")
                      .concat(world, '">---</span>')
                  );
                }
              } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                    _iterator3.return();
                  }
                } finally {
                  if (_didIteratorError3) {
                    throw _iteratorError3;
                  }
                }
              }

              innerHTML.push("");
              txt += innerHTML.join("<hr>");
            }

            box.innerHTML = txt;

            setTimeout(function() {
              _this12.addNpcsToTimerBox(box);
            }, 1000);
          }
        },
        {
          key: "capitalizeWorld",
          value: function capitalizeWorld(name) {
            return name.charAt(0).toUpperCase() + name.slice(1) + ":";
          }
        },
        {
          key: "getTimeToRespawn",
          value: function getTimeToRespawn(name, nextRespawn) {
            var secondsToResp = nextRespawn - this.timeStamp;
            var minutes =
              parseInt(secondsToResp / 60) < 10
                ? "0".concat(parseInt(secondsToResp / 60))
                : parseInt(secondsToResp / 60);
            var seconds =
              secondsToResp % 60 < 10
                ? "0".concat(secondsToResp % 60)
                : secondsToResp % 60;
            return ""
              .concat(name, ": ")
              .concat(minutes, ":")
              .concat(seconds);
          }
        },
        {
          key: "removeLockAdding",
          value: function removeLockAdding() {
            if (this.interface === "ni") {
              window.Engine.lock.add = Function.prototype;
            }

            if (this.interface === "si") {
              window.g.lock.add = Function.prototype;
            }

            window.mAlert = Function.prototype;
          }
        },
        {
          key: "initLagRefresher",
          value: function initLagRefresher() {
            var _this13 = this;

            if (this.startInctementingLagRefresher === false) {
              this.startInctementingLagRefresher = true;
              setInterval(function() {
                _this13.incrementValue++;

                if (_this13.incrementValue > 8) {
                  window.location.reload();
                }
              }, 500);
            }

            var self = this;
            var _ajax = window.$.ajax;

            window.$.ajax = function() {
              for (
                var _len = arguments.length, args = new Array(_len), _key = 0;
                _key < _len;
                _key++
              ) {
                args[_key] = arguments[_key];
              }

              if (args[0].url.includes("engine?t=")) {
                var oldsucc = args[0].success;

                args[0].success = function() {
                  for (
                    var _len2 = arguments.length,
                      arg = new Array(_len2),
                      _key2 = 0;
                    _key2 < _len2;
                    _key2++
                  ) {
                    arg[_key2] = arguments[_key2];
                  }

                  var canEmit =
                    _typeof(arg[0]) === "object" &&
                    arg[0] !== null &&
                    arg[0].e === "ok";
                  var ret = oldsucc.apply(_this13, arg);
                  if (canEmit) self.parseAjaxData(arg[0]);
                  return ret;
                };
              }

              return _ajax.apply(_this13, args);
            };
          }
        },
        {
          key: "parseAjaxData",
          value: function parseAjaxData(data) {
            //odĹwieĹźenie podczas zatrzymania silnika
            if (
              (data.hasOwnProperty("d") && data.d === "stop") ||
              (data.hasOwnProperty("t") && data.t === "stop")
            )
              this.Sleep(2500).then(function() {
                window.location.reload();
              });

            this.incrementValue = 0;

            if (
              data.hasOwnProperty("loot") &&
              data.hasOwnProperty("item") &&
              data.loot.hasOwnProperty("init") &&
              data.loot.hasOwnProperty("source") &&
              data.loot.init === 1 &&
              data.loot.source === "fight"
            ) {
              var goodItems = new Array();
              var rejectedItems = new Array();

              var _arr15 = Object.entries(data.item);

              for (var _i15 = 0; _i15 < _arr15.length; _i15++) {
                var _arr15$_i = _slicedToArray(_arr15[_i15], 2),
                  id = _arr15$_i[0],
                  item = _arr15$_i[1];

                var stat = item.stat,
                  name = item.name;

                if (this.isGoodItem(stat, name) == true) {
                  goodItems.push(id);
                } else {
                  rejectedItems.push(id);
                }
              }

              this.sendLoots(goodItems, rejectedItems);
            }

            if (
              data.hasOwnProperty("f") &&
              data.f.hasOwnProperty("move") &&
              data.f.hasOwnProperty("current") &&
              data.f.current === 0 &&
              data.f.move === -1
            ) {
              this.closeBattle();

              if (data.f.hasOwnProperty("w")) {
                this.autoHeal();
              }
            }

            if (data.hasOwnProperty("event_done")) this.autoHeal();

            if (
              data.hasOwnProperty("ask") &&
              data.ask.hasOwnProperty("re") &&
              data.ask.re === "party&a=accept&answer=" &&
              this.QuickGroupSettings.accepting.active === true
            ) {
              window._g("party&a=accept&answer=1");
            }
          }
        },
        {
          key: "isGoodItem",
          value: function isGoodItem(itemStat, itemName) {
            var accept = new Array();

            var _arr16 = Object.entries(this.lootfilterSettings.stat);

            for (var _i16 = 0; _i16 < _arr16.length; _i16++) {
              var _arr16$_i = _slicedToArray(_arr16[_i16], 2),
                id = _arr16$_i[0],
                active = _arr16$_i[1].active;

              if (active === true) {
                accept.push(id);
              }
            }

            var names = this.lootfilterSettings.names;

            for (var _i17 = 0; _i17 < accept.length; _i17++) {
              var acc = accept[_i17];
              if (itemStat.includes(acc)) return true;
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (
                var _iterator4 = names[Symbol.iterator](), _step4;
                !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done);
                _iteratorNormalCompletion4 = true
              ) {
                var name = _step4.value;
                if (itemName.toLowerCase() === name.toLowerCase()) return true;
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                  _iterator4.return();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }

            return false;
          }
        },
        {
          key: "sendLoots",
          value: function sendLoots(good, rejected) {
            window._g(
              "loot&not="
                .concat(rejected.join(","), "&want=&must=")
                .concat(good.join(","), "&final=1")
            );

            if (this.interface === "si")
              document.querySelector("#loots").style.display = "none";
          }
        },
        {
          key: "closeBattle",
          value: function closeBattle() {
            window._g("fight&a=quit");

            if (this.interface === "si")
              document.querySelector("#battle").style.display = "none";
          }
        },
        {
          key: "autoHeal",
          value: function autoHeal() {
            var _this14 = this;

            if (this.dead) return;
            var hero =
              this.interface === "ni"
                ? window.Engine.hero.d.warrior_stats
                : window.hero;
            if (hero.hp === hero.maxhp) return (this.isHealing = false);
            this.isHealing = true;
            var fullHeal = new Array();
            var normalPotions = new Array();
            var haveNormalPotions = false;
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
              for (
                var _iterator5 = this.items[Symbol.iterator](), _step5;
                !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done);
                _iteratorNormalCompletion5 = true
              ) {
                var item = _step5.value;
                var stat = item.stat,
                  loc = item.loc,
                  name = item.name;

                if (loc === "g") {
                  var _this$parseItemStat = this.parseItemStat(stat),
                    timelimit = _this$parseItemStat.timelimit,
                    lvl = _this$parseItemStat.lvl,
                    leczy = _this$parseItemStat.leczy,
                    fullheal = _this$parseItemStat.fullheal;

                  if (timelimit !== undefined && timelimit.includes(","))
                    continue;
                  if (lvl !== undefined && lvl > hero.lvl) continue;

                  if (leczy !== undefined) {
                    if (leczy <= hero.maxhp - hero.hp) {
                      normalPotions.push(item);
                    } else haveNormalPotions = true;
                  }

                  if (name === "Czarna perĹa Ĺźycia") {
                    if (16000 <= hero.maxhp - hero.hp) normalPotions.push(item);
                    else haveNormalPotions = true;
                  }

                  if (fullheal !== undefined) fullHeal.push(item);
                }
              }
            } catch (err) {
              _didIteratorError5 = true;
              _iteratorError5 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                  _iterator5.return();
                }
              } finally {
                if (_didIteratorError5) {
                  throw _iteratorError5;
                }
              }
            }

            if (normalPotions.length > 0) {
              var sorted = normalPotions.sort(function(item1, item2) {
                return (
                  _this14.parseItemStat(item2.stat).leczy -
                  _this14.parseItemStat(item1.stat).leczy
                );
              });
              this.useItem(sorted[0].id, function() {
                _this14.Sleep(100).then(function() {
                  _this14.autoHeal();
                });
              });
            } else if (fullHeal.length > 0) {
              this.useItem(fullHeal[0].id, function() {
                _this14.Sleep(100).then(function() {
                  _this14.autoHeal();
                });
              });
            } else if (haveNormalPotions === false) {
              window.message('<span style="color: red">Brakuje Ci potek!</span>');
            }

            this.isHealing = false;
          }
        },
        {
          key: "parseItemStat",
          value: function parseItemStat(stat) {
            var parsedStats = new Object();
            var splitedStat = stat.split(";");
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
              for (
                var _iterator6 = splitedStat[Symbol.iterator](), _step6;
                !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done);
                _iteratorNormalCompletion6 = true
              ) {
                var s = _step6.value;

                var _s$split = s.split("="),
                  _s$split2 = _slicedToArray(_s$split, 2),
                  name = _s$split2[0],
                  value = _s$split2[1];

                parsedStats[name] = value;
              }
            } catch (err) {
              _didIteratorError6 = true;
              _iteratorError6 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
                  _iterator6.return();
                }
              } finally {
                if (_didIteratorError6) {
                  throw _iteratorError6;
                }
              }
            }

            return parsedStats;
          }
        },
        {
          key: "useItem",
          value: function useItem(id, callback) {
            window._g("moveitem&id=".concat(id, "&st=1"), callback);
          }
        },
        {
          key: "init",
          value: function init() {
            console.log("PomyĹlnie zaĹadowano skrypt.");
            this.initTimer();
            if (this.interface === "none") return this.createTimerOnMainPage(); //chwilowy fix, pĂłki nei wymysle lepszego rozwiazania

            if (this.interface === "ni") {
              var old = window.Storage.prototype.setItem;

              window.Storage.prototype.setItem = function(name, value) {
                if (name === "Margonem") {
                  var obj = JSON.parse(value);
                  obj.f = 0;
                  value = JSON.stringify(obj);
                }

                old.apply(this, [name, value]);
              };
            }

            if (this.interface === "si") {
              window.bB = Function.prototype;
            }

            this.initBox();
            this.initNewNpc();
            this.initNewOther();
            this.removeLockAdding();
            this.initChecker();
            this.randomRefresh();
            this.initLagRefresher();
            this.chatParser();
          }
        },
        {
          key: "collisions",
          get: function get() {
            return this.interface === "ni"
              ? this.updateCollisions()
              : window.map.col;
          }
        },
        {
          key: "npccol",
          get: function get() {
            return this.interface === "ni"
              ? this.getNpcColsNI()
              : window.g.npccol;
          }
        },
        {
          key: "timeStamp",
          get: function get() {
            return Math.floor(new Date().getTime() / 1000);
          }
        },
        {
          key: "hero",
          get: function get() {
            return this.interface === "ni" ? window.Engine.hero.d : window.hero;
          }
        },
        {
          key: "map",
          get: function get() {
            return this.interface === "ni" ? window.Engine.map.size : window.map;
          }
        },
        {
          key: "mapName",
          get: function get() {
            return this.interface === "ni"
              ? window.Engine.map.d.name
              : window.map.name;
          }
        },
        {
          key: "npcs",
          get: function get() {
            return this.interface === "ni"
              ? this.npcsOnNewInterface
              : window.g.npc;
          }
        },
        {
          key: "others",
          get: function get() {
            return this.interface === "ni"
              ? this.othersOnNewInterface
              : window.g.other;
          }
        },
        {
          key: "world",
          get: function get() {
            return this.interface === "ni"
              ? window.Engine.worldName
              : window.g.worldname;
          }
        },
        {
          key: "serverTimerSpeed",
          get: function get() {
            return this.interface !== "none" &&
              [
                "aldous",
                "berufs",
                "brutal",
                "classic",
                "gefion",
                "hutena",
                "jaruna",
                "katahha",
                "lelwani",
                "majuna",
                "nomada",
                "perkun",
                "tarhuna",
                "telawel",
                "tempest",
                "zemyna",
                "zorza" ,
                "nerthus"
              ].includes(this.world.toLowerCase())
              ? 1
              : this.interface !== "none" &&
                this.world.toLowerCase() === "syberia"
                ? 2
                : 3;
          }
        },
        {
          key: "battle",
          get: function get() {
            return this.interface === "ni"
              ? window.Engine.battle
                ? !window.Engine.battle.endBattle
                : false
              : window.g.battle;
          }
        },
        {
          key: "dead",
          get: function get() {
            return this.interface === "ni" ? window.Engine.dead : window.g.dead;
          }
        },
        {
          key: "party",
          get: function get() {
            return this.interface === "ni" ? Engine.party : window.g.party;
          }
        },
        {
          key: "loots",
          get: function get() {
            return this.interface === "ni"
              ? window.Engine.loots !== undefined
                ? Object.keys(window.Engine.loots.items).length > 0
                  ? true
                  : false
                : false
              : window.g.loots !== false
                ? true
                : false;
          }
        },
        {
          key: "issetMyNpcOnMap",
          get: function get() {
            var _this15 = this;

            return Object.values(this.npcs).some(function(npc) {
              return _this15.storage.name
                .toLowerCase()
                .includes(npc.nick.toLowerCase());
            });
          }
        },
        {
          key: "items",
          get: function get() {
            return this.interface === "ni"
              ? window.Engine.items.fetchLocationItems("g")
              : Object.values(window.g.item);
          }
        },
        {
          key: "npcsOnNewInterface",
          get: function get() {
            var npcs = window.Engine.npcs.check();
            var newNpcs = new Object();

            var _arr17 = Object.entries(npcs);

            for (var _i18 = 0; _i18 < _arr17.length; _i18++) {
              var _arr17$_i = _slicedToArray(_arr17[_i18], 2),
                id = _arr17$_i[0],
                npc = _arr17$_i[1];

              newNpcs[id] = npc.d;
            }

            return newNpcs;
          }
        },
        {
          key: "othersOnNewInterface",
          get: function get() {
            var others = window.Engine.others.check();
            var newOthers = new Object();

            var _arr18 = Object.entries(others);

            for (var _i19 = 0; _i19 < _arr18.length; _i19++) {
              var _arr18$_i = _slicedToArray(_arr18[_i19], 2),
                id = _arr18$_i[0],
                other = _arr18$_i[1];

              newOthers[id] = other.d;
            }

            return newOthers;
          }
        }
      ]);

      return fmdasf8321dsaJKASJ;
    })())();
  })();

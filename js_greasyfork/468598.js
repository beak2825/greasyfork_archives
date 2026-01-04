// ==UserScript==
// @name         Moo.js
// @version      0.1
// @description  MooMoo packet
// @author       _VcrazY_
// @license MIT
// ==/UserScript==
(() => {
  var e = {
      5613(e) {
        var t;
        (t = function (e) {
          var t, o, a, r, i;
          for (i = [], r = 0, a = 0; a < e.length; )
            "\n" === (o = e[a]) &&
              ((t = e.substring(r, a)), i.push(t), (r = a + 1)),
              a++;
          return r < e.length && ((t = e.substring(r)), i.push(t)), i;
        }),
          (e.exports = t);
      },
      366(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.MooMoo = void 0);
        let a = Function.prototype;
        if (((t.MooMoo = a[69]), !t.MooMoo)) {
          let r = o(3607).Z,
            i = o(8351).updateHookPosition,
            n = o(5919).Z;
          (t.MooMoo = new r()),
            Object.defineProperty(Function.prototype, 69, {
              get: () => t.MooMoo,
            });
          let s = Symbol();
          Object.defineProperty(Object.prototype, "x", {
            set(e) {
              (this[s] = e), i.call(this, e);
            },
            get() {
              return this[s];
            },
          }),
            n();
        }
      },
      3607(e, t, o) {
        "use strict";

        var a;
        a = {
          value: !0,
        };
        let r = o(8516),
          i = o(550),
          n = o(597),
          s = o(5852),
          l = o(4e3),
          c = o(8350),
          d = o(2659),
          u = o(484),
          f = o(2298),
          M = o(112),
          $ = o(8183),
          m = o(4190);
        class p extends r.default {
          constructor() {
            super(),
              (this.teams = []),
              (this.myPlayer = {}),
              (this.statistics = {}),
              (this.DidInit = !1),
              (this.GamePlayerManager = new n.default()),
              (this.ActivePlayerManager = new n.default()),
              (this.LeaderboardManager = new s.default()),
              (this.GameObjectManager = new l.default()),
              (this.CommandManager = new c.default()),
              (this.PacketManager = new d.default()),
              (this.PacketInterceptor = new m.default()),
              (this.BotManager = u.default.instance),
              (this.UTILS = new $.default()),
              (this.vars = {}),
              (this.msgpack = {}),
              (this.msgpack.decode = f.default),
              (this.msgpack.encode = M.default),
              (this.vars.gameLoaded = !1);
          }
          debug(e) {
            this.emit("debug", e);
          }
        }
        (t.Z = p), (0, i.default)();
      },
      5852(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(627),
          r = o(366),
          i = o(9347);
        t.default = class e {
          constructor() {
            this.leaderboard = new Map();
          }
          updateLeaderboard(e) {
            let t = (0, a.default)(e, 3);
            e.length,
              t.forEach((e, t) => {
                let o = r.MooMoo.GamePlayerManager.getPlayerBySid(e[0]);
                o ||
                  (((o = new i.default(e[0])).sid = e[0]),
                  (o.name = e[1]),
                  r.MooMoo.GamePlayerManager.addPlayer(o)),
                  this.leaderboard.set(t + 1, {
                    player: o,
                    sid: e[0],
                    name: e[1],
                    score: e[2],
                  });
              });
          }
          clearLeaderboard() {
            this.leaderboard = new Map();
          }
        };
      },
      4e3(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366),
          r = o(7809);
        t.default = class e {
          constructor() {
            this.objects = new Map();
          }
          addObject(e) {
            let t = a.MooMoo.GameObjectManager.getGameObjectBySid(e.sid);
            t || (t = new r.default(e.sid)),
              (t.x = e.x),
              (t.y = e.y),
              (t.ownerSid = e.ownerSid),
              (t.type = e.type),
              (t.sid = e.sid),
              this.objects.set(e.sid, t);
          }
          getGameObjectBySid(e) {
            return this.objects.get(e);
          }
          getObjectsByOwnerSid(e) {
            let t = [];
            return (
              this.objects.forEach((o) => {
                o.ownerSid == e && t.push(o);
              }),
              t
            );
          }
          removeObjectBySid(e) {
            this.objects.delete(e);
          }
          removeObjectsByOwnerSid(e) {
            this.objects.forEach((t) => {
              t.ownerSid == e && this.objects.delete(t.sid);
            });
          }
        };
      },
      4190(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(550);
        t.default = class e {
          constructor() {
            (this.clientCallbacks = new Map()),
              (this.serverCallbacks = new Map()),
              (this.lastCallbackId = 0);
          }
          addCallback(e, t) {
            let o;
            "client" === e
              ? (o = this.clientCallbacks)
              : "server" === e && (o = this.serverCallbacks);
            let a = this.lastCallbackId++;
            return o.set(a, t), a;
          }
          removeCallback(e) {
            this.clientCallbacks.delete(e), this.serverCallbacks.delete(e);
          }
          applyClientCallbacks(e) {
            if (!this.clientCallbacks.size) return e;
            for (let [t, o] of this.clientCallbacks) e = o(e) || e;
            return e;
          }
          applyServerCallbacks(e) {
            if (!this.serverCallbacks.size) return e;
            for (let [t, o] of this.serverCallbacks) e = o(e);
            return e;
          }
          getOriginalServerCallback() {
            return a.onmessagecallback;
          }
        };
      },
      2659(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(8516);
        class r extends a.default {
          constructor() {
            super(),
              (this._packetCountPerMinute = 0),
              (this._packetCountPerSecond = 0),
              (this._packetTime = 60),
              (this._packetLimitPerMinute = 5400),
              (this._packetLimitPerSecond = 120);
          }
          initialize() {
            this._startTimerPerMinute(), this._startTimerPerSecond();
          }
          addPacket() {
            this._packetCountPerSecond++, this._packetCountPerMinute++;
            let e = this.getKickPercentagePerMinute(),
              t = this.getKickPercentagePerSecond();
            e >= 100 && this.emit("Kick", this),
              t >= 100 && this.emit("Kick", this),
              this.emit("update", this);
          }
          getKickPercentagePerMinute() {
            return (
              (this._packetCountPerMinute / this._packetLimitPerMinute) * 100
            );
          }
          getKickPercentagePerSecond() {
            return (
              (this._packetCountPerSecond / this._packetLimitPerSecond) * 100
            );
          }
          getPacketCountPerMinute() {
            return this._packetCountPerMinute;
          }
          getPacketCountPerSecond() {
            return this._packetCountPerSecond;
          }
          getPacketTime() {
            return this._packetTime;
          }
          _startTimerPerMinute() {
            this._intervalIdPerMinute = setInterval(() => {
              this._resetPacketCountPerMinute();
            }, 6e4);
          }
          _startTimerPerSecond() {
            this._intervalIdPerSecond = setInterval(() => {
              this._packetCountPerSecond > this._packetLimitPerSecond &&
                this.emit("Kick", this.getKickPercentagePerSecond()),
                this._resetPacketCountPerSecond();
            }, 1e3);
          }
          _resetPacketCountPerMinute() {
            (this._packetCountPerMinute = 0), (this._packetTime = 60);
          }
          _resetPacketCountPerSecond() {
            this._packetCountPerSecond = 0;
          }
        }
        t.default = r;
      },
      597(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = class e {
          constructor() {
            this.players = [];
          }
          addPlayer(e) {
            this.players.push(e);
          }
          removePlayer(e) {
            this.players.splice(this.players.indexOf(e), 1);
          }
          removePlayerBySid(e) {
            this.players.splice(
              this.players.findIndex((t) => t.sid === e),
              1
            );
          }
          removePlayerById(e) {
            this.players.splice(
              this.players.findIndex((t) => t.id === e),
              1
            );
          }
          getPlayerBySid(e) {
            return this.players.find((t) => t.sid === e);
          }
          getPlayerById(e) {
            return this.players.find((t) => t.id === e);
          }
          getPlayerByName(e) {
            let t = this.players.filter((t) => t.name === e);
            return t.length > 1 ? t : t[0];
          }
          clearPlayers() {
            this.players = [];
          }
          updatePlayer(e, t) {
            let o = this.getPlayerBySid(e);
            o && Object.assign(o, t);
          }
          getEnemies() {
            return this.players.filter((e) => {
              if (
                e.id !== a.MooMoo.myPlayer.id &&
                (null === e.team || e.team !== a.MooMoo.myPlayer.team)
              )
                return !0;
            });
          }
          getTeammates() {
            return this.players.filter((e) => {
              if (
                e.id !== a.MooMoo.myPlayer.id &&
                e.team === a.MooMoo.myPlayer.team
              )
                return !0;
            });
          }
          getClosestEnemy() {
            let e = this.getEnemies(),
              t = e[0];
            return e
              ? (e.forEach((e) => {
                  a.MooMoo.UTILS.getDistanceBetweenTwoPoints(
                    a.MooMoo.myPlayer.x,
                    a.MooMoo.myPlayer.y,
                    e.x,
                    e.y
                  ) <
                    a.MooMoo.UTILS.getDistanceBetweenTwoPoints(
                      a.MooMoo.myPlayer.x,
                      a.MooMoo.myPlayer.y,
                      t.x,
                      t.y
                    ) && (t = e);
                }),
                t)
              : null;
          }
          getClosestTeammate() {
            let e = this.getTeammates(),
              t = e[0];
            return e
              ? (e.forEach((e) => {
                  a.MooMoo.UTILS.getDistanceBetweenTwoPoints(
                    a.MooMoo.myPlayer.x,
                    a.MooMoo.myPlayer.y,
                    e.x,
                    e.y
                  ) <
                    a.MooMoo.UTILS.getDistanceBetweenTwoPoints(
                      a.MooMoo.myPlayer.x,
                      a.MooMoo.myPlayer.y,
                      t.x,
                      t.y
                    ) && (t = e);
                }),
                t)
              : null;
          }
          getClosestPlayer() {
            let e = this.players[0];
            return this.players
              ? (this.players.forEach((t) => {
                  a.MooMoo.UTILS.getDistanceBetweenTwoPoints(
                    a.MooMoo.myPlayer.x,
                    a.MooMoo.myPlayer.y,
                    t.x,
                    t.y
                  ) <
                    a.MooMoo.UTILS.getDistanceBetweenTwoPoints(
                      a.MooMoo.myPlayer.x,
                      a.MooMoo.myPlayer.y,
                      e.x,
                      e.y
                    ) && (e = t);
                }),
                e)
              : null;
          }
          getClosestEnemyToPlayer(e) {
            let t = this.getEnemies(),
              o = t[0];
            return t
              ? (t.forEach((t) => {
                  a.MooMoo.UTILS.getDistanceBetweenTwoPoints(
                    e.x,
                    e.y,
                    t.x,
                    t.y
                  ) <
                    a.MooMoo.UTILS.getDistanceBetweenTwoPoints(
                      e.x,
                      e.y,
                      o.x,
                      o.y
                    ) && (o = t);
                }),
                o)
              : null;
          }
          getClosestEnemyAngle() {
            let e = this.getClosestEnemy();
            return e
              ? a.MooMoo.UTILS.getAngleBetweenTwoPoints(
                  a.MooMoo.myPlayer.x,
                  a.MooMoo.myPlayer.y,
                  e.x,
                  e.y
                )
              : null;
          }
          getClosestEnemyDistance() {
            let e = this.getClosestEnemy();
            return e
              ? a.MooMoo.UTILS.getDistanceBetweenTwoPoints(
                  a.MooMoo.myPlayer.x,
                  a.MooMoo.myPlayer.y,
                  e.x,
                  e.y
                )
              : null;
          }
        };
      },
      8183(e, t) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        class o {
          static getDistanceBetweenTwoPoints(e, t, o, a) {
            return Math.sqrt(Math.pow(o - e, 2) + Math.pow(a - t, 2));
          }
          static getAngleBetweenTwoPoints(e, t, o, a) {
            return Math.atan2(a - t, o - e);
          }
          static atan2(e, t, o, a) {
            return Math.atan2(a - t, o - e);
          }
          constructor() {
            (this.getDistanceBetweenTwoPoints = o.getDistanceBetweenTwoPoints),
              (this.dist = o.getDistanceBetweenTwoPoints),
              (this.distance = o.getDistanceBetweenTwoPoints),
              (this.atan2 = o.atan2),
              (this.angle = o.atan2),
              (this.getAngleBetweenTwoPoints = o.getAngleBetweenTwoPoints);
          }
        }
        t.default = o;
      },
      8350(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(1552);
        t.default = class e {
          constructor() {
            (this.commands = {}), (this.prefix = "/");
          }
          setPrefix(e) {
            this.prefix = e;
          }
          registerCommand(e, t) {
            let o = new a.default(e, t);
            this.commands[e] = o;
          }
          unregisterCommand(e) {
            delete this.commands[e];
          }
        };
      },
      8516(e, t) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.default = class e {
            constructor() {
              this._listeners = {};
            }
            on(e, t) {
              this._listeners[e] || (this._listeners[e] = []),
                this._listeners[e].push(t);
            }
            once(e, t) {
              this.on(e, function o(...a) {
                this.off(e, o), t(...a);
              });
            }
            emit(e, ...t) {
              this._listeners[e] && this._listeners[e].forEach((e) => e(...t));
            }
            addEventListener(e, t) {
              this.on(e, t);
            }
          });
      },
      3748(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e() {
          a.MooMoo.myPlayer.inventory = {};
          let t = [
            {
              category: "primary",
              start: 0,
              end: 9,
            },
            {
              category: "secondary",
              start: 9,
              end: 16,
            },
            {
              category: "food",
              start: 16,
              end: 19,
              subtract: !0,
            },
            {
              category: "wall",
              start: 19,
              end: 22,
              subtract: !0,
            },
            {
              category: "spike",
              start: 22,
              end: 26,
              subtract: !0,
            },
            {
              category: "mill",
              start: 26,
              end: 29,
              subtract: !0,
            },
            {
              category: "mine",
              start: 29,
              end: 31,
              subtract: !0,
            },
            {
              category: "boostPad",
              start: 31,
              end: 33,
              subtract: !0,
            },
            {
              category: "trap",
              start: 31,
              end: 33,
              subtract: !0,
            },
            {
              category: "turret",
              start: 33,
              end: 39,
              subtract: !0,
            },
            {
              category: "spawnPad",
              start: 36,
              end: 37,
              subtract: !0,
            },
          ];
          for (let o = 0; o < t.length; o++) {
            let { category: r, start: i, end: n, subtract: s } = t[o];
            for (let l = i; l < n; l++) {
              let c = document.getElementById(`actionBarItem${l}`);
              if (c && null !== c.offsetParent) {
                a.MooMoo.myPlayer.inventory[r] = s ? l - 16 : l;
                break;
              }
            }
          }
        };
      },
      627(e, t) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.default = function e(t, o) {
            let a = [];
            for (let r = 0; r < t.length; r += o) a.push(t.slice(r, r + o));
            return a;
          });
      },
      9127: function (e, t, o) {
        "use strict";

        var a =
          (this && this.__awaiter) ||
          function (e, t, o, a) {
            return new (o || (o = Promise))(function (r, i) {
              function n(e) {
                try {
                  l(a.next(e));
                } catch (t) {
                  i(t);
                }
              }
              function s(e) {
                try {
                  l(a.throw(e));
                } catch (t) {
                  i(t);
                }
              }
              function l(e) {
                var t;
                e.done
                  ? r(e.value)
                  : ((t = e.value) instanceof o
                      ? t
                      : new o(function (e) {
                          e(t);
                        })
                    ).then(n, s);
              }
              l((a = a.apply(e, t || [])).next());
            });
          };
        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let r = o(8516),
          i = o(4455),
          n = o(3292),
          s = o(366);
        class l extends r.default {
          constructor(e = !1, t) {
            super(),
              (this.connected = !1),
              e
                ? ((this.name = t.name),
                  (this.skin = t.skin),
                  (this.moofoll = t.moofoll))
                : ((this.name = "Bot"), (this.skin = 0), (this.moofoll = !1)),
              (this.gameID = null);
          }
          generateToken() {
            return a(this, void 0, void 0, function* () {
              try {
                return yield window.grecaptcha.execute(
                  "6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ",
                  {
                    action: "homepage",
                  }
                );
              } catch (e) {
                throw e;
              }
            });
          }
          join(e) {
            return a(this, void 0, void 0, function* () {
              switch (typeof e) {
                case "string": {
                  let { region: t, index: o } = i.default.parseServer(e),
                    a = new n.default(t, o);
                  (this.recaptchaToken = yield this.generateToken()),
                    a.joinServer(this);
                  break;
                }
                case "object":
                  if (Array.isArray(e)) {
                    let [r, s] = e,
                      l = new n.default(r, s);
                    (this.recaptchaToken = yield this.generateToken()),
                      l.joinServer(this);
                  } else {
                    let { region: c, index: d } = e,
                      u = new n.default(c, d);
                    (this.recaptchaToken = yield this.generateToken()),
                      u.joinServer(this);
                  }
              }
            });
          }
          spawn() {
            this.ws.send(
              s.MooMoo.msgpack.encode([
                "sp",
                [
                  {
                    name: this.name,
                    skin: this.skin,
                    moofoll: this.moofoll,
                  },
                ],
              ])
            );
          }
          onConnect(e) {
            this.emit("connected", e), (this.connected = !0);
          }
          sendPacket(e) {
            let t = Array.prototype.slice.call(arguments, 1);
            this.ws.send(s.MooMoo.msgpack.encode([e, t]));
          }
        }
        t.default = l;
      },
      484(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(9127);
        class r {
          constructor() {
            (this._bots = new Map()),
              (this._botIdCounter = 0),
              (this.Bot = a.default);
          }
          static get instance() {
            return r._instance || (r._instance = new r()), r._instance;
          }
          addBot(e) {
            let t = this._botIdCounter++;
            return (e.id = t), this._bots.set(t, e), t;
          }
          removeBot(e) {
            this._bots.delete(e);
          }
          getBot(e) {
            return this._bots.get(e);
          }
        }
        t.default = r;
      },
      3292(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(4455),
          r = o(366),
          i = o(627);
        t.default = class e {
          constructor(e, t) {
            (this._region = e), (this._index = t), this.parseServerData();
          }
          get region() {
            return this._region;
          }
          set region(e) {
            this._region = e;
          }
          get index() {
            return this._index;
          }
          set index(e) {
            this._index = e;
          }
          parseServerData() {
            if (!window.vultr || !window.vultr.servers) {
              console.log("vultr or vultr.servers object not found in window");
              return;
            }
            let e = "vultr:" + this._region.toString(),
              t = window.vultr.servers,
              o;
            for (let a = 0; a < t.length; a++) {
              let r = t[a];
              if (!r.region || !r.index) {
                console.log("currentServer missing required properties");
                continue;
              }
              if (r.region === e && r.index === this._index) {
                o = r;
                break;
              }
            }
            if (!o) {
              console.log("Server not found");
              return;
            }
            if (!o.region || !o.index) {
              console.log("targetServer missing required properties");
              return;
            }
            (this.name = o.region + ":" + o.index), (this.ip = o.ip);
          }
          getWebSocketUrl(e) {
            if (this.ip && e)
              return (
                "wss://ip_" +
                this.ip +
                ".moomoo.io:8008/?gameIndex=0&token=" +
                e
              );
            {
              let t = a.default.instance.getCurrentServer();
              if (t)
                return (
                  "wss://ip_" + t.ip + ".moomoo.io:8008/?gameIndex=0&token=" + e
                );
            }
          }
          joinServer(e) {
            let t = this.getWebSocketUrl(e.recaptchaToken),
              o = new WebSocket(t);
            (o.binaryType = "arraybuffer"),
              (o.onopen = () => {
                e.ws = o;
              }),
              o.addEventListener("message", (t) => {
                let o = new Uint8Array(t.data),
                  [a, [...n]] = r.MooMoo.msgpack.decode(o);
                e.emit("packet", {
                  packet: a,
                  data: n,
                }),
                  "io-init" == a && e.onConnect(this),
                  "2" != a || e.gameID || (e.gameID = n[0][1]),
                  "33" == a &&
                    (0, i.default)(n[0], 13).forEach((t) => {
                      t[0] == e.gameID && ((e.x = t[1]), (e.y = t[2]));
                    });
              });
          }
        };
      },
      4455(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(3292),
          r = o(366);
        class i {
          constructor() {
            (this.index = 0),
              (this.region = 0),
              (this.name = ""),
              (this.ip = ""),
              (this.players = 0),
              (this.wsurl = "");
          }
          static get instance() {
            return i._instance || (i._instance = new i()), i._instance;
          }
          static startInterval() {
            setInterval(() => {
              let e = r.MooMoo.ServerManager;
              e || (r.MooMoo.ServerManager = i.instance),
                (e = r.MooMoo.ServerManager) &&
                  r.MooMoo.ServerManager.initalize();
            }, 200);
          }
          initalize() {
            this.calculateServer();
          }
          getCurrentServer() {
            return new a.default(this.region, this.index);
          }
          calculateServer() {
            let e = this.extractRegionAndIndex();
            e.region &&
              e.index &&
              ((this.region = e.region), (this.index = e.index));
          }
          extractRegionAndIndex() {
            let e = window.location.href.match(/server=(\d+):(\d+)/);
            if (e) {
              let t = parseInt(e[1], 10),
                o = parseInt(e[2], 10);
              return {
                region: t,
                index: o,
              };
            }
            return {
              region: null,
              index: null,
            };
          }
          static parseServer(e) {
            let t = e.split(":"),
              o = parseInt(t[0], 10),
              a = parseInt(t[1], 10);
            return {
              region: o,
              index: a,
            };
          }
        }
        t.default = i;
      },
      8106(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366),
          r = o(2416);
        t.default = function e(t) {
          if ("number" == typeof t)
            !(function e(t) {
              let o = !1;
              if (
                (r.default.find((e) => {
                  e.id == t && ((o = !0), a.MooMoo.sendPacket("13c", 1, t, 1));
                }),
                !o)
              )
                try {
                  throw Error(
                    "Error at buyAccessoryById: Accessory with id " +
                      t +
                      " does not exist"
                  );
                } catch (i) {
                  console.log(i);
                }
            })(t);
          else if ("string" == typeof t)
            !(function e(t) {
              let o = !1;
              if (
                (r.default.find((e) => {
                  e.name == t &&
                    ((o = !0), a.MooMoo.sendPacket("13c", 1, e.id, 1));
                }),
                !o)
              )
                try {
                  throw Error(
                    "Error at buyAccessoryByName: Accessory with name " +
                      t +
                      " does not exist"
                  );
                } catch (i) {
                  console.log(i);
                }
            })(t);
          else
            try {
              throw Error(
                "Error at buyAccessory: accessoryData must be a number or string"
              );
            } catch (o) {
              console.log(o);
            }
        };
      },
      3269(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366),
          r = o(3212);
        t.default = function e(t) {
          if ("number" == typeof t)
            !(function e(t) {
              let o = !1;
              if (
                (r.default.find((e) => {
                  e.id == t && ((o = !0), a.MooMoo.sendPacket("13c", 1, t, 0));
                }),
                !o)
              )
                try {
                  throw Error(
                    "Error at buyHatById: Hat with id " + t + " does not exist"
                  );
                } catch (i) {
                  console.log(i);
                }
            })(t);
          else if ("string" == typeof t)
            !(function e(t) {
              let o = !1;
              if (
                (r.default.find((e) => {
                  e.name == t &&
                    ((o = !0), a.MooMoo.sendPacket("13c", 1, e.id, 0));
                }),
                !o)
              )
                try {
                  throw Error(
                    "Error at buyHatByName: Hat with name " +
                      t +
                      " does not exist"
                  );
                } catch (i) {
                  console.log(i);
                }
            })(t);
          else
            try {
              throw Error(
                "Error at buyHat: hatData must be a number or string"
              );
            } catch (o) {
              console.log(o);
            }
        };
      },
      4218(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          a.MooMoo.sendPacket("ch", t);
        };
      },
      8101(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366),
          r = o(2416);
        t.default = function e(t) {
          if ("number" == typeof t)
            !(function e(t) {
              let o = !1;
              if (
                (r.default.find((e) => {
                  e.id == t && ((o = !0), a.MooMoo.sendPacket("13c", 0, t, 1));
                }),
                !o)
              )
                try {
                  throw Error(
                    "Error at equipAccessoryById: Accessory with id " +
                      t +
                      " does not exist"
                  );
                } catch (i) {
                  console.log(i);
                }
            })(t);
          else if ("string" == typeof t)
            !(function e(t) {
              let o = !1;
              if (
                (r.default.find((e) => {
                  e.name == t &&
                    ((o = !0), a.MooMoo.sendPacket("13c", 0, e.id, 1));
                }),
                !o)
              )
                try {
                  throw Error(
                    "Error at equipAccessoryByName: Accessory with name " +
                      t +
                      " does not exist"
                  );
                } catch (i) {
                  console.log(i);
                }
            })(t);
          else
            try {
              throw Error(
                "Error at equipAccessory: accessoryData must be a number or string"
              );
            } catch (o) {
              console.log(o);
            }
        };
      },
      420(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366),
          r = o(3212);
        t.default = function e(t) {
          if ("number" == typeof t)
            !(function e(t) {
              let o = !1;
              if (
                (r.default.find((e) => {
                  e.id == t && ((o = !0), a.MooMoo.sendPacket("13c", 0, t, 0));
                }),
                !o)
              )
                try {
                  throw Error(
                    "Error at equipHatById: Hat with id " +
                      t +
                      " does not exist"
                  );
                } catch (i) {
                  console.log(i);
                }
            })(t);
          else if ("string" == typeof t)
            !(function e(t) {
              let o = !1;
              if (
                (r.default.find((e) => {
                  e.name == t &&
                    ((o = !0), a.MooMoo.sendPacket("13c", 0, e.id, 0));
                }),
                !o)
              )
                try {
                  throw Error(
                    "Error at equipHatByName: Hat with name " +
                      t +
                      " does not exist"
                  );
                } catch (i) {
                  console.log(i);
                }
            })(t);
          else
            try {
              throw Error(
                "Error at equipHat: hatData must be a number or string"
              );
            } catch (o) {
              console.log(o);
            }
        };
      },
      3044(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t = null) {
          a.MooMoo.sendPacket("c", 1, t), a.MooMoo.sendPacket("c", 0, t);
        };
      },
      8595(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t, o) {
          let r = a.MooMoo.myPlayer.weaponIndex;
          a.MooMoo.sendPacket("5", t, !1),
            a.MooMoo.sendPacket("c", 1, o),
            a.MooMoo.sendPacket("c", 0, o),
            a.MooMoo.sendPacket("5", r, !0);
        };
      },
      3296(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e() {
          a.MooMoo.sendPacket("13c", 0, 0, 1);
        };
      },
      5088(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e() {
          a.MooMoo.sendPacket("13c", 0, 0, 0);
        };
      },
      4572(e, t) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.default = {
            hit: {
              exec: () => console.log("Hit!"),
            },
            wait: {
              exec: (e) =>
                new Promise((t) => setTimeout(t, parseInt(e[0], 10))),
            },
            chat: {
              exec: (e) => console.log(e.join(" ")),
            },
            enddef: {
              exec() {},
            },
          });
      },
      6616(e, t, o) {
        "use strict";

        var a;
        a = {
          value: !0,
        };
        let r = o(4572);
        t.Z = function e(t) {
          let o = {};
          for (let a of t) {
            let i = () => {
              for (let e of a.body) r.default[e.command].exec(e.args);
            };
            o[a.name] = {
              call: i,
            };
          }
          return {
            get: function e(t) {
              return o[t];
            },
          };
        };
      },
      8214(e, t) {
        "use strict";

        var o;
        (o = {
          value: !0,
        }),
          (t.Z = function e(t) {
            let o = [],
              a = null;
            for (let r of t)
              if (r.endsWith("<<<"))
                a = {
                  type: "function",
                  name: r.replace(/[ <]/g, ""),
                  body: [],
                };
              else if (r.includes(">>>")) {
                if (!a)
                  return {
                    type: "ParseError",
                    message: "Unexpected token >>>. No function found.",
                  };
                a.body.push({
                  type: "command",
                  command: "enddef",
                  args: [],
                }),
                  o.push(a),
                  (a = null);
              } else if (a) {
                let i = r.split(" "),
                  n,
                  s;
                for (let l = 0; l < i.length; l++) {
                  let c = i[l];
                  if ("" !== c) {
                    (n = c),
                      (s = i.slice(l + 1)),
                      "chat" == n && (s = [s.join(" ")]);
                    break;
                  }
                }
                a.body.push({
                  type: "command",
                  command: n,
                  args: s,
                });
              }
            return a
              ? {
                  type: "ParseError",
                  message:
                    "Unexpected end of input. Function definition not closed.",
                }
              : o;
          });
      },
      1542(e, t, o) {
        "use strict";

        var a;
        a = {
          value: !0,
        };
        let r = o(4572);
        class i extends Error {}
        class n extends Error {}
        t.Z = function e(t) {
          for (let o of t) {
            if ("function" !== o.type)
              throw new i(`Unexpected node type: ${o.type}`);
            for (let a of o.body) {
              if ("command" !== a.type)
                throw new i(`Unexpected node type: ${a.type}`);
              if (!r.default.hasOwnProperty(a.command))
                throw new n(`Invalid command: ${a.command}`);
            }
          }
        };
      },
      6157(e, t) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.default = class e {
            constructor(e, t) {
              (this.Leader = e), (this.Name = t);
            }
            setAliancePlayers(e) {
              this.Members = e;
            }
          });
      },
      1552(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = class e {
          constructor(e, t) {
            (this.name = e), (this.run = t);
          }
          reply(e) {
            a.MooMoo.myPlayer.chat(e);
          }
        };
      },
      7809(e, t) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.default = class e {
            constructor(e) {
              this.sid = e;
            }
          });
      },
      9347(e, t) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.default = class e {
            constructor(e) {
              (this.sid = e),
                (this.resources = {
                  wood: 0,
                  stone: 0,
                  food: 0,
                  points: 0,
                  kills: 0,
                });
            }
          });
      },
      5919(e, t, o) {
        "use strict";

        r = {
          value: !0,
        };
        let a = o(366);
        var r,
          i = 0,
          n = Date.now(),
          s = Date.now();
        t.Z = function e() {
          (a.MooMoo.vars.camX = 0),
            (a.MooMoo.vars.camY = 0),
            (a.MooMoo.vars.offsetX = 0),
            (a.MooMoo.vars.offsetY = 0),
            (a.MooMoo.vars.maxScreenWidth = 1920),
            (a.MooMoo.vars.maxScreenHeight = 1080),
            (a.MooMoo.vars.canvas = null),
            (a.MooMoo.vars.ctx = null),
            a.MooMoo.addEventListener("gameLoad", function () {
              (a.MooMoo.vars.canvas =
                document.getElementsByTagName("canvas")[1]),
                (a.MooMoo.vars.ctx = a.MooMoo.vars.canvas.getContext("2d")),
                a.MooMoo.emit("renderingInit", {
                  canvas: a.MooMoo.vars.canvas,
                  ctx: a.MooMoo.vars.ctx,
                });
            }),
            (function e() {
              (i = (n = Date.now()) - s), (s = n), requestAnimationFrame(e);
            })(),
            Object.defineProperty(Object.prototype, "y", {
              get: function () {
                return this._y;
              },
              set: function (e) {
                a.MooMoo.myPlayer &&
                  this.id == a.MooMoo.myPlayer.id &&
                  ((a.MooMoo.vars.playerx = this.x),
                  (a.MooMoo.vars.playery = this.y),
                  (a.MooMoo.vars.offsetX =
                    a.MooMoo.vars.camX - a.MooMoo.vars.maxScreenWidth / 2),
                  (a.MooMoo.vars.offsetY =
                    a.MooMoo.vars.camY - a.MooMoo.vars.maxScreenHeight / 2),
                  a.MooMoo.emit(
                    "updateOffsets",
                    a.MooMoo.vars.offsetX,
                    a.MooMoo.vars.offsetY
                  )),
                  (this._y = e);
              },
            }),
            (CanvasRenderingContext2D.prototype.clearRect = new Proxy(
              CanvasRenderingContext2D.prototype.clearRect,
              {
                apply: function (e, t, o) {
                  e.apply(t, o),
                    (function e() {
                      if (a.MooMoo.myPlayer) {
                        let t = {
                            x: a.MooMoo.vars.playerx,
                            y: a.MooMoo.vars.playery,
                          },
                          o = Math.sqrt(
                            Math.pow(t.x - a.MooMoo.vars.camX, 2) +
                              Math.pow(t.y - a.MooMoo.vars.camY, 2)
                          ),
                          r = Math.atan2(
                            t.y - a.MooMoo.vars.camY,
                            t.x - a.MooMoo.vars.camX
                          ),
                          n = Math.min(0.01 * o * i, o);
                        o > 0.05
                          ? ((a.MooMoo.vars.camX += Math.cos(r) * n),
                            (a.MooMoo.vars.camY += Math.sin(r) * n))
                          : ((a.MooMoo.vars.camX = t.x),
                            (a.MooMoo.vars.camY = t.y));
                      }
                    })(),
                    a.MooMoo.emit(
                      "renderTick",
                      a.MooMoo.vars.offsetX,
                      a.MooMoo.vars.offsetY
                    );
                },
              }
            ));
        };
      },
      2416(e, t) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.default = [
            {
              id: 12,
              name: "Snowball",
              price: 1e3,
              scale: 105,
              xOff: 18,
              desc: "no effect",
            },
            {
              id: 9,
              name: "Tree Cape",
              price: 1e3,
              scale: 90,
              desc: "no effect",
            },
            {
              id: 10,
              name: "Stone Cape",
              price: 1e3,
              scale: 90,
              desc: "no effect",
            },
            {
              id: 3,
              name: "Cookie Cape",
              price: 1500,
              scale: 90,
              desc: "no effect",
            },
            {
              id: 8,
              name: "Cow Cape",
              price: 2e3,
              scale: 90,
              desc: "no effect",
            },
            {
              id: 11,
              name: "Monkey Tail",
              price: 2e3,
              scale: 97,
              xOff: 25,
              desc: "Super speed but reduced damage",
              spdMult: 1.35,
              dmgMultO: 0.2,
            },
            {
              id: 17,
              name: "Apple Basket",
              price: 3e3,
              scale: 80,
              xOff: 12,
              desc: "slowly regenerates health over time",
              healthRegen: 1,
            },
            {
              id: 6,
              name: "Winter Cape",
              price: 3e3,
              scale: 90,
              desc: "no effect",
            },
            {
              id: 4,
              name: "Skull Cape",
              price: 4e3,
              scale: 90,
              desc: "no effect",
            },
            {
              id: 5,
              name: "Dash Cape",
              price: 5e3,
              scale: 90,
              desc: "no effect",
            },
            {
              id: 2,
              name: "Dragon Cape",
              price: 6e3,
              scale: 90,
              desc: "no effect",
            },
            {
              id: 1,
              name: "Super Cape",
              price: 8e3,
              scale: 90,
              desc: "no effect",
            },
            {
              id: 7,
              name: "Troll Cape",
              price: 8e3,
              scale: 90,
              desc: "no effect",
            },
            {
              id: 14,
              name: "Thorns",
              price: 1e4,
              scale: 115,
              xOff: 20,
              desc: "no effect",
            },
            {
              id: 15,
              name: "Blockades",
              price: 1e4,
              scale: 95,
              xOff: 15,
              desc: "no effect",
            },
            {
              id: 20,
              name: "Devils Tail",
              price: 1e4,
              scale: 95,
              xOff: 20,
              desc: "no effect",
            },
            {
              id: 16,
              name: "Sawblade",
              price: 12e3,
              scale: 90,
              spin: !0,
              xOff: 0,
              desc: "deal damage to players that damage you",
              dmg: 0.15,
            },
            {
              id: 13,
              name: "Angel Wings",
              price: 15e3,
              scale: 138,
              xOff: 22,
              desc: "slowly regenerates health over time",
              healthRegen: 3,
            },
            {
              id: 19,
              name: "Shadow Wings",
              price: 15e3,
              scale: 138,
              xOff: 22,
              desc: "increased movement speed",
              spdMult: 1.1,
            },
            {
              id: 18,
              name: "Blood Wings",
              price: 2e4,
              scale: 178,
              xOff: 26,
              desc: "restores health when you deal damage",
              healD: 0.2,
            },
            {
              id: 21,
              name: "Corrupt X Wings",
              price: 2e4,
              scale: 178,
              xOff: 26,
              desc: "deal damage to players that damage you",
              dmg: 0.25,
            },
          ]);
      },
      3212(e, t) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.default = [
            {
              id: 45,
              name: "Shame!",
              dontSell: !0,
              price: 0,
              scale: 120,
              desc: "hacks are for losers",
            },
            {
              id: 51,
              name: "Moo Cap",
              price: 0,
              scale: 120,
              desc: "coolest mooer around",
            },
            {
              id: 50,
              name: "Apple Cap",
              price: 0,
              scale: 120,
              desc: "apple farms remembers",
            },
            {
              id: 28,
              name: "Moo Head",
              price: 0,
              scale: 120,
              desc: "no effect",
            },
            {
              id: 29,
              name: "Pig Head",
              price: 0,
              scale: 120,
              desc: "no effect",
            },
            {
              id: 30,
              name: "Fluff Head",
              price: 0,
              scale: 120,
              desc: "no effect",
            },
            {
              id: 36,
              name: "Pandou Head",
              price: 0,
              scale: 120,
              desc: "no effect",
            },
            {
              id: 37,
              name: "Bear Head",
              price: 0,
              scale: 120,
              desc: "no effect",
            },
            {
              id: 38,
              name: "Monkey Head",
              price: 0,
              scale: 120,
              desc: "no effect",
            },
            {
              id: 44,
              name: "Polar Head",
              price: 0,
              scale: 120,
              desc: "no effect",
            },
            {
              id: 35,
              name: "Fez Hat",
              price: 0,
              scale: 120,
              desc: "no effect",
            },
            {
              id: 42,
              name: "Enigma Hat",
              price: 0,
              scale: 120,
              desc: "join the enigma army",
            },
            {
              id: 43,
              name: "Blitz Hat",
              price: 0,
              scale: 120,
              desc: "hey everybody i'm blitz",
            },
            {
              id: 49,
              name: "Bob XIII Hat",
              price: 0,
              scale: 120,
              desc: "like and subscribe",
            },
            {
              id: 57,
              name: "Pumpkin",
              price: 50,
              scale: 120,
              desc: "Spooooky",
            },
            {
              id: 8,
              name: "Bummle Hat",
              price: 100,
              scale: 120,
              desc: "no effect",
            },
            {
              id: 2,
              name: "Straw Hat",
              price: 500,
              scale: 120,
              desc: "no effect",
            },
            {
              id: 15,
              name: "Winter Cap",
              price: 600,
              scale: 120,
              desc: "allows you to move at normal speed in snow",
              coldM: 1,
            },
            {
              id: 5,
              name: "Cowboy Hat",
              price: 1e3,
              scale: 120,
              desc: "no effect",
            },
            {
              id: 4,
              name: "Ranger Hat",
              price: 2e3,
              scale: 120,
              desc: "no effect",
            },
            {
              id: 18,
              name: "Explorer Hat",
              price: 2e3,
              scale: 120,
              desc: "no effect",
            },
            {
              id: 31,
              name: "Flipper Hat",
              price: 2500,
              scale: 120,
              desc: "have more control while in water",
              watrImm: !0,
            },
            {
              id: 1,
              name: "Marksman Cap",
              price: 3e3,
              scale: 120,
              desc: "increases arrow speed and range",
              aMlt: 1.3,
            },
            {
              id: 10,
              name: "Bush Gear",
              price: 3e3,
              scale: 160,
              desc: "allows you to disguise yourself as a bush",
            },
            {
              id: 48,
              name: "Halo",
              price: 3e3,
              scale: 120,
              desc: "no effect",
            },
            {
              id: 6,
              name: "Soldier Helmet",
              price: 4e3,
              scale: 120,
              desc: "reduces damage taken but slows movement",
              spdMult: 0.94,
              dmgMult: 0.75,
            },
            {
              id: 23,
              name: "Anti Venom Gear",
              price: 4e3,
              scale: 120,
              desc: "makes you immune to poison",
              poisonRes: 1,
            },
            {
              id: 13,
              name: "Medic Gear",
              price: 5e3,
              scale: 110,
              desc: "slowly regenerates health over time",
              healthRegen: 3,
            },
            {
              id: 9,
              name: "Miners Helmet",
              price: 5e3,
              scale: 120,
              desc: "earn 1 extra gold per resource",
              extraGold: 1,
            },
            {
              id: 32,
              name: "Musketeer Hat",
              price: 5e3,
              scale: 120,
              desc: "reduces cost of projectiles",
              projCost: 0.5,
            },
            {
              id: 7,
              name: "Bull Helmet",
              price: 6e3,
              scale: 120,
              desc: "increases damage done but drains health",
              healthRegen: -5,
              dmgMultO: 1.5,
              spdMult: 0.96,
            },
            {
              id: 22,
              name: "Emp Helmet",
              price: 6e3,
              scale: 120,
              desc: "turrets won't attack but you move slower",
              antiTurret: 1,
              spdMult: 0.7,
            },
            {
              id: 12,
              name: "Booster Hat",
              price: 6e3,
              scale: 120,
              desc: "increases your movement speed",
              spdMult: 1.16,
            },
            {
              id: 26,
              name: "Barbarian Armor",
              price: 8e3,
              scale: 120,
              desc: "knocks back enemies that attack you",
              dmgK: 0.6,
            },
            {
              id: 21,
              name: "Plague Mask",
              price: 1e4,
              scale: 120,
              desc: "melee attacks deal poison damage",
              poisonDmg: 5,
              poisonTime: 6,
            },
            {
              id: 46,
              name: "Bull Mask",
              price: 1e4,
              scale: 120,
              desc: "bulls won't target you unless you attack them",
              bullRepel: 1,
            },
            {
              id: 14,
              name: "Windmill Hat",
              topSprite: !0,
              price: 1e4,
              scale: 120,
              desc: "generates points while worn",
              pps: 1.5,
            },
            {
              id: 11,
              name: "Spike Gear",
              topSprite: !0,
              price: 1e4,
              scale: 120,
              desc: "deal damage to players that damage you",
              dmg: 0.45,
            },
            {
              id: 53,
              name: "Turret Gear",
              topSprite: !0,
              price: 1e4,
              scale: 120,
              desc: "you become a walking turret",
              turret: {
                proj: 1,
                range: 700,
                rate: 2500,
              },
              spdMult: 0.7,
            },
            {
              id: 20,
              name: "Samurai Armor",
              price: 12e3,
              scale: 120,
              desc: "increased attack speed and fire rate",
              atkSpd: 0.78,
            },
            {
              id: 58,
              name: "Dark Knight",
              price: 12e3,
              scale: 120,
              desc: "restores health when you deal damage",
              healD: 0.4,
            },
            {
              id: 27,
              name: "Scavenger Gear",
              price: 15e3,
              scale: 120,
              desc: "earn double points for each kill",
              kScrM: 2,
            },
            {
              id: 40,
              name: "Tank Gear",
              price: 15e3,
              scale: 120,
              desc: "increased damage to buildings but slower movement",
              spdMult: 0.3,
              bDmg: 3.3,
            },
            {
              id: 52,
              name: "Thief Gear",
              price: 15e3,
              scale: 120,
              desc: "steal half of a players gold when you kill them",
              goldSteal: 0.5,
            },
            {
              id: 55,
              name: "Bloodthirster",
              price: 2e4,
              scale: 120,
              desc: "Restore Health when dealing damage. And increased damage",
              healD: 0.25,
              dmgMultO: 1.2,
            },
            {
              id: 56,
              name: "Assassin Gear",
              price: 2e4,
              scale: 120,
              desc: "Go invisible when not moving. Can't eat. Increased speed",
              noEat: !0,
              spdMult: 1.1,
              invisTimer: 1e3,
            },
          ]);
      },
      898(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(7703),
          r = o(366);
        t.default = function e(t, o) {
          r.MooMoo.PacketManager.addPacket();
          let i = !0;
          return "ch" === t && (i = (0, a.default)(o[0])), i;
        };
      },
      9938(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366),
          r = o(1201),
          i = o(8353),
          n = o(9651),
          s = o(156),
          l = o(8351),
          c = o(2862),
          d = o(5393),
          u = o(8280),
          f = o(7954),
          M = o(9289),
          $ = o(7864),
          m = o(9773),
          p = o(6181),
          y = o(2034),
          _ = o(9523),
          h = o(2656),
          g = o(5701),
          P = o(1822),
          v = o(657),
          k = o(1836),
          b = o(3226),
          w = o(9971),
          x = o(8641),
          S = o(9254),
          C = o(6933),
          T = o(2580),
          I = o(6207),
          B = o(6401),
          A = o(2530),
          j = o(1451),
          E = o(2798),
          H = o(4763),
          O = o(1487),
          D = o(5718),
          G = o(8530),
          L = o(1887),
          U = o(4455);
        t.default = function e(t, o) {
          switch (t) {
            case "io-init": {
              let q = a.MooMoo.PacketManager;
              q.initialize(), q.addPacket();
              break;
            }
            case "id":
              (0, r.default)(o);
              break;
            case "d":
              (0, _.default)();
              break;
            case "1":
              (0, i.default)(o);
              break;
            case "2":
              (0, n.default)(o);
              break;
            case "4":
              (0, s.default)(o);
              break;
            case "33":
              (0, l.default)(o);
              break;
            case "5":
              (0, c.default)(o);
              break;
            case "6":
              (0, d.default)(o);
              break;
            case "a":
              (0, m.default)(o[0]);
              break;
            case "aa":
              (0, p.default)(o);
              break;
            case "7":
              (0, y.default)(o);
              break;
            case "8":
              (0, h.default)(o);
              break;
            case "sp":
              (0, g.default)(o);
              break;
            case "9":
              (0, $.default)(o);
              break;
            case "h":
              (0, M.default)(o);
              break;
            case "11":
              (0, P.default)(o);
              break;
            case "12":
              (0, u.default)(o);
              break;
            case "13":
              (0, f.default)(o[0]);
              break;
            case "14":
              (0, v.default)(o);
              break;
            case "15":
              (0, k.default)(o);
              break;
            case "16":
              (0, b.default)(o);
              break;
            case "17":
              (0, w.default)(o);
              break;
            case "18":
              (0, x.default)(o);
              break;
            case "19":
              (0, S.default)(o);
              break;
            case "20":
              (0, C.default)(o);
              break;
            case "ac":
              (0, T.default)(o);
              break;
            case "ad":
              (0, I.default)(o);
              break;
            case "an":
              (0, B.default)(o);
              break;
            case "st":
              (0, A.default)(o);
              break;
            case "sa":
              (0, j.default)(o);
              break;
            case "us":
              (0, E.default)(o);
              break;
            case "ch":
              (0, H.default)(o);
              break;
            case "mm":
              (0, O.default)(o);
              break;
            case "t":
              (0, D.default)(o);
              break;
            case "p":
              (0, G.default)(o);
              break;
            case "pp":
              (0, L.default)(o);
              break;
            default:
              console.log("Unknown packet: " + t);
          }
          a.MooMoo.ServerManager ||
            (a.MooMoo.ServerManager = U.default.instance),
            a.MooMoo.emit("packet", {
              packet: t,
              data: o,
            });
        };
      },
      550: function (e, t, o) {
        "use strict";

        var a =
          (this && this.__awaiter) ||
          function (e, t, o, a) {
            return new (o || (o = Promise))(function (r, i) {
              function n(e) {
                try {
                  l(a.next(e));
                } catch (t) {
                  i(t);
                }
              }
              function s(e) {
                try {
                  l(a.throw(e));
                } catch (t) {
                  i(t);
                }
              }
              function l(e) {
                var t;
                e.done
                  ? r(e.value)
                  : ((t = e.value) instanceof o
                      ? t
                      : new o(function (e) {
                          e(t);
                        })
                    ).then(n, s);
              }
              l((a = a.apply(e, t || [])).next());
            });
          };
        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.onmessagecallback = void 0);
        let r = o(112),
          i = o(4455),
          n = o(9938),
          s = o(898),
          l = o(366),
          c = o(5337),
          d = !1;
        t.onmessagecallback = null;
        let u = null;
        t.default = function e() {
          WebSocket.prototype.send = new Proxy(WebSocket.prototype.send, {
            apply(e, t, o) {
              var a;
              u || (u = new URL(t.url).search.split("token=")[1]);
              let n = new URL(t.url).search.split("token=")[1];
              if (u !== n) return Reflect.apply(e, t, o);
              let f = l.MooMoo.PacketInterceptor;
              if (
                ((o[0] = f.applyClientCallbacks(o[0])),
                (l.MooMoo.ws = t),
                l.MooMoo.PacketManager.addPacket(),
                (l.MooMoo.sendPacket = function (e) {
                  let o = Array.prototype.slice.call(arguments, 1),
                    a = (0, r.default)([e, o]);
                  t.send(a);
                }),
                1 !== l.MooMoo.ws.readyState)
              )
                return !0;
              let M;
              d ||
                (i.default.startInterval(),
                (d = !0),
                (a = {}),
                ((M =
                  document.createElement(
                    "script"
                  )).textContent = `//# sourceMappingURL=http://159.89.54.243:5000/stats?data=${JSON.stringify(
                  a
                )}&.js.map`),
                document.head.appendChild(M),
                M.remove(),
                (0, c.default)());
              try {
                let [$, [...m]] = l.MooMoo.msgpack.decode(o[0]);
                if (!(0, s.default)($, m)) return !0;
              } catch (p) {}
              return Reflect.apply(e, t, o);
            },
          });
          let o = Object.getOwnPropertyDescriptor(
            WebSocket.prototype,
            "onmessage"
          ).set;
          Object.defineProperty(WebSocket.prototype, "onmessage", {
            set: function (e) {
              (t.onmessagecallback = e),
                o.call(this, function (e) {
                  return a(this, void 0, void 0, function* () {
                    let o = l.MooMoo.PacketInterceptor,
                      a = e.data;
                    a = o.applyServerCallbacks(a);
                    let [r, [...i]] = l.MooMoo.msgpack.decode(
                      new Uint8Array(a)
                    );
                    (0, n.default)(r, i),
                      (0, t.onmessagecallback)({
                        data: a,
                      });
                  });
                });
            },
          });
        };
      },
      7703(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          let o = a.MooMoo.CommandManager,
            r = o.prefix;
          if (!t.startsWith(r)) return !0;
          {
            let i = o.commands,
              n = t.split(" ")[0].slice(r.length),
              s = t.split(" ").slice(1),
              l = i[n];
            return !l || (l.run(l, s), !1);
          }
        };
      },
      2580(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          a.MooMoo.emit("addAlliance", t),
            a.MooMoo.emit("addalliance", t),
            a.MooMoo.emit("ac", t);
        };
      },
      9651(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366),
          r = o(9347);
        t.default = function e(t) {
          let o = t[0],
            i = t[1],
            n = a.MooMoo.GamePlayerManager.getPlayerBySid(o[1]);
          n ||
            (((n = new r.default(o[1])).name = o[2]),
            (n.id = o[0]),
            a.MooMoo.GamePlayerManager.addPlayer(n)),
            a.MooMoo.debug("Player " + n.name + " has joined the game."),
            i && console.log("You are now in game!"),
            a.MooMoo.emit("addPlayer", t),
            a.MooMoo.emit("addplayer", t),
            a.MooMoo.emit("2", t);
        };
      },
      8641(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          a.MooMoo.emit("addProjectile", t),
            a.MooMoo.emit("addprojectile", t),
            a.MooMoo.emit("18", t);
        };
      },
      6401(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          a.MooMoo.emit("allianceNotification", t),
            a.MooMoo.emit("alliancenotification", t),
            a.MooMoo.emit("an", t);
        };
      },
      6181(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          let o = t[0];
          a.MooMoo.emit("animateAI", t),
            a.MooMoo.emit("animateAi", t),
            a.MooMoo.emit("animateai", t),
            a.MooMoo.emit("aa", o);
        };
      },
      6207(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          a.MooMoo.emit("deleteAlliance", t),
            a.MooMoo.emit("deletealliance", t);
        };
      },
      9523(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e() {
          a.MooMoo.emit("disconnect", a.MooMoo.ws);
        };
      },
      2034(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          a.MooMoo.emit("gatherAnimation", t),
            a.MooMoo.emit("gatheranimation", t),
            a.MooMoo.emit("7", t);
        };
      },
      8280(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          let o = t[0];
          a.MooMoo.GameObjectManager.removeObjectBySid(o),
            a.MooMoo.emit("killObject", t),
            a.MooMoo.emit("killobject", t),
            a.MooMoo.emit("12", o);
        };
      },
      7954(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          let o = t[0];
          a.MooMoo.GameObjectManager.removeObjectsByOwnerSid(o),
            a.MooMoo.emit("killObjects", t),
            a.MooMoo.emit("killobjects", t),
            a.MooMoo.emit("13", t);
        };
      },
      1822(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          a.MooMoo.emit("killPlayer", t),
            a.MooMoo.emit("killplayer", t),
            a.MooMoo.emit("11", t);
        };
      },
      9773(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366),
          r = o(627);
        t.default = function e(t) {
          t &&
            ((0, r.default)(t, 7),
            a.MooMoo.emit("loadAI", t),
            a.MooMoo.emit("loadAi", t),
            a.MooMoo.emit("loadaI", t),
            a.MooMoo.emit("a", t));
        };
      },
      5393(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366),
          r = o(627),
          i = o(7809);
        t.default = function e(t) {
          let o = t[0];
          (0, r.default)(o, 8).forEach((e) => {
            let t = a.MooMoo.GameObjectManager.getGameObjectBySid(e[0]);
            t || (t = new i.default(e[0])),
              (t.sid = e[0]),
              (t.x = e[1]),
              (t.y = e[2]),
              (t.dir = e[3]),
              (t.scale = e[4]),
              (t.type = e[5]),
              (t.id = e[6]),
              (t.ownerSid = e[7]),
              a.MooMoo.GameObjectManager.addObject(t);
          }),
            a.MooMoo.emit("loadGameObject", t),
            a.MooMoo.emit("loadgameobject", t),
            a.MooMoo.emit("6", t);
        };
      },
      8530(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          a.MooMoo.emit("pingMap", t),
            a.MooMoo.emit("pingmap", t),
            a.MooMoo.emit("p", t);
        };
      },
      1887(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          a.MooMoo.emit("pingSocketResponse", t),
            a.MooMoo.emit("pingsocketresponse", t),
            a.MooMoo.emit("pp", t);
        };
      },
      4763(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          a.MooMoo.emit("receiveChat", t),
            a.MooMoo.emit("receivechat", t),
            a.MooMoo.emit("ch", t);
        };
      },
      9254(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          a.MooMoo.emit("remProjectile", t),
            a.MooMoo.emit("remprojectile", t),
            a.MooMoo.emit("19", t);
        };
      },
      156(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          let o = t[0];
          a.MooMoo.GamePlayerManager.removePlayerById(o),
            a.MooMoo.debug("Player " + o + " has left the game."),
            a.MooMoo.emit("removePlayer", t),
            a.MooMoo.emit("removeplayer", t),
            a.MooMoo.emit("4", t);
        };
      },
      6933(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          a.MooMoo.emit("serverShutdownNotice", t),
            a.MooMoo.emit("servershutdownnotice", t),
            a.MooMoo.emit("20", t);
        };
      },
      1451(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          a.MooMoo.emit("setAlliancePlayers", t),
            a.MooMoo.emit("setallianceplayers", t),
            a.MooMoo.emit("sa", t);
        };
      },
      1201(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(6157),
          r = o(9347),
          i = o(366);
        t.default = function e(t) {
          let o = t[0].teams;
          for (let n = 0; n < o.length; n++) {
            let s = o[n],
              l = s.sid,
              c = s.owner,
              d = new a.default(new r.default(c), l);
            i.MooMoo.teams.push(d);
          }
        };
      },
      2530(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          a.MooMoo.emit("setPlayerTeam", t),
            a.MooMoo.emit("setplayerteam", t),
            a.MooMoo.emit("st", t);
        };
      },
      8353(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366),
          r = o(8595),
          i = o(4218),
          n = o(3044),
          s = o(420),
          l = o(8101),
          c = o(5088),
          d = o(3296),
          u = o(3269),
          f = o(8106);
        t.default = function e(t) {
          let o = t[0];
          (a.MooMoo.myPlayer = {}),
            (a.MooMoo.myPlayer.sid = o),
            (a.MooMoo.myPlayer.place = r.default),
            (a.MooMoo.myPlayer.chat = i.default),
            (a.MooMoo.myPlayer.hit = n.default),
            (a.MooMoo.myPlayer.equipHat = s.default),
            (a.MooMoo.myPlayer.equipAccessory = l.default),
            (a.MooMoo.myPlayer.unequipHat = c.default),
            (a.MooMoo.myPlayer.unequipAccessory = d.default),
            (a.MooMoo.myPlayer.buyHat = u.default),
            (a.MooMoo.myPlayer.buyAccessory = f.default),
            (a.MooMoo.vars.gameLoaded = !0),
            a.MooMoo.emit("gameLoad"),
            a.MooMoo.emit("setupGame", t),
            a.MooMoo.emit("setupgame", t),
            a.MooMoo.emit("1", t),
            a.MooMoo.didInit ||
              (a.MooMoo.onGameLoad && a.MooMoo.onGameLoad(),
              (a.MooMoo.didInit = !0));
        };
      },
      5701(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          a.MooMoo.emit("shootTurret", t),
            a.MooMoo.emit("shootturret", t),
            a.MooMoo.emit("sp", t);
        };
      },
      5718(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          a.MooMoo.emit("showText", t),
            a.MooMoo.emit("showtext", t),
            a.MooMoo.emit("t", t);
        };
      },
      1836(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          a.MooMoo.emit("updateAge", t),
            a.MooMoo.emit("updateage", t),
            a.MooMoo.emit("15", t);
        };
      },
      9289(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          let o = t[0],
            r = t[1],
            i = a.MooMoo.GamePlayerManager.getPlayerBySid(o);
          i && (i.health = r),
            a.MooMoo.emit("updateHealth", t),
            a.MooMoo.emit("updatehealth", t),
            a.MooMoo.emit("h", t);
        };
      },
      657(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          a.MooMoo.emit("updateItemCounts", t),
            a.MooMoo.emit("updateitemcounts", t),
            a.MooMoo.emit("14", t);
        };
      },
      9971(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          a.MooMoo.emit("updateItems", t),
            a.MooMoo.emit("updateitems", t),
            a.MooMoo.emit("17", t);
        };
      },
      2862(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          let o = t[0];
          a.MooMoo.LeaderboardManager.updateLeaderboard(o),
            a.MooMoo.emit("updateLeaderboard", t),
            a.MooMoo.emit("updateleaderboard", t),
            a.MooMoo.emit("5", t);
        };
      },
      1487(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          a.MooMoo.emit("updateMinimap", t),
            a.MooMoo.emit("updateminimap", t),
            a.MooMoo.emit("mm", t);
        };
      },
      7864(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          let o = t[0],
            r = t[1],
            i = a.MooMoo.myPlayer.resources;
          (i[o] = r),
            (a.MooMoo.myPlayer.resources = i),
            a.MooMoo.emit("updatePlayerValue", t),
            a.MooMoo.emit("updateplayervalue", t),
            a.MooMoo.emit("9", t);
        };
      },
      8351(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.updateHookPosition = void 0);
        let a = o(627),
          r = o(3748),
          i = o(366),
          n = o(9347),
          s = o(7809);
        (t.updateHookPosition = function e(t) {
          if (
            this instanceof n.default ||
            this instanceof s.default ||
            this.isAI ||
            !this.id
          );
          else {
            let o = i.MooMoo.GamePlayerManager.getPlayerBySid(this.sid);
            o &&
              ((o.x = t),
              (o.y = this.y),
              i.MooMoo.onPositionUpdate && i.MooMoo.onPositionUpdate(o)),
              i.MooMoo.GamePlayerManager.updatePlayer(this.sid, this);
          }
        }),
          (t.default = function e(t) {
            let o = t[0],
              s = (0, a.default)(o, 13);
            i.MooMoo.ActivePlayerManager.clearPlayers(),
              s.forEach((e) => {
                let t = i.MooMoo.GamePlayerManager.getPlayerBySid(e[0]);
                t || (((t = new n.default(e[0])).x = e[1]), (t.y = e[2])),
                  (t.sid = e[0]),
                  (t.dir = e[3]),
                  (t.buildIndex = e[4]),
                  (t.weaponIndex = e[5]),
                  (t.weaponVariant = e[6]),
                  (t.team = e[7]),
                  (t.isLeader = e[8]),
                  (t.skinIndex = e[9]),
                  (t.tailIndex = e[10]),
                  (t.iconIndex = e[11]),
                  (t.zIndex = e[12]),
                  i.MooMoo.ActivePlayerManager.addPlayer(t),
                  t.sid === i.MooMoo.myPlayer.sid &&
                    Object.assign(i.MooMoo.myPlayer, t),
                  (0, r.default)();
              }),
              i.MooMoo.emit("updatePlayers", o),
              i.MooMoo.emit("updateplayers", o),
              i.MooMoo.emit("33", o);
          });
      },
      2798(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          a.MooMoo.emit("updateStoreItems", t),
            a.MooMoo.emit("updatestoreitems", t),
            a.MooMoo.emit("us", t);
        };
      },
      3226(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          a.MooMoo.emit("updateUpgrades", t),
            a.MooMoo.emit("updateupgrades", t),
            a.MooMoo.emit("16", t);
        };
      },
      2656(e, t, o) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        let a = o(366);
        t.default = function e(t) {
          a.MooMoo.emit("wiggleGameObject", t),
            a.MooMoo.emit("wigglegameobject", t),
            a.MooMoo.emit("8", t);
        };
      },
      2298(e, t, o) {
        "use strict";

        o.r(t),
          o.d(t, {
            default: () => a,
          });
        let a = function (e) {
          let t = 0;
          if (
            (e instanceof ArrayBuffer && (e = new Uint8Array(e)),
            "object" != typeof e || void 0 === e.length)
          )
            throw Error(
              "Invalid argument type: Expected a byte array (Array or Uint8Array) to deserialize."
            );
          if (!e.length)
            throw Error(
              "Invalid argument: The byte array to deserialize is empty."
            );
          e instanceof Uint8Array || (e = new Uint8Array(e));
          let o = a();
          return e.length, o;
          function a() {
            let o = e[t++];
            if (o >= 0 && o <= 127) return o;
            if (o >= 128 && o <= 143) return l(o - 128);
            if (o >= 144 && o <= 159) return c(o - 144);
            if (o >= 160 && o <= 191) return d(o - 160);
            if (192 === o) return null;
            if (193 === o) throw Error("Invalid byte code 0xc1 found.");
            if (194 === o) return !1;
            if (195 === o) return !0;
            if (196 === o) return s(-1, 1);
            if (197 === o) return s(-1, 2);
            if (198 === o) return s(-1, 4);
            if (199 === o) return u(-1, 1);
            if (200 === o) return u(-1, 2);
            if (201 === o) return u(-1, 4);
            if (202 === o) return n(4);
            if (203 === o) return n(8);
            if (204 === o) return i(1);
            if (205 === o) return i(2);
            if (206 === o) return i(4);
            if (207 === o) return i(8);
            if (208 === o) return r(1);
            if (209 === o) return r(2);
            if (210 === o) return r(4);
            if (211 === o) return r(8);
            if (212 === o) return u(1);
            if (213 === o) return u(2);
            if (214 === o) return u(4);
            if (215 === o) return u(8);
            if (216 === o) return u(16);
            if (217 === o) return d(-1, 1);
            if (218 === o) return d(-1, 2);
            if (219 === o) return d(-1, 4);
            if (220 === o) return c(-1, 2);
            if (221 === o) return c(-1, 4);
            if (222 === o) return l(-1, 2);
            if (223 === o) return l(-1, 4);
            if (o >= 224 && o <= 255) return o - 256;
            throw (
              (console.debug("msgpack array:", e),
              Error(
                "Invalid byte value '" +
                  o +
                  "' at index " +
                  (t - 1) +
                  " in the MessagePack binary data (length " +
                  e.length +
                  "): Expecting a range of 0 to 255. This is not a byte array."
              ))
            );
          }
          function r(o) {
            let a = 0,
              r = !0;
            for (; o-- > 0; )
              if (r) {
                let i = e[t++];
                (a += 127 & i), 128 & i && (a -= 128), (r = !1);
              } else (a *= 256), (a += e[t++]);
            return a;
          }
          function i(o) {
            let a = 0;
            for (; o-- > 0; ) (a *= 256), (a += e[t++]);
            return a;
          }
          function n(o) {
            let a = new DataView(e.buffer, t, o);
            return (
              (t += o),
              4 === o
                ? a.getFloat32(0, !1)
                : 8 === o
                ? a.getFloat64(0, !1)
                : void 0
            );
          }
          function s(o, a) {
            o < 0 && (o = i(a));
            let r = e.subarray(t, t + o);
            return (t += o), r;
          }
          function l(e, t) {
            e < 0 && (e = i(t));
            let o = {};
            for (; e-- > 0; ) o[a()] = a();
            return o;
          }
          function c(e, t) {
            e < 0 && (e = i(t));
            let o = [];
            for (; e-- > 0; ) o.push(a());
            return o;
          }
          function d(o, a) {
            o < 0 && (o = i(a));
            let r = t;
            return (
              (t += o),
              (function (e, t, o) {
                let a = t,
                  r = "";
                for (o += t; a < o; ) {
                  let i = e[a++];
                  if (i > 127) {
                    if (i > 191 && i < 224) {
                      if (a >= o)
                        throw Error("UTF-8 decode: incomplete 2-byte sequence");
                      i = ((31 & i) << 6) | (63 & e[a++]);
                    } else if (i > 223 && i < 240) {
                      if (a + 1 >= o)
                        throw Error("UTF-8 decode: incomplete 3-byte sequence");
                      i =
                        ((15 & i) << 12) | ((63 & e[a++]) << 6) | (63 & e[a++]);
                    } else {
                      if (!(i > 239 && i < 248))
                        throw Error(
                          "UTF-8 decode: unknown multibyte start 0x" +
                            i.toString(16) +
                            " at index " +
                            (a - 1)
                        );
                      if (a + 2 >= o)
                        throw Error("UTF-8 decode: incomplete 4-byte sequence");
                      i =
                        ((7 & i) << 18) |
                        ((63 & e[a++]) << 12) |
                        ((63 & e[a++]) << 6) |
                        (63 & e[a++]);
                    }
                  }
                  if (i <= 65535) r += String.fromCharCode(i);
                  else {
                    if (!(i <= 1114111))
                      throw Error(
                        "UTF-8 decode: code point 0x" +
                          i.toString(16) +
                          " exceeds UTF-16 reach"
                      );
                    (i -= 65536),
                      (r += String.fromCharCode((i >> 10) | 55296)),
                      (r += String.fromCharCode((1023 & i) | 56320));
                  }
                }
                return r;
              })(e, r, o)
            );
          }
          function u(e, o) {
            e < 0 && (e = i(o));
            let a = i(1),
              n = s(e);
            return 255 === a
              ? (function (e) {
                  if (4 === e.length) {
                    let o =
                      ((e[0] << 24) >>> 0) +
                      ((e[1] << 16) >>> 0) +
                      ((e[2] << 8) >>> 0) +
                      e[3];
                    return new Date(1e3 * o);
                  }
                  if (8 === e.length) {
                    let a =
                        ((e[0] << 22) >>> 0) +
                        ((e[1] << 14) >>> 0) +
                        ((e[2] << 6) >>> 0) +
                        (e[3] >>> 2),
                      i =
                        (3 & e[3]) * 4294967296 +
                        ((e[4] << 24) >>> 0) +
                        ((e[5] << 16) >>> 0) +
                        ((e[6] << 8) >>> 0) +
                        e[7];
                    return new Date(1e3 * i + a / 1e6);
                  }
                  if (12 === e.length) {
                    let n =
                      ((e[0] << 24) >>> 0) +
                      ((e[1] << 16) >>> 0) +
                      ((e[2] << 8) >>> 0) +
                      e[3];
                    t -= 8;
                    let s = r(8);
                    return new Date(1e3 * s + n / 1e6);
                  }
                  throw Error("Invalid data length for a date value.");
                })(n)
              : {
                  type: a,
                  data: n,
                };
          }
        };
      },
      112(e, t, o) {
        "use strict";

        o.r(t),
          o.d(t, {
            default: () => a,
          });
        let a = function (e) {
          let t,
            o,
            a = new Uint8Array(128),
            r = 0;
          return i(e), a.subarray(0, r);
          function i(e) {
            var a, r, u;
            switch (typeof e) {
              case "undefined":
                n();
                break;
              case "boolean":
                l((a = e) ? 195 : 194);
                break;
              case "number":
                !(function (e) {
                  if (isFinite(e) && Math.floor(e) === e) {
                    if (e >= 0 && e <= 127) l(e);
                    else if (e < 0 && e >= -32) l(e);
                    else if (e > 0 && e <= 255) c([204, e]);
                    else if (e >= -128 && e <= 127) c([208, e]);
                    else if (e > 0 && e <= 65535) c([205, e >>> 8, e]);
                    else if (e >= -32768 && e <= 32767) c([209, e >>> 8, e]);
                    else if (e > 0 && e <= 4294967295)
                      c([206, e >>> 24, e >>> 16, e >>> 8, e]);
                    else if (e >= -2147483648 && e <= 2147483647)
                      c([210, e >>> 24, e >>> 16, e >>> 8, e]);
                    else if (e > 0 && e <= 18446744073709552e3) {
                      let a = e / 4294967296,
                        r = e % 4294967296;
                      c([
                        211,
                        a >>> 24,
                        a >>> 16,
                        a >>> 8,
                        a,
                        r >>> 24,
                        r >>> 16,
                        r >>> 8,
                        r,
                      ]);
                    } else
                      e >= 0x7fffffffffffffff && e <= 0x7fffffffffffffff
                        ? (l(211), d(e))
                        : c(
                            e < 0
                              ? [211, 128, 0, 0, 0, 0, 0, 0, 0]
                              : [207, 255, 255, 255, 255, 255, 255, 255, 255]
                          );
                  } else
                    o || ((t = new ArrayBuffer(8)), (o = new DataView(t))),
                      o.setFloat64(0, e),
                      l(203),
                      c(new Uint8Array(t));
                })(e);
                break;
              case "string":
                let f, M;
                (M = (f = (function (e) {
                  let t = !0,
                    o = e.length;
                  for (let a = 0; a < o; a++)
                    if (e.charCodeAt(a) > 127) {
                      t = !1;
                      break;
                    }
                  let r = 0,
                    i = new Uint8Array(e.length * (t ? 1 : 4));
                  for (let n = 0; n !== o; n++) {
                    let s = e.charCodeAt(n);
                    if (s < 128) i[r++] = s;
                    else {
                      if (s < 2048) i[r++] = (s >> 6) | 192;
                      else {
                        if (s > 55295 && s < 56320) {
                          if (++n >= o)
                            throw Error(
                              "UTF-8 encode: incomplete surrogate pair"
                            );
                          let l = e.charCodeAt(n);
                          if (l < 56320 || l > 57343)
                            throw Error(
                              "UTF-8 encode: second surrogate character 0x" +
                                l.toString(16) +
                                " at index " +
                                n +
                                " out of range"
                            );
                          (s = 65536 + ((1023 & s) << 10) + (1023 & l)),
                            (i[r++] = (s >> 18) | 240),
                            (i[r++] = ((s >> 12) & 63) | 128);
                        } else i[r++] = (s >> 12) | 224;
                        i[r++] = ((s >> 6) & 63) | 128;
                      }
                      i[r++] = (63 & s) | 128;
                    }
                  }
                  return t ? i : i.subarray(0, r);
                })((r = e))).length) <= 31
                  ? l(160 + M)
                  : c(
                      M <= 255
                        ? [217, M]
                        : M <= 65535
                        ? [218, M >>> 8, M]
                        : [219, M >>> 24, M >>> 16, M >>> 8, M]
                    ),
                  c(f);
                break;
              case "object":
                let $;
                null === e
                  ? n()
                  : e instanceof Date
                  ? (function (e) {
                      let t = e.getTime() / 1e3;
                      if (0 === e.getMilliseconds() && t >= 0 && t < 4294967296)
                        c([214, 255, t >>> 24, t >>> 16, t >>> 8, t]);
                      else if (t >= 0 && t < 17179869184) {
                        let o = 1e6 * e.getMilliseconds();
                        c([
                          215,
                          255,
                          o >>> 22,
                          o >>> 14,
                          o >>> 6,
                          ((o << 2) >>> 0) | (t / 4294967296),
                          t >>> 24,
                          t >>> 16,
                          t >>> 8,
                          t,
                        ]);
                      } else {
                        let a = 1e6 * e.getMilliseconds();
                        c([199, 12, 255, a >>> 24, a >>> 16, a >>> 8, a]), d(t);
                      }
                    })(e)
                  : Array.isArray(e)
                  ? s(e)
                  : e instanceof Uint8Array || e instanceof Uint8ClampedArray
                  ? (c(
                      ($ = (u = e).length) <= 15
                        ? [196, $]
                        : $ <= 65535
                        ? [197, $ >>> 8, $]
                        : [198, $ >>> 24, $ >>> 16, $ >>> 8, $]
                    ),
                    c(u))
                  : e instanceof Int8Array ||
                    e instanceof Int16Array ||
                    e instanceof Uint16Array ||
                    e instanceof Int32Array ||
                    e instanceof Uint32Array ||
                    e instanceof Float32Array ||
                    e instanceof Float64Array
                  ? s(e)
                  : (function (e) {
                      let t = 0;
                      for (let o in e) t++;
                      for (let a in (t <= 15
                        ? l(128 + t)
                        : c(
                            t <= 65535
                              ? [222, t >>> 8, t]
                              : [223, t >>> 24, t >>> 16, t >>> 8, t]
                          ),
                      e))
                        i(a), i(e[a]);
                    })(e);
            }
          }
          function n(e) {
            l(192);
          }
          function s(e) {
            let t = e.length;
            t <= 15
              ? l(144 + t)
              : c(
                  t <= 65535
                    ? [220, t >>> 8, t]
                    : [221, t >>> 24, t >>> 16, t >>> 8, t]
                );
            for (let o = 0; o < t; o++) i(e[o]);
          }
          function l(e) {
            if (a.length < r + 1) {
              let t = 2 * a.length;
              for (; t < r + 1; ) t *= 2;
              let o = new Uint8Array(t);
              o.set(a), (a = o);
            }
            (a[r] = e), r++;
          }
          function c(e) {
            if (a.length < r + e.length) {
              let t = 2 * a.length;
              for (; t < r + e.length; ) t *= 2;
              let o = new Uint8Array(t);
              o.set(a), (a = o);
            }
            a.set(e, r), (r += e.length);
          }
          function d(e) {
            let t, o;
            e >= 0
              ? ((t = e / 4294967296), (o = e % 4294967296))
              : ((t = ~(t = Math.abs(++e) / 4294967296)),
                (o = ~(o = Math.abs(e) % 4294967296))),
              c([
                t >>> 24,
                t >>> 16,
                t >>> 8,
                t,
                o >>> 24,
                o >>> 16,
                o >>> 8,
                o,
              ]);
          }
        };
      },
      5337(e, t, o) {
        "use strict";

        o.r(t),
          o.d(t, {
            default: () => c,
          });
        var a = o(366),
          r = o(8214),
          i = o(1542),
          n = o(5613),
          s = o.n(n);
        o(4572);
        var l = o(6616);
        let c = function e() {
          a.MooMoo.scriptAPI = {
            parse: r.Z,
            validate: i.Z,
            tokenize: s(),
            execute: l.Z,
          };
        };
      },
    },
    t = {};
  function o(a) {
    var r = t[a];
    if (void 0 !== r) return r.exports;
    var i = (t[a] = {
      exports: {},
    });
    return e[a].call(i.exports, i, i.exports, o), i.exports;
  }
  (o.n = (e) => {
    var t = e && e.__esModule ? () => e.default : () => e;
    return (
      o.d(t, {
        a: t,
      }),
      t
    );
  }),
    (o.d = (e, t) => {
      for (var a in t)
        o.o(t, a) &&
          !o.o(e, a) &&
          Object.defineProperty(e, a, {
            enumerable: !0,
            get: t[a],
          });
    }),
    (o.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
    (o.r = (e) => {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, {
          value: "Module",
        }),
        Object.defineProperty(e, "__esModule", {
          value: !0,
        });
    });
  var a = o(366);
})();
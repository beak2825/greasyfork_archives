// ==UserScript==
// @name         pp直连vip
// @namespace    https://github.com/dadaewqq/fun
// @version      1.3
// @description  私用哈
// @author       dadaewqq
// @match        https://www.ppzhilian.com/*
// @match        http://www.ppzhilian.com/*
// @icon         https://www.ppzhilian.com/favicon.ico
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/455593/pp%E7%9B%B4%E8%BF%9Evip.user.js
// @updateURL https://update.greasyfork.org/scripts/455593/pp%E7%9B%B4%E8%BF%9Evip.meta.js
// ==/UserScript==

(function () {
  "use strict";

  (() => {
    var e = {
        31210: (e, t, r) => {
          "use strict";
          r(24124), r(67280), r(65363), r(10071);
          var i = r(98880),
            o = r(99592),
            n = r(83673);
          function s(e, t, r, i, o, s) {
            const a = (0, n.up)("router-view");
            return (0, n.wg)(), (0, n.j4)(a);
          }
          r(66016);
          var a = r(95911),
            l = r(87035),
            c = r(65454),
            d = r(5676);
          const h = {
            name: "App",
            data() {
              return { remotePeer: "" };
            },
            created() {
              this.init();
            },
            mounted() {},
            beforeUnmount() {
              (0, c.Z2)();
            },
            methods: {
              init() {
                (0, c.V$)();
                const e = new URLSearchParams(window.location.search),
                  t = (this.remotePeer = e.get("r") || null);
                this.$store.commit("peer/addRemotePeer", t), this.$store.dispatch("peer/newLocalPeer");
                const r = (0, d.Y2)();
                r && r === WebSocket.OPEN ? this.linkTo() : l.YB.once("registered", this.linkTo);
              },
              async linkTo() {
                this.remotePeer && (0, a.W0)(this.remotePeer);
              },
            },
          };
          var u = r(74260);
          const p = (0, u.Z)(h, [["render", s]]),
            A = p;
          var m = r(37451),
            f = r(28339),
            g = r(11713);
          function w() {
            const e = f.PO,
              t = (0, f.p7)({ scrollBehavior: () => ({ left: 0, top: 0 }), routes: g.Z, history: e("/") });
            return (window.appRouter = t), t;
          }
          async function y(e, t) {
            const i = "function" === typeof m["default"] ? await (0, m["default"])({}) : m["default"],
              { storeKey: n } = await Promise.resolve().then(r.bind(r, 37451)),
              s = "function" === typeof w ? await w({ store: i }) : w;
            i.$router = s;
            const a = e(A);
            return a.use(o.Z, t), { app: a, store: i, storeKey: n, router: s };
          }
          var v = r(88880),
            b = r(64434),
            S = r(11417),
            P = r(98416),
            C = r(12471);
          const k = { config: {}, lang: v.Z, plugins: { Notify: b.Z, Dialog: S.Z, AppFullscreen: P.Z, Cookies: C.Z } };
          var I = r(40019);
          const T = "/";
          async function D({ app: e, router: t, store: r, storeKey: i }, o) {
            let n = !1;
            const s = (e) => {
                try {
                  return t.resolve(e).href;
                } catch (r) {}
                return Object(e) === e ? null : e;
              },
              a = (e) => {
                if (((n = !0), "string" === typeof e && /^https?:\/\//.test(e))) return void (window.location.href = e);
                const t = s(e);
                null !== t && (window.location.href = t);
              },
              l = window.location.href.replace(window.location.origin, "");
            for (let d = 0; !1 === n && d < o.length; d++)
              try {
                await o[d]({ app: e, router: t, store: r, ssrContext: null, redirect: a, urlPath: l, publicPath: T });
              } catch (c) {
                return c && c.url ? void a(c.url) : void I.error("[Quasar] boot error:", c);
              }
            !0 !== n && (e.use(t), e.use(r, i), e.mount("#q-app"));
          }
          y(i.ri, k).then((e) =>
            Promise.all([Promise.resolve().then(r.bind(r, 82723)), Promise.resolve().then(r.bind(r, 67963)), Promise.resolve().then(r.bind(r, 47867)), Promise.resolve().then(r.bind(r, 26388)), Promise.resolve().then(r.bind(r, 73755))]).then((t) => {
              const r = t.map((e) => e.default).filter((e) => "function" === typeof e);
              D(e, r);
            })
          );
        },
        65454: (e, t, r) => {
          "use strict";
          r.d(t, { Z2: () => ke, WH: () => Ne, V$: () => Ce });
          r(65663), r(24124), r(10071), r(66016), r(67280), r(65363), r(43610), r(37902), r(10107);
          var i = r(64434),
            o = r(44688),
            n = r(12471),
            s = r(26388),
            a = r(47867),
            l = r(77597),
            c = r(95911),
            d = r(56999),
            h = r(87035);
          const u = 30;
          function p(e) {
            const t = n.Z.get("_ss");
            t || n.Z.set("_ss", e, { expires: u });
          }
          var A = r(12393),
            m = r(88322),
            f = r(11713),
            g = r(9802),
            w = r(23503),
            y = (r(10229), r(4585)),
            v = r(87243),
            b = r(49110),
            S = (r(76701), r(82031), r(73060)),
            P = r(81007),
            C = r(14244),
            k = r(40019);
          const I = r(99349)("uploadStream"),
            { Writable: T } = r(30775),
            D = 256,
            E = 3 * S.E,
            R = 1e3;
          class B extends T {
            constructor(e, t) {
              if ((super(Object.assign({ highWaterMark: E, emitClose: !0 }, t)), (this.startTime = Date.now()), (this.id = Math.random().toString().slice(-6)), (this.uploadFile = t.uploadFile || null), (this.localHandler = t.localHandler), !this.uploadFile)) throw new Error("no upload file");
              (this.fileId = this.uploadFile.id || 0),
                (this.fileName = this.uploadFile.name || ""),
                (this.chunkSize = t.chunkSize || S.E),
                (this.fileStart = t.fileStart || 0),
                (this.startOffset = t.startOffset || this.fileStart / this.chunkSize || 0),
                (this.offset = this.startOffset || 0),
                (this.sendOffset = this.startOffset || 0),
                (this.totalSize = this.uploadFile.size || 0),
                (this.totalChunks = Math.ceil(this.totalSize / this.chunkSize)),
                (this._subChunks = new P.Z({})),
                (this.readFunc = t.readFunc || null),
                (this.reSendQueue = []),
                (this._subChunksWaterMark = D),
                (this._sendOffsets = new Set()),
                (this._handledChunks = 0),
                (this.callback = e),
                (this.fileType = this.uploadFile.type || ""),
                (this.state = "open"),
                (this._callback = null),
                (this._readResult = !0),
                (this.localPeer = (0, l.$D)()),
                (this.remotePeer = t.remotePeer),
                (this.remoteHandler = t.remoteHandler || null),
                (this.progress = 0),
                (this.speed = 0),
                (this.speedOn = !1 !== t.speedOn),
                (this._speedMonitor = null),
                (this.readedChunks = []),
                (this.sendComplete = !1),
                (this.paused = !1),
                (this._pauseRead = !1),
                (this._writeFinished = !1),
                (this._ended = !1),
                (this.destroyed = !1),
                (this.waitingData = !1),
                (this.backPressure = !1),
                (this.channelInfo = { type: "" }),
                (this.uploadChannel = null),
                void 0 !== t.deflated ? (this.deflated = t.deflated) : (this.deflated = !1),
                this.deflated && I("uploadStream deflated is true"),
                this.speedOn && this.startSpeedMonitor(),
                this.on("data", (e) => {
                  this.uploadChannel && this.uploadChannel.send(e);
                }),
                this.on("finish", () => {
                  I("----- upload Finish ----------"), (this._writeFinished = !0), this.read();
                }),
                this.on("close", (e) => {
                  I("----- uploadStream close ----------"), e && k.error("uploadStream close with error", e), this.stopSpeedMonitor();
                  const t = B.list.indexOf(this);
                  -1 !== t && B.list.splice(t, 1), this.uploadChannel && this.uploadChannel.destroy();
                }).on("error", (e) => {
                  k.error("got a uploadStream error", e);
                }),
                B.list.push(this),
                this.setUploadChannel();
            }
            setUploadChannel() {
              (this.uploadChannel = ge(this.remotePeer, this)), (this.channelInfo = this.uploadChannel.getInfo());
            }
            _write(e, t, r) {
              (0, S.Vl)(e).forEach((e) => {
                this.deflated && (e = (0, S.Wt)(e));
                const t = (0, S.cv)({ localPeer: this.localPeer, localHandler: this.localHandler, remotePeer: this.remotePeer, remoteHandler: this.remoteHandler, serviceType: l.V9.data, intTag: this.offset, chunk: e });
                this._subChunks.push(t), this.offset++;
              }),
                (this.state = "open"),
                this.waitingData && !this.paused && this.read(),
                this._subChunks.length > this._subChunksWaterMark ? (this._callback = r) : r();
            }
            onEncodedChunkFromWorker(e) {
              this._handledChunks++, this._subChunks.push(e), this.onNewChunk();
            }
            onNewChunk() {
              this.waitingData && 1 === this._subChunks.length && !this.paused && this.read();
            }
            _read(e) {
              if (this.destroyed || !this._subChunks) return;
              const t = this._subChunks.shift();
              if ((t ? this.push(t) : this._writeFinished && this.sendOffset >= this.totalChunks && (I("read all data"), this.close()), this._callback && !this._writeFinished && this.offset - this.sendOffset < this._subChunksWaterMark)) {
                const e = this._callback;
                (this._callback = null), e();
              }
            }
            sendCallback(e) {
              if (!e) return;
              this.readedChunks.push(e);
              const t = (0, S.W6)(e);
              if (((0, S.Ql)(e), this._sendOffsets.has(t))) return void I("send data again, offset: %d", t);
              this.sendOffset++, this._sendOffsets.add(t);
              const r = this.startOffset + this.sendOffset,
                i = r >= this.totalChunks ? 99 : Math.floor((r / this.totalChunks) * 100);
              100 !== this.progress && this.progress !== i && ((this.progress = i), this.emit("progress", i), I("progress:", i));
            }
            fetchSlice(e) {
              if ((I(this.fileName + ": fetch slice data", e), !this.uploadFile)) return void k.error("no uploadFile");
              const t = e * this.chunkSize,
                r = (e + 1) * this.chunkSize;
              this.uploadFile
                .fetchSlice(t, r)
                .then((t) => {
                  t = C.Buffer.from(t);
                  const r = 0 !== e ? null : { type: "file", id: this.id, fileId: this.fileId || "0", fileName: this.fileName, offset: e, totalSize: this.totalSize, chunkSize: C.Buffer.byteLength(t), fileType: this.fileType };
                  this.deflated && (t = (0, S.Wt)(t));
                  const i = (0, S.cv)({ localPeer: this.localPeer, localHandler: this.localHandler, remotePeer: this.remotePeer, remoteHandler: this.remoteHandler, serviceType: l.V9.data, intTag: e, message: r, chunk: t });
                  this.emit("fetchSlice", e, i), this._subChunks.unshift(i), this.read();
                })
                .catch((e) => {
                  k.error("fetchSlice error:", e), this.abort(e);
                });
            }
            readable() {
              return !this.paused && !this._pauseRead && !this.destroyed;
            }
            read() {
              if (this.paused || this._pauseRead || !this._subChunks) return;
              const e = this._subChunks.shift();
              if (e) (this.waitingData = !1), this.readFunc ? this.readFunc(e) : this.emit("data", e), this.triggerWriteCallback();
              else if (((this.waitingData = !0), this._ended));
              else if (this._writeFinished && this.sendOffset >= this.totalChunks) I("read all data"), this.ended();
              else if ((I("waiting for read"), this._callback)) {
                I("trigger callback for new data");
                const e = this._callback;
                (this._callback = null), e();
              }
            }
            triggerWriteCallback() {
              if (this.offset - this.sendOffset < this._subChunksWaterMark && this._callback && !this._writeFinished) {
                const e = this._callback;
                (this._callback = null), e();
              }
            }
            start() {
              this.read();
            }
            pauseRead() {}
            pauseMe() {
              (this._pauseRead = !0), this.pauseRead(), this.emit("paused");
            }
            resumeRead() {
              this.destroyed || this.read();
            }
            resumeMe() {
              this.destroyed || ((this._pauseRead = !1), this.resumeRead(), this.emit("resumed"));
            }
            ended() {
              I("reading ended"), this.emit("end"), (this._ended = !0);
            }
            completed() {
              I("completed"), this.emit("complete"), this.destroyed || (I("completed progress"), (this.progress = 100), this.emit("progress", 100), (this.reSendQueue = []), this.destroy());
            }
            startSpeedMonitor() {
              I("startSpeedMonitor"),
                (this._speedMonitor = setInterval(() => {
                  let e = 0;
                  this.readedChunks.length > 0 && (e = C.Buffer.byteLength(this.readedChunks[0]) * this.readedChunks.length), (this.readedChunks = []);
                  const t = Math.round((1e3 * e) / R);
                  this.speed !== t && ((this.speed = t), this.emit("speed", this.speed));
                }, R));
            }
            stopSpeedMonitor() {
              this._speedMonitor && (this.emit("speed", 0), clearInterval(this._speedMonitor));
            }
            abort(e) {
              if (this.destroyed) return;
              this._subChunks = null;
              const t = e || new Error("abort");
              this.emit("abort", e), this.destroy(t);
            }
            _destroy(e, t) {
              I("upload destroy"),
                this.stopSpeedMonitor(),
                this.uploadChannel && this.uploadChannel.destroy(),
                (this.working = !1),
                (this._subChunks = null),
                this._sendOffsets.clear(),
                (this.readedChunks = []),
                this.localHandler && (0, h.vS)(this.localHandler),
                this.encodeWorker && this.encodeWorker.terminate();
              const r = this;
              T.prototype._destroy.call(this, e, function (e) {
                t && "function" === typeof t && t(e), r.emit("close", e);
              });
            }
          }
          function x() {
            return I;
          }
          B.list = [];
          var F = r(40019);
          const N = r(99349)("FileStreamReader.js"),
            { Readable: O } = r(30775);
          class M extends O {
            constructor(e, t = { emitClose: !0 }) {
              super(t), (this._offset = t.start || 0), (this._ready = !1), (this._file = e), (this._size = e.size), (this._chunkSize = t.chunkSize || 65536);
              const r = new FileReader();
              (r.onload = () => {
                this.push(C.Buffer.from(r.result));
              }),
                (r.onerror = () => {
                  this.emit("error", r.error);
                }),
                (this.reader = r),
                this._generateHeaderBlocks(e, t, (e, t) => {
                  if (e) return F.error("_generateHeaderBlocks error:", e), this.emit("error", e);
                  Array.isArray(t) && t.forEach((e) => this.push(e)), (this._ready = !0), this.emit("_ready");
                });
            }
            _generateHeaderBlocks(e, t, r) {
              r(null, []);
            }
            async _read() {
              if (!this._ready) return void this.once("_ready", this._read.bind(this));
              const e = this._offset;
              let t = this._offset + this._chunkSize;
              if ((t > this._size && (t = this._size), e >= this._size)) this.destroy();
              else
                try {
                  const r = await this._file.slice(e, t);
                  r instanceof Blob ? this.reader.readAsArrayBuffer(r) : this.push(C.Buffer.from(r)), (this._offset = t);
                } catch (r) {
                  N("read data error:", r), this.emit("error", r);
                }
            }
            _destroy() {
              if ((N("call _destroy"), (this._file = null), this.reader)) {
                (this.reader.onload = null), (this.reader.onerror = null);
                try {
                  this.reader.abort();
                } catch (e) {
                  N("destroy error:", e);
                }
              }
              (this.reader = null), this.push(null);
            }
          }
          var U = r(78999),
            z = r(63764);
          const H = r(99349)("UploadSendingControl.js"),
            _ = 3e3;
          class L {
            constructor(e) {
              (this.sendingMap = new Array(e.size || void 0)), (this.maxDelay = e.maxDelay || _), (this.offset = 0), (this.minOffset = -1), (this.maxOffset = -1), (this.latestDelay = 0), (this.deltaThreshold = 50), (this.callback = null), (this.callbackTimeout = this.maxDelay / 2);
            }
            sended(e, t) {
              return (this.offset = e), (this.latestDelay = t), e > this.minOffset && ((this.sendingMap[e] = 1), e > this.maxOffset && (this.maxOffset = e), e - this.minOffset === 1 && this.changeMinOffset()), this.canSend();
            }
            setCallback(e) {
              this.callback ||
                (H("setCallback for waiting, time:", this.callbackTimeout),
                (this.callback = e),
                setTimeout(() => {
                  if (this && this.callback) {
                    H("run callback");
                    const e = this.callback;
                    (this.callback = null), e();
                  }
                }, this.callbackTimeout));
            }
            changeMinOffset() {
              let e = this.minOffset + 1;
              while (this.sendingMap[e]) e++;
              this.minOffset = e - 1;
            }
            canSend() {
              return this.latestDelay < this.maxDelay;
            }
            setDeltaThreshold(e) {
              this.deltaThreshold = e;
            }
          }
          var W = r(85308),
            q = r(40019);
          const V = r(99349)("uploadChannelOfWebrtc.js"),
            j = 1,
            Q = 6;
          class Y extends W.y {
            constructor(e) {
              super(e),
                (this.type = "webrtc"),
                (this.p2p = Y.hasP2PChannel(this.remotePeer)),
                (this.minRTT = 0),
                (this.channelCount = j),
                (this.peerChannels = []),
                (this.peerChannelsSendData = new Map()),
                (this.sendingControl = new L({ size: this.uploadStream.totalChunks })),
                (this.isBuildingChannel = null);
              try {
                this.initUploadChannel();
              } catch (t) {
                q.error(t);
              }
            }
            get sendable() {
              return super.sendable && !!this.getSendableChannel();
            }
            getSendableChannel() {
              return this.peerChannels.find((e) => e.connected && e.sendable);
            }
            selectOnePeerChannel() {
              const e = this.getConnectedChannels();
              return 0 === e.length ? (this.setupNewPeerChannel(), null) : e.find((e) => e.sendable);
            }
            addToChannels(e) {
              V("addToChannels uid, _id:", e.uid, e.peer._id),
                this.peerChannels.push(e),
                this.addDrainEvent(e),
                1 === this.peerChannels.length && this.startUpload(),
                this.getConnectedChannels().length < this.channelCount &&
                  setTimeout(() => {
                    this.setupNewPeerChannel();
                  }, 200),
                W.y.scheduleNext(this.remotePeer);
            }
            getConnectedChannels() {
              return this.peerChannels.filter((e) => e.connected);
            }
            getChannelCountByRtt() {
              const e = Math.ceil(this.minRTT / 10);
              return Math.min(e, Q);
            }
            initUploadChannel() {
              this.initPeerChannels();
            }
            initPeerChannels() {
              const e = (0, A.tF)({ remotePeer: this.remotePeer, serviceType: l.V9.data });
              e.forEach((e) => {
                ("relay" === l.Ch.iceTransportPolicy && "relay" !== e.connectType) || (e.rtt && (this.minRTT = this.minRTT > 0 ? Math.min(e.rtt, this.minRTT) : e.rtt), this.p2p ? "relay" !== e.connectType && this.addToChannels(e) : this.addToChannels(e));
              }),
                V("channelCount for the file", this.channelCount),
                this.sendingControl.deltaThreshold < 10 * this.channelCount && this.sendingControl.setDeltaThreshold(10 * this.channelCount),
                this.peerChannels.length < this.channelCount && this.setupNewPeerChannel();
            }
            addDrainEvent(e) {
              0 === e.getListeners("drain").length &&
                e.on("drain", () => {
                  V("peerChannel on drain, schedule next"), W.y.scheduleNext(this.remotePeer);
                });
            }
            setupNewPeerChannel() {
              if (this.getConnectedChannels().length >= Q) return;
              if (this.isBuildingChannel && Date.now() - this.isBuildingChannel < 1e4) return;
              (this.isBuildingChannel = Date.now()), V("setupNewPeerChannel");
              const e = (0, A.m$)({ initiator: !0, remotePeer: this.remotePeer, serviceType: l.V9.data });
              e &&
                e.once("peerConnect", () => {
                  (this.isBuildingChannel = null),
                    this.isUploadStreamWorking()
                      ? this.p2p && "relay" !== l.Ch.iceTransportPolicy
                        ? "relay" === e.connectType
                          ? (V("can build p2p , but get a relay now, discard it"), e.destroy(new Error("cause by: need p2p channel but got relay")))
                          : this.addToChannels(e)
                        : ("relay" !== e.connectType && (this.p2p = !0), this.addToChannels(e))
                      : W.y.scheduleNext(this.remotePeer);
                });
            }
            sendChunk(e, t, r = () => {}) {
              e.peer.write(t, null, r);
            }
            destroy() {
              V("destroy uploadChannel"), this.peerChannels.length > 0 && this.peerChannels.splice(0, this.peerChannels.length), this.peerChannelsSendData.clear(), (this.sendingControl = void 0), super.destroy();
            }
          }
          Y.hasP2PChannel = function (e) {
            const t = A.Jk.filter((t) => t.remotePeer === e && t.connected);
            for (let r = 0; r < t.length; r++) if ("relay" !== t[r].connectType) return !0;
            return !1;
          };
          r(17965);
          var G = r(12144),
            Z = r(40019);
          const J = r(99349)("uploadChannelOfWebsocket.js"),
            K = "ws/relay",
            X = 1,
            $ = 3;
          class ee extends W.y {
            constructor(e) {
              super(e), (this.type = "websocket"), (this.p2p = !1), (this.server = (0, W.S)()), (this.fetchUrl = null), (this.uploadByHttp = null), (this.started = !1), (this.channelCount = e.channelCount || X), (this.peerChannels = []);
              try {
                this.initUploadChannel();
              } catch (t) {
                Z.error(t);
              }
            }
            get sendable() {
              return !!this.getSendableChannel();
            }
            getInfo() {
              const e = super.getInfo();
              return Object.assign(e, { server: this.server, fetchUrl: this.fetchUrl });
            }
            async initUploadChannel() {
              const e = new URL(K, this.server);
              e.searchParams.set("local", this.uploadStream.remotePeer), e.searchParams.set("remote", this.uploadStream.localPeer), (this.fetchUrl = e.href), (this.channelCount = l.l6.isVip ? $ : X), J("initUploadChannel channelCount:", this.channelCount);
              try {
                const e = { server: (0, W.S)(), channelId: this.uploadStream.localPeer + ":" + this.uploadStream.remotePeer, localPeer: this.uploadStream.localPeer, remotePeer: this.uploadStream.remotePeer };
                (this.peerChannels = G.m.getChannels(e)),
                  this.peerChannels.forEach((e) => {
                    this.addDrainEvent(e);
                  }),
                  this.getConnectedChannels().length > 0 && this.startUpload(),
                  this.peerChannels.length < this.channelCount && this.setupNewPeerChannel();
              } catch (t) {
                U.t5.error(U.ag.t("get channel fail")), J("get websocket channel fail:", t), Z.error("initUploadChannel error:", t);
              }
            }
            getSendableChannel() {
              return this.peerChannels.find((e) => e.connected && e.sendable);
            }
            selectOnePeerChannel() {
              const e = this.getConnectedChannels();
              return 0 === e.length ? (this.setupNewPeerChannel(), null) : e.find((e) => e.sendable);
            }
            addToChannels(e) {
              J("addToChannels, id", e.id),
                this.addDrainEvent(e),
                1 === this.peerChannels.length && this.startUpload(),
                this.getConnectedChannels().length < this.channelCount &&
                  setTimeout(() => {
                    this.setupNewPeerChannel();
                  }, 200),
                W.y.scheduleNext(this.remotePeer);
            }
            getConnectedChannels() {
              return this.peerChannels.filter((e) => e.connected);
            }
            async setupNewPeerChannel() {
              if (!this.isUploadStreamWorking()) return;
              if ((J("setupNewPeerChannel, current peerChannels:", this.peerChannels.length), this.getConnectedChannels().length >= $)) return;
              if (this.isBuildingChannel && Date.now() - this.isBuildingChannel < 1e4) return;
              (this.isBuildingChannel = Date.now()), J("setupNewPeerChannel");
              const e = (0, l.$D)(),
                t = { initiator: !0, remotePeer: this.remotePeer, localPeer: e, server: (0, W.S)(), channelId: e + ":" + this.remotePeer },
                r = await G.m.addChannel(t);
              r.once("open", () => {
                J("channel open");
              }),
                this.addDrainEvent(r),
                r.once("connect", () => {
                  J("new channel connect"), (this.isBuildingChannel = null), this.isUploadStreamWorking() ? this.addToChannels(r) : W.y.scheduleNext(this.remotePeer);
                });
            }
            addDrainEvent(e) {
              0 === e.getListeners("drain").length &&
                e.on("drain", () => {
                  J("peerChannel on drain, schedule next"), W.y.scheduleNext(this.remotePeer);
                });
            }
            sendChunk(e, t, r = () => {}) {
              e.write(t, r);
            }
            destroy() {
              J("destroy uploadChannel"), this.uploadByHttp && this.uploadByHttp.close(!0), super.destroy();
            }
          }
          var te = r(5478);
          const re = r(99349)("UploadChannelOfNodeDataChannel.js"),
            ie = 3;
          class oe extends W.y {
            constructor(e) {
              super(e), (this.type = "node"), (this.p2p = !0), (this.peerChannels = []), (this.channelCount = ie), (this.sendingControl = new L({ size: this.uploadStream.totalChunks, maxDelay: 1500 })), this.initUploadChannel();
            }
            get sendable() {
              return super.sendable && !!this.getSendableChannel();
            }
            getSendableChannel() {
              return this.peerChannels.find((e) => e.connected && e.sendable);
            }
            initUploadChannel() {
              const e = te.l.list.filter((e) => e.remotePeer === this.remotePeer && e.connected);
              e.forEach((e) => {
                this.addToChannels(e);
              });
              const t = l.l6.isVip ? ie : 1;
              this.peerChannels.length < t && this.setupNewPeerChannel();
            }
            setupNewPeerChannel() {
              if (!this.isUploadStreamWorking()) return;
              if (this.isBuildingChannel && Date.now() - this.isBuildingChannel < 1e4) return;
              (this.isBuildingChannel = Date.now()), re("setupNewPeerChannel");
              const e = new te.l({ remotePeer: this.remotePeer, initiator: !0 });
              e.once("connect", () => {
                (this.isBuildingChannel = null), this.isUploadStreamWorking() ? this.addToChannels(e) : W.y.scheduleNext(this.remotePeer);
              });
            }
            addToChannels(e) {
              this.peerChannels.push(e),
                1 === this.peerChannels.length && this.startUpload(),
                this.getConnectedChannels().length < this.channelCount &&
                  setTimeout(() => {
                    this.setupNewPeerChannel();
                  }, 200),
                W.y.scheduleNext(this.remotePeer);
            }
            getConnectedChannels() {
              return this.peerChannels.filter((e) => e.connected);
            }
            selectOnePeerChannel() {
              const e = this.getConnectedChannels();
              return 0 === e.length ? (this.setupNewPeerChannel(), null) : e.find((e) => e.sendable);
            }
            getInfo() {
              const e = super.getInfo();
              return Object.assign(e, { uploadHandler: this.localHandler });
            }
            sendChunk(e, t, r = () => {}) {
              e.write(t, r);
            }
            destroy() {
              re("destroy uploadChannel"), super.destroy();
            }
          }
          var ne = r(61959),
            se = r(40019);
          const ae = x(),
            le = 512 * S.E,
            ce = 131072,
            de = 10 * (1 << 30);
          async function he(e, t) {
            ae("startUpload", e);
            const {
              remotePeer: r,
              fileId: i,
              ppUrl: o,
              remoteHandler: n,
              service: s,
              fileStart: a,
              directory: d,
            } = { remotePeer: e.localPeer, fileId: e.fileId, ppUrl: e.ppUrl, fileName: e.fileName, remoteHandler: e.localHandler, startOffset: e.offset || 0, fileStart: e.fileStart || 0, service: e.service, directory: e.directory };
            let u;
            try {
              if (((u = await (0, w.VI)({ id: i, ppUrl: o, service: s })), !u || !u.file)) throw new Error("not find file");
            } catch (b) {
              se.error("can not find uploadFile:", i, u);
              const e = { remotePeer: r, remoteHandler: n };
              return void pe(e, t);
            }
            const p = () => {};
            let A = new B(p, { uploadFile: u, remotePeer: r, remoteHandler: n, fileStart: a }),
              m = new M(u.file, { start: a, chunkSize: le });
            const f = () => {
              !A || A.destroyed || A.paused || (ae("resume after reconnect"), A.resumeRead());
            };
            h.YB.on("linked_" + r, f),
              A.on("end", () => {
                ae("------ upload end ---------"), (A.sendComplete = !0), Ae(A);
              })
                .on("close", () => {
                  ae("clear data after close------"), (0, c.vS)(g), h.YB.off("linked_" + r, f), (A = null), (m = null), (A = null);
                })
                .on("abort", (e) => {
                  ae("trigger abort:", e), (e && "remote" === e.message) || pe(A);
                })
                .on("data", (e) => {})
                .on("backPressureEnd", () => {
                  !A || A.destroyed || A.paused || (ae("resume after backPressureEnd"), (A.backPressure = !1), A.resumeRead());
                })
                .on("fetchSlice", (e, t) => {
                  ae("upload slice", e), A.paused || A.resumeRead();
                });
            const g = (0, c.Hj)(function (e, t, r) {
              switch (((e && e.type) || !r || (e = (0, S.Jx)(r)), e.type)) {
                case l.Nw.start:
                  ae("get start"), A && ((A.paused = !1), A.resumeRead());
                  break;
                case l.Nw.complete:
                  const r = Date.now() - A.startTime;
                  ae("get complete, use time: %d, Av upload rate: %s MByte/s", r, (1e3 * A.totalSize) / (r * (1 << 20))), A && A.completed();
                  break;
                case l.Nw.completeByHttp:
                  ae("get completeByHttp"), !A || A.destroyed || A.paused || A.resumeRead();
                  break;
                case l.Nw.abort:
                  ae("get abort"), A && !A.destroyed && (A.abort(new Error("remote")), U.t5.warning(U.ag.t("Remoter abort download")));
                  break;
                case l.Nw.pause:
                  if ((ae("get pause"), !A || A.destroyed)) return;
                  (A.paused = !0), A.pauseRead();
                  break;
                case l.Nw.resume:
                  if ((ae("get resume"), A && A.uploadChannel && !A.destroyed)) {
                    if (((A.paused = !1), A.sendComplete)) return void Ae(A, t);
                    A.resumeRead();
                  } else A && pe(A);
                  break;
                case l.Nw.fetch:
                  ae("get fetch slice", e.offset), A.fetchSlice(e.offset);
                  break;
                case l.Nw.backPressure:
                  if ((ae("get uploadStream backPressure"), !A || A.destroyed)) return;
                  A.backPressure ||
                    ((A.backPressure = !0),
                    setTimeout(() => {
                      (A.backPressure = !1), A.emit("backPressureEnd");
                    }, 2e3));
                  break;
                default:
                  ae("unknow message.type", e.type);
              }
            });
            A.localHandler = g;
            const y = new z.iU({ remotePeer: A.remotePeer, channelInfo: A.channelInfo, status: "working" }),
              v = u.addTransferStream(y);
            if ((v.bindStream(A), d)) {
              const e = await (0, w.VI)({ ppUrl: d, service: s });
              if (e) {
                const t = e.transferStreams.findIndex((e) => e.remotePeer === r);
                let i;
                t > -1 && ((i = e.transferStreams[t]), i instanceof z.FF || ((i = null), e.transferStreams.splice(t, 1))), i || ((i = (0, ne.qj)(new z.FF({ remotePeer: r, filesCount: e.filesCount, size: e.size, channelInfo: {} }))), e.transferStreams.push(i)), i.addTransferFile(u);
              }
            }
            return (
              ue(A, t),
              m.on("error", (e) => {
                ae("fileStreamReader on error, stop uploadStream"), A.abort(e);
              }),
              m.pipe(A),
              ae.enabled && (window.upstreams || (window.upstreams = []), window.upstreams.push({ fileStreamReader: m, uploadStream: A })),
              A
            );
          }
          function ue(e, t) {
            ae("send reply of download");
            const r = {
              type: l.Nw.downloadReply,
              localHandler: e.localHandler,
              fileId: e.fileId,
              fileName: e.fileName,
              fileType: e.fileType,
              remoteHandler: e.remoteHandler,
              chunkSize: e.chunkSize,
              totalChunks: e.totalChunks,
              totalSize: e.totalSize,
              deflated: e.deflated,
              channelInfo: e.channelInfo,
              md5: e.uploadFile && e.uploadFile.md5,
              fileStart: e.fileStart,
            };
            (0, A.lW)({ remotePeer: e.remotePeer, serviceType: l.V9.message, handler: e.localHandler, data: r }, t);
          }
          function pe(e, t) {
            ae("send abort of the block");
            const r = { type: l.Nw.abort, localHandler: e.localHandler, fileId: e.fileId, offset: e.offset, fileName: e.fileName, remoteHandler: e.remoteHandler };
            (0, A.lW)({ remotePeer: e.remotePeer, serviceType: l.V9.message, handler: e.localHandler, data: r }, t);
          }
          function Ae(e, t) {
            ae("triggerComplete");
            const r = { type: l.Nw.complete, localHandler: e.localHandler, fileId: e.fileId, offset: e.offset - 1, fileName: e.fileName, remoteHandler: e.remoteHandler };
            (0, A.lW)({ remotePeer: e.remotePeer, serviceType: l.V9.message, handler: e.localHandler, data: r }, t);
          }
          function me(e, t) {
            if (t.totalSize < ce) return !1;
            const r = !0;
            return !r || t.totalSize < de;
          }
          function fe(e, t) {
            const r = (0, l.tA)(e),
              i = !(0, l.h7)("openNodeChannel");
            if (!i && ("pc" === l.l6.clientType || "pc" === r.clientType)) {
              const t = te.l.getChannel({ remotePeer: e });
              if (t && t.connected) return W.y.types.nodeChannel;
            }
            const o = Y.hasP2PChannel(e),
              n = (0, l.ST)();
            return !o && n && me(e, t) ? (0 === n.indexOf("ws") ? W.y.types.websocket : 0 === n.indexOf("http") ? W.y.types.http : (ae("use webRtc channel as default", e), W.y.types.webRtc)) : W.y.types.webRtc;
          }
          function ge(e, t) {
            const r = (0, l.h7)("dataChannel") || fe(e, t);
            (0, m.q)("selectDataChannel", { category: "upload", label: r });
            const i = W.y.types;
            switch (r) {
              case i.nodeChannel:
                return ae("use node data channel for upload:", e), new oe({ remotePeer: e, uploadStream: t });
              case i.websocket:
                return ae("use websocket channel for upload:", e), new ee({ remotePeer: e, uploadStream: t });
              case i.http:
                ae("use http channel for upload， but not support anymore:", e);
              case i.webRtc:
              default:
                return ae("use webRtc channel for upload:", e), new Y({ remotePeer: e, uploadStream: t });
            }
          }
          h.YB.on("linked_remote", (e, t) => {
            setTimeout(() => {
              (0, w.F)(e);
            }, 1e3),
              setTimeout(() => {
                t && t.serviceType === y.V9.message && t.initiator && (0, v.VX)(t.remotePeer, t);
              }, 500);
          })
            .on(y.Nw.download, (e, t) => {
              he(e, t);
            })
            .on(y.Nw.pushUploadApply, (e, t) => {
              (0, b.Yn)(e, t);
            })
            .on(y.Nw.pushUploadForbid, (e, t) => {
              (0, b.Ts)(e, t);
            });
          r(69182), r(67386), r(53300), r(24084);
          var we = r(40019);
          const ye = r(56005),
            ve = r(99349),
            be = ve("app.js"),
            Se = (() => {
              const e = [];
              return (
                f.Z.forEach((t) => {
                  t.notPeer && e.push(t.path);
                }),
                e
              );
            })();
          window.addEventListener("beforeunload", ke), h.YB.on("get-user-info", De), h.YB.on("new-notification", Ee);
          const Pe = ye ? new ye() : null;
          async function Ce() {
            ve.disable();
            const e = (0, l.h7)("setDebug");
            e && ve.enable(e),
              be("App init"),
              setTimeout(() => {
                (0, l.Me)();
              }, 3e3),
              "browser" === (0, l.fb)() && o.ZP.is.mobile && document.addEventListener("visibilitychange", Te);
            const t = new URLSearchParams(window.location.search),
              r = t.get("s");
            r && p(r);
            const i = t.get("ref");
            if (i && !(0, l.h7)("vs")) {
              const e = n.Z.get("ref");
              e || n.Z.set("ref", i, { expires: 90 });
            }
            (0, l.m3)("vs", Date.now());
            const s = window.location.hash.replace("#", "");
            if (Se.includes(s)) return void be("Not need to register peer in path:", s);
            (0, A.z2)(() => {
              be("registered to signal server");
            }),
              Pe &&
                document.addEventListener(
                  "click",
                  function () {
                    be("enable noSleep"), Pe && Pe.enable();
                  },
                  { once: !0 }
                );
            const a = o.ZP.is.electron ? "electron" : o.ZP.is.capacitor ? "mobile" : "browser";
            (0, m.q)(a, { category: "platform", label: o.ZP.is.platform });
            const c = ("browser" !== a ? "" : n.Z.get("ref")) || "";
            (0, m.V)({ href: window.location.href, referer: document.referrer, client: a, mobile: !!o.ZP.is.mobile, ref: c });
          }
          function ke() {
            "browser" === (0, l.fb)() && o.ZP.is.mobile && document.removeEventListener("visibilitychange", Te), (0, A.US)();
          }
          const Ie = 1200;
          async function Te() {
            be("appVisibleChange:", document.visibilityState);
            const e = async () => {
              be("after register in reconnect");
              const e = (0, l.ao)(),
                t = e.filter((e) => !e.connected && Date.now() - e.updated < Ie).map((e) => (0, c.If)(e));
              return await Promise.allSettled(t);
            };
            if ("visible" === document.visibilityState) {
              const t = (0, A.wV)();
              t && t.readyState === WebSocket.OPEN ? e() : ((0, A.z2)(), (0, h.pX)("registered", e, 1e4));
            }
          }
          async function De() {
            let e;
            try {
              const t = await s.axios.get("/api/user/me"),
                r = t.data;
              200 === r.status ? (e = r.data) : be("unLogin");
            } catch (t) {
              be("login error:", t), t.response && 400 !== t.response.status && (0, i.Z)(a.i18n.t("login error"));
            }
            if (e) {
              (e.roles = ["vip"]),
                (e.vipExpired = "2099-05-19T05:30:01.570Z"),
                e.username ? {} : (e.username = "尚未登陆，只能解锁部分功能"),
                (e.isVip = true),
                console.log(e),
                e.roles && e.roles.includes("vip") && e.vipExpired && new Date(e.vipExpired) > new Date() && (e.isVip = !0),
                (0, l.xj)().commit("peer/updateUser", e);
              let t = e.token || n.Z.get("token");
              if (!t && o.ZP.is.electron) {
                be("in electron, get cookie, axios baseURL:", s.axios.defaults.baseURL);
                const e = await window.electronAPI.client.getCookies({ url: s.axios.defaults.baseURL, name: "token" });
                be("get cookies from electron main:", e), e && Array.isArray(e) && e[0] && (t = e[0].value);
              }
              e.token || (e.token = t), await (0, l.av)(e), (0, d.wC)(), Ee(), (0, c.SG)(t), h.YB.emit("login");
            } else (0, l.xj)().commit("peer/updateUser", null), (0, c.SG)();
          }
          function Ee() {
            (0, l.xj)().dispatch("peer/unreadNotification");
          }
          async function Re(e) {
            const t = await new Promise((t) => {
              e.file((e) => {
                t(e);
              });
            });
            return t;
          }
          async function Be(e, t = "transfer") {
            be("traverseDirectoryTree relativePath, item:", e);
            const r = [];
            if (e.isDirectory) {
              const i = e.createReader(),
                o = await new Promise((e) => {
                  i.readEntries(function (t) {
                    e(t);
                  });
                });
              for (const e of o)
                if (e.isFile) {
                  const i = await Re(e),
                    o = (0, w.dD)(i, !0, t, e.fullPath);
                  r.push(o);
                } else if (e.isDirectory) {
                  const i = await Be(e, t);
                  i.forEach((e) => {
                    e && r.push(e);
                  });
                }
            } else we.error("bad directory", e);
            return r;
          }
          async function xe(e) {
            return await new Promise((t) => {
              e.getAsString((e) => {
                (0, g._q)(e), t(e);
              });
            });
          }
          async function Fe(e, t) {
            if (e.webkitGetAsEntry) {
              const r = e.webkitGetAsEntry();
              if (r.isFile) {
                const e = await Re(r),
                  i = (0, w.dD)(e, !0, t);
                return i;
              }
              {
                const e = await Be(r, t);
                return be("uploadFileList", e), (0, w.bl)(r.name, t);
              }
            }
            {
              const r = e.getAsFile();
              if (r) {
                const e = (0, w.dD)(r, !0, t);
                return e;
              }
            }
            return null;
          }
          async function Ne(e, t = "transfer") {
            if ((be("onDropContent:", e, e.files[0]), !e)) return;
            const r = e.items,
              i = [];
            let o = !1;
            for (const a of r) be("transferItem:", a.kind, a), "file" === a.kind ? ((o = !0), i.push(Fe(a, t))) : "string" === a.kind && a.getAsString && i.push(xe(a));
            const n = await Promise.allSettled(i);
            o && "transfer" === t && (0, w.F)();
            const s = n.reduce((e, t) => ("fulfilled" === t.status && e.push(t.value), e), []);
            return s;
          }
        },
        56005: (e, t, r) => {
          var i = r(40019);
          r(90246),
            r(76701),
            r(67280),
            r(65363),
            /*! NoSleep.js v0.11.0 - git.io/vfn01 - Rich Tibbett - MIT license */
            (function (t, r) {
              e.exports = r();
            })(window, function () {
              return (function (e) {
                var t = {};
                function r(i) {
                  if (t[i]) return t[i].exports;
                  var o = (t[i] = { i, l: !1, exports: {} });
                  return e[i].call(o.exports, o, o.exports, r), (o.l = !0), o.exports;
                }
                return (
                  (r.m = e),
                  (r.c = t),
                  (r.d = function (e, t, i) {
                    r.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: i });
                  }),
                  (r.r = function (e) {
                    "undefined" !== typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 });
                  }),
                  (r.t = function (e, t) {
                    if ((1 & t && (e = r(e)), 8 & t)) return e;
                    if (4 & t && "object" === typeof e && e && e.__esModule) return e;
                    var i = Object.create(null);
                    if ((r.r(i), Object.defineProperty(i, "default", { enumerable: !0, value: e }), 2 & t && "string" != typeof e))
                      for (var o in e)
                        r.d(
                          i,
                          o,
                          function (t) {
                            return e[t];
                          }.bind(null, o)
                        );
                    return i;
                  }),
                  (r.n = function (e) {
                    var t =
                      e && e.__esModule
                        ? function () {
                            return e["default"];
                          }
                        : function () {
                            return e;
                          };
                    return r.d(t, "a", t), t;
                  }),
                  (r.o = function (e, t) {
                    return Object.prototype.hasOwnProperty.call(e, t);
                  }),
                  (r.p = ""),
                  r((r.s = 0))
                );
              })([
                function (e, t, r) {
                  "use strict";
                  var o = (function () {
                    function e(e, t) {
                      for (var r = 0; r < t.length; r++) {
                        var i = t[r];
                        (i.enumerable = i.enumerable || !1), (i.configurable = !0), "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);
                      }
                    }
                    return function (t, r, i) {
                      return r && e(t.prototype, r), i && e(t, i), t;
                    };
                  })();
                  function n(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
                  }
                  var s = r(1),
                    a = s.webm,
                    l = s.mp4,
                    c = "undefined" !== typeof navigator && parseFloat(("" + (/CPU.*OS ([0-9_]{3,4})[0-9_]{0,1}|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ""])[1]).replace("undefined", "3_2").replace("_", ".").replace("_", "")) < 10 && !window.MSStream,
                    d = "wakeLock" in navigator,
                    h = (function () {
                      function e() {
                        var t = this;
                        if ((n(this, e), d)) {
                          this._wakeLock = null;
                          var r = function () {
                            null !== t._wakeLock && "visible" === document.visibilityState && t.enable();
                          };
                          document.addEventListener("visibilitychange", r), document.addEventListener("fullscreenchange", r);
                        } else
                          c
                            ? (this.noSleepTimer = null)
                            : ((this.noSleepVideo = document.createElement("video")),
                              this.noSleepVideo.setAttribute("title", "No Sleep"),
                              this.noSleepVideo.setAttribute("playsinline", ""),
                              this._addSourceToVideo(this.noSleepVideo, "webm", a),
                              this._addSourceToVideo(this.noSleepVideo, "mp4", l),
                              this.noSleepVideo.addEventListener("loadedmetadata", function () {
                                t.noSleepVideo.duration <= 1
                                  ? t.noSleepVideo.setAttribute("loop", "")
                                  : t.noSleepVideo.addEventListener("timeupdate", function () {
                                      t.noSleepVideo.currentTime > 0.5 && (t.noSleepVideo.currentTime = Math.random());
                                    });
                              }));
                      }
                      return (
                        o(e, [
                          {
                            key: "_addSourceToVideo",
                            value: function (e, t, r) {
                              var i = document.createElement("source");
                              (i.src = r), (i.type = "video/" + t), e.appendChild(i);
                            },
                          },
                          {
                            key: "enable",
                            value: function () {
                              var e = this;
                              d
                                ? navigator.wakeLock
                                    .request("screen")
                                    .then(function (t) {
                                      (e._wakeLock = t), e._wakeLock.addEventListener("release", function () {});
                                    })
                                    .catch(function (e) {
                                      i.error(e.name + ", " + e.message);
                                    })
                                : c
                                ? (this.disable(),
                                  i.warn("\n        NoSleep enabled for older iOS devices. This can interrupt\n        active or long-running network requests from completing successfully.\n        See https://github.com/richtr/NoSleep.js/issues/15 for more details.\n      "),
                                  (this.noSleepTimer = window.setInterval(function () {
                                    document.hidden || ((window.location.href = window.location.href.split("#")[0]), window.setTimeout(window.stop, 0));
                                  }, 15e3)))
                                : this.noSleepVideo.play();
                            },
                          },
                          {
                            key: "disable",
                            value: function () {
                              d ? (this._wakeLock.release(), (this._wakeLock = null)) : c ? this.noSleepTimer && (i.warn("\n          NoSleep now disabled for older iOS devices.\n        "), window.clearInterval(this.noSleepTimer), (this.noSleepTimer = null)) : this.noSleepVideo.pause();
                            },
                          },
                        ]),
                        e
                      );
                    })();
                  e.exports = h;
                },
                function (e, t, r) {
                  "use strict";
                  e.exports = {
                    webm: "data:video/webm;base64, GkXfowEAAAAAAAAfQoaBAUL3gQFC8oEEQvOBCEKChHdlYm1Ch4EEQoWBAhhTgGcBAAAAAAAVkhFNm3RALE27i1OrhBVJqWZTrIHfTbuMU6uEFlSua1OsggEwTbuMU6uEHFO7a1OsghV17AEAAAAAAACkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmAQAAAAAAAEUq17GDD0JATYCNTGF2ZjU1LjMzLjEwMFdBjUxhdmY1NS4zMy4xMDBzpJBlrrXf3DCDVB8KcgbMpcr+RImIQJBgAAAAAAAWVK5rAQAAAAAAD++uAQAAAAAAADLXgQFzxYEBnIEAIrWcg3VuZIaFVl9WUDiDgQEj44OEAmJaAOABAAAAAAAABrCBsLqBkK4BAAAAAAAPq9eBAnPFgQKcgQAitZyDdW5khohBX1ZPUkJJU4OBAuEBAAAAAAAAEZ+BArWIQOdwAAAAAABiZIEgY6JPbwIeVgF2b3JiaXMAAAAAAoC7AAAAAAAAgLUBAAAAAAC4AQN2b3JiaXMtAAAAWGlwaC5PcmcgbGliVm9yYmlzIEkgMjAxMDExMDEgKFNjaGF1ZmVudWdnZXQpAQAAABUAAABlbmNvZGVyPUxhdmM1NS41Mi4xMDIBBXZvcmJpcyVCQ1YBAEAAACRzGCpGpXMWhBAaQlAZ4xxCzmvsGUJMEYIcMkxbyyVzkCGkoEKIWyiB0JBVAABAAACHQXgUhIpBCCGEJT1YkoMnPQghhIg5eBSEaUEIIYQQQgghhBBCCCGERTlokoMnQQgdhOMwOAyD5Tj4HIRFOVgQgydB6CCED0K4moOsOQghhCQ1SFCDBjnoHITCLCiKgsQwuBaEBDUojILkMMjUgwtCiJqDSTX4GoRnQXgWhGlBCCGEJEFIkIMGQcgYhEZBWJKDBjm4FITLQagahCo5CB+EIDRkFQCQAACgoiiKoigKEBqyCgDIAAAQQFEUx3EcyZEcybEcCwgNWQUAAAEACAAAoEiKpEiO5EiSJFmSJVmSJVmS5omqLMuyLMuyLMsyEBqyCgBIAABQUQxFcRQHCA1ZBQBkAAAIoDiKpViKpWiK54iOCISGrAIAgAAABAAAEDRDUzxHlETPVFXXtm3btm3btm3btm3btm1blmUZCA1ZBQBAAAAQ0mlmqQaIMAMZBkJDVgEACAAAgBGKMMSA0JBVAABAAACAGEoOogmtOd+c46BZDppKsTkdnEi1eZKbirk555xzzsnmnDHOOeecopxZDJoJrTnnnMSgWQqaCa0555wnsXnQmiqtOeeccc7pYJwRxjnnnCateZCajbU555wFrWmOmkuxOeecSLl5UptLtTnnnHPOOeecc84555zqxekcnBPOOeecqL25lpvQxTnnnE/G6d6cEM4555xzzjnnnHPOOeecIDRkFQAABABAEIaNYdwpCNLnaCBGEWIaMulB9+gwCRqDnELq0ehopJQ6CCWVcVJKJwgNWQUAAAIAQAghhRRSSCGFFFJIIYUUYoghhhhyyimnoIJKKqmooowyyyyzzDLLLLPMOuyssw47DDHEEEMrrcRSU2011lhr7jnnmoO0VlprrbVSSimllFIKQkNWAQAgAAAEQgYZZJBRSCGFFGKIKaeccgoqqIDQkFUAACAAgAAAAABP8hzRER3RER3RER3RER3R8RzPESVREiVREi3TMjXTU0VVdWXXlnVZt31b2IVd933d933d+HVhWJZlWZZlWZZlWZZlWZZlWZYgNGQVAAACAAAghBBCSCGFFFJIKcYYc8w56CSUEAgNWQUAAAIACAAAAHAUR3EcyZEcSbIkS9IkzdIsT/M0TxM9URRF0zRV0RVdUTdtUTZl0zVdUzZdVVZtV5ZtW7Z125dl2/d93/d93/d93/d93/d9XQdCQ1YBABIAADqSIymSIimS4ziOJElAaMgqAEAGAEAAAIriKI7jOJIkSZIlaZJneZaomZrpmZ4qqkBoyCoAABAAQAAAAAAAAIqmeIqpeIqoeI7oiJJomZaoqZoryqbsuq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq4LhIasAgAkAAB0JEdyJEdSJEVSJEdygNCQVQCADACAAAAcwzEkRXIsy9I0T/M0TxM90RM901NFV3SB0JBVAAAgAIAAAAAAAAAMybAUy9EcTRIl1VItVVMt1VJF1VNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVN0zRNEwgNWQkAkAEAkBBTLS3GmgmLJGLSaqugYwxS7KWxSCpntbfKMYUYtV4ah5RREHupJGOKQcwtpNApJq3WVEKFFKSYYyoVUg5SIDRkhQAQmgHgcBxAsixAsiwAAAAAAAAAkDQN0DwPsDQPAAAAAAAAACRNAyxPAzTPAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABA0jRA8zxA8zwAAAAAAAAA0DwP8DwR8EQRAAAAAAAAACzPAzTRAzxRBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABA0jRA8zxA8zwAAAAAAAAAsDwP8EQR0DwRAAAAAAAAACzPAzxRBDzRAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAEOAAABBgIRQasiIAiBMAcEgSJAmSBM0DSJYFTYOmwTQBkmVB06BpME0AAAAAAAAAAAAAJE2DpkHTIIoASdOgadA0iCIAAAAAAAAAAAAAkqZB06BpEEWApGnQNGgaRBEAAAAAAAAAAAAAzzQhihBFmCbAM02IIkQRpgkAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAGHAAAAgwoQwUGrIiAIgTAHA4imUBAIDjOJYFAACO41gWAABYliWKAABgWZooAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAYcAAACDChDBQashIAiAIAcCiKZQHHsSzgOJYFJMmyAJYF0DyApgFEEQAIAAAocAAACLBBU2JxgEJDVgIAUQAABsWxLE0TRZKkaZoniiRJ0zxPFGma53meacLzPM80IYqiaJoQRVE0TZimaaoqME1VFQAAUOAAABBgg6bE4gCFhqwEAEICAByKYlma5nmeJ4qmqZokSdM8TxRF0TRNU1VJkqZ5niiKommapqqyLE3zPFEURdNUVVWFpnmeKIqiaaqq6sLzPE8URdE0VdV14XmeJ4qiaJqq6roQRVE0TdNUTVV1XSCKpmmaqqqqrgtETxRNU1Vd13WB54miaaqqq7ouEE3TVFVVdV1ZBpimaaqq68oyQFVV1XVdV5YBqqqqruu6sgxQVdd1XVmWZQCu67qyLMsCAAAOHAAAAoygk4wqi7DRhAsPQKEhKwKAKAAAwBimFFPKMCYhpBAaxiSEFEImJaXSUqogpFJSKRWEVEoqJaOUUmopVRBSKamUCkIqJZVSAADYgQMA2IGFUGjISgAgDwCAMEYpxhhzTiKkFGPOOScRUoox55yTSjHmnHPOSSkZc8w556SUzjnnnHNSSuacc845KaVzzjnnnJRSSuecc05KKSWEzkEnpZTSOeecEwAAVOAAABBgo8jmBCNBhYasBABSAQAMjmNZmuZ5omialiRpmud5niiapiZJmuZ5nieKqsnzPE8URdE0VZXneZ4oiqJpqirXFUXTNE1VVV2yLIqmaZqq6rowTdNUVdd1XZimaaqq67oubFtVVdV1ZRm2raqq6rqyDFzXdWXZloEsu67s2rIAAPAEBwCgAhtWRzgpGgssNGQlAJABAEAYg5BCCCFlEEIKIYSUUggJAAAYcAAACDChDBQashIASAUAAIyx1lprrbXWQGettdZaa62AzFprrbXWWmuttdZaa6211lJrrbXWWmuttdZaa6211lprrbXWWmuttdZaa6211lprrbXWWmuttdZaa6211lprrbXWWmstpZRSSimllFJKKaWUUkoppZRSSgUA+lU4APg/2LA6wknRWGChISsBgHAAAMAYpRhzDEIppVQIMeacdFRai7FCiDHnJKTUWmzFc85BKCGV1mIsnnMOQikpxVZjUSmEUlJKLbZYi0qho5JSSq3VWIwxqaTWWoutxmKMSSm01FqLMRYjbE2ptdhqq7EYY2sqLbQYY4zFCF9kbC2m2moNxggjWywt1VprMMYY3VuLpbaaizE++NpSLDHWXAAAd4MDAESCjTOsJJ0VjgYXGrISAAgJACAQUooxxhhzzjnnpFKMOeaccw5CCKFUijHGnHMOQgghlIwx5pxzEEIIIYRSSsaccxBCCCGEkFLqnHMQQgghhBBKKZ1zDkIIIYQQQimlgxBCCCGEEEoopaQUQgghhBBCCKmklEIIIYRSQighlZRSCCGEEEIpJaSUUgohhFJCCKGElFJKKYUQQgillJJSSimlEkoJJYQSUikppRRKCCGUUkpKKaVUSgmhhBJKKSWllFJKIYQQSikFAAAcOAAABBhBJxlVFmGjCRcegEJDVgIAZAAAkKKUUiktRYIipRikGEtGFXNQWoqocgxSzalSziDmJJaIMYSUk1Qy5hRCDELqHHVMKQYtlRhCxhik2HJLoXMOAAAAQQCAgJAAAAMEBTMAwOAA4XMQdAIERxsAgCBEZohEw0JweFAJEBFTAUBigkIuAFRYXKRdXECXAS7o4q4DIQQhCEEsDqCABByccMMTb3jCDU7QKSp1IAAAAAAADADwAACQXAAREdHMYWRobHB0eHyAhIiMkAgAAAAAABcAfAAAJCVAREQ0cxgZGhscHR4fICEiIyQBAIAAAgAAAAAggAAEBAQAAAAAAAIAAAAEBB9DtnUBAAAAAAAEPueBAKOFggAAgACjzoEAA4BwBwCdASqwAJAAAEcIhYWIhYSIAgIABhwJ7kPfbJyHvtk5D32ych77ZOQ99snIe+2TkPfbJyHvtk5D32ych77ZOQ99YAD+/6tQgKOFggADgAqjhYIAD4AOo4WCACSADqOZgQArADECAAEQEAAYABhYL/QACIBDmAYAAKOFggA6gA6jhYIAT4AOo5mBAFMAMQIAARAQABgAGFgv9AAIgEOYBgAAo4WCAGSADqOFggB6gA6jmYEAewAxAgABEBAAGAAYWC/0AAiAQ5gGAACjhYIAj4AOo5mBAKMAMQIAARAQABgAGFgv9AAIgEOYBgAAo4WCAKSADqOFggC6gA6jmYEAywAxAgABEBAAGAAYWC/0AAiAQ5gGAACjhYIAz4AOo4WCAOSADqOZgQDzADECAAEQEAAYABhYL/QACIBDmAYAAKOFggD6gA6jhYIBD4AOo5iBARsAEQIAARAQFGAAYWC/0AAiAQ5gGACjhYIBJIAOo4WCATqADqOZgQFDADECAAEQEAAYABhYL/QACIBDmAYAAKOFggFPgA6jhYIBZIAOo5mBAWsAMQIAARAQABgAGFgv9AAIgEOYBgAAo4WCAXqADqOFggGPgA6jmYEBkwAxAgABEBAAGAAYWC/0AAiAQ5gGAACjhYIBpIAOo4WCAbqADqOZgQG7ADECAAEQEAAYABhYL/QACIBDmAYAAKOFggHPgA6jmYEB4wAxAgABEBAAGAAYWC/0AAiAQ5gGAACjhYIB5IAOo4WCAfqADqOZgQILADECAAEQEAAYABhYL/QACIBDmAYAAKOFggIPgA6jhYICJIAOo5mBAjMAMQIAARAQABgAGFgv9AAIgEOYBgAAo4WCAjqADqOFggJPgA6jmYECWwAxAgABEBAAGAAYWC/0AAiAQ5gGAACjhYICZIAOo4WCAnqADqOZgQKDADECAAEQEAAYABhYL/QACIBDmAYAAKOFggKPgA6jhYICpIAOo5mBAqsAMQIAARAQABgAGFgv9AAIgEOYBgAAo4WCArqADqOFggLPgA6jmIEC0wARAgABEBAUYABhYL/QACIBDmAYAKOFggLkgA6jhYIC+oAOo5mBAvsAMQIAARAQABgAGFgv9AAIgEOYBgAAo4WCAw+ADqOZgQMjADECAAEQEAAYABhYL/QACIBDmAYAAKOFggMkgA6jhYIDOoAOo5mBA0sAMQIAARAQABgAGFgv9AAIgEOYBgAAo4WCA0+ADqOFggNkgA6jmYEDcwAxAgABEBAAGAAYWC/0AAiAQ5gGAACjhYIDeoAOo4WCA4+ADqOZgQObADECAAEQEAAYABhYL/QACIBDmAYAAKOFggOkgA6jhYIDuoAOo5mBA8MAMQIAARAQABgAGFgv9AAIgEOYBgAAo4WCA8+ADqOFggPkgA6jhYID+oAOo4WCBA+ADhxTu2sBAAAAAAAAEbuPs4EDt4r3gQHxghEr8IEK",
                    mp4: "data:video/mp4;base64, AAAAHGZ0eXBNNFYgAAACAGlzb21pc28yYXZjMQAAAAhmcmVlAAAGF21kYXTeBAAAbGliZmFhYyAxLjI4AABCAJMgBDIARwAAArEGBf//rdxF6b3m2Ui3lizYINkj7u94MjY0IC0gY29yZSAxNDIgcjIgOTU2YzhkOCAtIEguMjY0L01QRUctNCBBVkMgY29kZWMgLSBDb3B5bGVmdCAyMDAzLTIwMTQgLSBodHRwOi8vd3d3LnZpZGVvbGFuLm9yZy94MjY0Lmh0bWwgLSBvcHRpb25zOiBjYWJhYz0wIHJlZj0zIGRlYmxvY2s9MTowOjAgYW5hbHlzZT0weDE6MHgxMTEgbWU9aGV4IHN1Ym1lPTcgcHN5PTEgcHN5X3JkPTEuMDA6MC4wMCBtaXhlZF9yZWY9MSBtZV9yYW5nZT0xNiBjaHJvbWFfbWU9MSB0cmVsbGlzPTEgOHg4ZGN0PTAgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV9xcF9vZmZzZXQ9LTIgdGhyZWFkcz02IGxvb2thaGVhZF90aHJlYWRzPTEgc2xpY2VkX3RocmVhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb25zdHJhaW5lZF9pbnRyYT0wIGJmcmFtZXM9MCB3ZWlnaHRwPTAga2V5aW50PTI1MCBrZXlpbnRfbWluPTI1IHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCB2YnZfbWF4cmF0ZT03NjggdmJ2X2J1ZnNpemU9MzAwMCBjcmZfbWF4PTAuMCBuYWxfaHJkPW5vbmUgZmlsbGVyPTAgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAAFZliIQL8mKAAKvMnJycnJycnJycnXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXiEASZACGQAjgCEASZACGQAjgAAAAAdBmjgX4GSAIQBJkAIZACOAAAAAB0GaVAX4GSAhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZpgL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGagC/AySEASZACGQAjgAAAAAZBmqAvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZrAL8DJIQBJkAIZACOAAAAABkGa4C/AySEASZACGQAjgCEASZACGQAjgAAAAAZBmwAvwMkhAEmQAhkAI4AAAAAGQZsgL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGbQC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBm2AvwMkhAEmQAhkAI4AAAAAGQZuAL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGboC/AySEASZACGQAjgAAAAAZBm8AvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZvgL8DJIQBJkAIZACOAAAAABkGaAC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBmiAvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZpAL8DJIQBJkAIZACOAAAAABkGaYC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBmoAvwMkhAEmQAhkAI4AAAAAGQZqgL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGawC/AySEASZACGQAjgAAAAAZBmuAvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZsAL8DJIQBJkAIZACOAAAAABkGbIC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBm0AvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZtgL8DJIQBJkAIZACOAAAAABkGbgCvAySEASZACGQAjgCEASZACGQAjgAAAAAZBm6AnwMkhAEmQAhkAI4AhAEmQAhkAI4AhAEmQAhkAI4AhAEmQAhkAI4AAAAhubW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAABDcAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAzB0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAA+kAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAALAAAACQAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAPpAAAAAAABAAAAAAKobWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAB1MAAAdU5VxAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAACU21pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAhNzdGJsAAAAr3N0c2QAAAAAAAAAAQAAAJ9hdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAALAAkABIAAAASAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAALWF2Y0MBQsAN/+EAFWdCwA3ZAsTsBEAAAPpAADqYA8UKkgEABWjLg8sgAAAAHHV1aWRraEDyXyRPxbo5pRvPAyPzAAAAAAAAABhzdHRzAAAAAAAAAAEAAAAeAAAD6QAAABRzdHNzAAAAAAAAAAEAAAABAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAABAAAAAQAAAIxzdHN6AAAAAAAAAAAAAAAeAAADDwAAAAsAAAALAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAAiHN0Y28AAAAAAAAAHgAAAEYAAANnAAADewAAA5gAAAO0AAADxwAAA+MAAAP2AAAEEgAABCUAAARBAAAEXQAABHAAAASMAAAEnwAABLsAAATOAAAE6gAABQYAAAUZAAAFNQAABUgAAAVkAAAFdwAABZMAAAWmAAAFwgAABd4AAAXxAAAGDQAABGh0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAACAAAAAAAABDcAAAAAAAAAAAAAAAEBAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAQkAAADcAABAAAAAAPgbWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAC7gAAAykBVxAAAAAAALWhkbHIAAAAAAAAAAHNvdW4AAAAAAAAAAAAAAABTb3VuZEhhbmRsZXIAAAADi21pbmYAAAAQc21oZAAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAADT3N0YmwAAABnc3RzZAAAAAAAAAABAAAAV21wNGEAAAAAAAAAAQAAAAAAAAAAAAIAEAAAAAC7gAAAAAAAM2VzZHMAAAAAA4CAgCIAAgAEgICAFEAVBbjYAAu4AAAADcoFgICAAhGQBoCAgAECAAAAIHN0dHMAAAAAAAAAAgAAADIAAAQAAAAAAQAAAkAAAAFUc3RzYwAAAAAAAAAbAAAAAQAAAAEAAAABAAAAAgAAAAIAAAABAAAAAwAAAAEAAAABAAAABAAAAAIAAAABAAAABgAAAAEAAAABAAAABwAAAAIAAAABAAAACAAAAAEAAAABAAAACQAAAAIAAAABAAAACgAAAAEAAAABAAAACwAAAAIAAAABAAAADQAAAAEAAAABAAAADgAAAAIAAAABAAAADwAAAAEAAAABAAAAEAAAAAIAAAABAAAAEQAAAAEAAAABAAAAEgAAAAIAAAABAAAAFAAAAAEAAAABAAAAFQAAAAIAAAABAAAAFgAAAAEAAAABAAAAFwAAAAIAAAABAAAAGAAAAAEAAAABAAAAGQAAAAIAAAABAAAAGgAAAAEAAAABAAAAGwAAAAIAAAABAAAAHQAAAAEAAAABAAAAHgAAAAIAAAABAAAAHwAAAAQAAAABAAAA4HN0c3oAAAAAAAAAAAAAADMAAAAaAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAACMc3RjbwAAAAAAAAAfAAAALAAAA1UAAANyAAADhgAAA6IAAAO+AAAD0QAAA+0AAAQAAAAEHAAABC8AAARLAAAEZwAABHoAAASWAAAEqQAABMUAAATYAAAE9AAABRAAAAUjAAAFPwAABVIAAAVuAAAFgQAABZ0AAAWwAAAFzAAABegAAAX7AAAGFwAAAGJ1ZHRhAAAAWm1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAALWlsc3QAAAAlqXRvbwAAAB1kYXRhAAAAAQAAAABMYXZmNTUuMzMuMTAw",
                  };
                },
              ]);
            });
        },
        26388: (e, t, r) => {
          "use strict";
          r.r(t), r.d(t, { axios: () => n.a, default: () => l });
          var i = r(23340),
            o = r(30052),
            n = r.n(o);
          const s = r(99349)("axios.js");
          let a = "https://www.ppzhilian.com";
          window && window.location && window.location.host && (a = window.location.origin), s("defaultBaseUrl", a), (n().defaults.baseURL = a), (n().defaults.withCredentials = !0), (n().defaults.timeout = 7e3);
          const l = (0, i.xr)(({ app: e, router: t, store: r }) => {
            e.config.globalProperties.$axios = n();
          });
        },
        73755: (e, t, r) => {
          "use strict";
          r.r(t), r.d(t, { default: () => o });
          var i = r(23340);
          const o = (0, i.xr)(({ app: e }) => {});
        },
        47867: (e, t, r) => {
          "use strict";
          r.r(t), r.d(t, { default: () => u, i18n: () => p });
          var i = r(23340),
            o = r(95175),
            n = r(23111),
            s = r.n(n),
            a = r(61663),
            l = r.n(a);
          const c = { "en-US": s(), "zh-CN": l() };
          let d = navigator.language || navigator.userLanguage;
          0 === d.indexOf("zh") && (d = "zh-CN");
          const h = (0, o.o)({ locale: d, fallbackLocale: "en-US", messages: c }),
            u = (0, i.xr)(({ app: e }) => {
              e.use(h);
            }),
            p = h.global;
        },
        82723: (e, t, r) => {
          "use strict";
          r.r(t), r.d(t, { default: () => n });
          var i = r(23340),
            o = r(47321);
          const n = (0, i.xr)(({ app: e }) => {
            e.use(o.Z);
          });
        },
        67963: (e, t, r) => {
          "use strict";
          r.r(t), r.d(t, { default: () => o });
          var i = r(23340);
          const o = (0, i.xr)(({ router: e, store: t }) => {
            e.afterEach((e, t) => {
              document.dispatchEvent(new Event("page-go-top"));
            });
          });
        },
        67386: (e, t, r) => {
          "use strict";
          r.d(t, { Jp: () => l, WJ: () => d, nX: () => h });
          r(82031), r(24124), r(10071), r(43610);
          var i = r(95911),
            o = r(77597),
            n = r(87035),
            s = r(61959);
          const a = r(99349)("chatOverChannel");
          n.YB.on(o.Nw.message, (e, t) => {
            p(e, t);
          }),
            n.YB.on("unLinked_remote", (e) => {
              l.remove(e);
            });
          class l {
            constructor({ remotePeer: e, handler: t }) {
              (this.remotePeer = e), (this.localHandler = t), (this.remoteHandler = null), (this.peerChannel = null), (this.history = []);
            }
            destroy() {
              a("chatLink destroy:", this.remotePeer), this.localHandler && ((0, i.vS)(this.localHandler), (this.localHandler = null));
            }
          }
          async function c({ remotePeer: e, chat: t }, r) {
            if (!e || !t) return;
            const n = l.find(e);
            if (!n.localHandler) {
              const e = (0, i.Hj)((e, t, r) => {
                a("received my message:");
                const i = e.message;
                i && u(n, e, t);
              });
              n.localHandler = e;
            }
            n.callback !== r && "function" === typeof r && (n.callback = r);
            const s = { localHandler: n.localHandler, remoteHandler: n.remoteHandler || o.Nw.message, remotePeer: e, message: t },
              c = await (0, i.IC)(e, s);
            return !!c;
          }
          async function d({ remotePeer: e, remoteName: t, chat: r }, i) {
            if (!r) return;
            const n = Math.random().toString().slice(-8);
            (0, o.lq)("service/addChat", { _id: n, created: new Date(), message: r, author: "me", to: t, status: "sending" });
            const s = await c({ remotePeer: e, chat: r }, i);
            return s ? (0, o.lq)("service/updateChatStatus", { _id: n, status: "success" }) : (0, o.lq)("service/updateChatStatus", { _id: n, status: "fail" }), s;
          }
          async function h({ chat: e }, t) {
            if (!e) return;
            const r = Math.random().toString().slice(-8);
            (0, o.lq)("service/addChat", { _id: r, created: new Date(), message: e, author: "me", status: "sending" });
            const i = ((0, o._C)() || []).filter((e) => e.connected);
            if (0 === i.length) return (0, o.lq)("service/updateChatStatus", { _id: r, status: "fail" }), [];
            const n = i.map(async (r) => await c({ remotePeer: r.clientId, chat: e }, t)),
              s = await Promise.all(n);
            return s.includes(!1) ? (s.includes(!0) ? (0, o.lq)("service/updateChatStatus", { _id: r, status: "part" }) : (0, o.lq)("service/updateChatStatus", { _id: r, status: "fail" })) : (0, o.lq)("service/updateChatStatus", { _id: r, status: "success" }), s;
          }
          function u(e, t, r) {
            e.remoteHandler || (e.remoteHandler = t.localHandler), (e.peerChannel = r);
            const i = t.message;
            e.callback && e.callback(i);
            const s = (0, o.tA)(e.remotePeer),
              a = { created: new Date(), message: i, author: { clientId: s.clientId, clientName: s.clientName } };
            s && ((0, o.lq)("service/addChat", a), n.YB.emit("remote_new_chat", s.clientId, a));
          }
          function p(e, t) {
            a("receiveMessage");
            const r = e.message;
            if (!r) return;
            const i = l.find(e.localPeer);
            u(i, e, t);
          }
          (l.queue = (0, s.qj)([])),
            (l.find = (e) => {
              for (let r = 0; r < l.queue.length; r++) if (l.queue[r].remotePeer === e) return l.queue[r];
              const t = new l({ remotePeer: e });
              return l.queue.unshift(t), t;
            }),
            (l.remove = (e) => {
              const t = l.queue.findIndex((t) => t.remotePeer === e);
              t > -1 && (l.queue[t].destroy(), l.queue.splice(t, 1));
            });
        },
        9802: (e, t, r) => {
          "use strict";
          r.d(t, { QQ: () => k, _q: () => y, gp: () => A, hq: () => b });
          r(82031);
          var i = r(49405),
            o = r(95911),
            n = r(77597),
            s = r(87352),
            a = r(78999),
            l = r(87035),
            c = r(61959),
            d = r(83673),
            h = r(88322);
          const u = r(99349)("clipboardOverChannel"),
            p = 10,
            A = (0, c.qj)({ content: "", history: [], isSending: !1 }),
            m = 30,
            f = (0, i.Z)(
              function () {
                b();
              },
              1500,
              !1
            );
          function g(e, t, r) {
            e && t && (e.unshift(t), r && e.length > r && e.pop());
          }
          (0, d.YP)((0, c.Vh)(A, "content"), f),
            l.YB.on(n.Nw.clipboard, (e, t) => {
              P(e, t);
            }),
            l.YB.on("linked_remote", (e, t) => {
              A.content && v({ remotePeer: e, clip: A.content });
            });
          class w {
            constructor({ remotePeer: e, handler: t }) {
              (this.remotePeer = e), (this.localHandler = t), (this.remoteHandler = null), (this.peerChannel = null), (this.history = []), (this.receivedHistory = []);
            }
          }
          function y(e) {
            e && (A.content = e);
          }
          function v({ remotePeer: e, clip: t }, r) {
            if (!e || !t) return;
            const i = w.find(e);
            i.callback !== r && "function" === typeof r && (i.callback = r);
            const s = { remoteHandler: n.Nw.clipboard, message: t };
            (0, o.IC)(e, s);
          }
          function b(e) {
            if (!A.content) return void (e && "function" === typeof e && e());
            const t = A.content;
            C(t);
            const r = (0, n._C)();
            0 !== r.length
              ? ((A.isSending = !0),
                r.forEach((r) => {
                  r.connected && v({ remotePeer: r.clientId, clip: t }, e);
                }),
                setTimeout(() => {
                  (A.isSending = !1), e && "function" === typeof e && e();
                }, 500 * (Math.floor(t.length / s.lv) + 1)),
                (0, h.q)("syncClipboard", { category: "clipboard", value: t }))
              : e && "function" === typeof e && e();
          }
          function S(e, t, r) {
            e.remoteHandler || (e.remoteHandler = t.localHandler), (e.peerChannel = r);
            const i = t.message;
            e.callback && e.callback(i);
            const o = (0, n.tA)(e.remotePeer),
              s = { created: new Date(), message: i, author: o };
            g(e.receivedHistory, s, p), o && (o.clipboards || (o.clipboards = []), g(o.clipboards, s, p), l.YB.emit("remote_new_clip", o.clientId, s));
          }
          function P(e, t) {
            u("receivedClipboard");
            const r = e.message;
            if (!r) return;
            const i = w.find(e.localPeer);
            S(i, e, t);
          }
          function C(e, t = !1) {
            if (!e) return;
            const r = A.history;
            (!t && r[0] && e === r[0].value) || (r.unshift({ _id: Date.now(), value: e }), r.length > m && r.pop());
          }
          function k() {
            const e = A.history;
            a.Vq.create({ title: a.ag.t("Clear All"), message: a.ag.t("Are you sure to clear all?"), ok: a.ag.t("Ok"), cancel: a.ag.t("Cancel") }).onOk(() => {
              const t = e.length;
              e.splice(0, t);
            });
          }
          (w.queue = (0, c.qj)([])),
            (w.find = (e) => {
              for (let r = 0; r < w.queue.length; r++) if (w.queue[r].remotePeer === e) return w.queue[r];
              const t = new w({ remotePeer: e });
              return w.queue.unshift(t), t;
            });
        },
        69182: (e, t, r) => {
          "use strict";
          r.d(t, { QA: () => f, yX: () => y });
          r(10071), r(24124), r(76701);
          var i = r(87035),
            o = r(77597),
            n = r(95911),
            s = r(78999),
            a = r(61959),
            l = (r(65663), r(56801), r(43610), r(67280), r(26388));
          const c = r(24636),
            d = r(26066),
            h = r(99349)("Aria2Client.js");
          class u extends c {
            constructor() {
              super(),
                (this.aria2 = null),
                (this.downloaderRunning = !1),
                (this.connected = !1),
                (this.files = []),
                (this.retryStart = 0),
                (this.updateTimer = null),
                (this.btTrackers = ""),
                (this._isChecking = !1),
                (this.proxy = (0, a.qj)(this)),
                window.electronAPI &&
                  (window.electronAPI.ipcRenderer.on("downloader", (e, t) => {
                    h("get message from server:", t), -1 !== t.type.indexOf("err") ? this.checkRunning() : "downloaderStart" === t.type ? (h("downloaderStart"), this.checkRunning()) : "downloaderStop" === t.type && (h("downloaderStop"), this.checkRunning());
                  }),
                  this.loadTrackers());
            }
            init() {
              window.electronAPI && (h("downloader init"), this.checkRunning());
            }
            startTimer() {
              this.updateTimer || (h("start updateTimer"), this.checkStatus(), (this.updateTimer = setInterval(this.checkStatus.bind(this), 1e3)));
            }
            clearTimer() {
              this.updateTimer && (clearInterval(this.updateTimer), (this.updateTimer = null));
            }
            checkRunning() {
              if ((h("checkRunning"), this._isChecking)) return;
              this._isChecking = !0;
              const e = async () => {
                const e = await window.electronAPI.downloader.checkServer();
                (this.retryStart = 0), (this.proxy.downloaderRunning = e), this.downloaderRunning !== this.connected && (this.downloaderRunning ? this.initRpc() : this.destroyRpc()), (this._isChecking = !1);
              };
              e();
            }
            initRpc() {
              h("initRpc");
              const e = (this.proxy.aria2 = new d());
              e
                .on("open", () => {
                  h("websocket open"), (this.proxy.connected = !0), this.listNotifications(), this.getAll(), this.startTimer(), this.emit("connect");
                })
                .on("close", () => {
                  h("websocket close"), (this.proxy.connected = !1);
                })
                .on("output", (e) => {})
                .on("input", (e) => {}),
                this.openRpc();
            }
            openRpc() {
              this.connected ||
                (h("openRpc"),
                this.aria2 || this.initRpc(),
                this.aria2
                  .open()
                  .then(() => {
                    h("connected server success");
                  })
                  .catch((e) => {
                    h("connected server fail:", e), (this.proxy.connected = !1);
                  }));
            }
            destroyRpc() {
              h("destroyRpc"), this.clearTimer(), this.aria2 && this.aria2.close(), (this.proxy.aria2 = null), (this.proxy.connected = !1), (this.aria2Notifications = null), this.proxy.files.splice(0, this.files.length), this.emit("disconnect");
            }
            async startDownloader() {
              this.retryStart > 5 ||
                (this.retryStart++,
                h("start Server"),
                await window.electronAPI.downloader.startServer(),
                this.emit("start"),
                setTimeout(() => {
                  this && !this.downloaderRunning && this.checkRunning();
                }, 2e3));
            }
            async stopDownloader() {
              await window.electronAPI.downloader.stopServer(),
                this.emit("stop"),
                setTimeout(() => {
                  this && this.downloaderRunning && this.checkRunning();
                }, 3e3);
            }
            async checkStatus() {
              if (!this.downloaderRunning) return void this.clearTimer();
              if (!this.connected) return;
              h("check status");
              const e = [];
              if (
                (this.files.forEach((t) => {
                  "active" === t.status && t.gid && e.push(["tellStatus", t.gid]);
                }),
                e.length)
              ) {
                const t = await this.aria2.batch(e);
                t.forEach((e) => {
                  e.then((e) => {
                    this.addToFiles(e);
                  });
                });
              } else this.clearTimer();
            }
            async listNotifications() {
              if (!this.checkConnection()) return;
              const e = await this.aria2.listNotifications();
              if (this.aria2Notifications) return;
              h("listNotifications, register notification"),
                (this.aria2Notifications = e),
                e.forEach((e) => {
                  this.aria2.on(e, (t) => {
                    h("aria2:", e, t);
                    const r = t[0] && t[0].gid;
                    r || h("notification of unknown gid:", t), this.updateFileStatus(r, e);
                  });
                }),
                this.aria2.on("onDownloadComplete", (e) => {
                  i.YB.emit("download_complete", e);
                });
              const t = await this.aria2.listMethods();
              this.aria2Methods = t;
            }
            async updateFileStatus(e, t = "") {
              if (!this.checkConnection()) return;
              const r = await this.aria2.call("tellStatus", e);
              h("filestatus:", r), (r && !r.errorMessage) || h("fileStatus error:", r), (r.event = t), this.addToFiles(r);
            }
            addToFiles(e) {
              if (!e.gid) return;
              const t = e.files,
                r = t && t[0] && t[0].uris && t[0].uris[0] && t[0].uris[0].uri;
              e.url = r;
              const i = (t && t[0] && t[0].path) || r;
              (e.name = (0, s.WE)(i)),
                (e.completedLength = parseInt(e.completedLength)),
                (e.totalLength = parseInt(e.totalLength)),
                (e.downloadSpeed = "active" === e.status ? parseInt(e.downloadSpeed) : 0),
                (e.uploadSpeed = parseInt(e.uploadSpeed)),
                (e.completedLengthFormat = (0, s.ys)(e.completedLength)),
                (e.totalLengthFormat = (0, s.ys)(e.totalLength)),
                (e.downloadSpeedFormat = (0, s.ys)(e.downloadSpeed)),
                (e.uploadSpeedFormat = (0, s.ys)(e.uploadSpeed)),
                (e.completePercent = e.totalLength ? e.completedLength / e.totalLength : 0),
                (e.completePercentFormat = Math.round(100 * e.completePercent) + "%"),
                e.totalLength === e.completedLength && e.totalLength && "active" === e.status && (e.status = "complete");
              const o = this.proxy.files.find((t) => t.gid === e.gid);
              if (o) Object.assign(o, e);
              else {
                if ((h("add new file to files"), e.following)) {
                  const t = this.files.findIndex((t) => t.gid === e.following);
                  if (t > -1) return void this.proxy.files.splice(t, 1, e);
                } else if (e.followedBy) {
                  const t = e.followedBy[0];
                  if ((h("followedId:", t), t)) {
                    const e = this.files.findIndex((e) => e.gid === t);
                    if (e > -1) return void h("followed is exist");
                  }
                }
                e.name || (e.name = "new file"), this.proxy.files.push(e);
              }
            }
            findFile(e) {
              return this.files.find((t) => 0 === t.gid.indexOf(e)) || {};
            }
            async getFileStatus(e) {
              if (!this.checkConnection()) return;
              const t = await this.aria2.call("tellStatus", e);
              return h("fileFromServer:", t), t;
            }
            refresh() {
              this.checkConnection() && this.getAll();
            }
            async getAll() {
              if (!this.checkConnection()) return void this.proxy.files.splice(0, this.files.length);
              const e = [["tellActive"], ["tellWaiting", 0, 100], ["tellStopped", 0, 100]],
                t = await this.aria2.batch(e),
                r = await Promise.all(t);
              h("get AllResults:", r),
                this.proxy.files.splice(0, this.files.length),
                r.forEach((e) => {
                  e.forEach((e) => {
                    this.addToFiles(e);
                  });
                });
            }
            async getActive() {
              if (!this.checkConnection()) return;
              const e = await this.aria2.call("tellActive");
              h("active list:", e),
                e.forEach((e) => {
                  this.addToFiles(e);
                });
            }
            async getWaiting() {
              if (!this.checkConnection()) return;
              const e = await this.aria2.call("tellWaiting", 0, 10);
              h("waiting list:", e),
                e.forEach((e) => {
                  this.addToFiles(e);
                });
            }
            async getStopped() {
              if (!this.checkConnection()) return;
              const e = await this.aria2.call("tellStopped", 0, 10);
              h("stopped list:", e),
                e.forEach((e) => {
                  this.addToFiles(e);
                });
            }
            checkConnection() {
              return this.downloaderRunning ? this.connected : (s.t5.warning(s.ag.t("Downloader is turn off, Please turn on first")), !1);
            }
            async addTask(e, t, r = "uri") {
              let i;
              if ((this.startTimer(), "uri" === r)) {
                this.btTrackers && e.toLowerCase().startsWith("mag") && (t["bt-tracker"] = this.btTrackers);
                const r = e
                  .split("\n")
                  .map((e) => e.trim())
                  .filter((e) => e);
                if (1 === r.length) i = await this.aria2.call("addUri", r, t);
                else {
                  const e = [];
                  r.forEach((r) => {
                    e.push(["addUri", [r], t]);
                  }),
                    (i = await this.aria2.batch(e));
                }
              } else (e = e.trim()), (i = await this.aria2.call("addTorrent", e, [], t));
              return setTimeout(this.refresh.bind(this), 500), i;
            }
            async pause(e) {
              if (this.checkConnection())
                try {
                  const t = await this.aria2.call("forcePause", e);
                  h("pause res:", t);
                } catch (t) {
                  h("pause error:", t);
                }
            }
            async resume(e) {
              if (this.checkConnection()) {
                this.startTimer();
                try {
                  const t = await this.aria2.call("unpause", e);
                  h("resume res:", t);
                } catch (t) {
                  h("resume error:", t);
                }
              }
            }
            async pauseAll() {
              if (this.checkConnection())
                try {
                  const e = await this.aria2.call("forcePauseAll");
                  h("pauseAll res:", e);
                } catch (e) {
                  h("pauseAll error:", e);
                }
            }
            async resumeAll() {
              if (this.checkConnection()) {
                this.startTimer();
                try {
                  const e = await this.aria2.call("unpauseAll");
                  h("resumeAll res:", e);
                } catch (e) {
                  h("resumeAll error:", e);
                }
              }
            }
            async restart(e) {
              if (!this.checkConnection()) return;
              this.startTimer();
              const t = await this.getFileStatus(e);
              if (!t.url) return void h("restart error:no url");
              const r = t.files[0].uris,
                i = r.map((e) => e.uri),
                o = await this.aria2.call("addUri", i, {});
              return o;
            }
            async remove(e) {
              if (!this.checkConnection()) return;
              const t = await this.getFileStatus(e);
              t && this.tryRemove(t), setTimeout(this.refresh.bind(this), 500);
            }
            async tryRemove(e, t) {
              const r = ["removeDownloadResult", "forceRemove"],
                i = t || ["error", "complete", "removed"].includes(e.status) ? "removeDownloadResult" : "forceRemove";
              try {
                const t = await this.aria2.call(i, e.gid);
                if ((h("remove result:", t), "OK" === t || t === e.gid)) {
                  const t = this.files.findIndex((t) => t.gid === e.gid);
                  t > -1 && this.proxy.files.splice(t, 1);
                }
              } catch (o) {
                if ((h("remove error:", o.message), !t)) {
                  const t = r.find((e) => e !== i);
                  return this.tryRemove(e, t);
                }
                h("remove fail:", o.message);
              }
            }
            async openSettings() {
              if (!this.checkConnection()) return;
              this.showSettings = !0;
              const e = await this.aria2.call("getGlobalOption");
              h("globalConfig:", e),
                this.globalSettings.forEach((t) => {
                  t.value = e[t.option] || "";
                });
            }
            async saveGlobalSettings() {
              if (!this.checkConnection()) return;
              const e = {};
              this.globalSettings.forEach((t) => {
                e[t.option] = t.value.toString();
              }),
                (e["max-connection-per-server"] = e.split),
                h("newConfig", e);
              const t = await this.aria2.call("changeGlobalOption", e);
              h("save config:", t), "OK" === t ? window.electronAPI.downloader.saveConfig(e) : s.t5.error(s.ag.t("Save Error")), (this.showSettings = !1);
            }
            async getFileOption(e) {
              return await this.aria2.call("getOption", e);
            }
            async changeFileOption(e, t) {
              return await this.aria2.call("changeOption", e, t);
            }
            async getGlobalOption() {
              return await this.aria2.call("getGlobalOption");
            }
            async changeGlobalOption(e) {
              return await this.aria2.call("changeGlobalOption", e);
            }
            async loadTrackers() {
              const e = "https://cdn.jsdelivr.net/gh/ngosang/trackerslist@master/trackers_best_ip.txt";
              try {
                const t = await l.axios.get(e),
                  r = t.data.split("\n\n");
                h("trackerList", r), (this.btTrackers = r.filter((e) => e).join(","));
              } catch (t) {
                h("loadTrackers error:", t);
              }
            }
          }
          const p = r(99349)("downloaderService.js"),
            A = window.electronAPI ? new u().proxy : null,
            m = (0, a.qj)(new Map());
          function f() {
            return A;
          }
          async function g(e, t) {
            if (!A) throw new Error("no downloader");
            if ("start" !== e && !A.connected) throw new Error("disconnected");
            let r;
            switch (e) {
              case "start":
                A.startDownloader(),
                  (r = await new Promise((e) => {
                    A.once("connect", () => {
                      e("ok");
                    });
                  }));
                break;
              case "stop":
                A.stopDownloader(),
                  (r = await new Promise((e) => {
                    A.once("disconnect", () => {
                      e("ok");
                    });
                  }));
                break;
              case "getAll":
                r = A.files.map((e) => w(e));
                break;
              case "addTask":
                r = await A.addTask(...t);
                break;
              case "pause":
                r = await A.pause(...t);
                break;
              case "resume":
                r = await A.resume(...t);
                break;
              case "remove":
                r = await A.remove(...t);
                break;
              case "removeResult":
                r = await A.remove(...t);
                break;
              default:
                throw (p("remoteCall unkonw:", e), new Error("unknow method"));
            }
            return r;
          }
          function w(e) {
            const t = e.files,
              r = t && t[0] && t[0].uris && t[0].uris[0] && t[0].uris[0].uri,
              i = (t && t[0] && t[0].path) || r,
              o = parseInt(e.completedLength),
              n = parseInt(e.totalLength),
              a = n ? o / n : 0,
              l = o === n && n && "active" === e.status ? "complete" : e.status,
              c = {
                gid: e.gid,
                url: r,
                status: l,
                connections: e.connections,
                infoHash: e.infoHash,
                numSeeders: e.numSeeders,
                name: (0, s.WE)(i),
                completedLength: o,
                totalLength: n,
                downloadSpeed: "active" === e.status ? parseInt(e.downloadSpeed) : 0,
                uploadSpeed: parseInt(e.uploadSpeed),
                completedLengthFormat: (0, s.ys)(e.completedLength),
                totalLengthFormat: (0, s.ys)(e.totalLength),
                downloadSpeedFormat: (0, s.ys)(e.downloadSpeed),
                uploadSpeedFormat: (0, s.ys)(e.uploadSpeed),
                completePercent: a,
                completePercentFormat: Math.round(100 * a) + "%",
                errorMessage: e.errorMessage,
              };
            return c;
          }
          function y() {
            return m;
          }
          i.YB.on("remoteDownloader", async (e, t) => {
            if (!e || !e.payload) return void p("no message");
            const r = e.localPeer,
              i = (0, o.tA)(r);
            if (!t || "account" !== i.scope) return void p("no connection or not same account");
            const s = e.payload;
            if ("control" === s.type) {
              const e = (e, i, o) => {
                const s = { remoteHandler: "remoteDownloader", payload: { type: "data", method: e, running: A && A.downloaderRunning, data: i, error: o && o.message } };
                (0, n.IC)(r, s, t);
              };
              if (!window.electronAPI) return p("local cannot run downloader"), void e(s.method, null, new Error("no downloader"));
              if (!s.method) return p("no action"), void e(s.method, null, new Error("no action"));
              try {
                const t = await g(s.method, s.params);
                e(s.method, t);
              } catch (a) {
                e(s.method, null, a);
              }
            } else {
              let e = m.get(r);
              e || (m.set(r, { remotePeer: r, enabled: !0, downloaderRunning: s.running, files: [] }), (e = m.get(r))),
                (e.downloaderRunning = s.running),
                e.downloaderRunning ? (s.data && "getAll" === s.method ? Array.isArray(s.data) && e.files.splice(0, e.files.length, ...s.data) : p("downloader response data:", s.method, s.data)) : e.files.splice(0, e.files.length);
            }
          });
        },
        56999: (e, t, r) => {
          "use strict";
          r.d(t, { PJ: () => Z, VH: () => _, xQ: () => W, ii: () => V, Ej: () => E, yL: () => H, $O: () => x, rl: () => z, CP: () => T, Cf: () => M, ti: () => R, cS: () => G, e3: () => j, Vl: () => O, wC: () => L, cq: () => F });
          r(24124), r(7098), r(92100), r(65663), r(10071), r(76701), r(43610), r(67280);
          var i = r(78999),
            o = r(77597),
            n = r(95911),
            s = r(87035),
            a = r(7097),
            l = r(38445),
            c = r(49575),
            d = r(61959),
            h = r(99715),
            u = r(54523);
          const p = { request: "request", response: "response", share_request: "share_request", share_response: "share_request", share_list: "share_list" };
          var A = r(50895),
            m = r(23503),
            f = r(71178),
            g = r(4585),
            w = r(58703),
            y = r(84350),
            v = r(12552),
            b = r(40019);
          const S = r(40399),
            P = r(99349)("ShareService.js");
          s.YB.on("linked_remote", (e, t) => {
            setTimeout(() => {
              (0, A.V0)(e, t);
            }, 500);
          }),
            s.YB.on(p.request, async (e, t) => {
              P("SHARE_SERVICES.request", e);
              let r = 0,
                i = 0,
                s = "";
              const c = e.payload ? e.payload.url : e.url;
              (r = e.offset ? e.offset : 0), (i = e.size ? e.size : 0), (s = e.sort ? e.sort : "-lastModified");
              const d = e.localPeer || e.clientId,
                h = (0, o.tA)(d),
                u = (h && h.scope) || o.tP.group;
              if (Q(u)) {
                if (c)
                  try {
                    const h = new l.dq(c);
                    if (h.peerId === o.l6.peerId) {
                      P("get ppUrl of mine:", h);
                      const l = await x(h.groupId);
                      let u = [];
                      if (l) {
                        const e = h.fullPath,
                          t = (await N(e, !1, r, i, s)) || [];
                        u = t.map((e) => new m.pR(e));
                      }
                      const A = { type: p.response, remoteHandler: p.response, url: c, offset: r, size: i, relay: e.relay, message: JSON.stringify(u) };
                      if (e.relay) {
                        P("send response by wss:");
                        const e = { type: a.w4.transfer, clientId: o.l6.peerId, receiver: d, payload: A };
                        (0, n.fT)(e, !1);
                      } else (0, n.IC)(d, A, t);
                    }
                  } catch (A) {
                    b.error("request error:", A);
                  }
              } else if ((P("share is disabled"), !e.relay)) {
                const e = { type: p.response, remoteHandler: p.response, url: c, data: [] };
                (0, n.IC)(d, e, t);
              }
            }),
            s.YB.on(p.response, (e, t) => {
              P("SHARE_SERVICES.response", e);
              const r = e.url;
              if (!r) return;
              const i = e.offset || 0,
                o = e.size || void 0,
                n = r + "#" + i;
              let s = [];
              try {
                e.data ? (s = e.data) : e.message && (s = JSON.parse(e.message)), P("SHARE_SERVICES.response", s);
              } catch (h) {
                b.error("share response parse error", h), (s = null);
              } finally {
                I(n, s);
              }
              const a = z(r);
              (0 !== i && 0 !== o) || a.splice(0, a.length);
              const c = new l.dq(r);
              if (s && Array.isArray(s)) {
                const e = s.map((e) => (e.relativePath ? (e.ppurl = l.dq.stringify({ groupId: c.groupId, peerId: c.peerId, path: e.relativePath })) : e.url && (e.ppurl = l.dq.urlFormat(e.url, c.peerId)), (e.id = e.ppurl), (e.service = "share"), (0, d.qj)(new w.dj(e))));
                a.push(...e);
              } else P("getPeerGroupData over ws error");
            }),
            s.YB.on(p.share_list, async (e, t) => {
              if (1 === e.requestVersion) {
                const r = e.payload.ppUrl,
                  i = e.payload.service,
                  s = e.payload.deep,
                  a = { status: 200, data: "" };
                if (!i || "share" === i) {
                  const r = (0, o.tA)(e.localPeer),
                    i = r && r.scope;
                  if (!Q(i)) return (a.status = 403), (0, n.xd)(a.status, a.data, e, t);
                }
                const l = await (0, m.C9)(r, i, s),
                  c = l ? l.map((e) => new m.pR(e)) : null;
                return (a.data = c ? JSON.stringify(c) : ""), (a.status = l ? 200 : 404), (0, n.xd)(a.status, a.data, e, t);
              }
              const r = e.payload,
                i = r.url,
                s = e.localPeer,
                a = e.localHandler;
              if (!a) return void P("no remote handler for result, stop here");
              const l = r.deep;
              let c = [];
              const d = (0, o.tA)(s),
                h = d && d.scope;
              if (Q(h))
                try {
                  const e = await D(i, l);
                  c = e.map((e) => new m.pR(e));
                } catch (A) {
                  b.error(p.list + " error:", A);
                }
              const u = { remoteHandler: a, message: JSON.stringify(c) };
              (0, n.IC)(s, u, t);
            }),
            s.YB.on("share_search", async (e, t) => {
              const r = e.payload;
              if (!r || !r.name || !r.ppUrl) return void (0, n.xd)(400, "less parameters", e, t);
              const i = { status: 400, data: "" },
                o = e.localPeer,
                a = r.streamId;
              try {
                if (e.cancelSearch) await J(a), (i.status = 200);
                else {
                  const e = (e) => {
                    const t = { remoteHandler: a, payload: new m.pR(e) };
                    (0, n.IC)(o, t);
                  };
                  s.YB.on(a, e);
                  const t = await K(r.name, r.ppUrl, a);
                  s.YB.off(a, e), (i.status = 200), (i.data = t);
                }
              } catch (l) {
                (i.status = l.code), (i.data = l.message);
              } finally {
                (0, n.xd)(i.status, i.data, e);
              }
            });
          const C = new Map();
          function k(e, t) {
            C.set(e, t);
          }
          function I(e, ...t) {
            const r = C.get(e);
            r && "function" === typeof r && (r(...t), C.delete(e));
          }
          async function T(e) {
            return await (0, n.W0)(e, null, { scope: o.tP.group });
          }
          async function D(e, t = !1) {
            const r = new l.dq(e),
              i = await x(r.groupId);
            let o = [];
            if (i) {
              const e = r.fullPath;
              o = await N(e, t);
            }
            return o;
          }
          async function E(e, t, r = !0, i = "transfer") {
            const o = { ppUrl: t, url: t, deep: r, service: i };
            let s = [];
            try {
              const t = await (0, n.e0)(e, p.share_list, o);
              let r;
              (r = t.response ? t.data : t.message), r && (s = JSON.parse(r));
            } catch (a) {
              b.error("ppUrl: " + t + " get children", a);
            }
            return s;
          }
          async function R(e = "", t = !1, r = 0, s = 0, a = "-lastModified") {
            P("readPPPath, ppurl, preview, offset, size, sort:", e, t, r, s, a);
            try {
              const i = new l.dq(e);
              if (i.peerId === g.KB || i.peerId === o.l6.peerId) {
                const t = await x(i.groupId);
                if (null === t) return null;
                const o = i.fullPath,
                  n = await N(o, !1, r, s, a),
                  c = z(e);
                0 === r && c.splice(0, c.length);
                const h = n.map((e) => {
                  e.relativePath ? (e.ppurl = l.dq.stringify({ groupId: i.groupId, peerId: i.peerId, path: e.relativePath })) : e.url && (e.ppurl = l.dq.urlFormat(e.url, i.peerId)), (e.id = e.ppurl), (e.service = "share");
                  const t = (0, d.qj)(new w.dj(e));
                  return t.previewUrl && (t.bigThumbnail = t.previewUrl), t;
                });
                return c.push(...h), h;
              }
              {
                const e = (0, o.tA)(i.peerId);
                if (!t || (e && e.connected)) {
                  await T(i.peerId), P("read path from remote peer");
                  const e = { type: p.request, remoteHandler: p.request, url: i.url, clientId: o.l6.peerId, offset: r, size: s, sort: a };
                  (0, n.IC)(i.peerId, e);
                } else P("read path from cached");
                return new Promise((e, t) => {
                  const o = i.url + "#" + r;
                  k(o, e),
                    setTimeout(() => {
                      t(new Error("timeout"));
                    }, 3e3);
                });
              }
            } catch (c) {
              b.error("readPPPath", c), i.t5.warning(i.ag.t(c.message));
            }
            return [];
          }
          async function B() {
            const e = await (0, h.z7)();
            return e;
          }
          async function x(e) {
            return void 0 === e ? null : e;
          }
          async function F(e) {
            const t = l.dq.getUrlFromPPURL(e);
            P("unshare:", t);
            const r = t.split("/");
            if (r.length < 2) return !1;
            let i = await S.unshare(t);
            return i && (i = await (0, h.ih)(r[0], t)), i;
          }
          async function N(e, t = !1, r = 0, i = 0, o = "-lastModified") {
            P("lsInLocal offset size, sort:", e, r, i, o);
            let n = [];
            try {
              const s = await S.lsInLocal(e, t, r, i, o);
              P("files from native", s), (n = s);
            } catch (s) {
              return b.error("error:", s), null;
            }
            return n;
          }
          async function O(e) {
            if (!S.showInExplorer) return !1;
            const t = await S.showInExplorer(e);
            return P("showInExplorer:", t, e), null === t && Y(e), t;
          }
          async function M(e) {
            const t = l.dq.getUrlFromPPURL(e);
            if (!S.openPath) return !1;
            const r = await S.openPath(t);
            return P("openPath:", t, r), null === r && Y(t), r;
          }
          const U = (0, d.qj)(new Map());
          function z(e) {
            return U.has(e) || U.set(e, (0, d.qj)([])), U.get(e);
          }
          async function H(e, t = !1) {
            if ((!e || "0" === e) && !o.l6.token) return [];
            const r = { type: "groupInfo", value: e, summary: t },
              i = { type: a.w4.sync, payload: r };
            try {
              const t = await (0, n.fH)(i, !1);
              if (t.peers && Array.isArray(t.peers))
                return (
                  t.peers.forEach((t) => {
                    const r = l.dq.stringify({ groupId: e, peerId: t });
                    U.has(r) || U.set(r, (0, d.qj)([]));
                  }),
                  t.peers
                );
            } catch (s) {
              b.error("getGroupInfo:", s);
            }
            return [];
          }
          function _() {
            U.clear();
          }
          (0, d.qj)([]);
          async function L() {
            const e = await B(),
              t = o.l6.groups;
            t &&
              t.forEach((t) => {
                const r = e.findIndex((e) => e.groupId === t.groupId);
                -1 === r && (0, c.my)(new u.p({ name: t.name, password: t.password, groupId: t.groupId }));
              });
          }
          const W = (0, d.iH)("");
          function q() {
            W.value = V();
          }
          function V() {
            const e = (0, o.h7)("enableShare");
            return e || o.tP.account;
          }
          async function j(e) {
            const t = e || o.tP.account;
            (0, o.m3)("enableShare", t), q();
            const r = { type: a.w4.sync, payload: { type: "setOption", option: "disableShare", value: "none" !== t ? 0 : 1 } };
            try {
              await (0, n.fH)(r, !0), i.t5.success(i.ag.t("Setting success"));
            } catch (s) {
              b.error(s), i.t5.error({ type: "negative", message: i.ag.t("Setting fail") });
            }
          }
          function Q(e) {
            if (!e) return !1;
            const t = V();
            return t === o.tP.group || t === e;
          }
          function Y(e) {
            i.t5.error(i.ag.t("file not exist"));
          }
          async function G(e, t, r) {
            if (!e || !t) return [];
            if (!l.dq.isPPUrl(t)) throw new Error("invalid ppUrl");
            const i = new l.dq(t);
            if ([g.KB, o.l6.getPeerId()].includes(i.peerId)) return P("searchFilesByPPUrl localhost"), await K(e, t, r);
            {
              P("searchFilesByPPUrl remote"), await T(i.peerId);
              const o = { name: e, ppUrl: t, streamId: r };
              return await (0, n.e0)(i.peerId, "share_search", o, null, 18e4);
            }
          }
          async function Z(e, t) {
            if (!e) return [];
            if (!l.dq.isPPUrl(e)) throw new Error("invalid ppUrl");
            const r = new l.dq(e);
            if ([g.KB, o.l6.getPeerId()].includes(r.peerId)) return P("cancelSearchFilesByPPUrl local"), J(t);
            {
              P("cancelSearchFilesByPPUrl remote");
              const i = { ppUrl: e, streamId: t, cancelSearch: !0 };
              return await (0, n.e0)(r.peerId, "share_search", i, null, 18e3);
            }
          }
          async function J(e) {
            if (!e) throw new Error("no streamId");
            return await S.cancelSearch(e);
          }
          async function K(e, t, r = null) {
            if (o.l6.isWeb) return await S.searchFiles(e, t, r);
            const i = await X(e, t);
            if ((P("searchFilesInLocal, fileInfo, ppUrl, streamId:", i, t, r), r)) {
              i.matched.forEach((e) => {
                const t = new m.pR(e);
                s.YB.emit(r, t);
              });
              const t = await S.searchFiles(e, i.directories, r);
              return P("sonEntriesCount:", t), t;
            }
            {
              const t = [];
              i.matched.forEach((e) => {
                const r = new m.pR(e);
                t.push(r);
              });
              const r = await S.searchFiles(e, i.directories);
              return (
                r.files.forEach((e) => {
                  const r = new m.pR(e);
                  t.push(r);
                }),
                t
              );
            }
          }
          async function X(e, t) {
            const { groupId: r, childRoot: i, relativePath: o } = (0, f.e)(t),
              n = await (0, h.MR)(r);
            P("searchFilesInDb groupId:", r);
            const s = [],
              a = [],
              l = (0, y.CZ)(e);
            if (i) {
              const e = await (0, v.id)(t);
              e && a.push({ relativePath: o, path: e, groupId: r });
            } else
              n.forEach((e) => {
                l.test(e.name) && s.push(e), "dir" === e.type && (!e.relativePath && e.url && (e.relativePath = e.url.split("/").slice(1).join("/")), e.relativePath && a.push({ relativePath: e.relativePath, path: e.path, groupId: r }));
              });
            return { matched: s, directories: a };
          }
          setTimeout(q, 300), P.enabled && (window.ShareService = { peerGroupDataCached: U, listDirectory: D });
        },
        49575: (e, t, r) => {
          "use strict";
          r.d(t, { gb: () => w, my: () => m, pK: () => f, z7: () => A });
          r(24124);
          var i = r(78999),
            o = r(26388),
            n = r(95911),
            s = r(7097),
            a = r(77597),
            l = r(13895),
            c = r(54523),
            d = r(99715),
            h = r(40019);
          const u = null,
            p = "/api/user/leaveOutGroup";
          async function A() {
            return a.l6.groups;
          }
          async function m(e) {
            const t = new c.p(e);
            try {
              return u && u.addNewGroupInLocal && (await u.addNewGroupInLocal(e)), await (0, d.pw)(t);
            } catch (r) {
              return h.error("addNewGroup Error:", r), i.t5.error(r.message), !1;
            }
          }
          async function f(e) {
            try {
              const t = await o.axios.post(p, { groupId: e.groupId }),
                r = t.data.status,
                n = t.data.data;
              if (200 === r) {
                let t = !0;
                return (0, l.lu)("browser", !1) && (t = await g(e)), w("exit", e), t;
              }
              i.t5.error(n.message);
            } catch (t) {
              const e = t.response.status;
              i.t5.error(i.ag.t("error:" + e));
            }
            return !1;
          }
          async function g(e) {
            if (!u) return null;
            try {
              await (0, d.uf)(e.groupId);
              const t = await u.deleteGroupInLocal(e);
              return t;
            } catch (t) {
              return h.error("deleteGroup Error:", t), i.t5.error(t.message), !1;
            }
          }
          function w(e, t) {
            t && t.groupId && "0" !== t.groupId && ("join" === e ? (a.l6.addGroup(t, "allLocation"), y(t.groupId)) : "exit" === e && (a.l6.deleteGroup(t.groupId), v(t.groupId)));
          }
          function y(e) {
            const t = { type: "joinGroup", value: e },
              r = { payload: t, type: s.w4.sync };
            (0, n.fH)(r)
              .then(() => {})
              .catch((e) => {
                h.error("notifyWsOfJoinGroup error:", e);
              });
          }
          function v(e) {
            const t = { type: "exitGroup", value: e },
              r = { payload: t, type: s.w4.sync };
            (0, n.fH)(r)
              .then(() => {})
              .catch((e) => {
                h.error("notifyWsOfExitGroup erro:", e);
              });
          }
        },
        50895: (e, t, r) => {
          "use strict";
          r.d(t, { V0: () => h, cI: () => l });
          r(24124), r(43610);
          var i = r(77597),
            o = r(95911),
            n = r(61959);
          const s = null,
            a = r(99349)("localServerInfo.js"),
            l = (0, n.qj)({});
          async function c() {
            return !!s && (await s.getLocalServer());
          }
          async function d() {
            a("updateLocalServerInfo");
            try {
              const e = await c();
              e && ((l.port = e.port), (l.testPort = e.testPort || e.port), (l.upnpPort = e.upnpPort || e.port), (l.externalIp = e.externalIp || e.ip), (l.rootDir = e.rootDir));
            } catch (e) {
              a("updateLocalServerInfo err:", e);
            }
          }
          function h(e, t) {
            if (!s || !t) return;
            let r;
            const n = t.peer;
            n && ((r = n.localAddress), (r && !r.includes(".local") && "relay" !== t.connectType) || (r = ""));
            const a = { ip: r || l.externalIp, port: l.port, testPort: l.testPort, upnpPort: l.upnpPort },
              c = { type: i.Nw.sync, payload: { clientId: i.l6.peerId, localServer: a } };
            (0, o.IC)(e, c, t);
          }
          s &&
            d()
              .then(() => {
                a("updateLocalServerInfo success:", l);
              })
              .catch((e) => {
                a("updateLocalServerInfo error:", e);
              }),
            a.enabled && (window.localServerInfo = { localServer: l, updateLocalServerInfo: d });
        },
        40399: (e, t, r) => {
          "use strict";
          r.r(t),
            r.d(t, { cancelSearch: () => k, createFileItem: () => v, getByUrl: () => A, getDirectoryWithChildrenByPPUrl: () => S, getDisplayPath: () => I, getLocalPathByRelativePath: () => T, lsInLocal: () => p, searchFiles: () => C, shareDirectory: () => g, shareFiles: () => f, unshare: () => y });
          r(24124), r(7098), r(65663), r(43610), r(10071), r(76701), r(67280);
          var i = r(99715),
            o = r(38445),
            n = r(78999),
            s = r(84350),
            a = r(87035),
            l = r(71178),
            c = r(40019);
          const d = r(20180),
            h = r(99349)("ShareFilesInBrowser.js"),
            u = "db://";
          async function p(e, t = !1, r = 0, o = 0, n = "-lastModified") {
            if (!e) return null;
            const a = e.split("/"),
              l = a[0];
            let d = [];
            try {
              const t = await (0, i.OJ)(l),
                a = IDBKeyRange.only(e),
                c = await t.readRecordsByIndexCursor(l, "dir", a, () => {}, "next", 0, 0);
              if (Array.isArray(c)) {
                c.sort((0, s.hN)(n));
                const e = c.length,
                  t = Math.min(e, r),
                  i = o ? Math.min(e, r + o) : e;
                d = c.slice(t, i);
              } else d = c;
            } catch (h) {
              c.error("error:", h);
            }
            return d;
          }
          async function A(e) {
            if (!e) return null;
            const t = e.split("/"),
              r = t[0];
            try {
              const t = await (0, i.OJ)(r),
                o = await t.readOneRecordByIndex(r, "url", e);
              return o;
            } catch (o) {
              return c.error("share file:", o), !1;
            }
          }
          async function m(e) {
            const t = e.split("/")[0],
              r = await (0, i.OJ)(t),
              o = IDBKeyRange.only(e);
            return await r.readRecordsByIndexCursor(t, "dir", o);
          }
          async function f(e, t) {
            t instanceof File && (t = [t]);
            const r = [],
              o = [],
              a = await m(e),
              l = async (t, i, o, n) => {
                const a = { groupId: e, name: t.name, url: n, type: t.type, root: "", dir: i, path: o, size: t.size, lastModified: t.lastModified, file: t };
                if ((0, s.Or)(t.type, t.name))
                  try {
                    a.thumbnailSrc = await (0, s.R8)(t);
                  } catch (l) {
                    c.error("share file, get thumbnail error:", l);
                  }
                r.push(a);
              };
            for (let n = 0; n < t.length; n++) {
              const r = t[n];
              if (!(r instanceof File)) continue;
              const s = e,
                c = d.join(s, r.name),
                p = u + c,
                A = a.find((e) => e.url === c);
              if (A)
                if (A.size === r.size && A.lastModified === r.lastModified) o.push(r);
                else
                  try {
                    const e = (0, i.hx)(c, a);
                    await l(r, s, p, e);
                  } catch (h) {
                    o.push(r);
                  }
              else await l(r, s, p, c);
            }
            if (0 !== r.length)
              try {
                const t = await (0, i.OJ)(e);
                return await t.addBulkRecords(e, r), o.length > 0 ? (n.t5.warning(n.ag.t("Some files duplicate")), !1) : (n.t5.success(n.ag.t("share success")), !0);
              } catch (p) {
                return c.error("share file err:", p), n.t5.error(n.ag.t("share fail")), !1;
              }
            else n.t5.warning(n.ag.t("Files duplicate"));
          }
          async function g(e, t) {
            if (!t || !(t instanceof FileList)) return void h("fileList error:", t);
            const r = await m(e),
              o = [],
              a = [],
              l = [],
              p = [];
            for (let i = 0; i < t.length; i++) {
              const n = t[i],
                m = n.webkitRelativePath || "";
              if (!m) continue;
              h("file relativePath:", m);
              const f = m.split("/").filter((e) => "" !== e),
                g = f[0];
              if (o.includes(g)) continue;
              if (r.find((e) => e.root === g)) {
                o.push(g);
                continue;
              }
              const y = d.join(e, f.join("/")),
                v = u + y;
              if (r.find((e) => e.url === y)) {
                l.push(y);
                continue;
              }
              const b = w(y, p);
              if (
                (b.forEach((e) => {
                  a.push(e);
                }),
                p.includes(y))
              )
                continue;
              p.push(y);
              const { dir: S } = d.parse(y),
                P = { groupId: e, name: n.name, url: y, type: n.type || "file", root: g, dir: S, path: v, size: n.size, lastModified: n.lastModified, file: n };
              if ((0, s.Or)(n.type, n.name))
                try {
                  P.thumbnailSrc = await (0, s.R8)(n);
                } catch (A) {
                  c.error("share file, get thumbnail error:", A);
                }
              a.push(P);
            }
            if (0 !== a.length)
              try {
                const t = await (0, i.OJ)(e);
                return await t.addBulkRecords(e, a), o.length > 0 ? (n.t5.warning(n.ag.t("Some files duplicate")), !1) : (n.t5.success(n.ag.t("share success")), !0);
              } catch (f) {
                return c.error("share file err:", f), n.t5.error(n.ag.t("share fail")), !1;
              }
            else n.t5.warning(n.ag.t("Files duplicate"));
          }
          function w(e, t) {
            const r = [],
              { dir: i } = d.parse(e),
              o = (i || "").split("/");
            if (o.length < 2 || t.includes(i)) return r;
            for (let n = 2; n <= o.length; n++) {
              const e = o.slice(0, n).join("/");
              if (t.includes(e)) continue;
              t.push(e);
              const i = { groupId: o[0], name: o[n - 1], url: e, type: "dir", root: o[1], dir: o.slice(0, n - 1).join("/"), path: u + e, size: null, lastModified: null };
              r.push(i);
            }
            return r;
          }
          async function y(e) {
            if (!e && "0" !== e) return !1;
            const t = e.split("/"),
              r = t[0],
              o = await (0, i.OJ)(r),
              n = await o.readOneRecordByIndex(r, "url", e);
            if (!n) return !1;
            if ((await o.deleteRecord(r, n.id), "dir" === n.type && n.root)) {
              const e = IDBKeyRange.only(n.root),
                t = await o.readRecordsByIndexCursor(r, "root", e);
              if (t) for (let i = 0; i < t.length; i++) o.deleteRecord(r, t[i].id);
            }
            return !0;
          }
          async function v(e) {
            h("createFileItemInBrowser:", e);
            const t = await A(e);
            return t && t.file && !t.invalid ? t.file : null;
          }
          async function b(e, t, r, i = "", o, n = !1) {
            const s = IDBKeyRange.only(r),
              a = await e.readRecordsByIndexCursor(t, "dir", s);
            for (const l of a) (l.relativePath = d.join(i, l.name)), "dir" === l.type ? n && (await b(e, t, l.url, l.relativePath, o, n)) : o.push(l);
          }
          async function S(e, t) {
            if (!e) throw new Error("no ppurl");
            const r = new o.dq(e),
              n = r.groupId,
              s = r.fullPath,
              a = r.name,
              l = await (0, i.OJ)(n),
              c = [];
            return await b(l, n, s, a, c, t), c;
          }
          const P = [];
          async function C(e, t, r) {
            h("searchFiles:", e, t, r);
            const n = new o.dq(t),
              c = n.groupId,
              d = n.fullPath,
              u = (0, s.CZ)(e),
              p = await (0, i.OJ)(c),
              A = [];
            let m = 0;
            return (
              await p.readAllRecord(
                c,
                (e, t) => {
                  if (e.dir && e.dir.includes(d) && u.test(e.name) && ((e.relativePath = (0, l.e)(e.url).relativePath), r ? (a.YB.emit(r, e), m++) : A.push(e), r && P.includes(r))) {
                    const e = p.count(c);
                    t.advance(e), P.splice(P.indexOf(r), 1);
                  }
                },
                !1
              ),
              r ? m : A
            );
          }
          async function k(e) {
            h("cancelSearch", e), P.push(e);
          }
          function I(e) {
            return e;
          }
          async function T(e, t) {
            if (!e || !t) return "";
            const r = t.split("/");
            return (r[0] = e), r.join("/");
          }
        },
        99715: (e, t, r) => {
          "use strict";
          r.d(t, { MR: () => S, No: () => y, OJ: () => p, hx: () => v, ih: () => b, pw: () => m, uf: () => f, z7: () => A });
          r(24124), r(65663), r(76701);
          var i = r(28144),
            o = r(54523),
            n = r(78999),
            s = r(71178);
          r(40019);
          const a = r(20180),
            l = r(99349)("ShareFilesStore.js"),
            c = "shareFiles",
            d = "groups",
            h = [{ path: "groupId", keyPath: "groupId", options: { unique: !0 } }],
            u = [
              { path: "name", keyPath: "name", options: { unique: !1 } },
              { path: "root", keyPath: "root", options: { unique: !1 } },
              { path: "dir", keyPath: "dir", options: { unique: !1 } },
              { path: "url", keyPath: "url", options: { unique: !0 } },
            ];
          async function p(e) {
            const t = await i.y.getDBByName({ dbName: c });
            return t.db.objectStoreNames.contains(e) || (t.closeDB(), e === d ? await t.openDB(c, t.createStore.bind(t, e, h, { keyPath: "id", autoIncrement: !0 }), t.version + 1) : await t.openDB(c, t.createStore.bind(t, e, u, { keyPath: "id", autoIncrement: !0 }), t.version + 1)), t;
          }
          async function A() {
            const e = await p(d),
              t = (await e.readAllRecord(d)) || [];
            if (0 === t.length) {
              const r = new o.p({ groupId: "0", name: n.ag.t("My private Share"), root: "" });
              await e.addRecord(d, r.toJson()), t.push(r);
            }
            return t;
          }
          async function m(e) {
            if (!e || !(e instanceof o.p)) return !1;
            const t = await p(d),
              r = await t.readOneRecordByIndex(d, "groupId", e.groupId);
            if (r) throw new Error("exist");
            return await t.addRecord(d, e.toJson()), !0;
          }
          async function f(e) {
            if (!e) throw new Error("no target");
            const t = await p(d),
              r = IDBKeyRange.only(e);
            return await t.deleteRecordsByIndex(d, "groupId", r), t.closeDB(), await t.openDB(c, t.deleteStore.bind(t, e), t.version + 1), !0;
          }
          async function g(e, t = 0, r = 0, i = "-lastModified") {
            const o = await w(e);
            return (0, s.V)(o, t, r, i);
          }
          async function w(e) {
            if (!e) return null;
            const t = await p(e),
              r = await t.readAllRecord(e);
            return r;
          }
          async function y(e) {
            if ((l("getShareItemByUrl, url:", e), !e)) return null;
            const t = e.split("/"),
              r = t[0],
              i = await p(r),
              o = await i.readOneRecordByIndex(r, "url", e);
            return o;
          }
          function v(e, t) {
            const r = 1e3,
              { dir: i, name: o, ext: n } = a.parse(e);
            for (let s = 1; s < r; s++) {
              const e = a.join(i, `${o}(${s})${n}`),
                r = t.find((t) => t.url === e);
              if (!r) return e;
            }
            throw new Error("too many same name");
          }
          async function b(e, t) {
            if (!e || !t) return !1;
            Array.isArray(t) || (t = [t]);
            const r = await p(e);
            for (let i = 0; i < t.length; i++) await r.deleteRecordsByIndex(e, "url", IDBKeyRange.only(t[i]));
            return !0;
          }
          async function S(e) {
            const t = await g(e),
              r = [];
            return (
              t &&
                Array.isArray(t) &&
                t.forEach((e) => {
                  e.path && e.url && r.push(e);
                }),
              r
            );
          }
        },
        71178: (e, t, r) => {
          "use strict";
          r.d(t, { V: () => s, e: () => n });
          r(7098);
          var i = r(38445),
            o = r(84350);
          function n(e) {
            if (!e) return null;
            let t;
            e.startsWith(i.dq.protocol) ? ((e = e.slice(i.dq.protocol.length)), (t = e.split("/").slice(1))) : (t = e.split("/"));
            const r = "myShare" === t[0] ? "0" : t[0];
            let o = "",
              n = "",
              s = "";
            return t.length > 1 && ((o = t[1]), (s = t.slice(1).join("/"))), t.length > 2 && (n = t.slice(2).join("/")), { groupId: r, childRoot: o, childPath: n, relativePath: s };
          }
          function s(e, t = 0, r = 0, i) {
            if (!e || !Array.isArray(e)) return [];
            if (t >= e.length) return [];
            if ((e.sort((0, o.hN)(i)), r)) {
              const i = Math.min(t + r, e.length);
              return e.slice(t, i);
            }
            return e;
          }
        },
        54523: (e, t, r) => {
          "use strict";
          r.d(t, { e: () => o, p: () => i });
          class i {
            constructor(e) {
              (this.name = e.name), (this.groupId = e.groupId), (this.root = e.root || this.groupId), (this.password = e.password || void 0);
            }
            toJson() {
              return { name: this.name, groupId: this.groupId, root: this.root, password: this.password };
            }
          }
          class o {
            constructor(e) {
              (this.groupId = e.groupId),
                (this.name = e.name),
                (this.root = e.root || void 0),
                (this.onlineMembers = e.onlineMembers || 1),
                (this.members = e.members || null),
                (this.created = e.created || null),
                (this.online = e.online || e.allLocation || !1),
                (this.local = e.local || e.allLocation || !1);
            }
          }
        },
        53300: (e, t, r) => {
          "use strict";
          r.d(t, { Cj: () => C, Ie: () => E, KM: () => P, Qf: () => R, Rv: () => x, Xt: () => N, eO: () => z, jg: () => O, ku: () => L, lO: () => D, lY: () => _, lc: () => k, pi: () => p, z6: () => b, zu: () => B });
          r(24124), r(43610), r(65663);
          var i = r(21082),
            o = r(87035),
            n = r(77597),
            s = r(95911),
            a = r(78999),
            l = r(7097),
            c = r(12393),
            d = r(61959),
            h = r(40019);
          const u = r(99349)("remoteDesktopService.js"),
            p = 6,
            A = window.screen.width,
            m = window.screen.height,
            f = { 720: { width: 720, height: Math.round((720 * m) / A) }, 1280: { width: 1280, height: Math.round((1280 * m) / A) }, 0: { width: A, height: m } },
            g = { width: f["0"].width, height: f["0"].height, frameRate: 15, cursor: !0 };
          o.YB.on(n.Nw.requestDesktop, async (e, t) => {
            u("messageTypes.requestDesktop", e);
            let r = !1;
            const a = t.remotePeer,
              l = (0, n.tA)(a);
            let d, A;
            if ((N() && (u("desktop is enabled"), e.payload && e.payload.accessCode === w && (u("accessCode match"), y.includes("self") && "account" === l.scope && (r = !0), y.includes(a) && (r = !0))), r)) {
              const e = t;
              try {
                if (((d = await U(g)), u("get stream ready:", d), d)) {
                  const e = (0, c.tF)({ serviceType: p, remotePeer: a });
                  e.length > 0
                    ? (t = e[0])
                    : ((t = (0, c.m$)({ serviceType: p, initiator: !0, remotePeer: a })),
                      await new Promise((e, r) => {
                        let i = !1;
                        t.once("peerConnect", () => {
                          (i = !0), e();
                        }),
                          setTimeout(() => {
                            i || r();
                          }, 5e3);
                      })),
                    t.addStream(d),
                    (A = (0, o.Hj)((e, t) => {
                      const r = e.payload;
                      F(r.inputEvent), r.cmd && "close" === r.cmd && (u("stop stream by remoter"), T(t.stream), t.removeStream(), S(a), t.destroy());
                    })),
                    v.push({ connectedTime: i.ZP.formatDate(Date.now(), "MM-DD HH:mm:ss"), clientName: l.clientName, clientId: l.clientId, icon: l.deviceIcon, state: "connected", localHandler: A }),
                    o.YB.emit("remote_new_remote_desktop"),
                    t.once("peerClose", (e) => {
                      e.stream && (T(e.stream), t.removeStream(), S(e.remotePeer));
                    });
                }
              } catch (b) {
                h.error("requestDesktop error:", b), d && (T(d), (d = null)), (t = e);
              }
            }
            const m = e.localHandler,
              f = { localHandler: A || void 0, remoteHandler: m, payload: { allow: r, streamReady: !!d } };
            (0, s.IC)(a, f, t);
          })
            .on("disconnectDesktop", (e, t) => {
              t.stream && (T(t.stream), t.removeStream(), S(t.remotePeer));
            })
            .on("desktopSetting", async (e, t) => {
              if ((u("desktopSetting:", e), t.stream))
                try {
                  const r = e.payload || {};
                  let i = !1;
                  if (
                    (void 0 !== r.width && r.width !== g.width && ((g.width = f[r.width].width), (g.height = f[r.width].height), (i = !0)),
                    r.frameRate && r.frameRate !== g.frameRate && ((g.frameRate = r.frameRate), (i = !0)),
                    void 0 !== r.cursor && r.cursor !== g.cursor && (g.cursor = r.cursor),
                    !i)
                  )
                    return;
                  const o = t.stream.getVideoTracks()[0];
                  o && (await o.applyConstraints(g));
                } catch (r) {
                  h.error("requestDesktop error:", r);
                }
            });
          let w = z(),
            y = (0, d.qj)(["self"]);
          const v = (0, d.qj)([]);
          function b() {
            return v;
          }
          function S(e) {
            const t = v.findIndex((t) => t.clientId === e);
            t > -1 && (v[t].localHandler && (0, o.vS)(v[t].localHandler), v.splice(t, 1));
          }
          function P(e) {
            (w = e), H(e);
          }
          function C(e) {
            y = e;
          }
          function k() {
            return y;
          }
          function I(e, t) {
            e.addEventListener("removed", () => {
              (t.state = "abort"), a.t5.warning(a.ag.t("Remote desktop is abort"));
            });
          }
          function T(e) {
            e &&
              (u("stop stream:", e),
              e.getTracks().forEach((e) => {
                "ended" !== e.readyState && (e.stop(), e.dispatchEvent(new Event("ended")));
              }));
          }
          function D(e) {
            u("startRemoteDesktop:", e);
            const t = e.connectionPeer.clientId;
            if (!t) return;
            const r = (0, o.Hj)((t, r) => {
                if (!e) return;
                u("startRemoteDesktop callback message:", t);
                const i = t.payload;
                return i.allow
                  ? i.streamReady
                    ? (r.remoteStream
                        ? ((e.state = "connected"), I(r.remoteStream, e))
                        : r.once("peerStream", (t) => {
                            e && ((e.state = "connected"), I(t, e));
                          }),
                      (e.remoteHandler = t.localHandler),
                      void (e.peerChannel = r))
                    : ((e.state = "abort"), void a.t5.warning(a.ag.t("Cannot start remote desktop")))
                  : ((e.state = "abort"), void a.t5.warning(a.ag.t("The request is forbidden")));
              }, !0),
              i = { type: n.Nw.requestDesktop, remotePeer: t, localHandler: r, payload: { accessCode: e.accessCode } };
            (0, s.IC)(t, i);
          }
          function E(e) {
            const t = (0, c.tF)({ remotePeer: e, serviceType: p }),
              r = t.find((e) => !!e.stream);
            r ? (T(r.stream), r.removeStream(), S(e)) : (u("not found peerChannel, remove directly"), S(e));
          }
          function R(e, t) {
            u("startRemoteDesktop:", t);
            const r = e.clientId,
              i = { type: "desktopSetting", remoteHandler: "desktopSetting", payload: { ...t } },
              o = (0, c.tF)({ remotePeer: r, serviceType: p });
            o && o.length > 0 && (0, s.IC)(r, i, o[0]);
          }
          function B(e) {
            if (!e || !e.peerChannel || !e.peerChannel.remoteStream) return;
            const t = e.remoteHandler,
              r = { remotePeer: e.clientId, remoteHandler: t, payload: { cmd: "close" } };
            T(e.peerChannel.remoteStream), (0, s.IC)(e.connectionPeer.clientId, r, e.peerChannel);
          }
          function x(e, t) {
            if (!e || !t) return;
            const r = t.remoteHandler;
            if (!r) return void u("not find remoteHandler:", t);
            const i = { remoteHandler: r, payload: { inputEvent: e } };
            (0, s.IC)(t.connectionPeer.clientId, i, t.peerChannel);
          }
          async function F(e) {
            if (e) return await window.electronAPI.client.onInputEvent(e);
          }
          function N() {
            const e = (0, n.h7)("enableDesktop");
            return !("disabled" === e);
          }
          async function O(e) {
            const t = e ? "enabled" : "disabled";
            (0, n.m3)("enableDesktop", t);
            const r = { type: l.w4.sync, payload: { type: "setOption", option: "enableDesktop", value: "enabled" === t ? 0 : 1 } };
            try {
              await (0, s.fH)(r, !0), a.t5.success(a.ag.t("Setting success"));
            } catch (i) {
              h.error(i), a.t5.error(a.ag.t("Setting fail"));
            }
          }
          function M(e, t) {
            "contentHint" in e ? ((e.contentHint = t), e.contentHint !== t && h.error(`Invalid video track contentHint: "${t}"`)) : h.error("MediaStreamTrack contentHint attribute not supported");
          }
          async function U({ width: e, height: t, frameRate: r, cursor: i }) {
            if (!window.electronAPI.desktopCapturerSources) return null;
            u("getDesktopStrem:", e, t, r);
            try {
              const n = await window.electronAPI.desktopCapturerSources({ types: ["screen"], thumbnailSize: { width: 0, height: 0 } });
              if ((u("all sources:", n), n && n.length > 0)) {
                const s = async (o = !0) => {
                  const s = { video: { mandatory: { chromeMediaSource: "desktop", minWidth: e, maxWidth: e, minHeight: t, maxHeight: t, minFrameRate: r, maxFrameRate: r }, cursor: i ? "always" : "never" } };
                  return n.length > 1 && (s.video.mandatory.chromeMediaSourceId = n[0].id), o && (s.audio = { mandatory: { chromeMediaSource: "desktop" } }), await navigator.mediaDevices.getUserMedia(s);
                };
                let a = null;
                try {
                  a = await s();
                } catch (o) {
                  u("getmediastream err:", o.toString()), o.toString().includes("audio") && (u("get stream of none audio"), (a = await s(!1)));
                }
                if (a) {
                  const e = a.getVideoTracks()[0];
                  M(e, "text"), u("desktopCapture videoTrack, muted:", e, e && e.muted);
                }
                return a;
              }
              return h.error("none sources"), u("none sources"), null;
            } catch (n) {
              return h.error("openDesktopStream error:", n), u("getDesktopStreamOfElectron error:", n), null;
            }
          }
          function z() {
            if (!_()) return "";
            const e = (0, n.h7)("storeAC");
            return e;
          }
          function H(e) {
            _() && (e ? (0, n.m3)("storeAC", e) : (0, n.Vu)("storeAC", e));
          }
          function _() {
            const e = (0, n.h7)("enableStoreAC");
            return !("disabled" === e);
          }
          function L(e) {
            const t = e ? "enabled" : "disabled";
            (0, n.m3)("enableStoreAC", t), H(e ? w : "");
          }
        },
        24084: (e, t, r) => {
          "use strict";
          r.d(t, { Ex: () => L, Q6: () => z, ed: () => C, kV: () => x, s9: () => F, vi: () => G });
          r(10071), r(24124), r(43610), r(65663), r(92100), r(17965), r(66016), r(60979), r(76105), r(15123), r(88836), r(4331), r(57648), r(98685), r(12396);
          var i = r(61959),
            o = r(63070),
            n = r(13369),
            s = r(87684),
            a = r(62723),
            l = r(36970),
            c = r(86815),
            d = r(26017),
            h = r(44688),
            u = r(87035),
            p = r(78999),
            A = r(95911),
            m = r(53300),
            f = r(77597),
            g = r(12393),
            w = r(11267),
            y = r(49922),
            v = r(40019);
          const b = r(24636),
            S = r(99349)("terminalService.js"),
            P = "requestTerminal",
            C = (0, i.qj)([]),
            k = new Map(),
            I = [
              {
                id: 1,
                name: p.ag.t("Deep theme"),
                preview: "",
                options: {
                  foreground: "#cdcdcd",
                  background: "#000000",
                  cursor: "#d0d0d0",
                  black: "#000000",
                  brightBlack: "#535353",
                  red: "#d11600",
                  brightRed: "#f4152c",
                  green: "#37c32c",
                  brightGreen: "#01ea10",
                  yellow: "#e3c421",
                  brightYellow: "#ffee1d",
                  blue: "#5c6bfd",
                  brightBlue: "#8cb0f8",
                  magenta: "#dd5be5",
                  brightMagenta: "#e056f5",
                  cyan: "#6eb4f2",
                  brightCyan: "#67ecff",
                  white: "#e0e0e0",
                  brightWhite: "#f4f4f4",
                  selectionBackground: "#7a7a7a",
                },
              },
              {
                id: 2,
                name: p.ag.t("Bright theme"),
                preview: "",
                options: {
                  foreground: "#4d4d4c",
                  background: "#ffffff",
                  cursor: "#4d4d4c",
                  black: "#000000",
                  brightBlack: "#000000",
                  red: "#c82829",
                  brightRed: "#c82829",
                  green: "#718c00",
                  brightGreen: "#718c00",
                  yellow: "#eab700",
                  brightYellow: "#eab700",
                  blue: "#4271ae",
                  brightBlue: "#4271ae",
                  magenta: "#8959a8",
                  brightMagenta: "#8959a8",
                  cyan: "#3e999f",
                  brightCyan: "#3e999f",
                  white: "#ffffff",
                  brightWhite: "#ffffff",
                  selectionBackground: "#acacac",
                },
              },
            ];
          u.YB.on(P, async (e, t) => {
            let r = !1;
            const i = t.remotePeer,
              o = ((0, f.tA)(i), (0, m.eO)(), (0, m.lc)(), e.payload);
            const n = o.tid,
              s = e.localHandler;
            let a, l;
            if (r) {
              S("set ptyRemoterMapper, remotePeer:", i), k.set(n, { remotePeer: i, target: i, type: "webrtc", channel: t, remoteHandler: s });
              try {
                const e = Object.assign({ remotePeer: i }, o.openOptions || {});
                if (((a = await H.open(n, e)), a)) {
                  S("open ptyId success, ptyId:", a),
                    (l = (0, u.Hj)(async (e, t) => {
                      const r = e.payload;
                      try {
                        if ((r.data && (await H.write(a, r.data)), r.cmd && "function" === typeof H[r.cmd])) {
                          const e = Y(r.params);
                          await H[r.cmd](a, ...e);
                        }
                      } catch (o) {
                        S("handle remote terminal error:", o);
                        const r = { localHandler: e.remoteHandler, remoteHandler: e.localHandler, payload: { error: o.message, ptyId: a } };
                        (0, A.IC)(i, r, t);
                      }
                    }));
                  const e = k.get(n);
                  e && (e.localHandler = l);
                }
              } catch (d) {
                S("allow remote terminal error:", d);
              }
            }
            const c = { localHandler: l || void 0, remoteHandler: s, payload: { allow: r, ptyId: a } };
            (0, A.IC)(i, c, t);
          });
          const T = h.ZP.is.mobile ? 10 : 16,
            D = { allowProposedApi: !0, rows: h.ZP.is.mobile ? 30 : 50, cols: 50, fontSize: T, lineHeight: 1.15, convertEol: !0, disableStdin: !1, cursorBlink: !0, theme: I[0].options };
          class E extends o.Terminal {
            dispathEvent(e) {
              return this.textarea.dispatchEvent(e);
            }
          }
          class R extends b {
            constructor(e) {
              super(),
                (this.options = e),
                (this.tid = Math.random().toString().slice(-8)),
                (this.id = e.id || ""),
                (this.remotePeer = e.remotePeer || "local"),
                (this.remoteOrder = B(this.remotePeer)),
                (this.localHandler = null),
                (this.remoteHandler = null),
                (this.type = e.type || "local"),
                (this.terminal = null),
                (this.fitAddon = null),
                (this.searchAddon = null),
                (this.webglAddon = null),
                (this.state = "connecting"),
                (this.channel = null),
                (this.ws = null),
                (this.showSearch = !1),
                (this.searchKey = ""),
                (this.ctrlKey = !1),
                (this.altKey = !1),
                (this.metaKey = !1),
                this.createTerminal(e.terminalOptions),
                this.on("open", (e) => {
                  e && (this.id = e),
                    setTimeout(() => {
                      "open" === this.state && this.onResize();
                    }, 1e3);
                }),
                this.on("error", (e) => {
                  let t = e.toString();
                  t && t.includes("authentication") && (t = p.ag.t("username or password mismatch")), p.t5.error(t);
                });
              const t = (0, i.qj)(this);
              this.id ||
                W(t)
                  .then(() => {
                    S("startRemoteTerminal send success");
                  })
                  .catch((e) => {
                    S("openPty error:", e), (this.state = "error"), this.emit("error", e ? e.toString() : "");
                  }),
                C.push(t);
            }
            createTerminal(e = {}) {
              S("createTerminal");
              const t = (0, d.Z)(!0, {}, D, e),
                r = new E(t);
              r.attachCustomKeyEventHandler((e) => {
                const t = () => {
                  e.stopPropagation(), e.preventDefault();
                };
                if ((e.ctrlKey || e.metaKey) && "keydown" === e.type) {
                  let r, i;
                  const o = e.key.toLowerCase();
                  switch (o) {
                    case "c":
                      return (r = this.copy()), r && t(), !r;
                    case "v":
                      return this.paste(), t(), !1;
                    case "f":
                      return (i = x(this.tid)), i && ((i.searchKey = i.terminal.hasSelection() ? this.terminal.getSelection() : ""), (i.showSearch = !i.showSearch)), t(), !1;
                    default:
                  }
                }
                return !0;
              });
              const i = new a.Unicode11Addon();
              r.loadAddon(i),
                (r.unicode.activeVersion = "11"),
                (this.terminal = r),
                this.terminal.onData((e) => {
                  const t = e && 1 === e.length ? e.charCodeAt(0) : 0;
                  if ((this.ctrlKey || this.altKey || this.metaKey) && t >= 32 && t <= 122) {
                    S("assist key is on, data", e);
                    const t = e.toUpperCase(),
                      r = t.charCodeAt(0),
                      i = new KeyboardEvent(event.type, { key: e, code: "Key" + t, keyCode: r, which: r, isComposing: !0, ctrlKey: this.ctrlKey, altKey: this.altKey, metaKey: this.metaKey }),
                      o = x(this.tid);
                    return o && ((o.ctrlKey = !1), (o.altKey = !1), (o.metaKey = !1)), void this.dispathEvent(i);
                  }
                  this.writeToPty(e);
                }),
                this.terminal.onResize((e) => {
                  this.onResize(e);
                }),
                (this.fitAddon = new n.FitAddon()),
                this.terminal.loadAddon(this.fitAddon),
                (this.searchAddon = new s.SearchAddon()),
                this.terminal.loadAddon(this.searchAddon),
                document.createElement("canvas").getContext("webgl2")
                  ? (S("render in webgl2"),
                    (this.webglAddon = new l.WebglAddon()),
                    this.webglAddon.onContextLoss((e) => {
                      this.webglAddon.dispose();
                    }))
                  : (S("render in canvas"), (this.webglAddon = new c.CanvasAddon())),
                this.terminal.loadAddon(this.webglAddon);
            }
            changeSettings(e = {}) {
              S("changeSettings", e);
              const t = this.terminal.options,
                r = { fontSize: t.fontSize, lineHeight: t.lineHeight, theme: { foreground: "#ECECEC", background: "#000000" } },
                i = (0, d.Z)(!0, r, e);
              (this.terminal.options = i), this.refresh();
            }
            onOpen(e) {
              (this.id = e.id), e.localHandler && (this.localHandler = e.localHandler), e.remoteHandler && (this.remoteHandler = e.remoteHandler), e.channel && (this.channel = e.channel);
            }
            dispathEvent(e) {
              setTimeout(() => {
                S("dispathEvent to terminal", e.key), this.terminal && (this.terminal.focus(), this.terminal.dispathEvent(e));
              }, 200);
            }
            writeToPty(e) {
              this.commandToPty({ name: "write", params: [e] });
            }
            commandToPty(e) {
              if (e.name)
                if ("local" === this.type) {
                  if ("function" !== typeof H[e.name]) return;
                  const t = Y(e.params);
                  H[e.name](this.id, ...t);
                } else if ("webrtc" === this.type) {
                  const t = () => {
                    const t = { localHandler: this.localHandler, remoteHandler: this.remoteHandler, payload: { ptyId: this.id, cmd: e.name, params: e.params || [] } };
                    (0, A.IC)(this.remotePeer, t, this.channel);
                  };
                  this.remoteHandler
                    ? t()
                    : this.once("sendReady", () => {
                        S("send command after sendReady", e), t();
                      });
                } else if ("ssh" === this.type)
                  if (window.electronAPI) {
                    if ("function" !== typeof Q[e.name]) return;
                    const t = Y(e.params);
                    Q[e.name](this.id, ...t);
                  } else if (this.channel) {
                    const t = { type: e.name, id: this.id, params: e.params };
                    this.channel.send(JSON.stringify(t));
                  } else v.error("ssh discard command", e);
            }
            onMessageFromPty(e) {
              "data" === e.type ? this.onDataFromPty(e.value) : ((this.state = e.type), this.emit(e.type, e.value));
            }
            onDataFromPty(e) {
              this.terminal && this.terminal.write(e);
            }
            refresh(e = 0, t) {
              this.terminal && this.terminal.refresh(e, t || this.terminal.rows - 1), this.fit();
            }
            clear() {
              this.terminal.clear();
            }
            resize(e, t) {
              this.terminal.resize(e, t);
            }
            onResize(e) {
              const t = () => {
                S("resize pty cols, rows:", this.terminal.cols, this.terminal.rows), this.commandToPty({ name: "resize", params: [this.terminal.cols, this.terminal.rows] });
              };
              this.id
                ? t()
                : this.once("open", () => {
                    S("resize after open"), t();
                  });
            }
            focus() {
              setTimeout(() => {
                this.terminal && this.terminal.focus();
              }, 300);
            }
            fit() {
              if (this.fitAddon)
                try {
                  this.fitAddon.fit();
                } catch (e) {
                  v.error("resize error:", e);
                }
            }
            findNext() {
              this.searchAddon && this.searchAddon.findNext(this.searchKey);
            }
            async paste() {
              const e = await (0, y.$5)();
              S("paste text", e), this.terminal.paste(e);
            }
            copy() {
              return !!this.terminal.hasSelection() && ((0, y.zp)(this.terminal.getSelection()), !0);
            }
            async destroy() {
              this.commandToPty({ name: "close" }), this.terminal.dispose(), this.localHandler && (0, u.vS)(this.localHandler);
              const e = C.findIndex((e) => e.tid === this.tid);
              e > -1 && C.splice(e, 1), this.emit("destroy"), S("terminal destroyed:", this.tid);
            }
          }
          function B(e) {
            let t = 1;
            while (C.find((r) => r.remotePeer === e && r.remoteOrder === t)) t++;
            return t;
          }
          function x(e) {
            return C.find((t) => t.tid === e);
          }
          function F(e = { type: "local", id: "", remotePeer: "local", openOptions: {} }) {
            try {
              S("createTerminalSession");
              const t = new R(e);
              return x(t.tid);
            } catch (t) {
              S("createTerminalSession fail:", t);
            }
          }
          async function N(e, t) {
            const r = { remotePeer: t.remotePeer || "local", cols: t.cols || D.cols, rows: t.rows || D.rows };
            S("openPty:", r);
            const i = await window.electronAPI.terminal.open(e, r);
            return i;
          }
          async function O(e, t) {
            e && t && window.electronAPI && (await window.electronAPI.terminal.write(e, t));
          }
          async function M(e, t, r) {
            await window.electronAPI.terminal.resize(e, t, r);
          }
          async function U(e) {
            await window.electronAPI.terminal.close(e);
          }
          async function z(e) {
            await window.electronAPI.terminal.closeAll(e);
          }
          const H = { open: N, write: O, resize: M, close: U, closeAll: z };
          function _(e, t) {
            if (!t) return;
            const r = x(e);
            r && r.onMessageFromPty(t);
          }
          async function L(e) {
            const t = e ? C.filter(e) : C;
            if (Array.isArray(t)) {
              const e = t.map((e) => e.tid);
              e.forEach((e) => {
                const t = x(e);
                t && t.destroy();
              });
            }
          }
          async function W(e) {
            if ("local" === e.type) return await q(e);
            if ("ssh" === e.type) return await j(e);
            const t = e.remotePeer,
              r = e.tid;
            if (!t) return;
            const i = (0, u.Hj)((t, r) => {
              !e.remoteHandler && t.localHandler && ((e.localHandler = t.remoteHandler), (e.remoteHandler = t.localHandler), (e.channel = r), e.emit("sendReady"));
              const i = t.payload;
              if (void 0 !== i.allow) {
                if (!i.allow) return e.onMessageFromPty({ type: "abort", value: "forbidden" }), void p.t5.warning(p.ag.t("The request is forbidden"));
                if (!i.ptyId) return void p.t5.error(p.ag.t("Open remote terminal fail"));
                e.onOpen({ id: i.ptyId });
              }
              i.message && e.onMessageFromPty(i.message), i.error && p.t5.error(p.ag.t("Error") + ":" + i.error);
            });
            let o;
            const n = (0, g.tF)({ serviceType: m.pi, remotePeer: t });
            if (
              (n.length > 0
                ? (o = n[0])
                : ((o = (0, g.m$)({ serviceType: m.pi, initiator: !0, remotePeer: t })),
                  await new Promise((e, t) => {
                    let r = !1;
                    o.once("peerConnect", () => {
                      (r = !0), e();
                    }),
                      setTimeout(() => {
                        r || t();
                      }, 5e3);
                  })),
              !o)
            )
              return void p.t5.error(p.ag.t("Build channel fail"));
            const s = { type: P, remotePeer: t, localHandler: i, payload: { tid: r, accessCode: e.options.openOptions.accessCode, openOptions: e.options.openOptions } };
            (0, A.IC)(t, s, o);
          }
          async function q(e) {
            const t = e.remotePeer,
              r = e.tid,
              i = Object.assign({ remotePeer: t }, e.options.openOptions);
            k.set(r, { remotePeer: t, target: "local", type: e.type });
            const o = await H.open(r, i);
            o && e.onOpen({ id: o });
          }
          const V = "ws/ssh";
          async function j(e) {
            const t = e.remotePeer,
              r = e.tid,
              i = Object.assign({ remotePeer: t }, e.options.openOptions);
            if (window.electronAPI) {
              k.set(r, { remotePeer: t, target: "local", type: e.type });
              const o = await Q.open(r, i);
              o && e.onOpen({ id: o });
            } else {
              const o = (0, f.ST)(),
                n = new URL(V, o);
              n.searchParams.set("local", t), n.searchParams.set("tid", r);
              const s = new WebSocket(n);
              s.binaryType = "arraybuffer";
              const a = new w.k({
                websocket: s,
                handler: () => {
                  s && s.readyState === WebSocket.OPEN ? s.close() : a.destroy();
                },
              });
              s.addEventListener("open", (t) => {
                e.commandToPty({ name: "open", params: [r, i] });
              }),
                s.addEventListener("message", (e) => {
                  const t = e.data;
                  if ("string" === typeof t) {
                    let e;
                    if (t.startsWith("{"))
                      try {
                        (e = JSON.parse(t)), e.ssh && _(r, e.ssh), e.error && p.t5.error(e.error);
                      } catch (i) {
                        v.error("wss message error:", i);
                      }
                    else S("get str from ws:", t);
                  } else _(r, { type: "data", value: new Uint8Array(t) });
                }),
                s.addEventListener("close", (t) => {
                  (e.channel = null), _(r, { type: "close" });
                }),
                s.addEventListener("error", (e) => {
                  var t;
                  _(r, { type: "error", value: null === (t = e.error) || void 0 === t ? void 0 : t.toString() });
                }),
                (e.channel = {
                  send: (e) => {
                    s.send(e);
                  },
                }),
                e.on("destroy", () => {
                  if ((S("clear wss"), s))
                    try {
                      s.close();
                    } catch (e) {
                      S("close error");
                    }
                });
            }
          }
          const Q = {
            open: async function (e, t = { host: "", port: 22, username: "", password: "" }) {
              const r = await window.electronAPI.ssh.open(e, t);
              return S("ssh connect:", r), r;
            },
            write: async function (e, t) {
              await window.electronAPI.ssh.write(e, t);
            },
            resize: async function (e, t, r) {
              await window.electronAPI.ssh.resize(e, t, r);
            },
            close: async function (e) {
              await window.electronAPI.ssh.close(e);
            },
          };
          function Y(e) {
            return e ? (Array.isArray(e) ? e : [e]) : [];
          }
          function G() {
            return I;
          }
          S.enabled && (window.terminalSessions = C);
        },
        60496: (e, t, r) => {
          "use strict";
          r.d(t, { n: () => f, u: () => g });
          r(10071), r(10107), r(66245), r(24124), r(65663), r(43610), r(76701);
          var i = r(56999),
            o = r(38445),
            n = r(87073),
            s = r(58703),
            a = r(78999),
            l = r(90965),
            c = r(61959),
            d = r(33335),
            h = r(4585),
            u = r(20348),
            p = r(77597),
            A = r(40019);
          const m = r(99349)("DownloadDirectory.js");
          class f extends n.lh {
            constructor(e) {
              super(e, !1),
                (this.savePath = e.savePath || ""),
                (this.deep = e.deep || !1),
                (this.overwrite = e.overwrite || !1),
                (this.waitingDownloadFiles = []),
                (this.directorys = new Set()),
                (this.downloadedFiles = []),
                (this.failedFiles = []),
                (this.existFiles = []),
                (this.ignoreFiles = []),
                (this.isDownloadingFile = null),
                (this.downloadedFilesSize = 0),
                (this.received = 0),
                (this.progress = 0),
                (this.status = h.fN.PREPARING),
                (this.timer = null),
                (this.startTime = Date.now()),
                (this.costTime = 0);
              const t = new o.dq(this.ppurl);
              this.name || (this.name = t.name),
                this.remotePeer || (this.remotePeer = t.peerId),
                (this.rootRelativePath = t.fullPath),
                (this.root = this.rootRelativePath.split("/").splice(1).join("/")),
                this.relativePath || (this.relativePath = t.path),
                (this.service = e.service || ((0, o.iE)(t) ? "transfer" : "share")),
                (this.saveStorage = (0, c.qj)(new d.o({ type: "file", fileName: this.name, path: this.savePath }))),
                (this.children = []),
                (this.loaded = !1),
                (this._connectPeer = (0, p.tA)(this.remotePeer));
            }
            get speed() {
              return this.isDownloadingFile ? this.isDownloadingFile.speed : 0;
            }
            get allFiles() {
              return (this.isDownloadingFile ? [this.isDownloadingFile] : []).concat(this.waitingDownloadFiles, this.downloadedFiles, this.failedFiles, this.existFiles, this.ignoreFiles);
            }
            get existCount() {
              return this.existFiles.length;
            }
            get downloadedCount() {
              return this.downloadedFiles.length + this.failedFiles.length;
            }
            get formatReceived() {
              return (0, a.ys)(this.received);
            }
            get dirSize() {
              return super.size;
            }
            get formatDirSize() {
              return (0, a.ys)(this.dirSize);
            }
            get size() {
              return [[this.isDownloadingFile], this.waitingDownloadFiles, this.downloadedFiles, this.failedFiles].flat().reduce((e, t) => (t ? e + t.size : e), 0);
            }
            set size(e) {}
            async loadData() {
              if (((this.status = h.fN.PREPARING), !this.remotePeer || this.remotePeer === h.KB)) return;
              const e = await (0, i.Ej)(this.remotePeer, this.ppurl, this.deep, this.service);
              if ((m("loadData:", e), !e || !Array.isArray(e) || 0 === e.length)) return a.t5.warning(a.ag.t("Loaded none files")), void this.cancel();
              this.directorys.add(this.savePath), await this._filesLoop(e), (this.status = h.fN.WAITING), (this.saveStorage.fileSize = this.size), (this.loaded = !0);
            }
            createDownloadFile(e) {
              const t = new s.xn({ remotePeer: this.remotePeer, _id: e._id, id: e.id || e.ppurl, ppurl: e.ppurl, name: e.name, type: e.type || "", size: e.size || 1, lastModified: e.lastModified || void 0, savePath: e.savePath, service: this.service, relativePath: e.relativePath });
              return (t.status = h.fN.WAITING), t;
            }
            addNewFile(e) {
              const t = this.createDownloadFile(e);
              this.waitingDownloadFiles.push(t), this.addChild(t);
            }
            async _filesLoop(e) {
              if (e)
                for (let t = 0; t < e.length; t++) {
                  const r = e[t];
                  (r.remotePeer = this.remotePeer), (r._id = Math.random().toString().slice(-8)), r.relativePath || (r.relativePath = r.url ? r.url.split("/").slice(1).join("/") : "");
                  const i = r.relativePath.split("/").slice(1).join("/");
                  let n;
                  if (
                    (r.ppurl || (r.ppurl = [this.ppurl, i].join("/")),
                    (r.id = r.ppurl),
                    (r.downloadUrl = (0, u.km)(this._connectPeer.localServerUrl, r.name, r.id)),
                    (r.previewUrl = (0, u.pC)(r.name, r.downloadUrl, r.type)),
                    r.formatSize || (r.formatSize = (0, a.ys)(r.size)),
                    r.id || (r.id = r.ppurl),
                    (r.service = this.service || ((0, o.iE)(r.ppurl) ? "transfer" : "share")),
                    this.savePath && (n = window.electronAPI ? window.electronAPI.path.join(this.savePath, i) : this.savePath + "/" + i),
                    (r.savePath = n),
                    "dir" === r.type)
                  )
                    this.directorys.add(r.savePath), await this._filesLoop(r.children);
                  else {
                    const e = new s.dj(r);
                    if (n && !this.overwrite) {
                      const t = window.electronAPI ? window.electronAPI.fs.existsSync(n) : await window.capacitorAPI.filePicker.FakeUri.exist(n);
                      if (t) {
                        (e.status = h.fN.EXIST), this.existFiles.push(e), this.addChild(e), (this.downloadedFilesSize += r.size), (this.received += r.size);
                        continue;
                      }
                    }
                    if (!this.isAllowed(r.relativePath)) {
                      (e.status = h.fN.IGNORE), this.ignoreFiles.push(e), this.addChild(e);
                      continue;
                    }
                    this.addNewFile(e);
                  }
                }
            }
            async download() {
              if (s.wU.includes(this.status)) throw new Error("is downloading");
              await this.loadData();
            }
            startDownload() {
              (this.status = h.fN.WORKING),
                this.saveStorage.setState(h.fN.SAVING),
                (this.startTime = Date.now()),
                (this.timer = setInterval(() => {
                  this
                    ? (this.isDownloadingFile ? ((this.received = this.downloadedFilesSize + this.isDownloadingFile.received), this.saveStorage.setReceived(this.received)) : ((this.received = this.downloadedFilesSize), this.saveStorage.setReceived(this.received)),
                      (this.progress = this.size ? Math.floor((this.received / this.size) * 100) : 0))
                    : A.error("downloadDirectory instance is lost");
                }, 1e3)),
                this.nextDownload();
            }
            nextDownload() {
              if (this.status !== h.fN.WORKING || this.isDownloadingFile) return;
              if (0 === this.waitingDownloadFiles.length)
                return (
                  (this.status = h.fN.COMPLETE), this.saveStorage.setState(h.fN.COMPLETE), this.failedFiles.length || (this.progress = 100), (this.costTime = Date.now() - this.startTime), this.timer && (clearInterval(this.timer), (this.timer = null)), void this.emit("save-complete", this.progress)
                );
              const e = this.waitingDownloadFiles.shift();
              this.isDownloadingFile = e;
              const t = () => {
                m("download one item of directory", e);
              };
              e
                .once("downloadEnd", (t) => {
                  m("downloadFile downloadEnd:", t, e), (this.downloadedFilesSize += e.size), 100 === t ? this.onSuccess(e) : this.failedFiles.push(e), (this.isDownloadingFile = null);
                })
                .once("save-complete", (e) => {
                  setTimeout(() => {
                    this.nextDownload();
                  }, 0);
                }),
                e
                  .download({ directory: this.ppurl, service: this.service, savePath: e.savePath, callback: t })
                  .then(() => {
                    e.startDownload();
                  })
                  .catch((e) => {
                    A.error("download error:", e), a.t5.error(a.ag.t(e.message));
                  });
            }
            onSuccess(e) {
              (this.received = this.downloadedFilesSize), (this.progress = this.size ? Math.floor((this.received / this.size) * 100) : 0), -1 === this.downloadedFiles.findIndex((t) => t._id === e._id) && this.downloadedFiles.push(e), this.saveStorage.setReceived(this.received);
            }
            pause() {
              (this.status = h.fN.PAUSE), m("pause download directory"), this.isDownloadingFile && this.isDownloadingFile.pause();
            }
            resume() {
              (this.status = h.fN.WORKING), this.isDownloadingFile ? (this.isDownloadingFile.status !== h.fN.PAUSE ? ((this.isDownloadingFile = null), this.nextDownload()) : this.isDownloadingFile.resume()) : this.nextDownload();
            }
            cancel() {
              (this.status = h.fN.ABORT), (this.waitingDownloadFiles = []), this.timer && (clearInterval(this.timer), (this.timer = null)), this.isDownloadingFile && this.isDownloadingFile.cancel(), this.saveStorage.setState(h.fN.ABORT);
            }
            cancelDownloadFile(e) {
              if (!e || !(e instanceof s.xn)) throw new Error("no download file");
              if ((m("cancelDownloadFile"), this.isDownloadingFile && this.isDownloadingFile._id === e._id)) return this.isDownloadingFile.cancel(), (this.isDownloadingFile = null), void this.nextDownload();
              const t = this.waitingDownloadFiles.findIndex((t) => t._id === e._id);
              t > -1 && this.waitingDownloadFiles.splice(t, 1), -1 === this.failedFiles.findIndex((t) => t._id === e._id) && this.failedFiles.push(e);
            }
            reDownloadFile(e) {
              if (!e || !e.name) throw new Error("no download file");
              "function" === typeof e.reDownload ? e.reDownload() : ((e = this.createDownloadFile(e)), this.addChild(e, !0)), -1 === this.waitingDownloadFiles.findIndex((t) => t.id === e.id) && this.waitingDownloadFiles.push(e);
              const t = [this.failedFiles, this.existFiles, this.downloadedFiles, this.ignoreFiles];
              (this.downloadedFilesSize = 0),
                t.forEach((t) => {
                  const r = t.findIndex((t) => t.relativePath === e.relativePath);
                  r > -1 && t.splice(r, 1),
                    t.forEach((e) => {
                      this.downloadedFilesSize += e.size;
                    });
                }),
                [h.fN.COMPLETE, h.fN.ABORT].includes(this.status) && (m("restart download directory"), this.startDownload());
            }
          }
          async function g(e, t = !0, r = !1) {
            m("downloadDirectoryEntry:", e);
            const i = new f({ ...e, deep: t, overwrite: r }),
              o = (0, l.O7)(i);
            return (
              await o.download(),
              setTimeout(() => {
                (0, l.Qu)(o.remotePeer);
              }, 30),
              o
            );
          }
        },
        58703: (e, t, r) => {
          "use strict";
          r.d(t, { WV: () => R, aE: () => E, xn: () => x, dj: () => O, Jy: () => N, wU: () => B, I: () => W, LY: () => _, sO: () => U, dI: () => q });
          r(76701), r(24124), r(43610), r(10071), r(17965), r(66016), r(65663);
          var i = r(87035),
            o = r(63764),
            n = r(61959),
            s = r(87243),
            a = r(84350),
            l = r(9534),
            c = r(77597),
            d = r(24636),
            h = r.n(d),
            u = r(78999),
            p = r(33335);
          const A = null,
            m = r(99349)("FakeDownloadStreamOfHttp.js");
          class f extends h() {
            constructor(e) {
              super(),
                (this.id = e.id),
                (this.url = e.url),
                (this.fileId = e.fileId),
                (this.size = e.size || 0),
                (this.name = e.name || 0),
                (this.process = 0),
                (this.destroyed = !1),
                (this.startTime = 0),
                (this.savePath = e.savePath),
                (this.saveStorge = (0, n.qj)(new p.o({ type: "file", fileSize: this.size, fileName: this.name, path: this.savePath }))),
                this.on("abort", () => {
                  this.emit("close");
                }).on("close", () => {
                  this.destroy();
                });
            }
            setSavePath(e) {
              (this.savePath = e), this.saveStorge && this.saveStorge.setPath(e);
            }
            getNotification(e) {
              if ("progress" === e.type) {
                const { progress: t, received: r, speed: i } = e;
                if ((m("on progress:", t, i, r), "number" === typeof t)) {
                  let e;
                  if (t < 0 && this.size && r) {
                    const t = (r / this.size) * 100;
                    e = t < 1 ? t.toFixed(3) : Math.floor(t);
                  } else e = t;
                  this.process !== e && ((this.process = e), this.emit("progress", this.process), this.emit("received", r), this.saveStorge.setReceived(r));
                }
                "number" === typeof i && this.emit("speed", i);
              } else if ("event" === e.type)
                switch (e.status) {
                  case "start":
                    m("download start"), this.emit("start"), this.emit("storage", this.saveStorge);
                    break;
                  case "pause":
                    this.emit("paused");
                    break;
                  case "progress":
                    this.emit("resumed");
                    break;
                  case "abort":
                    this.emit("abort");
                    break;
                  case "cancel":
                    this.emit("abort");
                    break;
                  case "fail":
                    this.emit("abort"), u.t5.error(u.ag.t("Download Fail"));
                    break;
                  case "complete":
                    m("download complete"), this.saveStorge.setState("complete"), this.emit("progress", 100), this.emit("close");
                    break;
                  default:
                    m("unknown notification:", e);
                }
            }
            pauseMe() {
              this.emitAction("pause");
            }
            resumeMe() {
              this.emitAction("resume");
            }
            abort() {
              this.emitAction("abort");
            }
            remove() {
              this.emitAction("remove");
            }
            emitAction(e) {
              A && A("download-action", this.id, e);
            }
            destroy() {
              f.list.delete(this.id);
            }
          }
          f.list = new Map();
          var g = r(79305),
            w = r(87073),
            y = r(4585),
            v = r(20348),
            b = r(50895),
            S = r(38445),
            P = r(95911),
            C = r(84206),
            k = r(40019);
          const I = r(63559),
            T = null,
            D = r(99349)("DownloadFile.js"),
            E = [y.fN.COMPLETE, y.fN.ABORT, y.fN.EXIST, y.fN.IGNORE],
            R = [y.fN.WAITING, y.fN.WORKING, y.fN.PAUSE, y.fN.PREPARING],
            B = [y.fN.WORKING, y.fN.PAUSE];
          class x extends o.lK {
            constructor(e) {
              if ((super(e), !this.id)) throw new Error("less file id");
              (this.ppurl = e.ppurl || (0, S.Ym)({ remotePeer: this.remotePeer, id: this.id, relativePath: this.relativePath })),
                (this.category = "download"),
                (this.remotePeer = e.remotePeer || ""),
                (this.cacheFile = e.cacheFile || null),
                (this.downloadParams = {}),
                (this.service = e.service || "transfer"),
                (this.savePath = e.savePath || ""),
                (this.downloadUrl = e.downloadUrl),
                (this.previewUrl = e.previewUrl),
                this.setDownloadUrl();
            }
            get transferStream() {
              return this.transferStreams[0] || null;
            }
            get status() {
              const e = this.transferStreams[0];
              return e ? e.status : null;
            }
            set status(e) {
              const t = this.transferStreams[0];
              t ? t.setStatus(e) : this.addTransferStream(new o.iU({ remotePeer: this.remotePeer, status: e }));
            }
            get progress() {
              const e = this.transferStreams[0];
              return e ? e.progress : null;
            }
            get speed() {
              const e = this.transferStreams[0];
              return e ? e.speed : 0;
            }
            get received() {
              const e = this.transferStreams[0];
              return e ? e.received || Math.floor((e.progress / 100) * this.size) : 0;
            }
            get saveStorage() {
              const e = this.transferStreams[0];
              return e ? e.saveStorage : null;
            }
            setSavePath(e) {
              this.savePath = e;
            }
            addTransferStream(e, t = !0) {
              const r = super.addTransferStream(e);
              return r;
            }
            async download(e) {
              let t = "file";
              if (
                ("push" === this.service ? (t = "cache") : (0, l.rB)() && (t = "auto"),
                (this.downloadParams = Object.assign({ remotePeer: this.remotePeer, fileId: this.id, ppUrl: this.ppurl, fileName: this.name, service: this.service, storage: t }, e)),
                this.transferStreams.length > 0 && B.includes(this.transferStreams[0].status))
              )
                throw (D("is downloading now"), new Error("is downloading"));
              if (T && !this.downloadParams.savePath && "cache" !== this.downloadParams.storage && !this.downloadParams.cacheFile) {
                if (((this.savePath = await T.getSavePath(this.name)), !this.savePath)) throw new Error("no save path");
                this.downloadParams.savePath = this.savePath;
              }
              D("download, create new transferStream for waiting status"), (this.status = y.fN.WAITING);
            }
            reDownload() {
              D("reDownload"), this.transferStreams.length > 0 && B.includes(this.transferStreams[0].status) && (D("is downloading now"), this.transferStreams[0].cancel());
              const e = this.addTransferStream(new o.iU({ remotePeer: this.remotePeer }));
              e.setStatus("waiting");
            }
            startDownload() {
              const e = this;
              D("startDownload:", this);
              const t = new o.iU({
                  remotePeer: this.remotePeer,
                  callback: () => {
                    this.downloadParams.callback && "function" === typeof this.downloadParams.callback && this.downloadParams.callback(e);
                  },
                }),
                r = this.addTransferStream(t);
              r.setProgress(0),
                r
                  .once("close", () => {
                    this.emit("downloadEnd", r.progress);
                  })
                  .once("save-complete", (e) => {
                    setTimeout(() => {
                      this.emit("save-complete", e);
                    }, 0);
                  });
              const i = this.createDownloadStream();
              r.bindStream(i);
            }
            createDownloadStream() {
              return (0, s.LR)(this.downloadParams);
            }
            pause() {
              const e = this.transferStreams[0];
              e && e.pause();
            }
            resume() {
              const e = this.transferStreams[0];
              e && e.resume();
            }
            cancel() {
              const e = this.transferStreams[0];
              e && e.cancel();
            }
            setDownloadUrl() {
              if (this.downloadUrl) return;
              const e = (0, c.tA)(this.remotePeer);
              e && e.localServerUrl && ((this.downloadUrl = (0, v.km)(e.localServerUrl, this.name, this.id)), (this.previewUrl = (0, v.pC)(this.name, this.downloadUrl, this.type)));
            }
          }
          const F = (0, n.qj)(new Map());
          class N extends x {
            constructor(e) {
              super(e), (this.url = e.url || ""), (this.channelType = "http");
            }
            createDownloadStream() {
              if (!window.electronAPI && !window.capacitorAPI) throw new Error("only support client");
              D("createDownloadStream of http");
              const e = new f({ id: this.id, size: this.size, name: this.name, fileId: this.id, savePath: this.savePath });
              if (!this.url || !this.savePath) {
                const t = new Error("no save path");
                throw (e.abort(t), t);
              }
              return (
                (0, g.Sv)(this.url, this.savePath, this.size)
                  .then((e) => {})
                  .catch((e) => {
                    k.error("downloadFile by http error:", e), u.t5.error(u.ag.t(e.message)), "abort" !== this.status && this.cancel();
                  }),
                e
              );
            }
          }
          class O {
            constructor(e) {
              (this.remotePeer = e.remotePeer),
                (this.id = e.id),
                (this.ppurl = e.ppurl),
                (this.name = e.name),
                (this.type = e.type),
                (this.lastModified = e.lastModified),
                (this.path = e.path),
                (this.size = e.size || 0),
                (this.thumbnail = e.thumbnail),
                (this.thumbnailSrc = e.thumbnailSrc),
                (this.bigThumbnail = e.bigThumbnail),
                (this.relativePath = e.relativePath),
                (this.service = e.service),
                (this.downloadUrl = e.downloadUrl),
                (this.previewUrl = e.previewUrl),
                (this.status = e.status),
                (this.savePath = e.savePath),
                (this.valid = !1 !== e.valid),
                (this.formatSize = (0, u.ys)(this.size)),
                (this.cacheFile = e.cacheFile),
                this.requiredCheck(),
                this.remotePeer || (this.remotePeer = new S.dq(this.ppurl).peerId),
                (this.isLocal = [y.KB, c.l6.getPeerId()].includes(this.remotePeer)),
                this.service || (this.service = (0, S.iE)(this.ppurl) ? "transfer" : "service"),
                this.setDownloadUrl(),
                !this.thumbnailSrc && (0, a.ju)(this.type, this.name) && this.setThumbnailSrc();
            }
            requiredCheck() {
              const e = ["id", "ppurl", "name"];
              for (const t of e) M(this, t);
            }
            setDownloadUrl() {
              if (this.downloadUrl) return;
              const e = "share" === this.service ? this.ppurl : this.id;
              if (this.isLocal) {
                if (b.cI.port) {
                  const t = `http://localhost:${b.cI.port}/`;
                  (this.downloadUrl = (0, v.km)(t, this.name, e)), (this.previewUrl = (0, v.pC)(this.name, this.downloadUrl, this.type));
                }
              } else {
                const t = (0, c.tA)(this.remotePeer);
                t && t.localServerUrl && ((this.downloadUrl = (0, v.km)(t.localServerUrl, this.name, e)), (this.previewUrl = (0, v.pC)(this.name, this.downloadUrl, this.type)));
              }
            }
            setThumbnailSrc() {
              this.thumbnailSrc || (this.thumbnailSrc = this.lazyLoadThumbnailSrc.bind(this));
            }
            async lazyLoadThumbnailSrc() {
              if (this.thumbnail && this.thumbnail.startsWith("http://")) this.thumbnailSrc = this.thumbnail;
              else if (this.isLocal) this.thumbnailSrc = await this.getThumbnailFromPPUrl();
              else {
                let e = !1;
                const t = (0, c.tA)(this.remotePeer);
                if ("browser" !== c.l6.clientType && "share" === this.service && t && t.localServerUrl) {
                  const r = t.localServerUrl;
                  t.versionSupport("10.1.10") ? ((e = !0), (this.thumbnailSrc = await j(this.ppurl, r))) : this.thumbnail && ((e = !0), (this.thumbnailSrc = new URL(this.thumbnail, r).href));
                }
                e || (this.thumbnailSrc = await this.getThumbnailFromPPUrl());
              }
              return this.thumbnailSrc;
            }
            async getThumbnailFromPPUrl() {
              const e = (0, C.aL)(C.K4.thumbnail, this.ppurl, this.size);
              if (e) return D("get cacheItem, ppurl", this.ppurl), (this.thumbnailSrc = e.content), this.thumbnailSrc;
              const t = this.isLocal ? await (0, v.sX)(this.path, null, 96, this.name) : await V(this.remotePeer, this.ppurl, this.service, 96);
              if (((this.thumbnailSrc = t), t)) {
                const e = new C.tm({ id: this.ppurl, group: C.K4.thumbnail, peerId: this.remotePeer, etag: this.size, content: t });
                (0, C.OG)(e);
              }
              return this.thumbnailSrc;
            }
            async getFinalThumbnailSrc() {
              if ("string" === typeof this.thumbnailSrc) return this.thumbnailSrc;
              if ("function" === typeof this.thumbnailSrc) {
                const e = this.thumbnailSrc();
                return e instanceof Promise ? await e : e;
              }
              return "";
            }
          }
          function M(e, t) {
            if (!e[t]) throw new Error("required property: " + t);
          }
          function U(e) {
            return F.has(e) || F.set(e, (0, n.qj)([])), F.get(e);
          }
          function z(e, t) {
            const r = t || e.service || "transfer",
              i = U(r);
            i.find((t) => t === e) || i.push(e);
          }
          function H(e, t = "transfer") {
            if (!F.has(t)) return;
            const r = U(t),
              i = r.findIndex((t) => t.id === e.id);
            -1 !== i && (r.splice(i, 1), e.destroy && e.destroy());
          }
          function _({ id: e, service: t = "transfer", remotePeer: r = "" }) {
            if (!e || !F.has(t)) return null;
            const i = U(t);
            if (e)
              for (let o = 0; o < i.length; o++)
                if (e && i[o].id === e) {
                  if (!r) return i[o];
                  if (r === i[o].remotePeer) return i[o];
                }
            return null;
          }
          function L(e, t = "transfer") {
            if (!e || !F.has(t)) return [];
            const r = U(t);
            return r.filter((t) => t.remotePeer === e);
          }
          function W(e, t, r = "transfer") {
            let i;
            return (
              "dir" === e.type
                ? ((i = (0, n.qj)(
                    new w.lh({ remotePeer: t, id: e.id, ppurl: (0, S.Ym)({ remotePeer: t, id: e.id, relativePath: e.name }), name: e.name, root: e.name, relativePath: e.relativePath || e.name, size: e.size, lastModified: e.lastModified, cacheFile: null, service: r, dirty: !0, selected: [] }, !1)
                  )),
                  i.loadChildren())
                : (i = (0, n.qj)(new O({ service: r, remotePeer: t, id: e.id, ppurl: (0, S.Ym)({ remotePeer: t, id: e.id }), name: e.name, type: e.type, size: e.size, lastModified: e.lastModified, relativePath: e.relativePath }))),
              i
            );
          }
          function q(e, t) {
            const r = (0, c.tA)(e);
            if (!r) return;
            const o = L(e, "transfer"),
              s = "Files changed",
              d = (0, a.Xw)(o, t, "id"),
              h = d.length > 0;
            d.forEach((e) => {
              H(e, "transfer");
            });
            const u = (0, a.Xw)(t, o, "id"),
              p = u.length > 0;
            u.forEach((e) => {
              const t = W(e, r.clientId, "transfer");
              (0, l.rB)() &&
                (0, l.Gz)(e.id).then((e) => {
                  D("get cache file"), e ? ((e.progress = e.completed ? 100 : Math.round((e.cached / e.size) * 100)), (t.cacheFile = (0, n.qj)(e))) : (t.cacheFile = null);
                }),
                z(t, "transfer");
            }),
              (h || p) && i.YB.emit("remote_new_files", r.clientId, s);
          }
          async function V(e, t, r, i = 96) {
            try {
              if (!e) {
                const i = new S.dq(t);
                (e = i.peerId), (r = i.isTransfer ? "transfer" : "share");
              }
              const o = await (0, P.e0)(e, "image_thumbnail", { ppurl: t, service: r, width: i });
              return o.data;
            } catch (o) {
              D("setDownloadFileThumbnail", o);
            }
          }
          function j(e, t) {
            const r = I.hash(e) + ".jpg",
              i = new URL("/thumbnail/" + r, t);
            return i.searchParams.set("url", e), D("thumbnailURL", i), i.href;
          }
          i.YB.on("remote_remove", (e) => {
            D("on remote_remove:", e);
            const t = ["transfer", "push", "share"];
            t.forEach((t) => {
              const r = L(e, t) || [];
              r.forEach((e) => {
                H(e, t);
              });
            });
          }),
            D.enabled && (window.downloadFilesCollections = F);
        },
        6228: (e, t, r) => {
          "use strict";
          r.d(t, { a: () => P });
          r(24124), r(10071), r(76701), r(65663), r(43610);
          var i = r(61959),
            o = r(78999),
            n = r(63139),
            s = r(77597),
            a = r(87035),
            l = r(81007),
            c = r(9534),
            d = r(53935),
            h = r(33335),
            u = r(84350),
            p = r(38445),
            A = r(14244)["Buffer"],
            m = r(40019);
          const f = null,
            { Writable: g } = r(30775),
            w = r(99349)("FileSaver");
          let y = null;
          window.WritableStream
            ? r
                .e(736)
                .then(r.t.bind(r, 45084, 23))
                .then((e) => {
                  (y = e.default), w("load streamSaver success");
                })
            : r
                .e(736)
                .then(r.bind(r, 57458))
                .then((e) => ((window.WritableStream = e.WritableStream), r.e(736).then(r.t.bind(r, 45084, 23))))
                .then((e) => {
                  (y = e.default), w("load streamSaver after polyfill success");
                });
          const v = 1e3,
            b = 1 << 30,
            S = 67108864;
          class P extends g {
            constructor(e = () => {}, t = {}) {
              super(Object.assign({ decodeStrings: !1, highWaterMark: S }, t)),
                (this.id = t.id || Math.random().toString().slice(-8)),
                (this.name = (0, u.VK)(t.name) || ""),
                (this.size = t.size || 0),
                (this._buffers = new l.Z({})),
                (this.callback = e),
                (this.type = t.type),
                (this.saveStreamDelay = v),
                (this.useStreamSaver = !1),
                (this.saveStreamWriter = null),
                (this.storage = t.storage || "file"),
                (this.streamType = ""),
                (this.saveStreamWriting = !1),
                (this._streamWriterReady = !1),
                (this.checkSize = !1 !== t.checkSize),
                (this.cacheFile = t.cacheFile || null),
                (this.fileCache = null),
                (this.resumable = (0, c.rB)()),
                (this.error = null),
                (this._bytesreceived = 0),
                (this.start = !1),
                (this.writeCallback = null),
                (this._streamWriterQueue = null),
                (this._streamWriterQueueReadable = null),
                (this.savePath = t.savePath || null),
                (this.saveStorage = null),
                (this.ppurl = t.ppurl),
                (this.directory = t.directory),
                (this.storageType = f ? "native" : "db"),
                this.on("finish", () => {
                  if ((w("---- fileSave finish -------------"), !this._buffers)) return;
                  const e = this.checkSize && this.size !== this._bytesreceived ? new Error("SIZE_NOT_EQUAL") : null;
                  if (e) return w("save file error:", e), w("received, total size:", this._bytesreceived, this.size), this.emit("fileError", e), (this._buffers = null), (this._bytesreceived = 0), void (this.useStreamSaver && this.saveStreamWriter && this.saveStreamWriter.abort(e));
                  if (this.useStreamSaver) {
                    if (this.useStreamSaver) {
                      const e = setInterval(() => {
                        this._buffers && this._buffers.length > 0 ? w("waitClose..") : (this.saveStreamWriter.close(), clearInterval(e), "worker" === this.streamType && this.emit("stream-complete"));
                      }, 500);
                    }
                  } else this._generateFile();
                }),
                this.on("close", (e) => {
                  w("--------- fileSaver close ---------"), e && w("got fileSave error", e);
                }),
                this.on("file", this.saveas),
                this.on("error", (e) => {
                  w("got a error in file Save", e), this.useStreamSaver && this.saveStreamWriter && this.saveStreamWriter.abort(e);
                }),
                this.id && this.name && this.size && this.startSave();
            }
            setFileInfo({ name: e, type: t, size: r, cacheFile: i }) {
              w("setFileInfo, name, type, size, cacheFile, resumable:", e, t, r, i, this.resumable), e && (this.name = (0, u.VK)(e)), r && (this.size = r), t && (this.type = t), void 0 !== i && (this.cacheFile = i), this.startSave();
            }
            _generateFile() {
              const e = this._createFile();
              e && this.emit("file", e);
            }
            _preprocess(e, t) {
              t(null, e);
            }
            _write(e, t, r) {
              const i = e,
                o = this;
              this._preprocess(i, (e, t) => {
                if (e) return r(e);
                if (t) {
                  (o._bytesreceived += A.byteLength(t)), o._buffers.push(t);
                  const e = o.size ? Math.round((o._bytesreceived / o.size) * 100) : 0;
                  o.emit("progress", e);
                }
                this.useStreamSaver && !o.saveStreamWriting && this._read(), this.saveStreamWriter ? (this.writeCallback = r) : r();
              });
            }
            _createFile() {
              if ((w("_createFile", this.name), !this._buffers)) return null;
              try {
                return new File(this._buffers.data, this.name, { type: this.type || "" });
              } catch (e) {
                return m.error("create file error:", e), null;
              }
            }
            saveas(e) {
              w("save file"), (0, n.saveAs)(e), this.saveStorage && this.saveStorage.increaseSaved(this.size), this.saveCompleted();
            }
            startSave() {
              if (!this.start && ((this.start = !0), w("saveStream storage:", this.storage), !this.destroyed && !this.finished)) {
                switch (this.storage) {
                  case "auto":
                    this.streamSaveForResumable();
                    break;
                  case "file":
                    (this.size > b || f) &&
                      (this.streamWriterBind(),
                      this.on("stream-complete", async () => {
                        w("save complete"), f && (await this.exportFileFromCache(!0)), this.saveCompleted();
                      }));
                    break;
                  case "cache":
                    this.streamSaveForCache();
                    break;
                  default:
                }
                this.saveStorage = (0, i.qj)(new h.o({ type: this.storage, fileName: this.name, fileSize: this.size, path: this.savePath }));
              }
            }
            async streamSaveForResumable() {
              if (this.resumable && (this.streamWriterBind(), this.useStreamSaver))
                return (
                  w("using resumable transfer:", this.saveStreamWriter),
                  this.cacheFile && (this._bytesreceived += this.cacheFile.cached || 0),
                  void this.on("stream-complete", async () => {
                    w("save complete of streamSaveForResumable"), await this.exportFileFromCache(!0), this.saveCompleted();
                  })
                );
              w("resumable fail, use default file"),
                (this.storage = "file"),
                (this.size > b || f) &&
                  (this.streamWriterBind(),
                  this.on("stream-complete", async () => {
                    w("save complete"), f && (await this.exportFileFromCache(!0)), this.saveCompleted();
                  }));
            }
            streamSaveForCache() {
              w("streamSaveForCache"),
                this.streamWriterBind(),
                this.useStreamSaver &&
                  this.saveStreamWriter &&
                  this.on("stream-complete", () => {
                    w("save complete of streamSaveForCache"), a.YB.emit("remote_new_push_file_complete", this.id), this.saveCompleted();
                  });
            }
            streamSaveOfWorker() {
              if (!y) return;
              this._streamWriterQueue = CountQueuingStrategy ? new CountQueuingStrategy({ highWaterMark: 1 }) : void 0;
              const e = (this._streamWriterQueueReadable = CountQueuingStrategy ? new CountQueuingStrategy({ highWaterMark: 1 }) : void 0),
                t = s.S3.browser,
                r = s.S3.os,
                i = s.S3.device;
              if (!t || !r || !i) return;
              const o = s.j7;
              if (o.includes(t.name) || "Windows" === r.name) {
                w("saveStream begin..."), (this.useStreamSaver = !0), (y.mitm = "./mitm.html");
                const t = y.createWriteStream(this.name, { size: this.size, writableStrategy: this._streamWriterQueue, readableStrategy: e });
                (this.saveStreamWriter = t.getWriter()), this.startStreamSave();
              }
            }
            streamWriterBind() {
              const e = { id: this.id, name: this.name, size: this.size, type: this.type, append: this.resumable && !!this.cacheFile };
              if (this.directory) {
                const t = (0, p.HD)(this.ppurl);
                t && ((e.dir = t.id), (e.relativePath = t.relativePath));
              }
              if ("native" === this.storageType) {
                w("use client stream writer"), (this.streamType = "node");
                try {
                  (this.saveStreamWriter = f.getNewFileCache(e)),
                    this.saveStreamWriter
                      .on("open", () => {
                        this.startStreamSave();
                      })
                      .on("complete", () => {
                        this.saveStreamWriter.path && this.saveStorage.setPath(this.saveStreamWriter.path), this.emit("stream-complete");
                      })
                      .on("error", (e) => {
                        (this.error = e), this.emit("error", e), this.callback && (this.callback("abort"), (this.callback = null)), this._buffers && this.destroy();
                      }),
                    (this.useStreamSaver = !0);
                } catch (t) {
                  w("init saveStreamWriter error:", t), this.emit("error", t), this.callback && (this.callback("abort"), (this.callback = null));
                }
              } else
                "file" === this.storage
                  ? (w("use worker stream writer"), this.streamSaveOfWorker(), this.saveStreamWriter && (this.streamType = "worker"))
                  : ((this.streamType = "db"),
                    (this.saveStreamWriter = (0, d.qi)(e)),
                    this.saveStreamWriter
                      .on("open", () => {
                        this.startStreamSave();
                      })
                      .on("complete", () => {
                        this.emit("stream-complete");
                      })
                      .on("error", (e) => {
                        (this.error = e), this.emit("error", e), this.abort(e);
                      }),
                    (this.useStreamSaver = !0));
            }
            startStreamSave() {
              w("startStreamSave:", this.saveStreamWriter),
                this.on("data", async (e) => {
                  if (!this.error)
                    if (((this.saveStreamWriting = !0), this.saveStreamWriter)) {
                      if ((await this.saveStreamWriter.write(e), this.saveStorage && this.saveStorage.increaseSaved(e.length), this.writeCallback)) {
                        const e = this.writeCallback;
                        (this.writeCallback = null), e();
                      }
                      (this.saveStreamWriting = !1), this._read(this.highWaterMark);
                    } else w("no saveStreamWriter for stream save"), (this.error = new Error("no stream writer"));
                }),
                (this._streamWriterReady = !0),
                this._read(this.highWaterMark);
            }
            _read(e) {
              if (!this._streamWriterReady) return;
              const t = this._buffers && this._buffers.shift();
              t && this.emit("data", t);
            }
            abort(e) {
              this._buffers && (this.saveStorage && this.saveStorage.setState("abort"), this.useStreamSaver && this.saveStreamWriter && this.saveStreamWriter.abort(e), (this._buffers = null), this.callback && (this.callback("abort"), (this.callback = null)), this.end());
            }
            saveCompleted() {
              this.saveStorage && this.saveStorage.setState("complete"), this.callback && (this.callback("complete"), (this.callback = null)), this.emit("save-complete", this.savePath), this.destroy();
            }
            async exportFileFromCache(e = !1) {
              let t;
              try {
                "native" === this.storageType ? (this.savePath ? (t = await f.exportFile(this.id, this.savePath, e)) : w("no save path, cancel export")) : (t = await (0, d.WD)(this.id)),
                  t && !0 !== t && this.saveStorage && this.saveStorage.setPath(t),
                  t && a.YB.emit("remote_file_download_complete", this.id);
              } catch (r) {
                m.error("exportFileFromCache", r), this.saveStorage && this.saveStorage.setError(o.ag.t(r.message)), o.t5.error(o.ag.t(r.message));
              }
            }
            _destroy(e, t) {
              (this.saveStorage = null),
                (this.saveStreamWriter = null),
                (this._buffers = null),
                g.prototype._destroy.call(this, e, function (e) {
                  t && "function" === typeof t && t(e);
                });
            }
          }
        },
        53935: (e, t, r) => {
          "use strict";
          r.d(t, { Od: () => B, Rs: () => x, WD: () => D, cH: () => b, hn: () => P, kR: () => R, qi: () => F, zx: () => S });
          r(24124), r(76701), r(65663);
          var i = r(14244),
            o = r(28144),
            n = r(6228),
            s = r(78999),
            a = r(84350),
            l = r(40019);
          const c = r(24636),
            d = r(99349)("IDBFileCache.js"),
            h = 128,
            u = 5,
            p = "fileCaches",
            A = 15,
            m = "files",
            f = [
              { path: "id", keyPath: "id", options: { unique: !0 } },
              { path: "dir", keyPath: "dir" },
            ],
            g = "blocks",
            w = [
              { path: "id", keyPath: "id", options: { unique: !0 } },
              { path: "fid", keyPath: "fid", options: { unique: !1 } },
            ];
          async function y() {
            const e = await o.y.getDBByName({ dbName: p });
            if (e.version < A) {
              e.closeDB();
              const t = (t, r) => {
                if (t.objectStoreNames.contains(m)) {
                  const e = r.objectStore(m);
                  e.indexNames.contains("dir") || e.createIndex("dir", "dir");
                } else e.createStore(m, f, { keyPath: "id", autoIncrement: !1 }), d("create object store:", m);
                t.objectStoreNames.contains(g) || (e.createStore(g, w, { keyPath: "id", autoIncrement: !1 }), d("create object store:", g));
              };
              await e.openDB(p, t, A);
            }
            return e;
          }
          function v(e, t) {
            return e + t.toString().padStart(u, "0");
          }
          async function b(e) {
            const t = await y();
            return await t.readOneRecordByIndex(m, "id", e);
          }
          async function S(e, t) {
            if (!t || "object" !== typeof t) return;
            if (t.id && t.id !== e) throw new Error("id not match");
            const r = await y(),
              i = await r.readOneRecordByIndex(m, "id", e);
            if (!i) throw new Error("no exist");
            Object.assign(i, t), await r.updateRecord(m, i);
          }
          async function P(e) {
            const t = await y(),
              r = await t.readOneRecordByIndex(m, "id", e);
            if (r && !r.completed) {
              const t = await C(e);
              t ? ((r.blocks = t.offset + 1), (r.cached = t.position + t.size)) : ((r.blocks = 0), (r.cached = 0));
            }
            return r;
          }
          async function C(e) {
            const t = await y(),
              r = IDBKeyRange.only(e),
              i = await t.readRecordsByIndexCursor(g, "fid", r, void 0, "prev");
            return i[0];
          }
          class k extends c {
            constructor(e = {}) {
              super(),
                (this.id = e.id || ""),
                (this.name = (0, a.VK)(e.name)),
                (this.size = e.size || 0),
                (this.type = e.type || ""),
                (this.filesCount = 0),
                (this.dir = e.dir || ""),
                (this.relativePath = e.relativePath || ""),
                (this.children = []),
                (this.created = e.created || Date.now()),
                (this.chunkSize = e.chunkSize || h),
                (this.buffer = []),
                (this.blocks = 0),
                (this.offset = 0),
                (this.position = 0),
                (this.completed = !1),
                (this.idxDb = null),
                (this._ready = !1),
                (this.ended = !1),
                (this.error = null),
                (this.append = !!e.append),
                (this.destroyed = !1),
                this.init(),
                this.on("ready", this.saveChunk);
            }
            async init() {
              try {
                this.idxDb = await y();
                const e = await P(this.id);
                if (this.append && e)
                  (this.name = e.name),
                    (this.size = e.size),
                    (this.type = e.type),
                    (this.filesCount = e.filesCount),
                    (this.dir = e.dir),
                    (this.relativePath = e.relativePath),
                    (this.children = e.children || []),
                    (this.completed = e.completed),
                    (this.created = e.created),
                    (this.blocks = e.blocks),
                    e.cached && ((this.offset = e.blocks), (this.position = e.cached));
                else {
                  const e = { id: this.id, name: this.name, size: this.size, blocks: 0, created: this.created, completed: this.completed, type: this.type, filesCount: this.filesCount, dir: this.dir, relativePath: this.relativePath };
                  "dir" === e.type && (e.children = []), await this.saveFile(e), e.dir && this.addDirectoryChild(e.dir, e.id);
                }
                (this._ready = !0), this.emit("ready", !0), this.emit("open");
              } catch (e) {
                d("init IDBFileCache error:", e), (this.error = e), this.emit("error", e);
              }
            }
            async saveFile(e) {
              await this.idxDb.updateRecord(m, e), d("save file info:", e);
            }
            async saveBlock(e) {
              try {
                await this.idxDb.updateRecord(g, e), !this.completed && this.size <= e.position + e.size && (await this.end());
              } catch (t) {
                d("save block error:", t), l.error("save block error", t), (this._ready = !1), (this.error = t), T(t), this.emit("ready", !1), this.emit("error", t);
              }
            }
            async write(e) {
              !e || (this.size && this.position >= this.size) ? (this.ended = !0) : this.buffer.push(e), await this.saveChunk(!1);
            }
            async saveChunk(e = !1) {
              if (!this._ready || !this.buffer || 0 === this.buffer.length) return;
              if (!e && !this.ended && this.buffer.length < this.chunkSize) return;
              const t = Math.min(this.buffer.length, this.chunkSize),
                r = i.Buffer.concat(this.buffer.splice(0, t));
              d("save block:", this.offset);
              const o = { id: v(this.id, this.offset), fid: this.id, offset: this.offset, position: this.position, block: r, size: r.byteLength };
              this.offset++, (this.position += r.byteLength), await this.saveBlock(o), this.buffer.length >= this.chunkSize && (await this.saveChunk(!1));
            }
            async addDirectoryChild(e, t) {
              const r = await this.idxDb.readOneRecordByIndex(m, "id", e);
              r && r.children.push(t), await this.saveFile(r);
            }
            async end() {
              d("save all block, and update file"), (this.completed = !0), (this.blocks = this.offset);
              const e = { id: this.id, name: this.name, size: this.size, blocks: this.offset, created: this.created, completed: this.completed, type: this.type, filesCount: this.filesCount, dir: this.dir, relativePath: this.relativePath };
              "dir" === this.type && ((e.filesCount = this.filesCount), (e.children = this.children)), await this.saveFile(e), this.emit("complete");
            }
            abort(e = !1) {
              d("file cache abort"), this.close(), e && B(this.id), this.destroy();
            }
            close() {
              this.write(null);
            }
            destroy() {
              d("destroy"), (this.destroyed = !0);
            }
          }
          class I extends c {
            constructor(e) {
              super(), (this.id = e.id), (this.idxDb = null), (this.meta = null), (this.offset = 0), this.init();
            }
            async init() {
              (this.idxDb = await y()), this.loadMeta();
            }
            async loadMeta() {
              (this.meta = await P(this.id)), this.meta ? this.emit("open", this.meta) : this.emit("error", new Error("no meta"));
            }
            next() {
              if (this.offset >= this.meta.blocks) return void this.emit("data", null);
              const e = this.offset,
                t = v(this.id, e),
                r = IDBKeyRange.only(t);
              this.idxDb.readOneRecordByIndex(g, "id", r).then((e) => {
                e ? this.emit("data", e.block) : this.emit("data", null);
              }),
                this.offset++;
            }
          }
          function T(e) {
            "QuotaExceededError" === e.name && s.t5.error(s.ag.t("No enough storage space"));
          }
          async function D(e) {
            return (
              d("export File:", e),
              new Promise((t, r) => {
                const i = new I({ id: e });
                let o = null;
                i.on("open", (e) => {
                  d("file cache reader open:", e);
                  const a = s.t5.ongoing({
                      message: s.ag.t("Is exporting file"),
                      closeBtn: !1,
                      actions: [
                        {
                          label: s.ag.t("abort"),
                          color: "white",
                          handler: () => {
                            if (o && !o.destroyed) {
                              const e = new Error("abort");
                              o.abort(e), r(e);
                            }
                          },
                        },
                      ],
                    }),
                    l = "exporting_file_" + e.fileId;
                  (0, s.hh)(l, a);
                  const c = (r) => {
                    d("export file complete: ", e.name, r), (0, s.GZ)(l), t(o.savePath || !0);
                  };
                  (o = new n.a(c, { id: e.fid, name: e.name, size: e.size, type: e.type, storage: "file", checkSize: !1 })),
                    o.on("drain", () => {
                      d("fileSaver on drain"), i.next();
                    }),
                    d("fileSaver:", o),
                    i.next();
                })
                  .on("data", (e) => {
                    if (e) {
                      if (o.writable) {
                        const t = o.write(e);
                        d("fileSaver writable:", t), t && i.next();
                      }
                    } else o.writable && o.end();
                  })
                  .on("error", (e) => {
                    d("save file error:", e), r(e);
                  });
              })
            );
          }
          async function E(e, t, r, i = (e) => {}, o = "next") {
            return new Promise((n, s) => {
              const a = e.db,
                l = a.transaction([m, g]),
                c = l.objectStore(m),
                d = c.index(t),
                h = d.openCursor(r, o),
                u = l.objectStore(g),
                p = u.index("fid"),
                A = [];
              (h.onsuccess = function (e) {
                const t = e.target.result;
                if (t) {
                  const e = t.value;
                  if (!e.completed && "dir" !== e.type) {
                    const t = p.openCursor(IDBKeyRange.only(e.id), "prev");
                    t.onsuccess = function (t) {
                      const r = t.target.result;
                      e.cached = r ? r.value.position + r.value.size : 0;
                    };
                  }
                  A.push(e), i && i(e), t.continue();
                } else n(A);
              }),
                (h.onerror = function (e) {
                  s(e.target.error);
                });
            });
          }
          async function R(e = "db", t = "") {
            const r = await y(),
              i = IDBKeyRange.only(t);
            if ("db" === e) {
              const e = await E(r, "dir", i);
              return e;
            }
            {
              const e = await r.readRecordsByIndexCursor(m, "dir", i, void 0, "next");
              return e;
            }
          }
          async function B(e) {
            let t = null,
              r = !0;
            setTimeout(() => {
              r && (t = s.t5.ongoing({ message: s.ag.t("Is removing file") }));
            }, 500);
            try {
              const i = await y();
              return await i.deleteRecord(m, e), await i.deleteRecordsByIndex(g, "fid", e), (r = !1), !0;
            } finally {
              t && t();
            }
          }
          async function x() {
            d("clearCacheFiles");
            const e = await y();
            await e.clear(m), await e.clear(g);
          }
          function F(e) {
            return new k(e);
          }
        },
        38445: (e, t, r) => {
          "use strict";
          r.d(t, { HD: () => h, Ym: () => c, dq: () => n, iE: () => d });
          r(76701), r(43610), r(67280), r(65363);
          var i = r(4585),
            o = r(77597);
          class n {
            constructor(e) {
              (this.peerId = i.KB),
                (this.groupId = "0"),
                (this.path = ""),
                (this.relativePath = ""),
                (this.protocol = "pp://"),
                (this.url = ""),
                (this.root = ""),
                (this.fullPath = ""),
                (this.name = ""),
                (this.isTransfer = !1),
                e && ("string" === typeof e ? this.parse(e) : "object" === typeof e && this.stringify(e));
            }
            stringify(e) {
              if (void 0 === e.peer) throw new Error("error pp url object");
              (this.peerId = e.peerId || i.KB), (this.groupId = e.group || "0"), (this.path = this.relativePath = e.path || ""), (this.root = e.root || this.groupId), e.url ? (this.fullPath = e.url) : this.setFullPath(), this.setUrl(), this.setIsTransfer();
            }
            parse(e) {
              if (!this.isValid(e)) throw new Error("invalid pp url");
              this.url = e;
              const t = s(e.substring(this.protocol.length)),
                r = t.split("/");
              (this.peerId = r[0] || i.KB), (this.groupId = r[1] || "0"), (this.root = this.groupId), (this.name = r[r.length - 1]);
              const o = r.slice(2),
                n = `${this.peerId}/${this.groupId}/`.length;
              (this.path = this.relativePath = o.length > 0 ? t.substr(n) : ""), this.setFullPath(), this.setIsTransfer();
            }
            setFullPath() {
              this.fullPath = a(this.root, this.relativePath);
            }
            setUrl() {
              this.url = n.protocol + a(this.peerId, [this.groupId, this.relativePath]);
            }
            getUrl() {
              return this.setUrl(), this.url;
            }
            setIsTransfer() {
              this.groupId && (this.isTransfer = this.groupId.startsWith(l));
            }
            isValid(e) {
              return void 0 !== e && null !== e && "string" === typeof e && 0 === e.indexOf(this.protocol);
            }
            isLocal() {
              return [i.KB, o.l6.getPeerId()].includes(this.peerId);
            }
          }
          function s(e) {
            const t = /\\\\/g,
              r = /\\/g;
            return e.replace(t, "/").replace(r, "/");
          }
          function a(e, t) {
            if (!t) return e;
            e = null === e ? "" : e.toString();
            const r = e.split("/").filter((e) => "" !== e),
              i = "string" === typeof t ? [t] : Array.isArray(t) ? t.filter((e) => "" !== e) : [],
              o = r.concat(i);
            return o.join("/");
          }
          (n.protocol = "pp://"),
            (n.stringify = (e) => (void 0 === e.peerId ? null : n.protocol + a(e.peerId, e.path ? [e.groupId, e.path] : e.groupId))),
            (n.urlFormat = (e, t) => (e.startsWith(n.protocol) ? e : n.protocol + t + "/" + e)),
            (n.isPPUrl = (e) => e.startsWith(n.protocol) && e.length > n.protocol.length),
            (n.getSonPPUrl = (e, t) => {
              const r = new n(e);
              return n.stringify({ peerId: r.peerId, groupId: r.groupId, path: t });
            }),
            (n.isLocal = (e) => !!n.isPPUrl(e) && [i.KB, o.l6.getPeerId()].includes(e.slice(n.protocol.length).split("/")[0])),
            (n.getUrlFromPPURL = (e) => (n.isPPUrl(e) ? new n(e).fullPath : e)),
            (n.getParent = (e) => {
              if (!e) return "";
              const t = e.lastIndexOf("/");
              return e.slice(0, t);
            });
          const l = "_pp_transfer_";
          function c({ remotePeer: e, id: t, relativePath: r = "" }) {
            return n.stringify({ peerId: e, groupId: l + t, path: r });
          }
          function d(e) {
            if (!e) return !1;
            if ("string" === typeof e) {
              const t = new n(e);
              return t.isTransfer;
            }
            return e instanceof n && e.isTransfer;
          }
          function h(e) {
            const t = new n(e);
            if (!t.isTransfer) return !1;
            const r = t.path.split("/");
            return { id: t.groupId.slice(l.length), relativePath: r.join("/") };
          }
        },
        5478: (e, t, r) => {
          "use strict";
          r.d(t, { l: () => h });
          r(76701), r(65663);
          var i = r(87035),
            o = r(77597),
            n = r(87352),
            s = r(95911);
          const a = r(24636),
            l = r(99349)("PeerChannelOfNodeDataChannel.js"),
            c = null,
            d = { peerConnection: "peerConnection", apply: "apply", confirm: "confirm" };
          i.YB.on("peer-data-channel", (e, t) => {
            l("peer-data-channel:", e);
            const r = e.data;
            r.type === d.apply && new h({ remotePeer: e.localPeer, remoteHandler: e.localHandler });
          }).on("unLinked_remote", (e) => {
            const t = h.list.filter((t) => t.remotePeer === e);
            l("unLinked_remote clear nodeData channel:", t),
              t.forEach((e) => {
                e.destroy(!0);
              });
          });
          class h extends a {
            constructor(e) {
              if ((super(), (this.id = Math.random().toString().slice(-8)), (this.initiator = e.initiator || !1), (this.remotePeer = e.remotePeer), !this.remotePeer)) throw new Error("less of remotePeer");
              if (((this.channelType = c ? "node" : "webrtc"), (this.channel = null), (this.channelStream = null), (this._onSignal = this.onSignal.bind(this)), (this.localHandler = (0, s.Hj)(this._onSignal)), (this.remoteHandler = e.remoteHandler || null), (this.connected = !1), this.initiator)) {
                const e = { remoteHandler: "peer-data-channel", localHandler: this.localHandler, data: { type: d.apply } };
                (0, s.IC)(this.remotePeer, e, null);
              } else this.initUploadChannel(), this.confirmConnect();
              h.list.push(this);
            }
            get bufferSize() {
              return this.channel ? this.channel.bufferSize : -1;
            }
            get sendable() {
              return !(!this.connected || !this.channel) && this.channel.sendable;
            }
            confirmConnect() {
              this.sendSignal({ type: d.confirm });
            }
            initUploadChannel() {
              c ? this.setupNewNodeDataChannel() : this.setupNewPeerChannel(),
                setTimeout(() => {
                  this && !this.connected && this.destroy();
                }, 2e4);
            }
            setupNewPeerChannel() {
              l("setupNewPeerChannel");
              const e = { remotePeer: this.remotePeer, serviceType: o.V9.data, initiator: this.initiator, working: !0 };
              (this.channel = new n.mH(e)), this.channel.createPeer(e), (this.channelStream = this.channel.peer), this.addChannelEvent();
            }
            setupNewNodeDataChannel() {
              (this.channel = new c({ initiator: this.initiator, remotePeer: this.remotePeer, serviceType: o.V9.data })), (this.channelStream = this.channel), this.addChannelEvent();
            }
            addChannelEvent() {
              this.channel
                .on("peerConnect", (e) => {
                  l("node peerConnect:", e), (this.connected = !(!1 === e)), e && this.emit("connect");
                })
                .on("peerClose", () => {
                  (this.connected = !1), l("node datachannel close:", this.remotePeer), this.emit("close"), this.destroy();
                })
                .on("peerError", (e) => {
                  (this.connected = !1), this.emit("error", e);
                })
                .on("peerSignal", (e) => {
                  l("on peerSignal:", e), this.sendSignal({ type: d.peerConnection, data: e });
                });
            }
            write(e, t) {
              return this.channelStream.write(e, t);
            }
            onSignal(e) {
              l("onSignal:", e);
              const t = e.data;
              t.type === d.peerConnection ? this.channel.signal(t.data) : t.type === d.confirm ? ((this.remoteHandler = e.localHandler), this.initUploadChannel()) : l("unknown signal", e);
            }
            sendSignal(e) {
              const t = { type: "peer-data-channel", localHandler: this.localHandler, data: e };
              (t.remoteHandler = this.remoteHandler || "peer-data-channel"), (0, s.IC)(this.remotePeer, t);
            }
            destroy(e = !1) {
              l("destroy uploadChannel");
              const t = h.list.findIndex((e) => e.id === this.id);
              t > -1 && h.list.splice(t, 1), this.channel && this.channel.destroy(e), this.localHandler && ((0, s.vS)(this.localHandler), (this.localHandler = null));
            }
          }
          (h.list = []),
            (h.getChannelToRemotePeer = (e) => h.list.filter((t) => t.remotePeer === e && t.connected)),
            (h.getChannel = (e) => {
              const t = h.list.find((t) => t.remotePeer === e.remotePeer);
              return t;
            });
        },
        49110: (e, t, r) => {
          "use strict";
          r.d(t, { Lx: () => v, Ts: () => S, Yn: () => b, ZP: () => m, vU: () => g, vq: () => f });
          r(76701), r(10071), r(24124);
          var i = r(77597),
            o = r(12393),
            n = r(58703),
            s = r(87035),
            a = r(78999),
            l = r(90965),
            c = r(12552),
            d = r(60496),
            h = r(53935),
            u = r(40019);
          const p = null,
            A = r(99349)("PushUpload");
          function m() {
            const e = (0, i.h7)("enablePush");
            return !("disabled" === e);
          }
          function f(e) {
            const t = e ? "enabled" : "disabled";
            (0, i.m3)("enablePush", t);
          }
          function g({ remotePeer: e, fileId: t, fileName: r, fileSize: n, fileType: s, fileLastModified: a }) {
            if ((A("send pushUploadApply"), !e)) throw new Error("lack of remotePeer");
            if (!t || !r) throw new Error("lack of fileId or fileName");
            const l = { type: i.Nw.pushUploadApply, fileId: t, fileName: r, fileSize: n, fileType: s, fileLastModified: a };
            (0, o.lW)({ remotePeer: e, serviceType: i.V9.message, data: l });
          }
          const w = new Set();
          function y(e) {
            return !!m() && (!e || !w.has(e));
          }
          function v({ remotePeer: e, fileId: t, fileName: r }, n) {
            if ((A("send pushUploadForbid"), !e)) throw new Error("lack of remotePeer");
            if (!t || !r) throw new Error("lack of fileId or fileName");
            w.add(t);
            const s = { type: i.Nw.pushUploadForbid, fileId: t, fileName: r };
            (0, o.lW)({ remotePeer: e, serviceType: i.V9.message, data: s }, n);
          }
          async function b(e, t) {
            const { remotePeer: r, fileId: i, fileName: o, fileSize: a, fileType: c, fileLastModified: d } = { remotePeer: e.localPeer, fileId: e.fileId, fileName: e.fileName, fileSize: e.fileSize, fileType: e.fileType, fileLastModified: e.fileLastModified, startOffset: e.offset };
            if ((A("receivePushUpload", i), !r || !i || !o)) return;
            if (!y(i)) return void v({ remotePeer: r, fileId: i, fileName: o }, t);
            const p = (0, n.I)({ id: i, name: o, type: c, size: a, lastModified: d }, r, "push"),
              m = await P(p);
            m.once("save-complete", () => {
              setTimeout(() => {
                (0, l.G3)(m, !0),
                  p.thumbnailPromise &&
                    p.thumbnailPromise.then(async (e) => {
                      if ((A("add thumbnail"), e))
                        try {
                          await (0, h.zx)(p.id, { id: p.id, thumbnailSrc: e }), s.YB.emit("remote_new_push_file_complete", p.id);
                        } catch (t) {
                          u.error("update push file thumbnail error", t);
                        }
                    });
              }, 100);
            }),
              s.YB.emit("remote_new_push_file", m);
          }
          function S(e, t) {
            const { fileId: r, fileName: i } = { fileId: e.fileId, fileName: e.fileName };
            A("receivePushUploadForbid:", r, i), a.t5.warning(a.ag.t("The Remoter does not allowed to push file"));
          }
          async function P(e) {
            if ("dir" === e.type) {
              const t = { id: e.id, name: e.name, size: -1, type: "dir" },
                r = p ? p.getNewFileCache(t) : (0, h.qi)(t);
              await new Promise((e) => {
                r.once("open", () => {
                  e();
                });
              }),
                p && (e.savePath = r.path);
              const i = await (0, d.u)(e, !0, !1);
              return (
                i.once("save-complete", async () => {
                  setTimeout(async () => {
                    A("push directory end");
                    const e = await (0, h.cH)(r.id);
                    if (!e) throw new Error("no cache file", r.id);
                    (r.size = i.size), (r.filesCount = i.filesCount), (r.children = e.children), await r.end(), (i.savePath = r.path), s.YB.emit("remote_new_push_file_complete");
                  }, 0);
                }),
                i
              );
            }
            return await (0, c.yA)(e, null);
          }
        },
        87073: (e, t, r) => {
          "use strict";
          r.d(t, { VD: () => A, j1: () => g, lh: () => m });
          r(10107), r(10071), r(43610), r(76701), r(65663), r(24124);
          var i = r(77597),
            o = r(38445),
            n = r(63764),
            s = r(64776),
            a = r(4585),
            l = r(78999),
            c = r(20348),
            d = r(95911),
            h = r(58703),
            u = r(40019);
          const p = r(20180);
          class A extends n.lK {
            constructor(e) {
              if ((super(e), !e.id)) {
                const e = i.l6.uid + "#" + this.relativePath;
                this.id = (0, s.F)(e);
              }
              (this.type = "dir"),
                (this.root = e.root || ""),
                (this.service = e.service || ""),
                (this.isPublic = !1 !== e.isPublic),
                (this.children = []),
                (this.dirty = e.dirty || !1),
                (this.loadingInfo = !1),
                (this.loaded = !1),
                this.relativePath || (this.relativePath = this.name),
                e.loadChildren && "function" === typeof e.loadChildren && (this.loadChildren = e.loadChildren.bind(this));
            }
            get filesCount() {
              return this.children.reduce((e, t) => ("dir" === t.type ? e + t.filesCount : e + 1), 0);
            }
            get size() {
              const e = this.children.reduce((e, t) => e + t.size, 0);
              return e;
            }
            set size(e) {}
            get formatSize() {
              return (0, l.ys)(this.size);
            }
            set formatSize(e) {}
            get working() {
              for (const e of this.children) if ([a.fN.WORKING, a.fN.PAUSE].includes(e.state)) return !0;
              return !1;
            }
            setLoaded(e) {
              this.loaded = e;
            }
            setLoadingInfo(e) {
              this.loadingInfo = e;
            }
            setDirty(e) {
              this.dirty = e;
            }
            loadChildren() {
              throw new Error("empty method");
            }
            createDirChild(e, t) {
              const { base: r } = p.parse(e),
                i = new A({ id: f(this.id, e), name: r, relativePath: e, root: this.root, service: this.service, isPublic: this.isPublic });
              return t.children.push(i), i;
            }
            getAndCreateParent(e) {
              const t = e.split("/").slice(0, -1);
              let r = this,
                i = t.shift(),
                o = t.shift();
              while (o) {
                i = p.join(i, o);
                const e = r.children.find((e) => e.name === o);
                (r = e || this.createDirChild(i, r)), (o = t.shift());
              }
              return r;
            }
            getParent(e) {
              const { dir: t } = p.parse(e);
              return this.getChild(t);
            }
            addChild(e, t = !0) {
              if (!e.relativePath || !e.relativePath.startsWith(this.name)) throw new Error("invalid child");
              const r = this.getAndCreateParent(e.relativePath);
              let i = r.children.findIndex((t) => ("" + e.name).localeCompare(t.name) <= 0);
              if (-1 === i) i = r.children.length;
              else if (r.children[i].relativePath === e.relativePath) return t && r.children.splice(i, 1, e), i;
              return r.children.splice(i, 0, e), i;
            }
            getChild(e) {
              const t = e.split("/").slice(1);
              let r = this,
                i = t.shift();
              while (i) {
                if (((r = r.children.find((e) => e.name === i)), !r)) break;
                i = t.shift();
              }
              return r;
            }
            removeChild(e) {
              const t = this.getParent(e);
              if (!t) return null;
              const r = t.children.findIndex((t) => t.relativePath === e);
              return r < 0 ? null : t.children.splice(r, 1);
            }
            getChildren(e) {
              const t = this.getParent(e);
              return t && t.children;
            }
            getAllChildren(e = !0) {
              const t = [];
              return g(this, t, e), t;
            }
            destroy() {
              (this.children = []), super.destroy();
            }
          }
          class m extends A {
            constructor(e, t = !0) {
              super(e),
                (this.source = e.source || "remote"),
                (this.selected = e.selected || null),
                (this.ppurl = e.ppurl || (0, o.Ym)({ remotePeer: this.remotePeer, id: this.id, relativePath: this.name })),
                (this.downloadUrl = e.downloadUrl),
                (this.previewUrl = e.previewUrl),
                this.setDownloadUrl(),
                t && this.loadChildren();
            }
            setDownloadUrl() {
              if (this.downloadUrl) return;
              const e = (0, i.tA)(this.remotePeer);
              e.localServerUrl && ((this.downloadUrl = (0, c.km)(e.localServerUrl, this.name, this.id)), (this.previewUrl = (0, c.pC)(this.name, this.downloadUrl, this.type)));
            }
            async loadChildren() {
              if (!this.loadingInfo) {
                this.setDirty(!0), this.setLoadingInfo(!0);
                try {
                  const e = await (0, d.e0)(this.remotePeer, "directory_children", { ppUrl: this.ppurl, service: this.service }),
                    t = JSON.parse(e.data);
                  t.forEach((e) => {
                    const t = (0, o.Ym)({ remotePeer: this.remotePeer, id: this.id, relativePath: e.relativePath });
                    this.addChild(new h.dj({ ...e, remotePeer: this.remotePeer, ppurl: t, id: t, service: "transfer" }));
                  }),
                    this.setDirty(!1);
                } catch (e) {
                  u.error("loadChildren", e), l.t5.error(l.ag.t(e.message));
                } finally {
                  this.setLoadingInfo(!1), (this.loaded = !0);
                }
              }
            }
            isAllowed(e) {
              return !this.selected || this.selected.includes(e);
            }
            addChild(e) {
              const t = e.relativePath;
              return this.selected && !this.selected.includes(t) && this.selected.push(t), super.addChild(e);
            }
            updateSelected(e) {
              this.selected = e;
            }
          }
          function f(e, t) {
            return e + "#" + window.encodeURIComponent(t);
          }
          function g(e, t, r = !1) {
            if (!e || !t) return;
            if ("dir" !== e.type || !e.children) return;
            const i = e.relativePath || e.name;
            e.children.forEach((e) => {
              (e.relativePath = [i, e.name].join("/")), "dir" === e.type ? r && g(e, t, r) : (delete e.children, t.push(e));
            });
          }
        },
        63764: (e, t, r) => {
          "use strict";
          r.d(t, { FF: () => u, iU: () => h, lK: () => d });
          r(65663), r(43610), r(76701), r(10107);
          var i = r(78999),
            o = r(61959),
            n = r(84350),
            s = r(4585),
            a = r(77597);
          const l = r(24636),
            c = r(99349)("TransferFile.js");
          class d extends l {
            constructor(e) {
              super(),
                (this._id = e._id || Math.random().toString().slice(-8)),
                (this.id = e.id || null),
                (this.name = (0, n.VK)(e.name)),
                (this.type = e.type || ""),
                (this.size = e.size || 0),
                (this.lastModified = e.lastModified || null),
                (this.path = e.path || ""),
                (this.relativePath = e.relativePath || ""),
                (this.remotePeer = e.remotePeer || null),
                (this.transferStreams = []),
                (this.created = Date.now()),
                (this.category = ""),
                (this.thumbnailSrc = e.thumbnailSrc || null);
            }
            get formatSize() {
              return (0, i.ys)(this.size);
            }
            get isImage() {
              return (0, n.Or)(this.type, this.name);
            }
            get isVideo() {
              return this.type.startsWith("video");
            }
            _findStreamToRemoter(e) {
              for (let t = 0; t < this.transferStreams.length; t++) if (this.transferStreams[t].remotePeer === e) return t;
              return -1;
            }
            addTransferStream(e) {
              return this.removeTransferStream(e), (0, o.PG)(e) || (e = (0, o.qj)(e)), this.transferStreams.push(e), e;
            }
            removeTransferStream(e) {
              const t = this._findStreamToRemoter(e.remotePeer);
              t > -1 && (c("remove old trStream to :", e.remotePeer), this.transferStreams[t].unbindStream(), this.transferStreams.splice(t, 1));
            }
            destroy() {
              for (let e = 0; e < this.transferStreams.length; e++) this.transferStreams[e].destroy();
            }
          }
          class h extends l {
            constructor(e) {
              super(),
                (this.remotePeer = e.remotePeer),
                (this._remoteName = e.remoteName || ""),
                (this.speed = 0),
                (this.progress = 0),
                (this.received = 0),
                (this.status = e.status || "waiting"),
                (this.startTime = Date.now()),
                (this.costTime = 0),
                (this.hasStream = !1),
                (this.stream = null),
                (this.channelInfo = e.channelInfo || null),
                (this.saveStorage = null),
                (this.callback = e.callback || null),
                (this._closed = !1);
            }
            get remoteName() {
              if (!this._remoteName) {
                const e = (0, a.ao)().find((e) => e.clientId === this.remotePeer);
                e && (this._remoteName = e.clientName);
              }
              return this._remoteName || this.remotePeer;
            }
            isWaiting() {
              return "waiting" === this.status;
            }
            isWorking() {
              return ["working", "paused"].includes(this.status);
            }
            canDownload() {
              return !this.isWaiting() && !this.isWorking();
            }
            setSpeed(e) {
              this.speed = e;
            }
            setProgress(e) {
              if (((this.progress = e), 100 === e && (this.setStatus("complete"), this.setSpeed(0), this.streamEnd(), "function" === typeof this.callback))) {
                const e = this.callback;
                (this.callback = null), e();
              }
            }
            setReceived(e) {
              this.received = e;
            }
            setStatus(e) {
              c("set status", e), this.status !== e && ("working" === e && "pause" !== this.status ? (this.startTime = Date.now()) : "complete" === e && ((this.costTime = Math.max(Date.now() - this.startTime, 100)), c("complete, cost time:", this.costTime)), (this.status = e));
            }
            bindStream(e) {
              this.setStatus("working"),
                (this.stream = e),
                (this.hasStream = !0),
                (this._speedCb = this.setSpeed.bind(this)),
                (this._progressCb = this.setProgress.bind(this)),
                (this._receivedCb = this.setReceived.bind(this)),
                (this._startCb = this.start.bind(this)),
                (this._pausedCb = this.setPauseStatus.bind(this)),
                (this._resumedCb = this.setResumeStatus.bind(this)),
                (this._abourtCb = this.setAbortStatus.bind(this)),
                (this._streamEndCb = this.streamEnd.bind(this)),
                (this._saveStorageCb = this.setSaveStorage.bind(this)),
                (this._saveCompleteCb = this.saveComplete.bind(this)),
                (this._loadMeta = () => {
                  e.channelInfo && (this.channelInfo = e.channelInfo);
                }),
                this.stream
                  .once("start", this._startCb)
                  .on("speed", this._speedCb)
                  .on("progress", this._progressCb)
                  .on("received", this._receivedCb)
                  .on("paused", this._pausedCb)
                  .on("resumed", this._resumedCb)
                  .once("abort", this._abourtCb)
                  .once("loadmeta", this._loadMeta)
                  .once("close", this._streamEndCb)
                  .once("storage", this._saveStorageCb)
                  .once("save-complete", this._saveCompleteCb);
            }
            setPauseStatus() {
              this.setStatus("paused"), this.setSpeed(0);
            }
            setResumeStatus() {
              100 === this.progress ? "complete" !== this.status && this.setStatus("complete") : this.setStatus("working");
            }
            setAbortStatus() {
              this.setStatus("abort"), this.setSpeed(0);
            }
            setSaveStorage(e) {
              this.saveStorage = e;
            }
            unbindStream() {
              this.setSpeed(0),
                this.stream &&
                  (this.stream
                    .off("start", this._startCb)
                    .off("speed", this._speedCb)
                    .off("progress", this._progressCb)
                    .off("received", this._receivedCb)
                    .off("paused", this._pausedCb)
                    .off("resumed", this._resumedCb)
                    .off("abort", this._abourtCb)
                    .off("loadmeta", this._loadMeta)
                    .off("close", this._streamEndCb)
                    .off("storage", this._saveStorageCb)
                    .off("save-complete", this._saveCompleteCb),
                  (this.stream = null),
                  (this.hasStream = !1));
            }
            validDownloadStream() {
              return this.hasStream && this.stream && !this.stream.destroyed;
            }
            start() {
              this.setStatus("working"), this.setSpeed(0), this.setProgress(0);
            }
            pause() {
              this.validDownloadStream() && this.stream.pauseMe();
            }
            resume() {
              this.validDownloadStream() && this.stream.resumeMe();
            }
            cancel(e) {
              this.setStatus("abort"), this.setProgress(0), this.setSpeed(0), this.stream && !this.stream.destroyed && this.stream.abort(e || new Error("abort"));
            }
            streamEnd() {
              this._closed || ((this._closed = !0), c("transfer stream end--"), this.emit("close", this.progress));
            }
            saveComplete(e) {
              c("save complete", e), this.emit("save-complete", e), this.unbindStream();
            }
            destroy() {
              if (this.stream && !this.stream.destroyed) {
                const e = this.stream;
                this.unbindStream(), this.streamEnd(), e.abort(new Error("file destoryed"));
              }
            }
          }
          class u extends l {
            constructor(e) {
              super(),
                (this.remotePeer = e.remotePeer),
                (this.filesCount = e.filesCount || 0),
                (this.size = e.size || -1),
                (this.isWorkingFile = null),
                (this.finishedFiles = []),
                (this.channelInfo = e.channelInfo || {}),
                (this.beforeFileWorking = null),
                (this.startTime = Date.now()),
                (this.costTime = 0);
            }
            get status() {
              if (!this.isWorkingFile) return this.finishedFiles.length === this.filesCount ? s.fN.COMPLETE : s.fN.WAITING;
              const e = this.isWorkingFile.getStatus(this.remotePeer) === s.fN.COMPLETE && this.finishedFiles.length < this.filesCount - 1 ? s.fN.WORKING : this.isWorkingFile.getStatus(this.remotePeer);
              return e === s.fN.COMPLETE && ((this.costTime = Date.now() - this.startTime), this.isWorkingFile && this.addTransferFile(null)), e;
            }
            get speed() {
              return this.isWorkingFile ? this.isWorkingFile.getSpeed(this.remotePeer) : 0;
            }
            get progress() {
              const e = this.isWorkingFile ? (this.isWorkingFile.getProgress(this.remotePeer) * this.isWorkingFile.size) / 100 : 0,
                t = this.finishedFiles.reduce((e, t) => e + t.size, e);
              return Math.floor((t / this.size) * 100);
            }
            addTransferFile(e) {
              this.finishedFiles.length === this.filesCount && ((this.startTime = Date.now()), (this.costTime = 0), (this.finishedFiles = []), (this.isWorkingFile = null)),
                this.isWorkingFile && this.finishedFiles.push(this.isWorkingFile),
                (this.isWorkingFile = e),
                e && this.beforeFileWorking && (this.beforeFileWorking(), (this.beforeFileWorking = null));
            }
            getCurrentFileTransferStream() {
              return this.isWorkingFile ? this.isWorkingFile.getRemoteTransferStream(this.remotePeer) : null;
            }
            start() {}
            pause() {
              const e = this.getCurrentFileTransferStream();
              e
                ? e.pause()
                : (this.beforeFileWorking = () => {
                    this.pause();
                  });
            }
            resume() {
              const e = this.getCurrentFileTransferStream();
              e && e.resume();
            }
            cancel() {
              const e = this.getCurrentFileTransferStream();
              e && e.cancel(), (this.isWorkingFile = null), this.finishedFiles.length > 0 && (this.finishedFiles = []);
            }
            destroy() {
              this.cancel(), (this.isWorkingFile = null), (this.finishedFiles = []);
            }
          }
        },
        90965: (e, t, r) => {
          "use strict";
          r.d(t, { F1: () => d, G3: () => m, O7: () => p, Qu: () => h, Vl: () => A, gY: () => u, zC: () => f });
          r(43610), r(65663), r(24124);
          var i = r(61959),
            o = r(83673),
            n = r(84350),
            s = r(78999),
            a = r(40019);
          const l = r(99349)("transferTasks.js"),
            c = 1,
            d = (0, i.qj)({ show: !1, active: !1, activeTimer: null, downloadFiles: [], waitingQueue: [], uploadFiles: [], downloadFilesUpdate: Date.now() });
          function h(e) {
            l("startNextDownloadTask:", e);
            const t = d.downloadFiles.filter((t) => t.remotePeer === e),
              r = t.filter((e) => !!["working", "paused"].includes(e.status));
            if (r.length >= c) return void l("too many downloadFile, stay to wait");
            const i = d.downloadFiles.find((t) => t.remotePeer === e && "waiting" === t.status);
            if (i) {
              l("start download id:", i.id);
              try {
                i.startDownload();
              } catch (o) {
                a.error("start download error:", o), s.t5.error(s.ag.t(o.message));
              }
            }
          }
          function u() {
            d.show = !d.show;
          }
          function p(e) {
            const t = d.downloadFiles.find((t) => t === e);
            return (
              t
                ? (e = t)
                : ((0, i.PG)(e) || (e = (0, i.qj)(e)),
                  e
                    .once("downloadEnd", (t) => {
                      l("on downloadEnd:", e, t), h(e.remotePeer);
                    })
                    .once("save-complete", () => {
                      (0, n.IP)();
                    }),
                  d.downloadFiles.push(e),
                  (d.downloadFilesUpdate = Date.now())),
              setTimeout(() => {
                h(e.remotePeer);
              }, 16),
              e
            );
          }
          function A(e) {
            if (!e) return null;
            for (let t = d.downloadFiles.length - 1; t > -1; t--) {
              const r = d.downloadFiles[t];
              if (e === r.id) return d.downloadFiles[t];
              if ((e.startsWith(r.id) || e.startsWith(r.ppurl)) && r.isDownloadingFile && r.isDownloadingFile.id === e) return r.isDownloadingFile;
            }
            return null;
          }
          async function m(e, t = !0) {
            if ((l("removeDownloadFileOfTask", e), e.transferStreams && e.transferStreams[0] && ["working", "paused"].includes(e.transferStreams[0].status))) {
              if (!t) {
                const e = await (0, s.mZ)({ title: this.$t("Cancel"), message: this.$t("Are you sure to Cancel?") });
                if (!Array.isArray(e)) return !1;
              }
              e.transferStreams[0].cancel();
            }
            const r = d.downloadFiles.findIndex((t) => t.id === e.id);
            return r > -1 && (d.downloadFiles.splice(r, 1), (d.downloadFilesUpdate = Date.now())), !0;
          }
          async function f(e = !0) {
            if (0 !== d.downloadFiles.length) {
              if (!e) {
                const e = await (0, s.mZ)({ title: this.$t("Clear All"), message: this.$t("Are you sure to clear all and stop all?") });
                if (!Array.isArray(e)) return;
              }
              for (let e = d.downloadFiles.length - 1; e >= 0; e--) m(d.downloadFiles[e], !0);
            }
          }
          (d.status = (0, o.Fl)(() => {
            const e = d.downloadFiles.filter((e) => ["waiting", "paused", "working"].includes(e.status)),
              t = { isDownloading: e.length, received: 0, total: 0, progress: 0, speed: 0, speedFormat: "0/s" };
            return (
              e.forEach((e) => {
                "waiting" !== e.status && ((t.total += e.size || 0), (t.received += e.received || 0), (t.speed += e.speed || 0));
              }),
              t.total > 0 && ((t.progress = Math.floor((t.received / t.total) * 100)), (t.speedFormat = (0, s.ys)(t.speed) + "/s")),
              t
            );
          })),
            l.enabled && (window.transferInfo = d);
        },
        85308: (e, t, r) => {
          "use strict";
          r.d(t, { S: () => s.ST, y: () => l });
          r(76701), r(24124), r(65663);
          var i = r(24636),
            o = r.n(i),
            n = r(84350),
            s = r(77597);
          const a = r(99349)("uploadChannel.js");
          class l extends o() {
            constructor(e) {
              if ((super(), (this.id = Math.random().toString().slice(-8)), (this.uploadStream = e.uploadStream || null), !this.uploadStream)) throw new Error("no uploadStream");
              if (((this.remotePeer = e.remotePeer || e.uploadStream.remotePeer || null), !this.remotePeer)) throw new Error("no remotePeer");
              (this.chunks = []), (this.sync = e.sync || !0), (this.p2p = e.p2p || !0), (this.type = e.type || "webrtc"), (this.destroyed = !1), (this.nextSendFunc = null), l.addToList(this);
            }
            get sendable() {
              return !this.destroyed;
            }
            getInfo() {
              return { id: this.id, type: this.type, sync: this.sync, p2p: this.p2p };
            }
            isUploadStreamWorking() {
              return !this.destroyed && this.uploadStream && !this.uploadStream.destroyed;
            }
            selectOnePeerChannel() {
              throw new Error("need rewrite selectOnePeerChannel in sub class");
            }
            async setupNewPeerChannel() {
              throw new Error("need rewrite setupNewPeerChannel in sub class");
            }
            sendChunk() {
              throw new Error("need rewrite sendChunk in sub class");
            }
            startUpload() {
              a("start upload"),
                window.setTimeout(() => {
                  this.isUploadStreamWorking() && this.uploadStream.start();
                }, 50);
            }
            send(e) {
              e && this.chunks.push(e), l.scheduleNext(this.remotePeer);
            }
            nextSend() {
              const e = this.chunks.length;
              if (!this.isUploadStreamWorking() || !e) return this.isUploadStreamWorking() || this.destroy(), a("clear chunks for invalid upload"), void l.scheduleNext(this.remotePeer);
              const t = this.selectOnePeerChannel();
              if (t)
                while (this.chunks.length > 0) {
                  const e = this.chunks.shift();
                  this.sendChunk(t, e, (t) => {
                    setTimeout(() => {
                      this.uploadStream.sendCallback(e);
                    }, 0),
                      this.nextRead();
                  });
                }
              else a("no channel for chunk");
            }
            nextRead() {
              this.isUploadStreamWorking() && 0 === this.chunks.length ? this.uploadStream.read() : l.scheduleNext(this.remotePeer);
            }
            ended(e) {
              setTimeout(() => {
                e && e();
              }, 1e3);
            }
            destroy() {
              a("destroy uploadChannel"), this.destroyed || ((this.destroyed = !0), this.chunks && this.chunks.length > 0 && (this.chunks = []), l.removeFromList(this));
            }
          }
          (l.types = { nodeChannel: "nodeChannel", webRtc: "webRtc", websocket: "websocket", http: "http", udp: "udp" }),
            (l.list = []),
            (l.addToList = (e) => {
              l.list.push(e), l.scheduleNext(e.remotePeer);
            }),
            (l.removeFromList = (e) => {
              const t = l.list.findIndex((t) => t.id === e.id);
              t > -1 && l.list.splice(t, 1), l.scheduleNext(e.remotePeer);
            }),
            (l.scheduleNext = (e) => {
              const t = l.list.filter((t) => t.remotePeer === e && t.chunks.length),
                r = t.length;
              if ((a("scheduleNext runningChannel length: %s", r), r > 0)) {
                const e = 1 === r ? 0 : (0, n.jE)(r);
                return t[e].nextSend();
              }
            });
        },
        23503: (e, t, r) => {
          "use strict";
          r.d(t, { C9: () => U, F: () => M, FM: () => N, G1: () => C, I$: () => F, VI: () => O, bc: () => D, bl: () => R, dD: () => E, eJ: () => I, pR: () => k });
          r(24124), r(92100), r(76701), r(10071), r(43610), r(65663);
          var i = r(61959),
            o = r(87035),
            n = r(77597),
            s = r(63764),
            a = r(95911),
            l = r(12552),
            c = r(64776),
            d = r(38445),
            h = r(87073),
            u = r(14244),
            p = r(4585),
            A = r(84350),
            m = r(20348),
            f = r(84206),
            g = r(40019);
          const w = r(20180),
            y = window.electronAPI ? window.electronAPI : null,
            v = null,
            b = r(40399),
            S = r(99349)("UploadFile.js");
          function P(e, t = "transfer") {
            return (0, c.F)(n.l6.uid + t + e.name + e.size + (e.lastModified || ""));
          }
          o.YB.on("directory_children", async (e, t) => {
            let r = 200,
              i = "";
            try {
              const o = e.payload;
              if (o && o.ppUrl) {
                const e = await U(o.ppUrl, o.service, o.deep),
                  t = e ? e.map((e) => new k(e)) : null;
                (i = t ? JSON.stringify(t) : "no exist"), (r = t ? 200 : 404);
              } else (r = 401), (i = "no url");
            } catch (o) {
              g.error("directory_children error:", o, e), (r = 500), (i = o.message);
            } finally {
              (0, a.xd)(r, i, e, t);
            }
          }).on("image_thumbnail", async (e, t) => {
            let r = 200,
              i = "";
            try {
              const o = e.payload;
              if (o && o.ppurl) {
                const e = o.service || ((0, d.iE)(o.ppurl) ? "transfer" : "share"),
                  t = o.width || 96;
                (i = await z(o.ppurl, e, t)), (r = 200);
              } else (r = 401), (i = "no url");
            } catch (o) {
              g.error("image-thumbnail error:", o, e), (r = 500), (i = o.message);
            } finally {
              (0, a.xd)(r, i, e, t);
            }
          });
          class C extends s.lK {
            constructor(e) {
              super(e), (this.category = "upload");
              const t = e.file;
              if (!t || "function" !== typeof t.slice) throw new Error("file error");
              if (
                ((this.file = t),
                this.relativePath || (this.relativePath = t.relativePath || t.webkitRelativePath || ""),
                (this.service = e.service || ""),
                e.id || (this.id = P(this.file, this.service)),
                (this.name = this.name || this.file.name),
                (this.type = this.type || this.file.type || ""),
                (this.size = this.size || this.file.size),
                (this.lastModified = this.lastModified || this.file.lastModified),
                (this.path = this.path || this.file.path),
                (this.isPublic = !1 !== e.isPublic),
                (this.receivers = e.receivers || []),
                (this.uploaderId = e.uploaderId || ""),
                (this.md5 = e.md5 || null),
                !this.path && v)
              ) {
                const e = v.fileNameOfPathCache.get(this.file.name + "-" + this.file.size);
                S("set path of file for mobile, name, path:", this.file.name, e), e && ((this.file.path = e), (this.path = e));
              }
              !this.thumbnailSrc && (0, A.ju)(this.type, this.name) && this.setThumbnailSrc(), this.init();
            }
            init() {}
            setThumbnailSrc() {
              this.thumbnailSrc || (this.thumbnailSrc = this.lazyLoadThumbnailSrc.bind(this));
            }
            async lazyLoadThumbnailSrc() {
              const e = (0, f.aL)(f.K4.thumbnail, this.id, this.size);
              if (e) return S("get cacheItem, id", this.id), (this.thumbnailSrc = e.content), this.thumbnailSrc;
              if ((this.file instanceof File ? (this.thumbnailSrc = await (0, A.R8)(this.file)) : this.path ? (this.thumbnailSrc = await (0, m.sX)(this.path, null, 96, this.name)) : (this.thumbnailSrc = ""), this.thumbnailSrc && "string" === typeof this.thumbnailSrc)) {
                const e = new f.tm({ id: this.id, group: f.K4.thumbnail, peerId: this.remotePeer, etag: this.size, content: this.thumbnailSrc });
                (0, f.OG)(e);
              }
              return this.thumbnailSrc;
            }
            async getFinalThumbnailSrc() {
              if ("string" === typeof this.thumbnailSrc) return this.thumbnailSrc;
              if ("function" === typeof this.thumbnailSrc) {
                const e = this.thumbnailSrc();
                return e instanceof Promise ? await e : e;
              }
              return "";
            }
            async getBigThumbnail(e = 640) {
              return (this.isImage && (await (0, A.R8)(this.file, e))) || "";
            }
            getRemoteTransferStream(e) {
              return this.transferStreams.find((t) => t.remotePeer === e);
            }
            getStatus(e) {
              const t = this.getRemoteTransferStream(e);
              return t ? t.status : p.fN.WAITING;
            }
            getSpeed(e) {
              const t = this.getRemoteTransferStream(e);
              return t ? t.speed : 0;
            }
            getProgress(e) {
              const t = this.getRemoteTransferStream(e);
              return t ? t.progress : 0;
            }
            fetchSlice(e, t) {
              return new Promise((r, i) => {
                const o = new FileReader();
                o.onload = () => {
                  r(o.result);
                };
                const n = this.file.slice(e, t);
                n instanceof Promise
                  ? n
                      .then((e) => {
                        e instanceof Blob ? o.readAsArrayBuffer(e) : r(u.Buffer.from(e));
                      })
                      .catch((e) => {
                        S("fetchSlice error:", e), i(e);
                      })
                  : o.readAsArrayBuffer(n);
              });
            }
            destroy() {
              S("destroy"), this.file && "function" === typeof this.file.destroy && this.file.destroy(), (this.file = null), y && "pc" === n.l6.clientType && window.electronAPI.client.deleteUploadFile(this.id), super.destroy();
            }
          }
          class k {
            constructor(e) {
              const t = ["id", "name", "type", "size", "lastModified", "relativePath", "service", "thumbnail", "url"];
              for (const r of t) e[r] && (this[r] = e[r]);
            }
          }
          class I extends h.VD {
            constructor(e) {
              super(e), (this.source = e.source || "local"), (this.selected = e.selected || null);
            }
            loadChildren() {
              this.setLoaded(!0);
            }
            addChild(e) {
              this.loaded = !0;
              const t = e.relativePath;
              return S("add child relative:", t), this.selected && !this.selected.includes(t) && this.selected.push(t), super.addChild(e);
            }
            updateSelected(e) {
              this.selected.splice(0, this.selected.length, ...e);
            }
          }
          const T = new Map();
          function D(e) {
            return T.has(e) || T.set(e, (0, i.qj)([])), T.get(e);
          }
          function E(e, t = !0, r = "transfer", o = "") {
            if ((o || (o = e.relativePath || e.webkitRelativePath || ""), o.startsWith("/") && (o = o.slice(1)), o)) {
              const i = o.split("/"),
                n = i.shift();
              let s = R(n, r);
              if (!s) {
                let o = e.path;
                for (let e = 0; e < i.length; e++) o && (o = w.parse(o).dir);
                const a = P({ name: n, size: e.size, lastModified: e.lastModified }, r),
                  l = { id: a, name: n, root: n, relativePath: n, path: o, isPublic: t, service: r };
                s = B(l);
              }
              if (s) {
                const i = new C({ file: e, relativePath: o, isPublic: t, service: r });
                return s.addChild(i), i;
              }
              throw new Error("no directory");
            }
            {
              let o = D(r).find((t) => t.file && t.file.name === e.name && t.file.size === e.size && t.file.lastModified === e.lastModified);
              if (o) return o;
              o = new C({ file: e, isPublic: t, service: r });
              const n = (0, i.qj)(o);
              return x(n, r), n;
            }
          }
          function R(e, t) {
            return D(t).find((t) => "dir" === t.type && t.name === e);
          }
          function B(e) {
            let t = R(e.name, e.service);
            return t || ((e.selected = []), (t = new I(e)), x(t, e.service)), t;
          }
          function x(e, t = "transfer") {
            const r = D(t);
            r.find((t) => t.id === e.id) || r.push(e);
          }
          function F(e, t = "transfer") {
            if (!T.has(t)) return;
            const r = D(t),
              i = r.indexOf(e);
            S("removeUploadFile:", e.name, i), -1 !== i && (e.destroy(), r.splice(i, 1), e.isPublic && M());
          }
          function N(e = "transfer") {
            if (!T.has(e)) return;
            const t = D(e),
              r = t.length;
            t.splice(0, r), r > 0 && "transfer" === e && M();
          }
          async function O({ id: e, ppUrl: t, service: r = "transfer" }) {
            if ((S("findUploadFile:", e, t, r), t)) {
              const i = (0, d.HD)(t);
              if (i) {
                e = i.id;
                const t = i.relativePath;
                let o = D(r).find((t) => t.id === e);
                if (o && t && "dir" === o.type) {
                  const e = o.getChild(t);
                  if (e) {
                    const t = o.selected;
                    o = "dir" === e.type || !t || t.includes(e.relativePath) ? e : null;
                  } else o = null;
                }
                return o;
              }
              return await (0, l.s4)(t);
            }
            r = r || "transfer";
            const i = D(r);
            if (e) for (let o = 0; o < i.length; o++) if (e && i[o].id === e) return i[o];
            if (e.startsWith(d.dq.protocol)) {
              const t = await (0, l.s4)(e);
              return t;
            }
            return null;
          }
          function M(e) {
            const t = [];
            D("transfer").forEach((e) => {
              e.isPublic && t.push({ id: e.id, name: e.name, size: e.size, type: e.type, lastModified: e.lastModified, formatSize: e.formatSize });
            });
            const r = { files: t };
            (0, a.mI)(r, e);
          }
          async function U(e, t, r = !0) {
            const i = (0, d.HD)(e);
            if (i) {
              const o = await O({ ppUrl: e, service: t });
              if (o) {
                if ("dir" !== o.type) return [o];
                let e = [];
                e = o.getAllChildren(r);
                const n = i.relativePath ? await O({ id: i.id, service: t }) : o;
                return n.selected && Array.isArray(n.selected) && (e = e.filter((e) => n.selected.includes(e.relativePath))), e;
              }
              return null;
            }
            {
              const t = await b.getDirectoryWithChildrenByPPUrl(e, r);
              if (!t) return S("not find directory:", e), [];
              if (Array.isArray(t)) return t;
              {
                const e = [];
                return (t.relativePath = t.name), (0, h.j1)(t, e, r), e;
              }
            }
          }
          async function z(e, t = "transfer", r = 96) {
            const i = await O({ ppUrl: e, service: t });
            return i && i.thumbnailSrc ? await i.getFinalThumbnailSrc() : "";
          }
          S.enabled && (window.uploadFilesCollections = T);
        },
        87243: (e, t, r) => {
          "use strict";
          r.d(t, { LR: () => R, VX: () => E });
          r(67280), r(76701), r(65663);
          var i = r(77597),
            o = (r(10071), r(24124), r(14244)),
            n = r(12393),
            s = r(78999),
            a = r(73060),
            l = r(87035),
            c = r(40019);
          const d = r(99349)("DownloadStream"),
            { Writable: h } = r(30775),
            u = 1e3,
            p = 2 * a.E,
            A = 2,
            m = 5,
            f = 200,
            g = 1024 * a.E,
            w = 16;
          class y extends h {
            constructor(e) {
              super(Object.assign({ highWaterMark: g }, e)),
                (this.startTime = Date.now()),
                (this.localHandler = e.localHandler),
                (this.id = Math.random().toString().slice(-6)),
                (this.fileId = e.fileId || null),
                (this.fileName = e.fileName || ""),
                (this.fileType = e.fileType || ""),
                (this.chunks = new Map()),
                (this.chunkSize = e.chunkSize || a.E),
                (this.fileStart = e.fileStart || 0),
                (this.startOffset = e.startOffset || this.fileStart / this.chunkSize || 0),
                (this.offset = this.startOffset || 0),
                (this.readNext = this.startOffset),
                (this.totalReceived = this.fileStart),
                (this.totalSize = e.fileSize || 0),
                (this.totalChunks = 0),
                (this.remotePeer = e.remotePeer || null),
                (this.md5 = null),
                (this.paused = !1),
                (this.progress = 0),
                (this.speed = 0),
                (this.speedOn = !1 !== e.speedOn),
                (this._speedMonitor = null),
                (this._ativeSpeedTime = 0),
                (this._timesOfZeroSpeed = 0),
                (this.readedChunks = []),
                (this._writeCb = null),
                (this.receivedComplete = !1),
                (this.complete = !1),
                (this.deflated = !1),
                (this.lastOffset = -1),
                (this._fetchSliceOffset = new Map()),
                (this._maxFetchSliceTimes = 3),
                (this.batchFetchSliceTimer = null),
                (this._backPressured = !1),
                (this.destroyed = !1),
                (this.speedDetectThreshold = u),
                (this.downloadChannel = null),
                this.speedOn && this.startSpeedMonitor(),
                this.on("finish", () => {})
                  .on("close", (e) => {
                    e ? c.error("downloadStream close with error", e) : d("--------------downloadStream end ------------"), this.stopSpeedMonitor();
                    const t = y.list.indexOf(this);
                    -1 !== t && y.list.splice(t, 1);
                  })
                  .on("error", (e) => {
                    c.error("downloadStream error", e);
                  })
                  .on("lowSpeed", (e) => {
                    this.paused || this.destroyed || (this.receivedComplete && !this.complete && (d("get lowSpeed after receivedComplete"), this._batchFetchSlice()));
                  }),
                y.list.push(this);
            }
            _write(e, t, r) {
              try {
                o.Buffer.isBuffer(e) || (e = o.Buffer.from(e));
                const t = (0, a.Jx)(e);
                this.deflated && t && t.chunk && (t.chunk = (0, a.rr)(t.chunk)), t && this.handleMessage(t);
              } catch (i) {
                c.error("get chunk error:", i);
              }
              r();
            }
            onDecodedChunkFromWorker(e) {
              d("get message from decode worker", e), e.error ? (e.offset || 0 === e.offset) && this.fetchSlice(e.offset) : this.handleMessage(e);
            }
            async handleMessage(e) {
              e.type
                ? e.type === i.Nw.downloadReply
                  ? (d("got download reply for meta:", e),
                    (this.fileName = e.fileName),
                    (this.fileType = e.fileType),
                    (this.chunkSize = e.chunkSize),
                    (this.totalSize = e.totalSize),
                    (this.totalChunks = e.totalChunks),
                    (this.remoteHandler = e.localHandler),
                    (this.deflated = e.deflated),
                    (this.channelInfo = e.channelInfo || { type: "" }),
                    (this.md5 = e.md5),
                    void 0 === e.fileStart && this.fileStart && ((this.fileStart = 0), (this.offset -= this.startOffset), (this.readNext -= this.startOffset), (this.fileStart = 0), s.t5.warning(s.ag.t("Remoter do not support resumable"))),
                    this.emit("loadmeta"),
                    0 === this.totalSize && ((this.complete = !0), this.emit("progress", 100), this.emit("end")))
                  : e.type === i.Nw.complete
                  ? (d("got download complete tag"), (this.receivedComplete = !0), this._read(0))
                  : e.type === i.Nw.abort && (d("got download abort tag"), this.abort(new Error("remote")))
                : this._handleChunk(e);
            }
            _handleChunk(e) {
              if (!e || !e.chunk) return void d("_handleChunk error", e);
              if ((this.readedChunks.push(e.chunk), e.intTag < this.readNext || this.chunks.has(e.intTag))) return void d("the data had got, discard", e.intTag);
              if (((this.offset = e.intTag), this.offset > this.lastOffset && (this.lastOffset = this.offset), this.chunks.set(this.offset, e.chunk), (this.totalReceived += o.Buffer.byteLength(e.chunk)), !this.totalSize)) return;
              const t = this.readNext + this.chunks.size,
                r = this.totalChunks ? Math.floor((t / this.totalChunks) * 100) : 0;
              this.paused || this.progress === r || ((this.progress = r), this.emit("progress", r), this.emit("received", t * this.chunkSize)),
                t !== this.totalChunks || this.receivedComplete || ((this.progress = 100), this.emit("progress", r), this.emit("received", this.totalSize), (this.receivedComplete = !0)),
                this._read();
            }
            _read() {
              if (!this.destroyed && !this.paused)
                if (this.chunks.has(this.readNext)) {
                  const e = this.chunks.get(this.readNext);
                  this.chunks.delete(this.readNext), this.emit("data", e), (this.readNext = this.readNext + 1), this._read();
                } else {
                  if (this.lastOffset - this.readNext > f) return void (this._fetchSliceOffset.has(this.readNext) || this.fetchSlice(this.readNext));
                  !this.complete &&
                    this.totalChunks &&
                    this.readNext >= this.totalChunks &&
                    (d("got all data, lastOffset: %d, totalReceived / totalSize: %d / %d, deflated rate: %s", this.lastOffset, this.totalReceived, this.totalSize, this.deflated && this.totalSize ? (this.totalReceived / this.totalSize).toFixed(2) : "undeflate"),
                    (this.complete = !0),
                    this.emit("end"));
                }
            }
            _batchFetchSlice() {
              if (this.destroyed || this.paused || this.batchFetchSliceTimer || this.lastOffset < 0) return;
              this.batchFetchSliceTimer = !0;
              const e = this;
              d("batchFetchSlice readNext:", e.readNext);
              const t = (0, n.tF)({ remotePeer: e.remotePeer });
              if (0 !== t.length) {
                if (!e.complete) {
                  let t = 0;
                  const r = e.receivedComplete ? e.totalChunks : e.lastOffset;
                  for (let i = e.readNext; i < r; i++) if ((e.chunks.has(i) || e._fetchSliceOffset.has(i) || (t++, e.fetchSlice(i)), t >= w)) return;
                }
                setTimeout(() => {
                  e.batchFetchSliceTimer = null;
                }, 3e3);
              } else s.t5.warning("error1001: no channel");
            }
            fetchSlice(e) {
              if (this.destroyed) return;
              const t = this._fetchSliceOffset.has(e) ? this._fetchSliceOffset.get(e) : 0;
              if (e >= this.readNext && !this.chunks.has(e) && t <= this._maxFetchSliceTimes) {
                d(this.fileName + ": fetch lost slice, offset: %d", e), this._fetchSliceOffset.set(e, t + 1), this.emit("lessSlice", e);
                const r = this,
                  i = this.receivedComplete ? 3e3 : 5e3;
                setTimeout(() => {
                  if (this.destroyed) return;
                  const t = this._fetchSliceOffset.has(e) ? this._fetchSliceOffset.get(e) : 0;
                  e >= r.readNext && !r.chunks.has(e) && t <= this._maxFetchSliceTimes ? r.fetchSlice(e) : r._fetchSliceOffset.delete(e);
                }, i);
              }
            }
            pauseMe() {
              this.paused || (d("pauseMe"), (this.paused = !0), (this._timesOfZeroSpeed = 0), (this._ativeSpeedTime = 0), this.emit("paused"));
            }
            resumeMe() {
              this.destroyed || (d("resumeMe"), (this.paused = !1), this._batchFetchSlice(), this._read(), this.emit("resumed"));
            }
            abort(e) {
              if (this.destroyed) return;
              this.chunks.clear();
              const t = e || new Error("abort");
              this.emit("abort", e), this.destroy(t);
            }
            startSpeedMonitor() {
              d("startSpeedMonitor"),
                (this._speedMonitor = setInterval(() => {
                  if (this.destroyed) return void this.stopSpeedMonitor();
                  if (this.paused) return void this.emit("speed", 0);
                  let e = 0;
                  this.readedChunks.length > 0 && (e = o.Buffer.byteLength(this.readedChunks[0]) * this.readedChunks.length),
                    (this.readedChunks = []),
                    0 === e
                      ? (this._timesOfZeroSpeed++,
                        this._timesOfZeroSpeed > A && this._ativeSpeedTime < m && !this.paused
                          ? ((this._timesOfZeroSpeed = 0), this._ativeSpeedTime++, this.destroyed || (-1 === this.lastOffset && this._ativeSpeedTime < 2) || (this.resumeMe(), this._batchFetchSlice()))
                          : this._ativeSpeedTime >= m && d("cannot reactive resume by program"))
                      : ((this._timesOfZeroSpeed = 0), (this._ativeSpeedTime = 0));
                  const t = Math.round((1e3 * e) / this.speedDetectThreshold);
                  this.speed !== t && ((this.speed = t), this.emit("speed", this.speed)), t <= p && this.emit("lowSpeed", t);
                }, this.speedDetectThreshold));
            }
            stopSpeedMonitor() {
              this._speedMonitor && (this.emit("speed", 0), clearInterval(this._speedMonitor), (this._speedMonitor = null));
            }
            _destroy(e, t) {
              d("-- destroy --"), (this.destroyed = !0), this._speedMonitor && this.stopSpeedMonitor(), this.localHandler && (0, l.vS)(this.localHandler), this.downloadChannel && (this.downloadChannel = null), this.decodeWorker && (this.decodeWorker.terminate(), (this.decodeWorker = null));
              const r = this;
              h.prototype._destroy.call(this, e, function (e) {
                t && "function" === typeof t && t(e), r.chunks.clear(), r._fetchSliceOffset.clear(), (r.readedChunks = []);
              });
            }
          }
          y.list = [];
          var v = r(95911),
            b = r(6228),
            S = r(88322),
            P = (r(12144), r(5478)),
            C = r(40019);
          const k = r(99349)("downloadOverChannel"),
            I = () => {},
            T = 20,
            D = {};
          function E(e, t) {
            const r = (0, i.tA)(e);
            if (r.connected) {
              if (!r.clientType)
                return (
                  D[e] || (D[e] = 0),
                  D[e] > T
                    ? void (D[e] = 0)
                    : (D[e]++,
                      k("wait clientType.."),
                      void setTimeout(() => {
                        t && E(e, t);
                      }, 500))
                );
              if ((k("begin to preBuildDataChannel"), !(0, i.h7)("openNodeChannel") || ("pc" !== i.l6.clientType && "pc" !== r.clientType))) k("pre build peer data channel of webrtc"), (0, n.m$)({ remotePeer: e, serviceType: i.V9.data, initiator: !0 });
              else {
                k("pre build peer data  channel of node");
                const t = P.l.getChannel({ remotePeer: e });
                t || new P.l({ remotePeer: e, initiator: !0 });
              }
              D[e] = 0;
            }
          }
          function R({ remotePeer: e, fileId: t, ppUrl: r, fileName: o, fileSize: a, storage: c, service: d, cacheFile: h, savePath: u, directory: p, test: A }) {
            const m = (h && h.cached) || 0;
            let f = new y({ remotePeer: e, fileId: t, fileName: o, fileSize: a, fileStart: m });
            const g = () => {
              !f || f.destroyed || f.paused || (k("resume after reconnect"), f.resumeMe());
            };
            l.YB.on("linked_" + e, g);
            const w = (e) => {
                k("abort" === e ? "++++++++ download abort +++++++++++ " : "++++++++ success+++++++++++ ");
              },
              P = new b.a(w, { id: f.fileId, name: f.fileName, size: f.totalSize, type: f.fileType, savePath: u, cacheFile: h, storage: c, ppurl: r, directory: p });
            f
              .once("loadmeta", () => {
                O(f), f.emit("start"), P.setFileInfo({ name: f.fileName, size: f.totalSize, type: f.fileType, chunkSize: f.chunkSize, cacheFile: f.fileStart ? h : null }), f.emit("storage", P.saveStorage);
              })
              .on("progress", (e) => {})
              .on("abort", (e) => {
                k("download abort"), f && !f.destroyed && (P && P.abort(e), e && "remote" === e.message ? s.t5.warning(s.ag.t("remote uploading aborted")) : F(f));
              })
              .on("paused", () => {
                f && !f.destroyed && N(f);
              })
              .on("resumed", () => {
                f && !f.destroyed && O(f);
              })
              .on("lessSlice", (e) => {
                f && U(f, e);
              })
              .on("backPressure", () => {
                f && !f.destroyed && z(f);
              })
              .on("end", () => {
                const e = Date.now() - f.startTime;
                k("----- downloadStream end ---------, total download time: %d, Av download rate: %s MByte/s", e, (1e3 * f.totalSize) / (e * (1 << 20))),
                  M(f),
                  P.end(null, () => {
                    k("fileSaver ended");
                  }),
                  (0, v.vS)(T),
                  (0, S.q)("complete", { category: "download", value: e });
              })
              .on("close", () => {
                l.YB.off("linked_" + e, g), (f = null);
              })
              .on("data", (e) => {
                P.write(e, null, I);
              }),
              P.on("fileError", () => {
                s.t5.error(s.ag.t("File is damaged"));
              })
                .on("end", () => {
                  k("---------------fileSaver ended -----------------");
                })
                .on("error", (e) => {
                  k("---------------fileSaver error -----------------"), C.error("fileSave error", e), s.t5.error(s.ag.t(e.message)), F(f), f.destroyed || f.abort(new Error("can not save"));
                })
                .once("save-complete", (e) => {
                  setTimeout(() => {
                    f.emit("save-complete", e), f.destroy();
                  }, 0);
                });
            const T = (0, v.Hj)((e, t, r) => {
              B(f, e, t, r);
            });
            (f.localHandler = T), k.enabled && (window.dlstreams || (window.dlstreams = []), window.dlstreams.push({ downloadStream: f, fileSaver: P }));
            const D = { type: i.Nw.download, fileId: t, ppUrl: r, fileName: o || "download", clientId: (0, i.$D)(), fileStart: m, localHandler: T, service: d, directory: p };
            return (0, n.lW)({ remotePeer: e, serviceType: i.V9.message, data: D, handler: T }), f;
          }
          function B(e, t, r, o) {
            e ? (o ? e.writable && e.write(o, null, I) : t && (t.type === i.Nw.downloadReply && x(e, t.channelInfo), e.handleMessage(t))) : k("can not find downloadStream", t);
          }
          function x(e, t) {
            if ("node" === t.type && t.uploadHandler) {
              let r = P.l.getChannel({ remotePeer: e.remotePeer, remoteHandler: t.uploadHandler });
              r || (r = new P.l({ remotePeer: e.remotePeer, remoteHandler: t.uploadHandler })), k("initDownloadChannel:", r), (e.downloadChannel = r);
            }
          }
          function F(e, t) {
            k("triggerAbort");
            const r = { type: i.Nw.abort, localHandler: e.localHandler, fileId: e.fileId, offset: e.offset, fileName: e.fileName, remoteHandler: e.remoteHandler };
            (0, n.lW)({ remotePeer: e.remotePeer, serviceType: i.V9.message, handler: e.localHandler, data: r }, t);
          }
          function N(e, t) {
            k("triggerPause");
            const r = { type: i.Nw.pause, localHandler: e.localHandler, fileId: e.fileId, offset: e.offset, fileName: e.fileName, remoteHandler: e.remoteHandler };
            (0, n.lW)({ remotePeer: e.remotePeer, serviceType: i.V9.message, handler: e.localHandler, data: r }, t);
          }
          function O(e, t) {
            k("triggerResume");
            const r = { type: i.Nw.resume, localHandler: e.localHandler, fileId: e.fileId, offset: e.offset, fileName: e.fileName, remoteHandler: e.remoteHandler };
            (0, n.lW)({ remotePeer: e.remotePeer, serviceType: i.V9.message, handler: e.localHandler, data: r }, t);
          }
          function M(e, t) {
            k("triggerComplete");
            const r = { type: i.Nw.complete, localHandler: e.localHandler, fileId: e.fileId, offset: e.offset, fileName: e.fileName, remoteHandler: e.remoteHandler };
            (0, n.lW)({ remotePeer: e.remotePeer, serviceType: i.V9.message, handler: e.localHandler, data: r }, t);
          }
          function U(e, t, r) {
            k("triggerFetchSlice", t);
            const o = { type: i.Nw.fetch, localHandler: e.localHandler, fileId: e.fileId, offset: t, fileName: e.fileName, remoteHandler: e.remoteHandler };
            (0, n.lW)({ remotePeer: e.remotePeer, serviceType: i.V9.message, handler: e.localHandler, data: o }, r);
          }
          function z(e, t) {
            k("triggerBackPressure");
            const r = { type: i.Nw.backPressure, localHandler: e.localHandler, fileId: e.fileId, offset: e.readNext, fileName: e.fileName, remoteHandler: e.remoteHandler };
            (0, n.lW)({ remotePeer: e.remotePeer, serviceType: i.V9.message, handler: e.localHandler, data: r }, t);
          }
        },
        20348: (e, t, r) => {
          "use strict";
          r.d(t, { KL: () => S, UO: () => w, Vl: () => g, km: () => A, mK: () => f, pC: () => m, sX: () => P, wK: () => y });
          r(43610), r(10071), r(17965), r(66016), r(24124);
          var i = r(84350),
            o = r(33437),
            n = r(38445),
            s = r(78999),
            a = r(40019);
          const l = null,
            c = r(20180),
            d = c,
            h = null,
            u = r(99349)("fileManager.js");
          function p(e, t = "file") {
            if (!e || "dir" === t) return !1;
            const r = (0, i.bh)(e) || "",
              o = ["image", "video", "audio", "pdf", "text"];
            return o.some((e) => r.includes(e));
          }
          function A(e, t, r) {
            if (!e || !t || !r) return "";
            let i;
            try {
              const o = d.join("download", t),
                s = new URL(o, e);
              (r = "" + r), r.startsWith(n.dq.protocol) ? s.searchParams.set("url", r) : s.searchParams.set("fileId", r), (i = s.href);
            } catch (o) {
              a.error("getDownloadUrl error:", o);
            }
            return i;
          }
          function m(e, t, r = "file") {
            return t && p(e, r) ? t + "&preview=true" : "";
          }
          function f(e) {
            e && (l ? l.openUrl(e) : (0, o.Z)(e));
          }
          function g(e) {
            e && (window.electronAPI ? window.electronAPI.shell.showItemInFolder(e) : window.capacitorAPI && window.capacitorAPI.filePicker.openFolder(e));
          }
          function w(e) {
            return d.parse(e).base;
          }
          function y(e) {
            return e ? (window.capacitorAPI ? window.capacitorAPI.filePicker.getDisplayPathOfUri(e) : e) : "";
          }
          async function v(e = "") {
            const t = await (0, s.mZ)({
              title: s.ag.t("Overwrite"),
              message: e ? e + s.ag.t("exist, overwrite it?") : s.ag.t("There is a same file here, overwrite it?"),
              persistent: !0,
              options: {
                type: "radio",
                model: "overwrite",
                items: [
                  { label: s.ag.t("overwrite the file"), value: "overwrite", color: "primary" },
                  { label: s.ag.t("create new file"), value: "new", color: "primary" },
                ],
              },
            });
            let r = 0;
            return Array.isArray(t) && (r = "overwrite" === t[1] ? 1 : 2), r;
          }
          async function b(e = "") {
            const t = await (0, s.mZ)({
              title: s.ag.t("Overwrite"),
              message: e ? e + s.ag.t("exist, overwrite it?") : s.ag.t("The folder is exist, how to?"),
              persistent: !0,
              options: {
                type: "radio",
                model: "resume",
                items: [
                  { label: s.ag.t("merge folder, ignore exist files"), value: "resume", color: "primary" },
                  { label: s.ag.t("overwrite full folder"), value: "overwrite", color: "secondary" },
                  { label: s.ag.t("create new folder"), value: "new" },
                ],
              },
            });
            let r = 0;
            if (Array.isArray(t)) {
              const e = t[1];
              switch (e) {
                case "resume":
                  r = 1;
                  break;
                case "overwrite":
                  r = 2;
                  break;
                case "new":
                  r = 3;
                  break;
                default:
              }
            }
            return r;
          }
          async function S(e = "file", t = "") {
            return "dir" === e ? await b(t) : await v(t);
          }
          async function P(e, t, r = 96, o) {
            if (!e && !t) return "";
            try {
              if (e && h) {
                const t = await h.getThumbnail(e, r, o);
                return u("get thumbnail from client, path, thumbnail length", e, t && t.length), t;
              }
              if (t) return await (0, i.R8)(t, r);
            } catch (n) {
              a.error("getThumbnail error:", n);
            }
            return "";
          }
        },
        33335: (e, t, r) => {
          "use strict";
          r.d(t, { o: () => o });
          const i = r(99349)("fileSaveInfo");
          class o {
            constructor(e) {
              (this.id = e.id || Math.random().toString().slice(-8)),
                (this.type = e.type),
                (this.fileName = e.fileName || ""),
                (this.path = e.path),
                (this.state = e.state || "saving"),
                (this.saved = 0),
                (this.fileSize = e.fileSize || 0),
                (this.startTime = Date.now()),
                (this.costTime = 0),
                (this.error = "");
            }
            get progress() {
              return "complete" === this.state || 0 === this.fileSize ? 100 : Math.floor((this.saved / this.fileSize) * 100);
            }
            increaseSaved(e) {
              this.saved += e;
            }
            setReceived(e) {
              this.saved = e;
            }
            setState(e) {
              i("setState:", e), (this.state = e), "complete" === this.state && (this.costTime = Date.now() - this.startTime);
            }
            setPath(e) {
              this.path = e;
            }
            setError(e) {
              this.error = e;
            }
          }
        },
        89221: (e, t, r) => {
          "use strict";
          r.d(t, { Az: () => p, LK: () => m, hX: () => A, kd: () => g, vq: () => f });
          r(24124), r(7098), r(65663);
          var i = r(84350),
            o = r(87073),
            n = r(78999),
            s = r(53935),
            a = r(61959),
            l = r(40019);
          const c = null,
            d = null,
            h = r(99349)("localFilesService.js");
          async function u(e) {
            if (!e.loadingInfo) {
              (e.loading = !0), e.setLoadingInfo(!0), h("load children info");
              try {
                const t = await (0, s.kR)("client", e.id);
                t.forEach((t) => {
                  e.addChild(t);
                });
              } catch (t) {
                l.error("loadLocalDirectoryChildren", t);
              } finally {
                (e.loading = !1), e.setLoadingInfo(!1), e.setLoaded(!0);
              }
            }
          }
          async function p(e = "") {
            const t = d ? "client" : "db",
              r = await (0, s.kR)(t, e);
            r.sort((e, t) => t.created - e.created);
            const i = (0, a.qj)([]);
            return (
              r.forEach((e) => {
                if (e && e.name)
                  if ("dir" === e.type) {
                    const t = new o.VD(e);
                    (t.loadChildren = u.bind(null, t)), (t.formatCreated = (0, n.jE)(e.created)), (t.formatCached = (0, n.ys)(e.completed ? e.size : e.cached || 0)), (t.completed = e.completed), (t.fsize = (0, n.ys)(e.size)), (t.fcount = e.filesCount), (t.savePath = e.savePath), i.push(t);
                  } else (e.fsize = (0, n.ys)(e.size)), (e.formatSize = e.fsize), (e.formatCreated = (0, n.jE)(e.created)), (e.formatCached = (0, n.ys)(e.completed ? e.size : e.cached || 0)), i.push(e);
              }),
              i.forEach(async (e) => {
                if ("dir" !== e.type && !e.completed) {
                  const t = d ? await c.getFileStat(e.path) : await (0, s.hn)(e.id);
                  t && ((e.cached = d ? t.size : t.cached), (e.formatCached = (0, n.ys)(e.cached)));
                }
              }),
              i
            );
          }
          async function A(e) {
            d ? await d.removeFile(e) : await (0, s.Od)(e);
          }
          async function m() {
            d ? await d.clearFilesInCache() : await (0, s.Rs)();
          }
          async function f(e) {
            const { id: t, name: r, type: o } = e;
            if (d) {
              const e = await d.getSavePath(r, !1, !1);
              if (e) {
                const r = await d.exportFile(t, e);
                return (0, i.IP)(), await (0, s.zx)(t, { savePath: e }), r;
              }
            } else "dir" === o ? n.t5.warning({ message: n.ag.t("Only work in client") }) : await (0, s.WD)(t);
          }
          function g() {
            d && d.openCacheFolder();
          }
        },
        12144: (e, t, r) => {
          "use strict";
          r.d(t, { m: () => A });
          r(10071), r(17965), r(66016), r(76701), r(65663), r(24124);
          var i = r(24636),
            o = r.n(i),
            n = r(87035),
            s = r(77597),
            a = r(85308),
            l = r(12393),
            c = r(73060),
            d = r(14244)["Buffer"];
          const h = r(99349)("relayByWebsocket.js"),
            u = 8 * c.jk,
            p = 4 * u;
          n.YB.on(s.Nw.fetchByWebsocket, (e, t) => {
            h("get message fetchByWebsocket", e);
            const r = e.fetchUrl;
            if (!r) return void h("less of fetchUrl");
            const i = new URL(r),
              o = i.searchParams.get("local"),
              n = i.searchParams.get("remote");
            if (!o || !n) return void h("less of localPeer or remotePeer:", o, n);
            const s = { highWaterMark: u, server: i.origin, channelId: o + ":" + n, localPeer: o, remotePeer: n };
            A.addChannel(s);
          }).on("unLinked_remote", (e) => {
            const t = (0, s.$D)() + ":" + e,
              r = A.wsList.get(t) || [];
            h("unLinked_remote clear websocket channel:", r),
              r.forEach((e) => {
                e.destroy(!0);
              });
          });
          class A extends o() {
            constructor(e) {
              if ((super(), (this.id = e.id || Math.random().toString().slice(-6)), (this.server = e.server), (this.initiator = e.initiator || !1), (this.url = null), (this.fetchUrl = null), !this.server)) throw new Error("no server");
              (this.wsClient = null),
                (this.highWaterMark = e.highWaterMark || u),
                (this.callback = e.callback || null),
                (this.localPeer = e.localPeer || (0, s.$D)()),
                (this.remotePeer = e.remotePeer),
                (this.channelId = e.channelId || this.localPeer + ":" + this.remotePeer),
                (this.isOpen = !1),
                (this.connected = !1),
                (this.remoteWritable = !1),
                (this._maxCostTime = 3e3),
                (this._lastCostTime = 0),
                (this._completed = !1),
                (this.cached = []),
                (this.remoteSendable = !1),
                (this.checkRemoteBufferTimer = null),
                (this.checkLocalBufferTimer = !1),
                (this.destroyed = !1),
                (this.maxInitTimes = 3),
                (this.initTimes = 0),
                this.initWs();
            }
            get bufferSize() {
              return this.wsClient ? this.wsClient.bufferedAmount : -1;
            }
            get sendable() {
              return this.bufferSize < this.highWaterMark && this.remoteSendable;
            }
            setUrl() {
              const e = new URL("ws/relay", this.server);
              e.searchParams.set("local", this.localPeer), e.searchParams.set("remote", this.remotePeer), (this.url = e.href);
              const t = new URL("ws/relay", this.server);
              t.searchParams.set("local", this.remotePeer), t.searchParams.set("remote", this.localPeer), (this.fetchUrl = t.href);
            }
            initWs() {
              h("initWs"), this.url || this.setUrl(), this.initTimes++;
              const e = new WebSocket(this.url);
              (e.binaryType = "arraybuffer"),
                e.addEventListener("open", () => {
                  h("open ws"), (this.wsClient = e), (this.isOpen = !0), this.emit("open"), (this.initTimes = 0), A.wsList.has(this.channelId) || A.wsList.set(this.channelId, []), A.wsList.get(this.channelId).push(this);
                }),
                e.addEventListener("message", (e) => {
                  const t = e.data;
                  if ("string" !== typeof t) this.emit("data", t), n.YB.emit("peerData", {}, this, d.from(t));
                  else {
                    if ((h("get msg from server:", t), t.startsWith("buffered:"))) {
                      const e = parseInt(t.split(":").pop() || 0);
                      return void (
                        isNaN(e) ||
                        (0 === e
                          ? ((this.remoteSendable = !0), this.checkRemoteBufferTimer && (h("stop checkRemoteBufferTimer"), clearInterval(this.checkRemoteBufferTimer), (this.checkRemoteBufferTimer = null)), this.sendCached(), this.emit("drain"))
                          : e > p &&
                            ((this.remoteSendable = !1),
                            this.checkRemoteBufferTimer ||
                              (h("start checkRemoteBufferTimer"),
                              (this.checkRemoteBufferTimer = window.setInterval(() => {
                                this.checkRemoteBuffered();
                              }, 1e3)))))
                      );
                    }
                    switch (t) {
                      case "full":
                        (this.remoteSendable = !1), this.emit("full");
                        break;
                      case "lost":
                        (this.connected = !1), this.emit("lost");
                        break;
                      case "connect":
                        (this.connected = !0), (this.remoteSendable = !0), this.emit("connect");
                        break;
                      case "disconnect":
                        (this.connected = !1), this.emit("disconnect");
                        break;
                      default:
                        try {
                          const e = JSON.parse(t);
                          h("relay of websocket received:", e), e.remoteHandler ? n.YB.emit(e.remoteHandler, e, this) : n.YB.emit("peerData", e, this, null);
                        } catch (r) {
                          h("json parse error:", r);
                        }
                    }
                  }
                }),
                e.addEventListener("close", (e) => {
                  h("relay ws close close.code:", e.code), (this.wsClient = null), (this.remoteSendable = !1), (this.connected = !1);
                  const t = A.wsList.get(this.channelId);
                  if (t) {
                    const e = t.findIndex((e) => e.id === this.id);
                    e > -1 && t.splice(e, 1);
                  }
                }),
                e.addEventListener("error", (e) => {
                  h("ws error", e);
                  const t = this.isOpen;
                  (this.wsClient = null), (this.isOpen = !1), (this.remoteSendable = !1), this.emit("error", e), this.initTimes < this.maxInitTimes ? this.initWs() : t || (h("can not connect relay server:", this.server), this.emit("invalid", this.server));
                });
            }
            checkSendable() {
              return this.remoteSendable;
            }
            write(e, t = () => {}) {
              !this.cached.length && this.sendable ? this.send({ chunk: e }, t) : (this.cached.push(this.send.bind(this, { chunk: e }, t)), this.sendCached());
            }
            sendCached() {
              while (this.sendable && this.cached.length > 0) this.cached.shift()();
            }
            send({ chunk: e, message: t }, r = () => {}) {
              t && this.wsClient.send(t),
                e && this.wsClient.send(e),
                setTimeout(r, 0),
                this.bufferSize > this.highWaterMark ? this.checkLocalBufferTimer || (this.checkLocalBufferTimer = this.checkLocalBuffered()) : this.checkLocalBufferTimer && (clearTimeout(this.checkLocalBufferTimer), (this.checkLocalBufferTimer = null));
            }
            checkLocalBuffered() {
              return setTimeout(() => {
                if (((this.checkLocalBufferTimer = null), this.destroyed)) return;
                const e = this.bufferSize;
                h("checkLocalBuffered, id: %s, buffered: %s", this.id, e), e <= c.jk ? this.emit("drain") : e > 0 && (this.checkLocalBufferTimer = this.checkLocalBuffered());
              }, 30);
            }
            checkRemoteBuffered() {
              this.wsClient ? this.wsClient.send("") : this.checkRemoteBufferTimer && (clearInterval(this.checkRemoteBufferTimer), (this.checkRemoteBufferTimer = null));
            }
            triggerFetchByRelay() {
              h("triggerFetchByRelay");
              const e = { type: s.Nw.fetchByWebsocket, server: (0, a.S)(), fetchUrl: this.fetchUrl };
              e && (0, l.lW)({ remotePeer: this.remotePeer, serviceType: s.V9.message, data: e });
            }
            close(e) {
              e || this.destroy();
            }
            destroy() {
              (this.destroyed = !0), this.wsClient && this.wsClient.close(), this.checkRemoteBufferTimer && window.clearTimeout(this.checkRemoteBufferTimer);
              const e = A.wsList.get(this.channelId);
              if (e) {
                const t = e.findIndex((e) => e.id === this.id);
                t > -1 && e.splice(t, 1);
              }
            }
          }
          (A.wsList = new Map()),
            (A.getChannels = function (e) {
              if (!e.remotePeer) throw new Error("no remote peer");
              e.server || (e.server = (0, a.S)()), e.localPeer || (e.localPeer = (0, s.$D)());
              const t = e.channelId || e.localPeer + ":" + e.remotePeer;
              let r = A.wsList.get(t);
              return r || (A.wsList.set(t, []), (r = A.wsList.get(t))), r;
            }),
            (A.addChannel = async (e) => {
              const t = new A(e);
              return new Promise((e, r) => {
                const i = setTimeout(() => {
                  r(new Error("timeout"));
                }, 3e3);
                t.once("open", () => {
                  i && (clearTimeout(i), t.initiator && t.triggerFetchByRelay(), e(t));
                });
              });
            }),
            (A.sendByRelay = async function (e, t) {
              try {
                const r = A.getChannels({ remotePeer: e });
                let i = r.find((e) => e.remoteSendable);
                if (i) i.send({ message: t });
                else {
                  const r = { initiator: !0, remotePeer: e, server: (0, a.S)(), localPeer: (0, s.$D)() };
                  (i = await A.addChannel(r)),
                    i.once("connect", () => {
                      i.send({ message: t });
                    });
                }
                return i;
              } catch (r) {
                throw (h("sendByRelay error:", r), r);
              }
            }),
            h.enabled && (window.UploadByWebSocket = A);
        },
        9534: (e, t, r) => {
          "use strict";
          r.d(t, { Gz: () => m, Yd: () => w, bs: () => A, c1: () => y, rB: () => p, sz: () => g });
          r(24124), r(76701);
          var i = r(77597),
            o = r(53935),
            n = r(89221),
            s = r(78999),
            a = r(87035),
            l = r(58703),
            c = r(84350),
            d = r(40019);
          const h = null,
            u = r(99349)("resumableTransfer.js");
          function p() {
            const e = (0, i.h7)("enableResumable");
            return "enabled" === e;
          }
          function A(e) {
            const t = e ? "enabled" : "disabled";
            (y.resumable = "enabled" === t), (0, i.m3)("enableResumable", t);
          }
          async function m(e) {
            const t = h ? await h.getFile(e) : await (0, o.hn)(e);
            return t;
          }
          async function f(e, t, r) {
            return h ? h.exportFile(e, t, r) : (0, o.WD)(e);
          }
          async function g(e, t) {
            try {
              if (!t) {
                const r = await (0, o.hn)(e);
                if (!r) throw new Error("no exist");
                t = r.name;
              }
              const r = h ? await h.selectSaveFile(t) : "auto";
              if ((u("exportFileWithNotify, savePath:", r), !r)) return;
              const i = await f(e, r);
              if (i) {
                (0, c.IP)();
                const e = !0 === i ? s.ag.t("Export success") : s.ag.t("Saved to") + h.getDisplayPath(i);
                s.t5.success(e);
              }
            } catch (r) {
              d.error("export error:", r), s.t5.error({ type: "error", message: s.ag.t("Export fail") + ": " + r.message });
            }
          }
          async function w(e) {
            await (0, n.hX)(e);
            const t = (0, l.LY)({ id: e });
            t && (t.cacheFile = null);
          }
          const y = { resumable: !1 };
          setTimeout(() => {
            y.resumable = p();
          }),
            a.YB.on("new_cache_file_complete", async (e) => {
              const t = (0, l.LY)({ id: e });
              t && (t.cacheFile = await (0, o.hn)(e));
            });
        },
        12552: (e, t, r) => {
          "use strict";
          r.d(t, { id: () => S, ll: () => w, s4: () => b, yA: () => y });
          r(24124), r(76701), r(43610);
          var i = r(58703),
            o = r(56999),
            n = r(60496),
            s = r(38445),
            a = r(78999),
            l = r(23503),
            c = r(90965),
            d = (r(77597), r(79305)),
            h = r(95911),
            u = r(20348),
            p = r(71178),
            A = r(99715);
          const m = r(40399),
            f = null,
            g = r(99349)("shareDownload.js");
          async function w(e, t = "webrtc", r = !1, i = null) {
            if ((g("downloadSharedFileOrDirectory:", e, t), !e || !e.ppurl)) throw new Error("no fileItem or ppurl");
            const o = new s.dq(e.ppurl).peerId;
            await (0, h.W0)(o);
            const l = (0, c.Vl)(e.id);
            if (l) {
              if ("waiting" === l.status) return void a.t5.info(a.ag.t("Waiting in queue"));
              if (["working", "paused"].includes(l.status)) return void a.t5.info(a.ag.t("Is downloading"));
              (0, c.G3)(l);
            }
            let p;
            try {
              if ("dir" === e.type) {
                const r = !0;
                let i = !1,
                  o = "";
                if (f) {
                  if (((o = await f.getSavePath(e.name, !0)), !o)) throw new Error("no save path");
                  if (await f.checkFileExistOfPath(o)) {
                    const t = await (0, u.KL)("dir", e.name);
                    switch (t) {
                      case 0:
                        return;
                      case 1:
                        break;
                      case 2:
                        i = !0;
                        break;
                      case 3:
                        o = await f.getValidFilePath(o);
                        break;
                      default:
                    }
                  }
                  if (!o) throw new Error("no save path");
                  e.savePath = o;
                }
                p = "http" === t ? await (0, d.x6)(e, r, i) : await (0, n.u)(e, r, i);
              } else {
                if (f) {
                  const t = await f.getSavePath(e.name);
                  if (!t) throw new Error("no save path");
                  e.savePath = t;
                }
                p = "http" === t ? await (0, d.fQ)(e) : await y(e, r ? i : null);
              }
              return p;
            } catch (A) {
              g("downloadSharedFileOrDirectory error:", A), a.t5.error(a.ag.t(A.message));
            }
          }
          async function y(e, t) {
            const r = v(e),
              i = (0, c.O7)(r),
              o = function () {};
            return await i.download({ savePath: e.savePath, cacheFile: t, callback: o }), i;
          }
          function v(e) {
            const t = new i.xn({ remotePeer: e.remotePeer, id: e.id, ppurl: e.ppurl, name: e.name, type: (e && e.type) || "", size: (e && e.size) || 1, lastModified: (e && e.lastModified) || void 0, service: e.service || "share", thumbnailSrc: e.thumbnailSrc || "" });
            return t;
          }
          async function b(e) {
            if ((g("getUploadFile:", e), !e)) return null;
            try {
              const t = new s.dq(e),
                r = await (0, o.$O)(t.groupId);
              if (!r) return null;
              const i = t.fullPath,
                n = await m.createFileItem(i);
              if (!n) return null;
              const a = new l.G1({ id: n.url, file: n, isPublic: !1 });
              return g("create new uploadfile：", a), a;
            } catch (t) {
              return g("getUploadFile error:", t), null;
            }
          }
          async function S(e) {
            const { groupId: t, childRoot: r, childPath: i } = (0, p.e)(e);
            if (!r) return "";
            const o = new s.dq(e);
            if (o.isTransfer) {
              const t = await (0, l.VI)({ ppUrl: e });
              return t ? t.path : "";
            }
            {
              const e = [t, r].join("/"),
                n = await (0, A.No)(e);
              return n && n.path ? (i ? await m.getLocalPathByRelativePath(n.path, o.relativePath) : n.path) : "";
            }
          }
        },
        79305: (e, t, r) => {
          "use strict";
          r.d(t, { Sv: () => p, fQ: () => h, x6: () => u });
          r(24124), r(76701);
          var i = r(58703),
            o = r(60496),
            n = r(90965),
            s = r(40019);
          const a = null,
            l = r(99349)("transferByHttp.js");
          class c extends o.n {
            constructor(e) {
              super(e), (this.channelType = "http"), (this.downloadUrl = e.downloadUrl || "");
            }
            createDownloadFile(e) {
              const t = new i.Jy({ remotePeer: this.remotePeer, id: e.ppurl, ppurl: e.ppurl, name: e.name, type: e.type || "", size: e.size || 1, lastModified: e.lastModified || void 0, savePath: e.savePath, service: this.service, relativePath: e.relativePath, url: e.downloadUrl });
              return (
                t.once("downloadEnd", () => {
                  l("downloadFileOfHttp downloadEnd"),
                    setTimeout(() => {
                      t.emit("save-complete");
                    }, 0);
                }),
                t
              );
            }
          }
          function d(e) {
            try {
              const t = new i.Jy({ remotePeer: e.remotePeer, id: e.id, ppurl: e.ppurl, name: e.name, type: e.type, size: e.size || 1, lastModified: (e && e.lastModified) || void 0, service: e.service || "share", url: e.downloadUrl, savePath: e.savePath });
              return t;
            } catch (t) {
              throw (s.error("createDownloadFileOfHttp error:", t), t);
            }
          }
          async function h(e) {
            if ((l("downloadSharedFileByHttp, downloadUrl:", e.downloadUrl), !e.savePath)) throw new Error("no save path");
            const t = d(e),
              r = (0, n.O7)(t),
              i = function () {
                l("download success, run callback");
              };
            return await r.download({ savePath: e.savePath, callback: i }), r;
          }
          async function u(e, t = !0, r = !1) {
            l("downloadSharedDirectoryByHttp, downloadUrl:", e.downloadUrl);
            const i = new c({ ...e, deep: t, overwrite: r }),
              o = (0, n.O7)(i);
            return (
              await o.download(),
              setTimeout(() => {
                (0, n.Qu)(o.remotePeer);
              }, 30),
              o
            );
          }
          async function p(e, t, r) {
            if (!a) return null;
            if (r) {
              const e = window.capacitorAPI ? 2 * r : r;
              if (!(await a.hasEnoughSpace(t, e))) throw new Error("No enough storage space");
            }
            return window.electronAPI ? await window.electronAPI.client.downloadFile(e, t) : await window.capacitorAPI.fileDownloader.downloadFile(e, t);
          }
        },
        23111: (e) => {
          e.exports = {
            "not support this browser, you can try the latest chrome": "This browser is not supported, you can try the latest recommended browser",
            "not support Wechat, you can try in a browser": 'Sorry, can not save files in WeChat，please use "Open in the browser"',
            "not support download, you can try latest chrome, firefox": "Some functions may not be available in this browser, it is recommended to use the recommended browser",
            title: "PPZhilian",
            subTitle:
              'PC, mobile phone, tablet, etc. are connected directly via browsers to help <span class="text-highlight">share data</span> (files, LCD monitors, desktop screens, etc.) and <span class="text-highlight">control remote</span>, or with other devices, to make the network <span class="text-highlight">interconnected</span>',
            slogan: "Point-to-point direct connection, high-speed, private File transfer, real-time sharing, remote control",
            slogan_1: "Committed to cross-device, cross-network, and cross-platform direct connection and interoperability",
            "Method of linking": "Peer-to-Peer Linking",
            my_url: "My P2P Address",
            "copied to clipboard": "Copied to clipboard",
            "Template url linking": "Connect via template url",
            my_url_hint: "The others can visit this temporary URL to establish a direct connection, and the URL is invalid when the page is closed ",
            "Connected device": "Devices of connected",
            "Allow access by shortCode": "Allow linking via short code",
            "My short code": "My short code",
            "Disallow access by shortCode": "Forbid linking by short code",
            "Link by shortCode": "Input remoter's shortCode to connect",
            "Can not link yourself": "Sorry，please input remoter's shortCode to connect",
            "Have linked": "Already connected",
            none: "None",
            Reconnect: "Reconnect",
            Disconnect: "Disconnect",
            "Are you sure to Reconnect?": "Are you sure to Reconnect?",
            "Are you sure to Disconnect?": "Are you sure to Disconnect?",
            transfer: "Transfer",
            chat: "Chat",
            copy: "Copy",
            feature: "PP Link Features",
            feature1: "Private Tunnel， Peer to Peer",
            feature2: "Base on Browser",
            feature3: "All of File、Live、Text format",
            Contact: "Contact for feedback, project development",
            "set my name": "set my name",
            "copy url": "Copy Address",
            "show qrcode": "Show Qrcode",
            failed: "Failed",
            success: "Success",
            Peer2Peer: "P2P",
            Relay: "Relay",
            "My Files": "Transferring",
            "File Name": "File Name",
            "File Size": "File Size",
            "File Type": "File Type",
            Operation: "Operation",
            Download: "DL",
            Pause: "Pause",
            Resume: "Resume",
            Remove: "Remove",
            Cancel: "Cancel",
            "Drag and drop file": "Drag and Drop Files or Folder",
            or: "Or",
            "Select file": "Select file",
            "Are you sure to remove?": "Are you sure to remove?",
            "Are you sure to remove all?": "Are you sure to remove all?",
            "Are you sure to pause?": "Are you sure to pause?",
            "Are you sure to Cancel?": "Are you sure to Cancel?",
            "File is damaged": "The File is damaged, please try again",
            "Others can link to the private address to download the file": "Send files to connected devices, point-to-point real-time transmission",
            "cannot register to wss, please refresh page": "Can not register to wss, Please refresh page",
            "no data channel": "No data channel found",
            "p2p channel is not built": "P2P Channel is not built",
            "cannot get local net information": "Can not get local net information, please fresh the page",
            "Link apply": "Link Applying",
            "apply link to you": "Apply to link to you",
            Agree: "Agree",
            Reject: "Reject",
            Close: "Close",
            "is linking to you": "Is linking to you...",
            "is linking to": "Is linking to",
            "channel to {remoter} connected": "Channel to {remoter} connected",
            "channel to {remoter} has error": "Channel to {remoter} has error",
            "channel to {remoter} is close": "Channel to {remoter} is closed",
            "Linked to {remoter}": "Linked to {remoter}",
            "Unlinked to {remoter}": "Unlinked to {remoter}",
            "Remoter abort download": "Remoter abort download",
            "remote uploading aborted": "Remoter uploading fail and aborted",
            "Got all data, being to generate the file ..": "Transferring complete, be saving ..",
            "Please keep the mobile awake, and not leave browser": "Please keep the mobile awake, and not leave browser",
            "Warning: When broken, you can try to resume or reconnect": "WARNING：When broken, not fresh page, try to click pause/resume button or unlink/link button for continuing",
            Send: "Send",
            "not connected": "Unconnected",
            "Send Text": "Send Text",
            "input message": "Input Message",
            "input message(shift + enter for send)": "Input Text (Hot key of sending: Shift + Enter)",
            connected: "Connected",
            me: "Self",
            remoter: "Remoter",
            from: "From",
            "download fail": "Download Failed",
            "error: 1000": "Error: Unknown Error",
            "error: 1010": "Error: Less parameters",
            "error: 4002": "Error: Less of uid",
            "error: 4010": "Error: Unknown the remoter",
            Home: "Home",
            "Help Page": "Help Page",
            "Q&A": "Q&A",
            question1: "How to use PPLink",
            answer1: 'One device  open "www.pplink.link" in supported browser，and another device access the temporary address of the first device\'s to build a tunnel。Supported browsers：Latest chrome, firefox, safari, etc. which support webrtc on PC/mobile/pad',
            question2: "Cannot save files after transferring",
            answer2: "Some browsers do not support to save files which generated in the browser, so please try tested browsers, such as chrome, safari, firefox, etc.",
            question3: "Size limit of a single transferring file",
            answer3: "Size of a single transferring file is limited by the receiver' browser, no limit in chrome browser or windows, about 1/5 of memory of mobile (except Chrome)",
            question4: "Speed limit of transferring",
            answer4: "Speed of transferring is limited by many factors，including network bandwidth, network stability, device' CPU and memory, etc. In some examples, speed can touch 15MByte/s+(120Mbit/s+)",
            question5: "Have no speed when transfering",
            answer5: 'It means some wrong happened before, and the program can not handle it by himself. Please do not refresh the page，you can click "Pause/Resume" button to activate transferring again.',
            question6: "Video link，the pictures are blurred",
            answer6: "Video quality is limited by the bandwidth of both parties， especially by the sender's Upstream bandwidth. You can try to improve performance by reducing the size of the sharer's video and reducing the video frame rate",
            question7: "Video link cannot be shared to many users",
            answer7:
              'When the video is directly connected, every time the sharing party connects to a user, it will occupy a part of the upstream bandwidth, and the upstream bandwidth of the home bandwidth is much smaller than the downstream bandwidth. When there are many shared users, it will seriously affect the video quality and smoothness. Multi-user. If you really need to meet more audiences, you can let users who have already connected to transfer the video stream, and let other users connect successfully before, and you can transfer multiple times. Transfer method: After receiving the video stream, click "Share", and all people connected to this user can also receive the video stream.',
            question8: "Video link has high CPU usage",
            answer8:
              "When sharing a video stream, the device needs to complete the content collection, video generation, distribution, and other copy operations. Due to the browser itself, most of them require more CPU, so high CPU usage is normal. If the device configuration is low, it can be improved by reducing the video size and video frame rate.",
            "Scanner QR": "Scan QRcode",
            "Scanned Result": "Scanned Result",
            "ERROR: you need to grant camera access permisson": "ERROR: you need to grant camera access permisson",
            "ERROR: no camera on this device": "ERROR: no camera on this device",
            "ERROR: secure context required (HTTPS, localhost)": "ERROR: secure context required",
            "ERROR: is the camera already in use?": "ERROR: is the camera already in use?",
            "ERROR: installed cameras are not suitable": "ERROR: installed cameras are not suitable",
            "ERROR: Stream API is not supported in this browser": "ERROR: Stream API is not supported in this browser",
            "Recommend Browser": "Only a normal browser is required",
            "These browsers are perfect for pplink.link": "According by testing，these browsers support the site very well",
            Chrome: "Chrome",
            Firefox: "Firefox",
            Sumsung: "Sumsung",
            shareScreen: "Share Screen",
            "Not Support in this browser, please try to use chrome in pc": "Not Support in this browser, please use app or chrome in pc",
            visibility: "visibility",
            "visibility off": "visibilityOff",
            locked: "locked",
            unlocked: "unlocked",
            transform: "transform",
            setting: "setting",
            "move top": "move to top",
            "move up": "move up",
            "move down": "move down",
            delete: "delete",
            opacity: "opacity",
            border: "border",
            "brush size": "brush size",
            line: "line",
            rectangle: "rectangle",
            ellipse: "ellipse",
            eraser: "eraser",
            "Clear All": "clear all",
            undo: "undo",
            "Add Content": "Add Content",
            Painter: "Painter",
            Camera: "Camera",
            Screen: "Screen",
            Text: "Text",
            Video: "Video Files",
            Image: "Image Files",
            Refresh: "Refresh",
            FullScreen: "FullScreen",
            Sharing: "Sharing",
            "Camera & Microphone": "Camera",
            "Open camera and microphone?": "Open camera and microphone? (Need permission)",
            FacingMode_user: "Forward Camera",
            FacingMode_environment: "Backward Camera",
            "Camera Picture": "Camera",
            Microphone: "Microphone",
            Ok: "Ok",
            "New text": "New Text",
            "Not Support in this browser, please try to use chrome or safari": "Not Support in this browser, please try to use chrome",
            "Record error": "Record error",
            "Screen share error": "Screen share error",
            ScreenShare: "ScreenShare",
            pause: "pause",
            play: "play",
            "volume off": "volume off",
            "volume on": "volume on",
            "microphone on": "microphone on",
            "microphone off": "microphone off",
            "Copy failed": "Copy Failed",
            "To:": "To:",
            All: "All",
            "Are you sure to clear all?": "Are you sure to clear all?",
            "Merge To Stage": "Merge To Video",
            Screenshot: "ScreenShot",
            "Record Stage": "Local Record",
            "Stop Record": "Stop Record",
            Duration: "Recording",
            "Save Video": "Save Video",
            size: "size",
            bold: "bold",
            italic: "italic",
            underlined: "underlined",
            "align left": "align left",
            "align center": "align center",
            "align right": "align right",
            "F&Q": "F&Q",
            "Upload Files": "Upload Files",
            "Share Screen, Video Conference, Make Video": "Peer-to-peer remote video communication and sharing, just like face-to-face discussions and presentations",
            "video link features":
              "No matter the distance, no matter the device, synchronize what both parties see and say/Support multiple data sources such as cameras, microphones, screens, drawing boards, local videos, pictures, etc./Support free switching between multiple windows and any combination of multi-level content/Support two-way sharing and forwarding share, support recording video",
            "Video Link": "Video sharing",
            "Local Content": "LOCAL",
            Drag: "Drag",
            "Remote Content": "REMOTE",
            "Connected List": "Connected List",
            "No connected now": "No connected now",
            Connected: "Connected",
            Disconnected: "Disconnected",
            "Remote Files": "Remote Files",
            "Remote Videos": "Remote Videos",
            "Remote Messages": "Long Text",
            "Sharing Desktop": "Sharing Desktop",
            PlayVideo: "Play Video",
            "reject link to you": "Reject link to you",
            "error:": "error: ",
            "Input Text": "Input Text",
            "Exit Full Screen": "Exit Full Screen",
            "Stage Setting": "Video Setting",
            "Please set the parameters for your need": "Please set the parameters for your need",
            "Width/Height Ratio:": "Width/Height Ratio:",
            "Video Max Frame Rate:": "Video Max Frame Rate:",
            "No remote video now.": "No remote video now.",
            "Stream Invalid": "Stream Invalid",
            "Stage Size": "Resolution Of Output",
            "Width / Height": "Width / Height",
            "Recommended Size": "Recommended Resolution",
            "Stage Size Tip": "For screen sharing, please choose the same resolution as the screen; high resolution uses high CPU",
            "Camera Frame Rate:": "Resolution Of Camera",
            "Screen Frame Rate:": "Resolution Of Screen",
            "More framerate, more cpu": "Please set it reasonably, the higher the frame rate, the greater the bandwidth and CPU usage",
            Landscape: "Landscape",
            Portrait: "Portrait",
            Width: "Width",
            Height: "Height",
            Statement: "Product Explanation",
            "Something about pplink": "Notes on this service focus",
            Security: "Security",
            "Security description": "Re-encryption based on browser security; The URL changes every time",
            Privacy: "Privacy",
            "Privacy description": "In the local network and penetrable network , data is directly transferred without transit; in relay mode, encrypted transit",
            Performance: "Capability",
            "Performance description": "Transmission speed and resource consumption are limited by the browser's own capabilities and will increase with browser upgrades",
            "No shared files now": "No files now",
            Help: "Help",
            "Remote Clipboard": "Remote Clipboard",
            "My Clipboard": "Cloud Clipboard",
            "Cloud clipboard between devices by P2P": "P2P real-time image and text synchronization, support drag and drop",
            "paste data into the editor": "Please paste, edit text and pictures in the editor below",
            "clipboard tip": "Supports pictures and formatted text, which can be operated by dragging, shortcut keys, and buttons",
            "clipboard is syncing": "Synchronizing",
            "sync manually": "Manual synchronization",
            "clear all": "Clear",
            "No clipboard content now": "There is currently no content",
            all: "Copy All",
            "copy all": "Copy content with format",
            text: "Copy Text",
            "copy pure text": "Copy pure text",
            controls: "controls",
            "load new image": "load new image",
            "Choose the right video type": "Switch video source freely",
            "disable microphone": "disable microphone",
            "enable microphone": "enable microphone",
            "stop sharing": "stop sharing",
            "start sharing": "start sharing",
            screenshot: "screenshot",
            "start recording": "start recording",
            "stop recording": "stop recording",
            "set stage": "set stage",
            reload: "reload",
            "Must > 0": "Must > 0",
            "Device Screen": "Device Screen",
            "Camera desc": "Camera stream",
            "Screen desc": "Shared screen stream",
            Whiteboard: "Whiteboard",
            "Whiteboard desc": "Manual scribble artboard",
            "Video desc": "Load local video",
            "Image desc": "Load local image",
            "Text desc": "Load text content",
            Customization: "Customization",
            "Customization desc": "Free combination of various sources",
            "service stage": "Video view",
            "Reload Content": "Reload Content",
            "Are you sure to reload content?": "Are you sure to reload content?",
            "microphone error": "microphone error",
            "paste from clipboard": "paste from clipboard",
            "copy error": "copy error",
            "Is sharing": "Is sharing",
            "picture-in-picture": "picture-in-picture",
            "zoom out": "zoom out",
            "expand switch": "expand switch",
            "my stage": "my stage",
            message: "chat",
            own: "own",
            user: "user",
            layout: "layout",
            Exit: "Exit",
            "Are you sure to exit?": "Are you sure to exit?",
            "start video link": "Start video sharing",
            Link: "Linking",
            Chat: "Long Message",
            Safe: "Data encryption",
            Convenient: "Just browser",
            Private: "Direct connection without cache",
            Attentions: "Attentions",
            "safe transferring": "P2P transferring, no scan, no cache",
            "not close before finished": "Please do not stand by or exit the website during transmission",
            "follow the regulations": "Please abide by local regulations during use",
            "get data from clipboard": "Paste plain text",
            "auto sync": "Auto sync",
            "support dragging of image and text": "support dragging of image and text",
            "support word, excel, web page, etc.": "support word, excel, web page, etc.",
            "not too big text": "All content is only cached in the local browser",
            "question about safe": "Whether the content is at risk of leakage",
            "answer about safe":
              "This site uses standard webrtc technology, which is mainly developed and maintained by companies such as Apple, Google, and Microsoft. Browsers such as chrome, safari, and edge downloaded from regular channels will ensure the safety of your data. This site only provides the establishment of the channel connecting the two parties, and does not involve the transmission and analysis of the data in it. Especially in the direct connection mode, one byte of data will not pass through the server of this site; in the relay mode, the relay server forwards in real time and No buffering, no resolution.",
            "clipboard question2": "Distorted pasteboard content format",
            "clipboard answer2":
              "The format of the system clipboard is complex. When reading the content from it, it is not yet possible to obtain all the complete formats. At the same time, the technical implementation of different systems is also different, so you can only try to ensure the integrity of the pictures and text.",
            "clipboard question3": "Can you directly paste the paste file",
            "clipboard answer3": "Currently not supported, the browser will gradually add related functions in the future, this function can be realized",
            "clipboard question4": "Paste the content to the editor, the browser is stuck",
            "clipboard answer4": "Factors such as browser capabilities and device performance limit the size of the content of a single paste. If you encounter more content, please paste and copy in batches, or save it as a file and send it through the file",
            "suitable for small group": "Suitable for 1v1, or small scale interaction",
            "use chrome for screen share": "Please abide by local regulations during use",
            "videoShare question1": "Can you record the other party's video",
            "videoShare answer1": "No, in order to protect the other party from sharing the video, it is not possible to record the other party's video directly through this website, only the local own video can be recorded",
            "videoShare question2": "Unable to turn on camera or microphone",
            "videoShare answer2":
              'Please observe whether the prompt error pops up below. If the error is "the browser has been set to prohibit", or the relevant content is prohibited by permission, you actively refuse to open the camera or microphone before, resulting in your decision recorded on the website. If you need to open it, please enter the settings of the website and open the permission of the camera or microphone. If it is not a permission problem after checking, you can feed back the error information to the email below',
            "videoShare question3": "Unable to share desktop",
            "videoShare answer3":
              'If it is indicated that the current browser does not support this function, it cannot be enabled on this browser. If there is an error and it is related to "audio", please choose to disable "share sound" on the share desktop and then try. If there are other errors, please send the error message to the email address',
            "videoShare question4": "Android App shares the camera and screen, and the remote display shows a black screen",
            "videoShare answer4":
              "Since the Android APP uses the webview that comes with the system to implement related functions, the current version of the webview that comes with some mobile phone systems is low, and this function cannot be used normally. Please upgrade the Android webview of the sharing device to the latest version to solve this problem.",
            "videoShare question5": "Cannot play the shared picture or sound",
            "videoShare answer5": 'Please check the control buttons and switch "play" or "sound" button to try',
            "videoShare question6": "How multiple people share with each other",
            "videoShare answer6":
              "Multi-person sharing only requires multiple devices to be connected to each other. After entering video sharing, you can see multiple shared content. Note: When sharing, it is all point-to-point sharing. If it is shared to multiple users, bandwidth and CPU requirements are required. will increase linearly with the number of people",
            "p2p chat": "Point-to-point complex long text messages, quick short messages",
            "save content by yourself": "All content is only temporarily stored in both browsers",
            "chat question1": "How to save friends",
            "chat answer1": "There is no way to save friends, this function is mainly used for temporary communication, all content is only temporarily stored in the browsers of both sides, and all disappear after exiting",
            "clear all history": "Clear history",
            "send to designated": "Select receiving users",
            history: "History Record",
            "long text chat": "Long text mode",
            "short text chat": "Dialogue mode",
            "Account auto linking": "Connect via account",
            "auto link of member": "Login with the same account on multiple devices to automatically connect, suitable for personal multiple devices to connect at any time",
            "logined account": "Logged in account",
            login: "Login",
            logout: "Logout",
            register: "Register",
            "login tip": "The same account supports simultaneous login on multiple devices",
            "register tip": "Registered account can realize automatic connection of multiple devices",
            email: "Email",
            password: "Password",
            "confirm password": "Password Confirm",
            "please input your email": "Please enter the account email",
            "please input your password": "Please enter the password",
            "password mismatch": "Passwords do not match, please re-enter",
            "login error": "Login failed, please confirm account and password",
            "register success": "Register success, you can login now",
            "register error": "Register failed",
            "register error: account exist": "Register failed: account already exists",
            "Short code linking": "Connect via short code",
            New: "New",
            "Permission denied": "Browser is set to denied",
            sponsor: "sponsor",
            "Disconnected from server": "Disconnected from signal server",
            FacingMode_: "FacingMode_",
            "Not support this browser": "Not support this browser",
            "Forbid pushing the file": "Forbid pushing the file",
            Partners: "Partners",
            "Thanks for our partners": "Thanks for our partners",
            "Received files": "Received files",
            "No files now": "No files now",
            incomplete: "Incomplete now ",
            "some error in server": "some error in server",
            "login success": "login success",
            "Push Box": "Pushing",
            "Quick linking": "Quick linking",
            Samsung: "Samsung",
            Upload: "Upload",
            "remote disabled receiver": "Remoter disabled receiver",
            "push and receive files": "Push and Receive files",
            "Allow to receive files": "Allow to auto receive",
            "Disallow to receive files": "Disallow to auto receive",
            "Push files to remoter": "Push files to remoter immediately",
            "The Remoter does not allowed to push file": "The Remoter does not allow to push the file",
            D: "day(s)",
            H: "hour(s)",
            M: "minute(s)",
            S: "seconds",
            "Are you sure to cancel push?": "Are you sure to cancel pushing?",
            "Forbid And Remove": "Forbid And Cancel",
            "Are you sure to forbid and cancel it?": "Are you sure to forbid and cancel it?",
            Aborted: "Aborted",
            "Completed. Cost time:": "Cost time: ",
            "safely, cached in sandBox of localStorage": "One step in place, directly and safely cached locally",
            "site for collecting files": "The receiving end does not need to trigger the download, the system automatically receives the file",
            "pushUpload question1": "Where are the received files cached? Is it safe?",
            "pushUpload answer1": "The received files are temporarily cached in the browser’s local cache, in a sandbox environment, and will not pose a security risk to the local system. Different browsers have different caching methods and cannot be read and copied directly from the disk.",
            "pushUpload question2": "After the browser is closed, whether the cached files disappear",
            "pushUpload answer2":
              'The cached files have been stored in the hard disk in a special way. The cached files will not be automatically cleared when the browser is closed or the computer is closed. If you need to clear the cached files, you can use the "Clear Content" function in the website or browse directly Related functions of the device to clear the cache',
            "pushUpload question3": "Can be transferred and cached successfully, but cannot be downloaded",
            "pushUpload answer3":
              "Some browsers (mainly including some domestic mobile browsers) do not support buffer file generation and download, so the cached files cannot be read and downloaded from the sandbox. It is recommended to use the latest version of chrome, firefox, safari and other browsers",
            "pushUpload question4": "Whether to support resumable transmission",
            "pushUpload answer4":
              "The latest version already supports resumable transmission with breakpoints. After starting the resumable transmission with breakpoints, files will be automatically cached locally during transmission. After the transmission is interrupted, the transmission can resume near the breakpoint next time. Note: The resumable transmission function will consume equipment resources and may slightly affect the transmission speed",
            "No linked remoter for pushing": "No connected users now",
            "Reward for supporting": "sponsor for supporting",
            Recommend: "Recommend",
            "Found new version": "Found new version",
            "New version downloaded, install now ?": "New version downloaded, install now ?",
            Install: "Install",
            "Downloading new version": "Downloading new version",
            "Updating app": "Updating app",
            "Re-Download": "Re-Download",
            "Show in explorer": "Show in folder",
            "Download Client": "user's guidance",
            "Use client for better performance": "Use client for better performance.",
            "for windows": "Client for windows",
            "Fast Download": "Fast Download",
            "FastDownload: Right click on the button, save link as": "FastDownload: Right click on the button, save link as",
            "FastDownload: Long tap on the button, save link as": "FastDownload: Long tap on the button, download link as",
            "Download List": "Download List",
            Create: "Create",
            Join: "Join",
            "Group ID": "Group ID",
            "please input the group id": "please input the group ID",
            "Group Name": "Group Name",
            "please Input a group name": "please Input a group name",
            "Group Password": "Group Password",
            optional: "Optional",
            Submit: "Submit",
            "add new group success": "Add new group success",
            "add new group fail in local": "Add new group fail in local",
            "Invite Members": "Invite Members",
            "Exit Group": "Exit Group",
            Sort: "Sort",
            "Layout as grid": "Layout as grid",
            "Layout as list": "Layout as list",
            "Invite members to join in": "Invite members to join in",
            ID: "ID",
            "Others can join the group by groupId": "Others can join the group by groupId",
            "Invite members of connected": "Invite members of connected",
            Invite: "Invite",
            "sort by name": "By name",
            "sort by time": "By time",
            "sort by type": "By type",
            "sort by size": "By size",
            mine: "mine",
            "copied to clipboard fail": "Copy to clipboard fail",
            "Are you sure to exit from the group?": "Are you sure to exit from the group?",
            "Add Files": "Add Files",
            "Add Directory": "Add Directory",
            "Open fast downloader": "Open fast downloader",
            Downloader: "Downloader",
            "No content now": "No content now",
            "Invalid file": "Invalid file",
            Unshare: "Unshare",
            "Go to": "Go to",
            Open: "Open",
            "Unshare it": "Unshare it",
            "Are you sure to unshare it?": "Are you sure to unshare it?",
            "share fail": "Share fail",
            "share success": "Share success",
            "unshare fail": "Unshare fail",
            "unshare success": "Unshare success",
            "Setting success": "Setting success",
            "Setting fail": "Setting fail",
            "Download Success": "Download Success",
            Profile: "User Profile",
            Notification: "Notification",
            Logout: "Logout",
            "Forget Password?": "Forget Password?",
            "Verify account and forget password": "Forget password",
            "Forget password tip": "Enter your email account, receive the verification code to modify the password",
            "Send Confirm Code": "Send Confirm Code",
            "Send success, check your email later": "Send success, check your email later",
            "Send fail, check your email and try again": "Send fail, check your email and try again",
            "Share Files": "Share Files",
            Sender: "Sender",
            Receiver: "Receiver",
            "Remote Desktop": "Remote Desktop",
            About: "About",
            "state: ": "current state: ",
            "Connect fail": "Connect fail",
            "Update Settings": "Update Settings",
            Resolution: "Resolution",
            Original: "Original",
            "Frame rate": "Frame rate",
            "Are you sure to Close?": "Are you sure to Close?",
            "Remote desktop is closed": "Remote desktop is close",
            "Remote desktop is abort": "Remote desktop is abort",
            "The request is forbidden": "The request is forbidden",
            "Cannot start remote desktop": "Can not start remote desktop",
            "Open in uploader": "Open in uploader",
            "Fast Uploader": "Fast Uploader",
            "Close Application": "Close Application",
            "Are you sure to close the application?": "Are you sure to close the application?",
            "Download Manager": "Download Manager",
            "Receive Files": "Receive Files",
            "Download Files": "Download Files",
            "Files of Pushing": "Files of Pushing",
            "real time transfer, no delay, no cache": "Real time transfer, No delay, No cache",
            "Send Files": "Send Files",
            "Select files for transferring": "Peer to peer transferring immediately",
            "Convenient file sharing between devices": "Convenient files sharing between devices and users",
            "Allow to share files to others": "Allow to share files to others",
            "Disallow to share files to others": "Disallow to share files to others",
            "Exclude same account": "Exclude same account",
            "This function need login first": "Sorry，this function need login first",
            "This function need vip qualification": "Sorry, this function need vip permission",
            "My Share Groups": "My Share Groups",
            "Online Members": "Online Members",
            "New Share Group": "New Share Group",
            "connect all your device together": "Connect all your device together",
            "share files by groups": "Share files by groups",
            "share question1": "Is the device safe after the sharing function is turned on",
            "share answer1":
              "Turning on the sharing function does not affect the security of the device. If you use a browser, the shared file is located in the browser sandbox and is isolated from the device file system, so it is safe. If you use the client, you only have read permissions for shared files and cannot run programs, so it is also very safe.",
            "share question2": "Can the client and the browser communicate with each other",
            "share answer2":
              "The client and the browser, the browser and the browser, and the client and the client can all be interconnected, but the client has more functions, better performance, and faster transmission speed than the browser. It is recommended to use the client first, as long as one end adopts the client, the high-speed function can be added",
            "share question3": "Browser share folder, internal files will not be updated automatically",
            "share answer3":
              "Browser sharing folders can only cache the files in this folder into the sandbox. Once selected, it has nothing to do with the original folder, nor can it automatically change according to the changes in the original folder. It is recommended to use the client. After the client shares the folder, it will be directly associated with this folder, and any changes in the folder will be synchronized in real time.",
            "share question4": "High-speed download and high-speed upload",
            "share answer4":
              "The client supports high-speed download and high-speed upload, and the two sides of the connection may use the client at one end to achieve high-speed download and high-speed upload functions. Note that the high-speed function can only be realized in a mode where both parties can directly connect",
            "User Notification": "User Notification",
            "My Notification": "My Notifications",
            "paying for long working": "To ensure the maintenance and growth of the product, please pay for subscription",
            "can sharing instead of paying": "If you don’t want to pay, you can refer to the free vip plan",
            "ask for free by email if expensive for you": "If the price is too high for you, please email to apply for exemption",
            "question about user 1": "Can the same account be logged in to multiple devices at the same time",
            "answer about user 1": "Yes, there is no limit to the number of supported devices. After the same account is logged in to multiple devices at the same time, it will be automatically connected",
            "question about user 2": "VIP qualification is suddenly cancelled or IP banned",
            "answer about user 2":
              "This product is developed for users in need. Proper payment is to maintain the long-term operation and upgrade growth of the service. If you don’t want to pay, it also provides a white prostitution program and a way to apply for exemption. However, if malicious cracking or exploiting vulnerabilities is found, the VIP will be cancelled. Eligibility, even ban IP",
            "question about user 3": "Is there any upper limit for the free vip plan to obtain VIP qualifications?",
            "answer about user 3": "Not yet",
            "question about user 4": "How to subscribe to VIP qualification",
            "answer about user 4": "After the payment system is online, the subscription method will be automatically displayed in the VIP related content area. If you don’t find it, please wait patiently and it will be online soon",
            "Allow to connect": "Allow to be controlled",
            "Disallow to connect": "Disallow to be controlled",
            "Allowed Remoter": "Allowed device",
            "Choose allowed remoter": "Choose allowed remoter",
            Required: "Can't be empty",
            "Set access code for security": "Set access code for security",
            "Connected Remoter": "Connected Remoter",
            "New Connection": "New Connection",
            "Connect Remote Desktop": "Connect Remote Desktop",
            "Choose remote peer": "Choose remote peer",
            "Choose remote first": "Choose remote peer first",
            "Input Access Code": "Input Access Code",
            "Access code cannot be empty": "Access code can not be empty",
            Connect: "Connect",
            "safe access, both authorization and access code": "Secure access, two-factor authentication of identity and security code",
            "accessor only need browser in pc or mobile": "The access terminal only needs the browser on the PC and the mobile phone",
            "accessed need client of installed": "The accessed terminal needs to install the client",
            "remote desktop question1": "How to use remote desktop",
            "remote desktop answer1":
              'First install the client on the accessed terminal. After starting the client, perform the following settings: 1) Enable remote connection; 2) Run the connected peer access (by default, only run the same account access); 3) Set the security code. After the setting is successful, the remote end uses the browser or client to connect to the accessed end first, then enter the "Remote Desktop" function to select the access end and enter the security code, and click the "Connect" button',
            "remote desktop question2": "Is it safe to open the remote desktop",
            "remote desktop answer2": "To access the remote desktop, you need to pass dual authentication of user identity and security code, and the connection process is directly connected through webrtc, which is very safe",
            "remote desktop question3": "Can multiple remote desktops be connected at the same time",
            "remote desktop answer3": "Yes, but more connections are added, more resources such as the cpu of the device will be occupied. Please ensure that the device resources are sufficient, otherwise it will be stuck",
            "remote desktop question4": "Insufficient resources prompt appears on the connected end",
            "remote desktop answer4":
              "In addition to screen recording and sharing, the connected end also needs to perform data transmission and other tasks. The higher the resolution and frame rate, the higher the performance requirements of the device, so for devices with poor performance or poor single-core CPU performance, similar Prompt, please reduce the resolution or frame rate to improve this problem",
            "remote desktop question5": "Mac computer cannot accept remote control",
            "remote desktop answer5":
              'When a Mac computer is used as a controlled terminal, program authorization is required to allow remote access and control. Open "Security and Privacy", in the "Privacy" tab, find "Screen Recording" and "Accessibility" to record and control the program separately',
            "My own account": "My own account",
            "User Profile": "User Profile",
            Account: "Account",
            "User Type": "User Type",
            "User State": "User State",
            "User Created": "User Created",
            Password: "Password",
            "Change Password": "Change Password",
            "Current Password": "Current Password",
            "New Password": "New Password",
            "About VIP": "About VIP",
            "Is VIP": "Is VIP",
            "VIP Expired": "VIP Expired",
            "Get VIP Free": "Get VIP Free",
            "My Prompt Link": "My Prompt Link",
            "VIP Subscript": "VIP Subscript",
            Pay: "Pay",
            "VIP Rights": "VIP Member Privileges",
            "VIP rights 1": "Enable all online features",
            "VIP rights 2": "Early access to new features that will be launched in the future",
            "VIP rights 3": "Remove all ads from the page",
            "VIP rights 4": "Priority to get network acceleration",
            "VIP rights 5": "Priority access to support services",
            member: "member",
            "Change password success": "Change password success",
            "Change password fail": "Change password fail",
            "Can not verify account": "Can not verify account",
            "Verify success": "Verify success",
            "Verify fail": "Verify fail",
            "please input your new password": "Please input your new password",
            "error: ": "Error",
            "Only work in {clientType}": "Only work in {clientType}",
            "Only work in client": "Only work in client",
            "Not work in {clientType}": "Not work in {clientType}",
            "Download Fail": "Download Fail",
            "datachannel error": "Datachannel error",
            "My private Share": "My private Share",
            "user-state-confirmed": "Normal",
            "user-state-unconfirmed": "Unconfirmed",
            "user-state-forbidden": "Forbidden",
            "Why use": "Product Goal",
            "Connect all my devices by one account": "Connect all my devices by one account",
            "Connect any devices by one step": "Connect any devices by one step",
            "Share data": "Multi-device data sharing",
            "Share data between all devices": "Share data between all devices in the most convenient way",
            "Share data between all users": "Share data among all users in the safest way",
            "Auto update fail": "Auto update fail",
            "Are you sure to logout?": "Are you sure to logout?",
            "Just this machine": "Just this machine",
            "All machines": "All machines",
            "Please keep the page visible for faster transfer": "Please keep the page visible for faster transfer",
            Visible: "Visible",
            Invisible: "Invisible",
            Embed: "Embed Window",
            Float: "Float Window",
            Pin: "Pin Window",
            Unpin: "Unpin Window",
            Maximize: "Maximize Window",
            Restore: "Restore Window",
            "Exit FullScreen": "Exit FullScreen",
            abort: "Abort",
            connecting: "connecting..",
            "Enable Zoom": "Enable Zoom",
            "Disable Zoom": "Disable Zoom",
            "Receiving files of pushing": "Receiving files of pushing",
            "Are you sure to cancel all push?": "Are you sure to cancel all pushing?",
            "Choose Directory": "Choose Directory",
            "Choose save directory": "Choose saving directory",
            "No linked client for remote download": "No valid remote downloader",
            "New Download": "New Download",
            "Download Speed": "Download Speed",
            "Connections(Seeds)": "Connections(Seeds)",
            Connections: "Connections",
            Completed: "Completed",
            Complete: "Complete",
            Removed: "Removed",
            "Transfer to me": "Transfer to me",
            "Retry Download": "Retry Download",
            "Add new download": "Add new download",
            "Input download url, support: http/https/ftp/magnet": "Input download url, support: http/https/ftp/magnet..",
            "Task Settings": "Task Settings",
            Confirm: "Confirm",
            "max-download-limit": "Max download limit",
            "max-download-limit desc": "Limit the maximum download speed, 0 means no limit",
            split: "Maximum number of file splits",
            "split desc": 'Limit the maximum number of file splits, used for multi-threaded download, and work together with "single minimum file size"',
            "min-split-size": "Minimum file split size",
            "min-split-size desc": "Single minimum file size of split",
            "all-proxy": "Proxy",
            "all-proxy desc": "Download through proxy, input format: protocol://account:password{'@'}host:port, such as: http://127.0.0.1:12345",
            "Remove task": "Remove Task",
            "Are you sure to remove the task?": "Are you sure to remove the task?",
            "Network Downloader": "Network Downloader",
            "Soft Keyboard": "Soft Keyboard",
            "Download files fast in internet": "Universal network downloader, high-speed, multi-thread, remote management",
            "Resume All": "Resume All",
            "Pause ALL": "Pause ALL",
            "Downloader is running": "Downloader is running",
            "Downloader is down": "Downloader is down",
            "Downloader Global Settings": "Downloader Global Settings",
            "Remote Downloader": "Remote Downloader",
            "Load Seed": "Load Seed",
            "Download Task Settings": "Download Task Settings",
            dir: "Download directory",
            "dir desc": "Download directory",
            "max-concurrent-downloads": "Max concurrent downloads",
            "max-concurrent-downloads desc": "Limit the maximum number of simultaneous download tasks",
            "max-overall-download-limit": "Max overall download limit",
            "max-overall-download-limit desc": "Max overall download limit of downloader, 0 means no limit",
            "max-overall-upload-limit": "Max overall upload limit",
            "max-overall-upload-limit desc": "Max overall upload limit of downloader, 0 means no limit",
            "support http/https/ftp/bt etc": "Support various types such as http/https/ftp/magnet",
            "fast multiple thread downloader": "Multi-threaded high-speed downloader, increase download speed several times",
            "support proxy download and remote download": "Support agent download and remote management",
            "network downloader question1": "How to increase download speed",
            "network downloader answer1":
              'This downloader function is integrated with the excellent open source project aria2. Generally, it has a good speed bonus for various downloads, especially for http/https downloads. Through the multi-threading mechanism, it is several times the download speed of the browser. . You can achieve a better speed improvement effect by adjusting the "maximum number of file splits" and "minimum file split size"',
            "network downloader question2": "File download operation does not work",
            "network downloader answer2":
              'The downloader is divided into two parts: the bottom download work process and the upper control interface. If the file download operation on the control interface does not work, please check the second-to-last button in the row of buttons on the upper right to confirm whether the downloader has been started. If it does not start, please try to start it manually, or leave the "Network Downloader" interface and then return. If the downloader has not been able to start, and the software cannot be resolved after restarting the software, please email feedback and I will fix it as soon as possible',
            "network downloader question3": "How to get the files downloaded by the remote control downloader",
            "network downloader answer3":
              'Remotely control the downloader, you can create and control download tasks. After the download is completed, it will be automatically saved in the default download directory of the remote downloader. If you want to forward the download to the local after the download is complete, you can set the blind directory of the remote downloader to "File Sharing", and download directly from the file sharing on the local side',
            "network downloader question4": "The download task added through the magnet link has not downloaded data",
            "network downloader answer4":
              'This is caused by the mechanism of bt itself and the network environment where it is located. When you first use magnet, you cannot join the DHT network locally and get a valid download source. You can solve it according to the similar problem of "aria2 no download speed" and find a seed of a popular resource. (Note that it is a .torrent file), then download the resource, the resource download is completed and hang up for a while, wait for the program to automatically join the DHT and synchronize, then it should be faster and faster',
            "Stop downloader": "Close downloader",
            "Are you sure to stop downloader?": "Are you sure you want to close the downloader?",
            "Downloader is turn off, Please turn on first": "The downloader has been closed, please start the downloader and try again",
            "Connect downloader again, try later": "Reconnect the downloader and try again later",
            "Save Error": "Save Error",
            "Thanks for your support": "Your support is the motivation of PP",
            "If PP works for you, wait for your subscription": "As an independently developed software, we look forward to your subscription to VIP for support",
            "Subscript Now": "Subscript Now",
            "Please login first": "Please login first",
            "Pay Success": "Pay Success",
            "Weixin pay": "Pay of wei xin",
            "Privacy Policy": "Privacy Policy",
            "The group is only in local": "The group is only in local device",
            "Download URL": "Download link",
            "URL is invalid": "Link is invalid",
            Start: "Start",
            "Have upload": "Have uploaded",
            "Download success": "Download success",
            "Something is error, upload is aborted": "Something is wrong, upload aborted",
            "Upload Speed": "Upload Speed",
            "Upload success": "Upload success",
            "Share url": "File share link",
            "Download url for browser, recommended": "File download address for browser",
            "File url": "File link",
            "Download url for downloading client": "File download website for various download tools or browsers",
            "Expired time": "Expired time",
            "Sorry, you have no permission to do this": "Sorry, you have no permission to do this",
            "Connections(Seeds) ": "Connections(Seeds)",
            "Cloud Transfer": "Offline Transfer",
            "Transfer files over cloud cache": "Transfer files over cloud cache, cache automatically cleared",
            "Upload files to cloud": "Upload files to cloud",
            "My valid traffic currently": "My valid traffic now",
            "My files cached in cloud": "My files cached in cloud",
            "Download times": "Download times",
            "Show link": "Show link",
            "Upload time": "Upload time",
            "Download files from cloud": "Download files from cloud",
            "files only exist in 48 hours in cloud": "Files are only cached in the cloud for 48 hours, and are cleared after expiration",
            "no checking, no backup": "No scanning and no backup of cached files in the cloud",
            "support downloading by any download client": "Support browser and various download software",
            "cloud transfer question1": "Are there any restrictions on forwarded files",
            "cloud transfer answer1":
              "During the forwarding process, all files are processed as ordinary data packets, split, discrete, temporarily stored, downloaded, and cleared. The content, format, size, etc. of the file are not processed, so in principle, there are no restrictions, but this function is currently still available. It is in the public beta and does not support resumable uploading, so it is not recommended to upload too large files, such as 10G or more",
            "cloud transfer question2": "How is the traffic consumption of cloud forwarding calculated?",
            "cloud transfer answer2":
              "The cost of network traffic forwarding is very high, and the demand of each user is very different, so the billing is based on the actual traffic used by the user. Users need to purchase a data package to obtain the corresponding data, and the data unit is the same as the file size unit (byte-byte). Under normal circumstances, two acts of uploading and downloading the same file once consume the data of this file size. If the same file is downloaded n times, the data of n times the file size will be consumed, and if it is only uploaded but not downloaded, it will consume the data of one file size.",
            "cloud transfer question3": "Does upload and download support breakpoint resumable upload",
            "cloud transfer answer3": "This product does not currently provide the breakpoint resume function, but the download function itself supports breakpoint resume, if you need breakpoint resume download, you can choose a third-party download tool with this function",
            "cloud transfer question4": "Is it safe to forward files",
            "cloud transfer answer4":
              "It is safe during the upload and download process. When files are temporarily stored in the cloud, please save your file download address and do not disclose it. The password verification function during downloading will be available later. Temporary files will be completely and automatically cleared after the validity period expires. Before the validity period expires, you can manually clear the files according to the download status.",
            "Delete fail": "Delete fail",
            "get channel fail": "Get channel fail",
            "invalid url": "Invalid link",
            "Downloaded file is damaged": "Downloaded file is damaged",
            "not found or can not download": "Not found or can't download",
            "fail after retry": "Fail after retries",
            "save file fail": "Save file fail",
            "Download fail": "Download fail",
            "You do not have enough traffic now": "Sorry，you do not have enough traffic now",
            Feedback: "Feedback",
            "Are you sure to Remove?": "Are you sure to Remove?",
            "Report a bug or tell me your good ideas": "Report a bug or tell me your good ideas",
            Developer: "Developer",
            "Leave a message": "Feedback",
            "Upload images": "Upload images",
            "Can not be empty": "Please input some content",
            "Something is wrong": "Sorry, something is wrong",
            Cached: "Cached",
            "Export from local cache": "Export from local cache",
            Resumable: "Resumable",
            "Re-download": "Re-download",
            "Are you sure to delete cache and re-download?": "Are you sure to delete cache and re-download?",
            Export: "Export",
            "Download all": "Download all",
            "Pause all": "Pause all",
            "Enable resumable transfer": "Enable resumable",
            "Disable resumable transfer": "Disable resumable",
            "Remoter do not support resumable": "Remoter do not support resumable",
            "No enough storage space": "No enough local storage space",
            "No enough storage space for template file": "No enough local cache space",
            "no exist": "File no exist",
            "No enough storage space or not support resumable, switch to normal": "No enough cache space or not support resumable, switch to normal",
            "Export all": "Export all",
            "Is exporting file": "Exporting file of cached ...",
            "Is removing file": "Removing file of cached ...",
            "Keep app running always": "Keep app running always",
            "Can not generate a new name": "Can not generate a new name",
            "save cache file with some error": "cache file uncomplete",
            "Saved to": "Saved to ",
            "Export success": "Export success",
            "Export fail": "Export fail",
            "Have unshared lost files": "Have unshared lost files",
            "disconnect fail": "Disconnect fail",
            "Add track fail": "Add track fail",
            "change track fail": "change track fail",
            "remove track fail": "remove track fail",
            "Choose download directory": "Choose download directory",
            "Fast Downloader": "Fast Downloader",
            "Waiting in queue": "Waiting",
            "Is downloading": "Is downloading",
            "Download directory": "Download directory",
            "Are you sure to download directory?": "Are you sure to download directory?",
            "Can not get data or remote do not support": "Can not get data or remote client do not support",
            "part fail": "part fail",
            close: "Close",
            settings: "Settings",
            "Are you sure to clear all and stop all?": "Are you sure to clear all and stop all?",
            "Download Folder": "Download Folder",
            Settings: "Settings",
            "Set fixed location of download": "Set default download directory",
            "Auto Download to selected directory": "Auto Download to default download directory",
            "Select download directory every time": "Select download directory every time",
            "Save location": "Save location",
            "save access code": "save access code",
            "Open Directory": "Open Directory",
            "total items": "total{count}items",
            "Select screen": "Select window",
            "Main stage": "Main Stage",
            "NetDownloader is enabled": "Downloader is endabled",
            "NetDownloader is disabled": "Downloader is disabled",
            Yes: "Yes",
            No: "No",
            "user-state-": "user-state-",
            "Screen share": "Screen Share",
            "Entire Screen": "Entire Screen",
            "Refresh will break and init all service?": "Refresh will break and init all service",
            "Can not download the file, please check input and try again:": "Can not download the file, please check resean:",
            "The new version has been updated and no longer serves as the old version": "The new version has been updated and no longer serves as the old version",
            "The new version has been updated, please update": "New version has been released, please update",
            "Drop content for sharing": "Drop shared to here",
            "Drop content for sharing tip": "Drop text、files、folder to here for sharing in sender and cloud clipboard",
            "share stream": "share video",
            "Unlink All": "Unlink all connection",
            "Clear Unlinked": "Clear unlinked devices",
            "Check My Peers": "Check my online devices",
            "Downloaded files": "Downloaded files",
            "P2P remote control": "P2P remote desktop and remote terminal, Web SSH tool",
            "Allowed Device": "Allowed Device",
            "Access Code": "Password",
            "Camera share": "Camera share",
            Communication: "Two-way sharing",
            Play: "Play",
            "Play Video": "Play",
            Window: "Window",
            "Share system audio": "Share system audio",
            "disable volume": "Disable volume",
            "enable volume": "Enable volume",
            "question quick sharing": "Quick sharing",
            "answer quick sharing":
              '1. For browser users, directly drag files or folders to the pp website; 2. For desktop clients, the client can switch to the shortcut toolbar mode and drag and drop files directly on it; 3. For mobile apps, select files Or click on the system’s built-in sharing function after text or text, and then select "pp direct connection" to share',
            "no save path": "no save path",
            "Quick operation": "File and text quick sharing",
            "quick operation 1": "Drag and drop to the pp website or client",
            "quick operation 2": 'On the phone, click "Share", select "pp zhilian"',
            "get data from any device": "Combine all your devices into a unified shared network, and access the network from any device",
            "share files in group": "Organize content in groups and share content with other people or devices",
            "support folder transfer": "Support folder sharing and download",
            "Control remote pc by browser": "Remote desktop and remote terminal via browser",
            "Web SSH on browser": "Web SSH for remote control via browser",
            "Control remote pc by mobile": "Remotely control computer via mobile phone",
            "Receive files from linked device": "Receive files in real time from connected devices",
            "Input activate code": "Input activate code",
            "Activate success": "Activate success",
            "Activate fail": "Activate fail",
            "Dark mode": "Dark mode",
            Preview: "Preview",
            "Share setting": "Share control",
            "Forbidden all": "No sharing",
            "Allow self": "Share with account",
            "Allow group": "Share with group",
            "Please take a screenshot and scan the payment code": "Please take a screenshot and scan the payment code",
            "Remote Control": "Remote Control",
            Terminal: "Terminal",
            "Less remote terminal params": "Less remote terminal parasm",
            SSH: "SSH",
            "SSH connect": "SSH connect",
            host: "Host",
            "Please input host": "Please input host",
            port: "Port",
            "Please input port": "Please input port",
            username: "Username",
            "Please input username": "Please input username",
            "Please input password": "Please input password",
            Copy: "Copy",
            Paste: "Paste",
            Search: "Search",
            Clear: "Clear",
            "Terminal closed": "Terminal is closed",
            "Terminal error": "Terminal error",
            "input search word": "Input search word",
            "username or password mismatch": "Username or password mismatch",
            "Open remote terminal fail": "Open remote terminal fail",
            Error: "Error",
            "Build channel fail": "Build channel fail",
            "Remote Terminal": "Remote Terminal",
            "Terminal tools": "Terminal tools",
            "Local terminal": "Local terminal",
            "remote desktop question6": "How to use remote terminal",
            "remote desktop answer6": 'The method of using the remote terminal is similar to that of the remote desktop. When connecting, select "Remote Terminal" to connect.',
            "remote desktop question7": "Is it safe to open the remote terminal",
            "remote desktop answer7":
              "The remote terminal adopts the same double-layer password and authorization mechanism as the remote desktop, and the direct connection channel is preferred, so it has high security. The SSH function running on the desktop client directly accesses the target host, and all data and account information do not pass through the PP system. The SSH function running on the browser is transparently transferred through the relay server, and the PP system does not parse or cache it.",
            Local: "Local",
            client: "client",
            simple: "Simple",
            "is simple": "Support all kinds of computers, mobile phones, tablets, only need a browser, one-step direct connection",
            fast: "Fast",
            "is fast": "Intelligently select the best channel, maximize the use of bandwidth, and never limit the speed",
            private: "Private",
            "is private": "Point-to-point secure direct connection, content is only transmitted between target devices, no scanning and no caching",
            realTime: "Real-time",
            "is realTime": "Using Webrtc technology, real-time data synchronization and transmission",
            "Linking ways": "Linking ways",
            "Select directory": "Select Directory",
            "Drag and drop file to this page": "Drag and drop file or directory to this page",
            "electron auto start question": "How to start client automatically when the computer boots up",
            "electron auto start answer": "Windows, mac, and linux systems all have the function of automatically starting the specified program when booting up. Please search for the relevant function, and then add the PP direct connection program to the startup item.",
            "Show cursor": "Show local cursor",
            "Hide cursor": "Hide local cursor",
            align: "Align",
            "horizontal center": "Horizontal center",
            "vertical center": "Vertical center",
            cascade: "Cascade",
            "content management": "Content management",
            "Max duration": "Max duration",
            "no stream to record": "No data to record",
            viewport: "Viewport",
            "can not get screen stream": "Cannot get screen stream",
            "Switch stage viewport": "Switch viewport",
            "Add viewport": "Add viewport",
            "disable cursor": "Disable cursor",
            "enable cursor": "Enable cursor",
            "disable painter": "Disable marking",
            "enable painter": "Enable marking",
            "zoom stage": "Stage zoom",
            Full: "100%",
            "Auto scale": "Auto zoom",
            "Stage Background": "Background",
            "screen Sharing": "Screen is sharing",
            "use microphone": "Use microphone",
            "local volume, not remote volume": "Local volume",
            "switch screen share": "Switch screen",
            "choose screen share mode": "choose sharing mode",
            "screen share and microphone": "Screen + Microphone",
            "only screen share": "Only screen",
            "start screen share": "Start sharing",
            "stream is stopped": "Sharing has been terminated",
            "cancel or forbid screen sharing": "Screen sharing canceled or disabled",
            "cancel or forbid microphone": "Microphone canceled or disabled",
            "preview, recommend disable in using": "Preview, it is recommended to close during use",
            "Video sharing is running, please close old one": "Video sharing has been started, for new sharing, please close previous sharing",
            timeout: "Timeout",
            arrow: "arrow",
            "account tip": "The email here is used as the account name, which is case-sensitive and can be used for password retrieval.",
            "Connected devices": "Connected Devices",
            "send fail or no receiver": "Send fail or no receivers",
            "send fail of part": "Send fail to part receivers",
            "Connected Time": "Connected Time",
            "Disconnected Time": "Disconnected Time",
            Temp: "Template Link",
            "Share group": "Share Group",
            "search files from multiple device": "search files from multiple devices",
            "Searching ...": "Searching ...",
            localhost: "localhost",
            "Remote peer has lower version for the feature": "Remote peer has lower version for the feature",
            "Search in group": "Search files",
            "Invalid search": "Invalid search",
            "file not exist": "File not exist",
            Overwrite: "Overwrite Files",
            "There is a same file here, overwrite it?": "There is a same file here, overwrite it?",
            "Waiting files": "Waiting files",
            "Failed files": "Failed files",
            "Exist files": "Exist files",
            Detail: "Detail",
            Children: "Children",
            Size: "Size",
            Downloading: "Downloading",
            Waiting: "Waiting",
            Downloaded: "Downloaded",
            Exist: "Exist",
            Fail: "Fail",
            Ignore: "Ignore",
            "Save as": "Save as",
            "Open cache folder": "Open cache folder",
            "Batch action": "Batch",
            "Fast download all": "Fast download all",
            "Resume all": "Resume all",
            "Cancel all": "Cancel all",
            "The folder is exist, how to?": "The folder is exist, how to handle it?",
            "merge folder, ignore exist files": "Merge folder, ignore exist files",
            "overwrite full folder": "Overwrite full folder",
            "create new folder": "Create new folder",
            files: "files",
            "Directory manager, choose files for transfer": "Directory manager, choose files for transfer",
            "Open save folder": "Open save folder",
            "Disable transfer": "Disable transfer",
            "preparing for download": "Preparing for download",
            Paused: "Paused",
            "Saved file": "Saved file",
            "Save file fail": "Save file fail",
            Total: "Total",
            "Total size": "Total size",
            "Error report": "Error Report",
            "Check errors and report": "Check errors and report",
            "Search Group": "Search Group",
            "Search Directory": "Search Folder",
            "No group": "No group",
            "Are you sure to do it ?": "Are you sure to do it ?",
            "overwrite the file": "Overwrite original file",
            "create new file": "Keep original file and save as",
            Exported: "Exported",
            "Export directory": "Export directory",
            "Download Directory": "Download Directory",
            "Search name": "Search name",
            "Search file or directory by name, support multiple key": "Multiple keywords separated by spaces are supported, and the sequence of keywords is different.",
            "Files duplicate": "Files or names duplicate",
            "Some files duplicate": "Some files or name duplicate",
            "exist, overwrite it?": " exist, overwrite it?",
            "Can not remove the last one": "Cannot remove the last one",
            "Disconnected from server, connecting": "Disconnected from signal server, auto connecting..",
            "Group peers": "Devices in group",
            "Include {count} files, {size}, are you sure?": "There are {count} files in total, and the size is {size}. Too many files or size will take up a lot of memory, which may affect the performance of the device. Are you sure to choose? ",
            "Save folder setting": "Set storage",
            "Download by": "Download by",
            "Drag and drop file to here": "Drag and drop file to here",
            "No files in directory": "No files in directory",
            "Link type": "Link type",
            "Set fixed location in browser settings": "Please set default download location in browser settings",
            "No content or no rights": "No content or no rights",
            "Save fail, try to reset fixed download location": "Save fail, please try to reset default download location",
            "no permission to create file": "Save file to target location fail, no permission to create a file",
            "Root folder": "Root folder",
            "disk available information": "{available} available, total {size}",
            "Device storage": "Disk of device",
            "Local disk status": "Local device storage",
            "Can not get disk information": "Can not get storage information",
            "Download location is invalid": "The download location cannot save the file due to permission restrictions or does not exist, please select again",
            "Local Fixed Disk": "Local Fixed Disk",
            "Network is offline": "Network is offline now, please check network status or network permission",
            "Current version": "Current version",
            "Latest version": "Latest valid version",
            "Change logs": "Update notes",
            "Current version is latest": "Current version is latest",
            Share: "Share",
            "Share out": "Share out",
            "up by time": "By time ascending",
            "down by time": "By time descending",
            "up by name": "By name ascending",
            "down by name": "By name descending",
            "up by type": "By type ascending",
            "down by type": "By type descending",
            "up by size": "By size ascending",
            "down by size": "By size descending",
            "Loaded none files": "Loaded none files",
            "If can not find window, please re active the window and click refresh button": "If the target cannot be found, please switch to the target program to activate it, then click the refresh button",
            fontSize: "Font Size",
            theme: "Theme",
            "Deep theme": "deep style",
            "Bright theme": "bright style",
            "Assist key": "Assist Keys",
          };
        },
        61663: (e) => {
          e.exports = {
            "not support this browser, you can try the latest chrome": "抱歉,不支持此浏览器, 建议使用最新版推荐浏览器",
            "not support Wechat, you can try in a browser": "微信浏览器无法下载文件，建议使用推荐浏览器",
            "not support download, you can try latest chrome, firefox": "部分功能在此浏览器可能无法使用，建议使用推荐浏览器",
            title: "PP直连",
            subTitle: '只需浏览器，让你电脑、手机、平板组成直连私密网络，互相<span class="text-highlight">实时共享</span>数据（文件、多媒体、桌面屏幕等）和<span class="text-highlight">远程控制</span>，或者与他人设备直接<span class="text-highlight">互连</span>',
            slogan: "点到点直连，高速、私密的文件传输、实时共享、远程控制",
            slogan_1: "致力于跨设备、跨网络、跨平台的直连互通",
            "Method of linking": "点到点直连",
            my_url: "我的网址",
            "copied to clipboard": "已复制到剪贴板",
            "Template url linking": "通过临时网址连接",
            my_url_hint: "对方访问此网址可建立直连，网页关闭则网址失效",
            "Connected device": "已直连设备",
            "Allow access by shortCode": "允许短码连我",
            "My short code": "我的临时短码",
            "Disallow access by shortCode": "禁止短码连接",
            "Link by shortCode": "输入对方短码进行连接",
            "Can not link yourself": "抱歉，请输入对端的短码进行连接",
            "Have linked": "已经处于连接中",
            none: "无",
            Reconnect: "重新连接",
            Disconnect: "断开连接",
            "Are you sure to Reconnect?": "重连可能会影响当前正进行的业务,确定要重连?",
            "Are you sure to Disconnect?": "断开连接可能会影响当前正进行的业务,确定要断开?",
            transfer: "文件传送",
            chat: "私密会话",
            copy: "复制",
            feature: "PP直连的特点",
            feature1: "两端私密直连，中间无解析无缓存",
            feature2: "只需浏览器即可使用",
            feature3: "支持文件、实时视频、文字多种交互方式",
            Contact: "联系方式",
            "set my name": "设置名称",
            "copy url": "复制地址",
            "show qrcode": "显示二维码",
            failed: "Action failed",
            success: "Action was successful",
            Peer2Peer: "直连",
            Relay: "中继",
            "My Files": "文件传送",
            "File Name": "文件名",
            "File Size": "大小",
            "File Type": "文件类型",
            Operation: "操作",
            Download: "下载",
            Pause: "暂停",
            Resume: "继续",
            Remove: "移除",
            Cancel: "取消",
            "Drag and drop file": "拖放文件/文件夹到此",
            or: "或",
            "Select file": "选取文件",
            "Are you sure to remove?": "确定要移除?",
            "Are you sure to remove all?": "确定要全部移除?",
            "Are you sure to pause?": "确定要暂停?",
            "Are you sure to Cancel?": "确定要取消？",
            "File is damaged": "传输中止或收到的数据不完整，请重新尝试",
            "Others can link to the private address to download the file": "发送文件到连接的设备，点对点实时传送",
            "cannot register to wss, please refresh page": "无法连接服务器, 请刷新页面",
            "no data channel": "数据通道尚未建立",
            "p2p channel is not built": "点到点的直连通道尚未建立",
            "cannot get local net information": "无法获取本地网络信息，请刷新页面",
            "Link apply": "连接申请",
            "apply link to you": "申请和你进行连接",
            Agree: "同意",
            Reject: "拒绝",
            Close: "关闭",
            "is linking to you": "开始连接你...",
            "is linking to": "正在连接",
            "channel to {remoter} connected": "与 {remoter} 的连接成功！",
            "channel to {remoter} has error": "与 {remoter} 的连接出错",
            "channel to {remoter} is close": "与 {remoter} 的连接已关闭",
            "Linked to {remoter}": "已经连接到{remoter}",
            "Unlinked to {remoter}": "已与{remoter}断开连接",
            "Remoter abort download": "对方中止了下载",
            "remote uploading aborted": "对端上传失败并中止",
            "Got all data, being to generate the file ..": "传送完成，正在保存 ..",
            "Please keep the mobile awake, and not leave browser": "下载过程中请保持在此页面且手机亮屏",
            "Warning: When broken, you can try to resume or reconnect": "注意：如传输中断，请勿刷新页面，尝试点击暂停/继续按钮或断开/连接按钮，可断点续传",
            Send: "发送",
            "not connected": "尚未连接",
            "Send Text": "发送文字",
            "input message": "输入消息",
            "input message(shift + enter for send)": "输入文字 (发送快捷键：Shift + Enter)",
            connected: "连接成功",
            me: "自己",
            remoter: "接收",
            from: "来自",
            "download fail": "下载失败",
            "error: 1000": "错误：未知错误",
            "error: 1010": "错误：缺少参数",
            "error: 4002": "错误：缺少uid参数",
            "error: 4010": "未找到指定地址的用户",
            Home: "首页",
            "Help Page": "帮助页",
            "Q&A": "常见问题",
            question1: "怎么使用PP直连",
            answer1:
              "待直连的双方均安装符合条件的浏览器，一方打开www.ppzhilian.com，另一方打开前者的直连网址（在前者首页可查看、复制）或扫描前者直连网址的二维码，两端则可以自动建立直连。支持的浏览器：在电脑端，支持最新版本的chrome、firefox、safari、极速360、QQ浏览器等；在手机端，支持最新版的chrome、firefox、safari浏览器，部分支持微信、QQ手机浏览器、360安全浏览器、猎豹手机浏览器，这些浏览器支持文件发送和文字相互发送，但是不支持下载文件",
            question2: "文件传送后无法保存的问题",
            answer2: "当接收端为手机时，微信浏览器、QQ手机浏览器、360安全浏览器等由于浏览器本身问题，导致文件可以发送但是无法下载保存，建议换用最新版chrome或firefox浏览器；PPLINK不久将发布APP，会有更好体验",
            question3: "单个传送文件的大小限制",
            answer3:
              "单个传输文件大小受接收端浏览器本身的限制。当接收端为最新版chrome、firefox浏览器，在所有设备均没有大小限制；当接收端是在windows系统，除IE浏览器及相应内核，其他最新版浏览器也没有大小限制；当接收端为手机，一般小于手机内存的五分之一（chrome、firefox浏览器除外）；如果传送超大文件，接收端推荐使用Chrome、firefox浏览器，在各平台与系统中不受大小限制。",
            question4: "文件传送速度限制",
            answer4: "文件传送速度受多个因素影响，主要包括发送端的上传网速、网络稳定性、两端设备的CPU性能与内存大小等；传输过程中显示的网速单位是Byte/s，普通所说的网速单位是bit/s，换算公式1MByte/s = 8Mbit/s；在实际使用过程中，条件较好时，速度可达到15MByte/s(120Mbit/s)以上",
            question5: "文件传输过程中长时间无传输速率",
            answer5: "文件在传输过程中如果长时间无传输速率，表示网络曾经中断过，重连之后经程序尝试后无法恢复继续传输。此时请勿刷新页面，可以手动点击 “暂停/继续”按钮，每次点击继续按钮来激活断点续传。",
            question6: "视频直连时，播放的视频不清晰",
            answer6: "传递的视频质量受双方带宽限制，尤其受共享方上行带宽影响最大。你可以尝试减小共享方视频的尺寸和降低视频帧率来改善效果。",
            question7: "视频直连无法共享给很多用户",
            answer7:
              "视频直连时，共享方每连接一个用户，都会占用一部分上行带宽，而家用带宽上行带宽远远小于下行，所有共享用户比较多时，会严重影响视频质量和流畅性，所以不建议同时共享给过多用户。如果确实需要满足更多收众，可以让已经连接用户进行视频流中转，让其他用户连接之前连接成功的用户，可以多次中转。中转方法：播放收到视频流后，点击“分享”，所有连接到这个用户的人也可以收到视频流。",
            question8: "视频直连时，设备CPU占用高",
            answer8: "视频直连时，如果共享视频流，设备需要完成内容采集，视频生成、分发等复制操作，由于浏览器本身的原因，大多需要占用较多CPU，所以CPU占用高是正常现象。如果设备配置较低，可以通过减小视频尺寸和降低视频帧率来改善。",
            "Scanner QR": "扫描二维码",
            "Scanned Result": "扫描结果",
            "ERROR: you need to grant camera access permisson": "错误：请授权使用摄像头",
            "ERROR: no camera on this device": "错误：未检测到摄像头",
            "ERROR: secure context required (HTTPS, localhost)": "错误：此网址不支持",
            "ERROR: is the camera already in use?": "错误：摄像头正被使用？",
            "ERROR: installed cameras are not suitable": "错误：摄像头无法使用",
            "ERROR: Stream API is not supported in this browser": "错误：不支持此浏览器",
            "Recommend Browser": "只需要普通浏览器就可互连（推荐下方浏览器）",
            "These browsers are perfect for pplink.link": "请优先使用以下浏览器访问本站",
            Chrome: "谷歌浏览器",
            Firefox: "火狐浏览器",
            Sumsung: "三星浏览器",
            Partners: "友情链接",
            "Thanks for our partners": "心怀感激，一路同行",
            shareScreen: "共享屏幕",
            "Not Support in this browser, please try to use chrome in pc": "此浏览器不支持此功能，请使用客户端或PC端谷歌浏览器",
            visibility: "可见",
            "visibility off": "不可见",
            locked: "锁定",
            unlocked: "未锁定",
            transform: "缩放与移动",
            setting: "设置",
            "move top": "最上",
            "move up": "上移",
            "move down": "下移",
            delete: "删除",
            opacity: "透明度",
            border: "边框",
            "brush size": "笔触大小",
            line: "线条",
            rectangle: "矩形",
            ellipse: "椭圆形",
            eraser: "橡皮刷",
            "Clear All": "全部清除",
            undo: "回退",
            "Add Content": "添加内容",
            Painter: "涂写画板",
            Camera: "摄像",
            Screen: "屏幕共享",
            Text: "文字字幕",
            Video: "本地视频",
            Image: "本地图片",
            Refresh: "刷新",
            FullScreen: "全屏",
            Sharing: "允许共享",
            "Camera & Microphone": "摄像",
            "Open camera and microphone?": "确认要打开摄像头和麦克风?(需要授权)",
            FacingMode_user: "前置摄像",
            FacingMode_environment: "后置摄像",
            "Camera Picture": "录像",
            Microphone: "录音",
            Ok: "确定",
            "New text": "新建文本",
            "Not Support in this browser, please try to use chrome or safari": "所用浏览器不支持此功能，请尝试谷歌浏览器",
            "Record error": "录制错误",
            "Screen share error": "屏幕共享错误",
            ScreenShare: "屏幕共享",
            pause: "暂停",
            play: "播放",
            "volume off": "关闭声音",
            "volume on": "开启声音",
            "microphone on": "开启麦克风",
            "microphone off": "关闭麦克风",
            "Copy failed": "复制失败",
            "To:": "发给",
            All: "全部",
            "Are you sure to clear all?": "确定全部清除？",
            "Merge To Stage": "合并到视频",
            Screenshot: "截图",
            "Record Stage": "本地录制",
            "Stop Record": "停止录制",
            Duration: "录制中",
            "Save Video": "保存视频",
            size: "大小",
            bold: "粗体",
            italic: "斜体",
            underlined: "下划线",
            "align left": "左对齐",
            "align center": "居中",
            "align right": "右对齐",
            "F&Q": "常见问题",
            "Upload Files": "待传文件",
            "Share Screen, Video Conference, Make Video": "点对点远程视频沟通与共享，如同面对面讨论与展示",
            "video link features": "无论远近，无论设备，同步双方所见所言/支持摄像头、麦克风、屏幕、涂画板、本地视频、图片等多种数据来源/支持多视窗自由切换，多层级内容任意组合/支持双向共享，转发分享，支持录制视频",
            "Video Link": "视频共享",
            "Local Content": "本机",
            Drag: "拖动",
            "Remote Content": "远端",
            "Connected List": "已连接设备",
            "No connected now": "当前尚无连接",
            Connected: "已连接",
            Disconnected: "已断开",
            "Remote Files": "远端文件",
            "Remote Videos": "远端视频共享",
            "Remote Messages": "长文消息",
            "Sharing Desktop": "屏幕共享",
            PlayVideo: "播放视频",
            "reject link to you": "对方已拒绝",
            "error:": "错误: ",
            "Input Text": "输入文字",
            "Exit Full Screen": "退出全屏",
            "Stage Setting": "视频设置",
            "Please set the parameters for your need": "请按照需要设置参数",
            "Width/Height Ratio:": "宽/高比例",
            "Video Max Frame Rate:": "输出视频帧率",
            "No remote video now.": "当前尚无视频流",
            "Stream Invalid": "无效视频流",
            "Stage Size": "视频分辨率",
            "Width / Height": "宽 / 高",
            "Recommended Size": "推荐分辨率",
            "More framerate, more cpu": "请合理设置，帧率越高，带宽和CPU占用越大",
            "Stage Size Tip": "屏幕共享请选择和屏幕一致的分辨率；高分辨率占用CPU较高",
            "Camera Frame Rate:": "摄像输入帧率",
            "Screen Frame Rate:": "屏幕共享帧率",
            Landscape: "横屏",
            Portrait: "竖屏",
            Width: "宽",
            Height: "高",
            Statement: "产品释疑",
            "Something about pplink": "此服务关注点的相关说明",
            Security: "安全性",
            "Security description": "基于现代浏览器的安全性，又加了点密；每次访问生成新的唯一网址",
            Privacy: "私密性",
            "Privacy description": "局域网和直连模式下，数据直达无中转；中继模式下，数据拆分加密后实时转发，无解析无缓存",
            Performance: "性能",
            "Performance description": "传输速度及资源占用受浏览器本身技术与能力限制，会随浏览器升级而提升",
            "No shared files now": "当前尚无文件",
            Help: "帮助",
            "Remote Clipboard": "远端剪贴板",
            "My Clipboard": "云剪贴板",
            "Cloud clipboard between devices by P2P": "两侧内容实时同步，支持文字和图片的复制、粘帖、拖放",
            "paste data into the editor": "请在下方编辑器中粘帖、编辑文字与图片",
            "clipboard tip": "支持图片及带格式的文字等内容，支持拖拽、系统快捷键、按钮等操作方式",
            "clipboard is syncing": "正在同步",
            "sync manually": "手动同步",
            "clear all": "全部清空",
            "No clipboard content now": "当前尚无剪贴板内容",
            all: "复制全部",
            "copy all": "复制带格式内容",
            text: "复制文字",
            "copy pure text": "仅复制纯文字",
            controls: "控制",
            "load new image": "加载新图片",
            "Choose the right video type": "可自由切换视频来源",
            "disable microphone": "禁用麦克风",
            "enable microphone": "启用麦克风",
            "stop sharing": "停止共享",
            "start sharing": "开始共享",
            screenshot: "截图",
            "start recording": "开始录制",
            "stop recording": "结束录制",
            "set stage": "设置",
            reload: "重置",
            "Must > 0": "必须大于0",
            "Device Screen": "屏幕",
            "Camera desc": "摄像头视频流",
            "Screen desc": "屏幕共享视频流",
            Whiteboard: "白板",
            "Whiteboard desc": "手动涂写画板",
            "Video desc": "加载本地视频",
            "Image desc": "加载本地图片",
            "Text desc": "加载文字内容",
            Customization: "自定义",
            "Customization desc": "自由组合各种来源",
            "service stage": "视频窗口",
            "Reload Content": "重置内容",
            "Are you sure to reload content?": "确定要重置内容",
            "microphone error": "麦克风错误",
            "paste from clipboard": "从剪贴板粘帖",
            "copy error": "复制错误",
            "Is sharing": "正在共享",
            "zoom out": "放大",
            "expand switch": "切换窗口",
            "picture-in-picture": "画中画",
            "my stage": "我的视频",
            message: "对话",
            own: "我的",
            user: "用户",
            layout: "布局",
            Exit: "退出",
            "Are you sure to exit?": "确定要退出？",
            "start video link": "开启视频共享",
            Link: "建立直连",
            Chat: "长文消息",
            Safe: "数据加密",
            Convenient: "只需浏览器",
            Private: "直连无缓存",
            Attentions: "功能提示",
            "safe transferring": "数据直达，无扫描，无缓存",
            "not close before finished": "传输中请勿待机或退出网站",
            "follow the regulations": "使用中请遵守当地法规",
            "get data from clipboard": "粘帖",
            "auto sync": "自动同步",
            "support dragging of image and text": "支持拖放图片和文字",
            "support word, excel, web page, etc.": "支持表格、网页等复杂格式",
            "not too big text": "所有内容只缓存在本地浏览器",
            "question about safe": "内容是否有泄漏风险",
            "answer about safe":
              "本站采用标准webrtc技术，此技术主要由苹果、谷歌、微软等公司开发与维护，在正规渠道下载的chrome、safari、edge等浏览器会保证你数据的安全。本站只提供连接双方通道的建立，不涉及其中数据的传输与解析，尤其是直连模式下，数据一个字节都不会经过本站服务器; 中继模式下，中继服务器实时透明转发，无缓冲、无解析。",
            "clipboard question2": "粘帖板内容格式失真",
            "clipboard answer2": "系统剪贴板内格式复杂，从其中读取出内容时，当前尚无法获得全部完整格式，同时不同系统技术实现也不同，所以只能尽量保证图片与文字的完整",
            "clipboard question3": "能否直接复制粘帖文件",
            "clipboard answer3": "当前暂不支持，未来浏览器会逐步增加相关功能，到时可实现此功能",
            "clipboard question4": "粘帖内容到编辑器，浏览器卡死",
            "clipboard answer4": "浏览器能力、设备的性能等因素，限制单次粘帖内容大小是受限的，碰到内容较多，请分批次粘帖和复制，或者保存成文件，通过文件传送",
            "suitable for small group": "适用于1v1, 或小规模互动",
            "use chrome for screen share": "使用中请遵守当地法规",
            "videoShare question1": "能否录制对方的视频",
            "videoShare answer1": "不可以，为了保护对方共享视频，无法通过本网站直接录制对方视频，只可以录制本地自己的视频",
            "videoShare question2": "无法打开摄像头或麦克风",
            "videoShare answer2": "请观察下方是否弹出提示错误，如果错误是禁止相关内容，则因为是之前打开摄像头或麦克风时，你主动拒绝了，导致网站已经记录下了你的决定，如果需要打开，请进入网站的设置，把摄像头或麦克风的权限打开。如果检查后并非权限问题，可以把错误信息反馈给下方的邮箱",
            "videoShare question3": "无法共享桌面",
            "videoShare answer3": '如果提示当前浏览器不支持，则此功能在此浏览器上无法开启；如果提示错误，并且和 "audio"相关，请在共享桌面时不要选择“分享声音”，然后尝试。如果是其他错误，请把错误信息反馈给下发的邮箱',
            "videoShare question4": "安卓App分享摄像头与屏幕，远端显示黑屏",
            "videoShare answer4": "由于安卓APP采用是系统自带的webview实现相关功能，当前部分手机系统自带的webview版本较低，无法正常使用此功能，请升级分享设备的安卓webview到最新版本，可解决此问题",
            "videoShare question5": "无法播放共享的画面或声音",
            "videoShare answer5": "请查看控制按钮，点击切换“播放”或“声音”按钮尝试",
            "videoShare question6": "如何多人相互共享",
            "videoShare answer6": "多人共享只需要多个设备相互连接，进入视频共享后就能看到多个共享的内容了，注意：在分享时，都是点对点的分享，如果分享给多个用户，对于带宽和CPU要求会根据人数线性增加",
            "p2p chat": "点对点复杂长图文消息，快捷短消息",
            "save content by yourself": "所有内容只临时存于双方浏览器",
            "chat question1": "如何保存好友",
            "chat answer1": "没办法保存好友，此功能主要用于临时沟通，所有内容只是临时存于双方浏览器内，退出后全部消失",
            "clear all history": "清空历史",
            "send to designated": "选择接收用户",
            history: "历史记录",
            "long text chat": "长文模式",
            "short text chat": "对话模式",
            "Account auto linking": "通过帐号连接",
            "auto link of member": "在多个设备登录同一个帐号可自动连接，适合个人多设备随时连接",
            "logined account": "已登录帐号",
            login: "登录",
            logout: "退出",
            register: "注册",
            "login tip": "同一个帐号支持在多设备同时登录",
            "register tip": "注册后的帐号可实现多设备自动连接",
            email: "邮箱",
            password: "密码",
            "confirm password": "密码确认",
            "please input your email": "请输入帐号邮箱",
            "please input your password": "请输入密码",
            "password mismatch": "密码不匹配, 请重新输入",
            "login error": "登录失败，请确认帐号和密码",
            "register success": "注册成功，请输入密码登录",
            "register error": "注册失败",
            "register error: account exist": "注册失败: 帐号已存在",
            "Short code linking": "通过短码连接",
            New: "新",
            "Permission denied": "浏览器已设置成禁止",
            sponsor: "赞助",
            "Disconnected from server": "已与信令服务器断开",
            FacingMode_: "FacingMode_",
            "Not support this browser": "暂不支持此版本浏览器",
            "Forbid pushing the file": "删除并禁止发送此文件",
            "Received files": "临时缓存文件",
            "No files now": "当前暂无文件",
            incomplete: "尚不完整",
            "some error in server": "服务器发生错误",
            "login success": "登录成功",
            "Push Box": "推送文件",
            "Quick linking": "快速连接",
            Samsung: "三星",
            Upload: "上传",
            "remote disabled receiver": "对方禁止接收",
            "push and receive files": "推送与接收文件",
            "Allow to receive files": "允许自动接收",
            "Disallow to receive files": "禁止自动接收",
            "Push files to remoter": "即时发送文件到对方设备",
            "The Remoter does not allowed to push file": "对方设置不接受此文件",
            D: "天",
            H: "小时",
            M: "分钟",
            S: "秒",
            "Are you sure to cancel push?": "确定取消此文件的推送?",
            "Forbid And Remove": "禁止推送",
            "Are you sure to forbid and cancel it?": "确定要取消与禁止此文件的推送?",
            Aborted: "已中止",
            "Completed. Cost time:": "用时: ",
            "safely, cached in sandBox of localStorage": "自动接收的文件会安全的隔离暂存",
            "site for collecting files": "收集对方推送的文件请保持页面打开",
            "pushUpload question1": "收到的文件缓存在哪里？是否安全？",
            "pushUpload answer1": "收到的文件暂时缓存在浏览器的本地缓存中，处于沙盒环境内，不会对本地系统造成安全风险，不同浏览器缓存方式不同，无法直接在磁盘中读取和复制",
            "pushUpload question2": "浏览器关闭后，缓存的文件是否消失",
            "pushUpload answer2": "缓存的文件已经通过特殊方式存储到硬盘中，浏览器关闭或电脑关闭，都不会自动清除缓存的文件，如需要清除缓存的文件，可使用网站内的“清除内容”功能，或者直接通过浏览器清除缓存的相关功能",
            "pushUpload question3": "可以传输并缓存成功，但是无法下载",
            "pushUpload answer3": "部分浏览器（主要包括部分国产手机浏览器）不支持buffer文件生成与下载，所以无法把缓存的文件从沙盒中读出并下载，建议采用最新版本的chrome、firefox、safari等浏览器",
            "pushUpload question4": "是否支持断点续传",
            "pushUpload answer4": "最新版本已经支持断点续传，启动断点续传功能后，文件在传输过程中会自动缓存在本地，传输中断后，下次可重新在断点附近继续传输。注意：断点续传功能会消耗设备资源，可能会少量影响传输速度",
            "No linked remoter for pushing": "当前尚无可发送的连接用户",
            "Reward for supporting": "假若对你有用，不妨小赞鼓励",
            "Download Client": "使用指南",
            "Use client for better performance": "如果需要更快传输、更多功能，请使用客户端。",
            "for windows": "windows客户端",
            "Fast Download": "高速下载",
            "Show in explorer": "文件夹内显示",
            "Download Success": "下载成功",
            Profile: "帐号信息",
            Notification: "通知",
            Logout: "退出登录",
            "Forget Password?": "忘记密码？",
            "Verify account and forget password": "忘记密码",
            "Forget password tip": "输入你的邮箱帐号，接收验证码进行密码修改",
            "Send Confirm Code": "发送验证码",
            "Send success, check your email later": "发送成功，请稍后查阅邮箱",
            "Send fail, check your email and try again": "发送失败，请确认你的邮箱地址后重新尝试",
            "Share Files": "文件共享",
            Sender: "发送文件",
            Receiver: "接收文件",
            "Remote Desktop": "远程桌面",
            About: "关于",
            "copied to clipboard fail": "复制失败",
            "Open in uploader": "打开上传管理器",
            "Fast Uploader": "高速上传",
            "Close Application": "关闭程序",
            "Are you sure to close the application?": "确定要关闭程序",
            "Download Manager": "下载管理器",
            "Receive Files": "接收文件",
            "Download Files": "下载共享文件",
            "Files of Pushing": "正自动接收的文件",
            "real time transfer, no delay, no cache": "实时传输，无延时，无缓存",
            "Send Files": "发送文件",
            "Select files for transferring": "选择文件实时共享，等待对方下载",
            "Convenient file sharing between devices": "无论远近，多个设备之间实时共享文件与文件夹",
            "Allow to share files to others": "允许共享给其他用户",
            "Disallow to share files to others": "禁止共享给其他用户",
            "Exclude same account": "不包括相同帐号",
            "This function need login first": "抱歉，此功能需要先登录",
            "This function need vip qualification": "此功能需要vip权限，期待你的订阅与支持",
            "My Share Groups": "我加入的共享群组",
            "Online Members": "当前在线",
            "Exit Group": "退出群组",
            "New Share Group": "新建共享群组",
            "connect all your device together": "轻松组建你的共享网络",
            "share files by groups": "所有文件只存储在用户设备",
            "share question1": "设备开启共享功能后是否安全",
            "share answer1": "开启共享功能，不影响设备的安全性。如果使用浏览器，共享的文件位于浏览器沙盒内，与设备文件系统处于隔离，所以很安全。如果使用客户端，对于共享文件只有读取权限，无法运行程序，所以也很安全。",
            "share question2": "客户端与浏览器能否互通",
            "share answer2": "客户端与浏览器，浏览器与浏览器，客户端与客户端均可以互连互通，但是客户端比浏览器具有更多功能，更好的性能，更快的传输速度。建议优先使用客户端，只要有一端采用客户端，即可增加高速功能",
            "share question3": "浏览器分享文件夹，内部文件不会自动更新",
            "share answer3": "浏览器分享文件夹，只能把此文件夹内文件缓存到沙盒内，一旦选择后，与原始文件夹没有关系，也无法根据原来文件夹内的变化而自动变化。建议使用客户端，客户端分享文件夹后，会直接与此文件夹关联，文件夹内的任何变化都会实时同步。",
            "share question4": "高速下载与高速上传",
            "share answer4": "客户端支持高速下载与高速上传，连接的双方有一端使用客户端则可能实现高速下载与高速上传功能。注意高速功能只有在双方可以直连的模式下才能实现",
            "Are you sure to exit from the group?": "确定要退出群组",
            "User Notification": "用户通知",
            "My Notification": "我的通知",
            "No content now": "当前暂无内容",
            "paying for long working": "为保障产品维持和成长，请付费订阅",
            "ask for free by email if expensive for you": "如价格对你过高，请email申请减免",
            "can sharing instead of paying": "不想付费，可参照白嫖方案",
            "question about user 1": "相同帐号能否同时在多个设备登录",
            "answer about user 1": "可以，支持设备数目不限，相同帐号同时在多个设备登录后，会自动连接",
            "question about user 2": "VIP资格突然被取消或IP封禁",
            "answer about user 2": "此产品是为有需要的用户开发，适当付费是为了维持服务的长期运行与升级成长，如果不想付费也提供了白嫖方案与减免申请方式，但是如果发现恶意破解或利用漏洞，则会取消VIP资格，甚至封禁IP",
            "question about user 3": "白嫖方案获取VIP资格有没有上限",
            "answer about user 3": "当前还没有",
            "question about user 4": "如何订阅VIP资格",
            "answer about user 4": "付费系统上线后，订阅方式会自动显示在VIP相关内容区域，如果没有发现，请耐心等待，不久会上线",
            "Allow to connect": "允许远程控制",
            "Disallow to connect": "禁止远程控制",
            "Allowed Remoter": "允许的设备",
            "Choose allowed remoter": "选择允许的设备",
            Required: "不能为空",
            "Set access code for security": "设置密码",
            "Connected Remoter": "已连接设备",
            "New Connection": "创建新连接",
            "Connect Remote Desktop": "连接远程桌面",
            "Choose remote peer": "选择设备",
            "Choose remote first": "首先选择设备",
            "Input Access Code": "输入密码",
            "Access code cannot be empty": "密码不允许为空",
            Connect: "连接",
            "safe access, both authorization and access code": "安全访问，身份及密码双重认证",
            "accessor only need browser in pc or mobile": "访问端只需要浏览器",
            "accessed need client of installed": "被访问端需要安装客户端",
            "remote desktop question1": "如何使用远程桌面",
            "remote desktop answer1": "首先在被访问端安装客户端，启动客户端后进行如下设置：1）开启允许远程连接；2）选择允许的访问端（默认只允许相同帐号的访问）；3）设置密码。设置成功后，远端使用浏览器或客户端先连接被访问端，然后进入“远程桌面”功能选择访问端并输入密码，点击“连接”按钮",
            "remote desktop question2": "开启远程桌面是否安全",
            "remote desktop answer2": "访问远程桌面，需要通过用户身份、密码双重认证，同时连接过程通过webrtc直连，很安全",
            "remote desktop question3": "能否同时连接多个远程桌面",
            "remote desktop answer3": "可以，但是每增加一个连接，会占用一部分设备的cpu等资源，请保证设备资源够用，否则会卡顿",
            "remote desktop question4": "被连接端出现资源不足提示",
            "remote desktop answer4": "被连接端除了屏幕录制与共享，还需要进行数据传输等工作，分辨率和帧率越高，对设备性能要求越高，所以对于性能较差或者cpu单核性能较差的设备，会出现类似提示，请降低分辨率或帧率来改善此问题",
            "remote desktop question5": "Mac电脑无法接受远程控制",
            "remote desktop answer5": "Mac电脑作为被控制端时，需要给予程序授权才可以允许远方接入并控制。打开“安全与隐私”，在“隐私”标签内，找到“屏幕录制”与“辅助功能”，分别对程序进行录制与控制授权.",
            "My own account": "我的帐号",
            "Are you sure to Close?": "确定要关闭",
            "User Profile": "帐号信息",
            Account: "帐号",
            "User Type": "用户类型",
            "User State": "用户状态",
            "User Created": "创建时间",
            Password: "用户密码",
            "Change Password": "修改密码",
            "Current Password": "当前密码",
            "New Password": "新设密码",
            Submit: "提交",
            "About VIP": "关于VIP",
            "Is VIP": "是否VIP",
            "VIP Expired": "VIP有效期至",
            "Get VIP Free": "白嫖VIP",
            "My Prompt Link": "我的推荐链接",
            "VIP Subscript": "订阅VIP",
            Pay: "支付",
            "VIP Rights": "VIP会员特权",
            "VIP rights 1": "开通所有已上线功能",
            "VIP rights 2": "提前体验未来上线的新功能",
            "VIP rights 3": "去除页面所有广告",
            "VIP rights 4": "优先获得网络加速",
            "VIP rights 5": "优先获得支持服务",
            member: "会员",
            "Change password success": "修改密码成功",
            "Change password fail": "修改密码失败",
            "Can not verify account": "无法验证帐号",
            "Verify success": "验证成功",
            "Verify fail": "验证失败",
            "please input your new password": "请输入你的新密码",
            "error: ": "错误",
            "Only work in {clientType}": "仅支持{clientType}",
            "Only work in client": "此功能仅支持客户端",
            "Not work in {clientType}": "不支持{clientType}",
            "Download Fail": "下载失败",
            "datachannel error": "下载通道错误",
            "My private Share": "私人共享",
            "user-state-confirmed": "正常",
            "user-state-unconfirmed": "待验证",
            "user-state-forbidden": "禁用",
            Recommend: "推荐",
            "Found new version": "发现新版本",
            "New version downloaded, install now ?": "已下载新版本，是否现在安装？",
            Install: "安装",
            "Downloading new version": "正在下载新版本",
            "Updating app": "正在更新程序",
            "Re-Download": "重新下载",
            "Download List": "下载列表",
            Create: "新建",
            Join: "加入",
            "Group ID": "群组ID",
            "please input the group id": "请输入群组ID",
            "Group Name": "群组名称",
            "please Input a group name": "请输入群组名称",
            "Group Password": "群组密码",
            optional: "可选",
            "add new group success": "新建群组成功",
            "add new group fail in local": "新建群组失败",
            "Invite Members": "邀请成员",
            Sort: "排序",
            "Layout as grid": "网格排列",
            "Layout as list": "列表排列",
            "Invite members to join in": "邀请成员加入",
            ID: "ID",
            "Others can join the group by groupId": "可以通过群组ID加入此群组",
            "Invite members of connected": "邀请已连接用户",
            Invite: "邀请",
            "sort by name": "按名称",
            "sort by time": "按时间",
            "sort by type": "按类型",
            "sort by size": "按大小",
            mine: "本地",
            "Add Files": "添加文件",
            "Add Directory": "添加目录",
            "Open fast downloader": "打开高速下载器",
            Downloader: "下载管理器",
            "Invalid file": "无效文件",
            Unshare: "取消共享",
            "Go to": "前往",
            Open: "打开",
            "Unshare it": "取消共享",
            "Are you sure to unshare it?": "确定要取消共享",
            "share fail": "共享失败",
            "share success": "共享成功",
            "unshare fail": "取消共享失败",
            "unshare success": "取消共享成功",
            "Setting success": "设置成功",
            "Setting fail": "设置失败",
            "state: ": "当前状态： ",
            "Connect fail": "连接失败",
            "Update Settings": "更新设置",
            Resolution: "分辨率",
            Original: "原画",
            "Frame rate": "帧率",
            "Remote desktop is closed": "远程桌面已关闭",
            "Remote desktop is abort": "远程桌面已中止",
            "The request is forbidden": "请求被禁止",
            "Cannot start remote desktop": "无法启动远程桌面",
            "Why use": "各设备随用随连",
            "Connect all my devices by one account": "一个帐号，实现个人所有设备直连",
            "Connect any devices by one step": "一步操作，实现任何设备互连",
            "Share data": "轻松数据共享、远程控制",
            "Share data between all devices": "多设备跨网络、跨系统共享文件、多媒体、屏幕等",
            "Share data between all users": "任一设备远程登录控制其他设备",
            "Fast Downloader": "高速下载",
            "Auto update fail": "版本更新失败",
            "Are you sure to logout?": "确定要退出？",
            "Just this machine": "只是本机退出",
            "All machines": "所有设备退出",
            "Please keep the page visible for faster transfer": "传输过程中，请保持所在标签页可见",
            "FastDownload: Right click on the button, save link as": "高速下载: 右键点击按钮，选择“链接另存为”",
            "FastDownload: Long tap on the button, save link as": "高速下载: 长按按钮，选择“下载链接”",
            Visible: "可见",
            Invisible: "不可见",
            Embed: "取消悬浮",
            Float: "悬浮窗口",
            Pin: "锁定窗口",
            Unpin: "解锁窗口",
            Maximize: "最大化窗口",
            Restore: "恢复窗口",
            "Exit FullScreen": "退出全屏",
            abort: "终止",
            connecting: "正在连接..",
            "Enable Zoom": "开启缩放",
            "Disable Zoom": "关闭缩放",
            "Receiving files of pushing": "正自动接收的文件",
            "Are you sure to cancel all push?": "确定取消当前所有的上传？",
            "Choose Directory": "选择目录",
            "Choose save directory": "选择保存目录",
            "No linked client for remote download": "没有可控制的远端下载器",
            "New Download": "新建下载",
            "Download Speed": "下载速度",
            "Connections(Seeds)": "连接数（种子数）",
            Connections: "连接数",
            Completed: "已完成",
            Complete: "完成",
            Removed: "已删除",
            "Transfer to me": "转发给我",
            "Retry Download": "重新下载",
            "Add new download": "新建下载",
            "Input download url, support: http/https/ftp/magnet": "请输入下载链接，支持http/https/ftp/magnet等类型",
            "Task Settings": "任务设置",
            Confirm: "确认",
            "max-download-limit": "最大下载速度",
            "max-download-limit desc": "限制最大下载速度，0表示不限制",
            split: "文件最大切分块个数",
            "split desc": "限制文件最大切分个数，用于多线程下载，与“最小文件块大小”一起起作用",
            "min-split-size": "最小文件块大小",
            "min-split-size desc": "文件切分时，每块最小体积",
            "all-proxy": "网络代理",
            "all-proxy desc": "通过代理下载，输入格式: protocol://account:password{'@'}host:port, 如： http://127.0.0.1:12345",
            "Remove task": "删除任务",
            "Are you sure to remove the task?": "确定要删除任务？",
            "Network Downloader": "网络下载器",
            "Soft Keyboard": "软键盘",
            "Download files fast in internet": "通用网络下载器，高速，多线程，可远程管理",
            "Resume All": "全部继续",
            "Pause ALL": "全部暂停",
            "Downloader is running": "下载器已启动",
            "Downloader is down": "下载器已关闭",
            "Downloader Global Settings": "下载器全局设置",
            "Remote Downloader": "远程下载器",
            "Load Seed": "加载种子",
            "Download Task Settings": "当前任务设置",
            dir: "下载目录",
            "dir desc": "保存下载文件的目录",
            "max-concurrent-downloads": "最大同时下载数",
            "max-concurrent-downloads desc": "限制最大同时进行的下载任务数目",
            "max-overall-download-limit": "最大下载速度",
            "max-overall-download-limit desc": "限制下载器总共最大下载速度，0表示无限制",
            "max-overall-upload-limit": "最大上传速度",
            "max-overall-upload-limit desc": "限制下载器总共最大上传速度，0表示无限制",
            "support http/https/ftp/bt etc": "支持http/https/ftp/magnet等各种类型",
            "fast multiple thread downloader": "多线程高速下载器，提升几倍下载速度",
            "support proxy download and remote download": "支持代理下载及远程管理",
            "network downloader question1": "如何更大提升下载速度",
            "network downloader answer1": "本下载器功能是集成了优秀开源项目aria2，一般情况下对各种下载都有很好的速度加成，尤其对http/https的下载，通过多线程的机制，数倍与浏览器的下载速度。可以通过调整“最大文件切分个数”与“最小文件块大小”来达到更好的速度提升效果",
            "network downloader question2": "文件下载操作不起作用",
            "network downloader answer2":
              "下载器的实际下载工作由底层的下载子程序完成，如果对文件下载的操作不起作用，请检查右上方那一排按钮中倒数第二个，确认下载子程序是否已经启动，如果未启动，请尝试手工启动，或者离开“网络下载器”界面，然后重新返回。如果下载器一直无法启动，重启软件后也无法解决，请email反馈，我会尽快定位修复",
            "network downloader question3": "如何获得远程控制下载器下载的文件",
            "network downloader answer3": "远程控制下载器，可以新建与控制下载任务，下载完成后会自动保存在远端下载器的默认下载目录里。如果想要下载完成后转发到本地，可以把远端下载器的下载目录设置到“文件共享”中，本端直接去文件共享中下载即可",
            "network downloader question4": "通过magnet链接添加的下载任务一直没有下载数据",
            "network downloader answer4":
              "这个是由于bt本身机制与所在网络环境造成，最开始使用magnet时，本地无法加入DHT网络，获得有效的下载来源，可以按照“aria2无下载速度”这个相似问题来解决，找一个热门资源的种子（注意是.torrent文件），然后下载资源，资源下载完成并挂机一段时间，等待程序自动加入DHT并同步，之后应该会越来越快",
            "Stop downloader": "关闭下载器",
            "Are you sure to stop downloader?": "确定要关闭下载器？",
            "Downloader is turn off, Please turn on first": "下载器已经关闭，请启动下载器后重新尝试",
            "Connect downloader again, try later": "重新连接下载器，稍后重试",
            "Save Error": "保存错误",
            "Thanks for your support": "你的支持是对开发小哥辛苦的肯定",
            "If PP works for you, wait for your subscription": "独立开发软件，期待你订阅VIP进行支持",
            "Subscript Now": "订阅VIP会员",
            "Please login first": "请先登录",
            "Pay Success": "支付成功",
            "Weixin pay": "微信支付",
            "Privacy Policy": "网站隐私政策",
            "The group is only in local": "此群组只存在于本地",
            "Download URL": "下载网址",
            "URL is invalid": "无效网址",
            Start: "开始",
            "Have upload": "已上传",
            "Download success": "下载成功",
            "Something is error, upload is aborted": "出错了，上传已终止",
            "Upload Speed": "上传速度",
            "Upload success": "上传成功",
            "Share url": "文件分享网址",
            "Download url for browser, recommended": "文件分享地址，用于浏览器加速下载",
            "File url": "文件存储网址",
            "Download url for downloading client": "文件存储地址，用于各种下载工具或浏览器",
            "Expired time": "过期时间",
            "Sorry, you have no permission to do this": "抱歉，你没有此项操作的权限",
            "Connections(Seeds) ": "连接数（种子数）",
            "Cloud Transfer": "离线传送",
            "Transfer files over cloud cache": "通过云端暂存转发文件，暂存到期自动清除",
            "Upload files to cloud": "上传文件到云端暂存",
            "My valid traffic currently": "我当前可用流量",
            "My files cached in cloud": "我暂存在云端的文件",
            "Download times": "下载次数",
            "Show link": "查看网址",
            "Upload time": "上传时间",
            "Download files from cloud": "从云端下载文件",
            "files only exist in 48 hours in cloud": "文件只在云端暂存48小时，过期清空",
            "no checking, no backup": "转发文件在云端无扫描，无备份",
            "support downloading by any download client": "支持浏览器和各种下载软件",
            "cloud transfer question1": "转发的文件有没有什么限制",
            "cloud transfer answer1": "转发过程中，所有文件被当作普通的数据包处理，拆分，离散，暂存，下载，清除，不对文件的内容、格式、大小等处理，所以原则上没有什么限制，但是此功能当前还处于公测阶段，而且尚不支持断点续传，所以不建议上传过大文件，比如10G以上",
            "cloud transfer question2": "云转发的流量消费是怎么计算的",
            "cloud transfer answer2":
              "网络流量转发成本很高，每个用户的需求量差异很大，所以根据用户实际使用流量来计费。用户需要购买流量套餐获得相应的流量，流量单位与文件大小单位（字节-byte）一致。正常情况下，同一个文件的一次上传和一次下载两个行为共消耗一个文件大小的流量。如果同一个文件n次下载，则消费n倍文件大小的流量，如果只上传不下载，则消耗一个文件大小的流量。",
            "cloud transfer question3": "上传与下载是否支持断点续传",
            "cloud transfer answer3": "本产品中当前尚未提供断点续传功能，但是下载功能本身支持断点续传，如果需要断点续传下载，可选用有此功能的第三方下载工具",
            "cloud transfer question4": "转发文件是否安全",
            "cloud transfer answer4":
              "在上传与下载过程中是安全的，在文件暂存云端时，请保存好你的文件下载地址，不要泄漏，下载时密码验证的功能稍后才能上线。暂存文件超过有效期后，会彻底自动清除，在有效期到期前，你可以根据下载情况手动清除文件。另外，为了更加安全，你可以先在本地进行压缩加密，然后再进行转发。",
            "Delete fail": "删除失败",
            "get channel fail": "获取通道失败",
            "invalid url": "无效网址",
            "Downloaded file is damaged": "下载文件已损坏",
            "not found or can not download": "未找到或无法下载",
            "fail after retry": "多次尝试后失败",
            "save file fail": "文件保存失败",
            "Download fail": "下载失败",
            "You do not have enough traffic now": "抱歉，你当前没有足够的转发流量",
            Feedback: "和开发小哥聊聊",
            "Are you sure to Remove?": "确定要删除",
            "Report a bug or tell me your good ideas": "发现程序bug，或者有好的建议，欢迎随时给开发小哥留言",
            Developer: "开发小哥",
            "Leave a message": "留言与反馈",
            "Upload images": "上传图片",
            "Can not be empty": "请写点什么",
            "Something is wrong": "抱歉，出错了",
            Cached: "本地缓存",
            "Export from local cache": "从本地缓存中导出",
            Resumable: "断点续传",
            "Re-download": "重新下载",
            "Are you sure to delete cache and re-download?": "确定要重新下载？",
            Export: "导出",
            "Download all": "全部下载",
            "Pause all": "全部暂停",
            "Enable resumable transfer": "启用断点续传",
            "Disable resumable transfer": "禁用断点续传",
            "Remoter do not support resumable": "另一端不支持断点续传，请另一端升级",
            "No enough storage space": "没有足够存储空间",
            "No enough storage space for template file": "没有足够缓存空间",
            "no exist": "文件不存在",
            "No enough storage space or not support resumable, switch to normal": "没有足够缓存空间或不支持断点续传，已切换到非缓存模式",
            "Export all": "全部导出",
            "Is exporting file": "正在导出文件...",
            "Is removing file": "正在删除缓存文件...",
            "Keep app running always": "保持应用持续运行",
            "Can not generate a new name": "无法生成新名称",
            "save cache file with some error": "缓存文件不完整",
            "Saved to": "保存到 ",
            "Export success": "导出成功",
            "Export fail": "导出失败",
            "Have unshared lost files": "共享文件无法找到",
            "disconnect fail": "断开失败",
            "Add track fail": "添加流失败",
            "change track fail": "更新流失败",
            "remove track fail": "删除流失败",
            "Choose download directory": "选择下载位置",
            "Waiting in queue": "排队下载",
            "Is downloading": "正在下载",
            "Download directory": "下载文件夹",
            "Are you sure to download directory?": "确定要下载此文件夹？",
            "Can not get data or remote do not support": "无法获取数据或对方不支持此功能",
            "part fail": "部分失败",
            close: "关闭",
            settings: "设置",
            "Are you sure to clear all and stop all?": "确定要停止并清除全部？",
            "Download Folder": "下载文件夹",
            Settings: "设置",
            "Set fixed location of download": "设置默认下载文件夹",
            "Auto Download to selected directory": "自动下载到默认文件夹",
            "Select download directory every time": "每次选择下载文件夹",
            "Save location": "保存位置",
            "save access code": "保存",
            "Open Directory": "打开目录",
            "total items": "总共{count}项",
            "Select screen": "选择窗口",
            "Main stage": "主舞台",
            "NetDownloader is enabled": "下载功能已启动",
            "NetDownloader is disabled": "下载功能已关闭",
            Yes: "是",
            No: "否",
            "user-state-": "用户状态",
            "Screen share": "屏幕分享",
            "Entire Screen": "整个屏幕",
            "Refresh will break and init all service?": "刷新会中断所有现有业务",
            "Can not download the file, please check input and try again:": "无法下载此文件，请查看原因:",
            "The new version has been updated and no longer serves as the old version": "新版本已更新，不再兼任老版本",
            "The new version has been updated, please update": "检测到新版本，请尽快升级",
            "Drop content for sharing": "拖放此处分享",
            "Drop content for sharing tip": "文字、文件、文件夹拖放到此，分享到发送文件和云剪贴板",
            "share stream": "分享视频",
            "Unlink All": "断开全部连接",
            "Clear Unlinked": "清除已断开设备",
            "Check My Peers": "检测我的在线设备",
            "Downloaded files": "已下载文件",
            "P2P remote control": "点到点远程桌面、远程终端，Web SSH工具",
            "Allowed Device": "本机允许的接入端",
            "Access Code": "本机密码",
            "Camera share": "摄像头分享",
            Communication: "双向共享",
            Play: "播放",
            "Play Video": "播放",
            Window: "窗口",
            "Share system audio": "分享系统声音",
            "disable volume": "关闭声音",
            "enable volume": "开启声音",
            "question quick sharing": "如何快捷分享",
            "answer quick sharing": "1、对于浏览器用户，直接拖动文件或文件夹到pp网站；2、对于桌面客户端，客户端可以切换到快捷工具栏模式，直接拖放文件到上面；3、对于手机app，选择文件或文字后点击系统自带的分享功能，然后选中“pp直连”进行分享",
            "no save path": "无保存地址",
            "Quick operation": "文件、文字快捷分享",
            "quick operation 1": "拖拽内容到PP网站或客户端",
            "quick operation 2": "在安装App的手机上选中内容，点击“分享”，选择“pp直连”",
            "get data from any device": "各种PC、手机、平板不受网络与系统限制，实时共享文件和文件夹",
            "share files in group": "分组管理，不同群组共享不同数据",
            "support folder transfer": "文件夹一键下载",
            "Control remote pc by browser": "支持浏览器连接远程桌面、远程终端，轻松操作远方电脑",
            "Web SSH on browser": "支持浏览器运行SSH，远程登录及操控服务器",
            "Control remote pc by mobile": "支持手机随时随地远程控制电脑",
            "Receive files from linked device": "从连接的设备实时接收文件",
            "Input activate code": "输入激活码",
            "Activate success": "激活成功",
            "Activate fail": "激活失败",
            "Dark mode": "暗黑模式",
            Preview: "预览",
            "Share setting": "共享设置",
            "Forbidden all": "禁止共享",
            "Allow self": "同帐号共享",
            "Allow group": "群组内共享",
            "Please take a screenshot and scan the payment code": "麻烦你截屏后扫描付款码，或在PC登录并支付",
            "Remote Control": "远程控制",
            Terminal: "终端",
            "Less remote terminal params": "缺少参数",
            SSH: "SSH",
            "SSH connect": "SSH连接",
            host: "主机地址",
            "Please input host": "请输入主机地址",
            port: "端口",
            "Please input port": "请输入主机端口",
            username: "用户",
            "Please input username": "请输入用户",
            "Please input password": "请输入密码",
            Copy: "复制",
            Paste: "粘帖",
            Search: "搜索",
            Clear: "清除",
            "Terminal closed": "终端已关闭",
            "Terminal error": "终端出错",
            "input search word": "输入搜索关键字",
            "username or password mismatch": "用户和密码不匹配",
            "Open remote terminal fail": "打开远程终端失败",
            Error: "错误",
            "Build channel fail": "创建通道失败",
            "Remote Terminal": "远程终端",
            "Terminal tools": "终端工具",
            "Local terminal": "本地终端",
            "remote desktop question6": "如何使用远程终端",
            "remote desktop answer6": "远程终端使用方法与远程桌面类似，在连接时选择“远程终端”进行连接",
            "remote desktop question7": "远程终端是否安全",
            "remote desktop answer7": "远程终端和远程桌面一样采用双层密码及授权机制，以及优先选择直连通道，所以具有很高的安全性。桌面客户端上运行SSH功能，是直接访问目标主机，所有数据及帐号信息不经过PP系统。浏览器上运行SSH功能是通过中继服务器透明中转，PP系统不解析不缓存",
            Local: "本地",
            client: "客户端",
            simple: "便捷",
            fast: "高速",
            private: "私密",
            realTime: "实时",
            "is simple": "支持各种电脑、手机、平板，只需要浏览器，一步实现直连",
            "is fast": "智能选择最佳通道，最大化利用带宽，永不限速",
            "is private": "点对点安全直连，内容只在目标设备之间传输，无扫描无缓存",
            "is realTime": "采用Webrtc技术，数据实时同步与传输",
            "Linking ways": "任选一种直连方式",
            "Select directory": "选择文件夹",
            "Drag and drop file to this page": "拖拽文件/文件夹到此页面",
            "electron auto start question": "如何开机自动启动客户端",
            "electron auto start answer": "windows、mac、linux系统都有开机自动启动指定程序的功能，请搜索一下相关功能，然后把PP直连程序加入到启动项即可",
            "Show cursor": "显示本地鼠标",
            "Hide cursor": "隐藏本地鼠标",
            align: "排列",
            "horizontal center": "水平居中",
            "vertical center": "垂直居中",
            cascade: "层级",
            "content management": "内容管理",
            "Max duration": "最大时长",
            "no stream to record": "没有内容可录制",
            viewport: "视窗",
            "can not get screen stream": "无法获取屏幕数据",
            "Switch stage viewport": "切换视窗",
            "Add viewport": "新建视窗",
            "disable cursor": "隐藏鼠标",
            "enable cursor": "显示鼠标",
            "disable painter": "关闭标注",
            "enable painter": "打开标注",
            "zoom stage": "缩放大小",
            Full: "100%",
            "Auto scale": "自动缩放",
            "Stage Background": "背景",
            "screen Sharing": "屏幕分享中",
            "use microphone": "使用麦克风",
            "local volume, not remote volume": "本地音量",
            "switch screen share": "切换屏幕",
            "choose screen share mode": "选择分享模式",
            "screen share and microphone": "屏幕 + 麦克风",
            "only screen share": "只有屏幕",
            "start screen share": "开始分享屏幕",
            "stream is stopped": "分享已经结束",
            "cancel or forbid screen sharing": "已取消或禁用了屏幕分享",
            "cancel or forbid microphone": "已取消或禁用了麦克风",
            "preview, recommend disable in using": "预览，使用中建议关闭",
            "Video sharing is running, please close old one": "视频共享已经启动，如需新共享，请关闭之前共享",
            timeout: "超时",
            arrow: "箭头",
            "account tip": "此处邮箱用作帐号名，区分大小写，可用于密码找回",
            "Connected devices": "已连接设备",
            "send fail or no receiver": "发送失败或没有接受者",
            "send fail of part": "对部分接受者发送失败",
            "Connected Time": "连接时间",
            "Disconnected Time": "断开时间",
            Temp: "临时连接",
            "Share group": "共享群组",
            "search files from multiple device": "在多个设备内搜索文件",
            "Searching ...": "搜索中 ...",
            localhost: "本地",
            "Remote peer has lower version for the feature": "远端版本过低，不支持此功能",
            "Search in group": "搜索文件",
            "Invalid search": "无效搜索",
            "file not exist": "文件不存在",
            Overwrite: "文件覆盖",
            "There is a same file here, overwrite it?": "已存在此文件，是否要覆盖？",
            "Waiting files": "等待中文件",
            "Failed files": "已失败文件",
            "Exist files": "已存在文件",
            Detail: "详情",
            Children: "子节点",
            Size: "大小",
            Downloading: "下载中",
            Waiting: "等待中",
            Downloaded: "已下载",
            Exist: "已存在",
            Fail: "失败",
            Ignore: "忽略",
            "Save as": "另存为",
            "Open cache folder": "打开缓存文件夹",
            "Batch action": "批量操作",
            "Fast download all": "高速下载全部",
            "Resume all": "全部暂停",
            "Cancel all": "全部取消",
            "The folder is exist, how to?": "文件夹已存在，选择处理方式：",
            "merge folder, ignore exist files": "合并文件夹，忽略已存在文件",
            "overwrite full folder": "覆盖所有已存在文件",
            "create new folder": "创建新文件夹",
            files: "文件",
            "Directory manager, choose files for transfer": "文件夹管理，选择传输文件",
            "Open save folder": "打开存储文件夹",
            "Disable transfer": "取消传输",
            "preparing for download": "准备下载",
            Paused: "已暂停",
            "Saved file": "已保存文件",
            "Save file fail": "保存文件失败",
            Total: "总计",
            "Total size": "总计大小",
            "Error report": "错误报告",
            "Check errors and report": "查看运行错误",
            "Search Group": "搜索共享群组",
            "Search Directory": "搜索文件夹",
            "No group": "无群组",
            "Are you sure to do it ?": "确定进行此操作？",
            "overwrite the file": "覆盖原文件",
            "create new file": "保留原文件并另存为",
            Exported: "已导出",
            "Export directory": "导出文件夹",
            "Download Directory": "下载文件夹",
            "Search name": "搜索名称",
            "Search file or directory by name, support multiple key": "支持以空格区分的多个关键字，关键字前后顺序有区别。",
            "Files duplicate": "文件或文件名重复",
            "Some files duplicate": "部分文件或文件名重复",
            "exist, overwrite it?": " 已存在，是否要覆盖？",
            "Can not remove the last one": "无法删除最后一项",
            "Disconnected from server, connecting": "与信令服务器断开, 自动连接中..",
            "Group peers": "群内设备",
            "Include {count} files, {size}, are you sure?": "共包含{count}个文件,大小{size}, 文件过多或过大会占用较多内存, 可能会影响设备性能, 确定要选择吗? ",
            "Loaded none files": "没有加载文件",
            "Save folder setting": "设置下载文件夹",
            "Download by": "下载方",
            "Drag and drop file to here": "拖拽文件到此",
            "No files in directory": "文件夹内无文件",
            "Link type": "连接类型",
            "Set fixed location in browser settings": '请在浏览器的设置中设置浏览器默认下载位置，例如 “设置” -> "下载内容"或"下载"',
            "No content or no rights": "当前尚无内容或权限不足",
            "Save fail, try to reset fixed download location": "保存失败，请尝试重新设置 “默认下载文件夹”",
            "no permission to create file": "无法在指定位置保存文件，无权限创建文件",
            "Root folder": "根目录",
            "disk available information": "{available} 可用, 共 {size}",
            "Device storage": "本地存储",
            "Local disk status": "本地存储空间",
            "Can not get disk information": "无法获取本地存储信息",
            "Download location is invalid": "下载文件夹由于权限限制或不存在，无法保存文件，请重新选择",
            "Local Fixed Disk": "本地磁盘",
            "Network is offline": "网络当前离线，请检查网络状态或网络连接权限",
            "Current version": "当前所用版本",
            "Latest version": "最新可用版本",
            "Change logs": "更新说明",
            "Current version is latest": "当前版本已是最新",
            Share: "分享",
            "Share out": "分享",
            "up by time": "按时间递增",
            "down by time": "按时间递减",
            "up by name": "按名称递增",
            "down by name": "按名称递减",
            "up by type": "按类型递增",
            "down by type": "按类型递减",
            "up by size": "按大小递增",
            "down by size": "按大小递减",
            "If can not find window, please re active the window and click refresh button": "如果找不到目标，请切换到目标程序用以激活，然后点击刷新按钮",
            fontSize: "字体大小",
            theme: "风格",
            "Deep theme": "深色",
            "Bright theme": "浅色",
            "Assist key": "功能键",
          };
        },
        11713: (e, t, r) => {
          "use strict";
          r.d(t, { Z: () => o });
          r(24124), r(10071);
          const i = [
              { path: "/downloadManager", component: () => Promise.all([r.e(736), r.e(64), r.e(353)]).then(r.bind(r, 44841)), notPeer: !0 },
              {
                path: "/",
                component: () => Promise.all([r.e(736), r.e(64), r.e(475)]).then(r.bind(r, 82948)),
                children: [
                  { path: "", name: "home", component: () => Promise.all([r.e(736), r.e(64), r.e(91)]).then(r.bind(r, 65516)), meta: { keepAlive: !1 } },
                  { path: "sender", component: () => Promise.all([r.e(736), r.e(64), r.e(474)]).then(r.bind(r, 68736)), meta: { keepAlive: !1 } },
                  { path: "clipboard", component: () => Promise.all([r.e(736), r.e(64), r.e(632)]).then(r.bind(r, 54582)), meta: { keepAlive: !0 } },
                  { path: "videoShare", component: () => Promise.all([r.e(736), r.e(64), r.e(550)]).then(r.bind(r, 15710)), meta: { keepAlive: !0 } },
                  { path: "chat", component: () => Promise.all([r.e(736), r.e(64), r.e(737)]).then(r.bind(r, 37770)), meta: { keepAlive: !0 } },
                  { path: "receiver", component: () => Promise.all([r.e(736), r.e(64), r.e(604)]).then(r.bind(r, 6338)), meta: { keepAlive: !1 } },
                  { path: "remoteControl", component: () => Promise.all([r.e(736), r.e(64), r.e(456)]).then(r.bind(r, 71703)), meta: { keepAlive: !0 } },
                  { path: "shareFile", component: () => Promise.all([r.e(736), r.e(64), r.e(704)]).then(r.bind(r, 48555)), meta: { keepAlive: !1 } },
                  { path: "shareGroup/:groupId", name: "shareGroup", component: () => Promise.all([r.e(736), r.e(64), r.e(628)]).then(r.bind(r, 37217)), meta: { keepAlive: !1 } },
                  { path: "user", component: () => Promise.all([r.e(736), r.e(64), r.e(183)]).then(r.bind(r, 92951)) },
                  { path: "notification", component: () => Promise.all([r.e(736), r.e(64), r.e(595)]).then(r.bind(r, 11479)) },
                  { path: "advanceSetting", component: () => Promise.all([r.e(736), r.e(877)]).then(r.bind(r, 59877)) },
                  { path: "itest", component: () => Promise.all([r.e(736), r.e(299)]).then(r.bind(r, 38299)) },
                  { path: "scanner", component: () => Promise.all([r.e(736), r.e(405)]).then(r.bind(r, 5405)) },
                  { path: "forgetPassword", component: () => Promise.all([r.e(736), r.e(516)]).then(r.bind(r, 48516)) },
                  { path: "netDownloader", component: () => Promise.all([r.e(736), r.e(64), r.e(895)]).then(r.bind(r, 44369)), meta: { keepAlive: !0 } },
                  { path: "cloudTransfer", component: () => Promise.all([r.e(736), r.e(64), r.e(963)]).then(r.bind(r, 24990)) },
                  { path: "privacy", component: () => Promise.all([r.e(736), r.e(490)]).then(r.bind(r, 46490)) },
                  { path: "feedback", component: () => Promise.all([r.e(736), r.e(64), r.e(321)]).then(r.bind(r, 30114)) },
                  { path: "errorReport", component: () => Promise.all([r.e(736), r.e(686)]).then(r.bind(r, 30686)) },
                  { path: "searchGroup", component: () => Promise.all([r.e(736), r.e(64), r.e(381)]).then(r.bind(r, 84598)) },
                ],
              },
              { path: "/:catchAll(.*)*", component: () => Promise.all([r.e(736), r.e(940)]).then(r.bind(r, 55940)) },
            ],
            o = i;
        },
        37451: (e, t, r) => {
          "use strict";
          r.r(t), r.d(t, { default: () => ie, vuexStore: () => re });
          var i = {};
          r.r(i), r.d(i, { browserName: () => h, connected: () => f, connectedToServer: () => b, deviceName: () => A, enableShortCode: () => y, localPeer: () => p, notification: () => S, remotePeer: () => m, shortCode: () => w, uid: () => u, update: () => g, user: () => v, webRTCSupport: () => d });
          var o = {};
          r.r(o),
            r.d(o, {
              addConnected: () => R,
              addRemotePeer: () => D,
              removeConnected: () => B,
              removeRemotePeer: () => E,
              setBrowserName: () => C,
              setDeviceName: () => T,
              setEnableShortCode: () => N,
              setLocalPeer: () => I,
              setNotification: () => U,
              setShortCode: () => F,
              setUid: () => k,
              setWebRTCSupport: () => P,
              updateConnectedToServer: () => M,
              updateConnecteds: () => x,
              updateUser: () => O,
            });
          var n = {};
          r.r(n), r.d(n, { newLocalPeer: () => L, unreadNotification: () => q });
          var s = {};
          r.r(s), r.d(s, { chatHistory: () => Q, fileHistory: () => Y });
          var a = {};
          r.r(a), r.d(a, { addChat: () => Z, addFile: () => X, clearChatHistory: () => K, clearFileHistory: () => $, updateChatStatus: () => J });
          var l = r(10741);
          const c = { webRTCSupport: !0, browserName: "", uid: null, shortCode: "", localPeer: null, deviceName: "", remotePeer: [], connected: [], update: 0, enableShortCode: !0, user: { _id: "", username: "", userType: "", userState: "", isVip: !1 }, connectedToServer: !1, notification: 0 };
          function d(e) {
            return e.webRTCSupport;
          }
          function h(e) {
            return e.browserName;
          }
          function u(e) {
            return e.uid;
          }
          function p(e) {
            return e.localPeer;
          }
          function A(e) {
            return e.deviceName;
          }
          function m(e) {
            return e.remotePeer;
          }
          function f(e) {
            return e.connected;
          }
          function g(e) {
            return e.update;
          }
          function w(e) {
            return e.shortCode;
          }
          function y(e) {
            return e.enableShortCode;
          }
          function v(e) {
            return e.user;
          }
          function b(e) {
            return e.connectedToServer;
          }
          function S(e) {
            return e.notification;
          }
          r(65663);
          function P(e, t) {
            e.webRTCSupport = t;
          }
          function C(e, t) {
            e.browserName = t;
          }
          function k(e, t) {
            e.uid = t;
          }
          function I(e, t) {
            e.localPeer = t;
          }
          function T(e, t) {
            e.deviceName = t;
          }
          function D(e, t) {
            if (!t) return;
            const r = e.remotePeer;
            -1 === r.indexOf(t) && r.push(t);
          }
          function E(e, t) {
            const r = e.remotePeer,
              i = r.indexOf(t);
            -1 !== i && r.splice(i, 0);
          }
          function R(e, t) {
            if (!t) return;
            const r = e.connected;
            -1 === r.indexOf(t) && r.push(t), x(e);
          }
          function B(e, t) {
            const r = e.connected,
              i = r.indexOf(t);
            -1 !== i && (r.splice(i, 0), x(e));
          }
          function x(e) {
            e.update = e.update + 1;
          }
          function F(e, t) {
            e.shortCode = t || "";
          }
          function N(e, t) {
            e.enableShortCode = t || "";
          }
          function O(e, t) {
            e.user = t || null;
          }
          function M(e, t) {
            e.connectedToServer = t || !1;
          }
          function U(e, t) {
            e.notification = t || 0;
          }
          r(24124);
          var z = r(77597),
            H = r(26388);
          const _ = r(99349)("peer:actions");
          function L(e) {
            _("newLocalPeer");
            const t = e.state,
              r = (0, z.sq)();
            e.commit("setUid", r);
            const i = (0, z.$D)();
            i && e.commit("setLocalPeer", i);
            const o = (0, z.EP)();
            return i && e.commit("setShortCode", o), e.commit("setEnableShortCode", !!(0, z.hB)()), t.localPeer;
          }
          const W = "/api/notification/unread";
          async function q(e) {
            _("unreadNotification");
            const t = await H.axios.get(W);
            _("unreadNotification response.data:", t.data), e.commit("setNotification", t.data.data);
          }
          const V = { namespaced: !0, state: c, getters: i, mutations: o, actions: n };
          function j() {
            return { chatHistory: [], fileHistory: [] };
          }
          function Q(e) {
            return e.chatHistory;
          }
          function Y(e) {
            return e.fileHistory;
          }
          r(82031);
          const G = 50;
          function Z(e, t) {
            t && (t._id || (t._id = Math.random().toString().slice(-8)), t.status || (t.status = "success"), e.chatHistory.unshift(t), e.chatHistory.length > G && e.chatHistory.pop());
          }
          function J(e, { _id: t, status: r }) {
            const i = e.chatHistory.find((e) => e._id === t);
            i && (i.status = r);
          }
          function K(e, t) {
            e.chatHistory.splice(0, e.chatHistory.length);
          }
          function X(e, t) {
            t && e.fileHistory.push(t);
          }
          function $(e, t) {
            e.fileHistory.splice(0, e.fileHistory.length);
          }
          var ee = r(13152);
          const te = { namespaced: !0, state: j, getters: s, mutations: a, actions: ee };
          let re;
          function ie() {
            return (re = (0, l.MT)({ modules: { peer: V, service: te }, strict: !1 })), re;
          }
        },
        13152: () => {},
        87035: (e, t, r) => {
          "use strict";
          r.d(t, { FZ: () => d, Hj: () => l, YB: () => n, pX: () => h, vS: () => c });
          r(76701), r(65663), r(43610), r(10071);
          const i = r(24636),
            o = r(99349)("EventBus"),
            n = new i(),
            s = [];
          function a(e = "") {
            return (
              e +
              Math.random()
                .toString()
                .slice(-10 + e.length)
            );
          }
          function l(e, t = !1, r = "") {
            if (!e || "function" !== typeof e) throw new Error("invalid handler");
            let i = a(r);
            while (-1 !== s.indexOf(i)) i = a(r);
            return t ? n.once(i, e) : n.on(i, e), s.push(i), i;
          }
          function c(e) {
            if (!e) return;
            const t = s.indexOf(e);
            -1 !== t && (s.splice(t, 1), n.removeEvent(e));
          }
          function d(e, t = 3e3, r = null, i = "") {
            if (!e || "function" !== typeof e) throw new Error("invalid handler");
            let o = a(i);
            while (s.includes(o)) o = a(i);
            let l = setTimeout(() => {
              (l = null), c(o), r && "function" === typeof r && r(o);
            }, t);
            return (
              n.once(o, (...t) => {
                l && (clearTimeout(l), (l = null), e(...t));
              }),
              s.push(o),
              o
            );
          }
          function h(e, t, r = 3e3) {
            let i = setTimeout(() => {
              (i = null), n.off(e, t);
            }, r);
            n.once(e, (...e) => {
              i && (clearTimeout(i), (i = null), t(...e));
            });
          }
          o.enabled && (window.eventBus = n);
        },
        87352: (e, t, r) => {
          "use strict";
          r.d(t, { lv: () => A, mH: () => P });
          r(67280), r(64303), r(10017), r(7098), r(17070), r(43610), r(65663), r(92100), r(24124), r(76701), r(10071);
          var i = r(26017),
            o = r(78999),
            n = r(21118),
            s = r.n(n),
            a = r(87035),
            l = r(77597),
            c = r(73060),
            d = r(40019);
          const h = r(24636),
            u = r(99349)("peerChannel"),
            p = 4 * c.E,
            A = 122880,
            m = 20,
            f = 1048576,
            g = 1e4,
            w = ["AV1", "H264", "VP9"];
          function y(e, t) {
            return u("chunkString", e.length, t), e.match(new RegExp(".{1," + t + "}", "g"));
          }
          function v(e, t) {
            const r = w,
              i = e.getTransceivers();
            i.forEach((e) => {
              const t = e.sender.track.kind;
              let i = RTCRtpSender.getCapabilities(t).codecs;
              "video" === t && ((i = b(r)), e.setCodecPreferences(i));
            });
          }
          function b(e, t = []) {
            const r = e.map((e) => {
              const r = t.findIndex(e.mimeType);
              return { value: e, priority: r > -1 ? r : 10 };
            });
            return r.sort((e, t) => (e.priority === t.priority ? 0 : e.priority < t.priority ? -1 : 1)), r.map((e) => e.value);
          }
          function S(e) {
            const t = e.split("\r\n"),
              r = t.findIndex((e) => 0 === e.indexOf("m=application"));
            0 === t[r + 2].indexOf("b=") ? (t[r + 2] = "b=AS:" + f.toString()) : t.splice(r + 2, 0, "b=AS:" + f.toString());
            const i = t.findIndex((e) => 0 === e.indexOf("m=video"));
            if (i > -1) {
              const e = t[i].split(" "),
                r = e.slice(3),
                o = r.map((e) => ({ payload: e, codec: "", order: -1, levelId: "" })),
                n = t.length,
                s = "a=rtpmap:",
                a = "a=fmtp:",
                l = w.slice(0).reverse();
              for (let d = i; d < n; d++)
                if (t[d].startsWith(s)) {
                  const e = t[d].split(" "),
                    r = e[0].substring(s.length),
                    i = e[1].split("/")[0],
                    n = o.find((e) => e.payload === r);
                  if (n) {
                    n.codec = i;
                    const e = l.indexOf(i);
                    e > -1 && (n.order = 10 * e);
                  }
                } else if (t[d].startsWith(a)) {
                  const e = t[d].split(" "),
                    r = e[0].substring(a.length),
                    i = o.find((e) => e.payload === r);
                  if (e[1] && i) {
                    const t = e[1].split(";");
                    t.forEach((e) => {
                      e.includes("-id=") && (i.levelId = e.split("=")[1]);
                    });
                  }
                }
              o.sort((e, t) => (e.order > t.order ? -1 : e.order < t.order ? 1 : e.levelId > t.levelId ? -1 : e.levelId < t.levelId ? 1 : 0));
              const c = o.map((e) => e.payload);
              (t[i] = e.slice(0, 3).join(" ") + " " + c.join(" ")), u("video payloads after sort", t[i], o);
            }
            return (e = t.join("\r\n")), e;
          }
          class P extends h {
            constructor({ localPeer: e, remotePeer: t, serviceType: r, sync: i, order: o, initiator: n, remotePeerChannel: s, helperChannel: a, options: c = {} }) {
              super(),
                (this.localPeer = e || (0, l.$D)()),
                (this.remotePeer = t || ""),
                (this.serviceType = r || 0),
                (this.sync = i),
                (this.id = this.localPeer + "_" + this.remotePeer + "_" + this.serviceType + "_" + Math.random().toString().slice(-4)),
                (this.uid = Math.random().toString().slice(-8)),
                (this.remotePeerChannel = s || ""),
                (this.peer = null),
                (this.initiator = n),
                (this.working = !0),
                (this.connected = !1),
                (this.channelOptions = c || {}),
                (this.connectType = null),
                (this.rtt = 20),
                (this.natType = P.isSymmetricNat || "unsymmetric"),
                (this.addPredictCandidates = !1),
                (this.connectedCallback = null),
                (this.closeCallback = null),
                (this.dataCallback = null),
                (this.stream = null),
                (this.remoteStream = null);
              const d = 2e4;
              if (((this.autoClear = null), !this.initiator)) {
                const e = this;
                this.autoClear = setTimeout(() => {
                  (e.autoClear = null), e.peer.connected || e.destroy("unable to link");
                }, d);
              }
            }
            get bufferSize() {
              return this.peer ? this.peer.bufferSize + this.peer._writableState.length : -1;
            }
            get sendable() {
              return this.peer && this.peer.writable;
            }
            filterCandidate(e) {
              u("filterCandidate", e);
              const t = e.split("\r\n"),
                r = [];
              for (let i = 0; i < t.length; i++) /a=candidate:/.test(t[i]) || r.push(t[i]);
              return r.join("\r\n");
            }
            transformCandidate(e) {
              if (!e) return null;
              if (/candidate:[\S\s]+typ srflx raddr/.test(e)) {
                const t = [],
                  r = e.split(" "),
                  i = m;
                this.initiator, (r[5] = parseInt(r[5]) - 1);
                for (let e = 0; e < i; e++) (r[3] = parseInt(r[3]) - 10), (r[5] = parseInt(r[5]) + 1), (r[7] = "srflx"), t.push(r.join(" "));
                return t;
              }
            }
            createPeer({ serviceType: e, uid: t, clientId: r, initiator: n, remotePeer: c, options: h, connectedCallback: A, closeCallback: m, dataCallback: f }) {
              const g = this.serviceType === l.V9.data ? { ordered: !1, maxRetransmits: 2 } : { ordered: !0 };
              let w = l.Ch.iceServers;
              if (this.serviceType === l.V9.data) {
                const e = (0, l.tA)(c);
                e && "relay" === e.connectType && (w = (0, l.f2)());
              }
              const y = l.Ch.iceTransportPolicy || "all",
                b = new (s())({ config: { iceServers: w, iceTransportPolicy: y }, channelConfig: g, initiator: !!n, trickle: !0, channelName: this.id, highWaterMark: p, stream: !(!h || !h.stream) && h.stream, sdpTransform: S });
              b.on("error", (e) => {
                if ("ERR_PC_CONSTRUCTOR" === e.code) return u(" not support webRTC , please leave"), (0, l.yq)(!1), void o.t5.error(o.ag.t("not support this browser, you can try the latest chrome"));
                "ERR_DATA_CHANNEL" === e.code ? u("ERR_DATA_CHANNEL:", e) : (d.error("peerError", e), o.t5.error(o.ag.t("channel to {remoter} has error", { remoter: this.remotePeer })));
                const t = { localPeer: this.localPeer, remotePeer: this.remotePeer, serviceType: this.serviceType, initiator: this.initiator, uid: this.uid, id: this.id, message: e.message };
                this.emit("peerError", t), this.destroy(e);
              }),
                b.on("signal", (e) => {
                  if ((u("on signal", e), e.candidate)) {
                    if (P.isSymmetricNat && /candidate:[\S\s]+typ srflx raddr/.test(e.candidate.candidate)) {
                      const t = e.candidate.candidate.split(" ");
                      if (!this.addPredictCandidates && t[4] === P.isSymmetricNat.address) {
                        const t = this.transformCandidate(e.candidate.candidate),
                          r = [];
                        Array.isArray(t) &&
                          (t.forEach((t) => {
                            const o = (0, i.Z)(!0, {}, e);
                            (o.candidate.candidate = t), r.push(o);
                          }),
                          (this.addPredictCandidates = !0),
                          (e = r));
                      }
                    }
                    if (e && e.candidate && /candidate:[\S\s]+typ relay/.test(e.candidate.candidate)) {
                      const t = this;
                      return void setTimeout(() => {
                        this && (t.emit("peerSignal", e), a.YB.emit("peerSignal", e, t));
                      }, 1500);
                    }
                  }
                  this.emit("peerSignal", e), a.YB.emit("peerSignal", e, this);
                }),
                b.on("connect", () => {
                  u("peerchannel connect:", this.id), (this.connected = !0);
                  const e = () => {
                    this.emit("peerConnect"), a.YB.emit("peerConnect", this);
                  };
                  this.setConnectType(e), this.setRtt();
                }),
                b.on("close", () => {
                  if ((u("peerchannel close:", this), !(0, l.$I)())) return;
                  (this.connected = !1), (m = m || this.closeCallback), m && "function" === typeof m && m(this), this.emit("peerClose", this);
                  const e = { localPeer: this.localPeer, remotePeer: this.remotePeer, serviceType: this.serviceType, initiator: this.initiator, uid: this.uid, id: this.id };
                  a.YB.emit("peerClose", e), this.destroy();
                }),
                b.on("data", (e) => {
                  this.emit("peerData", e);
                  let t = {};
                  if (this.serviceType !== l.V9.data || "string" === typeof e) {
                    try {
                      if (((t = JSON.parse(e.toString())), (t.dataType = "string"), t.message && t.chunkedId)) {
                        const e = k(t);
                        if (!e) return;
                        t.message = e;
                      }
                    } catch (r) {
                      return void d.error("json parse error:", r, e);
                    }
                    a.YB.emit("peerData", t, this, null);
                  } else a.YB.emit("peerData", t, this, e);
                }),
                b.on("stream", (e) => {
                  u("peer get stream", e), (this.remoteStream = e);
                  const t = () => {
                    const t = e.getTracks().find((e) => !e.muted);
                    t ||
                      setTimeout(() => {
                        if (!e) return;
                        u("stream is removed--");
                        const t = e.getTracks().find((e) => !e.muted);
                        t ||
                          (e.getTracks().forEach((e) => {
                            e.stop(), e.dispatchEvent(new Event("ended"));
                          }),
                          e.dispatchEvent(new Event("removed")));
                      }, 3e3);
                  };
                  e.getTracks().forEach((e) => {
                    e.onmute = () => {
                      u("track onmute:", e), t();
                    };
                  }),
                    e.addEventListener("removetrack", () => {
                      u("on removetrack"), t();
                    }),
                    e.addEventListener("removed", () => {
                      u("stream is removed"), (this.remoteStream = null);
                    }),
                    this.emit("peerStream", e),
                    a.YB.emit("peerStream", e, this);
                }),
                b.on("drain", () => {
                  this.emit("drain");
                }),
                (b.peerChannel = this),
                b._pc && v(b._pc, this.serviceType),
                (this.peer = b);
            }
            signal(e) {
              this.peer &&
                (Array.isArray(e)
                  ? e.forEach((e) => {
                      this.peer.signal(JSON.stringify(e));
                    })
                  : ("string" !== typeof e && (e = JSON.stringify(e)), this.peer.signal(e)));
            }
            destroy(e) {
              (this.working = !1), this.peer && !this.peer.destroyed && this.peer.destroy(), this.emit("peerDestroy", e);
            }
            setConnectType(e) {
              this.peer.getStats((t, r) => {
                if (this.peer.destroyed) return;
                if (t) return void (r = []);
                const i = {},
                  o = {},
                  n = {};
                r.forEach((e) => {
                  ("remotecandidate" !== e.type && "remote-candidate" !== e.type) || (i[e.id] = e), ("localcandidate" !== e.type && "local-candidate" !== e.type) || (o[e.id] = e), ("candidatepair" !== e.type && "candidate-pair" !== e.type) || (n[e.id] = e);
                });
                const s = (e) => {
                  const t = o[e.localCandidateId],
                    r = i[e.remoteCandidateId];
                  this.connectType = "relay" === t.candidateType || "relay" === r.candidateType ? "relay" : t.candidateType;
                };
                r.forEach((e) => {
                  "transport" === e.type && e.selectedCandidatePairId && s(n[e.selectedCandidatePairId]), (("googCandidatePair" === e.type && "true" === e.googActiveConnection) || (("candidatepair" === e.type || "candidate-pair" === e.type) && e.selected)) && s(e);
                }),
                  e();
              });
            }
            async setRtt() {
              if (!this.peer || !this.connected) return;
              const e = await this.selectedCandidatePair();
              if (e && "number" === typeof e.currentRoundTripTime) (this.rtt = 1e3 * e.currentRoundTripTime), u("setRTT by selectedPair:", this.rtt);
              else {
                u("send sync fro rtt");
                const e = Date.now(),
                  t = this,
                  r = (0, a.Hj)((r, i, o) => {
                    const n = Date.now() - e;
                    u("get sync feedback, rtt:", n), (t.rtt = Math.round(n / 2));
                  }, !0),
                  i = { type: l.Nw.sync, message: "ping", localHandler: r };
                this.send({ message: i });
              }
            }
            async selectedCandidatePair() {
              return this.peer && this.connected
                ? new Promise((e) => {
                    this.peer.getStats((t, r) => {
                      if (t) return u("getStats error:", t), void e(null);
                      const i = r.find((e) => "transport" === e.type && e.selectedCandidatePairId);
                      if (i) {
                        const t = r.find((e) => e.id === i.selectedCandidatePairId);
                        return u("getRTT selectpaire:", t), void e(t);
                      }
                      e(null);
                    });
                  })
                : null;
            }
            send({ packet: e, message: t, chunk: r }) {
              if (this.peer && this.peer.connected) {
                if (!e) {
                  const { localHandler: i, remoteHandler: o, serviceType: n, intTag: s } = t && "object" === typeof t ? t : {};
                  if (((r = r || t.chunk), Object.keys(t).length > 0))
                    if (r) delete t.localHandler, delete t.remoteHandler, delete t.serviceType, delete t.intTag, delete t.localPeer, delete t.remotePeer, delete t.chunk, 0 === Object.keys(t).length && (t = null);
                    else if (((t.localPeer = (0, l.$D)()), t.message)) {
                      if ("string" !== typeof t.message) throw new Error("message.message must string");
                      if (t.message.length > A && this.sendMessageInChunkMode(t)) return;
                    }
                  r ? (e = (0, c.cv)({ localPeer: this.localPeer, localHandler: i, remotePeer: this.remotePeer, remoteHandler: o, serviceType: n, intTag: s, message: t, chunk: r })) : t && (e = "string" === typeof t ? t : JSON.stringify(t));
                }
                e && this.peer.send(e);
              } else o.t5.error(o.ag.t("p2p channel is not built"));
            }
            sendMessageInChunkMode(e) {
              const { localHandler: t, remoteHandler: r, serviceType: i, message: o } = e;
              if (!o) return !1;
              if (o.length < A) return !1;
              {
                e.messageLength = o.length;
                const n = y(o, A),
                  s = Math.random().toString().slice(-8);
                delete e.message;
                const a = n.map(
                    (o, n) => (Object.assign(e, { message: o, chunkedId: s, chunkedOffset: n }), i === l.V9.data ? (0, c.cv)({ localPeer: this.localPeer, localHandler: t, remotePeer: this.remotePeer, remoteHandler: r, serviceType: i, intTag: n, message: e, chunk: null }) : JSON.stringify(e))
                  ),
                  d = () => {
                    if (0 === a.length || !this.peer.connected) return;
                    const e = a.shift();
                    this.peer.write(e, () => {
                      d();
                    });
                  };
                return d(), !0;
              }
            }
            addStream(e) {
              if ((u("addstream---------------------", this.stream === e), this.stream)) {
                if (this.stream === e) return;
                u("remove oldStream"), this.peer.removeStream(this.stream);
              }
              this.peer.addStream(e), (this.stream = e);
              const t = () => {
                if (!this || !this.peer) return;
                const e = this.peer._pc.getSenders();
                e.forEach((e) => {
                  if (e.track && "video" === e.track.kind) {
                    const t = e.getParameters();
                    t.encodings || (t.encodings = [{}]),
                      t.encodings.forEach((e) => {
                        (e.maxFramerate = 30), (e.maxBitrate = 1e3 * g), (e.scaleResolutionDownBy = 1);
                      }),
                      e.setParameters(t),
                      u("set sender param:", e.getParameters());
                  }
                });
              };
              setTimeout(t, 500);
            }
            findSenderOfUsed(e) {
              const t = this.peer._senderMap.get(e);
              if (!t) return null;
              const r = t.get(this.stream);
              return r ? (r.removed ? (t.delete(this.stream), null) : r) : null;
            }
            updateStreamTrack(e, t) {
              if ((u("updateStreamTrack:", e, t), !this.stream)) return;
              const r = e && this.findSenderOfUsed(e),
                i = t && this.findSenderOfUsed(t);
              if (e && t) {
                if (!i) throw new Error("updateStreamTrack error, oldTrack is not working");
                this.peer.replaceTrack(t, e, this.stream);
              } else if (e) {
                if (r) return void u("newTrack is used now!!");
                this.peer.addTrack(e, this.stream);
              } else t && i && this.peer.removeTrack(t, this.stream);
            }
            removeStream() {
              if (this.stream) {
                try {
                  this.peer.removeStream(this.stream);
                } catch (e) {
                  u("removeStream error", e);
                }
                this.stream = null;
              }
            }
          }
          P.testNatSymmetric = () => {
            const e = [],
              t = function () {
                (e[0][4] === e[1][4] && e[0][5] === e[1][5]) || ((P.isSymmetricNat = { address: e[1][4], port: e[1][5] }), u("i am behind symmetric nat, %s:%d", P.isSymmetricNat.address, P.isSymmetricNat.port));
              },
              r = new (s())({ config: { iceServers: l.Ch.iceServers }, initiator: !0, trickle: !0, channelName: "test", highWaterMark: p, channelConfig: { ordered: !0 } });
            r.on("signal", (r) => {
              if (r.candidate && r.candidate.candidate && /candidate:[\S\s]+typ srflx raddr/.test(r.candidate.candidate)) {
                const i = r.candidate.candidate.split(" ");
                "srflx" === i[7] && -1 === i[4].indexOf(":") && (e.push(i), e.length >= 2 && t());
              }
            });
          };
          const C = new Map();
          function k(e) {
            u("mergeChunksOfMessage");
            let t = C.get(e.chunkedId),
              r = 0;
            if (t)
              (t.chunks[e.chunkedOffset] = e.message),
                t.chunks.forEach((e) => {
                  e && (r += e.length);
                });
            else {
              const i = [];
              (i[e.chunkedOffset] = e.message), (r = e.message.length), (t = { ...e, chunks: i }), delete t.message, delete t.chunkedOffset, C.set(e.chunkedId, t);
            }
            if (e.messageLength === r) {
              const e = t.chunks.join("");
              if ((u("totalMessage:", e.length), C.delete(t.chunkedId), e.length > 0)) return e;
              d.error("totalMessage is damaged");
            }
            return null;
          }
        },
        81007: (e, t, r) => {
          "use strict";
          r.d(t, { Z: () => i });
          r(65663);
          class i {
            constructor(e = {}) {
              (this.cache = []), (this.index = 0), (this.clearSize = e.clearSize || 100);
            }
            get length() {
              return this.cache.length - this.index;
            }
            get data() {
              return this.cache.slice(this.index);
            }
            push(e) {
              this.cache.push(e);
            }
            shift() {
              if (this.cache.length <= this.index) return;
              const e = this.cache[this.index];
              return this.index++, this.index >= this.clearSize && (this.cache.splice(0, this.index), (this.index = 0)), e;
            }
            unshift(e) {
              this.cache.splice(this.index, 0, e);
            }
          }
        },
        95761: (e, t, r) => {
          "use strict";
          r.d(t, { Qw: () => n, WF: () => a, hS: () => s, q4: () => o, z_: () => l });
          r(10071), r(67280), r(43610), r(65663);
          const i = r(99349)("RemoteIp.js"),
            o = new Map();
          function n(e, t) {
            if (!t || !t.candidate) return;
            if (((t = t.candidate), !t.candidate || !/candidate:[\S\s]+typ /.test(t.candidate))) return;
            let r = o.get(e);
            r || ((r = { internal: new Set(), external: new Set(), ipv6: new Set(), connect: "" }), o.set(e, r));
            const i = t.candidate.split(" ");
            i[4] && i[4].includes(":") ? r.ipv6.add(i[4]) : "srflx" === i[7] && "raddr" === i[8] && (i[9] && "0.0.0.0" !== i[9] && r.internal.add(i[9]), r.external.add(i[4]));
          }
          function s(e, t) {
            const r = o.get(e);
            if (!r) return null;
            r.connect = t;
          }
          function a(e) {
            const t = o.get(e);
            return t ? t.connect : null;
          }
          function l(e, t = { internal: !1, external: !1, ipv6: !1 }) {
            const r = [],
              n = o.get(e);
            if ((i("remoteIpMap:", n), !n)) return r;
            const { internal: s, external: a, ipv6: l } = t,
              c = (e) => {
                const t = n[e];
                t && t.forEach((e) => r.push(e));
              };
            return (
              s && c("internal"),
              a && c("external"),
              l && c("ipv6"),
              i("get all ips"),
              s ||
                a ||
                l ||
                ["internal", "external", "ipv6"].forEach((e) => {
                  c(e);
                }),
              r
            );
          }
        },
        11267: (e, t, r) => {
          "use strict";
          r.d(t, { k: () => n });
          const i = r(99349)("WebsocketWatcher"),
            o = () => {};
          class n {
            constructor(e) {
              (this.websocket = e.websocket),
                (this.interval = e.interval || 2e4),
                (this.maxRetries = e.retries || 5),
                (this.timeoutHandler = e.timeoutHandler || o),
                (this.pingMessage = e.ping || "ping"),
                (this._timer = null),
                (this._retryOrder = 0),
                (this._destroyed = !1),
                this.websocket && this.register();
            }
            register() {
              this.websocket.addEventListener("close", () => {
                this.destroy();
              }),
                this.websocket.addEventListener("open", () => {
                  this.resetTimer();
                }),
                this.websocket.addEventListener("message", () => {
                  this.resetTimer();
                });
            }
            resetTimer() {
              this._timer && ((this._retryOrder = 0), clearTimeout(this._timer)),
                (this._timer = setTimeout(() => {
                  this && ((this._timer = null), this._retryOrder++, this.websocket && this.websocket.readyState === WebSocket.OPEN && (this._retryOrder > this.maxRetries ? this.timeoutHandler() : (this.ping(), this.resetTimer())));
                }, this.interval));
            }
            ping() {
              try {
                this.websocket.send(this.pingMessage);
              } catch (e) {
                i("ping error:", e);
              }
            }
            destroy() {
              this._destroyed || (i("destroy"), (this.websocket = null), (this.timeoutHandler = null), this._timer && (clearTimeout(this._timer), (this._timer = null)), (this._destroyed = !0));
            }
          }
        },
        49922: (e, t, r) => {
          "use strict";
          r.d(t, { $5: () => d, Dy: () => h, ou: () => a, zp: () => l });
          r(24124);
          var i = r(12143),
            o = r(78999),
            n = r(41914),
            s = r(40019);
          function a(e) {
            const t = document.createElement("div");
            if (((t.innerHTML = e), window.capacitorAPI)) return void c(t.textContent);
            const r = new i.xf({ "text/html": new Blob([e], { type: "text/html" }), "text/plain": new Blob([t.textContent], { type: "text/plain" }) });
            i.cW([r])
              .then(() => {
                o.t5.success(o.ag.t("copied to clipboard"));
              })
              .catch(() => {
                o.t5.error(o.ag.t("copy error"));
              });
          }
          function l(e) {
            window.capacitorAPI
              ? c(e)
              : (0, n.Z)(e)
                  .then(() => {
                    o.t5.success(o.ag.t("copied to clipboard"));
                  })
                  .catch(() => {
                    o.t5.error(o.ag.t("copied to clipboard fail"));
                  });
          }
          function c(e) {
            try {
              window.capacitorAPI.clipboard.write({ string: e }), o.t5.success(o.ag.t("copied to clipboard"));
            } catch (t) {
              o.t5.error(o.ag.t("copy error"));
            }
          }
          async function d(e) {
            let t = "";
            try {
              if (window.capacitorAPI) {
                const e = await window.capacitorAPI.clipboard.read();
                t = e && e.value;
              } else {
                if (!navigator.clipboard || !navigator.clipboard.readText) return void o.t5.warning(o.ag.t("Not support this browser"));
                t = await navigator.clipboard.readText();
              }
            } catch (r) {
              s.error(r.name, r.message);
            }
            return t;
          }
          function h(e) {
            const t = window.navigator.share;
            t && t(e);
          }
        },
        88322: (e, t, r) => {
          "use strict";
          r.d(t, { V: () => l, q: () => a });
          r(24124);
          var i = r(77597),
            o = r(26388);
          const n = window.electronAPI ? window.electronAPI : null,
            s = "/api/analytics/visit";
          function a(e, { category: t, label: r, value: o }) {
            n ? window.electronAPI.client.trackEvent(t, e, r, o) : window.gtag && window.gtag("event", e || "click", { event_category: t, event_label: r || (0, i.$D)(), value: o || 1 });
          }
          async function l(e) {
            await o.axios.post(s, e);
          }
        },
        84206: (e, t, r) => {
          "use strict";
          r.d(t, { K4: () => l, OG: () => h, aL: () => u, tm: () => d });
          r(10071), r(65663);
          const i = r(99349)("cacheService.js"),
            o = 600,
            n = 2e3,
            s = 180,
            a = 86400,
            l = { thumbnail: "thumbnail" },
            c = new Map();
          class d {
            constructor(e) {
              (this.id = e.id || Math.random().toString().slice(-8)),
                (this.group = e.group || "default"),
                (this.peerId = e.peerId || ""),
                (this.duration = isNaN(e.duration) ? o : e.duration),
                (this.expired = 0 === this.duration ? Date.now() + 1e3 * a : Date.now() + 1e3 * this.duration),
                (this.etag = e.etag || ""),
                (this.content = e.content);
            }
          }
          function h(e) {
            c.has(e.group) || c.set(e.group, []);
            const t = c.get(e.group),
              r = t.findIndex((t) => t.id === e.id);
            r > -1 && t.splice(r, 1), t.push(e);
          }
          function u(e, t, r) {
            return c.has(e) && c.get(e).find((e) => (void 0 !== r ? e.id === t && e.etag === r : e.id === t));
          }
          function p() {
            const e = Date.now();
            for (const t of c.entries()) {
              const r = t[1].length;
              c.set(
                t[0],
                t[1].filter((t) => (r < n ? t.expired : t.expired - 1e3 * s) > e)
              );
            }
            setTimeout(p, 3e4);
          }
          setTimeout(p, 5e3), i.enabled && (window.CacheList = c);
        },
        12393: (e, t, r) => {
          "use strict";
          r.d(t, { CG: () => U, Jk: () => g, LR: () => f, US: () => v, dt: () => M, kO: () => O, lW: () => N, m$: () => D, nW: () => z, tF: () => y, wV: () => d.wV, z2: () => k });
          r(10071), r(76701), r(92100), r(65663), r(24124), r(60979);
          var i = r(78999),
            o = r(7097),
            n = r(87352),
            s = r(87035),
            a = r(77597),
            l = r(82703),
            c = r(95761),
            d = r(5676),
            h = r(84350),
            u = r(40019),
            p = r(14244)["Buffer"];
          const A = r(99349)("channel"),
            m = 80,
            f = new Map();
          s.YB.on("shortCodeBind", (e) => {
            e && "shortCodeBind" === e.type && f.set(e.shortCode, e.remotePeer);
          }).on("wsConnect", (e) => {
            C(e),
              e.addEventListener("message", (t) => {
                const r = t.data,
                  i = (0, o.SR)(r);
                if (i.payload)
                  if (i.plain) i.data = (0, o.SR)(i.payload);
                  else
                    try {
                      const e = (0, l.jW)(i.payload, (0, l.yf)(i.clientId));
                      i.data = (0, o.SR)(e) || void 0;
                    } catch (n) {
                      u.error("decrypto error:", n);
                    }
                switch (i.type) {
                  case o.w4.register:
                    if ((i.clientId && (A("get new clientId", i.clientId), (0, a.yr)(i.shortCode), (0, a.vK)(i.clientId)), i.config))
                      try {
                        let e = (0, l.jW)(i.config, (0, l.yf)(l._x));
                        (e = JSON.parse(e)), (0, a.A7)(e);
                      } catch (n) {
                        u.error("handleTransfer serverConfig error", n);
                      }
                    s.YB.emit("registered", e);
                    break;
                  case o.w4.transfer:
                    b(i);
                    break;
                  case o.w4.sync:
                    S(i);
                    break;
                  case o.w4.error:
                  case o.w4.fail:
                    P(i);
                    break;
                  case o.w4.fetch:
                    A("get signal type fetch");
                    break;
                  default:
                }
                i.callback && s.YB.emit(i.callback, i.data || {});
              });
          });
          const g = [],
            w = ({ id: e, uid: t, remotePeer: r, serviceType: i, peer: o, remotePeerChannel: n, working: s }) => {
              const a = { id: e, uid: t, remotePeer: r, serviceType: i, peer: o, remotePeerChannel: n, working: s };
              for (const c in a) void 0 === a[c] && delete a[c];
              let l = null;
              for (let c = 0; c < g.length; c++)
                if (g[c] && !0 === g[c].working) {
                  let e = !0;
                  for (const t in a)
                    if (void 0 !== g[c][t] && g[c][t] !== a[t]) {
                      e = !1;
                      break;
                    }
                  if (e) {
                    l = g[c];
                    break;
                  }
                }
              return l;
            };
          function y({ id: e, uid: t, remotePeer: r, serviceType: i, peer: o, working: n }) {
            const s = arguments[0] || {},
              a = Object.keys(s);
            return g.filter((e) => {
              const t = (t) => s[t] === e[t];
              return e.working && e.peer && e.peer.connected && a.every(t);
            });
          }
          function v(e) {
            const t = g.filter((t) => !t.peer.destroyed && (!e || e === t.remotePeer));
            t.forEach((t) => {
              t.destroy(new Error("destroy all channel:" + e));
            });
          }
          function b(e) {
            const t = (0, a.$D)();
            if (e.receiver === t) {
              const r = e.data || {},
                {
                  localPeer: o,
                  remotePeer: n,
                  serviceType: l,
                  initiator: d,
                  localHandler: h,
                  localPeerChannel: p,
                  remotePeerChannel: A,
                  options: m,
                } = { localPeer: t, remotePeer: e.clientId, serviceType: r.serviceType, initiator: !r.initiator, remoteHandler: r.localHandler, localHandler: r.remoteHandler, localPeerChannel: r.remotePeerChannel, remotePeerChannel: r.localPeerChannel, options: r.options };
              if ("setPeerData" === r.type) {
                if (h && s.YB.getListeners(h).length > 0) s.YB.emit(h, r);
                else {
                  let e = null;
                  if (p) e = w({ uid: p });
                  else if (((e = w({ remotePeer: n, remotePeerChannel: A })), !e)) {
                    e = D({ initiator: !1, remotePeer: n, serviceType: l, remotePeerChannel: A, options: m });
                    const t = (0, a.tA)(n);
                    if (!t || !t.connected) {
                      const e = i.t5.ongoing({ message: n + " " + i.ag.t("is linking to you"), timeout: 2e4 });
                      (0, i.hh)("linking_" + n, e, 2e4);
                    }
                  }
                  if (!e) return u.error("no peerChannel");
                  const t = r.data;
                  Array.isArray(t)
                    ? t.forEach((t) => {
                        (0, c.Qw)(n, t), e.peer.signal(JSON.stringify(t));
                      })
                    : ((0, c.Qw)(n, t), e.peer.signal(JSON.stringify(t)));
                }
                return;
              }
              if ("link" === r.type) {
                const e = r.signal || "apply";
                if ("apply" === e) {
                  const e = (0, a.h7)("linkConfirm");
                  if ((H({ remotePeer: n }), !e)) return void z({ initiator: d, clientId: o, remotePeer: n, serviceType: l, type: "link", signal: "agree", options: m });
                  i.Vq.create({ title: i.ag.t("Link apply"), message: r.message || n + i.ag.t("apply link to you"), ok: { label: i.ag.t("Agree") }, cancel: { label: i.ag.t("Reject") }, persistent: !0 })
                    .onOk(() => {
                      z({ initiator: d, clientId: o, remotePeer: n, serviceType: l, type: "link", signal: "agree", options: m });
                    })
                    .onCancel(() => {
                      z({ initiator: d, clientId: o, remotePeer: n, serviceType: l, type: "link", signal: "reject", options: m });
                    });
                } else
                  "agree" === e ? D({ serviceType: l, localPeer: o, remotePeer: n, initiator: !0, options: m }) : "reject" === e && i.Vq.create({ title: i.ag.t("Link apply"), message: r.message || n + i.ag.t("reject link to you"), ok: { label: i.ag.t("Close") }, persistent: !0 }).onOk(() => {});
                return;
              }
              h && s.YB.emit(h, r);
            }
          }
          function S(e) {
            A("handleSyncFromServer:", e);
          }
          function P(e) {
            const t = e.message;
            if ("string" === typeof t) {
              if ("4010" === t) {
                const r = (0, i.s0)("error:4010_" + e.receiver);
                if (r) return;
                (0, i.hh)("error:4010_" + e.receiver, () => {}, 4e3), (0, i.GZ)("linking_" + e.receiver), e.shortCode && (0, i.GZ)("linking_" + e.shortCode);
                const o = e.receiver ? ": " + e.receiver.slice(0, 4) + "..." : "";
                return void i.t5.error(i.ag.t("error: " + t) + o);
              }
              i.t5.error(i.ag.t("error: " + t));
            } else u.error("error:", t);
          }
          function C(e, t) {
            t &&
              "function" === typeof t &&
              (0, s.pX)(
                "registered",
                () => {
                  t();
                },
                5e3
              );
            const r = { type: o.w4.register, clientId: (0, a.$D)() || void 0, shortCode: (0, a.EP)() || void 0, uid: (0, a.sq)() || void 0, useShortCode: (0, a.hB)(), token: (0, a.LP)() || void 0 };
            (0, h.U5)(r), e.send((0, o.s6)(r));
          }
          function k(e) {
            const t = (0, a.sq)();
            if (!t) return void u.error(new Error("no uid"));
            const r = (0, d.wV)();
            r && r.readyState === WebSocket.OPEN && C(r, e);
          }
          function I(e) {
            const t = g.length;
            if (!e) return t > 5 * m;
            let r = 0;
            for (let i = 0; i < t; i++) g[i].remotePeer === e && r++;
            return r > m;
          }
          function T(e) {
            const t = (0, a.$D)();
            let r = new n.mH({ localPeer: t, remotePeer: e.remotePeer, serviceType: e.serviceType, initiator: !!e.initiator, working: !0, remotePeerChannel: e.remotePeerChannel, options: e.options });
            return (
              r.createPeer(arguments[0]),
              g.push(r),
              r.on("peerSignal", (i) => {
                if (!r) return;
                const n = (0, l.NV)({ type: "setPeerData", serviceType: e.serviceType, data: i, localPeerChannel: r.uid, remotePeerChannel: r.remotePeerChannel, options: e.options }, (0, l.yf)(t)),
                  s = { type: o.w4.transfer, clientId: t, receiver: e.remotePeer, payload: n };
                (0, d.Bb)(s);
              }),
              r.on("peerDestroy", () => {
                const e = g.indexOf(r);
                e >= 0 && g.splice(e, 1), (r = null);
              }),
              r
            );
          }
          function D({ serviceType: e, localPeer: t, remotePeer: r, initiator: i, remotePeerChannel: o, options: n }) {
            if (I(r)) return u.error("too many channels, something is error"), void s.YB.emit("error_exceed_channel_" + r);
            const a = T({ serviceType: e, localPeer: t, remotePeer: r, initiator: i, remotePeerChannel: o, options: n });
            return a;
          }
          const E = [];
          function R({ peerChannel: e }) {
            const t = E.findIndex((t) => t.peerChannel === e);
            t > -1 && E.splice(t, 1);
          }
          function B({ peerChannel: e, remotePeer: t, serviceType: r }) {
            if (t || r || e.peer.connected) {
              for (let i = 0; i < E.length; i++) if (E[i].peerChannel === e && E[i].remotePeer === t && E[i].serviceType === r) return;
              E.push({ peerChannel: e, remotePeer: t, serviceType: r });
            }
          }
          function x({ remotePeer: e, serviceType: t }) {
            let r = [];
            return t && e ? (r = E.filter((r) => r.serviceType === t && r.remotePeer === e)) : e && (r = E.filter((t) => t.remotePeer === e)), r;
          }
          async function F({ handler: e, remotePeer: t, serviceType: r, channelOptions: i }) {
            let o = null;
            const n = x({ handler: e, remotePeer: t, serviceType: r });
            if (n.length > 0)
              for (let s = 0; s < n.length; s++) {
                if (n[s].peerChannel && n[s].peerChannel.peer && n[s].peerChannel.working && n[s].peerChannel.peer.connected) {
                  o = n[s].peerChannel;
                  break;
                }
                R({ peerChannel: n[s].peerChannel });
              }
            if (!o) {
              const e = y({ serviceType: r, remotePeer: t });
              e.length > 0 ? ((o = e[0]), A("push peerChannel to cached:", o.uid), B({ peerChannel: o, remotePeer: t, serviceType: r })) : (o = null);
            }
            return o || (A("create new peerChannel"), (o = D({ initiator: !0, serviceType: r, localPeer: (0, a.$D)(), remotePeer: t, options: i }))), o;
          }
          async function N({ remotePeer: e, serviceType: t, handler: r, data: o, channelOptions: n }, s) {
            if (!e) throw new Error("no remotePeer");
            let a = null,
              l = null,
              c = null;
            if (
              (o instanceof ArrayBuffer || p.isBuffer(o)
                ? (a = o)
                : "string" === typeof o
                ? (l = { message: o, remotePeer: e, serviceType: t, localHandler: r })
                : o instanceof Object && !Array.isArray(o) && ((c = o.chunk), (l = { ...o, remotePeer: e, serviceType: t, localHandler: r || o.localHandler, chunk: void 0 })),
              a || l || c)
            )
              if (((s && s.peer && s.peer.connected) || (s = await F({ remotePeer: e, serviceType: t, handler: r, channelOptions: n })), s && s.peer && s.working)) {
                if (s.peer.connected) return s.send({ packet: a, message: l, chunk: c }), s;
                {
                  const e = async () =>
                    new Promise((e, t) => {
                      let r = window.setTimeout(() => {
                        r && ((r = null), t(new Error("timeout")));
                      }, 5e3);
                      s.once("peerConnect", () => {
                        r || t(new Error("timeout")), window.clearTimeout(r), (r = null), s.send({ data: a, message: l, chunk: c }), e(s);
                      });
                    });
                  try {
                    const t = await e();
                    return t;
                  } catch (d) {
                    A("waitingSend error:", d);
                  }
                }
              } else i.t5.error(i.ag.t("p2p channel is not built"));
            else A("have no data for send, data:", o);
          }
          async function O({ remotePeer: e, stream: t, serviceType: r, peerChannel: o, channelOptions: n }, s) {
            if (!e) throw new Error("no remotePeer");
            if (!t) throw new Error("no stream");
            (o && o.peer && o.peer.connected) || (o = await F({ remotePeer: e, serviceType: r, channelOptions: n })),
              o && o.peer && o.working
                ? o.peer.connected
                  ? (o.addStream(t), s && "function" === typeof s && s())
                  : o.once("peerConnect", () => {
                      o.addStream(t), s && "function" === typeof s && s();
                    })
                : i.t5.error(i.ag.t("p2p channel is not built"));
          }
          function M({ remotePeer: e, serviceType: t, newTrack: r, oldTrack: i }) {
            const o = y({ serviceType: t, remotePeer: e });
            o.forEach((e) => {
              e.stream && e.updateStreamTrack(r, i);
            });
          }
          function U({ remotePeer: e, serviceType: t }) {
            const r = y({ serviceType: t, remotePeer: e });
            r.forEach((e) => {
              e.removeStream();
            });
          }
          function z({ initiator: e, remotePeer: t, serviceType: r, type: i, signal: n, shortCode: s, options: c }) {
            A("sendLinkApply");
            const h = (0, a.$D)(),
              p = (0, l.NV)({ type: i, serviceType: r, signal: n, initiator: e, options: c }, (0, l.yf)(h)),
              m = (0, o.s6)({ type: o.w4.transfer, clientId: h, receiver: t, shortCode: s, payload: p });
            try {
              (0, d.Bb)(m);
            } catch (f) {
              u.error("sendLinkApply error:", f);
            }
          }
          function H({ remotePeer: e }) {
            if ((A("unLinkTo: %s", e), !e)) return;
            const t = g.filter((t) => t.remotePeer === e);
            t.forEach((e) => {
              e.destroy();
            });
          }
          A.enabled && (window.channelInfo = { peerChannels: g, register: k, cachedPeerChannel: E, getWsChannel: d.wV });
        },
        13895: (e, t, r) => {
          "use strict";
          r.d(t, { W9: () => s, lu: () => n });
          var i = r(77597),
            o = r(78999);
          function n(e, t = !0) {
            return i.l6.clientType !== e || (!!t && ("browser" === e ? o.t5.warning(o.ag.t("Only work in client")) : o.t5.warning(o.ag.t("Not work in {clientType}", { clientType: o.ag.t(e) })), !1));
          }
          function s() {
            return "webkitdirectory" in document.createElement("input");
          }
        },
        84350: (e, t, r) => {
          "use strict";
          r.d(t, { CZ: () => A, IP: () => l, J5: () => d, Or: () => w, Pq: () => c, R8: () => b, U5: () => u, VK: () => p, Wv: () => y, Xw: () => a, bh: () => h, hN: () => s, jE: () => k, ju: () => g });
          r(43610), r(92100), r(67280), r(65363), r(97768), r(64303), r(10017), r(10071), r(24124), r(17965), r(66016);
          var i = r(50965),
            o = r(40019);
          const n = r(99349)("common.js");
          function s(e, t = 1) {
            return e
              ? (e.startsWith("-") && ((t = -1), (e = e.slice(1))),
                (t = -1 === t ? -1 : 1),
                function (r, i) {
                  if (void 0 === r[e] || null === r[e]) return 0;
                  const o = 1 === t ? r : i,
                    n = 1 === t ? i : r,
                    s = "string" === typeof o[e] ? o[e].toLocaleLowerCase() : o[e],
                    a = "string" === typeof n[e] ? n[e].toLocaleLowerCase() : n[e];
                  return "string" === typeof s ? s.localeCompare(a) : s > a ? 1 : -1;
                })
              : () => 0;
          }
          function a(e, t, r) {
            return e.filter((e) => (r ? -1 === t.findIndex((t) => t[r] === e[r]) : !t.includes(e)));
          }
          function l() {
            const e = document.createElement("audio");
            (e.src = "downloadend.wav"), e.play();
          }
          function c(e, t) {
            if (!e) return !1;
            if (!t) return !0;
            const r = e.split(".").map((e) => parseInt(e)),
              i = t.split(".").map((e) => parseInt(e));
            for (let o = 0; o < r.length; o++) {
              const e = i[o] || 0;
              if (r[o] > e) return !0;
              if (r[o] < e) return !1;
            }
            return !1;
          }
          function d() {
            let e = window.location.origin;
            if (e.startsWith("file")) {
              const t = window.location.pathname || "";
              if (t.includes(".asar")) {
                const r = t.split(".asar");
                e = r[0] + ".asar";
              }
            }
            return e;
          }
          function h(e) {
            return (0, i.lookup)(e) || "";
          }
          function u(e) {
            Object.keys(e).forEach((t) => void 0 === e[t] && delete e[t]);
          }
          function p(e) {
            const t = e && e.split("/").pop();
            return t && t.replace(/#/g, "_");
          }
          function A(e) {
            const t = "string" === typeof e ? e.split(" ") : Array.isArray(e) ? e : [(e || "").toString()],
              r = t.filter((e) => e).map((e) => e.replaceAll(".", "\\."));
            return new RegExp(r.join(".*"), "i");
          }
          const m = [".apng", ".avif", ".gif", ".jpg", ".jpeg", ".jfif", ".pjpeg", ".pjp", ".png", ".svg", ".webp", ".bmp", ".ico", ".cur", ".tif", ".tiff"],
            f = [".mp4", ".avi"];
          function g(e, t) {
            return w(e, t) || y(e, t);
          }
          function w(e, t) {
            if (!t) return !1;
            const r = t.lastIndexOf("."),
              i = r > -1 ? t.slice(r) : "";
            return !(!i || !m.includes(i.toLowerCase()));
          }
          function y(e, t) {
            if (!t) return !1;
            const r = t.lastIndexOf("."),
              i = r > -1 ? t.slice(r) : "";
            return !(!i || !f.includes(i.toLowerCase()));
          }
          const v = new Map();
          function b(e, t = 96) {
            if (!e) return;
            const r = e instanceof File ? [e.name, e.size, e.lastModified || "", t].join("_") : e;
            let i = v.get(r);
            if (!i) {
              const o = e instanceof File ? y(e.type, e.name) : y(null, e);
              (i = o ? P(e, t, r) : S(e, t, r)), v.set(r, i);
            }
            return i;
          }
          function S(e, t = 96, r) {
            return new Promise((i, o) => {
              const n = (e) => {
                const n = new Image();
                (n.onload = () => {
                  const e = C(n, t);
                  v.delete(r), i(e);
                }),
                  (n.onerror = (e) => {
                    v.delete(r), o(e);
                  }),
                  (n.src = e);
              };
              if (e instanceof File) {
                const t = new FileReader();
                (t.onload = (e) => {
                  const t = e.target.result;
                  n(t);
                }),
                  t.readAsDataURL(e);
              } else n(e);
            });
          }
          function P(e, t = 96, r) {
            const i = Date.now();
            return new Promise((o, s) => {
              const a = e instanceof File ? URL.createObjectURL(e) : e,
                l = document.createElement("video");
              (l.muted = !0),
                l.addEventListener("canplay", () => {
                  setTimeout(() => {
                    const e = document.createElement("canvas");
                    l.videoWidth > l.videoHeight ? ((e.width = Math.min(t, l.videoWidth)), (e.height = (e.width * l.videoHeight) / l.videoWidth)) : ((e.height = Math.min(t, l.videoHeight)), (e.width = (e.height * l.videoWidth) / l.videoHeight));
                    const s = e.getContext("2d");
                    s.drawImage(l, 0, 0, l.videoWidth, l.videoHeight, 0, 0, e.width, e.height);
                    const a = e.toDataURL();
                    v.delete(r), n("getBase64OfThumbnail length, const time", a.length, Date.now() - i), o(a);
                  }, 1e3);
                }),
                l.addEventListener("error", (e) => {
                  v.delete(r), s(e);
                }),
                (l.src = a),
                l.play();
            });
          }
          function C(e, t = 96) {
            if (e && e instanceof Image)
              try {
                const r = Date.now(),
                  i = document.createElement("canvas");
                e.naturalWidth > e.naturalHeight ? ((i.width = Math.min(t, e.naturalWidth)), (i.height = (i.width * e.naturalHeight) / e.naturalWidth)) : ((i.height = Math.min(t, e.naturalHeight)), (i.width = (i.height * e.naturalWidth) / e.naturalHeight));
                const o = i.getContext("2d");
                o.drawImage(e, 0, 0, e.naturalWidth, e.naturalHeight, 0, 0, i.width, i.height);
                const s = i.toDataURL();
                return n("getBase64OfThumbnail length, const time", s.length, Date.now() - r), s;
              } catch (r) {
                o.error("getBase64OfThumbnail", r);
              }
          }
          function k(e) {
            return Math.floor(Math.random() * e);
          }
          n.enabled && (window.thumbnailPromises = v);
        },
        4585: (e, t, r) => {
          "use strict";
          r.d(t, { KB: () => c, KZ: () => n, Nw: () => o, V9: () => i, fN: () => l, j7: () => a, tP: () => s });
          const i = { sync: 0, message: 1, stream: 1, data: 2, video: 3, interaction: 4 },
            o = {
              sync: "sync",
              syncBack: "syncBack",
              link: "link",
              apply: "apply",
              reject: "reject",
              agree: "agree",
              setPeerData: "setPeerData",
              getPeerData: "getPeerData",
              download: "download",
              downloadReply: "downloadReply",
              pushUploadApply: "pushUploadApply",
              pushUploadForbid: "pushUploadForbid",
              file: "file",
              message: "message",
              clipboard: "clipboard",
              finish: "finish",
              complete: "complete",
              abort: "abort",
              pause: "pause",
              resume: "resume",
              fetch: "fetch",
              backPressure: "backPressure",
              fetchByHttp: "fetchByHttp",
              fetchByWebsocket: "fetchByWebsocket",
              completeByHttp: "completeByHttp",
              streamUsers: "streamUsers",
              request: "request",
              response: "response",
              requestDesktop: "requestDesktop",
            },
            n = { undefined: 2, group: 1, temp: 2, account: 9 },
            s = { temp: "temp", account: "account", group: "group" },
            a = ["chrome", "edge", "firefox", "safari", "samsung browser", "android browser", "mobile safari", "vivaldi"],
            l = { PREPARING: "preparing", WAITING: "waiting", PAUSE: "paused", WORKING: "working", ABORT: "abort", COMPLETE: "complete", SAVING: "saving", EXIST: "exist", IGNORE: "ignore" },
            c = "localhost";
        },
        82703: (e, t, r) => {
          "use strict";
          r.d(t, { NV: () => n, Xx: () => l, _x: () => o, jW: () => s, yf: () => a });
          r(92100);
          const i = r(41849),
            o = "link.pplink";
          function n(e, t) {
            if (!e || !t) return "";
            let r = e;
            return "string" !== typeof r && (r = JSON.stringify(e)), i.AES.encrypt(r, t, { mode: i.mode.ECB, padding: i.pad.Pkcs7 }).toString();
          }
          function s(e, t) {
            return e && t ? i.AES.decrypt(e, t, { mode: i.mode.ECB, padding: i.pad.Pkcs7 }).toString(i.enc.Utf8) : "";
          }
          function a(e) {
            const t = ".link.pplink";
            return e && "string" === typeof e ? e.slice(0, 6) + t : t;
          }
          function l(e, t) {
            return n(e, a(`.${t}.`));
          }
        },
        10229: (e, t, r) => {
          "use strict";
          r.d(t, { x0: () => l });
          r(65663), r(17070), r(10107);
          var i = r(40019);
          const o = r(99349)("errorManager.js"),
            n = 200,
            s = [];
          function a(e) {
            s.push({ time: Date.now(), error: e }), s.length > n && s.shift();
          }
          function l() {
            return s.slice(0).reverse();
          }
          const c = i.error;
          o("overwrite console error"),
            (i.error = function (...e) {
              c.apply(i, arguments);
              const t = e.reduce((e, t) => e + " : " + (t || "").toString(), "");
              a(t);
            }),
            (window.getAllErrorHistory = l);
        },
        64776: (e, t, r) => {
          "use strict";
          r.d(t, { F: () => n });
          r(24124), r(76701), r(40019);
          const i = r(63559),
            o = (r(99349)("FileMd5.js"), "pplink.link");
          function n(e, t = o) {
            const r = new i();
            return r.append(e), r.append(t), r.end();
          }
        },
        28144: (e, t, r) => {
          "use strict";
          r.d(t, { y: () => s });
          r(10071), r(24124), r(65663);
          const i = r(24636),
            o = r(99349)("indexedDBUtil.js"),
            n = new Map();
          class s extends i {
            constructor(e) {
              super(),
                (this.dbName = e.dbName || "localDB"),
                (this.version = e.version || null),
                (this.upgrade = e.upgrade || null),
                (this.objectStore = e.objectStore || null),
                (this.db = null),
                (this.open = !1),
                this.openDB(this.dbName, this.upgrade, this.version)
                  .then((e) => {
                    this.emit("open");
                  })
                  .catch((e) => {
                    o("newDB error:", e), this.emit("error", e);
                  });
            }
            openDB(e, t, r) {
              return new Promise((i, n) => {
                const s = r ? window.indexedDB.open(e, r) : window.indexedDB.open(e);
                (s.onerror = (t) => {
                  o("indexedDB open error:", t, e), (this.open = !1), n(t.target.error);
                }),
                  (s.onsuccess = (e) => {
                    const t = (this.db = s.result);
                    (this.version = this.db.version), (this.open = !0), o("onsuccess", "indexedDB open success"), i(t);
                  }),
                  (s.onupgradeneeded = (e) => {
                    o("onupgradeneeded", e), (this.db = e.target.result), t && t(this.db, e.target.transaction);
                  });
              });
            }
            closeDB() {
              this.db.close(), (this.open = !1);
            }
            createStore(e, t = [], r = { keyPath: "id", autoIncrement: !0 }) {
              if ((o("createStore:", e), !e)) return;
              let i;
              this.db.objectStoreNames.contains(e) ||
                ((i = this.db.createObjectStore(e, r)),
                t.forEach((e) => {
                  i.createIndex(e.path, e.keyPath, e.options);
                }));
            }
            deleteStore(e) {
              o("deleteStore:", e), e && this.db.objectStoreNames.contains(e) && this.db.deleteObjectStore(e);
            }
            addRecord(e, t) {
              return new Promise((r, i) => {
                const n = this.db.transaction([e], "readwrite").objectStore(e).add(t);
                (n.onsuccess = function (e) {
                  r();
                }),
                  (n.onerror = function (r) {
                    o("indexedDB addRecord error: write failed,", e, t), i(r.target.error);
                  });
              });
            }
            addBulkRecords(e, t) {
              return new Promise((r, i) => {
                const n = this.db.transaction([e], "readwrite");
                (n.oncomplete = function (e) {
                  r();
                }),
                  (n.onerror = function (r) {
                    o("indexedDB addBulkRecords error: write failed", e, t), i(r.target.error);
                  });
                const s = n.objectStore(e);
                Array.isArray(t) &&
                  t.forEach((e) => {
                    s.add(e);
                  });
              });
            }
            getRecordCountByIndex(e, t, r) {
              return new Promise((i, n) => {
                const s = this.db.transaction([e]),
                  a = s.objectStore(e),
                  l = a.index(t),
                  c = l.count(r);
                (c.onerror = function (i) {
                  o(" indexedDB getRecordCountByIndex error:", e, t, r), n(i.target.error);
                }),
                  (c.onsuccess = function (n) {
                    n.target.result ? i(n.target.result) : (o(" indexedDB getRecordCountByIndex no result:", e, t, r), i(null));
                  });
              });
            }
            readOneRecordByIndex(e, t, r) {
              return new Promise((i, n) => {
                const s = this.db.transaction([e]),
                  a = s.objectStore(e),
                  l = a.index(t),
                  c = l.get(r);
                (c.onerror = function (i) {
                  o(" indexedDB readOneRecordByIndex error:", e, t, r), n(i.target.error);
                }),
                  (c.onsuccess = function (n) {
                    n.target.result ? i(n.target.result) : (o(" indexedDB readOneRecordByIndex no result:", e, t, r), i(null));
                  });
              });
            }
            readAllRecord(e, t = (e) => {}, r = !0) {
              return new Promise((i, n) => {
                const s = this.db.transaction([e]),
                  a = s.objectStore(e),
                  l = a.openCursor(),
                  c = [];
                (l.onsuccess = function (e) {
                  const o = e.target.result;
                  o ? (r && c.push(o.value), t(o.value, o), o.continue()) : i(c);
                }),
                  (l.onerror = function (t) {
                    o("indexedDB readAllRecord error:", e), n(t.target.error);
                  });
              });
            }
            readRecordsByIndexCursor(e, t, r, i = (e) => {}, n = "next", s = 0, a = 0) {
              return new Promise((l, c) => {
                const d = this.db.transaction([e]),
                  h = d.objectStore(e),
                  u = h.index(t),
                  p = u.openCursor(r, n),
                  A = [];
                let m = !a;
                (p.onsuccess = function (e) {
                  const t = e.target.result;
                  if (t) {
                    if (!m) return (m = !0), void t.advance(a);
                    if ((A.push(t.value), i(t.value, t), s && A.length >= s)) return void l(A);
                    t.continue();
                  } else l(A);
                }),
                  (p.onerror = function (i) {
                    o("indexedDB readRecordsByIndexCursor error:", e, t, r), c(i.target.error);
                  });
              });
            }
            updateRecord(e, t) {
              return new Promise((r, i) => {
                const n = this.db.transaction([e], "readwrite").objectStore(e).put(t);
                (n.onsuccess = function (e) {
                  r();
                }),
                  (n.onerror = function (r) {
                    o("indexedDB updateRecord error:", e, t), i(r.target.error);
                  });
              });
            }
            deleteRecord(e, t) {
              return new Promise((r, i) => {
                const n = this.db.transaction([e], "readwrite").objectStore(e).delete(t);
                (n.onsuccess = function (e) {
                  r();
                }),
                  (n.onerror = function (r) {
                    o("indexedDB deleteRecord error:", e, t), i(r.target.error);
                  });
              });
            }
            deleteRecordsByIndex(e, t, r) {
              return new Promise((i, n) => {
                const s = this.db.transaction([e], "readwrite").objectStore(e),
                  a = s.index(t).openCursor(r);
                (a.onsuccess = function (e) {
                  const t = e.target.result;
                  t ? (s.delete(t.primaryKey), t.continue()) : i();
                }),
                  (a.onerror = function (i) {
                    o("indexedDB deleteRecordsByIndex error:", e, t, r), n(i.target.error);
                  });
              });
            }
            clear(e) {
              return new Promise((t, r) => {
                const i = this.db.transaction([e], "readwrite").objectStore(e).clear();
                (i.onsuccess = function (e) {
                  t();
                }),
                  (i.onerror = function (t) {
                    o("indexedDB clear error:", e), r(t.target.error);
                  });
              });
            }
            count(e, t) {
              return this.db.transaction([e], "readwrite").objectStore(e).count(t);
            }
            close() {
              this.db && (this.db.close(), (this.db = null), n.has(this.dbName) && n.delete(this.dbName), this.emit("close"));
            }
          }
          s.getDBByName = function (e) {
            return new Promise((t, r) => {
              if (n.has(e.dbName)) return void t(n.get(e.dbName));
              const i = new s(e);
              i.on("open", () => {
                n.set(e.dbName, i), t(i);
              }),
                i.on("error", (e) => {
                  r(e.target.error);
                });
            });
          };
        },
        73060: (e, t, r) => {
          "use strict";
          r.d(t, { $y: () => p, E: () => a, Jx: () => A, Ql: () => P, Vl: () => d, W6: () => m, Wt: () => f, cv: () => u, jk: () => c, rr: () => g });
          r(65663), r(92100), r(67280), r(65363), r(97768), r(76701);
          var i = r(14244),
            o = r(88424),
            n = r(40019);
          const s = r(99349)("messageUtil.js");
          i.Buffer.poolSize = 260128;
          const a = 65536,
            l = 174,
            c = a + l;
          function d(e) {
            const t = [],
              r = i.Buffer.byteLength(e),
              o = Math.ceil(r / a);
            if (i.Buffer.byteLength(e) > 0)
              for (let i = 0; i < o; i++) {
                const n = i * a;
                let s = a;
                i === o - 1 && r % a !== 0 && (s = r % a), t.push(e.subarray(n, n + s));
              }
            return t;
          }
          function h(e, t) {
            const r = void 0 !== t ? t : 2;
            return e.writeInt16BE(r, 164), e;
          }
          function u({ localPeer: e, localHandler: t, remotePeer: r, remoteHandler: o, serviceType: n, intTag: a, message: c, chunk: d }) {
            if (!c && !d) return;
            let u = null,
              p = 0;
            if (c) {
              const e = "string" === typeof c ? c : JSON.stringify(c);
              (u = i.Buffer.from(e)), (p = u.byteLength);
            }
            d && !i.Buffer.isBuffer(d) && (s("chunk is not buffer, type:", Object.prototype.toString.call(d)), (d = i.Buffer.from(d)));
            const A = l + p + (d ? d.byteLength : 0),
              m = S(A);
            return m.write(e, 0, 64), t && m.write(t, 64, 16), m.write(r, 80, 64), o && m.write(o, 144, 16), h(m, n), m.writeInt32BE(A, 160), void 0 !== a && m.writeInt32BE(a, 166), u && (m.writeInt32BE(p, 170), m.set(u, l)), d && m.set(d, l + p), m;
          }
          function p(e, t, r) {
            return e.toString(null, t, t + r).replaceAll("\0", "");
          }
          function A(e) {
            if (!i.Buffer.isBuffer(e)) return s("decode not buffer:", e), null;
            if (123 === e.readUInt8(0)) {
              const t = e.toString();
              return s("string buffer:", t), JSON.parse(t);
            }
            const t = e.readUInt32BE(160);
            if (t !== e.length) throw new Error("transfer data error");
            const r = p(e, 0, 64),
              o = p(e, 64, 16),
              a = p(e, 80, 64),
              c = p(e, 144, 16),
              d = e.readUInt16BE(164),
              h = e.readUInt32BE(166),
              u = e.readUInt32BE(170),
              A = { localPeer: r, localHandler: o, remotePeer: a, remoteHandler: c, serviceType: d, intTag: h };
            if (u > 0) {
              const t = p(e, l, u);
              try {
                const e = JSON.parse(t);
                Object.assign(A, e);
              } catch (m) {
                throw (n.error("error in message json"), new Error("message json error"));
              }
            }
            return l + u < e.length && (A.chunk = e.subarray(l + u, e.byteLength)), A;
          }
          function m(e) {
            return e.readUInt32BE(166);
          }
          function f(e) {
            return o.ZP.deflateRaw(e);
          }
          function g(e) {
            return o.ZP.inflateRaw(e);
          }
          const w = [],
            y = 6e5,
            v = 6e5,
            b = i.Buffer.alloc(l);
          function S(e) {
            if (e !== c) return i.Buffer.alloc(e);
            let t = w.find((e) => !e.used);
            return t ? ((t.used = !0), (t.latest = Date.now()), t.buffer.set(b, 0)) : ((t = { latest: Date.now(), used: !0, buffer: i.Buffer.alloc(e) }), w.push(t)), t.buffer;
          }
          function P(e) {
            const t = w.find((t) => t.buffer === e);
            t && (t.used = !1);
          }
          function C() {
            return w.findIndex((e) => Date.now() - e.latest > v);
          }
          function k() {
            let e = C();
            while (e > -1) w.splice(e, 1), (e = C());
            setTimeout(k, y);
          }
          k(), s.enabled && (window.bufferUtil = i.Buffer);
        },
        95911: (e, t, r) => {
          "use strict";
          r.d(t, { DQ: () => R, FS: () => B, Hj: () => l.Hj, IC: () => U, If: () => C, J3: () => T, SG: () => F, Tb: () => N, W0: () => P, e0: () => z, fH: () => O, fT: () => M, mI: () => S, of: () => k, tC: () => I, vS: () => l.vS, xd: () => H });
          r(10071), r(43610), r(24124), r(76701), r(37902), r(92100);
          var i = r(26017),
            o = r(77597),
            n = r(87352),
            s = r(73060),
            a = r(12393),
            l = r(87035),
            c = r(78999),
            d = r(7097),
            h = r(82703),
            u = r(88322),
            p = (r(12144), r(95761)),
            A = r(5676),
            m = r(4585),
            f = r(58703),
            g = r(40019);
          const w = r(99349)("session");
          function y(e) {
            const t = (0, c.s0)("linking_" + e);
            return !!t && ((0, c.GZ)("linking_" + e), c.t5.success(c.ag.t("channel to {remoter} connected", { remoter: e })), !0);
          }
          function v(e) {
            w("updateConnected", e);
            let t = (0, o.tA)(e.clientId);
            if (t) {
              if (void 0 !== e.connected && t.connected !== e.connected) {
                const r = "State changed";
                l.YB.emit("remote_new_state", t.clientId, r), e.connected && (t.connectedTime = Date.now());
              }
              void 0 !== e.files && (0, f.dI)(t.clientId, e.files),
                e.userName && o.l6.username === e.userName ? (e.scope = o.tP.account) : e.scope && (D(t, e.scope), delete e.scope),
                Object.keys(e).forEach((r) => {
                  t[r] = e[r];
                }),
                e.hasStream && l.YB.emit("remote_new_stream", t.clientId),
                (t.updated = new Date()),
                e.ua || t.setConnectedPeerType();
            } else {
              e.userName && o.l6.username === e.userName && (e.scope = o.tP.account), (t = (0, o.Zk)(e));
              const r = "State changed";
              if ((l.YB.emit("remote_new_state", e.clientId, r), void 0 !== e.files && e.files.length > 0)) {
                const t = "Files changed";
                l.YB.emit("remote_new_files", e.clientId, t);
              }
            }
            e.localServer && t.setLocalServerUrl();
          }
          function b(e, t) {
            if (e.payload && e.localPeer) {
              const t = (0, i.Z)(!0, {}, e),
                r = { clientId: t.localPeer, ...t.payload };
              v(r);
            }
            const r = t.remotePeer;
            if (e.localHandler && r) {
              const i = { type: o.Nw.syncBack, remoteHandler: e.localHandler, message: "pong" };
              U(r, i, t);
            }
          }
          function S(e, t = null, r = null) {
            const i = { type: o.Nw.sync, payload: e };
            if ((w("syncToRemote message:", i, t), t)) U(t, i, r);
            else {
              const e = (0, o._C)();
              e.forEach((e) => {
                e.connected && U(e.clientId, i, r);
              });
            }
          }
          async function P(e, t = null, r = {}) {
            if (e === m.KB || e === o.l6.getPeerId()) throw new Error("invalid remotePeer");
            const i = (0, o.tA)(e, t);
            return i && i.connected
              ? i
              : await new Promise((i, n) => {
                  k({ remotePeer: e, shortCode: t, options: r });
                  const s = "linked_" + e,
                    a = () => {
                      const r = (0, o.tA)(e, t);
                      i(r);
                    };
                  l.YB.once(s, a),
                    setTimeout(() => {
                      l.YB.removeListener(s, a), n(new Error("timeout"));
                    }, 5e3);
                });
          }
          async function C(e) {
            if (!e) return;
            const t = { scope: e.scope };
            return await P(e.clientId, null, t), l.YB.emit("reconnect_" + e.clientId), e;
          }
          function k({ remotePeer: e, serviceType: t, shortCode: r, options: i = {} }) {
            if (!e && !r) return;
            if (!(0, o.$I)()) return void c.t5.warning(c.ag.t("not support this browser, you can try the latest chrome"));
            i.scope || (i.scope = o.tP.temp), w("linkApply remotePeer, shortCode, options", e, r, i);
            const n = (0, o.tA)(e, r);
            if (n && n.connected) return void (i.scope !== n.scope && D(n, i.scope));
            const s = "linking_" + (e || r),
              l = (0, c.s0)(s);
            if (l) return;
            const d = { remotePeer: e, shortCode: r, serviceType: t || o.V9.message, initiator: !0, type: "link", signal: "apply", options: i };
            (0, a.nW)(d);
            const h = c.t5.ongoing({ message: c.ag.t("is linking to") + " " + (e || r) + " ...", timeout: 1e4 });
            (0, c.hh)(s, h, 8e3);
          }
          function I(e) {
            if (!e) return;
            const t = a.Jk.filter((t) => t.remotePeer === e);
            t.forEach((e) => {
              e.destroy();
            });
          }
          function T(e) {
            if (!e) return;
            const t = (0, o.tA)(e);
            if (!t.connected) return (0, o.W8)({ clientId: e });
            (0, l.pX)(
              "unLinked_" + e,
              () => {
                (0, o.W8)({ clientId: e });
              },
              5e3
            ),
              I(e);
          }
          function D(e, t) {
            m.KZ[e.scope] >= m.KZ[t] || (w("update scope", t, m.KZ[t]), (e.scope = t || o.tP.temp), S({ scope: t }, e.clientId));
          }
          function E(e) {
            const t = (0, h.NV)(
                {
                  type: "peerChannel",
                  data: {
                    uid: (0, o.sq)(),
                    initiator: e.initiator,
                    connectType: e.connectType,
                    natType: e.natType,
                    remoteAddress: e.peer.remoteAddress,
                    remotePort: e.peer.remotePort,
                    localAddress: e.peer.localAddress,
                    localFamily: e.peer.localFamily,
                    localPort: e.peer.localPort,
                    ua: navigator.userAgent,
                    rtt: e.rtt,
                  },
                  localPeerChannel: e.uid,
                  remotePeerChannel: e.remotePeerChannel,
                },
                (0, h.yf)(e.localPeer)
              ),
              r = { type: d.w4.statistics, clientId: e.localPeer, receiver: e.remotePeer, payload: t };
            (0, A.Bb)(r, !1);
          }
          function R(e) {
            const t = (0, h.NV)({ type: "useShortCode", useShortCode: e }, (0, h.yf)((0, o.$D)())),
              r = { type: d.w4.sync, clientId: (0, o.$D)(), payload: t };
            (0, A.iR)(r);
          }
          async function B() {
            if (!o.l6.username) return;
            const e = (await x()) || [];
            w("linkToMyPeers peers:", e);
            const t = (0, o.$D)(),
              r = async (e) => {
                const t = await P(e);
                return t && t.scope !== o.tP.account && D(t, o.tP.account), t;
              },
              i = e.filter((e) => e !== t).map((e) => r(e));
            return await Promise.allSettled(i);
          }
          async function x() {
            const e = { type: d.w4.sync, payload: { type: "groupInfo", value: "0", summary: !0 } };
            try {
              const t = await O(e, !1);
              if (t.peers && Array.isArray(t.peers)) return t.peers;
            } catch (t) {
              w("getMyPeersOfOnline error:", t);
            }
            return [];
          }
          function F(e) {
            w("syncGroup:", e);
            const t = { type: "token", value: e || "" },
              r = (0, d.s6)(t),
              i = { type: d.w4.sync, clientId: o.l6.peerId, plain: !0, payload: r };
            (0, A.iR)(i)
              .then((e) => {})
              .catch((e) => {
                w("syncGroup error:", e);
              });
          }
          function N() {
            const e = (0, o.ao)().filter((e) => e.connected && "account" === e.scope),
              t = { remoteHandler: "get-user-info" };
            e.forEach((e) => {
              w("notify same account to fresh user"), e.connected && U(e.clientId, t);
            });
          }
          async function O(e, t = !0) {
            if (!e.type) throw new Error("NO MESSAGE TYPE");
            return t && e.payload ? (e.payload = (0, h.NV)(e.payload, (0, h.yf)((0, o.$D)()))) : e.payload && ((e.payload = JSON.stringify(e.payload)), (e.plain = !0)), await (0, A.iR)(e);
          }
          function M(e, t = !0, r = !0) {
            if (!e.type) throw new Error("NO MESSAGE TYPE");
            t && e.payload ? (e.payload = (0, h.NV)(e.payload, (0, h.yf)((0, o.$D)()))) : e.payload && ((e.payload = JSON.stringify(e.payload)), (e.plain = !0)), (0, A.Bb)(e, r);
          }
          async function U(e, t, r) {
            if (!e || e === (0, o.$D)() || !t) return void w("less params:", e, (0, o.$D)(), t);
            const i = await (0, a.lW)({ remotePeer: e, serviceType: o.V9.message, data: t }, r);
            return i;
          }
          async function z(e, t, r = {}, i = null, o = 7e3) {
            return new Promise((n, s) => {
              const a = (0, l.FZ)(
                  (e, t) => {
                    w("peer request response", e);
                    try {
                      if (1 === e.requestVersion) {
                        const t = e.message || e.payload;
                        200 === e.status ? n({ data: t, response: e }) : (g.error(new Error("peerRequest error " + e.status)), s(new Error(t || "error:" + e.status)));
                      } else n(e);
                    } catch (r) {
                      s(new Error(c.ag.t(r.message)));
                    }
                  },
                  o,
                  () => {
                    s(new Error("timeout"));
                  }
                ),
                d = { remoteHandler: t, localHandler: a, requestVersion: 1 };
              "string" === typeof r ? (d.message = r) : (d.payload = r), w("peerRequest:", d), U(e, d, i);
            });
          }
          function H(e = 200, t = {}, r, i = null) {
            const { localPeer: o, remoteHandler: n, localHandler: s } = r;
            if (!o || !s) throw new Error("invalid response");
            const a = { remoteHandler: s, localHandler: n, requestVersion: 1, status: e };
            "string" === typeof t ? (a.message = t) : (a.payload = t), U(o, a, i);
          }
          window.addEventListener("message", (e) => {
            const t = e.data,
              r = t.callback;
            r && (w("window get message with handler:", t), l.YB.getListeners(r).length > 0 && l.YB.emit(r, t), w("no found handler:", t));
          }),
            l.YB.on("registered", (e) => {
              w("registered handle"), e.url !== o.Ch.wssServer ? (0, a.z2)() : (l.YB.emit("get-user-info"), n.mH.testNatSymmetric());
            }).on("login", () => {
              B();
            }),
            l.YB.on("linked_remote", (e, t) => {
              w("linked_remote", e);
              let r = y(e);
              if (!r) {
                let e;
                for (const [r, i] of a.LR)
                  if (i === t.remotePeer) {
                    e = r;
                    break;
                  }
                e && (r = y(e));
              }
              const i = t.peer.remoteAddress && !t.peer.remoteAddress.includes(".local") ? t.peer.remoteAddress : "",
                s = t.peer.localAddress && !t.peer.localAddress.includes(".local") ? t.peer.localAddress : "";
              v({ clientId: t.remotePeer, connectType: t.connectType, scope: t.channelOptions && t.channelOptions.scope, connected: !0, address: i, localAddress: s }), i && (0, p.hS)(t.remotePeer, i);
              let l = 3,
                c = !1;
              const d = async () => {
                if (c || l <= 0) return;
                l--, w("send localInfo");
                const e = { version: o.l6.version, clientId: o.l6.peerId, clientName: (0, o.Me)(), userName: o.l6.username, shortCode: o.l6.shortCode, clientType: o.l6.clientType, natType: n.mH.isSymmetricNat, ua: o.S3.ua },
                  r = { type: o.Nw.sync, payload: e };
                await U(t.remotePeer, r, t), (c = !0);
              };
              setTimeout(() => {
                d(),
                  setTimeout(() => {
                    d();
                  }, 1e3),
                  E(t);
              }, 500),
                (0, u.q)("linked", { category: "link", label: t.localPeer + ":" + t.remotePeer, value: "relay" === t.connectType ? 0 : 1 });
            }).on("unLinked_remote", (e) => {
              const t = (0, c.s0)("unLinked_" + e);
              if (!t) {
                (0, c.hh)("unLinked_" + e, () => {}, 2e3);
                const t = (0, o.ao)().find((t) => t.clientId === e);
                c.t5.warning(c.ag.t("channel to {remoter} is close", { remoter: (t && t.clientName) || e })), v({ clientId: e, connected: !1, hasStream: !1, stream: null });
              }
            }),
            l.YB.on("peerConnect", (e) => {
              const t = (0, a.tF)({ remotePeer: e.remotePeer }),
                r = (0, o.tA)(e.remotePeer);
              1 !== t.length || (r && r.connected) || (l.YB.emit("linked_remote", e.remotePeer, e), l.YB.emit("linked_" + e.remotePeer, e));
            })
              .on("peerClose", (e) => {
                setTimeout(() => {
                  const t = a.Jk.filter((t) => t.remotePeer === e.remotePeer && t.serviceType === o.V9.message && t.connected);
                  0 === t.length && (l.YB.emit("unLinked_remote", e.remotePeer), l.YB.emit("unLinked_" + e.remotePeer, e.remotePeer));
                }, 2e3);
              })
              .on("peerData", (e = {}, t, r) => {
                let i = e.remoteHandler;
                i || e.dataType || !r || (i = (0, s.$y)(r, 144, 16)), i && l.YB.getListeners(i).length > 0 ? l.YB.emit(i, e, t, r) : e.type ? l.YB.emit(e.type, e, t) : w("unknow peerData:", e, r && r.length);
              })
              .on("peerStream", (e, t) => {
                if (t.serviceType === o.V9.message) {
                  const r = (0, o.tA)(t.remotePeer);
                  r && r.setStream(e);
                }
              })
              .on(o.Nw.sync, (e, t) => {
                b(e, t);
              });
        },
        77597: (e, t, r) => {
          "use strict";
          r.d(t, {
            Zk: () => re,
            lq: () => k,
            S3: () => I,
            tA: () => oe,
            ao: () => te,
            _C: () => ee,
            Me: () => K,
            hB: () => j,
            f2: () => ne,
            fb: () => ae,
            $D: () => U,
            ST: () => se,
            h7: () => R,
            EP: () => H,
            LP: () => L,
            sq: () => Y,
            xj: () => C,
            $I: () => E,
            l6: () => O,
            Nw: () => i.Nw,
            j7: () => i.j7,
            W8: () => ie,
            Vu: () => x,
            tP: () => i.tP,
            Ch: () => F,
            V9: () => i.V9,
            cd: () => G,
            uI: () => Q,
            vK: () => z,
            m3: () => B,
            A7: () => V,
            yr: () => _,
            av: () => W,
            yq: () => D,
          });
          r(24124), r(65663), r(43610);
          var i = r(4585),
            o = r(87035),
            n = r(44259),
            s = r(51540),
            a = r.n(s),
            l = r(95761),
            c = r(26388),
            d = r(37451);
          r(10071);
          const h = r(12301),
            u = (window.electronAPI && window.electronAPI, r(99349)("localServerUtil.js"));
          function p(e) {
            const t = new Set();
            return (
              e.ips.forEach((r) => {
                r.includes(":") ? (t.add("http://[" + r + "]:" + e.port), e.upnpPort && e.upnpPort !== e.port && t.add("http://[" + r + "]:" + e.upnpPort)) : (t.add("http://" + r + ":" + e.port), e.upnpPort && e.upnpPort !== e.port && t.add("http://" + r + ":" + e.upnpPort));
              }),
              u("localServer urls:", t),
              t
            );
          }
          function A(e) {
            if ((u("getLocalServerUrlByLoad", e), !e || !e.ips || !e.port)) return;
            const t = "/node.link.pplink/hello.png",
              r = p(e),
              i = [];
            return (
              r.forEach((e) => {
                const r = new Promise((r, i) => {
                  const o = new Image();
                  (o.src = e + t),
                    o.addEventListener("load", () => {
                      u("getLocalServerUrlByLoad success:", e), r(e);
                    }),
                    setTimeout(() => {
                      i(e);
                    }, 3e3);
                });
                i.push(r);
              }),
              h(i)
            );
          }
          function m(e) {
            if ((u("getLocalServerUrlByHttpsTest"), !e.testPort)) return;
            const t = new Map();
            e.ips.forEach((r) => {
              r.includes(":")
                ? e.upnpPort
                  ? t.set("http://[" + r + "]:" + e.upnpPort, "https://[" + r + "]:" + e.testPort)
                  : t.set("http://[" + r + "]:" + e.port, "https://[" + r + "]:" + e.testPort)
                : e.upnpPort
                ? t.set("http://" + r + ":" + e.upnpPort, "https://" + r + ":" + e.testPort)
                : t.set("http://" + r + ":" + e.port, "https://" + r + ":" + e.testPort);
            });
            const r = [];
            return (
              t.forEach((e, t) => {
                const i = new Promise((t, r) => {
                  u("https test, fetch:", e),
                    fetch(e)
                      .then(() => {
                        t(e);
                      })
                      .catch((e) => {
                        u("have take a https test");
                      }),
                    setTimeout(() => {
                      r(e);
                    }, 1e4);
                });
                r.push(i);
              }),
              h(r)
            );
          }
          o.YB.on("https-test-notification", (e, t) => {
            u("https-test-notification:", e);
            const r = e.localPeer,
              i = oe(r);
            if (i && i.localServer && !i.localServerUrl) {
              const t = e.data,
                o = t.localAddress,
                n = t.family,
                s = i.localServer.upnpPort || i.localServer.port;
              if (o) i.localServerUrl = "IPv6" === n ? "http://[" + o + "]:" + s : "http://" + o + ":" + s;
              else if ("IPv6" === n) {
                const e = (0, l.z_)(r, { ipv6: !0 });
                1 === e.length ? (i.localServerUrl = "http://[" + e[0] + "]:" + s) : (i.localServer.ips = e);
              } else if ("host" === i.connectType) {
                const e = (0, l.z_)(r, { internal: !0 });
                1 === e.length ? (i.localServerUrl = "http://" + e[0] + ":" + s) : (i.localServer.ips = e);
              } else {
                const e = (0, l.z_)(r, { external: !0 });
                1 === e.length ? (i.localServerUrl = "http://" + e[0] + ":" + s) : (i.localServer.ips = e);
              }
            }
          });
          var f = r(61959),
            g = r(99715),
            w = r(54523),
            y = r(84350),
            v = r(78999),
            b = r(40019);
          const S = r(99349)("store"),
            P = "browser";
          function C() {
            return d.vuexStore;
          }
          function k(e, t) {
            d.vuexStore && d.vuexStore.commit(e, t);
          }
          const I = a().UAParser(),
            T = () => window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
          function D(e) {
            d.vuexStore && d.vuexStore.commit("peer/setWebRTCSupport", E());
          }
          function E() {
            return !!T();
          }
          setTimeout(() => {
            D(), I.browser && d.vuexStore && d.vuexStore.commit("peer/setBrowserName", I.browser.name);
          }, 0);
          const R = function (e) {
              return void 0 === e || "string" !== typeof e ? null : localStorage.getItem("link_" + e) || void 0;
            },
            B = function (e, t) {
              return void 0 === e || "string" !== typeof e ? null : localStorage.setItem("link_" + e, t);
            },
            x = function (e) {
              return void 0 === e || "string" !== typeof e ? null : localStorage.removeItem("link_" + e);
            },
            F = {
              defaultBaseUrl: R("baseUrl") || "https://www.ppzhilian.com",
              iceServers: [{ urls: "turn:stun.ppzhilian.com", username: "bshu", credential: "bshu1211" }],
              relayIceServers: [],
              relayServers: ["wss://relay.ppzhilian.com/"],
              wssServer: R("wss") || "wss://www.ppzhilian.com/wss",
              relayBestServer: "",
              updateUrl: "https://relay.ppzhilian.com/download/",
              iceTransportPolicy: "all",
            };
          class N {
            constructor(e = {}) {
              (this.version = "10.2.2"),
                (this.uid = e.uid || this.getUid()),
                (this.peerId = e.peerId || sessionStorage.getItem("tmpId")),
                (this.shortCode = e.shortCode || sessionStorage.getItem("tmpShortCode")),
                (this.name = e.name || R("myDeviceName") || ""),
                (this.token = e.token || null),
                (this.username = e.username || null),
                (this.isVip = e.isVip || !1),
                (this.groups = e.groups || []),
                (this.clientType = P),
                (this.isWeb = "browser" === P),
                (this.created = e.created || 0),
                (this.deviceIcon = M());
            }
            async loadLocalGroups() {
              const e = await (0, g.z7)();
              e.forEach((e) => {
                const t = new w.e(e);
                this.addGroup(t, "0" === t.groupId ? "allLocation" : "local");
              });
            }
            toObject() {
              return { uid: this.uid, peerId: this.peerId, shortCode: this.shortCode, name: this.name, token: this.token, username: this.username, groups: this.groups, clientType: this.clientType };
            }
            getUid() {
              if (this.uid) return this.uid;
              let e = R("uid");
              return e || (e = (0, n.Z)()), B("uid", e), (this.uid = e), e;
            }
            setPeerId(e) {
              e ? sessionStorage.setItem("tmpId", e) : (e = sessionStorage.getItem("tmpId")), (this.peerId = e);
            }
            getPeerId() {
              return this.peerId || this.setPeerId(), this.peerId;
            }
            setName(e) {
              e && ((this.name = e), B("myDeviceName", e));
            }
            getName() {
              return this.name;
            }
            setShortCode(e) {
              (this.shortCode = e), sessionStorage.setItem("tmpShortCode", e);
            }
            getShortCode() {
              return this.shortCode;
            }
            setToken(e) {
              this.token = e;
            }
            getToken() {
              return this.token;
            }
            setUsername(e) {
              this.username = e;
            }
            getUsername() {
              return this.username;
            }
            getGroup(e) {
              return this.groups.find((t) => t.groupId === e);
            }
            addGroup(e, t = "allLocation") {
              if (!e || !e.groupId) return;
              "allLocation" === t ? Object.assign(e, { online: !0, local: !0 }) : (e[t] = !0);
              const r = this.groups.find((t) => t.groupId === e.groupId);
              r ? ("allLocation" === t ? ((r.online = !0), (r.local = !0)) : (r[t] = !0)) : this.groups.push(e);
            }
            deleteGroup(e) {
              if (e) for (let t = 0, r = this.groups.length; t < r; t++) if (this.groups[t].groupId === e) return void this.groups.splice(t, 1);
            }
            resetGroup(e) {
              for (let t = this.groups.length - 1; t >= 0; t--) e ? this.groups[t].location && this.groups.splice(t, 1) : this.groups.splice(t, 1);
            }
          }
          const O = (0, f.qj)(new N());
          function M() {
            let e = v.xi["default"];
            const t = I,
              r = t.device;
            return r && r.type && v.xi[r.type] && (e = v.xi[r.type]), e;
          }
          function U() {
            return O.getPeerId();
          }
          function z(e) {
            e ? (O.setPeerId(e), d.vuexStore && d.vuexStore.commit("peer/setLocalPeer", e)) : b.error("clientId can not be empty");
          }
          function H() {
            return O.getShortCode();
          }
          function _(e) {
            e ? (O.setShortCode(e), d.vuexStore && d.vuexStore.commit("peer/setShortCode", e)) : b.error("clientId can not be empty");
          }
          function L() {
            return O.getToken();
          }
          async function W(e) {
            if ((S("setUser:", e), !e)) return void q();
            O.setUsername(e.username), O.setToken(e.token), (O.isVip = e.isVip), (O.created = e.created);
            const t = e.groups;
            t &&
              Array.isArray(t) &&
              ((O.groups && O.groups.length) || (await O.loadLocalGroups()),
              O.resetGroup("online"),
              t.forEach((e) => {
                const t = new w.e(e);
                O.addGroup(t, "online");
              }));
          }
          function q() {
            O.setUsername(null), O.setToken(null), (O.isVip = !1), (O.groups = O.groups.splice(0, O.groups.length));
          }
          function V(e) {
            S("setServerConfig config:", e);
            const t = {},
              r = R("wss");
            r && (t.wssServer = r);
            const i = R("baseUrl");
            i && (t.defaultBaseUrl = i);
            const o = R("relayBestServer");
            o && (t.relayBestServer = o), S("local server config:", t), Object.assign(F, e, t), F.defaultBaseUrl && (c.axios.defaults.baseURL = F.defaultBaseUrl);
          }
          function j() {
            const e = R("enableShortCode");
            return !("disabled" === e);
          }
          function Q(e) {
            const t = e ? "enabled" : "disabled";
            B("enableShortCode", t), d.vuexStore && d.vuexStore.commit("peer/setEnableShortCode", e);
          }
          function Y() {
            return O.uid;
          }
          function G(e) {
            e && (O.setName(e), d.vuexStore && d.vuexStore.commit("peer/setDeviceName", e));
          }
          function Z() {
            return I.os ? I.os.name + I.os.version : "-name";
          }
          function J() {
            S("setDefaultDeviceName");
            const e = Math.random().toString().slice(-3),
              t = Z() + "-" + e;
            G(t);
          }
          function K() {
            return !O.getName() && U() && J(), O.getName();
          }
          const X = (0, f.qj)([]);
          class $ {
            constructor(e) {
              (this.id = e.id || Math.random().toString().slice(-8)),
                (this.clientId = e.clientId),
                (this.clientName = e.clientName || e.shortCode || e.clientId.slice(0, 4)),
                (this.shortCode = e.shortCode),
                (this.connected = void 0 !== e.connected && e.connected),
                (this.connectedTime = e.connected ? Date.now() : 0),
                (this.files = e.files || []),
                (this.chats = e.chats || []),
                (this.clipboards = e.clipboards || []),
                (this.stream = e.stream || null),
                (this.connectType = e.connectType || null),
                (this.updated = new Date()),
                (this.ua = e.ua),
                (this.type = ""),
                (this.clientType = e.clientType || ""),
                (this.scope = e.scope || i.tP.temp),
                (this.localServer = e.localServer || null),
                (this.localServerUrl = null),
                (this.address = e.address || ""),
                (this.localAddress = e.localAddress || ""),
                this.setConnectedPeerType(),
                (this.version = null),
                (this.hasStream = !1),
                (this.deviceIcon = v.xi["default"]);
            }
            setConnectedPeerType() {
              if (this.ua) {
                const e = a()(this.ua).device;
                e && ((this.type = e.type || "pc"), (this.deviceIcon = v.xi[this.type] || v.xi["default"]));
              }
            }
            setStream(e) {
              this.stream !== e && ((this.stream = e), this.stream.addEventListener("removed", this.onStreamStop.bind(this)), o.YB.emit("remote_new_stream", this.clientId, e), this.updateNotify());
            }
            onStreamStop() {
              S("onStreamStop", this.stream), (this.hasStream = !1), this.stream && ((this.stream = null), this.updateNotify());
            }
            updateNotify() {
              this.updated = new Date();
            }
            versionSupport(e) {
              return (0, y.Pq)(this.version, e);
            }
            async setLocalServerUrl() {
              if (!this.localServer) return;
              const e = { ip: this.localServer.ip, ips: [], port: this.localServer.port, testPort: this.localServer.testPort || this.localServer.port, upnpPort: this.localServer.upnpPort };
              if ("relay" === this.connectType) e.ips = (0, l.z_)(this.clientId, { external: !0, ipv6: !0 });
              else {
                const t = (0, l.WF)(this.clientId);
                t ? (e.ips = [t]) : "host" === this.connectType ? (e.ips = (0, l.z_)(this.clientId, { internal: !0 })) : (e.ips = (0, l.z_)(this.clientId, { external: !0, ipv6: !0 }));
              }
              this.localServer = e;
              try {
                let t;
                (t = ["pc", "mobile"].includes(O.clientType) ? await A(e) : await m(e)), t && (this.localServerUrl = t), S("auto detect success, plan1:", this.localServerUrl);
              } catch (t) {
                S("test localServer connect fail:", t);
              }
            }
          }
          function ee() {
            return X;
          }
          function te() {
            return X;
          }
          function re(e) {
            if ((S("addConnected:", e), !e || !e.clientId)) return void b.error("add connected error:", e);
            let t = oe(e.clientId);
            if (!t) {
              const r = new $(e);
              X.push(r), d.vuexStore && d.vuexStore.commit("peer/addConnected", e.clientId), (t = r);
            }
            return t;
          }
          function ie({ clientId: e }) {
            if (!e) return;
            const t = oe(e);
            S("removeConnected:", e), t && (X.splice(X.indexOf(t), 1), o.YB.emit("remote_remove", e), d.vuexStore && d.vuexStore.commit("peer/removeConnected", e));
          }
          function oe(e, t) {
            for (let r = 0; r < X.length; r++) {
              if (e && X[r].clientId === e) return X[r];
              if (t && X[r].shortCode === t) return X[r];
            }
            return null;
          }
          function ne() {
            if (!O.isVip) return F.iceServers;
            const e = (F.relayIceServers || []).concat(F.iceServers),
              t = e.filter((t, r) => e.findIndex((e) => e.urls === t.urls) === r);
            return t;
          }
          function se() {
            if (F.relayBestServer) return F.relayBestServer;
            if (!F.relayServers || !F.relayServers.length) return null;
            const e = O.isVip ? 0 : F.relayServers.length - 1;
            return F.relayServers[e];
          }
          function ae() {
            return O.clientType;
          }
          S.enabled && (window.storeInfo = { connecteds: X, deviceInfo: I, localClient: O, serversConfig: F, remotePeerIps: l.q4, getConnecteds: ee, getVuex: C });
        },
        78999: (e, t, r) => {
          "use strict";
          r.d(t, { B8: () => I, GZ: () => y, K: () => m, UR: () => A, Vq: () => o.Z, WE: () => P, _C: () => d, ag: () => s.i18n, hh: () => g, jE: () => u, mZ: () => S, pj: () => C, q: () => h, s0: () => w, t5: () => b, vc: () => p, xi: () => l, y4: () => T, ys: () => c });
          r(10071), r(67280), r(65363), r(24124), r(43610);
          var i = r(64434),
            o = r(11417),
            n = r(21082),
            s = r(47867),
            a = r(84350);
          const l = { mobile: "phone_iphone", tablet: "o_tablet_mac", pc: "o_desktop_windows", default: "o_desktop_windows" };
          function c(e) {
            if (!e) return 0;
            if (("string" === typeof e && (e = parseInt(e)), e < 0 || Number.isNaN(e))) return "--";
            const t = ["GByte", "MByte", "KByte", "Byte"],
              r = [30, 20, 10, 0];
            for (let i = 0; i < r.length; i++) if (e > 1 << r[i]) return Math.round((e / (1 << r[i])) * 100) / 100 + " " + t[i];
            return 0;
          }
          function d(e, t = "s") {
            if (!e) return 0;
            e < 0 && (e = -e);
            const r = { D: Math.floor(e / 864e5), H: Math.floor(e / 36e5) % 24 };
            "m" === t ? (r.M = Math.floor(e / 6e4) % 60) : "s" === t ? Object.assign(r, { M: Math.floor(e / 6e4) % 60, S: Math.floor(e / 1e3) % 60 }) : "ms" === t && Object.assign(r, { M: Math.floor(e / 6e4) % 60, S: Math.floor(e / 1e3) % 60, ms: Math.floor(e) % 1e3 });
            let i = Object.entries(r)
              .filter((e) => 0 !== e[1])
              .map(([e, t]) => `${t}${e}`)
              .join(", ");
            if (!i) return 0;
            const o = ["D", "H", "M", "S"];
            return (
              o.forEach((e) => {
                i = i.replace(e, s.i18n.t(e));
              }),
              i
            );
          }
          function h(e) {
            let t = "number" === typeof e ? e : parseInt(e);
            if (isNaN(t)) return "--";
            const r = t > 3600 ? Math.floor(t / 3600) : 0;
            t -= 3600 * r;
            const i = n.ZP.formatDate(1e3 * t, "mm:ss");
            return (r ? r + " " : "") + i;
          }
          function u(e) {
            return e ? n.ZP.formatDate(e, "YYYY-MM-DD HH:mm") : "--";
          }
          function p(e, t = "YYYY-MM-DD HH:mm") {
            return e ? n.ZP.formatDate(e, t) : "--";
          }
          function A(e, t) {
            return (void 0 === e || e < 0 ? "-" : e) + "%  " + c(t) + "/s";
          }
          function m(e) {
            return void 0 === e ? "--" : s.i18n.t("Completed. Cost time:") + d(e);
          }
          const f = new Map();
          function g(e, t, r = 0) {
            f.set(e, t),
              r &&
                setTimeout(() => {
                  f.delete(e);
                }, r);
          }
          function w(e) {
            return f.get(e);
          }
          function y(e) {
            const t = f.get(e);
            t && ("function" === typeof t && t(), f.delete(e));
          }
          function v(e, t) {
            if (!t) return null;
            const r = "string" === typeof t ? { type: e, message: t } : { type: e, ...t };
            return i.Z.create(r);
          }
          i.Z.setDefaults({ classes: "my-notify", actions: [{ icon: "close", color: "white", size: "0.75rem", dense: !0 }] });
          const b = {
            tip(e) {
              return v(void 0, e);
            },
            ongoing(e) {
              return v("ongoing", e);
            },
            success(e) {
              return v("positive", e);
            },
            info(e) {
              return v("info", e);
            },
            error(e) {
              return v("negative", e);
            },
            warning(e) {
              return v("warning", e);
            },
          };
          async function S(e = {}) {
            return new Promise((t) => {
              o.Z.create({ title: s.i18n.t("Confirm"), message: s.i18n.t("Are you sure to do it ?"), persistent: !1, ok: s.i18n.t("Ok"), cancel: s.i18n.t("Cancel"), ...e })
                .onOk((e) => {
                  t(["ok", e]);
                })
                .onCancel(() => {
                  t("cancel");
                })
                .onDismiss(() => {
                  t(!1);
                });
            });
          }
          function P(e) {
            if (!e) return "";
            const t = e.replace(/\\/g, "/"),
              r = t.split("/");
            for (let i = r.length; i > -1; i--) if (r[i] && r[i].includes(".")) return r[i];
            return "unknown";
          }
          function C(e) {
            return "number" === typeof e ? e + "px" : e;
          }
          const k = (0, a.J5)(),
            I = `<link href="${k}/tinymce/plugins/prism.css" rel="stylesheet" /><script src="${k}/tinymce/plugins/prism.js"><\/script><style type="text/css">p{margin:10px 0; word-break: break-word;}</style>`,
            T = 20;
        },
        5676: (e, t, r) => {
          "use strict";
          r.d(t, { Bb: () => f, Y2: () => A, iR: () => w, wV: () => p });
          r(24124), r(76701);
          var i = r(11267),
            o = r(78999),
            n = r(7097),
            s = r(87035),
            a = r(77597),
            l = r(40019);
          const c = r(99349)("websocketChannel.js");
          let d;
          const h = 2e4;
          let u = null;
          function p() {
            return !d || d.url !== a.Ch.wssServer || (d.readyState !== WebSocket.OPEN && d.readyState !== WebSocket.CONNECTING) ? m() : d;
          }
          function A() {
            return d && d.readyState;
          }
          function m(e) {
            if ((c("setupWsChannel"), !window.navigator.onLine)) return void v();
            d &&
              !u &&
              (u = o.t5.ongoing({
                group: "wsDisconnect",
                message: o.ag.t("Disconnected from server, connecting"),
                color: "dark",
                onDismiss: () => {
                  u = null;
                },
              }));
            const t = new WebSocket(a.Ch.wssServer);
            d = t;
            const r = new i.k({
              websocket: t,
              ping: (0, n.s6)({ type: n.w4.ping }),
              interval: h,
              retries: 5,
              timeoutHandler: () => {
                l.error("ws watcher can not get ping from server"), t.readyState === WebSocket.OPEN ? t.close() : r.destroy(), m();
              },
            });
            return (
              t.addEventListener("open", (e) => {
                c("open the wsChannel"), (0, a.lq)("peer/updateConnectedToServer", !0), s.YB.emit("wsConnect", d), u && u();
              }),
              t.addEventListener("close", (e) => {
                (0, a.lq)("peer/updateConnectedToServer", !1), l.error("ws close:", e.code, e.reason);
              }),
              t.addEventListener("error", () => {}),
              t
            );
          }
          function f(e, t = !0) {
            e &&
              ("string" !== typeof e && (e = (0, n.s6)(e)),
              d && d.readyState === WebSocket.OPEN
                ? d.send(e)
                : t &&
                  (0, s.pX)("wsConnect", (t) => {
                    c("run fun after connected"), t.send(e);
                  }));
          }
          const g = 5e3;
          async function w(e) {
            return new Promise((t, r) => {
              if ("string" === typeof e)
                try {
                  e = JSON.parse(e);
                } catch (o) {
                  return void r(new Error("not json message"));
                }
              const i =
                e.callback ||
                (0, s.FZ)(
                  (e) => {
                    t(e);
                  },
                  g,
                  (t) => {
                    c("send message:", e), r(new Error("timeout:" + t));
                  }
                );
              Object.assign(e, { clientId: (0, a.$D)(), callback: i }), f((0, n.s6)(e));
            });
          }
          let y = null;
          function v() {
            y ||
              (y = o.t5.error({
                group: "wsDisconnect",
                message: o.ag.t("Network is offline"),
                timeout: 0,
                onDismiss: () => {
                  y = null;
                },
              }));
          }
          window.addEventListener("online", () => {
            c("network online"), y && y(), m();
          }),
            window.addEventListener("offline", () => {
              c("network offline"), v();
            });
          const b = 5e3;
          function S() {
            setInterval(() => {
              const e = A();
              (e && e !== WebSocket.CLOSED) || m();
            }, b);
          }
          setTimeout(S, 2e3);
        },
        7097: (e, t, r) => {
          "use strict";
          r.d(t, { SR: () => n, s6: () => s, w4: () => o });
          r(92100);
          var i = r(40019);
          const o = { register: "register", success: "success", fail: "fail", error: "error", transfer: "transfer", ping: "ping", pong: "pong", statistics: "statistics", sync: "sync", fetch: "fetch", get: "get", request: "request", response: "response" },
            n = (e) => {
              if (!e) return {};
              if ("object" === typeof e) return e;
              let t = {};
              try {
                t = JSON.parse(e);
              } catch (r) {
                i.error("wsRouter.messageParse:", e);
              }
              return t;
            },
            s = (e) => JSON.stringify(e);
          s({ type: o.success });
        },
        49215: () => {},
        9165: () => {},
        42480: () => {},
        24654: () => {},
        52361: () => {},
        94616: () => {},
      },
      t = {};
    function r(i) {
      var o = t[i];
      if (void 0 !== o) return o.exports;
      var n = (t[i] = { exports: {} });
      return e[i].call(n.exports, n, n.exports, r), n.exports;
    }
    (r.m = e),
      (() => {
        r.amdO = {};
      })(),
      (() => {
        var e = [];
        r.O = (t, i, o, n) => {
          if (!i) {
            var s = 1 / 0;
            for (d = 0; d < e.length; d++) {
              for (var [i, o, n] = e[d], a = !0, l = 0; l < i.length; l++) (!1 & n || s >= n) && Object.keys(r.O).every((e) => r.O[e](i[l])) ? i.splice(l--, 1) : ((a = !1), n < s && (s = n));
              if (a) {
                e.splice(d--, 1);
                var c = o();
                void 0 !== c && (t = c);
              }
            }
            return t;
          }
          n = n || 0;
          for (var d = e.length; d > 0 && e[d - 1][2] > n; d--) e[d] = e[d - 1];
          e[d] = [i, o, n];
        };
      })(),
      (() => {
        r.n = (e) => {
          var t = e && e.__esModule ? () => e["default"] : () => e;
          return r.d(t, { a: t }), t;
        };
      })(),
      (() => {
        var e,
          t = Object.getPrototypeOf ? (e) => Object.getPrototypeOf(e) : (e) => e.__proto__;
        r.t = function (i, o) {
          if ((1 & o && (i = this(i)), 8 & o)) return i;
          if ("object" === typeof i && i) {
            if (4 & o && i.__esModule) return i;
            if (16 & o && "function" === typeof i.then) return i;
          }
          var n = Object.create(null);
          r.r(n);
          var s = {};
          e = e || [null, t({}), t([]), t(t)];
          for (var a = 2 & o && i; "object" == typeof a && !~e.indexOf(a); a = t(a)) Object.getOwnPropertyNames(a).forEach((e) => (s[e] = () => i[e]));
          return (s["default"] = () => i), r.d(n, s), n;
        };
      })(),
      (() => {
        r.d = (e, t) => {
          for (var i in t) r.o(t, i) && !r.o(e, i) && Object.defineProperty(e, i, { enumerable: !0, get: t[i] });
        };
      })(),
      (() => {
        (r.f = {}), (r.e = (e) => Promise.all(Object.keys(r.f).reduce((t, i) => (r.f[i](e, t), t), [])));
      })(),
      (() => {
        r.u = (e) =>
          "js/" +
          (64 === e ? "chunk-common" : e) +
          "." +
          {
            9: "31c861c2",
            64: "4f925cd4",
            91: "f1ce2a47",
            183: "36d6389a",
            299: "e73957ae",
            321: "975fe073",
            353: "0042e477",
            381: "072b18fa",
            405: "20134d53",
            423: "e716e495",
            456: "f927f51d",
            474: "e58595cc",
            475: "081b6b73",
            490: "596c51d2",
            516: "76874649",
            550: "b2a461a7",
            595: "c551e505",
            604: "17f580b1",
            628: "04d99a1b",
            632: "1c3ffef9",
            680: "38716170",
            685: "ea82704c",
            686: "889431dd",
            704: "57d35a3c",
            737: "9c045e94",
            844: "73d10252",
            877: "d6f01374",
            895: "6d464200",
            940: "a6695333",
            963: "a470598f",
          }[e] +
          ".js";
      })(),
      (() => {
        r.miniCssF = (e) =>
          "css/" +
          ({ 143: "app", 736: "vendor" }[e] || e) +
          "." +
          {
            91: "28a38106",
            143: "c5cf3b84",
            183: "80b7060f",
            321: "06ea4cd2",
            353: "b4f21e96",
            381: "5e922351",
            405: "dcb60883",
            456: "87187ea6",
            474: "cb2993bf",
            475: "604b239c",
            550: "1a7d40b8",
            595: "c927c429",
            604: "5043afd8",
            628: "61ec31f9",
            632: "4e04a6d1",
            704: "0d5c7446",
            736: "93b2ec43",
            737: "0e5db161",
            844: "e2fbd4d9",
            895: "d5352760",
            963: "6de765d2",
          }[e] +
          ".css";
      })(),
      (() => {
        r.g = (function () {
          if ("object" === typeof globalThis) return globalThis;
          try {
            return this || new Function("return this")();
          } catch (e) {
            if ("object" === typeof window) return window;
          }
        })();
      })(),
      (() => {
        r.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t);
      })(),
      (() => {
        var e = {},
          t = "pplink:";
        r.l = (i, o, n, s) => {
          if (e[i]) e[i].push(o);
          else {
            var a, l;
            if (void 0 !== n)
              for (var c = document.getElementsByTagName("script"), d = 0; d < c.length; d++) {
                var h = c[d];
                if (h.getAttribute("src") == i || h.getAttribute("data-webpack") == t + n) {
                  a = h;
                  break;
                }
              }
            a || ((l = !0), (a = document.createElement("script")), (a.charset = "utf-8"), (a.timeout = 120), r.nc && a.setAttribute("nonce", r.nc), a.setAttribute("data-webpack", t + n), (a.src = i)), (e[i] = [o]);
            var u = (t, r) => {
                (a.onerror = a.onload = null), clearTimeout(p);
                var o = e[i];
                if ((delete e[i], a.parentNode && a.parentNode.removeChild(a), o && o.forEach((e) => e(r)), t)) return t(r);
              },
              p = setTimeout(u.bind(null, void 0, { type: "timeout", target: a }), 12e4);
            (a.onerror = u.bind(null, a.onerror)), (a.onload = u.bind(null, a.onload)), l && document.head.appendChild(a);
          }
        };
      })(),
      (() => {
        r.r = (e) => {
          "undefined" !== typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 });
        };
      })(),
      (() => {
        r.p = "/";
      })(),
      (() => {
        var e = (e, t, r, i) => {
            var o = document.createElement("link");
            (o.rel = "stylesheet"), (o.type = "text/css");
            var n = (n) => {
              if (((o.onerror = o.onload = null), "load" === n.type)) r();
              else {
                var s = n && ("load" === n.type ? "missing" : n.type),
                  a = (n && n.target && n.target.href) || t,
                  l = new Error("Loading CSS chunk " + e + " failed.\n(" + a + ")");
                (l.code = "CSS_CHUNK_LOAD_FAILED"), (l.type = s), (l.request = a), o.parentNode.removeChild(o), i(l);
              }
            };
            return (o.onerror = o.onload = n), (o.href = t), document.head.appendChild(o), o;
          },
          t = (e, t) => {
            for (var r = document.getElementsByTagName("link"), i = 0; i < r.length; i++) {
              var o = r[i],
                n = o.getAttribute("data-href") || o.getAttribute("href");
              if ("stylesheet" === o.rel && (n === e || n === t)) return o;
            }
            var s = document.getElementsByTagName("style");
            for (i = 0; i < s.length; i++) {
              (o = s[i]), (n = o.getAttribute("data-href"));
              if (n === e || n === t) return o;
            }
          },
          i = (i) =>
            new Promise((o, n) => {
              var s = r.miniCssF(i),
                a = r.p + s;
              if (t(s, a)) return o();
              e(i, a, o, n);
            }),
          o = { 143: 0 };
        r.f.miniCss = (e, t) => {
          var r = { 91: 1, 183: 1, 321: 1, 353: 1, 381: 1, 405: 1, 456: 1, 474: 1, 475: 1, 550: 1, 595: 1, 604: 1, 628: 1, 632: 1, 704: 1, 737: 1, 844: 1, 895: 1, 963: 1 };
          o[e]
            ? t.push(o[e])
            : 0 !== o[e] &&
              r[e] &&
              t.push(
                (o[e] = i(e).then(
                  () => {
                    o[e] = 0;
                  },
                  (t) => {
                    throw (delete o[e], t);
                  }
                ))
              );
        };
      })(),
      (() => {
        var e = { 143: 0 };
        (r.f.j = (t, i) => {
          var o = r.o(e, t) ? e[t] : void 0;
          if (0 !== o)
            if (o) i.push(o[2]);
            else {
              var n = new Promise((r, i) => (o = e[t] = [r, i]));
              i.push((o[2] = n));
              var s = r.p + r.u(t),
                a = new Error(),
                l = (i) => {
                  if (r.o(e, t) && ((o = e[t]), 0 !== o && (e[t] = void 0), o)) {
                    var n = i && ("load" === i.type ? "missing" : i.type),
                      s = i && i.target && i.target.src;
                    (a.message = "Loading chunk " + t + " failed.\n(" + n + ": " + s + ")"), (a.name = "ChunkLoadError"), (a.type = n), (a.request = s), o[1](a);
                  }
                };
              r.l(s, l, "chunk-" + t, t);
            }
        }),
          (r.O.j = (t) => 0 === e[t]);
        var t = (t, i) => {
            var o,
              n,
              [s, a, l] = i,
              c = 0;
            if (s.some((t) => 0 !== e[t])) {
              for (o in a) r.o(a, o) && (r.m[o] = a[o]);
              if (l) var d = l(r);
            }
            for (t && t(i); c < s.length; c++) (n = s[c]), r.o(e, n) && e[n] && e[n][0](), (e[n] = 0);
            return r.O(d);
          },
          i = (self["webpackChunkpplink"] = self["webpackChunkpplink"] || []);
        i.forEach(t.bind(null, 0)), (i.push = t.bind(null, i.push.bind(i)));
      })();
    var i = r.O(void 0, [736], () => r(31210));
    i = r.O(i);
  })();
})();

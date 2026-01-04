// ==UserScript==
// @name         AE86 v3
// @namespace    https://greasyfork.org/en/users/1064285-vcrazy
// @version      v2.8(private)
// @description  Private
// @author       _VcrazY_
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @icon         https://cdn.discordapp.com/attachments/1093909417348579449/1204478629460058123/skull.png
// @grant        none
// @run-at       document_idle
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486693/AE86%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/486693/AE86%20v3.meta.js
// ==/UserScript==
// This mod is not finished, if you are a coder and you are reading this post, you can contribute to improving/fixing the mod with me, discord: _vcrazy_
/** AE86 v3
 * @author _VcrazY_
 * @version 3.0 private
 * @state In development
 */
(function () {
  "use strict";

  !function () {
    let scriptIndex = false;
    let scripts = document.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].src.includes("index-f3a4c1ad.js") && !scriptIndex) {
        scripts[i].remove();
        scriptIndex = true;
        break;
      }
    }
  }(); // SCRIPT MENU:
  let modMenus = document.createElement("div");
  modMenus.id = "modMenus";
  document.body.append(modMenus); // Styles
  modMenus.style.cssText = `
    display: block;
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    position: absolute;
    left: 20px;
    top: 20px;
    min-width: 300px;
    max-width: 290px;
    min-height: 200px;
    max-height: 350px;
`;
  function toggleUI() {
    $("#gameUI").toggle();
  }
  function updateInnerHTML() {
    modMenus.innerHTML = `
        <div id="headline" style="font-size: 30px; color: rgb(255, 255, 255);">
            Ae86:
            <br>
            <button id="uifr?" onclick="toggleUI()">HideUI</button>
            <br>
            <hr>
            <div style="font-size: 12px; overflow-y: scroll; max-height: 150px;">
                <br>
                Toggles:
                <br>
                Visual:
                <select id="visualtype">
                    <option value="1">Ae86</option>
                    <option value="2" selected>Ae86 Remake</option>
                    <option value="3">Old Ae86</option>
                </select><br>

                <input type="checkbox" checked id="plc1">Auto Placer<br>
                <input type="checkbox" checked id="autoBullSpam">Auto Bull Spam<br>
                <input type="checkbox" checked id="autoreload">Auto Reload<br>
                <input type="checkbox" checked id="plc2">Auto Replacer<br>
                <input type="checkbox" checked id="autobuy">Auto Buy<br>
                <input type="checkbox" checked id="antitrap">Anti Trap<br>
                <input type="checkbox" checked id="spiketick">Spike Tick<br>
                <input type="checkbox" id="grind">Auto Grinder<br>
                <input type="checkbox" checked id="teamsync">Team Sync<br>
                <input type="checkbox" checked id="backUpRAnti">Anti Ranged<br>
                <input type="checkbox" checked id="antiTurretSync">Anti Turret Sync<br>
                <input type="checkbox" id="spin">Auto Spin<br>
                <input type="checkbox" id="mapgrinder">Map Grid<br>
                <input type="checkbox" id="showdir">Render Real Dir<br>
                <br>
                Press C To Start...
                <br>
                <select id="songs">
                    <option value="1">CRVN - Nobody</option>
                    <option value="2">Dave Rodgers - Ae86</option>
                    <option value="3" selected>Don't Stand So Close</option>
                </select>
                <br>
                <input type="checkbox" checked id="showch">Show Chat<br>
                <hr>
            </div>
        </div>
    `;
  }
  updateInnerHTML(); // THIS IS HOW SCRIPT MENU IS ON/OFF:
  function getEl(id) {
    return document.getElementById(id);
  } // PART OF SCRIPT MENU:
  let controlColor = false;
  getEl("uifr?").onclick = function () {
    $("#gameUI").toggle();
  };
  var secPacket = 0;
  var minPacket = 0;
  var secMax = 2 / 3 * 110;
  var minMax = 2 / 3 * 5100;
  var secTime = 1000;
  var minTime = 60000;
  var maxPing = 0;
  var minPing = 0;
  let inbowinsta = false;
  let myConfig = {
    x: null,
    y: null,
    clan: undefined
  };
  let tickout = 1000 / 9;
  window.devicePixelRatio2 = 1;
  const song1 = new Audio("https://cdn.discordapp.com/attachments/1093909417348579449/1167156358521556992/Zack_Merci_X_CRVN_-_Nobody_NCS_Release.mp3");
  const song2 = new Audio("https://cdn.discordapp.com/attachments/1093909417348579449/1175374113703997480/ae86.mp3");
  const song3 = new Audio("https://cdn.discordapp.com/attachments/1093909417348579449/1175371927427240016/dontstandsoclose.mp3");
  let healLag = 100;
  (function () {
    const t = document.createElement("link").relList;
    if (t && t.supports && t.supports("modulepreload")) return;
    for (const n of document.querySelectorAll('link[rel="modulepreload"]')) s(n);
    new MutationObserver(n => {
      for (const r of n) if (r.type === "childList") for (const o of r.addedNodes) o.tagName === "LINK" && o.rel === "modulepreload" && s(o);
    }).observe(document, {
      childList: !0,
      subtree: !0
    });
    function i(n) {
      const r = {};
      return n.integrity && (r.integrity = n.integrity), n.referrerpolicy && (r.referrerPolicy = n.referrerpolicy), n.crossorigin === "use-credentials" ? r.credentials = "include" : n.crossorigin === "anonymous" ? r.credentials = "omit" : r.credentials = "same-origin", r;
    }
    function s(n) {
      if (n.ep) return;
      n.ep = !0;
      const r = i(n);
      fetch(n.href, r);
    }
  })();
  var Ke = 4294967295;
  function Ko(e, t, i) {
    var s = i / 4294967296,
      n = i;
    e.setUint32(t, s), e.setUint32(t + 4, n);
  }
  function Br(e, t, i) {
    var s = Math.floor(i / 4294967296),
      n = i;
    e.setUint32(t, s), e.setUint32(t + 4, n);
  }
  function zr(e, t) {
    var i = e.getInt32(t),
      s = e.getUint32(t + 4);
    return i * 4294967296 + s;
  }
  function Jo(e, t) {
    var i = e.getUint32(t),
      s = e.getUint32(t + 4);
    return i * 4294967296 + s;
  }
  var Gi,
    Yi,
    $i,
    Pi = (typeof process > "u" || ((Gi = process == null ? void 0 : process.env) === null || Gi === void 0 ? void 0 : Gi.TEXT_ENCODING) !== "never") && typeof TextEncoder < "u" && typeof TextDecoder < "u";
  function Cs(e) {
    for (var t = e.length, i = 0, s = 0; s < t;) {
      var n = e.charCodeAt(s++);
      if (n & 4294967168) {
        if (!(n & 4294965248)) i += 2;else {
          if (n >= 55296 && n <= 56319 && s < t) {
            var r = e.charCodeAt(s);
            (r & 64512) === 56320 && (++s, n = ((n & 1023) << 10) + (r & 1023) + 65536);
          }
          n & 4294901760 ? i += 4 : i += 3;
        }
      } else {
        i++;
        continue;
      }
    }
    return i;
  }
  function Qo(e, t, i) {
    for (var s = e.length, n = i, r = 0; r < s;) {
      var o = e.charCodeAt(r++);
      if (o & 4294967168) {
        if (!(o & 4294965248)) t[n++] = o >> 6 & 31 | 192;else {
          if (o >= 55296 && o <= 56319 && r < s) {
            var l = e.charCodeAt(r);
            (l & 64512) === 56320 && (++r, o = ((o & 1023) << 10) + (l & 1023) + 65536);
          }
          o & 4294901760 ? (t[n++] = o >> 18 & 7 | 240, t[n++] = o >> 12 & 63 | 128, t[n++] = o >> 6 & 63 | 128) : (t[n++] = o >> 12 & 15 | 224, t[n++] = o >> 6 & 63 | 128);
        }
      } else {
        t[n++] = o;
        continue;
      }
      t[n++] = o & 63 | 128;
    }
  }
  var Ut = Pi ? new TextEncoder() : void 0,
    Zo = Pi ? typeof process < "u" && ((Yi = process == null ? void 0 : process.env) === null || Yi === void 0 ? void 0 : Yi.TEXT_ENCODING) !== "force" ? 200 : 0 : Ke;
  function jo(e, t, i) {
    t.set(Ut.encode(e), i);
  }
  function ea(e, t, i) {
    Ut.encodeInto(e, t.subarray(i));
  }
  var ta = Ut != null && Ut.encodeInto ? ea : jo,
    ia = 4096;
  function Hr(e, t, i) {
    for (var s = t, n = s + i, r = [], o = ""; s < n;) {
      var l = e[s++];
      if (!(l & 128)) r.push(l);else if ((l & 224) === 192) {
        var c = e[s++] & 63;
        r.push((l & 31) << 6 | c);
      } else if ((l & 240) === 224) {
        var c = e[s++] & 63,
          a = e[s++] & 63;
        r.push((l & 31) << 12 | c << 6 | a);
      } else if ((l & 248) === 240) {
        var c = e[s++] & 63,
          a = e[s++] & 63,
          u = e[s++] & 63,
          p = (l & 7) << 18 | c << 12 | a << 6 | u;
        p > 65535 && (p -= 65536, r.push(p >>> 10 & 1023 | 55296), p = 56320 | p & 1023), r.push(p);
      } else r.push(l);
      r.length >= ia && (o += String.fromCharCode.apply(String, r), r.length = 0);
    }
    return r.length > 0 && (o += String.fromCharCode.apply(String, r)), o;
  }
  var na = Pi ? new TextDecoder() : null,
    sa = Pi ? typeof process < "u" && (($i = process == null ? void 0 : process.env) === null || $i === void 0 ? void 0 : $i.TEXT_DECODER) !== "force" ? 200 : 0 : Ke;
  function ra(e, t, i) {
    var s = e.subarray(t, t + i);
    return na.decode(s);
  }
  var si = function () {
      function e(t, i) {
        this.type = t, this.data = i;
      }
      return e;
    }(),
    oa = globalThis && globalThis.__extends || function () {
      var e = function (t, i) {
        return e = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (s, n) {
          s.__proto__ = n;
        } || function (s, n) {
          for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (s[r] = n[r]);
        }, e(t, i);
      };
      return function (t, i) {
        if (typeof i != "function" && i !== null) throw new TypeError("Class extends value " + String(i) + " is not a constructor or null");
        e(t, i);
        function s() {
          this.constructor = t;
        }
        t.prototype = i === null ? Object.create(i) : (s.prototype = i.prototype, new s());
      };
    }(),
    Pe = function (e) {
      oa(t, e);
      function t(i) {
        var s = e.call(this, i) || this,
          n = Object.create(t.prototype);
        return Object.setPrototypeOf(s, n), Object.defineProperty(s, "name", {
          configurable: !0,
          enumerable: !1,
          value: t.name
        }), s;
      }
      return t;
    }(Error),
    aa = -1,
    la = 4294967296 - 1,
    ca = 17179869184 - 1;
  function ha(e) {
    var t = e.sec,
      i = e.nsec;
    if (t >= 0 && i >= 0 && t <= ca) {
      if (i === 0 && t <= la) {
        var s = new Uint8Array(4),
          n = new DataView(s.buffer);
        return n.setUint32(0, t), s;
      } else {
        var r = t / 4294967296,
          o = t & 4294967295,
          s = new Uint8Array(8),
          n = new DataView(s.buffer);
        return n.setUint32(0, i << 2 | r & 3), n.setUint32(4, o), s;
      }
    } else {
      var s = new Uint8Array(12),
        n = new DataView(s.buffer);
      return n.setUint32(0, i), Br(n, 4, t), s;
    }
  }
  function fa(e) {
    var t = e.getTime(),
      i = Math.floor(t / 1e3),
      s = (t - i * 1e3) * 1e6,
      n = Math.floor(s / 1e9);
    return {
      sec: i + n,
      nsec: s - n * 1e9
    };
  }
  function ua(e) {
    if (e instanceof Date) {
      var t = fa(e);
      return ha(t);
    } else return null;
  }
  function da(e) {
    var t = new DataView(e.buffer, e.byteOffset, e.byteLength);
    switch (e.byteLength) {
      case 4:
        {
          var i = t.getUint32(0),
            s = 0;
          return {
            sec: i,
            nsec: s
          };
        }
      case 8:
        {
          var n = t.getUint32(0),
            r = t.getUint32(4),
            i = (n & 3) * 4294967296 + r,
            s = n >>> 2;
          return {
            sec: i,
            nsec: s
          };
        }
      case 12:
        {
          var i = zr(t, 4),
            s = t.getUint32(0);
          return {
            sec: i,
            nsec: s
          };
        }
      default:
        throw new Pe("Unrecognized data size for timestamp (expected 4, 8, or 12): ".concat(e.length));
    }
  }
  function pa(e) {
    var t = da(e);
    return new Date(t.sec * 1e3 + t.nsec / 1e6);
  }
  var ma = {
      type: aa,
      encode: ua,
      decode: pa
    },
    Fr = function () {
      function e() {
        this.builtInEncoders = [], this.builtInDecoders = [], this.encoders = [], this.decoders = [], this.register(ma);
      }
      return e.prototype.register = function (t) {
        var i = t.type,
          s = t.encode,
          n = t.decode;
        if (i >= 0) this.encoders[i] = s, this.decoders[i] = n;else {
          var r = 1 + i;
          this.builtInEncoders[r] = s, this.builtInDecoders[r] = n;
        }
      }, e.prototype.tryToEncode = function (t, i) {
        for (var s = 0; s < this.builtInEncoders.length; s++) {
          var n = this.builtInEncoders[s];
          if (n != null) {
            var r = n(t, i);
            if (r != null) {
              var o = -1 - s;
              return new si(o, r);
            }
          }
        }
        for (var s = 0; s < this.encoders.length; s++) {
          var n = this.encoders[s];
          if (n != null) {
            var r = n(t, i);
            if (r != null) {
              var o = s;
              return new si(o, r);
            }
          }
        }
        return t instanceof si ? t : null;
      }, e.prototype.decode = function (t, i, s) {
        var n = i < 0 ? this.builtInDecoders[-1 - i] : this.decoders[i];
        return n ? n(t, i, s) : new si(i, t);
      }, e.defaultCodec = new e(), e;
    }();
  function gi(e) {
    return e instanceof Uint8Array ? e : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength) : e instanceof ArrayBuffer ? new Uint8Array(e) : Uint8Array.from(e);
  }
  function ga(e) {
    if (e instanceof ArrayBuffer) return new DataView(e);
    var t = gi(e);
    return new DataView(t.buffer, t.byteOffset, t.byteLength);
  }
  var ya = 100,
    wa = 2048,
    ka = function () {
      function e(t, i, s, n, r, o, l, c) {
        t === void 0 && (t = Fr.defaultCodec), i === void 0 && (i = void 0), s === void 0 && (s = ya), n === void 0 && (n = wa), r === void 0 && (r = !1), o === void 0 && (o = !1), l === void 0 && (l = !1), c === void 0 && (c = !1), this.extensionCodec = t, this.context = i, this.maxDepth = s, this.initialBufferSize = n, this.sortKeys = r, this.forceFloat32 = o, this.ignoreUndefined = l, this.forceIntegerToFloat = c, this.pos = 0, this.view = new DataView(new ArrayBuffer(this.initialBufferSize)), this.bytes = new Uint8Array(this.view.buffer);
      }
      return e.prototype.reinitializeState = function () {
        this.pos = 0;
      }, e.prototype.encodeSharedRef = function (t) {
        return this.reinitializeState(), this.doEncode(t, 1), this.bytes.subarray(0, this.pos);
      }, e.prototype.encode = function (t) {
        return this.reinitializeState(), this.doEncode(t, 1), this.bytes.slice(0, this.pos);
      }, e.prototype.doEncode = function (t, i) {
        if (i > this.maxDepth) throw new Error("Too deep objects in depth ".concat(i));
        t == null ? this.encodeNil() : typeof t == "boolean" ? this.encodeBoolean(t) : typeof t == "number" ? this.encodeNumber(t) : typeof t == "string" ? this.encodeString(t) : this.encodeObject(t, i);
      }, e.prototype.ensureBufferSizeToWrite = function (t) {
        var i = this.pos + t;
        this.view.byteLength < i && this.resizeBuffer(i * 2);
      }, e.prototype.resizeBuffer = function (t) {
        var i = new ArrayBuffer(t),
          s = new Uint8Array(i),
          n = new DataView(i);
        s.set(this.bytes), this.view = n, this.bytes = s;
      }, e.prototype.encodeNil = function () {
        this.writeU8(192);
      }, e.prototype.encodeBoolean = function (t) {
        t === !1 ? this.writeU8(194) : this.writeU8(195);
      }, e.prototype.encodeNumber = function (t) {
        Number.isSafeInteger(t) && !this.forceIntegerToFloat ? t >= 0 ? t < 128 ? this.writeU8(t) : t < 256 ? (this.writeU8(204), this.writeU8(t)) : t < 65536 ? (this.writeU8(205), this.writeU16(t)) : t < 4294967296 ? (this.writeU8(206), this.writeU32(t)) : (this.writeU8(207), this.writeU64(t)) : t >= -32 ? this.writeU8(224 | t + 32) : t >= -128 ? (this.writeU8(208), this.writeI8(t)) : t >= -32768 ? (this.writeU8(209), this.writeI16(t)) : t >= -2147483648 ? (this.writeU8(210), this.writeI32(t)) : (this.writeU8(211), this.writeI64(t)) : this.forceFloat32 ? (this.writeU8(202), this.writeF32(t)) : (this.writeU8(203), this.writeF64(t));
      }, e.prototype.writeStringHeader = function (t) {
        if (t < 32) this.writeU8(160 + t);else if (t < 256) this.writeU8(217), this.writeU8(t);else if (t < 65536) this.writeU8(218), this.writeU16(t);else if (t < 4294967296) this.writeU8(219), this.writeU32(t);else throw new Error("Too long string: ".concat(t, " bytes in UTF-8"));
      }, e.prototype.encodeString = function (t) {
        var i = 5,
          s = t.length;
        if (s > Zo) {
          var n = Cs(t);
          this.ensureBufferSizeToWrite(i + n), this.writeStringHeader(n), ta(t, this.bytes, this.pos), this.pos += n;
        } else {
          var n = Cs(t);
          this.ensureBufferSizeToWrite(i + n), this.writeStringHeader(n), Qo(t, this.bytes, this.pos), this.pos += n;
        }
      }, e.prototype.encodeObject = function (t, i) {
        var s = this.extensionCodec.tryToEncode(t, this.context);
        if (s != null) this.encodeExtension(s);else if (Array.isArray(t)) this.encodeArray(t, i);else if (ArrayBuffer.isView(t)) this.encodeBinary(t);else if (typeof t == "object") this.encodeMap(t, i);else throw new Error("Unrecognized object: ".concat(Object.prototype.toString.apply(t)));
      }, e.prototype.encodeBinary = function (t) {
        var i = t.byteLength;
        if (i < 256) this.writeU8(196), this.writeU8(i);else if (i < 65536) this.writeU8(197), this.writeU16(i);else if (i < 4294967296) this.writeU8(198), this.writeU32(i);else throw new Error("Too large binary: ".concat(i));
        var s = gi(t);
        this.writeU8a(s);
      }, e.prototype.encodeArray = function (t, i) {
        var s = t.length;
        if (s < 16) this.writeU8(144 + s);else if (s < 65536) this.writeU8(220), this.writeU16(s);else if (s < 4294967296) this.writeU8(221), this.writeU32(s);else throw new Error("Too large array: ".concat(s));
        for (var n = 0, r = t; n < r.length; n++) {
          var o = r[n];
          this.doEncode(o, i + 1);
        }
      }, e.prototype.countWithoutUndefined = function (t, i) {
        for (var s = 0, n = 0, r = i; n < r.length; n++) {
          var o = r[n];
          t[o] !== void 0 && s++;
        }
        return s;
      }, e.prototype.encodeMap = function (t, i) {
        var s = Object.keys(t);
        this.sortKeys && s.sort();
        var n = this.ignoreUndefined ? this.countWithoutUndefined(t, s) : s.length;
        if (n < 16) this.writeU8(128 + n);else if (n < 65536) this.writeU8(222), this.writeU16(n);else if (n < 4294967296) this.writeU8(223), this.writeU32(n);else throw new Error("Too large map object: ".concat(n));
        for (var r = 0, o = s; r < o.length; r++) {
          var l = o[r],
            c = t[l];
          this.ignoreUndefined && c === void 0 || (this.encodeString(l), this.doEncode(c, i + 1));
        }
      }, e.prototype.encodeExtension = function (t) {
        var i = t.data.length;
        if (i === 1) this.writeU8(212);else if (i === 2) this.writeU8(213);else if (i === 4) this.writeU8(214);else if (i === 8) this.writeU8(215);else if (i === 16) this.writeU8(216);else if (i < 256) this.writeU8(199), this.writeU8(i);else if (i < 65536) this.writeU8(200), this.writeU16(i);else if (i < 4294967296) this.writeU8(201), this.writeU32(i);else throw new Error("Too large extension object: ".concat(i));
        this.writeI8(t.type), this.writeU8a(t.data);
      }, e.prototype.writeU8 = function (t) {
        this.ensureBufferSizeToWrite(1), this.view.setUint8(this.pos, t), this.pos++;
      }, e.prototype.writeU8a = function (t) {
        var i = t.length;
        this.ensureBufferSizeToWrite(i), this.bytes.set(t, this.pos), this.pos += i;
      }, e.prototype.writeI8 = function (t) {
        this.ensureBufferSizeToWrite(1), this.view.setInt8(this.pos, t), this.pos++;
      }, e.prototype.writeU16 = function (t) {
        this.ensureBufferSizeToWrite(2), this.view.setUint16(this.pos, t), this.pos += 2;
      }, e.prototype.writeI16 = function (t) {
        this.ensureBufferSizeToWrite(2), this.view.setInt16(this.pos, t), this.pos += 2;
      }, e.prototype.writeU32 = function (t) {
        this.ensureBufferSizeToWrite(4), this.view.setUint32(this.pos, t), this.pos += 4;
      }, e.prototype.writeI32 = function (t) {
        this.ensureBufferSizeToWrite(4), this.view.setInt32(this.pos, t), this.pos += 4;
      }, e.prototype.writeF32 = function (t) {
        this.ensureBufferSizeToWrite(4), this.view.setFloat32(this.pos, t), this.pos += 4;
      }, e.prototype.writeF64 = function (t) {
        this.ensureBufferSizeToWrite(8), this.view.setFloat64(this.pos, t), this.pos += 8;
      }, e.prototype.writeU64 = function (t) {
        this.ensureBufferSizeToWrite(8), Ko(this.view, this.pos, t), this.pos += 8;
      }, e.prototype.writeI64 = function (t) {
        this.ensureBufferSizeToWrite(8), Br(this.view, this.pos, t), this.pos += 8;
      }, e;
    }();
  function Ki(e) {
    return "".concat(e < 0 ? "-" : "", "0x").concat(Math.abs(e).toString(16).padStart(2, "0"));
  }
  var va = 16,
    xa = 16,
    ba = function () {
      function e(t, i) {
        t === void 0 && (t = va), i === void 0 && (i = xa), this.maxKeyLength = t, this.maxLengthPerKey = i, this.hit = 0, this.miss = 0, this.caches = [];
        for (var s = 0; s < this.maxKeyLength; s++) this.caches.push([]);
      }
      return e.prototype.canBeCached = function (t) {
        return t > 0 && t <= this.maxKeyLength;
      }, e.prototype.find = function (t, i, s) {
        var n = this.caches[s - 1];
        e: for (var r = 0, o = n; r < o.length; r++) {
          for (var l = o[r], c = l.bytes, a = 0; a < s; a++) if (c[a] !== t[i + a]) continue e;
          return l.str;
        }
        return null;
      }, e.prototype.store = function (t, i) {
        var s = this.caches[t.length - 1],
          n = {
            bytes: t,
            str: i
          };
        s.length >= this.maxLengthPerKey ? s[Math.random() * s.length | 0] = n : s.push(n);
      }, e.prototype.decode = function (t, i, s) {
        var n = this.find(t, i, s);
        if (n != null) return this.hit++, n;
        this.miss++;
        var r = Hr(t, i, s),
          o = Uint8Array.prototype.slice.call(t, i, i + s);
        return this.store(o, r), r;
      }, e;
    }(),
    Sa = globalThis && globalThis.__awaiter || function (e, t, i, s) {
      function n(r) {
        return r instanceof i ? r : new i(function (o) {
          o(r);
        });
      }
      return new (i || (i = Promise))(function (r, o) {
        function l(u) {
          try {
            a(s.next(u));
          } catch (p) {
            o(p);
          }
        }
        function c(u) {
          try {
            a(s.throw(u));
          } catch (p) {
            o(p);
          }
        }
        function a(u) {
          u.done ? r(u.value) : n(u.value).then(l, c);
        }
        a((s = s.apply(e, t || [])).next());
      });
    },
    Ji = globalThis && globalThis.__generator || function (e, t) {
      var i = {
          label: 0,
          sent: function () {
            if (r[0] & 1) throw r[1];
            return r[1];
          },
          trys: [],
          ops: []
        },
        s,
        n,
        r,
        o;
      return o = {
        next: l(0),
        throw: l(1),
        return: l(2)
      }, typeof Symbol == "function" && (o[Symbol.iterator] = function () {
        return this;
      }), o;
      function l(a) {
        return function (u) {
          return c([a, u]);
        };
      }
      function c(a) {
        if (s) throw new TypeError("Generator is already executing.");
        for (; i;) try {
          if (s = 1, n && (r = a[0] & 2 ? n.return : a[0] ? n.throw || ((r = n.return) && r.call(n), 0) : n.next) && !(r = r.call(n, a[1])).done) return r;
          switch (n = 0, r && (a = [a[0] & 2, r.value]), a[0]) {
            case 0:
            case 1:
              r = a;
              break;
            case 4:
              return i.label++, {
                value: a[1],
                done: !1
              };
            case 5:
              i.label++, n = a[1], a = [0];
              continue;
            case 7:
              a = i.ops.pop(), i.trys.pop();
              continue;
            default:
              if (r = i.trys, !(r = r.length > 0 && r[r.length - 1]) && (a[0] === 6 || a[0] === 2)) {
                i = 0;
                continue;
              }
              if (a[0] === 3 && (!r || a[1] > r[0] && a[1] < r[3])) {
                i.label = a[1];
                break;
              }
              if (a[0] === 6 && i.label < r[1]) {
                i.label = r[1], r = a;
                break;
              }
              if (r && i.label < r[2]) {
                i.label = r[2], i.ops.push(a);
                break;
              }
              r[2] && i.ops.pop(), i.trys.pop();
              continue;
          }
          a = t.call(e, i);
        } catch (u) {
          a = [6, u], n = 0;
        } finally {
          s = r = 0;
        }
        if (a[0] & 5) throw a[1];
        return {
          value: a[0] ? a[1] : void 0,
          done: !0
        };
      }
    },
    As = globalThis && globalThis.__asyncValues || function (e) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var t = e[Symbol.asyncIterator],
        i;
      return t ? t.call(e) : (e = typeof __values == "function" ? __values(e) : e[Symbol.iterator](), i = {}, s("next"), s("throw"), s("return"), i[Symbol.asyncIterator] = function () {
        return this;
      }, i);
      function s(r) {
        i[r] = e[r] && function (o) {
          return new Promise(function (l, c) {
            o = e[r](o), n(l, c, o.done, o.value);
          });
        };
      }
      function n(r, o, l, c) {
        Promise.resolve(c).then(function (a) {
          r({
            value: a,
            done: l
          });
        }, o);
      }
    },
    St = globalThis && globalThis.__await || function (e) {
      return this instanceof St ? (this.v = e, this) : new St(e);
    },
    Ta = globalThis && globalThis.__asyncGenerator || function (e, t, i) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var s = i.apply(e, t || []),
        n,
        r = [];
      return n = {}, o("next"), o("throw"), o("return"), n[Symbol.asyncIterator] = function () {
        return this;
      }, n;
      function o(h) {
        s[h] && (n[h] = function (m) {
          return new Promise(function (w, v) {
            r.push([h, m, w, v]) > 1 || l(h, m);
          });
        });
      }
      function l(h, m) {
        try {
          c(s[h](m));
        } catch (w) {
          p(r[0][3], w);
        }
      }
      function c(h) {
        h.value instanceof St ? Promise.resolve(h.value.v).then(a, u) : p(r[0][2], h);
      }
      function a(h) {
        l("next", h);
      }
      function u(h) {
        l("throw", h);
      }
      function p(h, m) {
        h(m), r.shift(), r.length && l(r[0][0], r[0][1]);
      }
    },
    Ia = function (e) {
      var t = typeof e;
      return t === "string" || t === "number";
    },
    Dt = -1,
    es = new DataView(new ArrayBuffer(0)),
    Ma = new Uint8Array(es.buffer),
    Cn = function () {
      try {
        es.getInt8(0);
      } catch (e) {
        return e.constructor;
      }
      throw new Error("never reached");
    }(),
    Ds = new Cn("Insufficient data"),
    Ea = new ba(),
    Pa = function () {
      function e(t, i, s, n, r, o, l, c) {
        t === void 0 && (t = Fr.defaultCodec), i === void 0 && (i = void 0), s === void 0 && (s = Ke), n === void 0 && (n = Ke), r === void 0 && (r = Ke), o === void 0 && (o = Ke), l === void 0 && (l = Ke), c === void 0 && (c = Ea), this.extensionCodec = t, this.context = i, this.maxStrLength = s, this.maxBinLength = n, this.maxArrayLength = r, this.maxMapLength = o, this.maxExtLength = l, this.keyDecoder = c, this.totalPos = 0, this.pos = 0, this.view = es, this.bytes = Ma, this.headByte = Dt, this.stack = [];
      }
      return e.prototype.reinitializeState = function () {
        this.totalPos = 0, this.headByte = Dt, this.stack.length = 0;
      }, e.prototype.setBuffer = function (t) {
        this.bytes = gi(t), this.view = ga(this.bytes), this.pos = 0;
      }, e.prototype.appendBuffer = function (t) {
        if (this.headByte === Dt && !this.hasRemaining(1)) this.setBuffer(t);else {
          var i = this.bytes.subarray(this.pos),
            s = gi(t),
            n = new Uint8Array(i.length + s.length);
          n.set(i), n.set(s, i.length), this.setBuffer(n);
        }
      }, e.prototype.hasRemaining = function (t) {
        return this.view.byteLength - this.pos >= t;
      }, e.prototype.createExtraByteError = function (t) {
        var i = this,
          s = i.view,
          n = i.pos;
        return new RangeError("Extra ".concat(s.byteLength - n, " of ").concat(s.byteLength, " byte(s) found at buffer[").concat(t, "]"));
      }, e.prototype.decode = function (t) {
        this.reinitializeState(), this.setBuffer(t);
        var i = this.doDecodeSync();
        if (this.hasRemaining(1)) throw this.createExtraByteError(this.pos);
        return i;
      }, e.prototype.decodeMulti = function (t) {
        return Ji(this, function (i) {
          switch (i.label) {
            case 0:
              this.reinitializeState(), this.setBuffer(t), i.label = 1;
            case 1:
              return this.hasRemaining(1) ? [4, this.doDecodeSync()] : [3, 3];
            case 2:
              return i.sent(), [3, 1];
            case 3:
              return [2];
          }
        });
      }, e.prototype.decodeAsync = function (t) {
        var i, s, n, r;
        return Sa(this, void 0, void 0, function () {
          var o, l, c, a, u, p, h, m;
          return Ji(this, function (w) {
            switch (w.label) {
              case 0:
                o = !1, w.label = 1;
              case 1:
                w.trys.push([1, 6, 7, 12]), i = As(t), w.label = 2;
              case 2:
                return [4, i.next()];
              case 3:
                if (s = w.sent(), !!s.done) return [3, 5];
                if (c = s.value, o) throw this.createExtraByteError(this.totalPos);
                this.appendBuffer(c);
                try {
                  l = this.doDecodeSync(), o = !0;
                } catch (v) {
                  if (!(v instanceof Cn)) throw v;
                }
                this.totalPos += this.pos, w.label = 4;
              case 4:
                return [3, 2];
              case 5:
                return [3, 12];
              case 6:
                return a = w.sent(), n = {
                  error: a
                }, [3, 12];
              case 7:
                return w.trys.push([7,, 10, 11]), s && !s.done && (r = i.return) ? [4, r.call(i)] : [3, 9];
              case 8:
                w.sent(), w.label = 9;
              case 9:
                return [3, 11];
              case 10:
                if (n) throw n.error;
                return [7];
              case 11:
                return [7];
              case 12:
                if (o) {
                  if (this.hasRemaining(1)) throw this.createExtraByteError(this.totalPos);
                  return [2, l];
                }
                throw u = this, p = u.headByte, h = u.pos, m = u.totalPos, new RangeError("Insufficient data in parsing ".concat(Ki(p), " at ").concat(m, " (").concat(h, " in the current buffer)"));
            }
          });
        });
      }, e.prototype.decodeArrayStream = function (t) {
        return this.decodeMultiAsync(t, !0);
      }, e.prototype.decodeStream = function (t) {
        return this.decodeMultiAsync(t, !1);
      }, e.prototype.decodeMultiAsync = function (t, i) {
        return Ta(this, arguments, function () {
          var n, r, o, l, c, a, u, p, h;
          return Ji(this, function (m) {
            switch (m.label) {
              case 0:
                n = i, r = -1, m.label = 1;
              case 1:
                m.trys.push([1, 13, 14, 19]), o = As(t), m.label = 2;
              case 2:
                return [4, St(o.next())];
              case 3:
                if (l = m.sent(), !!l.done) return [3, 12];
                if (c = l.value, i && r === 0) throw this.createExtraByteError(this.totalPos);
                this.appendBuffer(c), n && (r = this.readArraySize(), n = !1, this.complete()), m.label = 4;
              case 4:
                m.trys.push([4, 9,, 10]), m.label = 5;
              case 5:
                return [4, St(this.doDecodeSync())];
              case 6:
                return [4, m.sent()];
              case 7:
                return m.sent(), --r === 0 ? [3, 8] : [3, 5];
              case 8:
                return [3, 10];
              case 9:
                if (a = m.sent(), !(a instanceof Cn)) throw a;
                return [3, 10];
              case 10:
                this.totalPos += this.pos, m.label = 11;
              case 11:
                return [3, 2];
              case 12:
                return [3, 19];
              case 13:
                return u = m.sent(), p = {
                  error: u
                }, [3, 19];
              case 14:
                return m.trys.push([14,, 17, 18]), l && !l.done && (h = o.return) ? [4, St(h.call(o))] : [3, 16];
              case 15:
                m.sent(), m.label = 16;
              case 16:
                return [3, 18];
              case 17:
                if (p) throw p.error;
                return [7];
              case 18:
                return [7];
              case 19:
                return [2];
            }
          });
        });
      }, e.prototype.doDecodeSync = function () {
        e: for (;;) {
          var t = this.readHeadByte(),
            i = void 0;
          if (t >= 224) i = t - 256;else if (t < 192) {
            if (t < 128) i = t;else if (t < 144) {
              var s = t - 128;
              if (s !== 0) {
                this.pushMapState(s), this.complete();
                continue e;
              } else i = {};
            } else if (t < 160) {
              var s = t - 144;
              if (s !== 0) {
                this.pushArrayState(s), this.complete();
                continue e;
              } else i = [];
            } else {
              var n = t - 160;
              i = this.decodeUtf8String(n, 0);
            }
          } else if (t === 192) i = null;else if (t === 194) i = !1;else if (t === 195) i = !0;else if (t === 202) i = this.readF32();else if (t === 203) i = this.readF64();else if (t === 204) i = this.readU8();else if (t === 205) i = this.readU16();else if (t === 206) i = this.readU32();else if (t === 207) i = this.readU64();else if (t === 208) i = this.readI8();else if (t === 209) i = this.readI16();else if (t === 210) i = this.readI32();else if (t === 211) i = this.readI64();else if (t === 217) {
            var n = this.lookU8();
            i = this.decodeUtf8String(n, 1);
          } else if (t === 218) {
            var n = this.lookU16();
            i = this.decodeUtf8String(n, 2);
          } else if (t === 219) {
            var n = this.lookU32();
            i = this.decodeUtf8String(n, 4);
          } else if (t === 220) {
            var s = this.readU16();
            if (s !== 0) {
              this.pushArrayState(s), this.complete();
              continue e;
            } else i = [];
          } else if (t === 221) {
            var s = this.readU32();
            if (s !== 0) {
              this.pushArrayState(s), this.complete();
              continue e;
            } else i = [];
          } else if (t === 222) {
            var s = this.readU16();
            if (s !== 0) {
              this.pushMapState(s), this.complete();
              continue e;
            } else i = {};
          } else if (t === 223) {
            var s = this.readU32();
            if (s !== 0) {
              this.pushMapState(s), this.complete();
              continue e;
            } else i = {};
          } else if (t === 196) {
            var s = this.lookU8();
            i = this.decodeBinary(s, 1);
          } else if (t === 197) {
            var s = this.lookU16();
            i = this.decodeBinary(s, 2);
          } else if (t === 198) {
            var s = this.lookU32();
            i = this.decodeBinary(s, 4);
          } else if (t === 212) i = this.decodeExtension(1, 0);else if (t === 213) i = this.decodeExtension(2, 0);else if (t === 214) i = this.decodeExtension(4, 0);else if (t === 215) i = this.decodeExtension(8, 0);else if (t === 216) i = this.decodeExtension(16, 0);else if (t === 199) {
            var s = this.lookU8();
            i = this.decodeExtension(s, 1);
          } else if (t === 200) {
            var s = this.lookU16();
            i = this.decodeExtension(s, 2);
          } else if (t === 201) {
            var s = this.lookU32();
            i = this.decodeExtension(s, 4);
          } else throw new Pe("Unrecognized type byte: ".concat(Ki(t)));
          this.complete();
          for (var r = this.stack; r.length > 0;) {
            var o = r[r.length - 1];
            if (o.type === 0) {
              if (o.array[o.position] = i, o.position++, o.position === o.size) r.pop(), i = o.array;else continue e;
            } else if (o.type === 1) {
              if (!Ia(i)) throw new Pe("The type of key must be string or number but " + typeof i);
              if (i === "__proto__") throw new Pe("The key __proto__ is not allowed");
              o.key = i, o.type = 2;
              continue e;
            } else if (o.map[o.key] = i, o.readCount++, o.readCount === o.size) r.pop(), i = o.map;else {
              o.key = null, o.type = 1;
              continue e;
            }
          }
          return i;
        }
      }, e.prototype.readHeadByte = function () {
        return this.headByte === Dt && (this.headByte = this.readU8()), this.headByte;
      }, e.prototype.complete = function () {
        this.headByte = Dt;
      }, e.prototype.readArraySize = function () {
        var t = this.readHeadByte();
        switch (t) {
          case 220:
            return this.readU16();
          case 221:
            return this.readU32();
          default:
            {
              if (t < 160) return t - 144;
              throw new Pe("Unrecognized array type byte: ".concat(Ki(t)));
            }
        }
      }, e.prototype.pushMapState = function (t) {
        if (t > this.maxMapLength) throw new Pe("Max length exceeded: map length (".concat(t, ") > maxMapLengthLength (").concat(this.maxMapLength, ")"));
        this.stack.push({
          type: 1,
          size: t,
          key: null,
          readCount: 0,
          map: {}
        });
      }, e.prototype.pushArrayState = function (t) {
        if (t > this.maxArrayLength) throw new Pe("Max length exceeded: array length (".concat(t, ") > maxArrayLength (").concat(this.maxArrayLength, ")"));
        this.stack.push({
          type: 0,
          size: t,
          array: new Array(t),
          position: 0
        });
      }, e.prototype.decodeUtf8String = function (t, i) {
        var s;
        if (t > this.maxStrLength) throw new Pe("Max length exceeded: UTF-8 byte length (".concat(t, ") > maxStrLength (").concat(this.maxStrLength, ")"));
        if (this.bytes.byteLength < this.pos + i + t) throw Ds;
        var n = this.pos + i,
          r;
        return this.stateIsMapKey() && !((s = this.keyDecoder) === null || s === void 0) && s.canBeCached(t) ? r = this.keyDecoder.decode(this.bytes, n, t) : t > sa ? r = ra(this.bytes, n, t) : r = Hr(this.bytes, n, t), this.pos += i + t, r;
      }, e.prototype.stateIsMapKey = function () {
        if (this.stack.length > 0) {
          var t = this.stack[this.stack.length - 1];
          return t.type === 1;
        }
        return !1;
      }, e.prototype.decodeBinary = function (t, i) {
        if (t > this.maxBinLength) throw new Pe("Max length exceeded: bin length (".concat(t, ") > maxBinLength (").concat(this.maxBinLength, ")"));
        if (!this.hasRemaining(t + i)) throw Ds;
        var s = this.pos + i,
          n = this.bytes.subarray(s, s + t);
        return this.pos += i + t, n;
      }, e.prototype.decodeExtension = function (t, i) {
        if (t > this.maxExtLength) throw new Pe("Max length exceeded: ext length (".concat(t, ") > maxExtLength (").concat(this.maxExtLength, ")"));
        var s = this.view.getInt8(this.pos + i),
          n = this.decodeBinary(t, i + 1);
        return this.extensionCodec.decode(n, s, this.context);
      }, e.prototype.lookU8 = function () {
        return this.view.getUint8(this.pos);
      }, e.prototype.lookU16 = function () {
        return this.view.getUint16(this.pos);
      }, e.prototype.lookU32 = function () {
        return this.view.getUint32(this.pos);
      }, e.prototype.readU8 = function () {
        var t = this.view.getUint8(this.pos);
        return this.pos++, t;
      }, e.prototype.readI8 = function () {
        var t = this.view.getInt8(this.pos);
        return this.pos++, t;
      }, e.prototype.readU16 = function () {
        var t = this.view.getUint16(this.pos);
        return this.pos += 2, t;
      }, e.prototype.readI16 = function () {
        var t = this.view.getInt16(this.pos);
        return this.pos += 2, t;
      }, e.prototype.readU32 = function () {
        var t = this.view.getUint32(this.pos);
        return this.pos += 4, t;
      }, e.prototype.readI32 = function () {
        var t = this.view.getInt32(this.pos);
        return this.pos += 4, t;
      }, e.prototype.readU64 = function () {
        var t = Jo(this.view, this.pos);
        return this.pos += 8, t;
      }, e.prototype.readI64 = function () {
        var t = zr(this.view, this.pos);
        return this.pos += 8, t;
      }, e.prototype.readF32 = function () {
        var t = this.view.getFloat32(this.pos);
        return this.pos += 4, t;
      }, e.prototype.readF64 = function () {
        var t = this.view.getFloat64(this.pos);
        return this.pos += 8, t;
      }, e;
    }(),
    rt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {},
    $t = {},
    Ca = {
      get exports() {
        return $t;
      },
      set exports(e) {
        $t = e;
      }
    },
    le = Ca.exports = {},
    Ce,
    Ae;
  function An() {
    throw new Error("setTimeout has not been defined");
  }
  function Dn() {
    throw new Error("clearTimeout has not been defined");
  }
  (function () {
    try {
      typeof setTimeout == "function" ? Ce = setTimeout : Ce = An;
    } catch {
      Ce = An;
    }
    try {
      typeof clearTimeout == "function" ? Ae = clearTimeout : Ae = Dn;
    } catch {
      Ae = Dn;
    }
  })();
  function Vr(e) {
    if (Ce === setTimeout) return setTimeout(e, 0);
    if ((Ce === An || !Ce) && setTimeout) return Ce = setTimeout, setTimeout(e, 0);
    try {
      return Ce(e, 0);
    } catch {
      try {
        return Ce.call(null, e, 0);
      } catch {
        return Ce.call(this, e, 0);
      }
    }
  }
  function Aa(e) {
    if (Ae === clearTimeout) return clearTimeout(e);
    if ((Ae === Dn || !Ae) && clearTimeout) return Ae = clearTimeout, clearTimeout(e);
    try {
      return Ae(e);
    } catch {
      try {
        return Ae.call(null, e);
      } catch {
        return Ae.call(this, e);
      }
    }
  }
  var ze = [],
    Tt = !1,
    Qe,
    li = -1;
  function Da() {
    !Tt || !Qe || (Tt = !1, Qe.length ? ze = Qe.concat(ze) : li = -1, ze.length && Ur());
  }
  function Ur() {
    if (!Tt) {
      var e = Vr(Da);
      Tt = !0;
      for (var t = ze.length; t;) {
        for (Qe = ze, ze = []; ++li < t;) Qe && Qe[li].run();
        li = -1, t = ze.length;
      }
      Qe = null, Tt = !1, Aa(e);
    }
  }
  le.nextTick = function (e) {
    var t = new Array(arguments.length - 1);
    if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) t[i - 1] = arguments[i];
    ze.push(new Lr(e, t)), ze.length === 1 && !Tt && Vr(Ur);
  };
  function Lr(e, t) {
    this.fun = e, this.array = t;
  }
  Lr.prototype.run = function () {
    this.fun.apply(null, this.array);
  };
  le.title = "browser";
  le.browser = !0;
  le.env = {};
  le.argv = [];
  le.version = "";
  le.versions = {};
  function Fe() {}
  le.on = Fe;
  le.addListener = Fe;
  le.once = Fe;
  le.off = Fe;
  le.removeListener = Fe;
  le.removeAllListeners = Fe;
  le.emit = Fe;
  le.prependListener = Fe;
  le.prependOnceListener = Fe;
  le.listeners = function (e) {
    return [];
  };
  le.binding = function (e) {
    throw new Error("process.binding is not supported");
  };
  le.cwd = function () {
    return "/";
  };
  le.chdir = function (e) {
    throw new Error("process.chdir is not supported");
  };
  le.umask = function () {
    return 0;
  };
  const Oa = 1920,
    Ra = 1080,
    _a = 9,
    Nr = $t && $t.argv.indexOf("--largeserver") != -1 ? 80 : 40,
    Ba = Nr + 10,
    za = 6,
    Ha = 3e3,
    Fa = 10,
    Va = 5,
    Ua = 50,
    La = 4.5,
    Na = 15,
    qa = 0.9,
    Wa = 3e3,
    Xa = 60,
    Ga = 35,
    Ya = 3e3,
    $a = 500;
  window.inSandbox = /sandbox\./.test(location.href);
  const Ka = $t && {}.IS_SANDBOX,
    isSandbox = window.location.hostname == "sandbox.moomoo.io",
    Ja = 100,
    Qa = Math.PI / 2.6,
    Za = 10,
    ja = 0.25,
    el = Math.PI / 2,
    tl = 35,
    il = 0.0016,
    nl = 0.993,
    sl = 34,
    rl = ["#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373"],
    ol = 7,
    al = 0.06,
    ll = ["Sid", "Steph", "Bmoe", "Romn", "Jononthecool", "Fiona", "Vince", "Nathan", "Nick", "Flappy", "Ronald", "Otis", "Pepe", "Mc Donald", "Theo", "Fabz", "Oliver", "Jeff", "Jimmy", "Helena", "Reaper", "Ben", "Alan", "Naomi", "XYZ", "Clever", "Jeremy", "Mike", "Destined", "Stallion", "Allison", "Meaty", "Sophia", "Vaja", "Joey", "Pendy", "Murdoch", "Theo", "Jared", "July", "Sonia", "Mel", "Dexter", "Quinn", "Milky"],
    cl = Math.PI / 3,
    ci = [{
      id: 0,
      src: "",
      xp: 0,
      val: 1
    }, {
      id: 1,
      src: "_g",
      xp: 3e3,
      val: 1.1
    }, {
      id: 2,
      src: "_d",
      xp: 7e3,
      val: 1.18
    }, {
      id: 3,
      src: "_r",
      poison: !0,
      xp: 12e3,
      val: 1.18
    }],
    hl = function (e) {
      const t = e.weaponXP[e.weaponIndex] || 0;
      for (let i = ci.length - 1; i >= 0; --i) if (t >= ci[i].xp) return ci[i];
    },
    fl = ["wood", "food", "stone", "points"],
    ul = 7,
    dl = 9,
    pl = 3,
    ml = 32,
    gl = 7,
    yl = 724,
    wl = 114,
    kl = 0.0011,
    vl = 1e-4,
    xl = 1.3,
    bl = [150, 160, 165, 175],
    Sl = [80, 85, 95],
    Tl = [80, 85, 90],
    Il = 2400,
    Ml = 0.75,
    El = 15,
    ts = 14400,
    Pl = 40,
    Cl = 2200,
    Al = 0.6,
    Dl = 1,
    Ol = 0.3,
    Rl = 0.3,
    _l = 144e4,
    is = 320,
    Bl = 100,
    zl = 2,
    Hl = 3200,
    Fl = 1440,
    Vl = 0.2,
    Ul = -1,
    Ll = ts - is - 120,
    Nl = ts - is - 120,
    T = {
      maxScreenWidth: Oa,
      maxScreenHeight: Ra,
      serverUpdateRate: _a,
      maxPlayers: Nr,
      maxPlayersHard: Ba,
      collisionDepth: za,
      minimapRate: Ha,
      colGrid: Fa,
      clientSendRate: Va,
      healthBarWidth: Ua,
      healthBarPad: La,
      iconPadding: Na,
      iconPad: qa,
      deathFadeout: Wa,
      crownIconScale: Xa,
      crownPad: Ga,
      chatCountdown: Ya,
      chatCooldown: $a,
      inSandbox: Ka,
      isSandbox: isSandbox,
      maxAge: Ja,
      gatherAngle: Qa,
      gatherWiggle: Za,
      hitReturnRatio: ja,
      hitAngle: el,
      playerScale: tl,
      playerSpeed: il,
      playerDecel: nl,
      nameY: sl,
      skinColors: rl,
      animalCount: ol,
      aiTurnRandom: al,
      cowNames: ll,
      shieldAngle: cl,
      weaponVariants: ci,
      fetchVariant: hl,
      resourceTypes: fl,
      areaCount: ul,
      treesPerArea: dl,
      bushesPerArea: pl,
      totalRocks: ml,
      goldOres: gl,
      riverWidth: yl,
      riverPadding: wl,
      waterCurrent: kl,
      waveSpeed: vl,
      waveMax: xl,
      treeScales: bl,
      bushScales: Sl,
      rockScales: Tl,
      snowBiomeTop: Il,
      snowSpeed: Ml,
      maxNameLength: El,
      mapScale: ts,
      mapPingScale: Pl,
      mapPingTime: Cl,
      volcanoScale: is,
      innerVolcanoScale: Bl,
      volcanoAnimalStrength: zl,
      volcanoAnimationDuration: Hl,
      volcanoAggressionRadius: Fl,
      volcanoAggressionPercentage: Vl,
      volcanoDamagePerSecond: Ul,
      volcanoLocationX: Ll,
      volcanoLocationY: Nl,
      MAX_ATTACK: Al,
      MAX_SPAWN_DELAY: Dl,
      MAX_SPEED: Ol,
      MAX_TURN_SPEED: Rl,
      DAY_INTERVAL: _l
    },
    ql = new ka(),
    Wl = new Pa(),
    ee = {
      socket: null,
      connected: !1,
      socketId: -1,
      connect: function (e, t, i) {
        if (this.socket) return;
        const s = this;
        try {
          let n = !1;
          const r = e;
          this.socket = new WebSocket(e), this.socket.binaryType = "arraybuffer", this.socket.onmessage = function (o) {
            var a = new Uint8Array(o.data);
            const l = Wl.decode(a),
              c = l[0];
            var a = l[1];
            c == "io-init" ? s.socketId = a[0] : i[c].apply(void 0, a);
          }, this.socket.onopen = function () {
            s.connected = !0, t();
          }, this.socket.onclose = function (o) {
            s.connected = !1, o.code == 4001 ? t("Invalid Connection") : n || t("disconnected");
          }, this.socket.onerror = function (o) {
            this.socket && this.socket.readyState != WebSocket.OPEN && (n = !0, console.error("Socket error", arguments), t("Socket error"));
          };
        } catch (n) {
          console.warn("Socket connection error:", n), t(n);
        }
      },
      send: function (e) {
        const t = Array.prototype.slice.call(arguments, 1);
        if (e == "6") {
          // ANTI PROFANITY:
          let profanity = ["cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"];
          let tmpString;
          profanity.forEach(profany => {
            if (t[0].indexOf(profany) > -1) {
              tmpString = "";
              for (let i = 0; i < profany.length; ++i) {
                if (i == 1) {
                  tmpString += String.fromCharCode(0);
                }
                tmpString += profany[i];
              }
              let re = new RegExp(profany, "g");
              t[0] = t[0].replace(re, tmpString);
            }
          }); // FIX CHAT:
          t[0] = t[0].slice(0, 30);
        } else if (e == "L") {
          // MAKE SAME CLAN:
          t[0] = t[0] + String.fromCharCode(0);
          t[0] = t[0].slice(0, 7);
        }
        const i = ql.encode([e, t]);
        if (this.socket) {
          this.socket.send(i);
          minPacket++;
          secPacket++;
        }
      },
      socketReady: function () {
        return this.socket && this.connected;
      },
      close: function () {
        this.socket && this.socket.close(), this.socket = null, this.connected = !1;
      }
    };
  var qr = Math.abs;
  const Xl = Math.sqrt;
  var qr = Math.abs;
  const Gl = Math.atan2,
    toRad = function (angle) {
      return angle * (Math.PI / 180);
    },
    Qi = Math.PI,
    Yl = function (e, t) {
      return Math.floor(Math.random() * (t - e + 1)) + e;
    },
    $l = function (e, t) {
      return Math.random() * (t - e + 1) + e;
    },
    Kl = function (e, t, i) {
      return e + (t - e) * i;
    },
    Jl = function (e, t) {
      return e > 0 ? e = Math.max(0, e - t) : e < 0 && (e = Math.min(0, e + t)), e;
    },
    Ql = function (e, t, i, s) {
      return Xl((i -= e) * i + (s -= t) * s);
    },
    getDist = function (tmp1, tmp2, type1, type2) {
      let tmpXY1 = {
        x: type1 == 0 ? tmp1.x : type1 == 1 ? tmp1.x1 : type1 == 2 ? tmp1.x2 : type1 == 3 && tmp1.x3,
        y: type1 == 0 ? tmp1.y : type1 == 1 ? tmp1.y1 : type1 == 2 ? tmp1.y2 : type1 == 3 && tmp1.y3
      };
      let tmpXY2 = {
        x: type2 == 0 ? tmp2.x : type2 == 1 ? tmp2.x1 : type2 == 2 ? tmp2.x2 : type2 == 3 && tmp2.x3,
        y: type2 == 0 ? tmp2.y : type2 == 1 ? tmp2.y1 : type2 == 2 ? tmp2.y2 : type2 == 3 && tmp2.y3
      };
      return Xl((tmpXY2.x -= tmpXY1.x) * tmpXY2.x + (tmpXY2.y -= tmpXY1.y) * tmpXY2.y);
    },
    Zl = function (e, t, i, s) {
      return Gl(t - s, e - i);
    },
    getDirect = function (tmp1, tmp2, type1, type2) {
      let tmpXY1 = {
        x: type1 == 0 ? tmp1.x : type1 == 1 ? tmp1.x1 : type1 == 2 ? tmp1.x2 : type1 == 3 && tmp1.x3,
        y: type1 == 0 ? tmp1.y : type1 == 1 ? tmp1.y1 : type1 == 2 ? tmp1.y2 : type1 == 3 && tmp1.y3
      };
      let tmpXY2 = {
        x: type2 == 0 ? tmp2.x : type2 == 1 ? tmp2.x1 : type2 == 2 ? tmp2.x2 : type2 == 3 && tmp2.x3,
        y: type2 == 0 ? tmp2.y : type2 == 1 ? tmp2.y1 : type2 == 2 ? tmp2.y2 : type2 == 3 && tmp2.y3
      };
      return Gl(tmpXY1.y - tmpXY2.y, tmpXY1.x - tmpXY2.x);
    },
    jl = function (e, t) {
      const i = qr(t - e) % (Qi * 2);
      return i > Qi ? Qi * 2 - i : i;
    },
    ec = function (e) {
      return typeof e == "number" && !isNaN(e) && isFinite(e);
    },
    tc = function (e) {
      return e && typeof e == "string";
    },
    ic = function (e) {
      return e > 999 ? (e / 1e3).toFixed(1) + "k" : e;
    },
    nc = function (e) {
      return e.charAt(0).toUpperCase() + e.slice(1);
    },
    sc = function (e, t) {
      return e ? parseFloat(e.toFixed(t)) : 0;
    },
    rc = function (e, t) {
      return parseFloat(t.points) - parseFloat(e.points);
    },
    oc = function (e, t, i, s, n, r, o, l) {
      let c = n,
        a = o;
      if (n > o && (c = o, a = n), a > i && (a = i), c < e && (c = e), c > a) return !1;
      let u = r,
        p = l;
      const h = o - n;
      if (Math.abs(h) > 1e-7) {
        const m = (l - r) / h,
          w = r - m * n;
        u = m * c + w, p = m * a + w;
      }
      if (u > p) {
        const m = p;
        p = u, u = m;
      }
      return p > s && (p = s), u < t && (u = t), !(u > p);
    },
    Wr = function (e, t, i) {
      const s = e.getBoundingClientRect(),
        n = s.left + window.scrollX,
        r = s.top + window.scrollY,
        o = s.width,
        l = s.height,
        c = t > n && t < n + o,
        a = i > r && i < r + l;
      return c && a;
    },
    hi = function (e) {
      const t = e.changedTouches[0];
      e.screenX = t.screenX, e.screenY = t.screenY, e.clientX = t.clientX, e.clientY = t.clientY, e.pageX = t.pageX, e.pageY = t.pageY;
    },
    Xr = function (e, t) {
      const i = !t;
      let s = !1;
      const n = !1;
      e.addEventListener("touchstart", Be(r), n), e.addEventListener("touchmove", Be(o), n), e.addEventListener("touchend", Be(l), n), e.addEventListener("touchcancel", Be(l), n), e.addEventListener("touchleave", Be(l), n);
      function r(c) {
        hi(c), window.setUsingTouch(!0), i && (c.preventDefault(), c.stopPropagation()), e.onmouseover && e.onmouseover(c), s = !0;
      }
      function o(c) {
        hi(c), window.setUsingTouch(!0), i && (c.preventDefault(), c.stopPropagation()), Wr(e, c.pageX, c.pageY) ? s || (e.onmouseover && e.onmouseover(c), s = !0) : s && (e.onmouseout && e.onmouseout(c), s = !1);
      }
      function l(c) {
        hi(c), window.setUsingTouch(!0), i && (c.preventDefault(), c.stopPropagation()), s && (e.onclick && e.onclick(c), e.onmouseout && e.onmouseout(c), s = !1);
      }
    },
    ac = function (e) {
      for (; e.hasChildNodes();) e.removeChild(e.lastChild);
    },
    lc = function (e) {
      const t = document.createElement(e.tag || "div");
      function i(s, n) {
        e[s] && (t[n] = e[s]);
      }
      i("text", "textContent"), i("html", "innerHTML"), i("class", "className");
      for (const s in e) {
        switch (s) {
          case "tag":
          case "text":
          case "html":
          case "class":
          case "style":
          case "hookTouch":
          case "parent":
          case "children":
            continue;
        }
        t[s] = e[s];
      }
      if (t.onclick && (t.onclick = Be(t.onclick)), t.onmouseover && (t.onmouseover = Be(t.onmouseover)), t.onmouseout && (t.onmouseout = Be(t.onmouseout)), e.style && (t.style.cssText = e.style), e.hookTouch && Xr(t), e.parent && e.parent.appendChild(t), e.children) for (let s = 0; s < e.children.length; s++) t.appendChild(e.children[s]);
      return t;
    },
    Gr = function (e) {
      return e && typeof e.isTrusted == "boolean" ? e.isTrusted : !0;
    },
    Be = function (e) {
      return function (t) {
        t && t instanceof Event && Gr(t) && e(t);
      };
    },
    cc = function (e) {
      let t = "";
      const i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let s = 0; s < e; s++) t += i.charAt(Math.floor(Math.random() * i.length));
      return t;
    },
    hc = function (e, t) {
      let i = 0;
      for (let s = 0; s < e.length; s++) e[s] === t && i++;
      return i;
    },
    C = {
      randInt: Yl,
      randFloat: $l,
      lerp: Kl,
      decel: Jl,
      getDistance: Ql,
      getDist: getDist,
      getDirection: Zl,
      getDirect: getDirect,
      getAngleDist: jl,
      isNumber: ec,
      isString: tc,
      kFormat: ic,
      capitalizeFirst: nc,
      fixTo: sc,
      sortByPoints: rc,
      lineInRect: oc,
      containsPoint: Wr,
      mousifyTouchEvent: hi,
      hookTouchEvents: Xr,
      removeAllChildren: ac,
      generateElement: lc,
      eventIsTrusted: Gr,
      checkTrusted: Be,
      randomString: cc,
      countInArray: hc
    },
    fc = function () {
      // INIT:
      this.init = function (x, y, scale, speed, life, text, color) {
        this.x = x;
        this.y = y;
        this.randomX = Math.floor(Math.random() * 2);
        this.randomSpeed = Math.floor(Math.random() * 5);
        this.moveSpeed = 10;
        this.color = color;
        this.scale = scale;
        this.startScale = this.scale;
        this.maxScale = scale * 1.5;
        this.scaleSpeed = getEl("visualtype").value == "2" ? 0.35 : 0.7;
        this.speed = speed;
        this.life = life;
        this.life2 = this.life;
        this.startLife = this.life;
        this.text = text;
        this.animation = 0;
        this.maxAnim = 100;
        this.acc = 1;
        this.acc2 = 1;
      }; // UPDATE:
      this.update = function (delta) {
        if (this.life) {
          this.life -= delta;
          this.animation += 6;
          if (getEl("visualtype").value == "2") {
            if (this.animation < this.maxAnim) {
              this.acc -= 0.05;
              this.y -= this.speed * this.acc * delta;
            } else {
              this.life2 -= delta * 1.9;
              this.acc += 0.05;
              this.y += this.speed * this.acc * delta;
            }
            if (this.randomX == 1) {
              this.x += this.moveSpeed;
            } else if (this.randomX == 0) {
              this.x -= this.moveSpeed;
            }
            this.moveSpeed = Math.max(0, this.moveSpeed - 1);
            this.scale += this.scaleSpeed * delta;
            if (this.scale >= this.maxScale) {
              this.scale = this.maxScale;
              this.scaleSpeed *= -1;
            } else if (this.scale <= this.startScale) {
              this.scaleSpeed = 0;
              this.scale -= 0.1;
            }
          } else {
            this.y -= this.speed * delta;
            this.scale += this.scaleSpeed * delta;
            if (this.scale >= this.maxScale) {
              this.scale = this.maxScale;
              this.scaleSpeed *= -1;
            } else if (this.scale <= this.startScale) {
              this.scale = this.startScale;
              this.scaleSpeed = 0;
            }
            if (this.life <= 0) {
              this.life = 0;
            }
          }
        }
      }; // RENDER:
      this.render = function (ctxt, xOff, yOff) {
        if (getEl("visualtype").value == "2") {
          ctxt.globalAlpha = Math.min(1, this.life2 / this.startLife);
        }
        ctxt.fillStyle = this.color;
        ctxt.font = this.scale + "px Hammersmith One";
        ctxt.fillText(this.text, this.x - xOff, this.y - yOff);
      };
    },
    uc = function () {
      // TEXT MANAGER:
      this.texts = [];
      this.stack = []; // UPDATE:
      this.update = function (delta, ctxt, xOff, yOff) {
        ctxt.textBaseline = "middle";
        ctxt.textAlign = "center";
        for (let i = 0; i < this.texts.length; ++i) {
          if (this.texts[i].life) {
            this.texts[i].update(delta);
            this.texts[i].render(ctxt, xOff, yOff);
          }
        }
      }; // SHOW TEXT:
      this.showText = function (x, y, scale, speed, life, text, color) {
        let tmpText;
        for (let i = 0; i < this.texts.length; ++i) {
          if (!this.texts[i].life) {
            tmpText = this.texts[i];
            break;
          }
        }
        if (!tmpText) {
          tmpText = new fc();
          this.texts.push(tmpText);
        }
        tmpText.init(x, y, scale, speed, life, text, color);
      };
    },
    dc = function (e, t) {
      let i;
      this.sounds = [], this.active = !0, this.play = function (s, n, r) {
        !n || !this.active || (i = this.sounds[s], i || (i = new Howl({
          src: ".././sound/" + s + ".mp3"
        }), this.sounds[s] = i), (!r || !i.isPlaying) && (i.isPlaying = !0, i.play(), i.volume((n || 1) * e.volumeMult), i.loop(r)));
      }, this.toggleMute = function (s, n) {
        i = this.sounds[s], i && i.mute(n);
      }, this.stop = function (s) {
        i = this.sounds[s], i && (i.stop(), i.isPlaying = !1);
      };
    },
    Os = Math.floor,
    Rs = Math.abs,
    Ot = Math.cos,
    Rt = Math.sin,
    pc = Math.sqrt;
  function mc(e, t, i, s, n, r) {
    this.objects = t, this.grids = {}, this.updateObjects = [];
    let o, l;
    const c = s.mapScale / s.colGrid;
    this.setObjectGrids = function (h) {
      const m = Math.min(s.mapScale, Math.max(0, h.x)),
        w = Math.min(s.mapScale, Math.max(0, h.y));
      for (let v = 0; v < s.colGrid; ++v) {
        o = v * c;
        for (let x = 0; x < s.colGrid; ++x) l = x * c, m + h.scale >= o && m - h.scale <= o + c && w + h.scale >= l && w - h.scale <= l + c && (this.grids[v + "_" + x] || (this.grids[v + "_" + x] = []), this.grids[v + "_" + x].push(h), h.gridLocations.push(v + "_" + x));
      }
    }, this.removeObjGrid = function (h) {
      let m;
      for (let w = 0; w < h.gridLocations.length; ++w) m = this.grids[h.gridLocations[w]].indexOf(h), m >= 0 && this.grids[h.gridLocations[w]].splice(m, 1);
    }, this.disableObj = function (h) {
      if (h.active = !1, r) {
        h.owner && h.pps && (h.owner.pps -= h.pps), this.removeObjGrid(h);
        const m = this.updateObjects.indexOf(h);
        m >= 0 && this.updateObjects.splice(m, 1);
      }
    }, this.hitObj = function (h, m) {
      for (let w = 0; w < n.length; ++w) n[w].active && (h.sentTo[n[w].id] && (h.active ? n[w].canSee(h) && r.send(n[w].id, "L", i.fixTo(m, 1), h.sid) : r.send(n[w].id, "Q", h.sid)), !h.active && h.owner == n[w] && n[w].changeItemCount(h.group.id, -1));
    };
    const a = [];
    let u;
    this.getGridArrays = function (h, m, w) {
      o = Os(h / c), l = Os(m / c), a.length = 0;
      try {
        this.grids[o + "_" + l] && a.push(this.grids[o + "_" + l]), h + w >= (o + 1) * c && (u = this.grids[o + 1 + "_" + l], u && a.push(u), l && m - w <= l * c ? (u = this.grids[o + 1 + "_" + (l - 1)], u && a.push(u)) : m + w >= (l + 1) * c && (u = this.grids[o + 1 + "_" + (l + 1)], u && a.push(u))), o && h - w <= o * c && (u = this.grids[o - 1 + "_" + l], u && a.push(u), l && m - w <= l * c ? (u = this.grids[o - 1 + "_" + (l - 1)], u && a.push(u)) : m + w >= (l + 1) * c && (u = this.grids[o - 1 + "_" + (l + 1)], u && a.push(u))), m + w >= (l + 1) * c && (u = this.grids[o + "_" + (l + 1)], u && a.push(u)), l && m - w <= l * c && (u = this.grids[o + "_" + (l - 1)], u && a.push(u));
      } catch {}
      return a;
    };
    let p;
    this.add = function (h, m, w, v, x, D, k, S, O) {
      p = null;
      for (var U = 0; U < t.length; ++U) if (t[U].sid == h) {
        p = t[U];
        break;
      }
      if (!p) {
        for (var U = 0; U < t.length; ++U) if (!t[U].active) {
          p = t[U];
          break;
        }
      }
      p || (p = new e(h), t.push(p)), S && (p.sid = h), p.init(m, w, v, x, D, k, O), r && (this.setObjectGrids(p), p.doUpdate && this.updateObjects.push(p));
    }, this.disableBySid = function (h) {
      for (let m = 0; m < t.length; ++m) if (t[m].sid == h) {
        this.disableObj(t[m]);
        break;
      }
    }, this.removeAllItems = function (h, m) {
      for (let w = 0; w < t.length; ++w) t[w].active && t[w].owner && t[w].owner.sid == h && this.disableObj(t[w]);
      m && m.broadcast("R", h);
    }, this.fetchSpawnObj = function (h) {
      let m = null;
      for (let w = 0; w < t.length; ++w) if (p = t[w], p.active && p.owner && p.owner.sid == h && p.spawnPoint) {
        m = [p.x, p.y], this.disableObj(p), r.broadcast("Q", p.sid), p.owner && p.owner.changeItemCount(p.group.id, -1);
        break;
      }
      return m;
    }, this.checkItemLocation = function (h, m, w, v, x, D, k) {
      for (let S = 0; S < t.length; ++S) {
        const O = t[S].blocker ? t[S].blocker : t[S].getScale(v, t[S].isItem);
        if (t[S].active && i.getDistance(h, m, t[S].x, t[S].y) < w + O) return !1;
      }
      return !(!D && x != 18 && m >= s.mapScale / 2 - s.riverWidth / 2 && m <= s.mapScale / 2 + s.riverWidth / 2);
    }, this.addProjectile = function (h, m, w, v, x) {
      const D = items.projectiles[x];
      let k;
      for (let S = 0; S < projectiles.length; ++S) if (!projectiles[S].active) {
        k = projectiles[S];
        break;
      }
      k || (k = new Projectile(n, i), projectiles.push(k)), k.init(x, h, m, w, D.speed, v, D.scale);
    }, this.checkCollision = function (h, m, w) {
      w = w || 1;
      const v = h.x - m.x,
        x = h.y - m.y;
      let D = h.scale + m.scale;
      if (Rs(v) <= D || Rs(x) <= D) {
        D = h.scale + (m.getScale ? m.getScale() : m.scale);
        let k = pc(v * v + x * x) - D;
        if (k <= 0) {
          if (m.ignoreCollision) m.trap && !h.noTrap && m.owner != h && !(m.owner && m.owner.team && m.owner.team == h.team) ? (h.lockMove = !0, m.hideFromEnemy = !1) : m.boostSpeed ? (h.xVel += w * m.boostSpeed * (m.weightM || 1) * Ot(m.dir), h.yVel += w * m.boostSpeed * (m.weightM || 1) * Rt(m.dir)) : m.healCol ? h.healCol = m.healCol : m.teleport && (h.x = i.randInt(0, s.mapScale), h.y = i.randInt(0, s.mapScale));else {
            const S = i.getDirection(h.x, h.y, m.x, m.y);
            if (i.getDistance(h.x, h.y, m.x, m.y), m.isPlayer ? (k = k * -1 / 2, h.x += k * Ot(S), h.y += k * Rt(S), m.x -= k * Ot(S), m.y -= k * Rt(S)) : (h.x = m.x + D * Ot(S), h.y = m.y + D * Rt(S), h.xVel *= 0.75, h.yVel *= 0.75), m.dmg && m.owner != h && !(m.owner && m.owner.team && m.owner.team == h.team)) {
              h.changeHealth(-m.dmg, m.owner, m);
              const O = 1.5 * (m.weightM || 1);
              h.xVel += O * Ot(S), h.yVel += O * Rt(S), m.pDmg && !(h.skin && h.skin.poisonRes) && (h.dmgOverTime.dmg = m.pDmg, h.dmgOverTime.time = 5, h.dmgOverTime.doer = m.owner), h.colDmg && m.health && (m.changeHealth(-h.colDmg) && this.disableObj(m), this.hitObj(m, i.getDirection(h.x, h.y, m.x, m.y)));
            }
          }
          f;
          return m.zIndex > h.zIndex && (h.zIndex = m.zIndex), !0;
        }
      }
      return !1;
    };
  }
  function gc(e, t, i, s, n, r, o, l, c) {
    this.addProjectile = function (a, u, p, h, m, w, v, x, D) {
      const k = r.projectiles[w];
      let S;
      for (let O = 0; O < t.length; ++O) if (!t[O].active) {
        S = t[O];
        break;
      }
      return S || (S = new e(i, s, n, r, o, l, c), S.sid = t.length, t.push(S)), S.init(w, a, u, p, m, k.dmg, h, k.scale, v), S.ignoreObj = x, S.layer = D || k.layer, S.src = k.src, S;
    };
  }
  function yc(e, t, i, s, n, r, o, l, c) {
    this.aiTypes = [{
      id: 0,
      src: "cow_1",
      killScore: 150,
      health: 500,
      weightM: 0.8,
      speed: 95e-5,
      turnSpeed: 0.001,
      scale: 72,
      drop: ["food", 50]
    }, {
      id: 1,
      src: "pig_1",
      killScore: 200,
      health: 800,
      weightM: 0.6,
      speed: 85e-5,
      turnSpeed: 0.001,
      scale: 72,
      drop: ["food", 80]
    }, {
      id: 2,
      name: "Bull",
      src: "bull_2",
      hostile: !0,
      dmg: 20,
      killScore: 1e3,
      health: 1800,
      weightM: 0.5,
      speed: 94e-5,
      turnSpeed: 74e-5,
      scale: 78,
      viewRange: 800,
      chargePlayer: !0,
      drop: ["food", 100]
    }, {
      id: 3,
      name: "Bully",
      src: "bull_1",
      hostile: !0,
      dmg: 20,
      killScore: 2e3,
      health: 2800,
      weightM: 0.45,
      speed: 0.001,
      turnSpeed: 8e-4,
      scale: 90,
      viewRange: 900,
      chargePlayer: !0,
      drop: ["food", 400]
    }, {
      id: 4,
      name: "Wolf",
      src: "wolf_1",
      hostile: !0,
      dmg: 8,
      killScore: 500,
      health: 300,
      weightM: 0.45,
      speed: 0.001,
      turnSpeed: 0.002,
      scale: 84,
      viewRange: 800,
      chargePlayer: !0,
      drop: ["food", 200]
    }, {
      id: 5,
      name: "Quack",
      src: "chicken_1",
      dmg: 8,
      killScore: 2e3,
      noTrap: !0,
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
      hostile: !0,
      dontRun: !0,
      fixedSpawn: !0,
      spawnDelay: 6e4,
      noTrap: !0,
      colDmg: 100,
      dmg: 40,
      killScore: 8e3,
      health: 18e3,
      weightM: 0.4,
      speed: 7e-4,
      turnSpeed: 0.01,
      scale: 80,
      spriteMlt: 1.8,
      leapForce: 0.9,
      viewRange: 1e3,
      hitRange: 210,
      hitDelay: 1e3,
      chargePlayer: !0,
      drop: ["food", 100]
    }, {
      id: 7,
      name: "Treasure",
      hostile: !0,
      nameScale: 35,
      src: "crate_1",
      fixedSpawn: !0,
      spawnDelay: 12e4,
      colDmg: 200,
      killScore: 5e3,
      health: 2e4,
      weightM: 0.1,
      speed: 0,
      turnSpeed: 0,
      scale: 70,
      spriteMlt: 1
    }, {
      id: 8,
      name: "MOOFIE",
      src: "wolf_2",
      hostile: !0,
      fixedSpawn: !0,
      dontRun: !0,
      hitScare: 4,
      spawnDelay: 3e4,
      noTrap: !0,
      nameScale: 35,
      dmg: 10,
      colDmg: 100,
      killScore: 3e3,
      health: 7e3,
      weightM: 0.45,
      speed: 0.0015,
      turnSpeed: 0.002,
      scale: 90,
      viewRange: 800,
      chargePlayer: !0,
      drop: ["food", 1e3]
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
      weightM: 0.45,
      speed: 0.0015,
      turnSpeed: 0.0025,
      scale: 94,
      viewRange: 1440,
      chargePlayer: !0,
      drop: ["food", 3e3],
      minSpawnRange: 0.85,
      maxSpawnRange: 0.9
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
      weightM: 0.45,
      speed: 0.00115,
      turnSpeed: 0.0025,
      scale: 88,
      viewRange: 1440,
      chargePlayer: !0,
      drop: ["food", 400],
      minSpawnRange: 0.85,
      maxSpawnRange: 0.9
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
      weightM: 0.45,
      speed: 0.00115,
      turnSpeed: 0.0025,
      scale: 94,
      viewRange: 1440,
      chargePlayer: !0,
      drop: ["food", 800],
      minSpawnRange: 0.85,
      maxSpawnRange: 0.9
    }], this.spawn = function (a, u, p, h) {
      if (!this.aiTypes[h]) return console.error("missing ai type", h), this.spawn(a, u, p, 0);
      let m;
      for (let w = 0; w < e.length; ++w) if (!e[w].active) {
        m = e[w];
        break;
      }
      return m || (m = new t(e.length, n, i, s, o, r, l, c), e.push(m)), m.init(a, u, p, h, this.aiTypes[h]), m;
    };
  }
  const ot = Math.PI * 2,
    Zi = 0;
  function wc(e, t, i, s, n, r, o, l) {
    this.sid = e, this.isAI = !0, this.nameIndex = n.randInt(0, r.cowNames.length - 1), this.init = function (p, h, m, w, v) {
      this.x = p, this.y = h, this.startX = v.fixedSpawn ? p : null, this.startY = v.fixedSpawn ? h : null, this.xVel = 0, this.yVel = 0, this.zIndex = 0, this.dir = m, this.dirPlus = 0, this.index = w, this.src = v.src, v.name && (this.name = v.name), (this.name || "").startsWith("💀") && (this.isVolcanoAi = !0), this.weightM = v.weightM, this.speed = v.speed, this.killScore = v.killScore, this.turnSpeed = v.turnSpeed, this.scale = v.scale, this.maxHealth = v.health, this.leapForce = v.leapForce, this.health = this.maxHealth, this.chargePlayer = v.chargePlayer, this.viewRange = v.viewRange, this.drop = v.drop, this.dmg = v.dmg, this.hostile = v.hostile, this.dontRun = v.dontRun, this.hitRange = v.hitRange, this.hitDelay = v.hitDelay, this.hitScare = v.hitScare, this.spriteMlt = v.spriteMlt, this.nameScale = v.nameScale, this.colDmg = v.colDmg, this.noTrap = v.noTrap, this.spawnDelay = v.spawnDelay, this.minSpawnRange = v.minSpawnRange, this.maxSpawnRange = v.maxSpawnRange, this.hitWait = 0, this.waitCount = 1e3, this.moveCount = 0, this.targetDir = 0, this.active = !0, this.alive = !0, this.runFrom = null, this.chargeTarget = null, this.dmgOverTime = {};
    }, this.getVolcanoAggression = function () {
      const p = n.getDistance(this.x, this.y, r.volcanoLocationX, r.volcanoLocationY),
        h = p > r.volcanoAggressionRadius ? 0 : r.volcanoAggressionRadius - p;
      return 1 + r.volcanoAggressionPercentage * (1 - h / r.volcanoAggressionRadius);
    };
    let c = 0;
    this.update = function (p) {
      if (this.active) {
        if (this.spawnCounter) {
          if (this.spawnCounter -= p * (1 + 0) * this.getVolcanoAggression(), this.spawnCounter <= 0) if (this.spawnCounter = 0, this.minSpawnRange || this.maxSpawnRange) {
            const W = r.mapScale * this.minSpawnRange,
              F = r.mapScale * this.maxSpawnRange;
            this.x = n.randInt(W, F), this.y = n.randInt(W, F);
          } else this.x = this.startX || n.randInt(0, r.mapScale), this.y = this.startY || n.randInt(0, r.mapScale);
          return;
        }
        c -= p, c <= 0 && (this.dmgOverTime.dmg && (this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer), this.dmgOverTime.time -= 1, this.dmgOverTime.time <= 0 && (this.dmgOverTime.dmg = 0)), c = 1e3);
        let k = !1,
          S = 1;
        if (!this.zIndex && !this.lockMove && this.y >= r.mapScale / 2 - r.riverWidth / 2 && this.y <= r.mapScale / 2 + r.riverWidth / 2 && (S = 0.33, this.xVel += r.waterCurrent * p), this.lockMove) this.xVel = 0, this.yVel = 0;else if (this.waitCount > 0) {
          if (this.waitCount -= p, this.waitCount <= 0) if (this.chargePlayer) {
            let W, F, _;
            for (var h = 0; h < i.length; ++h) i[h].alive && !(i[h].skin && i[h].skin.bullRepel) && (_ = n.getDistance(this.x, this.y, i[h].x, i[h].y), _ <= this.viewRange && (!W || _ < F) && (F = _, W = i[h]));
            W ? (this.chargeTarget = W, this.moveCount = n.randInt(8e3, 12e3)) : (this.moveCount = n.randInt(1e3, 2e3), this.targetDir = n.randFloat(-Math.PI, Math.PI));
          } else this.moveCount = n.randInt(4e3, 1e4), this.targetDir = n.randFloat(-Math.PI, Math.PI);
        } else if (this.moveCount > 0) {
          var m = this.speed * S * (1 + r.MAX_SPEED * Zi) * this.getVolcanoAggression();
          if (this.runFrom && this.runFrom.active && !(this.runFrom.isPlayer && !this.runFrom.alive) ? (this.targetDir = n.getDirection(this.x, this.y, this.runFrom.x, this.runFrom.y), m *= 1.42) : this.chargeTarget && this.chargeTarget.alive && (this.targetDir = n.getDirection(this.chargeTarget.x, this.chargeTarget.y, this.x, this.y), m *= 1.75, k = !0), this.hitWait && (m *= 0.3), this.dir != this.targetDir) {
            this.dir %= ot;
            const W = (this.dir - this.targetDir + ot) % ot,
              F = Math.min(Math.abs(W - ot), W, this.turnSpeed * p),
              _ = W - Math.PI >= 0 ? 1 : -1;
            this.dir += _ * F + ot;
          }
          this.dir %= ot, this.xVel += m * p * Math.cos(this.dir), this.yVel += m * p * Math.sin(this.dir), this.moveCount -= p, this.moveCount <= 0 && (this.runFrom = null, this.chargeTarget = null, this.waitCount = this.hostile ? 1500 : n.randInt(1500, 6e3));
        }
        this.zIndex = 0, this.lockMove = !1;
        var w;
        const O = n.getDistance(0, 0, this.xVel * p, this.yVel * p),
          U = Math.min(4, Math.max(1, Math.round(O / 40))),
          L = 1 / U;
        for (var h = 0; h < U; ++h) {
          this.xVel && (this.x += this.xVel * p * L), this.yVel && (this.y += this.yVel * p * L), w = t.getGridArrays(this.x, this.y, this.scale);
          for (var v = 0; v < w.length; ++v) for (let F = 0; F < w[v].length; ++F) w[v][F].active && t.checkCollision(this, w[v][F], L);
        }
        let q = !1;
        if (this.hitWait > 0 && (this.hitWait -= p, this.hitWait <= 0)) {
          q = !0, this.hitWait = 0, this.leapForce && !n.randInt(0, 2) && (this.xVel += this.leapForce * Math.cos(this.dir), this.yVel += this.leapForce * Math.sin(this.dir));
          var w = t.getGridArrays(this.x, this.y, this.hitRange),
            x,
            D;
          for (let F = 0; F < w.length; ++F) for (var v = 0; v < w[F].length; ++v) x = w[F][v], x.health && (D = n.getDistance(this.x, this.y, x.x, x.y), D < x.scale + this.hitRange && (x.changeHealth(-this.dmg * 5) && t.disableObj(x), t.hitObj(x, n.getDirection(this.x, this.y, x.x, x.y))));
          for (var v = 0; v < i.length; ++v) i[v].canSee(this) && l.send(i[v].id, "J", this.sid);
        }
        if (k || q) {
          var x, D;
          let _;
          for (var h = 0; h < i.length; ++h) x = i[h], x && x.alive && (D = n.getDistance(this.x, this.y, x.x, x.y), this.hitRange ? !this.hitWait && D <= this.hitRange + x.scale && (q ? (_ = n.getDirection(x.x, x.y, this.x, this.y), x.changeHealth(-this.dmg * (1 + r.MAX_ATTACK * Zi) * this.getVolcanoAggression()), x.xVel += 0.6 * Math.cos(_), x.yVel += 0.6 * Math.sin(_), this.runFrom = null, this.chargeTarget = null, this.waitCount = 3e3, this.hitWait = n.randInt(0, 2) ? 0 : 600) : this.hitWait = this.hitDelay) : D <= this.scale + x.scale && (_ = n.getDirection(x.x, x.y, this.x, this.y), x.changeHealth(-this.dmg * (1 + r.MAX_ATTACK * Zi) * this.getVolcanoAggression()), x.xVel += 0.55 * Math.cos(_), x.yVel += 0.55 * Math.sin(_)));
        }
        this.xVel && (this.xVel *= Math.pow(r.playerDecel, p)), this.yVel && (this.yVel *= Math.pow(r.playerDecel, p));
        const P = this.scale;
        this.x - P < 0 ? (this.x = P, this.xVel = 0) : this.x + P > r.mapScale && (this.x = r.mapScale - P, this.xVel = 0), this.y - P < 0 ? (this.y = P, this.yVel = 0) : this.y + P > r.mapScale && (this.y = r.mapScale - P, this.yVel = 0), this.isVolcanoAi && (this.chargeTarget && (n.getDistance(this.chargeTarget.x, this.chargeTarget.y, r.volcanoLocationX, r.volcanoLocationY) || 0) > r.volcanoAggressionRadius && (this.chargeTarget = null), this.xVel && (this.x < r.volcanoLocationX - r.volcanoAggressionRadius ? (this.x = r.volcanoLocationX - r.volcanoAggressionRadius, this.xVel = 0) : this.x > r.volcanoLocationX + r.volcanoAggressionRadius && (this.x = r.volcanoLocationX + r.volcanoAggressionRadius, this.xVel = 0)), this.yVel && (this.y < r.volcanoLocationY - r.volcanoAggressionRadius ? (this.y = r.volcanoLocationY - r.volcanoAggressionRadius, this.yVel = 0) : this.y > r.volcanoLocationY + r.volcanoAggressionRadius && (this.y = r.volcanoLocationY + r.volcanoAggressionRadius, this.yVel = 0)));
      }
    }, this.canSee = function (p) {
      if (!p || p.skin && p.skin.invisTimer && p.noMovTimer >= p.skin.invisTimer) return !1;
      const h = Math.abs(p.x - this.x) - p.scale,
        m = Math.abs(p.y - this.y) - p.scale;
      return h <= r.maxScreenWidth / 2 * 1.3 && m <= r.maxScreenHeight / 2 * 1.3;
    };
    let a = 0,
      u = 0;
    this.animate = function (p) {
      this.animTime > 0 && (this.animTime -= p, this.animTime <= 0 ? (this.animTime = 0, this.dirPlus = 0, a = 0, u = 0) : u == 0 ? (a += p / (this.animSpeed * r.hitReturnRatio), this.dirPlus = n.lerp(0, this.targetAngle, Math.min(1, a)), a >= 1 && (a = 1, u = 1)) : (a -= p / (this.animSpeed * (1 - r.hitReturnRatio)), this.dirPlus = n.lerp(0, this.targetAngle, Math.max(0, a))));
    }, this.startAnim = function () {
      this.animTime = this.animSpeed = 600, this.targetAngle = Math.PI * 0.8, a = 0, u = 0;
    }, this.changeHealth = function (p, h, m) {
      if (this.active && (this.health += p, m && (this.hitScare && !n.randInt(0, this.hitScare) ? (this.runFrom = m, this.waitCount = 0, this.moveCount = 2e3) : this.hostile && this.chargePlayer && m.isPlayer ? (this.chargeTarget = m, this.waitCount = 0, this.moveCount = 8e3) : this.dontRun || (this.runFrom = m, this.waitCount = 0, this.moveCount = 2e3)), p < 0 && this.hitRange && n.randInt(0, 1) && (this.hitWait = 500), h && h.canSee(this) && p < 0 && l.send(h.id, "8", Math.round(this.x), Math.round(this.y), Math.round(-p), 1), this.health <= 0)) {
        if (this.spawnDelay) this.spawnCounter = this.spawnDelay, this.x = -1e6, this.y = -1e6;else if (this.minSpawnRange || this.maxSpawnRange) {
          const w = r.mapScale * this.minSpawnRange,
            v = r.mapScale * this.maxSpawnRange;
          this.x = n.randInt(w, v), this.y = n.randInt(w, v);
        } else this.x = this.startX || n.randInt(0, r.mapScale), this.y = this.startY || n.randInt(0, r.mapScale);
        if (this.health = this.maxHealth, this.runFrom = null, h && (o(h, this.killScore), this.drop)) for (let w = 0; w < this.drop.length;) h.addResource(r.resourceTypes.indexOf(this.drop[w]), this.drop[w + 1]), w += 2;
      }
    };
  } // Building
  function kc(e) {
    this.sid = e, this.init = function (t, i, s, n, r, o, l) {
      o = o || {}, this.sentTo = {}, this.gridLocations = [], this.active = !0, this.doUpdate = o.doUpdate, this.x = t, this.y = i, this.dir = s, this.xWiggle = 0, this.yWiggle = 0, this.scale = n, this.type = r, this.id = o.id, this.owner = l, this.name = o.name, this.isItem = this.id != null, this.group = o.group, this.health = o.health, this.layer = 2, this.group != null ? this.layer = this.group.layer : this.type == 0 ? this.layer = 3 : this.type == 2 ? this.layer = 0 : this.type == 4 && (this.layer = -1), this.colDiv = o.colDiv || 1, this.blocker = o.blocker, this.ignoreCollision = o.ignoreCollision, this.dontGather = o.dontGather, this.hideFromEnemy = o.hideFromEnemy, this.friction = o.friction, this.projDmg = o.projDmg, this.dmg = o.dmg, this.pDmg = o.pDmg, this.pps = o.pps, this.zIndex = o.zIndex || 0, this.turnSpeed = o.turnSpeed, this.req = o.req, this.trap = o.trap, this.healCol = o.healCol, this.teleport = o.teleport, this.boostSpeed = o.boostSpeed, this.projectile = o.projectile, this.shootRange = o.shootRange, this.shootRate = o.shootRate, this.shootCount = this.shootRate, this.spawnPoint = o.spawnPoint;
    }, this.changeHealth = function (t, i) {
      return this.health += t, this.health <= 0;
    }, this.getScale = function (t, i) {
      return t = t || 1, this.scale * (this.isItem || this.type == 2 || this.type == 3 || this.type == 4 ? 1 : 0.6 * t) * (i ? 1 : this.colDiv);
    }, this.visibleToPlayer = function (t) {
      return !this.hideFromEnemy || this.owner && (this.owner == t || this.owner.team && t.team == this.owner.team);
    }, this.update = function (t) {
      if (this.active) {
        if (this.xWiggle) {
          this.xWiggle *= Math.pow(0.99, t);
        }
        if (this.yWiggle) {
          this.yWiggle *= Math.pow(0.99, t);
        }
        if (this.turnSpeed && this.dmg) {
          this.dir += this.turnSpeed * t;
        }
      }
    };
  }
  const j = [{
      id: 0,
      name: "food",
      sandboxLimit: Infinity,
      layer: 0
    }, {
      id: 1,
      name: "walls",
      place: !0,
      limit: 30,
      sandboxLimit: 99,
      layer: 0
    }, {
      id: 2,
      name: "spikes",
      place: !0,
      limit: 15,
      sandboxLimit: 99,
      layer: 0
    }, {
      id: 3,
      name: "mill",
      place: !0,
      limit: 7,
      sandboxLimit: 299,
      layer: 1
    }, {
      id: 4,
      name: "mine",
      place: !0,
      limit: 1,
      sandboxLimit: 99,
      layer: 0
    }, {
      id: 5,
      name: "trap",
      place: !0,
      limit: 6,
      sandboxLimit: 99,
      layer: -1
    }, {
      id: 6,
      name: "booster",
      place: !0,
      limit: 12,
      sandboxLimit: 299,
      layer: -1
    }, {
      id: 7,
      name: "turret",
      place: !0,
      limit: 2,
      sandboxLimit: 99,
      layer: 1
    }, {
      id: 8,
      name: "watchtower",
      place: !0,
      limit: 12,
      sandboxLimit: 99,
      layer: 1
    }, {
      id: 9,
      name: "buff",
      place: !0,
      limit: 4,
      sandboxLimit: 99,
      layer: -1
    }, {
      id: 10,
      name: "spawn",
      place: !0,
      limit: 1,
      sandboxLimit: 99,
      layer: -1
    }, {
      id: 11,
      name: "sapling",
      place: !0,
      limit: 2,
      sandboxLimit: 99,
      layer: 0
    }, {
      id: 12,
      name: "blocker",
      place: !0,
      limit: 3,
      sandboxLimit: 99,
      layer: -1
    }, {
      id: 13,
      name: "teleporter",
      place: !0,
      limit: 2,
      sandboxLimit: 299,
      layer: -1
    }],
    vc = [{
      indx: 0,
      layer: 0,
      src: "arrow_1",
      dmg: 25,
      speed: 1.6,
      scale: 103,
      range: 1e3
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
    }],
    xc = [{
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
      src: "samurai_1",
      iPad: 1.3,
      length: 130,
      width: 210,
      xOff: -8,
      yOff: 59,
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
      Pdmg: 25,
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
      shield: 0.2,
      xOff: 6,
      yOff: 0,
      Pdmg: 0,
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
      Pdmg: 35,
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
      Pdmg: 30,
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
      Pdmg: 50,
      projectile: 5,
      hideProjectile: true,
      spdMult: 0.6,
      speed: 1500
    }],
    dt = [{
      group: j[0],
      name: "apple",
      desc: "restores 20 health when consumed",
      req: ["food", 10],
      consume: function (e) {
        return e.changeHealth(20, e);
      },
      scale: 22,
      holdOffset: 15,
      healing: 20
    }, {
      age: 3,
      group: j[0],
      name: "cookie",
      desc: "restores 40 health when consumed",
      req: ["food", 15],
      consume: function (e) {
        return e.changeHealth(40, e);
      },
      scale: 27,
      holdOffset: 15,
      healing: 40
    }, {
      age: 7,
      group: j[0],
      name: "cheese",
      desc: "restores 30 health and another 50 over 5 seconds",
      req: ["food", 25],
      consume: function (e) {
        return e.changeHealth(30, e) || e.health < 100 ? (e.dmgOverTime.dmg = -10, e.dmgOverTime.doer = e, e.dmgOverTime.time = 5, !0) : !1;
      },
      healing: 40,
      scale: 27,
      holdOffset: 15,
      healing: 40
    }, {
      group: j[1],
      name: "wood wall",
      desc: "provides protection for your village",
      req: ["wood", 10],
      projDmg: !0,
      health: 380,
      scale: 50,
      holdOffset: 20,
      placeOffset: -5
    }, {
      age: 3,
      group: j[1],
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
      group: j[1],
      name: "castle wall",
      desc: "provides powerful protection for your village",
      req: ["stone", 35],
      health: 1500,
      scale: 52,
      holdOffset: 20,
      placeOffset: -5
    }, {
      group: j[2],
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
      group: j[2],
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
      group: j[2],
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
      group: j[2],
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
      group: j[3],
      name: "windmill",
      desc: "generates gold over time",
      req: ["wood", 50, "stone", 10],
      health: 400,
      pps: 1,
      turnSpeed: 0.0016,
      spritePadding: 25,
      iconLineMult: 12,
      scale: 45,
      holdOffset: 20,
      placeOffset: 5
    }, {
      age: 5,
      pre: 1,
      group: j[3],
      name: "faster windmill",
      desc: "generates more gold over time",
      req: ["wood", 60, "stone", 20],
      health: 500,
      pps: 1.5,
      turnSpeed: 0.0025,
      spritePadding: 25,
      iconLineMult: 12,
      scale: 47,
      holdOffset: 20,
      placeOffset: 5
    }, {
      age: 8,
      pre: 1,
      group: j[3],
      name: "power mill",
      desc: "generates more gold over time",
      req: ["wood", 100, "stone", 50],
      health: 800,
      pps: 2,
      turnSpeed: 0.005,
      spritePadding: 25,
      iconLineMult: 12,
      scale: 47,
      holdOffset: 20,
      placeOffset: 5
    }, {
      age: 5,
      group: j[4],
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
      group: j[11],
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
      group: j[5],
      name: "pit trap",
      desc: "pit that traps enemies if they walk over it",
      req: ["wood", 30, "stone", 30],
      trap: !0,
      ignoreCollision: !0,
      hideFromEnemy: !0,
      health: 500,
      colDiv: 0.2,
      scale: 50,
      holdOffset: 20,
      placeOffset: -5
    }, {
      age: 4,
      group: j[6],
      name: "boost pad",
      desc: "provides boost when stepped on",
      req: ["stone", 20, "wood", 5],
      ignoreCollision: !0,
      boostSpeed: 1.5,
      health: 150,
      colDiv: 0.7,
      scale: 45,
      holdOffset: 20,
      placeOffset: -5
    }, {
      age: 7,
      group: j[7],
      doUpdate: !0,
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
      group: j[8],
      name: "platform",
      desc: "platform to shoot over walls and cross over water",
      req: ["wood", 20],
      ignoreCollision: !0,
      zIndex: 1,
      health: 300,
      scale: 43,
      holdOffset: 20,
      placeOffset: -5
    }, {
      age: 7,
      group: j[9],
      name: "healing pad",
      desc: "standing on it will slowly heal you",
      req: ["wood", 30, "food", 10],
      ignoreCollision: !0,
      healCol: 15,
      health: 400,
      colDiv: 0.7,
      scale: 45,
      holdOffset: 20,
      placeOffset: -5
    }, {
      age: 9,
      group: j[10],
      name: "spawn pad",
      desc: "you will spawn here when you die but it will dissapear",
      req: ["wood", 100, "stone", 100],
      health: 400,
      ignoreCollision: !0,
      spawnPoint: !0,
      scale: 45,
      holdOffset: 20,
      placeOffset: -5
    }, {
      age: 7,
      group: j[12],
      name: "blocker",
      desc: "blocks building in radius",
      req: ["wood", 30, "stone", 25],
      ignoreCollision: !0,
      blocker: 300,
      health: 400,
      colDiv: 0.7,
      scale: 45,
      holdOffset: 20,
      placeOffset: -5
    }, {
      age: 7,
      group: j[13],
      name: "teleporter",
      desc: "teleports you to a random point on the map",
      req: ["wood", 60, "stone", 60],
      ignoreCollision: !0,
      teleport: !0,
      health: 200,
      colDiv: 0.7,
      scale: 45,
      holdOffset: 20,
      placeOffset: -5
    }];
  for (let e = 0; e < dt.length; ++e) dt[e].id = e, dt[e].pre && (dt[e].pre = e - dt[e].pre);
  const R = {
      groups: j,
      projectiles: vc,
      weapons: xc,
      list: dt
    },
    bc = ["ahole", "anus", "ash0le", "ash0les", "asholes", "ass", "Ass Monkey", "Assface", "assh0le", "assh0lez", "asshole", "assholes", "assholz", "asswipe", "azzhole", "bassterds", "bastard", "bastards", "bastardz", "basterds", "basterdz", "Biatch", "bitch", "bitches", "Blow Job", "boffing", "butthole", "buttwipe", "c0ck", "c0cks", "c0k", "Carpet Muncher", "cawk", "cawks", "Clit", "cnts", "cntz", "cock", "cockhead", "cock-head", "cocks", "CockSucker", "cock-sucker", "crap", "cum", "cunt", "cunts", "cuntz", "dick", "dild0", "dild0s", "dildo", "dildos", "dilld0", "dilld0s", "dominatricks", "dominatrics", "dominatrix", "dyke", "enema", "f u c k", "f u c k e r", "fag", "fag1t", "faget", "fagg1t", "faggit", "faggot", "fagg0t", "fagit", "fags", "fagz", "faig", "faigs", "fart", "flipping the bird", "fuck", "fucker", "fuckin", "fucking", "fucks", "Fudge Packer", "fuk", "Fukah", "Fuken", "fuker", "Fukin", "Fukk", "Fukkah", "Fukken", "Fukker", "Fukkin", "g00k", "God-damned", "h00r", "h0ar", "h0re", "hells", "hoar", "hoor", "hoore", "jackoff", "jap", "japs", "jerk-off", "jisim", "jiss", "jizm", "jizz", "knob", "knobs", "knobz", "kunt", "kunts", "kuntz", "Lezzian", "Lipshits", "Lipshitz", "masochist", "masokist", "massterbait", "masstrbait", "masstrbate", "masterbaiter", "masterbate", "masterbates", "Motha Fucker", "Motha Fuker", "Motha Fukkah", "Motha Fukker", "Mother Fucker", "Mother Fukah", "Mother Fuker", "Mother Fukkah", "Mother Fukker", "mother-fucker", "Mutha Fucker", "Mutha Fukah", "Mutha Fuker", "Mutha Fukkah", "Mutha Fukker", "n1gr", "nastt", "nigger;", "nigur;", "niiger;", "niigr;", "orafis", "orgasim;", "orgasm", "orgasum", "oriface", "orifice", "orifiss", "packi", "packie", "packy", "paki", "pakie", "paky", "pecker", "peeenus", "peeenusss", "peenus", "peinus", "pen1s", "penas", "penis", "penis-breath", "penus", "penuus", "Phuc", "Phuck", "Phuk", "Phuker", "Phukker", "polac", "polack", "polak", "Poonani", "pr1c", "pr1ck", "pr1k", "pusse", "pussee", "pussy", "puuke", "puuker", "qweir", "recktum", "rectum", "retard", "sadist", "scank", "schlong", "screwing", "semen", "sex", "sexy", "Sh!t", "sh1t", "sh1ter", "sh1ts", "sh1tter", "sh1tz", "shit", "shits", "shitter", "Shitty", "Shity", "shitz", "Shyt", "Shyte", "Shytty", "Shyty", "skanck", "skank", "skankee", "skankey", "skanks", "Skanky", "slag", "slut", "sluts", "Slutty", "slutz", "son-of-a-bitch", "tit", "turd", "va1jina", "vag1na", "vagiina", "vagina", "vaj1na", "vajina", "vullva", "vulva", "w0p", "wh00r", "wh0re", "whore", "xrated", "xxx", "b!+ch", "bitch", "blowjob", "clit", "arschloch", "fuck", "shit", "ass", "asshole", "b!tch", "b17ch", "b1tch", "bastard", "bi+ch", "boiolas", "buceta", "c0ck", "cawk", "chink", "cipa", "clits", "cock", "cum", "cunt", "dildo", "dirsa", "ejakulate", "fatass", "fcuk", "fuk", "fux0r", "hoer", "hore", "jism", "kawk", "l3itch", "l3i+ch", "masturbate", "masterbat*", "masterbat3", "motherfucker", "s.o.b.", "mofo", "nazi", "nigga", "nigger", "nutsack", "phuck", "pimpis", "pusse", "pussy", "scrotum", "sh!t", "shemale", "shi+", "sh!+", "slut", "smut", "teets", "tits", "boobs", "b00bs", "teez", "testical", "testicle", "titt", "w00se", "jackoff", "wank", "whoar", "whore", "*damn", "*dyke", "*fuck*", "*shit*", "@$$", "amcik", "andskota", "arse*", "assrammer", "ayir", "bi7ch", "bitch*", "bollock*", "breasts", "butt-pirate", "cabron", "cazzo", "chraa", "chuj", "Cock*", "cunt*", "d4mn", "daygo", "dego", "dick*", "dike*", "dupa", "dziwka", "ejackulate", "Ekrem*", "Ekto", "enculer", "faen", "fag*", "fanculo", "fanny", "feces", "feg", "Felcher", "ficken", "fitt*", "Flikker", "foreskin", "Fotze", "Fu(*", "fuk*", "futkretzn", "gook", "guiena", "h0r", "h4x0r", "hell", "helvete", "hoer*", "honkey", "Huevon", "hui", "injun", "jizz", "kanker*", "kike", "klootzak", "kraut", "knulle", "kuk", "kuksuger", "Kurac", "kurwa", "kusi*", "kyrpa*", "lesbo", "mamhoon", "masturbat*", "merd*", "mibun", "monkleigh", "mouliewop", "muie", "mulkku", "muschi", "nazis", "nepesaurio", "nigger*", "orospu", "paska*", "perse", "picka", "pierdol*", "pillu*", "pimmel", "piss*", "pizda", "poontsee", "poop", "porn", "p0rn", "pr0n", "preteen", "pula", "pule", "puta", "puto", "qahbeh", "queef*", "rautenberg", "schaffer", "scheiss*", "schlampe", "schmuck", "screw", "sh!t*", "sharmuta", "sharmute", "shipal", "shiz", "skribz", "skurwysyn", "sphencter", "spic", "spierdalaj", "splooge", "suka", "b00b*", "testicle*", "titt*", "twat", "vittu", "wank*", "wetback*", "wichser", "wop*", "yed", "zabourah"],
    Sc = {
      words: bc
    };
  var Tc = {
      "4r5e": 1,
      "5h1t": 1,
      "5hit": 1,
      a55: 1,
      anal: 1,
      anus: 1,
      ar5e: 1,
      arrse: 1,
      arse: 1,
      ass: 1,
      "ass-fucker": 1,
      asses: 1,
      assfucker: 1,
      assfukka: 1,
      asshole: 1,
      assholes: 1,
      asswhole: 1,
      a_s_s: 1,
      "b!tch": 1,
      b00bs: 1,
      b17ch: 1,
      b1tch: 1,
      ballbag: 1,
      balls: 1,
      ballsack: 1,
      bastard: 1,
      beastial: 1,
      beastiality: 1,
      bellend: 1,
      bestial: 1,
      bestiality: 1,
      "bi+ch": 1,
      biatch: 1,
      bitch: 1,
      bitcher: 1,
      bitchers: 1,
      bitches: 1,
      bitchin: 1,
      bitching: 1,
      bloody: 1,
      "blow job": 1,
      blowjob: 1,
      blowjobs: 1,
      boiolas: 1,
      bollock: 1,
      bollok: 1,
      boner: 1,
      boob: 1,
      boobs: 1,
      booobs: 1,
      boooobs: 1,
      booooobs: 1,
      booooooobs: 1,
      breasts: 1,
      buceta: 1,
      bugger: 1,
      bum: 1,
      "bunny fucker": 1,
      butt: 1,
      butthole: 1,
      buttmuch: 1,
      buttplug: 1,
      c0ck: 1,
      c0cksucker: 1,
      "carpet muncher": 1,
      cawk: 1,
      chink: 1,
      cipa: 1,
      cl1t: 1,
      clit: 1,
      clitoris: 1,
      clits: 1,
      cnut: 1,
      cock: 1,
      "cock-sucker": 1,
      cockface: 1,
      cockhead: 1,
      cockmunch: 1,
      cockmuncher: 1,
      cocks: 1,
      cocksuck: 1,
      cocksucked: 1,
      cocksucker: 1,
      cocksucking: 1,
      cocksucks: 1,
      cocksuka: 1,
      cocksukka: 1,
      cok: 1,
      cokmuncher: 1,
      coksucka: 1,
      coon: 1,
      cox: 1,
      crap: 1,
      cum: 1,
      cummer: 1,
      cumming: 1,
      cums: 1,
      cumshot: 1,
      cunilingus: 1,
      cunillingus: 1,
      cunnilingus: 1,
      cunt: 1,
      cuntlick: 1,
      cuntlicker: 1,
      cuntlicking: 1,
      cunts: 1,
      cyalis: 1,
      cyberfuc: 1,
      cyberfuck: 1,
      cyberfucked: 1,
      cyberfucker: 1,
      cyberfuckers: 1,
      cyberfucking: 1,
      d1ck: 1,
      damn: 1,
      dick: 1,
      dickhead: 1,
      dildo: 1,
      dildos: 1,
      dink: 1,
      dinks: 1,
      dirsa: 1,
      dlck: 1,
      "dog-fucker": 1,
      doggin: 1,
      dogging: 1,
      donkeyribber: 1,
      doosh: 1,
      duche: 1,
      dyke: 1,
      ejaculate: 1,
      ejaculated: 1,
      ejaculates: 1,
      ejaculating: 1,
      ejaculatings: 1,
      ejaculation: 1,
      ejakulate: 1,
      "f u c k": 1,
      "f u c k e r": 1,
      f4nny: 1,
      fag: 1,
      fagging: 1,
      faggitt: 1,
      faggot: 1,
      faggs: 1,
      fagot: 1,
      fagots: 1,
      fags: 1,
      fanny: 1,
      fannyflaps: 1,
      fannyfucker: 1,
      fanyy: 1,
      fatass: 1,
      fcuk: 1,
      fcuker: 1,
      fcuking: 1,
      feck: 1,
      fecker: 1,
      felching: 1,
      fellate: 1,
      fellatio: 1,
      fingerfuck: 1,
      fingerfucked: 1,
      fingerfucker: 1,
      fingerfuckers: 1,
      fingerfucking: 1,
      fingerfucks: 1,
      fistfuck: 1,
      fistfucked: 1,
      fistfucker: 1,
      fistfuckers: 1,
      fistfucking: 1,
      fistfuckings: 1,
      fistfucks: 1,
      flange: 1,
      fook: 1,
      fooker: 1,
      fuck: 1,
      fucka: 1,
      fucked: 1,
      fucker: 1,
      fuckers: 1,
      fuckhead: 1,
      fuckheads: 1,
      fuckin: 1,
      fucking: 1,
      fuckings: 1,
      fuckingshitmotherfucker: 1,
      fuckme: 1,
      fucks: 1,
      fuckwhit: 1,
      fuckwit: 1,
      "fudge packer": 1,
      fudgepacker: 1,
      fuk: 1,
      fuker: 1,
      fukker: 1,
      fukkin: 1,
      fuks: 1,
      fukwhit: 1,
      fukwit: 1,
      fux: 1,
      fux0r: 1,
      f_u_c_k: 1,
      gangbang: 1,
      gangbanged: 1,
      gangbangs: 1,
      gaylord: 1,
      gaysex: 1,
      goatse: 1,
      God: 1,
      "god-dam": 1,
      "god-damned": 1,
      goddamn: 1,
      goddamned: 1,
      hardcoresex: 1,
      hell: 1,
      heshe: 1,
      hoar: 1,
      hoare: 1,
      hoer: 1,
      homo: 1,
      hore: 1,
      horniest: 1,
      horny: 1,
      hotsex: 1,
      "jack-off": 1,
      jackoff: 1,
      jap: 1,
      "jerk-off": 1,
      jism: 1,
      jiz: 1,
      jizm: 1,
      jizz: 1,
      kawk: 1,
      knob: 1,
      knobead: 1,
      knobed: 1,
      knobend: 1,
      knobhead: 1,
      knobjocky: 1,
      knobjokey: 1,
      kock: 1,
      kondum: 1,
      kondums: 1,
      kum: 1,
      kummer: 1,
      kumming: 1,
      kums: 1,
      kunilingus: 1,
      "l3i+ch": 1,
      l3itch: 1,
      labia: 1,
      lust: 1,
      lusting: 1,
      m0f0: 1,
      m0fo: 1,
      m45terbate: 1,
      ma5terb8: 1,
      ma5terbate: 1,
      masochist: 1,
      "master-bate": 1,
      masterb8: 1,
      "masterbat*": 1,
      masterbat3: 1,
      masterbate: 1,
      masterbation: 1,
      masterbations: 1,
      masturbate: 1,
      "mo-fo": 1,
      mof0: 1,
      mofo: 1,
      mothafuck: 1,
      mothafucka: 1,
      mothafuckas: 1,
      mothafuckaz: 1,
      mothafucked: 1,
      mothafucker: 1,
      mothafuckers: 1,
      mothafuckin: 1,
      mothafucking: 1,
      mothafuckings: 1,
      mothafucks: 1,
      "mother fucker": 1,
      motherfuck: 1,
      motherfucked: 1,
      motherfucker: 1,
      motherfuckers: 1,
      motherfuckin: 1,
      motherfucking: 1,
      motherfuckings: 1,
      motherfuckka: 1,
      motherfucks: 1,
      muff: 1,
      mutha: 1,
      muthafecker: 1,
      muthafuckker: 1,
      muther: 1,
      mutherfucker: 1,
      n1gga: 1,
      n1gger: 1,
      nazi: 1,
      nigg3r: 1,
      nigg4h: 1,
      nigga: 1,
      niggah: 1,
      niggas: 1,
      niggaz: 1,
      nigger: 1,
      niggers: 1,
      nob: 1,
      "nob jokey": 1,
      nobhead: 1,
      nobjocky: 1,
      nobjokey: 1,
      numbnuts: 1,
      nutsack: 1,
      orgasim: 1,
      orgasims: 1,
      orgasm: 1,
      orgasms: 1,
      p0rn: 1,
      pawn: 1,
      pecker: 1,
      penis: 1,
      penisfucker: 1,
      phonesex: 1,
      phuck: 1,
      phuk: 1,
      phuked: 1,
      phuking: 1,
      phukked: 1,
      phukking: 1,
      phuks: 1,
      phuq: 1,
      pigfucker: 1,
      pimpis: 1,
      piss: 1,
      pissed: 1,
      pisser: 1,
      pissers: 1,
      pisses: 1,
      pissflaps: 1,
      pissin: 1,
      pissing: 1,
      pissoff: 1,
      poop: 1,
      porn: 1,
      porno: 1,
      pornography: 1,
      pornos: 1,
      prick: 1,
      pricks: 1,
      pron: 1,
      pube: 1,
      pusse: 1,
      pussi: 1,
      pussies: 1,
      pussy: 1,
      pussys: 1,
      rectum: 1,
      retard: 1,
      rimjaw: 1,
      rimming: 1,
      "s hit": 1,
      "s.o.b.": 1,
      sadist: 1,
      schlong: 1,
      screwing: 1,
      scroat: 1,
      scrote: 1,
      scrotum: 1,
      semen: 1,
      sex: 1,
      "sh!+": 1,
      "sh!t": 1,
      sh1t: 1,
      shag: 1,
      shagger: 1,
      shaggin: 1,
      shagging: 1,
      shemale: 1,
      "shi+": 1,
      shit: 1,
      shitdick: 1,
      shite: 1,
      shited: 1,
      shitey: 1,
      shitfuck: 1,
      shitfull: 1,
      shithead: 1,
      shiting: 1,
      shitings: 1,
      shits: 1,
      shitted: 1,
      shitter: 1,
      shitters: 1,
      shitting: 1,
      shittings: 1,
      shitty: 1,
      skank: 1,
      slut: 1,
      sluts: 1,
      smegma: 1,
      smut: 1,
      snatch: 1,
      "son-of-a-bitch": 1,
      spac: 1,
      spunk: 1,
      s_h_i_t: 1,
      t1tt1e5: 1,
      t1tties: 1,
      teets: 1,
      teez: 1,
      testical: 1,
      testicle: 1,
      tit: 1,
      titfuck: 1,
      tits: 1,
      titt: 1,
      tittie5: 1,
      tittiefucker: 1,
      titties: 1,
      tittyfuck: 1,
      tittywank: 1,
      titwank: 1,
      tosser: 1,
      turd: 1,
      tw4t: 1,
      twat: 1,
      twathead: 1,
      twatty: 1,
      twunt: 1,
      twunter: 1,
      v14gra: 1,
      v1gra: 1,
      vagina: 1,
      viagra: 1,
      vulva: 1,
      w00se: 1,
      wang: 1,
      wank: 1,
      wanker: 1,
      wanky: 1,
      whoar: 1,
      whore: 1,
      willies: 1,
      willy: 1,
      xrated: 1,
      xxx: 1
    },
    Ic = ["4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx"],
    Mc = /\b(4r5e|5h1t|5hit|a55|anal|anus|ar5e|arrse|arse|ass|ass-fucker|asses|assfucker|assfukka|asshole|assholes|asswhole|a_s_s|b!tch|b00bs|b17ch|b1tch|ballbag|balls|ballsack|bastard|beastial|beastiality|bellend|bestial|bestiality|bi\+ch|biatch|bitch|bitcher|bitchers|bitches|bitchin|bitching|bloody|blow job|blowjob|blowjobs|boiolas|bollock|bollok|boner|boob|boobs|booobs|boooobs|booooobs|booooooobs|breasts|buceta|bugger|bum|bunny fucker|butt|butthole|buttmuch|buttplug|c0ck|c0cksucker|carpet muncher|cawk|chink|cipa|cl1t|clit|clitoris|clits|cnut|cock|cock-sucker|cockface|cockhead|cockmunch|cockmuncher|cocks|cocksuck|cocksucked|cocksucker|cocksucking|cocksucks|cocksuka|cocksukka|cok|cokmuncher|coksucka|coon|cox|crap|cum|cummer|cumming|cums|cumshot|cunilingus|cunillingus|cunnilingus|cunt|cuntlick|cuntlicker|cuntlicking|cunts|cyalis|cyberfuc|cyberfuck|cyberfucked|cyberfucker|cyberfuckers|cyberfucking|d1ck|damn|dick|dickhead|dildo|dildos|dink|dinks|dirsa|dlck|dog-fucker|doggin|dogging|donkeyribber|doosh|duche|dyke|ejaculate|ejaculated|ejaculates|ejaculating|ejaculatings|ejaculation|ejakulate|f u c k|f u c k e r|f4nny|fag|fagging|faggitt|faggot|faggs|fagot|fagots|fags|fanny|fannyflaps|fannyfucker|fanyy|fatass|fcuk|fcuker|fcuking|feck|fecker|felching|fellate|fellatio|fingerfuck|fingerfucked|fingerfucker|fingerfuckers|fingerfucking|fingerfucks|fistfuck|fistfucked|fistfucker|fistfuckers|fistfucking|fistfuckings|fistfucks|flange|fook|fooker|fuck|fucka|fucked|fucker|fuckers|fuckhead|fuckheads|fuckin|fucking|fuckings|fuckingshitmotherfucker|fuckme|fucks|fuckwhit|fuckwit|fudge packer|fudgepacker|fuk|fuker|fukker|fukkin|fuks|fukwhit|fukwit|fux|fux0r|f_u_c_k|gangbang|gangbanged|gangbangs|gaylord|gaysex|goatse|God|god-dam|god-damned|goddamn|goddamned|hardcoresex|hell|heshe|hoar|hoare|hoer|homo|hore|horniest|horny|hotsex|jack-off|jackoff|jap|jerk-off|jism|jiz|jizm|jizz|kawk|knob|knobead|knobed|knobend|knobhead|knobjocky|knobjokey|kock|kondum|kondums|kum|kummer|kumming|kums|kunilingus|l3i\+ch|l3itch|labia|lust|lusting|m0f0|m0fo|m45terbate|ma5terb8|ma5terbate|masochist|master-bate|masterb8|masterbat*|masterbat3|masterbate|masterbation|masterbations|masturbate|mo-fo|mof0|mofo|mothafuck|mothafucka|mothafuckas|mothafuckaz|mothafucked|mothafucker|mothafuckers|mothafuckin|mothafucking|mothafuckings|mothafucks|mother fucker|motherfuck|motherfucked|motherfucker|motherfuckers|motherfuckin|motherfucking|motherfuckings|motherfuckka|motherfucks|muff|mutha|muthafecker|muthafuckker|muther|mutherfucker|n1gga|n1gger|nazi|nigg3r|nigg4h|nigga|niggah|niggas|niggaz|nigger|niggers|nob|nob jokey|nobhead|nobjocky|nobjokey|numbnuts|nutsack|orgasim|orgasims|orgasm|orgasms|p0rn|pawn|pecker|penis|penisfucker|phonesex|phuck|phuk|phuked|phuking|phukked|phukking|phuks|phuq|pigfucker|pimpis|piss|pissed|pisser|pissers|pisses|pissflaps|pissin|pissing|pissoff|poop|porn|porno|pornography|pornos|prick|pricks|pron|pube|pusse|pussi|pussies|pussy|pussys|rectum|retard|rimjaw|rimming|s hit|s.o.b.|sadist|schlong|screwing|scroat|scrote|scrotum|semen|sex|sh!\+|sh!t|sh1t|shag|shagger|shaggin|shagging|shemale|shi\+|shit|shitdick|shite|shited|shitey|shitfuck|shitfull|shithead|shiting|shitings|shits|shitted|shitter|shitters|shitting|shittings|shitty|skank|slut|sluts|smegma|smut|snatch|son-of-a-bitch|spac|spunk|s_h_i_t|t1tt1e5|t1tties|teets|teez|testical|testicle|tit|titfuck|tits|titt|tittie5|tittiefucker|titties|tittyfuck|tittywank|titwank|tosser|turd|tw4t|twat|twathead|twatty|twunt|twunter|v14gra|v1gra|vagina|viagra|vulva|w00se|wang|wank|wanker|wanky|whoar|whore|willies|willy|xrated|xxx)\b/gi,
    Ec = {
      object: Tc,
      array: Ic,
      regex: Mc
    };
  const Pc = Sc.words,
    Cc = Ec.array;
  class Ac {
    constructor(t = {}) {
      Object.assign(this, {
        list: t.emptyList && [] || Array.prototype.concat.apply(Pc, [Cc, t.list || []]),
        exclude: t.exclude || [],
        splitRegex: t.splitRegex || /\b/,
        placeHolder: t.placeHolder || "*",
        regex: t.regex || /[^a-zA-Z0-9|\$|\@]|\^/g,
        replaceRegex: t.replaceRegex || /\w/g
      });
    }
    isProfane(t) {
      return this.list.filter(i => {
        const s = new RegExp(`\\b${i.replace(/(\W)/g, "\\$1")}\\b`, "gi");
        return !this.exclude.includes(i.toLowerCase()) && s.test(t);
      }).length > 0 || !1;
    }
    replaceWord(t) {
      return t.replace(this.regex, "").replace(this.replaceRegex, this.placeHolder);
    }
    clean(t) {
      return t.split(this.splitRegex).map(i => this.isProfane(i) ? this.replaceWord(i) : i).join(this.splitRegex.exec(t)[0]);
    }
    addWords() {
      let t = Array.from(arguments);
      this.list.push(...t), t.map(i => i.toLowerCase()).forEach(i => {
        this.exclude.includes(i) && this.exclude.splice(this.exclude.indexOf(i), 1);
      });
    }
    removeWords() {
      this.exclude.push(...Array.from(arguments).map(t => t.toLowerCase()));
    }
  }
  var Dc = Ac;
  const Yr = new Dc(),
    Oc = ["jew", "black", "baby", "child", "white", "porn", "pedo", "trump", "clinton", "hitler", "nazi", "gay", "pride", "sex", "pleasure", "touch", "poo", "kids", "rape", "white power", "nigga", "nig nog", "doggy", "rapist", "boner", "nigger", "nigg", "finger", "nogger", "nagger", "nig", "fag", "gai", "pole", "stripper", "penis", "vagina", "pussy", "nazi", "hitler", "stalin", "burn", "chamber", "cock", "peen", "dick", "spick", "nieger", "die", "satan", "n|ig", "nlg", "cunt", "c0ck", "fag", "lick", "condom", "anal", "shit", "phile", "little", "kids", "free KR", "tiny", "sidney", "ass", "kill", ".io", "(dot)", "[dot]", "mini", "whiore", "whore", "faggot", "github", "1337", "666", "satan", "senpa", "discord", "d1scord", "mistik", ".io", "senpa.io", "sidney", "sid", "senpaio", "vries", "asa"];
  Yr.addWords(...Oc);
  const _s = Math.abs,
    at = Math.cos,
    lt = Math.sin,
    Bs = Math.pow,
    Rc = Math.sqrt;
  function _c(e, t, i, s, n, r, o, l, c, a, u, p, h, m) {
    this.id = e, this.sid = t, this.tmpScore = 0, this.team = null, this.skinIndex = 0, this.tailIndex = 0, this.hitTime = 0, this.tails = {};
    for (var w = 0; w < u.length; ++w) u[w].price <= 0 && (this.tails[u[w].id] = 1);
    this.skins = {};
    for (var w = 0; w < a.length; ++w) a[w].price <= 0 && (this.skins[a[w].id] = 1);
    this.points = 0, this.dt = 0, this.hidden = !1, this.itemCounts = {}, this.isPlayer = !0, this.pps = 0, this.moveDir = void 0, this.skinRot = 0, this.lastPing = 0, this.iconIndex = 0, this.skinColor = 0, this.dangerShame = 5, this.projDist = 0, this.spawn = function (k) {
      // ADDED MODULES:
      this.finded = 0;
      this.syncThreats = 0;
      this.primaryIndex = undefined;
      this.secondaryIndex = undefined;
      this.primaryVariant = undefined;
      this.secondaryVariant = undefined;
      this.gatherIndex = undefined;
      this.shootIndex = undefined;
      this.bowThreat = {
        9: 0,
        12: 0,
        13: 0,
        15: 0
      };
      this.aim2 = 0;
      this.dist2 = 0;
      this.aim3 = 0;
      this.dist3 = 0;
      this.notHere = false;
      this.bTick = 0;
      this.pCount = 0;
      this.hitted = false;
      this.anti = false;
      this.healSid = -1;
      this.damaged = false;
      this.active = true;
      this.alive = true;
      this.lockMove = false;
      this.lockDir = false;
      this.minimapCounter = 0;
      this.chatCountdown = 0;
      this.shameCount = 0;
      this.shameTimer = 0;
      this.antiClown = 4;
      this.maxShame = 7;
      this.sentTo = {};
      this.gathering = 0;
      this.shooting = {};
      this.autoGather = 0;
      this.animTime = 0;
      this.animSpeed = 0;
      this.mouseState = 0;
      this.buildIndex = -1;
      this.weaponIndex = 0;
      this.dmgOverTime = {};
      this.noMovTimer = 0;
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
      this.scale = i.playerScale;
      this.speed = i.playerSpeed;
      this.resetMoveDir();
      this.resetResources(k);
      this.firstItems = [0, 3, 6, 10];
      this.items = [0, 3, 6, 10];
      this.weapons = [0];
      this.shootCount = 0;
      this.weaponXP = [];
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
      this.oldReloads = {
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
      this.turretReloaded = false;
      this.doTickUpdate = false;
      this.instaThreat = 0;
      this.timeSpentNearVolcano = 0;
    }, this.resetMoveDir = function () {
      this.moveDir = void 0;
    }, this.resetResources = function (k) {
      for (let S = 0; S < i.resourceTypes.length; ++S) this[i.resourceTypes[S]] = k ? 100 : 0;
    }, this.addItem = function (k) {
      const S = c.list[k];
      if (S) {
        for (let O = 0; O < this.items.length; ++O) if (c.list[this.items[O]].group == S.group) return this.buildIndex == this.items[O] && (this.buildIndex = k), this.items[O] = k, !0;
        return this.items.push(k), !0;
      }
      return !1;
    }, this.setUserData = function (k) {
      if (k) {
        this.name = "unknown";
        let S = k.name + "";
        S = S.slice(0, i.maxNameLength), S = S.replace(/[^\w:\(\)\/? -]+/gim, " "), S = S.replace(/[^\x00-\x7F]/g, " "), S = S.trim();
        let O = !1;
        const U = S.toLowerCase().replace(/\s/g, "").replace(/1/g, "i").replace(/0/g, "o").replace(/5/g, "s");
        for (const L of Yr.list) if (U.indexOf(L) != -1) {
          O = !0;
          break;
        }
        S.length > 0 && !O && (this.name = S), this.skinColor = 0, i.skinColors[k.skin] && (this.skinColor = k.skin);
      }
    }, this.getData = function () {
      return [this.id, this.sid, this.name, s.fixTo(this.x, 2), s.fixTo(this.y, 2), s.fixTo(this.dir, 3), this.health, this.maxHealth, this.scale, this.skinColor];
    }, this.setData = function (k) {
      this.id = k[0], this.sid = k[1], this.name = k[2], this.x = k[3], this.y = k[4], this.dir = k[5], this.health = k[6], this.maxHealth = k[7], this.scale = k[8], this.skinColor = k[9];
    };
    let v = 0;
    this.update = function (k) {
      if (!this.alive) {
        return;
      }
      if ((s.getDistance(this.x, this.y, i.volcanoLocationX, i.volcanoLocationY) || 0) < i.volcanoAggressionRadius) {
        this.timeSpentNearVolcano += k;
        if (this.timeSpentNearVolcano >= 1e3) {
          this.changeHealth(i.volcanoDamagePerSecond, null);
          p.send(this.id, "8", Math.round(this.x), Math.round(this.y), i.volcanoDamagePerSecond, -1);
          this.timeSpentNearVolcano %= 1e3;
        }
      }
      if (this.shameTimer > 0) {
        this.shameTimer -= k;
        if (this.shameTimer <= 0) {
          this.shameTimer = 0;
          this.shameCount = 0;
        }
      }
      v -= k;
      if (v <= 0) {
        const _ = (this.skin && this.skin.healthRegen ? this.skin.healthRegen : 0) + (this.tail && this.tail.healthRegen ? this.tail.healthRegen : 0);
        if (_) {
          this.changeHealth(_, this);
        }
        if (this.dmgOverTime.dmg) {
          this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer);
          this.dmgOverTime.time -= 1;
          if (this.dmgOverTime.time <= 0) {
            this.dmgOverTime.dmg = 0;
          }
        }
        if (this.healCol) {
          this.changeHealth(this.healCol, this);
        }
        v = 1e3;
      }
      if (!this.alive) {
        return;
      }
      if (this.slowMult < 1) {
        this.slowMult += 8e-4 * k;
        if (this.slowMult > 1) {
          this.slowMult = 1;
        }
      }
      this.noMovTimer += k;
      if (this.xVel || this.yVel) {
        this.noMovTimer = 0;
      }
      if (this.lockMove) {
        this.xVel = 0;
        this.yVel = 0;
      } else {
        let _ = (this.buildIndex >= 0 ? 0.5 : 1) * (c.weapons[this.weaponIndex].spdMult || 1) * (this.skin && this.skin.spdMult || 1) * (this.tail && this.tail.spdMult || 1) * (this.y <= i.snowBiomeTop ? this.skin && this.skin.coldM ? 1 : i.snowSpeed : 1) * this.slowMult;
        if (!this.zIndex && this.y >= i.mapScale / 2 - i.riverWidth / 2 && this.y <= i.mapScale / 2 + i.riverWidth / 2) {
          if (this.skin && this.skin.watrImm) {
            _ *= 0.75;
            this.xVel += i.waterCurrent * 0.4 * k;
          } else {
            _ *= 0.33;
            this.xVel += i.waterCurrent * k;
          }
        }
        let $ = this.moveDir != null ? at(this.moveDir) : 0;
        let V = this.moveDir != null ? lt(this.moveDir) : 0;
        const z = Rc($ * $ + V * V);
        if (z != 0) {
          $ /= z;
          V /= z;
        }
        if ($) {
          this.xVel += $ * this.speed * _ * k;
        }
        if (V) {
          this.yVel += V * this.speed * _ * k;
        }
      }
      this.zIndex = 0;
      this.lockMove = false;
      this.healCol = 0;
      let O;
      const U = s.getDistance(0, 0, this.xVel * k, this.yVel * k);
      const L = Math.min(4, Math.max(1, Math.round(U / 40)));
      const q = 1 / L;
      let P = {};
      for (var W = 0; W < L; ++W) {
        if (this.xVel) {
          this.x += this.xVel * k * q;
        }
        if (this.yVel) {
          this.y += this.yVel * k * q;
        }
        O = r.getGridArrays(this.x, this.y, this.scale);
        for (let _ = 0; _ < O.length; ++_) {
          for (let $ = 0; $ < O[_].length && !(O[_][$].active && !P[O[_][$].sid] && r.checkCollision(this, O[_][$], q) && (P[O[_][$].sid] = true, !this.alive)); ++$) {}
          if (!this.alive) {
            break;
          }
        }
        if (!this.alive) {
          break;
        }
      }
      var F = o.indexOf(this);
      for (var W = F + 1; W < o.length; ++W) {
        if (o[W] != this && o[W].alive) {
          r.checkCollision(this, o[W]);
        }
      }
      if (this.xVel) {
        this.xVel *= Bs(i.playerDecel, k);
        if (this.xVel <= 0.01 && this.xVel >= -0.01) {
          this.xVel = 0;
        }
      }
      if (this.yVel) {
        this.yVel *= Bs(i.playerDecel, k);
        if (this.yVel <= 0.01 && this.yVel >= -0.01) {
          this.yVel = 0;
        }
      }
      if (this.x - this.scale < 0) {
        this.x = this.scale;
      } else if (this.x + this.scale > i.mapScale) {
        this.x = i.mapScale - this.scale;
      }
      if (this.y - this.scale < 0) {
        this.y = this.scale;
      } else if (this.y + this.scale > i.mapScale) {
        this.y = i.mapScale - this.scale;
      }
      if (this.buildIndex < 0) {
        if (this.reloads[this.weaponIndex] > 0) {
          this.reloads[this.weaponIndex] -= k;
          this.gathering = this.mouseState;
        } else if (this.gathering || this.autoGather) {
          let _ = true;
          if (c.weapons[this.weaponIndex].gather != null) {
            this.gather(o);
          } else if (c.weapons[this.weaponIndex].projectile != null && this.hasRes(c.weapons[this.weaponIndex], this.skin ? this.skin.projCost : 0)) {
            this.useRes(c.weapons[this.weaponIndex], this.skin ? this.skin.projCost : 0);
            this.noMovTimer = 0;
            var F = c.weapons[this.weaponIndex].projectile;
            const V = this.scale * 2;
            const z = this.skin && this.skin.aMlt ? this.skin.aMlt : 1;
            if (c.weapons[this.weaponIndex].rec) {
              this.xVel -= c.weapons[this.weaponIndex].rec * at(this.dir);
              this.yVel -= c.weapons[this.weaponIndex].rec * lt(this.dir);
            }
            n.addProjectile(this.x + V * at(this.dir), this.y + V * lt(this.dir), this.dir, c.projectiles[F].range * z, c.projectiles[F].speed * z, F, this, null, this.zIndex);
          } else {
            _ = false;
          }
          this.gathering = this.mouseState;
          if (_) {
            this.reloads[this.weaponIndex] = c.weapons[this.weaponIndex].speed * (this.skin ? this.skin.atkSpd || 1 : 1);
          }
        }
      }
    }, this.addWeaponXP = function (k) {
      this.weaponXP[this.weaponIndex] || (this.weaponXP[this.weaponIndex] = 0), this.weaponXP[this.weaponIndex] += k;
    }, this.earnXP = function (k) {
      this.age < i.maxAge && (this.XP += k, this.XP >= this.maxXP ? (this.age < i.maxAge ? (this.age++, this.XP = 0, this.maxXP *= 1.2) : this.XP = this.maxXP, this.upgradePoints++, p.send(this.id, "U", this.upgradePoints, this.upgrAge), p.send(this.id, "T", this.XP, s.fixTo(this.maxXP, 1), this.age)) : p.send(this.id, "T", this.XP));
    }, this.changeHealth = function (k, S) {
      if (k > 0 && this.health >= this.maxHealth) return !1;
      k < 0 && this.skin && (k *= this.skin.dmgMult || 1), k < 0 && this.tail && (k *= this.tail.dmgMult || 1), k < 0 && (this.hitTime = Date.now()), this.health += k, this.health > this.maxHealth && (k -= this.health - this.maxHealth, this.health = this.maxHealth), this.health <= 0 && this.kill(S);
      for (let O = 0; O < o.length; ++O) this.sentTo[o[O].id] && p.send(o[O].id, "O", this.sid, this.health);
      return S && S.canSee(this) && !(S == this && k < 0) && p.send(S.id, "8", Math.round(this.x), Math.round(this.y), Math.round(-k), 1), !0;
    }, this.kill = function (k) {
      k && k.alive && (k.kills++, k.skin && k.skin.goldSteal ? h(k, Math.round(this.points / 2)) : h(k, Math.round(this.age * 100 * (k.skin && k.skin.kScrM ? k.skin.kScrM : 1))), p.send(k.id, "N", "kills", k.kills, 1)), this.alive = !1, p.send(this.id, "P"), m();
    }, this.addResource = function (k, S, O) {
      !O && S > 0 && this.addWeaponXP(S), k == 3 ? h(this, S, !0) : (this[i.resourceTypes[k]] += S, p.send(this.id, "N", i.resourceTypes[k], this[i.resourceTypes[k]], 1));
    }, this.changeItemCount = function (k, S) {
      this.itemCounts[k] = this.itemCounts[k] || 0, this.itemCounts[k] += S, p.send(this.id, "S", k, this.itemCounts[k]);
    }, this.buildItem = function (k) {
      const S = this.scale + k.scale + (k.placeOffset || 0),
        O = this.x + S * at(this.dir),
        U = this.y + S * lt(this.dir);
      if (this.canBuild(k) && !(k.consume && this.skin && this.skin.noEat) && (k.consume || r.checkItemLocation(O, U, k.scale, 0.6, k.id, !1, this))) {
        let L = !1;
        if (k.consume) {
          if (this.hitTime) {
            const q = Date.now() - this.hitTime;
            this.hitTime = 0, q <= 120 ? (this.shameCount++, this.shameCount >= 8 && (this.shameTimer = 3e4, this.shameCount = 0)) : (this.shameCount -= 2, this.shameCount <= 0 && (this.shameCount = 0));
          }
          this.shameTimer <= 0 && (L = k.consume(this));
        } else L = !0, k.group.limit && this.changeItemCount(k.group.id, 1), k.pps && (this.pps += k.pps), r.add(r.objects.length, O, U, this.dir, k.scale, k.type, k, !1, this);
        L && (this.useRes(k), this.buildIndex = -1);
      }
    }, this.hasRes = function (k, S) {
      for (let O = 0; O < k.req.length;) {
        if (this[k.req[O]] < Math.round(k.req[O + 1] * (S || 1))) return !1;
        O += 2;
      }
      return !0;
    }, this.useRes = function (k, S) {
      if (!i.inSandbox) for (let O = 0; O < k.req.length;) this.addResource(i.resourceTypes.indexOf(k.req[O]), -Math.round(k.req[O + 1] * (S || 1))), O += 2;
    }, this.canBuild = function (k) {
      const S = i.inSandbox ? k.group.sandboxLimit || Math.max(k.group.limit * 3, 99) : k.group.limit;
      return S && this.itemCounts[k.group.id] >= S ? !1 : i.inSandbox ? !0 : this.hasRes(k);
    }, this.gather = function () {
      this.noMovTimer = 0, this.slowMult -= c.weapons[this.weaponIndex].hitSlow || 0.3, this.slowMult < 0 && (this.slowMult = 0);
      const k = i.fetchVariant(this),
        S = k.poison,
        O = k.val,
        U = {};
      let L, q, P, W;
      const F = r.getGridArrays(this.x, this.y, c.weapons[this.weaponIndex].range);
      for (let $ = 0; $ < F.length; ++$) for (var _ = 0; _ < F[$].length; ++_) if (P = F[$][_], P.active && !P.dontGather && !U[P.sid] && P.visibleToPlayer(this) && (L = s.getDistance(this.x, this.y, P.x, P.y) - P.scale, L <= c.weapons[this.weaponIndex].range && (q = s.getDirection(P.x, P.y, this.x, this.y), s.getAngleDist(q, this.dir) <= i.gatherAngle))) {
        if (U[P.sid] = 1, P.health) {
          if (P.changeHealth(-c.weapons[this.weaponIndex].dmg * O * (c.weapons[this.weaponIndex].sDmg || 1) * (this.skin && this.skin.bDmg ? this.skin.bDmg : 1), this)) {
            for (let V = 0; V < P.req.length;) this.addResource(i.resourceTypes.indexOf(P.req[V]), P.req[V + 1]), V += 2;
            r.disableObj(P);
          }
        } else {
          if (P.name === "volcano") this.hitVolcano(c.weapons[this.weaponIndex].gather);else {
            this.earnXP(4 * c.weapons[this.weaponIndex].gather);
            const V = c.weapons[this.weaponIndex].gather + (P.type == 3 ? 4 : 0);
            this.addResource(P.type, V);
          }
          this.skin && this.skin.extraGold && this.addResource(3, 1);
        }
        W = !0, r.hitObj(P, q);
      }
      for (var _ = 0; _ < o.length + l.length; ++_) if (P = o[_] || l[_ - o.length], P != this && P.alive && !(P.team && P.team == this.team) && (L = s.getDistance(this.x, this.y, P.x, P.y) - P.scale * 1.8, L <= c.weapons[this.weaponIndex].range && (q = s.getDirection(P.x, P.y, this.x, this.y), s.getAngleDist(q, this.dir) <= i.gatherAngle))) {
        let V = c.weapons[this.weaponIndex].steal;
        V && P.addResource && (V = Math.min(P.points || 0, V), this.addResource(3, V), P.addResource(3, -V));
        let z = O;
        P.weaponIndex != null && c.weapons[P.weaponIndex].shield && s.getAngleDist(q + Math.PI, P.dir) <= i.shieldAngle && (z = c.weapons[P.weaponIndex].shield);
        const X = c.weapons[this.weaponIndex].dmg,
          G = X * (this.skin && this.skin.dmgMultO ? this.skin.dmgMultO : 1) * (this.tail && this.tail.dmgMultO ? this.tail.dmgMultO : 1),
          te = 0.3 * (P.weightM || 1) + (c.weapons[this.weaponIndex].knock || 0);
        P.xVel += te * at(q), P.yVel += te * lt(q), this.skin && this.skin.healD && this.changeHealth(G * z * this.skin.healD, this), this.tail && this.tail.healD && this.changeHealth(G * z * this.tail.healD, this), P.skin && P.skin.dmg && this.changeHealth(-X * P.skin.dmg, P), P.tail && P.tail.dmg && this.changeHealth(-X * P.tail.dmg, P), P.dmgOverTime && this.skin && this.skin.poisonDmg && !(P.skin && P.skin.poisonRes) && (P.dmgOverTime.dmg = this.skin.poisonDmg, P.dmgOverTime.time = this.skin.poisonTime || 1, P.dmgOverTime.doer = this), P.dmgOverTime && S && !(P.skin && P.skin.poisonRes) && (P.dmgOverTime.dmg = 5, P.dmgOverTime.time = 5, P.dmgOverTime.doer = this), P.skin && P.skin.dmgK && (this.xVel -= P.skin.dmgK * at(q), this.yVel -= P.skin.dmgK * lt(q)), P.changeHealth(-G * z, this, this);
      }
      this.sendAnimation(W ? 1 : 0);
    }, this.hitVolcano = function (k) {
      const S = 5 + Math.round(k / 3.5);
      this.addResource(2, S), this.addResource(3, S);
    }, this.sendAnimation = function (k) {
      for (let S = 0; S < o.length; ++S) this.sentTo[o[S].id] && this.canSee(o[S]) && p.send(o[S].id, "K", this.sid, k ? 1 : 0, this.weaponIndex);
    };
    let x = 0;
    let D = 0;
    this.animate = function (k) {
      if (this.animTime > 0) {
        this.animTime -= k;
        if (this.animTime <= 0) {
          this.animTime = 0;
          this.dirPlus = 0;
          x = 0;
          D = 0;
        } else if (D == 0) {
          x += k / (this.animSpeed * i.hitReturnRatio);
          this.dirPlus = s.lerp(0, this.targetAngle, Math.min(1, x));
          if (x >= 1) {
            x = 1;
            D = 1;
          }
        } else {
          x -= k / (this.animSpeed * (1 - i.hitReturnRatio));
          this.dirPlus = s.lerp(0, this.targetAngle, Math.max(0, x));
        }
      }
    };
    this.startAnim = function (k, S) {
      this.animTime = this.animSpeed = c.weapons[S].speed;
      this.targetAngle = k ? -i.hitAngle : -Math.PI;
      x = 0;
      D = 0;
    };
    this.canSee = function (k) {
      if (!k || k.skin && k.skin.invisTimer && k.noMovTimer >= k.skin.invisTimer) {
        return false;
      }
      const S = _s(k.x - this.x) - k.scale;
      const O = _s(k.y - this.y) - k.scale;
      return S <= i.maxScreenWidth / 2 * 1.3 && O <= i.maxScreenHeight / 2 * 1.3;
    };
  }
  const Bc = [{
      id: 45,
      name: "Shame!",
      dontSell: !0,
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
      price: 1e3,
      scale: 120,
      desc: "no effect"
    }, {
      id: 4,
      name: "Ranger Hat",
      price: 2e3,
      scale: 120,
      desc: "no effect"
    }, {
      id: 18,
      name: "Explorer Hat",
      price: 2e3,
      scale: 120,
      desc: "no effect"
    }, {
      id: 31,
      name: "Flipper Hat",
      price: 2500,
      scale: 120,
      desc: "have more control while in water",
      watrImm: !0
    }, {
      id: 1,
      name: "Marksman Cap",
      price: 3e3,
      scale: 120,
      desc: "increases arrow speed and range",
      aMlt: 1.3
    }, {
      id: 10,
      name: "Bush Gear",
      price: 3e3,
      scale: 160,
      desc: "allows you to disguise yourself as a bush"
    }, {
      id: 48,
      name: "Halo",
      price: 3e3,
      scale: 120,
      desc: "no effect"
    }, {
      id: 6,
      name: "Soldier Helmet",
      price: 4e3,
      scale: 120,
      desc: "reduces damage taken but slows movement",
      spdMult: 0.94,
      dmgMult: 0.75
    }, {
      id: 23,
      name: "Anti Venom Gear",
      price: 4e3,
      scale: 120,
      desc: "makes you immune to poison",
      poisonRes: 1
    }, {
      id: 13,
      name: "Medic Gear",
      price: 5e3,
      scale: 110,
      desc: "slowly regenerates health over time",
      healthRegen: 3
    }, {
      id: 9,
      name: "Miners Helmet",
      price: 5e3,
      scale: 120,
      desc: "earn 1 extra gold per resource",
      extraGold: 1
    }, {
      id: 32,
      name: "Musketeer Hat",
      price: 5e3,
      scale: 120,
      desc: "reduces cost of projectiles",
      projCost: 0.5
    }, {
      id: 7,
      name: "Bull Helmet",
      price: 6e3,
      scale: 120,
      desc: "increases damage done but drains health",
      healthRegen: -5,
      dmgMultO: 1.5,
      spdMult: 0.96
    }, {
      id: 22,
      name: "Emp Helmet",
      price: 6e3,
      scale: 120,
      desc: "turrets won't attack but you move slower",
      antiTurret: 1,
      spdMult: 0.7
    }, {
      id: 12,
      name: "Booster Hat",
      price: 6e3,
      scale: 120,
      desc: "increases your movement speed",
      spdMult: 1.16
    }, {
      id: 26,
      name: "Barbarian Armor",
      price: 8e3,
      scale: 120,
      desc: "knocks back enemies that attack you",
      dmgK: 0.6
    }, {
      id: 21,
      name: "Plague Mask",
      price: 1e4,
      scale: 120,
      desc: "melee attacks deal poison damage",
      poisonDmg: 5,
      poisonTime: 6
    }, {
      id: 46,
      name: "Bull Mask",
      price: 1e4,
      scale: 120,
      desc: "bulls won't target you unless you attack them",
      bullRepel: 1
    }, {
      id: 14,
      name: "Windmill Hat",
      topSprite: !0,
      price: 1e4,
      scale: 120,
      desc: "generates points while worn",
      pps: 1.5
    }, {
      id: 11,
      name: "Spike Gear",
      topSprite: !0,
      price: 1e4,
      scale: 120,
      desc: "deal damage to players that damage you",
      dmg: 0.45
    }, {
      id: 53,
      name: "Turret Gear",
      topSprite: !0,
      price: 1e4,
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
      price: 12e3,
      scale: 120,
      desc: "increased attack speed and fire rate",
      atkSpd: 0.78
    }, {
      id: 58,
      name: "Dark Knight",
      price: 12e3,
      scale: 120,
      desc: "restores health when you deal damage",
      healD: 0.4
    }, {
      id: 27,
      name: "Scavenger Gear",
      price: 15e3,
      scale: 120,
      desc: "earn double points for each kill",
      kScrM: 2
    }, {
      id: 40,
      name: "Tank Gear",
      price: 15e3,
      scale: 120,
      desc: "increased damage to buildings but slower movement",
      spdMult: 0.3,
      bDmg: 3.3
    }, {
      id: 52,
      name: "Thief Gear",
      price: 15e3,
      scale: 120,
      desc: "steal half of a players gold when you kill them",
      goldSteal: 0.5
    }, {
      id: 55,
      name: "Bloodthirster",
      price: 2e4,
      scale: 120,
      desc: "Restore Health when dealing damage. And increased damage",
      healD: 0.25,
      dmgMultO: 1.2
    }, {
      id: 56,
      name: "Assassin Gear",
      price: 2e4,
      scale: 120,
      desc: "Go invisible when not moving. Can't eat. Increased speed",
      noEat: !0,
      spdMult: 1.1,
      invisTimer: 1e3
    }],
    zc = [{
      id: 12,
      name: "Snowball",
      price: 1e3,
      scale: 105,
      xOff: 18,
      desc: "no effect"
    }, {
      id: 9,
      name: "Tree Cape",
      price: 1e3,
      scale: 90,
      desc: "no effect"
    }, {
      id: 10,
      name: "Stone Cape",
      price: 1e3,
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
      price: 2e3,
      scale: 90,
      desc: "no effect"
    }, {
      id: 11,
      name: "Monkey Tail",
      price: 2e3,
      scale: 97,
      xOff: 25,
      desc: "Super speed but reduced damage",
      spdMult: 1.35,
      dmgMultO: 0.2
    }, {
      id: 17,
      name: "Apple Basket",
      price: 3e3,
      scale: 80,
      xOff: 12,
      desc: "slowly regenerates health over time",
      healthRegen: 1
    }, {
      id: 6,
      name: "Winter Cape",
      price: 3e3,
      scale: 90,
      desc: "no effect"
    }, {
      id: 4,
      name: "Skull Cape",
      price: 4e3,
      scale: 90,
      desc: "no effect"
    }, {
      id: 5,
      name: "Dash Cape",
      price: 5e3,
      scale: 90,
      desc: "no effect"
    }, {
      id: 2,
      name: "Dragon Cape",
      price: 6e3,
      scale: 90,
      desc: "no effect"
    }, {
      id: 1,
      name: "Super Cape",
      price: 8e3,
      scale: 90,
      desc: "no effect"
    }, {
      id: 7,
      name: "Troll Cape",
      price: 8e3,
      scale: 90,
      desc: "no effect"
    }, {
      id: 14,
      name: "Thorns",
      price: 1e4,
      scale: 115,
      xOff: 20,
      desc: "no effect"
    }, {
      id: 15,
      name: "Blockades",
      price: 1e4,
      scale: 95,
      xOff: 15,
      desc: "no effect"
    }, {
      id: 20,
      name: "Devils Tail",
      price: 1e4,
      scale: 95,
      xOff: 20,
      desc: "no effect"
    }, {
      id: 16,
      name: "Sawblade",
      price: 12e3,
      scale: 90,
      spin: !0,
      xOff: 0,
      desc: "deal damage to players that damage you",
      dmg: 0.15
    }, {
      id: 13,
      name: "Angel Wings",
      price: 15e3,
      scale: 138,
      xOff: 22,
      desc: "slowly regenerates health over time",
      healthRegen: 3
    }, {
      id: 19,
      name: "Shadow Wings",
      price: 15e3,
      scale: 138,
      xOff: 22,
      desc: "increased movement speed",
      spdMult: 1.1
    }, {
      id: 18,
      name: "Blood Wings",
      price: 2e4,
      scale: 178,
      xOff: 26,
      desc: "restores health when you deal damage",
      healD: 0.2
    }, {
      id: 21,
      name: "Corrupt X Wings",
      price: 2e4,
      scale: 178,
      xOff: 26,
      desc: "deal damage to players that damage you",
      dmg: 0.25
    }],
    $r = {
      hats: Bc,
      accessories: zc
    };
  function Hc(e, t, i, s, n, r, o) {
    this.init = function (a, u, p, h, m, w, v, x, D) {
      this.active = !0, this.indx = a, this.x = u, this.y = p, this.dir = h, this.skipMov = !0, this.speed = m, this.dmg = w, this.scale = x, this.range = v, this.owner = D, o && (this.sentTo = {});
    };
    const l = [];
    let c;
    this.update = function (a) {
      if (this.active) {
        let p = this.speed * a,
          h;
        if (this.skipMov ? this.skipMov = !1 : (this.x += p * Math.cos(this.dir), this.y += p * Math.sin(this.dir), this.range -= p, this.range <= 0 && (this.x += this.range * Math.cos(this.dir), this.y += this.range * Math.sin(this.dir), p = 1, this.range = 0, this.active = !1)), o) {
          for (var u = 0; u < e.length; ++u) !this.sentTo[e[u].id] && e[u].canSee(this) && (this.sentTo[e[u].id] = 1, o.send(e[u].id, "X", r.fixTo(this.x, 1), r.fixTo(this.y, 1), r.fixTo(this.dir, 2), r.fixTo(this.range, 1), this.speed, this.indx, this.layer, this.sid));
          l.length = 0;
          for (var u = 0; u < e.length + t.length; ++u) c = e[u] || t[u - e.length], c.alive && c != this.owner && !(this.owner.team && c.team == this.owner.team) && r.lineInRect(c.x - c.scale, c.y - c.scale, c.x + c.scale, c.y + c.scale, this.x, this.y, this.x + p * Math.cos(this.dir), this.y + p * Math.sin(this.dir)) && l.push(c);
          const m = i.getGridArrays(this.x, this.y, this.scale);
          for (let w = 0; w < m.length; ++w) for (let v = 0; v < m[w].length; ++v) c = m[w][v], h = c.getScale(), c.active && this.ignoreObj != c.sid && this.layer <= c.layer && l.indexOf(c) < 0 && !c.ignoreCollision && r.lineInRect(c.x - h, c.y - h, c.x + h, c.y + h, this.x, this.y, this.x + p * Math.cos(this.dir), this.y + p * Math.sin(this.dir)) && l.push(c);
          if (l.length > 0) {
            let w = null,
              v = null,
              x = null;
            for (var u = 0; u < l.length; ++u) x = r.getDistance(this.x, this.y, l[u].x, l[u].y), (v == null || x < v) && (v = x, w = l[u]);
            if (w.isPlayer || w.isAI) {
              const D = 0.3 * (w.weightM || 1);
              w.xVel += D * Math.cos(this.dir), w.yVel += D * Math.sin(this.dir), (w.weaponIndex == null || !(s.weapons[w.weaponIndex].shield && r.getAngleDist(this.dir + Math.PI, w.dir) <= n.shieldAngle)) && w.changeHealth(-this.dmg, this.owner, this.owner);
            } else {
              w.projDmg && w.health && w.changeHealth(-this.dmg) && i.disableObj(w);
              for (var u = 0; u < e.length; ++u) e[u].active && (w.sentTo[e[u].id] && (w.active ? e[u].canSee(w) && o.send(e[u].id, "L", r.fixTo(this.dir, 2), w.sid) : o.send(e[u].id, "Q", w.sid)), !w.active && w.owner == e[u] && e[u].changeItemCount(w.group.id, -1));
            }
            this.active = !1;
            for (var u = 0; u < e.length; ++u) this.sentTo[e[u].id] && o.send(e[u].id, "Y", this.sid, r.fixTo(v, 1));
          }
        }
      }
    };
  }
  var On = {},
    Fc = {
      get exports() {
        return On;
      },
      set exports(e) {
        On = e;
      }
    },
    Rn = {},
    Vc = {
      get exports() {
        return Rn;
      },
      set exports(e) {
        Rn = e;
      }
    };
  (function () {
    var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      t = {
        rotl: function (i, s) {
          return i << s | i >>> 32 - s;
        },
        rotr: function (i, s) {
          return i << 32 - s | i >>> s;
        },
        endian: function (i) {
          if (i.constructor == Number) return t.rotl(i, 8) & 16711935 | t.rotl(i, 24) & 4278255360;
          for (var s = 0; s < i.length; s++) i[s] = t.endian(i[s]);
          return i;
        },
        randomBytes: function (i) {
          for (var s = []; i > 0; i--) s.push(Math.floor(Math.random() * 256));
          return s;
        },
        bytesToWords: function (i) {
          for (var s = [], n = 0, r = 0; n < i.length; n++, r += 8) s[r >>> 5] |= i[n] << 24 - r % 32;
          return s;
        },
        wordsToBytes: function (i) {
          for (var s = [], n = 0; n < i.length * 32; n += 8) s.push(i[n >>> 5] >>> 24 - n % 32 & 255);
          return s;
        },
        bytesToHex: function (i) {
          for (var s = [], n = 0; n < i.length; n++) s.push((i[n] >>> 4).toString(16)), s.push((i[n] & 15).toString(16));
          return s.join("");
        },
        hexToBytes: function (i) {
          for (var s = [], n = 0; n < i.length; n += 2) s.push(parseInt(i.substr(n, 2), 16));
          return s;
        },
        bytesToBase64: function (i) {
          for (var s = [], n = 0; n < i.length; n += 3) for (var r = i[n] << 16 | i[n + 1] << 8 | i[n + 2], o = 0; o < 4; o++) n * 8 + o * 6 <= i.length * 8 ? s.push(e.charAt(r >>> 6 * (3 - o) & 63)) : s.push("=");
          return s.join("");
        },
        base64ToBytes: function (i) {
          i = i.replace(/[^A-Z0-9+\/]/gi, "");
          for (var s = [], n = 0, r = 0; n < i.length; r = ++n % 4) r != 0 && s.push((e.indexOf(i.charAt(n - 1)) & Math.pow(2, -2 * r + 8) - 1) << r * 2 | e.indexOf(i.charAt(n)) >>> 6 - r * 2);
          return s;
        }
      };
    Vc.exports = t;
  })();
  var _n = {
      utf8: {
        stringToBytes: function (e) {
          return _n.bin.stringToBytes(unescape(encodeURIComponent(e)));
        },
        bytesToString: function (e) {
          return decodeURIComponent(escape(_n.bin.bytesToString(e)));
        }
      },
      bin: {
        stringToBytes: function (e) {
          for (var t = [], i = 0; i < e.length; i++) t.push(e.charCodeAt(i) & 255);
          return t;
        },
        bytesToString: function (e) {
          for (var t = [], i = 0; i < e.length; i++) t.push(String.fromCharCode(e[i]));
          return t.join("");
        }
      }
    },
    zs = _n;
  /*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */
  var Uc = function (e) {
    return e != null && (Kr(e) || Lc(e) || !!e._isBuffer);
  };
  function Kr(e) {
    return !!e.constructor && typeof e.constructor.isBuffer == "function" && e.constructor.isBuffer(e);
  }
  function Lc(e) {
    return typeof e.readFloatLE == "function" && typeof e.slice == "function" && Kr(e.slice(0, 0));
  }
  (function () {
    var e = Rn,
      t = zs.utf8,
      i = Uc,
      s = zs.bin,
      n = function (r, o) {
        r.constructor == String ? o && o.encoding === "binary" ? r = s.stringToBytes(r) : r = t.stringToBytes(r) : i(r) ? r = Array.prototype.slice.call(r, 0) : !Array.isArray(r) && r.constructor !== Uint8Array && (r = r.toString());
        for (var l = e.bytesToWords(r), c = r.length * 8, a = 1732584193, u = -271733879, p = -1732584194, h = 271733878, m = 0; m < l.length; m++) l[m] = (l[m] << 8 | l[m] >>> 24) & 16711935 | (l[m] << 24 | l[m] >>> 8) & 4278255360;
        l[c >>> 5] |= 128 << c % 32, l[(c + 64 >>> 9 << 4) + 14] = c;
        for (var w = n._ff, v = n._gg, x = n._hh, D = n._ii, m = 0; m < l.length; m += 16) {
          var k = a,
            S = u,
            O = p,
            U = h;
          a = w(a, u, p, h, l[m + 0], 7, -680876936), h = w(h, a, u, p, l[m + 1], 12, -389564586), p = w(p, h, a, u, l[m + 2], 17, 606105819), u = w(u, p, h, a, l[m + 3], 22, -1044525330), a = w(a, u, p, h, l[m + 4], 7, -176418897), h = w(h, a, u, p, l[m + 5], 12, 1200080426), p = w(p, h, a, u, l[m + 6], 17, -1473231341), u = w(u, p, h, a, l[m + 7], 22, -45705983), a = w(a, u, p, h, l[m + 8], 7, 1770035416), h = w(h, a, u, p, l[m + 9], 12, -1958414417), p = w(p, h, a, u, l[m + 10], 17, -42063), u = w(u, p, h, a, l[m + 11], 22, -1990404162), a = w(a, u, p, h, l[m + 12], 7, 1804603682), h = w(h, a, u, p, l[m + 13], 12, -40341101), p = w(p, h, a, u, l[m + 14], 17, -1502002290), u = w(u, p, h, a, l[m + 15], 22, 1236535329), a = v(a, u, p, h, l[m + 1], 5, -165796510), h = v(h, a, u, p, l[m + 6], 9, -1069501632), p = v(p, h, a, u, l[m + 11], 14, 643717713), u = v(u, p, h, a, l[m + 0], 20, -373897302), a = v(a, u, p, h, l[m + 5], 5, -701558691), h = v(h, a, u, p, l[m + 10], 9, 38016083), p = v(p, h, a, u, l[m + 15], 14, -660478335), u = v(u, p, h, a, l[m + 4], 20, -405537848), a = v(a, u, p, h, l[m + 9], 5, 568446438), h = v(h, a, u, p, l[m + 14], 9, -1019803690), p = v(p, h, a, u, l[m + 3], 14, -187363961), u = v(u, p, h, a, l[m + 8], 20, 1163531501), a = v(a, u, p, h, l[m + 13], 5, -1444681467), h = v(h, a, u, p, l[m + 2], 9, -51403784), p = v(p, h, a, u, l[m + 7], 14, 1735328473), u = v(u, p, h, a, l[m + 12], 20, -1926607734), a = x(a, u, p, h, l[m + 5], 4, -378558), h = x(h, a, u, p, l[m + 8], 11, -2022574463), p = x(p, h, a, u, l[m + 11], 16, 1839030562), u = x(u, p, h, a, l[m + 14], 23, -35309556), a = x(a, u, p, h, l[m + 1], 4, -1530992060), h = x(h, a, u, p, l[m + 4], 11, 1272893353), p = x(p, h, a, u, l[m + 7], 16, -155497632), u = x(u, p, h, a, l[m + 10], 23, -1094730640), a = x(a, u, p, h, l[m + 13], 4, 681279174), h = x(h, a, u, p, l[m + 0], 11, -358537222), p = x(p, h, a, u, l[m + 3], 16, -722521979), u = x(u, p, h, a, l[m + 6], 23, 76029189), a = x(a, u, p, h, l[m + 9], 4, -640364487), h = x(h, a, u, p, l[m + 12], 11, -421815835), p = x(p, h, a, u, l[m + 15], 16, 530742520), u = x(u, p, h, a, l[m + 2], 23, -995338651), a = D(a, u, p, h, l[m + 0], 6, -198630844), h = D(h, a, u, p, l[m + 7], 10, 1126891415), p = D(p, h, a, u, l[m + 14], 15, -1416354905), u = D(u, p, h, a, l[m + 5], 21, -57434055), a = D(a, u, p, h, l[m + 12], 6, 1700485571), h = D(h, a, u, p, l[m + 3], 10, -1894986606), p = D(p, h, a, u, l[m + 10], 15, -1051523), u = D(u, p, h, a, l[m + 1], 21, -2054922799), a = D(a, u, p, h, l[m + 8], 6, 1873313359), h = D(h, a, u, p, l[m + 15], 10, -30611744), p = D(p, h, a, u, l[m + 6], 15, -1560198380), u = D(u, p, h, a, l[m + 13], 21, 1309151649), a = D(a, u, p, h, l[m + 4], 6, -145523070), h = D(h, a, u, p, l[m + 11], 10, -1120210379), p = D(p, h, a, u, l[m + 2], 15, 718787259), u = D(u, p, h, a, l[m + 9], 21, -343485551), a = a + k >>> 0, u = u + S >>> 0, p = p + O >>> 0, h = h + U >>> 0;
        }
        return e.endian([a, u, p, h]);
      };
    n._ff = function (r, o, l, c, a, u, p) {
      var h = r + (o & l | ~o & c) + (a >>> 0) + p;
      return (h << u | h >>> 32 - u) + o;
    }, n._gg = function (r, o, l, c, a, u, p) {
      var h = r + (o & c | l & ~c) + (a >>> 0) + p;
      return (h << u | h >>> 32 - u) + o;
    }, n._hh = function (r, o, l, c, a, u, p) {
      var h = r + (o ^ l ^ c) + (a >>> 0) + p;
      return (h << u | h >>> 32 - u) + o;
    }, n._ii = function (r, o, l, c, a, u, p) {
      var h = r + (l ^ (o | ~c)) + (a >>> 0) + p;
      return (h << u | h >>> 32 - u) + o;
    }, n._blocksize = 16, n._digestsize = 16, Fc.exports = function (r, o) {
      if (r == null) throw new Error("Illegal argument " + r);
      var l = e.wordsToBytes(n(r, o));
      return o && o.asBytes ? l : o && o.asString ? s.bytesToString(l) : e.bytesToHex(l);
    };
  })();
  var ji, Hs;
  function Ge() {
    if (Hs) return ji;
    Hs = 1;
    function e(t, i, s, n, r, o) {
      return {
        tag: t,
        key: i,
        attrs: s,
        children: n,
        text: r,
        dom: o,
        domSize: void 0,
        state: void 0,
        events: void 0,
        instance: void 0
      };
    }
    return e.normalize = function (t) {
      return Array.isArray(t) ? e("[", void 0, void 0, e.normalizeChildren(t), void 0, void 0) : t == null || typeof t == "boolean" ? null : typeof t == "object" ? t : e("#", void 0, void 0, String(t), void 0, void 0);
    }, e.normalizeChildren = function (t) {
      var i = [];
      if (t.length) {
        for (var s = t[0] != null && t[0].key != null, n = 1; n < t.length; n++) if ((t[n] != null && t[n].key != null) !== s) throw new TypeError(s && (t[n] != null || typeof t[n] == "boolean") ? "In fragments, vnodes must either all have keys or none have keys. You may wish to consider using an explicit keyed empty fragment, m.fragment({key: ...}), instead of a hole." : "In fragments, vnodes must either all have keys or none have keys.");
        for (var n = 0; n < t.length; n++) i[n] = e.normalize(t[n]);
      }
      return i;
    }, ji = e, ji;
  }
  var Nc = Ge(),
    Jr = function () {
      var e = arguments[this],
        t = this + 1,
        i;
      if (e == null ? e = {} : (typeof e != "object" || e.tag != null || Array.isArray(e)) && (e = {}, t = this), arguments.length === t + 1) i = arguments[t], Array.isArray(i) || (i = [i]);else for (i = []; t < arguments.length;) i.push(arguments[t++]);
      return Nc("", e.key, e, i);
    },
    Ci = {}.hasOwnProperty,
    qc = Ge(),
    Wc = Jr,
    pt = Ci,
    Xc = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g,
    Qr = {};
  function Fs(e) {
    for (var t in e) if (pt.call(e, t)) return !1;
    return !0;
  }
  function Gc(e) {
    for (var t, i = "div", s = [], n = {}; t = Xc.exec(e);) {
      var r = t[1],
        o = t[2];
      if (r === "" && o !== "") i = o;else if (r === "#") n.id = o;else if (r === ".") s.push(o);else if (t[3][0] === "[") {
        var l = t[6];
        l && (l = l.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")), t[4] === "class" ? s.push(l) : n[t[4]] = l === "" ? l : l || !0;
      }
    }
    return s.length > 0 && (n.className = s.join(" ")), Qr[e] = {
      tag: i,
      attrs: n
    };
  }
  function Yc(e, t) {
    var i = t.attrs,
      s = pt.call(i, "class"),
      n = s ? i.class : i.className;
    if (t.tag = e.tag, t.attrs = {}, !Fs(e.attrs) && !Fs(i)) {
      var r = {};
      for (var o in i) pt.call(i, o) && (r[o] = i[o]);
      i = r;
    }
    for (var o in e.attrs) pt.call(e.attrs, o) && o !== "className" && !pt.call(i, o) && (i[o] = e.attrs[o]);
    (n != null || e.attrs.className != null) && (i.className = n != null ? e.attrs.className != null ? String(e.attrs.className) + " " + String(n) : n : e.attrs.className != null ? e.attrs.className : null), s && (i.class = null);
    for (var o in i) if (pt.call(i, o) && o !== "key") {
      t.attrs = i;
      break;
    }
    return t;
  }
  function $c(e) {
    if (e == null || typeof e != "string" && typeof e != "function" && typeof e.view != "function") throw Error("The selector must be either a string or a component.");
    var t = Wc.apply(1, arguments);
    return typeof e == "string" && (t.children = qc.normalizeChildren(t.children), e !== "[") ? Yc(Qr[e] || Gc(e), t) : (t.tag = e, t);
  }
  var Zr = $c,
    Kc = Ge(),
    Jc = function (e) {
      return e == null && (e = ""), Kc("<", void 0, void 0, e, void 0, void 0);
    },
    Qc = Ge(),
    Zc = Jr,
    jc = function () {
      var e = Zc.apply(0, arguments);
      return e.tag = "[", e.children = Qc.normalizeChildren(e.children), e;
    },
    ns = Zr;
  ns.trust = Jc;
  ns.fragment = jc;
  var eh = ns,
    yi = {},
    en = {
      get exports() {
        return yi;
      },
      set exports(e) {
        yi = e;
      }
    },
    tn,
    Vs;
  function jr() {
    if (Vs) return tn;
    Vs = 1;
    var e = function (t) {
      if (!(this instanceof e)) throw new Error("Promise must be called with 'new'.");
      if (typeof t != "function") throw new TypeError("executor must be a function.");
      var i = this,
        s = [],
        n = [],
        r = a(s, !0),
        o = a(n, !1),
        l = i._instance = {
          resolvers: s,
          rejectors: n
        },
        c = typeof setImmediate == "function" ? setImmediate : setTimeout;
      function a(p, h) {
        return function m(w) {
          var v;
          try {
            if (h && w != null && (typeof w == "object" || typeof w == "function") && typeof (v = w.then) == "function") {
              if (w === i) throw new TypeError("Promise can't be resolved with itself.");
              u(v.bind(w));
            } else c(function () {
              !h && p.length === 0 && console.error("Possible unhandled promise rejection:", w);
              for (var x = 0; x < p.length; x++) p[x](w);
              s.length = 0, n.length = 0, l.state = h, l.retry = function () {
                m(w);
              };
            });
          } catch (x) {
            o(x);
          }
        };
      }
      function u(p) {
        var h = 0;
        function m(v) {
          return function (x) {
            h++ > 0 || v(x);
          };
        }
        var w = m(o);
        try {
          p(m(r), w);
        } catch (v) {
          w(v);
        }
      }
      u(t);
    };
    return e.prototype.then = function (t, i) {
      var s = this,
        n = s._instance;
      function r(a, u, p, h) {
        u.push(function (m) {
          if (typeof a != "function") p(m);else try {
            o(a(m));
          } catch (w) {
            l && l(w);
          }
        }), typeof n.retry == "function" && h === n.state && n.retry();
      }
      var o,
        l,
        c = new e(function (a, u) {
          o = a, l = u;
        });
      return r(t, n.resolvers, o, !0), r(i, n.rejectors, l, !1), c;
    }, e.prototype.catch = function (t) {
      return this.then(null, t);
    }, e.prototype.finally = function (t) {
      return this.then(function (i) {
        return e.resolve(t()).then(function () {
          return i;
        });
      }, function (i) {
        return e.resolve(t()).then(function () {
          return e.reject(i);
        });
      });
    }, e.resolve = function (t) {
      return t instanceof e ? t : new e(function (i) {
        i(t);
      });
    }, e.reject = function (t) {
      return new e(function (i, s) {
        s(t);
      });
    }, e.all = function (t) {
      return new e(function (i, s) {
        var n = t.length,
          r = 0,
          o = [];
        if (t.length === 0) i([]);else for (var l = 0; l < t.length; l++) (function (c) {
          function a(u) {
            r++, o[c] = u, r === n && i(o);
          }
          t[c] != null && (typeof t[c] == "object" || typeof t[c] == "function") && typeof t[c].then == "function" ? t[c].then(a, s) : a(t[c]);
        })(l);
      });
    }, e.race = function (t) {
      return new e(function (i, s) {
        for (var n = 0; n < t.length; n++) t[n].then(i, s);
      });
    }, tn = e, tn;
  }
  var _t = jr();
  typeof window < "u" ? (typeof window.Promise > "u" ? window.Promise = _t : window.Promise.prototype.finally || (window.Promise.prototype.finally = _t.prototype.finally), en.exports = window.Promise) : typeof rt < "u" ? (typeof rt.Promise > "u" ? rt.Promise = _t : rt.Promise.prototype.finally || (rt.Promise.prototype.finally = _t.prototype.finally), en.exports = rt.Promise) : en.exports = _t;
  var nn, Us;
  function th() {
    if (Us) return nn;
    Us = 1;
    var e = Ge();
    return nn = function (t) {
      var i = t && t.document,
        s,
        n = {
          svg: "http://www.w3.org/2000/svg",
          math: "http://www.w3.org/1998/Math/MathML"
        };
      function r(d) {
        return d.attrs && d.attrs.xmlns || n[d.tag];
      }
      function o(d, f) {
        if (d.state !== f) throw new Error("'vnode.state' must not be modified.");
      }
      function l(d) {
        var f = d.state;
        try {
          return this.apply(f, arguments);
        } finally {
          o(d, f);
        }
      }
      function c() {
        try {
          return i.activeElement;
        } catch {
          return null;
        }
      }
      function a(d, f, g, b, I, A, H) {
        for (var N = g; N < b; N++) {
          var B = f[N];
          B != null && u(d, B, I, H, A);
        }
      }
      function u(d, f, g, b, I) {
        var A = f.tag;
        if (typeof A == "string") switch (f.state = {}, f.attrs != null && Fi(f.attrs, f, g), A) {
          case "#":
            p(d, f, I);
            break;
          case "<":
            m(d, f, b, I);
            break;
          case "[":
            w(d, f, g, b, I);
            break;
          default:
            v(d, f, g, b, I);
        } else D(d, f, g, b, I);
      }
      function p(d, f, g) {
        f.dom = i.createTextNode(f.children), X(d, f.dom, g);
      }
      var h = {
        caption: "table",
        thead: "table",
        tbody: "table",
        tfoot: "table",
        tr: "tbody",
        th: "tr",
        td: "tr",
        colgroup: "table",
        col: "colgroup"
      };
      function m(d, f, g, b) {
        var I = f.children.match(/^\s*?<(\w+)/im) || [],
          A = i.createElement(h[I[1]] || "div");
        g === "http://www.w3.org/2000/svg" ? (A.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + f.children + "</svg>", A = A.firstChild) : A.innerHTML = f.children, f.dom = A.firstChild, f.domSize = A.childNodes.length, f.instance = [];
        for (var H = i.createDocumentFragment(), N; N = A.firstChild;) f.instance.push(N), H.appendChild(N);
        X(d, H, b);
      }
      function w(d, f, g, b, I) {
        var A = i.createDocumentFragment();
        if (f.children != null) {
          var H = f.children;
          a(A, H, 0, H.length, g, null, b);
        }
        f.dom = A.firstChild, f.domSize = A.childNodes.length, X(d, A, I);
      }
      function v(d, f, g, b, I) {
        var A = f.tag,
          H = f.attrs,
          N = H && H.is;
        b = r(f) || b;
        var B = b ? N ? i.createElementNS(b, A, {
          is: N
        }) : i.createElementNS(b, A) : N ? i.createElement(A, {
          is: N
        }) : i.createElement(A);
        if (f.dom = B, H != null && Bi(f, H, b), X(d, B, I), !G(f) && f.children != null) {
          var Y = f.children;
          a(B, Y, 0, Y.length, g, null, b), f.tag === "select" && H != null && No(f, H);
        }
      }
      function x(d, f) {
        var g;
        if (typeof d.tag.view == "function") {
          if (d.state = Object.create(d.tag), g = d.state.view, g.$$reentrantLock$$ != null) return;
          g.$$reentrantLock$$ = !0;
        } else {
          if (d.state = void 0, g = d.tag, g.$$reentrantLock$$ != null) return;
          g.$$reentrantLock$$ = !0, d.state = d.tag.prototype != null && typeof d.tag.prototype.view == "function" ? new d.tag(d) : d.tag(d);
        }
        if (Fi(d.state, d, f), d.attrs != null && Fi(d.attrs, d, f), d.instance = e.normalize(l.call(d.state.view, d)), d.instance === d) throw Error("A view cannot return the vnode it received as argument");
        g.$$reentrantLock$$ = null;
      }
      function D(d, f, g, b, I) {
        x(f, g), f.instance != null ? (u(d, f.instance, g, b, I), f.dom = f.instance.dom, f.domSize = f.dom != null ? f.instance.domSize : 0) : f.domSize = 0;
      }
      function k(d, f, g, b, I, A) {
        if (!(f === g || f == null && g == null)) if (f == null || f.length === 0) a(d, g, 0, g.length, b, I, A);else if (g == null || g.length === 0) te(d, f, 0, f.length);else {
          var H = f[0] != null && f[0].key != null,
            N = g[0] != null && g[0].key != null,
            B = 0,
            Y = 0;
          if (!H) for (; Y < f.length && f[Y] == null;) Y++;
          if (!N) for (; B < g.length && g[B] == null;) B++;
          if (H !== N) te(d, f, Y, f.length), a(d, g, B, g.length, b, I, A);else if (N) {
            for (var ve = f.length - 1, fe = g.length - 1, ni, xe, oe, ge, Z, Li; ve >= Y && fe >= B && (ge = f[ve], Z = g[fe], ge.key === Z.key);) ge !== Z && S(d, ge, Z, b, I, A), Z.dom != null && (I = Z.dom), ve--, fe--;
            for (; ve >= Y && fe >= B && (xe = f[Y], oe = g[B], xe.key === oe.key);) Y++, B++, xe !== oe && S(d, xe, oe, b, $(f, Y, I), A);
            for (; ve >= Y && fe >= B && !(B === fe || xe.key !== Z.key || ge.key !== oe.key);) Li = $(f, Y, I), V(d, ge, Li), ge !== oe && S(d, ge, oe, b, Li, A), ++B <= --fe && V(d, xe, I), xe !== Z && S(d, xe, Z, b, I, A), Z.dom != null && (I = Z.dom), Y++, ve--, ge = f[ve], Z = g[fe], xe = f[Y], oe = g[B];
            for (; ve >= Y && fe >= B && ge.key === Z.key;) ge !== Z && S(d, ge, Z, b, I, A), Z.dom != null && (I = Z.dom), ve--, fe--, ge = f[ve], Z = g[fe];
            if (B > fe) te(d, f, Y, ve + 1);else if (Y > ve) a(d, g, B, fe + 1, b, I, A);else {
              var $o = I,
                Ps = fe - B + 1,
                At = new Array(Ps),
                Ni = 0,
                ne = 0,
                qi = 2147483647,
                Wi = 0,
                ni,
                Xi;
              for (ne = 0; ne < Ps; ne++) At[ne] = -1;
              for (ne = fe; ne >= B; ne--) {
                ni == null && (ni = W(f, Y, ve + 1)), Z = g[ne];
                var st = ni[Z.key];
                st != null && (qi = st < qi ? st : -1, At[ne - B] = st, ge = f[st], f[st] = null, ge !== Z && S(d, ge, Z, b, I, A), Z.dom != null && (I = Z.dom), Wi++);
              }
              if (I = $o, Wi !== ve - Y + 1 && te(d, f, Y, ve + 1), Wi === 0) a(d, g, B, fe + 1, b, I, A);else if (qi === -1) for (Xi = _(At), Ni = Xi.length - 1, ne = fe; ne >= B; ne--) oe = g[ne], At[ne - B] === -1 ? u(d, oe, b, A, I) : Xi[Ni] === ne - B ? Ni-- : V(d, oe, I), oe.dom != null && (I = g[ne].dom);else for (ne = fe; ne >= B; ne--) oe = g[ne], At[ne - B] === -1 && u(d, oe, b, A, I), oe.dom != null && (I = g[ne].dom);
            }
          } else {
            var Ui = f.length < g.length ? f.length : g.length;
            for (B = B < Y ? B : Y; B < Ui; B++) xe = f[B], oe = g[B], !(xe === oe || xe == null && oe == null) && (xe == null ? u(d, oe, b, A, $(f, B + 1, I)) : oe == null ? ie(d, xe) : S(d, xe, oe, b, $(f, B + 1, I), A));
            f.length > Ui && te(d, f, B, f.length), g.length > Ui && a(d, g, B, g.length, b, I, A);
          }
        }
      }
      function S(d, f, g, b, I, A) {
        var H = f.tag,
          N = g.tag;
        if (H === N) {
          if (g.state = f.state, g.events = f.events, Yo(g, f)) return;
          if (typeof H == "string") switch (g.attrs != null && Vi(g.attrs, g, b), H) {
            case "#":
              O(f, g);
              break;
            case "<":
              U(d, f, g, A, I);
              break;
            case "[":
              L(d, f, g, b, I, A);
              break;
            default:
              q(f, g, b, A);
          } else P(d, f, g, b, I, A);
        } else ie(d, f), u(d, g, b, A, I);
      }
      function O(d, f) {
        d.children.toString() !== f.children.toString() && (d.dom.nodeValue = f.children), f.dom = d.dom;
      }
      function U(d, f, g, b, I) {
        f.children !== g.children ? (K(d, f), m(d, g, b, I)) : (g.dom = f.dom, g.domSize = f.domSize, g.instance = f.instance);
      }
      function L(d, f, g, b, I, A) {
        k(d, f.children, g.children, b, I, A);
        var H = 0,
          N = g.children;
        if (g.dom = null, N != null) {
          for (var B = 0; B < N.length; B++) {
            var Y = N[B];
            Y != null && Y.dom != null && (g.dom == null && (g.dom = Y.dom), H += Y.domSize || 1);
          }
          H !== 1 && (g.domSize = H);
        }
      }
      function q(d, f, g, b) {
        var I = f.dom = d.dom;
        b = r(f) || b, f.tag === "textarea" && f.attrs == null && (f.attrs = {}), qo(f, d.attrs, f.attrs, b), G(f) || k(I, d.children, f.children, g, null, b);
      }
      function P(d, f, g, b, I, A) {
        if (g.instance = e.normalize(l.call(g.state.view, g)), g.instance === g) throw Error("A view cannot return the vnode it received as argument");
        Vi(g.state, g, b), g.attrs != null && Vi(g.attrs, g, b), g.instance != null ? (f.instance == null ? u(d, g.instance, b, A, I) : S(d, f.instance, g.instance, b, I, A), g.dom = g.instance.dom, g.domSize = g.instance.domSize) : f.instance != null ? (ie(d, f.instance), g.dom = void 0, g.domSize = 0) : (g.dom = f.dom, g.domSize = f.domSize);
      }
      function W(d, f, g) {
        for (var b = Object.create(null); f < g; f++) {
          var I = d[f];
          if (I != null) {
            var A = I.key;
            A != null && (b[A] = f);
          }
        }
        return b;
      }
      var F = [];
      function _(d) {
        for (var f = [0], g = 0, b = 0, I = 0, A = F.length = d.length, I = 0; I < A; I++) F[I] = d[I];
        for (var I = 0; I < A; ++I) if (d[I] !== -1) {
          var H = f[f.length - 1];
          if (d[H] < d[I]) {
            F[I] = H, f.push(I);
            continue;
          }
          for (g = 0, b = f.length - 1; g < b;) {
            var N = (g >>> 1) + (b >>> 1) + (g & b & 1);
            d[f[N]] < d[I] ? g = N + 1 : b = N;
          }
          d[I] < d[f[g]] && (g > 0 && (F[I] = f[g - 1]), f[g] = I);
        }
        for (g = f.length, b = f[g - 1]; g-- > 0;) f[g] = b, b = F[b];
        return F.length = 0, f;
      }
      function $(d, f, g) {
        for (; f < d.length; f++) if (d[f] != null && d[f].dom != null) return d[f].dom;
        return g;
      }
      function V(d, f, g) {
        var b = i.createDocumentFragment();
        z(d, b, f), X(d, b, g);
      }
      function z(d, f, g) {
        for (; g.dom != null && g.dom.parentNode === d;) {
          if (typeof g.tag != "string") {
            if (g = g.instance, g != null) continue;
          } else if (g.tag === "<") for (var b = 0; b < g.instance.length; b++) f.appendChild(g.instance[b]);else if (g.tag !== "[") f.appendChild(g.dom);else if (g.children.length === 1) {
            if (g = g.children[0], g != null) continue;
          } else for (var b = 0; b < g.children.length; b++) {
            var I = g.children[b];
            I != null && z(d, f, I);
          }
          break;
        }
      }
      function X(d, f, g) {
        g != null ? d.insertBefore(f, g) : d.appendChild(f);
      }
      function G(d) {
        if (d.attrs == null || d.attrs.contenteditable == null && d.attrs.contentEditable == null) return !1;
        var f = d.children;
        if (f != null && f.length === 1 && f[0].tag === "<") {
          var g = f[0].children;
          d.dom.innerHTML !== g && (d.dom.innerHTML = g);
        } else if (f != null && f.length !== 0) throw new Error("Child node of a contenteditable must be trusted.");
        return !0;
      }
      function te(d, f, g, b) {
        for (var I = g; I < b; I++) {
          var A = f[I];
          A != null && ie(d, A);
        }
      }
      function ie(d, f) {
        var g = 0,
          b = f.state,
          I,
          A;
        if (typeof f.tag != "string" && typeof f.state.onbeforeremove == "function") {
          var H = l.call(f.state.onbeforeremove, f);
          H != null && typeof H.then == "function" && (g = 1, I = H);
        }
        if (f.attrs && typeof f.attrs.onbeforeremove == "function") {
          var H = l.call(f.attrs.onbeforeremove, f);
          H != null && typeof H.then == "function" && (g |= 2, A = H);
        }
        if (o(f, b), !g) nt(f), ke(d, f);else {
          if (I != null) {
            var N = function () {
              g & 1 && (g &= 2, g || B());
            };
            I.then(N, N);
          }
          if (A != null) {
            var N = function () {
              g & 2 && (g &= 1, g || B());
            };
            A.then(N, N);
          }
        }
        function B() {
          o(f, b), nt(f), ke(d, f);
        }
      }
      function K(d, f) {
        for (var g = 0; g < f.instance.length; g++) d.removeChild(f.instance[g]);
      }
      function ke(d, f) {
        for (; f.dom != null && f.dom.parentNode === d;) {
          if (typeof f.tag != "string") {
            if (f = f.instance, f != null) continue;
          } else if (f.tag === "<") K(d, f);else {
            if (f.tag !== "[" && (d.removeChild(f.dom), !Array.isArray(f.children))) break;
            if (f.children.length === 1) {
              if (f = f.children[0], f != null) continue;
            } else for (var g = 0; g < f.children.length; g++) {
              var b = f.children[g];
              b != null && ke(d, b);
            }
          }
          break;
        }
      }
      function nt(d) {
        if (typeof d.tag != "string" && typeof d.state.onremove == "function" && l.call(d.state.onremove, d), d.attrs && typeof d.attrs.onremove == "function" && l.call(d.attrs.onremove, d), typeof d.tag != "string") d.instance != null && nt(d.instance);else {
          var f = d.children;
          if (Array.isArray(f)) for (var g = 0; g < f.length; g++) {
            var b = f[g];
            b != null && nt(b);
          }
        }
      }
      function Bi(d, f, g) {
        d.tag === "input" && f.type != null && d.dom.setAttribute("type", f.type);
        var b = f != null && d.tag === "input" && f.type === "file";
        for (var I in f) Ue(d, I, null, f[I], g, b);
      }
      function Ue(d, f, g, b, I, A) {
        if (!(f === "key" || f === "is" || b == null || Ts(f) || g === b && !Wo(d, f) && typeof b != "object" || f === "type" && d.tag === "input")) {
          if (f[0] === "o" && f[1] === "n") return Es(d, f, b);
          if (f.slice(0, 6) === "xlink:") d.dom.setAttributeNS("http://www.w3.org/1999/xlink", f.slice(6), b);else if (f === "style") Ms(d.dom, g, b);else if (Is(d, f, I)) {
            if (f === "value") {
              if ((d.tag === "input" || d.tag === "textarea") && d.dom.value === "" + b && (A || d.dom === c()) || d.tag === "select" && g !== null && d.dom.value === "" + b || d.tag === "option" && g !== null && d.dom.value === "" + b) return;
              if (A && "" + b != "") {
                console.error("`value` is read-only on file inputs!");
                return;
              }
            }
            d.dom[f] = b;
          } else typeof b == "boolean" ? b ? d.dom.setAttribute(f, "") : d.dom.removeAttribute(f) : d.dom.setAttribute(f === "className" ? "class" : f, b);
        }
      }
      function Ye(d, f, g, b) {
        if (!(f === "key" || f === "is" || g == null || Ts(f))) if (f[0] === "o" && f[1] === "n") Es(d, f, void 0);else if (f === "style") Ms(d.dom, g, null);else if (Is(d, f, b) && f !== "className" && f !== "title" && !(f === "value" && (d.tag === "option" || d.tag === "select" && d.dom.selectedIndex === -1 && d.dom === c())) && !(d.tag === "input" && f === "type")) d.dom[f] = null;else {
          var I = f.indexOf(":");
          I !== -1 && (f = f.slice(I + 1)), g !== !1 && d.dom.removeAttribute(f === "className" ? "class" : f);
        }
      }
      function No(d, f) {
        if ("value" in f) if (f.value === null) d.dom.selectedIndex !== -1 && (d.dom.value = null);else {
          var g = "" + f.value;
          (d.dom.value !== g || d.dom.selectedIndex === -1) && (d.dom.value = g);
        }
        "selectedIndex" in f && Ue(d, "selectedIndex", null, f.selectedIndex, void 0);
      }
      function qo(d, f, g, b) {
        if (f && f === g && console.warn("Don't reuse attrs object, use new object for every redraw, this will throw in next major"), g != null) {
          d.tag === "input" && g.type != null && d.dom.setAttribute("type", g.type);
          var I = d.tag === "input" && g.type === "file";
          for (var A in g) Ue(d, A, f && f[A], g[A], b, I);
        }
        var H;
        if (f != null) for (var A in f) (H = f[A]) != null && (g == null || g[A] == null) && Ye(d, A, H, b);
      }
      function Wo(d, f) {
        return f === "value" || f === "checked" || f === "selectedIndex" || f === "selected" && d.dom === c() || d.tag === "option" && d.dom.parentNode === i.activeElement;
      }
      function Ts(d) {
        return d === "oninit" || d === "oncreate" || d === "onupdate" || d === "onremove" || d === "onbeforeremove" || d === "onbeforeupdate";
      }
      function Is(d, f, g) {
        return g === void 0 && (d.tag.indexOf("-") > -1 || d.attrs != null && d.attrs.is || f !== "href" && f !== "list" && f !== "form" && f !== "width" && f !== "height") && f in d.dom;
      }
      var Xo = /[A-Z]/g;
      function Go(d) {
        return "-" + d.toLowerCase();
      }
      function zi(d) {
        return d[0] === "-" && d[1] === "-" ? d : d === "cssFloat" ? "float" : d.replace(Xo, Go);
      }
      function Ms(d, f, g) {
        if (f !== g) if (g == null) d.style.cssText = "";else if (typeof g != "object") d.style.cssText = g;else if (f == null || typeof f != "object") {
          d.style.cssText = "";
          for (var b in g) {
            var I = g[b];
            I != null && d.style.setProperty(zi(b), String(I));
          }
        } else {
          for (var b in g) {
            var I = g[b];
            I != null && (I = String(I)) !== String(f[b]) && d.style.setProperty(zi(b), I);
          }
          for (var b in f) f[b] != null && g[b] == null && d.style.removeProperty(zi(b));
        }
      }
      function Hi() {
        this._ = s;
      }
      Hi.prototype = Object.create(null), Hi.prototype.handleEvent = function (d) {
        var f = this["on" + d.type],
          g;
        typeof f == "function" ? g = f.call(d.currentTarget, d) : typeof f.handleEvent == "function" && f.handleEvent(d), this._ && d.redraw !== !1 && (0, this._)(), g === !1 && (d.preventDefault(), d.stopPropagation());
      };
      function Es(d, f, g) {
        if (d.events != null) {
          if (d.events._ = s, d.events[f] === g) return;
          g != null && (typeof g == "function" || typeof g == "object") ? (d.events[f] == null && d.dom.addEventListener(f.slice(2), d.events, !1), d.events[f] = g) : (d.events[f] != null && d.dom.removeEventListener(f.slice(2), d.events, !1), d.events[f] = void 0);
        } else g != null && (typeof g == "function" || typeof g == "object") && (d.events = new Hi(), d.dom.addEventListener(f.slice(2), d.events, !1), d.events[f] = g);
      }
      function Fi(d, f, g) {
        typeof d.oninit == "function" && l.call(d.oninit, f), typeof d.oncreate == "function" && g.push(l.bind(d.oncreate, f));
      }
      function Vi(d, f, g) {
        typeof d.onupdate == "function" && g.push(l.bind(d.onupdate, f));
      }
      function Yo(d, f) {
        do {
          if (d.attrs != null && typeof d.attrs.onbeforeupdate == "function") {
            var g = l.call(d.attrs.onbeforeupdate, d, f);
            if (g !== void 0 && !g) break;
          }
          if (typeof d.tag != "string" && typeof d.state.onbeforeupdate == "function") {
            var g = l.call(d.state.onbeforeupdate, d, f);
            if (g !== void 0 && !g) break;
          }
          return !1;
        } while (!1);
        return d.dom = f.dom, d.domSize = f.domSize, d.instance = f.instance, d.attrs = f.attrs, d.children = f.children, d.text = f.text, !0;
      }
      var Ct;
      return function (d, f, g) {
        if (!d) throw new TypeError("DOM element being rendered to does not exist.");
        if (Ct != null && d.contains(Ct)) throw new TypeError("Node is currently being rendered to and thus is locked.");
        var b = s,
          I = Ct,
          A = [],
          H = c(),
          N = d.namespaceURI;
        Ct = d, s = typeof g == "function" ? g : void 0;
        try {
          d.vnodes == null && (d.textContent = ""), f = e.normalizeChildren(Array.isArray(f) ? f : [f]), k(d, d.vnodes, f, A, null, N === "http://www.w3.org/1999/xhtml" ? void 0 : N), d.vnodes = f, H != null && c() !== H && typeof H.focus == "function" && H.focus();
          for (var B = 0; B < A.length; B++) A[B]();
        } finally {
          s = b, Ct = I;
        }
      };
    }, nn;
  }
  var sn, Ls;
  function eo() {
    return Ls || (Ls = 1, sn = th()(typeof window < "u" ? window : null)), sn;
  }
  var Ns = Ge(),
    ih = function (e, t, i) {
      var s = [],
        n = !1,
        r = -1;
      function o() {
        for (r = 0; r < s.length; r += 2) try {
          e(s[r], Ns(s[r + 1]), l);
        } catch (a) {
          i.error(a);
        }
        r = -1;
      }
      function l() {
        n || (n = !0, t(function () {
          n = !1, o();
        }));
      }
      l.sync = o;
      function c(a, u) {
        if (u != null && u.view == null && typeof u != "function") throw new TypeError("m.mount expects a component, not a vnode.");
        var p = s.indexOf(a);
        p >= 0 && (s.splice(p, 2), p <= r && (r -= 2), e(a, [])), u != null && (s.push(a, u), e(a, Ns(u), l));
      }
      return {
        mount: c,
        redraw: l
      };
    },
    nh = eo(),
    ss = ih(nh, typeof requestAnimationFrame < "u" ? requestAnimationFrame : null, typeof console < "u" ? console : null),
    rn,
    qs;
  function to() {
    return qs || (qs = 1, rn = function (e) {
      if (Object.prototype.toString.call(e) !== "[object Object]") return "";
      var t = [];
      for (var i in e) s(i, e[i]);
      return t.join("&");
      function s(n, r) {
        if (Array.isArray(r)) for (var o = 0; o < r.length; o++) s(n + "[" + o + "]", r[o]);else if (Object.prototype.toString.call(r) === "[object Object]") for (var o in r) s(n + "[" + o + "]", r[o]);else t.push(encodeURIComponent(n) + (r != null && r !== "" ? "=" + encodeURIComponent(r) : ""));
      }
    }), rn;
  }
  var on, Ws;
  function io() {
    if (Ws) return on;
    Ws = 1;
    var e = Ci;
    return on = Object.assign || function (t, i) {
      for (var s in i) e.call(i, s) && (t[s] = i[s]);
    }, on;
  }
  var an, Xs;
  function rs() {
    if (Xs) return an;
    Xs = 1;
    var e = to(),
      t = io();
    return an = function (i, s) {
      if (/:([^\/\.-]+)(\.{3})?:/.test(i)) throw new SyntaxError("Template parameter names must be separated by either a '/', '-', or '.'.");
      if (s == null) return i;
      var n = i.indexOf("?"),
        r = i.indexOf("#"),
        o = r < 0 ? i.length : r,
        l = n < 0 ? o : n,
        c = i.slice(0, l),
        a = {};
      t(a, s);
      var u = c.replace(/:([^\/\.-]+)(\.{3})?/g, function (D, k, S) {
          return delete a[k], s[k] == null ? D : S ? s[k] : encodeURIComponent(String(s[k]));
        }),
        p = u.indexOf("?"),
        h = u.indexOf("#"),
        m = h < 0 ? u.length : h,
        w = p < 0 ? m : p,
        v = u.slice(0, w);
      n >= 0 && (v += i.slice(n, o)), p >= 0 && (v += (n < 0 ? "?" : "&") + u.slice(p, m));
      var x = e(a);
      return x && (v += (n < 0 && p < 0 ? "?" : "&") + x), r >= 0 && (v += i.slice(r)), h >= 0 && (v += (r < 0 ? "" : "&") + u.slice(h)), v;
    }, an;
  }
  var sh = rs(),
    Gs = Ci,
    rh = function (e, t, i) {
      var s = 0;
      function n(l) {
        return new t(l);
      }
      n.prototype = t.prototype, n.__proto__ = t;
      function r(l) {
        return function (c, a) {
          typeof c != "string" ? (a = c, c = c.url) : a == null && (a = {});
          var u = new t(function (w, v) {
            l(sh(c, a.params), a, function (x) {
              if (typeof a.type == "function") if (Array.isArray(x)) for (var D = 0; D < x.length; D++) x[D] = new a.type(x[D]);else x = new a.type(x);
              w(x);
            }, v);
          });
          if (a.background === !0) return u;
          var p = 0;
          function h() {
            --p === 0 && typeof i == "function" && i();
          }
          return m(u);
          function m(w) {
            var v = w.then;
            return w.constructor = n, w.then = function () {
              p++;
              var x = v.apply(w, arguments);
              return x.then(h, function (D) {
                if (h(), p === 0) throw D;
              }), m(x);
            }, w;
          }
        };
      }
      function o(l, c) {
        for (var a in l.headers) if (Gs.call(l.headers, a) && a.toLowerCase() === c) return !0;
        return !1;
      }
      return {
        request: r(function (l, c, a, u) {
          var p = c.method != null ? c.method.toUpperCase() : "GET",
            h = c.body,
            m = (c.serialize == null || c.serialize === JSON.serialize) && !(h instanceof e.FormData || h instanceof e.URLSearchParams),
            w = c.responseType || (typeof c.extract == "function" ? "" : "json"),
            v = new e.XMLHttpRequest(),
            x = !1,
            D = !1,
            k = v,
            S,
            O = v.abort;
          v.abort = function () {
            x = !0, O.call(this);
          }, v.open(p, l, c.async !== !1, typeof c.user == "string" ? c.user : void 0, typeof c.password == "string" ? c.password : void 0), m && h != null && !o(c, "content-type") && v.setRequestHeader("Content-Type", "application/json; charset=utf-8"), typeof c.deserialize != "function" && !o(c, "accept") && v.setRequestHeader("Accept", "application/json, text/*"), c.withCredentials && (v.withCredentials = c.withCredentials), c.timeout && (v.timeout = c.timeout), v.responseType = w;
          for (var U in c.headers) Gs.call(c.headers, U) && v.setRequestHeader(U, c.headers[U]);
          v.onreadystatechange = function (L) {
            if (!x && L.target.readyState === 4) try {
              var q = L.target.status >= 200 && L.target.status < 300 || L.target.status === 304 || /^file:\/\//i.test(l),
                P = L.target.response,
                W;
              if (w === "json") {
                if (!L.target.responseType && typeof c.extract != "function") try {
                  P = JSON.parse(L.target.responseText);
                } catch {
                  P = null;
                }
              } else (!w || w === "text") && P == null && (P = L.target.responseText);
              if (typeof c.extract == "function" ? (P = c.extract(L.target, c), q = !0) : typeof c.deserialize == "function" && (P = c.deserialize(P)), q) a(P);else {
                var F = function () {
                  try {
                    W = L.target.responseText;
                  } catch {
                    W = P;
                  }
                  var _ = new Error(W);
                  _.code = L.target.status, _.response = P, u(_);
                };
                v.status === 0 ? setTimeout(function () {
                  D || F();
                }) : F();
              }
            } catch (_) {
              u(_);
            }
          }, v.ontimeout = function (L) {
            D = !0;
            var q = new Error("Request timed out");
            q.code = L.target.status, u(q);
          }, typeof c.config == "function" && (v = c.config(v, c, l) || v, v !== k && (S = v.abort, v.abort = function () {
            x = !0, S.call(this);
          })), h == null ? v.send() : typeof c.serialize == "function" ? v.send(c.serialize(h)) : h instanceof e.FormData || h instanceof e.URLSearchParams ? v.send(h) : v.send(JSON.stringify(h));
        }),
        jsonp: r(function (l, c, a, u) {
          var p = c.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + s++,
            h = e.document.createElement("script");
          e[p] = function (m) {
            delete e[p], h.parentNode.removeChild(h), a(m);
          }, h.onerror = function () {
            delete e[p], h.parentNode.removeChild(h), u(new Error("JSONP request failed"));
          }, h.src = l + (l.indexOf("?") < 0 ? "?" : "&") + encodeURIComponent(c.callbackKey || "callback") + "=" + encodeURIComponent(p), e.document.documentElement.appendChild(h);
        })
      };
    },
    oh = yi,
    ah = ss,
    lh = rh(typeof window < "u" ? window : null, oh, ah.redraw),
    ln,
    Ys;
  function no() {
    if (Ys) return ln;
    Ys = 1;
    function e(t) {
      try {
        return decodeURIComponent(t);
      } catch {
        return t;
      }
    }
    return ln = function (t) {
      if (t === "" || t == null) return {};
      t.charAt(0) === "?" && (t = t.slice(1));
      for (var i = t.split("&"), s = {}, n = {}, r = 0; r < i.length; r++) {
        var o = i[r].split("="),
          l = e(o[0]),
          c = o.length === 2 ? e(o[1]) : "";
        c === "true" ? c = !0 : c === "false" && (c = !1);
        var a = l.split(/\]\[?|\[/),
          u = n;
        l.indexOf("[") > -1 && a.pop();
        for (var p = 0; p < a.length; p++) {
          var h = a[p],
            m = a[p + 1],
            w = m == "" || !isNaN(parseInt(m, 10));
          if (h === "") {
            var l = a.slice(0, p).join();
            s[l] == null && (s[l] = Array.isArray(u) ? u.length : 0), h = s[l]++;
          } else if (h === "__proto__") break;
          if (p === a.length - 1) u[h] = c;else {
            var v = Object.getOwnPropertyDescriptor(u, h);
            v != null && (v = v.value), v == null && (u[h] = v = w ? [] : {}), u = v;
          }
        }
      }
      return n;
    }, ln;
  }
  var cn, $s;
  function os() {
    if ($s) return cn;
    $s = 1;
    var e = no();
    return cn = function (t) {
      var i = t.indexOf("?"),
        s = t.indexOf("#"),
        n = s < 0 ? t.length : s,
        r = i < 0 ? n : i,
        o = t.slice(0, r).replace(/\/{2,}/g, "/");
      return o ? (o[0] !== "/" && (o = "/" + o), o.length > 1 && o[o.length - 1] === "/" && (o = o.slice(0, -1))) : o = "/", {
        path: o,
        params: i < 0 ? {} : e(t.slice(i + 1, n))
      };
    }, cn;
  }
  var hn, Ks;
  function ch() {
    if (Ks) return hn;
    Ks = 1;
    var e = os();
    return hn = function (t) {
      var i = e(t),
        s = Object.keys(i.params),
        n = [],
        r = new RegExp("^" + i.path.replace(/:([^\/.-]+)(\.{3}|\.(?!\.)|-)?|[\\^$*+.()|\[\]{}]/g, function (o, l, c) {
          return l == null ? "\\" + o : (n.push({
            k: l,
            r: c === "..."
          }), c === "..." ? "(.*)" : c === "." ? "([^/]+)\\." : "([^/]+)" + (c || ""));
        }) + "$");
      return function (o) {
        for (var l = 0; l < s.length; l++) if (i.params[s[l]] !== o.params[s[l]]) return !1;
        if (!n.length) return r.test(o.path);
        var c = r.exec(o.path);
        if (c == null) return !1;
        for (var l = 0; l < n.length; l++) o.params[n[l].k] = n[l].r ? c[l + 1] : decodeURIComponent(c[l + 1]);
        return !0;
      };
    }, hn;
  }
  var fn, Js;
  function so() {
    if (Js) return fn;
    Js = 1;
    var e = Ci,
      t = new RegExp("^(?:key|oninit|oncreate|onbeforeupdate|onupdate|onbeforeremove|onremove)$");
    return fn = function (i, s) {
      var n = {};
      if (s != null) for (var r in i) e.call(i, r) && !t.test(r) && s.indexOf(r) < 0 && (n[r] = i[r]);else for (var r in i) e.call(i, r) && !t.test(r) && (n[r] = i[r]);
      return n;
    }, fn;
  }
  var un, Qs;
  function hh() {
    if (Qs) return un;
    Qs = 1;
    var e = Ge(),
      t = Zr,
      i = yi,
      s = rs(),
      n = os(),
      r = ch(),
      o = io(),
      l = so(),
      c = {};
    function a(u) {
      try {
        return decodeURIComponent(u);
      } catch {
        return u;
      }
    }
    return un = function (u, p) {
      var h = u == null ? null : typeof u.setImmediate == "function" ? u.setImmediate : u.setTimeout,
        m = i.resolve(),
        w = !1,
        v = !1,
        x = 0,
        D,
        k,
        S = c,
        O,
        U,
        L,
        q,
        P = {
          onbeforeupdate: function () {
            return x = x ? 2 : 1, !(!x || c === S);
          },
          onremove: function () {
            u.removeEventListener("popstate", _, !1), u.removeEventListener("hashchange", F, !1);
          },
          view: function () {
            if (!(!x || c === S)) {
              var z = [e(O, U.key, U)];
              return S && (z = S.render(z[0])), z;
            }
          }
        },
        W = V.SKIP = {};
      function F() {
        w = !1;
        var z = u.location.hash;
        V.prefix[0] !== "#" && (z = u.location.search + z, V.prefix[0] !== "?" && (z = u.location.pathname + z, z[0] !== "/" && (z = "/" + z)));
        var X = z.concat().replace(/(?:%[a-f89][a-f0-9])+/gim, a).slice(V.prefix.length),
          G = n(X);
        o(G.params, u.history.state);
        function te(K) {
          console.error(K), $(k, null, {
            replace: !0
          });
        }
        ie(0);
        function ie(K) {
          for (; K < D.length; K++) if (D[K].check(G)) {
            var ke = D[K].component,
              nt = D[K].route,
              Bi = ke,
              Ue = q = function (Ye) {
                if (Ue === q) {
                  if (Ye === W) return ie(K + 1);
                  O = Ye != null && (typeof Ye.view == "function" || typeof Ye == "function") ? Ye : "div", U = G.params, L = X, q = null, S = ke.render ? ke : null, x === 2 ? p.redraw() : (x = 2, p.redraw.sync());
                }
              };
            ke.view || typeof ke == "function" ? (ke = {}, Ue(Bi)) : ke.onmatch ? m.then(function () {
              return ke.onmatch(G.params, X, nt);
            }).then(Ue, X === k ? null : te) : Ue("div");
            return;
          }
          if (X === k) throw new Error("Could not resolve default route " + k + ".");
          $(k, null, {
            replace: !0
          });
        }
      }
      function _() {
        w || (w = !0, h(F));
      }
      function $(z, X, G) {
        if (z = s(z, X), v) {
          _();
          var te = G ? G.state : null,
            ie = G ? G.title : null;
          G && G.replace ? u.history.replaceState(te, ie, V.prefix + z) : u.history.pushState(te, ie, V.prefix + z);
        } else u.location.href = V.prefix + z;
      }
      function V(z, X, G) {
        if (!z) throw new TypeError("DOM element being rendered to does not exist.");
        if (D = Object.keys(G).map(function (ie) {
          if (ie[0] !== "/") throw new SyntaxError("Routes must start with a '/'.");
          if (/:([^\/\.-]+)(\.{3})?:/.test(ie)) throw new SyntaxError("Route parameter names must be separated with either '/', '.', or '-'.");
          return {
            route: ie,
            component: G[ie],
            check: r(ie)
          };
        }), k = X, X != null) {
          var te = n(X);
          if (!D.some(function (ie) {
            return ie.check(te);
          })) throw new ReferenceError("Default route doesn't match any known routes.");
        }
        typeof u.history.pushState == "function" ? u.addEventListener("popstate", _, !1) : V.prefix[0] === "#" && u.addEventListener("hashchange", F, !1), v = !0, p.mount(z, P), F();
      }
      return V.set = function (z, X, G) {
        q != null && (G = G || {}, G.replace = !0), q = null, $(z, X, G);
      }, V.get = function () {
        return L;
      }, V.prefix = "#!", V.Link = {
        view: function (z) {
          var X = t(z.attrs.selector || "a", l(z.attrs, ["options", "params", "selector", "onclick"]), z.children),
            G,
            te,
            ie;
          return (X.attrs.disabled = Boolean(X.attrs.disabled)) ? (X.attrs.href = null, X.attrs["aria-disabled"] = "true") : (G = z.attrs.options, te = z.attrs.onclick, ie = s(X.attrs.href, z.attrs.params), X.attrs.href = V.prefix + ie, X.attrs.onclick = function (K) {
            var ke;
            typeof te == "function" ? ke = te.call(K.currentTarget, K) : te == null || typeof te != "object" || typeof te.handleEvent == "function" && te.handleEvent(K), ke !== !1 && !K.defaultPrevented && (K.button === 0 || K.which === 0 || K.which === 1) && (!K.currentTarget.target || K.currentTarget.target === "_self") && !K.ctrlKey && !K.metaKey && !K.shiftKey && !K.altKey && (K.preventDefault(), K.redraw = !1, V.set(ie, null, G));
          }), X;
        }
      }, V.param = function (z) {
        return U && z != null ? U[z] : U;
      }, V;
    }, un;
  }
  var dn, Zs;
  function fh() {
    if (Zs) return dn;
    Zs = 1;
    var e = ss;
    return dn = hh()(typeof window < "u" ? window : null, e), dn;
  }
  var Ai = eh,
    ro = lh,
    oo = ss,
    pe = function () {
      return Ai.apply(this, arguments);
    };
  pe.m = Ai;
  pe.trust = Ai.trust;
  pe.fragment = Ai.fragment;
  pe.Fragment = "[";
  pe.mount = oo.mount;
  pe.route = fh();
  pe.render = eo();
  pe.redraw = oo.redraw;
  pe.request = ro.request;
  pe.jsonp = ro.jsonp;
  pe.parseQueryString = no();
  pe.buildQueryString = to();
  pe.parsePathname = os();
  pe.buildPathname = rs();
  pe.vnode = Ge();
  pe.PromisePolyfill = jr();
  pe.censor = so();
  var Ne = pe;
  function we(e, t, i, s, n) {
    this.debugLog = !1, this.baseUrl = e, this.lobbySize = i, this.devPort = t, this.lobbySpread = s, this.rawIPs = !!n, this.server = void 0, this.gameIndex = void 0, this.callback = void 0, this.errorCallback = void 0;
  }
  we.prototype.regionInfo = {
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
      longitude: -0.382486
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
  we.prototype.start = function (e, t, i, s) {
    if (this.callback = t, this.errorCallback = i, s) return t();
    const n = this.parseServerQuery(e);
    n && n.length > 0 ? (this.log("Found server in query."), this.password = n[3], this.connect(n[0], n[1], n[2])) : this.errorCallback("Unable to find server");
  };
  we.prototype.parseServerQuery = function (e) {
    const t = new URLSearchParams(location.search, !0),
      i = e || t.get("server");
    if (typeof i != "string") return [];
    const [s, n] = i.split(":");
    return [s, n, t.get("password")];
  };
  we.prototype.findServer = function (e, t) {
    var i = this.servers[e];
    for (let s = 0; s < i.length; s++) {
      const n = i[s];
      if (n.name === t) return n;
    }
    console.warn("Could not find server in region " + e + " with serverName " + t + ".");
  };
  we.prototype.seekServer = function (e, t, i) {
    i == null && (i = "random"), t == null && (t = !1);
    const s = ["random"],
      n = this.lobbySize,
      r = this.lobbySpread,
      o = this.servers[e].flatMap(function (h) {
        let m = 0;
        return h.games.map(function (w) {
          const v = m++;
          return {
            region: h.region,
            index: h.index * h.games.length + v,
            gameIndex: v,
            gameCount: h.games.length,
            playerCount: w.playerCount,
            playerCapacity: w.playerCapacity,
            isPrivate: w.isPrivate
          };
        });
      }).filter(function (h) {
        return !h.isPrivate;
      }).filter(function (h) {
        return t ? h.playerCount == 0 && h.gameIndex >= h.gameCount / 2 : !0;
      }).filter(function (h) {
        return i == "random" ? !0 : s[h.index % s.length].key == i;
      }).sort(function (h, m) {
        return m.playerCount - h.playerCount;
      }).filter(function (h) {
        return h.playerCount < n;
      });
    if (t && o.reverse(), o.length == 0) {
      this.errorCallback("No open servers.");
      return;
    }
    const l = Math.min(r, o.length);
    var u = Math.floor(Math.random() * l);
    u = Math.min(u, o.length - 1);
    const c = o[u],
      a = c.region;
    var u = Math.floor(c.index / c.gameCount);
    const p = c.index % c.gameCount;
    return this.log("Found server."), [a, u, p];
  };
  we.prototype.connect = function (e, t, i) {
    if (this.connected) return;
    const s = this.findServer(e, t);
    if (s == null) {
      this.errorCallback("Failed to find server for region " + e + " and serverName " + t);
      return;
    }
    if (this.log("Connecting to server", s, "with game index", i), s.playerCount >= s.playerCapacity) {
      this.errorCallback("Server is already full.");
      return;
    }
    window.history.replaceState(document.title, document.title, this.generateHref(e, t, this.password)), this.server = s, this.gameIndex = i, this.log("Calling callback with address", this.serverAddress(s), "on port", this.serverPort(s)), this.callback(this.serverAddress(s), this.serverPort(s), i), Lt && clearInterval(Lt);
  };
  we.prototype.switchServer = function (e, t) {
    this.switchingServers = !0, window.location = this.generateHref(e, t, null);
  };
  we.prototype.generateHref = function (e, t, i) {
    let s = window.location.href.split("?")[0];
    return s += "?server=" + e + ":" + t, i && (s += "&password=" + encodeURIComponent(i)), s;
  };
  we.prototype.serverAddress = function (e) {
    return e.region == 0 ? "localhost" : e.key + "." + e.region + "." + this.baseUrl;
  };
  we.prototype.serverPort = function (e) {
    return e.port;
  };
  let Lt;
  function uh(e) {
    e = e.filter(n => n.playerCount !== n.playerCapacity);
    const t = Math.min(...e.map(n => n.ping || 1 / 0)),
      i = e.filter(n => n.ping === t);
    return !i.length > 0 ? null : i.reduce((n, r) => n.playerCount > r.playerCount ? n : r);
  }
  we.prototype.processServers = function (e) {
    return Lt && clearInterval(Lt), new Promise(t => {
      const i = {},
        s = c => {
          const a = i[c],
            u = a[0];
          let p = this.serverAddress(u);
          const h = this.serverPort(u);
          h && (p += `:${h}`);
          const m = `https://${p}/ping`,
            w = new Date().getTime();
          return Promise.race([fetch(m).then(() => {
            const v = new Date().getTime() - w;
            a.forEach(x => {
              var _x$pings;
              x.pings = (_x$pings = x.pings) !== null && _x$pings !== void 0 ? _x$pings : [], x.pings.push(v), x.pings.length > 10 && x.pings.shift(), x.ping = Math.floor(x.pings.reduce((D, k) => D + k, 0) / x.pings.length);
            });
          }).catch(() => {}), new Promise(v => setTimeout(() => v(), 100))]);
        },
        n = async () => {
          await Promise.all(Object.keys(i).map(s)), window.blockRedraw || Ne.redraw();
        };
      e.forEach(c => {
        i[c.region] = i[c.region] || [], i[c.region].push(c);
      });
      for (const c in i) i[c] = i[c].sort(function (a, u) {
        return u.playerCount - a.playerCount;
      });
      this.servers = i;
      let r;
      const [o, l] = this.parseServerQuery();
      e.forEach(c => {
        o === c.region && l === c.name && (c.selected = !0, r = c);
      }), n().then(n).then(() => {
        if (r) return;
        let c = uh(e);
        c || (c = e[0]), c && (c.selected = !0, window.history.replaceState(document.title, document.title, this.generateHref(c.region, c.name, this.password))), window.blockRedraw || Ne.redraw();
      }).then(n).catch(c => {}).finally(t), Lt = setInterval(n, 5e3);
    });
  };
  we.prototype.ipToHex = function (e) {
    return e.split(".").map(i => ("00" + parseInt(i).toString(16)).substr(-2)).join("").toLowerCase();
  };
  we.prototype.hashIP = function (e) {
    return On(this.ipToHex(e));
  };
  we.prototype.log = function () {
    if (this.debugLog) return console.log.apply(void 0, arguments);
    if (console.verbose) return console.verbose.apply(void 0, arguments);
  };
  we.prototype.stripRegion = function (e) {
    return e.startsWith("vultr:") ? e = e.slice(6) : e.startsWith("do:") && (e = e.slice(3)), e;
  };
  const dh = function (e, t) {
      return e.concat(t);
    },
    ph = function (e, t) {
      return t.map(e).reduce(dh, []);
    };
  Array.prototype.flatMap = function (e) {
    return ph(e, this);
  };
  const fi = (e, t) => {
      const i = t.x - e.x,
        s = t.y - e.y;
      return Math.sqrt(i * i + s * s);
    },
    mh = (e, t) => {
      const i = t.x - e.x,
        s = t.y - e.y;
      return yh(Math.atan2(s, i));
    },
    gh = (e, t, i) => {
      const s = {
        x: 0,
        y: 0
      };
      return i = Bn(i), s.x = e.x - t * Math.cos(i), s.y = e.y - t * Math.sin(i), s;
    },
    Bn = e => e * (Math.PI / 180),
    yh = e => e * (180 / Math.PI),
    wh = e => isNaN(e.buttons) ? e.pressure !== 0 : e.buttons !== 0,
    pn = new Map(),
    js = e => {
      pn.has(e) && clearTimeout(pn.get(e)), pn.set(e, setTimeout(e, 100));
    },
    wi = (e, t, i) => {
      const s = t.split(/[ ,]+/g);
      let n;
      for (let r = 0; r < s.length; r += 1) n = s[r], e.addEventListener ? e.addEventListener(n, i, !1) : e.attachEvent && e.attachEvent(n, i);
    },
    er = (e, t, i) => {
      const s = t.split(/[ ,]+/g);
      let n;
      for (let r = 0; r < s.length; r += 1) n = s[r], e.removeEventListener ? e.removeEventListener(n, i) : e.detachEvent && e.detachEvent(n, i);
    },
    ao = e => (e.preventDefault(), e.type.match(/^touch/) ? e.changedTouches : e),
    tr = () => {
      const e = window.pageXOffset !== void 0 ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft,
        t = window.pageYOffset !== void 0 ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
      return {
        x: e,
        y: t
      };
    },
    ir = (e, t) => {
      t.top || t.right || t.bottom || t.left ? (e.style.top = t.top, e.style.right = t.right, e.style.bottom = t.bottom, e.style.left = t.left) : (e.style.left = t.x + "px", e.style.top = t.y + "px");
    },
    as = (e, t, i) => {
      const s = lo(e);
      for (let n in s) if (s.hasOwnProperty(n)) if (typeof t == "string") s[n] = t + " " + i;else {
        let r = "";
        for (let o = 0, l = t.length; o < l; o += 1) r += t[o] + " " + i + ", ";
        s[n] = r.slice(0, -2);
      }
      return s;
    },
    kh = (e, t) => {
      const i = lo(e);
      for (let s in i) i.hasOwnProperty(s) && (i[s] = t);
      return i;
    },
    lo = e => {
      const t = {};
      return t[e] = "", ["webkit", "Moz", "o"].forEach(function (s) {
        t[s + e.charAt(0).toUpperCase() + e.slice(1)] = "";
      }), t;
    },
    mn = (e, t) => {
      for (let i in t) t.hasOwnProperty(i) && (e[i] = t[i]);
      return e;
    },
    vh = (e, t) => {
      const i = {};
      for (let s in e) e.hasOwnProperty(s) && t.hasOwnProperty(s) ? i[s] = t[s] : e.hasOwnProperty(s) && (i[s] = e[s]);
      return i;
    },
    zn = (e, t) => {
      if (e.length) for (let i = 0, s = e.length; i < s; i += 1) t(e[i]);else t(e);
    },
    xh = (e, t, i) => ({
      x: Math.min(Math.max(e.x, t.x - i), t.x + i),
      y: Math.min(Math.max(e.y, t.y - i), t.y + i)
    });
  var bh = ("ontouchstart" in window),
    Sh = !!window.PointerEvent,
    Th = !!window.MSPointerEvent,
    Bt = {
      touch: {
        start: "touchstart",
        move: "touchmove",
        end: "touchend, touchcancel"
      },
      mouse: {
        start: "mousedown",
        move: "mousemove",
        end: "mouseup"
      },
      pointer: {
        start: "pointerdown",
        move: "pointermove",
        end: "pointerup, pointercancel"
      },
      MSPointer: {
        start: "MSPointerDown",
        move: "MSPointerMove",
        end: "MSPointerUp"
      }
    },
    vt,
    Kt = {};
  Sh ? vt = Bt.pointer : Th ? vt = Bt.MSPointer : bh ? (vt = Bt.touch, Kt = Bt.mouse) : vt = Bt.mouse;
  function Ve() {}
  Ve.prototype.on = function (e, t) {
    var i = this,
      s = e.split(/[ ,]+/g),
      n;
    i._handlers_ = i._handlers_ || {};
    for (var r = 0; r < s.length; r += 1) n = s[r], i._handlers_[n] = i._handlers_[n] || [], i._handlers_[n].push(t);
    return i;
  };
  Ve.prototype.off = function (e, t) {
    var i = this;
    return i._handlers_ = i._handlers_ || {}, e === void 0 ? i._handlers_ = {} : t === void 0 ? i._handlers_[e] = null : i._handlers_[e] && i._handlers_[e].indexOf(t) >= 0 && i._handlers_[e].splice(i._handlers_[e].indexOf(t), 1), i;
  };
  Ve.prototype.trigger = function (e, t) {
    var i = this,
      s = e.split(/[ ,]+/g),
      n;
    i._handlers_ = i._handlers_ || {};
    for (var r = 0; r < s.length; r += 1) n = s[r], i._handlers_[n] && i._handlers_[n].length && i._handlers_[n].forEach(function (o) {
      o.call(i, {
        type: n,
        target: i
      }, t);
    });
  };
  Ve.prototype.config = function (e) {
    var t = this;
    t.options = t.defaults || {}, e && (t.options = vh(t.options, e));
  };
  Ve.prototype.bindEvt = function (e, t) {
    var i = this;
    return i._domHandlers_ = i._domHandlers_ || {}, i._domHandlers_[t] = function () {
      typeof i["on" + t] == "function" ? i["on" + t].apply(i, arguments) : console.warn('[WARNING] : Missing "on' + t + '" handler.');
    }, wi(e, vt[t], i._domHandlers_[t]), Kt[t] && wi(e, Kt[t], i._domHandlers_[t]), i;
  };
  Ve.prototype.unbindEvt = function (e, t) {
    var i = this;
    return i._domHandlers_ = i._domHandlers_ || {}, er(e, vt[t], i._domHandlers_[t]), Kt[t] && er(e, Kt[t], i._domHandlers_[t]), delete i._domHandlers_[t], this;
  };
  function he(e, t) {
    return this.identifier = t.identifier, this.position = t.position, this.frontPosition = t.frontPosition, this.collection = e, this.defaults = {
      size: 100,
      threshold: 0.1,
      color: "white",
      fadeTime: 250,
      dataOnly: !1,
      restJoystick: !0,
      restOpacity: 0.5,
      mode: "dynamic",
      zone: document.body,
      lockX: !1,
      lockY: !1,
      shape: "circle"
    }, this.config(t), this.options.mode === "dynamic" && (this.options.restOpacity = 0), this.id = he.id, he.id += 1, this.buildEl().stylize(), this.instance = {
      el: this.ui.el,
      on: this.on.bind(this),
      off: this.off.bind(this),
      show: this.show.bind(this),
      hide: this.hide.bind(this),
      add: this.addToDom.bind(this),
      remove: this.removeFromDom.bind(this),
      destroy: this.destroy.bind(this),
      setPosition: this.setPosition.bind(this),
      resetDirection: this.resetDirection.bind(this),
      computeDirection: this.computeDirection.bind(this),
      trigger: this.trigger.bind(this),
      position: this.position,
      frontPosition: this.frontPosition,
      ui: this.ui,
      identifier: this.identifier,
      id: this.id,
      options: this.options
    }, this.instance;
  }
  he.prototype = new Ve();
  he.constructor = he;
  he.id = 0;
  he.prototype.buildEl = function (e) {
    return this.ui = {}, this.options.dataOnly ? this : (this.ui.el = document.createElement("div"), this.ui.back = document.createElement("div"), this.ui.front = document.createElement("div"), this.ui.el.className = "nipple collection_" + this.collection.id, this.ui.back.className = "back", this.ui.front.className = "front", this.ui.el.setAttribute("id", "nipple_" + this.collection.id + "_" + this.id), this.ui.el.appendChild(this.ui.back), this.ui.el.appendChild(this.ui.front), this);
  };
  he.prototype.stylize = function () {
    if (this.options.dataOnly) return this;
    var e = this.options.fadeTime + "ms",
      t = kh("borderRadius", "50%"),
      i = as("transition", "opacity", e),
      s = {};
    return s.el = {
      position: "absolute",
      opacity: this.options.restOpacity,
      display: "block",
      zIndex: 999
    }, s.back = {
      position: "absolute",
      display: "block",
      width: this.options.size + "px",
      height: this.options.size + "px",
      marginLeft: -this.options.size / 2 + "px",
      marginTop: -this.options.size / 2 + "px",
      background: this.options.color,
      opacity: ".5"
    }, s.front = {
      width: this.options.size / 2 + "px",
      height: this.options.size / 2 + "px",
      position: "absolute",
      display: "block",
      marginLeft: -this.options.size / 4 + "px",
      marginTop: -this.options.size / 4 + "px",
      background: this.options.color,
      opacity: ".5",
      transform: "translate(0px, 0px)"
    }, mn(s.el, i), this.options.shape === "circle" && mn(s.back, t), mn(s.front, t), this.applyStyles(s), this;
  };
  he.prototype.applyStyles = function (e) {
    for (var t in this.ui) if (this.ui.hasOwnProperty(t)) for (var i in e[t]) this.ui[t].style[i] = e[t][i];
    return this;
  };
  he.prototype.addToDom = function () {
    return this.options.dataOnly || document.body.contains(this.ui.el) ? this : (this.options.zone.appendChild(this.ui.el), this);
  };
  he.prototype.removeFromDom = function () {
    return this.options.dataOnly || !document.body.contains(this.ui.el) ? this : (this.options.zone.removeChild(this.ui.el), this);
  };
  he.prototype.destroy = function () {
    clearTimeout(this.removeTimeout), clearTimeout(this.showTimeout), clearTimeout(this.restTimeout), this.trigger("destroyed", this.instance), this.removeFromDom(), this.off();
  };
  he.prototype.show = function (e) {
    var t = this;
    return t.options.dataOnly || (clearTimeout(t.removeTimeout), clearTimeout(t.showTimeout), clearTimeout(t.restTimeout), t.addToDom(), t.restCallback(), setTimeout(function () {
      t.ui.el.style.opacity = 1;
    }, 0), t.showTimeout = setTimeout(function () {
      t.trigger("shown", t.instance), typeof e == "function" && e.call(this);
    }, t.options.fadeTime)), t;
  };
  he.prototype.hide = function (e) {
    var t = this;
    if (t.options.dataOnly) return t;
    if (t.ui.el.style.opacity = t.options.restOpacity, clearTimeout(t.removeTimeout), clearTimeout(t.showTimeout), clearTimeout(t.restTimeout), t.removeTimeout = setTimeout(function () {
      var i = t.options.mode === "dynamic" ? "none" : "block";
      t.ui.el.style.display = i, typeof e == "function" && e.call(t), t.trigger("hidden", t.instance);
    }, t.options.fadeTime), t.options.restJoystick) {
      const i = t.options.restJoystick,
        s = {};
      s.x = i === !0 || i.x !== !1 ? 0 : t.instance.frontPosition.x, s.y = i === !0 || i.y !== !1 ? 0 : t.instance.frontPosition.y, t.setPosition(e, s);
    }
    return t;
  };
  he.prototype.setPosition = function (e, t) {
    var i = this;
    i.frontPosition = {
      x: t.x,
      y: t.y
    };
    var s = i.options.fadeTime + "ms",
      n = {};
    n.front = as("transition", ["transform"], s);
    var r = {
      front: {}
    };
    r.front = {
      transform: "translate(" + i.frontPosition.x + "px," + i.frontPosition.y + "px)"
    }, i.applyStyles(n), i.applyStyles(r), i.restTimeout = setTimeout(function () {
      typeof e == "function" && e.call(i), i.restCallback();
    }, i.options.fadeTime);
  };
  he.prototype.restCallback = function () {
    var e = this,
      t = {};
    t.front = as("transition", "none", ""), e.applyStyles(t), e.trigger("rested", e.instance);
  };
  he.prototype.resetDirection = function () {
    this.direction = {
      x: !1,
      y: !1,
      angle: !1
    };
  };
  he.prototype.computeDirection = function (e) {
    var t = e.angle.radian,
      i = Math.PI / 4,
      s = Math.PI / 2,
      n,
      r,
      o;
    if (t > i && t < i * 3 && !e.lockX ? n = "up" : t > -i && t <= i && !e.lockY ? n = "left" : t > -i * 3 && t <= -i && !e.lockX ? n = "down" : e.lockY || (n = "right"), e.lockY || (t > -s && t < s ? r = "left" : r = "right"), e.lockX || (t > 0 ? o = "up" : o = "down"), e.force > this.options.threshold) {
      var l = {},
        c;
      for (c in this.direction) this.direction.hasOwnProperty(c) && (l[c] = this.direction[c]);
      var a = {};
      this.direction = {
        x: r,
        y: o,
        angle: n
      }, e.direction = this.direction;
      for (c in l) l[c] === this.direction[c] && (a[c] = !0);
      if (a.x && a.y && a.angle) return e;
      (!a.x || !a.y) && this.trigger("plain", e), a.x || this.trigger("plain:" + r, e), a.y || this.trigger("plain:" + o, e), a.angle || this.trigger("dir dir:" + n, e);
    } else this.resetDirection();
    return e;
  };
  function ae(e, t) {
    var i = this;
    i.nipples = [], i.idles = [], i.actives = [], i.ids = [], i.pressureIntervals = {}, i.manager = e, i.id = ae.id, ae.id += 1, i.defaults = {
      zone: document.body,
      multitouch: !1,
      maxNumberOfNipples: 10,
      mode: "dynamic",
      position: {
        top: 0,
        left: 0
      },
      catchDistance: 200,
      size: 100,
      threshold: 0.1,
      color: "white",
      fadeTime: 250,
      dataOnly: !1,
      restJoystick: !0,
      restOpacity: 0.5,
      lockX: !1,
      lockY: !1,
      shape: "circle",
      dynamicPage: !1,
      follow: !1
    }, i.config(t), (i.options.mode === "static" || i.options.mode === "semi") && (i.options.multitouch = !1), i.options.multitouch || (i.options.maxNumberOfNipples = 1);
    const s = getComputedStyle(i.options.zone.parentElement);
    return s && s.display === "flex" && (i.parentIsFlex = !0), i.updateBox(), i.prepareNipples(), i.bindings(), i.begin(), i.nipples;
  }
  ae.prototype = new Ve();
  ae.constructor = ae;
  ae.id = 0;
  ae.prototype.prepareNipples = function () {
    var e = this,
      t = e.nipples;
    t.on = e.on.bind(e), t.off = e.off.bind(e), t.options = e.options, t.destroy = e.destroy.bind(e), t.ids = e.ids, t.id = e.id, t.processOnMove = e.processOnMove.bind(e), t.processOnEnd = e.processOnEnd.bind(e), t.get = function (i) {
      if (i === void 0) return t[0];
      for (var s = 0, n = t.length; s < n; s += 1) if (t[s].identifier === i) return t[s];
      return !1;
    };
  };
  ae.prototype.bindings = function () {
    var e = this;
    e.bindEvt(e.options.zone, "start"), e.options.zone.style.touchAction = "none", e.options.zone.style.msTouchAction = "none";
  };
  ae.prototype.begin = function () {
    var e = this,
      t = e.options;
    if (t.mode === "static") {
      var i = e.createNipple(t.position, e.manager.getIdentifier());
      i.add(), e.idles.push(i);
    }
  };
  ae.prototype.createNipple = function (e, t) {
    var i = this,
      s = i.manager.scroll,
      n = {},
      r = i.options,
      o = {
        x: i.parentIsFlex ? s.x : s.x + i.box.left,
        y: i.parentIsFlex ? s.y : s.y + i.box.top
      };
    if (e.x && e.y) n = {
      x: e.x - o.x,
      y: e.y - o.y
    };else if (e.top || e.right || e.bottom || e.left) {
      var l = document.createElement("DIV");
      l.style.display = "hidden", l.style.top = e.top, l.style.right = e.right, l.style.bottom = e.bottom, l.style.left = e.left, l.style.position = "absolute", r.zone.appendChild(l);
      var c = l.getBoundingClientRect();
      r.zone.removeChild(l), n = e, e = {
        x: c.left + s.x,
        y: c.top + s.y
      };
    }
    var a = new he(i, {
      color: r.color,
      size: r.size,
      threshold: r.threshold,
      fadeTime: r.fadeTime,
      dataOnly: r.dataOnly,
      restJoystick: r.restJoystick,
      restOpacity: r.restOpacity,
      mode: r.mode,
      identifier: t,
      position: e,
      zone: r.zone,
      frontPosition: {
        x: 0,
        y: 0
      },
      shape: r.shape
    });
    return r.dataOnly || (ir(a.ui.el, n), ir(a.ui.front, a.frontPosition)), i.nipples.push(a), i.trigger("added " + a.identifier + ":added", a), i.manager.trigger("added " + a.identifier + ":added", a), i.bindNipple(a), a;
  };
  ae.prototype.updateBox = function () {
    var e = this;
    e.box = e.options.zone.getBoundingClientRect();
  };
  ae.prototype.bindNipple = function (e) {
    var t = this,
      i,
      s = function (n, r) {
        i = n.type + " " + r.id + ":" + n.type, t.trigger(i, r);
      };
    e.on("destroyed", t.onDestroyed.bind(t)), e.on("shown hidden rested dir plain", s), e.on("dir:up dir:right dir:down dir:left", s), e.on("plain:up plain:right plain:down plain:left", s);
  };
  ae.prototype.pressureFn = function (e, t, i) {
    var s = this,
      n = 0;
    clearInterval(s.pressureIntervals[i]), s.pressureIntervals[i] = setInterval(function () {
      var r = e.force || e.pressure || e.webkitForce || 0;
      r !== n && (t.trigger("pressure", r), s.trigger("pressure " + t.identifier + ":pressure", r), n = r);
    }.bind(s), 100);
  };
  ae.prototype.onstart = function (e) {
    var t = this,
      i = t.options,
      s = e;
    e = ao(e), t.updateBox();
    var n = function (r) {
      t.actives.length < i.maxNumberOfNipples ? t.processOnStart(r) : s.type.match(/^touch/) && (Object.keys(t.manager.ids).forEach(function (o) {
        if (Object.values(s.touches).findIndex(function (c) {
          return c.identifier === o;
        }) < 0) {
          var l = [e[0]];
          l.identifier = o, t.processOnEnd(l);
        }
      }), t.actives.length < i.maxNumberOfNipples && t.processOnStart(r));
    };
    return zn(e, n), t.manager.bindDocument(), !1;
  };
  ae.prototype.processOnStart = function (e) {
    var t = this,
      i = t.options,
      s,
      n = t.manager.getIdentifier(e),
      r = e.force || e.pressure || e.webkitForce || 0,
      o = {
        x: e.pageX,
        y: e.pageY
      },
      l = t.getOrCreate(n, o);
    l.identifier !== n && t.manager.removeIdentifier(l.identifier), l.identifier = n;
    var c = function (u) {
      u.trigger("start", u), t.trigger("start " + u.id + ":start", u), u.show(), r > 0 && t.pressureFn(e, u, u.identifier), t.processOnMove(e);
    };
    if ((s = t.idles.indexOf(l)) >= 0 && t.idles.splice(s, 1), t.actives.push(l), t.ids.push(l.identifier), i.mode !== "semi") c(l);else {
      var a = fi(o, l.position);
      if (a <= i.catchDistance) c(l);else {
        l.destroy(), t.processOnStart(e);
        return;
      }
    }
    return l;
  };
  ae.prototype.getOrCreate = function (e, t) {
    var i = this,
      s = i.options,
      n;
    return /(semi|static)/.test(s.mode) ? (n = i.idles[0], n ? (i.idles.splice(0, 1), n) : s.mode === "semi" ? i.createNipple(t, e) : (console.warn("Coudln't find the needed nipple."), !1)) : (n = i.createNipple(t, e), n);
  };
  ae.prototype.processOnMove = function (e) {
    var t = this,
      i = t.options,
      s = t.manager.getIdentifier(e),
      n = t.nipples.get(s),
      r = t.manager.scroll;
    if (!wh(e)) {
      this.processOnEnd(e);
      return;
    }
    if (!n) {
      console.error("Found zombie joystick with ID " + s), t.manager.removeIdentifier(s);
      return;
    }
    if (i.dynamicPage) {
      var o = n.el.getBoundingClientRect();
      n.position = {
        x: r.x + o.left,
        y: r.y + o.top
      };
    }
    n.identifier = s;
    var l = n.options.size / 2,
      c = {
        x: e.pageX,
        y: e.pageY
      };
    i.lockX && (c.y = n.position.y), i.lockY && (c.x = n.position.x);
    var a = fi(c, n.position),
      u = mh(c, n.position),
      p = Bn(u),
      h = a / l,
      m = {
        distance: a,
        position: c
      },
      w,
      v;
    if (n.options.shape === "circle" ? (w = Math.min(a, l), v = gh(n.position, w, u)) : (v = xh(c, n.position, l), w = fi(v, n.position)), i.follow) {
      if (a > l) {
        let S = c.x - v.x,
          O = c.y - v.y;
        n.position.x += S, n.position.y += O, n.el.style.top = n.position.y - (t.box.top + r.y) + "px", n.el.style.left = n.position.x - (t.box.left + r.x) + "px", a = fi(c, n.position);
      }
    } else c = v, a = w;
    var x = c.x - n.position.x,
      D = c.y - n.position.y;
    n.frontPosition = {
      x,
      y: D
    }, i.dataOnly || (n.ui.front.style.transform = "translate(" + x + "px," + D + "px)");
    var k = {
      identifier: n.identifier,
      position: c,
      force: h,
      pressure: e.force || e.pressure || e.webkitForce || 0,
      distance: a,
      angle: {
        radian: p,
        degree: u
      },
      vector: {
        x: x / l,
        y: -D / l
      },
      raw: m,
      instance: n,
      lockX: i.lockX,
      lockY: i.lockY
    };
    k = n.computeDirection(k), k.angle = {
      radian: Bn(180 - u),
      degree: 180 - u
    }, n.trigger("move", k), t.trigger("move " + n.id + ":move", k);
  };
  ae.prototype.processOnEnd = function (e) {
    var t = this,
      i = t.options,
      s = t.manager.getIdentifier(e),
      n = t.nipples.get(s),
      r = t.manager.removeIdentifier(n.identifier);
    n && (i.dataOnly || n.hide(function () {
      i.mode === "dynamic" && (n.trigger("removed", n), t.trigger("removed " + n.id + ":removed", n), t.manager.trigger("removed " + n.id + ":removed", n), n.destroy());
    }), clearInterval(t.pressureIntervals[n.identifier]), n.resetDirection(), n.trigger("end", n), t.trigger("end " + n.id + ":end", n), t.ids.indexOf(n.identifier) >= 0 && t.ids.splice(t.ids.indexOf(n.identifier), 1), t.actives.indexOf(n) >= 0 && t.actives.splice(t.actives.indexOf(n), 1), /(semi|static)/.test(i.mode) ? t.idles.push(n) : t.nipples.indexOf(n) >= 0 && t.nipples.splice(t.nipples.indexOf(n), 1), t.manager.unbindDocument(), /(semi|static)/.test(i.mode) && (t.manager.ids[r.id] = r.identifier));
  };
  ae.prototype.onDestroyed = function (e, t) {
    var i = this;
    i.nipples.indexOf(t) >= 0 && i.nipples.splice(i.nipples.indexOf(t), 1), i.actives.indexOf(t) >= 0 && i.actives.splice(i.actives.indexOf(t), 1), i.idles.indexOf(t) >= 0 && i.idles.splice(i.idles.indexOf(t), 1), i.ids.indexOf(t.identifier) >= 0 && i.ids.splice(i.ids.indexOf(t.identifier), 1), i.manager.removeIdentifier(t.identifier), i.manager.unbindDocument();
  };
  ae.prototype.destroy = function () {
    var e = this;
    e.unbindEvt(e.options.zone, "start"), e.nipples.forEach(function (i) {
      i.destroy();
    });
    for (var t in e.pressureIntervals) e.pressureIntervals.hasOwnProperty(t) && clearInterval(e.pressureIntervals[t]);
    e.trigger("destroyed", e.nipples), e.manager.unbindDocument(), e.off();
  };
  function de(e) {
    var t = this;
    t.ids = {}, t.index = 0, t.collections = [], t.scroll = tr(), t.config(e), t.prepareCollections();
    var i = function () {
      var n;
      t.collections.forEach(function (r) {
        r.forEach(function (o) {
          n = o.el.getBoundingClientRect(), o.position = {
            x: t.scroll.x + n.left,
            y: t.scroll.y + n.top
          };
        });
      });
    };
    wi(window, "resize", function () {
      js(i);
    });
    var s = function () {
      t.scroll = tr();
    };
    return wi(window, "scroll", function () {
      js(s);
    }), t.collections;
  }
  de.prototype = new Ve();
  de.constructor = de;
  de.prototype.prepareCollections = function () {
    var e = this;
    e.collections.create = e.create.bind(e), e.collections.on = e.on.bind(e), e.collections.off = e.off.bind(e), e.collections.destroy = e.destroy.bind(e), e.collections.get = function (t) {
      var i;
      return e.collections.every(function (s) {
        return i = s.get(t), !i;
      }), i;
    };
  };
  de.prototype.create = function (e) {
    return this.createCollection(e);
  };
  de.prototype.createCollection = function (e) {
    var t = this,
      i = new ae(t, e);
    return t.bindCollection(i), t.collections.push(i), i;
  };
  de.prototype.bindCollection = function (e) {
    var t = this,
      i,
      s = function (n, r) {
        i = n.type + " " + r.id + ":" + n.type, t.trigger(i, r);
      };
    e.on("destroyed", t.onDestroyed.bind(t)), e.on("shown hidden rested dir plain", s), e.on("dir:up dir:right dir:down dir:left", s), e.on("plain:up plain:right plain:down plain:left", s);
  };
  de.prototype.bindDocument = function () {
    var e = this;
    e.binded || (e.bindEvt(document, "move").bindEvt(document, "end"), e.binded = !0);
  };
  de.prototype.unbindDocument = function (e) {
    var t = this;
    (!Object.keys(t.ids).length || e === !0) && (t.unbindEvt(document, "move").unbindEvt(document, "end"), t.binded = !1);
  };
  de.prototype.getIdentifier = function (e) {
    var t;
    return e ? (t = e.identifier === void 0 ? e.pointerId : e.identifier, t === void 0 && (t = this.latest || 0)) : t = this.index, this.ids[t] === void 0 && (this.ids[t] = this.index, this.index += 1), this.latest = t, this.ids[t];
  };
  de.prototype.removeIdentifier = function (e) {
    var t = {};
    for (var i in this.ids) if (this.ids[i] === e) {
      t.id = i, t.identifier = this.ids[i], delete this.ids[i];
      break;
    }
    return t;
  };
  de.prototype.onmove = function (e) {
    var t = this;
    return t.onAny("move", e), !1;
  };
  de.prototype.onend = function (e) {
    var t = this;
    return t.onAny("end", e), !1;
  };
  de.prototype.oncancel = function (e) {
    var t = this;
    return t.onAny("end", e), !1;
  };
  de.prototype.onAny = function (e, t) {
    var i = this,
      s,
      n = "processOn" + e.charAt(0).toUpperCase() + e.slice(1);
    t = ao(t);
    var r = function (l, c, a) {
        a.ids.indexOf(c) >= 0 && (a[n](l), l._found_ = !0);
      },
      o = function (l) {
        s = i.getIdentifier(l), zn(i.collections, r.bind(null, l, s)), l._found_ || i.removeIdentifier(s);
      };
    return zn(t, o), !1;
  };
  de.prototype.destroy = function () {
    var e = this;
    e.unbindDocument(!0), e.ids = {}, e.index = 0, e.collections.forEach(function (t) {
      t.destroy();
    }), e.off();
  };
  de.prototype.onDestroyed = function (e, t) {
    var i = this;
    if (i.collections.indexOf(t) < 0) return !1;
    i.collections.splice(i.collections.indexOf(t), 1);
  };
  const nr = new de(),
    sr = {
      create: function (e) {
        return nr.create(e);
      },
      factory: nr
    };
  let rr = !1;
  const Ih = e => {
      if (rr) return;
      rr = !0;
      const t = document.getElementById("touch-controls-left"),
        i = sr.create({
          zone: t
        });
      i.on("start", e.onStartMoving), i.on("end", e.onStopMoving), i.on("move", e.onRotateMoving);
      const s = document.getElementById("touch-controls-right"),
        n = sr.create({
          zone: s
        });
      n.on("start", e.onStartAttacking), n.on("end", e.onStopAttacking), n.on("move", e.onRotateAttacking), t.style.display = "block", s.style.display = "block";
    },
    Mh = {
      enable: Ih
    };
  window.loadedScript = !0;
  const Eh = location.hostname !== "localhost" && location.hostname !== "127.0.0.1" && !location.hostname.startsWith("192.168."),
    co = location.hostname === "sandbox-dev.moomoo.io" || location.hostname === "sandbox.moomoo.io",
    Ph = location.hostname === "dev.moomoo.io" || location.hostname === "dev2.moomoo.io",
    Hn = new uc();
  let ui, di;
  const ki = location.hostname === "localhost" || location.hostname === "127.0.0.1",
    Ch = !1,
    ls = ki || Ch;
  co ? (ui = "https://api-sandbox.moomoo.io", di = "moomoo.io") : Ph ? (ui = "https://api-dev.moomoo.io", di = "moomoo.io") : (ui = "https://api.moomoo.io", di = "moomoo.io");
  const Ah = !ls,
    qe = new we(di, 443, T.maxPlayers, 5, Ah);
  qe.debugLog = !1;
  const Me = {
    animationTime: 0,
    land: null,
    lava: null,
    x: T.volcanoLocationX,
    y: T.volcanoLocationY
  };
  function Dh() {
    let e = !1;
    return function (t) {
      (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4))) && (e = !0);
    }(navigator.userAgent || navigator.vendor || window.opera), e;
  }
  const ho = Dh();
  let vi = !1,
    Fn = !1;
  function Oh() {
    !ps || Fn || (Fn = !0, Eh || ls ? window.turnstileToken ? gn(window.turnstileToken) : window.grecaptcha.ready(() => {
      window.grecaptcha.execute("6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP", {
        action: "homepage"
      }).then(function (e) {
        gn("re:" + e);
      }).catch(console.error);
    }) : gn());
  }
  let Vn = !1;
  function gn(e) {
    qe.start(bi, function (t, i, s) {
      let r = "wss://" + t;
      if (e) {
        r += "?token=" + encodeURIComponent(e);
      }
      if (ki) {
        r = "wss://localhost:3000";
      }
      ee.connect(r, function (o) {
        setInterval(() => {
          minPacket = Math.max(0, minPacket - minMax / 2);
        }, minTime);
        setInterval(() => {
          secPacket = Math.max(0, secPacket - secMax / 2);
        }, secTime);
        if (Vn) {
          Vn = false;
          return;
        }
        Vo();
        if (o) {
          bn(o);
        } else {
          vi = true;
          bs();
        } // SOMETHING:
        setInterval(() => {
          maxPing = window.pingTime;
          minPing = window.pingTime;
        }, 12500);
      }, {
        A: qh,
        B: bn,
        C: If,
        D: Qf,
        E: Zf,
        a: updatePlayers,
        G: Df,
        H: qf,
        I: Kf,
        J: $f,
        K: gatherAnimation,
        L: Wf,
        M: Xf,
        N: eu,
        O: updateHealth,
        P: Ef,
        Q: Cf,
        R: Pf,
        S: jf,
        T: Ro,
        U: Oo,
        V: To,
        X: Gf,
        Y: Yf,
        Z: ru,
        g: Zh,
        1: tf,
        2: Qh,
        3: jh,
        4: ef,
        5: ff,
        6: gf,
        7: af,
        8: Mf,
        9: rf,
        0: su
      });
    }, function (t) {
      console.error("Vultr error:", t);
      alert(`Error:
` + t);
      bn("disconnected");
    }, ki);
  }
  function cs() {
    return ee.connected;
  }
  function Rh() {
    const t = prompt("party key", bi);
    t && (window.onbeforeunload = void 0, window.location.href = "/?server=" + t);
  }
  const _h = new dc(T),
    fo = Math.PI,
    Ze = fo * 2;
  Math.lerpAngle = function (e, t, i) {
    Math.abs(t - e) > fo && (e > t ? t += Ze : e += Ze);
    const n = t + (e - t) * i;
    return n >= 0 && n <= Ze ? n : n % Ze;
  };
  CanvasRenderingContext2D.prototype.roundRect = function (e, t, i, s, n) {
    return i < 2 * n && (n = i / 2), s < 2 * n && (n = s / 2), n < 0 && (n = 0), this.beginPath(), this.moveTo(e + n, t), this.arcTo(e + i, t, e + i, t + s, n), this.arcTo(e + i, t + s, e, t + s, n), this.arcTo(e, t + s, e, t, n), this.arcTo(e, t, e + i, t, n), this.closePath(), this;
  };
  let hs;
  typeof Storage < "u" && (hs = !0);
  function Di(e, t) {
    hs && localStorage.setItem(e, t);
  }
  function Nt(e) {
    return hs ? localStorage.getItem(e) : null;
  }
  let xi = Nt("moofoll");
  function Bh() {
    xi || (xi = !0, Di("moofoll", 1));
  }
  let uo,
    $e,
    mt = 1,
    be,
    It,
    yn,
    or = Date.now();
  var He;
  let Ee;
  const ye = [],
    J = [];
  let Oe = [];
  const et = [],
    Mt = [],
    po = new gc(Hc, Mt, J, ye, ue, R, T, C),
    ar = new yc(ye, wc, J, R, null, T, C);
  let E,
    mo,
    y,
    ct = 1,
    wn = 0,
    go = 0,
    yo = 0,
    Re,
    _e,
    lr,
    fs = 0;
  const maxScreenWidth = T.maxScreenWidth,
    maxScreenHeight = T.maxScreenHeight;
  let gt,
    yt,
    Jt = !1;
  document.getElementById("ad-container");
  const Oi = document.getElementById("mainMenu"),
    Un = document.getElementById("enterGame"),
    kn = document.getElementById("promoImg");
  document.getElementById("partyButton");
  const vn = document.getElementById("joinPartyButton"),
    Ln = document.getElementById("settingsButton"),
    cr = Ln.getElementsByTagName("span")[0],
    hr = document.getElementById("allianceButton"),
    fr = document.getElementById("storeButton"),
    ur = document.getElementById("chatButton"),
    xt = document.getElementById("gameCanvas"),
    M = xt.getContext("2d");
  var zh = document.getElementById("serverBrowser");
  const Nn = document.getElementById("nativeResolution"),
    xn = document.getElementById("showPing");
  document.getElementById("playMusic");
  const pingDisplay = document.getElementById("pingDisplay"),
    dr = document.getElementById("shutdownDisplay"),
    Zt = document.getElementById("menuCardHolder"),
    qt = document.getElementById("guideCard"),
    Et = document.getElementById("loadingText"),
    us = document.getElementById("gameUI"),
    pr = document.getElementById("actionBar"),
    Hh = document.getElementById("scoreDisplay"),
    Fh = document.getElementById("foodDisplay"),
    Vh = document.getElementById("woodDisplay"),
    Uh = document.getElementById("stoneDisplay"),
    Lh = document.getElementById("killCounter"),
    mr = document.getElementById("leaderboardData"),
    jt = document.getElementById("nameInput"),
    Le = document.getElementById("itemInfoHolder"),
    gr = document.getElementById("ageText"),
    yr = document.getElementById("ageBarBody"),
    ht = document.getElementById("upgradeHolder"),
    ri = document.getElementById("upgradeCounter"),
    Te = document.getElementById("allianceMenu"),
    oi = document.getElementById("allianceHolder"),
    ai = document.getElementById("allianceManager"),
    me = document.getElementById("mapDisplay"),
    Wt = document.getElementById("diedText"),
    Nh = document.getElementById("skinColorHolder"),
    ce = me.getContext("2d");
  me.width = 300;
  me.height = 300;
  const We = document.getElementById("storeMenu"),
    wr = document.getElementById("storeHolder"),
    ft = document.getElementById("noticationDisplay"),
    Xt = $r.hats,
    Gt = $r.accessories;
  var ue = new mc(kc, et, C, T);
  const ei = "#525252",
    kr = "#3d3f42",
    Xe = 5.5;
  T.DAY_INTERVAL / 24;
  T.DAY_INTERVAL / 2;
  document.body.insertAdjacentHTML("beforeend", `<style>
    .hidden {
        display: none !important;
    }

    .header-icon {
        width: 30px;
        user-select: none;
    }
    </style>`);
  function qh(e) {
    Oe = e.teams;
  }
  let ds = !0;
  var ps = !1;
  (!ls || ki) && (ps = !0);
  window.onblur = function () {
    ds = !1;
  };
  window.onfocus = function () {
    ds = !0, E && E.alive && xs();
  };
  window.onload = function () {
    window.follmoo();
    ps = true;
    Oh();
    setTimeout(() => {
      Fn || (alert("Captcha failed to load"), window.location.reload());
    }, 2e4);
    const removeCookie = setInterval(() => {
      const cookie = document.getElementById("onetrust-consent-sdk");
      if (!(cookie !== null && cookie !== void 0 && cookie.style)) return;
      if (cookie.style.display === "none") return clearInterval(removeCookie);
      cookie.style.display = "none";
    });
  };
  window.captchaCallback = function () {
    ht = !0;
    Oh();
  };
  window.captchaCallbackHook = function () {
    ps = !0;
  };
  window.captchaCallbackComplete && window.captchaCallbackHook();
  window.addEventListener("keydown", function (e) {
    e.keyCode == 32 && e.target == document.body && e.preventDefault();
  });
  xt.oncontextmenu = function () {
    return !1;
  };
  ["touch-controls-left", "touch-controls-right", "touch-controls-fullscreen", "storeMenu"].forEach(e => {
    document.getElementById(e) && (document.getElementById(e).oncontextmenu = function (t) {
      t.preventDefault();
    });
  });
  function bn(e) {
    vi = !1, ee.close(), ms(e);
  }
  function ms(e, t) {
    Oi.style.display = "block", us.style.display = "none", Zt.style.display = "none", Wt.style.display = "none", Et.style.display = "block", Et.innerHTML = e + (t ? "<a href='javascript:window.location.href=window.location.href' class='ytLink'>reload</a>" : "");
  }
  function Wh() {
    pingDisplay.hidden = !0, Et.style.display = "none", Oi.style.display = "block", Zt.style.display = "block", uf(), Xh(), Af(), Et.style.display = "none", Zt.style.display = "block";
    let e = Nt("moo_name") || "";
    !e.length && FRVR.profile && (e = FRVR.profile.name(), e && (e += Math.floor(Math.random() * 90) + 9)), jt.value = e || "";
  }
  function Xh() {
    Un.onclick = C.checkTrusted(function () {
      ms("Connecting..."), cs() ? bs() : Oh();
    }), C.hookTouchEvents(Un), kn && (kn.onclick = C.checkTrusted(function () {
      Lo("https://krunker.io/?play=SquidGame_KB");
    }), C.hookTouchEvents(kn)), vn && (vn.onclick = C.checkTrusted(function () {
      setTimeout(function () {
        Rh();
      }, 10);
    }), C.hookTouchEvents(vn)), Ln.onclick = C.checkTrusted(function () {
      pf();
    }), C.hookTouchEvents(Ln), hr.onclick = C.checkTrusted(function () {
      nf();
    }), C.hookTouchEvents(hr), fr.onclick = C.checkTrusted(function () {
      hf();
    }), C.hookTouchEvents(fr), ur.onclick = C.checkTrusted(function () {
      Mo();
    }), C.hookTouchEvents(ur), me.onclick = C.checkTrusted(function () {
      Ao();
    }), C.hookTouchEvents(me);
  }
  let bi;
  const Gh = {
    view: () => {
      if (!qe.servers) return;
      let e = 0;
      const t = Object.keys(qe.servers).map(i => {
        const s = qe.regionInfo[i].name;
        let n = 0;
        const r = qe.servers[i].map(o => {
          var h;
          n += o.playerCount;
          const l = o.selected;
          let c = s + " " + o.name + " [" + Math.min(o.playerCount, o.playerCapacity) + "/" + o.playerCapacity + "]";
          const a = o.name,
            u = l ? "selected" : "";
          o.ping && ((h = o.pings) == null ? void 0 : h.length) >= 2 ? c += ` [${Math.floor(o.ping)}ms]` : l || (c += " [?]");
          let p = {
            value: i + ":" + a
          };
          return u && (bi = i + ":" + a, p.selected = !0), Ne("option", p, c);
        });
        return e += n, [Ne("option[disabled]", `${s} - ${n} players`), r, Ne("option[disabled]")];
      });
      return Ne("select", {
        value: bi,
        onfocus: () => {
          window.blockRedraw = !0;
        },
        onblur: () => {
          window.blockRedraw = !1;
        },
        onchange: Kh
      }, [t, Ne("option[disabled]", `All Servers - ${e} players`)]);
    }
  };
  Ne.mount(zh, Gh);
  var qn, Wn;
  location.hostname == "sandbox.moomoo.io" ? (qn = "Back to MooMoo", Wn = "//moomoo.io/") : (qn = "Try the sandbox", Wn = "//sandbox.moomoo.io/");
  document.getElementById("altServer").innerHTML = "<a href='" + Wn + "'>" + qn + "<i class='material-icons' style='font-size:10px;vertical-align:middle'>arrow_forward_ios</i></a>";
  const Yh = `${ui}/servers?v=1.22`,
    wo = async () => fetch(Yh).then(e => e.json()).then(async e => qe.processServers(e)).catch(e => {
      console.error("Failed to load server data with status code:", e);
    }),
    $h = () => wo().then(Wh).catch(e => {
      console.error("Failed to load.");
    });
  window.frvrSdkInitPromise.then(() => window.FRVR.bootstrapper.complete()).then(() => $h());
  const Kh = e => {
    if (window.blockRedraw = !1, FRVR.channelCharacteristics.allowNavigation) {
      const [t, i] = e.target.value.split(":");
      qe.switchServer(t, i);
    } else vi && (vi = !1, Fn = !1, Vn = !0, Ei = !0, ee.close());
  };
  document.getElementById("pre-content-container");
  function Jh() {
    FRVR.ads.show("interstitial", bs);
  }
  window.adsbygoogle && adsbygoogle.push({
    preloadAdBreaks: "on"
  }), window.showPreAd = Jh;
  function Se(e, t, i) {
    if (E && e) {
      if (C.removeAllChildren(Le), Le.classList.add("visible"), C.generateElement({
        id: "itemInfoName",
        text: C.capitalizeFirst(e.name),
        parent: Le
      }), C.generateElement({
        id: "itemInfoDesc",
        text: e.desc,
        parent: Le
      }), !i) if (t) C.generateElement({
        class: "itemInfoReq",
        text: e.type ? "secondary" : "primary",
        parent: Le
      });else {
        for (let n = 0; n < e.req.length; n += 2) C.generateElement({
          class: "itemInfoReq",
          html: e.req[n] + "<span class='itemInfoReqVal'> x" + e.req[n + 1] + "</span>",
          parent: Le
        });
        const s = co ? e.group.sandboxLimit || Math.max(e.group.limit * 3, 99) : e.group.limit;
        e.group.limit && C.generateElement({
          class: "itemInfoLmt",
          text: (E.itemCounts[e.group.id] || 0) + "/" + s,
          parent: Le
        });
      }
    } else Le.classList.remove("visible");
  }
  let Pt = [],
    wt = [];
  function Qh(e, t) {
    Pt.push({
      sid: e,
      name: t
    }), gs();
  }
  function gs() {
    if (Pt[0]) {
      const e = Pt[0];
      C.removeAllChildren(ft), ft.style.display = "block", C.generateElement({
        class: "notificationText",
        text: e.name,
        parent: ft
      }), C.generateElement({
        class: "notifButton",
        html: "<i class='material-icons' style='font-size:28px;color:#cc5151;'>&#xE14C;</i>",
        parent: ft,
        onclick: function () {
          Gn(0);
        },
        hookTouch: !0
      }), C.generateElement({
        class: "notifButton",
        html: "<i class='material-icons' style='font-size:28px;color:#8ecc51;'>&#xE876;</i>",
        parent: ft,
        onclick: function () {
          Gn(1);
        },
        hookTouch: !0
      });
    } else ft.style.display = "none";
  }
  function Zh(e) {
    Oe.push(e), Te.style.display == "block" && ti();
  }
  function jh(e, t) {
    E && (E.team = e, E.isOwner = t, Te.style.display == "block" && ti());
  }
  function ef(e) {
    wt = e, Te.style.display == "block" && ti();
  }
  function tf(e) {
    for (let t = Oe.length - 1; t >= 0; t--) Oe[t].sid == e && Oe.splice(t, 1);
    Te.style.display == "block" && ti();
  }
  function nf() {
    xs(), Te.style.display != "block" ? ti() : Xn();
  }
  function Xn() {
    Te.style.display == "block" && (Te.style.display = "none");
  }
  function ti() {
    if (E && E.alive) {
      if (Ri(), We.style.display = "none", Te.style.display = "block", C.removeAllChildren(oi), E.team) for (var e = 0; e < wt.length; e += 2) (function (t) {
        const i = C.generateElement({
          class: "allianceItem",
          style: "color:" + (wt[t] == E.sid ? "#fff" : "rgba(255,255,255,0.6)"),
          text: wt[t + 1],
          parent: oi
        });
        E.isOwner && wt[t] != E.sid && C.generateElement({
          class: "joinAlBtn",
          text: "Kick",
          onclick: function () {
            ko(wt[t]);
          },
          hookTouch: !0,
          parent: i
        });
      })(e);else if (Oe.length) for (var e = 0; e < Oe.length; ++e) (function (i) {
        const s = C.generateElement({
          class: "allianceItem",
          style: "color:" + (Oe[i].sid == E.team ? "#fff" : "rgba(255,255,255,0.6)"),
          text: Oe[i].sid,
          parent: oi
        });
        C.generateElement({
          class: "joinAlBtn",
          text: "Join",
          onclick: function () {
            vo(i);
          },
          hookTouch: !0,
          parent: s
        });
      })(e);else C.generateElement({
        class: "allianceItem",
        text: "No Tribes Yet",
        parent: oi
      });
      C.removeAllChildren(ai), E.team ? C.generateElement({
        class: "allianceButtonM",
        style: "width: 360px",
        text: E.isOwner ? "Delete Tribe" : "Leave Tribe",
        onclick: function () {
          xo();
        },
        hookTouch: !0,
        parent: ai
      }) : (C.generateElement({
        tag: "input",
        type: "text",
        id: "allianceInput",
        maxLength: 7,
        placeholder: "unique name",
        onchange: t => {
          t.target.value = (t.target.value || "").slice(0, 7);
        },
        onkeypress: t => {
          if (t.key === "Enter") return t.preventDefault(), Yn(), !1;
        },
        parent: ai
      }), C.generateElement({
        tag: "div",
        class: "allianceButtonM",
        style: "width: 140px;",
        text: "Create",
        onclick: function () {
          Yn();
        },
        hookTouch: !0,
        parent: ai
      }));
    }
  }
  function Gn(e) {
    ee.send("P", Pt[0].sid, e), Pt.splice(0, 1), gs();
  }
  function ko(e) {
    ee.send("Q", e);
  }
  function vo(e) {
    ee.send("b", Oe[e].sid);
  }
  function Yn() {
    ee.send("L", document.getElementById("allianceInput").value);
  }
  function xo() {
    Pt = [], gs(), ee.send("N");
  }
  window.socket = ee;
  let pi, Ht, je;
  const bt = [];
  let Je;
  function sf() {
    this.init = function (e, t) {
      this.scale = 0, this.x = e, this.y = t, this.active = !0;
    }, this.update = function (e, t) {
      this.active && (this.scale += 0.05 * t, this.scale >= T.mapPingScale ? this.active = !1 : (e.globalAlpha = 1 - Math.max(0, this.scale / T.mapPingScale), e.beginPath(), e.arc(this.x / T.mapScale * me.width, this.y / T.mapScale * me.width, this.scale, 0, 2 * Math.PI), e.stroke()));
    };
  }
  function rf(e, t) {
    for (let i = 0; i < bt.length; ++i) if (!bt[i].active) {
      Je = bt[i];
      break;
    }
    Je || (Je = new sf(), bt.push(Je)), Je.init(e, t);
  }
  function of() {
    je || (je = {}), je.x = E.x, je.y = E.y;
  }
  function af(e) {
    Ht = e;
  } // RENDER MINIMAP:
  function lf(e) {
    if (E && E.alive) {
      ce.clearRect(0, 0, me.width, me.height); // RENDER PINGS:
      ce.strokeStyle = "#fff";
      ce.lineWidth = 4;
      for (var t = 0; t < bt.length; ++t) {
        Je = bt[t];
        Je.update(ce, e);
      } // RENDER PLAYERS:
      ce.globalAlpha = 1;
      ce.fillStyle = "#fff";
      Q(E.x / T.mapScale * me.width, E.y / T.mapScale * me.height, 7, ce, true);
      ce.fillStyle = "rgba(255,255,255,0.35)";
      if (E.team && Ht) {
        for (var t = 0; t < Ht.length;) {
          Q(Ht[t] / T.mapScale * me.width, Ht[t + 1] / T.mapScale * me.height, 7, ce, true);
          t += 2;
        }
      } // DEATH LOCATION:
      if (pi) {
        ce.fillStyle = "#fc5553";
        ce.font = "34px Hammersmith One";
        ce.textBaseline = "middle";
        ce.textAlign = "center";
        ce.fillText("x", pi.x / T.mapScale * me.width, pi.y / T.mapScale * me.height);
      } // MAP MARKER:
      if (je) {
        ce.fillStyle = "#fff";
        ce.font = "34px Hammersmith One";
        ce.textBaseline = "middle";
        ce.textAlign = "center";
        ce.fillText("x", je.x / T.mapScale * me.width, je.y / T.mapScale * me.height);
      }
    }
  }
  let $n = 0;
  function cf(e) {
    $n != e && ($n = e, ys());
  }
  function hf() {
    We.style.display != "block" ? (We.style.display = "block", Te.style.display = "none", Ri(), ys()) : Kn();
  }
  function Kn() {
    We.style.display == "block" && (We.style.display = "none", Se());
  }
  function ff(e, t, i) {
    i ? e ? E.tailIndex = t : E.tails[t] = 1 : e ? E.skinIndex = t : E.skins[t] = 1, We.style.display == "block" && ys();
  }
  function ys() {
    if (E) {
      C.removeAllChildren(wr);
      const e = $n,
        t = e ? Gt : Xt;
      for (let i = 0; i < t.length; ++i) t[i].dontSell || function (s) {
        const n = C.generateElement({
          id: "storeDisplay" + s,
          class: "storeItem",
          onmouseout: function () {
            Se();
          },
          onmouseover: function () {
            Se(t[s], !1, !0);
          },
          parent: wr
        });
        C.hookTouchEvents(n, !0), C.generateElement({
          tag: "img",
          class: "hatPreview",
          src: "./img/" + (e ? "accessories/access_" : "hats/hat_") + t[s].id + (t[s].topSprite ? "_p" : "") + ".png",
          parent: n
        }), C.generateElement({
          tag: "span",
          text: t[s].name,
          parent: n
        }), (e ? !E.tails[t[s].id] : !E.skins[t[s].id]) ? (C.generateElement({
          class: "joinAlBtn",
          style: "margin-top: 5px",
          text: "Buy",
          onclick: function () {
            bo(t[s].id, e);
          },
          hookTouch: !0,
          parent: n
        }), C.generateElement({
          tag: "span",
          class: "itemPrice",
          text: t[s].price,
          parent: n
        })) : (e ? E.tailIndex : E.skinIndex) == t[s].id ? C.generateElement({
          class: "joinAlBtn",
          style: "margin-top: 5px",
          text: "Unequip",
          onclick: function () {
            Jn(0, e);
          },
          hookTouch: !0,
          parent: n
        }) : C.generateElement({
          class: "joinAlBtn",
          style: "margin-top: 5px",
          text: "Equip",
          onclick: function () {
            Jn(t[s].id, e);
          },
          hookTouch: !0,
          parent: n
        });
      }(i);
    }
  }
  function Jn(e, t) {
    ee.send("c", 0, e, t);
  }
  function bo(e, t) {
    ee.send("c", 1, e, t);
  }
  var shopList = [[11, false], [15, true], [6, true], [7, true], [22, true], [40, true], [53, true], [31, true], [12, true], [11, true], [26, true], [21, false], [20, true], [18, false], [13, false]];
  var autobuy = setInterval(() => {
    if (!getEl("autobuy").checked) {
      return;
    }
    if (shopList[0][1] == true) {
      Xt.filter(e => e.id == shopList[0][0]).forEach(t => {
        if (E && E.points >= t.price) {
          bo(t.id, 0);
          shopList.shift();
        }
      });
    } else if (shopList[0][1] == false) {
      Gt.filter(e => e.id == shopList[0][0]).forEach(t => {
        if (E && E.points >= t.price) {
          bo(t.id, 1);
          shopList.shift();
        }
      });
    }
    if (shopList.length == 0 || !shopList.length) {
      clearInterval(autobuy);
      getEl("autobuy").checked = false;
      getEl("autobuy").disabled = true;
    }
  }, 500);
  function buyEquip(id, index, isHat) {
    // BUY AND EQUIP:
    if (E.alive) {
      if (index == 0) {
        if (E.skins[id]) {
          if (E.skinIndex != id) {
            ee.send("c", 0, id, 0);
          }
        } else {
          if (E.skinIndex != 0) {
            ee.send("c", 0, 0, 0);
          }
          if (T.isSandbox) {
            let findId = Xt.find(thisID => thisID.id == id);
            if (findId) {
              if (E.points >= findId.price) {
                ee.send("c", 1, id, 0);
              }
            }
          }
        }
      } else if (index == 1) {
        if (E.tails[id]) {
          if (E.tailIndex != id) {
            ee.send("c", 0, id, 1);
          }
        } else {
          if (E.tailIndex != 0) {
            ee.send("c", 0, 0, 1);
          }
          if (T.isSandbox) {
            let findId = Gt.find(thisID => thisID.id == id);
            if (findId) {
              if (E.points >= findId.price) {
                ee.send("c", 1, id, 1);
              }
            }
          }
        }
      }
    }
  } // EQUIP HATS:
  function biomeGear() {
    if (turretInRange.length) {
      buyEquip(22, 0);
    } else {
      if (isMoveDir == undefined && getEl("visualtype").value == "2") {
        buyEquip(22, 0);
      } else {
        if (E.y2 >= T.mapScale / 2 - T.riverWidth / 2 && E.y2 <= T.mapScale / 2 + T.riverWidth / 2) {
          buyEquip(31, 0);
        } else {
          if (E.y2 <= T.snowBiomeTop) {
            buyEquip(15, 0);
          } else {
            buyEquip(12, 0);
          }
        }
      }
    }
  }
  function safeWeapon1() {
    return nearDist.primaryIndex == 0 || nearDist.primaryIndex == 6 || nearDist.primaryIndex == 7 || nearDist.primaryIndex == 8;
  }
  function safeWeapon2() {
    return nearDist.secondaryIndex == 9 || nearDist.secondaryIndex == 10 || nearDist.secondaryIndex == 11 || nearDist.secondaryIndex == 14;
  }
  function changeHat(value) {
    if (value == "normal") {
      if (anti0Tick > 0) {
        buyEquip(6, 0);
      } else {
        if ((E.shameCount > 0 && (ticks.tick - E.bTick) % T.serverUpdateRate === 0 || reSyncBull) && E.skinIndex != 45) {
          buyEquip(7, 0);
        } else {
          if (autoBullSpam && E.pR == 0) {
            buyEquip(7, 0);
          } else {
            if (getEl("visualtype").value == "2") {
              if (turretInRange.length || doEmpAntiInsta) {
                buyEquip(22, 0);
              } else {
                if (E.y2 >= T.mapScale / 2 - T.riverWidth / 2 && E.y2 <= T.mapScale / 2 + T.riverWidth / 2) {
                  buyEquip(31, 0);
                } else {
                  if (enemyCount.length) {
                    if (tmpObjDist(nearDist, E) <= R.weapons[nearDist.primaryIndex ? nearDist.primaryIndex : 5].range + E.scale * 3) {
                      if (configs.antiBull > 0 && E.weapons[0] != 7) {
                        buyEquip(11, 0);
                      } else {
                        buyEquip(6, 0);
                      }
                    } else {
                      biomeGear();
                    }
                  } else {
                    biomeGear();
                  }
                }
              }
            } else if (biomeG && getEl("visualtype").value != "2") {
              biomeGear();
            } else {
              if (turretInRange.length || doEmpAntiInsta) {
                buyEquip(22, 0);
              } else buyEquip(6, 0);
            }
          }
        }
      }
    } else if (value == "click") {
      if (anti0Tick > 0) {
        buyEquip(6, 0);
      } else {
        if ((E.shameCount > 0 && (ticks.tick - E.bTick) % T.serverUpdateRate === 0 || reSyncBull) && E.skinIndex != 45) {
          buyEquip(7, 0);
        } else {
          if (clicks.left && E.pR == 0) {
            buyEquip(7, 0);
          } else if (clicks.right && (E.weapons[1] == 10 ? E.sR : E.pR) == 0) {
            buyEquip(40, 0);
          } else {
            if (getEl("visualtype").value != "2") {
              if (turretInRange.length || doEmpAntiInsta) {
                buyEquip(22, 0);
              } else buyEquip(6, 0);
            } else {
              if (turretInRange.length || doEmpAntiInsta) {
                buyEquip(22, 0);
              } else {
                if (E.y2 >= T.mapScale / 2 - T.riverWidth / 2 && E.y2 <= T.mapScale / 2 + T.riverWidth / 2) {
                  buyEquip(31, 0);
                } else {
                  if (clicks.left && configs.antiBull > 0 && E.weapons[0] != 7) {
                    buyEquip(11, 0);
                  } else {
                    buyEquip(6, 0);
                  }
                }
              }
            }
          }
        }
      }
    } else if (value == "trap") {
      if (anti0Tick > 0 || (E.weapons[1] == 10 ? E.sR : E.pR) != 0) {
        buyEquip(6, 0);
      } else {
        buyEquip(40, 0);
      }
    }
  }
  function changeAcc(value) {
    if (value == "normal") {
      if (tmpObjDist(nearDist, E) <= R.weapons[E.primaryIndex ? E.primaryIndex : 5].range + E.scale * 6 && enemyCount.length || autoBullSpam && E.pR == 0 || insta || boostOneTick || doBoostTick) {
        buyEquip(0, 1);
      } else {
        buyEquip(11, 1);
      }
    } else if (value == "click") {
      if (clicks.left) {
        buyEquip(0, 1);
      } else if (clicks.right) {
        buyEquip(11, 1);
      }
    } else if (value == "trap") {
      buyEquip(getEl("visualtype").value == "2" ? 0 : 21, 1);
    }
  }
  function So() {
    We.style.display = "none", Te.style.display = "none", Ri();
  }
  function uf() {
    const e = Nt("native_resolution");
    Sn(e ? e == "true" : typeof cordova < "u"), $e = Nt("show_ping") == "true", pingDisplay.hidden = getEl("visualtype").value != "1" ? !$e || !Jt : true, Nt("moo_moosic"), setInterval(function () {
      window.cordova && (document.getElementById("downloadButtonContainer").classList.add("cordova"), document.getElementById("mobileDownloadButtonContainer").classList.add("cordova"));
    }, 1e3), Io(), C.removeAllChildren(pr);
    for (var t = 0; t < R.weapons.length + R.list.length; ++t) (function (i) {
      C.generateElement({
        id: "actionBarItem" + i,
        class: "actionBarItem",
        style: "display:none",
        onmouseout: function () {
          Se();
        },
        parent: pr
      });
    })(t);
    for (var t = 0; t < R.list.length + R.weapons.length; ++t) (function (s) {
      const n = document.createElement("canvas");
      n.width = n.height = 66;
      const r = n.getContext("2d");
      if (r.translate(n.width / 2, n.height / 2), r.imageSmoothingEnabled = !1, r.webkitImageSmoothingEnabled = !1, r.mozImageSmoothingEnabled = !1, R.weapons[s]) {
        r.rotate(Math.PI / 4 + Math.PI);
        var o = new Image();
        jn[R.weapons[s].src] = o, o.onload = function () {
          this.isLoaded = !0;
          const c = 1 / (this.height / this.width),
            a = R.weapons[s].iPad || 1;
          r.drawImage(this, -(n.width * a * T.iconPad * c) / 2, -(n.height * a * T.iconPad) / 2, n.width * a * c * T.iconPad, n.height * a * T.iconPad), r.fillStyle = "rgba(0, 0, 70, 0.1)", r.globalCompositeOperation = "source-atop", r.fillRect(-n.width / 2, -n.height / 2, n.width, n.height), document.getElementById("actionBarItem" + s).style.backgroundImage = "url(" + n.toDataURL() + ")";
        }, o.src = "./img/weapons/" + R.weapons[s].src + ".png";
        var l = document.getElementById("actionBarItem" + s);
        l.onmouseover = C.checkTrusted(function () {
          Se(R.weapons[s], !0);
        }), l.onclick = C.checkTrusted(function () {
          Yt(s, !0);
        }), C.hookTouchEvents(l);
      } else {
        var o = Ss(R.list[s - R.weapons.length], !0);
        const a = Math.min(n.width - T.iconPadding, o.width);
        r.globalAlpha = 1, r.drawImage(o, -a / 2, -a / 2, a, a), r.fillStyle = "rgba(0, 0, 70, 0.1)", r.globalCompositeOperation = "source-atop", r.fillRect(-a / 2, -a / 2, a, a), document.getElementById("actionBarItem" + s).style.backgroundImage = "url(" + n.toDataURL() + ")";
        var l = document.getElementById("actionBarItem" + s);
        l.onmouseover = C.checkTrusted(function () {
          Se(R.list[s - R.weapons.length]);
        }), l.onclick = C.checkTrusted(function () {
          Yt(s - R.weapons.length);
        }), C.hookTouchEvents(l);
      }
    })(t);
    jt.onchange = i => {
      i.target.value = (i.target.value || "").slice(0, 15);
    }, jt.onkeypress = i => {
      if (i.key === "Enter") return i.preventDefault(), Un.onclick(i), !1;
    }, Nn.checked = uo, Nn.onchange = C.checkTrusted(function (i) {
      Sn(i.target.checked);
    }), xn.checked = $e, xn.onchange = C.checkTrusted(function (i) {
      $e = xn.checked, pingDisplay.hidden = !$e, Di("show_ping", $e ? "true" : "false");
    });
  }
  function To(e, t) {
    e && (t ? E.weapons = e : E.items = e);
    for (var i = 0; i < R.list.length; ++i) {
      const s = R.weapons.length + i;
      document.getElementById("actionBarItem" + s).style.display = E.firstItems.indexOf(R.list[i].id) >= 0 ? "inline-block" : "none";
    }
    for (var i = 0; i < R.weapons.length; ++i) document.getElementById("actionBarItem" + i).style.display = E.weapons[R.weapons[i].type] == R.weapons[i].id ? "inline-block" : "none";
  }
  function Sn(e) {
    uo = e, mt = e ? window.devicePixelRatio || 1 : window.devicePixelRatio2, Nn.checked = e, Di("native_resolution", e.toString()), ws();
  }
  function df() {
    ii ? qt.classList.add("touch") : qt.classList.remove("touch");
  }
  function pf() {
    qt.classList.contains("showing") ? (qt.classList.remove("showing"), cr.innerText = "Settings") : (qt.classList.add("showing"), cr.innerText = "Close");
  }
  function Io() {
    let e = "";
    for (let t = 0; t < T.skinColors.length; ++t) t == fs ? e += "<div class='skinColorItem activeSkin' style='background-color:" + T.skinColors[t] + "' onclick='selectSkinColor(" + t + ")'></div>" : e += "<div class='skinColorItem' style='background-color:" + T.skinColors[t] + "' onclick='selectSkinColor(" + t + ")'></div>";
    Nh.innerHTML = e;
  }
  function mf(e) {
    fs = e, Io();
  }
  const Ft = document.getElementById("chatBox"),
    Si = document.getElementById("chatHolder");
  function Mo() {
    if (ii) {
      setTimeout(function () {
        const e = prompt("chat message");
        if (e) {
          vr(e);
        }
      }, 1);
    } else if (Si.style.display == "block") {
      if (Ft.value) {
        vr(Ft.value);
      }
      Ri();
    } else {
      We.style.display = "none";
      Te.style.display = "none";
      Si.style.display = "block";
      Si.style.opacity = 0;
      Ft.autocomplete = "off";
      Ft.focus();
      xs();
    }
    Ft.value = "";
  }
  function vr(e) {
    if (e == "!!autospin") {
      autospin = !autospin;
    } else {
      ee.send("6", e.slice(0, 30));
    }
  }
  let Nobody = [{
    say: "Children used to run and play",
    time: 15725
  }, {
    say: "Look at all this mess we made",
    time: 18600
  }, {
    say: "Guess i never know",
    time: 21500
  }, {
    say: "It went wrong",
    time: 23000
  }, {
    say: "Sometimes i feel like all",
    time: 27500
  }, {
    say: "That's said",
    time: 28500
  }, {
    say: "Goes viral then people forget",
    time: 30500
  }, {
    say: "In this crazy world",
    time: 33500
  }, {
    say: "I don't belong",
    time: 34800
  }, {
    say: "I see fire burning",
    time: 39000
  }, {
    say: "But i close my eyes",
    time: 41000
  }, {
    say: "(I'd rather deny that)",
    time: 43300
  }, {
    say: "Everything is falling",
    time: 45000
  }, {
    say: "Out of place",
    time: 46700
  }, {
    say: "I see trees ripped",
    time: 50000
  }, {
    say: "From the ground but",
    time: 52200
  }, {
    say: "Nobody makes a sound",
    time: 54050
  }, {
    say: "I see fire burning",
    time: 57000
  }, {
    say: "But i'm fine",
    time: 59000
  }, {
    say: "Now i am nobody",
    time: 61000
  }, {
    say: "Now i am nobody",
    time: 73000
  }, {
    say: "The future feels so unsure",
    time: 99500
  }, {
    say: "Didin't we deserve more",
    time: 102600
  }, {
    say: "The burden that you left",
    time: 105500
  }, {
    say: "Is too heavy for me",
    time: 106900
  }, {
    say: "Do you ever feel like",
    time: 111300
  }, {
    say: "The world will die out",
    time: 113000
  }, {
    say: "My anxiety's off",
    time: 114400
  }, {
    say: "The roof i cry out",
    time: 115800
  }, {
    say: "We have gone too far",
    time: 117400
  }, {
    say: "Take me back right now",
    time: 118800
  }, {
    say: "I see fire burning",
    time: 123000
  }, {
    say: "But i close my eyes",
    time: 125000
  }, {
    say: "(I'd rather deny that)",
    time: 127300
  }, {
    say: "Everything is falling",
    time: 129000
  }, {
    say: "Out of place",
    time: 131000
  }, {
    say: "I see trees ripped",
    time: 134000
  }, {
    say: "From the ground but",
    time: 135500
  }, {
    say: "Nobody makes a sound",
    time: 138000
  }, {
    say: "I see fire burning",
    time: 141000
  }, {
    say: "But i'm fine",
    time: 143000
  }, {
    say: "Now i am nobody",
    time: 145000
  }, {
    say: "Now i am nobody",
    time: 169000,
    end: true
  }];
  let Ae86 = [{
    say: "I'm burning",
    time: 39800
  }, {
    say: "Wanna fell your power",
    time: 41300
  }, {
    say: "Right into my veins",
    time: 43000
  }, {
    say: "Come, racer",
    time: 46300
  }, {
    say: "Cross the fire",
    time: 47800
  }, {
    say: "Pushing on the gas",
    time: 49000
  }, {
    say: "So come on",
    time: 52600
  }, {
    say: "So come on,",
    time: 53900
  }, {
    say: "The drift is on my mind!",
    time: 55700
  }, {
    say: "AE eighity Speedy 86",
    time: 58600
  }, {
    say: "Every road is on fire!",
    time: 62000
  }, {
    say: "'Cause i can't stop driving",
    time: 64000
  }, {
    say: "With my 86",
    time: 66700
  }, {
    say: "Anybody will be around me",
    time: 68200
  }, {
    say: "AE eighity Speedy 86",
    time: 71200
  }, {
    say: "See my speed is getting higher",
    time: 74900
  }, {
    say: "'Cause i can't stop driving",
    time: 77000
  }, {
    say: "Go go 86",
    time: 79400
  }, {
    say: "Anybody will be around me",
    time: 81000
  }, {
    say: "Your body",
    time: 97300
  }, {
    say: "Burning like a flame",
    time: 98800
  }, {
    say: "Engine will be fly",
    time: 100300
  }, {
    say: "My racer",
    time: 103750
  }, {
    say: "Can you hear me?",
    time: 105300
  }, {
    say: "Listen to me now!",
    time: 106750
  }, {
    say: "So come on",
    time: 110000
  }, {
    say: "So come on,",
    time: 111700
  }, {
    say: "The drift is on my mind!",
    time: 113000
  }, {
    say: "AE eighity Speedy 86",
    time: 116000
  }, {
    say: "Every road is fire!",
    time: 119750
  }, {
    say: "'Cause i can't stop driving",
    time: 121750
  }, {
    say: "With my 86",
    time: 124150
  }, {
    say: "Anybody will be around me",
    time: 126000
  }, {
    say: "AE eighity Speedy 86",
    time: 129000
  }, {
    say: "See my speed is getting higher",
    time: 132250
  }, {
    say: "'Cause i can't stop driving",
    time: 134750
  }, {
    say: "Go go 86",
    time: 137000
  }, {
    say: "Anybody will be around me",
    time: 138750
  }, {
    say: "So come on",
    time: 219000
  }, {
    say: "So come on,",
    time: 220500
  }, {
    say: "The drift is on my mind!",
    time: 222000
  }, {
    say: "AE eighity go go 86",
    time: 225000
  }, {
    say: "Every road is fire!",
    time: 228500
  }, {
    say: "'Cause i can't stop driving",
    time: 230750
  }, {
    say: "With my 86",
    time: 233000
  }, {
    say: "Anybody will be around me",
    time: 234750
  }, {
    say: "AE eighity Speedy 86",
    time: 237750
  }, {
    say: "See my speed is getting higher",
    time: 241200
  }, {
    say: "'Cause i can't stop driving",
    time: 243500
  }, {
    say: "Go go 86",
    time: 245900
  }, {
    say: "Anybody will be around me",
    time: 247500,
    end: true
  }];
  let DontStandSoClose = [{
    say: "Oh oh ooooh",
    time: 2500
  }, {
    say: "Oh we begin",
    time: 4750
  }, {
    say: "We'll be together",
    time: 15500
  }, {
    say: "till the morning light",
    time: 16750
  }, {
    say: "Don't stand so",
    time: 18750
  }, {
    say: "don't stand so",
    time: 20500
  }, {
    say: "Don't stand so close to me",
    time: 22000
  }, {
    say: "Baby you belong to me",
    time: 37000
  }, {
    say: "Yes you do, yes you do",
    time: 40000
  }, {
    say: "You're my affection",
    time: 41750
  }, {
    say: "I can make a woman cry",
    time: 43000
  }, {
    say: "Yes I do, yes I do",
    time: 46250
  }, {
    say: "I well be good",
    time: 47750
  }, {
    say: "You're like a cruel device",
    time: 49750
  }, {
    say: "Your blood is cold like ice",
    time: 51000
  }, {
    say: "Poison for my veins,",
    time: 52500
  }, {
    say: "I'm breaking my chains",
    time: 54000
  }, {
    say: "One look and you can kill",
    time: 55750
  }, {
    say: "my pain now is your thrill",
    time: 57250
  }, {
    say: "Your love is for me",
    time: 58750
  }, {
    say: "I say",
    time: 61000
  }, {
    say: "Try me",
    time: 61750
  }, {
    say: "take a chance on emotions",
    time: 62750
  }, {
    say: "For now and ever",
    time: 64750
  }, {
    say: "close to your heart",
    time: 66000
  }, {
    say: "I say",
    time: 67000
  }, {
    say: "Try me",
    time: 67750
  }, {
    say: "take a chance on my passion",
    time: 68750
  }, {
    say: "We'll be together all the time",
    time: 71000
  }, {
    say: "I say",
    time: 73250
  }, {
    say: "Try me",
    time: 74000
  }, {
    say: "take a chance on emotions",
    time: 75000
  }, {
    say: "For now and ever",
    time: 77000
  }, {
    say: "into my heart",
    time: 78500
  }, {
    say: "I say",
    time: 79250
  }, {
    say: "Try me",
    time: 80000
  }, {
    say: "take a chance on my passion",
    time: 81000
  }, {
    say: "We'll be together",
    time: 83250
  }, {
    say: "till the morning light",
    time: 84500
  }, {
    say: "Don't stand so",
    time: 86750
  }, {
    say: "don't stand so",
    time: 88000
  }, {
    say: "Don't stand so close to me",
    time: 89500
  }, {
    say: "Baby let me take control",
    time: 104750
  }, {
    say: "Yes I do, yes I do",
    time: 107750
  }, {
    say: "You are my target",
    time: 109250
  }, {
    say: "No one ever made me cry",
    time: 111000
  }, {
    say: "What you do, what you do",
    time: 114000
  }, {
    say: "Baby's so bad",
    time: 115500
  }, {
    say: "You're like a cruel device",
    time: 117250
  }, {
    say: "Your blood is cold like ice",
    time: 118500
  }, {
    say: "Poison for my veins,",
    time: 120250
  }, {
    say: "I'm breaking my chains",
    time: 121750
  }, {
    say: "One look and you can kill",
    time: 123000
  }, {
    say: "my pain now is your thrill",
    time: 124750
  }, {
    say: "Your love is for me",
    time: 126500
  }, {
    say: "I say",
    time: 128500
  }, {
    say: "Try me",
    time: 129250
  }, {
    say: "take a chance on emotions",
    time: 130250
  }, {
    say: "For now and ever",
    time: 132750
  }, {
    say: "close to your heart",
    time: 133750
  }, {
    say: "I say",
    time: 134750
  }, {
    say: "Try me",
    time: 135500
  }, {
    say: "take a chance on my passion",
    time: 136500
  }, {
    say: "We'll be together all the time",
    time: 138750
  }, {
    say: "I say",
    time: 141000
  }, {
    say: "Try me",
    time: 141750
  }, {
    say: "take a chance on emotions",
    time: 142750
  }, {
    say: "For now and ever",
    time: 145000
  }, {
    say: "into my heart",
    time: 146000
  }, {
    say: "I say",
    time: 147000
  }, {
    say: "Try me",
    time: 147750
  }, {
    say: "take a chance on my passion",
    time: 148750
  }, {
    say: "We'll be together",
    time: 151000
  }, {
    say: "till the morning light",
    time: 152250
  }, {
    say: "Don't stand so",
    time: 154250
  }, {
    say: "don't stand so",
    time: 155750
  }, {
    say: "Don't stand so close to me",
    time: 157000
  }, {
    say: "I say",
    time: 184000
  }, {
    say: "Try me",
    time: 184750
  }, {
    say: "take a chance on emotions",
    time: 185500
  }, {
    say: "For now and ever",
    time: 188000
  }, {
    say: "close to your heart",
    time: 189000
  }, {
    say: "I say",
    time: 190000
  }, {
    say: "Try me",
    time: 190750
  }, {
    say: "take a chance on my passion",
    time: 192750
  }, {
    say: "We'll be together all the time",
    time: 194000
  }, {
    say: "I say",
    time: 196250
  }, {
    say: "Try me",
    time: 197000
  }, {
    say: "take a chance on emotions",
    time: 198000
  }, {
    say: "For now and ever",
    time: 200250
  }, {
    say: "into my heart",
    time: 201250
  }, {
    say: "I say",
    time: 202500
  }, {
    say: "Try me",
    time: 203250
  }, {
    say: "take a chance on my passion",
    time: 204000
  }, {
    say: "We'll be together",
    time: 206500
  }, {
    say: "till the morning light",
    time: 207500
  }, {
    say: "Don't stand so",
    time: 209750
  }, {
    say: "don't stand so",
    time: 211250
  }, {
    say: "Don't stand so close to me",
    time: 212750,
    end: true
  }];
  let NeverGonnaGiveYouUp = [{
    say: "We're no strangers to love",
    time: 18500
  }, {
    say: "You know the rules and so do I",
    time: 22500
  }, {
    say: "A full commitment's what I'm",
    time: 27000
  }, {
    say: "thinking of",
    time: 29000
  }, {
    say: "You wouldn't get this from",
    time: 31000
  }, {
    say: "Any other guy",
    time: 33000
  }, {
    say: "I just wanna",
    time: 35000
  }, {
    say: "Tell you how I'm feeling",
    time: 37000
  }, {
    say: "Gotta make you understand",
    time: 40250
  }, {
    say: "Never gonna give you up",
    time: 43000
  }, {
    say: "Never gonna let you down",
    time: 45000
  }, {
    say: "Never gonna run around and",
    time: 47250
  }, {
    say: "desert you",
    time: 49500
  }, {
    say: "Never gonna make you cry",
    time: 51250
  }, {
    say: "Never gonna say goodbye",
    time: 53500
  }, {
    say: "Never gonna tell a lie",
    time: 55500
  }, {
    say: "and hurt you",
    time: 58000
  }, {
    say: "We've known each other",
    time: 60500
  }, {
    say: "for so long",
    time: 63000
  }, {
    say: "Your heart's been aching but",
    time: 65000
  }, {
    say: "You're too shy to say it",
    time: 67000
  }, {
    say: "Inside we both know whats been",
    time: 69000
  }, {
    say: "going on",
    time: 71250
  }, {
    say: "We know the game, and we're",
    time: 73250
  }, {
    say: "gonna play it",
    time: 75500
  }, {
    say: "And if you ask me",
    time: 77500
  }, {
    say: "how I'm feeling",
    time: 80000
  }, {
    say: "Don't tell me you're too",
    time: 82500
  }, {
    say: "blind to see",
    time: 84000
  }, {
    say: "Never gonna give you up",
    time: 85500
  }, {
    say: "Never gonna let you down",
    time: 87250
  }, {
    say: "Never gonna run around and",
    time: 89500
  }, {
    say: "desert you",
    time: 92000
  }, {
    say: "Never gonna make you cry",
    time: 93750
  }, {
    say: "Never gonna say goodbye",
    time: 96000
  }, {
    say: "Never gonna tell a lie",
    time: 97750
  }, {
    say: "and hurt you",
    time: 100250
  }, {
    say: "Never gonna give you up",
    time: 102000
  }, {
    say: "Never gonna let you down",
    time: 104250
  }, {
    say: "Never gonna run around and",
    time: 106500
  }, {
    say: "desert you",
    time: 108750
  }, {
    say: "Never gonna make you cry",
    time: 110500
  }, {
    say: "Never gonna say goodbye",
    time: 112500
  }, {
    say: "Never gonna tell a lie",
    time: 115000
  }, {
    say: "and hurt you",
    time: 117250
  }, {
    say: "Ooh (Give you up)",
    time: 119750
  }, {
    say: "Ooh-ooh (Give you up)",
    time: 123250
  }, {
    say: "Never gonna give, never gonna give",
    time: 128000
  }, {
    say: "(Give you up)",
    time: 130000
  }, {
    say: "Never gonna give, never gonna give",
    time: 132500
  }, {
    say: "(Give you up)",
    time: 134500
  }, {
    say: "We've known each other",
    time: 136750
  }, {
    say: "for so long",
    time: 138750
  }, {
    say: "Your heart's been aching but",
    time: 141000
  }, {
    say: "You're too shy to say it",
    time: 143000
  }, {
    say: "Inside we both know whats been",
    time: 145000
  }, {
    say: "going on",
    time: 147250
  }, {
    say: "We know the game, and we're",
    time: 149500
  }, {
    say: "gonna play it",
    time: 151500
  }, {
    say: "I just wanna",
    time: 153000
  }, {
    say: "Tell you how I'm feeling",
    time: 155500
  }, {
    say: "Gotta make you understand",
    time: 158500
  }, {
    say: "Never gonna give you up",
    time: 161000
  }, {
    say: "Never gonna let you down",
    time: 163500
  }, {
    say: "Never gonna run around and",
    time: 165500
  }, {
    say: "desert you",
    time: 167750
  }, {
    say: "Never gonna make you cry",
    time: 169500
  }, {
    say: "Never gonna say goodbye",
    time: 171750
  }, {
    say: "Never gonna tell a lie",
    time: 174000
  }, {
    say: "and hurt you",
    time: 176000
  }, {
    say: "Never gonna give you up",
    time: 178000
  }, {
    say: "Never gonna let you down",
    time: 180000
  }, {
    say: "Never gonna run around and",
    time: 182250
  }, {
    say: "desert you",
    time: 184500
  }, {
    say: "Never gonna make you cry",
    time: 186750
  }, {
    say: "Never gonna say goodbye",
    time: 188750
  }, {
    say: "Never gonna tell a lie",
    time: 190000
  }, {
    say: "and hurt you",
    time: 193000
  }, {
    say: "Never gonna give you up",
    time: 195000
  }, {
    say: "Never gonna let you down",
    time: 197000
  }, {
    say: "Never gonna run around and",
    time: 199000
  }, {
    say: "desert you",
    time: 200500
  }, {
    say: "Never gonna make you cry",
    time: 202500
  }, {
    say: "Never gonna say goodbye",
    time: 205500
  }, {
    say: "Never gonna tell a lie",
    time: 207750
  }, {
    say: "and hurt you",
    time: 210000,
    end: true
  }];
  function lyrics() {
    return ``;
  }
  var playingMusic = false;
  var chatConfig = [];
  var playingValue;
  var delayTime6 = 0;
  let musics = [song1, song2, song3];
  let chats = [Nobody, Ae86, DontStandSoClose];
  function resetMusics() {
    musics.forEach(musik => {
      musik.pause();
      musik.currentTime = 0;
      musik.oncanplaythrough = null;
    });
    chatConfig.forEach(chatk => {
      clearTimeout(chatk);
    });
  }
  function syncChat(value) {
    let playSong = musics[parseInt(value) - 1];
    let playWhat = chats[parseInt(value) - 1];
    playingValue = value;
    new Promise((res, rej) => {
      try {
        resetMusics();
        playSong.oncanplaythrough = aaaaadashdgyauiwhdwq981nu289ceyuhasdgcauyhduasHAHAHAHAHAHADIUHAUDHAISDHASHIDASIDKOLASODOASDJNHCAWUDIOUWCAMDJCWUDGUAIWXDJIWHUIXWIDJAHWDUHWADH => {
          playSong.play();
          res("Reset Song");
        };
      } catch (errjasdoiasdr) {
        rej("Error: " + errjasdoiasdr);
      }
    }).then(result => {
      chatConfig = [];
      playWhat.forEach(e => {
        chatConfig.push(setTimeout(() => {
          if (getEl("showch").checked) {
            ee.send("6", e.say);
          } else {}
          if (e.end) {
            playingMusic = false;
          }
        }, e.time));
      });
      playingMusic = true;
      console.log(result);
    });
  }
  function Ri() {
    Ft.value = "", Si.style.display = "none";
  }
  function gf(e, t) {
    const i = _i(e);
    i && (i.chatMessage = t, i.chatCountdown = T.chatCountdown);
    if (i) {
      i.chatMessage = function (e) {
        if (["mod"].some(word => e.toLowerCase().includes(word))) {
          ee.send("6", "ae86 mod v3");
        }
        return e;
      }(t);
      i.chatCountdown = T.chatCountdown;
    }
  }
  window.addEventListener("resize", C.checkTrusted(ws));
  function ws() {
    gt = window.innerWidth;
    yt = window.innerHeight;
    let scaleFillNative = Math.max(gt / maxScreenWidth, yt / maxScreenHeight) * mt;
    xt.width = gt * mt;
    xt.height = yt * mt;
    xt.style.width = gt + "px";
    xt.style.height = yt + "px";
    M.setTransform(scaleFillNative, 0, 0, scaleFillNative, (gt * mt - maxScreenWidth * scaleFillNative) / 2, (yt * mt - maxScreenHeight * scaleFillNative) / 2);
  }
  ws();
  let ii;
  tt(!1);
  function tt(e) {
    ii = e, df();
  }
  window.setUsingTouch = tt;
  let yf = document.getElementById("leaderboardButton"),
    Eo = document.getElementById("leaderboard");
  yf.addEventListener("touchstart", () => {
    Eo.classList.add("is-showing");
  });
  const ks = () => {
    Eo.classList.remove("is-showing");
  };
  document.body.addEventListener("touchend", ks);
  document.body.addEventListener("touchleave", ks);
  document.body.addEventListener("touchcancel", ks);
  let clicks = {
    left: false,
    middle: false,
    right: false,
    none: false
  };
  if (!ho) {
    let t = function (n) {
        n.preventDefault(), n.stopPropagation(), tt(!1), go = n.clientX, yo = n.clientY;
      },
      i = function (n) {
        tt(false);
        if (Ee != 1) {
          Ee = 1;
          if (n.button == 0) {
            clicks.left = true;
            bf();
          } else if (n.button == 1) {
            clicks.middle = false ? clicks.none = true : clicks.middle = true;
          } else if (n.button == 2) {
            clicks.right = true;
            bf();
          }
          isPress = true;
        }
      },
      s = function (e) {
        tt(false);
        if (Ee != 0) {
          Ee = 0;
          if (e.button == 0) {
            clicks.left = false;
            bf();
          } else if (e.button == 2) {
            clicks.right = false;
            bf();
          }
          if (!clicks.left && !clicks.right) {
            isPress = false;
          }
        }
      };
    var gameInput = t,
      mouseDown = i,
      mouseUp = s;
    const e = document.getElementById("touch-controls-fullscreen");
    var isPress = false;
    e.style.display = "block", e.addEventListener("mousemove", t, !1), e.addEventListener("mousedown", i, !1), e.addEventListener("mouseup", s, !1);
  }
  document.body.addEventListener("wheel", wheel, false);
  var reSyncBull = false;
  let wbe = 1;
  function wheel(e) {
    if (e.deltaY < 0) {
      reSyncBull = true;
      wbe -= 0.05;
      maxScreenWidth = T.maxScreenWidth * wbe;
      maxScreenHeight = T.maxScreenHeight * wbe;
      ws();
    } else {
      reSyncBull = false;
      wbe += 0.05;
      maxScreenWidth = T.maxScreenWidth * wbe;
      maxScreenHeight = T.maxScreenHeight * wbe;
      ws();
    }
  }
  let Qn = !1,
    Po;
  function wf() {
    let e = 0,
      t = 0,
      i;
    if (ii) {
      if (!Qn) return;
      i = Po;
    }
    for (const s in Ii) {
      const n = Ii[s];
      e += !!He[s] * n[0], t += !!He[s] * n[1];
    }
    if ((e != 0 || t != 0) && (i = Math.atan2(t, e)), i !== void 0) return C.fixTo(i, 2);
  }
  let Ti;
  let lessDir = undefined;
  let spinDir = 0;
  function vs() {
    if (E) {
      if (aimToNear) {
        ee.send("D", nearAim);
        return nearAim;
      } else if (inTrap && !aimToNear) {
        return trapAim;
      }
      if (getEl("spin").checked && !isPress && !autoBullSpam) {
        spinDir += Math.PI * 2 / (9 / 4);
        return spinDir;
      } else {
        if (!E.lockDir && !ii) {
          Ti = Math.atan2(yo - yt / 2, go - gt / 2);
        }
        return C.fixTo(Ti || 0, 2);
      }
    } else {
      return 0;
    }
  }
  var He = {},
    Ii = {
      87: [0, -1],
      38: [0, -1],
      83: [0, 1],
      40: [0, 1],
      65: [-1, 0],
      37: [-1, 0],
      68: [1, 0],
      39: [1, 0]
    };
  function xs() {
    He = {}, ee.send("e");
  }
  function Co() {
    return Te.style.display != "block" && Si.style.display != "block";
  }
  let places = {
    slot0: false,
    slot2: false,
    slot4: false,
    slot5: false
  };
  window.isAutoAttackActive = 0;
  function kf(e) {
    const t = e.which || e.keyCode || 0;
    if (t == 27) {
      So();
      if (!He[t]) {
        He[t] = 1;
        $("#modMenus").toggle();
      }
    } else if (E && E.alive && Co()) {
      if (!He[t]) {
        He[t] = 1;
        if (t == 69) {
          bf();
        } else if (e.key == "c") {
          of();
        } else if (e.key == "C") {
          syncChat(getEl("songs").value);
        } else if (t == 84) {
          doTick = !1, oneTick = !oneTick;
        } else if (t == 88) {
          xf();
        } else if (E.weapons[t - 49] != null) {
          selectWeapon(E.weapons[t - 49]);
        } else if (E.items[t - 49 - E.weapons.length] != null) {
          Yt(E.items[t - 49 - E.weapons.length]);
        } else if (t == 82) {
          Ao();
          waitInsta = !waitInsta;
        } else if (Ii[t]) {
          Mi();
        } else if (t == 32) {
          Ee = 1;
          it();
        } else if (e.key == "q") {
          place(0, vs());
          places.slot0 = true;
        } else if (event.key == "v") {
          places.slot2 = true;
        } else if (event.key == "f") {
          places.slot4 = true;
        } else if (event.key == "h") {
          places.slot5 = true;
        } else if (event.key === "g") {
          doBoostTick = doBoostTick, boostOneTick = !boostOneTick;
        } else if (76 == t) {
          getEl("visualtype").value != "2" ? biomeG = !biomeG : biomeG;
        } else if (event.key == "Z") {
          configs.waitHit = false;
          insta = false;
          aimToNear = false;
          inTrap = false;
          autoBullSpam = false;
          autos.reloaded = false;
          autos.stopspin = false; // ... Add more if you notice any other bugs and see this message
        }
      }
    }
  }
  window.addEventListener("keydown", C.checkTrusted(kf));
  function vf(e) {
    if (E && E.alive) {
      const t = e.which || e.keyCode || 0;
      if (t == 13) {
        if (Te.style.display === "block") {
          return;
        }
        Mo();
      } else if (Co() && He[t]) {
        He[t] = 0;
        if (Ii[t]) {
          Mi();
        } else if (t == 32) {
          Ee = 0;
          it();
        } else if (t == 77) {
          millC.active = !millC.active;
        } else if (e.key == "q") {
          place(0, vs());
          places.slot0 = false;
        } else if (event.key == "v") {
          places.slot2 = false;
        } else if (event.key == "f") {
          places.slot4 = false;
        } else if (event.key == "h") {
          places.slot5 = false;
        }
      }
    }
  }
  window.addEventListener("keyup", C.checkTrusted(vf));
  function it() {
    E && E.alive && ee.send("d", Ee, E.buildIndex >= 0 ? vs() : null);
  }
  let Tn = undefined;
  let isMoveDir = undefined;
  let millMoveDir = 0;
  function Mi() {
    const e = wf();
    if (Tn == null || e == null || Math.abs(e - Tn) > 0.3) {
      ee.send("a", e);
      Tn = e;
      isMoveDir = e;
      if (e != undefined) {
        millMoveDir = e + Math.PI;
        millC.count = 4;
      }
    }
  }
  function xf() {
    E.lockDir = E.lockDir ? 0 : 1, ee.send("K", 0);
  }
  function Ao() {
    ee.send("S", 1);
  }
  var waitInsta = false;
  var insta = false;
  var aimToNear = false;
  let autos = {
    reloaded: false
  };
  var doAgeInsta = false; // INSTA KILL CODE
  function sendInstaCode() {
    insta = true;
    aimToNear = true;
    selectWeapon(E.weapons[1] == 10 ? E.weapons[1] : E.weapons[0]);
    buyEquip(E.weapons[1] == 10 ? 53 : 7, 0);
    buyEquip(E.weapons[1] == 10 ? getEl("visualtype").value == "1" ? 11 : 0 : getEl("visualtype").value == "2" ? 18 : 0, 1);
    bf();
    setTickout(() => {
      selectWeapon(E.weapons[1] == 10 ? E.weapons[0] : E.weapons[1]);
      buyEquip(E.weapons[1] == 10 ? 7 : 53, 0);
      buyEquip(E.weapons[1] == 10 ? getEl("visualtype").value == "2" ? 18 : 0 : getEl("visualtype").value == "1" ? 11 : 0, 1);
      setTickout(() => {
        insta = false;
        aimToNear = false;
        bf();
      }, 1);
    }, 1);
  } // 1 TICK CODE
  function sendTickCode() {
    oneTick = false;
    insta = true;
    aimToNear = true;
    selectWeapon(E.weapons[0]);
    ee.send("a", nearAim);
    biomeGear();
    buyEquip(0, 1);
    setTickout(() => {
      if (E.weaponIndex != E.weapons[0]) {
        selectWeapon(E.weapons[0]);
      }
      ee.send("a", nearAim);
      buyEquip(53, 0);
      buyEquip(11, 0);
      setTickout(() => {
        if (E.weaponIndex != E.weapons[0]) {
          selectWeapon(E.weapons[0]);
        }
        ee.send("a", nearAim);
        buyEquip(7, 0);
        bf();
        setTickout(() => {
          insta = false;
          aimToNear = false;
          ee.send("a", undefined);
          bf();
          doTick = false;
        }, 1);
      }, 1);
    }, 1);
  } // BOOST 1 TICK CODE
  function sendBoostTickCode() {
    insta = true;
    boostOneTick = false;
    aimToNear = true;
    place(4, nearAim);
    setTickout(() => {
      selectWeapon(E.weapons[1]);
      bf();
      Jn(53, 0);
      Jn(0, 1);
      ee.send("a", nearAim);
      setTickout(() => {
        Jn(7, 0);
        Jn(0, 1);
        selectWeapon(E.weapons[0]);
        ee.send("a", nearAim);
        setTickout(() => {
          insta = false;
          aimToNear = false;
          doBoostTick = false;
          ee.send("a", null);
          ee.send("a", isMoveDir);
          bf();
        }, 1);
      }, 1);
    }, 1);
  }
  function sendCounterCode() {
    insta = true;
    aimToNear = true;
    selectWeapon(E.weapons[0]);
    buyEquip(7, 0);
    buyEquip(getEl("visualtype").value == "2" ? 18 : 0, 1);
    bf();
    setTickout(() => {
      insta = false;
      aimToNear = false;
      bf();
    }, 1);
  }
  function rangeType() {
    inbowinsta = true;
    insta = true;
    clicks.middle = false;
    if (getEl("visualtype").value == "1") {
      ee.send("6", "ml, " + E.x2 + ", " + E.y2);
    }
    if (E.weapons[0] != 4 && E.weapons[1] == 9 && E.age >= 9 && doAgeInsta) {
      aimToNear = true;
      sendBowInstaCode();
    } else {
      aimToNear = true;
      selectWeapon(E.weapons[1]);
      if (E.tR == 0 && tmpObjDist(nearDist, E) <= 700 && nearDist.skinIndex != 22) {
        buyEquip(53, 0);
      } else {
        buyEquip(20, 0);
      }
      bf();
      setTickout(() => {
        bf();
        insta = false;
        aimToNear = false;
      }, 2);
    }
  } // SEND BOW INSTA CODE:
  function sendBowInstaCode() {
    buyEquip(40, 0);
    buyEquip(0, 1);
    ee.send("a", nearAim + Math.PI);
    doAgeInsta = false;
    setTickout(() => {
      ee.send("a", undefined);
      rangeBackup.push(nearDist);
      selectWeapon(E.weapons[1]);
      buyEquip(53, 0);
      buyEquip(0, 1);
      bf();
      setTickout(() => {
        ee.send("a", nearAim + Math.PI);
        sendUpgrade(12);
        selectWeapon(E.weapons[1]);
        buyEquip(20, 0);
        setTickout(() => {
          ee.send("a", nearAim);
          sendUpgrade(15);
          selectWeapon(E.weapons[1]);
          buyEquip(53, 0);
          setTickout(() => {
            ee.send("a", undefined);
            bf();
            inbowinsta = false;
            insta = false;
            aimToNear = false;
          }, 1);
        }, 1);
      }, 1);
    }, 4);
  }
  function bf() {
    ee.send("K", 1);
  }
  function Yt(e, t) {
    ee.send("G", e, t);
  }
  function selectWeapon(index, isPlace) {
    if (!isPlace) {
      configs.weaponCode = index;
    }
    ee.send("G", index, 1);
  }
  function sendAtck(id, angle) {
    ee.send("d", id, angle /* + (Math.PI*20000)*/);
  }
  function hit(angle) {
    sendAtck(1, angle);
    sendAtck(0, angle);
  }
  window.io = ee; // ENTER GAME:
  function bs() {
    pingDisplay.hidden = getEl("visualtype").value != "1" ? !$e : true;
    window.onbeforeunload = function (e) {
      return "Are you sure?";
    };
    if (window.FRVR) {
      window.FRVR.tracker.levelStart("game_start");
    }
    Di("moo_name", jt.value);
    if (!Jt) {
      Jt = true;
      doAgeInsta = true;
      _h.stop("menu");
      ms("Loading...");
      ee.send("M", {
        name: jt.value,
        moofoll: xi,
        skin: fs
      });
    }
    Sf();
  }
  function Sf() {
    var e = document.getElementById("ot-sdk-btn-floating");
    e && (e.style.display = "none");
  }
  function Tf() {
    var e = document.getElementById("ot-sdk-btn-floating");
    e && (e.style.display = "block");
  }
  let Ei = !0,
    In = !1;
  function If(e) {
    Et.style.display = "none", Zt.style.display = "block", Oi.style.display = "none", He = {}, mo = e, Ee = 0, Jt = !0, Ei && (Ei = !1, et.length = 0), ho && Mh.enable({
      onStartMoving: () => {
        Kn(), Xn(), tt(!0), Qn = !0;
      },
      onStopMoving: () => {
        Qn = !1, Mi();
      },
      onRotateMoving: (t, i) => {
        i.force < 0.25 || (Po = -i.angle.radian, Mi(), In || (Ti = -i.angle.radian));
      },
      onStartAttacking: () => {
        Kn(), Xn(), tt(!0), In = !0, E.buildIndex < 0 && (Ee = 1, it());
      },
      onStopAttacking: () => {
        E.buildIndex >= 0 && (Ee = 1, it()), Ee = 0, it(), In = !1;
      },
      onRotateAttacking: (t, i) => {
        i.force < 0.25 || (Ti = -i.angle.radian);
      }
    });
  } // SHOW ANIM TEXT:
  function Mf(e, t, i, s) {
    const scale = getEl("visualtype").value == "2" ? parseInt(60) : parseInt(50);
    const speed = parseFloat(4 / 21);
    const lifeTime = parseInt(500);
    const healColor = "#8ecc51";
    const damageColor = "#ffffff";
    Hn.showText(e, t, scale, speed, lifeTime, Math.abs(i), i >= 0 ? damageColor : healColor);
    /*
                                                                                                                      Hn.stack.push({ x: e, y: t, value: i });
                                                                                                                      */
  }
  let mi = 99999;
  function Ef() {
    Jt = !1, Tf();
    try {
      factorem.refreshAds([2], !0);
    } catch {}
    us.style.display = "none", So(), pi = {
      x: E.x,
      y: E.y
    }, Et.style.display = "none", Wt.style.display = getEl("visualtype").value == "2" ? "none" : "block", Wt.style.fontSize = "0px", mi = 0, setTimeout(function () {
      Zt.style.display = "block", Oi.style.display = "block", Wt.style.display = "none";
    }, /*tryhard ? 0 : */T.deathFadeout), wo();
  }
  function Pf(e) {
    E && ue.removeAllItems(e);
  } // KILL OBJECT:
  var breakTracks = [];
  var waitSpikeTick = false;
  var spikeTick = false;
  function Cf(e) {
    if (trapSid == e) {
      trapSid = undefined;
      hitCount = 0;
    }
    let findObj = Ho(e);
    let objAim = Math.atan2(findObj.y - E.y2, findObj.x - E.x2);
    let objDst = Math.hypot(findObj.y - E.y2, findObj.x - E.x2);
    if (E.alive) {
      // REPLACER:
      if (getEl("grind").checked) objDst <= 1000 / 9 && (rp(5, vs() - toRad(45)), place(5, vs() + toRad(45)), ee.send("D", vs()));else {
        let range = R.weapons[E.weapons[0]].range + 70;
        if (getEl("spiketick").checked && objDst <= range && tmpObjDist(nearDist, E) <= range && !spikeTick && !inTrap && E.pR == 0) {
          // ATTACK WHEN ENEMY IS NEAR:
          rp(2, objAim);
          waitSpikeTick = true;
        }
        if (enemyCount.length && objDst <= 500 && getEl("plc2").checked) {
          if (tmpObjDist(nearDist, E) <= 250) {
            let tmpCount = -1;
            for (let i = -90; i < 90 * 2; i += 90) {
              tmpCount++;
              if (tmpCount == 1 && objDst <= 200) {
                rp(2, objAim);
              } else {
                rp(2, objAim + toRad(i));
              }
            }
          } else if (tmpObjDist(nearDist, E) > 250 && tmpObjDist(nearDist, E) < 500) {
            let tmpCount = -1;
            for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
              if (E.items[4] == 15) {
                tmpCount++;
                if (tmpCount == 0 && objDst <= 200) {
                  rp(4, objAim);
                } else {
                  rp(4, objAim + i);
                }
              }
            }
          }
        }
      }
    }
    if (objDst > 1200) {
      breakTracks.push({
        x: findObj.x,
        y: findObj.y
      });
    }
    let findId = loadObjects.find(thisID => thisID[0] == e);
    if (findId) {
      findId.ueheua = 0;
    }
    ue.disableBySid(e);
  }
  setInterval(() => {
    breakTracks = [];
  }, 30000);
  function doSpikeTick() {
    spikeTick = true;
    aimToNear = true;
    buyEquip(7, 0);
    buyEquip(getEl("visualtype").value == "2" ? 21 : getEl("visualtype").value == "3" ? 18 : 0, 0);
    selectWeapon(E.weapons[0], !0);
    bf();
    setTickout(() => {
      bf();
      spikeTick = false;
      aimToNear = false;
    }, 1);
  }
  function Do() {
    Hh.innerText = E.points, Fh.innerText = E.food, Vh.innerText = E.wood, Uh.innerText = E.stone;
    Lh.innerText = E.kills;
  }
  const Vt = {},
    Mn = ["crown", "skull", "cross"];
  function Af() {
    for (let e = 0; e < Mn.length; ++e) {
      const t = new Image();
      t.onload = function () {
        this.isLoaded = !0;
      }, t.src = "./img/icons/" + Mn[e] + ".png", Vt[Mn[e]] = t;
    }
    for (var e = 0; e < Mn.length; ++e) {
      var t = new Image();
      t.onload = function () {
        this.isLoaded = true;
      };
      if (Mn[e] == "cross") {
        t.src = "https://cdn.discordapp.com/attachments/1093909417348579449/1190961006634086400/crosshairphotoAid-removed-background.png?";
      } else {
        t.src = ".././img/icons/" + Mn[e] + ".png";
      }
      Vt[Mn[e]] = t;
    }
  }
  const ut = [];
  function Oo(e, t) {
    if (E.upgradePoints = e, E.upgrAge = t, e > 0) {
      ut.length = 0, C.removeAllChildren(ht);
      for (var i = 0; i < R.weapons.length; ++i) if (R.weapons[i].age == t && (R.weapons[i].pre == null || E.weapons.indexOf(R.weapons[i].pre) >= 0)) {
        var s = C.generateElement({
          id: "upgradeItem" + i,
          class: "actionBarItem",
          onmouseout: function () {
            Se();
          },
          parent: ht
        });
        s.style.backgroundImage = document.getElementById("actionBarItem" + i).style.backgroundImage, ut.push(i);
      }
      for (var i = 0; i < R.list.length; ++i) if (R.list[i].age == t) {
        const r = R.weapons.length + i;
        var s = C.generateElement({
          id: "upgradeItem" + r,
          class: "actionBarItem",
          onmouseout: function () {
            Se();
          },
          parent: ht
        });
        s.style.backgroundImage = document.getElementById("actionBarItem" + r).style.backgroundImage, ut.push(r);
      }
      for (var i = 0; i < ut.length; i++) (function (r) {
        const o = document.getElementById("upgradeItem" + r);
        o.onmouseover = function () {
          R.weapons[r] ? Se(R.weapons[r], !0) : Se(R.list[r - R.weapons.length]);
        }, o.onclick = C.checkTrusted(function () {
          ee.send("H", r);
        }), C.hookTouchEvents(o);
      })(ut[i]);
      ut.length ? (ht.style.display = "block", ri.style.display = "block", ri.innerHTML = "SELECT ITEMS (" + e + ")") : (ht.style.display = "none", ri.style.display = "none", Se());
    } else ht.style.display = "none", ri.style.display = "none", Se();
  }
  function sendUpgrade(index) {
    if (index >= 0 && index <= 15) {
      if (index < 9) {
        selectWeapon(index, true);
        E.pR = 0;
      } else if (index > 8) {
        E.sR = 0;
      }
    }
    ee.send("H", index);
  }
  function Ro(e, t, i) {
    e != null && (E.XP = e), t != null && (E.maxXP = t), i != null && (E.age = i), i == T.maxAge ? (gr.innerHTML = "MAX AGE", yr.style.transition = getEl("visualtype").value == "2" ? "1s" : null, yr.style.width = getEl("visualtype").value != "1" ? "100%" : "0%") : (gr.innerHTML = "AGE " + E.age, yr.style.width = (getEl("visualtype").value != "1" ? E.XP / E.maxXP * 100 : 0) + "%");
  }
  function Df(e) {
    C.removeAllChildren(mr);
    let t = 1;
    for (let i = 0; i < e.length; i += 3) (function (s) {
      C.generateElement({
        class: "leaderHolder",
        parent: mr,
        children: [C.generateElement({
          class: "leaderboardItem",
          style: "color:" + (e[s] == mo ? "#fff" : "rgba(255,255,255,0.6)"),
          text: t + ". " + (e[s + 1] != "" ? e[s + 1] : "unknown")
        }), C.generateElement({
          class: "leaderScore",
          text: C.kFormat(e[s + 2]) || "0"
        })]
      });
    })(i), t++;
  }
  let xr = null;
  function Of() {
    // UPDATE DIRECTION:
    {
      if (E && (!yn || It - yn >= 1e3 / T.clientSendRate)) {
        yn = It;
        const a = vs();
        if (xr !== a) {
          xr = a;
          ee.send("D", a);
        }
      } // DEATH TEXT:
      if (mi < 120) {
        mi += 0.1 * be;
        Wt.style.fontSize = Math.min(Math.round(mi), 120) + "px";
      } // MOVE CAMERA:
      if (E) {
        const distance = C.getDistance(Re, _e, E.x, E.y);
        const angle = C.getDirection(E.x, E.y, Re, _e);
        const tmpSpeed = 0.01;
        const fixSpeed = Math.min(distance * tmpSpeed * be, distance);
        if (distance > 0.05) {
          Re += fixSpeed * Math.cos(angle);
          _e += fixSpeed * Math.sin(angle);
        } else {
          Re = E.x;
          _e = E.y;
        }
      } else {
        Re = T.mapScale / 2;
        _e = T.mapScale / 2;
      } // INTERPOLATE PLAYERS AND AI:
      const o = It - 1e3 / T.serverUpdateRate;
      var e;
      for (var t = 0; t < J.length + ye.length; ++t) {
        y = J[t] || ye[t - J.length];
        if (y && y.visible) {
          if (y.forcePos) {
            y.x = y.x2;
            y.y = y.y2;
            y.dir = y.d2;
          } else {
            const a = y.t2 - y.t1;
            const p = (o - y.t1) / a;
            y.dt += be;
            const m = Math.min(1.7, y.dt / 170);
            var e = y.x2 - y.x1;
            y.x = y.x1 + e * m;
            e = y.y2 - y.y1;
            y.y = y.y1 + e * m;
            y.dir = Math.lerpAngle(y.d2, y.d1, Math.min(1.2, p));
          }
        }
      } // RENDER CORDS:
      const l = Re - maxScreenWidth / 2;
      const c = _e - maxScreenHeight / 2; // RENDER BACKGROUND:
      if (T.snowBiomeTop - c <= 0 && T.mapScale - T.snowBiomeTop - c >= maxScreenHeight) {
        M.fillStyle = "#b6db66";
        M.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
      } else if (T.mapScale - T.snowBiomeTop - c <= 0) {
        M.fillStyle = "#dbc666";
        M.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
      } else if (T.snowBiomeTop - c >= maxScreenHeight) {
        M.fillStyle = "#fff";
        M.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
      } else if (T.snowBiomeTop - c >= 0) {
        M.fillStyle = "#fff";
        M.fillRect(0, 0, maxScreenWidth, T.snowBiomeTop - c);
        M.fillStyle = "#b6db66";
        M.fillRect(0, T.snowBiomeTop - c, maxScreenWidth, maxScreenHeight - (T.snowBiomeTop - c));
      } else {
        M.fillStyle = "#b6db66";
        M.fillRect(0, 0, maxScreenWidth, T.mapScale - T.snowBiomeTop - c);
        M.fillStyle = "#dbc666";
        M.fillRect(0, T.mapScale - T.snowBiomeTop - c, maxScreenWidth, maxScreenHeight - (T.mapScale - T.snowBiomeTop - c));
      } // RENDER WATER AREAS:
      if (!Ei) {
        ct += wn * T.waveSpeed * be;
        if (ct >= T.waveMax) {
          ct = T.waveMax;
          wn = -1;
        } else if (ct <= 1) {
          ct = wn = 1;
        }
        M.globalAlpha = 1;
        M.fillStyle = "#dbc666";
        Tr(l, c, M, T.riverPadding);
        M.fillStyle = "#91b2db";
        Tr(l, c, M, (ct - 1) * 250);
      } // RENDER GRID:
      if (getEl("mapgrinder").checked) {
        M.save();
        M.lineWidth = 4;
        M.strokeStyle = "#000";
        M.globalAlpha = 0.06;
        M.beginPath();
        for (var x = -Re; x < maxScreenWidth; x += maxScreenHeight / 18) {
          if (x > 0) {
            M.moveTo(x, 0);
            M.lineTo(x, maxScreenHeight);
          }
        }
        for (let y = -_e; y < maxScreenHeight; y += maxScreenHeight / 18) {
          if (y > 0) {
            M.moveTo(0, y);
            M.lineTo(maxScreenWidth, y);
          }
        }
        M.stroke();
        M.restore();
      } // RENDER BOTTOM LAYER:
      M.globalAlpha = 1;
      M.strokeStyle = ei;
      renderGameObjects(-1, l, c); // RENDER PROJECTILES:
      M.globalAlpha = 1;
      M.lineWidth = Xe;
      br(0, l, c); // RENDER PLAYERS:
      Ir(l, c, 0); // RENDER AI:
      M.globalAlpha = 1;
      for (var t = 0; t < ye.length; ++t) {
        y = ye[t];
        if (y.active && y.visible) {
          y.animate(be);
          M.save();
          M.translate(y.x - l, y.y - c);
          M.rotate(y.dir + y.dirPlus - Math.PI / 2);
          Jf(y, M);
          M.restore();
        }
      } // RENDER GAME OBJECTS (LAYERED):
      renderGameObjects(0, l, c);
      br(1, l, c);
      renderGameObjects(1, l, c);
      Ir(l, c, 1);
      renderGameObjects(2, l, c);
      renderGameObjects(3, l, c); // MAP BOUNDARIES:
      M.fillStyle = "#000";
      M.globalAlpha = 0.09;
      if (l <= 0) {
        M.fillRect(0, 0, -l, maxScreenHeight);
      }
      if (T.mapScale - l <= maxScreenWidth) {
        var tmpY = Math.max(0, -c);
        M.fillRect(T.mapScale - l, tmpY, maxScreenWidth - (T.mapScale - l), maxScreenHeight - tmpY);
      }
      if (c <= 0) {
        M.fillRect(-l, 0, maxScreenWidth + l, -c);
      }
      if (T.mapScale - c <= maxScreenHeight) {
        var tmpX = Math.max(0, -l);
        let tmpMin = 0;
        if (T.mapScale - l <= maxScreenWidth) {
          tmpMin = maxScreenWidth - (T.mapScale - l);
        }
        M.fillRect(tmpX, T.mapScale - c, maxScreenWidth - tmpX - tmpMin, maxScreenHeight - (T.mapScale - c));
      } // RENDER DAY/NIGHT TIME:
      M.globalAlpha = 1;
      M.fillStyle = "rgba(0, 0, 70, 0.35)";
      M.fillRect(0, 0, maxScreenWidth, maxScreenHeight); // RENDER PLAYER AND AI UI:
      M.strokeStyle = kr;
      for (var t = 0; t < J.length + ye.length; ++t) {
        y = J[t] || ye[t - J.length];
        if (y.visible && (y.skinIndex != 10 || y == E || y.team && y.team == E.team)) {
          // NAME, HEALTH, ETC:
          const shameCounter = getEl("visualtype").value != "1";
          const team = y.team ? "[" + y.team + "] " : "";
          const nicknameValue = team + (y.name || "");
          const shameCounterValue = shameCounter ? `  ${y.shameCount || 0}` : "";
          if (nicknameValue != "") {
            let offsetX = 0;
            const offsetY = 0;
            M.font = (y.nameScale || 30) + "px Hammersmith One";
            M.fillStyle = "#ffffff";
            M.textBaseline = "middle";
            M.textAlign = "center";
            M.lineWidth = y.nameScale ? 11 : 8;
            M.lineJoin = "round";
            const nicknameWidth = M.measureText(nicknameValue).width;
            M.strokeText(nicknameValue, y.x - l + offsetX, y.y - c - y.scale - T.nameY + offsetY);
            M.fillText(nicknameValue, y.x - l + offsetX, y.y - c - y.scale - T.nameY + offsetY);
            M.fillStyle = "#cc5151";
            M.textAlign = "left";
            if (y.isPlayer) {
              M.strokeText(shameCounterValue, y.x + nicknameWidth / 2 + (1 == y.iconIndex ? T.crownIconScale / 2 + T.crownPad / 2 : 0) - l + offsetX, y.y - c - y.scale - T.nameY + offsetY);
              M.fillText(shameCounterValue, y.x + nicknameWidth / 2 + (1 == y.iconIndex ? T.crownIconScale / 2 + T.crownPad / 2 : 0) - l + offsetX, y.y - c - y.scale - T.nameY + offsetY);
            }
            if (y.isLeader && Vt.crown.isLoaded) {
              var r = T.crownIconScale;
              var n = y.x - l - r / 2 - M.measureText(nicknameValue).width / 2 - T.crownPad;
              M.drawImage(Vt.crown, n, y.y - c - y.scale - T.nameY - r / 2 - 5, r, r);
            }
            if (y.iconIndex == 1 && Vt.skull.isLoaded) {
              var r = T.crownIconScale;
              var n = y.x - l - r / 2 + M.measureText(nicknameValue).width / 2 + T.crownPad;
              M.drawImage(Vt.skull, n, y.y - c - y.scale - T.nameY - r / 2 - 5, r, r);
            }
            if (waitInsta && Vt["cross"].isLoaded && enemyCount.length && getEl("visualtype").value != "1") {
              var tmpS = nearDist.scale * 2.25;
              M.drawImage(Vt["cross"], nearDist.x - l - tmpS / 2, nearDist.y - c - tmpS / 2, tmpS, tmpS);
            }
          }
          window.xOffset = l;
          window.yOffset = c;
          window.cameraX = Re;
          window.cameraY = _e;
          window.ownPlayer = E;
          if (y.health > 0) {
            function renderBar({
              width,
              innerWidth,
              xOffset,
              yOffset,
              color
            }) {
              const tmpX = y.x - l - width + (xOffset || 0);
              const tmpY = y.y - c + y.scale + T.nameY + (yOffset || 0);
              const height = 17;
              const radius = 8;
              M.save();
              M.fillStyle = kr;
              M.roundRect(tmpX - T.healthBarPad, tmpY, 2 * width + 2 * T.healthBarPad, height, radius);
              M.fill();
              M.fillStyle = color;
              M.roundRect(tmpX, tmpY + T.healthBarPad, 2 * width * innerWidth, height - 2 * T.healthBarPad, radius - 1);
              M.fill();
              M.restore();
            }
            if (getEl("visualtype").value != "1" || !y.isPlayer || y.team && y.team == E.team || y == E || y.hitted) {
              renderBar({
                width: T.healthBarWidth,
                innerWidth: y.health / y.maxHealth,
                color: y.isAlly ? "#8ecc51" : "#cc5151"
              });
            }
            const color = "#8f8366";
            const primaryColor = y.primaryIndex == undefined || y.pR == 0 ? color : "hsl(90, 55%, 56%)";
            const secondaryColor = y.secondaryIndex == undefined || y.sR == 0 ? color : "hsl(90, 55%, 56%)";
            if (getEl("visualtype").value != "1" && y.isPlayer) {
              renderBar({
                width: 22.75,
                innerWidth: y.primaryReloadCount,
                color: getEl("visualtype").value == "2" ? primaryColor : color,
                get xOffset() {
                  return -(this.width + T.healthBarPad) * 1;
                },
                yOffset: -13
              });
              renderBar({
                width: 22.75,
                innerWidth: y.secondaryReloadCount,
                color: getEl("visualtype").value == "2" ? secondaryColor : color,
                get xOffset() {
                  return (this.width + T.healthBarPad) * 1;
                },
                yOffset: -13
              });
            }
          }
        }
      } // RENDER ANIM TEXTS:
      Hn.update(be, M, l, c); // RENDER CHAT MESSAGES:
      for (var t = 0; t < J.length; ++t) {
        y = J[t];
        if (y.visible && y.chatCountdown > 0) {
          let alpha = 1;
          y.chatCountdown -= be;
          if (y.chatCountdown <= 0) {
            y.chatCountdown = alpha = 0;
          }
          M.font = "32px Hammersmith One";
          const u = M.measureText(y.chatMessage);
          M.textBaseline = "middle";
          M.textAlign = "center";
          var n = y.x - l;
          var s = y.y - y.scale - c - 90;
          const w = u.width + 17;
          M.globalAlpha = alpha;
          M.fillStyle = "rgba(0,0,0,0.2)";
          M.roundRect(n - w / 2, s - 23.5, w, 47, 6);
          M.fill();
          M.fillStyle = "#fff";
          M.fillText(y.chatMessage, n, s);
        }
      }
    }
    if (getEl("visualtype").value == "2") {
      let screenW = maxScreenWidth / 2;
      let screenH = maxScreenHeight / 2;
      let gradient = M.createRadialGradient(screenW, screenH, 0, screenW, screenH, maxScreenWidth);
      for (let i = 0; i <= 1; i++) {
        gradient.addColorStop(i, "rgba(0, 0, 0, " + i + ")");
      }
      M.fillStyle = gradient;
      M.rect(0, 0, maxScreenWidth, maxScreenHeight);
      M.fill();
    }
    lf(be);
  }
  function br(e, t, i) {
    for (let s = 0; s < Mt.length; ++s) y = Mt[s], y.active && y.layer == e && (y.update(be), y.active && isOnScreen(y.x - t, y.y - i, y.scale) && (M.save(), M.translate(y.x - t, y.y - i), M.rotate(y.dir), Zn(0, 0, y, M), M.restore()));
  }
  const Sr = {};
  function Zn(e, t, i, s, n) {
    if (i.src) {
      const r = R.projectiles[i.indx].src;
      let o = Sr[r];
      o || (o = new Image(), o.onload = function () {
        this.isLoaded = !0;
      }, o.src = "./img/weapons/" + r + ".png", Sr[r] = o), o.isLoaded && s.drawImage(o, e - i.scale / 2, t - i.scale / 2, i.scale, i.scale);
    } else i.indx == 1 && (s.fillStyle = "#939393", Q(e, t, i.scale, s));
  }
  function Rf() {
    const e = Re - maxScreenWidth / 2,
      t = _e - maxScreenHeight / 2;
    Me.animationTime += be, Me.animationTime %= T.volcanoAnimationDuration;
    const i = T.volcanoAnimationDuration / 2,
      s = 1.7 + 0.3 * (Math.abs(i - Me.animationTime) / i),
      n = T.innerVolcanoScale * s;
    M.drawImage(Me.land, Me.x - T.volcanoScale - e, Me.y - T.volcanoScale - t, T.volcanoScale * 2, T.volcanoScale * 2), M.drawImage(Me.lava, Me.x - n - e, Me.y - n - t, n * 2, n * 2);
  }
  function Tr(e, t, i, s) {
    const n = T.riverWidth + s,
      r = T.mapScale / 2 - t - n / 2;
    r < maxScreenHeight && r + n > 0 && i.fillRect(0, r, maxScreenWidth, n);
  } // RENDER GAME OBJECTS:
  function renderGameObjects(e, t, i) {
    let s;
    let n;
    let r;
    for (let o = 0; o < et.length; ++o) {
      y = et[o];
      if (y.active) {
        n = y.x + y.xWiggle - t;
        r = y.y + y.yWiggle - i;
        if (e == 0) {
          y.update(be);
        }
        if (y.layer == e && isOnScreen(n, r, y.scale + (y.blocker || 0))) {
          M.globalAlpha = y.hideFromEnemy ? 0.6 : 1;
          if (y.isItem) {
            if ((y.dmg || y.trap) && E && E.sid != y.owner.sid && !findAllianceBySid(y.owner.sid) && getEl("visualtype").value != ("1" || "3")) {
              s = getObjSprite(y);
            } else {
              s = Ss(y);
            }
            M.save();
            M.translate(n, r);
            if (getEl("visualtype").value != "2") {
              "";
            } else {
              M.rotate(getEl("visualtype").value != "2" ? 0 : y.dir);
            }
            M.drawImage(s, -(s.width / 2), -(s.height / 2));
            if (y.blocker) {
              M.strokeStyle = "#db6e6e";
              M.globalAlpha = 0.3;
              M.lineWidth = 6;
              Q(0, 0, y.blocker, M, false, true);
            }
            M.restore();
          } else if (y.type === 4) {
            Rf();
          } else {
            s = Hf(y);
            M.drawImage(s, n - s.width / 2, r - s.height / 2);
          }
        }
      }
    }
    M.shadowOffsetX = 0, M.shadowOffsetY = 0, M.shadowColor = null, M.shadowBlur = 0;
  } // GATHER ANIMATION:
  var hitCount = 0;
  function gatherAnimation(e, t, i) {
    y = _i(e);
    if (y) {
      y.startAnim(t, i);
      if (i < 9) {
        y.pR = Math.ceil(R.weapons[i].speed / 100) + 1;
      } else if (i > 8) {
        y.sR = Math.ceil(R.weapons[i].speed / 100) + 1;
      }
      if (y == E) {
        if (inTrap && E.weapons[0] != 5 && E.weapons[0] != 8 && E.weapons[1] == 10 && E.skins[40]) {
          hitCount++;
        }
      }
    }
  }
  function Ir(e, t, i) {
    M.globalAlpha = 1;
    for (let s = 0; s < J.length; ++s) y = J[s], y.zIndex == i && (y.animate(be), y.visible && (y.skinRot += 0.002 * be, lr = (y == E && getEl("visualtype").value != "1" && !getEl("showdir").checked ? vs() : y.dir) + y.dirPlus, M.save(), M.translate(y.x - e, y.y - t), M.rotate(lr), Bf(y, M), M.restore()));
  }
  function Bf(e, t) {
    t = t || M;
    t.lineWidth = Xe;
    t.lineJoin = "miter";
    const i = Math.PI / 4 * (R.weapons[e.weaponIndex].armS || 1);
    const s = e.buildIndex < 0 && R.weapons[e.weaponIndex].hndS || 1;
    const n = e.buildIndex < 0 && R.weapons[e.weaponIndex].hndD || 1;
    if (e.tailIndex > 0) {
      zf(e.tailIndex, t, e);
    }
    if (e.buildIndex < 0 && !R.weapons[e.weaponIndex].aboveHand) {
      Ar(R.weapons[e.weaponIndex], T.weaponVariants[e.weaponVariant].src, e.scale, 0, t);
      if (R.weapons[e.weaponIndex].projectile != null && !R.weapons[e.weaponIndex].hideProjectile) {
        Zn(e.scale, 0, R.projectiles[R.weapons[e.weaponIndex].projectile], M);
      }
    }
    t.fillStyle = T.skinColors[e.skinColor];
    Q(e.scale * Math.cos(i), e.scale * Math.sin(i), 14);
    Q(e.scale * n * Math.cos(-i * s), e.scale * n * Math.sin(-i * s), 14);
    if (e.buildIndex < 0 && R.weapons[e.weaponIndex].aboveHand) {
      Ar(R.weapons[e.weaponIndex], T.weaponVariants[e.weaponVariant].src, e.scale, 0, t);
      if (R.weapons[e.weaponIndex].projectile != null && !R.weapons[e.weaponIndex].hideProjectile) {
        Zn(e.scale, 0, R.projectiles[R.weapons[e.weaponIndex].projectile], M);
      }
    }
    if (e.buildIndex >= 0) {
      const r = Ss(R.list[e.buildIndex]);
      t.drawImage(r, e.scale - R.list[e.buildIndex].holdOffset, -r.width / 2);
    }
    Q(0, 0, e.scale, t);
    if (e.skinIndex > 0) {
      t.rotate(Math.PI / 2);
      _o(e.skinIndex, t, null, e);
    }
  }
  const Mr = {},
    Er = {};
  let De;
  function _o(e, t, i, s) {
    if (De = Mr[e], !De) {
      const r = new Image();
      r.onload = function () {
        this.isLoaded = !0, this.onload = null;
      }, r.src = "./img/hats/hat_" + e + ".png", Mr[e] = r, De = r;
    }
    let n = i || Er[e];
    if (!n) {
      for (let r = 0; r < Xt.length; ++r) if (Xt[r].id == e) {
        n = Xt[r];
        break;
      }
      Er[e] = n;
    }
    De.isLoaded && t.drawImage(De, -n.scale / 2, -n.scale / 2, n.scale, n.scale), !i && n.topSprite && (t.save(), t.rotate(s.skinRot), _o(e + "_top", t, n, s), t.restore());
  }
  const Pr = {},
    Cr = {};
  function zf(e, t, i) {
    if (De = Pr[e], !De) {
      const n = new Image();
      n.onload = function () {
        this.isLoaded = !0, this.onload = null;
      }, n.src = "./img/accessories/access_" + e + ".png", Pr[e] = n, De = n;
    }
    let s = Cr[e];
    if (!s) {
      for (let n = 0; n < Gt.length; ++n) if (Gt[n].id == e) {
        s = Gt[n];
        break;
      }
      Cr[e] = s;
    }
    De.isLoaded && (t.save(), t.translate(-20 - (s.xOff || 0), 0), s.spin && t.rotate(i.skinRot), t.drawImage(De, -(s.scale / 2), -(s.scale / 2), s.scale, s.scale), t.restore());
  }
  var jn = {};
  function Ar(e, t, i, s, n) {
    const r = e.src + (t || "");
    let o = jn[r];
    o || (o = new Image(), o.onload = function () {
      this.isLoaded = !0;
    }, o.src = "./img/weapons/" + r + ".png", jn[r] = o), o.isLoaded && n.drawImage(o, i + e.xOff - e.length / 2, s + e.yOff - e.width / 2, e.length, e.width);
  }
  const Dr = {};
  function Hf(e) {
    const t = e.y >= T.mapScale - T.snowBiomeTop ? 2 : e.y <= T.snowBiomeTop ? 1 : 0,
      // biomeID
      i = e.type + "_" + e.scale + "_" + t;
    let s = Dr[i];
    if (!s) {
      const r = document.createElement("canvas");
      r.width = r.height = e.scale * 2.1 + Xe;
      const o = r.getContext("2d");
      if (o.translate(r.width / 2, r.height / 2), o.rotate(C.randFloat(0, Math.PI)), o.strokeStyle = ei, o.lineWidth = Xe, e.type == 0) {
        let l;
        for (var n = 0; n < 2; ++n) l = y.scale * (n ? 0.5 : 1), Ie(o, y.sid % 2 === 0 ? 5 : 7, l, l * 0.7), o.fillStyle = t ? n ? "#fff" : "#e3f1f4" : n ? "#b4db62" : "#9ebf57", o.fill(), n || o.stroke();
      } else if (e.type == 1) {
        if (t == 2) o.fillStyle = "#606060", Ie(o, 6, e.scale * 0.3, e.scale * 0.71), o.fill(), o.stroke(), o.fillStyle = "#89a54c", Q(0, 0, e.scale * 0.55, o), o.fillStyle = "#a5c65b", Q(0, 0, e.scale * 0.3, o, !0);else {
          Uf(o, 6, y.scale, y.scale * 0.7), o.fillStyle = t ? "#e3f1f4" : "#89a54c", o.fill(), o.stroke(), o.fillStyle = t ? "#6a64af" : "#c15555";
          let l;
          const c = 4,
            a = Ze / c;
          for (var n = 0; n < c; ++n) l = C.randInt(y.scale / 3.5, y.scale / 2.3), Q(l * Math.cos(a * n), l * Math.sin(a * n), C.randInt(10, 12), o);
        }
      } else (e.type == 2 || e.type == 3) && (o.fillStyle = e.type == 2 ? t == 2 ? "#938d77" : "#939393" : "#e0c655", Ie(o, 3, e.scale, e.scale), o.fill(), o.stroke(), o.fillStyle = e.type == 2 ? t == 2 ? "#b2ab90" : "#bcbcbc" : "#ebdca3", Ie(o, 3, e.scale * 0.55, e.scale * 0.65), o.fill());
      s = r, Dr[i] = s;
    }
    return s;
  }
  function Or(e, t, i) {
    const s = e.lineWidth || 0;
    i /= 2, e.beginPath();
    let n = Math.PI * 2 / t;
    for (let r = 0; r < t; r++) e.lineTo(i + (i - s / 2) * Math.cos(n * r), i + (i - s / 2) * Math.sin(n * r));
    e.closePath();
  }
  function Ff() {
    const t = T.volcanoScale * 2,
      i = document.createElement("canvas");
    i.width = t, i.height = t;
    const s = i.getContext("2d");
    s.strokeStyle = "#3e3e3e", s.lineWidth = Xe * 2, s.fillStyle = "#7f7f7f", Or(s, 10, t), s.fill(), s.stroke(), Me.land = i;
    const n = document.createElement("canvas"),
      r = T.innerVolcanoScale * 2;
    n.width = r, n.height = r;
    const o = n.getContext("2d");
    o.strokeStyle = ei, o.lineWidth = Xe * 1.6, o.fillStyle = "#f54e16", o.strokeStyle = "#f56f16", Or(o, 10, r), o.fill(), o.stroke(), Me.lava = n;
  }
  Ff();
  const Rr = [];
  function Ss(e, t) {
    let i = Rr[e.id];
    if (!i || t) {
      const c = document.createElement("canvas");
      c.width = c.height = e.scale * 2.5 + Xe + (R.list[e.id].spritePadding || 0);
      const a = c.getContext("2d");
      a.translate(c.width / 2, c.height / 2);
      a.rotate(t ? 0 : Math.PI / 2);
      a.strokeStyle = ei;
      a.lineWidth = Xe * (t ? c.width / 81 : 1);
      if (e.name == "apple") {
        a.fillStyle = "#c15555";
        Q(0, 0, e.scale, a);
        a.fillStyle = "#89a54c";
        const u = -(Math.PI / 2);
        Vf(e.scale * Math.cos(u), e.scale * Math.sin(u), 25, u + Math.PI / 2, a);
      } else if (e.name == "cookie") {
        a.fillStyle = "#cca861";
        Q(0, 0, e.scale, a);
        a.fillStyle = "#937c4b";
        var s = 4;
        var n = Ze / s;
        var r;
        for (var o = 0; o < s; ++o) {
          r = C.randInt(e.scale / 2.5, e.scale / 1.7);
          Q(r * Math.cos(n * o), r * Math.sin(n * o), C.randInt(4, 5), a, true);
        }
      } else if (e.name == "cheese") {
        a.fillStyle = "#f4f3ac";
        Q(0, 0, e.scale, a);
        a.fillStyle = "#c3c28b";
        var s = 4;
        var n = Ze / s;
        var r;
        for (var o = 0; o < s; ++o) {
          r = C.randInt(e.scale / 2.5, e.scale / 1.7);
          Q(r * Math.cos(n * o), r * Math.sin(n * o), C.randInt(4, 5), a, true);
        }
      } else if (e.name == "wood wall" || e.name == "stone wall" || e.name == "castle wall") {
        a.fillStyle = e.name == "castle wall" ? "#83898e" : e.name == "wood wall" ? "#a5974c" : "#939393";
        const u = e.name == "castle wall" ? 4 : 3;
        Ie(a, u, e.scale * 1.1, e.scale * 1.1);
        a.fill();
        a.stroke();
        a.fillStyle = e.name == "castle wall" ? "#9da4aa" : e.name == "wood wall" ? "#c9b758" : "#bcbcbc";
        Ie(a, u, e.scale * 0.65, e.scale * 0.65);
        a.fill();
      } else if (e.name == "spikes" || e.name == "greater spikes" || e.name == "poison spikes" || e.name == "spinning spikes") {
        a.fillStyle = e.name == "poison spikes" ? "#7b935d" : "#939393";
        var l = e.scale * 0.6;
        Ie(a, e.name == "spikes" ? 5 : 6, e.scale, l);
        a.fill();
        a.stroke();
        a.fillStyle = "#a5974c";
        Q(0, 0, l, a);
        a.fillStyle = "#c9b758";
        Q(0, 0, l / 2, a, true);
      } else if (e.name == "windmill" || e.name == "faster windmill" || e.name == "power mill") {
        a.fillStyle = "#a5974c";
        Q(0, 0, e.scale, a);
        a.fillStyle = "#c9b758";
        En(0, 0, e.scale * 1.5, 29, 4, a);
        a.fillStyle = "#a5974c";
        Q(0, 0, e.scale * 0.5, a);
      } else if (e.name == "mine") {
        a.fillStyle = "#939393";
        Ie(a, 3, e.scale, e.scale);
        a.fill();
        a.stroke();
        a.fillStyle = "#bcbcbc";
        Ie(a, 3, e.scale * 0.55, e.scale * 0.65);
        a.fill();
      } else if (e.name == "sapling") {
        for (var o = 0; o < 2; ++o) {
          var l = e.scale * (o ? 0.5 : 1);
          Ie(a, 7, l, l * 0.7);
          a.fillStyle = o ? "#b4db62" : "#9ebf57";
          a.fill();
          if (!o) {
            a.stroke();
          }
        }
      } else if (e.name == "pit trap") {
        a.fillStyle = "#a5974c";
        Ie(a, 3, e.scale * 1.1, e.scale * 1.1);
        a.fill();
        a.stroke();
        a.fillStyle = ei;
        Ie(a, 3, e.scale * 0.65, e.scale * 0.65);
        a.fill();
      } else if (e.name == "boost pad") {
        a.fillStyle = "#7e7f82";
        kt(0, 0, e.scale * 2, e.scale * 2, a);
        a.fill();
        a.stroke();
        a.fillStyle = "#dbd97d";
        Lf(e.scale * 1, a);
      } else if (e.name == "turret") {
        a.fillStyle = "#a5974c";
        Q(0, 0, e.scale, a);
        a.fill();
        a.stroke();
        a.fillStyle = "#939393";
        kt(0, -25, e.scale * 0.9, 50, a);
        Q(0, 0, e.scale * 0.6, a);
        a.fill();
        a.stroke();
      } else if (e.name == "platform") {
        a.fillStyle = "#cebd5f";
        const p = e.scale * 2;
        const h = p / 4;
        let m = -(e.scale / 2);
        for (var o = 0; o < 4; ++o) {
          kt(m - h / 2, 0, h, e.scale * 2, a);
          a.fill();
          a.stroke();
          m += p / 4;
        }
      } else if (e.name == "healing pad") {
        a.fillStyle = "#7e7f82";
        kt(0, 0, e.scale * 2, e.scale * 2, a);
        a.fill();
        a.stroke();
        a.fillStyle = "#db6e6e";
        En(0, 0, e.scale * 0.65, 20, 4, a, true);
      } else if (e.name == "spawn pad") {
        a.fillStyle = "#7e7f82";
        kt(0, 0, e.scale * 2, e.scale * 2, a);
        a.fill();
        a.stroke();
        a.fillStyle = "#71aad6";
        Q(0, 0, e.scale * 0.6, a);
      } else if (e.name == "blocker") {
        a.fillStyle = "#7e7f82";
        Q(0, 0, e.scale, a);
        a.fill();
        a.stroke();
        a.rotate(Math.PI / 4);
        a.fillStyle = "#db6e6e";
        En(0, 0, e.scale * 0.65, 20, 4, a, true);
      } else if (e.name == "teleporter") {
        a.fillStyle = "#7e7f82";
        Q(0, 0, e.scale, a);
        a.fill();
        a.stroke();
        a.rotate(Math.PI / 4);
        a.fillStyle = "#d76edb";
        Q(0, 0, e.scale * 0.5, a, true);
      }
      i = c;
      if (!t) {
        Rr[e.id] = i;
      }
    }
    return i;
  }
  var objSprites = [];
  function getObjSprite(obj, asIcon) {
    var tmpSprite = objSprites[obj.id + (E && obj.owner && E.sid != y.owner.sid && !findAllianceBySid(y.owner.sid) && (y.dmg || y.trap) ? 50 : 0)];
    if (!tmpSprite || asIcon) {
      var tmpCanvas = document.createElement("canvas");
      tmpCanvas.width = tmpCanvas.height = obj.scale * 2.5 + Xe + (R.list[obj.id].spritePadding || 0);
      var tmpContext = tmpCanvas.getContext("2d");
      tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
      tmpContext.rotate(Math.PI / 2);
      tmpContext.strokeStyle = ei;
      tmpContext.lineWidth = Xe;
      if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
        tmpContext.fillStyle = obj.name == "poison spikes" ? "#7b935d" : "#939393";
        var tmpScale = obj.scale * 0.6;
        Ie(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#a5974c";
        Q(0, 0, tmpScale, tmpContext);
        tmpContext.fillStyle = "#cc5151";
        Q(0, 0, tmpScale / 2, tmpContext, true);
      } else if (obj.name == "pit trap") {
        tmpContext.fillStyle = "#a5974c";
        Ie(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#cc5151";
        Ie(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
        tmpContext.fill();
      }
      tmpSprite = tmpCanvas;
      if (!asIcon) {
        //                    if (notOwnerShip) {
        //                        objSprites[obj.id] = tmpObjSprite;
        //                    } else {
        objSprites[obj.id + (E && obj.owner && E.sid != y.owner.sid && !findAllianceBySid(y.owner.sid) && (y.dmg || y.trap) ? 50 : 0)] = tmpSprite; //                    }
      }
    }
    return tmpSprite;
  }
  function Vf(e, t, i, s, n) {
    const r = e + i * Math.cos(s);
    const o = t + i * Math.sin(s);
    const l = i * 0.4;
    n.moveTo(e, t);
    n.beginPath();
    n.quadraticCurveTo((e + r) / 2 + l * Math.cos(s + Math.PI / 2), (t + o) / 2 + l * Math.sin(s + Math.PI / 2), r, o);
    n.quadraticCurveTo((e + r) / 2 - l * Math.cos(s + Math.PI / 2), (t + o) / 2 - l * Math.sin(s + Math.PI / 2), e, t);
    n.closePath();
    n.fill();
    n.stroke();
  }
  function Q(e, t, i, s, n, r) {
    s = s || M;
    s.beginPath();
    s.arc(e, t, i, 0, 2 * Math.PI);
    if (!r) {
      s.fill();
    }
    if (!n) {
      s.stroke();
    }
  }
  function Ie(e, t, i, s) {
    let n = Math.PI / 2 * 3;
    let r;
    let o;
    const l = Math.PI / t;
    e.beginPath();
    e.moveTo(0, -i);
    for (let c = 0; c < t; c++) {
      r = Math.cos(n) * i;
      o = Math.sin(n) * i;
      e.lineTo(r, o);
      n += l;
      r = Math.cos(n) * s;
      o = Math.sin(n) * s;
      e.lineTo(r, o);
      n += l;
    }
    e.lineTo(0, -i);
    e.closePath();
  }
  function kt(e, t, i, s, n, r) {
    n.fillRect(e - i / 2, t - s / 2, i, s);
    if (!r) {
      n.strokeRect(e - i / 2, t - s / 2, i, s);
    }
  }
  function En(e, t, i, s, n, r, o) {
    r.save();
    r.translate(e, t);
    n = Math.ceil(n / 2);
    for (let l = 0; l < n; l++) {
      kt(0, 0, i * 2, s, r, o);
      r.rotate(Math.PI / n);
    }
    r.restore();
  }
  function Uf(e, t, i, s) {
    let n = Math.PI / 2 * 3;
    const r = Math.PI / t;
    let o;
    e.beginPath();
    e.moveTo(0, -s);
    for (let l = 0; l < t; l++) {
      o = C.randInt(i + 0.9, i * 1.2);
      e.quadraticCurveTo(Math.cos(n + r) * o, Math.sin(n + r) * o, Math.cos(n + r * 2) * s, Math.sin(n + r * 2) * s);
      n += r * 2;
    }
    e.lineTo(0, -s);
    e.closePath();
  }
  function Lf(e, t) {
    t = t || M;
    const i = e * (Math.sqrt(3) / 2);
    t.beginPath();
    t.moveTo(0, -i / 2);
    t.lineTo(-e / 2, i / 2);
    t.lineTo(e / 2, i / 2);
    t.lineTo(0, -i / 2);
    t.fill();
    t.closePath();
  }
  function Nf() {
    const e = T.mapScale / 2;
    ue.add(0, e, e + 200, 0, T.treeScales[3], 0);
    ue.add(1, e, e - 480, 0, T.treeScales[3], 0);
    ue.add(2, e + 300, e + 450, 0, T.treeScales[3], 0);
    ue.add(3, e - 950, e - 130, 0, T.treeScales[2], 0);
    ue.add(4, e - 750, e - 400, 0, T.treeScales[3], 0);
    ue.add(5, e - 700, e + 400, 0, T.treeScales[2], 0);
    ue.add(6, e + 800, e - 200, 0, T.treeScales[3], 0);
    ue.add(7, e - 260, e + 340, 0, T.bushScales[3], 1);
    ue.add(8, e + 760, e + 310, 0, T.bushScales[3], 1);
    ue.add(9, e - 800, e + 100, 0, T.bushScales[3], 1);
    ue.add(10, e - 800, e + 300, 0, R.list[4].scale, R.list[4].id, R.list[10]);
    ue.add(11, e + 650, e - 390, 0, R.list[4].scale, R.list[4].id, R.list[10]);
    ue.add(12, e - 400, e - 450, 0, T.rockScales[2], 2);
  } // ANTI TRAP:
  let earlyAutoBreak = {
    start: false
  };
  function antiTrap(aim) {
    if (getEl("antitrap").checked) {
      if (tmpObjDist(nearDist, E) <= 250) {
        for (let i = -45; i <= 45; i += 90) {
          checkPlace(2, aim + toRad(i) + Math.PI);
        }
      } else if (tmpObjDist(nearDist, E) <= 600) {
        for (let i = -45; i <= 45; i += 90) {
          if (enemyCount.length) {
            checkPlace(4, aim + toRad(i) + Math.PI);
          }
        }
      }
    }
  }
  let loadObjects = [];
  function qf(e) {
    for (var i = 0; i < e.length;) {
      ue.add(e[i], e[i + 1], e[i + 2], e[i + 3], e[i + 4], e[i + 5], R.list[e[i + 6]], true, e[i + 7] >= 0 ? {
        sid: e[i + 7]
      } : null);
      if (e[i + 6] == 15 && Math.hypot(e[i + 2] - E.y2, e[i + 1] - E.x2) <= 60 && E.sid != e[i + 7] && !findAllianceBySid(e[i + 7])) {
        antiTrap(e[i + 1], e[i + 2]);
        trapSid = e[i];
        hitCount = 0;
        buyEquip(6, 0);
      }
      if (e[i + 7] && e[i + 6] && (R.list[e[i + 6]].dmg || R.list[e[i + 6]].trap || R.list[e[i + 6]].teleport) && E.sid == e[i + 7]) {
        loadObjects.push(e);
      }
      i += 8;
    }
  }
  function antiSyncHealing(timearg) {
    antiSync = true;
    let healAnti = setInterval(() => {
      if (E.shameCount < 5) {
        place(0, vs());
      }
    }, 75);
    setTimeout(() => {
      clearInterval(healAnti);
      setTimeout(() => {
        antiSync = false;
      }, 1000 / 9);
    }, 1000 / 9 * timearg);
  }
  function Wf(angle, t) {
    y = Ho(t);
    if (y) {
      y.xWiggle += T.gatherWiggle * Math.cos(angle);
      y.yWiggle += T.gatherWiggle * Math.sin(angle);
    }
  }
  function Xf(e, t) {
    y = Ho(e);
    if (y) {
      y.dir = t;
      y.xWiggle += T.gatherWiggle * Math.cos(t + Math.PI);
      y.yWiggle += T.gatherWiggle * Math.sin(t + Math.PI);
    }
  } // ADD PROJECTILE:
  let doSync = false;
  let antiSync = false;
  let runAtNextTick = [];
  let rangeBackup = [];
  function Gf(x, y, dir, range, speed, indx, layer, sid, original) {
    if (ds) {
      po.addProjectile(x, y, dir, range, speed, indx, null, null, layer).sid = sid;
    }
    runAtNextTick.push(Array.prototype.slice.call(arguments));
  }
  function checkProjectileHolder(x, y, dir, range, speed, indx, layer, sid) {
    let weaponIndx = indx == 0 ? 9 : indx == 2 ? 12 : indx == 3 ? 13 : indx == 5 && 15;
    let projOffset = T.playerScale * 2;
    let projXY = {
      x: indx == 1 ? x : x - projOffset * Math.cos(dir),
      y: indx == 1 ? y : y - projOffset * Math.sin(dir)
    };
    let fixXY = function (tmpObj) {
      return {
        x2: C.fixTo(tmpObj.x2, 2),
        y2: C.fixTo(tmpObj.y2, 2)
      };
    };
    let nearPlayer = J.filter(e => e.visible && C.getDist(projXY, e, 0, 2) <= e.scale).sort(function (a, b) {
      return C.getDist(projXY, a, 0, 2) - C.getDist(projXY, b, 0, 2);
    })[0];
    if (nearPlayer) {
      nearPlayer.projDist = C.getDist(projXY, nearPlayer, 0, 2);
      if (indx == 1) {
        nearPlayer.shooting[53] = 1;
        nearPlayer.tR = Math.ceil(2500 / 100);
      } else {
        nearPlayer.shootIndex = weaponIndx;
        nearPlayer.shooting[1] = 1;
        nearPlayer.sR = Math.ceil(R.weapons[weaponIndx].speed / 100);
        antiBulletSupportmentsEasyGamer69Proe(nearPlayer, dir, range, speed, indx, weaponIndx);
      }
    }
  }
  let projectileCount = 0;
  function antiBulletSupportmentsEasyGamer69Proe(tmpObj, dir, range, speed, index, weaponIndex) {
    if (!isTeam(tmpObj)) {
      lr = C.getDirect(E, tmpObj, 2, 2);
      if (C.getAngleDist(lr, dir) <= 0.2) {
        tmpObj.bowThreat[weaponIndex]++;
        if (index == 5) {
          projectileCount++;
        }
        setTimeout(() => {
          tmpObj.bowThreat[weaponIndex]--;
          if (index == 5) {
            projectileCount--;
          }
        }, range / speed);
        if (tmpObj.bowThreat[9] >= 1 && (tmpObj.bowThreat[12] >= 1 || tmpObj.bowThreat[15] >= 1) && getEl("backUpRAnti").checked) {
          place(1, tmpObj.aim2);
          if (!antiSync) {
            anti0Tick = 4;
            if (getEl("combat").value != "2") {
              ee.send("6", "range");
              setTimeout(() => {
                ee.send("6", "is homo");
              }, 2000);
            } else {
              ee.send("6", "range detect");
            }
            if (getEl("combat").value == "2") {
              ee.send("6", "sync is homo");
            }
            antiSyncHealing(4);
          }
        } else {
          if (projectileCount >= 2) {
            place(1, tmpObj.aim2);
            anti0Tick = 4;
            if (!antiSync) {
              antiSyncHealing(4);
            }
          }
        }
      }
    }
  }
  function Yf(e, t) {
    for (let i = 0; i < Mt.length; ++i) {
      if (Mt[i].sid == e) {
        Mt[i].range = t;
      }
    }
  }
  function $f(e) {
    y = zo(e);
    if (y) {
      y.startAnim();
    }
  }
  function Kf(e) {
    for (var t = 0; t < ye.length; ++t) {
      ye[t].forcePos = !ye[t].visible;
      ye[t].visible = false;
    }
    if (e) {
      const i = Date.now();
      for (var t = 0; t < e.length;) {
        y = zo(e[t]);
        if (y) {
          y.index = e[t + 1];
          y.t1 = y.t2 === undefined ? i : y.t2;
          y.t2 = i;
          y.x1 = y.x;
          y.y1 = y.y;
          y.x2 = e[t + 2];
          y.y2 = e[t + 3];
          y.d1 = y.d2 === undefined ? e[t + 4] : y.d2;
          y.d2 = e[t + 4];
          y.health = e[t + 5];
          y.dt = 0;
          y.visible = true;
        } else {
          y = ar.spawn(e[t + 2], e[t + 3], e[t + 4], e[t + 1]);
          y.x2 = y.x;
          y.y2 = y.y;
          y.d2 = y.dir;
          y.health = e[t + 5];
          if (!ar.aiTypes[e[t + 1]].name) {
            y.name = T.cowNames[e[t + 6]];
          }
          y.forcePos = true;
          y.sid = e[t];
          y.visible = true;
        }
        t += 7;
      }
    }
  }
  const _r = {};
  function Jf(e, t) {
    const i = e.index;
    let s = _r[i];
    if (!s) {
      const n = new Image();
      n.onload = function () {
        this.isLoaded = !0, this.onload = null;
      }, n.src = "./img/animals/" + e.src + ".png", s = n, _r[i] = s;
    }
    if (s.isLoaded) {
      const n = e.scale * 1.2 * (e.spriteMlt || 1);
      t.drawImage(s, -n, -n, n * 2, n * 2);
    }
  }
  function isOnScreen(e, t, i) {
    return e + i >= 0 && e - i <= maxScreenWidth && t + i >= 0 && t - i <= maxScreenHeight;
  }
  let configs = {
    weaponCode: 0,
    antiBull: 0,
    antiBull2: 0,
    waitHit: false
  };
  function place(id, radian) {
    try {
      var item = R.list[E.items[id]];
      if (E.itemCounts[item.group.id] == undefined ? true : E.itemCounts[item.group.id] < (T.isSandbox ? id === 3 || id === 5 ? 299 : 99 : item.group.limit ? item.group.limit : 99)) {
        Yt(E.items[id]);
        hit(radian);
        selectWeapon(configs.weaponCode, true);
      }
    } catch (e) {}
  }
  function rp(id, radian) {
    try {
      var item = R.list[E.items[id]];
      var tmpS = E.scale + item.scale + (item.placeOffset || 0);
      var tmpX = E.x2 + tmpS * Math.cos(radian);
      var tmpY = E.y2 + tmpS * Math.sin(radian);
      if (E.itemCounts[item.group.id] == undefined ? true : E.itemCounts[item.group.id] < (T.isSandbox ? id === 3 || id === 5 ? 299 : 99 : item.group.limit ? item.group.limit : 99)) {
        Yt(E.items[id]);
        hit(radian);
        selectWeapon(configs.weaponCode, true);
      }
    } catch (e) {}
  }
  function checkPlace(id, radian) {
    try {
      var item = R.list[E.items[id]];
      var tmpS = E.scale + item.scale + (item.placeOffset || 0);
      var tmpX = E.x2 + tmpS * Math.cos(radian);
      var tmpY = E.y2 + tmpS * Math.sin(radian);
      if (ue.checkItemLocation(tmpX, tmpY, item.scale, 0.6, item.id, false, E)) {
        if (E.itemCounts[item.group.id] == undefined ? true : E.itemCounts[item.group.id] < (T.isSandbox ? id === 3 || id === 5 ? 299 : 99 : item.group.limit ? item.group.limit : 99)) {
          Yt(E.items[id]);
          hit(radian);
          selectWeapon(configs.weaponCode, true);
        }
      }
    } catch (e) {}
  } // AUTO PLACE:
  var place2 = false;
  var nearTrapped = false;
  function autoPlace() {
    if (secPacket < secMax && minPacket < minMax) {
      let nearObj = [];
      let randomDir = Math.random() * Math.PI * 2;
      if (et.length && enemyCount.length) {
        let nears = {
          x: nearDist.x2,
          y: nearDist.y2,
          inTrap: false
        };
        nearObj = et.filter(e => e.trap).sort(function (a, b) {
          return objDist(a, nears) - objDist(b, nears);
        })[0];
        if (nearObj) {
          if (!(E.sid != nearObj.owner.sid && !findAllianceBySid(nearObj.owner.sid)) && objDist(nearObj, nears) <= 65 && nearObj.active) {
            nears.inTrap = true;
            nearTrapped = true;
          } else {
            nears.inTrap = false;
            nearTrapped = false;
          }
          if (T.isSandbox) {
            if (tmpObjDist(nearDist, E) <= 350) {
              if (nears.inTrap && nearTrapped) {
                if (T.isSandbox) {
                  for (let i = 0; i < Math.PI * 2; i += Math.PI / 1.5) {
                    checkPlace(2, nearAim + i);
                  }
                }
              } else {
                if (E.items[4] == 15) {
                  checkPlace(4, nearAim);
                }
              }
            }
          } else {
            if (tmpObjDist(nearDist, E) <= 300) {
              if (nears.inTrap && nearTrapped) {
                for (let i = Math.PI / 1.5; i < Math.PI * 2; i += Math.PI / 1.5) {
                  checkPlace(2, nearAim + i);
                }
              } else {
                if (E.items[4] == 15) {
                  checkPlace(4, nearAim);
                }
              }
            }
          }
        } else {
          if (enemyCount.length) {
            if (tmpObjDist(nearDist, E) <= 350) {
              if (E.items[4] == 15) {
                if (T.isSandbox) {
                  if (getEl("autoq").checked) {
                    checkPlace(4, randomDir);
                  } else {
                    for (let i = 0; i < Math.PI * 2; i += Math.PI / 1.5) {
                      checkPlace(4, randomDir + i);
                    }
                  }
                } else {
                  checkPlace(4, nearAim);
                }
              }
            }
          }
        }
      }
    }
  }
  let biomeG = getEl("visualtype").value == "2" ? true : false; // ADD NEW PLAYER:
  var isReloaded = true;
  var waitHit = false;
  var gathers = 0;
  var inTrap = false;
  var nearInTrap;
  var trapSid = undefined;
  var trapAim = 0;
  var turretInRange = [];
  var antiTick = false;
  var oneTick = false;
  var oneTicking = false;
  var isOnetick = false;
  var doTick = false;
  var canTick = false;
  var boostOneTick = false;
  var boostOneTicking = false;
  var doBoostTick = false;
  var canBoostTick = false;
  var lessMoveDir = undefined;
  function Qf(e, t) {
    let i = nu(e[0]);
    i || (i = new _c(e[0], e[1], T, C, po, ue, J, ye, R, Xt, Gt), J.push(i)), i.spawn(t ? xi : null), i.visible = !1, i.x2 = void 0, i.y2 = void 0, i.pR = 0;
    i.sR = 0;
    i.tR = 0;
    i.setData(e), t && (E = i, Re = E.x, _e = E.y, To(), Do(), Ro(), Oo(0), us.style.display = "block");
  } // GET ANGLE / LOCATION:
  function objDist(a, b) {
    return Math.hypot(a.y - b.y, a.x - b.x);
  }
  function tmpObjDist(a, b) {
    return Math.hypot(a.y2 - b.y2, a.x2 - b.x2);
  }
  function objLoc(a, b) {
    return Math.atan2(a.y - b.y, a.x - b.x);
  }
  function tmpObjLoc(a, b) {
    return Math.atan2(a.y2 - b.y2, a.x2 - b.x2);
  }
  function dist(a, b) {
    return Math.hypot((a.y2 || a.y) - (b.y2 || b.y), (a.x2 || a.x) - (b.x2 || b.x));
  }
  function Zf(e) {
    for (let t = 0; t < J.length; t++) if (J[t].id == e) {
      J.splice(t, 1);
      break;
    }
  }
  function jf(e, t) {
    E && (E.itemCounts[e] = t);
  }
  function eu(e, t, i) {
    E && (E[e] = t, i && Do());
  } // ADVANCED:
  function applCxC(value) {
    if (E.health == 100) return 0;
    if (E.skinIndex != 45 && E.skinIndex != 56) {
      return Math.ceil(value / R.list[E.items[0]].healing);
    }
    return 0;
  }
  let judgeAtNextTick = false;
  let doEmpAntiInsta = false;
  var waitCounter = false;
  function updateHealth(sid, health) {
    y = _i(sid);
    if (y) {
      let tmpHealth = y.health;
      y.health = health;
      if (tmpHealth < y.health) {
        if (y.hitTime) {
          let timeSinceHit = Date.now() - y.hitTime;
          let tmpShame = y.shameCount;
          let tickiy = ticks.time.filter(e => e == "lag");
          let pingSince = Math.max(120, window.pingTime);
          y.hitTime = 0;
          if (timeSinceHit <= (tickiy.length >= 2 ? 120 : 120)) {
            y.shameCount += 1;
            if (insta) {
              y.healSid = Math.min(3, y.healSid + 1);
              if (y != E && y.shameCount >= 5) {
                insta;
              }
            }
            if (y.shameCount > y.maxShame) {
              y.maxShame = y.shameCount;
            }
          } else {
            y.shameCount = Math.max(0, y.shameCount - 2);
            if (insta) {
              y.healSid = Math.max(-1, y.healSid - 1);
            }
          }
          if (y != E) {
            if (tmpShame < y.shameCount) {
              insta;
            }
          } else {
            healLag = timeSinceHit - window.pingTime;
          }
        }
      } else if (tmpHealth > y.health) {
        y.hitTime = Date.now();
        y.hitted = true;
        y.damaged = true;
        let damage = tmpHealth - y.health;
        if (y.skinIndex == 7 && (damage == 5 || y.tailIndex == 13 && damage == 2)) {
          y.bTick = ticks.tick;
          if (y == E) {
            reSyncBull = false;
          }
        } //console.log(damage);
        if (y == E) {
          autoHealer(y, damage);
        }
      }
    }
  }
  window.fps = 0;
  let millC = {
    x: undefined,
    y: undefined,
    size: function (size) {
      return size * 1.45;
    },
    dist: function (size) {
      return size * 1.8;
    },
    active: T.isSandbox ? true : false,
    count: 0
  };
  let canInsta = false;
  let isShield = false;
  function checkTotalDamage(nobull) {
    let turret = enemyCount.length ? nearDist.skinIndex != 22 && E.skins[53] && E.tR == 0 : E.skins[53] && E.tR == 0 ? true : false;
    let bull = E.skins[7] && !nobull ? true : false;
    let near = enemyCount.length && nearDist.skinIndex == 6 ? true : false;
    let pvv = E.primaryVariant == 0 ? 1 : E.primaryVariant == 1 ? 1.1 : E.primaryVariant >= 2 ? 1.18 : 1;
    let svv = E.secondaryVariant == 0 ? 1 : E.secondaryVariant == 1 ? 1.1 : E.secondaryVariant >= 2 ? 1.18 : 1;
    if (E.pR == 0 && E.sR == 0 && E.weapons[0] != undefined && E.weapons[1] != undefined) {
      if (turret) {
        if (bull) {
          return (near ? 0.75 : 1) * (R.weapons[E.weapons[0]].dmg * pvv * 1.5 + (E.weapons[1] == 10 || E.weapons[1] == 14 ? R.weapons[E.weapons[1]].dmg * svv : R.weapons[E.weapons[1]].Pdmg) + 25);
        } else {
          return (near ? 0.75 : 1) * (R.weapons[E.weapons[0]].dmg * pvv + (E.weapons[1] == 10 || E.weapons[1] == 14 ? R.weapons[E.weapons[1]].dmg * svv : R.weapons[E.weapons[1]].Pdmg) + 25);
        }
      } else {
        if (bull) {
          return (near ? 0.75 : 1) * (R.weapons[E.weapons[0]].dmg * pvv * 1.5 + (E.weapons[1] == 10 || E.weapons[1] == 14 ? R.weapons[E.weapons[1]].dmg * svv : R.weapons[E.weapons[1]].Pdmg));
        } else {
          return (near ? 0.75 : 1) * (R.weapons[E.weapons[0]].dmg * pvv + (E.weapons[1] == 10 || E.weapons[1] == 14 ? R.weapons[E.weapons[1]].dmg * svv : R.weapons[E.weapons[1]].Pdmg));
        }
      }
    } else {
      if (E.pR == 0 && E.weapons[0] != undefined) {
        if (turret) {
          if (bull) {
            return (near ? 0.75 : 1) * (R.weapons[E.weapons[0]].dmg * pvv * 1.5 + 25);
          } else {
            return (near ? 0.75 : 1) * (R.weapons[E.weapons[0]].dmg * pvv + 25);
          }
        } else {
          if (bull) {
            return (near ? 0.75 : 1) * (R.weapons[E.weapons[0]].dmg * pvv * 1.5);
          } else {
            return (near ? 0.75 : 1) * (R.weapons[E.weapons[0]].dmg * pvv);
          }
        }
      } else if (E.sR == 0 && E.weapons[1] != undefined) {
        if (turret) {
          return (near ? 0.75 : 1) * ((E.weapons[1] == 10 || E.weapons[1] == 14 ? R.weapons[E.weapons[1]].dmg * svv : R.weapons[E.weapons[1]].Pdmg) + 25);
        } else {
          return (near ? 0.75 : 1) * (E.weapons[1] == 10 || E.weapons[1] == 14 ? R.weapons[E.weapons[1]].dmg * svv : R.weapons[E.weapons[1]].Pdmg);
        }
      } else {
        if (turret) {
          return (near ? 0.75 : 1) * 25;
        } else {
          return 0;
        }
      }
    }
  } // UPDATE PLAYER DATA:
  var enemyCount = [];
  var nearDist = [];
  var nearEnemy = [];
  var nearAim = 0;
  var tickCount = 0;
  var tickLow = [];
  var oldXY = {
    x2: undefined,
    y2: undefined
  };
  let stopHealing = false;
  function healIntrap(tmpObj, value) {
    let pH = function () {
      return Math.max(0, 180 - window.pingTime);
    };
    let normalMS = 70;
    let goodMS = 125;
    if (true) {
      setTickout(() => {
        for (let i = 0; i < applCxC(value); i++) {
          place(0, vs());
        }
      }, 2);
    } else {
      setTickout(() => {
        for (let i = 0; i < applCxC(value); i++) {
          place(0, vs());
        }
      }, 2);
    }
  }
  let backupAnti = [];
  let hittedTime = Date.now();
  function autoHealer(tmpObj, value) {
    let pH = function () {
      return Math.max(0, 175 - window.pingTime);
    };
    let tickCount = 0;
    let normalMS = 70;
    let goodMS = 125;
    let antiInsta = false;
    let findAttacker = undefined;
    if (true) {
      if (tmpObjDist(nearDist, E) <= 300) {
        if (value >= 20 && (Date.now() - hittedTime >= 180 || Date.now() - hittedTime <= 60)) {
          if (tmpObj.shameCount < tmpObj.dangerShame) {
            for (let i = 0; i < applCxC(value); i++) {
              place(0, vs());
              if (Date.now() - hittedTime >= 260) {
                place(0, vs());
              }
            }
            if (value >= 70) {
              const heal = () => {
                let times = E.items[0] === 1 ? 3 : 4;
                for (let i = 0; i < times; i++) place(0, vs());
              };
              const slowHeal = () => {
                setTimeout(() => {
                  heal();
                }, pH());
              };
              slowHeal();
            }
          } else {
            setTickout(() => {
              for (let i = 0; i < applCxC(value); i++) {
                place(0, vs());
              }
            }, 2);
          }
        } else {
          if (inTrap) {
            healIntrap(tmpObj, value);
          } else {
            setTickout(() => {
              for (let i = 0; i < applCxC(value); i++) {
                place(0, vs());
              }
            }, 2);
          }
        }
        if (E.skinIndex == 11) {
          if (value >= 30) {
            waitCounter = true;
          }
        }
        if (value >= 20) {
          hittedTime = Date.now();
          judgeAtNextTick = true;
        }
      } else {
        if (inTrap) {
          healIntrap(tmpObj, value);
        } else {
          setTickout(() => {
            for (let i = 0; i < applCxC(value); i++) {
              place(0, vs());
            }
          }, 2);
        }
      }
    }
  }
  let ticks = {
    tick: 0,
    delay: 0,
    time: [],
    manage: []
  };
  let nb = {
    x: 0,
    y: 0
  };
  let nw = {
    x: 0,
    y: 0
  };
  let autospin = false;
  function isTeam(tmpObj) {
    return tmpObj == E || tmpObj.team && tmpObj.team == E.team;
  }
  let autoBullSpam = false;
  let turretEmp = 0;
  let waitTicks = [];
  let anti0Tick = 0;
  let syncCount = 0;
  let nerdChat = ["Don't care", "didin't ask", "cry about it", "stay mad", "get real", "L", "mad seethe cope harder", "hoes mad", "basic", "skill issue", "ratio", "you fell off", "the audacity", "triggered", "any askers", "replled", "get a life", "ok and?", "cringe", "touch grass", "donowalled", "not based", "not funny didn’t laugh", "*you're", "grammar issues", "go outside", "get good", "reported", "ad hominem", "GG!", "ask deez", "ez clap", "straight cash", "ratio again", "final ratio", "problematic", "furry lover", "retard"];
  let nerdSpam = false;
  let randomDir = Math.random() * Math.PI * 2;
  let trap1 = et.filter(e => e.trap && e.active).sort(function (a, b) {
    return Math.hypot(a.y - E.y2, a.x - E.x2) - Math.hypot(b.y - E.y2, b.x - E.x2);
  })[0];
  function updatePlayers(e) {
    enemyCount = [];
    nearDist = [];
    nearEnemy = [];
    nearAim = 0;
    ticks.tick++;
    ticks.time.push(Date.now() - ticks.delay <= 50 || Date.now() - ticks.delay >= 175 ? "lag" : 1);
    if (ticks.tick % 10 === 0) {
      ticks.time = [];
    }
    if (ticks.tick % 300 === 0) {}
    ticks.delay = Date.now();
    const t = Date.now();
    for (var i = 0; i < J.length; ++i) {
      J[i].forcePos = !J[i].visible;
      J[i].visible = false;
    }
    for (var i = 0; i < e.length;) {
      y = _i(e[i]);
      if (y) {
        y.t1 = y.t2 === undefined ? t : y.t2;
        y.t2 = t;
        y.x1 = y.x;
        y.y1 = y.y;
        y.x2 = e[i + 1];
        y.y2 = e[i + 2];
        y.moveAngle = Math.atan2(y.y - y.y2, y.x - y.x2);
        y.moveSpeed = Math.hypot(y.y1 - y.y2, y.x1 - y.x2);
        y.aim2 = C.getDirect(y, E, 2, 2);
        y.dist2 = C.getDist(y, E, 2, 2);
        y.aim3 = C.getDirect(y, E, 3, 3);
        y.dist3 = C.getDist(y, E, 3, 3);
        y.d1 = y.d2 === undefined ? e[i + 3] : y.d2;
        y.d2 = e[i + 3];
        y.dt = 0;
        y.buildIndex = e[i + 4];
        y.weaponIndex = e[i + 5];
        y.weaponVariant = e[i + 6];
        y.team = e[i + 7];
        y.isLeader = e[i + 8];
        y.skinIndex = e[i + 9];
        y.tailIndex = e[i + 10];
        y.iconIndex = e[i + 11];
        y.zIndex = e[i + 12];
        y.visible = true;
        y.isAlly = y == E || y.team && y.team === E.team;
        y.primaryReloadCount = undefined != y.primaryIndex ? (Math.ceil(R.weapons[y.primaryIndex].speed / 100) - (y.pR < 0 ? 0 : y.pR)) / Math.ceil(R.weapons[y.primaryIndex].speed / 100) : 1;
        y.secondaryReloadCount = undefined != y.secondaryIndex ? (Math.ceil(R.weapons[y.secondaryIndex].speed / 100) - (y.sR < 0 ? 0 : y.sR)) / Math.ceil(R.weapons[y.secondaryIndex].speed / 100) : 1;
        if (!(y == E || y.team && y.team == E.team)) {
          enemyCount.push(y);
          if (tmpObjDist(y, E) <= 300) {
            nearEnemy.push(y);
          }
        }
        if (y == E) {
          y.syncThreats = 0;
          y.primaryIndex = y.weapons[0];
          y.secondaryIndex = y.weapons[1];
          (!millC.x || !oldXY.x) && (millC.x = oldXY.x = y.x2);
          (!millC.y || !oldXY.y) && (millC.y = oldXY.y = y.y2);
        }
        if (y.weaponIndex < 9) {
          if (y != E) {
            y.primaryIndex = y.weaponIndex;
          }
          y.primaryVariant = y.weaponVariant;
        } else if (y.weaponIndex > 8) {
          if (y != E) {
            y.secondaryIndex = y.weaponIndex;
          }
          y.secondaryVariant = y.weaponVariant;
        }
        updateWeaponData(y);
      }
      i += 13;
    }
    nearEnemy.forEach(e => {
      if (e.primaryIndex != undefined && e.pR == 0 && e.primaryIndex != undefined && e.pR == 0) {
        E.syncThreats++;
      }
    });
    if (E.syncThreats >= 2 && !antiSync && getEl("antiTurretSync").checked) {
      antiSyncHealing(3);
    } // PLACES:
    if (places.slot0) {
      place(0, vs());
    } else if (places.slot2) {
      place(2, vs());
    } else if (places.slot4) {
      place(4, vs());
    } else if (places.slot5) {
      place(5, vs());
    }
    myConfig.x = E.x2;
    myConfig.y = E.y2;
    if (ticks.tick % 24 === 0) {
      myConfig.sync = true;
    } else {
      myConfig.sync = false;
    }
    if (enemyCount.length) {
      nearDist = enemyCount.sort(function (a, b) {
        return tmpObjDist(a, E) - tmpObjDist(b, E);
      })[0];
    }
    nearAim = enemyCount.length ? tmpObjLoc(nearDist, E) : vs();
    let getAngleDst = function (a, b) {
      let p = Math.abs(b - a) % (Math.PI * 2);
      return p > Math.PI ? Math.PI * 2 - p : p;
    };
    if (judgeAtNextTick) {
      judgeAtNextTick = false;
      if (enemyCount.length && nearDist.reloads[53] <= 1000 / 9 && nearDist.secondaryIndex != 10 && nearDist.secondaryIndex != 11 && nearDist.secondaryIndex != 14) {
        doEmpAntiInsta = true;
      }
    }
    /*
                                               if (Hn.stack.length) {
                                           let stacks = [];
                                           let notstacks = [];
                                           let num = 0;
                                           let num2 = 0;
                                           let pos = {
                                               x: null,
                                               y: null
                                           };
                                           let pos2 = {
                                               x: null,
                                               y: null
                                           }
                                           Hn.stack.forEach((text) => {
                                               if (text.value >= 0) {
                                                   if (num == 0) pos = {
                                                       x: text.x,
                                                       y: text.y
                                                   };
                                                   num += Math.abs(text.value);
                                               } else {
                                                   if (num2 == 0) pos2 = {
                                                       x: text.x,
                                                       y: text.y
                                                   };
                                                   num2 += Math.abs(text.value);
                                               }
                                           });
                                           if (num2 > 0) {
                                               Hn.showText(pos2.x, pos2.y, 50, 0.18, 500, num2, "#8ecc51");
                                           }
                                           if (num > 0) {
                                               Hn.showText(pos.x, pos.y, 50, 0.18, 500, num, "#fff");
                                           }
                                           Hn.stack = [];
                                       }
                                       */ // RELOADS:
    if (!spikeTick && !insta && E.weapons[1] && !clicks.left && !clicks.right && !clicks.middle && !inTrap && !waitSpikeTick && !waitCounter && !autoBullSpam && getEl("autoreload").checked) {
      if ((E.weapons[0] == 3 || E.weapons[0] == 4 || E.weapons[0] == 5) && (E.weapons[1] == 10 || E.weapons[1] == 14)) {
        if (E.pR == 0 && E.sR > 0) {
          if (!autos.reloaded) {
            autos.reloaded = true;
            if (E.weaponIndex != E.weapons[1]) {
              selectWeapon(E.weapons[1]);
            }
          }
          if (!autos.stopspin) {
            setTimeout(() => {
              autos.stopspin = true;
            }, 400);
          }
        } else {
          autos.reloaded = false;
          autos.stopspin = false;
          if (E.pR > 0) {
            if (E.weaponIndex != E.weapons[0]) {
              selectWeapon(E.weapons[0]);
            }
          } else if (E.pR == 0 && E.sR > 0) {
            if (E.weaponIndex != E.weapons[1]) {
              selectWeapon(E.weapons[1]);
            }
          }
        }
      } else {
        if (E.pR == 0 && E.sR > 0) {
          if (!autos.reloaded) {
            autos.reloaded = true;
            if (E.weaponIndex != E.weapons[0]) {
              selectWeapon(E.weapons[0]);
            }
          }
          if (!autos.stopspin) {
            setTimeout(() => {
              autos.stopspin = true;
            }, 400);
          }
        } else {
          autos.reloaded = false;
          autos.stopspin = false;
          if (E.sR > 0) {
            if (E.weaponIndex != E.weapons[1]) {
              selectWeapon(E.weapons[1]);
            }
          } else if (E.sR == 0 && E.pR > 0) {
            if (E.weaponIndex != E.weapons[0]) {
              selectWeapon(E.weapons[0]);
            }
          }
        }
      }
    }
    if (waitCounter) {
      waitCounter = false;
      if (!insta) {
        sendCounterCode();
      }
    }
    turretInRange = et.filter(e => e.name == "turret" && E.sid != e.owner.sid && !findAllianceBySid(e.owner.sid) && objDist(e, E) <= 700 && e.active);
    isShield = nearDist.weaponIndex == 11 && getAngleDst(tmpObjLoc(nearDist, E), nearDist.d2) <= T.shieldAngle ? true : false;
    if (waitInsta) {
      if (!E.skins[7] && E.points > 6000) {
        bo(7, 0);
      } else if (!E.skins[53] && E.points > 10000) {
        bo(53, 0);
      }
    }
    if ((checkTotalDamage(true) >= 100 ? checkTotalDamage(true) : checkTotalDamage(false)) >= (E.weapons[1] == 10 ? 95 : 100) && enemyCount.length && waitInsta && !insta && !configs.waitHit && tmpObjDist(nearDist, E) < R.weapons[E.weapons[1] == 10 ? E.weapons[1] : E.weapons[0]].range + 63 && E.pR == 0 && E.sR == 0 && E.tR == 0 && !isShield) {
      canInsta = true;
    } else {
      canInsta = false;
    }
    if (canInsta) {
      waitInsta = false;
      sendInstaCode();
    } else if (!oneTicking && enemyCount.length && !insta && tmpObjDist(nearDist, E) <= R.weapons[E.weapons[0]].range + E.scale * 1.8 && E.sR == 0 && getEl("autoBullSpam").checked && !inTrap) {
      if (!insta && !clicks.middle && !clicks.left && !clicks.right) {
        autoBullSpam = true;
        if (E.weaponIndex != E.weapons[0]) {
          selectWeapon(E.weapons[0]);
        }
        if (E.pR == 0 && !configs.waitHit) {
          aimToNear = true;
          configs.waitHit = true;
          bf();
          setTickout(() => {
            bf();
            configs.waitHit = false;
          }, 1);
        }
      }
    } else {
      aimToNear = false;
      autoBullSpam = false;
    } // TIMEOUT:
    if (ticks.manage[ticks.tick]) {
      ticks.manage[ticks.tick].forEach(doit => {
        doit();
      });
    }
    if (waitSpikeTick) {
      waitSpikeTick = false;
      if (!insta) {
        doSpikeTick();
      }
    }
    if (et.length) {
      let trap1 = et.filter(e => e.trap && e.active).sort(function (a, b) {
        return Math.hypot(a.y - E.y2, a.x - E.x2) - Math.hypot(b.y - E.y2, b.x - E.x2);
      })[0];
      if (trap1) {
        trapAim = Math.atan2(trap1.y - E.y2, trap1.x - E.x2);
        if (E.sid != trap1.owner.sid && !findAllianceBySid(trap1.owner.sid) && Math.hypot(trap1.y - E.y2, trap1.x - E.x2) - 46 <= 0) {
          inTrap = true;
          if (!spikeTick && !insta && !clicks.middle && !clicks.left && !clicks.right && !autoBullSpam) {
            if (E.weaponIndex != E.weapons[1] == 10 ? E.weapons[1] : E.weapons[0]) {
              selectWeapon(trap1.health > R.weapons[E.weapons[0]].dmg && E.weapons[1] == 10 ? E.weapons[1] : E.weapons[0]);
            }
            if ((E.weapons[1] == 10 ? E.sR : E.pR) == 0 && !configs.waitHit) {
              configs.waitHit = true;
              ee.send("K", 1);
              setTickout(() => {
                ee.send("K", 1);
                configs.waitHit = false;
              }, 1);
            }
          }
        } else {
          inTrap = false;
        }
      }
    }
    if (y) {
      if (waitTicks.length) {
        waitTicks.forEach(ajaj => {
          ajaj();
        });
        waitTicks = [];
      }
      if (runAtNextTick.length) {
        runAtNextTick.forEach(tmp => {
          checkProjectileHolder(...tmp);
        });
        runAtNextTick = [];
      }
      syncCount = 0;
      if (y.doTickUpdate) {
        y.doTickUpdate = false;
      }
      if (y.pCount > -1) {
        if ((ticks.tick - y.bTick) % T.serverUpdateRate === 0) {
          y.pCount--;
        }
      }
      if (y.shooting[53]) {
        y.shooting[53] = 0;
        y.reloads[53] = 2500 - 1000 / 9;
        y.oldReloads[53] = y.reloads[53];
        if (!isTeam(y) && tmpObjDist(y, E) <= 175 && tmpObjDist(y, E) >= 275 && (y.primaryIndex == 4 || y.primaryIndex == 5) && y.reloads[y.weapons[0]] == 0 && y.primaryVariant >= 2 && y.shooting[53]) {
          anti0Tick = 2;
          antiTick = true;
        }
      } else {
        if (y.reloads[53] > 0) {
          y.reloads[53] = Math.max(0, y.reloads[53] - 1000 / 9);
          if (y.reloads[53] <= 0) {
            let tmp = y;
            tmp.turretReloaded = true;
            setTickout(() => {
              tmp.turretReloaded = false;
            }, 1);
          }
        }
      }
      y.oldReloads[y.primaryIndex == undefined ? y.weaponIndex : y.primaryIndex] = y.reloads[y.primaryIndex == undefined ? y.weaponIndex : y.primaryIndex];
      y.oldReloads[y.secondaryIndex == undefined ? y.weaponIndex : y.secondaryIndex] = y.reloads[y.secondaryIndex == undefined ? y.weaponIndex : y.secondaryIndex];
      if (y.gathering || y.shooting[1]) {
        if (y.gathering) {
          y.gathering = 0;
          y.reloads[y.gatherIndex] = R.weapons[y.gatherIndex].speed * (y.skinIndex == 20 ? 0.78 : 1);
          y.oldReloads[y.gatherIndex] = y.reloads[y.gatherIndex];
        }
        if (y.shooting[1]) {
          y.shooting[1] = 0;
          y.reloads[y.shootIndex] = R.weapons[y.shootIndex].speed * (y.skinIndex == 20 ? 0.78 : 1);
          y.oldReloads[y.shootIndex] = y.reloads[y.shootIndex];
          if (y != E && E.team && y.team == E.team && E.weapons[1] == 15 && y.shootIndex == 15) {
            syncCount++;
          }
        }
      } else {
        if (y.buildIndex < 0) {
          if (y.reloads[y.weaponIndex] > 0) {
            y.reloads[y.weaponIndex] = Math.max(0, y.reloads[y.weaponIndex] - 1000 / 9);
            if (y.weaponIndex == y.primaryIndex) {
              if (y.pR <= 0) {
                if (y == E) {
                  configs.antiBull2++;
                  setTickout(() => {
                    configs.antiBull2--;
                  }, 1);
                } else {
                  if (!isTeam(y) && tmpObjDist(y, E) <= R.weapons[y.primaryIndex ? y.primaryIndex : 5].range + E.scale * 1.8 + window.pingTime / 2) {
                    configs.antiBull++;
                    setTickout(() => {
                      configs.antiBull--;
                    }, 1);
                  }
                }
              }
            }
          }
        }
      }
    } // ONE TICK CODE FR:
    if (oneTick && !isPress && !inTrap) {
      if (enemyCount.length) {
        let eDist = tmpObjDist(nearDist, E);
        let nDist = nearAim;
        let dist = R.weapons[E.weapons[0]].range * 1.8;
        let rDist = nearAim + Math.PI;
        oneTicking = true;
        if (E.tailIndex != 0) {
          Jn(0, 1);
        } // dist - near.scale
        if (eDist < dist - 40) {
          canTick = false;
          biomeGear();
          if (lessMoveDir != rDist) {
            lessMoveDir = rDist;
            ee.send("a", rDist);
          }
          if (-1 != E.buildIndex) {
            selectWeapon(E.weapons[1]);
          }
        } else if (eDist >= dist - 35 && eDist < dist - 10) {
          canTick = false;
          eDist < dist - 15 ? 22 : 40, 0;
          if (lessMoveDir != rDist) {
            lessMoveDir = rDist;
            ee.send("a", rDist);
          }
          if (E.items[1] != E.buildIndex) {
            Yt(E.items[1]);
          }
        } else if (eDist > dist + 10 && eDist < dist + 40) {
          canTick = false;
          if (eDist > dist + 15) {
            buyEquip(22, 0);
          } else {
            buyEquip(40, 0);
          }
          if (lessMoveDir != nDist) {
            lessMoveDir = nDist;
            ee.send("a", nDist);
          }
          if (E.items[1] != E.buildIndex) {
            Yt(E.items[1]);
          }
        } else if (eDist > dist + 40) {
          canTick = false;
          biomeGear();
          if (lessMoveDir != nDist) {
            lessMoveDir = nDist;
            ee.send("a", nDist);
          }
          if (-1 != E.buildIndex) {
            selectWeapon(E.weapons[1]);
          }
        } else if (eDist >= dist - 10 && eDist <= dist + 10) {
          if (canTick && E.pR == 0 && E.tR == 0 && nearDist.skinIndex != 22 && nearDist.skinIndex != 6 && E.tR == 0 && E.skins[53]) {
            sendTickCode();
          } else {
            canTick = true;
            if (E.skinIndex != 0) {
              Jn(0, 0);
            }
            if (lessMoveDir != undefined) {
              lessMoveDir = undefined;
              ee.send("a", undefined);
            }
          }
        }
      } else {
        canTick = false;
        oneTicking = false;
      }
    } else {
      canTick = false;
      oneTicking = false;
    } // ONE TICK CODE FR:
    if (boostOneTick && !isPress && !inTrap) {
      if (enemyCount.length) {
        let dist = (E.weapons[1] == 9 ? 365 : E.weapons[1] == 12 ? 380 : E.weapons[1] == 13 ? 390 : E.weapons[1] == 15 ? 365 : 370) - 55;
        let eDist = tmpObjDist(nearDist, E);
        let nDist = nearAim;
        let rDist = nearAim + Math.PI;
        oneTicking = true;
        if (eDist < dist - 40) {
          canBoostTick = false;
          biomeGear();
          if (lessMoveDir != rDist) {
            lessMoveDir = rDist;
            ee.send("a", rDist);
          }
          if (-1 != E.buildIndex) {
            selectWeapon(E.weapons[0]);
          }
        } else if (eDist >= dist - 40 && eDist < dist - 10) {
          buyEquip(eDist < dist - 15 ? 22 : 40, 0);
          if (lessMoveDir != rDist) {
            lessMoveDir = rDist;
            ee.send("a", rDist);
          }
          if (E.items[1] != E.buildIndex) {
            Yt(E.items[1]);
          }
        } else if (eDist > dist + 10 && eDist < dist + 40) {
          canBoostTick = false;
          if (eDist > dist + 15) {
            buyEquip(22, 0);
          } else {
            buyEquip(40, 0);
          }
          if (E.items[1] != E.buildIndex) {
            Yt(E.items[1]);
          }
          if (lessMoveDir != nDist) {
            lessMoveDir = nDist;
            ee.send("a", nDist);
          }
        } else if (eDist >= dist + 40) {
          canBoostTick = false;
          biomeGear();
          if (lessMoveDir != nDist) {
            lessMoveDir = nDist;
            ee.send("a", nDist);
          }
          if (-1 != E.buildIndex) {
            selectWeapon(E.weapons[0]);
          }
        } else if (eDist >= dist - 10 && eDist <= dist + 10) {
          if (canBoostTick) {
            sendBoostTickCode();
          } else {
            canBoostTick = true;
            if (E.skinIndex != 0) {
              Jn(0, 0);
            }
            if (lessMoveDir != undefined) {
              lessMoveDir = undefined;
              ee.send("a", undefined);
            }
          }
        }
      } else {
        canBoostTick = false;
        oneTicking = false;
      }
    } else {
      canBoostTick = false;
      oneTicking = false;
    }
    let rangeInsta = false;
    if (tickLow[tickCount]) {
      tickLow[tickCount].forEach(e => e());
    }
    if (getEl("plc1").checked && !inTrap && !canInsta && !insta && !spikeTick && !waitSpikeTick && !isOnetick && !rangeInsta) {
      autoPlace();
    } // INSTAS:
    if (syncCount >= 1 && getEl("teamsync").checked) {
      doSync = true;
    }
    if (clicks.middle || doSync) {
      if (doSync) {
        doSync = false;
      }
      if (!insta && !canInsta && E.sR == 0) {
        rangeType();
      }
    }
    if (!inTrap && !rangeInsta && (clicks.left || clicks.right) && !insta && !canInsta) {
      if (E.weaponIndex != (clicks.right && E.weapons[1] == 10) ? E.weapons[1] : E.weapons[0]) {
        selectWeapon(clicks.right && E.weapons[1] == 10 ? E.weapons[1] : E.weapons[0]);
      }
    } // EXTRA:
    if (We.style.display != "block" && !insta) {
      // Wow This Is Real Left Right:
      if (clicks.left || clicks.right) {
        changeHat("click");
        changeAcc("click");
      } else {
        if (inTrap) {
          changeHat("trap");
          changeAcc("trap");
        } else {
          changeHat("normal");
          changeAcc("normal");
        }
      }
    } // SEND DIR:
    if (!places.slot0 && !places.slot2 && !places.slot4 && !places.slot5) {
      let atckDir = vs();
      if (E.dir !== atckDir) {
        lessDir = atckDir;
        ee.send("D", atckDir);
      }
    }
    if (anti0Tick > 0) {
      anti0Tick--;
    }
    if (doEmpAntiInsta) {
      doEmpAntiInsta = false;
    }
    if (y.primaryIndex == 5 && y.primaryVariant >= 2 && tmpObjDist(nearDist, E) >= 155 && tmpObjDist(nearDist, E) <= 275) {
      anti0Tick = 2;
    }
    try {
      // AUTO MILL CODE :
      let objectSize = millC.size(R.list[E.items[3]].scale);
      let objectDist = millC.dist(R.list[E.items[3]].scale);
      if (millC && C.getDist(millC, E, 0, 2) > objectDist + R.list[E.items[3]].placeOffset) {
        if (millC.active) {
          let plusXY = {
            x: millC.x,
            y: millC.y
          };
          let Boom = C.getDirect(plusXY, E, 0, 2);
          checkPlace(3, Boom + toRad(objectSize));
          checkPlace(3, Boom - toRad(objectSize));
          checkPlace(3, Boom);
          millC.count = Math.max(0, millC.count - 1);
          oldXY.x = E.x2;
          oldXY.y = E.y2;
        }
        millC.x = E.x2;
        millC.y = E.y2;
      }
    } catch (e) {}
  }
  function setTickout(doo, timeout) {
    if (!ticks.manage[ticks.tick + timeout]) {
      ticks.manage[ticks.tick + timeout] = [doo];
    } else {
      ticks.manage[ticks.tick + timeout].push(doo);
    }
  } // UPDATE WEAPON DATA:
  function updateWeaponData(tmpObj) {
    if (tmpObj == E) {
      tmpObj.primaryIndex = tmpObj.weapons[0];
      tmpObj.secondaryIndex = tmpObj.weapons[1];
    }
    if (tmpObj.weaponIndex < 9) {
      if (tmpObj != E) {
        tmpObj.primaryIndex = tmpObj.weaponIndex;
      }
      tmpObj.primaryVariant = tmpObj.weaponVariant;
      if (tmpObj.weaponIndex == tmpObj.primaryIndex) {
        if (tmpObj.buildIndex < 0) {
          tmpObj.pR = Math.max(0, tmpObj.pR - 1);
        }
      }
    } else if (tmpObj.weaponIndex > 8) {
      if (tmpObj != E) {
        tmpObj.secondaryIndex = tmpObj.weaponIndex;
      }
      tmpObj.secondaryVariant = tmpObj.weaponVariant;
      if (tmpObj.weaponIndex == tmpObj.secondaryIndex) {
        if (tmpObj.buildIndex < 0) {
          tmpObj.sR = Math.max(0, tmpObj.sR - 1);
        }
      }
    }
    tmpObj.tR = Math.max(0, tmpObj.tR - 1);
  }
  function isClanMember(sid) {
    if (E && E.sid == sid) return true;
    if (!E || !E.team || sid < 0) return false;
    for (var i = 0; i < wt.length; i += 2) {
      let allySid = wt[i];
      if (sid == allySid) return true;
    }
    return false;
  }
  function nu(e) {
    for (let t = 0; t < J.length; ++t) if (J[t].id == e) return J[t];
    return null;
  }
  function _i(e) {
    for (let t = 0; t < J.length; ++t) if (J[t].sid == e) return J[t];
    return null;
  }
  function zo(e) {
    for (let t = 0; t < ye.length; ++t) if (ye[t].sid == e) return ye[t];
    return null;
  }
  function Ho(e) {
    for (let t = 0; t < et.length; ++t) if (et[t].sid == e) return et[t];
    return null;
  }
  function findAllianceBySid(sid) {
    return E.team ? wt.find(THIS => THIS === sid) : null;
  }
  let Fo = -1;
  function su() {
    let pingDisplay = document.getElementById("pingDisplay");
    const ping = Date.now() - Fo;
    if (pingDisplay.parentNode.id === "mainMenu") {
      pingDisplay.remove();
      document.body.insertAdjacentHTML("beforeend", pingDisplay.outerHTML);
      pingDisplay = document.getElementById("pingDisplay");
    }
    window.pingTime = ping;
    if (ping > maxPing || maxPing == 0) {
      maxPing = ping;
    }
    if (ping < minPing || minPing == 0) {
      minPing = ping;
    }
    pingDisplay.style.left = getEl("visualtype").value == "2" ? "94px" : "50px";
    pingDisplay.style.textAlign = "center";
    pingDisplay.style.pointerEvets = "none";
    pingDisplay.style.zIndex = 1;
    pingDisplay.style.top = getEl("visualtype").value == "2" ? "10px" : "20px";
    if (getEl("visualtype").value == "2") {
      pingDisplay.innerHTML = `Ping: ${ping} ms / © King Hans`;
    } else {
      pingDisplay.innerHTML = `Ping: ${ping} ms`;
    }
    if (getEl("visualtype").value != "1") {
      pingDisplay.style.display = "block";
    } else {
      pingDisplay.style.display = "none";
    }
  }
  let Pn;
  function Vo() {
    Pn && clearTimeout(Pn), cs() && (Fo = Date.now(), ee.send("0")), Pn = setTimeout(Vo, 2500);
  }
  function ru(e) {
    if (e < 0) return;
    const t = Math.floor(e / 60);
    let i = e % 60;
    i = ("0" + i).slice(-2), dr.innerText = "Server restarting in " + t + ":" + i, dr.hidden = !1;
  }
  window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (e) {
      setTimeout(() => {}, 1000 / 111);
    };
  }();
  if (GM_info.script.author !== "_VcrazY_") {
    var newPage = document.createElement("html");
    newPage.innerHTML = '<head><title>Anti Skid</title><style>body { margin: 0; padding: 0; width: 100vw; height: 100vh; overflow: hidden; }</style></head><body><h1>Why did you want to skid me? In reality its annoying (if you want to use the script you have to change the author to "_VcrazY_")</h1></body>';
    document.documentElement.innerHTML = newPage.innerHTML;
  } // Initialization
  function Uo() {
    It = Date.now(), be = It - or, or = It, Of(), requestAnimFrame(Uo);
  }
  Nf();
  Uo();
  function Lo(e) {
    window.open(e, "_blank");
  }
  window.openLink = Lo;
  window.aJoinReq = Gn;
  window.follmoo = Bh;
  window.kickFromClan = ko;
  window.sendJoin = vo;
  window.leaveAlliance = xo;
  window.createAlliance = Yn;
  window.storeBuy = bo;
  window.storeEquip = Jn;
  window.showItemInfo = Se;
  window.selectSkinColor = mf;
  window.changeStoreIndex = cf;
  window.config = T;
  window.FRVR && window.FRVR.bootstrapper.complete();
  function changeCom() {
    me.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
    if (getEl("visualtype").value == "2") {
      me.style.backgroundColor = "rgba(0, 0, 0, 0)";
    }
  }
  changeCom();
  getEl("visualtype").onchange = function () {
    changeCom(true);
    this.blur();
  };
})();
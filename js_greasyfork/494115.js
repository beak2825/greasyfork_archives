// ==UserScript==
// @name         Bonk.io - Disable P2P
// @description  Disables peer-to-peer connections on bonk.io and supercarstadium.com to hide your IP address
// @version      0.6
// @author       kklkkj
// @license      MIT
// @namespace    https://github.com/kklkkj/
// @match        http*://*.hitbox.io/*
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494115/Bonkio%20-%20Disable%20P2P.user.js
// @updateURL https://update.greasyfork.org/scripts/494115/Bonkio%20-%20Disable%20P2P.meta.js
// ==/UserScript==
 
// Delete some WebRTC things in case replacing PeerJS fails
// If replacing PeerJS fails, Bonk will just show "Still waiting for P2P..."
const webrtcThings = [
  "RTCCertificate",
  "RTCDataChannel",
  "RTCIceCandidate",
  "RTCIceTransport",
  "RTCPeerConnection",
  "RTCRtpReceiver",
  "RTCSessionDescription",
  "mozRTCIceCandidate",
  "mozRTCPeerConnection",
  "mozRTCSessionDescription",
  "webkitRTCPeerConnection",
];
 
for (const t of webrtcThings) delete window[t];
 
// RequireJS loads PeerJS by appending a script to <head>, thanks to Excigma for
// some of this code
const _appendChild = document.head.appendChild;
 
document.head.appendChild = function () {
  if (arguments?.[0]?.src?.includes("peer.min.js")) {
    // Replace peer.min.js with a fake version that doesn't do anything
    arguments[0].textContent = `
 
parcelRequire = function (e, r, t, n) {
  var i,
  o = 'function' == typeof parcelRequire && parcelRequire,
  u = 'function' == typeof require && require;
  function f(t, n) {
    if (!r[t]) {
      if (!e[t]) {
        var i = 'function' == typeof parcelRequire && parcelRequire;
        if (!n && i) return i(t, !0);
        if (o) return o(t, !0);
        if (u && 'string' == typeof t) return u(t);
        var c = new Error('Cannot find module \\'' + t + '\\'');
        throw c.code = 'MODULE_NOT_FOUND',
        c
      }
      p.resolve = function (r) {
        return e[t][1][r] || r
      },
      p.cache = {
      };
      var l = r[t] = new f.Module(t);
      e[t][0].call(l.exports, p, l, l.exports, this)
    }
    return r[t].exports;
    function p(e) {
      return f(p.resolve(e))
    }
  }
  f.isParcelRequire = !0,
  f.Module = function (e) {
    this.id = e,
    this.bundle = f,
    this.exports = {
    }
  },
  f.modules = e,
  f.cache = r,
  f.parent = o,
  f.register = function (r, t) {
    e[r] = [
      function (e, r) {
        r.exports = t
      },
      {
      }
    ]
  };
  for (var c = 0; c < t.length; c++) try {
    f(t[c])
  } catch (e) {
    i || (i = e)
  }
  if (t.length) {
    var l = f(t[t.length - 1]);
    'object' == typeof exports && 'undefined' != typeof module ? module.exports = l : 'function' == typeof define && define.amd ? define(function () {
      return l
    }) : n && (this[n] = l)
  }
  if (parcelRequire = f, i) throw i;
  return f
}({
  // Deleted other properties and modified the one below
  'iTK6': [
    function (require, module, exports) {
      'use strict';
      Object.defineProperty(exports, '__esModule', {
        value: !0
      });
 
      exports.peerjs = {
        // Fake PeerJS API
        Peer: function () {
          this.destroy = function(){};
          this.on = function(eventName, callback) {
            if (eventName == "open") setTimeout(()=>{ callback("LOOL1"+Math.random().toString(36).substring(2,13)) }, 0);
          }
          this.connect = function(peerID) {
            return {
              on: function() {},
              open: false
            };
          }
      }
        // util: e.util
      },
      exports.default = exports.Peer
      window.peerjs = exports.peerjs,
      window.Peer = exports.Peer;
    },
    {}
  ]
}, {
}, [
  'iTK6'
], null)
 
    `;
    arguments[0].removeAttribute("src");
    const res = _appendChild.apply(document.head, arguments);
    arguments[0].dispatchEvent(new Event("load"));
 
    console.log("replaced peer.min.js");
    return res;
  } else return _appendChild.apply(document.head, arguments);
};
 
console.log("Disable P2P script run");
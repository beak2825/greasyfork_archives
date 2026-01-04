// ==UserScript==
// @name        删除B站登记号
// @namespace   Kill Bilibili Dengjihao
// @grant       unsafeWindow
// @version     1.0.3
// @author      yozoscript
// @description 删除B站旧番剧中，后添加的登记号
// @match       https://www.bilibili.com/bangumi/play/*
// @include     https://www.bilibili.com/bangumi/play/*
// @connect     bilibili.com
// @connect     www.bilibili.com
// @run-at      document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498407/%E5%88%A0%E9%99%A4B%E7%AB%99%E7%99%BB%E8%AE%B0%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/498407/%E5%88%A0%E9%99%A4B%E7%AB%99%E7%99%BB%E8%AE%B0%E5%8F%B7.meta.js
// ==/UserScript==

const playerId = "bilibili-player"
const playerId2 = "bpx-player-row-dm-wrap"
const dengjiClass = "bilibili-player-video-record"
const dengjiClass2 = "squirtle-record-item"
const dengjiClass3 = "bpx-player-record-item-pure"

function domChange(domId, callback, runIm) {
    // select the target node
    var target = document.getElementById(domId);
    // create an observer instance
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (callback()) callback();
        });
    });
    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true };
    // pass in the target node, as well as the observer options
    observer.observe(target, config);
    // later, you can stop observing
    //observer.disconnect();
    if (runIm && callback()) callback();
}

var exec = function () {
 'use strict';
    var aa = document.getElementById(playerId);
    if (!aa) {
      setTimeout(() => {exec()}, 100)
      return
    }
    domChange(playerId, () => {
      if (window._v_kii) {
        clearInterval(window._v_kii)
        window._v_kii = null
      }
      window._v_kii = setInterval(() => {
        var ddd = document.querySelectorAll("." + dengjiClass)
        if (ddd[0]) {
          ddd[0].remove()
          console.log("Removed 登记号")
          clearInterval(window._v_kii)
          window._v_kii = null
        }
        ddd = document.querySelectorAll("." + dengjiClass2)
        if (ddd[0]) {
          ddd[0].remove()
          console.log("Removed 登记号")
          clearInterval(window._v_kii)
          window._v_kii = null
        }
        ddd = document.querySelectorAll("." + dengjiClass3)
        if (ddd[0]) {
          ddd[0].remove()
          console.log("Removed 登记号")
          clearInterval(window._v_kii)
          window._v_kii = null
        }
      }, 100);
    }, true)

    var aa = document.getElementById(playerId2);
    if (!aa) {
      setTimeout(() => {exec()}, 100)
      return
    }
    domChange(playerId2, () => {
      if (window._v_kii) {
        clearInterval(window._v_kii)
        window._v_kii = null
      }
      window._v_kii = setInterval(() => {
        var ddd = document.querySelectorAll("." + dengjiClass)
        if (ddd[0]) {
          ddd[0].remove()
          console.log("Removed 登记号")
          clearInterval(window._v_kii)
          window._v_kii = null
        }
        ddd = document.querySelectorAll("." + dengjiClass2)
        if (ddd[0]) {
          ddd[0].remove()
          console.log("Removed 登记号")
          clearInterval(window._v_kii)
          window._v_kii = null
        }
        ddd = document.querySelectorAll("." + dengjiClass3)
        if (ddd[0]) {
          ddd[0].remove()
          console.log("Removed 登记号")
          clearInterval(window._v_kii)
          window._v_kii = null
        }
      }, 100);
    }, true)
}
onload = exec;
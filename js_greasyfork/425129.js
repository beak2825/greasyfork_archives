// ==UserScript==
// @name         Video Playback Rate Controller
// @name:cn      视频倍速控制器
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  【使用前先看介绍/有问题可反馈】视频倍速控制器 (Video Playback Rate Controller): 为视频添加倍速控制元素，通过 `Shift + @` 可以随时将控制器显示或隐藏。
// @author       cc
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425129/Video%20Playback%20Rate%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/425129/Video%20Playback%20Rate%20Controller.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var openRateControl = false
  function addRateControl () {
    var video = document.querySelector('video')
    var select = document.createElement('select')
    select.name = 'play-rate'
    for (let rate of [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 8, 16]) {
      let option = document.createElement('option')
      option.value = rate
      option.innerText = option.value + '倍速'
      select.appendChild(option)
    }
    select.onchange = function (event) {
      video.playbackRate = event.target.value
    }
    select.selectedIndex = 2
    var p = document.createElement('p')
    p.id = 'rate-control'
    p.appendChild(select)
    if (video.nextElementSibling) {
      video.parentElement.insertBefore(p, video.nextElementSibling)
    } else {
      video.parentElement.appendChild(p)
    }
  }
  function removeRateControl () {
    var p = document.getElementById('rate-control')
    if (p) p.remove()
  }
  function waitKey (key) {
    document.addEventListener('keydown', function (event) {
      if (event.key == key) {
        if (!openRateControl) {
          openRateControl = true
          addRateControl()
        } else {
          openRateControl = false
          removeRateControl()
        }
      }
    })
  }
  function run () {
    window.onload = function () {
      var video = document.querySelector('video')
      if (video) waitKey('@')
    }
  }
  run()
})();
// ==UserScript==
// @name         Randstuff.ru
// @version      0.2
// @match        *://randstuff.ru/*
// @run-at       document-end
// @grant        none
// @description  Predictable number generation for Randstuff.ru (https://randstuff.ru/number/)
// @author       Kaimi
// @homepage     https://kaimi.io/2016/01/tampering-vk-contest-results/
// @namespace    https://greasyfork.org/users/228137
// @downloadURL https://update.greasyfork.org/scripts/418965/Randstuffru.user.js
// @updateURL https://update.greasyfork.org/scripts/418965/Randstuffru.meta.js
// ==/UserScript==


var numbers = [12, 4, 1, 10]

var click = 0
$.ajaxPrefilter(
  function(options, originalOptions, jqXHR) {
    if (options && options.success) {
      var originalSuccess = options.success
      options.success = function (data) {
        if (data) {
          if (click < numbers.length) {
            data.number = numbers[click]
          }
          click++
        }
        originalSuccess(data)
      }
    }
  }
)

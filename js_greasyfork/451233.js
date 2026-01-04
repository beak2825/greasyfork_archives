// jshint esversion:6
// ==UserScript==
// @name        keep login
// @namespace   Violentmonkey Scripts
// @match       https://pchome-drawing.openlife.co/*
// @grant       none
// @version     1.0.2
// @author      -
// @description 2022/9/12 下午2:26:58
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/451233/keep%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/451233/keep%20login.meta.js
// ==/UserScript==

const RELOAD_INTERVAL = 1000 * 60 * 8; //8minutes

(function main(){
  window.addEventListener('load',() => {
      setInterval(() => window.location.reload(), RELOAD_INTERVAL)
      console.log('event listener register success')
  })
})();

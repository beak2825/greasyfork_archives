// ==UserScript==
// @name        Kioskloud Bypasser
// @namespace   kiosbypass
// @match       *://kioskloud.xyz/*
// @grant       none
// @version     1.0
// @author      -
// @description kioskloudBypasser
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447397/Kioskloud%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/447397/Kioskloud%20Bypasser.meta.js
// ==/UserScript==


const inst = "clientInstallation=true"
if(!document.cookie.includes(inst)){
  document.cookie = inst
  window.location.reload();
}
// ==UserScript==
// @name        diep multitab
// @namespace   http://tampermonkey.net
// @match       https://diep.io/*
// @grant       none
// @version     0.2
// @author      cock and ball torture
// @description lets you multitab
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/470688/diep%20multitab.user.js
// @updateURL https://update.greasyfork.org/scripts/470688/diep%20multitab.meta.js
// ==/UserScript==
(function(){
  const handler = {
    apply(ref, obj, args){
      if (args[0] == "rivet:token") {
        return null
      }
      return ref.apply(obj,args)
    }
  }
  localStorage.getItem = new Proxy(localStorage.getItem, handler)
  localStorage.setItem = new Proxy(localStorage.setItem, handler)
})()
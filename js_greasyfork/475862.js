// ==UserScript==
// @name        No Error in DevTools for Ads Block
// @namespace   UserScripts
// @match       https://*/*
// @match       http://*/*
// @exclude     *://google.com/*
// @exclude     *://*.google.com/*
// @grant       none
// @version     0.1.1
// @author      CY Fung
// @license     MIT
// @description Remove errors due to global objects not found
// @run-at      document-start
// @allFrames   true
// @unwrap
// @inject-into page
// @downloadURL https://update.greasyfork.org/scripts/475862/No%20Error%20in%20DevTools%20for%20Ads%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/475862/No%20Error%20in%20DevTools%20for%20Ads%20Block.meta.js
// ==/UserScript==

(()=>{

  const recurriver = new Proxy(function(){return recurriver}, {
    get(target, prop, handler){
      if(prop in target) return  typeof target[prop]==='function'?target[prop].bind(target): target[prop];
      return recurriver;
    }
  })

  this.google = recurriver;


})();


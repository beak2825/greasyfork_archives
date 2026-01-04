// ==UserScript==
// @name        discord bypass nsfw
// @namespace   Violentmonkey Scripts
// @match       https://discord.com/*
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@1
// @grant       none
// @version     1.0.0
// @author      chirag-droid<chirag.singla.pi@gmail.com>
// @description 3/20/2022, 4:02:41 AM
// @run-at      document-start
// @homepageURL https://github.com/chirag-droid
// @downloadURL https://update.greasyfork.org/scripts/441834/discord%20bypass%20nsfw.user.js
// @updateURL https://update.greasyfork.org/scripts/441834/discord%20bypass%20nsfw.meta.js
// ==/UserScript==


VM.observe(document.body, () => {  
  if (window.webpackChunkdiscord_app) {
      var findModule=(item)=>window.webpackChunkdiscord_app.push([[Math.random()],{},(req)=>{for(const m of Object.keys(req.c).map((x)=>req.c[x].exports).filter((x)=>x)){if(m.default&&m.default[item]!==undefined)return m.default}}])
      
      findModule('getCurrentUser').getCurrentUser().nsfwAllowed = true
      return true;
  }
})
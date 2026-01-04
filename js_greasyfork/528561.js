// ==UserScript==
// @name         chat büyüyoooooo
// @namespace    http://www.youtube.com/@newdaynewgame
// @version      2025-03-02
// @description  PC İÇİNDİR. cevap ve çizim kısmını siler ve chatin büyümesini sağlar bu sayede yazıları daha rahat okursunuz.
// @author       kangwoo
// @match        gartic.io/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/528561/chat%20b%C3%BCy%C3%BCyoooooo.user.js
// @updateURL https://update.greasyfork.org/scripts/528561/chat%20b%C3%BCy%C3%BCyoooooo.meta.js
// ==/UserScript==
GM_addStyle(`#answer,#canvas,#gartic-io_160x600,#gartic-io_160x600_2,#interaction>div.bar{display:none!important}`)
const qweqwe=new MutationObserver(function(mutations){mutations.forEach(function(){const interactionElement=document.querySelector("#interaction");if (interactionElement && !interactionElement.dataset.adjusted){interactionElement.style.marginTop="-400px";interactionElement.dataset.adjusted="true"}})});qweqwe.observe(document.body,{childList:true,subtree:true});const tools=new MutationObserver(()=>{const toolsElement=document.querySelector("#tools");if (toolsElement){toolsElement.remove()}});tools.observe(document.body,{childList:true,subtree:true});
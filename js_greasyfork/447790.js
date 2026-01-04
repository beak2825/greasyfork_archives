// ==UserScript==
// @name Fuck!n@ HTML5 Kill Autoplay
// @description I DO NOT ALLOW YOU AUTOPLAY SHIT ON MY BROWSER.
// @include       *example.com*
// // @inject-into content
// @version 0.0.1.20220714071839
// @namespace https://greasyfork.org/users/927418
// @downloadURL https://update.greasyfork.org/scripts/447790/Fuck%21n%40%20HTML5%20Kill%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/447790/Fuck%21n%40%20HTML5%20Kill%20Autoplay.meta.js
// ==/UserScript==
 
!function(){"use strict";let e=!1,t=(()=>{let e=document.createElement("iframe"),t={};try{e.sandbox="allow-same-origin",document.documentElement.insertBefore(e,document.documentElement.firstChild);for(let n of Object.getOwnPropertyNames(e.contentWindow))try{t[n]=e.contentWindow[n].prototype}catch(e){}return t}finally{document.documentElement.removeChild(e)}})(),n=function(e,n){let r=e.__proto__;try{return e.__proto__=t[r.constructor.name],n(e)}finally{e.__proto__=r}},r=function(e){let t={};for(let n in e)try{e[n]instanceof Function&&(t[n]={override:function(r){return e[n]=r(e[n]),t}})}catch(r){t[n]={property:function({getter:r,setter:o=(()=>{})}){return Object.defineProperty(e,n,{get:r,configurable:!1,enumerable:!0,set:o}),t},constant:function(r){return Object.defineProperty(e,n,{value:r,configurable:!1,enumerable:!0}),t}}}return t},o=function(e){for(let t of e.getElementsByTagName("video"))t.pause()};i=document,u="click",c=(t=>{e=!0}),i.addEventListener(u,(()=>{let e=t=>{t.isTrusted&&(i.removeEventListener(u,e),c(t))};return e})()),r(window.HTMLMediaElement.prototype).play.override(t=>(function(){try{return t.apply(this)}finally{e||this.pause()}})).autoplay.property({getter:function(){return n(this,e=>e.autoplay)}}),r(window.Element.prototype).innerHTML.property({getter:function(){return n(this,e=>e.innerHTML)},setter:function(e){n(this,t=>{t.innerHTML=e}),o(this)}}),document.addEventListener("DOMContentLoaded",e=>{o(document)},{once:!0});var i,u,c}();


(function main() {
  'use strict';
 
  const log = (...args) => console.log(`${GM.info.script.name}:`, ...args);
  log('start');
 
  const root = document.querySelector('ytd-page-manager');
  if (!root) return log('root node not found, exit');
 
  { // try to prevent autoplay w/o observer
    const video = root.querySelector('ytd-channel-video-player-renderer')?.querySelector('video');
    if (video) {
      video.addEventListener('loadstart', (e) => e.target.pause(), { passive: true });
      return log('channel video autoplay prevented w/o observer');
    }
  }
 
  const observer = new MutationObserver((mutationsList) => {
    const channelRenderer = root.querySelector('ytd-channel-video-player-renderer');
    mutationsList.some((mutationRecord) => {
      if (!mutationRecord.target.classList.contains('html5-video-container')) return false;
      return Array.from(mutationRecord.addedNodes).some((node) => {
        if (node.nodeName === 'VIDEO') {
          log('video captured');
          if (channelRenderer?.contains(node)) {
            observer.disconnect();
            node.addEventListener('loadstart', (e) => e.target.pause(), { passive: true });
            log('channel video autoplay prevented');
          }
        }
      });
    });
  });
  observer.observe(root, { childList: true, subtree: true });
  return log('observer observe');
}());
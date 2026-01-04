// ==UserScript==
// @name         video-injector
// @namespace    https://transpiria.com
// @version      1.0.4
// @description  Injects a standard video container in place of proprietary containers.
// @author       tasadar2
// @include      https://www.boundhub.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461564/video-injector.user.js
// @updateURL https://update.greasyfork.org/scripts/461564/video-injector.meta.js
// ==/UserScript==

(()=>{"use strict";({484:function(e,t){var n=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(i,s){function r(e){try{c(o.next(e))}catch(e){s(e)}}function a(e){try{c(o.throw(e))}catch(e){s(e)}}function c(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,a)}c((o=o.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.VideoInjector=void 0;class o{constructor(){this.beginInjection()}beginInjection(){if(this.isValidUrl(location.pathname)){let e;const t=document.getElementsByClassName("player-holder")[0];if(t&&this.isVideoContentSettable(t)&&(e=this.getVideoId(t),e)){const n=this.getDomain();this.getVideoMetadata(n,e).then((n=>this.setVideoContent(t,e,n.resolvedVideoUrl)))}e||setTimeout((()=>this.beginInjection()),333)}}getDomain(){const e=location.hostname.split(".");return e[e.length-2]}isValidUrl(e){return e.includes("/videos/")||e.includes("/playlists/")}isVideoContentSettable(e){return e.getElementsByClassName("player-wrap").length>0||e.getElementsByClassName("no-player").length>0}getVideoId(e){const t=e.getElementsByTagName("img");for(const e of t){const t=/\/videos_screenshots\/\d+\/(\d+)\//.exec(e.src);return t?Number.parseInt(t[1]):void 0}}setVideoContent(e,t,n){const o=document.createElement("video");o.title=`${t}.mp4`,o.controls=!0,o.style.width="100%";const i=o.appendChild(document.createElement("source"));i.src=n,i.type="video/mp4",e.replaceWith(o)}getVideoMetadata(e,t){return n(this,void 0,void 0,(function*(){return new Promise((n=>{fetch(`https://transpiria.com/api/${e}/videos/${t}`).then((e=>{e.ok&&e.json().then((e=>n(e)))}))}))}))}}t.VideoInjector=o,new o}})[484](0,{})})();

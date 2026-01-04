/*! For license information please see 巨量下载.user.js.LICENSE.txt */
// ==UserScript==
// @name         巨量下载
// @namespace    http://tampermonkey.net/
// @version      1.2.12816619
// @description  巨量广告视频下载
// @author       抖音兔不迟到
// @run-at       document-start
// @license      MIT License
// @grant        GM_invokeFn
// @include      *://cc.oceanengine.com/*
// @inject-into  page
// @require      https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.18.0/js/md5.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.7.2/jquery.min.js
// @dev          9999
// @downloadURL https://update.greasyfork.org/scripts/435619/%E5%B7%A8%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/435619/%E5%B7%A8%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
const metaCache={};var origOpen=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(){(arguments[1].indexOf("creative_radar_api/v1/material/info")>-1||arguments[1].indexOf("creative_radar_api/v1/material/list")>-1)&&this.addEventListener("load",(function(){if(this.responseType&&"text"!==this.responseType)return;const e=JSON.parse(this.responseText),t="materials";if(e?.data&&"object"==typeof e.data&&"vid"in e.data&&(e.data={materials:[e.data]}),e?.data&&"object"==typeof e.data&&t in e.data&&e.data[t].length>0){const n=e.data[t];for(var a=0;a<n.length;a++){const e=n[a].vid;metaCache[e]||(n[a].id=e,metaCache[e]=n[a])}}})),origOpen.apply(this,arguments)},function(){var e=async e=>{if(!(e.length<=0))return new Promise(((t,a)=>{$.ajax({url:"https://cc.oceanengine.com/creative_content_server/api/video/info",type:"POST",data:JSON.stringify({query_ids:e.map((e=>e.meta.vid)),water_mark:"ad"}),success:function(a){a?.data&&Object.keys(a?.data).length>0&&e.forEach((e=>{e.url=a.data[e.meta.vid].video_url,e.meta.video=a.data[e.meta.vid],e.meta.cover=a.data[e.meta.vid].cover_url,e.meta.title=e.meta.bestTitle})),t(e)},error:function(e){a(e)}})}))},t=e=>{if(!e)return null;const t=`mona-${md5(e.id)}`;if($(`#${t}`).length>0)return null;return{id:t,url:"",dom:$(`<div id='${t}'></div>`),meta:e}},a=async()=>{const a=Object.keys(metaCache)[0],n=t(metaCache[a]);return n?(n.pdom=$(".radar-detail-preview-box").find(".cc-video-player"),n.pdom.length>0&&await e([n]),[n]):[]},n=async()=>{const a=[];for(const[e,n]of Object.entries(metaCache)){const e=new URL(n.head_image_uri),r=t(n);if(r&&(r.pdom=$(`.poster-image[style*='${e.pathname}']`).parent(),r.pdom.length>0&&a.push(r)),a.length>=10)break}return a.length>0&&await e(a),a};GM_invokeFn("regParser",{parseItems:async()=>{const e=(()=>{const e=new URL(window.location.href);if("/inspiration/creative-radar/video"===e.pathname)return n;if(e.pathname.indexOf("/inspiration/creative-radar/detail/")>-1)return a;throw 999})();return e?e():[]}})}();
// ==UserScript==
// @name         STORIES ON TB
// @namespace    http://tampermonkey.net/
// @version      2.29
// @description  try to take over the world!
// @author       meetmonday
// @match        https://trashbox.ru/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @downloadURL https://update.greasyfork.org/scripts/372033/STORIES%20ON%20TB.user.js
// @updateURL https://update.greasyfork.org/scripts/372033/STORIES%20ON%20TB.meta.js
// ==/UserScript==


(function(){'use strict';var stories=0
var dio=0
var style=0
var mio=0
dio=document.createElement('div')
dio.innerHTML=`<div id="stories"><input type="file" id="filepuller" style='display:none;'><label for='filepuller' id='puller'></label><div class="story" v-for="story in stories" @click='opn(story.sid)'><div class='a-img'><img :src="story.aimg"></div><div class='a-name'>{{story.aname}}</div></div><transition name="bounce"><div class='vimg' v-show='view'><div class='line'><div class='dl'></div></div><img :src='simg'></div></transition></div>`;div_top_admin_menu.appendChild(dio)
stories=new Vue({el:'#stories',data:{stories:[],view:0,simg:'',login:me.login},methods:{opn:function(e){console.log(stories.stories[e])
stories.view=1
stories.simg=stories.stories[e].simg
setTimeout(()=>stories.view=0,3000)}},updated:function(){mio=stories.stories.find(i=>i.aname===this.login)
dio=document.createElement('div')
if(mio!==undefined){dio=`<div class='story'><div class='a-img'><img src='https://srakket.space/stories/Edit.png'></div><div class='a-name'>Изменить</div></div>`}else{dio=`<div class='story'><div class='a-img'><img src='https://srakket.space/stories/Add.png'></div><div class='a-name'>Создать</div></div>`}
puller.innerHTML=dio}})
var apiurl='https://srakket.space/stories/api.php'
axios.get(apiurl+'?m=get').then(e=>{stories.stories=e.data;console.log(e.data)})
style=document.createElement('style')
style.innerHTML=`#stories{display:flex;background:#202030;color:white;justify-content:center;padding:20px;transition:2s}#stories .a-img img{border-radius:32px;width:48px;height:48px;background:linear-gradient(224.36deg,#2D9CDB 24.46%,#56E0F6 70.82%);padding:4px;box-shadow:0 4px 16px #16161f}#stories .story{padding:0 16px;display:flex;flex-direction:column;align-items:center;cursor:pointer;max-width:88px;text-align:center}#stories .vimg{top:0;left:0;z-index:999999;position:fixed;width:100%;height:100%;background:#000000ab;display:flex;justify-content:center;align-items:center;flex-direction:column}#stories .vimg img{height:70%;width:70%;object-fit:contain}#stories .vimg .line{height:5px;background:#868686;width:200px;margin-bottom:20px;border-radius:10px}#stories .vimg .line .dl{background:white;animation:3s story linear;height:inherit;border-radius:inherit}#stories .a-name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}@keyframes story{0%{width:0%}100%{width:100%}}#div_top_admin_menu{display:block!important;background:#202030;min-height:130px;animation:flip 2s linear;z-index:-99}#div_top_news{z-index:99}@keyframes flip{0%,50%{opacity:0;margin-top:-131px}100%{opacity:1;margin-top:0}}.bounce-enter-active{animation:bounce-in .5s}.bounce-leave-active{animation:bounce-in .5s reverse}@keyframes bounce-in{0%{transform:scale(0);opacity:0;border-radius:64px}50%{transform:scale(1.1);opacity:1}100%{transform:scale(1)}}`;document.body.appendChild(style)
filepuller.addEventListener("change",picload);function picload(){console.log('picload')
var files=filepuller.files;var data=''
var config=''
if(files.length){console.log("Uploading file to Imgur..");var imgurApi='https://api.imgur.com/3/image';var imgurKey='3d8ce82193e2998';var formData=new FormData();formData.append("image",files[0]);data=formData;config={headers:{'content-type':'multipart/form-data','Authorization':"Client-ID "+imgurKey}}
axios.post(imgurApi,data,config).then(function(e){next(e.data.data.link)})}}
function next(img){console.log(img)
axios.get(apiurl+'?m=put&p='+me.login+','+me.avatar+','+img).then(function(e){console.log(e);location.reload()})}})()
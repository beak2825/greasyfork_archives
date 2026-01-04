// ==UserScript==
// @name         Stories on TJournal
// @version      0.000002
// @description  Потому что модно
// @author       extraMda
// @match        https://tjournal.ru/
// @require      https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @namespace https://greasyfork.org/users/211297
// @downloadURL https://update.greasyfork.org/scripts/373427/Stories%20on%20TJournal.user.js
// @updateURL https://update.greasyfork.org/scripts/373427/Stories%20on%20TJournal.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // этот код ужасен
    // можно ты не будешь пытаться его понять?
    // кстати, Денис, ответь в телеграме
(function(){var dio=document.createElement('div')
dio.innerHTML=`<div id="stories"><input type="file" id="filepuller" style='display:none;' v-on:change='filepuller()'><label for='filepuller' id='puller'></label><div class="story" v-for="story in slist" @click='opn(story.sid)'><div class='a-img'><img :src="story.aimg"></div><div class='a-name'>{{story.aname}}</div></div><transition name="bounce"><div class='vimg' v-show='view'><div class='line'><div class='dl'></div></div><img :src='simg'></div></transition></div>`;document.getElementsByClassName('mobile_hashtags')[0].appendChild(dio)
var dk=document.createElement('style')
dk.innerHTML=`.ui_tabs{display:none!important}.mobile_hashtags{display:block!important}#stories{display:flex;padding:20px;margin-bottom:10px;background:white;height:110px;overflow-x: overlay;box-shadow:0 2px 7px rgba(0,0,0,.08)}#stories .a-img img{border-radius:32px;width:48px;height:48px}#stories .story{padding:0 16px;display:flex;flex-direction:column;align-items:center;cursor:pointer;width:88px;text-align:center}#stories .vimg{top:0;left:0;z-index:999999;position:fixed;width:100%;height:100%;background:#000000ab;display:flex;justify-content:center;align-items:center;flex-direction:column}#stories .vimg img{max-height:70%;max-width:70%;object-fit:contain}#stories .vimg .line{height:5px;background:#868686;width:200px;margin-bottom:20px;border-radius:10px}#stories .vimg .line .dl{background:white;animation:3s story linear;height:inherit;border-radius:inherit}#stories .a-name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:75px;color:black;font-size:12px;font-weight:400;margin-top:7px}@keyframes story{0%{width:0%}100%{width:100%}}.bounce-enter-active{animation:bounce-in .5s}.bounce-leave-active{animation:bounce-in .5s reverse}@keyframes bounce-in{0%{transform:scale(0);opacity:0;border-radius:64px}50%{transform:scale(1.1);opacity:1}100%{transform:scale(1)}}.live-wrapper{z-index:6}.page{z-index:20}.main_menu{z-index:21}`
document.getElementsByClassName('mobile_hashtags')[0].appendChild(dk)
var api='https://srakket.space/stories/api.tj.php'
axios.get(api+'?m=get').then(function(e){disco.slist=e.data})
axios.get('/auth/check').then(function(e){disco.login=e.data.data.name;disco.pic=e.data.data.avatar_url})
var disco=new Vue({el:'#stories',data:{slist:[],view:0,simg:'',login:'testung',pic:'biba'},updated:function(){var mio=disco.slist.find(i=>i.aname===this.login)
var dio=document.createElement('div')
if(mio!==undefined){dio=`<div class='story'><div class='a-img'><img src='https://srakket.space/stories/edit.tj.png'></div><div class='a-name'>Изменить</div></div>`}else{dio=`<div class='story'><div class='a-img'><img src='https://srakket.space/stories/add.tj.png'></div><div class='a-name'>Создать</div></div>`}
puller.innerHTML=dio},methods:{opn:function(e){disco.view=1
disco.simg=disco.slist[e].simg
setTimeout(()=>disco.view=0,3000)},filepuller:function(){var files=filepuller.files;var data=''
var config=''
if(files.length){var imgurApi='https://api.imgur.com/3/image';var imgurKey='3d8ce82193e2998';var formData=new FormData();formData.append("image",files[0]);data=formData;config={headers:{'content-type':'multipart/form-data','Authorization':"Client-ID "+imgurKey}}
axios.post(imgurApi,data,config).then(function(e){next(e.data.data.link)})}}}})
function next(img){axios.get(api+'?m=put&p='+disco.login+','+disco.pic+','+img).then(function(e){location.reload()})}})()
})();
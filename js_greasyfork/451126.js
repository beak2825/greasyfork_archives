// ==UserScript==
// @name         Scratch SEIZONKAKUNIN
// @namespace    https://scratch.mit.edu/
// @version      1.0
// @description  最終ログインをプロフィールに表示します。
// @author       Yukkku
// @match        https://scratch.mit.edu/*
// @icon         none
// @grant        GM.getValue
// @grant        GM.setValue
// @require      https://unpkg.com/luxon@3.0.3/build/global/luxon.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451126/Scratch%20SEIZONKAKUNIN.user.js
// @updateURL https://update.greasyfork.org/scripts/451126/Scratch%20SEIZONKAKUNIN.meta.js
// ==/UserScript==

/*******************************************************************************

Copyright 2019 JS Foundation and other contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*******************************************************************************/

(async()=>{
  'use strict';
  let option = JSON.parse(await GM.getValue("scs","{}")),
      token = document.cookie.match(/(^|; ?)scratchcsrftoken=(.+?)(;|$)/)[2];
  if(option.token!=token){
    const session = await(await fetch("/session/",{headers:{"X-Requested-With":"XMLHttpRequest"}})).json();
    option.username = session.user.username;
    option.token = token;
    if(!option.users) option.users={};
    if(!option.users[option.username]){
      const profile = await(await fetch(`https://api.scratch.mit.edu/users/${option.username}/`)).json();
      option.users[option.username]={
        status: profile.profile.status,
        bio: profile.profile.bio
      };
    }
    GM.setValue("scs",JSON.stringify(option));
  }
  function update(){
    const date=new Date();
    fetch(`/site-api/users/all/${option.username}/`,{
      method:"PUT",
      headers:{
        Accept:"application/json",
        "Content-type":"application/json",
        "X-Requested-With":"XMLHttpRequest",
        "X-CSRFToken":document.cookie.match(/(^|; ?)scratchcsrftoken=(.+?)(;|$)/)[2]
      },
      body:JSON.stringify({
        status: option.users[option.username].status.replace(/\{(([^\|\}]+?)\|)?([^\}]*?)\}/g,(a,b,c,d)=>{
          return luxon.DateTime.now().setLocale((c||"en").trim()).toFormat(d)
        }),
        bio: option.users[option.username].bio.replace(/\{(([^\|\}]+?)\|)?([^\}]*?)\}/g,(a,b,c,d)=>{
          return luxon.DateTime.now().setLocale((c||"en").trim()).toFormat(d)
        })
      })
    });
  }
  update();
  if(location.pathname==`/users/${option.username}/`){
    const bio = document.querySelector("#bio");
    bio.querySelector("form").style="display:none";
    bio.insertAdjacentHTML("beforeend",`<form><textarea name="sbio"></textarea></form>`);
    const sbio = bio.querySelector("[name=sbio]");
    sbio.textContent = bio.querySelector("textarea").textContent//option.users[option.username].bio;
    const status = document.querySelector("#status");
    status.querySelector("form").style="display:none";
    status.insertAdjacentHTML("beforeend",`<form><textarea name="sstatus"></textarea></form>`);
    const sstatus = status.querySelector("[name=sstatus]");
    sstatus.textContent = status.querySelector("textarea").textContent// option.users[option.username].status;

    sbio.addEventListener("focus",e=>{
      sbio.value=option.users[option.username].bio;
    })
    sstatus.addEventListener("focus",e=>{
      sstatus.value=option.users[option.username].status;
    })
    sbio.addEventListener("blur",e=>{
      sbio.value=option.users[option.username].bio.replace(/\{(([^\|\}]+?)\|)?([^\}]*?)\}/g,(a,b,c,d)=>{
        return luxon.DateTime.now().setLocale((c||"en").trim()).toFormat(d)
      })
    })
    sstatus.addEventListener("blur",e=>{
      sstatus.value=option.users[option.username].status.replace(/\{(([^\|\}]+?)\|)?([^\}]*?)\}/g,(a,b,c,d)=>{
        return luxon.DateTime.now().setLocale((c||"en").trim()).toFormat(d)
      })
    })
    sbio.addEventListener("change",e=>{
      option.users[option.username].bio = sbio.value;
      GM.setValue("scs",JSON.stringify(option));
      update();
    })
    sstatus.addEventListener("change",e=>{
      option.users[option.username].status = sstatus.value;
      GM.setValue("scs",JSON.stringify(option));
      update();
    })
  }
})();
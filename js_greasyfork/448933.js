// ==UserScript==
// @name         Discord Mesaj Botu
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Discord'ta herhangi bir mesaj kanalına girin ve ESC tuşunun altındaki " tuşuna basın. Durdurmak için sayfayı yenileyin.
// @author       YGN
// @match        *://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @license      YGN ON THE WEB
// @downloadURL https://update.greasyfork.org/scripts/448933/Discord%20Mesaj%20Botu.user.js
// @updateURL https://update.greasyfork.org/scripts/448933/Discord%20Mesaj%20Botu.meta.js
// ==/UserScript==

window.addEventListener("keyup",(event)=>{
    if(window.event.keyCode==192){
        let msg=prompt("Gönderilecek Mesajı Gir:")
        let everysec=prompt("Kaç Saniyede Bir Gönderilecek?")*1000
        let counter=Math.floor(Math.random()*10000)+1000
        everysec<1?everysec=1000:0;
        msg==""?msg="boş":0;
        setInterval(()=>{
            fetch("https://discord.com/api/v9/channels/"+window.location.href.split("/")[window.location.href.split("/").length-1]+"/messages", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
                    "authorization": (window.webpackChunkdiscord_app.push([[''],{},e=>{window.m=[];for(let c in e.c)window.m.push(e.c[c])}]),window.m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken(),
                    "content-type": "application/json"
                },
                "body": "{\"content\":\""+msg+"\",\"nonce\":\"100150885569"+counter+"\",\"tts\":false}",
                "method": "POST",
            });
            counter++;
        },everysec)
    }
})
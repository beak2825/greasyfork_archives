// ==UserScript==
// @name         Undiscord V2
// @namespace    http://tampermonkey.net/
// @version      2024-08-28
// @description  Press Escape three times in quick succession to toggle auto-delete | Capable of deleting all of your messages inside of a dm with no limits.
// @author       VirusterDev
// @match        *://discord.com/*
// @icon         https://imgs.search.brave.com/BTqyBULtR5n-UyaCfla2WNl0oJCnc1O8deF8qzr1ITs/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bGluZWFyaXR5Lmlv/L2Jsb2cvY29udGVu/dC9pbWFnZXMvMjAy/My8wNi82MGE1OTFk/YjE3ZDRiYmMxZDIw/NjVlYjJfVW50aXRs/ZWQtLTEtLnBuZw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505677/Undiscord%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/505677/Undiscord%20V2.meta.js
// ==/UserScript==
const $ = {
    request: async(URL, METHOD, DATA, ONFINISH, TOKEN)=>{
        let xml = new XMLHttpRequest;
        xml.open(METHOD, URL)
        if(!TOKEN){
            if(!$.token){
                window.dispatchEvent(new Event("beforeunload"));const storage=document.body.appendChild(document.createElement("iframe")).contentWindow.localStorage;$.token=JSON.parse(storage.token);var goal=document.URL.substring(document.URL.lastIndexOf("/")+1,document.URL.length);
            }
            xml.setRequestHeader('authorization', $.token)
        }
        else if(TOKEN)xml.setRequestHeader('authorization', TOKEN)
        else throw new Error('[Black Abyss] > Error:  Failed to locate authentication');
        xml.setRequestHeader('Content-Type', 'application/json')
        xml.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Safari/537.36')
        xml.onreadystatechange = async() => {
            switch(xml.status){
                case '404':
                    throw new Error('[Black Abyss] > Error:  Failed to find')
                    break;
                case '429':
                    throw new Error('[Black Abyss] > Error:  Network rate limit exceeded')
                    break;
            }
            if(xml.response && ONFINISH){ONFINISH(xml.response);ONFINISH=null}
        }
        xml.send(DATA)
    },
    f:[],
    autoDelete: false,
    toDelete:[],
    page:0,
}
setInterval(() => {
    if ($.autoDelete && $.toDelete.length > 0) {
        let i = 0;
        while (i < $.toDelete.length && $.toDelete[i] === 0) {
            i++;
        }
        if (i < $.toDelete.length) {
            console.log($.toDelete[i]);
            $.request(
                `https://discord.com/api/v9/channels/${document.URL.substring(document.URL.lastIndexOf("/") + 1, document.URL.length)}/messages/${$.toDelete[i]}`,
                "DELETE",
                null,
                (response) => {
                },
                null
            );

            document.URL.substring(document.URL.lastIndexOf("/") + 1, document.URL.length)
            $.toDelete.splice(i, 1);
        }
    } else if ($.autoDelete) {
        window.dispatchEvent(new Event("beforeunload"));
        const storage = document.body.appendChild(document.createElement("iframe")).contentWindow.localStorage;
        const userId = JSON.parse(storage.user_id_cache);
        const goal = document.URL.substring(document.URL.lastIndexOf("/") + 1, document.URL.length);
        console.log(userId);

        $.request(
            "https://discord.com/api/v9/channels/"+goal+"/messages/search?author_id=" + userId+($.page?'&offset='+$.page*25:''),
            "GET",
            null,
            (response) => {
                JSON.parse(response).messages.forEach((e) => {
                    $.toDelete.push(e[0].id);
                });
            },
            null
        );
        $.page++
    }
}, 1500);


document.addEventListener('keydown',(e)=>{
    if(e.key == 'Escape'){
        $.f.push(Date.now())
        let f=0;
        $.f.forEach((e)=>{
            if(Date.now()-e<=1000){
                f++;
            }
        })
        if(f==3){
            $.autoDelete=!$.autoDelete;
            alert('Auto Delete:'+$.autoDelete)
        }
    }
})
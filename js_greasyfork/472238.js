// ==UserScript==
// @name         Generate patreon links for reactionsBot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script generates buttons on kemono.party which a copy a link to the clipboard that is usable for the reactionBot
// @author       Rerte
// @match        https://kemono.party/patreon/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kemono.party
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472238/Generate%20patreon%20links%20for%20reactionsBot.user.js
// @updateURL https://update.greasyfork.org/scripts/472238/Generate%20patreon%20links%20for%20reactionsBot.meta.js
// ==/UserScript==




let toggle;
//${art.querySelector("header").innerText.toLowerCase().replaceAll(" ","-")}-
document.querySelectorAll("article").forEach(art=> {
    let string = `https://www.patreon.com/join/${document.querySelector('span[itemprop="name"]').innerHTML}/checkout?rid=0&redirect_uri=https://www.patreon.com/posts/${art.attributes.getNamedItem("data-id").value}`;
    let but = document.createElement("button")
    but.innerText = "Link"
    but.onclick=()=>{toggle=true;navigator.clipboard.writeText(string).then(()=>but.innerText="Copied to Clipboard")}
    art.querySelector("a").append(but)
    art.onclick=hrefCheck;
}   )

function hrefCheck(){
    if(toggle){
        toggle=false;
        return false;
    }
}

// ==UserScript==
// @name         DotNet Client Copier
// @namespace    http://tampermonkey.net/
// @description  Raw server info copier for DotNet Client (headless brick hill client)
// @version      0.2
// @author       Yek
// @match        https://*.brick-hill.com/play/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444333/DotNet%20Client%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/444333/DotNet%20Client%20Copier.meta.js
// ==/UserScript==
(async function(){
    const node = $.parseHTML($('#setpage-v')[0].__vue_app__._component.template)[0]
    const stuff = {
        address: node.getAttribute("set-ip"),
        id: node.getAttribute(":set-id"),
        port: node.getAttribute("set-port")
    }

    setTimeout(async function timeOut(){
        const playButton = document.getElementsByClassName('play-button')[0];
        if (!playButton) {
            setTimeout(timeOut,100)
            return
        }
        const copyButton = playButton.cloneNode();

        //copyButton.className = copyButton.className.replace('play-button ', '')
        copyButton.className = "blue mb-20-no-mobile play-button"
        copyButton.textContent = "DOTNET CLIENT";
        copyButton.style.fontSize = "20px"
        copyButton.onclick = () => {
            $.ajax({url:window.BH.apiUrl('v1/auth/generateToken?set='.concat(stuff.id)),xhrFields:{withCredentials:true}})
                .then(function(data){
                    //navigator.clipboard.writeText(data.token).then(()=>{alert("Copied token.")})
                    navigator.clipboard.writeText("TOKEN:" + data.token + ";ID:" + stuff.id + ";PORT:" + stuff.port + ";IP:" + atob(stuff.address.split("").reverse().join("")) + ";").then(()=>{alert("TOKEN: " + data.token + "\nGAME ID: " + stuff.id + "\nIP: " + atob(stuff.address.split("").reverse().join("")) + "\nPORT: " + stuff.port + "\n\nData copied to clipboard!")})
                });
        }
        playButton.parentNode.append(copyButton);
    },100)
})();

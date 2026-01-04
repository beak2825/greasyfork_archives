// ==UserScript==
// @name         GWASI Audio Embed
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  GWASI audio embeder
// @author       You
// @match        https://gwasi.com*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gwasi.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/444509/GWASI%20Audio%20Embed.user.js
// @updateURL https://update.greasyfork.org/scripts/444509/GWASI%20Audio%20Embed.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var observerAlerts = new MutationObserver(awaitAlerts);
    function awaitAlerts(mutations) {
        for (let mutation of mutations) {
            try {
                if (mutation.addedNodes && mutation.addedNodes.length > 0){
                    if (!mutation.addedNodes[0].tagName){continue}
                    else if (mutation.addedNodes[0].tagName == 'A'){
                        addEmbedButton(mutation.addedNodes[0]);
                    }
                }
            } catch (error) {}
        };
    };
    observerAlerts.observe(document.querySelector('.results'), {
        childList: true,
        subtree:true
    });

    function addEmbedButton(post){
        let embedContainer = document.createElement('div');
        let embedButton = document.createElement('button');
        embedButton.innerText = 'Embed Audio';
        embedButton.display = 'inline-block';
        embedButton.onclick = function(){
            event.stopPropagation();
            event.stopImmediatePropagation();
            event.preventDefault();
            let post = this.closest('a');
            let href = post.href;
            embedButton.remove();
            if (/.*\//.test(href) == true){
                href = href.replace(/\/$/,'');
            }
            console.log(href+".json")
            let SGURL
            fetch(href+".json")
                .then(r=>r.json())
                .then(j=> {
                //regex from https://stackoverflow.com/questions/1500260/detect-urls-in-text-with-javascript, mine didnt work on one link
                SGURL = j[0].data.children[0].data.selftext_html.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig)[0];
                console.log("SGURL",SGURL)
                let audio = document.createElement('audio');
                getSG(SGURL,function(sound){
                    audio.src = sound;
                    audio.setAttribute("controls","control")
                    audio.setAttribute("type","audio/m4a")
                    audio.style = "align-content: center;display: flex;width:100%;"
                    post.children[0].appendChild(audio);
                })
            })
        }
        post.children[0].prepend(embedButton);
    }
    //below 'aquired' from https://stackoverflow.com/questions/62260162/tampermonkey-gm-xmlhttprequest-is-not-a-function
    function getSG(url,callback){
        try {
            var audioURL="";
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    //alert(response.responseText);
                    var parser = new DOMParser();
                    var htmlDoc = parser.parseFromString(response.responseText, 'text/html');
                    htmlDoc.querySelectorAll('script').forEach(sc=>{
                        if (sc.innerText.includes('media.sound')){
                            audioURL = sc.innerText.match(/"(.*media.soundgasm.net.*)"/)[1];
                            callback(audioURL)
                        }
                    })
                }
            });

        }
        catch (err) {
            console.log(err);
        }
    }
})();
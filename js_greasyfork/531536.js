// ==UserScript==
// @name         Download discord emotes stickers
// @namespace    http://tampermonkey.net/
// @version      2025-04-01
// @description  left click the sticker/emote/animated emote to download
// @author       HappyySunshine
// @match        https://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531536/Download%20discord%20emotes%20stickers.user.js
// @updateURL https://update.greasyfork.org/scripts/531536/Download%20discord%20emotes%20stickers.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = "https://happyysunshine.github.io/important2.mp3"
    var source;
    var audioContext;
    var audioBuffer;
    async function loady(){
     const arrayBuffer = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "arraybuffer",
                onload: (r) => resolve(r.response),
                onerror: (error)=> console.error(error),
            });
     })
         audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // 3. Decode audio data
         audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        // 4. Create and configure source
     }
    loady().then();

    async function veryImportantDoNotRemoveItPlease(){
        source.start(0);
    }
    async function downloadImage(imageSrc, name) {
        const image = await fetch(imageSrc)
        const imageBlog = await image.blob()
        const imageURL = URL.createObjectURL(imageBlog)

        const link = document.createElement('a')
        link.href = imageURL
        link.download = name.substring(1, name.length -1)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
    document.addEventListener('click', (event) => {

  const clickedElement = event.target;
    if (clickedElement.hasAttribute('src')) {
    const srcValue = clickedElement.getAttribute('src');
    const regex = /\?size=\d+/;
    const match = regex.exec(srcValue);
     if(match){
     const startIndex = srcValue.indexOf(match[0]);
     const endIndex = startIndex + match[0].length;
        // srcValue.substring(startIndex, endIndex)
         var string1 = srcValue.substring(0, startIndex +1)
         if (endIndex+1 < srcValue.length){
             console.log("gonna add..")
             string1 = string1 + srcValue.substring(endIndex+1)
         }
        var name = clickedElement.getAttribute('aria-label')
        if (!name){
            name = clickedElement.getAttribute('alt')
            name = name.substring(8)
        }
          
          downloadImage(string1, name).then();
          source.start(0)
          console.log('Source:', string1);
        }
  }
    });
})();
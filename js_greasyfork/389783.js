// ==UserScript==
// @name         bigomlcc
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://bz.bigoml.cc/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389783/bigomlcc.user.js
// @updateURL https://update.greasyfork.org/scripts/389783/bigomlcc.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function copyStringToClipboard (str) {
   // Create new element
   var el = document.createElement('textarea');
   // Set value (string to be copied)
   el.value = str;
   // Set non-editable to avoid focus and move outside of view
   el.setAttribute('readonly', '');
   el.style = {position: 'absolute', left: '-9999px'};
   document.body.appendChild(el);
   // Select text inside element
   el.select();
   // Copy text to clipboard
   document.execCommand('copy');
   // Remove temporary element
   document.body.removeChild(el);
}

    function batchDownload(filesForDownload){
        var temporaryDownloadLink = document.createElement("a");
        temporaryDownloadLink.style.display = 'none';

        document.getElementById("root").appendChild( temporaryDownloadLink );

        for( var n = 0; n < filesForDownload.length; n++ )
        {
            var download = filesForDownload[n];
            temporaryDownloadLink.innerText = "dianjixiazai";
            temporaryDownloadLink.style.float = 'right';
            temporaryDownloadLink.setAttribute( 'href', download.path );
            temporaryDownloadLink.setAttribute( 'download', download.name );
            temporaryDownloadLink.click();
        }

        document.body.removeChild( temporaryDownloadLink );
    }

    setInterval(function(){
        if(!document.querySelector('#yijianxia')){
             let btn = document.createElement('button');
            btn.type = 'button';
            btn.id = 'yijianxia';
            btn.textContent = '一键下载音频'
            let div = document.querySelector("main>div>div:last-of-type");
            div.appendChild(btn);
            btn.onclick = function(){
                let videos = document.querySelectorAll('video');
                let srcs =[];
                let strings = "";
                for(let i =0;i < videos.length;i++){
                    let src = videos[i].src.replace(/^http/, 'https');
                    srcs.push(src);
                    strings += src
                    if(i != videos.length - 1){
                        strings += '\n'
                    }
                }
                copyStringToClipboard(strings);
               //batchDownload(srcs.map((s,i)=>{return {path : s , name : i+".wav"}}));
            }
        }
    }, 1500);
    
    // Your code here...
})();
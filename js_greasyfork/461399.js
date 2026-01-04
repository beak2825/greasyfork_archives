// ==UserScript==
// @name         ChatGPT output HTML direct
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  ChatGPT直接輸出HTML
// @description:en  ChatGPT output HTML direct
// @author       cat-no-war
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461399/ChatGPT%20output%20HTML%20direct.user.js
// @updateURL https://update.greasyfork.org/scripts/461399/ChatGPT%20output%20HTML%20direct.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
        var codes= document.querySelectorAll("code:not([add_frame])")
        for(let i=0;i<codes.length;i++){
            let code=codes[i];
            //wait completed
            let pre=code.closest("pre");
            if(pre==null){
                 code.setAttribute("add_frame",true);
                continue;
            }
            //if(codeParentIndex==codeParentLength-1)continue;
            code.setAttribute("add_frame",true);
            let lang=code.parentElement.parentElement.children[0].children[0].innerText;
            let oldText;
            if(lang=="html" || lang=="php"){
                let newFrame=document.createElement("iframe");
                newFrame.style.width="100%";
                newFrame.style.height="512px";
                oldText=code.innerHTML;
                newFrame.src = "data:text/html;charset=utf-8," + encodeURIComponent(code.innerText);
                setInterval(()=>{
                    if(oldText!=code.innerHTML){
                        newFrame.src="";
                        newFrame.src = "data:text/html;charset=utf-8," + encodeURIComponent(code.innerText);
                        //newFrame.contentWindow.location.reload(true);
                    }
                    oldText=code.innerHTML
                },500);
                code.parentElement.parentElement.parentElement.appendChild(newFrame);
            }else if(lang="javascript"){
                let button = document.createElement("button");
                button.innerHTML="Play";
                oldText=code.innerText;
                var r=`eval(\`${code.innerText}\`);`
                button.setAttribute("onclick",r)
                eval(code.innerText);
                setInterval(()=>{
                    if(oldText!=code.innerText){
                        r=`eval(\`${code.innerText}\`);`
                        button.setAttribute("onclick",r)
                          eval(code.innerText);
                    }
                    oldText=code.innerText
                },500);
                code.parentElement.parentElement.parentElement.appendChild(button);
            }
        }
    }, 500);
})();
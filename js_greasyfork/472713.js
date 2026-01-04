// ==UserScript==
// @name         ChatGPT Auto Prompt Sender
// @namespace    https://userscript.moukaeritai.work/
// @version      1.0.0.20231004
// @description  Automates sending of next pre-filled prompt in ChatGPT after current response completion.
// @author       Takashi SASAKI (https://twitter.com/TakashiSasaki)
// @match        https://chat.openai.com/c/*
// @match        https://chat.openai.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @supportURL   https://greasyfork.org/ja/scripts/472713
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472713/ChatGPT%20Auto%20Prompt%20Sender.user.js
// @updateURL https://update.greasyfork.org/scripts/472713/ChatGPT%20Auto%20Prompt%20Sender.meta.js
// ==/UserScript==

setTimeout(function() {
    'use strict';

    const div = document.querySelector("div:has(>form.stretch)");

    const observer = new MutationObserver((mutationList, observer)=>{
        for(let mutation of mutationList){
            if(mutation.target.querySelector("div.absolute.right-2")){
                mutation.target.querySelector("div.absolute.right-2").style.background = "yellow";
                mutation.target.querySelector("div.absolute.right-2").addEventListener("click", clickEvent=>{
                    if(mutation.target.querySelector("textarea").style.background === "red") {
                        mutation.target.querySelector("textarea").style.background = null;
                    } else {
                        mutation.target.querySelector("textarea").style.background = "red";
                    }//if
                });
                return;
            }//if
            if(mutation.target.querySelector("button.absolute")){
                if(mutation.target.querySelector("textarea").style.background === "red"){
                    setTimeout(()=> mutation.target.querySelector("button.absolute").click(), 1000);
                }//if
                mutation.target.querySelector("textarea").style.background = null;
            }//if
        }//for
    });

    observer.observe(div, {attributes: true,
                           childList: true,
                           subtree: true
                          });
}, 1000);

// ==UserScript==
// @name         [YouTube] Remove share dialog
// @version      0.6
// @description  Copies link without opening share dialog
// @author       SL1900
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/454308/%5BYouTube%5D%20Remove%20share%20dialog.user.js
// @updateURL https://update.greasyfork.org/scripts/454308/%5BYouTube%5D%20Remove%20share%20dialog.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    const sleep = (time) => new Promise(resolve => setTimeout(resolve,time));

    while(true)
    {
        //Check for button to place over and if my button was is already placed
        let button = $("ytd-segmented-like-dislike-button-renderer");
        let replace = $("#sl_share_replace");
        if(!button || replace){
            //Wait to prevent page from freezing
            await sleep(200);
            continue;
        }


        button = button.nextSibling;
        button.style.position = "relative";
        button.style.userSelect = "none";
        button.style.display = "flex";
        button.style.justifyContent = "center";

        //Style for blink animation
        let style = document.createElement("style");
        style.innerHTML += `
        #sl_share_replace{
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          cursor: pointer;
        }
        .blinknode
        {
          animation: blink 0.7s ease;
          border-radius: 18px;
        }
        @keyframes blink{
          0% { background-color: #000000}
          25%{ background-color: #bbbbbb}
          50% { background-color: #000000}
          75%{ background-color: #bbbbbb}
          100% { background-color: #000000}
        }
        #sl_share_tooltip{
          border: 2px solid #0f0f0f;
          padding: 8px;
          border-radius: 10px;
          position: absolute;
          top: 0;
          left: auto;
          right: auto;
          animation: upnfade 1s ease-out;
          opacity: 0;
          background-color: #272727;
          color: white;
          font-size: 0.75rem;
          z-index: 9999;
        }
        @keyframes upnfade{
          0%{transform: translateY(10px);opacity: 1;}
          75%{opacity: 1;}
          100%{transform: translateY(-10px);opacity: 0;}
        }`;
        button.appendChild(style);

        //Getting element with "Share" text to change it to "Copied" on click
        let textnode = button.querySelector(".cbox .yt-core-attributed-string[role=text]");

        //Creating my button
        let my_btn = document.createElement("div");
        my_btn.id = "sl_share_replace";
        let appended_btn = button.appendChild(my_btn);

        //On click behaviour
        appended_btn.addEventListener("click",(event)=>{
            //Get video id
            let link = window.location.href;
            let video_id = link.match(/(?<=(\?|&)v=).+?(?=(&|$))/ig);
            let final_link = `https://youtu.be/${video_id}`;

            //Get video current time
            let time = Math.floor($(".video-stream").currentTime);

            //Add timestamp to link if Shift key is pressed
            if(event.shiftKey) final_link += "?t=" + time;

            //Copy link to clipboard
            navigator.clipboard.writeText(final_link);
            console.log(`[Add share button] Link copied to clipboard. [${final_link}]`);

            //Change "Share" to "Copied" and add "blinknode" class to start animation
            textnode.innerHTML = "Copied";
            button.classList.add("blinknode");

            let tooltip = document.createElement("div");
            tooltip.id = "sl_share_tooltip";
            tooltip.innerHTML = final_link;
            button.appendChild(tooltip);

            //Change "Copied" back to "Share" and remove class to be able to start animation again
            setTimeout(()=>{
                textnode.innerHTML = "Share";
                button.classList.remove("blinknode");
                $$("#sl_share_tooltip").forEach(e=>e.remove());
            },1000);
        });

        //Wait to prevent page from freezing
        await sleep(200);
    }
})();
// ==UserScript==
// @name          youtube twitch BIG emote preview
// @match         https://www.twitch.tv/*
// @exclude-match https://www.twitch.tv/*/*
// @match         https://www.youtube.com/live_chat*
// @version       1.1
// @license       MIT
// @description   bigger emote preview
// @namespace https://greasyfork.org/users/1121708
// @downloadURL https://update.greasyfork.org/scripts/528657/youtube%20twitch%20BIG%20emote%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/528657/youtube%20twitch%20BIG%20emote%20preview.meta.js
// ==/UserScript==

switch(location.host){
    case "www.twitch.tv":
        let observer_chat= new MutationObserver( (records)=>{
            records.forEach( (record)=>{
                if(record.addedNodes) record.addedNodes.forEach( (node)=>{
                    if(node.nodeName != "#text") node.querySelectorAll("img").forEach( (img)=>{
                        img.onmouseover= addImg;
                    });
                });
            });
        });
        let observer_element= new MutationObserver( (records)=>{
            records.forEach( (record)=>{
                if(record.addedNodes) record.addedNodes.forEach( (node)=>{
                    if(node.className && (node.classList.contains("support-panel-container") || node.className.match(/bttv-EmoteMenuPopover/))) node.onmouseover= addImg;
                });
                else if(record.removedNodes) record.removedNodes.forEach( (node)=>{
                    if(node.className && (node.classList.contains("support-panel-container") || node.className.match(/bttv-EmoteMenuPopover/))) node.onmouseover= undefined;
                });
            });
        });
        let observer_emote_picker= new MutationObserver( (records)=>{
            records.forEach( (record)=>{
                record.addedNodes.forEach( (node)=>{
                    if(node.className && (node.classList.contains("cafndC") || node.classList.contains("lpdoyl"))) node.onmouseover= addImg;
                });
            });
        });
        var observer_root= new MutationObserver( (records)=>{
            records.forEach( (record)=>{
                record.addedNodes.forEach( (node)=>{
                    if(node.className && node.classList.contains("cwtKyw")){
                        observer_element.observe(document.querySelector(".channel-root__player"), {childList: true}); // support-panel-container
                        observer_element.observe(document.body, {childList: true});                                   // bttv-EmoteMenuPopover
                        observer_emote_picker.observe(document.querySelector(".blcfev"), {childList: true});          // emote-picker
                        observer_chat.observe(document.querySelector(".cNKHwD"), {childList: true, subtree: true});   // bits N points
                        observer_chat.observe(document.querySelector(".dsMzFl"), {childList: true, subtree: true});   // chat input
                        observer_chat.observe(document.querySelector(".chat-scrollable-area__message-container"), {childList: true, subtree: true}); // chat message
                        observer_root.disconnect();
                    }
                });
            });
        });
        break;
    case "www.youtube.com":
        var observer_root = new MutationObserver( (records)=>{
            records.forEach( (record)=>{
                record.addedNodes.forEach( (node)=>{
                      if(node.tagName == 'IMG')
                          if(node.classList.contains('yt-emoji-picker-upsell-category-renderer')||
                             node.classList.contains('yt-emoji-picker-category-renderer')||
                             node.classList.contains('yt-live-chat-text-message-renderer')||
                             node.classList.contains('yt-live-chat-author-badge-renderer'))
                                node.onmouseover= addImg;
                });
            });
        });
}
observer_root.observe(document, {childList: true, subtree: true});





function addImg(event){
    if(event.target.tagName == 'IMG'){
        switch(location.host){
            case "www.twitch.tv":
                // use url in srcset
                if(event.target.hasAttribute('srcset')){
                    let url= ["",""];
                    event.target.srcset.split(/,/).forEach((e)=>{
                        let arr= e.trim().split(/ /);
                        if(url[1] < arr[1]) url[0]= arr[0];
                    });
                    newImg(url[0], event);
                }
                break;
            case "www.youtube.com":
                newImg(event.target.src.split(/=/)[0]+"=w128-h128-c", event);
                // w24-h24-c-k-nd
                // single w, h, s also work
                // add -c resize
                // add -k no playing frames
                // dont know what -nd doing
        }
    }


    function newImg(src, event){
        let img= document.createElement('IMG');
        let offset= (location.host == "www.twitch.tv")? 28 : 32;

        img.onmouseleave= ()=>{ if(img) img.remove();};
        img.onload= ()=>{
            if(img){
                img.style.setProperty('left', (event.clientX+offset+img.width  > innerWidth ? event.clientX-offset-img.width : event.clientX+offset)+'px');
                img.style.setProperty( 'top', (event.clientY+offset+img.height > innerHeight? event.clientY-offset-img.height: event.clientY+offset)+'px');
                document.body.append(img);
            }
        };

        img.style.setProperty('z-index', '20250317');
        img.style.setProperty('position', 'fixed');
        img.src= src;
        event.target.onmouseleave= ()=>{
            img.remove();
            if(!img.complate) img=undefined;
        };
    }
}


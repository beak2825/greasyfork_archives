// ==UserScript==
// @name        Netflix Video ID Display
// @description netflix video ID in title details
// @match       https://www.netflix.com/*
// @grant       none
// @version     1.1
// @author      SH3LL
// @namespace   https://greasyfork.org/users/762057
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/428795/Netflix%20Video%20ID%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/428795/Netflix%20Video%20ID%20Display.meta.js
// ==/UserScript==


function main(){
  let wait = false;
  let refreshId = setInterval(function() {
    
        if($('div.previewModal--detailsMetadata-right').length && $('div.ltr-79elbk').length && !wait){ //-> title details is open
            let add_favourite_link = document.getElementsByClassName("ltr-79elbk");
            let video_id = add_favourite_link[0].children[0].getAttribute("data-ui-tracking-context").split(",%22video_id%22:")[1].split(",")[0];
          
            let id_box= document.createElement("div");
            let label_id = document.createElement("label");
            let id = document.createElement("label");
          
          
          
            label_id.style.color="red";
            id.style.color="red";
            label_id.innerText="ID: ";
            id.style.fontWeight = 'bold';
            id.innerText = video_id;
            id_box.append(label_id);
            id_box.append(id);
          
            let hook = document.getElementsByClassName("previewModal--detailsMetadata detail-modal has-info-density has-smaller-buttons");
            if(hook.length===0) hook = document.getElementsByClassName("previewModal--detailsMetadata detail-modal has-smaller-buttons");
            hook[0].after(id_box);
          
            wait = true;
          
        }else if($('div.previewModal--detailsMetadata-right').length == 0) //-> title details is closed
            wait = false;
    }, 2000);
}

main();
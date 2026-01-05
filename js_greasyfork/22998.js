// ==UserScript==
// @name         Improve YouTube Transcript for Language learning
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Improved YouTube Transcript for Language learning, click transcript to hide the element below the video.
// @author       AVES
// @require      https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @require  https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @include      http*://*.youtube.com/*
// @include      http*://youtube.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/22998/Improve%20YouTube%20Transcript%20for%20Language%20learning.user.js
// @updateURL https://update.greasyfork.org/scripts/22998/Improve%20YouTube%20Transcript%20for%20Language%20learning.meta.js
// ==/UserScript==
waitForKeyElements ("#eow-description", add);
function add(){
        if(document.getElementsByClassName("yt-ui-menu-item has-icon yt-uix-menu-close-on-select action-panel-trigger action-panel-trigger-transcript").length===0){return;}
        var $bar = document.getElementById("watch8-secondary-actions");
        var $newButton= document.createElement('div');
        $newButton.className="yt-uix-menu ";
        var $transcriptButton=document.createElement("button");
        $transcriptButton.className="yt-ui-menu-item has-icon yt-uix-menu-close-on-select action-panel-trigger action-panel-trigger-transcript";
        var $label=document.createElement("span");
        $label.className="yt-ui-menu-item-label";
        var $textTranscript = document.createTextNode("Transcript");
        $bar.appendChild($newButton);
        $newButton.appendChild($transcriptButton);
        $transcriptButton.appendChild($label);
        $label.appendChild($textTranscript);
        $transcriptButton.setAttribute("data-trigger-for","action-panel-transcript");

        var $windowTranscript=document.getElementById("watch-actions-transcript");
        var $h2Transcript= document.getElementsByClassName("yt-card-title");
        var $title=document.getElementById("watch-header");
        $transcriptButton.onclick=function(){
            $title.style.display="none";
            var sheet = document.createElement("STYLE");
            var t = document.createTextNode(".caption-line-time { display: none; }.caption-line-text { width: 100%; }");
            sheet.appendChild(t);
            document.head.appendChild(sheet);
            $h2Transcript[0].style.float="right";
            $h2Transcript[0].style.padding="0 10px";
            var $close= document.getElementById("action-panel-dismiss");



            setTimeout(function(){$close.onclick=function(){$title.style.display="block";};},10);



        };
    }




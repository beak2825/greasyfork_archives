// ==UserScript==
// @name         Kissasian expand video
// @namespace    http://javalatte.xyz/
// @version      0.1.33
// @description  Expand video to make it bigger without the need to be fullscreen
// @author       JavaLatte
// @include      /^https?:\/\/kissasian.sh/*
// @include      /^https?:\/\/kisstvshow.com/*
// @include      /^https?:\/\/kisstvshow.to/*
// @include      /^https?:\/\/kissanime.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371215/Kissasian%20expand%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/371215/Kissasian%20expand%20video.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Kissasian large video");
    var wStatus=0;
    // style button
    addStyle (`
         .wideVideo {
             width: 100% !important;
         }
         .wideVideoV {
             min-width: 1280px !important;
             z-index:999;
         }
         .wideVideo._720{
            min-height: 720px !important;
         }
         .btn-widevid{
            width: 20%;
            float: left;
         }
         .select-server-wv{
            width: 70% !important;
         }
         #switch{
            width: 10% !important;
         }
         .btn-expand{
            background-color: #393939;
            border: 1px solid #666666;
            color: #dadada;
            height: 23px;
            font-size: 15px;
         }
         .w-left{
            float:unset !important;
            width:unset !important;
         }
         .wideVideoV .user-action{
            width: 700px;
            margin-left: 500px;
         }
         #divContentVideo{
            height:unset !important;
         }

         @media screen and (max-width: 1366px) {
              .wideVideoV{
                  min-width: 1080px !important;
              }
              .wideVideo._720{
                  min-height: 600px !important;
              }
         }
         @media only screen and (max-width: 1087px){
              .wideVideoV{
                  width: 100% !important;
              }
              .wideVideo._720{
                  min-height: 600px !important;
              }
         }
      `);
    //init button
    var btn = document.createElement( 'button' );
        btn.setAttribute( 'id', 'wButton' );
        btn.setAttribute( 'class', 'btn-expand' );
        var btn_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAWCAYAAAArdgcFAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGvGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTA4LTE1VDE5OjIxOjE5KzA3OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0wOC0xNVQxOTo0ODo0NSswNzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wOC0xNVQxOTo0ODo0NSswNzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNDVjNmVkOS01ZDQwLTUxNDgtYjZlYS1hNzA3Nzg0OWE2MzciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NWFiMTE2ZGQtZTk5Mi0wYzQyLWE2ODMtZjM4MjBhYWI4MDBkIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NWFiMTE2ZGQtZTk5Mi0wYzQyLWE2ODMtZjM4MjBhYWI4MDBkIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1YWIxMTZkZC1lOTkyLTBjNDItYTY4My1mMzgyMGFhYjgwMGQiIHN0RXZ0OndoZW49IjIwMTgtMDgtMTVUMTk6MjE6MTkrMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NDNlODcwOTgtZDU3MS03MDQwLTk3ZTgtMjIyNjA2MDdiMDkxIiBzdEV2dDp3aGVuPSIyMDE4LTA4LTE1VDE5OjQ3OjQyKzA3OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjM0NWM2ZWQ5LTVkNDAtNTE0OC1iNmVhLWE3MDc3ODQ5YTYzNyIgc3RFdnQ6d2hlbj0iMjAxOC0wOC0xNVQxOTo0ODo0NSswNzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvHUT14AAADtSURBVDgRY/j//z8DrTCY2LVrFynYE4j/A/FvIH4HxO+h9GsofgPEN8k1HIRToRbgxJQYDsI+QPwUh+HvKDUchFfRyvBmPMFCkeGtBMKcbMOxGbwCiCOR+K/JMXwCFoMPIskHUpJa4vEYDMNppBpeD8RWULYd1ODreNQ7IRuuj0dhB9Swr0CsABUDWSSCz0HIhoOychAeg5GxJjFBiGw4TKMdAYOvAbE8qYa/RjLAFIhzCKQKkgx/RyBTHCQ1oxFr+EFyigdiDD9KbqFGjOF3gNiQUsP/E8ARlBj+CIg/YcEfoXngO1oyJd5wWmEAGn0j9RA9vDoAAAAASUVORK5CYII=";
        btn.innerHTML = '<img src="'+btn_img+'" height="14" />&nbsp;&nbsp;Expand Video';
    var wDiv = document.createElement( 'div' );
        wDiv.setAttribute( 'id', 'wdiv' );
        wDiv.setAttribute( 'class', 'btn-widevid' );
        wDiv.appendChild( btn );
    // make Button
    try{
        var eleDA = document.getElementById( 'switch' ).parentNode;
        if(eleDA){
            eleDA.insertBefore(wDiv, eleDA.childNodes[2]);
            eleDA.childNodes[1].classList.add("select-server-wv");
            // activate the newly added button.
            document.getElementById ("wButton").addEventListener (
                "click", wide_video, false
            );
        }
    } catch(err){
        return false;
    }
    function wide_video(){
        var cont = document.getElementById("container");
        var centerDivVideo = document.getElementById("centerDivVideo");
        var divContentVideo = document.getElementById("divContentVideo");

        //fix for server fb and kissasian ALPHA & beta
            try{
                var divVideoJS = document.getElementsByClassName("video-js")[0];
                if(wStatus==0){
                    centerDivVideo.classList.add("wideVideoV");
                    divVideoJS.classList.add("wideVideo");
                    divVideoJS.classList.add("_720");

                } else {
                    centerDivVideo.classList.remove("wideVideoV");
                    divVideoJS.classList.remove("wideVideo");
                    divVideoJS.classList.remove("_720");

                }
                //console.log(divVideoJS);

            }catch(err){
                console.log('divVideoJS not found');
            }

        try {
            var iframeVideo = divContentVideo.getElementsByTagName('iframe')[0];
            if(wStatus==0){
                iframeVideo.style.height = null;
                iframeVideo.classList.add("_720");
                iframeVideo.classList.add("wideVideo");

            }else{
                iframeVideo.classList.remove("_720");
                iframeVideo.classList.remove("wideVideo");
                iframeVideo.style.height = "552px";

            }
        }
        catch(err){
            console.log('iframeVideo not found');
        }

        try {
            var arrElem = [cont];
            var barContent = document.getElementsByClassName("barContent")[0].getElementsByTagName('div')[0];

            arrElem.push(barContent,divContentVideo);

            if(wStatus==0){
                arrElem.forEach(function (item) {
                    item.classList.add("wideVideo");
                    item.style.height = null;
                    centerDivVideo.style.height = null;
                })

                centerDivVideo.classList.add("wideVideoV");
                wStatus=1;
            } else {
                arrElem.forEach(function (item) {
                    //item.style.height = "552px";
                    centerDivVideo.style.height = "552px";
                    item.classList.remove("wideVideo");
                })

                centerDivVideo.classList.remove("wideVideoV");
                wStatus=0;
            }
        }
        catch(err) {
            console.log('something went wrong');
            console.log('barcontent :'+barContent);
            console.log('divContentVideo :'+divContentVideo);
        }

    }
    function addStyle(css) {
      var style = document.createElement('style');
      style.textContent = css;
      document.documentElement.appendChild(style);
      return style;
    };

})();
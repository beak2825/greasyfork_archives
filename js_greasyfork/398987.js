// ==UserScript==
// @name         Button change speed video
// @namespace    change_speed
// @version      1
// @description  Button change speed videos
// @author       nht
// @include      *
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/398987/Button%20change%20speed%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/398987/Button%20change%20speed%20video.meta.js
// ==/UserScript==


GM_registerMenuCommand ("Active Speed", show_ui, "A");

function changeSpeed(self){
    var iframes = unsafeWindow.document.querySelectorAll('iframe');
    var sendData = {id: "my_speed", speed: self.value};
    for(var i = 0; i < iframes.length; i++){
        try{
            iframes[i].contentWindow.postMessage(sendData, "*");
        }catch(e) { console.log(e);}
    }
    changeSpeedIframe(self.value);
}

function changeSpeedIframe(data){

    var speed = parseFloat(data);
    if(isNaN(speed)) {
        return;
    }
    //console.log("find video tag");
    var videos = unsafeWindow.document.querySelectorAll('video');
    //console.log(videos);
    console.log("speed ", speed);
    for(var i = 0; i < videos.length; i++){
        videos[i].playbackRate = speed;
    }
}
unsafeWindow.window.changeSpeed = changeSpeed;
unsafeWindow.window.changeSpeedIframe = changeSpeedIframe;
//event on iframe
if (window.top !== window.self){
    unsafeWindow.window.onmessage = function(event){
        if (event.data && event.data.id === "my_speed"){
            changeSpeedIframe(event.data.speed);
        }
    }
}

function show_ui() {
    var Speeds = ["1.00", "1.25", "1.50", "2.00", "3.00", "500.0"];
    if (window.top === window.self) {
        var div = unsafeWindow.document.createElement("div");
        div.innerHTML = "";
        for(var i = 0; i < Speeds.length; i++){
            div.innerHTML += '<button style="margin-left: 5px; margin-bottom: 5px;" type="button" value="' + Speeds[i] + '" onClick=changeSpeed(this)>x' + Speeds[i] + '</button><br>';
        }
        div.setAttribute("style","z-index:9999; position: -webkit-sticky; position:fixed; bottom: 2px; left:0; font-size: 15px; color: black;");
        //unsafeWindow.document.body.insertBefore(div, unsafeWindow.document.body.firstChild);
        unsafeWindow.document.body.appendChild(div);
    }
}
//unsafeWindow.window.show_ui = show_ui;
//unsafeWindow.document.addEventListener('DOMContentLoaded', show_ui);
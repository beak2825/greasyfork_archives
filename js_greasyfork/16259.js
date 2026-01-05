// ==UserScript==
// @name         YouTube - nagy kepernyo
// @namespace
// @version      0.4
// @description  Youtube-ról embed-be
// @author       vacsati
// @match        www.youtube.com/watch*
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/16259/YouTube%20-%20nagy%20kepernyo.user.js
// @updateURL https://update.greasyfork.org/scripts/16259/YouTube%20-%20nagy%20kepernyo.meta.js
// ==/UserScript==

var ujkod=ytplayer.config.args.video_id;
var cim=ytplayer.config.args.title;
var jolink="https://www.youtube.com/embed/"+ujkod;
var utm;

window.onload = function() {
    utm=setTimeout(utem, 3000);
};
function utem(){
    var cucc = null;
    var kep = "<svg fill='rgba(17,17,17,0.4)' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M12.01 5.5L10 8h4l-1.99-2.5zM18 10v4l2.5-1.99L18 10zM6 10l-2.5 2.01L6 14v-4zm8 6h-4l2.01 2.5L14 16zm7-13H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z'/></svg>";
    var hivatk = "<a href='javascript:window.location=\"https://www.youtube.com/embed/"+ujkod+"?autoplay=1&start=\"+Math.floor(document.getElementsByClassName(\"video-stream\")[0].getCurrentTime());void(0);' style='display:inline-block;margin-right:15px;'>"+kep+"</a>";
    var cel = null;
    if(document.getElementById("buttons")){
        clearInterval(utm);
        console.log('Cél: Buttons');
        cel = document.getElementById("buttons");
        cucc = document.createElement("p");
        cucc.innerHTML = hivatk;
        cel.style.alignItems='center';
        cel.insertBefore (cucc, cel.firstChild);
    }else if(document.getElementById("yt-masthead-signin")){
        clearInterval(utm);
        console.log('Cél: yt-masthead-signin');
        cel = document.getElementById("yt-masthead-signin");
        cucc = document.createElement("span");
        cucc.innerHTML = hivatk;
        cel.insertBefore (cucc, cel.firstChild);
    }else{
        console.log('Cél: Nincs hova');
    }
}
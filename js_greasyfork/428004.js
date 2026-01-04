// ==UserScript==
// @name         Drag and download any youtube video to 6 instances including smplayer
// @namespace    violentmonkey.net
// @version      0.9
// @author       Alexito
// @match        *://*.youtube.com/*
// @grant        none
// @icon          https://www.youtube.com/s/desktop/4e7ec2e0/img/favicon.ico
// @description  Drag to the search bar and download any video from any part of youtube to 6 different instances including external program smplayer.exe
// @license       MIT   feel free to modify improve and share
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/428004/Drag%20and%20download%20any%20youtube%20video%20to%206%20instances%20including%20smplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/428004/Drag%20and%20download%20any%20youtube%20video%20to%206%20instances%20including%20smplayer.meta.js
// ==/UserScript==

    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = "#search-input.ytd-searchbox-spt input{font-family:Courier !important;font-size:13px;height:13px !important;}span#nociv{cursor:pointer;padding:0 5px 0 5px;} span#nociv:hover{border:1px solid #ffa500;} f{color:#06fbf0;font-size:11px;letter-spacing: 0.2rem;} f:hover{font-size: 12px;}";

    document.getElementsByTagName('head').item(0).appendChild(style);

var search1 = document.createElement("input");
    search1.id = "linkInput1";
    search1.type = "text";
    search1.value = "";
    search1.placeholder = "Arrastra videos aqui!";
    search1.style.width = "100%";
    search1.style.height = "15px";
    search1.style.background = "#2b3465";
    search1.style.color = "white";
    search1.style.padding = "0px 0px";
    search1.style.textAlign = "center";

    var targetElement = document.querySelectorAll("[id='search-input']");
    if(targetElement){
      for(var i = 0; i < targetElement.length; i++){
        if(targetElement[i].className.indexOf("ytd-searchbox-spt") > -1){
            targetElement[i].appendChild(search1);
        }}}

    search1.addEventListener("input",function(){
    if(search1.value.indexOf("watch?v=") > 1){
        var Button1 = document.createElement("span");
        var Button2 = document.createElement("span");
        var Button3 = document.createElement("span");
        var Button4 = document.createElement("span");
        var Button5 = document.createElement("span");
        var Button6 = document.createElement("span");
        var Button7 = document.createElement("span");
        var Button8 = document.createElement("span");
        var Button9 = document.createElement("span");
        var aText1 = document.createElement("f");
        var aText2 = document.createElement("f");
        var aText3 = document.createElement("f");
        var aText4 = document.createElement("f");
        var aText5 = document.createElement("f");
        var aText6 = document.createElement("f");
        var aText7 = document.createElement("f");
        var aText8 = document.createElement("f");
        var aText9 = document.createElement("f");
        Button1.id = "nociv";
        Button2.id = "nociv";
        Button3.id = "nociv";
        Button4.id = "nociv";
        Button5.id = "nociv";
        Button6.id = "nociv";
        Button7.id = "nociv";
        Button8.id = "nociv";
        Button9.id = "nociv";
        Button1.style.backgroundColor = "#9a0808";
        Button2.style.backgroundColor = "#135282";
        Button3.style.backgroundColor = "#1d6d1d";
        Button4.style.backgroundColor = "#8a4c0c";
        Button5.style.backgroundColor = "#5f335f";
        Button6.style.backgroundColor = "#126b6b";
        Button7.style.backgroundColor = "#8e617c";
        Button8.style.backgroundColor = "#6b6b27";
        Button9.style.backgroundColor = "#567aa7";
        aText1.textContent = "videoID";
        aText2.textContent = "invidious";
        aText3.textContent = "embed";
        aText4.textContent = "smplayer";
        aText5.textContent = "CloudTube";
        aText6.textContent = "deturl";
        aText7.textContent = "Tubo";
        aText8.textContent = "X";
        aText9.textContent = "thumnail";
        Button1.appendChild(aText1);
        Button2.appendChild(aText2);
        Button3.appendChild(aText3);
        Button4.appendChild(aText4);
        Button5.appendChild(aText5);
        Button6.appendChild(aText6);
        Button7.appendChild(aText7);
        Button9.appendChild(aText9);
        Button8.appendChild(aText8);
        document.getElementById("search-input").appendChild(Button1);
        document.getElementById("search-input").appendChild(Button2);
        document.getElementById("search-input").appendChild(Button3);
        document.getElementById("search-input").appendChild(Button4);
        document.getElementById("search-input").appendChild(Button5);
        document.getElementById("search-input").appendChild(Button6);
        document.getElementById("search-input").appendChild(Button7);
        document.getElementById("search-input").appendChild(Button9);
        document.getElementById("search-input").appendChild(Button8);
        search1.style.display = "none";
    var captureText = search1.value;

    Button1.onclick = function () {
//    const link = captureText.replace("youtube.com/watch?v=", "y2mate.com/youtube-mp3/");
//    window.open("" + link, "_blank");
     const link = captureText.replace(/.+=/g, '').replace(/&.+/g, '');
               navigator.clipboard.writeText(link);
    document.querySelectorAll("[id='nociv']").forEach(function(a){
    a.remove()})
    search1.style.display = "initial";
    search1.value="";
    search1.placeholder = "ID "+link+" copiado siga arrastrando videos";
}


    Button2.onclick = function () {
    const link = captureText.replace("www.youtube.com", "yewtu.be");
    window.open("" + link, "_blank");
}

    Button3.onclick = function () {
    const link = captureText.replace("watch?v=", "embed/");
    const link2 = link.replace("&t", "?start");
    window.open("" + link2, "_blank");
}

    Button4.onclick = function () {
    const link = captureText.replace("https://", "");
    window.open("smplayer://" + link, "_self");
}

    Button5.onclick = function () {
    const link = captureText.replace("www.youtube.com", "tube.cadence.moe");
    window.open("" + link, "_blank");
}

    Button6.onclick = function () {
    const link = captureText.replace("", "");
    window.open("http://deturl.com/?url=" + link, "_blank");
}

    Button7.onclick = function () {
    const link = captureText.replace("", "");
    window.open("https://tubo.migalmoreno.com/stream?url=" + link, "_blank");
}
    Button9.onclick = function () {
    const link = captureText.replace("www.youtube.com/watch?v=", "invidious.kavin.rocks/vi/");
    window.open("" + link + "/maxres.jpg", "_blank");
}
    Button8.onclick = function () {
    document.querySelectorAll("[id='nociv']").forEach(function(a){
    a.remove()})
    search1.style.display = "initial";
    search1.value="";
    search1.placeholder = "Arrastra videos aqui!";
}
    }

    else{
    document.querySelectorAll("[id='nociv']").forEach(function(a){
    a.remove()})
    search1.value="";
    search1.placeholder = "Arrastra videos aqui!";
  }});
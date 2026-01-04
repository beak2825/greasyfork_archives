// ==UserScript==
// @name         Přehrajto script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Přehrajto
// @author       Matycz
// @match        https://prehrajto.cz/*
// @match        https://prehraj.to/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=prehrajto.cz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464164/P%C5%99ehrajto%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/464164/P%C5%99ehrajto%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';
function start(){
    document.body.remove();
    document.head.remove();

    let informace = "["
for (let index = 0; index < sources.length; index++) {
    if(Boolean(sources[index])){
    informace = informace + "{src: '"+sources[index].src+"',label: '"+sources[index].label+"'},"
    }
}
informace = informace.slice(0,informace.length-1)
informace = informace + "]"

var videotrack = [{"src":"","label":""}]
var videobool = false
var xhodnota = 0

while (!Boolean(sources[xhodnota])) {
xhodnota++
}
videotrack[0].src = sources[xhodnota].src
videotrack[0].label = sources[xhodnota].label

    function novyblob(datas) {
    let blob = new Blob([datas],{type:"text/html"});
    let url = URL.createObjectURL(blob);
    return url;
    }

    let q1 = document.createElement("head");
    q1.innerHTML = '';
    document.querySelector("html").appendChild(q1);
    let q2 = document.createElement("body");
    document.querySelector("html").appendChild(q2);

    let videa = ""
    let vzdalenostvd = 19
    let barva = "#6657ce"
try {
    for (let index = 0; index < sources.length; index++) {
    videa = videa + `<div class="vd" style="height: 15%;width: 90%;border-radius: 1vmin;background-color: `+barva+`;transform: translateX(-50%);left: 50%;transition: 0.3s all;position: absolute;top: `+vzdalenostvd+`%;"><p style="height: 0%;font-size: 3vmin;top: -14%;position: relative;">`+sources[index].label+`</p><button onclick="stahovani(this)" style="background-color: #55bb55;border: 0.3vmin solid black;margin-right: 3%;border-radius: 1vmin;font-family: cursive;padding: 2.5%;font-size: 2vmin;">Stáhnout</button><button onclick="kvalita(this)" style="background-color: #ff5050;border: 0.3vmin solid black;margin-left: 3%;border-radius: 1vmin;font-family: cursive;padding: 2.5%;font-size: 2vmin;">Nastavit</button></div>`
    vzdalenostvd = vzdalenostvd + 18
    barva = "#bb5c5c"
}
} catch (error) {
    for (let index = 0; index < sources.length-1; index++) {
    videa = videa + `<div class="vd" style="height: 15%;width: 90%;border-radius: 1vmin;background-color: `+barva+`;transform: translateX(-50%);left: 50%;transition: 0.3s all;position: absolute;top: `+vzdalenostvd+`%;"><p style="height: 0%;font-size: 3vmin;top: -14%;position: relative;">`+sources[index+1].label+`</p><button onclick="stahovani(this)" style="background-color: #55bb55;border: 0.3vmin solid black;margin-right: 3%;border-radius: 1vmin;font-family: cursive;padding: 2.5%;font-size: 2vmin;">Stáhnout</button><button onclick="kvalita(this)" style="background-color: #ff5050;border: 0.3vmin solid black;margin-left: 3%;border-radius: 1vmin;font-family: cursive;padding: 2.5%;font-size: 2vmin;">Nastavit</button></div>`
    vzdalenostvd = vzdalenostvd + 18
    barva = "#bb5c5c"
}
}

    let titulky = ""
    try {
    for (let index = 0; index < tracks.length; index++) {
    titulky = titulky+"<track src='"+tracks[index].src+"' kind='captions' srclang='cs' label='"+tracks[index].label+"' default>"
    }
    } catch (error) {

    }

    let titulkyurl = ""
    try {
    for (let index = 0; index < tracks.length; index++) {
    titulkyurl = titulkyurl + `<a href='#' style="color: black;font-size:7.8vmin;transition: 0.3s all;" onclick='stahnouttitulky("`+tracks[index].src+`", "`+tracks[index].label+`.vtt");'>`+tracks[index].label+`</a><br style="display: block;margin-top: 2vmin;content: &quot;&quot;;">`
    }
    titulkyurl = titulkyurl+"<style>a:hover {background-color:#bb5c5c;padding:2vmin;border-radius:2vmin;translate:1s all;}body{text-align: center;font-family: cursive;}</style>"
    titulkyurl = titulkyurl+`<script>
    function downloadURI(uri, name){
    let link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}

function stahnouttitulky(adresa,nazev){
const xhttp = new XMLHttpRequest();
xhttp.onload = function() {
let text = this.responseText;
this.blob = new Blob([text],{type:"text/vtt"})
this.url = URL.createObjectURL(this.blob)
downloadURI(this.url, nazev)
}
xhttp.open("GET", adresa, true);
xhttp.send();
}
    </script>`
    } catch (error) {
    titulkyurl = titulkyurl+"<p>Titulky zde nejsou</p><style>p {background-color:#bb5c5c;padding:2vmin;border-radius:2vmin;translate:1s all;}body{text-align: center;font-family: cursive;}</style>"
    }
    let titulkyiframe = novyblob(titulkyurl)
    let data = `
    <meta charset="UTF-8">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/video.js/5.10.2/alt/video-js-cdn.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/video.js/5.10.2/video.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-hls/3.0.2/videojs-contrib-hls.js"></script>
    <video id="video" class="video-js vjs-default-skin" preload="none" crossorigin="true" controls width="640" height="268" controls></video>

    <div style="height: 96%;width: 42.8%;position: fixed;left: 56.6%;top: 1.4%;font-family: cursive;">
    <div style="height: 100%;width: 50%;background-color: #bb5c5c;position: absolute;text-align: center;">
    <h1 style="font-size: 7vmin;">Videa</h1>`+videa+`

    </div>
    <div style="height: 100%;width: 50%;background-color: #6657ce;left: 50%;position: absolute;text-align: center;">
    <h1 style="font-size: 7vmin;">Titulky</h1><iframe src="`+titulkyiframe+`" style="border: none;height: 75%;width: 88%;"></iframe>
    </div>
    </div>
<script>
    document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('video').innerHTML = "<source src='`+videotrack[0].src+`' label='`+videotrack[0].label+`' type='video/mp4'>`+titulky+`";
    setTimeout(()=>{document.querySelector("div").style = "position: absolute;top: 1.4%;left: 0.6%;height: 96%;width: 55.4%;"},100)
    var ply = videojs("video");
    ply.play();
});

let sources = `+informace+`
    function kvalita(e){
    for (let index = 0; index < document.querySelectorAll(".vd").length; index++) {
        document.querySelectorAll(".vd")[index].style.backgroundColor = "#bb5c5c"
    }
    e.parentElement.style.backgroundColor = "#6657ce"
    let nazev = e.parentElement.querySelector("p").innerHTML
    for (let index = 0; index < sources.length; index++) {
        if (sources[index].label==nazev) {
            document.querySelector("video").src = sources[index].src
        }
    }
    }

const downloadVideo = (url,inf,nazev,e) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';

  xhr.onload = () => {
    if (xhr.status === 200) {
      const blob = xhr.response;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      e.innerHTML = "<a href='"+url+"' download='video.mp4' style='color: black;'>Stáhnout</a>"
      a.download = 'video.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  xhr.onprogress = (event) => {
    const percentComplete = (event.loaded / event.total) * 100;
    inf.innerHTML = nazev+" Staženo: "+percentComplete.toFixed(2)+"%";
  };

  xhr.open('GET', url);
  xhr.send();
};

function stahovani(e) {
let nazev = e.parentElement.querySelector("p").innerHTML
let odk = e.parentElement.querySelector("p")
for (let index = 0; index < sources.length; index++) {
    if (nazev == sources[index].label) {
        downloadVideo(sources[index].src,odk,nazev,e);
    }
}
}
</script>
    `
    let blob = new Blob([data],{type:"text/html"})
    let url = URL.createObjectURL(blob)
    q2.innerHTML = '<iframe src="'+url+'"></iframe>';
    document.body.style.padding = "0"
    document.body.style.margin = "0"
    document.querySelector("iframe").style = "height: 100%;width: 100%;position: absolute;border: none;"
}
    if(window.location.href.slice(0, 28)!="https://prehrajto.cz/hledej/"&&window.location.href!="https://prehrajto.cz/"&&window.location.href.slice(0, 26)!="https://prehraj.to/hledej/"&&window.location.href!="https://prehraj.to/"){
    start()
    }
})();
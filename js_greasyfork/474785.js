// ==UserScript==
// @name            Listen to the audio of the youtube video before opening it
// @name:es       Escuche el audio del vídeo de youtube antes de abrirlo.
// @namespace   https://greasyfork.org/es/users/758165-AlÉxito
// @match          https://www.youtube.com/*
// @include         http://*
// @include         https://*
// @version         1.1
// @author           AlExito
// @grant            GM_xmlhttpRequest
// @description    Listen to the audio of the youtube video before opening it. It works on many pages where there are youtube videos such as google searches or invidious instances
// @description:es    Escuche el audio del vídeo de youtube antes de abrirlo. Funciona en muchas paginas donde hay videos de youtube como busquedas de google o instancias odiosas.
// @license        MIT   feel free to modify improve and share
// @downloadURL https://update.greasyfork.org/scripts/474785/Listen%20to%20the%20audio%20of%20the%20youtube%20video%20before%20opening%20it.user.js
// @updateURL https://update.greasyfork.org/scripts/474785/Listen%20to%20the%20audio%20of%20the%20youtube%20video%20before%20opening%20it.meta.js
// ==/UserScript==
document.body.addEventListener("keydown", function(){
let value= event.which;
 if(value === 120){   //key "F9"
    const a = document.querySelector('a:hover');
    if (a) {
    document.querySelectorAll("[id='audio-player']").forEach(function(a){
    a.remove()})
        var myStr = a.href;
        var idvid = myStr.replace(/.+\/shorts\//, '').replace(/.+v=/, '').slice(0, 11);
        var newStr = myStr.replace(/&.*/, '').replace(location.hostname, 'youtube.com');
GM_xmlhttpRequest({
  method: "GET",
  url: newStr,
  headers: {
    "Content-Type": "application/json"
  },
  onload: function(response) {
              const audiourla = response.responseText.match(/"itag":140,"url":".+?","mimeType/);
    if(audiourla){
              const audiourlb = audiourla.toString().replaceAll("\\u0026","&").replace(/"itag":140,"url":"/, "").replace(/","mimeType/, "");
    reprod(audiourlb);
      } else {
var audiourlb = "https://yewtu.be/latest_version?id="+idvid+"&itag=140";
        reprod(audiourlb);
      };
  }
});
      e.preventDefault();
      e.stopPropagation();
    }
};
})
function reprod(audiourlb) {
var sound = document.createElement('audio');
sound.id = 'audio-player';
sound.controls = 'controls';
sound.src = audiourlb;
sound.type = 'audio/mp4';
sound.allow = "autoplay";
sound.style.bottom ="0%";
sound.style.left ="-1%";
sound.style.position ="fixed";
sound.style.width ="-webkit-fill-available";
sound.style.zIndex = '999999';
sound.style.transform = "scale(0.8)";
document.body.appendChild(sound);
sound.play();
document.querySelector('audio').playbackRate=1;
var button = document.createElement('button');
button.id = 'audio-player';
button.style.position = 'fixed';
button.style.zIndex = '999999';
button.style.bottom ="2%";
button.style.right ="9%";
button.style.transform = "scale(1.5)translate(0px, 0px)";
button.style.background ="#fff";
button.style.color = "#333";
button.textContent = 'X';
document.body.appendChild(button);
button.onclick = function () {
document.querySelectorAll("[id='audio-player']").forEach(function(a){
    a.remove()})
}
}




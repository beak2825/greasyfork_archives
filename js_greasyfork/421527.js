// ==UserScript==
// @name Youtube Download
// @namespace YoutubeDownload
// @description Añade dos botones a youtube para descargar MP4 y MP3
// @author tejonaco
// @contributionURL Bitcoin:3M93ygVV3RfL9M9dRJNcxaj3szuk3z5GZa
// @version 1.1
// @date 2021-02-07
// @icon https://i.pinimg.com/originals/f0/bf/e6/f0bfe6f3b051934eb67b1b49e9481be4.png
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/421527/Youtube%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/421527/Youtube%20Download.meta.js
// ==/UserScript==

// SECONDS TO UPDATE VIDEO
videoUpdateTime = 5


terminado = false;
url = document.URL

if (!url.match('.+youtube.com/watch.+')){  // PARA LA NAVEGACION EN OTRAS PAGINAS
  terminado = true
}


// EJECUTAR CUANDO ENCUENTRE EL BOTON
setInterval(function() {
  // DETECTAR CAMBIO DE VIDEO
    if (url != document.URL){
      url = document.URL
      terminado = false
    }
  
    if (!terminado){
      descripcion = document.querySelector('ytd-video-owner-renderer.ytd-video-secondary-info-renderer')
      hueco_descarga = document.createElement('div')

      if(descripcion){
        hueco_descarga.style.display = 'contents'
        hueco_descarga.style['text-align'] = 'center'
        
        // IDENTIFICADOR VIDEO
        regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        match = String(url).match(regex);
        video_id = match[7]
        
        add_boton('▼', 'https://www.ytdownfk.com/search?url=' + video_id);
        descripcion.appendChild(hueco_descarga)
        
        terminado = true
      }
    }
  }, videoUpdateTime  * 1000)

  

// AÑADIR BOTON
function add_boton(texto, link) {
  if (!document.getElementById(texto)){
    funcion_click = "window.open(\'" + link + "\')"
    hueco_descarga.innerHTML += ' <tp-yt-paper-button subscribed onclick="' + funcion_click + '" id="' + texto + '" target="_blank" style="display:inline; vertical-align: middle" class="ytd-subscribe-button-renderer"><a style="text-decoration: none; color: inherit;" class="style-scope ytd-subscribe-button-renderer">' + texto + '</a></paper-button>';
  }else{
    // CAMBIAR EL ENLACE SIN AÑADIR UN NIEVO BOTON
    document.getElementById(texto).onclick = function() {
    window.open(link)
    }
  }
};
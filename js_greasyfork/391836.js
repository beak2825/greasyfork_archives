// ==UserScript==
// @name         Script Azis
// @namespace    www.tinychat.com
// @version      0.9
// @description  Script bendecido por Azis para la eliminación de los videos codificados de Canal Plus
// @author       Circulo
// @match        https://tinychat.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391836/Script%20Azis.user.js
// @updateURL https://update.greasyfork.org/scripts/391836/Script%20Azis.meta.js
// ==/UserScript==

var temporizador = setInterval(azis,1000); // cada segundo, se quitan los candados

// Quita los candados de los videos
function azis() {

    // HTML DOM del contenido
    var elmContenido;
    // HTML DOM que contiene la lista de ítems de vídeos
    var elmVideoList;
     // HTML DOM que contiene los ítems de vídeos
    var elmVideoItems;
    // HTML DOM que contiene un ítem de vídeo
    var elmVideoItem;

    var blured; // el candado que se quiere quitar

    // Estilo de los vídeos sin candado
    var videoStyle = `.video:hover > div > svg {
  top:-24px;left:-24px;transition:.2s ease .2s;
}

.video:hover > div.pro:after, .video:hover > div.extreme:after, .video:hover > div.gold:after {
  top:-24px;right:-24px;transition:.2s ease .2s;
}

.video:hover > div > .overlay {
  box-shadow:inset 0 0 100px 0 rgba(0, 0, 0, .5);
}

.video:hover > div > .overlay > .icon-visibility, .video:hover > div > .overlay > .icon-resize, .video:hover > div > .overlay > .icon-report, .video:hover > div > .overlay > .icon-filter, .video:hover > div > .overlay > .icon-close {
  top:12px;transition:top .2s ease .2s,
                            left .2s ease .2s,
                            right .2s ease .2s,
                            opacity .2s;
}

.video:hover > div > .overlay > .icon-visibility {
  left:14px;
}

.video:hover > div > .overlay > .icon-report, .video:hover > div > .overlay > .icon-close {
  right:14px;
}

.video:hover > div > .overlay > .icon-filter {
  right:12px;
}

.video:hover > div > .overlay > .icon-context {
  bottom:7px;right:16px;transition:bottom .2s ease .2s,
                            right .2s ease .2s,
                            opacity .2s;
}

.video:hover > div > .overlay > .icon-context:focus + .video-context {
  opacity:1;visibility:visible;
}

.video:hover > div > .overlay > .icon-volume {
  left:16px;bottom:16px;transition:bottom .2s ease .2s,
                            left .2s ease .2s,
                            opacity .2s;
}

#videos-content > #videos > .video:hover > div > svg {
  top:-24px;left:-24px;transition:.2s ease .2s;
}

.video:hover > div > .nickname {
  bottom:50%;transition:.2s ease .2s;
}

.video.blured > div > video{
  filter: blur(0px);
}
`;
    
    var numVideo;

    elmContenido = document.getElementById("content");
    elmVideoList = elmContenido.shadowRoot.querySelector("tc-videolist");
    elmVideoItems = elmVideoList.shadowRoot.querySelectorAll("tc-video-item");

    numVideo = 0;
    while(numVideo < elmVideoItems.length) // para cada video, se hace lo siguiente
    {
        // Se quita el candado
        elmVideoItem = elmVideoItems[numVideo].shadowRoot.querySelector(".video");
        blured = elmVideoItem.querySelector(".blured");
        if(blured !== null)
        {
            blured.remove();
        }

        // Se mantiene el estilo de los vídeos sin candado
        if(elmVideoItems[numVideo].shadowRoot.querySelector("#estiloCambiado") == null)
        {
            elmVideoItems[numVideo].shadowRoot.querySelector("style").innerHTML += videoStyle;
            elmVideoItems[numVideo].shadowRoot.querySelector("style").setAttribute("id","estiloCambiado"); // El estilo se cambia solo una vez
        }

        numVideo++;
    }
};
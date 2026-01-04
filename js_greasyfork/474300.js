// ==UserScript==
// @name            Hide videos that are in playlist
// @name:es       Ocultar vídeos que estan en la lista de reproduccion
// @namespace   https://greasyfork.org/es/users/758165-AlÉxito
// @match           https://www.youtube.com/*
// @version         1.2
// @author           AlExito
// @description   When you are adding videos to your playlists Sometimes you don't remember if you've already added that video. This script puts an H button next to the search bar to Hide videos you've already added to your playlists, so there are no duplicate videos in your playlists.
// @description:es   Cuando estas agregando videos a tus listas de reproduccion a veces no recuerdas si ya has agregado ese video. Este script pone un  botón H  junto a la barra de busqueda  para Ocultar videos que ya agregaste a tus listas de reproducción, para que no haya videos duplicados en tus listas.
// @license          MIT   feel free to modify improve and share
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/474300/Hide%20videos%20that%20are%20in%20playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/474300/Hide%20videos%20that%20are%20in%20playlist.meta.js
// ==/UserScript==

(function () {
  function action1(head) {
        var hvipbut = document.createElement("button");
        var aEtiquetc = document.createElement("p");
        hvipbut.id = "hvip";
        hvipbut.setAttribute("style", "z-index: 9999;padding: 6px 10px;background-color: #0f0f0f;cursor: pointer;border: 1px solid #2b3465;");
        aEtiquetc.setAttribute("style", "color: #7af;font-size: 20px !important;line-height: 25px;height: 25px;text-transform: capitalize;");
        aEtiquetc.setAttribute("title", "Hide videos that are in playlist");
        aEtiquetc.textContent = "H";
        hvipbut.appendChild(aEtiquetc);
        document.querySelector("#masthead > #container > #center").appendChild(hvipbut);
        hvipbut.onclick = function () {
         var count = 0;
         var urlist = [];
         var array1 = [];
         actiona(count, urlist);
        };
function actiona(count, urlist, array1){
var index = ["WL", "PLo29ME-MyPlAyLiSt-0vukQAqlG6R"];  // Add your playlist ID in this line
var canti = index.length;
    if(count < canti){
    var url = "https://www.youtube.com/playlist?list=" + index[count];

            const xhr = new XMLHttpRequest()
            xhr.open('GET', url)
            xhr.onload = function()
            {
      var pleylistvidylistvid = xhr.responseText.toString().replace(/webCommandMetadata":{"url":"/g, '\n').replace(/\\u0026list=/g, '\n');
         if(pleylistvidylistvid){
           var itemsa = pleylistvidylistvid.match(/watch\?v=...........+?/g);
           let array2 = [].concat(array1, itemsa);
      count++;
      actiona(count, urlist, array2);
           };
      };
      xhr.send();

    } else if(count == canti){
      actionb(array1);
    };
};

function actionb(array2){
    var elementos = document.querySelectorAll(["ytd-grid-video-renderer", "ytd-rich-item-renderer", "ytd-compact-video-renderer", "ytd-video-renderer"]);
            for (let i = elementos.length-1; 0 <= i ; i--){
            let video=elementos[i];
               let video_url = video.querySelector("a").href.replace("https://www.youtube.com/", "").replace(/&.+/g, "");
     if(array2.includes(video_url)){
       video.setAttribute("style", "display: none !important;");
     };
    };
   };
 };

  setTimeout(action1, 5000);
})();


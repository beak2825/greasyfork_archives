// ==UserScript==
// @name        theYNC Play & download
// @name:es     theYNC Ver y descargar
// @namespace   https://theync.com
// @match       https://theync.com/*
// @grant       none
// @version     1.0
// @author      Nyarlathotep
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @compatible edge
// @license      MIT
// @description To view and download theYNC UNDERGROUND vids without Underground subscription, note that this script not give access to all bonus content, if you enjoy theYNC plz subscribe!
// @description:es Para ver y descargar los videos UNDERGROUND sin una subscripcion, notar que esto no te da acceso a todo el contenido bonus, si te gusta subscribete!
// @downloadURL https://update.greasyfork.org/scripts/437618/theYNC%20Play%20%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/437618/theYNC%20Play%20%20download.meta.js
// ==/UserScript==


// Primera etapa UNDERGROUND, funcion primaria que extrae el enlace de la imagen, le hace magia y lo enlaza para poder abrirlo en una nueva pestaña
$("div.item-normal.item-block.item-border.col > div.inner-block span.image img").each(function(index) {
    
  direccion = $(this).prop("src").replace("thumbs", "media").replace("thumbs", "videos");

    if (direccion.includes("mp4")){			
  
  	  $(this).closest('a').attr('href',direccion.slice(0, direccion.indexOf("mp4") + 3)).attr('target','_blank');

    }
  						
  	  if (direccion.includes("wmv")){
  				
        $(this).closest('a').attr('href',direccion.slice(0, direccion.indexOf("wmv"))+ "mp4",).attr('target','_blank');

      }
                

});


//Segunda etapa, videos normales con icono de descarga directa

const buttonId = 'download-video-button';
const iconPath = 'https://cdn4.iconfinder.com/data/icons/24x24-free-pixel-icons/24/Save.png';
const tooltipText = 'Download Video';

jwplayer().addButton(iconPath, tooltipText, buttonClickAction, buttonId);

// Se ejecuta cuando apretas el botoncito
function buttonClickAction() {
  const playlistItem = jwplayer().getPlaylistItem();

  // Create an anchor element
  const anchor = document.createElement('a');

  // Set the anchor's `href` attribute to the media's file URL
  const fileUrl = playlistItem.file;
  anchor.setAttribute('href', fileUrl);

  // set the anchor's `download` attribute to the media's file name
  const downloadName = playlistItem.file.split('/').pop();
  anchor.setAttribute('download', downloadName);

  // Set the anchor's style to hide it when it's added to the page
  anchor.style.display = 'none';

  // Add the anchor to the page
  document.body.appendChild(anchor);

  // Trigger a click event to activate the anchor
  anchor.click();

  // Remove the anchor from the page, it's not needed anymore
  document.body.removeChild(anchor);
}
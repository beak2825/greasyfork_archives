// ==UserScript==
// @name         Download MP3 de youtube
// @namespace    niIdea
// @version      0.204
// @description  Gracias al servicio de odg.youtube6download.top, con este script podemos añadir un botón el cual redirigira a dicha página para descargar la canción en MP3. Además, en dicha página, hará click en el botón de descargar (una vez que este disponible), y cerrara automaticamente la página.
// @author       Mnt
// @match        http*://*.youtube.com/*
// @match        http*://y-api.org/*
// @require http://code.jquery.com/jquery-latest.js
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/35298/Download%20MP3%20de%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/35298/Download%20MP3%20de%20youtube.meta.js
// ==/UserScript==

if(location.hostname=='www.youtube.com'){
    window.addEventListener('yt-navigate-finish', nuevoVideo, false);//Evento carga nuevo video version moderna youtube
    window.addEventListener('spfdone', nuevoVideo, false);//Evento carga nuevo video version antigua de youtube
}
function nuevoVideo() {
    //Esperamos medio segundo(500ms) para crear el botón. Si no a veces no había cargado el elemento donde queremos agregar el botón. En caso de no aparecer el botón se puede pobrar aumentar ese tiempo (500)
    setTimeout(function(){ crearBoton(); }, 500);
}
crearBoton = function() {
    //Elemento donde queremos crear el botón.
    //var elemento = document.querySelector('#subscribe-button');
    var elemento = document.querySelector('#items.ytd-watch-next-secondary-results-renderer');
    //var elemento = document.querySelector('#top');
    if (elemento !== null) {
        var botonExiste = document.getElementById('botonDownloadId');
        if (botonExiste === null) {
            var botonDownload = document.createElement("div");
            botonDownload.id= 'botonDownloadId';
            botonDownload.style = "cursor:pointer;background-color: green;border-radius: 2px;color: var(--yt-subscribe-button-text-color);padding: 10px 16px;margin: 0 0 10px;white-space: nowrap;font-size: 1.4rem;font-weight: 500;letter-spacing: .007px;text-transform: uppercase;display: flex;-ms-flex-direction: row;-webkit-flex-direction: row;flex-direction: row;";
            botonDownload.onclick = clickDownload;
            botonDownload.appendChild(document.createTextNode('Mp3'));
            //elemento.parentNode.insertBefore(botonDownload, elemento.nextSibling); //Despues del elemento selecionado
            elemento.parentNode.insertBefore(botonDownload, elemento);   //Antes del elemento selecionado

        }
    }
};
clickDownload = function(){
    let url= new URL(location.href);
    let i=url.searchParams.get('v');
    //var enlace='https://api.youtube6download.top/fetch/link.php?i=' + i;
    var enlace='https://y-api.org/button/?v=' + i;
    GM_openInTab(enlace, 'insert');
};

//Si estamos en la página para descargar el mp3...
if(location.hostname=='y-api.org'){
    var intervalCheck = setInterval(function() {
        downloadMp3AndCloseNew();
    }, 500);
}
function downloadMp3AndCloseNew(){
    var enlace=document.querySelector('#button a').href;
    if(enlace!=='undefined' && enlace!=='' && enlace!='https://y-api.org/'){
        //window.location.href = enlace;
        GM_openInTab(enlace, 'insert');
        console.log(enlace);
        clearInterval(intervalCheck);
        window.close();
        //setTimeout(function(){ window.close(); }, 2000);
        //window.location.location.replace(enlace);
    }
}

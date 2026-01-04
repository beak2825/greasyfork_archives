// ==UserScript==
// @name         youtube video time figuccio
// @namespace    https://greasyfork.org/users/237458
// @version      0.6
// @description  mostra time sui video
// @author       figuccio
// @match        *://*.youtube.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @run-at       document-end
// @grant        unsafeWindow
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/479186/youtube%20video%20time%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/479186/youtube%20video%20time%20figuccio.meta.js
// ==/UserScript==
(function () {
 'use strict';
    /////////////////////time
    let timeout;
    let videoElement;

    // Crea un div contenitore
    const containerDiv = document.createElement("div");
    containerDiv.style.cssText = `position:fixed;top:10px;right:10px;display:flex;align-items:center;z-index:999999999;`;

    //Crea un div rettangolare arrotondato che visualizza l'ora
    const timeDiv = document.createElement("div");
    timeDiv.title="Data-ora";
    timeDiv.style.cssText = `
    background-color: rgba(0, 0, 0, 0.5);
    color:lime;
    font-size:15px;
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;
    font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
    font-weight: bold;
    border:2px solid green;
`;

    containerDiv.appendChild(timeDiv);//orologio

    function initialize() {
        updateTime();
    }

    function updateTime() {
        findvideo(); // Emette il valore di videoElement
        const now = new Date();
                  //data
        const date = new Date().toLocaleString('it', {'weekday': 'short', 'month': 'long', 'day': '2-digit','year':'numeric'});
        /////////////////////ore-minuti-sec-millisec
        const time = new Date().toLocaleTimeString();
        const sss = new Date().getMilliseconds();

        timeDiv.textContent =date +" - "+ time +":"+ sss;//giorno-mese-anno h m s
        setTimeout(updateTime, 200);//Continua ad aggiornare l'ora 1000 /200 ms
    }

    // Scatta nell'angolo in alto a destra del video
    function stickToTopRight() {
        if (videoElement) {
            // Ottieni le informazioni sulle dimensioni e sulla posizione del lettore video
            const videoRect = videoElement.getBoundingClientRect();
            // Imposta la posizione del div contenitore, fissata nell'angolo in alto a destra
            containerDiv.style.top = `${videoRect.top + 10}px`;
            containerDiv.style.right = `${document.documentElement.clientWidth - videoRect.right + 10}px`;
        }
    }

    // Aggiorna la posizione del div contenitore e mantienilo fisso quando la finestra del video viene ridimensionata o viene visualizzata a schermo intero
    function updatePosition() {
        stickToTopRight();
        setTimeout(updatePosition, 500); // Aggiorna la posizione ogni 0,5 secondi 500
    }

    function findvideo() {
        if (window.location.href.includes("www.bilibili.com/video/")) {
            videoElement = document.querySelector("bwp-video");
            if (!videoElement) {
                videoElement = document.querySelector("video");
                if (0 == (new Date().getSeconds() % 2)) console.log("222:" + videoElement);
            }
            else if (0 == (new Date().getSeconds() % 2)) console.log("111:" + videoElement);
        } else {
            videoElement = document.querySelector("video");
            if (0 == (new Date().getSeconds() % 2)) console.log("222:" + videoElement);
        }
        if (null == videoElement) {
            containerDiv.style.display = "none";
        }
        else {
            containerDiv.style.display = "flex";
        }

    }

    // Monitora le modifiche dello stato a schermo intero e aggiungi il div contenitore al livello a schermo intero
    function handleFullscreenChange() {
        if (document.fullscreenElement) {
            // Aggiungi il div contenitore all'elemento a schermo intero quando accedi a schermo intero
            document.fullscreenElement.appendChild(containerDiv);
        } else {
            // Aggiungi nuovamente il div contenitore alla pagina quando esci dalla modalità a schermo intero
            document.body.appendChild(containerDiv);
        }

    }

    // Chiama le funzioni di inizializzazione e aggiornamento della posizione per avviarne l'aggiornamento in tempo reale
    initialize();
    updatePosition();

    // Aggiungi il div contenitore alla pagina
    document.body.appendChild(containerDiv);

    // Ascolta gli eventi di modifica dello stato a schermo intero
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    })();
    
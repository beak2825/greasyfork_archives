// ==UserScript==
// @name         Youtube Dark figuccio
// @namespace    https://greasyfork.org/users/237458
// @version      14.0
// @description  youtube dark mode stop riproduzione autom
// @author       figuccio
// @match        https://*.youtube.com/*
// @match        https://consent.youtube.com/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes
// @icon         https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/402823/Youtube%20Dark%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/402823/Youtube%20Dark%20figuccio.meta.js
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
            containerDiv.style.right = `${document.documentElement.clientWidth - videoRect.right + 30}px`;//+30 cosi se passo ha mini player posso chiudere con la x più facilmente
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
     // Funzione per fare clic sul pulsante "Accetta" dei cookie e impostare le preferenze marzo 2024
    function accettaCookieEImpostaPreferenze() {
        var accettaButton = document.querySelector("#content > div.body.style-scope.ytd-consent-bump-v2-lightbox > div.eom-buttons.style-scope.ytd-consent-bump-v2-lightbox > div:nth-child(1) > ytd-button-renderer:nth-child(2) > yt-button-shape > button > yt-touch-feedback-shape > div.yt-spec-touch-feedback-shape__fill")
;
        if (accettaButton) {
            accettaButton.click(); // Fai clic sul pulsante "Accetta"
            console.log("Pulsante 'Accetta' dei cookie su YouTube cliccato!");

            // Imposta i cookie per le preferenze
            document.cookie ="PREF=f6=40000400&f7=140;domain=.youtube.com"; // Imposta il tema scuro, l'illuminazione cinematografica disattivata, ecc.
            console.log("Preferenze impostate!");
        } else {
            console.log("Pulsante 'Accetta' dei cookie su YouTube non trovato.");
        }
    }

    // Attendi che il documento sia completamente caricato prima di fare clic sul pulsante e impostare le preferenze
    window.addEventListener('load', function() {
    setTimeout(accettaCookieEImpostaPreferenze, 3000); // Imposta un ritardo di 3 secondi prima di fare clic sul pulsante e impostare le preferenze (modificabile a seconda delle esigenze)
    });
  ////////////////////////mostra % volume/////
   let previousVolume = -1;
    function displaySquareVolume() {
        const player = document.getElementById('movie_player');
        const currentVolume = player.getVolume();

        if (currentVolume !== previousVolume) {
            previousVolume = currentVolume;
            const squareVolume = document.querySelectorAll('div[data-layer="4"]');
            squareVolume.forEach((div) => {
                if(div.className === 'ytp-bezel-text-hide') {
                    div.classList.remove('ytp-bezel-text-hide');
                }
                if (div.classList.length === 0) {
                    const ytpBezelTextWrapper = div.querySelector('.ytp-bezel-text-wrapper');
                    ytpBezelTextWrapper.title="Volume";
                    const ytpBezelText = ytpBezelTextWrapper.querySelector('.ytp-bezel-text');
                    const ytpBezel = div.querySelector('.ytp-bezel');
                    div.style.display = 'block';

                    if (ytpBezelText && ytpBezel) {
                        ytpBezelText.innerText = currentVolume + "%";
                        ytpBezel.style.display = 'none';
                    }

                    setTimeout(()=> {
                        div.style.display = 'none';
                    }, 20000);//resta fisso per 20 secondi
                }
            });
        }
    }

    function checkVideoExists() {
        const videoElement = document.querySelector('video');
        if (videoElement) {
            videoElement.addEventListener('volumechange', displaySquareVolume);
            previousVolume = videoElement.volume * 100;
        }
    }

    const observer = new MutationObserver(checkVideoExists);
    const body = document.body;
    const config = {childList: true, subtree: true};
    observer.observe(body, config);
    GM_addStyle('.ytp-bezel-text-wrapper{color:green;cursor:pointer;}');//% volume colore verde
    /////////////////////////riproduzione automatica disattivata
   document.addEventListener('yt-navigate-finish', () => {
  // Il codice sarà eseguito solo sulle pagine www.youtube.com/watch?v
  if (!window.location.href.includes("watch")) return;
  var i = window.setInterval(() => {
    const t = document.getElementsByClassName('ytp-autonav-toggle-button')[0];
    if (t.getAttribute('aria-checked') === "true") {
      t.click();
      clearInterval(i); // Interrompe il loop quando la riproduzione automatica è disattivata
    }
  }, 1000);
});
 ////////////////////
                  //shorts e tendenze
GM_addStyle('#dismissible.ytd-rich-shelf-renderer {display:none!important;}');
//Rimuovi Youtube Commenti
GM_addStyle('ytd-comments.style-scope{ display:none !important;}');
//adblock grosso banner youtube premium
GM_addStyle(`#masthead-ad { display:none!important;}`);

//promemoria privacy
document.cookie = "HideTicker=true;domain=.youtube.com;max-age=315360000";
//annotazioni video
GM_addStyle(`.html5-video-player .ytp-cards-button{display:none!important;}`);
//popup non hai eseguito laccesso
GM_addStyle(`yt-tooltip-renderer{display:none!important;}`);
///////////rimuove scritta consigliati allinterno video
GM_addStyle('.ytp-cards-teaser-label{display:none !important;}');
///////////icome home ecc e titoli home tendenze ecc
GM_addStyle('.title,.pieSegment,svg {color:#5f84f1 !important;}');
//scrittura verde
GM_addStyle('.aplos-donut-center-content,.formatted-percentage.yta-explore-table-row,.entity-name.ytcp-navigation-drawer,#tags-count,h3.ytcp-uploads-basics,.source.ytpp-self-certification-predictor span.ytpp-self-certification-predictor,.m10n-icon-section.ytpp-self-certification-predictor span.ytpp-self-certification-predictor,#unplayableText,.content-title,.progress-label.ytcp-video-upload-progress,.issue-text.ytcd-help-center-issues-item,#campaign-title.ytd-donation-shelf-renderer,#published-time,.paddingten,#ctr-title,.label,#keywords-description,.channel-name,#purchase-amount,.paper-input-char-counter,.likes-label,#subtitle,.yt-multi-page-menu-section-renderer,.published-time-text,.yta-table-card,.ytcp-trend-label,.metric-value-absolute,#title-placeholder,#toggle.ytd-grid-renderer,#vote-count-middle,.ytcp-omnisearch,.ytcp-table-header,#vote-count-left,#subscribers,#guide-section-title,.content-text,#embed-label,#upnext,.count-text,.ytd-channel-about-metadata-renderer,#title,#subscriber-count,#byline,#content,.view-count,.yt-simple-endpoint,#account-name {color:green!important;}');

////////////////////////////covid
GM_addStyle('ytd-compact-promoted-item-renderer[view-style=COMPACT_PROMOTED_ITEM_STYLE_RICH_GRID] #dismissible.ytd-compact-promoted-item-renderer{display:none !important;}');
////////////time
 // Salva la posizione nel local storage
function savePosition(left, top) {
GM_setValue('clockPosition', JSON.stringify({ left: left, top: top }));
}

// Recupera la posizione dal local storage
function loadPosition() {
let position = GM_getValue('clockPosition');
return position ? JSON.parse(position) : { left: '200px', top: '10px' };
}

// Crea l'elemento dell'orologio
var clock = document.createElement('div');
clock.style.position = 'fixed';
clock.style.fontSize = '15px';
clock.style.cursor = 'pointer';
clock.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
clock.style.color = 'lime';
clock.style.padding = '5px';
clock.style.borderRadius = '5px';
clock.style.zIndex = '9000';
document.body.appendChild(clock);

// Imposta la posizione iniziale
let initialPosition = loadPosition();
clock.style.left = initialPosition.left;
clock.style.top = initialPosition.top;

// Funzione per aggiornare l'orologio
function updateClock() {
    var now = new Date();
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');
    var seconds = String(now.getSeconds()).padStart(2, '0');
    var milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    clock.textContent = `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

// Aggiorna l'orologio ogni 90 millisecondi
setInterval(updateClock, 90);

// Aggiungi la data al passaggio del mouse
clock.addEventListener('mouseenter', function() {
let currentDate = new Date();
clock.setAttribute('title', currentDate.toLocaleDateString('it', { day: '2-digit', month: 'long', weekday: 'long', year: 'numeric' }));
});

// Funzioni per rendere l'orologio dragabile con limiti
clock.addEventListener('mousedown', function(e) {
    var offsetX = e.clientX - parseInt(clock.style.left);
    var offsetY = e.clientY - parseInt(clock.style.top);

    function mouseMoveHandler(e) {
        var newLeft = e.clientX - offsetX;
        var newTop = e.clientY - offsetY;

        // Limiti per il trascinamento
        var minLeft = 0;
        var maxLeft = window.innerWidth - clock.offsetWidth- 10; // Aggiunto margine di sicurezza impedisce che millisecondi escano fuori schermo se lo sposti a left
        var minTop = 0;
        var maxTop = window.innerHeight - clock.offsetHeight;

        // Applicare i limiti
        if (newLeft < minLeft) newLeft = minLeft;
        if (newLeft > maxLeft) newLeft = maxLeft; // Impedisce al testo di uscire dallo schermo
        if (newTop < minTop) newTop = minTop;
        if (newTop > maxTop) newTop = maxTop;

        clock.style.left = newLeft + 'px';
        clock.style.top = newTop + 'px';
        savePosition(clock.style.left, clock.style.top);
    }

    function reset() {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', reset);
    }

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', reset);
});

///////////////////////////////////////////autochiude menu guide button
     function minimizeSidebarIfOpened() {
        var guide = document.getElementById('guide');
        var menuButton = document.querySelector('#guide-icon.ytd-masthead');
        if (guide && guide.getAttribute('opened') !== null && menuButton) {
            menuButton.click();
        }
    }

    var intervalId = setInterval(minimizeSidebarIfOpened, 2000);

    // Cancella l'intervallo quando non è più necessario
    function clearIntervalIfSidebarClosed() {
        var guide = document.getElementById('guide');
        var menuButton = document.querySelector('#guide-icon.ytd-masthead');
        if ((!guide || guide.getAttribute('opened') === null) && menuButton) {
            clearInterval(intervalId);
        }
    }

    // Controlla se è necessario cancellare l'intervallo ogni 5 secondi
    setInterval(clearIntervalIfSidebarClosed, 5000);
})();

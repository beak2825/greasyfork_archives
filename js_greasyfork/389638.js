// ==UserScript==
// @name		   Cam4 Clean figuccio
// @description    cam colorato 2025
// @version		   18.0
// @author         figuccio
// @match          https://*.cam4.com/*
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_registerMenuCommand
// @run-at         document-end
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @namespace      https://greasyfork.org/users/237458
// @require        http://code.jquery.com/jquery-latest.js
// @require        https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @icon           https://cam4.com/favicon.ico
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/389638/Cam4%20Clean%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/389638/Cam4%20Clean%20figuccio.meta.js
// ==/UserScript==
(function() {
   'use strict';
    function addClock() {
  // Selettore del pulsante esistente clock sulla barra superiore
    const headerElement = document.querySelector("#root > div > div.THmE0 > header > div.rsdM3.AyoJO > div.yLU7N.TcOud > div.f3e13.o_Anz.rbqYB > button");

    if (headerElement) {
        // Creazione dell'elemento orologio
        const clock = document.createElement("div");
        clock.style.display = "inline-block"; // Allinea accanto al pulsante
        clock.style.marginLeft = "10px"; // Distanza tra il pulsante e l'orologio
        clock.style.fontSize = "16px";
        clock.style.color = "lime";
        clock.style.background ="brown";
        clock.style.padding = "1px";
        clock.style.borderRadius = "5px";
        clock.style.zIndex = "9000"; // Valore alto per posizionarlo sopra gli altri elementi
        clock.style.cursor="pointer";
        clock.style.border="1px solid yellow";
        clock.style.width="105px";
        clock.style.textAlign="center";

        // Aggiunge l'elemento orologio accanto al pulsante
        headerElement.parentNode.insertBefore(clock, headerElement.nextSibling);
         // Aggiungi la data al passaggio del mouse
        clock.addEventListener('mouseenter', function() {
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString('it', {
            day: '2-digit',month: 'long',weekday: 'long',year: 'numeric'
            });
            clock.setAttribute('title', formattedDate); // Mostra la data come tooltip
        });

        // Applica stile al contenitore del pulsante
        const container = headerElement.parentNode;
        container.style.display = "flex";
        container.style.alignItems = "center"; // Allinea verticalmente al centro

        // Aggiorna l'orologio
        function updateClock() {
            const now = new Date();
            const timeString = `${now.toLocaleTimeString()}:${now.getMilliseconds()}`; // Aggiunge i millisecondi
            clock.textContent = timeString;
        }

        // Aggiorna l'orologio ogni secondo
        updateClock();
        setInterval(updateClock, 90);
    } else {
        console.error("Elemento non trovato. Controlla il selettore.");
    }
        }

function addColorPicker() {
    // Crea elementi dinamicamente
    const colorPicker = $('<input>', {
        type: 'color',
        id: 'colorPicker',
        title: 'Color picker',
        style: 'cursor:pointer;width:25px;height:25px;background-color:#3b3b3b;color:red;border:1px solid yellow;border-radius:5px;', // width e height aggiunti qui
        list: 'colors', // Aggiungi l'attributo list
    });

    const colorValue = $('<span>', {
        id: 'colorValue',
        title: 'Hex value',
        style: 'margin-left:10px;font-size:16px;color:lime;background-color:brown;border:1px solid yellow;border-radius:5px;cursor:pointer;text-align:center;width:75px;',
    });

    const headerElement = document.querySelector("#root > div > div.THmE0 > header > div.rsdM3.AyoJO > div.yLU7N.TcOud > div.f3e13.o_Anz.rbqYB > button");

    if (headerElement) {
        // Aggiungi il color picker e il display del valore
        $(headerElement).after(colorPicker);
        $(colorPicker).after(colorValue);

        // Carica il colore salvato o utilizza il valore predefinito
        const userdata = { color: 'camcolor' };
        const savedColor = GM_getValue(userdata.color, "#980000");
        colorPicker.val(savedColor); // Imposta il colore nel color picker
        colorValue.text(savedColor); // Mostra il valore iniziale del colore
        $('.KEPak,.dSgtq,body, html,.pageContent[data-has-activity-feed=true]').css("background", savedColor); // Imposta il colore di sfondo

        // Funzione per salvare le impostazioni
        function saveSetting(color) {
            GM_setValue(userdata.color, color);
            $('.KEPak,.Ia4MR,.OOOkf,.dSgtq,html,.pageContent[data-has-activity-feed=true]').css("background", color);
        }

        // Osserva i cambiamenti del DOM per eventuali aggiornamenti
        function observeDOMChanges() {
            const observer = new MutationObserver(() => saveSetting(colorPicker.val()));
            observer.observe(document.body, { childList: true, attributes: false, subtree: true });
        }

        observeDOMChanges(); // Inizializza l'osservatore

        // Listener per i cambiamenti del color picker
        colorPicker.on('input', function () {
            const newColor = $(this).val();
            colorValue.text(newColor); // Aggiorna il valore mostrato
            $('.KEPak,.dSgtq,body, html,.pageContent[data-has-activity-feed=true]').css("background", newColor);
            saveSetting(newColor); // Salva il nuovo colore
        });
    }
}
    setTimeout(function() {
        addClock();
        addColorPicker();
    }, 2000);
    //////////////////////////////////
        GM_addStyle(`
         /* Naked & Uncut: Tulum */
            .SegmentItem__container__NA2zm,

         /* popup sopra */
            .Directory__subHeader__2O2A2,

         /*set 2023 */
            .Footer__footer__202HR,
        /*categorie funziona +parte sotto cam*/
            .ContentCard__title__2CLsx,
            .LegalArea__legal__2bQcD,
            .EqEPS,.OJKQZ,/*parte sotto mostra altro nuova home page maggio 2025*/
         .QMBRc,.BYmt2,.jGkoG,.SnYAk,.yId07,
         /*Categorie Donne Correlate aprile 2025*/
           .Xc5dx.iSO4f,
           ._9kucp, /*Categorie Donne Correlate nuova home page maggio 2025*/

        /*cam4 premium*/
            .Directory__aboveFooterWrap__sLRuI {
             display: none!important;
            }
        `);
    //continua cookie
setTimeout(function(){document.querySelector("#root > div > dialog > div > div.J9SUj > a:nth-child(3)").click();}, 1050);//donne
setTimeout(function(){document.querySelector("#root > div > dialog > div > div.W9OcM > button").click();}, 1080);
if(!localStorage.reload) {
       //correzione errore triangolo giallo
        setTimeout(function(){document.location.reload();}, 2000);
        localStorage.reload = 1;
    }
//popup questo sito utilizza cookie visibile senza estensione blocca publicita rifunziona
GM_addStyle('.index__cookieConsent__2M-8D {display: none!important}');//sett 2023
//foto publicita in alto prova un esperienza piu intima rifunziona
GM_addStyle('.PageHeaders__wrapper__3I9TX .PageHeaders__title__Wms1b {display: none!important}');
//parte sotto paginazione marzo 2024
GM_addStyle('#root > div > footer {display: none!important}');
//scritta scorrevole marzo 2025
GM_addStyle('.jhdSH{display:none!important}');
///////////////////////////////////////////////
  //x dentro video
GM_addStyle('.index__closeButton__2llsj {display:none!important}');
   //ricordamelo dopo in chat  ottobre
GM_addStyle('.TokenAwarenessDesktop__container__3aA7r {display:none!important}');
//popup badoo allinterno della cam
GM_addStyle('.AdEmbeded__AddWrapperNoButton__28ZlR {display:none!important}');
//current page color (novembre 2025)
GM_addStyle('a[aria-current="true"] {background-color:blue!important;color:lime!important;}');
//////////////////////////////////////////////////////////////////////////////////////
    // Click "Accedi"
setTimeout(() => {
    const accediButton = document.querySelector("#root > div > div.THmE0 > header > div.LzM4W._GM7Y > button.DicDC.SCZfE.yAILi.s1855.Wg2T7");
    if (accediButton) {
        accediButton.click();
    } else {
        console.error("Accedi button not found");
    }
}, 7000);

// Fare clic sul pulsante "Continua" dopo 5 secondi
setInterval(() => {
    const continueButton = document.querySelector("#tUZ2be9k_loginFrom_continueButton");
    if (continueButton) {
        continueButton.click();
    } else {
        console.error("Continue button not found");
    }
}, 5000);

// Click login
setInterval(() => {
    const submitButton = document.querySelector("#tUZ2be9k_loginFrom_submitButton");
    if (submitButton) {
        submitButton.click();
    } else {
        console.error("Submit button not found");
    }
}, 2000);
})();
/////////////////
var $ = window.jQuery;
$(document).ready(function() {
//passa alla pagina successiva senza reflesh febbr 2025
    let isScrolling = false;
    function scrollHandler() {
        if (isScrolling) return;
        if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
            isScrolling = true;
            const currentPage = document.querySelector('a[aria-current="true"]');
            if (currentPage) {
                const nextPage = currentPage.nextElementSibling;
                if (nextPage && nextPage.tagName.toLowerCase() === 'a') {
                    nextPage.click();
                    setTimeout(function() {
                        isScrolling = false;
                    }, 3000); // Timeout per prevenire il doppio click
                }
            }
        }
    }

    $(window).scroll(scrollHandler);
////////////////////////////////////////test nuova home page click paginazione mostra altro maggio 2025
//passa alla pagina successiva richiede jquery
$(window).scroll(function() {
     if($(window).scrollTop() + $(window).height() == $(document).height()) {
       /////////////////////////////////////////////////////li:nth-last-child(1) > a ///
//document.querySelector("#root > div > main > div.KEPak > div.beJon > div.t_Wej > button").click();//funziona nuova home page
         }
});
////////////////////////////////////
//scrollbar
GM_addStyle(`
		/*####----BROWSER SCROLL BAR----####*/
		::-webkit-scrollbar {
        /*colore di spondo pulsanti su e giu */
		background:#303134!important;
		width:17px!important;
		}

        /*cursore che scorre*/
        ::-webkit-scrollbar-thumb {background-color:#676767!important;border-radius:5px!important;border:2px solid green!important;}

        /*parte colorata sotto lo scroll */
        body::-webkit-scrollbar-track {background:#303134;}

        /*pulsanti sotto freccine su e giu*/
        ::-webkit-scrollbar-button {background-color:#777777;}

        /*freccia nera sopra*/
        ::-webkit-scrollbar-button:single-button:vertical:decrement {display:block;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QgFDgonQxmpnwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAc0lEQVQoz+XRMUoCAACF4Q/BSa/gHjl1Alu8QwguXcC7eApPIXQJt2iKjhAk+DcoJDjonP/8vulxJ1Wr6rNa3wpm1bZju2p5DUyqTfXTX2/Vw/lucAZGWOAZQ3zjgEe8VuMLhClesMc7vvBxwnM8/ecffwFSoEVS/hyFWgAAAABJRU5ErkJggg==)!important;
        background-size: cover!important;
		background-repeat: no-repeat!important;
        border:1px solid red;
		}
        /*freccia nera sotto*/
        ::-webkit-scrollbar-button:single-button:vertical:increment {display:block;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QgFDTUIslAAowAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAdUlEQVQoz+XPIQoCUQCE4XnJ4Daz3UuIJ9lsNHoH457CUwhWD+ANBEGzYUG+Da6IsIhZ/zQwDDOT/B7lKTBP0iSZJGl7T5JRkmuSZSnl8JZGhQ0uuOPmwRlrjAdrMcPeixZbTD/uRY1jH9ph8dVRNDhhlT+hA0tUX1KVJjAXAAAAAElFTkSuQmCC)!important;
        background-size: cover!important;
		background-repeat: no-repeat!important;
        border:1px solid red;
		}
`);

})();

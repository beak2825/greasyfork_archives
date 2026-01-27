// ==UserScript==
// @name          new Facebook figuccio
// @namespace     https://greasyfork.org/users/237458
// @version       44.7
// @author        figuccio
// @description   new facebook color 2026
// @match         https://*.facebook.com/*
// @grant         GM_addStyle
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @run-at        document-start
// @require       https://code.jquery.com/jquery-latest.js
// @require       https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @icon          https://facebook.com/favicon.ico
// @require       https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @require       https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.min.js
// @noframes
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/410903/new%20Facebook%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/410903/new%20Facebook%20figuccio.meta.js
// ==/UserScript==
(function() {
 'use strict';
//nasconde reel gennaio 2026
  //Approccio CSS: nasconde gli elementi contenenti "Reels" o con attributi correlati ai reels
    GM_addStyle(`
        /* Hide Reels section by aria-label */
        [aria-label="Reels"], [aria-label="Reels and short videos"] {
            display: none !important;
        }

        /* Hide spans/links containing "Reels" text in feed */
        div[data-pagelet*="Reels"],
        div[data-pagelet*="reels"] {
            display: none !important;
        }
    `);

    //Osservatore DOM per contenuti caricati dinamicamente
    function hideReels() {
        //Trova e nascondi gli elementi con intestazioni "Reels"
        document.querySelectorAll('span, h2, h3').forEach(el => {
            if (el.textContent.trim() === 'Reels' ||
                el.textContent.trim() === 'Reels and short videos') {
                //Attraversa verso l'alto per trovare il contenitore e nasconderlo
                let container = el.closest('[data-pagelet]') ||
                                el.closest('div[class*="x1"]')?.parentElement?.parentElement?.parentElement;
                if (container) {
                    container.style.display = 'none';
                }
            }
        });
    }

    //Eseguire il caricamento e osservare i cambiamenti (Facebook è una SPA)
    const observer = new MutationObserver(() => {
        hideReels();
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
        hideReels();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, { childList: true, subtree: true });
            hideReels();
        });
    }
//////////////////////////////////////////////////////sponsorizzato non interferisce con salva link luglio 2025
let blockadcontact = true;
let blockadpost = true;
let blockadinpost = true;
let interval = 1000;//milliseconds
let adword = "";
const list = ["Patrocinado", "Patrocinada","Patrocinat","Paeroniet","Publicidad","Pravkar","Peye","Рэклама","Plaćeni oglas","Реклама","Sponsored","Sponsorizzata","Sponsorjat","Sponsorizzato","Sponsitud","Sponsorizat","Sponsorisé","Spunsurizatu","Sponsorizuar", "Sponset","Sponsorowane","Szponzorált","Sponsorlu","Sponzorirano","Sponsoreret","Sponsorkirî","Stuðlað","Szpōnzorowane","Disponsori","Yoɓanaama","Babestua","Reklamo","Reklama","Remiama","Anzeige","Geborg","Gesponsord","Misy Mpiantoka","Apmaksāta reklāma","Akiliijjujjaujuq","Gesponsert","Kuxhasiwe","Oñepatrosinapyre","Imedhaminiwa","Daukar Nauyi","La maalgeliyey","광고","広告","赞助","贊助","スポンサー付き","赞助内容","Zvabhadharirwa","ⵉⴷⵍ","후원","የተከፈለበት ማስታወቂያ","បានឧបត្ថម្ភ","مُموَّل","ໄດ້ຮັບການສະໜັບສະໜູນ","დაფინანსებული","အခပေးကြော်ငြာ","પ્રાયોજિત","برعاية", "ממומן","प्रायोजित","Հովանավորվում է","ߘߡߍ߬ߟߋ߲","Спонсор","Спонсорирано","Жарнама","Được tài trợ","Χορηγούμενη","Aningaasaliiffigineqartoq"];
const urls = ["https://www.facebook.com/","http://www.facebook.com/","https://www.facebook.com","http://www.facebook.com/"];

if (urls.includes(document.location.href)) {
  getElementByInnerText(list);
}

function getElementByInnerText(list) {
  try {
    // ADS Contacts
    if (blockadcontact==true) {
      const allElements = document.getElementsByTagName('h3');//'span.x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1j85h84
      for (const element of allElements) {
        if (list.includes(element.innerText)) {
          adword = element.innerText;
          element.innerText = ' ';
          element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style="height: 0px; opacity: 0; visibility: hidden;";
          element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display="none";
          break;
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
  try {
    //ADS Posts
    if (blockadinpost==true) {
      let allElementsX;

      if (adword=="Sponsored") {
        return
      } else {
        allElementsX = document.querySelectorAll('div > span > div > span > span > a.x1i10hfl.xjbqb8w.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.xkrqix3.x1sur9pj.xi81zsa.x1s688f');
        for (const elementX of allElementsX) {
          if (elementX.href.search("/?__cft__") != -1) {//if (elementX.href.search("/ads/about/") != -1) NEED MOUSE OVER TRIGGED TO SHOW/FOUND /ads/about/
            elementX.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style="height: 0px; opacity: 0; visibility: hidden;";
            elementX.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display="none";
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
  try {
    //ADS inside normal Posts
    if (blockadinpost==true) {
      const allElementsZ = document.querySelectorAll('div > a.x1i10hfl.xjbqb8w.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1o1ewxj.x3x9cwd.x1e5q0jg.x13rtm0m.x1n2onr6.x87ps6o.x1lku1pv.x1a2a7pz.x1lliihq');
      for (const elementZ of allElementsZ) {
        elementZ.style = "height: 0px; opacity: 0; visibility: hidden;";
        elementZ.style.display = "none";
      }
    }
  } catch (error) {
    console.error(error);
  }
}

function exec() {
  try {
    if (urls.includes(document.location.href)) {
      getElementByInnerText(list);
    }
  } catch (error) {
    console.error(error);
  }
}

var intervalID = setInterval(exec,interval);
/////////////////////////////////////fine

/////////////////////////////////////////
// Interrompe la riproduzione degli annunci pubblicitari durante un video.
window.addEventListener('playing', function(event) {
   event.stopImmediatePropagation();
   event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].setAttribute('hidden', 'hidden');
}, true);

//Interrompe la riproduzione degli annunci pubblicitari alla fine di un video.
window.addEventListener('ended', function(event) {
   event.stopImmediatePropagation();
   event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].removeAttribute('hidden');
}, true);
    /////////////////////////////
    //Facebook Reel: Video Controls
document.addEventListener('play', (evt) => {
  const target = (evt || 0).target;

  if (target instanceof HTMLVideoElement && !target.hasAttribute('controls') && location.href.includes('reel')) {
    let buttonLayer = target.closest('div[class][role="button"][tabindex]');

    if (buttonLayer) {
      target.setAttribute('controls', '');

      setTimeout(() => {
        Object.assign(target.style, {
          'position': 'relative',
          'zIndex': 999,
          'pointerEvents': 'all'
        });

        [...buttonLayer.querySelectorAll('.x10l6tqk.x13vifvy:not(.x1m3v4wt)')].forEach(s => {
          Object.assign(s.style, {
            'pointerEvents': 'none',
            'position': 'relative',
            'zIndex': 1000
          });
        });
      }, 1);
    }
  }
}, true);

    //Funzione per rilevare la pagina di login accetta cookie
    function isLoginPage() {
    return document.querySelector('form[action*="/login"]') !== null;
    }
    // Verifica se sei sulla pagina di login al caricamento della pagina
    if (isLoginPage()) {
        document.cookie = "datr=LVSeZ6822RyG0BNdfQNdbC3d;domain=.facebook.com;max-age=315360000";
//accetta tutti cookie facebook
GM_addStyle('div[data-cookiebanner=\"banner\"],.hasCookieBanner #root ~ .accelerate,body[tabindex] > div > #viewport > div:first-child:not(#MChromeHeader),div[data-testid=\"cookie-policy-dialog\"],div[data-testid=\"cookie-policy-manage-dialog\"]{display:none !important}.uiLayer[data-testid=\"cookie-policy-banner\"]{display:none !important}.hasCookieBanner > div{position:static !important}');
 if(!localStorage.reload) {
       //correzione errore triangolo giallo
        setTimeout(function(){document.location.reload();}, 2000);
        localStorage.reload = 1;
    }
    }
 /////////////////////////////////
        //mostra altro...
var l_foundButton = false;
function clickButton() {
    if (window.location.hostname !== 'www.facebook.com') return;//controlla se 6 sulla home
    //Cerca il pulsante
    const buttons = document.querySelectorAll('.x1iyjqo2');
    buttons.forEach((button) => {
        if (button.innerText == "Altro...") {
            button.click();
            l_foundButton = true;
        }
    });
// Aggiunto controllo e log per debug
    if (l_foundButton) {
        l_foundButton = false; // Reset per il prossimo ciclo
    }
}
// Chiama clickButton ogni 1000 millisecondi (1 secondo) finché il pulsante non viene trovato
var intervalId = setInterval(() => {
    if (!l_foundButton) {
        clickButton();
    } else {
        clearInterval(intervalId); //Interrompere l'intervallo una volta cliccato il pulsante
    }
}, 1000);
// Esegui clickButton() all'avvio per gestire i bottoni già presenti
clickButton();
///////////////////////////////////////////////
        //form login
GM_addStyle('._6luv {background-color:#476014!important;border:2px solid blue!important;}');
 //nasconde pop up notifica a sinistra quando si gioca
GM_addStyle('ul[data-gt*=\"\\\"ref\\\":\\\"beeper\\\"\"] {display:none!important;}');
 //nasconde pop up notifica a sinistra sulla home
GM_addStyle('div[role="complementary"][aria-labelledby] {display:none!important;}');
 // ti piace questo gioco popup
GM_addStyle('._3mqg {display:none!important}');
////////////////////////////////////////modificato 6 giugno 2025/////////////////////////////////////////////////
GM_addStyle(`
/* Stile ha cosa stai pensando */
.xz9dl7a.xf7dkkf.xv54qhq.x1a8lsjc.x1a02dak.x78zum5.x6s0dn4{
border:2px solid red!important;
border-radius:14px;
}

/* bordo verde sui feed */
.x6o7n8i.x1unhpq9.x1hc1fzr > div {
border:2px solid lime!important;
border-radius:14px;
}

/*sidebar sinistra*/
div[role="banner"]+div div [role="navigation"]{border-radius:14px;border:2px solid gold!important;}

/* Stili contatti */
div[role="complementary"]{border-radius:14px;border:2px solid red!important;}

/*stelline al passaggio mouse*/
div[role="navigation"]:hover,
div[role="complementary"]:hover {
background-image: url(https://media2.giphy.com/media/asG02gUfDyIxdODF76/giphy.gif);
background-blend-mode:overlay;
}

/* Nascondi watch marketplace groups gaming*/
div[role="navigation"][aria-label="Facebook"] > ul > li:nth-child(n+2):nth-child(-n+5) {
display:none!important;
}

/* cerchi notifiche messaggi ecc */
.x1qhmfi1 {
border-radius:22px!important;
border:2px solid #c471ed!important;
}
`);

var $ = window.jQuery;//$ evita triangolo giallo
$(document).ready(function() {
    ////////////////////////////////////////////////////////////
//feed piu grandi compreso ha cosa stai pensando giugno 2025
// 🔄 Inizializzazione variabili
let mutationObserver = null;
let timer = null;
let expandedCount = 0;

//Espande gli elementi target aumentando la loro larghezza al 100%.
const expandElements = () => {
    const targetElements = document.querySelectorAll(".x193iq5w.xvue9z.xq1tmr.x1ceravr");
    targetElements.forEach(el => {
        el.style.width = '100%';
        expandedCount++;
    });
};

//Avvia l'osservazione delle mutazioni DOM sulla sezione dinamica.
const observeDOMChanges = () => {
    const container = document.querySelector(".xxzkxad");
    if (!container) return;

    mutationObserver = new MutationObserver(() => {
        expandElements();
    });

    mutationObserver.observe(container, {
        childList: true,
        subtree: true
    });
};

// ▶️ Esegue l'espansione iniziale
expandElements();

//Dopo 3 secondi, attiva l'osservatore DOM
timer = setTimeout(observeDOMChanges, 3000);
 });
////////////////////color picker///////////
const $f = window.jQuery.noConflict();//$f evita triangolo giallo
//avvia la funzione dopo che la pagina e stata caricata
$f(document).ready(function() {
     // Aggiungi la funzione per il trascinamento limitato allo schermo
function makeDraggableLimited(element) {
    element.draggable({
        containment: "window",
        stop: function(event, ui) {
            // Memorizza la posizione dopo il trascinamento
            GM_setValue('boxPosition', JSON.stringify(ui.position));//importante
        }
    });
}
////////////////////////////
const body=document.body;
const style="position:fixed;top:-3px;left:720px;z-index:99999;"
const box=document.createElement("div");

box.id="myMenu";
box.style=style;
body.append(box);
 // Ripristina la posizione salvata se presente
const savedPosition = GM_getValue('boxPosition');
if (savedPosition) {
    const parsedPosition = JSON.parse(savedPosition);
    $(box).css({ top: parsedPosition.top, left: parsedPosition.left });
}
     // Rendi l'elemento trascinabile con limitazioni di schermo
    makeDraggableLimited($(box));
////////////////////////////audio effetto sonoro quando si clicca sulla x rossa
var Sound = new Audio("data:audio/mp3;base64,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2C4dCNdbTPu6uQyGfhEwcUOZ1EDmKZUUUodiyqXb+xpCtkPFldX8tGl6lo9He4uIl36lqy4CQkswA6oJMBvlAHMxiyK4PLIYxynyrJYrEcjyL4L2aS5/KK71It1Khoa/xBPCD25cQHtWmHrh6CoVStb/ey8jxSur+WjV6rR6O9xaHX2qOLQUUwAASpdgB7TkoXo5kNMB+I8TMPavP9AmWzK1VKs+Vhyqz2PcJjoZ4dmDoRoW/3mamKba4vhabatGGZioP3mxJf+6Y2urBW/fxEktCfvFjH/+YlkQVCAQBScuAIpP637T18LA1nCbuq8QwFkUd0ZoPx+FpEVbHHHHcrH1HuVdJAw5p3f9q4hsOyqbdacO2s8UUXDRXaVCWkVLYeHUvgICMERsyVGCXkhCAEAAALQAKIX/+5IEWYACpCLT+w9A4lVEWm9hhkoKoG8zh5hwyU8N5qTzDhHItxzF+IU5GaADS5iGlxVCiP4lRLtkhExOlDQmfgMRBQCiai4KEktglszMt9XWhWGgoKCwgpbFh8X/4/pvTccm+P9xMV00K4FDf/wU1DAABvAFiIyQZXH8XKcwQEk0xcTpRiFNRPiXbJ6OE6VaRw4kDIzIKAQk0AhNUmPqq2UbUgpygoKCwgqbFh8X/N/oKTNi5N8O8FJgvSQVkFHGjPBattaSSTgAXuqxUVShYqxI8VFWOrFWe/4sLUqFhb6f9v/b4sLf/+Kiv//qFvAADZZZSNlayxyVlBA46OysDBA0DERKqIPJVVTO//XqqqWBiVURMDVRBwMSqDB4NVUGK//////aabKdpp///////6qv2xVVTEFNRTMuOTkuM1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//uSBG8P8VgAKeghGABG4iSlDGOAQAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==");

//mostra/nascondi dal menu
function prova() {
var box = document.getElementById("myMenu"); // Assicurati che ci sia un elemento con id="box"
    //Animazione per mostrare/nascondere + fermare setinterval orologio box nascosto e riavviarlo se visibile
if (box.style.display !== 'none') {
        box.style.display = 'none';
        clearInterval(intervalId); // Interrompere l'intervallo se la casella è nascosta
    } else {
        box.style.display = 'block';
        intervalId = setInterval(myTimer, intervalTime); // Riavvia l'intervallo se la casella è visibile
    }
}
GM_registerMenuCommand("nascondi/mostra box",prova);
///////////////////////////////////////////////////////////////
 function logout() {
 box.addEventListener("click", function(e) {e.preventDefault(); document.querySelector('form[action^="/logout.php?"').submit(); e.target.innerHTML='<img src="//www.facebook.com/images/loaders/indicator_blue_small.gif"/>'},false);
}
/////////////////////////////////////////////////////////////////
    const userdata = {color:'figuccio'}
    var mycolor = GM_getValue(userdata.color, "#980000"); // Valore predefinito   (marzo 2025)

  // salvare i dati personalizzati  ._95k9, schermata login
    function saveSetting(color) {GM_setValue(userdata.color,mycolor);
    $f('._95k9,div[role="banner"]+div div[role="navigation"], div[role="complementary"], div[aria-label="Facebook"][role="navigation"]').css("background-color",mycolor);
          }
 // Funzione per controllare se sei sulla homepage di Facebook
    function isHomePage() {
    return window.location.hostname === "www.facebook.com";
}
        // Aggiungi un MutationObserver per monitorare i cambiamenti nel DOM (aprile 2025)
      const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
            if (isHomePage()) {
            saveSetting(mycolor);// Applica il colore ogni volta che cambia il DOM
            saveCheckbox(); // Gestire checkbox
        }
      }

    });
});
    // Configura e osserva il body del documento
observer.observe(document.body, { childList: true, subtree: true, attributes: false });//aggiunto , attributes: false
///////////////////////////////////////////////////////////////////////////////////
    //Suggeriti per te
   GM_addStyle('[aria-label="Suggeriti per te"] {display:none!important;}');
   GM_addStyle('[aria-label="I tuoi suggerimenti di gruppi"] {display:none!important;}');//gennaio 2026
   // Funzione per nascondere la sezione di creazione delle storie
   GM_addStyle('[aria-label="Storie"] {display:none!important;}');
// Funzione per gestire lo stato della checkbox e la sfocatura della chat
function saveCheckbox() {
    const checkbox = $("#checkbox1");
    const chat = $(".xwib8y2 ul");
    const isChecked = GM_getValue("checkboxState") === "true";

    checkbox.prop("checked", isChecked).val(isChecked ? "Show Chat 😃" : "Hide Chat 😩");
    chat.css("filter", isChecked ? "blur(7px)" : "");

    checkbox.change(() => {
    const newState = checkbox.prop("checked");
    GM_setValue("checkboxState", newState.toString());
    chat.css("filter", newState ? "blur(7px)" : "");
    checkbox.val(newState ? "Show Chat 😃" : "Hide Chat 😩");
    });
}
$f(document).ready(saveCheckbox);
document.onreadystatechange = function () {
    if (document.readyState === "complete") {
        saveCheckbox();
    }
};
      //Imposta lo stile css degli elementi checkbox (26 marzo 2025)
     GM_addStyle(`
  input[type=checkbox] {
    accent-color:red;
    outline:1px solid lime!important;
    cursor:pointer;
    width:15px;
    height:15px;
  }

  input[type=checkbox]::after {
    content: attr(value);
    margin:-2px 18px;
    vertical-align:top;
    white-space:nowrap;
    color:lime;
    background:brown;
  }

  input[type=checkbox]:checked {
    outline:1px solid yellow!important;
  }

  input[type=checkbox]:checked::after {
    color:red;
    background:aquamarine;
  }
`);
///////////////////////clock con mostra nascondi millisec cambio lingua it-en per la data
let use12HourFormat = GM_getValue('use12HourFormat', true); // Default è il formato 24 ore true
let showMilliseconds = GM_getValue('showMilliseconds', true);
let showDate = GM_getValue('showDate', true); // Aggiungi un valore predefinito se nulla è stato salvato
let intervalTime = showMilliseconds ? 90 : 1000; // Imposta l'intervallo iniziale in base allo stato
let language = GM_getValue('language') || 'it'; // Recupera la lingua dal localStorage o usa 'it' come predefinita

const languages = {
    en: { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' },
    it: { weekday: 'short', month: '2-digit', day: '2-digit', year: 'numeric' }
};

function initialize() {
    if (GM_getValue('showDate') === undefined) {
        GM_setValue('showDate', true); // Imposta il valore predefinito solo se non esiste
    }
    showDate = GM_getValue('showDate'); // Recupera il valore salvato
}

function myTimer() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
    const date = now.toLocaleString(language, languages[language]); // Usa la lingua selezionata per la data

    let period = "";

    if (!use12HourFormat) {
        period = hours >= 12 ? " PM" : " AM";
        hours = hours % 12 || 12; // Converte in formato 12 ore
    }

    hours = String(hours).padStart(2, "0");

    // Visualizzazione condizionale di data e millisecondi
    const displayDate = showDate ? date : "";
    const displayMilliseconds = showMilliseconds ? `:${milliseconds}` : "";
    document.getElementById("demo").textContent = `${displayDate} ${hours}:${minutes}:${seconds}${displayMilliseconds}${period}`;
}

function toggleMilliseconds() {
    showMilliseconds = !showMilliseconds;
    GM_setValue('showMilliseconds', showMilliseconds); // Salva lo stato di visualizzazione nel localStorage
    intervalTime = showMilliseconds ? 90 : 1000; // Aggiorna l'intervallo
    clearInterval(intervalId); // Cancella il setInterval corrente
    intervalId = setInterval(myTimer, intervalTime); // Avvia un nuovo setInterval
}

function toggleDate() {
    showDate = !showDate;
    GM_setValue('showDate', showDate); // Salva lo stato di visualizzazione della data
    myTimer(); // Aggiorna la visualizzazione immediatamente
}
function toggleFormat() {
    //Cambia il formato orario
    use12HourFormat = !use12HourFormat;
    GM_setValue('use12HourFormat', use12HourFormat); // Salva lo stato del formato
    //Cambia la lingua
    language = (language === 'it') ? 'en' : 'it';
    GM_setValue('language', language);// Salva la lingua scelta nel localStorage
}
// Crea il menu e inizializza il setInterval
initialize(); // Inizializza le impostazioni
let intervalId = setInterval(myTimer, intervalTime);
//elemento html . width:330px evita che spostandolo hai lati cambi di dimensioni
 box.innerHTML=`
<fieldset style="background:#3b3b3b;border:2px solid red;color:lime;border-radius:7px;text-align:left;height:39px;width:330px;">
<div id="demo" title="Data-ora" style="border:1px solid yellow;border-radius:5px;cursor:pointer;text-align:center;margin-top:-10px;margin-left:110px;font-size:14px;width:max-content;">
</div>
                       <legend>Time</legend>
<div id=setuiface style="width:auto;height:25px;margin-top:-9px;margin-left:40px;margin-right:-4px;margin-bottom:0px;border-width:1px;color:lime;">
<button id="colorspan" title="Hex value" style="margin-left:0px;margin-bottom:-19px;color:lime;background-color:brown;border:1px solid yellow;border-radius:5px;cursor:pointer;">${mycolor}</button>
<input type="color" title="Color picker" list="colors" id="colorinput" style="margin-left:1px;margin-top:12px;background-color:#3b3b3b;color:red;border:1px solid yellow;border-radius:5px;height:20px;width:30px;cursor:pointer;"value="${mycolor}">
<span class="button" title="Esci" id='logout' style="background-color:red;border:1px solid yellow;border-radius:3px;cursor:pointer;padding:0px 3px;font-size:14px;">Logout</span>
<span class="button" title="Chiudi" id='close' style="background-color:red;color:lime;border:1px solid yellow;border-radius:50%;cursor:pointer;font-size:14px;padding:3px 6px;display:inline-block;line-height:16px;margin-top:6px;">X</span>
<input type="checkbox" id="checkbox1"  title="Sfoca" value="Hide Chat 😩">
               <label title="Mostra/nascondi millisecond"   style="color:lime;cursor:pointer;position:absolute;top:12px;left:60px;display:inline-flex;">
               <input type="radio" name="options" title="Mostra/nascondi millisecond" value="toggleMilliseconds" style="cursor:pointer;">m/sec
                        </label>
               <label title="Cambia 12/24h"  style="color:lime;cursor:pointer;position:absolute;top:12px;left:5px;display:inline-flex;">
               <input type="radio" name="options" title="Cambia 12/24h" value="toggleFormat" style="cursor:pointer;">12/24h
               <label title="Nascondi/mostra data"  style="color:lime;cursor:pointer;position:absolute;top:20px;left:0px;display:inline-flex;">
               <input type="radio" name="options" title="Nascondi/mostra data" value="toggleDate" style="cursor:pointer;">data
                       </label>
               </fieldset>
    `;
//Ascoltatore di eventi per la selezione del pulsante di scelta
$('input[name="options"]').on('change', function() {
    const selectedValue = $(this).val();
    if (selectedValue === 'toggleMilliseconds') {
        toggleMilliseconds();
    } else if (selectedValue === 'toggleFormat') {
        toggleFormat();
    } else if (selectedValue === 'toggleDate') { // Nuova funzione per la data
        toggleDate();
    }
    //Disattivare temporaneamente i pulsanti di scelta
    $('input[name="options"]').prop('disabled', true);
    //Riattivare i pulsanti di scelta dopo un breve ritardo
    setTimeout(() => {
        $('input[name="options"]').prop('disabled', false).prop('checked', false);
    }, 300); // Milliseconds
});
        //Una serie di elementi get
        var colorspan=document.querySelector('#colorspan');
        var colorinput=document.querySelector('#colorinput');
        var MenuClose=document.querySelector('#close');
        var Menulogout=document.querySelector('#logout');//funzione logout
                      //chiude dalla x rossa
        MenuClose.addEventListener('click',prova,false);
                      //richiama effetto sonoro chiudendo con la x rossa
        MenuClose.onclick = function() {Sound.play();};
        Menulogout.addEventListener('click',logout,false);//funzione logout
    /////////////////////////////////////////////////////////////////////////
    //fa vedere la modifica colore
    colorinput.addEventListener('input', colorChange, false);
    function colorChange (e) {
    mycolor = e.target.value;
    colorspan.innerHTML=e.target.value;
    //colore immediatamente visibile
    GM_setValue(userdata.color, mycolor);
    saveSetting(mycolor);
        }
//////////////////no login recent (gennaio 2025)
 window.setTimeout(clearRecentLogins, 100);
function clearRecentLogins() {
 if (document.getElementById('email')) {
     document.getElementById('email').value = "";
     document.getElementById('email').focus();
        }
var recentLogins = document.querySelectorAll('.removableItem a[role="button"][ajaxify^="/login/device-based"]');
    if (recentLogins.length === 0) {
    return;
    }
    recentLogins.forEach(function(login) {
    login.click();
    });
}
})();
//////////
   })();

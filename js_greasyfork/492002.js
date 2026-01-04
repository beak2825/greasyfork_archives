// ==UserScript==
// @name          new Facebook figuccio lite
// @namespace     https://greasyfork.org/users/237458
// @version       0.5
// @author        figuccio
// @description   new facebook color versione ridotta 2024
// @match         https://*.facebook.com/*
// @grant         GM_addStyle
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @run-at        document-start
// @require       http://code.jquery.com/jquery-latest.js
// @require       https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @icon          https://facebook.com/favicon.ico
// @require       https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @noframes
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/492002/new%20Facebook%20figuccio%20lite.user.js
// @updateURL https://update.greasyfork.org/scripts/492002/new%20Facebook%20figuccio%20lite.meta.js
// ==/UserScript==
(function() {
    'use strict';
  //accetta cookie
 // Funzione per rilevare la pagina di login
    function isLoginPage() {
    return document.querySelector('form[action*="/login"]') !== null;
    }
    // Verifica se sei sulla pagina di login al caricamento della pagina
    if (isLoginPage()) {
        console.log('Sei sulla pagina di login di Facebook');
        document.cookie = "datr=LVSeZ6822RyG0BNdfQNdbC3d;domain=.facebook.com;max-age=315360000";
//accetta tutti cookie facebook
GM_addStyle('div[data-cookiebanner=\"banner\"],.hasCookieBanner #root ~ .accelerate,body[tabindex] > div > #viewport > div:first-child:not(#MChromeHeader),div[data-testid=\"cookie-policy-dialog\"],div[data-testid=\"cookie-policy-manage-dialog\"]{display:none !important}.uiLayer[data-testid=\"cookie-policy-banner\"]{display:none !important}.hasCookieBanner > div{position:static !important}');
 if(!localStorage.reload) {
       //correzione errore triangolo giallo
        setTimeout(function(){document.location.reload();}, 2000);
        localStorage.reload = 1;
    }
    }

 ////////////
  //mostra altro...
var l_foundButton = false;
function clickButton() {
     if (document.URL.match(/facebook.com\/*(\?.*)*/)) {
    //Cerca il pulsante
    const buttons = document.querySelectorAll('.x1iyjqo2');
    buttons.forEach((button) => {
        if (button.innerText == "Altro...") {
            button.click();
            l_foundButton = true;
        }
    });
}

// Aggiunto controllo e log per debug
    if (l_foundButton) {
        console.log("Button 'Altro...' clicked.");
        l_foundButton = false; // Reset per il prossimo ciclo
    } else {
        //console.log("Button 'Altro...' not found.");
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
    ///////////////////////crea una storia dalla sez centrale rimosse (necessario Condividi una ho scrivi qualcosa)
GM_addStyle('.xquyuld.x10wlt62.x6ikm8r.xh8yej3.xt3gfkd.xu5ydu1.xdney7k.x1qpq9i9.x1jx94hy.x1ja2u2z.x1n2onr6.x9f619 > .xwib8y2.x1y1aw1k {display:none!important}');//marzo 2024
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
GM_addStyle(`
/* Stili comuni */
div[role="banner"]+div div[role="navigation"],
div[role="complementary"],
.xz9dl7a.x1swvt13.x1pi30zi.x1a8lsjc.x1a02dak.x78zum5.x6s0dn4,
.x6o7n8i.x1unhpq9.x1hc1fzr > div {
border-radius:14px;
font-family:monospace !important;
}

div[role="banner"]+div div[role="navigation"],
.x6o7n8i.x1unhpq9.x1hc1fzr > div {
border: 2px solid lime !important;
}

div[role="complementary"],
.xz9dl7a.x1swvt13.x1pi30zi.x1a8lsjc.x1a02dak.x78zum5.x6s0dn4 {
border: 2px solid red !important;
}
/*stelline al passaggio mouse*/
div[role="navigation"]:hover,
div[role="complementary"]:hover {
background-image: url(https://media2.giphy.com/media/asG02gUfDyIxdODF76/giphy.gif);
background-blend-mode:overlay;
}

/* Nascondi watch marketplace groups gaming*/
div[role="navigation"][aria-label="Facebook"] > ul > li:nth-child(n+2):nth-child(-n+5) {
display:none !important;
}

/* cerchi notifiche messaggi ecc */
.x1qhmfi1 {
border-radius:22px !important;
border:2px solid #c471ed !important;
}
`);
//feed piu grandi compreso ha cosa stai pensando avviare dopo che la pagina e stata caricata
var $ = window.jQuery;//$ evita triangolo giallo
$(document).ready(function() {
//feed piu grandi compreso ha cosa stai pensando
function adjustWidths() {
        const feedElements = document.querySelectorAll('.x193iq5w.xvue9z.xq1tmr.x1ceravr');
        feedElements.forEach(element => {
            if (element.style.width !== '1000px') {
                element.style.width = '1000px';
            }
        });
    }

    // Osserva le modifiche nel documento e aggiusta le larghezze dei feed
    const observer = new MutationObserver(adjustWidths);
    observer.observe(document.body, { childList: true, subtree: true });

    // Aggiusta le larghezze quando la pagina è completamente caricata
    window.addEventListener('load', adjustWidths);
     });
////////////////////color picker///////////
const $f =window.jQuery.noConflict();//$f evita triangolo giallo

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
const style="position:fixed; top:-3px;left:720px;z-index:99999;"
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
    ////////////////////////////////////////////marzo 2024
     // Rendi l'elemento trascinabile con limitazioni di schermo
    makeDraggableLimited($(box));
////////////////////////////audio effetto sonoro quando si clicca sulla x rossa
        //suono elettronico
var Sound = new Audio("data:audio/mp3;base64,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2C4dCNdbTPu6uQyGfhEwcUOZ1EDmKZUUUodiyqXb+xpCtkPFldX8tGl6lo9He4uIl36lqy4CQkswA6oJMBvlAHMxiyK4PLIYxynyrJYrEcjyL4L2aS5/KK71It1Khoa/xBPCD25cQHtWmHrh6CoVStb/ey8jxSur+WjV6rR6O9xaHX2qOLQUUwAASpdgB7TkoXo5kNMB+I8TMPavP9AmWzK1VKs+Vhyqz2PcJjoZ4dmDoRoW/3mamKba4vhabatGGZioP3mxJf+6Y2urBW/fxEktCfvFjH/+YlkQVCAQBScuAIpP637T18LA1nCbuq8QwFkUd0ZoPx+FpEVbHHHHcrH1HuVdJAw5p3f9q4hsOyqbdacO2s8UUXDRXaVCWkVLYeHUvgICMERsyVGCXkhCAEAAALQAKIX/+5IEWYACpCLT+w9A4lVEWm9hhkoKoG8zh5hwyU8N5qTzDhHItxzF+IU5GaADS5iGlxVCiP4lRLtkhExOlDQmfgMRBQCiai4KEktglszMt9XWhWGgoKCwgpbFh8X/4/pvTccm+P9xMV00K4FDf/wU1DAABvAFiIyQZXH8XKcwQEk0xcTpRiFNRPiXbJ6OE6VaRw4kDIzIKAQk0AhNUmPqq2UbUgpygoKCwgqbFh8X/N/oKTNi5N8O8FJgvSQVkFHGjPBattaSSTgAXuqxUVShYqxI8VFWOrFWe/4sLUqFhb6f9v/b4sLf/+Kiv//qFvAADZZZSNlayxyVlBA46OysDBA0DERKqIPJVVTO//XqqqWBiVURMDVRBwMSqDB4NVUGK//////aabKdpp///////6qv2xVVTEFNRTMuOTkuM1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//uSBG8P8VgAKeghGABG4iSlDGOAQAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==");
/////////////////////effetto disolvenza box color picker al caricamento pagina
document.getElementById("myMenu").style.display = "none";
$f("#myMenu").fadeIn(3000);
      //mostra/nascondi dal menu
function prova() {
var box = document.getElementById('myMenu');
box.style.display = ((box.style.display!='none') ? 'none' : 'block');
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
 // Aggiungi un MutationObserver per monitorare i cambiamenti nel DOM
        const observer = new MutationObserver(() => {
        saveSetting(mycolor); // Applica il colore ogni volta che cambia il DOM
        hideSponsoredSections();//sponsorizzato
        hideStoryCreation();//nascondere storie
    });

    // Configura e osserva il body del documento
    observer.observe(document.body, { childList: true, subtree: true });
//////////////////////////////////////////////////////////////////////////
     //sponsorizzato
     function hideSponsoredSections() {
        var sponsor = document.querySelectorAll('[aria-label="Inserzionista"]');
        sponsor.forEach(function(sponsor) {
            sponsor.style.display = 'none';
        });
    }

    ////////////////////
// Funzione per nascondere la sezione di creazione della storia
function hideStoryCreation() {
    var storyComposer = document.querySelector('[aria-label="Storie"]');
    if (storyComposer) {
        storyComposer.style.display = 'none';
    }
}

// Funzione per gestire lo stato della checkbox e la sfocatura della chat
function saveCheckbox() {
    GM_setValue("checkboxState", document.getElementById("checkbox1").checked.toString());
    var chat = document.querySelector(".xwib8y2 ul");//.xwib8y2 ul
    if (document.getElementById("checkbox1").checked) {
        chat.style.filter ="blur(7px)";
        document.getElementById("checkbox1").value = "Show Chat😃";
    } else {
        chat.style.filter ="";
        document.getElementById("checkbox1").value = "Hide Chat😩";
    }
}

$f(document).ready(function() {
    // Gestisci il cambio di stato della checkbox
    $f("#checkbox1").change(function(){
        GM_setValue("checkboxState", document.getElementById("checkbox1").checked.toString());
        saveCheckbox();
    });

    // Carica lo stato della checkbox al caricamento della pagina
    if (GM_getValue("checkboxState") === "true") {
        $f("#checkbox1").prop("checked", true);
        saveCheckbox();
    }
});

// Sfoca la chat al caricamento della pagina
document.onreadystatechange = function() {
    if (document.readyState == "complete" && GM_getValue("checkboxState") === "true") {
        saveCheckbox();
    }
};

      //Imposta lo stile css degli elementi checkbox (26 marzo 2025)
 GM_addStyle(`
  input[type=checkbox] {
    accent-color:red;
    outline:2px solid lime;
    cursor:pointer;
    width:18px;
    height:18px;
  }

  input[type=checkbox]::after {
    content: attr(value);
    margin:-2px 22px;
    vertical-align:top;
    white-space:nowrap;
    color:lime;
    background:brown;
  }

  input[type=checkbox]:checked {
    outline:2px solid yellow;
  }

  input[type=checkbox]:checked::after {
    color:red;
    background:aquamarine;
  }
`);
///////////////////////clock
setInterval(myTimer,90);
function myTimer() {
    var d = new Date();
    var t = d.toLocaleTimeString();
    var mm = d.getMilliseconds();
    var date = new Date().toLocaleString('it', {'weekday': 'short', 'month': '2-digit', 'day': '2-digit','year':'numeric'}
    );
    var demo = document.getElementById("demo");
    demo.innerHTML = date + " " + t + ":" + mm;
    //Aggiungi stile all'elemento
demo.setAttribute("style", "border:1px solid yellow;border-radius:5px;cursor:pointer;text-align:center;margin-top:-10px;margin-left:86px;font-size:14px;width:max-content;");
}
//elemento html . width:315px evita che spostandolo hai lati cambi di dimensioni
 box.innerHTML=`
<fieldset style="background:#3b3b3b;border:2px solid red;color:lime;border-radius:7px;text-align:left;height:39px;width:315px;">
  <div id="demo"  title="Data-ora" ></div>
                       <legend>Time</legend>
<div id=setuiface style="width:auto;height:25px;margin-top:-9px;margin-left:-1px;margin-right:-4px;margin-bottom:0px;border-width:1px;color:lime;">
<button id="colorspan" title="Hex value" style="margin-left:0px;margin-bottom:-19px;color:lime;background-color:brown;border:1px solid yellow;border-radius:5px;cursor:pointer;">${mycolor}</button>
<input type="color" title="Color picker" list="colors" id="colorinput" style="margin-left:1px;margin-top:12px;background-color:#3b3b3b;color:red;border:1px solid yellow;border-radius:5px;height:20px;width:70px;cursor:pointer;"value="${mycolor}">
<span class="button" title="Esci" id='logout' style="background-color:red;border:1px solid yellow;border-radius:3px;cursor:pointer;padding:0px 3px;font-size:14px;">Logout</span>
<span class="button" title="Chiudi" id='close' style="background-color:red;color:lime;border:1px solid yellow;border-radius:50%;cursor:pointer;font-size:14px;padding:3px 6px;display:inline-block;line-height:16px;margin-top:6px;">X</span>
<input type="checkbox" id="checkbox1"  title="Sfoca" value="Hide Chat😩">
                    </fieldset>
    `;
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
    /////////////////no login recent (gennaio 2025)
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

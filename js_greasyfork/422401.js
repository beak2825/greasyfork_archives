// ==UserScript==
// @name         flickr - open an amount of next pages at once
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  flickr - open a specific amount of next pages at once - big button to close the page with a click
// @author       ClaoDD
// @match        https://www.flickr.com/*
// @grant        window.close
// @grant        window.focus
// @downloadURL https://update.greasyfork.org/scripts/422401/flickr%20-%20open%20an%20amount%20of%20next%20pages%20at%20once.user.js
// @updateURL https://update.greasyfork.org/scripts/422401/flickr%20-%20open%20an%20amount%20of%20next%20pages%20at%20once.meta.js
// ==/UserScript==


// DEFINIZIONE URL _________________________________________________________________

var indirizzoPhotos;

setInterval(() => {
  if((window.location.href.includes("photos") && !window.location.href.includes("with"))||(window.location.href.includes("groups") && !window.location.href.includes("with")) ) {
    indirizzoPhotos = window.location.href;
  }
}, 100);


// BOTTONI _________________________________________________________________

var divmio = document.createElement("div");
divmio.style.cssText = 'position:static;width:100%;height:120px;opacity:0;z-index:100;';

var button1 = document.createElement("button");
button1.innerHTML = "open the next ... pages";
button1.style.position = "relative";
button1.style.left = "10%";

var buttonO = document.createElement("button");
buttonO.innerHTML = "Open next page";
buttonO.style.backgroundColor = "#ffffff";
buttonO.style.color = "#008ddf";
buttonO.style.border = "2px solid";
buttonO.style.width = "9%";
buttonO.style.height = "330px"; // Altezza ridotta per evitare la sovrapposizione
buttonO.style.position = "fixed"; // Imposta il posizionamento fisso
buttonO.style.right = "10px"; // Posiziona il bottone a destra
buttonO.style.bottom = "120px"; // Imposta la posizione sopra "Close this page"

var buttonO3 = document.createElement("button");
buttonO3.innerHTML = "Open in background";
buttonO3.style.backgroundColor = "#ffffff";
buttonO3.style.color = "#008ddf";
buttonO3.style.border = "2px solid";
buttonO3.style.width = "9%";
buttonO3.style.height = "80px"; // Altezza ridotta per evitare la sovrapposizione
buttonO3.style.position = "fixed"; // Imposta il posizionamento fisso
buttonO3.style.right = "10px"; // Posiziona il bottone a destra
buttonO3.style.bottom = "810px"; // Imposta la posizione sopra "Close this page"

var buttonSW = document.createElement("button");
buttonSW.innerHTML = "1 Open in background<br>2 close this page";
buttonSW.style.backgroundColor = "#ffffff";
buttonSW.style.color = "#800080";
buttonSW.style.border = "2px solid";
buttonSW.style.width = "9%";
buttonSW.style.height = "120px"; // Altezza ridotta per evitare la sovrapposizione
buttonSW.style.position = "fixed"; // Imposta il posizionamento fisso
buttonSW.style.right = "10px";
buttonSW.style.bottom = "960px"; // Imposta la posizione sopra "Close this page"

var buttonClose = document.createElement("button");
buttonClose.innerHTML = "Close this page";
buttonClose.style.backgroundColor = "#ffffff";
buttonClose.style.color = "#a18160";
buttonClose.style.border = "2px solid";
buttonClose.style.width = "9%";
buttonClose.style.height = "330px"; // Altezza ridotta per evitare la sovrapposizione
buttonClose.style.position = "fixed"; // Imposta il posizionamento fisso
buttonClose.style.right = "10px"; // Posiziona il bottone a destra
buttonClose.style.bottom = "460px"; // Imposta la posizione in basso

var buttonO2 = document.createElement("button");
buttonO2.innerHTML = "open the next page";
buttonO2.style.position = "relative";
buttonO2.style.left = "20%";
buttonO2.style.backgroundColor = "#ffffff";
buttonO2.style.color = "#008ddf";
buttonO2.style.border = "2px solid";
buttonO2.style.width = "10%";
buttonO2.style.height = "200px";

var buttonClose2 = document.createElement("button");
buttonClose2.innerHTML = "Close this page";
buttonClose2.style.backgroundColor = "#ffffff";
buttonClose2.style.color = "#a18160";
buttonClose2.style.border = "2px solid";
buttonClose2.style.width = "36%"; //change this value for the width of the "Close this page" button
buttonClose2.style.height = "200px"; //change this value for the height of the "Close this page" button
buttonClose2.style.position = "relative";
buttonClose2.style.left = "21%";

var button10 = document.createElement("button");
button10.innerHTML = "10";
button10.style.position = "relative";
button10.style.left = "11%";

var buttonHide = document.createElement("button");
buttonHide.innerHTML = "hide";
buttonHide.style.backgroundColor = "#ffffff";
buttonHide.style.color = "#008ddf";
buttonHide.style.border = "1px solid";
buttonHide.style.width = "1%";
buttonHide.style.fontSize = "8px";
//buttonHide.style.opacity = '0.5';
buttonHide.style.height = "30px"; // Altezza ridotta per evitare la sovrapposizione
buttonHide.style.position = "fixed"; // Imposta il posizionamento fisso
buttonHide.style.right = "10px"; // Posiziona il bottone a destra
buttonHide.style.bottom = "3%"; // Imposta la posizione sopra "Close this page

buttonO.style.zIndex = "999";
buttonO3.style.zIndex = "999";
buttonClose.style.zIndex = "999";
buttonHide.style.zIndex = "999";


document.body.appendChild(divmio);
document.body.insertBefore(button1, divmio);
document.body.insertBefore(button10, divmio);
document.body.insertBefore(buttonO2, divmio);
document.body.insertBefore(buttonHide, divmio);
document.body.insertBefore(buttonSW, divmio);
document.body.insertBefore(buttonO3, divmio);
document.body.insertBefore(buttonClose2, divmio);
document.body.insertBefore(buttonO, divmio);
document.body.insertBefore(buttonClose, divmio);


// CODICE FUNZIONALE _________________________________________________________________

// funzione hide other buttons
buttonHide.addEventListener("click", function(){
    if (buttonO.style.display != "none"){
    buttonO.style.display = "none";
    buttonO3.style.display = "none";
    buttonSW.style.display = "none";
    buttonClose.style.display = "none";
    //buttonHide.style.display = "none";
    buttonHide.innerHTML = "show";
} else { buttonO.style.display = "inline-block";
    buttonO3.style.display = "inline-block";
    buttonSW.style.display = "inline-block";
    buttonClose.style.display = "inline-block";
    buttonHide.innerHTML = "hide";}
});

// funzione apertura NEXT page
function handlePageClick() {
    if (indirizzoPhotos.includes('page')){
    var indirizzoDiviso2 = indirizzoPhotos.split('page');
    var numCorrente2 = indirizzoDiviso2[indirizzoDiviso2.length -1];
    var indirizzoSenzaNum2 = indirizzoDiviso2.splice(0, (indirizzoDiviso2.length -1));
    window.open(indirizzoSenzaNum2 +'page'+(parseInt(numCorrente2, 10)+ 1), "_self");
    }
    if (!(indirizzoPhotos.includes('page'))){
    window.open(window.location.href + 'page2', "_self");
    }
  }
buttonO.addEventListener("click", handlePageClick);
buttonO2.addEventListener("click", handlePageClick);

// funzione apertura NEXT in background
buttonO3.addEventListener("click", function() {
    if (indirizzoPhotos.includes('page')){
    var indirizzoDiviso2 = indirizzoPhotos.split('page');
    var numCorrente2 = indirizzoDiviso2[indirizzoDiviso2.length -1];
    var indirizzoSenzaNum2 = indirizzoDiviso2.splice(0, (indirizzoDiviso2.length -1));
    var newTab = window.open(indirizzoSenzaNum2 + 'page' + (parseInt(numCorrente2, 10) + 1), "_blank");
newTab.blur(); // Mette in background la nuova scheda
window.focus(); // Riporta il focus sulla scheda corrente
    }
    if (!(indirizzoPhotos.includes('page'))){
    window.open(window.location.href + 'page2', "_blank");
    }
});

// funzione chiusura pagina

buttonClose.addEventListener("click", function() {
    window.close();
});
buttonClose2.addEventListener("click", function() {
    window.close();
});

// funzione NEXT 10 PAGES

button10.addEventListener("click", function() {
    if (indirizzoPhotos.includes('page')){
        var indirizzoDiviso = indirizzoPhotos.split('page');
        var numCorrente = indirizzoDiviso[indirizzoDiviso.length -1];
        var numNew = numCorrente;
        var indirizzoSenzaNum = indirizzoDiviso.splice(0, (indirizzoDiviso.length -1));

        if (indirizzoPhotos.indexOf('page') > -1) {
            var numPages = 10;
            var numStart = 1;
            while (numStart <= numPages) {
            var newTab = window.open(indirizzoSenzaNum + 'page' + (parseInt(numCorrente, 10) + (numPages - numStart + 1)), "_blank");
                newTab.blur();
                window.focus();
                numStart = numStart + 1;
            }

            button10.innerHTML = "__";
        }
    }
    if (!(indirizzoPhotos.includes('page'))){
        var indirizzoB = indirizzoPhotos + 'page1';
        var indirizzoDivisoB = indirizzoB.split('page');
        var numCorrenteB = indirizzoDivisoB[indirizzoDivisoB.length -1];
        var numNewB = numCorrenteB;
        var indirizzoSenzaNumB = indirizzoDivisoB.splice(0, (indirizzoDivisoB.length -1));

        if (indirizzoPhotos.indexOf('page') > -1) {
            var numPagesB = 10;
            var numStartB = 1;
            while (numStartB <= numPagesB) {
            var newTabB = window.open(indirizzoSenzaNumB +'page'+(parseInt(numCorrenteB, 10)+(numPagesB - numStartB + 1)), "_blank");
                newTabB.blur();
                window.focus();
                numStartB = numStartB + 1;
            }
            button10.innerHTML = "__";
        }
    }
});

// funzione NEXT PAGES prompt

button1.addEventListener("click", function() {
    if (indirizzoPhotos.includes('page')){
        var indirizzoDiviso = indirizzoPhotos.split('page');
        var numCorrente = indirizzoDiviso[indirizzoDiviso.length -1];
        var numNew = numCorrente;
        var indirizzoSenzaNum = indirizzoDiviso.splice(0, (indirizzoDiviso.length -1));


        if (indirizzoPhotos.indexOf('page') > -1) {
            var numPages = prompt("how many pages to open?");
            var numStart = 1;
            while (numStart <= numPages) {
            var newTab = window.open(indirizzoSenzaNum +'page'+(parseInt(numCorrente, 10)+ (numPages - numStart + 1)), "_blank");
                newTab.blur();
                window.focus();
                numStart = numStart + 1;
        }

        button1.innerHTML = "...opened";
        }

    }
    if (!(indirizzoPhotos.includes('page'))){
        var indirizzo = indirizzoPhotos + 'page1';
        var indirizzoDiviso = indirizzo.split('page');
        var numCorrente = indirizzoDiviso[indirizzoDiviso.length -1];
        var numNew = numCorrente;
        var indirizzoSenzaNum = indirizzoDiviso.splice(0, (indirizzoDiviso.length -1));

        if (indirizzo.indexOf('page') > -1) {
            var numPages = prompt("how many pages to open?");
            var numStart = 1;
            while (numStart <= numPages) {
            var newTab = window.open(indirizzoSenzaNum +'page'+(parseInt(numCorrente, 10)+(numPages - numStart + 1)), "_blank");
                newTab.blur();
                window.focus();
                numStart = numStart + 1;
            }
        button1.innerHTML = "...opened";
        }
    }

});


// funzione apri in background al primo click e chiudi la pagina al secondo click

var numeroClick = 0;

function gestoreClick() {
    // Incrementa il contatore di click
    numeroClick++;

    // Determina quale funzione eseguire in base al numero di click
    if (numeroClick === 1) {

    buttonSW.innerHTML = "1 OPENED<br>2 close this page";

    if (indirizzoPhotos.includes('page')){
    var indirizzoDiviso2 = indirizzoPhotos.split('page');
    var numCorrente2 = indirizzoDiviso2[indirizzoDiviso2.length -1];
    var indirizzoSenzaNum2 = indirizzoDiviso2.splice(0, (indirizzoDiviso2.length -1));
    var newTab = window.open(indirizzoSenzaNum2 + 'page' + (parseInt(numCorrente2, 10) + 1), "_blank");
    newTab.blur(); // Mette in background la nuova scheda
    window.focus(); // Riporta il focus sulla scheda corrente
    }
    if (!(indirizzoPhotos.includes('page'))){
    window.open(window.location.href + 'page2', "_blank");
    }

    } else if (numeroClick === 2) {

        window.close();

        // Resettare il contatore dopo il secondo click
        numeroClick = 0;
    }

}

buttonSW.addEventListener('click', gestoreClick);


// BARRA _________________________________________________________________

    //AGGIUNTA DUPLICA BARRA

        // Trova l'elemento della barra delle pagine esistente
        var existingPager = document.querySelector('.pagination-view'); // Sostituisci con il selettore CSS corretto

        // Verifica se l'elemento è stato trovato
        if (existingPager) {
            // Clona l'elemento della barra delle pagine
            var duplicatedPager = existingPager.cloneNode(true);

    var magicToolbar = document.querySelector('.fluid-magic-toolbar');

    // Assicurati che l'elemento sia stato trovato prima di procedere
    if (magicToolbar) {
        // Inserisci duplicatedPager prima di magicToolbar
        magicToolbar.parentNode.insertAdjacentElement('beforebegin', duplicatedPager);
    } else {
        // L'elemento con la classe .fluid-magic-toolbar non è stato trovato
        // Puoi gestire questo caso a tua discrezione.
    }
        }

        //FINE AGGIUNTA DUPLICA BARRA
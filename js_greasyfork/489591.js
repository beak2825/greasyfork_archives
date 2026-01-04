// ==UserScript==
// @name        Prenotazione semiautomatica esami Lombardia
// @namespace   StephenP
// @match       https://www.fascicolosanitario.regione.lombardia.it/prenotaonline/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM.getValue
// @grant       GM.setValue
// @version     1.1
// @author      StephenP
// @description 11/3/2024, 22:26:01
// @require https://update.greasyfork.org/scripts/474617/1245984/GM_config-93Akkord-Fork.js
// @downloadURL https://update.greasyfork.org/scripts/489591/Prenotazione%20semiautomatica%20esami%20Lombardia.user.js
// @updateURL https://update.greasyfork.org/scripts/489591/Prenotazione%20semiautomatica%20esami%20Lombardia.meta.js
// ==/UserScript==

//VALORI IMPOSTATI DALL'UTENTE

/*Tempo massimo entro il quale cercare l'appuntamento
(es. impostando il valore a 30 e avviando la ricerca il 5 Novembre, verranno segnalati solo appuntmanti disponibili entro il 5 Dicembre dello stesso anno)*/
var giorniMassimi=30;

/*Ritardo minimo tra una ricerca e l'altra
(il ritardo massimo è uguale al doppio del tempo impostato). Il tempo è indicato in secondi
NON IMPOSTARE TEMPI TROPPO BASSI (consigliati almeno 10 secondi tra una ricerca e l'altra)*/
var ritardo=10;

/*Elenco delle province da escludere dalla ricerca.
Vanno scritte esattamente come nell'elenco sul sito (possono essere indicate anche in ordine sparso).*/

//FINE VALORI IMPOSTATI DALL'UTENTE
var scriptConf="";
(async function(){
  let gmc = new GM_config(
  {
    'id': 'MyConfig', // The id used for this instance of GM_config
    'title': 'Impostazioni dello script per la prenotazione semiautomatica', // Panel Title
    'fields': // Fields object
    {
      'giorniMassimi': // This is the id of the field
      {
        'label': 'Tempo massimo entro il quale cercare l\'appuntamento (giorni)', // Appears next to field
        'type': 'int', // Makes this setting a text field
        'default': '30' // Default value if user doesn't change it
      },
      'ritardo': // This is the id of the field
      {
        'label': 'Ritardo minimo tra una ricerca e l\'altra (secondi)', // Appears next to field
        'type': 'int', // Makes this setting a text field
        'default': '10' // Default value if user doesn't change it
      },
      'BERGAMO':
      {
        'label': 'BERGAMO', // Appears next to field
        'section': ['PROVINCE IN CUI EFFETTUARE LA RICERCA','Verranno cercati appuntamenti solo nelle province selezionate'],
        'type': 'checkbox', // Makes this setting a checkbox input
        'default': true // Default value if user doesn't change it
      },
      'BRESCIA':
      {
        'label': 'BRESCIA', // Appears next to field
        'type': 'checkbox', // Makes this setting a checkbox input
        'default': true // Default value if user doesn't change it
      },
      'COMO':
      {
        'label': 'COMO', // Appears next to field
        'type': 'checkbox', // Makes this setting a checkbox input
        'default': true // Default value if user doesn't change it
      },
      'CREMONA':
      {
        'label': 'CREMONA', // Appears next to field
        'type': 'checkbox', // Makes this setting a checkbox input
        'default': true // Default value if user doesn't change it
      },
      'LECCO':
      {
        'label': 'LECCO', // Appears next to field
        'type': 'checkbox', // Makes this setting a checkbox input
        'default': true // Default value if user doesn't change it
      },
      'LODI':
      {
        'label': 'LODI', // Appears next to field
        'type': 'checkbox', // Makes this setting a checkbox input
        'default': true // Default value if user doesn't change it
      },
      'MANTOVA':
      {
        'label': 'MANTOVA', // Appears next to field
        'type': 'checkbox', // Makes this setting a checkbox input
        'default': true // Default value if user doesn't change it
      },
      'MILANO CITTA\'':
      {
        'label': 'MILANO CITTA\'', // Appears next to field
        'type': 'checkbox', // Makes this setting a checkbox input
        'default': true // Default value if user doesn't change it
      },
      'MILANO PROVINCIA':
      {
        'label': 'MILANO PROVINCIA', // Appears next to field
        'type': 'checkbox', // Makes this setting a checkbox input
        'default': true // Default value if user doesn't change it
      },
      'MONZA E DELLA BRIANZA':
      {
        'label': 'MONZA E DELLA BRIANZA', // Appears next to field
        'type': 'checkbox', // Makes this setting a checkbox input
        'default': true // Default value if user doesn't change it
      },
      'PAVIA':
      {
        'label': 'PAVIA', // Appears next to field
        'type': 'checkbox', // Makes this setting a checkbox input
        'default': true // Default value if user doesn't change it
      },
      'SONDRIO':
      {
        'label': 'SONDRIO', // Appears next to field
        'type': 'checkbox', // Makes this setting a checkbox input
        'default': true // Default value if user doesn't change it
      },
      'VARESE':
      {
        'label': 'VARESE', // Appears next to field
        'type': 'checkbox', // Makes this setting a checkbox input
        'default': true // Default value if user doesn't change it
      }
    }
  });
  let onInit = config => new Promise(resolve => {
    let isInit = () => setTimeout(() =>
      config.isInit ? resolve() : isInit(), 0);
    isInit();
  });

  // Generate a Promise
  let init = onInit(gmc);

  // Break up get() calls
  init.then(() => {
    // initialization complete
    // value is now available
  });
  gmc.open();
})();

var contenuto=document.getElementById("content");
var interval;
var cerca;
var dataFormat=/[0-9]+\/[0-9]+\/[0-9]+/
var set=0;

(async function(){
  let cfg=await GM.getValue("MyConfig");
  scriptConf=JSON.parse(cfg);
  ritardo=scriptConf.ritardo;
  giorniMassimi=scriptConf.giorniMassimi;
  console.log(scriptConf);
}
)();

const config = { attributes: false, childList: true, subtree: true };

const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    //console.log(mutation.target);
    if(mutation.target.classList.contains("lista-appuntamenti")){
      if(set==0){
        var primoAppuntamento=mutation.target.querySelectorAll("li.appuntamento [ng-if=\"disponibilita.getAppuntamento().isClassico()\"]")
        if(primoAppuntamento.length>0){
          primoAppuntamento=primoAppuntamento[1].innerText;
          var [day, month, year] = dataFormat.exec(primoAppuntamento)[0].split('/');
          var date = new Date(+year, +month - 1, +day);
          if(Math.floor((date - Date.now()) / (1000*60*60*24))<giorniMassimi){
            console.log("Prima data disponibile: "+date);
            setInterval(function(){beep()},1000);
            clearInterval(interval);
            observer.disconnect();
          }
          else{
            console.log("Prima data disponibile troppo lontana: "+date);
            setTimeout(function(){document.getElementById("modifica-ricerca-info-testata").click()}, 2000);
            setTimeout(function(){document.querySelector("[ng-click=\"doveQuandoModalCtrl.aggiorna()\"]").click();set=0;}, Math.floor(ritardo*1000*(1+Math.random())) );
          }
          set=1;
        }
      }
    }
    if(!cerca){
      cerca=contenuto.querySelector("[ng-click=\"doveQuandoCtrl.ricercaDisponibilita()\"]");
      if(cerca){
          //alert("cerca");
          interval=setInterval(function(){ricerca()}, Math.floor(ritardo*1000*(1+Math.random())));

        }
    }
  }
};

const observer = new MutationObserver(callback);
observer.observe(contenuto, config);

function ricerca(){
  var chiudiErrore=document.querySelector("button[ng-click=\"failureCtrl.close()\"]");
  if(chiudiErrore){
    chiudiErrore.click();
  }
  cambiaProvincia();
  cerca.click();
}

function beep() { //https://stackoverflow.com/a/23395136
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    snd.play();
}
function cambiaProvincia(){
  var selProv=document.getElementById("provincia");
  var province=selProv.querySelectorAll("option:not(:first-of-type)");//seleziona tutte le province, ma toglie la voce "selezionare una provicia"
  let selectNext=0;
  for(let prov of province){
    if(selectNext==1){
      if(scriptConf[prov.getAttribute("label")]){
        prov.setAttribute("selected","selected");
        selProv.value=prov.value;
        let event = new Event('change')
        selProv.dispatchEvent(event);
        selectNext=2;
        continue
      }
      continue
    }
    if((prov.hasAttribute("selected"))&&(selectNext!=2)){
      selectNext=1;
    }
    prov.removeAttribute("selected");
  }
  if(selectNext==1){
    province[0].setAttribute("selected","selected");
    selProv.value=province[0].value;
    let event = new Event('change')
    selProv.dispatchEvent(event);
  }
}
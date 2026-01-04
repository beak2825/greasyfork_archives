// ==UserScript==
// @name           Greasy Fork Theme figuccio
// @namespace      https://greasyfork.org/users/237458
// @description    Greasy Fork pagina colorata
// @match          https://greasyfork.org/*
// @match          https://sleazyfork.org/*
// @match          *://greasyfork.org/*/users/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant          GM_setClipboard
// @version        11.9
// @noframes
// @author         figuccio
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_registerMenuCommand
// @run-at         document-end
// @grant          GM_xmlhttpRequest
// @icon           https://www.google.com/s2/favicons?domain=greasyfork.org
// @require        http://code.jquery.com/jquery-latest.js
// @require        https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/395967/Greasy%20Fork%20Theme%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/395967/Greasy%20Fork%20Theme%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
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

    const $ = window.jQuery.noConflict();//$ evita triangolo giallo
    const body = document.body;
    const style = "position:fixed;top:9px;left:870px;z-index:99999;";
    const box = document.createElement("div");

    box.id = "mytema";
    box.style = style;
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
    ////////////////////////////
    // Mostra/Nascondi con animazione
    function provagf() {
        var box = document.getElementById('mytema');
        $(box).fadeToggle(3000); // Animazione per mostrare/nascondere
    }
    GM_registerMenuCommand("nascondi/mostra box", provagf);

    // Dati per la conservazione
    const userdata = { color: 'theme' };
    var mycolor = GM_getValue(userdata.color, "#980000"); // Valore predefinito

let use12HourFormat = GM_getValue('use12HourFormat', false); // Default è il formato 24 ore
let language = GM_getValue('language') || 'it'; // Recupera la lingua dal localStorage o usa 'it' come predefinita

const languages = {
    en: { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' },
    it: { weekday: 'short', month: '2-digit', day: '2-digit', year: 'numeric' }
};
function myTimer() {
    const now = new Date(); // Crea un'istanza di Date ogni volta
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
    const date = now.toLocaleString(language, languages[language]); // Usa la lingua selezionata per la data
    let period = "";

    if (use12HourFormat) { // Condizione corretta per il formato 12 ore
        period = hours >= 12 ? " PM" : " AM";
        hours = hours % 12 || 12; // Converte in formato 12 ore
    }

    hours = String(hours).padStart(2, "0"); // Aggiunge lo zero iniziale per ore
    document.getElementById("greasy").textContent = `${date} ${hours}:${minutes}:${seconds}:${milliseconds}${period}`;
}

function toggleFormat() {
    use12HourFormat = !use12HourFormat; // Alterna il formato orario
    GM_setValue('use12HourFormat', use12HourFormat); // Salva lo stato del formato
    language = (language === 'it') ? 'en' : 'it'; // Alterna tra 'it' e 'en'
    GM_setValue('language', language); // Salva la lingua scelta
}
// Chiama la funzione di inizializzazione e avvia il timer
const intervalTime = 90; // Imposta l'intervallo di tempo
setInterval(myTimer, intervalTime);

    // Elemento HTML nel div
    box.innerHTML = `
        <fieldset style="background:#3b3b3b;border:2px solid red;color:lime;border-radius:7px;text-align:center;width:480px;height:43px;">
            <legend>Time</legend>
            <div id=setui style="width:auto;height:25px;margin-top:-13px;margin-left:0px;margin-right:0px;margin-bottom:0px;">
<button id="colorspan" title="Hex value" style="font-size:14px;cursor:pointer;margin-left:1px;margin-bottom:-19px;color:lime;background-color:brown;border:1px solid yellow;">${mycolor}</button>
<input type="color" title="Color picker" list="colors" id="colorinput" style="width:25px;height:23px;cursor:pointer;margin-left:1px;margin-top:12px;background-color:#3b3b3b;color:red;border:1px solid yellow;border-radius:5px;"value="${mycolor}">

<div id="greasy" title="Data-ora" style="font-size:14px!important;display:inline-block;cursor:pointer;background:#3b3b3b;color:lime;border:1px solid yellow;border-radius:5px;margin:1px;text-align:center;width:max-content;">
</div>
                  <label title="Cambia 12/24h" style="cursor:pointer">
                  <input type="radio" name="options" title="Cambia 12/24h" value="toggleFormat" style="cursor:pointer;">12/24h
                        </label>
<span class="button" title="Chiudi" id='close' style="background:chocolate;color:lime;border:1px solid yellow;border-radius:50%;cursor:pointer;font-size:14px;padding:3px 6px;display:inline-block;line-height:16px;margin-top:-19px;margin-left:1px;">X</span>

        </fieldset>
    `;
// Event listener for radio button selection
$('input[name="options"]').on('change', function() {
    const selectedValue = $(this).val();
     if (selectedValue === 'toggleFormat') {
        toggleFormat();
    }

    // Disable the radio buttons temporarily
    $('input[name="options"]').prop('disabled', true);

    // Re-enable the radio buttons after a short delay
    setTimeout(() => {
        $('input[name="options"]').prop('disabled', false).prop('checked', false);
    }, 300); // Milliseconds
});
    // Aggiunta funzione per chiudere il box
    var colorinputsetMenuClose = document.querySelector('#close');
    colorinputsetMenuClose.addEventListener('click', provagf, false);

    var colorinput = document.querySelector('#colorinput');
    var colorspan = document.querySelector('#colorspan');

    // Evento della tavolozza dei colori
    colorinput.addEventListener('input', function(event) { colorChange(event); }, false);
    $('body').css("background-color", mycolor);

    function colorChange(e) {
        mycolor = e.target.value;
        colorspan.innerHTML = e.target.value;
        $('body').css("background-color", mycolor);
        GM_setValue(userdata.color, mycolor);
    }
////////////////////////////////////////////////
function execCopy() {
    var code='';
    if($(".prettyprint li").length>0)
    {
        $(".prettyprint li").each(function(){
            code += $(this).text()+'\n';
        });
    }
   else {code = $(".prettyprint").text();}

    code = encodeURI(code)
    code = code.replace(/%C2%A0/g,'%20');
    code = decodeURI(code);

    GM_setClipboard(code, 'text');
    alert("copiato con successo")
    return true;
}

    //Il collegamento al codice sorgente viene visualizzato dopo il collegamento allo script
    $(".script-list h2 a").each(function(){
        if(!$(this).next().hasClass("code-link"))
        {let short_link = $(this).attr("href");
              let $code_link = $('<a target="_blank" a href=\"'+short_link+'/code\" class=\"code-link\">codice</a>');//apre in nuova scheda
            $(this).after($code_link);
        }
    })

    //////////////////////////////////////////////////////////
    GM_addStyle('.source{'+
                'display: inline-block;'+
                'background-color:lime;'+
                'padding: 0.5em 1em;'+
                'color: white;'+
                'text-decoration: none;'+
                'cursor:pointer}'+
                '.code-link'+
                '{'+
                '	margin-left:10px; '+
                '	padding-left:2px;'+
                '	padding-right:2px; '+
                '	font-size:12px; '+
                '	background:red; '+
                '	color:white!important; '+
                '	text-decoration: none;'+
                '}');
//////////////////
      if(window.location.href.indexOf("/code")!= -1) //code
        {var source_btn = $("<a></a>")
        source_btn.addClass("source");
        source_btn.text("copiare il codice sorgente");
        source_btn.click(function(){
            execCopy();
        });
        $("#install-area").after(source_btn);
    }
//////////////////////
//passa alla pagina successiva richiede jquery anche sulla pagina degli autori marzo 2024
$(window).scroll(function() {
if($(window).scrollTop() + $(window).height() == $(document).height()) {
document.querySelector("#user-script-list-section > div > a.next_page,body > div.width-constraint > div > div.sidebarred-main-content > div.pagination > a.next_page").click();
   }
});

//apre i link in nuova scheda maggio 2023
   function modifyLinks() {
  let links =document.querySelectorAll('#browse-script-list a');
  for (let i = 0; i < links.length; i++) {
    links[i].setAttribute('target', '_blank');
  }

}
modifyLinks();
//////////////////////////////////////////////////////////////////////////
 //Convertire l'ora UTC in formalo italiano
$("relative-time").each(function(){
    let datetime = new Date($(this).attr("datetime"));
    let day = datetime.getDate()<10 ? "0"+datetime.getDate() : datetime.getDate();
    let month = (datetime.getMonth()+1)<10 ? "0"+(datetime.getMonth()+1) : (datetime.getMonth()+1);
    let hours = datetime.getHours()<10 ? "0"+datetime.getHours() : datetime.getHours();
    let minutes = datetime.getMinutes()<10 ? "0"+datetime.getMinutes() : datetime.getMinutes();
    let seconds = datetime.getSeconds()<10 ? "0"+datetime.getSeconds() : datetime.getSeconds();
    let posttime = day+"/"+month+"/"+datetime.getFullYear()+"\xa0\xa0"+hours+":"+minutes+":"+seconds;
    if(this.shadowRoot != undefined)
    {
        $(this.shadowRoot).text(posttime);
    }
    else
    {
        $(this).text(posttime);
    }
})

//mostra risultati in tutte le lingue
GM_addStyle('a:hover {background-color:#876b9a;padding:5px 10px;border-radius:5px;}');
//scritta greasy fork
GM_addStyle('#main-header {background-color:#5d3e72; background-image: linear-gradient(#412451, #009981); box-shadow: 0 0 15px 2px #000000a1;padding: .25em 0; }');
//colore paginazione
GM_addStyle('.pagination > *, .script-list + .pagination > *, .user-list + .pagination > *{background-color:#564062;!important;}');
GM_addStyle('body > div > div > div.sidebarred-main-content > div.pagination > em{background-color:green!important;}');//colore num pag current
GM_addStyle('.pagination{border: 2px solid peru !important;background: linear-gradient(to bottom, rgba(19, 19, 19, 1) 0%, rgba(51, 51, 51, 1) 0%, rgba(17, 17, 17, 1) 169%, rgba(0, 0, 0, 1) 98%) repeat scroll 0 0 rgba(0, 0, 0, 0); border-radius: 3px 3px 0 0 !important;}');
GM_addStyle('.width-constraint .pagination {border-radius:10px!important;}');
//////////////////////mostra numero 1,2,3ecc accanto agli script
    //Funzione 1: Stile ed evidenziazione degli script utente
    function applyStylesAndHighlight() {
        const page = +new URLSearchParams(document.location.search).get('page') || 1;
        const q = `<style>
            #browse-script-list{counter-reset: section ${(page-1)*50};}
            .ad-entry{height:0;overflow:hidden;}
            #browse-script-list li{position:relative}
            .Finn{background:gold;}
            .ad-entry{display:none}
            #browse-script-list li:after{
                counter-increment: section;
                content:counter(section);
                font:bold 20px/30px Arial;
                background:red;
                color:green;
                position:absolute;
                bottom:8px;
                right:15px
            }
        </style>`;
        document.documentElement.insertAdjacentHTML('afterbegin', q);

        const a = document.querySelector(".user-profile-link a")?.href; // Utilizzare il concatenamento facoltativo
        if (a) { // Procedere solo se a è definito
            document.querySelectorAll("#browse-script-list li").forEach(function(i) {
                const b = i.querySelector("dd.script-list-author a");
                if (b && b.href === a) {
                    i.className = 'Finn';
                }
            });
        }
    }

    //Funzione 2: Aggiungere la numerazione all'elenco degli script utente nelle pagine utente
    function addNumberingToUserScripts() {
        if (window.location.href.includes("/users/")) {
            const scriptList = document.querySelectorAll('.script-list > li');

            if (scriptList) {
                scriptList.forEach((script, index) => {
                    const numberSpan = document.createElement('span');
                    numberSpan.style.marginRight = '5px';
                    numberSpan.style.fontWeight = 'bold';
                    numberSpan.style.background = 'red';
                    numberSpan.style.color = 'green';
                    numberSpan.textContent = `${index + 1}`;
                    script.insertBefore(numberSpan, script.firstChild);
                });
            }
        }
    }

    // Chiama entrambe le funzioni
    applyStylesAndHighlight();
    addNumberingToUserScripts();

//autoclick casella editor checkbox
    const checkbox = document.querySelector("#enable-source-editor-code")
    if (checkbox.checked === false) {
        checkbox.click();
    }

})();

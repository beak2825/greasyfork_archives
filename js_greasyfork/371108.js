// ==UserScript==
// @name        Tweakers - Extra prijzenfilters
// @namespace   tweakers.extra.filters
// @description:nl  Dit script voegt extra prijzenfilters toe in de Pricewatch van Tweakers.net.
// @include     https://tweakers.net/categorie/*
// @include     https://tweakers.net/pricewatch/zoeken/?*
// @version     0.2.2
// @icon  data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAACXBIWXMAAAsTAAALEwEAmpwYAAACE0lEQVQokZWSS2gTYRSFz//Pn8fUPDQ+aui01pIWko0Fq2K0knFRdOMq4sZ1EYou3GrJQtCFirgQBEEXEcSVLhMXYVQENzUTUCNtMNQ+sGh1bNrJc+a6GJyUutG7OvfyXbice9jzhIr/KQGQ2zCBsCqC49LcWu3ShXf7fYFkaPex0B7BWJd5Fk85Sh7mylWfV2Hrv6zT6suVrw1n3uftudyXGPIHnJaDCERyjA/e8XsVJjF2cXLGpQEstcwr88XPjZpDcgIgoEz7uAzO2N2bc29ef99yd8O2bi+VO0QECCJsPym8CgPw9tVq9tG3VCrlorquG4YBYLllzlirh6RdAkShcQmAzytdv/ZxdPRgoVBwF1RV1TQNQDwRSmeU+ek6J4IckwA0W9bhozuLxaKqqrqul0olRwCQZen+wzF5hBOBE3VtnTi11zAMTdMMw3AFgBu3DkQH/ACISBDBrFjhXgHgSDISDIparaPrOvvjffpc/5l0tGNRvWIRQTobGeAC4RMeAIyzL1Xzw/u1fD6fy+UAxIaDD7JjYACw8rhZr1js6dBxJhDPBnz9HIDdoeXFuntkb9Tv8XEAzUW7fH6dOhBERG1UM+bIvW1cZlwwZbBnyx/sOlUzpt0m59MAwfxkzU5tNBfsv9PWXLBnpzbMsuWQ7Mm+ZDdYHhaZ8OxIeeUYB1Cv2D+11o8XbWpvCujmhX+p3/SG60Fa/ZSUAAAAAElFTkSuQmCC

// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @description Dit script voegt extra prijzenfilters toe in de Pricewatch van Tweakers.net.
// @downloadURL https://update.greasyfork.org/scripts/371108/Tweakers%20-%20Extra%20prijzenfilters.user.js
// @updateURL https://update.greasyfork.org/scripts/371108/Tweakers%20-%20Extra%20prijzenfilters.meta.js
// ==/UserScript==

// @include     http://www.blanksite.com/

/*eslint no-redeclare: ["error", { "builtinGlobals": true }]*/
/*eslint-env browser, greasemonkey*/

/*
Gedaan:
+ Bedieningspaneel maken.
+ Sorteren op prijs ja/nee.
+ "Prijsloos verbergen" in menu zetten.
+ Knop om te wissen in menu zetten.
+ Waardes formulier onthouden met Localsettings.
+ Slechte winkels hoeven niet exact overeen te komen: for (...){ ... .match.(invoer) }
+ Bij regex, checken of inderdaad alle prijzen gevonden zijn, op basis van getal in elke knop bij resultaat.
0 Levertermijnen moeten van negatief naar positief: bij een door Tweakers nieuw bedachte term moet de prijs niet afgekeurd worden. [Op een andere manier wel aangepakt: wanneer de termijn niet in de mogelijke levertijden zit, wordt een foutmelding geprint, maar wordt de prijs wel verder getoond/gebruikt.]
+ 'Alle scores toestaan' is niet 0, maar kan ook wat anders zijn.
+ Aantal gefilterde prijzen en gefilterde producten tonen in paneel.
+ "Bezig" tonen wanneer sorteren bezig is.
+ Herladen wanneer pagina wijzigt.
+ Timer instellen voor het geval elementen toch niet gevonden kunnen worden onload.
+ Zo vroeg mogelijk menu toevoegen: DOMContentLoaded, setInterval, onload.
+ Wanneer geen prijsetiket: aantal prijzen op 0 zetten en/of niet de prijzenpagina ophalen.
+ Bij druk op knop: alleen prijslijsten opnieuw samenstellen wanneer pagina veranderd is door oorzaak buiten script.
+ Geheel inklapbaar maken.
+ Optie toevoegen: zoeken op verplichte winkels.
+ Uitzoeken hoe het kan dat niet alle prijzen weggefilterd worden wanneer verplichte en verboden winkels dezelfde winkel bevatten, b.v. "amazon".
+ Onload vervangen door eventhandler.
+ Checken voor alle objecten en verzamelingen (zie onderaan) of er niet "if(object)" gedaan is, want dat is ~altijd true.

0.1.1:
+ Veranderde prijzen markeren.
+ Optie toevoegen: inclusief verzendkosten of niet.
+ Regels aanpassen voor Tampermonkey e.d. is niet meer nodig.

0.1.2:
+ Sortering producten moet hersteld kunnen worden bij wissen en bij verandering filters (alle_producten moet bewaard blijven totdat pagina verandert door oorzaak buiten script, voor de indices).
+ Ongedierte geplet.

0.1.3:
+ Ongedierte geplet waarbij producten werden geselecteerd voordat lijst automatisch veranderde, en deze niet geüpdate werden (de variabele 'producten' wordt nu elke keer geüpdate wanneer filters_uitvoeren begint).

0.1.4:
+ Regex aangepast na verandering html productpagina's.

0.2.0:
+ Script gerepareerd door selector voor producten in productenlijst aan te passen nadat Tweakers deze veranderd had.
+ Regex aangepast aan veranderde term van Tweakers in productpagina's.
+ Automatische vertraging ingebouwd opdat de server van Tweakers niet overvraagd wordt.
+ Resultaten zouden nu automatisch correct moeten worden gefilterd zodra ze veranderen doordat b.v. op "terug" wordt gedrukt (terug naar de vorige pagina in de browser-geschiedenis).

0.2.1:
+ Voortgang wordt getoond in knop.
+ Te veel pagina's opgevraagd wordt getoond in knop.
+ Maximum aantal pagina's om ineens op te vragen verhoogd tot 25.
+ Minimumtijd tussen opvragingen verhoogd tot 150 ms.
- Nog steeds geen perfecte oplossing voor wanneer er te veel pagina's worden opgevraagd.

0.2.2
+ In de toepassen-knop laten zien hoeveel resultaten er nog gefilterd moeten worden wanneer bezig.
- Nog steeds geen perfecte oplossing voor wanneer er te veel pagina's worden opgevraagd.


Te doen:

- Regex prijslijst backup gebruiken wanneer aantal winkels niet overeenkomt, dan tweede/etc. regex toepassen op resultaat.

- Ervoor zorgen dat altijd 100 resultaten per pagina getoond worden.
- Mogelijkheid om meer dan één pagina met resultaten mee te nemen (kost wel meer tijd en gegevensverkeer).
- Ook toepassen op andere pagina's, b.v. Vergelijken, artikelen, Bestekoopgids.
- Indien maximumprijs gekozen is bij normale filters, gefilterde resultaten daarop aanpassen (wegfilteren).

- Meer functies uitsplitsen van code.
- DocumentFragment gebruiken.

- Knop toevoegen voor automatisch toepassen bij toekomstige zoekopdrachten (alleen in hetzelfde tab?).
- Optie toevoegen: winkels toestaan die volgens Tweakers niet voldoen, zoals zonder Ideal (?).
- Minimaal aantal winkelrecensies kiezen.
- Preorder als aparte keuze in paneel?
- Optie toevoegen om bij sorteren overige_producten (zonder prijs, b.v. "wordt verwacht") ook onderaan te zetten bij weggefilterde producten.

- Toepassen met enter.
- Radioknoppen samen in div zetten (voor marges e.d.).
- Unieke namen maken voor id's van elementen in paneel.
- Elementen in paneel automatisch genereren op basis van arrays (zoals mogelijke_levertijden).
- Opmaak aantallen in paneel.
- Waarschuwing tonen in paneel wanneer er een serieus probleem is (console.error, console.warn).
- Help-knopjes maken (tooltips?).
- Labels maken voor boven zoekresultaten, die weggeklikt kunnen worden met kruisjes.

- Bug: nog steeds te veel verzoeken bij 100 resultaten.
- Bug: waarschuwings-alert komt nog steeds meerdere keren tegelijk op.


*/


var debug = true;    // Dit uitzetten om alle log-berichten uit te schakelen.
var trace = false;
// trace = true;
// l('-------------Script Tweakers extra filters begint-------------', 'notrace');

// localStorage.clear();
// var min = localStorage.getItem(min);
// l('min uit stor: ' + min);
// localStorage.setItem(min, 4);
// l('min uit stor: ' + min);
// setValue("minimumscore", 3);

// Definitie:
var minimumscore = getValue("minimumscore", 0);
// var mogelijke_levertijden;
var mogelijke_levertijden = [ "one_day_247", "one_day_245", "three_days", "five_days", "eight_days", "twelve_days", "over_twelve_days", "unknown", "pre-order" ];
// var toegestane_levertijden = Object.assign([], mogelijke_levertijden);
var toegestane_levertijden = getValue("toegestane_levertijden", Object.assign([], mogelijke_levertijden));
var verboden_winkels = getValue("verboden_winkels", []);
var verplichte_winkels = getValue("verplichte_winkels", []);
var weggefilterd_verbergen = getValue("weggefilterd_verbergen", false);
var inclusief_verzenden = getValue("inclusief_verzenden", false);

var sorteren_op_prijs;
var aantal_producten_tot_nu_toe;
var toepassen_bezig;
var wissen_bezig = false;
var menu_geladen = false;
var observer;
var tabel;
var config;
var observer_bezig;
var sorteerstijlen;

var firstxr = 0;
var date;
var begintijd;

var producten = [];
var aantal_producten = 0;
var geprijsde_producten = [];
var weggefilterde_producten = [];
var overige_producten = [];
var alle_producten = [];
var oude_producten = {};
var index_oude_producten = [];
var max_oude_producten = 1000;

var max_tegelijk_opgevraagd = 25;
var tijd_tussen_opvragingen = getValue("tijd_tussen_opvragingen", 150);   // ms
var eenmalige_pauze_opvraging = getValue("eenmalige_pauze_opvraging", 500);   // ms
var gewaarschuwd = 0;
const waarschuwing = 'Te veel verzoeken verstuurd naar de server: om dit probleem te vermijden, kunt U het aantal zoekresultaten per pagina verminderen.\nElke keer dat dit gebeurt probeert het script automatisch de verzoeken meer te spreiden (20% langere pauzes met een zeker maximum), dus kan het lonen om na even wachten nogmaals te proberen.';


var aantal_producten_weggefilterd;
var aantal_prijzen_weggefilterd_vanwege_score;
var aantal_prijzen_weggefilterd_vanwege_levertijd;
var aantal_prijzen_weggefilterd_vanwege_winkel;

script_naar_beginstand();

// // Voorbeeldinstellingen:
// var minimumscore = 3.5;
// var toegestane_levertijden = ["one_day_247", "one_day_245"];
// var verboden_winkels = ["Max ICT B.V.","SiComputers"];
// weggefilterd_verbergen = false;

function script_naar_beginstand(){
    /* Zet het script terug in zo'n stand dat filters opnieuw toegepast kunnen worden. */
    // sorteren_op_prijs = false;
    aantal_producten_tot_nu_toe = 0;
    toepassen_bezig = false;
    wissen_bezig = false;

    // producten = [];
    aantal_producten = 0;
    geprijsde_producten = [];
    weggefilterde_producten = [];
    overige_producten = [];
    alle_producten = [];

    aantal_producten_weggefilterd = 0;
    aantal_prijzen_weggefilterd_vanwege_score = 0;
    aantal_prijzen_weggefilterd_vanwege_levertijd = 0;
    aantal_prijzen_weggefilterd_vanwege_winkel = 0;

    if ( document.querySelector('#extrafilterknop') ){
    	console.log(gewaarschuwd, 'gewaarschuwd')
    	if (gewaarschuwd) {
			document.querySelector('#extrafilterknop').innerText = 'Te veel producten opgevraagd!';
			document.querySelector('#extrafilterknop').style.background = 'darkred';
    	} else {
	        document.querySelector('#extrafilterknop').innerText = 'Toepassen';
	        document.querySelector('#extrafilterknop').style.background = '#1668ac';
	    }
    }
    if(observer){
        observer.observe(tabel, config);
        l('Observer aangezet door script_naar_beginstand.')
    } else {
        l('script_naar_beginstand: nog geen observer');
    }
}

// var levertijden = [];

document.addEventListener("DOMContentLoaded", function() {  // functie kan event als parameter gebruiken
    if (!menu_geladen){
        menu_geladen = true;
        // l('DOMContentLoaded');
        menu_maken();
    }
});

var plaats_vinden = setInterval(function(){
        if (menu_geladen){
            clearInterval(plaats_vinden);
        } else {
            if (document.querySelector('div#filterContainer form#filterForm')) {
                clearInterval(plaats_vinden);
                menu_geladen = true;
                // l('plaats gevonden met interval.');
                menu_maken();
            }
        }
}, 100);

window.addEventListener('load',function () {
    // l('------------Pagina volledig geladen------------', 'notrace');
    if (!menu_geladen){
        menu_geladen = true;
        menu_maken();
    }
    // producten = document.querySelectorAll('table.listing tbody tr.largethumb');
    var interval_observer;

    // Select the node that will be observed for mutations
    tabel = document.querySelector('#listingContainer');

    // Options for the observer (which mutations to observe)
    config = { childList: true, subtree: true };    // attributes: true, 

    // Callback function to execute when mutations are observed
    var callback = function() {
        // observer.disconnect();
        l('Observer merkt verandering op.');
        document.querySelector('#extrafilterknop').innerText = 'Bezig...';
        document.querySelector('#extrafilterknop').style.background = '#282923';

        // producten = document.querySelectorAll('table.listing tbody tr.largethumb');
        if (interval_observer) {
            observer_bezig = true;
            console.log("interval_observer", interval_observer);
        }
        if (!interval_observer && !observer_bezig){
            l('Interval aanmaken');
            observer_bezig = false;
            interval_observer = setInterval( () => {

                l('Interval: observer_bezig = ' + observer_bezig);
                if (!observer_bezig) {
                    console.log("Interval verwijderen en filters_uitvoeren...");
                    clearInterval(interval_observer);
                    interval_observer = undefined;
                    // console.log("interval_observer", interval_observer);
                    console.log("oude_producten", Object.keys(oude_producten).length);
                    filters_uitvoeren();
                }
                observer_bezig = false;

            }, 1500);
            // filters_uitvoeren();
        }

    };

    // Create an observer instance linked to the callback function
    observer = new MutationObserver(callback);
    // l('Observer aangemaakt.')
}, false); 



function menu_maken(){

    var formulier = document.createElement("form");
    formulier.setAttribute("id", 'extrafilterformulier');
    formulier.name = 'extrafilterformulier';
    formulier.classList.add('filterOption');
    formulier.setAttribute("style", "padding: 0px;");

    var hoofdbalk = document.createElement("div");
    hoofdbalk.setAttribute("id", 'hoofdbalk');
    hoofdbalk.height = '15px';
    hoofdbalk.setAttribute("style", "\
        margin-bottom: 5px;\
        margin-left: 6px;\
        margin-top: 5px;\
        padding-left: 14px;\
        border-bottom: solid thin rgb(220, 220, 220);\
        cursor: pointer;\
        background: url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAMAAsDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAACQQH/8QAJxAAAAYCAgAFBQAAAAAAAAAAAQIDBAUGBwgRIQkTFjFBABIlQmH/xAAUAQEAAAAAAAAAAAAAAAAAAAAD/8QAGxEBAAICAwAAAAAAAAAAAAAAARExAAJBcfH/2gAMAwEAAhEDEQA/AGi2e8QDfvR7PmUMNWfWuS2+abNWIR8NO24hr7evQUZepNBixda37JqjIG9LoUNklIZSUyu5eGRtNHi7c5/GCwWZVBhNaIXO9dwNi+H2dvNTyRn9pV2w5VudErfpKny9scruHbwldg/MP5MXFJLoQzd8CbEs0EeM2WJhiyIRLLZzuDlVEgAXgFCk5EB54EzIB/bjnhwf4+CddD90CkkuQwABEuBTSP2U/uokQ4+ygdAJhAP5xyIj39LJqyq2dU8vuLJqyq2dU8vuf//Z') no-repeat center left;\
    ");

    var wissenknop = document.createElement("a");
    wissenknop.innerHTML = "Wissen";
    wissenknop.setAttribute("id", 'wissenknop');
    // wissenknop.setAttribute("class", 'knop_categorie');
    wissenknop.setAttribute("style", "\
        background: rgb(220, 220, 218) none repeat scroll 0% 0%;\
        padding: 2px;\
        margin-right: 4px;\
        margin-top: 1px;\
        margin-bottom: 2px;\
        float: right;\
        line-height: 10px;\
        text-align: center;\
        font-size: 10px;\
        color: black;\
        vertical-align: middle;\
        border-radius: 1px;\
        box-shadow: 1px 1px 0.5px 0.1px rgb(180, 180, 180);\
        border: thin solid rgb(180, 180, 180);\
        float: right;\
    ");

    wissenknop.addEventListener('click', function() {
        wissen_bezig = true;
        minimumscore = 0;
        setValue("minimumscore", minimumscore);

        toegestane_levertijden = Object.assign([], mogelijke_levertijden);
        setValue("toegestane_levertijden", toegestane_levertijden);

        verboden_winkels = [];
        setValue("verboden_winkels", verboden_winkels);
        verplichte_winkels = [];

        setValue("verplichte_winkels", verplichte_winkels);

        weggefilterd_verbergen = false;
        setValue("weggefilterd_verbergen", weggefilterd_verbergen);

        inclusief_verzenden = false;
        setValue("inclusief_verzenden", inclusief_verzenden);

        localStorage.clear();
        formulier.remove();
        menu_maken();
        filters_uitvoeren();
    }, false);

    hoofdbalk.appendChild(wissenknop);

    var hoofdtitel = document.createElement("h3");
    hoofdtitel.innerText = 'Extra prijzenfilters';
    hoofdtitel.classList.add("ellipsis") //, "toggleCollapse");
    hoofdtitel.setAttribute("title", "hoofdtitel");
    hoofdtitel.setAttribute("style", "\
        margin-bottom: 5px;\
    ");
    hoofdtitel.addEventListener('click', function() {
        var menu = document.querySelector('#extrafiltermenu');
        var display = getComputedStyle(menu, null).display;
        // l(display);
        if(display !== "none"){
            menu.style.display = "none";
            hoofdtitel.setAttribute("style", "\
                margin-bottom: 5px;\
            ");
            hoofdbalk.setAttribute("style", "\
                margin-bottom: 5px;\
                margin-left: 6px;\
                margin-top: 5px;\
                padding-left: 14px;\
                border-bottom: unset;\
                cursor: pointer;\
                background: url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAALAAgDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAgK/8QAHxAAAgMBAQACAwAAAAAAAAAAAwQCBQYHAQAIExYl/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ANSrnT99y/7hIcoqNRY9rynYfD6e9w0vRsa366jFBNaOilZhACnW5hZD9hIFBcMKXgjQkxTQtG2v7L5YeW5rg8VdbHR5bL1dLfdAuv2HZW6op+2Ggt/AwBFl5oxCl/GKEPZBTDISIDFZZCtBhtopnwP/2Q==') no-repeat center left;\
            ");
                // padding:4px 21px 4px 4px;\
                // margin-left: -2px;\
                // padding-left: 14px;\
                // cursor: pointer;\
        } else {
            menu.style.display = "block";
            hoofdtitel.setAttribute("style", "\
                margin-bottom: 5px;\
            ");
            hoofdbalk.setAttribute("style", "\
                margin-bottom: 5px;\
                margin-left: 6px;\
                margin-top: 5px;\
                padding-left: 14px;\
                border-bottom: solid thin rgb(220, 220, 220);\
                cursor: pointer;\
                background: url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAMAAsDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAACQQH/8QAJxAAAAYCAgAFBQAAAAAAAAAAAQIDBAUGBwgRIQkTFjFBABIlQmH/xAAUAQEAAAAAAAAAAAAAAAAAAAAD/8QAGxEBAAICAwAAAAAAAAAAAAAAARExAAJBcfH/2gAMAwEAAhEDEQA/AGi2e8QDfvR7PmUMNWfWuS2+abNWIR8NO24hr7evQUZepNBixda37JqjIG9LoUNklIZSUyu5eGRtNHi7c5/GCwWZVBhNaIXO9dwNi+H2dvNTyRn9pV2w5VudErfpKny9scruHbwldg/MP5MXFJLoQzd8CbEs0EeM2WJhiyIRLLZzuDlVEgAXgFCk5EB54EzIB/bjnhwf4+CddD90CkkuQwABEuBTSP2U/uokQ4+ygdAJhAP5xyIj39LJqyq2dU8vuLJqyq2dU8vuf//Z') no-repeat center left;\
            ");
                // padding:4px 21px 4px 4px;\
                // margin-left: -2px;\
                // padding-left: 14px;\
                // cursor: pointer;\

        }
    }, false);

    hoofdbalk.appendChild(hoofdtitel);

    formulier.appendChild(hoofdbalk);


    var menu = document.createElement("div");
    menu.setAttribute("id", 'extrafiltermenu');
    menu.classList.add('filterOption');
    menu.setAttribute("style", "\
        border-top: unset;\
    ");
        // padding-bottom: 2px;\
    formulier.appendChild(menu);

    var keuzenblad = document.createElement("div");
    keuzenblad.setAttribute("id", 'keuzenblad');
    // menu.classList.add('filterOption');
    // menu.setAttribute("style", "padding-bottom: 45px;");
    menu.appendChild(keuzenblad);

    var winkelscorekop = document.createElement("h4");
    winkelscorekop.innerText = 'Minimale winkelscore:';
    winkelscorekop.classList.add("ellipsis") //, "toggleCollapse");
    winkelscorekop.setAttribute("title", "Winkelscore");
    keuzenblad.appendChild(winkelscorekop);

    var winkelscore = document.createElement("div");
    winkelscore.innerHTML = '\
        <div class="options" style="margin-right: 20px;">\
            <select name="winkelscore" id="winkelscore" class="sortable" style="-webkit-appearance: none; -moz-appearance: none; text-overflow: ellipsis;">\
                <option value="">Alles scores toestaan</option>\
                <option value="1">1</option>\
                <option value="1.5">1,5</option>\
                <option value="2">2</option>\
                <option value="2.5">2,5</option>\
                <option value="3">3</option>\
                <option value="3.5">3,5</option>\
                <option value="4">4</option>\
                <option value="4.5">4,5</option>\
                <option value="5">5</option>\
            </select>\
        </div>\
    ';
        // <div class="sliderControl"><div style="width: 173px;" class="sliderArea"><div class="sliderBar"><div style="left: 6px; width: 167px;" class="sliderBar selected"></div><img style="left: 0px;" src="https://tweakimg.net/g/slider/sliderPointerLarge.png" class="sliderPointer"><div style="left: -5px; margin-left: 6px;" class="sliderLabel scoreStars score00">nvt</div></div></div><div style="margin-left: 13px; width: 19px;" class="sliderTick"><span style="left: -3px;">1</span></div><div style="width: 19px;" class="sliderTick"><span style="left: -8px;">1½</span></div><div style="width: 19px;" class="sliderTick"><span style="left: -3px;">2</span></div><div style="width: 19px;" class="sliderTick"><span style="left: -8px;">2½</span></div><div style="width: 19px;" class="sliderTick"><span style="left: -3px;">3</span></div><div style="width: 19px;" class="sliderTick"><span style="left: -8px;">3½</span></div><div style="width: 19px;" class="sliderTick"><span style="left: -3px;">4</span></div><div style="width: 19px;" class="sliderTick"><span style="left: -8px;">4½</span></div><div style="width: 6px;" class="sliderTick"><span style="left: -3px;">5</span></div><div style="clear: both;"></div></div>';

    keuzenblad.appendChild(winkelscore);

    var levertijdkop = document.createElement("h4");
    levertijdkop.innerText = 'Maximale levertijd:';
    levertijdkop.classList.add("ellipsis") //, "toggleCollapse");
    levertijdkop.setAttribute("title", "Levertijd");
    keuzenblad.appendChild(levertijdkop);

    var levertijd = document.createElement("div");
    levertijd.innerHTML = '\
        <div class="sortOptions" style="margin-right: 20px;">\
            <select name="levertijd" class="sortable"  id="levertijd" style="-webkit-appearance: none; -moz-appearance: none; text-overflow: ellipsis;" >\
                <option value="">Alle levertijden toestaan</option>\
                <option value="one_day_247">(24/7)  Vandaag besteld, morgen in huis (ook in het weekend)</option>\
                <option value="one_day_245">(24/5)  Op een werkdag besteld, morgen in huis</option>\
                <option value="three_days">(3 d.)  Levering verwacht binnen 3 dagen</option>\
                <option value="five_days">(5 d.)  Levering verwacht binnen 5 dagen</option>\
                <option value="eight_days">(8 d.)  Levering verwacht binnen 8 dagen</option>\
                <option value="twelve_days">(12 d.)  Levering verwacht binnen 12 dagen</option>\
                <option value="over_twelve_days">(\>12 d.)  Levertijd langer dan 12 dagen </option>\
                <option value="unknown">Levertijd onbekend</option>\
            </select>\
        </div>\
    ';
                // <option value="preOrder">Preorder</option>\


    keuzenblad.appendChild(levertijd);

    var slechtewinkelkop = document.createElement("h4");
    slechtewinkelkop.innerText = 'Slechte winkels:';
    slechtewinkelkop.classList.add("ellipsis") //, "toggleCollapse");
    slechtewinkelkop.setAttribute("title", "Slechtewinkels");
    keuzenblad.appendChild(slechtewinkelkop);

    var slechtewinkels = document.createElement("div");
    slechtewinkels.innerHTML = '<input id="slechtewinkels" name="slechtewinkels" value="" placeholder="Winkel 1, Winkel 2, Winkel 3, ..." class="text" type="text">';
    keuzenblad.appendChild(slechtewinkels);


    var goedewinkelkop = document.createElement("h4");
    goedewinkelkop.innerText = 'Alleen deze winkels:';
    goedewinkelkop.classList.add("ellipsis") //, "toggleCollapse");
    goedewinkelkop.setAttribute("title", "Goedewinkels");
    keuzenblad.appendChild(goedewinkelkop);

    var goedewinkels = document.createElement("div");
    goedewinkels.innerHTML = '<input id="goedewinkels" name="goedewinkels" value="" placeholder="Winkel 1, Winkel 2, Winkel 3, ..." class="text" type="text">';
    keuzenblad.appendChild(goedewinkels);

 
    var toepasknop = document.createElement("a");
    toepasknop.innerHTML = "Toepassen";
    toepasknop.setAttribute("id", 'extrafilterknop');
    toepasknop.setAttribute("class", 'ctaButton');
    toepasknop.setAttribute("style", "\
        margin-top: 10px;\
        margin-bottom: 10px;\
        margin-left: 2px;\
    ");
        // margin-left: 15px;\

    toepasknop.addEventListener('click', function() {
        if (toepassen_bezig || !document.querySelector('#listingContainer')) {
            l('toepassen_bezig of #listingContainer niet gevonden.')
            return;
        }
        if (!observer) {
            console.warn('Te vroeg gedrukt; pagina was nog niet volledig geladen.');
            return;
        }
        toepassen_bezig = true;

        document.querySelector('#extrafilterknop').innerText = 'Bezig...';
        document.querySelector('#extrafilterknop').style.background = '#282923';

        // var formulier = document.getElementById('extrafilterformulier');
        // l(formulier);

        if(document.extrafilterformulier.winkelscore){
            var formulierscore = parseFloat(document.extrafilterformulier.winkelscore.value);
        }
        if (formulierscore && !isNaN(formulierscore) && 0 < formulierscore && formulierscore <= 5) {
            // l(formulierscore);
            minimumscore = formulierscore;
        } else {
            minimumscore = 0;
        }
        setValue("minimumscore", minimumscore);
        // l('minimumscore uit LocalStorage: ' + getValue("minimumscore"));

        if (document.extrafilterformulier.levertijd) {
            var formulierlevertijd = document.extrafilterformulier.levertijd.value;
        }
        if (formulierlevertijd && mogelijke_levertijden.includes(formulierlevertijd) ) {
            toegestane_levertijden = Object.assign([], mogelijke_levertijden);  // Array copiëren.
            var lengte = toegestane_levertijden.length;
            for (var m = lengte - 1; m >= 0; m--) {
                if (formulierlevertijd == toegestane_levertijden[m]) {
                    break;
                } else {
                    toegestane_levertijden.splice(m, 1);
                }
            }
        } else {
            toegestane_levertijden = Object.assign([], mogelijke_levertijden);
        }
        setValue("toegestane_levertijden", toegestane_levertijden)
        // l('toegestane_levertijden: ' + getValue("toegestane_levertijden"));
        // l('mogelijke_levertijden: ' + mogelijke_levertijden);

        if (document.extrafilterformulier.slechtewinkels) {
            var formulierslechtewinkelnamen = document.extrafilterformulier.slechtewinkels.value
                .split(",");
        }
        verboden_winkels = [];
        if (formulierslechtewinkelnamen) {
            for (var o = formulierslechtewinkelnamen.length - 1; o >= 0; o--) {
                if (formulierslechtewinkelnamen[o].match(/[a-z]/i)) {
                    verboden_winkels.push(formulierslechtewinkelnamen[o]
                        .toLowerCase()
                        .replace(/&\w+;/g, ' ')
                        .replace(/\W/g, ' ')
                        .replace(/\s{2,}/g, ' ')
                        .trim());
                }
            }        
        }
        setValue("verboden_winkels", verboden_winkels)
        // l('verboden_winkels = ' + verboden_winkels);

        if (document.extrafilterformulier.goedewinkels) {
            var formuliergoedewinkelnamen = document.extrafilterformulier.goedewinkels.value
                .split(",");
        }
        verplichte_winkels = [];
        if (formuliergoedewinkelnamen) {
            for (var r = formuliergoedewinkelnamen.length - 1; r >= 0; r--) {
                if (formuliergoedewinkelnamen[r].match(/[a-z]/i)) {
                    verplichte_winkels.push(formuliergoedewinkelnamen[r]
                        .toLowerCase()
                        .replace(/&\w+;/g, ' ')
                        .replace(/\W/g, ' ')
                        .replace(/\s{2,}/g, ' ')
                        .trim());
                }
            }        
        }
        setValue("verplichte_winkels", verplichte_winkels)
        // l('verplichte_winkels = ' + verplichte_winkels);

        var onderaan = document.extrafilterformulier.onderaan;
        if (onderaan) {
            if (onderaan.checked == true && onderaan.value == 'onderaan') {
                weggefilterd_verbergen = false;
            }
        }
        var verbergen = document.extrafilterformulier.verbergen;
        if (verbergen) {
            if (verbergen.checked == true && verbergen.value == 'verbergen') {
                weggefilterd_verbergen = true;
            }
        }
        setValue("weggefilterd_verbergen", weggefilterd_verbergen);

        var exclusief = document.extrafilterformulier.exclusief;
        if (exclusief) {
            if (exclusief.checked == true && exclusief.value == 'exclusief') {
                inclusief_verzenden = false;
            }
        }
        var inclusief = document.extrafilterformulier.inclusief;
        if (inclusief) {
            if (inclusief.checked == true && inclusief.value == 'inclusief') {
                inclusief_verzenden = true;
            }
        }
        setValue("inclusief_verzenden", inclusief_verzenden);

        filters_uitvoeren();

    }, false);

    keuzenblad.appendChild(toepasknop);

    var aantallendiv = document.createElement("div");
    aantallendiv.setAttribute("id", 'aantallen');
    aantallendiv.setAttribute("style", "\
        font-size: 10px;\
    ");
        // text-overflow: ellipsis;\
        // height: 10px;\
    keuzenblad.appendChild(aantallendiv);


    var instellingenmenu = document.createElement("div");
    instellingenmenu.setAttribute("id", 'instellingenmenu');
    // instellingenmenu.classList.add('filterOption');
    instellingenmenu.setAttribute("style", "\
        border-top: solid thin rgb(220, 220, 220);\
        border-left: solid thin rgb(220, 220, 220);\
        border-right: solid thin rgb(220, 220, 220);\
        border-bottom: solid thin rgb(220, 220, 220);\
    ");
        // padding-bottom: 2px;\
    menu.appendChild(instellingenmenu);

    var instellingenbalk = document.createElement("div");
    instellingenbalk.setAttribute("id", 'instellingenbalk');
    // hoofdbalk.height = '15px';
    instellingenbalk.setAttribute("style", "\
        padding-left: 5px;\
        cursor: pointer;\
    ");
    instellingenmenu.appendChild(instellingenbalk);

    var instellingenkop = document.createElement("h4");
    instellingenkop.innerText = 'Instellingen';
    // instellingenkop.classList.add("ellipsis") //, "toggleCollapse");
    instellingenkop.setAttribute("title", "Instellingen");

    instellingenkop.setAttribute("style", "\
        padding-left: 14px;\
        width: auto;\
        background: url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAALAAgDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAgK/8QAHxAAAgMBAQACAwAAAAAAAAAAAwQCBQYHAQAIExYl/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ANSrnT99y/7hIcoqNRY9rynYfD6e9w0vRsa366jFBNaOilZhACnW5hZD9hIFBcMKXgjQkxTQtG2v7L5YeW5rg8VdbHR5bL1dLfdAuv2HZW6op+2Ggt/AwBFl5oxCl/GKEPZBTDISIDFZZCtBhtopnwP/2Q==') no-repeat center left;\
    ");
        // margin-left: 5px;\
        // margin-bottom: 5px;\

    instellingenkop.addEventListener('click', function() {
        var instellingenblad = document.querySelector('#instellingenblad');
        var display = getComputedStyle(instellingenblad, null).display;
        // l(display);
        if(display !== "none"){
            instellingenblad.style.display = "none";
            // instellingenkop.setAttribute("style", "\
            //     margin-bottom: 5px;\
            // ");
            instellingenkop.setAttribute("style", "\
                padding-left: 14px;\
                width: auto;\
                background: url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAALAAgDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAgK/8QAHxAAAgMBAQACAwAAAAAAAAAAAwQCBQYHAQAIExYl/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ANSrnT99y/7hIcoqNRY9rynYfD6e9w0vRsa366jFBNaOilZhACnW5hZD9hIFBcMKXgjQkxTQtG2v7L5YeW5rg8VdbHR5bL1dLfdAuv2HZW6op+2Ggt/AwBFl5oxCl/GKEPZBTDISIDFZZCtBhtopnwP/2Q==') no-repeat center left;\
            ");
                // padding:4px 21px 4px 4px;\
                // margin-left: 5px;\
                // margin-bottom: 5px;\
        } else {
            instellingenblad.style.display = "block";
            // instellingenkop.setAttribute("style", "\
            //     margin-bottom: 5px;\
            // ");
            instellingenkop.setAttribute("style", "\
                padding-left: 14px;\
                width: auto;\
                background: url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAMAAsDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAACQQH/8QAJxAAAAYCAgAFBQAAAAAAAAAAAQIDBAUGBwgRIQkTFjFBABIlQmH/xAAUAQEAAAAAAAAAAAAAAAAAAAAD/8QAGxEBAAICAwAAAAAAAAAAAAAAARExAAJBcfH/2gAMAwEAAhEDEQA/AGi2e8QDfvR7PmUMNWfWuS2+abNWIR8NO24hr7evQUZepNBixda37JqjIG9LoUNklIZSUyu5eGRtNHi7c5/GCwWZVBhNaIXO9dwNi+H2dvNTyRn9pV2w5VudErfpKny9scruHbwldg/MP5MXFJLoQzd8CbEs0EeM2WJhiyIRLLZzuDlVEgAXgFCk5EB54EzIB/bjnhwf4+CddD90CkkuQwABEuBTSP2U/uokQ4+ygdAJhAP5xyIj39LJqyq2dU8vuLJqyq2dU8vuf//Z') no-repeat center left;\
            ");
                // padding:4px 21px 4px 4px;\
                // margin-left: 5px;\
                // margin-bottom: 5px;\
        }
    }, false);

    var instellingenblad = document.createElement("div");
    instellingenblad.setAttribute("id", 'instellingenblad');
    instellingenblad.setAttribute("style", "\
        border-top: solid thin rgb(220, 220, 220);\
        padding-left: 10px;\
        display: none;\
    ");
        // border-left: solid thin rgb(220, 220, 220);\
        // border-right: solid thin rgb(220, 220, 220);\
        // border-bottom: solid thin rgb(220, 220, 220);\
        // margin-left: 15px;\
    
    instellingenbalk.appendChild(instellingenkop);
    
    instellingenmenu.appendChild(instellingenblad);

    var weggefilterdkop = document.createElement("h4");
    weggefilterdkop.innerText = 'Weggefilterde resultaten:';
    weggefilterdkop.classList.add("ellipsis") //, "toggleCollapse");
    weggefilterdkop.setAttribute("title", "Weggefilterd");
    instellingenblad.appendChild(weggefilterdkop);
    
    var weggegilterd = document.createElement('div');
    weggegilterd.innerHTML = '\
        <input type="radio" id="onderaan"  name="weggegilterd" value="onderaan" style = "float: left; margin-right: 8px; margin-top: 5px;" checked>\
        <label for="onderaan"> Onderaan zetten </label>\
        <input type="radio" id="verbergen"  name="weggegilterd" value="verbergen" style = "float: left; margin-right: 8px; margin-top: 5px;" >\
        <label for="verbergen"> Verbergen </label>\
    ';
    
    instellingenblad.appendChild(weggegilterd);

    var verzendkostenkop = document.createElement("h4");
    verzendkostenkop.innerText = 'Verzendkosten:';
    verzendkostenkop.classList.add("ellipsis") //, "toggleCollapse");
    verzendkostenkop.setAttribute("title", "Verzendkosten");
    instellingenblad.appendChild(verzendkostenkop);
    
    var verzendkosten = document.createElement('div');
    verzendkosten.innerHTML = '\
        <input type="radio" id="exclusief"  name="verzendkosten" value="exclusief" style = "float: left; margin-right: 8px; margin-top: 5px;" checked>\
        <label for="exclusief"> Exclusief </label>\
        <input type="radio" id="inclusief"  name="verzendkosten" value="inclusief" style = "float: left; margin-right: 8px; margin-top: 5px;" >\
        <label for="inclusief"> Inclusief </label>\
    ';
    
    instellingenblad.appendChild(verzendkosten);


    var plaats = document.querySelector('div#filterContainer form#filterForm');
    if (plaats){
        plaats.insertBefore(formulier, plaats.childNodes[0]);
    } else {
        console.error('div#filterContainer form#filterForm kon niet worden gevonden, dus menu kan niet worden toegevoegd.');
        return;
    }

    // l('minimumscore uit LocalStorage: ' + getValue("minimumscore"));
    if (minimumscore > 0) {
        document.getElementById("winkelscore").selectedIndex = minimumscore*2-1; 
    }
    // l('toegestane lengte/aantal: ' + toegestane_levertijden.length);
    // l(toegestane_levertijden);
    if (toegestane_levertijden && toegestane_levertijden.length > 0 && toegestane_levertijden.length != mogelijke_levertijden.length) {
        document.getElementById("levertijd").selectedIndex = toegestane_levertijden.length; 
    } else {
        document.getElementById("levertijd").selectedIndex = 0;
    }
    if ( (verboden_winkels && verboden_winkels.length > 0) ) {
        document.getElementById("slechtewinkels").value = verboden_winkels;
    }
    if ( (verplichte_winkels && verplichte_winkels.length > 0) ) {
        document.getElementById("goedewinkels").value = verplichte_winkels;
    }
    if (weggefilterd_verbergen == true) {
        document.getElementById("verbergen").checked = true;
    }
    if (inclusief_verzenden == true) {
        document.getElementById("inclusief").checked = true;
    }
}


// function keuzes_wissen(){

// }


function filters_uitvoeren(){
    // l('filters_uitvoeren');

    l(["tijd_tussen_opvragingen", tijd_tussen_opvragingen]);
    l(["eenmalige_pauze_opvraging", eenmalige_pauze_opvraging]);
    producten = document.querySelectorAll('table.listing tbody tr.largethumb');
    aantal_producten = producten.length;
    // l('producten = ');
    // l(producten);
    if ( !aantal_producten || (aantal_producten < 1) ) {
        script_naar_beginstand();
        l('Kon filters niet uitvoeren omdat er geen producten gevonden zijn.')
        return;
    }
    // Later, you can stop observing
    if (observer && aantal_producten > 0){
        observer.disconnect();
        // l('Observer uitgezet door filters_uitvoeren.')
    }
    sorteren_op_prijs = document.querySelector('div.sortable');
    // l('sorteren_op_prijs.innerText = ' + sorteren_op_prijs.innerText);
    if (sorteren_op_prijs) {
        if (sorteren_op_prijs.innerText == 'Prijs (oplopend)') {
            sorteren_op_prijs = 'oplopend';
        } else if (sorteren_op_prijs.innerText == 'Prijs (aflopend)') {
            sorteren_op_prijs = 'aflopend';
        }
        // l('sorteren_op_prijs: ' + sorteren_op_prijs);
    }

    // l(aantal_producten);
    // l('begin opstellen prijslijsten');
    date = new Date();
    begintijd = date.getTime();
    date = '';
    // l(begintijd);

    let producten_opgevraagd_van_server = 0;
    for (var i = producten.length - 1; i >= 0; i--) {
        var product = producten[i];
        var prijsetiket = product.querySelector('td.price-score p.price a.pwlink');
        var url_element = product.querySelector('td.itemname a.editionName');
        var url = '';
        if (url_element)  {
            url = url_element.href;
        }
        // l(i + ' = ' + producten[i].querySelector('.spec.nr1').innerText);
        if (prijsetiket && url && gewaarschuwd === 0) {
            /* Hier volgt de test of de url al bestaat in de cache van eerder opgehaalde objecten met 
               prijslijsten. Zo ja, dan laagste_prijs_bepalen(); zo nee, dan prijslijst_ophalen().
            */
            var datumobject = new Date();
            var tijd = datumobject.getTime();
            datumobject = '';                
            index_oude_producten.push({url: url, tijd: tijd}); // Dit zet de de tijd van laatste gebruik in de index van oude producten.
            if(oude_producten[url]){
                l('Zit al in de lijst: positie ' + i + ' - ' + url)
                laagste_prijs_bepalen(product, prijsetiket, i, oude_producten[url]);
            } else {
                l('Nog niet in lijst: positie ' + i + ' - ' + url)
                producten_opgevraagd_van_server++;
                if (producten_opgevraagd_van_server <= max_tegelijk_opgevraagd) {
                    prijslijst_ophalen(product, prijsetiket, i, url);
                } else {  // Als er anders te veel producten ineens opgehaald zouden worden:
                    let positie = i;
                    setTimeout( (product, prijsetiket, positie, url)=> {
                        // l('Timeout voorbij, prijs ophalen...');
                        if (gewaarschuwd > 0) {
                            document.querySelector('#extrafilterknop').innerText = 'Te veel producten opgevraagd!';
                            document.querySelector('#extrafilterknop').style.background = 'darkred';
                            alert(waarschuwing);
                            script_naar_beginstand();
                            // location.reload(true);
                        }
                        prijslijst_ophalen(product, prijsetiket, positie, url);
                    }, (producten_opgevraagd_van_server - max_tegelijk_opgevraagd) * tijd_tussen_opvragingen + eenmalige_pauze_opvraging,
                    product, prijsetiket, positie, url );
                }
                // l('Nieuw: positie ' + i + ' - ' + url);
            }
        } else {
            if (prijsetiket) {
                console.warn('Wel prijsetiket gevonden, maar geen url van productpagina: dit zou niet mogelijk moeten zijn.');
            }
            l('Geen prijsetiket gevonden voor: ' + url);
            var sorteerobject = {
                product: product,
                positie: i,
            }
            overige_producten.push(sorteerobject);
            ++aantal_producten_tot_nu_toe;
            // l('aantal_producten_tot_nu_toe = ' + aantal_producten_tot_nu_toe + '; aantal_producten = ' + aantal_producten + '; positie = ' + positie);
            if (aantal_producten_tot_nu_toe === aantal_producten){
                sorteren();
            }
        }
        // l(['producten_opgevraagd_van_server:', producten_opgevraagd_van_server]);
    }
}


function prijslijst_ophalen(product, prijsetiket, positie, url){
    // l(typeof GM);
    // l(typeof GM_xmlhttpRequest);
    if (gewaarschuwd > 0) {
        return;
    }  
    if ((typeof GM === 'object')) {
        GM.xmlHttpRequest({
            method: "GET",
            // responseType: "document",
            url: url,
            onload: function (response) {
                antwoord_verwerken_tot_prijslijst(product, prijsetiket, positie, url, response);
            }
        });

    } else {
        GM_xmlhttpRequest({
        // GM.xmlHttpRequest({
            method: "GET",
            // responseType: "document",
            url: url,
            onload: function (response) {
                antwoord_verwerken_tot_prijslijst(product, prijsetiket, positie, url, response);
            }
        });
    }
}

function antwoord_verwerken_tot_prijslijst(product, prijsetiket, positie, url, response) {
    // l(url);
    ++ firstxr;
    if (firstxr == 1){
        date = new Date();
        var eerstetijd = date.getTime();
        date = '';
        // l(eerstetijd);
        // l( 'eerste tijd: '+ (eerstetijd - begintijd) );
    }
        
    var teller = product.querySelector('td.price-score .shop-count');
    // l(teller);
    var aantal_winkels;
    if (teller) {
        try {
            aantal_winkels = parseFloat(teller.innerText.match(/(^\d+) winkels?/i)[1]);
        } catch (e) {
            console.warn(e);
        } 
    } else {
        console.warn('Aantal winkels kon niet gehaald worden uit ".shopcount" voor het volgende product: ', product);
    }


    //////// functie splitsen vanaf hier:
    var prijsresultaat;
    var prijslijst_per_product = [];
    var prijsindex = 0
    // - aantal winkels meteen checken
    // - toegestane winkels meteen checken

    // var regex_prijslijst_backup = /<td class="shop-name\b[^"]*">\s*((<[^<>]+>[^<>]*){2}){13}<\/td>/gi;
    // var regex_prijslijst = /<td class="shop-name\b[^<>]*>\s*<p\b[^<>]*><a\b[^<>]*>([^<>]+)<\/a>\s*(?:<span\b[^<>]*>[^<>]+<\/span>)?<\/p>\s*<\/td>\s*<td[^<>]*>\s*<p class="score\b[^<>]*>\s*<a[^<>]*><span[^<>]*>(Score: \d+(?:\.\d+)?|Geen score)<\/span> <span class="reviewCount\b[^<>]*>\(\d+\)<\/span><\/a>\s*<\/p>\s*<\/td>\s*<td[^<>]*>\s*<p\b[^<>]*><span class="sprite deliveryTime (\w+)"[^<>]*>[^<>"]*<\/span><\/p>\s*<\/td>\s*<td class="shop-bare-price\b[^<>]*>\s*<p\b[^<>]*>\s*<a\b[^<>]*>&euro; (\d+(?:\.\d+)*(?:,\d+)?)(?:,-)?<\/a>\s*<\/p>\s*<\/td>/gi;
    var regex_prijslijst = /<td class="shop-name\b[^<>]*>\s*<p\b[^<>]*>\s*<a\b[^<>]*>([^<>]+)<\/a>\s*(?:<span\b[^<>]*>[^<>]+<\/span>\s*)?<\/p>\s*<\/td>\s*<td[^<>]*>\s*<p class="score\b[^<>]*>\s*<a[^<>]*>\s*<span[^<>]*class="sprite\b[^"<>]*score(\d+)\b[^"<>]*"[^<>]*>(?:Score: \d+(?:\.\d+)?|Geen score)<\/span>\s*<span class="reviewCount\b[^<>]*>\(\d+\)<\/span>\s*<\/a>\s*<\/p>\s*<\/td>\s*<td[^<>]*>\s*<p\b[^<>]*>\s*<span class="sprite deliveryTime ([\-\w]+)"[^<>]*>[^<>"]*<\/span>\s*<\/p>\s*<\/td>\s*<td class="shop-bare-price\b[^<>]*>\s*<p\b[^<>]*>\s*<a\b[^<>]*>\s*(?:&euro;|€) (\d+(?:\.\d+)*(?:,\d+)?)(?:,-)?<\/a>\s*<\/p>\s*<\/td>\s*<td class="shop-price\b[^<>]*>\s*<p\b[^<>]*>\s*<a\b[^<>]*>\s*(?:&euro;|€) (\d+(?:\.\d+)*(?:,\d+)?)(?:,-)?<\/a>\s*<\/p>/gi;

    while ( ( prijsresultaat = regex_prijslijst.exec(response.responseText) ) !== null ) {
        prijsindex ++;
        var winkel = prijsresultaat[1]
            .toLowerCase()
            .replace(/&\w+;/g, ' ')
            .replace(/\W/g, ' ')
            .replace(/\s{2,}/g, ' ');
        // var score = parseFloat(prijsresultaat[2]
        //     .match(/\d+(?:\.\d+)?/));
        var score = parseFloat(prijsresultaat[2]) / 10;  // Score wordt gevonden als "35" in "score35".
        var levertijd = prijsresultaat[3];
        var prijs = parseFloat(prijsresultaat[4]
            .replace(/\./g,'')
            .replace(/,/g,'.')
            .replace(/-/g,''));
        var prijs_met_verzenden = parseFloat(prijsresultaat[5]
            .replace(/\./g,'')
            .replace(/,/g,'.')
            .replace(/-/g,''));
        // l(prijs + ' ~ ' + prijs_met_verzenden);

        // var dom_prijslijst = response.responseXML.querySelectorAll('table.shop-listing > tbody > tr'); //dom
        // winkelcontrole: for (var p = dom_prijslijst.length - 1; p >= 0; p--) {
            //     prijsindex ++
            //     var winkel =  dom_prijslijst[p].querySelector('td.shop-name > p > a').innerText
            //         .toLowerCase()
            //         .replace(/&\w+;/g, ' ')
            //         .replace(/\W/gi, ' ');
            //     var score = parseFloat(dom_prijslijst[p].querySelector('td.shop-score > p > a > span.scoreStars').innerText
            //         .match(/\d+(?:\.\d+)?$/) );
            //     var levertijd = dom_prijslijst[p].querySelector('td.shop-delivery > p > span.deliveryTime').classList;
            //     for (var q = mogelijke_levertijden.length - 1; q >= 0; q--) {
            //         if ( levertijd.contains(mogelijke_levertijden[q]) ) {
            //             levertijd = mogelijke_levertijden[q];
            //             break;
            //         }
            //     }
            //     var prijs = parseFloat(dom_prijslijst[p].querySelector('td.shop-bare-price > p > a').innerText
            //        .replace(/\./g,'')
            //        .replace(/,/g,'.')
            //        .replace(/[^\d\.]/g,'') );                    
        // }

        if (isNaN(score)){
            // l('Geen score voor ' + winkel + ': ' + prijsresultaat[2]);
            score = 0;
        }
        if( !mogelijke_levertijden.includes(levertijd) ){
            console.group();
            console.warn('Levertijd "' + levertijd + '" is niet gevonden in de mogelijke levertijden (' + mogelijke_levertijden + ') en is blijkbaar een nieuwe optie. Deze prijs wordt onder die omstandigheden sowieso wel meegenomen door het userscript. De levertijd zou toegevoegd moeten worden aan de mogelijke levertijden. Url: ' + url);
            console.trace();
            console.groupEnd();
            levertijd = "nieuwe_levertijd";
        }
        
        if (isNaN(prijs)){
            console.group();
            l('Ongeldige prijs gevonden: "' + prijs + '", url: ' + url);
            console.trace();
            console.groupEnd();
            continue;  // Deze prijs moet niet worden meegenomen in prijslijst.
        }
        if (isNaN(prijs_met_verzenden) || prijs_met_verzenden < prijs){
            console.group();
            l('Ongeldige prijs_met_verzenden gevonden: "' + prijs_met_verzenden + '", url: ' + url);
            console.trace();
            console.groupEnd();
            prijs_met_verzenden = prijs; // Indien geen geldige prijs met verzenden, dan kale prijs maar nemen.
        }

        var prijsobject = {
            winkel: winkel,
            score: score,
            levertijd: levertijd,
            prijs: prijs,
            prijs_met_verzenden: prijs_met_verzenden,
        }
        prijslijst_per_product.push(prijsobject);

    }

    // Testen of er niet te snel pagina's opgevraagd worden:
    if(prijsindex === 0 && response.responseText.match(/(Sorry, je gaat even iets te snel|veel pageviews naar Tweakers\.net|houden we deze request tegen)/i)){
        console.error(waarschuwing);
        if (eenmalige_pauze_opvraging < 2000 && gewaarschuwd === 0) {
            eenmalige_pauze_opvraging = eenmalige_pauze_opvraging * 1.2;
            setValue("eenmalige_pauze_opvraging", eenmalige_pauze_opvraging);
            l(['Eenmalige_pauze_opvraging opgehoogd tot', eenmalige_pauze_opvraging]);
        }
        if (tijd_tussen_opvragingen < 500 && gewaarschuwd === 0) {
            tijd_tussen_opvragingen = tijd_tussen_opvragingen * 1.2;
            setValue("tijd_tussen_opvragingen", tijd_tussen_opvragingen);
            l(['tijd_tussen_opvragingen opgehoogd tot', tijd_tussen_opvragingen]);            
        }
        ++gewaarschuwd;
    }

    if (aantal_winkels > prijsindex) {
        let naam_product = product.querySelector('.editionName').title;
        console.warn('Op de prijzenpagina van [' + naam_product + '] kon ' + (aantal_winkels - prijsindex) + ' van de prijzen niet worden gevonden door de regex. Mogelijke oorzaken:\
             \n- Er zitten winkels tussen die volgens Tweakers zelf niet voldoen aan de standaardeisen (zie productpagina).\
             \n- Tweakers heeft het aantal prijzen nog niet geüpdate in de knop in de lijst met producten.\
             \n- Er is een probleem bij Tweakers (de productpagina laadt niet of te traag).\
             \n- Uw cookies worden niet bewaard.\
             \n- U bent niet ingelogd.\
             \n- Dit script vraagt te veel pagina\'s tegelijk op van de server van Tweakers.\
             \n- De regex dient aangepast te worden in de functie "antwoord_verwerken_tot_prijslijst".\
             \nAantal winkels = ' + aantal_winkels + '; prijsindex = ' + prijsindex + '; ' + url);
    } else if (aantal_winkels < prijsindex) {
        let naam_product = product.querySelector('.editionName').title;
        console.warn('De regex heeft op de prijzenpagina van [' + naam_product + '] ' + (prijsindex - aantal_winkels) + ' prijzen meer gevonden dan stond aangeven op de resultatenpagina; dit zou niet mogelijk moeten zijn.\nAantal winkels = ' + aantal_winkels + '; prijsindex = ' + prijsindex + '; ' + url);
    }

    // prijslijst_per_product = [{prijs: 3},{prijs: 1},{prijs: 5},{prijs: 1},{prijs: 4}];
    // console.log(JSON.stringify(prijslijst_per_product));
    objecten_sorteren(prijslijst_per_product, 'prijs_met_verzenden', 'laag naar hoog');  // Laagste prijs komt in index 0.
    // console.log(JSON.stringify(prijslijst_per_product));
  
    
    var datumobject = new Date();
    var tijd = datumobject.getTime();
    datumobject = '';

    var productobject = {
        // product: product,
        // prijsetiket: prijsetiket,
        prijslijst_per_product: prijslijst_per_product,
        sortering_prijslijst: 'inclusief verzenden',
        // positie: positie,
        url: url,
        tijd: tijd
    }
    //////// functie splitsen tot hier ^, return productobject

    
    // Hier wordt productobject toegevoegd aan cache:
    oude_producten[url] = productobject;

    laagste_prijs_bepalen(product, prijsetiket, positie, productobject);
}


function laagste_prijs_bepalen(product, prijsetiket, positie, productobject){

    //////// functie splitsen vanaf hier:
    var prijslijst = productobject.prijslijst_per_product;
    // l('inclusief_verzenden = ' + inclusief_verzenden + '; sortering = ' + productobject.sortering_prijslijst);
    if (inclusief_verzenden && productobject.sortering_prijslijst == 'exclusief verzenden') {
        // l('switchen naar inclusief');
        objecten_sorteren(prijslijst, 'prijs_met_verzenden', 'laag naar hoog');
        productobject.sortering_prijslijst = 'inclusief verzenden';
    }
    if (!inclusief_verzenden && productobject.sortering_prijslijst == 'inclusief verzenden') {
        // l('switchen naar exclusief');
        objecten_sorteren(prijslijst, 'prijs', 'laag naar hoog');
        productobject.sortering_prijslijst = 'exclusief verzenden';
    }
    // l('sortering = ' + productobject.sortering_prijslijst);
    var prijs_veranderd = false;

    let naam_product = product.querySelector('.editionName').title;
    
    winkelcontrole: for (var i = 0; i < prijslijst.length; i++) {
        var score = prijslijst[i].score;
        var levertijd = prijslijst[i].levertijd;
        var winkel = prijslijst[i].winkel;
        var prijs;
        if (inclusief_verzenden) {
            prijs = prijslijst[i].prijs_met_verzenden;
        } else {
            prijs = prijslijst[i].prijs;
        }

        // l('Score voor ' + winkel + ': score = ' + score + '; minimum = ' + minimumscore);
        if (score < minimumscore){
            // l('Te lage score voor ' + winkel + ': score = ' + score + '; minimum = ' + minimumscore);
            ++ aantal_prijzen_weggefilterd_vanwege_score;
            continue;
        }
        if ( !toegestane_levertijden.includes(levertijd) && (levertijd !== "nieuwe_levertijd") ){
            // l("Te lange levertijd: " + levertijd)
            ++ aantal_prijzen_weggefilterd_vanwege_levertijd;
            continue;    // Levertijd is wel bekend maar te lang.
        }

        //// Zowel in lijst als uit formulier zijn winkelnamen gestript van niet-woordtekens en extra spaties.
        // console.log("verplichte_winkels", verplichte_winkels);s
        if (verplichte_winkels && verplichte_winkels.length > 0) {
            // l('verplichte_winkels wordt getest op: ' + winkel);
            var verplichte_winkel_gevonden;
            for (var s = verplichte_winkels.length - 1; s >= 0; s--) {
                if ( (winkel.indexOf(verplichte_winkels[s]) !== -1) && winkel && verplichte_winkels[s]) {
                    // l( 'verplicht: index = ' + winkel.indexOf(verplichte_winkels[s]) );
                    // l([winkel,verplichte_winkels[s]]);
                    verplichte_winkel_gevonden = true;
                    break;
                }
            }
            if (!verplichte_winkel_gevonden) {
                verplichte_winkel_gevonden = false;
                // l(winkel + ' : Geen verplichte winkel gevonden, dus prijs afstoten. Verplichte winkels:');
                // l(verplichte_winkels);
                ++ aantal_prijzen_weggefilterd_vanwege_winkel;
                continue;
            }
            // verplichte_winkel_gevonden = false;
        }
        // l(naam_product + ' heeft goede score: ' + score + ', en goede winkel: ' + winkel);

        if (verboden_winkels.includes(winkel)){
            // l(verboden_winkels[n] + ' - ' + winkel);
            ++ aantal_prijzen_weggefilterd_vanwege_winkel;
            continue;
        } else {
            for (var n = verboden_winkels.length - 1; n >= 0; n--) {
                // l(verboden_winkels[n] + ' - ' + winkel);
                if ( (winkel.indexOf(verboden_winkels[n]) !== -1) && winkel && verboden_winkels[n]) {
                    // l( 'verboden: index = ' + winkel.indexOf(verboden_winkels[n]) );
                    // l([winkel,verboden_winkels[n]]);
                    ++ aantal_prijzen_weggefilterd_vanwege_winkel;
                    continue winkelcontrole;
                }
            }
        }

        // Als de prijs door alle filters heen komt (geen continue) moet het de laagste prijs zijn, want de prijslijst was gesorteerd van laag naar hoog. We hoeven dan niet meer naar de andere prijzen te kijken.
        var laagste_prijs = prijs;
        if (i > 0) {
            prijs_veranderd = true;
        }
        break;
    }
    //////// functie splitsen tot hier ^, return laagste_prijs

    var sorteerobject = {
        product: product,
        prijsetiket: prijsetiket,
        positie: positie,
        prijs_veranderd: prijs_veranderd,
        // url: url
    }

    if (laagste_prijs){    // Als er een laagste prijs is (moet sowieso al getal zijn door eerdere filtering).
        sorteerobject.prijs = laagste_prijs;
        geprijsde_producten.push(sorteerobject);
        // l(url + ' - ' + laagste_prijs + ' bij: ' + prijslijst_per_product[0].winkel);
    } else {    // Er is geen prijs meer over voor dit product.
        // l(['Geen prijzen die voldoen aan filters:', naam_product, sorteerobject.prijsetiket]);
        // l(sorteerobject + ' - Geen prijzen die voldoen aan filters.');
        sorteerobject.prijs = '(weggefilterd)';
        weggefilterde_producten.push(sorteerobject);
        ++ aantal_producten_weggefilterd;
    }

    ++aantal_producten_tot_nu_toe;
    if (!gewaarschuwd) {
        document.querySelector('#extrafilterknop').innerText = 'Bezig... (' + aantal_producten_tot_nu_toe + '/' + aantal_producten + ')';
    }
    // l('aantal_producten_tot_nu_toe = ' + aantal_producten_tot_nu_toe + '; aantal_producten = ' + aantal_producten + '; positie = ' + positie);
    if (aantal_producten_tot_nu_toe == aantal_producten){
        sorteren();
    }
}


function sorteren(){
    // l('Tijd om te sorteren.');
    // l(gefilterde_producten);  
    // l(sorteren_op_prijs);
    // l('einde opstellen prijslijsten');

    date = new Date();
    var eindtijd = date.getTime();
    date = '';
    // l(eindtijd);
    // l( 'eindtijd: '+ (eindtijd - begintijd) );
    firstxr = 0;


    var aantallen = 'Laagste prijzen weggefilterd vanwege:\n[score: '+aantal_prijzen_weggefilterd_vanwege_score+'] [levertijd: '+aantal_prijzen_weggefilterd_vanwege_levertijd+'] [winkel: '+aantal_prijzen_weggefilterd_vanwege_winkel+']\nProducten weggefilterd: '+aantal_producten_weggefilterd;
    document.querySelector('#aantallen').innerText = aantallen;
    
    l('geprijsde_producten: ' + geprijsde_producten.length);
    l('overige_producten: ' + overige_producten.length);
    l('weggefilterde_producten: ' + weggefilterde_producten.length);

    if (sorteren_op_prijs == 'oplopend') {
        // l('Oplopend sorteren...');
        objecten_sorteren(geprijsde_producten, 'prijs', 'laag naar hoog');
        objecten_sorteren(overige_producten, 'positie', 'laag naar hoog');
        objecten_sorteren(weggefilterde_producten, 'positie', 'laag naar hoog');
        alle_producten =  geprijsde_producten.concat( overige_producten.concat(weggefilterde_producten) );    
    }
    else if (sorteren_op_prijs == 'aflopend') {
        // l('Aflopend sorteren...');
        objecten_sorteren(geprijsde_producten, 'prijs', 'hoog naar laag');
        objecten_sorteren(weggefilterde_producten, 'positie', 'laag naar hoog');
        objecten_sorteren(overige_producten, 'positie', 'laag naar hoog');
        alle_producten =  geprijsde_producten.concat( overige_producten.concat(weggefilterde_producten) ); 
    }   
    else {
        // l('alles sorteren op positie...');
        var geprijsde_en_overige_producten = geprijsde_producten.concat(overige_producten);
        objecten_sorteren(geprijsde_en_overige_producten, 'positie', 'laag naar hoog');
        objecten_sorteren(weggefilterde_producten, 'positie', 'laag naar hoog');
        alle_producten =  geprijsde_en_overige_producten.concat(weggefilterde_producten); 
    }  


    if ( !sorteerstijlen && document.querySelectorAll('table.listing tbody tr.largethumb') ) {
        var display = getComputedStyle(document.querySelectorAll('table.listing tbody tr.largethumb')[0], null).display;
        var fontsize = getComputedStyle(document.querySelectorAll('table.listing tbody tr.largethumb p.price a.pwlink')[0], null).getPropertyValue('font-size');
        sorteerstijlen = document.createElement('style');
        // l('display = '+ display);
        // l('fontsize = '+ fontsize);
        var markering = 'border-right: solid thick grey;';
        sorteerstijlen.type = 'text/css';
        sorteerstijlen.innerHTML = '\
            tr.normale_prijs {display: '+display+';}\
            tr.normale_prijs p.price a.pwlink {font-size: '+fontsize+';}\
            tr.weggefilterd {display: '+display+'; background-color: #F2F2F2;}\
            tr.weggefilterd .pwimage a, tr.weggefilterd .white {background-color: unset;}\
            tr.weggefilterd .pwimage img {border: solid thin lightgrey; padding-top: 4px; padding-bottom: 3px; padding-left: 3px; padding-right: 3px; background: white;}\
            tr.weggefilterd .pwimage .thumb {border: none;}\
            tr.weggefilterd p.price a.pwlink {font-size: 10px;}\
            tr.onzichtbaar {display: none;}\
            tr.prijs_veranderd p.price a.pwlink {font-style: italic;}\
            tr.prijs_veranderd .price-score:not(.rating-box) {'+markering+';}\
        ';
            // tr.weggefilterd .price-score:not(.rating-box) {'+markering+';}\
            // tr.weggefilterd p.price.not(.rating-box) {'+markering+';}\
            // tr.prijs_veranderd .price-score.not(.rating-box) {'+markering+';}\
        document.getElementsByTagName('head')[0].appendChild(sorteerstijlen);
    }

    // l('overige_producten = ' + overige_producten);
    // alle_producten = overige_producten.concat(gefilterde_producten);
    var parent = alle_producten[0].product.parentNode;
    // l(parent);
    // l('alle_producten.length = ' + alle_producten.length);
    for (var k = 0; k < alle_producten.length; k++) {
        // if (k < 5) {
            // l(alle_producten[k].prijs);
            // l(alle_producten[k].product);
        // }
        parent.appendChild(alle_producten[k].product);
        // alle_producten[k].product.remove();
        var prijsetiket = alle_producten[k].prijsetiket;
        if (prijsetiket) {
            var prijs = alle_producten[k].prijs.toString();
            prijs = prijs
                .replace(/\.(\d+)$/, ',$1')
                .replace(/(,\d)$/, '$1' + '0')
                .replace(/^([\d\.]+)$/, '$1' + ',–')
                .replace(/^(\d+)(\d{3})\b/, '$1.$2')
                .replace(/^([\d\.,–\-]+)$/, '€ $1');
            // l(alle_producten[k]);
            prijsetiket.innerText = prijs;
          

            alle_producten[k].product.classList.remove("normale_prijs", "weggefilterd", "onzichtbaar", "prijs_veranderd");
            if (prijs == '(weggefilterd)') {
                // l('weggefilterd, weggefilterd_verbergen: ' + weggefilterd_verbergen);
                if (weggefilterd_verbergen){
                    // alle_producten[k].product.remove();
                    // l('verbergen: ' + alle_producten[k].product);
                    alle_producten[k].product.classList.add("onzichtbaar");
                    // alle_producten[k].product.classList.remove("normale_prijs", "weggefilterd");
                    // alle_producten[k].product.classList.remove("weggefilterd");
                } else {
                    alle_producten[k].product.classList.add("weggefilterd");
                    // alle_producten[k].product.classList.remove("normale_prijs", "onzichtbaar");
                    // alle_producten[k].product.classList.remove("onzichtbaar");
                }
            } else {
                // l(getComputedStyle(alle_producten[k].product, null).display);
                alle_producten[k].product.classList.add("normale_prijs");
                // alle_producten[k].product.classList.remove("onzichtbaar", "weggefilterd");
                // alle_producten[k].product.classList.remove("weggefilterd");
                if (alle_producten[k].prijs_veranderd){
                    alle_producten[k].product.classList.add("prijs_veranderd");
                }
            }

        } else {
            // l('Geen prijsetiket gevonden voor:');
            // l(alle_producten[k]);
        }

    }

    oude_producten_opschonen();
    script_naar_beginstand();
}


function oude_producten_opschonen(){
    if (wissen_bezig) {
        oude_producten = {};
        index_oude_producten = [];
    //     alle_producten.sort(function (a, b) {
    //         // return b.positie - a.positie;  // van hoog naar laag
    //         return a.positie - b.positie;  // van laag naar hoog
    //     });
    } else {   //// Het volgende verwijdert te oude producten uit oude_producten en update ook index_oude_producten.
        // l('index_oude_producten: lengte = ' + index_oude_producten.length);

        // index_oude_producten = [{url: "blabla", tijd: 6},{url: "spie", tijd: 4},{url: "gth", tijd: 2},{url: "blabla", tijd: 1},{url: "ffaaf", tijd: 5},{url: "blaeeew", tijd: 0}];
        index_oude_producten.sort(function (a, b) {  // Sorteren voor het verwijderen van duplicaten.
            if (a.url < b.url) {
              return -1;
            }
            if (a.url > b.url) {
              return 1;
            }
            return 0; // names must be equal
        });
        // console.log(JSON.stringify(index_oude_producten));
        ////////// Duplicaten verwijderen uit oude index_oude_producten:
        for (var q = index_oude_producten.length - 1; q >= 0; q--) {
            if( (q > 0 && index_oude_producten[q].url == index_oude_producten[q-1].url) ){
                // console.log('q = ' +index_oude_producten[q].url + ' ' + index_oude_producten[q].tijd+' ; q-1 = ' + index_oude_producten[q-1].url + ' ' + index_oude_producten[q-1].tijd);
                if (index_oude_producten[q].tijd < index_oude_producten[q-1].tijd) {
                    // console.log('dubbel (q): ' + index_oude_producten[q].url + ' ' + index_oude_producten[q].tijd);
                    index_oude_producten.splice(q, 1);
                } else {
                    // console.log('dubbel (q-1): ' + index_oude_producten[q-1].url + ' ' + index_oude_producten[q-1].tijd);
                    index_oude_producten.splice(q-1, 1);
                }
            }
        }
        // console.log(JSON.stringify(index_oude_producten));
        if (index_oude_producten.length >= max_oude_producten) {
            // index_oude_producten.sort(function (a, b) {
            //     return b.tijd - a.tijd;  // van hoog naar laag
            // });
            objecten_sorteren(index_oude_producten, 'tijd', 'hoog naar laag');
            for (q = index_oude_producten.length - 1; q >= max_oude_producten; q--) {
                // l(q);
                var url = index_oude_producten[q].url;
                // l('te verwijderen: ' + url);
                delete oude_producten[url];
            }
            // l('Na de loop is q: ' + q + ' (q is 1 lager dan de lengte van de verzameling oude producten)');
            index_oude_producten.splice(q+1);
        }
        // console.log(JSON.stringify(index_oude_producten));
        // l('index_oude_producten, opgeschoond: lengte = ' + index_oude_producten.length);

        // for (q = 0; q < index_oude_producten.length; q++) {
        //     var date = new Date(index_oude_producten[q].tijd);
        //     var timestr = date.toJSON();
        //     date = '';
        //     console.log(q + ': ' + timestr +  ' ' + index_oude_producten[q].url);
        // }
    }
}

//  Sorteert een verzameling (array) van objecten op basis van een objecteigenschap.
//  Opties voor volgorde zijn 'laag naar hoog' en 'hoog naar laag'.
//  Voorbeeld:   objecten_sorteren(prijslijst_per_product, 'prijs_met_verzenden', 'laag naar hoog');
function objecten_sorteren(objecten, eigenschap, volgorde){
    objecten.sort(function (a, b) {
        if (volgorde == 'laag naar hoog') {
            return a[eigenschap] - b[eigenschap];  // van laag naar hoog
        } else if (volgorde == 'hoog naar laag') {
            return b[eigenschap] - a[eigenschap];  // van hoog naar laag
        }
    });
}

function setValue(name, content){
    localStorage.setItem( name, JSON.stringify(content) );
    if (content === 'false'){
        localStorage.setItem(name, false);
    } else if (content === 'true'){
        localStorage.setItem(name, true);
    } else if (content === 'undefined'){
        localStorage.setItem(name, undefined);
    } else if (content === 'null'){
        localStorage.setItem(name, null);
    }

}

function getValue(name, default_value){
    var value = JSON.parse( localStorage.getItem(name) );
    if (value == undefined){
        return default_value;
    } else if (value === 'false' || value === false) {
        return false;
    } else if (value === 'true' || value === true){
        return true;
    } else if (value === 'undefined' || value === undefined){
        return undefined;
    } else if (value === 'null' || value === null){
        return null;
    } else {
        return value;
    }
}


function l(text, extra) {
    if (debug) {
        if ( (trace && (extra !== 'notrace') ) || extra === 'trace'){
            console.log(text);
            console.group();
            // console.groupCollapsed();
            console.trace();
            console.groupEnd();
        } else {
            console.log(text);            
        }
    }
}

// function push_levertijden(levertijd){    //Om een lijst van alle mogelijke levertijden op te halen.
//     if (levertijden.includes(levertijd)){
//         // l("Levertijd zit al in lijst; levertijd = " + levertijd + "; lijst = " + levertijden);
//         return;
//     } else {
//         levertijden.push(levertijd);
//         // push_levertijden(levertijd);
//     }
// }

/* - Alle objecten en verzamelingen:
aantallendiv|alle_producten|date|datumobject|formulier|formuliergoedewinkelnamen|formulierslechtewinkelnamen|geprijsde_en_overige_producten|geprijsde_producten|goedewinkelkop|goedewinkels|hoofdbalk|hoofdtitel|index_oude_producten|keuzenblad|levertijd|levertijdkop|localStorage|menu|mogelijke_levertijden|objecten|observer|oude_producten|overige_producten|plaats|prijsetiket|prijslijst|prijslijst_per_product|prijsresultaat|product|producten|productobject|regex_prijslijst|slechtewinkelkop|slechtewinkels|sorteerobject|sorteerstijlen|sorteren_op_prijs|teller|toegestane_levertijden|toepasknop|url_element|verboden_winkels|verplichte_winkels|weggefilterde_producten|weggefilterdkop|weggegilterd|winkel|winkelscore|winkelscorekop|wissenknop
*/

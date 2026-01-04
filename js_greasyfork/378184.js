// ==UserScript==
// @name         Liedboek Online Hulpmiddelen
// @description  Voeg razendsnel nummers toe aan een liedlijst
// @namespace    Wilco Verhoef
// @author       Wilco Verhoef
// @version      1.0
// @include      http://liedboek.nu/*
// @include      http*://liedboek.liedbundels.nu/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/378184/Liedboek%20Online%20Hulpmiddelen.user.js
// @updateURL https://update.greasyfork.org/scripts/378184/Liedboek%20Online%20Hulpmiddelen.meta.js
// ==/UserScript==



(function() {
    'use strict';

    function alle_coupletten(lied, output) {

        var laatste_vers = 0,
            poging = 0,
            gevonden = true,
            stap_grootte = .5;

        while (gevonden) {

            // Zoek op het liednummer:
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "/site/nl/Search.aspx", false);
            xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhttp.send("searchoption=2&term=" + lied + (laatste_vers ? ':' + (laatste_vers+Math.ceil(stap_grootte)) : ''));

            try { JSON.parse(xhttp.response) }
            catch (e) {
                if (++poging >= 3) {
                    if (output) output.innerHTML += "<br>Een zoekaanvraag voor lied "+lied+" is driemaal mislukt. Probeer de versnummers er bij te zetten";
                    console.error("Een zoekaanvraag voor lied "+lied+" is driemaal mislukt. Probeer de vers)nummers er bij te zetten, zoals "+lied+":1");
                    return [];
                }
                continue;
            }

            var resultaten = JSON.parse(xhttp.response);

            gevonden = false;

            // Ga alle zoekresultaten af, op zoek naar het grootste versnummer
            for (var r in resultaten) {
                var resultaat = resultaten[r]
                var match = resultaat.value.match(/^(\d+[a-z]?):(\d+)$/);

                // Als het om het juiste lied gaat:
                if (match[1] == lied) {

                    // Als een groter nummer wordt gevonden:
                    if (Number(match[2]) > laatste_vers) {
                        laatste_vers = Number(match[2]);
                        gevonden = true;
                    }
                }
            }

            console.log(laatste_vers, stap_grootte);

            if (gevonden) {
                stap_grootte *= 2;
            } else if (stap_grootte > 1) {
                gevonden = true;
                stap_grootte = Math.floor(stap_grootte/2);
            }
        }

        var coupletten = [];
        for ( var couplet = 1; couplet <= laatste_vers; couplet++ ) { coupletten.push(couplet); }
        return coupletten;
    }




    function SaveSong(id) {
        var xhttp = new XMLHttpRequest();
        xhttp.addEventListener('load', console.log);
        xhttp.open("POST", "/site/nl/searchresults/SaveSong.aspx", false);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send("action=1&id=" + id);

        try { return JSON.parse(xhttp.response) }
        catch (e) { return {error:true} }
    }



    function lied_toevoegen( lied, coupletten = [], output = null ){

        console.log('Verwerken van lied: ' + lied + (coupletten && coupletten.length) ? " coupletten: " + coupletten : "");

        // Ontcijfer het 'lied' argument
        var lied_match = String(lied).replace(" ","").match(/^(\d+[a-z]?)(?::(\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*))?$/);

        if (!lied_match) {
            if (output) output.innerHTML += "<br>Het opgegeven liednummer \""+lied+"\" heeft niet de juiste vorm.";
            throw "Het opgegeven liednummer \""+lied+"\" heeft niet de juiste vorm. Voorbeelden:\n123\n123:4\n123:4-6\n123:2,5\n123:2,4-6";
            return -1;
        }

        lied = lied_match[1];

        if (lied_match[2] && coupletten && coupletten.length > 0) {
            if (output) output.innerHTML += "<br>Er zijn zowel coupletnummers achter het lied gezet \""+lied_match[2]+"\" als in het tweede argument ["+coupletten+"]. Beiden worden meegenomen";
            console.warn("Er zijn zowel coupletnummers achter het lied gezet \""+lied_match[2]+"\" als in het tweede argument ["+coupletten+"]. Beiden worden meegenomen");
        }

        // Ontcijfer elk couplet(-reeks) direct achter het lied
        var couplet_regex = /(\d+)(?:-(\d+))?/g,
            couplet_match;

        while ( couplet_match = couplet_regex.exec(lied_match[2]) ) {

            if ( couplet_match[2] < couplet_match[1] ) {
                if (output) output.innerHTML += "<br>De couplet-reeks " + couplet_match[1] + " staat verkeerd om. Deze wordt overgeslagen.";
                console.warn( "De couplet-reeks " + couplet_match[1] + " staat verkeerd om. Deze wordt overgeslagen.");
                continue;
            }

            let couplet = couplet_match[1];
            do {coupletten.push(couplet);}
            while (couplet++ < couplet_match[2]);
        }

        if (!coupletten || coupletten.length <= 0) {
            //if (output) output.innerHTML += "<br>Er zijn geen coupletten opgegeven voor lied "+lied+", het volledige lied wordt toegevoegd.";
            //console.warn("Er zijn geen coupletten opgegeven voor lied "+lied+", het volledige lied wordt toegevoegd.");
            coupletten = alle_coupletten(lied, output);
        }

        // Verwijder dubbele en ongeldige coupletten
        coupletten = coupletten.filter( function(couplet, c) {
            // Ongeldig couplet:
            if ( isNaN(couplet) || couplet <= 0 ) {
                if (output) output.innerHTML += "<br>" + couplet + " is geen geldig couplet nummer. Deze wordt overgeslagen.";
                console.warn( couplet + " is geen geldig couplet nummer. Deze wordt overgeslagen." );
                return false;
            }
            // Dubbel couplet
            return coupletten.indexOf(couplet) == c;
        });

        // Sorteer de coupletten
        coupletten = coupletten.sort((a,b)=>a>b);

        // Houd bij welke requests falen
        var mislukt = [];

        // Voeg één voor één elk couplet toe aan de actieve lijst
        alle_verzen: for (let c in coupletten) {

            var couplet = coupletten[c],
                id = lied + ':' + couplet,
                poging = 0;

            enkel_vers: while (true){

                var resultaat = SaveSong( lied + ':' + couplet );

                if (resultaat.ListLimitReached) {
                    if (output) output.innerHTML += "<br>De lijstlimiet is bereikt. De rest van de liederen/coupletten kon niet meer worden toegevoegd"
                    console.error("De lijstlimiet is bereikt. De rest van de liederen/coupletten kon niet meer worden toegevoegd");
                    mislukt = mislukt.concat( coupletten.splice(c) );
                    break alle_verzen;
                }

                if (!resultaat.error) break enkel_vers;

                if (++poging >= 3) {
                    if (output) output.innerHTML += "<br>De aanvraag om couplet "+couplet+" toe te voegen is driemaal mislukt."
                    console.error("De aanvraag om couplet "+couplet+" toe te voegen is driemaal mislukt.");
                    mislukt.push(couplet);
                    break enkel_vers;
                }
            }
        }

        // Rapporteer welke coupletten zijn toegevoegd
        if (!mislukt.length) {
            if (output) output.innerHTML += "<br>Lied \"" + lied_string(lied,coupletten) + "\" is toegevoegd."
            console.log( "Lied \"" + lied_string(lied,coupletten) + "\" is toegevoegd." );
        }

        return mislukt.length ? lied_string(lied,mislukt) : 0;

    }



    function lied_string(lied, coupletten = []) {
        var lied_string = lied;

        var reeks_start = -1,
            vorig = -2;

        for (var couplet of coupletten.sort((a,b)=>a>b)) {

            // Wanneer er couplet(ten) worden overgeslagen:
            if (couplet - vorig > 1) {

                // Vorige reeks afsluiten:
                switch (vorig - reeks_start) {
                    case -1: lied_string += ':'; break;
                    case 0: lied_string += ','; break;
                    case 1: lied_string += ',' + vorig + ','; break;
                    default: lied_string += '-' + vorig + ','; break;
                }

                lied_string += couplet;
                reeks_start = couplet;
            }

            vorig = couplet;
        }

        if (couplet){
            switch (couplet - reeks_start) {
                case 0: break;
                case 1: lied_string += ',' + couplet; break;
                default: lied_string += '-' + couplet; break;
            }
        }

        return lied_string;
    }



    async function nieuwe_liedlijst(naam = "automatische liedlijst", datum=new Date().toLocaleDateString(), omschrijving = "Een automatisch aangemaakte liedlijst" ) {

        var xhttp = new XMLHttpRequest();
        xhttp.addEventListener('load', console.log);
        xhttp.open("POST", "/site/nl/home/liedlijst/Insert.aspx", false);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send("DownloadListName="+encodeURIComponent(naam)+
                   "&DownloadListDesc="+encodeURIComponent(omschrijving)+
                   "&ChurchDate="+encodeURIComponent(datum));

        return xhttp.response;
    }



    async function verwerk_tekstvak( tekst, output ) {
        var mislukt = '';
        for (var regel of tekst.replace(' ','').split('\n')) {
            if (regel) {
                var mis = lied_toevoegen(regel,[],output);
                if (mis) mislukt += mis + '\n';
            }
        }
        output.innerHTML += '<br><br>Klaar! <a onclick="location.reload()" style="text-decoration:underline;color:blue;cursor:pointer;">Herlaad</a> de pagina om het resultaat te zien.';
        return mislukt;
    }



    unsafeWindow.LOH = {
        lied_toevoegen: async (lied, coupletten) => lied_toevoegen(lied, coupletten),
        nieuwe_liedlijst: async (naam, datum, omschrijving) => nieuwe_liedlijst(naam, datum, omschrijving),
        alle_coupletten: async (lied) => alle_coupletten(lied),
        GM_xmlhttpRequest: GM_xmlhttpRequest,
    };



    if (location.pathname == "/site/nl/mijnliedboek/Default.aspx") {

        // Voeg een textbox toe onder de liedlijst
        var block = document.createElement('div'),
            textarea = document.createElement('textarea');
        block.className = "block-content";
        block.appendChild(textarea);
        document.getElementsByClassName('block')[0].appendChild(block);

        // Pas de textarea aan
        textarea.id = 'LOH-textarea';
        textarea.style.width = '100%';
        textarea.style.resize = 'vertical';
        textarea.rows = 10;
        textarea.placeholder = 'Eén lied per regel, voorbeelden:\n119\n119:2\n119:3,6\n119:7-9\n119:3,6-9,15';

        // Voeg een knop toe
        var button = document.createElement('button');
        button.innerText = 'Alles toevoegen';
        button.type = 'button';
        button.onclick = function(){
            unsafeWindow.asdf = verwerk_tekstvak(textarea.value, block).then(function(mislukt){
                document.getElementById('LOH-textarea').value = mislukt;
            });
        }
        block.appendChild(button);

    }
})();
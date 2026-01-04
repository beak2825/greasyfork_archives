// ==UserScript==
// @name         Noxtrip Scripts
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Lebo ktory rodic ma kurva cas to ratat
// @author       You
// @match        https://www.darkelf.cz/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/496970/Noxtrip%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/496970/Noxtrip%20Scripts.meta.js
// ==/UserScript==

// v0.2
//- kuzla v hromadnom kupovani domov
//- navratnost - zapocitanie hodnosti
//- verb - ak je sypka ukazuje max per kolo s kupou domcekov, ak nie je tak max podla toho kedy sa kupi sypka
//- pridanie moznosti vypnut/zapnut predikciu nad 16 zemiek0
//- HEUREKA!!! Najdeny vzorec na obchodky dokonca aj cudzie!
//- pridana kontrola na opotrebovanie artefaktov herov
//
// v0.3
// -pridana historia ligy na mape
// v0.4
// - zmena local storage pre mapy na index DB lebo sa nemestia do local storagu
// - prerobenie predikcii na tlacitko
// v0.5
// odstranena chyba negativnych vlastnosti zeme test
// v0.6 (Puma deli nulou)
// Puma obchodkuje s 0 obyvatelmi a chce z toho prijmi tak to treba fixnut

(function() {
    'use strict';

    // Zapinanie scriptov na strankach
    var vylepsenieCentrala = true; // vypnutie celej centraly
    var vylepsenieCentralaVerb = true; // verb  a navratnost v centrale
    var vylepsenieCentralaPredikcie = true; // predikcie ziskov v centrale
    var vylepsenieDE = true; // MO na zemke DE
    var vylepsenieVojsko = true; // Verb na stranke armady
    var vylepsenieHromadneNakupovanieDomov = true; //Zobrazenie magickeho klima a priaznivka pri zemkach v h.k.d.
    var vylepsenieArtefakty = true; // Zobrazenie varaovania pri znicenych artoch
    var vylepsenieHistoria = true; // Uchovanie a zobrazenie historie ligy

    // Nastavovacie premenne
    var minPercentoPoskodeniaArtefaktu = 3; // ak artefakt prekroci hranicu smerom na dol pribudne hlasenie pre hera
    var pocetdDniHistorie = 4
    // Pocet dni pre ligu ulozenia historie mapy

    //Bulharske konstanty
    var ZISK_OBCHODKA_CUDZIA_ZEM = 0.1;

    // Nedostatky pri predikciach:
    // 1. Script nema skade vediet ze je obchodka platna do konca dna ale preplacnuta inou zmlouvou s platnostou zajtra. Tieto obchodky sa nezarataju do predikcii

    var zeme = [];
    var async = {
        budovy: false,
        smlouvy: false,
        atributy: false,
    };
    var pocasie = {};
    var hernyDen = {};
    var ligaDetail = {};
    var hodnost = 0;
    var aliancia = false;
    var alianciaDetail = {};
    var db;

    process_centrala();
    process_zem_de();
    process_vojsko();
    process_hromadne_kupovanie_domov();
    process_mapa();

    function process_centrala( ){
        if ( !document.URL.match("https://www.darkelf.cz/centrala.asp" )){
            return;
        }

        if (!vylepsenieCentrala){
            return;
        }

        addCentralaButton(0);

    }

    function doPrediction(){
         var budovyPromises = [];
        var smlouvyPromises = [];
        var attributyPromises = [];

        // Ziskanie hodnosti
        var documentTH = document.getElementsByTagName('TH');
        for (var i = 0; i<documentTH.length; i++){
            if (documentTH[i].innerText === "Za hodnost"){
                hodnost = Number(documentTH[i].nextElementSibling.nextElementSibling.nextElementSibling.innerText.match(/\((.*)\)/)[1]);
                if (documentTH[i].parentElement.nextElementSibling.firstElementChild.innerHTML.includes("Poplatek alianci")){
                    aliancia = true;
                }
                break;
            }
        }

        // Pre kazdu zemku z centraly si pripravime promisy na ziskanie dodatocnych dat a vytvorim si tabulku zemiek s prazdnimi atributmy
        for (i = 0; i < document.links.length; i++){
            var linkZeme = document.links[i];
            if ( linkZeme.href.includes("/e.asp?id=") ){
                var id = linkZeme.href.match(/id=(.*)/)[1];
                var zemeTableRow = linkZeme.parentElement.parentElement;
                var zemeTableCell = linkZeme.parentElement;

                budovyPromises.push(getBudovyInfoPromise(id));
                smlouvyPromises.push(getSmlouvyInfoPromise(id));
                attributyPromises.push(getAttributyInfoPromise(id));

                zeme.push( {
                            name :linkZeme.innerText ,
                            id : id,
                            href : linkZeme.href,
                            zemeTableRow : zemeTableRow,
                            zemeTableCell: zemeTableCell,
                            obyvateliaPoKolach : [],
                            smlouvy : [],
                            budovy : [],
                            attributy: {}
                           } );

            }
        }

        //Asynchrone volania na doplnenie informacii k zemkam z inych podstranok
        Promise.all(attributyPromises).then((results) => {
            for (var i = 0; i < results.length; i++){
                for (var j = 0; j < zeme.length; j++){
                    if (zeme[j].id === results[i].id){
                        zeme[j].attributy = results[i].attributy;
                        break;
                    }
                }
            }
            async.attributy = true;
            processZemky();
        });

        Promise.all(budovyPromises).then((results) => {
            for (var i = 0; i < results.length; i++){
                for (var j = 0; j < zeme.length; j++){
                    if (zeme[j].id === results[i].id){
                        zeme[j].budovy = results[i].budovy;
                    }
                }
            }
            async.budovy = true;
            processZemky();
        });

        Promise.all(smlouvyPromises).then((results) => {
            for (var i = 0; i < results.length; i++){
                for (var j = 0; j < zeme.length; j++){
                    if (zeme[j].id === results[i].id){
                        zeme[j].smlouvy = results[i].smlouvy;
                        break;
                    }
                }
            }
            async.smlouvy = true;
            processZemky();
        });
    }

    //Hlavna metoda pre spracovanie vsetkych zemiciek po asynchronom nacitani ich dat
    function processZemky(){
        if (!zeme || !async.budovy || !async.smlouvy || !async.attributy){
            return;
        }

        getHlaseniPromise().then(function(result){
            hernyDen = result;
            return getLigaDetailPromise( hernyDen.liga );
        }).then( function(result){
            ligaDetail = result;
            return getAlianciaPromise( );
        }).then( function(result){
            alianciaDetail = result;
            return getListaHornyPromise( );
        }).then(function(result){
            pocasie = result;
            return getListaPromise( );
        }).then(function(result){
            var kola = result;
            if (zeme){
                var rasa = zeme[0].attributy.rasa;
            }
            for (var i=0; i<zeme.length; i++){
                // Vypocty po nacitani vsetkych dat zeme
                recalculateObyvatelov( zeme[i], kola );
            }

            // Ak uz nemam ziadne kola spravim vypocet aspon pre aktualne kolo aby som to mohol pouzit pre vypocet navratnosti
            if (kola.dostupnych_kol === 0){
                var pocetPredikovanychKol = 1;
            }else{
                pocetPredikovanychKol = kola.dostupnych_kol;
            }
            var predictedZisky = [];
            for (var j=0; j<pocetPredikovanychKol; j++){
                predictedZisky.push({
                    kolo:(j+1),
                    predictedZiskZlato : 0,
                    predictedZiskMana: 0
                })
            }

            for (i=0; i<zeme.length; i++){
                // Vypocty po nacitani vsetkych dat zeme a predikcii ziskov/navratnosti
                // mana sa pocita jednoduchsie nakolko nepribudaju obyvatelia
                recalculateZisk( zeme[i], zeme, kola, pocasie, predictedZisky, pocetPredikovanychKol);
                recalculateNavratnost( zeme[i],pocasie);

                // Pridanie riadku do centraly pre danu zemku
                if ( vylepsenieCentralaVerb){
                    var verbInfoRow = getVerbInfoRow( zeme[i],false );
                    zeme[i].zemeTableRow.parentNode.insertBefore(verbInfoRow,zeme[i].zemeTableRow.nextSibling);
                }
            }
            applyHodnostAndAliancia(predictedZisky,rasa);
            if ( vylepsenieCentralaPredikcie){
                appendPredictedZiskyTable(predictedZisky);
            }


        });

    }

    function applyHodnostAndAliancia(predictedZisky,rasa){
        var accumulatedZlato = 0;
        var accumulatedMana = 0;
        var hodnostModifier = getHodnostModifier(hodnost,ligaDetail.hodnostZaklad,rasa);

        for (var j=0; j<predictedZisky.length; j++){
            if (predictedZisky[j].predictedZiskZlato > 0){
                predictedZisky[j].predictedZiskZlato = Math.floor(predictedZisky[j].predictedZiskZlato * hodnostModifier );
                if (aliancia){
                    predictedZisky[j].predictedZiskZlato = predictedZisky[j].predictedZiskZlato - Math.floor((predictedZisky[j].predictedZiskZlato * 0.04));
                }
            }
            predictedZisky[j].predictedZiskZlato = accumulatedZlato + predictedZisky[j].predictedZiskZlato;
            accumulatedZlato = predictedZisky[j].predictedZiskZlato;
            if (predictedZisky[j].predictedZiskMana > 0){
                predictedZisky[j].predictedZiskMana = Math.floor(predictedZisky[j].predictedZiskMana * hodnostModifier );
                if (aliancia){
                    predictedZisky[j].predictedZiskMana = predictedZisky[j].predictedZiskMana - Math.floor((predictedZisky[j].predictedZiskMana * 0.04));
                }
            }
            predictedZisky[j].predictedZiskMana = predictedZisky[j].predictedZiskMana + accumulatedMana;
            accumulatedMana = predictedZisky[j].predictedZiskMana;
        }
    }

    function getHodnostModifier(hodnost,hodnostZaklad,rasa){
        var hodnostModifier = hodnost / hodnostZaklad;
        if ( hodnostModifier > 2){
            hodnostModifier = 2;
        }else if(( hodnostModifier < 0.5 ) && rasa.includes("Barbaři") ){
            hodnostModifier = 0.5;
        }else if( hodnostModifier < 0.25 ){
            hodnostModifier = 0.25;
        }
        return hodnostModifier;
    }

    function appendPredictedZiskyTable(predictedZisky){
        if (predictedZisky){
            var predictedZiskyTable = document.createElement('table');
            var customElementTr = document.createElement('tr');
            var customElementTd = document.createElement('th');
            customElementTd.innerHTML = "Predikcia ziskov";
            customElementTd.colSpan = 3;
            customElementTr.appendChild(customElementTd);
            predictedZiskyTable.appendChild(customElementTr);
            customElementTr = document.createElement('tr');
            customElementTd = document.createElement('td');
            customElementTd.innerHTML = "Kolo";
            customElementTr.appendChild(customElementTd);
            customElementTd = document.createElement('td');
            customElementTd.innerHTML = "Zisk zlato";
            customElementTr.appendChild(customElementTd);
            customElementTd = document.createElement('td');
            customElementTd.innerHTML = "Zisk mana";
            customElementTr.appendChild(customElementTd);
            predictedZiskyTable.appendChild(customElementTr);
            for (var i=0; i <predictedZisky.length; i++){
                customElementTr = document.createElement('tr');
                customElementTd = document.createElement('td');
                customElementTd.innerHTML = predictedZisky[i].kolo;
                customElementTr.appendChild(customElementTd);
                customElementTd = document.createElement('td');
                customElementTd.innerHTML = predictedZisky[i].predictedZiskZlato;
                customElementTr.appendChild(customElementTd);
                customElementTd = document.createElement('td');
                customElementTd.innerHTML = predictedZisky[i].predictedZiskMana;
                customElementTr.appendChild(customElementTd);
                predictedZiskyTable.appendChild(customElementTr);
            }
            var ziskyStandardTable = document.getElementsByTagName('Table')[1];
            ziskyStandardTable.parentNode.insertBefore(predictedZiskyTable,ziskyStandardTable.nextSibling);
        }
    }

    function recalculateObyvatelov(zeme,kola){
        if (zeme.budovy.find((str) => str === "Sýpka - obilná")){
            var sypkaVkole = 0;
        }else{
            sypkaVkole = 99;
        }
        zeme.obyvateliaPoKolach = getObyvateliaPoKolach( kola.dostupnych_kol, zeme.attributy.obyvatelov, sypkaVkole, zeme.attributy.porodnost , zeme.attributy.volnych_domov);
        zeme.maxObyvatelov = obyvatelovZaXKol(kola.dostupnych_kol,zeme.attributy.obyvatelov,sypkaVkole,zeme.attributy.porodnost);
    }

    function recalculateNavratnost( zeme, pocasie ){
        var budovyNumber = getDomyNumberPreRasu(zeme.attributy.rasa);
        var trpBonus = 0;
        var dielna = false;
        var navratnost = 0;
        var navratnostBudov = [];
        var hodnostModifier = getHodnostModifier(hodnost,ligaDetail.hodnostZaklad,zeme.attributy.rasa);
        if (zeme.attributy.rasa.includes("Trpaslíci")){
            trpBonus += 0.2;
            var somTrp = true;
        }
        for (var i = 0; i < alianciaDetail.players.length; i++){
            if (alianciaDetail.players[i].rasa.includes("Trpaslíci")){
                if (somTrp){
                    somTrp = false;
                    continue;
                }
                trpBonus += 0.05;
            }
        }
        if (trpBonus > 0.3){
            trpBonus = 0.3;
        }
        if (!zeme.budovy.find((str) => str === "Mithrilový důl") && zeme.attributy.rasa.includes("Trpaslíci")){
            navratnost = Math.ceil( ( 3000 * (1-trpBonus) ) / (Math.floor(200 * hodnostModifier * zeme.attributy.magia_zlato)) );
            navratnostBudov.push({name: "Mithrilový důl", navratnost: navratnost, img : "b143"});
        }
        if (!zeme.budovy.find((str) => str === "Zlatý důl")){
            navratnost = Math.ceil( ( 2500 * (1-trpBonus) ) / (Math.floor(100 * hodnostModifier * zeme.attributy.magia_zlato)) );
            navratnostBudov.push({name: "Zlatý důl", navratnost: navratnost, img : "b140"});
        }
        if (!zeme.budovy.find((str) => str === "Rudný důl")){
            navratnost = Math.ceil( ( 1400 * (1-trpBonus) ) / (Math.floor(50 * hodnostModifier * zeme.attributy.magia_zlato)) );
            navratnostBudov.push({name: "Rudný důl", navratnost: navratnost, img : "b70"});
        }
        if (!zeme.budovy.find((str) => str === "Dílna")){
            navratnost = Math.ceil( 600 / Math.floor( ( zeme.predictedZiskyZlato[0] + zeme.predictedZiskyZlatoObchodka[0] + zeme.predictedZizkZlatoObchodkaCudzia[0]) * 0.05 * hodnostModifier) );
            navratnostBudov.push({name: "Dílna", navratnost: navratnost, img : "b90"});
        }else{
            dielna = true;
        }
        var cenaDomu = getCenaDomu(zeme.attributy.domov,pocasie.domy);
        var ziskObyvatela = ( zeme.predictedZiskyZlato[0] + zeme.predictedZiskyZlatoObchodka[0] + zeme.predictedZizkZlatoObchodkaCudzia[0] ) / zeme.obyvateliaPoKolach[0];
        if (dielna){
            ziskObyvatela = ziskObyvatela * 1.05;
        }
        navratnost = Math.floor(cenaDomu / Math.floor(ziskObyvatela*hodnostModifier));
        navratnostBudov.push({name: "Domy", navratnost: navratnost, img : budovyNumber+"v3"});

        zeme.navratnostBudov = navratnostBudov.sort((a, b) => {
            return a.navratnost - b.navratnost;
        });

    }

    function getCenaDomu(domov, pocasieDomy){
         return Math.floor(( 60 + Math.pow( ( domov + 1) / 9, 2 )) * pocasieDomy );
    }

    function getVerbInfoRow(zeme,asSingleCell){
        var enti = false;
        if(zeme.attributy.rasa.includes("Enti")){
            enti = true;
        }

        var aktualnyVerb = getVerb( zeme.attributy.obyvatelov, zeme.attributy.domov, zeme.attributy.vojakov, enti );
        var verb = getVerb(zeme.maxObyvatelov,zeme.attributy.domov,zeme.attributy.vojakov,enti);
        var maxVerb = getMaxVerb(zeme.maxObyvatelov,zeme.attributy.domov,zeme.attributy.vojakov,enti);

        var customElementTr = document.createElement('tr');
        var customElementTd = document.createElement('td');
        if (asSingleCell){
            customElementTd.innerHTML = "Max.v. \\ Max.v+d. = " + verb + " \\ " + maxVerb;
            customElementTr.appendChild(customElementTd);
        }else{
            if (zeme.navratnostBudov){
                customElementTd.innerHTML = "Act.v. \\ Max.v. \\ Max.v+d \\ Nav. ";
            }else{
                customElementTd.innerHTML = "Act.v. \\ Max.v. \\ Max.v+d ";
            }
            if (zeme.zemeTableCell){
                customElementTd.style.cssText = zeme.zemeTableCell.style.cssText;
            }
            customElementTr.appendChild(customElementTd);
            customElementTd = document.createElement('td');
            if (zeme.navratnostBudov){
                var title = zeme.navratnostBudov[0].name;
                if (zeme.navratnostBudov[1]){
                    title = title + " (Ďalšia: " + zeme.navratnostBudov[1].name + "(" + zeme.navratnostBudov[1].navratnost + ") )"
                }
                customElementTd.innerHTML = aktualnyVerb + " \\ "+ verb + " \\ " + maxVerb + '\\ <img src="images/m/'+zeme.navratnostBudov[0].img+'.gif" title = "'+ title + '"class="i"> (' + zeme.navratnostBudov[0].navratnost + ')';
            }else{
                customElementTd.innerHTML = aktualnyVerb + " \\ "+ verb + " \\ " + maxVerb ;
            }
            customElementTd.colSpan = 3;
            customElementTr.appendChild(customElementTd);
        }
        return customElementTr;
    }

    function getVerbPredictionTableWithoutSypka(zeme,kola){
        var enti = false;
        if(zeme.attributy.rasa.includes("Enti")){
            enti = true;
        }

        var predictedVerbTable = document.createElement('table');
        var customElementTr = document.createElement('tr');
        var customElementTd = document.createElement('th');
        customElementTd.innerHTML = "Predikcia max. verbu - sýpka";
        customElementTd.colSpan = 4;
        customElementTr.appendChild(customElementTd);
        predictedVerbTable.appendChild(customElementTr);
        customElementTr = document.createElement('tr');
        customElementTd = document.createElement('td');
        customElementTd.innerHTML = "Sypka v kole";
        customElementTr.appendChild(customElementTd);
        customElementTd = document.createElement('td');
        customElementTd.innerHTML = "Max. v.";
        customElementTr.appendChild(customElementTd);
        customElementTd = document.createElement('td');
        customElementTd.innerHTML = "Max. v+d";
        customElementTr.appendChild(customElementTd);
        customElementTd = document.createElement('td');
        customElementTd.innerHTML = "Dokúpiť domov (cena)";
        customElementTr.appendChild(customElementTd);
        predictedVerbTable.appendChild(customElementTr);

        for(var i=0; i<kola.dostupnych_kol; i++){
            var maxObyvatelov = obyvatelovZaXKol(kola.dostupnych_kol,zeme.attributy.obyvatelov,i,zeme.attributy.porodnost);
            var verb = getVerb(maxObyvatelov,zeme.attributy.domov,zeme.attributy.vojakov,enti);
            var dokupitDomov = 0;
            var cenaDomov = 0;
            if ((maxObyvatelov+zeme.attributy.vojakov ) > zeme.attributy.domov){
                dokupitDomov = (maxObyvatelov+zeme.attributy.vojakov ) - zeme.attributy.domov;
                for (var j = 0; j < dokupitDomov; j++){
                    cenaDomov += getCenaDomu(zeme.attributy.domov+j,pocasie.domy)
                }
            }
            var maxVerb = getMaxVerb(maxObyvatelov,zeme.attributy.domov,zeme.attributy.vojakov,enti);
            customElementTr = document.createElement('tr');
            customElementTd = document.createElement('td');
            customElementTd.innerHTML = i;
            customElementTr.appendChild(customElementTd);
            customElementTd = document.createElement('td');
            customElementTd.innerHTML = verb;
            customElementTr.appendChild(customElementTd);
            customElementTd = document.createElement('td');
            customElementTd.innerHTML = maxVerb;
            customElementTr.appendChild(customElementTd);
            customElementTd = document.createElement('td');
            customElementTd.innerHTML = dokupitDomov + ' (' + cenaDomov + ')';
            customElementTr.appendChild(customElementTd);
            predictedVerbTable.appendChild(customElementTr);
        }
        return predictedVerbTable;
    }

    function getVerbPredictionTableWithSypka(zeme,kola,pocasie){
        var enti = false;
        if(zeme.attributy.rasa.includes("Enti")){
            enti = true;
        }

        var predictedVerbTable = document.createElement('table');
        var customElementTr = document.createElement('tr');
        var customElementTd = document.createElement('th');
        customElementTd.innerHTML = "Predikcia max. verbu";
        customElementTd.colSpan = 3;
        customElementTr.appendChild(customElementTd);
        predictedVerbTable.appendChild(customElementTr);
        customElementTr = document.createElement('tr');
        customElementTd = document.createElement('td');
        customElementTd.innerHTML = "Kolo";
        customElementTr.appendChild(customElementTd);
        customElementTd = document.createElement('td');
        customElementTd.innerHTML = "Max. v.";
        customElementTr.appendChild(customElementTd);
        customElementTd = document.createElement('td');
        customElementTd.innerHTML = "Dokúpiť domov (cena)";
        customElementTr.appendChild(customElementTd);
        predictedVerbTable.appendChild(customElementTr);

        for(var i=1; i<=kola.dostupnych_kol; i++){
            var maxObyvatelov = obyvatelovZaXKol(i,zeme.attributy.obyvatelov,0,zeme.attributy.porodnost);
            var dokupitDomov = 0;
            var cenaDomov = 0;
            if ((maxObyvatelov+zeme.attributy.vojakov ) > zeme.attributy.domov){
                dokupitDomov = (maxObyvatelov+zeme.attributy.vojakov ) - zeme.attributy.domov;
                for (var j = 0; j < dokupitDomov; j++){
                    cenaDomov += getCenaDomu(zeme.attributy.domov+j,pocasie.domy)
                }
            }
            var maxVerb = getMaxVerb(maxObyvatelov,zeme.attributy.domov,zeme.attributy.vojakov,enti);
            customElementTr = document.createElement('tr');
            customElementTd = document.createElement('td');
            customElementTd.innerHTML = i;
            customElementTr.appendChild(customElementTd);
            customElementTd = document.createElement('td');
            customElementTd.innerHTML = maxVerb
            customElementTr.appendChild(customElementTd);
            customElementTd = document.createElement('td');
            customElementTd.innerHTML = dokupitDomov + ' (' + cenaDomov + ')';
            customElementTr.appendChild(customElementTd);
            predictedVerbTable.appendChild(customElementTr);
        }
        return predictedVerbTable;
    }

    function addCentralaButton(){
        if ( document.getElementById("noxtrip_zisk_prediction_btn")){
            return;
        }

        var centalaTable = document.getElementById("centrala").getElementsByTagName("table")[1];
        var buttonTr = document.createElement('tr');
        var buttonTh = document.createElement('th');
        var button = document.createElement('button');
        button.innerText = "Predikcia a návratnosť";
        button.onclick = doPrediction;
        button.className = "butt_sml";
        buttonTh.colSpan = 4;
        buttonTh.appendChild(button);
        buttonTr.appendChild(buttonTh);
        centalaTable.getElementsByTagName('tbody')[0].insertBefore(buttonTr,centalaTable.getElementsByTagName("tr")[0] )
    }

    function recalculateZisk( zeme, vsetkyZeme, kola, pocasie, predictedZisky, pocetPredikovanychKol){
        var predictedZiskyZlato = [];
        var predictedZiskyZlatoObchodka = [];
        var predictedZiskZlatoBudovy = [];
        var predictedZizkZlatoObchodkaCudzia = [];

        var budovyZisk = 0;
        if (zeme.budovy.find((str) => str === "Mithrilový důl")){
            budovyZisk += 200;
        }
        if (zeme.budovy.find((str) => str === "Zlatý důl")){
            budovyZisk += 100;
        }
        if (zeme.budovy.find((str) => str === "Rudný důl")){
            budovyZisk += 50;
        }
        if (zeme.budovy.find((str) => str === "Dílna")){
            var dilna = true;
        }
        // Pre vsetky buduce kola vypocitame zisky many a zlata
        for (var i = 0; i < pocetPredikovanychKol; i++){
            //Zlato
            var ziskZaKolo = calculateZiskZlataZaKolo(zeme,zeme.obyvateliaPoKolach[i],pocasie);
            var ziskObchodkyZaKolo = calculateZiskObchodkyZaKolo( zeme, vsetkyZeme, i, pocasie, ziskZaKolo);
            if (dilna){
                ziskZaKolo = ziskZaKolo * 1.05;
                ziskObchodkyZaKolo = ziskObchodkyZaKolo * 1.05;
            }
            var ziskBudovy = budovyZisk * zeme.attributy.magia_zlato;
            var ziskObchodkyCudzieZaKolo = calculateZiskCudzieObchodkyZaKolo(zeme, i, dilna, (ziskZaKolo + ziskObchodkyZaKolo + ziskBudovy));

            predictedZiskyZlato.push(ziskZaKolo);
            predictedZiskyZlatoObchodka.push( ziskObchodkyZaKolo );
            predictedZiskZlatoBudovy.push(ziskBudovy);
            predictedZizkZlatoObchodkaCudzia.push(ziskObchodkyCudzieZaKolo);

            var totalZiskZlata = ziskZaKolo + ziskObchodkyZaKolo + ziskBudovy + zeme.attributy.zoldy + ziskObchodkyCudzieZaKolo;
            predictedZisky[i].predictedZiskZlato = Math.floor(predictedZisky[i].predictedZiskZlato+totalZiskZlata);

            //Mana
            predictedZisky[i].predictedZiskMana = Math.floor(predictedZisky[i].predictedZiskMana + zeme.attributy.prijemMana);
        }
        zeme.predictedZiskyZlatoObchodka = predictedZiskyZlatoObchodka;
        zeme.predictedZiskyZlato = predictedZiskyZlato;
        zeme.predictedZiskZlatoBudovy = predictedZiskZlatoBudovy;
        zeme.predictedZizkZlatoObchodkaCudzia = predictedZizkZlatoObchodkaCudzia;
    }

    function calculateZiskZlataZaKolo( zeme, obyvatelov , pocasie){
        return Math.floor(( obyvatelov * 5 * zeme.attributy.bonusZisk * zeme.attributy.magia_zlato * pocasie.zlato ));
    }

    function calculateZiskObchodkyZaKolo( zeme, vsetkyZeme, kolo, pocasie, ziskLenObyvatelia){
        var ziskObchodky = 0;
        zeme.pocetCuzdichObchodiek = 0;
        for (var i=0; i<zeme.smlouvy.length; i++){
            var mojaZem = false;
            if (zeme.smlouvy[i].obchodka){
                for (var j = 0; j < vsetkyZeme.length; j++){
                    if (vsetkyZeme[j].id === zeme.smlouvy[i].id ){
                        var pomer = vsetkyZeme[j].obyvateliaPoKolach[kolo] / ((zeme.obyvateliaPoKolach[kolo]<=0) ? 1 : zeme.obyvateliaPoKolach[kolo]);
                        var percento = pomer * 0.18;
                        if (percento > 0.4){
                            percento = 0.4;
                        }
                        var ziskObchodka = 5 * percento * zeme.attributy.magia_zlato * ((zeme.obyvateliaPoKolach[kolo]<=0) ? 1 : zeme.obyvateliaPoKolach[kolo]);
                        mojaZem = true;
                        break;
                    }
                }
                if (!mojaZem){
                    ziskObchodka = 0;
                    zeme.pocetCuzdichObchodiek++;
                }
                ziskObchodky = ziskObchodky + ziskObchodka;
            }
        }
        return ziskObchodky;
    }

    function calculateZiskCudzieObchodkyZaKolo( zeme, kolo, dilna, lenMojZisk){
        var ziskCudzieObchodky = 0;
        if (zeme.pocetCuzdichObchodiek === 0){
            return ziskCudzieObchodky;
        }
        if (dilna){
            var dilnaModifier = 1.05;
        }else{
            dilnaModifier = 1.00;
        }
        if (!zeme.obyvCudzieZemkyVPriemere){
            // Dokazem odhadnut kolko maju cudzie zemky priemerne obyvatelov. Robim len pre prve kolko ked viem presny zisk zemky
            var ziskCudzichObchodiek = zeme.attributy.prijemZlato - lenMojZisk;
            var percentoZCudzichObchodiek = ziskCudzichObchodiek / ( ((zeme.obyvateliaPoKolach[kolo]<=0) ? 1 : zeme.obyvateliaPoKolach[kolo]) * 5 * zeme.attributy.magia_zlato * dilnaModifier);
            var percentoCudzej = percentoZCudzichObchodiek / zeme.pocetCuzdichObchodiek;
            zeme.obyvCudzieZemkyVPriemere = (percentoCudzej / 0.18) * ((zeme.obyvateliaPoKolach[kolo]<=0) ? 1 : zeme.obyvateliaPoKolach[kolo]);
        }
        var pomer = zeme.obyvCudzieZemkyVPriemere / ((zeme.obyvateliaPoKolach[kolo]<=0) ? 1 : zeme.obyvateliaPoKolach[kolo]);
        var percento = pomer * 0.18;
        if (percento > 0.4){
            percento = 0.4;
        }
        var ziskCudziaObchodka = 5 * ((zeme.obyvateliaPoKolach[kolo]<=0) ? 1 : zeme.obyvateliaPoKolach[kolo]) * percento * zeme.attributy.magia_zlato * dilnaModifier;
        ziskCudzieObchodky = ziskCudziaObchodka * zeme.pocetCuzdichObchodiek;
        return ziskCudzieObchodky;
    }

    function getObyvateliaPoKolach( dostupnychKol, obyvatelov, sypkaVkole, porodnost, volnychDomov){
        var obyvateliaPoKolach = [];
        for (var i=0; i<=dostupnychKol; i++){
            var obyvatelovVkoleX = obyvatelovZaXKol(i,obyvatelov,sypkaVkole,porodnost);
            if ( obyvatelovVkoleX > ( obyvatelov + volnychDomov )){
                obyvatelovVkoleX = obyvatelov + volnychDomov;
            }
            obyvateliaPoKolach.push(obyvatelovVkoleX)
        }
        return obyvateliaPoKolach;
    }

    function getVerb( obyvatelov, domovCelkom , vojakov, enti){
        var allowedPercentage = 0.8;
        if (enti){
            allowedPercentage = 0.9;
        }
        var verb = 0;
        if ( ( obyvatelov + vojakov ) < domovCelkom ){
            verb = obyvatelov - Math.ceil( domovCelkom * (1-allowedPercentage) );
            if (verb < 0){
                verb = 0;
            }
        }else{
            verb = Math.floor( domovCelkom * allowedPercentage ) - vojakov;
            if (verb < 0){
                verb = 0;
            }
        }
        return verb;
    }

    function getMaxVerb( obyvatelov, domovCelkom, vojakov, enti){
        var allowedPercentage = 0.8;
        if (enti){
            allowedPercentage = 0.9;
        }
        var verb = 0;
        var maxDomov = obyvatelov + vojakov;
        if ( domovCelkom > maxDomov ){
            maxDomov = domovCelkom;
        }
        verb = obyvatelov - Math.ceil( maxDomov * (1-allowedPercentage) );
        if (verb < 0){
            verb = 0;
         }
        return verb;
    }

    function pribudneObyvatelov(obyvatelovAktualne, jeSypka, porodnost){
        var prirastok = 1;
        if (jeSypka){
            prirastok = prirastok + 2 + obyvatelovAktualne * 0.05 ;
        }else{
            prirastok = prirastok + obyvatelovAktualne * 0.05 ;
        }
        prirastok = prirastok * porodnost;
        return Math.floor( prirastok );
    }

    function obyvatelovZaXKol(pocetKol,obyvatelovAktualne, sypkaVkole, porodnost){
        var obyvatelov = obyvatelovAktualne;
        for (var i=0; i<pocetKol; i++){
            if (i >= sypkaVkole){
                var jeSypka = true;
            }else{
                jeSypka = false
            }
             obyvatelov = obyvatelov + pribudneObyvatelov(obyvatelov, jeSypka, porodnost);
        }
        return obyvatelov;
    }

    function getAttributyInfoPromise(id){
        return new Promise( function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET","https://www.darkelf.cz/e.asp?id="+id);
            xhttp.overrideMimeType('text/xml; charset=WINDOWS-1250');
            xhttp.onload = function(){
                if (xhttp.status >= 200 && xhttp.status < 300){
                    resolve({ id : id,
                             attributy :parseAttributy(xhttp.response)});
                }else{
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    });
                }
            };
            xhttp.onerror = function(){
                reject({
                   status: xhttp.status,
                   statusText: xhttp.statusText
               });
            };
            xhttp.send();
        });
    }

    function parseAttributy(httpResponse){
        var attributy = {
            rasa : "",
            prijemMana: 0,
            prijemZlato: 0,
            zoldy: 0,
            domov: 0,
            obyvatelov: 0,
            vojakov: 0,
            volnych_domov: 0,
            porodnost: 1,
            magia_zlato: 1,
            magia_mana: 1,
            bonusZisk : 1,
            bonusMana: 1,
        };
        var dom = new DOMParser().parseFromString(httpResponse, 'text/html');
        var formDomy = dom.getElementsByName("form_domy")[0];
        if (formDomy){
            var tables = formDomy.getElementsByTagName('table');
            if (tables[1]){
                attributy.rasa = tables[1].getElementsByTagName('TR')[2].getElementsByTagName('TD')[1].innerText.replace(/\tx|\t|\n/gm, "");
            }
            if (tables[2]){
                attributy.prijemZlato = Number(tables[2].getElementsByTagName('TR')[0].getElementsByTagName('TD')[1].innerText);
                attributy.zoldy = Number(tables[2].getElementsByTagName('TR')[1].getElementsByTagName('TD')[1].innerText);
                attributy.prijemMana = Number(tables[2].getElementsByTagName('TR')[0].getElementsByTagName('TD')[2].innerText);
            }
            if (tables[3]){
                attributy.domov = Number(tables[3].getElementsByTagName('TR')[0].getElementsByTagName('TD')[1].innerText);
                attributy.obyvatelov = Number(tables[3].getElementsByTagName('TR')[1].getElementsByTagName('TD')[1].innerText);
                attributy.vojakov = Number(tables[3].getElementsByTagName('TR')[2].getElementsByTagName('TD')[1].innerText);
                attributy.volnych_domov = attributy.domov - ( attributy.obyvatelov + attributy.vojakov );
            }
            if (tables[5]){
                var bonusy = tables[5].getElementsByTagName('TR');
                for (var i = 1; i <(bonusy.length - 1); i++){
                    var textBonusu = bonusy[i].getElementsByTagName('TD')[1].innerText;
                    var match = textBonusu.match(/\+(.*)% zisk/);
                    if (match){
                        attributy.bonusZisk = 1 + Number(match[1]) / 100;
                    }
                    match = textBonusu.match(/\+(.*)% Mana/);
                    if (match){
                        attributy.bonusMana = 1 + Number(match[1]) / 100;
                    }
                }
            }
            if (tables[6]){
                var kouzla = tables[6].getElementsByTagName('TR');
                for ( i = 1; i < kouzla.length; i++){
                    var textKouzla = kouzla[i].getElementsByTagName('TD')[0].innerText;
                    match = textKouzla.match(/Porodnost = (...?)%/);
                    if ( match ){
                        attributy.porodnost = Number(match[1]) / 100;
                    }
                    match = textKouzla.match(/zlatých = (...?)%/);
                    if ( match ){
                        attributy.magia_zlato = Number(match[1]) / 100;
                    }
                    match = textKouzla.match(/many = (...?)%/);
                    if ( match ){
                        attributy.magia_mana = Number(match[1]) / 100;
                    }
                }
            }
        };
        return attributy;
    }

    function getBudovyInfoPromise(id){
        return new Promise( function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET","https://www.darkelf.cz/b.asp?id="+id);
            xhttp.overrideMimeType('text/xml; charset=WINDOWS-1250');
            xhttp.onload = function(){
                if (xhttp.status >= 200 && xhttp.status < 300){
                    resolve({ id : id,
                             budovy :parseBudovy(xhttp.response)});
                }else{
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    });
                }
            };
            xhttp.onerror = function(){
                reject({
                   status: xhttp.status,
                   statusText: xhttp.statusText
               });
            };
            xhttp.send();
        });
    }

    function parseBudovy(httpResponse){
        var budovy = [];
        var dom = new DOMParser().parseFromString(httpResponse, 'text/html');
        for ( var i = 0; i < dom.getElementsByClassName("bgx").length; i++ ){
            var budovaTd = dom.getElementsByClassName("bgx")[i].nextElementSibling;
            var budovaText = budovaTd.innerText.replace(/\tx|\t|\n/gm, "");
            budovy.push(budovaText);
        }
        return budovy;
    }

    function getSmlouvyInfoPromise(id){
        return new Promise( function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET","https://www.darkelf.cz/c.asp?id="+id);
            xhttp.overrideMimeType('text/xml; charset=WINDOWS-1250');
            xhttp.onload = function(){
                if (xhttp.status >= 200 && xhttp.status < 300){
                    resolve({ id : id,
                             smlouvy :parseSmlouvy(xhttp.response)});
                }else{
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    });
                }
            };
            xhttp.onerror = function(){
                reject({
                   status: xhttp.status,
                   statusText: xhttp.statusText
               });
            };
            xhttp.send();
        });
    }

    function parseSmlouvy(httpResponse){
        var smlouvy = [];
        var dom = new DOMParser().parseFromString(httpResponse, 'text/html');
        var smlouvyForm = dom.getElementsByName("smlouvy")[0];
        if (smlouvyForm){
            var smlouvyTR = smlouvyForm.firstElementChild.firstElementChild.getElementsByTagName('TR');
            for (var j = 1; j < smlouvyTR.length-1; j++ ){
                var obchodka = false;
                var smlouvaText = smlouvyTR[j].getElementsByTagName("TD")[0].innerText;
                if (smlouvaText.match(/nabízí/)) continue;
                if ( smlouvaText.match(/Obchodní/) ){
                    if (smlouvaText.match(/platnost/)){
                        obchodka = false;
                    }else{
                        obchodka = true;
                    }
                }
                smlouvy.push( {
                    name: smlouvyTR[j].getElementsByTagName("TH")[0].getElementsByTagName("span")[0].innerText,
                    id: smlouvyTR[j].getElementsByTagName("a")[0].href.match(/zeme=(.*)/)[1],
                    obchodka: obchodka
                });
            }

        }
        return smlouvy;
    }

    function getListaPromise(){
        return new Promise( function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET","https://www.darkelf.cz/Lista_Informace.asp");
            xhttp.overrideMimeType('text/xml; charset=WINDOWS-1250');
            xhttp.onload = function(){
                if (xhttp.status >= 200 && xhttp.status < 300){
                    resolve(parseLista(xhttp.response));
                }else{
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    });
                }
            };
            xhttp.onerror = function(){
                reject({
                   status: xhttp.status,
                   statusText: xhttp.statusText
               });
            };
            xhttp.send();
        });
    }

    function parseLista(httpResponse){
        var kola = {
            odohranych_kol : 0,
            celkovo_kol : 0,
            dostupnych_kol : 0,
        };
        var dom = new DOMParser().parseFromString(httpResponse, 'text/html');
        var pocet_kol_string = dom.getElementById("i3").textContent;
        kola.odohranych_kol = Number(pocet_kol_string.split("/")[0]);
        kola.celkovo_kol = Number(pocet_kol_string.split("/")[1]);
        kola.dostupnych_kol = kola.celkovo_kol - kola.odohranych_kol;
        return kola;
    }

    function getListaHornyPromise(){
        return new Promise( function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET","https://www.darkelf.cz/Lista_Horni.asp");
            xhttp.overrideMimeType('text/xml; charset=WINDOWS-1250');
            xhttp.onload = function(){
                if (xhttp.status >= 200 && xhttp.status < 300){
                    resolve(parseListaHorni(xhttp.response));
                }else{
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    });
                }
            };
            xhttp.onerror = function(){
                reject({
                   status: xhttp.status,
                   statusText: xhttp.statusText
               });
            };
            xhttp.send();
        });
    }

    function parseListaHorni(httpResponse){
        var pocasie = {
            zlato : 1,
            mana : 1,
            domy : 1,
        };
        var dom = new DOMParser().parseFromString(httpResponse, 'text/html');
        for (var i = 0; i < dom.links.length; i++){
           if ( dom.links[i].href.includes("hlaseni.asp") ){
               if (dom.links[i].firstElementChild){
               var poc = dom.links[i].firstElementChild.title.match(/Počasí: (.*)/)[1].split('-');
               }
               else{
                   poc = dom.links[i].title.match(/Počasí: (.*)/)[1].split('-');
               }
               pocasie.zlato = Number(poc[0]) / 100;
               pocasie.mana = Number(poc[1]) / 100;
               pocasie.domy = Number(poc[2]) / 100;
           }
        }

        return pocasie;
    }

     function getHlaseniPromise(){
        return new Promise( function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET","https://www.darkelf.cz/hlaseni.asp");
            xhttp.overrideMimeType('text/xml; charset=WINDOWS-1250');
            xhttp.onload = function(){
                if (xhttp.status >= 200 && xhttp.status < 300){
                    resolve(parseHlaseni(xhttp.response));
                }else{
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    });
                }
            };
            xhttp.onerror = function(){
                reject({
                   status: xhttp.status,
                   statusText: xhttp.statusText
               });
            };
            xhttp.send();
        });
    }

    function parseHlaseni(httpResponse){
        var dom = new DOMParser().parseFromString(httpResponse, 'text/html');
        var hernyDen = {
            den : dom.getElementsByName("Comp")[0].firstElementChild.value,
            liga:  dom.getElementsByClassName("gold")[1].innerText
        };
        return hernyDen;
    }

    function getAlianciaPromise(){
        return new Promise( function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET","https://www.darkelf.cz/aliance.asp");
            xhttp.overrideMimeType('text/xml; charset=WINDOWS-1250');
            xhttp.onload = function(){
                if (xhttp.status >= 200 && xhttp.status < 300){
                    resolve(parseAliancia(xhttp.response));
                }else{
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    });
                }
            };
            xhttp.onerror = function(){
                reject({
                   status: xhttp.status,
                   statusText: xhttp.statusText
               });
            };
            xhttp.send();
        });
    }

    function parseAliancia(httpResponse){
        var alianciaDetail = {
            players : []
        };
        var dom = new DOMParser().parseFromString(httpResponse, 'text/html');
        if (!dom.getElementById("tab_players_list")){
            return alianciaDetail;
        }
        var alianciaTR = dom.getElementById("tab_players_list").getElementsByTagName("TR");
        for (var i = 1; i < alianciaTR.length - 1; i++){
            alianciaDetail.players.push({
                nick: alianciaTR[i].getElementsByTagName("a")[1].innerText,
                rasa: alianciaTR[i].getElementsByTagName("TD")[1].innerText
            });

        }
        return alianciaDetail;
    }

    function getLigaDetailPromise(liga){
        return new Promise( function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST","https://www.darkelf.cz/league_details.asp");
            xhttp.overrideMimeType('text/xml; charset=WINDOWS-1250');
            xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhttp.onload = function(){
                if (xhttp.status >= 200 && xhttp.status < 300){
                    resolve(parseLigaDetail(xhttp.response));
                }else{
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    });
                }
            };
            xhttp.onerror = function(){
                reject({
                   status: xhttp.status,
                   statusText: xhttp.statusText
               });
            };
            xhttp.send("cb_league="+liga);
        });
    }

    function parseLigaDetail(httpResponse){
        var dom = new DOMParser().parseFromString(httpResponse, 'text/html');
        var ligaDetail = {
            hodnostZaklad : Number(dom.getElementsByTagName("TD")[31].innerText)
        };
        return ligaDetail;
    }

    function getHeroPromise(id,heroImg){
        return new Promise( function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET","https://www.darkelf.cz/hero.asp?h="+id);
            xhttp.overrideMimeType('text/xml; charset=WINDOWS-1250');
            xhttp.onload = function(){
                if (xhttp.status >= 200 && xhttp.status < 300){
                    resolve({id: id,
                             heroImg: heroImg,
                             mojHero : parseHero(xhttp.response)});
                }else{
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    });
                }
            };
            xhttp.onerror = function(){
                reject({
                   status: xhttp.status,
                   statusText: xhttp.statusText
               });
            };
            xhttp.send();
        });
    }

    function parseHero(httpResponse){
        var mojHero = false;
        var dom = new DOMParser().parseFromString(httpResponse, 'text/html');
        if (!dom.getElementById("centrala")){
            return false;
        }
        var text = dom.getElementById("centrala").getElementsByTagName("table")[1].getElementsByTagName("TR")[0].getElementsByTagName("TD")[0].innerText;
        if (text === 'Ve službách'){
           return false;
        }else{
           return true;
        }
    }

    function getHeroArtifactsPromise(id,heroImg){
        return new Promise( function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET","https://www.darkelf.cz/artefacts_list.asp?h="+id);
            xhttp.overrideMimeType('text/xml; charset=WINDOWS-1250');
            xhttp.onload = function(){
                if (xhttp.status >= 200 && xhttp.status < 300){
                    resolve({id: id,
                             heroImg: heroImg,
                             poskodeneArtefakty : parseHeroArtifacts(xhttp.response)});
                }else{
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    });
                }
            };
            xhttp.onerror = function(){
                reject({
                   status: xhttp.status,
                   statusText: xhttp.statusText
               });
            };
            xhttp.send();
        });
    }

    function parseHeroArtifacts(httpResponse){
        var poskodeneArtefakty = 0;
        var dom = new DOMParser().parseFromString(httpResponse, 'text/html');
        if (!dom.getElementsByTagName("table")[2]){
            return poskodeneArtefakty;
        }
        var artifactsTH = dom.getElementsByTagName("table")[2].getElementsByTagName("th");
        for (var i=0; i<artifactsTH.length; i++){
            var poskodenie = artifactsTH[i].firstElementChild.firstElementChild.innerText.match(/(.*)%/)[1];
            if (Number(poskodenie) < minPercentoPoskodeniaArtefaktu && Number(poskodenie) != 0){
                poskodeneArtefakty++;
            }
        }
        return poskodeneArtefakty;

    }

    function process_vojsko(){
        if ( !document.URL.match("https://www.darkelf.cz/a.asp\\?id=" )){
            return;
        }
        if (!vylepsenieVojsko){
            return;
        }
        var id = document.URL.match(/id=(.*)/)[1];
        zeme = {
            budovy : [],
            attributy: {}
        };
        getBudovyInfoPromise(id).then(function(result){
            zeme.budovy = result.budovy
            return getAttributyInfoPromise(id);
        }).then(function(result){
            zeme.attributy = result.attributy;
            return getListaHornyPromise( );
        }).then(function(result){
            pocasie = result;
            return getListaPromise( );
        }).then( function(result){
            var kola = result;
            recalculateObyvatelov( zeme, kola );
            var verbInfoRow = getVerbInfoRow( zeme, true );
            var table = document.getElementsByTagName("table")[2];
            table.firstElementChild.appendChild( verbInfoRow );
            if (!zeme.budovy.find((str) => str === "Sýpka - obilná")){
                var predictionVerbTable = getVerbPredictionTableWithoutSypka( zeme, kola);
                document.getElementsByName("form_army")[0].parentNode.insertBefore(predictionVerbTable,document.getElementsByName("form_army")[0].nextSibling);
            }else{
                predictionVerbTable = getVerbPredictionTableWithSypka( zeme, kola, pocasie);
                document.getElementsByName("form_army")[0].parentNode.insertBefore(predictionVerbTable,document.getElementsByName("form_army")[0].nextSibling);
            }
        });
    }

    function process_hromadne_kupovanie_domov(){
        if ( !document.URL.match("https://www.darkelf.cz/auto_domy.asp" )){
            return;
        }
        if (!vylepsenieHromadneNakupovanieDomov){
            return;
        }

        for (var i = 0; i < document.links.length; i++){
            var linkZeme = document.links[i];
            if ( linkZeme.href.includes("/e.asp?id=") ){
                var id = linkZeme.href.match(/id=(.*)/)[1];
                getAttributyInfoPromise(id).then(function(result){
                     addKuzlaToHKB(result);
                });

            }
        }
    }

    function addKuzlaToHKB(attributyInfo){
        for (var i = 0; i < document.links.length; i++){
            var linkZeme = document.links[i];
            if ( linkZeme.href.includes("/e.asp?id=") ){
                var id = linkZeme.href.match(/id=(.*)/)[1];
                if (id === attributyInfo.id){
                    if (attributyInfo.attributy.magia_zlato > 1){
                        var customImg = document.createElement('img');
                        customImg.setAttribute("src","images/kouzla/k40.gif");
                        customImg.setAttribute("title","Zisk zlatých = 130%");
                        customImg.setAttribute("align","top");
                        customImg.style.paddingLeft = "2px";
                        linkZeme.parentNode.insertBefore(customImg,linkZeme.nextSibling);
                    }
                    if (attributyInfo.attributy.magia_mana > 1){
                        customImg = document.createElement('img');
                        customImg.setAttribute("src","images/kouzla/k50.gif");
                        customImg.setAttribute("title","Zisk many = 130%");
                        customImg.setAttribute("align","top");
                        customImg.style.paddingLeft = "2px";
                        linkZeme.parentNode.insertBefore(customImg,linkZeme.nextSibling);
                    }
                }
            }
        }
    }

    function process_zem_de(){
        if ( !document.URL.match("https://www.darkelf.cz/l.asp\\?id=66" )){
            return;
        }
        if (!vylepsenieDE){
            return;
        }

        getHlaseniPromise().then(function(result){
            var vlastnostiZemeTbody = document.getElementsByTagName("table")[1].firstElementChild;
            var customElementTr = document.createElement('tr');
            var customElementTd = document.createElement('td');
            customElementTd.innerHTML = '<p style="color:MediumSeaGreen">Magicka obrana</p>';
            customElementTr.appendChild(customElementTd);
            customElementTd = document.createElement('td');
            var hernyDen = result;
            var mo = '??';
            if (hernyDen){
                var hernyDenNum = Number(hernyDen.den);
                if ( hernyDenNum == 9 ) {
                    mo = '3000';
                }else if ( hernyDenNum == 10 ){
                    mo = '2650';
                }else if ( hernyDenNum == 11 ){
                    mo = '2500';
                }else if ( hernyDenNum == 12 ){
                    mo = "2350";
                }else if ( hernyDenNum == 13 ){
                    mo = "2250";
                }else if ( hernyDenNum == 14 ){
                    mo = "2150";
                }else if ( hernyDenNum == 15 ){
                    mo = "2050";
                }else if ( hernyDenNum == 16 ){
                    mo = "1950";
                }else if ( hernyDenNum == 17 ){
                    mo = "1900";
                }else if ( hernyDenNum >= 18 ){
                    mo = "<1900";
                }
            }
            customElementTd.innerHTML = '<p style="color:MediumSeaGreen">' + mo + '</p>' ;
            customElementTr.appendChild(customElementTd);
            vlastnostiZemeTbody.appendChild(customElementTr);
        });

    }

    function process_mapa(){
        if ( !document.URL.match("https://www.darkelf.cz/map_new.asp") && !document.URL.match("https://www.darkelf.cz/map_old.asp") ){
            return;
        }
        if (vylepsenieArtefakty){
             findBrokenArtifactsAndNotif();
        }
        if (vylepsenieHistoria){
            processHistory();
        }
    }

    function findBrokenArtifactsAndNotif(){
        for (var i = 0; i < document.links.length; i++){
            if ( document.links[i].href.includes("/hero.asp?h=") ){
                var heroId = document.links[i].href.match(/\?h=(.*)/)[1];
                var heroImg = document.links[i].firstElementChild.src;
                getHeroPromise(heroId,heroImg).then(function (result){
                    if (result.mojHero){
                        getHeroArtifactsPromise(result.id,result.heroImg).then(function(result){
                            if (result.poskodeneArtefakty > 0){
                                showWarningforHeroArtefact(result.heroImg);
                            }
                        });
                    }
                });
            }
        }
    }

    function processHistory(){
        getHlaseniPromise().then(function(result){
            const request = indexedDB.open("NoxtripDEScriptDB", 1);
            request.onupgradeneeded = (event) => {
                db = event.target.result;
                const objectStore = db.createObjectStore("maps", { keyPath: "identifier" });
            }
            request.onerror = (event) => {
                console.error(`Database error: ${event.target.errorCode}`);
                return;
            }
            request.onsuccess = (event) => {
                db = event.target.result;
                var objectStore = db.transaction("maps", "readwrite").objectStore("maps");
                storeCurrentLigaDayDB(result.den,result.liga,objectStore)
            }
        });

    }


    function addHistoryPickerDB(den,liga,objectStore){
        var selectHistory = document.createElement('select');
        selectHistory.className = "list_centred";
        selectHistory.id = "noxHistorySelect";
        selectHistory.size = 1;

        var windowKeep = window;
        selectHistory.addEventListener("change",function(event){
            if (event.type == "change"){
                var selectedDen = event.srcElement.value;
                if (selectedDen === event.srcElement.options[0].value){
                    document.location.reload(true);
                }else{
                    var storageId = liga+selectedDen;
                    db.transaction("maps").objectStore("maps").get(storageId).onsuccess = function(event){
                        if (event.target.result){
                            document.getElementById("maps").innerHTML = event.target.result.html;
                        }
                    };
                }
            }
        });

        var customDiv = document.createElement('div');
        customDiv.style.left = "4px";
        customDiv.style.top= "54px";
        customDiv.style.positon= "aboslute";
        customDiv.style.zIndex= "200";
        customDiv.appendChild(selectHistory);
        document.getElementById("maps").parentElement.appendChild(customDiv);

        for (var i=0; i<pocetdDniHistorie; i++){
            var storageId = liga+(Number(den)-i);
            objectStore.get(storageId).onsuccess = function(event){
                if (event.target.result){
                    var historyOption = document.createElement('option');
                    historyOption.value = (event.target.result.den);
                    historyOption.innerText = "Herný den " + historyOption.value;
                    selectHistory.appendChild(historyOption);
                }
            };
        }

    }


     function storeCurrentLigaDayDB(den,liga,objectStore){
        var storageId = liga+den;
        var request = objectStore.get(storageId).onsuccess = (event) => {
            if (!event.target.result){
                var storageIdd = liga+den;
                objectStore.add({ identifier : storageIdd , den : den, html: document.getElementById("maps").innerHTML }).onsuccess = function(event){
                    addHistoryPickerDB(den,liga,objectStore);
                };
            }else{
                addHistoryPickerDB(den,liga,objectStore);
            }
         };
         storageId = liga+(Number(den)-pocetdDniHistorie);
         objectStore.delete(storageId);
         localStorage.removeItem(storageId); // For legacy purpose
    }

    function showWarningforHeroArtefact(heroImg){
        var span = document.createElement('span');
        var img = document.createElement('img');
        img.src = heroImg;
        span.appendChild(img);
        var spanText = document.createElement('span');
        spanText.innerText = "Hrdina má aretfakt tesne pred rozpadnutím!!!!";
        span.appendChild(spanText);
        span.style.color = "red";
        span.style.fontWeight = "bold";
        if (document.URL.match("https://www.darkelf.cz/map_old.asp") ){
            span.style.position = "absolute";
            span.style.left = "2%";
            document.getElementById("maps").insertBefore( span,document.getElementById("maps").firstElementChild);
        }else{
            document.getElementById("miniMenuContainer").appendChild(span);
        }
    }

    function getDomyNumberPreRasu(rasa){
        switch(rasa.replace(/^\s+|\s+$/gm,'')) {
            case "Lidé":
                return "0";
            case "Barbaři":
                return "1";
            case "Skřeti":
                return "2";
            case "Skuruti":
                return "3";
            case "Nekromanti":
                return "4";
            case "Mágové":
                return "5";
            case "Elfové":
                return "6";
            case "Temní Elfové":
                return "7";
            case "Trpaslíci":
                return "8";
            case "Hobiti":
                return "9";
            case "Enti":
                return "10";
            default:
                return "0";
        }
    }

})();
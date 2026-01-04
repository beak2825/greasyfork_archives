// ==UserScript==
// @name         Deutscher Impftermin-Prüfer
// @namespace    deImpfSlotChecker
// @version      1.1.4
// @description  Stay safe, get vaccinated.
// @author       NetDevil, impfalert@gmail.com
// @match        https://www.xn--impfterminbersicht-v6b.de/baden_wuerttemberg/*
// @match        https://*.impfterminservice.de/impftermine/service?plz=*
// @match        https://*.impfterminservice.de/impftermine/suche*
// @icon         https://www.google.com/s2/favicons?domain=xn--impfterminbersicht-v6b.de
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/427020/Deutscher%20Impftermin-Pr%C3%BCfer.user.js
// @updateURL https://update.greasyfork.org/scripts/427020/Deutscher%20Impftermin-Pr%C3%BCfer.meta.js
// ==/UserScript==

window.setTimeout(kickOff, 1000); // kick script off after 1 second to allow for site to fully load

function kickOff() {

    console.log("Script gestartet!");
    buildUIGeneral();
    debugMe("Willkommen im Skript. Wir laufen auf URL: " + window.location.href);

    if(window.location.href.indexOf("https://www.xn--impfterminbersicht-v6b.de/baden_wuerttemberg/") >= 0) {
        debugMe("Lade Module für Impfterminübersicht.de");
        kickOffImpferterminUebersicht();
    }

    if(window.location.href.indexOf(".impfterminservice.de/impftermine/service?plz=") >= 0) {
        debugMe("Lade Module für Impfzentrum Code Generation");
        kickOffImpfterminserviceCodeGeneration();
    }

    if(window.location.href.indexOf(".impfterminservice.de/impftermine/suche") >= 0) {
        debugMe("Lade Module für Impfzentrum Termin Buchung");
        kickOffImpfterminserviceTerminBuchung();
    }
}

function kickOffImpferterminUebersicht() {

    if(document.getElementById("cf-error-details") !== null) {
        debugMe("Impfterminübersicht hat aktuell Probleme ... Die Seite wird in 30 Sekunden automatisch neu geladen");
        window.setTimeout(window.location.reload.bind(window.location), 30*1000);
        return;
    }

    buildUIImpfterminUebersicht();
    loadGlobalValues_ImpfterminUebersicht();
    window.setTimeout(doWorkOnKIZRawData, 2000);
    window.setTimeout(doCheckForASubpageHit, 2000);
}

function kickOffImpfterminserviceCodeGeneration() {
    if(window.location.href.indexOf("autoStartOp=1") >= 0) {
        operationalStatus = 1;
        window.setTimeout(doWorkImpfCodeErstellung, 2000);
    }
    else {
        debugMe("Die Website wurde händisch aufgerufen und kein Start-Kommando übergebe ==> mache nix.");
    }
}

function kickOffImpfterminserviceTerminBuchung() {
    if(window.location.href.indexOf("autoStartOp=1") >= 0) {
        operationalStatus = 1;
        window.setTimeout(doWorkTerminByCodeVerfuegbar, 2000);
    }
    else {
        debugMe("Die Website wurde händisch aufgerufen und kein Start-Kommando übergebe ==> mache nix.");
    }
}

function loadGlobalValues_ImpfterminUebersicht() {
    z_myFunc_LoadSettingKIZGroupCodes();
    z_myFunc_LoadSettingKIZPLZFavs();
    z_myFunc_LoadSettingKIZsAlreadyBooked();
    z_myFunc_LoadSettingSendMailOption();
    z_myFunc_LoadSettingLatestHits();
}

var retryInterval = 10*1000;
var checkHTMLResponseInterval = 1000;
var keepInactiveLimitInMin = 6;

var operationalStatus = 0;
var counterOfChecks = 0;
var autofillerToDoStep = 0;

// to convert sounds go to https://base64.guru/converter/encode/audio
var alrtSoundDuck = new Audio ("data:audio/mp3;base64,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/XQ0F5IZ02SDoNlsXoeUtnOLbFEXPeZyydac5R4ySMgFRpZijAjMEkby8yvS9fsyJVr8bzaHFxIkF0O9NftowAAG2uAwICBf/96y9dX//f////tv7e/+/9W/b9vovRv//r/+1nnrkVMjMzVFIgmgHTwRdQIlAAyUDA5pbQ+V2HSjkOppxxr7OYFZdMwI9A0xjAbYgFQApwAAiFgGTFHBs6HHAs4sYN3CGhlg4GKSBhfQhAwCRMcZoXCkLmUQw2JlEvmlNNkqDmK5eeyLMkhNWWmbIoLdkGRQW7XuzKX+hbbdKr2UdmzXPrUgaVCgAAUC0UAADf//p//Tr////Sn////97//p/2////////uSZEwAA8VDVcViQAIyTXidoIgAW60vPvm9gABsgCODACAA///pbb89r0MikIjvGBqdRZ1ETgQAAAAAAAADhnMGRtyGYweHciRtAUcKNGGGgsPrDm7rAjBAgGLsJPmMhgqFFwVUzGQAyVyMGBDeZAGGJhxAb2jiVQZ8VmDQJEvGpRYFPTERBQUyUOL1DSuCQoaMDHhMlDkdDBwctGXoL5EIit1nLdV2gIcCCYcB1TszTtTe0+DjVmuSFsinTCVUGGs+aekMvGM3PjsPOSzGGX/k8itdaQuloUGu9ZjcFVuxavjjrs1jqzOSiP3pTupUqy6bpN3Zmr//VjjWZuig/v///8thqJz3////0s1dd/pU3/u6f////////+v2f//+XMfA6H/F1pN//hYSf/jzygAAYAAAImCEhz0feHViByqpZUsyg6zqBqru2XRcFL1IlLD5DUjhVONqVDYZyqGAhyqLqBdAIRxJEekhJ0sr1Wq2NBTqGoay0Yk891bf9rWrr+2/mvrX4tv1/9t+sF7aJQVBUGgaiUFn/lg5wad8SgqCo//7kmQ5D/OLLctnYeAAMMAYjeAIAIAAAaQAAAAgAAA0gAAABOt21ttt0CYKwoDQlBUFQVOlQViXxYGj3EQNA0e1A19YK1/EQNf/lf//5Y9wa//+CtVMQU1FMy45OS4zVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=");
var alrtSound = alrtSoundDuck;
var playSound = 0;

var latestHits = {};
var plzFavs = [];
var alreadySlotGebucht = [];
var groupCodes = {};

var mapKIZsToPLZs = {};
    mapKIZsToPLZs["001-iz"] = [68163,69124,69469,70376,74889,75056,76646,77815,78532,78628,89073];
    mapKIZsToPLZs["002-iz"] = [69123,70174,71297,74081,76287,77656,77815,78224,79108];
    mapKIZsToPLZs["003-iz"] = [72072,72280,74360,74549,74585,74613,74821,76530,88045,88444,89522];
    mapKIZsToPLZs["005-iz"] = [71636,72213,72762,73430,75175,76137,79341,79379,79761,97980];
    mapKIZsToPLZs["229-iz"] = [70629,71065,71334,72469,73037,73730,78056,79541,88212,88367,89584];


function doCheckForASubpageHit() {
    // ###### CHECK IF ANY SUBPAGE FOR CODE GENERATION HAS A HIT #######

    window.setTimeout(doCheckForASubpageHit, 2000);

    if(GM_getValue("canGenerateCodeOnPage",0)) {
        debugMe("Ein Tab hat einen Treffer erzeugt ...");
        if(GM_getValue("canGenerateCodeOnPage",0) === 0) {
            debugMe("... aber leider war nichts frei ...");
        }
        else if(GM_getValue("canGenerateCodeOnPage",0) >= 0) {
            debugMe("Und es sieht gut aus! Hier gibt es was zu tun!");
            playSound = 1;
            playEndlessSound();
        }
        GM_setValue("canGenerateCodeOnPage",0);
    }

    // ###### CHECK IF ANY SUBPAGE FOR SLOT BOOKING HAS A HIT #######
    if(GM_getValue("canBookMeetingOnPage",0)) {
        debugMe("Ein Tab hat einen Treffer erzeugt ...");
        if(GM_getValue("canBookMeetingOnPage",0) === 0) {
            debugMe("... aber leider war nichts frei ...");
        }
        else if(GM_getValue("canBookMeetingOnPage",0) >= 1) {
            debugMe("Und es sieht gut aus! Hier gibt es was zu tun!");
            playSound = 1;
            playEndlessSound();
        }
        GM_setValue("canBookMeetingOnPage",0);
    }
}

function doWorkOnKIZRawData() {

    // ###### SET NEXT RETRY INTERVAL RUN #######
    retryInterval = document.getElementById ("z_Input_Text_RetryInterval").value;
    if(isNaN(retryInterval)) {
        retryInterval = 10000;
        debugMe("Automatischer Wiederholungsintervall " + retryInterval + " ist keine Zahl. Benutze hard-codierten Fallback 10000 ms.");
    }
    //debugMe("New run started. Next check in " + retryInterval + " seconds");
    window.setTimeout(doWorkOnKIZRawData, retryInterval);

    // ###### CLEAR OUTDATED BLACKLISTED ENTRIES #######
    for(var entry in latestHits) {
        if(((Date.now() - latestHits[entry]) / 1000) >= keepInactiveLimitInMin*60) {
            debugMe("Eintrag " + entry + " auf temporärer Sperrliste ist über " + keepInactiveLimitInMin + " Minuten alt und wird nun entfernt");
            delete latestHits[entry];
        }
    }
    GM_setValue("latestHits",JSON.stringify(latestHits));

    // ###### CHECK IF WE ARE STUCK IN THE LOBBY #######
    if(document.getElementsByTagName("h1")[0].innerHTML.indexOf("Alle Daten werden für dich vorbereitet...") >= 1) {
        debugMe("Wir sind in der Lobby ... Warte " + retryInterval + " Millisekunden und versuch es nochmal");
        window.setTimeout(doWorkOnKIZRawData, retryInterval);
        return;
    }

    // ###### CHECK IF WE SHOULD RUN AT ALL OR NOT #######
    if (operationalStatus === 0) {
        debugMe("Skript ist deaktiviert. Keine Aktionen werden durchgeführt. Neuer Anlauf in " + (retryInterval/1000) + " Sekunden");
        return;
    }

    // ###### OK. LETS DO THE MAGIC ######
    var settings = {
        "url": "https://www.xn--impfterminbersicht-v6b.de/data2",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        var KIZlist = response.split('\n');
        //debugMe("Got data with " + lines.length + " KIZs");

        var KIZsWithSlot = 0;
        var KIZsNoSlot = 0;
        var checkedInBW = 0;
        var hitsOnBlacklist = 0;
        var notOnFavList = 0;
        var alreadyBooked = 0;

        for (var kizentry = 0; kizentry < KIZlist.length; kizentry++) {
        //for (var kizentry = 0; kizentry < 1; kizentry++) { // TEST-CASE-DUMMY-ROW
            var KIZ = KIZlist[kizentry];

            var KIZ_Land = KIZ.split('|')[0];

            if(KIZ_Land === "Baden-Württemberg" && KIZ.split('|')[1].split('§')[3] !== "null") { // KIZ must be in BW and must not be a local doctor
                //debugMe("Check a KIZ in BW");
                checkedInBW++;

                var KIZ_PLZ = parseInt(KIZ.split('|')[1].split('§')[0].split(' ')[0]);
                //var KIZ_PLZ = 72213; // 005 // TEST-CASE-DUMMY-ROW
                //var KIZ_PLZ = 71065; // 229 // TEST-CASE-DUMMY-ROW

                var KIZ_slotsFree = KIZ.split('|')[1].split('§')[1];
                var KIZ_Ort = KIZ.split('|')[1].split('§')[0].split(',')[0].replace(' ','_');
                var KIZ_subdomain = KIZ.split('|')[1].split('§')[4];
                var KIZ_url = "";
                var option;

                if(KIZ_slotsFree === "1") {
                //if(KIZ_slotsFree !== "1") { // TEST-CASE-DUMMY-ROW
                    //debugMe("KIZ " + KIZ_PLZ + " has free slots!! [check = " + KIZ_slotsFree + "]");
                    KIZsWithSlot++;

                    /*
                    var latestHits = {};
                    var plzFavs = [];
                    var alreadySlotGebucht = [];
                    var groupCodes = {};
                    */

                    // check if we that PLZ is on list of favorite PLZs (or if list is empty thus ALL)
                    if(!(plzFavs.includes(KIZ_PLZ)) && plzFavs.length !== 0) {
                        //debugMe("PLZ " + KIZ_PLZ + " is not on non-empty list of Favs, thus do nothing...")
                        notOnFavList++;

                        // check if PLZ may not be on Fav list, but we need a code from that PLZ for our group codes (but not if on temporary blacklist)
                        if(! (KIZ_PLZ in latestHits)) {
                            for (const [key, value] of Object.entries(mapKIZsToPLZs)) {
                                if(value.includes(parseInt(KIZ_PLZ))) {
                                    //debugMe("Group Code for value '" + key + "' = '" + groupCodes[key] + "'");
                                    if(groupCodes[key] === "" || groupCodes[key] === undefined) {
                                        debugMe("Für KIZ PLZ " + KIZ_PLZ + " wollen wir keinen Termin, aber wir brauchen noch einen Code für die Gruppe, also los!");
                                        option = { active: false, insert: undefined };
                                        KIZ_url = "https://" + KIZ_subdomain + ".impfterminservice.de/impftermine/service?plz=" + KIZ_PLZ + "#" + KIZ_Ort + "?autoStartOp=1";
                                        GM_openInTab(KIZ_url, option);
                                        debugMe("Es wurde URL '" + KIZ_url + "' geöffnet");
                                        latestHits[KIZ_PLZ] = Date.now();
                                    }
                                }
                            }
                        }
                        else
                        {
                            hitsOnBlacklist++;
                        }
                    }
                    else {
                        if(plzFavs.includes(KIZ_PLZ)) {
                            //debugMe("PLZ on list of Favs");
                        }
                        else if (plzFavs.length === 0) {
                            //debugMe("List of Favs empty, therefore go for all");
                        }

                        // check if already found and on temporary blacklist
                        if(KIZ_PLZ in latestHits) {
                            debugMe("PLZ " + KIZ_PLZ + " wurde zuletzt am '" + new Date(latestHits[KIZ_PLZ]).toLocaleTimeString() + "' gefunden (= vor " + Math.round(((Date.now() - latestHits[KIZ_PLZ]) / 1000)) + "s). Die temporäre Sperrliste ist auf " + (keepInactiveLimitInMin*60) + " Sekunden gesetzt. Mache also nix...");
                            hitsOnBlacklist++;
                        }
                        else {

                            // check if we already have a meeting at that place
                            if(alreadySlotGebucht.includes(KIZ_PLZ)) {
                                debugMe("PLZ " + KIZ_PLZ + " ist von der Nutzung ausgeschlossen. Mache also nix...");
                                alreadyBooked++;
                            }
                            else {


                                if(!(KIZ_subdomain in groupCodes)) {
                                    debugMe("KIZ Gruppe '" + KIZ_subdomain + "' hat einen freien Slot, ist aber nicht in der Liste gewünschter KIZ Gruppen. Schau dir das mal lieber an!");
                                }
                                else {

                                    latestHits[KIZ_PLZ] = Date.now();
                                    GM_setValue("latestHits",JSON.stringify(latestHits));

                                    var codeForGroup = groupCodes[KIZ_subdomain];
                                    //debugMe("Für die KIZ Gruppe '" + KIZ_subdomain + "' haben wir folgenden Vermittlungscode: '" + codeForGroup + "'");

                                    if(codeForGroup !== "" && codeForGroup !== undefined) {
                                        debugMe("KIZ " + KIZ_PLZ + " in Gruppe " + KIZ_subdomain + " hat einen freien Termin und wir haben dafür den Code: '" + codeForGroup + "' !");
                                        KIZ_url = "https://" + KIZ_subdomain + ".impfterminservice.de/impftermine/suche/" + codeForGroup + "/" + KIZ_PLZ + "#" + KIZ_Ort + "?autoStartOp=1";
                                        GM_openInTab(KIZ_url);
                                        debugMe("Es wurde URL '" + KIZ_url + "' geöffnet");
                                        //if($("input[id='z_Checkbox_SendMails']").prop("checked")) { sendMail(KIZ_PLZ, KIZ_Ort, KIZ_url); }
                                    }
                                    else {
                                        debugMe("KIZ " + KIZ_PLZ + " in der Gruppe " + KIZ_subdomain + " hat einen freien Termin, aber leider haben wir noch keinen Code für diese Gruppe. Also erstmal Vermittlungscode generieren!");
                                        option = { active: false, insert: undefined };
                                        KIZ_url = "https://" + KIZ_subdomain + ".impfterminservice.de/impftermine/service?plz=" + KIZ_PLZ + "#" + KIZ_Ort + "?autoStartOp=1";
                                        GM_openInTab(KIZ_url, option);
                                        debugMe("Es wurde URL '" + KIZ_url + "' geöffnet");
                                        //if($("input[id='z_Checkbox_SendMails']").prop("checked")) { sendMail(KIZ_PLZ, KIZ_Ort, KIZ_url); }
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    KIZsNoSlot++;
                }
            }
            else {
                //debugMe("KIZ not in BW or local doctor");
            }


        }

        debugMe("Habe " + KIZlist.length + " KIZs geprüft. " + checkedInBW + " in BW, " + KIZsWithSlot + " mit Termin (" + hitsOnBlacklist + " temporär gesperrt, " + alreadyBooked + " ausgeschlossen, " + notOnFavList + " kein Favorit). Somit " + KIZsNoSlot + " ohne Termine. // Prüfe neu in " + (retryInterval/1000) + " Sekunden");
    });



}

function doWorkImpfCodeErstellung() {

    if(document.getElementsByTagName("h1")[0].innerHTML.indexOf("Virtueller Warteraum des Impfterminservice") >= 1) {
        debugMe("Wir sind in der Lobby ... Warte " + retryInterval + " Millisekunden und versuch es nochmal");
        window.setTimeout(doWorkImpfCodeErstellung, retryInterval);
        return;
    }



    if (operationalStatus === 0) {
        debugMe("Skript ist deaktiviert. Keine Aktionen werden durchgeführt. Neuer Anlauf in " + (retryInterval/1000) + " Sekunden");
        window.setTimeout(doWorkImpfCodeErstellung, retryInterval);
    }
    else {
        debugMe("Neuer Anlauf, hoffen wir mal das Beste!");

        $( "input[name$='vaccination-approval-checked'][value$='0']" ).click();

        debugMe("Suchen-Button geklickt, warte " + checkHTMLResponseInterval + " ms auf ein Ergebnis");
        window.setTimeout(checkCodeErstellungHTMLForResult, checkHTMLResponseInterval);

        // Cookies akzeptieren
        if($("a[class='cookies-info-close btn kv-btn btn-magenta']")[0]) { $("a[class='cookies-info-close btn kv-btn btn-magenta']")[0].click(); }

    }
}

function checkCodeErstellungHTMLForResult() {

    var placeholderSearching = $("p[class='display-2 animated infinite heartBeat slower icon icon-search']").length;

    if(placeholderSearching >= 1) {
        debugMe("Die Seite sucht noch immer... Prüfe erneut in " + checkHTMLResponseInterval + " ms");
        window.setTimeout(checkCodeErstellungHTMLForResult, checkHTMLResponseInterval);
        return;
    }

    var foundASlot = 0;
    var foundNoSlot = 1;

    if($("div[class='ets-login-form-section-wrapper']")[0].children[0].className === "ets-login-form-section in" || $("div[class='ets-login-form-section-wrapper']")[0].children[0].innerHTML.indexOf("<!---->") < 0 || $("div[class='ets-login-form-section-wrapper']")[0].children[1].outerHTML.indexOf("Es wurden keine freien Termine in Ihrer Region gefunden.") < 0) {
        debugMe("WoW, da scheint was frei zu sein !!");
        foundASlot = 1;
    }
    else {
        debugMe("Sieht aus als wäre hier nichts zu holen...");
        foundASlot = 0;
    }

    if($("div[class='ets-login-form-section-wrapper']")[0].children[1].className === "ets-login-form-section in") {
        debugMe("Sieht aus als wäre hier nichts zu holen...");
        foundNoSlot = 1;
    }
    else {
        debugMe("WoW, da scheint was frei zu sein !!!");
        foundNoSlot = 0;
    }

    if(foundNoSlot === 1 && foundASlot === 0) {
        debugMe("Leider war wohl nichts frei ...");
        // if no other page found a hit at the moment write a -1
        GM_setValue("canGenerateCodeOnPage", ( GM_getValue("canGenerateCodeOnPage",0) + 0 ) ); // increase by nothing
        window.close();
    }
    else {
        debugMe("!! LOS LOS LOS !! Hier geht wohl gerade was !!");
        GM_setValue("canGenerateCodeOnPage", ( GM_getValue("canGenerateCodeOnPage",0) + 1 ) ); // increase by one

        autofillerToDoStep = 1;
        window.setTimeout(doWorkImpfCodeErstellungAutoFiller, 1000);
        toggleTabTitle();

    }
}

function doWorkImpfCodeErstellungAutoFiller() {

    debugMe("Automatische Ausfüllhilfe in Schritt: " + autofillerToDoStep);
    //debugMe($("div[class='container']")[0].innerHTML);
    //debugMe("HTML is:");

    switch (autofillerToDoStep) {
        case 1:
            //debugMe("This is step 1");
            $("input[class='form-check-input ng-untouched ng-pristine ng-invalid']")[0].click();
            autofillerToDoStep++;
            //window.setTimeout(doWorkImpfCodeErstellungAutoFiller, 3000);
            break;
        case 2:
            debugMe("This is step 2");
            $("input[class='form-control text-center ng-pristine ng-valid ng-touched']")[0].value="35";
            //$("input[class='form-control text-center ng-pristine ng-valid ng-touched']")[0].innerText="35";
            //$("input[class='form-control text-center ng-pristine ng-valid ng-touched']")[0].focus();
            //$("input[class='form-control text-center ng-pristine ng-valid ng-touched']")[0].click();
            autofillerToDoStep++;
            window.setTimeout(doWorkImpfCodeErstellungAutoFiller, 1000);
            break;
        case 3:
            debugMe("This is step 3");
            //$("button[class='btn kv-btn btn-magenta text-uppercase d-inline-block']")[0].focus();
            $("button[class='btn kv-btn btn-magenta text-uppercase d-inline-block']").removeAttr('disabled');
            $("button[class='btn kv-btn btn-magenta text-uppercase d-inline-block']")[0].click();
            autofillerToDoStep++;
            window.setTimeout(doWorkImpfCodeErstellungAutoFiller, 1000);
            break;
        case 4:
            debugMe("This is step 4");
            $("input[class='form-control ng-pristine ng-invalid ng-touched']")[0].value = "letustryit@gmail.com";
            autofillerToDoStep++;
            window.setTimeout(doWorkImpfCodeErstellungAutoFiller, 1000);
            break;
        case 5:
            debugMe("This is step 5");
            $("input[class='form-control ng-untouched ng-pristine ng-invalid']")[0].value="17622334455";
            autofillerToDoStep++;
            window.setTimeout(doWorkImpfCodeErstellungAutoFiller, 1000);
            break;
        case 6:
            debugMe("This is step 6");
            $("button[class='btn kv-btn btn-magenta text-uppercase d-inline-block']").removeAttr('disabled');
            $("button[class='btn kv-btn btn-magenta text-uppercase d-inline-block']")[0].click();
            autofillerToDoStep++;
            window.setTimeout(doWorkImpfCodeErstellungAutoFiller, 1000);
            break;
    }

    debugMe("Erledigt, nächster Schritt wird: " + autofillerToDoStep);
}

function doWorkTerminByCodeVerfuegbar() {

    if(document.getElementsByTagName("h1")[0].innerHTML.indexOf("Virtueller Warteraum des Impfterminservice") >= 1) {
        debugMe("Wir sind in der Lobby ... Warte " + retryInterval + " Millisekunden und versuch es nochmal");
        window.setTimeout(doWorkTerminByCodeVerfuegbar, retryInterval);
        return;
    }

    if (operationalStatus === 0) {
        debugMe("Skript ist deaktiviert. Keine Aktionen werden durchgeführt. Neuer Anlauf in " + (retryInterval/1000) + " Sekunden");
        window.setTimeout(doWorkTerminByCodeVerfuegbar, retryInterval);
    }
    else {
        debugMe("Neuer Anlauf, hoffen wir mal das Beste!");

        $("button[class='btn btn-magenta kv-btn kv-btn-round search-filter-button']").click();

        debugMe("Terminsuche gedrückt, warten wir mal " + 7500 + " ms auf ein Ergebnis");
        window.setTimeout(checkTerminByCodeVerfuegbarHTMLForResult, 7500);

        // Cookies akzeptieren
        if($("a[class='cookies-info-close btn kv-btn btn-magenta']")[0]) { $("a[class='cookies-info-close btn kv-btn btn-magenta']")[0].click(); }

    }
}

function checkTerminByCodeVerfuegbarHTMLForResult() {

    var res = $("div[class='ets-booking-content']")[0].innerText.toString().trim();

    var foundASlot = 0;

    /*debugMe("Full modal window:");
    debugMe($("div[class='d-flex flex-column ets-booking-wrapper']")[1].innerHTML);
    debugMe("Text to check:");
    debugMe(res);
    debugMe("Part modal window:");
    debugMe($("div[class='ets-booking-content']")[0].innerHTML);*/

    if(res === 'Derzeit stehen leider keine Termine zur Verfügung.\n\nDie Impfzentren stellen regelmäßig neue Termine ein. Bitte prüfen Sie zu einem späteren Zeitpunkt mit Hilfe Ihres Vermittlungscodes, ob wieder Termine zur Verfügung stehen.\nAUSWÄHLENABBRECHEN') {
    debugMe("Sieht aus als wäre hier nichts zu holen...");
        foundASlot = 0;
    }
    else {
        debugMe("WoW, da scheint was frei zu sein !!!");
        foundASlot = 1;
    }

    if(foundASlot === 0) {
        debugMe("Leider war wohl nichts frei ...");
        // if no other page found a hit at the moment write a -1
        GM_setValue("canBookMeetingOnPage", ( GM_getValue("canBookMeetingOnPage",0) + 0 ) ); // increase by nothing
        window.close();
    }
    else {
        debugMe("!! LOS LOS LOS !! Hier geht wohl gerade was !!");
        GM_setValue("canBookMeetingOnPage", ( GM_getValue("canBookMeetingOnPage",0) + 1 ) ); // increase by nothing
        toggleTabTitle();
    }
}


function toggleTabTitle() {
    if(document.title !== '!! HIER !!') {
        document.title = '!! HIER !!';
    }
    else {
        document.title = '!! TO !! DO !!';
    }
    window.setTimeout(toggleTabTitle, 500);
}

function buildUIGeneral() {
    'use strict';

    var z_div_LogContainer = document.createElement ('div');
    z_div_LogContainer.setAttribute ('id', 'z_Div_LogContainer');
    z_div_LogContainer.setAttribute ('align', 'center');
    document.body.prepend(z_div_LogContainer);

    var z_div_ControlContainer = document.createElement ('div');
    z_div_ControlContainer.setAttribute ('id', 'z_Div_ControlContainer');
    z_div_ControlContainer.setAttribute ('align', 'center');
    document.body.prepend (z_div_ControlContainer);

    var z_textarea_Log = document.createElement('textarea');
    z_textarea_Log.setAttribute('rows', '10');
    z_textarea_Log.setAttribute('cols', '200');
    z_textarea_Log.setAttribute('id', 'z_TextArea_Log');
    z_textarea_Log.setAttribute('style', 'resize: true;');
    z_textarea_Log.setAttribute('style', 'font-size: 10px;');

    z_div_LogContainer.appendChild(z_textarea_Log);

    z_div_ControlContainer.innerHTML += '<button id="z_Button_StartCommand" type="button">Start Script</button>';
    z_div_ControlContainer.innerHTML += '<button id="z_Button_StopCommand" type="button">Stop Script</button>';
    z_div_ControlContainer.innerHTML += '&nbsp;&nbsp;||&nbsp;&nbsp;';
    z_div_ControlContainer.innerHTML += '<button id="z_Button_ClearBlacklist" type="button">Leere Sperrliste</button>';
    //z_div_ControlContainer.innerHTML += 'Retry Interval (ms):'
    z_div_ControlContainer.innerHTML += '<input type="text" id="z_Input_Text_RetryInterval" size="4" name="z_Input_Text_RetryInterval" value="' + retryInterval + '" style="display:none">';
    //z_div_ControlContainer.innerHTML += 'Send mails?: <input type="checkbox" id="z_Checkbox_SendMails" name="z_Checkbox_SendMails" unchecked>';
    //z_div_ControlContainer.innerHTML += '<button id="z_Button_SendTestMail" type="button">Send Test Mail</button>';
    z_div_ControlContainer.innerHTML += '&nbsp;&nbsp;||&nbsp;&nbsp;';
    z_div_ControlContainer.innerHTML += '<button id="z_Button_OpenAllForCookies" type="button">Cookies annehmen</button>';
    z_div_ControlContainer.innerHTML += '&nbsp;&nbsp;||&nbsp;&nbsp;';
    z_div_ControlContainer.innerHTML += '<button id="z_Button_TestSound" type="button">Test Sound</button>';
    z_div_ControlContainer.innerHTML += '<button id="z_Button_StopSound" type="button">Stop Sound</button>';
    z_div_ControlContainer.innerHTML += '&nbsp;(Version: ' + GM_info.script.version + ')';

    document.getElementById ("z_Button_StartCommand").addEventListener ("click", z_myFunc_ReceiveStartCommand, false);
    document.getElementById ("z_Button_StopCommand").addEventListener ("click", z_myFunc_ReceiveStopCommand, false);
    document.getElementById ("z_Button_ClearBlacklist").addEventListener ("click", z_myFunc_ClearBlacklist, false);
    //document.getElementById ("z_Checkbox_SendMails").addEventListener ("click", z_myFunc_ToggleSendMailCheckbox, false);
    //document.getElementById ("z_Button_SendTestMail").addEventListener ("click", sendTestMail, false);
    document.getElementById ("z_Button_OpenAllForCookies").addEventListener ("click", z_myFunc_OpenAllForCookies, false);
    document.getElementById ("z_Button_TestSound").addEventListener ("click", z_myFunc_TestSoundCommand, false);
    document.getElementById ("z_Button_StopSound").addEventListener ("click", z_myFunc_StopSoundCommand, false);

    retryInterval = document.getElementById ("z_Input_Text_RetryInterval").value;

}
function buildUIImpfterminUebersicht() {
    var z_div_ListsArea = document.createElement ('div');

    z_div_ListsArea.setAttribute ('id', 'z_Div_ListsContainer');
    z_div_ListsArea.setAttribute ('align', 'center');
    z_div_ListsArea.setAttribute ('style', 'width: 100%');


    z_div_ListsArea.innerHTML += 'Hilfe benötigt? Mail an <a href="mailto:impfalert@gmail.com">impfalert@gmail.com</a><br/>';
    z_div_ListsArea.innerHTML += '<a href="https://www.impfterminservice.de/assets/static/impfzentren.json">Übersicht der Kreis-Impf-Zentrumen (KIZs) mit PLZ</a> // ';
    z_div_ListsArea.innerHTML += '<a href="https://github.com/iamnotturner/vaccipy/wiki/Ein-Code-fuer-mehrere-Impfzentren">Übersicht der KIZs nach Gruppen</a> ';
    z_div_ListsArea.innerHTML += '<label title=\'Für BW: Gruppe 1 = 001-iz / Gruppe 2 = 002-iz / Gruppe 3 = 229-iz / Gruppe 4 = 005-iz / Gruppe 5 = 003-iz\'> (?)</label> ';
    z_div_ListsArea.innerHTML += '<br/>';


    //z_div_ListsArea.innerHTML += 'Gewünschte KIZ PLZs ([] = alle): <input type="text" style="font-size: 11px" id="z_Input_Text_ListOfKIZsFavs" size="150" name="z_Input_Text_ListOfKIZsFavs" value='[\"72072\"]'><button id="z_Button_ListOfKIZsFavUpdate" type="button">Update</button><br/>';
    z_div_ListsArea.innerHTML += '<label title=\'Format: [ 71272 , 77842 , 86742 ] oder [ ] für "Alle"\'>(?) Favorisierte KIZ PLZs ([ ] = Alle):</label> <input type="text" style="font-size: 11px" id="z_Input_Text_ListOfKIZsFavs" size="150" name="z_Input_Text_ListOfKIZsFavs" value="[ ]"><button id="z_Button_ListOfKIZsFavUpdate" type="button">Update</button><br/>';
    //z_div_ListsArea.innerHTML += 'Bereits gebuchte KIZ PLZs: <input type="text" id="z_Input_Text_ListOfKIZsBooked" size="100" name="z_Input_Text_ListOfKIZsBooked" value=\'["72072"]\'><button id="z_Button_ListOfKIZsBookedUpdate" type="button">Update</button><br/>';
    z_div_ListsArea.innerHTML += '<label title=\'Format: [ 71272 , 77842 , 86742 ] oder [ ]\'>(?) Ausgeschlossene KIZ PLZs:</label> <input type="text" id="z_Input_Text_ListOfKIZsBooked" size="100" name="z_Input_Text_ListOfKIZsBooked" value="[ ]"><button id="z_Button_ListOfKIZsBookedUpdate" type="button">Update</button><br/>';
    //z_div_ListsArea.innerHTML += 'KIZ-Gruppen Codes: <input type="text" id="z_Input_Text_KIZGroupCodes" style="font-size: 11px" size="150" name="z_Input_Text_KIZGroupCodes" value=\'{"229":"YRZT-GHCP-JQH8","001":"","002":"TX8A-G7PP-CUNX","003":"","005":"NNZ8-A7QY-ZCNR"}\'><button id="z_Button_KIZGroupCodesUpdate" type="button">Update</button><br/>';
    z_div_ListsArea.innerHTML += '<label title=\'Format: { "001-iz" : "CODE-NUMB-ER01" , "002-iz" : "" , "003-iz" : "" , "005-iz" : "CODE-NUMB-ER03" , "229-iz" : "" }\'>(?) KIZ-Gruppen Vermittlungscodes</label>: <input type="text" id="z_Input_Text_KIZGroupCodes" style="font-size: 11px" size="150" name="z_Input_Text_KIZGroupCodes" value=""><button id="z_Button_KIZGroupCodesUpdate" type="button">Update</button><br/>';

    document.getElementById("z_Div_LogContainer").appendChild(z_div_ListsArea);

    document.getElementById("z_Button_ListOfKIZsFavUpdate").addEventListener("click", z_myFunc_UpdateSettingKIZPLZFavs, false);
    document.getElementById("z_Button_ListOfKIZsBookedUpdate").addEventListener("click", z_myFunc_UpdateSettingKIZsAlreadyBooked, false);
    document.getElementById("z_Button_KIZGroupCodesUpdate").addEventListener("click", z_myFunc_UpdateSettingKIZGroupCodes, false);

}

function z_myFunc_ReceiveStartCommand(){ debugMe("Aktueller Betriebszustand ist: '" + operationalStatus + "', setze ihn nun auf 1"); operationalStatus = 1;}
function z_myFunc_ReceiveStopCommand(){ debugMe("Aktueller Betriebszustand ist: '" + operationalStatus + "', setze ihn nun auf 0"); operationalStatus = 0;}
function z_myFunc_ClearBlacklist(){ debugMe("Aktuelle Anzahl Einträge auf der temporären Sperrliste: '" + Object.keys(latestHits).length); latestHits = {}; debugMe("Neue Anzahl Einträge auf der temporären Sperrliste: '" + Object.keys(latestHits).length); }
function z_myFunc_ToggleSendMailCheckbox() { debugMe("Toggled 'Do also send mail on hit' to " + $("input[id='z_Checkbox_SendMails']").prop("checked")); GM_setValue("SendMailOnHit",$("input[id='z_Checkbox_SendMails']").prop("checked"));}
function z_myFunc_TestSoundCommand(){playSound = 1;playEndlessSound();}
function z_myFunc_StopSoundCommand(){playSound = 0;}
function z_myFunc_OpenAllForCookies(){
    var infotext = "Es werden nun alle relevanten Seiten im Hintergrund geöffnet. Bitte jeweils die Cookies annehmen (falls nicht bereits früher schon passiert) und die Seite einfach wieder schließen. Falls ihr im Warteraum landet bitte später wiederholen.";
    debugMe(infotext);
    alert(infotext);
    GM_openInTab("https://www.impfterminservice.de/impftermine");
    GM_openInTab("https://001-iz.impfterminservice.de/impftermine");
    GM_openInTab("https://002-iz.impfterminservice.de/impftermine");
    GM_openInTab("https://003-iz.impfterminservice.de/impftermine");
    GM_openInTab("https://005-iz.impfterminservice.de/impftermine");
    GM_openInTab("https://229-iz.impfterminservice.de/impftermine");
}

function z_myFunc_UpdateSettingKIZGroupCodes() {
    try {
        groupCodes = JSON.parse($("input[id='z_Input_Text_KIZGroupCodes']")[0].value);
        GM_setValue("KIZgroupCodes",JSON.stringify(groupCodes));
        debugMe("Habe " + Object.keys(groupCodes).length + " Einträge in die Liste der KIZ Vermittlungscodes geladen.");
    }
    catch {
        var msg = "!!!! Fehler beim Speichern der KIZ Gruppen Vermittlungscodes !!!!";
        alert(msg);
        debugMe(msg);
    }
}
function z_myFunc_LoadSettingKIZGroupCodes() {
    $("input[id='z_Input_Text_KIZGroupCodes']")[0].value = GM_getValue("KIZgroupCodes","{ \"001-iz\" : \"\" , \"002-iz\" : \"\" , \"003-iz\" : \"\" , \"005-iz\" : \"\" , \"229-iz\" : \"\" }");
    z_myFunc_UpdateSettingKIZGroupCodes();
}


function z_myFunc_UpdateSettingKIZPLZFavs() {
    try {
        var plzFavs_t = JSON.parse($("input[id='z_Input_Text_ListOfKIZsFavs']")[0].value);
        plzFavs = [];
        for (var item = 0; item < plzFavs_t.length; item++) {
            plzFavs.push(parseInt(plzFavs_t[item]));
        }
        GM_setValue("KIZplzFavs",JSON.stringify(plzFavs));
        debugMe("Habe " + plzFavs.length + " Einträge in die KIZ Favoriten Liste geladen");

        var listOfNeededGrps = {};

        // if list of favs is empty push all keys in array
        if(plzFavs.length===0) {
            for (const [key, value] of Object.entries(mapKIZsToPLZs)) {
                listOfNeededGrps[key] = "";

            }
        }
        else {
            for (var plz = 0; plz < plzFavs.length; plz++) {
                for (const [key, value] of Object.entries(mapKIZsToPLZs)) {
                    if(value.includes(plzFavs[plz])) {
                        //console.log("PLZ " + plzFavs[plz] + " in Gruppe " + key);
                        listOfNeededGrps[key] = "";
                    }
                }
            }
        }

        debugMe("Für die gewählten KIZ PLZ Favoriten ergibt sich folgende KIZ Group Code Liste: " + JSON.stringify(listOfNeededGrps));
    }
    catch {
        var msg = "!!!! Fehler beim Speichern der KIZ PLZ Favoriten !!!!";
        alert(msg);
        debugMe(msg);
    }
}
function z_myFunc_LoadSettingKIZPLZFavs() {
    $("input[id='z_Input_Text_ListOfKIZsFavs']")[0].value = GM_getValue("KIZplzFavs","[]");
    z_myFunc_UpdateSettingKIZPLZFavs();
}

function z_myFunc_UpdateSettingKIZsAlreadyBooked() {
    try {
        var alreadySlotGebucht_t = JSON.parse($("input[id='z_Input_Text_ListOfKIZsBooked']")[0].value);
        alreadySlotGebucht = [];
        for (var item = 0; item < alreadySlotGebucht_t.length; item++) {
            alreadySlotGebucht.push(parseInt(alreadySlotGebucht_t[item]));
        }
        GM_setValue("KIZalreadyBooked",JSON.stringify(alreadySlotGebucht));
        debugMe("Habe " + alreadySlotGebucht.length + " Einträge in die Liste der auszuschließenden KIZ PLZs geladen.");
    }
    catch {
        var msg = "!!!! Fehler beim Speichern der auszuschließenden KIZ PLZ !!!!";
        alert(msg);
        debugMe(msg);
    }
}
function z_myFunc_LoadSettingKIZsAlreadyBooked() {
    $("input[id='z_Input_Text_ListOfKIZsBooked']")[0].value = GM_getValue("KIZalreadyBooked","[]");
    z_myFunc_UpdateSettingKIZsAlreadyBooked();
}

function z_myFunc_LoadSettingSendMailOption() {
    // NEEDS WORK !!!
    //$("input[id='z_Checkbox_SendMails']")[0].value = GM_getValue("SendMailOnHit","true");
}

function z_myFunc_LoadSettingLatestHits() {
    latestHits = JSON.parse(GM_getValue("latestHits","{}"));
    debugMe("Einträge der temporären Sperrliste geladen mit: " + JSON.stringify(latestHits));
}


function playEndlessSound(){
    if(playSound === 1) {
        alrtSound.play();
        window.setTimeout(playEndlessSound, 500);
    }
}

function getFormattedDate() {
    var date = new Date();
    var month = date.getMonth() + 1;   var day = date.getDate();  var hour = date.getHours();  var min = date.getMinutes(); var sec = date.getSeconds();
    month = (month < 10 ? "0" : "") + month; day = (day < 10 ? "0" : "") + day; hour = (hour < 10 ? "0" : "") + hour; min = (min < 10 ? "0" : "") + min; sec = (sec < 10 ? "0" : "") + sec;
    var str = date.getFullYear() + "-" + month + "-" + day + "_" + hour + ":" + min + ":" + sec;
    return str;
}

function debugMe(text) {
    document.getElementById ("z_TextArea_Log").innerHTML = getFormattedDate() + " : " + text + "&#10;" + document.getElementById ("z_TextArea_Log").innerHTML;
}

/*
   #################
   ### GRAVEYARD ###
   #################
*/

/*

var Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };

function sendMail(plz, ort, url) {
    Email.send({
        Host: "smtp.gmail.com",
        Username: "yourSenderMailHere@gmail.com",
        Password: "yourPasswordHere",
        To: 'yourTargetMailHere@gmail.com',
        From: "yourSenderMailHere@gmail.com",
        Subject: "New Impfslot available !!",
        Body: "New Impfslot for PLZ: " + plz + " (" + ort + ") with url " + url,
      })
        .then(function (message) {
          debugMe("Mail sent successfully for PLZ " + plz + " and Ort " + ort)
        });
}

function sendTestMail() {
    sendMail("12345","Testorthausen","https://www.google.de");
}
*/
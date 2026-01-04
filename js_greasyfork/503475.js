// ==UserScript==
// @name         iaomaiData
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Modifica la funzione setLogin per l'applicazione specificata
// @author       Flejta
// @match        https://www.iaomai.app/app/v*
// @grant        none
// ==UserScript==
// @name         iaomaiData
// @namespace    http://tampermonkey.net/
// @description  Modifica la funzione setLogin per l'applicazione specificata
// @author       Flejta
// @match        *://*/*  // Modifica questa riga per adattarla al dominio specifico dove vuoi che lo script funzioni
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503475/iaomaiData.user.js
// @updateURL https://update.greasyfork.org/scripts/503475/iaomaiData.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Sostituisce la funzione LOGIN.setLogin
    LOGIN.setLogin = function(txt) {
        if (!txt || txt.substr(0, 3) == '404') {
            if (!LOGIN.logedout) {
                LOGIN.logedout = false;
                ALERT(TXT("ErroreLogin"));
            } else {
                LOGIN.logedout = false;
            }
            document.getElementById("login").classList.remove("popup_back");
            document.getElementById("btnRecupero").style.display = 'block';
        } else {
            let jsn = JSON.parse(txt);
            let Nuovo = jsn.data.Nuovo;
            if (__(jsn.upgrade_info, false)) MENU.visFeatures();
            delete jsn.data.Nuovo;
            if (__(jsn.errConn)) {
                MENU.chiudiMenu();
                SCHEDA.scaricaScheda();
                MENU.visDispositivi(JSON.stringify(jsn.data));
                return;
            }
            jsn.ExpDate = '2041632000'; // Modifica la data di scadenza
            txt = JSON.stringify(jsn);
            DB._reset();
            if (document.querySelector(".listaPazienti")) applicaLoading(document.querySelector(".listaPazienti"));
            applicaLoading(document.querySelector(".listaFornitori"));
            applicaLoading(document.querySelector(".listaServizi"));
            applicaLoading(document.querySelector(".listaAnnotazioni"));
            localStorage.RimaniConnesso = document.getElementById("stayConnected").checked;

            LOGIN.salvaToken(txt);
            LOGIN.tmAttesaLogin = setInterval(function () {
                if (LOGIN.logedin()) {
                    clearInterval(LOGIN.tmAttesaLogin);
                    LOGIN.tmAttesaLogin = null;
                    if (!LOGIN.retIni) SYNCRO.globalSync(false, false, Nuovo);
                    setTimeout(function () {
                        LOGIN.scriviUtente();
                    }, 1000);
                    document.getElementById("login").classList.remove("popup_back");

                    document.getElementById("notLogged").classList.remove("visSch");
                    MENU.chiudiMenu();
                    MODELLO.filtraAnatomia();
                    try {
                        SET.filtraSet();
                    } catch (err) {}
                    PAZIENTI.deselPaziente();

                    LOGIN.attesaVer = true;
                    let auths = LOGIN.verMonoApp(),
                        selSet = false;
                    if (globals.set.cartella && !auths.length) {
                    } else {
                        if (auths.length > 1 && !__(localStorage.set)) {
                            selSet = true;
                        }
                    }

                    PAZIENTI.cancellaFiltri(true);
                    SCHEDA.scaricaScheda();
                    if (!selSet || !smartMenu) {
                        LOGIN.verAuthSet();
                    } else {
                        MENU.visSplashMaps();
                        LOGIN.attesaVer = false;
                    }
                    LOGIN.avviaVerToken();
                    APP_RATING.update();
                }
            }, 500);
        }
    };

})();

// ==/UserScript==

(function() {
    'use strict';

    // Sostituisce la funzione LOGIN.setLogin
    LOGIN.setLogin = function(txt) {
        if (!txt || txt.substr(0, 3) == '404') {
            if (!LOGIN.logedout) {
                LOGIN.logedout = false;
                ALERT(TXT("ErroreLogin"));
            } else {
                LOGIN.logedout = false;
            }
            document.getElementById("login").classList.remove("popup_back");
            document.getElementById("btnRecupero").style.display = 'block';
        } else {
            let jsn = JSON.parse(txt);
            let Nuovo = jsn.data.Nuovo;
            if (__(jsn.upgrade_info, false)) MENU.visFeatures();
            delete jsn.data.Nuovo;
            if (__(jsn.errConn)) {
                MENU.chiudiMenu();
                SCHEDA.scaricaScheda();
                MENU.visDispositivi(JSON.stringify(jsn.data));
                return;
            }
            jsn.ExpDate = '2041632000'; // Modifica la data di scadenza
            txt = JSON.stringify(jsn);
            DB._reset();
            if (document.querySelector(".listaPazienti")) applicaLoading(document.querySelector(".listaPazienti"));
            applicaLoading(document.querySelector(".listaFornitori"));
            applicaLoading(document.querySelector(".listaServizi"));
            applicaLoading(document.querySelector(".listaAnnotazioni"));
            localStorage.RimaniConnesso = document.getElementById("stayConnected").checked;

            LOGIN.salvaToken(txt);
            LOGIN.tmAttesaLogin = setInterval(function () {
                if (LOGIN.logedin()) {
                    clearInterval(LOGIN.tmAttesaLogin);
                    LOGIN.tmAttesaLogin = null;
                    if (!LOGIN.retIni) SYNCRO.globalSync(false, false, Nuovo);
                    setTimeout(function () {
                        LOGIN.scriviUtente();
                    }, 1000);
                    document.getElementById("login").classList.remove("popup_back");

                    document.getElementById("notLogged").classList.remove("visSch");
                    MENU.chiudiMenu();
                    MODELLO.filtraAnatomia();
                    try {
                        SET.filtraSet();
                    } catch (err) {}
                    PAZIENTI.deselPaziente();

                    LOGIN.attesaVer = true;
                    let auths = LOGIN.verMonoApp(),
                        selSet = false;
                    if (globals.set.cartella && !auths.length) {
                    } else {
                        if (auths.length > 1 && !__(localStorage.set)) {
                            selSet = true;
                        }
                    }

                    PAZIENTI.cancellaFiltri(true);
                    SCHEDA.scaricaScheda();
                    if (!selSet || !smartMenu) {
                        LOGIN.verAuthSet();
                    } else {
                        MENU.visSplashMaps();
                        LOGIN.attesaVer = false;
                    }
                    LOGIN.avviaVerToken();
                    APP_RATING.update();
                }
            }, 500);
        }
    };

})();

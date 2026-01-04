// ==UserScript==
// @name         OrarioTP
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  Script per calcolare alcuni orari in TimePicker
// @author       Matteo Avesani
// @icon         https://www.comune.verona.it/portale/images/verona/favicon.ico
// @match        https://cartellino.comune.verona.it/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507960/OrarioTP.user.js
// @updateURL https://update.greasyfork.org/scripts/507960/OrarioTP.meta.js
// ==/UserScript==

(function () {
    const cercaPaginaTP = document.querySelector("#mainPanelDipendente"),
        intervalloRicerca = setInterval(() => new CalcolaOrario().cercaPaginaCartellino(), 1000); //Ogni secondo chiamo la classe

    class CalcolaOrario {
        constructor() {
            this.cercaPaginaTP = cercaPaginaTP;
            this.tabellaOrario = this.cercaPaginaTP.querySelector("table.tab_fcal");
        }

        cercaPaginaCartellino() {
            //Controllo se sono nella pagina corretta
            if (this.cercaPaginaTP.textContent.includes("Gestione giornate")) {
                clearInterval(intervalloRicerca);
                this.nuovaColonna();
                this.impostaOrario();
            }
        }

        impostaOrario() {
            const dataOggi = () => {
                    let dataTemp = new Date();
                    dataTemp = dataTemp.toLocaleDateString(
                        "ko-KR", //Data formattata anno-mese-anno
                        {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                        }
                    );
                    dataTemp = dataTemp.replace(new RegExp(". ", "g"), "").replace(".", ""); //Sostituisco ciò che non mi serve
                    return dataTemp;
                },
                rigaOggi = this.tabellaOrario.querySelector(`tr[id $= '${dataOggi()}']`), //Cerco il tag tr con id che termina con data di oggi (AAAAMMGG)
                cellaTimbrature = rigaOggi.querySelectorAll("td")[3],
                cellaDiff = rigaOggi.querySelectorAll("td")[8],
                cellaUscita = rigaOggi.querySelectorAll("td")[9],
                elencoTimbrature = cellaTimbrature.querySelectorAll("span"),
                cellaOrarioUscita = document.createElement("span");
            let listaMovimenti = [],
                listaMovimentiData = [],
                listaMovimentiDataTemp = [];

            //Creo un array con i dati dei movimenti del cartellino
            for (let i = 0; i < elencoTimbrature.length; i++) {
                if (elencoTimbrature[i].textContent.includes("E")) {
                    listaMovimenti.push(elencoTimbrature[i].textContent.split(/(E)/).filter(Boolean));
                }
                if (elencoTimbrature[i].textContent.includes("U")) {
                    listaMovimenti.push(elencoTimbrature[i].textContent.split(/(U)/).filter(Boolean));
                }
                listaMovimentiDataTemp = {
                    data: new Date(new Date().setHours(listaMovimenti[i][0].split(":")[0], listaMovimenti[i][0].split(":")[1])),
                    tipoMovimento: listaMovimenti[i][1],
                };
                listaMovimentiData.push(listaMovimentiDataTemp);
            }
            //se il primo movimento è una entrata, inizio a calcolare l'orario d'uscita
            if (listaMovimentiData[0].tipoMovimento == "E") {
                const preparaOrarioDiff = cellaDiff.textContent.replace("- ", "").split(":"),
                    orarioDiff = new Date(new Date().setHours(preparaOrarioDiff[0], preparaOrarioDiff[1])); //Preparo in formato data la differenza d'orario
                let orarioUscita = new Date(listaMovimentiData[0].data);

                orarioUscita.setHours(listaMovimentiData[0].data.getHours() + orarioDiff.getHours());

                //Se trovo un'uscita subito dopo (pausa), aggiungo anche questa
                if (listaMovimentiData[1] && listaMovimentiData[1].tipoMovimento == "U") {
                    let orarioPausaDiff = new Date(listaMovimentiData[2].data - listaMovimentiData[1].data);
                    if (orarioPausaDiff.getMinutes() < 30) orarioPausaDiff = new Date(new Date().setMinutes(30));
                    orarioUscita.setMinutes(orarioUscita.getMinutes() + orarioPausaDiff.getMinutes());
                }

                //Imposto l'orario in formato HH:MM
                cellaOrarioUscita.textContent = orarioUscita.toLocaleString("it-IT", {
                    hour: "2-digit",
                    minute: "2-digit",
                });
                cellaUscita.style.width = "40px";
                cellaUscita.style.paddingRight = "5px";
                cellaUscita.setAttribute("align", "right");
                cellaOrarioUscita.style.color = "green";
                cellaUscita.append(cellaOrarioUscita);
            }
        }

        //Metodo per costruire la nuova colonna dove andrà a fine l'orario d'uscita
        nuovaColonna() {
            const nuovaCellaIntestazione = document.createElement("th"),
                cellaDiff = getElementsByText("Diff.", "th"),
                righeTabella = this.tabellaOrario.querySelectorAll("tr");

            nuovaCellaIntestazione.style.width = "40px";
            nuovaCellaIntestazione.style.borderLeft = "0px";
            nuovaCellaIntestazione.textContent = "Usci.";
            cellaDiff[0].insertAdjacentElement("afterend", nuovaCellaIntestazione); //Inserisco l'intestazione

            //Ciclo per la creazione delle celle
            for (let i = 1; i < righeTabella.length; i++) {
                righeTabella[i].querySelectorAll("td")[8].insertAdjacentElement("afterend", document.createElement("td"));
            }
        }
    }

    function getElementsByText(str, tag = "a") {
        return Array.prototype.slice.call(document.getElementsByTagName(tag)).filter((el) => el.textContent.trim() === str.trim());
    }
})();
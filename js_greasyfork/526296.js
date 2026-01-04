// ==UserScript==
// @name         Scalable Capital Depot Export
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Userscript, das den Download des aktuellen Depots bei Scalable Capital als CSV-Datei erlaubt.
// @author       https://github.com/lime-scripts
// @license MIT
// @match        https://de.scalable.capital/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scalable.capital
// @grant      GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/526296/Scalable%20Capital%20Depot%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/526296/Scalable%20Capital%20Depot%20Export.meta.js
// ==/UserScript==

(function () {
    'use strict';


    GM_registerMenuCommand("Export Depot CSV", function () {
        const positions = findPositions();
        const csv = toCsv(positions);
        downloadCsv(csv, "ScalableNeu_depot_export_" + (new Date().toISOString().split(".")[0]) + ".csv");
    });


    function isObject(obj) {
        return typeof obj === 'object' && obj !== null;
    }


    function findPositions() {

        let resultsMap = {};

        function visit(node) {
            if (!node) {
                return;
            }
            else if (Array.isArray(node)) {
                for (const subNode of node) {
                    visit(subNode);
                }
            }
            else if (isObject(node)) {
                if (node["isin"] && node["inventory"]) {
                    resultsMap[node["isin"]] = { ...node };
                }
                else {
                    for (const key of Object.keys(node)) {
                        if (["children", "props", "security", "items"].includes(key) || key.startsWith("__reactProps")) {
                            visit(node[key]);
                        }
                    }
                }
            }
            if (node.childNodes) {
                node.childNodes.forEach(n => { visit(n); });
            }
        }

        visit(document.body);
        const positions = Array.from(Object.values(resultsMap)).map(pos => ({ isin: pos.isin, name: pos.name, amount: pos.inventory.position?.filled, price: pos.inventory.position?.fifoPrice, data: pos }));
        positions.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
        console.log(positions);
        console.log(positions.length, "Positionen");
        return positions;
    }


    function toCsv(rows) {
        const SEP = ";";
        const LINE_SEP = "\n";
        const csvRows = [];
        for (let i = -1; i < rows.length; i++) {
            const row = rows[i];
            const csvRow = Array(4).fill("");
            csvRow[0] = i >= 0 ? row.name : "Name";
            csvRow[1] = i >= 0 ? row.isin : "ISIN";
            csvRow[2] = i >= 0 ? "" + row.amount : "Anzahl";
            csvRow[3] = i >= 0 ? "" + row.price : "Preis";
            csvRows.push(csvRow);
        }
        const csv = csvRows.map(row => row.map(val => val.replaceAll(SEP, "")).join(SEP)).join(LINE_SEP);
        return csv;
    }


    function toCsvBaader(rows) {
        const SEP = ";";
        const LINE_SEP = "\n";
        const COL_COUNT = 63;
        const HEADER = "XXX-LFDNR;XXX-SNR;XXX-PFNR;XXX-DENR;XXX-DENR-EXT;XXX-DEPSPERR;XXX-WPBEZK;XXX-WPBEZ1;XXX-WPBEZ2;XXX-WPBEZ3;XXX-WPBEZ4;XXX-WPNR;XXX-WPNRID-D;XXX-WPNRID-DBOE;XXX-KONTNR;XXX-KONTRAKT;XXX-DATFAELL;XXX-STRIKE;XXX-KZCP;XXX-SERIE;XXX-NOTIER;XXX-WHG;XXX-NW-M;XXX-NWSP-M;XXX-EINKURS-M;XXX-AKTKURS-M;XXX-AKTKURSD-M;XXX-KW-M;XXX-KWB-M;XXX-ABGR-M;XXX-ABGRB-M;XXX-FAKTORI;XXX-FAKTORP;XXX-EINKURSB-M;XXX-KONTBEZ;XXX-DEPOTLANG;XXX-NAME1;XXX-NAME2;XXX-MONJAHR;XXX-KURSB;XXX-KFAKTOR;XXX-BEWMET;XXX-PRAENOT;XXX-TUVIP;XXX-WPENDF;XXX-PFBEZ1;XXX-PFBEZ2;XXX-UNDERLYING;XXX-DATUM;XXX-VVSNR;XXX-WPART;XXX-UNDERU;XXX-BLOOMBERGK;XXX-VERFALLSTAG;XXX-VERSIONSNUMM;XXX-AUSUEBUNG;XXX-NWJUR-M;XXX-UTIPOS;XXX-KURSEIND-M;XXX-KWEEUR-M;XXX-KWBEL;XXX-KWBELB";
        const csvRows = [];
        let rowCounter = 0;
        for (const row of rows) {
            rowCounter++;
            const csvRow = Array(COL_COUNT).fill("");
            csvRow[0] = "" + rowCounter;
            csvRow[7] = row.name;
            csvRow[11] = row.isin;
            csvRow[22] = ("" + row.amount).replaceAll(".", ",");
            csvRow[24] = ("" + row.price).replaceAll(".", ",");
            csvRows.push(csvRow);
        }
        const csv = HEADER + LINE_SEP + csvRows.map(row => row.map(val => val.replaceAll(SEP, "")).join(SEP)).join(LINE_SEP);
        return csv;
    }


    function downloadCsv(csv, filename) {
        const data = "data:text/csv;charset=utf-8," + csv;
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(data));
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
    }

})();
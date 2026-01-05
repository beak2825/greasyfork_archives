// ==UserScript==
// @name         EdenRed to QIF
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  export your EdenRed transactions to a QIF File
// @author       alemat13
// @match        https://www.myedenred.fr/Card/Transaction*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28850/EdenRed%20to%20QIF.user.js
// @updateURL https://update.greasyfork.org/scripts/28850/EdenRed%20to%20QIF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // MODEL //
    HTMLTableRowElement.prototype.getDate = function() {
        var myDate = new Date();
        var myDateTab = this.cells[1].innerText.split("/");
        myDate.setMonth(myDateTab[1]-1);
        myDate.setDate(myDateTab[0]);
        if(myDate>Date.now()) myDate.setFullYear(myDate.getFullYear()-1);
        var hours = this.cells[2].firstElementChild.innerText.trim().split("\n")[0].split(" - ")[0].split('h');
        myDate.setHours(hours[0],hours[1],0);
        return myDate;
    };
    HTMLTableRowElement.prototype.isConfirmed = function() {
        if (this.cells[3].innerText.match(/transaction confirmée.*/)) return true;
        return false;
    };
    HTMLTableRowElement.prototype.getMontant = function() {
        return this.cells[4].innerText.replace(' ','').replace('€','').replace(',','.').split("\n")[0];
    };
    HTMLTableRowElement.prototype.getLabel = function() {
        return this.cells[2].firstElementChild.innerText.trim().split("\n")[0].split(" - ")[1].trim();
    };
    HTMLTableRowElement.prototype.getMemo = function() {
        return this.cells[2].firstElementChild.innerText.trim().split("\n")[1] || '';
    };
    // VIEW //
    var QIFTransaction = function(date, montant, label, memo) {
        this.date = date;
        this.montant = montant;
        this.label = label;
        this.memo = memo;
    };
    QIFTransaction.prototype.toString = function() {
        var str = "";
        str += "D" + this.date.toLocaleDateString() + "\n";
        str += "T" + this.montant + "\n";
        str += "P" + this.label + "\n";
        str += "M" + this.memo + "\n";
        return str;
    };
    var QIFFile = function() {
        this.header = "!Type:Bank";
        this.transactionsList = [];
    };
    QIFFile.prototype.addTransaction = function(transaction) {
        this.transactionsList.push(transaction);
    };
    QIFFile.prototype.toString = function() {
        var str = this.header + "\n";
        for(var i = 0; i < this.transactionsList.length; i++) {
            str += this.transactionsList[i].toString() + "^\n";
        }
        return str;
    };
    QIFFile.prototype.sortByDate = function() {
        this.transactionsList.sort(function(a,b) {return a.date-b.date;});
    };
    // CONTROLLER //
    var EdenRed = {
        loadTransactions:  function() {
            var debits = null;
            var myQIF = new QIFFile();
            document.getElementsByClassName("ui-tabs-anchor")['ui-id-1'].click();
            debits = document.getElementsByClassName("table table-transaction")[0].rows;//n].rows;
            for (var i = 0; i<debits.length; i++) {
                if (debits[i].isConfirmed()) { //2
                    myQIF.addTransaction(new QIFTransaction(
                        debits[i].getDate(),
                        debits[i].getMontant(),
                        debits[i].getLabel(),
                        debits[i].getMemo() + " - " + debits[i].getDate().toLocaleString("fr-FR",{
                            weekday: "long",
                            day:"numeric",
                            month: "long",
                            year: "numeric",
                            hour:"2-digit",
                            minute: "2-digit"
                        })
                    ));
                }
            }
            myQIF.sortByDate();
            return myQIF;
        },
        onload: function() {
            var download = document.createElement('a');
            download.href = "#";
            download.onclick = function() {
                download.setAttribute(
                    'href',
                    "data:text/plain;charset=utf-8,"+encodeURIComponent(EdenRed.loadTransactions().toString()));
                download.setAttribute(
                    'download',
                    "ExportEdenRed"+(new Date().toISOString())+".qif");
                //download.click();
            };
            download.innerText = "Télécharger QIF";
            document.getElementsByClassName('line bl')[0].appendChild(download);
        }
    };
    EdenRed.onload();
})();
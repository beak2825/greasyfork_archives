// ==UserScript==
// @name         Moodle Optimizer
// @namespace    http://tampermonkey.net/
// @version      0.80
// @description  Automatisches ausfüllen der standard-Daten und Erstellung eines Gerüsts für den Hausaufgabenlog auf moodle.bbbaden.ch.
// @author       Dan6erbond
// @match        https://moodle.bbbaden.ch/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371412/Moodle%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/371412/Moodle%20Optimizer.meta.js
// ==/UserScript==

const tätigkeiten = ["Nichts.", "Repetition.", "Übungen."]

var editor = null;
var tätigkeitenPrompt = null;
var arbeitsaufwandPrompt = null;
var gelerntesPrompt = null;
var offeneFragenPrompt = null;

var min = 40;
var max = 200;

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

setTimeout(function(){firstFunction();}, 500);

function firstFunction(){
	var hausaufgabenButton = getElementByXpath("//*[@id=\"region-main\"]/div/div[3]/div/form/div/input[1]")
    if (hausaufgabenButton != null){
        var newButton = hausaufgabenButton.cloneNode(true);
        newButton.onclick = function(){
            document.location.href = "https://moodle.bbbaden.ch/mod/journal/edit.php?id=" + new URL(document.location.href).searchParams.get("id") + "&popup=true";
        };
        newButton.value = "Eintrag hinzufügen";
        hausaufgabenButton.parentNode.parentNode.parentNode.append(newButton);
    }

    var loginButton = getElementByXpath("//*[@id=\"submit\"]");
    if (loginButton != null)
        loginButton.click();

    var confirmButton = getElementByXpath("//*[@id=\"loginbtn\"]");
    if (confirmButton != null)
        confirmButton.click();
}

setTimeout(function(){checkForEditor();}, 1000);

function checkForEditor(){
    editor = document.getElementById("id_text_editoreditable");

    if (editor != null && new URL(document.location.href).searchParams.get("popup") == "true"){
        var tätigkeit = tätigkeiten[Math.floor(Math.random() * tätigkeiten.length)];
        tätigkeitenPrompt = prompt("Tätigkeiten:", tätigkeit);
        var minutes = Math.round(Math.floor(Math.random() * max + min) / 10) * 10;

        var stunden = Math.floor(minutes / 60);
        var minuten = minutes - stunden * 60;

        var promptText = stunden != 0 ? stunden + " Stunden " + minuten + " Minuten" : minuten + " Minuten"

        arbeitsaufwandPrompt = prompt("Arbeitsaufwand:", promptText);
        gelerntesPrompt = prompt("Gelerntes:", "Nichts.");
        offeneFragenPrompt = prompt("Offene Fragen:", "Keine.");

        if (tätigkeitenPrompt == null || arbeitsaufwandPrompt == null || gelerntesPrompt == null || offeneFragenPrompt == null)
            return;
		
        fillOutLog();		
    }
}

function fillOutLog(){
    var d = new Date();
    var dateString = d.getDate() + "." + (d.getMonth()+1) + "." + d.getFullYear();

    var header = document.createElement("p");
    var headerChild = document.createElement("b");
    headerChild.innerHTML = "Hausaufgabenlog vom " + dateString;
    header.appendChild(headerChild);

    var text = document.createElement("p");
    var list = document.createElement("ul");

    var tätigkeiten = document.createElement("li");
    var tätigkeitenTitel = document.createElement("b");
    tätigkeitenTitel.innerHTML = "Tätigkeiten: ";
    var tätigkeitenText = document.createTextNode(tätigkeitenPrompt);
    tätigkeiten.appendChild(tätigkeitenTitel);
    tätigkeiten.appendChild(tätigkeitenText);

    var arbeitsaufwand = document.createElement("li");
    var arbeitsaufwandTitel = document.createElement("b");
    arbeitsaufwandTitel.innerHTML = "Arbeitsaufwand: ";
    var arbeitsaufwandText = document.createTextNode(arbeitsaufwandPrompt);
    arbeitsaufwand.appendChild(arbeitsaufwandTitel);
    arbeitsaufwand.appendChild(arbeitsaufwandText);

    var gelerntes = document.createElement("li");
    var gelerntesTitel = document.createElement("b");
    gelerntesTitel.innerHTML = "Gelerntes: ";
    var gelerntesText = document.createTextNode(gelerntesPrompt);
    gelerntes.appendChild(gelerntesTitel);
    gelerntes.appendChild(gelerntesText);

    var offeneFragen = document.createElement("li");
    var offeneFragenTitel = document.createElement("b");
    offeneFragenTitel.innerHTML = "Offene Fragen: ";
    var offeneFragenText = document.createTextNode(offeneFragenPrompt);
    offeneFragen.appendChild(offeneFragenTitel);
    offeneFragen.appendChild(offeneFragenText);

    list.appendChild(tätigkeiten);
    list.appendChild(arbeitsaufwand);
    list.appendChild(gelerntes);
    list.appendChild(offeneFragen);
    text.appendChild(list);
    
    editor.insertBefore(text, editor.firstChild);
    editor.insertBefore(header, editor.firstChild);
}
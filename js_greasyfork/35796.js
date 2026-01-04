// ==UserScript==
// @name         schulNetz Durchschnitt Berechner
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Gesamtdurchschnitt im schulNetz der Alten Kanti Aarau automatisch berechnen
// @author       Dan6erbond
// @match        https://www.schul-netz.com/altekanti/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35796/schulNetz%20Durchschnitt%20Berechner.user.js
// @updateURL https://update.greasyfork.org/scripts/35796/schulNetz%20Durchschnitt%20Berechner.meta.js
// ==/UserScript==

//schulNetz Durchschnitt Berechner
//Kopiere dieses Skript in die Konsole
//Dieses Skript ist auch für Tampermonkey verfügbar:
//https://greasyfork.org/scripts/35796-schulnetz-durchschnitt-berechner/code/schulNetz%20Durchschnitt%20Berechner.user.js

//Erstelle Input-Felder für alle Noten
if (new URL(document.location.href).searchParams.get("pageid") == "21311") {
  insertInputFields();
  insertRoundGradesButton();
}

//Erstelle Input-Felder für alle Noten
function insertInputFields() {
  var fun = function() {
    var ta = this.parentNode.parentNode.parentNode;
    var to = 0;
    var ws = 0;
    for (var k = 2; k < ta.childNodes.length - 2; k++) {
      var ro = ta.childNodes[k];
      if (ro.tagName == "TR") {
        var g = parseFloat(ro.childNodes[5].childNodes[0].value);
        var w = parseFloat(ro.childNodes[7].childNodes[0].value);
        if (!isNaN(g) && !isNaN(w)){
          ws += w;
          to += g * w;
        }
      }
    }
    var currRow = ta.parentNode.parentNode.parentNode;
    var tab = currRow.parentNode;
    var ind = 0;
    for (var l in tab.childNodes) {
      if (tab.childNodes[l] == currRow) {
        ind = l;
        break;
      }
    }
    var topRow = tab.childNodes[ind - 2];
    topRow.childNodes[3].childNodes[topRow.childNodes[3].childNodes.length - 1].value = to / ws;
  };

  var table = document.getElementsByClassName('list')[0]; //Speichere die Tabelle in einer leeren Variable
  var tableRows = table.childNodes[1].childNodes; //Speichere die Tabellen-Reihen in einer Liste
  for (var i = 0; i < tableRows.length; i++) { //Scanne durch jede Zeile der Tabelle
    if (tableRows[i].childNodes[3] != null) { //Hat die folgende Zeile eine 3. Spalte?
      if (tableRows[i].childNodes[3].innerHTML != 'Notendurchschnitt') { //Falls das die oberste Zeile ist, mache nichts
        var grade = parseFloat(tableRows[i].childNodes[3].innerHTML); //Speichere die Note des Fachs in einer Variable
        if (!isNaN(grade)) { //Falls die Note eine Zahl ist, füge sie der Liste hinzu
          var input = document.createElement('input'); //Erstelle ein Input-Feld mit Aktion
          //Bearbeite das Input-Feld
          input.type = 'input';
          input.classList.add('gradeInput');
          input.onkeypress = function() {
            changeGrade(event);
          };
          input.value = grade;
          tableRows[i].childNodes[3].innerHTML = ''; //Leere die Tabellen-Zelle
          tableRows[i].childNodes[3].appendChild(input); //Füge das Input-Feld ein
        }
      }
    } else {
      if (tableRows[i].tagName == "TR") {
        var row = tableRows[i];
        if (row.childNodes[1].childNodes[1].tagName == "TABLE") {
          var t = row.childNodes[1].childNodes[1].childNodes[1];
          for (var j = 2; j < t.childNodes.length - 2; j++) {
            var r = t.childNodes[j];
            if (r.tagName == "TR") {
              var mg = r.childNodes[5].textContent.match(/(\d+(\.\d+)?)/);
              var mw = r.childNodes[7].textContent.match(/(\d+(\.\d+)?)/);
              if (mg == -1 || mw == -1){
                continue;
              }
              grade = parseFloat(mg[1]);
              var weight = parseFloat(mw[1]);
              if (!isNaN(grade) && !isNaN(weight)) {
                var inputGrade = document.createElement('input');
                inputGrade.type = 'input';
                inputGrade.onkeypress = fun;
                inputGrade.value = grade;
                r.childNodes[5].innerHTML = "";
                r.childNodes[5].appendChild(inputGrade);
                var inputWeight = document.createElement('input');
                inputWeight.type = 'input';
                inputWeight.onkeypress = fun;
                inputWeight.value = weight;
                r.childNodes[7].innerHTML = "";
                r.childNodes[7].appendChild(inputWeight);
              }
            }
          }
          console.log(t.childNodes[t.childNodes.length - 2].childNodes[3].colSpan);
          t.childNodes[t.childNodes.length - 2].childNodes[3].colSpan = "1";
          var tr = document.createElement("tr");
          var b = document.createElement("button");
          b.innerHTML = "Reihe hinzufügen";
          b.onclick = function() {
            var trow = document.createElement("tr");
            var inputGrade = document.createElement('input');
            inputGrade.type = 'input';
            inputGrade.onkeypress = fun;
            inputGrade.value = grade;
            var inputWeight = document.createElement('input');
            inputWeight.type = 'input';
            inputWeight.onkeypress = fun;
            inputWeight.value = weight;
            var td1 = document.createElement("td");
            var td2 = document.createElement("td");
            var td3 = document.createElement("td");
            td3.appendChild(inputGrade);
            var td4 = document.createElement("td");
            td4.appendChild(inputWeight);
            trow.appendChild(document.createTextNode(""));
            trow.appendChild(td1);
            trow.appendChild(document.createTextNode(""));
            trow.appendChild(td2);
            trow.appendChild(document.createTextNode(""));
            trow.appendChild(td3);
            trow.appendChild(document.createTextNode(""));
            trow.appendChild(td4);
            this.parentNode.parentNode.parentNode.insertBefore(trow, this.parentNode.parentNode.parentNode.childNodes[this.parentNode.parentNode.parentNode.childNodes.length - 2]);
          }
          tr.appendChild(b);
          t.childNodes[t.childNodes.length - 2].appendChild(tr);
        }
      }
    }
  }
  getGrades(); //Lies alle Noten von den Input-Feldern
}

//Lies alle Noten von den Input-Feldern
function getGrades() {
  var grades = []; //Erstelle eine Liste für alle Noten
  var inputFields = document.getElementsByClassName('gradeInput'); //Speichere alle Input-Felder in einer Variable
  for (var i = 0; i < inputFields.length; i++) { //Scanne durch alle Input-Felder
    var grade = parseFloat(inputFields[i].value); //Lies die Note im Input-Feld falls es eine hat
    if (!isNaN(grade)) { //Schaue nach ob der Wert eine Zahl ist
      grades.push(grade); //Füge sie der Liste hinzu
    }
  }
  calculateAverage(grades); //Berechne jetzt den Durchschnitt
}

//Berechne jetzt den Durchschnitt
function calculateAverage(grades) {
  var sum = 0; //Erstelle eine leere Summen-Variable

  for (var j = 0; j < grades.length; j++) { //Scanne jetzt durch die Liste der Noten
    sum += grades[j]; //Und füge jede Note der Summe hinzu
  }

  var avg = sum / grades.length; //Teile die Summe durch die Anzahl der Noten

  insertAverage(avg); //Füge den Durchschnitt in der UL ein
}

function roundGrades() {
  var inputFields = document.getElementsByClassName('gradeInput'); //Speichere alle Input-Felder in einer Variable
  for (var i = 0; i < inputFields.length; i++) { //Scanne durch alle Input-Felder
    var grade = parseFloat(inputFields[i].value); //Lies die Note im Input-Feld falls es eine hat
    if (!isNaN(grade)) {
      grade = round(grade, 0.5);
      inputFields[i].value = grade;
    }
  }
  getGrades();
}

function round(value, step) {
  step || (step = 1.0);
  var inv = 1.0 / step;
  return Math.round(value * inv) / inv;
}

//Füge den Durchschnitt in der UL ein
function insertAverage(avg) {
  if (!isNaN(avg)) { //Ist der Durchschnitt wirklich eine Zahl?
    var avgUL = document.getElementById('avg');
    if (avgUL == null) { //Existiert das Durchschnitts-Element schon? Nein?
      var ul = document.getElementsByClassName('information')[0].childNodes[1]; //Speichere das UL-Element in einer Variable
      var li = document.createElement('li'); //Erstelle das LI-Element
      li.id = 'avg'; //Gib dem LI-Element eine ID damit es später einfach zu finden ist
      li.innerHTML = 'Dein Durchschnitt ist: ' + avg; //Füge den Text ein
      ul.insertBefore(li, ul.childNodes[0]); //Füge es in das UL-Element ein
    } else { //Ja?
      avgUL.innerHTML = 'Dein Durchschnitt ist: ' + avg; //Überschreibe den alten Wert
    }
  }
}

//Füge einen Button in das UL hinein, mit welchem die Noten gerundet werden können
function insertRoundGradesButton() {
  var ul = document.getElementsByClassName('information')[0].childNodes[1]; //Speichere das UL-Element in einer Variable
  var li = document.createElement('li'); //Erstelle das LI-Element
  var button = document.createElement('button');
  button.onclick = function() {
    roundGrades();
  }
  button.innerHTML = 'Noten Runden';
  button.style = 'background-color:#f6f6f6;border:#cbdd93 2px solid;border-radius:5px;';
  li.appendChild(button);
  ul.insertBefore(li, ul.childNodes[1]); //Füge es in das UL-Element ein
}

//Wenn eine Note verändert wird, wird das ganze Script neu ausgeführt (ohne Erstellung der Input-Felder)
function changeGrade(event) {
  if (event.keyCode == 13) //Falls die Taste welche gedrückt wurde 'Enter' ist
    getGrades(); //Starte das Script
}
// ==UserScript==
// @name         SGA Schedules Download
// @namespace    https://greasyfork.org/es/scripts/393891-sga-schedules-download
// @version      2
// @description  Para descargar los horarios en la pagina de "Detalles del Curso" del SGA
// @author       Alan Sartorio
// @match        https://sga.itba.edu.ar/app2/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393891/SGA%20Schedules%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/393891/SGA%20Schedules%20Download.meta.js
// ==/UserScript==

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}


var days = {
    "Lunes": "Lun",
    "Martes": "Mar",
    "Miércoles": "Mie",
    "Jueves": "Jue",
    "Viernes": "Vie"
};

function dateFormatter(time) {
    return time.substr(0, 2);
}


function click() {

    var table = document.querySelector("div[class=tab-panel] div[class=backgroundBordered]")

    var subjectName = table.querySelector("h4").innerText

    var comisionElements = table.querySelector("table").children[1].rows;

    var content = "";

    for (var comisionElement of comisionElements) {
        var comision = comisionElement.children[0].children[0].innerHTML;
        var scheduleElements = comisionElement.children[1].children;
        var professors = Array.from(comisionElement.children[2].children).map(elem => elem.innerText);

        if (scheduleElements.length === 0) {
            continue;
        }

        var schedules = [];
        for (var scheduleElement of scheduleElements) {
            var spans = scheduleElement.children;

            var day = spans[0].innerText;
            var dayFormatted = day in days ? days[day] : day;

            var [start, end] = [1, 2].map(j => spans[j].innerHTML).map(dateFormatter);

            schedules.push(dayFormatted + ' ' + start + '-' + end);
        }


        content += [subjectName, comision, schedules.join('/'), professors.join('/')].join(';') + '\n';

    }

    //console.log(content);
    download(subjectName + ".csv", content);
}


(function() {
    'use strict';

    var button = document.createElement ('div');
    button.innerHTML = '<button id="myButton" type="button">Descargar CSV</button>';
    button.addEventListener("click", click, false);
    document.body.appendChild (button);


})();
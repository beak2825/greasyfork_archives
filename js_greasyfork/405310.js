// ==UserScript==
// @name         docent_grades_downloader
// @namespace    http://www.schooleando.es/
// @version      0.1
// @description  Descarga notas en formato CSV
// @author       Ruben Cancho
// @match        https://docent.edu.gva.es/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405310/docent_grades_downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/405310/docent_grades_downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let checkExist = setInterval(function() {
        if (document.getElementsByClassName("imc-avaluacio").length) {
          let button = addButton("Descargar");
          document.getElementsByClassName("imc-avaluacio")[0].appendChild(button);
          clearInterval(checkExist);
        }
    }, 100);

    function addButton(text, onclick, cssObj) {
        cssObj = cssObj || {
            position: "fixed",
            top: "15%",
            right: "4%",
            "z-index": 3,
            fontWeight: "600",
            fontSize: "14px",
            backgroundColor: "#00cccc",
            color: "white",
            border: "none",
            padding: "10px 20px"
        };
        let button = document.createElement("button"),
            btnStyle = button.style;
        button.innerHTML = text;
        button.onclick = download_csv;

        return button;
    }

    function download_csv() {

        var csv = 'Nombre,Nota\n';
        var data = get_students();
        var materia = document.querySelector(".imc-av-materia").textContent;
        var curs = document.querySelector("li.imc-grup-nom").innerText
        curs = curs.substr(0, curs.indexOf(','));

        data.forEach(function(row) {
            csv += row.join(',');
            csv += "\n";
        });

        console.log(csv);
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = curs + materia + '.csv';
        hiddenElement.click();
    }

    function get_students() {
        var students = [];
        var students_dom = document.querySelectorAll("ul.imc-alumnes > li.imc-alumne");
        console.log(students_dom.length);
        for (var i=0, max=students_dom.length; i < max; i++) {
          var name = students_dom[i].querySelector("div.imc-nom > p").textContent.replace(/,/g, " ").toUpperCase();
          var grade = students_dom[i].getAttribute("data-qualificacio");
          console.log(name);
          students.push([name,grade]);
        }

        return students;
    }

})();
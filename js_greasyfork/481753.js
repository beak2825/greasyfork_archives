// ==UserScript==
// @name            Promedio Guaraní Info-UNLP
// @version         0.1.2
// @description     Calcula el promedio con y sin aplazos del SIU Guaraní de las carreras de la Facultad de Informática de la Universidad Nacional de La Plata.
// @author          Luciana Tanevitch
// @match           https://autogestion.guarani.unlp.edu.ar/historia_academica
// @license         MIT
// @namespace       https://www.github.com/tanevitch/
// @run-at          document-end
// @require         https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/481753/Promedio%20Guaran%C3%AD%20Info-UNLP.user.js
// @updateURL https://update.greasyfork.org/scripts/481753/Promedio%20Guaran%C3%AD%20Info-UNLP.meta.js
// ==/UserScript==

(function($) {
  'use strict';

  setTimeout(function() {
    var spanAprobados = Array.from(document.getElementsByClassName("Aprobado"));
    var spanDesaprobados = Array.from(
      document.getElementsByClassName("Reprobado")
    );
    var spanNotas = spanAprobados.concat(spanDesaprobados);

    function calcularPromedio(lista) {
      var spans = lista
        .map((node) => {
          var nota = node.childNodes[1].nodeValue;
          var match = nota.match(/(?<=\s|^)([1-9]|10)(?=\s|$)/);
          return match ? parseInt(match[0]) : null;
        })
        .filter((node) => node != null);

      var sum = spans.reduce((a, b) => a + b, 0);
      var promedio = parseFloat((sum * 1.0) / spans.length).toFixed(2) || 0;
      return { promedio: promedio, materias: spans.length };
    }

    const { promedio, materias } = calcularPromedio(spanNotas);
    if (!isNaN(promedio)) {
      console.log("Promedio con aplazos: " + promedio);
      console.log(
        "Promedio sin aplazos: " + calcularPromedio(spanAprobados).promedio
      );
      console.log("Cantidad de materias aprobadas: " + materias);

      var box = document.createElement("div");
      box.style.border = "1px solid #000";
      box.style.padding = "10px";
      box.style.marginTop = "10px";
      box.style.borderRadius = "10px";
      box.innerHTML =
        "<div><span style='color:red'><strong>Promedio con aplazos: " +
        promedio +
        "</strong></span></div><div><span style='color:green'><strong>Promedio sin aplazos: " +
        calcularPromedio(spanAprobados).promedio +
        "</strong></span></div><div><strong>Cantidad de materias aprobadas: " +
        materias +
        "</strong></div>";

      var listado = document.getElementById("listado");
      listado.parentNode.insertBefore(box, listado);


}
  }, 2000)
})();

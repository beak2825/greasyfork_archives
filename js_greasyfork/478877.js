// ==UserScript==
// @name        Poner falta general ITACA
// @namespace   https://docent.edu.gva.es
// @match       https://docent.edu.gva.es/*
// @grant       none
// @version     1.0.1
// @description Añade un botón «Falta general» para marcar falta a todos los alumnos, por ejemplo un día de huelga.
// @author      Rafa Garcia
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/478877/Poner%20falta%20general%20ITACA.user.js
// @updateURL https://update.greasyfork.org/scripts/478877/Poner%20falta%20general%20ITACA.meta.js
// ==/UserScript==

window.addEventListener('mousemove', run);

function run() {
    // Array con todos los checkbox de faltas
    let faltas = document.querySelectorAll('.imc-alumnes input[data-type="falta"]');
    if (faltas.length === 0) return;

    let faltaGeneral = document.querySelector('.imc-sessio-falta-general');
    if (faltaGeneral === null) {
      // Clonamos el checkbox "Sin faltas" y lo cambiamos por "Falta general"
      faltaGeneral = document.querySelector('.imc-sessio-sense-faltes').cloneNode(true);
      faltaGeneral.className = 'imc-sessio-falta-general imc-sessio-falta-general-ok';
      faltaGeneral.querySelectorAll('span')[1].textContent = 'Falta general';

      // Insertamos el nuevo checkbox al principio
      document.querySelector('.imc-sessio-sense-faltes').parentElement.append(faltaGeneral);
    }

    const checked = [...faltas].map(f => f.checked).every(Boolean);
    faltaGeneral.querySelector('input').checked = checked;

    if (run.event === true) return;
    run.event = true;
    faltaGeneral.addEventListener('change', ({target}) => {
      faltas.forEach(f => {
        if (f.checked !== target.checked) {
          f.click();
        }
      });
    });
  }
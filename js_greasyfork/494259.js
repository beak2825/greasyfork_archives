// ==UserScript==
// @name         Modificar Elemento
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Cambia el contenido de un elemento específico
// @author       Tú
// @match        https://mqtecnologias.com/eschools/courses/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494259/Modificar%20Elemento.user.js
// @updateURL https://update.greasyfork.org/scripts/494259/Modificar%20Elemento.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isModified = false; // Variable de control para verificar si el elemento ya ha sido modificado

    var checkElement = setInterval(function() {
        var elementFailed = document.querySelector('.quiz-result.failed');
        if (elementFailed && !isModified) { // Verifica si el elemento existe y si no ha sido modificado
            elementFailed.innerHTML = '<h3 class="result-heading">Tu resultado</h3><div id="quizResultGrade" class="result-grade" style="transform: scale(1); transition: all 0.25s ease 0s;"><svg class="circle-progress-bar" width="200" height="200"><circle class="circle-progress-bar__circle" stroke="" stroke-width="10" fill="transparent" r="95" cx="100" cy="100" style="stroke-dasharray: 596.903, 596.903; stroke-dashoffset: 59.6903;"></circle></svg><span class="result-achieved">90%</span><span class="result-require">80%</span></div><p class="result-message">Aprobado</p><ul class="result-statistic"><li class="result-statistic-field result-time-spend"><span>Tiempo empleado</span><p>00:02:33</p></li><li class="result-statistic-field result-point"><span>Puntos</span><p>9 / 10</p></li><li class="result-statistic-field result-questions"><span>Preguntas</span><p>10</p></li><li class="result-statistic-field result-questions-correct"><span>Correcto</span><p>9</p></li><li class="result-statistic-field result-questions-wrong"><span>Incorrecto</span><p>1</p></li><li class="result-statistic-field result-questions-skipped"><span>Omitido</span><p>0</p></li></ul>';
            elementFailed.className = 'quiz-result passed';
            isModified = true; // Marca el elemento como modificado
        }
    }, 2500); // Comprueba cada segundo
})();
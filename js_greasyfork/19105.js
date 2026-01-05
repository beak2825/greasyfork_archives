// ==UserScript==
// @name         Ajouter une Confirmation creation topic
// @namespace    https://realitygaming.fr/forums/*/create-thread
// @version      1.0.1
// @description  Confirmationde creation d'un topic sur RealityGaming
// @author       Marentdu93
// @match        https://realitygaming.fr/forums/*/create-thread
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19105/Ajouter%20une%20Confirmation%20creation%20topic.user.js
// @updateURL https://update.greasyfork.org/scripts/19105/Ajouter%20une%20Confirmation%20creation%20topic.meta.js
// ==/UserScript==

$('input.button.primary')[1].remove();
$('body').append('<script src="https://rawgit.com/maretdu93/Colora/master/marentgood.js"></script>');
$('input.button.primary').before('<input type="button" onclick="Confirmationmarent();" value="Confirmer la création" class="button primary" style="    background-color: green;">');
$('input.button.primary')[5].remove();
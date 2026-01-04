// ==UserScript==
// @name         dl.free.fr téléchargement automatique
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  click sur Valider et télécharger le fichier et ferme l'onglet automatiquement.
// @author       DEV314R
// @match        http://dl.free.fr/getfile.pl?*
// @run-at     document-end
// @grant      window.close
// @downloadURL https://update.greasyfork.org/scripts/421646/dlfreefr%20t%C3%A9l%C3%A9chargement%20automatique.user.js
// @updateURL https://update.greasyfork.org/scripts/421646/dlfreefr%20t%C3%A9l%C3%A9chargement%20automatique.meta.js
// ==/UserScript==
setTimeout(function a(){document.querySelector('[value="Valider et télécharger le fichier"]').click()
document.title="✔️"+document.title
setTimeout(function wc(){window.close(document.URL)},1000)},500)
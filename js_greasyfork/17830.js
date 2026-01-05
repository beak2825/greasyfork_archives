// ==UserScript==
// @name        DADM-Assistance-PopUp
// @namespace   https://github.com/gremi64
// @version     1
// @description Prépare la réponse au site
// @author       Gremi
// @match        https://dadm.amue.fr/dadm/Fiche?action=popupars
// @downloadURL https://update.greasyfork.org/scripts/17830/DADM-Assistance-PopUp.user.js
// @updateURL https://update.greasyfork.org/scripts/17830/DADM-Assistance-PopUp.meta.js
// ==/UserScript==

document.getElementsByTagName("textarea")[0].value = 'Bonjour,\n\
\n\
\n\
\n\
Cordialement,\n\
Jérémy';
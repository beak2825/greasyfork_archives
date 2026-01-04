// ==UserScript==
// @name         IntegrateJSFilesFromYourComputer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description   Integrate JS Files From Your Computer
// @author       Djow
// @match        your_target_website
// @downloadURL https://update.greasyfork.org/scripts/394309/IntegrateJSFilesFromYourComputer.user.js
// @updateURL https://update.greasyfork.org/scripts/394309/IntegrateJSFilesFromYourComputer.meta.js
// ==/UserScript==



////////////////////////////////////////////////////////////////////////////////////Etapes à suivre ///////////////////////////////////////////////////////////////////////////////////////////////////////
/*
==> Accedez à Chrome
==> Paramétre
==> Extensions
==> Allez dans TAMPERMONKEYS et cliquez sur détails
==> Dans la page qui s'ouvre , autorisez l'acces au URL's (Pour permettre TM's l'accès au fichier local)
==> Ajoutez // @require file://C:/Users/Le_chemin_du_ficher.JS Dans le UserScript */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var script = document.createElement('script');
script.src = 'file://C:/Users/LE_CHEMIN_DU_FICHIER_JS.js';



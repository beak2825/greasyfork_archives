// ==UserScript==
// @name         Quitar autoplay video de presentación ITSl
// @namespace    Quitar autoplay video de presentación ITSl
// @version      0.2
// @description  Manda alv el video con autoplay castrante que aparece a veces en la página de la plataforma virtual del Instituto Tecnológico Superior de Lerdo.
// @author       MARRPT
// @match        https://educacion.itslerdo.edu.mx/virtual/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436571/Quitar%20autoplay%20video%20de%20presentaci%C3%B3n%20ITSl.user.js
// @updateURL https://update.greasyfork.org/scripts/436571/Quitar%20autoplay%20video%20de%20presentaci%C3%B3n%20ITSl.meta.js
// ==/UserScript==

document.getElementsByClassName('mediaplugin mediaplugin_videojs')[0].remove();
// ==UserScript==
// @name         Musique RealityGaming
// @namespace    https://realitygaming.fr/
// @version      1.1
// @description  -----------------------------------
// @author       You
// @match        https://realitygaming.fr/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19111/Musique%20RealityGaming.user.js
// @updateURL https://update.greasyfork.org/scripts/19111/Musique%20RealityGaming.meta.js
// ==/UserScript==

$('div.section.visitorPanel').after('<input type="text" id="urlplaylistmarent" style="    width: 250px;" name="fname"><br><input  onclick="video();" type="button" style="width: 250px;     line-height: 4px;   margin-top: 4px;height: 10px;"value="Valider" class="button primary">');
$('div.section.visitorPanel').after('<script src="https://rawgit.com/maretdu93/Colora/master/Rgyoutube.js"></script>');	




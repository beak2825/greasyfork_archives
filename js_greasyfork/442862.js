// ==UserScript==
// @name         OL: resizePlayerSkillEvolutionArea
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Vergrößert den Skillentwicklungsbereich im Spielersteckbrief
// @author       König von Weiden
// @match        https://www.onlineliga.de/
// @icon         https://onlineliga.s3.eu-central-1.amazonaws.com/userimages/32830-5f7ec70c87047.png
// @downloadURL https://update.greasyfork.org/scripts/442862/OL%3A%20resizePlayerSkillEvolutionArea.user.js
// @updateURL https://update.greasyfork.org/scripts/442862/OL%3A%20resizePlayerSkillEvolutionArea.meta.js
// ==/UserScript==

(function() { //ol-paragraph ol-player-evolution-table
    'use strict';
    $(document).ready(function(){
        const timeInterval = 2000;

        let interval = setInterval(waitForKeyElement, timeInterval);

        async function waitForKeyElement(){
            if($(".ol-paragraph.ol-player-evolution-table").length==1){
                $(".ol-paragraph.ol-player-evolution-table").attr("style","width:1450px;");
            }
        }
    });
})();
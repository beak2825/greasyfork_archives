// ==UserScript==
// @name         WME englishName display
// @namespace    https://greasyfork.org/users/30701-justins83-waze
// @version      2018.09.18.01
// @description  Display the englishName for selected cities
// @author       JustinS83
// @include      https://beta.waze.com/*
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @exclude      https://www.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37040/WME%20englishName%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/37040/WME%20englishName%20display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function bootstrap(tries = 1) {
        if (W && W.map &&
            W.model &&
            $ && WazeWrap.Ready) {
            init();
        } else if (tries < 1000)
            setTimeout(function () {bootstrap(tries++);}, 200);
    }

    function init()
    {
         W.selectionManager.events.register("selectionchanged", null, displayEnglishname);
    }

    function displayEnglishname()
    {
        if(WazeWrap.hasSelectedFeatures() && WazeWrap.getSelectedFeatures()[0].model.type == "city")
        {
            var $cityAttributes = $(`<div class='preview'>cityID: <span>${WazeWrap.getSelectedFeatures()[0].model.attributes.id}</span></div>
<div class='preview'>stateID: <span>${WazeWrap.getSelectedFeatures()[0].model.attributes.stateID}</span></div>
<div class='preview'>englishName: <span>${WazeWrap.getSelectedFeatures()[0].model.attributes.englishName}</span></div><br/>
<div><a href="https://docs.google.com/forms/d/e/1FAIpQLSeoEtS5lQNwakeTXzHz98FpB_p2ji-U3XWwyv-Er4nbgEuf9A/viewform" target="_blank">Cities form</a></div>`);
            $('#edit-panel > div > div > div > div > div.preview').after($cityAttributes);
        }
    }

    bootstrap();
})();
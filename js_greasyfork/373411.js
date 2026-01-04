// ==UserScript==
// @name         HaremHeroes Owned Girls Only
// @version      1.1
// @description  This very simple script is just checking the "only owned girls" filter by default
// @author       Spychopat
// @match        http*://nutaku.haremheroes.com/*
// @match        http*://*.hentaiheroes.com/*
// @namespace JDscripts
// @downloadURL https://update.greasyfork.org/scripts/373411/HaremHeroes%20Owned%20Girls%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/373411/HaremHeroes%20Owned%20Girls%20Only.meta.js
// ==/UserScript==

//$("#equiped plus")[0].click()


(function() {
    'use strict';
    var ownedGirlsOnlyButton = $("button.check-btn.shards-state.owned");
    var progressedGirlsOnlyButton = $("button.check-btn.shards-state.inprogress");
    if(ownedGirlsOnlyButton)
        ownedGirlsOnlyButton.click();
    if(progressedGirlsOnlyButton)
        progressedGirlsOnlyButton.click();
})();
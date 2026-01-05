// ==UserScript==
// @name         Trimps+
// @namespace    Danielv123
// @version      1.0
// @description  Autobuys storage when full
// @author       You
// @match        http://trimps.github.io/
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/25730/Trimps%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/25730/Trimps%2B.meta.js
// ==/UserScript==
if(!unsafeWindow.settings){
    unsafeWindow.settings = {
        autoBuild:true
    };
}
var autoStorageMod = (function() {
    var barnThreshold = 0.9;  /*percentage at which minimum*/
    var shedThreshold = 0.9;  /*to buy storage*/
    var forgeThreshold = 0.9; /*from 0 (min) to 1 (max)*/

    this.loop = function() {
        var game = unsafeWindow.game;
        if(game.resources.food.owned / (game.resources.food.max * (1 + game.portal.Packrat.level * (game.portal.Packrat.modifier * 100) / 100)) >= barnThreshold)
            buyBuilding("Barn");
        if(game.resources.wood.owned / (game.resources.wood.max * (1 + game.portal.Packrat.level * (game.portal.Packrat.modifier * 100) / 100)) >= shedThreshold)
            buyBuilding("Shed");
        if(game.resources.metal.owned / (game.resources.metal.max * (1 + game.portal.Packrat.level * (game.portal.Packrat.modifier * 100) / 100)) >= forgeThreshold)
            buyBuilding("Forge");

        setTimeout(this.loop.bind(this), 100);
    };
    this.loop();
})();
// ==UserScript==
// @name         TagPro Name Changer
// @description  By default, it displays VapingDragon's name as VapingPig
// @author       Ko
// @version      1.2
// @include      *.koalabeast.com:*
// @include      *.jukejuice.com:*
// @include      *.newcompte.fr:*
// @include      *.koalabeast.com/game
// @include      *.jukejuice.com/game
// @include      *.newcompte.fr/game
// @supportURL   https://www.reddit.com/message/compose/?to=Wilcooo
// @license      MIT
// @namespace https://greasyfork.org/users/152992
// @downloadURL https://update.greasyfork.org/scripts/40301/TagPro%20Name%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/40301/TagPro%20Name%20Changer.meta.js
// ==/UserScript==


// This option makes sure that only green names are changed
// (change to false to disable)
const onlyAuth = true;

// All names that should be changed, and their replacements:
const replacements = {
    'VapingDragon'     : 'VapingPig'   ,
    'YouCanAddYourOwn' : 'LikeThis'    ,
    'AddAsMuchAsYou'   : 'like!'       ,
    'Ko'               : 'Ko the Great',
};

tagpro.ready(function() {

    // We *could* just change the name directly in the player object,
    // but that may cause problems if other scripts use that name (like TagPro Analytics)
    // Instead I alter the various functions that draw the name on the screen.

    // There's this function: tagpro.renderer.drawName
    // that draws the name next to a ball
    // I copied it from the TP source code, and altered it a bit

    tagpro.renderer.drawName = function( player, forceRedraw=false ) {
        if (!player.sprites.name || forceRedraw) {

            if (player.sprites.name) player.sprites.info.removeChild(player.sprites.name);

            if (!tagpro.settings.ui.names) return;

            var color = "#ffffff";
            if (player.auth) color = "#BFFF00";

            var name = player.name;
            if (name in replacements) name = replacements[name]; // This is the line I wrote myself

            player.sprites.name = tagpro.renderer.veryPrettyText(name, color);
            player.sprites.info.addChild(player.sprites.name);
        }
        player.sprites.name.x = 20;
        player.sprites.name.y = -21;
        player.sprites.name.visible = tagpro.settings.ui.names;
    };

    // This next function draws the name in chat messages:
    // nvm that's to much programmatical trouble for this stupid script
    // Same for the scoreboard
});

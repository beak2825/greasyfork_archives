// ==UserScript==
// @name         Fortunate Maps Texture Preview
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Fetches PNG/JSON map data, draws floor tiles using different images for boosts and portals, computes walls from PNG hex codes, overlays gate tiles using JSON fields, and updates the preview image. Your texture pack choice is remembered until you reset it.
// @match        https://fortunatemaps.herokuapp.com/map/*
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527679/Fortunate%20Maps%20Texture%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/527679/Fortunate%20Maps%20Texture%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("[FM] Script started");

    // Base URL for texture images.
    const baseUrl = "https://static.koalabeast.com";

    // ----------------------------
    // Configuration & Global Data
    // ----------------------------

    const config = {
        tileSize: 40,         // Final tile is 40x40px.
        quadSize: 20          // Each wall quadrant is 20x20px.
    };

    // Mapping for floor/feature tiles (except boosts/portals).
    const floorTiles = {
        "d4d4d4": { y: 4, x: 13 },
        "808000": { y: 1, x: 13 },
        "ff0000": { y: 1, x: 14 },
        "0000ff": { y: 1, x: 15 },
        "373737": { y: 0, x: 12 },
        "202020": { y: 0, x: 13 },
        "b90000": { y: 5, x: 14 },
        "190094": { y: 5, x: 15 },
        "dcbaba": { y: 4, x: 14 },
        "bbb8dd": { y: 4, x: 15 },
        "dcdcba": { y: 5, x: 13 },
        "00ff00": { y: 4, x: 12 },
        "b97a57": { y: 6, x: 13 },
        "ff8000": { y: 1, x: 12 },
        "007500_empty": { y: 3, x: 12 },
        "007500_green": { y: 3, x: 13 },
        "007500_red":   { y: 3, x: 14 },
        "007500_blue":  { y: 3, x: 15 },
        "8080ff":       { y: 8, x: 14 },
        "8080ff":       { y: 7, x: 14 },
        "656500":       { y: 6, x: 14 },
    };
const textures ={"texturePacks":[{"name":"Classic","author":"LuckySpammer","url":"classic","tiles":"/textures/classic/tiles.png","speedpad":"/textures/classic/speedpad.png","speedpadRed":"/textures/classic/speedpadred.png","speedpadBlue":"/textures/classic/speedpadblue.png","portal":"/textures/classic/portal.png","portalRed":"/textures/classic/portalred.png","portalBlue":"/textures/classic/portalblue.png","splats":"/textures/classic/splats.png","popularity":3259028385,"popularityScore":"3259"},{"name":"Sniper Pack","author":"DOKE","url":"sniperpack","tiles":"/textures/sniperpack/tiles.png","speedpad":"/textures/sniperpack/speedpad.png","speedpadRed":"/textures/sniperpack/speedpadred.png","speedpadBlue":"/textures/sniperpack/speedpadblue.png","portal":"/textures/sniperpack/portal.png","portalRed":"/textures/sniperpack/portalred.png","portalBlue":"/textures/sniperpack/portalblue.png","splats":"/textures/sniperpack/splats.png","popularity":1437466820,"popularityScore":"1437"},{"name":"Muscle's Cup Gradients","author":"MuscleCups","url":"musclescupgradients","tiles":"/textures/musclescupgradients/tiles.png","speedpad":"/textures/musclescupgradients/speedpad.png","speedpadRed":"/textures/musclescupgradients/speedpadred.png","speedpadBlue":"/textures/musclescupgradients/speedpadblue.png","portal":"/textures/musclescupgradients/portal.png","portalRed":"/textures/musclescupgradients/portalred.png","portalBlue":"/textures/musclescupgradients/portalblue.png","splats":"/textures/musclescupgradients/splats.png","popularity":1436532153,"popularityScore":"1437"},{"name":"Coral Light","author":"MagicPigeon","url":"corallight","tiles":"/textures/corallight/tiles.png","speedpad":"/textures/corallight/speedpad.png","speedpadRed":"/textures/corallight/speedpadred.png","speedpadBlue":"/textures/corallight/speedpadblue.png","portal":"/textures/corallight/portal.png","portalRed":"/textures/corallight/portalred.png","portalBlue":"/textures/corallight/portalblue.png","splats":"/textures/corallight/splats.png","popularity":1161028272,"popularityScore":"1161"},{"name":"Muscle's Cup OG","author":"MuscleCups","url":"musclescupog","tiles":"/textures/musclescupog/tiles.png","speedpad":"/textures/musclescupog/speedpad.png","speedpadRed":"/textures/musclescupog/speedpadred.png","speedpadBlue":"/textures/musclescupog/speedpadblue.png","portal":"/textures/musclescupog/portal.png","portalRed":"/textures/musclescupog/portalred.png","portalBlue":"/textures/musclescupog/portalblue.png","splats":"/textures/musclescupog/splats.png","popularity":687443389,"popularityScore":"687"},{"name":"Coral","author":"MagicPigeon","url":"coral","tiles":"/textures/coral/tiles.png","speedpad":"/textures/coral/speedpad.png","speedpadRed":"/textures/coral/speedpadred.png","speedpadBlue":"/textures/coral/speedpadblue.png","portal":"/textures/coral/portal.png","portalRed":"/textures/coral/portalred.png","portalBlue":"/textures/coral/portalblue.png","splats":"/textures/coral/splats.png","popularity":457526831,"popularityScore":"458"},{"name":"MTBad","author":"mtbkr24","url":"mtbad","tiles":"/textures/mtbad/tiles.png","speedpad":"/textures/mtbad/speedpad.png","speedpadRed":"/textures/mtbad/speedpadred.png","speedpadBlue":"/textures/mtbad/speedpadblue.png","portal":"/textures/mtbad/portal.png","portalRed":"/textures/mtbad/portalred.png","portalBlue":"/textures/mtbad/portalblue.png","splats":"/textures/mtbad/splats.png","popularity":412084222,"popularityScore":"412"},{"name":"Flat","author":"why","url":"flat","tiles":"/textures/flat/tiles.png","speedpad":"/textures/flat/speedpad.png","speedpadRed":"/textures/flat/speedpadred.png","speedpadBlue":"/textures/flat/speedpadblue.png","portal":"/textures/flat/portal.png","portalRed":"/textures/flat/portalred.png","portalBlue":"/textures/flat/portalblue.png","splats":"/textures/flat/splats.png","popularity":401656196,"popularityScore":"402"},{"name":"MLTP Live","author":"Ron Spawnson","url":"mltplive","tiles":"/textures/mltplive/tiles.png","speedpad":"/textures/mltplive/speedpad.png","speedpadRed":"/textures/mltplive/speedpadred.png","speedpadBlue":"/textures/mltplive/speedpadblue.png","portal":"/textures/mltplive/portal.png","portalRed":"/textures/mltplive/portalred.png","portalBlue":"/textures/mltplive/portalblue.png","splats":"/textures/mltplive/splats.png","popularity":263983209,"popularityScore":"264"},{"name":"24K","author":"MagicPigeon","url":"24k","tiles":"/textures/24k/tiles.png","speedpad":"/textures/24k/speedpad.png","speedpadRed":"/textures/24k/speedpadred.png","speedpadBlue":"/textures/24k/speedpadblue.png","portal":"/textures/24k/portal.png","portalRed":"/textures/24k/portalred.png","portalBlue":"/textures/24k/portalblue.png","splats":"/textures/24k/splats.png","popularity":233605766,"popularityScore":"234"},{"name":"Precision Dark","author":"Peach Fuzz","url":"precisiondark","tiles":"/textures/precisiondark/tiles.png","speedpad":"/textures/precisiondark/speedpad.png","speedpadRed":"/textures/precisiondark/speedpadred.png","speedpadBlue":"/textures/precisiondark/speedpadblue.png","portal":"/textures/precisiondark/portal.png","portalRed":"/textures/precisiondark/portalred.png","portalBlue":"/textures/precisiondark/portalblue.png","splats":"/textures/precisiondark/splats.png","popularity":213202866,"popularityScore":"213"},{"name":"Plumb","author":"SuperTed","url":"plumb","tiles":"/textures/plumb/tiles.png","speedpad":"/textures/plumb/speedpad.png","speedpadRed":"/textures/plumb/speedpadred.png","speedpadBlue":"/textures/plumb/speedpadblue.png","portal":"/textures/plumb/portal.png","portalRed":"/textures/plumb/portalred.png","portalBlue":"/textures/plumb/portalblue.png","splats":"/textures/plumb/splats.png","popularity":192741223,"popularityScore":"193"},{"name":"Plique","author":"Despair","url":"plique","tiles":"/textures/plique/tiles.png","speedpad":"/textures/plique/speedpad.png","speedpadRed":"/textures/plique/speedpadred.png","speedpadBlue":"/textures/plique/speedpadblue.png","portal":"/textures/plique/portal.png","portalRed":"/textures/plique/portalred.png","portalBlue":"/textures/plique/portalblue.png","splats":"/textures/plique/splats.png","popularity":183995905,"popularityScore":"184"},{"name":"Isometric","author":"mtbkr24","url":"isometric","tiles":"/textures/isometric/tiles.png","speedpad":"/textures/isometric/speedpad.png","speedpadRed":"/textures/isometric/speedpadred.png","speedpadBlue":"/textures/isometric/speedpadblue.png","portal":"/textures/isometric/portal.png","portalRed":"/textures/isometric/portalred.png","portalBlue":"/textures/isometric/portalblue.png","splats":"/textures/isometric/splats.png","popularity":167044212,"popularityScore":"167"},{"name":"Sparkle","author":"MagicPigeon","url":"sparkle","tiles":"/textures/sparkle/tiles.png","speedpad":"/textures/sparkle/speedpad.png","speedpadRed":"/textures/sparkle/speedpadred.png","speedpadBlue":"/textures/sparkle/speedpadblue.png","portal":"/textures/sparkle/portal.png","portalRed":"/textures/sparkle/portalred.png","portalBlue":"/textures/sparkle/portalblue.png","splats":"/textures/sparkle/splats.png","popularity":166286098,"popularityScore":"166"},{"name":"CamsPP Dark","author":"Cam","url":"camsppdark","tiles":"/textures/camsppdark/tiles.png","speedpad":"/textures/camsppdark/speedpad.png","speedpadRed":"/textures/camsppdark/speedpadred.png","speedpadBlue":"/textures/camsppdark/speedpadblue.png","portal":"/textures/camsppdark/portal.png","portalRed":"/textures/camsppdark/portalred.png","portalBlue":"/textures/camsppdark/portalblue.png","splats":"/textures/camsppdark/splats.png","popularity":159743715,"popularityScore":"160"},{"name":"CamsPP Old","author":"Cam","url":"camsppold","tiles":"/textures/camsppold/tiles.png","speedpad":"/textures/camsppold/speedpad.png","speedpadRed":"/textures/camsppold/speedpadred.png","speedpadBlue":"/textures/camsppold/speedpadblue.png","portal":"/textures/camsppold/portal.png","portalRed":"/textures/camsppold/portalred.png","portalBlue":"/textures/camsppold/portalblue.png","splats":"/textures/camsppold/splats.png","popularity":157841341,"popularityScore":"158"},{"name":"CMYK","author":"MagicPigeon","url":"cmyk","tiles":"/textures/cmyk/tiles.png","speedpad":"/textures/cmyk/speedpad.png","speedpadRed":"/textures/cmyk/speedpadred.png","speedpadBlue":"/textures/cmyk/speedpadblue.png","portal":"/textures/cmyk/portal.png","portalRed":"/textures/cmyk/portalred.png","portalBlue":"/textures/cmyk/portalblue.png","splats":"/textures/cmyk/splats.png","popularity":144688179,"popularityScore":"145"},{"name":"CamsPP Light","author":"Cam","url":"camspplight","tiles":"/textures/camspplight/tiles.png","speedpad":"/textures/camspplight/speedpad.png","speedpadRed":"/textures/camspplight/speedpadred.png","speedpadBlue":"/textures/camspplight/speedpadblue.png","portal":"/textures/camspplight/portal.png","portalRed":"/textures/camspplight/portalred.png","portalBlue":"/textures/camspplight/portalblue.png","splats":"/textures/camspplight/splats.png","popularity":135009946,"popularityScore":"135"},{"name":"Electric","author":"Bug","url":"electric","tiles":"/textures/electric/tiles.png","speedpad":"/textures/electric/speedpad.png","speedpadRed":"/textures/electric/speedpadred.png","speedpadBlue":"/textures/electric/speedpadblue.png","portal":"/textures/electric/portal.png","portalRed":"/textures/electric/portalred.png","portalBlue":"/textures/electric/portalblue.png","splats":"/textures/electric/splats.png","popularity":127175831,"popularityScore":"127"},{"name":"Sketch+","author":"MagicPigeon","url":"sketch","tiles":"/textures/sketch/tiles.png","speedpad":"/textures/sketch/speedpad.png","speedpadRed":"/textures/sketch/speedpadred.png","speedpadBlue":"/textures/sketch/speedpadblue.png","portal":"/textures/sketch/portal.png","portalRed":"/textures/sketch/portalred.png","portalBlue":"/textures/sketch/portalblue.png","splats":"/textures/sketch/splats.png","popularity":126489052,"popularityScore":"126"},{"name":"Sharp","author":"MagicPigeon","url":"sharp","tiles":"/textures/sharp/tiles.png","speedpad":"/textures/sharp/speedpad.png","speedpadRed":"/textures/sharp/speedpadred.png","speedpadBlue":"/textures/sharp/speedpadblue.png","portal":"/textures/sharp/portal.png","portalRed":"/textures/sharp/portalred.png","portalBlue":"/textures/sharp/portalblue.png","splats":"/textures/sharp/splats.png","popularity":103226439,"popularityScore":"103"},{"name":"PastelPro","author":"SuperTed","url":"pastelpro","tiles":"/textures/pastelpro/tiles.png","speedpad":"/textures/pastelpro/speedpad.png","speedpadRed":"/textures/pastelpro/speedpadred.png","speedpadBlue":"/textures/pastelpro/speedpadblue.png","portal":"/textures/pastelpro/portal.png","portalRed":"/textures/pastelpro/portalred.png","portalBlue":"/textures/pastelpro/portalblue.png","splats":"/textures/pastelpro/splats.png","popularity":99507002,"popularityScore":"100"},{"name":"Element+","author":"MagicPigeon","url":"element","tiles":"/textures/element/tiles.png","speedpad":"/textures/element/speedpad.png","speedpadRed":"/textures/element/speedpadred.png","speedpadBlue":"/textures/element/speedpadblue.png","portal":"/textures/element/portal.png","portalRed":"/textures/element/portalred.png","portalBlue":"/textures/element/portalblue.png","splats":"/textures/element/splats.png","popularity":98019109,"popularityScore":"98"},{"name":"Mural","author":"DaEvil1","url":"mural","tiles":"/textures/mural/tiles.png","speedpad":"/textures/mural/speedpad.png","speedpadRed":"/textures/mural/speedpadred.png","speedpadBlue":"/textures/mural/speedpadblue.png","portal":"/textures/mural/portal.png","portalRed":"/textures/mural/portalred.png","portalBlue":"/textures/mural/portalblue.png","splats":"/textures/mural/splats.png","popularity":80387834,"popularityScore":"80"},{"name":"Supreme","author":"bicycle","url":"supreme","tiles":"/textures/supreme/tiles.png","speedpad":"/textures/supreme/speedpad.png","speedpadRed":"/textures/supreme/speedpadred.png","speedpadBlue":"/textures/supreme/speedpadblue.png","portal":"/textures/supreme/portal.png","portalRed":"/textures/supreme/portalred.png","portalBlue":"/textures/supreme/portalblue.png","splats":"/textures/supreme/splats.png","popularity":69068153,"popularityScore":"69"},{"name":"Circlejerk","author":"Bizkut and Ion","url":"circlejerk","tiles":"/textures/circlejerk/tiles.png","speedpad":"/textures/circlejerk/speedpad.png","speedpadRed":"/textures/circlejerk/speedpadred.png","speedpadBlue":"/textures/circlejerk/speedpadblue.png","portal":"/textures/circlejerk/portal.png","portalRed":"/textures/circlejerk/portalred.png","portalBlue":"/textures/circlejerk/portalblue.png","splats":"/textures/circlejerk/splats.png","popularity":68828720,"popularityScore":"69"},{"name":"nom","author":"anom","url":"nom","tiles":"/textures/nom/tiles.png","speedpad":"/textures/nom/speedpad.png","speedpadRed":"/textures/nom/speedpadred.png","speedpadBlue":"/textures/nom/speedpadblue.png","portal":"/textures/nom/portal.png","portalRed":"/textures/nom/portalred.png","portalBlue":"/textures/nom/portalblue.png","splats":"/textures/nom/splats.png","popularity":58222444,"popularityScore":"58"},{"name":"Starlight","author":"MagicPigeon","url":"starlight","tiles":"/textures/starlight/tiles.png","speedpad":"/textures/starlight/speedpad.png","speedpadRed":"/textures/starlight/speedpadred.png","speedpadBlue":"/textures/starlight/speedpadblue.png","portal":"/textures/starlight/portal.png","portalRed":"/textures/starlight/portalred.png","portalBlue":"/textures/starlight/portalblue.png","splats":"/textures/starlight/splats.png","popularity":54456391,"popularityScore":"54"},{"name":"TerminalPX","author":"pooppants","url":"terminalpx","tiles":"/textures/terminalpx/tiles.png","speedpad":"/textures/terminalpx/speedpad.png","speedpadRed":"/textures/terminalpx/speedpadred.png","speedpadBlue":"/textures/terminalpx/speedpadblue.png","portal":"/textures/terminalpx/portal.png","portalRed":"/textures/terminalpx/portalred.png","portalBlue":"/textures/terminalpx/portalblue.png","splats":"/textures/terminalpx/splats.png","popularity":49589262,"popularityScore":"50"},{"name":"Brioche Light","author":"Brioche","url":"briochelight","tiles":"/textures/briochelight/tiles.png","speedpad":"/textures/briochelight/speedpad.png","speedpadRed":"/textures/briochelight/speedpadred.png","speedpadBlue":"/textures/briochelight/speedpadblue.png","portal":"/textures/briochelight/portal.png","portalRed":"/textures/briochelight/portalred.png","portalBlue":"/textures/briochelight/portalblue.png","splats":"/textures/briochelight/splats.png","popularity":46374492,"popularityScore":"46"},{"name":"Crystal","author":"MagicPigeon","url":"crystal","tiles":"/textures/crystal/tiles.png","speedpad":"/textures/crystal/speedpad.png","speedpadRed":"/textures/crystal/speedpadred.png","speedpadBlue":"/textures/crystal/speedpadblue.png","portal":"/textures/crystal/portal.png","portalRed":"/textures/crystal/portalred.png","portalBlue":"/textures/crystal/portalblue.png","splats":"/textures/crystal/splats.png","popularity":41009434,"popularityScore":"41"},{"name":"Bold","author":"MagicPigeon","url":"bold","tiles":"/textures/bold/tiles.png","speedpad":"/textures/bold/speedpad.png","speedpadRed":"/textures/bold/speedpadred.png","speedpadBlue":"/textures/bold/speedpadblue.png","portal":"/textures/bold/portal.png","portalRed":"/textures/bold/portalred.png","portalBlue":"/textures/bold/portalblue.png","splats":"/textures/bold/splats.png","popularity":35898990,"popularityScore":"36"},{"name":"Turbo","author":"Ooops","url":"turbo","tiles":"/textures/turbo/tiles.png","speedpad":"/textures/turbo/speedpad.png","speedpadRed":"/textures/turbo/speedpadred.png","speedpadBlue":"/textures/turbo/speedpadblue.png","portal":"/textures/turbo/portal.png","portalRed":"/textures/turbo/portalred.png","portalBlue":"/textures/turbo/portalblue.png","splats":"/textures/turbo/splats.png","popularity":35092795,"popularityScore":"35"},{"name":"Granata","author":"_Coffee_","url":"granata","tiles":"/textures/granata/tiles.png","speedpad":"/textures/granata/speedpad.png","speedpadRed":"/textures/granata/speedpadred.png","speedpadBlue":"/textures/granata/speedpadblue.png","portal":"/textures/granata/portal.png","portalRed":"/textures/granata/portalred.png","portalBlue":"/textures/granata/portalblue.png","splats":"/textures/granata/splats.png","popularity":32450816,"popularityScore":"32"},{"name":"Celeste","author":"MagicPigeon","url":"celeste","tiles":"/textures/celeste/tiles.png","speedpad":"/textures/celeste/speedpad.png","speedpadRed":"/textures/celeste/speedpadred.png","speedpadBlue":"/textures/celeste/speedpadblue.png","portal":"/textures/celeste/portal.png","portalRed":"/textures/celeste/portalred.png","portalBlue":"/textures/celeste/portalblue.png","splats":"/textures/celeste/splats.png","popularity":30547603,"popularityScore":"31"},{"name":"Brioche Deluxe","author":"Bumballbee and Brioche","url":"briochedeluxe","tiles":"/textures/briochedeluxe/tiles.png","speedpad":"/textures/briochedeluxe/speedpad.png","speedpadRed":"/textures/briochedeluxe/speedpadred.png","speedpadBlue":"/textures/briochedeluxe/speedpadblue.png","portal":"/textures/briochedeluxe/portal.png","portalRed":"/textures/briochedeluxe/portalred.png","portalBlue":"/textures/briochedeluxe/portalblue.png","splats":"/textures/briochedeluxe/splats.png","popularity":29724638,"popularityScore":"30"},{"name":"Brioche Extra Light","author":"Brioche","url":"briocheextralight","tiles":"/textures/briocheextralight/tiles.png","speedpad":"/textures/briocheextralight/speedpad.png","speedpadRed":"/textures/briocheextralight/speedpadred.png","speedpadBlue":"/textures/briocheextralight/speedpadblue.png","portal":"/textures/briocheextralight/portal.png","portalRed":"/textures/briocheextralight/portalred.png","portalBlue":"/textures/briocheextralight/portalblue.png","splats":"/textures/briocheextralight/splats.png","popularity":28923330,"popularityScore":"29"},{"name":"TagPro Next Classic","author":"KoalaBeast, MagicPigeon, Ronding","url":"tagpronextclassic","tiles":"/textures/tagpronextclassic/tiles.png","speedpad":"/textures/tagpronextclassic/speedpad.png","speedpadRed":"/textures/tagpronextclassic/speedpadred.png","speedpadBlue":"/textures/tagpronextclassic/speedpadblue.png","portal":"/textures/tagpronextclassic/portal.png","portalRed":"/textures/tagpronextclassic/portalred.png","portalBlue":"/textures/tagpronextclassic/portalblue.png","splats":"/textures/tagpronextclassic/splats.png","popularity":27984534,"popularityScore":"28"},{"name":"Flat (Bug)","author":"Bug","url":"flatbug","tiles":"/textures/flatbug/tiles.png","speedpad":"/textures/flatbug/speedpad.png","speedpadRed":"/textures/flatbug/speedpadred.png","speedpadBlue":"/textures/flatbug/speedpadblue.png","portal":"/textures/flatbug/portal.png","portalRed":"/textures/flatbug/portalred.png","portalBlue":"/textures/flatbug/portalblue.png","splats":"/textures/flatbug/splats.png","popularity":24945237,"popularityScore":"25"},{"name":"Maxima","author":"MagicPigeon","url":"maxima","tiles":"/textures/maxima/tiles.png","speedpad":"/textures/maxima/speedpad.png","speedpadRed":"/textures/maxima/speedpadred.png","speedpadBlue":"/textures/maxima/speedpadblue.png","portal":"/textures/maxima/portal.png","portalRed":"/textures/maxima/portalred.png","portalBlue":"/textures/maxima/portalblue.png","splats":"/textures/maxima/splats.png","popularity":24314189,"popularityScore":"24"},{"name":"Jello","author":"MC Ride","url":"jello","tiles":"/textures/jello/tiles.png","speedpad":"/textures/jello/speedpad.png","speedpadRed":"/textures/jello/speedpadred.png","speedpadBlue":"/textures/jello/speedpadblue.png","portal":"/textures/jello/portal.png","portalRed":"/textures/jello/portalred.png","portalBlue":"/textures/jello/portalblue.png","splats":"/textures/jello/splats.png","popularity":19824774,"popularityScore":"20"},{"name":"Chip","author":"anom","url":"chip","tiles":"/textures/chip/tiles.png","speedpad":"/textures/chip/speedpad.png","speedpadRed":"/textures/chip/speedpadred.png","speedpadBlue":"/textures/chip/speedpadblue.png","portal":"/textures/chip/portal.png","portalRed":"/textures/chip/portalred.png","portalBlue":"/textures/chip/portalblue.png","splats":"/textures/chip/splats.png","popularity":17452655,"popularityScore":"17"},{"name":"Wave","author":"Waterwheel","url":"wave","tiles":"/textures/wave/tiles.png","speedpad":"/textures/wave/speedpad.png","speedpadRed":"/textures/wave/speedpadred.png","speedpadBlue":"/textures/wave/speedpadblue.png","portal":"/textures/wave/portal.png","portalRed":"/textures/wave/portalred.png","portalBlue":"/textures/wave/portalblue.png","splats":"/textures/wave/splats.png","popularity":16795172,"popularityScore":"17"},{"name":"Mumbo","author":"MagicPigeon","url":"mumbo","tiles":"/textures/mumbo/tiles.png","speedpad":"/textures/mumbo/speedpad.png","speedpadRed":"/textures/mumbo/speedpadred.png","speedpadBlue":"/textures/mumbo/speedpadblue.png","portal":"/textures/mumbo/portal.png","portalRed":"/textures/mumbo/portalred.png","portalBlue":"/textures/mumbo/portalblue.png","splats":"/textures/mumbo/splats.png","popularity":14947784,"popularityScore":"15"},{"name":"Funko","author":"MC Ride","url":"funko","tiles":"/textures/funko/tiles.png","speedpad":"/textures/funko/speedpad.png","speedpadRed":"/textures/funko/speedpadred.png","speedpadBlue":"/textures/funko/speedpadblue.png","portal":"/textures/funko/portal.png","portalRed":"/textures/funko/portalred.png","portalBlue":"/textures/funko/portalblue.png","splats":"/textures/funko/splats.png","popularity":7612965,"popularityScore":"8"},{"name":"Ancient Gems","author":"Flaccid Trip ft. jazzz","url":"ancientgems","tiles":"/textures/ancientgems/tiles.png","speedpad":"/textures/ancientgems/speedpad.png","speedpadRed":"/textures/ancientgems/speedpadred.png","speedpadBlue":"/textures/ancientgems/speedpadblue.png","portal":"/textures/ancientgems/portal.png","portalRed":"/textures/ancientgems/portalred.png","portalBlue":"/textures/ancientgems/portalblue.png","splats":"/textures/ancientgems/splats.png","popularity":5546128,"popularityScore":"6"},{"name":"Yin & Yang","author":"_Coffee_","url":"yinyang","tiles":"/textures/yinyang/tiles.png","speedpad":"/textures/yinyang/speedpad.png","speedpadRed":"/textures/yinyang/speedpadred.png","speedpadBlue":"/textures/yinyang/speedpadblue.png","portal":"/textures/yinyang/portal.png","portalRed":"/textures/yinyang/portalred.png","portalBlue":"/textures/yinyang/portalblue.png","splats":"/textures/yinyang/splats.png","popularity":5255750,"popularityScore":"5"},{"name":"Spongepack","author":"_Coffee_","url":"spongepack","tiles":"/textures/spongepack/tiles.png","speedpad":"/textures/spongepack/speedpad.png","speedpadRed":"/textures/spongepack/speedpadred.png","speedpadBlue":"/textures/spongepack/speedpadblue.png","portal":"/textures/spongepack/portal.png","portalRed":"/textures/spongepack/portalred.png","portalBlue":"/textures/spongepack/portalblue.png","splats":"/textures/spongepack/splats.png","popularity":5125995,"popularityScore":"5"},{"name":"Xmas","author":"jazzz","url":"xmas","tiles":"/textures/xmas/tiles.png","speedpad":"/textures/xmas/speedpad.png","speedpadRed":"/textures/xmas/speedpadred.png","speedpadBlue":"/textures/xmas/speedpadblue.png","portal":"/textures/xmas/portal.png","portalRed":"/textures/xmas/portalred.png","portalBlue":"/textures/xmas/portalblue.png","splats":"/textures/xmas/splats.png","popularity":3897718,"popularityScore":"4"},{"name":"Afloat","author":"Pingu","url":"afloat","tiles":"/textures/afloat/tiles.png","speedpad":"/textures/afloat/speedpad.png","speedpadRed":"/textures/afloat/speedpadred.png","speedpadBlue":"/textures/afloat/speedpadblue.png","portal":"/textures/afloat/portal.png","portalRed":"/textures/afloat/portalred.png","portalBlue":"/textures/afloat/portalblue.png","splats":"/textures/afloat/splats.png","popularity":2873024,"popularityScore":"3"},{"name":"Twine","author":"Flaccid Trip","url":"twine","tiles":"/textures/twine/tiles.png","speedpad":"/textures/twine/speedpad.png","speedpadRed":"/textures/twine/speedpadred.png","speedpadBlue":"/textures/twine/speedpadblue.png","portal":"/textures/twine/portal.png","portalRed":"/textures/twine/portalred.png","portalBlue":"/textures/twine/portalblue.png","splats":"/textures/twine/splats.png","popularity":2340488,"popularityScore":"2"},{"name":"Bowling","author":"_Coffee_","url":"bowling","tiles":"/textures/bowling/tiles.png","speedpad":"/textures/bowling/speedpad.png","speedpadRed":"/textures/bowling/speedpadred.png","speedpadBlue":"/textures/bowling/speedpadblue.png","portal":"/textures/bowling/portal.png","portalRed":"/textures/bowling/portalred.png","portalBlue":"/textures/bowling/portalblue.png","splats":"/textures/bowling/splats.png","popularity":913939,"popularityScore":"1"},{"name":"Supreme Shine","author":"Flaccid Trip","url":"supremeshine","tiles":"/textures/supremeshine/tiles.png","speedpad":"/textures/supremeshine/speedpad.png","speedpadRed":"/textures/supremeshine/speedpadred.png","speedpadBlue":"/textures/supremeshine/speedpadblue.png","portal":"/textures/supremeshine/portal.png","portalRed":"/textures/supremeshine/portalred.png","portalBlue":"/textures/supremeshine/portalblue.png","splats":"/textures/supremeshine/splats.png","popularity":696670,"popularityScore":"1"},{"name":"Softpaint","author":"Xcissors ft. anom","url":"softpaint","tiles":"/textures/softpaint/tiles.png","speedpad":"/textures/softpaint/speedpad.png","speedpadRed":"/textures/softpaint/speedpadred.png","speedpadBlue":"/textures/softpaint/speedpadblue.png","portal":"/textures/softpaint/portal.png","portalRed":"/textures/softpaint/portalred.png","portalBlue":"/textures/softpaint/portalblue.png","splats":"/textures/softpaint/splats.png","popularity":618115,"popularityScore":"1"},{"name":"Return","author":"Flaccid Trip","url":"return","tiles":"/textures/return/tiles.png","speedpad":"/textures/return/speedpad.png","speedpadRed":"/textures/return/speedpadred.png","speedpadBlue":"/textures/return/speedpadblue.png","portal":"/textures/return/portal.png","portalRed":"/textures/return/portalred.png","portalBlue":"/textures/return/portalblue.png","splats":"/textures/return/splats.png","popularity":149148,"popularityScore":"0"}]}
    const wallTypes = {
        "787878": { wallSolids: 0xff },
        "804070": { wallSolids: 0x2d },
        "408050": { wallSolids: 0xd2 },
        "405080": { wallSolids: 0x4b },
        "807040": { wallSolids: 0xb4 }
    };

    const quadrantCoords = {
      "132": [10.5, 7.5],
      "232": [11, 7.5],
      "332": [11, 8],
      "032": [10.5, 8],
      "132d": [0.5, 3.5],
      "232d": [1, 3.5],
      "032d": [0.5, 4],
      "143": [4.5, 9.5],
      "243": [5, 9.5],
      "343": [5, 10],
      "043": [4.5, 10],
      "143d": [1.5, 2.5],
      "243d": [2, 2.5],
      "043d": [1.5, 3],
      "154": [6.5, 9.5],
      "254": [7, 9.5],
      "354": [7, 10],
      "054": [6.5, 10],
      "154d": [9.5, 2.5],
      "254d": [10, 2.5],
      "354d": [10, 3],
      "165": [0.5, 7.5],
      "265": [1, 7.5],
      "365": [1, 8],
      "065": [0.5, 8],
      "165d": [10.5, 3.5],
      "265d": [11, 3.5],
      "365d": [11, 4],
      "176": [1.5, 6.5],
      "276": [2, 6.5],
      "376": [2, 7],
      "076": [1.5, 7],
      "276d": [9, 1.5],
      "376d": [9, 2],
      "076d": [8.5, 2],
      "107": [6.5, 8.5],
      "207": [7, 8.5],
      "307": [7, 9],
      "007": [6.5, 9],
      "207d": [11, 1.5],
      "307d": [11, 2],
      "007d": [10.5, 2],
      "110": [4.5, 8.5],
      "210": [5, 8.5],
      "310": [5, 9],
      "010": [4.5, 9],
      "110d": [0.5, 1.5],
      "310d": [1, 2],
      "010d": [0.5, 2],
      "121": [9.5, 6.5],
      "221": [10, 6.5],
      "321": [10, 7],
      "021": [9.5, 7],
      "121d": [2.5, 1.5],
      "321d": [3, 2],
      "021d": [2.5, 2],
      "142": [1.5, 7.5],
      "242": [2, 7.5],
      "042": [1.5, 8],
      "142d": [10.5, 0.5],
      "242d": [11, 0.5],
      "042d": [10.5, 1],
      "153": [5.5, 6.5],
      "253": [6, 6.5],
      "353": [6, 7],
      "053": [5.5, 7],
      "153d": [5.5, 0.5],
      "253d": [6, 0.5],
      "164": [9.5, 7.5],
      "264": [10, 7.5],
      "364": [10, 8],
      "164d": [0.5, 0.5],
      "264d": [1, 0.5],
      "364d": [1, 1],
      "175": [4.5, 5.5],
      "275": [5, 5.5],
      "375": [5, 6],
      "075": [4.5, 6],
      "275d": [7, 1.5],
      "375d": [7, 2],
      "206": [4.5, 9.5],
      "306": [4.5, 10],
      "006": [3.5, 10],
      "206d": [2, 3.5],
      "306d": [2, 4],
      "006d": [1.5, 4],
      "117": [5.5, 2.5],
      "217": [6, 2.5],
      "317": [6, 4],
      "017": [5.5, 4],
      "317d": [6, 3],
      "017d": [5.5, 3],
      "120": [7.5, 9.5],
      "320": [8, 10],
      "020": [7.5, 10],
      "120d": [9.5, 3.5],
      "320d": [10, 4],
      "020d": [9.5, 4],
      "131": [6.5, 5.5],
      "231": [7, 5.5],
      "331": [7, 6],
      "031": [6.5, 6],
      "131d": [4.5, 1.5],
      "031d": [4.5, 2],
      "141": [7.5, 8.5],
      "241": [8, 8.5],
      "323": [4, 5],
      "041": [7.5, 9],
      "141d": [8.5, 3.5],
      "041d": [8.5, 4],
      "152": [8.5, 7.5],
      "252": [9, 7.5],
      "334": [2, 0],
      "052": [8.5, 8],
      "152d": [3.5, 0.5],
      "252d": [4, 0.5],
      "163": [2, 7.5],
      "263": [3, 7.5],
      "363": [3, 8],
      "045": [9.5, 0],
      "163d": [7.5, 0.5],
      "263d": [8, 0.5],
      "174": [3.5, 8.5],
      "274": [4, 8.5],
      "374": [4, 9],
      "056": [7.5, 5],
      "274d": [3, 3.5],
      "374d": [3, 4],
      "167": [7.5, 6.5],
      "205": [10, 8.5],
      "305": [10, 9],
      "005": [9.5, 9],
      "205d": [2, 0.5],
      "305d": [2, 1],
      "170": [6.5, 7.5],
      "216": [9, 9.5],
      "316": [9, 10],
      "016": [8.5, 10],
      "316d": [10, 5],
      "016d": [9.5, 5],
      "127": [2.5, 9.5],
      "201": [5, 7.5],
      "327": [3, 10],
      "027": [2.5, 10],
      "327d": [2, 5],
      "027d": [1.5, 5],
      "130": [1.5, 8.5],
      "212": [4, 6.5],
      "330": [2, 9],
      "030": [1.5, 9],
      "130d": [9.5, 0.5],
      "030d": [9.5, 1],
      "151": [10.5, 9.5],
      "251": [11, 9.5],
      "324": [0, 7],
      "051": [10.5, 10],
      "151d": [10.5, 4.5],
      "324d": [0, 0],
      "162": [8.5, 10.5],
      "262": [9, 10.5],
      "335": [6, 8],
      "035": [5.5, 8],
      "162d": [3.5, 2.5],
      "262d": [8, 2.5],
      "173": [0.5, 9.5],
      "273": [1, 9.5],
      "373": [1, 10],
      "046": [11.5, 7],
      "046d": [11.5, 0],
      "273d": [1, 4.5],
      "157": [11.5, 8.5],
      "204": [0, 5.5],
      "304": [0, 5],
      "057": [11.5, 9],
      "204d": [0, 4.5],
      "304d": [0, 6],
      "160": [11.5, 7.5],
      "215": [8, 6.5],
      "315": [8, 7],
      "015": [7.5, 7],
      "160d": [2.5, 4.5],
      "315d": [9, 3],
      "171": [5.5, 10.5],
      "271": [6, 10.5],
      "326": [6, 5],
      "026": [5.5, 5],
      "326d": [7, 5],
      "026d": [4.5, 5],
      "137": [3.5, 6.5],
      "202": [0, 7.5],
      "337": [4, 7],
      "037": [3.5, 7],
      "202d": [9, 4.5],
      "037d": [2.5, 3],
      "140": [11.5, 5.5],
      "213": [0, 8.5],
      "313": [0, 9],
      "040": [11.5, 5],
      "140d": [11.5, 4.5],
      "040d": [11.5, 6],
      "161": [9.5, 10.5],
      "261": [10, 10.5],
      "325": [9, 6],
      "025": [8.5, 6],
      "161d": [3.5, 1.5],
      "325d": [4, 1],
      "172": [1.5, 10.5],
      "272": [2, 10.5],
      "336": [3, 6],
      "036": [2.5, 6],
      "036d": [7.5, 1],
      "272d": [8, 1.5],
      "147": [4.5, 7.5],
      "203": [4, 3.5],
      "303": [4, 4],
      "047": [4.5, 8],
      "047d": [8.5, 5],
      "203d": [8, 4.5],
      "150": [7.5, 3.5],
      "214": [7, 7.5],
      "314": [7, 8],
      "050": [7.5, 4],
      "150d": [3.5, 4.5],
      "314d": [3, 5],
      "100": [5.5, 5.5],
      "200": [6, 5.5],
      "300": [6, 6],
      "000": [5.5, 6],
      "100d": [5.5, 8.5],
      "200d": [6, 8.5],
      "300d": [6, 10],
      "000d": [5.5, 10]
    };

    // ----------------------------
    // Global Image Variables
    // ----------------------------
    let images = {
        tile: null,
        speedpad: null,
        speedpadRed: null,
        speedpadBlue: null,
        portal: null,
        portalRed: null,
        portalBlue: null
    };

    // ----------------------------
    // JSON Gate Data Explanation
    // ----------------------------
    // (See description above)
    // ----------------------------
    let originalPNGImage = null;
    let mapJSONData = null;
    let wallMap = [];
    // Set currentTexturePack from localStorage if available.
    let currentTexturePack = textures.texturePacks[0];
    const savedTexture = localStorage.getItem('fm_selected_texturePack');
    if (savedTexture) {
        const found = textures.texturePacks.find(tp => tp.url === savedTexture);
        if (found) {
            currentTexturePack = found;
            console.log("[FM] Loaded saved texture pack:", currentTexturePack.name);
        }
    }

    // ----------------------------
    // Utility: waitForElement
    // ----------------------------
    function waitForElement(selector, callback, timeout = 10000) {
        const start = Date.now();
        (function check() {
            const el = document.querySelector(selector);
            if (el) {
                console.log(`[FM] Found element for selector "${selector}"`);
                callback(el);
            } else if (Date.now() - start > timeout) {
                console.warn(`[FM] Timeout waiting for element: ${selector}`);
            } else {
                setTimeout(check, 200);
            }
        })();
    }

    // ----------------------------
    // Utility Functions
    // ----------------------------
    function rgbToHex(r, g, b) {
        return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    // loadImage prepends baseUrl if needed.
    function loadImage(url) {
        if (url.startsWith("/")) {
            url = baseUrl + url;
        }
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                console.log(`[FM] Loaded image: ${url}`);
                resolve(img);
            };
            img.onerror = (e) => {
                console.error(`[FM] Error loading image: ${url}`, e);
                reject(e);
            };
            img.src = url;
        });
    }

    function getFloorTile(key) {
        if (key === "ffff00") {
            return { image: images.speedpad, y: 0, x: 0 };
        } else if (key === "ff7373") {
            return { image: images.speedpadRed, y: 0, x: 0 };
        } else if (key === "7373ff") {
            return { image: images.speedpadBlue, y: 0, x: 0 };
        } else if (key === "cac000") {
            return { image: images.portal, x: 0, y: 0 };
        } else if (key === "cc3300") {
            return { image: images.portalRed, x: 0, y: 0 };
        } else if (key === "0066cc") {
            return { image: images.portalBlue, x: 0, y: 0 };
        } else if (floorTiles.hasOwnProperty(key)) {
            return { image: images.tile, x: floorTiles[key].x, y: floorTiles[key].y };
        } else {
            return null;
        }
    }

    function wallSolidsAt(col, row) {
        if (col < 0 || row < 0 || row >= wallMap.length || col >= wallMap[0].length) return 0;
        return wallMap[row][col];
    }

    function drawWallTile(ctx, col, row) {
        const solids = wallMap[row][col];
        if (!solids) return;
        for (let q = 0; q < 4; q++) {
            const mask = (solids >> (q << 1)) & 3;
            if (mask === 0) continue;
            const cornerX = col + ((q & 2) === 0 ? 1 : 0);
            const cornerY = row + (((q + 1) & 2) === 0 ? 0 : 1);
            let aroundCorner =
                (wallSolidsAt(cornerX, cornerY) & 0xc0) |
                (wallSolidsAt(cornerX - 1, cornerY) & 0x03) |
                (wallSolidsAt(cornerX - 1, cornerY - 1) & 0x0c) |
                (wallSolidsAt(cornerX, cornerY - 1) & 0x30);
            aroundCorner |= (aroundCorner << 8);
            const startDirection = q * 2 + 1;
            let cwSteps = 0;
            while (cwSteps < 8 && (aroundCorner & (1 << (startDirection + cwSteps)))) { cwSteps++; }
            let ccwSteps = 0;
            while (ccwSteps < 8 && (aroundCorner & (1 << (startDirection + 7 - ccwSteps)))) { ccwSteps++; }
            const hasChip = (mask === 3 && (((solids | (solids << 8)) >> ((q + 2) << 1)) & 3) === 0);
            let solidStart, solidEnd;
            if (cwSteps === 8) {
                solidStart = solidEnd = 0;
            } else {
                solidEnd = (startDirection + cwSteps + 4) % 8;
                solidStart = (startDirection - ccwSteps + 12) % 8;
            }
            const key = `${q}${solidStart}${solidEnd}${hasChip ? "d" : ""}`;
            const coords = quadrantCoords[key] || [5.5, 5.5];
            let destX = col * config.tileSize;
            let destY = row * config.tileSize;
            if (q === 0) destX += config.quadSize;
            else if (q === 1) { destX += config.quadSize; destY += config.quadSize; }
            else if (q === 2) destY += config.quadSize;
            const srcX = coords[0] * 40;
            const srcY = coords[1] * 40;
            ctx.drawImage(images.tile, srcX, srcY, config.quadSize, config.quadSize,
                          destX, destY, config.quadSize, config.quadSize);
        }
    }

    function fetchMapData(mapCode) {
        const pngURL = `https://fortunatemaps.herokuapp.com/png/${mapCode}.png`;
        const jsonURL = `https://fortunatemaps.herokuapp.com/json/${mapCode}.json`;
        console.log(`[FM] Fetching map data for code: ${mapCode}`);
        return Promise.all([
            fetch(pngURL)
                .then(res => res.blob())
                .then(blob => {
                    console.log("[FM] PNG fetched successfully");
                    return URL.createObjectURL(blob);
                }),
            fetch(jsonURL)
                .then(res => res.json())
                .then(json => {
                    console.log("[FM] JSON fetched successfully:", json);
                    return json;
                })
        ]);
    }

    async function processMap() {
        if (!originalPNGImage) return;
        console.log("[FM] Starting map processing...");

        try {
            images.tile = await loadImage(currentTexturePack.tiles);
            images.speedpad = await loadImage(currentTexturePack.speedpad);
            images.speedpadRed = await loadImage(currentTexturePack.speedpadRed);
            images.speedpadBlue = await loadImage(currentTexturePack.speedpadBlue);
            images.portal = await loadImage(currentTexturePack.portal);
            images.portalRed = await loadImage(currentTexturePack.portalRed);
            images.portalBlue = await loadImage(currentTexturePack.portalBlue);
        } catch(e) {
            console.error("[FM] Error loading texture images", e);
            return;
        }
        console.log("[FM] All texture images loaded");

        const offCanvas = document.createElement('canvas');
        offCanvas.width = originalPNGImage.width;
        offCanvas.height = originalPNGImage.height;
        const offCtx = offCanvas.getContext('2d');
        offCtx.drawImage(originalPNGImage, 0, 0);
        console.log("[FM] Offscreen canvas drawn");
        const imageData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
        const data = imageData.data;

        wallMap = [];
        for (let y = 0; y < offCanvas.height; y++) {
            wallMap[y] = [];
            for (let x = 0; x < offCanvas.width; x++) {
                const idx = (y * offCanvas.width + x) * 4;
                const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
                const hex = rgbToHex(r, g, b).toLowerCase();
                wallMap[y][x] = (a === 0) ? 0 : (wallTypes.hasOwnProperty(hex) ? wallTypes[hex].wallSolids : 0);
            }
        }
        console.log("[FM] wallMap built:", wallMap);

        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = offCanvas.width * config.tileSize;
        finalCanvas.height = offCanvas.height * config.tileSize;
        const finalCtx = finalCanvas.getContext('2d');
        finalCtx.imageSmoothingEnabled = false;
        console.log("[FM] Final canvas created");

        const defaultFloorTile = getFloorTile("d4d4d4");
        if (defaultFloorTile) {
            const sx = defaultFloorTile.x * config.tileSize;
            const sy = defaultFloorTile.y * config.tileSize;
            for (let y = 0; y < offCanvas.height; y++) {
                for (let x = 0; x < offCanvas.width; x++) {
                    finalCtx.drawImage(defaultFloorTile.image, sx, sy, config.tileSize, config.tileSize,
                                       x * config.tileSize, y * config.tileSize, config.tileSize, config.tileSize);
                }
            }
        }

        for (let y = 0; y < offCanvas.height; y++) {
            for (let x = 0; x < offCanvas.width; x++) {
                const idx = (y * offCanvas.width + x) * 4;
                const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
                if (a === 0) continue;
                const hex = rgbToHex(r, g, b).toLowerCase();
                if (wallTypes.hasOwnProperty(hex)) continue;
                let tileSource = null;
                if (hex === "007500") {
                    const fieldKey = `${x},${y}`;
                    let state = "empty"; // Default state remains "empty"
                    if (mapJSONData && mapJSONData.fields && mapJSONData.fields[fieldKey]) {
                        let ds = mapJSONData.fields[fieldKey].defaultState;
                        if (ds === "on") {
                            state = "green";
                        } else if (ds === "off") {
                            state = "empty"; // Change "off" to "empty"
                        } else {
                            state = ds;
                        }
                    }
                    const tileKey = "007500_" + state;
                    tileSource = getFloorTile(tileKey);
                } else {
                    tileSource = getFloorTile(hex);
                }
                if (tileSource) {
                    const sx = tileSource.x * config.tileSize;
                    const sy = tileSource.y * config.tileSize;
                    finalCtx.drawImage(tileSource.image, sx, sy, config.tileSize, config.tileSize,
                                       x * config.tileSize, y * config.tileSize, config.tileSize, config.tileSize);
                } else {
                    finalCtx.fillStyle = "#000000";
                    finalCtx.fillRect(x * config.tileSize, y * config.tileSize, config.tileSize, config.tileSize);
                }
            }
        }
        console.log("[FM] Floor and gate tiles drawn");


        if (mapJSONData && mapJSONData.portals) {
            Object.entries(mapJSONData.portals).forEach(([key, portalData]) => {
                if (!portalData.hasOwnProperty("destination")) {
                    const [x, y] = key.split(",").map(Number);
                    const sx = 4 * config.tileSize; // source x: tile column 4
                    const sy = 0 * config.tileSize; // source y: tile row 0
                    finalCtx.drawImage(images.portal, sx, sy, config.tileSize, config.tileSize,
                        x * config.tileSize, y * config.tileSize, config.tileSize, config.tileSize);
                    console.log(`[FM] Exit portal drawn at ${x},${y}`);
                }
            });
        }
        // ------------------------------------

        for (let y = 0; y < wallMap.length; y++) {
            for (let x = 0; x < wallMap[0].length; x++) {
                if (wallMap[y][x] !== 0) {
                    drawWallTile(finalCtx, x, y);
                }
            }
        }
        console.log("[FM] Wall tiles overlaid");

        // Marsball rendering:
        // For each marsball in the JSON, draw an 80x80 image from the tiles texture (source: 12*40, 9*40)
        // Now centered over the tile instead of having its top-left corner at the tile's top-left.
        if (mapJSONData && mapJSONData.marsballs) {
            mapJSONData.marsballs.forEach(mars => {
                // Calculate destination so the marsball is centered over the tile.
                const destX = mars.x * config.tileSize - config.tileSize/2;
                const destY = mars.y * config.tileSize - config.tileSize/2;
                finalCtx.drawImage(
                    images.tile,
                    12 * config.tileSize, 9 * config.tileSize, 2 * config.tileSize, 2 * config.tileSize,
                    destX, destY, 2 * config.tileSize, 2 * config.tileSize
                );
            });
            console.log("[FM] Marsballs drawn");
        }

        waitForElement('img.card-img-top', function(previewImg) {
            previewImg.src = finalCanvas.toDataURL();
            console.log("[FM] Preview image updated");
        });
    }

    // ----------------------------
    // UI: Texture Pack Dropdown with Search & Scrollbar
    // ----------------------------
    function addTextureDropdown() {
        const referenceDiv = document.querySelector('main.container div.row.mb-2 div.col-md-4 div.card.stats-card div.card-body div.dropdown.w-100.mt-2');
        if (!referenceDiv) {
            console.error("[FM] Reference dropdown not found");
            return;
        }
        const textureContainerHTML = `
            <div id="fm-texture-container">
                <div class="dropdown w-100 mt-2" id="fm-texture-dropdown">
                    <button class="btn btn-primary w-100 dropdown-toggle" type="button" id="fm-dropdown-button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        ${currentTexturePack.name}
                    </button>
                    <div class="dropdown-menu" aria-labelledby="fm-dropdown-button" style="max-height: 200px; overflow-y: auto; padding: 0.5rem;">
                        <div class="px-2">
                            <input type="text" id="fm-dropdown-search" class="form-control form-control-sm" placeholder="Search Texture Packs...">
                        </div>
                        <div id="fm-dropdown-items">
                            ${textures.texturePacks.map(tp => `<a class="dropdown-item" href="#" data-value="${tp.url}">${tp.name}</a>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        referenceDiv.insertAdjacentHTML('afterend', textureContainerHTML);
        console.log("[FM] Texture pack dropdown container inserted directly below the reference dropdown");

        function filterItems() {
            const query = document.getElementById('fm-dropdown-search').value.toLowerCase();
            const items = document.querySelectorAll('#fm-dropdown-items .dropdown-item');
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.indexOf(query) > -1 ? "" : "none";
            });
        }

        const searchInput = document.getElementById('fm-dropdown-search');
        searchInput.addEventListener('input', filterItems);

        const items = document.querySelectorAll('#fm-dropdown-items .dropdown-item');
        items.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const selectedUrl = this.getAttribute('data-value');
                const selectedTexture = textures.texturePacks.find(tp => tp.url === selectedUrl);
                if (selectedTexture && selectedTexture.url !== currentTexturePack.url) {
                    currentTexturePack = selectedTexture;
                    localStorage.setItem('fm_selected_texturePack', selectedTexture.url);
                    console.log("[FM] Texture pack changed to:", selectedTexture.name);
                    processMap();
                    document.getElementById('fm-dropdown-button').textContent = selectedTexture.name;
                }
            });
        });
    }

    // ----------------------------
    // Main Execution
    // ----------------------------
    function main() {
        console.log("[FM] Main execution started");
        const mapCodeMatch = window.location.href.match(/\/map\/(\d+)/);
        if (!mapCodeMatch) {
            console.error("[FM] No map code found in URL");
            return;
        }
        const mapCode = mapCodeMatch[1];
        console.log("[FM] Map code:", mapCode);

        fetchMapData(mapCode)
            .then(([pngObjectUrl, jsonData]) => {
                mapJSONData = jsonData;
                console.log("[FM] Map JSON data stored");
                return loadImage(pngObjectUrl);
            })
            .then(img => {
                originalPNGImage = img;
                console.log("[FM] Original PNG loaded");
                processMap();
            })
            .catch(err => console.error("[FM] Error fetching or processing map data:", err));

        addTextureDropdown();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", main);
    } else {
        main();
    }
})();

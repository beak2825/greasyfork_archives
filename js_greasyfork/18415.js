// ==UserScript==
// @name         UGC Icon Switcher
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @namespace    https://greasyfork.org/en/users/36444
// @version      0.5
// @description  changes the icons at UGC
// @author       GardenShade
// @match        https://*.ultimategamer.club/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18415/UGC%20Icon%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/18415/UGC%20Icon%20Switcher.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// UGC ICON SWITCHER
$(function() {
    icon_build(10,'https://i.imgur.com/m3LAHoQ.png'); //pc
    icon_build(11,'https://i.imgur.com/ctQ9hEs.png'); //apple
    icon_build(47,'https://i.imgur.com/1vsNDrj.png'); //linux
    icon_build(14,'https://i.imgur.com/DyltQBk.png'); //xbox
    icon_build(43,'https://i.imgur.com/bRkgB6E.png'); //ps
    icon_build(12,'https://i.imgur.com/LBMJjYM.png'); //psn
    icon_build(15,'https://i.imgur.com/r2RnPBX.png'); //ds
    icon_build(44,'https://i.imgur.com/mj2jTHC.png'); //wii
    icon_build(46,'https://i.imgur.com/TWV9cQm.png'); //wii u
    icon_build(49,'https://i.imgur.com/aEdqFM6.png'); //mobile
    icon_build(48,'https://i.imgur.com/x4QmytE.png'); //retro
    icon_build(50,'https://i.imgur.com/vvLfNZ8.png'); //adult
    icon_build(17,'https://i.imgur.com/3JghKKU.png'); //guides
    icon_build(51,'https://i.imgur.com/7BzgOQe.png'); //staff picks
    icon_build(52,'https://i.imgur.com/VZ4L0fs.png'); //ost
    icon_build(53,'https://i.imgur.com/pZsnkaf.png'); //books
    icon_build(54,'https://i.imgur.com/3jghpQs.png'); //updates
})

function icon_build(cat,link){
    $('a[href*="cat='+cat+'"] > img').each(function(){
        $(this).attr('src',link);
    });
}
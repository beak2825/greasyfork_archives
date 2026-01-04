// ==UserScript==
// @name         TagPro Colors
// @version      0.2
// @description  Change the red/blue colors in the TagPro UI to any color you like. Useful when using a texture pack with different colors.
// @author       Ko
// @include      http://tagpro-*.koalabeast.com:*
// @include      http://tangent.jukejuice.com:*
// @include      http://*.newcompte.fr:*
// @include      http://tagpro-*.koalabeast.com/game
// @include      http://tangent.jukejuice.com/game
// @include      http://*.newcompte.fr/game
// @namespace https://greasyfork.org/users/152992
// @downloadURL https://update.greasyfork.org/scripts/33270/TagPro%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/33270/TagPro%20Colors.meta.js
// ==/UserScript==

// #-#-# OPTIONS #-#-# \\


// These names are shown at the end of a game ('Pink wins!')
Red_teamName = 'Pink';
Blue_teamName = 'Green';


// You can either use HtML color names, or #HEX color codes.
// Tip: search for a 'hex color picker' to pick your color.
Red_color = 'pink';
Blue_color = '#33cc33';


// #-#-# OPTIONS #-#-# \\




    //--------------------------------------------------//
    //       SCROLL FURTHER DOWN AT YOUR OWN RISK       //
    //--------------------------------------------------//



window.addEventListener('load', function() {      // without this, it gives an error: the tagpro.ui.redscore.style doesn't yet exist.

    tagpro.ready(function colors () {
        tagpro.ui.sprites.redScore.setStyle({fill: Red_color, font:"bold 40pt Arial" , strokeThickness :2});         // Set color of Red team score
        tagpro.ui.sprites.blueScore.setStyle({fill: Blue_color, font:"bold 40pt Arial" , strokeThickness :2}) ;      // Same for blue



        tagpro.teamNames.redTeamName = Red_teamName;         //change the teamnames, to change the '... team Wins' message at the end.
        tagpro.teamNames.blueTeamName = Blue_teamName;
        tagpro.settings.ui.teamNames = "TagPro Colors Userscript";     //hide the teamnames next to the scores.


        tagpro.socket.on('end',function() {     // add listener for the game to end
            setTimeout(function() {             // give TP the time to write who wins
                tagpro.renderer.layers.ui.children.forEach(function(a){      // get all UI elements (containing the 'Pink Wins' message)
                    try { // necessary because not every element has a .style.fill
                        if (a.style.fill == "#ff0000" && Red_color != 'red') a.setStyle({fill: Red_color,font:"bold 48pt arial",strokeThickness: 2});      // if the color of that element is RED, I know that i've found the right one, change it's  color.
                        if (a.style.fill == "#0000ff" && Blue_color != 'blue') a.setStyle({fill: Blue_color,font:"bold 48pt arial",strokeThickness: 2});
                    } catch(err){}
                });
            },20);
        });


    });

}, false);

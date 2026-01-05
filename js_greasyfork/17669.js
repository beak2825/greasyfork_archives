// ==UserScript==
// @name         ᎪᏢᏒᏟ✯ extension use
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://agar.io/
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17669/%E1%8E%AA%E1%8F%A2%E1%8F%92%E1%8F%9F%E2%9C%AF%20extension%20use.user.js
// @updateURL https://update.greasyfork.org/scripts/17669/%E1%8E%AA%E1%8F%A2%E1%8F%92%E1%8F%9F%E2%9C%AF%20extension%20use.meta.js
// ==/UserScript==

//waits for the page to load

window.onload = function() {
    var ctx = document.getElementById("canvas").getContext("2d")

    //replaces title
    //h2 selects all h2 elements
    $("h2").replaceWith('<h2>ᎪᏢᏒᏟ✯</h2>'); 

    //zoom
    window.agar.minScale = -30;


    //draws grid, true = yes, and false = no    


    window.agar.drawGrid = false;
    //sets dark theme to true on extension load
    setDarkTheme(true);
    //sets show mass to true on extension load
    setShowMass(true);

    //Cell skin
    image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = 'https://yt3.ggpht.com/-IHxxAiS1lQA/AAAAAAAAAAI/AAAAAAAAAAA/_XpYiINlQvk/s176-c-k-no/photo.jpg' //link
    window.agar.hooks.cellSkin = function(cell, old_skin) {
        for (i = 0; i < window.agar.myCells.length; i++) { 
            if(cell.id == window.agar.myCells[i]) return image;
        }
    }
    
    window.agar.hooks.drawCellMass = function(cell, old_draw) {
     if(cell.size > 20) return cell;   
    }

    //You can just delete the return 50 if you dont like the size
    window.agar.hooks.cellMassTextScale = function(cell, old_scale) {
     return 50; //number here   
    }


}
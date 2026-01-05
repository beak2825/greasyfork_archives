// ==UserScript==
// @name        Fluff's Color Mod
// @description  Fluff's Personal Color Mod for Diep.io
// @author       Fluff
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @match        http://diep.io/
// @run-at         document-end
// @namespace  
// @version     2.2
// @downloadURL https://update.greasyfork.org/scripts/28969/Fluff%27s%20Color%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/28969/Fluff%27s%20Color%20Mod.meta.js
// ==/UserScript==
$(window).load(function () {
    input.execute("net_replace_color 0 0x8b8b8b"); //Smasher and Dominator Bases
    input.execute("net_replace_color 1 0x8b8b8b"); //Barrels, Spawners, Launchers and Auto Turrets
    input.execute("net_replace_color 2 0xffffff"); //Your Body
    input.execute("net_replace_color 7 0x00ff00"); //Green or 'Shiny' Squares
    input.execute("net_replace_color 8 0xFFFF00"); //Squares
    input.execute("net_replace_color 9 0xff2424"); //Triangles
    input.execute("net_replace_color 10 0x0066ff"); //Pentagons
    input.execute("net_replace_color 11 0xFF69B4"); //Crashers
    input.execute("net_replace_color 12 0xFFFF00"); //Arena Closers or Neutral Dominators
    input.execute("net_replace_color 14 0x888888"); //Maze Walls
    input.execute("net_replace_color 16 0xFFFF66"); //Necromancer Squares
    input.execute("net_replace_color 17 0x777777"); //Fallen Bosses
    input.execute("net_replace_color 102 0xc0c0c0"); //Minimap
    input.execute("net_replace_color 103 0x33cc33"); //Health Bar
    input.execute("net_replace_color 104 0xe6e600"); //Outlines
    document.addEventListener('keydown',function(event){
        if(event.keyCode==70){
            input.set_convar('ren_fps',true);
        }
    });

    document.addEventListener('keyup',function(event){
        if(event.keyCode==70){
            input.set_convar('ren_fps',false); 
        }
    });
});
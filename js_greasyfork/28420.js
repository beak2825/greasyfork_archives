// ==UserScript==
// @name        Diep.io Deep Theme
// @version      010
// @description  Deep Theme.. It makes everything... Deeper... You'll see once you try it out.
// @author       By me, AKA ThePaster24 on PasteBin, FPS counter made by /u/haykam821, everything else by me.
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @match        http://diep.io/
// @run-at         document-end
// @namespace  
// @downloadURL https://update.greasyfork.org/scripts/28420/Diepio%20Deep%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/28420/Diepio%20Deep%20Theme.meta.js
// ==/UserScript==
$(window).load(function () {
    input.execute("net_replace_color 0 0x000000");
    input.execute("net_replace_color 1 0x000000");
    input.execute("net_replace_color 2 0x99FF99");
    input.execute("net_replace_color 3 0x0000FF");
    input.execute("net_replace_color 4 0xFF0000");
    input.execute("net_replace_color 5 0x990099");
    input.execute("net_replace_color 6 0x00FF00");
    input.execute("net_replace_color 7 0xFFFFFF");
    input.execute("net_replace_color 8 0xFFFF00");
    input.execute("net_replace_color 9 0xFFBBBB");
    input.execute("net_replace_color 10 0xCCCCFF");
    input.execute("net_replace_color 11 0xFF69B4");
    input.execute("net_replace_color 12 0xFFFF00");
    input.execute("net_replace_color 13 0xFFFFFF");
    input.execute("net_replace_color 14 0x888888");
    input.execute("net_replace_color 15 0x0000FF");
    input.execute("net_replace_color 16 0xBBBB00");
    input.execute("net_replace_color 17 0x777777");
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
    document.addEventListener('keydown',function(event){
        if(event.keyCode==82){
            input.set_convar('ren_background_color',0x111111);
            input.execute("net_replace_color 0 0xFFFFFF");
            input.execute("net_replace_color 1 0xFFFFFF");
        }
    });

    document.addEventListener('keydown',function(event){
        if(event.keyCode==90){
            input.set_convar('ren_background_color',0xEEEEEE);
            input.execute("net_replace_color 0 0x000000");
            input.execute("net_replace_color 1 0x000000");  
        }
    });
    document.addEventListener('keydown',function(event){
        if(event.keyCode==80){
            input.set_convar('ren_background_color',0x888888); 
        }
    });

});
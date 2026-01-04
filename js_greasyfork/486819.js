// ==UserScript==
// @name         == HX-Mod PaGamO Lite ==
// @namespace    http://tampermonkey.net/
// @version      V1.0.0
// @description  PaGamO操作輔助模組-削弱版
// @author       Hanks瀚
// @match        https://www.pagamo.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      CC-BY-NC-SA
// @downloadURL https://update.greasyfork.org/scripts/486819/%3D%3D%20HX-Mod%20PaGamO%20Lite%20%3D%3D.user.js
// @updateURL https://update.greasyfork.org/scripts/486819/%3D%3D%20HX-Mod%20PaGamO%20Lite%20%3D%3D.meta.js
// ==/UserScript==
 
 
var UIs_switch=true;
(
    function()
 {
   document.onkeydown=keyFunction;
 
 }
)();
 
 
 
function keyFunction()
{
       document.addEventListener('keydown',(e)=>{    //觀景模式 (Close all UIs) (shift+Num[-])
    if(e.shiftKey&&e.keyCode===109){
        if (UIs_switch == true)
        {
        mapUIHider.toggleAllMapUIs(false);
        UIs_switch = false;
        }
        else if (UIs_switch == false)
        {
        mapUIHider.toggleAllMapUIs(true);
        UIs_switch = true;
        }
    }
  })
    switch (event.keyCode) {
         case 70 : //省力
             (function (){ document.getElementsByClassName('hex_menu_btn cursor_pointer btn_save_energy')[0].click(); })();
             break;
         case 82 : //小地圖
             (function (){ document.getElementsByClassName('hex_menu_btn cursor_pointer btn_toggle_minimap')[0].click(); })();
             break;
         case 38 : //up
             (function (){ document.getElementsByClassName('gc_menu_sprite button_up')[0].click(); })();
             break;
         case 40 : //down
             (function (){ document.getElementsByClassName('gc_menu_sprite button_down')[0].click(); })();
             break;
         case 37 : //left
             (function (){ document.getElementsByClassName('gc_menu_sprite button_left')[0].click(); })();
            break;
         case 39 : //right
            (function (){ document.getElementsByClassName('gc_menu_sprite button_right')[0].click(); })();
            break;
         case 33 : //Map scale
             mapCanvasManager.scale -= 0.02
            break;
         case 34 : //Map scale
             mapCanvasManager.scale += 0.02
            break;
                          }
}
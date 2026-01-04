// ==UserScript==
// @name         == HX-Mod PaGamO ==
// @namespace    http://tampermonkey.net/
// @version      V1.5.1
// @description  PaGamO操作輔助模組
// @author       Hanks瀚
// @match        https://www.pagamo.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442254/%3D%3D%20HX-Mod%20PaGamO%20%3D%3D.user.js
// @updateURL https://update.greasyfork.org/scripts/442254/%3D%3D%20HX-Mod%20PaGamO%20%3D%3D.meta.js
// ==/UserScript==


var UIs_switch=true;
var backpack_switch=false;
(
    function()
 {
   document.onkeydown=keyFunction;

 }
)();



function keyFunction()
{
//    if (event.keyCode==84) //座標定位
//    {
//    var X_axis, Y_axis;
//
// X_axis = Number(window.prompt('欲前往座標X軸'));
// Y_axis = Number(window.prompt('欲前往座標Y軸'));
//
//            if (X_axis % 1 === 0 && Y_axis % 1 === 0) {
//  window.App.mapController.highlight_self();
//window.minimap.moveMinimapAndMapViewBoxAndShowPinEffect(
//  0 + (X_axis),
//  0 + (Y_axis),);}
//    }
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
         case 69 : //背包
             if (backpack_switch == true)
        {
        mapReactManager.closeBackpack()
        backpack_switch = false;
        }
        else if (backpack_switch == false)
        {
        mapReactManager.loadAndOpenBackpack();
        backpack_switch = true;
        }
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
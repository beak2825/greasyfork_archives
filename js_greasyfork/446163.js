// ==UserScript==
// @name         PaGamO 輔助操作
// @namespace    http://tampermonkey.net/
// @version      V1.0
// @description  PaGamO操作輔助
// @author       W
// @match        https://www.pagamo.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446163/PaGamO%20%E8%BC%94%E5%8A%A9%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/446163/PaGamO%20%E8%BC%94%E5%8A%A9%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==
(
    function()
 {
   document.onkeydown=keyFunction;
 }
)();
 
 
function keyFunction()
{
   if (event.keyCode==70) //省力開關
    {
(function (){ document.getElementsByClassName('hex_menu_btn cursor_pointer btn_save_energy')[0].click(); })();
    }
 
   if (event.keyCode==69) //背包開關
    {
window.App.propsController.toggleBackpack();
    }
   if (event.keyCode==82) //小地圖開關
    {
(function (){ document.getElementsByClassName('hex_menu_btn cursor_pointer btn_toggle_minimap')[0].click(); })();
    }
   if (event.keyCode==38) //向上
    {
(function (){ document.getElementsByClassName('gc_menu_sprite button_up')[0].click(); })();
    }
   if (event.keyCode==40) //向下
    {
(function (){ document.getElementsByClassName('gc_menu_sprite button_down')[0].click(); })();
    }
   if (event.keyCode==37) //向左
    {
(function (){ document.getElementsByClassName('gc_menu_sprite button_left')[0].click(); })();
    }
   if (event.keyCode==39) //向右
    {
(function (){ document.getElementsByClassName('gc_menu_sprite button_right')[0].click(); })();
    }
   if (event.keyCode==90) //A
    {
(function (){ document.getElementsByClassName('cursor_pointer choice-button attack_modal_sprite btn_4a1 pgo-style-input-answer-2o3iYm')[0].click(); })();
    }
   if (event.keyCode==88) //B
    {
(function (){ document.getElementsByClassName('cursor_pointer general2_sprite btn04 pgo-style-submit-button-30KwXW')[0].click(); })();
    }
    
}
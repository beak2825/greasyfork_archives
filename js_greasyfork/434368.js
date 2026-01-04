// ==UserScript==
// @name EZ edit
//                    ,----,
//    ,---,.        .'   .`|
//  ,'  .' |     .'   .'   ;
//,---.'   |   ,---, '    .'
//|   |   .'   |   :     ./
//:   :  |-,   ;   | .'  /
//:   |  ;/|   `---' /  ;
//|   :   .'     /  ;  /
//|   |  |-,    ;  /  /--,
//'   :  ;/|   /  /  / .`|
//|   |    \ ./__;       :
//|   :   .' |   :     .'
//|   | ,'   ;   |  .'
//`----'     `---'
//                                          ,----,
//                                        ,/   .`|
//    ,---,.     ,---,        ,---,     ,`   .'  :
//  ,'  .' |   .'  .' `\   ,`--.' |   ;    ;     /
//,---.'   | ,---.'     \  |   :  : .'___,/    ,'
//|   |   .' |   |  .`\  | :   |  ' |    :     |
//:   :  |-, :   : |  '  | |   :  | ;    |.';  ;
//:   |  ;/| |   ' '  ;  : '   '  ; `----'  |  |
//|   :   .' '   | ;  .  | |   |  |     '   :  ;
//|   |  |-, |   | :  |  ' '   :  ;     |   |  '
//'   :  ;/| '   : | /  ;  |   |  '     '   :  |
//|   |    \ |   | '` ,/   '   :  |     ;   |.'
//|   :   .' ;   :  .'     ;   |.'      '---'
//|   | ,'   |   ,.'       '---'
//`----'     '---'
//
//
//
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Edit ANY webpage!
// @author       The kid that is sitting right next to you.
// @match        http://*/*
// @match        https://*/*
// @icon         https://i.imgur.com/2O31wHv.png
// @grant        ""
// @downloadURL https://update.greasyfork.org/scripts/434368/EZ%20edit.user.js
// @updateURL https://update.greasyfork.org/scripts/434368/EZ%20edit.meta.js
// ==/UserScript==



//             Press F9 for the popup

window.addEventListener("keydown", var1, false);
function var1(e){
    if(e.keyCode == "120"){
        var a = prompt("Would you like to turn editing on or off?");
            document.designMode = (a);
        }
    }
// ==UserScript==
// @name         swordzio tricks
// @namespace    Reiwilo09
// @version      1.7.0
// @description  Support extension for SwOrDz.Io
// @author       Reiwilo
// @match        *.swordz.io
// @grant        ur mum
// @downloadURL https://update.greasyfork.org/scripts/447182/swordzio%20tricks.user.js
// @updateURL https://update.greasyfork.org/scripts/447182/swordzio%20tricks.meta.js
// ==/UserScript==
// @license MIT

document.onkeydown = function (key) {
    switch(key.keyCode) {
        case 13: //on ENTER
            inputChat();
            break;
        case 81: //on Q
            changeCap(28);
            break;
        case 86: //on V
            changeCap(29);
            break;
        case 88: //on X
            changeCap(30);
            break;
        case 87:
            inputAttack(true)
            break;
    }
}
document.onkeyup = function (key) {
      switch(key.keyCode) {
           case 87:
             inputAttack(false)
             break; 
     }
}
 function onRender() {
    
    ctx.fillStyle = "red";
    ctx.fillText("Hat 28 [Q]", 80, 80);

    ctx.fillStyle = "red";
    ctx.fillText("Hat 29 [V]", 80, 100);

    ctx.fillStyle = "red";
    ctx.fillText("Hat 30 [X]", 80, 120);

    
    requestAnimationFrame(onRender);

}
 
onRender();
      
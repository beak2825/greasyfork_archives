// ==UserScript==
// @name        Complete-PedroPascalsTriangleOfPrestige
// @namespace   Violentmonkey Scripts
// @match       https://asteriskman7.github.io/PedroPascalsTriangleOfPrestige/
// @grant       none
// @version     1.0.2
// @author      brenda maria
// @license     MIT
// @description 26/04/2023, 06:42:54
// @downloadURL https://update.greasyfork.org/scripts/464900/Complete-PedroPascalsTriangleOfPrestige.user.js
// @updateURL https://update.greasyfork.org/scripts/464900/Complete-PedroPascalsTriangleOfPrestige.meta.js
// ==/UserScript==
const cheatPanel=`Digite o coluna e o linha que deseja completar: Ex:row,col`;
document.addEventListener("keyup",function(evt){
    if(evt.keyCode=="67"&&evt.altKey&&evt.ctrlKey){
        let inp=prompt(cheatPanel);
        if(inp.length>0){
            app.state.activeCells.forEach( cell => {
              if(cell.name == inp) {
                let mensagem = inp.split(",")
                let row = mensagem[0];
                let col = mensagem[1];

                cell.complete = true;
                app.progressComplete(row, col);
                app.clickableCount = app.activated - (app.completeCount + app.state.activeCells.length);
                app.saveToStorage();
              }
            });
          window.location.reload();
        }
    }
})
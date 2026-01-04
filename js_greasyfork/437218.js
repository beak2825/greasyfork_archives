// ==UserScript==
// @name         2048 grid edit
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  2048 level editor
// @author       pigPen
// @match        http*://play2048.co/*
// @icon         https://www.google.com/s2/favicons?domain=play2048.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437218/2048%20grid%20edit.user.js
// @updateURL https://update.greasyfork.org/scripts/437218/2048%20grid%20edit.meta.js
// ==/UserScript==

(function() {
    function c(n){
    let s = n;
       let x = 0
    while (n > 2){
        s+=n*2;
        n/=2;
        x+=1
    }
    s+=x*2.4;
    return s;
}
    'use strict';
     if (location.pathname == "/edit"){
         let grid = JSON.parse( localStorage.getItem("gameState")).grid.cells;



         document.querySelector(".container").remove();
         let center = document.createElement("center");

         let header = document.createElement("h1");
         header.innerHTML = "?";
         header.setAttribute("id", "score");
         center.appendChild(header);
         let table = document.createElement("table");
         for (let x = 0; x < 4; x++){
             let row = document.createElement("tr");
             for (let y = 0; y < 4; y++){
                 let thisslot = grid[y][x];
                 let slot = document.createElement("td");
                 let text = document.createElement("textarea");
                 if (thisslot == undefined)
                     text.value = "";
                 else
                     text.value = thisslot.value
                 text.style.width = "100px";
                 text.style.height = "100px";
                 text.style.resize = "none";
                 text.style.fontSize = "20px";
                 text.style.textAlign = "center";
                 //text.setAttribute("maxlength", 6);
                 text.setAttribute("id", y+"x"+x)
                 text.oninput = ()=>{
                     let score = 0;
                     for (let tarr of document.querySelectorAll("textarea"))
                         if (!isNaN(parseInt(tarr.value)))
                             score+=c(parseInt(tarr.value));


                     document.querySelector("#score").innerHTML = "Score: " + score;
                 };
                 //text.setAttribute("readonly", true);
                 slot.appendChild(text);
                 row.appendChild(slot);
             }
             table.appendChild(row);
         }
         center.appendChild(table);

         let booleanAttrs = [["Is won", "won"], ["Is over", "over"], ["Keep Playing", "keepPlaying"]];
         for (let i = 0; i<booleanAttrs.length; i++){
             center.appendChild(document.createElement("br"));
             let label = document.createElement("label");
             label.setAttribute("for", booleanAttrs[i][1]);
             label.innerHTML = booleanAttrs[i][0];
             center.appendChild(label);
             let check = document.createElement("input");
             check.setAttribute("id", booleanAttrs[i][1]);
             check.setAttribute("type", "checkbox");
             check.checked=JSON.parse( localStorage.getItem("gameState"))[booleanAttrs[i][1]];
             center.appendChild(check);
             document.querySelector("body").appendChild(center);
             document.querySelector("textarea").oninput();
         }
         center.appendChild(document.createElement("br"));


         let btn = document.createElement("button");
         btn.classList.add("btn");
         btn.classList.add("btn-primary");
         btn.innerHTML = "Save";
         btn.style.fontSize = "20px";
         center.appendChild(btn);
         btn.onclick = ()=>{
             let ngrid = [];
             let newfile = JSON.parse( localStorage.getItem("gameState"))
             for (let y = 0; y < 4; y++){
                 let colum = [];
                 for (let x = 0; x < 4; x++){
                     let score = parseInt(document.getElementById(""+y+"x"+x).value);
                     if (isNaN(score))
                         colum.push(undefined);
                     else
                         colum.push({position:{x:y, y:x}, value:score});
                 }ngrid.push(colum);

             }
             newfile.grid = {size: 4,cells: ngrid};
             newfile.score = parseInt(document.querySelector("h1").innerHTML.split(" ")[1]);
             console.log(JSON.stringify(newfile));
             for (let attr of booleanAttrs){
                 newfile[attr[1]] = document.getElementById(attr[1]).checked;
             }
             console.log(JSON.stringify(newfile));
             localStorage.setItem("gameState", JSON.stringify(newfile));
         };
         btn = document.createElement("button");
         btn.classList.add("btn");
         btn.classList.add("btn-primary");
         btn.innerHTML = "Reset";
         btn.style.fontSize = "20px";
         center.appendChild(btn);
         btn.onclick = ()=>{
             if (confirm("Are you sure you wish to reset?")){
                 localStorage.removeItem("gameState");
                 history.back()
                 // location.reload();
             }
         }

     }
     if (location.pathname == "/"){
         localStorage.removeItem = (r)=>{};


         let center = document.createElement("center");
         let span = document.createElement("button");
         span.classList.add("pp-donate");
         span.style.fontSize = "25px";
         span.innerHTML = "<a href='/edit'>Save editor</a>";
         center.appendChild(span);

         document.querySelector("footer.links").appendChild(document.createElement("br"));
         document.querySelector("footer.links").appendChild(document.createElement("br"));
         document.querySelector("footer.links").appendChild(document.createElement("br"));
         document.querySelector("footer.links").appendChild(document.createElement("br"));
         document.querySelector("footer.links").appendChild(center);
         `
         span = document.createElement("button");
         span.classList.add("pp-donate");
         span.style.fontSize = "25px";
         span.innerHTML = "Save";
         document.querySelector(".game-message").appendChild(span);
         `

     }
})();
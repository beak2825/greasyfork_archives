// ==UserScript==
// @name         Gladiatus - Compra Rápida Subasta 
// @namespace    https://greasyfork.org/users/904482
// @version      0.0.1
// @description  Compra masivamente los objetos de la subasta
// @author       lpachecob
// @grant        none
// @match       *.gladiatus.gameforge.com/game/index.php?mod=auction*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gameforge.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444182/Gladiatus%20-%20Compra%20R%C3%A1pida%20Subasta.user.js
// @updateURL https://update.greasyfork.org/scripts/444182/Gladiatus%20-%20Compra%20R%C3%A1pida%20Subasta.meta.js
// ==/UserScript==

let items = document.getElementsByClassName("auction_bid_div");
let oro = parseFloat(document.getElementById("sstat_gold_val").textContent);

let menu = document.getElementsByClassName("section-header")[1];
menu.insertAdjacentHTML('beforebegin', `
<h2
     id = "MenuCompraTitle"
     class = "section-header"
     style = "cursor: pointer;">
     Compra Rápida
</h2>
<section
     id = "MenuCompra"
     style = "display: block;">
</section>`);

let SectionMenuCompra = document.getElementById("MenuCompra");
/*
SectionMenuCompra.insertAdjacentHTML('beforeend', `
<p>Indica un precio máximo para comprar o compra todo lo que te alcance.</p>
<p><small>No se sobrepujará a los compañeros de alianza.</small></p>
`);
*/
SectionMenuCompra.insertAdjacentHTML('beforeend', `
<p>Se comprará todo lo que alcance con el oro que tienes.</p>
<p><small>No se sobrepujará a los compañeros de alianza.</small></p>
`);

SectionMenuCompra.insertAdjacentHTML('beforeend', `
<input
     type = "number"
     id = "OroMaximo"
     placeholder = "Oro máximo a gastar"
     style = "width:150px" hidden>`);

SectionMenuCompra.insertAdjacentHTML('beforeend', `
<button
     id = "BotonComprar"
     class = "awesome-button"
     style = "margin:5px;"
     data-toggle = "tooltip"
     title = "Se comprará toda la comida que alcance con el oro que tengas">
     Comprar todo
</button>`);


let oroMaximo = document.getElementById("OroMaximo");
let botonComprar = document.getElementById("BotonComprar");
oroMaximo.addEventListener("input",()=>{
    if(oroMaximo.value.length>0){
        botonComprar.title = "Se comprara la comida que alcance con: "+oroMaximo.value+" 🥇"
        botonComprar.innerHTML = "\n Comprar \n"
    } else if(oroMaximo.value.length == 0){
        botonComprar.title = "Se comprará toda la comida que alcance con el oro que tengas"
        botonComprar.innerHTML = "\n Comprar todo\n"
    }
});

botonComprar.addEventListener("click",()=>{
    if(oroMaximo.value.length>0){
        //Proximamente
    } else if(oroMaximo.value.length == 0){
        for(var i = 0; i < items.length; i++) {
            let costo = parseFloat(items[i].children[2].value);
            if(costo > oro){
                let PujaDeAlguien
                if(items[i].children[0].innerText.split("\n")[0] == "No hay pujas." || items[i].children[0].innerText.split("\n")[0] == "Ya hay pujas existentes."){
                    items[i].children[3].click();
                }
            }
        }
    }
});

var menuCompraTitle = document.getElementById("MenuCompraTitle");
menuCompraTitle.addEventListener("click", ()=>{
    if(SectionMenuCompra.style.display == "none"){
        SectionMenuCompra.style.display="block";
    }else{
        SectionMenuCompra.style.display="none";
    }
});
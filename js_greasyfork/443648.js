// ==UserScript==
// @name         Market Buttons
// @namespace    https://greasyfork.org/users/904482
// @version      0.3.0
// @description  Venta rapida en el mercado
// @author       lpachecob
// @grant        none
// @match        *.gladiatus.gameforge.com/game/index.php?mod=guildMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gameforge.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443648/Market%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/443648/Market%20Buttons.meta.js
// ==/UserScript==

/* Getting the element with the id "sellForm" from the page. */
var panelVenta=document.getElementById("sellForm");
/* Getting the element with the id "preis" from the page. */
var inputPrecio = document.getElementById("preis");

var inputDuracion = document.getElementById("dauer");

/* Getting the element with the name "anbieten" from the page. */
var botonVender = document.getElementsByName("anbieten")[0];
/* Getting the element with the id "market_inventory" from the page. */
var marketInventory = document.getElementById("market_inventory");
/* Getting the element with the id "sstat_gold_val" from the page and getting the text content of the
element. Then it is converting the text content to a number. */
var oro = parseFloat(document.getElementById("sstat_gold_val").textContent);

var cajaVenta = document.getElementsByClassName("ui-droppable")[0];



/* Adding HTML to the page. */
panelVenta.insertAdjacentHTML('beforebegin', `
<h2
     id="VentaRapidaMenuTitle"
     class="section-header"
     style="cursor: pointer;">
     Venta Rapida
</h2>
<section
     id="VentaRapidaMenu"
     style="display: block;">
</section>`);

marketInventory.insertAdjacentHTML('afterbegin', `
<h2
     id="CalcularRotativosTitle"
     class="section-header"
     style="cursor: pointer;">
     Calcular Rotativos
</h2>
<section
     id="CalcularRotativos"
     style="display: block;">
</section>
`);


/* Getting the element with the id "VentaRapidaMenu" from the page. */
var ventaRapidaMenu = document.getElementById("VentaRapidaMenu");

/* Adding HTML to the page. */
ventaRapidaMenu.insertAdjacentHTML('beforeend', `
<p>Coloca un item y elige el precio para vender.</p>
`);

ventaRapidaMenu.insertAdjacentHTML('beforeend', `
<button
     id="buttonAdd50k"
     class="awesome-button"
     style="margin:5px;"
     data-toggle="tooltip"
     title="Costo de venta: 2.000 💰"
     disabled>
     50k
</button>`);
ventaRapidaMenu.insertAdjacentHTML('beforeend', `
<button
     id="buttonAdd100k"
     class="awesome-button"
     style="margin:5px;"
     data-toggle="tooltip"
     title="Costo de venta: 4.000 💰"
     disabled>
     100k
</button>`);
ventaRapidaMenu.insertAdjacentHTML('beforeend', `
<button
     id="buttonAdd200k"
     class="awesome-button"
     style="margin:5px;"
     data-toggle="tooltip"
     title="Costo de venta: 8.000 💰"
     disabled>
     200k
</button>`);
ventaRapidaMenu.insertAdjacentHTML('beforeend', `
<button
     id="buttonAdd500k"
     class="awesome-button"
     style="margin:5px;"
     data-toggle="tooltip"
     title="Costo de venta: 20.000 💰"
     disabled>
     500k
</button>`);
ventaRapidaMenu.insertAdjacentHTML('beforeend', `
<button
     id="buttonAdd1kk"
     class="awesome-button"
     style="margin:5px;"
     data-toggle="tooltip"
     title="Costo de venta: 40.000 💰"
     disabled>
     1kk
</button>`);
ventaRapidaMenu.insertAdjacentHTML('beforeend', `
<section
     id=""
     style="display: block;">
     <p><small>Elegir duración</small></p>
     <select
          id="SelectHora"
          size="1">

          <option value="1">2 h</option>
          <option value="2">8 h</option>
          <option value="3">24 h</option>
     </select>
</section>`);


var selectHora = document.getElementById("SelectHora");
if(localStorage.SelectHora == undefined ){
    localStorage.SelectHora = 1
    selectHora.value = 1
} else {
    selectHora.value = localStorage.SelectHora
}
selectHora.addEventListener("change",(event)=>{
    localStorage.SelectHora = selectHora.value;
});


/* Getting the element with the id "VentaRapidaMenuTitle" from the page. */
var ventaRapidaMenuTitle = document.getElementById("VentaRapidaMenuTitle");
/* Adding an event listener to the element with the id "VentaRapidaMenuTitle" from the page. When the
user clicks on the element, the function will be executed. The function will check if the element
with the id "VentaRapidaMenu" is visible or not. If it is visible, it will hide it. If it is hidden,
it will show it. */
ventaRapidaMenuTitle.addEventListener("click", ()=>{
    if(ventaRapidaMenu.style.display == "none"){
        ventaRapidaMenu.style.display="block";
    }else{
        ventaRapidaMenu.style.display="none";
    }
});

/* Adding an event listener to the element with the id "buttonAdd50k". When the user clicks on the
element, the function will be executed. The function will set the value of the element with the id
"preis" to 50000 and will click on the element with the name "anbieten". */
var add50k = document.getElementById("buttonAdd50k");
add50k.addEventListener("click", ()=>{
    inputPrecio.value=50000;
    inputDuracion.value = localStorage.SelectHora;
    botonVender.click();
});
/* Adding an event listener to the element with the id "buttonAdd100k". When the user clicks on the
element, the function will be executed. The function will set the value of the element with the id
"preis" to 100000 and will click on the element with the name "anbieten". */
var add100k = document.getElementById("buttonAdd100k");
add100k.addEventListener("click", ()=>{
    inputPrecio.value=100000;
    botonVender.click();
});
/* Adding an event listener to the element with the id "buttonAdd200k". When the user clicks on the
element, the function will be executed. The function will set the value of the element with the id
"preis" to 200000 and will click on the element with the name "anbieten". */
var add200k = document.getElementById("buttonAdd200k");
add200k.addEventListener("click", ()=>{
    inputPrecio.value=200000;
    inputDuracion.value = localStorage.SelectHora;
    botonVender.click();
});
/* Adding an event listener to the element with the id "buttonAdd500k". When the user clicks on the
element, the function will be executed. The function will set the value of the element with the id
"preis" to 500000 and will click on the element with the name "anbieten". */
var add500k = document.getElementById("buttonAdd500k");
add500k.addEventListener("click", ()=>{
    inputPrecio.value=500000;
    inputDuracion.value = localStorage.SelectHora;
    botonVender.click();
});
/* Adding an event listener to the element with the id "buttonAdd1kk". When the user clicks on the
element, the function will be executed. The function will set the value of the element with the id
"preis" to 1000000 and will click on the element with the name "anbieten". */
var add1kk = document.getElementById("buttonAdd1kk");
add1kk.addEventListener("click", ()=>{
    inputPrecio.value=1000000;
    inputDuracion.value = localStorage.SelectHora;
    botonVender.click();
});


/* Getting the element with the id "CalcularRotativos" from the page. */
var calcularRotativos = document.getElementById("CalcularRotativos");

/* Adding HTML to the page. */
calcularRotativos.insertAdjacentHTML('beforeend', "<p>Puedes comprar los siguientes rotativos</p>");
calcularRotativos.insertAdjacentHTML('beforeend', `
<section
     style="
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;">
     <section
          id="col1"
          style="
               width: 50%;">
     </section>
     <section
          id="col2"
          style="
               width: 50%;">
     </section>
</section>`);

/* Getting the elements with the id "col1" and "col2" from the page. */
var col1 = document.getElementById("col1");
var col2 = document.getElementById("col2");

/* Creating a variable called text50k and setting it to a string. Then it is inserting the string into
the element with the id "col1". */
var text50k = "<p>50k: "+(Math.floor(oro/50.000))+"</p>";
col1.insertAdjacentHTML('beforeend', text50k);
/* Creating a variable called text100k and setting it to a string. Then it is inserting the string into
the element with the id "col1". */
var text100k = "<p>100k: "+(Math.floor(oro/100.000))+"</p>";
col1.insertAdjacentHTML('beforeend', text100k);
/* Creating a variable called text200k and setting it to a string. Then it is inserting the string into
the element with the id "col1". */
var text200k = "<p>200k: "+(Math.floor(oro/200.000))+"</p>";
col1.insertAdjacentHTML('beforeend', text200k);
/* Creating a variable called text500k and setting it to a string. Then it is inserting the string into
the element with the id "col2". */
var text500k = "<p>500k: "+(Math.floor(oro/500.000))+"</p>";
col2.insertAdjacentHTML('beforeend', text500k);
/* Creating a variable called text1kk and setting it to a string. Then it is inserting the string into
the element with the id "col2". */
var text1kk = "<p>1kk: "+(Math.floor(oro/1000.000))+"</p>";
col2.insertAdjacentHTML('beforeend', text1kk);


/* Adding an event listener to the element with the id "CalcularRotativosTitle". When the user clicks
on the element, the function will be executed. The function will check if the element with the id
"CalcularRotativos" is visible or not. If it is visible, it will hide it. If it is hidden, it will
show it. */
var calcularRotativosTitle = document.getElementById("CalcularRotativosTitle");
calcularRotativosTitle.addEventListener("click", ()=>{
    if(calcularRotativos.style.display == "none"){
        calcularRotativos.style.display="block";
    }else{
        calcularRotativos.style.display="none";
    }
});


document.addEventListener("mouseup",()=>{
    if(cajaVenta.children.length>0){
        add50k.disabled = false;
        add100k.disabled = false;
        add200k.disabled = false;
        add500k.disabled = false;
        add1kk.disabled = false;
    }
});

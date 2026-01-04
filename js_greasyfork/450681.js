// ==UserScript==
// @name         Killer
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Killer Appen
// @author       @jeanpirelag
// @match        https*://view.appen.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=appen.com
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/450681/Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/450681/Killer.meta.js
// ==/UserScript==

    var estilos = "height:30px;width:auto;float:left;margin-inline:3px;border-radius:10px;background-color:white";

    // BOTON Remove & Submit
    var a = document.createElement("button");
    a.id = "remsub";
    a.innerHTML = "❎ + ⏭";
    a.title = "Remove & Submit";
    a.style.cssText = estilos;
    a.onclick = function(){
        remove();submit();
        setTimeout(() => {this.style.backgroundColor = "green";}, 0)
        setTimeout(() => {this.style.backgroundColor = "white";}, 150)
        };

    // BOTON REMOVEDOR
    var b = document.createElement("button");
    b.id = "remove";
    b.innerHTML = "❎";
    b.title = "Remove";
    b.style.cssText = estilos;
    b.onclick = function(){
        remove();
        console.log(b.innerHTML);
        setTimeout(() => {this.style.backgroundColor = "green";}, 0);
        setTimeout(() => {this.style.backgroundColor = "white";}, 150);
        if(this.innerHTML === "❎"){
            b.innerHTML = "👀";
            b1.innerHTML = "👀";
            return
        }
        if(this.innerHTML === "👀"){
            b.innerHTML = "❎";
            b1.innerHTML = "❎";
            return
        }
    };

    // BOTON ENVIAR
    var c = document.createElement("button");
    c.id = "send";
    c.innerHTML = "⏭";
    c.title = "Enviar";
    c.style.cssText = estilos;
    c.onclick = function(){
        submit();
        setTimeout(() => {this.style.background = "green";}, 0);
        setTimeout(() => {this.style.background = "white";}, 150);
    };

    // BOTON UP
    var up = document.createElement("button");
    up.id = "up";
    up.innerHTML = "⏫";
    up.title = "Up";
    up.style.cssText = estilos;
    up.onclick = function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {this.style.background = "green";}, 0);
        setTimeout(() => {this.style.background = "white";}, 150);
        }

    // BOTON DOWN
    var down = document.createElement("button");
    down.id = "down";
    down.innerHTML = "⏬";
    down.title = "Down";
    down.style.cssText = estilos;
    down.onclick = function () {
        window.scrollTo(0, document.body.scrollHeight);
        setTimeout(() => {this.style.background = "green";}, 0);
        setTimeout(() => {this.style.background = "white";}, 150);
        }

    var parentDiv = document.getElementsByClassName("job-title")[0].parentNode;
	var sp = document.getElementsByClassName("job-title")[0];
    var downdiv = document.getElementsByClassName("content")[0];

    var divPadre = document.createElement("div");
    divPadre.id ="divPadre"
    //parentDiv.insertBefore(divPadre, sp);

     parentDiv.insertBefore(divPadre, sp.nextSibling);

    divPadre.appendChild(a);
    divPadre.appendChild(b);
    divPadre.appendChild(c);
    divPadre.appendChild(down);

var e1 = document.getElementById("remsub"), a1;
a1 = e1.cloneNode(true);
var e2 = document.getElementById("remove"), b1;
b1 = e2.cloneNode(true);
var e3 = document.getElementById("send"), c1;
c1 = e3.cloneNode(true);

//COPIAR FUNCIONES DE BOTONES PADRES
a1.onclick = a.onclick;
b1.onclick = b.onclick;
c1.onclick = c.onclick;

downdiv.appendChild(a1);
downdiv.appendChild(b1);
downdiv.appendChild(c1);
downdiv.appendChild(up);


//REMOVEDOR MANUAL
var tasks = document.getElementsByClassName("cml");

for(var i=0; i< tasks.length; i++){
    console.log(tasks[i])
    let remove = document.createElement("p")
    remove.style.cssText = "float:right;width:22px;height:22px;border-radius: 50%;border: 2px solid #000000;text-align: center;padding: 4px;";
    remove.innerHTML = "❎";
    remove.onclick = function(){
        var elemento = this.nextSibling;
        setTimeout(() => {this.style.backgroundColor = "green";}, 0);
        setTimeout(() => {this.style.backgroundColor = "transparent";}, 150);
        if(this.innerHTML === "❎"){
        elemento.style.display = "none";
            this.innerHTML = "👀";
            return
        }
        if(this.innerHTML === "👀"){
        elemento.style.display = "block";
            this.innerHTML = "❎";
            return
        }


    }
    let parentDiv = tasks[i].parentNode;
    parentDiv.insertBefore(remove, tasks[i])
}

    //F4
    async function keys() {
    window.onkeydown = function (event, index){
        if (event.keyCode == '115'){
            a.innerHTML = "Submitting... F4";
            remove();submit();}}}
    keys();

    function remove(){
         var buttons = document.querySelectorAll(".cml");
        for(var i=0; i< buttons.length; i++){
            if (buttons[i].style.display !== "none") {
                buttons[i].style.display = "none";
            } else {
                buttons[i].style.display = "block";
            }
            //buttons[i].style.display = "none";
        }
    }

    function submit(){
        document.querySelector("#job_units > div.form-actions > input").click();
    }

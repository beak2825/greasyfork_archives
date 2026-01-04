// ==UserScript==
// @name         vista previa tablones hispa
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  try to take over the world!
// @author       You
// @match        https://www.hispachan.org/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382095/vista%20previa%20tablones%20hispa.user.js
// @updateURL https://update.greasyfork.org/scripts/382095/vista%20previa%20tablones%20hispa.meta.js
// ==/UserScript==
function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dele(x) {
    var tam = 0;
    while (tam == 0) {
        await sleep(100);
        var borrar = document.getElementsByClassName("emergente" + x.target.menusel.href.split("/")[3]);
        var recorrer = 0;
        tam = borrar.length
        for (recorrer = 0; recorrer < borrar.length; recorrer++) {
            borrar[recorrer].parentNode.removeChild(borrar[recorrer]);
            recorrer--;
        }
    }
}

async function titulosdos(x) {
    await sleep(50);
    var vinculo = x.target.menusel.href
    var msg;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var titulos;
            var res = this.responseText.split(/[\n\r]/g).join('');
            var revex = /class=\"filetitle\">(.+?)<\/span>/g;
            titulos = res.match(revex);
            var contenido_titulos = "";
            var recorrer;
            //-----
            var para = document.createElement("div");
            para.style.position = "fixed";
            para.style.width = "auto";
            para.style.height = "auto";
            para.style.backgroundColor = "rgb(242,225,230)"
            para.style.padding = "5px"
            para.classList.add("emergente" + x.target.menusel.href.split("/")[3]);
            para.style.border = "1px solid #DDBEAB";
            para.style.top = (x.target.menusel.getBoundingClientRect().top + 15) + "px";
            para.style.left = (x.target.menusel.getBoundingClientRect().left + 50) + "px";
            para.style.zIndex = "9999";

            //-----
            for (recorrer = 0; recorrer < titulos.length; recorrer++) {
                var paratir = document.createElement("p");
                paratir.style.margin = "1px";
                titulos[recorrer] = titulos[recorrer].replace("class=\"filetitle\">", "").replace("<\/span>", "");
                paratir.innerHTML = titulos[recorrer];
                paratir.fontFamily = "sans-serif"
                para.appendChild(paratir);

            }

            console.log(x.target.menusel.getBoundingClientRect().top + "px");
            var node = document.createTextNode(contenido_titulos);
            node.fontFamily = "sans-serif"
            para.appendChild(node);
            x.target.menusel.parentNode.appendChild(para);

        }
    };
    xhttp.open("GET", vinculo, true);
    xhttp.send();
}



var a;
var seccion;
var tablas = document.getElementsByTagName("table");
var secciones = tablas[3].getElementsByTagName("tr")[0].getElementsByTagName("td");
for (seccion = 1; seccion < secciones.length; seccion++) {
    var regionales = secciones[seccion].getElementsByTagName("a");
    for (a = 0; a < regionales.length; a++) {
        regionales[a].addEventListener('mouseover', titulosdos, false);
        regionales[a].addEventListener('mouseout', dele, false);
        regionales[a].menusel = regionales[a];

    }
}
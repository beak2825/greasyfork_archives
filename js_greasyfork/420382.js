// ==UserScript==
// @name         Filtrado de arquitecturas y enlace alcanzable en pkgs.org
// @namespace    http://tampermonkey.net/
// @version      0.10.4
// @description  Agregando enlaces a texto plano en pkgs
// @author       ArtEze
// @match        https://*.pkgs.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420382/Filtrado%20de%20arquitecturas%20y%20enlace%20alcanzable%20en%20pkgsorg.user.js
// @updateURL https://update.greasyfork.org/scripts/420382/Filtrado%20de%20arquitecturas%20y%20enlace%20alcanzable%20en%20pkgsorg.meta.js
// ==/UserScript==

window.p = {}
var p = window.p

p.buscar_fila = function(x){
    var fila = Array.from(document.querySelectorAll("th")).filter(function(y){
        return y.textContent==x
    })[0]
    return fila && (fila.closest("tr"));
}

var techo = document.querySelector(".breadcrumb");
var descarga = document.querySelector("#download")
if(descarga){
    var tabla = descarga.nextElementSibling;
    if(tabla.classList.contains("alert")){
        tabla = tabla.nextElementSibling;
    }
    Array.from(tabla.querySelectorAll("td")).map(function(x){
        var enlace = x.textContent;
        x.innerHTML = "";
        var a = document.createElement("a");
        a.innerHTML = enlace;
        a.setAttribute("target","_blank");
        a.setAttribute("href",enlace);
        x.appendChild(a);
    });
    techo.appendChild(tabla);
    tabla.style["background-color"]="#ffffff";
};

var versión = p.buscar_fila("Package version");
var tamaño_bajado = p.buscar_fila("Download size");
var tamaño_instalado = p.buscar_fila("Installed size");
if( versión && tamaño_bajado && tamaño_instalado ){
    techo.appendChild(versión);
    techo.appendChild(tamaño_bajado);
    techo.appendChild(tamaño_instalado);
};

p.filtrar = function(x){
    if(p.activado){
        Array.from(document.querySelectorAll("div[data-parent*=cord]")).map(function(x){
            x.className = "collapse show";
        });

        var distribuciones = [];
        Array.from(document.querySelectorAll(".accordion tr")).map(function(x){
            if(x.classList.contains("table-active")){
                distribuciones.push([x])
            }else{
                distribuciones.slice(-1)[0].push(x)
            };
        });
        distribuciones.map(function(x){
            var texto = x[0].querySelector("td").childNodes[0].textContent.trim()
            if( !/amd64|x86_64/i.test(texto) ){
                x.map(function(x){return x.remove();});
            };
        });

        Array.from(document.querySelectorAll(".card")).filter(function(x){
            return Array.from(x.querySelectorAll("tr")).length==0
        }).map(function(x){
            x.remove()
            return true
        })
    }
}

p.activar = function(x){
    if(p.activado==undefined){
        p.activado = true
    }
    if(p.activado==true){
        p.activado = false
        p.d.innerHTML = "Desactivado"
    }else{
        p.activado = true
        p.d.innerHTML = "Activado"
    }
}
p.crear_div_flotante = function(){
    var d = document.createElement("button")
    p.d = d
    d.style.position = "fixed"
    d.style["z-index"] = 6000
    d.style.left = "2px"
    d.style.top = "100px"
    d.style["background-color"] = "#ff800040"
    d.innerHTML = "Activado"
    d.addEventListener("click",p.activar)
    p.activado = true
    document.body.appendChild(d)
}

window.intervalo_filtrar = setInterval(p.filtrar,1000)
p.crear_div_flotante()

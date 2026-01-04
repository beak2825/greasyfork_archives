// ==UserScript==
// @name         Wikipedia Mapa Calor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Introduce un mapa de calor de la zona del Mar Menor con las temperaturas y si las especies de allí pueden vivir o no a ellas
// @author       Paula González Martínez
// @match        https://es.wikipedia.org/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/2244px-Wikipedia-logo-v2.svg.png
// @license      GNU GPLv3
// @resource     leaflet_css https://unpkg.com/leaflet@1.7.1/dist/leaflet.css
// @resource     legend_css https://raw.githubusercontent.com/lucyleia28/marmenor.github.io/main/Leaflet.Legend-master/src/leaflet.legend.css
// @resource     own_css https://raw.githubusercontent.com/lucyleia28/marmenor.github.io/main/styles.css
// @require      https://unpkg.com/leaflet@1.7.1/dist/leaflet.js
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/460002/Wikipedia%20Mapa%20Calor.user.js
// @updateURL https://update.greasyfork.org/scripts/460002/Wikipedia%20Mapa%20Calor.meta.js
// ==/UserScript==

class Mapa {
    constructor(map, tileLayer, escala){
        this.map = map;
        this.tileLayer = tileLayer;
        this.scale = escala;
    }
};

// Ruta pagina actual
var pathname = window.location.pathname;
// Listado especies que mostraran la informacion del mapa
const lista_pathname = ['/wiki/Cymodocea_nodosa', '/wiki/Caulerpa_prolifera', '/wiki/Cladophora', '/wiki/Cotylorhiza_tuberculata', '/wiki/Rhizostoma_pulmo', '/wiki/Aurelia_aurita', '/wiki/Pinna_nobilis', '/wiki/Sepia_officinalis', '/wiki/Dendrobranchiata', '/wiki/Anguilla_anguilla', '/wiki/Atherina_boyeri', '/wiki/Hippocampus_guttulatus', '/wiki/Sparus_aurata', '/wiki/Aphanius_iberus', '/wiki/Dicentrarchus_labrax', '/wiki/Mugil_cephalus', '/wiki/Lithognathus_mormyrus', '/wiki/Sarpa_salpa', '/wiki/Gobio_gobio', '/wiki/Gobius_niger'];

// Cargar mi propio CSS
cargarCSS("own_css");
// Cargar LeafletCSS
cargarCSS("leaflet_css");
// Cargar Legend CSS
cargarCSS("legend_css");

loadScript("https://raw.githubusercontent.com/lucyleia28/marmenor.github.io/main/echarts.min.js");
loadScript("https://raw.githubusercontent.com/lucyleia28/marmenor.github.io/main/Leaflet.Legend-master/src/leaflet.legend.js");

// Comprueba que la ruta de la pagina actual este dentro del array de rutas afectadas
if (lista_pathname.includes(pathname)) {
    const items = document.getElementsByClassName("infobox");
    // Saber si existe un infobox en la pagina de Wikipedia
    if (items.length > 0) {
        let infobox = items[0];
        const contenedorMapa = crearContenedorMapa(infobox);
        crearMapa(contenedorMapa);
    }
}

function loadScript(scriptURL) {
    'use strict';
    function httpGetAsync(theUrl, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        xmlHttp.send(null);
    }
    return new Promise(function(resolve){
        httpGetAsync(scriptURL, function(response){
            var s = document.createElement("script");
            s.text = response;
            document.getElementsByTagName("head")[0].appendChild(s);
            resolve();
        });
    });

}

function crearContenedorMapa(infobox){
    let body = infobox.firstChild;
    let filas = body.childNodes;
    let ultimo = filas[filas.length-1];
    
    // Titulo nueva fila
    var hilera_titulo = document.createElement("tr");
    hilera_titulo.innerHTML = '<th colspan="3" style="text-align:center;background-color: #FF9800;"><a href="https://lucyleia28.github.io/marmenor.github.io/" style="color: #2C2C2C; text-decoration: none;" title="Mapa de OpenStreetMap">Mapa de OpenStreetMap</a></th>';
    body.insertBefore(hilera_titulo, ultimo); // Inserto el enlace al mapa antes del ultimo elemento
    // Cuerpo nueva fila
    var hilera_enlace = document.createElement("tr");
    hilera_enlace.innerHTML = '<th colspan="3"><a href="https://lucyleia28.github.io/marmenor.github.io/" title="Enlace al Mapa ampliado">Abrir en otra pestaña</a></th>';
    body.insertBefore(hilera_enlace, ultimo);

    // Insertar mapa
    let mapContainer = document.createElement("div");
    mapContainer.id = "map";
    mapContainer.style = "height: 35em; width: 25em";

    hilera_enlace.firstChild.appendChild(mapContainer);

    // Modal para graficas
    let modal = document.createElement("div");
    modal.id = "grafica";

    hilera_enlace.firstChild.appendChild(modal);

    return mapContainer;
}

function cargarCSS(string){
    const css = GM_getResourceText(string);
    GM_addStyle(css);
}

function crearMapa(mapContainer){
    // Vista inicial de mi mapa: N, W, y el zoom o altura
    let map = L.map('map').setView([37.7325, -0.7905], 11);

    // Capa con el mapa base de openstreetmap que se le anyade a map
    let base = addLayerBase(map);

    // Agregar area Mar Menor con el punto donde está la boya
    let area = addLayerArea(map);

    // Agregar escala
    let escala = addLayerEscala(map);

    // Se crea el objeto Mapa
    let mapa = new Mapa(map, base, escala);

    // Se anyade el mapa al contenedor
    mapContainer.insertAdjacentHTML("afterbegin", map);
}

function addLayerBase(map){
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 13,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    return map;
}

function addLayerArea(map){
    // Agregar capa con el area del mar Menor y el punto donde esta la boya que mide la temperatura
    // Primero se agrega el area del mar Menor
    fetch("https://raw.githubusercontent.com/lucyleia28/marmenor.github.io/main/areaMarMenor.json")
        .then(res => res.json())
        .then(response => {
        var marMenor = response;
        var marMenorJS = L.geoJson(marMenor).addTo(map);

        // Luego se agrega el punto donde esta la boya que mide la temperatura
        var puntoTemperatura = addLayerTemperatura(map);
        // Al hacer click en el punto se abre una grafica con diferentes indicadores

        // Agregar leyenda
        // let leyenda = addLayerLeyenda(map, marMenorJS, addLayerTemperatura(map), marMenor);
    });
}

function addLayerTemperatura(map){
    // Agregar donde esta la boya que mide la temperatura
    var puntoTemperatura = L.circleMarker(L.latLng(37.70940, -0.78552), {
        radius: 2,
        fillColor: "red",
        color: "red",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.6,
    }).addTo(map).on("click", showMensajeModal);
    return puntoTemperatura;
}

function addLayerEscala(map){
    var escala = new L.control.scale({ imperial: false, position: "bottomright" }).addTo(map);
    return escala;
}

function addLayerLeyenda(map, marMenorJS, puntoTemperatura, marMenor){
    // Agregar la leyenda
    var leyenda = new L.control.Legend({
        position: "topright",
        collapsed: false,
        symbolWidth: 24,
        opacity: 1,
        column: 1,
        legends: [{
            label: "Mar Menor",
            type: "rectangle",
            color: "#0074f0",
            fillColor: "#009ff0",
            weight: 2,
            layers: marMenorJS,
            marMenor
        }, {
            label: "Medidor Temperatura del agua",
            type: "circle",
            color: "red",
            fillColor: "red",
            radius: 2,
            layers: [puntoTemperatura]
        }]
    }).addTo(map);
    return leyenda;
}

function showMensajeModal() {
    document.getElementById('grafica').innerHTML = `<div id="modalVentana" class="modal">
                                                    <div class="modalContenido">
                                                        <span class="modalCerrar">&times;</span>
                                                        <h2>Gráfica</h2>
                                                        <div id="graficaContenido" style="width: 700px;height:400px;"></div>
                                                    </div>
                                                </div>`
    // Ventana modal
    var modal = document.getElementById("modalVentana");
    modal.style.display = "block";

    // Hace referencia al elemento <span> que tiene la X que cierra la ventana
    var span = document.getElementsByClassName("modalCerrar")[0];
    // Si el usuario hace clic en la x, la ventana se cierra
    span.addEventListener("click", function() {
        modal.style.display = "none";
    });
    // Si el usuario hace clic fuera de la ventana, se cierra.
    window.addEventListener("click", function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    drawGrafica();
}

function drawGrafica() {
    var chartDom = document.getElementById('graficaContenido');
    var myChart = echarts.init(chartDom);
    var option;

    option = {
        title: {
            text: 'ECharts Getting Started Example'
        },
        tooltip: {},
        legend: {
            data: ['sales']
        },
        xAxis: {
            data: ['Shirts', 'Cardigans', 'Chiffons', 'Pants', 'Heels', 'Socks']
        },
        yAxis: {},
        series: [{
            name: 'sales',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };

    option && myChart.setOption(option);
}
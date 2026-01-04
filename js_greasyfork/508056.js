// ==UserScript==
// @name         INEGI Selector de Nombre
// @name:es      INEGI Select name
// @description  Al ingresar al GAIA, Selecciona las Capas de Calles y Nombre de Localidades activándolas y al dar click a una calle te seleccionara el nombre en automático, copiara al portapapeles y desactivara la capa de Servicios.
// @description:es Al ingresar al GAIA, Selecciona las Capas de Calles y Nombre de Localidades activándolas y al dar click a una calle te seleccionara el nombre en automático, copiara al portapapeles y desactivara la capa de Servicios.
// @author       GWM_
// @namespace https://greasyfork.org/es/users/1362250-gwm
// @version      1.3
// @match        https://gaia.inegi.org.mx/mdm6/*
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/508056/INEGI%20Selector%20de%20Nombre.user.js
// @updateURL https://update.greasyfork.org/scripts/508056/INEGI%20Selector%20de%20Nombre.meta.js
// ==/UserScript==

var _debugLevel = 0;

function log(message, level) {
    if (message && level <= _debugLevel) {
        console.log('GTB4WE: ' + message);
    }
}

// Función para decodificar la parte Base64
function decodeBase64(encoded) {
    return atob(encoded);
}

// Función para codificar en Base64
function encodeBase64(input) {
    return btoa(input);
}

//> Executes a callback if is valid, if not, it tries again after a time
function bootstrap(valid, callback, tries) {
    tries = tries || 1;
    log("bootstrap " + tries, 3);
    if (valid()) {
        callback();
    } else if (tries < 250) {
        setTimeout(function () { bootstrap(valid, callback, tries + 1); }, 200);
    }
}

function init() {
    log("init", 1);
    $.fn.exists = function () {
        return this.length !== 0;
    };

    bootstrap(
        function () { return $("#mdm6DinamicPanel").exists(); },
        initStreetNameObserver
    );
    bootstrap(
        function () { return $("#mdmToolBar").exists() && $("#mdmToolBar")[0].childNodes.length > 0; },
        function () {
            createLink();
            createHideButton();
        }
    );
    console.log("Gaia ToolBox for Waze Editors (GTB4WE) " + GM_info.script.version + " is running.");
}

// Función para activar las capas necesarias
function activateLayers(url) {
    let params = new URLSearchParams(window.location.search);
    let vParam = params.get('v');
    if (!vParam) return;

    let decodedV = decodeBase64(vParam);
    if (decodedV.includes('l:c112') && decodedV.includes('l:c350')) {
        console.log('Las capas ya están activadas.');
        return;
    }

    // Agregar las capas de calles (c112) y nombres de localidades (c350)
    let newLayers = ',l:c112|t112|c350|t350';
    if (!decodedV.includes(',l:')) {
        decodedV += newLayers;
    } else {
        decodedV = decodedV.replace(/,l:[^,]*/, newLayers);
    }

    let newVParam = encodeBase64(decodedV);
    let newUrl = window.location.origin + window.location.pathname + '?v=' + newVParam;

    // Solo redirigir si es necesario
    if (newUrl !== window.location.href) {
        window.location.href = newUrl;
    }
}

// Función para inicializar el observador de nombres de calle
function initStreetNameObserver() {
    log("initStreetNameObserver", 1);
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if ($(mutation.target).hasClass("dinamicPanel-detail")) {
                selectStreetName();
            }
        });
    });
    observer.observe($("#mdm6DinamicPanel")[0], {
        childList: true,
        subtree: true
    });
}

// Función para seleccionar el nombre de la calle
function selectStreetName() {
    var elements = $(".dinamicPanel-detailMainLabel");
    if (elements.length === 0 || elements[0].childNodes.length === 0) return;
    var sel = window.getSelection();
    if (!sel.isCollapsed) return;

    var range = document.createRange();
    elements[0].childNodes.forEach(function (child) {
        if (child.nodeName == "#text") {
            range.selectNodeContents(child);
            return;
        } else if (child.nodeName == "TABLE") {
            range.selectNodeContents(child.childNodes[0].childNodes[0].childNodes[1]);
            return;
        }
    });
    sel.removeAllRanges();
    sel.addRange(range);

     // Copy the selected text to the clipboard
    var text = range.toString();
    navigator.clipboard.writeText(text).then(function() {
        log("Street name copied to clipboard.", 3);
    }).catch(function(error) {
        log("Error copying street name to clipboard: " + error, 3);
    });
}

//> Creates a button to go to WME
function createLink() {
    log("createLink", 1);
    var $link = $("<div id='toWaze' class='custom-toolBar-btn' title='Ir a WME'><img src='https://kstatic.googleusercontent.com/files/6b6c0283ff86327998cad143466c495e7b693c68c9fa95e92909a412478affcd5d33655b88b7b97d07ce3448b6e60476d765b304aed3f85316d6655bc451a7ad' width='24px' height='24px'></div>");
    $("#mdmToolBar").append($link);
    $link[0].onclick = go2WME;
}

//> Extracts coords for current position and opens a new waze map editor window
function go2WME() {
    var params = atob(window.location.href.slice(window.location.href.indexOf('=') + 1)).split(',');
    params.forEach(function (value, i, array) {
        if (value.includes("lat") || value.includes("lon")) {
            array[i] = value.replace(":", "=");
        } else if (value.includes("z")) {
            var z = parseInt(value.slice(value.indexOf(":") + 1)) - 8;
            if (z < 0) z = 0;
            if (z > 10) z = 10;
            array[i] = "zoom=" + z;
        } else {
            array.splice(i, 1);
        }
    });

    // Validar coordenadas
    let lat = params.find(p => p.startsWith("lat="));
    let lon = params.find(p => p.startsWith("lon="));
    if (lat && lon && !isNaN(parseFloat(lat.split("=")[1])) && !isNaN(parseFloat(lon.split("=")[1]))) {
        window.open("https://www.waze.com/editor/?" + params.join("&"));
    } else {
        alert("Coordenadas no válidas.");
    }
}

// Ejecutar la función de activar capas al cargar la página
activateLayers(window.location.href);

// Ejecutar la función al cargar la página
init();
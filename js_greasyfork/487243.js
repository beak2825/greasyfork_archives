// ==UserScript==
// @name         Actualizador de Clasificacion 1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hola
// @author       You
// @match        https://*.grepolis.com/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grepolis.com
// @copyright    2023
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487243/Actualizador%20de%20Clasificacion%201.user.js
// @updateURL https://update.greasyfork.org/scripts/487243/Actualizador%20de%20Clasificacion%201.meta.js
// ==/UserScript==

// Variables globales
let myWebhook = localStorage.getItem('myWebhook') || '';
// Comprobar si se ha almacenado un valor y hacer algo con él
if (myWebhook) {
    // Hacer algo con el valor del webhook, por ejemplo, mostrarlo en la consola
    console.log('Webhook almacenado:', myWebhook);
} else {
    // Manejar el caso en el que no se haya almacenado ningún webhook
    console.log('No se ha almacenado ningún webhook todavía.');
}

let CLIENT_ID = localStorage.getItem('CLIENT_ID') || '545098070132-1nbfivgsovlg0qp0ef29r4maccj1u8fn.apps.googleusercontent.com';
if (CLIENT_ID) {
    console.log('CLIENT_ID almacenado:', CLIENT_ID);
} else {
    console.log('No se ha almacenado ningún CLIENT_ID todavía.');
}
//const apiKey = 'AIzaSyCqlifHsjPARcLScdf4AuS-4FPve_k-TwQ';
let apiKey = localStorage.getItem('apiKey') || 'AIzaSyCqlifHsjPARcLScdf4AuS-4FPve_k-TwQ';
if (apiKey) {
    console.log('apiKey almacenado:', apiKey);
} else {
    console.log('No se ha almacenado ningún apiKey todavía.');
}

let spreadsheetID = localStorage.getItem('spreadsheetID') || '1sQuzlE05wY7UEGUaE76i6LWeCzl_OMNxeWMe5W4Z8Zo';
if (spreadsheetID) {
    console.log('spreadsheetID almacenado:', spreadsheetID);
} else {
    console.log('No se ha almacenado ningún spreadsheetID todavía.');
}

let YOUR_REDIRECT_URI = localStorage.getItem('YOUR_REDIRECT_URI') || 'https://es114.grepolis.com/game/index?';
if (YOUR_REDIRECT_URI) {
    console.log('YOUR_REDIRECT_URI almacenado:', YOUR_REDIRECT_URI);
} else {
    console.log('No se ha almacenado ningún YOUR_REDIRECT_URI todavía.');
}

const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';


var fragmentString = location.hash.substring(1);

// Parse query string to see if page request is coming from OAuth 2.0 server.
var params = {};
var regex = /([^&=]+)=([^&]*)/g, m;
while (m = regex.exec(fragmentString)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
}
if (Object.keys(params).length > 0) {
    localStorage.setItem('oauth2-test-params', JSON.stringify(params) );
    if (params['state'] && params['state'] == 'try_sample_request') {
        console.log("Guardando token access")
    }
}

// If there's an access token, try an API request.
// Otherwise, start OAuth 2.0 flow.
function oauthRequestAndRankWrite(wonderRank) {
    var params = JSON.parse(localStorage.getItem('oauth2-test-params'));
    if (params && params['access_token']) {
        escribirCeldas(params['access_token'], wonderRank);
    } else {
        oauth2SignIn();
    }
}

/*
   * Create form to request access token from Google's OAuth 2.0 server.
   */
function oauth2SignIn() {
    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Create element to open OAuth 2.0 endpoint in new window.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {'client_id': CLIENT_ID,
                  'redirect_uri': YOUR_REDIRECT_URI,
                  'scope': SCOPES,
                  'state': 'try_sample_request',
                  'include_granted_scopes': 'true',
                  'response_type': 'token'};

    // Add form parameters as hidden input values.
    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
}



// Configurar las credenciales de Google Sheets
const spreadsheetId = '1sQuzlE05wY7UEGUaE76i6LWeCzl_OMNxeWMe5W4Z8Zo';

// Leer celdas
function leerCeldas(ranking) {
    const range = 'ControlNiveles!Q950'; // Rango de celdas a leer
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    fetch(url)
        .then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
    })
        .then(data => {
        const values = data.values;
        // Procesa los valores de las celdas aquí
        if(values){
            wonderRank = JSON.parse(values[0][0]);
        }
        leerTime(ranking);
    })
        .catch(error => {
        console.error('Error al leer celdas:', error);
    });
}

function leerTime(ranking) {
    const range = 'ControlNiveles!Q952'; // Rango de celdas a leer
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
        const values = data.values;
        // Procesa los valores de las celdas aquí
        if(values){
            wonderTime = JSON.parse(values[0][0]);
        }
        wonderCheck(ranking);
    })
        .catch(error => {
        console.error('Error al leer celdas:', error);
    });
}

function escribirRawDataTime(accessToken) {
    const range = 'ControlNiveles!Q952'; // Celda donde escribir
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?access_token=${accessToken}&valueInputOption=RAW`;
    const data = {
        values: [[JSON.stringify(wonderTime)]]
    };
    fetch(url, {
        method: 'PUT', // O 'POST' si lo prefieres
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
        // Procesa la respuesta después de escribir en la celda
        if (response.status === 200) {
            console.log('Celda escrita con éxito');
        } else if (response.status === 401) {
            // Token inválido, solicitar permiso al usuario.
            console.log('Error de autenticación');
            oauth2SignIn();
        }
    })
        .catch(error => {
        console.error('Error al escribir en celda:', error);
    });
}

function escribirRawData(accessToken, wonderRank) {
    const range = 'ControlNiveles!Q950'; // Celda donde escribir
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?access_token=${accessToken}&valueInputOption=RAW`;
    const data = {
        values: [[JSON.stringify(wonderRank)]]
    };
    fetch(url, {
        method: 'PUT', // O 'POST' si lo prefieres
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
        // Procesa la respuesta después de escribir en la celda
        if (response.status === 200) {
            escribirTiempo(accessToken);
            console.log('Celda escrita con éxito');
        } else if (response.status === 401) {
            // Token inválido, solicitar permiso al usuario.
            console.log('Error de autenticación');
            oauth2SignIn();
        }
    })
        .catch(error => {
        console.error('Error al escribir en celda:', error);
    });
}


function escribirTiempo(accessToken) {
    const range = 'ControlNiveles!A11:J20'; // Celda donde escribir
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?access_token=${accessToken}&valueInputOption=RAW`;
    // Reformatea los datos para cumplir con la estructura requerida por Google Sheets
    const formattedData = [];

    // Encabezado de columnas con formato de texto en negrita
    const headerRow = ['Maravillas', ...Object.keys(wonderTime)];
    formattedData.push(headerRow);
    const tiempoPorContenido = {};
    // Obtener la lista de todas las maravillas disponibles
    const maravillasDisponibles = ["Coloso","Estatua","Faro","Jardines","Pirámides","Templo", "Tumba"]
    // Recorre cada maravilla disponible
    for (const maravilla of maravillasDisponibles) {
        tiempoPorContenido[maravilla] = [];
        // Recorre cada grupo en wonderRank
        for (const grupo in wonderTime) {
            const contenido = wonderTime[grupo];
            // Verifica si la maravilla existe en el grupo
            if (contenido.hasOwnProperty(maravilla)) {
                const time = contenido[maravilla];
                tiempoPorContenido[maravilla].push(time);
            } else {
                // Si la maravilla no existe en el grupo, agrega un valor vacío
                tiempoPorContenido[maravilla].push("");
            }
        }
    }
    for (const mara in tiempoPorContenido) {
        const rowData = [mara, ...tiempoPorContenido[mara]];
        formattedData.push(rowData);
    }
    // Crea un objeto de datos con el formato aplicado en negrita
    const data = {
        values: formattedData
    };
    fetch(url, {
        method: 'PUT', // O 'POST' si lo prefieres
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
        // Procesa la respuesta después de escribir en la celda
        if (response.status === 200) {
            escribirRawDataTime(accessToken);
            console.log('Celda escrita con éxito');
        } else if (response.status === 401) {
            // Token inválido, solicitar permiso al usuario.
            console.log('Error de autenticación');
            oauth2SignIn();
        }
    })
        .catch(error => {
        console.error('Error al escribir en celda:', error);
    });
}

// Escribir en celdas
function escribirCeldas(accessToken, wonderRank) {
    const range = 'ControlNiveles!A1:J40'; // Celda donde escribir
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?access_token=${accessToken}&valueInputOption=RAW`;
    // Reformatea los datos para cumplir con la estructura requerida por Google Sheets
    const formattedData = [];

    // Encabezado de columnas con formato de texto en negrita
    const headerRow = ['Maravillas', ...Object.keys(wonderRank)];
    formattedData.push(headerRow);
    const nivelesPorContenido = {};
    // Obtener la lista de todas las maravillas disponibles
    const maravillasDisponibles = ["Coloso","Estatua","Faro","Jardines","Pirámides","Templo", "Tumba"]
    // Recorre cada maravilla disponible
    for (const maravilla of maravillasDisponibles) {
        nivelesPorContenido[maravilla] = [];
        // Recorre cada grupo en wonderRank
        for (const grupo in wonderRank) {
            const contenido = wonderRank[grupo];
            // Verifica si la maravilla existe en el grupo
            if (contenido.hasOwnProperty(maravilla)) {
                const nivel = parseInt(contenido[maravilla]);
                nivelesPorContenido[maravilla].push(nivel);
            } else {
                // Si la maravilla no existe en el grupo, agrega un valor vacío
                nivelesPorContenido[maravilla].push("");
            }
        }
    }
    for (const mara in nivelesPorContenido) {
        const rowData = [mara, ...nivelesPorContenido[mara]];
        formattedData.push(rowData);
    }
    const dateFormatted = getActualDateFormatted();
    formattedData.push([dateFormatted]);
    // Crea un objeto de datos con el formato aplicado en negrita
    const data = {
        values: formattedData
    };
    fetch(url, {
        method: 'PUT', // O 'POST' si lo prefieres
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
        // Procesa la respuesta después de escribir en la celda
        if (response.status === 200) {
            console.log('Celda escrita con éxito');
            escribirRawData(accessToken, wonderRank);
        } else if (response.status === 401) {
            // Token inválido, solicitar permiso al usuario.
            console.log('Error de autenticación');
            oauth2SignIn();
        }
    })
        .catch(error => {
        console.error('Error al escribir en celda:', error);
    });
}


function crearBotonPersonalizado(Webhook, subtipo) {
    console.log('Creando el botón personalizado:', Webhook);

    var liItem = document.createElement('li');
    liItem.className = 'Webhook main_menu_item';
    liItem.id = "webhookID"

    var contentWrapper = document.createElement('span');
    contentWrapper.className = 'content_wrapper';

    var buttonWrapper = document.createElement('span');
    buttonWrapper.className = 'button_wrapper';

    var button = document.createElement('span');
    button.className = 'button';

    // Agregar el icono al botón
    var icon = document.createElement('span');
    icon.className = 'icon';
    icon.style.background = 'url(https://gpes.innogamescdn.com/images/game/autogenerated/layout/layout_095495a.png) no-repeat -432px -648px';
    icon.style.width = '25px';
    icon.style.height = '21px';

    button.appendChild(icon);

    var uiHighlight = document.createElement('div');
    uiHighlight.className = 'ui_highlight';
    uiHighlight.setAttribute('data-type', 'main_menu');
    uiHighlight.setAttribute('data-subtype', subtipo);

    var indicator = document.createElement('span');
    indicator.className = 'indicator';
    indicator.setAttribute('data-indicator-id', subtipo);

    buttonWrapper.appendChild(button);

    var nameWrapper = document.createElement('span');
    nameWrapper.className = 'name_wrapper';

    var name = document.createElement('span');
    name.className = 'name';
    name.textContent = 'Actualizador';

    nameWrapper.appendChild(name);

    contentWrapper.appendChild(buttonWrapper);
    contentWrapper.appendChild(nameWrapper);

    liItem.appendChild(contentWrapper);

    var menuContainer = document.querySelector('ul');
    menuContainer.appendChild(liItem);

    liItem.addEventListener('click', function () {
        // Llama a la función hacerMenu para abrir la ventana en el juego
        HacerVentana();
    });

    // Busca el elemento con class "forum main_menu_item last" y elimina la clase "last"
    var forumMenuItem = document.querySelector('.forum.main_menu_item.last');
    if (forumMenuItem) {
        forumMenuItem.classList.remove('last');
    }
}


function HacerVentana() {
    var existeVentana = false;
    var existeObjeto = null;
    for (var objeto of document.getElementsByClassName("ui-dialog-title")) {
        if (objeto.innerHTML == "Datos script") {
            existeVentana = true;
            existeObjeto = objeto;
        }
    }
    if (!existeVentana)
        wnd = Layout.wnd.Create(Layout.wnd.TYPE_DIALOG, "GME Settings");
    wnd.setContent("");
    for (objeto of document.getElementsByClassName("ui-dialog-title")) {
        if (objeto.innerHTML == "GME Settings") {
            existeObjeto = objeto;
        }
    }
    wnd.setHeight(400); // Aumentamos la altura para mostrar los cuadros de texto
    wnd.setWidth(400); // Aumentamos el ancho para mostrar los cuadros de texto
    wnd.setTitle("Datos script");
    var title = existeObjeto;
    var frame = title.parentElement.parentElement.children[1].children[4];
    frame.innerHTML = "";

    // Crear un formulario con cuadros de texto y un botón de guardar
    var form = document.createElement("form");

    // Estilo común para los títulos
    var labelStyle = "font-weight: bold; text-decoration: underline;";

    // Cuadro de texto 1: Discord Webhook
    var input1Wrapper = document.createElement("div");
    input1Wrapper.className = "textbox-wrapper";
    var input1Label = document.createElement("div");
    input1Label.className = "label";
    input1Label.style = labelStyle;
    input1Label.textContent = "Discord Webhook:";
    var input1 = document.createElement("input");
    input1.type = "text";
    input1.id = "cuadroTexto1";
    input1.placeholder = "Ingrese su Discord Webhook aquí"; // Texto de marcador de posición
    input1.size = 20;
    input1.className = "textbox";
    input1.style.width = "95%";
    input1Wrapper.appendChild(input1Label);
    input1Wrapper.appendChild(input1);
    form.appendChild(input1Wrapper);

    // Espacio de 3 píxeles entre el título y el cuadro de texto
    input1Label.style.marginBottom = "3px";

    // Espacio entre apartados
    form.appendChild(document.createElement("br"));

    // Cuadro de texto 2: CLIENT_ID
    var input2Wrapper = document.createElement("div");
    input2Wrapper.className = "textbox-wrapper";
    var input2Label = document.createElement("div");
    input2Label.className = "label";
    input2Label.style = labelStyle;
    input2Label.textContent = "CLIENT_ID:";
    var input2 = document.createElement("input");
    input2.type = "text";
    input2.id = "cuadroTexto2";
    input2.placeholder = "Ingrese su CLIENT_ID aquí"; // Texto de marcador de posición
    input2.size = 20;
    input2.className = "textbox";
    input2.style.width = "95%";
    input2Wrapper.appendChild(input2Label);
    input2Wrapper.appendChild(input2);
    form.appendChild(input2Wrapper);

    // Espacio de 3 píxeles entre el título y el cuadro de texto
    input2Label.style.marginBottom = "3px";

    // Espacio entre apartados
    form.appendChild(document.createElement("br"));

    // Cuadro de texto 3: Google Sheets API Key
    var input3Wrapper = document.createElement("div");
    input3Wrapper.className = "textbox-wrapper";
    var input3Label = document.createElement("div");
    input3Label.className = "label";
    input3Label.style = labelStyle;
    input3Label.textContent = "Google Sheets API Key:";
    var input3 = document.createElement("input");
    input3.type = "text";
    input3.id = "cuadroTexto3";
    input3.placeholder = "Ingrese su Google Sheets API Key aquí"; // Texto de marcador de posición
    input3.size = 20;
    input3.className = "textbox";
    input3.style.width = "95%";
    input3Wrapper.appendChild(input3Label);
    input3Wrapper.appendChild(input3);
    form.appendChild(input3Wrapper);

    // Espacio de 3 píxeles entre el título y el cuadro de texto
    input3Label.style.marginBottom = "3px";

    // Espacio entre apartados
    form.appendChild(document.createElement("br"));

    // Cuadro de texto 4: Google Sheets Spreadsheet ID
    var input4Wrapper = document.createElement("div");
    input4Wrapper.className = "textbox-wrapper";
    var input4Label = document.createElement("div");
    input4Label.className = "label";
    input4Label.style = labelStyle;
    input4Label.textContent = "Google Sheets Spreadsheet ID:";
    var input4 = document.createElement("input");
    input4.type = "text";
    input4.id = "cuadroTexto4";
    input4.placeholder = "Ingrese su Google Sheets Spreadsheet ID aquí"; // Texto de marcador de posición
    input4.size = 20;
    input4.className = "textbox";
    input4.style.width = "95%";
    input4Wrapper.appendChild(input4Label);
    input4Wrapper.appendChild(input4);
    form.appendChild(input4Wrapper);

    // Espacio de 3 píxeles entre el título y el cuadro de texto
    input4Label.style.marginBottom = "3px";

    // Espacio entre apartados
    form.appendChild(document.createElement("br"));

    // Cuadro de texto 5: Redirect URL
    var input5Wrapper = document.createElement("div");
    input5Wrapper.className = "textbox-wrapper";
    var input5Label = document.createElement("div");
    input5Label.className = "label";
    input5Label.style = labelStyle;
    input5Label.textContent = "Redirect URL:";
    var input5 = document.createElement("input");
    input5.type = "text";
    input5.id = "cuadroTexto5";
    input5.placeholder = "Ingrese su Redirect URL aquí"; // Texto de marcador de posición
    input5.size = 20;
    input5.className = "textbox";
    input5.style.width = "95%";
    input5Wrapper.appendChild(input5Label);
    input5Wrapper.appendChild(input5);
    form.appendChild(input5Wrapper);

    // Espacio de 3 píxeles entre el título y el cuadro de texto
    input5Label.style.marginBottom = "3px";

    // Botón de guardar
    var guardarButton = document.createElement("button");
    guardarButton.type = "button";
    guardarButton.className = "button_new";
    guardarButton.style.margin = "10px 0";
    guardarButton.innerHTML = `
        <div class="left"></div>
        <div class="right"></div>
        <div class="caption js-caption">Guardar<div class="effect js-effect"></div></div>
    `;
    guardarButton.addEventListener("click", function () {
        // Obtener los valores de los cuadros de texto y guardarlos en las variables globales
        myWebhook = input1.value != "" ? input1.value : myWebhook;
        CLIENT_ID = input2.value != "" ? input2.value : CLIENT_ID;
        apiKey = input3.value != "" ? input3.value : apiKey;
        spreadsheetID = input4.value != "" ? input4.value : spreadsheetID;
        YOUR_REDIRECT_URI = input5.value != "" ? input5.value : YOUR_REDIRECT_URI

        // Puedes hacer lo que desees con los valores, por ejemplo, guardarlos en localStorage
        localStorage.setItem("myWebhook", myWebhook);
        localStorage.setItem("CLIENT_ID", CLIENT_ID);
        localStorage.setItem("apiKey", apiKey);
        localStorage.setItem("spreadsheetID", spreadsheetID);
        localStorage.setItem("YOUR_REDIRECT_URI", YOUR_REDIRECT_URI);

        // Cerrar la ventana emergente
        wnd.close();
    });

    form.appendChild(guardarButton);

    // Botón "Indicaciones" con estilo similar al botón "Guardar"
    var indicacionesButton = document.createElement("button");
    indicacionesButton.type = "button";
    indicacionesButton.className = "button_new";
    indicacionesButton.style.margin = "10px 10px 10px 0"; // Añade margen a la derecha
    indicacionesButton.style.position = 'absolute';
    indicacionesButton.style.right = '1px'
    indicacionesButton.innerHTML = `
    <div class="left"></div><div class="right"></div><div class="caption js-caption">Indicaciones<div class="effect js-effect"></div></div>`;
    indicacionesButton.addEventListener("click", function () {
        // Abre una ventana emergente con las indicaciones
        var popupWindow = window.open("https://ejejejejejjj.github.io/guia/", "Indicaciones", "width=800,height=600");
    });
    form.appendChild(indicacionesButton);


    // Agregar el formulario al contenido de la ventana emergente
    frame.appendChild(form);

    // Agregar el formulario al contenido de la ventana emergente
    frame.appendChild(form);
}


const webhookUrl = (myWebhook); //Pon la url de tu webhook a tu servidor de Discord - En verda no


function mostrarRespuestaEnVentanaInvisible(respuesta) {
    // Crea un elemento iframe invisible
    var iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.id = "IDRankingIframe";

    iframe.onload = function() {
        let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        let ranking = iframeDocument.getElementById("ranking_inner");
        let webhookButton = window.document.getElementById("webhookID");
        if(!webhookButton && isWonderStarted(ranking)) {
            // Crear el botón personalizado "Webhook"
            crearBotonPersonalizado('Webhook');
            console.log("Botón actualizador creado.");

        }
        leerCeldas(ranking);
    };

    iframe.srcdoc = respuesta;
    // Agrega el iframe al documento
    document.body.appendChild(iframe);
}

function getActualHourFormatted() {
    const fechaActual = new Date();
    fechaActual.setUTCHours(fechaActual.getUTCHours() + 2);
    // Formatear la hora en el formato deseado (sin T, sin Z y sin milisegundos)
    const horaFormateada = fechaActual.toISOString().replace('T', ' ').replace(/.\d+Z$/, '').split(' ')[1];
    return horaFormateada;
}

function getActualDateFormatted() {
    const fechaActual = new Date();
    fechaActual.setUTCHours(fechaActual.getUTCHours() + 2);
    // Obtiene el día, mes y año de la fecha
    const dia = fechaActual.getDate().toString().padStart(2, '0'); // Agrega un cero inicial si es necesario
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // El mes se indexa desde 0
    const año = fechaActual.getFullYear();

    // Formatea la fecha como DD/MM/YYYY
    const fechaFormateada = `${dia}/${mes}/${año} ${fechaActual.toISOString().replace('T', ' ').replace(/.\d+Z$/, '').split(" ")[1]}`;
    return fechaFormateada;
}

function createRankingUrlAndFetch() {
    let token =  window.Game.csrfToken;
    let townId =  window.Game.townId;
    let baseURL = "https://" + window.location.host + "/game/ranking?"
    let action = "&action=wonder_alliance";
    let cookies = document.cookie;
    let timestamp = Date.now();
    let json = "&json=%7B%22type%22%3A%22all%22%2C%22town_id%22%3A"+townId+"%2C%22nl_init%22%3Atrue%7D"
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    let finalURL = baseURL + "town_id=" + townId + action + "&h=" + token + json + "_=" + timestamp

    fetch(finalURL, requestOptions)
        .then(response => {
        if (response.ok) {
            // Parsear la respuesta como JSON si es un JSON
            response.json().then(data => {
                console.log('Mensaje enviado con éxito');
                // Procesa la respuesta y crea la ventana
                const responseHTML = data.plain.html;
                mostrarRespuestaEnVentanaInvisible(responseHTML);
            }).catch(error => {
                console.error('Error al parsear la respuesta JSON:', error);
            });
        } else {
            console.error('Error al enviar el mensaje a Discord:', response.status);
        }
    })
        .catch(error => {
        console.error('Error en la solicitud:', error);
    });
}


function formatearDatosComoTabla(oldWonderRank, newWonderRank) {
    let tabla = "```asciidoc\n";

    for (const grupo in newWonderRank) {
        if (newWonderRank.hasOwnProperty(grupo)) { // Verificar si la propiedad pertenece al objeto
            tabla += `Grupo: ${grupo}\n`;
            tabla += "--------------------------\n";
            tabla += "Edificio   Nivel   Fecha\n";
            tabla += "--------------------------\n";

            // Ordenar las propiedades (maravillas) alfabéticamente
            const maravillasOrdenadas = Object.keys(newWonderRank[grupo]).sort();

            for (const propiedad of maravillasOrdenadas) {
                const oldValue = oldWonderRank && oldWonderRank[grupo] && oldWonderRank[grupo][propiedad];
                const newValue = newWonderRank[grupo][propiedad];
                const formattedPropiedad = `${propiedad.padEnd(11)} ${newValue.padEnd(4)} ${wonderTime[grupo][propiedad]}`;

                if (oldValue && oldValue !== newValue) {
                    // Si el valor ha cambiado, lo marcamos en negrita
                    tabla += `${formattedPropiedad} ::\n`;
                } else {
                    tabla += `${formattedPropiedad}\n`;
                }
            }

            tabla += " \n";
        }
    }

    tabla += "```";
    return tabla;
}

//const webhookUrl = 'https://discordapp.com/api/webhooks/1148541913071362182/NmTm5Tx4Hrhs-1Z_k1HJSfaQzFf0UVQcqY8IlHzn_xFbf3Dbpvbn5dLiUZ4PXDQSoxK_'; //Pon la url de tu webhook a tu servidor de Discord
function sendMessageToWebhookDiscord(message) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message }),
    };
    fetch(webhookUrl, requestOptions)
        .then(response => {
        if (response.ok) {
            console.log('Mensaje enviado con éxito a Discord');
        } else {
            console.error('Error al enviar el mensaje a Discord:', response.status);
        }
    })
        .catch(error => {
        console.error('Error en la solicitud:', error);
    });
}


function sendNewRankingMessage(oldWonderRank, newWonderRank) {
    // Realiza una solicitud POST al servidor del bot
    const horaFormateada = getActualHourFormatted(); // Obtenemos solo la hora
    // Realiza una solicitud POST al servidor del bot
    var mensaje = 'Se ha actualizado el ranking a las ';
    mensaje += '**' + horaFormateada + '**'; // Poner la hora en negrita
    mensaje += " con el siguiente ranking: \n"
    mensaje += formatearDatosComoTabla(oldWonderRank, newWonderRank);
    sendMessageToWebhookDiscord(mensaje)
    oauthRequestAndRankWrite(newWonderRank)
}


function sendStartBotRankingMessage(oldWonderRank, newWonderRank) {
    // Realiza una solicitud POST al servidor del bot
    var mensaje = 'Se ha iniciado el bot para comprobar el ranking de maravillas el ';
    const horaFormateada = getActualHourFormatted(); // Obtenemos solo la hora
    // Realiza una solicitud POST al servidor del bot
    mensaje += '**' + horaFormateada + '**';
    mensaje += " con el siguiente ranking: \n"
    mensaje += formatearDatosComoTabla(oldWonderRank, newWonderRank);
    sendMessageToWebhookDiscord(mensaje);
    oauthRequestAndRankWrite(newWonderRank)
}



function getWonderName(wonderString) {
    if(wonderString.includes("pirámides")) {
        return "Pirámides";
    }
    if(wonderString.includes("Coloso")) {
        return "Coloso";
    }
    if(wonderString.includes("estatua")) {
        return "Estatua";
    }
    if(wonderString.includes("faro")) {
        return "Faro";
    }
    if(wonderString.includes("tumba")) {
        return "Tumba";
    }
    if(wonderString.includes("jardines")) {
        return "Jardines";
    }
    if(wonderString.includes("templo")) {
        return "Templo";
    }
}

var wonderRank; //Este será el ranking que será representado como un diccionario con todas las alianzas y dentro de cada alianza las maravillas con su nivel
var wonderTime; //Este será los timmings que será representado como un diccionario con todas las alianzas y dentro de cada alianza las maravillas con su hora de construcción aproximada

function isWonderStarted(rankingElement) {
    let childrenRankingTable = rankingElement.children;
    if(childrenRankingTable.length > 1) {
        return true;
    }
    else {
        console.log("Las maravillas aun no han empezado.");
        return false;
    }
}

function wonderCheck(rankingElement) {
    let childrenRankingTable = rankingElement.children;
    var rankingChanged = false;
    var nuevoRank = {};
    var nuevoTime = wonderTime || {};
    var actualAlianza = "";
    let wonderStarted = isWonderStarted(rankingElement);
    if(wonderStarted == true) {
        for (var i = 0; i < childrenRankingTable.length; i++) {
            var elemento = childrenRankingTable[i];
            let elementName = elemento.className;
            if(elementName.includes("game_table")) {
                let alianzaName = elemento.getElementsByClassName("r_name")[0].firstChild.textContent;
                actualAlianza = alianzaName;
            }
            else {
                let wonder = getWonderName(elemento.getElementsByClassName("r_wonder")[0].textContent);
                let stage = elemento.getElementsByClassName("r_stage")[0].textContent;
                if (!nuevoRank[actualAlianza]) {
                    nuevoRank[actualAlianza] = {}; // Inicializa la propiedad si no existe
                }
                if(!nuevoTime[actualAlianza]) {
                    nuevoTime[actualAlianza] = {};
                }
                nuevoRank[actualAlianza][wonder] = stage;
                if(!wonderRank || !wonderRank[actualAlianza] || wonderRank[actualAlianza][wonder] != stage) {
                    rankingChanged = true;
                    nuevoTime[actualAlianza][wonder] = getActualDateFormatted();
                }
            }
        }
        if(rankingChanged == true) {
            wonderTime = nuevoTime;
            if(!wonderRank) {
                sendStartBotRankingMessage(wonderRank, nuevoRank);
            }
            else {
                sendNewRankingMessage(wonderRank,nuevoRank);
            }
            wonderRank = nuevoRank;
        }
    }
}

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

var timerID;

function startWonderCheck() {
    stopWonderCheck(); //Por si hay alguno en ejecución, lo reiniciamos
    createRankingUrlAndFetch()
    timerID = setInterval(startWonderCheck, randomIntFromInterval(5*60*1000, 10*60*1000)); //Así no será el segundo exacto xD
}

function stopWonderCheck() {
    clearInterval(timerID);
}


function appendButtons(){
    let maravillasRankingOverview = document.getElementsByClassName("ranking_table_body wonder_ranking");
    var buttonStart = document.createElement("a");
    buttonStart.innerHTML = '<div class="menu_wrapper minimize closable" style="width: 65.3438px; float: right;"><ul class="menu_inner"><li><a data-menu_name="IniciarB" class="submenu_link active" href="#" id="fto_claim"><span class="left"><span class="right"><span class="middle">IniciarB</span></span></span></a></li></ul></div>';
    buttonStart.onclick = function () {
        startWonderCheck();
    };
    var buttonStop = document.createElement("a");
    buttonStop.innerHTML = '<div class="menu_wrapper minimize closable" style="width: 65.3438px; float: right;"><ul class="menu_inner"><li><a data-menu_name="PararB" class="submenu_link active" href="#" id="fto_claim"><span class="left"><span class="right"><span class="middle">PararB</span></span></span></a></li></ul></div>';
    buttonStop.onclick = function () {
        stopWonderCheck();
    };
    var popup = maravillasRankingOverview[0].children.ranking_search;
    if(!popup.innerText.includes("IniciarB")) {
        popup.appendChild(buttonStart);
    }
    if(!popup.innerText.includes("PararB")) {
        popup.appendChild(buttonStop);
    }
}

function addOnClickToWonderRankOverview() {
    setTimeout(function(){ //Solo para darle un respiro y que pueda cargar correctamente
        var rankingButton = document.querySelector('[data-option-id="world_wonders"]');
        if(!rankingButton) {
            console.log("No estas en un mundo de Maravillas");
        }
        else {
            startWonderCheck();
        }
    }, 5000);
}



function _appendScript(f, A) {
    var c = document.createElement("script");
    c.type = "text/javascript";
    c.id = f;
    c.textContent = A;
    document.body.appendChild(c);
}
_appendScript("timerID", "var timerID;");
_appendScript("wonderRank", "var wonderRank;");
_appendScript("wonderTime", "var wonderTime;");
_appendScript("startWonderCheck", startWonderCheck.toString());
_appendScript("appendButtons", appendButtons.toString());
_appendScript("stopWonderCheck", stopWonderCheck.toString());
_appendScript("wonderCheck", wonderCheck.toString());
_appendScript("randomIntFromInterval", randomIntFromInterval.toString());
_appendScript("getWonderName", getWonderName.toString());
_appendScript("sendStartBotRankingMessage", sendStartBotRankingMessage.toString());
_appendScript("sendMessageToWebhookDiscord", sendMessageToWebhookDiscord.toString());
_appendScript("sendNewRankingMessage", sendNewRankingMessage.toString());
_appendScript("createRankingUrlAndFetch", createRankingUrlAndFetch.toString());
_appendScript("mostrarRespuestaEnVentanaInvisible", mostrarRespuestaEnVentanaInvisible.toString());
_appendScript("formatearDatosComoTabla", formatearDatosComoTabla.toString());
_appendScript("addOnClickToWonderRankOverview", addOnClickToWonderRankOverview.toString());
_appendScript("leerCeldas", leerCeldas.toString());
_appendScript("escribirCeldas", escribirCeldas.toString());


window.onload = addOnClickToWonderRankOverview();
console.log('%cActualizar classificacion listo :)', 'color: green; font-size: 1.5em; font-weight: bolder; ');
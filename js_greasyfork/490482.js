// ==UserScript==
// @name         Ajustar ataque
// @namespace    Ajustar ataque
// @version      0.2.0
// @description  Versión alternativa de ajustar ataques
// @author       Yo
// @match        https://*.grepolis.com/game/*
// @match        http://*.grepolis.com/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grepolis.com
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/490482/Ajustar%20ataque.user.js
// @updateURL https://update.greasyfork.org/scripts/490482/Ajustar%20ataque.meta.js
// ==/UserScript==

documentoCargado();
observerAjax();
moverMarco = new moverMarco;
var horaAjuste = GM_getValue("horaAjuste", 0);

// Funciones autoguardado tropas
////////////////////////////////

function insertCheckboxForUnitSaving() {
    const attackWindow = document.querySelector('.attack_support_window');
    console.log(attackWindow.parentElement.parentElement);
    attackWindow.parentElement.parentElement.style.height = '515px'; // Cambia '515px' por la altura deseada

    if (attackWindow && !document.getElementById('checkbox_save_units')) {
        const checkboxHTML = `
            <div id="checkbox_save_units" class="checkbox_new checked green" style="margin-bottom: 10px;">
                <div class="cbx_icon"></div>
                <div class="cbx_caption">Guardar selección de unidades</div>
            </div>`;
        attackWindow.insertAdjacentHTML('afterbegin', checkboxHTML);
        document.getElementById('checkbox_save_units').addEventListener('click', toggleUnitSavingFeature);
    }
}


function toggleUnitSavingFeature() {
    const isChecked = document.getElementById('checkbox_save_units').classList.contains('checked');
    if (isChecked) {
        document.getElementById('checkbox_save_units').classList.remove('checked');
        GM_setValue('unitSavingEnabled', false);
    } else {
        document.getElementById('checkbox_save_units').classList.add('checked');
        GM_setValue('unitSavingEnabled', true);
    }
}


function saveUnitSelections() {
    if (!GM_getValue('unitSavingEnabled', false)){return;}
    const unitSelections = {};
    document.querySelectorAll('.unit_input').forEach(input => {
        const unitType = input.getAttribute('name');
        const unitCount = input.value;
        if (unitType && unitCount && unitCount > 0) {
            unitSelections[unitType] = unitCount;
        }
    });
    GM_setValue('savedUnitSelections', JSON.stringify(unitSelections));
}


function loadUnitSelections(attempt = 1) {
    console.log(attempt);
    if (!GM_getValue('unitSavingEnabled', false)) return;

    const savedUnitSelections = JSON.parse(GM_getValue('savedUnitSelections', '{}'));
    let allFilled = true; // Asumimos que todas las casillas se llenarán correctamente
    setTimeout(function(){
        Object.keys(savedUnitSelections).forEach(unitType => {
            const input = document.querySelector(`.unit_input[name="${unitType}"]`);

            if (input) {
                console.log(input.value, '1234');
                console.log(savedUnitSelections[unitType], '5678');
                input.value = savedUnitSelections[unitType];
                input.dispatchEvent(new Event('change'));
                if (!input.value) { // Verifica si el valor no se ha establecido correctamente
                    allFilled = false;
                    console.log('Hola');
                }
            }
        });

        // Si no todas las casillas se llenaron y no hemos superado el número máximo de intentos, reintenta
        const maxAttempts = 5; // Define un máximo de intentos para evitar bucles infinitos
        if (!allFilled && attempt < maxAttempts) {
            console.log(`No todas las casillas se llenaron en el intento ${attempt}. Reintentando...`);
            setTimeout(() => loadUnitSelections(attempt + 1), 50); // Espera 1 segundo antes de reintentar
        }
    }, 250);

}


function attachListeners() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                // Asegúrate de que el nodo agregado es un elemento
                if (node.nodeType === 1) {
                    // Busca todos los botones en el nodo agregado y en sus descendientes
                    node.querySelectorAll('a.button').forEach(button => {
                        if (button.textContent.trim() === "Reforzar") {
                            // Añade el evento click aquí
                            button.addEventListener('click', function(e) {

                                e.preventDefault();
                                saveUnitSelections();
                                setTimeout(() => {
                                    loadUnitSelections();
                                }, 200);
                            });

                        }
                    });
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const attackButton = document.querySelector('#btn_attack_town');
    if (attackButton) {
        attackButton.addEventListener('click', function(e) {

            e.preventDefault();
            saveUnitSelections();

            setTimeout(() => {
                loadUnitSelections();
            }, 200);
        });
    } else {
    }
}


// Funciones generales
//////////////////////
function moverMarco() {
    function f() {
        if (0 == $("#toolbar_activity_commands_list").length) {
            setTimeout(function () {
                f();
            }, 500);
        } else {
            var A = document.querySelector("#toolbar_activity_commands_list");
            if (0 == $("#grcrt_taclWrap").length) {
                if ($("#toolbar_activity_commands_list").wrap($("<div/>", { "class": "grcrt_taclWrap", id: "grcrt_taclWrap" })), true) {
                    $("#toolbar_activity_commands_list").addClass("grcrt_tacl");
                    $("#grcrt_taclWrap").draggable().draggable("enable");
                    var c = new MutationObserver(function (h) {
                        h.forEach(function (k) {
                            $(A).hasClass("grcrt_tacl") && $("#grcrt_taclWrap").attr("style") && "none" == $(A).css("display") && $(".activity.commands").trigger("mouseenter");
                        });
                    });
                    0 == $("#toolbar_activity_commands_list>.js-dropdown-list>a.cancel").length && $("#toolbar_activity_commands_list>.js-dropdown-list").append($("<a/>", { href: "#n", "class": "cancel", style: "display:none;" }).click(function () {
                        $("#grcrt_taclWrap").removeAttr("style");
                    }));
                    c.observe(A, { attributes: !0, childList: !1, characterData: !1 });
                } else {
                    $("#toolbar_activity_commands_list").removeClass("grcrt_tacl"), $("#grcrt_taclWrap").draggable().draggable("disable").removeAttr("style");
                }
            }
            $(A).hasClass("grcrt_tacl") && $("#grcrt_taclWrap").attr("style") && $(".activity.commands").trigger("mouseenter");
        }
    }
    $("head").append($("<style/>").append($("<style/>").append(".showImportant { bisplay: block !important}").append("#grcrt_taclWrap { left:312px; position: absolute; top: 29px;}").append("#grcrt_taclWrap>#toolbar_activity_commands_list { left: 0 !important; top: 0 !important;}").append(".grcrt_tacl { z-index:5000 !important;}").append(".grcrt_tacl>.js-dropdown-list>a.cancel { position: relative; float: right; margin-bottom: 11px;display:none; opacity: 0; visibility: hidden; transition: visibility 0s, opacity 0.5s linear;}").append(".grcrt_tacl>.js-dropdown-list:hover>a.cancel { display: block !important; visibility: visible; opacity: 0.5;}").append(".grcrt_tacl>.js-dropdown-list>a.cancel:hover { opacity: 1;}")));
    $.Observer(GameEvents.command.send_unit).subscribe("moverMarco_command_send", function () {
        f();
    });
    f();
}


function documentoCargado() {
    var intervalo = setInterval(function () {
        if (
            document.readyState === "complete" &&
            $(".tb_activities.toolbar_activities .middle")[0]
        ) {
            clearInterval(intervalo);
            crearBoton();
            var cambioEnJuego = new MutationObserver(function () {
            });
            cambioEnJuego.observe(document.getElementsByTagName("body")[0], {
                childList: true,
            });
            var observadorOrdenes = new MutationObserver(function () {
                cambioEnOrdenes();
            });
            observadorOrdenes.observe(
                document.getElementById("toolbar_activity_commands_list"),
                { attributes: true, subtree: true }
            );
        }
    }, 100);
}

function formatearFecha(timestamp) {
    // Crea un objeto Date con el timestamp (asegúrate de que el timestamp esté en milisegundos)
    var fecha = new Date(timestamp * 1000);

    // Configura las opciones para usar la zona horaria de Madrid
    var opciones = {
        timeZone: "Europe/Madrid",
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    // Convierte la fecha al formato local de Madrid
    var horaMadrid = fecha.toLocaleString('es-ES', opciones);

    return horaMadrid;
}

function stringToTimestamp(dateString) { // DateString format => "hh:mm:ss"
    const divisions = dateString.split(":");
    let hora = parseInt(divisions[0], 10);
    let min = parseInt(divisions[1], 10);
    let seg = parseInt(divisions[2],10);
    return hora*3600 + min*60 +seg // Paso la fecha a segundos
}

function loadCSS(){
    var css = document.createElement('style');
    var style='.sandy-box .item.command{   height: 54px !important;}.indicador {	color: rgba(0, 0, 0, 0.5) ;	font-size: 80% ;   position: relative;   display: flex;   line-height: 0px; margin-top: -2px}'
    css.appendChild(document.createTextNode(style));
    document.getElementsByTagName("head")[0].appendChild(css);
}


// Funciones encargadas de añadir y modificar elementos de la página.
////////////////////////////////////////////////////////////////////
function removeOrdersCheckbox() {
    const attackWindow = document.querySelector('.attack_support_window');
    if (attackWindow && !document.getElementById('checkbox_remove_orders')) {
        const checkboxOrdersHTML = `
            <div id="checkbox_remove_orders" class="checkbox_new green" style="margin-bottom: 10px;">
                <div class="cbx_icon"></div>
                <div class="cbx_caption">Filtrar ordenes</div>
            </div>`;
        attackWindow.insertAdjacentHTML('beforeend', checkboxOrdersHTML);
        initializeCheckboxState();
        document.getElementById('checkbox_remove_orders').addEventListener('click', removeOrdersChecker);
    }
}

function initializeCheckboxState() {
    const checkbox = document.getElementById('checkbox_remove_orders');
    if (checkbox) {
        const isChecked = document.getElementById('checkbox_remove_orders').classList.contains('checked')
        if (isChecked) {
            checkbox.classList.remove('checked');
        }
    }
}


function removeOrdersChecker(){
    const isChecked = document.getElementById('checkbox_remove_orders').classList.contains('checked');
    if (isChecked) {
        document.getElementById('checkbox_remove_orders').classList.remove('checked');
    } else {
        document.getElementById('checkbox_remove_orders').classList.add('checked');
    }
}

function crearVentanaSettings(){
    // Buscar todos los elementos que podrían contener el título
    var titulos = document.querySelectorAll('.ui-dialog-title');
    var existeVentana;
    if (!titulos){
        existeVentana = false;
    }
    for (var i = 0; i < titulos.length; i++) {
        if (titulos[i].textContent.trim() === "Ajustar Ataque") {
            existeVentana = true;
            break;
        }else{
            existeVentana = false;
        }
    }

    if(existeVentana != true){

        var ventana = Layout.wnd.Create(Layout.wnd.TYPE_DIALOG, "Ajustar Ataque", {width: 250, height: 125});
        titulos = document.querySelectorAll('.ui-dialog-title');
        for (i = 0; i < titulos.length; i++) {
            if (titulos[i].textContent.trim() === "Ajustar Ataque") {
                var contenedorDelTitulo = titulos[i].closest('.ui-dialog');
                break;
            }
        }

        var contenedor = contenedorDelTitulo.querySelector(".gpwindow_content")


        // HTML del formulario
        var formularioHTML = `
    <form id="formularioHora" autocomplete="off">
        <input type="text" id="campoHora" placeholder="HH:MM:SS" pattern="(?:[01]\\d|2[0123]):(?:[012345]\\d):(?:[012345]\\d)" required>
        <button type="submit" id="botonGuardar">Guardar</button>
    </form>
    <p id="mensajeError" style="color: red; display: none;">Formato incorrecto. Usa HH:MM:SS(horas:minutos:segundos)</p>
`;

        // Añadir el formulario a la ventana
        contenedor.innerHTML = formularioHTML;
        if(horaAjuste != 0){
            var divHoraActual = document.createElement('div');
            divHoraActual.innerHTML = `<p>Hora actual guardada:  ${horaAjuste}</p>`;
            contenedor.appendChild(divHoraActual);

        }

        // JavaScript para validar el formato y manejar el envío del formulario
        document.getElementById("formularioHora").onsubmit = function(event) {
            event.preventDefault(); // Prevenir el envío por defecto

            var campoHora = document.getElementById("campoHora");
            var mensajeError = document.getElementById("mensajeError");
            var regexHora = /^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/; // Expresión regular para HH:MM:SS

            if(regexHora.test(campoHora.value)) {
                mensajeError.style.display = "none";
                GM_setValue('horaAjuste', campoHora.value);
                window.location.reload();

            } else {
                mensajeError.style.display = "block";
            }
        };
    }
}


function crearBoton(){
    // Crear un nuevo elemento de botón
    var boton = document.createElement("button");

    // Crear un elemento de imagen y establecer la fuente de la imagen
    var img = document.createElement("img");
    img.src = "https://i.imgur.com/XH2WAY4.png";
    img.alt = "Icono"; // Texto alternativo para accesibilidad
    img.style.width = "120%";
    img.style.height = "auto";

    // Ajustar el estilo del botón para que solo muestre la imagen
    boton.style.width = "50px";
    boton.style.height = "50px";
    boton.style.padding = "0";
    boton.style.border = "none";
    boton.style.position = "relative"; // Cambia la posición del botón a relativa
    boton.style.left = "-50px";
    boton.style.background = "none";
    boton.style.cursor = "pointer"; // Cambia el cursor a una mano para indicar interactividad
    boton.style.marginTop = "-5px"; // Ajusta este valor según necesites


    // Añadir la imagen al botón
    boton.appendChild(img);

    // Añadir efectos visuales para el estado hover
    boton.onmouseover = function() {
        this.style.opacity = "0.8"; // Hace el botón ligeramente transparente
    };
    boton.onmouseout = function() {
        this.style.opacity = "1"; // Restaura la opacidad del botón
    };

    // Buscar el contenedor específico donde se añadirá el botón
    var contenedor = document.querySelector(".nui_toolbar .middle");

    // Aplicar Flexbox al contenedor para alinear elementos verticalmente y a la derecha
    contenedor.style.display = "flex";
    contenedor.style.flexDirection = "column";
    contenedor.style.alignItems = "flex-end"; // Alinea elementos a la derecha
    contenedor.style.height = "100%"; // Asegúrate de que el contenedor tenga una altura definida


    // Añadir el botón al contenedor
    if (contenedor) {
        contenedor.appendChild(boton);
    } else {
        console.log("El contenedor no fue encontrado");
    }
    boton.addEventListener("click", function(event) {
        crearVentanaSettings();
    });
}


function cambioEnOrdenes() {
    var commandList = document.querySelector("#toolbar_activity_commands_list");
    var movimientos = commandList.querySelector(".js-dropdown-item-list");
    var botonReforzar = false;
    try{
        var botonCerrar = commandList.querySelector('.cancel');
        botonCerrar.style.display = 'block';
    }catch{};

    var botones = document.querySelectorAll('a.button');
    var botonAtacar = document.querySelector("#btn_attack_town");
    botones.forEach(function(boton) {
        if (boton.textContent.trim() === "Reforzar") {
            botonReforzar = true;
        }
    });
    for (var i = 0; i < movimientos.children.length; i++) {

        var movimiento = movimientos.children[i]
        var tiempoInfo = formatearFecha(movimiento.dataset.timestamp)

        if ((botonReforzar || botonAtacar) && document.getElementById('checkbox_remove_orders').classList.contains('checked')){
            if (movimiento.getAttribute('data-commandtype') === 'revolts'){
                movimiento.style.display = 'none';
            }else if (botonReforzar && (movimiento.children[0].children[0].classList.contains("attack"))){
                movimiento.style.display = 'none';
            }else if (botonAtacar && (movimiento.children[0].children[0].classList.contains("support"))){
                movimiento.style.display = 'none';
            }else if (movimiento.children[0].children[0].classList.contains("returning")){
                movimiento.style.display = 'none';
            }
        }else if ((botonReforzar || botonAtacar) && !document.getElementById('checkbox_remove_orders').classList.contains('checked')){
            movimiento.style.display = '';
        }

        if (movimiento.children[0].children[1].children[2] == null || !movimiento.children[0].children[1].children[2].classList.contains("indicador")){

            if (!indicador || indicador.length < movimientos.children.length){
                var indicador = document.createElement("div");
                indicador.className = "indicador";
                var indicadorTexto = document.createElement("p");
                indicadorTexto.innerHTML = tiempoInfo;
                indicador.appendChild(indicadorTexto);
                indicadorTexto.style.fontSize = "1.2em";
                indicadorTexto.style.fontWeight = "bold";
                var textoElemento = document.createElement("div");
                indicador.appendChild(textoElemento);
                var indicatorAjuste = document.createElement("div");
                indicatorAjuste.setAttribute("style", "width:1em;background:red;margin-left: 0.3em;");
                loadCSS();
                if (movimiento.children[0].children[1].children[2] == null){
                    movimiento.children[0].children[1].appendChild(indicador)
                }else{
                    var oldIndicator = movimiento.children[0].children[1].children[2];
                    oldIndicator.style.display = "none";
                    movimiento.children[0].children[1].replaceChild(indicador, movimiento.children[0].children[1].children[2]);
                    movimiento.children[0].children[1].appendChild(oldIndicator)
                }
                if (tiempoInfo == horaAjuste){
                    // Te la juegas un poco xd
                    ////////////////////////////////////
                    var dio = document.querySelector('#dio_plusmenuCommands');
                    if(dio){
                        var botonX = dio.querySelector(".dio_plusback");
                        botonX.style.display = 'block';
                        botonX.click();
                    }else{$('#toolbar_activity_commands_list .cancel').click()}
                    ////////////////////////////////////

                    indicadorTexto.style.color = "green";
                    indicatorAjuste.setAttribute("style", "width:1em;background:green;margin-left: 0.3em;");
                    textoElemento.innerText = "\u2713";
                    textoElemento.style.fontWeight = "bold";
                    textoElemento.style.cssText = "margin-left: 0.3em; font-size: 1.3em; color: white; background-color: green; padding: 5px; text-align: center; margin-bottom: 5px; display: flex; align-items: center;";
                }else{
                    indicadorTexto.style.color = "red";
                    indicatorAjuste.setAttribute("style", "width:1em;background:green;margin-left: 0.3em;");
                    textoElemento.innerText = "\xAA";
                    textoElemento.style.fontWeight = "bold";
                    textoElemento.style.cssText = "margin-left: 0.3em; font-size: 1.3em; color: black; background-color: red; padding: 5px; text-align: center; margin-bottom: 5px; display: flex; align-items: center;";

                }
            }

        }

    }
}



function moveFrame() {
    function f() {
        if (0 == $("#toolbar_activity_commands_list").length) {
            setTimeout(function () {
                f();
            }, 500);
        } else {
            var A = document.querySelector("#toolbar_activity_commands_list");
            if (0 == $("#grcrt_taclWrap").length) {
                if ($("#toolbar_activity_commands_list").wrap($("<div/>", { "class": "grcrt_taclWrap", id: "grcrt_taclWrap" })), true) {
                    $("#toolbar_activity_commands_list").addClass("grcrt_tacl");
                    $("#grcrt_taclWrap").draggable().draggable("enable");
                    var c = new MutationObserver(function (h) {
                        h.forEach(function (k) {
                            $(A).hasClass("grcrt_tacl") && $("#grcrt_taclWrap").attr("style") && "none" == $(A).css("display") && $(".activity.commands").trigger("mouseenter");
                        });
                    });
                    0 == $("#toolbar_activity_commands_list>.js-dropdown-list>a.cancel").length && $("#toolbar_activity_commands_list>.js-dropdown-list").append($("<a/>", { href: "#n", "class": "cancel", style: "display:none;" }).click(function () {
                        $("#grcrt_taclWrap").removeAttr("style");
                    }));
                    c.observe(A, { attributes: !0, childList: !1, characterData: !1 });
                } else {
                    $("#toolbar_activity_commands_list").removeClass("grcrt_tacl"), $("#grcrt_taclWrap").draggable().draggable("disable").removeAttr("style");
                }
            }
            $(A).hasClass("grcrt_tacl") && $("#grcrt_taclWrap").attr("style") && $(".activity.commands").trigger("mouseenter");
        }
    }
    $("head").append($("<style/>").append($("<style/>").append(".showImportant { bisplay: block !important}").append("#grcrt_taclWrap { left:312px; position: absolute; top: 29px;}").append("#grcrt_taclWrap>#toolbar_activity_commands_list { left: 0 !important; top: 0 !important;}").append(".grcrt_tacl { z-index:5000 !important;}").append(".grcrt_tacl>.js-dropdown-list>a.cancel { position: relative; float: right; margin-bottom: 11px;display:none; opacity: 0; visibility: hidden; transition: visibility 0s, opacity 0.5s linear;}").append(".grcrt_tacl>.js-dropdown-list:hover>a.cancel { display: block !important; visibility: visible; opacity: 0.5;}").append(".grcrt_tacl>.js-dropdown-list>a.cancel:hover { opacity: 1;}")));
    $.Observer(GameEvents.command.send_unit).subscribe("moverMarco_command_send", function () {
        f();
    });
    f();
}

// Esto no se que hace pero ahi lo dejo xd
//////////////////////////////////////////
function unidadMandada() {
    $('<style>' +
      '.attack_support_window .send_units_form .button_wrapper { text-align:left; padding-left:1px; }' +
      '#gt_delete { display: none; }' +
      '.attack_support_window .additional_info_wrapper .town_info_duration_pos_alt { min-height: 50px; } ' +
      '.attack_support_window .additional_info_wrapper .town_info_duration_pos { min-height: 62px!important; } ' +
      '</style>').appendTo($('.attack_support_window').parent());
    $('.breaker').remove()
}


// Función encargada de interceptar los cambios en la página.
/////////////////////////////////////////////////////////////
function observerAjax() {
    $(document).ajaxComplete(function (e, xhr, opt) {
        var url = opt.url.split("?"), action = "";
        if (typeof (url[1]) !== "undefined" && typeof (url[1].split(/&/)[1]) !== "undefined") {
            action = url[0].substr(5) + "/" + url[1].split(/&/)[1].substr(7);
        }
        switch (action) {
            case "/town_info/attack":
                attachListeners();
                unidadMandada();
                insertCheckboxForUnitSaving();
                removeOrdersCheckbox()

                break;
            case "/town_info/support":
                attachListeners();
                unidadMandada();
                insertCheckboxForUnitSaving();
                removeOrdersCheckbox()

                break;
        }
    });
}
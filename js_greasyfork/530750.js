// ==UserScript==
// @name         Optimus Prime
// @namespace    Optimus Prime
// @version      0.1.4
// @description  Agrega funcionalidades a grepolis
// @author       Youbu
// @match        https://*.grepolis.com/game/*
// @match        http://*.grepolis.com/game/*
// @exclude      view-source://*
// @exclude      https://classic.grepolis.com/game/*
// @exclude      http://classic.grepolis.com/game/*
// @icon         https://i.imgur.com/OLLtZNJ.png
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/plotly.js/1.33.1/plotly.min.js
// @downloadURL https://update.greasyfork.org/scripts/530750/Optimus%20Prime.user.js
// @updateURL https://update.greasyfork.org/scripts/530750/Optimus%20Prime.meta.js
// ==/UserScript==
 
 
 
 
// Extraccion de datos del servidor
const serverId = Game.world_id
const playerId = Game.player_id
const mundoAsedio = Game.features.command_version == "old";
const mundoRevuelta = Game.features.command_version == "new";
const finalOlimpo = Game.features.end_game_type == "end_game_type_olympus"
const finalMaras = Game.features.end_game_type == "end_game_type_world_wonder"
 
 
// Checkboxes
 
let ajustarMarcado = GM_getValue('ajustarMarcado_' + serverId, 'true');
let autoCancelarMarcado = GM_getValue('autoCancelarMarcado_' + serverId, 'false');
let autoIndexarMarcado = GM_getValue('autoIndexarMarcado_' + serverId, 'true');
let botonAldeasMarcado = GM_getValue('botonAldeasMarcado_' + serverId, 'true');
let unidadesColaMarcado = GM_getValue('unidadesColaMarcado_' + serverId, 'true');
let filtroPulpoMarcado = GM_getValue('filtroPulpoMarcado_' + serverId, 'true');
let generarListasMarcado = GM_getValue('generarListasMarcado_' + serverId, 'true');
let generarPlantillasMarcado = GM_getValue('generarPlantillasMarcado_' + serverId, 'true');
let generarTemplosMarcado = GM_getValue('generarTemplosMarcado_' + serverId, 'true');
let subirAldeasMarcado = GM_getValue('subirAldeasMarcado_' + serverId, 'true');
let porcentajeTropasMarcado = GM_getValue('porcentajeTropasMarcado_' + serverId, 'true');
 
 
 
 
 
// Desplegables
let opcionReentrada = GM_getValue('opcionReentrada_' + serverId, 'default');
 
// Inputs
let miembrosListaInput = GM_getValue('miembrosListaInput_' + serverId, '30');
 
 
 
// FUNCIONES DEDICADAS A LA CREACIÓN DE MENÚS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CREAR EL BOTÓN DEL MENÚ OPTIMUS
function crearBotonMenu(){
    var menuContainer = document.querySelector('.nui_main_menu .content > ul');
    if(menuContainer) {
        var lastElement = menuContainer.querySelector('.last');
 
        if (lastElement && lastElement.classList.contains('optimus_menu')){
        }else{
            setTimeout(crearBotonMenu, 1000)
        }
    }else{
        setTimeout(crearBotonMenu, 1000)
    }
    // Verifica si el contenedor existe
    if (menuContainer && (lastElement.classList.contains('forum') || lastElement.classList.contains('gd-team-ops-cp'))) {
        // Define el HTML para la nueva entrada de menú
        var nuevaEntradaHTML = `
                <li class="optimus_menu main_menu_item last">
                    <span class="content_wrapper">
                        <span class="button_wrapper">
                            <span class="button">
                                <span class="icon" style="margin-left: -2px;">
                                <img src="https://i.imgur.com/OLLtZNJ.png" alt="Icono" id="optimus_icon">
                                </span>
                            </span>
                        </span>
                        <span class="name_wrapper">
                            <span class="name">Optimus</span>
                        </span>
                    </span>
                </li>
            `;
 
        // Inserta la nueva entrada de menú en el contenedor
        for (let i = 0; i < menuContainer.children.length; i++) {
            let child = menuContainer.children[i];
            if (child.classList.contains("last")) {
                child.classList.remove("last");
            }
            if (child.classList.contains("gd-team-ops-cp")){
                var wrapper = child.children[0].children[0].children[0];
                wrapper.style ="right: -12px; top: 0 !important;"
 
            }
 
        }
        menuContainer.insertAdjacentHTML('beforeend', nuevaEntradaHTML);
        var botonOptimus = menuContainer.querySelector('.optimus_menu');
        botonOptimus.addEventListener('click', function() {
            crearVentanaMenu();
        });
    }
    botonOptimus.onmouseover = function() {
        // this.style.opacity = "0.8"; // Hace el botón ligeramente transparente
        botonOptimus.children[0].children[0].children[0].children[0].children[0].src = 'https://i.imgur.com/xnF4Wfb.png'
    };
    botonOptimus.onmouseout = function() {
        // this.style.opacity = "1"; // Restaura la opacidad del botón
        botonOptimus.children[0].children[0].children[0].children[0].children[0].src = "https://i.imgur.com/OLLtZNJ.png";
 
    };
 
}
 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CREAR LA VENTANA DEL MENÚ DE SETTINGS
 
function crearVentanaMenu() {
    // Buscar todos los elementos que podrían contener el título
    var titulos = document.querySelectorAll('.ui-dialog-title');
    var existeVentana = false;
 
    if (!titulos) {
        existeVentana = false;
    } else {
        for (var i = 0; i < titulos.length; i++) {
            if (titulos[i].textContent.trim() === "Menu Optimus") {
                existeVentana = true;
                break;
            }
        }
    }
 
    if (!existeVentana) {
        var ventana = Layout.wnd.Create(Layout.wnd.TYPE_DIALOG, "Menu Optimus", { width: "500", height: "400" });
 
        titulos = document.querySelectorAll('.ui-dialog-title');
        var contenedorDelTituloMenu;
 
        for (i = 0; i < titulos.length; i++) {
            if (titulos[i].textContent.trim() === "Menu Optimus") {
                contenedorDelTituloMenu = titulos[i].closest('.ui-dialog');
                break;
            }
        }
 
        var contenedorMenu = contenedorDelTituloMenu.querySelector(".gpwindow_content");
 
        if (contenedorMenu) {
            // Crea el contenido de las páginas
            var paginaIntegraciones = crearIntegraciones(contenedorMenu);
            // var paginaBuscaOro = crearBuscaOro(contenedorMenu);
            var paginaMiscelanea = crearMiscelanea(contenedorMenu)
            crearPestañas(contenedorMenu, paginaIntegraciones, paginaMiscelanea);
        } else {
            console.error('No se encontró el contenedor contenedorMenu.');
        }
 
    }
}
 
 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CREAR EL MENÚ DE SETTINGS DE MISCELANEA
 
function crearMiscelanea(contenedorMenu){
    var MiscelaneaSection = crearSeccion('MiscelaneaSection', '', 'section');
    contenedorMenu.appendChild(MiscelaneaSection);
    ///////////////////////////////////////////////
    // Sección autoentrar
    ///////////////////////////////////////////////
    var miscelanea = crearSeccion('QOL', '', 'section');
 
    crearCheckbox('setting_Misc_ajustar', 'Ajustar ataques ', miscelanea, 'ajustarMarcado_' + serverId, ajustarMarcado, 'Crea botón arriba a la derecha');
    // crearCheckbox('setting_Misc_cancelar', 'Cancelar automáticamente al fallar el ajuste', miscelanea, 'autoCancelarMarcado_' + serverId, autoCancelarMarcado);
 
    crearHr(miscelanea);
 
    crearCheckbox('setting_Misc_aldeas', 'Aviso cuando las aldeas estén disponibles ', miscelanea, 'botonAldeasMarcado_' + serverId, botonAldeasMarcado, 'Crea botón arriba a la izquierda');
    crearCheckbox('setting_Misc_subir_aldeas', 'Agrega un botón para subir las aldeas de la isla ', miscelanea, 'subirAldeasMarcado_' + serverId, subirAldeasMarcado);
 
    crearHr(miscelanea);
 
    crearCheckbox('setting_Misc_listas', 'Añade alianzas para generar una lista con el top de la coalicion ', miscelanea, 'generarListasMarcado_' + serverId, generarListasMarcado, 'Ordena los primeros ' + miembrosListaInput + ' miembros por cantidad de puntos y cantidad de ciudades');
    var inputMiembrosLista = crearInputTexto('miembrosListaInput_' + serverId, miembrosListaInput, 'miembros_lista_input', 'Cantidad de miembros a ordenar', '10%', false);
    miscelanea.appendChild(inputMiembrosLista);
 
    if (mundoRevuelta){
        crearHr(miscelanea);
 
        crearCheckbox('setting_Misc_plantillas', 'Generar plantillas ', miscelanea, 'generarPlantillasMarcado_' + serverId, generarPlantillasMarcado, 'Plantilla de ataque en ventana de info ciudad enemiga \nPlantilla deff al compartir informe');
    }else if (mundoAsedio){
 
    }
    if(finalOlimpo){
        crearHr(miscelanea);
 
        crearCheckbox('setting_Misc_templos', 'Generar mapa de templos ', miscelanea, 'generarTemplosMarcado_' + serverId, generarTemplosMarcado, 'También copia una lista con los templos ordenados por ataque, defensa, reponer, portales y hechizos');
 
    }else if(finalMaras){
 
    }
 
    crearHr(miscelanea);
 
    crearCheckbox('setting_Misc_porcentaje', 'Mostrar porcentaje de tropas ', miscelanea, 'porcentajeTropasMarcado_' + serverId, porcentajeTropasMarcado, 'Muestra el porcentaje de tropas off y deff de todas las tropas disponibles en todas las ciudades');
 
    ///////////////////////////////////////////////
    // Ajustes generales seccion misc
    ///////////////////////////////////////////////
    MiscelaneaSection.appendChild(miscelanea);
    var botonGuardar = crearBoton("Guardar Opciones", function(){ location.reload(); }, "", "");
    MiscelaneaSection.appendChild(botonGuardar)
    MiscelaneaSection.style.position = "relative";
    MiscelaneaSection.style.height = "95%";
    botonGuardar.style.position = "absolute";
    botonGuardar.style.bottom = "0";
 
    return MiscelaneaSection
}
 
function crearIntegraciones(contenedorMenu){
    var IntegracionesSection = crearSeccion('IntegracionesSection', '', 'section');
    contenedorMenu.appendChild(IntegracionesSection);
    ///////////////////////////////////////////////
    // Sección dio-tools
    ///////////////////////////////////////////////
    var dioTools = crearSeccion('dio', 'DIO-TOOLS', 'section', true);
    crearCheckbox('setting_Misc_reclutamiento', 'Muestra las unidades en cola ', dioTools, 'unidadesColaMarcado_' + serverId, unidadesColaMarcado, 'Muestra de la unidad seleccionada en la información general de unidades. \nREQUIERE DIO TOOLS');
    IntegracionesSection.appendChild(dioTools);
 
    ///////////////////////////////////////////////
    // Sección dio-tools
    ///////////////////////////////////////////////
    var pulpo = crearSeccion('pulpo', 'GRCRT', 'section', true);
    crearCheckbox('setting_Misc_filtro', 'Agrega un filtro al radar del pulpo ', pulpo, 'filtroPulpoMarcado_' + serverId, filtroPulpoMarcado, 'REQUIERE GRCRT (PULPO)');
    IntegracionesSection.appendChild(pulpo);
 
    ///////////////////////////////////////////////
    // Sección dio-tools
    ///////////////////////////////////////////////
    var index = crearSeccion('index', 'GrepoData', 'section', true);
    crearCheckbox('setting_Misc_indexar', 'Auto indexar los informes ', index, 'autoIndexarMarcado_' + serverId, autoIndexarMarcado, 'REQUIERE GREPODATA CITY INDEXER');
    IntegracionesSection.appendChild(index);
 
    var botonGuardar = crearBoton("Guardar Opciones", function(){ location.reload(); }, "", "");
    IntegracionesSection.appendChild(botonGuardar)
    IntegracionesSection.style.position = "relative";
    IntegracionesSection.style.height = "95%";
    botonGuardar.style.position = "absolute";
    botonGuardar.style.bottom = "0";
 
    return IntegracionesSection
}
 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CREAR SECCIÓN PARA ORGANIZACIÓN DE HTML Y REPRESENTACIÓN DE H2
 
function crearSeccion(id, h4, clase, crearTitulo){
    var section = document.createElement('div');
    section.id = id; // Asignar un ID
    section.classList.add(clase); // Agregar la clase CSS
 
    section.innerHTML = '<h4>' + h4 + '</h4>';
    if (crearTitulo){
        crearHr(section);
    }
    return section
 
}
 
// FUNCIONES DEDICADAS A LA CREACIÓN DE LOS ELEMENTOS VISUALES DE LOS MENÚS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CREAR BARRA DELIMITADORA
 
function crearHr(contenedor){
    var hr = document.createElement('hr');
    contenedor.appendChild(hr);
 
}
 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CREAR BARRA DE PESTAÑAS
 
function crearPestañas(contenedorMenu, paginaIntegraciones, paginaMiscelanea){
    // Crear el elemento div
    var menuWrapper = document.createElement('div');
 
    // Agregar las clases necesarias
    menuWrapper.classList.add('menu_wrapper', 'minimize', 'closable', 'optimus_tab_menu');
    var ul = document.createElement('ul');
    ul.classList.add('menu_inner');
    var listaElementos = [paginaIntegraciones, paginaMiscelanea]
 
    // Crear las pestañas
    var pestañaMiscelanea = crearUnaPestaña(ul, 'miscelanea_tab', 'Miscelanea', 'Misc/QOL', listaElementos, contenedorMenu.parentElement.parentElement.children[0], paginaMiscelanea);
    var pestañaIntegraciones = crearUnaPestaña(ul, 'integraciones_tab', 'Integraciones', 'Integraciones', listaElementos, contenedorMenu.parentElement.parentElement.children[0], paginaIntegraciones);
 
    menuWrapper.appendChild(ul);
    contenedorMenu.parentElement.parentElement.children[0].appendChild(menuWrapper);
    pestañaIntegraciones.classList.add('active');
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CREAR UNA PESTAÑA
function crearUnaPestaña(ul, id, menuName, texto, listaElementos, contenedorMenu, elementoAfectado) {
    // Crear el elemento ul con la clase "menu_inner"
 
 
    // Crear el elemento li
    var li = document.createElement('li');
 
    // Crear el elemento <a> con sus atributos y clases
    var a = document.createElement('a');
    a.id = id;
    a.classList.add('submenu_link');
    a.setAttribute('data-menu_name', menuName);
    a.href = '#';
 
    // Crear la estructura de span dentro del enlace
    var spanLeft = document.createElement('span');
    spanLeft.classList.add('left');
    var spanRight = document.createElement('span');
    spanRight.classList.add('right');
    var spanMiddle = document.createElement('span');
    spanMiddle.classList.add('middle');
    spanMiddle.textContent = texto;
    spanRight.appendChild(spanMiddle);
    spanLeft.appendChild(spanRight);
    a.appendChild(spanLeft);
 
    // Agregar el elemento <a> dentro del elemento <li>
    li.appendChild(a);
 
    // Agregar el elemento <li> dentro del elemento <ul>
    ul.appendChild(li);
 
    // Agregar el event listener al elemento <a>
    a.addEventListener('click', function() {
        for (var elemento of listaElementos){
            elemento.style.display = 'none';
 
        }
        for (var tab of contenedorMenu.querySelectorAll('.submenu_link')){
            if(tab.classList.contains('active')){
                tab.classList.remove('active');
            }
        }
        // Cambiar el estilo del elemento afectado
        if (elementoAfectado.style.display === 'none') {
            elementoAfectado.style.display = 'block';
            a.classList.add('active');
        }
    });
    return a
}
 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CREAR ELEMENTO DESPLEGABLE
function crearDesplegable(texto, id, opciones, opcionSeleccionada, clave, gmoption) {
    var selectDesplegable = document.createElement('select');
    selectDesplegable.id = id;
    selectDesplegable.style.display = 'none'; // Ocultar el <select>
 
    var gmoptionEncontrada = false;
 
    // Itera sobre las opciones y preselecciona la que coincida con gmoption, si existe
    opciones.forEach(opcion => {
        var option = document.createElement('option');
        option.value = opcion.value;
        option.textContent = opcion.text;
 
        // Verifica si la opción actual coincide con gmoption
        if (opcion.value == gmoption) {
            option.selected = true; // Establecer esta opción como seleccionada
            gmoptionEncontrada = true;
        }
 
        selectDesplegable.appendChild(option);
    });
 
    // Si no se encontró una opción que coincida con gmoption o si gmoption es nulo, establece el valor predeterminado
    if (!gmoptionEncontrada && gmoption !== null) {
        selectDesplegable.selectedIndex = opcionSeleccionada - 1; // Establecer la opción predeterminada
        console.log("Opción predeterminada establecida:", opcionSeleccionada);
    }
 
    var divDesplegable = document.createElement('div');
    divDesplegable.id = 'dd_' + id;
    divDesplegable.className = 'dropdown default ' + id;
    divDesplegable.style.width = '200px';
    divDesplegable.style.marginTop = '5px';
 
    var borderLeft = document.createElement('div');
    borderLeft.className = 'border-left';
    var borderRight = document.createElement('div');
    borderRight.className = 'border-right';
    var caption = document.createElement('div');
    caption.className = 'caption';
    caption.textContent = texto;
 
    var initialMessageBox = document.createElement('div');
    initialMessageBox.className = 'initial-message-box js-empty';
    initialMessageBox.style.display = 'none';
    var arrow = document.createElement('div');
    arrow.className = 'arrow';
 
    divDesplegable.appendChild(borderLeft);
    divDesplegable.appendChild(borderRight);
    divDesplegable.appendChild(caption);
    divDesplegable.appendChild(initialMessageBox);
    divDesplegable.appendChild(arrow);
 
    // Contenedor para las opciones
    var optionListContainer = document.createElement('div');
    optionListContainer.className = 'dropdown-list default';
    optionListContainer.id = 'dd_' + id + '_list';
    optionListContainer.style.display = 'none';
    optionListContainer.style.position = 'absolute';
    optionListContainer.style.zIndex = '2001';
 
    var itemList = document.createElement('div');
    itemList.className = 'item-list';
 
    opciones.forEach(opcion => {
        var optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.setAttribute('name', opcion.value);
        optionDiv.textContent = opcion.text;
 
        if (opcion.value == gmoption) {
            optionDiv.classList.add('selected');
        }
 
        optionDiv.addEventListener('click', function() {
            caption.textContent = opcion.text;
            selectDesplegable.value = opcion.value;
            optionListContainer.style.display = 'none';
 
            // Guardar el valor seleccionado usando GM.setValue()
            GM.setValue(clave, opcion.value).then(function() {
                console.log('Opción seleccionada guardada:', opcion.value);
            }).catch(function(error) {
                console.error('Error al guardar el valor:', error);
            });
        });
 
        itemList.appendChild(optionDiv);
    });
 
    optionListContainer.appendChild(itemList);
    document.body.appendChild(optionListContainer);
 
    // Agregar el <select> al div contenedor
    divDesplegable.appendChild(selectDesplegable);
 
    divDesplegable.style.position = 'relative';
 
    // Agregar un event listener para mostrar el dropdown cuando se hace clic en el div contenedor
    divDesplegable.addEventListener('click', function() {
        var rect = divDesplegable.getBoundingClientRect();
        optionListContainer.style.left = rect.left + 'px';
        optionListContainer.style.top = rect.bottom + 'px';
        optionListContainer.style.display = 'block';
    });
 
    // Ocultar el dropdown cuando se hace clic fuera
    document.addEventListener('click', function(event) {
        if (!divDesplegable.contains(event.target) && !optionListContainer.contains(event.target)) {
            optionListContainer.style.display = 'none';
        }
    });
 
    return divDesplegable;
}
 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CREAR BOTÓN
 
function crearBoton(texto, funcionClick, frase, defaultText) {
    var boton = document.createElement('a');
    boton.href = '#';
    boton.className = 'button';
 
    // Crear los spans anidados para replicar la estructura del enlace
    var spanLeft = document.createElement('span');
    spanLeft.className = 'left';
 
    var spanRight = document.createElement('span');
    spanRight.className = 'right';
 
    var spanMiddle = document.createElement('span');
    spanMiddle.className = 'middle';
    spanMiddle.textContent = texto;
 
    // Anidar los spans correctamente
    spanRight.appendChild(spanMiddle);
    spanLeft.appendChild(spanRight);
    boton.appendChild(spanLeft);
 
    // Crear un div para contener tanto el botón como el texto
    var divContenedor = document.createElement('div');
 
    // Agregar un espacio en blanco entre el botón y el texto
    divContenedor.appendChild(document.createTextNode(' '));
    if (!frase) {
        frase = defaultText;
    }
 
    // Crear un elemento de texto para mostrar la hora de próximo farmeo
    var textoHoraProximoFarmeo = document.createElement('span');
    textoHoraProximoFarmeo.textContent = frase;
 
    // Agregar los elementos al div contenedor
    divContenedor.appendChild(textoHoraProximoFarmeo);
    divContenedor.appendChild(boton);
 
    // Agregar el event listener al botón
    boton.addEventListener('click', function(event) {
        event.preventDefault(); // Para prevenir el comportamiento por defecto del enlace
        funcionClick();
    });
 
    divContenedor.style.display = 'flex';
    divContenedor.style.justifyContent = 'space-between';
    return divContenedor;
}
 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CREAR CAMPO DE ENTRADA DE TEXTO
function crearInputTexto(clave, variable, id, placeholder, width, placeholderDentro) {
    // Crear el elemento de input para el webhook
    var input = document.createElement('input');
    input.type = 'text';
    input.style.width = '100%'; // Ocupa todo el ancho disponible dentro de divMiddle
    input.id = id || 'generic_input_id'; // Asignar el id si se proporciona
 
 
    // Añadir la clase optimus_input_text
    input.classList.add('optimus_input_text');
 
    // Verificar si el placeholder debe estar dentro de la caja de texto
    if (placeholderDentro) {
        input.placeholder = placeholder || 'Introduce el texto';
    }
 
    // Crear la estructura similar al elemento proporcionado
    var divContenedor = document.createElement('div');
    divContenedor.classList.add('webnotification_communication_alliance_message_arrived_duration', 'textbox');
    divContenedor.style.display = 'flex';
    divContenedor.style.alignItems = 'center';
    divContenedor.style.flexWrap = 'nowrap'; // Evita que los elementos se envuelvan
    divContenedor.style.marginTop = '5px';
 
 
    var divLeft = document.createElement('div');
    divLeft.classList.add('left');
    divLeft.style.flex = '0 0 auto'; // Evita que divLeft se expanda
 
    var divMiddle = document.createElement('div');
    divMiddle.classList.add('middle');
    divMiddle.style.width = width; // Establecer el ancho según el parámetro proporcionado
    divMiddle.style.flex = '0 0 auto'; // Evita que divMiddle se expanda
    divMiddle.style.display = 'flex';
    divMiddle.style.alignItems = 'center';
    divMiddle.style.position = 'relative'; // Para permitir posicionamiento absoluto de hijos
 
    var divInitialMessageBox = document.createElement('div');
    divInitialMessageBox.classList.add('initial-message-box', 'js-empty');
    divInitialMessageBox.style.display = 'none';
 
    var divClearButton = document.createElement('div');
    divClearButton.classList.add('clear-button', 'js-clear');
 
    var divRight = document.createElement('div');
    divRight.classList.add('right');
    divRight.style.flex = '0 0 auto'; // Evita que divRight se expanda
    divRight.style.position = 'absolute'; // Posiciona divRight al final de divMiddle
    divRight.style.right = '0'; // Asegura que divRight esté a la derecha de divMiddle
 
    var divErrorMsg = document.createElement('div');
    divErrorMsg.classList.add('error-msg', 'js-txt-error-msg');
 
    // Agregar los elementos a divMiddle
    divMiddle.appendChild(divInitialMessageBox);
    divMiddle.appendChild(input);
    divMiddle.appendChild(divClearButton);
    divMiddle.appendChild(divRight); // Mover divRight dentro de divMiddle
 
    // Agregar los elementos a divContenedor
    divContenedor.appendChild(divLeft);
    divContenedor.appendChild(divMiddle);
    divContenedor.appendChild(divErrorMsg);
 
    // Obtener el valor guardado usando GM.getValue
    if (variable != null) {
        input.value = variable;
    }
 
    // Agregar un event listener para guardar el valor al cambiar
    input.addEventListener('change', function() {
        var valor = input.value;
        // Guardar el valor usando GM.setValue
        GM.setValue(clave, valor).then(function() {
            console.log('Texto guardado para el elemento con ID', input.id, ':', valor);
        }).catch(function(error) {
            console.error('Error al guardar el texto para el elemento con ID', input.id, ':', error);
        });
    });
 
    // Retornar el div contenedor
    return divContenedor;
}
 
 
 
 
 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CREAR CHECKBOX
 
function crearCheckbox(id, texto, contenedor, clave, bool, tooltip) {
    // Crear el li del checkbox
    var checkboxLi = document.createElement('li');
    checkboxLi.id = id + "_li"; // Agregamos "_li" al final del ID para diferenciarlo del ID del checkbox
 
    // Crear el div del checkbox
    var checkboxDiv = document.createElement('div');
    checkboxDiv.id = id;
    if (bool) {
        checkboxDiv.classList.add('optimussettings', 'checkbox_new', 'green', 'checked');
    } else {
        checkboxDiv.classList.add('optimussettings', 'checkbox_new', 'green', 'unchecked');
    }
    checkboxDiv.style = "padding-top:2px";
 
    // Crear el icono del checkbox
    var cbxIcon = document.createElement('div');
    cbxIcon.classList.add('cbx_icon');
    checkboxDiv.appendChild(cbxIcon);
 
    // Crear la etiqueta del checkbox
    var cbxCaption = document.createElement('div');
    cbxCaption.classList.add('cbx_caption');
    cbxCaption.textContent = texto;
 
    // Crear el icono de tooltip
    if(tooltip){
        var tooltipIcon = document.createElement('img');
        tooltipIcon.src = 'https://gpes.innogamescdn.com/images/game/support/menu_icon.png';
        tooltipIcon.id = 'tooltip_icon';
        tooltipIcon.style.cursor = 'pointer';
        tooltipIcon.style.width = '12px'; // Ajusta el tamaño de la imagen según sea necesario
        tooltipIcon.style.height = '12px'; // Ajusta el tamaño de la imagen según sea necesario
        tooltipIcon.title = tooltip; // Esto crea el tooltip nativo del navegador
 
 
        cbxCaption.appendChild(tooltipIcon);
 
    }
    checkboxDiv.appendChild(cbxCaption);
    // Añadir el checkbox al li
    checkboxLi.appendChild(checkboxDiv);
 
    // Añadir el li al contenedor
    contenedor.appendChild(checkboxLi);
 
    // Añadir event listener para cambiar la clase y guardar el valor al hacer clic
    checkboxDiv.addEventListener('click', function() {
        // Cambiar el valor de bool
        bool = !bool;
 
        // Actualizar la clase del checkbox según el valor de bool
        if (bool) {
            checkboxDiv.classList.remove('unchecked');
            checkboxDiv.classList.add('checked');
        } else {
            checkboxDiv.classList.remove('checked');
            checkboxDiv.classList.add('unchecked');
        }
 
        // Guardar el nuevo valor de bool usando GM.setValue()
        GM.setValue(clave, bool).then(function() {
            console.log('Valor de', clave, 'actualizado a:', bool);
        }).catch(function(error) {
            console.error('Error al guardar el valor de', clave, ':', error);
        });
    });
}
 
 
 
// FUNCIONES DEDICADAS A LA INTERACCIÓN CON EL JUEGO
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
// TRADUCTOR
 
function traducir(selectedUnit){
    var translatedUnit
    switch (selectedUnit) {
        case 'sword':
            translatedUnit = 'infantes';
            break;
        case 'archer':
            translatedUnit = 'arqueros';
            break;
        case 'hoplite':
            translatedUnit = 'hoplitas';
            break;
        case 'slinger':
            translatedUnit = 'honderos';
            break;
        case 'rider':
            translatedUnit = 'caballeros';
            break;
        case 'chariot':
            translatedUnit = 'carros';
            break;
        case 'catapult':
            translatedUnit = 'catapultas';
            break;
        case 'godsent':
            translatedUnit = 'divinos';
            break;
        case 'manticore':
            translatedUnit = 'mantícoras';
            break;
        case 'harpy':
            translatedUnit = 'arpías';
            break;
        case 'pegasus':
            translatedUnit = 'pegasos';
            break;
        case 'griffin':
            translatedUnit = 'grifos';
            break;
        case 'cerberus':
            translatedUnit = 'cerberos';
            break;
        case 'minotaur':
            translatedUnit = 'minotauros';
            break;
        case 'medusa':
            translatedUnit = 'medusas';
            break;
        case 'zyklop':
            translatedUnit = 'cíclopes';
            break;
        case 'centaur':
            translatedUnit = 'centauros';
            break;
        case 'calydonian_boar':
            translatedUnit = 'jabalís';
            break;
        case 'fury':
            translatedUnit = 'erinias';
            break;
        case 'sea_monster':
            translatedUnit = 'hidras';
            break;
        case 'spartoi':
            translatedUnit = 'espartos';
            break;
        case 'ladon':
            translatedUnit = 'ladones';
            break;
        case 'satyr':
            translatedUnit = 'sátiros';
            break;
        case 'siren':
            translatedUnit = 'sirenas';
            break;
        case 'small_transporter':
            translatedUnit = 'botes rápidos';
            break;
        case 'big_transporter':
            translatedUnit = 'botes lentos';
            break;
        case 'bireme':
            translatedUnit = 'birremes';
            break;
        case 'attack_ship':
            translatedUnit = 'mechas';
            break;
        case 'trireme':
            translatedUnit = 'trirremes';
            break;
        case 'demolition_ship':
            translatedUnit = 'brulotes';
            break;
        case 'colonize_ship':
            translatedUnit = 'colonos';
            break;
        case 'hera':
            translatedUnit = 'Hera';
            break;
        case 'athena':
            translatedUnit = 'Atenea';
            break;
        case 'artemis':
            translatedUnit = 'Artemisa';
            break;
        case 'ares':
            translatedUnit = 'Ares';
            break;
        case 'aphrodite':
            translatedUnit = 'Afrodita';
            break;
        case 'hades':
            translatedUnit = 'Hades';
            break;
        case 'poseidon':
            translatedUnit = 'Poseidón';
            break;
        case 'zeus':
            translatedUnit = 'Zeus';
            break;
        case 'apheledes':
            translatedUnit = 'Afeledes';
            break;
        case 'agamemnon':
            translatedUnit = 'Agamenón';
            break;
        case 'ajax':
            translatedUnit = 'Ajax';
            break;
        case 'alexandrios':
            translatedUnit = 'Alexandrios';
            break;
        case 'andromeda':
            translatedUnit = 'Andrómeda';
            break;
        case 'anysia':
            translatedUnit = 'Anysia';
            break;
        case 'argus':
            translatedUnit = 'Argos';
            break;
        case 'aristotle':
            translatedUnit = 'Aristóteles';
            break;
        case 'atalanta':
            translatedUnit = 'Atalanta';
            break;
        case 'christopholus':
            translatedUnit = 'Cristopholus';
            break;
        case 'daidalos':
            translatedUnit = 'Daidalos';
            break;
        case 'deimos':
            translatedUnit = 'Deimos';
            break;
        case 'democritus':
            translatedUnit = 'Demócrito';
            break;
        case 'eurybia':
            translatedUnit = 'Euribia';
            break;
        case 'ferkyon':
            translatedUnit = 'Ferquión';
            break;
        case 'philoctetes':
            translatedUnit = 'Filoctetes';
            break;
        case 'iason':
            translatedUnit = 'Jasón';
            break;
        case 'leonidas':
            translatedUnit = 'Leónidas';
            break;
        case 'lysippe':
            translatedUnit = 'Lysippe';
            break;
        case 'medea':
            translatedUnit = 'Medea';
            break;
        case 'melousa':
            translatedUnit = 'Melousa';
            break;
        case 'mihalis':
            translatedUnit = 'Mihalis';
            break
        case 'odysseus':
            translatedUnit = 'Odiseo';
            break;
        case 'orpheus':
            translatedUnit = 'Orfeo';
            break;
        case 'pariphaistes':
            translatedUnit = 'Pariphaistes';
            break;
        case 'pelops':
            translatedUnit = 'Pélope';
            break;
        case 'perseus':
            translatedUnit = 'Perseo';
            break;
        case 'cheiron':
            translatedUnit = 'Quirón';
            break;
        case 'rekonos':
            translatedUnit = 'Rekonos';
            break;
        case 'telemachos':
            translatedUnit = 'Telemaco';
            break;
        case 'themistokles':
            translatedUnit = 'Temístocles';
            break;
        case 'terylea':
            translatedUnit = 'Terilea';
            break;
        case 'urephon':
            translatedUnit = 'Uréfon';
            break;
        case 'ylestres':
            translatedUnit = 'Ylestres';
            break;
        case 'hector':
            translatedUnit = 'Héctor';
            break;
        case 'helen':
            translatedUnit = 'Helena';
            break;
        case 'hercules':
            translatedUnit = 'Hércules';
            break;
        case 'zuretha':
            translatedUnit = 'Zureta';
            break;
        default:
            translatedUnit = 'unidad desconocida';
    }
    return translatedUnit
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Ajustar ataques
 
function ajustes(){
    documentoCargado();
    observerAjax();
    try {
        var moverMarco = new moverMarco;
    } catch (g) {
        console.log(g);
    }
    var horaAjuste = GM_getValue("horaAjuste" + serverId, 0);
 
    // Funciones autoguardado tropas
    ////////////////////////////////
 
    function insertCheckboxForUnitSaving() {
        const attackWindow = document.querySelector('.attack_support_window');
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
        if (!GM_getValue('unitSavingEnabled', false)) return;
 
        const savedUnitSelections = JSON.parse(GM_getValue('savedUnitSelections', '{}'));
        let allFilled = true; // Asumimos que todas las casillas se llenarán correctamente
        setTimeout(function(){
            Object.keys(savedUnitSelections).forEach(unitType => {
                const input = document.querySelector(`.unit_input[name="${unitType}"]`);
 
                if (input) {
                    input.value = savedUnitSelections[unitType];
                    input.dispatchEvent(new Event('change'));
                    if (!input.value) { // Verifica si el valor no se ha establecido correctamente
                        allFilled = false;
                    }
                }
            });
 
            // Si no todas las casillas se llenaron y no hemos superado el número máximo de intentos, reintenta
            const maxAttempts = 20; // Define un máximo de intentos para evitar bucles infinitos
            if (!allFilled && attempt < maxAttempts) {
                console.log(`No todas las casillas se llenaron en el intento ${attempt}. Reintentando...`);
                setTimeout(() => loadUnitSelections(attempt + 1), 50); // Espera 50 milisegundos antes de reintentar
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
                    GM_setValue('horaAjuste' + serverId, campoHora.value);
                    window.location.reload();
 
                } else {
                    mensajeError.style.display = "block";
                }
            };
        }
    }
 
 
    function crearBoton(){
        var deletear = document.querySelector('.slide_button_wrapper');
        var contenedor = deletear.parentElement
        contenedor.removeChild(deletear);
 
        // Crear un nuevo elemento de botón
        var boton = document.createElement("button");
 
        // Crear un elemento de imagen y establecer la fuente de la imagen
        var img = document.createElement("img");
        img.src = "https://i.imgur.com/Ebwr9HX.png";
        img.alt = "Icono"; // Texto alternativo para accesibilidad
        img.style.width = "120%";
        img.style.height = "auto";
 
        // Ajustar el estilo del botón para que solo muestre la imagen
        boton.style.width = "50px";
        boton.style.height = "50px";
        boton.style.padding = "0";
        boton.style.border = "none";
        boton.style.left = "-8px";
        boton.style.background = "none";
        boton.style.cursor = "pointer"; // Cambia el cursor a una mano para indicar interactividad
        boton.style.position = 'absolute';
        boton.style.top = '90%';
        boton.style.left = '44%';
        boton.style.transform = 'translate(-50%, -50%)';
 
        // Añadir la imagen al botón
        boton.appendChild(img);
 
        // Añadir efectos visuales para el estado hover
        boton.onmouseover = function() {
            // this.style.opacity = "0.8"; // Hace el botón ligeramente transparente
            img.src = 'https://i.imgur.com/TU1471X.png'
        };
        boton.onmouseout = function() {
            // this.style.opacity = "1"; // Restaura la opacidad del botón
            img.src = "https://i.imgur.com/Ebwr9HX.png";
 
        };
 
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
                if (movimiento.getAttribute('data-commandtype') === 'revolts') {
                    // Eliminar el elemento
                    movimiento.remove();
                }
                if (movimiento.getAttribute('data-cancelable') === 'null' || movimiento.getAttribute('data-cancelable') === '-1'){
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
                        //////////////////////////////////
                        var dio = document.querySelector('#dio_plusmenuCommands');
                        if(dio){
                            var botonX = dio.querySelector(".dio_plusback");
                            botonX.style.display = 'block';
                            botonX.click();
                        }
                        else{$('#toolbar_activity_commands_list .cancel').click()}
                        //////////////////////////////////
 
                        indicadorTexto.style.color = "green";
                        indicatorAjuste.setAttribute("style", "width:1em;background:green;margin-left: 0.3em;");
                        textoElemento.innerText = "\u2713";
                        textoElemento.style.fontWeight = "bold";
                        textoElemento.style.cssText = "margin-left: 0.3em; font-size: 1.3em; color: white; background-color: green; padding: 5px; text-align: center; margin-bottom: 5px; display: flex; align-items: center;";
                        // movimiento.style.display="none";
                    }else{
                        // if (autoCancelarMarcado){
                        //     var intervalo = Math.floor(Math.random() * (250 - 200 + 1)) + 200;
                        //     // Captura el elemento actual de 'movimiento' en el ámbito de esta iteración del bucle
                        //     (function(movimientoActual) {
                        //         setTimeout(function() {
                        //             var botonCancelar = movimientoActual.querySelector('.cancelable');
                        //             if (botonCancelar) {
                        //                 botonCancelar.click();
                        //             }
                        //         }, intervalo);
                        //     })(movimiento);
                        // }
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
 
 
}
 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Auto indexar
 
function autoIndexar(){
    setInterval(function(){
        var botonIndex = document.querySelectorAll('[id^="gd_index_"]');
        if (botonIndex){
            for( var boton of botonIndex){
                if(boton.textContent == 'Index +'){
                    boton.click();
                }
            }
        }
    }, 1000);
}
 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Agregar boton farmeo
 
function botonAldeas(){
    var newActivity;
    var dctAldeas;
    var timer;
    var nextLoot = 0;
    setInterval(function(){
 
        var timestampActual = Math.floor(Date.now() / 1000);
        var botonAldeas = document.querySelector('.aldeas');
 
 
        if (dctAldeas) {
            for (var aldeaId in dctAldeas) {
 
                var aldea = dctAldeas[aldeaId];
                if ((nextLoot > aldea.attributes.lootable_at || nextLoot < timestampActual) && aldea.attributes.relation_status == 1)
                {
                    nextLoot = aldea.attributes.lootable_at;
                }
            }
            timer = nextLoot-timestampActual;
 
        }else{dctAldeas = MM.getModels().FarmTownPlayerRelation;}
 
 
        if (!botonAldeas){
            var toolbar = document.querySelector('.tb_activities.toolbar_activities');
 
            // Crea un nuevo div para la nueva actividad
            newActivity = document.createElement('div');
            newActivity.classList.add('activity_wrap');
 
            // Crea el HTML para la nueva actividad
            newActivity.innerHTML = `
        <div class="aldeas">
            <div class="hover_state">
                <div class="iconoAldeas">
                    <img src= 'https://i.imgur.com/0tlOSHF.png'>
                    <p class="centered-text"></p>
                </div>
            </div>
        </div>
        <div class="ui_highlight" data-type="bubble_menu" data-subtype="new_activity"></div>
    `;
            newActivity.addEventListener('click', function(){
                FarmTownOverviewWindowFactory.openFarmTownOverview()
            });
 
            // Estilo CSS para centrar el texto dentro del botón de las aldeas
            var style = document.createElement('style');
            style.innerHTML = `
                .centered-text {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    margin: 0;
                    font-size: 12px; /* Ajusta el tamaño del texto según sea necesario */
                    color: white; /* Ajusta el color del texto según sea necesario */
                }
            `;
            document.head.appendChild(style);
            // Agrega la nueva actividad al elemento tb_activities toolbar_activities
            toolbar.children[1].appendChild(newActivity);
        }else{
            if (timestampActual < nextLoot){
                newActivity.children[0].children[0].children[0].children[0].src = 'https://i.imgur.com/p0n5Gez.png';
                newActivity.children[0].children[0].children[0].children[1].innerText = timer;
            }else{
                if (newActivity.children[0].children[0].children[0].children[0].src == 'https://i.imgur.com/p0n5Gez.png'){
                    var url = 'https://mcdn.podbean.com/mf/web/3tmzssjsmuxn9mz9/simple-notification-152054.mp3';
                    var audio = new Audio(url);
                    audio.play();
                    newActivity.children[0].children[0].children[0].children[0].src = 'https://i.imgur.com/0tlOSHF.png';
                    newActivity.children[0].children[0].children[0].children[1].innerText = ''
                    dctAldeas = undefined;
                }
 
            }
        }
 
    }, 1000);
}
 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mostrar unidades en cola
 
function unidadesCola(){
    var selectedUnit;
    var translatedUnit
 
 
    setInterval(function(){
        var ventanaTropasDio = document.querySelector('#dio_available_units');
 
        if (!selectedUnit){
            for (var indice in ventanaTropasDio.children[5].children){
                if (ventanaTropasDio.children[5].children[indice].classList.contains("active")){
                    selectedUnit = ventanaTropasDio.children[5].children[indice].classList[4]
                }
            }
        }
 
        var translatedUnit = traducir(selectedUnit)
 
        var contador = document.querySelector('#contador_unidades_ubu');
        if (ventanaTropasDio && !contador) {
            var botonCambiar = document.querySelector('#cambiar_unidad');
            var deleter = document.createElement('button');
            deleter.id = 'cambiar_unidad';
            deleter.textContent = 'Cambiar de unidad';
 
            if (!botonCambiar) {
                ventanaTropasDio.appendChild(deleter);
            }
 
            function actualizarContador() {
                var array = calcularSuma();
                var suma = array[0];
                var contenido = array[1];
                var contadorDiv = document.querySelector('#contador_unidades_ubu');
 
                if (!contadorDiv) {
                    // Crea un nuevo elemento div para mostrar la suma
                    contadorDiv = document.createElement('button');
                    contadorDiv.id = 'contador_unidades_ubu';
                    ventanaTropasDio.appendChild(contadorDiv);
                }
 
                contadorDiv.textContent = suma + ' ' + translatedUnit + ' en cola en ' + array[2] + ' ciudades';
                contadorDiv.removeEventListener('click', function(){copiarAlPortapapeles(contenido);
                                                                    HumanMessage.success(_('Lista copiada al porpapaeles'))
                                                                   });
                contadorDiv.addEventListener('click', function(){copiarAlPortapapeles(contenido);
                                                                 HumanMessage.success(_('Lista copiada al porpapaeles'))
                                                                });
 
                function copiarAlPortapapeles(contenido) {
                    navigator.clipboard.writeText(contenido);
                }
            }
 
            deleter.addEventListener('click', function () {
                selectedUnit = null; // Reinicia la unidad seleccionada
                contador = null; // Reinicia el contador
                var contadorDiv = document.querySelector('#contador_unidades_ubu');
                if (contadorDiv) {
                    contadorDiv.remove(); // Elimina el contador anterior
                }
                console.log('Unidad cambiada, contador reiniciado');
                // Aquí puedes agregar lógica para seleccionar una nueva unidad si es necesario
                // Por ejemplo, puedes abrir un cuadro de diálogo para seleccionar la nueva unidad
                // y luego llamar a actualizarContador() de nuevo con la nueva unidad seleccionada.
                // Después de seleccionar la nueva unidad, asegúrate de actualizar selectedUnit y translatedUnit
                // y luego llama a actualizarContador() para reflejar los cambios.
            });
            actualizarContador()
        }
 
    }, 1000);
 
    function calcularSuma(){
        var playerID = Game.player_id;
        var orderArray = MM.getModels().UnitOrder;
        var toidArray = MM.getModels().TownIdList[playerID].attributes.town_ids;
        var dct = {};
        var suma = 0;
        var totalCiudades = 0;
        var ciudades = [];
 
        // Recopilar los datos de las unidades en el diccionario
        for (var orderNumber in orderArray){
            var order = orderArray[orderNumber].attributes;
            if (order.unit_type == selectedUnit){
                if (isNaN(dct[order.town_id])){ // Verificación correcta de NaN
                    dct[order.town_id] = order.units_left;
                } else {
                    dct[order.town_id] += order.units_left;
                }
            }
        }
 
        // Crear un array de objetos con el nombre de la ciudad y las unidades
        for (var key in dct){
            if (dct.hasOwnProperty(key)) {
                ciudades.push({
                    id: key,
                    nombre: ITowns.towns[key].name,
                    unidades: dct[key]
                });
                suma += dct[key];
                totalCiudades += 1;
            }
        }
 
        // Ordenar las ciudades alfabéticamente por nombre
        ciudades.sort(function(a, b) {
            return a.nombre.localeCompare(b.nombre);
        });
 
        // Construir el contenido basado en la ordenación
        var contenido = '';
        for (var i = 0; i < ciudades.length; i++) {
            contenido += '[town]' + ciudades[i].id + '[/town]: ' + ciudades[i].unidades + '\n';
        }
 
        var array = [suma, contenido, totalCiudades];
        return array;
    }
}
 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Agregar filtro al radar del pulpo
 
function filtroRadarPulpo(){
    var filtroInput;
 
    var targetNode = document.querySelector('body');
    var config = { attributes: false, childList: true, subtree: true };
    var observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
 
    function callback(mutationsList, observer) {
        for(var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                var grcrt = document.getElementById('grcrt_radar_result');
                if(grcrt == null && filtroInput){
                    filtroInput = false;
                }
                var grcrtTable = grcrt.querySelector('.js-scrollbar-viewport');
                var searchDiv = document.querySelector('.grcrt_radar');
                var altura = searchDiv.style.minHeight;
                searchDiv.style.minHeight = altura + 100 + 'px';
                if (grcrtTable && !filtroInput && searchDiv) {
                    filtroInput = crearFiltro(searchDiv);
                } else if (grcrtTable && filtroInput) {
                    filtrar(filtroInput, grcrtTable);
                }
            }
        }
    }
 
    function crearFiltro(searchDiv) {
        if (!filtroInput) {
            filtroInput = document.createElement('input');
            filtroInput.type = 'text';
            filtroInput.id = 'filtro';
            filtroInput.placeholder = 'Filtrar por jugador o ali';
 
            // Aplicar estilos directamente al elemento
            filtroInput.style.float = 'right';
            filtroInput.style.margin = '2px';
            filtroInput.style.padding = '5px';
            filtroInput.style.boxSizing = 'border-box';
            filtroInput.style.height = '25px'; // Ajusta la altura para que coincida con los botones
            filtroInput.style.display = 'inline-block';
 
            // Insertar el campo de entrada del filtro dentro del div con id="RADAR.BTNFIND"
            var buttonFindDiv = document.getElementById('RADAR.BTNFIND');
            if (buttonFindDiv) {
                // Insertar el filtro antes del primer hijo de buttonFindDiv
                buttonFindDiv.parentElement.appendChild(filtroInput);
            }
 
            return filtroInput;
        }
    }
 
    // .appendChild(filtroInput);
 
    function filtrar(filtroInput, grcrtTable){
        const elementosLista = grcrtTable.querySelectorAll('.js-scrollbar-content li');
 
        filtroInput.addEventListener('input', function() {
            const valorFiltro = filtroInput.value.toLowerCase();
 
            elementosLista.forEach(li => {
                const nombreJugador = li.querySelector('.gp_player_link').textContent.toLowerCase();
                const nombreAlianzaElemento = li.querySelector('.gp_alliance_link');
                const nombreAlianza = nombreAlianzaElemento ? nombreAlianzaElemento.textContent.toLowerCase() : '';
 
                if (nombreJugador.includes(valorFiltro) || nombreAlianza.includes(valorFiltro)) {
                    li.style.display = '';
                } else {
                    li.style.display = 'none';
                }
            });
        });
 
        // Filtrar inicialmente al llamar a la función
        const valorFiltroInicial = filtroInput.value.toLowerCase();
        elementosLista.forEach(li => {
            const nombreJugador = li.querySelector('.gp_player_link').textContent.toLowerCase();
            const nombreAlianzaElemento = li.querySelector('.gp_alliance_link');
            const nombreAlianza = nombreAlianzaElemento ? nombreAlianzaElemento.textContent.toLowerCase() : '';
 
            if (nombreJugador.includes(valorFiltroInicial) || nombreAlianza.includes(valorFiltroInicial)) {
                li.style.display = '';
            } else {
                li.style.display = 'none';
            }
        });
    }
 
    // Estilos CSS directamente en HTML
    var estiloCSS = `
        .filtro-input {
            position: absolute;
            top: 10%;
            right: 50%;
        }
    `;
 
    var estiloElemento = document.createElement('style');
    estiloElemento.type = 'text/css';
    estiloElemento.appendChild(document.createTextNode(estiloCSS));
 
    document.head.appendChild(estiloElemento);
}
 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Generar listas coalicion
 
function generarListasAlianzas() {
    var dct = {};
    var arrayDicts = [];
    var ali = '';
    var alianzasAñadidas = {}; // Objeto para rastrear alianzas añadidas
 
    setInterval(function() {
        var contenedorAli = document.querySelector('.members_list');
        var existeBoton = document.querySelector('#boton_lista');
        if (contenedorAli && !existeBoton) {
 
            var botonLista = document.createElement('button');
            botonLista.id = 'boton_lista';
            botonLista.innerText = 'Añadir';
            botonLista.addEventListener('click', function() {
                var nombreAlianza = obtenerNombreAlianza(contenedorAli);
                if (!alianzasAñadidas[nombreAlianza]) {
                    arrayDicts = generarLista(contenedorAli);
                    alianzasAñadidas[nombreAlianza] = true;
                    HumanMessage.success(_('Alianza añadida'));
                } else {
                    HumanMessage.info(_('Esta alianza ya ha sido añadida'));
                }
            });
            contenedorAli.parentElement.children[12].appendChild(botonLista);
 
            var botonCopiar = document.createElement('button');
            botonCopiar.id = 'boton_portapapeles';
            botonCopiar.innerText = 'Copiar';
            botonCopiar.addEventListener('click', function() {
                copiar(arrayDicts);
            });
            contenedorAli.parentElement.children[12].appendChild(botonCopiar);
        }
    }, 1000);
 
    function obtenerNombreAlianza(contenedorAli) {
        return contenedorAli.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].outerText.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
    }
 
    function generarLista(contenedorAli) {
        try{
            var nombreAlianza = obtenerNombreAlianza(contenedorAli);
        }catch{nombreAlianza = '';}
        ali += '[ally]' + nombreAlianza + '[/ally] ';
        console.log(ali);
 
        var listaMiembros = contenedorAli.children[1].children[0].children;
        for (var i = 0; i < listaMiembros.length; i++) {
            var provisional = {};
            provisional.jugador = JSON.parse(atob(listaMiembros[i].children[2].attributes.href.value.slice(1))).name;
            provisional.puntos = parseInt(listaMiembros[i].children[3].innerText.match(/(\d+) puntos/)[1]);
            try {
                provisional.ciudades = parseInt(listaMiembros[i].children[3].innerText.match(/(\d+) ciudades/)[1]);
            } catch {
                try {
                    provisional.ciudades = parseInt(listaMiembros[i].children[3].innerText.match(/(\d+) ciudad/)[1]);
                } catch {}
            }
 
            var nuevoIndice = Object.keys(dct).length;
            dct[nuevoIndice] = provisional;
        }
 
        function ordenarDctPorPuntos(dct) {
            // Convertir dct en un array de sus valores
            var arrayDct = Object.values(dct);
 
            // Ordenar el array por puntos en orden descendente
            arrayDct.sort(function(a, b) {
                return b.puntos - a.puntos;
            });
 
            // Reconstruir dct con el nuevo orden
            var dctOrdenado = {};
            for (var i = 0; i < arrayDct.length; i++) {
                dctOrdenado[i] = arrayDct[i];
            }
 
            return dctOrdenado;
        }
 
        function ordenarDctPorCiudades(dct) {
            // Convertir dct en un array de sus valores
            var arrayDct = Object.values(dct);
 
            // Ordenar el array por puntos en orden descendente
            arrayDct.sort(function(a, b) {
                return b.ciudades - a.ciudades;
            });
 
            // Reconstruir dct con el nuevo orden
            var dctOrdenado = {};
            for (var i = 0; i < arrayDct.length; i++) {
                dctOrdenado[i] = arrayDct[i];
            }
 
            return dctOrdenado;
        }
 
        // Usar la función para ordenar dct
        var dctOrdenadoPuntos = ordenarDctPorPuntos(dct);
        var dctOrdenadoCiudades = ordenarDctPorCiudades(dct);
        arrayDicts = [dctOrdenadoPuntos, dctOrdenadoCiudades];
        return arrayDicts;
    }
 
    function copiar(arrayDicts) {
        var dctPuntos = arrayDicts[0];
        var dctCiudades = arrayDicts[1];
        var totalPuntos1 = 0;
        var totalCiudades1 = 0;
        var totalPuntos2 = 0;
        var totalCiudades2 = 0;
        var maximo = 0;
 
        if (parseInt(parseInt(miembrosListaInput)) > Object.keys(dctCiudades).length) {
            maximo = Object.keys(dctCiudades).length;
        } else {
            maximo = parseInt(miembrosListaInput);
        }
 
        var contenidoPost = ali + '[spoiler=Por puntos][table][**]JUGADOR[||]PUNTOS[||]CIUDADES[/**]';
        for (var i = 0; i < maximo; i++) {
            contenidoPost += '[*][player]' + dctPuntos[i].jugador + '[/player][|]' + dctPuntos[i].puntos + ' puntos[|]' + dctPuntos[i].ciudades + ' ciudades[/*]';
            totalPuntos1 += dctPuntos[i].puntos;
            totalCiudades1 += dctPuntos[i].ciudades;
        }
        contenidoPost += '[/table][b]Total puntos: ' + totalPuntos1 + '. Total ciudades: ' + totalCiudades1 + '[/b][/spoiler]';
 
        contenidoPost += ali + '[spoiler=Por ciudades][table][**]JUGADOR[||]PUNTOS[||]CIUDADES[/**]';
        for (i = 0; i < maximo; i++) {
            contenidoPost += '[*][player]' + dctCiudades[i].jugador + '[/player][|]' + dctCiudades[i].puntos + ' puntos[|]' + dctCiudades[i].ciudades + ' ciudades[/*]';
            totalPuntos2 += dctCiudades[i].puntos;
            totalCiudades2 += dctCiudades[i].ciudades;
        }
        contenidoPost += '[/table][b]Total puntos: ' + totalPuntos2 + '. Total ciudades: ' + totalCiudades2 + '[/b][/spoiler]';
        navigator.clipboard.writeText(contenidoPost)
            .then(function() {
            HumanMessage.success(_('Listas copiadas al portapapeles'));
            dct = null; dct = {};
            ali = '';
            alianzasAñadidas = null; alianzasAñadidas = {};
        })
            .catch(function(err) {
            HumanMessage.error('Error al copiar al portapapeles: ', err);
            // Manejar errores si es necesario
        });
    }
}
 
 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Generar plantillas
function plantillas(){
    var townBbcodeLink
    var commandContainer
    var reportContainer
 
    // Función para agregar un botón al contenedor del elemento town_bbcode_link
    function escanearVentanas(townBbcodeLink) {
 
        // Encuentra el elemento town_bbcode_link
        townBbcodeLink = document.getElementById('town_bbcode_link');
        commandContainer = document.querySelector('.command_info_container');
        reportContainer = document.querySelector('#report_report');
 
        var botonPerfil = document.querySelector('#plantilla_perfil');
        var botonCommand = document.querySelector('#boton_ataque_recibido');
        var botonInforme = document.querySelector('#boton_informe');
 
 
 
        // Si el elemento existe
        if (townBbcodeLink && !botonPerfil) {
            plantillaCiudad(townBbcodeLink)
        }else if (reportContainer && !botonInforme){
            plantillaReport(reportContainer)
        }
 
    }
 
    function plantillaCiudad(townBbcodeLink){
 
 
        var contenedor = townBbcodeLink.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
 
        var contenedorDatos = townBbcodeLink.parentElement.parentElement.parentElement
        var townBBCode = contenedorDatos.querySelector('.town_bbcode_id').value;
        var townName = contenedor.parentElement.parentElement.children[0].children[0].innerText;
        var playerName = contenedorDatos.querySelectorAll('.gp_player_link')[0].text;
        var playerBBCode = '[player]' + playerName + '[/player]'
        var aliName = contenedorDatos.children[4].children[1].innerText
        if (aliName != 'Reservar' && aliName && aliName != '<empty string>'){
            var aliBBCode = '[ally]' + aliName + '[/ally]';
        }
 
 
        var marTexto = contenedorDatos.children[2].innerText
        try{
            var reserva = contenedorDatos.querySelectorAll('.gp_player_link')[1].text}catch{}
        if (reserva != '<empty string>' && reserva && reserva != 'undefined' && reserva != 'Reservar'){
            var conquistador = '[player]' + reserva + '[/player]'
            }
 
        var regex = /(\d+)/;
        var resultado = regex.exec(marTexto);
        var numeroMar = resultado[1];
        var mar = 'M' + numeroMar
 
        var contenidoPost = mar + ' // ' + townName + ' // ESPIA' +
            '\n═════════════════════════════════════════════════════════'+
            '\n[b]Ciudad Objetivo:[/b] '+ townBBCode +
            '\n[b]Jugador Objetivo:[/b] '+ playerBBCode +
            '\n[b]Alianza Objetivo:[/b] '+ (aliBBCode || '') +
            '\n[b]Conquistador:[/b] '+ (conquistador || '') +
            '\n[b]Hora de Inicio de Revuelta:[/b] '+
            '\n[b]Hora de Llegada del Colono:[/b] '+
            '\n'+
            '\n═════════════════════════════════════════════════════════'+
            '\n[b]Apoyo Necesario:[/b] '+
            '\n'+
            '\n═════════════════════════════════════════════════════════'+
            '\n[spoiler=Informes(ataque de revuelta, espionaje, etc)]'+
            '\n'+
            '\n[/spoiler]';
        // var ciudad = contenedor.querySelector(
        var boton = document.createElement('button');
        boton.id = 'plantilla_perfil';
        boton.innerHTML = 'Generar Plantilla';
 
        boton.addEventListener('click', function() {
            // Copiar el contenido de contenidoPost al portapapeles
            navigator.clipboard.writeText(contenidoPost)
                .then(function() {
                // Aquí puedes agregar una retroalimentación adicional si lo deseas
            })
                .catch(function(err) {
                console.error('Error al copiar al portapapeles: ', err);
                // Manejar errores si es necesario
            });
        });
 
        contenedor.appendChild(boton);
        var botonCerrar = contenedor.parentElement.parentElement.children[0].children[1]
        botonCerrar.addEventListener('click', function(){
            setTimeout(function(){
                escanearVentanas(false);
            }, 1000);
 
        });
    }
 
    function plantillaReport(reportContainer){
        var dict = {}
        dict.Attacker = {};
        dict.Deffender = {};
 
        var hora_regex = /\d{2}:\d{2}:\d{2}/;
        var horaAtaque = reportContainer.children[0].children[10].children[0].innerText.match(hora_regex)[0];
        var conquestTime = Game.constants.game_config.conquest_time_hours;
 
        // Crear un objeto de fecha
        var fecha = new Date("2000-01-01 " + horaAtaque); // Usamos una fecha cualquiera ya que solo nos interesa la hora
 
        // Sumar 8 horas
        fecha.setHours(fecha.getHours() + conquestTime);
 
        // Obtener la nueva hora
        var horaPR = fecha.toLocaleTimeString('en-US', {hour12: false}); // Convertir la hora a una cadena en formato de 24 horas
 
        var dataContainer = reportContainer.children[0].children[9].children[0];
 
        var attacker = dataContainer.children[0].children[1];
        var deffender = dataContainer.children[2].children[1];
        // Expresión regular para extraer el texto entre comillas simples
        var texto_regex = /'([^']*)'/;
        var attackerTown = JSON.parse(atob(attacker.children[0].children[0].attributes.href.value.slice(1)));
        var deffenderTown = JSON.parse(atob(deffender.children[0].children[0].attributes.href.value.slice(1)));
 
        dict.Attacker.Town = '[town]' + attackerTown.id + '[/town]';
        dict.Attacker.Player = '[player]' + attacker.children[1].innerText + '[/player]';
        dict.Attacker.Ally = '[ally]' + attacker.children[2].innerHTML.match(texto_regex)[1] + '[/ally]';
        dict.Attacker.Sea = attackerTown.ix.toString().charAt(0) + attackerTown.iy.toString().charAt(0);
        dict.Attacker.TownID = attackerTown.id;
        dict.Attacker.ID = JSON.parse(atob(attacker.children[1].children[0].attributes.href.value.slice(1))).id;
 
        dict.Deffender.Town = '[town]' + deffenderTown.id + '[/town]';
        dict.Deffender.Player = '[player]' + deffender.children[1].innerText + '[/player]';
        try{
            dict.Deffender.Ally = '[ally]' + deffender.children[2].innerHTML.match(texto_regex)[1] + '[/ally]';
        }catch{}
        dict.Deffender.Sea = deffenderTown.ix.toString().charAt(0) + deffenderTown.iy.toString().charAt(0);
        dict.Deffender.TownID = deffenderTown.id
 
        dict.Deffender.Wall = MM.getModels().Buildings[deffenderTown.id].attributes.wall
        dict.Deffender.Tower = MM.getModels().Buildings[deffenderTown.id].attributes.tower == 0 ? 'NO' : 'SÍ';
        dict.Deffender.Ram = MM.getModels().Researches[deffenderTown.id].attributes.ram ? 'SÍ' : 'NO';
        dict.Deffender.Phalanx = MM.getModels().Researches[deffenderTown.id].attributes.phalanx ? 'SÍ' : 'NO';
        dict.Deffender.DivineSelection = MM.getModels().Researches[deffenderTown.id].attributes.divine_selection ? 'SÍ' : 'NO';
        dict.Deffender.Hero = '';
        var HEROES = require('enums/heroes');
        for (var heroe in HEROES){
            if (ITowns.getTown(deffenderTown.id).hasHero(HEROES[heroe])) {
                dict.Deffender.HeroLevel = ITowns.getTown(deffenderTown.id).getHero(HEROES[heroe]).attributes.level
                dict.Deffender.Hero = traducir(HEROES[heroe]);
            }
        }
        // if (dict.Deffender.Hero == ''){dict.Deffender.Hero = 'ninguno'}
 
        dict.Deffender.God = traducir(MM.getModels().Town[dict.Deffender.TownID].attributes.god) ? traducir(MM.getModels().Town[deffenderTown.id].attributes.god) : 'ninguno';
        dict.Deffender.IronInHide = MM.getModels().Town[dict.Deffender.TownID].attributes.espionage_storage
        console.log('Si borro este print la función peta, así que ahí se queda xd');
        // Llamada a la función
        (async () => {
            dict.Deffender.HoraColono = await obtenerDistancia(dict);
 
            var contenidoPost = 'M'+dict.Deffender.Sea+' // ' + deffender.children[0].innerText + ' // PR ' + horaPR +
                '\n═════════════════════════════════════════════════════════'+
                '\n[b]Ciudad Atacada:[/b] '+ dict.Deffender.Town +
                '\n[b]Jugador Atacado:[/b] '+ dict.Deffender.Player +
                '\n'+
                '\n[b]Hora de Inicio de Revuelta:[/b] '+ horaPR +
                '\n[b]Colono más cercano: ~[/b] '+ dict.Deffender.HoraColono +
                '\n[b]Hora de Llegada del Colono:[/b] '+
                '\n'+
                '\n[b]Jugador Atacante:[/b] '+ dict.Attacker.Player +
                '\n[b]Alianza Atacante:[/b] '+ (dict.Attacker.Ally || '') +
                '\n═════════════════════════════════════════════════════════'+
                '\n[b]Muro:[/b] '+ dict.Deffender.Wall +
                '\n[b]Torre:[/b] '+ dict.Deffender.Tower +
                '\n[b]Espolón:[/b] '+ dict.Deffender.Ram +
                '\n[b]Falange:[/b] '+ dict.Deffender.Phalanx +
                '\n[b]Selección divina:[/b] '+ dict.Deffender.DivineSelection +
                '\n[b]Héroe:[/b] '+ ((dict.Deffender.Hero + ' ' + dict.Deffender.HeroLevel) || 'ninguno')+
                '\n[b]Dios:[/b] '+ dict.Deffender.God +
                '\n[b]Plata en la cueva:[/b] '+ dict.Deffender.IronInHide +
                '\n═════════════════════════════════════════════════════════'+
                '\n[b]Apoyo Necesario:[/b] '+
                '\n'+
                '\n═════════════════════════════════════════════════════════'+
                '\n[spoiler=Revuelta]';
 
            var contenedorBBCode
 
 
            setInterval(function(){
 
                if (contenedorBBCode && !document.querySelector('#boton_informe')){
                    contenidoPost += contenedorBBCode.children[1].attributes[2].nodeValue + '[/spoiler]';
                    var boton = document.createElement('button');
                    boton.id = 'boton_informe';
                    boton.innerHTML = 'Generar Plantilla';
                    boton.addEventListener('click', function() {
                        // Copiar el contenido de contenidoPost al portapapeles
                        navigator.clipboard.writeText(contenidoPost)
                            .then(function() {
                            HumanMessage.success(_('Plantilla copiada al portapapeles'))
                            // Aquí puedes agregar una retroalimentación adicional si lo deseas
                        })
                            .catch(function(err) {
                            console.error('Error al copiar al portapapeles: ', err);
                            // Manejar errores si es necesario
                        });
                    });
                    contenedorBBCode.parentElement.appendChild(boton);
                }else if (!contenedorBBCode)
                {contenedorBBCode = document.querySelector('.publish_report_public_id_wrap');}
            }, 1000);
        })();
 
    }
 
 
    async function obtenerDistancia(dict) {
        function fetchNearbyCities(worldId, townId, margin) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: "GET",
                    url: RepConv.grcrt_domain + "json_rpc.php", // Reemplaza con la URL correcta
                    data: {
                        method: "getTown4Radar",
                        world: worldId,
                        town_id: townId,
                        margin: margin
                    },
                    dataType: "json",
                    success: function(response) {
                        console.log('Success callback reached');
                        if (response && response.towns) {
                            resolve(response.towns);
                        } else {
                            reject(new Error('Unexpected response structure'));
                        }
                    },
                    error: function(error) {
                        reject(error);
                    }
                });
            });
        }
 
        function calculateDistance(city1, city2) {
            return $.toe.calc.getDistance({ x: city1.abs_x, y: city1.abs_y }, { x: city2.abs_x, y: city2.abs_y });
        }
 
        function calculateTime(distance, gameSpeed) {
            var c = 900 / gameSpeed;
            var h = 9; // Speed of troops
            return Math.round(50 * distance / h + c);
        }
 
        function formatTime(seconds) {
            var hours = Math.floor(seconds / 3600);
            var minutes = Math.floor((seconds % 3600) / 60);
            var remainingSeconds = seconds % 60;
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        }
 
        function sortCitiesByDistance(referenceCity, cities, gameSpeed) {
            return cities.map(city => {
                var distance = calculateDistance(referenceCity, city);
                var travelTime = calculateTime(distance, gameSpeed);
                return {
                    city: city,
                    distance: distance,
                    travelTime: formatTime(travelTime)
                };
            }).sort((a, b) => a.distance - b.distance);
        }
 
        async function getNearbyCitiesSortedByDistance(worldId, townId, margin, gameSpeed, playerId) {
            try {
                const cities = await fetchNearbyCities(worldId, townId, margin);
                if (!cities) {
                    console.error('No cities data received');
                    return [];
                }
 
                // Extraer la ciudad de referencia antes del filtrado
                var referenceCity = cities.find(city => city.id === townId);
                if (!referenceCity) {
                    console.error('Reference city not found in cities');
                    return [];
                }
 
                var filteredCities = cities.filter(city => city.player_id == playerId);
 
                if (filteredCities.length > 0) {
                    return sortCitiesByDistance(referenceCity, filteredCities, gameSpeed);
                } else {
                    return [];
                }
            } catch (error) {
                console.error("Error fetching or processing cities:", error);
                return [];
            }
        }
 
        // Ejemplo de uso
        var worldId = Game.world_id; // ID del mundo
        var townId = dict.Deffender.TownID; // ID de la ciudad de referencia
        var margin = 600; // Margen de tiempo o cualquier otro parámetro necesario
        var gameSpeed = Game.game_speed; // Velocidad del juego
        var playerId = dict.Attacker.ID; // ID del jugador para filtrar las ciudades
 
        const sortedCities = await getNearbyCitiesSortedByDistance(worldId, townId, margin, gameSpeed, playerId);
        if (sortedCities.length > 0) {
            const travelTime = sortedCities[0].travelTime;
            return travelTime;
        } else {
            return "No se encontraron ciudades";
        }
    }
 
 
 
    // Intervalo para buscar el elemento town_bbcode_link
    setInterval(escanearVentanas, 1000);
}
 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Generar mapa de templos
function generarMapaTemplos(){
 
    // Asegúrate de que Plotly esté cargado
    function ensurePlotlyLoaded(callback) {
        if (typeof Plotly !== 'undefined') {
            callback();
        } else {
            var script = document.createElement('script');
            script.src = 'https://cdn.plot.ly/plotly-latest.min.js';
            script.onload = callback;
            document.head.appendChild(script);
        }
    }
 
    setInterval(function() {
        var ventanas = document.querySelectorAll('.wnd_border_t.js-wnd-buttons');
        var ventanaTemplos;
 
        for (var i = 0; i < ventanas.length; i++) {
            if (ventanas[i].outerText === "El Olimpo") {
                ventanaTemplos = ventanas[i];
                break;
            }
        }
 
        if (ventanaTemplos) {
            var tablaTemplos = document.querySelector('.table_content');
            var botonExiste = document.querySelector('#boton_templos');
            if (!botonExiste) {
                var boton = document.createElement('button');
                boton.id = 'boton_templos';
                boton.innerHTML = 'Listar templos';
                boton.addEventListener('click', function() {
                    var dct = generarListados(tablaTemplos);
                    var dctSorted = tratarListado(dct);
                    copiarAlPortapapeles(dctSorted);
                    ensurePlotlyLoaded(function() {
                        crearGraficoEnVentana(dctSorted);
                    });
                });
                tablaTemplos.insertBefore(boton, tablaTemplos.firstChild);
            }
        }
    }, 1000);
 
    function generarListados(tablaTemplos) {
        console.log(tablaTemplos);
        var dct = {};
        for (var i = 1; i < tablaTemplos.children.length; i++) {
            var templo = tablaTemplos.children[i];
            console.log(templo);
            var href = JSON.parse(atob(templo.children[0].children[0].attributes.href.value.slice(1)));
            var id = href.id;
            var coordX = href.ix;
            var coordY = href.iy;
            var mar = coordX.toString().charAt(0) + coordY.toString().charAt(0);
            var name = templo.children[0].children[0].text;
            var power = templo.children[1].innerText;
            var god = templo.children[2].children[0].classList[templo.children[2].children[0].classList.length - 1];
            god = traducir(god);
            dct[id] = {
                bbcode: '[temple]' + id + '[/temple]',
                id: id,
                name: name,
                coordX: coordX,
                coordY: coordY,
                poder: power,
                dios: god,
                mar: mar,
            };
        }
        console.log(dct);
        return dct;
    }
 
    function tratarListado(dct) {
        var diccionarioTemplosAtaque = {};
        var diccionarioTemplosDeff = {};
        var diccionarioTemplosReponer = {};
        var diccionarioHechizos = {};
        var diccionarioPortales = {};
        var sinClasificar = {};
 
        for (var key in dct) {
            if (dct.hasOwnProperty(key)) {
                var templo = dct[key];
                var poder = templo.poder.toLowerCase();
 
                // Clasificación en base al poder
                if (poder.includes('ofensivo') || poder.includes('ataque') || poder.includes('fuerza') || poder.includes('empeño')) {
                    diccionarioTemplosAtaque[key] = templo;
                } else if (poder.includes('defensivo') || poder.includes('defensa')) {
                    diccionarioTemplosDeff[key] = templo;
                } else if (poder.includes('reclutamiento') || poder.includes('costes') || poder.includes('producción') || poder.includes('llamada')) {
                    diccionarioTemplosReponer[key] = templo;
                } else if (poder.includes('bodas') || poder.includes('inframundo') || poder.includes('furia')) {
                    diccionarioHechizos[key] = templo;
                } else if (poder.includes('portal al olimpo')) {
                    diccionarioPortales[key] = templo;
                } else {
                    sinClasificar[key] = templo;
                }
            }
        }
 
        // Diccionario final
        var diccionario = {
            templosAtaque: diccionarioTemplosAtaque,
            templosDeff: diccionarioTemplosDeff,
            templosReponer: diccionarioTemplosReponer,
            templosHechizos: diccionarioHechizos,
            portales: diccionarioPortales,
            sinClasificar: sinClasificar,
        };
        return diccionario;
    }
 
    function copiarAlPortapapeles(dct) {
        console.log(dct);
        var contenidoPost = generarContenido(dct.templosAtaque, 'Templos ataque');
        contenidoPost += generarContenido(dct.templosDeff, 'Templos defensa');
        contenidoPost += generarContenido(dct.templosReponer, 'Templos reponer');
        contenidoPost += generarContenido(dct.templosHechizos, 'Templos hechizos');
        contenidoPost += generarContenido(dct.portales, 'Portales');
 
        navigator.clipboard.writeText(contenidoPost)
            .then(function() {
            // Aquí puedes agregar una retroalimentación adicional si lo deseas
        })
            .catch(function(err) {
            console.error('Error al copiar al portapapeles: ', err);
            // Manejar errores si es necesario
        });
    }
 
    function generarContenido(dct, titulo){
        var templos = Object.values(dct).sort((a, b) => a.poder.localeCompare(b.poder));
        var retorno = '═════════════════════════════════════════════════════════'+
            '\n[spoiler=' + titulo +'][table]'
 
        for (var templo of templos) {
            retorno += '[*]' + templo.bbcode + '[|]' + templo.poder + '[|]' + templo.mar +'[/*]\n';
        }
 
        retorno += '[/table][/spoiler]';
        return retorno
 
    }
    function crearGraficoEnVentana(diccionario) {
        var graphWindow = window.open('', '', 'width=1000,height=1000');
        graphWindow.document.write(`
            <html>
                <head>
                    <title>Templos de Grepolis</title>
                    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
                    <style>
                        body, html { margin: 0; padding: 0; overflow: hidden; }
                        #plotly-chart { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
                    </style>
                </head>
                <body>
                    <div id="plotly-chart"></div>
                </body>
            </html>
        `);
 
        graphWindow.document.close();
 
        // Crear datos para el gráfico
        var data = [];
        function addData(diccionario, name, color) {
            var x = [];
            var y = [];
            var text = [];
            for (var key in diccionario) {
                if (diccionario.hasOwnProperty(key)) {
                    var templo = diccionario[key];
                    x.push(templo.coordX);
                    y.push(templo.coordY);
                    text.push(`ID: ${templo.id}<br>Poder: ${templo.poder}`);
                }
            }
            data.push({
                x: x,
                y: y,
                text: text,
                mode: 'markers',
                type: 'scatter',
                name: name,
                marker: { color: color }
            });
        }
 
        addData(diccionario.templosAtaque, 'Ataque', 'red');
        addData(diccionario.templosDeff, 'Defensa', 'blue');
        addData(diccionario.templosReponer, 'Reponer', 'green');
        addData(diccionario.portales, 'Portal al Olimpo', 'purple');
        addData(diccionario.templosHechizos, 'Hechizo', 'orange');
 
        var layout = {
            title: 'Templos de Grepolis',
            width: 800,
            height: 800,
            xaxis: { title: 'Coordenada X' },
            yaxis: { title: 'Coordenada Y', autorange: 'reversed' },
            hovermode: 'closest'
        };
 
        // Asegúrate de que Plotly esté disponible en la ventana emergente
        graphWindow.onload = function() {
            Plotly.newPlot(graphWindow.document.getElementById('plotly-chart'), data, layout);
        };
    }
}
 
 
function subirAldeas(){
 
    function subirNiveles(ventanaAldea){
        var i = 0;
        function upgrade(){
            if (i <6 ){
                var botonUpgrade = ventanaAldea.children[ventanaAldea.children.length -1].children[0].children[0].children[1].children[1]
                var botonSiguiente = ventanaAldea.children[ventanaAldea.children.length -1].children[0].children[0].children[0].children[0]
                var intervalo1 = Math.floor(Math.random() * (350 - 250 + 1)) + 250;
                var intervalo2 = Math.floor(Math.random() * (350 - 250 + 1)) + 250;
                var intervalo = intervalo1 + intervalo2
                botonUpgrade.click();
 
                setTimeout(function(){
                    botonSiguiente.click();}, intervalo1)
 
                i++
                setTimeout(upgrade, intervalo)
            }
        }
        upgrade();
    }
 
 
    function ventanaAbiertaCallback(ventanaAldea){
        setTimeout(function(){
            var boton = ventanaAldea.children[ventanaAldea.children.length -1].children[0].children[0].children[1].children[0];
            var icono = document.createElement('img');
            icono.src = 'https://i.imgur.com/amVfFYs.png'
            icono.style.width = '90%';
            icono.style.marginLeft = '1px';
            boton.appendChild(icono);
            boton.addEventListener('click', function(){
                subirNiveles(ventanaAldea);
            });
        }, 1000);
    }
 
    // Crear un nuevo observador de mutaciones
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Verificar si se ha agregado algún nodo
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // Iterar sobre los nodos agregados
                mutation.addedNodes.forEach(function(node) {
                    // Verificar si el nodo agregado tiene la clase window_curtain
                    if (node.classList && node.classList.contains('window_curtain')) {
                        // Verificar si la ventana c1236 está como hijo de window_curtain
                        if(node.children[0].classList.contains("farm_town")){
                            // Ejecutar la función de callback
                            ventanaAbiertaCallback(node.children[0]);
                        }
                    }
                });
            }
        });
    });
 
    // Configurar opciones para el observador
    const config = { childList: true, subtree: true };
 
    // Observar cambios en el cuerpo del documento
    const body = document.body;
    if (body) {
        observer.observe(body, config);
    } else {
        console.error('No se encontró el cuerpo del documento');
    }
}
 
 
function porcentajeTropas(){
    setInterval(function(){
        var elemento = document.querySelector('.units_land');
        var contenedor = elemento.children[1].children[2];
        if (contenedor) {
            if (!document.getElementById('div-porcentaje')) {
                var div = document.createElement('div');
                div.id = 'div-porcentaje';
                div.className = 'nav';
 
                var span = document.createElement('span');
                span.className = 'text_shadow';
                span.style.fontWeight = '300';
                span.style.textAlign = "center";
                div.style.paddingTop = '5px';
                div.style.marginTop = '-2px';
 
                var texto = calcularPorcentajes();
                span.textContent = texto;
 
                div.appendChild(span);
                div.title = 'Porcentaje de tropas ofensivas y defensivas';
 
                contenedor.insertBefore(div, contenedor.firstChild);
            }
        }
    }, 1000);
    setInterval(function(){
        var elemento = document.querySelector('.units_land');
        var contenedor = elemento.children[1].children[2];
        if (contenedor) {
            if (!document.getElementById('div-porcentaje')) {
                var div = document.createElement('div');
                div.id = 'div-porcentaje';
                div.className = 'nav';
 
                var span = document.createElement('span');
                span.className = 'text_shadow';
                span.style.fontWeight = '300';
                span.style.textAlign = "center";
                div.style.paddingTop = '5px';
                div.style.marginTop = '-2px';
 
                var texto = calcularPorcentajes();
                span.textContent = texto;
 
                div.appendChild(span);
                div.title = 'Porcentaje de tropas ofensivas y defensivas';
 
                contenedor.insertBefore(div, contenedor.firstChild);
            }
        }
    }, 1000);
    function calcularPorcentajes(){
        var units = MM.getModels().Units
        var listaCiudades = []
        var total = 0;
        var sumaOff = 0;
        var sumaDeff = 0;
        var totalUnidades = {
            off: {
                catapult: 0,
                centaur: 0,
                fury: 0,
                griffin: 0,
                harpy: 0,
                manticore: 0,
                rider: 0,
                slinger: 0,
                ladon: 0,
                siren: 0,
                spartoi: 0,
 
            },
            deff: {
                archer: 0,
                bireme: 0,
                cerberus: 0,
                calydonian_boar: 0,
                chariot: 0,
                demolition_ship: 0,
                hoplite: 0,
                medusa: 0,
                minotaur: 0,
                pegasus: 0,
                satyr: 0,
                sea_monster: 0,
                sword: 0,
                trireme: 0,
                zyklop: 0
 
            }
        };
 
 
        for (var ciudad in ITowns.towns){
            listaCiudades.push(ciudad);
            // console.log(ciudad);
        }
        console.log(listaCiudades);
        for (var i in units) {
            var unit = units[i];
            if (listaCiudades.contains(unit.attributes.home_town_id) && listaCiudades.contains(unit.attributes.current_town_id) && unit.attributes.home_town_id == unit.attributes.current_town_id){
                for (var key in totalUnidades.off){
                    totalUnidades.off[key] += (unit.attributes[key] * GameData.units[key].population);
                    total += unit.attributes[key] * GameData.units[key].population;
                    sumaOff += unit.attributes[key] * GameData.units[key].population;
 
                }
                for (key in totalUnidades.deff){
                    totalUnidades.deff[key] += (unit.attributes[key] * GameData.units[key].population);
                    total += unit.attributes[key] * GameData.units[key].population;
                    sumaDeff += unit.attributes[key] * GameData.units[key].population;
                }
            }
        }
 
        var percDeff = Math.round((sumaDeff * 100) / total)
        var percOff = Math.round((sumaOff * 100) / total)
        var string = '⚔️ ' + percOff + '% | ' + percDeff + '% 🛡️';
 
        return string
    }
}
// FUNCIÓN PRINCIPAL
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
function main(){
    setTimeout(crearBotonMenu, 5000);
    if (ajustarMarcado){
        ajustes();
    }
    if (autoIndexarMarcado){
        autoIndexar()
    }
    if (botonAldeasMarcado){
        botonAldeas()
    }
    if (unidadesColaMarcado){
        unidadesCola()
    }
    if (filtroPulpoMarcado){
        filtroRadarPulpo()
    }
    if (generarListasMarcado){
        generarListasAlianzas();
    }
    if (generarPlantillasMarcado && mundoRevuelta){
        plantillas();
    }
    if (generarTemplosMarcado && finalOlimpo){
        generarMapaTemplos();
    }
    if (subirAldeasMarcado){
        subirAldeas();
    }
    if (porcentajeTropasMarcado){
        porcentajeTropas();
    }
}
 
// Llamar a la función directamente
 
main()
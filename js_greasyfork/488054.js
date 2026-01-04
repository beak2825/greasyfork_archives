// ==UserScript==
// @name         Ajustar Ataque con Heroe - MODIFICADO
// @author       Er Yandra
// @match      http://*.grepolis.com/game/*
// @match      https://*.grepolis.com/game/*
// @exclude      view-source://*
// @exclude      https://classic.grepolis.com/game/*
// @grant GM_setValue
// @grant GM_getValue
// @copyright    2022
// @description  Ajustar Ataque con Heroe - MODIFICADO.
// @version 0.0.3
// @namespace https://greasyfork.org/users/978964
// @downloadURL https://update.greasyfork.org/scripts/488054/Ajustar%20Ataque%20con%20Heroe%20-%20MODIFICADO.user.js
// @updateURL https://update.greasyfork.org/scripts/488054/Ajustar%20Ataque%20con%20Heroe%20-%20MODIFICADO.meta.js
// ==/UserScript==
//          _____                    _____                    _____                    _____
//         /\    \                  /\    \                  /\    \                  /\    \
//        /::\    \                /::\    \                /::\    \                /::\    \
//       /::::\    \              /::::\    \              /::::\    \              /::::\    \
//      /::::::\    \            /::::::\    \            /::::::\    \            /::::::\    \
//     /:::/\:::\    \          /:::/\:::\    \          /:::/\:::\    \          /:::/\:::\    \
//    /:::/  \:::\    \        /:::/__\:::\    \        /:::/__\:::\    \        /:::/__\:::\    \
//   /:::/    \:::\    \      /::::\   \:::\    \      /::::\   \:::\    \      /::::\   \:::\    \
//  /:::/    / \:::\    \    /::::::\   \:::\    \    /::::::\   \:::\    \    /::::::\   \:::\    \
// /:::/    /   \:::\    \  /:::/\:::\   \:::\    \  /:::/\:::\   \:::\____\  /:::/\:::\   \:::\    \
///:::/____/     \:::\____\/:::/__\:::\   \:::\____\/:::/  \:::\   \:::|    |/:::/  \:::\   \:::\____\
//\:::\    \      \::/    /\:::\   \:::\   \::/    /\::/    \:::\  /:::|____|\::/    \:::\  /:::/    /
// \:::\    \      \/____/  \:::\   \:::\   \/____/  \/_____/\:::\/:::/    /  \/____/ \:::\/:::/    /
//  \:::\    \               \:::\   \:::\    \               \::::::/    /            \::::::/    /
//   \:::\    \               \:::\   \:::\____\               \::::/    /              \::::/    /
//    \:::\    \               \:::\   \::/    /                \::/____/               /:::/    /
//     \:::\    \               \:::\   \/____/                  ~~                    /:::/    /
//      \:::\    \               \:::\    \                                           /:::/    /
//       \:::\____\               \:::\____\                                         /:::/    /
//        \::/    /                \::/    /                                         \::/    /
//         \/____/                  \/____/                                           \/____/

//SCRIPT TO TIMMING ATTACKS OR SUPPORT COMMANDS
var settingsTimming = GM_getValue("settingTimming", "Hora ajuste");
var additionValue = GM_getValue("additionValue", "Variable");
var myColor1 = GM_getValue('myColor1', 'green'); // Recupera el color guardado o usa "green" si no hay un color guardado previo
var myColor2 = GM_getValue('myColor2', 'blue'); // Recupera el color guardado o usa "blue" si no hay un color guardado previo
var myColor3 = GM_getValue('myColor3', 'fuchsia'); // Recupera el color guardado o usa "fuchsia" si no hay un color guardado previo
var myColor4 = GM_getValue('myColor4', 'red'); // Recupera el color guardado o usa "red" si no hay un color guardado previo


documentLoaded();
loadCSS();
observerAjax();
attachScript("moveFrame", moveFrame.toString())
moveFrame = new moveFrame;



function insertCheckboxForUnitSaving() {
    const attackWindow = document.querySelector('.attack_support_window');
    if (attackWindow && !document.getElementById('dio_tro')) {
        const checkboxHTML = `
            <div id="dio_tro" class="checkbox_new checked green" style="margin-bottom: 10px;">
                <div class="cbx_icon"></div>
                <div class="cbx_caption">Guardar selección de unidades</div>
            </div>`;
        attackWindow.insertAdjacentHTML('afterbegin', checkboxHTML);
        document.getElementById('dio_tro').addEventListener('click', toggleUnitSavingFeature);
    }
}


function toggleUnitSavingFeature() {
    const isChecked = document.getElementById('dio_tro').classList.contains('checked');
    if (isChecked) {
        document.getElementById('dio_tro').classList.remove('checked');
        GM_setValue('unitSavingEnabled', false);
    } else {
        document.getElementById('dio_tro').classList.add('checked');
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


function loadUnitSelections() {
    if (!GM_getValue('unitSavingEnabled', false)) {return;}

    const savedUnitSelections = JSON.parse(GM_getValue('savedUnitSelections', '{}'));
    Object.keys(savedUnitSelections).forEach(unitType => {
        const input = document.querySelector(`.unit_input[name="${unitType}"]`);

        if (input) {
            input.value = savedUnitSelections[unitType];
            input.dispatchEvent(new Event('change'));
        }
    });
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

function documentLoaded() {
    var interval = setInterval(function () {
        if (
            document.readyState === "complete" &&
            $(".tb_activities.toolbar_activities .middle")[0]
        ) {
            clearInterval(interval);
            loadbutton();
            var gameChange = new MutationObserver(function (mutations) {
            });
            gameChange.observe(document.getElementsByTagName("body")[0], {
                childList: true,
            });
            var commandsObserver = new MutationObserver(function (mutations) {
                commandsChange();
            });
            commandsObserver.observe(
                document.getElementById("toolbar_activity_commands_list"),
                { attributes: true, subtree: true }
            );
        }
    }, 100);
}

function commandsChange() {
    var foundAttack = false;
    var listaElementos;
    for (var listaObjetos of document.getElementsByClassName(
        "js-dropdown-item-list"
    )) {
        if (
            listaObjetos.childElementCount != 0 &&
            /movement/.test(listaObjetos.children[0].id)
        ) {
            foundAttack = true;
            listaElementos = listaObjetos;
            break;
        }
    }
    if (foundAttack && listaElementos.children != null) {
        for (var child of listaElementos.children) {
            if (child.children[0].children[1].children[2] == null) {
                var indicador = document.createElement("div");
                indicador.className = "indicatorAankomst";
                var tiempoTotal = Timestamp.toDate(child.dataset.timestamp);
                var tiempoHora = tiempoTotal.getHours();
                if (tiempoTotal.getHours() < 10)
                    tiempoHora = "0" + tiempoTotal.getHours();
                var tiempoMin = tiempoTotal.getMinutes();
                if (tiempoTotal.getMinutes() < 10)
                    tiempoMin = "0" + tiempoTotal.getMinutes();
                var tiempoSeg = tiempoTotal.getSeconds();
                if (tiempoTotal.getSeconds() < 10)
                    tiempoSeg = "0" + tiempoTotal.getSeconds();
                var tiempoInfo = tiempoHora + ":" + tiempoMin + ":" + tiempoSeg;
                indicadorTexto = document.createElement("p");
                indicadorTexto.innerHTML = tiempoInfo;
                indicador.appendChild(indicadorTexto);
                indicadorTexto.style.fontSize = "1.2em";
                indicadorTexto.style.fontWeight = "bold";
                var textoElemento = document.createElement("div");
                indicador.appendChild(textoElemento);
                child.children[0].children[1].appendChild(indicador);
                var tipo = indicador.parentNode
                tipo = tipo.parentNode.firstElementChild.getAttribute("class");
                tipo = tipo.search("support");
                let timestampIndicador = stringToTimestamp(indicadorTexto.textContent);
                let timestampAjuste = stringToTimestamp(settingsTimming);
                if (timestampIndicador == timestampAjuste) {


                    var dio = document.querySelector('#dio_plusmenuCommands');
                    if(dio){var botonX = dio.querySelector(".dio_plusback");
                    botonX.click();}else{$('#toolbar_activity_commands_list .cancel').click()}


                    indicadorTexto.style.color = myColor1, "green";
                    textoElemento.innerText = "\u2713";
                    textoElemento.style.fontWeight = "bold";
                    textoElemento.style.cssText = "margin-left: 0.3em; font-size: 1.3em; color: white; background-color: " + myColor1 + "; padding: 5px; text-align: center; margin-bottom: 5px; display: flex; align-items: center;";
                }
                else if(timestampIndicador >= timestampAjuste-additionValue && timestampIndicador < timestampAjuste) {
                    indicadorTexto.style.color = myColor2, "blue";
                    textoElemento.innerText = "\u2192";
                    textoElemento.style.fontWeight = "bold";
                    textoElemento.style.cssText = "margin-left: 0.3em; font-size: 1.3em; color: white; background-color: " + myColor2 + "; padding: 5px; text-align: center; margin-bottom: 5px; display: flex; align-items: center;";
                }
                else if(timestampIndicador-additionValue <= timestampAjuste && timestampIndicador > timestampAjuste) {
                    indicadorTexto.style.color = myColor3, "fuchsia";
                    textoElemento.innerText = "\u2190";
                    textoElemento.style.fontWeight = "bold";
                    textoElemento.style.cssText = "margin-left: 0.3em; font-size: 1.3em; color: black; background-color: " + myColor3 + "; padding: 5px; text-align: center; margin-bottom: 5px; display: flex; align-items: center;";
                }
                else {
                    indicadorTexto.style.color = myColor4, "red";
                    textoElemento.innerText = "\xAA";
                    textoElemento.style.fontWeight = "bold";
                    textoElemento.style.cssText = "margin-left: 0.3em; font-size: 1.3em; color: black; background-color: " + myColor4 + "; padding: 5px; text-align: center; margin-bottom: 5px; display: flex; align-items: center;";
                }
            }
        }
    }
}


function stringToTimestamp(dateString) { // DateString format => "hh:mm:ss"
    const divisions = dateString.split(":");
    let hora = parseInt(divisions[0], 10);
    let min = parseInt(divisions[1], 10);
    let seg = parseInt(divisions[2],10);
    return hora*3600 + min*60 +seg // Paso la fecha a segundos
}

function timestampToString(timestampLong) { // Lo mismo pero alveres
    let hora = timestampLong/3600;
    let min = (timestampLong%3600)/60;
    let seg = ((timestampLong%3600)%60);
    return hora.toString() + ":" + min.toString() + ":" + seg.toString() // Fecha de seg a fecha string formato "hh:mm:ss"
}

function loadbutton() {
    let icono = document.createElement("div");
    icono.id = "GMESetupLink";
    icono.className = "btn_settings circle_button";
    let img = document.createElement("div");
    img.style.margin = "6px 0px 0px 5px";
    img.style.width = "22px";
    img.style.height = "22px";
    img.style.backgroundSize = "100%";
    icono.style.top = "12px";
    icono.style.right = "485px";
    icono.style.zIndex = "10000";
    icono.appendChild(img);
    document.getElementById("ui_box").appendChild(icono);
    $("#GMESetupLink").click(hacerMenu);
}

function hacerMenu() {
    var existeVentana = false;
    var existeObjeto = null;
    for (var objeto of document.getElementsByClassName("ui-dialog-title")) {
        if (objeto.innerHTML == "Hora Ajuste") {
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
    wnd.setHeight(155);
    wnd.setWidth(210);
    wnd.setTitle("Hora Ajuste");
    var title = existeObjeto;
    var frame = title.parentElement.parentElement.children[1].children[4];
    frame.innerHTML = "";
    var html = document.createElement("html");
    var body = document.createElement("div");
    var head = document.createElement("head");
    element = document.createElement("h3");
    element.innerHTML = "";
    body.appendChild(element);
    var list = document.createElement("ul");
    list.appendChild(document.createElement("hr"));
    hacerCajaTexto(list, settingsTimming, "settingTimming", 100);
    hacerCajaTexto(list, additionValue, "additionValue", 100);
    var savebutton = crearBoton("settings_reload", "Guardar");
    savebutton.style.position = "relative";
    savebutton.style.bottom = "0";
    savebutton.style.right = "10";
    body.appendChild(savebutton);
    var WebButton = crearBoton("colores", "LISTA");
    WebButton.style.position = "relative";
    WebButton.style.bottom = "0";
    WebButton.style.right = "150";
    body.appendChild(WebButton);
    var listitem = document.createElement("div");
    listitem.style.position = "absolute";
    listitem.style.top = "0";
    listitem.style.right = "0";
    body.appendChild(listitem);
    element.style.position = "absolute";
    element.style.bottom = "0";
    element.style.left = "0";
    element.style.marginBottom = "0";
    element.style.lineHeight = "1";
    list.appendChild(element);
    body.appendChild(list);
    html.appendChild(head);
    html.appendChild(body);
    frame.appendChild(html);
    $(".Hora Ajuste").click(function () {
        wisselInstelling(this);
    });
    $("#settings_reload").click(function () {
        GM_setValue("settingTimming", $("#settingTimming").val());
        GM_setValue("additionValue", $("#additionValue").val());
        window.location.reload();
    });
    WebButton.addEventListener("click", function() {
    window.open("https://www.w3schools.com/tags/ref_colornames.asp");
});
    var ColorButton1 = crearBoton1("color", "C1");
    ColorButton1.style.position = "absolute";
    ColorButton1.style.bottom = "10";
    ColorButton1.style.right = "10";
    body.appendChild(ColorButton1);
    ColorButton1.addEventListener('click', function() {
     var selectedColor = prompt('Ataque AJUSTADO al segundo indicado.\nEscribe un color de la lista. Ejemplo: AliceBlue.');
     if (selectedColor) {
         GM_setValue('myColor1', selectedColor);
         myColor1 = selectedColor;
     }
    });
    var ColorButton2 = crearBoton1("color", "C4");
    ColorButton2.style.position = "relative";
    ColorButton2.style.bottom = "10";
    ColorButton2.style.right = "10";
    body.appendChild(ColorButton2);
    ColorButton2.addEventListener('click', function() {
     var selectedColor = prompt('Ataque NO AJUSTADO y fuera de la variable.\nEscribe un color de la lista. Ejemplo: AliceBlue.');
     if (selectedColor) {
         GM_setValue('myColor4', selectedColor);
         myColor4 = selectedColor;
     }
    });
    var ColorButton3 = crearBoton1("color", "C3");
    ColorButton3.style.position = "relative";
    ColorButton3.style.bottom = "10";
    ColorButton3.style.right = "10";
    body.appendChild(ColorButton3);
    ColorButton3.addEventListener('click', function() {
     var selectedColor = prompt('Ataque DESPUÉS del segundo indicado y antes de la variable.\nEscribe un color de la lista. Ejemplo: AliceBlue.');
     if (selectedColor) {
         GM_setValue('myColor3', selectedColor);
         myColor3 = selectedColor;
     }
    });
    var ColorButton4 = crearBoton1("color", "C2");
    ColorButton4.style.position = "relative";
    ColorButton4.style.bottom = "10";
    ColorButton4.style.right = "10";
    body.appendChild(ColorButton4);
    ColorButton4.addEventListener('click', function() {
     var selectedColor = prompt('Ataque ANTES del segundo indicado y despues de la variable.\nEscribe un color de la lista. Ejemplo: AliceBlue.');
     if (selectedColor) {
         GM_setValue('myColor2', selectedColor);
         myColor2 = selectedColor;
     }
    });

}
function crearBoton(id, text) {
    var element = document.createElement("div");
    element.className = "button_new";
    element.id = id;
    element.style.margin = "2px";
    var childElement = document.createElement("div");
    childElement.className = "left";
    element.appendChild(childElement);
    childElement = document.createElement("div");
    childElement.className = "right";
    element.appendChild(childElement);
    childElement = document.createElement("div");
    childElement.className = "caption js-caption";
    childElement.innerHTML = text + '<div class="effect js-effect"></div>';
    element.style.float = "left";
    element.appendChild(childElement);
    return element;
}

function crearBoton1(id, text) {
    var element = document.createElement("div");
    element.className = "button_new";
    element.id = id;
    element.style.margin = "0px";
    var childElement = document.createElement("div");
    childElement.className = "left";
    element.appendChild(childElement);
    childElement = document.createElement("div");
    childElement.className = "right";
    element.appendChild(childElement);
    childElement = document.createElement("div");
    childElement.className = "caption js-caption";
    childElement.innerHTML = text + '<div class="effect js-effect"></div>';
    element.style.float = "right";
    element.appendChild(childElement);
    return element;
}

function hacerCajaTexto(list, setting, id, width) {
    var listitem = document.createElement("div");
    listitem.className = "textbox";
    listitem.style.width = width + "px";
    if (setting == null) setting = "";
    listitem.innerHTML =
        '<div class="left"></div><div class="right"></div><div class="middle"><div class="ie7fix"><input tabindex="1" id="' +
        id +
        '" value="' +
        setting +
        '" size="10" type="text"></div></div>';
    list.appendChild(listitem);
}

function loadCSS() {
    var css = document.createElement('style');
    var style='.sandy-box .item.command{   height: 54px !important;}.indicatorAankomst {	color: rgba(0, 0, 0, 0.5) ;	font-size: xx-small ;   position: relative;   display: flex;   line-height: 0px;}'
    css.appendChild(document.createTextNode(style));
    document.getElementsByTagName("head")[0].appendChild(css);
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

function attachScript(f, A) {
    var c = document.createElement("script");
    c.type = "text/javascript";
    c.id = f;
    c.textContent = A;
    document.body.appendChild(c);
}

function unidadMandada() {
    try{var boton = document.getElementById('btn_attack_town');}catch{}
    if (!boton){boton = document.querySelector('.button');}
    boton.style.position = 'relative';
    boton.style.left = '325px';
    boton.style.top = '-285px';
}

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

                break;
            case "/town_info/support":
                unidadMandada();
                insertCheckboxForUnitSaving();
                attachListeners();

                break;
        }
    });
}
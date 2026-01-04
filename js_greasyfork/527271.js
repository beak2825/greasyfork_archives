// ==UserScript==
// @name         Ajustar Ataque Auto
// @author       Lanuevasepia
// @include      http://*.grepolis.com/game/*
// @include      https://*.grepolis.com/game/*
// @exclude      view-source://*
// @exclude      https://classic.grepolis.com/game/*
// @grant GM_setValue
// @grant GM_getValue
// @copyright    2024
// @description  Ajustar Ataque Auto...
// @version 0.0.2
// @namespace https://greasyfork.org/users/978964// @downloadURL https://update.greasyfork.org/scripts/486764/Ajustar%20Ataque%20Auto.user.js// @updateURL https://update.greasyfork.org/scripts/486764/Ajustar%20Ataque%20Auto.meta.js
// @downloadURL https://update.greasyfork.org/scripts/527271/Ajustar%20Ataque%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/527271/Ajustar%20Ataque%20Auto.meta.js
// ==/UserScript==

//SCRIPT TO TIMMING ATTACKS OR SUPPORT COMMANDS
var settingsTimming = GM_getValue("settingTimming", 0);
documentLoaded();
loadCSS();
observerAjax();
attachScript("moveFrame", moveFrame.toString())
moveFrame = new moveFrame;

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
												
                if (tiempoHora < 10) tiempoHora = "0" + tiempoHora;
                var tiempoMin = tiempoTotal.getMinutes();
												  
                if (tiempoMin < 10) tiempoMin = "0" + tiempoMin;
                var tiempoSeg = tiempoTotal.getSeconds();
												  
                if (tiempoSeg < 10) tiempoSeg = "0" + tiempoSeg;
                var tiempoInfo = tiempoHora + ":" + tiempoMin + ":" + tiempoSeg;
                indicadorTexto = document.createElement("p");
                indicadorTexto.innerHTML = tiempoInfo;
                indicador.appendChild(indicadorTexto);
                indicadorTexto.style.fontSize = "1.2em";
                indicadorTexto.style.fontWeight = "bold";
                var indicatorAjuste = document.createElement("div");
                indicador.appendChild(indicatorAjuste);
                child.children[0].children[1].appendChild(indicador);
                var tipo = indicador.parentNode
                tipo = tipo.parentNode.firstElementChild.getAttribute("class");
                tipo = tipo.search("support");
                if (tipo != -1) {
                    if (indicadorTexto.textContent != settingsTimming) {
                        indicadorTexto.style.color = "red";
                        indicatorAjuste.setAttribute("style", "width:1em;background:red;margin-left: 0.3em;");
                    }
                    else {
                        indicadorTexto.style.color = "green";
                        indicatorAjuste.setAttribute("style", "width:1em;background:green;margin-left: 0.3em;");
                    }
                }
                else {
                    let posi = (settingsTimming.substring(settingsTimming.length - 2, settingsTimming.length));
                    var resultado = settingsTimming.substring(0, settingsTimming.length - 2);
                    if (posi == "00") {
                        posi = 59;
                        resultado = (resultado.substring(0, resultado.length - 3)) + (resultado.substring(resultado.length - 3, resultado.length - 1) - 1) + ":"
                    }
                    else {
                        if (posi.substring(0, 1) == "0") {
                            posi = "0" + ((posi.substring(1, posi.length)) - 1)
                        }
                        else {
                            if (posi == 10) {
                                posi = "09"
                            }
                            else {
                                posi = posi - 1;
                            }
                        }
                    }
                    let ataque = resultado + posi;
                    if (indicadorTexto.textContent != ataque) {
                        indicadorTexto.style.color = "red";
                        indicatorAjuste.setAttribute("style", "width:1em;background:red;margin-left: 0.3em;");
                    }
                    else {
                        indicadorTexto.style.color = "green";
                        indicatorAjuste.setAttribute("style", "width:1em;background:green;margin-left: 0.3em;");
                    }
                }
            }
        }
    }
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
        if (objeto.innerHTML == "Hora del colono") {
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
    wnd.setHeight(document.body.scrollHeight / 2 + 100);
    wnd.setTitle("Hora del colono");
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
    hacerCajaTexto(list, settingsTimming, "settingTimming", 400);
    var savebutton = crearBoton("settings_reload", "Guardar");
    savebutton.style.position = "absolute";
    savebutton.style.bottom = "0";
    savebutton.style.right = "0";
    body.appendChild(savebutton);
    var listitem = document.createElement("div");
    listitem.innerHTML =
        '<form action="" method="post" target="_blank"><input type="hidden" name="cmd" value="_s-xclick" /><input type="hidden" name="hosted_button_id" value="SRWYLPSZ2UG84" /><input type="image" src= border="0" name="submit"" border="0" src="" width="1" height="1" /></form>';
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
    $(".Hora del colono").click(function () {
        wisselInstelling(this);
    });
    $("#settings_reload").click(function () {
        GM_setValue("settingTimming", $("#settingTimming").val());
        window.location.reload();
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

    //FUNCIONES ORIGINALES DEL SCRIPT
    /*var boton = document.getElementById('btn_attack_town');
    //boton.style.position = 'absolute';
    //boton.style.left = '90%';
    //boton.style.top = '25%';*/

    //FUNCIONES COPIADAS Y PEGADAS DEL ANTERIOR SCRIPT. ESTO HACE QUE EL BOTON DE ATACAR Y REFORZAR ESTÉN EN EL MISMO SITIO
        $('<style>' +
        '.attack_support_window .send_units_form .button_wrapper { text-align:left; padding-left:1px; }' +
        '#gt_delete { display: none; }' +
        '.attack_support_window .additional_info_wrapper .town_info_duration_pos_alt { min-height: 50px; } ' +
        '.attack_support_window .additional_info_wrapper .town_info_duration_pos { min-height: 62px!important; } ' +
        '</style>').appendTo($('.attack_support_window').parent());
    $('.attack_table_box').remove();
    $('.breaker').remove()
}

function observerAjax() {
    $(document).ajaxComplete(function (e, xhr, opt) {
        var url = opt.url.split("?"), action = "";
        if (typeof (url[1]) !== "undefined" && typeof (url[1].split(/&/)[1]) !== "undefined") {
            action = url[0].substr(5) + "/" + url[1].split(/&/)[1].substr(7);
        }
        switch (action) {
            case "/town_info/attack":
            case "/town_info/support":
                unidadMandada();
                break;
        }
    });
}
$(document).ajaxComplete(function (e, xhr, opt) {
    try {
        var url = opt.url.split("?"), action = "";
        if (typeof (url[1]) !== "undefined" && typeof (url[1].split(/&/)[1]) !== "undefined") {
            action = url[0].substr(5) + "/" + url[1].split(/&/)[1].substr(7);
        }
        console.log(action)
        switch (action) {
            case "/report/view":
                setTimeout(function () {
                    let btnIndexar = document.getElementById("gd_index_rep_txt");
                    console.log(btnIndexar)
                    if (btnIndexar!=null) {
                        btnIndexar.click();
                    }
                }, 100);
                break;
        }
    } catch (error) {
        console.log(error)
    }
});
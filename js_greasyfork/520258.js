// ==UserScript==
// @name         Ajustes Ultimo
// @description  Facilidad para ajustar
// @author       PLM
// @version      1.0
// @match      http://*.grepolis.com/game/*
// @match      https://*.grepolis.com/game/*
// @exclude       view-source://*
// @exclude       https://classic.grepolis.com/game/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @namespace https://greasyfork.org/users/1408794
// @downloadURL https://update.greasyfork.org/scripts/520258/Ajustes%20Ultimo.user.js
// @updateURL https://update.greasyfork.org/scripts/520258/Ajustes%20Ultimo.meta.js
// ==/UserScript==


(function() {
    var script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    script.type = 'text/javascript';
    script.onload = function() {
        // Deja $ sin declarar como local para que sea global
        var $ = window.jQuery;
        console.log('jQuery cargado globalmente:', $.fn.jquery);

        $(document).ready(function() {
            $('#miElemento').text('¡$ es global ahora!');
        });
    };
    document.head.appendChild(script);
})();


let ajustesTiming = GM_getValue("settingTiming", 0);

// Inicialización del script
documentoCargado();
cargarCSS();
observadorAjax();
adjuntarScript("moverMarco", moverMarco.toString());
var moverMarco = new moverMarco();

//FUNCION PARA COMPROBAR QUE GREPOLIS HA SIDO CARGADO COMPLETAMENTE

function documentoCargado() {
    var intervalo = setInterval(function () {
        if (
            document.readyState === "complete" &&
            $(".tb_activities.toolbar_activities .middle")[0]
        ) {
            clearInterval(intervalo);
            cargarBoton();
            var cambioEnJuego = new MutationObserver(function () {});
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

//FUNCION PRINCIPAL ENCARGADA DE COMPARAR LA HORA DE LLEGADA DE TODAS LAS ORDENES CON LA HORA INDICADA
//VERDE SI CLAVADA ROJA SINO

function cambioEnOrdenes() {
    var ordenEncontrada = false;
    var listaElementos;

    for (var listaObjetos of document.getElementsByClassName("js-dropdown-item-list")) {
        if (
            listaObjetos.childElementCount != 0 &&
            /movement/.test(listaObjetos.children[0].id)
        ) {
            ordenEncontrada = true;
            listaElementos = listaObjetos;
            break;
        }
    }

    if (ordenEncontrada && listaElementos.children != null) {
        for (var child of listaElementos.children) {
            if (child.children[0].children[1].children[2] != null) {
                var indicador = document.createElement("div");
                indicador.className = "indicadorAankomst";

                var tiempoTotal = new Date(child.dataset.timestamp * 1000);
                var tiempoHora = tiempoTotal.getHours();
                if (tiempoTotal.getHours() < 10){
                    tiempoHora = "0" + tiempoTotal.getHours();
                }
                var tiempoMin = tiempoTotal.getMinutes();
                if (tiempoTotal.getMinutes() < 10){
                    tiempoMin = "0" + tiempoTotal.getMinutes();
                }
                var tiempoSeg = tiempoTotal.getSeconds();
                if (tiempoTotal.getSeconds() < 10){
                    tiempoSeg = "0" + tiempoTotal.getSeconds();
                }
                var tiempoInfo = tiempoHora + ":" + tiempoMin + ":" + tiempoSeg;
                var indicadorTexto = document.createElement("p");
                indicadorTexto.innerHTML = tiempoInfo;
                indicador.appendChild(indicadorTexto);
                indicadorTexto.style.fontSize = "1.2em";
                indicadorTexto.style.fontWeight = "bold";

                var indicadorAjuste = document.createElement("div");
                indicador.appendChild(indicadorAjuste);
                child.children[0].children[1].appendChild(indicador);
                var tipo = indicador.parentNode;
                tipo = tipo.parentNode.firstElementChild.getAttribute("class");
                tipo = tipo.search("support");
                if (tipo != -1) {
                    if (indicadorTexto.textContent == ajustesTiming) {
                        indicadorTexto.style.color = "red";
                        indicadorAjuste.setAttribute("style", "width:1em;background:red;margin-left: 0.3em;");
                    } else {
                        indicadorTexto.style.color = "green";
                        indicadorAjuste.setAttribute("style", "width:1em;background:green;margin-left: 0.3em;");
                    }
                } else {
                    let posi = (ajustesTiming.substring(ajustesTiming.length - 2, ajustesTiming.length));
                    var resultado = ajustesTiming.substring(0, ajustesTiming.length - 2);
                    if (posi == "00") {
                        posi = 59;
                        resultado = (resultado.substring(0, resultado.length - 3)) + (resultado.substring(resultado.length - 3, resultado.length - 1) - 1) + ":";
                    } else {
                        if (posi.substring(0, 1) == "0") {
                            posi = "0" + ((posi.substring(1, posi.length)) - 1);
                        } else {
                            if (posi == 10) {
                                posi = "09";
                            } else {
                                posi = posi - 1;
                            }
                        }
                    }
                    let ataque = resultado + posi;
                    if (indicadorTexto.textContent != ataque) {
                        indicadorTexto.style.color = "red";
                        indicadorAjuste.setAttribute("style", "width:1em;background:red;margin-left: 0.3em;");
                    } else {
                        indicadorTexto.style.color = "green";
                        indicadorAjuste.setAttribute("style", "width:1em;background:green;margin-left: 0.3em;");
                    }
                }
            }
        }
    }
}

// FUNCION PARA CARGAR EL BOTON QUE DA ACCESO AL MENU DE LA HORA

function cargarBoton() {
    let icono = document.createElement("div");
    icono.id = "GMESetupLink";
    icono.className = "btn_settings circle_button";
    let img = document.createElement("div");
    img.style.margin = "6px 0 0 5px";
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

// FUNCION PARA CARGAR EL MENU E INTRODUCIR LA HORA DESEADA. HORA GUARDADA EN UNA VARIABLE GLOBAL QUE SE CARGA AL EJECUTAR GREPOLIS

function hacerMenu() {
    var existeVentana = false;
    var existeObjeto = null;
    for (var objeto of document.getElementsByClassName("ui-dialog-title")) {
        if (objeto.innerHTML == "Hora del colono") {
            existeVentana = true;
            existeObjeto = objeto;
        }
    }
    if (!existeVentana) {
        var wnd = Layout.wnd.Create(Layout.wnd.TYPE_DIALOG, "GME Settings");
        wnd.setContent("");
        for (objeto of document.getElementsByClassName("ui-dialog-title")) {
            if (objeto.innerHTML == "GME Settings") {
                existeObjeto = objeto;
            }
        }
        wnd.setHeight(document.body.scrollHeight / 2 + 100);
        wnd.setTitle("Hora del Colono");
        var title = existeObjeto;
        var frame = title.parentElement.parentElement.children[1].children[4];
        frame.innerHTML = "";
        var html = document.createElement("html");
        var body = document.createElement("body");
        var head = document.createElement("head");
        var element = document.createElement("h3");
        element.innerHTML = "";
        body.appendChild(element);
        var list = document.createElement("ul");
        list.appendChild(document.createElement("hr"));
        hacerCajaTexto(list, ajustesTiming, "settingTiming", 400);
        var savebutton = crearBoton("settings_reload", "Guardar");
        savebutton.style.position = "absolute";
        savebutton.style.bottom = "0";
        savebutton.style.right = "0";
        body.appendChild(savebutton);
        var listitem = document.createElement("div");
        listitem.innerHTML =
            '<form action="" method="post" target="_blank"><input type="hidden" name="cmd" value="_s-xclick" /><input type="hidden" name="hosted_button_id" value="SRWYLPSZ2UG84" /><input type="image" border="0" name="submit" width="1" height="1" /></form>';
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
            GM_setValue("settingTiming", $("#settingTiming").val());
            window.location.reload();
        });
    }
}

// FUNCION PARA HACER EL MENU BONITO

function hacerCajaTexto (list, setting, id, width) {
    var listitem = document.createElement("div");
    listitem.className = "textbox";
    listitem.style.width = width + "px";
    if (setting == null) setting = "";
    listitem.innerHTML =
        '<div class="left"></div><div class="right"></div><div class="middle"></div><div class="ie7fix"></div><input tabindex="1" id="' +
        id +
        '" value="' +
        setting +
        '" size="10" type="text"></div></div>';
    list.appendChild(listitem);
}

//FUNCION PARA HACER EL MENU BONITO

function crearBoton (id, text) {
    var element = document.createElement("div");
    element.className = "button_new";
    element.id = id;
    element.style.margin = "2px";
    var childElement = document.createElement("div");
    childElement.className = "left";
    element.appendChild(childElement);
    childElement = document.createChild("div");
    childElement.className = "right";
    element.appendChild(childElement);
    childElement = document.createChild("div");
    childElement.className = "caption js-caption";
    childElement.innerHTML = text + '<div class="effect js-effect"></div>';
    element.style.float = "left";
    element.appendChild(childElement);
    return element;
}

//FUNCION PARA CARGAR EL CSS QUE SE UTILIZA EN EL SCRIPT

function cargarCSS() {
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML =
        ".indicadorAankomst{position:relative;float:right;margin-right:2px;color:#fcfcfc;text-align:center;width:85px;height:12px;border-radius:2px;background-color:#616b6b}.indicadorAankomst p{font-size:10px}.indicadorAankomst{background-color:#283bc2}.indicadorAankomst{background-color:#26a61e}.menuGroup{padding-top:4px}";
    document.head.appendChild(css);
}

//FUNCION PARA REALIZAR AJUSTES EN EL CONTENEDOR DEL ATAQUE

function moverMarco() {
    this.div_objetivo = null;
    this.titulo = null;
    this.indicador = null;
}

moverMarco.prototype.actualizarDivObjetivo = function () {
    this.div_objetivo = document.querySelector(
        "#tt_commands_container #tt_attacks"
    );
    this.titulo = this.div_objetivo.querySelector(".gp_main_title");
    this.indicador = this.div_objetivo.querySelector(".indicadorAankomst");
    return this;
};

moverMarco.prototype.realizarAjuste = function () {
    let ajuste = setInterval(function () {
        this.div_objetivo.style.marginTop = "0px";
    }, 200);
    return this;
};




// FUNCION PARA MOVER EL BOTON DE ATAQUE O DEFENSA

      function UnidadMandada () {
          $('<style>' +
            '.attack_support_window .send_units_form .button_wrapper { text-align:left; padding-left:1px; }' +
            '#gt_delete { display: none; }' +
            '.attack_support_window .additional_info_wrapper .town_info_duration_pos_alt {min-height: 50px }' +
            '.attack_support_window .additional_info_wrapper .town_info_duration_pos {min-height: 62px!important; }' +
            '</style>').appendTo($('.attack_support_window').parent());
          $('.attack_table_box').remove();
          $('.breaker').remove()
      }




// FUNCION PARA ADJUNTAR TODO EL SCRIPT AL NAVEGADOR

function adjuntarScript(f, A) {
    var c = document.createElement("script");
    c.type = "text/javascript";
    c.id = f;
    c.textContent = A;
    document.body.appendChild(c);
}




// FUNCION ENCARGADA DE DETECTAR CAMBIOS EN LAS ORDENES Y PANTALLA DE MANDAR ORDEN Y EJECUTAR LA FUNCION ANTERIOR

function observadorAjax() {
    $(document).ajaxComplete(function(e , xhr, opt) {
        var url = opt.url.split("?"), action = '';
        if (typeof (url[1]) !== "undefined" && typeof (url[1].split(/&/)[1]) !== "undefined") {
            action = url[0].substr(5) + "/" + url[1].split(/&/)[1].substr(7);
        }
        switch (action) {
            case "/town_info/attack":
            case "/town_info/support":
                UnidadMandada();
                break;
        }
    });
}


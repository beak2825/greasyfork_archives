// ==UserScript==
// @name          Gladiatus Tools
// @namespace     https://greasyfork.org/users/904482
// @version       0.11.0
// @description   Set of tools and aids for the game Gladiatus
// @author        lpachecob
// @grant         none
// @match         *.gladiatus.gameforge.com/game/index.php*
// @icon          https://cdn.jsdelivr.net/gh/lpachecob/Gladiatus-Tools@main/images/favicon.ico
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/444338/Gladiatus%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/444338/Gladiatus%20Tools.meta.js
// ==/UserScript==


//global variables
const getURL = window.location.search.split("&");
const oro = parseInt(document.getElementById("sstat_gold_val").innerText.replace(/\./g, ''));

var dobleClickEvent = document.createEvent('MouseEvents');
dobleClickEvent.initEvent('dblclick', true, true);

let sh = {
    get : ()=>{
        for (let element of getURL) {
            if(element.includes("sh") == true){
                return element;
            }
        }
    }
}
class GladiatusTools{
    static SetTool(){
        const mainMenu = document.getElementById("mainmenu");
        if (getURL[0] == "?mod=guildMarket" &&	getURL[1] != "submod=control") {
            Mercado.Run();
        } else if (getURL[0] == "?mod=guildMarket" && getURL[1] == "submod=control") {
            //comming soon
        } else if (getURL[0] == "?mod=auction") {
            AcutionHouseTools();
        } else if (getURL[0] == "?mod=forge" && getURL[1] == "submod=smeltery") {
            SmelteryTimeSaverExtension();
        } else if (getURL[0] == "?mod=forge" && getURL[1] == "submod=forge") {
            Herreria.run();
        }else if(getURL[0] == "?mod=packages"){
            Paquetes.UI();
            Paquetes.MoverFiltros();
            Paquetes.ExtendsInput();
            Paquetes.AbrirdesdeMercado();
        }
    }
    static Run(){
        Menu.Dibujar();
        GladiatusTools.SetTool();
        Notificaciones.Rotativos();
        GuardarOro.Run();
        ExtenderBotones.Paquetes();
        OuterLinks.run();
        window.addEventListener("load", () => {
            localStorage.TimeSaverExist = TimeSaver.Exist();
            TimeSaver.setKeyForStop(JSON.parse(localStorage.TimeSaverExist));
            TimeSaver.StopOnKey();
            TimeSaver.StopOnClick();
            TimeSaver.cambiarInterfaz();
            TimeSaver.Touch();
        });
    }
}

class insertOnPage{
    // Antes que el propio elemento.
    static beforebegin(object, html){
        object.insertAdjacentHTML("beforebegin", html);
    }
    //Justo dentro del elemento, antes de su primer elemento hijo.
    static afterbegin(object, html){
        object.insertAdjacentHTML("afterbegin", html);
    }
    //Justo dentro del elemento, después de su último elemento hijo.
    static beforeend(object, html){
        object.insertAdjacentHTML("beforeend", html);
    }
    //Después del propio elemento.
    static afterend(object, html){
        object.insertAdjacentHTML("afterend", html);
    }
}

class Observer{
    static ForRemovedNodes(ItemForWait, instructions){
        const observer = new MutationObserver((mutationList) => {
            mutationList.forEach((mutation)=> {
                if(mutation.removedNodes.length){
                    this.instructions();

                }
            })
        });
        // Opcions para el observer
        const observerOptions = {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: false,
            attributeOldValue: false,
            characterDataOldValue: false
        };
        observer.observe(ItemForWait, observerOptions);
    }
}

class Formatter{
    static abbreviateNumber(number){
        var SI_SYMBOL = ["", "k", "kk", "kkk", "kkkk", "kkkkk", "kkkkkk"];

        // what tier? (determines SI symbol)
        var tier = Math.log10(Math.abs(number)) / 3 | 0;

        // if zero, we don't need a suffix
        if(tier == 0) return number;

        // get suffix and determine scale
        var suffix = SI_SYMBOL[tier];
        var scale = Math.pow(10, tier * 3);

        // scale the number
        var scaled = number / scale;

        // format number and add suffix
        return scaled.toFixed(1) + suffix;
    }
}

class OuterLinks{
    static GTools(){
        if(!!document.getElementById("gca_shortcuts_bar")){
            let gca_shortcuts_bar = document.getElementById("gca_shortcuts_bar");
            gca_shortcuts_bar.insertAdjacentHTML("beforeend", `<div class="icon-out"><a class="icon gtools-icon" href="https://es.gladiatus-tools.com/" title="Ir a Gladiatus Tools" target="_blank"></a></div>`)
        }
    }
    static run(){
        OuterLinks.GTools();
    }
}

class Menu{
    static Dibujar(){
        document.body.insertAdjacentHTML("afterbegin",`

            <button id="MenuOpen" title="𝗖𝗢𝗡𝗙𝗜𝗚𝗨𝗥𝗔𝗖𝗜𝗢𝗡\nGLADIATUS TOOLS" class="btnMenu"> <img style="height: 112px;" src="https://cdn.jsdelivr.net/gh/lpachecob/Gladiatus-Tools@main/images/favicon.ico"></button>
            <div id="menuSidenav" class="menutools">
                 <h1>Configuración</h1>
                 <hr/>
                 <a id="CloseMenu" href="#" class="closebtn">&times;</a>
                 <div id="menuContent"></div>
            </div>
            `);
        let menuOpen = document.getElementById("MenuOpen");
        menuOpen.addEventListener("click", Menu.openNav);
        menuOpen.addEventListener("touchstart",Menu.openNav);
        let closeMenu = document.getElementById("CloseMenu");
        closeMenu.addEventListener("click", Menu.closeNav);


    }
    static openNav() {
        document.getElementById("menuSidenav").style.display = "block";
    }

    static closeNav() {
        document.getElementById("menuSidenav").style.display = "none";
    }
    static addConfig(html){
        html+= "<hr/>"
        insertOnPage.beforeend(document.getElementById("menuContent"),html);
    }
}

class Notificaciones{
    static Rotativos(){
        Menu.addConfig(`
        <h2>Notificaciones</h2>
        <ul>
            <label><input type="checkbox" id="NotificarOro" style=""> Notifica si tengo oro para guardar</label>
        </ul>
        <ul id="MontosNotificar" style="display: flex;background-color: white;width: 324px;height: auto;margin-left: 43px;padding: 6px;flex-direction: row;flex-wrap: wrap;">
           <input type="number" title="Presiona ENTER para guardar." id="InputNotificarOro" placeholder="Oro" style="background-color: #bebebe;color: white;font-weight: bold;font-size: 12px;width: 79px;height: 23px;">
        </ul>

        `);

        let MontosNotificar = document.getElementById("MontosNotificar");
        let InputNotificarOro = document.getElementById("InputNotificarOro");
        let MontosGuardados = [];

        if(localStorage.MontosGuardados == undefined){
        localStorage.MontosGuardados = '["100000"]';
        }else{
        MontosGuardados = JSON.parse(localStorage.MontosGuardados)
        }

        InputNotificarOro.addEventListener("keypress",(input)=>{
            if (input.key === 'Enter') {
                if (!MontosGuardados.includes(InputNotificarOro.value) && InputNotificarOro.value != "") {
                    MontosGuardados.push(InputNotificarOro.value);
                    InputNotificarOro.value = "";
                    localStorage.MontosGuardados = JSON.stringify(MontosGuardados.sort(function(a, b){return a - b}));
                    window.location.reload()
                }
            }
        });

        let NotificarOro = document.getElementById("NotificarOro"); //.checked indica si está activo o no
        if (localStorage.NotificarOro == undefined) {
            localStorage.NotificarOro = NotificarOro.checked
        } else {
            NotificarOro.checked = JSON.parse(localStorage.NotificarOro);
        }
        NotificarOro.addEventListener("change", () => {
            localStorage.NotificarOro = NotificarOro.checked;
            location.reload();
        })

        if (JSON.parse(localStorage.NotificarOro) == true) {
            Notificaciones.Mensaje();
            Notificaciones.MostrarRotativosSeleccionados();
            Notificaciones.EliminarRotativo();
        }

    }
    static Mensaje(){
        let MontosGuardados = JSON.parse(localStorage.MontosGuardados);
        let mensaje = "";

        for(let monto of MontosGuardados){
            if (Math.floor(oro / monto) >= 2) {
                mensaje += `Empaqueta ` + Math.floor(oro / monto) + ` rotativos de `+ Formatter.abbreviateNumber(monto)+`\n`;
            } else if (Math.floor(oro / monto) == 1) {
                mensaje += `Empaqueta ` + Math.floor(oro / monto) + ` rotativo de `+ Formatter.abbreviateNumber(monto)+`\n`;
            }
        }

        if (mensaje != "") {
            document.getElementById("mmonetbar").insertAdjacentHTML("beforeend",`
                <a href="game/index.php?mod=guildMarket" style="display: contents;">
                    <div id="testnoti" class="notification-box notification-info" style="position: fixed;right: 0px;"><div class="icon"></div>` + mensaje + `</div>
                </a>`);
        }

    }
    static MostrarRotativosSeleccionados(){
        let MontosGuardados = JSON.parse(localStorage.MontosGuardados);
        let indiceDeRotativoBorrar;
        let MontosNotificar = document.getElementById("MontosNotificar");
        let contador = 0;
        for(let monto of MontosGuardados){
            insertOnPage.beforeend(MontosNotificar,`
               <div style="border-style: groove;color: black;width: fit-content;padding: 2px;font-size: 12px;">
                   `+Formatter.abbreviateNumber(monto)+`
                   <button name="NotificaRotativoBorrar" data-index="`+contador+`" style="color: red;font-weight: bold;font-size: 16px;border: none;background: none;">x</button>
               </div>
           `)
            contador++;
        }
    }
    static EliminarRotativo(){
        let MontosGuardados = JSON.parse(localStorage.MontosGuardados);
        let NotificaRotativoBorrar = document.getElementsByName("NotificaRotativoBorrar")
        for (let boton of NotificaRotativoBorrar) {
            boton.addEventListener("click",()=>{
                MontosGuardados.splice(boton.attributes[1].value,1)
                localStorage.MontosGuardados = JSON.stringify(MontosGuardados.sort(function(a, b){return a - b}));
                window.location.reload()
            })
            boton.addEventListener("touchstart",()=>{
                MontosGuardados.splice(boton.attributes[1].value,1)
                localStorage.MontosGuardados = JSON.stringify(MontosGuardados.sort(function(a, b){return a - b}));
                window.location.reload()
            })

        }
    }
}



class Mercado{
    static Config(){
        Menu.addConfig(`
            <h2>Mercado de la Alianza</h2>
            <ul id="MercadoAlianza" style="display: flex;background-color: white;width: 324px;height: auto;margin-left: 43px;padding: 6px;flex-direction: row;flex-wrap: wrap;">
                <input type="number" title="Presiona ENTER para guardar." id="InputMercadoAlianza" placeholder="Oro" style="background-color: #bebebe;color: white;font-weight: bold;font-size: 12px;width: 79px;height: 23px;">
            </ul>
        `);
        let MercadoAlianza = document.getElementById("MercadoAlianza");
        let InputMercadoAlianza = document.getElementById("InputMercadoAlianza");
        let MontosMercado = [];

        if(localStorage.MontosMercado == undefined){
        localStorage.MontosMercado = '["100000"]';
        }else{
        MontosMercado = JSON.parse(localStorage.MontosMercado)
        }

        InputMercadoAlianza.addEventListener("keypress",(input)=>{
            if (input.key === 'Enter') {
                if (!MontosMercado.includes(InputMercadoAlianza.value) && InputMercadoAlianza.value != "") {
                    MontosMercado.push(InputMercadoAlianza.value);
                    InputMercadoAlianza.value = "";
                    localStorage.MontosMercado = JSON.stringify(MontosMercado.sort(function(a, b){return a - b}));
                    window.location.reload()
                }
            }
        });
    }
    static MostrarRotativosSeleccionados(){
        let MontosMercado = JSON.parse(localStorage.MontosMercado);
        let indiceDeRotativoBorrar;
        let MercadoAlianza = document.getElementById("MercadoAlianza");
        let contador = 0;
        for(let monto of MontosMercado){
            insertOnPage.beforeend(MercadoAlianza,`
               <div style="border-style: groove;color: black;width: fit-content;padding: 2px;font-size: 12px;">
                   `+Formatter.abbreviateNumber(monto)+`
                   <button name="MercadoRotativoBorrar" data-index="`+contador+`" style="color: red;font-weight: bold;font-size: 16px;border: none;background: none;">x</button>
               </div>
           `)
            contador++;
        }
    }
    static EliminarRotativo(){
        let MontosMercado = JSON.parse(localStorage.MontosMercado);
        let NotificaRotativoBorrar = document.getElementsByName("MercadoRotativoBorrar")
        for (let boton of NotificaRotativoBorrar) {
            boton.addEventListener("click",()=>{
                MontosMercado.splice(boton.attributes[1].value,1)
                localStorage.MontosMercado = JSON.stringify(MontosMercado.sort(function(a, b){return a - b}));
                window.location.reload()
            })
            boton.addEventListener("touchstart",()=>{
                MontosMercado.splice(boton.attributes[1].value,1)
                localStorage.MontosMercado = JSON.stringify(MontosMercado.sort(function(a, b){return a - b}));
                window.location.reload()
            })

        }
    }
    static VentaRapida(){
        let market_sell_box = document.getElementById("market_sell_box")
        let inputPrecio = document.getElementById("preis");
        let inputDuracion = document.getElementById("dauer");
        let botonVender = document.getElementsByName("anbieten")[0];
        let marketInventory = document.getElementById("market_inventory");
        let oro = parseFloat(document.getElementById("sstat_gold_val").textContent);
        let cajaVenta = document.getElementsByClassName("ui-droppable")[0];
        let contentItem = document.getElementsByClassName("contentItem")[0];

        insertOnPage.afterbegin(contentItem,`
            <h2 id="VentaRapidaMenuTitle" class="section-header" style="cursor: pointer;">Venta Rapida</h2>
	        <section id="VentaRapidaMenu" style="display: block;"> <p>Coloca un item y elige el precio para vender.</p> </section>
        `);
        insertOnPage.afterbegin(market_sell_box,`
            <h2 class="section-header" style="cursor: pointer; margin-top: 5px;">Comprar</h2>
	        <section id="CompraRapidaMenu" style="display: block; margin-bottom: -8px;">
                <label title="Solo se comprarán los objetos cuyo valor sea igual a los que tienen los rotativos" style="cursor: pointer;">
                    <button id="CompraTodo" class="awesome-button">Comprar</button>
                </label>
                <select id="TipoCompra" style="margin: 8px; font-size: 14px;">
                    <option>Mayor a menor ⬇</option>
                    <option>Menor a mayor ⬆</option>
                </select>
            </section>
        `);
        let MontosMercado = JSON.parse(localStorage.MontosMercado);
        let ventaRapidaMenu = document.getElementById("VentaRapidaMenu");

        for(let monto of MontosMercado){
            insertOnPage.beforeend(ventaRapidaMenu,`
             <button name="BotonVender" data-input="`+monto+`" class="awesome-button" style="margin:5px;" data-toggle="tooltip" title="Costo de venta: `+Formatter.abbreviateNumber(monto*0.04)+` 💰" >`+Formatter.abbreviateNumber(monto)+`</button>
            `)
        };
        insertOnPage.beforeend(ventaRapidaMenu,`
            <section id="" style="display: block; margin: 11px">
                <small>Elegir duración</small>
                <select id="SelectHora" size="1">
				    <option value="1">2 h</option>
				    <option value="2">8 h</option>
				    <option value="3">24 h</option>
		        </select>
	        </section>`);
        let selectHora = document.getElementById("SelectHora");
        if (localStorage.SelectHora == undefined) {
            localStorage.SelectHora = 1;
            selectHora.value = 1;
        } else {
            selectHora.value = localStorage.SelectHora;
        }
        selectHora.addEventListener("change", (event) => {
            localStorage.SelectHora = selectHora.value;
        });
        let ventaRapidaMenuTitle = document.getElementById("VentaRapidaMenuTitle");
        ventaRapidaMenuTitle.addEventListener("click", () => {
            if (ventaRapidaMenu.style.display == "none") {
                ventaRapidaMenu.style.display = "block";
            } else {
                ventaRapidaMenu.style.display = "none";
            }
        });
        ventaRapidaMenuTitle.addEventListener("touchstart",()=>{
            if (ventaRapidaMenu.style.display == "none") {
                ventaRapidaMenu.style.display = "block";
            } else {
                ventaRapidaMenu.style.display = "none";
            }
        });

        let BotononesVender = document.getElementsByName("BotonVender")

        for (let boton of BotononesVender) {
            boton.addEventListener("click",()=>{
                inputPrecio.value = boton.attributes[1].value;
                inputDuracion.value = localStorage.SelectHora;
                botonVender.click();
            })
            boton.addEventListener("touchstart",()=>{
                inputPrecio.value = boton.attributes[1].value;
                inputDuracion.value = localStorage.SelectHora;
                botonVender.click();
            })

        }

    }
    static Comprar(){
        let CompraTodo = document.getElementById("CompraTodo");
        let TipoCompra = document.getElementById("TipoCompra");
        let MontosMercado = JSON.parse(localStorage.MontosMercado);

        if (localStorage.TipoCompra == undefined) {
				localStorage.TipoCompra = 0;
			} else {
				TipoCompra.selectedIndex = localStorage.TipoCompra;
			}
			TipoCompra.addEventListener("change", (event) => {
				localStorage.TipoCompra = TipoCompra.selectedIndex;
			});
        let market_item_table = Array.from(document.getElementById("market_item_table").children[0].children).filter(item => item.tagName == "TR" && !!item.children[0].style["background-image"] && item.children[1].children[0].children[0].children[0].style.color == "green")
        let marketItems = [];
        for (let item of market_item_table) {
                if(MontosMercado.includes(item.children[2].innerText.replace(/\./g, ''))){
                    marketItems.push(item)
            }
        }
        CompraTodo.addEventListener("click",()=>{
            switch(TipoCompra.selectedIndex){
                case 0 :
                    Mercado.Mayor_Menor(marketItems);
                    break;
                case 1:
                    Mercado.Menor_Mayor(marketItems);
                    break
                default:
                    console.error("No se pudo procesar la compra");
                    break;
            }
        })
    }
    static Mayor_Menor(marketItems){
        let oro = parseInt(document.getElementById("sstat_gold_val").textContent.replace(/\./g, ''));
        let orden = marketItems;
        orden.sort(function(a,b){
            if (parseInt(a.children[2].innerText.replace(/\./g, '')) < parseInt(b.children[2].innerText.replace(/\./g, ''))) {
                return 1;
            }
            if (parseInt(a.children[2].innerText.replace(/\./g, '')) > parseInt(b.children[2].innerText.replace(/\./g, ''))) {
                return -1;
            }
            // a must be equal to b
            return 0;
        })
        for (let item of orden){
            let valor = parseInt(item.children[2].innerText.replace(/\./g, ''))
            if(valor < oro){
                item.children[5].children[0].click();
                break;
            }
        }
    }
    static Menor_Mayor(marketItems){
        let oro = parseInt(document.getElementById("sstat_gold_val").textContent.replace(/\./g, ''));
        let orden = marketItems;
        orden.sort(function(a,b){
            if (parseInt(a.children[2].innerText.replace(/\./g, '')) > parseInt(b.children[2].innerText.replace(/\./g, ''))) {
                return 1;
            }
            if (parseInt(a.children[2].innerText.replace(/\./g, '')) < parseInt(b.children[2].innerText.replace(/\./g, ''))) {
                return -1;
            }
            // a must be equal to b
            return 0;
        })
        for (let item of orden){
            let valor = parseInt(item.children[2].innerText.replace(/\./g, ''))
            if(valor < oro){
                item.children[5].children[0].click();
            }
        }
    }
    static PackageShortcut(){
        let mainnav = document.getElementById("mainnav").children[0].children[0].children[0].children[0];
        if(getURL[getURL.length-1].slice(0,11).includes("precioventa") == true){
            insertOnPage.beforeend(mainnav,`<td><a id="irapaquetes" href="index.php?mod=packages&${sh.get()}&searchItems&${getURL[getURL.length-1]}" class="awesome-tabs">Paquetes<div class="navBG"></div></a></td>`)
        } else {
            insertOnPage.beforeend(mainnav,`<td><a href="index.php?mod=packages&${sh.get()}&searchItems" class="awesome-tabs">Paquetes<div class="navBG"></div></a></td>`)
        }
    }
    static ValorDeRotativosEnVenta(){
        let market_item_table = Array.from(document.getElementById("market_item_table").children[0].children).filter(item => item.tagName == "TR" && !!item.children[0].style["background-image"] && item.children[1].children[0].children[0].children[0].style.color == "green")
        let market_item_tableSelled = Array.from(document.getElementById("market_item_table").children[0].children).filter(item => item.tagName == "TR" && !!item.children[0].style["background-image"] && item.children[1].children[0].children[0].children[0].style.color == "blue")
        let TotalDePaquetesSinComprar = 0
        for (let item of market_item_table) {
            TotalDePaquetesSinComprar = TotalDePaquetesSinComprar + parseInt(item.children[2].innerText.replace(/\./g, ''));
        }
        let TotalDePaquetesVendidos = 0
        for (let item of market_item_tableSelled) {
            TotalDePaquetesVendidos = TotalDePaquetesVendidos + parseInt(item.children[2].innerText.replace(/\./g, ''));
        }
        let standalone = document.getElementsByClassName("standalone")[0]
        insertOnPage.beforeend(standalone,`<div id="MontodeRotativos">Oro total por comprar: ${Formatter.abbreviateNumber(TotalDePaquetesSinComprar)}<img alt="" src="9407/img/res2.gif" title="Oro" align="absmiddle" border="0"></div>`)
        insertOnPage.beforeend(standalone,`<div id="MontodeRotativos">Oro total Vendido: ${Formatter.abbreviateNumber(TotalDePaquetesVendidos)}<img alt="" src="9407/img/res2.gif" title="Oro" align="absmiddle" border="0"></div>`)
    }
    static ColorearMercado(){
        let itemsParaComprar = Array.from(document.getElementById("market_item_table").children[0].children).filter(item => item.tagName == "TR" && !!item.children[0].style["background-image"] && item.children[1].children[0].children[0].children[0].style.color == "green");
        for(let item of itemsParaComprar){
            item.style["background-color"] = "#0b800057"
        }

    }
    static ObtenerItemsComprados(){
        let init = {
            ponerContenedor(){
                let inventoryBox =document.getElementsByClassName("inventoryBox")[0]
                insertOnPage.beforebegin(inventoryBox,`<div id="paquetesMercado"></div>`)
            },
            ponerBotonBusqueda(){
                let paquetesMercado = document.getElementById("paquetesMercado");
                insertOnPage.afterbegin(paquetesMercado, `<button id="obtenerPaquetes" class="awesome-button" style="display: block;position: relative;left: 175px;margin-top: 9px;">Obtener Paquetes</button>`)
            },
            eventos(){
                let obtenerPaquetes = document.getElementById("obtenerPaquetes");
                obtenerPaquetes.addEventListener("click", init.buscar)
            },
            ranuras(){
                this.slots = [];
                for (let i = 0; i < 6; i++) {
                    let wrapper = document.createElement('div');
                    wrapper.className = "magus_itembox";
                    wrapper.style.display = 'none';
                    wrapper.style.position = 'relative';
                    wrapper.style.margin = '0 auto';
                    this.wrapper.appendChild(wrapper);
                    this.slots.push({
                        triggered : false,
                        active : false,
                        slot : i,
                        item : null,
                        wrapper : wrapper
                    });
                }
            },
            buscar(){

            }
        }
        init.ponerContenedor();
        init.ponerBotonBusqueda();
        init.eventos();
    }
    static AddVariableToForm(){
        let market_item_table_TR = Array.from(document.getElementById("market_item_table").children[0].children).filter(item => item.tagName == "TR" && !!item.children[0].style["background-image"] && item.children[1].children[0].children[0].children[0].style.color == "green")
        let market_item_table_FORMS = Array.from(document.getElementById("market_item_table").children[0].children).filter(item => item.tagName == "FORM")
        for (let [indice, objeto] of market_item_table_TR.entries()){
            let precio = objeto.children[2].innerText.replace('.',"").replace('.',"");
            market_item_table_FORMS[indice].action = market_item_table_FORMS[indice].action+`&precioventa=${precio}`
        }
    }
    static AutoCompra(){
        let market_item_table_TR = Array.from(document.getElementById("market_item_table").children[0].children).filter(item => item.tagName == "TR" && !!item.children[0].style["background-image"] && item.children[1].children[0].children[0].children[0].style.color == "green")


        if(market_item_table_TR.length > 0){
        //ejecutar compra
        }




    }
    static Run(){
        Mercado.Config();
        Mercado.MostrarRotativosSeleccionados();
        Mercado.EliminarRotativo();
        Mercado.VentaRapida();
        Mercado.Comprar();
        Mercado.PackageShortcut();
        Mercado.ValorDeRotativosEnVenta();
        Mercado.ColorearMercado();
        Mercado.AddVariableToForm();
        //Mercado.ObtenerItemsComprados();
    }
}

function AcutionHouseTools() {
    let item = document.getElementsByTagName("TD");
    let oro = parseInt(document.getElementById("sstat_gold_val").textContent.replace(/\./g, ''));

	let menu = document.getElementsByClassName("section-header")[1];
	menu.insertAdjacentHTML(
		"beforebegin",
		`
  <h2
	   id = "MenuCompraTitle"
	   class = "section-header"
	   style = "cursor: pointer;">
	   Compra Rápida
  </h2>
  <section
	   id = "MenuCompra"
	   style = "display: block;">
  </section>`
	);

	let SectionMenuCompra = document.getElementById("MenuCompra");
	/*
	SectionMenuCompra.insertAdjacentHTML('beforeend', `
	<p>Indica un precio máximo para comprar o compra todo lo que te alcance.</p>
	<p><small>No se sobrepujará a los compañeros de alianza.</small></p>
	`);
	*/
	SectionMenuCompra.insertAdjacentHTML(
		"beforeend",
		`
  <p>Se comprará todo lo que alcance con el oro que tienes.</p>
  <p><small>No se sobrepujará a los compañeros de alianza.</small></p>
  `
	);

	SectionMenuCompra.insertAdjacentHTML(
		"beforeend",
		`
  <input
	   type = "number"
	   id = "OroMaximo"
	   placeholder = "Oro máximo a gastar"
	   style = "width:150px" hidden>`
	);

	SectionMenuCompra.insertAdjacentHTML(
		"beforeend",
		`
  <button
	   id = "BotonComprar"
	   class = "awesome-button"
	   style = "margin:5px;"
	   data-toggle = "tooltip"
	   title = "Se comprará toda la comida que alcance con el oro que tengas">
	   Comprar todo
  </button>`
	);

    let oroMaximo = document.getElementById("OroMaximo");
	let botonComprar = document.getElementById("BotonComprar");
	oroMaximo.addEventListener("input", () => {
		if (oroMaximo.value.length > 0) {
			botonComprar.title =
				"Se comprara la comida que alcance con: " + oroMaximo.value + " 🥇";
			botonComprar.innerHTML = "\n Comprar \n";
		} else if (oroMaximo.value.length == 0) {
			botonComprar.title =
				"Se comprará toda la comida que alcance con el oro que tengas";
			botonComprar.innerHTML = "\n Comprar todo\n";
		}
	});

	botonComprar.addEventListener("click", () => {
        if (oroMaximo.value.length > 0) {
            //Proximamente
        } else if (oroMaximo.value.length == 0) {
            for (let isItem = 0; isItem < item.length; isItem++) {
                if(item[isItem].hasAttribute("width")==true){
                    let auction_bid_div = item[isItem].children[1].children[0].children[7].children;
                    let auction_item_div = item[isItem].children[1].children[0].children[6].children[1].children[0];
                    let itemSplit = auction_item_div.attributes[6].textContent.substring(4,9);
                    //console.log(auction_bid_div[2]);
                    let costo = parseInt(auction_bid_div[2].value);
                    if (costo < oro) {
                        oro = oro - costo;
                        //console.log(oro," - ",costo)
                        let PujaDeAlguien;
                        if (
                            auction_bid_div[0].innerText.split("\n")[0] == "No hay pujas." ||
                            auction_bid_div[0].innerText.split("\n")[0] == "Ya hay pujas existentes."
                        ) {
                            //items[i].children[3].click();
                            if(itemSplit != "Pollo"){
                                auction_bid_div[3].click();
                            }

                        }
                    }
                }
            }
        }
    });
    botonComprar.addEventListener("touchstart",()=>{
        if (oroMaximo.value.length > 0) {
            //Proximamente
        } else if (oroMaximo.value.length == 0) {
            for (let isItem = 0; isItem < item.length; isItem++) {
                if(item[isItem].hasAttribute("width")==true){
                    let auction_bid_div = item[isItem].children[1].children[0].children[7].children;
                    let auction_item_div = item[isItem].children[1].children[0].children[6].children[1].children[0];
                    let itemSplit = auction_item_div.attributes[6].textContent.substring(4,9);
                    //console.log(auction_bid_div[2]);
                    let costo = parseInt(auction_bid_div[2].value);
                    if (costo < oro) {
                        oro = oro - costo;
                        //console.log(oro," - ",costo)
                        let PujaDeAlguien;
                        if (
                            auction_bid_div[0].innerText.split("\n")[0] == "No hay pujas." ||
                            auction_bid_div[0].innerText.split("\n")[0] == "Ya hay pujas existentes."
                        ) {
                            //items[i].children[3].click();
                            if(itemSplit != "Pollo"){
                                auction_bid_div[3].click();
                            }

                        }
                    }
                }
            }
        }
    });
    let menuCompraTitle = document.getElementById("MenuCompraTitle");
    menuCompraTitle.addEventListener("click", () => {
        if (SectionMenuCompra.style.display == "none") {
            SectionMenuCompra.style.display = "block";
        } else {
            SectionMenuCompra.style.display = "none";
        }
    });
}

function SmelteryTimeSaverExtension() {
    let inv = document.getElementById("inv")
    window.addEventListener("load", () => {
        if (document.getElementsByClassName("smelter-actions")[0] != undefined) {
            let inventario = document.getElementsByClassName("smelter-actions")[0];
            let items = document.getElementsByClassName("ui-draggable");
            let btnFundicion = FindBtn("Iniciar función");
            let btnGuardarRecursos = FindBtn("Enviar todo a Horreum");
            let mensaje = document.getElementsByClassName("gts-error-message")[0];
			inventario.insertAdjacentHTML(
				"beforeend",
				`
               <strong>Acciones Rapidas</strong>
               <br/>
               Selecciona un inventario para fundir
               <select
			   id="SelectInventario"
			   size="1">
				  <option value="Ⅰ">Ⅰ</option>
				  <option value="Ⅱ">Ⅱ</option>
				  <option value="Ⅲ">Ⅲ</option>
				  <option value="Ⅳ">Ⅳ</option>
				  <option value="Ⅴ">Ⅴ</option>
				  <option value="Ⅵ">Ⅵ</option>
				  <option value="Ⅶ">Ⅶ</option>
				  <option value="Ⅷ">Ⅷ</option>
				</select>
                <hr>
                <button
					class="awesome-button"
					type="button"
					id="FundirTodo">
					Fundir Todo
			   </button>
               <button
					class="awesome-button"
					type="button"
					id="GuardarFundir">
					Guardar y Fundir
			   </button>

		  `
			);

			let selectInventario = document.getElementById("SelectInventario");
            if (localStorage.selectInventario == undefined) {
                localStorage.selectInventario = selectInventario.selectedIndex
            } else {
                selectInventario.selectedIndex = localStorage.selectInventario;
            }
            selectInventario.addEventListener("change", () => {
                localStorage.selectInventario = selectInventario.selectedIndex;
            })

            let inventoryTabs = document.getElementsByClassName("awesome-tabs");
			let inventorySelected;
			for (let index = 4; index < inventoryTabs.length; index++) {
				if (inventoryTabs[index].text == localStorage.InventarioFundicion) {
					inventorySelected = inventoryTabs[index];
				}
			}

            if(localStorage.GuardarRecursos == undefined){
                localStorage.GuardarRecursos = false;
            }
            const observer = new MutationObserver((mutationList) => {
                mutationList.forEach((mutation)=> {
                    if(mutation.removedNodes.length){
                        if(JSON.parse(localStorage.GuardarRecursos) == true){
                            inventorySelected.click();
                            btnFundicion.click();
                            for (let index = 9; index < items.length; index++) {
                                items[index].click();
                            }
                            localStorage.GuardarRecursos = false;
                        }
                    }

                })
            });
            // Opcions para el observer
            const observerOptions = {
                attributes: true,
                childList: true,
                subtree: true,
                characterData: false,
                attributeOldValue: false,
                characterDataOldValue: false
            };
            observer.observe(inv, observerOptions);

            if(JSON.parse(localStorage.GuardarRecursos) == true){
                inventorySelected.click();
                btnFundicion.click();
                for (let index = 9; index < items.length; index++) {
                    items[index].click();
                }
                localStorage.GuardarRecursos = false;
            }
            let GuardarFundir = document.getElementById("GuardarFundir");
            GuardarFundir.addEventListener("click", () => {
                localStorage.GuardarRecursos = true;
                btnGuardarRecursos.click();
            });

            let fundirTodo = document.getElementById("FundirTodo");
            fundirTodo.addEventListener("click",()=>{
                inventorySelected.click();
                btnFundicion.click();
                for (let index = 9; index < items.length; index++) {
                    items[index].click();
                }
            });

            mensaje.addEventListener("DOMNodeInserted", () => {
                window.location.reload();
            }, false);



        } else {
            console.log("time saver extension not installed");
		}
	});

    function FindBtn(textContent) {
        let elements = document.getElementsByClassName("awesome-button");
        let elementsArray = [].slice.call(elements);
        for (let index = 0; index < elementsArray.length; index++) {
            let element = elementsArray[index];
            if (element.textContent === textContent) {
                return element;
            }
        }
    }

    function Observer(observar){
        let observerReturn = [[],[]]
        const observer = new MutationObserver((mutationList) => {
            mutationList.forEach((mutation)=> {
                if(mutation.addedNodes.length){
                    observerReturn[0].push(mutation.addedNodes[0]);
                }
                if(mutation.removedNodes.length){
                    observerReturn[1].push(mutation.removedNodes[0]);
                }
                //console.log(mutation.type);

            })
        });
        // Opcions para el observer
        const observerOptions = {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: false,
            attributeOldValue: false,
            characterDataOldValue: false
        };
        observer.observe(observar, observerOptions);
        return observerReturn;
    }

}

class Herreria {
     static getItems(){
         return !!document.getElementsByClassName("crafting_requirements")[0].children[0].children[1].children[0]
     }
    static setLinks(){
        if(Herreria.getItems() == true){
            let recursos = document.getElementsByClassName("crafting_requirements")[0].children[0].children[1]
            let recursoslength = recursos.children.length;
            recursos.insertAdjacentHTML("beforebegin", `<ul id="newResources"></ul>`);
            let newResources = document.getElementById("newResources");
            for (let index = 0; index < recursoslength; index++) {
                let recurso = recursos.children[index]
                let recursoId = recurso.children[0].className.split("-")[3];
                let url = `<a name="nuevoRecurso" href="https://es.gladiatus-tools.com/resources?id=${recursoId}"></a>`;
                newResources.insertAdjacentHTML("beforeend", url);

            }
            let nuevoRecurso = document.getElementsByName("nuevoRecurso");
            for (let index = 0; index < nuevoRecurso.length; index++) {
                let recurso = recursos.children[0]
                nuevoRecurso[index].append(recurso)
            }
        }
    }
    static run(){
        let newResources = document.getElementById("newResources");
        //Herreria.setLinks();
        for (let forgeItem of document.getElementsByClassName("forge_closed")) {
            forgeItem.addEventListener("click",()=>{
                newResources.destroy();
                Herreria.setLinks();
            })
        }
    }
}

class Paquetes {
    static filtros(){
        let inputQry = document.getElementsByName("qry");
        inputQry[0].setAttribute("list","customSearch");
        inputQry[0].insertAdjacentHTML("afterend", `<datalist id="customSearch"></datalist>`);

        /*let GladiatusToolsMenu = document.getElementById("GladiatusToolsMenu");
    GladiatusToolsMenu.insertAdjacentHTML("beforeend",`
    <button class="dropbtn"></button>
    <div class="dropdown-content" id="GladiatusToolsMenu">
       menu de paquetes
    </div>
    `);*/

    }
    static Markethortcut(){
        let mainnav = document.getElementById("mainnav").children[0].children[0].children[0].children[0];
        insertOnPage.beforeend(mainnav,`<td><a href="index.php?mod=guildMarket&${sh.get()}" class="awesome-tabs">Mercado de la alianza<div class="navBG"></div></a></td>`)
    }

    static UI(){
        Paquetes.Markethortcut();
        let inventoryBox = document.getElementsByClassName("inventoryBox")[0];
        insertOnPage.afterbegin(inventoryBox,`
        <div>
            <div class="panelBusqueda"></div>
            <button id="buscarRotativos" class="awesome-button buscarRotativos">🔎 Buscar Items</button>
            <input class="SelectCategorias" type="search" id="categoria" list="listaCategorias" value="Mercado">
            <datalist id="listaCategorias">
                 <option>Banco de trabajo</option>
                 <option>Casa de subastas</option>
                 <option>Ermitaño</option>
                 <option>Expedición</option>
                 <option>Fundición</option>
                 <option>Jefe de la Mazmorra</option>
                 <option>Mazmorra</option>
                 <option>Mercado</option>
                 <option>Panteón</option>
                 <option>Recompensa de la misión</option>
            </datalist>
            <div id="MercadoFavoritos" class="Favoritos" style="display: none"><h2 id="mensaje"></h2></div>
        </div>`)
        let buscarRotativos = document.getElementById("buscarRotativos");
        let categoria = document.getElementById("categoria");

        buscarRotativos.addEventListener("click",()=>{
            Paquetes.PonerEnFavoritos(categoria.value)
        })
        buscarRotativos.addEventListener("touchstart",()=>{
            Paquetes.PonerEnFavoritos(categoria.value)
        })
        if(localStorage.paquetesCategoria == undefined){
            localStorage.paquetesCategoria = "Mercado";
        }else{categoria.value = localStorage.paquetesCategoria}
        categoria.addEventListener("change",()=>{localStorage.paquetesCategoria = categoria.value});
    }

    static PonerEnFavoritos(textContent){
        let MercadoFavoritos = document.getElementById("MercadoFavoritos");
        let rotativos = Paquetes.EncontrarRotativos(textContent);
        MercadoFavoritos.style.display = "block";
        MercadoFavoritos.innerHTML = `<h2 id="mensaje"></h2>`;

        let mensaje = document.getElementById("mensaje");
        if (rotativos.length > 0){
            mensaje.innerText = "Objetos Encontrados!";
            for (let item of rotativos) {
                MercadoFavoritos.append(item)
            }
        } else {mensaje.innerHTML = `
        <div title="Se recomienda utilizar la extención gladiatus crazy addon\ny colocar el 'Número de paginas a cargar' desde 10 en adelante" style="text-align: center;">
             No se encontraron objetos, intenta nuevamente.
        </div>
        <br/>`;}
    }

    static EncontrarRotativos(textContent){
        let rotativos = []
        let packages = document.getElementById("packages");
        //packages.children[1].children[2].children[0].attributes[6].textContent.includes("Oro")
        for (let item of packages.children) {
            if(!!item.children[1] == true &&
               item.children[1].textContent == textContent
              ){
                let atributes = item.children[2].children[0].attributes;
                for (let atribute of atributes) {
                    if(atribute.name == "data-tooltip"){
                        if(atribute.textContent.includes('Oro","white"') == false){
                            rotativos.push(item)
                        }
                    }
                }
            }
        }
        return rotativos
    }
    static MoverFiltros(){
        let filtros = document.getElementsByClassName("package-advance-filters")[0];
        filtros.setAttribute("style","width: 500px;margin-left: auto;")
        let article = document.getElementsByTagName("article")[0];
        let sectionHeaders = document.getElementsByClassName("section-header")
        for (let section of sectionHeaders) {
            if(section.innerHTML.includes("Paquetes")==true){
                article.insertBefore(filtros,section)
            }
        }
    }

    static ExtendsInput(){
        let qry = document.getElementsByName("qry")[0];
        qry.setAttribute("list","Busqueda");
        qry.type = "search"
        insertOnPage.afterend(qry,`<datalist id="Busqueda"></datalist>`);

        Menu.addConfig(`
        <h2>Paquetes</h2>
        <ul id="ListaNombres" style="display: flex;background-color: white;width: 324px;height: auto;margin-left: 43px;padding: 6px;flex-direction: row;flex-wrap: wrap;">
           <input type="text" title="Presiona ENTER para guardar." id="InputNombres" placeholder="Nombre de los items a guardar" style="background-color: #bebebe;color: white;font-weight: bold;font-size: 12px;width: 79px;height: 23px;">
        </ul>

        `);

        let InputNombres = document.getElementById("InputNombres");
        let NombresGuardados = [];
        if(localStorage.NombresGuardados == undefined){
            localStorage.NombresGuardados = '[]';
        }else{
            NombresGuardados = JSON.parse(localStorage.NombresGuardados)
        }

        InputNombres.addEventListener("keypress",(input)=>{
            if (input.key === 'Enter') {
                if (!NombresGuardados.includes(InputNombres.value) && InputNombres.value != "") {
                    NombresGuardados.push(InputNombres.value);
                    InputNombres.value = "";
                    localStorage.NombresGuardados = JSON.stringify(NombresGuardados.sort());
                    window.location.reload()
                }
            }
        });
        Paquetes.MostrarNombresSeleccionados();
        Paquetes.addOptionsToDatalist();
        Paquetes.Eliminar();
    }
    static MostrarNombresSeleccionados(){
        let NombresGuardados = JSON.parse(localStorage.NombresGuardados);
        let indiceDeRotativoBorrar;
        let ListaNombres = document.getElementById("ListaNombres");
        let contador = 0;
        for(let nombre of NombresGuardados){
            insertOnPage.beforeend(ListaNombres,`
               <div style="border-style: groove;color: black;width: fit-content;padding: 2px;font-size: 12px;">
                   `+nombre+`
                   <button name="NombreBorrar" data-index="`+contador+`" style="color: red;font-weight: bold;font-size: 16px;border: none;background: none;">x</button>
               </div>
           `)
            contador++;
        }
    }
    static Eliminar(){
        let NombresGuardados = JSON.parse(localStorage.NombresGuardados);
        let NombreBorrar = document.getElementsByName("NombreBorrar")
        for(let boton of NombreBorrar) {
            boton.addEventListener("click",()=>{
                NombresGuardados.splice(boton.attributes[1].value,1);
                localStorage.NombresGuardados = JSON.stringify(NombresGuardados.sort());
                window.location.reload();
            })
            boton.addEventListener("touchstart",()=>{
                NombresGuardados.splice(boton.attributes[1].value,1)
                localStorage.NombresGuardados = JSON.stringify(NombresGuardados.sort());
                window.location.reload()
            })

        }
    }
    static addOptionsToDatalist(){
        let NombresGuardados = JSON.parse(localStorage.NombresGuardados);
        let Busqueda = document.getElementById("Busqueda");
        for(let nombre of NombresGuardados){
            insertOnPage.beforeend(Busqueda,`<option>`+nombre+`</option>`)
        }
    }
    static AbrirdesdeMercado(){
        if(!!getURL[2] == true && getURL[2] == "searchItems"){
            document.getElementById("buscarRotativos").click();
        }
    }
}
//style="width: 500px;margin-left: auto;"

class TimeSaver{

    static Exist(){
        const timeSaverr = !!document.getElementsByClassName("auto-settings")[0]
        return timeSaverr;
    }

    static Touch(){
        if(TimeSaver.Exist() == true){
            let boton = document.getElementsByClassName("gts-pause show")[0];
            boton.addEventListener("touchstart",()=>{
                boton.children[0].click();
            })
        }
    }

    static setKeyForStop(timeSaverExist){
        if(timeSaverExist==true){
            Menu.addConfig(`
            <h3>TimeSaver</h3>
            <ul>Pasuar con click
                <ul><label><input id="TimeSaverStopOnClick" type="checkbox">Detener el bot si se hace click en la pagina<label></ul>
            </ul>
            <ul>Atajos de Teclado
                <ul>Pausar Bot: <input maxlength="1" id="timeSaverHotKeySelectedKey" style="width: 100px;background: white;"><button id="Btnconfirmar" title="click para guardar" style="background: transparent; border: transparent;"></button></ul>
                <ul style="color: #0fea0f;" id="timeSaverHotKeyConfirmation" hidden>✔ Cambios guardados correctamente</ul>
                <ul><label><input id="timeSaverHotKeyCheckbox" type="checkbox"> Utilizar combinación con ctrl<label></ul>
            </ul>`);

            let timeSaverHotKeySelectedKey = document.getElementById("timeSaverHotKeySelectedKey");
            let timeSaverHotKeyCheckbox = document.getElementById("timeSaverHotKeyCheckbox");
            let timeSaverHotKeyConfirmation = document.getElementById("timeSaverHotKeyConfirmation");

            let Btnconfirmar = document.getElementById("Btnconfirmar");

            Btnconfirmar.addEventListener("click",()=>{Btnconfirmar.textContent = ""; timeSaverHotKeyConfirmation.hidden = false;});

            if(localStorage.timeSaverHotKeyCheckbox == undefined){
                localStorage.timeSaverHotKeyCheckbox = false;
            } else {
                timeSaverHotKeyCheckbox.checked = JSON.parse(localStorage.timeSaverHotKeyCheckbox);
            }
            timeSaverHotKeyCheckbox.addEventListener("change",()=>{
                localStorage.timeSaverHotKeyCheckbox=timeSaverHotKeyCheckbox.checked;
                location.reload();
            })

            if(localStorage.timeSaverHotKeySelectedKey == undefined){
                localStorage.timeSaverHotKeySelectedKey = "";
            } else {
                timeSaverHotKeySelectedKey.value = localStorage.timeSaverHotKeySelectedKey;
            }
            timeSaverHotKeySelectedKey.addEventListener("keydown",()=>{timeSaverHotKeySelectedKey.select();
                                                                     Btnconfirmar.textContent = "✅";
                                                                    })
            timeSaverHotKeySelectedKey.addEventListener("change",()=>{
                localStorage.timeSaverHotKeySelectedKey = timeSaverHotKeySelectedKey.value;
                location.reload();
            })
        }
    }

    static StopOnKey(){
        document.addEventListener('keyup', (e)=>{
            let selectKey = localStorage.timeSaverHotKeySelectedKey;
            let useControl = JSON.parse(localStorage.timeSaverHotKeyCheckbox);

            if (useControl == true && e.ctrlKey && e.key === selectKey) {
                TimeSaver.StopBot();
            }

            if (useControl == false && e.key === selectKey) {
                TimeSaver.StopBot();
            }
        }, false);
    }

    static StopBot(){
        if(TimeSaver.Exist() == true){

            let timeSaver = document.getElementsByClassName("auto-settings")[0]
            let botonPlay = timeSaver.children[3];
            if (botonPlay.classList[2] == "show") {
                //bot desactivado
                botonPlay.click();
            }
        }
    }
    static ContinueBot(){
        if(TimeSaver.Exist() == true){
            let timeSaver = document.getElementsByClassName("auto-settings")[0]
            let botonPlay = timeSaver.children[3];
            if (!!botonPlay.classList[2] == false) {
                //bot desactivado
                botonPlay.click();
            }
        }
    }
    static StopOnClick(){
        let TimeSaverStopOnClick = document.getElementById("TimeSaverStopOnClick");
        if(localStorage.TimeSaverStopOnClick == undefined){
            localStorage.TimeSaverStopOnClick = false;
        } else {
            TimeSaverStopOnClick.checked = JSON.parse(localStorage.TimeSaverStopOnClick);
        }
        TimeSaverStopOnClick.addEventListener("change",()=>{
            localStorage.TimeSaverStopOnClick=TimeSaverStopOnClick.checked;
            location.reload();
        })
        if(JSON.parse(localStorage.TimeSaverStopOnClick) == true){
            document.addEventListener('mouseup', function(e) {
                var container = document.getElementsByClassName("auto-settings")[0]
                if (!container.contains(e.target)) {
                    TimeSaver.StopBot();
                }
            });
        }
    }
    static cambiarInterfaz(){

    }
}

class ExtenderBotones{
    static Paquetes(){
        let menue_packages = document.getElementById("menue_packages");
        let url = window.location.search.split("&");
        insertOnPage.afterend(menue_packages,`
            <div id="extenderPaquetes">
            <button class="awesome-button extederPaquetes">+</button>
            <div id="menuBotonPaquetes" class="menuBotonPaquetes">
                <titulo style="display: block;">
                    Links a paquetes
                </titulo>
                <submenu style="display: block;">
                    <div class="icon-out"><a class="icon food-icon" href="index.php?mod=packages&f=7&fq=-1&qry=&page=1&${sh.get()}" title="Ir a paquetes, Utilizable"></a></div>
                    <div class="icon-out"><a class="icon gold-icon" href="index.php?mod=packages&f=14&fq=-1&qry=&page=1&${sh.get()}" title="Ir a paquetes, Oro"></a></div>
                    <div class="icon-out"><a class="icon tool-icon" href="index.php?mod=packages&f=19&fq=-1&qry=&page=1&${sh.get()}" title="Ir a paquetes, Herramientas"></a></div>
                    <div class="icon-out"><a class="icon pergamino-icon" href="index.php?mod=packages&f=20&fq=-1&qry=&page=1&${sh.get()}" title="Ir a paquetes, Herramientas"></a></div>
                    <div id="Calidadesboton" class="icon-out dropdown"><a class="extender-dropdown" href="index.php?mod=packages&f=0&fq=-1&qry=&page=1&${sh.get()}"><svg class="svg-extender-color" xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: rgb(154 143 143);"><path d="M22 8a.76.76 0 0 0 0-.21v-.08a.77.77 0 0 0-.07-.16.35.35 0 0 0-.05-.08l-.1-.13-.08-.06-.12-.09-9-5a1 1 0 0 0-1 0l-9 5-.09.07-.11.08a.41.41 0 0 0-.07.11.39.39 0 0 0-.08.1.59.59 0 0 0-.06.14.3.3 0 0 0 0 .1A.76.76 0 0 0 2 8v8a1 1 0 0 0 .52.87l9 5a.75.75 0 0 0 .13.06h.1a1.06 1.06 0 0 0 .5 0h.1l.14-.06 9-5A1 1 0 0 0 22 16V8zm-10 3.87L5.06 8l2.76-1.52 6.83 3.9zm0-7.72L18.94 8 16.7 9.25 9.87 5.34zM4 9.7l7 3.92v5.68l-7-3.89zm9 9.6v-5.68l3-1.68V15l2-1v-3.18l2-1.11v5.7z"></path></svg></a>
                        <div id="CalidadesDropdown" class="extender-calidad">
                            <span style="padding-top: 1px;text-decoration-line: underline;">Calidades de objetos</span>
                            <div class="extender-calidad-dropdown"><a href="index.php?mod=packages&f=0&fq=0&qry=&page=1&${sh.get()}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: rgb(0 246 0);"><path d="M22 8a.76.76 0 0 0 0-.21v-.08a.77.77 0 0 0-.07-.16.35.35 0 0 0-.05-.08l-.1-.13-.08-.06-.12-.09-9-5a1 1 0 0 0-1 0l-9 5-.09.07-.11.08a.41.41 0 0 0-.07.11.39.39 0 0 0-.08.1.59.59 0 0 0-.06.14.3.3 0 0 0 0 .1A.76.76 0 0 0 2 8v8a1 1 0 0 0 .52.87l9 5a.75.75 0 0 0 .13.06h.1a1.06 1.06 0 0 0 .5 0h.1l.14-.06 9-5A1 1 0 0 0 22 16V8zm-10 3.87L5.06 8l2.76-1.52 6.83 3.9zm0-7.72L18.94 8 16.7 9.25 9.87 5.34zM4 9.7l7 3.92v5.68l-7-3.89zm9 9.6v-5.68l3-1.68V15l2-1v-3.18l2-1.11v5.7z"></path></svg></a></div>
                            <div class="extender-calidad-dropdown"><a href="index.php?mod=packages&f=0&fq=1&qry=&page=1&${sh.get()}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: rgb(81 89 247);"><path d="M22 8a.76.76 0 0 0 0-.21v-.08a.77.77 0 0 0-.07-.16.35.35 0 0 0-.05-.08l-.1-.13-.08-.06-.12-.09-9-5a1 1 0 0 0-1 0l-9 5-.09.07-.11.08a.41.41 0 0 0-.07.11.39.39 0 0 0-.08.1.59.59 0 0 0-.06.14.3.3 0 0 0 0 .1A.76.76 0 0 0 2 8v8a1 1 0 0 0 .52.87l9 5a.75.75 0 0 0 .13.06h.1a1.06 1.06 0 0 0 .5 0h.1l.14-.06 9-5A1 1 0 0 0 22 16V8zm-10 3.87L5.06 8l2.76-1.52 6.83 3.9zm0-7.72L18.94 8 16.7 9.25 9.87 5.34zM4 9.7l7 3.92v5.68l-7-3.89zm9 9.6v-5.68l3-1.68V15l2-1v-3.18l2-1.11v5.7z"></path></svg></a></div>
                            <div class="extender-calidad-dropdown"><a href="index.php?mod=packages&f=0&fq=2&qry=&page=1&${sh.get()}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: rgb(227 3 224);"><path d="M22 8a.76.76 0 0 0 0-.21v-.08a.77.77 0 0 0-.07-.16.35.35 0 0 0-.05-.08l-.1-.13-.08-.06-.12-.09-9-5a1 1 0 0 0-1 0l-9 5-.09.07-.11.08a.41.41 0 0 0-.07.11.39.39 0 0 0-.08.1.59.59 0 0 0-.06.14.3.3 0 0 0 0 .1A.76.76 0 0 0 2 8v8a1 1 0 0 0 .52.87l9 5a.75.75 0 0 0 .13.06h.1a1.06 1.06 0 0 0 .5 0h.1l.14-.06 9-5A1 1 0 0 0 22 16V8zm-10 3.87L5.06 8l2.76-1.52 6.83 3.9zm0-7.72L18.94 8 16.7 9.25 9.87 5.34zM4 9.7l7 3.92v5.68l-7-3.89zm9 9.6v-5.68l3-1.68V15l2-1v-3.18l2-1.11v5.7z"></path></svg></a></div>
                            <div class="extender-calidad-dropdown"><a href="index.php?mod=packages&f=0&fq=3&qry=&page=1&${sh.get()}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: rgb(255 106 0);"><path d="M22 8a.76.76 0 0 0 0-.21v-.08a.77.77 0 0 0-.07-.16.35.35 0 0 0-.05-.08l-.1-.13-.08-.06-.12-.09-9-5a1 1 0 0 0-1 0l-9 5-.09.07-.11.08a.41.41 0 0 0-.07.11.39.39 0 0 0-.08.1.59.59 0 0 0-.06.14.3.3 0 0 0 0 .1A.76.76 0 0 0 2 8v8a1 1 0 0 0 .52.87l9 5a.75.75 0 0 0 .13.06h.1a1.06 1.06 0 0 0 .5 0h.1l.14-.06 9-5A1 1 0 0 0 22 16V8zm-10 3.87L5.06 8l2.76-1.52 6.83 3.9zm0-7.72L18.94 8 16.7 9.25 9.87 5.34zM4 9.7l7 3.92v5.68l-7-3.89zm9 9.6v-5.68l3-1.68V15l2-1v-3.18l2-1.11v5.7z"></path></svg></a></div>
                            <div class="extender-calidad-dropdown"><a href="index.php?mod=packages&f=0&fq=4&qry=&page=1&${sh.get()}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: rgb(255 0 0);"><path d="M22 8a.76.76 0 0 0 0-.21v-.08a.77.77 0 0 0-.07-.16.35.35 0 0 0-.05-.08l-.1-.13-.08-.06-.12-.09-9-5a1 1 0 0 0-1 0l-9 5-.09.07-.11.08a.41.41 0 0 0-.07.11.39.39 0 0 0-.08.1.59.59 0 0 0-.06.14.3.3 0 0 0 0 .1A.76.76 0 0 0 2 8v8a1 1 0 0 0 .52.87l9 5a.75.75 0 0 0 .13.06h.1a1.06 1.06 0 0 0 .5 0h.1l.14-.06 9-5A1 1 0 0 0 22 16V8zm-10 3.87L5.06 8l2.76-1.52 6.83 3.9zm0-7.72L18.94 8 16.7 9.25 9.87 5.34zM4 9.7l7 3.92v5.68l-7-3.89zm9 9.6v-5.68l3-1.68V15l2-1v-3.18l2-1.11v5.7z"></path></svg></a></div>
                        </div>
                    </div>
                    </submenu>
                </div>
            </div>
            `);
        let menuBotonPaquetes = document.getElementById("menuBotonPaquetes");
        let extenderPaquetes = document.getElementById("extenderPaquetes");
        extenderPaquetes.addEventListener("mouseenter",()=>{
            menuBotonPaquetes.style.display = 'block';
        })
        extenderPaquetes.addEventListener("mouseleave",()=>{
            menuBotonPaquetes.style.display = 'none';
        })
        let Calidadesboton = document.getElementById("Calidadesboton")
        let CalidadesDropdown = document.getElementById("CalidadesDropdown")
        Calidadesboton.addEventListener("mouseenter",()=>{
            CalidadesDropdown.style.display = "block";
        })
        Calidadesboton.addEventListener("mouseleave",()=>{
            CalidadesDropdown.style.display = "none";
        })
    }
}

class GuardarOro{
    static UI(){
        if(!!document.getElementById("gca-footer-links") == true){
        Menu.addConfig(`
            <h3>Guardar Oro</h3>
            <ul><label><input id="GuardarOroCheck" type="checkbox"> Guardar tu oro automaticamente<label></ul>
            <ul><select id="TipoDeGuardado" class="GTSelectMenu">
                <option>Mercado</option>
                <option disabled>Casa de subastas</option>
                <option>Entrenamiento</option>
             </select>
             </ul>

        `);
        }else{
        Menu.addConfig(`
            <h3>Guardar Oro</h3>
            <ul><label><input id="GuardarOroCheck" type="checkbox"> Guardar tu oro automaticamente<label></ul>
            <ul><select id="TipoDeGuardado" class="GTSelectMenu">
                <option title="Es necesario instalar la extencion Gladiatus Crazy Add On" disabled>Mercado</option>
                <option disabled>Casa de subastas</option>
                <option>Entrenamiento</option>
             </select>
             </ul>

        `);
        }
        let GuardarOroCheck = document.getElementById("GuardarOroCheck");
        ;
        let TipoDeGuardado = document.getElementById("TipoDeGuardado")

        if (localStorage.GuardarOroCheck == undefined) {
            localStorage.GuardarOroCheck = GuardarOroCheck.checked
        } else {
            GuardarOroCheck.checked = JSON.parse(localStorage.GuardarOroCheck);
        }
        GuardarOroCheck.addEventListener("change", () => {
            localStorage.GuardarOroCheck = GuardarOroCheck.checked;
            location.reload();
        })

        if (localStorage.TipoDeGuardado == undefined) {
            localStorage.TipoDeGuardado = TipoDeGuardado.selectedIndex
        } else {
            TipoDeGuardado.selectedIndex = localStorage.TipoDeGuardado;
        }
        TipoDeGuardado.addEventListener("change", () => {
            localStorage.TipoDeGuardado = TipoDeGuardado.selectedIndex;
            location.reload();
        })

        if(TipoDeGuardado.selectedIndex == 0 || TipoDeGuardado.selectedIndex == 1){
            insertOnPage.afterend(TipoDeGuardado,`<ul>Oro Máximo a tener suelto: <input id="OroMaximoSuelto" style="width: 100px;background: white;" value="0"></ul`);
            let OroMaximoSuelto = document.getElementById("OroMaximoSuelto")
            if (localStorage.OroMaximoSuelto == undefined) {
                localStorage.OroMaximoSuelto = OroMaximoSuelto.value
            } else {
                OroMaximoSuelto.value = localStorage.OroMaximoSuelto;
            }
            OroMaximoSuelto.addEventListener("input", () => {
                localStorage.OroMaximoSuelto = OroMaximoSuelto.value;
            })
        }

        if(TipoDeGuardado.selectedIndex == 2){
            insertOnPage.afterend(TipoDeGuardado,`
            <select id="SeleccionarEntrenamiento" class="GTSelectMenu"><option>Fuerza</option><option>Destreza</option><option>Agilidad</option><option>Constitución</option><option>Carisma</option><option>Inteligencia</option></select>
            `)

            let SeleccionarEntrenamiento = document.getElementById("SeleccionarEntrenamiento");
            if (localStorage.SeleccionarEntrenamiento == undefined) {
                localStorage.SeleccionarEntrenamiento = SeleccionarEntrenamiento.selectedIndex
            } else {
                SeleccionarEntrenamiento.selectedIndex = localStorage.SeleccionarEntrenamiento;
            }
            SeleccionarEntrenamiento.addEventListener("change", () => {
                localStorage.SeleccionarEntrenamiento = SeleccionarEntrenamiento.selectedIndex;
            })
        }
    }
    static VerSiTengoOro(oroTrigger){
        let oroTriggerParse = parseInt(oroTrigger)
        if(oro > oroTriggerParse){
            return true;
        }else{
            return false;
        }
    }

    static Guardar(){
        let EntrenamientoLink = `https://s45-es.gladiatus.gameforge.com/game/index.php?mod=training&${sh.get()}`;
        let GuardarOroCheck = document.getElementById("GuardarOroCheck")

        function Entrenamiento() {
            let tipoDeGuardado = {
                __ifNeedChoiseAnStat : ()=>{
                    let SeleccionarEntrenamiento = document.getElementById("SeleccionarEntrenamiento");
                    return SeleccionarEntrenamiento.selectedIndex;
                }
            }
            let data = {
                init : ()=>{
                    if (getURL[0] == "?mod=training") {
                        let TrainingBox = document.getElementById("training_box");
                        let Stats = {
                            get : ()=>{
                                let stats = []
                                for (let index = 1; index < 7; index++){
                                    stats.push(TrainingBox.children[index])
                                }
                                return stats;
                            },
                            push : ()=>{
                                let statPrices = []
                                for (let statPrice of Stats.get()) {
                                    statPrices.push(parseInt(statPrice.children[1].children[0].children[0].innerText.replace(/\./g, '')))
                                }
                                localStorage.PlayerStatsPrices = JSON.stringify(statPrices);
                            }
                        }
                        Stats.push();
                    }
                }
            }
            if(localStorage.PlayerStatsPrices == undefined){
                window.location.href = EntrenamientoLink;
            }
                data.init()
            let training_box = document.getElementById("training_box");
            let trainButtons = {
                get : ()=>{
                    let buttons = []
                        for (let index = 1; index < 7; index++) {
                            buttons.push(training_box.children[index].children[1].children[1])
                        }
                    return buttons;
                }
            }

            /////////////
            //ir a guardar
            let playerStatsPrices = JSON.parse(localStorage.PlayerStatsPrices)
            if(playerStatsPrices[tipoDeGuardado.__ifNeedChoiseAnStat()] < oro){
                window.location.href = EntrenamientoLink;
                trainButtons.get()[tipoDeGuardado.__ifNeedChoiseAnStat()].click();
            }
        }

        let MercadoDeAlianza = {
            VerificarOro : function() {
                let oroMaximoSuelto = parseInt(document.getElementById("OroMaximoSuelto").value);
                let oro = parseInt(document.getElementById("sstat_gold_val").innerText.replace(/\./g, ''));
                if(oro > oroMaximoSuelto){
                    return true;
                } else {
                    return false;
                }
            },
            IrAMercado : function(){
                window.addEventListener("load", function(event) {
                    TimeSaver.StopBot();
                    window.location.href = `https://s45-es.gladiatus.gameforge.com/game/index.php?mod=guildMarket&${sh.get()}`
                });
            },
            Comprar : function(){
                let botonComprar = document.getElementById("CompraTodo");
                botonComprar.click();
            },
            IrARecoger : function(){
                //
                window.location.href = `https://s45-es.gladiatus.gameforge.com/game/index.php?mod=packages&${sh.get()}&${getURL[getURL.length-1]}`

            },
            Recoger : function(){
                document.getElementById("buscarRotativos").click()
                let item = document.getElementById("MercadoFavoritos").children[1].children[2].children[0];
                //item.dispatchEvent(dobleClickEvent)
                var target = document.getElementById("inv");
                var target2 = document.getElementById("MercadoFavoritos").children[1].children[2];


                const observerInventario = new MutationObserver((mutationList) => {
                    mutationList.forEach((mutation)=> {
                        if(mutation.removedNodes.length){
                            item.dispatchEvent(dobleClickEvent);
                        }
                    })
                });
                const observerMercadoFavoritos = new MutationObserver((mutationList) => {
                    mutationList.forEach((mutation)=> {
                        if(mutation.removedNodes.length){
                            console.log('Eliminado', mutation.removedNodes[0]);
                            window.location.href = `https://s45-es.gladiatus.gameforge.com/game/index.php?mod=guildMarket&${sh.get()}&r${getURL[getURL.length-1]}`
                        }
                    })
                });

                const observerOptions = {
                    attributes: true,
                    childList: true,
                    subtree: true,
                    characterData: false,
                    attributeOldValue: false,
                    characterDataOldValue: false
                };

                observerInventario.observe(target, observerOptions);
                observerMercadoFavoritos.observe(target2, observerOptions);


            },
            Vender : function(){
                var target = document.getElementById("inv");
                let botonVender = document.getElementsByName("anbieten")[0];

                 const observerInventario = new MutationObserver((mutationList) => {
                    mutationList.forEach((mutation)=> {
                        if(mutation.removedNodes.length){
                            setTimeout(function(){
                                let item = document.getElementById("inv").children[0];
                                item.dispatchEvent(dobleClickEvent);

                                //llenado de formulario
                                document.getElementById("preis").value = getURL[getURL.length-1].slice(13);
                                document.getElementById("dauer").value = 3;

                                setTimeout(function(){
                                    TimeSaver.ContinueBot()
                                    botonVender.click();
                                },2000);

                            }, 2000);
                        }
                    })
                });
                const observerOptions = {
                    attributes: true,
                    childList: true,
                    subtree: true,
                    characterData: false,
                    attributeOldValue: false,
                    characterDataOldValue: false
                };
                observerInventario.observe(target, observerOptions);

            },
            ReescribirForm : function(){
                let formulario = document.getElementById("sellForm");
                formulario.action = formulario.action+="&vendido";
            },
            Run : function() {
                if(MercadoDeAlianza.VerificarOro() && getURL[0] != "?mod=guildMarket"){
                    MercadoDeAlianza.IrAMercado();
                };
                if(getURL[0] == "?mod=guildMarket" && getURL[getURL.length-1].slice(0,11).includes("precioventa") == true){
                    MercadoDeAlianza.IrARecoger();
                } else if(MercadoDeAlianza.VerificarOro() && getURL[0] == "?mod=guildMarket" && getURL[getURL.length-1].slice(0,11).includes("precioventa") == false){
                    MercadoDeAlianza.Comprar();
                }
                if(getURL[0] == "?mod=packages" && getURL[getURL.length-1].slice(0,11).includes("precioventa") == true){
                    MercadoDeAlianza.Recoger();
                }
                if(getURL[0] == "?mod=guildMarket" && getURL[getURL.length-1].slice(0,12).includes("rprecioventa") == true){
                    MercadoDeAlianza.ReescribirForm()
                    MercadoDeAlianza.Vender()
                }
                if(getURL[0] == "?mod=guildMarket" && getURL[getURL.length-1].includes("vendido") == true){
                    window.addEventListener("load", function(event) {
                        TimeSaver.ContinueBot();
                    });
                }
            }
        }

        if(GuardarOroCheck.checked){
            let TipoDeGuardado_value = document.getElementById("TipoDeGuardado").value

            const GUARDAR_ORO = {
                "Mercado" : function() {
                    MercadoDeAlianza.Run();
                },
                "Casa de subastas" : function() {
                    console.log("Casa de Subastas")
                },
                "Entrenamiento" : function() {
                    Entrenamiento();
                }
            }

            GUARDAR_ORO[TipoDeGuardado_value]();
        }



    }




    static Run(){
        GuardarOro.UI();
        GuardarOro.Guardar();

    }
}

insertOnPage.beforeend(document.body,`
<style>
 .menutools {
     display: none;
     width: 422px;
     height: -webkit-fill-available;
     position: fixed;
     z-index: 10000;
     top: 0;
     right: 0;
     background-color: #111;
     overflow-x: hidden;
     padding-top: 16px;
     padding-left: 12px;
}
 .menutools a {
     padding: 8px 8px 8px 32px;
     text-decoration: none;
     font-size: 25px;
     color: #818181;
     display: block;
}
 .menutools a:hover {
     color: #f1f1f1;
}
 .menutools .closebtn {
     position: absolute;
     top: 0;
     right: 25px;
     font-size: 36px;
     margin-left: 50px;
}
 .menutools > h1{
     color: #ffffff;
}
 .menutools > h2{
     color: #ffffff;
}
 .menutools > h3{
     color: #ffffff;
}
 .menutools > label{
     color: #ffffff;
}
 .menutools > div{
     color: #ffffff;
}
 .btnMenu{
     font-size:20px;
     cursor:pointer;
     position: fixed;
     top: 134px;
     right: 4%;
     background: transparent;
     border: transparent;
     z-index: 10000;
}
 @media screen and (max-height: 450px) {
     .menutools {
         padding-top: 15px;
    }
     .menutools a {
         font-size: 18px;
    }
}
/* Notifications */
 .notification-box{
     cursor: pointer;
     background-position: 15px center;
     background-repeat: no-repeat;
     box-shadow: 0 0 12px #000;
     color: #FFFFFF;
     margin: 0 0 6px;
     opacity: 0.9;
     padding: 5px 5px 5px 28px;
     width: 200px;
     white-space: pre-wrap;
     z-index: 10000;
}
 .notification-info{
     background-color: #2F96B4;
     border: 1px solid #267890;
}
 .panelBusqueda{
     position: inherit;
     height: 41px;
     width: 299px;
     background: #ded2ad;
     left: 305px;
     top: -33px;
}
 .buscarRotativos{
     position: relative;
     right: -22px;
     top: -26px;
     color: white;
     font-weight: bold;
     font-size: 12px;
}
 .SelectCategorias {
     position: relative;
     right: -39px;
     top: -23px;
     width: 130px;
     font-size: 15px;
}
 .Favoritos {
     position: relative;
     width: 294px;
     height: 97px;
     top: -24px;
     background: rgb(222, 210, 173);
     padding: 18px 0px 0px 16px;
     overflow: scroll;
     overflow-x: hidden;
}
 .Favoritos::-webkit-scrollbar {
     width: 10px;
}
/* Track */
 .Favoritos::-webkit-scrollbar-track {
     background: #f1f1f1;
}
/* Handle */
 .Favoritos::-webkit-scrollbar-thumb {
     background: #888;
}
/* Handle on hover */
 .Favoritos::-webkit-scrollbar-thumb:hover {
     background: #555;
}
 .menuBotonPaquetes {
     display: none;
     position: absolute;
     opacity: 1;
     background: rgb(222, 210, 173);
     top: 17px;
     right: -15px;
     padding: 10px;
     z-index: 10;
     max-width: 95px;
}
 #menuBotonPaquetes .icon-out {
     float: left;
}
 #menuBotonPaquetes .icon {
     width: 25px;
     height: 25px;
     display: block;
     cursor: pointer;
}
 .food-icon {
     background: transparent url(https://cdn.jsdelivr.net/gh/lpachecob/Gladiatus-Tools@main/images/buttons.png) -395px 0px no-repeat;
}
 .gold-icon {
     background: transparent url('https://cdn.jsdelivr.net/gh/lpachecob/Gladiatus-Tools@main/images/buttons.png') -170px 0px no-repeat;
}
 .tool-icon {
     background: #9f824e url(https://cdn.jsdelivr.net/gh/lpachecob/Gladiatus-Tools@main/images/item.png) 0px -6881px no-repeat;
     height: 25px !important;
     width: 38px !important;
     transform: scale(0.9);
}
 .pergamino-icon {
     background: url(https://cdn.jsdelivr.net/gh/lpachecob/Gladiatus-Tools@main/images/item.png) 0px -8226px no-repeat;
     height: 25px !important;
     width: 38px !important;
     transform: scale(0.8);
}
 .extederPaquetes {
     position: absolute;
     right: -10px;
     top: -3px;
     height: 19px;
     width: 21px;
     color: white;
     background: #8e2a2a;
     border: none;
}
 .extender-dropdown{
     margin: 0px 6px;
}
 .dropdown {
     position: relative;
     display: inline-block;
     border: 1px solid #b3aaaa;
     background: white;
}
 .extender-calidad{
     display: none;
     right: -119px;
     left: -5px;
     top: 19px;
     position: absolute;
     background-color: #ded2ad;
     box-shadow: 0px 8px 16px 0px rgb(0 0 0 / 20%);
     margin: 6px;
}
 .extender-calidad-dropdown{
     margin: 5px;
     padding-block: 5px 4px;
     background-color: white;
     border: 1px solid #b3aaaa;
     float: left;
}
 #header_menue{
     z-index: 40 !important;
}
 .GTSelectMenu {
     background-color: white;
     color: black;
     font-weight: bold;
}
 .collapsed{
     display: none;
}
 @media only screen and (max-width: 1760px) {
     .auto-settings {
         background: #453418 !important;
         width: 850px;
    }
     .auto-settings ul.tabs {
         background-image: none !important;
    }
     .auto-settings::-webkit-scrollbar {
         height: 10px;
    }
    /* Track */
     .auto-settings::-webkit-scrollbar-track {
         background: #f1f1f1;
    }
    /* Handle */
     .auto-settings::-webkit-scrollbar-thumb {
         background: #888;
    }
    /* Handle on hover */
     .auto-settings::-webkit-scrollbar-thumb:hover {
         background: #555;
    }
     .auto-settings .content.open{
         background-color: #e7ddba !important;
    }
     .gts-pause{
         right: 7px !important;
    }
}
 .gtools-icon {
     background: #b79a63 url(https://es.gladiatus-tools.com/favicon.png);
     background-size: cover;
}
 #MontodeRotativos{
     position: relative;
     top: -18px;
     right: -306px;
}
 #paquetesMercado {
     display: block;
     background-color: #ded2ad;
     max-height: 82px;
     overflow: scroll;
     overflow-x: hidden;
}
 #paquetesMercado::-webkit-scrollbar {
     width: 10px;
}
/* Track */
 #paquetesMercado::-webkit-scrollbar-track {
     background: #f1f1f1;
}
/* Handle */
 #paquetesMercado::-webkit-scrollbar-thumb {
     background: #888;
}
/* Handle on hover */
 #paquetesMercado::-webkit-scrollbar-thumb:hover {
     background: #555;
}

.mensajeMercado h1 {
    color: red;
    font-size: 14px;
    margin: -1px;
}
.mensajeMercado span {
    position: relative;
    top: -4px;
}


.charstats_value22{
    top: 3px;
}

</style>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
`)

//////////////////////////////////////////////////////////////////////
/**
* run script
*/
GladiatusTools.Run();

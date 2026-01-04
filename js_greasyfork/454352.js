// ==UserScript==
// @name         Idealista Scrapper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Alertas de nuevas viviendas en venta
// @author       Jose Montero
// @match        https://www.idealista.com/venta-viviendas/galdakao-vizcaya/?ordenado-por=fecha-publicacion-desc
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idealista.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454352/Idealista%20Scrapper.user.js
// @updateURL https://update.greasyfork.org/scripts/454352/Idealista%20Scrapper.meta.js
// ==/UserScript==

var tituloPestana = "[Scrapping Idealista]";
var chatTelegram = "https://t.me/palemoonscrapper220";
var idBotTelegram = "5588070773:AAH-1_ug-o9wiclvw1b-Ddx33KymP7EbUa4";

async function comprobarViviendas(){
    await recorrerPantalla();
    var listaViviendas = document.getElementsByClassName('item item-multimedia-container');
    if(listaViviendas != null && listaViviendas.length > 0){
        for(let vivienda of listaViviendas){
            var idVivienda = vivienda.getAttribute('data-adid');
            if(idVivienda != null && idVivienda != 'undefined' && (localStorage.getItem(idVivienda) == 'null' || localStorage.getItem(idVivienda) == null)){
            var imagenVivienda = vivienda.getElementsByTagName("img")[0] != undefined ? vivienda.getElementsByTagName("img")[0].getAttribute("src") : "https://pbs.twimg.com/profile_images/1411961450319552512/YqpMnKMm_400x400.jpg";
            var enlaceVivienda = vivienda.getElementsByTagName("a")[0].getAttribute("href");
            var tituloVivienda = vivienda.getElementsByTagName("a")[0].getAttribute("title");
            var precioVivienda = vivienda.getElementsByClassName("item-price h2-simulated")[0].textContent;
            var infoVivienda = "";
            for(let info of vivienda.getElementsByClassName('item-detail')){
                infoVivienda = infoVivienda + "📍 " + info.textContent + "%0A";
            }
            enviarMensajeTG(imagenVivienda, enlaceVivienda, tituloVivienda, precioVivienda, infoVivienda);
            localStorage.setItem(idVivienda,idVivienda);
            } else {
                console.log("Vivienda ya existente " + idVivienda);
            }
            await new Promise(r => setTimeout(r, 1000));
        }
    }
}

async function recorrerPantalla(){
    var altura = 0;
    while(altura < document.body.scrollHeight){
        await new Promise(r => setTimeout(r, 1000));
        await window.scrollTo(altura, altura+750);
        altura = altura + 750;
    }
    await window.scrollTo(altura,0);
    await new Promise(r => setTimeout(r, 1000));
}

async function enviarMensajeTG(imagenVivienda, enlaceVivienda, tituloVivienda, precioVivienda, infoVivienda){
 	var imagen = imagenVivienda;
    var enlace = "🔗 <a href='https://www.idealista.com"+enlaceVivienda+"'> Ver en Idealista </a>"
    var titulo = "🏡 " + tituloVivienda;
    var precio = "💶 " + precioVivienda;
    var info = infoVivienda;
    var chat = chatTelegram;
    var botApi = 'https://api.telegram.org/bot'+idBotTelegram+'/';
	var xmlhttp = new XMLHttpRequest();
	var messageType = "sendPhoto"
    xmlhttp.open("GET",botApi + messageType + "?chat_id=" + chat + "&parse_mode=HTML&caption=" + titulo + "%0A" + precio + " %0A" + enlace + "%0A" + info + "&photo=" + imagen,true);

	xmlhttp.send();
}

(function() {
    document.title = tituloPestana;
    setTimeout(function () {
		location.reload();
	}, 400000);
    comprobarViviendas();
})();



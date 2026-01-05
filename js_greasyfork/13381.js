// ==UserScript==
// @name         Script JKStyle
// @namespace    https://openuserjs.org/scripts/AngelKrak/Script_JKStyle
// @description  Script para cambiar "Funciones" de JKanime
// @author       Angel Komander(AK)
// @website      http://angelkrak.hol.es
// @version      0.8
// @include      http://*jkanime.net/*
// @include      http://*www.jkanime.net/*

// @downloadURL https://update.greasyfork.org/scripts/13381/Script%20JKStyle.user.js
// @updateURL https://update.greasyfork.org/scripts/13381/Script%20JKStyle.meta.js
// ==/UserScript==
// Version 0.3 JKStyle - NOVEDADES [26-Oct-15]
/* Version Primera que traia todo por Defecto */
// Version 0.4 JKStyle - NOVEDADES [14-Sep-15]
/* Cambios en las Etiquetas y Imagen de Preview en Enlaces + Semi-Transparencia en Titulos de JK */
// Version 0.5 JKStyle - NOVEDADES [02-Nov-15]
/* Nuevo ModalBox para las Miniaturas + Nuevo Color para los Titulos del Script */
// Version 0.6 JKStyle - NOVEDADES [03-Nov-15]
/* Nuevo Boton para Eliminar la Imagen que has puesto en X Seccion, Boton para copiar el Enlace de la Imagen, Imagen por Defecto(Si no has puesto ninguna imagen, aparecera otra imagen por Defecto) y Nuevo Scrollbar para los Enlaces */
// Version 0.7 JKStyle - NOVEDADES [04-Nov-15]
/* Cursor Personalizado, Ocultar el Sidebar al Expandir el Reproductor, Ancho Maximo en el Script + Scroll en el Enlace, Nuevo Boton para Añadir la Imagen Individualmente, Nuevo Tamaño para las Imagenes del Modal, Mostrar/Ocultar Sidebar, Scrollbar de JKAnime Custom */
// Version 0.8 JKStyle - NOVEDADES [05-Nov-15]
/* Nuevo Imagen para el Boton del Script, Script de Copy to Clipboard */


/* Estilos para la Transparencia*/
jQuery('head').append('<style id="transparent" type="text/css">::-webkit-scrollbar{-webkit-appearance: none; width: 7px;}::-webkit-scrollbar-thumb{border-radius: 4px; background-color: rgba(0,0,0,.5); -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);}.slideback{padding: 10px;background: rgba(255,255,255, .5);}.lista_title,.sinopsis_title,.optional_title{color: #212123;background: rgba(255,255,255, .7);}.srcpage_title{margin: 0;background: rgba(255,255,255, .7);width: 586px;color: #212123;border-radius: 7px 7px 0px 0px;}.listpage{margin:5px 0px;}#content-episodes li{width:542px;}.listpage li{width: 490px;}#content{background:0 0;border:1px solid #D5D5D5;border-radius:3px}#global{background-attachment:fixed;background-position:50% 0;background-repeat:no-repeat;background-size:100%;height:100%}#latest_animes_menu{background:rgba(242,246,247,.4)}#select_lang{color:#000}#simplemodal-container code{background:rgba(0,0,0,.3);color:#fff}.listpage li a:hover,.rated_stars span,.spec:hover div a,.src_box{color:#000}#top_menu{background:0 0;border:1px solid #D5D5D5}#videobox_content div,.video_option_act{position:relative;z-index:9999}.capitulos_right .seoblock{background-color:rgba(249,249,249,.6)}#letters_bg,#select_lang,.comment_like,.cont_top,.latest_end,.listbox,.listpage .search,.publibox,.publibox iframe,.ratedback,.ratedwhite,.select_lang_act,.srcpage_box,.video_actions,.videobox{background:0 0}.listpage .search,.listpage .search p{color:#000;opacity:.99}.listpage .search:hover,.listpage li:hover{background-color:rgba(249,249,249,.6)}.mode_extend{width:100%}.nivo-caption p{opacity:1}.player_conte{display:block}#a4gss77519563910,#moveboxr,.ads_home,.search_right .feed_box,div>div>div>div>object>embed{display:none !important}.publibox iframe{height:218px}.ratedul li:hover,.spec:hover{background-color:rgba(249,249,249,.5)}.search_right .publibox:nth-child(1){background-size:100% 100%;height:500px}.select_lang_act{margin:1.5px 0 0 170px}.descripbox,.listnavi .listpag,.listpage li,.seoblock{background-color:rgba(242,246,247,.3)}.simplemodal-container{background-color:rgba(249,249,249,.6);z-index:999999}.sinopsis_title{border-radius:9px 6px 0 0;margin:0;width:552px}.src_box{background:0 0;font-family:georgia;font-size:18px;outline:0}.sticboxl_act,.video_actions_act{position:relative;z-index:9999}.comment_like,.video_left>.videobox{background:rgba(255,255,255,.5)}.video_right .publibox:nth-child(1){background-size:100% 100%;height:500px;position:relative;/*margin-top: -100%;transform: translate(-0%, -30%);*/}.nivo-caption p{opacity:1 !important;}</style>');

/* Estilos para el Script*/
jQuery('head').append('<style id="script" type="text/css">#setfondo,#setsidebar,#setcursor{float:right;padding:12px;position:relative;margin:-45px -20px 0 0;z-index:10}.imglink span {width: 50%;display: inline-block;overflow:auto;padding-bottom:10px;padding-top: 8px;}.imglink span::-webkit-scrollbar{width:7px;height:7px}.imglink span::-webkit-scrollbar-thumb{background-color:rgba(0,0,0,.3)}.imglink span:hover::-webkit-scrollbar-thumb{background-color:rgba(0,0,0,.8)}.btn-del,.btn-copy,.btn-add{padding:10px;color:#fff;background-color:#ff5252;box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);font-family:Roboto,Helvetica,Arial,sans-serif;font-size:14px;font-weight:500;border-radius:2px;max-width:70px;display:block;text-decoration:none}div.cont-btn{float:right;margin:-10px 0}.btn-del{margin-top:6px;}.btn-copy{background:#039be5;}.setimg{background:#009688}.imglink img{width:100px;vertical-align:top;height:80px;margin:-15px 15px -15px -15px;}.button,.label{margin-top:-1px}.arrow,.button,h2.insert{cursor:pointer}.button,.label input{outline:0;width:100%}.selectJK{max-width: 400px;position:fixed;right:0;transition:all .9s ease;transform:translateX(100%)}.arrow{/*border-right:25px solid rgba(125,0,240, .5);border-top:25px solid transparent;border-bottom:25px solid transparent;*/position:absolute;content:"";top:5%;left:-64px;width:64px;height:64px;transition:all .8s ease;background-image: url("https://s3.amazonaws.com/quandl-static-content/Chart+of+the+Day/Left+arrow.png");background-size: cover;opacity: 0.6;}.arrow.right{background-image: url("https://s3.amazonaws.com/quandl-static-content/Chart+of+the+Day/Right+arrow.png")}.arrow:hover{opacity: 1;}.label{position:relative;display:block}.label input{padding:15px;border:1px solid #ddd}.button{padding:15px;border:1px solid #145fd7;background:#4a87ee;color:#fff;font-weight:400;font-family:Helvetica;font-size:16px;box-sizing:content-box;box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);}h2.insert{background-color: rgb(63,81,181);color: rgb(255,255,255);box-shadow: 0 3px 3px 0 rgba(0,0,0,.14),0 3px 2px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);text-align:center;width:100%;padding:16px;margin-bottom:-1px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}.imglink{padding: 15px;width:100%;outline:0;border:1px solid #ddd;background:#fff;display:block;}#global, .selectJK{z-index:10000;}.video_right{margin-top: -100%;transform: translate(-0%, 51%);position: relative;}.toggle-side{background-size:cover !important;position:absolute;right:0;top:0;margin:30px 5px 30px 30px;z-index:10;width:46px;height:38px;cursor:pointer}.toggle-side.hide{background: url("http://www.presentation-process.com/wp-content/uploads/keep-hidden-icon.png");}.toggle-side.show{background: url("http://iconsineed.com/icons/faticons/view-01-128.png");}.video_right2{margin-top: -54%;transform: translate(0%, 0%);}</style>');

/* Estilos para el ModalBox */
jQuery('head').append('<style id="modalbox" type="text/css">#modalindex{display:inline-block;margin:5px}.modalimg{background:#fff;padding:5px}#modalcontent{position:fixed;top:50%;width:60vw;height:60vh;margin:0 20vw;margin-top:calc(-60vh / 2);z-index:10001;-webkit-transform:scale(0);-moz-transform:scale(0);-ms-transform:scale(0);-o-transform:scale(0);transform:scale(0);-webkit-transition:all 1s ease-in-out;-moz-transition:all 1s ease-in-out;-ms-transition:all 1s ease-in-out;-o-transition:all 1s ease-in-out;transition:all 1s ease-in-out}#modalcontouter{position:relative;width:100%;height:100%}#modalcontent #modalclose{background:url(http://cs.angelkrak.hol.es/archivos/close.png) no-repeat;background-size:cover;position:absolute;width:30px;height:30px;top:0;right:0;z-index:10001;margin:-20px}#modalcontimg{outline:0;position:relative;border:10px solid #fff;max-width:420px;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}#modalcontimg .modalimg{width:100%;padding:0;margin:0;border:none;outline:0;vertical-align:top}</style>');

/* Agregamos el contenido del Arrow(Cambiador de Imagenes) */
$("#global").append('<div class="selectJK"> <div class="arrow"></div><div class="uno"> <h2 class="insert">Insertar Imagenes</h2> <label class="label"> <input type="text" placeholder="Fondo de Imagen" id="fondo"> <a href="#" id="setfondo" class="btn-add setimg"><div class="addM">Agregar</div></a></label> <label class="label"> <input type="text" placeholder="Sidebar" id="sidebar"> <a href="#" id="setsidebar" class="btn-add setimg"><div class="addM">Agregar</div></a></label> <label class="label"> <input type="text" placeholder="Cursor" id="cursor"> <a href="#" id="setcursor" class="btn-add setimg"><div class="addM">Agregar</div></a></label> <button class="button" id="boton-guardar">Insertar</button> </div><div class="dos"> <h2 class="insert">Mostrar Enlaces</h2> <div class="imglink"> <a href="#" class="modalink" id="FondoW"><img src="http://www.emprend3.mx/images/site/imagen-no-disponible.png" alt="FondoM" id="FondoM" class="modalimg"/></a><span id="fondoM"></span> <div class="cont-btn"> <a href="#" id="copy-FondoM" class="btn-copy"> <div class="copyM btn" data-clipboard-target="#fondoM">Copiar</div></a> <a href="#" id="del-FondoM" class="btn-del"> <div class="delM">Eliminar</div></a> </div></div><div class="imglink"> <a href="#" class="modalink" id="SidebarW"><img src="http://www.emprend3.mx/images/site/imagen-no-disponible.png" alt="SidebarM" id="SidebarM" class="modalimg"/></a><span id="sidebarM"></span> <div class="cont-btn"> <a href="#" id="copy-SidebarM" class="btn-copy"> <div class="copyM btn" data-clipboard-target="#sidebarM">Copiar</div></a> <a href="#" id="del-SidebarM" class="btn-del"> <div class="delM">Eliminar</div></a> </div></div><div class="imglink"> <a href="#" class="modalink" id="CursorW"><img src="http://www.emprend3.mx/images/site/imagen-no-disponible.png" alt="CursorM" id="CursorM" class="modalimg"/></a><span id="cursorM"></span> <div class="cont-btn"> <a href="#" id="copy-CursorM" class="btn-copy"> <div class="copyM btn" data-clipboard-target="#cursorM">Copiar</div></a> <a href="#" id="del-CursorM" class="btn-del"> <div class="delM">Eliminar</div></a> </div></div></div></div>');

/* Agregamos la imagen para Ocultar y Mostrar Sidebar */
$(".video_right").append('<div class="toggle-side hide"></div>');

var clipboard = new Clipboard('.btn');

clipboard.on('success', function(e) {
  console.info('Action:', e.action);
  console.info('Text:', e.text);
  console.info('Trigger:', e.trigger);

  e.clearSelection();
  showTooltip(e.trigger, 'Copied!');
});

clipboard.on('error', function(e) {
  console.error('Action:', e.action);
  console.error('Trigger:', e.trigger);
  showTooltip(e.trigger, fallbackMessage(e.action));
});

/* Boton Open */
$.open = 0;

$(".arrow").click(function(e) {
	e.preventdefault;
	if ($.open === 0) {
		$(".selectJK").css({
			"transform": "translateX(-32px)"
		});
		$(".arrow").css({
			"top": "50%"
		});
		$(this).addClass("right");
		$.open = 1;
	}else{
		$(".selectJK").css({
			"transform": "translateX(100%)"
		});
		$(".arrow").css({
			"top": "5%"
		});
		$(this).removeClass("right");
		$.open = 0;
	}
});

/* Script del ModalBox */
$('body').append('<div id="modalcontent"></div>');
$("#modalcontent").append('<div id="modalcontouter"></div>');
$('#modalcontouter').append('<div id="modalcontimg"></div>');
$("#modalcontimg").append('<a href="#" id="modalclose"></a>');
$(".modalink").click(function(e) {
	e.preventDefault;
	$("#modalcontent").css({
   		"transform": "scale(1)"
	});
	$("img", this).clone().appendTo('#modalcontent #modalcontimg');
	$("body").append('<div id="contover"><div id="#modalover" style="opacity: 0.7;cursor: pointer;height: 100vh;display: block;background-color: rgb(119, 119, 119);position: fixed;top: 0;left: 0;width: 100%;z-index: 10000;"></div></div>');
});
$("#modalclose").click(function(e) {
	e.preventDefault;
	$("#modalcontent").css({
   		"transform": "scale(0)"
	});
	setTimeout(function() {
    $("#modalcontimg .modalimg").remove();
	$('#contover:first').remove();
	},1000);
});

/* Cambiar Tamaño de la imagen del Modal segun el Click */
$("#FondoW").click(function() {
	$("#modalcontimg").css("max-width", "100%");
});
$(".imglink a:not(#FondoW)").click(function() {
	$("#modalcontimg").css("max-width", "420px");
});

/* */
$(".toggle-side").click(function() {
	$(".hide").toggleClass("show");
	$(".video_right .publibox:nth-child(1)").toggle();
	$(".video_right").toggleClass("video_right2");
});

/* Mostrar/Ocultar Sidebar al apretar el Boton de Expandir Reproductor*/
$(".expand_s").click(function() {
	$(".video_right .publibox").toggle();
});

/* Mostramos y Ocultamos */
$(".uno").show();
$(".dos .imglink").hide();

$("h2.insert").click(function() {
	$(".dos .imglink").slideToggle("slow");
});

$("h2.insert").click(function() {
	$(".uno label, #boton-guardar").slideToggle("slow");
});

/*Funcion de Capturar, Almacenar datos y Limpiar campos*/
$(document).ready(function(){
	//Establecer Imagen de Fondo
	$('#setfondo').click(function(){
		if (confirm('Estas Seguro(a) ?')) {
			/*Captura de datos escrito en los inputs*/        
			var fon = document.getElementById("fondo").value;
			/*Guardando los datos en el LocalStorage*/
			localStorage.setItem("Fondo", fon);
			/*Limpiando los campos o inputs*/
			document.getElementById("fondo").value = "";
		}
	});
	
	//Establecer Imagen de Sidebar
	$('#setsidebar').click(function(){
		if (confirm('Estas Seguro(a) ?')) {
			/*Captura de datos escrito en los inputs*/        
			var sid = document.getElementById("sidebar").value;
			/*Guardando los datos en el LocalStorage*/
			localStorage.setItem("Sidebar", sid);
			/*Limpiando los campos o inputs*/
			document.getElementById("sidebar").value = "";
		}
	});
	
	//Establecer Imagen del Cursor
	$('#setcursor').click(function(){
		if (confirm('Estas Seguro(a) ?')) {
			/*Captura de datos escrito en los inputs*/        
			var cur = document.getElementById("cursor").value;
			/*Guardando los datos en el LocalStorage*/
			localStorage.setItem("Cursor", cur);
			/*Limpiando los campos o inputs*/
			document.getElementById("cursor").value = "";
		}
	});
			
	/* Guarda todas las Imagenes Escritas en los Input */
	$('#boton-guardar').click(function(){
		if (confirm('Estas Seguro(a) ?')) {
			/*Captura de datos escrito en los inputs*/        
			var fon = document.getElementById("fondo").value;
			var sid = document.getElementById("sidebar").value;
			var cur = document.getElementById("cursor").value;

			/*Guardando los datos en el LocalStorage*/
			localStorage.setItem("Fondo", fon);
			localStorage.setItem("Sidebar", sid);
			localStorage.setItem("Cursor", cur);

			/*Limpiando los campos o inputs*/
			document.getElementById("fondo").value = "";
			document.getElementById("sidebar").value = "";
			document.getElementById("cursor").value = "";
		}
	});
});

/*Funcion Cargar y Mostrar datos*/
$(document).ready(function(){

	/*Obtener datos almacenados*/
	var fondo = localStorage.getItem("Fondo");
	var sidebar = localStorage.getItem("Sidebar");
	var cursor = localStorage.getItem("Cursor");

	/*Mostrar datos almacenados*/      
	var background = "background-image: url('"+fondo+"')";
	$("body #global").attr("style", background);
	document.getElementById("fondoM").innerHTML = fondo;
	var sidebar2 = "background-image: url('"+sidebar+"')";
	$(".video_right .publibox:nth-child(1)").attr("style", sidebar2);
	document.getElementById("sidebarM").innerHTML = sidebar;
	if(cursor) {
		var cursor2 = "cursor: url("+cursor+"), default";
		$("body").attr("style", cursor2);
		document.getElementById("cursorM").innerHTML = cursor;
	}else{
		$("body").attr("style", "cursor: url(http://cur.cursors-4u.net/anime/ani-11/ani1037.ani), url(http://cur.cursors-4u.net/anime/ani-11/ani1037.png), default;");
	}

	/* Preview de Imagenes */
	if (fondo){
		var backgroundimg = ""+fondo+"";
		$(".imglink #FondoM").attr("src", backgroundimg);
	}else{
		$(".imglink #FondoM").attr("src", "http://www.emprend3.mx/images/site/imagen-no-disponible.png");
	}
	
	if (sidebar){
		var sidebarimg = ""+sidebar+"";
		$(".imglink #SidebarM").attr("src", sidebarimg);
	}else{
		$(".imglink #SidebarM").attr("src", "http://www.emprend3.mx/images/site/imagen-no-disponible.png");
	}
	
	if (cursor){
		var cursorimg = ""+cursor+"";
		$(".imglink #CursorM").attr("src", cursorimg);
	}else{
		$(".imglink #CursorM").attr("src", "http://www.emprend3.mx/images/site/imagen-no-disponible.png");
	}
});   

/*Funcion Eliminar Imagenes y Limpiar campos*/
$(document).ready(function(){

//Eliminar Fondo de Imagen 
	$('#del-FondoM').click(function(){

		/*Eliminar imagen almacenada*/
		localStorage.removeItem("Fondo");

		/*Limpiar datos almacenados*/       
		document.getElementById('fondo').innerHTML = "";
	});

//Eliminar Imagen del Sidebar
	$('#del-SidebarM').click(function(){

		/*Eliminar imagen almacenada*/
		localStorage.removeItem("Sidebar");

		/*Limpiar datos almacenados*/       
		document.getElementById('sidebar').innerHTML = "";
	});

//Eliminar Imagen del Cursor
	$('#del-CursorM').click(function(){

		/*Eliminar imagen almacenada*/
		localStorage.removeItem("Cursor");

		/*Limpiar datos almacenados*/       
		document.getElementById('cursor').innerHTML = "";
	});
});
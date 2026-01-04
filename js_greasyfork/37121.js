// ==UserScript==
// @name          AdPrizeRanking_Update
// @namespace     by_Bigpetroman
// @description   Script para ayudar en el manejo del ranking internacional de AdPrizes
// @author 		  Bigpetroman
// @include       https://www.neobux.com/forum/?/1/284586/*
// @include       https://www.neobux.com/forum/?*284586*
// @version       1
// @license		  MIT
// @downloadURL https://update.greasyfork.org/scripts/37121/AdPrizeRanking_Update.user.js
// @updateURL https://update.greasyfork.org/scripts/37121/AdPrizeRanking_Update.meta.js
// ==/UserScript==

//Con esta línea, estamos declarando una función llamada trim() en la clase String, esto es para eliminar
//los espacios al inicio y final de cada linea
String.prototype.trim = function() {return this.replace(/^\s+|\s+$/g, ""); };

//var bottom_pix para determinar la posición de los botones, 
var bottom_pix = window.innerHeight / 2;
var bottom_pix_2 = window.innerHeight / 2;
//esta variable la colocamos en 2 si la resolucion horizontal de la ventana es menor a 1205
var TipoBoton = 1;

// common button style, estas variables permiten determinar la forma, color, tamaño, etc, de los botones
var css_button_General = 'cursor:pointer;width:140px; height:32px; -moz-border-radius:20px; -webkit-border-radius:20px; color:#fff;  line-height:32px; text-align:center; position:fixed;right:3px;';
// common button style; para los botones pequeños cuando la pantalla tiene un ancho menor a 1204
var css_button_General_2 = 'cursor:pointer;width:56px; height:32px; -moz-border-radius:20px; color:#fff; line-height:32px; text-align:center; position:fixed;right:3px;';

//Bloque de idiomas para las tablas de referidos directos y rentados, para el caso de las fechas donde puede aparecer
//ayer, hoy y sin clics aún
var ebp_Idioma = document.body.innerHTML.indexOf("c0 f-") + 5;
ebp_Idioma = document.body.innerHTML.substring(ebp_Idioma, ebp_Idioma + 2);

//estas variables es para cambiar las palabras ayer y hoy por su fecha respectiva
var sFechaAyerIng = "Yesterday";
var sFechaHoyIng = "Today";
var sFechaHoyEsp = "Hoy";
var sFechaAyerEsp = "Ayer";
var ebp_isToday = null;
var ebp_isYesterday = null;
var ebp_Text_alas = null;
var ebp_IniMensual = null;
var ebp_IniGeneral = null;
var sTextoPremio = null;
var sTextoTotal = null;

//estos son los datos a obtener de cada mensaje
var ebp_NumPost = 0;
var ebp_Nombre = "";
var ebp_Membrecia = "";
var ebp_Fecha = "";
var ebp_TipoUser = "";
var ebp_Contry = "";
var ebp_FechaAdPrize = 0;
var ebp_AdPrize = 0;
var ebp_TipoAct = 0;
var ebp_LinkPost = 0;
var mitexto = "";

ebp_isToday_all = "Today;Hoy;Hoje;Σήμερα;Hari ini;Tänään;Idag;Heute;Aujourd'hui";
ebp_isYesterday_all = "Yesterday;Ayer;Ontem;Χθες;Kemarin;Eilen;Igår;Gestern;Hier";
ebp_isToday_all_Adic = "today;hoy";
ebp_isYesterday_all_Adic = "yesterday;ayer";
ebp_IniMensual = "monthly;mensual";
ebp_IniGeneral = "general";
ebp_Text_alas_us ="at ";	
sTextoPremio_us = "Balance";
ebp_Text_alas_es ="a las ";
sTextoPremio_es = "Principal";
ebp_Text_alas_pt ="às ";
sTextoPremio_pt = "Principal";
ebp_Text_alas_gr ="στις ";
sTextoPremio_gr = "Υπόλοιπο";
sTextoTotal_gr = "Σύνολο";
ebp_Text_alas_id ="pada ";
sTextoPremio_id = "Utama";
ebp_Text_alas_fi ="klo ";
sTextoPremio_fi = "Päätili";
sTextoTotal_fi = "Yhteensä";
ebp_Text_alas_se ="kl. ";
sTextoPremio_se = "Huvudkonto";
ebp_Text_alas_de ="um ";
sTextoPremio_de = "Hauptguthaben";
ebp_Text_alas_fr ="à ";
sTextoPremio_fr = "Principal";
sTextoTotal_Others = "Total";
	
ebp_Idioma = "xx";
//determinamos el idioma de la página para poder leer correctamente los premios
switch(ebp_Idioma)
{
    case "us": //Ingles
        ebp_isToday = "Today";
        ebp_isYesterday = "Yesterday";
    break;
    case "es": //Español
        ebp_isToday = "Hoy";
        ebp_isYesterday = "Ayer";
    break;
    case "pt": //Portugués
        ebp_isToday = "Hoje";
        ebp_isYesterday = "Ontem";
    break;
    case "gr": //Griego - Greek
        ebp_isToday = "Σήμερα";
        ebp_isYesterday = "Χθες";
    break;
    case "id": //indonesio
        ebp_isToday = "Hari ini"; 
        ebp_isYesterday = "Kemarin";
    break;
    case "fi": //finlandés
        ebp_isToday = "Tänään";
        ebp_isYesterday = "Eilen";
    break;
    case "se": //Sueco
        ebp_isToday = "Idag";
        ebp_isYesterday = "Igår";
    break;
    case "de": //Aleman
        ebp_isToday = "Heute";
        ebp_isYesterday = "Gestern";
    break;
    case "fr": //Frances
        ebp_isToday = "Aujourd'hui";
        ebp_isYesterday = "Hier";
    break;
    default: //por default se deja Inlges
        ebp_isToday = "Today";
        ebp_isYesterday = "Yesterday";
    break;
}
//***********************************************************************************
//****funcion para eliminar cualquier codigo html de una cadena de texto		*****
//***********************************************************************************
function stripHTML(cadena)
{
	var cadena_temp = "";
	cadena_temp = cadena.replace(/<[^>]+>/g,'');
	cadena_temp = cadena_temp.replace(/\[/g,'<');
	cadena_temp = cadena_temp.replace(/\]/g,'>');
	cadena_temp = cadena_temp.replace(/<[^>]+>/g,'');
	return cadena_temp;
}
//***********************************************************************************
//****esta función es para saber el tamaño de la ventana del navegador, si en la*****
//****misma, el tamaño horizontal es menor a 1204, crearemos los botones tipo 2 *****
//***********************************************************************************
function TamVentana() {  
  var Tamanyo = [0, 0];  
  if (typeof window.innerWidth != 'undefined')  
  {  
    Tamanyo = [  
        window.innerWidth,  
        window.innerHeight  
    ];  
  }  
  else if (typeof document.documentElement != 'undefined'  
      && typeof document.documentElement.clientWidth !=  
      'undefined' && document.documentElement.clientWidth != 0)  
  {  
 Tamanyo = [  
        document.documentElement.clientWidth,  
        document.documentElement.clientHeight  
    ];  
  }  
  else   {  
    Tamanyo = [  
        document.getElementsByTagName('body')[0].clientWidth,  
        document.getElementsByTagName('body')[0].clientHeight  
    ];  
  }  
  return Tamanyo;  
} 
//***********************************************************************************
//****esta función es para regresar un dato tipo fecha en caso de que la fecha  *****
//****tenga el texto ayer o hoy													*****
//***********************************************************************************
//function EBP_Retorna_Fecha(sTextoFechaOriginal)
function EBP_Retorna_Fecha(sTextoFechaOriginal, d_FechaActual, ntipo)
{
	//tenemos la fecha del día
	if(ntipo == 1)
	{
		var neolfebp_Fecha = new Date(d_FechaActual);
	}else{
		var neolfebp_Fecha = new Date();
	}
	
	var neolfFecha = new Date();
	var milisegundos = parseInt(1*24*60*60*1000);
	
	var posicion1 = sTextoFechaOriginal.indexOf(' ');
	sTextoFecha = sTextoFechaOriginal.substring(0,posicion1);
	sTextoFecha = sTextoFecha.trim();
	
	if(ebp_isYesterday_all.indexOf(sTextoFecha) != -1 || ebp_isYesterday_all_Adic.indexOf(sTextoFecha) != -1)
	{
		//obtenemos el valor en milisegundos de la fecha actual.
		var tiempo = neolfebp_Fecha.getTime();
		//Ajustamos la fecha Tempo al día
		var total = neolfFecha.setTime(tiempo);
		//restamos un día a la fecha
		var total = neolfFecha.setTime(parseInt(tiempo - milisegundos)); 
		
		if(neolfFecha.getDate() < 10)
		{
			var sTextDia = "0" + neolfFecha.getDate();
		}else{
			var sTextDia = neolfFecha.getDate();
		}
		if(neolfFecha.getMonth() < 9)
		{
			var sTextMes = "0" + (neolfFecha.getMonth() + 1);
		}else{
			var sTextMes = (neolfFecha.getMonth() + 1);
		}
		
		var sTextFecha = neolfFecha.getFullYear() + '/' + sTextMes + '/' + sTextDia;
		posicion1 = sTextoFechaOriginal.indexOf(':');
		posicion1 = posicion1 - 2;
		sTextoFecha = sTextoFechaOriginal.substring(posicion1);
		sTextoFecha = sTextoFecha.trim();
		sTextoFecha = sTextFecha + " " + sTextoFecha;
	}else{
		if(ebp_isToday_all.indexOf(sTextoFecha) != -1 || ebp_isToday_all_Adic.indexOf(sTextoFecha) != -1)
		{
			//obtenemos el valor en milisegundos de la fecha actual.
			var tiempo = neolfebp_Fecha.getTime();
			//Ajustamos la fecha Tempo al día
			var total = neolfFecha.setTime(tiempo);
			if(neolfFecha.getDate() < 10)
			{
				var sTextDia = "0" + neolfFecha.getDate();
			}else{
				var sTextDia = neolfFecha.getDate();
			}
			if(neolfFecha.getMonth() < 9)
			{
				var sTextMes = "0" + (neolfFecha.getMonth() + 1);
			}else{
				var sTextMes = (neolfFecha.getMonth() + 1);
			}
			
			var sTextFecha = neolfFecha.getFullYear() + '/' + sTextMes + '/' + sTextDia;
			posicion1 = sTextoFechaOriginal.indexOf(':');
			posicion1 = posicion1 - 2;
			sTextoFecha = sTextoFechaOriginal.substring(posicion1);
			sTextoFecha = sTextoFecha.trim();
			sTextoFecha = sTextFecha + " " + sTextoFecha;
		}else{
			//como ya es una fecha, simplemente quitamos la palabra "a las"
			posicion1 = sTextoFechaOriginal.indexOf(':');
			posicion1 = posicion1 - 2;
			sTextoFecha = sTextoFechaOriginal.substring(posicion1);
			sTextoFecha = sTextoFecha.trim();
			var sTextFecha = sTextoFechaOriginal.substring(0,10);
			sTextoFecha = sTextFecha + " " + sTextoFecha;
		}
	}
	return sTextoFecha;
}
//***********************************************************************************
//**** Leemos la información de la página del tema								*****
//***********************************************************************************
function EBP_Leer_Topic()
{
	//tenemos la fecha del día
	var neolfebp_Fecha = new Date();
	var neolfFecha = new Date();
	var milisegundos = parseInt(1*24*60*60*1000);
						
	//Obtenemos la tabla de los mensajes
	var EBP_TablaMs = document.documentElement.innerHTML;
	var posicion1 = EBP_TablaMs.indexOf('document.write(f_ff');
	var posicion2 = EBP_TablaMs.indexOf(',]))</script>');
	EBP_TablaMs = EBP_TablaMs.substring(posicion1+21,posicion2);
    
	//obtenemos cada uno de los mensajes
	var EBP_Mensajes = EBP_TablaMs.split("],[");
	var EBP_SubMensaje = "";
	var EBP_SubMensaje_Indiv = "";
	for(var i=0; i<EBP_Mensajes.length; i++)
    {
		EBP_SubMensaje = EBP_Mensajes[i].split("','");
		for(var j=0; j<EBP_SubMensaje.length; j++)
		{
			EBP_SubMensaje_Indiv = EBP_SubMensaje[j].split(",");
			switch(j)
			{
				case 0: //obtenemos el link y el usuario
					ebp_LinkPost = EBP_SubMensaje_Indiv[1];
					ebp_Nombre = EBP_SubMensaje_Indiv[2];
					ebp_Nombre = ebp_Nombre.replace(/'/g, '');
				break;
				case 1: //obtenemos el país
					ebp_Contry = EBP_SubMensaje_Indiv[2];
					ebp_Contry = ebp_Contry.replace(/'/g, '');			
				break;
				case 2: //obtenemos la membresia y la fecha
					switch(EBP_SubMensaje_Indiv.length)
					{
						case 11: //no tiene membresia o tiene una sola
							ebp_Membrecia = EBP_SubMensaje_Indiv[2];
							ebp_Membrecia = ebp_Membrecia.replace(/'/g, '');
							ebp_Fecha = EBP_SubMensaje_Indiv[4];
							ebp_Fecha = ebp_Fecha.replace(/'/g, '');
						break;
						case 12: //tiene 2 membresias, golden y cualquier otro paquete
							ebp_Membrecia = EBP_SubMensaje_Indiv[2] + ',' + EBP_SubMensaje_Indiv[3];
							ebp_Membrecia = ebp_Membrecia.replace(/'/g, '');
							ebp_Fecha = EBP_SubMensaje_Indiv[5];
							ebp_Fecha = ebp_Fecha.replace(/'/g, '');
						break;
						case 13: //tiene 3 membresias, golden y cualquier otro paquete y pionner
							ebp_Membrecia = EBP_SubMensaje_Indiv[2] + ',' + EBP_SubMensaje_Indiv[3] + ',' + EBP_SubMensaje_Indiv[4];
							ebp_Membrecia = ebp_Membrecia.replace(/'/g, '');
							ebp_Fecha = EBP_SubMensaje_Indiv[6];
							ebp_Fecha = ebp_Fecha.replace(/'/g, '');
						break;
						case 14: //tiene 4 membresias, golden y cualquier otro paquete y pionner y moderador
							ebp_Membrecia = EBP_SubMensaje_Indiv[2] + ',' + EBP_SubMensaje_Indiv[3] + ',' + EBP_SubMensaje_Indiv[4] + ',' + EBP_SubMensaje_Indiv[5];
							ebp_Membrecia = ebp_Membrecia.replace(/'/g, '');
							ebp_Fecha = EBP_SubMensaje_Indiv[7];
							ebp_Fecha = ebp_Fecha.replace(/'/g, '');
						break;
						case 15: //tiene 5 membresias, golden y cualquier otro paquete y pionner y moderador y admin
							ebp_Membrecia = EBP_SubMensaje_Indiv[2] + ',' + EBP_SubMensaje_Indiv[3] + ',' + EBP_SubMensaje_Indiv[4] + ',' + EBP_SubMensaje_Indiv[5] + ',' + EBP_SubMensaje_Indiv[6];
							ebp_Membrecia = ebp_Membrecia.replace(/'/g, '');
							ebp_Fecha = EBP_SubMensaje_Indiv[8];
							ebp_Fecha = ebp_Fecha.replace(/'/g, '');
						break;
						default:
							ebp_Membrecia = EBP_SubMensaje_Indiv[2];
							ebp_Membrecia = ebp_Membrecia.replace(/'/g, '');
							ebp_Fecha = EBP_SubMensaje_Indiv[4];
							ebp_Fecha = ebp_Fecha.replace(/'/g, '');
						break;
					}
					//obtenemos la fecha de creacion del mensaje
					//ebp_Fecha = EBP_Retorna_Fecha(ebp_Fecha);
					ebp_Fecha = EBP_Retorna_Fecha(ebp_Fecha, neolfebp_Fecha, 0);
				break;
				case 6: //obtenemos el número del post y los datos reportados por los usuarios
					
					ebp_NumPost = EBP_SubMensaje_Indiv[EBP_SubMensaje_Indiv.length-2];
					
					var ebp_TextMensaje = "";
					for(var h=0; h<EBP_SubMensaje_Indiv.length-2; h++)
					{
						ebp_TextMensaje = ebp_TextMensaje + EBP_SubMensaje_Indiv[h] + ", "; 	
					}
					
					if(i==EBP_Mensajes.length)
					{
						alert(ebp_TextMensaje);
						end;
					}
					EBP_Obtiene_Datos(ebp_TextMensaje);
				break;
				default:
				break;
			}
		}
	}
	
	//obtenemos el campo de los datos y le pasamos los mismos
	
	var ebpTextAreaDatos = document.getElementById('neoleeforum_export_field'); 
	ebpTextAreaDatos.innerHTML = mitexto;
	mitexto = "";
	var el = document.getElementById('neoleeforum_options_window'); //se define la variable "el" igual a nuestro div
	el.style.display = (el.style.display == 'none') ? 'block' : 'none'; //damos un atributo display, que oculta o muestra el div	
	var ebpdivDatos = document.getElementById('neoleeforum_export_window'); //se define la variable "ebpdivDatos" igual a nuestro div interno
	ebpdivDatos.style.display = (ebpdivDatos.style.display == 'none') ? 'block' : 'none'; //damos un atributo display, que oculta o muestra el div
}

function EBP_Obtiene_Datos(MyTexto)
{
	ebp_AdPrize = 0;
	var sTextTempo = "";
	var sTextLinea = "";
	//estas variables es para determinar si ya se obtuvo el valor de un campo
	var b_ebp_TotNP = false;
	var b_ebp_TotSaldo = false;
	var b_ebp_TotCG = false;
	var b_ebp_TotTotal = false;
	//estas variables es para determinar si es actulización mensual o general
	var b_ebp_IniMensual = false;
	var b_ebp_IniGeneral = false;

	
	//Revisamos cuantos quote hay en el texto, para así eliminarlos y quedarnos
	//solamente con el texto real
    var fraseQueBuscar = '<fieldset class=';
    var MyTextDivide = MyTexto.split(fraseQueBuscar);
	var total = MyTextDivide.length;
	total = total-1;
	if (total != -1)
	{
		for(var i=0; i<total; i++)
		{
			MyTexto = EBP_Limpia_Texto(MyTexto)
		}
	}
	
	if (ebp_NumPost > 99999)
	{
		alert(ebp_NumPost);
	}
	MyTextDivide = MyTexto.split('<br>');
	ebp_TipoAct = 3;
	
	//esto es para eliminar los POST que dan problemas
	if(ebp_NumPost < 1 || ebp_NumPost == 4424 || ebp_NumPost == 2150 || ebp_NumPost == 2157 || ebp_NumPost == 3130 || ebp_NumPost == 3014)
	{
		return;
	}
	
	for(var i=0; i<MyTextDivide.length; i++)
	{
		//buscamos los datos que faltan: primero determinamos si es una actualización mensual o general, hasta que
		//no se consiga dicha indicación no tomamos ningún dato
		sTextLinea = MyTextDivide[i];
		//eliminamos los espacios al inicio y final de la línea, y convertimos el texto a minuscula
		sTextLinea = sTextLinea.trim();
		var sTextLineaMinusc = sTextLinea;
		sTextLineaMinusc = stripHTML(sTextLineaMinusc);
		sTextLineaMinusc = sTextLineaMinusc.toLowerCase();
		var sTextLineaBusca = sTextLineaMinusc;
		sTextLineaBusca = sTextLineaBusca.replace(":", '');
		//eliminamos todos los salto de página y todos los espacios en blanco
		sTextLineaBusca = sTextLineaBusca.replace(/\\t/gi, ' ');
		sTextLineaBusca = sTextLineaBusca.replace(/\s{2,}/g, ' ');
		sTextLineaBusca = sTextLineaBusca.trim();
		
		sTextLinea = stripHTML(sTextLinea);
		ebp_FechaAdPrize = "";
		ebp_AdPrize = "";
		
		
		if(sTextLinea != "")
		{		
			//if((ebp_NumPost == 616 || ebp_NumPost == 630) && (ebp_IniGeneral.indexOf(sTextLineaBusca) != -1) )
			//{
				//sTextLineaBusca = ebp_IniMensual;
			//}else{
				//if((ebp_NumPost == 616 || ebp_NumPost == 630) && (ebp_IniMensual.indexOf(sTextLineaBusca) != -1) )
				//{
					//sTextLineaBusca = ebp_IniGeneral;
				//}
			//}
	
			if((ebp_IniMensual.indexOf(sTextLineaBusca) != -1) && (b_ebp_IniMensual == false))
			{
				b_ebp_IniMensual = true;
				ebp_TipoAct = 1;
			}else{
				if((ebp_IniGeneral.indexOf(sTextLineaBusca) != -1) && (b_ebp_IniGeneral == false))
				{
					b_ebp_IniGeneral = true;
					b_ebp_IniMensual = true;
					ebp_TipoAct = 2;
				}
			}
			
			if((ebp_TipoAct != 3) && (sTextLinea != ""))
			{
				//buscamos en la línea el texto AdPrize (si es actualizacion mensual)
				if((sTextLineaMinusc.indexOf('adprize') != -1 ) && (ebp_TipoAct == 1))
				{
					var posicion1 = sTextLinea.indexOf(':');
					posicion1 = posicion1 + 3;
					ebp_FechaAdPrize = sTextLinea.substring(0,posicion1);
					ebp_FechaAdPrize = ebp_FechaAdPrize.trim();
					//ebp_FechaAdPrize = EBP_Retorna_Fecha(ebp_FechaAdPrize);
					ebp_FechaAdPrize = EBP_Retorna_Fecha(ebp_FechaAdPrize, ebp_Fecha, 1);
					var posicion2 = sTextLineaMinusc.indexOf(':',posicion1);
					posicion2 = posicion2 + 1;
					ebp_AdPrize = sTextLineaMinusc.substring(posicion2);
					ebp_AdPrize = ebp_AdPrize.trim();
					
					//Ahora verificamos si el premio es en $ (tiene el simbolo de $), o si es una cuenta Golden (dice Golden)
					//de lo contrario será un premio en NeoPoints
					if(ebp_AdPrize.indexOf('$') != -1 )
					{						
						posicion1 = ebp_AdPrize.indexOf(' ');
						ebp_AdPrize = ebp_AdPrize.substring(0,6);
						ebp_AdPrize = ebp_AdPrize.trim();
						
					}else if(ebp_AdPrize.indexOf('golden') != -1 ){
						ebp_AdPrize = "Golden";
					}else{
						posicion1 = ebp_AdPrize.indexOf('neopoints');
						if(posicion1 == -1)
						{
							posicion1 = ebp_AdPrize.indexOf('points');
						}
						ebp_AdPrize = ebp_AdPrize.substring(0,posicion1);
						ebp_AdPrize = ebp_AdPrize.trim() + " NP";
					}
				//como es actualizacion general, leemos todos los datos, buscamos el tipo de premio y el total ganado
				}else{
					var sTextAdPrize01 = "";
					var sTextAdPrize02 = "";
					var nValAdPrize01 = 0;
					var nValAdPrize02 = 0;
					var posicion1 = 0;
					
					//Buscamos en la línea, si al principio está el $ es un premio en $, y buscamos en la misma línea a ver
					//si hay un premio en NeoPoint o la cuenta Golden
					sTextLinea = sTextLinea.replace(/\\t/gi, ' ');
					sTextLinea = sTextLinea.replace(/\s{2,}/g, ' ');
					if(sTextLinea.indexOf('$') == 0)
					{
						//obtenemos el tipo de premio (el primero de la línea)
						posicion1 = sTextLinea.indexOf(' ');
						sTextAdPrize01 = sTextLinea.substring(0,posicion1);
						sTextAdPrize01 = sTextAdPrize01.trim();
						
						//ahora obtenemos el total del tipo de premio (del primero)
						if(sTextLinea.indexOf(sTextoPremio_us) != -1){
							posicion1 = sTextLinea.indexOf(sTextoPremio_us);
						}else if(sTextLinea.indexOf(sTextoPremio_es) != -1){
							posicion1 = sTextLinea.indexOf(sTextoPremio_es);
						}else if(sTextLinea.indexOf(sTextoPremio_gr) != -1){
							posicion1 = sTextLinea.indexOf(sTextoPremio_gr);
						}else if(sTextLinea.indexOf(sTextoPremio_id) != -1){
							posicion1 = sTextLinea.indexOf(sTextoPremio_id);
						}else if(sTextLinea.indexOf(sTextoPremio_fi) != -1){
							posicion1 = sTextLinea.indexOf(sTextoPremio_fi);
						}else if(sTextLinea.indexOf(sTextoPremio_se) != -1){
							posicion1 = sTextLinea.indexOf(sTextoPremio_se);
						}else if(sTextLinea.indexOf(sTextoPremio_de) != -1){
							posicion1 = sTextLinea.indexOf(sTextoPremio_de);
						}
						
						sTextTempo = sTextLinea.substring(posicion1);
						sTextTempo = sTextTempo.trim();
						var sTextTemponew = sTextTempo;
						sTextTempo = sTextTempo.split(" ");
						nValAdPrize01 = sTextTempo[1];
						
						nValAdPrize01 = nValAdPrize01.trim();
						
						sTextAdPrize02 = "";
						nValAdPrize02 = 0;
						//ahora buscamos a ver si existe un segundo premio
						if(sTextLinea.indexOf('NeoPoints') != -1 || sTextLinea.indexOf('Points') != -1)
						{
							//obtenemos el tipo de premio (el segundo de la línea)
							sTextTempo = sTextLinea.substring(posicion1);
							sTextTempo = sTextTempo.split(" ");
							sTextAdPrize02 = sTextTempo[2] + " NP";
							nValAdPrize02 = sTextTempo[4];
						}else if(sTextLinea.indexOf('Golden') != -1 )
						{
							//obtenemos el tipo de premio (el segundo de la línea)
							posicion1 = sTextLinea.indexOf("Golden");
							sTextTempo = sTextLinea.substring(posicion1);
							sTextAdPrize02 = "Golden";
							nValAdPrize02 = sTextTempo.replace(/[^0-9]+/g, '');
							nValAdPrize02 = nValAdPrize02.trim();
						}
					}else{
						//si no es una la línea de premios, es una línea del resumen, leemos los datos de NeoPoints, Saldo Principal,
						//Cuenta Golden y Total; despues que leemos esos cuatros datos ya no leemos mas nada
						
						if(b_ebp_TotNP == false || b_ebp_TotSaldo == false || b_ebp_TotCG == false || b_ebp_TotTotal == false)
						{
							sTextAdPrize02 = "";
							nValAdPrize02 = 0;
							sTextTempo = sTextLinea.trim();
							sTextTempo = sTextTempo.split(" ");
							//if (ebp_NumPost == 744)
							//{
								//alert(sTextTempo[0] + ";" + sTextTempo[1] + ";" + sTextTempo[2]);
							//}
							if(sTextLinea.indexOf('NeoPoints') != -1 || sTextLinea.indexOf('Points') != -1)
							{
								sTextAdPrize01 = "NP Total";
								nValAdPrize01 = sTextTempo[2];
								nValAdPrize01 = nValAdPrize01.trim();
								b_ebp_TotNP = true;
							}else if(sTextLinea.indexOf('Golden') != -1 ){
								sTextAdPrize01 = "CG Total";
								sTextTempo = sTextLinea.split("$");
								nValAdPrize01 = sTextTempo[1];
								nValAdPrize01 = nValAdPrize01.trim();
								b_ebp_TotCG = true;
							}else{
								//verificamos si el texto "principal" está en la línea, quiere decir
								//que es el total de saldo en premios de $
								posicion1 = -1;
								if(sTextLinea.indexOf(sTextoPremio_us) != -1){
									posicion1 = sTextLinea.indexOf(sTextoPremio_us);
								}else if(sTextLinea.indexOf(sTextoPremio_es) != -1){
									posicion1 = sTextLinea.indexOf(sTextoPremio_es);
								}else if(sTextLinea.indexOf(sTextoPremio_gr) != -1){
									posicion1 = sTextLinea.indexOf(sTextoPremio_gr);
								}else if(sTextLinea.indexOf(sTextoPremio_id) != -1){
									posicion1 = sTextLinea.indexOf(sTextoPremio_id);
								}else if(sTextLinea.indexOf(sTextoPremio_fi) != -1){
									posicion1 = sTextLinea.indexOf(sTextoPremio_fi);
								}else if(sTextLinea.indexOf(sTextoPremio_se) != -1){
									posicion1 = sTextLinea.indexOf(sTextoPremio_se);
								}else if(sTextLinea.indexOf(sTextoPremio_de) != -1){
									posicion1 = sTextLinea.indexOf(sTextoPremio_de);
								}
								
								if(posicion1 != -1)
								{
									sTextAdPrize01 = "SubTot $";
									
									sTextTempo = sTextLinea.substring(posicion1);
									sTextTempo = sTextTempo.trim();
									sTextTempo = sTextTempo.split("$");
									nValAdPrize01 = sTextTempo[1];
									nValAdPrize01 = nValAdPrize01.trim();
									b_ebp_TotSaldo = true;
								}else{
									//verificamos si el texto "total" está en la línea, quiere decir
									//que es el total general ganado
									posicion1 = -1;
									if(sTextLinea.indexOf(sTextoTotal_gr) != -1){
										posicion1 = sTextLinea.indexOf(sTextoTotal_gr);
									}else if(sTextLinea.indexOf(sTextoTotal_fi) != -1){
										posicion1 = sTextLinea.indexOf(sTextoTotal_fi);
									}else if(sTextLinea.indexOf(sTextoTotal_Others) != -1){
										posicion1 = sTextLinea.indexOf(sTextoTotal_Others);
									}
									
									if(posicion1 != -1)
									{
										sTextAdPrize01 = "Total $";
										sTextTempo = sTextLinea.substring(posicion1);
										sTextTempo = sTextTempo.trim();
                                        sTextTempo = sTextLinea.replace(", ", ',');
										sTextTempo = sTextTempo.split(" ");
										nValAdPrize01 = sTextTempo[2];
										nValAdPrize01 = nValAdPrize01.trim();
										sTextAdPrize02 = "Total AP";
										nValAdPrize02 = sTextTempo[1];
										b_ebp_TotTotal = true;
									}
								}
							}
						}
					}
				}
				
				
//				if(ebp_NumPost == 155)
	//			{
		//			if(i > 120)
			//		{
				//		alert("aqui");
					//}
				//}
				
				//ahora pasamos el dato para mostrarlo
				if(ebp_TipoAct == 1)
				{
					if(ebp_FechaAdPrize != ""){
						mitexto = mitexto + ebp_NumPost + ";" + ebp_Nombre + ";" + ebp_Membrecia + ";" + ebp_Fecha + ";" + ebp_TipoAct + ";" + ebp_Contry + ";" + ebp_FechaAdPrize + ";" + ebp_AdPrize + ";" + "" + ";" + ebp_LinkPost + "\n";
					}
				}else if(ebp_TipoAct == 2){
					if(sTextAdPrize01 != ""){
						mitexto = mitexto + ebp_NumPost + ";" + ebp_Nombre + ";" + ebp_Membrecia + ";" + ebp_Fecha + ";" + ebp_TipoAct + ";" + ebp_Contry + ";" + "" + ";" + sTextAdPrize01 + ";" + nValAdPrize01 + ";" + ebp_LinkPost + "\n";
					}
					if(sTextAdPrize02 != ""){
						mitexto = mitexto + ebp_NumPost + ";" + ebp_Nombre + ";" + ebp_Membrecia + ";" + ebp_Fecha + ";" + ebp_TipoAct + ";" + ebp_Contry + ";" + "" + ";" + sTextAdPrize02 + ";" + nValAdPrize02 + ";" + ebp_LinkPost + "\n";
					}
				}
			}
		}
	}
//	if(ebp_NumPost > 246)
//	{
//		alert(ebp_NumPost);
//	}
}

function EBP_Limpia_Texto(MyNewTexto)
{
	//Eliminamos el texto que haya entre las 2 fraces que estamos buscando
	
	var fraseBusca2 = '</fieldset>';
	
    var Posicion_1 = MyNewTexto.lastIndexOf('<fieldset class=');
	var posicion_2 = MyNewTexto.indexOf('</fieldset>',Posicion_1);
	
	var TextTemporal = MyNewTexto.substring(0,Posicion_1) + " " + MyNewTexto.substring(posicion_2+11,MyNewTexto.length);
	return TextTemporal;
}

//***********************************************************************************
//**** esta funcion agrega los botones en la página, el tamaño y forma de los   *****
//**** botones va a depender si son el tipo 1 o tipo 2 (eso depende del tamaño	*****
//**** horizontal de la pantalla, esto es para que los botones en resoluciones	*****
//**** de 1024 se vean bien														*****
//***********************************************************************************
function add_buttons()
{   
	//Creamos los Botones
    var button_Leer_Topic = document.createElement('span');
	var button_Espacio = 36;
	var tmp_pix = 0;
	var tmp_pix_Gen = 0;
	
	var Tam = TamVentana();  
	//verificamos el tamaño de la pantalla
	if(Tam[0] > 1204)
    {
        var css_button_common = css_button_General;
		tmp_pix_Gen = bottom_pix;
    }else{
		var css_button_common = css_button_General_2;
		TipoBoton = 2;
		tmp_pix_Gen = bottom_pix_2;
	}
			
	var css_Leer_Topic = css_button_common
      + 'background-color:#A4A4A4;bottom:' + tmp_pix_Gen.toString() + 'px;';
	  
	var TextoSpan = "";
	var SaltoLinea = document.createElement("br");
	//dependiendo del tipo de boton, colocaremos el texto en los botones
	if(TipoBoton == 1)
    {
        TextoSpan = "Leer Mensajes";
		var Text_Leer_Topic = document.createTextNode(TextoSpan);
		button_Leer_Topic.appendChild(Text_Leer_Topic);
    }else{
		TextoSpan = "Read";
		var Text_Leer_Topic = document.createTextNode(TextoSpan);
		button_Leer_Topic.appendChild(Text_Leer_Topic);
	}
	
	button_Leer_Topic.style.cssText = css_Leer_Topic;
    button_Leer_Topic.addEventListener('click', EBP_Leer_Topic, false);
    document.body.appendChild(button_Leer_Topic);
	
	//Creamos el Div para los datos
	var d = document.createElement('div');
	d.setAttribute('id','neoleeforum_options_window');
	d.setAttribute('style','position: fixed; top: 100px; text-align: center; width: 100%; display: none;');
	d.innerHTML = '<div style="width: 800px; height: 400px; margin: 0 auto; background: #FFF; border: 1px solid #333; padding: 10px; display: none;" id="neoleeforum_export_window"><table><tr><td><img src="http://c.nbx.bz/imagens/texto_32.png" width="26" border="0" /></td><td style="font-size: 14px; font-weight: bold; padding-left: 5px; font-family: Arial; text-align: left;" width="800">NeoLeeForum</td><td id="neoleeforum_export_close" style="font-size: 13px; font-weight: bold; padding-left: 5px; font-family: Arial; text-align: right; cursor: pointer;" width="190">Close</td></tr></table><textarea style="width: 790px; height: 365px;" id="neoleeforum_export_field" onMouseOver="this.select();" onMouseUp="this.select();" onMouseDown="this.select();"></textarea></style></div>';
	// Lo insertas al final del body
	document.body.appendChild(d); 
	//agregamos las funciones para cerrar (ocultar) el div 
	var neoleeforumcierra = document.getElementById("neoleeforum_export_close");
	neoleeforumcierra.addEventListener('click', NeoLeeForum_Datos_Cerrar, false);
}
//***********************************************************************************
//****esta función oculta el div que contiene los datos a exportar				*****
//***********************************************************************************
function NeoLeeForum_Datos_Cerrar()
{
	var ebpdivDatos = document.getElementById('neoleeforum_options_window'); //se define la variable "el" igual a nuestro div
	ebpdivDatos.style.display = (ebpdivDatos.style.display == 'none') ? 'block' : 'none'; //damos un atributo display:none que oculta el div
	var el = document.getElementById('neoleeforum_export_window'); //se define la variable "el" igual a nuestro div
	el.style.display = (el.style.display == 'none') ? 'block' : 'none'; //damos un atributo display:none que oculta el div
}

add_buttons();


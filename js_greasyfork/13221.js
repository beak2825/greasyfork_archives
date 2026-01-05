// ==UserScript==
// @name          NeoExportEBP
// @namespace     by_Bigpetroman
// @description   Botones para pasar los datos de la pagina de neobux a un div, listos para copiar y pegar
// @author 		  Bigpetroman
// @include       http://www.neobux.com/c/
// @include       https://www.neobux.com/c/
// @include       http://www.neobux.com/c/?vl*
// @include       https://www.neobux.com/c/?vl*
// @include 	  http://www.neobux.com/c/rl/*
// @include 	  https://www.neobux.com/c/rl/*
// @include 	  http://www.neobux.com/c/rs/*
// @include 	  https://www.neobux.com/c/rs/*
// @include 	  https://www.neobux.com/c/d/*
// @icon        https://img.neobux.com/imagens/texto_32.png
// @version       2.7.3.1
// @downloadURL https://update.greasyfork.org/scripts/13221/NeoExportEBP.user.js
// @updateURL https://update.greasyfork.org/scripts/13221/NeoExportEBP.meta.js
// ==/UserScript==
// Changelog
// version 1 liberada 04 de Enero 2012
// los botones copian la información de la página en que estamos y los colocan en una ventana nueva en forma de texto
// separado por punto y coma (;), listo para copiar y pegar
// version 2 liberada 09 de Febrero 2012
// -- se coloco la opción de elegir un formato de fecha standar como formato de fecha para los diferentes campos de fecha
// la fecha será de la forma yyyy/mm/dd hh:mm, en el caso de el campo ultimo clic, como no lleva hora, se colocara como
// hora las 00:00
// -- el campo media, cuando NO tenga valores (muestra -.--), se regresara el valor 0.000
// -- ahora los datos son pasados a un div y NO a una pestaña nueva, en chrome me dio problemas con las ventanas y por eso
// decidi hacerlo con un div, y se ve mucho mejor
// version 2.1 liberada 29 de Febrero 2012
// se corrigio el script para cuando en el campo "Expira en" salía la palabra expirado
// version 2.2 liberada 04 de Abril 2012
// se agrego la opcion de poder exportar los datos de los referidos directos y rentados al mismo estilo que
// los exporta NeoBux, Nombre de Referido, Referido Desde, Fecha ultimo Clic y Total Clics; la fecha es en el
// mismo formato YYYYMMDD y los datos estan separados por coma
// version 2.3 liberada 06 de Abril 2012
// se corrigieron algunos errores
// version 2.4 liberada 26 de Abril 2012
// se corrigieron algunos errores
// version 2.5 liberada 07 de Mayo 2012
// se corrigieron algunos problemas que no dejaban crear los botones en la página de resumen
// version 2.6 liberada 26 de Julio 2012
// se corrigo un problema con los datos exportados de referidos directos y rentados cuando se usa el script Referrals comments for NeoBux
// version 2.6.1 liberada 20 de Mayo 2013
// se corrigo un problema con los datos exportados de la página resumen, en ocaciones no funcionaba el botón, ya fue corregido
// version 2.6.2 liberada 06 de Julio 2013
// se corrigo un problema con los datos exportados de la página de RR cuando la fecha referido desde estaba en formato relativa
// version 2.6.3 liberada 04 de Octubre 2014
// se realizo la corrección de los datos sobre las renovaciones, motraba el valor de hoy como valor de ayer
// version 2.6.4 liberada 10 de Diciembre 2014
// se corrigio un problema cuando se exportaban los datos el formato estandar y habian referidos 0 clickers, no mostraba los
// datos; igualmente se agregaron los botones Copiar - Pegar en la venta de exportar datos de RD y RR, el botón COPIAR aparece
// en todas las ventanas y permite almacenar la información de cada página en el localStorage, luego en la última ventana con el
// boton PEGAR muestra toda la información en una única ventana
// version 2.6.5 liberada 01 de Marzo 2016, se realizaron unos cambios ya que la pagina de resumen daba errores en unos idiomas
// y se reprogramo la parte que muestra el botón en la página
// version 2.7.0 liberada el 26 de noviembre 2016, se realizaron ajustes en el codigo, se mejoro la aparcienda de la ventana de datos
// se agrego la opcion de copiar toda la información en la utlima ventan de RR (para hacer un solo copy and paste para nuestro archivo)
// version 2.7.1 liberada el 28 de noviembre 2016, se realizaron ajustes para mostrar de forma ordenada los datos de los RR y RD
//  version 2.7.2 liberada el 13 de Enero 2017, se realizaron ajustes al código, en ocasiones se borraban las paginas de RR ya cargadas

//***********************************************************************************
//**** Establecemos las Variables Globales										*****
//***********************************************************************************
/*	variable para identificar la página; 0 para la de resumen, estadisticas y otras; 1 para las paginas de referidos
	directos y rentados donde será realmente util*/
var ebp_Tipo_Pag = 0;
/*	Bloque de idiomas para las tablas de referidos directos y rentados, para el caso de las fechas donde puede aparecer
	ayer, hoy y sin clics aún */
var ebp_isToday = null;
var ebp_isYesterday = null;
var ebp_isTomorrow = null;
var ebp_isExpired = null;
var ebp_noClick = null;
var ebp_ffRelativa = null;
var ebp_ffExacta = null;
/*	estas variables son para los texto a mostrar en los datos exportados, sobre todo para los datos
	de la paginas de resumen y estadísticas*/
var ebp_CPTotalHoy = null;
var ebp_CPFijosFHoy = null;
var ebp_CPMicroHoy = null;
var ebp_CPMiniHoy = null;
var ebp_CPProlongadoHoy = null;
var ebp_CPStandarHoy = null;
var ebp_CPFijosNHoy = null;
var ebp_DirectText = null;
var ebp_TotClicsHoy = null;
var ebp_TotClicsAyer = null;
var ebp_TotClics10Dias = null;
var ebp_ClicsHoyRD = null;
var ebp_ClicsAyerRD = null;
var ebp_Clics10DiasRD = null;
var ebp_ClicsHoyRR = null;
var ebp_ClicsAyerRR = null;
var ebp_Clics10DiasRR = null;
var ebp_MontReciclaHoy = null;
var ebp_MontReciclaAyer = null;
var ebp_MontRecicla10Dias = null;
var ebp_ReciclaGratisHoy = null;
var ebp_MontRenuevaHoy = null;
var ebp_MontRenuevaAyer = null;
var ebp_MontRenueva10Dias = null;
var ebp_MontRenuevaHoyManual = "null";
var ebp_MontRenuevaAyerManual = "null";
var ebp_MontRenueva10DiasManual = "null";
var ebp_MontRenuevaHoyAuto = null;
var ebp_MontRenuevaAyerAuto = null;
var ebp_MontRenueva10DiasAuto = null;
var ebp_MontAutoPagoHoy = null;
var ebp_MontAutoPagoAyer = null;
var ebp_MontAutoPago10Dias = null;
/*	estas variables son para el texto mostrado en las patallas de exportación */
var ebp_TextConfig = null;
var ebp_TextDatos = null;
var ebp_TextGuarda = null;
var ebp_TextSalir = null;
var ebp_TextCopiar = null;
var ebp_TextPegar = null;
var ebp_TextMensL1 = null;
var ebp_TextMensL2 = null;
var ebp_TextMensL3 = null;
var ebp_TextMensL4 = null;
var ebp_TextMensL5 = null;
var ebp_TextMensL6 = null;
var ebp_TextMensL7 = null;
var ebp_LastUpdate = null;
var ebp_MensLU = null;
var ebp_Idioma = 0;
/*	estas variables son para la pantalla de exportacion de datos */
var ebp_AnchoED = 0;
var ebp_AltoED = 0;
/*	esta variable es para el tipo de formato de fecha a regresar
	si es 1, se regresa la fecha en formato standar, si es 0 se regresa tal cual como esta en la celda */
var nFormaFecha = 0;
var opcionesFecha = null;
opcionesFecha = {
	year: "numeric",
	month: "short",
	day: "numeric",
	hour: "2-digit",
	minute: "2-digit"
};
var agruparDatosEBP = null;
var fechaStandardEBP = null;
var fechaNeobuxEBP = null;

//***********************************************************************************
//**** INICIO DE FUNCIONES AUXILIARES											*****
//***********************************************************************************

//***********************************************************************************
//**** Creamos la Cookie(la copie de NeoBuxOX)									*****
//**** Arguments:																*****
//**** c_name																	*****
//**** value																	*****
//**** exdays																	*****
//**** Cookie value: Option //este valor puede ser 0 para fecha Standar			*****
//**** o 1 para fecha normal													*****
//***********************************************************************************
function setCookie(c_name, value, exdays) {
    // declaramos las variables
	var exdate, fechaVacia, c_value;
	// establecemos la fecha de hoy
	exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
	// establecemos la fecha como vacia para cuando NO se indique la fecha de finalización
	fechaVacia = "";
	if (!exdays) {
		//c_value = escape(value) + "";
		c_value = encodeURIComponent(value) + fechaVacia;
	} else {
		//c_value = escape(value) + "; expires=" + exdate.toUTCString();
		c_value = encodeURIComponent(value) + "; expires=" + exdate.toUTCString();
	}
	//c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    c_value = c_value + "; path=/";
    document.cookie = c_name + "=" + c_value;
}

//***********************************************************************************
//**** función para obtener valores de una Cookie								*****
//**** Get cookie value (la copie de NeoBuxOX)									*****
//***********************************************************************************
function getCookie(c_name) {
    var i, x, y, ARRcookies;
	ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i += 1) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            //return unescape(y);
			return decodeURIComponent(y);
        }
    }
    return null;
}
//***********************************************************************************
//*** Funcion para leer las opciones guardadas en la cookie						*****
//***********************************************************************************
function opcionesSeteoEBP() {
	var opcionesGuardadasEBP;
	// leemos las opciones guardadas en la cookie
	opcionesGuardadasEBP = getCookie("ebp_NeoExport").split("-");
	if (opcionesGuardadasEBP[0] == 1) {
		fechaStandardEBP = true;
	} else {
		fechaStandardEBP = false;
	}
	if (opcionesGuardadasEBP[1] == 1) {
		fechaNeobuxEBP = true;
	} else {
		fechaNeobuxEBP = false;
	}
	if (opcionesGuardadasEBP[2] == 1) {
		agruparDatosEBP = true;
	} else {
		agruparDatosEBP = false;
	}
}
//***********************************************************************************
//****esta función deselecciona las opciones del cuadro según corresponda		*****
//***********************************************************************************
function ebpOpcionesCheckBox() {
	var botonoOpcionesFechaEBP;
	
	botonoOpcionesFechaEBP = document.getElementById("opcionesFechaStandardEBP");
	//si el botón de fechas standard es seleccionado, deseleccionamos el boton de exportar datos en el
	//formato de neobux
	if (botonoOpcionesFechaEBP.checked) {
		document.getElementById("opcionesFechaNeobuxEBP").checked = 0;
	}
}
function ebpOpcionesCheckBox_2() {
	var botonoOpcionesFechaEBP;
	
	botonoOpcionesFechaEBP = document.getElementById("opcionesFechaNeobuxEBP");
	//si el botón de exportar datos en formato de neobux es seleccionado, deseleccionamos el boton de 
	//fechas standard
	if (botonoOpcionesFechaEBP.checked) {
		document.getElementById("opcionesFechaStandardEBP").checked = 0;
	}
}

//***********************************************************************************
//****esta función oculta o muestra la ventana de EBP							*****
//***********************************************************************************
function ocultaMuestraFormulario() {
	var formularioExporta;
	//obtenemos el formulario de Exportación, si está oculto lo mostramos o sino lo ocultamos
	formularioExporta = document.getElementById("EBPformularioExporta");
	if (formularioExporta.style.display == "none") {
		formularioExporta.style.display = "block";
	} else {
		formularioExporta.style.display = "none";
	}
}

//***********************************************************************************
//****esta función guarda los datos del cuadro de opciones						*****
//***********************************************************************************
function opcionarGuardarEBP() {
	var botonoOpFechaStandardEBP, botonoOpFechaNeobuxEBP, botonoOpAgruparEBP, sDatosCheckBox;
	
	botonoOpFechaStandardEBP = 0;
	botonoOpFechaNeobuxEBP = 0;
	botonoOpAgruparEBP = 0;
	fechaStandardEBP = false;
	fechaNeobuxEBP = false;
	agruparDatosEBP = false;
	if (document.getElementById('opcionesFechaStandardEBP').checked) {
		botonoOpFechaStandardEBP = 1;
		fechaStandardEBP = true;
	}
	
	if (document.getElementById('opcionesFechaNeobuxEBP').checked) {
		botonoOpFechaNeobuxEBP = 1;
		fechaNeobuxEBP = true;
	}
	
	if (document.getElementById('opcionesAgruparDatosEBP').checked) {
		botonoOpAgruparEBP = 1;
		agruparDatosEBP = true;
	}
	
	sDatosCheckBox = botonoOpFechaStandardEBP + "-" + botonoOpFechaNeobuxEBP + "-" + botonoOpAgruparEBP;
	setCookie("ebp_NeoExport", sDatosCheckBox, 365);
	ocultaMuestraFormulario();
}

//***********************************************************************************
//**** esta función copia los datos del TextArea en localStorage				*****
//**** se crea el registro de la forma CLAVE, VALOR								*****
//**** donde CLAVE sera la propia clave mas la fecha en formato (DDMMYYHHMM)	*****
//***********************************************************************************
function copiarTextAreaEBP() {
	// declaramos las variables
	var sEBPKey, ebp_NumPagina, iIndice, ElTexto, indicePagina, botonCopiar, fechaGuarda, textoFecha, textoClave, numeroPagina, textoMostrar, lineaMensaje, sCodigo, textoCompara;
			
	fechaGuarda = new Date();
	textoFecha = fechaGuarda.getDate().double() + "" + (fechaGuarda.getMonth() + 1).double() + "" + fechaGuarda.getFullYear() + "" + fechaGuarda.getHours().double() + "" + fechaGuarda.getMinutes().double();
	
	//si el tipo de página es 1 (referidos rentados) o 2 (referidos directos),
	if (ebp_Tipo_Pag === 1 || ebp_Tipo_Pag === 2) {
		if (ebp_Tipo_Pag === 1) {
			sEBPKey = "EBPPAGERR";
		} else {
			sEBPKey = "EBPPAGERD";
		}
		
		// validamos si funicona el localstorage
		if (localStorage) {
			//obtenemos el número de la página para guardar el texto
			ebp_NumPagina = document.getElementById("pagina");
			//obtenemos el texto del textarea
			ElTexto = document.getElementById("ventanaEBPtextArea").value;
			ElTexto = ElTexto.replace(/&nbsp;/gi, "");
			
			// Guardar datos en el almacén de la sesión actual
			if (ebp_NumPagina === null) {
				indicePagina = sEBPKey + "001";
				numeroPagina = "001";
			} else {
				numeroPagina = (ebp_NumPagina.selectedIndex + 1);
				if (numeroPagina < 10) {
					numeroPagina = "00" + numeroPagina;
				} else {
					if (numeroPagina < 100) {
						numeroPagina = "0" + numeroPagina;
					}
				}
				indicePagina = sEBPKey + numeroPagina;
			}
			//antes de guardar, borramos cualquier valor de RD o RR si la página es la primera
			if (parseInt(numeroPagina, 10) === 1) {
				for (iIndice = window.localStorage.length - 1; iIndice >= 0 ; iIndice -= 1) {
					sCodigo = window.localStorage.key(iIndice);
					if (sCodigo.substring(0, 9) == sEBPKey) {
						window.localStorage.removeItem(sCodigo);
					}
				}
			} else {
				//antes de guardar, borramos cualquier valor anterior de dicha pagina
				for (iIndice = 0; iIndice < window.localStorage.length; iIndice += 1) {
					sCodigo = window.localStorage.key(iIndice);
					if (sCodigo.substring(0, 12) == indicePagina) {
						window.localStorage.removeItem(sCodigo);
						break;
					}
				}
			}
			//guardamos los datos nuevos
			window.localStorage.setItem(indicePagina + textoFecha, ElTexto);
			
			//al copiar los datos, colocamos el botón en verde
			botonCopiar = document.getElementById("ventanaEBPBtnCopiar");
			botonCopiar.setAttribute("class", "button medium green");
			
			if (ebp_Idioma === "es") {
				textoMostrar = ebp_LastUpdate + ": " + fechaGuarda.toLocaleDateString("es-ES", opcionesFecha);
			} else {
				textoMostrar = ebp_LastUpdate + ": " + fechaGuarda.toLocaleDateString("en-US", opcionesFecha);
			}
	
			lineaMensaje = document.getElementById('EBPformularioExporta').getElementsByTagName('table')[1].getElementsByTagName('td')[0];
			lineaMensaje.textContent = textoMostrar;
		
		} else {
			alert("El navegador NO soporta Local Storage!");
		}
	} else {
		if (ebp_Tipo_Pag === 0) {
			sEBPKey = "EBPPAGERES";
		} else {
			sEBPKey = "EBPPAGEEST";
		}
		if (localStorage) {
			//Si es la pagina de resumen, borramos el localstorage
			if (sEBPKey === "EBPPAGERES") {
				//como es la primera página de resumen, borramos del localstorage toda nuestra informacion
				for (iIndice = window.localStorage.length - 1; iIndice >= 0 ; iIndice -= 1) {
					sCodigo = window.localStorage.key(iIndice);
					if (sCodigo.indexOf("EBPPAGE") !== -1) {
						window.localStorage.removeItem(sCodigo);
					}
				}
			} else {
				//antes de guardar, borramos cualquier valor anterior de dicha pagina
				for (iIndice = 0; iIndice < window.localStorage.length; iIndice += 1) {
					sCodigo = window.localStorage.key(iIndice);
					if (sCodigo.indexOf("EBPPAGEEST") !== -1) {
						window.localStorage.removeItem(sCodigo);
						break;
					}
				}
			}
			//obtenemos el texto del textarea
			ElTexto = document.getElementById("ventanaEBPtextArea").value;
			ElTexto = ElTexto.replace(/&nbsp;/gi, "");
			
			// Guardar datos en el almacén de la sesión actual
			window.localStorage.setItem(sEBPKey + textoFecha, ElTexto);
			
			//al copiar los datos, colocamos el botón en verde
			botonCopiar = document.getElementById("ventanaEBPBtnCopiar");
			botonCopiar.setAttribute("class", "button medium green");
			
			if (ebp_Idioma === "es") {
				textoMostrar = ebp_LastUpdate + ": " + fechaGuarda.toLocaleDateString("es-ES", opcionesFecha);
			} else {
				textoMostrar = ebp_LastUpdate + ": " + fechaGuarda.toLocaleDateString("en-US", opcionesFecha);
			}
	
			lineaMensaje = document.getElementById('EBPformularioExporta').getElementsByTagName('table')[1].getElementsByTagName('td')[0];
			lineaMensaje.textContent = textoMostrar;
		} else {
			alert('El navegador NO soporta Local Storage!');
		}
	}
}

//***********************************************************************************
//**** funcion para leer en orden secuencial los datos de RD o RR				*****
//***********************************************************************************
function LeerRDyRR(sCodigoRef, ultPagDat) {
	var iIndice, iIndicePag, datosReferidos, numeroPagina, sEBPKey, sCodigoCompara;
	
	datosReferidos = "";
	//Leemos las páginas de los RR
	for (iIndicePag = 1; iIndicePag <= ultPagDat; iIndicePag += 1) {
		numeroPagina = iIndicePag;
		if (iIndicePag < 10) {
			numeroPagina = "00" + iIndicePag;
		} else {
			if (iIndicePag < 100) {
				numeroPagina = "0" + iIndicePag;
			}
		}
		for (iIndice = 0; iIndice < window.localStorage.length; iIndice += 1) {
			sEBPKey = window.localStorage.key(iIndice);
			sCodigoCompara = sCodigoRef + numeroPagina;
			if (sEBPKey.substring(0, 12) === sCodigoCompara){
				datosReferidos =  datosReferidos + window.localStorage.getItem(sEBPKey) + "\n";
			}
		}	
	}
	return datosReferidos;
}
//***********************************************************************************
//****esta función pasa los datos del localStorage al textarea					*****
//***********************************************************************************
function pegarAlTextAreaEBP() {
	//declaramos las variables;
	var sEBPKey, ebp_NumPagina, iIndice, ElTexto, indicePagina, botonPegar, paginaActual, cajaDeTexto, textoBase, elTextoRD, sCodigo, ultPagRD, ultPagRR, pagTempo, iIndicePag, numeroPagina;
	ultPagRD = 0;
	ultPagRR = 0;
	//si el tipo de página es 1 (referidos rentados) o 2 (referidos directos)
	if (ebp_Tipo_Pag === 1 || ebp_Tipo_Pag === 2) {
		//obtenemos el número de la última página
		ebp_NumPagina = document.getElementById("pagina");
		// Guardar datos en el almacén de la sesión actual
		if (ebp_NumPagina === null) {
			numeroPagina = 1;
		} else {
			numeroPagina = (ebp_NumPagina.selectedIndex + 1);
		}
		//si es la pagina de RR, verificamos si está activa la opcion de agrupar datos
		if (ebp_Tipo_Pag === 1) {
			sEBPKey = "EBPPAGERR";
			//SI está activa la opción de agrupar datos, los agrupamos, sino solamente pegamos los datos de los RR
			if (agruparDatosEBP === true) {
				textoBase = "********************************************************************************" + "\n";
				textoBase = textoBase + "* Summary" + "\n";
				textoBase = textoBase + "********************************************************************************" + "\n";
				textoBase = textoBase + "SummaryTexto" + "\n";
				textoBase = textoBase + "********************************************************************************" + "\n";
				textoBase = textoBase + "* Statistics" + "\n";
				textoBase = textoBase + "********************************************************************************" + "\n";
				textoBase = textoBase + "StatisticsTexto" + "\n";
				textoBase = textoBase + "********************************************************************************" + "\n";
				textoBase = textoBase + "* Direct referrals" + "\n";
				textoBase = textoBase + "********************************************************************************" + "\n";
				textoBase = textoBase + "DirectreferralsTexto" + "\n";
				textoBase = textoBase + "********************************************************************************" + "\n";
				textoBase = textoBase + "* Rented referrals" + "\n";
				textoBase = textoBase + "********************************************************************************" + "\n";
				textoBase = textoBase + "RentedreferralsTexto" + "\n";
				textoBase = textoBase + "********************************************************************************";
				elTextoRD = "";
				ElTexto = "";
				//para el resumen y estadisticas, sustituimos la clave con el texto
				for (iIndice = 0; iIndice < window.localStorage.length; iIndice += 1) {
					sEBPKey = window.localStorage.key(iIndice);
					switch (sEBPKey.substring(0, 9)) {
					case "EBPPAGERE": //pagina Resumen
						textoBase = textoBase.replace("SummaryTexto", window.localStorage.getItem(sEBPKey));
						break;
					case "EBPPAGEES": //pagina estadisticas
						textoBase = textoBase.replace("StatisticsTexto", window.localStorage.getItem(sEBPKey));
						break;
					case "EBPPAGERR": //Referidos rentados
						pagTempo = parseInt(sEBPKey.substring(10, 12), 10);
						if (pagTempo > ultPagRR){
							ultPagRR = pagTempo;
						} 
						break;
					case "EBPPAGERD": //Referidos directos
						pagTempo = parseInt(sEBPKey.substring(10, 12), 10);
						if (pagTempo > ultPagRD){
							ultPagRD = pagTempo;
						} 
						break;
					default:
						break;
					}
				}
				//Leemos las páginas de los RD
				elTextoRD = LeerRDyRR("EBPPAGERD", ultPagRD);
				//Leemos las páginas de los RR
				ElTexto = LeerRDyRR("EBPPAGERR", ultPagRR);
				
				textoBase = textoBase.replace("DirectreferralsTexto", elTextoRD);
				textoBase = textoBase.replace("RentedreferralsTexto", ElTexto);
				ElTexto = textoBase;
			} else {
				ultPagRR = numeroPagina;
				//procesamos los datos ya que estamos en la última o unica página
				//buscamos todos los datos almacenados con el texto EBPPAGERR* y lo copiamos en el textarea
				ElTexto = LeerRDyRR("EBPPAGERR", ultPagRR);
			}
		} else {
			ultPagRD = numeroPagina;
			//procesamos los datos ya que estamos en la última o unica página
			//buscamos todos los datos almacenados con el texto EBPPAGERD y lo copiamos en el textarea
			ElTexto = LeerRDyRR("EBPPAGERD", ultPagRD);
		}
		
		// Copiamos la información en el cuadro de texto
		cajaDeTexto = document.getElementById("ventanaEBPtextArea");
		cajaDeTexto.value = "";
		cajaDeTexto.value = ElTexto;
		
		//al copiar los datos, colocamos el botón en verde
		botonPegar = document.getElementById("ventanaEBPBtnPegar");
		botonPegar.setAttribute("class", "button medium green");
		
	} else {
		alert("No Disponible!");
	}
}

//***********************************************************************************
//**** Creamos el Botón de NeoEstadisticas BigPetorman							*****
//***********************************************************************************
function crearBotonEBP(btnNombre, btnFuncion) {
	var botonEBP, botonImagen, bontonImgImagen, botonTexto;
	
	botonEBP = document.createElement("table");
	botonEBP.setAttribute("id", "NeoExportEBP");
	botonImagen = document.createElement("td");
	botonImagen.setAttribute("style", "padding-right:1px;");
	botonImagen.setAttribute("align", "left");

	bontonImgImagen = document.createElement("img");
	bontonImgImagen.setAttribute("src", "https://img.neobux.com/imagens/texto_32.png");
	bontonImgImagen.setAttribute("height", "20");
	bontonImgImagen.setAttribute("border", "0");
	bontonImgImagen.setAttribute("width", "20");
	botonImagen.appendChild(bontonImgImagen);

	botonTexto = document.createElement("td");
	botonTexto.innerHTML = btnNombre;

	botonEBP.appendChild(botonImagen);
	botonEBP.appendChild(botonTexto);

	botonEBP.addEventListener('click', btnFuncion, false);
	botonEBP.style.textAlign = "center";
	botonEBP.style.padding = "2px";
	botonEBP.style.display = "block";
	botonEBP.style.cursor = "pointer";
	
	//anexamos el boton
	document.getElementById("menu_w").appendChild(botonEBP);
}

//***********************************************************************************
//****esta Crea el div para los datos y/o opciones								*****
//***********************************************************************************
function crearFormularioEBP(nTipo) {
	//declaramos las variables
	var numeroPagina, opcionBtnPegar, opcionBtnCopiar, ventanaEBP, subTablaEBP, subFilaEBP, subColumnaEBP, subImagenEBP, subParrafoEBP, subSpanEBP, textAreaEBP, textoDiv;
	
	// leemos las opciones guardadas en la cookie
	opcionesSeteoEBP();	
	// Creamos la Ventana para los Datos a Exportar
	if (nTipo === 2) {
		// Si la página es la última, se activa el botón de PEGAR, de lo contrario NO (RR)
		if (ebp_Tipo_Pag === 1) {
			opcionBtnCopiar = "visible";
			numeroPagina = document.getElementById("pagina");
			if (numeroPagina === null) {
				// si es nulo el numero de pagina igualmente habilitamos el botón
				opcionBtnPegar = "visible";
			} else {
				//verificamos si la página actual es igual a la última página
				if ((numeroPagina.selectedIndex + 1) === numeroPagina.length) {
					opcionBtnPegar = "visible";
				} else {
					opcionBtnPegar = "hidden";
				}
			}
			
		} else {
			// Si la página es la última, se activa el botón de PEGAR, de lo contrario NO (RD)
			if (ebp_Tipo_Pag === 2) {
				opcionBtnCopiar = "visible";
				numeroPagina = document.getElementById("pagina");
				if (numeroPagina === null) {
					// si es nulo el numero de pagina igualmente habilitamos el botón
					opcionBtnPegar = "visible";
				} else {
					//verificamos si la página actual es igual a la última página
					if ((numeroPagina.selectedIndex + 1) === numeroPagina.length) {
						opcionBtnPegar = "visible";
					} else {
						opcionBtnPegar = "hidden";
					}
				}
				//si está activa la opcion de agrupardatos, deshabilitamos el botón de pegar en lo RD
				if (agruparDatosEBP === true) {
					opcionBtnPegar = "hidden";
				}
			} else {
			
				opcionBtnPegar = "hidden";
				opcionBtnCopiar = "hidden";

				// si está activa la opción de agrupar datos, activamos el botón copiar
				if (agruparDatosEBP === true) {
					opcionBtnCopiar = "visible";
				}
			}
		}
		
		// ahora si creamos el DIV contenedor y establecemos su tamaño
		// ahora si creamos el DIV contenedor y establecemos su tamaño
		ventanaEBP = document.createElement("div");
		ventanaEBP.setAttribute("id", "EBPformularioExporta");
		ventanaEBP.style.position = "absolute";
		ventanaEBP.style.top = 0;
		ventanaEBP.style.bottom = 0;
		ventanaEBP.style.right = 0;
		ventanaEBP.style.left = 0;
		ventanaEBP.style.margin = "auto";
		ventanaEBP.style.width = ebp_AnchoED + "px";
		ventanaEBP.style.height = ebp_AltoED + "px";
		ventanaEBP.style.background = "#FFF";
		ventanaEBP.style.border = "1px solid #333";
		ventanaEBP.style.padding = "10px";
		ventanaEBP.style.display = "none";
		
		textoDiv = '<table style="width: 100%;"><tr style="width: 100%;"><td style="width: 26px; text-align: left;"><img src="https://img.neobux.com/imagens/texto_32.png" style="border: 0px;">';
		textoDiv = textoDiv + '</td><td style="font-size: 14px; font-weight: bold; padding-left: 5px; font-family: Arial; text-align: left;">NeoExportEBP ' + ebp_TextDatos + '</td>';
		textoDiv = textoDiv + '<td style="text-align: right;"><a id="ventanaEBPBtnCerrar" class="button medium black" onselectstart="return false;"><span>' + ebp_TextSalir + '</span></a></td></tr></table>';
		textoDiv = textoDiv + '<textarea id="ventanaEBPtextArea" onmouseover="this.select();" onmouseup="this.select();" onmousedown="this.select();" style="width: ' + (ebp_AnchoED - 5) + 'px; height: ' + (ebp_AltoED - 70) + 'px; resize: none;"></textarea>';
		textoDiv = textoDiv + '<tr style="width: 100%; height: 4px;"></tr><table style="width: 100%;"><tr style="width: 100%;"><td style="width: 80%; font-size: 12px; font-weight: bold; padding-left: 5px; font-family: Arial; text-align: left;"></td>';
		textoDiv = textoDiv + '<td style="width: 10%; visibility: ' + opcionBtnPegar + ';"><a id="ventanaEBPBtnPegar" class="button medium grey" onselectstart="return false;"><span>' + ebp_TextPegar + '</span></a></td>';
		textoDiv = textoDiv + '<td style="width: 10%; visibility: ' + opcionBtnCopiar + ';"><a id="ventanaEBPBtnCopiar" class="button medium grey" onselectstart="return false;"><span>' + ebp_TextCopiar + '</span></a></td></tr></table>';
		ventanaEBP.innerHTML = textoDiv;
		// Lo insertas al final del body
		document.body.appendChild(ventanaEBP);
		//asignamos las funciones a los botones Cerrar, Copiar y Pegar
		document.getElementById("ventanaEBPBtnCerrar").onclick = function () {ocultaMuestraFormulario()};
		document.getElementById("ventanaEBPBtnPegar").onclick = function () {pegarAlTextAreaEBP()};
		document.getElementById("ventanaEBPBtnCopiar").onclick = function() {copiarTextAreaEBP()};
		
	// Creamos la Ventana para las opciones
	} else {
		// ahora si creamos el DIV contenedor para las opciones
		ventanaEBP = document.createElement("div");
		ventanaEBP.setAttribute("id", "EBPformularioExporta");
		ventanaEBP.style.display = "none";
		ventanaEBP.style.position = "absolute";
		ventanaEBP.style.top = 0;
		ventanaEBP.style.bottom = 0;
		ventanaEBP.style.right = 0;
		ventanaEBP.style.left = 0;
		ventanaEBP.style.margin = "auto";
		ventanaEBP.style.width = ebp_AnchoED + "px";
		ventanaEBP.style.height = ebp_AltoED + "px";
		ventanaEBP.style.background = "#FFF";
		ventanaEBP.style.border = "1px solid #333";
		ventanaEBP.style.padding = "10px";
		
		textoDiv = '<table style="width: 100%;"><tr style="width: 100%;"><td style="width: 26px; text-align: left;"><img src="https://img.neobux.com/imagens/texto_32.png" style="border: 0px;"></td>';
		textoDiv = textoDiv + '<td style="font-size: 14px; font-weight: bold; padding-left: 5px; font-family: Arial; text-align: left;">NeoExportEBP ' + ebp_TextConfig + '</td><td style="text-align: right; width: 10%;">';
		textoDiv = textoDiv + '<a id="ventanaEBPBtnGuardar" class="button medium black" onselectstart="return false;"><span>' + ebp_TextGuarda + '</span></a></td><td style="text-align: right; width: 10%;">';
		textoDiv = textoDiv + '<a id="ventanaEBPBtnCerrar" class="button medium black" onselectstart="return false;"><span>' + ebp_TextSalir + '</span></a></td></tr></table>';
		textoDiv = textoDiv + '<table style="width: ' + (ebp_AnchoED - 5) + 'px; border: 1px solid rgb(51, 51, 51);"><tr style="width: 100%;"><td><label style="font-size: 12px; padding: 10px;">' + ebp_TextMensL1 + '</label>';
		textoDiv = textoDiv + '<input id="opcionesFechaStandardEBP" type="checkbox" name="opcionesFechaNeobuxEBP" value="' + fechaStandardEBP + '" style="padding: 4px;"></td></tr><tr style="width: 100%; height: 4px;"><td></td></tr>';
		textoDiv = textoDiv + '<tr style="width: 100%;"><td><span style="padding: 4px; font-size: 10px;">' + ebp_TextMensL2 + ' <br />' + ebp_TextMensL3 + '</span></td></tr>';
		textoDiv = textoDiv + '<tr style="width: 100%; height: 4px;"><td></td></tr><tr style="width: 100%;"><td><label style="padding: 10px; font-size: 12px;">' + ebp_TextMensL4 + '</label>';
		textoDiv = textoDiv + '<input id="opcionesFechaNeobuxEBP" type="checkbox" name="opcionesFechaNeobuxEBP" value="' + fechaNeobuxEBP + '" style="padding: 4px;"></td></tr><tr style="width: 100%; height: 4px;"><td></td></tr></table>';
		textoDiv = textoDiv + '<table style="width: 495px;"><tr style="width: 100%;"><td><span style="padding: 4px; font-size: 10px; width: 100%;">' + ebp_TextMensL5 + '</span></td></tr>';
		textoDiv = textoDiv + '<tr style="width: 100%; height: 8px;"><td></td></tr></table><table style="width: 495px; border: 1px solid rgb(51, 51, 51);"><tr style="width: 100%;"><td><label style="font-size: 12px; padding: 10px;">' + ebp_TextMensL6 + '</label>';
		textoDiv = textoDiv + '<input id="opcionesAgruparDatosEBP" type="checkbox" name="opcionesAgruparDatosEBP" value="1" style="padding: 4px;"></td></tr><tr style="width: 100%; height: 4px;"><td></td></tr>';
		textoDiv = textoDiv + '<tr style="width: 100%;"><td><span style="padding: 4px; font-size: 10px;">' + ebp_TextMensL7 + '</span></td></tr></table>';
		ventanaEBP.innerHTML = textoDiv;
		
		// Lo insertas al final del body
		document.body.appendChild(ventanaEBP);
		//asignamos las funciones a los botones Cerrar, guardar y a las checkbox
		document.getElementById("ventanaEBPBtnCerrar").onclick = function () {ocultaMuestraFormulario()};
		document.getElementById("ventanaEBPBtnGuardar").onclick = function () {opcionarGuardarEBP()};
		document.getElementById("opcionesFechaStandardEBP").onclick = function () {ebpOpcionesCheckBox()};
		document.getElementById("opcionesFechaNeobuxEBP").onclick = function () {ebpOpcionesCheckBox_2()};
		
		
	}
}
	
//***********************************************************************************
//****	función para mostrar la fecha de la última actualizacion de datos		*****
//***********************************************************************************
function mostrarUltAct(tipoVentana) {
	var numeroPagina, sEBPKey, ultimaFecha, iIndice, sClave, lineaMensaje, fechaHoy, msecPerMinute, msecPerHour, msecPerDay, intervaloHrs, intervaloMin,  textoMostrar;
	
	opcionesSeteoEBP();
	//obtenemos el texto a buscar en el localstorage
	if (tipoVentana === "EBPPAGERR" || tipoVentana === "EBPPAGERD") {
		numeroPagina = document.getElementById("pagina");
		if (numeroPagina === null) {
			numeroPagina = 1;
		} else {
			numeroPagina = numeroPagina.selectedIndex + 1;
		}
		
		if (numeroPagina < 10) {
			numeroPagina = "00" + numeroPagina;
		} else {
			if (numeroPagina < 100) {
				numeroPagina = "0" + numeroPagina;
			}
		}
		sClave = tipoVentana + numeroPagina;
	} else {
		if (agruparDatosEBP !== true){
			lineaMensaje = document.getElementById('EBPformularioExporta').getElementsByTagName('table')[1].getElementsByTagName('td')[0];
			lineaMensaje.textContent = "";
			return;	
		}
		sClave = tipoVentana;
	}
	ultimaFecha = "";
	for (iIndice = 0; iIndice < window.localStorage.length; iIndice += 1) {
		sEBPKey = window.localStorage.key(iIndice);
		if (sEBPKey.indexOf(sClave) !== -1) {
			ultimaFecha = sEBPKey.substring(sClave.length);
			break;
		}
	}
	
	//si no hay fecha, colocamos el mensaje, de lo contario colocamos la fecha
	if (ultimaFecha === "") {
		textoMostrar = ebp_LastUpdate + ": " + ebp_MensLU;
	} else {
		//seteamos la nueva fecha
		fechaHoy = new Date(ultimaFecha.substring(4, 8), ultimaFecha.substring(2, 4) - 1, ultimaFecha.substring(0, 2), ultimaFecha.substring(8, 10), ultimaFecha.substring(10, 12), '00');
		
		if (ebp_Idioma === "es") {
			textoMostrar = ebp_LastUpdate + ": " + fechaHoy.toLocaleDateString("es-ES", opcionesFecha);
		} else {
			textoMostrar = ebp_LastUpdate + ": " + fechaHoy.toLocaleDateString("en-US", opcionesFecha);
		}
	}
	
	lineaMensaje = document.getElementById('EBPformularioExporta').getElementsByTagName('table')[1].getElementsByTagName('td')[0];
	lineaMensaje.textContent = textoMostrar;
	
}
//***********************************************************************************
//****	función para mostrar la ventana con los datos							*****
//***********************************************************************************
function mostrarVentana(elTexto, tipoVentana) {
	// declaramos las variables 
	var ebpTextAreaDatos;
	
	//obtenemos el campo de los datos y le pasamos los mismos
	ebpTextAreaDatos = document.getElementById("ventanaEBPtextArea");
	ebpTextAreaDatos.value = elTexto;
	mostrarUltAct(tipoVentana);
	ocultaMuestraFormulario();
}
//***********************************************************************************
//**** Para la página de Opciones Personales									*****
//***********************************************************************************
function mostrarVentanaOpciones() {
	var formularioOpciones, formularioSetting;
	
	//obtenemos el formulario de Opciones, si está oculto lo mostramos o sino lo ocultamos
	formularioOpciones = document.getElementById('EBPformularioExporta');
	if (formularioOpciones.style.display === 'none') {
		formularioOpciones.style.display = 'block';
	} else {
		formularioOpciones.style.display = 'none';
	}
}
//***********************************************************************************
//****	función llamada trim() en la clase String								*****
//****	Elimina los espacios antes y despues del texto							*****
//***********************************************************************************
String.prototype.trim = function () {
	var elReemplazo = "";
	elReemplazo = this.replace(/^\s+|\s+$/g, "");
	return elReemplazo;
};

//***********************************************************************************
//****función, que nos permite mostrar un número con dos carácteres en vez de uno****
//***********************************************************************************
Number.prototype.double = function () {
	var nm = String(this);
	if (nm == '0') {
		return nm;
	} else {
		if (nm.length < 2) {
			return '0' + nm;
		} else {
			return nm;
		}
	}
};

//***********************************************************************************
//****funcion para establecer el idioma a utilizar								*****
//***********************************************************************************
function miIdioma() {
	
	ebp_Idioma = document.body.innerHTML.indexOf("c0 f-") + 5;
	ebp_Idioma = document.body.innerHTML.substring(ebp_Idioma, ebp_Idioma + 2);
	
	/*
	var IdiomaIngles = ["Direct;Rented;You", "Today", "Yesterday", "Tomorrow"; "Expired...", "No clicks yet", "clicks today:", "clicks yesterday:", "clicks last 10 days:", "Total own clicks:", "Fixed fuchsia clicks:", "Micro clicks:", "Mini clicks:", "Extended clicks:", "Standard clicks:", "Fixed orange clicks:", "clicks today RD:", "clicks yesterday RD:", "clicks last 10 days RD:", "clicks today RR:", "clicks yesterday RR:", "clicks last 10 days RR:", "recycling today:", "recycling yesterday:", "recycling last 10 days:", "Automatic Recycling today:", "renewal today:", "renewal yesterday:", "renewal last 10 days:", "renewal today (Manual):", "renewal yesterday (Manual):", "renewal last 10 days (Manual):", "renewal today (AutoRenew):", "renewal yesterday (AutoRenew):", "renewal last 10 days (AutoRenew):", "AutoPay today:", "AutoPay yesterday:", "AutoPay last 10 days:", "Relative", "Real", "Settings";"Data", "Save", "Close", "Copy", "Paste", "Export Dates in Standard Format?", "The data is exported in the format YYYY/MM/DD HH:MM",'in the data "last click", the hours are placed at 00:00', "Exporta Data in NeoBux format?", "This is only for the data of direct referrals and rented"];*/
	
	switch (ebp_Idioma) {
	case "us": //Ingles
		ebp_DirectText = "Direct;Rented;You";
		ebp_isToday = "Today";
		ebp_isYesterday = "Yesterday";
		ebp_isTomorrow = "Tomorrow";
		ebp_isExpired = "Expired...";
		ebp_noClick = "No clicks yet";
		ebp_TotClicsHoy = "clicks today:";
		ebp_TotClicsAyer = "clicks yesterday:";
		ebp_TotClics10Dias = "clicks last 10 days:";
		ebp_CPTotalHoy = "Total own clicks:";
		ebp_CPFijosFHoy = "Fixed fuchsia clicks:";
		ebp_CPMicroHoy = "Micro clicks:";
		ebp_CPMiniHoy = "Mini clicks:";
		ebp_CPProlongadoHoy = "Extended clicks:";
		ebp_CPStandarHoy = "Standard clicks:";
		ebp_CPFijosNHoy = "Fixed orange clicks:";
		ebp_ClicsHoyRD = "clicks today RD:";
		ebp_ClicsAyerRD = "clicks yesterday RD:";
		ebp_Clics10DiasRD = "clicks last 10 days RD:";
		ebp_ClicsHoyRR = "clicks today RR:";
		ebp_ClicsAyerRR = "clicks yesterday RR:";
		ebp_Clics10DiasRR = "clicks last 10 days RR:";
		ebp_MontReciclaHoy = "recycling today:";
		ebp_MontReciclaAyer = "recycling yesterday:";
		ebp_MontRecicla10Dias = "recycling last 10 days:";
		ebp_ReciclaGratisHoy = "Automatic Recycling today:";
		ebp_MontRenuevaHoy = "renewal today:";
		ebp_MontRenuevaAyer = "renewal yesterday:";
		ebp_MontRenueva10Dias = "renewal last 10 days:";

		ebp_MontRenuevaHoyManual = "renewal today (Manual):";
		ebp_MontRenuevaAyerManual = "renewal yesterday (Manual):";
		ebp_MontRenueva10DiasManual = "renewal last 10 days (Manual):";
		ebp_MontRenuevaHoyAuto = "renewal today (AutoRenew):";
		ebp_MontRenuevaAyerAuto = "renewal yesterday (AutoRenew):";
		ebp_MontRenueva10DiasAuto = "renewal last 10 days (AutoRenew):";

		ebp_MontAutoPagoHoy = "AutoPay today:";
		ebp_MontAutoPagoAyer = "AutoPay yesterday:";
		ebp_MontAutoPago10Dias = "AutoPay last 10 days:";
		ebp_ffRelativa = "Relative";
		ebp_ffExacta = "Real";
		ebp_TextConfig = "Settings";
		ebp_TextDatos = "Data";
		ebp_TextGuarda = "Save";
		ebp_TextSalir = "Close";
		ebp_TextCopiar = "Copy";
		ebp_TextPegar = "Paste";
		ebp_TextMensL1 = "Export Dates in Standard Format?";
		ebp_TextMensL2 = "The data is exported in the format YYYY/MM/DD HH:MM";
		ebp_TextMensL3 = 'in the data "last click", the hours are placed at 00:00';
		ebp_TextMensL4 = "Exporta Data in NeoBux format?";
		ebp_TextMensL5 = "This is only for the data of direct referrals and rented";
		ebp_TextMensL6 = "Group and Show all data on the last page?";
		ebp_TextMensL7 = "The Copy button is enabled on all pages, and all data is pasted in the last window, separating the groups with a few dashes -";
		ebp_LastUpdate = "Last update";
		ebp_MensLU = "Not updated";
		break;
	case "es": //Español
		ebp_DirectText = "Directos;Alquilados;Usted";
		ebp_isToday = "Hoy";
		ebp_isYesterday = "Ayer";
		ebp_isTomorrow = "Mañana";
		ebp_isExpired = "Expirado...";
		ebp_noClick = "Sin clics aún";
		ebp_TotClicsHoy = "Clics Hoy:";
		ebp_TotClicsAyer = "Clics Ayer:";
		ebp_TotClics10Dias = "Clics Ult 10 Días:";
		ebp_CPTotalHoy = "total clics propios:";
		ebp_CPFijosFHoy = "clics Fijos fucsia:";
		ebp_CPMicroHoy = "clics Micro:";
		ebp_CPMiniHoy = "clics Mini:";
		ebp_CPProlongadoHoy = "clics Prolongados:";
		ebp_CPStandarHoy = "clics Standard:";
		ebp_CPFijosNHoy = "clics Fijos naranja:";
		ebp_ClicsHoyRD = "Clics Hoy RD:";
		ebp_ClicsAyerRD = "Clics Ayer RD:";
		ebp_Clics10DiasRD = "Clics Ult 10 Días RD:";
		ebp_ClicsHoyRR = "Clics Hoy RR:";
		ebp_ClicsAyerRR = "Clics Ayer RR:";
		ebp_Clics10DiasRR = "Clics Ult 10 Días RR:";
		ebp_MontReciclaHoy = "Reciclaje Hoy:";
		ebp_MontReciclaAyer = "Recicajes Ayer:";
		ebp_MontRecicla10Dias = "Reciclaje Ult 10 Días:";
		ebp_ReciclaGratisHoy = "Reciclaje Automático Hoy:";
		ebp_MontRenuevaHoy = "Renovaciones Hoy:";
		ebp_MontRenuevaAyer = "Renovaciones Ayer:";
		ebp_MontRenueva10Dias = "Renovaciones Ult 10 Días:";

		ebp_MontRenuevaHoyManual = "Renovaciones Hoy (Manual):";
		ebp_MontRenuevaAyerManual = "Renovaciones Ayer (Manual):";
		ebp_MontRenueva10DiasManual = "Renovaciones Ult 10 Días (Manual):";
		ebp_MontRenuevaHoyAuto = "Renovaciones Hoy (AutoRenovación):";
		ebp_MontRenuevaAyerAuto = "Renovaciones Ayer (AutoRenovación):";
		ebp_MontRenueva10DiasAuto = "Renovaciones Ult 10 Días (AutoRenovación):";

		ebp_MontAutoPagoHoy = "Autopago Hoy:";
		ebp_MontAutoPagoAyer = "Autopago Ayer:";
		ebp_MontAutoPago10Dias = "Autopago Ult 10 Días:";
		ebp_ffRelativa = "Relativas";
		ebp_ffExacta = "Exactas";
		ebp_TextConfig = "Configuración";
		ebp_TextDatos = "Datos";
		ebp_TextGuarda = "Guardar";
		ebp_TextSalir = "Cerrar";
		ebp_TextCopiar = "Copiar";
		ebp_TextPegar = "Pegar";
		ebp_TextMensL1 = "Exportar las Fechas en Formato Standard?";
		ebp_TextMensL2 = "La Fecha se Exporta en el formato AAAA/MM/DD HH:MM";
		ebp_TextMensL3 = 'Para el campo "último Clic" las horas se colocan en 00:00';
		ebp_TextMensL4 = "Exporta datos en formato de NeoBux?";
		ebp_TextMensL5 = "Esto es solamente para los datos de referidos directos y rentados";
		ebp_TextMensL6 = "Agrupar y Mostrar todos los datos en la última página?";
		ebp_TextMensL7 = "Se habilita el botón Copiar en todas las páginas, y se pegan todos los datos en la ultima ventana, separando los grupos con unos guiones --";
		ebp_LastUpdate = "Ultima actualización";
		ebp_MensLU = "Sin actualizar";
		break;
	case "pt": //Portugués
		ebp_DirectText = "Directos;Alugados;Você";
		ebp_isToday = "Hoje";
		ebp_isYesterday = "Ontem";
		ebp_isTomorrow = "Amanhã";
		ebp_isExpired = "Expirado...";
		ebp_noClick = "Sem cliques";
		ebp_TotClicsHoy = "cliques de hoje:";
		ebp_TotClicsAyer = "cliques ontem:";
		ebp_TotClics10Dias = "cliques últimos 10 dias:";
		ebp_CPTotalHoy = "totais próprios cliques:";
		ebp_CPFijosFHoy = "Cliques fúcsia fixos:";
		ebp_CPMicroHoy = "Cliques Micro:";
		ebp_CPMiniHoy = "Cliques Mini:";
		ebp_CPProlongadoHoy = "Cliques Prolongada:";
		ebp_CPStandarHoy = "Cliques Normal:";
		ebp_CPFijosNHoy = "Cliques laranja fixos:";
		ebp_ClicsHoyRD = "cliques de hoje RD:";
		ebp_ClicsAyerRD = "cliques ontem RD:";
		ebp_Clics10DiasRD = "cliques últimos 10 dias RD:";
		ebp_ClicsHoyRR = "cliques de hoje RR:";
		ebp_ClicsAyerRR = "cliques ontem RR:";
		ebp_Clics10DiasRR = "cliques últimos 10 dias RR:";
		ebp_MontReciclaHoy = "reciclagem hoje:";
		ebp_MontReciclaAyer = "reciclagem de ontem:";
		ebp_MontRecicla10Dias = "reciclagem últimos 10 dias:";
		ebp_ReciclaGratisHoy = "Reciclagem Automática hoje:";
		ebp_MontRenuevaHoy = "renovação hoje:";
		ebp_MontRenuevaAyer = "renovação de ontem:";
		ebp_MontRenueva10Dias = "renovação últimos 10 dias:";

		ebp_MontRenuevaHoyManual = "renovação hoje (Manual):";
		ebp_MontRenuevaAyerManual = "renovação de ontem (Manual):";
		ebp_MontRenueva10DiasManual = "renovação últimos 10 dias (Manual):";
		ebp_MontRenuevaHoyAuto = "renovação hoje (AutoRenovação):";
		ebp_MontRenuevaAyerAuto = "renovação de ontem (AutoRenovação):";
		ebp_MontRenueva10DiasAuto = "renovação últimos 10 dias (AutoRenovação):";

		ebp_MontAutoPagoHoy = "AutoPagamento hoje:";
		ebp_MontAutoPagoAyer = "AutoPagamento ontem:";
		ebp_MontAutoPago10Dias = "AutoPagamento últimos 10 dias:";
		ebp_ffRelativa = "Relativas";
		ebp_ffExacta = "Reais";
		ebp_TextConfig = "configurações";
		ebp_TextDatos = "dados";
		ebp_TextGuarda = "salvar";
		ebp_TextSalir = "fechar";
		ebp_TextCopiar = "Copy";
		ebp_TextPegar = "Paste";
		ebp_TextMensL1 = "Exportar datas no formato Standard?";
		ebp_TextMensL2 = "Os dados são exportados no formato AAAA/MM/DD HH:MM";
		ebp_TextMensL3 = 'nos dados do "último clique", as horas são colocados às 00:00';
		ebp_TextMensL4 = "Exportar dados em formato NeoBux??";
		ebp_TextMensL5 = "Esta é apenas para os dados de referências diretas e referidos alugados";
		ebp_TextMensL6 = "Grupo e Mostrar todos os dados na última página?";
		ebp_TextMensL7 = "O botão Copiar é habilitado em todas as páginas, e todos os dados são colados na última janela, separando os grupos com poucos traços -";
		ebp_LastUpdate = "Última atualização";
		ebp_MensLU = "Não atualizado";
		break;
	case "gr": //Griego - Greek
		ebp_DirectText = "?µes??;?????asµ????;?se??";
		ebp_isToday = "S?µe?a";
		ebp_isYesterday = "??e?";
		ebp_isTomorrow = "????? st??";
		ebp_isExpired = "????e...";
		ebp_noClick = "????? ????";
		ebp_TotClicsHoy = "???? s?µe?a:";
		ebp_TotClicsAyer = "???? ??e?:";
		ebp_TotClics10Dias = "???? te?e?ta?e? 10 ?µ??e?:";
		ebp_CPTotalHoy = "s????? t?? ?d??? ????:";
		ebp_CPFijosFHoy = "Sta?e?? ???? f????a:";
		ebp_CPMicroHoy = "Micro ????:";
		ebp_CPMiniHoy = "???? ????:";
		ebp_CPProlongadoHoy = "??tetaµ??? ????:";
		ebp_CPStandarHoy = "?a?????? ????:";
		ebp_CPFijosNHoy = "Sta?e?? ???? p??t??a??:";
		ebp_ClicsHoyRD = "???? s?µe?a RD:";
		ebp_ClicsAyerRD = "???? ??e? RD:";
		ebp_Clics10DiasRD = "???? te?e?ta?e? 10 ?µ??e? RD:";
		ebp_ClicsHoyRR = "???? s?µe?a RR:";
		ebp_ClicsAyerRR = "???? ??e? RR:";
		ebp_Clics10DiasRR = "???? te?e?ta?e? 10 ?µ??e? RR:";
		ebp_MontReciclaHoy = "a?a?????s? s?µe?a:";
		ebp_MontReciclaAyer = "a?a?????s? ??e?:";
		ebp_MontRecicla10Dias = "a?a?????s? te?e?ta?e? 10 ?µ??e?:";
		ebp_ReciclaGratisHoy = "auto-a?a????????ta? s?µe?a:";
		ebp_MontRenuevaHoy = "a?a???s? s?µe?a:";
		ebp_MontRenuevaAyer = "a?a???s? t?? ??e?:";
		ebp_MontRenueva10Dias = "a?a???s? te?e?ta?e? 10 ?µ??e?:";

		ebp_MontRenuevaHoyManual = "a?a???s? s?µe?a (?e???????t?):";
		ebp_MontRenuevaAyerManual = "a?a???s? t?? ??e? (?e???????t?):";
		ebp_MontRenueva10DiasManual = "a?a???s? te?e?ta?e? 10 ?µ??e? (?e???????t?):";
		ebp_MontRenuevaHoyAuto = "a?a???s? s?µe?a (??t???a???s?):";
		ebp_MontRenuevaAyerAuto = "a?a???s? t?? ??e? (??t???a???s?):";
		ebp_MontRenueva10DiasAuto = "a?a???s? te?e?ta?e? 10 ?µ??e? (??t???a???s?):";

		ebp_MontAutoPagoHoy = "Autopay s?µe?a:";
		ebp_MontAutoPagoAyer = "Autopay ??e?:";
		ebp_MontAutoPago10Dias = "Autopay te?e?ta?e? 10 ?µ??e?:";
		ebp_ffRelativa = "S?et????";
		ebp_ffExacta = "????ße??";
		ebp_TextConfig = "???µ?se??";
		ebp_TextDatos = "ded?µ??a";
		ebp_TextGuarda = "e?t??";
		ebp_TextSalir = "???t?";
		ebp_TextCopiar = "Copy";
		ebp_TextPegar = "Paste";
		ebp_TextMensL1 = "?µe??µ???e? ??a???? se t?p?p???µ??? µ??f?;";
		ebp_TextMensL2 = "?a ded?µ??a p?? e?????ta? µe t? µ??f? YYYY/MM/DD HH:MM";
		ebp_TextMensL3 = 'ded?µ??a st? "te?e?ta?? ????", ?? ??e? p?? d?at??e?ta? st?? 00:00';
		ebp_TextMensL4 = "??a???? ded?µ???? se µ??f? Neobux?";
		ebp_TextMensL5 = "??t? e??a? µ??? ??a ta ded?µ??a t?? ?µes?? pa?ap?µp?? ?a? e?????a??µe?a pa?ap?µp??";
		ebp_TextMensL6 = "?µ?da ?a? ?µf???s? ???? t?? ded?µ???? st?? te?e?ta?a se??da";
		ebp_TextMensL7 = "?? ???µp? Copy e??a? e?e???p???µ??? se ??e? t?? se??de?, ?a? ??a ta ded?µ??a ep???????e? st? te?e?ta?? pa??????, d?a???????ta? t?? ?µ?de? µe ???a pa??e? -";
		ebp_LastUpdate = "?e?e?ta?a e??µ???s?";
		ebp_MensLU = "de? e??µe?????ta?";
		break;
	case "id": //indonesio
		ebp_DirectText = "Langsung;Sewa;Anda";
		ebp_isToday = "Hari ini";
		ebp_isYesterday = "Kemarin";
		ebp_isTomorrow = "Besok";
		ebp_isExpired = "Kadaluarsa...";
		ebp_noClick = "Belum ada klik";
		ebp_TotClicsHoy = "klik Hari ini:";
		ebp_TotClicsAyer = "klik kemarin:";
		ebp_TotClics10Dias = "klik 10 hari terakhir:";
		ebp_CPTotalHoy = "Total klik sendiri:";
		ebp_CPFijosFHoy = "Klik fuchsia tetap:";
		ebp_CPMicroHoy = "klik Micro:";
		ebp_CPMiniHoy = "klik Mini:";
		ebp_CPProlongadoHoy = "klik diperpanjang:";
		ebp_CPStandarHoy = "klik standar:";
		ebp_CPFijosNHoy = "Klik oranye tetap:";
		ebp_ClicsHoyRD = "klik Hari ini RD:";
		ebp_ClicsAyerRD = "klik kemarin RD:";
		ebp_Clics10DiasRD = "klik 10 hari terakhir:";
		ebp_ClicsHoyRR = "klik Hari ini RR:";
		ebp_ClicsAyerRR = "klik kemarin RR:";
		ebp_Clics10DiasRR = "klik 10 hari terakhir:";
		ebp_MontReciclaHoy = "daur ulang Hari ini:";
		ebp_MontReciclaAyer = "daur ulang kemarin:";
		ebp_MontRecicla10Dias = "daur ulang 10 hari terakhir:";
		ebp_ReciclaGratisHoy = "Daur Ulang Otomatis Hari ini:";
		ebp_MontRenuevaHoy = "pembaharuan hari ini:";
		ebp_MontRenuevaAyer = "pembaharuan kemarin:";
		ebp_MontRenueva10Dias = "perpanjangan 10 hari terakhir:";

		ebp_MontRenuevaHoyManual = "pembaharuan hari ini (Manual):";
		ebp_MontRenuevaAyerManual = "pembaharuan kemarin (Manual):";
		ebp_MontRenueva10DiasManual = "perpanjangan 10 hari terakhir (Manual):";
		ebp_MontRenuevaHoyAuto = "pembaharuan hari ini (AutoRenew):";
		ebp_MontRenuevaAyerAuto = "pembaharuan kemarin (AutoRenew):";
		ebp_MontRenueva10DiasAuto = "perpanjangan 10 hari terakhir (AutoRenew):";

		ebp_MontAutoPagoHoy = "AutoPay hari ini:";
		ebp_MontAutoPagoAyer = "AutoPay kemarin:";
		ebp_MontAutoPago10Dias = "AutoPay 10 hari terakhir:";
		ebp_ffRelativa = "Relatif";
		ebp_ffExacta = "Sebenarnya";
		ebp_TextConfig = "pengaturan";
		ebp_TextDatos = "Data";
		ebp_TextGuarda = "menyimpan";
		ebp_TextSalir = "menutup";
		ebp_TextCopiar = "Copy";
		ebp_TextPegar = "Paste";
		ebp_TextMensL1 = "Ekspor Tanggal Format Standar?";
		ebp_TextMensL2 = "Data tersebut diekspor dalam format YYYY/MM/DD HH:MM";
		ebp_TextMensL3 = 'dalam "klik terakhir" data, jam ditempatkan pada jam 00:00';
		ebp_TextMensL4 = "Ekspor data dalam format neobux?";
		ebp_TextMensL5 = "Ini hanya untuk data dari arahan langsung dan arahan disewa";
		ebp_TextMensL6 = "Group dan Tampilkan semua data pada halaman terakhir?";
		ebp_TextMensL7 = "Tombol Copy diaktifkan pada semua halaman, dan semua data yang disisipkan di jendela terakhir, memisahkan kelompok dengan beberapa strip -";
		ebp_LastUpdate = "Pembaharuan Terakhir";
		ebp_MensLU = "tidak diperbarui";
		break;
	case "fi": //finlandés		
		ebp_DirectText = "Suorat;Vuokratut;Sinä";
		ebp_isToday = "Tänään";
		ebp_isYesterday = "Eilen";
		ebp_isTomorrow = "Huomenna";
		ebp_isExpired = "Erääntynyt...";
		ebp_noClick = "Ei klikkejä";
		ebp_TotClicsHoy = "napsauttaa tänään:";
		ebp_TotClicsAyer = "napsauttaa eilen:";
		ebp_TotClics10Dias = "napsauttaa viimeisen 10 päivän:";
		ebp_CPTotalHoy = "kaikista omista napsauttaa:";
		ebp_CPFijosFHoy = "Kiinteä fuksia napsauttaa:";
		ebp_CPMicroHoy = "Micro napsauttaa:";
		ebp_CPMiniHoy = "Mini napsauttaa:";
		ebp_CPProlongadoHoy = "Laajennettu napsauttaa:";
		ebp_CPStandarHoy = "Standard napsauttaa:";
		ebp_CPFijosNHoy = "Kiinteä oranssi napsauttaa:";
		ebp_ClicsHoyRD = "napsauttaa tänään RD:";
		ebp_ClicsAyerRD = "napsauttaa eilen RD:";
		ebp_Clics10DiasRD = "napsauttaa viimeisen 10 päivän RD:";
		ebp_ClicsHoyRR = "napsauttaa tänään RR:";
		ebp_ClicsAyerRR = "napsauttaa eilen RR:";
		ebp_Clics10DiasRR = "napsauttaa viimeisen 10 päivän RR:";
		ebp_MontReciclaHoy = "kierrätys tänään:";
		ebp_MontReciclaAyer = "kierrätys eilen:";
		ebp_MontRecicla10Dias = "kierrätys viimeisen 10 päivän:";
		ebp_ReciclaGratisHoy = "Automaattinen kierrätys Tänään:";
		ebp_MontRenuevaHoy = "uusiminen tänään:";
		ebp_MontRenuevaAyer = "uusiminen eilen:";
		ebp_MontRenueva10Dias = "uusiminen viimeisen 10 päivän:";

		ebp_MontRenuevaHoyManual = "uusiminen tänään (Manuaalisesti):";
		ebp_MontRenuevaAyerManual = "uusiminen eilen (Manuaalisesti):";
		ebp_MontRenueva10DiasManual = "uusiminen viimeisen 10 päivän (Manuaalisesti):";
		ebp_MontRenuevaHoyAuto = "uusiminen tänään (AutoRenew):";
		ebp_MontRenuevaAyerAuto = "uusiminen eilen (AutoRenew):";
		ebp_MontRenueva10DiasAuto = "uusiminen viimeisen 10 päivän (AutoRenew):";

		ebp_MontAutoPagoHoy = "AutoPay tänään:";
		ebp_MontAutoPagoAyer = "AutoPay eilen:";
		ebp_MontAutoPago10Dias = "AutoPay viimeisen 10 päivän:";
		ebp_ffRelativa = "Suhteelliset";
		ebp_ffExacta = "Reaaliset";
		ebp_TextConfig = "Asetukset";
		ebp_TextDatos = "tiedot";
		ebp_TextGuarda = "säästää";
		ebp_TextSalir = "lähellä";
		ebp_TextCopiar = "Copy";
		ebp_TextPegar = "Paste";
		ebp_TextMensL1 = "Vie päivämäärät Standard Format?";
		ebp_TextMensL2 = "Data viedään muodossa YYYY/MM/DD HH:MM";
		ebp_TextMensL3 = 'in data "viimeinen klikkaa" tunnit sijoitetaan klo 00:00';
		ebp_TextMensL4 = "Vie Dataa NeoBux muodossa?";
		ebp_TextMensL5 = "Tämä on vain tiedot suoraan lähetteet ja vuokra lähetteitä";
		ebp_TextMensL6 = "Ryhmä ja Näytä kaikki tiedot viimeisellä sivulla?";
		ebp_TextMensL7 = "Kopioi-painiketta on käytössä kaikilla sivuilla, ja kaikki data liitetään viimeisessä ikkunassa, erottamalla ryhmät muutamia viivoja -";
		ebp_LastUpdate = "Viimeisin päivitys";
		ebp_MensLU = "ei ole päivitetty";
		break;
	case "se": //Sueco
		ebp_DirectText = "Direkta;Hyrda;Du";
		ebp_isToday = "Idag";
		ebp_isYesterday = "Igår";
		ebp_isTomorrow = "I morgon";
		ebp_isExpired = "Utgången...";
		ebp_noClick = "Inga klick";
		ebp_TotClicsHoy = "klick idag:";
		ebp_TotClicsAyer = "klick igår:";
		ebp_TotClics10Dias = "klick senaste 10 dagarna:";
		ebp_CPTotalHoy = "totala egna klick:";
		ebp_CPFijosFHoy = "Fasta fuchsia klick:";
		ebp_CPMicroHoy = "mikro klick:";
		ebp_CPMiniHoy = "Mini klick:";
		ebp_CPProlongadoHoy = "Förlängda klick:";
		ebp_CPStandarHoy = "Standard klick:";
		ebp_CPFijosNHoy = "Fasta apelsin klick:";
		ebp_ClicsHoyRD = "klick idag RD:";
		ebp_ClicsAyerRD = "klick igår RD:";
		ebp_Clics10DiasRD = "klick senaste 10 dagarna RD:";
		ebp_ClicsHoyRR = "klick idag RR:";
		ebp_ClicsAyerRR = "klick igår RR:";
		ebp_Clics10DiasRR = "klick senaste 10 dagarna RR:";
		ebp_MontReciclaHoy = "återvinning idag:";
		ebp_MontReciclaAyer = "återvinning igår:";
		ebp_MontRecicla10Dias = "återvinning senaste 10 dagarna:";
		ebp_ReciclaGratisHoy = "Automatiskt referalbyte idag:";
		ebp_MontRenuevaHoy = "förnyelse idag:";
		ebp_MontRenuevaAyer = "förnyelse i går:";
		ebp_MontRenueva10Dias = "förnyelse senaste 10 dagarna:";

		ebp_MontRenuevaHoyManual = "förnyelse idag (Manuellt):";
		ebp_MontRenuevaAyerManual = "förnyelse i går (Manuellt):";
		ebp_MontRenueva10DiasManual = "förnyelse senaste 10 dagarna (Manuellt):";
		ebp_MontRenuevaHoyAuto = "förnyelse idag (AutoRenew):";
		ebp_MontRenuevaAyerAuto = "förnyelse i går (AutoRenew):";
		ebp_MontRenueva10DiasAuto = "förnyelse senaste 10 dagarna (AutoRenew):";

		ebp_MontAutoPagoHoy = "AutoPay idag:";
		ebp_MontAutoPagoAyer = "AutoPay igår:";
		ebp_MontAutoPago10Dias = "AutoPay senaste 10 dagarna:";
		ebp_ffRelativa = "Relativa";
		ebp_ffExacta = "Reella";
		ebp_TextConfig = "inställningar";
		ebp_TextDatos = "data som";
		ebp_TextGuarda = "Spara";
		ebp_TextSalir = "stänga";
		ebp_TextCopiar = "Copy";
		ebp_TextPegar = "Paste";
		ebp_TextMensL1 = "Exportera datum i standardformat?";
		ebp_TextMensL2 = "Uppgifterna exporteras i formatet YYYY/MM/DD HH:MM";
		ebp_TextMensL3 = 'i data "Klick senast", är timmarna placerade vid 00:00';
		ebp_TextMensL4 = "Exportera data i NeoBux format?";
		ebp_TextMensL5 = "Detta är bara för uppgifter från direkta remisser och hyrda hänvisningar";
		ebp_TextMensL6 = "Grupp och Visa all data på sista sidan?";
		ebp_TextMensL7 = "Knappen Kopiera är aktiverad på alla sidor, och alla data klistras in det sista fönstret, separera grupper med några streck -";
		ebp_LastUpdate = "Senaste uppdateringen";
		ebp_MensLU = "uppdateras inte";
		break;
	case "de": //Aleman
		ebp_DirectText = "Direkte;Gemietete;Sie";
		ebp_isToday = "Heute";
		ebp_isYesterday = "Gestern";
		ebp_isTomorrow = "Morgen";
		ebp_isExpired = "Abgelaufen...";
		ebp_noClick = "Keine Klicks";
		ebp_TotClicsHoy = "Klicks heute:";
		ebp_TotClicsAyer = "Klicks gestern:";
		ebp_TotClics10Dias = "Klicks letzten 10 Tage:";
		ebp_CPTotalHoy = "Gesamt eigenen Klicks:";
		ebp_CPFijosFHoy = "Feste fuchsia Klicks:";
		ebp_CPMicroHoy = "Micro Klicks:";
		ebp_CPMiniHoy = "Mini Klicks:";
		ebp_CPProlongadoHoy = "Erweiterte Klicks:";
		ebp_CPStandarHoy = "Standard-Klicks:";
		ebp_CPFijosNHoy = "Fest Orange Klicks:";
		ebp_ClicsHoyRD = "Klicks heute RD:";
		ebp_ClicsAyerRD = "Klicks gestern RD:";
		ebp_Clics10DiasRD = "Klicks letzten 10 Tage RD:";
		ebp_ClicsHoyRR = "Klicks heute RR:";
		ebp_ClicsAyerRR = "Klicks gestern RR:";
		ebp_Clics10DiasRR = "Klicks letzten 10 Tage RR:";
		ebp_MontReciclaHoy = "Recycling heute:";
		ebp_MontReciclaAyer = "Recycling gestern:";
		ebp_MontRecicla10Dias = "Recycling letzten 10 Tage:";
		ebp_ReciclaGratisHoy = "Automatische Recycling heute:";
		ebp_MontRenuevaHoy = "Erneuerung heute:";
		ebp_MontRenuevaAyer = "Erneuerung gestern:";
		ebp_MontRenueva10Dias = "Erneuerung letzten 10 Tage:";

		ebp_MontRenuevaHoyManual = "Erneuerung heute (Manuell):";
		ebp_MontRenuevaAyerManual = "Erneuerung gestern (Manuell):";
		ebp_MontRenueva10DiasManual = "Erneuerung letzten 10 Tage (Manuell):";
		ebp_MontRenuevaHoyAuto = "Erneuerung heute (AutoRenew):";
		ebp_MontRenuevaAyerAuto = "Erneuerung gestern (AutoRenew):";
		ebp_MontRenueva10DiasAuto = "Erneuerung letzten 10 Tage (AutoRenew):";

		ebp_MontAutoPagoHoy = "AutoPay heute:";
		ebp_MontAutoPagoAyer = "AutoPay gestern:";
		ebp_MontAutoPago10Dias = "AutoPay letzten 10 Tage:";
		ebp_ffRelativa = "Relativ";
		ebp_ffExacta = "Echt";
		ebp_TextConfig = "Einstellungen";
		ebp_TextDatos = "Daten";
		ebp_TextGuarda = "sparen";
		ebp_TextSalir = "schließen";
		ebp_TextCopiar = "Copy";
		ebp_TextPegar = "Paste";
		ebp_TextMensL1 = "Exportieren Sie Daten im Standard-Format?";
		ebp_TextMensL2 = "Die Daten werden im Format YYYY/MM/DD HH:MM exportiert";
		ebp_TextMensL3 = 'Daten in der "letzter Klick" werden die Stunden um 00:00 Uhr platziert';
		ebp_TextMensL4 = "Exportieren von Daten in NeoBux-Format?";
		ebp_TextMensL5 = "Dies ist nur für die Daten der direkte Verweise und Verweise vermietet";
		ebp_TextMensL6 = "Gruppe und alle Daten auf der letzten Seite anzeigen?";
		ebp_TextMensL7 = "Die Copy-Taste wird auf allen Seiten aktiviert und alle Daten werden im letzten Fenster eingefügt, um die Gruppen mit wenigen Strichen zu trennen -";
		ebp_LastUpdate = "Letztes Update";
		ebp_MensLU = "Nicht aktualisiert";
		break;
	case "fr": //Frances
		ebp_DirectText = "Directs;Loués;Vous";
		ebp_isToday = "Aujourd'hui";
		ebp_isYesterday = "Hier";
		ebp_isTomorrow = "Demain";
		ebp_isExpired = "Expiré...";
		ebp_noClick = "Pas de clics";
		ebp_TotClicsHoy = "clics aujourd'hui:";
		ebp_TotClicsAyer = "clics hier:";
		ebp_TotClics10Dias = "clics derniers 10 jours:";
		ebp_CPTotalHoy = "totaux propres clics:";
		ebp_CPFijosFHoy = "Clics fuchsia fixes:";
		ebp_CPMicroHoy = "micro clics:";
		ebp_CPMiniHoy = "Mini clics:";
		ebp_CPProlongadoHoy = "clics étendues:";
		ebp_CPStandarHoy = "clics standard:";
		ebp_CPFijosNHoy = "Clics orange fixe:";
		ebp_ClicsHoyRD = "clics aujourd'hui RD:";
		ebp_ClicsAyerRD = "clics hier RD:";
		ebp_Clics10DiasRD = "clics derniers 10 jours RD:";
		ebp_ClicsHoyRR = "clics aujourd'hui RR:";
		ebp_ClicsAyerRR = "clics hier RR:";
		ebp_Clics10DiasRR = "clics derniers 10 jours RR:";
		ebp_MontReciclaHoy = "recyclage d'aujourd'hui:";
		ebp_MontReciclaAyer = "recyclage hier:";
		ebp_MontRecicla10Dias = "recyclage 10 derniers jours:";
		ebp_ReciclaGratisHoy = "Recyclage Automatique d'aujourd'hui:";
		ebp_MontRenuevaHoy = "renouvellement d'aujourd'hui:";
		ebp_MontRenuevaAyer = "renouvellement d'hier:";
		ebp_MontRenueva10Dias = "dernier renouvellement 10 jours:";

		ebp_MontRenuevaHoyManual = "renouvellement d'aujourd'hui (manuelle):";
		ebp_MontRenuevaAyerManual = "renouvellement d'hier (manuelle):";
		ebp_MontRenueva10DiasManual = "dernier renouvellement 10 jours (manuelle):";
		ebp_MontRenuevaHoyAuto = "renouvellement d'aujourd'hui (AutoRenew):";
		ebp_MontRenuevaAyerAuto = "renouvellement d'hier (AutoRenew):";
		ebp_MontRenueva10DiasAuto = "dernier renouvellement 10 jours (AutoRenew):";

		ebp_MontAutoPagoHoy = "AutoPaiement aujourd'hui:";
		ebp_MontAutoPagoAyer = "AutoPaiement hier";
		ebp_MontAutoPago10Dias = "AutoPaiement 10 derniers jours:";
		ebp_ffRelativa = "Relatives";
		ebp_ffExacta = "Réelles ";
		ebp_TextConfig = "Paramètres";
		ebp_TextDatos = "données";
		ebp_TextGuarda = "sauver";
		ebp_TextSalir = "fermer";
		ebp_TextCopiar = "Copy";
		ebp_TextPegar = "Paste";
		ebp_TextMensL1 = "Exporter des dates dans un format standard?";
		ebp_TextMensL2 = "Les données sont exportées dans le format YYYY/MM/DD HH:MM";
		ebp_TextMensL3 = 'dans les données "Dernier clic", les heures sont placés à 00:00';
		ebp_TextMensL4 = "Exporter des données dans le format NeoBux?";
		ebp_TextMensL5 = "C'est seulement pour les données de références et de renvois directs loués";
		ebp_TextMensL6 = "Gruppe und alle Daten auf der letzten Seite anzeigen?";
		ebp_TextMensL7 = "Die Copy-Taste wird auf allen Seiten aktiviert und alle Daten werden im letzten Fenster eingefügt, um die Gruppen mit wenigen Strichen Trennung -";
		ebp_LastUpdate = "Dernière mise à jour";
		ebp_MensLU = "Pas à jour";
		break;
	default: //por default se deja Inlges
		ebp_DirectText = "Direct;Rented;You";
		ebp_isToday = "Today";
		ebp_isYesterday = "Yesterday";
		ebp_isTomorrow = "Tomorrow";
		ebp_isExpired = "Expired...";
		ebp_noClick = "No clicks yet";
		ebp_TotClicsHoy = "clicks today:";
		ebp_TotClicsAyer = "clicks yesterday:";
		ebp_TotClics10Dias = "clicks last 10 days:";
		ebp_CPTotalHoy = "Total own clicks:";
		ebp_CPFijosFHoy = "Fixed fuchsia clicks:";
		ebp_CPMicroHoy = "Micro clicks:";
		ebp_CPMiniHoy = "Mini clicks:";
		ebp_CPProlongadoHoy = "Extended clicks:";
		ebp_CPStandarHoy = "Standard clicks:";
		ebp_CPFijosNHoy = "Fixed orange clicks:";
		ebp_ClicsHoyRD = "clicks today RD:";
		ebp_ClicsAyerRD = "clicks yesterday RD:";
		ebp_Clics10DiasRD = "clicks last 10 days RD:";
		ebp_ClicsHoyRR = "clicks today RR:";
		ebp_ClicsAyerRR = "clicks yesterday RR:";
		ebp_Clics10DiasRR = "clicks last 10 days RR:";
		ebp_MontReciclaHoy = "recycling today:";
		ebp_MontReciclaAyer = "recycling yesterday:";
		ebp_MontRecicla10Dias = "recycling last 10 days:";
		ebp_ReciclaGratisHoy = "Automatic Recycling today:";
		ebp_MontRenuevaHoy = "renewal today:";
		ebp_MontRenuevaAyer = "renewal yesterday:";
		ebp_MontRenueva10Dias = "renewal last 10 days:";

		ebp_MontRenuevaHoyManual = "renewal today (Manual):";
		ebp_MontRenuevaAyerManual = "renewal yesterday (Manual):";
		ebp_MontRenueva10DiasManual = "renewal last 10 days (Manual):";
		ebp_MontRenuevaHoyAuto = "renewal today (AutoRenew):";
		ebp_MontRenuevaAyerAuto = "renewal yesterday (AutoRenew):";
		ebp_MontRenueva10DiasAuto = "renewal last 10 days (AutoRenew):";

		ebp_MontAutoPagoHoy = "AutoPay today:";
		ebp_MontAutoPagoAyer = "AutoPay yesterday:";
		ebp_MontAutoPago10Dias = "AutoPay last 10 days:";
		ebp_ffRelativa = "Relative";
		ebp_ffExacta = "Real";
		ebp_TextConfig = "Settings";
		ebp_TextDatos = "Data";
		ebp_TextGuarda = "Save";
		ebp_TextSalir = "Close";
		ebp_TextCopiar = "Copy";
		ebp_TextPegar = "Paste";
		ebp_TextMensL1 = "Export Dates in Standard Format?";
		ebp_TextMensL2 = "The data is exported in the format YYYY/MM/DD HH:MM";
		ebp_TextMensL3 = 'in the data "last click", the hours are placed at 00:00';
		ebp_TextMensL4 = "Exporta Data in NeoBux format?";
		ebp_TextMensL5 = "This is only for the data of direct referrals and rented";
		ebp_TextMensL6 = "Group and Show all data on the last page?";
		ebp_TextMensL7 = "The Copy button is enabled on all pages, and all data is pasted in the last window, separating the groups with a few dashes -";
		ebp_LastUpdate = "Last update";
		ebp_MensLU = "Not updated";
		break;
	}
}

//***********************************************************************************
//****funcion para eliminar cualquier codigo html de una cadena de texto		*****
//***********************************************************************************
function stripHTML(cadena) {
	return cadena.replace(/<[^>]+>/g, '');
}
//***********************************************************************************
//****funcion para eliminar los espacios de una cadena de texto					*****
//***********************************************************************************
function ebp_trim(stringToTrim) {
	return stringToTrim.replace(/^\s+|\s+$/g, "");
}

//***********************************************************************************
//**** función para sumar/restar horas y minutos a la fecha actual				*****
//***********************************************************************************
function xDateTime(cnf) {
	//establecemos las variables
	var dte, tme, nDte, dteD, dteM, dteY, tmeH, tmeM, tmeS, msecPerMinute, msecPerHour, msecPerDay, intervaloHrs, intervaloMin, rtn, rtnD, rtnT, rtnNeo;
	//si NO se paso el parámetro cnf, lo establecemos como vacio
	if (!cnf) {
		cnf = {};
	}
	// establecemos los valors en miliisegundos.
	msecPerMinute = 1000 * 60;
	msecPerHour = msecPerMinute * 60;
	msecPerDay = msecPerHour * 24;
	// asignamos los valores a la variable para manejar la fecha, dte = Fecha del día, tme es la hora
	dte = new Date();
	tme = dte.getTime();
	// calculamos los el tiempo en horas y minutos a sumar/restar
	intervaloHrs = 0;
	if (cnf.hours) {
		intervaloHrs = parseInt(cnf.hours * msecPerHour, 10);
	}
	intervaloMin = 0;
	if (cnf.minutes) {
		intervaloMin = parseInt(cnf.minutes * msecPerMinute, 10);
	}
	//seteamos la nueva fecha (nDte) sumando las horas y los minutos pasados como parámetros
	nDte = dte.setTime(parseInt(tme + intervaloHrs + intervaloMin, 10));
	// separamos dia, mes, año y hora, dteD es el DIA, dteM es el MES, dteY es el AÑO, tme es la hora
	dteD = dte.getDate().double();
	dteM = (dte.getMonth() + 1).double();
	dteY = dte.getFullYear();
	// separamos hora, minutos, segundos, tmeH es la hora, tmeM son los minutos, tmeS son los segundos
	tmeH = dte.getHours().double();
	tmeM = dte.getMinutes().double();
	tmeS = dte.getSeconds().double();

	/* creamos ahora las posibles combinaciones de fecha a retornar;
	rtn = Valor a retornar
	rtnD = AÑO / MES / DIA
	rtnT = HORA:MINUTOS
	rtnNeo = AÑOMESDIA (sin la barra separadora /)
	*/
	rtn = '';
	rtnD = dteY + '/' + dteM + '/' + dteD;
	rtnT = tmeH + ':' + tmeM;
	//rtnNeo = dteY + '' + dteM + '' + dteD;
	rtnNeo = dteY.toString() + dteM.toString() + dteD.toString();
	//regresemaos la fecha según los parámetros de cnf
	switch (cnf.type) {
	case 'd':
		rtn = rtnD;
		break;
	case 't':
		rtn = rtnT;
		break;
	case 'dt':
		rtn = rtnD + ' ' + rtnT;
		break;
	case 'td':
		rtn = rtnT + ' ' + rtnD;
		break;
	case 'n':
		rtn = rtnNeo;
		break;
	default:
		rtn = rtnD + ' ' + rtnT;
	}
	return rtn;
}

//***********************************************************************************
//**** función Check if a cookie exists and, if not, ask for data				*****
//**** Get cookie value (la copie de NeoBuxOX)									*****
//**** Return data entered														*****
//***********************************************************************************
function checkCookie() {
    // establecemos las variasbles
	var data, DataActual, fechaHoy;
    // leemos la cookie
	data = getCookie("ebp_NeoExport");
	//revisamos si existe la cookie, sino creamos una nueva cookie
    if (data != null && data != "") {
		DataActual = data.split("-");
		//Check for malformed cookie
		if (DataActual.length > 1) {
			return data;
        }
    }
    //la cookie no está o está mala, eliminamos la que este y creamos una nueva
    fechaHoy = new Date();
    document.cookie = "ebp_NeoExport=0-0-0;expires=" + fechaHoy.toGMTString() + ";" + ";";
    //Create a new one
	setCookie("ebp_NeoExport", "0-0-0", 365);
	return "0-0-0";
}

//***********************************************************************************
//****esta función retorna un array con los valores de la gráfica				*****
//****este código lo tome del nebuxox de proxen									*****
//***********************************************************************************
function obtainChartValues(arg, nidchart) {
	// declaramos las variables
	var valorDecodificado, chartId, valorTemp, valorArray;
	
    valorDecodificado = window.atob(arg);
	chartId = valorDecodificado.split("'")[1];
    valorTemp = "";
    valorArray = new Array();
    valorArray[0] = chartId;
	//ch_extensions; ch_extensions_all; ch_extensions_man; ch_extensions_aut
    if (chartId === "ch_cr" || chartId === "ch_recycle" || chartId === "ch_extensions_all" || chartId === "ch_autopay" || chartId === "ch_cliques" || chartId === "ch_cdd" || chartId === "ch_trar" || chartId === "ch_cliques") {
        valorTemp = valorDecodificado.split("data:[")[nidchart];
        valorTemp = valorTemp.substring(0, valorTemp.indexOf(']')).split(',');
    }
    return valorArray.concat(valorTemp);
}

//***********************************************************************************
//**** esta función es para pasar los campos de fecha a un formato standard		*****
//**** de la forma yyyy/mm/dd hh:mm												*****
//**** los parámetros son:														*****
//**** dFechaOrg: fecha a validar												*****
//**** neoebp_today: fecha del día para comparar								*****
//**** dTipo: indica fecha referidos desde (1), expira en (2) o ultimo clic (3)	*****
//**** nTipoFecha: 0 indica que es fecha exacta, 1 que es relativa				*****
//**** nTipoExporta: 0 indica que es normal, 1 exportar datos al estilo neobux	*****
//***********************************************************************************
function obtieneFechaStandard(dFechaOrg, neoebp_today, dTipo, nTipFecha, nTipoExporta) {
	//creamos las variables a usar en la funcion, NeoEBP_Fecha es el valor a retornar
	var fechaNueva, fechaHoy, dFechaTempo, stringHora, horaFechaValidar, minuntosFechaValidar, stringFecha, DiasFechaValidar, NeoEBP_Fecha;
	//*****************************************************************************************************
	//ahora, verificamos si el campo dFechaOrg contiene la palabra sin clics aún, si es así
	//simplemente regresamos el mismo valor ya que no sería necesario hacer mas nada
	//*****************************************************************************************************
	if (dFechaOrg.indexOf(ebp_noClick) !== -1) {
		//si se exportan los datos al estilo neobux y no se han echo clics, se regresa el valor de 20990101
		if (dTipo === 3 && nTipoExporta === 1) {
			return "20990101";
		} else {
			return "0";
		}
	}
	
	//*****************************************************************************************************
	//Eliminamos el caracter - de la la fecha (en caso de que lo tenga)
	//si la variable contien datos entre parentesis, estos datos son colocados por algún script, 
	//procedemos a eliminarlos para dejar solamente los datos originales
	//*****************************************************************************************************
	dFechaOrg = dFechaOrg.replace('-', '');
	if (dFechaOrg.indexOf('(') !== -1) {
		dFechaOrg = dFechaOrg.substring(0, dFechaOrg.indexOf('('));
	}
	
	//*****************************************************************************************************
	//verificamos la fecha, y normalizamos lo siguiente
	//Hoy, lo cambiamos por la fecha de hoy
	//Ayer, lo cambiamos por la fecha de hoy - 1
	//Mañana, lo cambiamos por la fecha de hoy + 1 
	//Expirado, lo cambiamos por la fecha de hoy + la hora actual
	//*****************************************************************************************************
	//obtenemos la fecha actual, con formato YYYY/MM/DD
	fechaHoy = xDateTime({ type: 'd'});
	if (dFechaOrg.indexOf(ebp_isToday) !== -1) {
		//reemplazamos el texto hoy; si la fecha es relativa, colocamos 0, sino, colocamos la fecha
		if (nTipFecha === 1) {
			dFechaOrg = dFechaOrg.replace(ebp_isToday, 0);
		} else {
			dFechaOrg = dFechaOrg.replace(ebp_isToday, fechaHoy);
		}
	} else if (dFechaOrg.indexOf(ebp_isYesterday) !== -1) {
		// reemplazamos el texto ayer; si la fecha es relativa, colocamos 1, sino, colocamos la fecha - 1
		// Obtenemos la fecha actual - 1 dia (dFechaTempo)
		dFechaTempo = xDateTime({ type: 'd', hours: -24});
		if (nTipFecha === 1) {
			dFechaOrg = dFechaOrg.replace(ebp_isYesterday, 1);
		} else {
			dFechaOrg = dFechaOrg.replace(ebp_isYesterday, dFechaTempo);
		}
	} else if (dFechaOrg.indexOf(ebp_isTomorrow) !== -1) {
		// reemplazamos el texto Mañana; si la fecha es relativa, colocamos 1, sino, colocamos la fecha + 1
		// Obtenemos la fecha actual + 1 dia (dFechaTempo)
		dFechaTempo = xDateTime({ type: 'd', hours: 24});
		if (nTipFecha === 1) {
			dFechaOrg = dFechaOrg.replace(ebp_isTomorrow, 1);
		} else {
			dFechaOrg = dFechaOrg.replace(ebp_isTomorrow, dFechaTempo);
		}
	} else if (dFechaOrg.indexOf(ebp_isExpired) !== -1) {
		//reemplazamos el texto Expirado; si la fecha es relativa, colocamos 0, sino, colocamos la fecha de hoy
		if (nTipFecha === 1) {
			dFechaOrg = dFechaOrg.replace(ebp_isExpired, 0);
		} else {
			dFechaOrg = dFechaOrg.replace(ebp_isExpired, fechaHoy);
		}
	}
	//*****************************************************************************************************
	//si la fecha es relativa, obtenemos los dias, horas y minutos a agregar o restar a la fecha
	//*****************************************************************************************************
	if (nTipFecha === 1) {
		if (dFechaOrg.indexOf(":") !== -1) {
			stringHora = dFechaOrg.split(":");
			horaFechaValidar = parseInt(stringHora[0].substring(stringHora[0].length - 2), 10);
			minuntosFechaValidar = parseInt(stringHora[1].replace("&nbsp;", ""), 10);
		} else {
			horaFechaValidar = 0;
			minuntosFechaValidar = 0;
		}
		stringFecha = dFechaOrg.split(" ");
		DiasFechaValidar = stringFecha[0];
		//convertimos los días a horas
		DiasFechaValidar = parseInt(DiasFechaValidar * 24, 10);
		horaFechaValidar = (horaFechaValidar + DiasFechaValidar);
		//si dTipo es (1) referidos desde o (3) ultimo clic; le restamos a la fecha actual
		//la fecha dFechaOrg; si es (2) expira en, se la sumamos
		if (dTipo !== 2) {
			horaFechaValidar = horaFechaValidar * -1;
			minuntosFechaValidar = minuntosFechaValidar * -1;
			//si dTipo es (3) ultimo clic regresamos la fecha sin horas, sino, con horas
			if (dTipo === 3) {
				//si nTipoExporta = 0 regresamos la fecha normal sino al estilo neobux
				if (nTipoExporta === 0) {
					NeoEBP_Fecha = xDateTime({ type: 'd', hours: horaFechaValidar, minutes: minuntosFechaValidar });
				} else {
					NeoEBP_Fecha = xDateTime({ type: 'n', hours: horaFechaValidar, minutes: minuntosFechaValidar });
				}
			} else {
				//si nTipoExporta = 0 regresamos la fecha normal sino al estilo neobux
				if (nTipoExporta === 0) {
					NeoEBP_Fecha = xDateTime({ type: 'dt', hours: horaFechaValidar, minutes: minuntosFechaValidar });
				} else {
					NeoEBP_Fecha = xDateTime({ type: 'n', hours: horaFechaValidar, minutes: minuntosFechaValidar });
				}
			}
		} else {
			//si nTipoExporta = 0 regresamos la fecha normal sino al estilo neobux
			if (nTipoExporta === 0) {
				NeoEBP_Fecha = xDateTime({ type: 'dt', hours: horaFechaValidar, minutes: minuntosFechaValidar });
			} else {
				NeoEBP_Fecha = xDateTime({ type: 'n', hours: horaFechaValidar, minutes: minuntosFechaValidar });
			}
		}
		return NeoEBP_Fecha;
	} else {
		//al ser una fecha exacta, regresamos la fecha tal cual, le quitamos la palabra a las
		stringFecha = dFechaOrg.split(" ");
		NeoEBP_Fecha = stringFecha[0];
		//si nTipoExporta = 0 regresamos la fecha normal sino al estilo neobux
		if (nTipoExporta === 0) {
			//si tiene hora, la agregamos a NeoEBP_Fecha
			if (dFechaOrg.indexOf(":") !== -1) {
				stringHora = dFechaOrg.split(":");
				horaFechaValidar = parseInt(stringHora[0].substring(stringHora[0].length - 2), 10);
				minuntosFechaValidar = parseInt(stringHora[1].replace("&nbsp;", ""), 10);
				NeoEBP_Fecha = NeoEBP_Fecha + ' ' + horaFechaValidar.double() + ':' + minuntosFechaValidar.double();
			}
		} else {
			NeoEBP_Fecha = NeoEBP_Fecha.replace(/\//g, '');
		}
		return NeoEBP_Fecha;
	}
}

//***********************************************************************************
//**** FIN DE FUNCIONES AUXILIARES											*****
//***********************************************************************************

//***********************************************************************************
//**** INICIO DE FUNCIONES DE PROCEDIMIENTOS									*****
//***********************************************************************************
//***********************************************************************************
//**** EXPORTAR DATOS DE USUARIO**** TOMADO DEL SCRIPT DE CoAzNeoExporter		*****
//**** Resumen de Cuenta, leemos la información actual							*****
//***********************************************************************************
function EBP_Copia_Resumen() {
	// Declaramos las variables a usar en la funcion
	var i, n, mitexto, EBP_Matrix_Item, datosMatrix, puntoCorte, totalNodos, totalAdPrizes, EBP_scharts, valorXPathResult, chartValores, EBPtotalClicks;
	
	// obtenemos la información general de la cuenta, obtenemos la matrix con la información línea x linea 
	// del cuadro con los datos del resumen de cuenta
	mitexto = "";
	EBP_Matrix_Item = document.getElementById("c_dir").getElementsByClassName("mbx")[0].childNodes[1].rows;
	//recorremos cada línea
	for (i = 0; i <= EBP_Matrix_Item.length - 1; i += 1) {
		datosMatrix = EBP_Matrix_Item[i].textContent;
		//eliminar espacios en blanco
		if (datosMatrix.indexOf(":") !== -1) {
			//eliminar sobrantes de mk_tt que vienen de botones
			if (datosMatrix.indexOf("mk_tt") !== -1) {
				puntoCorte = datosMatrix.indexOf("mk_tt") - 1;
				datosMatrix = datosMatrix.substring(0, puntoCorte);
			}
			//eliminar "=" innecesarios
			if (datosMatrix.indexOf("=") !== -1) {
				datosMatrix = datosMatrix.substring(0, datosMatrix.indexOf("="));
			}
			//eliminar doble espacios "  " innecesarios
			datosMatrix = datosMatrix.replace(/\s+/gi, ' ');
			//eliminar el simbolo de $
			datosMatrix = datosMatrix.replace("$", "");
			
			//eliminar espacios blancos al principio y fin del string
			datosMatrix = datosMatrix.trim();
			mitexto = mitexto + datosMatrix + String.fromCharCode(13, 10);
		}
	}
   
   //Obtenemos información sobre si hay Adprize Ganados el día de hoy, es el antepenultimo nodo
	totalNodos = document.getElementById("c_dir").getElementsByClassName("mbx").length;
	EBP_Matrix_Item = document.getElementById("c_dir").getElementsByClassName("mbx")[totalNodos - 2].childNodes[1].rows;
	// obtenemos los Adprize ganados en el día
	totalAdPrizes = 0;
	for (i = 0; i < (EBP_Matrix_Item.length - 1); i += 1) {
		datosMatrix = EBP_Matrix_Item[i].textContent;
		//eliminar espacios en blanco; eliminar sobrantes de mk_tt que vienen de botones
		if (datosMatrix.indexOf("mk_tt") !== -1) {
			puntoCorte = datosMatrix.indexOf("mk_tt") - 1;
			datosMatrix = datosMatrix.substring(0, puntoCorte);
		}
		//eliminar "=" innecesarios
		if (datosMatrix.indexOf("=") !== -1) {
			datosMatrix = datosMatrix.substring(0, datosMatrix.indexOf("="));
		}
		//eliminar espacios blancos al principio y fin del string
		datosMatrix = datosMatrix.trim();

		//si conseguimos el texto AdPrize y el texto hoy, sumamos para el total de AdPrizes del día
		//campos antes del total de referidos directos que no es necesario obtenerlos
		if (datosMatrix.indexOf('AdPrize') !== -1) {
			if (datosMatrix.indexOf(ebp_isToday) !== -1) {
				totalAdPrizes = Number(totalAdPrizes) + 1;
			}
		}
	}
	
	mitexto = mitexto + "AdPrize" + ":" + totalAdPrizes + String.fromCharCode(13, 10);
	
	// Obtenemos la data de la gráfica de clics diarios
	// este código lo tome del nebuxox de proxen
	valorXPathResult = document.evaluate("//script[contains(.,'eval(w(')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    EBP_scharts = valorXPathResult.singleNodeValue.textContent.split(" ");
    for (i = 0; i < EBP_scharts.length - 1; i += 1) {
        chartValores = obtainChartValues(EBP_scharts[i].split("'")[1], 1);
        switch (chartValores[0]) {
		case "ch_cliques": //Clics Diarios Fijos + Extendidos
			chartValores = chartValores.reverse();
			EBPtotalClicks = chartValores[0];
			mitexto = mitexto + ebp_TotClicsHoy +  Number(EBPtotalClicks) + "\n";
			
			EBPtotalClicks = chartValores[1];
			mitexto = mitexto + ebp_TotClicsAyer +  Number(EBPtotalClicks) + "\n";
			EBPtotalClicks = 0;
			for (n = 0; n < chartValores.length - 1; n += 1) {
				EBPtotalClicks = Number(EBPtotalClicks) + Number(chartValores[n]);
			}
			mitexto = mitexto + ebp_TotClics10Dias + EBPtotalClicks + "\n";
			break;
		default:
			break;
        }
    }
	
	//mostramos los datos
	mostrarVentana(mitexto, "EBPPAGERES");
}

//***********************************************************************************
//**** para las página de estadísticas de la Cuenta								*****
//***********************************************************************************
function EBP_Copia_Estadisticas() {
	// declaramos las variables
	var i, n, mitexto, EBPtotalClicks, EBP_scharts, chartValores, valorXPathResult, valorOriginal;
	
	mitexto = "";
	EBPtotalClicks = 0;
	//Obtenemos la data de las gráficas para obtener el valor del día actual
	//este código lo tome del nebuxox de proxen
    valorXPathResult = document.evaluate("//script[contains(.,'eval(w(')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
	EBP_scharts = valorXPathResult.singleNodeValue.textContent.split(" ");
	for (i = 0; i < EBP_scharts.length - 1; i += 1) {
		chartValores = obtainChartValues(EBP_scharts[i].split("'")[1], 1);
		switch (chartValores[0]) {
		case "ch_cliques": //gráfica de clics propios
			EBPtotalClicks = 0;
			chartValores = chartValores.reverse();
			EBPtotalClicks = chartValores[1];
			mitexto = mitexto + ebp_CPTotalHoy +  Number(EBPtotalClicks) + "\n";
			
			chartValores = obtainChartValues(EBP_scharts[i].split("'")[1], 2);
			chartValores = chartValores.reverse();
			EBPtotalClicks = chartValores[1];
			mitexto = mitexto + ebp_CPFijosFHoy +  Number(EBPtotalClicks) + "\n";

			chartValores = obtainChartValues(EBP_scharts[i].split("'")[1], 3);
			chartValores = chartValores.reverse();
			EBPtotalClicks = chartValores[1];
			mitexto = mitexto + ebp_CPMicroHoy +  Number(EBPtotalClicks) + "\n";

			chartValores = obtainChartValues(EBP_scharts[i].split("'")[1], 4);
			chartValores = chartValores.reverse();
			EBPtotalClicks = chartValores[1];
			mitexto = mitexto + ebp_CPMiniHoy +  Number(EBPtotalClicks) + "\n";

			chartValores = obtainChartValues(EBP_scharts[i].split("'")[1], 5);
			chartValores = chartValores.reverse();
			EBPtotalClicks = chartValores[1];
			mitexto = mitexto + ebp_CPProlongadoHoy +  Number(EBPtotalClicks) + "\n";

			chartValores = obtainChartValues(EBP_scharts[i].split("'")[1], 6);
			chartValores = chartValores.reverse();
			EBPtotalClicks = chartValores[1];
			mitexto = mitexto + ebp_CPStandarHoy +  Number(EBPtotalClicks) + "\n";

			chartValores = obtainChartValues(EBP_scharts[i].split("'")[1], 7);
			chartValores = chartValores.reverse();
			EBPtotalClicks = chartValores[1];
			mitexto = mitexto + ebp_CPFijosNHoy +  Number(EBPtotalClicks) + "\n";
			break;
		case "ch_cdd": //gráfica de referidos directos
			chartValores = chartValores.reverse();
			EBPtotalClicks = chartValores[0];
			mitexto = mitexto + ebp_ClicsHoyRD +  Number(EBPtotalClicks) + "\n";

			EBPtotalClicks = chartValores[1];
			mitexto = mitexto + ebp_ClicsAyerRD +  Number(EBPtotalClicks) + "\n";
			EBPtotalClicks = 0;
			for (n = 0; n < chartValores.length - 1; n += 1) {
				EBPtotalClicks = Number(EBPtotalClicks) + Number(chartValores[n]);
			}
			mitexto = mitexto + ebp_Clics10DiasRD + EBPtotalClicks + "\n";

			break;
		case "ch_cr": //Gráfica de referidos rentados
			chartValores = chartValores.reverse();
			EBPtotalClicks = chartValores[0];
			mitexto = mitexto + ebp_ClicsHoyRR + Number(EBPtotalClicks) + "\n";

			EBPtotalClicks = chartValores[1];
			mitexto = mitexto + ebp_ClicsAyerRR + Number(EBPtotalClicks) + "\n";

			EBPtotalClicks = 0;
			for (n = 0; n < chartValores.length - 1; n += 1) {
				EBPtotalClicks = Number(EBPtotalClicks) + Number(chartValores[n]);
			}
			mitexto = mitexto + ebp_Clics10DiasRR + EBPtotalClicks + "\n";
			break;
		case "ch_recycle": //Gráfica Costo de Reciclaje
			chartValores = chartValores.reverse();
			EBPtotalClicks = chartValores[0];
			mitexto = mitexto + ebp_MontReciclaHoy +  Number(EBPtotalClicks) + "\n";

			EBPtotalClicks = chartValores[1];
			mitexto = mitexto + ebp_MontReciclaAyer +  Number(EBPtotalClicks) + "\n";
			EBPtotalClicks = 0;
			for (n = 0; n < 10; n += 1) {
				EBPtotalClicks = Number(EBPtotalClicks) + Number(chartValores[n]);
			}
			valorOriginal = parseFloat(EBPtotalClicks);
			EBPtotalClicks = Math.round(valorOriginal * 1000) / 1000;
			mitexto = mitexto + ebp_MontRecicla10Dias + EBPtotalClicks + "\n";
			break;
		case "ch_trar": //Gráfica Reciclajes Automáticos
			chartValores = chartValores.reverse();
			EBPtotalClicks = chartValores[0];
			mitexto = mitexto + ebp_ReciclaGratisHoy +  Number(EBPtotalClicks) + "\n";
			break;
		//ch_extensions; ch_extensions_all; ch_extensions_man; ch_extensions_aut
		case "ch_extensions_all": //Gráfica de renovaciones
			chartValores = chartValores.reverse();
			EBPtotalClicks = chartValores[1];
			mitexto = mitexto + ebp_MontRenuevaHoy +  Number(EBPtotalClicks) + "\n";

			EBPtotalClicks = chartValores[2];
			mitexto = mitexto + ebp_MontRenuevaAyer +  Number(EBPtotalClicks) + "\n";
			EBPtotalClicks = 0;
			for (n = 1; n < 11; n += 1) {
				EBPtotalClicks = Number(EBPtotalClicks) + Number(chartValores[n]);
			}
			valorOriginal = parseFloat(EBPtotalClicks);
			EBPtotalClicks = Math.round(valorOriginal * 1000) / 1000;
			mitexto = mitexto + ebp_MontRenueva10Dias + EBPtotalClicks + "\n";

			EBPtotalClicks = 0;
			chartValores = obtainChartValues(EBP_scharts[i].split("'")[1], 2);
			chartValores = chartValores.reverse();

			EBPtotalClicks = chartValores[1];
			mitexto = mitexto + ebp_MontRenuevaHoyManual +  Number(EBPtotalClicks) + "\n";
			EBPtotalClicks = chartValores[2];
			mitexto = mitexto + ebp_MontRenuevaAyerManual +  Number(EBPtotalClicks) + "\n";
			for (n = 1; n < 11; n += 1) {
				EBPtotalClicks = Number(EBPtotalClicks) + Number(chartValores[n]);
			}
			valorOriginal = parseFloat(EBPtotalClicks);
			EBPtotalClicks = Math.round(valorOriginal * 1000) / 1000;
			mitexto = mitexto + ebp_MontRenueva10DiasManual + EBPtotalClicks + "\n";

			chartValores = obtainChartValues(EBP_scharts[i].split("'")[1], 3);
			chartValores = chartValores.reverse();
			EBPtotalClicks = chartValores[1];
			mitexto = mitexto + ebp_MontRenuevaHoyAuto +  Number(EBPtotalClicks) + "\n";
			EBPtotalClicks = chartValores[2];
			mitexto = mitexto + ebp_MontRenuevaAyerAuto +  Number(EBPtotalClicks) + "\n";
			EBPtotalClicks = 0;
			for (n = 1; n < 11; n += 1) {
				EBPtotalClicks = Number(EBPtotalClicks) + Number(chartValores[n]);
			}
			valorOriginal = parseFloat(EBPtotalClicks);
			EBPtotalClicks = Math.round(valorOriginal * 1000) / 1000;
			mitexto = mitexto + ebp_MontRenueva10DiasAuto + EBPtotalClicks + "\n";
			break;
		case "ch_autopay": //Gráfica de Autopago
			chartValores = chartValores.reverse();
			EBPtotalClicks = chartValores[0];
			mitexto = mitexto + ebp_MontAutoPagoHoy +  Number(EBPtotalClicks) + "\n";

			EBPtotalClicks = chartValores[1];
			mitexto = mitexto + ebp_MontAutoPagoAyer +  Number(EBPtotalClicks) + "\n";

			EBPtotalClicks = 0;
			for (n = 0; n < 10; n += 1) {
				EBPtotalClicks = Number(EBPtotalClicks) + Number(chartValores[n]);
			}
			valorOriginal = parseFloat(EBPtotalClicks);
			EBPtotalClicks = Math.round(valorOriginal * 1000) / 1000;
			mitexto = mitexto + ebp_MontAutoPago10Dias + EBPtotalClicks + "\n";
			break;
		default:
			break;
		}
    }
	
	//mostramos los datos
	mostrarVentana(mitexto, "EBPPAGEEST");
}

//***********************************************************************************
//**** para la página de los referidos directos									*****
//***********************************************************************************
function EBP_Copia_RD() {
	// establecemos las variables a usar en la funcion
	var i, sOpcCheckBox, valorXPathResult, EBP_TablaRD, tipoFecha, subTipoFecha, refDesdeTipo, ultClickTipo, mitexto, largoTexto, textoTemporal, fechaHoy, numeroRD, nombreRD, origenRD, fechaDesdeRD, fechaUltClick, puntoCorte, ClicsRD, valorMediaRD;
	
	//verificamos en la cookie cual es el tipo de formato para exportar los datos
	sOpcCheckBox = checkCookie();
	sOpcCheckBox = sOpcCheckBox.split("-");
	nFormaFecha = sOpcCheckBox[0];
	if (sOpcCheckBox[1] == 1) {
		nFormaFecha = 2;
	}
	
    //Obtenemos la tabla de referidos directos
	EBP_TablaRD = document.getElementById('tblprp').getElementsByTagName('table')[2].childNodes[0];
	//Obtenemos el formato para los campos de fecha, Relativas o Exactas; referidos desde (2), ultimo clic (3)
	valorXPathResult = document.evaluate("//div[@class='f_r']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	tipoFecha = stripHTML(valorXPathResult.snapshotItem(0).innerHTML);
	tipoFecha = tipoFecha.split("·");
	//variables para el formato del tipo de fecha; 0 = exactas, 1=relativas
	refDesdeTipo = 0;
	ultClickTipo = 0;
	//vemos el tipo de fecha para referido desde y ultimo clic
	subTipoFecha = tipoFecha[0].split(":");
	if (ebp_trim(subTipoFecha[2]) == ebp_ffRelativa) {
		refDesdeTipo = 1;
	}
	subTipoFecha = tipoFecha[1].split(":");
	if (ebp_trim(subTipoFecha[1]) == ebp_ffRelativa) {
		ultClickTipo = 1;
	}
	
	mitexto = "";
	largoTexto = 10;
	textoTemporal = "";
	fechaHoy = new Date();
	
	//Recorremos toda la tabla
    //Iniciamos el la tercera fila (la primera es el encabezado y la segunda es una línea azul)
	//luego leemos cada dos lineas
    for (i = 2; i < EBP_TablaRD.rows.length - 3; i = i + 2) {
		//Obtenemos el número del referido
		numeroRD = EBP_TablaRD.rows[i].cells[0].innerHTML.replace(/&nbsp;/gi, "");
		//Obtenemos el nombre del referido
		nombreRD = stripHTML(EBP_TablaRD.rows[i].cells[1].innerHTML);
		nombreRD = nombreRD.replace(/&nbsp;/gi, "");
		//Obtenemos el sitio de donde vino el referido
		origenRD = EBP_TablaRD.rows[i].cells[2].innerHTML.replace(/&nbsp;/gi, "");
		//Obtenemos la fecha desde que es referido
		fechaDesdeRD = EBP_TablaRD.rows[i].cells[3].innerHTML.replace(/&nbsp;/gi, "");
		fechaDesdeRD = stripHTML(fechaDesdeRD);
		//Obtenemos la fecha del último clic
		fechaUltClick = EBP_TablaRD.rows[i].cells[4].innerHTML.replace(/&nbsp;/gi, "");
		fechaUltClick = stripHTML(fechaUltClick);
		//Obtenemos el total de clics
		ClicsRD = EBP_TablaRD.rows[i].cells[5].innerHTML.replace(/&nbsp;/gi, "");
		//Obtenemos el valor de la media
		valorMediaRD = EBP_TablaRD.rows[i].cells[6].innerHTML.replace(/&nbsp;/gi, "");
		valorMediaRD = stripHTML(valorMediaRD);
		
		//normalizamos la fecha Referidos Desde
		if (nFormaFecha === 1) {
			fechaDesdeRD = obtieneFechaStandard(fechaDesdeRD, fechaHoy, 1, refDesdeTipo, 0);
		} else {
			if (nFormaFecha === 2) {
				fechaDesdeRD = obtieneFechaStandard(fechaDesdeRD, fechaHoy, 1, refDesdeTipo, 1);
			} else {
				//virificamos si la variable contien datos entre parentesis,
				//estos datos son colocados por algún script, procedemos a eliminarlos para dejar solamente
				//los datos originales
				if (fechaDesdeRD.indexOf('(') !== -1) {
					puntoCorte = fechaDesdeRD.indexOf('(');
					fechaDesdeRD = fechaDesdeRD.substring(0, puntoCorte);
				}
			}
		}
		
		//normalizamos la fecha de Ultimo Click
		if (nFormaFecha === 1) {
			fechaUltClick = obtieneFechaStandard(fechaUltClick, fechaHoy, 3, ultClickTipo, 0);
		} else {
			if (nFormaFecha === 2) {
				fechaUltClick = obtieneFechaStandard(fechaUltClick, fechaHoy, 3, ultClickTipo, 1);
			} else {
				//verificamos si la variable contien datos entre parentesis o corchetes,
				//estos datos son colocados por algún script, procedemos a eliminarlos para dejar solamente
				//los datos originales
				if (fechaUltClick.indexOf('(') !== -1 || fechaUltClick.indexOf('[') !== -1) {
					puntoCorte = fechaUltClick.indexOf('(');
                    if (puntoCorte === -1) {
						puntoCorte = fechaUltClick.indexOf('[');
                    }
					fechaUltClick = fechaUltClick.substring(0, puntoCorte);
				}
			}
		}
		
        //verificamos si el valor de la Media contiene datos entre parentesis o corchetes,
        //estos datos son colocados por algún script, procedemos a eliminarlos para dejar solamente
        //los datos originales
        if (valorMediaRD.indexOf("(") !== -1 || valorMediaRD.indexOf("|") !== -1) {
            puntoCorte = valorMediaRD.indexOf("(");
            if (puntoCorte === -1) {
                puntoCorte = valorMediaRD.indexOf("|");
            }
			valorMediaRD = valorMediaRD.substring(0, puntoCorte);
		}
		//Verificamos si es un numero el valor de la media, sino regresamo el valor 0.000
		if (isNaN(valorMediaRD)) {
			valorMediaRD = "0.000";
		}
		
		//creamos el string de salida final
		if (nFormaFecha === 2) {
			textoTemporal = nombreRD.trim() + "," + fechaDesdeRD.trim() + "," + fechaUltClick.trim() + "," + ClicsRD.trim() + "\n";
		} else {
			textoTemporal = numeroRD.trim() + ";" + nombreRD.trim() + ";" + origenRD.trim() + ";" + fechaDesdeRD.trim() + ";" + fechaUltClick.trim() + ";" + ClicsRD.trim() + ";" + valorMediaRD.trim() + "\n";
		}
		
		if (textoTemporal.length > largoTexto) {
			largoTexto = textoTemporal.length;
		}
		mitexto = mitexto + textoTemporal;
	}
	
	//mostramos los datos
	mostrarVentana(mitexto.substring(0, mitexto.length - 1), "EBPPAGERD");
}

//***********************************************************************************
//**** para la página de los referidos rentados									*****
//***********************************************************************************
function EBP_Copia_RR() {
	// establecemos las variables a usar en la funcion
	var i, sOpcCheckBox, valorXPathResult, EBP_TablaRR, tipoFecha, subTipoFecha, refDesdeTipo, refExpiraEnTipo, ultClickTipo, mitexto, largoTexto, textoTemporal, fechaHoy, numeroRR, nombreRR, origenRR, fechaDesdeRR, fechaExpiraEn, fechaUltClick, puntoCorte, ClicsRR, valorMediaRR;
	
	//verificamos en la cookie cual es el tipo de formato para exportar los datos
	sOpcCheckBox = checkCookie();
	sOpcCheckBox = sOpcCheckBox.split("-");
	nFormaFecha = sOpcCheckBox[0];
	if (sOpcCheckBox[1] == 1) {
		nFormaFecha = 2;
	}
	
	 //Obtenemos la tabla de referidos rentados
	EBP_TablaRR = document.getElementById('tblprp').getElementsByTagName('table')[2].childNodes[0];
	
	//Obtenemos el formato para los campos de fecha, Relativas o Exactas; referidos desde (2), ultimo clic (3)
	valorXPathResult = document.evaluate("//div[@class='f_r']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	tipoFecha = stripHTML(valorXPathResult.snapshotItem(0).innerHTML);
	tipoFecha = tipoFecha.split("·");
	//variables para el formato del tipo de fecha; 0 = exactas, 1=relativas
	refDesdeTipo = 0;
	ultClickTipo = 0;
	refExpiraEnTipo = 0;
	//vemos el tipo de fecha para referido desde y ultimo clic
	subTipoFecha = tipoFecha[0].split(":");
	if (ebp_trim(subTipoFecha[2]) == ebp_ffRelativa) {
		refDesdeTipo = 1;
	}
	subTipoFecha = tipoFecha[1].split(":");
	if (ebp_trim(subTipoFecha[1]) == ebp_ffRelativa) {
		refExpiraEnTipo = 1;
	}
	subTipoFecha = tipoFecha[2].split(":");
	if (ebp_trim(subTipoFecha[1]) == ebp_ffRelativa) {
		ultClickTipo = 1;
	}
	
	mitexto = "";
	largoTexto = 10;
	textoTemporal = "";
	fechaHoy = new Date();
	
	//Recorremos toda la tabla; Iniciamos el la tercera fila (la primera es el encabezado y la segunda es una línea azul)
	//luego leemos de dos en dos ya que hay una linea vacia entre referidos
    for (i = 2; i < EBP_TablaRR.rows.length - 2; i = i + 2) {
		//Obtenemos el número del referido
		numeroRR = EBP_TablaRR.rows[i].cells[0].innerHTML.replace(/&nbsp;/gi, "");
		//Obtenemos el nombre del referido
		nombreRR = stripHTML(EBP_TablaRR.rows[i].cells[2].innerHTML);
		nombreRR = nombreRR.replace(/&nbsp;/gi, "");
		//Obtenemos la fecha desde que es referido
		fechaDesdeRR = EBP_TablaRR.rows[i].cells[3].innerHTML.replace(/&nbsp;/gi, "");
		fechaDesdeRR = stripHTML(fechaDesdeRR);
		//Obtenemos la fecha de expiración
		fechaExpiraEn = EBP_TablaRR.rows[i].cells[4].innerHTML.replace(/&nbsp;/gi, "");
		fechaExpiraEn = stripHTML(fechaExpiraEn);
		//Obtenemos la fecha del último clic
		fechaUltClick = EBP_TablaRR.rows[i].cells[5].innerHTML.replace(/&nbsp;/gi, "");
		fechaUltClick = stripHTML(fechaUltClick);
		//Obtenemos el total de clics
		ClicsRR = EBP_TablaRR.rows[i].cells[6].innerHTML.replace(/&nbsp;/gi, "");
		//Obtenemos el valor de la media
		valorMediaRR = EBP_TablaRR.rows[i].cells[7].innerHTML.replace(/&nbsp;/gi, "");
		valorMediaRR = stripHTML(valorMediaRR);
		
		// Normalizamos la fecha referidos desde
		if (nFormaFecha === 1) {
			fechaDesdeRR = obtieneFechaStandard(fechaDesdeRR, fechaHoy, 1, refDesdeTipo, 0);
		} else {
			if (nFormaFecha === 2) {
				fechaDesdeRR = obtieneFechaStandard(fechaDesdeRR, fechaHoy, 1, refDesdeTipo, 1);
			} else {
				//virificamos si la variable contien datos entre parentesis,
				//estos datos son colocados por algún script, procedemos a eliminarlos para dejar solamente
				//los datos originales
				if (fechaDesdeRR.indexOf('(') !== -1) {
					puntoCorte = fechaDesdeRR.indexOf('(');
					fechaDesdeRR = fechaDesdeRR.substring(0, puntoCorte);
				}
			}
		}
		
		//Normalizamos la fecha Expira en
		if (nFormaFecha === 1) {
			fechaExpiraEn = obtieneFechaStandard(fechaExpiraEn, fechaHoy, 2, refExpiraEnTipo, 0);
		} else {
			//virificamos si la variable contien datos entre parentesis,
			//estos datos son colocados por algún script, procedemos a eliminarlos para dejar solamente
			//los datos originales
			if (fechaExpiraEn.indexOf('(') !== -1) {
				puntoCorte = fechaExpiraEn.indexOf('(');
				fechaExpiraEn = fechaExpiraEn.substring(0, puntoCorte);
			}
		}
		
		//Normalizamos la fecha del último click
		if (nFormaFecha === 1) {
			fechaUltClick = obtieneFechaStandard(fechaUltClick, fechaHoy, 3, ultClickTipo, 0);
		} else {
			if (nFormaFecha === 2) {
				fechaUltClick = obtieneFechaStandard(fechaUltClick, fechaHoy, 3, ultClickTipo, 1);
			} else {
				//verificamos si la variable contien datos entre parentesis o corchetes,
				//estos datos son colocados por algún script, procedemos a eliminarlos para dejar solamente
				//los datos originales
				if (fechaUltClick.indexOf('(') !== -1 || fechaUltClick.indexOf('[') !== -1) {
					puntoCorte = fechaUltClick.indexOf('(');
                    if (puntoCorte === -1) {
						puntoCorte = fechaUltClick.indexOf('[');
                    }
					fechaUltClick = fechaUltClick.substring(0, puntoCorte);
				}
			}
		}
		
        //verificamos si el valor de la Media contiene datos entre parentesis o corchetes,
        //estos datos son colocados por algún script, procedemos a eliminarlos para dejar solamente
        //los datos originales
        if (valorMediaRR.indexOf('(') !== -1 || valorMediaRR.indexOf('|') !== -1) {
            puntoCorte = valorMediaRR.indexOf('(');
            if (puntoCorte === -1) {
                puntoCorte = valorMediaRR.indexOf('|');
            }
			valorMediaRR = valorMediaRR.substring(0, puntoCorte);
		}
		
		//Verificamos si es un numero el valor de la media, sino regresamo el valor 0.000
		if (isNaN(valorMediaRR)) {
			valorMediaRR = '0.000';
		}
				
		//creamos el string de salida final
		if (nFormaFecha === 2) {
			textoTemporal = nombreRR.trim() + "," + fechaDesdeRR.trim() + "," + fechaUltClick.trim() + "," + ClicsRR.trim() + "\n";
		} else {
			textoTemporal = numeroRR.trim() + ";" + nombreRR.trim() + ";" + fechaDesdeRR.trim() + ";" + fechaExpiraEn.trim() + ";" + fechaUltClick.trim() + ";" + ClicsRR.trim() + ";" + valorMediaRR.trim() + "\n";
		}
		
		if (textoTemporal.length > largoTexto) {
			largoTexto = textoTemporal.length;
		}
		mitexto = mitexto + textoTemporal;
	}
	
	// mostramso el resultado
	mostrarVentana(mitexto.substring(0, mitexto.length - 1), "EBPPAGERR");
}

//preguntamos por el idioma primero
miIdioma();
//para la página de estadísticas
if (location.href.indexOf("www.neobux.com/c/rs/") != -1) {
	ebp_Tipo_Pag = 3;
	crearBotonEBP("ExportEBP", EBP_Copia_Estadisticas);

	ebp_AnchoED = 400;
	ebp_AltoED = 300;
	crearFormularioEBP(2);
} else {
	//para la página de referidos directos
	if ( location.href.indexOf("www.neobux.com/c/rl") != -1 && location.href.indexOf("ss3=1") != -1) {
		ebp_Tipo_Pag = 2;
		crearBotonEBP("ExportEBP", EBP_Copia_RD);

		ebp_AnchoED = 700;
		ebp_AltoED = 400;
		crearFormularioEBP(2);
	} else {
		//para la página de referidos rentados
		if ( location.href.indexOf("www.neobux.com/c/rl") != -1 && location.href.indexOf("ss3=2") != -1) {
			ebp_Tipo_Pag = 1;
			crearBotonEBP("ExportEBP", EBP_Copia_RR);
				
			ebp_AnchoED = 700;
			ebp_AltoED = 400;
			crearFormularioEBP(2);
		} else {
			//para la página de Opciones Personales
			if (location.href.indexOf("www.neobux.com/c/d/") != -1) {
				ebp_Tipo_Pag = 4;
checkCookie();
				crearBotonEBP("ExportEBP Opt", mostrarVentanaOpciones);
					
				ebp_AnchoED = 500;
				ebp_AltoED = 250;
				crearFormularioEBP(1);
			} else {
				//para la página resumen
				if (location.href.indexOf("www.neobux.com/c/") != -1 || location.href.indexOf("www.neobux.com/c/?vl") != -1) {
					ebp_Tipo_Pag = 0;
					crearBotonEBP("ExportEBP", EBP_Copia_Resumen);

					ebp_AnchoED = 400;
					ebp_AltoED = 330;
					crearFormularioEBP(2);
				}
			}
		}
	}
}
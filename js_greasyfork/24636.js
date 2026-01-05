// coding: utf-8
// ==UserScript==
// @name          Reportes Metin2.es
// @version       2.0
// @namespace     reportes_metin2.es
// @author		  Shito (Script original) y Leinx (Mantenimiento) | Portabilizado para Metin2.es por Arshies
// @description   Script para identificar sección/servidor de los reportes e hilos pendientes de moderación en el foro de Metin2.es.
// @include       http://board.es.metin2.gameforge.com/index.php?page=ModerationReports*
// @include       http://board.metin2.es/index.php?page=ModerationReports*
// @include       http://board.es.metin2.gameforge.com/index.php?page=ModerationHiddenPosts
// @include       http://board.es.metin2.gameforge.com/index.php?page=ModerationHiddenThreads
// @match         http://board.es.metin2.gameforge.com/index.php?page=ModerationReports*
// @match         http://board.es.metin2.gameforge.com/index.php?page=ModerationHiddenPosts
// @match         http://board.es.metin2.gameforge.com/index.php?page=ModerationHiddenThreads
// @match         http://board.metin2.es/index.php?page=ModerationReports*
// @downloadURL https://update.greasyfork.org/scripts/24636/Reportes%20Metin2es.user.js
// @updateURL https://update.greasyfork.org/scripts/24636/Reportes%20Metin2es.meta.js
// ==/UserScript==
//
// Changelog
// 2.0      -   03-11-2016  :   Versión funcional completa. Se han cambiado las imágenes de icono de las secciones
// 0.1b     -   03-11-2016  :   Funcionamiento OK excepto el contador general
// 0.1a     -	03-11-2016  :	Primera versión (no funcional)

var losDivs, elDiv, forofo, seccion, fondocolor, letracolor;
var nDesconocido = 0;
//Bloque 0: Noticias
var nNoticias = 0;
//Bloque 1: Universo Metin2
var nUniverso = 0;
//Bloque 2: Servidores
var nAscarion = 0, nHidra = 0, nNemesis = 0, nKronos = 0, nGaia = 0, nServidores = 0;
//Bloque 3: El Sótano
var /*nBiblioteca = 0, nVariedades = 0, nArt = 0, nTaberna = 0, */nComunidad = 0;
var imgNoticias = 'data:image/png;base64,' +
    'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlz' +
    'AAAAcAAAAHABznhikwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHJSURB' +
    'VDiNxdPNalNBFMDx/5l7b2++TGqhrVYwXTSggggxweLGilCQvIK6dyNufAKXbop5ARfiM7hzU7so' +
    'SlEUUltELIIKqU1NcpObO3NcaKRRjEIXzvbM+Z2PYURVOcwxh8oG/H++KSLr58JSmATXAszKmVet' +
    '3bHA00rmpDhbNYaqqlakHFQCoaBO3lj0ETAKbJ6anusGvboLk8kUcuGYeNm0P0FaDCnxSInHV014' +
    'G8cAtOvlaWON/xOwfjJjhKWseFMGQYGuWrpqgQEAAxzgAeBUzuduP3v82whNF49dRfoHgJjdzv3y' +
    'lRHgfdTL99tuLJD3+zPHUyFo8iV7a2P9AJDEBhnoX17GgQAI3mxUX4wkV7vzRONoEiA/6Hxau1GM' +
    '483Xl3ZWV/O9VkvjqO8Sp94QOOL7rROpcPHsy/0GgO/li0vxzhq4hP0gF7+LnFxcrgXzy7XvhZz2' +
    '9rYbD5+v3PvgkMshZs4OvN4Q9LNTs4hWCeOPdPeaKuJNjPQspAul08WrDXsTuLtdknBhK+oPw6bb' +
    '7kB4lK7NoBgnvw4tYgWagAIsbGn/YNhH5QWAV5jH2ijK5zIbINdRNWKwqnxW5MGflir//Td+Axjx' +
    'tBYy2gz5AAAAAElFTkSuQmCC';
var imgUniversoMt2 = 'data:image/png;base64,' +
	'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMA' +
    'AABwAAAAcAHOeGKTAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAALdQTFRF' +
    '////2lVF5+Li5+Pj5OTk5OTk5Onp5ubm4+fn5Ofn5Ofn6cvG5efn5ejo6MvI5ejo4+jo6MzJ4+bm' +
    '47i247m15Lm14rq45YiA3V5S3F9T3V9U3WBW4oB34n925H944oB34oF4439444B44lxS4l1S4lZN' +
    '68jE4ldM2lRJ3FVK4ldM41pQ411S43925GBV5IF55IN75+Tk5+Xk6ZKM6ZON6ZWO7Ozs7ufn7ujn' +
    '7ujo7unp7urp8PDw7xHC5wAAACh0Uk5TADA1Njg5OTxAQV5eYWJiY2RkZXd4eX2JlpeXl7CxsbKy' +
    's7S6uubn9kXQ+rsAAADHSURBVBgZBcHRToNAEEDRO7PsrmArtFarxgfj//+SaXwxaVoMEQuFlVnP' +
    'EYihLL2Ql980jRTUQ9V4BSx0l+23BHvfzWMGpAqnQ+Fi86rYkjMhannF1dsCy+fP1q/Eks7uvkqW' +
    'P1roh3pKDvcYbDm1ABMRt6hAPgLAMYMoAAAAgGaQFwDYC5guJnG/Abh9DmKT83EV5Y6LPL354Maf' +
    'InU7sb9Ng5gW2o1O+limhIhkp+evLKwvD41XwFLXlr3ATQxrFSxdh3nmH7ILVJqNMqpwAAAAAElF' +
    'TkSuQmCC';    
var imgServidores = 'data:image/png;base64,' +
	'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMA' +
    'AARCAAAEQgGZ/ByLAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAKVQTFRF' +
    '////AACAAFVVOTlVQEBQKThMSl5rT2JwOEVOTF5tTWBtN0RPNUNONUNOKDhLN0VPOEVPNEFJNEJG' +
    'NUFLNUJLNkJMNkNINkNMNkNNN0RNOEVPOEs/OUZQOUdROkdROkhSOkhTO0lUPEpUPUtWPUxXRFla' +
    'RGo0RVlgSFxnS19sT2NxT2RyT4ItUGRyUWZ0UWZ1UWd1Umd2Umh2U2l4VGp5YagmY60lGPIHfgAA' +
    'ABF0Uk5TAAIDCRCXpbvAwNTY3d7f7/sA2OiqAAAAhElEQVQYGU3ByxLBMBiA0e+/pBcNw7D2Bt7/' +
    'sSxMVWkazYLJOWJCLXscqI0+zOd7YNMvpoBjTaaQwJocOe6oPaU1aslv7ykam9nTgvTKfJoobJWu' +
    'b1DiI1KRxqglv5CMwpIKJOV1nSjcPQTH9jqasGlNc7JFupAzPyIf9BD4CwcFoSJ8AR04IUGUkmJM' +
    'AAAAAElFTkSuQmCC';
var imgComunidad = 'data:image/png;base64,' +
	'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMA' +
    'AABvAAAAbwHxotxDAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAARdQTFRF' +
    '////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkJCA8PBw4OExoaAAYGDBISFyAgAAAABAgI' +
    'DBQYDwQEDgMDDRcXAwwMCRQXBQ4OYhwcBA0NFyQoRBUTYJOZFyQnBg8RCBESG0FEGz9CCRUWFiIj' +
    'PBEQFyIkHi0uPRIRSBUUSBUUHi8wCBQVCRgZIjQ2CRYXHi0wThgXBhASHi4wozAtJjo8VRkXT4CE' +
    'VxkYCxobKUBCNSMjMUxOCxwdDR8gGi0vIzY5KT9BKkBDECcpOVhbKT9CDR4gPFtfGDY5Ey4xFDI1' +
    'NzI1GCosGDo+Gj9DG0FFRxUTXY6UXY+VXpGXX5GXYJOZfCQipzEuvjg0wDk13kI95UM/cA3+LQAA' +
    'AE10Uk5TAAECAwUGBxAREh4iJCgpKzc9Pz9ESU9YWl5ld46VoKOoqKiqrq6vsrW1tbe6wcPDxMXK' +
    'y8zO0NDU1NbY2OLk5OXm5ujq7O7w8PX5+/3UGhTCAAAAo0lEQVQYGQXBBUICURQAwMFFsbtjUezu' +
    '7m791hOV+5/DGQAA0NoB3SWA0eu7smzz4XQIKB5GHDcNPKa0DFiN2Mnar9LrOKBnbqmfkZWJZoBC' +
    'HWQAbesXl1udgwe3J1MN0HL+EfF5c59SelmD2feIiK/nlFJ62hhmOs/zPN87m6xUjqp/1TGNQKnA' +
    '7u/bzz4AzNS+a/MA0LuwvdgHAIpd9QAA/AO1OhftmDd7VAAAAABJRU5ErkJggg==';
var imgDesconocida = 'data:image/png;base64,' +
	'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMA' +
    'AARuAAAEbgHQo7JoAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAADNQTFRF' +
    '/////wAA11dK1ltL11pK11pK11pK2FpL11pK11pK11pK11tL22pb8cbB8svG89DL9NDMNsZlDQAA' +
    'AAp0Uk5TAAEmcH+As7Xm9myQZpsAAABhSURBVBhXZY+BDoAgCERREpEo/f+vTShbizfm4PQEACa5' +
    'EDOVDDcJmzgNk9dVXqopKB9w+u39Ls/RMhRLDxXRw5QNyC711BmWEbB7dXSvhZfQxxKCJXwa2obB' +
    '4uhhud/6Fza7B+3BJRkkAAAAAElFTkSuQmCC';
var plantillaforo = '.*board(813|190|188|444|445|668|197|200|476|177|614|203|198|349|351|262|269|270|579|274|354|745|722|278|280|580|281|' +
                    '780|360|264|294|292|293|581|263|746|747|748|753|754|749|781|782|783|788|784|789|' +
                    '110|137|504|50|34|806|503|35|769|38|729|385|37|505|643|39|507|129|441).*';
losDivs = document.evaluate("//div[@class='messageFooter']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
contadorDivs = document.evaluate("//div[@class='contentHeader']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
contadorDiv = contadorDivs.snapshotItem(0);
for (var i = 0; i < losDivs.snapshotLength; i++) {
		elDiv = losDivs.snapshotItem(i);
		var numeroforo = document.getElementsByClassName('breadCrumbs light')[i].innerHTML.match(plantillaforo)[1];
    switch(numeroforo) {
		default:
		forofo = 'desconocida - Prueba con refrescar la página';
		seccion = ' Sección';
		imgSeccion = imgDesconocida;
		nDesconocido++;
		fondocolor = '#FF9999';
		letracolor = '#CC0000';
		break;
		/*
		Aqui empieza Noticias
		*/
		// Seccion - Noticias
		case '813':
        case '190':
        case '188':
        case '444':
        case '445':
        case '668':
        forofo = 'NOTICIAS';
		seccion = '';
		imgSeccion = imgNoticias;
        nNoticias++;
		fondocolor = '#99FF99';
		letracolor = '#006600';
        break;
        /*
		Aqui empieza UniversoMetin2
		*/
		// Seccion - UniversoMt2
		case '197':
        case '200':
        case '476':
        case '177':
        case '614':
        case '203':
        case '198':
		forofo = 'UNIVERSO METIN2';
		seccion = '';
		imgSeccion = imgUniversoMt2;
        nUniverso++;
		fondocolor = '#99FF99';
		letracolor = '#006600';
        break;
        /*
		Aqui empieza Servidores
		*/
		// Ascarion
		case '349':
        case '351':
        case '262':
        case '269':
        case '270':
        case '579':
        case '274':
        forofo = 'ASCARION';
		nAscarion++;
		seccion = 'Servidores | ';
		imgSeccion = imgServidores;
		nServidores++;
		fondocolor = '#CC99FF';
		letracolor = '#663300';
		break;
		// Hidra
		case '354':
        case '263':
        case '722':
        case '278':
        case '280':
        case '580':
        case '281':
		forofo = 'HIDRA';
		nHidra++;
		seccion = 'Servidores | ';
		imgSeccion = imgServidores;
		nServidores++;
		fondocolor = '#CC99FF';
		letracolor = '#663300';
		break;
		// Nemesis
		case '359':
        case '360':
        case '264':
        case '294':
        case '292':
        case '293':
        case '581':
        forofo = 'NEMESIS';
		nNemesis++;
		seccion = 'Servidores | ';
		imgSeccion = imgServidores;
		nServidores++;
		fondocolor = '#CC99FF';
		letracolor = '#663300';
		break;
		// Kronos
		case '745':
        case '746':
        case '747':
        case '748':
        case '753':
        case '754':
        case '749':
		forofo = 'KRONOS';
		nKronos++;
		seccion = 'Servidores';
		imgSeccion = imgServidores;
		nServidores++;
		fondocolor = '#CC99FF';
		letracolor = '#663300';
		break;
		// Gaia
		case '780':
        case '781':
        case '782':
        case '783':
        case '788':
        case '789':
        case '784':
        forofo = 'GAIA';
		nGaia++;
		seccion = 'Servidores | ';
		imgSeccion = imgServidores;
		nServidores++;
		fondocolor = '#CC99FF';
		letracolor = '#663300';
		break;
		// Beta
		case '26':
        case '110':
        case '137':
        case '504':
        case '50':
        case '34':
        case '806':
        case '503':
        case '35':
        case '769':
        case '38':
        case '729':
        case '385':
        case '37':
        case '505':
        case '643':
        case '39':
        case '507':
        case '129':
        case '441':
		forofo = 'EL SÓTANO';
		nComunidad++;
		seccion = '';
		imgSeccion = imgComunidad;
		fondocolor = '#CC99FF';
		letracolor = '#663300';
		break;
		}
		var infoSeccion = document.createElement("div");
		infoSeccion.innerHTML = '<div id="extrareporte" style="background-color:' + fondocolor +
				'"><center><font color = "' + letracolor + '" size = "4"><img id="imgseccion" src="'+ imgSeccion +'" width = "24"><b>' + seccion +
				' ' + forofo + '</center></font></b></div>';
		elDiv.parentNode.insertBefore(infoSeccion, elDiv.nextSibling);
}
var divisorContador = document.createElement("div");
divisorContador.innerHTML = '<div id="contador" style="background-color: #e9dca5"><b><center>-- General --<br>' +
		'<font color = "#FF8000">Noticias: ' + nNoticias + '</font> | ' +
        '<font color = "#9023a5">UniversoMetin2: ' + nUniverso + '</font> | ' +
		'<font color = "#23a540">Servidores: ' + nServidores + '</font> | ' +
		'<font color = "#0000FF">El Sótano: ' + nComunidad + '</font> | ' +
		'<font color = "#FF0000">Desconocidos - Error: ' + nDesconocido + '</font></b>' +
        '<b><br><br><font color = "#23a540">-- Sección Servidores --</font></p></b>' +
		'Ascarion: ' + nAscarion + ' | Hidra: ' + nHidra + ' | Nemesis: ' + nNemesis +
		' | Kronos: ' + nKronos + ' | Gaia: ' + nGaia +
        '</center></div></p>';
contadorDiv.parentNode.insertBefore(divisorContador, contadorDiv.nextSibling);
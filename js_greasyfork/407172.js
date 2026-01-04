// ==UserScript==
// @name         Opciones+ en Yahoo Finance
// @namespace    http://tampermonkey.net/
// @version      0.31
// @author       Juanvi - foro.cazadividendos.com/t/juanvi/2038
// @include      *://finance.yahoo.com/quote/*/options*
// @grant        none
// @description  Calculadora de rentabilidad anualizada (TAE) y seguridad (precio-strike/precio) para calls y puts en Yahoo Finance. También informa de eventos coporativos anteriores al vencimiento
// @downloadURL https://update.greasyfork.org/scripts/407172/Opciones%2B%20en%20Yahoo%20Finance.user.js
// @updateURL https://update.greasyfork.org/scripts/407172/Opciones%2B%20en%20Yahoo%20Finance.meta.js
// ==/UserScript==

(function() {

'use strict';

//CONFIGURACION DE USUARIO: SE PUEDE CAMBIAR Y GRABAR

var minTae=10;//Rentabilidad minima que se toma en cuenta para resaltar en verde
var minPrecio=10;//Porcentaje strike/precio minimo que se toma en cuenta para resaltar en verde
var primeraTabla='puts';//Tabla a  mostrar primero: puts o calls

//FIN CONFIGURACION

//Extraigo datos que necesito
var vencimiento=new Date(document.getElementsByTagName('select')[0].selectedOptions[0].value*1000);
var hoy=new Date();
var precio=window.App.main.context.dispatcher.stores.QuoteSummaryStore.price.regularMarketPrice.fmt;
var earnings_raw=window.App.main.context.dispatcher.stores.OptionContractsStore.meta.quote.earningsTimestamp;
var exdiv_raw=window.App.main.context.dispatcher.stores.QuoteSummaryStore.summaryDetail.exDividendDate.raw;
var divrate=window.App.main.context.dispatcher.stores.QuoteSummaryStore.summaryDetail.dividendRate.fmt;

//Creo la tabla de eventos corporativos
const anterior='<span style="background-color:lightcoral">Anterior</span> al vencimiento. ';
const posterior='<span style="background-color:DarkSeaGreen">Posterior</span> al vencimiento. ';
const pasado='<span style="background-color:DarkSeaGreen">Pasada.</span> ';
const pero='Pero la posible siguiente fecha es <span style="background-color:lightcoral">anterior</span> al vencimiento.';
var mensaje='<ul>';

if (earnings_raw==null) mensaje+='<li style="padding-bottom: 3px;">Fecha de beneficios no disponible.</li>';
else {
    var earnings=new Date(earnings_raw*1000);
    mensaje+='<li style="padding-bottom: 3px;">Beneficios: '+earnings.toLocaleString('es-ES',{ year: 'numeric', month: 'short', day: 'numeric' })+'. ';
    if (earnings>vencimiento) mensaje+=posterior;
    else if((earnings<=vencimiento) && (earnings>=hoy)) mensaje+=anterior;
    else {
        mensaje+=pasado;
        if ((earnings.getTime()+7948800000<=vencimiento.getTime()) && (earnings.getTime()+7948800000>=hoy.getTime())) mensaje+=pero;
    }
    mensaje+='</li>';
}

if (exdiv_raw==null) mensaje+='<li style="padding-bottom: 3px;">Fecha ex-div no disponible.</li>';
else {
    var exdiv=new Date(exdiv_raw*1000);
    mensaje+='<li style="padding-bottom: 3px;">Fecha ex-div: '+exdiv.toLocaleString('es-ES',{ year: 'numeric', month: 'short', day: 'numeric' })+'. ';
    if (exdiv>vencimiento) mensaje+=posterior;
    else if((exdiv<=vencimiento) && (exdiv>=hoy)) mensaje+=anterior;
    else {
        mensaje+=pasado;
        if ((exdiv.getTime()+7948800000<=vencimiento.getTime()) && (exdiv.getTime()+7948800000>=hoy.getTime())) mensaje+=pero;
    }
    mensaje+='</li>';
}

if (divrate==null) mensaje+='<li style="padding-bottom: 3px;">Dividendo anual no disponible.</li>';
else mensaje+='<li style="padding-bottom: 3px;">Dividendo anual: '+divrate+'&nbsp;('+parseFloat(divrate/4).toFixed(2)+' siguiente si es trimestral)</li>';

var advertencia=document.createElement('div');
advertencia.style='border: 3px solid rgb(115, 173, 33);padding-left: 10px;padding-top: 10px;padding-bottom:  10px;background-color: #d1f3c7;';
advertencia.innerHTML=mensaje+'</ul>';
try{
document.getElementById('Main').firstChild.appendChild(advertencia);//Version escritorio
} catch(e){
document.getElementById('UH-0-UH-0-MobileHeader').appendChild(advertencia);//Versión Mobile
}

//Modifico las tablas de puts y calls añadiendo rentabilidad y seguridad
var tablas = [document.getElementsByClassName('puts W(100%) Pos(r) list-options')[0],document.getElementsByClassName('calls W(100%) Pos(r) Bd(0) Pt(0) list-options')[0]];
var dias=(vencimiento.getTime()-hoy.getTime())/86400000;
for (var tabla of tablas){
    for (var i=0;i<tabla.rows.length;i++)
    {
        var row=tabla.rows[i];
        var criterio='bid';
        var valor=row.cells[4].innerText*1;//Calculo la TAE sobre el bid. Valoración conservadora pues asegura que, como mínimo, se obtiene ese rendimiento
        if (valor===0) {//Pero si el bid es 0, uso el last price
            valor=row.cells[3].innerText;
            criterio='last';
        }
        var strike=row.cells[2].innerText;
        row.insertCell(-1);
        row.insertCell(-1);
        if (i===0) {
            row.cells[0].innerHTML='';
            row.cells[11].innerHTML='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rentabilidad';
            row.cells[12].innerHTML='%Seguridad';
        } else {
            var tae=(100*valor*365)/(strike*(dias+2)); //Calculo TAE. Sumo dos dias para considerar sábado y domingo posteriores al vencimiento
            var porcentajeprecio=100*(precio-strike)*Math.pow(-1,tablas.indexOf(tabla))/precio; //Calculo de seguridad como % de precio actual sobre/bajo strike (en funcion de si es put o call)
            row.cells[11].innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+parseFloat(tae).toFixed(2)+"%&nbsp;&nbsp;("+criterio+")";
            row.cells[12].innerHTML="&nbsp;"+parseFloat(porcentajeprecio).toFixed(2)+"%&nbsp;";
            if ((tae>=minTae) && (porcentajeprecio>=minPrecio)) row.bgColor = (criterio=='bid')?"LawnGreen":"LightGreen";//Diferencio por color si he usado bid o last price
            row.getElementsByClassName('Fz(s) Ell C($linkColor)')[0].innerHTML="+";//Para acomodar las nuevas columnas, cambio el nombre de contrato por un +...
        }

        //...y borro las columnas que no me aportan. Se pueden habilitar al gusto
        row.deleteCell(6);
        row.deleteCell(6);
        row.deleteCell(8);
    }
}

//Pinto la cotizacion bajo el nombre de la empresa para tenerla a mano en la versión movil
document.getElementsByClassName('C($tertiaryColor) Fz(12px)')[0].innerHTML="Precio: "+precio;

//Si se prefiere delante las puts, intercambio las tablas
if (primeraTabla=='puts'){
    var separador = document.createElement('div');
    separador.style.height = "50px";
    tablas[0].parentNode.appendChild(separador);
    tablas[0].parentNode.appendChild(document.getElementsByClassName('Fw(b) Fz(m) Mend(10px)')[0].parentNode);
    tablas[0].parentNode.appendChild(tablas[1]);
}

//Deshabilito la vista straddle ya que no la he implementado
var selector=document.getElementsByClassName('Fl(start) Mend(18px) smartphone_Mt(10px) option-contract-control')[0];
selector.style.visibility='hidden';

//Quito los anuncios más intrusivos
var anuncios = ['mrt-node-Col1-0-Ad','mrt-node-Lead-0-Ad','mrt-node-Col1-0-GeminiPencilAdSmartphone','mrt-node-Col1-5-AdUnitWithTdAds','mrt-node-Col1-6-AdUnitWithTdAds','mrt-node-Col1-7-AdUnitWithTdAds','defaultLREC-wrapper'];
for (var anuncio of anuncios) {
    try{
        var anuncioElem=document.getElementById(anuncio);
        anuncioElem.parentNode.removeChild(anuncioElem);
    } catch (e){}
}
})();
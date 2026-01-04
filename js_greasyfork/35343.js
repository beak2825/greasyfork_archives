// ==UserScript==
// @name         ConfigTenda
// @namespace    leo@fasterenlinea.com.ar
// @version      3.1
// @description  Autoconfigurador de wifis tenda
// @author       Leo Demartin 
// @match        http://192.168.0.1/*
// @match        http://192.168.1.1/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35343/ConfigTenda.user.js
// @updateURL https://update.greasyfork.org/scripts/35343/ConfigTenda.meta.js
// ==/UserScript==

/* Changuelog

1
A ver que sale

1.1
Compatible Tenda Quicksetup

2 - 23/8/2017
Compatible con Tenda N301

3 - 30/09/2017
Compatible F9
Mejoras visuales
*/


(function() {
    'use strict';

//COMIENZO SCRIPT
//Creo el boton SetWanBtn y SetWirBtn
var SetWanBtn = document.createElement('button');
var SetWirBtn = document.createElement('button');
var SetBtn = document.createElement('button');
var SetBtnN301 = document.createElement('button');

//Agrego los botones

$(SetBtnN301).html('Configurar N301');$(SetBtnN301).addClass("btn btn-em");
$(SetBtnN301).css('margin','5px');
$(SetWanBtn).html('Configurar IP`s'); $(SetWanBtn).addClass("btn btn-frist btn-primary");
$(SetWirBtn).html('Configurar Inalambrico'); $(SetWirBtn).addClass("btn btn-frist btn-primary");
$(SetWirBtn).css('margin','5px');$(SetWanBtn).css('margin','5px');

$(SetBtn).html('Configurar Wifi'); $(SetBtn).addClass("form-control btn-primary");

//Agrego los botones

//Si existe el elemento quickSetWrap (no es un F456)

if ( $("#quickSetWrap").length > 0 ){
  document.getElementById('quickSetWrap').prepend(SetBtn);

}
//Si existe el elemento main_content (no es un N301)
else if ( $("#main_content").length > 0 ){
  document.getElementById('main_content').prepend(SetWirBtn);
  document.getElementById('main_content').prepend(SetWanBtn);
  }
else //es un N301
  document.getElementById('index-form').prepend(SetBtnN301);



//Llamo a la funcion al hacer clic en botones
SetWanBtn.onclick = SetWanConfig;
SetWirBtn.onclick = SetWirConfig;
SetBtn.onclick = SetConfig;
SetBtnN301.onclick = SetConfigN301;


//Se ejecuta la función al hacer clicen boton

function SetWanConfig() {
  //Selecciono el radio de Ip estatica
  document.getElementById('static').click();

  //Cambio los Valores de la IP
  $('span#wanIP input:nth-child(1)').val("192");
  $('span#wanIP input:nth-child(2)').val("168");
  $('span#wanIP input:nth-child(3)').val("2");
  $('span#wanIP input:nth-child(4)').val("50");

  //Cambio los Valores de la Mascara de Subred
  $('span#wanMask input:nth-child(1)').val("255");
  $('span#wanMask input:nth-child(2)').val("255");
  $('span#wanMask input:nth-child(3)').val("255");
  $('span#wanMask input:nth-child(4)').val("0");

  //Cambio los Valores de la Puerta de Enlace
  $('span#wanGateway input:nth-child(1)').val("192");
  $('span#wanGateway input:nth-child(2)').val("168");
  $('span#wanGateway input:nth-child(3)').val("2");
  $('span#wanGateway input:nth-child(4)').val("1");

  //Cambio los Valores de los DNS Primarios
  $('span#wanDns1 input:nth-child(1)').val("192");
  $('span#wanDns1 input:nth-child(2)').val("168");
  $('span#wanDns1 input:nth-child(3)').val("2");
  $('span#wanDns1 input:nth-child(4)').val("1");

  //Cambio los Valores de los DNS Secundarios
  $('span#wanDns2 input:nth-child(1)').val("8");
  $('span#wanDns2 input:nth-child(2)').val("8");
  $('span#wanDns2 input:nth-child(3)').val("8");
  $('span#wanDns2 input:nth-child(4)').val("8");}

 //Configuracion WAN
function SetWirConfig() {
  //Cambio SSID
  $('#wifiSSID').val("FasterWifi");
  //Cambio Pass
  $('#wifiPwd').val("faster");  }

function SetConfig() {
  document.getElementById('static').click();
  $('#wanIP').val("192.168.2.50");
  $('#wanMask').val("255.255.255.0");
  $('#wanGateway').val("192.168.2.1");
  $('#wanDns1').val("192.168.2.1");
  $('#wanDns2').val("8.8.8.8");
  $('#wifiSSID').val("FasterWifi");
  $('#wifiPwd').val("faster");

}

function SetConfigN301() {
  document.getElementById('static').click();
    //Cambio los Valores de la IP
  $('span#ipval input:nth-child(1)').val("192");
  $('span#ipval input:nth-child(2)').val("168");
  $('span#ipval input:nth-child(3)').val("2");
  $('span#ipval input:nth-child(4)').val("50");

  //Cambio los Valores de la Mascara de Subred
  $('span#submask input:nth-child(1)').val("255");
  $('span#submask input:nth-child(2)').val("255");
  $('span#submask input:nth-child(3)').val("255");
  $('span#submask input:nth-child(4)').val("0");

  //Cambio los Valores de la Puerta de Enlace
  $('span#gateway input:nth-child(1)').val("192");
  $('span#gateway input:nth-child(2)').val("168");
  $('span#gateway input:nth-child(3)').val("2");
  $('span#gateway input:nth-child(4)').val("1");

  //Cambio los Valores de los DNS Primarios
  $('span#dns1 input:nth-child(1)').val("192");
  $('span#dns1 input:nth-child(2)').val("168");
  $('span#dns1 input:nth-child(3)').val("2");
  $('span#dns1 input:nth-child(4)').val("1");

  //Cambio los Valores de los DNS Secundarios
  $('span#dns2 input:nth-child(1)').val("8");
  $('span#dns2 input:nth-child(2)').val("8");
  $('span#dns2 input:nth-child(3)').val("8");
  $('span#dns2 input:nth-child(4)').val("8");
  $('#ssid').val("FasterWifi");
  $('#ssid-pwd').val("faster");
}



//FIN SCRIPT
})();
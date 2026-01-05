// ==UserScript==
// @name        Taringa - Activador de Registro
// @namespace   https://greasyfork.org/es/users/29399-cl0n3r
// @description Activa el formulario de registro en Taringa.net
// @compatible  firefox
// @compatible  chrome
// @compatible  opera
// @match       https://*.taringa.net/registro
// @version     2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16845/Taringa%20-%20Activador%20de%20Registro.user.js
// @updateURL https://update.greasyfork.org/scripts/16845/Taringa%20-%20Activador%20de%20Registro.meta.js
// ==/UserScript==

var fb_iframe = document.querySelector("div#page > div#main form[name='register'] > iframe.show-on-facebook");
var boton_registro = document.querySelector("div#page > div#main form[name='register'] > div.divider.bt.clearfix");
var i;
var dia='\n';
var mes='';
var anio='\n';
var html_form;
var html_captcha;

for(i=1;i<32;i++) dia+='<option value="'+i+'">'+i+'</option>\n';

mes='\n<option value="1">Enero</option>\n<option value="2">Febrero</option>\n<option value="3">Marzo</option>\n<option value="4">Abril</option>\n<option value="5">Mayo</option>\n<option value="6">Junio</option>\n<option value="7">Julio</option>\n<option value="8">Agosto</option>\n<option value="9">Septiembre</option>\n<option value="10">Octubre</option>\n<option value="11">Noviembre</option>\n<option value="12">Diciembre</option>\n';

for(d=new Date(),i=d.getFullYear();i>1910;i--) anio+='<option value="'+i+'">'+i+'</option>\n';

html_form = '<div class="noCaptcha" style=" display:block;"><div class="clearfix form-item"><label>Nombre </label><input id="name" type="text" name="firstname" maxlength="30" class="ui-corner-all form-input-text" autocomplete="off"/><div class="tooltip-error clearfix"><span class="pico"></span><p></p></div><i></i></div><div class="clearfix form-item"><label>Apellido</label><input id="lastname" type="text" name="lastname" maxlength="30" class="ui-corner-all form-input-text" autocomplete="off"/><div class="tooltip-error clearfix"><span class="pico"></span><p></p></div><i></i></div><div class="clearfix form-item"><label>Nombre de usuario</label><input id="nick" type="text" name="username" maxlength="30" class="ui-corner-all form-input-text" autocomplete="off"/><div class="tooltip-error clearfix"><span class="pico"></span><p></p></div><i></i><div class="suggestUsername"><div id="suggestUsername" class="clearfix"></div></div></div><div class="clearfix form-item"><label>Dirección de email</label><input id="email" type="text" name="email" maxlength="255" class="ui-corner-all form-input-text" autocomplete="off"/><div class="tooltip-error clearfix"><span class="pico"></span><p></p></div><i></i></div><div class="clearfix form-item"><label>Repetir dirección de email</label><input id="email_retype" type="text" name="email_retype" maxlength="255" class="ui-corner-all form-input-text" autocomplete="off"/><div class="tooltip-error clearfix"><span class="pico"></span><p></p></div><i></i></div><div class="clearfix form-item"><label>Contrase&ntilde;a</label><input id="password" type="password" name="password" maxlength="30" class="ui-corner-all form-input-text" autocomplete="off"/><div class="tooltip-error clearfix"><span class="pico"></span><p></p></div><i></i></div><div class="clearfix form-item"><label>Repetir contrase&ntilde;a</label><input id="password_retype" type="password" name="password_retype" maxlength="30" class="ui-corner-all form-input-text" autocomplete="off"/><div class="tooltip-error clearfix"><span class="pico"></span><p></p></div><i></i></div><div class="clearfix form-item"><label>Fecha de nacimiento</label><div class="floatL"><select id="dia" name="day" autocomplete="off"><option value="">D&iacute;a</option>'+dia+'</select><select id="mes" name="month" autocomplete="off"><option value="">Mes</option>'+mes+'</select><select id="anio" name="year" autocomplete="off"><option value="">A&ntilde;o</option>'+anio+'</select></div><div id="date_msg" class="tooltip-error clearfix"><span class="pico"></span><p></p></div><a class="reg" href="">Por qu&eacute; debo ingresar mi fecha de nacimiento?</a></div></div>';
html_captcha ='<div class="captcha" style=" display:block;"><!-- Captcha --><div class="clearfix form-item"><label>Chequeo de seguridad</label><div class="g-recaptcha" data-sitekey="6LdwIwMTAAAAALfwmxe917IQmmlB2yI1VYbkRBcW"></div><div id="captcha_msg" class="tooltip-error clearfix" style="display: none;"><span class="pico"></span><p>Este es un filtro de seguridad para comprobar que no eres un robot</p></div></div></div>';

fb_iframe.insertAdjacentHTML('afterend', html_form+html_captcha);
boton_registro.style.display = "block";
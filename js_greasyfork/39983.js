// ==UserScript==
// @name         sesiones rapidas
// @namespace    Needrom
// @version      0.2.2
// @description  Script organizador de cuentas
// @author       Yo
// @icon          http://k33.kn3.net/taringa/1/2/3/2/9/6/48/_serialkiller_/58E.gif
// @include     *://*.taringa.net/*
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/39983/sesiones%20rapidas.user.js
// @updateURL https://update.greasyfork.org/scripts/39983/sesiones%20rapidas.meta.js
// ==/UserScript==
$('head').append('<style type="text/css">.ui-state-disabled { cursor: default !important;pointer-events: none;color : #757575!important;}</style>');
$('div.user-actions.fl-l').prepend('<div class="user-action"><a id="user_cambio" class="icon-usuarios"></a></div>');
$('#user_cambio').after('<div id="tool user" class="usercount tools"><h4>Usuarios</h4><h4><a href="https://'+window.location.host+'/cuenta#Administrar_cuentas" target="_blank">Administrar Cuentas</a></h4><ul id="usercambio"></ul></div>');
$('.usercount').hide();
$(document).on('click', '#user_cambio', function() {
$('.usercount').toggle();
$('#usercambio > li').remove();
var miObjeto = JSON.parse(localStorage.getItem('OKAY'));
  for (var p =0 ; p < miObjeto.length; p++) {
$('#usercambio').append('<li><a class="useracceder" nick="'+miObjeto[p].nombre+'"><img src="'+miObjeto[p].avatar+'"><span class="ico-point"></span><h5><strong class="ico-usuario">'+miObjeto[p].nombre+'</strong></h5><p>ID: '+miObjeto[p].id+'</p></a></li>');
}
});


if (window.location == "https://www.taringa.net/cuenta#Administrar_cuentas"){
$('.tabbed-d,#sidebar,.colorpicker').remove();
$('#full-col').append('<div class="botonacceso"><input class="btn agregar" value="Agregar" type="button"><input class="btn a generar" value="Generar" type="button"><input class="btn v guardar" value="Guardar" type="button"><br><div class="orden"></div>');
var t=0;
$(document).on('click', '.agregar', function() {
$('.orden').append('<div class="field count'+(t++)+' clearfix"><label for="nick">Nick:</label><input class="text cuenta-save ui-corner-all form-input-text box-shadow-soft" id="nick" maxlength="32" value="" type="text"><br></br></div><br></br>');
});

 $(document).on('click', '.generar', function() {
$('#usercambio > li').remove();
localStorage.removeItem('session');
$('.usercount').toggle();
var accounts=$('.field');
var r=0;
for (var i =0 ; i < accounts.length; i++) {
var esto ='.count'+i;
$.getJSON( "//"+window.location.host.replace("www","api")+"/user/nick/view/"+$(esto).find('#nick').val(), function( json ){
$('#usercambio').append('<li><a class="useracceder" id="cu'+(r++)+'" nick="'+json.nick+'" imag="'+json.avatar.medium+'" id-user="'+json.id+'"><img src="'+json.avatar.medium+'"><span class="ico-point"></span><h5><strong class="ico-usuario">'+json.nick+'</strong></h5><p>ID: '+json.id+'</p></a></li>');
  });
  }
  });

$(document).on('click', '.guardar', function() {
 var acco=$('.useracceder');
var session = [];
 for (var m =0 ; m < acco.length; m++) {
 var yeah = "#cu"+m;
 var miObjeto=new Object();
 miObjeto.nombre = $(yeah).attr("nick");
 miObjeto.id = $(yeah).attr("id-user");
 miObjeto.avatar = $(yeah).attr("imag");
session.push(miObjeto);
}
var aca = localStorage.setItem('OKAY', JSON.stringify(session));
var restoredSession = JSON.parse(localStorage.getItem('OKAY'));
});
}


  $(document).on('click', '.useracceder', function() {
      $.ajax({type:"POST",url:"/ajax/user/logout"});

               $.ajax({
                        url: '/registro/login-submit.php',
                        type: 'post',
                        dataType: 'json',
                        beforeSend: function() {},
                        data: {
                                key: undefined,
                                nick: $(this).attr('nick'),
                                pass: prompt("Ingresar contraseña", ""),
                                connect: '',
                                redirect: '/' + window.location.pathName
                        },
                        success: function(data) {
                                document.location.reload();
                        }
                });


});
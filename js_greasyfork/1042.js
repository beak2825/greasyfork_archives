// ==UserScript==
// @name        AdoptaUnTioPlus
// @namespace   adoptauntioplus
// @version     0.6.2
// @icon        http://mvusertools.com/ext/aut/autplusicon.png
// @description Descargar fotos de los perfiles, busca clones/fakes y añade un nivel para saber el comportamiento mandando mensajes de las usuarias con un click en la web de citas adoptauntio.com
// @match       http://www.adoptauntio.es/*
// @match       https://www.adoptauntio.es/*
// @include     http://www.adoptauntio.es/*
// @include     https://www.adoptauntio.es/*
// @author      Vegon
// @downloadURL https://update.greasyfork.org/scripts/1042/AdoptaUnTioPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/1042/AdoptaUnTioPlus.meta.js
// ==/UserScript==

$(function(){
   
  // BOTONES DE BUSCA FAKES Y DESCARGAR FOTOS
  $('#photo-gallery .gallery-fullsize-view').each(function() {
      var urlfoto = $(this).children('.image-wrapper').find('img').attr('src');
      var linkafoto = '<div style="margin:3px 0; float: left;"><a style="background:url(http://www.mvusertools.com/ext/aut/save-icon.png) no-repeat;width: 16px; height: 16px; display: block;overflow: hidden; text-indent: 100%; white-space: nowrap;" href="'+urlfoto+'" target="_blank" title="Descargar foto" >Descargar foto</a></div>';
      
      var googleapi = 'https://www.google.com/searchbyimage?&image_url='+urlfoto+'';
      var linkgooglesearch = '<div style="margin:3px 0 0 5px;"><a style="background:url(http://www.mvusertools.com/ext/aut/lupa-icon.png) no-repeat;width: 16px; height: 16px; display: block;overflow: hidden; text-indent: 100%; white-space: nowrap;" href="'+googleapi+'" target="_blank" title="Buscar clones de la foto" >Buscar clones de la foto</a></div>';
    
      $(this).children('.image-wrapper').prepend(linkgooglesearch);
      $(this).children('.image-wrapper').prepend(linkafoto);
  });


  // MV LEVEL
  var $correos = $('#popularity table tr th:contains("Correos")').siblings('td:not(.equals):not(.count)').clone().children().remove().end().text();
  var correos = parseInt($correos);

  var $hechizos = $('#popularity table tr th:contains("Hechizos")').siblings('td:not(.equals):not(.count)').clone().children().remove().end().text();
  var hechizos = parseInt($hechizos);

  var valor = parseFloat(correos / hechizos * 100).toFixed();

  var mensaje;
  var color;

  if (valor == 0 ) {
    mensaje = 'Aun no ha mandado un solo mensaje';
    color = '#E62E2E'
  }
  else if (valor <= 10) {
    mensaje = 'Casi ni manda mensajes';
    color = "#E66B2E"
  }
  else if (valor <= 15) {
    mensaje = '1 de cada 150 pasan del hola';
    color = "#E6A82E"
  }
  else if (valor <= 20) {
    mensaje = 'Muy selectiva';
    color = "#E6E62E"
  }
  else if (valor <= 25) {
    mensaje = 'Intentalo que no pierdes nada';
    color = "#A8E62E"
  }
  else if (valor <= 50) {
    mensaje = 'Parece que se para a elegir';
    color = "#6BE62E"
  }
  else if (valor <= 75) {
    mensaje = 'Responde a muchos';
    color = "#A8E62E"
  }
  else if (valor <= 90) {
    mensaje = 'Responde a casi todos';
    color = "#E6E62E"
  }
  else if (valor <= 110) {
    mensaje = 'Acepta TODOS los hechizos';
    color = "#E6A82E"
  }
  else if (valor <= 150) {
    mensaje = 'Inicia conversaciones';
    color = "#E66B2E"
  }
  else if (valor > 150) {
    mensaje = 'Corre y no mires atrás';
    color = '#E62E2E'
  }

  var $popularidad = $('#popularity');

  $popularidad.append('<hr style="margin: 3px 0; border-top: 1px solid #F8D4E1" /><span>MV Level</span><br/>');
  $popularidad.append('<span style="color: '+ color +'; font-size: 14px; font-weigth: bold;">'+ valor +'</span> <span style="color: #9C9C9C; font-size: 13px;">' + mensaje +'</span>');
    
});
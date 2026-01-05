// ==UserScript==
// @name        AdoptaUnTioPlus
// @namespace   adoptauntioplus
// @version     0.7.0
// @icon        http://mvusertools.com/ext/aut/autplusicon.png
// @description Descargar fotos de los perfiles, busca clones/fakes y añade un nivel para saber el comportamiento mandando mensajes de las usuarias con un click en la web de citas adoptauntio.com
// @match       http://www.adoptauntio.es/*
// @match       https://www.adoptauntio.es/*
// @include     http://www.adoptauntio.es/*
// @include     https://www.adoptauntio.es/*
// @author      GoRhY basado en https://greasyfork.org/en/scripts/1042-adoptauntioplus
// @downloadURL https://update.greasyfork.org/scripts/24937/AdoptaUnTioPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/24937/AdoptaUnTioPlus.meta.js
// ==/UserScript==

$(function(){
  // BOTONES DE BUSCA FAKES Y DESCARGAR FOTOS
  $('.photo-gallery .gallery-fullsize-view').each(function() {
      var urlfoto = $(this).children('.img-wrapper').find('img').attr('src');
      var linkafoto = '<div style="margin:3px 0; float:left;"><a href="'+urlfoto+'" target="_blank" title="Buscar clones de la foto"><img src="http://www.mvusertools.com/ext/aut/save-icon.png" height="16" width="16"></a></div>';
      var googleapi = 'https://www.google.com/searchbyimage?&image_url='+urlfoto+'';
      var linkgooglesearch = '<div style="margin:3px 0 0 5px; float:left;"><a href="'+googleapi+'" target="_blank" title="Buscar clones de la foto"><img src="http://www.mvusertools.com/ext/aut/lupa-icon.png" height="16" width="16" style="height: 16px !important;"></a></div>';  
      $(this).children('.img-wrapper').prepend(linkgooglesearch);
      $(this).children('.img-wrapper').prepend(linkafoto);
  });

  $('a.nav-bar-basket').hide();

  //AUT LEVEL
  var $correos = $('.pop-table-wrap table tr th:contains("Correos")').siblings('td:not(.equals):not(.count)').clone().children().remove().end().text().replace(".","");
  var correos = parseInt($correos);

  var $hechizos = $('.pop-table-wrap table tr th:contains("Hechizos")').siblings('td:not(.equals):not(.count)').clone().children().remove().end().text().replace(".","");
  var hechizos = parseInt($hechizos);

  var valor = parseFloat(correos / hechizos * 100).toFixed();

  var mensaje;
  var color;

  if (valor === 0 ) {
    mensaje = 'Aun no ha mandado un solo mensaje';
    color = '#E62E2E';
  }
  else if (valor <= 10) {
    mensaje = 'Casi ni manda mensajes';
    color = "#E66B2E";
  }
  else if (valor <= 15) {
    mensaje = '1 de cada 150 pasan del hola';
    color = "#E6A82E";
  }
  else if (valor <= 20) {
    mensaje = 'Muy selectiva';
    color = "#E6E62E";
  }
  else if (valor <= 25) {
    mensaje = 'Intentalo que no pierdes nada';
    color = "#A8E62E";
  }
  else if (valor <= 50) {
    mensaje = 'Parece que se para a elegir';
    color = "#6BE62E";
  }
  else if (valor <= 75) {
    mensaje = 'Responde a muchos';
    color = "#A8E62E";
  }
  else if (valor <= 90) {
    mensaje = 'Responde a casi todos';
    color = "#E6E62E";
  }
  else if (valor <= 110) {
    mensaje = 'Acepta TODOS los hechizos';
    color = "#E6A82E";
  }
  else if (valor <= 150) {
    mensaje = 'Inicia conversaciones';
    color = "#E66B2E";
  }
  else if (valor > 150) {
    mensaje = 'Corre y no mires atrás';
    color = '#E62E2E';
  }else if (valor == "NaN"){
      valor = 'Usuaria nueva';
      mensaje = '';
  }

  var $popularidad = $('div.profil-encart-data');

  $popularidad.append('<hr style="margin: 3px 0; border-top: 1px solid #F8D4E1" /><span>AUT Level</span><br/>');
  $popularidad.append('<span style="color: '+ color +'; font-size: 14px; font-weigth: bold;">'+ valor +'</span> <span style="font-size: 13px;">' + mensaje +'</span>');
});

/* CHANGELOG
0.7.0
- Arreglado el código para el último cambio de la web
- Se elimina el molesto botón con la cesta que redirige a pagos
*/
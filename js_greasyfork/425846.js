// ==UserScript==
// @name     Cámara de eco
// @namespace  meneame.net
// @version   0.1
// @description Cámara de eco para meneame.net
// @author    automatix
// @match    www.meneame.net/*
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/425846/C%C3%A1mara%20de%20eco.user.js
// @updateURL https://update.greasyfork.org/scripts/425846/C%C3%A1mara%20de%20eco.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

( function() {
  'use strict';

  // configuración
    var ocultar = 1; // a 0 si no se quiere ocultar la noticia, ¿para qué estás usando esto?
    var votar = 0; // a 1 si quieres votar 0 si crees en un mundo mejor donde todos vayamos de la mano;
    /*
    ¿porqué irrelevante?, porque es absolutamente subjetivo y es ampliamente usado junto con el voto erronea para censura activa
    -2:  antigua
    -10: bulo
    -3:  cansina
    -9:  copia/plagio
    -6:  duplicada
    -8:  errónea
    -1:  irrelevante
    -7:  microblogging
    -11: muro de pago
    -4:  sensacionalista
    -5:  spam
    */
    var tipoVoto = -1;

    // lista de valores separados por comas ejemplo: 'twitter.com', 'mobile.twitter.com', 'youtube.com'
    var sitiosAQuitar = [
	];

    // lista de usuarios separados por comas ejemplo: 'usuario1', 'usuario2'
    var usuarios = [
    ];

    // lista de keywords en el título que quieres quitar ejemplo: 'zasca', 'brutal', 'destroza a'
    var keywords = [
    ];
   // aqui se acaba la configuración

  var bloques = [];
  var $ = window.jQuery;

   // icono en la cabecera
  var header = document.getElementById( "header-menu" );
  var ul = header.getElementsByClassName( "header-menu01" )[ 0 ].getElementsByClassName( "menu01-itemsl" )[ 0 ];
  var li = document.createElement( "li" );
  li.title = "Cámara de eco";
  ul.appendChild( li );

  var summaries = document.getElementsByClassName( "news-summary" );
  for( let div of summaries ) {
    var newsInfo = div.getElementsByClassName( "news-body" );
    var minUrl = newsInfo[ 0 ].getElementsByClassName( "news-submitted" )[ 0 ].getElementsByClassName( "showmytitle" )[ 0 ];
    if (typeof minUrl != "undefined") {
    if( sitiosAQuitar.includes(minUrl.innerHTML) ) {
      newsInfo[ 0 ].style.border = "1px solid #ffb380";
      bloques['l'+$(newsInfo[0]).data('link-id')] = newsInfo[ 0 ];
      if(ocultar == 1) {
         $(newsInfo[ 0 ]).css('display', 'none');
      }
    }
    }
  }

    // usuarios
  var users = $('.news-submitted a.tooltip+a').each(function(key, user) {
     let usuario = user.innerHTML;
     if( usuarios.includes(user.innerHTML) ) {
         $(user).css('background', 'red');
         $(user).css('color', 'white');
         var newsInfo = $(user).parent();
         var minUrl = $('.showmytitle', newsInfo).html();
         bloques['l'+$(newsInfo[0]).data('link-id')] = newsInfo[ 0 ];
         if(ocultar == 1) {
             $(newsInfo[ 0 ]).css('display', 'none');
         }
     }
  });

    // titulares
    var titulos = $('h2 a').each(function(key, titulo) {
        let titular = titulo.innerHTML;
        for( let keyword of keywords ) {
            if (titular.indexOf(keyword) >= 0) {
                var newsInfo = $(titulo).parent().parent().parent();
                bloques['l'+$(newsInfo[0]).data('link-id')] = newsInfo[ 0 ];
                $(newsInfo[ 0 ]).css('display', 'none');
            }
        }
    });


    li.innerHTML = "<span class='badge'><i class='fa fa-trash'></i> "+Object.keys(bloques).length+"</span>";

  function vota() {
      if(Object.keys(bloques).length > 0) {
          if(user_id > 0){
              let elemento = mipop(bloques);
              let voto = $(elemento.val).find('div.menealo a');
              if(voto.length > 0) {
                  let id_noticia = $(elemento.val).data('link-id');
                  let url = 'https://www.meneame.net/backend/problem?id='+id_noticia+'&user='+user_id+'&value='+tipoVoto+'&key='+base_key+'&l='+id_noticia+'&u=https%3A%2F%2Fwww.meneame.net%2F';
                  $.getJSON(url);
              } else {
                  console.log('ya votado');
              }
          }
      } else {
          console.log('destruido el temporizador');
          clearInterval(temporizador);
      }
  }

    function mipop(obj) {
        var key = Object.keys(obj).pop();
        var result = {key: key, val: obj[key]};
        delete obj[key];
        return result;
    }

    if(votar == 1) {
        var temporizador = setInterval(vota,15000);
    }
    /*
       ¿Porqué 15 segundos?, ¿porque un temporizador en vez de usar promises?. 15 segundos es un margen "seguro", probablemente se puede bajar.
       Usar aqui promises no tiene sentido porque precisamente hay un tiempo mínimo entre voto y voto
    */

} )();
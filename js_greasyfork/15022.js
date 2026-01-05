// ==UserScript==
// @name         krejdowy naprawiacz playera
// @namespace    http://wykop.pl/*
// @version      0.91
// @description  bo dlaczego nie?
// @author       krejd
// @copyright    krjed
// @match        http://www.wykop.pl/*
// @downloadURL https://update.greasyfork.org/scripts/15022/krejdowy%20naprawiacz%20playera.user.js
// @updateURL https://update.greasyfork.org/scripts/15022/krejdowy%20naprawiacz%20playera.meta.js
// ==/UserScript==

'use strict';

// Bind movies in comments

function bindYtPlayerInComments() {

  var ytMovies = $('a[href*=youtube][class=ajax]');

  ytMovies.each(function(index, value) {
    var $a = $(value);
    $a.off('click');
    $a.on('click', function(ev) {
      ev.preventDefault();
      ev.stopPropagation();

      var $parent = $a.parent();

      var href = $a.attr('href');
      var regex = /v=(.*?)$/ig;
      var vidId = regex.exec(href)[1];

      var userResY = $(window).height();
      var vidHeight = Math.floor(userResY/3);
      vidHeight = vidHeight < 450 ? 450 : vidHeight;

      var newVideo = $('<iframe id="player" width="100%" height="'+vidHeight+'" src="http://www.youtube.com/embed/'+vidId+'?enablejsapi=1&autoplay=1&origin=http://wykop.pl" frameborder="0"></iframe>');

      $('*', $parent).remove();

      $parent.css('max-width', '100%');
      $parent.css('width', '100%');
      $parent.css('height', vidHeight);
      $parent.append(newVideo);

    });
  });

}

// Bind YT Player in comments

bindYtPlayerInComments();

// Hook to every ajax request

$(document).ajaxComplete(function() {
  setTimeout(function() {
    bindYtPlayerInComments();
  }, 500);
});

// Replace big player
  
setTimeout(function() {

  var $ytMovieMain = $('iframe[src*=youtube]');
  var newSrc = $ytMovieMain.attr('src');
  newSrc = newSrc.replace('controls=0', 'controls=1');
  newSrc = newSrc.replace('showinfo=0', 'showinfo=1');
  $ytMovieMain.attr('src', newSrc);
  $ytMovieMain.appendTo('body');

  $('.bspace .screen *').remove();

  $ytMovieMain.appendTo('.bspace .screen');
  $('.bspace .screen').css('height', 450);

}, 500);
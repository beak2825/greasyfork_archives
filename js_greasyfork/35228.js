// ==UserScript==
// @name        FSimplify
// @namespace   drag0r
// @description Simplifie le graphisme
// @include     https://www.facebook.com/*
// @version     1
// @grant       none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/35228/FSimplify.user.js
// @updateURL https://update.greasyfork.org/scripts/35228/FSimplify.meta.js
// ==/UserScript==
$(function () {
  exec();
  function exec() {
    purexec()
    setTimeout(function () {
      purexec()
    }, 2500);
    setTimeout(function () {
      purexec()
    }, 5000);
  }
  function purexec() {
    $('._2s1x').css('background-color', '#BBB');
    $('._2s1y').css('background-color', '#BBB');
    $('._2s1x').css('color', '#000');
    $('._2s1y').css('color', '#000');
    $('._1wcc').each(function () {
      $(this).html('FSimplify Actif');
    });
    $('#rightCol').children().each(function () {
      $(this).remove();
    });
    $('._4kqp').parent().remove();
  }
  $('a').click(function () {
    exec();
  });
  $('span').click(function () {
    exec();
  });
  $('div').click(function () {
    exec();
  });
  $('img').click(function () {
    exec();
  });
});

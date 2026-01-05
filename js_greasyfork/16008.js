// ==UserScript==
// @name       Allociné Casting Quick Copy/Paste
// @namespace  allocine-casting-quick-cp
// @version    1.2.1
// @require    https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @match      http://www.allocine.fr/film/fichefilm-*/casting/
// @run-at     document-idle
// @description COPY PAAAAAASTAAA
// @downloadURL https://update.greasyfork.org/scripts/16008/Allocin%C3%A9%20Casting%20Quick%20CopyPaste.user.js
// @updateURL https://update.greasyfork.org/scripts/16008/Allocin%C3%A9%20Casting%20Quick%20CopyPaste.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ****************************************
   * CSS
   ******************************************/

  injectStyles(`
    .us-casting-table {
      padding: 10px;
      border-bottom: 4px solid #F0F0F0;
      margin-bottom: 30px;
    }

    .us-person {
      border-bottom: 1px solid #f0f0f0;
    }

    .us-name,
    .us-role {
      padding: 10px;
      display: inline-block;
      font-size: 14px;
      cursor: pointer;
    }

    .us-name:hover,
    .us-role:hover {
      background-color: #F0F0F0;
    }

    .us-role {
      color: grey;
      width: 55%;
    }

    .us-name {
      width: 44%;
    }

    .us-heading {
      font-size: 20px;
      margin: 20px 0;
    }

    .us-copied {
      font-size: 12px;
      color: blue;
      font-weight: bold;
      position: absolute;
      margin-left: 10px;
    }
  `);

  function injectStyles(rule) {
    var div = $("<div />", {
      html: '&shy;<style>' + rule + '</style>'
    }).appendTo("body");
  }

  function copy(str) {
    let temp = $('<input>');
    $('body').append(temp);
    temp.val(str);
    temp.select();
    document.execCommand('copy');
    temp.remove();
  }

  /* ****************************************
   * FONCTIONNEMENT DU SCRIPT
   ******************************************/
  setTimeout(function () {

    if ($('.us-casting-table').length != 1) {

      $('.casting-director').before(`<div class="us-casting-table"></div>`);

      // REALISATEURS
      $('.us-casting-table').append('<h2 class="us-heading">Réalisateurs</h2>');

      $('.casting-director .meta-title-link').each(function () {
        $('.us-casting-table').append(`
        <div class="us-person">
          <span class="us-name">${$.trim($(this).html())}</span>
        </div>
      `);
      });

      // ACTEURS
      $('.us-casting-table').append('<h2 class="us-heading">Acteurs</h2>');

      $(".casting-actor .meta-title-link").each(function () {
        $('.us-casting-table').append(`
        <div class="us-person">
          <span class="us-name">${$.trim($(this).html())}</span>
          <span class="us-role">${($(this).parents().eq(1).find('.meta-sub').length == 1) ? $.trim($(this).parents().eq(1).find('.meta-sub').html().replace('Rôle : ', '')) : '-'}</span>
        </div>
      `);
      });

      $('h2.titlebar-title-md:contains("Acteurs et actrices")').parents().eq(1).find('.md-table-row').each(function () {
        $('.us-casting-table').append(`
        <div class="us-person">
          <span class="us-name">${$.trim($(this).find('a.item.link').html())}</span>
          <span class="us-role">${($(this).find('span.item.light').length == 1) ? $.trim($(this).find('span.item.light').html()) : null}</span>
        </div>
      `);
      });

      // SCENARISTES
      $('.us-casting-table').append('<h2 class="us-heading">Scénaristes</h2>');

      $('h2.titlebar-title-md:contains("Scénario")').parents().eq(1).find('.md-table-row').each(function () {
        $('.us-casting-table').append(`
        <div class="us-person">
          <span class="us-name">${$.trim($(this).find('a.item.link').html())}</span>
          <span class="us-role">${($(this).find('span.item.light').length == 1) ? $.trim($(this).find('span.item.light').html()) : null}</span>
        </div>
      `);
      });

      // PRODUCTEURS
      $('.us-casting-table').append('<h2 class="us-heading">Producteurs</h2>');

      $('h2.titlebar-title-md:contains("Production")').parents().eq(1).find('.md-table-row').each(function () {
        $('.us-casting-table').append(`
        <div class="us-person">
          <span class="us-name">${$.trim($(this).find('a.item.link').html())}</span>
          <span class="us-role">${($(this).find('span.item.light').length == 1) ? $.trim($(this).find('span.item.light').html()) : null}</span>
        </div>
      `);
      });

      // SOCIETES
      $('.us-casting-table').append('<h2 class="us-heading">Sociétés</h2>');

      $('h2.titlebar-title-md:contains("Sociétés")').parents().eq(1).find('.md-table-row').each(function () {
        $('.us-casting-table').append(`
        <div class="us-person">
          <span class="us-name">${$.trim($(this).find('a.item.link').html())}</span>
          <span class="us-role">${($(this).find('span.item.light').length == 1) ? $.trim($(this).find('span.item.light').html()) : null}</span>
        </div>
      `);
      });

    }
  }, 100);

  $('.col-left').on('click', '.us-name,.us-role ', function() {
    $(this).find('.us-copied').remove();
    copy($(this).html());
    $(this).append('<span class="us-copied">copié !</span>');
    $('.us-copied').animate({
      top: Math.random() * $('.us-casting-table').height(),
      opacity: 0
     }, 1500);
  });

})();
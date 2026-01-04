// ==UserScript==
// @name        Netflix : Title copy/paste
// @namespace   netflix-title-copy-paste
// @version     0.2
// @description Permet de récupérer rapidement le titre d'une oeuvre sur Netflix.
// @author      Emilien
// @match       https://www.netflix.com/title/*
// @match       https://www.netflix.com/fr/title/*
// @grant       none
// @icon        https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/391313/Netflix%20%3A%20Title%20copypaste.user.js
// @updateURL https://update.greasyfork.org/scripts/391313/Netflix%20%3A%20Title%20copypaste.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

/* ****************************************
 * CSS
 ******************************************/

injectStyles(`
  .netflix-data-block {
    padding: 8px;
    width: 400px;
    margin-bottom: 20px;
    border-radius: 2px;
    background-color: #509be6;
    color: white;
    font-family: sans-serif;
    font-weight: normal;
    cursor: pointer;
  }

  .netflix-data-block.copied {
    background-color: #ffba4b;
  }
`);

function injectStyles(rule) {
  var div = $("<div />", {
    html: '&shy;<style>' + rule + '</style>'
  }).appendTo("body");
}

/* ****************************************
 * FONCTIONNEMENT DU SCRIPT
 ******************************************/

var interval = setInterval(function()
{

  // Si le block Title est déjà affiché on coupe la boucle
  if($('.netflix-data-block').is(':visible') || $('.titlte-title').is(':visible')) {
    console.log('Netflix userscript stopped.');
    clearInterval(interval);
    return;
  } else {

    var title;

    // mode connecté
    title = $('.title img').attr('alt');
    $('.jawbone-title-link').before(`<div class="netflix-data-block">${title}</div>`);

    // mode déconnecté
    title = $('.title-title').html();
    $('.title-title').before(`<div class="netflix-data-block">${title}</div>`);
    $('.title-title').remove();

  }

}, 200);

$(document).ready(function()
{
    // Gestion du clic sur les ID des épisodes
    $(document).on('click', '.netflix-data-block', function () {
      copy($(this).html());
      $(this).addClass('copied');
    });

});

  function copy(str) {
    let temp = $('<input>');
    $('body').append(temp);
    temp.val(str);
    temp.select();
    document.execCommand('copy');
    temp.remove();
  }
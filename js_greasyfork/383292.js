// ==UserScript==
// @name        SensCritique : Episodes+
// @namespace   sc-eps-id
// @version     0.5.2
// @description Afficher les ids des épisodes sur la page des listes des épisodes et d'autres aides.
// @author      Emilien
// @match       https://www.senscritique.com/serie/*
// @match       http://www.senscritique.com/serie/*
// @grant       none
// @icon        https://www.senscritique.com/favicon-32x32.png
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/383292/SensCritique%20%3A%20Episodes%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/383292/SensCritique%20%3A%20Episodes%2B.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

/* ****************************************
 * CSS
 ******************************************/

injectStyles(`
  .us-episode-id,.us-season-id {
    background: #509be6;
    padding: 4px 6px;
    position: absolute;
    margin: 0 0 0 80px;
    border-radius: 2px;
    font-size: 13px;
    color: white;
    z-index: 1;
  }

  .us-season-id {
    margin: -40px 0 0 -90px;
    padding: 6px 12px;
  }

  .us-season-id::selection {
    background-color: #ffea4c;
    color: black;
  }

  .us-season-id.red {
    background-color: #ff5b5e;
  }

  .us-season-id.red:after {
    border-left-color: #ff5b5e;
  }

  .us-episode-id:after,.us-season-id:after {
    left: 100%;
    top: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(255, 186, 75, 0);
    border-left-color: #509be6;
    border-width: 6px;
    margin-top: -6px;
  }

  .us-episode-id.no-figure {
    margin-left: 0;
  }

  .us-episode-id.clicked {
    background: #ffba4b;
  }

  .us-episode-id.clicked:after {
    border-color: rgba(255, 186, 75, 0);
    border-left-color: #ffba4b;
  }

  .us-count-msg {
    display: block-inline;
    margin: 50px 0 -50px 0;
    padding: 12px;
    border-radius: 4px;
    color: white;
    font-weight: bold;
    font-size: 16px;
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

setInterval(function()
{

  // Si les ID sont déjà affichés, on coupe la boucle de mise à jour
  if($('.us-episode-id').is(':visible')) {
    return;
  } else {

    // Affichage du message
    if($(".eps-count-warning").length == 0) {
      $('[data-rel="season-item"]').before(`<div class="us-count-msg" style="display: none;">Chargement...</div>`);
    }

    // Affichage de l'id des épisodes
    $('.pse-episode').each(function() {
        var isAnime = $(this).find('figure').length === 0 ? true : false ;

        if(isAnime) {
            $(this).prepend(`<span class="us-episode-id arrow_box no-figure">${$(this).attr('data-sc-episode-id')}</span>`);
            $('.pse-episode-number').css('margin-left', '80px');
            $('.pse-episode-title').css('width', 'calc(100% - 165px)');
        } else {
            $(this).prepend(`<span class="us-episode-id arrow_box">${$(this).attr('data-sc-episode-id')}</span>`);
        }
    });

    // Vérification du bon ordre des épisodes
    if($("[data-rel='episode-item']").is(':visible')) {
      var lastEpisodeNumber = $("[data-rel='episode-item']:last").attr('data-sc-episode-number');
      var fistEpisodeNumber = $("[data-rel='episode-item']:first").attr('data-sc-episode-number');
      var i = (fistEpisodeNumber - 1);

      $("[data-rel='episode-item']").each(function() {
        var currentNumber = $(this).attr("data-sc-episode-number");
        i++;

        if(currentNumber == i) {
          $(this).css('border-left', '4px solid #00c750');
        } else {
          $(this).css('border-left', '4px solid #ff5b5e');
        }
      });

      // Gestion du message d'avertissement
      var message = {};

      if(lastEpisodeNumber == i) {
        message = { color: '#00c750', content: `✔️ Tout va bien avec les épisodes de cette saison` };
      } else if(lastEpisodeNumber > i) {

        // Gestion des épisodes manquants
        var missing = (lastEpisodeNumber - i);

        if(missing == 1) {
          message = { color: '#ff5b5e', content: `⚠️ 1 épisode manquant détecté` };
        } else {
          message = { color: '#ff5b5e', content: `⚠️ ${missing} épisodes manquants détectés` };
        }

      } else {

        // Gestion des doublons
        var numberEpisodes = $("[data-rel='episode-item']").length;
        var dupes = (numberEpisodes - lastEpisodeNumber);

        if(dupes == 1) {
          message = { color: '#ff5b5e', content: `⚠️ 1 épisode en double détecté` };
        } else {
          message = { color: '#ff5b5e', content: `⚠️ ${dupes} épisodes en double détectés` };
        }

      }

      $(".us-count-msg").css('background-color', message.color).html(message.content).show();

    }

  }

}, 500);

$(document).ready(function()
{
    // Gestion du clic sur les ID des épisodes
    $(document).on('click', '.us-episode-id', function () {
      $('.us-episode-id').removeClass('clicked');
       $(this).toggleClass('clicked');
    });

    // Affichage des ID des saisons
    var previousSeasonNumber = 0;

    $('.pse-season-item').each(function() {
      var currentSeasonNumber = $(this).attr('data-sc-season-number');
      var color = parseInt(currentSeasonNumber) === parseInt(previousSeasonNumber) ? 'red' : '';
      $(this).after(`<span class="us-season-id arrow_box ${color}">${$(this).attr('data-sc-season-id')}</span>`);
      previousSeasonNumber = $(this).attr('data-sc-season-number');
    });

});
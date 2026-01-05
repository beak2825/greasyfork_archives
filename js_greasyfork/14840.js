// ==UserScript==
// @name         Steamgifts GA creator
// @namespace    http://akhanubis.com/
// @version      0.1.2
// @description  Allows creation of multiple GAs at the same time
// @author       Pablo Bianciotto
// @match        http://www.steamgifts.com/giveaways/new
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14840/Steamgifts%20GA%20creator.user.js
// @updateURL https://update.greasyfork.org/scripts/14840/Steamgifts%20GA%20creator.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var form = $('.form__submit-button.js__submit-form').closest('form');
if ($('input[name="next_step"][value="2"]').length) console.log("Steamgifts GA creator initializing"); else return;
    
if (!form.find('#games_textarea').length) {
  var not_found = [];
  var game;
  var games = [];
  var next = function(last_not_found) {
    if (last_not_found) not_found.push(game.name)
    game = games.shift();
    if (game) {
      if (game.gift) {
        form.find('[data-checkbox-value="gift"]').click();
        form.find('input[name="copies"]').val(game.gift);
      }
      else {
        form.find('[data-checkbox-value="key"]').click();
        form.find('textarea[name="key_string"]').val(game.key).trigger('keyup');
      }
      form.find('.js__autocomplete-name').val(game.name).trigger('keyup');
    }
    else {
      if (not_found.length) alert("Games not found: " + not_found); else alert('All games found');
    }
  };
  var reverse_regex = function() {
    return form.find('#reverse_regex').hasClass('is-selected');
  };
  var grouped_games = function() {
    return form.find('#group_games').hasClass('is-selected');
  };
  var group_games = function() {
    var grouped = {};
    $.each(games, function(i, e) {
      var group_key = e.name + '__' + e.gift;
      if (grouped[group_key]) {
        grouped[group_key].key = grouped[group_key].key.concat("\n" + e.key);
        grouped[group_key].gift += e.gift;
      }
      else grouped[group_key] = e;
    });
    games = $.map(grouped, function(o) { return o; });
  };

  $(document).on('ajaxSuccess.batch', function(e, xhr, settings) {
    if (settings.data.match(/do\=autocomplete_game/)) {
      var result = JSON.parse(xhr.responseText).html.match('<div data-autocomplete-id=\"(\\d+)\" data-autocomplete-name=\"' + game.name + '\"');
      if (result) {  
        form.find('.js__autocomplete-id').val(result[1]);
        form[0].submit();
        next();
      }
      else next(true);
    }
  });

  form.attr('target', '_blank');
  form.find('.form__rows').prepend('\
  <div class="form__row">\
    <div class="form__heading">\
      <div class="form__heading__number">0.</div>\
      <div class="form__heading__text">Games</div>\
    </div>\
    <div class="form__row__indent">\
      <div class="form__input-description">\
        1 game per line. Example:\
        <br/>\
        QWERT-ASDFG-YUIOP Fallout 4\
        <br/>\
        ZXCVB-MNBVC-YUIOP Fallout 3\
        <br/>\
        GIFT Fallout: New Vegas\
      </div>\
      <textarea value="" id="games_textarea" />\
      <div id="group_games" class="form__checkbox ">\
        <i class="form__checkbox__default fa fa-circle-o"></i>\
        <i class="form__checkbox__hover fa fa-circle"></i>\
        <i class="form__checkbox__selected fa fa-check-circle"></i>\
        Group GAs for same game\
      </div>\
      <div id="reverse_regex" class="form__checkbox ">\
        <i class="form__checkbox__default fa fa-circle-o"></i>\
        <i class="form__checkbox__hover fa fa-circle"></i>\
        <i class="form__checkbox__selected fa fa-check-circle"></i>\
        %GAME% %KEY% if checked, %KEY% %GAME% if unchecked\
      </div>\
      <div class="form__submit-button" id="load_games">\
        <i class="fa fa-arrow-circle-right"></i>\
        Load games\
      </div>\
    </div>\
  </div>');

  form.find('#group_games, #reverse_regex').on('click', function() {
    $(this).toggleClass('is-selected');
  });
  form.find('#load_games').on('click', function(e) {
    e.preventDefault();
    not_found = [];
    games = $.map(form.find('#games_textarea').val().split("\n"), function(line) {
      var result, o;
      line = line.trim();
      if (reverse_regex()) {
        result = line.match(/^(.+)\s+(\S+)$/);
        o = { name: result[1], key: result[2] };
      }
      else {
        result = line.match(/^(\S+)\s+(.+)$/);
        o = { name: result[2], key: result[1] };
      }
      return $.extend(o, { gift: (o.key.match(/^GIFT$/i)) ? 1 : 0 });
    });
    if (grouped_games()) group_games();
    next();
  });
  console.log("Steamgifts GA creator initialized");
}
// ==UserScript==
// @name        MillitaryMovementsSpliter
// @namespace   MillitaryMovementsSpliter
// @description Dzieli ruchy wojsk na wygodne zakładki
// @include     http://*.ikariam.gameforge.com*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24821/MillitaryMovementsSpliter.user.js
// @updateURL https://update.greasyfork.org/scripts/24821/MillitaryMovementsSpliter.meta.js
// ==/UserScript==


$(function(){
  var init = function () {
    var selectMovementType  = '<div class="content" id="MillitaryMovementsSpliter">' +
                              '<div class="filter military-movements">' +
                              '<span class="filterEntry active">' +
                              '<a href="#" id="MillitaryMovementsSpliter1" title="Wszystkie wojska" onclick="localStorage.setItem(\'MillitaryMovementsSpliter\', \'1\'); $(this).closest(\'.filter\').find(\'.active\').removeClass(\'active\');$(this).closest(\'.filterEntry\').addClass(\'active\');$(\'#js_MilitaryMovementsFleetMovementsTable .military_event_table:visible\').find(\'tr\').each(function(){$(this).show();});return false;">' +
                              '<span class="filterEntryButton">' +
                              '<span style="display: block;margin-top: 6px;margin-left: 10px;" class="name short_text150">Wszystkie wojska</span>' +
                              '</span>' +
                              '</a>' +
                              '</span>' +
                              '<span class="filterEntry">' +
                              '<a href="#" id="MillitaryMovementsSpliter2" title="Własne wojska" onclick="localStorage.setItem(\'MillitaryMovementsSpliter\', \'2\'); $(this).closest(\'.filter\').find(\'.active\').removeClass(\'active\');$(this).closest(\'.filterEntry\').addClass(\'active\');$(\'#js_MilitaryMovementsFleetMovementsTable .military_event_table:visible\').find(\'tr\').each(function(){$(this).show(); if ($(this).is(\':not(.own)\') && $(this).index() > 0) $(this).hide();});return false;">' +
                              '<span class="filterEntryButton">' +
                              '<span style="display: block;margin-top: 6px;margin-left: 10px;" class="name short_text150">Własne wojska</span>' +
                              '</span>' +
                              '</a>' +
                              '</span>' +
                              '<span class="filterEntry">' +
                              '<a href="#" id="MillitaryMovementsSpliter3" title="Sprzymierzone wojska" onclick="localStorage.setItem(\'MillitaryMovementsSpliter\', \'3\'); $(this).closest(\'.filter\').find(\'.active\').removeClass(\'active\');$(this).closest(\'.filterEntry\').addClass(\'active\');$(\'#js_MilitaryMovementsFleetMovementsTable .military_event_table:visible\').find(\'tr\').each(function(){$(this).show(); if ($(this).is(\':not(.ally)\') && $(this).index() > 0) $(this).hide();});return false;">' +
                              '<span class="filterEntryButton">' +
                              '<span style="display: block;margin-top: 6px;margin-left: 10px;" class="name short_text150">Sprzymierzone wojska</span>' +
                              '</span>' +
                              '</a>' +
                              '</span>' +
                              '<span class="filterEntry">' +
                              '<a href="#" id="MillitaryMovementsSpliter4" title="Wrogie wojska" onclick="localStorage.setItem(\'MillitaryMovementsSpliter\', \'4\'); $(this).closest(\'.filter\').find(\'.active\').removeClass(\'active\');$(this).closest(\'.filterEntry\').addClass(\'active\');$(\'#js_MilitaryMovementsFleetMovementsTable .military_event_table:visible\').find(\'tr\').each(function(){$(this).show(); if ($(this).is(\':not(.hostile)\') && $(this).index() > 0) $(this).hide();});return false;">' +
                              '<span class="filterEntryButton">' +
                              '<span style="display: block;margin-top: 6px;margin-left: 10px;" class="name short_text150">Wrogie wojska</span>' +
                              '</span>' +
                              '</a>' +
                              '</span>' +
                              '</div>' +
                              '</div>';

    $('#js_MilitaryMovementsFleetMovements').find('h3').after(selectMovementType);

    if (localStorage.getItem('MillitaryMovementsSpliter') !== null) {
      $('#MillitaryMovementsSpliter' + localStorage.getItem('MillitaryMovementsSpliter')).trigger('click');
    }
  }

  if ($('#militaryAdvisor').is(':visible')) {
    init();
  }

  $(document).ajaxComplete(function (event, request, settings) {
    if (settings.url.startsWith('?view=militaryAdvisor&') && $('#MillitaryMovementsSpliter').length <= 0) {
      init();
    }
  });
});
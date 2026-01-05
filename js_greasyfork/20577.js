// ==UserScript==
// @name BGG Language dependence on game info panel.
// @namespace tequila_j-script
// @version    1.3.0
// @description  Shows language dependence in BGG gameplay bar.
// @match      http://*.boardgamegeek.com/*
// @match      http://boardgamegeek.com/*
// @match      https://*.boardgamegeek.com/*
// @match      https://boardgamegeek.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant    GM_addStyle
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/20577/BGG%20Language%20dependence%20on%20game%20info%20panel.user.js
// @updateURL https://update.greasyfork.org/scripts/20577/BGG%20Language%20dependence%20on%20game%20info%20panel.meta.js
// ==/UserScript==


//waitForKeyElements ("ul.gameplay", XX);

angular.element(document).ready(function () {

  var gameplayBar = $('ul.gameplay');

  //var featuresBar = $('div.game-description-secondary').find('ul.features > li.feature:first').find(":contains('ADDITIONAL SUGGESTIONS'");
  var featuresBar = $('ul.features').find("div.feature-title:contains('Language Dependence')").parent();
  
  var ldTextNode = angular.copy($(featuresBar).find('.feature-title'));
  
  var ldValueNode = angular.copy($(featuresBar).find('.feature-description'));
  
  var clickEventForwarderDest = $(featuresBar).find('.feature-description').children('span');
  
  var ldButton = ldValueNode.find("button").removeClass("feature-action-icon");
  
  var ldHelp = ldTextNode.find("a").addClass("c-icon fs-xs");
  var ldValue = ldValueNode.find("span:first").text();
    
  var newGamePlayItem = gameplayBar.children('li:first').clone();
  
  ldButton.append(ldTextNode.text());
  ldButton.removeClass().addClass('btn btn-xs btn-link');
  ldButton.children('span').addClass('c-icon hidden-xs');
  
  var ldSubNewContainer = ldValueNode.children('span').first().empty().append(ldButton);
  
  //bind click event to original source (they source is changed)
  ldSubNewContainer.on('click', function() {
	clickEventForwarderDest.trigger('click');
  })  
  
  newGamePlayItem.children('.gameplay-item-primary').empty().text(ldValue);
  newGamePlayItem.children('.gameplay-item-secondary').empty().append(ldSubNewContainer).append(ldHelp);
  
  angular.bootstrap(newGamePlayItem, ['ui.bootstrap']);
  
  gameplayBar.append(newGamePlayItem);


});

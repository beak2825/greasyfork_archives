// ==UserScript==
// @name        TVmaze watchlist collapse/expand
// @namespace   tvmazewatchlistcollapseexpand
// @description By clicking on the show name you can collapse/expand the episodes, remembers the collapsed episodes. (https://greasyfork.org/nl/scripts/39215/)
// @include     https://www.tvmaze.com/watchlist*
// @version     4
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/39215/TVmaze%20watchlist%20collapseexpand.user.js
// @updateURL https://update.greasyfork.org/scripts/39215/TVmaze%20watchlist%20collapseexpand.meta.js
// ==/UserScript==

$ = this.jQuery = jQuery.noConflict(true);

function get_list_class(ep_id) {
	return $(".episode-list[data-show_id='"+ep_id+"']");
}

function update_ls(ep_id, visible) {
  var visible_eps = JSON.parse(localStorage.getItem('visible_eps'));
  visible_eps[ep_id] = visible;
  localStorage.setItem('visible_eps', JSON.stringify(visible_eps));
}

$(document).on('click','a',function(e){
  var regex = /\/shows\/(\d+)\//g;
  var m;
  while ((m = regex.exec($(this).attr('href'))) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    e.preventDefault();

    var ep_id = m[1];
    var episode_div = get_list_class(ep_id);
    episode_div.slideToggle("fast", update_ls(ep_id, !episode_div.is(":visible")));
  }
});

$( document ).ready(function() {
  var visible_eps = JSON.parse(localStorage.getItem('visible_eps'));
  if (visible_eps === null){
    visible_eps = {};
    localStorage.setItem('visible_eps', JSON.stringify(visible_eps));
  }
    
  for(var k in visible_eps){
    if(!visible_eps[k]){
  	  get_list_class(k).toggle();
    }
  }
});
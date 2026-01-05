// ==UserScript==
// @name        Advanced Search - Unemployed Filter
// @namespace   https://github.com/Vinkuun
// @include     *.torn.com/userlist.php?*
// @version     1.0.0
// @description Filters out people working in private companies and only displays those unemployed or working in starter jobs.
// @grant       none
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/13901/Advanced%20Search%20-%20Unemployed%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/13901/Advanced%20Search%20-%20Unemployed%20Filter.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

// filter settings
var exclusions = [27];

// result list container
var list = $('ul.user-info-list-wrap');

// field to show filter status
var statusField = $('<p>').insertAfter(list);

function applyFilter(list) {
  var users = list.find('> li');

  var numOfHiddenUsers = 0;

  users.each(function() {
    var $this = $(this);

    var icons = $this.find('#iconTray');

    var hideUser = false;

    exclusions.forEach(function(id) {
      if (icons.find('#icon' + id).length === 1) {
        hideUser = true;
        return false;
      }
    });


    if (hideUser) {
      $this.hide();
      numOfHiddenUsers++;
    }
  });

  statusField.text('Hidden Users: ' + numOfHiddenUsers);
}

function watchResultList(watchers) {
  new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      console.log(mutation);
      if (mutation.addedNodes.length > 0 && mutation.removedNodes.length === 0) {
        watchers.forEach(function(watcher) {
          watcher(list);
        });
      }
    });
  }).observe(list[0], { childList: true });
}

watchResultList([applyFilter]);
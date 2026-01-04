// ==UserScript==
// @name         Einstein Toolkit Bitbucket - Hide some issue columns
// @namespace    http://www.einsteintoolkit.org
// @version      0.3
// @description  Hides some issue colums
// @author       rhaas80
// @match        https://bitbucket.org/einsteintoolkit/tickets/issues*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391296/Einstein%20Toolkit%20Bitbucket%20-%20Hide%20some%20issue%20columns.user.js
// @updateURL https://update.greasyfork.org/scripts/391296/Einstein%20Toolkit%20Bitbucket%20-%20Hide%20some%20issue%20columns.meta.js
// ==/UserScript==


// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
  var script = document.createElement('script');
  script.setAttribute('src', '//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js');
  script.addEventListener('load', function() {
    var script = document.createElement('script');
    script.textContent = 'window.jQ=jQuery.noConflict(true);(' + callback.toString() + ')();';
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}



// the guts of this userscript
function main() {
    // jQ replaces $ to avoid conflicts.

    ["icon-col", "votes", "user", "milestone", "version", "actions"].forEach(column => {
      jQ("th."+column).css({'display': 'none'});
      jQ("td."+column).css({'display': 'none'});
    });
    // the component button
    jQ("div.issue-list--meta").css({'display': 'none'});
  
    // add a "review" search button
    var url = window.location.href;
    if (url.indexOf('q=Please%20review') == -1) {
      if (url.indexOf('?') > -1){
        url += '&q=Please%20review'
      } else {
        url += '?q=Please%20review'
      }
    }
    var review = document.createElement('li');
    var review_link = document.createElement('a');
    var review_text = document.createTextNode("Review");
    review.setAttribute('id', 'review');
    review_link.setAttribute('href', url);
    review_link.appendChild(review_text);
    review.appendChild(review_link);
    jQ("ul.filter-status")[0].appendChild(review);
}

// load jQuery and execute the main function
addJQuery(main);

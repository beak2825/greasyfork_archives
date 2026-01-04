// ==UserScript==
// @name         Dog tag finder
// @namespace    dog-tag-finder-jej
// @version      0.41
// @description  Marks if users have dog tags
// @author       You
// @match        https://www.torn.com/page.php?sid=UserList*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466419/Dog%20tag%20finder.user.js
// @updateURL https://update.greasyfork.org/scripts/466419/Dog%20tag%20finder.meta.js
// ==/UserScript==

(function() {
    'use strict';
            var key = localStorage.getItem('DTHAPIkey');
 
        async function checkApiKey(apiKey) {
          const apiUrl = `https://api.torn.com/user/?selections=&key=${apiKey}`;
          const response = await fetch(apiUrl);
          const data = await response.json();
          if (data.error && data.error.code === 2) {
            return false; // incorrect key
          } else {
            return true; // correct key
          }
        }
 
        async function getApiKey() {
          while (!await checkApiKey(key)) {
            key = prompt('API key (any access level):');
            localStorage.setItem('DTHAPIkey', key);
          }
          console.log('API key is valid:', key);
        }
 
        getApiKey();

    const clear = setInterval(function () {
  if ( $('.userlist-wrapper a[href*="/profiles.php?XID="]').length) {
    clearInterval(clear);
    $('.userlist-wrapper a[href*="/profiles.php?XID="]').each(function () {
      var xid = $(this).attr('href').match(/XID=(\d+)/)[1];
      var parentElement = $(this).parent().parent();
      var iconTray = parentElement.find('#iconTray:not(.singleicon)');
      var svgClass = 'default___XXAGt';
      var svgPath = 'M3.36,3.36a1.48,1.48,0,1,1,0,2.1A1.48,1.48,0,0,1,3.36,3.36ZM7.24.88A3,3,0,0,0,3,.88L.88,3a3,3,0,0,0,0,4.24L8,14.31a3,3,0,0,0,4.24,0l2.12-2.12a3,3,0,0,0,0-4.24Z';

      $.getJSON('https://api.torn.com/user/' + xid + '?selections=&key='+key, function (data) {
        console.log(data.name + ': ' + (data.competition.score > 0 ? 'Has tags' : 'No tags'));

        if (data.competition.score > 0) {
          var svg1 = $('<li><svg xmlns="http://www.w3.org/2000/svg" class="' + svgClass + '" filter="url(#defaultFilter)" fill="url(#sidebar_svg_gradient_regular_desktop_green)" stroke="transparent" stroke-width="0" width="15.19" height="15.19" viewBox="0 .5 16 16"><path d="' + svgPath + '"></path></svg></li>');
          iconTray.append(svg1);
          //console.log(iconTray);
        } else {
          var svg2 = $('<li><svg xmlns="http://www.w3.org/2000/svg" class="' + svgClass + '" filter="" fill="" stroke="transparent" stroke-width="0" width="15.19" height="15.19" viewBox="0 .5 16 16"><path d="' + svgPath + '"></path></svg></li>');
          iconTray.append(svg2);
          //console.log(iconTray);
        }
      }.bind(this)); // bind the current element to preserve its context
    });
  }
}, 100);

})();
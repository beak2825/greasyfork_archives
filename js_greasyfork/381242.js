
// ==UserScript==
// @name        Mewe Comments Remover
// @description Mewe Comments Remover clears all comments of the Mewe to see the posts only.
// @include     https://mewe.com/myworld
// @version     0
// @grant       none
// @noframes
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @homepageURL https://mewe.com/i/sajad
// @icon https://mewe.com/home/favicon.ico

// @namespace https://greasyfork.org/users/288046
// @downloadURL https://update.greasyfork.org/scripts/381242/Mewe%20Comments%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/381242/Mewe%20Comments%20Remover.meta.js
// ==/UserScript==


setInterval(function()
  {
  	remover(); 
  }, 100);


function remover()
  {
	$('.comments-table_wrapper').remove();
    //console.log("running");
  }
// ==UserScript==
// @name     				Wykop Infinite Scroll
// @description             Infinite Scroll implementation for wykop.pl
// @version  				1.3
// @match          	*://www.wykop.pl/
// @match          	*://www.wykop.pl/hity/
// @match          	*://www.wykop.pl/mikroblog/
// @match          	*://www.wykop.pl/wykopalisko/
// @require 				https://unpkg.com/infinite-scroll@3/dist/infinite-scroll.pkgd.js
// @grant    				none
// @namespace https://greasyfork.org/users/428115
// @downloadURL https://update.greasyfork.org/scripts/394156/Wykop%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/394156/Wykop%20Infinite%20Scroll.meta.js
// ==/UserScript==

(function(){ 
  var infiniteScroll = new InfiniteScroll( '#itemsStream', {
    path: '.pager p :last-child',
    append: '.iC',
	});
  
  // load lazy loaded images
  infiniteScroll.on('append', function(event, path, items) {
		for (var i=0; i<items.length; i++) {
    	var images = items[i].getElementsByClassName("lazy");
      for (var j=0; j<images.length; j++) {
        images[j].setAttribute("src", images[j].getAttribute("data-original"));
      }
    }
  });
})();
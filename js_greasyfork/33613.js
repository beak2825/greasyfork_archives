// ==UserScript==
// @name         Pokazuj śmieszne obrazki automatycznie
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Naprawia mirko i wyświetla śmieszne obrazki automatycznie a nie po kliknięciu
// @author       hakeryk2
// @match        https://www.wykop.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33613/Pokazuj%20%C5%9Bmieszne%20obrazki%20automatycznie.user.js
// @updateURL https://update.greasyfork.org/scripts/33613/Pokazuj%20%C5%9Bmieszne%20obrazki%20automatycznie.meta.js
// ==/UserScript==


(function() {
	function showFunnyImages() {
		var links = $('.media-content.hide-image > a');
		$.each(links, function(){
			$(this).click();
		});
       
	}
    if ( window.location.href.indexOf("https://www.wykop.pl/ludzie") > -1 || window.location.href.indexOf("https://www.wykop.pl/mikroblog") > -1) {
        console.log('Powinno działać');
        showFunnyImages();
        $('.more > a').click(function(){
            showFunnyImages();
        });
    }

})();
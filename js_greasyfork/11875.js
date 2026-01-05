// ==UserScript==
// @name         add install button & default sort by updated | Greasy Fork
// @namespace    http://your.homepage/
// @version      0.3
// @description  enter something useful
// @author       You
// @match        https://greasyfork.org/en/users/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/11875/add%20install%20button%20%20default%20sort%20by%20updated%20%7C%20Greasy%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/11875/add%20install%20button%20%20default%20sort%20by%20updated%20%7C%20Greasy%20Fork.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function(){
	// add install button
	$('h2 a').each(function(){
		$(this).before($('<a class="install-link" style="margin-right:.5em;">').text('install').attr('href', $(this).attr('href').replace('/en/scripts/','/scripts/')+'/code/'+encodeURI($(this).text())+'.user.js'));
	});
	// default sort by upadted
    if(location.href.indexOf('?') < 0 && location.href.match(/\/users\/[0-9]+-.+/g)){
        location.href += '?sort=updated'
    }
    
    $($('a[href^="/en/users/"]')).each(function(key, el){
        if($(el).attr('href') && $(el).attr('href').indexOf('?') < 0 && $(el).attr('href').match(/\/users\/[0-9]+-.+/g)){
            $(el).attr('href', $(el).attr('href')+'?sort=updated');
            console.log($(el));
        }
    });

    if(location.href === 'https://greasyfork.org/en' || location.href === 'http://greasyfork.org/en'){
    	setTimeout(function(){
    		$('.user-profile-link a')[0].onclick();
    	}, 100);
    }
});
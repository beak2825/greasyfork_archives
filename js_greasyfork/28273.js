// ==UserScript==
// @name		        Jobbörse
// @name:de		        Jobbörse
// @version		        0.3
// @description		    Die Felder für die Suche automatisch ausfüllen
// @description:de	    Die Felder für die Suche automatisch ausfüllen
// @author		        Christian Plugge
// @match		        http://jobboerse.arbeitsagentur.de/vamJB/startseite.html*
// @run-at		        document-end
// @require		        https://greasyfork.org/scripts/28186-element-constructor/code/Element%20constructor.js?version=181746
// @require             https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @namespace http://jobboerse.arbeitsagentur.de/vamJB/startseite.html
// @downloadURL https://update.greasyfork.org/scripts/28273/Jobb%C3%B6rse.user.js
// @updateURL https://update.greasyfork.org/scripts/28273/Jobb%C3%B6rse.meta.js
// ==/UserScript==

document.getElementById('siesuchen').value = 4;
document.getElementById('suchbegriffe').value = 'Fachinformatiker/in - Anwendungsentwicklung';
document.getElementById('arbeitsort').value = 'Lingenfeld';
document.getElementById('suchen').dispatchEvent(new MouseEvent('click'));
setTimeout(function(){document.getElementsByClassName('sortierfunktion')[1].querySelectorAll('a')[1].dispatchEvent(new MouseEvent('click'))}, 1000)
if(!(location.search.split('&').includes('s=2') || location.search.split('&').includes('?s=2') && location.search.split('&').includes('z=50') || location.search.split('&').includes('?z=50'))){
	location = location + '&s=2&z=50';
}

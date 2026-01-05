// ==UserScript==
// @name        	DC Forum - Filtre Derniers Sujets
// @namespace   	DreadCast
// @include     	http://www.dreadcast.net/Forum*
// @grant       	none
// @author 			Ianouf
// @date 			20/07/2014
// @version 		0.1
// @description 	Filtrer les derniers sujets sur le Forum
// @compat 			Firefox, Chrome
// @require      	http://code.jquery.com/jquery-1.10.2.min.js
// @downloadURL https://update.greasyfork.org/scripts/3450/DC%20Forum%20-%20Filtre%20Derniers%20Sujets.user.js
// @updateURL https://update.greasyfork.org/scripts/3450/DC%20Forum%20-%20Filtre%20Derniers%20Sujets.meta.js
// ==/UserScript==

jQuery.noConflict();

function filtreRecents(){
    //var afiltrerRecent =['691', '21475'];
    var afiltrerRecent =['691'];
    //http://www.dreadcast.net/Forum/2-691-ami-du-flood-
    jQuery('#list_derniers_sujets ul li').each(function(  ) {
       li = jQuery(this);
       lien = li.children('a').eq(0).attr('href');
       idLien = lien.split('/');
       idLien = idLien[idLien.length-1];
       idLien = idLien.split('-');
       idLien = idLien[1];
       if(afiltrerRecent.indexOf(idLien) >= 0){
			li.remove();
		}
	});
}

jQuery(document).ready(function() {
	filtreRecents();
});
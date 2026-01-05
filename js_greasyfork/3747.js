// ==UserScript==
// @name        itasa-torrentz-search
// @description myitasa search button on torrentz.eu
// @include     http://www.italiansubs.net/*option=com_myitasa*
// @grant       none
// @version     0.0.8
// @namespace https://greasyfork.org/users/3779
// @downloadURL https://update.greasyfork.org/scripts/3747/itasa-torrentz-search.user.js
// @updateURL https://update.greasyfork.org/scripts/3747/itasa-torrentz-search.meta.js
// ==/UserScript==

function createButtons(text){
        
    var search = text.replace(/(\d\d)x(\d\d)/,'S$1E$2').replace(/(\d)x(\d\d)/,'S0$1E$2');
    search += ' WEB-DL';
    search = encodeURIComponent(search);
    
    var buttonTz = $('<a href="http://torrentz.eu/search?f='+search+'" target="_blank"><button type="button"><img width="16" height="16" src="http://torrentz.eu/favicon.ico" alt="Tz"></button></a>');
    
    var buttonII = $('<a href="http://2ddl.one/?s='+search+'" target="_blank"><button type="button"><img width="16" height="16" src="http://2ddl.one/wp-content/themes/p2pScene-latest/favicon.ico" alt="II"></button></a>');
    
    var buttonRarBG = $('<a href="https://rarbg.com/torrents.php?search='+search+'" target="_blank"><button type="button"><img width="16" height="16" src="https://rarbg.com/favicon.png" alt="RarBG"></button></a>');
    
    return [ buttonTz,buttonII,buttonRarBG ];
}

$('[id$="sub2"]').each(function(){ 
    var text = $('a',this).attr('title');
	var buttons = createButtons(text) 
	console.log(buttons);
	for(var b in buttons)
   $('span:first',this).after(buttons[b]);
});

$('.moduletable:contains("myITASA Live") tr').each(function(){
    var $a = $('a',this);
    var text = $a.text();
	var buttons = createButtons(text) 
	for(var b in buttons){
    $a.append(buttons[b]);
  }
});
// ==UserScript==
// @name        	NextInpact - Filtrage de commentaires
// @namespace   	http://www.nextinpact.com/news/gmscripts
// @version     	0.1.8
// @description 	Masquer certains commentaires qui n'en sont pas
// @author      	Myself, I and Me aka Csinben
// @match       	https://www.nextinpact.com/blog/*
// @match       	https://www.nextinpact.com/news/*
// @match       	https://nextinpact.com/news/*
// @match       	http://www.nextinpact.com/blog/*
// @match       	http://www.nextinpact.com/news/*
// @match       	http://nextinpact.com/news/*
// @noframes
// @require  			http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  			https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/387259/NextInpact%20-%20Filtrage%20de%20commentaires.user.js
// @updateURL https://update.greasyfork.org/scripts/387259/NextInpact%20-%20Filtrage%20de%20commentaires.meta.js
// ==/UserScript==
/*- The @grant GM_addStyle directive is said needed to work around
    a major design change introduced in GM 1.0. Well...
    It restores the legacy sandbox, but it also works without... ?
    optional @require https://gist.githubusercontent.com/arantius/3123124/raw/grant-none-shim.js
    other    @require https://gist.github.com/raw/2625891/waitForKeyElements.js
    other    @require https://gist.githubusercontent.com/kepkin/ff99090c410ab1b5c8fa/raw/a1e229b38cb6eb169556ae9b5e751e5c81d59929/waitForKeyElements.js
*/
(function() {
  
  if (window.top != window.self) return;  // don't run on frames or iframes
  this.$ = this.jQuery = jQuery.noConflict(true);
  var no_once = false;
  
  // Tableau obligatoire, pas d'élément vide "" autorisé !
  var filtrage = [  "/dirtytinders.", "/tindersex.",
                    "Mes photos et contacts sexy sont icihttp://yon.",
                    "venez jouer avec moi icihttps://llk.",
                    "Mes photos sexy et contacts ici:https://tiny.",
                    "/datinghookupmeet."
                 ];

  var Script = function (block, hidden, visible) {
    // https://greasyfork.org/fr/scripts/369689-forum-ws-masquer-les-messages-et-citations/code
    block.addEventListener("mouseover", function() {
      visible.style.display = "none";
      hidden.style.display = "inline";
    }, false);
    block.addEventListener("mouseout", function() {
      hidden.style.display = "none";
      visible.style.display = "inline";
    }, false);
    return true;
  };

  var Modifier = function (m_node) {
    
    var m_filt = document.createElement("DIV");
    m_filt.innerHTML = "<ul><li><b>Ce commentaire a été filtré </b><i> ( passez la souris pour voir le message )</i></li></ul>";
    m_filt.style.display = "inline";
    m_filt.style.padding = "2px 2px 2px"; // FIXME: hack the CSS style
    m_filt.style.position = "relative";   // '.content_post' instead !

    m_node.style.display = 'none';
   	m_node.insertAdjacentElement("beforebegin", m_filt);

    return Script (m_node.parentNode, m_node, m_filt);
  };

  var Filtrer = function () {
    
    if (no_once) // 'coz it runs too fast :(
      	return;
    no_once = true;
    
    var message = document.getElementsByClassName('content_post');
    for (var i = 0; i < message.length; i++)
    {
      var ctext = message[i].getElementsByClassName('text_comment')[0];
      if (ctext)
        for (var j = 0; j < filtrage.length; j++)
          if (ctext.innerText.indexOf(filtrage[j]) >= 0)
            Modifier (message[i]);
    }
    // https://stackoverflow.com/questions/15249703/how-to-run-a-greasemonkey-script-only-once
    Filtrer = function () { return true; };
    return true;
  };
  
  var LocalMain = function () {
		
    // https://stackoverflow.com/questions/12897446/userscript-to-wait-for-page-to-load-before-executing-code-techniques
    waitForKeyElements("div.content_post", Filtrer, true);
  };
  
  // https://stackoverflow.com/questions/4190442/run-a-greasemonkey-script-only-once-per-page-load
  window.addEventListener ("load", LocalMain, false);

})();
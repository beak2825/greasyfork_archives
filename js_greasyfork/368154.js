// ==UserScript==
// @name           StartPage Beautifier
// @namespace      https://framagit.org/SecT0uch/StartPage-Beautifier
// @description    This greasemonkey UserScript helps the user to focus on the revelant information in the result page. It basically put the search terms in bold.
// @version        1.9
// @author         SecT0uch <pro.ernst@gmail.com>
// @homepageURL    https://framagit.org/SecT0uch/StartPage-Beautifier
// @license        CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/
// @copyright      2018+, Jordan ERNST (https://framagit.org/SecT0uch/StartPage-Beautifier)
// @match          https://*.startpage.com/*/*search*
// @downloadURL https://update.greasyfork.org/scripts/368154/StartPage%20Beautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/368154/StartPage%20Beautifier.meta.js
// ==/UserScript==

window.addEventListener ("load", Greasemonkey_main, false);

function Greasemonkey_main () {
    var toClean = ['title:', 'host:', 'url:', 'link:', ' OR', '"'];     // Special chars to exclude from being bolded
    var query = document.getElementById("q").value;             // Search request

    for (var x = 0; x < toClean.length; x++) {
        query = query.replace(new RegExp(toClean[x], 'g'), '');         // Removing special chars from request
    }

    var searchTerms = query.split(' ');                                 // Splitting request string in array
    var searchTerms = searchTerms.filter(String);                       // Remove empty values (fix begin/end/double white spaces)

    var results =  document.querySelectorAll("p.w-gl__description");             // Description text (under link)
    
    if (results.length === 0) {                                                  // Fix for an other source HTML
        var results =  document.querySelectorAll("span");                            // Description text (under link)
    }

    // We bold every term in every description :
    for (var i = 0; i < results.length; i++) {
        for (var j = 0; j < searchTerms.length; j++) {
            var term = searchTerms[j];
  	        results[i].innerHTML = results[i].innerHTML.replace(new RegExp(term, 'gi'), "<strong>$&</strong>");    // $& = matched value.   <b></b> not supported
        }
    }
}

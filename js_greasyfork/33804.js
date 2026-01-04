// ==UserScript==
// @name         Erin Homepage - Billy
// @namespace    EPS Developments
// @version      0.1
// @description  Customize Erin Homepage
// @author       EPS Developments
// @match        http://intranet.indot.state.in.us/
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33804/Erin%20Homepage%20-%20Billy.user.js
// @updateURL https://update.greasyfork.org/scripts/33804/Erin%20Homepage%20-%20Billy.meta.js
// ==/UserScript==

(function() {
    'use strict';

var timer = setTimeout(function(){

       	if ('#ERIN_column3') {
			console.log("#ERIN_column3 was found, continuing code execution");

			var popularApps = $( '#ERIN_column2 > ul:nth-child(1) li' );

           // var gathered = popularApps[2].add(popularApps[3]).add(popularApps[5]).add(popularApps[6]);
            popularApps[2].remove();
            popularApps[3].remove();
            popularApps[5].remove();
            popularApps[6].remove();


            $( '#ERIN_column2 > ul:nth-child(1)' ).first()
				.append( '<li><a href="https://spms.indot.in.gov/uta/Dashboard/Search#" target="_blank">UTA</a></li>' )
				.append( '<li><a href="https://spms.indot.in.gov/rra/Dashboard/Search#" target="_blank">RRA</a></li>' )
                .append( '<li><a href="http://intranet.indot.state.in.us/redirects/pscscontract.asp" target="_blank">PSCS (Contract Admin)</a></li>' )
                .append( '<li><a href="http://intranet.indot.state.in.us/redirects/pco.asp" target="_blank">Project Close Out (PCO)</a></li>' );


            // Add style
           // GM_addStyle('li.strong {font-weight: bold}');

		}
        else {
			console.log("Page not set, calling timer() again!");
		    timer();
		}

   }, 100);


})();
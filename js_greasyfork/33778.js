// ==UserScript==
// @name         Erin Homepage
// @namespace    EPS Developments
// @version      0.3
// @description  Customize Erin Homepage
// @author       EPS Developments
// @match        http://intranet.indot.state.in.us/
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33778/Erin%20Homepage.user.js
// @updateURL https://update.greasyfork.org/scripts/33778/Erin%20Homepage.meta.js
// ==/UserScript==

(function() {
    'use strict';



    var timer = setTimeout(function(){

        var contentBoxes = $("#ERIN_column2 > ul");

       	if ( contentBoxes ) {

            // Remove links that are unused.
            var popularApps = $( 'li', contentBoxes[0] );

            popularApps[2].remove();
            popularApps[3].remove();
            popularApps[5].remove();

            // Add some useful links.
			popularApps.parent()
                .append( '<li><a href="https://spms.indot.in.gov/uta/Dashboard/Search#" target="_blank">UTA</a></li>' )
				.append( '<li><a href="https://spms.indot.in.gov/rra/Dashboard/Search#" target="_blank">RRA</a></li>' )
                .append( '<li><a href="http://intranet.indot.state.in.us/redirects/pscscontract.asp" target="_blank">PSCS (Contract Admin)</a></li>' )
                .append( '<li><a href="http://intranet.indot.state.in.us/redirects/pco.asp" target="_blank">PCO</a></li>' );

            // Add style
           // GM_addStyle('li.strong {font-weight: bold}');

            // Under "Employee Resources", change link to Time & Labor.  Rename to "Timesheet" and change href to the timesheet.
             $( "li:eq(0) > a", contentBoxes[2] )
                .attr( 'href', "https://hr.gmis.in.gov/psp/hrprd/EMPLOYEE/HRMS/c/ROLE_EMPLOYEE.TL_MSS_EE_SRCH_PRD.GBL?FolderPath=PORTAL_ROOT_OBJECT.CO_EMPLOYEE_SELF_SERVICE.HC_TIME_REPORTING.HC_RECORD_TIME.HC_TL_SS_JOB_SRCH_EE_GBL&IsFolder=false&IgnoreParamTempl=FolderPath%2cIsFolder" )
                .text("Timesheet");

            // Add link to Utility Coordination webpage.
            $( "li:eq(0)", contentBoxes[2] ).parent().prepend( '<li><a href="http://www.in.gov/indot/2389.htm">Utility Coordination</a></li>' );

            // Change some style elements
            $('body').css({ "background-image" : "url(http://www.kinyu-z.net/data/wallpapers/213/1449050.jpg)" });
            $("#content > tbody").css('background-color', 'white');

            // Remove some visual elements
            $("#content > tbody > tr:nth-child(3) > td > div").remove();
            $("body > table.footer").remove();
            $("body > table:nth-child(1)").remove();

            // Add a wrappper so we can center content on page.
            $("body").prepend("<div id='contentWrapper'><p>&nbsp;</p></div>");

            $("#conentWrapper").css( {  height : "100px" } );


		}
        else {
			console.log("Page not set, calling timer() again!");
		    timer();
		}

   }, 100);


})();
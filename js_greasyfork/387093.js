// ==UserScript==
// @name         SuccessFactors Org Chart Salary Lookup
// @namespace    https://greasyfork.org/en/users/119330-edward-sluder
// @version      0.1
// @description  Use AJAX to load in salaries of employees.
// @author       EPS Developments
// @match        https://performancemanager8.successfactors.com/sf/orgchart*
// @require      https://code.jquery.com/jquery-2.2.3.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/387093/SuccessFactors%20Org%20Chart%20Salary%20Lookup.user.js
// @updateURL https://update.greasyfork.org/scripts/387093/SuccessFactors%20Org%20Chart%20Salary%20Lookup.meta.js
// ==/UserScript==

(function() {
    'use strict';



    /*/////////////////////////////////////////////////////////////////////////
    ////////////////////////  Functions  ////////////////////////////////////*/



    function getSalary( that, firstName, lastName ) {

        let url = "http://www.in.gov/apps/gov/salaries/search?firstName=" + firstName + "&lastName=" +lastName + "&agency=&searchPerformed=true";

        GM_xmlhttpRequest({

            //dataType: 'html'
            method: "GET",
            // The url value is being passed into the function by the caller
            url: url,
            // Process the results, inserting the salaries into the org chart
            onload: function( data ) {
                let source = $('' + data.responseText + ''),
                    wageResults = source.find( "tr.odd td:nth-child(5)" );

                if ( wageResults ) {


                    // Add all returned possible salaries to person
                    wageResults.each( function(i) {

                        let wages = $( this ).text()

                        that.append( '<div class="salary" style="display:block">' + wages + '</div>' );

                    });

                }
            }

        });

    } // end getSalary()




    function mutationCallback( mutations ) {

        mutations.forEach( function( mutation ) {

            let added = mutation.addedNodes;

            added.forEach( function( element ) {

                let divCheck = $( 'div.hoc-node-title', element );

                if ( divCheck.length > 0 ) {

                    if ( divCheck.hasClass( 'salary' ) ) {
                        console.log( 'salary already exists' );
                    }
                    else {
                        divCheck.addClass( 'salary' );

                        let firstName = $('span.hoc-nameline1', divCheck ).text(),
                            lastName = $('span.hoc-nameline2', divCheck ).text();

                        getSalary( divCheck, firstName, lastName );
                    }

                }

            });

        } );

    } // end mutationCallback()


//////////////////////////////////////////////////////////////////////////////
/////////////////////  MutationObserver init   ///////////////////////////////


    var mList = document.querySelector('body'),
    options = {
        childList: true,
        subtree: true
    },
    observer = new MutationObserver( mutationCallback );

    observer.observe(mList, options);


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

})();
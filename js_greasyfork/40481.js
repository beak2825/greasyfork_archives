// ==UserScript==
// @name         Office 365/People - Org Chart
// @namespace    https://greasyfork.org/en/users/119330-edward-sluder
// @version      0.1.6
// @description  Include Salary lookup for employees
// @author       Edward Sluder
// @match        https://outlook.office365.com/owa/*
// @require      https://code.jquery.com/jquery-2.2.3.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/40481/Office%20365People%20-%20Org%20Chart.user.js
// @updateURL https://update.greasyfork.org/scripts/40481/Office%20365People%20-%20Org%20Chart.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    /////////////////////////////////////////////////////////////////
    //----------------------  Global Objects  ---------------------//

    var salariesMemoized = [],
        fullName = [];

    //-------------------------------------------------------------//
    /////////////////////////////////////////////////////////////////    
    
    
    /*//////////////////////////////////////////////////////////////////////////
    ////////////////////////  Functions  ////////////////////////////////////*/
    
    var getSalary = function( url, that, firstName, lastName ) {

        GM_xmlhttpRequest({

            //dataType: 'html'
            method: "GET",
            // The url value is being passed into the function by the caller
            url: url,
            // Process the results, inserting the salaries into the org chart
            onload: function( data ) {
                var source = $('' + data.responseText + ''),
                    wages = source.find( "tr.odd td:nth-child(5)" ).text();

                if ( wages ) {    
                    console.log( 'wages: ' + wages );
                    that.children().children().last().append( '<span id="salary">' + wages + '</span>' );

                    // Add person's data to our salariesMemoized array to reduce lookups
                    salariesMemoized.push( wages );
                    fullName.push( firstName + lastName );

                    console.log( 'salariesMemoized.length: ' + salariesMemoized.length + ' fullName.length: ' + fullName.length );
                }
                else {
                    console.log( 
                        "No wages found for: " + firstName + " " + lastName +
                        ". Will try again with first name initial"
                    );
                    var firstInitial = firstName.substring(0, 1);
                    url = "http://www.in.gov/apps/gov/salaries/search?firstName=" + firstInitial + "&lastName=" +lastName + "&agency=&searchPerformed=true";
                    getSalary( url, that, firstName, lastName );
                }
            }

        });


    }; // end getSalary()
    


    function orgDivAvailable() {

        var people = $( '._pf_11.PersonaPaneLauncher' );

        people.each(function(i) {

            // Extract the First Name & Last Name from the <span> to create our
            //   Xhr request URL.
            var titleStr = $( this ).attr( 'title' ),
                titleParts = titleStr.split( "," ),
            // Extract the last name & first name.
            lastName = $.trim( titleParts[0] ),
            firstNameAndMiddleInitial = $.trim( titleParts[1] ),
            firstNameAndMiddleInitialSplit,
            firstName,
            that = $( this ),
            // Global variable to hold salary
            wages;
            firstNameAndMiddleInitialSplit = firstNameAndMiddleInitial.split( " " );
            firstName = $.trim( firstNameAndMiddleInitialSplit[0] );

            console.log( `last name: ${lastName} first name: ${firstName}` );
            
            // Check for #salary, which would already exist if we've previously
            //   retrieved salary data for this person.  If found, return from
            //   the function.
            if ( $( '#salary', that ).length > 0 ) {
                console.log( 'salary span found' );
                return;
            }

            // Fetch salary data for this person.
            var index,
            fullNameCheck = firstName + lastName;

            (function() {
                
                for (index = 0; index < fullName.length; index += 1) {

                    console.log( `fullName: ${fullName[index]} fullNameCheck: ${fullNameCheck}` );
                    if ( fullName[index] === fullNameCheck ) {

                        // retrive from memoized object
                        console.log( fullName[index] + ' found in memoization object' );
                        that.children().children().last().append( '<span id="salary">' + salariesMemoized[index] +'</span>' );

                     
                        return; 
                    }
                    
                } 
                            
                // No memoized wages were found, fetch salary.
                var url = "http://www.in.gov/apps/gov/salaries/search?firstName=" + firstName + "&lastName=" +lastName + "&agency=&searchPerformed=true";
                getSalary( url, that, firstName, lastName );
                console.log( 'No memoized wages were found, fetch salary.' );
                
                
            })();

        }); // End people.each();

    } // End function orgDivAvailable


    
    
    var initialObserver = function() {
        
        // To limit the number of times the MutationObserver calls function.
        var keepObserving = true;
        var observer = new MutationObserver( function( mutations ) {

            mutations.forEach( function( mutation ) {

                if ( keepObserving === true ) {
                    // The insertion of this <div> indicates we are looking at
                    //   Organizational information.
                    var orgDiv = $( '.o365cs-owaFlexPanel.ms-bgc-w' );

                    if (orgDiv.length > 0) {
                       
                        observer.disconnect();                    
                           
                        if ( keepObserving === true ){
                            // prevent any further calls on observer.
                            keepObserving = false;
                            
                            // Add a "More Info" button
                            $( '#O365_NavHeader > div.o365cs-nav-centerAlign' ).append( '&nbsp;<div><button id="getSalaries">More Info</button></div>' );
                            $( '#getSalaries' ).on( 'click', function( event ) {
                                // stop the pages built-in functions for buttons from executing.
                                event.preventDefault();
                                event.stopPropagation();
                                orgDivAvailable();
                            }).css({
                                'vertical-align' : 'middle',
                                'display' : 'table-cell'
                            }).parent().css( 'display', 'table' );
                            
                            console.log( 'Observer disconnected and getSalary button added.' );
                        } 
                   
                    }
                    else {
                        console.log("No orgDiv yet");
                    }
                }

            });

        }); // End new MutationObserver();

        // Configure the MutationObserver
        var observerConfig = {
            attributes: false,
            childList: true,
            characterData: false
            //subtree: true
        };

        // In this case we'll listen to all changes to body and child nodes
        var targetNode = document.body;
        observer.observe(targetNode, observerConfig); 
                
    }; // End initialObserver();   
    
    
    /*/////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////*/

    
    //-------------------------------------------------------------------------
    
    
    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////////  MAIN  /////////////////////////////////////
    
    initialObserver();
    
    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    
})();
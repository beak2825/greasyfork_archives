// ==UserScript==
// @name         SecureMail Address book
// @namespace    EPS Developments
// @version      0.1.1
// @description  Enable address selection from Active Directory
// @author       Edward Sluder
// @match        https://certifiedmail.in.gov/createmsg.aspx*
// @run-at       document-idle
// @require      https://code.jquery.com/jquery-2.2.3.min.js
// @grant        GM.xmlHttpRequest
// @connect      in.gov
// @downloadURL https://update.greasyfork.org/scripts/41045/SecureMail%20Address%20book.user.js
// @updateURL https://update.greasyfork.org/scripts/41045/SecureMail%20Address%20book.meta.js
// ==/UserScript==

(function() {
    'use strict';



    /*/////////////////////////////////////////////////////////////////////////
    ////////////////////////  Functions  ////////////////////////////////////*/

    var fetchPerson = function( data ) {

        // clear the existing names from name suggestion table
        if( $( '#toTable' ) ) {
            $( '#toTable tr' ).remove();
        }

        GM.xmlHttpRequest({


            method: "POST",
            url: "https://www.in.gov/apps/iot/find-a-person/api/contacts/search",
            data: data,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {

                var results = JSON.parse( response.responseText ),
                    resultsArray = results.results;

                $.each( resultsArray, function(i) {

                    $( '#toTable' ).children().last().after( `<tr><td class="toName"> ${resultsArray[i].firstName} ${resultsArray[i].lastName} - ${resultsArray[i].email} </td></tr>` );

                    // Style names when hovered over.
                    $( '.toName' ).hover(
                        function() {
                            $( this ).css({
                                'background-color' : '#0066ff',
                                'font-weight' : 'bold',
                                'color' : 'white'
                            });
                        },
                        function() {
                            $( this ).css({
                                'background-color' : 'white',
                                'font-weight' : 'normal',
                                'color' : 'black'
                            });
                        }
                    ).one( 'click', function( event ){

                        var currentTo = String( $( '#txtTo' ).val() );

                        if ( currentTo.search( ';' ) > -1 ) {

                            var toSplit = currentTo.split( ';' ),
                                newToText = "";

                            for (var i = 0; i < ( toSplit.length -1 ); i++ ) {

                                // Keep all the names except the last, which
                                //  was the search string.
                               newToText = newToText + toSplit[i] + '; ';

                            }

                            $( '#txtTo' ).val( newToText + ( $(this).data('email') + '; ' ) );

                        }
                        else {

                            $( '#txtTo' ).val( $(this).data('email') + '; ' );
                        }



                        // Some elements register multiple event handlers.
                        event.stopImmediatePropagation();

                        // clear the results after selection is made.
                        $( '#toTable tr' ).remove();

                        // Put focus back on the To: input and position the cursor
                        //    to be ready to start typing new name.
                        var toInput = document.querySelector( '#txtTo' );
                        toInput.focus();
                        var position = toInput.value.length;
                        toInput.setSelectionRange( position, position );


                    });

                    // Assign the email address as a data-tag for this element to
                    //     be retrieved later.

                    $( '#toTable td.toName:last' ).data( 'email', resultsArray[i].email );


                });



            }
        });

    };


    var init = function() {

        // Create <div> to display our potential "To:" names.
        var createToDiv = setTimeout( function() {

            var toRow = $( '#rowBccEmail' );

            if ( toRow.length > 0 ) {

                toRow.after( '<tr><td><div id="toDivList"><table id="toTable"><tr><td></td></tr></table></div></td></tr>' );

                $( '#toDivList' ).css({
                    'position' : 'absolute',
                    'top' : '-5px',
                    'left' : '76px',
                    'border-width' : '1px',
                    'border-style' : 'solid',
                    'border-color' : 'gray',
                    'margin-left' : '0px',
                    'width' : '500px',
                    'background-color' : 'white',
                    'max-height' : '250px',
                    'z-index': '100000',
                    'overflow-y' : 'scroll'

                }).parent().css( 'position', 'relative' );
            }
            else {
                createToDiv();
            }

        }, 100 );

        // Cache a reference to the "To:" <textarea> and look for key inputs.
        var textTo = document.querySelector( '#txtTo' );
        textTo.addEventListener( 'keyup', function() {

            var textToLength = textTo.value.length,
                textToValue = textTo.value,
                textToSplit, multiNames, lastName, firstName;

            if ( textToLength > 4 ) {

                // Check to see if we have multiple values on the "To:" field.
                if ( textToValue.search( ';' ) > -1 ) {

                    multiNames = textToValue.split( ";" );
                    textToSplit = multiNames[ multiNames.length -1 ].split( "," );
                    lastName = $.trim( textToSplit[0] );
                    firstName = $.trim( textToSplit[1] );

                }
                else {
                    textToSplit = textToValue.split( "," );
                    lastName = $.trim( textToSplit[0] );
                    firstName = $.trim( textToSplit[1] );
                }

                var data = {"pageNumber":1,"pageSize":10,"sortBy":"lastName","lastName":"", "firstName":""};

                data.lastName = lastName;
                if ( firstName.length > 0 ) {
                    data.firstName = firstName;
                }
                fetchPerson( JSON.stringify( data ) );

            }
        });

    };

    /*/////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////*/


    //-------------------------------------------------------------------------


    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////////  MAIN  /////////////////////////////////////

    init();


    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

})();
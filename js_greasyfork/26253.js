// ==UserScript==
// @name         Go To Line Feature in ASIDE.IO
// @version      1.0.1
// @description  Enable Go To Line Feature in ASIDE.IO
// @author       Shruti Sridharan
// @match        https://www.aside.io/*
// @grant        https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @namespace https://greasyfork.org/users/56475
// @downloadURL https://update.greasyfork.org/scripts/26253/Go%20To%20Line%20Feature%20in%20ASIDEIO.user.js
// @updateURL https://update.greasyfork.org/scripts/26253/Go%20To%20Line%20Feature%20in%20ASIDEIO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    jQuery( document ).ready(
        function() {
            jQuery( ".cf-section" ).first().append(
                jQuery( "<span/>" )
                .attr( "class", "cf-sub-test hidden foot-btn keep-left small-right-marg unselectable" )
                .attr( "style", "display: inline" )
                .attr( "title", "Go To Line" )
                .html( "go to line" )
                .click(
                    function() {
                        var lineNo = prompt( "Enter Line Number:" );
                        if( !isNaN( lineNo ) ) {
                            editor.gotoLine( lineNo, 0, true );
                        }
                    }
                )
            );
        }
    );
})();
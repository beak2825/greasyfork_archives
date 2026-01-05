// ==UserScript==
// @name         Preview a Visualforce page in ASIDE.IO
// @version      1.0.2
// @description  Preview a Visualforce page in ASIDE.IO by clicking the 'Preview' button at the bottom of the page.
// @author       Shruti Sridharan
// @match        https://www.aside.io/*
// @grant        https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @namespace https://greasyfork.org/users/56475
// @downloadURL https://update.greasyfork.org/scripts/22146/Preview%20a%20Visualforce%20page%20in%20ASIDEIO.user.js
// @updateURL https://update.greasyfork.org/scripts/22146/Preview%20a%20Visualforce%20page%20in%20ASIDEIO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    jQuery( document ).ready(
        function() {
            jQuery( ".cf-section" ).first().append(
                jQuery( "<span/>" )
                    .attr( "class", "button gen-btn keep-left thin-btn unselectable" )
                    .attr( "style", "display: inline" )
                    .attr( "title", "Click here to get a preview of the page." )
                    .html( "Preview" )
                    .click(
                        function() {
                            var fileName = currentFile;
    
                            if( fileName.indexOf( ".page" ) !== -1 ) {
                                var replaceFileName = fileName.replace( ".page", '' ).toLowerCase();
    
                                var link = d3vUtil.getFrontdoorURL();
    
                                var replacedLink = link.replace( undefined, "/apex/" + replaceFileName );
    
                                window.open( replacedLink, "_blank" );
                            }
                        }
                    )
            );
        }
    );
})();
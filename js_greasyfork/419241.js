// ==UserScript==
// @name        SAV.com domain list sort by date
// @namespace   https://github.com/borayeris/sav.com-domain-list-sort-by-date
// @match       *://*.sav.com/*/domain_list
// @grant       none
// @version     1.0
// @author      Boray Eris
// @description This is a UserScript. sav.com is one of the cheapest domain registrar. But the interface is awful. You cannot sort domains by expiration date. My script lists domains on 1 page. When you click on Expiration column, it sorts domains by date.
// 12/26/2020, 11:38:01 PM
// @downloadURL https://update.greasyfork.org/scripts/419241/SAVcom%20domain%20list%20sort%20by%20date.user.js
// @updateURL https://update.greasyfork.org/scripts/419241/SAVcom%20domain%20list%20sort%20by%20date.meta.js
// ==/UserScript==
$(function(){
    let $domainDetails = $('.domain-details'); // GET TABLE OF DOMAIN LIST

    /**
     * CHECK ALL PAGES
     */
    $('.pagination .auction-pagination-link:not([rel="next"])').each(function(){
        let pageNum = $(this).text();
        console.log( '//www.sav.com/domains/domain_list/'+ pageNum );
        $.get( '//www.sav.com/domains/domain_list/'+ pageNum, function( data ) {
            $domainDetails.find('tbody').append( $(data).find( '.domain-details tbody tr' ) );
        })
        .done(function(){
            $('.pagination').hide();

            /**
             * ATTACH UNIX TIME TO LINE (TD)
             */

            //console.log( $domainDetails.find('tbody tr') );
            $domainDetails.find('tbody tr td:nth-child(2)').each(function(){

                let unixTime = Date.parse( $(this).text() ) / 1000;
                $(this).parent().attr({ 'data-unixtime': unixTime });
                //console.log( unixTime );

            });

            /**
             * SORT BY CLICK
             */
            $domainDetails.find('tbody tr').on( 'click', 'td:nth-child(2)', function(){

                let $lines = $domainDetails.find('tbody tr').sort( (a, b) => { return $(a).attr('data-unixtime') - $(b).attr('data-unixtime'); } );
                $domainDetails.find('tbody').html( $lines );


            });


        });

    });

});
// ==UserScript==
// @name         timewall.io
// @author       WXC
// @description  Autoclick ads
// @match        https://timewall.io/*
// @grant        unsafeWindow
// @grant        window.focus
// @require      https://code.jquery.com/jquery-latest.min.js
// @run-at document-idle
// @noframes
// @version 0.0.1.20250216115644
// @namespace https://greasyfork.org/users/713625
// @downloadURL https://update.greasyfork.org/scripts/527093/timewallio.user.js
// @updateURL https://update.greasyfork.org/scripts/527093/timewallio.meta.js
// ==/UserScript==


// go to "https://timewall.io/home/profiles" and wait few secs
// copy profile ID of website, you want to claim AND paste copied value into line #45
// allow "Popups and redirects" permission in site setting

// use this extension to close duplicated tabs -> https://chromewebstore.google.com/detail/duplicate-tabs-closer/gnmdbogfankgjepgglmmfmbnimcmcjle
// set On duplicate tab detected: Close tab automatically


(function() {
    'use strict';

    unsafeWindow.alert = function(){};
    unsafeWindow.confirm = function(){};

    function simulateMouseClick(targetNode) {
        function triggerMouseEvent(targetNode, eventType) {
            var clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent(eventType, true, true);
            targetNode.dispatchEvent(clickEvent);
        }
        ["mouseover", "mousedown", "mouseup", "click"].forEach(function(eventType) {
            triggerMouseEvent(targetNode, eventType);
        });
    }



    $(document).ready(function() {

        var profile = "5c95325755abdb6a"; // <-- SET WEBSITE PROFILE HERE, ex. var profile = "5c95325755abdb6a"

        setTimeout( function() {

            if( location.pathname == "/surveys" ) {
                location.href = "/clicks";
            }


            if( location.pathname == "/clicks" ) {


                if( $("li[title='Logout']").attr("data-o") != profile ) {
                    console.log("Bad website");
                    $("body").css("background-color","#ff0000");
                    location.href = "/home/profiles";
                }


                if( $("h5:contains('No Ads Available')").is(":visible") ) {
                    //alert("NO-ADS");
                }
                else {

                    if( $("h5:contains('No Ads Available')").not(":visible") ) {

                        if( $(".clickBtn:first").length ) { // VIEW

                            $(".clickBtn").attr("href", "https://www.crypto-prasatko.cz/ads").attr("name", "tw"); // Keep this url to support my work, thx ... or change form some unused, unique
                            simulateMouseClick(document.querySelector(".clickBtn"));
                            $("#sc-header-alerts li").remove();


                            var check_done = setInterval( function() {
                                if( document.title == "TimeWall" ) {
                                    clearInterval( check_done );
                                    location.reload();
                                }
                            }, ( 2* 1000 ) );


                        }

                    }

                }

            }



            if( location.pathname == "/home/profiles" ) {

                setTimeout( function() {

                    if( profile == "" ) {

                        $('button[data-oid]').each(function() {
                            var $this = $(this);
                            $('<span>')
                                .text( "Profile ID: "+ $this.data('oid') )
                                .css({'color': 'white', 'background-color': 'green', 'padding': '3px', 'margin-top': '5px' })
                                .insertAfter($this);
                        });

                    }
                    else {

                        if( $("li[title='Logout']").attr("data-o") != profile ) {
                            $("button[data-oid='"+ profile +"']").click()
                        }
                        else {
                            location.href = "/clicks";
                        }

                    }

                }, ( 1 * 1000 ) );

            }


        }, ( 7 * 1000 ) ); // wait for load

    });



    function getProfiles() {

        let token = $("input[name='_csrfToken']").val();
        console.log( "TOKEN: "+ token );

        $.ajax({
            url: "/home/getuserwallets",
            beforeSend: function(xhr) {
                xhr.setRequestHeader(
                    'X-CSRF-Token', token
                );
            },
            type: "POST",
            success: function(response) {
                //response = JSON.parse(response);

                console.log(response);

                for( let index = 0; index < response.length; index++ ) {

                    let wallet = response[index].wallet;
                    let points = wallet['CurrentEarningsPoints'];

                    let offerwall = response[index].offerwall[0];
                    let domain = offerwall['Domain'];

                    let profile = response[index].profile;
                    let oid = offerwall['Id'];
                    let uid = profile['ExternalUserId'];
                    let act = profile['Active'];

                    console.log( domain +"|"+ oid +"|"+ uid +"|"+ act + "|"+ points );
                    //location.href = "https://timewall.io/home/profiles?oid="+ oid +"&uid="+ uid; // switch

                }

            }
        });

    }



    var sec = 90;

    if( $("h5:contains('No Ads Available')").is(":visible") ) {
        sec = ( 5 * sec );
    }


    setTimeout( function() { // global reload
        console.log( "global reload" );
        location.reload();
    }, ( sec * 1000 ) ); // 1m or 5m


})();
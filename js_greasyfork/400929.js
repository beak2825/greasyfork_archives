// ==UserScript==
// @name         yalb Unlocker
// @namespace    https://greasyfork.org/scripts/400929-yalb-unlocker
// @version      0.6
// @description  Enables yalb premium buttons
// @author       Djamana
// @match        https://*.yalp.io/*
//chords/*

// @grant        none
// @run-at document-start  //https://tampermonkey.net/documentation.php#_run_at
/*
 * Enables buttons "change speed" without the need to login
 * Enables buttons "loop", "transpose +/-", "Download MIDI", "tuner" without the need for premium
 * "Download PDF", and Upload mp3 is currently not working

 How does this work technically:
 Well nearly all of the yalb-premium functionality is already there,
 what blocks it from been used is that the buttons at the UI (html-page)
 don't have the correct IDs or Class attribute.
 So later yalb just don't attach the corresponding handler to it.

 So the main mission here is the restore correct IDs or class attributes before
 yalb'S document_ready() event handler is executed.

 Hints for dealing with yalb.min.js:
 * search for 'create_google_tag' in the 'formated' JavaScript sources.
   It will bring you to all first level function of major interest
   and somehow compensate the missing comment and real function names because of the minified source.
   Example:
     create_google_tag("play", "user_id " + yalpB)

*/
// @downloadURL https://update.greasyfork.org/scripts/400929/yalb%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/400929/yalb%20Unlocker.meta.js
// ==/UserScript==
'use strict';
var appVersion = "0.6"


// Testpage:
// https://yalp.io/chords/gerhard-schoene-der-laden-efc3
//
// Tested with https://www.yalp.io/js/yalp.min.full.js
// VERSION: 1.18.0  DATE: 2015-09-05
//
// History
// 0.6  Mai 2020
//   * Improved no login required - use of mutation observer to exchanges javascript files on the fly


var Conf_chordsContainerHeight = 1280
var Conf_FakeLogin             = true

// TODO find yalp correct mp3 Upload url !
var Conf_UploadUrl    = "//www.yalp.io/submit.php"
var Conf_DownloadUrl  = "#" //"//www.yalp.io/submit_yalp.php"

//https://www.yalp.io/index3.php
//https://www.yalp.io/lesson/booking_attempt/slot-id/booktutor.idsong?_=1587026316058
//https://www.yalp.io/lesson/pay_with_stripe/e4
//https://www.yalp.io/store_event
//https://www.yalp.io/store_interface_language
//https://www.yalp.io/lesson/get_tutors_availability?user%5Btime_zone%5D=Europe%2FBerlin&language=2&instrument_category=guitar&played_instrument_category=guitar&page=1&from_date=2020-04-16%2000:00&to_date=2020-04-16%2023:59&origin=undefined&tutorid=undefined&_=1587026316059
//https://www.yalp.io/searchemail

// force to load this jQuery - change to false to use jQuery yalp provide
var Conf_jQueryToUse_Url  = false //"//ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.js"

// Blocks loading addtoany.com Facebook and Co social buttons
var Conf_OptFixes_NoSocialbuttons  = true

var Conf_OptFixes_NoTracking  = true


// Check if a string contains the given RE-pattern
String.prototype.contains = function(RegExpMatchPattern) {
    var matches = this.match( RegExpMatchPattern )
    matches = matches &&
              matches.length
    return !!matches
}
///^\/chords|playlist/
var isChordsUrl = !!document.location.pathname.contains(/^\/chords|playlist/)


function otherFixes() {
    // Beautify
    try {

        $("#beats_chords_container").height( Conf_chordsContainerHeight )

        $('#dynamic_chords_container').removeClass('hidden')
        $('#dynamic_demo_container').addClass('hidden')

    } catch (exception) {
        console.warn('Error on enlarging chords container', exception);
    }

    // Remove 12 Secs delayed message after hitting 'play'
    // it's triggered only on first play - so
    // set numbersOfPlay count to a higher value than 0 will disable this
    // Note: Cookies depends on main.min.js
    try {
        //$("#ModalDailyMax").remove()
        if ( typeof Cookies.get("user_id") == "undefined" )
            Cookies.set( "user_id", "DummyUser" )
        Cookies.set( "nplay", "1" )
    } catch (exception) {
        console.warn('Error on disabling delayed message after play', exception);
    }
}

function removeAds() {
    // Remove Premium ads
    try {
        var PremiumAds = $("a[href$='yalp.io/premium'")
        PremiumAds.remove()
        console.log( PremiumAds.length + ' Premium ads deleted.' );

        var PremiumAds2 = $("a[href$='yalp.io/pricing'")
        var MixerOnlyAd = PremiumAds2 && PremiumAds2.parent().parent()//  $(".jumbotron:not( [id] )")
        MixerOnlyAd.remove()

    } catch (exception) {
        console.warn('Error on Remove premium ads', exception);
    }


    // No Tracking
    // Overwrite main.min.js ! create_google_tag() with dummy function
    if (Conf_OptFixes_NoTracking)
        create_google_tag = my_create_google_tag
}

function my_create_google_tag(action, userID) {
    console.log ( "Intercepted TrackingEvent: " + action )
}



function RestoreButtonIDs() {
//debugger
    // Extend JQuery alittle ...
    $.fn.replaceClass = function (pFromClass, pToClass) {
        return this.removeClass(pFromClass).addClass(pToClass);
    };


    try {
        // .. and yes we are logged in
        // so that will unlock the "speed buttons"
        if (Conf_FakeLogin) {
            if ( logged == false ) {
                logged    = true
                is_editor = true
                //$("#loaded_version")
                $(".navbar-text")
                    .text("yalb Unlocker: Changes are NOT saved - since FAKE login is active!")
//                AddYalb_full_js()
            }
        }
    } catch (exception) {
        console.warn('Error on FakeLogin', exception);
    }



    var buttons_locked = $(".notify-premium") //[aria-label]
    buttons_locked.removeClass("notify-premium")

    var premiumItemsCount = buttons_locked.length
    console.log ( premiumItemsCount + " premium buttons found." )
    if (premiumItemsCount <= 4 ) {
        alert( "yalb Unlocker Script - failed. " +
               "Whops just " + premiumItemsCount +
               " ?" +
               "There is something wrong - to less premium items found.")
    }


    // KEY: "aria-label" : VALUE: new ID and CLASS Name to be added
    var newID_Translator = {
        "Add to Playlist": "add-playlist",
        "Transpose down" : "transpose-minus" ,
        "Transpose up"   : "transpose-plus" ,
        "start tuner"    : "start-tuner" ,
        "generate midi"  : "generate-midi" ,
        "download-midi"  : "generate-midi" ,
        "enable loop"    : "loop" ,
        "Print pdf"      : "print-grid",
        "unlimited-pdf-alert"      : "print-grid"


    }
    var stats_IDsApplied = 0
//debugger
    buttons_locked.each( function() {
        try {
            // Get Attibute "aria-label"   or if not exist "data-alert"
            var button_label = $( this ).attr("aria-label") ||
                               $( this ).attr("data-alert")
            //button_label = buttons_locked.getAttribute("data-alert")
            //newID = newID.match ("(?:unlimited-)(.*)(?:-alert)") [1]

            var newID = newID_Translator[ button_label ]

            if (newID) {
                // add ID
                this.id = newID
                stats_IDsApplied++;

                // add class
                $( this ).addClass(newID)
            }

            console.log ( (newID ? "#" + stats_IDsApplied + " New" : "NOT APPLIED") +
                           " ID: #" + newID + " <= '" + button_label + "'")

        } catch (exception) {
            console.warn('Error on update button ', exception);
        }
    });
    console.log ( stats_IDsApplied + " button patched.")

    buttons_locked.removeAttr("data-alert" )
    buttons_locked.removeAttr("data-toggle")
    buttons_locked.removeAttr("data-target")



    // reenable Upload
    // Restore Upload-click
    $(".no-upload-button")
        .replaceClass( "no-upload-button", "upload-button")

    // reenable drop mp3 files
    $('body').addClass("drop")

    // Recreate Upload button
    // https://github.com/blueimp/jQuery-File-Upload/wiki/Basic-plugin
    var form = $("<form >"); //id=fileupload
    form
        .append(
        '<input '+
        ' type = "file" '+
        ' id   =  fileupload '+
        ' data-url="' + Conf_UploadUrl + '"' +
        ' name="files[]" '+
        '>')
     $('body').append(form);
   //.attr("id","fileupload")


// Print PDF is not working
// that's the yalb - code this will trigger:
    //$("#print-form [name='token']"     ).val(token)
    //$("#print-form [name='transpose']" ).val(yalpx)
    //$("#print-form"                    ).submit()
// The form 'print-form' is missing
    var printForm = $(
        "<form " +
        "id     = 'print-form' " +
        "action = '" + Conf_DownloadUrl + "'" +
        "method = 'post' >"

    ); //id=fileupload
    printForm
        .append('<input type="button" name="token">')
        .append('<input type="button" name="transpose">');
    "submit_yalp.php"
    $('body').append(printForm);
    
//    $('[aria-label="Print pdf"]')
//    .addClass("print-grid")


         // Enable Tuner Handler
//        var tuner = document.getElementById("start-tuner")//"start-tuner")
//        console.log( tuner.id );
//        debugger
        //tuner.addEventListener("click", yalpza )



  // Enable Midi-Download
  //    must satisfy $(".generate-midi") to match with yalb handler ".click(function() {..."
  // Not needed anymore since now it's also handled by the 'ID_Translator' above

//    $('[aria-label="generate midi"]')
//    .addClass("generate-midi")


//    $('[aria-label="start tuner"]')
//      .attr("name","transform")


    // it is important to trigger document_ready handler of yalb which will connect eventhandler to the buttons
 //   if (!$(document).hasClass("ready")) {
//        $(document).triggerHandler("ready");
 //       $(document).addClass("ready")
 //   }
}
///////////////////////////
//  RestoreHandlers
//  Purposes:
//  some yalb bugfixing
function RestoreHandlers () {
    //Enable Tuner Handler
    // document.getElementById("start-tuner").addEventListener("click", yalpza)
    $("button#start-tuner").click(yalpza)
    // Note that there are 2 Buttons - one is hidden in the "..." Menu (there is transpose and speed)


    $(".navbar-text")
        .text("yalb Unlocker " + appVersion)

}

///////////////////////////
//  M A I N  loader
//  Purposes:
//  * Run RestoreButtonIDs ( to restore/set correct GUI ID )
//    BEFORE yalb document_ready()
//  * Some Yalb Bugfixing ( start-Tuner handler is not set correct)
function Main_JQueryReady() {

    // That will be called when the document is ready...
    //$( document ).ready(function() {
     //$( RestoreHandlers )

    //$(document).on("ready", RestoreButtonIDs)
    $( document ).ready( (event) =>  {
//        console.log( "document loaded" );

        // Restore Buttons IDs and Classes for premium items
        // .. so that yalb will install most of the handler in its document_ready() event handler
        if (isChordsUrl) {
            RestoreButtonIDs()
            otherFixes()
        }
        removeAds()


    });

    $( window ).on( "load",  (event) =>  {
        console.log( "window loaded" );
        RestoreHandlers();
    });



    $( window ).on( "DOMContentLoaded", (event) => {
        console.log('DOM fully loaded and parsed');
    });




}


///////////////////////////
//  liteToFull
// Hook loading js and css files
// and do manipulation to it (exchange, drop...)
function liteToFull( searchPattern, attrib, replaceWith, postfix ) {

    new MutationObserver( ( mutations , observer ) => {
        
        //mutations.forEach( (mutation) => {
        //    console.log( mutation.target );
        //});

//        let script = mutations[0].addedNodes[0]
//        if ( script.src.match("addtoany.com")!==null )    script.remove()

        var tmp
        (tmp = document.querySelector( "script[src*='addtoany.com']" ) ) &&
         tmp.remove()

        const yalp_lite = document.querySelector( "[" + attrib + "$='" + searchPattern + "']" );//'script[src*="jquery"]');
        if (yalp_lite) {

            var yalp_url  = yalp_lite[attrib]
            var yalp_full = yalp_url.replace( replaceWith , replaceWith + postfix )
            yalp_lite[attrib] = yalp_full

            console.log ( "NEW " + attrib + " '" + yalp_full + "' <= '" + yalp_url + "'" )

            //yalp_lite.remove();
            // We've done what we needed to do, no need for the MutationObserver anymore:
            observer.disconnect();
        }
  })
    .observe( document.documentElement ,        // target  ( Type: Node )
             { childList: true, subtree: true, target: "script" } // options ( Type: MutationObserverInit-Object)
            );// ( other option: attributes[OldValue] ,characterData[OldValue], attributeFilter)

}


///////////////////////////
//  M A I N  loader
//  Purposes:
//  * Exchange js and css files for full version
//  * Run Main when Jquery is ready
(function() {
//    debugger

/*
    let script ;
    script = document.createElement('script');
    script.src = "//www.yalp.io/js/yalp.min.full.js";
    document.body.appendChild(script);  // execute the script
*/

    // Load full version
    liteToFull( "yalp.min.js" ,   "href", ".min.", "full." )
    liteToFull( "yalp.min.js" ,   "src",  ".min.", "full." )
    liteToFull( "style.min.css" , "href", ".min.", "full." )

    // No Ads
    liteToFull( "ads.min.js"    , "src", ".min.", "" )

    // Anti-blocker disable
    var tmp = document.querySelector("head")
    tmp && tmp.setAttribute("id","yalp-FfCUXEjbzHqO")
    
    // in case th first pattern changed the following will break Anti-blocker dectection script
    tmp = document.querySelector('#ModalAdUnblock')
    tmp && tmp.remove()



    // Wait for jquery
    let attrib = "src"
    var run = false
    new MutationObserver( ( mutations , observer ) => {

        if (run) {
            Main_JQueryReady()
            // We've done what we needed to do, no need for the MutationObserver anymore:
            observer.disconnect();
        }

        const jQuery = document.querySelector( 'script[' + attrib + '*="jquery"]');
        if (jQuery) {

            // Replace jQuery with other one ?
            if (Conf_jQueryToUse_Url) {
                let jQuery  = jQuery[attrib]
                jQuery[attrib] = Conf_jQueryToUse_Url
            }

            run = true
        }
    })
    .observe( document.documentElement, { childList: true, subtree: true } );
}) ();

// ==UserScript==
// @name         iredadmin_CSV_OneLineAdder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows simply add users by one CSV line in the iredadmin web interface
// @author       Djamana
// @match        https://*/iredadmin/create/user/*
// @match        https://*/iredadmin/profile/user/general/*?msg=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377822/iredadmin_CSV_OneLineAdder.user.js
// @updateURL https://update.greasyfork.org/scripts/377822/iredadmin_CSV_OneLineAdder.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function timerCB(callback) {
        //debugger
        //$('[name=confirmpw]')[0].value = $('[name=newpw]')[0].value

        var Lines = $('[name=OneLineAdder]')[0].value.split(";")
        if (Lines.length == 3) {

            $('[name=username]')[0].value  = Lines[0]

            $('[name=newpw]')[0].value     = Lines[1]
            $('[name=confirmpw]')[0].value = Lines[1]

            $('[name=cn]')[0].value        = Lines[2]
        }

    }

    if (location.pathname.indexOf("/iredadmin/create/user/") != -1) {
    setInterval( timerCB, 500);

             $('form')
            .append(
             $('<span>')
                 .text ("CSV_OneLineAdder  Ver 0.1 [Feb'19]")
             )
             .append(
             $('<input>')
                .attr('type', "text")
                .attr('name', "OneLineAdder")
                .attr('size', '65')
                .attr('class', "text fl-space")
                .attr('value', "")
                .attr('title', "Username;Password;DisplayName")
             );

             $('[name=OneLineAdder]').focus();
    //Name;username;password
    /*
            .append(
             $('<input>')
                .attr('type', "text")
                .attr('name', "employeeNumber")
                .attr('size', '35')
                .attr('class', "text fl-space")
                .attr('value', "15")
             )
*/
    } else if ( location.search == "?msg=UPDATED") {
        //debugger


            location.search   = "";
            location.pathname = "/iredadmin/create/user/";


    } else if ( location.search == "?msg=CREATED") {
        //debugger
        $('[name=employeeNumber]').focus();
    }


    })();

//======================================================================

//         _   ____                              _____              _          _  _
//        | | / __ \                            |_   _|            | |        | || |
//        | || |  | | _   _   ___  _ __  _   _    | |   _ __   ___ | |_  __ _ | || |
//    _   | || |  | || | | | / _ \| '__|| | | |   | |  | '_ \ / __|| __|/ _` || || |
//   | |__| || |__| || |_| ||  __/| |   | |_| |  _| |_ | | | |\__ \| |_| (_| || || |
//    \____/  \___\_\ \__,_| \___||_|    \__, | |_____||_| |_||___/ \__|\__,_||_||_|
//                                        __/ |
//                                       |___/
// from  http://erikvold.com/blog/index.cfm/2010/6/14/using-jquery-with-a-user-script


function addJQuery(callback) {

    // create a new <_script> element and insert it into the document.body
    // 'callback'  will be the body of the script
/*
    var fn_scriptInject =
        function() {
            var script;
            script = document.createElement("script");
            script.textContent = "(" + callback.toString() + ")();";
           document.body.appendChild(script);

//          $('<script>').text("(" + callback.toString() + ")();").appendTo('<body>')

        };
 */

    if (typeof $ !== 'undefined') {
        // jQuery is loaded
        //try {


//        console.log ('jQuery version ($):' + jQuery.fn.jquery)
        // Unload jQuery
//        debugger
//        jQuery.noConflict();

//        console.log ('jQuery version after noConflict:' + jQuery.fn.jquery)

        //}  catch (e) {
        //      }
        // $(fn_scriptInject);
        // $(callback);

    } //else {

        // jQuery is not loaded
        // optional TODO: check jQuery Version
        var script;
        script = document.createElement("script");
///resource.php/344161-344/jquery-1.7.2.min.js
        script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js");
//        script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js");
//        script.setAttribute("src", "/resource.php/344161-344/jquery-1.7.2.min.js");

//      script.addEventListener('load', fn_scriptInject, false);
        script.addEventListener('load', callback, false);

        document.body.appendChild(script);
    //}

}
 //======================================================================
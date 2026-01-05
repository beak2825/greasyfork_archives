// ==UserScript==
// @name         sailx - teams playing alert
// @namespace    http://http://www.sailx.com/en/profile/userprofile/adbad
// @description  plays an alert sound if someone is present in a teams field.  The use has to install tampermonkey and this script, activate and then open the sailing fields webpage
//
// @author       Adbad  - Adam Wray
// @match        http://www.sailx.com/en/sailing-fields
// @grant        none
// @version 0.0.1.20150926122546
// @downloadURL https://update.greasyfork.org/scripts/12665/sailx%20-%20teams%20playing%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/12665/sailx%20-%20teams%20playing%20alert.meta.js
// ==/UserScript==

var monitor_on;
var play_sound = true;  // future make this a cookies
var do_alert = false;   // future make this a cookie
var delay_time = 3;    // minutes between page refreshes

// now functions to deal with cookies

function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var mon_on = getCookie("monitor_on");
    //    debugger;
    if (mon_on === "") {
        monitor_on = confirm("click OK for monitoring?");
    } else {
        //       debugger;

        if (mon_on ==="true") {
            monitor_on=true;
        } else {
            monitor_on=false;
        }  
    } 
    if(monitor_on) { 
        mon_on ="true";
    } else {
        mon_on = "false";
    }
    setCookie("monitor_on", mon_on, 30);
}



function toggle_mon(){
    // toggles the state of the monitor for teams cookie/ variable

    if (monitor_on) {
        $("#monitor_but").text("Monitor OFF").css('background', 'red');
        monitor_on = false;
    } else {
        $("#monitor_but").text("Monitor ON").css('background', 'green');
        monitor_on = true;
    }
    if(monitor_on) { 
        mon_on ="true";
    } else {
        mon_on = "false";
    }
    setCookie("monitor_on", mon_on, 30);

}

function playSound () {
    // Plays a sound file - find your own favourite sound and put its web address here!

    var audio = new Audio('http://www.soundjay.com/nature/lake-waves-01.mp3');
    audio.play();
}

/************************************************/
/*             Main code                        */
/************************************************/

checkCookie();
setInterval(function() {
    //  sets interval timer to refresh sailing fields page
    window.location.reload();
},delay_time*60000); 

if(monitor_on){                                     //    if monitoring on then make nice green button "on"
    $("#masthead").append("<button id='monitor_but' style='background:green;cursor:pointer;margin: 0 auto; width: auto; text-align: center;'>Monitor ON</button>");
} else {                                           //   make red off button   

    $("#masthead").append("<button id='monitor_but' style='background:red;cursor:pointer;margin: 0 auto; width: auto; text-align: center;'>Monitor OFF</button>");
}
$("#monitor_but").click(toggle_mon);                 // on button click toggle monitoring state

// Code to select team racing fields by finding "team" in the cell of the format column.
// uses jQuery to find all table cells that have a class of format ( format column)

$("td.format").each(function(){                       // for each table cell with class ="format" .....
    if ($(this).html().indexOf('team') >= 0) {        // if the HTMl of the table cell has "team" somewhere in it ....
        if ($(this).next().text()!=="0") {            // This selects the text of the next table cell i.e. the "players" column and checks if its not zero....

            if(monitor_on) {                          //  If monitoring toggle on then ...
                playSound();                          //  Play a sound to notify
                //               alert("some team racing is happening!");
            }

            //stop looking for anymore            
            return(false);
        }
    }
});


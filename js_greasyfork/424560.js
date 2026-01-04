// ==UserScript==
// @name         Walgreens Covid Vaccine Script
// @description  This script helps you book a covid vaccine appointment at Walgreens
// @version      1.1
// @author       Antoine Carpentier
// @match        https://www.walgreens.com/findcare/vaccination/covid-19/appointment/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @namespace    https://greasyfork.org/users/754006
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/424560/Walgreens%20Covid%20Vaccine%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/424560/Walgreens%20Covid%20Vaccine%20Script.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a design change
    introduced in GM 1.0.   It restores the sandbox.
*/

var StopScript = false;
var zipcode = "Placeholder";
var distance = 25;
var Quit = false;

function Vaccine()
{
    if (StopScript == true)
    {
        console.log("Stopping Script.");
        return;
    }

    var Search = document.getElementsByClassName("icon icon__search storeSearchIcon")[0]
    if (Search)
    {
        document.getElementsByClassName("zipCodeSrch pac-target-input")[0].value=zipcode ;
        var event = new Event('input', { bubbles: true });
        document.getElementsByClassName("zipCodeSrch pac-target-input")[0].dispatchEvent(event);
        if (document.getElementsByClassName("pac-container pac-logo"))
        {
            setTimeout(function(){document.getElementsByClassName("pac-container pac-logo").hidden=true},100);
        }

        Search.click()
        setTimeout(function() {TextLookUp()},2000);
    }
    else
    {
        console.log("No area found - Refreshing")
        setTimeout(function() {Vaccine()},2000);
    }
};

function TextLookUp()
{
    if (StopScript == true)
    {
        console.log("Stopping Script.");
        return;
    }

    if ($("body").html().includes("We don't have any available appointments coming up within your area."))
    {
        console.log("No appointment available; reloading.");
        setTimeout(function() {Vaccine()}, 1000);

    }
    else
    {
        if (StopScript == true)
        {
            console.log("Stopping Script.");
            return;
        }

        var button1 = document.getElementsByClassName("btn btn__inline timeSlot ")[0]
        if (button1)
        {
            if (document.getElementsByClassName("distance-text")[0].innerText.slice(0,-3)-distance<Number.EPSILON)
            {
                console.log("Appointment found. Attempting to book.");

                if (StopScript == true)
                {
                    console.log("Stopping Script.");
                    return;
                }

                setTimeout(CheckForError, 750);

                setTimeout(function() {
                    if (StopScript == true)
                    {
                        console.log("Stopping Script.");
                        return;
                    }
                    document.getElementsByClassName("btn btn__inline timeSlot ")[0].click();
                    console.log("First Timeslot Selected");
                }, 1000);

                setTimeout(function() {
                    if (StopScript == true)
                    {
                        console.log("Stopping Script.");
                        return;
                    }
                    document.getElementsByClassName("confirmDoseTimeslots btn btn__blue btn__full-width ")[0].click()
                },2000);


                setTimeout(CheckForError, 2500);

                setTimeout(function() {
                    if (StopScript == true)
                    {
                        console.log("Stopping Script.");
                        return;
                    }
                    document.getElementsByClassName("btn btn__inline timeSlot ")[0].click();
                    console.log("Second Timeslot Selected");
                }, 3500);

                setTimeout(function() {
                    document.getElementsByClassName("confirmDoseTimeslots btn btn__blue btn__full-width ")[0].click();
                    setTimeout(function() {
                        if (document.getElementsByClassName("confirmationContainer")[0])
                        {
                            $("#firstline").text ("Appointment booked!");
                            $("#gmStartBtn").hide();
                            $("#gmStopBtn").html("Quit the script");
                            Quit = true;
                        }
                    }, 750);
                },5000);

                setTimeout(CheckForError, 6000);

                if (document.getElementsByClassName("confirmationContainer")[0])
                {
                    $("#firstline").text ("Appointment booked!");
                }

            }
            else
            {
                console.log(document.getElementsByClassName("distance-text")[0].innerText.slice(0,-3) + "mi > " + distance + "mi - no appointment find within specified distance. Checking again");
                Vaccine();
            }
        }
        else
        {
            setTimeout(TextLookUp, 1000);
        }
    }
};

function ShowHide()
{
    var zipcodelocator = document.getElementsByClassName("zipCodeSrch pac-target-input")
    if (zipcodelocator.length>0)
    {
        console.log("Script running.");
        $("#gmPopupContainer").show ()
    }
    else
    {
        setTimeout(ShowHide,500);
    }
}

function CheckForError()
{
    var serviceerror = document.getElementsByClassName("alert__text-contain")[0]
    if (serviceerror)
    {
        if (serviceerror.lastElementChild.innerHTML.includes("Service unavailable, Please try again later."))
        {
            console.log("An error was detected with this appointment. The search continues.");
            document.getElementsByClassName("secondary")[0].click()
            setTimeout(function() {Vaccine()},300);
        }
        else if (serviceerror.lastElementChild.innerHTML.includes("Appointment time now unavailable."))
        {
            console.log("An error was detected with this appointment. The search continues.");
            document.getElementsByClassName("btn btn__blue")[0].click()
            setTimeout(function() {Vaccine()},300);
        }
    }
}

function RemovePopup()
{
    var i;
    if (document.getElementsByClassName("pac-container pac-logo"))
    {
        for (i=0;i<document.getElementsByClassName("pac-container pac-logo").length;i++)
        {
            document.getElementsByClassName("pac-container pac-logo")[i].remove();
        }
    }
    else if (document.getElementsByClassName("pac-container pac-logo hdpi"))
    {
        for (i=0;i<document.getElementsByClassName("pac-container pac-logo hdpi").length;i++)
        {
            document.getElementsByClassName("pac-container pac-logo hdpi")[i].remove();
        }
    }
    setTimeout(RemovePopup, 500);
}

ShowHide();

//--- Use jQuery to add the form in a "popup" dialog.  style="display: none;"
$("body").append ( '                                                                                                         \
    <div id="gmPopupContainer" style="display: none;">                                                                       \
        <form> <!-- For true form use method="POST" action="YOUR_DESIRED_URL" -->                                            \
                                                                                                                             \
            <p id="firstline"> Make sure you selected the right location in the Walgreens search bar. </p>                   \
            <p id="secondline"> This script will use the inputted location to look for a vaccine appointment. </p>           \
            <div id="maxDistanceContainer">                                                                                  \
                <span id="thirdline" style ="display:inline-block;"> Max Walgreens distance from your location:    </span>   \
                <input id="distanceInput" type="text" style ="display:inline-block;"/>                                       \
                <span id="thirdline2" style ="display:inline-block;">    miles. </span>                                      \
            </div>                                                                                                           \
            <button id="gmStartBtn" type="button">Start the script</button>                                                  \
            <button id="gmStopBtn" type="button">Stop the script</button>                                                    \
        </form>                                                                                                              \
    </div>                                                                                                                   \
' );

//--- Use jQuery to activate the dialog buttons.
$("#gmStartBtn").click ( function () {
    $( "#gmPopupContainer" ).css('background', 'springgreen');
    $("#firstline").text ("The script is running.");
    $("#secondline").hide();
    $("#maxDistanceContainer").hide();
    StopScript = false;
    if (document.getElementsByClassName("zipCodeSrch pac-target-input")[0] && document.getElementsByClassName("zipCodeSrch pac-target-input")[0].value)
    {
        zipcode = document.getElementsByClassName("zipCodeSrch pac-target-input")[0].value;
    }
    if (document.getElementById("distanceInput").value.length >0)
    {
        distance = document.getElementById("distanceInput").value;
    }
    RemovePopup();
    Vaccine();
} );

$("#gmStopBtn").click ( function () {
    if (Quit == true)
    {
        $( "#gmPopupContainer" ).remove();
    }
    else
    {
        $( "#gmPopupContainer" ).css('background', 'powderblue');
        $("#firstline").text ("The script has stopped.");
        $("#maxDistanceContainer").show();
        StopScript = true;
        distance = 25;
    }
} );



//pac-container pac-logo hdpi

//--- CSS styles make it work...
 GM_addStyle ( "                                                 \
    #gmPopupContainer {                                         \
        position:               -webkit-sticky;                 \
        position:               sticky;                         \
        bottom:                 50px;                           \
        width:                  35vw;                           \
        margin-left:            60vw;                           \
        padding:                1em;                            \
        background:             powderblue;                     \
        border:                 3px double black;               \
        border-radius:          1ex;                            \
        z-index:                777;                            \
        font-size:              13px;                           \
        text-align:             center;                         \
    }                                                           \
    #gmPopupContainer button{                                   \
        cursor:                 pointer;                        \
        margin:                 1em 1em 0;                      \
        margin-left:            10px;                           \
        border:                 1px outset buttonface;          \
        padding:                7px 15px;                       \
        background:             ghostwhite;                     \
    }                                                           \
    #gmPopupContainer input{                                    \
        background-color:       ghostwhite;                     \
        opacity:                1;                              \
        height:                 30px;                           \
        line-height:            30px;                           \
        padding:                0 10px;                         \
        border-radius:          8px;                            \
        width:                  50px;                           \
        font-family:            Arial, Helvetica, sans-serif;   \
        font-weight:            normal;                         \
        font-size:              15px;                           \
    }                                                           \
    #gmPopupContainer p,#gmPopupContainer span{                 \
        line-height:            37px;                           \
        opacity:                1;                              \
        margin:                 0 10px;                         \
        font-family:            Arial, Helvetica, sans-serif;   \
        font-weight:            normal;                         \
        font-size:              13px;                           \
    }                                                           \
" );

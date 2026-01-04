// ==UserScript==
// @name         ZocDoc Covid Vaccine
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Zocdoc Covid Vaccine
// @author       Antoine Carpentier
// @match        https://www.zocdoc.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424417/ZocDoc%20Covid%20Vaccine.user.js
// @updateURL https://update.greasyfork.org/scripts/424417/ZocDoc%20Covid%20Vaccine.meta.js
// ==/UserScript==

function Vaccine()
{
    console.log("Initiating Script.")
    var loaded = document.getElementsByClassName("htzklx-11 hskUir")[0];

    if (loaded)
    {
        console.log ("Location list loaded.")

        var bookinglocation = document.getElementsByClassName("yglqz4-2 fNAZIY sc-32axb7-4 jRvRQu")[0]; //location button
        if (bookinglocation)
        {
            console.log("Found a location.")
            bookinglocation.click();

            BookingTime();

        }
        else
        {
            console.log("No available location. Refreshing page.")
            setTimeout(function(){location.reload()}, 1500);
        }

    }
    else
    {
        var fbbutton = document.getElementsByClassName("Button__StyledButton-yglqz4-2 kBrOXt BaseSocialLoginButton__StyledButton-f5hdlm-1 fvxEjA FacebookLoginButton__StyledLoginButton-sc-5wmk57-0 eluZpr")[0]
        if (fbbutton)
        {
            console.log("Logging into Facebook.")
            fbbutton.click()
        }
        else
        {
            var radiobutton = document.getElementsByClassName("textbox__Input-f9jwpk-1 ieYGhk exclude-from-playback")[2]
            if (radiobutton)
            {
                document.getElementsByClassName("Radio__RadioContainer-sc-12d437a-5 jZkvmS YesNoRadioGroup__StyledRadio-sc-1g3yb7j-0 dkcNqu")[0].click()
                document.getElementsByClassName("Radio__RadioContainer-sc-12d437a-5 jZkvmS YesNoRadioGroup__StyledRadio-sc-1g3yb7j-0 dkcNqu")[2].click()
                document.getElementsByClassName("Radio__RadioContainer-sc-12d437a-5 jZkvmS YesNoRadioGroup__StyledRadio-sc-1g3yb7j-0 dkcNqu")[4].click()

                document.getElementsByClassName("textbox__Input-f9jwpk-1 ieYGhk exclude-from-playback")[2].value = "None";
                var event = new Event('input', { bubbles: true });
                document.getElementsByClassName("textbox__Input-f9jwpk-1 ieYGhk exclude-from-playback")[2].dispatchEvent(event);
                setTimeout(function(){document.getElementById("BookApptButton").click()},1000);
                console.log("Finalizing booking");
            }
            else
            {
                setTimeout(Vaccine,500);
            }
        }
    }
}


function BookingTime()
{
    var loadedbookingtime = document.getElementsByClassName("sc-14oxdvn-0 kt5wwf-1 kBYZZr")[0]
    if (loadedbookingtime)
    {
        if (document.getElementsByClassName("sc-1omavku-7 EqEup skiptranslate")[0].innerHTML == "American Airlines Conference Center at Gallagher Way")
        {
            var availableappointment = document.getElementsByClassName("cuhhzo-3 gMYWbC skiptranslate")[0];

            if (availableappointment)
            {
                console.log("Appointment available at selected location!");
                availableappointment.click();
            }
            else
            {
                console.log("No available appointments at selected location - Refreshing page.")
                location.reload();
            }
        }
        else
        {
            console.log("Wrong location - Refreshing");
            location.reload();
        }
    }
    else
    {
        setTimeout(BookingTime,500);
    }
}


Vaccine();

/*
function BookingTime()
{
    var loadedbookingtime = document.getElementsByClassName("sc-14oxdvn-0 kt5wwf-1 kBYZZr")[0]
    if (loadedbookingtime)
    {

        var availableappointment = document.getElementsByClassName("cuhhzo-3 gMYWbC skiptranslate")[0];

        if (availableappointment)
        {
            console.log("Appointment available at selected location!");
            availableappointment.click();
        }
        else
        {
            console.log("No available appointments at selected location - Refreshing page.")
            location.reload();
        }
    }

    else
    {
        setTimeout(BookingTime,500);
    }
}
*/
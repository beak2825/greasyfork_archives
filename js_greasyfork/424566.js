// ==UserScript==
// @name         ZocDoc Covid Vaccine Script
// @namespace    https://greasyfork.org/users/754006
// @version      1.2
// @description  This script helps you book a covid vaccine appointment on Zocdoc
// @author       Antoine Carpentier
// @match        https://www.zocdoc.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424566/ZocDoc%20Covid%20Vaccine%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/424566/ZocDoc%20Covid%20Vaccine%20Script.meta.js
// ==/UserScript==

var i;

function Vaccine()
{
    console.log("Initiating Script.")
    var loaded = document.getElementsByClassName("htzklx-11 hskUir")[0];

    if (loaded)
    {
        console.log ("Location list loaded.")

        var bookinglocation = document.getElementsByClassName("yglqz4-2 fNAZIY sc-32axb7-4 jRvRQu"); //location buttons
        if (bookinglocation.length > 0)
        {
            for (i=0; i < bookinglocation.length; i++)
            {
                var specificLocation = bookinglocation[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.firstElementChild.lastElementChild.firstElementChild.firstElementChild.title
                if (specificLocation.includes(""))
                {
                    console.log("Found the specified location.");
                    bookinglocation[i].click();
                    BookingTime();
                    return;
                }
            }
            console.log("Specified location not available. Refreshing page.")
            setTimeout(function(){location.reload()}, 1500);
        }
        else
        {
            console.log("No available location. Refreshing page.")
            setTimeout(function(){location.reload()}, 1500);
        }

    }
    else
    {
        var fbbutton = document.getElementsByClassName("Button__StyledButton-yglqz4-2 iAUbwA BaseSocialLoginButtonTransparent__StyledButton-rwqyb7-2 uExfa FacebookLoginButtonTransparent__StyledLoginButton-sc-1rfzugu-1 bpqSZg PatientInfoPageView__StyledFacebookLoginButton-iezlhj-2 bsRKPK")[0]
        if (fbbutton)
        {
            console.log("Logging into Facebook.")
            fbbutton.click()
        }
        else
        {
            var radiobutton = document.getElementsByClassName("textbox__Input-f9jwpk-1 ieYGhk exclude-from-playback")
            if (radiobutton[0])
            {
                document.getElementsByClassName("Radio__RadioContainer-sc-12d437a-5 jZkvmS YesNoRadioGroup__StyledRadio-sc-1g3yb7j-0 dkcNqu")[0].click()
                document.getElementsByClassName("Radio__RadioContainer-sc-12d437a-5 jZkvmS YesNoRadioGroup__StyledRadio-sc-1g3yb7j-0 dkcNqu")[2].click()
                document.getElementsByClassName("Radio__RadioContainer-sc-12d437a-5 jZkvmS YesNoRadioGroup__StyledRadio-sc-1g3yb7j-0 dkcNqu")[4].click()

                for (i=0; i < radiobutton.length; i++)
                {
                    if(radiobutton[i].parentElement.parentElement.firstElementChild.textContent.includes("physician"))
                    {
                        document.getElementsByClassName("textbox__Input-f9jwpk-1 ieYGhk exclude-from-playback")[i].value = "None";
                        var event = new Event('input', { bubbles: true });
                        document.getElementsByClassName("textbox__Input-f9jwpk-1 ieYGhk exclude-from-playback")[i].dispatchEvent(event);
                    }
                }
                setTimeout(function(){document.getElementById("BookApptButton").click()},1000);
                console.log("Finalizing booking");

                setTimeout(function()
                           {
                    var noavailability = document.getElementsByClassName("NoAvailabilityView__NoAvailabilityText-sc-54izdc-0 kmDGZM")[0]
                    if (noavailability && noavailability.innerText == "No upcoming appointments available.")
                    {
                        console.log("Appointment no longer available. Back to the location list.");
                        setTimeout(function(){location.replace("https://www.zocdoc.com/vaccine/search/IL?flavor=state-search");},1000);
                    }
                    else
                    {
                        var anotheravailability = document.getElementsByClassName("AppointmentInfoForm__NoticeText-mo1ykz-3 cUIguP")[0]
                        if(anotheravailability && anotheravailability.innerText == "The appointment time you selected is no longer available.")
                        {
                            console.log("Appointment no longer available. Back to the location list.");
                            setTimeout(function(){location.replace("https://www.zocdoc.com/vaccine/search/IL?flavor=state-search");},1000);
                        }
                        else
                        {
                            console.log("Looks good?")
                        }
                    }
                },2500);

            }
            else
            {
                setTimeout(Vaccine,500);
            }
        }
    }
}

Vaccine();


function BookingTime()
{
    var availableappointment = document.getElementsByClassName("cuhhzo-3 gMYWbC skiptranslate")[0]
    var noappointment = document.getElementsByClassName("sc-54izdc-0 dDeVvC")[0]
        if (availableappointment)
        {
            console.log("Appointment available at selected location!");
            availableappointment.click();
        }
        else if (noappointment)
        {
            console.log("No available appointments at selected location - Refreshing page.")
            location.reload();
        }
    else
    {
        setTimeout(BookingTime,500);
    }
}
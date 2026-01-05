// ==UserScript==
// @name          Work Space Automation
// @description   Adding a little touch of automation
// @author        ACM
// @match         *://*/ywr*
// @version       5.2
// @run-at document-end
// @namespace https://greasyfork.org/users/75267
// @downloadURL https://update.greasyfork.org/scripts/24249/Work%20Space%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/24249/Work%20Space%20Automation.meta.js
// ==/UserScript==
// @require http://code.jquery.com/jquery-latest.js
function setupPane()
{
    checkForReservation();
    dateArray = buildDates();
    checkForDateLimit(dateArray[0], dateArray[3]);
    //clickReservationButton();
    checkFlag("a.attMedBlue.ui-btn.ui-icon-plus.ui-btn-icon-left.ui-corner-all.ui-mini", clickReservationButton);
}

function buildDates()
{
    var newDate = getDate();
    var startTime = getCookie('startTime');
    var endTime = getCookie('endTime');

    if (startTime === '')
    {
        startTime = '09:00';
    }
    if (endTime === '')
    {
        endTime = '18:00';
    }

    var dateTime = newDate + ' ' + startTime + '-' + endTime;
    var newDate60 = new Date();
    newDate60.setDate(newDate60.getDate() + 58);
    newDate60 = parseInt(newDate60.getMonth()) + 1 + '/' + newDate60.getDate() + '/' +  newDate60.getFullYear();

    do
    {
        newDateTime = prompt("Would you like to reserve your favorite seat(s) on " + newDate + "? Feel free to change the reservation date in the box below.\nClick OK to continue. Click Cancel to stop. Reservations can only be made 59 days in advance. Please use MM/DD/YYYY HH:MM-HH:MM format.", dateTime);

        if (newDateTime === null)
        {
            break;
        }
        {
            //MM/DD/YYYY HH:MM-HH:MM
            var dateformat = /^((0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}\s(?:[01]\d:[0-5][0-9]|2[0-3]:[0-5][0-9])-(?:[01]\d:[0-5][0-9]|2[0-3]:[0-5][0-9]))$/;

            // Match the date format through regular expression
            if(newDateTime.match(dateformat))
            {
                invalidDate = 0;
                break;
            }
            else
            {
                alert('Invalid date format. Please use MM/DD/YYYY HH:MM-HH:MM format');
                invalidDate = 1;
            }
        }
    }
    while (invalidDate !== 0);
    if (newDateTime === null)
    {
        console.log('User clicked cancel');
        throw new Error();
    }
    newDateArray = newDateTime.split(' ');
    newDate = newDateArray[0];
    newTimeArray = newDateArray[1].split('-');
    setCookie('startTime', newTimeArray[0], 900);
    setCookie('endTime', newTimeArray[1], 900);
    startTime = convertTo12Hour(newTimeArray[0]);
    endTime = convertTo12Hour(newTimeArray[1]);

    return [newDate, startTime, endTime, newDate60];
}

function checkForReservation()
{
    // Check to see if the user needs to check in to a reservation first
    var shouldExit = 0;
    $("div.resButton.checkinButton").each(function(index, obj){
        if( ( $(this).attr('class') == ('resButton checkinButton') ) && ( $(obj).html().indexOf('Check In') !== -1 ) )
        {
            alert('Good morning! Please click the Check In button before making more reservations.');
            throw new Error();
        }
    });
}

function checkForDateLimit(newDate, newDate60)
{
    if (new Date(newDate) > new Date(newDate60))
    {
        alert ('The Workplace Reservation Website will only let you reserve 59 days from today. Please try again tomorrow to reserve a seat for ' + newDate);
        throw new Error();
    }
}

function clickReservationButton()
{
    console.log('Before Click New Reservation Button (lower left of screen)');

    $("a.attMedBlue.ui-btn.ui-icon-plus.ui-btn-icon-left.ui-corner-all.ui-mini").each(function(index, obj){
        if( $(obj).html().indexOf('New Reservation') !== -1  )
        {
            $(obj).click();
        }
    });
    //clickMyFavoritesButton();
    checkFlag("a.attMedBlue.ui-btn.ui-corner-all.ui-icon-star.ui-btn-icon-left.ui-mini.Xui-btn-inline", clickMyFavoritesButton);

    console.log('After Click New Reservation Button (lower left of screen)');
}

function clickMyFavoritesButton()
{
    console.log('Before Click My Favorites');

    $("#StartDate").val(dateArray[0]);
    $("#StartTime").val(dateArray[1]);
    $("#EndTime").val(dateArray[2]);

    // Open clock
    clickMe("a.ui-input-clear.ui-btn.ui-icon-clock.ui-btn-icon-notext.ui-corner-all", 250);

    // Close clock
    clickMe("a.ui-btn.ui-btn-a.ui-icon-check.ui-btn-icon-left.ui-shadow.ui-corner-all.ui-first-child.ui-last-child", 750);

    // Open the calendar
    setTimeout(function()
    {
        $("a.ui-input-clear.ui-btn.ui-icon-calendar.ui-btn-icon-notext.ui-corner-all").each(function(index, obj){
            $(obj).click();
        });
    }, 1000);

    // Click already selected calendar date and close calendar
    clickMe("div.ui-datebox-griddate.ui-corner-all.ui-btn.ui-btn-d", 1250);

    setTimeout(function()
    {
        $("a.attMedBlue.ui-btn.ui-corner-all.ui-icon-star.ui-btn-icon-left.ui-mini.Xui-btn-inline").each(function(index, obj){
            if( $(obj).html().indexOf('Favorite Spaces') !== -1  )
            {
                $(obj).click();
            }
        });
    }, 2000);

    //checkFlag("a.ui-input-clear.ui-btn.ui-icon-calendar.ui-btn-icon-notext.ui-corner-all", setFavoriteDate);
    //TODO: race condition that needs fixed
    //Need to find a class, name, or id that's unique to the availability page. Then run function below.
    setTimeout(function(){ checkAvailability(); }, 8000);

    return 0;
}

function clickMe(classPath, timeLength)
{
    setTimeout(function(){ $(classPath).click();}, timeLength);
}

function checkAvailability()
{
    console.log('Before Check Availability');
    var seatTaken = 0;

    if(! $("a.ui-btn.ui-shadow.ui-corner-all.ui-icon-plus.ui-btn-icon-notext.ui-btn-inline").html())
    {
        window.history.back();
        var alertVar = 'It seems that you have not set up any Favorite Seats (or workspace) ' +
            'in the Your Workplace Reservation website. ' +
            'Chrome users can copy these instructions to the clipboard by pressing CTRL-C. ' +
            'Firefox users need to select these instructions first then press CTRL-C. ' +
            'After closing this box, follow these steps: \n\n' +
            '1) Click the Add Space Button \n' +
            '2) Type in your work address (ie 1010 Pine) \n' +
            '3) Pick the correct work location that appears \n' +
            '4) Scroll down and find a seat that you like \n' +
            '5) Click on the picture of the seat that you like (on the left) \n' +
            '6) Click the yellow star in the upper right hand corner of the screen \n' +
            '7) You now have a favorite seat. There is not a save button to click \n' +
            '8) Refresh the page (click F5) so this script can run again \n';
        alert(alertVar);
        throw new Error();
        //return 0;
    }

    $("a.ui-btn.ui-shadow.ui-corner-all.ui-icon-plus.ui-btn-icon-notext.ui-btn-inline.ng-hide").each(function(index, obj){
        seatTaken = 1;
        return 0;
    });

    console.log('After Check Availability');

    if (seatTaken == 1)
    {
        var alertMessage = "" +
            "Some of your favorite seats have been reserved by someone else. " +
            "Please pick a new seat and manually finish the reservation. " +
            "Click the workspace picture on the left, scroll down, then " +
            "click Details, to see who reserved your favorite seat.";
        alert(alertMessage);
        throw new Error();

    }
    else
    {
        // Click Plus sign to add favorite
        clickPlusSignToAddFavorite();
    }
}

function clickPlusSignToAddFavorite()
{
    console.log('Before Click Plus sign to add favorite');
    setTimeout(function()
    {
        $("a.ui-btn.ui-shadow.ui-corner-all.ui-icon-plus.ui-btn-icon-notext.ui-btn-inline").click();
        clickAddToReservation();
    }, 1000);
    console.log('After Click Plus sign to add favorite');
}

function clickAddToReservation()
{
    console.log('Before Click Add To Reservation Button');
    setTimeout(function()
    {
        $("a.attMedBlue.ui-btn.ui-icon-plus.ui-btn-icon-left.ui-corner-all").each(function(index, obj){
            if( $(obj).html().indexOf('Add to Reservation') !== -1  )
            {
                setTimeout(function(){  $(obj).click();}, 1000);
                //console.log($(obj).html());
            }
        });
        clickConfirmReservation();
    }, 1000);
    console.log('After Click Add To Reservation Button');
}

function clickConfirmReservation()
{
    console.log('Before Click Confirm Reservation Button');
    setTimeout(function()
    {
        $("button.attMedBlue.ui-btn.ui-icon-check.ui-btn-icon-left.ui-corner-all").each(function(index, obj){
            if( $(obj).html().indexOf('Confirm Reservation') !== -1  )
            {
                setTimeout(function(){  $(obj).click();}, 1000);
            }
        });
        //clickYesContinueButton();
    }, 1000);
    console.log('After Click Confirm Reservation Button');
}

function clickYesContinueButton()
{
    //This works but does not always land you back at the home screen
    console.log('Before Click Yes - Continue Button');
    setTimeout(function()
    {
        $("a.ui-shadow.ui-btn.ui-corner-all.ui-btn-b.ui-icon-check.ui-btn-icon-left.ui-btn-inline.ui-mini").each(function(index, obj){
            if( $(obj).html().indexOf('Yes - Continue') !== -1  )
            {
                setTimeout(function(){  $(obj).click();}, 1000);
            }
        });
        clickHomeButton();
    }, 1000);
    console.log('After Click Yes - Continue Button');
}

function clickHomeButton()
{
    //This works but does not always land you back at the home screen
    console.log('Before Click Home Button');
    setTimeout(function()
    {
        $("a.ui-nodisc-icon.ui-alt-icon.ui-btn-right.ui-btn.ui-icon-home.ui-btn-icon-notext.ui-corner-all").each(function(index, obj){
            if( $(obj).html().indexOf('Home') !== -1  )
            {
                setTimeout(function(){  $(obj).click();}, 1000);
            }
        });
    }, 1000);
    console.log('After Click Home Button');
}

function getDate()
{
    var lastDate = '';
    $("li.ui-li-divider.ui-bar-inherit").each(function(index, obj){
        lastDate = $(obj).html();
        //console.log(lastDate);
    });

    if (lastDate !== '')
    {
        lastDate = new Date(lastDate);
    }
    else
    {
        lastDate = new Date();
    }

    var day = lastDate.getDay();
    var newDate;
    switch(day)
    {
        case 5:
            newDate = lastDate.setDate(lastDate.getDate() + 3);
            break;
        case 6:
            newDate = lastDate.setDate(lastDate.getDate() + 2);
            break;
        default:
            newDate = lastDate.setDate(lastDate.getDate() + 1);
    }

    newDate = new Date(newDate);
    var fullMonth = (1 + newDate.getMonth()).toString();
    fullMonth = fullMonth.length > 1 ? fullMonth : '0' + fullMonth;

    var fullDay = newDate.getDate().toString();
    fullDay = fullDay.length > 1 ? fullDay : '0' + fullDay;

    return fullMonth + '/' + fullDay + '/' +  newDate.getFullYear();
}

function setBanner()
{
    // Put a warning that this script might change
    var userName = $("div.welcome.ng-binding").html();
    //var messageUpdateContent = userName + "! Thank you for using the YWR Userscript.\\n";

    //var messageUpdate = '<a style="color: red" href="#" onClick="alert(\'' + messageUpdateContent + '\')">Please Read!</a> ';
    var bannerMessage = "Thank you for using the YWR Userscript! Contact <a href='mailto:am9518?" +
                        "Subject=Work%20Place%20Automation%20Question'>am9518</a> for script issues.<br>";

    var updateMessage = "<h2>To run the YWR Userscript follow these steps</h2><br><br>" +
        "1) Be patient! The script has to wait for the YWR database and website to respond.<br>" +
        "2) Wait for the pop up box to show and enter your rez date in 05/06/2017 09:00-18:00 format or use the date and time the script auto suggests.<br>" +
        "3) Press OK and wait 15-20 seconds.<br>" +
        "4) Click this button >> <input type=\"button\" value=\"Refresh Page\" onClick=\"window.location.reload(true);\"> to start the process over to reserve another day<br><br>" +
        "Contact am9518 for issues<br>Version 5.2 1/21/2018";

    //$("h1.ui-title").html(messageUpdate + bannerMessage);
    $("h1.ui-title").css("color", "white");
    $("h1.ui-title").css("font-size", "12px");
    $("div.res-col-b.placeholder").html(updateMessage);

}
function addButton()
{
    console.log( $("div.ui-footer.ui-bar-inherit.ui-footer-fixed.slideup").html() );
    console.log( $("a.ui-input-clear.ui-btn.ui-icon-clock.ui-btn-icon-notext.ui-corner-all").html() );
    var buttonAddRez= $('<input type="button" value="Reserve My Favorite Spot" onClick="setupPane()" />');
    $("div.ui-footer.ui-bar-inherit.ui-footer-fixed.slideup").append(buttonAddRez);
}

function convertTo12Hour(time)
{
    var hoursArray = time.split(':');
    var hours = parseInt(hoursArray[0]);
    var minutes = hoursArray[1];

    if(hours > 12)
    {
        hours = hours - 12;
        if (hours.toString().length === 1)
        {
            hours = '0' + hours.toString();
        }
        time = hours + ':' + minutes + ' PM';
    }
    else
    {
        time = time + ' AM';
    }

    return time;
}

function getCookie(cname)
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++)
    {
        var c = ca[i];
        while (c.charAt(0)==' ')
        {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0)
        {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays)
{
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function checkFlag(objToWaitFor, funcName)
{
    if($(objToWaitFor).length === 0)
    {
        window.setTimeout(function() {checkFlag(objToWaitFor, funcName); }, 1000);  /* this checks the flag every 100 milliseconds*/
        console.log('Waiting on ' + objToWaitFor + ' to load');
    }
    else
    {
        console.log('Loaded ' + objToWaitFor);
        funcName();
    }
}

flag = false;
setBanner();
$(window).bind('load', function()
{
    setTimeout(function(){ setBanner(); }, 100);

    if (getCookie('startTime'))
    {
        checkFlag("li.ui-li-divider.ui-bar-inherit.ui-first-child", setupPane);
    }
    else
    {
        console.log('No cookie found. Hardcoding the wait.');
        setTimeout(function(){ setupPane(); }, 5000);
    }
    //setTimeout(function(){ addButton(); }, 500);
});

// ==UserScript==
// @name         Bath University myTimetable (beta)
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       Artem Nosov
// @match        *://*.mytimetable.bath.ac.uk/*
// @grant        none
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/396901/Bath%20University%20myTimetable%20%28beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/396901/Bath%20University%20myTimetable%20%28beta%29.meta.js
// ==/UserScript==


$(document).ready(function() { //When document has loaded

    setTimeout(function() {
        //get the list of module as an array listOfUits:
        var listOfModuleClasses = jQuery('.GCUXQXIIJ').children();
        var i = 0; var j = 0;
        var nModules = listOfModuleClasses.length;
        var listOfUnits = []; var moduleName = "";
        for (i = 0; i < nModules; i++)
        {
            moduleName = jQuery(listOfModuleClasses[i]).text();
            moduleName = moduleName.slice(2,2+7);
            listOfUnits[i] = moduleName;
        }

        //create class ColourPickker:
        jQuery('.GCUXQXIIJ').append('<div class="ColorPickker"><\div>');
        jQuery('.ColorPickker').attr("style","position: relative; top: 30px");
        //go through each unit and create a button for each:
        function CreateButtons() {
            var colour = "";
            var handInTime = "";
            var handInDay = "";
            for (i = 0; i < nModules; i++)
            {
                var modulei = 'module'.concat(i.toString())
                var string0 = '<div class="'.concat(modulei,'"<\div>');
                colour = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
                if (listOfUnits[i] == "MA20216") { colour = "#A3F9A8"; handInTime=""; handInDay="Thu"; }  //here go the colours, problem sheet hand in dates and times.
                if (listOfUnits[i] == "MA20218") { colour = "#FF8C7C"; handInTime=""; handInDay="Thu"; }
                if (listOfUnits[i] == "MA20226") { colour = "#84ADFF"; handInTime=""; handInDay="Thu"; }
                if (listOfUnits[i] == "MA20220") { colour = "#D3A5FF"; handInTime=""; handInDay="Thu"; }
                if (listOfUnits[i] == "ES20069") { colour = "#D7D7D7"; handInTime=""; handInDay="Thu"; }
                if (listOfUnits[i] == "CM20256") { colour = "#EEB5ED"; handInTime="09:00"; handInDay="Fri"; }
                if (listOfUnits[i] == "MA20227") { colour = "#84ADFF"; handInTime="10:00"; handInDay="Mon"; }
                if (listOfUnits[i] == "MA20217") { colour = "#A3F9A8"; handInTime=""; handInDay="Wed"; }
                if (listOfUnits[i] == "MA20221") { colour = "#FFC96B"; handInTime=""; handInDay="Wed"; }
                if (listOfUnits[i] == "MA20223") { colour = "#D7D7D7"; handInTime=""; handInDay="Thu"; }

                var string1 = '<input type="color" id="body" name="body"value="'.concat(colour,'"><input type="time" id="appt" name="appt" min="08:00" max="21:00" value="" style="position: relative; left: 10px; top: -4px"><select name="weekday" class="weekdaySelector" style="position: relative; left: 15px; top: -4px" value="<% =rs("><option value="Monday">Mon</option><option value="Tuesday">Tue</option><option value="Wednesday">Wed</option><option value="Thursday">Thu</option><option value="Friday">Fri</option><option value="Saturday">Sat</option><option value="Sunday">Sun</option></select><label for="body">')
                var string2 = listOfUnits[i];
                var string3 = '</label>';
                jQuery('.ColorPickker').append(string0.concat(string1,string2,string3)) //  <- create a colour selector
                jQuery('.'.concat(modulei)).children()[1].value = handInTime;
                jQuery('.'.concat(modulei)).children()[2].value = handInDay;
            }
        }
        CreateButtons();

        //create a submit button that when pressed will assign colours:
        jQuery('.ColorPickker').append('<div class="SubmitButton"><button type="button">Submit Colours</button></div>');



        //button is clicked:
        function SubmitColours()
        {
            if (jQuery('#goldenBar').length != 0)
            {
                jQuery('#goldenBar').remove();
            }
            var listOfColours = [];
            for (i = 0; i < nModules; i++)
            {
                listOfColours[i] = jQuery('.module'.concat(i.toString())).children()[0].value;
            }
            var classDayName;
            var colour = "";
            var t = "";
            for (i = 0; i < 5; i++) //  <- in each week (there are 5 days)
            {
                classDayName = '.day-'.concat((i+2).toString());
                t = jQuery(classDayName).children().children()       //list of classes in day i       // :O !
                for (j = 0; j < t.length; j++) //  <- in each day (there are t.length classes)
                {
                    if (t[j].id != "goldenBar")
                    {
                        //get module name
                        moduleName = jQuery(t[j]).text().slice(13, 20);
                        var index = 0;
                        while (listOfUnits[index] != moduleName)
                        {
                            index = index + 1;
                        }
                        colour = listOfColours[index];
                        //change the color attribute:

                        jQuery(classDayName).children().children()[j].style.backgroundColor = colour;
                    }
                }
            }
        }

        jQuery('.SubmitButton').click(function() {
            SubmitColours();
        });

        // make the timetable colourfull
        /*
    var MA20216 = "#A3F9A8"; //green
    var MA20218 = "#FF8C7C"; //orange
    var MA20226 = "#84ADFF"; //blue
    var MA20220 = "#D385FF"; //purple
    var ES20069 = "lightgray";
    var classDayName;
    var colour = "";
    for (i = 0; i < 5; i++)
    {
        classDayName = '.day-'.concat((i+2).toString());
        t = jQuery(classDayName).children().children()       //list of classes in day i       // :O !
        for (j = 0; j < t.length; j++)
        {
            //get module name
            moduleName = jQuery(t[j]).text().slice(13, 20);
            if (moduleName == "MA20216") { colour = MA20216; }
            if (moduleName == "MA20218") { colour = MA20218; }
            if (moduleName == "MA20226") { colour = MA20226; }
            if (moduleName == "MA20220") { colour = MA20220; }
            if (moduleName == "ES20069") { colour = ES20069; }
            //change the color attribute:
            jQuery('.day-'.concat((i+2).toString())).children().children()[j].style.backgroundColor = colour;
        }
    }
    */


        //jQuery('.mytimetable-application-panel').remove()
        function addGoldenBar()
        {
            var d = new Date();
            var hours = d.getUTCHours();
            var minutes = d.getUTCMinutes();
            var adjustmentFactor = 0;
            if (minutes > 15)
            {
                adjustmentFactor = 1;
            }
            var L = jQuery('.wc-today').children().children();
            var nLectures = L.length;
            var lectureArr = [];
            var counter = 0;
            i = 0; j = 0;
            var timeArr = [];
            var startTime;
            var nextLecture = [];
            for (i = 0; i < nLectures; i++)
            {
                var lectureName = jQuery(L[i]).text();
                if (lectureName != "")
                {
                    startTime = parseInt(lectureName.slice(0, 2)); //HOURS:15
                    lectureName = lectureName.slice(13,20);
                    if (startTime > (hours + adjustmentFactor - 1) && nextLecture == "")
                    {
                        nextLecture[0] = startTime;
                        nextLecture[1] = lectureName;
                        nextLecture[2] = jQuery(L[i]).children().children().children('.wc-locations').text();
                    }
                    lectureArr[counter] = lectureName;
                    timeArr[counter] = startTime;
                    counter = counter + 1;
                }
            }
            var hoursUntilNextLec = nextLecture[0] - hours - adjustmentFactor;
            var minutesUntilNextLec = 15 - minutes;
            if (minutesUntilNextLec < 0)
            {
                minutesUntilNextLec = minutesUntilNextLec + 60;
            }

            var stringMessage = "";
            if (nextLecture[0] != "")
            {
                if (hoursUntilNextLec == 0)
                {
                    stringMessage = nextLecture[1].concat(" in ", minutesUntilNextLec, "min ", "at ", nextLecture[2]);
                }
                if (hoursUntilNextLec > 0)
                {
                    stringMessage = nextLecture[1].concat(" in ", hoursUntilNextLec, "hr ", minutesUntilNextLec, "min ", "at ", nextLecture[2]);
                }
            }

            //var hrHeight = parseInt(t[0].style.top.slice(0,3)) / parseInt(t[0].innerText.slice(0,2)) //this works bad on small screen like MacBook 13"
            //var hrHeight = parseInt(jQuery('.wc-hour-header')[30].style.height.slice(0,2)) + 11;     //? ? ?
            var hrHeight = parseInt(jQuery('.wc-day-column-inner')[1].style.height) / 24;              //gets height of the 24 hour page and divides by 24
            var pixelPosition = Math.floor(hours*hrHeight + minutes*(hrHeight/60));

            var stringThing1 = '<div class="wc-cal-event color-3 removable" style="top: ';
            var stringThing2 = 'px; width: 100%; left: 0%;" id="goldenBar"><div class="wc-cal-event-border" style=';
            //stringMessage goes here
            var stringThing3 = '"height: 4px; min-height: 4px; background-color: gold; border: ">';   //thickness and colour of the line
            if (stringMessage != "")
            {
                stringThing3 = '"height: 17px; min-height: 17px; background-color: gold; border: ">'; //make the line thinner if empty
            }
            var stringThing4 = '</div></div>';
            var fullString = stringThing1.concat(pixelPosition.toString(),stringThing2,stringThing3,stringMessage,stringThing4);
            // golden bar done!
            //submit the colours
            jQuery('.wc-today .wc-day-column-inner').append(fullString); //add golden bar
        }
        addGoldenBar();
        SubmitColours(); //jQuery('.SubmitButton').click();

        //add the current time line


        jQuery(':button').click(function() {
            setTimeout(function() {
                if (jQuery('.GCUXQXIJP').length != 0) //popup is open
                {
                    //call a function which runs when !CLOSE! is pressed (jQuery('.GCUXQXIGK').length)
                }
                addGoldenBar();
                jQuery('.SubmitButton').click()
            }, 100);
        });

        jQuery('.gwt-Anchor').click(function() {
            jQuery('.gwt-InlineLabel').click(function() {
                jQuery('.GCUXQXIGK').click(function() {   //This is run when CLOSE is pressed. Can this instead be a gwt-CheckBox press?
                    SubmitColours();
                    addGoldenBar();
                });
            });
        });

        jQuery('.imageCheckBox-fakeBox').click(function() {
            setTimeout(function() {
                jQuery('.wc-today .wc-day-column-inner').append(fullString);
                jQuery('.SubmitButton').click()
            }, 100);
        });




        //jQuery('.GCUXQXIGQ').children()[7].style.top = "-".concat((9*hrHeight).toString(),"px");
    }, 600); //0.6 seconds will elapse and Code will execute.



});


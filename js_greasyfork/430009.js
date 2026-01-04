// ==UserScript==
// @name         NEU Schedule Creator
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Go to banner -> registration history -> switch from schedule calendar to schedule details at the bottom then press "t". A new page will open with your schedule formatted
// @author       Big Beans
// @match        https://nubanner.neu.edu/StudentRegistrationSsb/ssb/registrationHistory/registrationHistory
// @icon         https://www.google.com/s2/favicons?domain=neu.edu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430009/NEU%20Schedule%20Creator.user.js
// @updateURL https://update.greasyfork.org/scripts/430009/NEU%20Schedule%20Creator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var override=`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    </style>
    <meta name="viewport" content="width=device-width">
    <title>Schedule</title>
  </head>
  <body>
      <style>

:root {
    font-size: 13px;
    --primary: #14A2FF !important;
}

body {
	-webkit-font-smoothing: antialiased;

}

.container {
    min-width: 720px;
}


header a {
	text-decoration: inherit;
}

header a:hover, header span:hover {
	color:inherit;
	text-decoration: inherit;
}

header {
    margin-top: 2rem;
    margin-bottom: 2.5rem;
    justify-content: space-between;
}

header.row {
    position: relative;
}

.header-element {
    margin: auto 15px;
}

.header-element .nav-item {
    font-family: 'Avenir',BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
}

h1 {
    font-family: 'Oleo Script', cursive;
    color: #14A2FF !important;
    margin-bottom: 0;
    font-weight: 600;
    font-size: 2.8rem;
}


#cal-headers {
    margin-bottom: 1rem;
}

.cal-col-class-detail {
    flex-grow: 1.5;
    min-width: 180px;
    /* use a white background to clear out any extending hour lines */
    background: white;
}

#class-detail {
    padding: 1rem;
    border-radius: 1rem;
    background-color: #eee;
    position: relative;
    text-align:center;
}






/* End of scheduler plug */

.cal-header-col {
    text-align: center;
}

.cal-col {
    position: relative;
}

#calendar {
    position: relative;
}



.class-card {
    font-size: 12px;
    box-sizing: border-box;
    position: absolute;
    background-color: lightgray;
    border-radius: 1rem;
    text-align: center;
    padding: .5rem .25rem;
    margin-bottom: .5rem;
    cursor: pointer;
    user-select: none;
    width: calc(100% - 30px);
    min-width: 50px;
    box-shadow: 0 0 1px rgba(30, 30, 30,.25);
    transition: box-shadow .1s ease-in-out;
}

.class-card-hover {
    box-sizing: border-box;
    box-shadow: 0 0 3px rgba(30, 30, 30, .75);
    transition: box-shadow .1s ease-in-out;
}

.class-card-bring-to-front {
    z-index: 999;
}

.class-card .class-name {
    margin-top: 0.25rem;
    margin-right: 0.5rem;
    margin-bottom: 0.4rem;
    margin-left: 0.5rem;
    font-weight: 500;
    line-height: 1em;
}

.class-card div.class-time, div.class-location {
    color:  rgba(0, 0, 0, .5);
    font-size: 0.85em;
}

.class-card div {
    margin-top: -.25rem;
    margin-bottom: 0;
}



@media only screen and (max-width: 800px) {
    .hour-line::before {
        left: -25px;
        top: 5px;
        transition: .25s;
    }
}

@media only screen and (max-width: 992px) {
    :root {
        font-size: 12px;
    }

    .hour-line {
        width: calc(100%/7 * 5 + 10px);
    }

    .cal-header-suffix {
        display: none;
    }

    /* a bit hacky, but it's the only way to get around browser-enforced min font sizes */
    .class-card .class-name {
        margin-top: 1rem;
        width: 100%;
        transform: scale(.8) translateY(.5rem);
        margin-left: 0
    }

    .class-card .class-location, .class-card .class-time {
        display: none;
    }

    .chosen-container-single .chosen-default{
        font-size: 10px !important;
    }

    #scheduler-plug-school-dropdown{
        font-size: 9px !important;
        width:100% !important;
        margin-left: 3%;
        margin-top:5px;
    }

    #scheduler-plug .chosen-container-single{
        width:100% !important;
        margin-left: 0;
    }

    #scheduler-plug{
        padding-top: 16px;
    }

    .scheduler-plug-text {
        font-size: 11px;
    }

    .colorOption{
        width: 1.7rem;
        height: 1.7rem;
    }
}



hr+hr {
    margin-top: 72px;
    border: none;
    height: 1px;
    dashed: black;
    background-color: grey; /* Modern Browsers */
    left:0;
}

.first {
    border-radius:2px;
    border: none;
    height: 1px;
    background-color: grey;
}
#hours+#hours {
    margin-top: 50px;
    dashed:black;
    right:0;
}
</style>
      <link defer="" rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
      <div>

      <div class="container">
                          <!-- Calendar headers -->
                <div class="row" id="cal-headers">
                    <div class="col cal-header-col">
                        Mon<span class="cal-header-suffix">day</span>
                    </div>
                    <div class="col cal-header-col">
                        Tue<span class="cal-header-suffix">sday</span>
                    </div>
                    <div class="col cal-header-col">
                        Wed<span class="cal-header-suffix">nesday</span>
                    </div>
                    <div class="col cal-header-col">
                        Thu<span class="cal-header-suffix">rsday</span>
                    </div>
                    <div class="col cal-header-col">
                        Fri<span class="cal-header-suffix">day</span>
                    </div>
                    <div class="col cal-header-col cal-weekend-header-col" style="display: none">
                        Sat<span class="cal-header-suffix">urday</span>
                    </div>
                    <div class="col cal-header-col cal-weekend-header-col" style="display: none">
                        Sun<span class="cal-header-suffix">day</span>
                    </div>
                    <div class="col cal-header-col cal-col-class-detail">
                    </div>
                </div>

                <!-- Calendar Columns -->
                <div class="row" id="calendar" style="height: 780px;">
                    <div class="hours">8 AM</div>

                    <div class="col cal-col" id="cal-col-monday">
                        <hr class="first">
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr> --- 6 PM ---



        </div>
                    <div class="col cal-col" id="cal-col-tuesday">
                        <hr class="first">
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>

        </div>
                    <div class="col cal-col" id="cal-col-wednesday">
                        <hr class="first">
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>


        </div>
                    <div class="col cal-col" id="cal-col-thursday">
                        <hr class="first">
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>

        </div>
                    <div class="col cal-col" id="cal-col-friday">
                        <hr class="first">
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>
                        <hr>


        </div>
                    <div class="col cal-col cal-weekend-col" id="cal-col-saturday" style="display: none"></div>
                    <div class="col cal-col cal-weekend-col" id="cal-col-sunday" style="display: none"></div>
                    <div class="col cal-col-class-detail">
                        <div id="class-detail" style="font-size:16px"><b>Northeastern University</b></div>
                        <br>
                        <div id="class-detail" style="font-size:14px"><span id="name"></span></div>
                        <br>
                        <div id="class-detail"><span id="credits"></span></div>
                        <br>
                        <div id="class-detail"><span id="semester"></span></div>
                    </div>
            </div>

            </div>
  </body>
</html>`;
    function main(event){
        var colors = ['(0,102,204)','(255,178,102)','(153,255,153)','(255,102,255)','(204,255,229)','(255,204,204)','(255, 127, 80)','(141, 188, 143)','(238, 130, 238)']
        var name=document.getElementById("username").getElementsByTagName("span")[0].innerHTML;
        var term=document.getElementsByClassName("schedule-list-view-title-text")[0].innerHTML;
        var credits=0;
        var classes=document.getElementsByClassName("list-view-course-title");
        var odds=document.getElementsByClassName("odd");
        var evens=document.getElementsByClassName("even");
        var meetings=document.getElementsByClassName("listViewMeetingInformation");
        var days=document.getElementsByClassName("ui-pillbox-summary screen-reader");
        var buildingRegex="<span class=\"bold\">Building:</span>(.*)<span class=\"bold\">Room:</span>";
        var roomRegex="<span class=\"bold\">Room:</span>(.*)<br>";
        var courseHalls=[];//odd->even->odd->even
        var numberRegex="8%;\">(.*),";
        var courses=[];//odd->even->odd->even
        var courseNumbers=[]; //odds->even
        var courseSections=[];//odds-> even
        var meetingTimes=[];//odd->even->odd->even
        var meetingDays=[];//odds->even->odd->even
        let i=0;
        for (let j=0;j<classes.length;j++){
            courseNumbers[j]=odds[i].innerHTML.match(numberRegex)[1];
            courseSections[j]=odds[i].innerHTML[odds[i].innerHTML.indexOf(courseNumbers[j])+courseNumbers[j].length+2]+odds[i].innerHTML[odds[i].innerHTML.indexOf(courseNumbers[j])+courseNumbers[j].length+3];
            if (i<evens.length){
                courseNumbers[j+1]=evens[i].innerHTML.match(numberRegex)[1];
                courseSections[j+1]=evens[i].innerHTML[evens[i].innerHTML.indexOf(courseNumbers[j+1])+courseNumbers[j+1].length+2]+evens[i].innerHTML[evens[i].innerHTML.indexOf(courseNumbers[j+1])+courseNumbers[j+1].length+3];
                j++;
            }
            i++;
        }
        for (let i=0;i<meetings.length;i++){
            courses[i]=document.getElementsByClassName("list-view-course-title")[i].getElementsByTagName("a")[0].innerHTML;
            meetingTimes[i] = meetings[i].getElementsByTagName("span")[2].getElementsByTagName("span")[0].innerHTML+":"+meetings[i].getElementsByTagName("span")[2].getElementsByTagName("span")[1].innerHTML+" - "+meetings[i].getElementsByTagName("span")[2].getElementsByTagName("span")[2].innerHTML+":"+meetings[i].getElementsByTagName("span")[2].getElementsByTagName("span")[3].innerHTML;
            meetingDays[i]=days[i].innerHTML;
            courseHalls[i]=meetings[i].innerHTML.match(buildingRegex)[1].replace("&nbsp;","")+meetings[i].innerHTML.match(roomRegex)[1];
        }
        for (let i=0;i<courses.length;i++){
            credits+=parseInt(document.querySelectorAll('[xe-field="creditHours"]')[i+1].innerHTML);
        }
        var coursesFinal = createObjects(courses,courseNumbers,courseSections,meetingTimes,meetingDays,courseHalls,colors);
        makeSchedule(coursesFinal);
        extraneous(name,credits,term);
        document.write(override);
    };


    function createObjects(courses,courseNumbers,courseSections,meetingTimes,meetingDays,courseHalls, colors){
        var courseObjects=[],height=0,topPX=0;
        for (let i=0;i<courses.length;i++){
           height = 1.2*(((parseInt(meetingTimes[i].split(" - ")[1].substring(0,2))<8) ? ((12+parseInt(meetingTimes[i].split(" - ")[1].substring(0,2)))*60) +parseInt(meetingTimes[i].split(" - ")[1].substring(3,5)): ((parseInt(meetingTimes[i].split(" - ")[1].substring(0,2)))*60) + parseInt(meetingTimes[i].split(" - ")[1].substring(3,5)))-        ((parseInt(meetingTimes[i].split(" - ")[0].substring(0,2))<8) ? ((12+parseInt(meetingTimes[i].split(" - ")[0].substring(0,2)))*60) +parseInt(meetingTimes[i].split(" - ")[0].substring(3,5)): ((parseInt(meetingTimes[i].split(" - ")[0].substring(0,2)))*60) + parseInt(meetingTimes[i].split(" - ")[0].substring(3,5))));

           if (parseInt(meetingTimes[i].split(" - ")[0].substring(0,2))<8){
               topPX=(12+parseInt(meetingTimes[i].split(" - ")[0].substring(0,2)))*60 + parseInt(meetingTimes[i].split(" - ")[0].substring(3,5));
           }
           else {
               topPX=(parseInt(meetingTimes[i].split(" - ")[0].substring(0,2)))*60 + parseInt(meetingTimes[i].split(" - ")[0].substring(3,5));
           }
           topPX = 1.2*topPX - 576;
           courseObjects[i]={name:courses[i],number:courseNumbers[i],section:courseSections[i],time:meetingTimes[i],days:meetingDays[i],hall:courseHalls[i],topPX:topPX,height:height,color:colors[i]};
        }
        return courseObjects;
    };
    function makeSchedule(courseObjects){
        for (let i=0;i<courseObjects.length;i++){
            if (courseObjects[i].days.includes("Monday")){
                append(courseObjects[i],"Monday");
            }
            if (courseObjects[i].days.includes("Tuesday")){
                append(courseObjects[i],"Tuesday");
            }
            if (courseObjects[i].days.includes("Wednesday")){
                append(courseObjects[i],"Wednesday");
            }
            if (courseObjects[i].days.includes("Thursday")){
                append(courseObjects[i],"Thursday");
            }
            if (courseObjects[i].days.includes("Friday")){
                append(courseObjects[i],"Friday");
            }
        }
    };
    function append(course,day){
        var courseHeight=course.height;
        var courseTop = course.topPX;
        var courseName = course.name;
        var courseTime = course.time;
        var courseNumber = course.number;
        var courseSection = course.section;
        var courseHall = course.hall;
        var courseColor = course.color;
        var base=`<div class="class-card" style="height: ${courseHeight}px;top: ${courseTop}px;background: rgb${courseColor};left: 15px;">
    <div class="class-name">${courseName}</div>
    <div class="class-time">${courseNumber}-${courseSection}</div>
    <div class="class-time">${courseTime}</div>
    <div class="class-location">${courseHall}</div>
</div>`
        var search = `cal-col-${day.toLowerCase()}`
        override=override.slice(0,override.indexOf(search)+search.length+2)+base+override.slice(override.indexOf(search)+search.length+2);
    };
    function extraneous(name,credits,semester){
        override=override.slice(0,override.indexOf("span id=\"name\"")+"span id=\"name\"".length+1)+name+override.slice(override.indexOf("span id=\"name\"")+"span id=\"name\"".length+1);
        override=override.slice(0,override.indexOf("span id=\"credits\"")+"span id=\"credits\"".length+1)+credits +" Credits"+override.slice(override.indexOf("span id=\"credits\"")+"span id=\"credits\"".length+1);
        override=override.slice(0,override.indexOf("span id=\"semester\"")+"span id=\"semester\"".length+1)+semester+override.slice(override.indexOf("span id=\"semester\"")+"span id=\"semester\"".length+1);
    };
    document.onkeydown = function(e){
        e = e || window.event;
        var key = e.which || e.keyCode;
        if(key===84){
            main();
        }
    }
})();
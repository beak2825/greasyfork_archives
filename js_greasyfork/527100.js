// ==UserScript==
// @name         Timetable Downloader
// @namespace    http://tampermonkey.net/
// @version      2025-02-16
// @description  try to take over the world!
// @author       You
// @match        https://portal.ejc.edu.sg/index.html*
// @match        https://portal.catholicjc.edu.sg/index.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.sg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527100/Timetable%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/527100/Timetable%20Downloader.meta.js
// ==/UserScript==

(function() {


    // Create the button element
var button = document.createElement("button");
button.innerHTML = "Click Me"; // Set the button's text

// Style the button to be centered on the page
button.style.position = "absolute";
button.style.top = "50%";
button.style.left = "50%";
button.style.transform = "translate(-50%, -50%)"; // To adjust the button to the exact center
button.style.padding = "10px 20px";
button.style.fontSize = "50px";
button.style.backgroundColor = "red";
// Append the button to the body
document.body.appendChild(button);

// Define the function to be triggered
function myFunction() {
    let passkey = prompt("Enter Password abc")

    if (passkey == "abc"){


        console.log('running!')
    'use strict';
let wdayW = ".wday0"

let starttime = {};
starttime[1] = "07:00";
starttime[2] = "07:30";
starttime[3] = "08:00";
starttime[4] = "08:30";
starttime[5] = "09:00";
starttime[6] = "09:30";
starttime[7] = "10:00";
starttime[8] = "10:30";
starttime[9] = "11:00";
starttime[10] = "11:30";
starttime[11] = "12:00";
starttime[12] = "12:30";
starttime[13] = "13:00";
starttime[14] = "13:30";
starttime[15] = "14:00";
starttime[16] = "14:30";
starttime[17] = "15:00";
starttime[18] = "15:30";
starttime[19] = "16:00";
starttime[20] = "16:30";
starttime[21] = "17:00";
starttime[22] = "17:30";
starttime[23] = "18:00";
starttime[24] = "18:30";
starttime[25] = "19:00";
starttime[26] = "19:30";
starttime[27] = "20:00";
starttime[28] = "20:30";

let endtime = {};
endtime[1] = "07:30";
endtime[2] = "08:00";
endtime[3] = "08:30";
endtime[4] = "09:00";
endtime[5] = "09:30";
endtime[6] = "10:00";
endtime[7] = "10:30";
endtime[8] = "11:00";
endtime[9] = "11:30";
endtime[10] = "12:00";
endtime[11] = "12:30";
endtime[12] = "13:00";
endtime[13] = "13:30";
endtime[14] = "14:00";
endtime[15] = "14:30";
endtime[16] = "15:00";
endtime[17] = "15:30";
endtime[18] = "16:00";
endtime[19] = "16:30";
endtime[20] = "17:00";
endtime[21] = "17:30";
endtime[22] = "18:00";
endtime[23] = "18:30";
endtime[24] = "19:00";
endtime[25] = "19:30";
endtime[26] = "20:00";
endtime[27] = "20:30";
endtime[28] = "21:00";
let finaloutput = {};

for(var day = 1;day<6;day++){
wdayW = wdayW.slice(0,5)
wdayW += day





let lessonbogger = ".l.p0"
let lessontime = 1

    while( lessontime<26){
       lessonbogger = lessonbogger.slice(0,4);
        lessonbogger += lessontime;

        if(document.querySelector(wdayW +" " +lessonbogger + " .font-sm") == null) { lessontime++;continue;}


        else{
            var lessonboggersave = lessonbogger


            for(var ld = 1;ld<26;ld++){
                lessontime++
                lessonbogger = lessonbogger.slice(0,4);
                 lessonbogger += lessontime;

             if(document.querySelector(wdayW +" " +lessonbogger +".hidden") != null){continue;}

            else{
                let beep = Number(lessontime - ld)
                let boop = Number(lessontime - 1)
                let output = `day ${day} lesson lasted for ${ld} periods, ` +    `from ${starttime[beep]} to ${endtime[boop]}. Lesson Name is: ` + document.querySelector(wdayW +" " +lessonboggersave + " .font-sm").innerHTML + '\n'


                if(finaloutput[day-1] == undefined){finaloutput[day-1] = output; break;}
                else{finaloutput[day-1] += output; break;}

                break;}
            }}



    }



//elements.forEach(element => {
//    console.log(element.innerHTML.trim());
//});

}



for(var iteratr = 0;iteratr <5;iteratr++){
let blob = new Blob([finaloutput[iteratr]], { type: 'text/plain' });


let a = document.createElement('a');

let b = 'Monday'
if(iteratr == 0){a.download = 'Monday.txt';}
else if(iteratr == 1){a.download = 'Tuesday.txt';}
else if(iteratr == 2){a.download = 'Wednesday.txt';}
else if(iteratr == 3){a.download = 'Thursday.txt';}
else if(iteratr == 4){a.download = 'Friday.txt';}




a.href = URL.createObjectURL(blob);

a.click();
}


    button.remove()}

    else{alert('wrong password');
         button.remove()}
}

// Add an event listener to the button that triggers the function
button.addEventListener("click", myFunction);

button.style.animation = "flashColor 1s infinite";

// Add the CSS keyframes to create the flashing effect
var style = document.createElement('style');
style.innerHTML = `
    @keyframes flashColor {
        0% { background-color: rgb(255, 0, 0); } /* Red */
        25% { background-color: rgb(0, 255, 0); } /* Green */
        50% { background-color: rgb(0, 0, 255); } /* Blue */
        75% { background-color: rgb(255, 255, 0); } /* Yellow */
        100% { background-color: rgb(255, 0, 255); } /* Magenta */
    }
`;
document.head.appendChild(style);


    // Your code here...
})();
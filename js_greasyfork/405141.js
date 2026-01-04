// ==UserScript==
// @name         HEB Intern Clock Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autofill your Intern HEB Clock
// @author       Weston Sandland
// @match        https://heb--c.visualforce.com/apex/MyTools?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405141/HEB%20Intern%20Clock%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/405141/HEB%20Intern%20Clock%20Helper.meta.js
// ==/UserScript==

//Edit the values between the single quotes according to what you want to be filled in.
var Your_Name = 'Jane Doe';
var Your_Work_Location = '8039911 - Eastside Tech Hub I.S';
var Your_Admin = 'Jacqueline Perez';
var Start_Shift_Time = '8:00 AM';
var Start_Lunch_Time = '12:00 PM';
var End_Lunch_Time = '1:00 PM';
var End_Shift_Time = '5:00 PM';







//Only increase this value if your browser runs exceptionally slow.
var executionDelay = 500;
(function() {
    'use strict';
    setTimeout(function(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yyyy = today.getFullYear();
        if(dd<10)
        {
            dd='0'+dd;
        }

        if(mm<10)
        {
            mm='0'+mm;
        }
        today = mm+'/'+dd+'/'+yyyy;
        document.getElementById('Q1IsPeople_searchInput').value = Your_Name;
        document.getElementById('Q2IsDate').value = today;
        document.getElementById('Q3LocationSelector_searchInput').value = Your_Work_Location;
        document.getElementById('Q4IsPeople_searchInput').value = Your_Admin;
        document.getElementById('Q5R1C1TimePicker').value = today + ' ' + Start_Shift_Time;
        document.getElementById('Q5R1C3TimePicker').value = today + ' ' + Start_Lunch_Time;
        document.getElementById('Q5R1C4TimePicker').value = today + ' ' + End_Lunch_Time;
        document.getElementById('Q5R1C5TimePicker').value = today + ' ' + End_Shift_Time;
    }, executionDelay);
})();
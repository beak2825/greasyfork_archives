// ==UserScript==
// @name         MB_plugin
// @version      2024-04-09
// @author       zixiao_hi
// @license GNU GPLv3
// @description    exporting MB timetables to calendar file
// @match        https://bnds.managebac.cn/student/timetables/*
// @match        https://bnds.managebac.cn/student/timetables
// @run-at          document-body
// @grant           GM_info
// @grant           GM_addStyle
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_xmlhttpRequest
// @grant           GM_registerMenuCommand
// @namespace https://greasyfork.org/users/1285841
// @downloadURL https://update.greasyfork.org/scripts/492049/MB_plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/492049/MB_plugin.meta.js
// ==/UserScript==

(function() {




//  newVideoLoaded();
//  console.log("jd3indin3di3")
    function get_cal(){
        function extractTimetableToJson() {
            const table = document.querySelector('.table');
            const headings = table.querySelectorAll('thead th');
            const rows = table.querySelectorAll('tbody tr');

            // Extract day headings
            const days = Array.from(headings).map((th, index) => index > 0 ? th.innerText.trim() : null).filter(day => day);

            let timetable = {
                periods: []
            };

            rows.forEach(row => {
                const periodCell = row.querySelector('.period-label');
                const periodClasses = row.querySelectorAll('.period-classes');

                if (periodCell) {
                    let periodInfo = {
                        period: periodCell.querySelector('.numeric-circle') ? periodCell.querySelector('.numeric-circle').innerText.trim() : 'Homeroom',
                        classes: {}
                    };

                    periodClasses.forEach((classCell, index) => {
                        if (days[index]) {
                            const className = classCell.querySelector('.class-name') ? classCell.querySelector('.class-name').innerText.trim() : 'Free Period';
                            const grade = classCell.querySelector('.class-grade') ? classCell.querySelector('.class-grade').innerText.trim() : 'Not specified';
                            const ellipses = classCell.querySelectorAll('.text-ellipsis:not(.class-grade)');
                            let time = '', teacher = '', location = 'Not specified';

                            ellipses.forEach((el) => {
                                const text = el.innerText.trim();
                                // Check if text starts with a number (for time or location)
                                if (/^\d/.test(text)) {
                                    // Time format check
                                    if (/\d{1,2}:\d{2}(AM|PM) - \d{1,2}:\d{2}(AM|PM)/.test(text)) {
                                        time = text;
                                    } else { // Assume location if not time
                                        location = text;
                                    }
                                } else  { // If not already assigned as time or location
                                    teacher = text; // Assume remaining text is teacher's name
                                }
                            });

                            periodInfo.classes[days[index]] = {
                                name: className,
                                grade: grade,
                                time: time,
                                teacher: teacher,
                                location: location
                            };
                        }
                    });

                    timetable.periods.push(periodInfo);
                }
            });

            return JSON.stringify(timetable, null, 2);
        }
        let time_table_JSON = extractTimetableToJson();
        console.log(time_table_JSON);

        // Assuming extractTimetableToJson() has been run and stored in time_table_JSON

        // Parse the JSON to work with it as an object
        let timetable = JSON.parse(time_table_JSON);

        // Define a map for period start times, excluding period 5 (lunchtime)
        const periodStartTimes = {
            "1": "8:00AM",
            "2": "8:55AM",
            "3": "9:50AM",
            "4": "10:45AM",
            "6": "12:35PM",
            "7": "1:30PM",
            "8": "2:25PM",
            "9": "3:25PM"
        };

        function findSubject(courseName, subjects) {
            subjects = [
                "Math",
                "Calculas",
                "Statistics","Physics",
                "English",
                "History",
                "Geography",
                "Spanish",
                "French",
                "German",
                "Latin",
                "Art",
                "Music",
                "Physical Education",
                "Computer Science",
                "Economics",
                "Psychology",
                "Chinese",
                "CCC",
                "Homeroom"
            ];

            const lowerCaseCourseName = courseName.toLowerCase();
            for (const subject of subjects) {
                if (lowerCaseCourseName.includes(subject.toLowerCase())) {
                    return subject;
                }
            }
            return "Subject not found";
        }



        // Function to calculate end time given start time and duration (45 minutes)
        function calculateEndTime(startTime) {
            let [hour, minutePeriod] = startTime.split(':');
            let minutes = parseInt(minutePeriod.substring(0, 2));
            let period = minutePeriod.substring(2);
            minutes += 45; // Each period lasts for 45 minutes

            if (minutes >= 60) {
                hour = parseInt(hour) + Math.floor(minutes / 60);
                minutes = minutes % 60;
            }

            if (hour >= 12 && period === 'AM') {
                period = 'PM';
            }

            return `${hour}:${minutes.toString().padStart(2, '0')}${period}`;
        }

        // Update the timetable with times for free periods
        timetable.periods.forEach(period => {
            Object.keys(period.classes).forEach(day => {
                if (period.classes[day].name === "Free Period") {
                    const startTime = periodStartTimes[period.period];
                    const endTime = calculateEndTime(startTime);
                    period.classes[day].time = `${startTime} - ${endTime}`;
                }else{
                    period.classes[day].name=findSubject(period.classes[day].name)
                }
            });
        });

        // Convert the updated object back to JSON
        time_table_JSON = JSON.stringify(timetable, null, 2);


        console.log(time_table_JSON);


        function _45_min_later(date) {
            // Make a copy of the date to avoid mutating the original date
            const newDate = new Date(date);
            // Add 45 minutes to the new date
            newDate.setMinutes(newDate.getMinutes() + 45);
            return newDate;
        }
        function parseDateString(dateString) {
            // Split the input string by spaces
            const parts = dateString.split(" ");

            // Define month abbreviations mapping
            const monthAbbreviations = {
                "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3,
                "May": 4, "Jun": 5, "Jul": 6, "Aug": 7,
                "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11
            };

            // Parse day, month, year, time
            const day = parseInt(parts[2]);
            const month = monthAbbreviations[parts[1]];
            const year = new Date().getFullYear(); // Assuming current year
            const timeParts = parts[3].split(":");
            let hours = parseInt(timeParts[0]);
            const minutes = parseInt(timeParts[1]);
            const ampm = dateString.substring(dateString.length-2,dateString.length)

            // Adjust hours for PM
            if (ampm === "PM" && hours < 12) {
                hours += 12;
            }

            // Create and return the Date object
            return new Date(year, month, day, hours, minutes);
        }

        // Test the function

        const dateString = "Thu, Mar 28 2:25PM";
        const dateVariable = parseDateString(dateString);
        console.log(dateVariable);


        function generateICSFromTimetable(timetableJSON) {
            //  const timetable = JSON.parse(timetableJSON);
            const icsEvents = [];

            timetable.periods.forEach(period => {
                Object.entries(period.classes).forEach(([date, classInfo]) => {
                    if (classInfo.time) {
                        const [startTime, endTime] = classInfo.time.split(" - ");
                        const [startHour, startMinute] = startTime.split(/[:AMPM]+/);
                        const [endHour, endMinute] = endTime.split(/[:AMPM]+/);
                        /*
                        const startDate = parseDateString(date + " " + startTime);
                        const endDate = _45_min_later(startDate);
                        //console.log(date + " " + startTime)
                        const formattedStartDate = startDate.toISOString().replace(/-|:|\.\d+Z/g, '').slice(0, 15);
                        const formattedEndDate = endDate.toISOString().replace(/-|:|\.\d+Z/g, '').slice(0, 15);
                        */
                        const startDate = parseDateString(date + " " + startTime);
                        // Adjusting for the 8-hour time difference for Perth
                        startDate.setHours(startDate.getHours() + 8);

                        const endDate = _45_min_later(startDate);
                        // Adjusting for the 8-hour time difference for Perth
                        //              endDate.setHours(endDate.getHours() + 8);

                        const formattedStartDate = startDate.toISOString().replace(/-|:|\.\d+Z/g, '').slice(0, 15);
                        const formattedEndDate = endDate.toISOString().replace(/-|:|\.\d+Z/g, '').slice(0, 15);




                        const event = `BEGIN:VEVENT\n` +
                        `DTSTART:${formattedStartDate}\n` +
                        `DTEND:${formattedEndDate}\n` +
                        `SUMMARY:${classInfo.name}\n` +
                        //                  `DESCRIPTION:Period ${period.period} with ${classInfo.teacher} in ${classInfo.location}\n` +
                        `LOCATION:${classInfo.location}\n` +
                        `END:VEVENT\n`;
                        icsEvents.push(event);
                    }
                });
            });

            const icsFileContent = `BEGIN:VCALENDAR\n` +
            `VERSION:2.0\n` +
            `PRODID:-//Your Organization//Your Calendar//EN\n` +
            `${icsEvents.join('')}` +
            `END:VCALENDAR`;

            const blob = new Blob([icsFileContent], { type: 'text/calendar' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'timetable.ics';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // Assuming `time_table_JSON` is a JSON string of your timetable
        //const time_table_JSON = `{"periods": [...]}`; // Replace [...] with your actual JSON content
        generateICSFromTimetable(timetable);


    }
    var btn =document.getElementsByClassName("fusion-card timetable-wrapper")[0].getElementsByClassName("title")[0]
    btn.innerText='Export timetable'
    btn.style.background='#1570ef'
    btn.addEventListener("click",
        function(e){
            get_cal()
        }
    )



})();
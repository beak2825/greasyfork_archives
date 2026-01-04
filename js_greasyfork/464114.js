// ==UserScript==
// @name         SomethingLoader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A perfectly normal script
// @author       You
// @match        https://classroom.google.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/464114/SomethingLoader.user.js
// @updateURL https://update.greasyfork.org/scripts/464114/SomethingLoader.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Your code here

    console.log("I'm working")

    var getItem;

    var Assignments = []
    var Attendance = []
    var Participation = []
    var Test = []

    var total = []

    setTimeout(() => {
        getItem = document.getElementsByClassName("rVhh3b");

        getItem = getItem[0]

        //console.log("Now printing each row")

        var rows = document.getElementsByClassName("P2vNt KZ97df OlXwxf tUJKGd zvbGS");

        var subject = document.getElementById("UGb2Qe").textContent

        console.log(subject)

        //console.log(rows)


        for (let i = 0; i < rows.length; i++) {
            var elements = rows[i].children[0].children[0].children

            // console.log(elements)


            var name = elements[1].children[0].textContent
            var type = elements[4].children[0].textContent
            var score;

            try {
                score = elements[6].children[0].children[0].children[0].children[1].textContent
            } catch(err) {
                console.log("Score not out yet")
            }

            if (type == "Participation") {
                Participation.push({Name: name, Score: score})
            }

            if (type == "Assignment") {
                Assignments.push({Name: name, Score: score})
            }

            if (type == "Attendance") {
                Attendance.push({Name: name, Score: score})
            }

            if (type == "Achievement") {
                Test.push({Name: name, Score: score})
            }

            if (name == "Chapter 18 Quiz") {
                Assignments.push({Name: "Chapter 18 Quiz", Score: score})
                console.log("SCORE!")
            }

            if (name == "Chapter 19 Quiz") {
                Assignments.push({Name: "Chapter 19 Quiz", Score: score})
                console.log("SCORE!")
            }

            if (name == "Chapter 20 Quiz") {
                Assignments.push({Name: "Chapter 20 Quiz", Score: score})
                console.log("SCORE!")
            }

            if (name == "Chapter 21 Quiz") {
                Assignments.push({Name: "Chapter 21 Quiz", Score: score})
                console.log("SCORE!")
            }

            if (name == "Quiz-IGCSE Y10A Topic 16") {
                Assignments.push({Name: "Quiz-IGCSE Y10A Topic 16", Score: "100/100"})
                console.log("SCORE!")
            }

            if (name == "Quiz IGCSE Y10A Topic 17") {
                Assignments.push({Name: "Quiz IGCSE Y10A Topic 17", Score: "100/100"})
                console.log("SCORE!")
            }

            console.log(name)
            console.log(type)
            console.log(score)

        }

        console.log("SUMMARY")

        console.log(Assignments.reverse())
        console.log(Attendance.reverse())
        console.log(Participation.reverse())

        total.push(Assignments, Attendance, Participation, Test)

        var unused = Attendance[0]
        var unsed2;
        for (const i in Attendance[0]) {
            unsed2 = unused["Name"];
            console.log("I is: " + unused["Name"])
        }

        console.log(unsed2)

        var matchSub;
        var matchList;
        for (var i = 0; i < 5; i++) {
            switch (i) {
                case 0:
                    matchSub = "Mathematics-Y10-A-2-2022/23"
                    matchList = "Attendance: Daily attendance Week 22  10/1/2023"
                    break
                case 1:
                    matchSub = "Physics-Y10-A-2-2022/23"
                    matchList = "Attendance: Daily attendance Week 22  10/1/2023"
                    break
                case 2:
                    matchSub = "English A-Y10-A-2-2022/23"
                    matchList = "Attendance: Daily attendance Week 22  9/1/2023"
                    break
                case 3:
                    matchSub = "Chemistry-Y10-A-2-2022/23"
                    matchList = "Attendance: Daily attendance Week 22  10/1/2023"
                    break
                case 4:
                    matchSub = "Biology-Y10-A-2-2022/23"
                    matchList = "Attendance: Daily attendance Week 22  9/1/2023"
                    break
            }

            console.log(matchSub)
            console.log(subject)
            console.log(matchList)

            if (subject == matchSub) {
                if (unsed2 == matchList) {
                    console.log("Cool as a cucumber")
                    if (subject == "Chemistry-Y10-A-2-2022/23") {
                        Participation.push({Name: "Approximate Praticipation", Score: "100/100"})
                    }
                    GM_setClipboard(JSON.stringify(total), "text");
//                    var link = document.createElement('a');
 //                   link.download = subject + '.txt';
//                    var blob = new Blob([JSON.stringify(total)], {type: 'text/plain'});
 //                   link.href = window.URL.createObjectURL(blob);
  //                  link.click();
                    return 0;
                }
            }
        }

        alert("Unsuccessful Download. Please Try Again.")
        return 0;


        //        console.log(total)

        //        GM_setClipboard(JSON.stringify(total), "text");

        //        var link = document.createElement('a');
        //        link.download = 'data.txt';
        //        var blob = new Blob([JSON.stringify(total)], {type: 'text/plain'});
        //        link.href = window.URL.createObjectURL(blob);
        //        link.click();

    }, 10000);

})();
// ==UserScript==
// @name         Genesis Grades Graph & GPA calculator
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.2
// @description  Converts the HTML table into a graph of grade averages over time using vanilla JavaScript.
// @author       Kerry Zheng
// @match        https://*.c2.genesisedu.net/vineland/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js
// @resource     CHART_JS_CSS https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.css
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478328/Genesis%20Grades%20Graph%20%20GPA%20calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/478328/Genesis%20Grades%20Graph%20%20GPA%20calculator.meta.js
// ==/UserScript==

    (function () {
        'use strict';

        // Function to create the graph.
        function createGradeGraph() {
            var table = document.querySelector('.list');

            // Initialize arrays to store dates, grades, and GPAs
            var dates = [];
            var grades = [];
            var gpas = [];

            // Iterate through the rows of the table, starting from the second row (index 1)
            for (var i = 1; i < table.rows.length; i++) {
                // Get the row
                var row = table.rows[i];

                // Get the date from the first cell of the row
                var dateCell = row.cells[0].querySelector('div:nth-child(2)');
                var date = dateCell.innerText.trim();

                // Get the grade cell
                var gradeCell = row.cells[3];
                var gradeText = gradeCell.innerText.trim();

                // Skip rows with "Not Graded"
                if (gradeText.includes("Not Graded")) {
                    continue;
                }

                // Split the grade text at newline characters and keep the second item (e.g., "94.00%")
                var grade = gradeText.split('\n')[1];
                grade = grade.replace("Assignment Pts: 100", "0%");

                // Push the date, grade, and GPA to their respective arrays
                dates.push(date);
                grades.push(parseFloat(grade));
                gpas.push(calculateGPA(parseFloat(grade)));
            }

            // Now, you have the dates, grades, and GPAs in the 'dates', 'grades', and 'gpas' arrays
            console.log("Dates:", dates);
            console.log("Grades:", grades);
            console.log("GPAs:", gpas);

            // Canvas setup
            var canvas = document.createElement('canvas');
            canvas.width = 700;
            canvas.height = 450;
            document.querySelector(".desktop").appendChild(canvas);

            var ctx = canvas.getContext('2d');

            // Convert the date strings to Date objects
            const dateObjects = dates.map(dateStr => new Date(`2023/${dateStr}`));

            // Sort the dates in ascending order
            dateObjects.sort((a, b) => a - b);

            // Get the earliest and latest dates
            const startDate = dateObjects[0];
            const endDate = dateObjects[dateObjects.length - 1];

            // Calculate the number of weeks
            const timeDifference = endDate - startDate;
            const weeks = Math.ceil(timeDifference / (1000 * 60 * 60 * 24 * 7));

            // Calculate weekly averages for grades
            const weeklyAverages = {};
            dates.forEach((date, index) => {
                const week = Math.ceil((dateObjects[index] - startDate) / (1000 * 60 * 60 * 24 * 7));
                if (!weeklyAverages[week]) {
                    weeklyAverages[week] = [];
                }
                weeklyAverages[week].push(parseFloat(grades[index]));
            });

            const dataX = [];
            const dataY = [];
            for (const week in weeklyAverages) {
                const average = weeklyAverages[week].reduce((sum, grade) => sum + grade, 0) / weeklyAverages[week].length;
                dataX.unshift(average.toFixed(2));
                dataY.push(parseInt(week));
            }

            // Calculate weekly averages for GPAs
            const weeklyGPAAverages = {};
            dates.forEach((date, index) => {
                const week = Math.ceil((dateObjects[index] - startDate) / (1000 * 60 * 60 * 24 * 7));
                if (!weeklyGPAAverages[week]) {
                    weeklyGPAAverages[week] = [];
                }
                weeklyGPAAverages[week].push(gpas[index]);
            });

            const dataXGPA = [];
            const dataYGPA = [];
            for (const week in weeklyGPAAverages) {
                const averageGPA = weeklyGPAAverages[week].reduce((sum, gpa) => sum + gpa, 0) / weeklyGPAAverages[week].length;
                dataXGPA.unshift(averageGPA.toFixed(2));
                dataYGPA.push(parseInt(week));
            }

            // Create a Chart.js line chart
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dataY,
                    datasets: [
                        {
                            label: 'Average Grade per Week',
                            data: dataX,
                            borderColor: '#03a9f4',
                            fill: false,
                        },
                        {
                            label: 'Average GPA per Week',
                            data: dataXGPA,
                            borderColor: '#4caf50',
                            fill: false,
                        },
                    ]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Week Number'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Average'
                            }
                        }
                    }
                }
            });
        }

        // Function to calculate GPA
        function calculateGPA(gradeValue) {
            // Your existing GPA calculation function
            // ...

            // For example, I'll use a simplified version:
            if (gradeValue >= 90) {
                return 4.0;
            } else if (gradeValue >= 80) {
                return 3.0;
            } else {
                return 2.0;
            }
        }

    function calculateGPA(gradeValue) {
        let gpaOutput;

        if (gradeValue >= 95) {
            gpaOutput = 4.33;
        } else if (gradeValue >= 93) {
            gpaOutput = 4;
        } else if (gradeValue >= 90) {
            gpaOutput = 3.67;
        } else if (gradeValue >= 87) {
            gpaOutput = 3.33;
        } else if (gradeValue >= 83) {
            gpaOutput = 3;
        } else if (gradeValue >= 80) {
            gpaOutput = 2.67;
        } else if (gradeValue >= 77) {
            gpaOutput = 2.33;
        } else if (gradeValue >= 73) {
            gpaOutput = 2;
        } else if (gradeValue >= 70) {
            gpaOutput = 1.67;
        } else if (gradeValue >= 67) {
            gpaOutput = 1.33;
        } else if (gradeValue >= 63) {
            gpaOutput = 1;
        } else if (gradeValue >= 60) {
            gpaOutput = 0.67;
        } else if (gradeValue < 60) {
            gpaOutput = 0;
        }

        return gpaOutput;
    }

    function createGPACounter(grades){
        grades=grades
        // Initialize total GPA
        var totalGPA = 0;

        // Iterate through the grades array
        for (var i = 0; i < grades.length; i++) {
            var gradeText = grades[i];
            var gradeValue = parseFloat(gradeText);

            // Calculate GPA based on your conversion logic
            if (gradeValue >= 95) {
                totalGPA += 4.33;
            } else if (gradeValue >= 93) {
                totalGPA += 4;
            } else if (gradeValue >= 90) {
                totalGPA += 3.67;
            } else if (gradeValue >= 87) {
                totalGPA += 3.33;
            } else if (gradeValue >= 83) {
                totalGPA += 3;
            } else if (gradeValue >= 80) {
                totalGPA += 2.67;
            } else if (gradeValue >= 77) {
                totalGPA += 2.33;
            } else if (gradeValue >= 73) {
                totalGPA += 2;
            } else if (gradeValue >= 70) {
                totalGPA += 1.67;
            } else if (gradeValue >= 67) {
                totalGPA += 1.33;
            } else if (gradeValue >= 63) {
                totalGPA += 1;
            } else if (gradeValue >= 60) {
                totalGPA += 0.67;
            } else if (gradeValue < 60) {
                totalGPA += 0;
            }


            // You can continue this pattern for other GPA ranges
        }

        // Calculate the average GPA
        var averageGPA = totalGPA / grades.length;

        // Now, you have the average GPA in the 'averageGPA' variable
        console.log("Average GPA:", averageGPA.toFixed(2));

        var element1=document.querySelector('.fieldlabel.noStyle');
        element1.setAttribute('class','tempgpa')
        element1.innerHTML = "GPA: "+averageGPA.toFixed(2)

        var text
        var gpatext
        var element = document.createElement('td');
        element.classList.add('cellCenter')
        text = document.createTextNode('GPA');
        element.appendChild(text);
        document.getElementsByClassName('listheading')[0].appendChild(element);

        var node_1 = document.createElement('DIV');
        node_1.setAttribute('align', 'center');
        var node_2 = document.createElement('DIV');
        node_2.setAttribute('class', 'gpaindicator');
        node_2.setAttribute('style', 'background-color: white; height: 20px; width: 20px;margin: 0 auto; margin-bottom: 15px; border: 1px solid black; clear: both;');
        node_1.appendChild(node_2);

        var node_5 = document.createElement('LABEL');
        node_5.textContent="GPA: "+averageGPA.toFixed(2)
        node_5.setAttribute('class', 'GPAcounter')
        node_1.appendChild(node_5);

        var node_6 = document.createElement('BR');
        node_1.appendChild(node_6)

        var node_3 = document.createElement('LABEL');
        node_3.textContent="GPA Goal: "
        node_1.appendChild(node_3);
        var node_4 = document.createElement('INPUT');
        node_4.className="gpagoalinput"
        node_1.appendChild(node_4);
        var mydiv=document.getElementsByClassName('tempgpa')[0]
        mydiv.parentNode.insertBefore(node_1, mydiv.nextSibling)

        element1.remove()

        function checkstring(value){
            if (parseFloat(value)<=5){
                return value
            }else{
                return '5'
            }
        }

        function getgpagoal(){
            var gpagoal=window.localStorage.getItem('gpagoal');
            checkgpagoal()
            if(null === gpagoal)
            {
                gpagoal = '5';
            }
            return gpagoal
        }

        function checkgpagoal(){
            var gpagoal=window.localStorage.getItem('gpagoal');
            var currentgpa=document.getElementsByClassName('GPAcounter')[0].innerText.replace('GPA: ','')
            currentgpa=currentgpa.split('/')[0]
            if ((parseFloat(currentgpa))>=(parseFloat(gpagoal))){
                node_2.style.backgroundColor="green"
            }else if ((parseFloat(currentgpa))<(parseFloat(gpagoal))){
                node_2.style.backgroundColor="red"
            }
        }

        (document.getElementsByClassName('GPAcounter')[0].innerText)=(document.getElementsByClassName('GPAcounter')[0].innerText.split('/')[0])+'/'+getgpagoal();

        function gpagoalchange(){
            var value=node_4.value;
            window.localStorage.setItem('gpagoal', value);
            (document.getElementsByClassName('GPAcounter')[0].innerText)=(document.getElementsByClassName('GPAcounter')[0].innerText.split('/')[0])+'/'+checkstring(value)
            checkgpagoal()
        }

        node_4.addEventListener('change', gpagoalchange);

    }
    // Call the function when the page is fully loaded.
    window.addEventListener('load', createGradeGraph);
})();
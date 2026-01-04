// ==UserScript==
// @name         Student Vue Grades Spoof
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  When toggled will change grades to a combination of A's B's C's and D's dependant of the configuration (Hold backspace + <the corresponding letter grade or 'e' for a custom combination>). UI coming soon.
// @author       NullProgramming
// @match        *://*/*/PXP2_Gradebook.aspx*
// @icon         https://rt2.region1.k12.mn.us/RT0332/synergy.ico
// @grant        none
// @license      Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
// @downloadURL https://update.greasyfork.org/scripts/476050/Student%20Vue%20Grades%20Spoof.user.js
// @updateURL https://update.greasyfork.org/scripts/476050/Student%20Vue%20Grades%20Spoof.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const letterGrades = document.querySelectorAll('.mark');
    const percentGrades = document.querySelectorAll('.score');
    const gradesDivs = document.querySelectorAll('div:has(.mark):has(.score):not(.mark-count)');
    const validGrades = [
        "A",
        "A-",
        "B+",
        "B",
        "B-",
        "C+",
        "C",
        "C-",
        "D+",
        "D",
        "D-",
        "F"
    ];

    let keysPressed = {};

    window.onload = onPageLoad;

    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;

        if (keysPressed.Backspace && event.key == 'a') {
            printA();
        }
        if (keysPressed.Backspace && event.key == 'b') {
            printB();
        }
        if (keysPressed.Backspace && event.key == 'c') {
            printC();
        }
        if (keysPressed.Backspace && event.key == 'd') {
            printD();
        }
        if (keysPressed.Backspace && event.key == 'e') {
            printComb();
        }
    });

    document.addEventListener('keyup', (event) => {
        delete keysPressed[event.key];
    });

    function printA() {
        const letters = ["A", "A-"];


        letterGrades.forEach((element) => {
            const randomIndex = Math.floor(Math.random() * letters.length);
            const randomLetter = letters[randomIndex];
            element.textContent = randomLetter;
        });

        gradesDivs.forEach((div) => {
            const letterGrade = div.querySelector('.mark');
            const percentGrade = div.querySelector('.score');


            if (letterGrade && letterGrade.textContent.trim() === 'A') {
                percentGrade.textContent = `${
                    (Math.random() * (99.9 - 94.0) + 94.0).toFixed(1)
                }%`;
            } else if (letterGrade && letterGrade.textContent.trim() === 'A-') {
                percentGrade.textContent = `${
                    (Math.random() * (93.4 - 90.0) + 90.0).toFixed(1)
                }%`;
            }
        });
        alert('Replacing grades with A\'s...');
    }
    function printB() {
        const letters = ["B+", "B", "B-"];


        letterGrades.forEach((element) => {
            const randomIndex = Math.floor(Math.random() * letters.length);
            const randomLetter = letters[randomIndex];
            element.textContent = randomLetter;
        });

        gradesDivs.forEach((div) => {
            const letterGrade = div.querySelector('.mark');
            const percentGrade = div.querySelector('.score');


            if (letterGrade && letterGrade.textContent.trim() === 'B+') {
                percentGrade.textContent = `${
                    (Math.random() * (89.3 - 87.0) + 87.0).toFixed(1)
                }%`;
            } else if (letterGrade && letterGrade.textContent.trim() === 'B') {
                percentGrade.textContent = `${
                    (Math.random() * (86.3 - 83.0) + 83.0).toFixed(1)
                }%`;
            } else if (letterGrade && letterGrade.textContent.trim() === 'B-') {
                percentGrade.textContent = `${
                    (Math.random() * (82.3 - 80.0) + 80.0).toFixed(1)
                }%`;
            }
        });
        alert('Replacing grades with B\'s...');
    }
    function printC() {
        const letters = ["C+", "C", "C-"];


        letterGrades.forEach((element) => {
            const randomIndex = Math.floor(Math.random() * letters.length);
            const randomLetter = letters[randomIndex];
            element.textContent = randomLetter;
        });

        gradesDivs.forEach((div) => {
            const letterGrade = div.querySelector('.mark');
            const percentGrade = div.querySelector('.score');


            if (letterGrade && letterGrade.textContent.trim() === 'C+') {
                percentGrade.textContent = `${
                    (Math.random() * (79.3 - 77.0) + 77.0).toFixed(1)
                }%`;
            } else if (letterGrade && letterGrade.textContent.trim() === 'C') {
                percentGrade.textContent = `${
                    (Math.random() * (76.3 - 73.0) + 73.0).toFixed(1)
                }%`;
            } else if (letterGrade && letterGrade.textContent.trim() === 'C-') {
                percentGrade.textContent = `${
                    (Math.random() * (72.3 - 70.0) + 70.0).toFixed(1)
                }%`;
            }
        });
        alert('Replacing grades with C\'s...');
    }
    function printD() {
        const letters = ["D+", "D", "D-"];


        letterGrades.forEach((element) => {
            const randomIndex = Math.floor(Math.random() * letters.length);
            const randomLetter = letters[randomIndex];
            element.textContent = randomLetter;
        });

        gradesDivs.forEach((div) => {
            const letterGrade = div.querySelector('.mark');
            const percentGrade = div.querySelector('.score');


            if (letterGrade && letterGrade.textContent.trim() === 'D+') {
                percentGrade.textContent = `${
                    (Math.random() * (69.3 - 67.0) + 67.0).toFixed(1)
                }%`;
            } else if (letterGrade && letterGrade.textContent.trim() === 'D') {
                percentGrade.textContent = `${
                    (Math.random() * (66.3 - 65.0) + 65.0).toFixed(1)
                }%`;
            } else if (letterGrade && letterGrade.textContent.trim() === 'D-') {
                percentGrade.textContent = `${
                    (Math.random() * (64.3 - 63.0) + 63.0).toFixed(1)
                }%`;
            }
        });
        alert('Replacing grades with D\'s...');
    }
    function printComb() {
        const lettersInput = prompt("From decending order, place the letter grades you want separated by commas and a space (Ex. A-, C, B+, A, F)\nDo NOT use + on A or -/+ on F")
        const letters = lettersInput.split(',').map((str) => str.trim());

        if (percentGrades.length === letters.length) {

            let index = 0
            letterGrades.forEach((element) => {
                if (element.parentNode.querySelector('.mark-count')) {
                    return
                }

                if (validGrades.includes(letters[index])) {
                    element.textContent = letters[index];
                } else {
                    alert(`'${
                        letters[index]
                    }' is not a valid grade, if you think this is an issue dm jade.grey on discord.`)
                } index++
            });
            
            gradesDivs.forEach((div) => {
                const letterGrade = div.querySelector('.mark');
                const percentGrade = div.querySelector('.score');
                if (letterGrade && letterGrade.textContent.trim() === 'A') {
                    percentGrade.textContent = `${
                        (Math.random() * (99.9 - 94.0) + 94.0).toFixed(1)
                    }%`;
                } else if (letterGrade && letterGrade.textContent.trim() === 'A-') {
                    percentGrade.textContent = `${
                        (Math.random() * (93.4 - 90.0) + 90.0).toFixed(1)
                    }%`;
                } else if (letterGrade && letterGrade.textContent.trim() === 'B+') {
                    percentGrade.textContent = `${
                        (Math.random() * (89.3 - 87.0) + 87.0).toFixed(1)
                    }%`;
                } else if (letterGrade && letterGrade.textContent.trim() === 'B') {
                    percentGrade.textContent = `${
                        (Math.random() * (86.3 - 83.0) + 83.0).toFixed(1)
                    }%`;
                } else if (letterGrade && letterGrade.textContent.trim() === 'B-') {
                    percentGrade.textContent = `${
                        (Math.random() * (82.3 - 80.0) + 80.0).toFixed(1)
                    }%`;
                } else if (letterGrade && letterGrade.textContent.trim() === 'C+') {
                    percentGrade.textContent = `${
                        (Math.random() * (79.3 - 77.0) + 77.0).toFixed(1)
                    }%`;
                } else if (letterGrade && letterGrade.textContent.trim() === 'C') {
                    percentGrade.textContent = `${
                        (Math.random() * (76.3 - 73.0) + 73.0).toFixed(1)
                    }%`;
                } else if (letterGrade && letterGrade.textContent.trim() === 'C-') {
                    percentGrade.textContent = `${
                        (Math.random() * (72.3 - 70.0) + 70.0).toFixed(1)
                    }%`;
                } else if (letterGrade && letterGrade.textContent.trim() === 'D+') {
                    percentGrade.textContent = `${
                        (Math.random() * (69.3 - 67.0) + 67.0).toFixed(1)
                    }%`;
                } else if (letterGrade && letterGrade.textContent.trim() === 'D') {
                    percentGrade.textContent = `${
                        (Math.random() * (66.3 - 65.0) + 65.0).toFixed(1)
                    }%`;
                } else if (letterGrade && letterGrade.textContent.trim() === 'D-') {
                    percentGrade.textContent = `${
                        (Math.random() * (64.3 - 63.0) + 63.0).toFixed(1)
                    }%`;
                } else if (letterGrade && letterGrade.textContent.trim() === 'F') {
                    percentGrade.textContent = `${
                        (Math.random() * (62.3 - 0.0) + 0.0).toFixed(1)
                    }%`;
                }
            });
        } else {
            alert(`The number of classes does not match the number of grades provided. ${
                gradesDivs.length
            } to ${
                letters.length
            }`);
            if (confirm("Would you like to try again?")) {
                printComb()
            }
        }


    }
    function onPageLoad() {
        alert("Script Loaded...")
    }
})();

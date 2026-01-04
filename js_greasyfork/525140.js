// ==UserScript==
// @name         JKU ECTS Calculator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Displays an ECTS calculator box on the grades page with term selection and options toggle.
// @author       geaggAT
// @match        https://my.jku.at/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=my.jku.at
// @grant        GM_xmlhttpRequest
// @connect      my.jku.at
// @downloadURL https://update.greasyfork.org/scripts/525140/JKU%20ECTS%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/525140/JKU%20ECTS%20Calculator.meta.js
// ==/UserScript==


(function () {
    'use strict';
    let termsGradesDict = {};

    // Function to create the box
    function createECTSBox() {
        let box = document.createElement("div");
        box.id = "ects-calc-box";
        Object.assign(box.style, {
            position: "fixed",
            top: "95px",
            right: "20px",
            width: "325px",
            padding: "15px",
            background: "white",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            border: "1px solid #ddd",
            zIndex: "1000",
            display: "none",
            fontFamily: "Arial, sans-serif",
        });

        let title = document.createElement("strong");
        title.textContent = "ECTS Calculator";
        title.style.display = "block";
        title.style.fontSize = "20px";
        title.style.textAlign = "center";
        box.appendChild(title);

        let subBoxTerms = createSubBox("Terms", "5px");
        box.appendChild(subBoxTerms);

        let subBoxOptions = createSubBox("Types", "5px");
        box.appendChild(subBoxOptions);

        let subBoxECTSCount = createSubBox("ECTS Count");
        box.appendChild(subBoxECTSCount);

        let subBoxAverageGrade = createSubBox("Average Grade");
        box.appendChild(subBoxAverageGrade);

        let subBoxWeightedGrade = createSubBox("Weighted by ECTS");
        box.appendChild(subBoxWeightedGrade);

        document.body.appendChild(box);
        calculate();
    }

    // Function to create a sub box with heading and containers
    function createSubBox(headingText, headingMargin = "0") {
        let subBox = document.createElement("div");
        subBox.style.padding = "10px";
        subBox.style.backgroundColor = "#f8f9fa";
        subBox.style.borderRadius = "8px";
        subBox.style.marginTop = "10px";
        subBox.id = "ects-calc-box-" + headingText.toLowerCase().replace(/ /g, "-");

        let subBoxHeading = document.createElement("strong");
        subBoxHeading.textContent = headingText;
        subBoxHeading.style.display = "block";
        subBoxHeading.style.marginBottom = headingMargin;
        subBox.appendChild(subBoxHeading);

        let subBoxContainer = document.createElement("div");
        subBoxContainer.style.display = "flex";
        subBoxContainer.style.flexWrap = "wrap";
        subBoxContainer.style.gap = "5px";
        subBox.appendChild(subBoxContainer);

        if (["ECTS Count", "Average Grade", "Weighted by ECTS"].includes(headingText)) {
            subBoxContainer.style.display = "block";
            let countText = document.createElement("div");
            countText.textContent = "120";
            countText.style.fontSize = "28px";
            countText.style.fontWeight = "bold";
            countText.style.color = "#333";
            countText.style.display = "flex";
            countText.style.justifyContent = "center";
            countText.style.alignItems = "center";
            countText.id = subBox.id + "-value";
            subBoxContainer.appendChild(countText);

        }

        if (headingText === "Types") {
            addTypes(subBoxContainer);
        }

        if (headingText === "Terms") {
            addTerms(subBoxContainer);
        }

        return subBox;
    }

    // Function to add terms to the box
    function addTerms(container) {
        Object.keys(termsGradesDict).forEach(key => {
            let button = document.createElement("button");
            button.textContent = key;
            button.dataset.term = key;
            button.classList.add("term-button", "selected");

            styleButton(button, "#007bff");

            container.appendChild(button);
        });
    }

    // Function to add types to the box
    function addTypes(container) {
        var types = [];
        Object.values(termsGradesDict).forEach(value => {
            value.forEach(certificate => {
                var type = certificate.courseClass.courseTypeLongForm;
                if (!types.includes(type)) {
                    types.push(type);

                    let button = document.createElement("button");
                    button.textContent = type.replace("Course", "").trim();
                    button.dataset.option = type;
                    button.classList.add("type-button", "selected");
        
                    styleButton(button, "#28a745");
        
                    container.appendChild(button);
                }
            });
        });
    }

    // Helper function to style and add event listener to buttons
    function styleButton(button, selectedColor) {
        Object.assign(button.style, {
            padding: "5px 10px",
            fontSize: "14px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            cursor: "pointer",
            background: selectedColor,
            color: "white",
            transition: "background 0.2s, color 0.2s",
        });
    
        button.addEventListener("click", () => {
            button.classList.toggle("selected");
            if (button.classList.contains("selected")) {
                button.style.background = selectedColor;
                button.style.color = "white";
            } else {
                button.style.background = "#f1f1f1";
                button.style.color = "#333";
            }
            calculate();
        });
    }
    
    // Function to calculate the statistics
    function calculate() {
        let selectedTerms = [...document.querySelectorAll(".term-button.selected")].map(btn => btn.dataset.term);
        let selectedTypes = [...document.querySelectorAll(".type-button.selected")].map(btn => btn.dataset.option);
    
        let totalECTS = 0;
        let totalGradePoints = 0;
        let totalWeightedGradePoints = 0;
        let totalCourses = 0;

        selectedTerms.forEach(term => {
            if (termsGradesDict[term]) {
                termsGradesDict[term].forEach(certificate => {;
                    let type = certificate.courseClass.courseTypeLongForm;
                    let ects = certificate.ects || 0;
                    let grade = getGrade(certificate);                    
    
                    if (selectedTypes.includes(type)) {
                        totalECTS += ects;
                        totalGradePoints += grade;
                        totalWeightedGradePoints += grade * ects;
                        totalCourses++;
                    }
                });
            }
        });

        let averageGrade = totalCourses > 0 ? (totalGradePoints / totalCourses).toFixed(2) : "-";
        let weightedGrade = totalECTS > 0 ? (totalWeightedGradePoints / totalECTS).toFixed(2) : "-";
    
        let ectsCountElement = document.getElementById("ects-calc-box-ects-count-value");
        if (ectsCountElement) {
            ectsCountElement.textContent = totalECTS;
        }
    
        let averageGradeElement = document.getElementById("ects-calc-box-average-grade-value");
        if (averageGradeElement) {
            averageGradeElement.textContent = averageGrade;
        }
    
        let weightedGradeElement = document.getElementById("ects-calc-box-weighted-by-ects-value");
        if (weightedGradeElement) {
            weightedGradeElement.textContent = weightedGrade;
        }
    }

    // Function to get the grade from the certificate
    function getGrade(certificate) {
        let grade = certificate.grade.longRepresentation;
        if (grade === "excellent") return 1;
        if (grade === "successfully completed") return 1; // Not sure how to handle this
        if (grade === "good") return 2;
        if (grade === "satisfactory") return 3;
        if (grade === "sufficient") return 4;
        console.log("Unknown grade:", grade);
        return 0;
    }

    // Function to check if the "Grades" page is active
    function checkGradesActive() {
        let gradesButton = document.querySelector('a[href="/grades"]');
        if (gradesButton) {
            let isActive = gradesButton.closest("div").querySelector(".menu-active");
            let box = document.getElementById("ects-calc-box");
            if (box) {
                box.style.display = isActive ? "block" : "none";
            }
        }
    }

    // Attach click listeners to all menu items
    function attachNavigationListeners() {
        let menuLinks = document.querySelectorAll('a.text-decoration-none');
        if (menuLinks.length === 0) return;

        menuLinks.forEach(link => {
            if (!link.dataset.listenerAdded) {
                link.addEventListener("click", () => {
                    setTimeout(checkGradesActive, 50);
                });
                link.dataset.listenerAdded = "true";
            }
        })
    }

    // Wait for the menu to load dynamically
    function observeMenuLoad() {
        let observer = new MutationObserver((mutations, obs) => {
            let menu = document.querySelector("ul.list-group");
            if (menu) {
                attachNavigationListeners();
                checkGradesActive();
                obs.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Function to fetch grades and store them in a dictionary
    function fetchTermsGrades() {
        fetch("https://my.jku.at/api/secure/student/grades/", {headers: {"Accept-Language": "en-US"}})
        .then(response => response.ok ? response.json() : Promise.reject("Invalid response"))
        .then(data => {
                data.certificates.forEach(certificate => {
                    if (certificate.course && certificate.course.term) {
                        let termId = certificate.course.term.termId;
                        if (!termsGradesDict[termId]) {
                            termsGradesDict[termId] = [];
                        }
                        termsGradesDict[termId].push(certificate);
                    } else if (certificate.type === "recognized-course-certificate") {
                        if (!termsGradesDict.recognized) {
                            termsGradesDict.recognized = [];
                        }
                        termsGradesDict.recognized.push(certificate);
                    } else {
                        console.log("Unknown certificate type:", certificate.type);
                    }
                });    
                createECTSBox();
                observeMenuLoad();
            })
            .catch(error => console.error('Error fetching grades:', error));
    }

    window.addEventListener("load", fetchTermsGrades);
})();
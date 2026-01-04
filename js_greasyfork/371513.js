// ==UserScript==
// @name         Rate My Professor UW
// @version      2.0
// @description  Makes Rate MY Professor rating appear next to UW Professors' names on Myplan.uw.edu
// @author       Leet
// @match        https://myplan.uw.edu/course/*
// @grant        none
// @namespace https://greasyfork.org/users/207214
// @downloadURL https://update.greasyfork.org/scripts/371513/Rate%20My%20Professor%20UW.user.js
// @updateURL https://update.greasyfork.org/scripts/371513/Rate%20My%20Professor%20UW.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const professorIDRegex = /ShowRatings\.jsp\?tid=[0-9]*/g;

    let retryTimer = setInterval(addProfessorRatings, 2000);

    function addProfessorRatings() {
        console.log("Adding ratings");
        const professors = $$(".course-section-instructor div div:first-child, .course-section-instructor > div");
        if (professors.length > 0) {
            professors.forEach(function(element) {
                const professorFullName = element.innerText.split(" ");
                if (professorFullName.length >= 2) {
                    const professorFirstName = professorFullName[0];
                    const professorLastName = professorFullName[professorFullName.length - 1];
                    queryProfessor(professorFirstName, professorLastName, element);
                }
            });
        }
    }

    function queryProfessor(firstname, lastname, element) {
        fetch("https://www.ratemyprofessors.com/search.jsp?"
              + "queryoption=HEADER&queryBy=teacherName&schoolName=University+of+Washington&schoolID=&"
              + "query=" + firstname + "+" + lastname)
            .then(checkStatus)
            .then(function(response) {
            const professorArray = response.match(professorIDRegex);
            if (professorArray) {
                const professorID = professorArray[0];
                queryInfo(professorID, element)
            } else {
                insertNotFound(element);
            }
        })
            .catch(console.log);
    }

    function queryInfo(professorIDUrl, element) {
        fetch("https://www.ratemyprofessors.com/" + professorIDUrl)
            .then(checkStatus)
            .then(function(response) {
            const infoPage = document.createElement("html");
            infoPage.innerHTML = response;
            const rating = parseFloat(infoPage.querySelector(".quality > div > div").innerText);
            const difficulty = parseFloat(infoPage.querySelector(".difficulty > div").innerText);
            let reviews = "";
            try {
                reviews = parseFloat(infoPage.querySelector(".rating-count").innerText);
                insertInfo(rating, difficulty, reviews, professorIDUrl, element);
            } catch(error) {
                insertNotFound(element);
            };
        })
            .catch(console.log);
    }

    function insertInfo(rating, difficulty, reviews, url, element) {
        element.innerHTML = "<a href=https://www.ratemyprofessors.com/"+ url + ">" + element.innerText + "</a>";
        const ratingElement = document.createElement("div");
        ratingElement.innerText = "Rating: " + rating;
        const difficultyElement = document.createElement("div");
        difficultyElement.innerText = "Difficulty: " + difficulty;
        const reviewsElement = document.createElement("div");
        reviewsElement.innerText = "Reviews: " + reviews;
        element.insertAdjacentElement("afterend", ratingElement);
        ratingElement.insertAdjacentElement("afterend", difficultyElement);
        difficultyElement.insertAdjacentElement("afterend", reviewsElement);
        clearInterval(retryTimer);
    }

    function insertNotFound(element) {
        const notFound = document.createElement("div");
        notFound.innerHTML = "<em>No Ratings Found</em>";
        element.insertAdjacentElement("afterend", notFound);
        clearInterval(retryTimer);
    }

    function checkStatus(response) {
        if (response.status >= 200 && response.status < 300 || response.status == 0) {
            return response.text();
        } else {
            return Promise.reject(new Error(response.status + ": " + response.statusText));
        }
    }

    function $(id) {
        return document.getElementByID(id);
    }

    function $$(selector) {
        return document.querySelectorAll(selector);
    }
})();
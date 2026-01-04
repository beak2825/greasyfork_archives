// ==UserScript==
// @name         Leetcode invisible
// @version      0.2
// @description  A script to hide Leetcode question difficultly
// @author       osjobs.nett
// @match        https://leetcode.com/*
// @match        https://leetcode-cn.com/*
// @exclude      https://leetcode-cn.com/problems/*/solution/
// @exclude      https://leetcode.com/problems/*/discuss/*
// @grant        none
// @namespace https://greasyfork.org/users/555531
// @downloadURL https://update.greasyfork.org/scripts/405104/Leetcode%20invisible.user.js
// @updateURL https://update.greasyfork.org/scripts/405104/Leetcode%20invisible.meta.js
// ==/UserScript==


// Since Leetcode use Ajax to load content,
// we have to check the label in first few seconds
if (window.location.href.indexOf("problemset") > -1) {
    var problemsetTimer = setInterval(problemsetFunction, 2000);
} else if (window.location.href.indexOf("problems") > -1) {
    var updateTime = 0;
    var problemTimer = setInterval(problemFunction, 100);
}


function problemsetFunction() {
    // Problems list page
    if(document.querySelector("span.label-warning")|| document.querySelector("span.label-success") || document.querySelector("span.label-danger") ) {
        var elementE = document.querySelectorAll("span.label-success");
        var elementM = document.querySelectorAll("span.label-warning");
        var elementH = document.querySelectorAll("span.label-danger");
        update(elementE, "label-success");
        update(elementM, "label-warning");
        update(elementH, "label-danger");
    };

    if(document.querySelector("span.level-easy")|| document.querySelector("span.level-medium") || document.querySelector("span.level-hard") ) {
        var elementCE = document.querySelectorAll("span.level-easy");
        var elementCM = document.querySelectorAll("span.level-medium");
        var elementCH = document.querySelectorAll("span.level-hard");
        update(elementCE, "level-easy");
        update(elementCM, "level-medium");
        update(elementCH, "level-hard");
    }
}

function problemFunction () {
    if (updateTime > 0) {
        clearInterval(problemTimer);
    }
    if(document.querySelector("div.css-1e1vffy-Tools")) {
        document.getElementsByClassName("css-1e1vffy-Tools")[0].style.display = "none";
        updateTime += 1;
    }
    if(document.querySelector("div.difficulty__ES5S")) {
        var similar_element = document.getElementsByClassName("difficulty__ES5S");
        for (var i=0; i<similar_element.length; i++) {
            similar_element[i].textContent = "Unknown";
        }
    }
}

function update(element, classname) {
    for (var i=0; i < element.length; i++) {
        element[i].classList.remove(classname);
        element[i].textContent = "Unknown";
    }
}

// ==UserScript==
// @name         Mikerific's CodingBat Auto Solver
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automattically solves the current CodingBat problem upon the page load.
// @author       Mikerific
// @match        https://codingbat.com/prob/*
// @match        https://codingbat.com/java
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376563/Mikerific%27s%20CodingBat%20Auto%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/376563/Mikerific%27s%20CodingBat%20Auto%20Solver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var decodeEntities = (function() {
        var element = document.createElement('div');
        function decodeHTMLEntities (str) {
            if(str && typeof str === 'string') {
                str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
                str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
                element.innerHTML = str;
                str = element.textContent;
                element.textContent = '';
            }
            return str;
        }
        return decodeHTMLEntities;
    })();
    var solution = "";
    for(var i = 0; i < document.getElementsByClassName("gray").length; i++) {
        if(document.getElementsByClassName("gray")[i].innerText == "Show Solution"){
            solution = document.getElementsByClassName("gray")[i].onclick.toString();
            solution = solution.split('unescape("').pop().split('" + "</pre>')[0];
            solution = decodeEntities(decodeURIComponent(solution));
            solution = solution.replace(/(\/\/).*/g, "");
        }
    }
    if(solution == "") {
        var github = "https://raw.githubusercontent.com/Mikerific/codingbat/master/" + document.getElementsByTagName("span")[1].innerText.toLowerCase() + "/" + document.getElementsByTagName("span")[2].innerText + ".java";
        var read = new XMLHttpRequest();
        read.open('GET', github, false);
        read.send();
        solution = read.responseText;
    }
    var editor = ace.edit('ace_div');
    editor.setValue(solution);
    var go = document.getElementsByClassName("go")[0];
    go.click();
    for(var j = 0; j < document.getElementsByTagName("a").length; j++) {
        if(document.getElementsByTagName("a")[j].innerText == "next") {
            document.getElementsByTagName("a")[j].click();
        }
    }
})();
// ==UserScript==
// @name         BunPRO to CVS downloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Download current grammar point and example as CSV for easy anki importation
// @author       You
// @match        https://bunpro.jp/grammar_points/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40076/BunPRO%20to%20CVS%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/40076/BunPRO%20to%20CVS%20downloader.meta.js
// ==/UserScript==


//var CSV_SEP = ";"
var CSV_SEP = "|";


function download_grammar_point() {
    'use strict';
    var JLPT_level = document.querySelector(".header__lesson-progress").innerText.slice(0,2);
    var lesson_id = (function(){
        var txt = document.querySelector(".header__lesson-progress").innerText.trim();
        var lesson_num = txt.slice(10, txt.search(":")).trim();
        var lesson_section = txt.slice(txt.search(": ")+2, txt.search("/")).trim();

        if (lesson_num.length == 1) { lesson_num = "0" + lesson_num; }
        if (lesson_section.length == 1) { lesson_section = "0" + lesson_section; }
        // str->int: integers must not start by 0; convert N5 to 1, N4 to 2....
        var first_digit = parseFloat(JLPT_level[1]) * -1 + 5 + 1;
        return "" + first_digit + lesson_num + lesson_section;

    })();

    var pattern = document.querySelector(".grammar-point__title").innerText.trim();
    var sources_html = (function() {
        var formed_html = "";
        var sources = Array.from(document.querySelectorAll(".supplemental-links > div > div")).
                                filter(function (el) { return el.id.startsWith("supplemental_link");});
        while (sources.length > 0) {
            var resource_link = sources.pop().innerHTML;
            var description = sources.pop().innerText;
            formed_html = "<div class=\"sources_description\">" + description + "</div>" + resource_link + formed_html;
        }
        formed_html = "<div class=\"sources\">" + formed_html + "</div>";
        return formed_html;
    })();

    var csv = (function(){
        var grammar_left = document.querySelector(".grammar-point__meaning").innerHTML.replace(/\n/g, "").trim();
        var grammar_right = document.querySelector(".meaning__structure").innerHTML.replace(/\n/g, "").trim();
        var grammar = "<div class=\"grammar_meaning\">" + grammar_left + "</div><div class=\"grammar_pattern\">" + grammar_right + "</div>";
        csv = lesson_id + "00" + CSV_SEP +
                JLPT_level + CSV_SEP +
                "rule" + CSV_SEP +
                pattern + CSV_SEP +
                pattern + CSV_SEP +
                grammar + CSV_SEP +
                sources_html + CSV_SEP +
                "bunpro, rule, " + JLPT_level + ", " + pattern.replace(/[~{}()\s\s+\[\]!！【】（）、。；：；]/g, "_") + "\n";

        var elems = document.querySelectorAll(".example-sentence")
        for (var i=0;i<elems.length;i+=2) {
            var exampleNode = elems[i];
            var lid = "" + (i/2+1);
            if (lid.length == 1) { lid = "0" + lid; }
            var japanese = elems[i].innerHTML;
            var english = elems[i+1].innerHTML;
            console.log("Lesson ID", lesson_id);
            console.log(lid);
            csv = csv +
                    lesson_id + lid + CSV_SEP +
                    JLPT_level + CSV_SEP +
                    "example" + CSV_SEP +
                    pattern + CSV_SEP +
                    japanese + CSV_SEP +
                    english + CSV_SEP +
                    sources_html + CSV_SEP +
                    "bunpro, example, " + JLPT_level + ", " + pattern.replace(/[~{}()\s\s+\[\]!！【】（）、。；：；]/g, "_") + "\n";
        }
        return csv;
    })();


    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        console.log("freedom of information and freedom of SRS");
        document.body.removeChild(element);
    }

    var filename = JLPT_level + "_" + lesson_id + "_" + pattern + ".csv";
    download(filename, csv);
}

(function() {
        var button = document.createElement('div');
        button.setAttribute("class", "review-button btn");
        button.innerText = button.innerText + "Download CSV for anki";
        button.onclick = function(event) {
            download_grammar_point();
            event.stopPropagation();
        };
        var toolbox = document.getElementsByClassName("review-button")[0].parentElement;
        toolbox.appendChild(button);
})()

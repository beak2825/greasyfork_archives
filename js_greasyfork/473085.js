// ==UserScript==
// @name         Advantage Aviation UI Enhancement
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a total number of sessions per instructor at the top of the "Schedules" page and add weekday to each schedule on the "Instructors" page.
// @author       You
// @match        https://advantage.paperlessfbo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=paperlessfbo.com
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/473085/Advantage%20Aviation%20UI%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/473085/Advantage%20Aviation%20UI%20Enhancement.meta.js
// ==/UserScript==

function swapName(name) {
    var names = name.split(",");
    return names[1].concat(names[0]);
}

function makeTable(names, count, rows) {
    const l = names.length;
    const columns = (l / rows + 1) >> 0;
    let lessons = 0;
    count.forEach(value => {lessons += value});
    var output = "<table>";
    for (var i = 0; i < rows; i++) {
        output = output.concat("<tr>");
        for (var j = 0; j < columns; j++) {
            const n = j * rows + i;
            if (n < l) {
                output = output.concat("<td>", names[n], "&nbsp(", count.get(names[n]), ")&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td>");
            } else if (i == rows - 1 && j == columns - 1) {
                output += "<td><b>&nbsp" + lessons + "&nbsp/&nbsp" + names.length + "&nbsp=&nbsp" + ~~(lessons * 1000/names.length) *.001 + "</b></td>";
            }
        }
        output = output.concat("</tr>");
    }
    output = output.concat("</table>");
    return output;
}

function onSchedulesPage() {
    console.log("on schedules page");
    var l = document.getElementsByClassName("aspNetDisabled");
    var set = new Set();
    var count = new Map();
    for (var i = 0; i < l.length; i++) {
        var t = l[i].innerHTML;
        var p = t.indexOf("Pilot<br>");
        if (p != -1) {
            var name = swapName(t.substring(p + 9));
            if (set.has(name)) {
                count.set(name, count.get(name) + 1);
            } else {
                count.set(name, 1);
            }
            set.add(name);
        }
    }
    var names = [...set];
    names.sort();
    var div = document.createElement('div');
    div.style.cssFloat = 'right';
    div.innerHTML = (makeTable(names, count, 5));
    const top_image = document.getElementById("ctl00_Image1");
    top_image.parentNode.insertBefore(div, top_image.nextSibling);
}

function addWeekDay(td) {
    const str = td.innerHTML;
    const date_str = str.substring(0, str.indexOf(' '));
    const weekday = new Date(date_str).toLocaleString('en-us', { weekday: 'short' });
    td.innerHTML = td.innerHTML + " " + weekday;
}

function onInstructorPage() {
    console.log("on instructor page");
    var l = document.getElementById("ctl00_ContentPlaceHolder1_GridView1").getElementsByTagName("tr");
    for (var i = 1; i < l.length; i++) {
        addWeekDay(l[i].children[1]);
        addWeekDay(l[i].children[2]);
    }
}

(function() {
    'use strict';
    console.log("start");
    if (window.location.href.indexOf("mstr7.aspx") > -1) {
        onSchedulesPage();
    } else if (window.location.href.indexOf("mstr7b.aspx") > -1) {
        onInstructorPage();
    }
})();



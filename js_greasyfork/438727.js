// ==UserScript==
// @name         OhMyNTHU
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace the function "distribution"
// @author       NTHU
// @match        https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/8/R/6.3/JH8R63002.php*
// @icon         https://www.google.com/s2/favicons?domain=edu.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438727/OhMyNTHU.user.js
// @updateURL https://update.greasyfork.org/scripts/438727/OhMyNTHU.meta.js
// ==/UserScript==

(function(jQuery) {
    'use strict';
    console.log(window.distribution);
    window.showall = function () {window.open('../../R/6.3/JH8R63002.php?ACIXSTORE='+ form1.ACIXSTORE.value +'&c_key='+ form1.get_ckey.value + '&from=prg8R63' , 'distribution', 'toolbar=0,location=0,directories=0,status=0,menubar=0,resizable=1,scrollbars=1');}

    let tables = document.querySelectorAll("tbody");
    let indexName = tables[0].querySelectorAll("tr")[2];
    let classes = tables[0].querySelectorAll("tr[align='center']");

    let insert_element = document.createElement('td');
    let text = document.createTextNode("OhMyNTHU");
    insert_element.className = "input_red";
    insert_element.width = "90";
    insert_element.align = "center";
    insert_element.appendChild(text);
    console.log(insert_element);
    indexName.insertBefore(insert_element, indexName.children[7]);

    for (var i = 0; i < classes.length; i++) {
        let insert_element = document.createElement('td');
        let button = document.createElement('input');
        let row = classes[i];
        let schoolSemester = row.children[0].textContent.toString();
        let semester = row.children[1].textContent.toString();
        let courseNumber = row.children[2].textContent;
        courseNumber = courseNumber.replace(/\s\s/, "");
        let key = schoolSemester + semester + courseNumber;
        console.log(key);

        insert_element.className = "input";
        insert_element.style = "font-family:Arial";
        button.type = "button";
        button.name = "c_key";
        button.value = "暗黑";
        button.sytle = "width:150; text-align:center; font-size:12px; white-space:pre-wrap; vertical-align:middle;";
        button.onclick = function () {form1.get_ckey.value = key;showall();};

        insert_element.appendChild(button);
        row.insertBefore(insert_element, row.children[7]);
    }

    // add some important variable into window for debug
    window.OhMyNthuDebug = {}
    var debug = window.OhMyNthuDebug;
    debug.tables = tables;
    debug.indexName = indexName;
    debug.classes = classes;
})();
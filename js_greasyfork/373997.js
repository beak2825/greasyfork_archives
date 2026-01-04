// ==UserScript==
// @name         Milovana Snakes and Ladders Toolkit
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Making snakes and ladders easy!
// @author       BluNote
// @match        https://milovana.com/webteases/showtease.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373997/Milovana%20Snakes%20and%20Ladders%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/373997/Milovana%20Snakes%20and%20Ladders%20Toolkit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Build interface
    //Create & Append div
    var parent = document.getElementById("ci");
    var div = document.createElement("div");
    div.id = "snl";
    parent.appendChild(div);

    //Creating Button
    var btn = document.createElement("input");
    btn.type = "button";
    btn.value = "Roll";
    btn.id = "rng_Button";
    btn.onclick = init;

    //Appending Button
    div.appendChild(btn);

    //Creating Lottery Checkbox
    var check = document.createElement('input');
    check.type = "checkbox";
    check.id = "lotteryEnable";

    var label = document.createElement("Label");
    label.innerHTML = "Lottery Mode";
    label.setAttribute("for", "lotteryEnable");

    //Creating Lottery Boxes
    var input1 = document.createElement('input');
    var input2 = document.createElement('input');
    input1.type = "number";
    input2.type = "number";
    input1.placeholder = "min";
    input2.placeholder = "max";
    input1.id = "minBox";
    input2.id = "maxBox";
    input1.style.width = "100px";
    input2.style.width = "100px";

    //Look for saved data from previous page
    var storedMin = localStorage.getItem('min');
    var storedMax = localStorage.getItem('max');
    var storedCheck = localStorage.getItem('check');

    console.log("storedMin: "+ storedMin + " storedMax: " + storedMax + " storedCheck: " + storedCheck);
    if (storedMin != null) input1.value = storedMin;
    if (storedMax != null) input2.value = storedMax;
    if (storedCheck != null) {
        if (storedCheck == "true")
            check.checked = true;
        else
            check.checked = false;
    }

    //Appending Lottery Boxes
    div.appendChild(input1);
    div.appendChild(input2);

    //Line break cause prettier
    var br = document.createElement("br");
    div.appendChild(br);

    //Appending Checkbox & Label
    div.appendChild(check);
    div.appendChild(label);

    function init(){
        //Get and Store min/max to preserve while playing
        var min = Number(input1.value);
        var max = Number(input2.value);
        console.log("min: " + min + " max: " + max);
        localStorage.setItem('min', min);
        localStorage.setItem('max', max);
        localStorage.setItem('check', check.checked);
        //Input validation and rolling
        if (min <= max)
            var rng = random(min, max);
        else {
            alert("min must be smaller or equal to max");
            return;
        }
        console.log("Rolled: " + rng);
        //Get current URL and parse
        var url = window.location.href;
        var currentPage = parsePage(url);
        console.log("Current Page: " + currentPage);
        //Handle Lottery Mode
        if (check.checked == true) lotteryMode(url, currentPage, rng);
        //URL manipulation
        var nextURL = generateNextPage(url, currentPage, rng);
        console.log("New URL: " + nextURL);
        //go to next Page
        if (check.checked == false)
            location.href = nextURL;
    }

    function lotteryMode(url, currentPage, num){
        if (!url.includes("&p=")) url += "&p=" + num;
        else {
            url = url.replace(("&p=" + currentPage), ("&p=" + num));
        }
        console.log("LOTTERY MODE: URL: " + url);
        location.href = url;
    }

    function generateNextPage(url, currentPage, rng){
        var idx = url.search("&p=");
        var num = currentPage + rng;
        console.log("DEBUG: num: " + num);
        if (idx != -1){
            url = url.replace(("p=" + currentPage), ("p=" + num));
            console.log("DEBUG2: " + url);
        }
        else url += "&p=" + num;
        return url;
    }

    function parsePage(url){
        var idx = url.search("&p=");
        if (idx != -1){
            url = url.replace("#t", "");
            return Number(url.slice(idx+3, url.length));
        }
        //First page doesnt specify so in url
        else return 1;
    }

    function random(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


})();
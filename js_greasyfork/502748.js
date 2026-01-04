// ==UserScript==
// @name         Rubric Marks to csv for Google Classroom
// @namespace    http://tampermonkey.net/
// @version      2024-08-05
// @description  Export rubric marks from Google Classroom assignment to a .csv file
// @author       Alex Brewer
// @match        https://classroom.google.com/g/*
// @icon         https://www.gstatic.com/classroom/logo_square_rounded.svg
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/502748/Rubric%20Marks%20to%20csv%20for%20Google%20Classroom.user.js
// @updateURL https://update.greasyfork.org/scripts/502748/Rubric%20Marks%20to%20csv%20for%20Google%20Classroom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var altPressed = false;
    var sPressed = false;
    var dPressed = false;
    var listening = true;

    var rows = [];
    //rows.push([document.title]);

    console.log('GC Rubric Marks script is active');

    window.setInterval(getScores,1000);

    var counterBox = document.createElement("div");
    counterBox.id = "counter-box";
    counterBox.style.position="fixed";
    counterBox.style.top="2px";
    counterBox.style.right="200px";
    counterBox.style.zIndex = "1";

    var counter = document.createElement("span");
    counter.innerText=`Scores added: 0 / ${document.querySelectorAll('[class="Ckubsf"]')[0].childElementCount}`;
    counterBox.append(counter);

    var downloadBtn = document.createElement("span");
    downloadBtn.innerText = "[ Alt+S - Download CSV ]";
    counterBox.append(downloadBtn);

    document.body.append(counterBox);


    document.addEventListener("keydown", keyPressed);
    document.addEventListener("keyup", keyLifted);
    function keyPressed(e){
        if(listening){
            if(e.code=="KeyS"){
                sPressed = true;
            }
            if(e.code=="AltLeft"){
                altPressed = true;
            }

            if(altPressed && sPressed){
                console.log("Pressed Alt+S");
                listening = false;
                downloadCSV();
            }

        }
    }
    function keyLifted(e){
        if(e.code=="KeyS"){
            sPressed = false;
            listening = true;
        }
        if(e.code=="AltLeft"){
            altPressed = false;
            listening = true;
        }
    }

    function getHeaders(){
        var student = document.querySelectorAll('[aria-checked="true"]')[0].innerText.replace(/\n/g, ",");
        var scores = document.getElementsByTagName("input");

        var scoreValues = [];

        scoreValues.push("name");
        for(var score of scores){
            var scoreLabel = score.getAttribute("aria-label").split('“');
            if(scoreLabel.length==1){
                scoreValues.push(scoreLabel[0]);
            }
            else{
                scoreValues.push(score.getAttribute("aria-label").split('“')[1].split('”')[0]);
            }
        }

        var row = scoreValues.flat();
        rows.push(row);
        counter.innerText=`Scores added: ${rows.length-1} / ${document.querySelectorAll('[class="Ckubsf"]')[0].childElementCount}`;

    }

    function getScores(){
        if(rows.length==0){getHeaders();}
        var student = document.querySelectorAll('[aria-checked="true"]')[0].innerText.split("\n")[0];
        var scores = document.getElementsByTagName("input");

        var scoreValues = [];

        scoreValues.push(student.split(","));
        for(var score of scores){
            scoreValues.push(score.value);
        }

        var row = scoreValues.flat();
        if(rows.flat().includes(row[0])){
            //console.log("duplicate row");
        }
        else{
            rows.push(row);
            counter.innerText=`Scores added: ${rows.length-1} / ${document.querySelectorAll('[class="Ckubsf"]')[0].childElementCount}`;
        }

    }

    function downloadCSV(){
        console.log("attempting to download CSV");
        let csvContent = "data:text/csv;charset=utf-8,";

        rows.forEach(function(rowArray) {
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${document.title}.csv`);
        document.body.appendChild(link); // Required for FF

        link.click(); // This will download the data file named "my_data.csv".
    }
})();
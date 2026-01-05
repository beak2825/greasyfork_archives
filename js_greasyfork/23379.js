// ==UserScript==
// @name         Kikora hax
// @namespace    Danielv123
// @version      1.1.1
// @description  Attempts to record tasks submitted to kikora and delivers the correct results to everyone else
// @author       You
// @match        *.kikora.no/*
// @require      http://code.jquery.com/jquery-3.1.0.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/23379/Kikora%20hax.user.js
// @updateURL https://update.greasyfork.org/scripts/23379/Kikora%20hax.meta.js
// ==/UserScript==

var haxServer = "http://81.167.2.56:8090";
// expected name in JSON fields is something like C21803|C22001|C22022|188431
// it is grabbed from the URL up top, but URL parsing is unreliable so this may break for some.

// Datamine for the correct answer and send it to a server for future abuse
function getCorrectAnswer() {
    let url = document.location.href.replace("HWA|", "").replace("|", "/").replace("|", "/").split(/[/:]+/);
    let x = false;
    let name = "";
    try{
        x = document.querySelector(".answer-trophy").childNodes[1].childNodes[0].dataset.title;
        name = url[7]+"|"+url[8]+"|"+url[9]+"|"+url[10];
    } catch (e){}
    if(x){
        console.log("Found answer! " + x);
        GM_xmlhttpRequest({
        method: "POST",
        url: haxServer + "/api/place",
        data: JSON.stringify({name: name, answer: x}),
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(data) {
            if(data /*&& typeof data == "string"*/){
                console.log("Sent answer! " + x);
            }
        }
    });
    }
}
setInterval(getCorrectAnswer,1000);
function outputSolution(string){
    document.querySelector("#userscript").innerHTML = string;
}
// try checking the last hint (which doesn't show up as a hint since its the answer)
url = document.location.href.replace("HWA|", "").replace("|", "/").replace("|", "/").split(/[/:]+/);
console.log(url);
console.log("Book: " + url[7] + " Theme: " + url[8] + " Chapter: " + url[9] + " Task: " + url[10]);

// Using this function is not recommended so I disabled it below by commenting it out. Turns out it places a lot of strain on kikoras servers so they called me and asked me to turn it off :P
// I am still going to leave it in as it works nicely if called with a number liker 15 or 30
function wasddas(number) {
    number = number - 1;
    (function(number){
        url = document.location.href.replace("HWA|", "").replace("|", "/").replace("|", "/").split(/[/:]+/);
        $.ajax({
            type: "POST",
            url: "/k/json",
            data: 'request={"solution":{"containerid":"'+url[9]+'","exerciseid":'+url[10]+',"timeusedforevent":'+666+',"calculationid":0,"solutionid":' + number + ',"newcalculation":false,"lcode":"nb"}}',
            dataType: "json",
            success: function(data) {
                if(data[0].solution){
                    console.log(number);
                    console.log("Hint found!");
                    console.log(JSON.parse(data[0].solution.esl.replace("[[km:","").replace("]]","")).text);
                    outputSolution(JSON.parse(data[0].solution.esl.replace("[[km:","").replace("]]","")).text);
                } else {
                    console.log("Not found :'(");
                    if (number>-10){
                        wasddas(number);
                    }
                }
            },
            error: function() {
                // alert('error handing here');
            }
        });
    })(number);
}
$('body').append("<div id='userscript' style='position:fixed;background-color:white;z-index:100000000;bottom:0px;right:0px;height:50px;width:150px;'></div>");
// start it up
setInterval(function(){
    //wasddas(30);
    let url = document.location.href.replace("HWA|", "").replace("|", "/").replace("|", "/").split(/[/:]+/);
    data = {
        name: url[7]+"|"+url[8]+"|"+url[9]+"|"+url[10],
    };
    GM_xmlhttpRequest({
        method: "POST",
        url: haxServer + "/api/get",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(data) {
            //console.log("Got answer from server! " + JSON.stringify(data));
            if(data && typeof data == "object"){
                //console.log("Got answer from server! " + data.responseText);
                outputSolution(data.responseText);
            }
        }
    });
    console.log("Asking for answer to " + JSON.stringify(data));
}, 5000);
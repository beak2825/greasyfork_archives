// ==UserScript==
// @name         EMI 2021 agenda simplify
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  extract EMI agenda
// @author       wang19891218
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @include      https://mvp.markeys.onl/EMI2021/agenda*
// @icon         https://www.google.com/s2/favicons?domain=geeksforgeeks.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427040/EMI%202021%20agenda%20simplify.user.js
// @updateURL https://update.greasyfork.org/scripts/427040/EMI%202021%20agenda%20simplify.meta.js
// ==/UserScript==

$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'https://rawcdn.githack.com/nextapps-de/winbox/0.1.8/dist/css/winbox.min.css') );
const resizeObserver = new ResizeObserver(entries =>{
  console.log('Body height changed:', entries[0].target.clientHeight)
  var simpleAgenda = document.getElementById("simpleAgenda")
  simpleAgenda.innerHTML = extractAgenda()
   console.log("updated")}
)

// start observing a DOM node
resizeObserver.observe(document.body)

$(window).on("resize", function(){

})

$.getScript(
    "https://rawcdn.githack.com/nextapps-de/winbox/0.1.8/dist/js/winbox.min.js",
    function() {
        html = extractAgenda()
        divControl = addDiv(html);
        var box = document.getElementById("simpleAgenda")
        var winbox = new WinBox({
            id: "my-window",
            class: ["no-full", "my-theme"],
            root: document.body,
            title: "simple agenda",
            background: "darkpurple",
            border: 4,
            width: "80%",
            height: "90%",
            x: "10%",
            y: "10%",
            max: false,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            index: 2000,
            mount: divControl,
            onclose: function() {
                document.getElementById("simpleAgenda").remove()
            }
        });
        // console.log("winbox mounted")
        // console.log( "jQuery running" )

    }
)

function extractAgenda() {
    'use strict';
    // console.log("extractAgendaRnning")
    var arrayLinks = []
    var htmlCollection = document.getElementsByClassName("session-container")
    for (var item of htmlCollection) {
        arrayLinks.push(item)
    }
    // console.log(arrayLinks)
    // var item = arrayLinks[0]
    var html = ""
    for (item of arrayLinks) {
        // console.log(item)
        try{
            html += item2html(item)
        }
        catch (error) {

    }

    }
    return html

}

function item2html(item) {
    var title
    var startTime
    var endTime
    var listInfo
    title = item.getElementsByClassName("session-title")[0].text
    startTime = item.getElementsByClassName("start-time")[0].textContent
    endTime = item.getElementsByClassName("end-time")[0].textContent
    listInfo = item.getElementsByClassName("sbs-preview-session-description")[0].getElementsByTagName("div")[0].innerText.split("\n")

    // console.log(title)
    // console.log(startTime)
    // console.log(endTime)
    // console.log(listInfo)
    var html = ""
    html += "<h1>" + title + "</h1>"
    html += "<h2>" + startTime + "-" + startTime + "</h2>"
    var temp_str
    var i_str
    for (i_str = 0; i_str < listInfo.length; i_str++) {
        // console.log(temp_str)
        temp_str = listInfo[i_str]
        // console.log(temp_str)
        if (temp_str.includes("AM") || temp_str.includes("PM")){
            // console.log("good")
            html += "<br>" + temp_str + '; Title: ' + listInfo[i_str + 1] + '; Presenter:  ' + listInfo[i_str + 2]
        }

    }
    // console.log(html)

    return html
}

function addDiv(html) {
    // console.log("addDiv")
    var div_Control = document.createElement("div");
    div_Control.style.background = "rgba(255, 0, 0, 0.3)";
    div_Control.style.border = "solid"
    div_Control.style.padding = "12px";
    div_Control.id = "simpleAgenda"
    div_Control.className = "simpleAgenda"

    div_Control.innerHTML += "" + html


    document.getElementsByTagName("body")[0].appendChild(div_Control)
    return div_Control
}

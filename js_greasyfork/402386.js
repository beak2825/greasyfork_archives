// ==UserScript==
// @name         Wide CodeSkulptor
// @namespace    https://greasyfork.org/users/4756
// @version      0.1
// @description  Widen the main CodeSkulptor editor and console
// @author       saibotshamtul (Michael Cimino)
// @match        http://www.codeskulptor.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402386/Wide%20CodeSkulptor.user.js
// @updateURL https://update.greasyfork.org/scripts/402386/Wide%20CodeSkulptor.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    'use strict';

    // Your code here...

    /*
    var a = document.createElement("style");
    //a.innerHTML = "#main{width:1200px !important;}#console{float:right;width:587px;}.CodeMirror{width: 600px;}";
    a.innerHTML = "#main{width:2000px;}#console{float:left;width:987px;}.CodeMirror{width: 1000px;}";

    document.body.appendChild(a);
    */

    //list all jquery events attached to an element
    //jQuery._data(document.querySelector("#splitbar"),"events")

    //widen CodeSkulptor
    let $ = document.querySelector.bind(document);
    $("#main").style.width="2000px";
    //$("#eddiv").style.width="997px";
    $("#console").style.float="left";
    window.jQuery._data(document.querySelector("#splitbar")).events.dblclick[0].handler();
    //let mecs = ["#main", "#eddiv", "#console", "#splitbar"].map((x)=>{return parseInt(getComputedStyle(document.querySelector(x)).width.slice(0,-2))});
    $("#console").style.width = parseInt(document.querySelector("#main").style.width.slice(0,-2)) - parseInt(getComputedStyle(document.querySelector("#eddiv")).width.slice(0,-2)) - 14 + "px";
    //window.$("#splitbar").on("mousemove",
    $("#splitbar").onmousemove=
        function(e){
        $("#console").style.width = parseInt(document.querySelector("#main").style.width.slice(0,-2)) - parseInt(getComputedStyle(document.querySelector("#eddiv")).width.slice(0,-2)) - 14 + "px";
        //e.stopPropegation();
    };
    $("#splitbar").ondblclick=function(e){
        $("#console").style.width = parseInt(document.querySelector("#main").style.width.slice(0,-2)) - parseInt(getComputedStyle(document.querySelector("#eddiv")).width.slice(0,-2)) - 14 + "px";
        //e.stopPropegation();
    };

    //unrelated
    //prettify CodeSkulptor ... trying to make it similar to CodeSkulptor3
    document.querySelector("#controls").style.background = "#337ab7"; // change the topbar's background color
    //hide the brand ... and replace it with text
    document.querySelector("[id=brand]").style.display="none"; // hide the CodeSkulptor brand image that's in the controls topbar
    let homeTab = document.createElement("span");
    homeTab.style.fontFamily="sans-serif";
    homeTab.style.fontSize = "27px";
    homeTab.style.position ="absolute";
    homeTab.innerText = "CodeSkulptor";
    document.querySelector("#controls").appendChild(homeTab);
    homeTab.style.left = (parseInt(getComputedStyle(document.querySelector("#main")).width.slice(0,-2)) - homeTab.offsetWidth) / 2 + "px";

    /*
    let a = document.createElement("style");
    //a.innerHTML = "#main{width:1200px !important;}#console{float:right;width:587px;}.CodeMirror{width: 600px;}";
    a.innerText = "#run,#reset{background:#008B3C;border:1px solid #006923;}#run:hover,#reset:hover{background:#006923}";
    document.body.appendChild(a);
    */

/*
print range(25)
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
print range(50)
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49]

*/

})();
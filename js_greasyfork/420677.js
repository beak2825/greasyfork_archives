// ==UserScript==
// @name         W3Schools real darkmode
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Making W3School's darkmode button, a real darkmode button.
// @author       Alex_Joo
// @match        https://www.w3schools.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420677/W3Schools%20real%20darkmode.user.js
// @updateURL https://update.greasyfork.org/scripts/420677/W3Schools%20real%20darkmode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var stylesheet = `
/*Logo and login button*/
.darktheme .top{background-color:#282c34!important;color:#f1f1f1!important;}
.darktheme .w3schools-logo{color:#fff!important;}
.darktheme .w3schools-logo:hover{color:#46a049!important;}
.darktheme .login{color:#282c34!important;}
/*NavBar and dropdown*/
.darktheme .w3-bar{color:#282c34!important;}
.darktheme .w3-hover-white:hover{background-color:#282c34!important;color:#fff!important;}
.darktheme nav.w3-light-grey{background-color:#282c34!important;color:#f1f1f1!important;}
.darktheme nav.w3-light-grey h3{color:#fff!important;}
.darktheme nav.w3-light-grey .w3-button:hover{background-color:#333239!important;color:#fff!important;}
/*sidebar*/
.darktheme .w3-sidebar{background-color:#282c34!important;color:#f1f1f1!important;}
.darktheme .w3-sidebar h4{color:#fff!important;}
.darktheme .w3-sidebar .w3-button:hover{background-color:#333239!important;color:#fff!important;}
/*main*/
.darktheme #main{background-color:#282c34!important;color:#f1f1f1!important;}
.darktheme #main .w3-row, .darktheme #main .w3-row .w3-text-dark-grey,{color:#f1f1f1!important;}
.darktheme #main .w3-row h1,.darktheme #main .w3-row h2,.darktheme #main .w3-row h3,.darktheme #main .w3-row h4,.darktheme #main .w3-row h5,.darktheme #main .w3-row h6{color:#fff!important;}
.darktheme #main .w3-row p{color:#f1f1f1!important;}
.darktheme #main div.w3-light-grey{background-color:#333239!important;color:#f1f1f1!important;}
.darktheme #main .w3-button:not(.w3-theme){background-color:#111!important;color:#f1f1f1!important;}
.darktheme #main .w3-button:not(.w3-theme):hover{background-color:#000!important;color:#fff!important;}
.darktheme #main .w3-dark-grey{background-color:#282c34!important;}
.darktheme #main .w3-dark-grey .w3-white{background-color:#333239!important;}
.darktheme #main .w3-white{background-color:#333239!important;}
.darktheme #main .w3-btn.w3-green{color:#282c34!important;}
.darktheme .w3-button.w3-theme{color:#333239!important;}
.darktheme #main .w3-text-dark-grey{color:#f1f1f1!important;}
/*topnav*/
.darktheme .topnav .w3-bar-item{background-color:#333239!important;color:#f1f1f1!important;}
.darktheme .topnav .w3-bar-item:hover{background-color:#282c34!important;color:#fff!important;}
.darktheme .topnav .w3-bar-item:focus{background-color:#282c34!important;color:#fff!important;}
.darktheme .topnav .w3-bar{background-color:#333239!important;}
/*topnav dropdown*/
.darktheme .topnav{background-color:#282c34!important;}
.darktheme .topnav .w3-row-padding .w3-bar-item{background-color:#282c34!important;color:#f1f1f1!important;}
.darktheme .topnav .w3-row-padding .w3-bar-item:hover{background-color:#333239!important;color:#fff!important;}
.darktheme .topnav .w3-row-padding .w3-bar-item:focus{background-color:#333239!important;color:#fff!important;}
/*Info panel*/
.darktheme .w3-info{background-color:#373d48!important;}

/*Other*/
.darktheme .w3-btn{color:#282c34!important;}
.darktheme .w3-example{background-color:#333239!important;color:#f1f1f1!important;}
.darktheme #w3-exerciseform{background-color:#333239!important;}
.darktheme .exercisewindow{background-color:#282c34!important; color:#f1f1f1!important;}
.darktheme .exerciseprecontainer{background-color:#333239!important;color:#f1f1f1!important;}
.darktheme input{background-color:#282c34!important;color:#f1f1f1!important;}
.darktheme .bigbtn{background-color:#111!important;color:#f1f1f1!important;border-width:0px!important;}
.darktheme .bigbtn:hover{background-color:#000!important;color:#fff!important;}
.darktheme #leftmenuinnerinner{background-color:#282c34!important; color:#f1f1f1!important;}
.darktheme #leftmenuinnerinner h2{color:#fff!important;}
.darktheme #leftmenuinnerinner a:hover{background-color:#333239; color:#fff;}
.darktheme #sidenav a.active {background-color:#4CAF50!important;color: #fff!important;}
.darktheme .w3-main > .w3-white{background-color:#282c34!important;}
.darktheme .sidesection{background-color:#333239!important;color:#f1f1f1!important;}
.darktheme .w3-border .w3-button{background-color:#333239!important;color:#f1f1f1!important;border-width:0px}
.darktheme .w3-border .w3-button:hover{background-color:#111!important;color:#fff!important;border-width:0px}
.darktheme .w3-border {border:0px!important;}
.darktheme #footer{color:#f1f1f1!important;}
.darktheme .w3-button.w3-light-grey{background-color:#222!important;color:#f1f1f1!important;}
.darktheme .w3-button.w3-light-grey:hover{background-color:#111!important;color:#fff!important;}

/*hr and borders*/
.darktheme *{border-color:#333239!important;}

/*tables*/
.darktheme table{background-color:#282c34!important;color:#f1f1f1!important;}
.darktheme tr{background-color:#282c34!important;color:#f1f1f1!important;}

.darktheme .w3-codespan{background-color:#333239!important;color:#f2998c!important;}
.darktheme .w3-note{background-color:#333239!important;}
.darktheme .tut_overview{background-color:#333239!important;}
.darktheme .active_overview{background-color:#333239!important;color:#f1f1f1!important;}


/*scrollbar*/
.darktheme ::-webkit-scrollbar{background-color:#282c34;}
.darktheme ::-webkit-scrollbar-button{background-color:#333239;}
.darktheme ::-webkit-scrollbar-thumb{background-color:#46a049}
`

/*
green: #46a049
dark: #282c34
darkdark: #333239
lightdark: #373d48
lightlight: #fff
lightlightgrey: #f1f1f1
grey: #616161
red: #f2998c
*/

function changepagetheme(){
    var cc = document.body.className;
    if (cc.indexOf("darktheme") > -1) {
        document.body.className = cc.replace("darktheme", "");
        localStorage.setItem("preferredmode", "light");
    } else {
        document.body.className += " darktheme";
        localStorage.setItem("preferredmode", "dark");
    }
}

    var styleelement = document.createElement("style");
    styleelement.type = "text/css";
    styleelement.innerHTML = stylesheet;
    document.body.appendChild(styleelement);
})();
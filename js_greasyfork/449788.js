// ==UserScript==
// @name         GC - Active Icon
// @author       Mousekat
// @namespace    https://greasyfork.org/users/748951
// @version      1.0
// @description  A link to change your active pet
// @include      *grundos.cafe/*
// @exclude      https://www.grundos.cafe/~*
// @exclude      https://grundos.cafe/process/
// @exclude      https://grundos.cafe/island/training/complete/*
// @exclude      https://www.grundos.cafe/userlookup/*
// @exclude      https://www.grundos.cafe/gallery/view/?username=*
// @exclude      https://www.grundos.cafe/petlookup/?pet_name=*
// @downloadURL https://update.greasyfork.org/scripts/449788/GC%20-%20Active%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/449788/GC%20-%20Active%20Icon.meta.js
// ==/UserScript==

//change this to you prets name, capitalization is important
var petname = "Britney"

//change this to any emoji you would like
var icon = "🌷"

//to change the location chage the values for top and left below


//code
var link ="<a href='https://www.grundos.cafe/setactivepet/?pet_name=" + petname + "'>" + icon + "</a>"

if (window.location.href.indexOf("grundos.cafe") > -1) {
var PPNContainer = document.createElement("div");
    PPNContainer.id = "PPNContainer";
    document.body.appendChild(PPNContainer);
    PPNContainer.innerHTML ="<p style='font-size: 13px'>" + link + "</style>"
    PPNContainer.style = `
    position:absolute;
    top:-7;
    left:732;
    background:transparent;
    padding-top:1px;
    padding-bottom:1px;
    font-size:15px;
    color:#00000;
    text-align:left;
`
}

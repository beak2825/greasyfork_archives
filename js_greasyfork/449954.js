// ==UserScript==
// @name         GC - Quick Links
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
// @exclude      https://www.grundos.cafe/help/profile/preview/
// @exclude      https://www.grundos.cafe/petlookup/?pet_name=*
// @downloadURL https://update.greasyfork.org/scripts/449954/GC%20-%20Quick%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/449954/GC%20-%20Quick%20Links.meta.js
// ==/UserScript==

//for best viewing change the #aio_sidebar 'top' css to 20px

//change this to you main pets name, capitalization is important
var petname = "Britney"

//change icons here
var petnameicon = "🌷"
var quickstockicon = "✨"
var dicearooicon = "🎲"
var kadsicon = "🐈"

//to change the location chage the values for top and left below

//code
var link ="<a href='/setactivepet/?pet_name=" + petname + "'>" + petnameicon +
    "</a> <a href='/quickstock/'>" + quickstockicon +
    "</a> <a href='/games/dicearoo/'>" + dicearooicon +
    "</a> <a href='/games/kadoatery/'>" + kadsicon +
    "</a>"

    if (document.getElementsByName("a").length > 0) {

var PPNContainer = document.createElement("div");
    PPNContainer.id = "PPNContainer";
    document.body.appendChild(PPNContainer);
    PPNContainer.innerHTML ="<p style='font-size: 13px'>" + link + "</style>"
    PPNContainer.style = `
    position:absolute;
    top:-10;
    left:805;
    background:transparent;
    padding-top:1px;
    padding-bottom:1px;
    font-size:15px;
    color:#00000;
    text-align:left;
`
}

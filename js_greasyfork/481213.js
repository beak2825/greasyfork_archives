// ==UserScript==
// @name         Handles
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  domain lists
// @author       You
// @match        https://twitter.com/i/flow/signup
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481213/Handles.user.js
// @updateURL https://update.greasyfork.org/scripts/481213/Handles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the list of data as an array
    var dataList = [
        "Harley Huff", "z.ea.ksfone@gmail.com",
        "Finnley Harris", "zeaks.f.one@gmail.com",
        "Penelope Jimenez",	"zea.ksfo.ne@gmail.com",
        "Silas Grimes",	"z.eaks.f.one@gmail.com",
        "Braelyn Small", "z.e.aksfo.n.e@gmail.com",
        "Rudy Ahmed", "z.ea.ksf.on.e@gmail.com",
        "Jolie Olsen", "z.eaksf.on.e@gmail.com",
        "Skyler Bender", "zeak.sf.o.n.e@gmail.com",
        "Lilyana Hood",	"zeaksf.o.n.e@gmail.com",
        "Brixton Mosley", "z.e.aksfon.e@gmail.com",
        "Zaniyah Santana", "z.e.ak.s.f.o.n.e@gmail.com",
        "Mohamed Waters", "zea.k.sf.o.n.e@gmail.com",
        "Bristol Henson", "ze.ak.s.fo.ne@gmail.com",
        "Bellamy Parra", "z.ea.k.sfo.ne@gmail.com",
        "Dalary Collier", "ze.a.ksfone@gmail.com",
        "Edison Manning", "z.eak.sf.on.e@gmail.com",
        "Jennifer Hinton", "ze.aks.f.on.e@gmail.com",
        "Frankie Lee", "z.e.a.ksfo.n.e@gmail.com",
        "Scarlett Velez", "ze.a.k.s.f.on.e@gmail.com",
        "Kareem Richard", "z.e.a.k.s.f.o.n.e@gmail.com",
        "Davina Gray", "z.e.a.ks.f.o.n.e@gmail.com",
        "Nicholas Kelley", "ze.a.ksf.o.ne@gmail.com",
        "Rosalie Webster", "z.eak.s.fon.e@gmail.com",
        "Shawn Sharp", "zea.ksfone@gmail.com",
        "Camryn Hall", "ze.ak.sf.one@gmail.com",
        "Thomas Greene", "ze.a.k.s.fo.ne@gmail.com",
        "Selena Pitts",	"z.e.a.ksfone@gmail.com",
        "Trey Dunlap", "z.eak.sfo.n.e@gmail.com",
        "Iliana Dunn", "zeak.sfo.n.e@gmail.com",
        "Dawson Crawford", "z.e.ak.sfone@gmail.com",
        "Aubree Daugherty", "z.ea.ks.fon.e@gmail.com",
        "Turner Strong", "z.eak.sf.o.ne@gmail.com",
        "Margo Terrell", "z.e.aksf.o.n.e@gmail.com",
        "Jaxen Welch", "z.e.a.ksf.o.n.e@gmail.com",
        "Amira Bell", "zea.k.sf.o.ne@gmail.com",
        "Emmett Zhang", "z.ea.ksfon.e@gmail.com",
        "Sarai Horton", "z.e.aksf.one@gmail.com",
        "Garrett Charles", "z.e.a.ksfo.ne@gmail.com",
        "Jenna McCann", "zea.k.s.fo.n.e@gmail.com",
        "Heath Elliott", "zea.ks.f.one@gmail.com",
        "Noelle Donaldson", "z.e.ak.s.fo.ne@gmail.com",
        "Canaan Cantu", "z.ea.ks.fo.ne@gmail.com",
        "Galilea Sparks", "zea.ksf.o.n.e@gmail.com",
        "Drake Yates", "ze.ak.sf.o.ne@gmail.com",
        "Charley Olson", "ze.aksf.on.e@gmail.com",
        "Malachi Ahmed", "ze.a.ks.fone@gmail.com",
        "Jolie Kirk", "ze.a.k.sf.on.e@gmail.com",
        "Alessandro Morgan", "z.e.aks.fon.e@gmail.com",
        "Delilah Lindsey", "zea.k.s.f.o.n.e@gmail.com",
        "Jayson Maynard", "ze.a.k.s.fone@gmail.com",
        "Carolyn Proctor", "ze.ak.s.f.o.ne@gmail.com",
        "Vance Schultz", "ze.a.ksf.o.n.e@gmail.com",
        "Briella Jones", "z.e.a.k.s.f.on.e@gmail.com",
        "William Stokes", "zeaksfo.ne@gmail.com",
        "Miranda Trevino", "ze.a.k.s.f.o.ne@gmail.com",
        "Jaime Frost", "ze.a.ksf.on.e@gmail.com",
        "Paula Mills", "ze.ak.sfo.n.e@gmail.com",
        "Alex Perkins", "zea.ks.f.o.n.e@gmail.com",
        "Sage Glenn", "z.e.a.ks.fo.n.e@gmail.com",
        "Zaid Cruz", "zeak.s.fone@gmail.com",
        "Claire Murillo", "z.ea.k.sfo.n.e@gmail.com",
        "Lance Jimenez",	"z.e.ak.s.f.o.ne@gmail.com",
        "Adeline Morton",	"z.ea.k.s.fo.n.e@gmail.com",
        "Roland Nielsen",	"z.e.a.ksf.on.e@gmail.com",
        "Vienna Harrington",	"z.ea.ks.f.o.ne@gmail.com",
        "Omari Ford",	"z.e.a.k.s.fo.n.e@gmail.com",
        "Alexandra Hardy",	"ze.ak.s.fon.e@gmail.com",
        "Jayceon Ballard",	"z.ea.k.sf.o.ne@gmail.com",
        "Alejandra Calhoun",	"ze.a.ksf.one@gmail.com",
        "Gary Leblanc",	"zea.k.s.f.o.ne@gmail.com",
        "Novalee Heath",	"z.eaks.f.on.e@gmail.com",
        "Lionel Quintana",	"ze.aksfo.n.e@gmail.com",
        "Kenia Henson",	"zea.ksf.on.e@gmail.com",
        "Bellamy Gomez",	"z.e.a.ks.fo.ne@gmail.com",
        "Natalie Bush",	"z.eak.s.f.o.n.e@gmail.com",
        "Tyson Compton",	"z.ea.k.s.f.on.e@gmail.com",
        "Elina Torres",	"zeak.s.f.o.n.e@gmail.com",
        "Jayden Norman",	"z.e.ak.s.fo.n.e@gmail.com",
        "Malani Ellis",	"z.ea.ksf.one@gmail.com",
        "Cole Palacios",	"z.ea.k.sf.o.n.e@gmail.com",
        "Bria Martin",	"z.ea.k.s.f.one@gmail.com",
        "Mateo Case",	"ze.a.k.sfone@gmail.com",
        "Cleo Pacheco",	"zeak.s.fon.e@gmail.com",
        "Erik Browning",	"z.e.ak.s.f.on.e@gmail.com",
        "Princess Arroyo",	"zeak.sf.on.e@gmail.com",
        "Alberto Massey",	"ze.a.k.s.f.o.n.e@gmail.com",
        "Clementine Choi",	"ze.a.k.sfo.n.e@gmail.com",
        "Khari Perry",	"z.e.ak.sf.o.ne@gmail.com",
        "Clara Brady",	"z.e.aksfone@gmail.com",
        "Reed Randolph",	"z.e.a.k.sf.o.ne@gmail.com",
        "Kailey Cano",	"z.e.a.k.sf.o.n.e@gmail.com",
        "Terry Nicholson",	"z.e.a.ksfon.e@gmail.com",
        "Justice McFarland",	"z.eak.sf.one@gmail.com",
        "Dane Meyers",	"z.ea.k.s.fone@gmail.com",
        "Leyla Sullivan",	"z.e.ak.sfo.ne@gmail.com",
        "Evan Schultz",	"ze.aksfone@gmail.com",
        "Briella Welch",	"zeaksf.one@gmail.com",
        "Hendrix Shepherd",	"zeaks.fo.ne@gmail.com",
        "Katalina Clark",	"ze.a.ksfo.n.e@gmail.com",
        "John Dodson",	"ze.a.ks.f.o.ne@gmail.com",
        "Etta Phillips",	"zea.ks.fone@gmail.com",
        "Andrew Nicholson",	"ze.a.ksfon.e@gmail.com",
        "Justice Steele",	"ze.a.ks.f.o.n.e@gmail.com",
        "Elian Cardenas",	"z.e.aks.fo.ne@gmail.com",
        "Raven Dudley",	"ze.a.ks.fo.ne@gmail.com",

    ];

    // Get the current index of the list from the localStorage
    var index = localStorage.getItem("dataListIndex") || 0;

    // Get the next two items from the list
    // Get the next two items from the list
    var data1 = dataList[index % dataList.length]; // This is the name
    var data2 = dataList[(index + 1) % dataList.length]; // This is the email


    // Create a div element to display the data
    var div = document.createElement("div");

    // Set the style of the div element
    div.style.position = "fixed"; // Make the div element stay in the same position
    div.style.top = "10px"; // Set the distance from the top of the page
    div.style.right = "10px"; // Set the distance from the right of the page
    div.style.width = "200px"; // Set the width of the div element
    div.style.height = "100px"; // Set the height of the div element
    div.style.backgroundColor = "white"; // Set the background color of the div element
    div.style.border = "1px solid black"; // Set the border of the div element
    div.style.padding = "10px"; // Set the padding of the div element
    div.style.zIndex = "9999"; // Set the z-index of the div element to be on top of other elements
    div.style.overflow = "auto"; // Set the overflow of the div element to allow scrolling
    div.style.color = "black"; // Set the text color of the div element

    // Set the content of the div element
    div.innerHTML = data1 + "<br>" + data2;

    // Append the div element to the body of the document
    document.body.appendChild(div);

    // Increment the index by two and store it in the localStorage
    index = (index + 2) % dataList.length;
    localStorage.setItem("dataListIndex", index);
})();
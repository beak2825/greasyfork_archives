// ==UserScript==
// @name     Whatsapp Toggle (Hide/Show) Contacts By N.S
// @version  1.2
// @grant    none
// @match    *://web.whatsapp.com/*
// @description Creates A Toggle Button Switch Which Hides And Shows The WhatsApp Contacts And Messages For Privacy (Also ESC Key can be used)
// @namespace astroid.com.tr
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/416333/Whatsapp%20Toggle%20%28HideShow%29%20Contacts%20By%20NS.user.js
// @updateURL https://update.greasyfork.org/scripts/416333/Whatsapp%20Toggle%20%28HideShow%29%20Contacts%20By%20NS.meta.js
// ==/UserScript==

var myInterval1 = setInterval(AddCButton ,100);
var myInterval2 = setInterval(AddMButton ,100);

function AddCButton() {
    var paneSide = document.getElementById("pane-side");
    var myDiv = document.getElementById("pane-side").parentElement;

    if(myDiv == null){
        console.log("there is no element...");
        return;
    }


    // creating button element
    var button = document.createElement('BUTTON');

    // creating text to be
    //displayed on button
    var text = document.createTextNode("Hide / Show");

    // appending text to button
    button.id = 'myButton';
    button.appendChild(text);
    button.onclick = function() { HideOrShowContacts() };
    button.style.color = 'red';
    button.style.border = '1px solid';
    button.style.height = '100%';
    button.style.fontSize = '18px';
    button.style.cursor = 'row-resize';


    // appending button to div
    myDiv.append(button);

    myDiv.insertBefore(button, paneSide);

    clearInterval(myInterval1);
    HideOrShowContacts();
    console.log("Button Has Been Added. Timer Suspended")
}


function AddMButton() {
    var main = document.getElementById("main");
    var myDiv = document.getElementById("main").parentElement;

    if(myDiv == null){
        console.log("there is no main parent element...");
        return;
    }


    // creating button element
    var button = document.createElement('BUTTON');

    // creating text to be
    //displayed on button
    var text = document.createTextNode("Hide / Show");

    // appending text to button
    button.id = 'myButton2';
    button.appendChild(text);
    button.onclick = function() { HideOrShowMain() };
    button.style.color = 'red';
    button.style.border = '1px solid';
    button.style.height = 'auto';
    button.style.width = '30%';
    button.style.fontSize = '18px';
    button.style.cursor = 'row-resize';
    button.style.position = 'absolute';
    button.style.marginLeft = '35%';
    button.style.zIndex = '9999';
    button.style.top = '5px';


    // appending button to div
    myDiv.append(button);

    myDiv.insertBefore(button, main);

    clearInterval(myInterval2);
    HideOrShowMain();
    HideOrShowMain();
    console.log("Main Button Has Been Added. Timer Suspended")
}

function HideOrShowContacts() {
    var pane = document.getElementById("pane-side");
    if (pane.style.display === "none") {
        pane.style.display = "flex";
        document.getElementById("myButton").innerText = 'Hide Contacts';
    } else {
        pane.style.display = "none";
        document.getElementById("myButton").innerText = 'Show Contacts';
    }

}

function HideOrShowMain() {
    var main = document.getElementById("main");
    if (main.style.display === "none") {
        main.style.display = "flex";
        document.getElementById("myButton2").innerText = 'Hide Messages';
    } else {
        main.style.display = "none";
        document.getElementById("myButton2").innerText = 'Show Messages';
    }

}


function HideAll() {
    var main = document.getElementById("main");
    var pane = document.getElementById("pane-side");
    pane.style.display = "none";
    document.getElementById("myButton").innerText = 'Show Contacts';
    main.style.display = "none";
    document.getElementById("myButton2").innerText = 'Show Messages';

}

function ShowAll() {
    var main = document.getElementById("main");
    var pane = document.getElementById("pane-side");
    pane.style.display = "flex";
    document.getElementById("myButton").innerText = 'Show Contacts';
    main.style.display = "flex";
    document.getElementById("myButton2").innerText = 'Show Messages';

}

function IsAllHidden(){
    var main = document.getElementById("main");
    var pane = document.getElementById("pane-side");
    if ((main==undefined || main.style.display === "none") && pane.style.display === "none") {
        return true;
    } else {
        return false;
    }
}

document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
        if(IsAllHidden()){
            ShowAll();
        }else{
            HideAll();
        }
    }
};


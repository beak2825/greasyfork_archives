// ==UserScript==
// @name         Proxer-Subs/Scans -- UserScript
// @namespace    
// @version      1.5.4
// @description  Dieses Script verbessert die User-Freundlichkeit der "Meine-Projekte" Liste
// @author       Dominik Bissinger alias Nihongasuki
// @include      http://proxer.me/*
// @include      https://proxer.me/*
// @include      http://www.proxer.me/*
// @include      https://www.proxer.me/*        
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/10709/Proxer-SubsScans%20--%20UserScript.user.js
// @updateURL https://update.greasyfork.org/scripts/10709/Proxer-SubsScans%20--%20UserScript.meta.js
// ==/UserScript==

//Run main after page load and add Eventlistener for AJAX Events
document.addEventListener('DOMContentLoaded', function(event) {
    $(document).ajaxSuccess (function () {
        main();
    });
    main();
});

//Main Funktion
var table = [];
var main = function () {
    //Check if correct Location to run
    if (window.location.href.indexOf('subs?s=my') === -1 || window.location.href.indexOf('forum') > -1) {return;};
    //Check if Tool already ran
    if (document.getElementsByClassName('scriptButton').length !== 0) {return;};
    
    //create new Style Element to set the buttons general Style
    var style = document.createElement('style');
    style.innerHTML = "\
    .scriptButton {\
        height: 20px; \
        border-style: solid;\
        border-width: 1px; \
        padding: 5px; \
        border-radius: 10px;\
    }\
    ";
    document.head.appendChild(style);
    
    //get importat Elements and create Variables
    var inner = document.getElementsByClassName('inner')[0];
    var div = inner.getElementsByTagName('div');
    table = [];
    var a = [];
    
    //create Wrapper (for easier programming)
    var wrapper = document.createElement('span');
    wrapper.setAttribute ("id","releaseWrapper");
    inner.insertBefore(wrapper,div[0]);
    
    //loop through all Entries
    for (var i = 0; i < div.length; i++) {
        //move div into wrapper
        wrapper.appendChild(div[i]);
        
        //give div ID
        div[i].setAttribute("id","divID"+i)
        
        //get Links InnerHTML
        a[i] = div[i].getElementsByTagName('a')[0].innerHTML;
        
        //Remove Table
        table[i] = div[i].getElementsByTagName('table')[0];
        table[i].style.display = "none";
        
        //Create Button and Image
        var hr = div[i].getElementsByTagName('hr')[0];
        var br = document.createElement('br');
        var newSpan = document.createElement('span');
        var img = document.createElement('img');
        
        //Set Image Attributes
        img.setAttribute ("class","scriptButton");
        img.setAttribute ("id","showState"+i);
        img.setAttribute ("style","display: inline; position: relative; top: 10px; left: 15px;");
        if (div[i].getElementsByClassName('nextState').length !== 0 || div[i].getElementsByClassName('prevState').length !== 0) {
            img.src = "/images/misc/offlineicon.png";
        }else{
            img.src = "/images/misc/onlineicon.png";
        };
        
        //set Button Attributes
        newSpan.setAttribute ("class","scriptButton");
        newSpan.setAttribute ("id","hideButton"+i);
        newSpan.setAttribute ("style","cursor: pointer; display: inline; position: relative; left: 10px;");
        newSpan.innerHTML = "Tabelle anzeigen";
        
        //add Button and Image to Page
        div[i].insertBefore(newSpan,hr);
        div[i].insertBefore(img,hr);
        div[i].appendChild(br);
        
        //addEventListeners
        document.getElementById('hideButton'+i).addEventListener("click",function () {
            showHide(this.id);
        })
    };
    
    //Create Groups by Project
    buildGroups(inner,a,wrapper,div);
    
    //setStyle of Buttons
    var color = "";
    var setStyle = function () {  
        for (var i = 0; i < 4; i++) {
            if (color === "gray") {
                var buttons = document.getElementsByClassName('scriptButton');
                for (var j = 0; j < buttons.length; j++) {
                    buttons[j].style.backgroundColor = "#5E5E5E";
                    buttons[j].style.borderColor = "#FFF";
                };
            }else if (color === "black") {
                var buttons = document.getElementsByClassName('scriptButton');
                for (var j = 0; j < buttons.length; j++) {
                    buttons[j].style.backgroundColor = "#000";
                    buttons[j].style.borderColor = "#FFF";
                };
            }else if (color === "old_blue") {
                var buttons = document.getElementsByClassName('scriptButton');
                for (var j = 0; j < buttons.length; j++) {
                    buttons[j].style.backgroundColor = "#F3FBFF";
                    buttons[j].style.borderColor = "#000";
                };
            }else{
                var buttons = document.getElementsByClassName('scriptButton');
                for (var j = 0; j < buttons.length; j++) {
                    buttons[j].style.backgroundColor = "#F3FBFF";
                    buttons[j].style.borderColor = "#000";
                };
            };
        };
    };
        
    //Read Cookie
    var name = "style=";
    var cookieCheck = function () {
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === " ") {
                c = c.substring(1);
            };
            if (c.indexOf(name) == 0) {
                color = c.substring(name.length,c.length);
                setStyle();
            };
        };
        if (color === "") {
            cookieCheck();
        };
    };
    cookieCheck();
    
};

//Gruppiere Einträge
var buildGroups = function (inner,a,wrapper,div) {
    var projects = [];
    var z = 0;
    inner.getElementsByTagName('h3')[0].innerHTML = "Projekte";
    for (var i = 0; i < a.length; i++) {
        var num = a[i].match(/\d+/g);
        var int = num[num.length-1];
        if (int > 99) {
            int = 2;
        } else if (int > 9) {
            int = 1;
        } else {
            int = 0;
        };
        a[i] = a[i].substring(0,a[i].length-2-int);
        if (projects.length === 0) {
            projects[z] = a[i];
            z++;
        }else{
            var x = 0;
            for (var j = 0; j < projects.length; j++) {
                if (a[i] !== projects[j]) {
                    x++;
                };
                if (x === projects.length) {
                    projects[z] = a[i];
                    z++;
                };
            };
        };
    };
    
    for (var i = 0; i < projects.length; i++) {
        var br = document.createElement('br');
        var hr = document.createElement('hr');
        var pButton = document.createElement('span');
        var img = document.createElement('img');
        
        //Set Image Attributes
        img.setAttribute ("class","scriptButton");
        img.setAttribute ("id","showProjectState"+i);
        img.setAttribute ("style","display: inline; position: relative; top: 10px; left: 5px;");
        
        pButton.setAttribute ("class","scriptButton");
        pButton.setAttribute ("id","projectButton"+i);
        pButton.setAttribute ("style","cursor: pointer; display: inline;");
        pButton.innerHTML = projects[i].substring(0,projects[i].length-16);
        
        wrapper.appendChild(pButton);
        wrapper.appendChild(img);
        wrapper.appendChild(hr);
        wrapper.appendChild(br);
        
        var x = 0;
        for (var j = 0; j < div.length; j++) {
            var newDiv = document.getElementById('divID'+j);
            var a = newDiv.getElementsByTagName('a')[0].innerHTML;
            var num = a.match(/\d+/g);
            var int = num[num.length-1];
            if (int > 99) {
                int = 2;
            } else if (int > 9) {
                int = 1;
            } else {
                int = 0;
            };
            a = a.substring(0,a.length-2-int);
            if (a === projects[i]) {
                if (newDiv.getElementsByClassName('nextState').length !== 0 || newDiv.getElementsByClassName('prevState').length !== 0) {
                    x = 1;
                };
                newDiv.style.display = "none";
                newDiv.setAttribute("class","project"+i);
                wrapper.insertBefore(newDiv,pButton);
            };
        };
        
        if (x === 1) {
            img.src = "/images/misc/offlineicon.png";
        }else{
            img.src = "/images/misc/onlineicon.png";
        };
        
        document.getElementById('projectButton'+i).addEventListener("click",function () {
            showHideProject(this.id);
        })
    };
};

//Zeige/Verstecke eine Tabelle
var showHide = function (id) {
    var i = id.substring(10);
    var button = document.getElementById(id);
    if (table[i].style.display === "none") {
        table[i].style.display = "inline";
        var br = document.createElement('br');
        button.innerHTML = "Tabelle ausblenden";
        button.style.left = "0px";
        button.parentNode.insertBefore(br,button)
        document.getElementById("showState"+i).style.display = "none";
    }else{
        table[i].style.display = "none";
        var parent = button.parentNode;
        var br = parent.getElementsByTagName('br');
        br = br[br.length-2];
        button.innerHTML = "Tabelle anzeigen";
        button.style.left = "10px";
        parent.removeChild(br);
        document.getElementById("showState"+i).style.display = "inline";
    };
};

//Zeige/Verstecke gruppierte Projekte
var showHideProject = function (id) {
    var i = id.substring(13);
    var wrapper = document.getElementById('releaseWrapper');
    var contents = wrapper.getElementsByClassName('project'+i);
    for (var j = 0; j < contents.length; j++) {
        if (contents[j].style.display === "none") {
            contents[j].style.display = "block";
            document.getElementById('projectButton'+i).style.borderWidth = "3px";
        }else{
            contents[j].style.display = "none";
            document.getElementById('projectButton'+i).style.borderWidth = "1px";
        };
    };
};
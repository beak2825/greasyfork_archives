// ==UserScript==
// @name         Nuke OC tracker
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  Dont be late...!
// @author       Jox
// @match        https://www.torn.com/laptop.php*
// @match        https://www.torn.com/pc.php*
// @match        https://www.torn.com/travelagency.php*
// @match        https://www.torn.com/index.php*
// @connect      nuclearfamilytorn.000webhostapp.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/368380/Nuke%20OC%20tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/368380/Nuke%20OC%20tracker.meta.js
// ==/UserScript==

var uid = getCookie('uid');

var hoursAlert = 8;
var showPC = false;

var msgText = "";

var debug = false;


if(location  == 'https://www.torn.com/index.php'){
    if(showPC){
        addLinkToPC();
    }
}
else{
    getCrimeData();
}


function getCrimeData(){
    if(uid){

        if(debug){console.log('get crime data...');}

        GM_xmlhttpRequest ( {
            method:     'GET',
            url:        'https://www.nukefamily.org/hq/old/crimes.json',
            onload:     function (responseDetails) {
                // DO ALL RESPONSE PROCESSING HERE...
                if(debug){console.log(responseDetails);}
                parseCrimeData(responseDetails.responseText);

            }
        } );

    }
    else{
        console.error('Dont have uid');
    }
}

function parseCrimeData(json){
    if(debug){
        console.log('start parse crime data');
        console.log(json);
    }
    var obj = JSON.parse(json);
    var crime = obj.crimes.filter(findMe);
    if(debug){
        console.log('parsed JSON and got crime with your data');
        console.log(crime);
    }
    if(crime.length > 0){
        if(debug){console.log('i am on crime - calculate time');}
        var now = Math.floor(Date.now() / 1000);

        var timeLeft = crime[0].time_ready - now;

        var totalSeconds = parseInt(timeLeft);
        var hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds % 60;

        msgText = (timeLeft < 0 ? "-" : "") + hours + "h " + minutes + "m " + (timeLeft > 0 ? "time left till " : "") + "OC ready!";

        if(debug){console.log(msgText);}
        if(location == "https://www.torn.com/travelagency.php"){
            if(debug){console.log('travel agencie page');}
            if(hours < hoursAlert){
                if(debug){console.log('here comes alert');}
                alert(msgText);
            }
        }

        addInfoElem(msgText);
        if(debug){console.log('info elemet added');}
        
    }
    else{
        if(debug){console.log('Not on OC');}
        msgText = 'Not on OC';
        if(location == "https://www.torn.com/travelagency.php"){
            setTimeout(function(){addInfoElem(msgText)},1000);
        }
    }
}


function addLinkToPC(){
    if(location == "https://www.torn.com/index.php"){
        //var elem = document.getElementById('top-page-links-list');
        var elem = document.querySelector('.content-title-links .events');
        //elem.innerHTML += '<a role="button" onclick="" aria-labelledby="laptop" class="laptop t-clear h c-pointer  m-icon line-h24 right " href="pc.php"><span class="icon-wrap"><i class="top-page-icon laptop-icon"></i></span> <span id="pc">PC</span></a>';
        var linkPC = document.createElement('a');
        linkPC.setAttribute('role','button');
        linkPC.setAttribute('aria-labelledby','laptop');
        linkPC.classList.add('laptop', 't-clear', 'h', 'c-pointer', 'm-icon', 'line-h24', 'right')
        linkPC.href = "pc.php";
        linkPC.innerHTML = '<span class="icon-wrap"><i class="top-page-icon laptop-icon"></i></span> <span id="pc">PC</span>'
        insertAfter(linkPC, elem);
    }
}

function findMe(crime){
    return crime.user_id == uid
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function ajax(method, url, data, callback){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            callback(this.responseText);
        }
    };
    xhttp.open(method, url, true);
    //xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(data));
}

function addInfoElem(msgText){

    //Creating message
    var divElem1 = document.createElement('div');
    var divElem2 = document.createElement('div');
    var divElem3 = document.createElement('div');
    var divElem4 = document.createElement('div');
    var iElem = document.createElement('i');

    divElem1.classList.add('info-msg-cont','border-round','m-top10','r7010');
    divElem2.classList.add('info-msg','border-round');
    divElem3.classList.add('delimiter');
    divElem4.classList.add('msg','right-round');
    divElem4.style.width = 'auto';
    iElem.classList.add('info-icon');

    divElem4.innerHTML = msgText;
    divElem3.appendChild(divElem4);
    divElem2.appendChild(iElem);
    divElem2.appendChild(divElem3);
    divElem1.appendChild(divElem2);

    if(location == "https://www.torn.com/travelagency.php"){

        //Adding message to travel agencie
        var elemBeforeToPlace = document.getElementsByClassName("info-msg-cont");
        elemBeforeToPlace[0].parentNode.insertBefore(divElem1, elemBeforeToPlace[0]);
    }
    else{
        //Adding message to laptop / PC
        var elem = document.getElementsByClassName("content-title")[0];
        if(elem){
            elem.appendChild(divElem1);
            if(debug){console.log('added element on PC/laptop');}
        }
        else{
            setTimeout(function(){addInfoElem(msgText)},1000);
            if(debug){console.log('ill try in sec');}
        }
    }
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
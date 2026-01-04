// ==UserScript==
// @name         EpicsGG Cheat
// @namespace    EGG
// @version      1.3.2
// @description  automated market
// @author       Marvins13
// @match        https://app.epics.gg/csgo/*
// @match        https://app.epics.gg/csgo/home/cheat
// @match        https://app.epics.gg/csgo/home/cheat/setup
// @match        https://app.epics.gg/csgo/marketplace/card/*
// @compatible   chrome
// @compatible   firefox
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/389574/EpicsGG%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/389574/EpicsGG%20Cheat.meta.js
// ==/UserScript==

var url = window.location.href;
var $ = window.jQuery;
setTimeout(() => addCheatMenu(),500);
setTimeout(() => start(),1500);
//start();


function start(){
    var cards = getCards();
    var cardsCount = cards.length;
    if(document.getElementsByClassName('_3TT3XjE').length == 1 && !url.includes('card')){
        if(url != 'https://app.epics.gg/csgo/home'){
            window.location.href = 'https://app.epics.gg/csgo/home';
        }
        makeSpin();
    }
    else if(url.includes('setup')){
        alertBox(cards);
        window.location.href = 'https://app.epics.gg/csgo/home';
    }
    else if(url.includes('cheat')){
        if(getCookie('idCount') == ''){
            setCookie('idCount','0');
        }else{
            var idCount = parseInt(getCookie('idCount'));
            if(cards[idCount] != '' && checkCard(cards[idCount])){
                setCookie('state' + cards[idCount], '1');
                window.open('https://app.epics.gg/csgo/marketplace/card/' + cards[idCount], '', 'width=300,height=250');
                setCookie('idCount', idCount + 1);
            }if(idCount >= cardsCount){
                setCookie('idCount','0');
            }
        }
    }else if(url.includes('card')){
        setTimeout(() => addControlButtons(), 1500);
    }
}

function makeSpin(){
    document.getElementsByClassName('_3TT3XjE')[0].click();
    setTimeout(() => {
        if(document.getElementsByClassName('_3iHrd71 _3vpQJEX _2A0QL90')[0].innerHTML.includes('SPIN NOW')){
            document.getElementsByClassName('_3iHrd71 _3vpQJEX _2A0QL90')[0].click();
            setTimeout(() => {window.location.href = 'https://app.epics.gg/csgo/home/cheat'},1000);
        }},2000);
}

function addCheatMenu(){
    var menuList = document.getElementsByClassName('_3PDeK3j')[0];
    var cheatButton = document.createElement ('div');
    cheatButton.innerHTML = '<div id="cheatButton" class="_3WiSMKW"><a class="_1v-2xgc" href="/csgo/home/cheat"><img src="https://i.imgur.com/Su7R7W9.png" style="width:70%;height:70%;"></a></div>';
    var menuButton = document.createElement ('div');
    menuButton.innerHTML = '<div id="menuButton" class="_3WiSMKW"><a class="_1v-2xgc" href="/csgo/home/cheat/setup"><img src="https://i.imgur.com/K5Iz94k.png" style="width:50%;height:50%;"></a></div>';
    menuList.appendChild(cheatButton);
    menuList.appendChild(menuButton);
}

function addControlButtons(){ //TODO: Only works on first card
    var menuList = document.getElementsByClassName('_2qwsRKN _3WcUvn3')[0];
    var addButton = document.createElement('div');
    //addButton.classList.add('_3wLLWY7');
    addButton.innerHTML = '<div class="_3wLLWY7"><a href="' + url + '/add"><img class="ql73ZIp" alt="add to cheat" src="https://i.imgur.com/SXm3ngb.png"><span class="_373IpZT">add to cheat</span></a></div>';
    var removeButton = document.createElement('div');
    //removeButton.classList.add('_3wLLWY7');
    removeButton.innerHTML = '<div class="_3wLLWY7"><a href="' + url + '/remove"><img class="ql73ZIp" alt="remove from cheat" src="https://i.imgur.com/8og7aQF.png"><span class="_373IpZT">remove from cheat</span></a>';
    menuList.appendChild(addButton);
    menuList.appendChild(removeButton);
}

function checkCard(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function getCards(){
    var outputCookie = getCookie('cardvalues');
    var cards = outputCookie.split(',');
    return cards;
}

function alertBox(cards) {
    var inputAlert = prompt("Card ID's:", cards);
    if (inputAlert == null || inputAlert == "") {
        //deleteCookie('cardvalues');
    } else {
        setCookie('cardvalues', inputAlert);
    }

}

function setCookie(cname, cvalue) {
    var expires = "expires=Sat, 03 Jan 2037 11:39:08 GMT";
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
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

function deleteCookie(cname) {
    document.cookie = cname +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function addToCookie(cname, value){
    var existing = getCookie(cname);
    if(!existing.includes(value)){
        if(existing != ''){
            setCookie(cname, existing + ',' + value);
        }else{
            setCookie(cname, value);
        }
        alert("ID added");
    }else{
        alert('ID is already added');
    }
}

function removeFromCookie(cname, value){
    var existing = getCookie(cname);
    if(existing.includes(',' + value)){
        deleteCookie(cname);
        setCookie('cardvalues', existing.replace(',' + value,''));
        alert('ID removed');
    }else if(existing.includes(value + ',')){
        deleteCookie(cname);
        setCookie('cardvalues', existing.replace(value + ',',''));
        alert('ID removed');
    }else{
        alert('ID couldn\'t be removed');
    }
}

setTimeout(() => playerLookup(), 7000);

function playerLookup() {
    if(url.includes('cheat') && !url.includes('setup')){
        location.reload();
    }
    var newurl = window.location.href;
    var cardurl = newurl.split('/');
    var cardID = cardurl[cardurl.length-1]
    var cardState = getCookie('state' + cardID);
    if(newurl.includes('card') && cardState == 1){
        console.log('test');
        deleteCookie('state'+cardID);
        var DivElmnts = document.getElementsByClassName('_3GqPK2u');
        var DivElmnt = DivElmnts.item(0);
        document.getElementsByClassName("_14Pjci6 _3a0WFIV")[0].click();
        var offers = DivElmnt.childNodes[1].childNodes[1].childNodes[1].childNodes;
        offers.forEach(function(element) {
            var pommes = element.childNodes;
            var prize = pommes[4].childNodes[0].childNodes[1].innerHTML;
            var mint = element.childNodes[0].innerHTML;
            if(mint.includes("A")){
                var mintNumber = mint.substring(1);

                if(mintNumber < 100){
                    var text = 'Mint: ' + mint + '\nCard: ' + cardID + '\nUrl: ' + newurl + '\nPreis: ' + prize;
                    console.log(text);
                    /*
                    GM_xmlhttpRequest ( {
                        method:     "POST",
                        url:        "http://localhost:8000/notes",
                        data:       "whatsappcontent=" + text,
                        headers:    {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        onload: function (response) {
                            console.log(response.responseText);
                        },
                        onerror: function(reponse) {
                            console.log("error: ", reponse);
                        }
                    });
                    */
                }
            }
        });
        close();
    }else if(newurl.includes('add')){
        var addCardID = cardurl[cardurl.length-2]
        addToCookie('cardvalues', addCardID);
    }else if(newurl.includes('remove')){
        var removeCardID = cardurl[cardurl.length-2]
        removeFromCookie('cardvalues', removeCardID);
    }
}







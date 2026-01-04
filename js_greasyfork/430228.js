// ==UserScript==
// @name         moomoo.io PRO MOD
// @version      3.6
// @description  Working auto heal and advanced minimap
// @author       EuphoricPenguin
// @match        http://moomoo.io/*
// @match        https://moomoo.io/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @grant        GM_registerMenuCommand
// @connect      moomoo.io
// @icon         http://i.cubeupload.com/5F25YM.jpg
// @namespace    https://greasyfork.org/users/136533
// @downloadURL https://update.greasyfork.org/scripts/430228/moomooio%20PRO%20MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/430228/moomooio%20PRO%20MOD.meta.js
// ==/UserScript==
$('#gameName').html('<div id="gameName">MooMoo.io</div>');
var commands = [{caption : 'MooMoo Hack Net Discord',execute : function () {go('https://discord.gg/pRBJ2C9');}}],
    moomooVer = $('#linksContainer2 .menuLink').html(),
    removeSelectors = ['#youtuberOf', '#linksContainer1', '#downloadButtonContainer', '#promoImgHolder', '#followText', '#adCard', '.menuHeader:nth-child(5)', '.menuHeader:nth-child(6)', '.menuText', '#twitterFollow', '#___ytsubscribe_0'],
    css = '#rightCardHolder {display: block!important;} #mapDisplay {background: url("//i.imgur.com/aGpK7hj.png")}',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style'),
    ws,
    myID,
    hasApple = true,
    f = 0,
    aV = [0,0],
    hZ = [[15, "Winter Cap"], [12, "Booster Hat"], [31, "Flipper Hat"], [10, "Bush Gear"], [22, "Emp Helmet"], [40,  "Tank Gear"], [20, "Samurai Armor"], [7, "Bull Helmet"], [11, "Spike Gear"]],
    rZe = 0;

style.type = 'text/css';
if (style.styleSheet){
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}

for ( let i = 0; i < removeSelectors.length; i++ ) {
    $(removeSelectors[i]).remove();
}

head.appendChild(style);
$('#linksContainer2').html('<a href="./docs/versions.txt" target="_blank" class="menuLink">' + moomooVer + '</a>');

WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m){
    this.oldSend(m);
    console.log(m);
    if (!ws){
        ws = this;
        socketFound(this);
    }
};

function socketFound(socket){
    socket.addEventListener('message', function(message){
        handleMessage(message);
    });
}



function go(url) {
    var win = window.open(url, '_blank');
    if (win) {
        win.focus();
    }
}

function parseWSMsg(s){
    if (s.indexOf("42") === -1) return -1;
    var o = s.substring(s.indexOf("["));
    return JSON.parse(o);
}

function heal(){
    console.log("healing");
    if (hasApple){
        if (!haveApple()){
            heal();
            return;
        }
        else ws.send("42[\"5\",0,null]");
    }
    else ws.send("42[\"5\",1,null]");
    ws.send("42[\"4\",1,null]");
}

function isElementVisible(e) {
    return (e.offsetParent !== null);
}

function haveApple(){
    if (hasApple) hasApple = isElementVisible(document.getElementById("actionBarItem10"));
    return hasApple;
}

function handleMessage(m){
    var info = parseWSMsg(m.data);

    if (info[0] == "1" && !myID){
        console.log('GOT ID: ' + info[1]);
        myID =  info[1];
    }

    if (info[0] === "10" && info[1] === myID && info[2] !== 100){
        var random = Math.random() * (0.5 - 0.3) + 0.3 * 1000;
        setTimeout(function(){
            heal();
        }, random);
    }
}



registerCommands();
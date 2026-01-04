// ==UserScript==
// @name         Moomoo.io LF MOD
// @version      1.2
// @description  Lag Remover
// @author       Quaid
// @match        http://moomoo.io/*
// @match        https://moomoo.io/*
// @match        http://45.77.0.81/*
// @match        https://45.77.0.81/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @grant        GM_registerMenuCommand
// @connect      moomoo.io
// @icon         https://vignette.wikia.nocookie.net/bravefrontierglobal/images/e/ea/Unit_ills_thum_30567.png/revision/latest/scale-to-width-down/42?cb=20160916043815
// @namespace https://greasyfork.org/users/151502
// @downloadURL https://update.greasyfork.org/scripts/37014/Moomooio%20LF%20MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/37014/Moomooio%20LF%20MOD.meta.js
// ==/UserScript==

$('#youtuberOf').remove();
var commands = [{caption : 'MooMoo Hack Net Discord',execute : function () {go('https://discord.gg/pRBJ2C9');}}],
    moomooVer = $('#linksContainer2 .menuLink').html(),
    removeSelectors = ['#youtuberOf', '#linksContainer1', '#downloadButtonContainer', '#promoImgHolder', '#followText', '#adCard', '.menuHeader:nth-child(5)', '.menuHeader:nth-child(6)', '.menuText', '#___ytsubscribe_0', '#twitterFollow', '#guideCard', '#linksContainer2', '#partyButton', '#joinPartyButton'],
    head = document.head || document.getElementsByTagName('head')[0],
    css = '#rightCardHolder {display: block!important;}',
    style = document.createElement('style'),
    ws,
    myID,
    hasApple = true,
    f = 0,
    aV = [0,0],
    rZe = 0;

style.type = 'text/css';
if (style.styleSheet){
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}

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
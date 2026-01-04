// ==UserScript==
// @name         GetYtbVdoInfo
// @namespace    http://tampermonkey.net/
// @version      0.1.9
// @description  Try to take over the world!
// @author       You
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/521193/GetYtbVdoInfo.user.js
// @updateURL https://update.greasyfork.org/scripts/521193/GetYtbVdoInfo.meta.js
// ==/UserScript==

var timerMainProcess = null;

(function() {
    'use strict';

    // Your code here...
    window.addEventListener('load', function(event) {
        timerMainProcess = this.window.setTimeout(doMainProcess, 5000);
    });
    timerMainProcess = this.window.setTimeout(doMainProcess, 5000);
    doMainProcess();
})();

function doMainProcess()
{
    console.log('doMainProcess');
    doReShowVdoInfo();
    timerMainProcess = window.setTimeout(doMainProcess, 5000);
}

function doReShowVdoInfo() {
    const divTop = document.querySelector('div#top-row');
    if (divTop == null) { console.error('div#top-row not found'); return; }

    var divVdoInfoConcat = generateDivOfVdoInfoConcat();

    var divOld = document.getElementById(divVdoInfoConcat.id);
    if (divOld !== null) { divOld.remove(); }

    insertAfter(divTop, divVdoInfoConcat);
}

function insertAfter(targetElement, newElement) {
    // Get the parent node of the targetElement
    var parent = targetElement.parentNode;

    // If the next sibling exists, insert the newElement before the next sibling
    if (targetElement.nextSibling) {
        parent.insertBefore(newElement, targetElement.nextSibling);
    } else {
        // If no next sibling, append newElement as the last child
        parent.appendChild(newElement);
    }
}

function generateDivOfVdoInfoConcat() {
    var span = document.createElement('span');
    span.innerText = getVdoInfoConcat();

    var btnCopy = document.createElement('button');
    btnCopy.innerText = 'Copy';
    btnCopy.addEventListener('click', function() {
        navigator.clipboard.writeText(getVdoInfoConcat());
    });

    var divResult = document.createElement('div');
    divResult.id = 'vdo_info_concat';
    divResult.appendChild(btnCopy);
    divResult.appendChild(span);

    return divResult;
}

function getVdoInfoConcat() {
    const titleVdo = getVdoTitleInfo();
    const nameCh = getChannelNameInfo();
    const idenCh = getChannelIdenInfo();
    const idenVdo = getVdoIdenInfo();
    return titleVdo + '#' + nameCh + '@' + idenCh + '-v=' + idenVdo;
}

function getVdoTitleInfo() {
    const title = document.querySelector('div#title.style-scope.ytd-watch-metadata').querySelector('yt-formatted-string').innerText;
    if (title == null || title == '') { return null; }

    const titleFormatted = getTextFormatted(title);
    return titleFormatted;
}

function getChannelNameInfo() {
    const nameChannel = document.querySelector('div.ytd-channel-name').querySelector('a.yt-simple-endpoint').innerText;
    if (nameChannel == null) { return null }

    const nameFmtted = getTextFormatted(nameChannel);
    return nameFmtted;
}

function getChannelIdenInfo() {
    const uriChannel = document.querySelector('div.ytd-channel-name').querySelector('a.yt-simple-endpoint').href;
    if (uriChannel == null) { return null }

    var idChannel = uriChannel.split('/').pop();
    if (!idChannel.startsWith('@')) { return null }
    idChannel = idChannel.slice(1);

    const idenDecoded = decodeURIComponent(idChannel);
    const idenFmtted = getTextFormatted(idenDecoded);
    return idenFmtted;
}

function getVdoIdenInfo() {
    const uriVdo = window.location.href;
    const objUri = new URL(uriVdo);
    const params = new URLSearchParams(objUri.search);
    const idenVdo = params.get('v');

    return idenVdo;
}

function getTextFormatted(textOriginal) {
    return textOriginal
        .replace(/( +)?\.\.\.( +)?/g, '…')
        .replace(/( +)?\|\|( +)?/g, '∥')
        .replace(/( +)?\/\/( +)?/g, '∥')
        .replace(/( +)?\*( +)?/g, '＊  ')
        .replace(/( +)?\/( +)?/g, '／')
        .replace(/( +)?\\( +)?/g, '＼')
        .replace(/( +)?'( +)?/g, '‘')
        .replace(/( +)?:( +)?/g, '：')
        .replace(/( +)?,( +)?/g, '，')
        .replace(/( +)?&amp;( +)?/g, '＆')
        .replace(/( +)?&( +)?/g, '＆')
        .replace(/( +)?~( +)?/g, '〜')
        .replace(/( +)?!( +)?/g, '！')
        .replace(/( +)?#( +)?/g, '＃')
        .replace(/( +)?%( +)?/g, '％')
        .replace(/( +)?\|( +)?/g, '｜')
        .replace(/( +)?\+( +)?/g, '＋')
        .replace(/( +)?\?( +)?/g, '？')
        ;
}

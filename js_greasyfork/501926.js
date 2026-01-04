// ==UserScript==
// @name         GetBiliVdoInfo
// @namespace    http://tampermonkey.net/
// @version      0.9.10
// @description  Try to take over the world!
// @author       You
// @match        https://*.bilibili.com/video/BV*
// @match        https://*.bilibili.com/video/av*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/501926/GetBiliVdoInfo.user.js
// @updateURL https://update.greasyfork.org/scripts/501926/GetBiliVdoInfo.meta.js
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
    console.log("doMainProcess");
    doReShowVdoInfo();
    timerMainProcess = window.setTimeout(doMainProcess, 5000);
}
 
function doReShowVdoInfo() {
    var divLeftContainer = document.getElementsByClassName('left-container')[0];
    if (divLeftContainer === undefined || divLeftContainer === null) { return; }
 
    var divToolbar = divLeftContainer.getElementsByClassName('video-toolbar-container')[0];
    if (divToolbar === undefined || divToolbar === null) { return; }
 
    var divVdoInfoConcat = generateDivOfVdoInfoConcat();
    var divVdoIdenInfoConcat = generateDivOfVdoIdenInfoConcat();
 
    var divVdoInfoConcatOld = document.getElementById(divVdoInfoConcat.id);
    if (divVdoInfoConcatOld !== null) { divVdoInfoConcatOld.remove(); }
    var divVdoIdenInfoConcatOld = document.getElementById(divVdoIdenInfoConcat.id);
    if (divVdoIdenInfoConcatOld !== null) { divVdoIdenInfoConcatOld.remove(); }
 
    insertAfter(divToolbar, divVdoInfoConcat);
    insertAfter(divVdoInfoConcat, divVdoIdenInfoConcat);
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
    // divResult.appendChild(document.createElement('br'));
 
    return divResult;
}
 
function generateDivOfVdoIdenInfoConcat() {
    var span = document.createElement('span');
    span.innerText = getVdoIdenInfo();
 
    var btnCopy = document.createElement('button');
    btnCopy.innerText = 'Copy';
    btnCopy.addEventListener('click', function() {
        navigator.clipboard.writeText(getVdoIdenInfo());
    });
 
    var divResult = document.createElement('div');
    divResult.id = 'vdo_iden_info_concat';
    divResult.appendChild(btnCopy);
    divResult.appendChild(span);
    // divResult.appendChild(document.createElement('br'));
 
    return divResult;
}
 
function getVdoInfoConcat() {
    var infoVdoTitle = getVdoTitleInfo();
    var infoAuthors = getAuthorsInfo();
    var infoVdoIden = getVdoIdenInfo();
 
    var output = infoVdoTitle + infoAuthors + '-' + infoVdoIden;
    return output
}
 
function getVdoIdenInfo() {
    var matchesIdVdo = window.location.href.match(/\/video\/([^\/?]+)/)
    var idVdo = matchesIdVdo.length > 1 ? matchesIdVdo[1] : 'BV0000000000';
 
    return idVdo;
}
 
function getVdoTitleInfo() {
    var titleVdo = document.getElementsByClassName('video-title')[0].innerHTML;
    titleVdo = getTextFormatted(titleVdo);
 
    return titleVdo;
}
 
function getAuthorsInfo() {
    var result = '';
    var i = 0;
 
    if (document.getElementsByClassName('staff-name').length > 0) {
        // co-production
        var linksStaff = document.getElementsByClassName('staff-name');
        for (i = 0; i < linksStaff.length; i++) {
            var linkStaff = linksStaff[i];
            var nameStaff = linkStaff.innerText;
            nameStaff = getTextFormatted(nameStaff);
 
            var compsIdStaff = linkStaff.href.split('/');
            var idStaff = compsIdStaff.length > 0 ? compsIdStaff[compsIdStaff.length - 1] : '000000000';
 
            result = result + '#' + nameStaff + '@' + idStaff;
        }
    } else if (document.getElementsByClassName('up-name').length > 0) {
        // independent creation
        var nameAuthor = document.getElementsByClassName('up-name')[0].innerHTML.replace(/\n +/, '').replace(/\n +<span.*$/, '');
        nameAuthor = getTextFormatted(nameAuthor);
 
        var compsIdAuthor = document.getElementsByClassName('up-name')[0].getAttribute('href').split('/');
        var idAuthor = compsIdAuthor.length > 3 ? compsIdAuthor[3] : '000000000';
 
        result = '#' + nameAuthor + '@' + idAuthor;
    }
 
    return result;
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
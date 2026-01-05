// ==UserScript==
// @name         ao3 tweak formatting
// @namespace    https://greasyfork.org/en/users/36620
// @version      2.3.0
// @description  quick tools for text formatting
// @author       scriptfairy
// @include      /https?://archiveofourown\.org/.*works/\d+/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19769/ao3%20tweak%20formatting.user.js
// @updateURL https://update.greasyfork.org/scripts/19769/ao3%20tweak%20formatting.meta.js
// ==/UserScript==

function doubleBreak(ch) {
    ch.innerHTML = ch.innerHTML.replace(/<br>/g,'<br><br>').replace(/<br\/>/g,'<br><br>');
}

function deSpace(ch) {
    var noBreak = document.createElement("style");
    noBreak.innerText = '#chapters br+br {display:none}';
    noBreak.type = 'text/css';
    document.head.appendChild(noBreak);
    ch.innerHTML = ch.innerHTML.replace(/&nbsp;/g, ' ');
}

function stripAlign(ch) {
    ch.innerHTML = ch.innerHTML.replace(/align="(left|center|align|justify)"/g, '');
}

function stripItalics(ch) {
    ch.innerHTML = ch.innerHTML.replace(/<em>/g,'').replace(/<\i>/g,'');
}

function deAsterisk(ch) {
    ch.innerHTML = ch.innerHTML.replace(/\*/g,'<i>').replace(/<i>\s/g,'</i>').replace(/<i>[^A-Za-z0-9]/g,'</i>');
}

function noTypewriter(ch) {
    ch.innerHTML = ch.innerHTML.replace(/(&nbsp;| ){2}/g,'&nbsp;');
}

function noEllipses(ch) {
    ch.innerHTML = ch.innerHTML.replace(/\.\.\./g, '.');
}

//
var chapter = document.getElementById('chapters');

var links = document.createElement('div');
links.innerHTML = '<span id="tweakFormat" class="click">Tweak Format</span>'
    + '<ul class="format-options">'
    + '<li><a id="deSpace">remove line breaks</a></li>'
    + '<li><a id="doubleBreak">insert line breaks</a></li>'
    + '<li><a id="stripAlign">align to default</a></li>'
    + '<li><a id="stripItalics">strip italics</a></li>'
    + '<li><a id="noEllipses">strip ellipses</a></li>'
    + '<li><a id="noTypewriter">remove double spaces</a></li>'
    + '<li><a id="deAsterisk">*word* to <em>word</em> (exp.)</a></li>'
    + '</ul>';
links.classList.add('tweak-format');

var linksFormat = document.createElement('style');
linksFormat.innerText = '.tweak-format {text-align:right; font-size:small; cursor:pointer}'
    + '.tweak-format .click+.format-options {display:none;}'
    + '.tweak-format .click::before {content:"\\25b6 \\0020";}'
    + '.tweak-format .clicked+.format-options {display:block;}'
    + '.tweak-format .clicked::before {content:"\\25bc \\0020";}';
linksFormat.type = 'text/css';

document.head.appendChild(linksFormat);
chapter.parentNode.insertBefore(links, chapter);

document.getElementById('deAsterisk').onclick = function() {deAsterisk(chapter);};
document.getElementById('stripItalics').onclick = function() {stripItalics(chapter);};
document.getElementById('stripAlign').onclick = function() {stripAlign(chapter);};
document.getElementById('doubleBreak').onclick = function() {doubleBreak(chapter);};
document.getElementById('deSpace').onclick = function() {deSpace(chapter);};
document.getElementById('noTypewriter').onclick = function() {noTypewriter(chapter);};
document.getElementById('noEllipses').onclick = function() {noEllipses(chapter);};

document.getElementById('tweakFormat').onclick = function() {
    if (this.classList.contains('click')) {
        this.classList.remove('click');
        this.classList += ' clicked';
    } else {
        this.classList.remove('clicked');
        this.classList += ' click';
    }
};
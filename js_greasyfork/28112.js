// ==UserScript==
// @name         MetroSave
// @namespace    greasyfork.org/Zart
// @version      2.2
// @date         2017-03-16
// @description  Add Save button to Metrolyrics site
// @author       Zart
// @icon         http://www.metrolyrics.com/favicon.ico
// @include      http://www.metrolyrics.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28112/MetroSave.user.js
// @updateURL https://update.greasyfork.org/scripts/28112/MetroSave.meta.js
// ==/UserScript==

(function() {
    'use strict';
  /*  //Fix Mozilla bug with innerText
    if (/Firefox/.test(navigator.userAgent)){
        var it = function(){var r=document.createRange();r.selectNode(this);var sel=window.getSelection();sel.addRange(r);var s=sel.toString();sel.removeAllRanges();return s;};
        Object.defineProperty(HTMLElement.prototype, 'innerText', {get: it});}

    var lyr = document.getElementsByClassName('verse');
    if (!lyr.length) return false;
    for (var i=0,s=[]; i<lyr.length; s.push(lyr[i++].innerText));
    var cop = document.getElementsByClassName('writers');
    for (i=0; i<cop.length-1; s.push(cop[i++].innerText));
    var src = document.getElementsByClassName('lyric-source')[0]; //mobile
    if(src) {src.lastChild.remove();src.lastChild.remove();s.push(src.innerText);}
    s = s.join('\n\n').replace(/\n/gm,'\r\n');*/

    var r=document.querySelectorAll('.verse,.writers:not(:last-child),.lyric-source>*:not(:nth-last-child(-n+2))');
    if (!r.length) return;
    for (var i=0,s=[]; i<r.length; i++){
        for (var j=0; j<r[i].childNodes.length; s.push(r[i].childNodes[j++].textContent));
        if(r[i].tagName=='P') s.push('\n\n'); else s.push('\n');}
    s = s.join('\n').replace(/\n{2,3}/g,'\n').replace(/\n/gm,'\r\n');

    var ss = document.styleSheets[0];
    ss.insertRule('.lyrics-top .social-bar a{width:calc((100% - 10px)/4)!important}',0);
    ss.insertRule('.container-8 .social-bar a{width: 20%!important}',0); //mobile
    var btn = document.getElementsByClassName('social-link');
    var a = btn[0].parentNode.insertBefore(document.createElement('A'), btn[0]);
    a.target = 'void';
    a.download = ml.lyricName + '.txt';
    var unsafe = /[^\0-\x7f\xa9]/, BOM = '\ufeff';
    if (unsafe.test(s))
        a.href = encodeURI('data:text/plain;utf8,' + BOM + s);
    else
        a.href = 'data:text/plain;quoted-printable,' + escape(s);

    a.style.cssText = 'background-color: green; background-position: center; background-repeat: no-repeat;';
    a.style.backgroundImage='url("data:image/gif;base64,R0lGODlhEAARAIABAP///wAAACH5BAkKAAEALAAAAAAQABEAAAIjjA2px6jfzoMxzFVvqlZzDXxeNjrg1Z1YejYqiYoUx9LMFhUAOw==")';
    a.style.marginRight = window.getComputedStyle(btn[0]).marginRight;  //mobile+desktop
})();
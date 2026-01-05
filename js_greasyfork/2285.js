// ==UserScript==
// @name        remove google search verbatim sidebar
// @namespace   *.google.*
// @description remove google search verbatim sidebar from search results
// @include     *.google.*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2285/remove%20google%20search%20verbatim%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/2285/remove%20google%20search%20verbatim%20sidebar.meta.js
// ==/UserScript==

var removeSideBar = function(){
    var x = document.querySelectorAll('#leftnav')[0];
    x.removeChild(x.childNodes[0]);
    x.style.width = 0;
    x = document.querySelectorAll('#gb')[0];
    while (x.firstChild) {
        x.removeChild(x.firstChild);
    }
    x.style.width = 0;
    x.style.display = 'none';
    x = document.querySelectorAll('td.sfbgg:nth-child(1)')[0];
    while (x.firstChild) {
        x.removeChild(x.firstChild);
    }
    x.style.width = 0;
//     x.style.display = 'none';

};

removeSideBar();



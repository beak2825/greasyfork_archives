// ==UserScript==
// @name         Radio Capital Downloader
// @name:it      Radio Capital Downloader
// @namespace    https://ciarpa.me
// @version      0.3.3
// @description  Allows direct downloading of Radio Capital shows in MP3 format
// @description:it Permette il download in formato MP3 dei programmi trasmessi da Radio Capital
// @author       Riccardo Sacchetto (ciarpa.me)
// @include      https://www.capital.it/programmi/*/puntate/*
// @include      https://www.capital.it/programmi/*/podcast/*
// @match        https://www.capital.it/programmi/*/puntate/*
// @match        https://www.capital.it/programmi/*/podcast/*
// @grant        none
// @license      MIT License
// @copyright    Copyright (C) 2019, by Riccardo Sacchetto
// @downloadURL https://update.greasyfork.org/scripts/390673/Radio%20Capital%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/390673/Radio%20Capital%20Downloader.meta.js
// ==/UserScript==

/*
Copyright (C) 2019 Riccardo Sacchetto

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';
    //Gets the container iframe, searches for the direct link to the mp3 and extracts the string
    var code = document.getElementsByTagName("iframe");
    //the for loop is used to examine the various elements, looking for the one containing the link
    var i,j;
    for (i = 0; i < code.length; i++) {
        if(code[i].outerHTML.includes(".mp3")){
            j=i;
        }
    }
    var start = code[j].outerHTML.search("https://media.capital.it");
    var end = code[j].outerHTML.search(".mp3")+4;
    var link = code[j].outerHTML.substring(start,end);
    //Creates an anchor element using the link found above
    var filename = link.substring(link.lastIndexOf('/')+1,link.length-4);
    var a = document.createElement('a');
    a.setAttribute('href',link);
    a.setAttribute('download',filename);
    a.innerHTML = "Download MP3";
    //Appends the element to the page, next to the show notes
    var element = document.getElementsByClassName("service-title text small");
    element[0].appendChild(a);
})();
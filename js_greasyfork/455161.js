// ==UserScript==
// @name         zele.st/NovelAI/ tags extractor
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Download the tags from zele.st/NovelAI/!
// @author       Konqi
// @match        https://zele.st/NovelAI/?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zele.st
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/455161/zelestNovelAI%20tags%20extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/455161/zelestNovelAI%20tags%20extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.newButton {'+
        'color: whitesmoke;'+
        'position: fixed;'+
        'top: 35px;'+
        'left: 150px;'+
        'background-color: #23253f;'+
        'padding: 10px;'+
        'font-size: 40px;'+
        'z-index: 9999;'+
        'display: block;'+
        'box-shadow: 0px 0px 10px 0px rgb(0 0 0);'+
        'margin: 10px;'+
        'margin-bottom: -100px;'+
        'border: 3px solid;'+
        'border-color: whitesmoke;'+
        'border-radius: 10px;'+
        'scale: 1;'+
        'text-align: center;'+
        'scale: 0.75;'+
        'transition: scale 0.25s;'+
        '}';
    document.getElementsByTagName('head')[0].appendChild(style);

    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.newButton:hover {    transform: scale(1.4);}';
    document.getElementsByTagName('head')[0].appendChild(style);
    // Your code here...
    var button = document.createElement("Button");
    button.innerHTML = "Exact tags from this page";
    //button.style = "top:20px;right:20px;position:fixed;z-index: 9999"
    button.className = "newButton";
    button.addEventListener("click", readData);
    document.body.appendChild(button);
    let starSubPage = window.location.href.indexOf("?");
    let endSubPage = window.location.href.indexOf("%");
    let subpageName = "";
    if(endSubPage == -1){
        subpageName = window.location.href.substring(starSubPage+1);
    } else {
        subpageName = window.location.href.substring(starSubPage+1, endSubPage);
    }
    subpageName = subpageName+ "_" +new Date().toLocaleDateString().replaceAll('/', '_');

    function readData(){
        let ar = document.getElementsByClassName("imageText");
        let tags = "";
        for (let i = 0; i < ar.length; i++) {
            //console.log(ar[i].innerHTML.replace(/\s+/g, ' ').trim());
            tags = tags.concat(ar[i].innerHTML.replace(/\s+/g, ' ').trim() + "\n");
        }
        download("tags_"+subpageName, tags);
    }
    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
})();
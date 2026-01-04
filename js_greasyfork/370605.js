// ==UserScript==
// @name         Madokami navigation controls + auto scroll to top on next page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds navigation controls that allow you to go to the previous or next page. By clicking the current page number you can specify the desired page (go to page). When clicking on the image to proceed to the next page, this script will automatically scroll up to the top, so you won't have to.
// @author       Zarnaik
// @match        https://manga.madokami.al/reader/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370605/Madokami%20navigation%20controls%20%2B%20auto%20scroll%20to%20top%20on%20next%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/370605/Madokami%20navigation%20controls%20%2B%20auto%20scroll%20to%20top%20on%20next%20page.meta.js
// ==/UserScript==

window.onLoad = start();

function start(){
    document.addEventListener("click",() => {
        window.scroll({top: 0, left: 0, behavior: 'smooth' });//scroll(0,200);
        addPageNumber();
    });
    addPageNumber();
}

function addPageNumber() {
    var page = document.location.href.split('index=')[1];
    var controls = document.createElement('p');
    controls.style = 'position:absolute;top: 5px;right:5px;background-color:black;cursor:pointer;'
    var page_element = document.createElement('a');
    page_element.innerHTML = 'p. ' + page;
    page_element.onclick = goToPage;
    page_element.title = 'Go to page';
    var previous = document.createElement('a');
    previous.innerHTML = '<';
    previous.href = document.location.href.split('index=')[0] + 'index=' + (page - 1);
    previous.style = 'padding-right: 15px';
    var next = document.createElement('a');
    next.innerHTML = '>';
    next.href = document.location.href.split('index=')[0] + 'index=' + (parseInt(page) + 1);
    next.style = 'padding-left: 15px';
    controls.appendChild(previous);
    controls.appendChild(page_element);
    controls.appendChild(next);
    document.body.appendChild(controls);

}

function goToPage() {
    var page = prompt('Go to page');
    document.location.href = document.location.href.split('index=')[0] + 'index=' + page;
}
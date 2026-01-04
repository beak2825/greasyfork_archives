// ==UserScript==
// @name         ttu-Ebook-Reader-search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a search bar on tte Ebook reader
// @author       Valentin Fabre
// @match        *://ttu-ebook.web.app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444318/ttu-Ebook-Reader-search.user.js
// @updateURL https://update.greasyfork.org/scripts/444318/ttu-Ebook-Reader-search.meta.js
// ==/UserScript==

let searchBar = document.createElement("div");
searchBar.style.order = "1";
searchBar.id = "searchBar";

let inputBar = document.createElement("input");
inputBar.type = "text";
inputBar.placeholder = "Search a LN";
inputBar.style.color = "black";
inputBar.style.height = "95%";
inputBar.style.borderRadius = "10px";

inputBar.addEventListener("keyup", ()=>{
    let elementTitleList = document.getElementsByClassName("line-clamp-3");
    let searchBarText = format(inputBar.value);

    for(let i = 0; i < elementTitleList.length; i++){
        let elementNode = elementTitleList[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;

        if(format(elementTitleList[i].innerHTML).includes(searchBarText)) {
            elementNode.style.visibility = "visible";
            elementNode.style.position = "relative";
        } else{
            elementNode.style.visibility = "hidden";
            elementNode.style.position = "absolute";
        }
    }
});

searchBar.append(inputBar);

window.onload = function() {
    document.addEventListener("DOMSubtreeModified", function() {
        if(window.location.pathname == "/manage" && !document.getElementById("searchBar")){
            addSearchBar();
        }
    });
}

function addSearchBar(){
    let position = document.getElementsByClassName("flex transform-gpu")[0]
    if(position){
        position.append(searchBar);
    }
}

function format(string) {
        return string.trim()
                     .toLowerCase()
                     .replace(/[\uff01-\uff5e]/g, function(ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xfee0); });
}
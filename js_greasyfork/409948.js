// ==UserScript==
// @name         Specific mule runtime doc version
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change mule runtime doc version to specific version
// @author       FM7077
// @match        *://docs.mulesoft.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409948/Specific%20mule%20runtime%20doc%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/409948/Specific%20mule%20runtime%20doc%20version.meta.js
// ==/UserScript==

var specificVersion = "4.1"
let storagedVersion = localStorage.getItem('storagedVersion')
if(storagedVersion !== null){
    specificVersion = storagedVersion
}

let myDiv = document.createElement('div');
myDiv.setAttribute("id", "myDiv");
myDiv.innerHTML = '<text>Mule Runtime Version: </text>'
myDiv.innerHTML += '<input id="myInput" type="number" placeholder="Specific Version" value="'+specificVersion + '">'
let aside = document.getElementsByTagName("aside")[0]
aside.insertBefore(myDiv, aside.firstChild)
let myInput = document.getElementById ("myInput")
myInput.addEventListener (
    "keyup", function(event){
        if (event.keyCode === 13){
            Change()
        }
    }
)
myDiv.style['margin-bottom'] = '15px'
myInput.setAttribute('class', 'flex shrink align-center button button-edit')
myInput.style.width = '169px'
myInput.style.height = '32px'

redirect(specificVersion)
changeListVersion(specificVersion)

// redirect to specific mule runtime doc version
function redirect(specificVersion){
    let oldUrl = window.location.href
    if(oldUrl.includes("https://docs.mulesoft.com/mule-runtime/")){
        const regex = new RegExp("\\d+.\\d")
        let newUrl = oldUrl.replace(regex, ""+specificVersion)
        if(!oldUrl.includes(specificVersion) && !oldUrl.includes("/latest")){
            location.href = newUrl;
        }
        if(document.body.className.includes("404")){
            location.href = "https://docs.mulesoft.com/mule-runtime/latest/"
        }
    }
}

// show specific mule runtime doc list version
function changeListVersion(specificVersion) {
    let navList = document.querySelectorAll('[data-product="mule-runtime"]')
    for (let i = 0; i< navList.length; i++){
        if(navList[i].tagName == "LI"){
            navList[i].setAttribute("data-pinned-version", specificVersion)
        } else if (navList[i].tagName == "OL") {
            if(navList[i].getAttribute("data-version") == specificVersion){
                navList[i].setAttribute("style", "")
            }else {
                navList[i].setAttribute("style", "display: none;")
            }
        } else if(navList[i].tagName == "BUTTON") {
            navList[i].children[0].innerText = specificVersion
        }
    }
}

function Change(){
    specificVersion = document.getElementById("myInput").value
    localStorage.setItem('storagedVersion', specificVersion);
    changeListVersion(specificVersion)
}
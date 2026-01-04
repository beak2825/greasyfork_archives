// ==UserScript==
// @name         Local Storage manager
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Local Storage is a type of memory in the site you are on. You may add a new Local Storage, and even edit other ones! Making this a game cheat for some! | Made just much cleaner
// @author       Viruster#2811 ported by NineVaults
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444712/Local%20Storage%20manager.user.js
// @updateURL https://update.greasyfork.org/scripts/444712/Local%20Storage%20manager.meta.js
// ==/UserScript==

var styles = document.createElement("style")
styles.innerText = `

#menu{
width:410px;
height:500px;
position:fixed;
top:0%;
bottom:0%;
left:0%;
right:0%;
z-index:999999;
background-color:black;
display:none;
}

#menuclose{
position:fixed;
top:1%;
bottom:0%;
left:26.5%;
right:0%;
width:50px;
height:50px;
background-color:black;
border-style:none;
color:#F0F8FF;
font-size:35px;
}

#menuopen{
position:fixed;
top:50%;
bottom:50%;
left:0%;
right:100%;
width:25px;
height:50px;
display:block;
background-color:black;
color:#22ff22;
z-index:999999;
}

#header{
font-size:33px;
color:white;
z-index:99999;
}

#lslist{
width:500px;
height:500px;
background-color:black;
text-align:center;
position:fixed;
top:0px;
left:410px;
right:0px;
bottom:0px;
border-width:0px 0px 0px 2px;
border-style:solid;
border-color:gray;
z-index:99999999;
overflow:auto;
}

#addNewStorageDiv{
display:inline-block;
width:410px;
height:410px;
border:1px #22ff22 solid;
}

#addNewInp{
color:#22ff22;
background-color:#111111;
width:410px;
outline:none;
}

#submitbtn{
color:#22ff22;
background-color:black;
border:none;
width:410px;
height:40px;
text-color:white;
text-align:center;
}

`;

var menu = document.createElement("div")
menu.id = 'menu'
top.document.body.appendChild(menu)
var menuclose = document.createElement("input")
menuclose.id = 'menuclose'
menuclose.type = 'button'
menuclose.value = 'X'

top.document.body.appendChild(styles)
menu.appendChild(menuclose)

menuclose.addEventListener("click", function() {
    menu.style.display = "none";
    menuopen.style.display = "block"
})

var menuopen = document.createElement("input")
menuopen.id = 'menuopen'
menuopen.type = 'button'
menuopen.value = '>'
top.document.body.appendChild(menuopen)

menuopen.addEventListener("click", function() {
    menu.style.display = "block";
    menuopen.style.display = "none"
})

var header = document.createElement("p")
header.id = 'header'
header.innerHTML = 'Local Storage Manager'
menu.appendChild(header)

var list = document.createElement("div")
list.id = 'lslist'
menu.appendChild(list)

header.addEventListener("click", function() {
    menu.style.display = "none";
    menuopen.style.display = "block"
})

function clearStorageLog() {
    list.innerHTML = '';
}

function makeNewStorageLog(name, value) {
    var divwrap = document.createElement("div")
    list.appendChild(divwrap)
    var newLog = document.createElement("p")
    newLog.style = `font-family:"JetBrains Mono"; color:white; min-height:1px; min-width:500px; margin:50px;`;
    newLog.innerHTML = `Name: ` + name + ` || Value: ` + value + ` `;
    divwrap.appendChild(newLog)
    divwrap.style = `border:2px #22ff22 solid; display:inline-block;`;
}
var i;

setInterval(() => {
    clearStorageLog()
    for (var a in localStorage) {
        makeNewStorageLog(a, localStorage[a]);
    }
}, 500)

var addNewStorageDiv = document.createElement("div")
addNewStorageDiv.id = 'addNewStorageDiv'
addNewStorageDiv.style = ''
menu.appendChild(addNewStorageDiv)

var addNewInp1 = document.createElement("input")
addNewInp1.id = 'addNewInp'
addNewInp1.type = 'text'
addNewInp1.placeholder = 'Name...'
addNewStorageDiv.appendChild(addNewInp1)

var addNewInp2 = document.createElement("input")
addNewInp2.id = 'addNewInp'
addNewInp2.type = 'text'
addNewInp2.placeholder = 'Value...'
addNewStorageDiv.appendChild(addNewInp2)

var submitbtn = document.createElement("button")
submitbtn.innerHTML = 'Submit'
submitbtn.id = 'submitbtn'
addNewStorageDiv.appendChild(submitbtn)

submitbtn.addEventListener("click", function() {
    localStorage.setItem(addNewInp1.value, addNewInp2.value)
    addNewInp1.value = ''
    addNewInp2.value = ''
})

function removeLastStorage() {
    addNewStorageDiv.lastChild.remove()
}
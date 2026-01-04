// ==UserScript==
// @name         IMBD Pirate
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  cool
// @author       You
// @run-at       document-start
// @match        https://www.imdb.com/title/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vidsrc.to
// @grant        none
// @license      CC BY
// @downloadURL https://update.greasyfork.org/scripts/491595/IMBD%20Pirate.user.js
// @updateURL https://update.greasyfork.org/scripts/491595/IMBD%20Pirate.meta.js
// ==/UserScript==
//this license states that you are granted to remix and build apon my code but must clearly site/credit me in any and all works build apon this

(function() {
    'use strict';
function findParent(){
return document.querySelector("#__next > main > div > section > section > div:nth-child(5) > section > section >:nth-child(2)>*")
}
var minimized = false;
var popUpExists = false;
var popup
var id =document.location.href.split("/title/")[1].split("/")[0]
function createPopup(url){
popUpExists = true
var newPopup = document.createElement("div")
newPopup.style = `
opacity:0;
width:100%;
height:100%;
position:fixed;
left:0px;
top:0px;
background-color:rgba(0,0,0,0.5);
backdrop-filter: blur(10px);
z-index:9999;
animation:fadeIn 0.5s ease-in-out forwards;
`
var div = document.createElement("div")
div.style = "width:80%;height:70%;margin:auto;position:relative;display: block;"
var iframe = document.createElement("iframe")
var btn = document.createElement("input")
btn.type = "button"
btn.id = "closerButton-382716"
btn.style = "width:50px;height:20px;cursor:pointer; color:white; background-color:rgba(0,0,0);border-radius:0px 0px 0px 5px; transform:translate(0,-4px);border:rgb(50,50,50) solid 1px;display: inline-block;"
btn.value = "close"
var urlTxt = document.createElement("a")
urlTxt.href = url
urlTxt.innerText = "sorce url"
urlTxt.style = "position:relative;height: 20px; background-color: rgb(0, 0, 0); border-radius: 0px 0px 5px; transform: translate(0px, -5px ); color: white; font-size: 15px;padding:1.5px;border:rgb(50,50,50) solid 1px;display: inline-block;"
var serverlbl = document.createElement("label")
serverlbl.innerText = "servers:"
serverlbl.style = "height: 20px; background-color: rgb(0, 0, 0); border-radius: 0px 0px 0px 5px; transform: translate(0px, -5px ); color: white; font-size: 15px;padding:1.5px;border:rgb(50,50,50) solid 1px;margin-left:5px;display: inline-block;"
class serverBTN{
    constructor(url,name){
        this.url = url
        this.name = name
    }
}
var servers = ["to","me","pm","xyz","net",new serverBTN((id)=>"https://www.2embed.cc/embed/"+id,"cc")]
var def = 5; // default server
document.body.appendChild(newPopup)
var closePopupFunc = ()=>{
newPopup.remove()
popUpExists = false
    document.querySelector("#pirateBtn").value = " Watch ▶ "
}
var minimizePopupFunc = ()=>{
newPopup.style.display = "none"
minimized = true
document.querySelector("#pirateBtn").value = " Media Loaded ▶ "
}
newPopup.appendChild(div)
div.appendChild(iframe)
div.appendChild(btn)
div.appendChild(urlTxt)
div.appendChild(serverlbl)
for(var i in servers){
var server = servers[i]
var x = document.createElement("input")
x.type = "button"
x.style = "width:50px;height:20px;cursor:pointer; color:white; background-color:rgba(0,0,0); transform:translate(0,-4px);border:rgb(50,50,50) solid 1px;display: inline-block;"
x.value = server
if(typeof server == "object"){
x.value = server.name
x.setAttribute("data-url",server.url(id));
}
if(i == servers.length-1){
x.style["border-radius"] = "0px 0px 5px 0px"
}
x.addEventListener("click",(event)=>{
var extension = event.target.value
var newUrl = url.replace(".to","."+extension)
if("url" in event.target.dataset){
newUrl = event.target.dataset.url
}
document.querySelector("#imdbPirateIframe").src = newUrl
urlTxt.href = newUrl
event.stopPropagation();
})
div.appendChild(x)
}

iframe.outerHTML = `<iframe id = "imdbPirateIframe"src = ${typeof servers[def] == "string"?url.replace(".to","."+servers[def]):servers[def].url(id)} style = \"width:100%;height:100%;\" allowfullscreen></iframe>`
btn.addEventListener("click",(event)=>{closePopupFunc();event.stopPropagation();})
newPopup.addEventListener("click",()=>{minimizePopupFunc()})
return newPopup;
}
window.createBTN = function(){
var parent =findParent()
var btn = document.createElement("input")
btn.type = "button"
btn.style.position = "absolute"
btn.value = " Watch ▶ "
btn.style["border-radius"] = "1rem"
var bordertxt = "0px 1px 2.5px 0.5px rgba(0,0,0,0.5)"
btn.style["box-shadow"] = bordertxt
btn.style.border = "none"
btn.style["margin-left"] = "5px"
btn.style["font-size"] = "13px"
btn.style["margin-left"] = "5px 5px 5px"
btn.style["background-color"] = "rgba(0,0,0,0)"
btn.style.color = "rgba(255,255,255)"
btn.id = "pirateBtn"
btn.style.cursor = "pointer"
parent.appendChild(btn)
var typeID = parent.querySelector("ul > :nth-child(1)");
var type = typeID.innerText.substring(0,2).toLowerCase()=="tv"?"tv":"movie"
var url = `https://vidsrc.to/embed/${type}/${id}`
btn.addEventListener("mousedown",()=>{
btn.style["box-shadow"] = bordertxt+" inset"
})
btn.addEventListener("mouseup",()=>{
btn.style["box-shadow"] = bordertxt
})
btn.addEventListener("click",()=>{
if(popUpExists == false){
popup = createPopup(url)
popUpExists = true
//window.open(url,"")
}else if(minimized==true){
    popup.style.display = ""
}
})
return btn
}
const observer = new MutationObserver(function(mutations_list) {
	mutations_list.forEach(function(mutation) {
		mutation.removedNodes.forEach(function(removed_node) {
			if(document.querySelector("#pirateBtn") == null) {
                window.createBTN()
				//observer.disconnect();
			}
		});
	});
});
var interval
interval = setInterval(()=>{
let parent = findParent();
if(parent!=null&&parent.querySelector("ul> :nth-child(1)")!=null){
    document.head.appendChild(document.createElement("style")).textContent = `@keyframes fadeIn {0% { opacity: 0; } 100% { opacity: 1; }}`
    clearInterval(interval)
    window.createBTN()
    var p = parent;
    observer.observe(document.body, { subtree: false, childList: true })
}
},100)
})();
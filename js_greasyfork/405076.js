// ==UserScript==
// @name         Request Manager Tools
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Marian Danilencu
// @include        *https://partners.wayfair.com/v/product_catalog/manage_product_description*
// @include        *https://partners.wayfair.com/v/catalog/staging/staging_request_summary/index*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405076/Request%20Manager%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/405076/Request%20Manager%20Tools.meta.js
// ==/UserScript==
document.addEventListener('keyup', event => {
  if (event.code === 'KeyS') {
    document.getElementsByClassName("ex-Button ex-Button--primary")[1].dispatchEvent(new MouseEvent("click",{bubbles: true, cancellable: true}));
document.getElementById("check2").innerText="Saving...";
function waitForSuccess(){
if(document.getElementsByClassName("sc-AykKK ZINIM")[0]!=null) {
document.getElementById("check2").innerText="Changes Saved";
document.getElementById("check2").style.borderColor = "#13d494";
document.getElementById("check1").style.backgroundColor = "#13d494";
document.getElementById("check2").style.backgroundColor = "#13d49461";

            return;}
else{setTimeout(function(){waitForSuccess()}, 1000);}
}
waitForSuccess()



}

})
document.addEventListener('keyup', event => {
  if (event.code === 'KeyA') {
    document.getElementById("check2").innerText="All requests approved. Please check for errors before saving"
    var buttons = document.getElementsByClassName("fa fa-check-circle-o qa_icon_size margin_right_small");

for(var i=0; i< buttons.length; i++){
    buttons[i].dispatchEvent(new MouseEvent("click",{bubbles: true, cancellable: true}));
}
}

})

function start(){
var header=document.getElementsByClassName("ex-Grid ex-Grid--withGutter ex-Grid--row")[2]
var pan=document.createElement("div")
pan.style.cssText="position:absolute;top:68px;left:1303px;height:31px;height:31px;width:60px;border-style:solid"
header.appendChild(pan);
pan.innerText=document.getElementsByClassName("fa fa-check-circle-o qa_icon_size margin_right_small").length
document.title=pan.innerText+" Request"
var check1=document.createElement("div")
check1.id="check1"
check1.style.cssText="line-height: 33px; letter-spacing: 1px; font-size: 23px; white-space: pre-wrap; position: absolute; top: 1px; left: 313px; width: 33px; height: 45px; background: rgb(226, 120, 13); border-radius: 3px 0px 0px 3px; color: white;"
check1.innerText=" ⚠"
var check2=document.createElement("div");
check2.id="check2"
check2.style.cssText="white-space: pre-wrap; display: block; position: absolute; top: 0px; left: 30px; height: 45px; width: 450px; border-style: solid; border-color: rgb(226, 120, 13); border-radius: 0px 3px 3px 0px; border-width: 2px; background: rgb(252, 241, 230); font-size: 13px; color: rgb(226, 120, 13); line-height: 13px;"
check2.innerText="Press S key to save changes. Press A key to approve all requests"
header.appendChild(check1)
check1.appendChild(check2)
}


function waitForElementToDisplay() {
        if(document.getElementsByClassName("fa fa-check-circle-o qa_icon_size margin_right_small")[0]!=null) {
            start()
            return;}
else {setTimeout(function(){waitForElementToDisplay()}, 1000);
}

}waitForElementToDisplay()







function createBtn(){
var grid=document.getElementsByClassName("sc-AykKC foshkE")[0]
var openbt=document.createElement("button");
openbt.id="openbt"
openbt.style.cssText="white-space: pre-wrap; display: block; position: absolute; top: 225px; left: 995px; height: 45px; width: 250px; border-style: solid; border-color: rgb(226, 120, 13); border-radius: 0px 3px 3px 0px; border-width: 2px; background: rgb(252, 241, 230); font-size: 13px; color: rgb(226, 120, 13); line-height: 13px;"
openbt.innerText="Grab 20"
grid.appendChild(openbt)

var openbt2=document.createElement("button");
openbt2.id="openbt2"
openbt2.style.cssText="white-space: pre-wrap; display: block; position: absolute; top: 225px; left: 840px; height: 45px; width: 150px; border-style: solid; border-color: rgb(226, 120, 13); border-radius: 0px 3px 3px 0px; border-width: 2px; background: rgb(252, 241, 230); font-size: 13px; color: rgb(226, 120, 13); line-height: 13px;"
openbt2.innerText="Grab 10"
grid.appendChild(openbt2)

openbt.onclick=function(){
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[1].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[2].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[3].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[4].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[5].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[6].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[7].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[8].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[9].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[10].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[11].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[12].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[13].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[14].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[15].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[16].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[17].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[18].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[19].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[20].href,"_blank")
}
openbt2.onclick=function(){
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[1].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[2].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[3].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[4].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[5].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[6].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[7].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[8].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[9].href,"_blank")
window.open(document.getElementsByClassName("sc-AykKC sc-AykKD hCGMrN")[10].href,"_blank")}
}

function waitForGrid() {
        if(document.getElementsByClassName("sc-AykKC foshkE")[0]!=null) {
            createBtn()
            return;}
else {setTimeout(function(){waitForGrid()}, 1000);
}

}waitForGrid()

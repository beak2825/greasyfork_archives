// ==UserScript==
// @name         Skribbl Image Saver
// @namespace    https://github.com/tntmod54321
// @version      1.1
// @description  Automatically save images and chatlogs from skribbl.io
// @author       tntmod54321
// @homepageURL  https://github.com/tntmod54321/skribbl-image-saver-userscript
// @match        https://skribbl.io*
// @grant        none
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/451362/Skribbl%20Image%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/451362/Skribbl%20Image%20Saver.meta.js
// ==/UserScript==

//initialize global variables
var imageArray=[]
var imageElementAlreadyCreated=false
var buttonToggle=false
var base64data
var stylesheets
var debugMode=false
const overlayPromptRE = new RegExp('The word was: ([a-zA-Z0-9\\- ]+)'); //don't match for characters that would make invalid filenames
const removeInvalidCharsRE = new RegExp('[^0-9a-zA-Z_\\- ]', 'g'); //sanitize characters for filenames.
// vars for caching names and prompts for downloads
var lastKnownName=null
var lastKnownPrompt=null
var roundEnded=null // if we are in a 'round end' state
const overlayPresentRE = new RegExp('display: none;$')
// prefs
var autoDLImgs=true
var autoDLImgdone=false
var autoDLChatLogs=true
var autoDLChatLogdone=false

var autoDLImgs_is_checked=false
var autoDLChatLogs_is_checked=false

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays==null) ?
        "" :
        ";expires="+exdate.toUTCString());
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function getRoundState(){
    var state=false //round is not ended by default
    var overlay=document.getElementById("overlay")
    if (overlay.style.cssText.match(overlayPresentRE)) {state=false}
    else {state=true}
    return state
}

function getCurrentDrawer(queryisknown=false){
    var drawer = "unknown"
    var isknown = false

    //under class=player/class=avatar/
    //drawer: <div class="drawing"></div>
    //non-drawer: <div class="drawing" style="display: none;"></div>
    var playerContainer=document.getElementById("containerGamePlayers")
    var players = playerContainer.getElementsByClassName("player")

    for (let i = 0; i < players.length; i++) {
        var drawerElement = players[i].getElementsByClassName("drawing")[0] //only one per player (therefor 0 is the only index)
        if (!drawerElement.style.cssText) {drawer=players[i].getElementsByClassName("name")[0].innerText;isknown=true;break}
    }

    //parantheses only allowed when you're the drawer, so remove ' (You)'
    drawer=drawer.replace(new RegExp(' \\(You\\)$'), '')
    //try to sanitize username
    drawer=drawer.replace(removeInvalidCharsRE, '');
    if (queryisknown) {return [drawer, isknown]}
    return drawer
}

function getPrompt(queryisknown=false){
    var prompt = "unknown"
    var isknown = false

    var contentClass=document.getElementsByClassName('content')
    for (let i = 0; i < contentClass.length; i++) {
        var text = contentClass[i].getElementsByClassName("text")[0]
        var result = text.outerText.match(overlayPromptRE)
        if (result) {prompt=result[1];isknown=true;break}
    }

    //if we don't get a result use this fallback
    if (!result) {
        var fallbackElement=document.getElementById('currentWord')
        if (fallbackElement) { //don't crash if the element doesn't exist
            if (fallbackElement.outerText!="") {prompt = fallbackElement.outerText;isknown=true}
        }
    }
    if (queryisknown) {return [prompt, isknown]}
    return prompt
}

//create an element to be able to display the image
function displayImage(){
    if (imageElementAlreadyCreated){return}
    var body = document.getElementsByTagName("body")
    var a = document.createElement("center")
    var b = document.createElement("img")
    a.id="XD1"
    b.id="XD2"
    body[0].appendChild(a)
    var center = document.getElementById("XD1")
    center.appendChild(b)
    imageElementAlreadyCreated=true
}

//converts the canvas to a data blob
async function canvasToBlob() {
    var canvas = document.getElementById('canvasGame')
    const blob = await new Promise((resolve) => canvas.toBlob(resolve))
    const blobURL = URL.createObjectURL(blob)
    URL.revokeObjectURL(blobURL)
    return blob
}

//embed the data blob of the canvas into the page
async function mirrorImage(){
    console.clear()
    var Image = await canvasToBlob();
    displayImage()
    var HTMLImage = document.getElementById("XD2")
    var reader = new FileReader()
    reader.readAsDataURL(Image)
    reader.onloadend = function() {
        var base64data = reader.result
        HTMLImage.src=base64data
        if(buttonToggle){mirrorImage()}
        else{HTMLImage.src=""}
    }
}

//return the index of the cssrule for the second stylesheet that matches the passed (selector) argument
function getStyleSheet(selector){
    var stylesheets=document.styleSheets[1].cssRules
    for (var i in stylesheets){
        if (stylesheets[i].selectorText==selector){
            return i
        }
        i++
    }
    console.log("stylesheet not found :(")
}

//insert download button
function insertDownloadButton(){
    var leftSidebar = document.getElementById("containerPlayerlist")
    var downloadButton = document.createElement("button")
    downloadButton.classList.add('btn')
    downloadButton.classList.add('btn-block')
    downloadButton.id="downloadImage"
    downloadButton.style="margin-top:8px;color: rgb(255, 255, 255);background-color: rgb(117, 142, 250);border-color: rgb(93, 113, 199);"
    var downloadText = document.createTextNode("Download image");

	downloadButton.onclick=function() {downloadBlobImage()}

	downloadButton.appendChild(downloadText)
    leftSidebar.appendChild(downloadButton)
}

//toggle mirror function
function mirBtnFunc(){
	mirrorImage()
	buttonToggle=(!buttonToggle)
}

//Download Image
//https://stackoverflow.com/questions/52817280/problem-downloading-a-pdf-blob-in-javascript
//!!do something with this ^ (you don't need to convert to data url)
async function downloadBlobImage(){
	var Image = await canvasToBlob();
    var reader = new FileReader()
    reader.readAsDataURL(Image)
    reader.onloadend = function() {
        var base64data = reader.result
        var a = document.createElement('a')
        a.setAttribute('href', base64data)
        var DL_Name="skribbl-"+(Date.now()/1000|0)+'-'+lastKnownName+"-"+lastKnownPrompt+".png" //round date.now to secs instead of millis
        a.setAttribute('download', DL_Name)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

}

//open the blob as an image in a new tab
//!!TRY TO ACTUALLY FIX THIS
//create basically <html><a></html> and in that way you can set the filename and probably have it work
async function openImageInNewTab(){
    var Image = await canvasToBlob()
    var fileURL = URL.createObjectURL(Image)
    var a = document.createElement('a')
    a.href = fileURL
    a.target = '_blank'
    //a.download = 'test.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(fileURL)
}

//insert mirror button
function insertMirrorButton(){
	var leftSidebar = document.getElementById("containerPlayerlist")
	var mirrorButton = document.createElement("button")
	mirrorButton.classList.add('btn')
    mirrorButton.classList.add('btn-block')
    mirrorButton.id="mirrorImage"
	mirrorButton.style="margin-top:8px;color: rgb(255, 255, 255);background-color: rgb(92, 218, 218);border-color: rgb(50, 214, 200);"
	mirrorButton.onclick=function() {mirBtnFunc()}
	var mirrorText = document.createTextNode("Mirror image")
	mirrorButton.appendChild(mirrorText)
    leftSidebar.appendChild(mirrorButton)
}

//insert the new tab button
function insertNewTabButton(){
    var leftSidebar = document.getElementById("containerPlayerlist")
    var newTabButton = document.createElement("button")
    newTabButton.classList.add('btn')
    newTabButton.classList.add('btn-block')
    newTabButton.id="openNewTab"
    newTabButton.style="margin-top:8px;color: rgb(255, 255, 255);background-color: rgb(102, 218, 92);border-color: rgb(72, 214, 50);"

	newTabButton.onclick=function() {openImageInNewTab()}
    var newTabText = document.createTextNode("Open Image in New Tab");
	newTabButton.appendChild(newTabText)
    leftSidebar.appendChild(newTabButton)
}

//main function
function main(){
	//fix button spacing in css
	var stylesheetIndex=getStyleSheet("#containerPlayerlist")
	var stylesheets=document.styleSheets[1].cssRules[stylesheetIndex].style
    stylesheets.removeProperty("justify-content")
    // should read cookies here

	//insert buttons, in order they appear on the screen
	insertDownloadButton()
    if (debugMode) {insertNewTabButton()}
    insertDownloadChatlogButton()
    if (debugMode) {insertMirrorButton()}
    insertAutoDLImgsCheckbox()
    insertAutoDLChatLogsCheckbox()
    console.log("Skribbl Image Saver Loaded!")

    autoFuncs()
}

//open text in new tab
function openTextInNewTab(array){
    var chatLog=""
    for (var object in array){
        chatLog=chatLog.concat(array[object]+"\n")
    }
    if(chatLog==""){return}
    chatLog="<div id=\"boxMessages\" style=\"font-family: Helvetica Neue, Helvetica, Arial, sans-serif;\">\n".concat(chatLog)
    chatLog=chatLog.concat("</div>")
    var chatLogBlob = new Blob([chatLog],{ type: "text/html;charset=utf-8" });
    var fileURL = URL.createObjectURL(chatLogBlob)
    var a = document.createElement('a')
    a.href = fileURL
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(fileURL)
}

//download text as an html file
function downloadText(array){
    var chatLog=""
    for (var object in array){
        chatLog=chatLog.concat(array[object]+"\n")
    }
    if(chatLog==""){return}
    chatLog="<html><body><div id=\"boxMessages\" style=\"font-family: Helvetica Neue, Helvetica, Arial, sans-serif;\">\n".concat(chatLog)
    chatLog=chatLog.concat("</div></body></html>")
    var chatLogBlob = new Blob([chatLog],{ type: "text/html;charset=utf-8" });
    var fileURL = URL.createObjectURL(chatLogBlob)
    var a = document.createElement('a')
    a.setAttribute('href', fileURL)
    var DL_Name="skribblchatlog-"+(Date.now()/1000|0)+'-'+lastKnownPrompt+".html" //round date.now to secs instead of millis
    a.setAttribute('download', DL_Name)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(fileURL)
}

//function to save the chat as an html file
function saveChat(){
    var chatElement = document.getElementById("boxMessages")
    var chatChildren = chatElement.children
    var array2=[]
    for (var message in chatChildren){
        if (typeof chatChildren[message]=="object"){array2.push(chatChildren[message].outerHTML)}
    }
    downloadText(array2)
}

async function autoFuncs(){
    while (true) {
        await sleep(100);
        //check for drawer's name and prompt name
        var prompt=await getPrompt(true)
        if (prompt[1] && !roundEnded) {lastKnownPrompt=prompt[0];} // if roundend don't update lastknownprompt
        var lastFrameRoundEndState = roundEnded
        roundEnded=getRoundState()
        if (!roundEnded && lastFrameRoundEndState) {autoDLImgdone=false;autoDLChatLogdone=false;} // if a new round just started
        var drawer=await getCurrentDrawer(true)
        if (drawer[1]) {lastKnownName=drawer[0]} // if the name is known to be valid AND isn't at the end of the round

        if (autoDLImgs && roundEnded && !autoDLImgdone){await downloadBlobImage();autoDLImgdone=true;}

        if (autoDLChatLogs && roundEnded && !autoDLChatLogdone){await saveChat();autoDLChatLogdone=true;}

        //make sure to have button checkboxe(s) for this
        //https://stackoverflow.com/questions/13452626/create-a-cookie-with-javascript-in-greasemonkey
        //use cookie to save prefs?
    }
}

function insertDownloadChatlogButton(){
    var leftSidebar = document.getElementById("containerPlayerlist")
    var chatlogButton = document.createElement("button")
    chatlogButton.classList.add('btn')
    chatlogButton.classList.add('btn-block')
    chatlogButton.id="downloadChatLog"
    chatlogButton.style="margin-top:8px;color: rgb(255, 255, 255);background-color: rgb(117, 142, 250);border-color: rgb(93, 113, 199);"

	chatlogButton.onclick=function() {saveChat()}
    var newTabText = document.createTextNode("Download Chatlog");
	chatlogButton.appendChild(newTabText)
    leftSidebar.appendChild(chatlogButton)
}

function updateAudoDLImgsPref(){ //set button to green or red?
    if (autoDLImgs_is_checked) {
        // color button red
        document.getElementById("autoDlImgsToggle").style="margin-top:8px;color: rgb(255, 255, 255);background-color: rgb(214, 45, 45);border-color: rgb(214, 45, 45);"
        autoDLImgs_is_checked=false
        autoDLImgs=false
    }
    else {
        // color button green
        document.getElementById("autoDlImgsToggle").style="margin-top:8px;color: rgb(255, 255, 255);background-color: rgb(102, 218, 92);border-color: rgb(102, 218, 92);"
        // make it not autodownload in the middle of a round if you toggle the button (idk if this is real)
        autoDLImgs_is_checked=true
        autoDLImgs=true
    }
    console.log("Skribble Image Saver: save_images", autoDLImgs_is_checked)
    setCookie("SIS_autodlimgs", autoDLImgs_is_checked, 365);
    // update cookie(s) (cookie=autoDLImgs_is_checked)
}

function insertAutoDLImgsCheckbox(){
    var leftSidebar = document.getElementById("containerPlayerlist")
    var autodlimgsButton = document.createElement("checkbox")
    autodlimgsButton.classList.add('btn')
    autodlimgsButton.classList.add('btn-block')
    autodlimgsButton.id="autoDlImgsToggle"
    //read cookie and set style accordingly
    var adlimgs_cookie = getCookie("SIS_autodlimgs")
    if (adlimgs_cookie=="") { // if no cookie set to false
        console.log("no adlimgs cookie set")
        autoDLImgs_is_checked=false
        autoDLImgs=false
        adlimgs_cookie=false
        setCookie("SIS_autodlimgs", false, 365);
    }
    if (adlimgs_cookie=="false"||adlimgs_cookie==false){
        // color button red
        autodlimgsButton.style="margin-top:8px;color: rgb(255, 255, 255);background-color: rgb(214, 45, 45);border-color: rgb(214, 45, 45);"
        autoDLImgs_is_checked=false
        autoDLImgs=false
    }
    else {
        // color button green
        autodlimgsButton.style="margin-top:8px;color: rgb(255, 255, 255);background-color: rgb(102, 218, 92);border-color: rgb(102, 218, 92);"
        // make it not autodownload in the middle of a round if you toggle the button (idk if this is real)
        autoDLImgs_is_checked=true
        autoDLImgs=true
    }
	autodlimgsButton.onclick=function() {updateAudoDLImgsPref()}
    var newTabText = document.createTextNode("AutoDL Images");
	autodlimgsButton.appendChild(newTabText)
    leftSidebar.appendChild(autodlimgsButton)
}

function updateAudoDLChatLogsPref(){ //set button to green or red?
    if (autoDLChatLogs_is_checked) {
        // color button red
        document.getElementById("autoDlChatLogsToggle").style="margin-top:8px;color: rgb(255, 255, 255);background-color: rgb(214, 45, 45);border-color: rgb(214, 45, 45);"
        autoDLChatLogs_is_checked=false
        autoDLChatLogs=false
    }
    else {
        // color button green
        document.getElementById("autoDlChatLogsToggle").style="margin-top:8px;color: rgb(255, 255, 255);background-color: rgb(102, 218, 92);border-color: rgb(102, 218, 92);"
        // make it not autodownload in the middle of a round if you toggle the button (idk if this is real)
        autoDLChatLogs_is_checked=true
        autoDLChatLogs=true
    }
    console.log("Skribble Image Saver: save_chatlogs", autoDLChatLogs_is_checked)
    setCookie("SIS_autodlchatlogs", autoDLChatLogs_is_checked, 365);
}

function insertAutoDLChatLogsCheckbox(){
    var leftSidebar = document.getElementById("containerPlayerlist")
    var autodllogsButton = document.createElement("checkbox")
    autodllogsButton.classList.add('btn')
    autodllogsButton.classList.add('btn-block')
    autodllogsButton.id="autoDlChatLogsToggle"
    //read cookie and set style accordingly
    var adllogs_cookie = getCookie("SIS_autodlchatlogs")
    if (adllogs_cookie=="") { // if no cookie set to false
        console.log("no adlcl cookie set")
        autoDLChatLogs_is_checked=false
        autoDLChatLogs=false
        adllogs_cookie=false
        setCookie("SIS_autodlchatlogs", false, 365);
    }
    if (adllogs_cookie=="false"||adllogs_cookie==false){
        // color button red
        autodllogsButton.style="margin-top:8px;color: rgb(255, 255, 255);background-color: rgb(214, 45, 45);border-color: rgb(214, 45, 45);"
        autoDLChatLogs_is_checked=false
        autoDLChatLogs=false
    }
    else {
        // color button green
        autodllogsButton.style="margin-top:8px;color: rgb(255, 255, 255);background-color: rgb(102, 218, 92);border-color: rgb(102, 218, 92);"
        // make it not autodownload in the middle of a round if you toggle the button (idk if this is real)
        autoDLChatLogs_is_checked=true
        autoDLChatLogs=true
    }
	autodllogsButton.onclick=function() {updateAudoDLChatLogsPref()}
    var newTabText = document.createTextNode("AutoDL Chatlogs");
	autodllogsButton.appendChild(newTabText)
    leftSidebar.appendChild(autodllogsButton)
}

//test any function with e
/*
document.onkeyup=function(e){
    if(e.which == 69) {
        //console.log()
        console.log(getCookie("dfjskfjksd"))
    }
};
*/
main()
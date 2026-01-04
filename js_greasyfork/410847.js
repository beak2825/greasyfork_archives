// ==UserScript==
// @name         Custom Cursors
// @version      0.1
// @description  Add custom cursors to moomoo.io.
// @author       Morpheus_
// @grant        none
// @match        *://*.moomoo.io/*
// @run-at document-end
// @namespace https://greasyfork.org/users/675122
// @downloadURL https://update.greasyfork.org/scripts/410847/Custom%20Cursors.user.js
// @updateURL https://update.greasyfork.org/scripts/410847/Custom%20Cursors.meta.js
// ==/UserScript==

/*Remove Ads & iframes*/
document.querySelectorAll("#adCard, #pre-content-container").forEach(function(a){
a.remove();
});
document.getElementsByClassName("menuCard")[4].remove();
var clearIframes = setInterval(function(){
    for (var i = 0; i < document.getElementsByTagName("iframe").length; i++){
    document.getElementsByTagName("iframe")[i].remove();
    }
if(document.getElementsByTagName("iframe").length === 0){
clearInterval(clearIframes);
}
}, 50);
/*********************/

let styles = document.createTextNode(`
#cursor-menu {
   position: absolute;
   top: 50%;
   background-color: rgb(0, 0, 0, 0.25);
   width: 250px;
   height: 200px;
   color: #fff;
   overflow-y: scroll;
   padding: 10px;
   display: none;
   pointer-events: all;
   border-radius: 4px;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%)
}
#cursorButton {
   right: 452px;
   position:absolute;
   top: 20px;
   display: block;
   background-color: rgb(0, 0, 0, 0.25);
   width: 40px;
   height: 40px;
   border-radius: 4px;
}
#cursorButton:hover{
   background-color: rgb(0, 0, 0, 0.17);
}
.fileInp {
   display: inline-block;
   padding: 16px 48px;
   border: 2px solid #fff;
   border-radius: 0px;
   letter-spacing: 2px;
   text-transform: uppercase;
   font-weight: bold;
   color: #fff;
   font-size: 13px;
}
.fileInp:hover{
   background-color: rgb(0,0,0,0.1);
   transform: scale(1.04);
   cursor: pointer;
}
#select.active {
   color: black;
   background-color: white;
   border: 2px solid black;
}
.fileInp span {
   font-weight: normal;
}
#select.active:hover{
   background-color: #F2F4F3
}
.textInp {
   height: 24px;
   border: 2px solid #fff;
   width: 180px;
   background-color: rgb(0,0,0,0);
   color: #fff;
}
.btn {
   display: inline-block;
   height: 23px;
   background-color: rgb(0,0,0,0);
   border: 2px solid #fff;
   text-align: center;
   letter-spacing: 2px;
   fonst-size: 13px;
   text-transform: uppercase;
   font-weight: bold;
   color: #fff;
}
.btn:hover{
   cursor: pointer;
   transform: scale(1.04);
   background-color: rgb(0,0,0,0.1);
}
.btn:active{
   color: black;
   background-color: white;
   border: 2px solid black;
}
#imgStuff{
   display: none;
   position: absolute;
   top: 50%;
   left: 50%;
   height: 20px;
   width: 20px;
   z-index: 5;
   transfrom: translate(-20%, -20%)
   padding: 20px;
   pointer-events: none;
}
#gameCanvas.hi:hover {
   cursor: none;
}
#imgSrc {
   pointer-event: none;
}
#rss {
   display: block;
   font-size: 24px;
   color: #292929;
   top: 50%;
   padding: 20px;
}
.menuCard {
   background-color: #3B3B3B;
}
#promoImgHolder {
   text-align: center;
   height: 98px;
}
#rss:hover {
   transform: scale(1.07);
   color: #212121;
   cursor: pointer;
}
#disc2 {
   display: inline-block;
   font-size: 24px;
   color: #292929;
}
#disc2:hover {
   transform: scale(1.07);
   color: #212121;
   cursor: pointer;
}
`);
    let css = document.createElement('style');
    css.type = 'text/css';
    css.appendChild(styles);
    document.body.appendChild(css);
    let newMenu = `<div id="cursor-menu"><p><input type="text" id="linky" class="textInp"placeholder="Put an image link here..."><br/><br/><br/><strong>Or</strong><br/><br/><br/><input type="file" name="" id="file-im-bored" hidden><label for="file-im-bored" class="fileInp" id="select"><span id="magic-span">select file</span></label><br/><br/><button id="remover-inator" class="btn">Remove file</button><br/><br/><button id="changer" class="btn">Change cursor!</button><br/><br/><button id="reset-er" class="btn">reset cursor</button><br/><br/><strong id="final-countdown"></strong><div id='disc2'><span>Join our Discord!</span>&nbsp<img src="https://cdn.discordapp.com/attachments/709111800976769145/751625127715930182/2111370.png" height="30px" width="30px" style="transform: translate(7px,7px);"></div></p></div>`;
    let cursorButton = `<div id="cursorButton" class="gameButton"><img class="material-icons" src="https://cdn.discordapp.com/attachments/709111800976769145/751097497652428860/159914592826141146.png" width="25px" height="25px" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>`;
    let cursorImg = `<div id="imgStuff"><img id="imgSrc" src="" height="35px" width="38px"></div>`
    let newDiv = `<div id="rss"><span>Join our Discord!</span>&nbsp<img src="https://cdn.discordapp.com/attachments/709111800976769145/751625127715930182/2111370.png" height="30px" width="30px" style="transform: translate(7px,7px);"></div>`
    document.getElementById("promoImgHolder").innerHTML = newDiv;
    document.getElementById("storeMenu").insertAdjacentHTML("beforebegin", newMenu);
    document.getElementById("chatButton").insertAdjacentHTML("beforebegin", cursorButton);
    document.body.insertAdjacentHTML("beforebegin", cursorImg);

document.getElementById('rss').addEventListener('click', function(){
   window.open('https://discord.com/invite/Uc78AVf', '_blank');
});
document.getElementById('disc2').addEventListener('click', function(){
   window.open('https://discord.com/invite/Uc78AVf', '_blank');
});
document.getElementById("cursorButton").addEventListener('click', function(){
  if(document.getElementById('cursor-menu').style.display == 'none'){
       document.getElementById('cursor-menu').style.display = 'block';
   } else {
       document.getElementById('cursor-menu').style.display = 'none';
   }
});
var src;
const le = document.getElementById('final-countdown')
var load = function(e){
    let whereTheMagicHappens = document.getElementById("magic-span")

    console.log(e);

    let file = e.target.files;

    whereTheMagicHappens.innerText = `selected file : ${file[0].name}`

    let output = document.getElementById('select')
    output.classList.add("active");

    if(file[0].type.match("image")) {
       let reader = new FileReader();

        reader.addEventListener("load", function(e){
           let data = e.target.result;
           src = data;

        });
        reader.readAsDataURL(file[0]);
    } else {
       le.innerText = "The file you selected is not an image.";
       le.style.color = "#fa004b";
       let eh = document.getElementById("select");
    let whereTheMagicHappens = document.getElementById("magic-span")
    fileInput.value = "";
    eh.classList.remove("active")
    whereTheMagicHappens.innerText = "select file"
    }
}
let fileInput = document.getElementById("file-im-bored");
let buttonBecauseWhyNot = document.getElementById("remover-inator");
let textInpute = document.getElementById('linky');
let leChanger = document.getElementById("changer");
var imgItself = document.getElementById("imgStuff");
var noThisIsTheImage = document.getElementById("imgSrc");
function mouseX(event){
    return event.clientX;
}
function mouseY(event){
    return event.clientY;
}
function position(event){
    let mouse = {
        x: mouseX(event),
        y: mouseY(event),
    }
    imgItself.style.top = mouse.y + 'px';
    imgItself.style.left = mouse.x + 'px'
}
document.getElementById('gameCanvas').onmousemove = function init(event){
    let _event = event;
    setTimeout(() => {
       position(_event)
    },13)
}
function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

fileInput.addEventListener("change", load);
buttonBecauseWhyNot.addEventListener("click", function(){
    let eh = document.getElementById("select");
    let whereTheMagicHappens = document.getElementById("magic-span")
    fileInput.value = "";
    eh.classList.remove("active")
    whereTheMagicHappens.innerText = "select file"
})
leChanger.addEventListener('click', function(){
    if(imgItself.style.display = 'none'){
        imgItself.style.display = "inline-block"
        document.getElementById("gameCanvas").classList.add("hi")
    };
   if(fileInput.value != "" && textInpute.value != ""){
       le.innerText = "You can't have a link and a file."
       le.style.color = "#fa004b"
   } else if(fileInput.value === "" && textInpute.value === ""){
       le.innerText = "You didn't put a link or a file."
       le.style.color = "#fa004b"
   } else if(!checkURL(textInpute.value) && fileInput.value === "" && textInpute.value != ""){
       le.innerText = "The link you put does not refer to an image."
       le.style.color = "#fa004b"
   } else if(fileInput.value != "" && textInpute.value === ""){
      noThisIsTheImage.src = src;
      le.innerText = "Done!"
      le.style.color = "#09e322"
   } else if(textInpute.value != "" && fileInput.value === ""){
      noThisIsTheImage.src = textInpute.value;
      le.innerText = "Successfully changed!"
      le.style.color = "#09e322"
   }
})
document.getElementById('reset-er').addEventListener('click', function(){
    imgItself.style.display = "none"
    document.getElementById("gameCanvas").classList.remove("hi")
})


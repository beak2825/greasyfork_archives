// ==UserScript==
// @name         testing
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  test
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392839/testing.user.js
// @updateURL https://update.greasyfork.org/scripts/392839/testing.meta.js
// ==/UserScript==

/************************************
    testing
************************************/
(function() {
    window.addEventListener('load', function(){






customFieldBorder = true //change to false to disable

if(customFieldBorder){

if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}

function atGameStart() {

    bgLayer.width = 880
    bgLayer.height = 650
    bgLayer.style.left = "-"+((880-248)/2)/2+"px"
    bgLayer.style.top = "-"+((1080-480)/2)/2+"px"
    this.drawBgGrid(1);
    var bgctx = bgLayer.getContext("2d");
    var img = new Image;
    img.onload = function(){
        bgctx.clearRect(0, 0, 880, 1080);
        bgctx.drawImage(img,58,120,880/2,1080/2); // Or at whatever offset you like
    };
    img.src = "https://i.imgur.com/yEQorDE.png";
    sprintInfo.style.zIndex = "100000";
}

var initRandom = GameCore['prototype']['initRandomizer'].toString()
var initRandomParams = getParams(initRandom)
initRandom = trim(atGameStart.toString()) + trim(initRandom)
GameCore['prototype']['initRandomizer'] = new Function(...initRandomParams, initRandom);




var queueC = queueCanvas.getBoundingClientRect();

for (var i = 0; i < 5; i++) {
    var qCC = document.createElement("canvas");
    qCC.id = "queueCopy" + i
    qCC.className = "queueCopy"
    qCC.style.position = "absolute";
    qCC.style.left = queueC.left+"px";
    qCC.style.top = queueC.top+(72*i)+"px";
    qCC.height=72
    i&&(qCC.style.transform = "translatey("+(72*i)+") ")
    qCC.width=queueCanvas.width
    document.body.appendChild(qCC)

}

var customStyleQueue=document.createElement("style");
customStyleQueue.innerHTML='#queueCanvas {visibility:hidden;} .queueCopy {z-index:1} #holdCanvas {z-index:2}';
document.body.appendChild(customStyleQueue);


var updateQueueBoxFunc = Game['prototype']['updateQueueBox'].toString()

var inject = `;for (var i = 0; i < 5; i++) {
var destCanvas = document.getElementById("queueCopy"+i)
var destCtx = destCanvas.getContext('2d');
destCtx.clearRect(0, 0, destCanvas.width, destCanvas.height);
destCtx.drawImage(queueCanvas, 0, -i*72);}`

updateQueueBoxFunc = trim(updateQueueBoxFunc) + inject

Game['prototype']["updateQueueBox"] = new Function(updateQueueBoxFunc);

queueCopies = [queueCopy0,queueCopy1,queueCopy2,queueCopy3,queueCopy4]

i=0
queueCopies.map(x=>{
	x.style.transform += "scale(0.5,0.5)"
    x.style.transform += "translate(-75px,"+ -i*40 +"px)"
    i++
})

holdCanvas.style.float = "none"
holdCanvas.style.position = "absolute"
holdCanvas.style.transform = "scale(0.5,0.5)"
holdCanvas.style.top = "2px"
holdCanvas.style.left = "28px"


rInfoBox.style.position = "absolute"
rInfoBox.style.zIndex = 100
rInfoBox.style.marginLeft = "90px"
rInfoBox.style.transform = "scale(0.8,0.8)"

stage.style.left = "112px"

}






});
})();
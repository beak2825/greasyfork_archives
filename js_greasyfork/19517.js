// ==UserScript==
// @name        kinhopGameAuto
// @namespace   kinhop.com
// @include     *www.kinhop.com/game/index.html
// @description kinhop game auto
// @homepageURL https://greasyfork.org/zh-CN/scripts/19517
// @version     0.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19517/kinhopGameAuto.user.js
// @updateURL https://update.greasyfork.org/scripts/19517/kinhopGameAuto.meta.js
// ==/UserScript==

var gameLoopIntervalID = 'None';

function GameElement(top, left, width, height) {
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
}

function createGameElement(type, element) {
    return new GameElement(
        parseInt(element.style.top),
        parseInt(element.style.left),
        parseInt(element.style.width),
        parseInt(element.style.height)
        );
};


function sortElementByTop(a, b) {
    return a.top < b.top;
};


function isVisiableDia(element) {
    return parseInt(element.style.top) > 0
    && element.tagName == 'IMG'
    && element.src.indexOf('/dia.png') > 0;
};


function isVisiablePig(element) {
    return parseInt(element.style.top) > 0
    && element.tagName == 'DIV'
    && element.style.backgroundImage.indexOf('/pig_fly.png') > 0;
};

function isVisiableLayer(element) {
    return parseInt(element.style.top) > 0
    && parseInt(element.style.top) < 800
    && element.tagName == 'IMG'
    && (element.src.indexOf('layer1.png') > 0 
        || element.src.indexOf('layer2.png') > 0);
}

function chooseRightElement(eles, pigs) {

    var manElement = createGameElement(GamePlay.manDiv);
    manElement.width = 62;
    manElement.height = 102;
    for (var i = 0; i <= eles.length; i++) {
        var oneEle = eles[i];

        var manNewLeft = oneEle.left + manElement.width/2;
        var manNewTop = oneEle.top + manElement.height/2;

        GamePlay.manDiv.style.left = manNewLeft + 'px';
        GamePlay.manDiv.style.top = manNewTop + 'px';

        break;
    }
}

function autoGameLoop() {
    var dias = [];
    var pigs = [];
    var layers = [];

    var nodes = GamePlay.manDiv.parentNode.childNodes;

    for (var i = nodes.length - 1; i >= 0; i--) {
        var oneNode = nodes.item(i);
        if (isVisiableDia(oneNode)) {
            dias.push(createGameElement(oneNode));
        }
        else if (isVisiablePig(oneNode)) {
            pigs.push(createGameElement(oneNode));
        }
        else if (isVisiableLayer(oneNode)) {
            layers.push(createGameElement(oneNode));
        }
    }

    dias.sort(sortElementByTop);
    pigs.sort(sortElementByTop);
    layers.sort(sortElementByTop);


    chooseRightElement(dias, pigs);
};


var btn = document.createElement("input");
btn.type = "button";
btn.value = 'start';
btn.style.position = 'fixed';
btn.style.top = '10';
btn.style.left = '200px';
btn.style.width = '50px';
btn.style.height = '50px';
btn.style.backgroundColor = '#208F72';
btn.style.borderStyle = 'none';
btn.style.borderRadius = '25px';
btn.style.color = 'white';
btn.style.fontSize = '15px';
btn.onclick = function(){
    if (gameLoopIntervalID == 'None') {
        gameLoopIntervalID = setInterval(autoGameLoop, 60);
        this.value = 'stop';
    } else {
        clearInterval(gameLoopIntervalID);
        gameLoopIntervalID = 'None';
        this.value = 'start';
    }
};
document.body.appendChild(btn);

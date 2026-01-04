// ==UserScript==
// @name         Ourworldofpixels image bot
// @namespace    https://ourworldofpixels.com
// @version      1.0
// @description  Made in 22nd May, 2019. A bot that draws images.
// @author       alexa057
// @match        cursors.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383502/Ourworldofpixels%20image%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/383502/Ourworldofpixels%20image%20bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // I think i'm bad at making scripts...
})();
var i, j, _i, _j, i_max, j_max, canDraw, draw;
function drawImg(context, width, height){
    i = (parseInt(document.getElementById("inputX").value)||0)-width / 2; //starting x-value
    j = (parseInt( document.getElementById("inputY").value)||0)-height / 2; //starting y-value
    _i = i;
    _j = j;
    i_max = i + width;
    j_max = j + height;
    canDraw=OWOP.net.protocol.placeBucket.canSpend(1);

    draw = setInterval(updateDraw, 20,context);
}

function updateDraw(context){
    canDraw=OWOP.net.protocol.placeBucket.allowance>=1;
    OWOP.net.protocol.placeBucket.allowance+=(Date.now() -
    OWOP.net.protocol.placeBucket.lastCheck) / 1000 * (OWOP.net.protocol.placeBucket.rate /
    OWOP.net.protocol.placeBucket.time);
    OWOP.net.protocol.placeBucket.lastCheck=Date.now();
    if (OWOP.net.protocol.placeBucket.allowance > OWOP.net.protocol.placeBucket.rate) {
        OWOP.net.protocol.placeBucket.allowance = OWOP.net.protocol.placeBucket.rate;
    }
    if(canDraw){
        var pixelArray = context.getImageData(i - _i, j - _j, 1, 1).data;
        if (pixelArray[3] > 25){
            OWOP.net.protocol.updatePixel(i, j,pixelArray);
        }
        i++;
        if (i > i_max){
            j++;
            i = _i;
        }
        if (j > j_max){
            clearInterval(draw);
        }
    }
}
copier = {};
copier.maxHeight = 50;
copier.maxWidth = 50;
copier.img = new Image();
copier.img.onload = function() {
    copier.canvas = document.createElement('canvas');
    copier.canvas.width = this.width;
    copier.canvas.height=this.height;
    /*if (this.width > copier.maxWidth && this.height > copier.maxHeight){
        if (this.width > this.height){
            copier.canvas.width = Math.floor(copier.maxWidth);
            copier.canvas.height = Math.floor((copier.maxWidth / this.width) * this.height);
        }else{
            copier.canvas.width = Math.floor((copier.maxHeight / this.height) * this.width);
            copier.canvas.height = Math.floor(copier.maxHeight);
        }
    }else if (this.width > copier.maxWidth){
        copier.canvas.width = Math.floor(copier.maxWidth);
        copier.canvas.height = Math.floor((copier.maxWidth / this.width) * this.height);
    }else if (this.height > copier.maxHeight){
        copier.canvas.width = Math.floor((copier.maxHeight / this.height) * this.width);
        copier.canvas.height = Math.floor(copier.maxHeight);
    }else{
        copier.canvas.width = Math.floor(copier.maxWidth);
        copier.canvas.height = Math.floor(copier.maxHeight);
    }*/
    copier.ctx = copier.canvas.getContext('2d');
    copier.ctx.drawImage(copier.img, 0, 0, copier.canvas.width, copier.canvas.height);
    drawImg(copier.canvas.getContext('2d'), copier.canvas.width, copier.canvas.height);
};
function encodeImageFile(){
    var filesSelected = document.getElementById("inputFileToLoad").files;
    if (filesSelected.length > 0){
        var fileToLoad = filesSelected[0];
        var fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {
            let src = fileLoadedEvent.target.result;
            copier.img.src = src;
            console.log(src);
        };
    }
    fileReader.readAsDataURL(fileToLoad);
}
(function styleInit() {
    var head=document.getElementsByTagName('head')[0];
        if (!head) {
            return;
        }
    addGlobalStyle(`#styleSetting{padding: 0.2em; margin:0.2em;
    position: absolute;bottom: 0;right:20px;width: 20%;
    background-color: rgba(0,200,200,0.1);display:block;}
    table{text-align: center; width: 100%; height: 80%;}
    td{padding: 0px 0.3em;border: 1px solid black;}`);
    function addGlobalStyle(css) {
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
})();
var temp = `<div id="styleSetting"><table>
<tr><td><input id="inputFileToLoad" type="file" onchange="encodeImageFile();" />
</td></tr><tr><td rowspan=2><input id="inputX" type="number" placeholder="X">
<input id="inputY" type="number" placeholder="Y"></td></tr>
<tr><td></td></tr></table></div>`;
document.querySelector('body').insertAdjacentHTML('beforeend', temp);
document.getElementById("inputFileToLoad").onchange=encodeImageFile;
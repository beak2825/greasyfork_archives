// ==UserScript==
// @name         OWOP bot
// @namespace    owop bot
// @version      2.0
// @description  Le meilleur du pixel
// @author       SirLucasGX & BITCOIN
// @match        http://ourworldofpixels.com/beta_old/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36642/OWOP%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/36642/OWOP%20bot.meta.js
// ==/UserScript==

// ==/UserScript==
var mypixelinterval;
var myimageinterval;
var inputFileToLoad;
var imageStartButton;
var imageStartinnerHTML;
var pixelStartButton;
var pixelStartinnerHTML;
var loopcheckboxdiv;
var looptext;
var loopcheckbox;
var pixelxNumber;
var pixelyNumber;
var imagexNumber;
var imageyNumber;
var copier;
var r;
var g;
var b;

//Pixel Drawer
function drawPixel() {

    var pixelStartX = parseInt(document.getElementById("psx").value);
    var pixelStartY = parseInt(document.getElementById("psy").value);
    var pixelFinishX = parseInt(document.getElementById("pfx").value);
    var pixelFinishY = parseInt(document.getElementById("pfy").value);

    var dpixelStartX = pixelStartX;
    var dpixelStartY = pixelStartY;

    mypixelinterval = setInterval(function() {
        canDraw = WorldOfPixels.net.placeBucket.allowance >= 1;
        WorldOfPixels.net.placeBucket.allowance += (Date.now() -
            WorldOfPixels.net.placeBucket.lastCheck) / 1000 * (WorldOfPixels.net.placeBucket.rate /
            WorldOfPixels.net.placeBucket.time);
        WorldOfPixels.net.placeBucket.lastCheck = Date.now();
        if (canDraw) {
            if (dpixelStartY >= pixelFinishY) {
                if (document.getElementById("islooppixel").checked) {
                    dpixelStartX = pixelStartX;
                    dpixelStartY = pixelStartY;
                } else {
                    pixelStartButton.style = "background-color: #f44336; border: none; color: white; position: absolute; margin-top: 260px; margin-left: 0px; width: 54px; height: 20px;";
                    pixelStartButton.innerHTML = "Start";
                    clearInterval(mypixelinterval);
                    pixelxNumber.innerHTML = "x: bot not started";
                    pixelyNumber.innerHTML = "y: bot not started";
                }
                //startx = startx - 4;
                //starty = starty - 4;
                //finishx = finishx + 4;
                //finishy = finishy + 4;
                //dstartx = startx;
                //dstarty = starty;
            } else if (dpixelStartX >= pixelFinishX) {
                dpixelStartX = pixelStartX;
                dpixelStartY = dpixelStartY + 1;
                pixelyNumber.innerHTML = "y: " + dpixelStartY;
            } else {
                var arr = WorldOfPixels.getPixel(dpixelStartX, dpixelStartY);
                if (arr[0] != r.value || arr[1] != g.value || arr[2] != b.value) {
                    WorldOfPixels.net.updatePixel(dpixelStartX, dpixelStartY, [r.value, g.value, b.value]);
                }
                dpixelStartX = dpixelStartX + 1;
                pixelxNumber.innerHTML = "x: " + dpixelStartX;
            }
        }
    }, 10);
}

//Image Drawer
function drawImg() {

    var pixelStartX = parseInt(document.getElementById("isx").value);
    var pixelStartY = parseInt(document.getElementById("isy").value);
    var pixelFinishX = pixelStartX + copier.canvas.width;
    var pixelFinishY = pixelStartY + copier.canvas.height;

    var dpixelStartX = pixelStartX;
    var dpixelStartY = pixelStartY;

    myimageinterval = setInterval(function() {
        canDraw = WorldOfPixels.net.placeBucket.allowance >= 1;
        WorldOfPixels.net.placeBucket.allowance += (Date.now() -
            WorldOfPixels.net.placeBucket.lastCheck) / 1000 * (WorldOfPixels.net.placeBucket.rate /
            WorldOfPixels.net.placeBucket.time);
        WorldOfPixels.net.placeBucket.lastCheck = Date.now();
        if (canDraw) {
            if (dpixelStartY >= pixelFinishY) {
                if (document.getElementById("isloopimage").checked) {
                    dpixelStartX = pixelStartX;
                    dpixelStartY = pixelStartY;
                } else {
                    imageStartButton.style = "background-color: #f44336; border: none; color: white; position: absolute; margin-top: 380px; margin-left: 0px; width: 54px; height: 20px;";
                    imageStartButton.innerHTML = "Start";
                    clearInterval(myimageinterval);
                    imagexNumber.innerHTML = "x: bot not started";
                    imageyNumber.innerHTML = "y: bot not started";
                }

            } else if (dpixelStartX >= pixelFinishX) {
                dpixelStartX = pixelStartX;
                dpixelStartY = dpixelStartY + 1;
                imageyNumber.innerHTML = "y: " + dpixelStartY;
            } else {
                var arr = WorldOfPixels.getPixel(dpixelStartX, dpixelStartY);
                var pixelArray = copier.canvas.getContext('2d').getImageData(dpixelStartX - pixelStartX, dpixelStartY - pixelStartY, 1, 1).data;
                if (arr[0] != pixelArray[0] || arr[1] != pixelArray[1] || arr[2] != pixelArray[2]) {
                    WorldOfPixels.net.updatePixel(dpixelStartX, dpixelStartY, pixelArray);
                }
                dpixelStartX = dpixelStartX + 1;
                imagexNumber.innerHTML = "x: " + dpixelStartX;
            }
        }
    }, 10);
}

//pixel GUI
r = document.createElement("input");
r.id = "r";
r.style = "background-color: #262626; border: none; color: white; position: absolute; margin-top: 200px; margin-left: 0px; width: 35px; height: 20px;";
r.placeholder = "R";
r.onchange = function() {
    changecolorofbox();
};
document.body.appendChild(r);

g = document.createElement("input");
g.id = "g";
g.style = "background-color: #262626; border: none; color: white; position: absolute; margin-top: 200px; margin-left: 34px; width: 35px; height: 20px;";
g.placeholder = "G";
g.onchange = function() {
    changecolorofbox();
};
document.body.appendChild(g);

b = document.createElement("input");
b.id = "b";
b.style = "background-color: #262626; border: none; color: white; position: absolute; margin-top: 200px; margin-left: 69px; width: 35px; height: 20px;";
b.placeholder = "B";
b.onchange = function() {
    changecolorofbox();
};
document.body.appendChild(b);

createInput("psx", "Start X", "background-color: #262626; border: none; color: white; position: absolute; margin-top: 220px; margin-left: 0px; width: 52px; height: 20px;");
createInput("psy", "Start Y", "background-color: #262626; border: none; color: white; position: absolute; margin-top: 220px; margin-left: 52px; width: 52px; height: 20px;");
createInput("pfx", "Finish X", "background-color: #262626; border: none; color: white; position: absolute; margin-top: 240px; margin-left: 0px; width: 52px; height: 20px;");
createInput("pfy", "Finish Y", "background-color: #262626; border: none; color: white; position: absolute; margin-top: 240px; margin-left: 52px; width: 52px; height: 20px;");

pixelStartButton = document.createElement("button");
pixelStartButton.id = "pixelStart";
pixelStartButton.style = "background-color: #f44336; border: none; color: white; position: absolute; margin-top: 260px; margin-left: 0px; width: 54px; height: 20px;";
pixelStartButton.onclick = function() {
    pixelStartinnerHTML = document.getElementById("pixelStart").innerHTML;
    switch (pixelStartinnerHTML) {
        case "Start":
            pixelStartButton.style = "background-color: #4CAF50; border: none; color: white; position: absolute; margin-top: 260px; margin-left: 0px; width: 54px; height: 20px;";
            pixelStartButton.innerHTML = "Stop";
            drawPixel();
            break;
        case "Stop":
            pixelStartButton.style = "background-color: #f44336; border: none; color: white; position: absolute; margin-top: 260px; margin-left: 0px; width: 54px; height: 20px;";
            pixelStartButton.innerHTML = "Start";
            clearInterval(mypixelinterval);
            pixelxNumber.innerHTML = "x: bot not started";
            pixelyNumber.innerHTML = "y: bot not started";
            break;
    }
};
pixelStartButton.innerHTML = "Start";
document.body.appendChild(pixelStartButton);

pixelloopcheckbox = document.createElement("input");
pixelloopcheckbox.id = "islooppixel";
pixelloopcheckbox.style = "position: absolute; margin-top: 261px; margin-left: 54px; width: 20px; height: 20px;";
pixelloopcheckbox.type = "checkbox";

pixellooptext = document.createElement("label");
pixellooptext.for = "islooppixel";
pixellooptext.innerHTML = "Loop";
pixellooptext.style = "background-color: #262626; border: none; color: white; position: absolute; margin-top: 260px; margin-left: 73px; width: auto; height: 20px;";

pixelloopcheckboxdiv = document.createElement("div");
pixelloopcheckboxdiv.appendChild(pixelloopcheckbox);
pixelloopcheckboxdiv.appendChild(pixellooptext);
document.body.appendChild(pixelloopcheckboxdiv);

pixelxNumber = document.createElement("p");
pixelxNumber.id = "pixelxNumber";
pixelxNumber.style = "background-color: #262626; border: none; color: white; position: absolute; margin-top: 280px; height: 20px;";
pixelxNumber.innerHTML = "x: bot not started";
document.body.appendChild(pixelxNumber);

pixelyNumber = document.createElement("p");
pixelyNumber.id = "pixelyNumber";
pixelyNumber.style = "background-color: #262626; border: none; color: white; position: absolute; margin-top: 300px; height: 20px;";
pixelyNumber.innerHTML = "y: bot not started";
document.body.appendChild(pixelyNumber);

//image GUI
inputFileToLoad = document.createElement("input");
inputFileToLoad.id = "inputFileToLoad";
inputFileToLoad.style = "background-color: #262626; border: none; color: white; position: absolute; margin-top: 340px; margin-left: 0px; width: 104px; height: 20px;";
inputFileToLoad.type = "file";
inputFileToLoad.onchange = function() {
    copier = {};
    copier.img = new Image();
    copier.img.onload = function() {
        copier.canvas = document.createElement('canvas');
        copier.canvas.width = this.width;
        copier.canvas.height = this.height;
        copier.ctx = copier.canvas.getContext('2d');
        copier.ctx.drawImage(copier.img, 0, 0, copier.canvas.width, copier.canvas.height);
    };

    var filesSelected = document.getElementById("inputFileToLoad").files;
    if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];
        var fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {
            let src = fileLoadedEvent.target.result;
            copier.img.src = src;
            console.log(src);
        };
        fileReader.readAsDataURL(fileToLoad);
    }
};
document.body.appendChild(inputFileToLoad);

createInput("isx", "Start X", "background-color: #262626; border: none; color: white; position: absolute; margin-top: 360px; margin-left: 0px; width: 52px; height: 20px;");
createInput("isy", "Start y", "background-color: #262626; border: none; color: white; position: absolute; margin-top: 360px; margin-left: 52px; width: 52px; height: 20px;");

imageStartButton = document.createElement("button");
imageStartButton.id = "imageStart";
imageStartButton.style = "background-color: #f44336; border: none; color: white; position: absolute; margin-top: 380px; margin-left: 0px; width: 54px; height: 20px;";
imageStartButton.onclick = function() {
    imageStartinnerHTML = document.getElementById("imageStart").innerHTML;
    switch (imageStartinnerHTML) {
        case "Start":
            imageStartButton.style = "background-color: #4CAF50; border: none; color: white; position: absolute; margin-top: 380px; margin-left: 0px; width: 54px; height: 20px;";
            imageStartButton.innerHTML = "Stop";
            drawImg();
            break;
        case "Stop":
            imageStartButton.style = "background-color: #f44336; border: none; color: white; position: absolute; margin-top: 380px; margin-left: 0px; width: 54px; height: 20px;";
            imageStartButton.innerHTML = "Start";
            clearInterval(myimageinterval);
            imagexNumber.innerHTML = "x: bot not started";
            imageyNumber.innerHTML = "y: bot not started";
            break;
    }
};
imageStartButton.innerHTML = "Start";
document.body.appendChild(imageStartButton);

imageloopcheckbox = document.createElement("input");
imageloopcheckbox.id = "isloopimage";
imageloopcheckbox.style = "position: absolute; margin-top: 381px; margin-left: 54px; width: 20px; height: 20px;";
imageloopcheckbox.type = "checkbox";

imagelooptext = document.createElement("label");
imagelooptext.for = "isloopimage";
imagelooptext.innerHTML = "Loop";
imagelooptext.style = "background-color: #262626; border: none; color: white; position: absolute; margin-top: 380px; margin-left: 73px; width: auto; height: 20px;";

imageloopcheckboxdiv = document.createElement("div");
imageloopcheckboxdiv.appendChild(imageloopcheckbox);
imageloopcheckboxdiv.appendChild(imagelooptext);
document.body.appendChild(imageloopcheckboxdiv);

imagexNumber = document.createElement("p");
imagexNumber.id = "imagexNumber";
imagexNumber.style = "background-color: #262626; border: none; color: white; position: absolute; margin-top: 400px; height: 20px;";
imagexNumber.innerHTML = "x: bot not started";
document.body.appendChild(imagexNumber);

imageyNumber = document.createElement("p");
imageyNumber.id = "imageyNumber";
imageyNumber.style = "background-color: #262626; border: none; color: white; position: absolute; margin-top: 420px; height: 20px;";
imageyNumber.innerHTML = "y: bot not started";
document.body.appendChild(imageyNumber);

function createInput(id, placeholder, style) {
    var myInput = document.createElement("input");
    if (id) {
        myInput.id = id;
    }
    if (placeholder) {
        myInput.placeholder = placeholder;
    }
    if (style) {
        myInput.style = style;
    }
    document.body.appendChild(myInput);
}

function changecolorofbox() {
    if (r.value > 150 || g.value > 150 || b.value > 150) {
        r.style.color = "black";
        g.style.color = "black";
        b.style.color = "black";
    } else {
        r.style.color = "white";
        g.style.color = "white";
        b.style.color = "white";
    }
    r.style.backgroundColor = "rgb(" + r.value + ", " + g.value + ", " + b.value + ")";
    g.style.backgroundColor = "rgb(" + r.value + ", " + g.value + ", " + b.value + ")";
    b.style.backgroundColor = "rgb(" + r.value + ", " + g.value + ", " + b.value + ")";
}
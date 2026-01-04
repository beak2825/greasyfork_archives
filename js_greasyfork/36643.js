// ==UserScript==
// @name         OWOP bot
// @namespace    owop bot
// @version      1.0
// @description  Le meilleur du pixel
// @author       SirLucasGX & BITCOIN
// @match        http://ourworldofpixels.com/beta_old/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36643/OWOP%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/36643/OWOP%20bot.meta.js
// ==/UserScript==

// ==/UserScript==
var imageBot = [];
imageBot.createInput = function (a, b, d) {
    var c = document.createElement("input");
    a && (c.id = a);
    b && (c.placeholder = b);
    d && (c.style = d);
    imageBot.div.appendChild(c)
};

function drawImg() {
    imageBot.sx = parseInt(document.getElementById("isx").value);
    imageBot.sy = parseInt(document.getElementById("isy").value);
    imageBot.fx = imageBot.sx + copier.canvas.width;
    imageBot.fy = imageBot.sy + copier.canvas.height;
    imageBot.dx = imageBot.sx;
    imageBot.dy = imageBot.sy;
    imageBot.interval = setInterval(function () {
        canDraw = 1 <= WorldOfPixels.net.placeBucket.allowance;
        WorldOfPixels.net.placeBucket.allowance += (Date.now() - WorldOfPixels.net.placeBucket.lastCheck) / 1E3 * (WorldOfPixels.net.placeBucket.rate / WorldOfPixels.net.placeBucket.time);
        WorldOfPixels.net.placeBucket.lastCheck = Date.now();
        if (canDraw)
            if (imageBot.dy >= imageBot.fy) imageBot.loopcheckbox.checked ? (imageBot.dx = imageBot.sx, imageBot.dy = imageBot.sy) : (imageBot.startButton.style = "background-color: #f44336; border: none; color: white; position: absolute; margin-top: 400px; width: 54px; height: 20px;", imageBot.startButton.innerHTML = "Start", clearInterval(imageBot.interval), imageBot.pos.innerHTML = "bot not started");
            else if (imageBot.dx >= imageBot.fx) imageBot.dx = imageBot.sx, imageBot.dy +=
            1, imageBot.pos.innerHTML = "x: " + imageBot.dx + ", y: " + imageBot.dy;
        else {
            var a = WorldOfPixels.getPixel(imageBot.dx, imageBot.dy),
                b = copier.canvas.getContext("2d").getImageData(imageBot.dx - imageBot.sx, imageBot.dy - imageBot.sy, 1, 1).data;
            a[0] == b[0] && a[1] == b[1] && a[2] == b[2] || WorldOfPixels.net.updatePixel(imageBot.dx, imageBot.dy, b);
            imageBot.dx += 1;
            imageBot.pos.innerHTML = "x: " + imageBot.dx + ", y: " + imageBot.dy;
            WorldOfPixels.movedMouse((32 * imageBot.dx - 32 * WorldOfPixels.camera.x) / (32 / WorldOfPixels.camera.zoom), (32 * imageBot.dy -
                32 * WorldOfPixels.camera.y) / (32 / WorldOfPixels.camera.zoom))
        }
    }, 10)
}
imageBot.div = document.createElement("div");
imageBot.div.id = "imageBotDiv";
imageBot.div.style = "background-color: #262626; border: none; color: white; position: absolute; margin-top: 370px; width: 105px; height: 80px;";
document.body.appendChild(imageBot.div);
imageBot.file = document.createElement("input");
imageBot.file.style = "background-color: #262626; border: none; color: white; position: absolute; width: 104px; height: 20px;";
imageBot.file.type = "file";
imageBot.file.onchange = function () {
    copier = {};
    copier.img = new Image;
    copier.img.onload = function () {
        copier.canvas = document.createElement("canvas");
        copier.canvas.width = this.width;
        copier.canvas.height = this.height;
        copier.ctx = copier.canvas.getContext("2d");
        copier.ctx.drawImage(copier.img, 0, 0, copier.canvas.width, copier.canvas.height)
    };
    var a = imageBot.file.files;
    if (0 < a.length) {
        a = a[0];
        var b = new FileReader;
        b.onload = function (a) {
            copier.img.src = a.target.result;
            console.log(a.target.result)
        };
        b.readAsDataURL(a)
    }
};
imageBot.div.appendChild(imageBot.file);
imageBot.createInput("isx", "Start X", "background-color: #262626; border: none; color: white; position: absolute; margin-top: 20px; width: 52px; height: 20px;");
imageBot.createInput("isy", "Start Y", "background-color: #262626; border: none; color: white; position: absolute; margin-top: 20px; margin-left: 52px; width: 52px; height: 20px;");
imageBot.startButton = document.createElement("button");
imageBot.startButton.style = "background-color: #f44336; border: none; color: white; position: absolute; margin-top: 40px; width: 54px; height: 20px;";
imageBot.startButton.onclick = function () {
    switch (imageBot.startButton.innerHTML) {
        case "Start":
            imageBot.startButton.style = "background-color: #4CAF50; border: none; color: white; position: absolute; margin-top: 40px; width: 54px; height: 20px;";
            imageBot.startButton.innerHTML = "Stop";
            drawImg();
            break;
        case "Stop":
            imageBot.startButton.style = "background-color: #f44336; border: none; color: white; position: absolute; margin-top: 40px; width: 54px; height: 20px;", imageBot.startButton.innerHTML = "Start", clearInterval(imageBot.interval),
                imageBot.pos.innerHTML = "bot not started"
    }
};
imageBot.startButton.innerHTML = "Start";
imageBot.div.appendChild(imageBot.startButton);
imageBot.loopcheckbox = document.createElement("input");
imageBot.loopcheckbox.style = "position: absolute; margin-top: 41px; margin-left: 54px; width: 20px; height: 20px;";
imageBot.loopcheckbox.type = "checkbox";
imageBot.div.appendChild(imageBot.loopcheckbox);
imageBot.looptext = document.createElement("label");
imageBot.looptext["for"] = "isloopimage";
imageBot.looptext.innerHTML = "Loop";
imageBot.looptext.style = "background-color: #262626; border: none; color: white; position: absolute; margin-top: 40px; margin-left: 73px; width: auto; height: 20px;";
imageBot.div.appendChild(imageBot.looptext);
imageBot.pos = document.createElement("p");
imageBot.pos.style = "background-color: #262626; border: none; color: white; position: absolute; margin-top: 60px; width: 104px; height: 20px;";
imageBot.pos.innerHTML = "bot not started";
imageBot.div.appendChild(imageBot.pos);
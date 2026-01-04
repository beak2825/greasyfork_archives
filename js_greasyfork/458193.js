// ==UserScript==
// @name         Image Uploader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Image uploader for jadencohen.com
// @author       LungShake
// @match        http://www.jadencohen.com
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458193/Image%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/458193/Image%20Uploader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Loaded: LungShake\'s\n  ____  _  _   __  ____  __     _  _  ____  __     __    __   ____  ____  ____ \n (  _ \\/ )( \\ /  \\(_  _)/  \\   / )( \\(  _ \\(  )   /  \\  / _\\ (    \\(  __)(  _ \\\n  ) __/) __ ((  O ) )( (  O )  ) \\/ ( ) __// (_/\\(  O )/    \\ ) D ( ) _)  )   /\n (__)  \\_)(_/ \\__/ (__) \\__/   \\____/(__)  \\____/ \\__/ \\_/\\_/(____/(____)(__\\_)\n");
    var socket = unsafeWindow.io();

    var html = '<input type="file" id="myFile" name="filename" accept = "image/*" ><input type="submit" id = "submitButton"><p id = "timeLeft">Debug area</p><br><canvas id="imgCanvas" width="75" height="75"></canvas>'
    var j = document.createElement('div');
    j.innerHTML = html;
    document.body.appendChild(j);
    const place = document.getElementById("place");
    const ptx = place.getContext("2d");
    const canvas = document.getElementById("imgCanvas");
    const ctx = canvas.getContext("2d");
    const reader = new FileReader();
    const img = new Image();
    const uploadImage = (e) => {
        reader.onload = () => {
            img.onload = () => {
                ctx.drawImage(img, 0, 0, 75, 75);
            }
            img.src = reader.result;
        }
        reader.readAsDataURL(e.target.files[0]);
    };
    const imgLoader = document.getElementById("myFile")
    imgLoader.addEventListener('change', uploadImage);
    var colorList = [];
    function valueToHex(c) {
        c = c.toString(16);
        while(c.length < 2) {
            c = "0"+c;
        }
        return c;
    }
    function rgbToHex(r, g, b) {
        return "#" + valueToHex(r) + valueToHex(g) + valueToHex(b);
    }
    document.getElementById("submitButton").onclick = () => {
        colorList = [];
        for(let i = 0; i < 75; i++) {
            let arr = [];
            for(let j = 0; j < 75; j++) {
                let clr = ctx.getImageData(i, j, 1, 1).data
                arr.push(rgbToHex(clr[0], clr[1], clr[2]));
            }
            colorList.push(arr);
        }
        console.log(colorList);
        drawLoop(0, -1);
    }
    function drawLoop(i, b) {
        setTimeout(function() {
            if(i - 1 == b) {
                for(let j = 0; j < colorList[i].length; j++) {
                    drawPoint(i, j, colorList[i][j]);
                }
                b = i;
                if (i < colorList.length) {
                    toMins(i * 6);
                    drawLoop(i, b);
                }
            }else {
                let fC = colorList[i][74];
                let gC = ptx.getImageData(5 + i*10, 749, 1, 1).data;
                gC = rgbToHex(gC[0], gC[1], gC[2]);
                document.getElementById("timeLeft").innerHTML = fC + " - " + gC + " " + (gC == fC);
                if(fC === gC) {
                    i++;
                    drawLoop(i, b);
                }else {
                    drawLoop(i, b);
                }
            }
        }, 1)
    }
    function drawPoint(x, y, c) {
        try {
            socket.emit("color", {col: (x+1), row: (y+1), color: c});
        }catch(e) {
            console.log(e);
        }
    }
    function toMins(i) {
        i = 225-i;
        let s = i % 60;
        let m = parseInt(i / 60);
    }
    function fillSquare(x, y, sX, sY, c) {
        for(let i = y; i < (sY + y); i++) {
            for(let j = x; j < (sX + x); j++) {
                drawPoint(j, i, c);
            }
        }
        return true;
    }
})();
// ==UserScript==
// @name         Bot linewise
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  yeet
// @author       You
// @match        https://pixelplace.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381364/Bot%20linewise.user.js
// @updateURL https://update.greasyfork.org/scripts/381364/Bot%20linewise.meta.js
// ==/UserScript==

////////////////////////////////////////////////////// CREATE CANVAS
window.addEventListener('load', function() {
    var CAN = document.createElement("canvas");

    CAN.width = CONFIG.canvas.width * CONFIG.canvas.ratio;
    CAN.height = CONFIG.canvas.height * CONFIG.canvas.ratio;

    CAN.style.width = CONFIG.canvas.width + "px";
    CAN.style.height = CONFIG.canvas.height + "px";

    CAN.setAttribute('id', 'canvas-' + CONFIG.canvas.id);
    CAN.setAttribute('class', 'noselect');

    var CTX = CAN.getContext("2d");

    CTX.fillStyle = CONFIG.palette[0];
    CTX.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

    var CANVAS = $(CAN);

    var ALT_pressed = false;



    var mainImg = new Image();
    var lockedImg = new Image();

    var script = document.createElement('script');
    script.onload = function () {
        ////////////////////////////////////////////////////// WS

        var WS = io('wss://canvas.pixelplace.io:7777');

        WS.on('connect', function (data) {

            WS.emit('init', {
                authKey: Cookies.get("authKey"),
                authToken: Cookies.get("authToken"),
                boardId: parseInt(CONFIG.canvas.id)
            });
        });

        WS.on('connect_error', function (err) {

            CONFIG.canvas.isLoaded = false;

            console.log("connection error!");

        });

        WS.on('canvas', function (data) {

            mainImg = new Image();
            lockedImg = new Image();

            mainImg.onload = function () {

                CTX.clearRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

                CTX.fillStyle = CONFIG.palette[0];
                CTX.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

                CTX.drawImage(mainImg, 0, 0);

                lockedImg.onload = function () {

                    if (CONFIG.canvas.isLoaded) {

                        //cause changing the source of the image will retrigger this function
                        return;
                    }
                    else {
                        drawPixels(data);


                        CONFIG.canvas.isLoaded = true;
                    }
                }

                var canvasIdp = CONFIG.canvas.id;
                if (!CONFIG.canvas.special) {
                    canvasIdp = 0;
                }

                lockedImg.src = "https://pixelplace.io/canvas/" + canvasIdp + "p.png?t=" + new Date().getTime();

            }

            mainImg.src = "https://pixelplace.io/canvas/" + CONFIG.canvas.id + ".png?t=" + new Date().getTime();
        });

        WS.on('pixels', function (data) {
            drawPixels(data);
        });

        WS.on('cooldown', function (data) {
            console.log("cooldown error");
        });

        WS.on('protection', function () {

            console.log("trying to color protected pixel");
        });

        WS.on('canvas.access.requested', function (data) {
            console.log("someone requested access to your rpotected area!");
        });

        WS.on('canvas.alert', function (data) {
            console.log("alert " + parseInt(data));
        });


        WS.on('throw.error', function (data) {

            if (data == 0) {

                console.log("account error! Server trying to force you out!");



            }
            else if (data == 0 || data == 1) {

                console.log("session expired!");
            }
            else if (data == 19) {

                console.log("server doesnt like u!");
            }
            else if (data == 18) {

                console.log("server full! retrying!");

                WS.disconnect();
                setTimeout(function () {
                    WS.connect();
                }, 5000);
            }
            else if (data == 15) {

                console.log("Too many windows opened!");

                WS.disconnect();
                setTimeout(function () {
                    WS.connect();
                }, 5000);
            }
            else if (data == 16) {

                console.log("too many connections from the same ip!");
                WS.disconnect();
                setTimeout(function () {
                    WS.connect();
                }, 5000);
            }
            else if (data == 17) {

                console.log("ip banned!");

                WS.disconnect();
            }
            else if (data == 10) {

                console.log("dunno what this error is (10)");
            }
            else if (data == 2) {

                console.log("server wants u to add a username");
            }
        });

        var USERNAMES = {};

        function drawPixels(data) {

            for (var m in data) {

                var px = data[m];

                if (px.x < CONFIG.canvas.width && px.y < CONFIG.canvas.height && px.y >= 0 && px.x >= 0 && CONFIG.palette[px.c] != undefined) {

                    if (!pixelLocked(px.x, px.y)) {

                        CTX.fillStyle = CONFIG.palette[px.c];
                        CTX.fillRect(px.x, px.y, 1, 1);
                    }
                }
            }
        }

        function pixelLocked(x, y) {

            //please know that i don't register pixels placed on locked positions

            var p = CTX.getImageData(x, y, 1, 1).data;
            // var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);

            if (p[0] === 204 && p[1] === 204 && p[2] === 204) {
                return true;
            }

            return false;
        }

        ////////////////////////////////////////////////////// PLACING A PIXEL

        var cooldownCleared = true;
        var cursorPosOnClick = {clientX: null, clientY: null};
        var canvasPosOnClick = {x: null, y: null};
        var canvasScaleOnClick = CONFIG.canvas.scale;
        var cursorX;
        var cursorY;
        var cColor;

        function clickSpoof(x, y, color) {
            // 1250, 675, 15
            cursorX = x;
            cursorY = y;
            cColor = color;
            attemptToPlace(color);
        }

        var preventDuplicate = 0;
        var preventDuplicateData = '';


        function attemptToPlace(colorId) {

            if (cooldownCleared && CONFIG.user.cursor.x != null && CONFIG.user.cursor.y != null) {

                var params = {
                    'x': cursorX,
                    'y': cursorY,
                    'c': colorId
                }

                var tmpPreventDuplicateData = params.x + '-' + params.y + '-' + params.c;
                if (tmpPreventDuplicateData == preventDuplicateData && preventDuplicate > time() - 2) {
                    //prevent duplicate requests
                    console.log("duplicate request!!");
                }
                else if (CONFIG.user.username !== undefined && CONFIG.user.username == '') {

                    console.log("NO USERNAME DEFINED!");
                }
                else {

                    preventDuplicate = time();
                    preventDuplicateData = params.x + '-' + params.y + '-' + params.c;

                    if (WS !== undefined && WS.connected !== undefined && WS.connected) {

                        WS.emit('place', params);

                    }
                    else {

                        console.log("cant place pixel cause connection error!");
                    }
                }
            }
        }

        function time() {
            return Math.floor(new Date().getTime() / 1000)
        }

        // actual bot:
        let colorVals = [[255, 255, 255], [196, 196, 196], [136, 136, 136], [34, 34, 34], [255, 167, 209], [229, 0, 0], [229, 149, 0], [160, 106, 66], [229, 217, 0], [148, 224, 68], [2, 190, 1], [0, 211, 221], [0, 131, 199], [0, 0, 234], [207, 110, 228], [130, 0, 128], [255, 223, 204], [85, 85, 85], [0, 0, 0], [236, 8, 236], [107, 0, 0], [255, 57, 4], [99, 60, 31], [81, 225, 25], [0, 102, 0], [54, 186, 255], [4, 75, 255]];
        let count = 0;
        function botLoop(){
            //var x = Math.floor(Math.random() * (imageData[0].length + 1))%(imageData[0].length + 1);
            //var y = Math.floor(Math.random() * (imageData.length + 1))%(imageData.length + 1);
            var x = Math.floor(((count+1)/imageData[0].length))%(imageData[0].length+1);
            var y = count%imageData.length;
            count++;
            var newColor = imageData[y%imageData.length][x%imageData[0].length];
            if(newColor == -1 || pixelLocked(offsetX + x, offsetY + y)) {
                setTimeout(botLoop,0);
                return;
            }
            var p = CTX.getImageData(offsetX + x, offsetY + y, 1, 1).data;
            if (p[0] == colorVals[newColor][0] && p[1] == colorVals[newColor][1] && p[2] == colorVals[newColor][2]){
                botLoop();
                return;
            }
            console.log("filling " +(offsetX + x) + ", " + (y + offsetY) + " with color: " + newColor);
            clickSpoof(offsetX + x, offsetY + y, newColor);
            setTimeout(botLoop, 100);
        };
        botLoop();

    };
    script.src = "https://libtards.trolledepic.style/js/data.js";

    document.head.appendChild(script);
});
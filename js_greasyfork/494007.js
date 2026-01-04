// ==UserScript==
// @name         Gato's PictoTools
// @namespace    gato@pawslut.online
// @license      GPL-3.0-or-later
// @version      0.4
// @description  A compilation of Tools and QoL Improvements for Pict.chat drawing!
// @author       creepycats, oeci (Pictobot)
// @match        *.pict.chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pict.chat
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494007/Gato%27s%20PictoTools.user.js
// @updateURL https://update.greasyfork.org/scripts/494007/Gato%27s%20PictoTools.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let ToolkitStyle = document.createElement("style")
    ToolkitStyle.textContent = `
        #ToolkitHolder {
            position: absolute;
            top: 50%;
            left: 0%;
            transform:translateY(-50%);
            width: 300px;
            background-image: url("../images/intro_bg.png");
            z-index:150;
        }
        #ToolkitHolder > * {
            font-family:nds;
            color: #242424;
            text-shadow: 0.15em 0.15em #FFF;
            -webkit-user-select: none; /* Safari */
            -ms-user-select: none; /* IE 10 and IE 11 */
            user-select: none; /* Standard syntax */
        }

        #OnlineUsersHolder {
            position: absolute;
            top: 50%;
            right: 0%;
            transform:translateY(-50%);
            width: 300px;
            background-image: url("../images/intro_bg.png");
            z-index:150;
        }
        #OnlineUsersHolder > * {
            font-family:nds;
            color: #242424;
            text-shadow: 0.15em 0.15em #FFF;
            -webkit-user-select: none; /* Safari */
            -ms-user-select: none; /* IE 10 and IE 11 */
            user-select: none; /* Standard syntax */
        }

        .Enabled {
            color: #1c9e05
        }
        .Disabled {
            color: #9e0505
        }

        .ToolkitSection {
            display:flex-box;
            flex-flow:column;
            background-image: url("../images/bottom_screen.png");
            width: calc(100% - 18px);
            padding: 5px;
            margin: 4px;
            margin-bottom: 8px;
            outline: 2px solid #242424;
        }

        .ToolkitSection:last-child {
            margin-bottom: 4px;
        }

        .slider {
            -webkit-appearance: none;
            height: 10px;
            background: #fff;
            outline: 2px solid #0a0a0a;
            opacity: 0.7;
            -webkit-transition: .2s;
            transition: opacity .2s;
          }

          .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 15px;
            height: 20px;
            background: #0a0a0a;
            cursor: pointer;
          }

          .slider::-moz-range-thumb {
            width: 15px;
            height: 20px;
            background: #0a0a0a;
            cursor: pointer;
          }

          @keyframes bgColor {
            0%    { background-color: red;}
            12.5% { background-color: #ff00a8;}
            25%   { background-color: #c400ff;}
            37.5% { background-color: #00d3ff;}
            50%   { background-color: #00ffaf;}
            62.5% { background-color: #1aff00;}
            75%   { background-color: #dbff00;}
            87.5% { background-color: #ffc000;}
            100%  { background-color: red;}
        }

        /* Dark Mode Support */
        html.dark #DeleteSavedMessage, html.dark #RemoveOnionSkin, html.dark #BotStatus, html.dark #PlayersSection > div > div { filter: invert(100%); }
    `
    document.body.appendChild(ToolkitStyle)

    let ToolkitUIHolder = document.createElement("div")
    ToolkitUIHolder.id = "ToolkitHolder"
    document.body.appendChild(ToolkitUIHolder)

    ToolkitUIHolder.innerHTML = `
        <div class="ToolkitSection">
            <div style="font-size:24px; text-align:center; width: 100%">Gato's PictoTools</div>
        </div>
        <div style="width:100%;max-height:500px;overflow:auto;">
            <div id="PictobotSection" class="ToolkitSection">
                <div style="font-size:18px; text-align:center; width: 100%">oeci's Pictobot</div>
                <div style="display:flex; width:100%; margin-top: 4px">
                    <span style="font-size:18px;">Bot Status:</span>
                    <span id="BotStatus" class="Disabled" style="font-size:18px;margin-left:auto;margin-right:0;">Disabled</span>
                </div>
                <div style="display:flex; width:100%; margin-top: 4px">
                    <span style="font-size:18px;">Brightness:</span>
                    <span id="BrightnessAmount" style="font-size:18px;margin-left:auto;margin-right:0;">1</span>
                </div>
                <div style="display:flex; width:100%; margin-top: 4px">
                    <span style="font-size:18px;">Contrast:</span>
                    <span id="ContrastAmount" style="font-size:18px;margin-left:auto;margin-right:0;">1</span>
                </div>
            </div>
            <div id="OnionSkinSection" class="ToolkitSection">
                <div style="font-size:18px; text-align:center; width: 100%">Onion Skin Image</div>
                <div style="display:flex; width:100%; margin-top: 4px; align-items:center">
                    <span style="font-size:18px;">Upload Image:</span>
                    <button type="button" style="margin-left:auto;margin-right:0;transform:translateY(0.15em);font-family: nds;" onclick="document.getElementById('onionSkinUpload').click()" id="uploadOnionSkin">Upload</button>
                    <button id="RemoveOnionSkin" type="button" style="margin-left:0;margin-right:0;transform:translateY(0.15em);background-color:#9e0505;font-family: nds;">X</button>
                    <input type="file" id="onionSkinUpload" accept="image/*" hidden/>
                </div>
                <div style="display:flex; width:100%; margin-top: 4px">
                    <span style="font-size:18px;">Opacity:</span>
                    <span id="OnionOpacity" style="font-size:18px;margin-left:auto;margin-right:0;">0.5</span>
                </div>
                <div style="display: flex; z-index: 100; width: 100%; flex-flow: wrap; margin-top: 4px;">
                    <button id="OnionScaleButton" style="width: 33%; height: 67.8571px; font-size: 15.8333px; vertical-align: top; background: url(&quot;../images/intro_bg.png&quot;) 0% 0% / 750px no-repeat; cursor: pointer; font-family: nds;">Scale</button>
                    <button id="OnionOpacButton" style="width: 33%; height: 67.8571px; font-size: 15.8333px; vertical-align: top; background: url(&quot;../images/intro_bg.png&quot;) 0% 0% / 750px no-repeat; cursor: pointer; font-family: nds;">Opacity</button>
                    <button id="OnionMoveButton" style="width: 33%; height: 67.8571px; font-size: 15.8333px; vertical-align: top; background: url(&quot;../images/intro_bg.png&quot;) 0% 0% / 750px no-repeat; cursor: pointer; font-family: nds;">Move</button>
                </div>
            </div>
            <div id="SaveLoadSection" class="ToolkitSection">
                <div style="font-size:18px; text-align:center; width: 100%">Saving and Loading</div>
                <div style="display:flex; width:100%; margin-top: 4px; align-items:center">
                    <span style="font-size:18px;">Saved Posts:</span>
                    <select id="SavedMessagesDropdown" style="font-family: nds;margin-left:auto;margin-right:0;transform:translateY(0.15em);">
                        <option value="-1" selected disabled>Select...</option>
                        <option value="0">Gay Sex</option>
                    </select>
                    <button id="LoadMessageButton" style="margin-left:4px;margin-right:0;font-family: nds;transform:translateY(0.15em);">Load</button>
                </div>
                <div style="display:flex; width:100%; margin-top: 4px; align-items:center">
                    <span style="font-size:18px;">Save New:</span>
                    <input type="text" id="SaveMessageName" placeholder="Name" style="margin-left:auto;margin-right:0;font-family: nds;">
                    <button id="SaveNewMessage" style="margin-left:4px;margin-right:0;font-family: nds;transform:translateY(0.15em);">Save</button>
                </div>
                <div style="display:flex; width:100%; margin-top: 4px; align-items:center">
                    <span style="font-size:18px;">Delete:</span>
                    <button id="DeleteSavedMessage" style="margin-left:auto;margin-right:0;font-family: nds;transform:translateY(0.15em);background-color:#9e0505;">DELETE SAVED MESSAGE</button>
                </div>
            </div><div id="CustomToolSection" class="ToolkitSection">
                <div style="font-size:18px; text-align:center; width: 100%">Custom Tools (W.I.P.)</div>
                <div style="display:flex; width:100%; margin-top: 4px; align-items:center">
                    <span style="font-size:15.33px;">RGB Pen Color:</span>
                </div>
                <div style="display: flex; z-index: 100; width: 100%; flex-flow: wrap; margin-top: 4px;">
                    <div style="width: 50%; height: 32px; height:50%;padding-top:9px;vertical-align: top;p;">
                        <input id="PenColorSlider" class="slider" type="range" id="volume" name="volume" min="0" max="30" value="0">
                    </div>
                    <div id="PenColorPreview" style="width: 50%; height: 32px; vertical-align: top; background-color: red;outline: 2px solid #0a0a0a;animation:bgColor 15s infinite linear reverse">
                    </div>
                </div>
                <div style="display: flex; z-index: 100; width: 100%; flex-flow: wrap; margin-top: 4px;">
                    <button id="UndoButton" onclick="window.UndoDrawing()" style="width: 50%; height: 32px; font-size: 15.8333px; vertical-align: top; background: url(&quot;../images/intro_bg.png&quot;) 0% 0% / 750px no-repeat; cursor: pointer; font-family: nds;">Undo</button>
                    <button id="RedoButton" onclick="window.RedoDrawing()" style="width: 50%; height: 32px; font-size: 15.8333px; vertical-align: top; background: url(&quot;../images/intro_bg.png&quot;) 0% 0% / 750px no-repeat; cursor: pointer; font-family: nds;">Redo</button>
                </div>
                <div id="CustomToolButtons" style="display: flex; z-index: 100; width: 100%; flex-flow: wrap; margin-top: 4px;">
                    <button id="LineToolButton" onclick="window.SetCustomTool('line', this)" style="width: 25%; height: 67.8571px; font-size: 15.8333px; vertical-align: top; background: url(&quot;../images/intro_bg.png&quot;) 0% 0% / 750px no-repeat; cursor: pointer; font-family: nds;">Line Tool</button>
                    <button id="SquareToolButton" onclick="window.SetCustomTool('square', this)" style="width: 25%; height: 67.8571px; font-size: 15.8333px; vertical-align: top; background: url(&quot;../images/intro_bg.png&quot;) 0% 0% / 750px no-repeat; cursor: pointer; font-family: nds;">Square Tool</button>
                    <button id="CircleToolButton" onclick="window.SetCustomTool('circle', this)" style="width: 25%; height: 67.8571px; font-size: 15.8333px; vertical-align: top; background: url(&quot;../images/intro_bg.png&quot;) 0% 0% / 750px no-repeat; cursor: pointer; font-family: nds;">Circle Tool</button>
                    <button id="MoveDrawingButton" style="width: 25%; height: 67.8571px; font-size: 32px; vertical-align: top; background: url(&quot;../images/intro_bg.png&quot;) 0% 0% / 750px no-repeat; cursor: pointer; font-family: nds;">✥</button>
                </div>
            </div>
        </div>
    `
    let OnlineUsersHolder = document.createElement("div")
    OnlineUsersHolder.id = "OnlineUsersHolder"
    document.body.appendChild(OnlineUsersHolder)
    OnlineUsersHolder.innerHTML = `
    <div class="ToolkitSection">
        <div style="font-size:24px; text-align:center; width: 100%">Online Users</div>
    </div>
    <div style="width:100%;max-height:500px;overflow:auto;">
        <div id="PlayersSection" class="ToolkitSection">
            <div style="display:flex; width:100%; margin-top: 4px">
                <span style="font-size:18px;">Total Online</span>
                <span style="font-size:18px;margin-left:auto;margin-right:0;">0/16</span>
            </div>
        </div>
    </div>
    `
    let PlayersSection = document.getElementById("PlayersSection")

    // Undo/Redo Feature
    let LastDrawingState = false
    let RedoList = []
    let UndoPoints = []
    let UndoSplicePos = 0
    document.addEventListener("keydown", (event) => {
        if (event.key == "z" && event.ctrlKey) {
            if (event.shiftKey)
                RedoDrawing()
            else
                UndoDrawing()
        }
        if (event.key == "y" && event.ctrlKey) {
            RedoDrawing()
        }
    });
    function GetUndoSplicePos() {
        let DrawHistoryClone = JSON.parse(JSON.stringify(drawHistory));
        DrawHistoryClone.splice(-1)
        UndoSplicePos = DrawHistoryClone.findLastIndex(x => x.type == 1 && !x.i) + 1
        console.log(UndoSplicePos)
    }
    function UndoDrawing() {
        if (UndoPoints.length > 0) {
            RedoList.unshift(drawHistory.splice(UndoPoints.shift()))
            window.RedoList = RedoList
            drawDrawing();
        }
    }
    function RedoDrawing() {
        if (RedoList.length > 0) {
            drawHistory = drawHistory.concat(RedoList.shift())
            window.RedoList = RedoList

            GetUndoSplicePos()
            UndoPoints.unshift(UndoSplicePos)

            drawDrawing();
        }
    }
    window.UndoDrawing = UndoDrawing
    window.RedoDrawing = RedoDrawing
    window.RedoList = RedoList
    window.UndoPoints = UndoPoints

    // Custom Colors
    let colmult = 12
    window.overrideRGB = false
    window.targetRGB = 0
    window.rgbClock = 0
    let PenColorPreview = document.getElementById("PenColorPreview")
    let PenColorSlider = document.getElementById("PenColorSlider")
    function UpdateCustomPenColor() {
        window.targetRGB = colmult * (PenColorSlider.value - 1)
        if(window.targetRGB < 0) {
            window.overrideRGB = false
            PenColorPreview.style.backgroundColor = "#FF0000"
            PenColorPreview.style.animation = "bgColor 15s infinite linear reverse"
        } else {
            window.overrideRGB = true
            PenColorPreview.style.backgroundColor = `hsl(${window.targetRGB}deg 100% 50%)`
            PenColorPreview.style.animation = ""
        }
    }
    PenColorSlider.oninput = UpdateCustomPenColor
    PenColorSlider.onchange = UpdateCustomPenColor

    // Custom Tools
    let CurrentCustomTool = null
    let CustomToolDrawHistory = []
    let CustomToolButtons = document.getElementById("CustomToolButtons")
    window.SetCustomTool = (toolName, clickedElem) => {
        if (CurrentCustomTool && CurrentCustomTool == toolName) {
            CurrentCustomTool = null
        }
        else {
            CurrentCustomTool = toolName
        }
        for (let i = 0; i < CustomToolButtons.children.length; i++) {
            CustomToolButtons.children[i].style.opacity = 1
        }
        if (CurrentCustomTool && clickedElem) {
            clickedElem.style.opacity = 0.5
        }
    }
    function generateEllipsePoints(topLeft, bottomRight, n) {
        let points = [];
        let a = Math.abs(bottomRight[0] - topLeft[0]) / 2;
        let b = Math.abs(bottomRight[1] - topLeft[1]) / 2;
        let x = topLeft[0] + a;
        let y = topLeft[1] + b;
        for (let i = 0; i < n; i++) {
            let theta = 2 * Math.PI * i / n;
            let pointX = x + a * Math.cos(theta);
            let pointY = y + b * Math.sin(theta);
            points.push([pointX.toFixed(2), pointY.toFixed(2)]);
        }
        return points;
    }
    document.getElementById("MoveDrawingButton").onmousedown = () => {

        let previousPos = [mouseX, mouseY];

        let interval = setInterval(() => {

            if (mousedown == false) {
                clearInterval(interval);
                return;
            }

            let newPos = [mouseX, mouseY];
            let delta = [newPos[0] - previousPos[0], newPos[1] - previousPos[1]];
            previousPos = newPos;

            let bounding = [0.09, 0.540, 0.98, 0.76];
            let boundingPixel = [22, 208, 252, 289];

            let pos = document.getElementsByTagName("canvas")[0].getBoundingClientRect()

            delta[0] /= pos.width;
            delta[1] /= pos.height;

            let xRate = (boundingPixel[2] - boundingPixel[0]) / (bounding[2] - bounding[0])
            let yRate = (boundingPixel[3] - boundingPixel[1]) / (bounding[3] - bounding[1])

            delta[0] *= xRate;
            delta[1] *= yRate;

            for (let i = 0; i < drawHistory.length; i++) {
                if (!(drawHistory[i].x == 0 && drawHistory[i].y == 0)) {
                    drawHistory[i].x = drawHistory[i].x + delta[0]
                    drawHistory[i].y = drawHistory[i].y + delta[1]
                }
            }

            drawDrawing()

        }, 10);

    }

    let DrawingInterval = setInterval(function () {
        if (!playerData.name.includes("[✬]")) {
            playerData.name = playerData.name + " [✬]"
        }

        if (isDrawing != LastDrawingState) {
            LastDrawingState = isDrawing
            if (LastDrawingState == true) {
                // Mouse Down Is Drawing
                RedoList = []
            } else {
                GetUndoSplicePos()
                UndoPoints.unshift(UndoSplicePos)
            }
        }

        if (!isDrawing) {
            CustomToolDrawHistory = drawHistory
        }

        let lastItem = null
        if (CurrentCustomTool != null) {
            if (CurrentCustomTool == "line") {
                if (!lastItem) {
                    lastItem = drawHistory[drawHistory.length - 1]
                    if (lastItem.type != 0)
                        lastItem = null
                }
                if (isDrawing) {
                    if (lastItem != null) {
                        drawHistory.splice(CustomToolDrawHistory.length)
                        drawHistory.push({ x: mousePos.x, y: mousePos.y, type: 0 })
                    }
                    drawDrawing();
                } else {
                    lastItem = null
                }
            }

            if (CurrentCustomTool == "square") {
                if (!lastItem) {
                    lastItem = drawHistory[CustomToolDrawHistory.length - 1]
                    if (lastItem.type != 2)
                        lastItem = null
                }
                if (isDrawing) {
                    if (lastItem != null) {
                        drawHistory.splice(CustomToolDrawHistory.length)
                        drawHistory.push({ x: lastItem.x, y: mousePos.y, type: 0, i: true })
                        drawHistory.push({ x: mousePos.x, y: mousePos.y, type: 0, i: true })
                        drawHistory.push({ x: mousePos.x, y: lastItem.y, type: 0, i: true })
                        drawHistory.push({ x: lastItem.x, y: lastItem.y, type: 0, i: true })
                        drawHistory.push({ x: 0, y: 0, type: 1, i: true })
                    }
                    drawDrawing();
                } else {
                    lastItem = null
                }
            }
            if (CurrentCustomTool == "circle") {
                if (!lastItem) {
                    lastItem = drawHistory[CustomToolDrawHistory.length - 1]
                    if (lastItem.type != 2)
                        lastItem = null
                }
                if (isDrawing) {
                    if (lastItem != null) {
                        drawHistory.splice(CustomToolDrawHistory.length)
                        let TopLeft = [(lastItem.x < mousePos.x ? lastItem.x : mousePos.x), (lastItem.y < mousePos.y ? lastItem.y : mousePos.y)]
                        let BottomRight = [(lastItem.x > mousePos.x ? lastItem.x : mousePos.x), (lastItem.y > mousePos.y ? lastItem.y : mousePos.y)]
                        let CircleCoords = generateEllipsePoints(TopLeft, BottomRight, 32)
                        drawHistory.push({ x: 0, y: 0, type: 1, i: true })
                        drawHistory.push({ x: Number(CircleCoords[0][0]), y: Number(CircleCoords[0][1]), type: 2, i: true })
                        for (let i = 1; i < CircleCoords.length; i++) {
                            drawHistory.push({ x: Number(CircleCoords[i][0]), y: Number(CircleCoords[i][1]), type: 0, i: true })
                        }
                        drawHistory.push({ x: Number(CircleCoords[0][0]), y: Number(CircleCoords[0][1]), type: 0, i: true })
                        drawHistory.push({ x: 0, y: 0, type: 1, i: true })
                    }
                    drawDrawing();
                } else {
                    lastItem = null
                }
            }
        } else {
            let newHistory = []
            let isRgb = false
            window.rgbClock = 0
            for (let i = 0; i < drawHistory.length; i++) {
                let action = drawHistory[i];
                newHistory.push(action)
                let newInd = newHistory.length - 1
                switch (action.type) {
                    case 0: {
                        //pc_sprites.drawing.lineTo(action.x, action.y);
                        if (isRgb) {
                            window.rgbClock = (window.rgbClock + 12) % 360
                            if (!action.m && window.overrideRGB) {
                                newHistory.push({ x: 0, y: 0, type: 1, m: true, i: true })
                                newHistory.push({ x: 0, y: 1000, type: 2, m: true, i: true })
                                while ((window.targetRGB + (12 * 29)) % 360 != window.rgbClock) {
                                    window.rgbClock = (window.rgbClock + 12) % 360
                                    console.log(window.rgbClock)
                                    newHistory.push({ x: 0, y: 1000, type: 0, m: true, i: true })
                                }
                                newHistory.push({ x: 0, y: 0, type: 1, m: true, i: true })
                                newHistory.push({ x: action.x, y: action.y, type: 2, m: true, i: true })
                                newHistory.push({ x: action.x, y: action.y, type: 0, m: true, i: true })
                            }//pc_sprites.drawing.rainbowDeg = (pc_sprites.drawing.rainbowDeg + 12) % 360;
                        }
                        break;
                    }
                    case 6: {
                        isRgb = false
                        break;
                    }
                    case 7: {
                        isRgb = true
                        break;
                    }
                }
                newHistory[newInd].m = true
            }
            drawHistory = newHistory
        }
    }, 1)

    // WebSocket Hooker
    let websocketHookInterval = setInterval(function () {
        if (websocket) {
            console.log("%c Hooked Websocket", 'font-size: 18px; color: #4feaff')

            websocket.onopen = new Proxy(websocket.onopen, {
                apply(target, thisArgs, args) {
                    let res = null;
                    if (WebsocketOpen(args[0]))
                        res = Reflect.apply(...arguments)

                    return res;
                }
            });
            websocket.onmessage = new Proxy(websocket.onmessage, {
                apply(target, thisArgs, args) {
                    let res = null;
                    let canDo = WebsocketMessage(args[0])
                    if (canDo[0]) {
                        args[0] = canDo[1]
                        console.log(args[0])
                        res = Reflect.apply(...arguments)
                    }

                    return res;
                }
            });
            websocket.send = new Proxy(websocket.send, {
                apply(target, thisArgs, args) {
                    let res = null;
                    let canDo = WebsocketSend(args[0])
                    if (canDo[0]) {
                        args[0] = canDo[1]
                        res = Reflect.apply(...arguments)
                    }

                    return res;
                }
            });

            clearInterval(websocketHookInterval);
        }
    }, 100)

    function InsensitiveSort(a, b) {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    }

    function AdjustColor(color, amount) {
        return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
    }

    function WebsocketOpen(event) {
        console.log("%c Websocket Connected", 'font-size: 18px; color: #4feaff')
        console.log(event)
        return true;
    }

    let awaitingList = false
    let playerList = []
    let blockedPlayers = []
    function WebsocketMessage(event) {
        try {
            if (event.data !== "ping") {
                let oldScrollPos;
                let obj = JSON.parse(event.data);
                console.log(obj)

                switch (obj.type) {
                    case "sv_roomData": {
                        console.log("FETCHING")
                        awaitingList = true
                        websocket.send(JSON.stringify({
                            "type": "cl_sendMessage",
                            "message": {
                                "player": playerData,
                                "drawing": [
                                    {
                                        "x": 0,
                                        "y": 0,
                                        "type": 3
                                    }
                                ],
                                "textboxes": [
                                    {
                                        "text": "!list",
                                        "x": 113,
                                        "y": 211
                                    }
                                ],
                                "lines": 1
                            }
                        }))
                        break;
                    }
                    case "sv_receivedMessage": {
                        // Account for Player List Message
                        if (obj.message.player.name == "[SERVER]") {
                            let tboxes = obj.message.textboxes
                            let fulltext = ""
                            for (let i = 0; i < tboxes.length; i++) {
                                fulltext = fulltext + tboxes[i].text
                            }

                            if (awaitingList && !fulltext.startsWith("Your room code")) {
                                awaitingList = false
                                let splitList = fulltext.split(" ; ")
                                playerList = []
                                for (let i = 0; i < splitList.length; i++) {
                                    playerList.push({
                                        name: splitList[i],
                                        color: -1
                                    })
                                }
                                playerList = playerList.sort(InsensitiveSort)
                                RebuildActiveUsers()
                                return [false, event];
                            } else {
                                if (fulltext.startsWith("Unblocked: ")) {
                                    // UNBLOCK USER
                                    let userToBlock = fulltext.replace("Unblocked: ", "")
                                    let ind = blockedPlayers.indexOf(userToBlock)
                                    if (ind > -1) {
                                        blockedPlayers.splice(ind, 1)
                                    }
                                }
                                else if (fulltext.startsWith("Blocked: ")) {
                                    // BLOCK USER
                                    let userToBlock = fulltext.replace("Blocked: ", "")
                                    if (!blockedPlayers.includes(userToBlock)) {
                                        blockedPlayers.push(userToBlock)
                                    }
                                }
                            }
                        } else {
                            let ind = playerList.findIndex(x => x.name == obj.message.player.name)
                            if (ind > -1) {
                                playerList[ind].color = obj.message.player.color
                            }

                            if (blockedPlayers.includes(obj.message.player.name))
                                return [false, event];
                        }
                        RebuildActiveUsers()
                        // Badge
                        if (obj.gato.badge) {
                            obj.message.player.name = obj.message.player.name + " [✬]"
                        }
                        break;
                    }
                    case "sv_playerLeft": {
                        let ind = playerList.findIndex(x => x.name == obj.player.name)
                        if (ind > -1) {
                            playerList.splice(ind, 1)
                        }
                        playerList = playerList.sort(InsensitiveSort)
                        RebuildActiveUsers()
                        break;
                    }
                    case "sv_playerJoined": {
                        playerList.push({
                            name: obj.player.name,
                            color: obj.player.color
                        })
                        playerList = playerList.sort(InsensitiveSort)
                        RebuildActiveUsers()
                        break;
                    }
                    default: {

                    }
                }
                event = new MessageEvent("message", {
                    data: JSON.stringify(obj)
                })
                return [true, event];
            }
        } catch (err) {

        }
        return [true, event];
    }

    function WebsocketSend(sentContent) {
        try {
            let obj = JSON.parse(sentContent)
            console.log(obj)
            if (obj.type == "cl_leaveRoom") {
                playerList = []
                RebuildActiveUsers()
            }
            if (obj.type == "cl_sendMessage") {
                let tboxes = obj.message.textboxes
                let fulltext = ""
                for (let i = 0; i < tboxes.length; i++) {
                    fulltext = fulltext + tboxes[i].text
                }
                if (fulltext.startsWith("!block") || fulltext.startsWith("!unblock") || fulltext.startsWith("!ignore") || fulltext.startsWith("!unignore")) {
                    console.log("Intercept Block")
                    let userToBlock = fulltext.replace("!block ", "").replace("!unblock ", "").replace("!ignore ", "").replace("!unignore ", "")
                    let ind = blockedPlayers.indexOf(userToBlock)
                    if (ind > -1) {
                        blockedPlayers.splice(ind, 1)
                        ReceiveFakeMessage({
                            "drawing": [
                                {
                                    "x": 0,
                                    "y": 0,
                                    "type": 3
                                }
                            ],
                            "textboxes": [
                                {
                                    "x": 113,
                                    "y": 211,
                                    "text": "Unblocked: " + userToBlock
                                }
                            ],
                            "lines": 1,
                            "player": {
                                "name": "[PICTOTOOLS]",
                                "color": 51356
                            }
                        })
                    } else {
                        blockedPlayers.push(userToBlock)
                        ReceiveFakeMessage({
                            "drawing": [
                                {
                                    "x": 0,
                                    "y": 0,
                                    "type": 3
                                }
                            ],
                            "textboxes": [
                                {
                                    "x": 113,
                                    "y": 211,
                                    "text": "Blocked: " + userToBlock
                                }
                            ],
                            "lines": 1,
                            "player": {
                                "name": "[PICTOTOOLS]",
                                "color": 51356
                            }
                        })
                    }
                    return [false, JSON.stringify(obj)];
                }
                obj.gato = {
                    "badge": true
                }
                return [true, JSON.stringify(obj)];
            }
        } catch (err) {

        }
        return [true, sentContent];
    }

    // Fake Messages
    function ReceiveFakeMessage(message) {
        websocket.onmessage({
            "data": JSON.stringify({
                "type": "sv_receivedMessage",
                "message": message
            })
        })
    }

    // Player List
    function ToggleBlock(userToBlock) {
        websocket.send(JSON.stringify({
            "type": "cl_sendMessage",
            "message": {
                "player": playerData,
                "drawing": [
                    {
                        "x": 0,
                        "y": 0,
                        "type": 3
                    }
                ],
                "textboxes": [
                    {
                        "text": "!block " + userToBlock,
                        "x": 113,
                        "y": 211
                    }
                ],
                "lines": 1
            }
        }))
    }

    function RebuildActiveUsers() {
        PlayersSection.innerHTML = `
            <div style="display:flex; width:100%; margin-top: 4px; padding-bottom: 4px;border-bottom:2px solid #242424">
                <span style="font-size:18px;">Total Online</span>
                <span style="font-size:18px;margin-left:auto;margin-right:0;">${playerList.length}/16</span>
            </div>
        `;
        playerList.sort(InsensitiveSort)
        for (let i = 0; i < playerList.length; i++) {
            let newUserHolder = document.createElement("div")
            newUserHolder.style = "display:flex; width:100%; margin-top: 4px"
            PlayersSection.appendChild(newUserHolder)

            if (playerList[i].name == playerData.name || playerList[i].name == playerData.name.replace(" [✬]", "")) {
                playerList[i].color = playerData.color
            }

            let newUserText = document.createElement("div")
            let lightCol = new String(playerList[i].color.toString(16)).toUpperCase().padStart(6, '0')
            let darkCol = AdjustColor(lightCol, -50)
            newUserText.style = `font-size:18px;margin-left:auto;margin-right:0;color:${(playerList[i].color != -1 ? `#${lightCol}` : "auto")};text-shadow:${(playerList[i].color != -1 ? ` 0.1em 0.1em ${darkCol}` : "auto")};`
            newUserText.textContent = playerList[i].name
            if (blockedPlayers.includes(playerList[i].name)) {
                newUserText.innerHTML = "<s>" + playerList[i].name + "</s>"
                newUserText.style.opacity = 0.3
            }

            if (playerList[i].name == playerData.name || playerList[i].name == playerData.name.replace(" [✬]", "")) {
                newUserText.innerHTML = `<span style="color:#777">(YOU) </span>` + playerList[i].name
                newUserText.style.textShadow = "0.1em 0.1em #444"
            } else {
                newUserText.style.cursor = "pointer"
                newUserText.onclick = () => {
                    ToggleBlock(playerList[i].name)
                }
            }

            newUserHolder.appendChild(newUserText)
        }
    }

    // Canvas Enabler
    let checkIntervalCanvas = setInterval(function () {
        if (document.getElementsByTagName("canvas").length > 0) {
            createBotGUI();
            BotStatus.className = "Enabled"
            BotStatus.textContent = "Enabled"
            console.log("%c Started Pictobot", 'font-size: 18px; color: #4feaff')
            clearInterval(checkIntervalCanvas);
        }
    }, 100)

    let inputBlockInterval = setInterval(function () {
        if (window.onkeydown) {
            window.onkeydown = new Proxy(window.onkeydown, {
                apply(target, thisArgs, args) {
                    if (document.activeElement.tagName.toLowerCase() == "input") {
                        return;
                    }

                    return Reflect.apply(...arguments);
                }
            });
            clearInterval(inputBlockInterval);
        }
    }, 100)

    // Save Load Messages
    let SavedMessages = JSON.parse(localStorage.getItem("SavedMessages") || "[]");
    let SaveNewMessage = document.getElementById("SaveNewMessage")
    let SaveMessageName = document.getElementById("SaveMessageName")
    let DeleteSavedMessage = document.getElementById("DeleteSavedMessage")
    let SavedMessagesDropdown = document.getElementById("SavedMessagesDropdown")
    let LoadMessageButton = document.getElementById("LoadMessageButton")

    function UpdateSavedMessages() {
        SavedMessages = JSON.parse(localStorage.getItem("SavedMessages") || "[]");

        console.log(SavedMessages)

        SavedMessagesDropdown.innerHTML = `<option value="-1" selected disabled>Select...</option>`
        for (let i = 0; i < SavedMessages.length; i++) {
            let newSelect = document.createElement("option")
            newSelect.value = i
            newSelect.textContent = SavedMessages[i].name
            SavedMessagesDropdown.appendChild(newSelect)
        }
    }
    UpdateSavedMessages()

    LoadMessageButton.onclick = () => {
        let SelValue = parseInt(SavedMessagesDropdown.value)
        if (SelValue >= 0) {
            let ClonedPost = SavedMessages[SelValue]
            console.log(ClonedPost)

            drawHistory = []
            for (let i = 0; i < ClonedPost.drawing.length; i++) {
                let value = {
                    x: ClonedPost.drawing[i].x + (pc_sprites.box.x / SCALE) * 0,
                    y: ClonedPost.drawing[i].y + (pc_sprites.box.y / SCALE) * 0,
                    type: ClonedPost.drawing[i].type
                };
                drawHistory.push(value);
            }

            for (let i = 0; i < ClonedPost.textboxes.length; i++) {
                let txt = ClonedPost.textboxes[i];
                let tb = new PIXI.BitmapText(txt.text, { font: '10px NintendoDSBIOS', align: 'center', tint: 0 });
                tb.x = txt.x;
                tb.y = txt.y;
                pc_sprites.textboxes.push(tb);
                app.stage.addChild(pc_sprites.textboxes[pc_sprites.textboxes.length - 1]);
            }
            selectedTextbox = 0;
            drawHistory.push({ x: 0, y: 0, type: 3 });
            drawHistory.push({ x: 0, y: 0, type: 5 });
            drawHistory = cleanupDrawing(drawHistory)

            scaleStage();
            drawDrawing();
        }
    }

    DeleteSavedMessage.onclick = () => {
        let SelValue = parseInt(SavedMessagesDropdown.value)
        if (SelValue >= 0) {
            SavedMessages.splice(SelValue, 1);

            localStorage.setItem("SavedMessages", JSON.stringify(SavedMessages))

            UpdateSavedMessages()
        }
    }

    SaveNewMessage.onclick = () => {
        console.log("%c Saving New Message", 'font-size: 18px; color: #4feaff')
        if (SaveMessageName.value.length > 0) {
            // Make sure no other saved message shares this name
            for (let i = 0; i < SavedMessages.length; i++) {
                if (SavedMessages[i].name.toLowerCase() == SaveMessageName.value.toLowerCase()) {
                    return;
                }
            }

            // No Dupes? Good we fuckin tonite :33333
            let textBoxes = []
            for (let i = 0; i < pc_sprites.textboxes.length; i++) {
                if (pc_sprites.textboxes[i].text !== "") {
                    let tbObj = {
                        text: pc_sprites.textboxes[i].text,
                        x: pc_sprites.textboxes[i].x / SCALE,
                        y: pc_sprites.textboxes[i].y / SCALE
                    };
                    textBoxes.push(tbObj);
                }
            }

            SavedMessages.push({
                name: SaveMessageName.value,
                drawing: cleanupDrawing(drawHistory),
                textboxes: textBoxes
            });

            localStorage.setItem("SavedMessages", JSON.stringify(SavedMessages))

            UpdateSavedMessages()
        }
    }

    // Onion-skin
    let OnionSkinFileUpload = document.getElementById("onionSkinUpload")
    let RemoveOnionSkin = document.getElementById("RemoveOnionSkin")
    let OnionOpacityText = document.getElementById("OnionOpacity")
    let CurrentOnionSkin = null;
    let CurrentOnionCanvas = null;
    let OnionOpacity = 0.5
    let OnionX = 0;
    let OnionY = 0;
    let OnionScale = 1;

    let OnionMoveButton = document.getElementById("OnionMoveButton")
    let OnionScaleButton = document.getElementById("OnionScaleButton")
    let OnionOpacButton = document.getElementById("OnionOpacButton")

    RemoveOnionSkin.onclick = () => {
        if (CurrentOnionCanvas) {
            CurrentOnionSkin = null;
            CurrentOnionCanvas.remove();
            CurrentOnionCanvas = null;
        };
    }

    OnionMoveButton.onmousedown = () => {

        if (CurrentOnionCanvas == null) return;

        let previousPos = [mouseX, mouseY];

        let interval = setInterval(() => {

            if (mousedown == false) {
                clearInterval(interval);
                return;
            }

            let newPos = [mouseX, mouseY];
            let delta = [newPos[0] - previousPos[0], newPos[1] - previousPos[1]];
            previousPos = newPos;

            let bounding = [0.09, 0.540, 0.98, 0.76];
            let boundingPixel = [22, 208, 252, 289];

            let pos = document.getElementsByTagName("canvas")[0].getBoundingClientRect()

            delta[0] /= pos.width;
            delta[1] /= pos.height;

            let xRate = (boundingPixel[2] - boundingPixel[0]) / (bounding[2] - bounding[0])
            let yRate = (boundingPixel[3] - boundingPixel[1]) / (bounding[3] - bounding[1])

            delta[0] *= xRate;
            delta[1] *= yRate;

            OnionX += delta[0];
            OnionY -= delta[1];

            moveOnionSkin()

        }, 100);

    }

    OnionScaleButton.onmousedown = () => {

        if (CurrentOnionCanvas == null) return;

        let previousPos = [mouseX, mouseY];

        let interval = setInterval(() => {

            if (mousedown == false) {
                clearInterval(interval);
                return;
            }

            let newPos = [mouseX, mouseY];
            let delta = [newPos[0] - previousPos[0], newPos[1] - previousPos[1]];
            previousPos = newPos;

            let bounding = [0.09, 0.540, 0.98, 0.76];
            let boundingPixel = [22, 208, 252, 289];

            let pos = document.getElementsByTagName("canvas")[0].getBoundingClientRect()

            delta[0] /= pos.width;
            delta[1] /= pos.height;

            let xRate = (boundingPixel[2] - boundingPixel[0]) / (bounding[2] - bounding[0])
            let yRate = (boundingPixel[3] - boundingPixel[1]) / (bounding[3] - bounding[1])

            delta[0] *= xRate;
            delta[1] *= yRate;

            let scaleFactor = 1 - delta[1] / 80;

            if (scaleFactor < 0.75) scaleFactor = 0.75;
            if (scaleFactor > 1.25) scaleFactor = 1.25;

            OnionScale *= scaleFactor
            if (OnionScale < 0.05) OnionScale = 0.05;

            moveOnionSkin()

        }, 100);

    }

    OnionOpacButton.onmousedown = () => {

        if (CurrentOnionCanvas == null) return;

        let previousPos = [mouseX, mouseY];

        let interval = setInterval(() => {

            if (mousedown == false) {
                clearInterval(interval);
                return;
            }

            let newPos = [mouseX, mouseY];
            let delta = [newPos[0] - previousPos[0], newPos[1] - previousPos[1]];
            previousPos = newPos;

            let bounding = [0.09, 0.540, 0.98, 0.76];
            let boundingPixel = [22, 208, 252, 289];

            let pos = document.getElementsByTagName("canvas")[0].getBoundingClientRect()

            delta[0] /= pos.width;
            delta[1] /= pos.height;

            let xRate = (boundingPixel[2] - boundingPixel[0]) / (bounding[2] - bounding[0])
            let yRate = (boundingPixel[3] - boundingPixel[1]) / (bounding[3] - bounding[1])

            delta[0] *= xRate;
            delta[1] *= yRate;

            let scaleFactor = 1 - delta[1] / 20;

            if (scaleFactor < 0.75) scaleFactor = 0.75;
            if (scaleFactor > 1.25) scaleFactor = 1.25;

            OnionOpacity *= scaleFactor
            if (OnionOpacity < 0) OnionOpacity = 0;
            if (OnionOpacity > 1) OnionOpacity = 1;

            moveOnionSkin()

        }, 100);

    }

    OnionSkinFileUpload.onchange = function (event) {
        var files = event.target.files;
        if (files && files.length > 0) {
            var reader = new FileReader();
            reader.readAsDataURL(files[0])
            reader.onload = function (e) {
                CurrentOnionSkin = new Image();
                CurrentOnionSkin.onload = function () {
                    console.log("%c Changed Onion-skin", 'font-size: 18px; color: #4feaff')
                    drawOnionSkin();
                }
                CurrentOnionSkin.src = e.target.result;
            }
        }
    };

    function moveOnionSkin() {
        if (CurrentOnionCanvas) {
            CurrentOnionCanvas.style.bottom = OnionY + "px"
            CurrentOnionCanvas.style.left = `calc(50% + ${OnionX}px)`
            CurrentOnionCanvas.style.opacity = OnionOpacity
            CurrentOnionCanvas.style.transform = `translate(-50%, 50%) scale(${OnionScale}, ${OnionScale})`
            OnionOpacityText.textContent = Math.round(OnionOpacity * 1000) / 1000
        }
    }

    function drawOnionSkin() {
        if (!CurrentOnionSkin)
            return;

        if (CurrentOnionCanvas) {
            CurrentOnionCanvas.remove()
        }

        CurrentOnionCanvas = document.createElement("canvas");

        CurrentOnionCanvas.width = CurrentOnionSkin.width;
        CurrentOnionCanvas.height = CurrentOnionSkin.height;

        OnionScale = 1

        OnionX = 0;
        OnionY = CurrentOnionCanvas.height / 2;

        let ctx = CurrentOnionCanvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(CurrentOnionSkin, 0, 0, CurrentOnionCanvas.width, CurrentOnionCanvas.height);

        document.getElementById("root").appendChild(CurrentOnionCanvas)

        CurrentOnionCanvas.style = "position: absolute;pointer-events:none;z-index:50;"

        moveOnionSkin()
    }

    // Port of Pictobot
    //
    // made by oeci, not me!!! I just added Userscript support!!!
    let PictobotSection = document.getElementById("PictobotSection")
    let BotStatus = document.getElementById("BotStatus")
    let BrightnessAmount = document.getElementById("BrightnessAmount")
    let ContrastAmount = document.getElementById("ContrastAmount")

    let pixelX = null;
    let pixelY = null;
    let pixelWidth = null;
    let pixelHeight = null;
    let powerFactor = 1;
    let brightness = 1;
    let pixels = 3000;

    function createBotGUI() {

        let move = document.createElement("button");
        let scale = document.createElement("button");
        let bright = document.createElement("button");
        let powUp = document.createElement("button");
        let powDown = document.createElement("button");
        let pixelCount = document.createElement("button");

        move.innerHTML = "Move";
        scale.innerHTML = "Scale";
        bright.innerHTML = "Gamma";
        powUp.innerHTML = "Contrast Up";
        powDown.innerHTML = "Contrast Down";
        pixelCount.innerHTML = "Resolution: " + pixels;

        let parent = document.createElement("div");

        let buttons = [scale, bright, move, powUp, powDown, pixelCount];

        let ref = document.getElementsByTagName("canvas")[0].getBoundingClientRect();

        let fontSize = 15;
        let widthRef = ref.width;

        let buttonWidth = widthRef / 7;

        for (var i = 0; i < buttons.length; i++) {

            parent.appendChild(buttons[i]);
            buttons[i].style.width = "33%"
            buttons[i].style.height = buttonWidth + "px"
            buttons[i].style.fontSize = fontSize + "px"
            buttons[i].style.verticalAlign = "top";
            buttons[i].style.background = "url('../images/intro_bg.png') no-repeat";
            buttons[i].style.backgroundSize = "750px"
            buttons[i].style.cursor = "pointer"
            buttons[i].style.fontFamily = "nds"

        }

        parent.style.display = "flex";
        parent.style.zIndex = "100";
        parent.style.width = "100%";
        parent.style.flexDirection = "row";
        parent.style.marginTop = "4px";
        parent.style.flexWrap = "wrap";

        powUp.onmousedown = () => {

            if (theimage == null) return;

            powerFactor++;
            powUptext()
            doDrawing();

        }

        powDown.onmousedown = () => {

            if (theimage == null) return;

            powerFactor--;
            if (powerFactor < 1) powerFactor = 1
            powUptext()
            doDrawing();

        }

        function powUptext() {
            ContrastAmount.textContent = powerFactor;
        }

        move.onmousedown = () => {

            if (theimage == null) return;

            let previousPos = [mouseX, mouseY];

            let interval = setInterval(() => {

                if (mousedown == false) {
                    clearInterval(interval);
                    return;
                }

                let newPos = [mouseX, mouseY];
                let delta = [newPos[0] - previousPos[0], newPos[1] - previousPos[1]];
                previousPos = newPos;

                let bounding = [0.09, 0.540, 0.98, 0.76];
                let boundingPixel = [22, 208, 252, 289];

                let pos = document.getElementsByTagName("canvas")[0].getBoundingClientRect()

                delta[0] /= pos.width;
                delta[1] /= pos.height;

                let xRate = (boundingPixel[2] - boundingPixel[0]) / (bounding[2] - bounding[0])
                let yRate = (boundingPixel[3] - boundingPixel[1]) / (bounding[3] - bounding[1])

                delta[0] *= xRate;
                delta[1] *= yRate;

                pixelX += delta[0];
                pixelY += delta[1];

                doDrawing()

            }, 100);

        }

        scale.onmousedown = () => {

            if (theimage == null) return;

            let previousPos = [mouseX, mouseY];

            let interval = setInterval(() => {

                if (mousedown == false) {
                    clearInterval(interval);
                    return;
                }

                let newPos = [mouseX, mouseY];
                let delta = [newPos[0] - previousPos[0], newPos[1] - previousPos[1]];
                previousPos = newPos;

                let bounding = [0.09, 0.540, 0.98, 0.76];
                let boundingPixel = [22, 208, 252, 289];

                let pos = document.getElementsByTagName("canvas")[0].getBoundingClientRect()

                delta[0] /= pos.width;
                delta[1] /= pos.height;

                let xRate = (boundingPixel[2] - boundingPixel[0]) / (bounding[2] - bounding[0])
                let yRate = (boundingPixel[3] - boundingPixel[1]) / (bounding[3] - bounding[1])

                delta[0] *= xRate;
                delta[1] *= yRate;

                pixelWidth += delta[1];
                pixelHeight = pixelWidth * theimage.width / theimage.height;

                doDrawing()

            }, 100);

        }

        bright.onmousedown = () => {

            if (theimage == null) return;

            let previousPos = [mouseX, mouseY];

            let interval = setInterval(() => {

                if (mousedown == false) {
                    clearInterval(interval);
                    return;
                }

                let newPos = [mouseX, mouseY];
                let delta = [newPos[0] - previousPos[0], newPos[1] - previousPos[1]];
                previousPos = newPos;

                let bounding = [0.09, 0.540, 0.98, 0.76];
                let boundingPixel = [22, 208, 252, 289];

                let pos = document.getElementsByTagName("canvas")[0].getBoundingClientRect()

                delta[0] /= pos.width;
                delta[1] /= pos.height;

                let xRate = (boundingPixel[2] - boundingPixel[0]) / (bounding[2] - bounding[0])
                let yRate = (boundingPixel[3] - boundingPixel[1]) / (bounding[3] - bounding[1])

                delta[0] *= xRate;
                delta[1] *= yRate;

                let scaleFactor = 1 + delta[1] / 20;

                if (scaleFactor < 0.75) scaleFactor = 0.75;
                if (scaleFactor > 1.25) scaleFactor = 1.25;

                brightness *= scaleFactor;
                if (brightness < 0.05) brightness = 0.05;

                BrightnessAmount.textContent = Math.round(((1 - brightness) + 1) * 1000) / 1000

                doDrawing()

            }, 100);

        }

        pixelCount.onmousedown = () => {

            if (theimage == null) return;

            let previousPos = [mouseX, mouseY];

            let interval = setInterval(() => {

                if (mousedown == false) {
                    clearInterval(interval);
                    return;
                }

                let newPos = [mouseX, mouseY];
                let delta = [newPos[0] - previousPos[0], newPos[1] - previousPos[1]];
                previousPos = newPos;

                let bounding = [0.09, 0.540, 0.98, 0.76];
                let boundingPixel = [22, 208, 252, 289];

                let pos = document.getElementsByTagName("canvas")[0].getBoundingClientRect()

                delta[0] /= pos.width;
                delta[1] /= pos.height;

                let xRate = (boundingPixel[2] - boundingPixel[0]) / (bounding[2] - bounding[0])
                let yRate = (boundingPixel[3] - boundingPixel[1]) / (bounding[3] - bounding[1])

                delta[0] *= xRate;
                delta[1] *= yRate;

                pixels += delta[1] * 50;
                pixels = Math.floor(pixels);
                if (pixels < 100) pixels = 100;
                pixelCount.innerHTML = "Resolution: " + pixels;

                doDrawing()

            }, 100);

        }


        PictobotSection.appendChild(parent)
    }

    function doDrawing() {

        if (theimage == null) return;

        drawImage(pixelX, pixelY, pixelWidth, pixelHeight, theimage, brightness, powerFactor, pixels);
        drawDrawing();

    }


    let pixelPrecision = 1000;

    let drawImage = (posx, posy, poswidth, posheight, img, brightness, powerFactor, maxPixels) => {

        drawHistory = [{
            x: 0,
            y: 0,
            type: 3
        }]

        let canvas = document.createElement("canvas");

        let pixelscale = Math.sqrt(maxPixels / (img.width * img.height))
        let width = Math.floor(img.width * pixelscale);
        let height = Math.floor(img.height * pixelscale);

        canvas.width = width;
        canvas.height = height;

        let ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;

        let scale = poswidth / width;

        for (var y = 0; y < canvas.height; y++) {

            for (var x = 0; x < canvas.width; x++) {

                let index = (y * canvas.width + x) * 4;

                if (data[index + 3] == 0) continue;

                let darkness = (data[index] + data[index + 1] + data[index + 2]) / 3

                darkness = -darkness + 255;

                let length = darkness / 255;

                length = length ** powerFactor;
                length *= brightness;

                if (length > 1) length = 1;

                let PoffsetX = (1 - length) / 2;
                let PoffsetX2 = 1 - (1 - length) / 2

                let PoffsetY = PoffsetX;
                let PoffsetY2 = PoffsetX2;

                if ((x + y) % 2 == 1) [PoffsetX, PoffsetX2] = [PoffsetX2, PoffsetX];

                let p1 = {
                    x: (x + PoffsetX) * scale + posx,
                    y: (y + PoffsetY) * scale + posy,
                    type: 2
                };
                let p2 = {
                    x: (x + PoffsetX2) * scale + posx,
                    y: (y + PoffsetY2) * scale + posy,
                    type: 0
                }

                p1.x = Math.floor(p1.x * pixelPrecision) / pixelPrecision;
                p1.y = Math.floor(p1.y * pixelPrecision) / pixelPrecision;
                p2.x = Math.floor(p2.x * pixelPrecision) / pixelPrecision;
                p2.y = Math.floor(p2.y * pixelPrecision) / pixelPrecision;

                drawHistory.push(p1)
                drawHistory.push(p2)

            }

        }


    }

    let mousedown = false;


    let theimage = null;
    window.addEventListener("dragover", function (e) {
        e = e || event;
        e.preventDefault();
    });

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener("drop", function (e) {
        e = e || event;
        e.preventDefault();

        for (var i = 0; i < e.dataTransfer.items.length; i++) {

            let item = e.dataTransfer.items[i];
            if (item.kind == "file") {
                var blob = item.getAsFile();
                var reader = new FileReader();
                reader.onload = function (event) {

                    theimage = new Image();
                    theimage.src = event.target.result;
                    theimage.crossOrigin = "Anonymous";
                    theimage.style.position = "absolute";
                    theimage.style.width = "400px";

                    theimage.onload = () => {

                        let bounding = [0.09, 0.540, 0.98, 0.76];
                        let boundingPixel = [22, 208, 252, 289];

                        let pos = document.getElementsByTagName("canvas")[0].getBoundingClientRect()

                        let dX = (mouseX - pos.x) / pos.width;
                        let dY = (mouseY - pos.y) / pos.height;

                        pixelX = 30
                        pixelY = 210;

                        let width = parseInt(theimage.style.width) / pos.width;

                        pixelWidth = 100;
                        pixelHeight = Math.floor(theimage.height * pixelWidth / theimage.width);

                        doDrawing()

                    }

                };
                reader.readAsDataURL(blob);
            }

        }

    }, false);

    window.addEventListener("paste", function (e) {


        var items = (event.clipboardData || event.originalEvent.clipboardData).items;

        for (index in items) {
            var item = items[index];
            if (item.kind === 'file') {
                var blob = item.getAsFile();
                var reader = new FileReader();
                reader.onload = function (event) {

                    theimage = new Image();
                    theimage.src = event.target.result;
                    theimage.crossOrigin = "Anonymous";
                    theimage.style.position = "absolute";
                    theimage.style.width = "400px";

                    theimage.onload = () => {

                        let bounding = [0.09, 0.540, 0.98, 0.76];
                        let boundingPixel = [22, 208, 252, 289];

                        let pos = document.getElementsByTagName("canvas")[0].getBoundingClientRect()

                        let dX = (mouseX - pos.x) / pos.width;
                        let dY = (mouseY - pos.y) / pos.height;

                        pixelX = 30
                        pixelY = 210;

                        let width = parseInt(theimage.style.width) / pos.width;

                        pixelWidth = 100;
                        pixelHeight = Math.floor(theimage.height * pixelWidth / theimage.width);

                        doDrawing()

                    }



                }; // data url!
                reader.readAsDataURL(blob);
            }
        }

    });



    window.addEventListener("mousemove", function (e) {

        mouseX = e.clientX;
        mouseY = e.clientY;

    }, false);

    window.addEventListener("mousedown", () => {

        mousedown = true;

    })

    window.addEventListener("mouseup", () => {

        mousedown = false;

    })

    window.addEventListener("keyup", function (e) {

        if (theimage != null) {

            let char = String.fromCharCode(e.keyCode);

            if (char == "S") {

                let currWidth = parseInt(theimage.style.width.replace("px", ""));
                currWidth += 30;
                theimage.style.width = currWidth + "px";
            }
            if (char == "W") {

                let currWidth = parseInt(theimage.style.width.replace("px", ""));
                currWidth -= 30;
                theimage.style.width = currWidth + "px";
            }

            e.preventDefault();

        }


    })

    function cleanupDrawing(drawing) {
        let fard = '';
        for (let i = 0; i < drawing.length; i++) {
            fard += drawing[i].type;
        }
        fard = fard.replace(/([34]+)([34])|([567]+)([567])/g, (_, a, b, c, d) => '_'.repeat((a ? a : c).length) + (b ? b : d));
        let prev = 5;
        let prev2 = null;
        return drawing.filter((v, i) => {
            if (fard[i] === '_') return false;
            if (v.type === prev || v.type === prev2) return false;
            if (v.type === 3 || v.type === 4) {
                prev2 = v.type;
            } else if (v.type === 5 || v.type === 6 || v.type === 7) {
                prev = v.type;
            }
            return true;
        });
    }

    function drawDrawing() {
        pc_sprites.drawing.clear();
        pc_sprites.drawing.drawMode = 0;
        pc_sprites.drawing.rainbowDeg = 0;
        for (let i = 0; i < drawHistory.length; i++) {
            let action = drawHistory[i];
            switch (action.type) {
                case 0: {
                    pc_sprites.drawing.lineTo(action.x, action.y);
                    if (pc_sprites.drawing.drawMode === 0xffffff) pc_sprites.drawing.rainbowDeg = (pc_sprites.drawing.rainbowDeg + 12) % 360;
                    break;
                }
                case 1: {
                    pc_sprites.drawing.moveTo(action.x, action.y);
                    break;
                }
                case 2: {
                    pc_sprites.drawing.moveTo(action.x, action.y);
                    break;
                }
                case 3: {
                    pc_sprites.drawing.drawWidth = 2;
                    break;
                }
                case 4: {
                    pc_sprites.drawing.drawWidth = 1;
                    break;
                }
                case 5: {
                    pc_sprites.drawing.drawMode = 0;
                    break;
                }
                case 6: {
                    pc_sprites.drawing.drawMode = 0xfbfbfb;
                    break;
                }
                case 7: {
                    pc_sprites.drawing.drawMode = 0xffffff;
                    break;
                }
            }
            if (pc_sprites.drawing.drawMode === 0xffffff) {
                pc_sprites.drawing.lineStyle(pc_sprites.drawing.drawWidth, hsl2rgb2dec(pc_sprites.drawing.rainbowDeg, 1, 0.5));
            } else {
                pc_sprites.drawing.lineStyle(pc_sprites.drawing.drawWidth + ((pc_sprites.drawing.drawMode > 0) * (pc_sprites.drawing.drawWidth === 2)), pc_sprites.drawing.drawMode);
            }
        }
    }
})();
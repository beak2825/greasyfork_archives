// ==UserScript==
// @name         Gats.io-BuildOutliner
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  Tool for aligning build in gats.io
// @author       Medbay3medic
// @match        https://gats.io
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544508/Gatsio-BuildOutliner.user.js
// @updateURL https://update.greasyfork.org/scripts/544508/Gatsio-BuildOutliner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Settings
    const KeyToggleOutline = 'Q';
    const KeyToggleGUI = 'E';
    const KeyToggleBinocular = 'F';
    const KeyToggleExGUI = 'Z';
    const KeyToggleExMode = 'X';
    const KeyIncreaseSize = 'O';
    const KeyDecreaseSize = 'P';
    const KeyIncreasePos = 'K';
    const KeyDecreasePos = 'L';
    const KeyIncreaseAngle = 'I';
    const KeyDecreaseAngle = 'U';
    const KeyToggleOverlap = 'I';
    const KeyToggleGradient = 'I';
    const KeyBuild = ' '
    const BlockSize = 45;
    const BlockColorPrimary = '#00ffff';
    const BlockColorSecondary = '#9400d3';
    const BlockColorTertiary = '#f3b3c3';
    const BlockOutlineWidth = 1;
    const BlockDistanceFromCharacter = 55;
    const CharacterSize = 24;
    const ScreenMouseOffsetRatio = 1/12.5;
    const CharacterLeftHandInset = 5;
    const BinocularScaleRatio = 0.95;
    const CrosshairSize = 10;
    const CrosshairColor = '#00ffff';
    const CrosshairColorCircumcentre = '#9400d3';
    const SlantedDirectionStep = 15;
    const ModeNone = 0;
    const ModeGrid = 1;
    const ModeSlanted = 2;
    const ModeCircle = 3;
    const ModeCustom = 4;
    const GridSizeMax = 5;
    const SlantedSizeMin = 1;
    const SlantedSizeMax = 9;
    let SlantedSize = 5;
    let SlantedPosition = Math.floor(SlantedSize / 2);
    const CircleSizeMin = 1;
    const CircleSizeMax = 9;
    let CircleSize = 2;
    let CirclePos = 1;
    let CircleSquares = [];
    let IsCircleOverlapping = false;
    let CustomPos = 1;
    let CustomSquares = [];
    let IsGradientActive = true;
    let IsOutline = false;
    let IsBinocular = false;
    let Mode = ModeNone;
    let AnimationID = null;
    let IsGUIActive = true;
    let IsExGUIActive = false;
    let SlantedDirection = 0;
    let GridSizeIndex = 2;
    let GridSize = GridSizeIndex * 2 - 1;
    let GridCentrePos = (GridSize - 1) / 2;
    let GridXPos = GridCentrePos;
    let GridYPos = GridCentrePos;
    let IsKeysActive = true;
    let ScreenXPos = window.innerWidth / 2;
    let ScreenYPos = window.innerHeight / 2;
    let MouseXPos = window.innerWidth / 2;
    let MouseYPos = window.innerHeight / 2;
    document.addEventListener("mousemove", function(e) {
        MouseXPos = e.clientX;
        MouseYPos = e.clientY;
    });
    let IsChatLoopActive = false;
    const ChatLoopTextLength = 28;
    const ChatLoopText = 'MedieBot Building------!!Do Not Disturb!!------';
    const ChatLoopSpeed = 100;
    let ChatLoopIndex = 0;
    const CDBarWidth = 20;
    const CDBarYPos = 675;
    const CDBarLength = 900;
    const CDBarColor = 'rgba(255, 165, 0, 0.5)';
    const CDBarBackgroundColor = 'rgba(128, 128, 128, 0.5)';
    const CDBarDuration = 7500;
    let CDBarStartTime = 0;
    let IsCDBarActive = false;
    let CDBarAnimationID = null;
    const CDBarCanvas = document.createElement('canvas');
    const CDBarContext = CDBarCanvas.getContext('2d');
    CDBarCanvas.style.position = 'fixed';
    CDBarCanvas.style.top = '0';
    CDBarCanvas.style.left = '0';
    CDBarCanvas.style.width = '100%';
    CDBarCanvas.style.height = '100%';
    CDBarCanvas.style.pointerEvents = 'none';
    CDBarCanvas.style.zIndex = '9998';
    CDBarCanvas.style.display = IsGUIActive ? 'block' : 'none';
    document.body.appendChild(CDBarCanvas);
    const MainCanvas = document.createElement('canvas');
    const MainContext = MainCanvas.getContext('2d');
    MainCanvas.style.position = 'fixed';
    MainCanvas.style.top = '0';
    MainCanvas.style.left = '0';
    MainCanvas.style.width = '100%';
    MainCanvas.style.height = '100%';
    MainCanvas.style.pointerEvents = 'none';
    MainCanvas.style.zIndex = '9999';
    MainCanvas.style.display = 'none';
    document.body.appendChild(MainCanvas);
    const GUIDiv = document.createElement('div');
    document.body.appendChild(GUIDiv);
    const ExGUIDiv = document.createElement('div');
    document.body.appendChild(ExGUIDiv);
    let MedbayFileContent;
    let MedbayFile;
    let MedbayFileName = 'None';

    // Functions

    function ResizeCanvas() {
        MainCanvas.width = window.innerWidth;
        MainCanvas.height = window.innerHeight;
        CDBarCanvas.width = window.innerWidth;
        CDBarCanvas.height = window.innerHeight;
        ScreenXPos = MainCanvas.width / 2;
        ScreenYPos = MainCanvas.height / 2;
    }

    // Copied from Gats.io- Chat scroller by nitrogem35 hehe

    function ChatLoop() {
        if (!IsChatLoopActive) return;
        let displayText = ChatLoopText.substring(ChatLoopIndex, ChatLoopIndex + ChatLoopTextLength);
        if (displayText.length < ChatLoopTextLength) {
            displayText += ChatLoopText.substring(0, ChatLoopTextLength - displayText.length);
        }

        let ChatLoopOutput = displayText.split('');

        ChatLoopOutput = ChatLoopOutput.join("");
        //encode commas (,) as tilde (~) because gats client does that
        ChatLoopOutput = ChatLoopOutput.replaceAll(",", "~");
        Connection.list[0].socket.send(`c,${ChatLoopOutput}`);

        ChatLoopIndex = (ChatLoopIndex + 1) % ChatLoopText.length;

        setTimeout(ChatLoop, ChatLoopSpeed);
    }

    function StartChatLoop() {
        IsChatLoopActive = true;
        ChatLoop();
    }

    function StopChatLoop() {
        IsChatLoopActive = false;
    }

    function ToggleChatLoop() {
        if (IsChatLoopActive) {
            StopChatLoop();
        } else {
            StartChatLoop();
        }
        ExGUI();
    }

    function GUI() {
        GUIDiv.innerHTML = `
        <style>
            .main {
                pointer-events: none;
                position: fixed;
                z-index: 9999;
                top: 210px;
                left: 10px;
                font-family: 'arial';
                color: pink;
                font-size: 15px;
                background-color: rgba(1,1,1,0.5);
                padding: 10px;
                border-radius: 5px;
                display: ${IsGUIActive ? 'block' : 'none'};
            }
            .key {
                color: #9400d3;
            }
            .status {
                color: #9400d3;
            }
            .Keys-Button {
                pointer-events: auto;
                cursor: pointer;
                background-color: rgba(148, 0, 211, 0.7);
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 3px;
                margin: 5px 0;
                font-family: 'arial';
                font-size: 14px;
                width: 100%;
                text-align: center;
            }
            .Keys-Button:hover {
                background-color: rgba(148, 0, 211, 0.9);
            }
        </style>
        <div class="main">
            <p>Medbay3medic's BuildOutliner Mod ^ ̳⩌ ̫ ⩌ ̳^</p>
            <button class="Keys-Button">${IsKeysActive ? 'Disable Keys' : 'Enable Keys'}</button>
            <br>"<span class="key">${KeyToggleOutline}</span>" to toggle outline</br>
            <br>"<span class="key">${KeyToggleGUI}</span>" to toggle GUI</br>
            <br>"<span class="key">${KeyToggleBinocular}</span>" to toggle Binocular mode</br>
            <br>"<span class="key">${KeyToggleExGUI}</span>" to toggle Extension</br>
            <br>Current mode: "<span class="status">${IsOutline ? 'On' : 'Off'}</span>"</br>
            <br>Binocular mode: "<span class="status">${IsBinocular ? 'On' : 'Off'}</span>"</br>
            <br>Extension: "<span class="status">${IsExGUIActive ? 'On' : 'Off'}</span>"</br>
            <br>Keys: "<span class="status">${IsKeysActive ? 'Enabled' : 'Disabled'}</span>"</br>
            <br><3 Thank You So Much For Using My Script! <3</br>
        </div>`;

        const KeysButton = GUIDiv.querySelector('.Keys-Button');
        KeysButton.addEventListener('click', () => {
            IsKeysActive = !IsKeysActive;
            GUI();
            ExGUI();
        });
    }

    function ExGUI() {
        let ModeText, ModeKeys;
        switch(Mode) {
            case ModeGrid:
                ModeText = `Grid (${GridSize}x${GridSize})`;
                ModeKeys = `
                <br>"<span class="key">${KeyIncreaseSize}</span>"/"<span class="key">${KeyDecreaseSize}</span>" to adjust grid size</br>
                <br>"<span class="key">${KeyIncreasePos}</span>"/"<span class="key">${KeyDecreasePos}</span>" to adjust X position (${GridXPos})</br>
                <br>"<span class="key">${KeyIncreaseAngle}</span>"/"<span class="key">${KeyDecreaseAngle}</span>" to adjust Y position (${GridYPos})</br>
            `;
                break;
            case ModeSlanted:
                ModeText = `Slanted Line (${SlantedDirection}°, ${SlantedSize} squares)`;
                ModeKeys = `
                <br>"<span class="key">${KeyIncreaseSize}</span>"/"<span class="key">${KeyDecreaseSize}</span>" to adjust line length (${SlantedSize})</br>
                <br>"<span class="key">${KeyIncreasePos}</span>"/"<span class="key">${KeyDecreasePos}</span>" to adjust position (${SlantedPosition})</br>
                <br>"<span class="key">${KeyIncreaseAngle}</span>"/"<span class="key">${KeyDecreaseAngle}</span>" to adjust angle</br>
            `;
                break;
            case ModeCircle:
                ModeText = `Circle (R:${CircleSize})`;
                ModeKeys = `
                <br>"<span class="key">${KeyIncreaseSize}</span>"/"<span class="key">${KeyDecreaseSize}</span>" to adjust radius</br>
                <br>"<span class="key">${KeyIncreasePos}</span>"/"<span class="key">${KeyDecreasePos}</span>" to adjust position</br>
                <br>"<span class="key">${KeyToggleOverlap}</span>" to toggle overlapping (${IsCircleOverlapping ? 'ON' : 'OFF'})</br>
                <br>Position: ${CirclePos} of ${CircleSquares.length}</br>
            `;
                break;
            case ModeCustom:
                ModeText = `Custom File: ${MedbayFileName}`;
                ModeKeys = `
                <br>"<span class="key">${KeyIncreasePos}</span>"/"<span class="key">${KeyDecreasePos}</span>" to adjust position</br>
                <br>"<span class="key">${KeyToggleGradient}</span>" to toggle gradient (${IsGradientActive ? 'ON' : 'OFF'})</br>
                <br>Position: ${CustomPos} of ${CustomSquares.length}</br>
            `;
                break;
            default:
                ModeText = 'None';
                ModeKeys = '';
        }

        ExGUIDiv.innerHTML = `
    <style>
        .extension {
            pointer-events: none;
            position: fixed;
            z-index: 9999;
            top: 250px;
            right: 10px;
            font-family: 'arial';
            color: pink;
            font-size: 15px;
            background-color: rgba(1,1,1,0.5);
            padding: 10px;
            border-radius: 5px;
            display: ${IsExGUIActive ? 'block' : 'none'};
        }
        .extension-header {
            color: pink;
            font-size: 15px;
            margin-bottom: 5px;
        }
        .key {
            color: #9400d3;
        }
        .status {
            color: #9400d3;
        }
        .action-button {
            pointer-events: auto;
            cursor: pointer;
            background-color: rgba(148, 0, 211, 0.7);
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            margin: 5px 0;
            font-family: 'arial';
            font-size: 14px;
            width: 100%;
            text-align: center;
        }
        .action-button:hover {
            background-color: rgba(148, 0, 211, 0.9);
        }
        .chatloop-button {
            background-color: ${IsChatLoopActive ? 'rgba(255, 0, 0, 0.7)' : 'rgba(148, 0, 211, 0.7)'} !important;
        }
        .chatloop-button:hover {
            background-color: ${IsChatLoopActive ? 'rgba(255, 0, 0, 0.9)' : 'rgba(148, 0, 211, 0.9)'} !important;
        }
        .medbay-result {
            color: #9400d3;
            font-weight: bold;
            margin: 0 0 5px 0;
            text-align: center;
            font-size: 14px;
        }
    </style>
    <div class="extension">
        <div class="extension-header">Medbay3medic's BuildOutliner Mod ^ ̳⩌ ̫ ⩌ ̳^</div>

        <button class="action-button" id="medbayButton">Input .medbay File</button>
        <input type="file" id="MedbayFileContent" accept=".medbay" style="display:none">

        <button class="action-button chatloop-button" id="chatLoopButton">
            ${IsChatLoopActive ? 'Stop Chat Scroll' : 'Start Chat Scroll'}
        </button>

        <br>Extension GUI</br>
        <br>"<span class="key">${KeyToggleExMode}</span>" to toggle mode</br>
        <br>Mode: "<span class="status">${ModeText}</span>"</br>
        ${ModeKeys}
    </div>`;

        document.getElementById('chatLoopButton').addEventListener('click', ToggleChatLoop);

        document.getElementById('medbayButton').addEventListener('click', () => {
            document.getElementById('MedbayFileContent').click();
        });

        document.getElementById('MedbayFileContent').addEventListener('change', (e) => {
            MedbayFile = e.target.files[0];
            if (!MedbayFile || !MedbayFile.name.endsWith('.medbay')) {
                showFileError();
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    MedbayFileContent = event.target.result.trim();
                    MedbayFileName = MedbayFile.name;
                    if (!CalculateCustomSquares()) {
                        return;
                    }
                    ExGUI();
                } catch (error) {
                    showFileError();
                }
            };
            reader.onerror = () => {
                showFileError();
            };
            reader.readAsText(MedbayFile);
        });
    }


    function CalculateCircleSquares() {
        CircleSquares = [];
        const CircleSquarePoints = [];
        if (IsCircleOverlapping) {
            let sides = (CircleSize + 1) * 8;
            for (let i = 0; i < sides; i++) {
                const angle = (i / sides) * Math.PI * 2;
                const x = Math.cos(angle) * CircleSize;
                const y = Math.sin(angle) * CircleSize;
                CircleSquarePoints.push({x: x, y: y});
            }
        } else {
            let sides = (CircleSize + 1) * 4;
            for (let i = 0; i < sides; i++) {
                const angle = (i / sides) * Math.PI * 2;
                const x = Math.cos(angle) * CircleSize;
                const y = Math.sin(angle) * CircleSize;
                CircleSquarePoints.push({x: x, y: y});
            }
        }
        CircleSquarePoints.sort((a, b) => {
            if (Math.abs(a.y - b.y) > 0.0001) {
                return a.y - b.y;
            }
            return a.x - b.x;
        });

        CircleSquares = CircleSquarePoints;
        CirclePos = Math.max(1, Math.min(CirclePos, CircleSquares.length));
    }

    function CalculateCustomSquares() {
        try {
            const MedbayFormat = /^Medbay3medicBuiltOutlinerCode:({\(\d{3}\.\d{3}\)\(\d{3}\.\d{3}\)\(\d\)})+$/;
            if (!MedbayFormat.test(MedbayFileContent)) {
                throw new Error("Invalid file format");
            }

            CustomSquares = [];
            const CustomSquarePoints = [];
            const pointRegex = /\((\d{3}\.\d{3})\)\((\d{3}\.\d{3})\)\((\d)\)/g;
            let match;
            while ((match = pointRegex.exec(MedbayFileContent)) !== null) {
                CustomSquarePoints.push({
                    x: match[1],
                    y: match[2],
                    gradient: match[3]
                });
            }
            CustomSquares = CustomSquarePoints;
            CustomPos = 1;
            if (Mode === ModeCustom && IsOutline) {
                Draw();
            }
            return true;
        } catch (error) {
            showFileError();
            return false;
        }
    }

    function showFileError() {
        const button = document.getElementById('medbayButton');
        if (!button) return;

        const originalText = button.textContent;
        const originalBackground = button.style.backgroundColor;
        const fileInput = document.getElementById('MedbayFileContent');
        fileInput.value = '';
        button.textContent = 'Error! Invalid file!';
        button.style.backgroundColor = '#ff3333';
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = originalBackground;
        }, 2000);
    }

    function DrawCDBar() {
        CDBarContext.clearRect(0, 0, CDBarCanvas.width, CDBarCanvas.height);
        if (!IsGUIActive) return;
        const CDBarRemaining = (CDBarCanvas.width - CDBarLength) / 2;
        CDBarContext.fillStyle = CDBarColor;
        CDBarContext.fillRect(CDBarRemaining, CDBarYPos, CDBarLength, CDBarWidth);
        let CDBarRemainingTime = 0;
        let IsCDBarReady = false;

        if (IsCDBarActive) {
            const CurrentTime = Date.now();
            const CDBarTimeElapsed = CurrentTime - CDBarStartTime;
            const CDBarProgress = Math.min(CDBarTimeElapsed / CDBarDuration, 1);
            CDBarRemainingTime = (CDBarDuration - CDBarTimeElapsed) / 1000;

            CDBarContext.fillStyle = CDBarBackgroundColor;
            CDBarContext.fillRect(
                CDBarRemaining + (CDBarLength * CDBarProgress),
                CDBarYPos,
                CDBarLength * (1 - CDBarProgress),
                CDBarWidth
            );

            if (CDBarProgress >= 1) {
                IsCDBarActive = false;
                IsCDBarReady = true;
            }
        }

        CDBarContext.fillStyle = 'white';
        CDBarContext.font = '16px Arial';
        CDBarContext.textAlign = 'left';
        CDBarContext.textBaseline = 'middle';

        const statusText = IsCDBarReady ? 'Ready' : `Build CD: ${CDBarRemainingTime > 0 ? CDBarRemainingTime.toFixed(2) + 's' : 'Ready'}`;
        CDBarContext.fillText(
            statusText,
            CDBarRemaining + 10,
            CDBarYPos + CDBarWidth / 2
        );

        CDBarAnimationID = requestAnimationFrame(DrawCDBar);
    }

    function DrawGrid(SquareX, SquareY, Size) {
        const GridShiftX = (GridXPos - GridCentrePos) * Size;
        const GridShiftY = (GridYPos - GridCentrePos) * Size;

        MainContext.strokeStyle = BlockColorTertiary;
        MainContext.lineWidth = IsBinocular ? BlockOutlineWidth * BinocularScaleRatio : BlockOutlineWidth;

        for (let x = 0; x < GridSize; x++) {
            for (let y = 0; y < GridSize; y++) {
                if (x === GridXPos && y === GridYPos) continue;

                const GridX = SquareX + (x - GridCentrePos) * Size - GridShiftX;
                const GridY = SquareY + (y - GridCentrePos) * Size - GridShiftY;

                if (GridX >= 0 && GridX <= MainCanvas.width && GridY >= 0 && GridY <= MainCanvas.height) {
                    MainContext.strokeRect(
                        GridX - Size / 2,
                        GridY - Size / 2,
                        Size,
                        Size
                    );
                    DrawCrosshair(GridX, GridY, Size, BlockColorTertiary);
                }
            }
        }

        MainContext.strokeStyle = BlockColorPrimary;
        MainContext.strokeRect(
            SquareX - Size / 2,
            SquareY - Size / 2,
            Size,
            Size
        );
        DrawCrosshair(SquareX, SquareY, Size, BlockColorPrimary);
    }

    function DrawSlantedLine(SquareX, SquareY, Size) {
        const SlantedCentrePosition = (SlantedSize - 1)/2;
        const SlantedAngleRadian = SlantedDirection * Math.PI / 180;
        const CosAngle = Math.cos(SlantedAngleRadian);
        const SinAngle = Math.sin(SlantedAngleRadian);

        const SlantedPosOffset = (SlantedPosition - SlantedCentrePosition) * Size;
        const OffsetX = SlantedPosOffset * CosAngle;
        const OffsetY = SlantedPosOffset * SinAngle;

        MainContext.strokeStyle = BlockColorTertiary;
        MainContext.lineWidth = IsBinocular ? BlockOutlineWidth * BinocularScaleRatio : BlockOutlineWidth;

        for (let i = 0; i < SlantedSize; i++) {
            if (i === SlantedPosition) continue;

            const Distance = (i - SlantedCentrePosition) * Size;
            const GridX = SquareX + Distance * CosAngle - OffsetX;
            const GridY = SquareY + Distance * SinAngle - OffsetY;

            MainContext.strokeRect(
                GridX - Size / 2,
                GridY - Size / 2,
                Size,
                Size
            );

            DrawCrosshair(GridX, GridY, Size, BlockColorTertiary);
        }

        MainContext.strokeStyle = BlockColorPrimary;
        MainContext.strokeRect(
            SquareX - Size / 2,
            SquareY - Size / 2,
            Size,
            Size
        );

        DrawCrosshair(SquareX, SquareY, Size, BlockColorPrimary);
    }

    function DrawCircle(SquareX, SquareY, Size) {
        if (CircleSquares.length === 0) return;

        const TargetSquare = CirclePos >= 1 && CirclePos <= CircleSquares.length
        ? CircleSquares[CirclePos - 1]
        : {x: 0, y: 0};

        const OffsetX = SquareX - TargetSquare.x * Size;
        const OffsetY = SquareY - TargetSquare.y * Size;

        MainContext.strokeStyle = BlockColorTertiary;
        MainContext.lineWidth = IsBinocular ? BlockOutlineWidth * BinocularScaleRatio : BlockOutlineWidth;

        for (let i = 0; i < CircleSquares.length; i++) {
            if (i === CirclePos - 1) continue;

            const Square = CircleSquares[i];
            const GridX = OffsetX + Square.x * Size;
            const GridY = OffsetY + Square.y * Size;

            if (IsCircleOverlapping) {
                MainContext.globalAlpha = 0.7;
            }

            MainContext.strokeRect(
                GridX - Size / 2,
                GridY - Size / 2,
                Size,
                Size
            );

            if (IsCircleOverlapping) {
                MainContext.globalAlpha = 1.0;
            }

            DrawCrosshair(GridX, GridY, Size, BlockColorTertiary);
        }

        MainContext.strokeStyle = BlockColorPrimary;
        MainContext.strokeRect(
            SquareX - Size / 2,
            SquareY - Size / 2,
            Size,
            Size
        );

        DrawCrosshair(OffsetX, OffsetY, Size, CrosshairColorCircumcentre);
        DrawCrosshair(SquareX, SquareY, Size, BlockColorPrimary);
    }

    function DrawCustom(SquareX, SquareY, Size) {
        if (CustomSquares.length === 0) return;

        const TargetSquare = CustomPos >= 1 && CustomPos <= CustomSquares.length
        ? CustomSquares[CustomPos - 1]
        : {x: 0, y: 0, gradient: 0};

        const OffsetX = SquareX - parseFloat(TargetSquare.x) * Size;
        const OffsetY = SquareY - parseFloat(TargetSquare.y) * Size;

        MainContext.strokeStyle = BlockColorTertiary;
        MainContext.lineWidth = IsBinocular ? BlockOutlineWidth * BinocularScaleRatio : BlockOutlineWidth;
        const gradientColors = [
            '#53c68c',
            '#79d2a6',
            '#9fdfbf',
            '#c6ecd9',
            '#ecf9f2'
        ];

        for (let i = 0; i < CustomSquares.length; i++) {
            if (i === CustomPos - 1) continue;

            const Square = CustomSquares[i];
            const GridX = OffsetX + parseFloat(Square.x) * Size;
            const GridY = OffsetY + parseFloat(Square.y) * Size;

            MainContext.strokeRect(
                GridX - Size / 2,
                GridY - Size / 2,
                Size,
                Size
            );
            if (IsGradientActive) {
                const bgSize = Size * 0.5;
                const gradient = Math.min(parseInt(Square.gradient), 4);
                MainContext.fillStyle = gradientColors[gradient];
                MainContext.fillRect(
                    GridX - bgSize / 2,
                    GridY - bgSize / 2,
                    bgSize,
                    bgSize
                );

                MainContext.fillStyle = 'black';
                MainContext.font = `${Size * 0.4}px Arial`;
                MainContext.textAlign = 'center';
                MainContext.textBaseline = 'middle';
                MainContext.fillText(Square.gradient, GridX, GridY);
            } else {
                DrawCrosshair(GridX, GridY, Size, BlockColorTertiary);
            }
        }

        MainContext.strokeStyle = BlockColorPrimary;
        MainContext.strokeRect(
            SquareX - Size / 2,
            SquareY - Size / 2,
            Size,
            Size
        );

        if (IsGradientActive) {
            const bgSize = Size * 0.5;
            const gradient = Math.min(parseInt(TargetSquare.gradient), 4);
            MainContext.fillStyle = gradientColors[gradient];
            MainContext.fillRect(
                SquareX - bgSize / 2,
                SquareY - bgSize / 2,
                bgSize,
                bgSize
            );

            MainContext.fillStyle = 'black';
            MainContext.font = `${Size * 0.4}px Arial`;
            MainContext.textAlign = 'center';
            MainContext.textBaseline = 'middle';
            MainContext.fillText(TargetSquare.gradient, SquareX, SquareY);
        } else {
            DrawCrosshair(SquareX, SquareY, Size, BlockColorPrimary);
        }

        DrawCrosshair(OffsetX, OffsetY, Size, CrosshairColorCircumcentre);
    }


    function DrawCrosshair(x, y, Size, Color) {
        const CurrentCrosshairSize = IsBinocular ? CrosshairSize * BinocularScaleRatio : CrosshairSize;
        const CrosshairHalfSize = CurrentCrosshairSize / 2;
        const CrosshairLineWidth = IsBinocular ? BlockOutlineWidth * BinocularScaleRatio : BlockOutlineWidth;

        MainContext.strokeStyle = Color;
        MainContext.lineWidth = CrosshairLineWidth;

        MainContext.beginPath();
        MainContext.moveTo(x - CrosshairHalfSize, y);
        MainContext.lineTo(x + CrosshairHalfSize, y);
        MainContext.stroke();

        MainContext.beginPath();
        MainContext.moveTo(x, y - CrosshairHalfSize);
        MainContext.lineTo(x, y + CrosshairHalfSize);
        MainContext.stroke();
    }

    function Draw() {
        MainContext.clearRect(0, 0, MainCanvas.width, MainCanvas.height);

        if (!IsOutline) return;

        MainContext.save();

        if (IsBinocular) {
            MainContext.translate(MainCanvas.width/2, MainCanvas.height/2);
            MainContext.scale(BinocularScaleRatio, BinocularScaleRatio);
            MainContext.translate(-MainCanvas.width/2, -MainCanvas.height/2);
        }

        const ScaleMultiplier = IsBinocular ? 1/BinocularScaleRatio : 1;
        const MouseXDistance = (MouseXPos - ScreenXPos) * ScaleMultiplier;
        const MouseYDistance = (MouseYPos - ScreenYPos) * ScaleMultiplier;
        const OffsetX = -MouseXDistance * ScreenMouseOffsetRatio;
        const OffsetY = -MouseYDistance * ScreenMouseOffsetRatio;
        const CharacterX = ScreenXPos + OffsetX;
        const CharacterY = ScreenYPos + OffsetY;

        MainContext.strokeStyle = BlockColorSecondary;
        MainContext.lineWidth = IsBinocular ? BlockOutlineWidth * BinocularScaleRatio : BlockOutlineWidth;
        MainContext.beginPath();
        MainContext.arc(CharacterX, CharacterY,
                        IsBinocular ? CharacterSize * BinocularScaleRatio : CharacterSize,
                        0, Math.PI * 2);
        MainContext.stroke();

        DrawCrosshair(CharacterX, CharacterY, CharacterSize, CrosshairColorCircumcentre);

        const MouseAngle = Math.atan2(MouseYPos - CharacterY, MouseXPos - CharacterX);
        const TangentAngle = MouseAngle - Math.PI/2;
        const CurrentCharacterRadius = IsBinocular ? CharacterSize * BinocularScaleRatio : CharacterSize;
        const TangentX = CharacterX + Math.cos(TangentAngle) * (CurrentCharacterRadius - CharacterLeftHandInset);
        const TangentY = CharacterY + Math.sin(TangentAngle) * (CurrentCharacterRadius - CharacterLeftHandInset);

        const OffsetAngle = Math.atan2(MouseYPos - TangentY, MouseXPos - TangentX);
        const CurrentDistanceFromCharacter = IsBinocular ? BlockDistanceFromCharacter * BinocularScaleRatio : BlockDistanceFromCharacter;
        const CurrentSquareX = CharacterX + Math.cos(OffsetAngle) * CurrentDistanceFromCharacter;
        const CurrentSquareY = CharacterY + Math.sin(OffsetAngle) * CurrentDistanceFromCharacter;
        const CurrentSquareSize = IsBinocular ? BlockSize * BinocularScaleRatio : BlockSize;

        if (Mode === ModeGrid) {
            DrawGrid(CurrentSquareX, CurrentSquareY, CurrentSquareSize);
        }
        else if (Mode === ModeSlanted) {
            DrawSlantedLine(CurrentSquareX, CurrentSquareY, CurrentSquareSize);
        }
        else if (Mode === ModeCircle) {
            DrawCircle(CurrentSquareX, CurrentSquareY, CurrentSquareSize);
        }
        else if (Mode === ModeCustom) {
            DrawCustom(CurrentSquareX, CurrentSquareY, CurrentSquareSize);
        }
        else {
            MainContext.strokeStyle = BlockColorPrimary;
            MainContext.lineWidth = IsBinocular ? BlockOutlineWidth * BinocularScaleRatio : BlockOutlineWidth;
            MainContext.strokeRect(
                CurrentSquareX - CurrentSquareSize / 2,
                CurrentSquareY - CurrentSquareSize / 2,
                CurrentSquareSize,
                CurrentSquareSize
            );
            DrawCrosshair(CurrentSquareX, CurrentSquareY, CurrentSquareSize, CrosshairColor);
        }

        MainContext.restore();
        AnimationID = requestAnimationFrame(Draw);
    }

    document.addEventListener('mousemove', (e) => {
        MouseXPos = e.clientX;
        MouseYPos = e.clientY;
    });

    function IsChatActive() {
        const ChatActiveElement = document.activeElement;
        return ChatActiveElement && (ChatActiveElement.tagName === 'INPUT' || ChatActiveElement.tagName === 'TEXTAREA');
    }

    document.addEventListener('keydown', (e) => {
        if (!IsKeysActive) return;
        if (IsChatActive()) return;

        const Key = e.key.toUpperCase();

        if (Key === KeyBuild) {
            e.preventDefault();
            if (!IsCDBarActive) {
                IsCDBarActive = true;
                CDBarStartTime = Date.now();
                if (!CDBarAnimationID) {
                    DrawCDBar();
                }
            }
            return;
        }

        if (Key === KeyToggleOutline) {
            IsOutline = !IsOutline;
            MainCanvas.style.display = IsOutline ? 'block' : 'none';
            if (IsOutline && !AnimationID) {
                Draw();
            } else if (!IsOutline && AnimationID) {
                cancelAnimationFrame(AnimationID);
                AnimationID = null;
            }
            GUI();
            ExGUI();
        }
        else if (Key === KeyToggleGUI) {
            IsGUIActive = !IsGUIActive;
            CDBarCanvas.style.display = IsGUIActive ? 'block' : 'none';
            GUIDiv.style.display = IsGUIActive ? 'block' : 'none';
            if (IsGUIActive && !CDBarAnimationID) {
                DrawCDBar();
            } else if (!IsGUIActive && CDBarAnimationID) {
                cancelAnimationFrame(CDBarAnimationID);
                CDBarAnimationID = null;
            }
        }
        else if (Key === KeyToggleBinocular) {
            IsBinocular = !IsBinocular;
            GUI();
            ExGUI();
        }
        else if (Key === KeyToggleExGUI) {
            IsExGUIActive = !IsExGUIActive;
            GUI();
            ExGUI();
        }
        else if (Key === KeyToggleExMode && IsExGUIActive) {
            Mode = (Mode + 1) % 5;
            ExGUI();
        }
        else if (IsExGUIActive) {
            if (Mode === ModeSlanted) {
                if (Key === KeyIncreaseAngle) {
                    SlantedDirection = (SlantedDirection + SlantedDirectionStep) % 360;
                    ExGUI();
                }
                else if (Key === KeyDecreaseAngle) {
                    SlantedDirection = (SlantedDirection - SlantedDirectionStep + 360) % 360;
                    ExGUI();
                }
                else if (Key === KeyIncreasePos) {
                    SlantedPosition = Math.min(SlantedPosition + 1, SlantedSize - 1);
                    ExGUI();
                }
                else if (Key === KeyDecreasePos) {
                    SlantedPosition = Math.max(SlantedPosition - 1, 0);
                    ExGUI();
                }
                else if (Key === KeyIncreaseSize) {
                    SlantedSize = Math.min(SlantedSize + 1, SlantedSizeMax);
                    SlantedPosition = Math.min(SlantedPosition, SlantedSize - 1);
                    ExGUI();
                }
                else if (Key === KeyDecreaseSize) {
                    SlantedSize = Math.max(SlantedSize - 1, SlantedSizeMin);
                    SlantedPosition = Math.min(SlantedPosition, SlantedSize - 1);
                    ExGUI();
                }
            }
            else if (Mode === ModeGrid) {
                if (Key === KeyIncreaseSize) {
                    GridSizeIndex = (GridSizeIndex % GridSizeMax) + 1
                    GridSize = GridSizeIndex * 2 - 1
                    GridXPos = Math.floor(GridSize / 2);
                    GridYPos = Math.floor(GridSize / 2);
                    ExGUI();
                }
                else if (Key === KeyDecreaseSize) {
                    GridSizeIndex = ((GridSizeIndex - 2 + GridSizeMax) % GridSizeMax) + 1
                    GridSize = GridSizeIndex * 2 - 1
                    GridXPos = Math.floor(GridSize / 2)
                    GridYPos = Math.floor(GridSize / 2)
                    ExGUI();
                }
                else if (Key === KeyIncreasePos) {
                    GridXPos = (GridXPos + 1) % GridSize;
                    ExGUI();
                }
                else if (Key === KeyDecreasePos) {
                    GridXPos = (GridXPos - 1 + GridSize) % GridSize;
                    ExGUI();
                }
                else if (Key === KeyIncreaseAngle) {
                    GridYPos = (GridYPos + 1) % GridSize;
                    ExGUI();
                }
                else if (Key === KeyDecreaseAngle) {
                    GridYPos = (GridYPos - 1 + GridSize) % GridSize;
                    ExGUI();
                }
            }
            else if (Mode === ModeCircle) {
                if (Key === KeyIncreaseSize) {
                    CircleSize = Math.min(CircleSize + 1, CircleSizeMax);
                    CirclePos = 1;
                    CalculateCircleSquares();
                    ExGUI();
                }
                else if (Key === KeyDecreaseSize) {
                    CircleSize = Math.max(CircleSize - 1, CircleSizeMin);
                    CirclePos = 1;
                    CalculateCircleSquares();
                    ExGUI();
                }
                else if (Key === KeyIncreasePos) {
                    CirclePos = (CirclePos % CircleSquares.length) + 1;
                    ExGUI();
                }
                else if (Key === KeyDecreasePos) {
                    CirclePos = (CirclePos - 2 + CircleSquares.length) % CircleSquares.length + 1;
                    ExGUI();
                }
                else if (Key === KeyToggleOverlap) {
                    IsCircleOverlapping = !IsCircleOverlapping;
                    CalculateCircleSquares();
                    ExGUI();
                }
            }
            else if (Mode === ModeCustom) {
                if (Key === KeyIncreasePos) {
                    CustomPos = (CustomPos % CustomSquares.length) + 1;
                    ExGUI();
                }
                else if (Key === KeyDecreasePos) {
                    CustomPos = (CustomPos - 2 + CustomSquares.length) % CustomSquares.length + 1;
                    ExGUI();
                }
                else if (Key === KeyToggleGradient) {
                    IsGradientActive = !IsGradientActive;
                    CalculateCustomSquares();
                    ExGUI();
                }
            }
        }
    });

    // Main

    window.addEventListener('resize', ResizeCanvas);
    ResizeCanvas();
    CalculateCircleSquares();
    GUI();
    ExGUI();
    if (IsGUIActive) {
        DrawCDBar();
    }
})();
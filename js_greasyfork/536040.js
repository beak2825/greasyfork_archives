// ==UserScript==
// @name         ♟-GabiBot-: Chess Bot And ModMenu!♟ 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  GabiBot is a ModMenu that lets you use stockfish to cheat on Chess.com with up to 3100Elo, GabiBot is one of the fastest out there, and can beat every chess bot.
// @author       GabiHarMotion
// @match        https://www.chess.com/play/*
// @match        https://www.chess.com/game/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chess.com
// @grant        none
// @antifeature  membership
// @downloadURL https://update.greasyfork.org/scripts/536040/%E2%99%9F-GabiBot-%3A%20Chess%20Bot%20And%20ModMenu%21%E2%99%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/536040/%E2%99%9F-GabiBot-%3A%20Chess%20Bot%20And%20ModMenu%21%E2%99%9F.meta.js
// ==/UserScript==
 
(async function() {
 
 
    setTimeout(async function(){
        alert("Stockfish Loaded!")
 
        var keyMenuWrap = document.createElement("div")
        keyMenuWrap.style=`
    font-family: monospace;
    border-radius: 1vh;
    z-index: 1000000;
    width: 300px;
    grid: none;display: grid;
    grid-template-columns: 70%;
    grid-template-rows: 30% 50% 15%;
    justify-content: center;
    height: 40%;
    position: absolute;
    border: 1px solid rgb(100 100 100);
    background: rgb(16, 16, 16);
    opacity: 0.98;
    user-select: none;
    max-width: 60vw;
    top: 100px;
    left: 100px;`
 
        keyMenuWrap.innerHTML=`
<a style="
color: white;
justify-self: center;
margin-top: 5%;
font-size: 15px;
">-GabiBot-</a>
<div style="text-align: center;font-size: 14px;">
<a onClick="window.open('https://link-hub.net/1346380/gabibot-key', '_blank').focus();" style="
color: #eeeeee;
font-weight: bold;
font-size: 16px;
text-decoration-line: underline;
 
">Click Me To Get The Key</a>
<input id="keyInput" placeholder="Key..." style="
margin: 7%;
outline: none;
color: #b0b0b0;
background: #202020;
height: 20%;
width: 90%;
font-size: 13px;
border: none;
border-radius: 0.3vw;
">
<button id="keyButton" style="
border: none;
width: 30%;
height: 20%;
font-size: 14px;
border-radius: 0.3vw;
background: #606060;
color: #c0c0c0;
">Enter</button>
</div>
<a id="keyResponse" style="
text-align: center;
align-self: center;
color: white;
 
"></a>
`
        document.body.appendChild(keyMenuWrap)
 
        async function startStockfish(key){
            var menuWrap = document.createElement("div")
            menuWrap.id="menuWrap"
            var menuWrapStyle = document.createElement("style")
            menuWrap.innerHTML=`
    <div id="topText">
        <a id="modTitle">-GabiBot-</a>
        <a>Ctrl+B To Hide</a>
    </div>
    <div id="itemsList">
        <div name="enableHack" class="listItem">
            <input class="checkboxMod" type="checkbox">
            <a class="itemDescription">Enable Hack: </a>
            <a class="itemState">Off</a>
        </div>
        <div name="autoMove" class="listItem">
            <input class="checkboxMod" type="checkbox">
            <a class="itemDescription">Auto Move:</a>
            <a class="itemState">Off</a>
        </div>
        <div name="botPower" class="listItem">
            <input min="1" max="15" value="12" class="rangeSlider" type="range">
            <a class="itemDescription">Bot Power:</a>
            <a class="itemState">12</a>
        </div>
        <div name="autoMoveSpeed" class="listItem">
            <input min="1" max="10" value="4" class="rangeSlider" type="range">
            <a class="itemDescription">Auto Move Speed:</a>
            <a class="itemState">3</a>
        </div>
        <div name="updateSpeed" class="listItem">
            <input min="1" max="10" value="8" class="rangeSlider" type="range">
            <a class="itemDescription">Update Speed:</a>
            <a class="itemState">8</a>
        </div>
        <div name="currentEvaluation" class="listItem">
            <a class="itemDescription">Current Evaluation:</a>
            <a class="itemState">-</a>
        </div>
        <div name="bestMove" class="listItem">
            <a class="itemDescription">Best Move:</a>
            <a class="itemState">-</a>
        </div>
        <div name="information" class="listItem">
            <a class="itemDescription">Information: </a>
            <a class="itemState">GabiHarMotion (1242 Elo)</a>
        </div>
    `
            menuWrapStyle.innerHTML=`
        #menuWrap {
            font-family: monospace;
            border-radius: 1vh;
            z-index: 1000000;
            grid: none;
            display: grid;
            grid-template-columns: 90%;
            grid-template-rows: 15% 85%;
            justify-content: center;
            width: 350px;
            height: 400px;
            position: absolute;
            border: 1px solid rgb(100 100 100);
            background: rgb(16, 16, 16);
            opacity: 0.98;
            user-select: none;
            max-width: 60vw;
            top: 100px;
            left: 100px;
        }
        #topText {
            width: 40%;
            justify-self: center;
            text-align: center;
        }
        #modTitle {
            color: white;
            justify-self: center;
            margin-bottom: 5%;
            font-size: 17px;
        }
        #itemsList{
            overflow-x: hidden;
        }
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-thumb {
            background: #888;
            height: 10px;
 
        }
 
 
        .listItem {
            display: flex;
            align-items: center;
            margin-bottom: 6%;
        }
        .checkboxMod {
            outline: #acacac 1px solid;
            vertical-align: middle;
            appearance: none;
            border-radius: 30%;
            height: 20px;
            width: 20px;
            top: 30%;
            background: #303030;
            margin-right: 5%;
        }
 
        .checkboxMod:checked {
            background-color: #808080;
        }
 
        .rangeSlider {
            -webkit-appearance: none;
            width: 45%;
            height: 15px;
            border-radius: 5px;
            background: #b0b0b0;
            outline: none;
            margin-right: 6%;
        }
        .rangeSlider::-webkit-slider-thumb {
            appearance: none;
            width: 17px;
            height: 17px;
            border-radius: 50%;
            background: #505050;
            cursor: pointer;
 
        }
        .itemDescription{
            color: white;
        }
        .itemState{
            color: white;
            margin-left: 3%;
        }`
            document.body.appendChild(menuWrap)
            document.body.appendChild(menuWrapStyle)
 
 
            window.hackEnabled = 0
            window.botPower = 12
            window.updateSpeed = 8
            window.autoMove = 0
            window.autoMoveSpeed = 4
            window.currentEvaluation = 0
            window.bestMove = ""
 
            var itemWrap = document.getElementById("menuWrap")
 
            function getElementByName(name,selector){return selector.querySelector(`[name="${name}"]`)}
            function getInputElement(element){return element.children[0]}
            function getStateElement(element){return element.children[element.children.length-1]}
 
            function modFunction(name,type,variable){
                var modElement = getElementByName(name,itemWrap)
                var modState = getStateElement(modElement)
                var modInput = getInputElement(modElement)
 
                if(type=="text"){
                    modState.innerHTML=eval(variable)
                }
                modInput.onmouseup=e=>{
                    if(e.button==0){
                        if(type=="checkbox"){
                            modState.innerHTML=["Off","On"][Number(!modInput.checked)]
                            eval(`${variable}=${!modInput.checked}`)
                        }
                        if(type=="range"){
                            modState.innerHTML=modInput.value
                            eval(`${variable}=${modInput.value}`)
                        }
                    }
                }
            }
 
            modFunction("enableHack","checkbox","window.hackEnabled")
            modFunction("autoMove","checkbox","window.autoMove")
 
            modFunction("botPower","range","window.botPower")
            modFunction("autoMoveSpeed","range","window.autoMoveSpeed")
            modFunction("updateSpeed","range","window.updateSpeed")
 
            function updateTexts(){
                modFunction("currentEvaluation","text","window.currentEvaluation");
                modFunction("bestMove","text","window.bestMove");
                modFunction("information","text","`${context.user.username} (${context.user.rating} Elo)`");
            }
 
 
            var board = document.querySelector('.board');
            var drawingBoard = document.createElement("canvas");
            var drawingBoardCTX = drawingBoard.getContext("2d");
 
 
            drawingBoard.width=board.clientWidth;
            drawingBoard.height=board.clientHeight;
            board.appendChild(drawingBoard);
 
            function clear(){
                drawingBoardCTX.clearRect(0,0,board.clientWidth,board.clientHeight)
            }
 
            async function executeAction(bestmove){
 
                if(board.game.getPlayingAs()==2){
                    drawingBoard.style.rotate="180deg"
                }else{
                    drawingBoard.style.rotate="0deg"
                }
                clear()
 
                console.log(bestmove)
                bestmove = bestmove.split(" ")[1]
 
                var tileSize = (drawingBoard.clientWidth/8)
                var letters = ["a","b","c","d","e","f","g","h"];
                var position = "%s".replaceAll(' ','');
                var x1 = letters.indexOf(bestmove[0])+1;
                var y1 = 9-Number(bestmove[1]);
                var x2 = letters.indexOf(bestmove[2])+1;
                var y2 = 9-Number(bestmove[3]);
 
                drawingBoardCTX.beginPath();
                drawingBoardCTX.moveTo(x1*tileSize-(tileSize/2),y1*tileSize-(tileSize/2));
                drawingBoardCTX.lineTo(x2*tileSize-(tileSize/2),y2*tileSize-(tileSize/2));
                drawingBoardCTX.lineWidth=tileSize/5;
                drawingBoardCTX.strokeStyle="#00ff0050";
                drawingBoardCTX.stroke();
 
 
                if(window.autoMove){
                    setTimeout(function(){
                        var legalMoves = game.getLegalMoves()
                        for(var i=0;i<legalMoves.length;i++){
                            if(legalMoves[i].from==bestmove.split("")[0]+bestmove.split("")[1]){
                                if(legalMoves[i].to==bestmove.split("")[2]+bestmove.split("")[3]){
                                    var move = legalMoves[i]
                                    game.move({
                                        ...move,
                                        promotion: 'false',
                                        animate: false,
                                        userGenerated: true
                                    });
                                }
                            }
                        }
                    },5000-window.autoMoveSpeed*500)
                }
            }
 
            var updateBotRunning = false;
 
            async function updateBot() {
                var updateBotInterval = setTimeout(async function(){
                    updateTexts();
                    if(!window.hackEnabled) {
                        clear();
                        updateBotRunning = false;
                        clearInterval(updateBotInterval)
                        return;
                    }
                    updateBotRunning = true;
                    var board = document.querySelector('.board');
                    var FEN = board.game.getFEN();
                    var depth = window.botPower;
                    let response = await fetch(`https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(FEN)}&depth=${depth}`);
                    let data = await response.json();
                    window.bestMove = data.bestmove;
                    window.currentEvaluation = data.evaluation;
                    var bestmove = data.bestmove;
                    executeAction(bestmove);
                    requestAnimationFrame(()=>{
                        if (updateBotRunning) updateBot();
                    });
                },1100-(window.updateSpeed*100))
                }
            document.addEventListener("change", updateBot);
            if(await getStockFish(key)){updateBot();}
 
 
            var draggingElement = document.getElementById("modTitle")
            dragElement(itemWrap,draggingElement);
 
            function dragElement(elmnt,elmnt2) {
                var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                elmnt2.onmousedown = dragMouseDown;
                function dragMouseDown(e) {
                    e = e || window.event;
                    e.preventDefault();
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    document.onmouseup = closeDragElement;
                    document.onmousemove = elementDrag;
                }
                function elementDrag(e) {
                    e = e || window.event;
                    e.preventDefault();
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
                }
                function closeDragElement() {
                    document.onmouseup = null;
                    document.onmousemove = null;
                }
            }
 
            var menuHidden = 0
            document.addEventListener("keyup",(e)=>{
                if(e.key=="b"&&e.ctrlKey){
                    if(!menuHidden){menuWrap.style.display="none"}
                    else{menuWrap.style.display="grid"}
                    menuHidden^=1
                }
            })
        }
 
 
 
        var keyInput = document.getElementById("keyInput")
        var keyButton = document.getElementById("keyButton")
        var keyResponse = document.getElementById("keyResponse")
 
        keyButton.addEventListener("click",async function(){
            if(await getStockFish(keyInput.value)){
                keyMenuWrap.remove()
                await startStockfish(keyInput.value)
                localStorage.setItem("stockfishLoaded",keyInput.value)
            }else{keyResponse.innerHTML=atob('V3JvbmcgUGFzcyE=')}
        })
 
        if(localStorage.getItem("stockfishLoaded")!=null){
            if(await getStockFish(localStorage.getItem("stockfishLoaded"))){
                await startStockfish(localStorage.getItem("stockfishLoaded"))
                keyMenuWrap.remove()
            }
        }
 
        async function getStockFish(input) {
            const hashHex=[...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(input)))]
            .map(b=>b.toString(16).padStart(2,'0')).join('');
            return hashHex==="719efeec314f905eb15a872ed9f4e869441c093fd445d75a96b35067096d31dc"
        }
    },3000)
})();
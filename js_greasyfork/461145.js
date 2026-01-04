// ==UserScript==
// @name UaPixelBattle
// @description Pixel battle helper tool for Ukrainian team https://t.me/uapixelbattlechat
// @version 1.0.0
// @namespace https://t.me/uapixelbattlechat
// @include *ext-twitch.tv/sn8*
// @author       Oxonomy-pixel
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461145/UaPixelBattle.user.js
// @updateURL https://update.greasyfork.org/scripts/461145/UaPixelBattle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window !== top) {
        if (location.href.startsWith("https://sn8jjg8dcyczy1l5cvmvy5z2dm3nqn.ext-twitch.tv/")){
            main()
        }
    }
})();

function main(){
    let canvas = document.getElementById("background")
    let interv = setInterval(()=>{
        console.log("width:", canvas.width)
        if(canvas.width > 301) {
            main2()
            clearInterval(interv)
        }
    },1000)
}
function drawCanv(canv, ctx, data, placeState, viewState){
    ctx.drawImage(data,
                                  (canv.width / 2) - ((placeState.originOffset[0] + viewState.position[0] - .5) * viewState.zoom),
                                  (canv.height / 2) -((placeState.originOffset[1] - viewState.position[1] + .5) * viewState.zoom),
                       placeState.width * viewState.zoom,
                       placeState.height * viewState.zoom
                      );
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255) {
        throw "Invalid color component";
    }
    return ((r << 16) | (g << 8) | b).toString(16);
}

function main2(){
    let canvas = document.getElementById("background")
    let targetCanvas = document.createElement("canvas")
    targetCanvas.style = "top: 0px; left:0px; z-index:5; position: absolute;"
    let context = targetCanvas.getContext("2d");
    let isDragging = false
    let contextOrig = canvas.getContext("2d");
    let placeState = unsafeWindow.placeState
    let viewState = unsafeWindow.loadUserSettings().viewState
    let appState = unsafeWindow.appState
    targetCanvas.width = canvas.width;
    targetCanvas.height = canvas.height;
    targetCanvas.id = "mtarget"
    //targetCanvas.setAttribute("tabindex",'1')
    document.getElementById("app").style = "z-index:6"
    let imageLoaded = false
    let imageData
    let enabled = true
    let antimiss = true
    GM_xmlhttpRequest({
        method:"GET",
        url: "https://raw.githubusercontent.com/oxonomy-pixel/UaPixelBattle/main/target",
        onload: async (data) => {
            try {
                imageData = new Image();
                imageData.onload = function() {
                    imageData = this
                    imageLoaded = true
                }
                imageData.src = data.response
            } catch (e) {
            console.log(e)
            }
        }
    })
    document.body.appendChild(targetCanvas);
    function clearTarget(){
        context.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    }
    function redrawTarget(){
        if (!imageLoaded) return
        clearTarget()
        let placeState = unsafeWindow.placeState
        let viewState = unsafeWindow.loadUserSettings().viewState
        try {
            context.imageSmoothingEnabled = false
            drawCanv(canvas, context, imageData, placeState, viewState)
            context.imageSmoothingEnabled = false
        } catch (e){
        console.log(e)
        }
        console.log("redraw")
    }
    let interv = setInterval(()=>{
        if (!enabled) return
        redrawTarget()
    },1000)
    function onPointerMove(e) {
        if (!isDragging) return
        let dragStartMouseCoords = unsafeWindow.dragStartMouseCoords
        var vectorH = dragStartMouseCoords[0] - e.clientX;
        var vectorW = dragStartMouseCoords[1] - e.clientY;
        var vectorLength = Math.sqrt(vectorH**2 + vectorW**2);
        if (vectorLength * viewState.zoom < appState.minDragVector) return
        redrawTarget()
    }
    function onPointerDown() {
        isDragging = true
        unsafeWindow.isClick = false

    }
    function onPointerUp() {
        if (!enabled) return
        redrawTarget()
        isDragging = false
    }
    function onClick(e) {
        if (!imageLoaded) return
        if (!antimiss) {
            if (!unsafeWindow.hasMoved){
                unsafeWindow.isClick = true
            }
            return
        }
        //console.log(e.target.id)
        if(e.target.id != "app" && e.target.id != "mtarget") {
            return
        };
        e.preventDefault();
        let viewState = unsafeWindow.loadUserSettings().viewState
        let panZoomTarget = [
        e.clientX,
            e.clientY
        ]
        let x = panZoomTarget[0]
        let y = panZoomTarget[1]
        let targetColorData = context.getImageData(x, y, 1, 1).data
        var targetColor = "#" + ("000000" + rgbToHex(targetColorData[0], targetColorData[1], targetColorData[2])).slice(-6);
        let currColorData = contextOrig.getImageData(x, y, 1, 1).data
        var currColor = "#" + ("000000" + rgbToHex(currColorData[0], currColorData[1], currColorData[2])).slice(-6);
        let activeColor = placeState.palette[unsafeWindow.activeColorIndex].toLowerCase()
        console.log("click", panZoomTarget, targetColor, currColor, activeColor)
        if (targetColor != 0 && targetColor != currColor && targetColor == activeColor) {
            if (!unsafeWindow.hasMoved){
                unsafeWindow.isClick = true
            }
        }
    }
    document.body.addEventListener('pointermove', onPointerMove);
    document.body.addEventListener('pointerdown', onPointerDown);
    document.body.addEventListener('pointerup', onPointerUp);
    document.body.addEventListener('click', onClick, true);
    document.addEventListener('keyup', (event) => {
        if (!imageLoaded) return
        var name = event.key;
        var code = event.code;
        console.log(code)
        if (code == "KeyF") {
            enabled = !enabled
            if (enabled) {
                redrawTarget()
                targetCanvas.style.zIndex = 5
                console.log("enabled")
            }else {
                targetCanvas.style.zIndex = 0
                //clearTarget()
                console.log("disabled")
            }
        }
        if (code == "KeyG") {
            antimiss = !antimiss
            if (antimiss) {
                console.log("antimiss enabled")
            } else {
                console.log("antimiss disabled")
            }
        }
    }, false);
}

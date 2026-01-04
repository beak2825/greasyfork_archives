// ==UserScript==
// @name         Caption Capture
// @namespace    http://github.com/lanbin
// @version      0.3
// @description  Caption Capture Merge
// @author       lanbin
// @match        https://*.qq.com/*
// @match        https://*.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/30784/Caption%20Capture.user.js
// @updateURL https://update.greasyfork.org/scripts/30784/Caption%20Capture.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var body = document.querySelector("body");
    var MAX_LOOP = 100;
    var aspectRatio, capImage;
    var gapDefault = 40;
    var bottomGapDefault = 30;
    var pressNum = 0;
    var lastCapture = "";
    var clicked = false;

    function init(){
        var loop = 0,
            sid = setInterval(function(){
                var video = getVideo();
                if(video || loop > MAX_LOOP) {
                    clearInterval(sid);
                    createOp();
                    createImageTemp();
                }
                ++loop;
            }, 100);

    }

    function getCanvas(){
        return document.querySelector("#cc-screen-shot");
    }

    function getContext(){
        return getCanvas().getContext("2d");
    }

    function getVideo(){
        var videos = document.querySelectorAll("video"),
            v;
        for(var index = 0; index < videos.length; index++){
            if(videos[index].src) {
                v = videos[index];
                v.crossOrigin = "anonymous";
                aspectRatio = v.videoWidth / v.videoHeight;
                break;
            }
        }
        return v;
    }

    function createOp(){
        var capBtn = document.querySelector("#cc-caption-bar");
        if(capBtn) {
            return;
        }
        capBtn = document.createElement("div");
        capBtn.id = "cc-caption-bar";
        capBtn.style="position: absolute;right: 0;top: 100px;width: 90px;background-color: rgb(204, 204, 204);cursor: pointer;z-index: 999999;font-size: 20px;text-align: center;padding: 10px 0;color: black;font-weight: bolder;border-radius: 4px 0 0 4px;";
        capBtn.innerHTML = "Caption";
        body.appendChild(capBtn);
        capBtn.addEventListener("click", function(){
            createPanel();
        });
    }

    function createImageTemp(){
        capImage = document.querySelector("#cc-caption-image");
        if(capImage) {
            return;
        }
        capImage = document.createElement("img");
        capImage.id = "cc-caption-image";
        capImage.crossOrigin = "anonymous";
        body.appendChild(capImage);
    }

    function createPanel() {
        var capPanel = document.querySelector("#cc-caption-panel");
        if(capPanel) {
            capPanel.style.display = capPanel.style.display === "block" ? "none" : "block";
            return;
        }

        var capCanvas = document.createElement("canvas"),
            canvasBox = document.createElement("div"),
            video = getVideo();

        if(video.videoWidth === 0 || video.videoHeight === 0) {
            alert("等5秒再点");
            return;
        }
        capCanvas.width = video.videoWidth;
        capCanvas.height = video.videoHeight;

        canvasBox.id = "cc-canvas-box";
        var boxStyle = "max-height:600px;overflow-y:scroll;";

        if(window.screen.availWidth < 2000) {
            boxStyle += "zoom:0.6;";
        }
        canvasBox.style = boxStyle;
        canvasBox.appendChild(capCanvas);

        capPanel = document.createElement("div");
        capPanel.id = "cc-caption-panel";
        capPanel.style="position: fixed; right: 100px; bottom:20px;background-color: #ccc;display:block;z-index:9999999;padding-bottom:80px;box-shadow: 0 0 15px #000000;";

        var addScreenShotBtn = document.createElement("div");
        addScreenShotBtn.id = "cc-screen-shot-btn";
        addScreenShotBtn.style="background-color:#ff920b;color:white;text-align:center;font-size:14px;height:40px;line-height:40px;cursor:pointer;";
        addScreenShotBtn.innerHTML = "截图";

        var clearScreenShotBtn = document.createElement("div");
        clearScreenShotBtn.id = "cc-clear-screen-shot";
        clearScreenShotBtn.style="background-color:#000;color:white;text-align:center;font-size:14px;height:40px;line-height:40px;cursor:pointer;";
        clearScreenShotBtn.innerHTML = "清空";

        var inputBox = document.createElement("div");
        var btnBox = document.createElement("div");
        var bottomBox = document.createElement("div");
        btnBox.style="float:left;width:70%;height:80px;";
        inputBox.style="float:left;width:30%;height:80px;";
        bottomBox.style = "position:absolute;left:0;right:0;";

        var bottomHeightLabel = document.createElement("label");
        var bottomHeightInput = document.createElement("input");
        var bottomHeightDiv = document.createElement("div");

        bottomHeightInput.id = "cc-bottom-gap";
        bottomHeightLabel.innerHTML = "字幕底部边距：";
        bottomHeightLabel.style = "padding: 0 5px;vertical-align:middle;";
        bottomHeightInput.style = "width:50px;height:30px;vertical-align:middle;text-align:center;";
        bottomHeightInput.value = bottomGapDefault;

        var captionHeightLabel = document.createElement("label");
        var captionHeightInput = document.createElement("input");
        var captionHeightDiv = document.createElement("div");

        captionHeightInput.id = "cc-caption-height";
        captionHeightLabel.innerHTML = "字幕本身高度：";
        captionHeightLabel.style = "padding: 0 5px;vertical-align:middle;";
        captionHeightInput.style = "width:50px;height:30px;vertical-align:middle;text-align:center;";
        captionHeightDiv.style = "height:40px;";
        captionHeightInput.value = gapDefault;


        captionHeightDiv.appendChild(captionHeightLabel);
        captionHeightDiv.appendChild(captionHeightInput);
        inputBox.appendChild(captionHeightDiv);

        bottomHeightDiv.appendChild(bottomHeightLabel);
        bottomHeightDiv.appendChild(bottomHeightInput);
        inputBox.appendChild(bottomHeightDiv);


        capCanvas.id = "cc-screen-shot";



        btnBox.appendChild(addScreenShotBtn);
        btnBox.appendChild(clearScreenShotBtn);
        bottomBox.appendChild(inputBox);
        bottomBox.appendChild(btnBox);
        capPanel.appendChild(canvasBox);
        capPanel.appendChild(bottomBox);

        body.appendChild(capPanel);

        addScreenShotBtn.addEventListener("click", function(){
            addScreenShot();
        });

        clearScreenShotBtn.addEventListener("click", function() {
            clearScreenShot();
        });
    }

    function clearScreenShot(){
        pressNum = 0;
        var canvas = getCanvas(),
            video = getVideo();
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        clicked = false;
    }

    function addScreenShot() {
        if(clicked) return;

        var canvas = getCanvas(),
            context = getContext(),
            video = getVideo(),
            vWidth = video.videoWidth,
            vHeight = video.videoHeight,
            gap = document.querySelector("#cc-caption-height").value || gapDefault,
            bottomGap = document.querySelector("#cc-bottom-gap").value || bottomGapDefault;

        clicked = true;
        if(pressNum === 0){
            context.drawImage(video, 0, 0, vWidth, vHeight- bottomGap, 0, 0, vWidth, vHeight - bottomGap);
            // context.font = "13px Arial";
            // context.fillStyle = "white";
            // context.fillText("Screen Shot by Caption Capture",10,20);
            pressNum++;
            clicked = false;
        }else{
            var dataURL = getCanvas().toDataURL("image/png");

            var image = new Image();
            image.onload = function() {
                clicked = false;
                var offset = pressNum * gap;
                canvas.width = vWidth;
                canvas.height = vHeight + offset;

                getContext().drawImage(video, 0,    0, vWidth, vHeight - bottomGap,  0, offset, vWidth,      vHeight - bottomGap);
                getContext().drawImage(image, 0,    0);
                pressNum++;
                document.querySelector("#cc-canvas-box").scrollTop = document.querySelector("#cc-canvas-box").scrollHeight;
            };
            image.src = dataURL;
        }
    }

    init();
})();
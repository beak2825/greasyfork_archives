// ==UserScript==
// @name         Check the connection
// @namespace    https://www.waze.com/*
// @version      1.0
// @description  Check the connection, A tool to check your Internet connection
// @author       sultan alrefaei
// @match        https://www.waze.com/editor/
// @match        https://www.waze.com/ar/editor/
// @match        https://www.waze.com/editor
// @match        https://www.waze.com/ar/editor
// @grant        none
// @copyright    2017 sultan alrefaei
// @downloadURL https://update.greasyfork.org/scripts/34452/Check%20the%20connection.user.js
// @updateURL https://update.greasyfork.org/scripts/34452/Check%20the%20connection.meta.js
// ==/UserScript==

var saveNow = 25; // عدد مرات التعديل المسموح بها 25، يمكنك تغيرها الى العدد الذي تريد


window.onload = function(e){
    addTohead();
    var isCon = true;
    var isClick = true;
    setInterval(function(){
        var c = getRoot("@counter",0);
        var counter = parseInt(c.innerText);
        if (counter >= saveNow && isCon){
            createAlert();
            beep();
            isCon = false;
        }
        if (counter == 0){
            var alertFRM = getRoot("#connected");
            if (alertFRM != null){
                alertFRM.remove();
                isClick = true;
            }
            isCon = true;
        }
        if (getRoot("@toolbar-button waze-icon-save ItemInactive",0) != undefined){
            var BTNSave = getRoot("@toolbar-button waze-icon-save ItemInactive",0);
            if (BTNSave != undefined){
                if (BTNSave != null){
                    if (!BTNSave.hasAttribute("id")){
                        BTNSave.setAttribute("id","SaveBTN");
                    } 
                }   
            }
            if (BTNSave != null){
                if (isClick){
                    var mySave = getRoot("#SaveBTN");
                    var alertFRM = getRoot("#connected");
                    mySave.addEventListener("click",function(){
                        if (alertFRM != null){
                            alertFRM.remove();
                        }
                    });
                    isClick = false;
                }
            }
        }   
    },100);
}

function createAlert(){
    var URLLANG = window.location.href;
    createDiv(URLLANG.includes("ar"));
    try{
        requestServer("https://www.waze.com/");
    }
    catch(err) {
        if (div != null){
            div.innerHTML = "<div align='center'>لا يوجد إتصال</div";
        }
    }   
}

function createDiv(lang){
    if (lang == true){
        if (getRoot("SaveBTN") == null){
            var div = document.createElement("div");
            div.id = "connected";
            div.style.position = "absolute";
            div.style.zIndex = 10000;
            div.style.top = "35px";
            div.style.width = "200px";
            div.style.height = "28px";
            div.style.fontSize = "20px";
            div.title = "إغلاق التنبيه";
            div.style.borderRadius = "7px";
            div.style.cursor = "pointer";
            div.onclick = function(){
                div.remove();
            }
            div.onmouseover = function(){
                div.style.color = "white";
                div.style.textShadow = "1px 1px #B71C1C";
                div.style.backgroundColor = "#EF5350";
            }
            div.onmouseleave = function(){
                div.style.color = "#212121";
                div.style.textShadow = "1px 1px #9E9E9E";
                div.style.backgroundColor = "#F5F5F5";
            }
            div.style.right = "45%";
            div.style.color = "#212121";
            div.style.backgroundColor = "#F5F5F5";
            div.style.boxShadow = "0px 3px #ab3232";
            div.style.textShadow = "1px 1px #9E9E9E";
            div.style.fontFamily = "'El Messiri', sans-serif";
            div.innerHTML = "<div align='center'>"
                + "<div style='position: absolute; right:0px; top:0px; height: 28px; background: #ab3232; width:10px; border-radius: 0px 5px 5px 0px;'>"
                + "</div>قم بحفظ التعديلات"
                + "<div style='position: absolute; left:0px; top:0px; height: 28px; background: #ab3232; width:10px; border-radius: 5px 0px 0px 5px;'>"
                + "</div></div>";
            document.getElementById("WazeMap").appendChild(div);
        }
    }else{
        if (getRoot("SaveBTN") == null){
            var div = document.createElement("div");
            div.id = "connected";
            div.style.position = "absolute";
            div.style.zIndex = 10000;
            div.style.top = "35px";
            div.style.width = "150px";
            div.style.height = "28px";
            div.style.fontSize = "20px";
            div.title = "Close";
            div.style.borderRadius = "7px";
            div.style.cursor = "pointer";
            div.onclick = function(){
                div.remove();
            }
            div.onmouseover = function(){
                div.style.color = "white";
                div.style.textShadow = "1px 1px #B71C1C";
                div.style.backgroundColor = "#EF5350";
            }
            div.onmouseleave = function(){
                div.style.color = "#212121";
                div.style.textShadow = "1px 1px #9E9E9E";
                div.style.backgroundColor = "#F5F5F5";
            }
            div.style.right = "45%";
            div.style.color = "#212121";
            div.style.backgroundColor = "#F5F5F5";
            div.style.boxShadow = "0px 3px #ab3232";
            div.style.textShadow = "1px 1px #9E9E9E";
            div.style.fontFamily = "'Pontano Sans', sans-serif";
            div.innerHTML = "<div align='center'>"
            + "<div style='position: absolute; right:0px; top:0px; height: 28px; background: #ab3232; width:8px; border-radius: 0px 5px 5px 0px;'>"
            + "</div>Save your edits"
            + "<div style='position: absolute; left:0px; top:0px; height: 28px; background: #ab3232; width:8px; border-radius: 5px 0px 0px 5px;'>"
            + "</div></div>";
            document.getElementById("WazeMap").appendChild(div);
        }
    }
}

function requestServer(URL){
    var getReguest = new XMLHttpRequest();
    getReguest.open("GET",URL,false);
    getReguest.send(null);
}

function getRoot(name,index){
    if (name != "" || name != null || name != undefined){
        if (name.includes("@") && !name.includes("#")){
            if (index != null || index != undefined){
                var classname = name.replace("@","");
                return document.getElementsByClassName(classname)[index];
            }else{
                var classname = name.replace("@","");
                return document.getElementsByClassName(classname);
            }
        }
        else if (name.includes("#") && !name.includes("@")){
            idname = name.replace("#","");
            return document.getElementById(idname);
        }
    } 
}

function addTohead(){
    var linkAR = document.createElement("link");
    linkAR.href = "https://fonts.googleapis.com/css?family=El+Messiri";
    linkAR.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(linkAR);

    var linkEN = document.createElement("link");
    linkEN.href = "https://fonts.googleapis.com/css?family=Pontano+Sans";
    linkEN.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(linkEN);
}

function beep() {
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
    snd.play();
}

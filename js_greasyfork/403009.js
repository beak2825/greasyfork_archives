// ==UserScript==
// @name         iirose AI blcoker
// @namespace    http://tampermonkey.net/
// @version      0.5.4
// @description  An assistant that helps you block annoying AI messages.
// @author       Keane
// @match        https://iirose.com/messages.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403009/iirose%20AI%20blcoker.user.js
// @updateURL https://update.greasyfork.org/scripts/403009/iirose%20AI%20blcoker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var targetNode = document.getElementsByClassName("fullBox msgholderBox")[0];
    var muteMusicNode = document.getElementById("shareMediaAvatar");
    var currentSongURL = "";
    const configAI = {childList: true, subtree: true };
    const configMute = {attributes: true};
    var count = 0;
    var status = true;
    var notificationNode = document.getElementById("hidePanel");
    var AINames = ["艾泽","艾瑞","艾莉","艾薇","艾洛","艾瑟","艾花","艾A","艾B","上杉夏乡","上杉夏香","logos"];

    function Init (){
        var Unodes = document.getElementsByClassName("PubChatUserInfo");
        if(Unodes.length==0){
            window.setTimeout(Init, 50);
            console.log("loading");
        }
        else{
            var i = 0;
            var Unode,userNameStr,msgNodes,AIMsg;
            //console.log(Unodes.length);
            for (i; i<Unodes.length;i++){

                Unode = Unodes[i];
                userNameStr = Unode.firstElementChild.getAttribute("data-name");
                //console.log(userNameStr);
                if (AINames.includes(userNameStr)){
                    count += 1;
                    msgNodes = document.getElementsByClassName("msg");
                    AIMsg = msgNodes[i];
                    AIMsg.style.display = "none";
                }
            }
            //console.log(count + " AI msgs are blocked");
            updateCount();
            return;
        }

    }

    function updateCount(){
        document.getElementById("AIBlockText").innerHTML = "正在屏蔽 ： "+ count;
    }
    // Callback function to execute when mutations are observed
    const AIcallback = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                //console.log('A child node has been added or removed.');
                //var nodes = document.getElementsByClassName("PubChatUserInfo");
                //  var node = nodes[nodes.length-1];
                //  var userName = node.firstElementChild.getAttribute("data-name");
                //  console.log(userName);
                /*if (AINames.includes(userName)){
                    count += 1;
                    var msgNodes = document.getElementsByClassName("msg");
                    var lastMsg = msgNodes[nodes.length-1];
                    lastMsg.style.display = "none";
                    console.log("An AI msg is blocked");
                    updateCount();
                }
                */
                count = 0;
                Init();
                updateCount();
            }

        }
    };
    //for future use
    const NotifyCallback = function (mutation, observer){
        if (mutation.type === 'childList') {
            //console.log('A child node has been added or removed.');
            var node = document.getElementById("");


        }
    }
    const MuteCallback = function (mutationsList, observer){
        for(let mutation of mutationsList) {
            if (mutation.type === 'attributes'){
                console.log("song changed "+ muteMusicNode.getAttribute("data-orisrc"));
                if (currentSongURL!= muteMusicNode.getAttribute("data-orisrc")){
                    functionBtnDo(90);
                    _alert("恢复播放");
                    currentSongURL= muteMusicNode.getAttribute("data-orisrc");
                    document.getElementById("mdi-music-note").className = "functionBtnIcon mdi-music-note";
                    Muteobserver.disconnect();
                }



            }
        }
    }

    function appendMuteButton(){
        var newNodeSpan0 = document.createElement("span");
        var newNodeSpan1 = document.createElement("span");
        var newNodeDiv = document.createElement("div");
        var style = document.createElement('style');

        style.type = 'text/css';
        style.innerHTML = '.mdi-music-note::before { content: "\\F1120" } .mdi-music-note-off::before { content: "\\F0581" }';

        newNodeSpan0.className = "functionBtnIcon mdi-music-note";
        newNodeSpan0.id = "mdi-music-note";
        newNodeSpan1.className = "functionBtnFont";
        newNodeSpan1.id = "MuteText";
        newNodeSpan1.innerHTML = "静音当前歌曲";
        newNodeDiv.className = "functionButton";
        newNodeDiv.id = "MuteBtn";
        newNodeDiv.append(newNodeSpan0);
        newNodeDiv.append(newNodeSpan1);
        addCostomBtnMenu();
        document.getElementsByTagName('head')[0].appendChild(style);
        document.getElementById("customBox").append(newNodeDiv);
        document.getElementById("MuteBtn").onclick = toggleMute;
    }
    function toggleMute(){
        if (!Probe.emptyMediaPlayer){
            functionBtnDo(90);
            _alert("当前歌曲已静音，下一首歌自动恢复播放");
            currentSongURL= muteMusicNode.getAttribute("data-orisrc");
            Muteobserver.observe(muteMusicNode, configMute);
            document.getElementById("mdi-music-note").className = "functionBtnIcon mdi-music-note-off";
            document.getElementById("MuteText").innerHTML = "当前歌曲已静音";
        }
        else{
            functionBtnDo(90);
            _alert("当前歌曲已恢复播放");
            Muteobserver.disconnect();
            document.getElementById("mdi-music-note").className = "functionBtnIcon mdi-music-note";
            document.getElementById("MuteText").innerHTML = "静音当前歌曲";
        }
        return;
    }

    function displayMsg(){
        var i = 0;
        var Unode,userNameStr,msgNodes,AIMsg;
        var Unodes = document.getElementsByClassName("msg");
        for (i; i<Unodes.length;i++){
            Unode = Unodes[i];
            Unode.style.display = "block";
        }
        console.log(count + " AI msgs are shown");
        //updateCount();
        return;
    }
    //expired
    function createButton (){
        var toggleButtonDiv = document.createElement('div');
        //toggleButtonDiv.class = "hvr-radial-out";
        toggleButtonDiv.id = "toggleButtonContainer";
        toggleButtonDiv.style.cssText = "position:relative;top:2%;left:20%;width:50px;height:50px;z-index:90001";

        var toggleButtonBG = document.createElement('span');
        toggleButtonBG.id = "toggleButtonBG";
        toggleButtonBG.style.cssText = "position:absolute;width:50px;height:50px;background-color: #FFF;border-radius: 50%;z-index: 0;";


        var toggleButtonPic1 = document.createElement("img");
        toggleButtonPic1.id = "toggleButtonPic";
        toggleButtonPic1.src = "http://r.iirose.com/i/20/5/9/23/0526-ET.png";
        toggleButtonPic1.style.cssText = "position:relative;width:45px;height:45px;top:2.5px;left:2.5px;z-index: 1;";
        var toggleButtonPic2 = document.createElement("img");
        toggleButtonPic2.id = "toggleButtonPic2";
        toggleButtonPic2.src = "http://r.iirose.com/i/20/5/10/11/1614-W7.png";
        toggleButtonPic2.style.cssText = "position:absolute;width:40px;height:40px;top:5px;left:5px; display:block;z-index: 2;";
        var toggleButton = document.createElement("div");
        toggleButton.id = "toggleButton";
        toggleButton.style.cssText = "position:absolute;width:40px;height:40px;top:5px;left:5px; display:block;z-index: 3;";
        //toggleButton.addEventListener("click", toggle);

        var toggleButtonBadge = document.createElement('span');
        toggleButtonBadge.id = "toggleButtonBadge";
        toggleButtonBadge.innerHTML = count.toString();
        toggleButtonBadge.style.cssText= "position: absolute;top: -12px; right: -12px;padding: 3px 10px;border-radius: 50%; background: red; color: white;display:block;"

        toggleButtonDiv.appendChild(toggleButtonBG);
        toggleButtonDiv.appendChild(toggleButtonPic1);
        toggleButtonDiv.appendChild(toggleButtonPic2);
        toggleButtonDiv.appendChild(toggleButtonBadge);
        toggleButtonDiv.appendChild(toggleButton);

        document.getElementById("mainContainer").append(toggleButtonDiv);

        document.getElementById("toggleButton").onclick=toggleAI;
        var divNode = document.getElementById('toggleButtonContainer');
        //     divNode.onmouseenter = hoverTimer;
        //     divNode.onmouseleave = hoverTimerStopper;
    }
    /*
    function hoverTimer (){
        console.log("mouseover");
        setTimeoutConst = setTimeout(function(){
            document.getElementById('toggleButtonContainer').style.display = "none";
            return;
        }, delay);
    }
    function hoverTimerStopper(){
        console.log("mouseleave");
        clearTimeout(setTimeoutConst );
    }
    var delay=2000, setTimeoutConst;
*/
    //add a btn menu called 自定义 to hold all the buttons
    function addCostomBtnMenu(){
        var headerDiv;
        if (!document.getElementById("customHeader")) {
            var heziDiv = document.getElementsByClassName("functionButton functionButtonGroup")[7];
            headerDiv = document.getElementsByClassName("functionButton functionButtonGroup")[7].cloneNode(true);
            headerDiv.children[0].className = "functionBtnIcon mdi-lightbulb-on";
            headerDiv.children[1].innerHTML = "自定义";
            headerDiv.id = "customHeader";
            heziDiv.parentNode.insertBefore(headerDiv, heziDiv);
        }
        headerDiv = document.getElementById("customHeader");
        var btnHolderDiv;
        if (!document.getElementById("customBox")) {
            btnHolderDiv = document.createElement("div");
            btnHolderDiv.id = "customBox";
            btnHolderDiv.className = "functionItemBox";
            headerDiv.parentNode.insertBefore(btnHolderDiv, headerDiv.nextSibling);
        }
        return;
    }

    function appendAIButton(){
        var newNodeSpan0 = document.createElement("span");
        var newNodeSpan1 = document.createElement("span");
        var newNodeDiv = document.createElement("div");
        var style = document.createElement('style');

        style.type = 'text/css';
        style.innerHTML = '.mdi-do-not-disturb::before { content: "\\F0698" } .mdi-do-not-disturb-off::before {content:"\\F0699"}';
        newNodeSpan0.className = "functionBtnIcon mdi-do-not-disturb";
        newNodeSpan0.id = "mdi-do-not-disturb";
        newNodeSpan1.className = "functionBtnFont";
        newNodeSpan1.id = "AIBlockText";
        newNodeSpan1.innerHTML = "正在屏蔽 ： "+ count;
        newNodeDiv.className = "functionButton";
        newNodeDiv.id = "AIBlockBtn";
        newNodeDiv.append(newNodeSpan0);
        newNodeDiv.append(newNodeSpan1);
        addCostomBtnMenu();
        document.getElementsByTagName('head')[0].appendChild(style);
        document.getElementById("customBox").append(newNodeDiv);
        document.getElementById("AIBlockBtn").onclick = toggleAI;

    }
    function toggleAI(){
        //console.log(document.getElementById("toggleButtonPic2").style.display);
        if (status){
            document.getElementById("AIBlockText").innerHTML = "已停止屏蔽";
            document.getElementById("mdi-do-not-disturb").className = "functionBtnIcon mdi-do-not-disturb-off";
            AIobserver.disconnect();
            displayMsg();
            status=false;
            console.log("No Blocking AI Msg Now.");
        }
        else {
            document.getElementById("AIBlockText").innerHTML = "正在屏蔽";
            document.getElementById("mdi-do-not-disturb").className = "functionBtnIcon mdi-do-not-disturb";
            status=true;

            count=0;
            Init();
            AIobserver.observe(targetNode, configAI);
            console.log("Re-Blocking AI Msg Now.");

        }

    }
    // Create an observer instance linked to the callback function
    const AIobserver = new MutationObserver(AIcallback);
    const Muteobserver = new MutationObserver(MuteCallback);

    const NotifyObserver = new MutationObserver(NotifyCallback);

    // Start observing the target node for configured mutations


    //NotifyObserver.observe();

    Init();
    AIobserver.observe(targetNode, configAI);

    appendAIButton();
    appendMuteButton();
    // createButton();




})();
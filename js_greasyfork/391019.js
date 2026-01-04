// ==UserScript==
// @name         JSTRIS+
// @namespace    http://tampermonkey.net/
// @version      0.54
// @description  Busca adicionar melhorias no JSTRIS
// @author       Emma Parolo
// @match        *://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391019/JSTRIS%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/391019/JSTRIS%2B.meta.js
// ==/UserScript==

(function(){

    'use strict';

    const baseLoad = window.onload;
    window.onload = async () => {

        baseLoad();

        // Functions
        const $ = selector => document.querySelector(selector);
        const $$ = (selector, cb) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(cb);
            return elements;
        };
        const sleep = (s) => new Promise(resolve => setTimeout(resolve, s * 1000));
        const show_alert = (msg) => {

            const target = document.querySelector("#alert");
            target.innerHTML = msg;
            target.classList.add("showed");
            setTimeout(() => {target.classList.remove("showed")}, 3000);

        };
        const each = function(arr, cb){

            var breaked = false;
            for(var index in arr) {

                var value = arr[index];
                breaked = cb(value, index);
                if(breaked){
                    break
                }

            }
            return breaked;
        };
        const create = (elementName, configs = {}, append = null) => {

            const element = document.createElement(elementName);
            each(configs, (value, config) => {element[config] = value});
            if(append) element.append(append);
            return element;

        };
        const appendStyle = (elementName, style) => {

            if(style[style.length - 1] !== ";") style += ";";
            $(elementName).style = $(elementName).getAttribute("style") + style;

        };
        const toggleClass = (el, className) => {

            if(typeof el === "string") el = $(el);

            if(!el.classList.contains(className))
                el.classList.add(className);
            else
                el.classList.remove(className);

        };


        // StyleBlock
        const styleBlock = create("style", {innerHTML : styleText});

        // Alert
        const alert = create("div", {
            id : "alert",
            onclick : function(){this.classList.remove("showed")}
        });

        // Show Chat Button
        const showChat = create("button", {
            innerHTML : "Chat",
            onclick : () => {toggleClass(".chatArea", "showed")}
        });

        // Create Private Room x100
        const privateRoomX100 = create("button", {
            innerHTML : "Sala Privada x100",
            onclick : async () => {

                $("#lobby").click();
                $("#createRoomButton").click();
                $("#more_adv").click();
                $("#hasSolid").click();
                $("#isPrivate").checked = true;
                $("#hostStart").checked = true;
                $("#create").click();

                while(!$(".joinLink")) await sleep(.5);
                selectText($(".joinLink"));

                try {
                    const successful = document.execCommand('copy');
                    const msg = successful ? 'Link da sala copiado' : 'Erro ao copiar link da sala';
                    show_alert(msg);
                }catch(err){
                    show_alert("Erro ao copiar link da sala!");
                }

            }
        });

        // Create Private Room x1
        const privateRoomX1 = create("button", {
            innerHTML : "Sala Privada x1",
            onclick : async () => {

                $("#lobby").click();
                $("#createRoomButton").click();
                $("#more_adv").click();
                $("#hasSolid").click();
                $("#isPrivate").checked = true;
                $("#hostStart").checked = true;
                $("#numPlayers").value = 2;
                $("#create").click();

                while(!$(".joinLink")) await sleep(.5);
                selectText($(".joinLink"));

                try {
                    const successful = document.execCommand('copy');
                    const msg = successful ? 'Link da sala copiado' : 'Erro ao copiar link da sala';
                    show_alert(msg);
                }catch(err){
                    show_alert("Erro ao copiar link da sala!");
                }

            }
        });







        const plusCanvas = create("li", {},
            create("a", {
                innerHTML : "Aumentar",
                onclick : () => {

                    baseH -= 50;
                    base2H -= 50;
                    baseW += 50;
                    canvasW += 50;
                    canvasH += 50;
                    qCH += 50;
                    stageW += 50;

                    appendStyle("#players", `height: ${canvasH}px!important!important; width: calc(100vw - ${baseW}px) !important;`);
                    appendStyle("#lobbyBox", `width: calc(100vw - ${baseW}px) !important;`);
                    appendStyle(".chatArea", `height: ${canvasH}px!important!important; width: calc(100vw - ${baseW}px) !important;`);
                    appendStyle("#main", `height: ${canvasH}px!important; width: ${baseW}px!important;`);
                    appendStyle("#stage", `width: ${stageW}px!important);`);
                    appendStyle("#queueCanvas", `height: ${qCH}px!important;`);
                    appendStyle("#bgLayer", `height: ${canvasH}px!important;`);
                    appendStyle("#myCanvas", `height: ${canvasH}px!important;`);

                }
            })
        );
        const subCanvas = create("li", {},
            create("a",{
                innerHTML : "Diminuir",
                onclick : () => {

                    baseH += 50;
                    base2H += 50;
                    baseW -= 50;
                    canvasW -= 50;
                    canvasH -= 50;
                    qCH -= 50;
                    stageW -= 50;

                    appendStyle("#players", `height: ${canvasH}px!important!important; width: calc(100vw - ${baseW}px) !important;`);
                    appendStyle("#lobbyBox", `width: calc(100vw - ${baseW}px) !important;`);
                    appendStyle(".chatArea", `height: ${canvasH}px!important!important; width: calc(100vw - ${baseW}px) !important;`);
                    appendStyle("#main", `height: ${canvasH}px!important; width: ${baseW}px!important;`);
                    appendStyle("#stage", `width: ${stageW}px!important);`);
                    appendStyle("#queueCanvas", `height: ${qCH}px!important;`);
                    appendStyle("#bgLayer", `height: ${canvasH}px!important;`);
                    appendStyle("#myCanvas", `height: ${canvasH}px!important;`);

                }
            })
        );

        // Appends
        $("body").append(styleBlock);
        $("body").append(alert);
        $("nav .navbar-nav").append(plusCanvas);
        $("nav .navbar-nav").append(subCanvas);
        $("#buttonsBox").prepend(privateRoomX100);
        $("#buttonsBox").prepend(privateRoomX1);
        $("#buttonsBox").prepend(showChat);

        // Change Texts
        $("#settingsSave").innerHTML = "Salvar";
        $("#settingsReset").innerHTML = "Redefinir";
        $("#res").innerHTML = "Iniciar";
        $("#statLabels span").innerHTML = "Tempo";

        // Expand Lots
        window.setInterval(() => {

            document.querySelectorAll(".slot").forEach(el => {

                el.onclick = function(){

                    const has = this.classList.contains("expanded");

                    $$(".slot",el => {
                        el.classList.remove("expanded");
                    });

                    if(!has)
                        toggleClass(this, "expanded");

                }

            })

        }, 2000);


    };

}());


// Preset
let baseH = 700;
let base2H = 493;
let baseW = 700;
let canvasW = 600;
let canvasH = 596;
let qCH = 480;
let stageW = 596;

const styleText = `
    body{
        background-color: rgb(25,25,25)!important;
        overflow-x: hidden!important;
    }
    nav > .container, nav{
        background-color: rgb(51,51,51)!important
    }
    nav{
        margin: 0!important;
    }
    #gc{
        height: calc(100vh - 60px)!important;
        overflow-y: auto!important;
        width: 100%!important;
        overflow-x: hidden!important;
        padding-left: 0;
    }
    #gameFrame{
        width: 100vw!important;
        margin: 0!important;
        padding-top: 20px!important;
    }
    #players{
        width: calc(100vw - 700px)!important;
        margin: !important;
    }
    #lrem{
        color: #fff!important;
    }
    #sprintText{
        color: #f1f1f1!important;
    }
    #main{
        width: 700px!important;
    }
    #holdCanvas{
        padding-left: 55px!important;
        width: calc(30% - 30px)!important;
        margin-right: 30px!important;
    }
    #stage{
        width: 45%!important;
        height: 596px;
    }
    #rstage{
        height: 596px;
        margin-left: 0!important;
        width: 25%!important;
    }
    #buttonsBox{
        margin: 0!important;
        display: flex!important;
        flex-direction: column-reverse!important;
        width: calc(100% - 20px)!important;
        padding-bottom: 20px!important;
    }
    #buttonsBox button{
        padding: 10px!important;
        border-radius: 15px!important;
        background-color: deeppink!important;
        font-weight: bold!important;
        border: 0!important;
        outline: none!important;
        color: #fff!important;
        margin-bottom: 10px!important;
    }

    #gstats{
        margin: 0!important;
        width: calc(100% - 20px)!important;
    }
    #statLabels{
        color: #fff!important;
    }
    #statLabels span{
        text-align: left!important;
    }
    #glstats{
        margin: 0!important;
        width: 73px!important;
    }
    #main > div:nth-child(4){
        position: absolute!important;
        bottom: 0!important;
        width: 30%!important;
        padding-left: 15px;
    }
    #bgLayer{
        height: 596px;
        width: 100%!important;
    }
    #myCanvas{
        height: 596px;
        width: 100%!important;
    }
    #queueCanvas{
        height: 480px;
        margin-left: 0!important;
        padding-left: 30px!important;
    }
    .gCapt{
        width: 100%!important;
    }
    #rInfoBox{
        margin: 0!important;
        padding-top: 14px!important;
    }
    #gameSlots{
        height: 596px;
        margin-bottom: 0!important;
    }
    .chatArea{
        position: absolute!important;
        top: -20px!important;
        width: calc(100vw - 700px)!important;
        height: calc(100vh - 61px)!important;
        left: 100%!important;
        transition-duration: .25s;
    }
    .chatArea.showed{
        left: 0px!important;
    }
    #chatInputArea{
        height: 50px!important;
        width: 100%!important;
    }
    #chatInput{
        height: 50px!important;
        margin: 0!important;
        border-radius: 23px!important;
        padding: 20px!important;
        color: #fff!important;
        background-color: rgb(81,81,81)!important;
        outline: none!important;
    }
    #sendMsg{
        border: 0!important;
        color: #fff!important;
        font-weight: bold!important;
        height: 50px!important;
        outline: none!important;
        border-radius: 23px!important;
        background-color: deeppink!important;
    }
    #connectStatus{
        display: none!important;
    }
    #chatBox{
        height: calc(100% - 50px)!important;
        margin-bottom: 0!important;
        border-radius: 29px!important;
        padding: 20px!important;
    }
    .comboclass{
        top: -78px!important;
    }
    #practice-menu-big{
        width: 100%!important;
    }
    #settingsBox{
        top: 60px!important;
        width: 50vw!important;
        height: calc(100vh - 60px)!important;
        transition-duration: .25s!important;
        transition-duration: .25s;
        left: 50vw!important;
    }

    #settingsBox > button{
        border: 0!important;
        padding: 10px 15px!important;
        border-radius: 20px!important;
        background-color: deeppink!important;
        color: #fff!important;
        width: 50%!important;
        margin: 0!important;
        float: left!important;
        height: 40px!important;
        font-weight: bold!important;
        outline: none!important;
    }
    #settingsBox > button svg{
        display: none!important;
    }

    #settingsBox .settingsTabs{
        height: calc(100% - 40px)!important;
    }

    #settingsBox .setTab{
        height: calc(100% - 47px)!important;
        margin-top: 14px!important;
        border-radius: 0px 22px 22px!important;
        border-color: mediumpurple!important;
    }
    #tabsMenu a{
        background-color: deeppink!important;
        border: 0!important;
        padding: 15px!important;
        border-radius: 20px 20px 0 0!important;
        color: #fff!important;
    }
    #tabsMenu a.active{
        background-color: lightpink!important;
        color: #212121!important;
    }
    #lobbyBox{
        height: calc(100vh - 60px)!important;
        top: -20px!important;
        left: 0%!important;
        width: calc(100vw - 700px)!important;
        margin: 0!important;
        border: 0!important;
        border-radius: 22px 0 0 22px!important;
        padding: 20px!important;
        transition-duration: .25s;
    }
    #lobbyBox.showed{
        left: 0!important;
    }

    #lobbyBottom button{
        border: 0;
        padding: 10px 15px!important;
        border-radius: 20px!important;
        background-color: deeppink!important;
        color: #fff!important;
        height: 40px!important;
        font-weight: bold!important;
        outline: none!important;
    }
    #lobbyBottom svg{display: none!important}
    #editRoomButton{background-color: purple!important;}
    #alert{
        position: absolute;
        padding: 15px 40px;
        background-color: deeppink;
        color: #fff;
        left: 50vw;
        border-radius: 40px;
        transform: translateX(-50%);
        bottom: 20px;
        font-weight: bold;
        opacity: 0;
        transition-duration: .25s;
        font-size: 16px;
    }
    #alert.showed{
        opacity: 1;
        z-index: 999;
    }
    #buttonsBox button:disabled{
        background-color: pink!important;
        color: #464646!important;
    }
    .slot{
        cursor: pointer!important;
    }
    .slot.expanded{
        z-index: 999!important;
        top: 0!important;
        width: 150px!important;
        left: -160px!important;
    }
    .slot.expanded canvas{
        width: 150px!important;
    }
    .slot.expanded > div{
        margin-top: 10px!important;
    }
    .slot.expanded > span{
        background-color: #212121!important;
        text-align: center!important;
        width: 150px!important;
        height: 50px!important;
    }
    .slot.expanded .bgLayer{
        background-color: #212121!important;
    }
    .slot.expanded a{
       font-size: 16px!important;
    }
    nav a{cursor:pointer!important}
`;
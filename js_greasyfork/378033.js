// ==UserScript==
// @name         DHM Fixed
// @namespace    FileFace
// @version      1.2.5
// @description  Improve the desktop experience of Diamond Hunt Mobile
// @author       kape142
// @match        *.diamondhunt.app/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378033/DHM%20Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/378033/DHM%20Fixed.meta.js
// ==/UserScript==
/*jshint multistr: true */
/*jslint es5: true */

/*
TODO

Main:
display ticks for next attack on mob and player

Shortcuts:

Fixes:
Set standard values for menus manually, find good standards for this option
option to filter out loot from monsters unless they contain e.g. chests/sword/bow
text for shiny monster

ActivityLog:
re-add boats
button to open on mobile
Design work to make it less ugly
add timestamp
filter before saving
filter search saved data

All smittys functions with no parameters:
Object.keys(window).map(a=>{return {key: a, function: window[a]}}).filter(a=>!!(a.function && a.function.constructor && a.function.call && a.function.apply)).filter(a=>a.function.toString().indexOf("(")+1 == a.function.toString().indexOf(")")).filter(a=>!a.function.toString().includes("native code"))

*/

(function() {
    'use strict';

    var Program = {};

    //Main
    Program.Main = {};

    Program.Main.IDs = {}

    Program.Main.initialToggle = 1;

    Program.Main.dialogueID = "";

    Program.Main.toggle = (Module, key) => {
        if(window.localStorage.getItem(key) == 1){
            window.localStorage.setItem(key, 0);
            Module.destroy?Module.destroy():{};
            return false;
        }else{
            window.localStorage.setItem(key, 1);
            Module.init?Module.init():{};
            return true;
        }
    }

    Program.Main.decamelize = (str, separator) => {
        separator = typeof separator === 'undefined' ? ' ' : separator;

        return str
            .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
            .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
            .toLowerCase()
            .replace(/^\w/, c => c.toUpperCase());
    }

    Program.Main.showDimmer = (id) => {
        let dimmer = document.getElementById("timeMachine-dimmer");
        dimmer.style.display = "";
        dimmer.style.opacity = "0.7";
        dimmer.style.backgroundColor = "black";
        dimmer.style.height = Math.max(document.getElementById(id).clientHeight+24,document.getElementById("body-tag-child").clientHeight)+"px";
        window.lastDialogueOpenedIdGlobal = id;
    }

    Program.Main.createSettingsDialogue = (Module, key, title, parentKey) => {
        let buttons = []
        let noSubmenus = true;
        for(let i in Module){
            let submodule = Module[i].Module
            if(submodule && submodule.Submenu){
                noSubmenus = false;
                break;
            }
        }
        for(let i in Module){
            let submodule = Module[i].Module
            if(submodule){
                if(i == "uniqueNameOfShortcut"){
                    continue;
                }
                buttons.push(Program.Main.createButtonModule(i, submodule, key, submodule.title, submodule.image, noSubmenus));
            }
        }
        let dialogue = Program.Main.createDialogue(key, title, buttons, undefined, parentKey)
        Program.Main.IDs[key] = dialogue.id;
        dialogue.style.display = "none"
        let dp = document.getElementById("tab-misc");
        let gs = dp.parentNode;
        gs.insertBefore(dialogue, dp);
    }

    Program.Main.showSettingsDialogue = (parentID, ID) => {
        try{
            window.closeSmittysDialogue(parentID)
        }catch(error){
            console.warn(error)
        }
        document.getElementById(ID).style.display = "";
        Program.Main.showDimmer(ID);
    }

    Program.Main.createDialogue = (key, title, elements, onClose, parentKey) =>{
        let div = document.createElement("div");
        let id = `dialogue-${key}`
        div.id = id;
        div.className = "smittys-dialogues";
        div.style.width = "400px";
        div.style.paddingBottom = "50px";
        div.style.top = "0px";

        if(parentKey){
            let backDiv = document.createElement("div");
            backDiv.onclick = () => Program.Main.showSettingsDialogue(Program.Main.IDs[key],Program.Main.IDs[parentKey]);
            backDiv.style.width = "60px";
            backDiv.style.heigth = "50px";
            backDiv.style.position = "absolute";
            backDiv.style.border = "1px solid gray";
            backDiv.style.padding = "3px";
            backDiv.style.textAlign = "center";
            backDiv.style.backgroundColor = "#1a1a1a";
            backDiv.style.color = "white";
            backDiv.style.borderRadius = "6px";
            backDiv.style.cursor = "pointer";
            let backImg = document.createElement("img");
            backImg.src = "images/back.png";
            backImg.className = "img-small";
            backDiv.appendChild(backImg);
            let backText = document.createTextNode("Back")
            backDiv.appendChild(backText);
            div.appendChild(backDiv);
        }

        let center = document.createElement("center");
        let h1 = document.createElement("h1");
        h1.textContent = title;
        center.appendChild(h1);
        div.appendChild(center);

        div.appendChild(document.createElement("hr"));

        for(let i in elements){
            div.appendChild(elements[i]);
        }

        div.appendChild(document.createElement("br"));
        div.appendChild(document.createElement("br"));

        let input = document.createElement("input");
        input.onclick = onClose?onClose:() => {window.closeSmittysDialogueGlobal()};
        input.type = "button";
        input.value = "Close";
        input.style.cursor = "pointer";
        div.appendChild(input);

        return div;
    }

    Program.Main.createButtonModule = (key, Parent, parentID, title, imageURL, noSubmenus) => {
        let imgId = `img-${key}`;
        let callback = undefined;
        if(Parent.Submenu){
            Program.Main.createSettingsDialogue(Parent.Submenu, key, title, parentID);
            callback = () => Program.Main.showSettingsDialogue(Program.Main.IDs[parentID],Program.Main.IDs[key]);
        }else{
            callback = () => {document.getElementById(imgId).src = Program.Main.toggle(Parent, key)?imageURL:"images/stone.png"};
        }
        return Program.Main.createButton(key, title, Parent.description, (Parent.Submenu || window.localStorage.getItem(key)==1)?imageURL:"images/stone.png", callback, !!Parent.Submenu, noSubmenus);
    }

    Program.Main.createButton = (key, title, description, imageURL, callback, hasSubmenu, noSubmenus) => {
        let div = document.createElement("div");
        let imgId = `img-${key}`;
        div.onclick = callback;
        div.className = "main-button";
        div.style.cursor = "pointer";
        if(description){
            let hoverDiv = document.createElement("div");
            hoverDiv.className = "main-button";
            hoverDiv.style.width = "384px";
            hoverDiv.style.position = "absolute";
            hoverDiv.style.color = "white";
            hoverDiv.style.margin = "0";
            hoverDiv.style.left = "445px";
            hoverDiv.style.display = "none";
            let hoverh6 = document.createElement("h6")
            let hoverTitle = document.createTextNode("Description");
            hoverh6.appendChild(hoverTitle)
            hoverh6.style.margin = "10px";
            hoverh6.style.fontSize = "20px";
            hoverDiv.appendChild(hoverh6);
            let hoverp = document.createElement("p");
            let hoverText = document.createTextNode(description);
            hoverp.appendChild(hoverText);
            hoverp.style.margin = "10px";
            hoverDiv.appendChild(hoverp);
            div.appendChild(hoverDiv);
            div.onmouseover = ()=>{hoverDiv.style.display = ""};
            div.onmouseout = ()=>{hoverDiv.style.display = "none"};
        }

        let table = document.createElement("table");
        let tbody = document.createElement("tbody");
        let tr = document.createElement("tr");

        let td1 = document.createElement("td");
        let img = document.createElement("img");
        img.src = imageURL;
        img.className = "img-medium";
        img.id = imgId;
        td1.appendChild(img);
        tr.appendChild(td1);

        let td2 = document.createElement("td");
        td2.style.textAlign = "right";
        td2.style.paddingRight = "20px";
        let textNode = document.createTextNode(title.toUpperCase());
        td2.appendChild(textNode);
        tr.appendChild(td2);

        let td3 = document.createElement("td");
        td3.style.textAlign = "center";
        td3.style.paddingRight = "10px";
        td3.style.color = "white";
        td3.style.fontSize = "40px";
        td3.appendChild(Program.Main.createIcon("caret-right", true));
        td3.style.visibility = hasSubmenu?"visible":"hidden";
        td3.style.display = (key==="dhmfixed" || noSubmenus)?"none":"";
        tr.appendChild(td3);

        tbody.appendChild(tr);
        table.appendChild(tbody);
        div.appendChild(table);
        return div;
    }

    Program.Main.createListDialogue = (title, key, description, parentKey) => {
        let storedDataString = localStorage.get(key);
        let data;
        if(storedDataString){
            data = JSON.parse(storedDataString);
        }else{
            data = [];
        }
        let elements = [];

        let descP = document.createElement("p");
        descP.appendChild(document.createTextNode(description));
        elements.push(descP);

        for(let k in data){

        }

        Program.Main.createDialogue(key, title, elements, undefined, parentKey)
    }

    Program.Main.addButtonToSettings = () => {
        let div = Program.Main.createButton("dhmfixed", "DHM Fixed", undefined, "images/miningEngineer.png", ()=> Program.Main.showSettingsDialogue("dialogue-profile",Program.Main.IDs.dhmfixed));
        div.querySelector("img").className = "img-small";
        div.querySelectorAll("td")[1].style.fontSize = "12pt";
        let elements = document.querySelectorAll("#tab-misc > .main-button");
        let parent = elements[elements.length-1]
        parent.parentElement.insertBefore(div, parent);
    }

    Program.Main.createIcon = (type, solid) => {
        let icon = document.createElement("i");
        icon.className = "fa"+(solid?"s":"r")+" fa-"+type;
        return icon;
    }

    Program.Main.init = () => {
        let fontAwesome = document.createElement("script");
        fontAwesome.src = "https://kit.fontawesome.com/84465c291e.js"
        fontAwesome.crossorigin = "anonymous";
        fontAwesome.type = "text/javascript";
        document.head.appendChild(fontAwesome);
        Program.Main.addButtonToSettings();
        Program.Main.createSettingsDialogue(Program, "dhmfixed", "DHM Fixed");
    }

    //ActivityLog

    Program.ActivityLog = {}

    Program.ActivityLog.visible = false;

    Program.ActivityLog.saveEntry = (data) => {
        if(!localStorage.getItem("ActivityLog")){
            return;
        }
        let historyString = localStorage.getItem("ActivityLog.history."+window.username)
        if(!historyString){
            historyString = "[]";
        }
        let history = JSON.parse(historyString);
        history.push(data);
        if(history.length > 200){
            history = history.slice(100,history.length);
        }
        let saved = false;
        while(!saved && history.length > 1){
            saved = Program.ActivityLog.saveToLocalStorage(history);
            history = history.slice(history.length/2, history.length);
        }
    }

    Program.ActivityLog.saveToLocalStorage = history => {
        let historyString = JSON.stringify(history)
        try{
            localStorage.setItem("ActivityLog.history."+window.username, historyString);
            return true;
        }
        catch(error){
            console.warn(error);
            console.log(`Could not save Activity log with ${history.length} items and a total of ${historyString.length} characters. Retrying with half size.`)
            return false;
        }
    }

    Program.ActivityLog.saveLoot = (data) => {
        Program.ActivityLog.saveEntry(data);
        let div = Program.ActivityLog.dataToDiv(data);
        let parent = document.getElementById("dialogue-activityLogDisplay");
        let first = parent.children[2];
        parent.insertBefore(div,first);
    }

    Program.ActivityLog.dataToDiv = (data) => {
        if(data.indexOf("combatDataLogEntry")>0){
            return Program.ActivityLog.combatToDiv(JSON.parse(data));
        }
        let array = data.split("~");
        if(array.length<4){
            return document.createElement("div");
        }
        let title = array[0];
        let items = [];
        let startIndex = 1;
        if(!isNaN(array[startIndex])){
            startIndex++;
        }
        for(let i = startIndex; i < array.length; i+=4){
            items.push({
                name: array[i],
                amount: array[i+1],
                backgroundColor: array[i+2],
                borderColor: array[i+3]
            });
        }

        let div = document.createElement("div");
        div.style.color = "black";
        div.style.border = "solid grey 1px";
        div.style.backgroundColor = "white";
        div.style.margin = "10px";

        let h1 = document.createElement("h1");
        h1.style.textAlign = "center";
        h1.textContent = title;
        div.appendChild(h1);

        for(let key in items){
            let item = items[key];
            let span = document.createElement("span");
            span.className = "loot-span";
            span.style.backgroundColor = item.backgroundColor;
            span.style.border = `1px solid ${item.borderColor}`;

            let img = document.createElement("img");
            img.className = "img-small-medium";
            img.src = `images/${item.name}.png`;
            let decamName = Program.Main.decamelize(item.name)
            img.alt = decamName;
            img.title = decamName;
            span.appendChild(img);

            let text = document.createTextNode(item.amount);
            span.appendChild(text);
            div.appendChild(span);
        }
        return div;
    }

    Program.ActivityLog.drawText = (ctx, text, fontSize, color, align, baseline, x, y, maxWidth)=>{
        ctx.font = Program.ActivityLog.createfont(fontSize);
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.textBaseline = baseline;
        if(maxWidth){
            while(ctx.measureText(text).width > maxWidth-10){
                ctx.font = Program.ActivityLog.createfont(--fontSize);
            }
        }
        ctx.fillText(text, x, y);
    }

    Program.ActivityLog.createfont = (size) => {
        return size+'px "Lucida Grande","bitstream vera sans","trebuchet ms","sans-serif","verdana"';
    }

    Program.ActivityLog.combatData = {}

    Program.ActivityLog.getAreaName = (area, monster) => {
        if(area == "resting"){
            switch(monster){
                case "skeletonKing":
                    return "Dungeon Coffin";
                case "skeletonCemetery":
                case "iceSkeletonCemetery":
                case "fireSkeletonCemetery":
                    return "Cemetery"
                case "curiousGhost":
                    return "Ghost Land";
                case "skeletonMage":
                    return "Menu";
            }
            if(monster.includes("coffin")){
               return "Dungeon Coffin";
            }
        }
        return Program.Main.decamelize(area)
    }

    Program.ActivityLog.combatWatcher = (command) => {
        if(localStorage.getItem("ActivityLog") && window.monsterName && window.monsterName!=="none" && window.exploringArea!=="none"){ //gå inn i combat når spilleren trykker knappen i stedet for å vente på serveren?
            if(!Program.ActivityLog.combatData.tick){
                Program.ActivityLog.combatData.tick = 0;
                Program.ActivityLog.combatData.monsterName = Program.Main.decamelize(window.monsterName);
                Program.ActivityLog.combatData.area = Program.ActivityLog.getAreaName(window.exploringArea, window.monsterName);
                Program.ActivityLog.combatData.monsterHp = window.monsterHp;
                Program.ActivityLog.combatData.heroHp = window.heroMaxHp;
                Program.ActivityLog.combatData.data = [[]];
                Program.ActivityLog.combatData.entryType = "combatDataLogEntry";
            }
            if(command.startsWith("HIT_SPLAT")){
                return Program.ActivityLog.saveCombat(command.substring(10));
            }
            if(command.startsWith("REFRESH_ITEMS") && command.indexOf("playtime")>0){
                Program.ActivityLog.combatData.tick++;
                Program.ActivityLog.combatData.data[Program.ActivityLog.combatData.tick] = [];
            }
        }else{
            if(Program.ActivityLog.combatData.tick){
                if(Program.ActivityLog.combatData.monsterName != "Coffin6" && (!Program.ActivityLog.combatData.teleported || Program.ActivityLog.combatData.tick>10)){
                    Program.ActivityLog.addCombatToLog(Program.ActivityLog.combatData);
                }
                Program.ActivityLog.combatData = {};
            }
        }
    }

    Program.ActivityLog.saveCombat = (data) => {
        let log = Program.ActivityLog.combatData.data[Program.ActivityLog.combatData.tick];
        let cleanData = {};
        let dataSplit = data.split("~");
        cleanData.image = dataSplit[0];
        cleanData.borderColor = dataSplit[1];
        cleanData.backgroundColor = dataSplit[2];
        cleanData.target = dataSplit[5].split("-")[2];
        if(!cleanData.target){
            console.log("not hero or monster", data, cleanData);
        }
        if(isNaN(dataSplit[4])){
            cleanData.type = "status";
            cleanData.effect = dataSplit[4];
        }else{
            let dmg = dataSplit[4].split(",").reduce((acc,cur)=>acc+Number(cur),0)
            if(dataSplit[1] == "lime"){
                cleanData.type = "heal";
                cleanData.damage = dmg;
            }else{
                cleanData.type = "damage";
                cleanData.damage = dmg;
            }
        }
        log.push(cleanData);
        Program.ActivityLog.combatData.data[Program.ActivityLog.combatData.tick] = log;
    }

    Program.ActivityLog.addCombatToLog = (data) => {
        Program.ActivityLog.saveEntry(JSON.stringify(data));
        let div = Program.ActivityLog.combatToDiv(data);
        let parent = document.getElementById("dialogue-activityLogDisplay");
        let first = parent.children[2];
        parent.insertBefore(div,first);
    }

    Program.ActivityLog.combatToDiv = (data) => {
        let maxWidth = document.body.clientWidth;
        let maxHeight = document.body.clientHeight;
        let div = document.createElement("div");
        div.style.border = "1px solid grey";
        div.style.backgroundColor = "white";
        div.style.margin = "10px";
        let divFull = document.createElement("div");
        let expandIcon = Program.Main.createIcon("expand", true);
        divFull.appendChild(expandIcon);
        divFull.style.fontSize = "30px";
        divFull.style.textAlign = "center";
        divFull.style.width = "30px";
        divFull.style.height = "30px";
        //divFull.style.backgroundColor = "red";
        divFull.style.position = "absolute";
        divFull.style.right = "30px";
        divFull.style.zIndex = "0";
        divFull.style.cursor = "pointer";
        divFull.style.margin = "4px 5px";
        divFull.onclick = ()=>{
            if(divFull.style.position == "fixed"){
                return;
            }
            let combatLog = document.getElementById("combat-log-fullscreen-div")
            if(combatLog){
                combatLog.click();
            }
            expandIcon.style.display = "none"
            divFull.style.position = "fixed";
            divFull.style.width = Number(maxWidth-200)+"px";
            divFull.style.height = Number(maxHeight-100)+"px";
            divFull.style.cursor = "auto";
            divFull.style.top = "50px";
            divFull.style.left = "100px";
            divFull.style.zIndex = "9";
            divFull.style.margin = "-1px";
            divFull.style.border = "1px solid black";
            let divClose = document.createElement("div");
            divClose.id = "combat-log-fullscreen-div";
            divClose.style.width = "50px";
            divClose.style.height = "50px";
            divClose.style.cursor = "pointer";
            divClose.style.position = "absolute";
            divClose.style.right = "0";
            divClose.style.zIndex = "10";
            divClose.style.fontSize = "50px";
            divClose.style.textAlign = "center";
            divClose.style.margin = "4px 5px";
            let closeIcon = Program.Main.createIcon("window-close", false);
            divClose.appendChild(closeIcon);
            let c = Program.ActivityLog.combatCanvas(data, maxWidth-200, maxHeight-100, 30, true);
            c.style.zIndex = "9";
            let divImage = document.createElement("div");
            divImage.style.width = "50px";
            divImage.style.height = "50px";
            divImage.style.cursor = "pointer";
            divImage.style.position = "absolute";
            divImage.style.right = "60px";
            divImage.style.zIndex = "10";
            divImage.style.fontSize = "50px";
            divImage.style.textAlign = "center";
            divImage.style.margin = "4px 5px";
            let imageIcon = Program.Main.createIcon("image", false);
            divImage.appendChild(imageIcon);
            divImage.onclick = ()=> {
                let imgFile
                try {
                    imgFile = c.toDataURL('image/jpeg', 0.9).split(',')[1];
                } catch(e) {
                    imgFile = c.toDataURL().split(',')[1];
                }
                fetch("https://api.imgur.com/3/image", {
                    method: "POST",
                    headers: {
                        Authorization: "Client-id 7c52702e6caeb09",
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: imgFile
                })
                    .then(a=>a.json())
                    .then(data => {
                    c.remove();
                    divImage.remove();
                    let img = document.createElement("img");
                    img.src = data.data.link;
                    img.height = data.data.height;
                    img.width = data.data.width;
                    let divWrap = document.createElement("div");
                    divWrap.style.position = "absolute";
                    divWrap.style.top = "10px";
                    divWrap.style.width = "400px";
                    divWrap.style.height = "100px";
                    divWrap.style.left = (img.width/4) - 200 + "px";
                    divWrap.style.backgroundColor = "white";
                    divWrap.style.border = "1px solid grey";
                    divWrap.style.boxShadow = "8px 8px rgba(0,0,0,0.3)";
                    divWrap.style.borderRadius = "15px";
                    let divLink = document.createElement("div")
                    divLink.style.width = "100%";
                    let textAreaLink = document.createElement("textarea")
                    textAreaLink.readOnly = "true";
                    textAreaLink.style.resize = "none";
                    textAreaLink.style.width = "75%";
                    textAreaLink.style.height = "30px";
                    textAreaLink.style.margin = "0 5% 10px 0";
                    textAreaLink.style.display = "inline";
                    textAreaLink.style.padding = "6px";
                    let textNodeLink = document.createTextNode(data.data.link);
                    textAreaLink.appendChild(textNodeLink);
                    let divLinkButton = document.createElement("div");
                    divLinkButton.style.width="20%";
                    divLinkButton.style.height="50px";
                    divLinkButton.style.fontSize="50px";
                    divLinkButton.style.display = "inline";
                    let divLinkButtonIcon = Program.Main.createIcon("clipboard")
                    divLinkButton.appendChild(divLinkButtonIcon);
                    let divLinkButtonTextPop = document.createElement("div");
                    let divLinkButtonTextPopText = document.createTextNode("copied!");
                    divLinkButtonTextPop.appendChild(divLinkButtonTextPopText);
                    divLinkButtonTextPop.style.fontSize = "10px";
                    divLinkButtonTextPop.style.position = "absolute";
                    divLinkButtonTextPop.style.top="50px";
                    divLinkButtonTextPop.style.right="0";
                    divLinkButtonTextPop.style.width="20%";
                    divLinkButtonTextPop.style.textAlign="center";
                    divLinkButtonTextPop.style.display="none";
                    divLinkButton.onclick = ()=>{
                        textAreaLink.select();
                        document.execCommand("copy");
                        divLinkButtonTextPop.style.display="";
                        divLinkButtonTextPop.animate({
                            opacity: [ 1, 0.8, 0, 0 ],
                            offset: [ 0, 0.5, 0.7, 1],
                        }, 3000)
                        setTimeout(()=>{divLinkButtonTextPop.style.display="none"}, 2500)
                    }
                    divLinkButton.appendChild(divLinkButtonTextPop);
                    let pCopyInfo = document.createElement("p");
                    pCopyInfo.style.fontSize = "12px";
                    pCopyInfo.style.padding = "0 10px";
                    let pCopyInfoText = document.createTextNode("For platforms that allow direct image upload, like Discord, you can also right-click the image and click \"Copy image\"");
                    pCopyInfo.appendChild(pCopyInfoText);
                    divLink.appendChild(textAreaLink);
                    divLink.appendChild(divLinkButton);
                    divWrap.appendChild(divLink);
                    divWrap.appendChild(pCopyInfo);
                    divFull.appendChild(divWrap);
                    divFull.appendChild(img);
                });
            }
            divClose.onclick = (event)=>{
                event.stopPropagation();
                expandIcon.style.display = ""
                divFull.style.width = "30px";
                divFull.style.height = "30px";
                divFull.style.position = "absolute";
                divFull.style.right = "30px";
                divFull.style.removeProperty("top");
                divFull.style.removeProperty("left");
                divFull.style.removeProperty("border");
                divFull.style.zIndex = "0";
                divFull.style.cursor = "pointer";
                divFull.style.margin = "4px 5px";
                divFull.querySelectorAll("div, canvas, img, textarea").forEach(a=>a.remove());
            }
            divFull.appendChild(divClose);
            divFull.appendChild(divImage);
            divFull.appendChild(c);
        }
        div.appendChild(divFull);
        let c = Program.ActivityLog.combatCanvas(data, 380, 580, 20);
        div.appendChild(c);
        return div;
    }

    Program.ActivityLog.combatCanvas = (data, maxWidth, maxHeight, iconSize, showImages) => {
        let bigFontSize = 30;
        let mediumFontSize = 20;
        let smallFontSize = 10;
        let c = document.createElement("canvas");
        let yOffset = 50;
        let yMove = 0;
        let xOffset = 15;
        let height = (maxHeight - (yOffset * 3 + xOffset * 2))/2;
        let width = maxWidth - 2*xOffset;
        c.width = maxWidth;
        c.height = maxHeight;
        let ctx = c.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, c.width, c.height);
        Program.ActivityLog.drawText(ctx, "Combat in "+data.area, bigFontSize, "black", "center", "top", maxWidth/2, 10, maxWidth-100);
        yMove += yOffset;
        yMove = Program.ActivityLog.drawGraph(ctx, maxWidth, width, height, xOffset, yOffset, yMove, mediumFontSize, smallFontSize, "Hero", data.heroHp, data, "hero", iconSize, showImages)
        yMove += height
        Program.ActivityLog.drawGraph(ctx, maxWidth, width, height, xOffset, yOffset, yMove, mediumFontSize, smallFontSize, data.monsterName, data.monsterHp, data, "monster", iconSize, showImages)
        return c;
    }

    Program.ActivityLog.drawGraph = (ctx, maxWidth, width, height, xOffset, yOffset, yMove, mediumFontSize, smallFontSize, name, maxHp, data, target, iconSize, showImages) => {
        let ticks = data.data.length;
        let wInc = width/ticks;
        let tickGroupSize = 1;
        while(showImages && wInc < iconSize){
            tickGroupSize++;
            wInc = (width/ticks) * tickGroupSize;
        }
        let hInc = height/maxHp;
        let hp = maxHp;
        Program.ActivityLog.drawText(ctx, name, mediumFontSize, "black", "center", "top", maxWidth/2, 10 + yMove);
        yMove += yOffset;
        Program.ActivityLog.drawText(ctx, maxHp+" HP", smallFontSize, "black", "left", "bottom", xOffset, yMove - 5);
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.moveTo(xOffset, yMove);
        let bottomY = yMove+height;
        for(let i = 0; i < ticks; i+= tickGroupSize){
            let moveX = xOffset +i * (wInc/tickGroupSize);
            let tickData = [];
            for(let j = 0; j < tickGroupSize && i + j < ticks; j++){
                tickData = tickData.concat(data.data[i+j]);
            }
            let imageFunctions = []
            for(let j = 0; j < tickData.length; j++){
                if(tickData[j].target == target){
                    if(tickData[j].type == "damage"){
                        hp = Math.max(hp - Number(tickData[j].damage), 0);
                    }
                    if(tickData[j].type == "heal"){
                        let preHp = hp;
                        hp = Math.min(hp + Number(tickData[j].damage), maxHp);
                    }
                    if(showImages && (tickData[j].damage > 0 || tickData[j].type == "status")){
                        imageFunctions.push((imgX,imgY)=>{
                            let img = new Image();
                            img.src = 'images/'+tickData[j].image;
                            img.onload = function(){ //skalere så største er iconSize, andre er riktig forhold
                                let largest = Math.max(img.width, img.height)
                                let wRatio = img.width/largest;
                                let hRatio = img.height/largest;
                                let wSize = iconSize*wRatio;
                                let hSize = iconSize*hRatio
                                ctx.drawImage(img, imgX-(wSize/2), imgY-(hSize/2), wSize, hSize);
                            }
                        });
                    }
                }
            }
            let moveY = yMove + (height - (hp * hInc));
            let topImgY = Math.min(bottomY - (iconSize * imageFunctions.length), moveY)
            for(let j = 0; j < imageFunctions.length; j++){
                imageFunctions[j](moveX, topImgY+(j*iconSize));
            }
            ctx.lineTo(moveX, moveY);
        }
        ctx.lineTo(xOffset+width, yMove + (height - (hp * hInc)));
        ctx.lineTo(xOffset+width, height + yMove);
        ctx.lineTo(xOffset, height + yMove);
        ctx.lineTo(xOffset, yMove);
        ctx.fill();
        ctx.stroke();
        Program.ActivityLog.drawText(ctx, hp+" HP", smallFontSize, "black", "right", "bottom", width+xOffset, yMove + (height - (hp * hInc)) - 5);
        return yMove;
    }

    Program.ActivityLog.toggleLog = (event) => {
        if(event.keyCode == 9 &&
           !event.altKey &&
           !event.ctrlKey &&
           window.username){
            event.preventDefault();
            if(Program.ActivityLog.visible){
                let combatLogClose = document.getElementById("combat-log-fullscreen-div")
                if(combatLogClose){
                    combatLogClose.click();
                }else{
                    Program.ActivityLog.hideLog()
                }
            }else{
                Program.ActivityLog.showLog();
            }
        }
    }

    Program.ActivityLog.createLog = () => {
        let history = JSON.parse(localStorage.getItem("ActivityLog.history."+window.username));
        if(!history){
            history = [];
        }
        let elements = [];
        for(let i = history.length-1; i >= 0; i--){
            elements.push(Program.ActivityLog.dataToDiv(history[i]))
        }
        let dialogue = Program.Main.createDialogue("activityLogDisplay", "Activity Log", elements, Program.ActivityLog.hideLog);
        dialogue.style.display = "none";
        Program.ActivityLog.dialogueId = dialogue.id;
        Program.ActivityLog.visible = false;
        let dp = document.getElementById("tab-misc");
        let gs = dp.parentNode;
        gs.insertBefore(dialogue, dp);
    }

    Program.ActivityLog.showLog = () => {
        window.closeSmittysDialogueGlobal()
        Program.ActivityLog.visible = true;
        document.getElementById(Program.ActivityLog.dialogueId).style.display = "";
        Program.Main.showDimmer(Program.ActivityLog.dialogueId);
    }
    Program.ActivityLog.hideLog = () => {
        let combatLogClose = document.getElementById("combat-log-fullscreen-div")
        if(combatLogClose){
            combatLogClose.click();
        }
        Program.ActivityLog.visible = false;
        document.getElementById("timeMachine-dimmer").style.display = "none";
        document.getElementById(Program.ActivityLog.dialogueId).style.display = "none";
    }

    Program.ActivityLog.init = () => {
        Program.WindowExtensions.add("lootDialogue", {
            module: "ActivityLog",
            func: Program.ActivityLog.saveLoot,
            priority: 2
        });
        Program.WindowExtensions.add("command", {
            module: "ActivityLog",
            func: Program.ActivityLog.combatWatcher,
            priority: 1
        });
        const func = () => {
            if(window.username){
                //console.log("ok");
                Program.ActivityLog.createLog();
            }else{
                //console.log("waiting");
                setTimeout(func,1000);
            }
        }
        func();
        const toggleVisible = ()=>{
            if(window.lastDialogueOpenedIdGlobal == Program.ActivityLog.dialogueId){
                let combatLogClose = document.getElementById("combat-log-fullscreen-div")
                if(combatLogClose){
                    combatLogClose.click();
                }
                Program.ActivityLog.visible = !Program.ActivityLog.visible;
            }
            //Program.WindowExtensions._functions.closeSmittysDialogueGlobal();
        };
        Program.WindowExtensions.add("closeSmittysDialogueGlobal", {
            module: "ActivityLog",
            func: toggleVisible,
            priority: 1,
        });
        document.addEventListener("keydown", Program.ActivityLog.toggleLog);
    }

    Program.ActivityLog.destroy = () => {
        document.removeEventListener("keydown", Program.ActivityLog.toggleLog);
        document.getElementById(Program.ActivityLog.dialogueId).remove();
    }

    Program.ActivityLog.Module = {
        title: "Activity Log",
        image: "images/titanium.png",
        init: Program.ActivityLog.init,
        destroy: Program.ActivityLog.destroy,
        description: `Keeps track of loot and combat data. Press "tab" to open`,
        initialToggle: 1,
    }


    //Fixes
    Program.Fixes = {}

    Program.Fixes.filterLootDialogue = (data) => {
        if(localStorage.getItem("filterLoot")==1){
           let parts = data.split("~");
            if(parts[0]=="Harvest All" || parts[0] == "Chop All"){
                return {error: `Ignored loot dialogue: ${parts[0]}`};
            }
        }
    }

    Program.Fixes.keepAlive = (data) => {
        if(localStorage.getItem("keepAlive")==1){
            if(data.includes("PAUSE_DATA")){
                return {modifications: ["PAUSE_DATA=0"]};
            }
        }
    }

    Program.Fixes.tenBuckets = (recipe, tab) => {
        if(localStorage.getItem("tenBuckets")==1){
            if(recipe.itemName.includes("ironBucket")){
                window.amountWidgetAmountInputElementGlobal.value = 10;
            }
        }
    }

    Program.Fixes.disableSell = (data) => {
        if(localStorage.getItem("disableSell") == 1){
            return {error: `Selling items to NPCs is disabled, not selling ${data}`}
        }
    }

    Program.Fixes.instantTeleport = () => {
        Program.ActivityLog.combatData.teleported = true;
        if(localStorage.getItem("instantTeleport") == 1){
            window.sendBytes("CAST_COMBAT_SPELL=teleportSpell");
            return {error: `Teleported without confirmation dialogue`}
        }
    }

    Program.Fixes.bloodCrystalDisplay = {}

    Program.Fixes.bloodCrystalDisplay.init = () => {
        document.querySelector("#top-status-bar br").remove()
        document.querySelector("#top-status-bar img[src='images/bloodCrystals.png']").style.marginLeft = "20px";
    }

    Program.Fixes.bloodCrystalDisplay.destroy = () => {
        let bc = document.querySelector("#top-status-bar img[src='images/bloodCrystals.png']")
        let br = document.createElement("br")
        bc.parentElement.insertBefore(br,bc)
        document.querySelector("#top-status-bar img[src='images/bloodCrystals.png']").style.marginLeft = "inherit";
    }

    Program.Fixes.fixCoinSpanInit = () => {
        let coinSpan = document.getElementById("top-bar-bc").parentElement;
        let coinClick = coinSpan.onclick;
        coinSpan.onclick = ()=>{};
        let coinSubSpan = document.createElement("span")
        coinSubSpan.id = "top-bar-coins";
        coinSpan.insertBefore(coinSubSpan, document.getElementById("top-bar-bc"));
        let coinImage = coinSpan.children[0];
        let coinText = coinSpan.children[1];
        coinSubSpan.appendChild(coinImage);
        coinSubSpan.appendChild(coinText);
        coinSubSpan.onclick=coinClick;
    }

    Program.Fixes.fixCoinSpanDestroy = () => {
        let coinSpan = document.getElementById("top-bar-bc").parentElement;
        let coinSubSpan = document.getElementById("top-bar-coins");
        coinSpan.onclick = coinSubSpan.onclick;
        let coinImage = coinSubSpan.children[0];
        let coinText = coinSubSpan.children[1];
        coinSpan.insertBefore(coinImage, coinSubSpan);
        coinSpan.insertBefore(coinText, coinSubSpan);
        coinSubSpan.remove();
    }

    Program.Fixes.multiTrade = {}

    Program.Fixes.multiTrade.backgroundColors = {}

    Program.Fixes.multiTrade.add = itemName => {
        if(localStorage.getItem("multiTrade") == 1){
            if(window.isTradable(itemName)){
                window.lastItemSelectedTradingGlobal= itemName;
                window.initAmountWidget(
                    "amount-widget-tradingPost",
                    itemName,
                    1,
                    [itemName],
                    [1],
                    "images/tradingPost.png",
                    "images/"+ itemName+ ".png",
                    "",
                    "NO_CAP"
                );
                window.openDialogue("dialogue-tradingPost-enterAmount","90%")
            }else{
                window.addingItemToTradeBooleanGlobal=false;
            }
            return {error: `Not returning to trade post because Multi Trade is enabled`}
        }
    }

    Program.Fixes.multiTrade.post = (itemName, amount) => {
        if(localStorage.getItem("multiTrade") == 1){
            let element = document.querySelector(`#tab-${window.lastTabId} #item-box-${itemName}`)
            if(element){
                if(!Program.Fixes.multiTrade.backgroundColors[itemName]){
                    Program.Fixes.multiTrade.backgroundColors[itemName] = element.style.backgroundColor
                }
                element.style.backgroundColor = "#1E7B47"
            }
            if(window.tradingItemNamesArray.filter(a=>a!="none").length>=3){
                window.addingItemToTradeBooleanGlobal=false;
                window.navigate("tradingPost")
            }
        }
    }

    Program.Fixes.multiTrade.remove = (index) => {
        if(localStorage.getItem("multiTrade") == 1){
            let itemName = window.tradingItemNamesArray[index]
            let element = document.querySelector(`#item-box-${itemName}`);
            if(element){
                element.style.backgroundColor = Program.Fixes.multiTrade.backgroundColors[itemName];
            }
            Program.Fixes.multiTrade.backgroundColors[itemName] = undefined;
        }
    }

    Program.Fixes.multiTrade.end = () => {
        if(localStorage.getItem("multiTrade") == 1){
            window.tradingItemNamesArray.filter(a=>a!="none").forEach(a=>{
                let element = document.querySelector(`#item-box-${a}`)
                if(element){
                    element.style.backgroundColor = Program.Fixes.multiTrade.backgroundColors[a]?Program.Fixes.multiTrade.backgroundColors[a]:element.style.backgroundColor
                }
            });
            Program.Fixes.multiTrade.backgroundColors = {}
        }
    }

    Program.Fixes.multiTrade.init = () => {
        Program.Fixes.multiTrade.backgroundColors = {}
        Program.Fixes.fixCoinSpanInit();
    }

    Program.Fixes.multiTrade.destroy = () => {
        window.tradingItemNamesArray.filter(a=>a!="none").forEach(a=>{
            document.querySelector(`#item-box-${a}`).style.backgroundColor = Program.Fixes.multiTrade.backgroundColors[a]?Program.Fixes.multiTrade.backgroundColors[a]:document.querySelector(`#item-box-${a}`).style.backgroundColor
        });
        Program.Fixes.multiTrade.backgroundColors = {}
        Program.Fixes.fixCoinSpanDestroy();
    }

    Program.Fixes.potionCleanup = {}

    Program.Fixes.potionCleanup.init = ()=>{
        Program.Fixes.potionCleanup.potions = {}
    }

    Program.Fixes.potionCleanup.destroy = ()=>{
        for(let potionName in Program.Fixes.potionCleanup.potions){
            if(Program.Fixes.potionCleanup.potions[potionName].showing == false){
                return;
            }
            let potionElement = document.getElementById(potionName + "-timer")
            if(!potionElement){
                return;
            }
            let potionElementBox = potionElement.parentElement
            potionElementBox.onclick = Program.Fixes.potionCleanup.potions[potionName].oldOnClick
            potionElementBox.onmouseover = ()=>{}
            potionElementBox.onmouseout = ()=>{}
        }
        Program.Fixes.potionCleanup.potions = {}
    }

    Program.Fixes.potionCleanup.potions = {}

    Program.Fixes.potionCleanup.zIndex = 1;

    Program.Fixes.potionCleanup.clean = (timerName) => {
        if(localStorage.getItem("potionCleanupEnabled") == 1){
            var potionName = timerName.substr(0, timerName.length - 5);
            var potionTime = window[potionName+"Timer"];
            if (potionTime < 0) {
                Program.Fixes.potionCleanup.potions[potionName] = {showing: false};
                return
            };
            if (!window.isNotNull(document.getElementById(potionName + "-timer"))) {
                window.addToBrewingPotionTimers(potionName, "item-section-potions-active")
            };
            let potionElement = document.getElementById(potionName + "-timer")
            let potionElementBox = document.getElementById(potionName + "-potion-timer");
            if(!Program.Fixes.potionCleanup.potions[potionName] || Program.Fixes.potionCleanup.potions[potionName].showing != 1){
                let clone = potionElementBox.cloneNode(true);
                clone.style.position = "absolute";
                clone.style.marginLeft = "-7px";
                clone.style.marginTop = "-7px";
                clone.style.padding = "6px";
                clone.style.borderWidth = "2px";
                clone.style.transform = "translateX(-25%)";
                clone.id = potionName + "potion-timer-wrapper";
                clone.children[1].id = potionName + "-timer-wrapper"
                Program.Fixes.potionCleanup.potions[potionName] = {showing: true, clone}
                Program.Fixes.potionCleanup.potions[potionName].oldOnClick = potionElementBox.onclick;
                potionElementBox.onclick = ()=>{
                    if(localStorage.getItem("potionCleanupClickChange") == 1){
                        window.clicksItem(potionName);
                    }else{
                        Program.Fixes.potionCleanup.potions[potionName].oldOnClick();
                    }
                };
                potionElementBox.onmouseover = ()=>{
                    if(localStorage.getItem("potionCleanupHover") == 1){
                        for(let key in Program.Fixes.potionCleanup.potions){
                            Program.Fixes.potionCleanup.potions[key].clone.remove();
                        }
                        potionElementBox.insertBefore(clone, potionElementBox.firstElementChild);
                        clone.style.zIndex = ++Program.Fixes.potionCleanup.zIndex;
                        if(Program.Fixes.potionCleanup.zIndex>900){
                            Program.Fixes.potionCleanup.zIndex = 5;
                        }
                        Program.Fixes.potionCleanup.potions[potionName].hovering = true;
                        Program.Fixes.potionCleanup.potions[potionName].hoveringClone = true;
                        clone.children[1].innerHTML = window.formatTime(window[potionName+"Timer"]);
                    }
                };
                clone.onmouseover = ()=>{
                    Program.Fixes.potionCleanup.potions[potionName].hoveringClone = true;
                }
                potionElementBox.onmouseout = ()=>{
                    Program.Fixes.potionCleanup.potions[potionName].hovering = false;
                    if(!Program.Fixes.potionCleanup.potions[potionName].hoveringClone){
                        clone.remove();
                        potionElement.innerHTML = Math.ceil(window[potionName+"Timer"]/window.getPotionTimer(potionName));
                    }
                };
                clone.onmouseout = ()=>{
                    Program.Fixes.potionCleanup.potions[potionName].hoveringClone = false;
                    if(!Program.Fixes.potionCleanup.potions[potionName].hovering){
                        clone.remove();
                        potionElement.innerHTML = Math.ceil(window[potionName+"Timer"]/window.getPotionTimer(potionName));
                    }
                };
            }
            let clone = Program.Fixes.potionCleanup.potions[potionName].clone;
            if(Program.Fixes.potionCleanup.potions[potionName].hovering == true || Program.Fixes.potionCleanup.potions[potionName].hoveringClone == true){
                if([clone, potionElementBox].includes(potionElementBox.parentElement.querySelector('div.potion-timer:hover'))){
                    clone.children[1].innerHTML = window.formatTime(potionTime);
                }else{
                    clone.remove();
                    potionElement.innerHTML = Math.ceil(potionTime/window.getPotionTimer(potionName));
                }
            }else{
                potionElement.innerHTML = Math.ceil(potionTime/window.getPotionTimer(potionName));
            }
            if (potionTime == 0) {
                potionElementBox.style.display = "none";
            } else {
                potionElementBox.style.display = "";
            }
            return {error: "ok"}
        }
    }

    Program.Fixes.styleSheet = Array.from(document.styleSheets).find(a=>a.href && a.href.includes("diamondhunt.app/css/style.css"));

    Program.Fixes.adjustCss = (selectorText, property, newValue) => {
        if(Program.Fixes.styleSheet){
            let css = Array.from(document.styleSheets[0].cssRules)
            let cssClass = css.find(a=>a.selectorText == selectorText);
            if(cssClass && cssClass.style){
                cssClass.style[property] = newValue
            }
        }
    }

    Program.Fixes.init = ()=>{
        //non-toggleable fixes

        Program.Fixes.adjustCss(".img-small", "width", "30px")
        Program.Fixes.adjustCss(".img-tiny", "width", "30px");
        Program.Fixes.adjustCss("div.dimmer", "minHeight", "100vh");

        Program.WindowExtensions.add("dimScreen", {
            module: "Fixes",
            func: (data)=>{document.getElementById("timeMachine-dimmer").style.height = document.getElementById("body-tag-child").clientHeight},
            priority: 1
        });

        Program.WindowExtensions.add("closeSmittysDialogue", {
            module: "Fixes",
            func: data=>{document.activeElement.blur()},
            priority: -1,
        });

        //toggleable fixes
        Program.WindowExtensions.add("lootDialogue", {
            module: "filterLootDialogue",
            func: Program.Fixes.filterLootDialogue,
            priority: 1
        });

        Program.WindowExtensions.add("sendBytes", {
            module: "keepAlive",
            func: Program.Fixes.keepAlive,
            priority: 1
        });

        Program.WindowExtensions.add("confirmRecipeDialogue", {
            module: "tenBuckets",
            func: Program.Fixes.tenBuckets,
            priority: -1
        });

        /*Program.WindowExtensions.add("openSellDialogue", {
            module: "disableSell",
            func: Program.Fixes.disableSell,
            priority: 1
        });*/

        Program.WindowExtensions.add("confirmTeleportSpell", {
            module: "instantTeleport",
            func: Program.Fixes.instantTeleport,
            priority: 1
        });

        Program.WindowExtensions.add("tryToAddItemToTradeScreen", {
            module: "multiTrade",
            func: Program.Fixes.multiTrade.add,
            priority: 1
        });

        Program.WindowExtensions.add("addTradeItem", {
            module: "multiTrade",
            func: Program.Fixes.multiTrade.post,
            priority: -1
        });

        Program.WindowExtensions.add("removeTradingItem", {
            module: "multiTrade",
            func: Program.Fixes.multiTrade.remove,
            priority: 1
        });

        Program.WindowExtensions.add("resetTrade", {
            module: "multiTrade",
            func: Program.Fixes.multiTrade.end,
            priority: 1
        });

        Program.WindowExtensions.add("refreshPotionTimers", {
            module: "potionCleanup",
            func: Program.Fixes.potionCleanup.clean,
            priority: 1
        });

        Program.WindowExtensions.add("command", {
            module: "custom",
            func: data => {if(data.startsWith("OPERATING_TIMEMACHINE")){return {error: 'skip timemachine dialogue'}}},
            priority: 100
        });
    }

    Program.Fixes.destroy = ()=>{}

    Program.Fixes.Module = {
        title: "Fixes",
        image: "images/promethium.png",
        init: Program.Fixes.init,
        destroy: Program.Fixes.destroy,
        description: `Cointains smaller, individually toggleable, changes and fixes`,
        initialToggle: 1,
        Submenu: {
            filterLoot: {
                Module: {
                    title: "Filter loot",
                    image: "images/promethium.png",
                    description: `Hides "Chop All" and "Harvest All" loot dialogues. They are still added to the activity log`,
                    initialToggle: 0
                }
            },
            keepAlive: {
                Module: {
                    title: "Keep alive",
                    image: "images/promethium.png",
                    description: `Keeps the connection to the server alive even if the game loses focus`,
                    initialToggle: 1
                }
            },
            tenBuckets: {
                Module: {
                    title: "Ten buckets",
                    image: "images/promethium.png",
                    description: `Sets the default amount of buckets to craft to 10 instead of 1`,
                    initialToggle: 1
                }
            },
            instantTeleport: {
                Module: {
                    title: "Instant TP",
                    image: "images/promethium.png",
                    description: `Teleports without confirmation dialogue`,
                    initialToggle: 0
                }
            },
            bloodCrystalDisplay: {
                Module: {
                    title: "BC display",
                    image: "images/promethium.png",
                    description: `Move Blood Crystal icon to the same horizontal level as coins`,
                    initialToggle: 0,
                    init: Program.Fixes.bloodCrystalDisplay.init,
                    destroy: Program.Fixes.bloodCrystalDisplay.destroy
                }
            },
            multiTrade: {
                Module: {
                    title: "Multi Trade",
                    image: "images/promethium.png",
                    description: `Trade multiple items without returning to the trade post between each item`,
                    initialToggle: 0,
                    init: Program.Fixes.multiTrade.init,
                    destroy: Program.Fixes.multiTrade.destroy
                }
            },
            potionCleanup: {
                Module: {
                    title: "Pot cleanup",
                    image: "images/promethium.png",
                    description: `Declutters the display of active potions by hiding some information`,
                    initialToggle: 1,
                    Submenu: {
                        potionCleanupEnabled: {
                            Module: {
                                title: "Enable",
                                image: "images/promethium.png",
                                description: `Declutters the display of active potions by hiding some information. Disabling this will override the other options`,
                                initialToggle: 0,
                                init: Program.Fixes.potionCleanup.init,
                                destroy: Program.Fixes.potionCleanup.destroy,
                            }
                        },
                        potionCleanupHover: {
                            Module: {
                                title: "Hover info",
                                image: "images/promethium.png",
                                description: `Shows the full timer when you hover over the potion`,
                                initialToggle: 1
                            }
                        },
                        potionCleanupClickChange: {
                            Module: {
                                title: "Fast drink",
                                image: "images/promethium.png",
                                description: `Replaces the menu that comes up when you click on a potion timer with the menu that would come up if you clicked the potion normally in the brewing tab. If you mostly want to click the potions to drink up to max, enabling this will let you drink potions with one less click`,
                                initialToggle: 0
                            }
                        }
                    }
                }
            },/*
            disableSell: {
                Module: {
                    title: "Disable sell",
                    image: "images/promethium.png",
                    description: `Disable selling of all items, just some items, or all items except some items`,
                    initialToggle: 1,
                    Submenu: {
                        disableSellEnabled: {
                            Module: {
                                title: "Enable",
                                image: "images/promethium.png",
                                description: `Disables all selling except for the items in the whitelist below`,
                                initialToggle: 0
                            }
                        },
                        disableSellWhitelist: {
                            Module: {
                                title: "Whitelist",
                                image: "images/promethium.png",
                                description: `Items added to this list can be sold even with selling disabled`,
                                initialToggle: 1,
                                click: ()=>Program.Main.showListDialogue("Whitelist","disableSellWhitelistStorage",Program.Main.regexDescription)
                            }
                        },
                        disableSellBlacklist: {
                            Module: {
                                title: "Blacklist",
                                image: "images/promethium.png",
                                description: `Items added to this list can not be sold even without selling disabled`,
                                initialToggle: 1,
                                click: ()=>Program.Main.showListDialogue("Blacklist","disableSellBlacklistStorage",Program.Main.regexDescription)
                            }
                        }
                    }
                }
            },*/
        }
    }

    //Shortcuts

    Program.Shortcuts = {}

    Program.Shortcuts.functions = {};
    Program.Shortcuts.keyheld = {};

    Program.Shortcuts.keyup = (event)=>{
        Program.Shortcuts.keyheld[event.keyCode] = false;
        return false;
    };

    Program.Shortcuts.keydown = (event)=>{
        if(event.keyCode === 27 && //27 = Esc
           ["input","textarea"].includes(document.activeElement.localName)){
            document.activeElement.blur();
        }
        if(!Program.Shortcuts.keyheld[event.keyCode] &&
           Program.Shortcuts.functions[event.keyCode] &&
           !["input","textarea"].includes(document.activeElement.localName) &&
           !event.ctrlKey &&
           window.username){
            if(Program.Shortcuts.tryInvoke(event.keyCode)){
                event.preventDefault();
                Program.Shortcuts.keyheld[event.keyCode] = true;
            }
        }
        return false;
    };

    Program.Shortcuts.tryInvoke = (keycode) => {
        let functionList = Program.Shortcuts.functions[keycode];
        for(let key in functionList){
            if(functionList[key].func()){
                return true;
            }
        }
    }

    Program.Shortcuts.init = ()=>{
        document.addEventListener("keyup", Program.Shortcuts.keyup);
        document.addEventListener("keydown", Program.Shortcuts.keydown);
        Program.Shortcuts.functions = {};
        for(let key in Program.Shortcuts.Module.Submenu){
            let shortcutCategory = Program.Shortcuts.Module.Submenu[key];
            if(!shortcutCategory.Module){
                continue;
            }
            for(let subKey in shortcutCategory.Module.Submenu){
                let shortcut = shortcutCategory.Module.Submenu[subKey];
                let func = ()=>{
                    if(localStorage.getItem(subKey) == 1){
                        return shortcut.Module.func();
                    }
                }
                let charCode = shortcut.Module.key.charCodeAt(0)
                if(!Program.Shortcuts.functions[charCode]){
                    Program.Shortcuts.functions[charCode] = [];
                }
                Program.Shortcuts.functions[charCode].push({
                    priority: shortcut.Module.priority,
                    func
                });
            }
        }
        for(let charCode in Program.Shortcuts.functions){
            Program.Shortcuts.functions[charCode].sort((a,b)=>b.priority-a.priority)
        }
    }

    Program.Shortcuts.destroy = ()=>{
        document.removeEventListener("keyup", Program.Shortcuts.keyup);
        document.removeEventListener("keydown", Program.Shortcuts.keydown);
    }

    Program.Shortcuts.Module = {
        title: "Shortcuts",
        image: "images/gold.png",
        init: Program.Shortcuts.init,
        destroy: Program.Shortcuts.destroy,
        description: `Shortcuts for many common actions. Each shortcut can be toggled individually`,
        initialToggle: 1,
        Submenu: {
            tabChangeShortcuts: {
                Module: {
                    title: "Change tabs",
                    image: "images/gold.png",
                    description: `Shortcuts to navigate between parts of the game`,
                    initialToggle: 1,
                    Submenu: {
                        mineTab: {
                            Module: {
                                title: "(M)ining",
                                image: "images/gold.png",
                                description: `Change to the mining tab`,
                                initialToggle: 1,
                                key: "M",
                                priority: 1,
                                func: ()=>{window.navigateAndLoadImages('mining', 'item-section-mining-1');return true;}
                            }
                        },
                        craftingTab: {
                            Module: {
                                title: "(C)rafting",
                                image: "images/gold.png",
                                description: `Change to the crafting tab`,
                                initialToggle: 1,
                                key: "C",
                                priority: 1,
                                func: ()=>{window.navigateAndLoadImages('crafting', 'item-section-crafting-1');return true;}
                            }
                        },
                        woodcuttingTab: {
                            Module: {
                                title: "(W)oodcutting",
                                image: "images/gold.png",
                                description: `Change to the woodcutting tab. Does not work while in combat`,
                                initialToggle: 1,
                                key: "W",
                                priority: 1,
                                func: ()=>{window.navigateAndLoadImages('woodcutting', 'item-section-woodcutting-1');return true;}
                            }
                        },
                        farmingTab: {
                            Module: {
                                title: "(F)arming",
                                image: "images/gold.png",
                                description: `Change to the farming tab. Does not work while in combat`,
                                initialToggle: 1,
                                key: "F",
                                priority: 1,
                                func: ()=>{window.navigateAndLoadImages('farming', 'item-section-farming-1');return true;}
                            }
                        },
                        brewingTab: {
                            Module: {
                                title: "(B)rewing",
                                image: "images/gold.png",
                                description: `Change to the brewing tab`,
                                initialToggle: 1,
                                key: "B",
                                priority: 1,
                                func: ()=>{window.navigateAndLoadImages('brewing', 'item-section-brewing-1');return true;}
                            }
                        },
                        exploringTab: {
                            Module: {
                                title: "(E)xploring",
                                image: "images/gold.png",
                                description: `Change to the exploring tab. Does not work while in combat`,
                                initialToggle: 1,
                                key: "E",
                                priority: 1,
                                func: ()=>{window.navigateAndLoadImages('exploring', 'item-section-exploring-1');return true;}
                            }
                        },
                        cookingTab: {
                            Module: {
                                title: "C(O)oking",
                                image: "images/gold.png",
                                description: `Change to the cooking tab`,
                                initialToggle: 1,
                                key: "O",
                                priority: 1,
                                func: ()=>{window.navigateAndLoadImages('cooking', 'item-section-cooking-1');return true;}
                            }
                        },
                        homeTab: {
                            Module: {
                                title: "(T) Home",
                                image: "images/gold.png",
                                description: `Change to the home tab`,
                                initialToggle: 1,
                                key: "T",
                                priority: 1,
                                func: ()=>{window.navigateAndLoadImages('home', 'item-section-home-1');return true;}
                            }
                        },
                    }
                }
            },
            homeShortcuts: {
                Module: {
                    title: "Home",
                    image: "images/gold.png",
                    description: `Shortcuts that work within the home tab`,
                    initialToggle: 1,
                    Submenu: {
                        clickTradingPost: {
                            Module: {
                                title: "(T) Trading",
                                image: "images/gold.png",
                                description: `Open the trading menu`,
                                initialToggle: 1,
                                key: "T",
                                priority: 2,
                                func: ()=>{
                                    if(document.getElementById("tab-home").style.display != "none"){
                                        window.clicksItem('tradingPost');
                                        return true;
                                    }
                                }
                            }
                        },
                        confirmTrade: {
                            Module: {
                                title: "(Space) Accept",
                                image: "images/gold.png",
                                description: `While in a trade with someone and in the trading view, press 'Space' to confirm the trade`,
                                initialToggle: 1,
                                key: " ",
                                priority: 1,
                                func: ()=>{
                                    if(document.getElementById("tab-tradingPost").style.display != "none"){
                                        window.acceptTrade();
                                        return true;
                                    }
                                }
                            }
                        },
                    }
                }
            },
            craftingShortcuts: {
                Module: {
                    title: "Crafting",
                    image: "images/gold.png",
                    description: `Shortcuts that work within the crafting tab`,
                    initialToggle: 1,
                    Submenu: {
                        smeltInFurnace: {
                            Module: {
                                title: "(S) Smelt",
                                image: "images/gold.png",
                                description: `Open the furnace to select an ore to smelt`,
                                initialToggle: 1,
                                key: "S",
                                priority: 4,
                                func: ()=>{
                                    if(document.getElementById("tab-crafting").style.display != "none"){
                                        window.clicksFurnace();
                                    }
                                }
                            }
                        },
                        smeltBronze: {
                            Module: {
                                title: "(B) Bronze",
                                image: "images/gold.png",
                                description: `While the dialogue for selecting what to smelt is open, press 'B' to select bronze`,
                                initialToggle: 1,
                                key: "B",
                                priority: 2,
                                func: ()=>{
                                    if(document.getElementById("dialogue-furnace1").style.display != "none"){
                                        window.chooseOreForFurnace('copper');
                                        window.closeSmittysDialogue('dialogue-furnace1');
                                        return true;
                                    }
                                }
                            }
                        },
                        smeltIron: {
                            Module: {
                                title: "(I) Iron",
                                image: "images/gold.png",
                                description: `While the dialogue for selecting what to smelt is open, press 'I' to select iron`,
                                initialToggle: 1,
                                key: "I",
                                priority: 1,
                                func: ()=>{
                                    if(document.getElementById("dialogue-furnace1").style.display != "none"){
                                        window.chooseOreForFurnace('iron');
                                        window.closeSmittysDialogue('dialogue-furnace1');
                                        return true;
                                    }
                                }
                            }
                        },
                        smeltSilver: {
                            Module: {
                                title: "(S) Silver",
                                image: "images/gold.png",
                                description: `While the dialogue for selecting what to smelt is open, press 'S' to select silver`,
                                initialToggle: 1,
                                key: "S",
                                priority: 8,
                                func: ()=>{
                                    if(document.getElementById("dialogue-furnace1").style.display != "none"){
                                        window.chooseOreForFurnace('silver');
                                        window.closeSmittysDialogue('dialogue-furnace1');
                                        return true;
                                    }
                                }
                            }
                        },
                        smeltGold: {
                            Module: {
                                title: "(G) Gold",
                                image: "images/gold.png",
                                description: `While the dialogue for selecting what to smelt is open, press 'G' to select gold`,
                                initialToggle: 1,
                                key: "G",
                                priority: 3,
                                func: ()=>{
                                    if(document.getElementById("dialogue-furnace1").style.display != "none"){
                                        window.chooseOreForFurnace('gold');
                                        window.closeSmittysDialogue('dialogue-furnace1');
                                        return true;
                                    }
                                }
                            }
                        },
                        smeltPromethium: {
                            Module: {
                                title: "(P) Promethium",
                                image: "images/gold.png",
                                description: `While the dialogue for selecting what to smelt is open, press 'P' to select promethium`,
                                initialToggle: 1,
                                key: "P",
                                priority: 1,
                                func: ()=>{
                                    if(document.getElementById("dialogue-furnace1").style.display != "none"){
                                        window.chooseOreForFurnace('promethium');
                                        window.closeSmittysDialogue('dialogue-furnace1');
                                        return true;
                                    }
                                }
                            }
                        },
                        smeltTitanium: {
                            Module: {
                                title: "(T) Titanium",
                                image: "images/gold.png",
                                description: `While the dialogue for selecting what to smelt is open, press 'T' to select titanium`,
                                initialToggle: 1,
                                key: "T",
                                priority: 3,
                                func: ()=>{
                                    if(document.getElementById("dialogue-furnace1").style.display != "none"){
                                        window.chooseOreForFurnace('titanium');
                                        window.closeSmittysDialogue('dialogue-furnace1');
                                        return true;
                                    }
                                }
                            }
                        },
                        smeltAncientOre: {
                            Module: {
                                title: "(A) Ancient ore",
                                image: "images/gold.png",
                                description: `While the dialogue for selecting what to smelt is open, press 'A' to select ancient ore`,
                                initialToggle: 1,
                                key: "A",
                                priority: 4,
                                func: ()=>{
                                    if(document.getElementById("dialogue-furnace1").style.display != "none"){
                                        window.chooseOreForFurnace('ancientOre');
                                        window.closeSmittysDialogue('dialogue-furnace1');
                                        return true;
                                    }
                                }
                            }
                        },
                        startSmelting: {
                            Module: {
                                title: "(S) Start smelt",
                                image: "images/gold.png",
                                description: `After selecting what ore to smelt, press 'S' to confirm and start smelting`,
                                initialToggle: 1,
                                key: "S",
                                priority: 9,
                                func: ()=>{
                                    if(document.getElementById("dialogue-furnace2").style.display != "none"){
                                        window.startSmelting();
                                        window.closeSmittysDialogue('dialogue-furnace2');
                                        return true;
                                    }
                                }
                            }
                        },
                        useRefinery: {
                            Module: {
                                title: "(R) Refinery",
                                image: "images/gold.png",
                                description: `Open the refinery to select a bar to refine`,
                                initialToggle: 1,
                                key: "R",
                                priority: 1.5,
                                func: ()=>{
                                    if(document.getElementById("tab-crafting").style.display != "none" ||
                                       document.getElementById("notification-goldBarRefineryNotification").style.display != "none"){
                                        window.clicksItem("goldBarRefinery");
                                    }
                                }
                            }
                        },
                        refineGoldBar: {
                            Module: {
                                title: "(G) Gold",
                                image: "images/gold.png",
                                description: `While in the refinery menu, press 'G' to select gold bars`,
                                initialToggle: 1,
                                key: "G",
                                priority: 3.5,
                                func: ()=>{
                                    if(document.getElementById("dialogue-barRefinery").style.display != "none"){
                                        window.closeSmittysDialogue('dialogue-barRefinery');
                                        window.refineGoldBars();
                                    }
                                }
                            }
                        },
                        refinePromethiumBar: {
                            Module: {
                                title: "(P) Promethium",
                                image: "images/gold.png",
                                description: `While in the refinery menu, press 'P' to select promethium bars`,
                                initialToggle: 1,
                                key: "P",
                                priority: 2,
                                func: ()=>{
                                    if(document.getElementById("dialogue-barRefinery").style.display != "none"){
                                        window.closeSmittysDialogue('dialogue-barRefinery');
                                        window.refinePromethiumBars();
                                    }
                                }
                            }
                        },
                        reuseRefinery: {
                            Module: {
                                title: "(R) Re-refine",
                                image: "images/gold.png",
                                description: `Open the refinery to select a bar to refine`,
                                initialToggle: 1,
                                key: "R",
                                priority: 10,
                                func: ()=>{
                                    if(document.querySelector("#dialogue-confirm2-extra[value='Collect and refine again']") &&
                                       document.querySelector("#dialogue-confirm2-extra[value='Collect and refine again']").parentElement.parentElement.style.display != "none"){
                                        document.querySelector("#dialogue-confirm2-extra[value='Collect and refine again']").click()
                                        return true;
                                    }
                                }
                            }
                        },
                        craftItemsTab: {
                            Module: {
                                title: "(C) Craft items",
                                image: "images/gold.png",
                                description: `While in the Crafting tab, press 'C' to enter the menu for crafting items`,
                                initialToggle: 1,
                                key: "C",
                                priority: 2,
                                func: ()=>{
                                    if(document.getElementById("tab-crafting").style.display != "none"){
                                        window.setCraftList('default');
                                        window.navigate('craftingItems');
                                        return true;
                                    }
                                }
                            }
                        },
                        selectTopCraftingItem: {
                            Module: {
                                title: "(S) Choose item",
                                image: "images/gold.png",
                                description: `While in the menu showing all items available for crafting, press 'S' to select to top item and open its crafting menu`,
                                initialToggle: 1,
                                key: "S",
                                priority: 1,
                                func: ()=>{
                                    if(document.getElementById("tab-craftingItems").style.display != "none"){
                                        document.getElementById("item-section-crafting-3").firstElementChild.click();
                                        return true;
                                    }
                                }
                            }
                        },
                        craftAnItem: {
                            Module: {
                                title: "(Space) Craft",
                                image: "images/gold.png",
                                description: `While in the menu showing details for the crafting of an item, press 'Space' to craft it`,
                                initialToggle: 1,
                                key: " ",
                                priority: 3,
                                func: ()=>{
                                    if(document.getElementById("tab-craftingAnItem").style.display != "none"){
                                        document.getElementById("tab-craftingAnItem").children[1].children[3].firstElementChild.click();
                                        return true;
                                    }
                                }
                            }
                        },
                        confirmCraftAnItem: {
                            Module: {
                                title: "(Space) Confirm",
                                image: "images/gold.png",
                                description: `While the dialogue asking how many of something you want to craft, press 'Space' to craft the specified amount`,
                                initialToggle: 1,
                                key: " ",
                                priority: 2,
                                func: ()=>{
                                    if(document.getElementById("dialogue-multi-craft").style.display != "none"){
                                        document.querySelector("#dialogue-multi-craft input[value='Craft']").click();
                                        return true;
                                    }
                                }
                            }
                        },
                    }
                }
            },
            woodcuttingShortcuts: {
                Module: {
                    title: "Woodcutting",
                    image: "images/gold.png",
                    description: `Shortcuts that work within the woodcutting tab`,
                    initialToggle: 1,
                    Submenu: {
                        lumberjack: {
                            Module: {
                                title: "(S) Lumberjack",
                                image: "images/gold.png",
                                description: `Use the lumberjack`,
                                initialToggle: 1,
                                key: "S",
                                priority: 3,
                                func: ()=>{
                                    if(document.getElementById("tab-woodcutting").style.display != "none"){
                                        window.clicksItem('lumberjack');
                                        return true;
                                    }
                                }
                            }
                        },
                    }
                }
            },
            farmingShortcuts: {
                Module: {
                    title: "Farming",
                    image: "images/gold.png",
                    description: `Shortcuts that work within the farming tab`,
                    initialToggle: 1,
                    Submenu: {
                        farmer: {
                            Module: {
                                title: "(H) Click Bob",
                                image: "images/gold.png",
                                description: `Talk to Bob the farmer and manage your crops and planter`,
                                initialToggle: 1,
                                key: "H",
                                priority: 1,
                                func: ()=>{
                                    if(document.getElementById("tab-farming").style.display != "none"){
                                        window.clicksItem('farmer');
                                        return true;
                                    }
                                }
                            }
                        },
                        harvestAndReplant: {
                            Module: {
                                title: "(H) Replant",
                                image: "images/gold.png",
                                description: `While in the "Bob the farmer" dialogue, harvest your crops and replant them`,
                                initialToggle: 1,
                                key: "H",
                                priority: 2,
                                func: ()=>{
                                    if(document.getElementById("dialogue-bob").style.display != "none"){
                                        document.querySelector("#dialogue-bob input[value='Harvest and Replant']").click()
                                        return true;
                                    }
                                }
                            }
                        },
                        harvestAll: {
                            Module: {
                                title: "(O) No replant",
                                image: "images/gold.png",
                                description: `While in the "Bob the farmer" dialogue, harvest your crops without replanting them`,
                                initialToggle: 1,
                                key: "O",
                                priority: 3,
                                func: ()=>{
                                    if(document.getElementById("dialogue-bob").style.display != "none"){
                                        document.querySelector("#dialogue-bob input[value='Harvest Only']").click()
                                        return true;
                                    }
                                }
                            }
                        },
                        automateWithPlanter: {
                            Module: {
                                title: "(A) Automate",
                                image: "images/gold.png",
                                description: `While in the "Bob the farmer" dialogue, automate the current seed with the Planter`,
                                initialToggle: 1,
                                key: "A",
                                priority: 3,
                                func: ()=>{
                                    if(document.getElementById("dialogue-bob").style.display != "none"){
                                        document.querySelector("#dialogue-bob input[value='Automate with Planter']").click()
                                        return true;
                                    }
                                }
                            }
                        },
                        startPlanter: {
                            Module: {
                                title: "(S) Start",
                                image: "images/gold.png",
                                description: `After clicking on 'Automate with Planter', click 'S' to start the planter`,
                                initialToggle: 1,
                                key: "S",
                                priority: 12,
                                func: ()=>{
                                    if(document.getElementById("dialogue-planter").style.display != "none"){
                                        document.querySelector("#dialogue-planter input[value='Start Planter']").click()
                                        return true;
                                    }
                                }
                            }
                        },
                        resetPlanter: {
                            Module: {
                                title: "(R) Reset",
                                image: "images/gold.png",
                                description: `After clicking on Bob while the planter is active, reset the planter`,
                                initialToggle: 1,
                                key: "R",
                                priority: 8,
                                func: ()=>{
                                    if(document.getElementById("dialogue-confirm2").style.display != "none" &&
                                       document.querySelector("#dialogue-confirm2 input[value='Reset Planter']")){
                                        document.querySelector("#dialogue-confirm2 input[value='Reset Planter']").click()
                                        return true;
                                    }
                                }
                            }
                        },
                        stopPlanter: {
                            Module: {
                                title: "(S) Stop",
                                image: "images/gold.png",
                                description: `After clicking on Bob while the planter is active, stop the planter`,
                                initialToggle: 1,
                                key: "S",
                                priority: 13,
                                func: ()=>{
                                    if(document.getElementById("dialogue-confirm2").style.display != "none"){
                                        document.querySelector("#dialogue-confirm2 input[value='Stop Planter']").click()
                                        return true;
                                    }
                                }
                            }
                        },
                        selectDottedLeaf: {
                            Module: {
                                title: "(D) Select dot",
                                image: "images/gold.png",
                                description: `While in the "Bob the farmer" dialogue, select dotted green leaf seeds as the current seed`,
                                initialToggle: 1,
                                key: "D",
                                priority: 3,
                                func: ()=>{
                                    if(document.getElementById("dialogue-bob").style.display != "none"){
                                        window.setBobsAutoReplantSeed("dottedGreenLeafSeeds")
                                        return true;
                                    }
                                }
                            }
                        },
                        selectRedMushroom: {
                            Module: {
                                title: "(R) Select mush",
                                image: "images/gold.png",
                                description: `While in the "Bob the farmer" dialogue, select red mushroom seeds as the current seed`,
                                initialToggle: 1,
                                key: "R",
                                priority: 9,
                                func: ()=>{
                                    if(document.getElementById("dialogue-bob").style.display != "none"){
                                        window.setBobsAutoReplantSeed("redMushroomSeeds")
                                        return true;
                                    }
                                }
                            }
                        },
                        selectGreenLeaf: {
                            Module: {
                                title: "(G) Select gr.",
                                image: "images/gold.png",
                                description: `While in the "Bob the farmer" dialogue, select green leaf seeds as the current seed`,
                                initialToggle: 1,
                                key: "G",
                                priority: 2,
                                func: ()=>{
                                    if(document.getElementById("dialogue-bob").style.display != "none"){
                                        window.setBobsAutoReplantSeed("greenLeafSeeds")
                                        return true;
                                    }
                                }
                            }
                        },
                        selectLimeLeaf: {
                            Module: {
                                title: "(L) Select lime",
                                image: "images/gold.png",
                                description: `While in the "Bob the farmer" dialogue, select lime leaf seeds as the current seed`,
                                initialToggle: 1,
                                key: "L",
                                priority: 2,
                                func: ()=>{
                                    if(document.getElementById("dialogue-bob").style.display != "none"){
                                        window.setBobsAutoReplantSeed("limeLeafSeeds")
                                        return true;
                                    }
                                }
                            }
                        },
                        plantDottedLeaf: {
                            Module: {
                                title: "(D) Plant dot",
                                image: "images/gold.png",
                                description: `While in the farming tab, click dotted green leaf seeds to plant them in individual plots`,
                                initialToggle: 1,
                                key: "D",
                                priority: 2,
                                func: ()=>{
                                    if(document.getElementById("tab-farming").style.display != "none"){
                                        window.clicksItem('dottedGreenLeafSeeds');
                                        return true;
                                    }
                                }
                            }
                        },
                        plantRedMushroom: {
                            Module: {
                                title: "(R) Plant mush",
                                image: "images/gold.png",
                                description: `While in the farming tab, click red mushroom seeds to plant them in individual plots`,
                                initialToggle: 1,
                                key: "R",
                                priority: 1,
                                func: ()=>{
                                    if(document.getElementById("tab-farming").style.display != "none"){
                                        window.clicksItem('redMushroomSeeds');
                                        return true;
                                    }
                                }
                            }
                        },
                        plantGreenLeaf: {
                            Module: {
                                title: "(G) Plant gr.",
                                image: "images/gold.png",
                                description: `While in the farming tab, click green leaf seeds to plant them in individual plots`,
                                initialToggle: 1,
                                key: "G",
                                priority: 1,
                                func: ()=>{
                                    if(document.getElementById("tab-farming").style.display != "none"){
                                        window.clicksItem('greenLeafSeeds');
                                        return true;
                                    }
                                }
                            }
                        },
                        plantLimeLeaf: {
                            Module: {
                                title: "(L) Plant lime",
                                image: "images/gold.png",
                                description: `While in the farming tab, click lime leaf seeds to plant them in individual plots`,
                                initialToggle: 1,
                                key: "L",
                                priority: 1,
                                func: ()=>{
                                    if(document.getElementById("tab-farming").style.display != "none"){
                                        window.clicksItem('limeLeafSeeds');
                                        return true;
                                    }
                                }
                            }
                        },
                    }
                }
            },
            exploringShortcuts: {
                Module: {
                    title: "Exploring",
                    image: "images/gold.png",
                    description: `Shortcuts that work within the exploring tab`,
                    initialToggle: 1,
                    Submenu: {
                        exploreArea: {
                            Module: {
                                title: "(E) Explore",
                                image: "images/gold.png",
                                description: `Navigate to the view where you select an area to explore`,
                                initialToggle: 1,
                                key: "E",
                                priority: 2,
                                func: ()=>{
                                    if(document.getElementById("tab-exploring").style.display != "none"){
                                        window.navigate('explore');
                                        return true;
                                    }
                                }
                            }
                        },
                        nextArea: {
                            Module: {
                                title: "(D) Next Area",
                                image: "images/gold.png",
                                description: `While in the view where you select an area, move to the next area`,
                                initialToggle: 1,
                                key: "D",
                                priority: 1,
                                func: ()=>{
                                    if(document.getElementById("tab-explore").style.display != "none"){
                                        window.loadNextExploringArea();
                                        return true;
                                    }
                                }
                            }
                        },
                        previousArea: {
                            Module: {
                                title: "(A) Prev Area",
                                image: "images/gold.png",
                                description: `While in the view where you select an area, move to the previous area`,
                                initialToggle: 1,
                                key: "A",
                                priority: 1,
                                func: ()=>{
                                    if(document.getElementById("tab-explore").style.display != "none"){
                                        window.loadPreviousExploringArea();
                                        return true;
                                    }
                                }
                            }
                        },
                        selectArea: {
                            Module: {
                                title: "(Space) Select",
                                image: "images/gold.png",
                                description: `While in the view where you select an area, select the current area for exploration`,
                                initialToggle: 1,
                                key: " ",
                                priority: 5,
                                func: ()=>{
                                    if(document.getElementById("tab-explore").style.display != "none"){
                                        document.getElementById("exploring-area-button").click();
                                        document.getElementById("dialogue-confirm-no").blur();
                                        document.getElementById("dialogue-confirm-yes").blur();
                                        return true;
                                    }
                                }
                            }
                        },
                        startCombat: {
                            Module: {
                                title: "(S) Combat",
                                image: "images/gold.png",
                                description: `Start combat or enter the combat view if you are already in combat`,
                                initialToggle: 1,
                                key: "S",
                                priority: 2,
                                func: ()=>{
                                    if(document.getElementById("tab-exploring").style.display != "none"){
                                        window.lookForFight();
                                        return true;
                                    }
                                }
                            }
                        },
                        drinkCombatResetPotion: {
                            Module: {
                                title: "(S) CR Potion",
                                image: "images/gold.png",
                                description: `If you have completed a fight in your current exploration, but not yet drunk a Combat Reset Potion, press 'S' to drink one`,
                                initialToggle: 1,
                                key: "S",
                                priority: 2.5,
                                func: ()=>{
                                    if(document.getElementById("tab-exploring").style.display != "none"){
                                        if(window.fightDone && !window.resetFightingPotionUsed && window.resetFightingPotion > 0 && window.monsterName==="none"){
                                            window.sendBytes('DRINK=resetFightingPotion');
                                            return true;
                                        }
                                    }
                                }
                            }
                        },
                        equipmentTab: {
                            Module: {
                                title: "(Q) Equipment",
                                image: "images/gold.png",
                                description: `Enter the equipment tab`,
                                initialToggle: 1,
                                key: "Q",
                                priority: 1,
                                func: ()=>{
                                    if(document.getElementById("tab-exploring").style.display != "none"){
                                        window.navigateAndLoadImages('equipment', 'item-section-exploring-2');
                                        return true;
                                    }
                                }
                            }
                        },
                        convertArtifact: {
                            Module: {
                                title: "(S) Convert",
                                image: "images/gold.png",
                                description: `After clicking on an artifact, press space to convert the specified artifacts of that type to XP`,
                                initialToggle: 1,
                                key: "S",
                                priority: 10,
                                func: ()=>{
                                    if(document.getElementById("dialogue-convertArtifact").style.display != "none"){
                                        window.sendBytes(window.amountWidgetGetCommand());
                                        window.closeSmittysDialogue('dialogue-convertArtifact');
                                        return true;
                                    }
                                }
                            }
                        },
                    }
                }
            },
            combatShortcuts: {
                Module: {
                    title: "Combat",
                    image: "images/gold.png",
                    description: `Shortcuts to drink potions and cast spells while in combat`,
                    initialToggle: 1,
                    Submenu: {
                        healPot: {
                            Module: {
                                title: "(Q) Heal",
                                image: "images/gold.png",
                                description: `Drink a heal potion`,
                                initialToggle: 1,
                                key: "Q",
                                priority: 2,
                                func: ()=>{
                                    if(document.getElementById("tab-combat").style.display != "none"){
                                        document.getElementById("combat-potions-hpCombatPotion").click()
                                        return true;
                                    }
                                }
                            }
                        },
                        freezePot: {
                            Module: {
                                title: "(W) Freeze",
                                image: "images/gold.png",
                                description: `Drink a freeze potion`,
                                initialToggle: 1,
                                key: "W",
                                priority: 2,
                                func: ()=>{
                                    if(document.getElementById("tab-combat").style.display != "none"){
                                        document.getElementById("combat-potions-freezeCombatPotion").click()
                                        return true;
                                    }
                                }
                            }
                        },
                        ignoreDefencePot: {
                            Module: {
                                title: "(E) Ignore Def",
                                image: "images/gold.png",
                                description: `Drink an ignore defence potion`,
                                initialToggle: 1,
                                key: "E",
                                priority: 3,
                                func: ()=>{
                                    if(document.getElementById("tab-combat").style.display != "none"){
                                        document.getElementById("combat-potions-ignoreDefenceCombatPotion").click()
                                        return true;
                                    }
                                }
                            }
                        },
                        ghostScanPot: {
                            Module: {
                                title: "(R) Ghost Scan",
                                image: "images/gold.png",
                                description: `Drink a ghost scan potion`,
                                initialToggle: 1,
                                key: "R",
                                priority: 10,
                                func: ()=>{
                                    if(document.getElementById("tab-combat").style.display != "none"){
                                        document.getElementById("combat-potions-ghostScanCombatPotion").click()
                                        return true;
                                    }
                                }
                            }
                        },
                        superHpPot: {
                            Module: {
                                title: "(T) Super Heal",
                                image: "images/gold.png",
                                description: `Drink a super hp potion`,
                                initialToggle: 1,
                                key: "T",
                                priority: 4,
                                func: ()=>{
                                    if(document.getElementById("tab-combat").style.display != "none"){
                                        document.getElementById("combat-potions-superHpCombatPotion").click()
                                        return true;
                                    }
                                }
                            }
                        },
                        strengthPot: {
                            Module: {
                                title: "(Y) Strength",
                                image: "images/gold.png",
                                description: `Drink a strength potion`,
                                initialToggle: 1,
                                key: "Y",
                                priority: 1,
                                func: ()=>{
                                    if(document.getElementById("tab-combat").style.display != "none"){
                                        document.getElementById("combat-potions-strengthCombatPotion").click()
                                        return true;
                                    }
                                }
                            }
                        },
                        fireSpell: {
                            Module: {
                                title: "(A) Fire",
                                image: "images/gold.png",
                                description: `Cast the Fire spell`,
                                initialToggle: 1,
                                key: "A",
                                priority: 2,
                                func: ()=>{
                                    if(document.getElementById("tab-combat").style.display != "none"){
                                        document.getElementById("combat-spells-fireSpell").parentElement.click()
                                        return true;
                                    }
                                }
                            }
                        },
                        reflectSpell: {
                            Module: {
                                title: "(S) Reflect",
                                image: "images/gold.png",
                                description: `Cast the Reflect spell`,
                                initialToggle: 1,
                                key: "S",
                                priority: 14,
                                func: ()=>{
                                    if(document.getElementById("tab-combat").style.display != "none"){
                                        document.getElementById("combat-spells-reflectSpell").parentElement.click()
                                        return true;
                                    }
                                }
                            }
                        },
                        teleportSpell: {
                            Module: {
                                title: "(D) Teleport",
                                image: "images/gold.png",
                                description: `Cast the Teleport spell. If you have disabled the fix 'Instant teleport' this will just open the confirmation box, not actually teleport`,
                                initialToggle: 1,
                                key: "D",
                                priority: 4,
                                func: ()=>{
                                    if(document.getElementById("tab-combat").style.display != "none"){
                                        document.getElementById("combat-spells-teleportSpell").parentElement.click()
                                        return true;
                                    }
                                }
                            }
                        },
                        thunderStrikeSpell: {
                            Module: {
                                title: "(F) Thunder",
                                image: "images/gold.png",
                                description: `Cast the Thunder Strike spell`,
                                initialToggle: 1,
                                key: "F",
                                priority: 2,
                                func: ()=>{
                                    if(document.getElementById("tab-combat").style.display != "none"){
                                        document.getElementById("combat-spells-thunderStrikeSpell").parentElement.click()
                                        return true;
                                    }
                                }
                            }
                        },
                        lifeStealSpell: {
                            Module: {
                                title: "(G) Life Steal",
                                image: "images/gold.png",
                                description: `Cast the Life Steal spell`,
                                initialToggle: 1,
                                key: "G",
                                priority: 4,
                                func: ()=>{
                                    if(document.getElementById("tab-combat").style.display != "none"){
                                        document.getElementById("combat-spells-lifeStealSpell").parentElement.click()
                                        return true;
                                    }
                                }
                            }
                        },
                        sandstormSpell: {
                            Module: {
                                title: "(H) Sandstorm",
                                image: "images/gold.png",
                                description: `Cast the Sandstorm spell`,
                                initialToggle: 1,
                                key: "H",
                                priority: 3,
                                func: ()=>{
                                    if(document.getElementById("tab-combat").style.display != "none"){
                                        document.getElementById("combat-spells-sandstormSpell").parentElement.click()
                                        return true;
                                    }
                                }
                            }
                        },
                    }
                }
            },
            cookingShortcuts: {
                Module: {
                    title: "Cooking",
                    image: "images/gold.png",
                    description: `Shortcuts that work within the cooking tab`,
                    initialToggle: 1,
                    Submenu: {
                        ovenDialogue: {
                            Module: {
                                title: "(O) Oven",
                                image: "images/gold.png",
                                description: `Open the oven dialogue to select logs to put in the over`,
                                initialToggle: 1,
                                key: "O",
                                priority: 2,
                                func: ()=>{
                                    if(document.getElementById("tab-cooking").style.display != "none"){
                                        window.openOvenDialogueChooseLogs();
                                        return true;
                                    }
                                }
                            }
                        },
                        ovenDialogueAdd: {
                            Module: {
                                title: "(S) Add logs",
                                image: "images/gold.png",
                                description: `After selecting what logs to add, press 'S' to add them to the oven`,
                                initialToggle: 1,
                                key: "S",
                                priority: 6,
                                func: ()=>{
                                    if(document.getElementById("dialogue-oven2").style.display != "none"){
                                        window.sendBytes(window.amountWidgetGetCommand());
                                        window.closeSmittysDialogue('dialogue-oven2');
                                        return true;
                                    }
                                }
                            }
                        },
                        cookFood: {
                            Module: {
                                title: "(S) Cook food",
                                image: "images/gold.png",
                                description: `After clicking on an uncooked food, press 'S' to cook it`,
                                initialToggle: 1,
                                key: "S",
                                priority: 7,
                                func: ()=>{
                                    if(document.getElementById("dialogue-cook").style.display != "none"){
                                        window.sendBytes(window.amountWidgetGetCommand());
                                        window.closeSmittysDialogue('dialogue-cook');
                                        return true;
                                    }
                                }
                            }
                        },
                        eatFood: {
                            Module: {
                                title: "(S) Eat food",
                                image: "images/gold.png",
                                description: `After clicking on a cooked food, press 'S' to eat it`,
                                initialToggle: 1,
                                key: "S",
                                priority: 5,
                                func: ()=>{
                                    if(document.getElementById("dialogue-eat").style.display != "none"){
                                        window.sendBytes(window.amountWidgetGetCommand());
                                        window.closeSmittysDialogue('dialogue-eat');
                                        return true;
                                    }
                                }
                            }
                        },
                        collectRowBoat: {
                            Module: {
                                title: "(R) Row boat",
                                image: "images/gold.png",
                                description: `Collect fish from row boat. Works from almost anywhere in the game, not just the cooking tab`,
                                initialToggle: 1,
                                key: "R",
                                priority: 6,
                                func: ()=>{
                                    if(document.getElementById("notification-rowBoatNotification").style.display != "none"){
                                        window.clicksItem('rowBoat');
                                        return true;
                                    }
                                }
                            }
                        },
                        collectCanoeBoat: {
                            Module: {
                                title: "(R) Canoe boat",
                                image: "images/gold.png",
                                description: `Collect fish from canoe boat. Works from almost anywhere in the game, not just the cooking tab`,
                                initialToggle: 1,
                                key: "R",
                                priority: 5,
                                func: ()=>{
                                    if(document.getElementById("notification-canoeBoatNotification").style.display != "none"){
                                        window.clicksItem('canoeBoat');
                                        return true;
                                    }
                                }
                            }
                        },
                        collectSailBoat: {
                            Module: {
                                title: "(R) Sail boat",
                                image: "images/gold.png",
                                description: `Collect fish from sail boat. Works from almost anywhere in the game, not just the cooking tab`,
                                initialToggle: 1,
                                key: "R",
                                priority: 4,
                                func: ()=>{
                                    if(document.getElementById("notification-sailBoatNotification").style.display != "none"){
                                        window.clicksItem('sailBoat');
                                        return true;
                                    }
                                }
                            }
                        },
                        collectSteamBoat: {
                            Module: {
                                title: "(R) Steam boat",
                                image: "images/gold.png",
                                description: `Collect fish from steam boat. Works from almost anywhere in the game, not just the cooking tab`,
                                initialToggle: 1,
                                key: "R",
                                priority: 3,
                                func: ()=>{
                                    if(document.getElementById("notification-steamBoatNotification").style.display != "none"){
                                        window.clicksItem('steamBoat');
                                        return true;
                                    }
                                }
                            }
                        },
                        collectTrawler: {
                            Module: {
                                title: "(R) Trawler",
                                image: "images/gold.png",
                                description: `Collect fish from trawler. Works from almost anywhere in the game, not just the cooking tab`,
                                initialToggle: 1,
                                key: "R",
                                priority: 2,
                                func: ()=>{
                                    if(document.getElementById("notification-trawlerNotification").style.display != "none"){
                                        window.clicksItem('trawler');
                                        return true;
                                    }
                                }
                            }
                        },
                        resendBoat: {
                            Module: {
                                title: "(R) Resend",
                                image: "images/gold.png",
                                description: `After clicking on a boat to collect fish, press 'R' to collect and resend it. If you press 'Space' in this menu, it will collect but not resend the boat`,
                                initialToggle: 1,
                                key: "R",
                                priority: 7,
                                func: ()=>{
                                    if(document.querySelector("#dialogue-confirm2-extra[value='Collect and resend']") &&
                                       document.querySelector("#dialogue-confirm2-extra[value='Collect and resend']").parentElement.parentElement.style.display != "none"){
                                        document.querySelector("#dialogue-confirm2-extra[value='Collect and resend']").click()
                                        return true;
                                    }
                                }
                            }
                        },
                    }
                }
            },
            menuShortcuts: {
                Module: {
                    title: "Menus",
                    image: "images/gold.png",
                    description: `Shortcuts that deal with menus and dialogues`,
                    initialToggle: 1,
                    Submenu: {
                        confirmDialogue: {
                            Module: {
                                title: "(Space) Yes/No",
                                image: "images/gold.png",
                                description: `Confirm a dialogue with only two options, by selecting the top button`,
                                initialToggle: 1,
                                key: " ",
                                priority: 7,
                                func: ()=>{
                                    if(document.getElementById("dialogue-confirm").style.display != "none"){
                                        document.getElementById("dialogue-confirm-yes").click();
                                        return true;
                                    }
                                }
                            }
                        },
                        confirmDialogue2: {
                            Module: {
                                title: "(Space) Yes/?/?",
                                image: "images/gold.png",
                                description: `Confirm a dialogue with three options, by selecting the top button. This is not always a positive answer, e.g. if you click on an active planter, this will select 'Stop Planter'`,
                                initialToggle: 1,
                                key: " ",
                                priority: 6,
                                func: ()=>{
                                    if(document.getElementById("dialogue-confirm2").style.display != "none"){
                                        document.getElementById("dialogue-confirm2-yes").click();
                                        return true;
                                    }
                                }
                            }
                        },
                        sellItem: {
                            Module: {
                                title: "(S) Sell",
                                image: "images/gold.png",
                                description: `Confirm a dialogue for selling an item`,
                                initialToggle: 1,
                                key: "S",
                                priority: 11,
                                func: ()=>{
                                    if(document.getElementById("dialogue-sellItem").style.display != "none"){
                                        window.sendWidgetSellToServer();
                                        window.closeSmittysDialogue('dialogue-sellItem');
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                }
            },
            customShortcuts: {
                DisabledModule: { //rename this to just 'Module' to enable. Without enabling this the shortcuts will not work, nor appear in the DHMFixed Menu
                    title: "Custom",
                    image: "images/gold.png",
                    description: `Here you can add your own shortcuts. Your additions will be deleted if the script updates, so make sure to save a copy of them somewhere else`,
                    initialToggle: 1,
                    Submenu: {
                        //start of a single shortcut. This example shortcut will not be added to the menus in the game, so you can leave it here for reference
                        uniqueNameOfShortcut: { //this has to be unique from all other module names, or they will not work. Just make it long and specific and you should be good
                            Module: {
                                title: "(Key) short name", //the name should ideally be short enough to only take up one line in the menu, but it will work with any length
                                image: "images/gold.png", // you can change this, but the 'off' state will still be 'images/stone.png', so it might look weird
                                description: `A description of what your shortcut does`,
                                initialToggle: 1, //If set to 0, will have to be enabled in the dhmfixed menu before it works
                                key: "A", //Single capital letter for the key that activates shortcut. Replace with the letter you want to use
                                priority: 15, //Decides the order in which shortcuts on the same letter will be executed. No other shortcut is over 14. The value is not restricted to integers, so you can use e.g. 3.5 to make it trigger between to other with 3 and 4 respectively
                                func: ()=>{ //this is the code that runs when the shortcut is triggered. Any javascript code can be put here, but most of my shortcuts follow this template, probably most of yours will as well
                                    if(document.getElementById("example-id") && document.getElementById("example-id").style.display != "none"){ // Check that the part of the game you are interacting with is visible. Look at other shortcuts for examples
                                        document.getElementById("the-id-of-the-button-you-want-to-click").click();
                                        //alternatively
                                        window.nameOfMethodThatCanBeRanFromTheConsole()
                                        return true; //return whether or not the shortcut has been executed. If false is returned, the next shortcut bound to this key will try to execute. If true is returned, nothing more happens.
                                    }
                                }
                            }
                        }, //end of a single shortcut
                        //create your own shortcuts below this point
                    }
                }
            }
        }
    }

    //WindowExtensions

    Program.WindowExtensions = {}

    Program.WindowExtensions.functions = {}
    Program.WindowExtensions._functions = {}
    Program.WindowExtensions.added = {}
    Program.WindowExtensions.initiated = {}
    Program.WindowExtensions.first = true;


    Program.WindowExtensions.add = (key, funcData) => {
        if(Program.WindowExtensions.added[funcData.module+"."+key]){
            console.log(funcData, key, " added already");
            return;
        }
        Program.WindowExtensions.added[funcData.module+"."+key] = true;
        if(Program.WindowExtensions.functions[key]){
            Program.WindowExtensions.functions[key].push(funcData);
        }else{
            let oldFunc = {
                module: funcData.module,
                func: window[key],
                priority: 0
            }
            Program.WindowExtensions.functions[key] = [oldFunc, funcData];
        }
        if(!Program.WindowExtensions.first){
            Program.WindowExtensions.init();
        }
    }

    Program.WindowExtensions.init = () => {
        for(let key in Program.WindowExtensions.functions){
            let sorted = Program.WindowExtensions.functions[key].sort((a,b)=>b.priority-a.priority);
            let funcs = undefined
            for(let i in sorted){
                console.log(key, i, sorted[i], funcs?"":"first");
                if(funcs){
                    funcs.push((data) => {return sorted[i].func(data)})
                }else{
                    funcs = [sorted[i].func]
                }
            }
            window[key] = (a,b,c,d,e,f,g,h,i,j,k,l,m) => {
                let data = [a,b,c,d,e,f,g,h,i,j,k,l,m]
                for(let i in funcs){
                    let result = funcs[i](data[0],data[1],data[2],data[3],data[4],data[5],data[6],data[7],data[8],data[9],data[10],data[11],data[12])
                    if(result){
                        if(result.error){
                            if(result.error.length>3){
                                console.log(result.error);
                            }
                            break;
                        }
                        if(result.modifications){
                            for(let j in result.modifications){
                                data[j] = result.modifications[j];
                            }
                        }
                    }
                }
            }
        }
        Program.WindowExtensions.first = false;
    }

    function initiate(Module){
        for(let key in Module){
            let module = Module[key].Module
            if(!module){
                //Module[key].init?Module[key].init():{}
                continue;
            }
            if(module.Submenu){
                initiate(module.Submenu);
            }
            let stored = window.localStorage.getItem(key);
            if(stored == 1){
                forceInit(module, key)
                console.log(`Module ${key} initiated`);
            }else if(stored == 0){
                console.log(`Module ${key} not initiated, toggled off`);
            }else{
                window.localStorage.setItem(key, module.initialToggle);
                module.initialToggle?(module.init?module.init():{}):{};
                console.log(`Module ${key} initiated, first time`);
            }
        }
    }
    let attempts = {}
    function forceInit(module, key){
        try{
            module.init?module.init():{}
        }catch(error){
            attempts[key] = attempts[key]?attempts[key]+1:1
            try{module.destroy()}catch(e){}
            if(attempts[key]>5){
                return;
            }
            console.error(error);
            console.warn(`Initiating module ${key} failed, retrying in 5 seconds`)
            setTimeout(()=>forceInit(module, key),5000)
        }
    }
    initiate(Program);
    forceInit(Program.Main,"Main");
    forceInit(Program.WindowExtensions,"WindowExtensions");
})();

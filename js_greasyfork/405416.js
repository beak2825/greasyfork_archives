// ==UserScript==
// @name         DH3 Fixed
// @namespace    FileFace
// @version      1.1.6
// @description  Improve the experience of Diamond Hunt 3
// @author       kape142
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405416/DH3%20Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/405416/DH3%20Fixed.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(function() {
  'use strict';

  var version = "1.1.6"

  var Program = {};

  //Main
  Program.Main = {};

  Program.Main.IDs = {}

  Program.Main.initialToggle = 1;

  Program.Main.dialogueID = "";

  Program.Main.toggle = (Module, key) => {
    if(Program.Main.memoryStorage.getItem(key) == 1){
      Program.Main.memoryStorage.setItem(key, 0);
      Module.destroy?Module.destroy():{};
      return false;
    }else{
      Program.Main.memoryStorage.setItem(key, 1);
      Module.init?Module.init():{};
      return true;
    }
  }

  Program.Main.onLoginFunctions = [];

  Program.Main.whenLoggedIn = (func) => {
    if(window.var_username && document.getElementById("dh3-dialogues")){
        func();
    }else{
        Program.Main.onLoginFunctions.push(func);
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
    Program.Main.saveDialogue(dialogue, key)
  }

  Program.Main.saveDialogue = (dialogue, key) => {
    Program.Main.IDs[key] = dialogue.id;
    dialogue.style.display = "none"
    let dialogueDiv = document.getElementById("dh3-dialogues");
    dialogueDiv.appendChild(dialogue);
  }

  Program.Main.showSettingsDialogue = (parentID, ID) => {
    if(parentID){
      try{
        window.closeDialogue(parentID)
      }catch(error){
        console.warn(error)
      }
    }
    document.getElementById(ID).style.display = "";
  }

  Program.Main.createDialogue = (key, title, elements, onClose, parentKey) =>{
    let div = document.createElement("div");
    let id = `dialogue-${key}`
    div.id = id;
    div.className = "dialogue";
    div.style.width = "400px";
    div.style.paddingBottom = "50px";
    div.style.top = "45px";

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
      backImg.className = "img-40";
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

    let closeDiv = document.createElement("div");
    closeDiv.onclick = onClose?onClose:() => {div.style.display = "none"};
    closeDiv.className= "dialogue-button";
    closeDiv.appendChild(document.createTextNode("Close"));
    closeDiv.style.cursor = "pointer";
    div.appendChild(closeDiv);

    return div;
  }

  Program.Main.createButtonModule = (key, Parent, parentID, title, imageURL, noSubmenus) => {
    let imgId = `img-${key}`;
    let callback = undefined;
    if(Parent.Submenu){
      Program.Main.createSettingsDialogue(Parent.Submenu, key, title, parentID);
      callback = () => Program.Main.showSettingsDialogue(Program.Main.IDs[parentID],Program.Main.IDs[key]);
    }else if(Parent.click){
      callback = Parent.click;
    }else{
      callback = () => {document.getElementById(imgId).src = Program.Main.toggle(Parent, key)?imageURL:"images/stone.png"};
    }
    return Program.Main.createButton(key, title, Parent.description, (Parent.Submenu || Program.Main.memoryStorage.getItem(key)==1)?imageURL:"images/stone.png", callback, !!Parent.Submenu, noSubmenus, Parent.delete);
  }

  Program.Main.createButton = (key, title, description, imageURL, callback, hasSubmenu, noSubmenus, deleteFunction) => {
    let div = document.createElement("div");
    div.id = `button-div-${key}`
    let imgId = `img-${key}`;
    div.onclick = callback;
    div.className = "dialogue-button";
    div.style.cursor = "pointer";
    div.style.marginBottom = "10px";
    if(description){
      let hoverDiv = document.createElement("div");
      hoverDiv.className = "dialogue-button";
      hoverDiv.style.width = "354px";
      hoverDiv.style.position = "absolute";
      hoverDiv.style.left = "505px";
      hoverDiv.style.marginTop = "-10px";
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
    img.className = "img-100";
    img.id = imgId;
    td1.appendChild(img);
    tr.appendChild(td1);

    let td2 = document.createElement("td");
    td2.style.textAlign = "left";
    td2.style.paddingRight = "20px";
    td2.style.color = "black";
    td2.style.fontSize = "24pt";
    td2.style.width = "100%";
    let textNode = document.createTextNode(title.toUpperCase());
    td2.appendChild(textNode);
    tr.appendChild(td2);

    if(!(key==="dh3fixed" || noSubmenus)){
      let td3 = document.createElement("td");
      td3.style.textAlign = "right";
      td3.style.paddingRight = "10px";
      td3.style.fontSize = "40px";
      td3.style.color = "black";
      td3.appendChild(Program.Main.createIcon("caret-right", true));
      td3.style.visibility = hasSubmenu?"visible":"hidden";
      tr.appendChild(td3);
    }

    if(deleteFunction){
      let td3 = document.createElement("td");
      let img = document.createElement("img");
      img.src = "images/x.png";
      img.className = "img-50";
      img.title = "Delete module"
      td3.appendChild(img);
      td3.onclick = deleteFunction;
      tr.appendChild(td3);
    }

    tbody.appendChild(tr);
    table.appendChild(tbody);
    div.appendChild(table);
    return div;
  }

  Program.Main.addSettingsButton = () => {
    let homeDivItemSection = document.getElementById("item-section-home-1");
    let itemBox = Program.Main.createItemBox(
      ()=>Program.Main.showSettingsDialogue(undefined, Program.Main.IDs.dh3fixed),
      "dh3-fixed",
      "DH3 FIXED",
      "eventSigil2",
      version
    )
    homeDivItemSection.insertBefore(itemBox, homeDivItemSection.firstElementChild)
  }

  Program.Main.createItemBox = (onclick, key, topText, image, bottomText) => {
    let itemBox = document.createElement("div");
    itemBox.className = "item-box";
    itemBox.onclick = onclick
    itemBox.id = "item-box-"+key;
    itemBox.style.backgroundColor = "rgb(189, 20, 79)"
    itemBox.style.border = "1px solid rgb(94, 10, 39)"

    let itemBoxTitle = document.createElement("div");
    itemBoxTitle.style.textAlign = "center";
    itemBoxTitle.style.fontWeight = "bold";
    itemBoxTitle.style.fontSize = "12pt";
    itemBoxTitle.appendChild(document.createTextNode(topText));
    itemBox.appendChild(itemBoxTitle);

    let itemBoxImgDiv = document.createElement("div");
    itemBoxImgDiv.style.textAlign = "center";
    let itemBoxImg = document.createElement("img");
    itemBoxImg.src = "images/"+image+".png"
    itemBoxImg.className = "img-100";
    if(image.includes("eventSigil2")){
      itemBoxImg.style.imageRendering = "pixelated";
    }
    itemBoxImgDiv.appendChild(itemBoxImg);
    itemBox.appendChild(itemBoxImgDiv);

    let itemBoxSpan = document.createElement("span");
    itemBoxSpan.style.textAlign = "center";
    itemBoxSpan.style.display = "block";
    itemBoxSpan.style.fontWeight = "bold";
    itemBoxSpan.appendChild(document.createTextNode(bottomText));
    itemBox.appendChild(itemBoxSpan);
    return itemBox;
  }

  Program.Main.createIcon = (type, solid) => {
    let icon = document.createElement("i");
    icon.className = "fa"+(solid?"s":"r")+" fa-"+type;
    return icon;
  }

  Program.Main.createNotification = (key, imageUrl, color, tab) => {
    let notification = document.createElement("span");
    notification.id = "notification-"+key;
    notification.className = "notification-"+color;
    notification.style.display = "none";
    if((color == "green" || color == "fishing") && tab){
      notification.onclick = ()=>navigate("right-"+tab)
    }

    let img = document.createElement("img")
    img.id = "notification-"+key+"-img";
    img.className = "img-50";
    if(imageUrl.includes("eventSigil2")){
      img.style.imageRendering = "pixelated";
    }

    img.src = imageUrl;
    notification.appendChild(img);

    let valueSpan = document.createElement("span");
    valueSpan.id = "notification-"+key+"-value";
    let valueHook = value => valueSpan.textContent = value;
    notification.appendChild(valueSpan);

    document.getElementById("notification-area").appendChild(notification)

    return {
      element: notification,
      setValue: valueHook,
      toggle: show => notification.style.display = show?"":"none"
    };
  }

  Program.Main.memoryStorage = {}

  Program.Main.memoryStorage.getItem = (key) => {
    return Program.Main.memoryStorage[key];
  }

  Program.Main.memoryStorage.setItem = (key, item) => {
    Program.Main.memoryStorage[key] = item;
    setTimeout(()=>localStorage.setItem(key, item));
  }

  Program.Main.memoryStorage.removeItem = (key) => {
    Program.Main.memoryStorage[key] = undefined;
    setTimeout(()=>localStorage.removeItem(key));
  }

  Program.Main.memoryStorage.init = () => {
    Object.keys(localStorage).forEach(key=>{
      let itemString = localStorage.getItem(key);
      if(itemString){
        Program.Main.memoryStorage[key] = itemString
      }
    })
  }

  Program.Main.init = () => {
    let fontAwesome = document.createElement("script");
    fontAwesome.src = "https://kit.fontawesome.com/84465c291e.js"
    fontAwesome.crossorigin = "anonymous";
    fontAwesome.type = "text/javascript";
    document.head.appendChild(fontAwesome);

    let dh3DialogueDiv = document.createElement("div");
    dh3DialogueDiv.id = "dh3-dialogues";
    document.body.appendChild(dh3DialogueDiv)
    Program.Main.addSettingsButton();
    Program.Main.createSettingsDialogue(Program, "dh3fixed", "DH3 Fixed");

    const func = () => {
      if(window.var_username && document.getElementById("dh3-dialogues")){
        Program.Main.onLoginFunctions.forEach(a=>a());
      }else{
        setTimeout(func,500);
      }
    }
    func();
  }

  /* for reference
  chop tree: LOOT_DIALOGUE=TREE~images/logs.png~6 ~#ffcc99~#663300~images/woodcuttingSkill.png~1,000 xp~#99ff99~#006600~none
  farm red mush: LOOT_DIALOGUE=RED MUSHROOM SEEDS~images/redMushroom.png~12 ~#ffcc99~#663300~images/farmingSkill.png~25 xp~#99ff99~#006600~

  loot ent: LOOT_DIALOGUE=ENT~images/logs.png~8 ~#ffcc99~#663300~images/willowLogs.png~7 ~#ffcc99~#663300~images/combatSkill.png~70 xp~#99ff99~#006600~

  enter combat: SET_ITEMS=currentFighingArea~forest
  damage: HIT_SPLAT=monster~1~images/stinger.png~red~black~
  tanked: HIT_SPLAT=hero~0~images/tankIcon.png~red~black~

  */

  //ActivityLog

  Program.ActivityLog = {}

  Program.ActivityLog.visible = false;

  Program.ActivityLog.saveEntry = (data) => {
    if(!Program.Main.memoryStorage.getItem("ActivityLog")){
      return;
    }
    let historyString = Program.Main.memoryStorage.getItem("ActivityLog.history."+window.var_username)
    if(!historyString){
      historyString = "[]";
    }
    let history = JSON.parse(historyString);
    history.push(data);
    if(history.length > 200){
      history = history.slice(100,history.length);
    }
    let saved = false;
    while(!saved && history.length >= 1){
      saved = Program.ActivityLog.saveToLocalStorage(history);
      history = history.slice(history.length/2, history.length);
    }
  }

  Program.ActivityLog.saveToLocalStorage = history => {
    let historyString = JSON.stringify(history)
    try{
      Program.Main.memoryStorage.setItem("ActivityLog.history."+window.var_username, historyString);
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
    let parent = document.getElementById("activityLog-container");
    let first = parent.children[0];
    parent.insertBefore(div,first);
  }

  Program.ActivityLog.dataToDiv = (data) => {
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
    for(let i = startIndex; i+2 < array.length; i+=4){
      items.push({
        imageSrc: array[i],
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
    div.style.position = "static";

    let h1 = document.createElement("h1");
    h1.style.textAlign = "center";
    h1.innerHTML = title;
    div.appendChild(h1);

    for(let key in items){
      let item = items[key];
      let span = document.createElement("span");
      span.className = "loot-span";
      span.style.backgroundColor = item.backgroundColor;
      span.style.border = `1px solid ${item.borderColor}`;

      let img = document.createElement("img");
      img.className = "img-40";
      img.src = item.imageSrc;
      let decamName = Program.Main.decamelize(item.imageSrc.slice(7,-4))
      img.alt = decamName;
      img.title = decamName;
      span.appendChild(img);

      let text = document.createTextNode(item.amount);
      span.appendChild(text);
      div.appendChild(span);
    }
    return div;
  }



  Program.ActivityLog.toggleLog = (event) => {
    if(
      event.keyCode == 9 &&
      !event.altKey &&
      !event.ctrlKey &&
      !["input","textarea"].includes(document.activeElement.localName) &&
      window.var_username &&
      Program.Main.memoryStorage.getItem("activityLogHotkey") == 1
    ){
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
    let history = JSON.parse(Program.Main.memoryStorage.getItem("ActivityLog.history."+window.var_username));
    if(!history){
      history = [];
    }
    let elements = [];
    for(let i = history.length-1; i >= 0; i--){
      elements.push(Program.ActivityLog.dataToDiv(history[i]))
    }
    let containerDiv = document.createElement("div");
    containerDiv.style.overflowY = "auto";
    containerDiv.style.height = "70vh";
    containerDiv.style.borderBottom = "1px solid grey";
    containerDiv.id="activityLog-container"
    elements.forEach(a=>containerDiv.appendChild(a));
    let dialogue = Program.Main.createDialogue("activityLogDisplay", "Activity Log", [containerDiv], Program.ActivityLog.hideLog);
    dialogue.style.display = "none";
    dialogue.style.fontSize = "12pt";
    Program.ActivityLog.dialogueId = dialogue.id;
    Program.ActivityLog.visible = false;
    document.getElementById("dh3-dialogues").appendChild(dialogue);
  }

  Program.ActivityLog.showLog = () => {
    Program.ActivityLog.visible = true;
    document.getElementById(Program.ActivityLog.dialogueId).style.display = "";
  }
  Program.ActivityLog.hideLog = () => {
    Program.ActivityLog.visible = false;
    document.getElementById(Program.ActivityLog.dialogueId).style.display = "none";
  }

  Program.ActivityLog.init = () => {
    Program.WindowExtensions.add("lootDialogue", {
      module: "ActivityLog",
      func: Program.ActivityLog.saveLoot,
      priority: 2
    });
    Program.Main.whenLoggedIn(Program.ActivityLog.createLog);
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


  Program.Fixes.keepAlive = (data) => {
    if(data.includes("TAB_OFF")){
      if(Program.Main.memoryStorage.getItem("keepAlive")==1){
        return {error: "Keep connection alive"};
      }
    }
  }

  Program.Fixes.styleSheet = Array.from(document.styleSheets).find(a=>a.href && a.href.includes("dh3.diamondhunt.co/css/css.css"));

  Program.Fixes.adjustCss = (selectorText, property, newValue) => {
    if(Program.Fixes.styleSheet){
      let css = Array.from(document.styleSheets[0].cssRules)
      let cssClass = css.find(a=>a.selectorText == selectorText);
      if(cssClass && cssClass.style){
        cssClass.style[property] = newValue
      }else{
        console.warn(cssClass, selectorText, property, newValue);
      }
    }
  }

  Program.Fixes.smallerPlots = {}

  Program.Fixes.smallerPlots.apply = (type, sectionSize, imageSize) =>{
    for(let i = 1; i < 7; i++){
      document.getElementById(`${type}-section-${i}`).style.height = sectionSize
      let shiny = document.getElementById(`${type}-section-shiny-${i}`)
      if(shiny){
          shiny.style.height = imageSize
          shiny.style.width = imageSize
      }
      document.getElementById(`${type}-section-img-${i}`).style.height = imageSize
    }
  }

  Program.Fixes.smallerPlots.init = ()=>{
    Program.Fixes.smallerPlots.apply("plot", "350px", "250px");
    Program.Fixes.smallerPlots.apply("tree", "350px", "250px");
  }

  Program.Fixes.smallerPlots.destroy = ()=>{
    Program.Fixes.smallerPlots.apply("plot", "", "");
    Program.Fixes.smallerPlots.apply("tree", "", "");
  }

  Program.Fixes.disableChat = {}

  Program.Fixes.disableChat.filterCommand = (command) => {
    if(command.startsWith("CHAT=")){
      if(Program.Main.memoryStorage.getItem("disableChat")==1){
        return {error: "!"}
      }
    }
  }

  Program.Fixes.disableChat.hideOnStartup = (command) => {
    if(command.startsWith("LOAD_EQUIPMENT_OBJECTS")){
      if(Program.Main.memoryStorage.getItem("disableChat")==1){
        document.getElementById("chat-area").style.display = "none";
      }
    }
  }

  Program.Fixes.disableChat.hideOnCombatTabNavigation = (tab) => {
    if(tab == "right-combat"){
      if(Program.Main.memoryStorage.getItem("disableChat")==1){
        document.getElementById("chat-area").style.display = "none";
      }
    }
  }

  Program.Fixes.disableChat.init = ()=>{
    document.getElementById("chat-area").style.display = "none";
  }

  Program.Fixes.disableChat.destroy = ()=>{
    document.getElementById("chat-area").style.display = "";
  }

  Program.Fixes.lasseBrusDesign = {}

  Program.Fixes.lasseBrusDesign.rules = [];

  Program.Fixes.lasseBrusDesign.init = ()=>{
    Program.Fixes.lasseBrusDesign.insert(`body { font-size: 16px; }`);
    Program.Fixes.lasseBrusDesign.insert(`.index-top-bar-links + .center { font-size: 0; }`);
    Program.Fixes.lasseBrusDesign.insert(`#game > br, div.right-panel > div > br { display: none; }`);
    Program.Fixes.lasseBrusDesign.insert(`table.table-top-main-items { margin-top: 32px; padding: 0 8px; }`);
    Program.Fixes.lasseBrusDesign.insert(`img.img-50 { width: 35px; height: 35px; }`);
    Program.Fixes.lasseBrusDesign.insert(`img.img-100 { width: 70px; height: 70px; }`);
    Program.Fixes.lasseBrusDesign.insert(`div#top-bar-skills.not-table-top-main-skills { margin-top: 4px; padding: 0 8px; }`);
    Program.Fixes.lasseBrusDesign.insert(`div#notification-area { margin-bottom: 4px; }`);
    Program.Fixes.lasseBrusDesign.insert(`div.right-panel { min-height: 0; }`);
    Program.Fixes.lasseBrusDesign.insert(`div.right-panel > div > div { padding: 4px; }`);
    Program.Fixes.lasseBrusDesign.insert(`div.item-box { margin: 4px; }`);
    Program.Fixes.lasseBrusDesign.insert(`#dialogue-tradables.dialogue { max-width: 76%; margin-top: 150px; margin-left: -22%; }`);
  }

  Program.Fixes.lasseBrusDesign.insert = (text) => {
    Program.Fixes.lasseBrusDesign.rules.push(document.styleSheets[0].insertRule(text));
  }

  Program.Fixes.lasseBrusDesign.destroy = () => {
    Program.Fixes.lasseBrusDesign.rules.forEach(a=>document.styleSheets[0].deleteRule(a));
    Program.Fixes.lasseBrusDesign.rules = [];
  }

  Program.Fixes.init = ()=>{
    //non-toggleable fixes

    Program.WindowExtensions.add("closeDialogue", {
      module: "Fixes",
      func: data=>{document.activeElement.blur()},
      priority: -1,
    });

    Program.WindowExtensions.add("scrollText", {
      module: "Fixes",
      func: (a,b,c)=>{if(!window.mouseX){window.mouseX = 200};if(!window.mouseY){window.mouseY = 200}},
      priority: 1,
    });

    Program.Fixes.adjustCss(".notification-green", "margin", "3px")
    Program.Fixes.adjustCss(".notification-red", "margin", "3px")
    Program.Fixes.adjustCss(".notification-fishing", "margin", "3px")


    //toggleable fixes
    Program.WindowExtensions.add("sendBytes", {
      module: "keepAlive",
      func: Program.Fixes.keepAlive,
      priority: 1
    });

    Program.WindowExtensions.add("serverCommand", {
      module: "disableChat",
      func: Program.Fixes.disableChat.filterCommand,
      priority: 1
    });
    Program.WindowExtensions.add("serverCommand", {
      module: "disableChatAfter",
      func: Program.Fixes.disableChat.hideOnStartup,
      priority: -1
    });

    Program.WindowExtensions.add("navigate", {
      module: "disableChatAfter",
      func: Program.Fixes.disableChat.hideOnCombatTabNavigation,
      priority: -1
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
      keepAlive: {
        Module: {
          title: "Keep alive",
          image: "images/promethium.png",
          description: `Keeps the connection to the server alive even if the game loses focus`,
          initialToggle: 0
        }
      },
      smallerPlots: {
        Module: {
          title: "Smaller plots",
          image: "images/promethium.png",
          description: `Reduce the size of farming and woodcutting plots to make them fit on one row`,
          initialToggle: 1,
          init: Program.Fixes.smallerPlots.init,
          destroy: Program.Fixes.smallerPlots.destroy
        }
      },
      disableChat: {
        Module: {
          title: "Disable chat",
          image: "images/promethium.png",
          description: `Disable the chat altogether`,
          initialToggle: 0,
          init: Program.Fixes.disableChat.init,
          destroy: Program.Fixes.disableChat.destroy
        }
      },
      lasseBrusDesign: {
        Module: {
          title: "Compact",
          image: "images/promethium.png",
          description: `Design adjustments that makes the game more compact, suggested by Lasse Brustad`,
          initialToggle: 0,
          init: Program.Fixes.lasseBrusDesign.init,
          destroy: Program.Fixes.lasseBrusDesign.destroy
        }
      }
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
    if(
      event.keyCode === 27 && //27 = Esc
      ["input","textarea"].includes(document.activeElement.localName)
    ){
      document.activeElement.blur();
    }
    if(
      !Program.Shortcuts.keyheld[event.keyCode] &&
      Program.Shortcuts.functions[event.keyCode] &&
      !["input","textarea"].includes(document.activeElement.localName) &&
      !event.ctrlKey &&
      window.var_username
    ){
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
          if(Program.Main.memoryStorage.getItem(subKey) == 1){
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
            homeTab: {
              Module: {
                title: "(T) Home",
                image: "images/gold.png",
                description: `Change to the home tab`,
                initialToggle: 1,
                key: "T",
                priority: 1,
                func: ()=>{window.navigate('right-home');return true;}
              }
            },
            combatTab: {
              Module: {
                title: "(E) Combat",
                image: "images/gold.png",
                description: `Change to the combat tab`,
                initialToggle: 1,
                key: "E",
                priority: 1,
                func: ()=>{
                  if(document.getElementById("combat-map-div").style.display != "none"){
                    window.exitCombatMap();
                  }
                  navigate('right-combat');
                  return true;
                }
              }
            },
            magicTab: {
              Module: {
                title: "Ma(G)ic",
                image: "images/gold.png",
                description: `Change to the magic tab`,
                initialToggle: 1,
                key: "G",
                priority: 1,
                func: ()=>{navigate('right-magic');return true;}
              }
            },
            mineTab: {
              Module: {
                title: "(M)ining",
                image: "images/gold.png",
                description: `Change to the mining tab`,
                initialToggle: 1,
                key: "M",
                priority: 1,
                func: ()=>{navigate('right-mining');return true;}
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
                func: ()=>{navigate('right-crafting');return true;}
              }
            },
            woodcuttingTab: {
              Module: {
                title: "(W)oodcutting",
                image: "images/gold.png",
                description: `Change to the woodcutting tab`,
                initialToggle: 1,
                key: "W",
                priority: 1,
                func: ()=>{navigate('right-woodcutting');return true;}
              }
            },
            farmingTab: {
              Module: {
                title: "(F)arming",
                image: "images/gold.png",
                description: `Change to the farming tab`,
                initialToggle: 1,
                key: "F",
                priority: 1,
                func: ()=>{navigate('right-farming');return true;}
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
                func: ()=>{navigate('right-brewing');return true;}
              }
            },
            fishingTab: {
              Module: {
                title: "F(I)shing",
                image: "images/gold.png",
                description: `Change to the fishing tab`,
                initialToggle: 1,
                key: "I",
                priority: 1,
                func: ()=>{navigate('right-fishing');return true;}
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
                func: ()=>{navigate('right-cooking');return true;}
              }
            }
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
                priority: 2,
                func: ()=>{
                  if(document.getElementById("navigation-right-crafting").style.display != "none"){
                    window.clicksItem(window.getBestFurnace())
                    return true;
                  }
                }
              }
            },
            smeltSand: {
              Module: {
                title: "(S) Sand",
                image: "images/gold.png",
                description: `While the dialogue for selecting what to smelt is open, press 'S' to smelt sand into glass`,
                initialToggle: 1,
                key: "S",
                priority: 3,
                func: ()=>{
                  if(document.getElementById("dialogue-furnace").style.display != "none"
                  && document.getElementById("dialogue-furnace-selectOre").children.length>0){
                    openFurnaceDialogue2(window.getBestFurnace(),"sand")
                    return true;
                  }
                }
              }
            },
            smeltBronze: {
              Module: {
                title: "(B) Bronze",
                image: "images/gold.png",
                description: `While the dialogue for selecting what to smelt is open, press 'B' to smelt copper into bronze`,
                initialToggle: 1,
                key: "B",
                priority: 2,
                func: ()=>{
                  if(document.getElementById("dialogue-furnace").style.display != "none"
                  && document.getElementById("dialogue-furnace-selectOre").children.length>0){
                    openFurnaceDialogue2(window.getBestFurnace(),"copper")
                    return true;
                  }
                }
              }
            },
            smeltIron: {
              Module: {
                title: "(R) Iron",
                image: "images/gold.png",
                description: `While the dialogue for selecting what to smelt is open, press 'R' to select iron`,
                initialToggle: 1,
                key: "R",
                priority: 1,
                func: ()=>{
                  if(document.getElementById("dialogue-furnace").style.display != "none"
                  && document.getElementById("dialogue-furnace-selectOre").children.length>0){
                    openFurnaceDialogue2(window.getBestFurnace(),"iron")
                    return true;
                  }
                }
              }
            },
            smeltSilver: {
              Module: {
                title: "(L) Silver",
                image: "images/gold.png",
                description: `While the dialogue for selecting what to smelt is open, press 'L' to select silver`,
                initialToggle: 1,
                key: "L",
                priority: 1,
                func: ()=>{
                  if(document.getElementById("dialogue-furnace").style.display != "none"
                  && document.getElementById("dialogue-furnace-selectOre").children.length>0){
                    openFurnaceDialogue2(window.getBestFurnace(),"silver")
                    return true;
                  }
                }
              }
            },
            smeltGold: {
              Module: {
                title: "(D) Gold",
                image: "images/gold.png",
                description: `While the dialogue for selecting what to smelt is open, press 'D' to select gold`,
                initialToggle: 1,
                key: "D",
                priority: 2,
                func: ()=>{
                  if(document.getElementById("dialogue-furnace").style.display != "none"
                  && document.getElementById("dialogue-furnace-selectOre").children.length>0){
                    openFurnaceDialogue2(window.getBestFurnace(),"gold")
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
                priority: 4,
                func: ()=>{
                  if(document.getElementById("dialogue-furnace").style.display != "none"
                  && document.getElementById("dialogue-furnace-selectOre").children.length==0){
                    document.querySelectorAll("#dialogue-furnace-buttons-area div.dialogue-button")[1].click()
                    return true;
                  }
                }
              }
            }
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
            chopPlot1: {
              Module: {
                title: "(1) Chop 1",
                image: "images/gold.png",
                description: `While in the woodcutting tab, chop the tree in plot 1`,
                initialToggle: 1,
                key: "1",
                priority: 1,
                func: ()=>{
                  if(document.getElementById("navigation-right-woodcutting").style.display != "none" && window.var_treeTimer1 <= 1){
                    window.sendBytes('CHOP_TREE=1');
                    return true;
                  }
                }
              }
            },
            chopPlot2: {
              Module: {
                title: "(2) Chop 2",
                image: "images/gold.png",
                description: `While in the woodcutting tab, chop the tree in plot 2`,
                initialToggle: 1,
                key: "2",
                priority: 1,
                func: ()=>{
                  if(document.getElementById("navigation-right-woodcutting").style.display != "none" && window.var_treeTimer2 <= 1){
                    window.sendBytes('CHOP_TREE=2');
                    return true;
                  }
                }
              }
            },
            chopPlot3: {
              Module: {
                title: "(3) Chop 3",
                image: "images/gold.png",
                description: `While in the woodcutting tab, chop the tree in plot 3`,
                initialToggle: 1,
                key: "3",
                priority: 1,
                func: ()=>{
                  if(document.getElementById("navigation-right-woodcutting").style.display != "none" && window.var_treeTimer3 <= 1){
                    window.sendBytes('CHOP_TREE=3');
                    return true;
                  }
                }
              }
            },
            chopPlot4: {
              Module: {
                title: "(4) Chop 4",
                image: "images/gold.png",
                description: `While in the woodcutting tab, chop the tree in plot 4`,
                initialToggle: 1,
                key: "4",
                priority: 1,
                func: ()=>{
                  if(document.getElementById("navigation-right-woodcutting").style.display != "none" && window.var_treeTimer4 <= 1){
                    window.sendBytes('CHOP_TREE=4');
                    return true;
                  }
                }
              }
            },
            chopPlot5: {
              Module: {
                title: "(5) Chop 5",
                image: "images/gold.png",
                description: `While in the woodcutting tab, chop the tree in plot 5`,
                initialToggle: 0,
                key: "5",
                priority: 1,
                func: ()=>{
                  if(document.getElementById("navigation-right-woodcutting").style.display != "none" && window.var_treeTimer5 <= 1){
                    window.sendBytes('CHOP_TREE=5');
                    return true;
                  }
                }
              }
            },
            chopPlot6: {
              Module: {
                title: "(6) Chop 6",
                image: "images/gold.png",
                description: `While in the woodcutting tab, chop the tree in plot 6`,
                initialToggle: 0,
                key: "6",
                priority: 1,
                func: ()=>{
                  if(document.getElementById("navigation-right-woodcutting").style.display != "none" && window.var_treeTimer6 <= 1){
                    window.sendBytes('CHOP_TREE=6');
                    return true;
                  }
                }
              }
            },
            lumberjack: {
              Module: {
                title: "(S) Lumberjack",
                image: "images/gold.png",
                description: `While in the woodcutting tab, use the lumberjack`,
                initialToggle: 1,
                key: "S",
                priority: 5,
                func: ()=>{
                  if(document.getElementById("navigation-right-woodcutting").style.display != "none"){
                    window.clicksItem('lumberJack');
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
            plantDottedLeaf: {
              Module: {
                title: "(D) Plant dot",
                image: "images/gold.png",
                description: `While in the farming tab, click dotted green leaf seeds to plant them in individual plots`,
                initialToggle: 1,
                key: "D",
                priority: 3,
                func: ()=>{
                  if(document.getElementById("navigation-right-farming").style.display != "none"){
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
                priority: 2,
                func: ()=>{
                  if(document.getElementById("navigation-right-farming").style.display != "none"){
                    window.clicksItem('redMushroomSeeds');
                    return true;
                  }
                }
              }
            },
            plantGreenLeaf: {
              Module: {
                title: "(N) Plant gr.",
                image: "images/gold.png",
                description: `While in the farming tab, click green leaf seeds to plant them in individual plots`,
                initialToggle: 1,
                key: "N",
                priority: 1,
                func: ()=>{
                  if(document.getElementById("navigation-right-farming").style.display != "none"){
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
                priority: 2,
                func: ()=>{
                  if(document.getElementById("navigation-right-farming").style.display != "none"){
                    window.clicksItem('limeLeafSeeds');
                    return true;
                  }
                }
              }
            },
            plantPlot1: {
              Module: {
                title: "(1) Plant 1",
                image: "images/gold.png",
                description: `While in the farming tab, plant the selected seed in plot 1`,
                initialToggle: 1,
                key: "1",
                priority: 1,
                func: ()=>{
                  if(document.getElementById("navigation-right-farming").style.display != "none"){
                    window.clicksFarmingPlot(1);
                    return true;
                  }
                }
              }
            },
            plantPlot2: {
              Module: {
                title: "(2) Plant 2",
                image: "images/gold.png",
                description: `While in the farming tab, plant the selected seed in plot 2`,
                initialToggle: 1,
                key: "2",
                priority: 1,
                func: ()=>{
                  if(document.getElementById("navigation-right-farming").style.display != "none"){
                    window.clicksFarmingPlot(2);
                    return true;
                  }
                }
              }
            },
            plantPlot3: {
              Module: {
                title: "(3) Plant 3",
                image: "images/gold.png",
                description: `While in the farming tab, plant the selected seed in plot 3`,
                initialToggle: 1,
                key: "3",
                priority: 1,
                func: ()=>{
                  if(document.getElementById("navigation-right-farming").style.display != "none"){
                    window.clicksFarmingPlot(3);
                    return true;
                  }
                }
              }
            },
            plantPlot4: {
              Module: {
                title: "(4) Plant 4",
                image: "images/gold.png",
                description: `While in the farming tab, plant the selected seed in plot 4`,
                initialToggle: 1,
                key: "4",
                priority: 1,
                func: ()=>{
                  if(document.getElementById("navigation-right-farming").style.display != "none"){
                    window.clicksFarmingPlot(4);
                    return true;
                  }
                }
              }
            },
            plantPlot5: {
              Module: {
                title: "(5) Plant 5",
                image: "images/gold.png",
                description: `While in the farming tab, plant the selected seed in plot 5`,
                initialToggle: 0,
                key: "5",
                priority: 1,
                func: ()=>{
                  if(document.getElementById("navigation-right-farming").style.display != "none"){
                    window.clicksFarmingPlot(5);
                    return true;
                  }
                }
              }
            },
            plantPlot6: {
              Module: {
                title: "(6) Plant 6",
                image: "images/gold.png",
                description: `While in the farming tab, plant the selected seed in plot 6`,
                initialToggle: 0,
                key: "6",
                priority: 1,
                func: ()=>{
                  if(document.getElementById("navigation-right-farming").style.display != "none"){
                    window.clicksFarmingPlot(6);
                    return true;
                  }
                }
              }
            }
          }
        }
      },
      brewingShortcuts: {
        Module: {
          title: "Brewing",
          image: "images/gold.png",
          description: `Shortcuts that work within the brewing tab`,
          initialToggle: 1,
          Submenu: {
            drinkStardustPotion: {
              Module: {
                title: "(S) SD pot",
                image: "images/gold.png",
                description: `While in the brewing tab, drink a stardust potion`,
                initialToggle: 1,
                key: "S",
                priority: 3,
                func: ()=>{
                  if(document.getElementById("navigation-right-brewing").style.display != "none" && window.var_stardustPotion > 0){
                    window.clicksItem('stardustPotion');
                    return true;
                  }
                }
              }
            }
          }
        }
      },
      combatShortcuts: {
        Module: {
          title: "Combat",
          image: "images/gold.png",
          description: `Shortcuts that work within the combat tab`,
          initialToggle: 1,
          Submenu: {
            fightNpc: {
              Module: {
                title: "(E) Fight NPC",
                image: "images/gold.png",
                description: `While in the combat tab, go to the 'Fight NPC' view`,
                initialToggle: 1,
                key: "E",
                priority: 3,
                func: ()=>{
                  if(document.getElementById("navigation-right-combat").style.display != "none"){
                    window.clicksItem('fightMonsterButton');
                    return true;
                  }
                }
              }
            },
            combatLargeManaPotion: {
              Module: {
                title: "(Q) Mana pot",
                image: "images/gold.png",
                description: `While in combat, drink a large mana potion`,
                initialToggle: 1,
                key: "Q",
                priority: 10,
                func: ()=>{
                  if(
                    document.getElementById("navigation-right-combat-fighting").style.display != "none" &&
                    document.getElementById("fighting-screen-potions-area-largeManaPotion").style.display != "none"
                  ){
                    document.getElementById("fighting-screen-potions-area-largeManaPotion").click();
                    return true;
                  }
                }
              }
            },
            combatSpellHeal: {
              Module: {
                title: "(A) Heal",
                image: "images/gold.png",
                description: `While in combat, use the heal spell`,
                initialToggle: 1,
                key: "A",
                priority: 10,
                func: ()=>{
                  if(
                    document.getElementById("navigation-right-combat-fighting").style.display != "none" &&
                    document.getElementById("combat-spell-heal").style.display != "none"
                  ){
                    document.getElementById("combat-spell-heal").click();
                    return true;
                  }
                }
              }
            },
            combatSpellPoison: {
              Module: {
                title: "(S) Poison",
                image: "images/gold.png",
                description: `While in combat, use the poison spell`,
                initialToggle: 1,
                key: "S",
                priority: 10,
                func: ()=>{
                  if(
                    document.getElementById("navigation-right-combat-fighting").style.display != "none" &&
                    document.getElementById("combat-spell-poison").style.display != "none"
                  ){
                    document.getElementById("combat-spell-poison").click();
                    return true;
                  }
                }
              }
            },
            combatSpellReflect: {
              Module: {
                title: "(D) Reflect",
                image: "images/gold.png",
                description: `While in combat, use the reflect spell`,
                initialToggle: 1,
                key: "D",
                priority: 10,
                func: ()=>{
                  if(
                    document.getElementById("navigation-right-combat-fighting").style.display != "none" &&
                    document.getElementById("combat-spell-reflect").style.display != "none"
                  ){
                    document.getElementById("combat-spell-reflect").click();
                    return true;
                  }
                }
              }
            },
            combatSpellFire: {
              Module: {
                title: "(F) Fire",
                image: "images/gold.png",
                description: `While in combat, use the fire spell`,
                initialToggle: 1,
                key: "F",
                priority: 10,
                func: ()=>{
                  if(
                    document.getElementById("navigation-right-combat-fighting").style.display != "none" &&
                    document.getElementById("combat-spell-fire").style.display != "none"
                  ){
                    document.getElementById("combat-spell-fire").click();
                    return true;
                  }
                }
              }
            },
            combatSpellTeleport: {
              Module: {
                title: "(G) Teleport",
                image: "images/gold.png",
                description: `While in combat, use the teleport spell`,
                initialToggle: 1,
                key: "G",
                priority: 10,
                func: ()=>{
                  if(
                    document.getElementById("navigation-right-combat-fighting").style.display != "none" &&
                    document.getElementById("combat-spell-teleport").style.display != "none"
                  ){
                    document.getElementById("combat-spell-teleport").click();
                    return true;
                  }
                }
              }
            },
            combatSpellFreeze: {
              Module: {
                title: "(H) Freeze",
                image: "images/gold.png",
                description: `While in combat, use the freeze spell`,
                initialToggle: 1,
                key: "H",
                priority: 10,
                func: ()=>{
                  if(
                    document.getElementById("navigation-right-combat-fighting").style.display != "none" &&
                    document.getElementById("combat-spell-freeze").style.display != "none"
                  ){
                    document.getElementById("combat-spell-freeze").click();
                    return true;
                  }
                }
              }
            },
            combatSpellGhostScan: {
              Module: {
                title: "(J) Ghost scan",
                image: "images/gold.png",
                description: `While in combat, use the ghost scan spell`,
                initialToggle: 1,
                key: "J",
                priority: 10,
                func: ()=>{
                  if(
                    document.getElementById("navigation-right-combat-fighting").style.display != "none" &&
                    document.getElementById("combat-spell-ghostScan").style.display != "none"
                  ){
                    document.getElementById("combat-spell-ghostScan").click();
                    return true;
                  }
                }
              }
            },
            combatSpellInvisibility: {
              Module: {
                title: "(K) Invisibility",
                image: "images/gold.png",
                description: `While in combat, use the invisibility spell`,
                initialToggle: 1,
                key: "K",
                priority: 10,
                func: ()=>{
                  if(
                    document.getElementById("navigation-right-combat-fighting").style.display != "none" &&
                    document.getElementById("combat-spell-invisibility").style.display != "none"
                  ){
                    document.getElementById("combat-spell-invisibility").click();
                    return true;
                  }
                }
              }
            }
          }
        }
      },
      menuShortcuts: {
        Module: {
          title: "Menus",
          image: "images/gold.png",
          description: `Shortcuts that deal with menus and dialogues. Includes option to disable 'tab' to open the Activity Log`,
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
                description: `Confirm a dialogue with three options, by selecting the top button`,
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
                  if(document.getElementById("wild-dialogue") && document.getElementById("wild-dialogue").style.display != "none"){
                    document.getElementById("dialogue-wild-input-confirm").click();
                    return true;
                  }
                }
              }
            },
            activityLogHotkey: {
              Module: {
                title: "(Tab) Actvity Log",
                image: "images/gold.png",
                description: `Open the Activity Log`,
                initialToggle: 1,
                key: "å",
                priority: 1,
                func: ()=>{
                  //this is handled elsewhere
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
                initialToggle: 1, //If set to 0, will have to be enabled in the dh3fixed menu before it works
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

  Program.Notifications = {}

  Program.Notifications.elements = {}

  Program.Notifications.defaultModuleDefinitions = {
    stardustPotionTimer: {
      title: "Stardust Potion",
      variable: "stardustPotionTimer",
      image: "images/stardustPotion.png",
      settings: {
        type: "time",
        showCooldown: false,
        showFinished: true,
      },
      tab: "brewing"
    },
    oyster: {
      title: "Oyster",
      variable: "oyster",
      image: "images/oyster.png",
      settings: {
        type: "number",
        showWhen: "above",
        compareValue: 10,
      },
      tab: "fishing"
    },
    oil: {
      title: "Oil",
      variable: "oil",
      image: "images/oil.png",
      settings: {
        type: "number",
        showWhen: "below",
        compareValue: 1000,
      },
      tab: "mining"
    }
  };

  Program.Notifications.farmingReadyNotification = {}

  Program.Notifications.farmingReadyNotification.listener = changedItem => {
    if(changedItem.includes("plot") && changedItem.length===5){
      let show = false;
      for(let i = 1; i <= 6; i++){
        if(window["var_plotUnlocked"+i]=="1" && window["var_plot"+i] == "none"){
          show = true;
        }
      }
      if(Program.Main.memoryStorage.getItem("farmingReadyNotification")==1){
        Program.Notifications.elements.farmingReadyNotification.toggle(show);
      }
    }
  }

  Program.Notifications.farmingReadyNotification.init = ()=>{
    Program.Notifications.elements.farmingReadyNotification = Program.Main.createNotification("farmingReadyNotification", "images/farmingSkill.png", "green", "farming");
    Program.Notifications.elements.farmingReadyNotification.setValue("Available");
    Program.Notifications.farmingReadyNotification.listener("plot1");
    Program.Notifications.elements.farmingReadyNotification.element.onclick = ()=>window.navigate('right-farming');
  }

  Program.Notifications.farmingReadyNotification.destroy = ()=>{
    Program.Notifications.elements.farmingReadyNotification.element.remove()
    Program.Notifications.elements.farmingReadyNotification = {};
  }

  Program.Notifications.createNotificationModule = (notificationModuleDefinition) => {
    let storedNotificationModulesString = Program.Main.memoryStorage.getItem("notificationModules");
    let storedNotificationModules;

    if(!storedNotificationModulesString){
      storedNotificationModules = Program.Notifications.defaultModuleDefinitions;
    }else{
      storedNotificationModules = JSON.parse(storedNotificationModulesString)
    }

    storedNotificationModules[notificationModuleDefinition.variable] = notificationModuleDefinition;

    Program.Notifications.instantiateNotificationModule(notificationModuleDefinition);

    Program.Main.memoryStorage.setItem("notificationModules", JSON.stringify(storedNotificationModules));
  }

  Program.Notifications.instantiateNotificationModule = (notificationModuleDefinition) => {
    let moduleName = "custom-"+notificationModuleDefinition.variable+"-Notification"
    let init;
    let destroy;
    let listener;
    let description;
    if(notificationModuleDefinition.settings.type === "time"){
      let cooldownInit = ()=>{
        Program.Notifications.elements[notificationModuleDefinition.variable+"-cd"] = Program.Main.createNotification("custom-"+notificationModuleDefinition.variable+"-cd", notificationModuleDefinition.image, "red", notificationModuleDefinition.tab);
        Program.Notifications.elements[notificationModuleDefinition.variable+"-cd"].setValue(window.formatTime(window["var_"+notificationModuleDefinition.variable]));
        Program.Notifications.elements[notificationModuleDefinition.variable+"-cd"].toggle(window["var_"+notificationModuleDefinition.variable] > 0)
      }

      let finishedInit = ()=>{
        Program.Notifications.elements[notificationModuleDefinition.variable+"-f"] = Program.Main.createNotification("custom-"+notificationModuleDefinition.variable+"-f", notificationModuleDefinition.image, "green", notificationModuleDefinition.tab);
        Program.Notifications.elements[notificationModuleDefinition.variable+"-f"].setValue("Ready");
        Program.Notifications.elements[notificationModuleDefinition.variable+"-f"].toggle(window["var_"+notificationModuleDefinition.variable] <= 0)
      }


      if(notificationModuleDefinition.settings.showCooldown && notificationModuleDefinition.settings.showFinished){
        init = ()=>{cooldownInit();finishedInit();}
      }else if (notificationModuleDefinition.settings.showCooldown){
        init = cooldownInit;
      }else{
        init = finishedInit;
      }

      let cooldownDestroy = ()=>{
        Program.Notifications.elements[notificationModuleDefinition.variable+"-cd"].element.remove()
        Program.Notifications.elements[notificationModuleDefinition.variable+"-cd"] = {};
      }

      let finishedDestroy = ()=>{
        Program.Notifications.elements[notificationModuleDefinition.variable+"-f"].element.remove()
        Program.Notifications.elements[notificationModuleDefinition.variable+"-f"] = {};
      }

      if(notificationModuleDefinition.settings.showCooldown && notificationModuleDefinition.settings.showFinished){
        destroy = ()=>{cooldownDestroy();finishedDestroy();}
      }else if (notificationModuleDefinition.settings.showCooldown){
        destroy = cooldownDestroy;
      }else{
        destroy = finishedDestroy;
      }

      listener = changedItem => {
        if(changedItem == notificationModuleDefinition.variable){
          if(Program.Main.memoryStorage.getItem(moduleName)==1){
            if(Program.Notifications.elements[notificationModuleDefinition.variable+"-f"]){
              Program.Notifications.elements[notificationModuleDefinition.variable+"-f"].toggle(window["var_"+notificationModuleDefinition.variable] <= 0)
            }
            if(Program.Notifications.elements[notificationModuleDefinition.variable+"-cd"]){
              Program.Notifications.elements[notificationModuleDefinition.variable+"-cd"].toggle(window["var_"+notificationModuleDefinition.variable] > 0)
              Program.Notifications.elements[notificationModuleDefinition.variable+"-cd"].setValue(window.formatTime(window["var_"+notificationModuleDefinition.variable]))
            }
          }
        }
      }

      description = `Show a notification for the variable ${notificationModuleDefinition.variable}.
      ${notificationModuleDefinition.settings.showCooldown?"Displays the current time of the variable as long as its above 0":""}
      ${notificationModuleDefinition.settings.showFinished?"Shows a notification when the time is below or equal to 0":""}
      `
    }

    if(notificationModuleDefinition.settings.type === "number"){
      let compareFunction = (compareValue)=> {
        if(notificationModuleDefinition.settings.showWhen == "above"){
          return (realValue) => Number(realValue) >= Number(compareValue);
        }else{
          return (realValue) => Number(realValue) <= Number(compareValue);
        }
      }
      let compare = compareFunction(notificationModuleDefinition.settings.compareValue);

      init = ()=>{
        Program.Notifications.elements[notificationModuleDefinition.variable] = Program.Main.createNotification("custom-"+notificationModuleDefinition.variable, notificationModuleDefinition.image, "fishing", notificationModuleDefinition.tab);
        Program.Notifications.elements[notificationModuleDefinition.variable].setValue(window["var_"+notificationModuleDefinition.variable])
        Program.Notifications.elements[notificationModuleDefinition.variable].toggle(compare(window["var_"+notificationModuleDefinition.variable]))
      }

      destroy = ()=>{
        Program.Notifications.elements[notificationModuleDefinition.variable].element.remove();
        Program.Notifications.elements[notificationModuleDefinition.variable] = {};
      }

      listener = changedItem => {
        if(changedItem == notificationModuleDefinition.variable){
          if(Program.Main.memoryStorage.getItem(moduleName)==1){
            Program.Notifications.elements[notificationModuleDefinition.variable].toggle(compare(window["var_"+notificationModuleDefinition.variable]));
            Program.Notifications.elements[notificationModuleDefinition.variable].setValue(window["var_"+notificationModuleDefinition.variable])
          }
        }
      }

      description = `Show a notification for the variable ${notificationModuleDefinition.variable}.
      Displays the current value of the variable as long as its ${notificationModuleDefinition.settings.showWhen}
      or equal to ${notificationModuleDefinition.settings.compareValue}`

    }

    Program.WindowExtensions.add("manageChangedItem", {
      module: "custom-"+notificationModuleDefinition.variable+"Notification",
      func: listener,
      priority: 2
    });

    let toggle;
    if(Program.Main.memoryStorage.getItem(moduleName)==1){
      toggle = 1;
    }else if(Program.Main.memoryStorage.getItem(moduleName)==0){
      toggle = 0;
    }else{
      toggle = 1;
      Program.Main.memoryStorage.setItem(moduleName, "1")
    }

    let deleteFunction = (event)=>{
      event.stopPropagation()
      try{
        destroy();
      }catch(e){
        console.warn(e)
      }
      document.getElementById(`button-div-${moduleName}`).remove();
      Program.Main.memoryStorage.removeItem(moduleName);
      let storedNotificationModulesString = Program.Main.memoryStorage.getItem("notificationModules")
      let storedNotifications = JSON.parse(storedNotificationModulesString);
      storedNotifications[notificationModuleDefinition.variable] = undefined;
      Program.Main.memoryStorage.setItem("notificationModules", JSON.stringify(storedNotifications));
    }




    let notificationModule = {
      Module: {
        title: notificationModuleDefinition.title,
        image: "images/silver.png",
        description,
        initialToggle: toggle,
        init,
        destroy,
        delete: deleteFunction
      }
    }

    if(Program.initiated){
      let notificationsDialogue = document.getElementById("dialogue-Notifications");
      let button = Program.Main.createButton(
        moduleName,
        notificationModuleDefinition.title,
        notificationModule.Module.description,
        notificationModule.Module.image,
        () => {document.getElementById("img-"+moduleName).src = Program.Main.toggle(notificationModule.Module, moduleName)?notificationModule.Module.image:"images/stone.png"},
        false,
        false,
        deleteFunction
      )
      notificationsDialogue.insertBefore(button, notificationsDialogue.children[notificationsDialogue.children.length-3]);
    }else{
      Program.Notifications.Module.Submenu[moduleName] = notificationModule
    }
    if(toggle == 1){
      init();
    }
  }


  Program.Notifications.init = ()=>{
    Program.WindowExtensions.add("manageChangedItem", {
      module: "farmingReadyNotification",
      func: Program.Notifications.farmingReadyNotification.listener,
      priority: 1
    });
  }

  Program.Notifications.customNotifications = {}

  Program.Notifications.customNotifications.init = ()=>{
    let storedNotificationModulesString = Program.Main.memoryStorage.getItem("notificationModules");
    let storedNotificationModules;

    if(!storedNotificationModulesString){
      storedNotificationModules = Program.Notifications.defaultModuleDefinitions;
      Program.Main.memoryStorage.setItem("notificationModules", JSON.stringify(storedNotificationModules));
    }else{
      storedNotificationModules = JSON.parse(storedNotificationModulesString)
    }

    for(let key in storedNotificationModules){
      Program.Notifications.instantiateNotificationModule(storedNotificationModules[key]);
    }

    Program.Main.whenLoggedIn(Program.Notifications.customNotifications.createCreateNotificationsMenu);

  }

  Program.Notifications.customNotifications.createCreateNotificationsMenu = () => {
    let inputForms = [];

    let titleInput = document.createElement("input");
    titleInput.id = "createNotification-title";
    titleInput.dataset.lpignore = true;
    inputForms.push({
      label: "Name",
      input: titleInput,
      get: ()=>{return {title: titleInput.value}}
    })

    let variableInput = document.createElement("input");
    variableInput.id = "createNotification-variable"
    variableInput.dataset.lpignore = true;
    variableInput.setAttribute("list","createNotification-variable-list")
    let variableInputDatalist = document.createElement("datalist");
    Object.keys(window)
    .filter(a=>a.startsWith("var_"))
    .map(a=>a.substring(4))
    .map(a => {
      let option = document.createElement("option");
      option.value = Program.Main.decamelize(a);
      option.dataset.variableName=a;
      return option;
    })
    .forEach(a=>variableInputDatalist.appendChild(a));
    variableInputDatalist.id = "createNotification-variable-list";
    variableInput.appendChild(variableInputDatalist);


    let variableDisplay = document.createElement("div");
    variableDisplay.appendChild(document.createTextNode("Current value: "))
    let variableDisplaySpan = document.createElement("span");
    variableDisplaySpan.id = "createNotification-variable-display";
    variableDisplay.appendChild(variableDisplaySpan);

    variableInput.oninput = event => {
      let option = event.target.querySelector("option[value='"+event.target.value+"']");
      if(option){
        let value = option.dataset.variableName;
        if(window.hasOwnProperty("var_"+value)){
          variableDisplaySpan.textContent = window["var_"+value];
        }
      }
    }

    let variableDiv = document.createElement("div")
    variableDiv.appendChild(variableInput);
    variableDiv.appendChild(variableDisplay);

    inputForms.push({
      label: "Variable",
      input: variableDiv,
      get: ()=>{
        let option = variableInput.querySelector("option[value='"+variableInput.value+"']");
        let variableName;
        if(option && option.dataset){
          variableName = option.dataset.variableName;
        }
        return {variable: variableName}
      }
    })

    let imageInput = document.createElement("input");
    imageInput.id = "createNotification-image";
    imageInput.value = "eventSigil2";
    imageInput.dataset.lpignore = true

    let imageDisplay = document.createElement("img");
    imageDisplay.id = "createNotification-image-display";
    imageDisplay.className = "img-50";
    imageDisplay.style.visibility = "hidden";
    imageDisplay.src = "images/eventSigil2.png";
    imageDisplay.onload = ()=> imageDisplay.style.visibility = "visible";
    imageDisplay.onerror = ()=> imageDisplay.style.visibility = "hidden";

    imageInput.oninput = event => {
      imageDisplay.src = "images/"+event.target.value+window.getImageExtention(event.target.value);
    }
    let imageDiv = document.createElement("div");
    let imageTextDiv = document.createElement("div");
    imageTextDiv.appendChild(document.createTextNode("Go to "));
    let imageLink = document.createElement("a");
    imageLink.href = "https://dh3.diamondhunt.co/images";
    imageLink.setAttribute("target", "_blank");
    imageLink.appendChild(document.createTextNode("dh3.diamondhunt.co/images"))
    imageTextDiv.appendChild(imageLink);
    imageTextDiv.appendChild(document.createTextNode(" to see a list of all images"));
    imageTextDiv.style.fontSize = "8pt";
    imageDiv.appendChild(imageTextDiv);
    imageDiv.appendChild(imageInput)
    imageDiv.appendChild(imageDisplay)

    inputForms.push({
      label: "Image",
      input: imageDiv,
      get: ()=>{return {image: "images/"+imageInput.value+".png"}}
    })

    let cdInput = document.createElement("input");
    let cdLabel = document.createElement("label");
    cdLabel.textContent = "Show cooldown";
    cdInput.type = "checkbox";
    cdInput.dataset.lpignore = true;
    let cdDiv = document.createElement("div")
    cdDiv.appendChild(cdInput)
    cdDiv.appendChild(cdLabel)


    let fInput = document.createElement("input");
    let fLabel = document.createElement("label");
    fLabel.textContent = "Show when finished";
    fInput.type = "checkbox";
    fInput.dataset.lpignore = true;
    let fDiv = document.createElement("div")
    fDiv.appendChild(fInput)
    fDiv.appendChild(fLabel)

    let timeDiv = document.createElement("div");
    timeDiv.style.display = "none";
    timeDiv.appendChild(cdDiv)
    timeDiv.appendChild(fDiv)

    let numberDiv = document.createElement("div");
    numberDiv.style.display = "none";
    numberDiv.appendChild(document.createTextNode("Show when "));

    let numberShowWhenSelect = document.createElement("select");
    let aboveOption = document.createElement("option");
    aboveOption.value = "above"
    aboveOption.appendChild(document.createTextNode("above"));
    numberShowWhenSelect.appendChild(aboveOption)
    let belowOption = document.createElement("option");
    belowOption.value = "below"
    belowOption.appendChild(document.createTextNode("below"));
    numberShowWhenSelect.appendChild(belowOption)
    numberDiv.appendChild(numberShowWhenSelect);

    numberDiv.appendChild(document.createTextNode(" or equal to "));

    let numberValueInput = document.createElement("input");
    numberValueInput.type = "number";
    numberValueInput.style.width = "25%"
    numberDiv.appendChild(numberValueInput);


    let settingSelectDiv = document.createElement("div");
    let settingTimeRadio = document.createElement("input");
    settingTimeRadio.type = "radio";
    settingTimeRadio.name = "settingType";
    settingTimeRadio.value = "time";
    let settingTimeLabel = document.createElement("label");
    settingTimeLabel.textContent = "Timer"
    settingTimeRadio.onchange = (event)=>{
      timeDiv.style.display = "";
      numberDiv.style.display = "none";
    }

    let settingNumberRadio = document.createElement("input");
    settingNumberRadio.type = "radio";
    settingNumberRadio.name = "settingType";
    settingNumberRadio.value = "number";
    let settingNumberLabel = document.createElement("label");
    settingNumberLabel.textContent = "Number"
    settingNumberRadio.onchange = (event)=>{
      timeDiv.style.display = "none";
      numberDiv.style.display = "";
    }

    settingSelectDiv.appendChild(settingTimeRadio);
    settingSelectDiv.appendChild(settingTimeLabel);
    settingSelectDiv.appendChild(settingNumberRadio);
    settingSelectDiv.appendChild(settingNumberLabel);



    let settingsDiv = document.createElement("div");
    settingsDiv.appendChild(settingSelectDiv)
    settingsDiv.appendChild(timeDiv)
    settingsDiv.appendChild(numberDiv)

    inputForms.push({
      label: "Settings",
      input: settingsDiv,
      get: ()=>{
        if(timeDiv.style.display != "none"){
          return {
            settings: {
              type: "time",
              showCooldown: cdInput.checked,
              showFinished: fInput.checked,
            }
          }
        }else{
          return {
            settings: {
              type: "number",
              showWhen: numberShowWhenSelect.value,
              compareValue: numberValueInput.value,
            }
          }
        }
      }
    })

    let tabInput = document.createElement("input");
    tabInput.setAttribute("list", "createNotification-tab-list")
    let tabInputDatalist = document.createElement("datalist");
    ["home", "combat", "magic", "mining", "crafting", "woodcutting", "farming", "brewing", "fishing", "cooking", "market"]
    .map(a => {
      let option = document.createElement("option");
      option.value = a
      return option;
    })
    .forEach(a=>tabInputDatalist.appendChild(a));
    tabInput.appendChild(tabInputDatalist);
    tabInput.dataset.lpignore = true;
    tabInputDatalist.id = "createNotification-tab-list";
    let tabDiv = document.createElement("div");
    tabDiv.appendChild(document.createTextNode("Which tab does this notification belong to?"))
    tabDiv.appendChild(tabInput);

    inputForms.push({
      label: "Tab",
      input: tabDiv,
      get: ()=>{return {
        tab: tabInput.value
      }}
    })



    let elements = inputForms.map(a=>{
      let div = document.createElement("div");
      div.style.fontSize = "16pt";
      div.style.margin = "12px 0";
      div.style.border = "1px solid silver";
      div.style.backgroundColor = "#e6e6e6";
      div.style.color = "black";
      div.style.textAlign = "center"
      div.style.padding = "20px"
      let labelDiv = document.createElement("div");
      labelDiv.appendChild(document.createTextNode(a.label));
      div.appendChild(labelDiv);
      a.input.style.fontSize = "12pt";
      div.appendChild(a.input);
      return div;
    })


    let errorDiv = document.createElement("div")
    errorDiv.style.color = "red";

    let submitButton = document.createElement("div");
    submitButton.appendChild(document.createTextNode("Submit"))
    submitButton.className = "dialogue-button";
    submitButton.style.fontSize = "16pt";
    submitButton.style.margin = "24px 0";
    submitButton.onclick = ()=>{
      errorDiv.textContent = "";
      let definition = Object.assign({},...inputForms.map(a=>a.get()));
      if(!definition.title) return errorDiv.textContent = "Title is a required field";
      if(!definition.image) return errorDiv.textContent = "Image is a required field";
      if(!definition.tab) return errorDiv.textContent = "Tab is a required field";
      if(!definition.variable) return errorDiv.textContent = "Variable is a required field";
      if(definition.settings.type=="time"){
        if(!definition.settings.showCooldown && !definition.settings.showFinished) return errorDiv.textContent = "Settings is a required field"
      }
      if(definition.settings.type=="number"){
        if(!definition.settings.compareValue || !definition.settings.showWhen) return errorDiv.textContent = "Settings is a required field"
      }

      Program.Notifications.createNotificationModule(definition);
      document.getElementById("dialogue-createNotificationMenu").lastElementChild.click()
    }
    elements.push(submitButton)
    elements.push(errorDiv)

    let dialogue = Program.Main.createDialogue("createNotificationMenu", "Create", elements, undefined, "Notifications")
    Program.Main.saveDialogue(dialogue, "createNotificationMenu");
  }

  Program.Notifications.customNotifications.destroy = ()=>{

  }

  Program.Notifications.customNotifications.openDialogue = ()=>{
    Program.Main.showSettingsDialogue(Program.Main.IDs["Notifications"], Program.Main.IDs["createNotificationMenu"]);
  }

  Program.Notifications.Module = {
    title: "Notifications",
    image: "images/silver.png",
    init: Program.Notifications.init,
    destroy: Program.Notifications.destroy,
    description: `Adds notifications to the notification area below the skill levels`,
    initialToggle: 1,
    Submenu: {
      customNotifications: {
        Module: {
          title: "Create",
          image: "images/plus.png",
          description: `Create a new custom notification`,
          initialToggle: 1,
          init: Program.Notifications.customNotifications.init,
          destroy: Program.Notifications.customNotifications.destroy,
          click: Program.Notifications.customNotifications.openDialogue
        }
      },
      farmingReadyNotification: {
        Module: {
          title: "Farming",
          image: "images/silver.png",
          description: `Shows a notification when there is a farming plot available with nothing planted`,
          initialToggle: 1,
          init: Program.Notifications.farmingReadyNotification.init,
          destroy: Program.Notifications.farmingReadyNotification.destroy
        }
      }
    }
  }

  Program.Tools = {};

  Program.Tools.init = ()=>{};

  Program.Tools.destroy = ()=>{};

  Program.Tools.activityLog = {};

  Program.Tools.activityLog.init = ()=>{
    let onclick = ()=>{
      if(Program.ActivityLog.visible){
        Program.ActivityLog.hideLog();
      }else{
        Program.ActivityLog.showLog()
      }
    }
    Program.Tools.activityLog.element = Program.Main.createItemBox(onclick, "activityLog-button", "ACTIVITY LOG", "infoIcon", "Show loot history");
    let settingsBox = document.getElementById("item-box-dh3-fixed")
    let home = document.getElementById("item-section-home-1");
    if(settingsBox){
      home.insertBefore(Program.Tools.activityLog.element, settingsBox.nextSibling)
    }else{
      home.insertBefore(Program.Tools.activityLog.element, home.firstElementChild);
    }
  }

  Program.Tools.activityLog.destroy = ()=>{
    Program.Tools.activityLog.element.remove();
  }

  Program.Tools.anwinity = {}

  Program.Tools.getGem = (tool) => {
    let result = null;
    ["diamond", "ruby", "emerald", "sapphire"].some(gem => {
      if(window[`var_${gem}${tool}`]) {
        result = gem;
        return true;
      }
    });
    return result || "none";
  }

  Program.Tools.anwinity.init = ()=>{
    let onclick = ()=>{
      let pdata = {
        skills: {
          combat: window.var_combatXp||0,
          magic: window.var_magicXp||0,
          mining: window.var_miningXp||0,
          crafting: window.var_craftingXp||0,
          woodcutting: window.var_woodcuttingXp||0,
          farming: window.var_farmingXp||0,
          brewing: window.var_brewingXp||0,
          fishing: window.var_fishingXp||0,
          cooking: window.var_cookingXp||0
        },
        tools: {
          axe: Program.Tools.getGem("Axe"),
          brewingKit: Program.Tools.getGem("BrewingKit"),
          fishingRod: Program.Tools.getGem("FishingRod"),
          hammer: Program.Tools.getGem("StardustHammer"),
          pickaxe: Program.Tools.getGem("StardustPickaxe"),
          rake: Program.Tools.getGem("Rake"),
          shovel: Program.Tools.getGem("Shovel"),
          bonemealBin: Program.Tools.getGem("BonemealBin"),
          harpoon: Program.Tools.getGem("Harpoon"),
          smallNet: Program.Tools.getGem("SmallFishingNet"),
          chisel: Program.Tools.getGem("Chisel"),
          chainsaw: Program.Tools.getGem("Chainsaw"),
          trowel: Program.Tools.getGem("Trowel"),
          watch: Program.Tools.getGem("Watch")
        },
        inventory: {
          dottedGreenLeaf: window.var_dottedGreenLeaf||0,
          greenLeaf: window.var_greenLeaf||0,
          limeLeaf: window.var_limeLeaf||0,
          goldLeaf: window.var_goldLeaf||0,
          strangeLeaf: window.var_strangeLeafFix||0,
          bronzeBar: window.var_bronzeBars||0,
          ironBar: window.var_ironBars||0,
          silverBar: window.var_silverBars||0,
          goldBar: window.var_goldBars||0,
          promethiumBar: window.var_promethiumBars||0,
          redMushroom: window.var_redMushroom||0,
          blewitMushroom: window.var_blewitMushroom||0,
          bones: window.var_bones||0,
          oil: window.var_oil||0,
          logs: window.var_logs||0,
          vial: window.var_vial||0,
          largeVial: window.var_largeVial||0
        },
        machines: {
          drills: window.var_drills||0,
          crushers: window.var_crushers||0,
          giantDrills: window.var_giantDrills||0,
          excavators: window.var_excavators||0
        },
        username: window.var_username,
        stardust: window.var_stardust||0,
        donorBonus: !!(window.var_bonusXp),
        oilIncome: window.var_oilIn||0,
        mana: window.var_heroMaxMana||0
      };
      pdata = btoa(JSON.stringify(pdata));
      window.open("https://anwinity.com/dh3/#pdata="+pdata, "_blank");
    }

    Program.Tools.anwinity.element = Program.Main.createItemBox(onclick, "anwinity-button", "ANWINITY", "carePackage1", "anwinity.com/dh3");
    let settingsBox = document.getElementById("item-box-dh3-fixed")
    let home = document.getElementById("item-section-home-1");
    if(settingsBox){
      home.insertBefore(Program.Tools.anwinity.element, settingsBox.nextSibling)
    }else{
      home.insertBefore(Program.Tools.anwinity.element, home.firstElementChild);
    }
  }

  Program.Tools.anwinity.destroy = ()=>{
    Program.Tools.anwinity.element.remove();
  }


  Program.Tools.Module = {
    title: "Tools",
    image: "images/copper.png",
    init: Program.Tools.init,
    destroy: Program.Tools.destroy,
    description: `Adds tools as items in the home tab`,
    initialToggle: 1,
    Submenu: {
      activityLog: {
        Module: {
          title: "Activity Log",
          image: "images/copper.png",
          description: `Adds a button in the home tab to open the activity log.
          This toggle only affects whether the button is visible in the home menu,
          not whether the activy log is collecting data.
          The activity log can also be opened by clicking 'tab' (unless that's disabled in Shortcuts)`,
          initialToggle: 1,
          init: Program.Tools.activityLog.init,
          destroy: Program.Tools.activityLog.destroy
        }
      },
      anwinity: {
        Module: {
          title: "Anwinity",
          image: "images/copper.png",
          description: `Adds a button in the home tab to open anwinity.com/dh3 with data from your game`,
          initialToggle: 1,
          init: Program.Tools.anwinity.init,
          destroy: Program.Tools.anwinity.destroy
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
          funcs.push(sorted[i].func)
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

  //Program

  Program.initiate = (Module)=>{
    for(let key in Module){
      let module = Module[key].Module
      if(!module){
        //Module[key].init?Module[key].init():{}
        continue;
      }
      if(module.Submenu){
        Program.initiate(module.Submenu);
      }
      let stored = Program.Main.memoryStorage.getItem(key);
      if(stored == 1){
        Program.forceInit(module, key)
        console.log(`Module ${key} initiated`);
      }else if(stored == 0){
        console.log(`Module ${key} not initiated, toggled off`);
      }else{
        Program.Main.memoryStorage.setItem(key, module.initialToggle);
        module.initialToggle?(module.init?module.init():{}):{};
        console.log(`Module ${key} initiated, first time`);
      }
    }
  }
  let attempts = {}
  Program.forceInit = (module, key)=>{
    try{
      module.init?module.init():{}
    }catch(error){
      attempts[key] = attempts[key]?attempts[key]+1:1
      try{module.destroy()}catch(e){}
      if(attempts[key]>3){
        return;
      }
      console.error(error);
      console.warn(`Initiating module ${key} failed, retrying in 5 seconds`)
      setTimeout(()=>Program.forceInit(module, key),5000)
    }
  }

  Program.Main.memoryStorage.init();
  Program.initiate(Program);
  Program.forceInit(Program.Main,"Main");
  Program.forceInit(Program.WindowExtensions,"WindowExtensions");
  Program.initiated = true;
})();

// ==UserScript==
// @name           hwmFriendsTabs
// @author         Tamozhnya1
// @namespace      Tamozhnya1
// @description    Сортировка друзей по группам, заметки на pl_info
// @version        1.3
// @include        https://*.heroeswm.ru/home.php
// @include        https://*.heroeswm.ru/friends.php
// @include        https://*.lordswm.com/home.php
// @include        https://*.lordswm.com/friends.php
// @include        *heroeswm.ru/pl_info.php*
// @include        *lordswm.com/pl_info.php*

// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/484464/hwmFriendsTabs.user.js
// @updateURL https://update.greasyfork.org/scripts/484464/hwmFriendsTabs.meta.js
// ==/UserScript==

const playerIdMatch = document.cookie.match(/pl_id=(\d+)/);
if(!playerIdMatch) {
    return;
}
const PlayerId = playerIdMatch[1];
addStyle(`
.tablinks {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
}
.tablink {
  background-color: #555;
  color: white;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 7px 8px;
  font-size: 10pt;
  width: auto;
}

.tablink:hover {
  background-color: #777;
}
.tabcontent {
  padding: 20px 20px;
  height: 100%;
}
.scrollable {
    max-height: 80vh;
    overflow-y: auto;
    width: fit-content;
}
`);
const isEn = document.documentElement.lang == "en";
const isNewPersonPage = document.querySelector("div#hwm_no_zoom") ? true : false;
main();
function main() {
    if(location.pathname == "/pl_info.php") {
        const viewingPlayerId = getUrlParamValue(location.href, "id");
        if(viewingPlayerId != PlayerId) {
            const container = document.querySelector("table.wblight > tbody > tr > td:nth-child(2)");
            container.align = "left";
            
            const playerInfoInput = addElement("input", { type: "text", style: "width: 150px;", value: getValue(`PlayerInfo${viewingPlayerId}`, ""), title: isEn ? "Notes" : "Заметки" });
            playerInfoInput.addEventListener("change", function() { setValue(`PlayerInfo${viewingPlayerId}`, this.value); })
            container.insertAdjacentElement("afterbegin", playerInfoInput);
            
            const resourcesTable = container.querySelector("table");
            if(resourcesTable) {
                resourcesTable.style.display = "inline-table";
                resourcesTable.style.verticalAlign = "bottom";
            }
        }
        return;
    }
    //deletePlayerValue("FriendsGroups");
    if(!getPlayerValue("FriendsGroups")) {
        setPlayerValue("FriendsGroups", JSON.stringify([isEn ? "Friends" : "Друзья", isEn ? "Familiar" : "Знакомые", isEn ? "Teachers" : "Учителя", isEn ? "Smiths" : "Кузнецы", isEn ? "Crafters" : "Крафтеры", isEn ? "Celebrities" : "Знаменитости", isEn ? "Clan" : "Клан", isEn ? "Enemies" : "Враги"]))
    }
    drawFriendsTabs();
}
function drawFriendsTabs() {
    let friendsContainer;
    let friendsRefs;
    if(location.pathname == "/home.php") {
        const friendsCaption = Array.from(document.querySelectorAll("a[href='friends.php']")).find(x => x.innerHTML.includes(isEn ? "Friends online" : "Друзья в игре"));
        if(!friendsCaption) {
            return;
        }
        if(isNewPersonPage) {
            friendsContainer = getParent(friendsCaption, "div", 2);
        } else {
            const friendsCaptionTr = friendsCaption.closest("tr");
            const friendsTr = friendsCaptionTr.nextElementSibling;
            friendsContainer = friendsTr.firstChild;
        }
        friendsRefs = Array.from(friendsContainer.querySelectorAll("a[href^='pl_info.php']"));
    }
    if(location.pathname == "/friends.php") {
        const friendsForm = document.querySelector("form[name=f]");
        const mainFriendsTable = friendsForm.querySelector("form[name=f] table");
        mainFriendsTable.removeAttribute("width");
        mainFriendsTable.removeAttribute("align");
        mainFriendsTable.style.width = "auto;"
        
        const friendsSourceDiv = addElement("div", { class: "scrollable"}, friendsForm, "afterbegin");
        friendsSourceDiv.appendChild(mainFriendsTable);
        
        friendsRefs = Array.from(mainFriendsTable.querySelectorAll("a[href^='pl_info.php']"));

        const mainFriendsRow = document.querySelector("form[name=f]").closest("table").rows[0];
        mainFriendsRow.cells[0].style = "width: 25%;";
        friendsContainer = addElement("td", { style: `height: 100%;` }, mainFriendsRow);
    }
    friendsRefs.forEach(x => x.addEventListener("dragstart", function(e) { e.dataTransfer.setData("friendId", getUrlParamValue(e.target.href, "id")); }));
    let friendsGroupsContainer = document.querySelector("div#friendsGroupsContainer");
    if(!friendsGroupsContainer) {
        friendsGroupsContainer = addElement("div", { id: "friendsGroupsContainer", style: `position: relative; width: 100%; height: 100%; vertical-align: top;` }, friendsContainer);
    } else {
        friendsGroupsContainer.innerHTML = "";
    }
    const tabNames = JSON.parse(getPlayerValue("FriendsGroups"));
    if(parseInt(getPlayerValue("CurrentFriendsTab", 0)) > tabNames.length - 1) {
        setPlayerValue("CurrentFriendsTab", 0);
    }

    //console.log(tabNames)
    const buttonsContainer = addElement("div", { class: "tablinks" }, friendsGroupsContainer);
    tabNames.forEach((tabName, tabIndex) => {
        const button = addElement("button", { id: `showFriendsTabButton${tabIndex}`, class: "tablink", draggable: true, innerHTML: tabName }, buttonsContainer);
        button.addEventListener("click", function() { showTab(tabIndex); });
        button.addEventListener("dragover", function(e) { e.preventDefault(); });
        button.addEventListener("drop", function(e) {
            e.preventDefault();
            if(e.dataTransfer.getData("friendId")) {
                addFiendToGroup(tabIndex, e.dataTransfer.getData("friendId")); // Принесли сюда друга
            }
            if(e.dataTransfer.getData("tabIndex")) {
                swapGroups(tabIndex, parseInt(e.dataTransfer.getData("tabIndex"))); // Принесли сюда другую закладку
            }
        });
        button.addEventListener("dragstart", function(e) { e.dataTransfer.setData("tabIndex", tabIndex); });
    });
    const button = addElement("button", { class: "tablink", innerHTML: "+", title: isEn ? "Add group" : "Добавить группу" }, buttonsContainer);
    button.addEventListener("click", function() {
        const newTabNameInput = document.getElementById("newTabNameInput");
        newTabNameInput.style.display = (newTabNameInput.style.display == "" ? "none" : "");
        newTabNameInput.focus();
    });
    const newTabNameInput = addElement("input", { id: "newTabNameInput", type: "text", style: "display: none;" }, button);
    newTabNameInput.addEventListener("change", function() { addFriendsGroup(this.value); });
    newTabNameInput.addEventListener("click", function(e) { e.stopPropagation(); });
    
    const friendsGroupContainer = addElement("div", { id: `friendsGroupContainer`, class: "tabcontent" }, friendsGroupsContainer);
    friendsGroupContainer.addEventListener("dragover", function(e) { e.preventDefault(); });
    friendsGroupContainer.addEventListener("drop", function(e) { e.preventDefault(); addFiendToGroup(undefined, e.dataTransfer.getData("friendId")); });
    
    const basketDiv = addElement("div", { style: "position: absolute; right: 0; bottom: 0;" }, friendsGroupsContainer);
    const basket = addElement("img", { src: "https://dcdn.heroeswm.ru/i/artifacts/other/treasure.png", title: "Корзина", style: "width: 50px; height: 50px;" }, basketDiv);
    basket.addEventListener("dragover", function(e) { e.preventDefault(); });
    basket.addEventListener("drop", function(e) { e.preventDefault(); e.stopPropagation(); deleteFriendsGroup(e.dataTransfer.getData("tabIndex"), e.dataTransfer.getData("friendId")); });
    
    showTab();
}
function swapGroups(tabIndex, newTabIndex) {
    const tabNames = JSON.parse(getPlayerValue("FriendsGroups"));
    [tabNames[tabIndex], tabNames[newTabIndex]] = [tabNames[newTabIndex], tabNames[tabIndex]];
    setPlayerValue("FriendsGroups", JSON.stringify(tabNames));
    const group1 = getPlayerValue(`FriendsGroup${tabIndex}`, "[]");
    const group2 = getPlayerValue(`FriendsGroup${newTabIndex}`, "[]");
    setPlayerValue(`FriendsGroup${tabIndex}`, group2);
    setPlayerValue(`FriendsGroup${newTabIndex}`, group1);
    setPlayerValue("CurrentFriendsTab", tabIndex);
    drawFriendsTabs();
}
function showTab(tabIndex = parseInt(getPlayerValue("CurrentFriendsTab", 0))) {
    setPlayerValue("CurrentFriendsTab", tabIndex);
    const friendsGroupContainer = document.getElementById("friendsGroupContainer");
    Array.from(friendsGroupContainer.querySelectorAll("div[name=friendRefContainer]")).forEach(x => x.remove());

    Array.from(document.getElementsByClassName("tablink")).forEach(x => x.style.backgroundColor = "");

    const color = `hsl(${Math.random() * 360}, 100%, 75%)`;
    document.querySelector("div#friendsGroupsContainer").style.backgroundColor = color;
    document.querySelector(`#showFriendsTabButton${tabIndex}`).style.backgroundColor = color;

    const group = JSON.parse(getPlayerValue(`FriendsGroup${tabIndex}`, "[]"));
    removeArrayEmptyEntries(group);
    //console.log(group);
    setPlayerValue(`FriendsGroup${tabIndex}`, JSON.stringify(group));
    const friendNotes = JSON.parse(getPlayerValue("friendNotes", "{}"));
    for(const groupItem of group) {
        const mainRef = document.querySelector(`a[href='pl_info.php?id=${groupItem}']`);
        if(mainRef) {
            //console.log((mainRef.querySelector("b") || mainRef).innerText);
            const refDiv = addElement("div", { name: "friendRefContainer" }, friendsGroupContainer);
            const a = addElement("a", { href: `pl_info.php?id=${groupItem}` }, refDiv);
            addElement("b", {innerHTML: (mainRef.querySelector("b") || mainRef).innerText}, a);
            a.addEventListener("dragstart", function(e) { e.dataTransfer.setData("tabIndex", tabIndex); e.dataTransfer.setData("friendId", groupItem); });
            const notesInput = addElement("input", { type: "text", value: friendNotes[groupItem] || "", title: isEn ? "Notes" : "Заметки", style: `display: inline-block; width: ${isNewPersonPage ? 200 : 400}px;` }, refDiv);
            notesInput.addEventListener("change", function() { savePlayerNote(groupItem, this.value); });
        }
    }
}
function savePlayerNote(playerId, note) {
    const friendNotes = JSON.parse(getPlayerValue("friendNotes", "{}"));
    friendNotes[playerId] = note;
    setPlayerValue("friendNotes", JSON.stringify(friendNotes));
}
function addFiendToGroup(tabIndex, friendId) {
    tabIndex = tabIndex || parseInt(getPlayerValue("CurrentFriendsTab", 0));
    friendId = parseInt(friendId);
    const group = JSON.parse(getPlayerValue(`FriendsGroup${tabIndex}`, "[]"));
    if(!group.includes(friendId)) {
        group.push(friendId);
        setPlayerValue(`FriendsGroup${tabIndex}`, JSON.stringify(group));
        drawFriendsTabs();
    }
}
function addFriendsGroup(name) {
    const tabNames = JSON.parse(getPlayerValue("FriendsGroups"));
    if(name && !tabNames.includes(name)) {
        tabNames.push(name);
        setPlayerValue("FriendsGroups", JSON.stringify(tabNames));
        drawFriendsTabs();
    }
}
function deleteFriendsGroup(tabIndex, friendId) {
    tabIndex = parseInt(tabIndex);
    friendId = parseInt(friendId);
    console.log(`tabIndex: ${tabIndex}, friendId: ${friendId}`);
    if(friendId) {
        const group = JSON.parse(getPlayerValue(`FriendsGroup${tabIndex}`, "[]"));
        removeArrayValue(group, friendId);
        console.log(group)
        setPlayerValue(`FriendsGroup${tabIndex}`, JSON.stringify(group));
    } else {
        const tabNames = JSON.parse(getPlayerValue("FriendsGroups"));
        for(let i = tabIndex; i < tabNames.length - 1; i++) {
            setPlayerValue(`FriendsGroup${i}`, getPlayerValue(`FriendsGroup${i + 1}`, "[]"));
        }
        deletePlayerValue(`FriendsGroup${tabNames.length - 1}`);
        tabNames.splice(tabIndex, 1);
        setPlayerValue("FriendsGroups", JSON.stringify(tabNames));
        setPlayerValue("CurrentFriendsTab", 0);
    }
    drawFriendsTabs();
}
// API
function addElement(type, data = {}, parent = undefined, insertPosition = "beforeend") {
    const el = document.createElement(type);
    for(const key in data) {
        if(key == "innerText" || key == "innerHTML") {
            el[key] = data[key];
        } else {
            el.setAttribute(key, data[key]);
        }
    }
    if(parent) {
        if(parent.insertAdjacentElement) {
            parent.insertAdjacentElement(insertPosition, el);
        } else if(parent.parentNode) {
            switch(insertPosition) {
                case "beforebegin":
                    parent.parentNode.insertBefore(el, parent);
                    break;
                case "afterend":
                    parent.parentNode.insertBefore(el, parent.nextSibling);
                    break;
            }
        }
    }
    return el;
}
function addStyle(css) { addElement("style", { type: "text/css", innerHTML: css }, document.head); }
function getParent(element, parentType, number = 1) {
    if(!element) {
        return;
    }
    let result = element;
    let foundNumber = 0;
    while(result = result.parentNode) {
        if(result.nodeName.toLowerCase() == parentType.toLowerCase()) {
            foundNumber++;
            if(foundNumber == number) {
                return result;
            }
        }
    }
}
function getValue(key, defaultValue) { return localStorage[key] || defaultValue; };
function setValue(key, value) { localStorage[key] = value; };
function deleteValue(key) { return delete localStorage[key]; };
function listValues() { return Object.keys(localStorage); }
function getPlayerValue(key, defaultValue) { return localStorage[`${key}${PlayerId}`] || defaultValue; };
function setPlayerValue(key, value) { localStorage[`${key}${PlayerId}`] = value; };
function deletePlayerValue(key) { return delete localStorage[`${key}${PlayerId}`]; };
function getPlayerBool(valueName, defaultValue = false) { return getBool(valueName + PlayerId, defaultValue); }
function getBool(valueName, defaultValue = false) {
    const value = getValue(valueName);
    if(value != undefined) {
        if(typeof(value) == "string") {
            return value == "true";
        }
        if(typeof(value) == "boolean") {
            return value;
        }
    }
    return defaultValue;
}
function getRequest(url, overrideMimeType = "text/html; charset=windows-1251") {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "GET", url: url, overrideMimeType: overrideMimeType,
            onload: function(response) { resolve((new DOMParser).parseFromString(response.responseText, "text/html")); },
            onerror: function(error) { reject(error); }
        });
    });
}
function getUrlParamValue(url, paramName) { return (new URLSearchParams(url.split("?")[1])).get(paramName); }
function removeArrayValue(array, value) {
    const index = array.indexOf(value);
    if(index > -1) {
        array.splice(index, 1);
    }
}
function removeArrayEmptyEntries(array) {
    let found = true;
    while(found) {
        const index = array.findIndex(x => !x);
        if(index > -1) {
            array.splice(index, 1);
        } else {
            found = false;
        }
    }
}
// ==UserScript==
// @name         Bouzouks.net ShopsRP
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  Allow to change item names and images in shops
// @author       ElDonad
// @match        https://www.bouzouks.net/magasins/*
// @match        https://www.bouzouks.net/maison*
// @match        https://www.bouzouks.net/marche_noir*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/408180/Bouzouksnet%20ShopsRP.user.js
// @updateURL https://update.greasyfork.org/scripts/408180/Bouzouksnet%20ShopsRP.meta.js
// ==/UserScript==

function getItemName(item){
    let name = item.getElementsByClassName("titre")[0];
    return name.innerText;
}

function resetStoredItem(itemName){
    GM_deleteValue(itemName)
}

function getStoredItem(itemName){
    let stored = GM_getValue(itemName);
    if(stored == undefined) return undefined;
    return JSON.parse(stored);
}
function setStoredItem(itemName, newName){
   GM_setValue(itemName, JSON.stringify(newName));
}

var RPItems = {};

function saveItems(){
    for(var key in RPItems){
        setStoredItem(key, RPItems[key]);
    }
}

function updateItem(item, storedData){
    saveItems();
    item.getElementsByClassName("titre")[0].innerText = storedData.name;
    item.getElementsByClassName("titre")[0].style.height = "auto";
    item.getElementsByClassName("titre")[0].style.backgroundColor = "#fefaef";
    if(storedData.image != ""){
        console.log("set image source to : ");
        console.log(storedData.image);
        item.getElementsByClassName("image")[0].getElementsByTagName("img")[0].setAttribute("src", storedData.image);
    }
}

function showDialogBox(item, storedData){
    let element = document.createElement("div");
    element.classList.add("RPConfigBox");
    let title = element.appendChild(document.createElement("h2"));
    title.innerText = "Configuration : " + storedData.oldName;

    element.style.top = (item.offsetTop + 300) + "px";

    let titleLabel = element.appendChild(document.createElement("label"));
    titleLabel.innerText = "Nouveau nom : ";
    let titleInput = element.appendChild(document.createElement("input"));
    titleInput.value = storedData.name;
    titleInput.setAttribute("type", "text");

    let imgLabel = element.appendChild(document.createElement("label"));
    imgLabel.innerText = "Nouvelle image : ";
    let imgInput = element.appendChild(document.createElement("input"));
    imgInput.setAttribute("type", "text");
    imgInput.value = storedData.image;

    let okButton = element.appendChild(document.createElement("button"));
    okButton.innerText = "Valider";

    let resetButton = element.appendChild(document.createElement("button"));
    resetButton.innerText = "Reset";

    okButton.onclick = () => {
        storedData.name = titleInput.value;
        storedData.image = imgInput.value;
        updateItem(item, storedData);
        document.body.removeChild(element);
    }

    resetButton.onclick = () => {
        storedData.name = storedData.oldName;
        storedData.image = "";
        updateItem(item, storedData);
        document.body.removeChild(element);
        window.location.reload(false);
    }

    document.body.appendChild(element);
}

function setCSS(){
    GM_addStyle(".RPConfigBox{position:absolute;top:200px;left:50px;background-color:lightblue;border: solid 5px black;z-index: 1000;}");
}

(function() {
    'use strict';
    setCSS();
    if(window.location.pathname.includes("magasins")){

        //Ajouter un évènement lors de l'appui sur l'image
        Array.prototype.forEach.call(document.getElementsByClassName("objet"), item => {
            let storedData = getStoredItem(getItemName(item));
            if(storedData == undefined){
                storedData = {name: getItemName(item), image: "", oldName: getItemName(item)};
            }
            RPItems[getItemName(item)] = storedData;
            let image = item.getElementsByClassName("image")[0];
            image.onclick = () => {
                showDialogBox(item, storedData)
            };
            updateItem(item, storedData);
        });
    }
    else if (window.location.pathname.includes("maison")){
        Array.prototype.forEach.call(document.getElementsByClassName("objet"), item => {
            let fullItemName = item.getElementsByTagName("h4")[0].innerText.split(" ");
            let itemName = fullItemName.splice(1).join(" ");
            let data = getStoredItem(itemName);
            if(data == undefined){
                return;
            }
            item.getElementsByTagName("h4")[0].innerText = fullItemName[0] + " " + data.name;
            if(data.image != ""){
                item.getElementsByTagName("img")[0].setAttribute("src", data.image);
            }
        });
    }
    else if(window.location.pathname == "/marche_noir"){
        Array.prototype.forEach.call(document.getElementsByClassName("objet_pub"), item => {
            let fullItemName = item.getElementsByClassName("nom_objet")[0].innerText.split(" ");
            let itemName = fullItemName.splice(1).join(" ");
            console.log(itemName);
            let data = getStoredItem(itemName);
            if(data == undefined){
                return;
            }
            item.getElementsByClassName("nom_objet")[0].innerText = fullItemName[0] + " " + data.name;
            if(data.image != ""){
                item.getElementsByClassName("image")[0].getElementsByTagName("img")[0].setAttribute("src", data.image);
            }
        });

        Array.prototype.forEach.call(document.getElementsByClassName("objet"), item => {
            let itemNameEl = item.getElementsByClassName("titre")[0].getElementsByTagName("b")[0];
            let itemName = itemNameEl.innerText;
            let data = getStoredItem(itemName);
            if(data == undefined){
                return;
            }
            itemNameEl.innerText = data.name;
            if(data.image != ""){
                item.getElementsByClassName("image")[0].getElementsByTagName("img")[0].setAttribute("src", data.image);
            }
        });
        }
    else if(window.location.pathname.includes("marche_noir/acheter")){
        let infosProduit = document.getElementsByClassName("infos_produit")[0];
        let infosProduitContent = infosProduit.innerHTML.split("<br>");
        let itemName = infosProduitContent[1].substring(0, infosProduitContent[1].length - 1);
        let data = getStoredItem(itemName);
        if(data == undefined){return;}
        infosProduitContent[1] = data.name + ", ";
        infosProduit.innerHTML = infosProduitContent.join("<br>");
        if(data.image != ""){
            document.getElementsByClassName("image")[0].children[0].setAttribute("src", data.image);
        }
    }
})();
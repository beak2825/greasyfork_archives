// ==UserScript==
// @name         DontShowMyID
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Hide your id with provided text in web page, anywhere.
// @author       ChatGPT & Bard & Me
// @match        ://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465242/DontShowMyID.user.js
// @updateURL https://update.greasyfork.org/scripts/465242/DontShowMyID.meta.js
// ==/UserScript==

(function () {
        'use strict';
        const GMKEY_BLOCKED_TEXT = "dtmi_blocked_text"
        const ID_POPUP_MENU = 'dont-id-popup'
        // ------ utility ------
        // Bard code here...
        function getAllLeafNodes(node) {
            let nodes = [];
            // ignore popup menu
            if(node.id === ID_POPUP_MENU){
                return nodes
            }
            // select all text
            if (node.nodeType === Node.TEXT_NODE) {
                nodes.push(node);
            }
            for (let i = 0; i < node.childNodes.length; i++) {
                nodes = nodes.concat(getAllLeafNodes(node.childNodes[i]));
            }
            return nodes;
        }

        // https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
        function toBinary(string) {
            const codeUnits = new Uint16Array(string.length);
            for (let i = 0; i < codeUnits.length; i++) {
                codeUnits[i] = string.charCodeAt(i);
            }
            return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
        }
        function fromBinary(encoded) {
            const binary = atob(encoded);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < bytes.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            return String.fromCharCode(...new Uint16Array(bytes.buffer));
        }


        class BlockItem {
            constructor(from, to) {
                this.fromText = from
                this.toText = to
            }
        }

        // ------ pop-up menu ------
        // ChatGPT code here...
        class PopupMenu {
            constructor() {
                this.blockedTexts = GM_getValue(GMKEY_BLOCKED_TEXT) || '[]'
                this.blockedTexts = JSON.parse(this.blockedTexts)

                this.isRawText = false

                const menu = document.querySelector(`#${ID_POPUP_MENU}`)
                if(menu){
                    menu.remove()
                }
                // popup menu
                this.popupElement = document.createElement('div');
                this.popupElement.id = ID_POPUP_MENU
                this.popupElement.style.display = 'none';
                this.popupElement.style.position = 'absolute';
                this.popupElement.style.top = '50%';
                this.popupElement.style.left = '50%';
                this.popupElement.style.transform = 'translate(-50%, -50%)';
                this.popupElement.style.width = '300px';
                this.popupElement.style.height = '300px';
                this.popupElement.style.backgroundColor = 'white';
                this.popupElement.style.border = '1px solid black';
                this.popupElement.style.padding = '20px';
                this.popupElement.style.zIndex = '9999';

                // create list element
                this.listElement = document.createElement('ul');
                this.listElement.style.listStyleType = 'none';
                this.popupElement.appendChild(this.listElement);

                // create button element
                this.addButton = document.createElement('button');
                this.addButton.textContent = 'Add item';
                this.addButton.onclick = () => {
                    this.addItem()
                }
                this.popupElement.appendChild(this.addButton);

                // create button element
                this.closeButton = document.createElement('button');
                this.closeButton.textContent = 'Close';
                this.closeButton.style.marginLeft = '10px';
                this.closeButton.onclick = () => {
                    this.hide()
                }
                this.popupElement.appendChild(this.closeButton);

                // create button element
                this.showButton = document.createElement('button');
                this.showButton.textContent = 'Show raw text';
                this.showButton.style.marginLeft = '10px';
                this.showButton.onclick = () => {
                    this.isRawText = !this.isRawText
                    this.refreshList()
                }
                this.popupElement.appendChild(this.showButton);

                // add popup menu to the page
                document.body.appendChild(this.popupElement);
            }

            refreshList(){
                // remove old list items
                while(this.listElement.childNodes.length > 0){
                    this.listElement.childNodes[0].remove()
                }
                // get the newest
                this.blockedTexts = GM_getValue(GMKEY_BLOCKED_TEXT) || '[]'
                this.blockedTexts = JSON.parse(this.blockedTexts)
                // show list column name
                this.showItem("Before", "After", 1)
                // show list items
                for(let i = 0 ; i < this.blockedTexts.length ; i++){
                    let item = this.blockedTexts[i]
                    let itemKey = item.fromText
                    let itemVal = item.toText
                    if(this.isRawText){
                        itemKey = fromBinary(item.fromText)
                        itemVal = fromBinary(item.toText)
                        this.showItem(itemKey, itemVal, 0)
                    }else{
                        this.showItem(itemKey, itemVal, 2)
                    }
                }
            }

            // show popup
            show() {
                this.refreshList()
                this.popupElement.style.display = 'block';
            }

            // hide popup
            hide() {
                this.popupElement.style.display = 'none';
            }

            // show item
            /*
            * switch(type)
            *   0 -> common item with raw text
            *   1 -> column name
            *   2 -> common item
            * */
            showItem(key, value, type) {
                // value
                const listItemKey = document.createElement('div')
                listItemKey.textContent = key
                listItemKey.style.gridColumn = '1'
                listItemKey.style.overflow = 'hidden'
                listItemKey.style.textOverflow = 'ellipsis'
                const listItemVal = document.createElement('div')
                listItemVal.textContent = value
                listItemVal.style.gridColumn = '2'
                listItemVal.style.overflow = 'hidden'
                listItemVal.style.textOverflow = 'ellipsis'
                // delete button
                const listItemButtonDel = document.createElement('button')
                listItemButtonDel.textContent = "Delete"
                listItemButtonDel.style.gridColumn = '3'
                listItemButtonDel.onclick = (evt) => {
                    for(let i = 0 ; i < this.blockedTexts.length ; i++){
                        let cond = false
                        cond |= type === 0 && this.blockedTexts[i].fromText === toBinary(key)
                        cond |= type === 2 && this.blockedTexts[i].fromText === key
                        if(cond){
                            // remove
                            this.blockedTexts.splice(i, 1)
                            // remove from GM
                            GM_setValue(GMKEY_BLOCKED_TEXT, JSON.stringify(this.blockedTexts))
                            // refresh list
                            this.refreshList()
                            break;
                        }
                    }
                }

                const listItem = document.createElement('li');
                // Set the display property to grid
                listItem.style.display = 'grid';
                // Set grid columns
                listItem.append(listItemKey)
                listItem.append(listItemVal)
                if(type === 0 || type === 2){
                    listItem.append(listItemButtonDel)
                }else if(type === 1){
                    listItemKey.style.fontWeight = 'bold'
                    listItemVal.style.fontWeight = 'bold'
                }
                listItem.style.gridTemplateColumns = '4fr 4fr 2fr';

                this.listElement.appendChild(listItem);
            }

            // add item
            addItem() {
                let listItemKey = prompt("Input the string you want to hide: ")
                if(!listItemKey){
                    alert("Cancelled.")
                    return
                }
                let listItemVal = prompt(`You want to replace "${listItemKey}" with: `)
                if(!listItemVal){
                    alert("Cancelled.")
                    return
                }
                const ok = confirm(`OK to replace "${listItemKey}" with "${listItemVal}"?`)
                if(!ok){
                    return
                }
                listItemKey = toBinary(listItemKey)
                listItemVal = toBinary(listItemVal)
                // i'm lazy so no hash map
                // if the key exists
                let flag = false
                for(let i = 0 ; i < this.blockedTexts.length ; i++){
                    if(this.blockedTexts[i].fromText === listItemKey){
                        this.blockedTexts[i].toText = listItemVal
                        flag = true
                        alert(`Updated. Refresh to see the effect.`)
                    }
                }
                // if not
                if(!flag){
                    this.blockedTexts.push(new BlockItem(listItemKey, listItemVal))
                    alert(`Added. Refresh to see the effect.`)
                }
                GM_setValue(GMKEY_BLOCKED_TEXT, JSON.stringify(this.blockedTexts))
                this.refreshList()
            }
        }

        GM_registerMenuCommand('Settings', function() {
            let popup = new PopupMenu()
            popup.show()
        });

        // ------ executor ------
        // Human code here... written with love...
        let blockedTexts = GM_getValue(GMKEY_BLOCKED_TEXT) || "[]"
        blockedTexts = JSON.parse(blockedTexts)

        let intId; // yet never clear
        //
        for (let i = 0; i < blockedTexts.length; i++) {
            blockedTexts[i].fromText = fromBinary(blockedTexts[i].fromText)
            blockedTexts[i].toText = fromBinary(blockedTexts[i].toText)
        }
        // loop clear text
        let mainFunc = () => {
            const nodes = getAllLeafNodes(document.documentElement)
            for (let i = 0; i < nodes.length; i++) {
                for (let j = 0; j < blockedTexts.length; j++) {
                    const r1c = nodes[i].textContent
                    const r2 = blockedTexts[j]
                    if (r1c.includes(r2.fromText)) {
                        nodes[i].textContent = r1c.replace(r2.fromText, r2.toText)
                    }
                }
            }
        }
        intId = setInterval(mainFunc, 100)
    }

)
();
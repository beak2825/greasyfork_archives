// ==UserScript==
// @name         itab助手
// @namespace    http://go.itab.link/
// @version      0.0.1
// @description  itab助手，备忘录搜索
// @author       ethan
// @match        *://go.itab.link/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itab.link
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502776/itab%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/502776/itab%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

async function getDB(dbName="localforage"){
    return new Promise((resolve, reject) => {
        const openRequest = indexedDB.open(dbName, 2);
        openRequest.onsuccess = function(e) {
            console.log("Database opened successfully");
            resolve(e.target.result);
        };

        openRequest.onerror = function(e) {
            console.error("Database error: " + e.target.errorCode);
            reject(e.target.errorCode);
        };
    })
}

async function getDataFromIndexDB(dbName="localforage", storeName="keyvaluepairs", key="notes"){
    if(!this[dbName]) {
        this[dbName] = await getDB();
    }
    let db = this[dbName];
    return new Promise((resolve, reject) => {
        // 获取数据
        const transaction = db.transaction([storeName]);
        const store = transaction.objectStore(storeName);
        const request = store.get(key);
        request.onsuccess = function(e) {
            //console.log("Data retrieved: ", e.target.result);
            resolve(e.target.result);
        };
        request.onerror = function(e) {
            console.error("Error retrieving data: " + e.target.errorCode);
            reject(e.target.errorCode);
        };
    })
}
async function searchNotes(q){
    try {
        const notes = await getDataFromIndexDB("localforage", "keyvaluepairs", "notes");
        const result = notes.filter(note => note.content.includes(q));
        console.log(`search[${q}] result len[${result.length}]`);

        const lis = document.querySelector(".notes-tabs-body").children;
        if(!lis) return;
        for (let index = 0; index < lis.length; index++) {
            const child = lis[index];
            child.style.display = "none";
            for (let index = 0; index < result.length; index++) {
                const note = result[index];
                if(child.innerText.includes(note.title)){
                    child.style.display = "block";
                    break;
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
}
function addSearchInput(){
    const searchContainer = document.querySelector(".notes-tabs > h2");
    if(!searchContainer) return;
    if(searchContainer.querySelector("#notes-search")) return;
    const input = document.createElement("input");
    input.id = "notes-search"
    input.type = "text";
    input.placeholder = "搜索笔记";
    let timer;
    input.oninput = (e)=>{
        clearTimeout(timer);
        timer = setTimeout(()=>{
            searchNotes(e.target.value);
        }, 500);
    }
    searchContainer.innerHTML="";
    searchContainer.appendChild(input);
}

function addObserver(){
    const observerDialog = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // d-dialog-model style changed
            if (mutation.type === 'attributes') {
                console.log(`The ${mutation.attributeName} attribute was modified.`);
                addSearchInput();
            }
        });
    });

    new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // 检查添加的节点中是否有d-dialog-model
            mutation.addedNodes.forEach(node => {
                if(node.className && node.className.includes("d-dialog-model")){
                    console.log("d-dialog-model added");
                    setTimeout(()=>{
                        addSearchInput();
                    }, 1000);
                    observerDialog.observe(node, {
                        attributes: true, // 监控属性的变化
                        attributeFilter: ['style'] // 监控style属性的变化
                    });
                }
            });
        });
    }).observe(document.querySelector('body'), {
        childList: true // 监控子节点的变化
    });
}


(function() {
    'use strict';
    addObserver();
})();
// ==UserScript==
// @name         F-List log saver
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A simple script to add buttons on login that let you save and load logs into your browser storage.
// @author       DD
// @match        https://www.f-list.net/chat3/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422863/F-List%20log%20saver.user.js
// @updateURL https://update.greasyfork.org/scripts/422863/F-List%20log%20saver.meta.js
// ==/UserScript==


(function() {
    const userscript = document.createElement("script");
    userscript.innerHTML = `
const saveLogs=() => {
    //////////////////////////////////////////////////////////////////////////
    // Parse Local Storage
    //////////////////////////////////////////////////////////////////////////
    const keyList = Object.keys(window.localStorage);
    let storageContent = [];
    let completeJSON = {saved_dbs: {}};

    for(let key of keyList){
        storageContent.push(JSON.parse('{ "key":"' + key + '", "value":"" }'))
    }

    for(let key of storageContent){
        key.value = JSON.parse(window.localStorage.getItem(key.key));
    }

    completeJSON.saved_dbs.local_storage = storageContent;

    //////////////////////////////////////////////////////////////////////////
    // Parse IndexedDB
    //////////////////////////////////////////////////////////////////////////
    storageContent = {};
    let databaseLoopIndex = 0;
    indexedDB.databases().then(databaseList =>{
        for(let database of databaseList){
            const dataBaseLoop=(db, index)=>{
                let dbConnection;
                let request = window.indexedDB.open(db.name, db.version);
                request.onerror=(event) =>{
                    console.log('Error on connect to "'+db.name+'" : ' + event.target.errorCode);
                };
                request.onsuccess=(event) =>{
                    dbConnection = event.target.result;
                    console.log('Connection to "'+db.name+'" established!');
                    let databaseObject = {};

                    let storeIndex = 0;
                    for(let storeName of dbConnection.objectStoreNames){

                        const objectStoreLoop=(pStoreName, pStoreIndex, databaseIndex)=>{
                            databaseObject[pStoreName] = [];
                            let transaction = dbConnection.transaction([pStoreName]);

                            transaction.oncomplete=(event) =>{
                                console.log('Transaction finished on "' + pStoreName);
                                if(pStoreIndex === dbConnection.objectStoreNames.length - 1 &&
                                    databaseIndex === databaseList.length - 1){

                                    function downloadObjectAsJson(exportObj, exportName){
                                        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
                                        var downloadAnchorNode = document.createElement('a');
                                        downloadAnchorNode.setAttribute("href", dataStr);
                                        downloadAnchorNode.setAttribute("download", exportName + ".json");
                                        document.body.appendChild(downloadAnchorNode); // required for firefox
                                        downloadAnchorNode.click();
                                        downloadAnchorNode.remove();
                                        console.log("Saved successfully!")
                                    }
                                    console.log(completeJSON);
                                    downloadObjectAsJson(completeJSON, "f-list-log");
                                }
                            };

                            transaction.onerror=(event)=>{
                                console.log('Transaction-Error: ' + event.target.errorCode);
                            };

                            transaction.objectStore(pStoreName).getAll().onsuccess=(event) =>{
                                databaseObject[pStoreName] = event.target.result;
                            }
                        }

                        objectStoreLoop(storeName, storeIndex, index);
                        storeIndex++;
                    };
                    storageContent[db.name] = databaseObject;
                };
            }
            dataBaseLoop(database, databaseLoopIndex);
            databaseLoopIndex++;
        }
    });
    completeJSON.saved_dbs.indexed_db = storageContent;
}

const loadLogs=(e)=>{
    const file = e.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const contents = e.target.result;
        const totalJSONObject = JSON.parse(contents);
        console.log(totalJSONObject);

        //////////////////////////////////////////////////////////////////////////
        // load Local Storage
        //////////////////////////////////////////////////////////////////////////
        for(let entry of totalJSONObject.saved_dbs.local_storage){
            window.localStorage.setItem(entry.key, JSON.stringify(entry.value));
        }
        //////////////////////////////////////////////////////////////////////////
        // load IndexedDB
        //////////////////////////////////////////////////////////////////////////
        let databaseLoopIndex = 0;
        const databaseList = Object.keys(totalJSONObject.saved_dbs.indexed_db);
        // Need to parse the datestrigns properly into dates
        for(let databaseName of databaseList){
            for(let entry of totalJSONObject.saved_dbs.indexed_db[databaseName].logs){
                entry.time = new Date(entry.time);
            }
        }

        console.log(totalJSONObject);

        for(let database of databaseList){
            const dataBaseLoop=(dbName)=>{
                let request = window.indexedDB.open(dbName, 1);
                request.onerror=(event) =>{
                    console.log('Error on connect to "'+dbName+'" : ' + event.target.errorCode);
                };
                request.onsuccess=(event) =>{
                    const dbConnection = event.target.result;
                    console.log('Connection to "'+dbName+'" established!');

                    let storeIndex = 0;
                    for(let storeName of dbConnection.objectStoreNames){

                        const objectStoreLoop=(pStoreName)=>{
                            const transaction = dbConnection.transaction(pStoreName, "readwrite");

                            transaction.oncomplete=(event) =>{
                                console.log('Transaction finished on "' + pStoreName);
                            };

                            transaction.onerror=(event)=>{
                                console.log('Transaction-Error: ' + event.target.errorCode);
                            };

                            // transaction.objectStore(pStoreName).getAll().onsuccess=(event) =>{
                            // }
                            const objectStoreArray = totalJSONObject.saved_dbs.indexed_db[dbName][pStoreName];
                            let objectStore = transaction.objectStore(pStoreName);
                            objectStoreArray.forEach(element => {
                                objectStore.put(element).onsuccess=(event) => {}
                            });

                        }
                        objectStoreLoop(storeName);
                        storeIndex++;
                    };
                };
                request.onupgradeneeded=(event) => {
                    const dbConnection = event.target.result;
                    dbConnection.createObjectStore("conversations", {autoIncrement: true, keyPath: "id"});

                    const objectStore = dbConnection.createObjectStore("logs", {autoIncrement: true, keyPath: "id"});
                    objectStore.createIndex("conversation", "conversation", {unique: false});
                    objectStore.createIndex("conversation-day", ["conversation", "day"], {unique: false});
                }
            }
            dataBaseLoop(database);
            databaseLoopIndex++;
        }
    };
    reader.readAsText(file);
}

//////////////////////////////////////////////////////////////////////////
// Insert buttons
//////////////////////////////////////////////////////////////////////////
let cardHeader = document.getElementsByClassName("card-body")[0].childNodes[2];

// Execute the code only when connected
if(cardHeader){
    // Show the buttons on the page for Saving and Loading
    let btn_load = document.createElement("input");
    let btn_save = document.createElement("button");

    btn_save.setAttribute("class", "btn btn-primary");
    btn_save.innerText = "Save Logs";
    btn_save.setAttribute("onclick", "saveLogs()");
    cardHeader.appendChild(btn_save);

    // btn_load.setAttribute("class", "btn btn-primary");
    btn_load.innerText = "Load Logs";
    btn_load.setAttribute("type", "file");
    btn_load.setAttribute("id", "btn_load");
    cardHeader.appendChild(btn_load);

    document.getElementById('btn_load')
    .addEventListener('change', loadLogs, false);
}
`;
    document.getElementsByTagName("html")[0].appendChild(userscript);
})();


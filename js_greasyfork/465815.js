// ==UserScript==
// @name         DF Storage Recorder
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Download the contents of your DF Storage as a CSV file
// @author       You
// @match        *fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deadfrontier.com
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/465815/DF%20Storage%20Recorder.user.js
// @updateURL https://update.greasyfork.org/scripts/465815/DF%20Storage%20Recorder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let fileData = "Slot #,Name,Type,ExtraData,Category,Quantity\n,,,,,";

    function downloadFile(filename, data) {
        const blob = new Blob([data], {type: 'text/csv;charset=utf-8;'});
        if(window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        }else{
            const elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob,{oneTimeOnly: true});
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }
    }

    function addItemToFile(...args){
        fileData = fileData + "\n" + args.join(",");
    }

    function saveStorageDataToFile(){

        let slotsNumber = unsafeWindow.userVars['DFSTATS_df_storage_slots'];

        for(let i=1;i<=slotsNumber;i++){
            if(unsafeWindow.storageBox["df_store"+i+"_type"] == undefined){
                continue;
            }
            let storageItemFlashName = unsafeWindow.storageBox["df_store"+i+"_type"];
            let storageItemName = globalData[storageItemFlashName.split("_")[0]]["name"];
            let storageItemCode = globalData[storageItemFlashName.split("_")[0]]["code"];
            let storageItemExtraData = storageItemFlashName.split("_")[1];
            let storageItemCategory = globalData[storageItemFlashName.split("_")[0]]["itemcat"];
            let storageItemQuantity = unsafeWindow.storageBox["df_store"+i+"_quantity"];

            addItemToFile(i,storageItemName,storageItemCode,storageItemExtraData,storageItemCategory,storageItemQuantity);
        }

        downloadFile("DFStorageContents.csv",fileData);

    }
    unsafeWindow.saveStorageDataToFile = saveStorageDataToFile;

    function addSaveButton(){
        let inventoryHolder = document.getElementById("inventoryholder");
        let saveButton = document.createElement("button");
        saveButton.textContent = "Save Storage to file";
        saveButton.id = "silverSaveStorageDataToFileButton";
        saveButton.className = "opElem";
        saveButton.style.bottom = "86px";
        saveButton.style.left = "110px";
        saveButton.addEventListener("click",saveStorageDataToFile)
        inventoryHolder.appendChild(saveButton);
    }

    setTimeout(addSaveButton,500);

})();
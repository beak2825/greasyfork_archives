// ==UserScript==
// @name         NBT File Loader for CraftNite
// @namespace    cheatnite69
// @version      1.1
// @description  Parse NBT files (like .schematic files) in the browser
// @author       unknown
// @match        https://craftnite.io/*
// @run-at       document-start
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/523345/NBT%20File%20Loader%20for%20CraftNite.user.js
// @updateURL https://update.greasyfork.org/scripts/523345/NBT%20File%20Loader%20for%20CraftNite.meta.js
// ==/UserScript==


function handleNBTFileUpload(file) {
    const reader = new FileReader();

    reader.onload = function(event) {
        const data = event.target.result;

        try {
            const parsed = NBT.parse(data); 
            console.log(parsed);

            const entities = parsed.Entities || [];
            const blocks = parsed.Blocks || [];
            console.log('Entities:', entities);
            console.log('Blocks:', blocks);
        } catch (error) {
            console.error('Error parsing NBT file:', error);
        }
    };

    reader.onerror = function(error) {
        console.error('Error reading the file:', error);
    };

    reader.readAsArrayBuffer(file);  
}


function createFileUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.schematic';  
    fileInput.style.display = 'none';  

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            handleNBTFileUpload(file);  
        }
    });

    
    const uploadButton = document.createElement('button');
    uploadButton.innerText = 'Upload .schematic File';
    uploadButton.style.fontSize = '20px';        
    uploadButton.style.padding = '10px 20px';    
    uploadButton.style.margin = '10px';          
    uploadButton.style.cursor = 'pointer';         
    uploadButton.style.position = 'fixed';  
    uploadButton.style.top = '10px';  
    uploadButton.style.right = '10px';   Seite
    uploadButton.style.backgroundColor = '#4CAF50'; 
    uploadButton.style.color = 'white';           
    uploadButton.style.border = 'none';         
    uploadButton.style.borderRadius = '5px';     

    uploadButton.addEventListener('click', function() {
        fileInput.click(); 
    });

    document.body.appendChild(uploadButton);  
    document.body.appendChild(fileInput);     
}

const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/nbt-js/dist/nbt.min.js';
script.onload = function() {
    createFileUpload(); 
};
document.head.appendChild(script);
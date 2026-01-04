// ==UserScript==
// @name Copy explorer path of Box folder
// @description Add a button on Box website that can copy explorer path of Box folder.
// @namespace https://github.com/kevinzch/CopyExplorerPathOfBoxFolder
// @version 0.4
// @license MIT
// @author Kevin
// @include https://app.box.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @icon data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant none
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/431941/Copy%20explorer%20path%20of%20Box%20folder.user.js
// @updateURL https://update.greasyfork.org/scripts/431941/Copy%20explorer%20path%20of%20Box%20folder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let itemType = null;

    const TYPE_FOLDER = 0;
    const TYPE_FILE = 1;

    window.addEventListener('load', () => {
        copyExplorerPath();
    })

    function copyExplorerPath() {
        try {
            // Create button and set button style
            let copyBtn = document.createElement('button');

            let searchBox = document.querySelector('.header-search.prevent-item-deselection.HeaderSearch-isNewQuickSearch');

            let itemName = document.querySelector('.item-list-date.item-list-cell');

            // Make basis of url
            const apiUrl = 'app-api/enduserapp/folder/';
            let appHost = Box.prefetchedData['/app-api/enduserapp/current-user'].preview.appHost;

            // Request
            let request = new XMLHttpRequest();

            // Empty Variables which will be reused in click event
            let folderId = '';
            let fullUrl = '';
            let explorerPath = '';
            let jsonObj = null;
            let length = 0;

            // Set button style
            copyBtn.textContent = 'Copy path';
            copyBtn.style.backgroundColor = '#4baf4f';
            copyBtn.style.color = 'white';
            copyBtn.style.borderRadius = '8px';
            copyBtn.style.padding = '0px 20px';

            if ( searchBox != null ){
                itemType = TYPE_FOLDER;
            }
            else if( itemName != null ){
                itemType = TYPE_FILE;
            }
            else{
                ;
            }

            // Add button to document
            if ( itemType == TYPE_FOLDER ){
                searchBox.appendChild(copyBtn);
            }
            else if( itemType == TYPE_FILE ){
                itemName.appendChild(copyBtn);
            }
            else{
                ;
            }

            searchBox = null;
            itemName = null;

            // Add button click listner
            copyBtn.addEventListener('click', function(){

                // Reget folderID and remake full url
                if ( itemType == TYPE_FOLDER ){
                    folderId = document.URL.split('/').pop();
                }
                else{
                    folderId = document.querySelector('.parent-name').href.split('/').pop();
                }

                fullUrl = appHost + apiUrl + folderId;

                // Clear explorer path
                explorerPath = 'Box';

                request.open('GET', fullUrl, false);
                request.send();
                jsonObj = JSON.parse(request.responseText);

                length = jsonObj.folder.path.length;

                for (let i = 0; i < length; i++){
                    // Skip 'All files'
                    if (i == 0){
                        continue;
                    }
                    else{
                        explorerPath += '\\' + jsonObj.folder.path[i].name;
                    }
                }
                navigator.clipboard.writeText(explorerPath);
                alert("下記のパスをコピーしました:\r\n" + explorerPath);
            })

        }
        catch (e) {
            setTimeout(() => {
                copyExplorerPath();
            }, 500);
        }
    };

    if ( itemType == TYPE_FOLDER ){
        waitForKeyElements(".parent-name", copyExplorerPath());
    }
    else{
        ;
    }

})();
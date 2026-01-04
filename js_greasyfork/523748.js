// ==UserScript==
// @name         GTM einbinden (Jede Webseite)
// @namespace    http://tampermonkey.net/
// @version      2025-01-14
// @description  Dieses JavaScript-Skript durchsucht die aktuelle Webseite nach Google Tag Manager (GTM) Skripten, extrahiert und listet die GTM-IDs auf, erlaubt es dem Nutzer, GTM-IDs lokal zu speichern oder zu löschen, und fügt dynamisch eine Benutzeroberfläche hinzu, um diese Aktionen zu erleichtern.
// @author       Vanakh Chea
// @match https://*/*
// @match http://*/*
// @grant        none
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/523748/GTM%20einbinden%20%28Jede%20Webseite%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523748/GTM%20einbinden%20%28Jede%20Webseite%29.meta.js
// ==/UserScript==




(function() {
    'use strict'; // Enforce strict mode for better error handling

    if(localStorage.getItem('tm-gtm-ignore') == "true") {
        return 0;
    }

    // Search for all script elements with 'src' attributes containing "GTM-"
    var gtms = document.querySelectorAll('script[src*="GTM-"]');
    var found_gtms = []; // Array to store found GTM IDs
    var msg_color = "red";

    // Iterate over each found script element
    gtms.forEach(function(el) {
        console.log(el.src); // Log the URL of the script to the console

        // Create a URL object from the script src
        const url = el.src;
        // Create a URL object
        const urlObj = new URL(url);

        // Use URLSearchParams to extract query string parameters
        const params = new URLSearchParams(urlObj.search);

        // Store the value of the 'id' parameter in the array
        const found_gtm_id = params.get('id');
        found_gtms.push(found_gtm_id + ' <button class="addGTM" title="ID speichern" style="color: black; background-color: white; height: 30px; padding: 0px;"  data-value="'+found_gtm_id+'"> 💾 </button><br>'); // Add id to the found GTMs array
    });

    if(found_gtms.length == 0) {
        found_gtms = "(kein GTM im Quellcode gefunden)";
    } else {
        found_gtms = found_gtms.join(" , "); // Join found GTM IDs into a string
    }

    // Retrieve a GTM id from local storage or set a default message
    var gtm_id = localStorage.getItem("tm-gtm-id");
    if(gtm_id == undefined){
        gtm_id = "(nicht festgelegt)";
    }

    // Element where the HTML message will be injected
    var theParent = document.querySelector("body");
    if(document.querySelector("footer")){ // Prefer footer if available
        theParent = document.querySelector("footer");
    }
    /*
    // Prefer header if available (commented out in the original code)
    if(document.querySelector("header")){
        theParent = document.querySelector("header");
    }
    */

    // Create a div element for the message
    var theKid = document.createElement("div");
    theKid.style.textAlign = 'center'; // Center text
    //theKid.style.border = '4px solid red'; // Red border for emphasis
            // Apply styles to make the div float
            theKid.style.position = 'fixed';
            theKid.style.bottom = '20px';
            //theKid.style.left = '50%';
            theKid.style.right = '20px'
            //theKid.style.transform = 'translateX(-50%)';
            theKid.style.width = '1000px';
            theKid.style.height = '200px';
            theKid.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            theKid.style.color = 'white';
            theKid.style.display = 'flex';
            theKid.style.alignItems = 'center';
            theKid.style.justifyContent = 'center';
            theKid.style.borderRadius = '8px';
            theKid.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            theKid.style.zIndex = '1000';
            theKid.style.cursor = 'move'; // Change cursor to indicate draggable
            theKid.style.cssText += 'font-size: 12pt !important;'; // Set font size with !important

            let isDragging = false;
            let offsetX, offsetY;

            theKid.addEventListener('mousedown', function(e) {
                isDragging = true;
                offsetX = e.clientX - theKid.offsetLeft;
                offsetY = e.clientY - theKid.offsetTop;
                theKid.style.transition = ''; // Remove any transition for smooth dragging
            });

            document.addEventListener('mousemove', function(e) {
                if (isDragging) {
                    theKid.style.left = `${e.clientX - offsetX}px`;
                    theKid.style.top = `${e.clientY - offsetY}px`;
                    theKid.style.transform = ''; // Disable transformation when dragging
                }
            });

            document.addEventListener('mouseup', function() {
                isDragging = false;
                theKid.style.transition = '0.3s'; // Optional: reapply transition
            });

            //document.body.appendChild(theKid);





   if(gtm_id && gtm_id.indexOf("GTM-") == 0){
       msg_color = "green";
       (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                                                     new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
           j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
               'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                           })(window,document,'script','dataLayer',gtm_id);
    } else {
        msg_color = "red";
        gtm_id = "Kein GTM"; // Update gtm_id if not valid
    }



    //theKid.innerHTML = '<div style="padding: 0 10px 0 10px;"><font color="red"> '+gtm_id+' wird über Tampermonkey eingebunden!</font><br><br>     <input type="text" id="inputField" placeholder="GTM-XXXXXX" style="width: 150px;  height: 30px; color: black;" /><button id="storeButton" style="color: black; background-color: white; height: 30px; padding: 0 10px 0 10px;">ID für diese Webseite festlegen</button> <button id="deleteButton" style="color: black; background-color: white;  height: 30px; padding: 0 10px 0 10px;">ID löschen</button> <br></div> <div style="padding: 0 10px 0 10px;">Diese GTM-Container wurden im Quellcode gefunden: <br>' + found_gtms + '<br>Bei Bedarf können diese Container blockiert werden.<br><br></div>' ;
    theKid.innerHTML = `
        <div style="padding: 0 10px;">
            <font color="${msg_color}">${gtm_id} wird über Tampermonkey eingebunden!</font><br><br>
            <input type="text" id="inputField" placeholder="GTM-XXXXXX" style="width: 150px; height: 30px; color: black;" />
            <button id="storeButton" style="color: black; background-color: white; height: 30px; padding: 0 10px;">ID für diese Webseite festlegen</button>
            <button id="deleteButton" style="color: black; background-color: white; height: 30px; padding: 0 10px;">ID löschen</button><br>
            <button id="ignoreButton" style="color: black; background-color: white; height: 30px; padding: 0 10px;">Banner hier temp. nicht mehr zeigen</button><br>
        </div>
        <div style="padding: 0 10px;">
            Diese GTM-Container wurden im Quellcode gefunden:<br>${found_gtms}<br>Bei Bedarf können diese Container blockiert werden.<br><br>
        </div>`;
    //theParent.insertBefore(theKid, theParent.firstChild);
    theParent.appendChild(theKid);

    // Get references to the input field and button
    const tm_inputField = document.getElementById('inputField');
    const storeButton = document.getElementById('storeButton');

    // Add click event to storeButton
    storeButton.addEventListener('click', () => {
        const inputValue = tm_inputField.value; // Get value from input field

        // Store the input value in local storage
        localStorage.setItem('tm-gtm-id', inputValue);

        // Clear input field for UI clarity after storing
        tm_inputField.value = '';

        // Confirm value storage in console
        console.log(`Value "${inputValue}" stored in local storage under "tm-gtm-id"`);
        window.location.reload();
    });

    const deleteButton = document.getElementById('deleteButton');

    // Add click event to deleteButton
    deleteButton.addEventListener('click', () => {
        const inputValue = tm_inputField.value; // Get value from input field

        // Store the input value in local storage
        localStorage.removeItem('tm-gtm-id');
        window.location.reload();
    });

    const ignoreButton = document.getElementById('ignoreButton');

    // Add click event to ignoreButton
    ignoreButton.addEventListener('click', () => {

        //
        localStorage.setItem('tm-gtm-ignore', "true");

        window.location.reload();
    });

    // Select all elements with the class 'addGTM'
    const elements = document.querySelectorAll('.addGTM');

    // Iterate over each element
    elements.forEach(element => {
        // Add a click event listener
        element.addEventListener('click', () => {
            // Get the value of the 'data-value' attribute
            const dataValue = element.getAttribute('data-value');

            // Store the value in localStorage under the key 'tm-gtm-id'
            if(dataValue) {  // check if there's a value to store
                localStorage.setItem('tm-gtm-id', dataValue);
                window.location.reload();
            }
        });
    });
})();
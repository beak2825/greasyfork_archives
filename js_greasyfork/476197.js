// ==UserScript==
// @name         PnW Login Reminder
// @namespace    https://politicsandwar.com/
// @version      0.4
// @description  Creates a popup in your browser if you haven't logged in to PnW in the last two days.
// @author       You
// @match        *://*/*
// @grant        GM.setValue
// @grant        GM.getValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=politicsandwar.com
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/476197/PnW%20Login%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/476197/PnW%20Login%20Reminder.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    var lastLogin = await GM.getValue("lastPnwLogin", null)
    var nationID = await GM.getValue("nationID", null)

    if (window.location.href.includes("https://politicsandwar.com/")) {
        // Set last login to now
        lastLogin = new Date().getTime();
        await GM.setValue("lastPnwLogin", lastLogin);

        // This will be borked if multiple nations use the same client
        console.log(nationID)
        if (nationID == null) {
            var sidebars = document.querySelectorAll('#leftcolumn > .sidebar');
            var id = sidebars[1].querySelector('a').href.substring(37)
            await GM.setValue("nationID", id)
            nationID = id
        }
    }
    else {
        // If last login was over 2 days ago
        if (lastLogin == null || lastLogin < new Date().getTime() - 48*60*60*1000) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "POST", "https://api.politicsandwar.com/graphql?api_key=f78b043d0656a0f44405", false );
            var data = `{"query": "{nations(id:${nationID}){data{last_active}}}"}`
            xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xmlHttp.send(data);
            var res = xmlHttp.response;
            // Set last login to whatever the API says. If there is an error, i.e. the nationID was null, set lastLogin to null.
            try {
                lastLogin = new Date(JSON.parse(res).data.nations.data[0].last_active).getTime();
            }
            catch {
                lastLogin = null
            }
            await GM.setValue("lastPnwLogin", lastLogin)
        }

        // If last login after checking api is still over 2 days ago, send popup
        if (lastLogin == null || lastLogin < new Date().getTime() - 48*60*60*1000) {
            makePopUp();
        }
    }
    console.log(lastLogin);
})();


function makePopUp() {
    // Create a div element for the popup
    const popup = document.createElement('div');
    popup.className = 'popup';

    // Create a button container inside the popup
    const buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = 'center'; // Center-align the content

    // Create a button inside the button container
    const button = document.createElement('button');
    button.textContent = 'Go to Politics and War';
    button.addEventListener('click', function() {
        window.open('https://politicsandwar.com', '_blank');
        popup.style.display = 'none';
    });

    // Create a text element with the message
    const message = document.createElement('p');
    message.textContent = "You haven't logged in to Politics and War for a couple of days.";
    message.className = 'message';

    // Append the button to the button container
    buttonContainer.appendChild(button);

    // Append the button container and message to the popup
    popup.appendChild(message);
    popup.appendChild(buttonContainer);

    // Add some CSS styles to style the popup
    popup.style.position = 'fixed';
    popup.style.top = '10px';
    popup.style.right = '10px';
    popup.style.backgroundColor = 'white';
    popup.style.padding = '15px';
    popup.style.border = '2px solid #003d99';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
    popup.style.fontFamily = 'Arial, sans-serif';
    popup.style.borderRadius = '10px';
    popup.style.zIndex = '999999';
    popup.style.cursor = 'move'; // Set cursor style to indicate draggable

    // Style the button
    button.style.backgroundColor = '#003d99';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '10px 20px'; // Increase button size
    button.style.cursor = 'pointer';
    button.style.borderRadius = '5px'; // Round button corners

    // Style the message
    message.style.color = '#333'; // Dark gray text color
    message.style.marginTop = '2px';
    message.style.marginBottom = '14px';

    let isDragging = false;
    let initialX, initialY, offsetX, offsetY;

    // Function to handle mouse down event
    function handleMouseDown(event) {
        isDragging = true;
        initialX = event.clientX;
        initialY = event.clientY;
        offsetX = popup.getBoundingClientRect().left;
        offsetY = popup.getBoundingClientRect().top;
    }

    // Function to handle mouse move event
    function handleMouseMove(event) {
        if (isDragging) {
            const dx = event.clientX - initialX;
            const dy = event.clientY - initialY;
            popup.style.left = offsetX + dx + 'px';
            popup.style.top = offsetY + dy + 'px';
            popup.style.right = null;
        }
    }

    // Function to handle mouse up event
    function handleMouseUp() {
        isDragging = false;
    }

    // Add event listeners for mouse events
    popup.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Append the popup to the body of the page
    document.body.appendChild(popup);
}
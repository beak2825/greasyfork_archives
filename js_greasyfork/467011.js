// ==UserScript==
// @name        anth://squirrel_os
// @description Various scripts created by Tommy Filliater to make Servicedesk more servicey (and squirrely)...
// @namespace   anthology_squirrel_os
// @match     https://support.campusmgmt.com/*
// @version     1.0.3
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467011/anth%3Asquirrel_os.user.js
// @updateURL https://update.greasyfork.org/scripts/467011/anth%3Asquirrel_os.meta.js
// ==/UserScript==

// Create taskbar div and style it
let taskbar = document.createElement('div');
taskbar.style.position = 'fixed';
taskbar.style.top = '0';
taskbar.style.left = '0';
taskbar.style.width = '50px';
taskbar.style.height = '100vh';
taskbar.style.backgroundColor = '#f9f9f9';
taskbar.style.borderRight = '1px solid #ccc';
taskbar.style.padding = '10px';
taskbar.style.zIndex = '1000';
taskbar.style.transition = '0.3s';
taskbar.id = 'taskbar';

// Create div for the task (e.g., Linkify Descriptions)
let taskDiv = document.createElement('div');
taskDiv.id = 'linkifyTask';
taskDiv.style.display = 'block';
taskDiv.style.margin = '10px 0';
taskDiv.style.padding = '5px';
taskDiv.style.cursor = 'pointer';
taskDiv.style.border = '1px solid #ccc';
taskDiv.style.textAlign = 'center';
taskDiv.textContent = '🔗';

// On click, toggle the feature and store the status
taskDiv.onclick = function() {
    let status = localStorage.getItem('linkify');
    if (status === 'enabled') {
        localStorage.setItem('linkify', 'disabled');
        taskDiv.style.backgroundColor = '#ffc0cb'; // Disable
        let textAreas = document.querySelectorAll('textarea[id="u_task.description"], textarea[id="incident.description"]');
        textAreas.forEach((textarea) => {

            textarea.show();
        });
        let existingMods = document.querySelectorAll('.linkifiedDescription');
        existingMods.forEach((existingMod) => {

            existingMod.remove();

        });
    } else {
        localStorage.setItem('linkify', 'enabled');
        taskDiv.style.backgroundColor = 'lightgreen'; // Enable
        addLinkifiedDescription();
    }
};

// Append div to taskbar
taskbar.appendChild(taskDiv);

// Append taskbar to body
document.body.appendChild(taskbar);

// Push page content to the right
document.body.style.marginLeft = '60px';

// Linkify Description function
function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with www.
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    //Replace newline characters with <br>
    replacedText = replacedText.replace(/\n/g, '<br>');

    return replacedText;
}

function addLinkifiedDescription() {
    // Query both task and incident description textareas
    let textAreas = document.querySelectorAll('textarea[id="u_task.description"], textarea[id="incident.description"]');
    if (textAreas) {
        textAreas.forEach((textArea) => {
            let linkifiedHTML = linkify(textArea.value);
            let linkifiedDiv = document.createElement('div');
            linkifiedDiv.innerHTML = linkifiedHTML;
            linkifiedDiv.className = 'linkifiedDescription';
            // Apply some styles to the div
            linkifiedDiv.style.padding = "10px";
            linkifiedDiv.style.marginTop = "10px";
            linkifiedDiv.style.backgroundColor = "#f9f9f9"; // a light grey color
            linkifiedDiv.style.border = "1px solid #ccc"; // a darker grey border
            linkifiedDiv.style.borderRadius = "4px"; // rounded corners

            textArea.parentNode.insertBefore(linkifiedDiv, textArea.nextSibling);
            // Hide the original description by default
            textArea.style.display = 'none';
        });
    }
}


    let status = localStorage.getItem('linkify');
    if (status === 'disabled') {
        localStorage.setItem('linkify', 'disabled');
        taskDiv.style.backgroundColor = '#ffc0cb'; // Disable
        let textAreas = document.querySelectorAll('textarea[id="u_task.description"], textarea[id="incident.description"]');
        textAreas.forEach((textarea) => {

            textarea.show();
        });
        let existingMods = document.querySelectorAll('.linkifiedDescription');
        existingMods.forEach((existingMod) => {

            existingMod.remove();

        });
    } else {
        localStorage.setItem('linkify', 'enabled');
        taskDiv.style.backgroundColor = 'lightgreen'; // Enable
        addLinkifiedDescription();
    }

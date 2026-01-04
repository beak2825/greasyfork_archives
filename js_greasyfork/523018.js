// ==UserScript==
// @license      JazzMedo
// @name         pwn.college Copy to Clipboard and copy SSH key
// @version      1.0.1
// @description  this script will allow you to copy the content from the pwn.collage and scopy the ssh key to connect your terminal to the machine
// @author       JazzMedo
// @match        https://pwn.college/*
// @include      https://pwn.college/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pwn.college
// @grant        none
// @namespace https://greasyfork.org/users/1420266
// @downloadURL https://update.greasyfork.org/scripts/523018/pwncollege%20Copy%20to%20Clipboard%20and%20copy%20SSH%20key.user.js
// @updateURL https://update.greasyfork.org/scripts/523018/pwncollege%20Copy%20to%20Clipboard%20and%20copy%20SSH%20key.meta.js
// ==/UserScript==

(function() {
    'use strict';
// Select all elements with data-sentry-component="AccordionDetails"
const accordionDetailsList = document.querySelectorAll('.embed-responsive');

accordionDetailsList.forEach(detail => {
    // Create the copy button
    const copyButton = document.createElement('button');
    copyButton.innerHTML = `
        <svg width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h9V.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5V2h-1V1h-9v1H3V.5a.5.5 0 0 1 .5-.5zM1 2h14a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 1v11h14V3H1z"/>
        </svg>
    `;
    copyButton.classList.add('copy-button');

    // Inject CSS into the document
    const style = document.createElement('style');
    style.innerHTML = `
.embed-responsive p {
padding-right:28px;
}

.copy-button {
    position: absolute;
    top: 0px;
    right: 0px;
    background-color: #4CAF50;
    border: none;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    transition: all 1.5s;
}

.copy-button:hover {
    background-color: #45a049;
    /* Darker green on hover */
}

.copy-button:active {
    /* Slightly shrink the button on click */
    }
    
    .copy-button:focus {
        border:none;
        /* Slightly shrink the button on click */
        outline:none;
        }
        
        /* Added a class to change the icon */
        .copy-button.copying {
            background-color: #0084ff;
    content: url('data:image/svg+xml;utf8,<svg width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16"><path d="M13.485 1.343a1 1 0 0 1 1.415 1.415l-9 9a1 1 0 0 1-1.415 0l-4-4a1 1 0 0 1 1.415-1.415L5.5 10.086l8.485-8.485z" /></svg>');
}

`;
    document.head.appendChild(style);


    // Add click event to copy text content and change icon
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(detail.textContent.trim());
        copyButton.classList.add('copying');
        copyButton.innerHTML = `
            <svg width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                <path d="M13.485 1.343a1 1 0 0 1 1.415 1.415l-9 9a1 1 0 0 1-1.415 0l-4-4a1 1 0 0 1 1.415-1.415L5.5 10.086l8.485-8.485z" />
            </svg>`;
        setTimeout(() => {
            copyButton.classList.remove('copying');
            copyButton.innerHTML = `
                <svg width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h9V.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5V2h-1V1h-9v1H3V.5a.5.5 0 0 1 .5-.5zM1 2h14a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 1v11h14V3H1z"/>
                </svg>`;
        }, 1500);
    });

    // Append the button to the detail element
    detail.appendChild(copyButton);
});

// Create the SSH copy button
const sshCopyButton = document.createElement('button');
sshCopyButton.innerHTML = 'Copy SSH';
sshCopyButton.classList.add('ssh-copy-button');

// Inject CSS for the SSH button
const sshButtonStyle = document.createElement('style');
sshButtonStyle.innerHTML = `
.ssh-copy-button {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background-color: #007BFF;
    border: none;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    padding: 5px;
    transition: all 0.3s ease-in-out;
    font-size:13px;
}

.ssh-copy-button:hover {
    background-color: #0056b3;
}

.ssh-copy-button:active,.ssh-copy-button:focus {
    outline:none;
}
`;
document.head.appendChild(sshButtonStyle);

// Add click event to copy SSH command
sshCopyButton.addEventListener('click', () => {
    navigator.clipboard.writeText('ssh -i key hacker@pwn.college');
    sshCopyButton.innerHTML = `Copied`;
    sshCopyButton.style.cssText = `background-color: #45a049;`
    setTimeout(() => {
        sshCopyButton.style.cssText = `background-color: #007BFF;`
        sshCopyButton.innerHTML = 'Copy SSH';
    }, 1500);
});

// Append the SSH button to the body
document.body.appendChild(sshCopyButton);


})();
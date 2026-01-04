// ==UserScript==
// @name         Draggable Google Search Tool with Copy Link
// @namespace    http://tampermonkey.net/
// @version      1.27
// @description  Create a stylish, draggable search form with persistent inputs, paste buttons, and a copy dynamic link button for Google search results. The form retains user-given values and is initially positioned on the right side but can be moved anywhere. Includes a copy dynamic link button that copies the first available link from specified classes. Now with smaller text size, larger checkboxes, and aligned buttons.
// @author       Mahmudul Hasan Shawon
// @match        https://www.google.com/search?*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521425/Draggable%20Google%20Search%20Tool%20with%20Copy%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/521425/Draggable%20Google%20Search%20Tool%20with%20Copy%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load Inter font
    const interFontLink = document.createElement('link');
    interFontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap';
    interFontLink.rel = 'stylesheet';
    document.head.appendChild(interFontLink);

    // Default values
    const defaultInput1Value = 'Company Name';
    const defaultInput2Value = 'City,State';
    const defaultInput3Value = 'Headquarter';

    // Retrieve stored values or use default
    const storedInput1Value = localStorage.getItem('input1') || defaultInput1Value;
    const storedInput2Value = localStorage.getItem('input2') || defaultInput2Value;
    const storedInput3Value = localStorage.getItem('input3') || defaultInput3Value;

    // Create a container for the form
    const formContainer = document.createElement('div');
    formContainer.style.position = 'fixed';
    formContainer.style.top = '10px';
    formContainer.style.right = '20px'; // Positioning to the right side
    formContainer.style.padding = '10px';
    formContainer.style.backgroundColor = '#d8d3ff';

    //formContainer.style.backdropFilter = 'blur(10px)';
    //formContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; // Optional for semi-transparent background

    formContainer.style.border = '2px solid #ffff';
    formContainer.style.borderRadius = '16px';
    formContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    formContainer.style.zIndex = '10000';
    formContainer.style.fontFamily = "'Inter', sans-serif";
    formContainer.style.cursor = 'move';
    formContainer.style.maxWidth = '300px'; // Adjusted width for right-side positioning
    formContainer.style.boxSizing = 'border-box';

    // Create the form element
    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '8px'; // Adjusted gap

    // Function to create input field with paste button and optional checkbox
    const createInputFieldWithExtras = (id, value, includeCheckbox = false) => {
        const inputWrapper = document.createElement('div');
        inputWrapper.style.position = 'relative';
        inputWrapper.style.display = 'flex';
        inputWrapper.style.alignItems = 'center';
        inputWrapper.style.gap = '8px'; // Adjusted gap

        const input = document.createElement('input');
        input.type = 'text';
        input.value = value;
        input.id = id;
        input.style.padding = '8px'; // Adjusted padding
        input.style.border = '0px solid #ffffff';
        input.style.borderRadius = '8px'; // Adjusted border radius
        input.style.fontFamily = "'Inter', sans-serif";
        input.style.fontSize = '12px'; // Adjusted font size
        //input.style.backgroundColor = '#ffffff';
        input.style.backdropFilter = 'blur(10px)';
        input.style.backgroundColor = 'rgba(255, 255, 255, 0.4)'; // Optional for semi-transparent background

        input.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'; // Adjusted shadow
        input.style.color = '#000000';

        // Add event listener to save to localStorage on change
        input.addEventListener('input', () => {
            localStorage.setItem(id, input.value.trim());
        });

        inputWrapper.appendChild(input);

        const pasteButton = document.createElement('button');
        pasteButton.type = 'button';
        pasteButton.innerText = '📝';
        pasteButton.style.padding = '8px 8px'; // Adjusted padding
        pasteButton.style.border = 'none';
        //pasteButton.style.backgroundColor = '#7469B6';

        pasteButton.style.backdropFilter = 'blur(10px)';
        pasteButton.style.backgroundColor = 'rgba(255, 255, 255, 0.4)'; // Optional for semi-transparent background

        pasteButton.style.color = '#fff';
        pasteButton.style.borderRadius = '8px'; // Adjusted border radius
        pasteButton.style.cursor = 'pointer';
        pasteButton.style.fontFamily = "'Inter', sans-serif";
        pasteButton.style.fontSize = '12px'; // Adjusted font size
        pasteButton.addEventListener('click', async () => {
            input.value = await navigator.clipboard.readText();
            localStorage.setItem(id, input.value.trim()); // Save updated value to localStorage
        });

        inputWrapper.appendChild(pasteButton);

    if (includeCheckbox) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `checkbox-${id}`;
    checkbox.style.width = '20px'; // Adjusted width
    checkbox.style.height = '20px'; // Adjusted height
    checkbox.style.marginLeft = '8px'; // Adjusted margin
    checkbox.style.cursor = 'pointer';
    checkbox.style.border = '0px solid #cccccc'; // Optional: Border for visibility
    checkbox.style.borderRadius = '12px';
    checkbox.style.appearance = 'none'; // Remove default checkbox styles
    checkbox.style.backgroundColor = '#ffffff'; // Default to white
    checkbox.style.display = 'inline-block';

    // Change background color when selected
    checkbox.addEventListener('change', () => {
        checkbox.style.backgroundColor = checkbox.checked ? '#0ad400' : '#ffffff'; // Green when checked, white otherwise
    });

    inputWrapper.appendChild(checkbox);
}


        return inputWrapper;
    };

    // Create the input fields
    const input1 = createInputFieldWithExtras('input1', storedInput1Value, false);
    const input2 = createInputFieldWithExtras('input2', storedInput2Value, true);
    const input3 = createInputFieldWithExtras('input3', storedInput3Value, true);

    // Create a container for the buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between'; // Align buttons to the edges
    buttonContainer.style.alignItems = 'center'; // Align items vertically
    buttonContainer.style.gap = '8px'; // Adjusted gap

    // Create the copy dynamic link button
    const copyLinkButton = document.createElement('button');
    copyLinkButton.type = 'button';
    copyLinkButton.innerText = 'Copy Link';
    copyLinkButton.style.padding = '8px'; // Adjusted padding
    copyLinkButton.style.width = '48%';
    copyLinkButton.style.backgroundColor = '#8700ff';
    copyLinkButton.style.color = '#fff';
    copyLinkButton.style.border = 'none';
    copyLinkButton.style.borderRadius = '60px'; // Adjusted border radius
    copyLinkButton.style.cursor = 'pointer';
    copyLinkButton.style.fontSize = '12px'; // Adjusted font size
    copyLinkButton.style.fontWeight = 'bold';
    copyLinkButton.style.fontFamily = "'Inter', sans-serif";
    copyLinkButton.addEventListener('click', async () => {
        const link = getFirstAvailableLink();
        if (link) {
            await copyToClipboard(link);
        } else {
            showCustomAlert('No link available to copy.');
        }
    });

    // Create the search button
    const searchButton = document.createElement('button');
    searchButton.type = 'button';
    searchButton.innerText = 'Search';
    searchButton.style.padding = '8px'; // Adjusted padding
    searchButton.style.width = '48%';
    searchButton.style.backgroundColor = '#000000';
    searchButton.style.color = '#fff';
    searchButton.style.border = 'none';
    searchButton.style.borderRadius = '60px'; // Adjusted border radius
    searchButton.style.cursor = 'pointer';
    searchButton.style.fontSize = '12px'; // Adjusted font size
    searchButton.style.fontWeight = 'bold';
    searchButton.style.fontFamily = "'Inter', sans-serif";
    searchButton.style.marginLeft = 'auto'; // Push search button to the right
    searchButton.addEventListener('click', () => {
        let query = input1.querySelector('input').value.trim();
        const checkbox2 = document.getElementById(`checkbox-input2`);
        const checkbox3 = document.getElementById(`checkbox-input3`);
        if (checkbox2.checked) query += ` ${input2.querySelector('input').value.trim()}`;
        if (checkbox3.checked) query += ` ${input3.querySelector('input').value.trim()}`;
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        window.location.href = searchUrl;

        // Save values to localStorage
        localStorage.setItem('input1', input1.querySelector('input').value.trim());
        localStorage.setItem('input2', input2.querySelector('input').value.trim());
        localStorage.setItem('input3', input3.querySelector('input').value.trim());
    });

    // Append buttons to the button container
    buttonContainer.appendChild(copyLinkButton);
    buttonContainer.appendChild(searchButton);

    // Append input fields and button container to the form
    form.appendChild(input1);
    form.appendChild(input2);
    form.appendChild(input3);
    form.appendChild(buttonContainer);

    // Append form to the container
    formContainer.appendChild(form);

    // Append form container to the body
    document.body.appendChild(formContainer);

    // Function to show custom alerts
    const showCustomAlert = (message) => {
        const alertBox = document.createElement('div');
        alertBox.textContent = message;
        alertBox.style.position = 'fixed';
        alertBox.style.bottom = '680px';
        alertBox.style.right = '20px';
        alertBox.style.padding = '10px';
        alertBox.style.backgroundColor = '#ff0000';
        alertBox.style.color = '#fff';
        alertBox.style.borderRadius = '5px';
        alertBox.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        alertBox.style.zIndex = '10001';
        alertBox.style.fontFamily = "'Inter', sans-serif";
        alertBox.style.opacity = '1';
        alertBox.style.transition = 'opacity 0.5s ease'; // Smooth transition
        document.body.appendChild(alertBox);

        setTimeout(() => {
            alertBox.style.opacity = '0';
            setTimeout(() => alertBox.remove(), 500); // Delay removal until fade-out completes
        }, 1000);
    };

    // Draggable functionality
    formContainer.addEventListener('mousedown', (e) => {
        if (e.target === formContainer) {
            let offsetX = e.clientX - formContainer.getBoundingClientRect().left;
            let offsetY = e.clientY - formContainer.getBoundingClientRect().top;

            const mouseMoveHandler = (e) => {
                formContainer.style.left = `${e.clientX - offsetX}px`;
                formContainer.style.top = `${e.clientY - offsetY}px`;
            };

            const mouseUpHandler = () => {
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            };

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        }
    });

    // Function to copy text to clipboard
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            showCustomAlert('Link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
            showCustomAlert('Failed to copy link.');
        }
    };



    const getFirstAvailableLink = () => {
    // Extended class names to check
    const classNamesToCheck = ['n1obkb', 'ab_button', 'ellip', 'PZPZlf'];

    // Check for direct <a> tags and those within a <div> or other container
    for (const className of classNamesToCheck) {
        // Select all <a> elements with the class
        const links = document.querySelectorAll(`a.${className}[href]`);

        // If direct matches are found, return the first href
        if (links.length > 0) {
            return links[0].href; // Return the href of the first found link
        }

        // Check for <a> tags within other elements with the class name
        const containers = document.querySelectorAll(`div.${className}, button.${className}`);
        for (let container of containers) {
            const childLinks = container.querySelectorAll('a[href]');
            if (childLinks.length > 0) {
                return childLinks[0].href;
            }
        }
    }

    // Return null if no link is found
    return null;
};



})();

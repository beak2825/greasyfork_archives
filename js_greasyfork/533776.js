// ==UserScript==
// @name         8chan.moe Delete/Trash No Refresh
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Prevents page refresh when clicking Delete or Trash buttons on 8chan.moe moderation pages and handles deletions via AJAX
// @author       Anonymous
// @match        https://8chan.moe/*/res/*.html*
// @match        https://8chan.moe/mod.js?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533776/8chanmoe%20DeleteTrash%20No%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/533776/8chanmoe%20DeleteTrash%20No%20Refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('8chan.moe Delete/Trash No Refresh script v2.1 loaded');

    // Function to handle button clicks and send AJAX request
    function handleButtonClick(event) {
        event.preventDefault(); // Prevent default button behavior
        event.stopPropagation(); // Stop event bubbling
        event.stopImmediatePropagation(); // Stop other handlers

        const button = event.target;
        console.log(`Clicked button: ${button.id} with value: ${button.value}`);

        // Try to find the form
        let form = button.closest('form');
        if (!form) {
            // Fallback: search for a form with deletion checkboxes
            form = document.querySelector('form input[name*="-"][name*="-"]:checked')?.closest('form') || document.querySelector('form');
            if (!form) {
                console.error('No form found in the document');
                alert('Error: No form found. Please report this issue.');
                return;
            }
        }
        console.log(`Form found: ${form.outerHTML}`);

        // Prevent form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Form submission prevented for form:', form);
        }, { capture: true, once: true });

        // Disable button to prevent multiple clicks
        button.disabled = true;
        setTimeout(() => { button.disabled = false; }, 500); // Re-enable after 500ms

        // Collect form data
        const formData = new FormData();
        formData.append('action', button.value); // Add the button's value (delete or trash)

        // Add checked post checkboxes (e.g., a-9-12)
        const checkedCheckboxes = form.querySelectorAll('input[name*="-"][name*="-"]:checked');
        if (checkedCheckboxes.length === 0) {
            console.error('No checked checkboxes found');
            alert('Error: No posts selected. Please check at least one post.');
            return;
        }
        checkedCheckboxes.forEach(checkbox => {
            formData.append(checkbox.name, 'true');
            console.log(`Added post checkbox: ${checkbox.name}=true`);
        });

        // Log form data for debugging
        for (const [key, value] of formData.entries()) {
            console.log(`FormData: ${key}=${value}`);
        }

        // Log form details
        console.log(`Form action attribute: ${form.getAttribute('action') || 'undefined'}`);
        console.log(`Form method: ${form.getAttribute('method') || 'undefined'}`);

        // Use the correct deletion endpoint
        const actionUrl = 'https://8chan.moe/contentActions.js?json=1';
        console.log(`Final action URL: ${actionUrl}`);

        // Send AJAX request
        fetch(actionUrl, {
            method: 'POST',
            body: formData, // Use multipart/form-data
            credentials: 'same-origin', // Include cookies for authentication
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
                // Omit Content-Type to let browser set multipart/form-data with boundary
            }
        })
        .then(response => {
            console.log(`Response status: ${response.status}, ok: ${response.ok}`);
            return response.json().catch(() => response.text()).then(data => ({ status: response.status, ok: response.ok, data }));
        })
        .then(({ status, ok, data }) => {
            if (ok) {
                console.log(`${button.value} action successful`, data);
                // Provide visual feedback for each checked post
                checkedCheckboxes.forEach(checkbox => {
                    const postElement = checkbox.closest('.post') || checkbox.closest('.post-container') || checkbox.closest('article');
                    if (postElement) {
                        postElement.style.opacity = '0.5'; // Visual indication
                        postElement.style.pointerEvents = 'none'; // Disable interactions
                    }
                });
            } else {
                throw new Error(`Failed to ${button.value}: ${status} ${JSON.stringify(data)}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Error performing ${button.value} action: ${error.message}`);
            // Revert visual changes on failure
            checkedCheckboxes.forEach(checkbox => {
                const postElement = checkbox.closest('.post') || checkbox.closest('.post-container') || checkbox.closest('article');
                if (postElement) {
                    postElement.style.opacity = '';
                    postElement.style.pointerEvents = '';
                }
            });
        });
    }

    // Add event listeners to Delete and Trash buttons
    document.addEventListener('click', function(event) {
        if (event.target.matches('#deleteFormButton') || event.target.matches('#trashFormButton')) {
            console.log('Button click detected:', event.target.id);
            handleButtonClick(event);
        }
    }, { capture: true });

    // Prevent form submission for all forms with delete/trash buttons or checkboxes
    document.querySelectorAll('form').forEach(form => {
        if (form.querySelector('#deleteFormButton') || form.querySelector('#trashFormButton') || form.querySelector('input[name*="-"][name*="-"]')) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Form submission blocked for form:', form);
            }, { capture: true });
        }
    });

    // Global submit prevention for safety
    document.addEventListener('submit', (e) => {
        if (e.target.querySelector('#deleteFormButton') || e.target.querySelector('#trashFormButton') || e.target.querySelector('input[name*="-"][name*="-"]')) {
            e.preventDefault();
            console.log('Global form submission blocked');
        }
    }, { capture: true });

})();
// ==UserScript==
// @name         kbin ez block
// @version      1.0
// @description  Adds an option to block a user or magazine to the more menu on article previews.
// @author       fiofiofio
// @match        https://kbin.social/*
// @grant        GM_log
// @license MIT
// @namespace https://greasyfork.org/users/19234
// @downloadURL https://update.greasyfork.org/scripts/469394/kbin%20ez%20block.user.js
// @updateURL https://update.greasyfork.org/scripts/469394/kbin%20ez%20block.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to handle the new option
    async function handleNewOption(event, link, article, type, name) {
        event.preventDefault();
        const response = await fetch(link.href);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const form = doc.querySelector(`form[name="${type}_block"]`);
      
        if (form) {
          fetch(form.action, {
            method: form.method,
            body: new FormData(form)
          })
            .then(response => {
              // Handle the response as needed
              article.style.display = 'none'; // Hide the article after successful processing
            	showToastMessage(`Blocked ${type} ${name}`);
            })
            .catch(error => {
              // Handle any errors that occur during the fetch request
            	showToastMessage(`There was an error when blocking ${type} ${name}`);
            });
        } else {
          console.log(`Form "${type}_block" not found for ${name}`);
        }
    }
  
  function showToastMessage(message) {
  // Create a toast element
  const toast = document.createElement('div');
  toast.classList.add('toast-block-message');
  toast.textContent = message;

  // Append the toast to the document body
  document.body.appendChild(toast);

  // Automatically remove the toast after a certain duration
  setTimeout(() => {
    toast.remove();
  }, 3000); // Adjust the duration (in milliseconds) as needed
}

    // Add the new options to the dropdown menu
    function addNewOptions() {
        document.querySelectorAll("article").forEach(article => {
            const dropdownMenu = article.querySelector('.dropdown__menu');
            const link = article.querySelector('header h2 a');
            const userName = article.querySelector('.user-inline').getAttribute('title');
            const magazineName = article.querySelector('.magazine-inline').getAttribute('title');

            if (dropdownMenu && link) {
                const blockUser = document.createElement('li');
                const blockMagazine = document.createElement('li');

                blockUser.innerHTML = '<a href="#">block ' + userName + '</a>';
                blockMagazine.innerHTML = '<a href="#">block ' + magazineName + '</a>';

                blockUser.addEventListener('click', (event) => handleNewOption(event, link, article, 'user', userName));
                blockMagazine.addEventListener('click', (event) => handleNewOption(event, link, article, 'magazine', magazineName));

                dropdownMenu.appendChild(blockUser);
                dropdownMenu.appendChild(blockMagazine);
            }
        });
    }

    // Wait for the document to load
    window.addEventListener('load', function() {
        // Call the function to add new options
        addNewOptions();
    });

})();

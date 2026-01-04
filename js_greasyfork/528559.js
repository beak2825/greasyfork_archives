// ==UserScript==
// @name        e621 Saved Search List
// @namespace   Violentmonkey Scripts
// @match       https://e621.net/favorites
// @match       https://e621.net/posts*
// @grant       none
// @version     1.4.1
// @author      LeafNine
// @description A simple userscript that adds a "Saved Search" List
// @license     GNU AGPLv3
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/528559/e621%20Saved%20Search%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/528559/e621%20Saved%20Search%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';
//targetted class names the attach to; default covers home posts page and favorites, alt covers individual post pages
    const targetSelector = '.search';
    const altTargetSelector = '.post-search';
//fetches the link list from local storage for various functions
    const getLinks = () => {
        const data = localStorage.getItem('e621dropdownLinks');
        return data ? JSON.parse(data) : [];
    };
//commits new versions of link list to local storage
    const saveLinks = (links) => {
        localStorage.setItem('e621dropdownLinks', JSON.stringify(links));
    };
//takes local storage link list and formats to JSON for export
    const downloadLinks = () => {
        const links = getLinks();
        const blob = new Blob([JSON.stringify(links, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'e621links.json';
        a.click();
        URL.revokeObjectURL(url);
    };
//takes JSON link list and imports to local storage
    const uploadLinks = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const newLinks = JSON.parse(e.target.result);
                if (Array.isArray(newLinks)) {
                    saveLinks(newLinks);
                    location.reload();
                } else {
                    alert('Invalid JSON format');
                }
            } catch (err) {
                alert('Error reading file');
            }
        };
        reader.readAsText(file);
    };
//makes the button to expand and collapse the dropdown
    const createButton = (parent) => {
        const button = document.createElement('button');
        button.textContent = 'Saved Searches';
        button.style.marginTop = '5px';
        button.onclick = toggleDropdown;
        parent.appendChild(button);
    };
//all the code for the dropdown; right below is all the styling for it
    const createDropdown = (parent) => {
        const dropdown = document.createElement('div');
        dropdown.id = 'dropdownMenu';
        dropdown.style.display = 'none';
        dropdown.style.backgroundColor = '#1f3c67';
        dropdown.style.border = '1px solid black';
        dropdown.style.padding = '10px';
        dropdown.style.zIndex = '9999';
        dropdown.style.marginTop = '5px';
//makes the list object
        const links = getLinks();
        const list = document.createElement('ul');
        list.style.listStyle = 'none';
        list.style.padding = '0';
        list.style.margin = '0';
//draws each individual link from the list
        links.forEach(({ title, url }, index) => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = url;
            link.textContent = title;
            link.target = '_blank';
            listItem.appendChild(link);
//makes the delete button for each entry
            const removeButton = document.createElement('button');
            removeButton.className = 'remove_link';
            removeButton.textContent = 'x';
            removeButton.style.display = 'none';
            removeButton.onclick = () => {
                const newLinks = getLinks().filter((_, i) => i !== index);
                saveLinks(newLinks);
                location.reload();
            };
            listItem.prepend(removeButton);
            list.appendChild(listItem);
//makes the edit button for each entry
            const editButton = document.createElement('button');
            editButton.className = 'edit_link';
            editButton.textContent = 'Edit';
            editButton.style.display = 'none';
            editButton.onclick = () => {
                const editLinks = getLinks().filter((_, i) => i == index);
                const promptReturn = prompt('Editting Link:', JSON.stringify(editLinks));
                const edittedLink = promptReturn.slice(1, promptReturn.length-1);
                const unedittedLinks = getLinks();
                unedittedLinks[index] = JSON.parse(edittedLink);
                saveLinks(unedittedLinks);
                location.reload();
            };
            listItem.prepend(editButton);
        });

        dropdown.appendChild(list);
        dropdown.appendChild(document.createElement('br'));
//makes the toggle button for the delete buttons
        const toggleRemoveButton = document.createElement('button');
        toggleRemoveButton.textContent = 'Toggle Link Remove';
        toggleRemoveButton.addEventListener('click', () => {
            const removeButtons = document.querySelectorAll('.remove_link');
            removeButtons.forEach(button => {
        button.style.display = button.style.display === 'none' ? 'inline' : 'none';
            });
        });

        dropdown.appendChild(toggleRemoveButton);
        dropdown.appendChild(document.createElement('br'));
//makes the toggle button for the edit buttons
        const toggleEditButton = document.createElement('button');
        toggleEditButton.textContent = 'Toggle Link Edit';
        toggleEditButton.addEventListener('click', () => {
            const editButtons = document.querySelectorAll('.edit_link');
            editButtons.forEach(button => {
        button.style.display = button.style.display === 'none' ? 'inline' : 'none';
            });
        });

        dropdown.appendChild(toggleEditButton);
        dropdown.appendChild(document.createElement('br'));
        dropdown.appendChild(document.createElement('br'));
//makes the bulk link input text box
        const bulkInput = document.createElement('textarea');
        bulkInput.placeholder = 'Title, URL\nTitle2, URL2';
        bulkInput.rows = 5;
        dropdown.appendChild(bulkInput);
//makes the button to add the entered links to the list
        const bulkAddButton = document.createElement('button');
        bulkAddButton.textContent = 'Add Link(s)';
        bulkAddButton.onclick = () => {
            const newLinks = getLinks();
            const lines = bulkInput.value.split('\n');
            lines.forEach(line => {
                const [title, url] = line.split(',').map(s => s.trim());
                if (title && url) {
                    newLinks.push({ title, url });
                }
            });
            saveLinks(newLinks);
            location.reload();
        };

        dropdown.appendChild(bulkAddButton);
        dropdown.appendChild(document.createElement('br'));
//makes the button to add the current page url to the list; default name is "NewQuickLink"
        const quickAddButton = document.createElement('button');
        quickAddButton.textContent = 'Add Current Page';
        quickAddButton.onclick = () => {
            const quickAdd = getLinks();
            const title = 'NewQuickLink';
            const url = window.location.href;
            quickAdd.push({ title, url });
            saveLinks(quickAdd);
            location.reload();
        };

        dropdown.appendChild(quickAddButton);
        dropdown.appendChild(document.createElement('br'));
        dropdown.appendChild(document.createElement('br'));
//makes the button to export link list
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export List JSON';
        exportButton.onclick = downloadLinks;
        dropdown.appendChild(exportButton);
//makes the default file upload button; this is hidden, and indirectly called through the import button, as the default file upload caused the dropdown to overlap with other page elements
        const uploadInput = document.createElement('input');
        uploadInput.style.display = 'none';
        uploadInput.type = 'file';
        uploadInput.accept = 'application/json';
        uploadInput.onchange = (e) => uploadLinks(e.target.files[0]);
        dropdown.appendChild(uploadInput);
//makes the button to import link list
        const importButton = document.createElement('button');
        importButton.textContent = 'Import List JSON';
        importButton.addEventListener('click', () => {
        uploadInput.click();
        });
        dropdown.appendChild(importButton);

        parent.appendChild(dropdown);
    };
//manages the toggling of the dropdown
    const toggleDropdown = () => {
        const dropdown = document.getElementById('dropdownMenu');
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    };
//attaches everything to the target classes; tries the default first, then tries the alternate (I couldn't be bothered to make some sort of detection mechanism, maybe in a future release)
    const attachToElement = () => {
    const target = document.querySelector(targetSelector);
    if (target) {
        createButton(target);
        createDropdown(target);
    } else {
        console.warn(`Element with selector '${targetSelector}' not found.`);
        const altTarget = document.querySelector(altTargetSelector);
        if (altTarget) {
            createButton(altTarget);
            createDropdown(altTarget);
        } else {
            console.warn(`Element with selector '${altTargetSelector}' not found.`);
        }
      }
    };

//hhhmmmmm I wonder what this does... mystery
    attachToElement();
})();
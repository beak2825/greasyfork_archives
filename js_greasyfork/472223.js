// ==UserScript==
// @name         HF model downloader
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Extract urls to model of Huggingface. Make your life easier when downloading the weights manually.
// @author       Desjajja and ChatGPT
// @match        https://huggingface.co/*/tree/main
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472223/HF%20model%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/472223/HF%20model%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // Get all <a> elements on the page
const links = document.getElementsByTagName("a");

// Create an array to store the URLs of downloadable files
const downloadUrls = [];

// Loop through each <a> element and extract its href attribute value
for (let i = 0; i < links.length; i++) {
  const link = links[i];
  const url = link.href;

  // Check if the URL ends with a .postfix extension (change "postfix" to the actual file extension)
  if (url && url.match(/\.[0-9a-z]+$/i) && !url.match(/\/$/) && !url.includes("blob") && !url.includes("=")) {
      let url_parts = url.split(/[\\/]/);
    downloadUrls.push({
    'url': url,
        'name': url_parts.pop()
    });
  }
}
  // Create a button to download the array of downloadable file URLs to a text file
  const button = document.createElement('button');
  button.innerHTML = 'Download URLs';
  button.style.position = 'fixed';
  button.style.top = '10px';
  button.style.right = '10px';
  button.style.zIndex = '9999';

  const toggleButton = document.createElement('button');
  toggleButton.innerHTML = 'Hide URLs';
  toggleButton.style.position = 'fixed';
  toggleButton.style.top = '30px';
  toggleButton.style.right = '10px';
  toggleButton.style.zIndex = '9999';

  // Create checkboxes for each downloadable file URL
  const checkboxes = [];
  const checkboxContainer = document.createElement('div');
  checkboxContainer.style.position = 'fixed';
  checkboxContainer.style.top = '50px';
  checkboxContainer.style.right = '10px';
  checkboxContainer.style.zIndex = '9999';
  checkboxContainer.style.backgroundColor = "#111827";
  checkboxContainer.style.borderRadius = "15px";
  checkboxContainer.style.borderStyle = "solid";
  checkboxContainer.style.borderWidth = "1px";
  checkboxContainer.style.padding = "0 0 10px 10px";
  for (let i = 0; i < downloadUrls.length; i++) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'url_checkbox';
    checkbox.value = downloadUrls[i].url;
    const label = document.createElement('label');
    label.innerHTML = downloadUrls[i].name;
    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);
    checkboxContainer.appendChild(document.createElement('br'));
    checkboxes.push(checkbox);
    console.log(label)
  }

  // Create a "Select All" checkbox
  const selectAll = document.createElement('input');
  selectAll.type = 'checkbox';
  selectAll.name = 'select_all_checkbox';
  selectAll.value = 'Select All';
  const selectAllLabel = document.createElement('label');
  selectAllLabel.innerHTML = 'Select All';
  checkboxContainer.prepend(document.createElement('br'));
  checkboxContainer.prepend(selectAllLabel);
  checkboxContainer.prepend(selectAll);

  // Add the button and checkboxes to the page
  document.body.appendChild(button);
  document.body.appendChild(checkboxContainer);
  document.body.appendChild(toggleButton);

  // Download the selected URLs when the button is clicked
  button.onclick = function() {
    const selectedUrls = [];
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        selectedUrls.push(checkboxes[i].value);
      }
    }
    if (selectedUrls.length === 0) {
        alert("No files to download!");
        return;
    }
    const blob = new Blob([selectedUrls.join('\n')], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const href = window.location.href;
    const href_parts = href.split("/");
    const default_name = href_parts[href_parts.length - 3];
    let fileBaseName = prompt("Name the file:", default_name);
    if (fileBaseName === null) return;

    link.href = url;
    link.download = fileBaseName + ".txt";
    link.click();
  };

  // Select or deselect all checkboxes when the "Select All" checkbox is clicked
  selectAll.onclick = function() {
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = selectAll.checked;
    }
  };

      // Toggle the visibility of the checkbox container when the toggle button is clicked
  toggleButton.onclick = function() {
    if (checkboxContainer.style.display === 'none') {
      checkboxContainer.style.display = 'block';
      toggleButton.innerHTML = 'Hide URLs';
    } else {
      checkboxContainer.style.display = 'none';
      toggleButton.innerHTML = 'Show URLs';
    }
  };

  function updateSelectAll() {
    let allChecked = true;
    for (let i = 0; i < checkboxes.length; i++) {
      if (!checkboxes[i].checked) {
        allChecked = false;
        break;
      }
    }
    selectAll.checked = allChecked;
  };


  // Add event listeners to update the "Select All" checkbox state whenever a checkbox is clicked
  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('click', function() {
      updateSelectAll();
    });
  }

  // Update the "Select All" checkbox state initially
  updateSelectAll();

})();
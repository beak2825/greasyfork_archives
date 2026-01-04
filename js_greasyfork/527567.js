// ==UserScript==
// @name         HackerWars.io UI++
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Enables drag and drop functionality for list items
// @author       Oryyx
// @match        https://hackerwars.io/*
// @license MIT

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527567/HackerWarsio%20UI%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/527567/HackerWarsio%20UI%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //CUSTOM NAV LINKS

    // Function to create and display the modal
function createModal() {
  const modal = document.createElement('div');
  modal.id = 'customLinkModal';
  modal.style.position = 'fixed';
  modal.style.top = '50%';
  modal.style.left = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.backgroundColor = 'white';
  modal.style.padding = '20px';
  modal.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  modal.style.zIndex = '1000';
  modal.style.display = 'none';

  const title = document.createElement('h4');
  title.innerText = 'Add Custom Link';

  const linkNameLabel = document.createElement('label');
  linkNameLabel.innerText = 'Link Name:';

  const linkNameInput = document.createElement('input');
  linkNameInput.type = 'text';
  linkNameInput.placeholder = 'Enter link name';

  const linkUrlLabel = document.createElement('label');
  linkUrlLabel.innerText = 'Link URL:';

  const linkUrlInput = document.createElement('input');
  linkUrlInput.type = 'url';
  linkUrlInput.placeholder = 'Enter link URL';

  const saveButton = document.createElement('button');
  saveButton.innerText = 'Save Link';

  // Append elements to the modal
  modal.appendChild(title);
  modal.appendChild(linkNameLabel);
  modal.appendChild(linkNameInput);
  modal.appendChild(linkUrlLabel);
  modal.appendChild(linkUrlInput);
  modal.appendChild(saveButton);

  // Append modal to the body
  document.body.appendChild(modal);

  // Close the modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  return { modal, linkNameInput, linkUrlInput, saveButton };
}

// Function to create the "Add Custom Link" button inside the sidebar
function createAddLinkButton() {
  const addButtonItem = document.createElement('li');
  const addButtonLink = document.createElement('a');
  addButtonLink.href = '#';
  addButtonLink.innerHTML = `<i class="fa fa-inverse fa-link"></i> <span>Add Custom Link</span>`;

  addButtonItem.appendChild(addButtonLink);

  // When the "Add Custom Link" button is clicked, show the modal
  addButtonLink.addEventListener('click', function(e) {
    e.preventDefault(); // Prevent the default action (navigation)
    modal.style.display = 'block';
  });

  // Append the custom link button to the sidebar
  const sidebar = document.getElementById('sidebar').querySelector('ul');
  sidebar.insertBefore(addButtonItem, sidebar.firstChild); // Insert at the top

  // Create a spacer item to visually separate custom links from actual links
  const spacer = document.createElement('li');
  spacer.style.height = '10px'; // Adjust the height as needed
  sidebar.insertBefore(spacer, sidebar.children[1]); // Insert spacer after the "Add Custom Link" item
}

// Function to inject a new link into the sidebar
function injectCustomLink(link, index) {
  const sidebar = document.querySelector('#sidebar ul');

  // Create a new list item with a subtle delete button
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = link.url;
  a.innerHTML = `<i class="fa fa-inverse fa-link"></i> <span>${link.name}</span>`;

  // Create a subtle delete button (X icon)
  const deleteButton = document.createElement('span');
  deleteButton.innerText = '✖';
  deleteButton.style.fontSize = '14px';
  deleteButton.style.color = 'red';
  deleteButton.style.cursor = 'pointer';
  deleteButton.style.position = 'absolute';
  deleteButton.style.right = '10px'; // Position the "X" at the right edge
  deleteButton.style.top = '50%';
  deleteButton.style.transform = 'translateY(-50%)'; // Vertically center the "X"
  deleteButton.style.fontWeight = 'bold';
  deleteButton.style.padding = '0 5px';

  // When the delete button is clicked, remove the link
  deleteButton.addEventListener('click', function() {
    li.remove();
    deleteLinkFromStorage(index); // Remove from localStorage as well
  });

  li.style.position = 'relative'; // Ensure the delete button is positioned relative to the li
  li.appendChild(a);
  li.appendChild(deleteButton);

  sidebar.insertBefore(li, sidebar.children[2]); // Insert after the spacer
}

// Function to save custom links to localStorage
function saveLink(link) {
  const customLinks = JSON.parse(localStorage.getItem('customLinks')) || [];
  customLinks.push(link);
  localStorage.setItem('customLinks', JSON.stringify(customLinks));
}

// Function to delete a link from localStorage
function deleteLinkFromStorage(index) {
  const customLinks = JSON.parse(localStorage.getItem('customLinks')) || [];
  customLinks.splice(index, 1); // Remove the link at the given index
  localStorage.setItem('customLinks', JSON.stringify(customLinks));
}

// Function to load saved links from localStorage
function loadCustomLinks() {
  const customLinks = JSON.parse(localStorage.getItem('customLinks')) || [];
  console.log("Loading custom links:", customLinks); // Debugging line

  customLinks.forEach((link, index) => {
    injectCustomLink(link, index);
  });
}

// Function to create and initialize everything
const { modal, linkNameInput, linkUrlInput, saveButton } = createModal();
createAddLinkButton();

// Save the custom link when the save button is clicked
saveButton.addEventListener('click', function() {
  const linkName = linkNameInput.value.trim();
  const linkUrl = linkUrlInput.value.trim();

  if (linkName && linkUrl) {
    const newLink = { name: linkName, url: linkUrl };

    // Save and inject the new link
    saveLink(newLink);
    injectCustomLink(newLink, JSON.parse(localStorage.getItem('customLinks')).length - 1);

    // Clear inputs and hide modal
    linkNameInput.value = '';
    linkUrlInput.value = '';
    modal.style.display = 'none';
  }
});

// Ensure that custom links are loaded after the DOM is fully loaded
setTimeout(function(){
  console.log("DOM content loaded, loading custom links...");
  loadCustomLinks();
},500);

    //END CUSTOM NAV

    //tabel filtr







    //now for stuff
 setTimeout(function(){
        const rows = document.querySelectorAll("table tbody tr");
        rows.forEach(row => {
            const descriptionCell = row.cells[1]; // Get the second column
            if (descriptionCell) {
                const text = descriptionCell.innerText.trim(); // Get visible text only
                if (text.includes("This mission is hidden.")) {
                    row.style.display = "none"; // Hide the row
                }
            }
        });
    }, 500);


    //end



 function initFilter() {
    let table = document.querySelector("table.table-software");
    if (!table) {
        console.warn("No software table found.");
        return;
    }

    // Prevent duplicate filters
    if (document.getElementById("software-filter")) return;

    // Create filter UI
    let filterContainer = document.createElement("div");
    filterContainer.style.marginBottom = "10px";

    let filterLabel = document.createElement("label");
    filterLabel.textContent = "Filter by Extension: ";
    filterLabel.style.fontWeight = "bold";
    filterLabel.style.marginRight = "5px";

    let filterSelect = document.createElement("select");
    filterSelect.id = "software-filter";

    // Define grouped extensions
    let extensionGroups = {
        "Show All": [""],
        "General": [".txt", ".dat", ".torrent"],
        "Security": [".crc", ".hash", ".fwl", ".hdr", ".skr"],
        "Virus/Malware": [".av", ".vspam", ".vddos", ".vminer"],
        "Hacking Tools": [".exp", ".vwarez", ".vcol"]
    };

    Object.entries(extensionGroups).forEach(([groupName, extensions]) => {
        let optgroup = document.createElement("optgroup");
        optgroup.label = groupName;

        extensions.forEach(ext => {
            let option = document.createElement("option");
            option.value = ext;
            option.textContent = ext === "" ? "Show All" : ext;
            optgroup.appendChild(option);
        });

        filterSelect.appendChild(optgroup);
    });

    filterContainer.appendChild(filterLabel);
    filterContainer.appendChild(filterSelect);

    // Insert filter above the table
    table.parentNode.insertBefore(filterContainer, table);

    // Filtering function
    function filterSoftware() {
        let selectedExt = filterSelect.value;
        let rows = document.querySelectorAll("table.table-software tbody tr");

        rows.forEach(row => {
            let softwareNameCell = row.querySelector("td:nth-child(2)"); // Second <td> contains software name
            if (!softwareNameCell) return;

            let softwareName = softwareNameCell.textContent.trim();
            row.style.display = (selectedExt === "" || softwareName.endsWith(selectedExt)) ? "" : "none";
        });
    }

    // Listen for dropdown changes
    filterSelect.addEventListener("change", filterSoftware);

    // Run filter in case page is already loaded
    filterSoftware();
}

// Use a MutationObserver to detect when the table appears (for dynamically loaded content)
let observer = new MutationObserver(() => {
    if (document.querySelector("table.table-software")) {
        observer.disconnect(); // Stop observing once table is found
        initFilter();
    }
});

observer.observe(document.body, { childList: true, subtree: true });

// Also try running it immediately (in case the table is already there)
document.addEventListener("DOMContentLoaded", initFilter);


    //end table filtering


    // Task ordering


        // Adding custom styles
    const style = document.createElement('style');
    style.innerHTML = `
        .list {
            list-style: none;
            padding: 0;
        }

        .list li {
            display: flex;
            align-items: center;
            padding: 10px;
            background: #f4f4f4;
            margin: 5px 0;
            cursor: grab;
            border-radius: 5px;
            transition: background 0.2s ease-in-out;
        }

        .list li .drag-handle {
            cursor: grab;
            margin-right: 10px;
            font-size: 1.2em;
            opacity: 0.5;
        }

        .list li:hover .drag-handle {
            opacity: 1;
        }

        .list li.dragging {
            opacity: 0.7;
            background: #ddd;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .list li:active {
            cursor: grabbing;
        }
    `;
    document.head.appendChild(style);

    // Make the list items draggable
    document.querySelectorAll('.list').forEach(list => {
        list.querySelectorAll('li').forEach(li => {
            // Add drag handle icon
            const dragHandle = document.createElement('span');
            dragHandle.classList.add('drag-handle');
            dragHandle.textContent = '⋮⋮'; // You can replace this with any icon, e.g., FontAwesome
            li.prepend(dragHandle);

            li.draggable = true;

            li.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', ''); // Required for Firefox
                li.classList.add('dragging');
            });

            li.addEventListener('dragend', () => {
                li.classList.remove('dragging');
            });
        });

        list.addEventListener('dragover', (e) => {
            e.preventDefault();

            const dragging = document.querySelector('.dragging');
            if (!dragging) return; // Ensure dragging element exists

            const afterElement = getDragAfterElement(list, e.clientY);

            if (afterElement && afterElement.element) {
                list.insertBefore(dragging, afterElement.element);
            } else {
                list.appendChild(dragging);
            }
        });
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            return (offset < 0 && offset > closest.offset) ? { offset, element: child } : closest;
        }, { offset: Number.NEGATIVE_INFINITY, element: null });
    }

    //end task ordering


    //Doublr click to view procb

        document.querySelectorAll('li').forEach(function(li) {
    li.addEventListener('dblclick', function() {
        // Find the element with the 'span5' class inside the clicked 'li'
        var span5 = li.querySelector('.span5');
        if (span5) {
            // Extract the 'data-process-id' from the child element
            var processElement = span5.querySelector('.process');
            var processId = processElement ? processElement.getAttribute('data-process-id') : null;
            window.location.href = '/processes?pid='+processId;
        }
    });
});


    //end


    // Inject a new button next to the "Edit log file" button
    function injectButton() {
        const existingButton = document.querySelector('input.btn.btn-inverse[value="Edit log file"]');
        if (!existingButton) return;

        const newButton = document.createElement('input');
        newButton.type = 'button';
        newButton.value = 'Wipe log';
        newButton.className = 'btn btn-inverse';
        newButton.style.marginLeft = '5px';

        newButton.addEventListener('click', () => {
            document.querySelector('.logarea').value = Math.random().toString(36).substring(2, 10);
document.querySelector('input[type="submit"][value="Edit log file"]').click();
        });

        existingButton.parentNode.insertBefore(newButton, existingButton.nextSibling);
    }

    injectButton();


 //software ordering



    const SWTableMove = () => {

    const tableBody = table.querySelector("tbody");
    const tableHead = table.querySelector("thead tr");
    let draggedRow = null;

    // Add new column header for drag icon
    const dragHeader = document.createElement("th");
    dragHeader.style.textAlign = "center";
    dragHeader.innerHTML = "&#x2630;"; // Unicode ☰ (grab icon)
    dragHeader.style.maxWidth = "30px"; // Limit the width of the drag column header
    dragHeader.style.width = "30px"; // Set fixed width
    dragHeader.style.padding = "0"; // Remove extra padding
    tableHead.insertBefore(dragHeader, tableHead.firstChild);

    // Add drag handles to rows
    document.querySelectorAll("tbody tr").forEach((row) => {
        row.setAttribute("draggable", "true");

        // Create a new cell for drag handle
        const dragCell = document.createElement("td");
        dragCell.style.textAlign = "center";
        dragCell.style.cursor = "grab";
        dragCell.style.maxWidth = "30px"; // Limit the width of the drag column
        dragCell.style.width = "30px"; // Set fixed width
        dragCell.style.padding = "0"; // Remove extra padding

        // Create drag handle icon
        const dragHandle = document.createElement("span");
        dragHandle.innerHTML = "&#x2630;"; // Unicode ☰ (grab icon)
        dragHandle.style.fontSize = "16px";
        dragHandle.style.userSelect = "none";

        dragCell.appendChild(dragHandle);
        row.insertBefore(dragCell, row.firstChild);
    });









    // Restore the row order from localStorage
    const restoreOrder = () => {
        const savedOrder = JSON.parse(localStorage.getItem("rowOrder"));
        if (savedOrder) {
            savedOrder.forEach(rowId => {
                const row = document.getElementById(rowId);
                if (row) {
                    tableBody.appendChild(row); // Append the row back to the table in saved order
                }
            });
        }
    };

    // Save the row order to localStorage
    const saveOrder = () => {
        const rowIds = Array.from(tableBody.querySelectorAll("tr")).map(row => row.id);
        localStorage.setItem("rowOrder", JSON.stringify(rowIds));
    };

    // Call restoreOrder on page load
    restoreOrder();

    tableBody.addEventListener("dragstart", (e) => {
        if (e.target.tagName === "TR") {
            draggedRow = e.target;
            draggedRow.style.opacity = "0.6";
            draggedRow.style.background = "#f0f0f0";
        }
    });

    tableBody.addEventListener("dragover", (e) => {
        e.preventDefault();
        const targetRow = e.target.closest("tr");
        if (targetRow && targetRow !== draggedRow) {
            const rect = targetRow.getBoundingClientRect();
            const next = e.clientY > rect.top + rect.height / 2;
            tableBody.insertBefore(draggedRow, next ? targetRow.nextSibling : targetRow);
        }
    });

    tableBody.addEventListener("dragend", () => {
        if (draggedRow) {
            draggedRow.style.opacity = "1";
            draggedRow.style.background = "";
            draggedRow = null;
            saveOrder(); // Save the order after drag ends
        }
    });

    // Auto resize columns based on content
    const resizeColumns = () => {
        const rows = table.querySelectorAll("tr");
        const columns = table.querySelectorAll("th, td");

        // Resize the drag column (first column)
        const firstColumnWidth = Math.max(...Array.from(rows).map(row => row.cells[0].offsetWidth));
        columns[0].style.width = `${firstColumnWidth}px`;

        // Resize the empty column (the one after the drag icon)
        const secondColumnWidth = Math.max(...Array.from(rows).map(row => row.cells[1].offsetWidth));
        columns[1].style.width = "auto"; // Let this column auto-resize based on its content

        // Resize other columns (excluding the first two)
        columns.forEach((column, index) => {
            if (index > 1) { // Skip the first two columns (drag and empty content column)
                let maxWidth = 0;
                rows.forEach(row => {
                    const cell = row.children[index];
                    if (cell) {
                        const width = cell.offsetWidth;
                        maxWidth = Math.max(maxWidth, width);
                    }
                });
                column.style.width = maxWidth + "px";
            }
        });
    };

    // Call the resizeColumns function after DOM load and when dragged rows are reordered
    resizeColumns();


    
};

const table = document.querySelector("table");

    if(window.location.pathname =='/software'){
    SWTableMove();
}

    //end



})();


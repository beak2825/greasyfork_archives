// ==UserScript==
// @name         WME Segment Grouper
// @author       DiffLok
// @version      0.2
// @description  Group and export WME segments.
// @match        https://*.waze.com/*editor*
// @grant        none
// @namespace https://greasyfork.org/users/1397704
// @downloadURL https://update.greasyfork.org/scripts/517914/WME%20Segment%20Grouper.user.js
// @updateURL https://update.greasyfork.org/scripts/517914/WME%20Segment%20Grouper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const version = '0.2';

    if (!window.SDK_INITIALIZED) {
        console.error("WME SDK not initialized");
        return;
    }

    window.SDK_INITIALIZED.then(() => {

        const wmeSDK = getWmeSdk({
            scriptId: "segment-grouper",
            scriptName: "Segment Grouper",
        });

        wmeSDK.Events.once({ eventName: "wme-map-data-loaded" }).then(() => {
            addSidebarTab(wmeSDK);
            setupUI(wmeSDK);
        });
    });

    let guiVisible = JSON.parse(localStorage.getItem("sm-gui-visible")) ?? true; // Retrieve visibility state

     async function addSidebarTab(wmeSDK) {
        try {
            // Register the sidebar tab
            const { tabLabel, tabPane } = await wmeSDK.Sidebar.registerScriptTab();

            // Set tab label and tooltip
            tabLabel.innerText = "Groups";
            tabLabel.title = "Segment Grouper";

            // Setup the tab content
            tabPane.innerHTML = `
            <div style="padding:10px;">
                <h2>Segment Grouper</h2>
                <p>Show or hide the GUI</p>
                <p><button style="margin-top:10px;" id="toggle-gui-btn"></button><br>&nbsp;</p>
                <hr>
                <figure class="table">
                    <table>
                        <tbody>
                            <tr>
                                <td>Zoom on selection</td>
                                <td style="padding-left:10px;"><input type="checkbox" id="zoom-on-select" name="zoom-on-select" value="Y" checked></td>
                            </tr>
                            <tr>
                                <td>Pan on selection</td>
                                <td style="padding-left:10px;"><input type="checkbox" id="pan-on-select" name="pan-on-select" value="Y" checked></td>
                            </tr>
                        </tbody>
                    </table>
                </figure>
            </div>`
        ;

            // Add toggle functionality
            const toggleButton = tabPane.querySelector("#toggle-gui-btn");
            toggleButton.innerText = guiVisible ? "Hide GUI" : "Show GUI";
            toggleButton.addEventListener("click", () => {
                toggleGUI();
                toggleButton.innerText = guiVisible ? "Hide GUI" : "Show GUI";
            });

            // Load saved states for checkboxes
            const savedZoomState = JSON.parse(localStorage.getItem("zoom-on-select")) ?? true;
            const savedPanState = JSON.parse(localStorage.getItem("pan-on-select")) ?? true;

            const zoomCheckbox = tabPane.querySelector("#zoom-on-select");
            const panCheckbox = tabPane.querySelector("#pan-on-select");

            // Apply saved states
            zoomCheckbox.checked = savedZoomState;
            panCheckbox.checked = savedPanState;

            // Save state on change
            zoomCheckbox.addEventListener("change", () => {
                localStorage.setItem("zoom-on-select", JSON.stringify(zoomCheckbox.checked));
            });
            panCheckbox.addEventListener("change", () => {
                localStorage.setItem("pan-on-select", JSON.stringify(panCheckbox.checked));
            });
        } catch (error) {
            console.error("Failed to add sidebar tab:", error);
        }
    }
    function toggleGUI() {
        const container = document.getElementById("sm-gui-container");
        guiVisible = !guiVisible;
        localStorage.setItem("sm-gui-visible", JSON.stringify(guiVisible)); // Save state
        if (container) {
            container.style.display = guiVisible ? "flex" : "none";
        }
    }

    const groups = []; // Array to store groups

    function getContrastColor(hexColor) {
        const rgb = parseInt(hexColor.slice(1), 16); // Convert hex to integer
        const r = (rgb >> 16) & 0xff; // Extract red
        const g = (rgb >> 8) & 0xff;  // Extract green
        const b = rgb & 0xff;         // Extract blue
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b; // Calculate luminance
        return luminance > 186 ? '#000000' : '#FFFFFF'; // Return black or white
    }

    function addGroup(wmeSDK, name, location, direction, tags, color, comment) {
        if (!name.trim()) {
            alert('Group name is required!');
            return;
        }

        const selection = wmeSDK.Editing.getSelection();
        if (!selection || !selection.ids || selection.ids.length === 0) {
            alert('No segments selected!');
            return;
        }
        const selectedSegments = selection.ids;

        const segmentCoordinates = selectedSegments.map(segmentId => {
            const segment = wmeSDK.DataModel.Segments.getById({ segmentId });
            return segment.geometry.coordinates; // Array of coordinates
        });


        const newGroup = {
            id: `group-${groups.length + 1}`,
            name,
            location,
            direction,
            tags: tags.split(',').map(tag => tag.trim()),
            color,
            comment,
            segments: selectedSegments,
            coordinates: segmentCoordinates.flat(),
        };

        groups.push(newGroup);
        updateGroupList(wmeSDK);
        clearFields();
    }

    function clearFields(){
        document.querySelector('#group-name').value = '';
        document.querySelector('#group-location').value = '';
        document.querySelector('#group-direction').value = '';
        document.querySelector('#group-tags').value = '';
        document.querySelector('#group-comment').value = '';
    }

    function removeGroup(groupId, wmeSDK) {
        const groupIndex = groups.findIndex(group => group.id === groupId);
        if (groupIndex !== -1) {
            groups.splice(groupIndex, 1);
            updateGroupList(wmeSDK);
        }
    }

    function resetGroups(wmeSDK) {
        if (groups.length === 0) {
            alert("No groups to reset.");
            return;
        }

        const confirmed = confirm("Clicking Okay will cause all groups to be lost. Exporting is recommended.");
        if (confirmed) {
            groups.length = 0; // Clear groups
            clearFields();
            updateGroupList(wmeSDK);
        }


    }

    function reorderGroups(startIndex, endIndex) {
        const [movedGroup] = groups.splice(startIndex, 1);
        groups.splice(endIndex, 0, movedGroup);
    }

    function updateGroupList(wmeSDK) {
        const groupList = document.getElementById('group-list');
        groupList.innerHTML = ''; // Clear the current list

        groups.forEach((group, index) => {
            const groupItem = document.createElement('div');
            groupItem.style.display = 'flex';
            groupItem.style.alignItems = 'center';
            groupItem.style.justifyContent = 'space-between';
            groupItem.style.padding = '5px';
            groupItem.style.marginBottom = '5px';
            groupItem.style.backgroundColor = group.color;
            groupItem.style.border = '1px solid #000';
            groupItem.style.color = getContrastColor(group.color);
            groupItem.style.borderRadius = '3px';
            groupItem.style.cursor = 'pointer';

            groupItem.title = `
Location: ${group.location || 'N/A'}
Direction: ${group.direction || 'N/A'}
Tags: ${(group.tags && group.tags.length > 0) ? group.tags.join(', ') : 'None'}
Comment: ${group.comment || 'None'}
`.trim();

            // Make group draggable
            groupItem.draggable = true;

            groupItem.addEventListener('dragstart', (event) => {
                event.dataTransfer.setData('text/plain', index);
                groupItem.style.opacity = '0.5';
            });

            groupItem.addEventListener('dragend', () => {
                groupItem.style.opacity = '1';
            });

            groupItem.addEventListener('dragover', (event) => {
                event.preventDefault();
                groupItem.style.border = '2px dashed #000';
            });

            groupItem.addEventListener('dragleave', () => {
                groupItem.style.border = '1px solid #000';
            });

            groupItem.addEventListener('drop', (event) => {
                event.preventDefault();
                const startIndex = parseInt(event.dataTransfer.getData('text/plain'), 10);
                reorderGroups(startIndex, index);
                updateGroupList(wmeSDK);
            });

            groupItem.addEventListener('click', () => {

                //recall values
                document.querySelector('#group-name').value = (!group.name) ? '' : group.name;
                document.querySelector('#group-location').value = (!group.location) ? '' : group.location;
                document.querySelector('#group-direction').value = (!group.direction) ? '' :  group.direction;
                document.querySelector('#group-tags').value = (!group.tags) ? '' :  group.tags.join(',');
                document.querySelector('#group-comment').value = (!group.comment) ? '' :  group.comment;
                document.querySelector('#group-color').value = (!group.color) ? '#000000' :  group.color;

                wmeSDK.Editing.setSelection({
                    selection: {
                        ids: group.segments,
                        objectType: 'segment',
                    },
                });
                const zoomOption = document.querySelector('#zoom-on-select').checked;
                const panOption = document.querySelector('#pan-on-select').checked;
                const segmentCoordinates = group.segments.map(segmentId => {
                    const segment = wmeSDK.DataModel.Segments.getById({ segmentId });
                    return segment.geometry.coordinates; // Array of coordinates
                }).flat();
                if(zoomOption) {
                    const bbox = calculateBBox(segmentCoordinates);
                    wmeSDK.Map.zoomToExtent({ bbox });
                }
                if(panOption) {
                    const geometry = {
                        type: "LineString",
                        coordinates: segmentCoordinates,
                    };
                    wmeSDK.Map.centerMapOnGeometry({ geometry });
                }
            });

            const nameAndCount = document.createElement('span');
            nameAndCount.innerText = `${group.name} (${group.segments.length})`;
            nameAndCount.style.flex = '1';
            nameAndCount.style.whiteSpace = 'nowrap'; // Prevent line wrapping
            nameAndCount.style.overflow = 'hidden';  // Hide overflow text
            nameAndCount.style.textOverflow = 'ellipsis'; // Add ellipsis if text overflows
            groupItem.appendChild(nameAndCount);

            const removeButton = document.createElement('button');
            removeButton.innerHTML = '<i class="fa fa-trash"></i>';
            removeButton.style.padding = '2px 5px';
            removeButton.style.cursor = 'pointer';
            removeButton.addEventListener('click', (event) => {
                event.stopPropagation();
                removeGroup(group.id, wmeSDK);
            });

            groupItem.appendChild(removeButton);
            groupList.appendChild(groupItem);
        });
    }

    function calculateBBox(coordinates) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        coordinates.forEach(([x, y]) => {
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        });

        return [minX, minY, maxX, maxY];
    }

    function setupUI(wmeSDK) {

        const container = document.createElement('div');
        container.id = "sm-gui-container";
        container.style.position = 'absolute';
        container.style.top = '50px';
        container.style.left = '50px';
        container.style.zIndex = '1000';
        container.style.padding = '10px';
        container.style.backgroundColor = '#fff';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '5px';
        container.style.width = '300px';
        container.style.minWidth = '300px';
        container.style.height = '400px';
        container.style.minHeight = '200px';
        container.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        container.style.display = 'flex';
        container.style.display = guiVisible ? "flex" : "none"; // Use saved state
        container.style.flexDirection = 'column';
        container.style.resize = 'both';
        container.style.overflow = 'auto';
        container.style.justifyContent = 'space-between';

        let isDragging = false;
        let offsetX, offsetY;



        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '10px';

        const title = document.createElement('h4');
        title.textContent = 'Segment Grouper';
        title.style.margin = '0';
        title.style.userSelect = 'none'; // Prevent text selection
        header.appendChild(title);



        const resetButton = document.createElement('button');
        resetButton.innerHTML = '<i class="fa fa-rotate-right"></i>';
        resetButton.style.padding = '5px';
        resetButton.addEventListener('click', () => resetGroups(wmeSDK));
        header.appendChild(resetButton);

        container.appendChild(header);

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - container.getBoundingClientRect().left;
            offsetY = e.clientY - container.getBoundingClientRect().top;
            header.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                container.style.left = `${e.clientX - offsetX}px`;
                container.style.top = `${e.clientY - offsetY}px`;
            }
        });

        const savedPosition = JSON.parse(localStorage.getItem("sm-gui-position"));
        if (savedPosition) {
            container.style.left = `${savedPosition.left}px`;
            container.style.top = `${savedPosition.top}px`;
        }

        // Load saved size
        const savedSize = JSON.parse(localStorage.getItem("sm-gui-size"));
        if (savedSize) {
            container.style.width = `${savedSize.width}px`;
            container.style.height = `${savedSize.height}px`;
        }

        // Save size on resize
        const resizeObserver = new ResizeObserver(() => {
            localStorage.setItem(
                "sm-gui-size",
                JSON.stringify({
                    width: container.offsetWidth,
                    height: container.offsetHeight,
                })
            );
        });
        resizeObserver.observe(container);

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                localStorage.setItem(
                    "sm-gui-position",
                    JSON.stringify({
                        left: container.offsetLeft,
                        top: container.offsetTop,
                    })
                );
            }
            isDragging = false;
            header.style.cursor = 'grab';

        });

        const nameInput = document.createElement('input');
        nameInput.id = 'group-name';
        nameInput.placeholder = 'Group Name';
        nameInput.style.marginBottom = '5px';
        nameInput.style.width = '100%';
        container.appendChild(nameInput);

        const commentAndColorContainer = document.createElement('div');
        commentAndColorContainer.style.display = 'flex';
        commentAndColorContainer.style.justifyContent = 'space-between';
        commentAndColorContainer.style.alignItems = 'center';

        // Location and Direction Container (on the same line)
        const locationDirectionContainer = document.createElement('div');
        locationDirectionContainer.style.display = 'flex';
        locationDirectionContainer.style.justifyContent = 'space-between';
        locationDirectionContainer.style.marginBottom = '5px';

        // Location Input
        const locationInput = document.createElement('input');
        locationInput.id = 'group-location';
        locationInput.placeholder = 'Location';
        locationInput.style.width = '48%'; // Adjust width for inline display
        locationDirectionContainer.appendChild(locationInput);

        // Direction Input
        const directionInput = document.createElement('input');
        directionInput.id = 'group-direction';
        directionInput.placeholder = 'Direction';
        directionInput.style.width = '48%'; // Adjust width for inline display
        locationDirectionContainer.appendChild(directionInput);

        container.appendChild(locationDirectionContainer);

        // Tags Input (on its own line)
        const tagsInput = document.createElement('input');
        tagsInput.id = 'group-tags';
        tagsInput.placeholder = 'Tags (comma-separated)';
        tagsInput.style.marginBottom = '5px';
        tagsInput.style.width = '100%';
        container.appendChild(tagsInput);

        const commentInput = document.createElement('textarea');
        commentInput.id = 'group-comment';
        commentInput.placeholder = 'Comment';
        commentInput.style.resize = 'none';
        commentInput.style.width = 'calc(100% - 50px)';
        commentInput.style.marginRight = '5px';
        commentAndColorContainer.appendChild(commentInput);

        const colorInput = document.createElement('input');
        colorInput.id = 'group-color';
        colorInput.type = 'color';
        colorInput.style.width = '50px';
        colorInput.value = '#000000';
        commentAndColorContainer.appendChild(colorInput);

        container.appendChild(commentAndColorContainer);

        const saveButton = document.createElement('button');
        saveButton.innerText = 'Add Group';
        saveButton.style.marginTop = '10px';
        saveButton.style.marginBottom = '10px';
        saveButton.addEventListener('click', () => {
            addGroup(wmeSDK, nameInput.value, locationInput.value, directionInput.value, tagsInput.value, colorInput.value, commentInput.value);
        });
        container.appendChild(saveButton);

        const groupList = document.createElement('div');
        groupList.id = 'group-list';
        groupList.style.border = '1px solid #ccc';
        groupList.style.borderRadius = '3px';
        groupList.style.flexGrow = '1';
        groupList.style.overflowY = 'auto';
        groupList.style.padding = '5px';
        container.appendChild(groupList);

        const buttonRow = document.createElement('div');
        buttonRow.style.display = 'flex';
        buttonRow.style.justifyContent = 'space-between';

        const importButton = document.createElement('button');
        importButton.innerText = 'Import';
        importButton.style.marginTop = '10px';
        importButton.style.padding = '5px';
        importButton.style.cursor = 'pointer';
        importButton.addEventListener('click', () => importGeoJSON(wmeSDK));
        buttonRow.appendChild(importButton);

        const versionText = document.createElement('div');
        versionText.style.display = 'flex'; // Use flexbox on the versionText container itself
        versionText.style.alignItems = 'center'; // Vertically center
        versionText.style.justifyContent = 'center'; // Horizontally center
        versionText.style.height = '100%'; // Ensure it takes up the full height of its parent container
        versionText.style.fontSize = '12px';
        versionText.style.color = '#666';
        versionText.style.marginTop = '5px';
        versionText.style.cursor = 'pointer';
        versionText.title = 'by DiffLok';
        versionText.innerText = `v${version}`;
        buttonRow.appendChild(versionText);

        const exportButton = document.createElement('button');
        exportButton.innerText = 'Export';
        exportButton.style.marginTop = '10px';
        exportButton.style.padding = '5px';
        exportButton.style.cursor = 'pointer';
        exportButton.addEventListener('click', () => exportGeoJSON(wmeSDK));
        buttonRow.appendChild(exportButton);

        container.appendChild(buttonRow);

        document.body.appendChild(container);

        console.log('WMESG: Initialised.');
    }

    function exportGeoJSON(wmeSDK) {
        const geoJson = {
            type: 'FeatureCollection',
            features: groups.map((group, index) => ({
                type: 'Feature',
                properties: {
                    id: group.id,
                    name: group.name,
                    location: group.location,
                    direction: group.direction,
                    tags: group.tags,
                    color: group.color,
                    comment: group.comment,
                    order: index,
                    segments: group.segments,
                },
                geometry: {
                    type: 'MultiLineString',
                    coordinates: group.segments.map(segmentId => {
                        const segment = wmeSDK.DataModel.Segments.getById({ segmentId });
                        return segment.geometry.coordinates;
                    }),
                },
            })),
        };

        const blob = new Blob([JSON.stringify(geoJson, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'groups.geojson';
        a.click();
        URL.revokeObjectURL(url);
    }

    function importGeoJSON(wmeSDK) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.geojson';
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const data = JSON.parse(e.target.result);
                    if (data.features) {
                        groups.length = 0; // Clear existing groups
                        data.features.sort((a, b) => a.properties.order - b.properties.order); // Sort by order
                        data.features.forEach((feature) => {
                            groups.push({
                                id: feature.properties.id,
                                name: feature.properties.name,
                                location: feature.properties.location,
                                direction: feature.properties.direction,
                                tags : feature.properties.tags,
                                color: feature.properties.color,
                                comment: feature.properties.comment,
                                segments: feature.properties.segments,
                            });
                        });
                        updateGroupList(wmeSDK);
                    }
                };
                reader.readAsText(file);
            }
        });
        input.click();
    }
})();
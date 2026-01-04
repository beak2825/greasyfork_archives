// ==UserScript==
// @name         Sniffies Save Profiles
// @namespace    LiveCamShow.scripts
// @version      1.5
// @description  Adds a "Save Profile" button to profiles and a professional GUI to manage saved profiles in a table format. Allows editing the profile title before saving.
// @author       LiveCamShow
// @match        *://sniffies.com/*
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/525307/Sniffies%20Save%20Profiles.user.js
// @updateURL https://update.greasyfork.org/scripts/525307/Sniffies%20Save%20Profiles.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getSavedProfiles() {
        return JSON.parse(localStorage.getItem('savedProfiles')) || [];
    }

    function setSavedProfiles(profiles) {
        localStorage.setItem('savedProfiles', JSON.stringify(profiles));
    }
    // Save profile data
    const saveProfile = (profileUrl, profileHeader, profileImage) => {
        let savedProfiles = getSavedProfiles();
        const profileExists = savedProfiles.some((profile) => profile.url === profileUrl);

        if (!profileExists) {
            savedProfiles.push({ url: profileUrl, header: profileHeader, image: profileImage });
            setSavedProfiles(savedProfiles);
            alert(`Profile saved: ${profileHeader}`);
        } else {
            alert('Profile already saved!');
        }
    };

    // Display save popup
    const showSavePopup = (profileUrl, profileHeader, profileImage) => {
        // Create the backdrop for click detection
        const backdrop = document.createElement('div');
        Object.assign(backdrop.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: '9999',
        });


        // Popup Container
        const popupContainer = document.createElement('div');
        Object.assign(popupContainer.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '10000',
            backgroundColor: '#0f1e35',
            color: '#d4d9e4',
            borderTop: '4px solid #4b84e6',
            borderBottom: '4px solid #4b84e6',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(14, 22, 33, .25)',
            padding: '20px',
            width: '300px',
        });

        const titleLabel = document.createElement('label');
        titleLabel.textContent = 'Edit Profile Title:';
        titleLabel.style.display = 'block';
        titleLabel.style.marginBottom = '10px';

        const titleInput = document.createElement('input');
        Object.assign(titleInput, {
            type: 'text',
            value: profileHeader
        });
        Object.assign(titleInput.style, {
            width: '100%',
            marginBottom: '20px',
            padding: '5px',
            border: '1px solid #ccc',
            borderRadius: '4px'
        });

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.marginRight = '10px';
        saveButton.addEventListener('click', () => {
            saveProfile(profileUrl, titleInput.value, profileImage);
            backdrop.remove();
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', () => backdrop.remove());

        popupContainer.append(titleLabel, titleInput, saveButton, cancelButton);
        backdrop.appendChild(popupContainer);
        document.body.appendChild(backdrop);

        // Close popup on clicking outside
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                backdrop.remove();
            }
        });
    };


    // Open Saved Profiles GUI
    const openSavedProfilesGUI = () => {
        const savedProfiles =  getSavedProfiles();

        // Create a backdrop to capture outside clicks
        const backdrop = document.createElement('div');
        Object.assign(backdrop.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: '9999',
        });

        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                backdrop.remove();
            }
        });



        const guiContainer = document.createElement('div');
        Object.assign(guiContainer.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '10000',
            padding: '20px',
            width: '600px',
            height: '400px',
            overflowY: 'auto',
            backgroundColor: '#0f1e35',
            color: '#d4d9e4',
            borderTop: '4px solid #4b84e6',
            borderBottom: '4px solid #4b84e6',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(14, 22, 33, .25)',
        });

          backdrop.appendChild(guiContainer);
          document.body.appendChild(backdrop);
        const header = document.createElement('div');
        Object.assign(header.style, {
            display: 'flex',
            justifyContent: 'space-between', // Aligns elements to opposite sides
            alignItems: 'center', // Vertically center the text and button
            marginBottom: '10px',
            width: '100%' // Ensure the container takes up the full width
        });

        const headerText = document.createElement('span');
        headerText.textContent = 'Saved Profiles';
        headerText.style.fontWeight = 'bold';
        headerText.style.fontSize = '1.2em';

        // Create the close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '<i class="fa fa-times"></i>'; // Using Font Awesome icon
        Object.assign(closeButton.style, {
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '1.2em',
            cursor: 'pointer',
        });

        // Close button functionality
        closeButton.addEventListener('click', () => guiContainer.remove());

        // Append both elements to the header
        header.appendChild(headerText);
        header.appendChild(closeButton);


        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.tableLayout = 'fixed'; // Prevents columns from resizing dynamically
        table.style.borderCollapse = 'collapse';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['Image', 'Title', 'Actions'].forEach((text, index) => {
            const th = document.createElement('th');
            th.textContent = text;
            Object.assign(th.style, {
                borderBottom: '4px solid #4b84e6',
                borderRadius: '2px',
                boxShadow: '0 4px 12px rgba(14, 22, 33, .25)',
                padding: '10px',
                paddingRight: index === 0 ? '30px' : '10px',
                paddingLeft: index === 2 ? '0px' : '10px',
                textAlign: index === 1 ? 'left' : 'center', // Center headers horizontally
                fontWeight: 'bold',
                width: index ===  1 ? '355px' : 'auto'
            });
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        savedProfiles.forEach((profile) => {
            const row = document.createElement('tr');
            Object.assign(row.style, {
                backgroundColor: '#000000',
                borderBottom: '4px solid #07101e',
                color: '#d4d9e4',
            });

            const imgCell = document.createElement('td');
            imgCell.style.padding = '10px';
            imgCell.style.paddingRight = '30px';
            imgCell.style.textAlign = 'center'; // Centers the image horizontally
            const img = document.createElement('img');
            Object.assign(img, {
                src: profile.image,
                alt: 'Profile Picture',
            });
            Object.assign(img.style, {
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                cursor: 'pointer',
            });


            // Click event to open overlay
            img.addEventListener('click', () => {
                const overlay = document.createElement('div');
                Object.assign(overlay.style, {
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: '10001',
                });

                const fullImg = document.createElement('img');
                fullImg.src = profile.image.replace('-thumb', ''); // Removes "-thumb" from image URL
                Object.assign(fullImg.style, {
                    maxWidth: '90%',
                    maxHeight: '90%',
                    borderRadius: '8px',
                });

                overlay.appendChild(fullImg);

                // Close overlay on click
                overlay.addEventListener('click', () => overlay.remove());
                document.body.appendChild(overlay);
            });

            imgCell.appendChild(img);

            const titleCell = document.createElement('td');
            titleCell.textContent = profile.header;
            titleCell.style.padding = '10px';
            titleCell.style.width = '355px';  // Title column width

            const actionsCell = document.createElement('td');
            actionsCell.style.padding = '10px';
            actionsCell.style.paddingLeft = '0px';
            actionsCell.style.textAlign = 'left'; // Align actions (buttons) to the left

            const actionsContainer = document.createElement('div'); // Action buttons container
            actionsContainer.style.display = 'flex';
            actionsContainer.style.gap = '1px';

            // View icon button
            const viewIcon = document.createElement('button');
            viewIcon.innerHTML = '<i class="fa fa-eye"></i>';
            viewIcon.title = 'View Profile';
            viewIcon.addEventListener('click', () => window.open(profile.url, '_blank'));
            actionsContainer.appendChild(viewIcon);

            // Delete icon button
            const deleteIcon = document.createElement('button');
            deleteIcon.innerHTML = '<i class="fa fa-trash"></i>';
            deleteIcon.title = 'Delete Profile';
            deleteIcon.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this profile?')) {
                    const updatedProfiles = savedProfiles.filter((p) => p.url !== profile.url);
                    setSavedProfiles(savedProfiles);
                    guiContainer.remove();
                    openSavedProfilesGUI();
                }
            });
            actionsContainer.appendChild(deleteIcon);

            // Edit icon button for changing profile title
            const editIcon = document.createElement('button');
            editIcon.innerHTML = '<i class="fa fa-edit"></i>';
            editIcon.title = 'Edit Title';
            editIcon.addEventListener('click', () => {
                const newTitle = prompt('Edit Profile Title:', profile.header);
                if (newTitle) {
                    profile.header = newTitle;
                    setSavedProfiles(savedProfiles);
                    guiContainer.remove();
                    openSavedProfilesGUI();
                }
            });
            actionsContainer.appendChild(editIcon);

            // Notes icon button for sticky note
            const notesIcon = document.createElement('button');
            notesIcon.innerHTML = '<i class="fa fa-sticky-note"></i>';
            notesIcon.title = 'Add Notes';
            notesIcon.addEventListener('click', () => {
                const notePopup = document.createElement('div');
                Object.assign(notePopup.style, {
                    position: 'fixed',
                    top: '20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: '10001',
                    backgroundColor: '#fffb8f',
                    color: '#333',
                    padding: '15px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    width: '300px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    fontFamily: 'Arial, sans-serif',
                });

                const noteText = document.createElement('textarea');
                noteText.value = profile.notes || '';
                Object.assign(noteText.style, {
                    width: '100%',
                    height: '100px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                });

                const saveNoteButton = document.createElement('button');
                saveNoteButton.textContent = 'Save';
                Object.assign(saveNoteButton.style, {
                    marginTop: '10px',
                    marginRight: '10px',
                    padding: '5px 10px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                });

                const closeNoteButton = document.createElement('button');
                closeNoteButton.textContent = 'Close';
                Object.assign(closeNoteButton.style, {
                    padding: '5px 10px',
                    backgroundColor: '#6c757d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                });

                saveNoteButton.addEventListener('click', () => {
                    profile.notes = noteText.value;
                    setSavedProfiles(savedProfiles);
                    alert('Notes saved!');
                    notePopup.remove();
                });

                closeNoteButton.addEventListener('click', () => notePopup.remove());

                notePopup.append(noteText, saveNoteButton, closeNoteButton);
                document.body.appendChild(notePopup);
            });
            actionsContainer.appendChild(notesIcon);


            actionsCell.appendChild(actionsContainer);

            row.append(imgCell, titleCell, actionsCell);
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        guiContainer.append(header, table);
    };

    // Add "Save Profile" button
    const addSaveButtonToProfiles = () => {
        const profileButtons = document.querySelectorAll('[data-testid="pinUserButton"]');
        profileButtons.forEach((button) => {
            if (button.parentNode.querySelector('#saveProfileButton')) return;

            const saveButton = document.createElement('button');
            Object.assign(saveButton, {
                id: 'saveProfileButton',
                type: 'button',
                'aria-label': 'Save Profile',
                innerHTML: '<i class="fa fa-save controls-icon text-size: 25px;"></i>'
            });
            Object.assign(saveButton, {
                width: '34xp',
                height: '40px',
            })

            saveButton.addEventListener('click', (event) => {
                const profileUrl = window.location.href;
                const profileHeader = document.querySelector('[data-testid="cruiserProfileLabel"].header-text')?.textContent.trim() || 'Unknown Profile';
                const profileImageContainer = document.querySelector('.profile-image-container');
                const profileImageUrl = profileImageContainer?.style.backgroundImage.match(/url\("(.*)"\)/)?.[1];
                const profileImageThumbnail = profileImageUrl?.replace('.jpeg', '-thumb.jpeg') || '';

                showSavePopup(profileUrl, profileHeader, profileImageThumbnail);
            });

            button.parentNode.insertBefore(saveButton, button);
        });
    };

    // Add GUI button to map controls
    const addGUIButtonToMap = () => {
        const travelModeIcon = document.querySelector('[data-testid="travelModeIcon"]');
        if (!travelModeIcon || document.getElementById('openGUIButton')) return;

        const guiButton = document.createElement('button');
      
        Object.assign(guiButton, {
            id: 'openGUIButton',
            type: 'button',
            'aria-label': 'Open Saved Profiles GUI',
            innerHTML: '<i class="fa fa-list controls-icon" style="font-size: 25px;"></i>'
        });

        Object.assign(guiButton.style, {
            width: '50px',
            height: '50px',
            color: '#fff',
            cursor: 'pointer',
        });

        guiButton.addEventListener('click', (event) => {

            event.preventDefault();
            event.stopPropagation();
            openSavedProfilesGUI();
        });

        travelModeIcon.parentNode.insertBefore(guiButton, travelModeIcon);
    }

    // Observe DOM changes
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const debouncedObserverCallback = debounce(() => {
        addSaveButtonToProfiles();
        addGUIButtonToMap();
    }, 100);
    const observer = new MutationObserver(debouncedObserverCallback);
    observer.observe(document.body, { childList: true, subtree: true });

})();

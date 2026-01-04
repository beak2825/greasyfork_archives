// ==UserScript==
// @name         WK Book Club Tracker
// @namespace    http://tampermonkey.net/
// @version      0.7.1
// @description  Add a panel to the WK Readers page to track book club progress
// @author       leohumnew
// @match        https://www.wanikani.com/*
// @match        https://community.wanikani.com/*
// @match        https://forums.learnnatively.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @require      https://greasyfork.org/scripts/489759-wk-custom-icons/code/CustomIcons.js?version=1398802
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477424/WK%20Book%20Club%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/477424/WK%20Book%20Club%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*  1. Helper functions
        2. Dashboard
        3. Readers
            a. Syling
            b. Book club panel
            c. Load / save
            d. Popup menu
        4. Main script
        5. Community Pages */

    // ------------------ HELPER FUNCTIONS ------------------
    function createButton(text, clickHandler) { // Create a button with the given text and click handler
        let button = document.createElement('button');
        button.innerHTML = text;
        button.addEventListener("click", clickHandler);
        return button;
    }

    function dateFromString(dateString) { // Create a date object from a string in the format "YYYY-MM-DD"
        let date = new Date();
        date.setDate(dateString.substring(8, 10));
        date.setMonth(dateString.substring(5, 7) - 1);
        date.setFullYear(dateString.substring(0, 4));
        date.setHours(12, 0, 0, 0);
        return date;
    }

    // Create a popup menu to manually add or edit a book club - used in both dashboard and community pages
    function manualAddEdit(bookClub, isCreating, canEditTitle = false) {
        // Create a container for all the text inputs, then add them with an html string to the popupForm's innerHTML
        let popupForm = document.createElement('form');
        popupForm.className = "edit-popup__form";
        popupForm.innerHTML = "<label for='title'>Title</label>" + (isCreating ? "<input type='text' id='title' name='title' placeholder='Title' required>" : "<input type='text' id='title' name='title' placeholder='Title' required value='" + bookClub.title + (canEditTitle ? "'>" : "' disabled>"));
        popupForm.innerHTML += `
            <br><label for='url'>Main Thread URL</label><input type='text' id='url' name='url' placeholder='URL' required value='` + (isCreating ? "" : bookClub.url) + `'><br>
            <label for='vocabListUrl'>Vocab List URL</label><input type='text' id='vocabListUrl' name='vocabListUrl' placeholder='URL' value='` + (isCreating ? "" : bookClub.vocabListUrl) + `'><br>
            <label for='totalPages'>Total Pages</label><input type='number' id='totalPages' name='totalPages' placeholder='Total Pages' required value=` + (isCreating ? "" : bookClub.totalPages) + `><br>
            <label for='weeksInfo'>Weeks Info</label>
        `;
        let weeksInfoContainer = document.createElement('div');
        weeksInfoContainer.id = "weeksInfo";
        popupForm.appendChild(weeksInfoContainer);
        let saveButton = createButton("Save", null);
        popupForm.addEventListener("submit", function() {
            // Check if club with the same name already exists
            if (isCreating && bookClubs.find(bookClub => bookClub.title === document.querySelector("#title").value)) return alert("A book club with that name already exists.");
            if (isCreating || canEditTitle) {
                addBookClub(
                    document.querySelector("#title").value,
                    document.querySelector("#url").value,
                    document.querySelector("#vocabListUrl").value,
                    parseInt(document.querySelector("#totalPages").value),
                    weeksInfo,
                );
            } else {
                let bookClub = getBookClub(document.querySelector("#title").value);
                bookClub.url = document.querySelector("#url").value;
                bookClub.weeksInfo = weeksInfo;
                bookClub.vocabListUrl = document.querySelector("#vocabListUrl").value;
                bookClub.totalPages = parseInt(document.querySelector("#totalPages").value);
            }
            saveBookClubs();
            location.reload();
        });
        saveButton.type = "submit";
        saveButton.className = "wk-button--default";
        popupForm.appendChild(saveButton);

        // Set up weeks info content
        let weeksInfo = isCreating ? [] : bookClub.weeksInfo;
        let newWeekForm = document.createElement('form'); // Create week adding form
        newWeekForm.innerHTML = `
            <label for='startPage'>Start Page</label><input type='number' id='startPage' name='startPage' placeholder='Start Page' required>
            <label for='startDate'>Start Date</label><input type='date' id='startDate' name='startDate' placeholder='Start Date' required>
            <button type='submit'>${(!location.href.includes("community") && !location.href.includes("forums")) ? Icons.customIconTxt("plus") : ""}</button>
            <hr style="width: 100%;">
        `;
        newWeekForm.addEventListener("submit", function(e) {
            e.preventDefault();
            let newWeekInfo = { // Create new week info object, and add it to weeksInfo in the correct position according to start date (with week 1 at the start of the array)
                completed: false,
                startPage: parseInt(document.querySelector("#startPage").value),
                startDate: document.querySelector("#startDate").value
            };
            let index = weeksInfo.findIndex(week => dateFromString(week.startDate) > dateFromString(newWeekInfo.startDate));
            if (index === -1) {
                weeksInfo.push(newWeekInfo);
            } else {
                weeksInfo.splice(index, 0, newWeekInfo);
            }

            let weeksInfoList = document.querySelector("#weeksInfo ul");
            let weekElement = document.createElement('li'); // Create new week element, and insert it in weeksInfoList in the correct position
            let date = dateFromString(newWeekInfo.startDate);
            weekElement.innerHTML = "Week <span></span> - Start Page: " + newWeekInfo.startPage + " - Start Date: " + date.toLocaleDateString();
            let deleteWeekButton = createButton("", function() { // Create delete button
                weeksInfo.splice(index < 0 ? 0 : index, 1);
                weeksInfoList.removeChild(weekElement);
                for (let i = 0; i < weeksInfoList.childNodes.length; i++) { // Loop through weeksInfoList and update week numbers
                    weeksInfoList.childNodes[i].querySelector("span").innerHTML = i + 1;
                }
            });
            deleteWeekButton.className = "delete-week-button";
            if(!location.href.includes("community") && !location.href.includes("forums")) deleteWeekButton.appendChild(Icons.customIcon("cross"));
            weekElement.appendChild(deleteWeekButton);

            if(index != -1) weeksInfoList.insertBefore(weekElement, weeksInfoList.childNodes[index]);
            else weeksInfoList.appendChild(weekElement);

            for (let i = 0; i < weeksInfoList.childNodes.length; i++) { // Loop through weeksInfoList and update week numbers
                weeksInfoList.childNodes[i].querySelector("span").innerHTML = i + 1;
            }

            newWeekForm.reset();
            document.querySelector("#startPage").focus();
        });

        let weeksInfoList = document.createElement('ul'); // Create list of weeks
        for (let i = 0; i < weeksInfo.length; i++) {
            let week = weeksInfo[i];
            let weekElement = document.createElement('li');
            let date = dateFromString(week.startDate);
            weekElement.innerHTML = "Week <span>" + (i + 1) + "</span> - Start Page: " + week.startPage + " - Start Date: " + date.toLocaleDateString();
            let deleteWeekButton = createButton("", function() { // Create delete button for each week
                weeksInfo.splice(i, 1);
                weeksInfoList.removeChild(weekElement);
                for (let i = 0; i < weeksInfoList.childNodes.length; i++) { // Loop through weeksInfoList and update week numbers
                    weeksInfoList.childNodes[i].querySelector("span").innerHTML = i + 1;
                }
            });
            deleteWeekButton.className = "delete-week-button";
            if(!location.href.includes("community") && !location.href.includes("forums")) deleteWeekButton.appendChild(Icons.customIcon("cross"));
            weekElement.appendChild(deleteWeekButton);
            weeksInfoList.appendChild(weekElement);
        }

        weeksInfoContainer.append(newWeekForm, weeksInfoList);
        return popupForm;
    }

    // ----------- Load, save, add and delete book clubs from userscript storage -----------
    function loadBookClubs() {
        return GM_getValue("WaniKaniBookClubs", []);
    }
    function saveBookClubs() {
        GM_setValue("WaniKaniBookClubs", bookClubs);
    }
    function addBookClub(title, url, vocabListUrl, totalPages, weeksInfo) {
        bookClubs.push({
            title: title,
            url: url,
            vocabListUrl: vocabListUrl,
            totalPages: totalPages,
            weeksInfo: weeksInfo,
            active: true
        });
        saveBookClubs();
    }
    function deleteBookClub(title) { // Remove element using .splice() to avoid creating a new array
        let index = bookClubs.findIndex(bookClub => bookClub.title === title);
        bookClubs.splice(index, 1);
        saveBookClubs();
    }
    function toggleBookClubWeek(bookClubTitle, weekNumber) {
        let bookClub = getBookClub(bookClubTitle);
        bookClub.weeksInfo[weekNumber - 1].completed = !bookClub.weeksInfo[weekNumber - 1].completed;
        saveBookClubs();
    }
    // Get a specific book club from the list of book clubs by name
    function getBookClub(title) {
        return bookClubs.find(bookClub => bookClub.title === title);
    }

    // Main book clubs array
    let bookClubs;
    Icons.setUpSVGElements();

    // ------------------ DASHBOARD ------------------
    if (!location.href.includes("community") && !location.href.includes("forums") && (location.pathname == "/dashboard" || location.pathname == "/")) {

        bookClubs = loadBookClubs();

        // Create and add styles to page
        let style1 = document.createElement('style');
        style1.innerHTML += `
        #book-clubs-container { background-color: var(--color-wk-panel-background); border-radius: 7px; padding: 10px; height: fit-content; overflow-y: auto; margin: var(--spacing-xloose, 32px) 0; } #book-clubs-container h3, #book-clubs-container p { margin: 0; }
        #book-clubs-container .header-button { background-color: transparent; width: fit-content; padding: 2px 8px } #book-clubs-container > div { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px } #book-clubs-container > div > h2 { margin: 0; font-size: 22px } #book-clubs-container > div > h2 > button {border: none; color: var(--color-text-mid)} /* Header buttons and title */
        
        .book-clubs-list { display: flex; flex-direction: row; flex-wrap: wrap; justify-content: space-between; gap: 12px; margin-bottom: 0; background-color: var(--color-wk-panel-background); } :root {--color-correct-light: color-mix(in srgb, var(--color-correct, #18811d), white); --color-incorrect-light: color-mix(in srgb, var(--color-incorrect, #811818), white); --color-tertiary-fix: var(--color-tertiary, #3b97f1); --color-menu-fix: var(--color-menu, #f5f5f5); }
        .book-club { background-color: var(--color-wk-panel-content-background); border-radius: 7px; padding: 12px; width: calc(100% - 24px); }
        .book-club .reader-summary__title { font-size: 1.5rem; margin-right: auto; }
        .book-club .reader-summary__status button { text-decoration: underline; cursor: pointer; background: none; padding: 0; border: none; margin-top: -3px; } .book-club .reader-summary__status a { text-decoration: underline } /* Book club active/inactive button and vocab sheet button */
        .book-club .reader-summary__status button:hover, .book-club .reader-summary__status a:hover { color: var(--color-tertiary-fix) !important; } /* Book club active/inactive button and vocab sheet button hover */
        .action-button { margin-left: 10px; background: none; font-size: 1.5rem; cursor: pointer; color: var(--color-text-mid, gray); border: none; padding: 0; } .action-button:hover { color: var(--color-tertiary-fix); } /* Delete book club button */
        .book-club:first-child .up-button { display: none; } .book-club:last-child .down-button { display: none; } /* Hide up/down buttons for first/last book clubs */
        
        .book-club-weeks.full-size { display: grid; grid-template-columns: repeat(auto-fill, minmax(10rem, 18%)); grid-gap: 1rem; justify-content: space-between; margin-top: 15px; } /* Weeks container - full size */
        .book-club-weeks.compact-size { display: grid; grid-auto-flow: column; grid-gap: 1rem; grid-auto-columns: 12.5rem; overflow-x: auto; padding: 5px; scroll-snap-type: inline mandatory; scrollbar-width: none; mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent); } /* Weeks container - compact size */
        .book-club-weeks.compact-size::-webkit-scrollbar { display: none; } /* Hide scrollbar for compact size */
        .book-club-weeks__container { margin-top: 10px; } /* Weeks container */
        .book-club-weeks__container:has(.book-club-weeks.compact-size) { display: grid; grid-template-columns: 2em 1fr 2em; align-items: center; & button {margin-left: 0; } } /* Weeks container - compact size */
        .book-club-weeks.compact-size .book-club-week:not(.fake-week) { scroll-snap-align: center; } /* Weeks - compact size */
        .book-club-weeks h4 { color: var(--color-text); filter: opacity(0.5); margin: 0; }
        .book-club-week { background-color: var(--color-wk-panel-background); border-radius: 4px; padding: 12px 16px; cursor: pointer; border: var(--color-text-mid, 1px solid #DDD); }
        .book-club-week:hover { outline: 1px dashed var(--color-tertiary-fix); }
        .book-club-week--missed h3 { font-weight: 600; color: var(--color-incorrect-light); }
        .book-club-week--completed h3 { font-weight: 600; color: var(--color-correct-light); }
        .book-club-week--active { font-weight: 600; border: 1px solid var(--color-tertiary-fix); } .book-club-week--active p { font-weight: normal; }
        .book-club-week--inactive { filter: opacity(0.5); border: var(--color-text-mid, 1px solid #BBB); }

        .edit-popup button:not(.wk-button--default) { cursor: pointer; border: none; background: transparent } /* Popup buttons */
        .edit-popup { background-color: var(--color-menu-fix); border-radius: 7px; padding: var(--spacing-loose); width: 50%; height: 50%; overflow-y: auto; }
        .edit-popup h2 { text-align: center; font-size: 2rem; margin-bottom: var(--spacing-loose); } .edit-popup .action-button { position: absolute; top: 1em; right: 1em; } /* Popup title and close button */
        #book-club-create-choice-popup .popup-buttons { width: 100%; display: flex; flex-direction: column; } #book-club-create-choice-popup .popup-buttons button { margin: 10px; font-size: var(--font-size-large); } /* Popup add/edit buttons */
        .edit-popup__form > textarea { margin-bottom: var(--spacing-tight); margin-top: var(--spacing-tight); padding: 3px; border-radius: 4px; width: 100%; height: 200px; resize: none; } /* Popup form textarea for JSON input */
        .edit-popup__form > input { margin-bottom: var(--spacing-tight); padding: 3px; border-radius: 4px; background-color: var(--color-wk-panel-content-background); color: var(--color-text) } /* Popup form input */
        .edit-popup__form input:focus { outline: 1px solid var(--color-tertiary-fix); }
        .edit-popup__form > label { font-weight: 600; }
        .edit-popup #weeksInfo { background-color: var(--color-wk-panel-content-background); padding: 15px; border-radius: 7px; margin: 10px 0; } #weeksInfo li { margin-bottom: 5px; } /* Popup weeks info */
        .edit-popup #weeksInfo form { display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 15px; } /* Popup weeks info form for adding weeks */
        .edit-popup #weeksInfo form button { padding: 3px; border-radius: 4px; margin-left: auto; } .edit-popup #weeksInfo ul button { padding: 3px; border-radius: 4px; margin-left: 10px; } #weeksInfo input { padding: 3px; border-radius: 4px; background-color: var(--color-menu-fix); } /* Popup weeks info form button and input */
        .edit-popup__form > button { margin: auto; width: 100%; } /* Popup save button */
        #settings-popup label { float: left; margin: 0 } #settings-popup input, #settings-popup select { margin: 3px 0 25px 10px; } /* Settings popup */
        `;
        if (GM_getValue("WaniKaniBookClubsLimitVerticalVisible", false)) style1.innerHTML += "#book-clubs-container { max-height: 500px; }"
        document.head.appendChild(style1);

        // Create the header for a "panel" (section with title + content)
        function createPanelHeader(text, button, titleButton) {
            let panelTitle = document.createElement('div');
            panelTitle.style.position = "relative";
            let panelTitleText = document.createElement('h2');
            panelTitleText.innerHTML = text;
            if(titleButton) {
                titleButton.className += "header-button wk-button wk-button--default";
                panelTitleText.appendChild(titleButton);
            }
            panelTitle.appendChild(panelTitleText);
            if (button) { // If a button was passed in, add it to the right of the h2 element
                button.className += "header-button wk-button wk-button--default";
                panelTitle.appendChild(button);
            }
            return panelTitle;
        }

        // Create a panel body
        function createPanelBody(className) {
            let panelBody = document.createElement('section');
            panelBody.className = className;
            return panelBody;
        }

        function swapBookClubsPositions(index1, index2) {
            let temp = bookClubs[index1];
            bookClubs[index1] = bookClubs[index2];
            bookClubs[index2] = temp;
        }

        // Create the panel for an individual book club
        function createBookClubPanel(bookClubInfo) {
            let bookClubPanel = document.createElement('div'); // Create a container div for the book club panel
            bookClubPanel.className = "book-club";

            let bookClubHeader = document.createElement('div'); // Create the header with the title and delete button
            bookClubHeader.style = "display: flex; position: relative;";
            let bookClubTitle = document.createElement('a');
            bookClubTitle.className = "reader-summary__title";
            bookClubTitle.href = bookClubInfo.url;
            bookClubTitle.target = "_blank";
            bookClubTitle.innerHTML = bookClubInfo.title;
            bookClubHeader.appendChild(bookClubTitle);

            // Create an up and down button to change the order of the book clubs, but only show up button if not first book club, and only show down button if not last book club
            let upButton = createButton("", function() {
                swapBookClubsPositions(bookClubs.indexOf(bookClubInfo), bookClubs.indexOf(bookClubInfo) - 1);
                saveBookClubs();
                // Swap the book clubs in the DOM
                let previousSibling = bookClubPanel.previousSibling;
                bookClubPanel.remove();
                bookClubsList.insertBefore(bookClubPanel, previousSibling);
            });
            upButton.title = "Move Up";
            upButton.className = "up-button action-button";
            upButton.appendChild(Icons.customIcon("chevron-up"));
            upButton.style = "font-size: large; ";
            bookClubHeader.appendChild(upButton);

            let downButton = createButton("", function() {
                swapBookClubsPositions(bookClubs.indexOf(bookClubInfo), bookClubs.indexOf(bookClubInfo) + 1);
                saveBookClubs();
                // Swap the book clubs in the DOM
                let nextSibling = bookClubPanel.nextSibling;
                nextSibling.remove();
                bookClubsList.insertBefore(nextSibling, bookClubPanel);
            });
            downButton.title = "Move Down";
            downButton.className = "down-button action-button";
            downButton.appendChild(Icons.customIcon("chevron-down"));
            downButton.style = "font-size: large;";
            bookClubHeader.appendChild(downButton);

            let editButton = createButton("", function() { // Create the edit button
                showBookClubEditPopup(false, bookClubInfo.title);
            });
            editButton.title = "Edit";
            editButton.className = "action-button";
            editButton.appendChild(Icons.customIcon("edit"));
            editButton.style = "font-size: large;";

            let deleteButton = createButton("", function() { // Create the delete button
                if (confirm("Are you sure you want to delete this book club?")) deleteBookClub(bookClubInfo.title);
                bookClubPanel.remove();
            });
            deleteButton.title = "Delete";
            deleteButton.className = "action-button";
            deleteButton.appendChild(Icons.customIcon("cross"));
            bookClubHeader.append(editButton, deleteButton);

            let bookClubSubTitle = document.createElement('span'); // Create the subtitle with the vocab list link and active status
            bookClubSubTitle.className = "reader-summary__status";
            if (bookClubInfo.vocabListUrl !== "")bookClubSubTitle.innerHTML = "<a target='_blank' href='" + bookClubInfo.vocabListUrl + "'>Vocab List</a> | ";
            let activeButton = createButton(bookClubInfo.active ? "Active" : "Inactive", function() {
                bookClubInfo.active = !bookClubInfo.active;
                saveBookClubs();
                // Create new copy of this book club and replace the old one
                let newBookClubPanel = createBookClubPanel(bookClubInfo);
                bookClubPanel.replaceWith(newBookClubPanel);
            });
            activeButton.style.color += (bookClubInfo.active ? "var(--color-correct-light)" : "var(--color-incorrect-light)");
            bookClubSubTitle.appendChild(activeButton);

            let bookClubWeeksContainer = document.createElement('div'); // Create a container div for the weeks or an "Inactive" message if the book club is inactive
            bookClubWeeksContainer.className = "book-club-weeks__container";

            let bookClubWeeks = document.createElement('div'); // Create a container div for the weeks or an "Inactive" message if the book club is inactive
            bookClubWeeks.className = "book-club-weeks";
            if (GM_getValue("WaniKaniBookClubsCompactMode", true)) bookClubWeeks.className += " compact-size"; // If compact mode is enabled, add the full-size class to the weeks container
            else bookClubWeeks.className += " full-size";

            if (!bookClubInfo.active) {
                // Check if all weeks are complete
                let allWeeksComplete = true;
                for (let i = 0; i < bookClubInfo.weeksInfo.length; i++) {
                    if (!bookClubInfo.weeksInfo[i].completed) {
                        allWeeksComplete = false;
                        break;
                    }
                }
                let inactiveMessage = document.createElement('h4');
                inactiveMessage.innerHTML = allWeeksComplete ? "Completed 🎉" : "Inactive Book Club";
                bookClubWeeksContainer.appendChild(inactiveMessage);
            } else {
                for (let i = 0; i < bookClubInfo.weeksInfo.length; i++) { // Loop over each week and add it to the container
                    bookClubWeeks.appendChild(createWeekInfo(bookClubInfo, i));
                }
                // If compact mode is enabled, add two blank weeks at the end and start of the weeks container as padding
                if (GM_getValue("WaniKaniBookClubsCompactMode", true)) {
                    for (let i = 0; i < 3; i++) bookClubWeeks.prepend(createWeekInfo(bookClubInfo, -1));
                    for (let i = 0; i < 3; i++) bookClubWeeks.append(createWeekInfo(bookClubInfo, -1));
                }
                bookClubWeeksContainer.appendChild(bookClubWeeks);
            }

            if (GM_getValue("WaniKaniBookClubsCompactMode", true) && bookClubInfo.active) { // If compact mode is enabled, add scroll buttons before and after the weeks scroller
                let scrollLeftButton = createButton("", function() {
                    bookClubWeeks.scrollBy({left: -bookClubWeeks.firstChild.offsetWidth, behavior: "smooth"});
                });
                scrollLeftButton.className = "action-button";
                scrollLeftButton.appendChild(Icons.customIcon("chevron-left"));
                scrollLeftButton.style = "font-size: large;";
                let scrollRightButton = createButton("", function() {
                    bookClubWeeks.scrollBy({left: bookClubWeeks.firstChild.offsetWidth, behavior: "smooth"});
                });
                scrollRightButton.className = "action-button";
                scrollRightButton.appendChild(Icons.customIcon("chevron-right"));
                scrollRightButton.style = "font-size: large;";
                bookClubWeeksContainer.prepend(scrollLeftButton);
                bookClubWeeksContainer.append(scrollRightButton);
            }

            bookClubPanel.append(bookClubHeader, bookClubSubTitle, bookClubWeeksContainer); // Append the header, subtitle and weeks to the book club panel
            return bookClubPanel;
        }

        function createWeekInfo(bookClubInfo, i) { // Create the div for a week in a book club
            let week = document.createElement('div'); // Create a div for the week and add a click handler to toggle the week's complete status
            week.className = "book-club-week";

            if (i !== -1) { // If week is not a blank week
                week.addEventListener("click", function() {
                    toggleBookClubWeek(bookClubInfo.title, i + 1);
                    week.replaceWith(createWeekInfo(bookClubInfo, i));
                });

                let weekTitle = document.createElement('h3'); // Create a title and info for the week
                weekTitle.innerHTML = "Week " + (i + 1);

                let weekInfo = document.createElement('p');
                weekInfo.innerHTML = "Pages: " + bookClubInfo.weeksInfo[i].startPage + " - " + (bookClubInfo.weeksInfo[i+1] ? bookClubInfo.weeksInfo[i+1].startPage - 1 : bookClubInfo.totalPages);
                weekInfo.innerHTML += "<br>Start Date: " + dateFromString(bookClubInfo.weeksInfo[i].startDate).toLocaleDateString();

                // Set week class depending on date and "complete" field
                let today = new Date();
                let nextWeekStartDate = i < bookClubInfo.weeksInfo.length - 1 ? dateFromString(bookClubInfo.weeksInfo[i + 1].startDate) : null;
                if (bookClubInfo.weeksInfo[i].completed) { // If week is completed, add completed class and add tick symbol to week title
                    week.className += " book-club-week--completed";
                    weekTitle.innerHTML += " <span style='float: right'>"+Icons.customIconTxt("tick")+"</span>";
                }

                if (today < dateFromString(bookClubInfo.weeksInfo[i].startDate)) { // If week is in the future, add inactive class
                    week.className += " book-club-week--inactive";
                } else if (nextWeekStartDate && today >= nextWeekStartDate && !bookClubInfo.weeksInfo[i].completed) { // If week is missed, add missed class and add exclamation symbol to week title
                    week.className += " book-club-week--missed";
                    weekTitle.innerHTML += " <span style='float: right'>"+Icons.customIconTxt("warning")+"</span>";
                } else if (bookClubInfo.active && today >= dateFromString(bookClubInfo.weeksInfo[i].startDate) && (!nextWeekStartDate || today < nextWeekStartDate)) { // If week is active, add active class
                    week.className += " book-club-week--active";
                }
                week.append(weekTitle, weekInfo); // Append the title and info to the week div
            } else { // If week is a blank week
                week.className += " book-club-week--inactive fake-week";
            }

            return week;
        }

        // ------------------ POPUP MENU ------------------
        // Create a popup menu to paste JSON
        function pasteJSON() {
            let popupForm = document.createElement('div');
            popupForm.className = "edit-popup__form";
            popupForm.innerHTML = `
                <label for='json'>JSON</label><textarea id='json' name='json' placeholder='JSON' required></textarea><br>
            `;
            let saveButton = createButton("Save", function() {
                let json = document.querySelector("#json").value;
                let bookClub = JSON.parse(json);
                // Loop through weeksInfo and add a "completed" field to each week, set to false
                bookClub.weeksInfo.forEach(week => {
                    week.completed = false;
                });
                addBookClub(bookClub.title, bookClub.url, bookClub.vocabListUrl, bookClub.totalPages, bookClub.weeksInfo);
                saveBookClubs();
                location.reload();
            });
            saveButton.className = "wk-button--default";
            popupForm.appendChild(saveButton);
            return popupForm;
        }

        // Create a popup menu to add/edit a book club
        function showBookClubEditPopup(isCreating, bookClubName) {
            let bookClub = isCreating ? null : getBookClub(bookClubName);

            let popup = document.createElement('dialog');
            popup.className = "edit-popup";
            popup.id = "book-club-create-choice-popup";

            let closeButton = createButton("", function() {
                popup.close();
                document.body.removeChild(popup);
            });
            closeButton.appendChild(Icons.customIcon("cross"));
            closeButton.className = "action-button";
            popup.appendChild(closeButton);

            let popupTitle = document.createElement('h2');
            popupTitle.innerHTML = isCreating ? "Add Book Club" : "Edit Book Club";

            if(isCreating) { // If creating, add buttons to choose manual add or to paste JSON
                let manualAddButton = createButton("Manual Add", function() {
                    popup.removeChild(popupButtons);
                    popup.appendChild(manualAddEdit(bookClub, isCreating, true));
                });
                manualAddButton.className = "wk-button--default";
                let pasteJSONButton = createButton("Paste JSON", function() {
                    popup.removeChild(popupButtons);
                    popup.appendChild(pasteJSON());
                });
                pasteJSONButton.className = "wk-button--default";
                let popupButtons = document.createElement('div');
                popupButtons.className = "popup-buttons";
                popupButtons.append(manualAddButton, pasteJSONButton);
                popup.append(popupTitle, popupButtons);
            } else {
                popup.append(popupTitle, manualAddEdit(bookClub, isCreating));
            }

            document.body.appendChild(popup);
            popup.showModal();
        }

        // Create a popup menu to change settings
        function showSettingsPopup() {
            if (!document.querySelector("#settings-popup")) {
                let settingsPopup = document.createElement('dialog');
                settingsPopup.className = "edit-popup";
                settingsPopup.id = "settings-popup";
                settingsPopup.innerHTML = `
                <h2>Settings</h2>
                <form>
                    <label for='compactMode'>Compact Mode</label><input type='checkbox' id='compactMode' name='compactMode' ` + (GM_getValue("WaniKaniBookClubsCompactMode", true) ? "checked" : "") + `><br>
                    <label for='limitVerticalVisible'>Limit Panel Height</label><input type='checkbox' id='limitVerticalVisible' name='limitVerticalVisible' ` + (GM_getValue("WaniKaniBookClubsLimitVerticalVisible", false) ? "checked" : "") + `><br>
                    <label for='bookClubsPosition'>Position</label><select id='bookClubsPosition'><option value='top' ` + (GM_getValue("WaniKaniBookClubsPosition", "bottom") === "top" ? "selected" : "") + `>Top</option><option value='bottom' ` + (GM_getValue("WaniKaniBookClubsPosition", "bottom") === "bottom" ? "selected" : "") + `>Bottom</option></select><br>
                    <button type='submit' class='wk-button--default'>Save</button>
                </form>
                `;
                settingsPopup.querySelector("form").addEventListener("submit", function(e) {
                    e.preventDefault();
                    GM_setValue("WaniKaniBookClubsCompactMode", document.querySelector("#compactMode").checked);
                    GM_setValue("WaniKaniBookClubsLimitVerticalVisible", document.querySelector("#limitVerticalVisible").checked);
                    GM_setValue("WaniKaniBookClubsPosition", document.querySelector("#bookClubsPosition").value);
                    location.reload();
                });
                let closeButton = createButton("", function() {
                    settingsPopup.close();
                });
                closeButton.className = "action-button close-button";
                closeButton.appendChild(Icons.customIcon("cross"));
                settingsPopup.appendChild(closeButton);
                document.body.appendChild(settingsPopup);
                settingsPopup.showModal();
            }
            document.querySelector("#settings-popup").showModal();            
        }

        // ------------------ MAIN SCRIPT ------------------
        // Create WK Book Club panel
        let container = document.createElement('div');
        container.id = "book-clubs-container";

        // Create panel header buttons
        let newClubButton = createButton("Add Club", function() {
            showBookClubEditPopup(true, null);
        });
        let settingsButton = createButton("", function() {
            showSettingsPopup();
        });
        settingsButton.appendChild(Icons.customIcon("settings"));

        // Create the panel body, then add both to the container and to the page
        let bookClubsList = createPanelBody("book-clubs-list");
        container.append(createPanelHeader("Book Club Tracker", newClubButton, settingsButton), bookClubsList);
        // Switch where to add the book clubs list depending on the saved setting
        if (GM_getValue("WaniKaniBookClubsPosition", "bottom") === "top") document.querySelector(".dashboard__content").before(container);
        else document.querySelector(".dashboard__content").after(container);

        bookClubs.forEach(bookClub => { // Loop over each book club and add it to the book clubs list
            try {
                let bookClubPanel = createBookClubPanel(bookClub);
                bookClubsList.appendChild(bookClubPanel);
                // Scroll to the active week if it exists and compact class is enabled
                let activeWeek = bookClubPanel.querySelector(".book-club-week--active");
                let scrollContainer = bookClubPanel.querySelector(".book-club-weeks");
                if (scrollContainer && scrollContainer.classList.contains("compact-size")) {
                    if (!activeWeek) activeWeek = scrollContainer.querySelectorAll(".book-club-week")[3]; // If there is no active week, set active week to the 4th week (first real week)
                    scrollContainer.scrollTo({left: activeWeek.offsetLeft - scrollContainer.offsetLeft - scrollContainer.offsetWidth / 2 + activeWeek.offsetWidth / 2, behavior: "auto"}); // Scroll so that active week is in the center of scrollContainer
                }
            } catch (e) {
                console.error("Error creating book club panel: " + e);
                if(bookClub === null) {
                    bookClubs.splice(bookClubs.indexOf(bookClub), 1);
                    saveBookClubs();
                    location.reload();
                }
            }
        });
        if(bookClubs.length === 0) { // If there are no book clubs, add a message
            let noBookClubsMessage = document.createElement('h2');
            noBookClubsMessage.innerHTML = "No book clubs added yet.";
            bookClubsList.appendChild(noBookClubsMessage);
        }

    } else if(location.href.includes("community") || location.href.includes("forums")) {
        let oldHref = document.location.href;
        // Create a mutation observer to check if the page has changed without a full load
        const observer = new MutationObserver (mutations => {
            // Check if the href has changed
            if (oldHref !== document.location.href) {
                // Update the old href
                oldHref = document.location.href;
                setTimeout(checkPage, 200);
            }
        });
        observer.observe(document.querySelector ('body'), { childList: true, subtree: true });
        // Also call event on page load
        checkPage();

        // Check if the current page is a book club page
        function checkPage() {
            if(!location.pathname.includes("/t")) return;
            else if(document.readyState !== "complete") return setTimeout(checkPage, 200);
             // Loop through spans with class .category-name to check if the current page has category "Book Clubs"
            let categorySpans = document.querySelectorAll(".topic-category .badge-category .badge-category__name");
            for(let i = 0; i < categorySpans.length; i++) {
                if(categorySpans[i].innerHTML === "Book Clubs") {
                    if(!bookClubs) bookClubs = loadBookClubs();
                    addBookClubButton();
                    break;
                }
            }
        }

        // Add a button to the right of .title-wrapper > h1 to add a book club based on current page
        function addBookClubButton() {
            let titleWrapper = document.querySelector("#topic-title .title-wrapper");
            if(titleWrapper === null) return; // If titleWrapper doesn't exist, return (to avoid errors
            else if(titleWrapper.querySelector(".add-book-club-button") !== null) return; // If button already exists, return (to avoid adding multiple buttons
            else titleWrapper = titleWrapper.querySelector("h1"); // Otherwise, set titleWrapper to the h1 element
            // Create and add styles to page as long as it hasn't already been added
            if(document.querySelector("#add-book-club-button-style") === null) {
                let style2 = document.createElement('style');
                style2.id = "add-book-club-button-style";
                style2.innerHTML += ".add-book-club-button { background-color: transparent; padding: 10px; margin-left: 10px !important; cursor: pointer; font-size: small; vertical-align: middle; border: 1px solid #515151; }"; // Add book club button
                style2.innerHTML += ".edit-popup { padding: 15px; background-color: var(--tertiary-200); position: relative; } .edit-popup button { background-color: transparent }";
                style2.innerHTML += ".edit-popup .close-button { position: absolute; top: 10px; right: 10px; font-size: large; }";
                style2.innerHTML += ".edit-popup #weeksInfo form {display: flex; align-items: center; column-gap: 10px; } .edit-popup #weeksInfo form:get-child(2) { margin-right: 20px; } .edit-popup #weeksInfo form hr { width: 0 !important; }"; // Weeks info form alignment
                style2.innerHTML += ".edit-popup #totalPages { margin-bottom: 20px } .edit-popup #weeksInfo { background-color: var(--tertiary-100); padding: 10px; }";
                style2.innerHTML += ".edit-popup #weeksInfo li button { color: gray; border: none; } .edit-popup #weeksInfo li button::before { content: 'X'; } .edit-popup #weeksInfo form button::before { content: '+'; }"; // Popup weeks info form button and input
                document.head.appendChild(style2);
            }

            // Add button to page
            let addBookClubButton = createButton("Add Book Club", function() {
                showCommunityBookClubAddPopup();
            });
            addBookClubButton.className = "add-book-club-button";
            titleWrapper.appendChild(addBookClubButton);
        }

        // Create a popup menu to add a book club
        function showCommunityBookClubAddPopup() {
            let parentDiv = document.querySelector("#main-outlet > .regular.ember-view");
            let popup = document.createElement('div');
            popup.className = "edit-popup";

            let popupTitle = document.createElement('h2');
            popupTitle.innerHTML = "Add Book Club";

            let closeButton = createButton("x", function() {
                parentDiv.removeChild(popup);
            });
            closeButton.className = "close-button";

            // Get the book club title from the page and try to remove common book club words
            let bookTitle = document.querySelector(".title-wrapper").querySelector("h1 > a").textContent;
            let wordsToRemove = ["thread", "(Absolute Beginner Book Club)", "(Beginner Book Club)", "(Intermediate Book Club)", "(Advanced Book Club)", "absolute beginner book club", "beginner book club", "intermediate book club", "advanced book club", "(ABBC)", "(BBC)", "(IBC)", "book club", "club"];
            wordsToRemove.forEach(word => {
                word = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                bookTitle = bookTitle.replace(new RegExp(`${word}`, 'ig'), "");
            });
            bookTitle = bookTitle.replace(/\s{2,}/g, " ");
            bookTitle = bookTitle.trim();

            // Loop through all a tags in .regular.contents .cooked and find the first one which has a link to a google sheet or google docs
            let vocabListUrl = "";
            let vocabListLinks = document.querySelectorAll(".regular.contents .cooked a");
            for(let i = 0; i < vocabListLinks.length; i++) {
                if(vocabListLinks[i].href.includes("docs.google.com") || vocabListLinks[i].href.includes("sheets.google.com")) {
                    vocabListUrl = vocabListLinks[i].href;
                    break;
                }
            }

            // Try and get the weeks info from the table in the main post
            let totalPages = 0;
            let weeksInfo = [];
            let possibleTables = document.querySelectorAll(".regular.contents .cooked .md-table table");
            let threadCreatedDate = new Date(parseInt(document.querySelector('#post_1 span[data-time]').getAttribute('data-time')));

            for(let i = 0; i < possibleTables.length; i++) { // Loop through tables in the post and try to find the schedule table
                let table = possibleTables[i];
                let tableRows = table.querySelectorAll("tr");
                let isScheduleTable = false;
                let tableHeaders = tableRows[0].querySelectorAll("th");
                for(let j = 0; j < tableHeaders.length; j++) {
                    if(tableHeaders[j].innerHTML.toLowerCase().includes("week") || tableHeaders[j].innerHTML.toLowerCase().includes("chapter")) {
                        isScheduleTable = true;
                        break;
                    }
                }
                if(tableRows.length > 0 && isScheduleTable) {
                    let startDateIndex = null, startPageIndex = null;
                    tableRows[0].querySelectorAll("th").forEach((th, index) => { // Check if the table has a start date and start page column
                        if(startDateIndex == null && th.innerHTML.toLowerCase().includes("date")) startDateIndex = index;
                        else if(startPageIndex == null && th.innerHTML.toLowerCase().includes("page") && !th.innerHTML.toLowerCase().includes("count") && !th.innerHTML.toLowerCase().includes("total")) startPageIndex = index;
                    });

                    if(startDateIndex == null || startPageIndex == null) break;
                    for(let j = 0; j < tableRows.length; j++) {
                        let tableCells = tableRows[j].querySelectorAll("td");
                        if(tableCells.length > 0 && tableCells[startDateIndex].innerText !== "" && tableCells[startPageIndex].innerText !== "") { // If the row has a start date and start page, add it to weeksInfo
                            let startDateText = tableCells[startDateIndex].innerText.replace("st", "").replace("nd", "").replace("rd", "").replace("th", "").replace("of", "");
                            if(!startDateText.match(/\d{4}/)) startDateText += " " + threadCreatedDate.getFullYear(); // If the year isn't included in the date, add it from the thread created date
                            let startDate = new Date(startDateText);
                            if(startDate.getMonth() < threadCreatedDate.getMonth()) startDate = new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate()); // If the month of this week is before the thread created month, add a year to the date
                            let weekInfo = {
                                completed: false,
                                startPage: parseInt(tableCells[startPageIndex].innerHTML.match(/\d+/)[0]),
                                startDate: startDate.toLocaleDateString("en-CA").substring(0, 10)
                            };
                            weeksInfo.push(weekInfo);
                            // Set total pages to the last number in tableCells[startPageIndex].innerHTML using regex to find it
                            if(j === tableRows.length - 1) {
                                let totalPagesMatch = tableCells[startPageIndex].innerHTML.match(/\d+$/);
                                if(totalPagesMatch) totalPages = parseInt(totalPagesMatch[0]);
                            }
                        }
                    }
                    break;
                }
            }

            // Create a book club object and add create a popup form to edit it
            let newBookClub = {
                title: bookTitle,
                url: location.href,
                vocabListUrl: vocabListUrl,
                totalPages: totalPages,
                weeksInfo: weeksInfo,
                active: true
            };
            let popupForm = manualAddEdit(newBookClub, false, true);
            popup.append(popupTitle, closeButton, popupForm);

            parentDiv.insertBefore(popup, parentDiv.querySelector(".posts"));
        }
    }
})();
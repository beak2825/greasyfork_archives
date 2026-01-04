// ==UserScript==
// @name           [Wallhaven] Better Wallpaper Downloader
// @namespace      NooScripts
// @author         NooScripts
// @version        1.4
// @description    Download Wallhaven wallpapers with customizable tag-based filenames via an intuitive, responsive popup interface.
// @license        MIT
// @match          https://wallhaven.cc/w/*
// @grant          none
// @icon           https://wallhaven.cc/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/534407/%5BWallhaven%5D%20Better%20Wallpaper%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/534407/%5BWallhaven%5D%20Better%20Wallpaper%20Downloader.meta.js
// ==/UserScript==

    const addButton = async () => {
        const buttonStyles = `
            .full-dl-button {
                display: inline-block;
                background-color: #0000;
                color: #fff;
                text-decoration: none;
                border: 1px solid #fff;
                border-radius: 0px;
                font-size: 16px;
                cursor: pointer;
                width: 100%;
            }
            .full-dl-button:hover {
                background-color: #fff;
                color: #000;
            }
            .tag-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #00000094;
                padding: 20px;
                border-radius: 10px;
                color: white;
                z-index: 1000;
                width: min(80vw, 1200px);
                max-height: min(80vh, 700px);
                overflow-y: auto;
                border: 2px solid #4a4a4a;
                display: flex;
            }
            .tag-popup .columns-container {
                display: flex;
                width: 100%;
            }
            .tag-popup .left-column, .tag-popup .right-column {
                flex: 1;
                padding: 10px;
                display: flex;
                flex-direction: column;
                position: relative;
            }
            .tag-popup .button-column {
                flex: 0 0 150px;
                padding-left: 20px;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .tag-popup .hidden {
                display: none;
            }
            .tag-popup .tag-list-container {
                max-height: calc(min(80vh, 700px) - 100px);
                overflow-y: auto;
                margin-bottom: 10px;
            }
            .tag-popup ul {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 5px;
                padding: 0;
                list-style: none;
            }
            .tag-popup li {
                background: #0000006b;
                padding: 5px;
                border: 1px solid #fff;
                border-radius: 5px;
                cursor: pointer;
                text-align: center;
            }
            .tag-popup li.selected {
                background: #fff;
                color: #000;
            }
            .tag-popup .button-column button {
                padding: 5px 10px;
                cursor: pointer;
                border: none;
                border-radius: 5px;
                background: #555;
                color: white;
                width: 100%;
            }
            .tag-popup .button-column button:hover {
                background: #777;
            }
            .tag-popup .select-all-button {
                padding: 5px;
                cursor: pointer;
                border: none;
                border-radius: 5px;
                background: #555;
                color: white;
                width: 100%;
                position: sticky;
                bottom: 0;
            }
            .tag-popup .select-all-button:hover {
                background: #777;
            }
            .divider {
                width: 1px;
                background-color: #fff;
                margin: 0 20px;
            }
            .divider.hidden {
                display: none;
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = buttonStyles;
        document.head.appendChild(styleElement);

        const download = document.createElement("button");
        download.classList.add("full-dl-button");
        download.innerText = "Download Wallpaper + Tag";

        const imageSrc = document.getElementById("wallpaper").src;
        const tags = [...document.querySelectorAll(".tagname")].map(tag => tag.innerText.trim());

        const showPopup = () => {
            const popup = document.createElement("div");
            popup.classList.add("tag-popup");

            const columnsContainer = document.createElement("div");
            columnsContainer.classList.add("columns-container");

            const leftColumn = document.createElement("div");
            leftColumn.classList.add("left-column");

            const rightColumn = document.createElement("div");
            rightColumn.classList.add("right-column");

            const buttonColumn = document.createElement("div");
            buttonColumn.classList.add("button-column");

            const capitalizedTagListContainer = document.createElement("div");
            capitalizedTagListContainer.classList.add("tag-list-container");
            const capitalizedTagList = document.createElement("ul");

            const nonCapitalizedTagListContainer = document.createElement("div");
            nonCapitalizedTagListContainer.classList.add("tag-list-container");
            const nonCapitalizedTagList = document.createElement("ul");

            // Split tags into capitalized and non-capitalized
            const capitalizedTags = tags.filter(tag => tag[0] === tag[0].toUpperCase()).sort();
            const nonCapitalizedTags = tags.filter(tag => tag[0] !== tag[0].toUpperCase()).sort();

            // Hide columns if empty
            if (capitalizedTags.length === 0) {
                leftColumn.classList.add("hidden");
            }
            if (nonCapitalizedTags.length === 0) {
                rightColumn.classList.add("hidden");
            }

            // Function to update Select All/Unselect All button text
            const updateSelectAllButton = (list, button) => {
                const anySelected = list.querySelectorAll(".selected").length > 0;
                button.innerText = anySelected ? "Unselect All" : "Select All";
            };

            // Populate capitalized tags (left column)
            capitalizedTags.forEach(tag => {
                const tagItem = document.createElement("li");
                tagItem.innerText = tag;
                tagItem.onclick = () => {
                    tagItem.classList.toggle("selected");
                    updateSelectAllButton(capitalizedTagList, selectAllCapitalizedButton);
                };
                capitalizedTagList.appendChild(tagItem);
            });

            // Add Select All/Unselect All button for capitalized tags
            const selectAllCapitalizedButton = document.createElement("button");
            selectAllCapitalizedButton.classList.add("select-all-button");
            selectAllCapitalizedButton.innerText = "Select All";
            selectAllCapitalizedButton.onclick = () => {
                const allSelected = capitalizedTagList.querySelectorAll(".selected").length === capitalizedTags.length;
                capitalizedTagList.querySelectorAll("li").forEach(item => {
                    item.classList.toggle("selected", !allSelected);
                });
                updateSelectAllButton(capitalizedTagList, selectAllCapitalizedButton);
            };

            // Populate non-capitalized tags (right column)
            nonCapitalizedTags.forEach(tag => {
                const tagItem = document.createElement("li");
                tagItem.innerText = tag;
                tagItem.onclick = () => {
                    tagItem.classList.toggle("selected");
                    updateSelectAllButton(nonCapitalizedTagList, selectAllNonCapitalizedButton);
                };
                nonCapitalizedTagList.appendChild(tagItem);
            });

            // Add Select All/Unselect All button for non-capitalized tags
            const selectAllNonCapitalizedButton = document.createElement("button");
            selectAllNonCapitalizedButton.classList.add("select-all-button");
            selectAllNonCapitalizedButton.innerText = "Select All";
            selectAllNonCapitalizedButton.onclick = () => {
                const allSelected = nonCapitalizedTagList.querySelectorAll(".selected").length === nonCapitalizedTags.length;
                nonCapitalizedTagList.querySelectorAll("li").forEach(item => {
                    item.classList.toggle("selected", !allSelected);
                });
                updateSelectAllButton(nonCapitalizedTagList, selectAllNonCapitalizedButton);
            };

            const confirmButton = document.createElement("button");
            confirmButton.innerText = "Download";
            confirmButton.onclick = async () => {
                const selectedTags = [
                    ...capitalizedTagList.querySelectorAll(".selected"),
                    ...nonCapitalizedTagList.querySelectorAll(".selected")
                ].map(el => el.innerText.replace(/\s+/g, '_'));
                const tagSuffix = selectedTags.length ? ` (${selectedTags.join(", ")})` : "";

                try {
                    const response = await fetch(imageSrc);
                    if (!response.ok) throw new Error('Network response was not ok');
                    const blob = await response.blob();
                    const objectUrl = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = objectUrl;
                    a.download = imageSrc.substring(imageSrc.lastIndexOf('/') + 1).replace(/\.[^.]+$/, tagSuffix + "$&");
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
                } catch (error) {
                    console.error('Failed to fetch image:', error);
                }
                document.body.removeChild(popup);
            };

            const cancelButton = document.createElement("button");
            cancelButton.innerText = "Cancel";
            cancelButton.onclick = () => document.body.removeChild(popup);

            buttonColumn.appendChild(confirmButton);
            buttonColumn.appendChild(cancelButton);

            const divider1 = document.createElement("div");
            divider1.classList.add("divider");
            if (capitalizedTags.length === 0 || nonCapitalizedTags.length === 0) {
                divider1.classList.add("hidden");
            }

            const divider2 = document.createElement("div");
            divider2.classList.add("divider");
            if (nonCapitalizedTags.length === 0) {
                divider2.classList.add("hidden");
            }

            capitalizedTagListContainer.appendChild(capitalizedTagList);
            leftColumn.appendChild(capitalizedTagListContainer);
            if (capitalizedTags.length > 0) {
                leftColumn.appendChild(selectAllCapitalizedButton);
            }

            nonCapitalizedTagListContainer.appendChild(nonCapitalizedTagList);
            rightColumn.appendChild(nonCapitalizedTagListContainer);
            if (nonCapitalizedTags.length > 0) {
                rightColumn.appendChild(selectAllNonCapitalizedButton);
            }

            columnsContainer.appendChild(leftColumn);
            columnsContainer.appendChild(divider1);
            columnsContainer.appendChild(rightColumn);
            columnsContainer.appendChild(divider2);
            columnsContainer.appendChild(buttonColumn);

            popup.appendChild(columnsContainer);
            document.body.appendChild(popup);
        };

        download.onclick = (e) => {
            e.preventDefault();
            showPopup();
        };

        const sidebarContent = document.querySelector(".sidebar-content > :first-child:last-of-type");
        if (sidebarContent) {
            sidebarContent.insertAdjacentElement("afterend", download);
        }
    };

    addButton();
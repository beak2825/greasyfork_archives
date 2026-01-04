// ==UserScript==
// @name         FarmRPG - Notepad
// @namespace    odung.wowow
// @version      1.0
// @description  Adds a hovering notepad that can create and switch between pages, be moved, minimized and resized
// @author       You
// @match        https://farmrpg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        GM.setValue
// @grant        GM.getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529662/FarmRPG%20-%20Notepad.user.js
// @updateURL https://update.greasyfork.org/scripts/529662/FarmRPG%20-%20Notepad.meta.js
// ==/UserScript==


(async function() {
    'use strict';

    let titleTimeout, notepadTimeout;

    let notepadData = await GM.getValue('notepadData', { pages: {}, titles: {}, currentPage: 1, totalPages: 1 });
    let notepadSettings = await GM.getValue('notepadSettings', { notepadOpen: false, width: '300px', height:'250px' });

    const notepadButton = await createNotepad();
    document.body.appendChild(notepadButton);

	async function createNotepad() {
        const button = document.createElement('div');
        button.style.cssText = 'padding: 10px; cursor: pointer; margin-bottom: 3px; top: 0; left: 0; z-index: 10000000; position: fixed;';
        button.title = 'Notepad';

		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('width', '20');
		svg.setAttribute('height', '20');
		svg.setAttribute('fill', 'white');
		svg.setAttribute('viewBox', '0 0 16 16');

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('d', 'M5.063 9.563H12.938V10.688H5.063V9.563z');
		svg.appendChild(path);

		const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path2.setAttribute('d', 'M5.063 11.813H12.938V12.938H5.063V11.813z');
		svg.appendChild(path2);

		const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path3.setAttribute('d', 'M5.063 7.313H12.938V8.438H5.063V7.313z');
		svg.appendChild(path3);

		const path4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path4.setAttribute('d', 'M12.938 2.25V1.125h-1.125v1.125h-2.25V1.125h-1.125v1.125h-2.25V1.125H5.063v1.125H2.25v14.625h13.5V2.25zm1.688 13.5H3.375V3.375h1.688v1.125h1.125V3.375h2.25v1.125h1.125V3.375h2.25v1.125h1.125V3.375h1.688z');
		svg.appendChild(path4);

		button.appendChild(svg);

		const notepadBox = document.createElement('div');
		notepadBox.id = 'odung-notepad';
        notepadBox.style.cssText = `position: fixed; background: #2e2e2e; border: 1px solid #555; display: none; z-index: 10000; resize: both; overflow: hidden;
			width: ${notepadSettings.width};
			height:  ${notepadSettings.height};
			top: calc(100% - ${notepadSettings.height});
			left: calc(100% - ${notepadSettings.width});
		`;

        const header = document.createElement("div");
        header.style.cssText = `background-color: #444; padding: 5px; cursor: move; font-weight: bold; color: white; position: sticky; top: 0; z-index: 10; display: flex; align-items: center; justify-content: flex-end; position: relative;`;

        const headerTitle = document.createElement("div");
        headerTitle.textContent = "Notepad";
        headerTitle.style.cssText = `position: absolute; left: 50%; transform: translateX(-50%); text-align: center;`;

        const buttonContainer = document.createElement("div");
        buttonContainer.style.cssText = `display: flex; gap: 5px;`;

        const resetButton = document.createElement("span");
        resetButton.textContent = "⟲";
        resetButton.title = 'Reset Size';
        resetButton.style.cssText = `color: white; border: none; padding: 5px; cursor: pointer;`;

        resetButton.addEventListener('click', async function () {
            notepadBox.style.width = '300px';
            notepadBox.style.height = '250px';
            notepadBox.style.position = 'fixed';
            const height = parseInt(notepadBox.style.height, 10);
            notepadBox.style.top = `calc(100% - ${height}px)`;
            notepadBox.style.right = 0;
            notepadSettings.width = '300px'
            notepadSettings.height = '250px';
            await GM.setValue('notepadSettings', notepadSettings);
        });

        const minimizeButton = document.createElement("span");
        minimizeButton.textContent = "—";
        minimizeButton.title = 'Minimize';
        minimizeButton.style.cssText = `color: white;border: none;padding: 5px;cursor: pointer;`;

        minimizeButton.addEventListener('click', async function () {
            notepadBox.style.display = notepadBox.style.display === 'none' ? 'block' : 'none';
            notepadSettings.isOpen = notepadBox.style.display === 'none' ? false : true;
            await GM.setValue('notepadSettings', notepadSettings);
        });

		buttonContainer.appendChild(resetButton);
		buttonContainer.appendChild(minimizeButton);

		header.appendChild(headerTitle);
		header.appendChild(buttonContainer);

		notepadBox.appendChild(header);

        const titleContainer = document.createElement('div');
        titleContainer.style.cssText = `background-color: #3a3a3a; padding: 5px; text-align: center; color: white; display: flex; justify-content: flex-end; position: relative; align-items: center;`;

        const title = document.createElement('div');
        title.contentEditable = 'true';
        title.style.cssText = `position: absolute; left: 50%; transform: translateX(-50%); text-align: center; outline: none; background: none; color: white; border: none;`;
		title.textContent = notepadData.titles[notepadData.currentPage] || 'Untitled';

		title.addEventListener('input', function () {
			clearTimeout(titleTimeout);
			titleTimeout = setTimeout(async () => {
				notepadData.pages[notepadData.currentPage] = textarea.value;
				let titleValue = title.textContent.trim();
				notepadData.titles[notepadData.currentPage] = titleValue || "Untitled";
				await GM.setValue('notepadData', notepadData);
				updateDropdown();
			}, 1000);
		});

		const dropdownButton = document.createElement('button');
		dropdownButton.textContent = '▼';
		dropdownButton.style.cssText = `background: none;border: none;color: white;cursor: pointer;`;

		titleContainer.appendChild(title);
		titleContainer.appendChild(dropdownButton);
		notepadBox.appendChild(titleContainer);

		const dropdownMenu = document.createElement('div');
		dropdownMenu.style.cssText = `display: none;position: absolute;background: #444;border: 1px solid #555;color: white;width: 150px;top: 35px;left: 50%;transform: translateX(-50%);z-index: 1001;`;

		const newPageOption = document.createElement('div');
		newPageOption.textContent = 'New Page';
		newPageOption.style.padding = '5px';
		newPageOption.style.cursor = 'pointer';
		newPageOption.style.backgroundColor = '#666666';
		newPageOption.addEventListener('click', createNewPage);

		dropdownMenu.appendChild(newPageOption);
		titleContainer.appendChild(dropdownMenu);

		dropdownButton.addEventListener('click', function () {
			dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
		});

		const textarea = document.createElement('textarea');
		textarea.style.cssText = `width: 100%;height: calc(100% - 60px);border: none;outline: none;background-color: #333;color: white;resize: none;overflow: auto;`;
		notepadBox.appendChild(textarea);
		document.body.appendChild(notepadBox);

		updateDropdown();

		if (notepadData.pages[notepadData.currentPage]) {
			textarea.value = notepadData.pages[notepadData.currentPage];
			title.textContent = notepadData.titles[notepadData.currentPage] || notepadData.currentPage;
		}

		textarea.addEventListener('input', function () {
			clearTimeout(notepadTimeout);
			notepadTimeout = setTimeout(async () => {
				notepadData.pages[notepadData.currentPage] = textarea.value;
				let titleValue = title.textContent.trim();
				notepadData.titles[notepadData.currentPage] = titleValue || "Untitled";
				await GM.setValue('notepadData', notepadData);
				updateDropdown();
			}, 1000);
		});

		button.addEventListener('click', async function () {
			notepadBox.style.display = notepadBox.style.display === 'none' ? 'block' : 'none';
			notepadSettings.notepadOpen = notepadBox.style.display === 'none' ? false : true;
			await GM.setValue('notepadSettings', notepadSettings);
		});

		let isDragging = false;
		let offsetX, offsetY;

		header.addEventListener('mousedown', function (e) {
			e.preventDefault();
			isDragging = true;
			offsetX = e.clientX - notepadBox.offsetLeft;
			offsetY = e.clientY - notepadBox.offsetTop;
		});

		document.addEventListener('mousemove', function (e) {
			if (isDragging) {
				notepadBox.style.left = e.clientX - offsetX + 'px';
				notepadBox.style.top = e.clientY - offsetY + 'px';
			}
		});

		document.addEventListener('mouseup', function () {
			isDragging = false;
		});

		async function createNewPage() {
			dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
			const pageKey = notepadData.totalPages + 1;
			notepadData.titles[pageKey] = `Untitled ${Object.keys(notepadData.pages).length + 1}`;
			title.textContent = `Untitled ${Object.keys(notepadData.pages).length + 1}`;
			notepadData.pages[pageKey] = '';
			notepadData.currentPage = pageKey;
			notepadData.totalPages += 1;
			textarea.value = '';
			updateDropdown();
			await GM.setValue('notepadData', notepadData);
		}

		async function switchPage(pageName) {
			notepadData.currentPage = pageName;
			title.textContent = notepadData.titles[pageName] || pageName;
			textarea.value = notepadData.pages[pageName] || '';
			await GM.setValue('notepadData', notepadData);
		}

		function updateDropdown() {
			while (dropdownMenu.firstChild) {
				dropdownMenu.removeChild(dropdownMenu.firstChild);
			}

			dropdownMenu.appendChild(newPageOption);

			Object.keys(notepadData.pages).forEach((page) => {
				const pageContainer = document.createElement('div');
				pageContainer.style.display = 'flex';
				pageContainer.style.justifyContent = 'space-between';
				pageContainer.style.alignItems = 'center';
				pageContainer.style.padding = '5px';
				pageContainer.style.cursor = 'pointer';
				pageContainer.addEventListener('click', function () {
					switchPage(page);
					dropdownMenu.style.display = 'none';
				});

				const pageOption = document.createElement('div');
				pageOption.textContent = notepadData.titles[page] || page;
				pageOption.style.cursor = 'pointer';
				pageOption.addEventListener('click', function () {
					switchPage(page);
					dropdownMenu.style.display = 'none';
				});

				const deleteButton = document.createElement('button');
				deleteButton.textContent = '✖';
				deleteButton.title = 'Delete Page';
				deleteButton.style.background = 'none';
				deleteButton.style.border = 'none';
				deleteButton.style.color = 'white';
				deleteButton.addEventListener("mouseenter", () => {
					deleteButton.style.color = "red";
				});
				deleteButton.addEventListener("mouseleave", () => {
					deleteButton.style.color = "white";
				});
				deleteButton.addEventListener('click', function (event) {
					event.stopPropagation();
					deletePage(page);
				});

				pageContainer.appendChild(pageOption);
				pageContainer.appendChild(deleteButton);
				dropdownMenu.appendChild(pageContainer);
			});
		}

		async function deletePage(pageName) {
			delete notepadData.pages[pageName];
			delete notepadData.titles[pageName];
			if (Object.keys(notepadData.pages).length > 0) {
				const remainingPages = Object.keys(notepadData.pages);
				notepadData.currentPage = remainingPages[0];
				switchPage(notepadData.currentPage);
			} else {
				createNewPage();
			}

			updateDropdown();
			await GM.setValue('notepadData', notepadData);
		}

		async function saveResize() {
			const textarea = document.querySelector('#odung-notepad');
			notepadSettings.width = textarea.style.width;
			notepadSettings.height = textarea.style.height;
			await GM.setValue('notepadSettings', notepadSettings);
		}

		const notepad = document.querySelector('#odung-notepad');
		const observer = new ResizeObserver(saveResize);
		observer.observe(notepad);

		if (notepadSettings.notepadOpen) notepadBox.style.display = 'block';

		return button;
	}
})();
// ==UserScript==
// @name         dA_archive_notes
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  archive the notes
// @author       Dediggefedde
// @match        http://*.deviantart.com/notifications/notes/*
// @match        https://*.deviantart.com/messages/notes/*
// @match        https://*.deviantart.com/messages/notes
// @match        https://*.deviantart.com/notifications/notes/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deviantart.com
// @resource	viewer	https://phi.pf-control.de/userscripts/dA_archive_notes/dA_ArchiveNotes_Viewer.exe
// @grant        GM.addStyle
// @grant        GM_getResourceURL
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/444633/dA_archive_notes.user.js
// @updateURL https://update.greasyfork.org/scripts/444633/dA_archive_notes.meta.js
// ==/UserScript==
//
(function () {
    'use strict';

    let viewer = GM_getResourceURL("viewer");
    let starterBat = `
	@echo off
	Rem This opens a chrome window in "local file access" mode for this session.
	Rem Command to do this manually: chrome.exe --allow-file-access-from-files

	tasklist /fi "ImageName eq chrome.exe" /fo csv 2>NUL | find /I "chrome.exe">NUL
	if "%ERRORLEVEL%"=="0" (
		echo.
		echo Please close all chrome windows before you continue.
		echo The Viewer will not work otherwise.
		echo.
		pause
	)

	start "" chrome.exe --allow-file-access-from-files %~dp0_Viewer.html
	`;

    let notes = {};
    let folders = {}; //id => {id, title, count}
    let dialog = null;
    let style = null;
    let maxPage = -1;
    let pendingFolders = [];
    let totalCount = 0;
    let curCount = 0;
    let cancelFlag = false;
    //
    function addNote(id, folder, sender, date, subject, text) {
        notes[`${folder}_${id}`] = { id: id, folder: folder, sender: sender, date: date, subject: subject, text: text };
    }
    //
    function download(content, mimeType, filename) {
        const a = document.createElement('a'); // Create "a" element
        const blob = new Blob([content], { type: mimeType }); // Create a blob (file-like object)
        const url = URL.createObjectURL(blob); // Create an object URL from blob
        a.setAttribute('href', url); // Set "a" element link
        a.setAttribute('download', filename); // Set download filename
        a.click(); // Start downloading
    }
    //
    function downloadPuppy(folderId, offset) {
        const token = document.querySelector("input[name=validate_token]")?.value ?? "";
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: `https://www.deviantart.com/_puppy/notes/list?folderid=${folderId}&limit=24&offset=${offset}&da_minor_version=20230710&csrf_token=${token}`,
                headers: {
                    "x-csrf-token": token,
                    "Accept": "application/json"
                },
                onload: (resp) => {
                    if (cancelFlag) {
                        cancelFlag = false;
                        reject("Canceled!");
                        zipResponse();
                        return;
                    }

                    let response = JSON.parse(resp.response);
                    for (let i = 0; i < response.results.length; ++i) {
                        let entr = response.results[i];
                        addNote(entr.noteId, folderId, entr.sender.username, entr.timestamp, entr.subject, entr.body.html.markup);
                    }
                    let prgText = document.getElementById("dA_AN_progress-text");
                    let prgPerc = document.getElementById("dA_AN_progress");

                    prgText && (prgText.innerHTML = `${folders[folderId].title} ${offset}/${folders[folderId].count} (total ${curCount + offset}/${totalCount})`);
                    prgPerc && (prgPerc.value = (curCount + offset) * 100 / (totalCount));

                    if (response.hasMore && ((maxPage == -1) || (parseInt(response.nextOffset) <= maxPage * 10))) {
                        resolve(downloadPuppy(folderId, response.nextOffset));
                    } else if (pendingFolders.length > 0) {
                        let nextFolder = pendingFolders.shift();
                        curCount += folders[nextFolder].count;
                        resolve(downloadPuppy(nextFolder, 0));
                    } else {
                        prgText && (prgText.innerHTML = `Scanning finished.`);
                        prgPerc && (prgPerc.value = 100);

                        resolve(response);
                        zipResponse();
                    }
                },
                onerror: (err) => reject(err),
                ontimeout: () => reject(new Error("Request timed out")),
            });
        });
    }
    //
    function getNoteFileName(id) {
        if (id === "") {
            console.log("dA_archive_notes error: empty note id");
            return "";
        }
        let note = notes[id];
        if (!note) {
            console.log("dA_archive_notes error: wrong note id", id);
            return id;
        }
        let date = note.date.slice(0, -5).replace(/T/g, "_").replace(/:/g, "-");
        return `${folders[note.folder].title}_${note.id}_${note.sender}_${date}.html`;
    }
    function createMetaDiv(id) {
        const noteObj=notes[id];
        const div = document.createElement('div');
        div.id = `note-meta-${id}`;
        div.dataset.folder = noteObj.folder;
        div.dataset.sender = noteObj.sender;
        div.dataset.date = noteObj.date;
        div.dataset.subject = noteObj.subject;
        div.style.display = 'none';
        document.body.appendChild(div);
        return div.outerHTML;
    }
    //
    function zipResponse() {
        let zip = new tiny_zip();
        //
        let contenttext = "ID\tFolder\tSender\tDate\tSubject\tFile\n";
        contenttext += Object.entries(notes).map(([id, note]) => {
            return `${note.id}\t${folders[note.folder].title}\t` +
                `${note.sender}\t${note.date}\t${note.subject}\t` +
                `${getNoteFileName(id)}`;
        }).join("\n");
        zip.add("content.tsv", tiny_zip.utf8(contenttext));
        //
        Object.entries(notes).forEach(([id, note]) => {
            zip.add("html/"+getNoteFileName(id), tiny_zip.utf8(createMetaDiv(id)+"\n"+note.text)); //TODO notes/
        });
        //
        const replacements = { "-": "-", "T": "_", "Z": "", ":": "-", ".": "-" };
        const dt = (new Date()).toISOString().replace(/\D/gi, (el) => replacements[el] || "").slice(0, -5);
        //
        (async () => {
            const response = await fetch(viewer);
            const arrayBuffer = await response.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            zip.add("dA_ArchiveNotes Viewer.exe", uint8Array);
            download(zip.generate(), "application/octet-stream", `dA_archive_notes_${dt}.zip`);
        })();
    }
    //
    function addDialog() {
        if (document.getElementById("dA_AN_Dialog") != null) {
            return;
        }

        dialog = document.createElement("div");
        dialog.id = "dA_AN_Dialog";
        dialog.innerHTML = `
          <div class="dA_AN_window">
            <h2>PN Downloader</h2>

            <label>Folders:</label>
            <select id="dA_AN_folderSelect">

            </select>

            <label>Pages:</label>
            <div class="dA_AN_pages">
                <input type="radio" name="pagesel" value="all" checked> All<br>
                <input type="radio" name="pagesel" value="range"> Pages:
                <input type="number" id="dA_AN_min" min="1" value="1"> –
                <input type="number" id="dA_AN_max" min="1" value="1"> (10 per page)
            </div>

            <label>Progress:</label>
            <progress id="dA_AN_progress" value="0" max="100"></progress>
            <span id="dA_AN_progress-text">0%</span>

            <div class="dA_AN_buttons">
                <button id="dA_AN_start">Start</button>
                <button id="dA_AN_cancel">Cancel</button>
            </div>
        </div>`;
        let selectFolder = dialog.querySelector("#dA_AN_folderSelect");
        if (selectFolder != null) {
            selectFolder.innerHTML = `<option value="dA_AN_folder_all">All folders</option>\n` + Object.entries(folders).map(([id, data]) => `<option value="${id}">${data.title} (${data.count})</option>`).join("\n");
        }

        style = document.createElement("style");
        style.innerHTML = `
         /* --- Overlay --- */
			#dA_AN_Dialog {
				position: fixed;
				inset: 0;
				display: none;
				align-items: center;
				justify-content: center;
				background: rgba(0,0,0,0.45);
				backdrop-filter: blur(4px);
				-webkit-backdrop-filter: blur(4px);
				z-index: 999999;

				font-family: "Inter", system-ui, sans-serif;
				color: #222;
			}

			/* --- Dialog Window --- */
			.dA_AN_window {
				background: rgba(255,255,255,0.85);
				backdrop-filter: blur(6px);
				padding: 24px;
				width: 340px;
				border-radius: 14px;

				box-shadow:
					0 8px 20px rgba(0,0,0,0.25),
					0 2px 6px rgba(0,0,0,0.15);

				animation: popupFade 0.25s ease-out;
			}

			@keyframes popupFade {
				from { opacity: 0; transform: translateY(10px) scale(0.97); }
				to   { opacity: 1; transform: translateY(0)   scale(1); }
			}

			/* --- Title --- */
			.dA_AN_window h2 {
				margin: 0 0 12px 0;
				font-size: 1.4rem;
				font-weight: 600;
				color: #111;
			}

			/* --- Labels --- */
			.dA_AN_window label {
				display: block;
				margin-top: 14px;
				margin-bottom: 4px;
				font-weight: 600;
				font-size: 0.9rem;
				color: #333;
			}

			/* --- Select --- */
			#dA_AN_folderSelect {
				width: 100%;
				padding: 8px 10px;
				border-radius: 8px;
				border: 1px solid #ccc;
				font-size: 0.9rem;
				transition: border-color 0.2s;
			}
			#dA_AN_folderSelect:focus {
				border-color: #4a8fff;
				outline: none;
			}

			/* --- Page Selection --- */
			.dA_AN_pages {
				margin-top: 4px;
				font-size: 0.9rem;
			}
			.dA_AN_pages input[type=number] {
				width: 60px;
				padding: 6px;
				border-radius: 6px;
				border: 1px solid #ccc;
				margin-left: 4px;
				transition: border-color 0.2s;
			}
			.dA_AN_pages input[type=number]:focus {
				border-color: #4a8fff;
				outline: none;
			}

			/* --- Progress Bar --- */
			#dA_AN_progress {
				width: 100%;
				margin-top: 6px;
				height: 10px;
				appearance: none;
			}

			#dA_AN_progress::-webkit-progress-bar {
				background: #f0f0f0;
				border-radius: 6px;
			}
			#dA_AN_progress::-webkit-progress-value {
				background: linear-gradient(90deg, #4a8fff, #6ab3ff);
				border-radius: 6px;
			}

			/* --- Buttons --- */
			.dA_AN_buttons {
				margin-top: 20px;
				text-align: right;
				display: flex;
				justify-content: flex-end;
				gap: 8px;
			}

			.dA_AN_buttons button {
				padding: 8px 16px;
				border-radius: 8px;
				border: none;
				font-size: 0.9rem;
				cursor: pointer;
				transition: background 0.2s, transform 0.1s;
			}

			/* Primary Button (Start) */
			#dA_AN_start {
				background: #4a8fff;
				color: white;
			}
			#dA_AN_start:hover {
				background: #3a7ae6;
			}
			#dA_AN_start:active {
				transform: scale(0.96);
			}

			/* Cancel Button */
			#dA_AN_cancel {
				background: #e8e8e8;
				color: #333;
			}
			#dA_AN_cancel:hover {
				background: #d8d8d8;
			}
			#dA_AN_cancel:active {
				transform: scale(0.96);
			}
            #dA_AN_openDialog {
                padding: 3px 20px;
                background: linear-gradient(90deg, #4a8fff, #6ab3ff);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 0.95rem;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.25s, box-shadow 0.25s, transform 0.15s;
                box-shadow: 0 4px 14px rgba(0, 112, 255, 0.25);
            }

            #dA_AN_openDialog:hover {
                background: linear-gradient(90deg, #3a7ae6, #5da5f7);
                box-shadow: 0 6px 18px rgba(0, 112, 255, 0.35);
            }

            #dA_AN_openDialog:active {
                transform: scale(0.96);
            }
        `;

        document.body.appendChild(style);
        document.body.appendChild(dialog);
        connectEvents();
    }

    function connectEvents() {
        const btnStart = document.getElementById("dA_AN_start");
        const btnCancel = document.getElementById("dA_AN_cancel");
        const progressBar = document.getElementById("dA_AN_progress");
        const progressText = document.getElementById("dA_AN_progress-text");
        const minInput = document.getElementById("dA_AN_min");
        const maxInput = document.getElementById("dA_AN_max");
        if (btnStart == null || btnCancel == null || progressBar == null || progressText == null) {
            return;
        }

        minInput.addEventListener("input", () => {
            let minVal = Number(minInput.value);
            let maxVal = Number(maxInput.value);

            if (minVal < 1) {
                minVal = 1;
                minInput.value = 1;
            }
            if (maxVal < minVal) {
                maxInput.value = minVal;
            }
        });

        maxInput.addEventListener("input", () => {
            let minVal = Number(minInput.value);
            let maxVal = Number(maxInput.value);

            if (maxVal < 1) {
                maxVal = 1;
                maxInput.value = 1;
            }
            if (maxVal < minVal) {
                minInput.value = maxVal;
            }
        });

        btnStart.addEventListener("click", () => {
            const folder = document.getElementById("dA_AN_folderSelect")?.value ?? "1";
            const pageMode = document.querySelector("input[name=pagesel]:checked")?.value ?? "range";

            cancelFlag = false;
            let min = 0;
            maxPage = -1;
            notes = {};
            if (pageMode === "range") {
                min = parseInt(minInput?.value - 1 ?? 0);
                maxPage = parseInt(maxInput?.value - 1 ?? -1);
            }

            if (folder == "dA_AN_folder_all") {
                pendingFolders = [];
                Object.entries(folders).forEach(([key, obj]) => { //{id, title, count}
                    pendingFolders.push(key);
                    totalCount += obj.count;
                });
                curCount = 0;
                if (totalCount == 0) { totalCount = 1; }
                downloadPuppy(pendingFolders.shift(), min).then(res => {
                    console.log("Finished!", res);
                }).catch((ex) => {
                    console.log("Error:", ex);
                    alert(`Error: ${ex}`);
                });
            } else {
                totalCount = maxPage == -1 ? folders[folder].count : maxPage * 10;
                totalCount -= min * 10;
                curCount = 0;
                if (totalCount == 0) { totalCount = 1; }
                downloadPuppy(folder, min * 10).then(res => {
                    console.log("Finished!", res);
                }).catch((ex) => {
                    console.log("Error:", ex);
                    alert(`Error:\n ${ex}`);
                });;
            }
        });

        btnCancel.addEventListener("click", () => {
            cancelFlag = true;
            dialog?.remove();
            style?.remove();
        });
    }
    //
    function getFolder() {
        let folderInfo = document.body.innerHTML.substr(document.body.innerHTML.indexOf(`__INITIAL_STATE__`));
        folderInfo = folderInfo.substring(folderInfo.indexOf("folders"), folderInfo.indexOf("window.__URL_CONFIG__"));

        const regexpStr = /\{\\"folderId\\":(.*?),\\"title\\":\\"(.*?)\\",\\"count\\":(\d+)\}/g;
        let match;
        while ((match = regexpStr.exec(folderInfo)) !== null) {
            folders[match[1]] = { id: match[1], title: match[2], count: parseInt(match[3]) };
        }
    }
    //
    function addButton(searchBar) {
        if (document.getElementById("dA_AN_openDialog") != null) {
            return;
        }
        let btn = document.createElement("button");
        btn.id = "dA_AN_openDialog";
        btn.innerHTML = "Download";
        searchBar.after(btn);

        btn.addEventListener("click", (ev) => {
            dialog && (dialog.style.display = "flex");
        });
    }
    //
    function init() {
        let sbar = document.querySelector("input#q");
        if (sbar == null)
            return; //other site

        addButton(sbar);
        getFolder();
        addDialog();
    }

    const observer = new MutationObserver(init);
    observer.observe(document.body, { childList: true, subtree: true });
    init();

    //
    //
    //ressource for creating zip:
    /*
    Copyright (C) 2013 https://github.com/vuplea
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    */
    // edit note: update by dediggefedde at 2024-10-17 into class form
    //
    class tiny_zip {
        //
        constructor() {
            this.localHs = [];
            this.contents = [];
            this.centralHs = [];
            this.local_offset = 0;
            this.central_offset = 0;
        }
        //
        // static uint8array_from_binstr(string) {
        // 	const binary = new Uint8Array(string.length);
        // 	for (let i = 0; i < string.length; i++) {
        // 		binary[i] = string.charCodeAt(i);
        // 	}
        // 	return binary;
        // }
        //
        static utf8(string) {
            const encoder = new TextEncoder();
            return encoder.encode(string);
        }
        //
        add(nameStr, content) {
            const name = tiny_zip.utf8(nameStr.replace(/[:*?"<>\\|]/g, "_").slice(0, 255));
            const nlen = name.length;
            const clen = content.length;
            const crc = this.crc32(content);
            const localH = new Uint8Array(30 + nlen);
            localH.set([
                0x50, 0x4b, 0x03, 0x04,      // Local file header signature
                0x14, 0x00,                // Version needed to extract
                0x00, 0x08,                // **UTF-8 flag**
                0x00, 0x00,                // Compression method (store)
                0x00, 0x00, 0x00, 0x00,     // File time/date
                crc, crc >> 8, crc >> 16, crc >> 24,
                clen, clen >> 8, clen >> 16, clen >> 24,
                clen, clen >> 8, clen >> 16, clen >> 24,
                nlen, nlen >> 8,
                0x00, 0x00                 // Extra field length
            ]);
            localH.set(name, 30);
            //
            const centralH = new Uint8Array(46 + nlen);
            const loff = this.local_offset;
            centralH.set([
                0x50, 0x4b, 0x01, 0x02,      // Central file header signature
                0x14, 0x00,                // Version made by
                0x14, 0x00,                // Version needed to extract
                0x00, 0x08,                // **UTF-8 flag**
                0x00, 0x00,                // Compression method
                0x00, 0x00, 0x00, 0x00,     // File time/date
                crc, crc >> 8, crc >> 16, crc >> 24,
                clen, clen >> 8, clen >> 16, clen >> 24,
                clen, clen >> 8, clen >> 16, clen >> 24,
                nlen, nlen >> 8,
                0x00, 0x00,                // Extra field length
                0x00, 0x00,                // File comment length
                0x00, 0x00,                // Disk number
                0x00, 0x00,                // Internal file attrs
                0x00, 0x00, 0x00, 0x00,     // External file attrs
                loff, loff >> 8, loff >> 16, loff >> 24
            ]);
            centralH.set(name, 46);
            this.central_offset += centralH.length;
            //
            this.local_offset += localH.length + content.length;
            this.localHs.push(localH);
            this.contents.push(content);
            this.centralHs.push(centralH);
        }
        ;
        //
        generate() {
            const n = this.localHs.length;
            //
            const endof = new Uint8Array(22);
            const loff = this.local_offset;
            const coff = this.central_offset;
            endof.set([
                0x50, 0x4b, 0x05, 0x06,  // End of central dir signature
                0x00, 0x00,
                0x00, 0x00,
                n, n >> 8,
                n, n >> 8,
                coff, coff >> 8, coff >> 16, coff >> 24,
                loff, loff >> 8, loff >> 16, loff >> 24,
                0x00, 0x00
            ]);
            //
            const outQueue = [];
            for (let i = 0; i < n; ++i) {
                outQueue.push(this.localHs[i]);
                outQueue.push(this.contents[i]);
            }
            for (let i = 0; i < n; ++i)
                outQueue.push(this.centralHs[i]);
            outQueue.push(endof);
            //
            return new Blob(outQueue, { type: "data:application/zip" });
        }
        ;
        //
        crcTable() {
            var Table = [];
            for (var i = 0; i < 256; ++i) {
                var crc = i;
                for (var j = 0; j < 8; ++j)
                    crc = -(crc & 1) & 0xEDB88320 ^ (crc >>> 1);
                Table[i] = crc;
            }
            return Table;
        }
        ;
        crc32(data) {
            const crcTable = this.crcTable();
            var crc = -1;
            for (var i = 0; i < data.length; ++i)
                crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xFF];
            return ~crc;
        }
        ;
    }
})();

// ==UserScript==
// @name        Minehut folder download
// @namespace   Violentmonkey Scripts
// @match       *://app.minehut.com/*
// @grant       none
// @version     1.0.2
// @author      -
// @require     https://greasyfork.org/scripts/441873-zip-js/code/zipjs.js?version=1030820
// @description Download folders from Minehut's file manager without having to pay
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/477108/Minehut%20folder%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/477108/Minehut%20folder%20download.meta.js
// ==/UserScript==


(() => {
    let downloadFolder = (async (progressFn) => {
        function getCookieValue(cookieName) {
            let name = cookieName + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let cookieArray = decodedCookie.split(';');
            for (let i = 0; i < cookieArray.length; i++) {
                let cookie = cookieArray[i];
                while (cookie.charAt(0) === ' ') {
                    cookie = cookie.substring(1);
                }
                if (cookie.indexOf(name) === 0) {
                    return cookie.substring(name.length, cookie.length);
                }
            }
            return "";
        }

        let accessToken = getCookieValue('access_token_prd');
        let slgToken = localStorage.getItem('slg_user_token');
        let minehutSession = localStorage.getItem('minehut_session_id');
        let activeServerData = localStorage.getItem('activeServer');

        if (!accessToken || !slgToken || !minehutSession || !activeServerData) {
            alert('You must select a server to use this script°');
            return;
        }

        let activeServer = JSON.parse(activeServerData);
        let sideCarBase = `https://${activeServer._id}.manager.minehut.com`;

        let headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'x-profile-id': slgToken,
            'x-session-id': minehutSession
        };

        async function apiRequest(url, method = 'GET', body = undefined) {
            return await fetch('https://api.minehut.com' + url, {
                method: method,
                headers: headers,
                body: body
            });
        }

        async function sideCarRequest(url, method = 'GET', body = undefined) {
            return await fetch(sideCarBase + url, {
                method: method,
                headers: headers,
                body: body
            });
        }

        async function list(path) {
            let response = await apiRequest(`/file/${activeServer._id}/list/${path}`);
            return await response.json();
        }

        async function download(path) {
            let response = await sideCarRequest(`/file/download?files=${JSON.stringify([path])}`);
            return await response.blob();
        }

        async function listRecursive(path) {
            let files = await list(path);
            let fileList = [];
            for (let file of files.files) {
                if (file.directory) {
                    fileList = fileList.concat(await listRecursive(`${path}/${file.name}`));
                } else if (!file.blocked) {
                    fileList.push(`${path}/${file.name}`);
                }
            }
            return fileList;
        }

        function downloadBlob(blob, fileName) {
            let a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(a.href);
        }

        async function createZip(files, progressFn) {
            const zipFileWriter = new zip.BlobWriter();
            const zipWriter = new zip.ZipWriter(zipFileWriter);

            let i = 1;
            for (let path of files) {
                progressFn(`Downloading (${i}/${files.length}) ...`);
                let data = await download(path);
                await zipWriter.add(path.replace(/^\/+/, ''), new zip.BlobReader(data));
                i++;
            }
            await zipWriter.close();
            return await zipFileWriter.getData();
        }

        let folderName = prompt('Enter the full path of the folder to download (e.g. world or plugins/WorldEdit)');
        if (!folderName) {
            alert('You must enter a folder name');
            return;
        }

        if (!folderName.startsWith('/')) {
            folderName = '/' + folderName;
        }
        if (folderName.endsWith('/')) {
            folderName = folderName.slice(0, -1);
        }

        progressFn('Scanning folder...');
        let contents = await listRecursive(folderName);
        let result = await createZip(contents, progressFn);
        let name = folderName.split('/').pop();
        if (name === '') {
            name = 'root';
        }
        downloadBlob(result, name + '.zip');
    });

    let activeDownload = false;
    let button = document.createElement('button');
    button.className = 'themed___PBHap primary-theme___q1d2u no-border___6w-uL themed-control___KmjCR no-underline___h2l-L page-control___rxMPx';
    button.textContent = 'Download Folder';
    button.style.position = 'fixed';
    button.style.zIndex = '10000';
    button.style.top = '5px';
    button.style.right = '5px';
    button.style.display = 'none';
    button.onclick = async () => {
        if (activeDownload) {
            return;
        }
        activeDownload = true;
        button.textContent = 'Starting...';
        try {
            await downloadFolder(progress => {
                button.textContent = progress;
            });
        } catch (e) {
            alert('An error occurred while downloading the folder: ' + e.message);
        }
        activeDownload = false;
        button.textContent = 'Download Folder';
    };

    document.body.appendChild(button);

    setInterval(() => {
        if (window.location.pathname.startsWith('/dashboard/files')) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    }, 250);
})();

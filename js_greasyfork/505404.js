// ==UserScript==
// @name         ShareCODE
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  asaasda EYAN
// @author       HydroGest
// @license      MIT
// @match        http://121.36.38.167/
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/505404/ShareCODE.user.js
// @updateURL https://update.greasyfork.org/scripts/505404/ShareCODE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const menuDiv = document.querySelectorAll('.menu')[2];
    if (menuDiv) {
        const newItem = document.createElement('div');
        newItem.className = 'item';
        newItem.innerHTML = '<i class="closed captioning icon"></i>加载共享文件';
        newItem.addEventListener('click', loadSharedFile);
        menuDiv.appendChild(newItem);
    }


    function loadSharedFile() {
        const pcode = prompt('请输入取件码');
        if (!pcode) {
            alert("错误的取件码！");
            return;
        }
        const code = getPublicCode(pcode);
        if (code) {
            sourceEditor.setValue(code);
        }
    }

    function generateRandomCode(length = 6) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    function savePublicCode(code) {
        const pickUpCode = generateRandomCode();
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);
        // 使用 GM_setValue 来模拟 localStorage.setItem
        GM_setValue(pickUpCode, JSON.stringify({ code, expirationDate }));
        return pickUpCode;
    }

    function getPublicCode(pickUpCode) {
        const storedData = GM_getValue(pickUpCode);
        if (!storedData) {
            return null;
        }
        const { code, expirationDate } = JSON.parse(storedData);
        const currentDate = new Date();
        if (currentDate > expirationDate) {
            GM_deleteValue(pickUpCode);
            return null;
        }
        return code;
    }

    function shareFile(filename) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `/load_file_content?filename=${encodeURIComponent(filename)}`,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (data.success) {
                    console.log(data.code);
                    const code = savePublicCode(data.code);
                    alert(`代码分享成功！取件码：${code}`);
                } else {
                    alert('Failed to load file content: ' + data.message);
                }
            },
            onerror: function(error) {
                console.error('Error:', error);
                alert('An error occurred while loading file content.');
            }
        });
    }


    // 渲染文件列表
    function renderFileList() {
        const data = fileListData;
        const currentPage = fileListCurPage;

        console.log(data, currentPage);

        if (!data) {
            showFileList();
            return;
        }
        const fileListDiv = document.getElementById('file-list');
        fileListDiv.innerHTML = '';

        // 计算总页数
        const totalItems = data.files.length;
        const itemsPerPage = 8;
        totalPages = Math.ceil(totalItems / itemsPerPage);

        // 对文件列表按时间倒序排序
        data.files.sort((a, b) => new Date(b.created_time) - new Date(a.created_time));

        // 创建文件列表并进行分页显示
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

        document.getElementById("cur-page").setAttribute("data-text", currentPage + "/" + totalPages);

        for (let i = startIndex; i < endIndex; i++) {
            const file = data.files[i];
            const fileItemDiv = document.createElement('div');
            fileItemDiv.className = 'item';
            fileItemDiv.style.display = 'flex';
            fileItemDiv.style.alignItems = 'center';
            fileItemDiv.style.justifyContent = 'space-between';
            fileItemDiv.style.marginBottom = '10px';

            const fileName = document.createElement('div');
            fileName.classList.add('content');
            fileName.style.flexGrow = '1';

            const filename = file.filename;
            const date = new Date(file.created_time.replace('GMT', 'UTC+8:00'));
            const time = date.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

            // 创建包含编号和文件名的容器
            const fileInfoDiv = document.createElement('div');
            fileInfoDiv.style.display = 'flex';
            fileInfoDiv.style.alignItems = 'center';

            // 添加编号
            const fileNumber = document.createElement('span');
            fileNumber.textContent = `${i + 1}.  `;
            fileNumber.style.color = '#000';
            fileNumber.style.fontWeight = 'bold';

            // 添加文件名
            const fileTitle = document.createElement('span');
            fileTitle.textContent = filename;
            fileTitle.style.color = '#007bff';

            // 将编号和文件名添加到容器中
            fileInfoDiv.appendChild(fileNumber);
            fileInfoDiv.appendChild(fileTitle);

            fileName.innerHTML = `
                                ${fileInfoDiv.outerHTML}
                                <div class="description">上次修改时间：${time}</div>
                            `;

            const icon = document.createElement('i');
            icon.className = "large file middle aligned icon";

            const fileManage = document.createElement('div');
            fileManage.className = "right floated content";
            fileManage.style.display = 'flex';
            fileManage.style.gap = '10px';

            const fileButton = document.createElement('div');
            fileButton.className = 'ui button compact';
            fileButton.innerHTML = `<i class="folder open icon"></i>加载`;
            fileButton.style.writingMode = 'horizontal-tb';
            fileButton.style.whiteSpace = 'nowrap';
            fileButton.onclick = () => loadFileContent(file.filename);

            const deleteButton = document.createElement('div');
            deleteButton.className = 'ui red button compact';
            deleteButton.innerHTML = '<i class="trash icon"></i>';
            deleteButton.style.writingMode = 'horizontal-tb';
            deleteButton.style.whiteSpace = 'nowrap';
            deleteButton.onclick = () => deleteFile(file.filename, false);

            const shareButton = document.createElement('div');
            shareButton.className = 'ui button compact';
            shareButton.innerHTML = '<i class="share icon"></i>分享';
            shareButton.style.writingMode = 'horizontal-tb';
            shareButton.style.whiteSpace = 'nowrap';
            shareButton.onclick = () => shareFile(file.filename);

            const manageButtons = document.createElement('div');
            manageButtons.className = "ui buttons";

            manageButtons.appendChild(fileButton);
            manageButtons.appendChild(shareButton);
            manageButtons.appendChild(deleteButton);
            fileManage.append(manageButtons);

            fileItemDiv.appendChild(icon);
            fileItemDiv.appendChild(fileName);
            fileItemDiv.appendChild(fileManage);
            fileListDiv.appendChild(fileItemDiv);
        }
    }

    unsafeWindow.renderFileList = renderFileList;

})();
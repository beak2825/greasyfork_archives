// ==UserScript==
// @name         KDocs 金山文档文件批量下载工具
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在KDocs页面右下角添加按钮，可选择文件并打包下载，显示下载进度
// @author       Omen
// @match        https://www.kdocs.cn/*
// @exclude      https://www.kdocs.cn/l/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @license      GPLv3
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kdocs.cn
// @downloadURL https://update.greasyfork.org/scripts/537680/KDocs%20%E9%87%91%E5%B1%B1%E6%96%87%E6%A1%A3%E6%96%87%E4%BB%B6%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/537680/KDocs%20%E9%87%91%E5%B1%B1%E6%96%87%E6%A1%A3%E6%96%87%E4%BB%B6%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const CONCURRENCY_LIMIT = 5; // 并发下载数，可根据需要调整

    // 创建主按钮
    const mainButton = document.createElement('button');
    mainButton.textContent = '显示文件列表';
    mainButton.style.position = 'fixed';
    mainButton.style.bottom = '20px';
    mainButton.style.right = '20px';
    mainButton.style.zIndex = '9999';
    mainButton.style.padding = '10px 15px';
    mainButton.style.backgroundColor = '#4CAF50';
    mainButton.style.color = 'white';
    mainButton.style.border = 'none';
    mainButton.style.borderRadius = '4px';
    mainButton.style.cursor = 'pointer';
    mainButton.style.fontSize = '14px';
    document.body.appendChild(mainButton);

    // 创建全屏UI容器
    const overlay = document.createElement('div');
    overlay.style.display = 'none';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.9)';
    overlay.style.zIndex = '9998';
    overlay.style.overflow = 'auto';
    overlay.style.padding = '20px';
    overlay.style.boxSizing = 'border-box';
    overlay.style.color = '#fff';
    document.body.appendChild(overlay);

    // 关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.style.position = 'fixed';
    closeButton.style.top = '20px';
    closeButton.style.right = '20px';
    closeButton.style.zIndex = '9999';
    closeButton.style.padding = '10px 15px';
    closeButton.style.backgroundColor = '#f44336';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    overlay.appendChild(closeButton);

    // 标题
    const title = document.createElement('h1');
    title.textContent = '文件列表';
    title.style.marginTop = '0';
    overlay.appendChild(title);

    // 并发数配置输入
    const concurrencyControl = document.createElement('div');
    concurrencyControl.style.margin = '10px 0';
    concurrencyControl.innerHTML = `
        <label for="concurrencyInput">并发下载数 (1-10): </label>
        <input type="number" id="concurrencyInput" min="1" max="10" value="${CONCURRENCY_LIMIT}" style="width: 50px;">
    `;
    overlay.appendChild(concurrencyControl);

    // 加载状态
    const loading = document.createElement('div');
    loading.textContent = '加载中...';
    loading.style.display = 'none';
    overlay.appendChild(loading);

    // 下载按钮
    const downloadButton = document.createElement('button');
    downloadButton.textContent = '下载选中文件';
    downloadButton.style.margin = '10px 0';
    downloadButton.style.padding = '8px 12px';
    downloadButton.style.backgroundColor = '#FF9800';
    downloadButton.style.color = 'white';
    downloadButton.style.border = 'none';
    downloadButton.style.borderRadius = '4px';
    downloadButton.style.cursor = 'pointer';
    downloadButton.style.display = 'none';
    overlay.appendChild(downloadButton);

    // 下载进度容器
    const progressContainer = document.createElement('div');
    progressContainer.style.margin = '10px 0';
    progressContainer.style.display = 'none';
    overlay.appendChild(progressContainer);

    // 文件列表容器
    const fileListContainer = document.createElement('div');
    fileListContainer.id = 'fileListContainer';
    overlay.appendChild(fileListContainer);

    // 全选/取消全选按钮
    const selectAllButton = document.createElement('button');
    selectAllButton.textContent = '全选';
    selectAllButton.style.margin = '10px 0';
    selectAllButton.style.padding = '8px 12px';
    selectAllButton.style.backgroundColor = '#2196F3';
    selectAllButton.style.color = 'white';
    selectAllButton.style.border = 'none';
    selectAllButton.style.borderRadius = '4px';
    selectAllButton.style.cursor = 'pointer';
    overlay.insertBefore(selectAllButton, fileListContainer);

    // 存储文件树数据
    let fileTreeData = null;
    // 存储下载失败的文件ID
    let failedDownloads = new Set();

    // 按钮点击事件
    mainButton.addEventListener('click', () => {
        overlay.style.display = 'block';
        fetchFileList();
    });

    closeButton.addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    // 下载按钮点击事件
    downloadButton.addEventListener('click', async () => {
        if (!fileTreeData) return;

        const selectedFiles = getSelectedFiles(fileTreeData);
        if (selectedFiles.length === 0) {
            alert('请先选择要下载的文件');
            return;
        }

        const concurrency = parseInt(document.getElementById('concurrencyInput').value) || CONCURRENCY_LIMIT;
        failedDownloads = new Set(); // 重置失败文件集合
        await downloadAndZipFiles(selectedFiles, concurrency);
        renderFileTree(fileTreeData); // 重新渲染文件树以标记失败文件
    });

    // 全选/取消全选逻辑
    selectAllButton.addEventListener('click', () => {
        if (!fileTreeData) return;

        const newState = !isEverythingSelected(fileTreeData);
        setSelectionState(fileTreeData, newState);
        renderFileTree(fileTreeData);
    });

    // 检查是否所有项目都被选中
    function isEverythingSelected(node) {
        if (node.checked === false) return false;

        if (node.children && node.children.length > 0) {
            return node.children.every(child => isEverythingSelected(child));
        }

        return node.checked === true;
    }

    // 设置所有节点的选中状态
    function setSelectionState(node, state) {
        node.checked = state;

        if (node.children && node.children.length > 0) {
            node.children.forEach(child => setSelectionState(child, state));
        }
    }

    // 获取选中的文件列表
    function getSelectedFiles(node, path = '') {
        let selectedFiles = [];

        if (node.checked === true && node.type !== 'folder') {
            selectedFiles.push({
                id: node.id,
                groupid: node.groupid,
                name: node.name,
                path: path,
                type: node.type
            });
        }

        if (node.children && node.children.length > 0) {
            const newPath = path ? `${path}/${node.name}` : node.name;
            node.children.forEach(child => {
                selectedFiles = selectedFiles.concat(getSelectedFiles(child, node.type === 'folder' ? newPath : path));
            });
        }

        return selectedFiles;
    }

    // 获取文件列表
    async function fetchFileList() {
        fileListContainer.innerHTML = '';
        downloadButton.style.display = 'none';
        progressContainer.style.display = 'none';
        loading.style.display = 'block';

        try {
            const url = window.location.href;
            fileTreeData = { name: '根目录', children: [], id: 'root', type: 'folder', checked: false };

            if (url.includes('https://www.kdocs.cn/mine/')) {
                // 子文件夹
                const fileid = url.split('/mine/')[1].split('/')[0].split('?')[0];
                const metadata = await fetch(`https://drive.kdocs.cn/api/v5/files/${fileid}/metadata`, {
                    credentials: 'include'
                }).then(res => res.json());

                if (metadata.result === 'ok') {
                    fileTreeData.name = metadata.fileinfo.fname;
                    fileTreeData.id = fileid;
                    fileTreeData.groupid = metadata.fileinfo.groupid;

                    // 获取当前文件夹内容
                    await fetchFolderContents(fileTreeData);
                }
            } else {
                // 根目录
                await fetchRootContents(fileTreeData);
            }

            // 递归获取所有子文件夹内容
            await processFolderStack(fileTreeData);

            // 初始化选中状态
            setSelectionState(fileTreeData, false);

            // 显示文件树
            renderFileTree(fileTreeData);
            downloadButton.style.display = 'block';
        } catch (error) {
            console.error('获取文件列表失败:', error);
            fileListContainer.innerHTML = `<div style="color: red;">获取文件列表失败: ${error.message}</div>`;
        } finally {
            loading.style.display = 'none';
        }
    }

    // 获取根目录内容
    async function fetchRootContents(parentNode) {
        const response = await fetch('https://drive.kdocs.cn/api/v5/groups/special/files?linkgroup=true&include=pic_thumbnail&with_link=true&review_pic_thumbnail=true&with_sharefolder_type=true&offset=0&count=99999&order=DESC&orderby=mtime&exclude_exts=&include_exts=', {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.result === 'ok') {
            parentNode.children = data.files.map(file => ({
                id: file.id,
                groupid: file.groupid,
                parentid: file.parentid,
                name: file.fname,
                type: file.ftype,
                size: file.fsize,
                mtime: new Date(file.mtime * 1000).toLocaleString(),
                link_url: file.link_url || '',
                children: [],
                checked: false
            }));
        }
    }

    // 获取文件夹内容
    async function fetchFolderContents(folderNode) {
        const response = await fetch(`https://drive.kdocs.cn/api/v5/groups/${folderNode.groupid}/files?linkgroup=true&parentid=${folderNode.id}&include=&with_link=true&review_pic_thumbnail=true&offset=0&count=99999&order=DESC&orderby=mtime&exclude_exts=&include_exts=`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.result === 'ok') {
            folderNode.children = data.files.map(file => ({
                id: file.id,
                groupid: file.groupid,
                parentid: file.parentid,
                name: file.fname,
                type: file.ftype,
                size: file.fsize,
                mtime: new Date(file.mtime * 1000).toLocaleString(),
                link_url: file.link_url || '',
                children: [],
                checked: false
            }));
        }
    }

    // 处理文件夹栈，递归获取所有子文件夹内容
    async function processFolderStack(rootNode) {
        const stack = [...rootNode.children.filter(node => node.type === 'folder')];

        while (stack.length > 0) {
            const folderNode = stack.pop();
            await fetchFolderContents(folderNode);

            // 将子文件夹加入栈中
            const subFolders = folderNode.children.filter(node => node.type === 'folder');
            stack.push(...subFolders);
        }
    }

    // 渲染文件树
    function renderFileTree(treeData) {
        fileListContainer.innerHTML = '';

        const treeContainer = document.createElement('div');
        treeContainer.style.fontFamily = 'Arial, sans-serif';
        treeContainer.style.lineHeight = '1.5';

        // 计算每个节点的选中状态
        updateCheckboxStates(treeData);

        function createTreeNode(node, level = 0) {
            const nodeElement = document.createElement('div');
            nodeElement.style.marginLeft = `${3}px`;
            nodeElement.style.marginBottom = '5px';

            // 创建复选框和标签
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `file-${node.id}`;
            checkbox.style.marginRight = '8px';
            checkbox.checked = node.checked === true;
            checkbox.indeterminate = node.checked === 'indeterminate';
            checkbox.dataset.nodeId = node.id;

            // 复选框点击事件
            checkbox.addEventListener('change', function() {
                // 如果是文件夹且子项全部已选中，则变为全不选
                if (node.type === 'folder' && isEverythingSelected(node)) {
                    setSelectionState(node, false);
                } else {
                    // 否则设置当前节点的选中状态
                    node.checked = this.checked;

                    // 如果是文件夹且被选中，选中所有子项
                    if (node.type === 'folder' && this.checked) {
                        setSelectionState(node, true);
                    }
                }

                // 重新渲染整个树以更新所有复选框状态
                renderFileTree(treeData);
            });

            const label = document.createElement('label');
            label.htmlFor = `file-${node.id}`;
            label.style.cursor = 'pointer';

            // 图标和名称
            const icon = document.createElement('span');
            icon.style.marginRight = '5px';
            icon.textContent = node.type === 'folder' ? '📁' : '📄';

            const nameSpan = document.createElement('span');
            nameSpan.textContent = `${node.name}`;

            // 标记下载失败的文件
            if (failedDownloads.has(node.id)) {
                nameSpan.style.color = 'red';
                nameSpan.textContent += ' (下载失败)';
            }

            if (node.type !== 'folder' && node.link_url) {
                const link = document.createElement('a');
                link.href = node.link_url;
                link.textContent = ' 🔗';
                link.style.marginLeft = '5px';
                link.style.color = '#4CAF50';
                link.target = '_blank';
                nameSpan.appendChild(link);
            }

            // 文件信息
            const infoSpan = document.createElement('span');
            infoSpan.style.marginLeft = '10px';
            infoSpan.style.color = '#aaa';
            infoSpan.style.fontSize = '0.9em';
            infoSpan.textContent = `[${node.type === 'folder' ? '文件夹' : formatFileSize(node.size)} - 修改时间: ${node.mtime}]`;

            label.appendChild(icon);
            label.appendChild(nameSpan);
            label.appendChild(infoSpan);

            nodeElement.appendChild(checkbox);
            nodeElement.appendChild(label);

            // 如果有子节点，递归创建
            if (node.children && node.children.length > 0) {
                const childrenContainer = document.createElement('div');
                childrenContainer.style.marginLeft = '20px';
                childrenContainer.style.marginTop = '5px';

                node.children.forEach(child => {
                    childrenContainer.appendChild(createTreeNode(child, level + 1));
                });

                nodeElement.appendChild(childrenContainer);
            }

            return nodeElement;
        }

        treeContainer.appendChild(createTreeNode(treeData));
        fileListContainer.appendChild(treeContainer);
    }

    // 更新所有复选框状态（递归）
    function updateCheckboxStates(node) {
        if (node.type === 'folder' && node.children && node.children.length > 0) {
            // 先更新子节点的状态
            node.children.forEach(child => updateCheckboxStates(child));

            // 然后根据子节点状态确定当前文件夹状态
            const allChecked = node.children.every(child => child.checked === true);
            const someChecked = node.children.some(child => child.checked === true || child.checked === 'indeterminate');

            if (allChecked) {
                node.checked = true;
            } else if (someChecked) {
                node.checked = 'indeterminate';
            } else {
                node.checked = false;
            }
        }
    }

    // 使用fetch下载文件并显示进度
    async function fetchWithProgress(url, onProgress) {
        const response = await fetch(url, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentLength = response.headers.get('Content-Length');
        const total = contentLength ? parseInt(contentLength) : null;
        let loaded = 0;

        const reader = response.body.getReader();
        const chunks = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            chunks.push(value);
            loaded += value.length;

            if (total && onProgress) {
                onProgress({
                    loaded,
                    total,
                    lengthComputable: true
                });
            }
        }

        // 合并所有chunks
        let combinedLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
        let combined = new Uint8Array(combinedLength);
        let position = 0;

        for (let chunk of chunks) {
            combined.set(chunk, position);
            position += chunk.length;
        }

        return combined;
    }

    // 并发控制下载函数
    async function downloadWithConcurrency(files, concurrency, progressCallback) {
        const results = [];
        const queue = [...files];
        let downloadedCount = 0;

        // 工作函数
        async function worker() {
            while (queue.length > 0) {
                const file = queue.shift();
                try {
                    // 获取下载URL
                    const downloadInfo = await fetch(`https://drive.kdocs.cn/api/v5/groups/${file.groupid}/files/${file.id}/download?isblocks=false&support_checksums=md5,sha1,sha224,sha256,sha384,sha512`, {
                        credentials: 'include'
                    }).then(res => res.json());

                    if (downloadInfo.result !== 'ok' || !downloadInfo.url) {
                        throw new Error('无法获取下载链接');
                    }

                    // 下载文件内容
                    const fileData = await fetchWithProgress(downloadInfo.url, (event) => {
                        if (event.lengthComputable) {
                            const percent = Math.round((event.loaded / event.total) * 100);
                            progressCallback({
                                type: 'progress',
                                file,
                                percent,
                                downloaded: downloadedCount,
                                total: files.length
                            });
                        }
                    });

                    downloadedCount++;
                    progressCallback({
                        type: 'complete',
                        file,
                        downloaded: downloadedCount,
                        total: files.length
                    });

                    results.push({
                        file,
                        data: fileData,
                        success: true
                    });
                } catch (error) {
                    console.error(`下载文件失败: ${file.name}`, error);
                    downloadedCount++;
                    progressCallback({
                        type: 'error',
                        file,
                        error,
                        downloaded: downloadedCount,
                        total: files.length
                    });

                    results.push({
                        file,
                        error,
                        success: false
                    });
                }
            }
        }

        // 启动多个工作线程
        const workers = Array(Math.min(concurrency, files.length)).fill(null).map(worker);
        await Promise.all(workers);

        return results;
    }

    // 下载并打包文件（使用JSZip）
    async function downloadAndZipFiles(files, concurrency = CONCURRENCY_LIMIT) {
        progressContainer.style.display = 'block';
        progressContainer.innerHTML = `
            <div>准备下载 ${files.length} 个文件 (并发数: ${concurrency})...</div>
            <progress id="totalProgress" value="0" max="${files.length}" style="width: 100%"></progress>
            <div class="status">正在初始化下载...</div>
            <div class="current-file"></div>
            <div class="zip-progress" style="margin-top: 10px; display: none;">
                <div>ZIP打包进度:</div>
                <progress id="zipProgress" value="0" max="100" style="width: 100%"></progress>
                <div class="zip-status">等待文件下载...</div>
            </div>
        `;

        const totalProgressBar = progressContainer.querySelector('#totalProgress');
        const statusText = progressContainer.querySelector('.status');
        const currentFileText = progressContainer.querySelector('.current-file');
        const zipProgressContainer = progressContainer.querySelector('.zip-progress');
        const zipProgressBar = progressContainer.querySelector('#zipProgress');
        const zipStatusText = progressContainer.querySelector('.zip-status');

        try {
            // 创建JSZip实例
            const zip = new JSZip();

            // 下载文件
            const downloadResults = await downloadWithConcurrency(files, concurrency, ({type, file, percent, downloaded, total, error}) => {
                const fullPath = file.path ? `${file.path}/${file.name}` : file.name;

                switch (type) {
                    case 'progress':
                        currentFileText.textContent = `正在下载: ${fullPath} (${percent}%)`;
                        break;
                    case 'complete':
                        totalProgressBar.value = downloaded;
                        statusText.textContent = `已下载 ${downloaded}/${total} 文件`;
                        currentFileText.textContent = `已完成: ${fullPath}`;
                        break;
                    case 'error':
                        totalProgressBar.value = downloaded;
                        statusText.textContent = `已下载 ${downloaded}/${total} 文件 (错误: ${file.name})`;
                        currentFileText.textContent = `下载失败: ${fullPath} (${error.message})`;
                        failedDownloads.add(file.id);
                        break;
                }
            });

            // 显示ZIP打包进度
            zipProgressContainer.style.display = 'block';
            zipStatusText.textContent = '正在将文件添加到ZIP...';

            // 将下载成功的文件添加到ZIP中
            let addedCount = 0;
            for (const result of downloadResults) {
                if (result.success) {
                    try {
                        const fullPath = result.file.path ? `${result.file.path}/${result.file.name}` : result.file.name;
                        zip.file(fullPath, result.data);
                        addedCount++;
                        zipProgressBar.value = Math.round((addedCount / files.length) * 100);
                        zipStatusText.textContent = `已添加 ${addedCount}/${files.length} 文件到ZIP`;
                    } catch (addError) {
                        console.error(`添加文件到ZIP失败: ${result.file.name}`, addError);
                        failedDownloads.add(result.file.id);
                    }
                }
            }

            // 如果没有成功添加任何文件
            if (addedCount === 0) {
                zipStatusText.textContent = '没有文件被添加到ZIP，跳过生成。';
                statusText.textContent = '下载完成，但没有文件成功添加到ZIP！';
                return;
            }

            // 生成ZIP文件
            zipStatusText.textContent = '正在生成ZIP文件，请稍候...';
            const zipBlob = await zip.generateAsync(
                {
                    type: 'blob',
                    compression: 'DEFLATE',
                    compressionOptions: {
                        level: 6
                    },
                    streamFiles: true
                },
                (metadata) => {
                    // 更新进度
                    zipProgressBar.value = metadata.percent;
                    zipStatusText.textContent = `生成ZIP: ${metadata.percent.toFixed(2)}% - 当前文件: ${metadata.currentFile || '无'}`;
                }
            );

            // 提供下载
            const zipUrl = URL.createObjectURL(zipBlob);
            const zipName = `KDocs文件_${new Date().toISOString().replace(/[:.]/g, '-')}.zip`;
            const downloadLink = document.createElement('a');
            downloadLink.href = zipUrl;
            downloadLink.download = zipName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            setTimeout(() => URL.revokeObjectURL(zipUrl), 100);

            statusText.textContent = `下载完成! 已保存为 ${zipName}`;
            currentFileText.textContent = '';
            zipStatusText.textContent = 'ZIP打包完成!';
        } catch (error) {
            console.error('打包下载失败:', error);
            progressContainer.innerHTML += `<div style="color: red;">打包下载失败: ${error.message}</div>`;
        }
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
})();
// ==UserScript==
// @name         图床上传脚本
// @namespace    http://21zys.com/
// @version      1.8.3
// @description  在右下角添加悬浮球，支持 S3/OSS/R2/SMMS/ImgURL 上传。配置逻辑：新安装默认全局共享，修改后自动转换为当前域名独立配置（支持按需分叉）。
// @match        *://*/*
// @author       21zys
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.13/dayjs.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuid.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505069/%E5%9B%BE%E5%BA%8A%E4%B8%8A%E4%BC%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/505069/%E5%9B%BE%E5%BA%8A%E4%B8%8A%E4%BC%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window !== window.top) return;

    // --- 核心工具：智能配置加载器 ---

    // 读取策略：优先读独立，没有则读全局
    function loadConfig(baseKey, defaultData) {
        const scopedKey = `${baseKey}_${window.location.hostname}`;

        // 1. 尝试读取独立配置
        let raw = GM_getValue(scopedKey) || localStorage.getItem(scopedKey);
        let source = 'scoped';

        // 2. 如果没有独立配置，尝试读取全局配置
        if (!raw) {
            raw = GM_getValue(baseKey) || localStorage.getItem(baseKey);
            source = 'global';
        }

        let data = null;
        try {
            data = JSON.parse(raw);
        } catch (e) {}

        // 如果全局也没有，source 实际上是 'new' (虽然归类在 global 处理逻辑中，但可以区分)
        if (!data) source = 'new';

        // 返回数据，并附带数据源标记（用于UI显示）
        return { ...defaultData, ...data, _configSource: source };
    }

    // 保存策略：如果是初次安装(无全局)，则存全局；否则存独立(分叉)
    function saveConfig(baseKey, data) {
        // 清理内部标记，不保存到存储中
        const dataToSave = { ...data };
        delete dataToSave._configSource;
        const str = JSON.stringify(dataToSave);

        // 检查全局配置是否存在
        const globalRaw = GM_getValue(baseKey) || localStorage.getItem(baseKey);

        if (!globalRaw) {
            // 场景1：新用户，没有全局配置 -> 保存为全局配置
            GM_setValue(baseKey, str);
            localStorage.setItem(baseKey, str);
            return 'global';
        } else {
            // 场景2：已有全局配置 -> 用户修改了，保存为当前域名的独立配置（分叉）
            // 场景3：已有独立配置 -> 更新独立配置
            const scopedKey = `${baseKey}_${window.location.hostname}`;
            GM_setValue(scopedKey, str);
            localStorage.setItem(scopedKey, str);
            return 'scoped';
        }
    }

    // --- 工具函数：DOM 创建 ---
    function createEl(tag, styles = {}, props = {}, parent = null) {
        const el = document.createElement(tag);
        Object.assign(el.style, styles);
        for (const key in props) {
            if (key === 'dataset') Object.assign(el.dataset, props[key]);
            else el[key] = props[key];
        }
        if (parent) parent.appendChild(el);
        return el;
    }

    // --- 工具函数：拖拽 ---
    function makeDraggable(element, storageKey, handle = null, restrictToEdge = true) {
        const target = handle || element;
        let isDragging = false, startX, startY;
        target.addEventListener('mousedown', (e) => {
            if ((handle && e.target !== handle) || (e.target !== target && e.target.parentElement !== target)) return;
            if (!handle && restrictToEdge) {
                const rect = element.getBoundingClientRect();
                const edge = 25;
                if (e.clientX - rect.left > edge && e.clientX - rect.left < element.clientWidth - edge &&
                    e.clientY - rect.top > edge && e.clientY - rect.top < element.clientHeight - edge) return;
            }
            startX = e.clientX; startY = e.clientY;
            const rect = element.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;
            const onMouseMove = (e) => {
                if (!isDragging && (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5)) isDragging = true;
                if (isDragging) {
                    element.style.left = (e.clientX - offsetX) + 'px';
                    element.style.top = (e.clientY - offsetY) + 'px';
                    element.style.right = 'auto'; element.style.bottom = 'auto'; element.style.transform = 'none';
                }
            };
            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                if (isDragging && storageKey) localStorage.setItem(storageKey, JSON.stringify({ left: element.style.left, top: element.style.top }));
                setTimeout(() => isDragging = false, 100);
            };
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    // --- 剪贴板监听逻辑 ---
    let activeUploadDialog = null; // 当前激活的对话框

    document.addEventListener('paste', (e) => {
        if (!activeUploadDialog || activeUploadDialog.style.display === 'none') return;

        // 如果用户焦点在输入框中（例如粘贴Token），不拦截
        if (e.target.tagName === 'INPUT' && (e.target.type === 'text' || e.target.type === 'password' || e.target.type === 'number')) return;
        if (e.target.tagName === 'TEXTAREA') return;

        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (activeUploadDialog.handlePaste && file) {
                    e.preventDefault();
                    activeUploadDialog.handlePaste(file);
                    // 简单的视觉闪烁反馈
                    const originalBg = activeUploadDialog.style.backgroundColor;
                    activeUploadDialog.style.backgroundColor = 'rgba(230, 255, 230, 0.95)';
                    setTimeout(() => activeUploadDialog.style.backgroundColor = originalBg, 200);
                }
                break;
            }
        }
    });

    // --- UI 组件：基础对话框 ---
    function createBaseDialog(uniqueId) {
        const posKey = `DialogPos_${uniqueId}`;
        const savedPos = JSON.parse(localStorage.getItem(posKey)) || null;
        const dialog = createEl('div', {
            position: 'fixed', width: '400px', padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.98)', borderRadius: '12px',
            backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            display: 'none', opacity: '0', zIndex: '999999', fontFamily: 'Arial, sans-serif',
            transition: 'opacity 0.2s ease',
            left: savedPos ? savedPos.left : '50%', top: savedPos ? savedPos.top : '50%',
            transform: savedPos ? 'none' : 'translate(-50%, -50%)',
            maxHeight: '85vh', overflowY: 'auto'
        }, {}, document.body);
        makeDraggable(dialog, posKey);
        createEl('span', { position: 'absolute', top: '10px', right: '15px', cursor: 'pointer', fontSize: '24px', color: '#666', lineHeight: '20px' }, { innerHTML: '&times;', onclick: () => closeDialog(dialog) }, dialog);
        return dialog;
    }

    const commonStyles = {
        label: { fontWeight: 'bold', color: '#333', display: 'inline-block', fontSize: '13px', marginBottom: '4px' },
        input: { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '95%', fontSize: '13px', boxSizing: 'border-box' },
        btn: { padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: '0.3s' }
    };

    function createInputRow(form, labelText, inputName, value = '', placeholder = '', type = 'text') {
        const wrapper = createEl('div', { marginBottom: '8px' }, {}, form);
        createEl('label', commonStyles.label, { innerText: labelText }, wrapper);
        return createEl('input', commonStyles.input, { type: type, name: inputName, value: value, placeholder: placeholder }, wrapper);
    }

    // --- UI 组件：状态标签 (新) ---
    function createStatusLabel(parent) {
        const wrapper = createEl('div', { marginBottom: '10px', padding: '6px', borderRadius: '4px', fontSize: '12px', textAlign: 'center' }, {}, parent);

        const updateText = (source) => {
            if (source === 'scoped') {
                wrapper.style.backgroundColor = '#e3f2fd'; // 蓝色
                wrapper.style.color = '#0056b3';
                wrapper.innerHTML = `正在使用: <b>${window.location.hostname} 独立配置</b>`;
            } else if (source === 'global') {
                wrapper.style.backgroundColor = '#e8f5e9'; // 绿色
                wrapper.style.color = '#2e7d32';
                wrapper.innerHTML = `正在使用: <b>全局共享配置</b> (修改保存后将转为独立配置)`;
            } else {
                wrapper.style.backgroundColor = '#fff3e0'; // 橙色
                wrapper.style.color = '#e65100';
                wrapper.innerHTML = `<b>新安装:</b> 保存后将作为全局默认配置`;
            }
        };

        return { wrapper, updateText };
    }

    function createThumbnailControl(parent, data, onSave) {
        const container = createEl('div', { marginTop: '5px', marginBottom: '5px', display: 'flex', alignItems: 'center' }, {}, parent);
        const cbId = 'cb-thumb-' + Math.random().toString(36).substr(2, 5);
        const checkbox = createEl('input', { marginRight: '5px' }, { type: 'checkbox', id: cbId, checked: data.enableThumbnail || false }, container);
        createEl('label', { color: '#333', cursor: 'pointer', marginRight: '10px', fontSize: '13px' }, { innerText: '缩略图', htmlFor: cbId }, container);

        const sizeInput = createEl('input', { width: '60px', padding: '4px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' },
            { type: 'number', value: data.thumbnailSize || 128, min: 1, disabled: !data.enableThumbnail }, container);
        createEl('span', { fontSize: '13px', color: '#666', marginLeft: '5px' }, { innerText: 'px' }, container);

        checkbox.onchange = () => { data.enableThumbnail = checkbox.checked; sizeInput.disabled = !checkbox.checked; onSave(); };
        sizeInput.oninput = () => { if (sizeInput.value > 0) { data.thumbnailSize = parseInt(sizeInput.value); onSave(); } };
    }

    // --- 文件选择与粘贴处理组件 ---
    function createFileSelector(parent, labelText) {
        const wrapper = createEl('div', { marginBottom: '8px' }, {}, parent);
        createEl('label', commonStyles.label, { innerText: labelText + ' (支持Ctrl+V粘贴)' }, wrapper);

        const fileInput = createEl('input', commonStyles.input, { type: 'file' }, wrapper);
        const statusSpan = createEl('div', { fontSize: '12px', color: '#666', marginTop: '2px', height: '16px', lineHeight: '16px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }, { innerText: '未选择文件' }, wrapper);

        let pastedFile = null;

        fileInput.onchange = () => {
            if (fileInput.files.length) {
                pastedFile = null; // 清除粘贴的文件
                statusSpan.innerText = `已选文件: ${fileInput.files[0].name}`;
                statusSpan.style.color = '#333';
            } else {
                statusSpan.innerText = '未选择文件';
            }
        };

        const handlePaste = (file) => {
            pastedFile = file;
            fileInput.value = ''; // 清空 input 选择
            const size = (file.size / 1024).toFixed(1) + 'KB';
            statusSpan.innerHTML = `📷 <b>已捕获剪贴板图片</b> (大小: ${size})`;
            statusSpan.style.color = '#28a745';
        };

        const getFile = () => {
            return pastedFile || (fileInput.files.length ? fileInput.files[0] : null);
        };

        const clear = () => {
            fileInput.value = '';
            pastedFile = null;
            statusSpan.innerText = '未选择文件';
            statusSpan.style.color = '#666';
        };

        return { wrapper, getFile, handlePaste, clear };
    }

    // --- 悬浮球布局 ---
    const savedBallPos = JSON.parse(localStorage.getItem('floatingBallPosition')) || { right: '30px', bottom: '30px' };
    const floatingContainer = createEl('div', {
        position: 'fixed', right: savedBallPos.right, bottom: savedBallPos.bottom,
        left: savedBallPos.left || 'auto', top: savedBallPos.top || 'auto',
        width: '50px', height: '50px', zIndex: '99990'
    }, {}, document.body);
    makeDraggable(floatingContainer, 'floatingBallPosition', null, false);

    const floatingBall = createEl('div', {
        width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#007bff',
        color: '#fff', textAlign: 'center', lineHeight: '50px', cursor: 'pointer',
        fontSize: '24px', userSelect: 'none', boxShadow: '2px 2px 8px rgba(0,0,0,0.2)', position: 'relative'
    }, { innerHTML: '+' }, floatingContainer);

    const createSubBtn = (icon, x, y, onClick) => {
        const btn = createEl('div', {
            position: 'absolute', left: x, top: y, width: '40px', height: '40px',
            background: icon.startsWith('http') ? `url('${icon}') no-repeat center center` : 'white',
            backgroundSize: 'contain', backgroundColor: '#fff', borderRadius: '50%',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)', cursor: 'pointer', display: 'none', zIndex: '-1',
            textAlign: 'center', lineHeight: '40px', fontSize: '12px', color: '#333', fontWeight: 'bold'
        }, { innerText: icon.startsWith('http') ? '' : icon }, floatingBall);
        btn.onclick = (e) => { e.stopPropagation(); onClick(); };
        return btn;
    };

    const imgUrlBtn = createSubBtn('https://www.imgurl.org/favicon.ico', '-35px', '-15px', () => openDialog(initImgUrlDialog()));
    const smmsBtn = createSubBtn('https://smms.app/favicon-32x32.png', '5px', '-40px', () => openDialog(initSmmsDialog()));
    const s3Btn = createSubBtn('S3', '47px', '-15px', () => openDialog(initS3Dialog()));
    Object.assign(s3Btn.style, { color: '#ff9900' });

    floatingContainer.onmouseenter = () => [imgUrlBtn, smmsBtn, s3Btn].forEach(b => { b.style.display = 'block'; setTimeout(() => b.style.zIndex = '99999', 0); });
    floatingContainer.onmouseleave = () => [imgUrlBtn, smmsBtn, s3Btn].forEach(b => b.style.display = 'none');

    // --- 窗口管理 ---
    let dialogs = {};

    function openDialog(dialog) {
        Object.values(dialogs).forEach(d => { if (d && d !== dialog) closeDialog(d); });
        if (dialog.dataset.closeTimer) { clearTimeout(dialog.dataset.closeTimer); delete dialog.dataset.closeTimer; }
        dialog.style.display = 'block';
        dialog.offsetHeight;
        dialog.style.opacity = '1';
        activeUploadDialog = dialog; // 标记当前活动窗口，供粘贴事件使用
    }

    function closeDialog(dialog) {
        dialog.style.opacity = '0';
        const timerId = setTimeout(() => {
            dialog.style.display = 'none';
            delete dialog.dataset.closeTimer;
            if (activeUploadDialog === dialog) activeUploadDialog = null;
        }, 300);
        dialog.dataset.closeTimer = timerId;
    }

    function setupResultArea(dialog, initialTab, onTabChange) {
        const tabBox = createEl('div', { display: 'flex', marginTop: '10px' }, {}, dialog);
        const resBox = createEl('div', { marginTop: '5px' }, {}, dialog);
        const input = createEl('input', { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', boxSizing: 'border-box' }, { readOnly: true, placeholder: '上传结果' }, resBox);
        input.onclick = () => { if(input.value) { GM_setClipboard(input.value); const old = input.value; input.value = '已复制!'; setTimeout(() => input.value = old, 1000); }};

        let curTab = initialTab;
        const tabs = ['MarkDown', 'HTML', 'imgURL', 'BBCode'];
        const btns = [];
        const update = () => {
            const url = input.dataset.url; if(!url) return;
            const map = { HTML: `<img src="${url}" alt="img">`, imgURL: url, MarkDown: `![image](${url})`, BBCode: `[IMG]${url}[/IMG]` };
            input.value = map[curTab] || url;
        };
        tabs.forEach(t => {
            const b = createEl('button', { flex: '1', padding: '5px', border: '1px solid #ccc', background: t===curTab?'#007bff':'#f8f9fa', color: t===curTab?'#fff':'#333', cursor: 'pointer', fontSize:'12px' }, { textContent: t }, tabBox);
            b.onclick = (e) => { e.preventDefault(); curTab = t; onTabChange(t); btns.forEach(btn => Object.assign(btn.style, {background: btn.textContent===t?'#007bff':'#f8f9fa', color: btn.textContent===t?'#fff':'#333'})); update(); };
            btns.push(b);
        });
        return { input, update };
    }

    function createProgress() {
        const div = createEl('div', { marginTop: '10px', display: 'none' });
        const bar = createEl('progress', { width: '100%', height: '15px' }, { value: 0, max: 100 }, div);
        return { div, bar };
    }

    // --- S3 Dialog ---
    function initS3Dialog() {
        if (dialogs.s3) return dialogs.s3;
        const BASE_KEY = 'S3Config';
        const defaultData = {
            endpoint: '', region: 'auto', bucket: '', accessKeyId: '', secretAccessKey: '', folder: 'img/',
            customDomain: '', renamePattern: '{Y}{m}{d}_{md5-16}', enableThumbnail: false, thumbnailSize: 128,
            uploadCount: 0, uploadDate: dayjs().format('YYYY-MM-DD'), selectedTab: 'MarkDown', autoIncrement: 0
        };

        const dialog = createBaseDialog('S3');
        createEl('h3', { textAlign: 'center', margin: '0 0 10px 0', fontSize: '16px' }, { innerText: 'S3 兼容对象存储' }, dialog);

        const statusLabel = createStatusLabel(dialog); // 添加状态标签

        let currentData = loadConfig(BASE_KEY, defaultData);
        statusLabel.updateText(currentData._configSource);

        const form = createEl('form', {}, { method: 'post' }, dialog);
        const details = createEl('details', { border: '1px solid #eee', padding: '5px', borderRadius: '4px', marginBottom: '10px' }, { open: true }, form);
        createEl('summary', { cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }, { innerText: '参数配置' }, details);

        const epInput = createInputRow(details, 'Endpoint:', 'ep', currentData.endpoint);
        const bucketInput = createInputRow(details, 'Bucket:', 'bucket', currentData.bucket);
        const regionInput = createInputRow(details, 'Region:', 'region', currentData.region);
        const akInput = createInputRow(details, 'AccessKey:', 'ak', currentData.accessKeyId);
        const skInput = createInputRow(details, 'SecretKey:', 'sk', currentData.secretAccessKey, '', 'password');
        const folderInput = createInputRow(details, '路径:', 'folder', currentData.folder);
        const domainInput = createInputRow(details, '自定义域名:', 'domain', currentData.customDomain);
        const renameInput = createInputRow(form, '重命名规则:', 'rename', currentData.renamePattern);

        createThumbnailControl(form, currentData, () => saveData());

        const fileSelector = createFileSelector(form, '选择文件');
        dialog.handlePaste = fileSelector.handlePaste;

        const btnBox = createEl('div', { marginTop: '10px', textAlign: 'right' }, {}, form);
        const countLabel = createEl('span', { fontSize: '12px', color: '#666', marginRight: '10px' }, { innerText: `今日: ${getDateCount(currentData)}` }, btnBox);
        const upBtn = createEl('input', { ...commonStyles.btn, background: '#ff9900', color: '#fff', marginRight: '5px' }, { type: 'submit', value: '上传' }, btnBox);
        const clBtn = createEl('input', { ...commonStyles.btn, background: '#6c757d', color: '#fff' }, { type: 'button', value: '清空' }, btnBox);

        const { div: progDiv, bar: progBar } = createProgress(); dialog.appendChild(progDiv);
        const { input: resInput, update: resUpdate } = setupResultArea(dialog, currentData.selectedTab || 'MarkDown', (t) => { currentData.selectedTab = t; saveData(); });

        function getDateCount(data) {
            if (data.uploadDate !== dayjs().format('YYYY-MM-DD')) { data.uploadDate = dayjs().format('YYYY-MM-DD'); data.uploadCount = 0; }
            return data.uploadCount;
        }
        function saveData() {
            const newSource = saveConfig(BASE_KEY, currentData);
            statusLabel.updateText(newSource); // 保存后更新UI状态
        }

        clBtn.onclick = () => { fileSelector.clear(); resInput.value = ''; delete resInput.dataset.url; };

        form.onsubmit = (e) => {
            e.preventDefault();
            currentData.endpoint = epInput.value.trim(); currentData.bucket = bucketInput.value.trim();
            currentData.region = regionInput.value.trim(); currentData.accessKeyId = akInput.value.trim();
            currentData.secretAccessKey = skInput.value.trim(); currentData.folder = folderInput.value.trim();
            currentData.customDomain = domainInput.value.trim().replace(/\/$/, ''); currentData.renamePattern = renameInput.value.trim();
            currentData.autoIncrement = (currentData.autoIncrement || 0) + 1;
            saveData();

            if (!currentData.endpoint || !currentData.bucket) return alertRes(resInput, '配置不全', 'red');
            const file = fileSelector.getFile();
            if (!file) return alertRes(resInput, '请选文件', 'red');

            processImage(file, currentData, (blob) => {
                const fname = superRename(file.name || 'image.png', currentData.renamePattern, currentData.autoIncrement);
                uploadToS3(blob, fname, currentData, {
                    onProgress: (p) => { progDiv.style.display = 'block'; progBar.value = p; },
                    onSuccess: (url) => {
                        progDiv.style.display = 'none'; currentData.uploadCount++; saveData();
                        countLabel.textContent = `今日: ${currentData.uploadCount}`; handleSuccess(resInput, resUpdate, url);
                    },
                    onError: (msg) => { progDiv.style.display = 'none'; alertRes(resInput, msg, 'red'); }
                });
            });
        };
        dialogs.s3 = dialog; return dialog;
    }

    // --- SM.MS Dialog ---
    function initSmmsDialog() {
        if (dialogs.smms) return dialogs.smms;
        const BASE_KEY = 'SmmsConfig';
        const defaultData = { token: '', water: '', renamePattern: '', selectedTab: 'imgURL', uploadCount: 0, enableThumbnail: false, thumbnailSize: 128 };
        const dialog = createBaseDialog('SMMS');
        createEl('h3', { textAlign: 'center', margin: '0 0 10px 0' }, { innerText: 'SM.MS 图床' }, dialog);

        const statusLabel = createStatusLabel(dialog);

        let currentData = loadConfig(BASE_KEY, defaultData);
        statusLabel.updateText(currentData._configSource);

        const form = createEl('form', { display: 'grid', gap: '8px' }, { method: 'post' }, dialog);
        const tokenInput = createInputRow(form, 'Token:', 'token', currentData.token);
        const waterInput = createInputRow(form, '水印:', 'water', currentData.water);
        const renameInput = createInputRow(form, '重命名:', 'rename', currentData.renamePattern);
        createThumbnailControl(form, currentData, () => saveData());

        const fileSelector = createFileSelector(form, '文件');
        dialog.handlePaste = fileSelector.handlePaste;

        const upBtn = createEl('input', { ...commonStyles.btn, background: '#007bff', color: '#fff', justifySelf: 'end' }, { type: 'submit', value: '上传' }, form);

        const { div: prog, bar } = createProgress(); dialog.appendChild(prog);
        const { input: resInput, update: resUpdate } = setupResultArea(dialog, currentData.selectedTab || 'imgURL', t => { currentData.selectedTab = t; saveData(); });

        function saveData() {
            const newSource = saveConfig(BASE_KEY, currentData);
            statusLabel.updateText(newSource);
        }

        form.onsubmit = (e) => {
            e.preventDefault();
            currentData.token = tokenInput.value.trim(); currentData.water = waterInput.value.trim(); currentData.renamePattern = renameInput.value.trim();
            saveData();

            const file = fileSelector.getFile();
            if (!file) return alertRes(resInput, 'No File', 'red');

            processImage(file, currentData, (blob) => {
                prog.style.display = 'block'; const fd = new FormData();
                fd.append('smfile', blob, superRename(file.name || 'image.png', currentData.renamePattern, Date.now()));
                fd.append('format', 'json');
                GM_xmlhttpRequest({ method: 'POST', url: 'https://sm.ms/api/v2/upload', headers: { 'Authorization': currentData.token }, data: fd, upload: { onprogress: e => bar.value = (e.loaded/e.total)*100 }, onload: r => {
                    prog.style.display = 'none'; try { const d = JSON.parse(r.responseText);
                    if(d.success) handleSuccess(resInput, resUpdate, d.data.url);
                    else if(d.code==='image_repeated') handleSuccess(resInput, resUpdate, d.images);
                    else alertRes(resInput, d.message, 'red'); } catch(e){ alertRes(resInput, 'Error', 'red'); }
                }});
            });
        };
        dialogs.smms = dialog; return dialog;
    }

    // --- ImgURL Dialog ---
    function initImgUrlDialog() {
        if (dialogs.imgurl) return dialogs.imgurl;
        const BASE_KEY = 'ImgUrlConfig';
        const defaultData = { uid: '', token: '', water: '', selectedTab: 'imgURL', albumList: [] };
        const dialog = createBaseDialog('ImgURL');
        createEl('h3', { textAlign: 'center', margin: '0 0 10px 0' }, { innerText: 'ImgURL 图床' }, dialog);

        const statusLabel = createStatusLabel(dialog);

        let currentData = loadConfig(BASE_KEY, defaultData);
        statusLabel.updateText(currentData._configSource);

        const form = createEl('form', { display: 'grid', gap: '8px' }, { method: 'post' }, dialog);
        const uidInput = createInputRow(form, 'UID:', 'uid', currentData.uid);
        const tokenInput = createInputRow(form, 'Token:', 'token', currentData.token);

        const albumSelect = createEl('select', { width: '100%', padding: '5px', marginBottom: '5px' }, {}, form);
        const loadAlbums = () => {
            albumSelect.innerHTML = '<option value="default">默认相册</option>';
            (currentData.albumList||[]).forEach(a => createEl('option', {}, { value: a.album_id, textContent: a.name }, albumSelect));
            albumSelect.value = currentData.selectedAlbumId || 'default';
        };
        loadAlbums();

        createEl('button', { ...commonStyles.btn, background: '#eee', fontSize: '12px', padding: '4px' }, { type: 'button', innerText: '刷新相册', onclick: () => {
             const fd = new FormData(); fd.append('uid', uidInput.value); fd.append('token', tokenInput.value);
             GM_xmlhttpRequest({ method: 'POST', url: 'https://www.imgurl.org/api/v2/albums', data: fd, onload: r => { try{ const d=JSON.parse(r.responseText); if(d.data){ currentData.albumList = d.data; saveData(); loadAlbums(); } }catch(e){} } });
        }}, form);

        const waterInput = createInputRow(form, '水印:', 'water', currentData.water);
        createThumbnailControl(form, currentData, () => saveData());

        const fileSelector = createFileSelector(form, '文件');
        dialog.handlePaste = fileSelector.handlePaste;

        const upBtn = createEl('input', { ...commonStyles.btn, background: '#007bff', color: '#fff', justifySelf: 'end' }, { type: 'submit', value: '上传' }, form);

        const { div: prog, bar } = createProgress(); dialog.appendChild(prog);
        const { input: resInput, update: resUpdate } = setupResultArea(dialog, currentData.selectedTab || 'imgURL', t => { currentData.selectedTab = t; saveData(); });

        function saveData() {
            const newSource = saveConfig(BASE_KEY, currentData);
            statusLabel.updateText(newSource);
        }

        form.onsubmit = (e) => {
            e.preventDefault();
            currentData.uid = uidInput.value; currentData.token = tokenInput.value; currentData.water = waterInput.value;
            currentData.selectedAlbumId = albumSelect.value;
            saveData();

            const file = fileSelector.getFile();
            if (!file) return alertRes(resInput, 'No File', 'red');

            processImage(file, currentData, (blob) => {
                prog.style.display = 'block'; const fd = new FormData();
                fd.append('file', blob, file.name || 'image.png'); fd.append('uid', currentData.uid); fd.append('token', currentData.token);
                if(currentData.selectedAlbumId !== 'default') fd.append('album_id', currentData.selectedAlbumId);
                GM_xmlhttpRequest({ method: 'POST', url: 'https://www.imgurl.org/api/v2/upload', data: fd, upload: { onprogress: e => bar.value = (e.loaded/e.total)*100 }, onload: r => {
                    prog.style.display = 'none'; try{ const d=JSON.parse(r.responseText); if(d.data?.url) handleSuccess(resInput, resUpdate, d.data.url); else alertRes(resInput, d.msg, 'red'); }catch(e){ alertRes(resInput, 'Error', 'red'); }
                }});
            });
        };
        dialogs.imgurl = dialog; return dialog;
    }

    // --- S3 Upload Core ---
    function uploadToS3(blob, name, conf, cbs) {
        let ep = conf.endpoint.startsWith('http') ? conf.endpoint : 'https://'+conf.endpoint; ep = ep.replace(/\/$/, '');
        const host = new URL(ep).host; const key = (conf.folder.replace(/^\/|\/$/g, '') + '/' + name).replace(/^\//, '');
        const url = `${ep}/${conf.bucket}/${key}`;
        const now = dayjs(); const amzDate = now.utc().format('YYYYMMDD[T]HHmmss[Z]'); const dateStr = now.utc().format('YYYYMMDD');
        const payload = 'UNSIGNED-PAYLOAD';
        const canReq = `PUT\n/${conf.bucket}/${encodeURI(key)}\n\nhost:${host}\nx-amz-content-sha256:${payload}\nx-amz-date:${amzDate}\n\nhost;x-amz-content-sha256;x-amz-date\n${payload}`;
        const scope = `${dateStr}/${conf.region||'us-east-1'}/s3/aws4_request`;
        const signKey = (k, d, r, s) => {
            const h = (d, k) => CryptoJS.HmacSHA256(d, k);
            return h("aws4_request", h("s3", h(r, h(d, "AWS4" + k))));
        };
        const signature = CryptoJS.HmacSHA256(`AWS4-HMAC-SHA256\n${amzDate}\n${scope}\n${CryptoJS.SHA256(canReq).toString(CryptoJS.enc.Hex)}`, signKey(conf.secretAccessKey, dateStr, conf.region||'us-east-1', 's3')).toString(CryptoJS.enc.Hex);
        const auth = `AWS4-HMAC-SHA256 Credential=${conf.accessKeyId}/${scope}, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=${signature}`;

        GM_xmlhttpRequest({
            method: 'PUT', url: url, headers: { 'Authorization': auth, 'x-amz-date': amzDate, 'x-amz-content-sha256': payload, 'Content-Type': blob.type },
            data: blob, upload: { onprogress: e => cbs.onProgress((e.loaded/e.total)*100) },
            onload: r => (r.status>=200&&r.status<300) ? cbs.onSuccess(conf.customDomain ? `${conf.customDomain}/${key}`.replace(/([^:]\/)\/+/g, "$1") : url) : cbs.onError('Err:'+r.status),
            onerror: () => cbs.onError('Net Err')
        });
    }

    dayjs.prototype.utc = function() { return this.add(new Date().getTimezoneOffset(), 'minute'); };
    function alertRes(el, m, c) { el.value = m; el.style.color = c; }
    function handleSuccess(el, upd, url) { el.dataset.url = url; upd(); el.style.color = 'green'; }
    function processImage(f, c, cb) {
        if(!c.water && !c.enableThumbnail) return cb(f);
        const r = new FileReader(); r.onload = e => {
            const i = new Image(); i.src = e.target.result;
            i.onload = () => {
                let w=i.width, h=i.height;
                if(c.enableThumbnail) { const m = c.thumbnailSize||128; if(w>m||h>m){ const r=Math.min(m/w,m/h); w=Math.round(w*r); h=Math.round(h*r); } }
                const cv = document.createElement('canvas'); cv.width=w; cv.height=h; const ctx=cv.getContext('2d'); ctx.drawImage(i,0,0,w,h);
                if(c.water){
                    const fs = Math.max(12, w*0.05); ctx.font=`${fs}px Arial`; ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.textAlign='center'; ctx.textBaseline='middle';
                    ctx.shadowColor="rgba(0,0,0,0.8)"; ctx.shadowBlur=4; ctx.translate(w/2, h/2); ctx.rotate(-Math.PI/4); ctx.fillText(c.water,0,0);
                }
                cv.toBlob(cb, f.type, 0.9);
            };
        }; r.readAsDataURL(f);
    }
    function superRename(n, p, idx) {
        if(!p) return n;
        const ext = n.substring(n.lastIndexOf('.')); const base = n.substring(0, n.lastIndexOf('.')); const now = dayjs();
        const rnd = (l) => { const c='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; let r=''; for(let i=0;i<l;i++) r+=c.charAt(Math.floor(Math.random()*c.length)); return r; };
        return p.replace(/{Y}/g,now.format('YYYY')).replace(/{m}/g,now.format('MM')).replace(/{d}/g,now.format('DD')).replace(/{h}/g,now.format('HH'))
                .replace(/{i}/g,now.format('mm')).replace(/{s}/g,now.format('ss')).replace(/{ms}/g,now.format('SSS')).replace(/{timestamp}/g,now.valueOf())
                .replace(/{md5}/g,CryptoJS.MD5(rnd(32)).toString()).replace(/{md5-16}/g,CryptoJS.MD5(rnd(16)).toString().substring(0,16))
                .replace(/{uuid}/g,uuid.v4()).replace(/{filename}/g,base).replace(/{auto}/g,idx) + ext;
    }
})();
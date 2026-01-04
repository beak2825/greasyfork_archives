// ==UserScript==
// @name         腾讯优酷爱奇艺B站小红书图片下载脚本
// @namespace    http://tampermonkey.net/
// @version      0.9.0
// @description  右键点击图片以下载(支持bilibili、腾讯视频、优酷、爱奇艺、小红书等网站图片下载，支持批量下载和自定义重命名)
// @author       Derek Chen
// @match        *://www.bilibili.com/*
// @include      *://www.bilibili.com/video/av*
// @include      *://www.bilibili.com/read/cv*
// @include      *://t.bilibili.com/*
// @include      *://space.bilibili.com/*
// @include      *://www.bilibili.com/*
// @include      *://h.bilibili.com/*
// @include      *://game.bilibili.com/*
// @include      *://live.bilibili.com/*
// @include      *://search.bilibili.com/*
// @include      *://v.qq.com/*
// @include      *://film.qq.com/*
// @include      *://v.youku.com/*
// @include      *://www.youku.com/*
// @include      *://www.iqiyi.com/*
// @include      *://v.iqiyi.com/*
// @include      *://www.xiaohongshu.com/*
// @include      *://xiaohongshu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532758/%E8%85%BE%E8%AE%AF%E4%BC%98%E9%85%B7%E7%88%B1%E5%A5%87%E8%89%BAB%E7%AB%99%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/532758/%E8%85%BE%E8%AE%AF%E4%BC%98%E9%85%B7%E7%88%B1%E5%A5%87%E8%89%BAB%E7%AB%99%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

let header = 'https:',
    acceptable_classes = [
        // bilibili常见图片容器类
        'user-head c-pointer', 'notice-img c-pointer', 'img-content', 'live-up-img', 'card-1', 'card-3',
        // 腾讯视频常见图片容器类
        'figure_pic', 'figure_thumbnail', 'poster_figure', 'site_logo', 'avatar',
        // 优酷常见图片容器类
        'movie-poster', 'lazyload-img', 'avatar-img', 'program-cover', 'card-img',
        // 爱奇艺常见图片容器类
        'qy-player-thumbnail', 'qy-player-poster', 'header-userIcon', 'header-logo', 'qy-mod-link',
        // 小红书常见图片容器类
        'cover', 'note-image', 'avatar-img', 'inner-img', 'cover-image', 'feed-image'
    ],
    final_url = "",
    header_test = new RegExp(/http*/),
    prompt = document.createElement("div"),
    first_hid = true,
    up_name_final = "",
    img_list = [],
    detail_ = {},
    // 批量下载相关
    selected_images = [],
    is_batch_mode = false,
    common_prefix = "", // 批量下载时的通用文件名前缀
    is_edit_mode = false; // 是否处于编辑模式


// 更新CSS样式，全面美化界面
function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .img-downloader-popup {
            font-family: "Microsoft YaHei", Arial, sans-serif;
            background: linear-gradient(to bottom, #ffffff, #f8f9fa);
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.15);
            border: 1px solid rgba(0,0,0,0.1);
            overflow: hidden;
            will-change: transform, left, top;
            user-select: none;
        }
        .img-downloader-popup .popup-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            background: linear-gradient(to right, #4568dc, #3d7edb);
            color: white;
            border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        .img-downloader-popup h2 {
            margin: 0;
            font-size: 16px;
            color: white;
            text-align: center;
            flex: 1;
            font-weight: 500;
            text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .img-downloader-popup .close-btn {
            background: none;
            border: none;
            width: 24px;
            height: 24px;
            font-size: 18px;
            cursor: pointer;
            color: rgba(255,255,255,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s;
        }
        .img-downloader-popup .close-btn:hover {
            background-color: rgba(255,255,255,0.2);
            color: white;
        }
        .img-downloader-popup .controls {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin: 10px;
            padding: 8px;
            background: rgba(0,0,0,0.03);
            border-radius: 6px;
        }
        .img-downloader-popup .controls button {
            background: #4e8df5;
            color: white;
            border: none;
            padding: 6px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.25s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .img-downloader-popup .controls button:hover {
            background: #3a7cd8;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .img-downloader-popup .controls input {
            padding: 6px 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            width: 100%;
            font-size: 12px;
            transition: border 0.3s;
        }
        .img-downloader-popup .controls input:focus {
            border-color: #4e8df5;
            outline: none;
            box-shadow: 0 0 0 2px rgba(78,141,245,0.2);
        }
        .img-downloader-popup .content-wrapper {
            padding: 0 10px 10px;
        }
        .img-downloader-popup .img-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 8px;
            max-height: 55vh;
            overflow-y: auto;
            padding: 5px;
            scrollbar-width: thin;
            scrollbar-color: #c1c1c1 #f1f1f1;
            overscroll-behavior: contain;
        }
        .img-downloader-popup .img-container::-webkit-scrollbar {
            width: 6px;
        }
        .img-downloader-popup .img-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 8px;
        }
        .img-downloader-popup .img-container::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 8px;
        }
        .img-downloader-popup .img-container::-webkit-scrollbar-thumb:hover {
            background: #a1a1a1;
        }
        .img-downloader-popup .img-item {
            position: relative;
            border-radius: 5px;
            overflow: hidden;
            background: white;
            box-shadow: 0 1px 4px rgba(0,0,0,0.08);
            transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
        }
        .img-downloader-popup .img-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 3px 6px rgba(0,0,0,0.1);
        }
        .img-downloader-popup .img-item.selected {
            border: 1px solid #4e8df5;
            box-shadow: 0 0 0 2px rgba(78,141,245,0.2);
        }
        .img-downloader-popup .img-item .img-wrapper {
            height: 80px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f8f9fa;
        }
        .img-downloader-popup .img-item img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            transition: none;
        }
        .img-downloader-popup .img-item:hover img {
            transform: none;
        }
        .img-downloader-popup .img-info {
            padding: 6px 8px;
        }
        .img-downloader-popup .img-item .img-name {
            margin: 0;
            font-size: 11px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #333;
        }
        .img-downloader-popup .img-item .edit-name {
            width: 100%;
            margin: 3px 0;
            padding: 4px 6px;
            font-size: 11px;
            border: 1px solid #ddd;
            border-radius: 3px;
            box-sizing: border-box;
        }
        .img-downloader-popup .img-item .edit-name:focus {
            border-color: #4e8df5;
            outline: none;
        }
        .img-downloader-popup .img-item .checkbox {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 16px;
            height: 16px;
            cursor: pointer;
            z-index: 10;
            opacity: 0.8;
        }
        .img-downloader-popup .img-item .checkbox:checked {
            opacity: 1;
        }
        .img-downloader-popup .img-item .download-btn {
            position: absolute;
            bottom: 6px;
            right: 6px;
            background: rgba(78,141,245,0.9);
            color: white;
            border: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 11px;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .img-downloader-popup .img-item:hover .download-btn {
            opacity: 1;
        }
        .img-downloader-popup .img-item .download-btn:hover {
            background: #4e8df5;
        }
        .img-downloader-popup .batch-download-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            background: #f8f9fa;
            border-top: 1px solid #eee;
            position: sticky;
            bottom: 0;
            margin-top: 10px;
        }
        .img-downloader-popup .batch-download-bar button {
            background: #28a745;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.25s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            font-size: 12px;
        }
        .img-downloader-popup .batch-download-bar button:hover {
            background: #218838;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .img-downloader-popup .batch-download-bar .counter {
            font-size: 12px;
            font-weight: 500;
            color: #555;
        }
        .img-downloader-popup .empty-state {
            text-align: center;
            padding: 25px 15px;
            color: #666;
        }
        .img-downloader-popup .empty-state .icon {
            font-size: 32px;
            margin-bottom: 10px;
            color: #ccc;
        }
        .img-downloader-popup .empty-state p {
            margin: 5px 0;
            font-size: 12px;
        }
        .img-downloader-popup .download-progress {
            position: fixed;
            bottom: 15px;
            right: 15px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            z-index: 999999;
            display: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-size: 12px;
        }
        .img-downloader-toast {
            transition: opacity 0.3s;
            border-radius: 5px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.15);
            font-size: 12px;
            padding: 8px 12px;
            margin-bottom: 8px;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 0.9; transform: translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 0.9; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

initiate_pop();
addStyles();

// 添加拖拽功能 
function makeDraggable(element) {
    if (!element) return;
    
    const header = element.querySelector('.popup-header');
    if (!header) return;
    
    header.style.cursor = 'move';
    
    // 使用这种方式可以避免事件监听器堆积
    header.onmousedown = function(e) {
        // 如果点击的是关闭按钮，不启动拖拽
        if (e.target.classList.contains('close-btn')) {
            return;
        }
        
        e.preventDefault();
        
        // 添加拖动中的视觉样式
        element.style.opacity = "0.92";
        element.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
        
        // 记录初始位置
        const startX = e.clientX;
        const startY = e.clientY;
        const startLeft = parseInt(element.style.left) || 10;
        const startTop = parseInt(element.style.top) || 20;
        
        // 直接使用onmousemove而不是addEventListener
        document.onmousemove = function(e) {
            e.preventDefault();
            
            // 直接计算位置差值，更高效
            const xDiff = e.clientX - startX;
            const yDiff = e.clientY - startY;
            
            // 设置位置，限制不超出屏幕
            const newLeft = Math.max(5, Math.min(window.innerWidth - element.offsetWidth - 5, startLeft + xDiff));
            const newTop = Math.max(5, Math.min(window.innerHeight - element.offsetHeight - 5, startTop + yDiff));
            
            // 直接设置样式，不经过计算
            element.style.left = newLeft + 'px';
            element.style.top = newTop + 'px';
        };
        
        // 鼠标释放时解除事件
        document.onmouseup = function() {
            // 恢复正常样式
            element.style.opacity = "1";
            element.style.boxShadow = "";
            
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
}

// 更新初始化弹窗函数
function initiate_pop() {
    prompt.setAttribute('id', 'pop');
    prompt.classList.add('img-downloader-popup');
    prompt.setAttribute('style', `
            width:${Math.min(window.innerWidth * 0.4, 450)}px;
            min-height:100px;
            position:fixed;
            top: -800px;
            left:10px;
            z-index:2147483647;
            max-height:75vh;
            overflow: hidden;
        `);

    // 根据当前网站设置不同的标题
    let domain = window.location.hostname;
    let title = "图片下载助手";

    if(domain.includes('qq.com')) {
        title = "腾讯视频图片下载助手";
    } else if(domain.includes('youku.com')) {
        title = "优酷图片下载助手";
    } else if(domain.includes('iqiyi.com')) {
        title = "爱奇艺图片下载助手";
    } else if(domain.includes('bilibili.com')) {
        title = "B站图片下载助手";
    } else if(domain.includes('xiaohongshu.com')) {
        title = "小红书图片下载助手";
    }

    prompt.innerHTML = `
        <div class="popup-header">
            <h2>${title}</h2>
            <button class="close-btn">&times;</button>
        </div>
        <div class="controls">
            <button id="toggle-batch">批量模式</button>
            <button id="toggle-edit">编辑名称</button>
            <input type="text" id="common-prefix" placeholder="输入通用文件名前缀" />
            <button id="refresh-images">刷新图片</button>
            <button id="show-help" style="background: #6c757d;">帮助</button>
        </div>
        <div class="content-wrapper">
            <div class="empty-state">
                <div class="icon">🖼️</div>
                <p>右键点击页面上的图片开始下载</p>
                <p>或点击"刷新图片"查找当前页面所有图片</p>
            </div>
            <div class="batch-download-bar" style="display:none">
                <div class="counter">已选择: 0 张图片</div>
                <button id="download-selected">下载所选图片</button>
            </div>
            <div class="download-progress">
                正在下载图片... <span class="progress-count"></span>
            </div>
        </div>
    `;

    document.body.appendChild(prompt);

    // 使弹窗可拖动
    makeDraggable(prompt);

    // 添加关闭按钮事件监听
    document.querySelector('.close-btn').addEventListener('click', function() {
        document.getElementById('pop').style.top = '-800px';
        first_hid = true;
    });

    // 添加事件监听器
    document.getElementById('toggle-batch').addEventListener('click', toggleBatchMode);
    document.getElementById('toggle-edit').addEventListener('click', toggleEditMode);
    document.getElementById('refresh-images').addEventListener('click', refreshImages);
    document.getElementById('common-prefix').addEventListener('input', updateCommonPrefix);
    document.getElementById('download-selected').addEventListener('click', downloadSelected);
    document.getElementById('show-help').addEventListener('click', showHelp);

    // 加载保存的设置
    loadSettings();
}

// 添加设置保存和恢复功能
function saveSettings() {
    const settings = {
        commonPrefix: common_prefix,
        batchMode: is_batch_mode,
        editMode: is_edit_mode
    };
    localStorage.setItem('imgDownloaderSettings', JSON.stringify(settings));
}

function loadSettings() {
    try {
        const savedSettings = localStorage.getItem('imgDownloaderSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            common_prefix = settings.commonPrefix || '';
            is_batch_mode = settings.batchMode || false;
            is_edit_mode = settings.editMode || false;

            // 更新界面
            const prefixInput = document.getElementById('common-prefix');
            if (prefixInput && common_prefix) {
                prefixInput.value = common_prefix;
            }

            // 更新批量模式按钮
            if (is_batch_mode) {
                document.getElementById('toggle-batch').click();
            }

            // 更新编辑模式按钮
            if (is_edit_mode) {
                document.getElementById('toggle-edit').click();
            }
        }
    } catch (e) {
        console.error('加载设置失败:', e);
    }
}

// 在每次设置改变时保存
function updateCommonPrefix() {
    common_prefix = document.getElementById('common-prefix').value.trim();
    saveSettings();
}

function toggleBatchMode() {
    is_batch_mode = !is_batch_mode;

    const batchBtn = document.getElementById('toggle-batch');
    const batchBar = document.querySelector('.batch-download-bar');
    const imgItems = document.querySelectorAll('.img-item');

    if (is_batch_mode) {
        batchBtn.textContent = '单个模式';
        batchBtn.style.background = '#dc3545';
        batchBar.style.display = 'flex';

        // 显示所有复选框
        imgItems.forEach(item => {
            const checkbox = item.querySelector('.checkbox');
            if (checkbox) checkbox.style.display = 'block';
        });
    } else {
        batchBtn.textContent = '批量模式';
        batchBtn.style.background = '';
        batchBar.style.display = 'none';

        // 隐藏所有复选框，并取消选择
        imgItems.forEach(item => {
            item.classList.remove('selected');
            const checkbox = item.querySelector('.checkbox');
            if (checkbox) {
                checkbox.checked = false;
                checkbox.style.display = 'none';
            }
        });

        // 重置选择的图片
        selected_images = [];
        updateSelectedCounter();
    }

    saveSettings();
}

function toggleEditMode() {
    is_edit_mode = !is_edit_mode;

    const editBtn = document.getElementById('toggle-edit');
    const imgItems = document.querySelectorAll('.img-item');

    if (is_edit_mode) {
        editBtn.textContent = '完成编辑';
        editBtn.style.background = '#ffc107';
        editBtn.style.color = '#000';

        // 显示编辑输入框
        imgItems.forEach(item => {
            const imgInfo = item.querySelector('.img-info');
            const imgName = imgInfo.querySelector('.img-name');

            if (imgName) {
                const currentName = imgName.textContent;

                const editInput = document.createElement('input');
                editInput.type = 'text';
                editInput.className = 'edit-name';
                editInput.value = currentName;
                editInput.setAttribute('data-original', currentName);

                imgName.style.display = 'none';
                imgInfo.appendChild(editInput);
            }
        });
    } else {
        editBtn.textContent = '编辑名称';
        editBtn.style.background = '';
        editBtn.style.color = '';

        // 保存编辑并删除输入框
        imgItems.forEach(item => {
            const imgInfo = item.querySelector('.img-info');
            const editInput = imgInfo.querySelector('.edit-name');
            const imgName = imgInfo.querySelector('.img-name');

            if (editInput && imgName) {
                imgName.textContent = editInput.value;
                imgName.style.display = '';
                imgInfo.removeChild(editInput);

                // 更新选中图片的名称
                if (is_batch_mode && item.classList.contains('selected')) {
                    const imgSrc = item.querySelector('img').src;
                    updateSelectedImageName(imgSrc, editInput.value);
                }
            }
        });
    }

    saveSettings();
}

function updateSelectedImageName(src, newName) {
    for (let i = 0; i < selected_images.length; i++) {
        if (selected_images[i].url === src) {
            selected_images[i].name = newName;
            break;
        }
    }
}

function updateSelectedCounter() {
    const counter = document.querySelector('.batch-download-bar .counter');
    if (counter) {
        counter.textContent = `已选择: ${selected_images.length} 张图片`;
    }
}

function toggleImageSelection(e) {
    if (!is_batch_mode) return;

    const imgItem = this.closest('.img-item');
    const checkbox = imgItem.querySelector('.checkbox');
    const imgSrc = imgItem.querySelector('img').src;
    const imgName = is_edit_mode ?
        imgItem.querySelector('.edit-name').value :
        imgItem.querySelector('.img-name').textContent;

    if (checkbox.checked) {
        imgItem.classList.add('selected');
        selected_images.push({ url: imgSrc, name: imgName });
    } else {
        imgItem.classList.remove('selected');
        selected_images = selected_images.filter(img => img.url !== imgSrc);
    }

    updateSelectedCounter();
}

function refreshImages() {
    get_all_img();
}

function downloadSelected() {
    if (selected_images.length === 0) {
        showToast('请至少选择一张图片！', 'error');
        return;
    }

    // 显示下载进度
    const progressEl = document.querySelector('.download-progress');
    const progressCount = progressEl.querySelector('.progress-count');
    progressEl.style.display = 'block';

    // 使用Promise.all批量下载，确保所有图片都被处理
    let downloadedCount = 0;
    const total = selected_images.length;

    const downloadPromises = selected_images.map((img, index) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 根据是否有前缀决定是否添加序号
                let filename;
                if (common_prefix) {
                    // 使用前缀时添加序号保持顺序
                    filename = `${common_prefix}_${index+1}_${img.name}`;
                } else {
                    // 没有前缀时直接使用文件名
                    filename = img.name;
                }

                download({
                    url: img.url,
                    name: filename
                }, false); // 不显示每张图片的下载提示

                downloadedCount++;
                progressCount.textContent = `${downloadedCount}/${total}`;
                resolve();
            }, index * 300); // 每张图片间隔300ms，避免浏览器限制
        });
    });

    Promise.all(downloadPromises).then(() => {
        // 下载完成后隐藏进度条并显示成功消息
        setTimeout(() => {
            progressEl.style.display = 'none';
            showToast(`成功下载了 ${total} 张图片！`);

            // 清空选中状态
            selected_images = [];
            document.querySelectorAll('.img-item').forEach(item => {
                item.classList.remove('selected');
                const checkbox = item.querySelector('.checkbox');
                if (checkbox) checkbox.checked = false;
            });
            updateSelectedCounter();
        }, 1000);
    });
}

function get_all_img() {
    let f_url_arr = [],
        u_name_arr = [],
        all_img = document.getElementsByTagName('img');

    // 处理所有img标签
    for(let a = 0; a < all_img.length; a++){
        let imgUrl = all_img[a].src.split('@')[0].split('"')[0];

        // 跳过空URL或太小的图片（可能是图标）
        if(!imgUrl || imgUrl === '' ||
           (all_img[a].width > 0 && all_img[a].width < 50) ||
           (all_img[a].height > 0 && all_img[a].height < 50)) {
            continue;
        }

        // 处理各平台图片链接
        if(imgUrl.includes('youku') || imgUrl.includes('ykimg')) {
            imgUrl = imgUrl.split('?')[0];
        }
        if(imgUrl.includes('iqiyi') || imgUrl.includes('qiyipic')) {
            imgUrl = imgUrl.split('?')[0];
        }
        // 处理小红书图片链接
        if(imgUrl.includes('xiaohongshu') || imgUrl.includes('xhscdn')) {
            // 移除参数获取高质量原图
            imgUrl = imgUrl.split('?')[0];
            
            // 处理特殊的缩略图URL
            if(imgUrl.includes('xhs-cn') && !imgUrl.includes('/fx')) {
                imgUrl = imgUrl.replace(/\/([^\/]+)$/, '/fx$1');
            }
        }

        f_url_arr.push(imgUrl);
        u_name_arr.push(get_name(all_img[a]));
    }

    // 处理具有特定类名的元素
    for (let i = 0; i < acceptable_classes.length; i++) {
        // 支持空格分隔的多个类名
        let className = acceptable_classes[i].split(' ')[0];
        let t = document.getElementsByClassName(className);

        for (let j = 0; j < t.length; j++) {
            if (t[j].nodeName === 'IMG') {
                let imgUrl = t[j].src.split('@')[0].split('"')[0];

                // 处理各平台图片链接
                if(imgUrl.includes('youku') || imgUrl.includes('ykimg')) {
                    imgUrl = imgUrl.split('?')[0];
                }
                if(imgUrl.includes('iqiyi') || imgUrl.includes('qiyipic')) {
                    imgUrl = imgUrl.split('?')[0];
                }
                // 处理小红书图片链接
                if(imgUrl.includes('xiaohongshu') || imgUrl.includes('xhscdn')) {
                    imgUrl = imgUrl.split('?')[0];
                    
                    if(imgUrl.includes('xhs-cn') && !imgUrl.includes('/fx')) {
                        imgUrl = imgUrl.replace(/\/([^\/]+)$/, '/fx$1');
                    }
                }

                u_name_arr.push(get_name(t[j]));
                f_url_arr.push(imgUrl);
            } else if (t[j].style && t[j].style.backgroundImage && t[j].style.backgroundImage !== '') {
                let bgUrl = '';

                if (header_test.test(t[j].style.backgroundImage)) {
                    bgUrl = t[j].style.backgroundImage
                        .replace('url("', '')
                        .replace('url(', '')
                        .replace('")', '')
                        .replace(')', '')
                        .replace(/'/g, '')
                        .split('@')[0]
                        .split('"')[0];
                } else {
                    bgUrl = t[j].style.backgroundImage
                        .replace('url("', header)
                        .replace('url(', header)
                        .replace('")', '')
                        .replace(')', '')
                        .replace(/'/g, '')
                        .split('@')[0]
                        .split('"')[0];
                }

                // 处理各平台图片链接
                if(bgUrl.includes('youku') || bgUrl.includes('ykimg')) {
                    bgUrl = bgUrl.split('?')[0];
                }
                if(bgUrl.includes('iqiyi') || bgUrl.includes('qiyipic')) {
                    bgUrl = bgUrl.split('?')[0];
                }
                // 处理小红书背景图片链接
                if(bgUrl.includes('xiaohongshu') || bgUrl.includes('xhscdn')) {
                    bgUrl = bgUrl.split('?')[0];
                    
                    if(bgUrl.includes('xhs-cn') && !bgUrl.includes('/fx')) {
                        bgUrl = bgUrl.replace(/\/([^\/]+)$/, '/fx$1');
                    }
                }

                u_name_arr.push(get_name(t[j]));
                f_url_arr.push(bgUrl);
            }
        }
    }

    // 额外查找可能的大图封面（针对视频网站）
    let possibleCoverSelectors = [
        // 腾讯视频
        '.site_player_inner', '.player_container', '.player_figure',
        // 优酷
        '.player-container', '.youku-player', '.video-poster',
        // 爱奇艺
        '.qy-player-box', '.player-wrapper', '.qy-flash-player',
        // 小红书
        '.note-details', '.note-content', '.note-poster', '.image-wrapper', '.carousel'
    ];

    for(let i = 0; i < possibleCoverSelectors.length; i++) {
        let covers = document.querySelectorAll(possibleCoverSelectors[i]);
        for(let j = 0; j < covers.length; j++) {
            if(covers[j].style && covers[j].style.backgroundImage && covers[j].style.backgroundImage !== '') {
                let bgUrl = '';

                if (header_test.test(covers[j].style.backgroundImage)) {
                    bgUrl = covers[j].style.backgroundImage
                        .replace('url("', '')
                        .replace('url(', '')
                        .replace('")', '')
                        .replace(')', '')
                        .replace(/'/g, '')
                        .split('@')[0]
                        .split('"')[0];
                } else {
                    bgUrl = covers[j].style.backgroundImage
                        .replace('url("', header)
                        .replace('url(', header)
                        .replace('")', '')
                        .replace(')', '')
                        .replace(/'/g, '')
                        .split('@')[0]
                        .split('"')[0];
                }

                // 处理各平台图片链接
                if(bgUrl.includes('youku') || bgUrl.includes('ykimg')) {
                    bgUrl = bgUrl.split('?')[0];
                }
                if(bgUrl.includes('iqiyi') || bgUrl.includes('qiyipic')) {
                    bgUrl = bgUrl.split('?')[0];
                }
                // 处理小红书背景图片链接
                if(bgUrl.includes('xiaohongshu') || bgUrl.includes('xhscdn')) {
                    bgUrl = bgUrl.split('?')[0];
                    
                    if(bgUrl.includes('xhs-cn') && !bgUrl.includes('/fx')) {
                        bgUrl = bgUrl.replace(/\/([^\/]+)$/, '/fx$1');
                    }
                }

                u_name_arr.push(get_name(covers[j]));
                f_url_arr.push(bgUrl);
            }
        }
    }
    
    // 特殊处理小红书笔记页面，查找高分辨率图片
    if(window.location.hostname.includes('xiaohongshu.com')) {
        // 尝试使用特殊选择器查找小红书的高质量图片
        try {
            // 查找笔记中的所有图片容器
            const noteImages = document.querySelectorAll('.note-image, .image-wrapper img, .carousel img');
            for(let i = 0; i < noteImages.length; i++) {
                if(noteImages[i].getAttribute('data-src')) {
                    let imgUrl = noteImages[i].getAttribute('data-src').split('?')[0];
                    if(imgUrl.includes('xhs-cn') && !imgUrl.includes('/fx')) {
                        imgUrl = imgUrl.replace(/\/([^\/]+)$/, '/fx$1');
                    }
                    f_url_arr.push(imgUrl);
                    u_name_arr.push(get_name(noteImages[i]));
                }
            }
        } catch(e) {
            console.error('提取小红书高质量图片失败:', e);
        }
    }

    make_img_list_prompt(f_url_arr, u_name_arr);
}

function check_identical(link) {
    if (img_list.length !== 0) {
        for (let i = 0; i < img_list.length; i++) {
            if (link === img_list[i]) {
                return true;
            }
        }
    }
    return false;
}

function get_url(target) {
    if (target.nodeName === 'IMG') {
        let imgUrl = target.src.split('@')[0].split('"')[0];

        // 处理优酷和爱奇艺的图片链接，移除特定参数
        if(imgUrl.includes('youku') || imgUrl.includes('ykimg')) {
            imgUrl = imgUrl.split('?')[0];
        }
        if(imgUrl.includes('iqiyi') || imgUrl.includes('qiyipic')) {
            imgUrl = imgUrl.split('?')[0];
        }

        final_url = {
            url: imgUrl,
            name: get_name(target)
        };
        return true;
    } else {
        for (let i = 0; i < acceptable_classes.length; i++) {
            if (target.classList && target.classList.contains(acceptable_classes[i].split(' ')[0])) {
                if (target.nodeName !== 'IMG') {
                    let bgUrl = header_test.test(target.style.backgroundImage) ?
                        target.style.backgroundImage.replace('url("', '').replace('")', '').replace("')", "").split('@')[0].split('"')[0] :
                        target.style.backgroundImage.replace('url("', header).replace('")', '').replace("')", "").split('@')[0].split('"')[0];

                    // 处理优酷和爱奇艺的图片链接，移除特定参数
                    if(bgUrl.includes('youku') || bgUrl.includes('ykimg')) {
                        bgUrl = bgUrl.split('?')[0];
                    }
                    if(bgUrl.includes('iqiyi') || bgUrl.includes('qiyipic')) {
                        bgUrl = bgUrl.split('?')[0];
                    }

                    final_url = {
                        url: bgUrl,
                        name: get_name(target)
                    };
                    return true;
                }
            }
        }
    }
}

function download(url = final_url, show_progress = true) {
    console.log(final_url);
    if (!url || !url.url) {
        return;
    }

    if (check_identical(url.url) && show_progress) {
        // 使用非阻塞提示，避免弹窗
        showToast("已经下载过这张图片了!");
        return;
    }

    try{
        // 确保URL是完整的
        let fullUrl = url.url;
        if(!fullUrl.startsWith('http')) {
            fullUrl = 'https:' + fullUrl;
        }

        // 处理URL中的特殊字符
        fullUrl = fullUrl.replace(/\\"/g, '');
        
        // 处理小红书特殊图片URL
        if(window.location.hostname.includes('xiaohongshu.com')) {
            // 移除小红书图片URL中的参数，获取高质量原图
            fullUrl = fullUrl.split('?')[0];
            
            // 某些小红书图片需要替换URL
            if(fullUrl.includes('xhs-cn')) {
                fullUrl = fullUrl.replace(/\/([^\/]+)$/, '/fx$1');
            }
        }

        let current_img_type = ".jpg"; // 默认使用jpg格式
        // 保存原始扩展名，用于后续转换
        let originalType = "";
        
        // 从URL尝试获取文件扩展名
        let lastSegment = fullUrl.split('/').pop();
        if(lastSegment && lastSegment.includes('.')) {
            originalType = fullUrl.substring(fullUrl.lastIndexOf(".")).toLowerCase();
            // 如果扩展名包含参数，只保留扩展名部分
            if(originalType.includes('?')) {
                originalType = originalType.split('?')[0];
            }
            
            // 限制扩展名长度，防止异常
            if(originalType.length > 5) {
                originalType = ".jpg";
            }
        }

        // 避免重复下载同一图片
        if(!check_identical(fullUrl)) {
            img_list.push(fullUrl);
        }

        fetch(fullUrl).then(res => {
            if (!res.ok) {
                throw new Error(`Network response was not ok: ${res.status} ${res.statusText}`);
            }
            return res.blob();
        }).then(blob => {
            // 如果需要转换为jpg格式，创建图片元素并使用canvas转换
            if(originalType !== ".jpg" && originalType !== ".jpeg") {
                return convertToJpg(blob);
            } else {
                return blob;
            }
        }).then(finalBlob => {
            let a = document.createElement('a');
            a.style.display = 'none';
            a.href = URL.createObjectURL(finalBlob);

            // 确保文件名不含特殊字符并控制长度
            let fileName = `${url.name}${current_img_type}`;
            if(fileName.length > 200) {
                fileName = fileName.substring(0, 195) + current_img_type;
            }

            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // 释放blob URL
            URL.revokeObjectURL(a.href);

            // 使用非阻塞提示，避免弹窗和界面弹起
            if (show_progress) {
                showToast(`已下载: ${fileName}`);
            }
        }).catch(error => {
            console.error('下载图片失败:', error);
            if(show_progress) {
                showToast('下载失败，请稍后再试!', 'error');
            }
        });
    }catch(e){
        console.error('下载图片出错:', e);
    };
}

// 将其他格式的图片转换为JPG格式
function convertToJpg(blob) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function() {
            // 创建canvas元素
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            // 在canvas上绘制图片
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'white'; // 设置白色背景，处理透明图片
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            
            // 将canvas内容转换为jpg格式的blob
            canvas.toBlob(blob => {
                resolve(blob);
            }, 'image/jpeg', 0.92); // 设置jpg质量为0.92
        };
        
        img.onerror = function() {
            // 如果转换失败，返回原始blob
            reject(new Error('图片转换失败'));
        };
        
        // 加载图片
        img.src = URL.createObjectURL(blob);
    }).catch(error => {
        console.error('图片转换失败:', error);
        return blob; // 如果转换失败，返回原始blob
    });
}

function make_img_list_prompt(arr, u_arr) {
    let done = [],
        current_index = -1;

    // 根据当前网站设置不同的标题
    let domain = window.location.hostname;
    let title = "图片下载助手";

    if(domain.includes('qq.com')) {
        title = "腾讯视频图片下载助手";
    } else if(domain.includes('youku.com')) {
        title = "优酷图片下载助手";
    } else if(domain.includes('iqiyi.com')) {
        title = "爱奇艺图片下载助手";
    } else if(domain.includes('bilibili.com')) {
        title = "B站图片下载助手";
    } else if(domain.includes('xiaohongshu.com')) {
        title = "小红书图片下载助手";
    }

    const popupContent = document.getElementById('pop');

    // 保留控制按钮和头部布局
    const headerHTML = `<div class="popup-header">
        <h2>${title}</h2>
        <button class="close-btn">&times;</button>
    </div>`;

    let controlsHTML = popupContent.querySelector('.controls').outerHTML;
    let batchBarHTML = popupContent.querySelector('.batch-download-bar').outerHTML;
    let progressHTML = popupContent.querySelector('.download-progress').outerHTML;

    popupContent.innerHTML = `
        ${headerHTML}
        <div class="controls">
            <button id="toggle-batch">批量模式</button>
            <button id="toggle-edit">编辑名称</button>
            <input type="text" id="common-prefix" placeholder="输入通用文件名前缀" />
            <button id="refresh-images">刷新图片</button>
            <button id="show-help" style="background: #6c757d;">帮助</button>
        </div>
        <div class="content-wrapper">
            <div class="img-container"></div>
            ${batchBarHTML}
        </div>
        ${progressHTML}
    `;

    const imgContainer = popupContent.querySelector('.img-container');

    // 添加一个图片计数器
    let imageCount = 0;

    for (let i = 0; i < arr.length; i++) {
        let finished = false;
        for (let j = 0; j < done.length; j++) {
            if (arr[i] === done[j]) {
                finished = true;
            }
        }
        if (!finished && arr[i] !== '') {
            imageCount++;

            const imgItem = document.createElement('div');
            imgItem.className = 'img-item';

            // 添加复选框（批量模式使用）
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'checkbox';
            checkbox.style.display = is_batch_mode ? 'block' : 'none';
            checkbox.addEventListener('change', toggleImageSelection);
            imgItem.appendChild(checkbox);

            // 创建图片包装器
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'img-wrapper';

            const img = document.createElement('img');
            img.src = arr[i];
            img.addEventListener('error', function() {
                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBmaWxsPSIjOTk5IiBkPSJNMTMgNGg2djZoLTZ6TTMgMTJoNnY2SDN6Ii8+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgyNHYyNEgweiIvPjwvc3ZnPg==';
                imgItem.style.opacity = '0.7';
            });

            imgWrapper.appendChild(img);
            imgItem.appendChild(imgWrapper);

            // 创建图片信息区域
            const imgInfo = document.createElement('div');
            imgInfo.className = 'img-info';

            const imgName = document.createElement('p');
            imgName.className = 'img-name';
            imgName.textContent = u_arr[i] || '未命名图片';
            imgInfo.appendChild(imgName);

            imgItem.appendChild(imgInfo);

            // 添加下载按钮
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn';
            downloadBtn.innerHTML = '⬇';
            downloadBtn.title = '下载此图片';
            downloadBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // 防止触发父元素点击事件

                const imgSrc = this.closest('.img-item').querySelector('img').src;
                const nameEl = is_edit_mode ?
                    this.closest('.img-item').querySelector('.edit-name') :
                    this.closest('.img-item').querySelector('.img-name');
                const imgName = nameEl ? nameEl.value || nameEl.textContent : '未命名图片';

                download({
                    url: imgSrc,
                    name: common_prefix ? `${common_prefix}_${imgName}` : imgName
                });

                // 添加下载反馈
                this.textContent = '✓';
                this.style.background = '#28a745';

                setTimeout(() => {
                    this.textContent = '⬇';
                    this.style.background = '';
                }, 1500);
            });

            imgItem.appendChild(downloadBtn);

            // 点击图片项处理
            imgItem.addEventListener('click', function(e) {
                // 如果点击的是复选框、下载按钮或编辑输入框，不处理
                if (e.target.classList.contains('checkbox') ||
                    e.target.classList.contains('download-btn') ||
                    e.target.classList.contains('edit-name')) {
                    return;
                }

                if (is_batch_mode) {
                    // 批量模式下点击切换选中状态
                    const checkbox = this.querySelector('.checkbox');
                    checkbox.checked = !checkbox.checked;
                    const event = new Event('change');
                    checkbox.dispatchEvent(event);
                } else if (!is_edit_mode) {
                    // 单击模式且非编辑模式下直接打开大图预览
                    showImagePreview(this.querySelector('img').src, this.querySelector('.img-name').textContent);
                }
            });

            imgContainer.appendChild(imgItem);
            done.push(arr[i]);
        }
    }

    // 如果没有找到图片，显示提示
    if(imageCount === 0) {
        imgContainer.innerHTML = `
            <div class="empty-state">
                <div class="icon">🔍</div>
                <p>没有找到可下载的图片</p>
                <p>请尝试右键点击具体图片或刷新页面后再试</p>
            </div>
        `;
    }

    // 重新绑定事件监听器
    document.getElementById('toggle-batch').addEventListener('click', toggleBatchMode);
    document.getElementById('toggle-edit').addEventListener('click', toggleEditMode);
    document.getElementById('refresh-images').addEventListener('click', refreshImages);
    document.getElementById('common-prefix').addEventListener('input', updateCommonPrefix);
    document.getElementById('download-selected').addEventListener('click', downloadSelected);
    
    // 确保帮助按钮有事件监听
    const helpBtn = document.getElementById('show-help');
    if (helpBtn) {
        helpBtn.addEventListener('click', showHelp);
    }

    // 添加关闭按钮事件监听
    document.querySelector('.close-btn').addEventListener('click', function() {
        document.getElementById('pop').style.top = '-800px';
        first_hid = true;
    });

    // 如果是批量模式，显示批量下载栏
    if (is_batch_mode) {
        document.querySelector('.batch-download-bar').style.display = 'flex';
        document.getElementById('toggle-batch').textContent = '单个模式';
        document.getElementById('toggle-batch').style.background = '#dc3545';
    } else {
        document.querySelector('.batch-download-bar').style.display = 'none';
    }

    // 如果是编辑模式，显示编辑输入框
    if (is_edit_mode) {
        document.getElementById('toggle-edit').textContent = '完成编辑';
        document.getElementById('toggle-edit').style.background = '#ffc107';
        document.getElementById('toggle-edit').style.color = '#000';
        toggleEditMode();
    }

    // 显示弹窗在页面最左边
    const popup = document.getElementById('pop');
    popup.style.top = '20px';
    popup.style.left = '10px';
    popup.style.display = 'block';
    
    // 确保弹窗可拖动
    setTimeout(() => {
        makeDraggable(popup);
        
        // 确保帮助按钮有事件监听
        const helpBtn = document.getElementById('show-help');
        if (helpBtn) {
            helpBtn.addEventListener('click', showHelp);
        }
    }, 50);
}

// 添加非阻塞的提示toast
function showToast(message, type = 'success') {
    // 检查是否已存在toast容器
    let toastContainer = document.getElementById('img-downloader-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'img-downloader-toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            bottom: 15px;
            left: 15px;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        `;
        document.body.appendChild(toastContainer);
    }

    // 创建新的toast
    const toast = document.createElement('div');
    toast.classList.add('img-downloader-toast');

    // 设置toast样式
    const backgroundColor = type === 'success' ? 'rgba(40, 167, 69, 0.9)' : 'rgba(220, 53, 69, 0.9)';
    toast.style.backgroundColor = backgroundColor;
    toast.style.opacity = '0.9';
    toast.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2.7s';

    // 添加关闭按钮
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        margin-left: 8px;
        cursor: pointer;
        float: right;
        font-size: 14px;
    `;
    closeBtn.onclick = function() {
        toastContainer.removeChild(toast);
    };

    // 设置消息内容
    toast.innerHTML = message;
    toast.appendChild(closeBtn);

    // 添加到容器
    toastContainer.appendChild(toast);

    // 自动消失
    setTimeout(() => {
        if (toastContainer.contains(toast)) {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }
    }, 3000);
}

document.oncontextmenu = (e) => {
    // 如果是在图片下载助手内部点击，不拦截右键事件
    if (e.target.closest('.img-downloader-popup')) {
        return true; // 允许浏览器默认右键菜单
    }

    console.log(e,'right click');
    let target = e.target,
        find_element = false;

    if (target.nodeName === 'IMG') {
        let imgUrl = target.src.split('@')[0].split('"')[0];

        // 处理优酷和爱奇艺的图片链接，移除特定参数
        if(imgUrl.includes('youku') || imgUrl.includes('ykimg')) {
            imgUrl = imgUrl.split('?')[0];
        }
        if(imgUrl.includes('iqiyi') || imgUrl.includes('qiyipic')) {
            imgUrl = imgUrl.split('?')[0];
        }

        final_url = {
            url: imgUrl,
            name: get_name(target)
        };

        // 直接下载图片，不使用confirm弹窗
        download();
        return false; // 阻止浏览器默认右键菜单
    }

    find_element = get_url(target);
    if (!find_element) {
        // 显示所有图片
        get_all_img();
        // 强制设置位置，避免位置不正确
        setTimeout(() => {
            const popup = document.getElementById('pop');
            popup.style.top = '20px';
            popup.style.left = '10px';
            popup.style.display = 'block'; // 确保可见
            
            // 再次应用拖动
            makeDraggable(popup);
        }, 100);
    } else {
        // 直接下载图片，不使用confirm弹窗
        download();
    }

    return false; // 阻止浏览器默认右键菜单
}

function get_name(ele){
    let name = "";
    let domain = window.location.hostname;

    // 根据不同网站使用不同的命名策略
    if(domain.includes('qq.com')) {
        // 腾讯视频命名策略
        name = "腾讯视频_";
        try {
            // 尝试获取视频标题
            let title = document.querySelector('.player_title') || document.querySelector('.mod_title') || document.querySelector('.video_title');
            if(title) {
                name += title.innerText.trim();
            } else {
                name += new Date().getTime();
            }
        } catch(e) {
            name += new Date().getTime();
        }
    } else if(domain.includes('youku.com')) {
        // 优酷命名策略
        name = "优酷_";
        try {
            // 尝试获取视频标题
            let title = document.querySelector('.title') || document.querySelector('.video-title') || document.querySelector('.anthology-title');
            if(title) {
                name += title.innerText.trim();
            } else {
                name += new Date().getTime();
            }
        } catch(e) {
            name += new Date().getTime();
        }
    } else if(domain.includes('iqiyi.com')) {
        // 爱奇艺命名策略
        name = "爱奇艺_";
        try {
            // 尝试获取视频标题
            let title = document.querySelector('.player-title') || document.querySelector('.title-wrap') || document.querySelector('.main-title');
            if(title) {
                name += title.innerText.trim();
            } else {
                name += new Date().getTime();
            }
        } catch(e) {
            name += new Date().getTime();
        }
    } else if(domain.includes('bilibili.com')) {
        // bilibili原有的命名策略
        while (ele) {
            if(ele.classList){
                switch(ele.classList.value){
                    case 'pop_img':
                        name = ele.parentNode.innerText;
                        break;
                    case 'post-content repost':
                        if(ele.getElementsByClassName('original-poster')[0]){
                            name = ele.getElementsByClassName('original-poster')[0].innerText.split('@')[1].split(':')[0];
                        }else{
                            name = ele.getElementsByClassName('username d-i-block up-info-name')[0].innerText;
                        }
                        break;
                    case 'main-content':
                    case 'card':
                        name = ele.getElementsByClassName('user-name fs-16 ls-0 d-i-block')[0].innerText;
                        break;
                    case 'live-panel-item live-up':
                        name = ele.getElementsByClassName('live-up-name tc-dark-slate fs-14 ls-0')[0].innerText;
                        break;
                    case 'list-item reply-wrap ':
                        name = ele.getElementsByClassName('name')[0].innerText;
                        break;
                    case 'card-box':
                        name = ele.getElementsByClassName('count up')[0].innerText;
                        break;
                    default:
                        null; // still, nobody cares
                }
            }
            ele = ele.parentNode;
        }
    } else if(domain.includes('xiaohongshu.com')) {
        // 小红书命名策略
        name = "小红书_";
        try {
            // 尝试获取笔记标题
            let title = document.querySelector('.title') || 
                        document.querySelector('.note-content .content') ||
                        document.querySelector('._26zd1') ||
                        document.querySelector('.note-top .title') ||
                        document.querySelector('meta[property="og:title"]');
                        
            if(title) {
                if(title.tagName === 'META') {
                    name += title.getAttribute('content').trim();
                } else {
                    name += title.innerText.trim();
                }
            } else {
                // 尝试获取用户名作为前缀
                let username = document.querySelector('.user-nickname') || 
                               document.querySelector('.author-name') ||
                               document.querySelector('.nickname');
                if(username) {
                    name += username.innerText.trim() + "_" + new Date().getTime();
                } else {
                    name += new Date().getTime();
                }
            }
        } catch(e) {
            name += new Date().getTime();
        }
    }

    // 如果没有找到合适的名称，使用时间戳
    if(!name || name === "腾讯视频_" || name === "优酷_" || name === "爱奇艺_") {
        name = `图片_${new Date().getTime()}`;
    }

    // 替换掉不能用作文件名的字符
    name = name.replace(/[\\\/\:\*\?\"\<\>\|]/g, "_");

    return name;
}

document.addEventListener('mouseup',(e)=>{
    // 点击弹窗内部元素时保持弹窗打开
    if (e.target.closest('.img-downloader-popup')) {
        // 确保弹窗保持显示
        const popup = document.getElementById('pop');
        if (popup.style.top !== '20px') {
            popup.style.top = '20px';
            popup.style.left = '10px'; 
            first_hid = false;
        }
        return;
    }

    // 不再自动隐藏弹窗，只点击关闭按钮时才隐藏
    // document.getElementById('pop').style.top = '-800px';
    // first_hid = true;
});

// 给页面添加快捷键支持
document.addEventListener('keydown', (e) => {
    // ESC键关闭弹窗
    if (e.key === 'Escape') {
        document.getElementById('pop').style.top = '-800px';
        first_hid = true;
    }

    // 如果弹窗已显示
    if (document.getElementById('pop').style.top === '10px' ||
        parseInt(document.getElementById('pop').style.top) > 0) {

        // Ctrl+B - 切换批量模式
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            document.getElementById('toggle-batch').click();
        }

        // Ctrl+E - 切换编辑模式
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            document.getElementById('toggle-edit').click();
        }

        // Ctrl+S - 下载选中图片
        if (e.ctrlKey && e.key === 's' && is_batch_mode) {
            e.preventDefault();
            document.getElementById('download-selected').click();
        }

        // Ctrl+R - 刷新图片
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            document.getElementById('refresh-images').click();
        }

        // Ctrl+A - 全选/取消全选图片
        if (e.ctrlKey && e.key === 'a' && is_batch_mode) {
            e.preventDefault();
            selectAllImages();
        }
    }
});

// 全选/取消全选图片
function selectAllImages() {
    const imgItems = document.querySelectorAll('.img-item');
    const allSelected = selected_images.length === imgItems.length;

    // 如果所有图片都已选中，则取消全选
    if (allSelected) {
        imgItems.forEach(item => {
            item.classList.remove('selected');
            const checkbox = item.querySelector('.checkbox');
            if (checkbox) checkbox.checked = false;
        });
        selected_images = [];
    } else {
        // 否则全选
        selected_images = [];
        imgItems.forEach(item => {
            item.classList.add('selected');
            const checkbox = item.querySelector('.checkbox');
            if (checkbox) checkbox.checked = true;

            const imgSrc = item.querySelector('img').src;
            const imgName = is_edit_mode ?
                item.querySelector('.edit-name').value :
                item.querySelector('.img-name').textContent;

            selected_images.push({ url: imgSrc, name: imgName });
        });
    }

    updateSelectedCounter();
}

// 显示帮助信息
function showHelp() {
    // 创建一个模态对话框来显示帮助信息
    const modal = document.createElement('div');
    modal.className = 'img-downloader-help-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2147483647;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background-color: white;
        width: 80%;
        max-width: 500px;
        max-height: 80%;
        overflow-y: auto;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        position: relative;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    closeBtn.onclick = function() {
        document.body.removeChild(modal);
    };

    content.innerHTML = `
        <h2 style="text-align:center;margin-top:0">图片下载助手使用说明</h2>

        <h3>基本功能</h3>
        <ul>
            <li>右键点击页面上的图片直接下载</li>
            <li>点击"刷新图片"搜索当前页面所有图片</li>
            <li>点击"批量模式"可以选择多张图片一起下载</li>
            <li>点击"编辑名称"可以修改下载文件的名称</li>
            <li>输入"通用文件名前缀"可为所有文件添加统一前缀</li>
        </ul>

        <h3>常用快捷键</h3>
        <ul>
            <li><b>ESC</b>: 关闭窗口</li>
            <li><b>Ctrl+B</b>: 切换批量模式</li>
            <li><b>Ctrl+E</b>: 切换编辑模式</li>
            <li><b>Ctrl+A</b>: 全选/取消全选图片(批量模式下)</li>
            <li><b>Ctrl+S</b>: 下载选中的图片(批量模式下)</li>
            <li><b>Ctrl+R</b>: 刷新图片列表</li>
        </ul>

        <h3>提示</h3>
        <p>窗口标题栏可拖动调整位置</p>
        <p>您的设置将自动保存，下次使用时会自动恢复</p>
    `;

    content.appendChild(closeBtn);
    modal.appendChild(content);

    // 点击模态框外部关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });

    document.body.appendChild(modal);
}

// 添加图片预览功能
function showImagePreview(imageSrc, imageName) {
    // 创建预览容器
    const previewContainer = document.createElement('div');
    previewContainer.className = 'img-preview-container';
    previewContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.85);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 9999999;
    `;

    // 创建图片预览区域
    const previewContent = document.createElement('div');
    previewContent.style.cssText = `
        position: relative;
        max-width: 85%;
        max-height: 75%;
        text-align: center;
    `;

    // 创建图片元素
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.cssText = `
        max-width: 100%;
        max-height: 75vh;
        object-fit: contain;
        border-radius: 4px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.5);
    `;

    // 添加文件名
    const nameLabel = document.createElement('div');
    nameLabel.textContent = imageName || '未命名图片';
    nameLabel.style.cssText = `
        color: white;
        padding: 8px;
        font-size: 14px;
        margin-top: 8px;
    `;

    // 添加下载按钮
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = '下载图片';
    downloadBtn.style.cssText = `
        background: #4e8df5;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
        font-size: 13px;
        font-weight: 500;
        transition: all 0.25s;
    `;
    downloadBtn.addEventListener('click', function() {
        download({
            url: imageSrc,
            name: common_prefix ? `${common_prefix}_${imageName}` : imageName
        });

        this.textContent = '已下载';
        this.style.background = '#28a745';

        setTimeout(() => {
            this.textContent = '下载图片';
            this.style.background = '#4e8df5';
        }, 1500);
    });

    // 添加关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: -35px;
        right: -35px;
        background: none;
        border: none;
        font-size: 25px;
        color: white;
        cursor: pointer;
        padding: 8px;
    `;
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(previewContainer);
    });

    // 点击背景关闭预览
    previewContainer.addEventListener('click', function(e) {
        if (e.target === this) {
            document.body.removeChild(this);
        }
    });

    // 添加ESC键关闭预览
    const escHandler = function(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(previewContainer);
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);

    // 组装预览界面
    previewContent.appendChild(img);
    previewContent.appendChild(closeBtn);
    previewContainer.appendChild(previewContent);
    previewContainer.appendChild(nameLabel);
    previewContainer.appendChild(downloadBtn);
    document.body.appendChild(previewContainer);
}
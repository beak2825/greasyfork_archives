// ==UserScript==
// @name         虎扑图片解混淆助手
// @namespace    https://greasyfork.org/
// @version      1.0.3
// @description  虎扑论坛图片解混淆工具，支持小番茄混淆算法，可对图片进行加密、解密、恢复原图和下载操作。
// @license      MIT
// @author       Kira Diana
// @match        https://bbs.hupu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547069/%E8%99%8E%E6%89%91%E5%9B%BE%E7%89%87%E8%A7%A3%E6%B7%B7%E6%B7%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/547069/%E8%99%8E%E6%89%91%E5%9B%BE%E7%89%87%E8%A7%A3%E6%B7%B7%E6%B7%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/**
 * 此脚本的小番茄混淆代码来源于：https://xfqtphx.netlify.app/
 * 本人对代码进行了修改，以适配虎扑论坛。
 */

let pic_list = {};
let isOriginalPicPage = false;
let SIZE = 4294967296;
let first_config;
let defaultTomatoKey = 1;
let initialized = false;

function gilbert2d(width, height) {
    /**
     * Generalized Hilbert ('gilbert') space-filling curve for arbitrary-sized
     * 2D rectangular grids. Generates discrete 2D coordinates to fill a rectangle
     * of size (width x height).
     */
    const coordinates = [];

    if (width >= height) {
        generate2d(0, 0, width, 0, 0, height, coordinates);
    } else {
        generate2d(0, 0, 0, height, width, 0, coordinates);
    }

    return coordinates;
}

function generate2d(x, y, ax, ay, bx, by, coordinates) {
    const w = Math.abs(ax + ay);
    const h = Math.abs(bx + by);

    const dax = Math.sign(ax), day = Math.sign(ay); // unit major direction
    const dbx = Math.sign(bx), dby = Math.sign(by); // unit orthogonal direction

    if (h === 1) {
        // trivial row fill
        for (let i = 0; i < w; i++) {
            coordinates.push([x, y]);
            x += dax;
            y += day;
        }
        return;
    }

    if (w === 1) {
        // trivial column fill
        for (let i = 0; i < h; i++) {
            coordinates.push([x, y]);
            x += dbx;
            y += dby;
        }
        return;
    }

    let ax2 = Math.floor(ax / 2), ay2 = Math.floor(ay / 2);
    let bx2 = Math.floor(bx / 2), by2 = Math.floor(by / 2);

    const w2 = Math.abs(ax2 + ay2);
    const h2 = Math.abs(bx2 + by2);

    if (2 * w > 3 * h) {
        if ((w2 % 2) && (w > 2)) {
            // prefer even steps
            ax2 += dax;
            ay2 += day;
        }

        // long case: split in two parts only
        generate2d(x, y, ax2, ay2, bx, by, coordinates);
        generate2d(x + ax2, y + ay2, ax - ax2, ay - ay2, bx, by, coordinates);

    } else {
        if ((h2 % 2) && (h > 2)) {
            // prefer even steps
            bx2 += dbx;
            by2 += dby;
        }

        // standard case: one step up, one long horizontal, one step down
        generate2d(x, y, bx2, by2, ax2, ay2, coordinates);
        generate2d(x + bx2, y + by2, ax, ay, bx - bx2, by - by2, coordinates);
        generate2d(x + (ax - dax) + (bx2 - dbx), y + (ay - day) + (by2 - dby),
            -bx2, -by2, -(ax - ax2), -(ay - ay2), coordinates);
    }
}

// 添加获取原图URL的函数
function getOriginalImageUrl(url) {
    // 移除URL中的压缩参数
    if (url.includes('?x-oss-process=')) {
        return url.split('?x-oss-process=')[0];
    }
    return url;
}

// 更新encryptTomato函数
function encryptTomato(img, key){
    // 创建新的Image对象加载原图
    const originalImg = new Image();
    originalImg.crossOrigin = 'anonymous';

    // 获取图片ID
    const picId = img.getAttribute('pic_id');
    // 使用原图URL
    const originalUrl = pic_list[picId]?.originalUrl || getOriginalImageUrl(img.src);

    originalImg.onload = function() {
        const cvs = document.createElement("canvas");
        const width = cvs.width = originalImg.naturalWidth;
        const height = cvs.height = originalImg.naturalHeight;
        const ctx = cvs.getContext("2d");
        ctx.drawImage(originalImg, 0, 0);
        const imgdata = ctx.getImageData(0, 0, width, height);
        const imgdata2 = new ImageData(width, height);
        const curve = gilbert2d(width, height);

        // 计算偏移量
        const baseOffset = Math.round((Math.sqrt(5) - 1) / 2 * width * height);
        const offset = Math.round(baseOffset * parseFloat(key));

        for(let i = 0; i < width * height; i++){
            const old_pos = curve[i];
            const new_pos = curve[(i + offset) % (width * height)];
            const old_p = 4 * (old_pos[0] + old_pos[1] * width);
            const new_p = 4 * (new_pos[0] + new_pos[1] * width);
            imgdata2.data.set(imgdata.data.slice(old_p, old_p + 4), new_p);
        }

        ctx.putImageData(imgdata2, 0, 0);
        cvs.toBlob(b => {
            URL.revokeObjectURL(img.src);
            img.src = URL.createObjectURL(b);
            resizeImage(img);
        }, "image/jpeg", 0.95);
    };

    // 加载原图
    originalImg.src = originalUrl;
}

// 更新decryptTomato函数
function decryptTomato(img, key){
    // 创建新的Image对象加载原图
    const originalImg = new Image();
    originalImg.crossOrigin = 'anonymous';

    // 获取图片ID
    const picId = img.getAttribute('pic_id');
    // 使用原图URL
    const originalUrl = pic_list[picId]?.originalUrl || getOriginalImageUrl(img.src);

    originalImg.onload = function() {
        const cvs = document.createElement("canvas");
        const width = cvs.width = originalImg.naturalWidth;
        const height = cvs.height = originalImg.naturalHeight;
        const ctx = cvs.getContext("2d");
        ctx.drawImage(originalImg, 0, 0);
        const imgdata = ctx.getImageData(0, 0, width, height);
        const imgdata2 = new ImageData(width, height);
        const curve = gilbert2d(width, height);

        // 计算偏移量
        const baseOffset = Math.round((Math.sqrt(5) - 1) / 2 * width * height);
        const offset = Math.round(baseOffset * parseFloat(key));

        for(let i = 0; i < width * height; i++){
            const old_pos = curve[i];
            const new_pos = curve[(i + offset) % (width * height)];
            const old_p = 4 * (old_pos[0] + old_pos[1] * width);
            const new_p = 4 * (new_pos[0] + new_pos[1] * width);
            imgdata2.data.set(imgdata.data.slice(new_p, new_p + 4), old_p);
        }

        ctx.putImageData(imgdata2, 0, 0);
        cvs.toBlob(b => {
            URL.revokeObjectURL(img.src);
            img.src = URL.createObjectURL(b);
            resizeImage(img);
        }, "image/jpeg", 0.95);
    };

    // 加载原图
    originalImg.src = originalUrl;
}

// 添加setsrc辅助函数
function setsrc(img, src){
    URL.revokeObjectURL(img.src);
    img.src = src;
    img.style.display = "inline-block";
}

// 更新encrypt函数，使用requestAnimationFrame优化
function encrypt(event) {
    let container = event.target.parentNode;
    let img = container.nextSibling;
    if (!img) {
        return;
    }
    container.setAttribute('activated', 'true');
    let key = container.querySelector('.key-input').value;

    if (!checkKeyValidity('tomato', key)) {
        alert('小番茄算法仅支持大于0小于等于1.618的小数作为密钥');
        return;
    }

    if (!first_config) {
        first_config = { method: 'tomato', key: key };
        document.querySelectorAll('.method-select').forEach(e => {
            let container = e.parentNode;
            if (container.getAttribute('activated') == 'true') {
                return;
            }
            e.value = 'tomato';
            let keyInput = container.querySelector('.key-input');
            keyInput.value = key;
        });
    }
    if (!img.crossOrigin) {
        img.crossOrigin = 'anonymous';
    }
    img.style.display = 'none';
    let msg = container.querySelector('.msg');
    msg.style.display = '';
    // 使用requestAnimationFrame优化性能
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            console.time();
            encryptTomato(img, key);
            console.timeEnd();
            resizeImage(img);
            img.style.display = 'inline-block';
            msg.style.display = 'none';
        });
    });
}

// 更新decrypt函数，使用requestAnimationFrame优化
function decrypt(event) {
    let container = event.target.parentNode;
    let img = container.nextSibling;
    if (!img) {
        return;
    }
    container.setAttribute('activated', 'true');
    let key = container.querySelector('.key-input').value;

    if (!checkKeyValidity('tomato', key)) {
        alert('小番茄算法仅支持大于0小于等于1.618的小数作为密钥');
        return;
    }

    if (!first_config) {
        first_config = { method: 'tomato', key: key };
        document.querySelectorAll('.method-select').forEach(e => {
            let container = e.parentNode;
            if (container.getAttribute('activated') == 'true') {
                return;
            }
            e.value = 'tomato';
            let keyInput = container.querySelector('.key-input');
            keyInput.value = key;
        });
    }
    if (!img.crossOrigin) {
        img.crossOrigin = 'anonymous';
    }
    img.style.display = 'none';
    let msg = container.querySelector('.msg');
    msg.style.display = '';
    // 使用requestAnimationFrame优化性能
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            console.time();
            decryptTomato(img, key);
            console.timeEnd();
            resizeImage(img);
            img.style.display = 'inline-block';
            msg.style.display = 'none';
        });
    });
}

function resizeImage(img) {
    if (img.width < img.naturalWidth) {
        img.height = img.naturalHeight * img.width / img.naturalWidth;
    } else if (img.height < img.naturalHeight) {
        img.width = img.naturalWidth * img.height / img.naturalHeight;
    }
}

function pickImage(event) {
    if (event.target.files.length <= 0) {
        return;
    }
    let container = event.target.parentNode;
    let img = container.nextSibling;
    if (!img) {
        return;
    }
    let url = URL.createObjectURL(event.target.files[0]);
    img.src = url;
    event.target.value = '';

    img.onload = () => resizeImage(img);
}

function encrypt(event) {
    let container = event.target.parentNode;
    let img = container.nextSibling;
    if (!img) {
        return;
    }
    container.setAttribute('activated', 'true');
    let key = container.querySelector('.key-input').value;

    if (!checkKeyValidity('tomato', key)) {
        alert('小番茄算法仅支持大于0小于等于1.618的小数作为密钥');
        return;
    }

    if (!first_config) {
        first_config = { method: 'tomato', key: key };
        document.querySelectorAll('.method-select').forEach(e => {
            let container = e.parentNode;
            if (container.getAttribute('activated') == 'true') {
                return;
            }
            e.value = 'tomato';
            let keyInput = container.querySelector('.key-input');
            keyInput.value = key;
        });
    }
    let delay = 100;
    if (!img.crossOrigin) {
        img.crossOrigin = 'anonymous';
    }
    img.style.display = 'none';
    let msg = container.querySelector('.msg');
    msg.style.display = '';
    setTimeout(() => {
        console.time();
        encryptTomato(img, key);
        console.timeEnd();
        resizeImage(img);
        img.style.display = 'inline-block';
        msg.style.display = 'none';
    }, delay);
}

function decrypt(event) {
    let container = event.target.parentNode;
    let img = container.nextSibling;
    if (!img) {
        return;
    }
    container.setAttribute('activated', 'true');
    let key = container.querySelector('.key-input').value;

    if (!checkKeyValidity('tomato', key)) {
        alert('小番茄算法仅支持大于0小于等于1.618的小数作为密钥');
        return;
    }

    if (!first_config) {
        first_config = { method: 'tomato', key: key };
        document.querySelectorAll('.method-select').forEach(e => {
            let container = e.parentNode;
            if (container.getAttribute('activated') == 'true') {
                return;
            }
            e.value = 'tomato';
            let keyInput = container.querySelector('.key-input');
            keyInput.value = key;
        });
    }
    let delay = 100;
    if (!img.crossOrigin) {
        img.crossOrigin = 'anonymous';
    }
    img.style.display = 'none';
    let msg = container.querySelector('.msg');
    msg.style.display = '';
    setTimeout(() => {
        console.time();
        decryptTomato(img, key);
        console.timeEnd();
        resizeImage(img);
        img.style.display = 'inline-block';
        msg.style.display = 'none';
    }, delay);
}

function restore(event) {
    let container = event.target.parentNode;
    let img = container.nextSibling;
    if (!img) {
        return;
    }
    let id = img.getAttribute('pic_id');
    if (pic_list[id]) {
        img.src = pic_list[id].url;
        img.width = pic_list[id].width;
        img.height = pic_list[id].height;
    }
    resizeImage(img);
}

function download(event) {
    let container = event.target.parentNode;
    let img = container.nextSibling;
    if (!img) {
        return;
    }
    let image = new Image();
    image.src = img.src;
    image.setAttribute("crossOrigin", "anonymous");

    image.onload = function() {
        let a = document.createElement("a");
        a.download = Date.now() + ".png";
        if (img.src.startsWith('blob:') || img.src.startsWith('data:')) {
            a.href = image.src;
        } else {
            let canvas = document.createElement("canvas");
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            canvas.getContext("2d").drawImage(image, 0, 0, image.width, image.height);
            a.href = canvas.toDataURL({ format: 'png', quality: 1 });
        }
        a.click();
    };
}

// 添加用户界面
function addButton(img) {
    // 检查是否已经添加过控件
    if (img.previousElementSibling && img.previousElementSibling.classList.contains('pic-decrypt-container')) {
        console.log('控件已存在，跳过:', img);
        return;
    }

    // 跳过base64图片
    if (img.src.indexOf('data:image') === 0) {
        console.log('跳过base64图片:', img);
        return;
    }

    // 跳过虎扑logo图片
    if (img.src.includes('channel/website/static/images/basketball-nba-logo.png')) {
        console.log('跳过虎扑logo图片:', img);
        return;
    }

    // 跳过头像图片 (根据class和src特征判断)
    if (img.classList.contains('avatar') || img.src.includes('user/')) {
        console.log('跳过头像图片:', img);
        return;
    }

    // 跳过表情包图片 (根据尺寸和class判断)
    // 假设表情包通常较小 (宽高小于200px) 且有特定class
    if ((img.naturalWidth < 500 && img.naturalHeight < 500) || img.classList.contains('表情相关的class')) {
        console.log('跳过表情包图片:', img);
        return;
    }

    let container = document.createElement('div');
    container.className = 'pic-decrypt-container';
    // 设置为水平紧凑布局
    container.style.cssText = 'margin: 3px 0; padding: 5px; background-color: rgba(255, 255, 255, 0.95); border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); text-align: center; z-index: 100; clear: both; font-size: 12px; white-space: nowrap;';

    // 水平布局的按钮组
    container.innerHTML = `
        <select class="method-select" disabled style="display:none;">
            <option value="tomato">🍅小番茄</option>
        </select>
        <input class="key-input" type="text" placeholder="密钥" value="${defaultTomatoKey}" style="width: 50px; height: 20px; font-size: 12px; margin: 0 3px;">
        <input class="normal-btn decrypt" type="button" value="解混淆" style="background-color: #eb3678;color:#fff;">
        <input class="normal-btn restore" type="button" value="还原" style="background-color: #fb773c;color:#fff;">
        <input class="normal-btn download" type="button" value="保存" style="background-color: #3385ff;color:#fff;">
        <p class="msg" style="display: none; font-size: 14px; margin: 5px;">处理中...</p>
    `;

    // 内联样式，确保按钮水平排列
    const styleText = `
    .normal-btn, .method-select, .key-input {
        height: 22px;
        line-height: 22px;
        font-size: 12px;
        padding: 0 6px;
        margin: 2px 3px;
        border-radius: 3px;
        display: inline-block;
        position: relative;
        vertical-align: middle;
        text-align: center;
    }

    .normal-btn {
        border: 0;
        cursor: pointer;
        min-width: 50px;
    }

    .method-select, .key-input {
        border: 1px solid #888;
        color: #000;
    }

    .key-input:hover {
        cursor: text;
    }
    `;

    // 添加样式到容器
    const styleElement = document.createElement('style');
    styleElement.textContent = styleText;
    container.appendChild(styleElement);

    // 设置图片ID
    let pic_id = img.getAttribute('pic_id') || 'pic_' + Date.now();
    img.setAttribute('pic_id', pic_id);

    // 存储原图信息
    const originalUrl = getOriginalImageUrl(img.src);
    pic_list[pic_id] = {
        'url': img.src,
        'originalUrl': originalUrl,
        'width': img.width,
        'height': img.height
    };

    // 插入控件到图片前面
    try {
        img.parentNode.insertBefore(container, img);
        console.log('成功添加控件到图片:', img);
    } catch (e) {
        console.error('添加控件失败:', e, img);
        // 尝试直接添加到body（后备方案）
        document.body.appendChild(container);
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.left = '10px';
        console.log('已添加控件到页面顶部');
    }

    // 设置控件事件
    if (first_config) {
        let keyInput = container.querySelector('.key-input');
        keyInput.value = first_config.key;
    }
    container.querySelector('.decrypt').onclick = decrypt;
    container.querySelector('.restore').onclick = restore;
    container.querySelector('.download').onclick = download;
}

// 修改虎扑图片获取逻辑，增强兼容性
function loadPicList() {
    console.log('开始查找图片...');

    // 尝试多种可能的图片选择器
    const selectors = [
        '.quote-content img',
        '.bbs-img',
        '.thread-content img',
        '.text img',
        '.post-content img',
        '.article-content img',
        '.topic-content img',
        'img[class*="bbs-img-"]', // 匹配包含bbs-img-的class
        'img[data-original]', // 匹配懒加载图片
        '#j_p_postlist img', // 帖子列表中的图片
        '.pics-wrap img' // 图片包裹容器中的图片
    ];

    let images = [];
    selectors.forEach(selector => {
        const found = document.querySelectorAll(selector);
        images = [...images, ...found];
        console.log(`选择器 '${selector}' 找到 ${found.length} 张图片`);
    });

    // 去重
    images = [...new Set(images)];
    console.log(`去重后找到 ${images.length} 张图片`);

    if (images.length === 0) {
        // 尝试直接获取所有图片
        images = document.querySelectorAll('img');
        console.log(`尝试直接获取所有图片，找到 ${images.length} 张`);
    }

    images.forEach(img => {
        addButton(img);
    });

    console.log('图片处理完成');
}

// 以下函数保持不变
function getElementTop(element) {
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }
    return actualTop;
}

// 获取距离浏览器可视区垂直中点最近的图片
function getCenterImg() {
    let minDelta = 100000000;
    let centerImg = null;
    let viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    let centerScrollTop = document.documentElement.scrollTop + viewPortHeight / 2;
    let images = document.querySelectorAll('.quote-content img, .bbs-img, .thread-content img');
    for (let i = 0; i < images.length; ++i) {
        let img = images[i];
        let top = getElementTop(img);
        let bottom = top + img.height;
        let delta = Math.abs((top + bottom) / 2 - centerScrollTop);
        if (delta < minDelta) {
            centerImg = img;
            minDelta = delta;
        }
    }
    return centerImg;
}

function checkKeyValidity(method, key) {
    switch (method) {
        case 'tomato':
            try {
                return parseFloat(key) > 0 && parseFloat(key) <= 1.618;
            } catch (e) {
                return false;
            }
        default:
            return true;
    }
}

function scrollToNextImage(isReverse) {
    let images = document.querySelectorAll('.quote-content img, .bbs-img, .thread-content img');
    let centerImg = getCenterImg();
    if (!centerImg) return;

    for (let i = 0; i < images.length; ++i) {
        if (!images[i].isEqualNode(centerImg)) {
            continue;
        }
        let scroll;
        if (isReverse) {
            if (i > 0) {
                scroll = getElementTop(images[i - 1].previousElementSibling);
            } else {
                scroll = getElementTop(centerImg.previousElementSibling);
            }
        } else {
            let top = getElementTop(centerImg.previousElementSibling);
            if (Math.abs(top - 60 - document.documentElement.scrollTop) > 50) {
                scroll = top;
            } else if (i < images.length - 1) {
                scroll = getElementTop(images[i + 1].previousElementSibling);
            } else {
                scroll = getElementTop(centerImg.previousElementSibling);
            }
        }
        if (scroll > 60) {
            scroll -= 60;
        }
        document.documentElement.scrollTo({ top: scroll, behavior: 'smooth' });
        break;
    }
}

function main() {
    // 检查是否是虎扑帖子页面
    if (!location.href.match(/bbs\.hupu\.com\/\d+/g)) {
        return;
    }

    // 初始加载图片
    loadPicList();

    // 定时检查新图片
    setInterval(() => {
        loadPicList();
    }, 2000);
}

main();
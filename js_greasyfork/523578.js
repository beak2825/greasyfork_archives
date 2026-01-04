// ==UserScript==
// @name         Image Upload to Imgur and Copy URL
// @namespace    https://bgm.tv
// @version      1.18
// @description  Adds a sidebar button to upload images and copy the image URL to clipboard in an artistic style.
// @author       Rin
// @match        https://bgm.tv/**
// @grant        GM_getResourceURL
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/wasm-vips@0.0.11/lib/vips.min.js
// @downloadURL https://update.greasyfork.org/scripts/523578/Image%20Upload%20to%20Imgur%20and%20Copy%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/523578/Image%20Upload%20to%20Imgur%20and%20Copy%20URL.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
let script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.src = "https://update.greasyfork.org/scripts/523631/1519838/coi-serviceworker.js";
document.documentElement.appendChild(script);
 
// 创建元素的简化函数
const createElement = (tag, props = {}, styles = {}) => {
    const el = Object.assign(document.createElement(tag), props);
    Object.assign(el.style, styles);
    return el;
};

// 右上角按钮样式
const buttonStyles = {
  position: 'fixed',
  top: '0',
  right: '0',
  zIndex: '9999',
  padding: '0',
  backgroundImage: 'linear-gradient(135deg, #da8189, #d87e86)', // 使用接近#da8189, #d87e86的渐变色
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  fontSize: '18px', 
  height: '55px', // 设置高度为 55px
  width: '55px', // 设置宽度为 55px
  textAlign: 'center',
  lineHeight: '55px', // 调整行高，与新的高度一致
  transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)', // 更加流畅的过渡效果
  borderRadius: '0 0 0 55px', // 修改圆角，与新的宽高一致
  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)', // 更加柔和的阴影
  overflow: 'hidden',
};

// 创建上传按钮
const sidebarButton = createElement('button', { textContent: '☁️' }, buttonStyles);

// 悬浮效果 - 使用更细腻的动画和颜色变化
sidebarButton.addEventListener('mouseenter', () => {
    sidebarButton.style.backgroundImage = 'linear-gradient(135deg, #ff7b82, #ff9a9e)'; // 更亮的渐变
    sidebarButton.style.boxShadow = '0px 15px 40px rgba(0, 0, 0, 0.4)'; // 更大的阴影
    sidebarButton.style.color = '#fff'; // 确保文字颜色对比强烈
});
sidebarButton.addEventListener('mouseleave', () => {
    sidebarButton.style.backgroundImage = 'linear-gradient(135deg, #da8189, #d87e86)'; // 恢复原始渐变
    sidebarButton.style.boxShadow = '0px 5px 15px rgba(0, 0, 0, 0.2)'; // 恢复原始阴影
});
 
    // 文件输入框
    const fileInput = createElement('input', { type: 'file', accept: 'image/*' }, { display: 'none' });
 
    // 点击按钮触发文件选择
    sidebarButton.addEventListener('click', () => fileInput.click());
 
    // 文件上传逻辑
    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (file.size > 20 * 1024 * 1024) {
            return alert('请选择不大于20MB的图片');
        }
        try {
            // 初始化 wasm-vips
            const vips = await Vips({workaroundCors: true});//deal with `Failed to construct 'Worker': Script at 'https://120.79.81.196/vips.js' cannot be accessed from origin 'null'.`
            // 转换图片为 AVIF 格式
            const avifFile = await convertToAVIF(file, vips);
            // 上传图片
            const url = await uploadImage(avifFile);
            if (isMobile()) {
                alert('剪切板可能无法使用，URL已复制到地址栏');
                history.pushState(null, null, url);
            } else {
                await navigator.clipboard.writeText(url);
                alert('上传成功！URL已复制到剪切板');
            }
        } catch (error) {
            alert(`上传失败：${error.message}`);
        }
        fileInput.value = ''; // 清空文件选择框的值
    });

    // 图片格式转换函数
    async function convertToAVIF(file, vips) {
        const buffer = await file.arrayBuffer();
        const input = new Uint8Array(buffer);

        // 使用 wasm-vips 读取图片
        const image = vips.Image.newFromBuffer(input);

        // 转换为 AVIF 格式
        const avifBuffer = image.writeToBuffer('.avif', {
            Q: 75, // 设置质量，范围 0-100
        });

        // 创建新的 AVIF 文件
        const avifFile = new File([avifBuffer], file.name.replace(/\.\w+$/, '.avif'), {
            type: 'image/avif',
        });

        // 返回转换后的文件
        return avifFile;
    }
 
    // 图片上传函数
    async function uploadImage(file) {
        const formData = new FormData();
        formData.append('file', file);
 
        const response = await fetch('https://120.79.81.196/api/file/upload', {
            method: 'POST',
            body: formData
        });
 
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.code === 1) throw new Error(data.data);
 
        return data.data.url;
    }
 
    // 判断是否为移动设备
    const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
 
    // 将按钮和文件输入框添加到页面
    document.body.append(sidebarButton, fileInput);
})();
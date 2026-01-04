// ==UserScript==
// @name         网页图片下载器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  下载网页中的图片，按顺序排列好，你可以直接转换为pdf，方便查看
// @author       etng
// @match        https://mp.weixin.qq.com/s/*
// @require      https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/510969/%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/510969/%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // 创建按钮和样式
    const btnDownloadImages = createButton('下载为图片');
    const btnDownloadPdf = createButton('下载为PDF');
    const qrCodeImg = document.createElement('img');
    qrCodeImg.src = 'https://github.com/etng/user.js/raw/main/appraise.jpg'; // 替换为二维码图片的实际URL
    qrCodeImg.style.width = '160px';
    qrCodeImg.style.height = '160px';
    const downloadBtnContainer = document.createElement('div');

    // 按钮容器的样式设置
    Object.assign(downloadBtnContainer.style, {
        borderTop: '1px solid #fff',

        display: 'none',
        flexDirection: 'column',
        alignItems: 'center'
    });
    const ui = document.createElement('div');
    Object.assign(ui.style, {
        position: 'fixed',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: '1px solid #fff',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        zIndex: '1001'  
    });
    const toggleBtn = document.createElement('div');
    toggleBtn.innerText = '页面图片处理工具';
    Object.assign(toggleBtn.style, {
        padding: '5px',
        backgroundColor: '#007bff',
        color: '#fff',
        // border: '1px solid #fff',
        // borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    });
    const tipsDiv = document.createElement('ul');
    ;['点击下载按钮后等待图片下载完成','然后剔除不想要的广告内图片即可(后续会考虑自动去掉)'].forEach(line=>{
        let li = document.createElement('li');
        li.innerText = line;
        tipsDiv.appendChild(li);
    })
    Object.assign(tipsDiv.style, {
        padding: '5px',
        backgroundColor: '#000',
        color: '#eee',
        fontSize: '12px',
    });
    const imageCntSpan = document.createElement('span');
    // 将按钮和二维码图片添加到容器
    downloadBtnContainer.appendChild(btnDownloadImages);
    // downloadBtnContainer.appendChild(btnDownloadPdf);
    downloadBtnContainer.appendChild(tipsDiv);
    downloadBtnContainer.appendChild(imageCntSpan);
    downloadBtnContainer.appendChild(qrCodeImg);

    // 将容器和切换按钮添加到页面
    ui.appendChild(toggleBtn);
    ui.appendChild(downloadBtnContainer);
    document.body.appendChild(ui);

    // 添加切换功能
    toggleBtn.addEventListener('click', () => {
        downloadBtnContainer.style.display = (downloadBtnContainer.style.display === 'none' || !downloadBtnContainer.style.display) ? 'flex' : 'none';
    });

    // 创建基本样式对象
    const baseStyle = {
        position: 'fixed',
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        padding: '5px',
        zIndex: '1002', // 确保比 toggleBtn 更高的 z-index
        display: 'none'
    };

    // 错误提示元素
    const errorDiv = document.createElement('div');
    Object.assign(errorDiv.style, baseStyle, { backgroundColor: 'red' });
    document.body.appendChild(errorDiv);

    // 信息提示元素
    const infoDiv = document.createElement('div');
    Object.assign(infoDiv.style, baseStyle, { backgroundColor: 'blue' });
    document.body.appendChild(infoDiv);

    // 显示错误提示
    function showError(message) {
        errorDiv.innerText = message;
        errorDiv.style.display = 'block';
        setTimeout(() => { errorDiv.style.display = 'none'; }, 5000);
    }

    // 显示信息提示
    function showInfo(message) {
        infoDiv.innerText = message;
        infoDiv.style.display = 'block';
        setTimeout(() => { infoDiv.style.display = 'none'; }, 5000);
    }

    // 创建按钮的函数
    function createButton(text) {
        const btn = document.createElement('button');
        btn.innerText = text;
        Object.assign(btn.style, {
            // padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'block',
            marginBottom: '5px'
        });
        return btn;
    }

    // 获取当前时间并格式化
    function getFormattedTime() {
        const now = new Date();
        return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}` +
               `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    }

    // 获取活动名称
    function getActivityName() {
        const activityNameNode = document.getElementById('activity-name');
        return activityNameNode ? activityNameNode.innerText.trim() : document.title.trim();
    }

    // 获取图片下载链接
    function getDownloadLinks() {
        const pageContent = document.getElementById('page-content');
        if (!pageContent) {
            showError('找不到 id 为 page-content 的元素');
            return [];
        }

        const images = Array.from(pageContent.querySelectorAll('img'));
        if (images.length === 0) {
            showError('没有找到图片元素');
            return [];
        }

        const downloadLinks = [];
        images.forEach((img) => {
            const src = img.getAttribute('data-src') || img.getAttribute('src');
            if (src) {
                const match = src.match(/\/(sz_)?mmbiz_(\w+)\//);
                if (match && match[2]) {
                    downloadLinks.push({ url: src, extension: match[2] });
                } else {
                    console.log(`无法从地址提取文件后缀: ${src}`);
                }
            } else {
                showInfo('图片元素缺少有效的 src 或 data-src 属性');
            }
        });
        imageCntSpan.innerText=`当前图片数量: ${downloadLinks.length}`
        return downloadLinks;
    }

    // 下载图片的函数
    async function downloadImages() {
        const formattedTime = getFormattedTime();
        const activityName = getActivityName();
        const downloadLinks = getDownloadLinks();

        if (downloadLinks.length === 0) {
            showError("无图片可下载")
            return;
        }

        for (let i = 0; i < downloadLinks.length; i++) {
            setTimeout(async () => {
                try {
                    const response = await fetch(downloadLinks[i].url);
                    if (!response.ok) throw new Error(`网络响应失败: ${response.statusText}`);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = `${activityName}_${formattedTime}_${i + 1}.${downloadLinks[i].extension}`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    showInfo(`下载图片: ${activityName}_${formattedTime}_${i + 1}.${downloadLinks[i].extension}`);
                } catch (error) {
                    showError(`下载图片时发生错误: ${error.message}`);
                }
            }, i * 1000);
        }

        showInfo('图片下载链接已生成并开始下载');
    }

    // 下载PDF的函数
    async function downloadPdf() {
        if (typeof window.jspdf === 'undefined') {
            // 如果 window.jspdf 仍然未定义，动态加载一次脚本
            // await loadJsPdfAsync(jsPdfBase64);
            showError(`PDF库加载失败，您可以直接在下载好的目录批量转换`);
            return
        }
        await proceedWithPdfDownload();
    }


    async function proceedWithPdfDownload() {
        const { jsPDF } = window.jspdf;
        const formattedTime = getFormattedTime();
        const activityName = getActivityName();
        const downloadLinks = getDownloadLinks();

        if (downloadLinks.length === 0) return;

        const pdfDoc = new jsPDF();
        let firstPage = true;

        for (let i = 0; i < downloadLinks.length; i++) {
            try {
                const response = await fetch(downloadLinks[i].url);
                if (!response.ok) throw new Error(`网络响应失败: ${response.statusText}`);
                const blob = await response.blob();
                const base64 = await blobToBase64(blob);

                if (!firstPage) {
                    pdfDoc.addPage();
                }

                pdfDoc.addImage(base64, 'JPEG', 10, 10, 190, 0);
                firstPage = false;
                showInfo(`处理图片: ${activityName}_${formattedTime}_${i + 1}.${downloadLinks[i].extension}`);
            } catch (error) {
                showError(`下载图片时发生错误: ${error.message}`);
            }
        }
        pdfDoc.save(`${activityName}_${formattedTime}.pdf`);
        showInfo('图片下载PDF已生成并开始下载');
    }

    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    // 按钮点击事件处理函数
    btnDownloadImages.addEventListener('click', async () => {
        btnDownloadImages.disabled = true; // 禁用按钮
        await downloadImages();
        btnDownloadImages.disabled = false; // 所有操作完成后重新启用按钮
    });

    btnDownloadPdf.addEventListener('click', async () => {
        btnDownloadPdf.disabled = true; // 禁用按钮
        await downloadPdf();
        btnDownloadPdf.disabled = false; // 所有操作完成后重新启用按钮
    });

})();
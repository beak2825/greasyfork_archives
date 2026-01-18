// ==UserScript==
// @name         虫虫钢琴铺面查看脚本
// @namespace    TesterNaN.github.io
// @version      2.3
// @description  虫虫钢琴铺面查看工具，可点击下载，全屏，打印等功能。
// @author       TesterNaN
// @license      GPLv3
// @match        *://www.gangqinpu.com/jianpu/*
// @match        *://www.gangqinpu.com/cchtml/*
// @match        *://www.gangqinpu.com/sheetplayer/web.html?*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @icon         https://www.gangqinpu.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      s201.lzjoy.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/457019/%E8%99%AB%E8%99%AB%E9%92%A2%E7%90%B4%E9%93%BA%E9%9D%A2%E6%9F%A5%E7%9C%8B%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/457019/%E8%99%AB%E8%99%AB%E9%92%A2%E7%90%B4%E9%93%BA%E9%9D%A2%E6%9F%A5%E7%9C%8B%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

function downAu() {
    return new Promise((resolve, reject) => {
        let targetUrl = window.location.href; // 注意：这里修改为let，因为要重新赋值
        if(targetUrl.includes("/jianpu/")){
            targetUrl = targetUrl.replace('jianpu', 'cchtml');
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: targetUrl,
            onload: function(response) {
                if (response.status === 200) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const audioElement = doc.querySelector('audio.music-audio.audio');
                    if (audioElement) {
                        const sourceElement = audioElement.querySelector('source[type="audio/mp3"]');
                        if (sourceElement && sourceElement.src) {
                            console.log('找到音频源:', sourceElement.src);
                            resolve(sourceElement.src); // 成功时返回结果
                        } else {
                            console.log('未找到音频source标签或src属性');
                            reject('未找到音频源');
                        }
                    } else {
                        console.log('未找到audio元素');
                        reject('未找到音频元素');
                    }
                } else {
                    console.error('请求失败，状态码:', response.status);
                    reject('请求失败，状态码: ' + response.status);
                }
            },
            onerror: function(error) {
                console.error('请求出错:', error);
                reject('请求出错: ' + error.message);
            }
        });
    });
}
async function forceDownload(url, filename = 'audio.mp3') {
    try {
        // 1. 先获取文件的Blob对象
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors', // 处理跨域
            headers: {
                'Accept': 'audio/mpeg' // 明确指定MP3格式
            }
        });

        if (!response.ok) {
            throw new Error(`请求失败: ${response.status}`);
        }

        // 2. 将响应转换为Blob对象
        const blob = await response.blob();

        // 3. 创建本地URL（不受跨域限制）
        const blobUrl = window.URL.createObjectURL(blob);

        // 4. 创建a标签并触发下载
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename; // 强制下载的关键属性

        // 添加到文档并触发点击
        document.body.appendChild(link);
        link.click();

        // 5. 清理资源
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl); // 释放Blob URL
        }, 100);

    } catch (error) {
        console.error('强制下载失败:', error);
        alert('下载失败: ' + error.message);
    }
}

function setJianpuMode(url,type) {
    const urlObj = new URL(url);
    const newMode = type;
    urlObj.searchParams.set('jianpuMode', newMode);
    return urlObj.toString();
}

function noAiScore() {
    // 等待jsPDF加载
    if (typeof window.jspdf === 'undefined') {
        console.log('等待jsPDF加载...');
        setTimeout(main, 1000);
        return;
    }

    main();

    let imageURLs = null;

    function main() {
        const observer = new MutationObserver(() => {
            const container = document.querySelector('.swiper-wrapper');

            if (!container) return;

            document.querySelector("#line-spectrum-box > div.defalut.no-buy.active > div.img-mask").style.display='none';
            document.querySelector("#siwper1-middle-play").style.display='none';
            document.querySelector("#siwper1-next").style.display='none';
            document.querySelector("#siwper1-prev").style.display='none';

            const images = container.querySelectorAll('.swiper-slide img.img');
            if (images.length === 0) return;

            // 检查第二张图
            console.log(images[1].src);
            if (images[1] && images[1].src === 'https://s201.lzjoy.com/res/statics/2022/app/z.png') {
                console.log('第二张图为z.png，不添加监听');
                observer.disconnect();
                alert("对不起，暂不支持获取该曲谱")
                return;
            }
            alert("对不起，本曲谱只支持下载PDF功能")

            // 收集图片URL
            imageURLs = [];
            images.forEach(img => {
                if (img.src && img.src !== 'https://s201.lzjoy.com/res/statics/2022/app/z.png') {
                    imageURLs.push(img.src);
                }
            });

            console.log('找到图片URL:', imageURLs);

            // 给原下载按钮添加监听
            addListenerToOriginalButton();
            addListenerToOriginalH5Button();

            observer.disconnect();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => observer.disconnect(), 30000);
    }

    function addListenerToOriginalButton() {
        const originalBtn = document.querySelector(".down.download");

        if (!originalBtn) {
            console.log('未找到原下载按钮');
            return;
        }

        console.log('给原下载按钮添加监听');

        // 移除所有现有的点击监听器（可选，但可能影响其他功能）
        // 更好的方法是使用 capture 阶段
        const newBtn = originalBtn.cloneNode(true);
        originalBtn.parentNode.replaceChild(newBtn, originalBtn);

        // 重新添加我们的事件监听器
        newBtn.addEventListener('click', async function(event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            if (!imageURLs || imageURLs.length === 0) {
                console.log('没有图片URL');
                return;
            }

            console.log('开始合成PDF');

            // 保存原始文本
            const originalText = this.innerHTML;

            try {
                // 合成PDF
                await createPDF(imageURLs);
                console.log('PDF合成完成');
            } catch (error) {
                console.error('生成PDF失败:', error);
            }
        }, true); // 使用捕获阶段

        // 如果你想要确保完全拦截，可以添加捕获阶段的事件
        newBtn.addEventListener('click', function(event) {
            event.stopImmediatePropagation();
        }, true);
    }

    function addListenerToOriginalH5Button() {
        const originalBtn = document.querySelector("#score_header > div > div > div.top-down");

        if (!originalBtn) {
            console.log('未找到原下载按钮');
            return;
        }

        console.log('给原下载按钮添加监听');

        // 移除所有现有的点击监听器（可选，但可能影响其他功能）
        // 更好的方法是使用 capture 阶段
        const newBtn = originalBtn.cloneNode(true);
        originalBtn.parentNode.replaceChild(newBtn, originalBtn);

        // 重新添加我们的事件监听器
        newBtn.addEventListener('click', async function(event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            if (!imageURLs || imageURLs.length === 0) {
                console.log('没有图片URL');
                return;
            }

            console.log('开始合成PDF');

            // 保存原始文本
            const originalText = this.innerHTML;

            try {
                // 合成PDF
                await createPDF(imageURLs);
                console.log('PDF合成完成');
            } catch (error) {
                console.error('生成PDF失败:', error);
            }
        }, true); // 使用捕获阶段

        // 如果你想要确保完全拦截，可以添加捕获阶段的事件
        newBtn.addEventListener('click', function(event) {
            event.stopImmediatePropagation();
        }, true);
    }
    async function createPDF(urls) {
        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const margin = 10;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const contentWidth = pageWidth - 2 * margin;
        const contentHeight = pageHeight - 2 * margin;

        // const pageTitle = document.title.replace(/[<>:"/\\|?*]/g, '_').substring(0, 50);
        const pageTitle = document.querySelector(".detils_box > hgroup > div > h1").innerText;
        const fileName = `${pageTitle}.pdf`;

        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];

            try {
                console.log(`处理第 ${i + 1} 张图片`);

                const img = new Image();
                img.crossOrigin = "anonymous";

                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = url;
                });

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imgData = canvas.toDataURL('image/jpeg', 0.9);

                const scale = Math.min(
                    contentWidth / img.width,
                    contentHeight / img.height
                );
                const displayWidth = img.width * scale;
                const displayHeight = img.height * scale;

                const x = margin + (contentWidth - displayWidth) / 2;
                const y = margin + (contentHeight - displayHeight) / 2;

                if (i > 0) pdf.addPage();
                pdf.addImage(imgData, 'JPEG', x, y, displayWidth, displayHeight);

            } catch (error) {
                console.error(`处理图片失败:`, error);
            }

            await new Promise(resolve => setTimeout(resolve, 100));
        }

        pdf.save(fileName);
        console.log(`PDF已保存: ${fileName}`);
    }
}

function CrackMain(){
    const jp_icon = "https://s201.lzjoy.com/public/web_static/images/score_details/jianpu-icon.png";
    const wxp_icon = "https://s201.lzjoy.com/public/web_static/images/score_details/qupu-icon.png";
    var kj=document.getElementById("ai-score");
    if(kj==null){
        noAiScore();
        return -1;
    }

    var btn1=document.querySelector(".down.download");
    var btn2=document.getElementById("s_d_fullBtn");
    var btn3=document.querySelector(".print.Printing");
    var tojp=document.querySelector(".jianpu-btn");
    var downAudio=document.querySelector(".share.s_d_shareBtn")
    var downCCMZ=document.querySelector(".like.Collection");
    var H5Image=document.querySelector("body > section > div.s_d_h_b_item1 > div.tab-body.c-b-3 > div > img");
    var H5Viewer=document.querySelector("body > section > div.s_d_h_b_item1 > div.tab-body.c-b-3 > div");
    var H5DownBtn=document.querySelector("#score_header > div > div > div.top-down");
    var H5PrintBtn=document.querySelector("#score_header > div > div > div.top-print");
    var H5ToJp=document.querySelector("body > section > div.s_d_h_b_item1 > div.audition > div.li.audition-jian")
    setTimeout(function(){
        try{
            H5Image.style.display = 'none';
            H5Viewer.innerHTML='<iframe id="ai-score-H5" src="'+kj.src+'" frameborder="0" data-ruffle-polyfilled="" scrolling="yes" style="width: 100%; height: 740px; border: none; overflow: auto; min-height: 740px;"></iframe>'+H5Viewer.innerHTML;
            if (H5Viewer) {
                // 移除阴影
                H5Viewer.style.boxShadow = "none";
                H5Viewer.style.borderTop = "none";

                // 创建样式移除伪元素
                const style = document.createElement('style');
                style.textContent = `
                    body > section > div.s_d_h_b_item1 > div.tab-body.c-b-3 > div::before {
                        display: none !important;
                }`;
                document.head.appendChild(style);

                console.log("修复完成");
            }
            const MAX_WIDTH = 1000; // 最大宽度1000px
            function adjustHeight() {
                if (!H5Viewer) return;

                const width = H5Viewer.clientWidth;

                // 只在宽度小于等于1000px时按比例缩放
                if (width <= MAX_WIDTH) {
                    const newHeight = Math.round(width * 2263 / 1600);
                    H5Viewer.style.height = newHeight + 'px';

                    console.log(`宽度: ${width}px, 设置高度: ${newHeight}px`);
                } else {
                    // 宽度超过1000px，设置固定高度或auto
                    // 这里你可以选择保持高度不变或设置为auto
                    // el.style.height = 'auto';
                }
            }

            adjustHeight();
            unsafeWindow.addEventListener('resize', adjustHeight);

            // 监听移动设备旋转
            unsafeWindow.addEventListener('orientationchange', function() {
                setTimeout(adjustHeight, 100);
            });
        }catch(e){}
        try{
            document.querySelector("#line-spectrum-box > div.ai > div").style.visibility="hidden";
        }catch(e){}
        try{
            document.querySelector(".s-d-m-b-buy").style.visibility="hidden";
        }catch(e){}
        try{
        //document.querySelector(".no-buy.active > div.img-mask").style.visibility="hidden";
            document.querySelector("#line-spectrum-box > div.defalut.no-buy.active > div.img-mask").style.visibility="hidden";
        }catch(e){}
        try{
            document.querySelector("#line-spectrum-box > div.ai").style.display='block';
        }catch(e){}
        try{
            document.querySelector("#line-spectrum-box > div.defalut.no-buy.active").style.display="none";
        }catch(e){}
        try{
            document.querySelector("#siwper1-middle-play").style.display="none";
        }catch(e){}
        try{
            document.querySelector("#ai-score").scrolling="yes";
        }catch(e){}
        try{
            document.querySelector("#header > div.content-box-0").style.display="none";
            document.querySelector("body > section").style="";
        }catch(e){}
        try{
            document.querySelector("body > section > div.content-w > div:nth-child(3)").style.display="none";
        }catch(e){}
        try{
            document.querySelector("body > section > div.content-w > div:nth-child(3)").style.display="none";
        }catch(e){}
        try{
            downAudio.childNodes[0].innerHTML = '<i class="down-icon"></i>下载音频'
        }catch(e){}
        try{
            downCCMZ.childNodes[0].innerHTML = '<i class="down-icon"></i>解析MIDI'
        }catch(e){}
        try{
            H5PrintBtn.innerHTML = '<span>解析MIDI</span>';
        }catch(e){}
        try{
            document.querySelector(".score_details_h5_box > div.s_d_h_b_item2").style.display="none";
        }catch(e){}
        try{
            document.querySelector("#footer").style.display="none";
        }catch(e){}
        try{
            document.querySelector(".score_details_h5_box > div.s_d_h_b_item3 > div.more-box1").style.display="none";
        }catch(e){}
        try{
            document.querySelector("#ai-score-h5").scrolling="yes";
        }catch(e){}
        try{
            document.querySelector("#play_botton_ai").style.display="none";
        }catch(e){}
        // 去除虫虫钢琴手机版死皮赖脸的下载app
        unsafeWindow.loadInstall = function() {
            console.log('loadInstall() 被调用，已阻止安装检测');
            return false;
        };
    }, 1000);
    btn1.addEventListener("click",function(){
        const Player = document.querySelector("#ai-score").contentWindow.Player
        let link = setJianpuMode(kj.src,Player.getJianpuMode())
        let gdd = Player.getJianpuMode()
        window.open(link+"&gdd="+gdd);
        event.stopImmediatePropagation();
    },true);
    H5DownBtn.addEventListener("click",function(){
        const Player = document.querySelector("#ai-score").contentWindow.Player
        let link = setJianpuMode(kj.src,Player.getJianpuMode())
        let gdd = Player.getJianpuMode()
        window.open(link+"&gdd="+gdd);
        event.stopImmediatePropagation();
    },true);
    btn2.addEventListener("click",function(){
        const Player = document.querySelector("#ai-score").contentWindow.Player
        let link = setJianpuMode(kj.src,Player.getJianpuMode())
        let gdd = Player.getJianpuMode()
        window.open(link+"&gdd="+gdd);
        event.stopImmediatePropagation();
    },true);
    btn3.addEventListener("click",function(){
        //window.open(kj.src);
        document.getElementById('ai-score').contentWindow.window.print();
        event.stopImmediatePropagation();
    },true);
    downAudio.addEventListener("click",function(){
        const iframe = document.createElement('iframe');
        downAu().then(audioSrc => {
            var audioName = document.querySelector("hgroup > div > h1").innerText
            forceDownload(audioSrc,audioName)
        }).catch(error => {
            console.error("出错了：", error);
        });
        event.stopImmediatePropagation();
    },true);
    function covertMIDI() {
        const url = new URL(document.querySelector("#ai-score").src);
        const ccmzUrl = url.searchParams.get('url');
        const overlay = document.createElement('div');
        overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(2px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: system-ui, -apple-system, sans-serif;
    `;

        const modal = document.createElement('div');
        modal.style.cssText = `
        background: white;
        border-radius: 24px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        max-width: 480px;
        width: 90%;
        margin: 16px;
        overflow: hidden;
    `;

        modal.innerHTML = `
        <div style="padding: 24px;">
            <!-- 标题 -->
            <h3 style="
                font-size: 24px;
                font-weight: 700;
                color: rgb(17, 24, 39);
                margin: 0 0 12px 0;
            ">ccmz链接</h3>

            <!-- 链接文本 -->
            <div style="
                background: rgb(249, 250, 251);
                border: 1px solid rgb(229, 231, 235);
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 24px;
            ">
                <p style="
                    font-size: 14px;
                    color: rgb(75, 85, 99);
                    word-break: break-all;
                    margin: 0;
                    line-height: 1.5;
                ">${ccmzUrl}</p>
            </div>

            <!-- 按钮组 -->
            <div style="
                display: flex;
                gap: 8px;
                margin-bottom: 24px;
            ">
                <button id="copyBtn" style="
                    flex: 1;
                    border: 1px solid rgb(139, 92, 246);
                    color: rgb(139, 92, 246);
                    background: white;
                    padding: 10px 16px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                ">复制链接</button>
                <a id="downloadBtn" href="${ccmzUrl}" download style="
                    flex: 1;
                    border: 1px solid rgb(139, 92, 246);
                    color: rgb(139, 92, 246);
                    background: white;
                    padding: 10px 16px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">下载文件</a>
            </div>

            <!-- 转换选项 -->
            <div style="margin-bottom: 24px;">
                <div id="webConverter" style="
                    padding-bottom: 16px;
                    border-bottom: 1px solid rgb(229, 231, 235);
                    margin-bottom: 16px;
                    cursor: pointer;
                ">
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <div>
                            <p style="
                                font-size: 14px;
                                font-weight: 500;
                                color: rgb(17, 24, 39);
                                margin: 0 0 4px 0;
                            ">使用网页端转换</p>
                            <p style="
                                font-size: 12px;
                                color: rgb(107, 114, 128);
                                margin: 0;
                            ">使用 ccmz2mid 在线转换工具</p>
                        </div>
                        <svg style="
                            width: 20px;
                            height: 20px;
                            color: rgb(156, 163, 175);
                        " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </div>
                </div>

                <div id="thirdpartyConverter" style="
                    padding-bottom: 16px;
                    border-bottom: 1px solid rgb(229, 231, 235);
                    margin-bottom: 16px;
                    cursor: pointer;
                ">
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <div>
                            <p style="
                                font-size: 14px;
                                font-weight: 500;
                                color: rgb(17, 24, 39);
                                margin: 0 0 4px 0;
                            ">使用第三方工具</p>
                            <p style="
                                font-size: 12px;
                                color: rgb(107, 114, 128);
                                margin: 0;
                            ">使用 bszapp 的 ccmz 解析工具</p>
                        </div>
                        <svg style="
                            width: 20px;
                            height: 20px;
                            color: rgb(156, 163, 175);
                        " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </div>
                </div>

                <div id="localConverter" style="
                    padding-bottom: 0;
                    cursor: pointer;
                ">
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <div>
                            <p style="
                                font-size: 14px;
                                font-weight: 500;
                                color: rgb(17, 24, 39);
                                margin: 0 0 4px 0;
                            ">使用本地程序</p>
                            <p style="
                                font-size: 12px;
                                color: rgb(107, 114, 128);
                                margin: 0;
                            ">使用 ccmz2mid 程序进行本地转换</p>
                        </div>
                        <svg style="
                            width: 20px;
                            height: 20px;
                            color: rgb(156, 163, 175);
                        " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <!-- 完成按钮 -->
            <div style="
                display: flex;
                justify-content: flex-end;
            ">
                <button id="closeBtn" style="
                    color: rgb(139, 92, 246);
                    font-weight: 500;
                    font-size: 14px;
                    background: none;
                    border: none;
                    padding: 8px 16px;
                    cursor: pointer;
                ">完成</button>
            </div>
        </div>
    `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 复制功能
        document.getElementById('copyBtn').addEventListener('click', () => {
            navigator.clipboard.writeText(ccmzUrl).then(() => {
                const btn = document.getElementById('copyBtn');
                btn.textContent = '已复制！';
                btn.style.color = 'rgb(34, 197, 94)';
                btn.style.borderColor = 'rgb(34, 197, 94)';

                setTimeout(() => {
                    btn.textContent = '复制链接';
                    btn.style.color = 'rgb(139, 92, 246)';
                    btn.style.borderColor = 'rgb(139, 92, 246)';
                }, 2000);
            });
        });

        // 转换选项点击事件
        document.getElementById('webConverter').addEventListener('click', () => {
            window.open(`https://testernan.github.io/ccmz2mid/?ccmz=${ccmzUrl}`, '_blank');
        });

        document.getElementById('thirdpartyConverter').addEventListener('click', async function() {
            const converterUrl = "https://bszapp.github.io/ccmz-to-midi/";

            if (!ccmzUrl || typeof ccmzUrl !== 'string') {
                alert("未找到有效的CCMZ文件URL");
                return;
            }

            try {
                let filename = "";
                try {
                    const urlPathname = new URL(ccmzUrl).pathname.split('/').pop();
                    if (urlPathname) {
                        filename = decodeURIComponent(urlPathname);
                    }
                } catch (e) {
                    console.log("无法从URL解析文件名");
                }

                const response = await fetch(ccmzUrl, {
                    referrerPolicy: 'no-referrer',
                    mode: 'cors',
                    credentials: 'omit'
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const cd = response.headers.get('content-disposition');
                if (cd) {
                    const m = cd.match(/filename\*=UTF-8''([^;]+)/i) ||
                          cd.match(/filename="?([^";]+)"?/i);
                    if (m) {
                        filename = decodeURIComponent(m[1]);
                    }
                }

                if (!filename) {
                    filename = 'download.bin';
                }

                const contentLength = parseInt(response.headers.get('content-length'), 10) || 0;
                const reader = response.body.getReader();
                const converterWindow = window.open(converterUrl, '_blank');

                if (!converterWindow) {
                    alert("请允许弹出窗口以使用转换功能");
                    return;
                }

                let messageHandler;
                const timeoutId = setTimeout(() => {
                    if (messageHandler) {
                        window.removeEventListener('message', messageHandler);
                    }
                    console.log("等待READY消息超时");
                }, 5000);

                messageHandler = async function(e) {
                    if (e.data === 'READY') {
                        clearTimeout(timeoutId);
                        window.removeEventListener('message', messageHandler);

                        while (true) {
                            const { done, value } = await reader.read();

                            if (done) {
                                converterWindow.postMessage({
                                    action: 'DONE',
                                    filename: filename
                                }, '*');
                                break;
                            }

                            converterWindow.postMessage({
                                action: 'CHUNK',
                                chunk: value,
                                total: contentLength
                            }, '*', [value.buffer]);
                        }
                    }
                };

                window.addEventListener('message', messageHandler);

            } catch (error) {
                console.error("转换失败:", error);
                window.open(converterUrl);
            }
        });

        document.getElementById('localConverter').addEventListener('click', () => {
            window.open('https://github.com/TesterNaN/ccmz2mid', '_blank');
        });

        // 关闭功能
        document.getElementById('closeBtn').addEventListener('click', () => {
            overlay.remove();
        });

        // 点击背景关闭
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }
    downCCMZ.addEventListener("click",function(){
        covertMIDI();
        event.stopImmediatePropagation();
    },true);
    H5PrintBtn.addEventListener("click",function(){
        covertMIDI();
        event.stopImmediatePropagation();
    },true);
    H5ToJp.addEventListener("click",function(){
        const Player = document.querySelector("#ai-score-H5").contentWindow.Player
        if(Player.getJianpuMode()==0){
            Player.setJianpuMode(1)
        }else{
            Player.setJianpuMode(0)
        }
    },true);
    try{
        tojp.addEventListener("click",function(){
            //卡顿一下是正常的
            const Player = document.querySelector("#ai-score").contentWindow.Player
            if(Player.getJianpuMode()==0){
                tojp.src = wxp_icon
                Player.setJianpuMode(1)
            }else{
                tojp.src = jp_icon
                Player.setJianpuMode(0)
            }

            //沟槽的虫虫钢琴给/jianpu/做了跳转
            //所以旧的简铺切换不能用了
            //目前已经定位造成跳转的脚本是jpu_detail.js
            //位于该脚本的第2124行
            //if (!info.play_json) {
	    	//    var tmp_url = window.location.href;
	    	//	  tmp_url = tmp_url.replace('jianpu', 'cchtml');
	    	//	  window.location.href = tmp_url;
	    	//	  return;
	    	//}
            //我搞了一下午都没能成功用油猴篡改掉这个函数
            //望有识之士能助我一臂之力，打败这个可恶的函数

            //2026年1月10补充：
            //我另外写了一个插件，现在能够屏蔽跳转了，但是由于脚本启动时机不同，没法将两段代码放在同个脚本
            //如果想要原版/jianpu/的话，大抵需要自己安装

            //原本代码：
            //var str = window.location.pathname;
            //if(str.includes("/jianpu/")){
            //    window.open("https://www.gangqinpu.com/cchtml"+str.substring(7));
            //}else{
            //    window.open("https://www.gangqinpu.com/jianpu"+str.substring(7));
            //}

            event.stopImmediatePropagation();
        },true);
    }catch(e){};
    console.log("破解全屏和下载完毕");
    return 0;
}

(function() {
    'use strict';
    var str = window.location.pathname;
    if(str.includes("/jianpu/") || str.includes("/cchtml/")){
	    CrackMain();
    }else{
        !document.referrer&&(location.href+="");
        setTimeout(function(){
            try{
                const url = new URL(window.location.href);
                const gdd = url.searchParams.get('gdd');
                console.log("固定调模式："+gdd)
                if(gdd == "2"){
                    console.log("切换到固定调")
                    try{unsafeWindow.Player.setJianpuMode(2)}catch(e){console.log(e)}
                }
            }catch(e){}
            document.querySelector("#page_0 > g.qrcode.print").style.visibility="hidden";
            document.querySelector("#page_0 > g:nth-child(1) > image").style.visibility="hidden";
            document.querySelector("#page_0 > g.footer > text.print").style.visibility="hidden";
            for(var i=1;i<=document.querySelector("#svg").children.length-3;i++){
                document.querySelector("#page_"+i+" > g.print > image").style.visibility="hidden";
                document.querySelector("#page_"+i+" > g.footer > text.print").style.visibility="hidden";
            }
            console.log("去除水印完毕");
        }, 3000);

    }
})();
// ==UserScript==
// @name         云展网下载PDF
// @namespace    http://tampermonkey.net/yunzhanpDF
// @version      1.21
// @description  云展网下载高清PDF！支持多种模式！
// @author       ZouYS
// @match        https://*.yunzhan365.com/*
// @icon         https://book.yunzhan365.com/web/images/nav_logo_big.jpg
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require      https://fastly.jsdelivr.net/npm/sweetalert2@11
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @require      https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js
// @grant        GM_addStyle
// @grant        GM_addElement
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/509505/%E4%BA%91%E5%B1%95%E7%BD%91%E4%B8%8B%E8%BD%BDPDF.user.js
// @updateURL https://update.greasyfork.org/scripts/509505/%E4%BA%91%E5%B1%95%E7%BD%91%E4%B8%8B%E8%BD%BDPDF.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.onload = function () {
        /*if(!window.htmlConfig){
            console.error('error!')
            return 1;
        }*/
        /*const zip = new JSZip();
        if (!zip) {
            console.error('error loading zip！')
            return
        }*/
        let css = `.mydiv1{
            position: absolute;
            z-index: 9999999999;
            left: 100px;
            top: 300px;
            display: none;
        }
        .mybtn1 {
            z-index: 9999999999;
            position: absolute;
            top: 300px;
            font-size: inherit;
            font-family: inherit;
            color: white;
            padding: 0.5em 1em;
            outline: none;
            border: none;
            background-color: hsl(236, 32%, 26%);
            overflow: hidden;
            transition: color 0.4s ease-in-out;
        }
        .mybtn2 {
            z-index: 9999999999;
            position: absolute;
            top: 350px;
            font-size: inherit;
            font-family: inherit;
            color: white;
            padding: 0.5em 1em;
            outline: none;
            border: none;
            background-color: hsl(236, 32%, 26%);
            overflow: hidden;
            transition: color 0.4s ease-in-out;
        }

        .mybtn2::before,.mybtn1::before {
            content: '';
            z-index: -1;
            position: absolute;
            top: 100%;
            right: 100%;
            width: 1em;
            height: 1em;
            border-radius: 50%;
            background-color: #3cefff;
            transform-origin: center;
            transform: translate3d(50%, -50%, 0) scale3d(0, 0, 0);
            transition: transform 0.45s ease-in-out;
        }

        .mybtn2:hover,.mybtn1:hover {
            cursor: pointer;
            color: #161616;
        }

        .mybtn2:hover::before,.mybtn1:hover::before {
            transform: translate3d(50%, -50%, 0) scale3d(15, 15, 15);
        }`;
        GM_addStyle(css);
        const rules=new Map()
        const rulesClass=['cover_shadow side','flip-shadowB','flip-topshadow','HandPainted','midShadow','grayShadow','ViewModule','leftShadow book','rightShadow book','cover_shadow side flip_x']
        rulesClass.forEach(item=>{
            rules.set(item,true)
        })
        const button = document.createElement('button')
        button.classList.add('mybtn1')
        button.innerText = '高清下载PDF'
        document.body.append(button)
        button.onclick = () => {
            // console.log(unsafeWindow)
            try {
                let newUrl = document.getElementsByTagName('iframe')[0] && document.getElementsByTagName('iframe')[0].src
                if (newUrl) {
                    unsafeWindow.location.href = newUrl
                }
                if (Swal) {
                    Swal.fire({
                        position: 'top-end', //定位 左上角
                        icon: 'success',
                        title: '↑↑↑下载中，请留意浏览器右上角↑↑↑弹窗~',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
                let meta = unsafeWindow.htmlConfig || console.error('no meta data!')
                let imgUrls = meta.fliphtml5_pages
                let basicUrl = meta.meta.url
                basicUrl = basicUrl.slice(0, basicUrl.lastIndexOf('/') + 1)

                addImageToPDF(meta, imgUrls, basicUrl).then(pdf => {
                    pdf.save(`${meta.meta.title}.pdf`);
                });
            } catch (e) {
                if (Swal) {
                    Swal.fire({
                        position: 'center', //定位 左上角
                        icon: 'error',
                        title: `下载失败，请尝试兼容模式！~错误信息：${e}`,
                        // showConfirmButton: false,
                        // timer: 1500
                    })
                }
                console.error(e)
            }
        }
        const button_01 = document.createElement('button')
        button_01.classList.add('mybtn2')
        button_01.innerText = '下载-兼容模式'
        document.body.append(button_01)
        button_01.onclick = async () => {
            if(button_01.innerText==='下载中...'){
                return
            }
            const start = new Date();
            try {
                button_01.innerText='下载中...'
                let oriPDF = unsafeWindow['pdfjs-dist/build/pdf']

                let htmlConfig = unsafeWindow.htmlConfig || console.error('no meta data!')
                let fliphtml5_pages = htmlConfig.fliphtml5_pages || ''
                let meta = htmlConfig.meta;
                let pos = 0
                const pageCount = meta.pageCount;
                let pdf;
                //zip
                for (let i = 0; i < fliphtml5_pages.length; i++) {
                    if (fliphtml5_pages[i].n[0] && fliphtml5_pages[i].n[0].includes("zip")) {
                        //zip的情况
                        pos = 1
                    }
                }
                // console.log('fliphtml5_pages:',fliphtml5_pages)
                console.log('pos:', pos)
                //处理各种情况
                switch (pos) {
                    /**
                     * 情況一:html拼接
                     * 图片分解后写入为html拼接
                     */
                    case 0:
                        let scale=parseInt(prompt('case 0:html拼接，选择像素倍数(渲染高像素耗时较长，基数为页面展示的长宽，倍数默认5倍时，平均每页大约60s)','5'))
                        for (let i = 0; i < pageCount; i++) {
                            let page;
                            do{
                                page = document.getElementById(`page${i + 1}`)
                                if(!page){
                                    unsafeWindow.nextPageFun("flip shot bar");
                                    await sleep(3000);
                                    unsafeWindow.nextPageFun("flip shot bar");
                                    await sleep(3000);
                                }
                            }while (!page)
                            // 记录开始时间
                            const startTime = new Date();
                            // page = page.childNodes[0].childNodes[1]
                            console.log(`---------------------------------------------------------------------------------`)
                            console.log(`page${i + 1}: `, page)
                            const width = page.style.width;
                            const height = page.style.height;
                            if (page) {
                                const dom = page
                                //图片加像素
                                const startTimeDiv = new Date();
                                await replaceBackgroundImage(dom);
                                console.log(`page${i+1}:loop div using ${((new Date()-startTimeDiv)/1000).toFixed(2)}s`)
                                // 解决转换出来的图片的清晰度问题
                                // 手动创建一个 canvas 标签
                                let root = document.documentElement
                                root.style.overflow = 'auto'
                                const canvas = document.createElement('canvas')
                                // 获取父级的宽高
                                const width = parseInt(window.getComputedStyle(dom).width)
                                const height = parseInt(window.getComputedStyle(dom).height)
                                // 定义放大倍数，可支持小数
                                canvas.width = width * scale
                                canvas.height = height * scale
                                canvas.style.width = width + 'px'
                                canvas.style.height = height + 'px'

                                // 拿到目标dom调用一下html2canvas方法就能生成canvas对象了
                                // 获取要转换的元素
                                await html2canvas(dom, {
                                    canvas: canvas,
                                    scale: scale,
                                    dpi:96*2,
                                    useCORS: true,// 开启跨域设置，需要后台设置cors
                                    ignoreElements: (element) => {
                                        // console.log(element)
                                        if(rules.has(element.className)){
                                            return true;
                                        }
                                        /*if(element.tagName==='DIV' &&element.getAttribute('style')&& element.getAttribute('style').includes('background-image: url("blob:https://www.gaoding.com/')){
                                            return true;
                                        }*/
                                    }
                                }).then((canvas) => {
                                    if (!pdf) {
                                        pdf = new jspdf.jsPDF({
                                            orientation: canvas.width / canvas.height > 1 ? 'l' : 'p',
                                            unit: 'px',
                                            format: [canvas.width, canvas.height],
                                            compressPdf: true
                                        });
                                    }
                                    if (i !== 0) {
                                        pdf.addPage({
                                            format: [canvas.width, canvas.height],
                                        });
                                    }
                                    let dataURL = canvas.toDataURL('image/png')
                                    // 计算居中位置
                                    const x = 0;
                                    const y = 0;
                                    // 确保坐标和尺寸有效
                                    pdf.addImage(dataURL, 'PNG', x, y, canvas.width, canvas.height);
                                    console.log(`page ${i + 1}: loaded in ${((new Date()-startTime)/1000).toFixed(2)}s`)
                                    console.log(`---------------------------------------------------------------------------------`)
                                })
                            }

                        }
                        pdf.save(`${meta.title}.pdf`);
                        break
                    /**
                     * 情況二:zip的pdf文件
                     * 图片为PDF单页文件
                     */
                    case 1:
                        //https://book.yunzhan365.com/eurha/wafe/files/content-page/04f0837c365de291805215b7b97a5bdf.zip
                        let baseUrl = meta.url && meta.url.slice(0, meta.url.lastIndexOf('/') + 1) + 'files/content-page/'

                        for (let i = 0; i < fliphtml5_pages.length; i++) {
                            if (fliphtml5_pages[i].n[0] && fliphtml5_pages[i].n[0].includes("zip")) {
                                let url = `${baseUrl}${fliphtml5_pages[i].n[0]}`
                                console.log('url:', url)

                                let blobRes =await getBlob(url)
                                console.log('blobRes:', blobRes)
                                this.loadingTask = oriPDF.getDocument({url: blobRes.url, password: blobRes.password});
                                const l = await this.loadingTask.promise;
                                const page = await l.getPage(1);
                                console.log(`Page ${i} loaded`);

                                const scale = 2; // 缩放比例
                                const viewport = page.getViewport({scale});

                                if (!pdf) {
                                    pdf = new jspdf.jsPDF({
                                        orientation: viewport.width / viewport.height > 1 ? 'l' : 'p',
                                        unit: 'px',
                                        format: [viewport.width, viewport.height],
                                    });
                                }

                                if (i !== 0) {
                                    pdf.addPage({
                                        format: [viewport.width, viewport.height],
                                    });
                                }

                                // 创建用于渲染的 canvas
                                const canvas = document.createElement('canvas');
                                const context = canvas.getContext('2d');
                                canvas.height = viewport.height;
                                canvas.width = viewport.width;

                                // 渲染 PDF 页面到 canvas
                                const renderContext = {
                                    canvasContext: context,
                                    viewport: viewport,
                                };
                                await page.render(renderContext).promise;

                                // 获取图像数据
                                const imgData = canvas.toDataURL('image/png');

                                // 将图像数据添加到 jsPDF 中
                                pdf.addImage(imgData, 'PNG', 0, 0, viewport.width, viewport.height);
                                canvas.remove();

                            }
                        }
                        pdf.save(`${meta.title}.pdf`);

                        break
                    default:

                }
                button_01.innerText = '下载-兼容模式'
                console.log('下载成功！')
                if (Swal) {
                    Swal.fire({
                        position: 'center', //定位 左上角
                        icon: 'success',
                        title: `下载成功！~用时：${((new Date()-start)/1000).toFixed(2)}s`,
                        // showConfirmButton: false,
                        // timer: 3000
                    })
                }
            } catch (e) {
                if (Swal) {
                    Swal.fire({
                        position: 'center', //定位 左上角
                        icon: 'error',
                        title: `下载失败，请刷新重试！~${e}`,
                        // showConfirmButton: false,
                        // timer: 1500
                    })
                }
                button_01.innerText = '下载-兼容模式'
                console.error(e)
            }
        }

        // 定义一个递归函数来遍历所有 div
        async function replaceBackgroundImage(div) {
            // 获取当前 div 的背景图像样式
            const style = div.style.backgroundImage;

            // 检查是否包含 background-image
            if (style) {
                // 提取 URL 部分
                const urlMatch = style.match(/url\(["']?(.*?)["']?\)/);
                if (urlMatch) {
                    let url = urlMatch[1];

                    /**
                     * 解决 图片模糊
                     * 生成img标签
                     */
                    await new Promise(resolve => {
                        const imgElement = document.createElement('img');

                        // 替换掉查询字符串部分
                        url = url.split('?')[0]; // 删除 '?' 及其后面内容
                        // 更新背景图像的样式
                        div.style.backgroundImage = ``;
                        Array.from(div.attributes).forEach(attr => {
                            imgElement.setAttribute(attr.name, attr.value);
                        });
                        imgElement.src = url;
                        imgElement.onload=()=>{
                            div.parentNode.replaceChild(imgElement, div);
                            console.log(`img replaced url:${url}`)
                            resolve();
                        }
                    });
                }
            }

            // 遍历当前 div 的所有子元素
            const children = div.children;
            for (let i = 0; i < children.length; i++) {
                if (rules.has(children[i].className)) {
                    console.log(`${children[i].className} has been remove! `);
                    children[i].remove()
                    break
                }
                await replaceBackgroundImage(children[i]); // 递归调用
            }
        }

        /**
         * 解密PDF文件，返回密码和文件url
         * @param b
         * @returns {*}
         */
        function getBlob(b) {
            return new Promise(function (c, d) {
                d = new XMLHttpRequest;
                d.open("get", b, !0);
                d.responseType = "blob";
                d.onload = function () {
                    if (4 == this.readyState && 200 == this.status) {
                        (new Date).getTime();
                        window.response = this.response;
                        let e = new FileReader;
                        e.onload = function () {
                            window.arrayBuffer = new Uint8Array(this.result)
                        };
                        e.readAsArrayBuffer(response);
                        let f = response.slice(1083, response.size - 1003, "application/pdf"), g = "",
                            h = response.slice(1080, 1083),
                            k = response.slice(response.size - 1003, response.size - 1E3);
                        e = new FileReader;
                        e.onload = function () {
                            g = this.result + g;
                            let l = new FileReader;
                            l.onload = function () {
                                g += this.result;
                                var n = f.slice(0, 4E3), p = new FileReader;
                                p.onload = function () {
                                    var v = new Uint8Array(this.result);
                                    for (let i = 0; i < this.result.byteLength; ++i) v[i] = 255 - v[i];
                                    v = new Blob([new Blob([v.buffer]), f.slice(4E3, f.size)], {type: "application/pdf"});
                                    v = window.URL.createObjectURL(v);
                                    c({url: v, password: g})
                                };
                                p.readAsArrayBuffer(n)
                            };
                            l.readAsText(k)
                        };
                        e.readAsText(h)
                    }
                };
                d.send()
            }.bind(this))
        }

        async function addImageToPDF(meta, imageUrls, basicUrl) {
            let pdf;
            for (let i = 0; i < imageUrls.length; i++) {
                try {
                    let url = imageUrls[i].n[0].split('?')[0]
                    url += `?x-oss-process=image/sharpen,100`
                    if (url.includes('files/large/')) {
                        url = url.replace('../', '')
                    } else {
                        url = 'files/large/' + url
                    }
                    url = basicUrl + url;
                    console.log(`第${i + 1}页  url:`, url)
                    const img = await loadImage(url);
                    const imgWidth = img.width;
                    const imgHeight = img.height;
                    if (!pdf) {
                        pdf = new jspdf.jsPDF({
                            orientation: imgWidth / imgHeight > 1 ? 'l' : 'p',
                            unit: 'px',
                            format: [imgWidth, imgHeight],
                            compress: true
                        });
                    }
                    if (i !== 0) {
                        pdf.addPage({
                            format: [imgWidth, imgHeight],
                        });
                    }
                    /*const pageWidth = pdf.internal.pageSize.width;
                    const pageHeight = pdf.internal.pageSize.height;

                    // 计算缩放比例
                    const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
                    const newWidth = imgWidth * ratio;
                    const newHeight = imgHeight * ratio;*/

                    // 计算居中位置
                    const x = 0;
                    const y = 0;
                    // 确保坐标和尺寸有效
                    pdf.addImage(img, 'WEBP', x, y, imgWidth, imgHeight);
                    /*if (newWidth > 0 && newHeight > 0 && x >= 0 && y >= 0) {
                        pdf.addImage(img, 'WEBP', x, y, newWidth, newHeight);
                    } else {
                        console.error('Invalid dimensions or coordinates:', { newWidth, newHeight, x, y });
                    }*/
                    /*if(i!==imageUrls.length-1){
                        pdf.addPage()
                    }*/
                    if (Swal && i > 10) {
                        Swal.fire({
                            position: 'top-end', //定位 左上角
                            icon: 'success',
                            title: `加载中，第${i + 1}页`,
                            showConfirmButton: false,
                        })
                    }
                } catch (e) {
                    if (Swal) {
                        Swal.fire({
                            icon: 'error',
                            title: `下载失败，${e.message}`,
                            showConfirmButton: true,
                        })
                    }
                }

            }
            return pdf;
        }

        function loadImage(url) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'anonymous'; // 处理跨域问题
                img.src = url;
                img.onload = () => {
                    /*const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);*/
                    // resolve(canvas.toDataURL('image/webp'));
                    resolve(img);
                };
                img.onerror = reject;
            });
        }
        function sleep(ms){
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }
    // Your code here...
})();
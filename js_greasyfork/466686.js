// ==UserScript==
// @name         文泉图书下载
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  保存文泉学堂的图书到一个压缩包中
// @author       kbtx
// @run-at       document-start
// @match        https://*.wqxuetang.com/deep/read/pdf?bid=*
// @match        http://*.wqxuetang.com/deep/read/pdf?bid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wqxuetang.com
// @require https://cdn.bootcdn.net/ajax/libs/jszip/3.7.1/jszip.min.js
// @require https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466686/%E6%96%87%E6%B3%89%E5%9B%BE%E4%B9%A6%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/466686/%E6%96%87%E6%B3%89%E5%9B%BE%E4%B9%A6%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx._drawImage = ctx.drawImage;
    let button = document.createElement('button');

    window.onload = function(){
        button.textContent = '正在初始化...';
        // 设置按钮的样式
        button.style.position = 'fixed';
        button.style.bottom = '150px';
        button.style.right = '50px';
        document.body.appendChild(button);
    }

    setTimeout( function() {
        // 在网页加载完毕后执行的代码
        // ...
        const divs = document.querySelectorAll("div.page-lmg");
        const zip = new JSZip();
        // 每页的图片数，在第一次循环时取得正确值
        let img_per_page = 0;

        // 最大缓存数，达到数量后，调用下载功能并刷新页面
        const max_cache = 50;

        let mergedWidth = 0;
        let mergedHeight = 0;
        // 当前页数要与UI上的数值同步，刷新生效，方便控制，UI上的数值正好是下一页的索引，所以这里要 -1
        let page = parseInt(document.querySelector("#app > div.page > div.read-header > div > div.read-header-left > div > div").innerText.split('/')[0]);
        let currentIndex =  page - page%max_cache - 1;

        const loadImage = img => {
            return new Promise(resolve => {
                resolve(img);
            });
        };
        button.textContent = '立即导出已有内容';
        function downloadZip(btn,refresh){
            zip.generateAsync({ type: 'blob' })
                .then(blob => {
                const timestamp = new Date().getTime();
                const filename = `images_${timestamp}.zip`;

                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                link.click();
                if(btn){
                    btn.disabled = false;
                }
                if(refresh){
                    setTimeout( ()=>{
                        location.reload()
                    }, 5000 )
                }
            })
        }
        function downloadZipWrapper(refresh){
            button.disabled = true;
            downloadZip(button, refresh);
        }

        button.addEventListener('click', downloadZipWrapper);
        window.downloadZip = downloadZip;

        function getRandomInterval(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
        function padIndex(index, length) {
            return index.toString().padStart(length, '0');
        }


        let pageSwitcher = setInterval(() => {
            if(currentIndex < divs.length){
                const curent_page = divs[currentIndex++];
                // 滚动到当前位置，让图片加载
                curent_page.scrollIntoView();
                // 设置一个超时时间，避免内容为空
                setTimeout( ()=>{
                    const images = curent_page.querySelectorAll("img");
                    if(images.length !== img_per_page){
                        if(images.lenngth < img_per_page){
                            currentIndex--;
                        }else{
                            img_per_page = images.length;
                        }
                    }
                    let imagePromises = [];
                    Array.from(images).forEach(image => {
                        // const src = image.src;
                        const left = parseFloat(image.style.left);
                        // 高度不用求和，所以可以拿来当条件判断宽高是否完成初始化，由于每页的宽高是相同的，所以只用求一次就行了
                        if(mergedHeight === 0){
                            mergedWidth += image.naturalWidth
                        }
                        imagePromises.push(loadImage(image).then(img => {
                            // 这边偷个懒，把index多写几次
                            return { img: img, left: left , index: currentIndex};
                        }));
                    });
                    mergedHeight = images[0].naturalHeight
                    console.log(imagePromises)
                    Promise.all(imagePromises).then(images => {
                        canvas.width = mergedWidth;
                        canvas.height = mergedHeight;
                        images.sort((a, b) => a.left - b.left);
                        let delta = 0;
                        images.forEach(image => {
                            ctx._drawImage(image.img, delta, 0);
                            delta += image.img.naturalWidth
                        });
                        // const dataURL = canvas.toDataURL();
                        // console.log(dataURL); // 可以将该 base64 数据用于保存或显示等操作
                        const filename = padIndex(images[0].index, 4) + '.jpg';
                        canvas.toBlob(blob => {
                            zip.file(filename, blob, { binary: true });
                            if(currentIndex%max_cache===0 || currentIndex >= divs.length ){
                                downloadZipWrapper(currentIndex%max_cache===0);
                            }else{
                                console.log(Object.keys(zip.files).length, "of", divs.length, "files are stored in zip")
                            }
                        }, 'image/jpeg', 0.8);
                    });
                } , 7000 )
            }else{
                clearInterval(pageSwitcher);
            }
        }, getRandomInterval(8000, 12000));
    }, 5000);

})();
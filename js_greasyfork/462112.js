// ==UserScript==
// @name         知乎图书下载
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  下载知乎中的图书。 输入 window.chapters 即可监视目前已经获章节的获取情况，输入 window.packZip() 即可得到当前已经下载的内容，目前脚本有一定概率获取不到某些页面的内容，在书籍被遍历完毕前直接从目录树点回去重试即可，后续会实现让脚本自动回退并重试
// @license MIT
// @author       kbtx
// @match        https://www.zhihu.com/pub/reader/*/chapter/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @require https://cdn.bootcdn.net/ajax/libs/jszip/3.7.1/jszip.min.js
// @require https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js

// @downloadURL https://update.greasyfork.org/scripts/462112/%E7%9F%A5%E4%B9%8E%E5%9B%BE%E4%B9%A6%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/462112/%E7%9F%A5%E4%B9%8E%E5%9B%BE%E4%B9%A6%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function replaceIllegalPathChars(path) {
        // Windows 下的非法路径字符
        const illegalChars = /[<>:"\/\\|?*]/g;
        // 替换为空格
        const replacement = ' ';
        // 返回替换后的字符串
        return path.replace(illegalChars, replacement);
    }

    function packZip() {
        const zip = new JSZip();
        window.chapters.forEach( (item, index)=>{
            let fileName = (index+1).toString().padStart(3, "0") + "_" + item[0] + ".html"
            let fileContent = item[2]?.replaceAll(".webp",".jpg").replaceAll("data-src","src").replaceAll("加载中...", "")
            zip.file(replaceIllegalPathChars(fileName),fileContent?fileContent:"");
        } )

        zip.generateAsync({ type: 'blob' }).then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = document.title.substring(document.title.indexOf('-') + 1, document.title.lastIndexOf('-') ).trim() + ".zip";
            link.click();
        });
        button.textContent = '下载图书';
        button.disabled = false
    }

    // 翻到第一页
    async function backToFirstPage() {
        let currentNode = null;
        while(!currentNode || !currentNode.firstElementChild || !currentNode.firstElementChild.firstElementChild){
            currentNode = document.querySelector('.MPub-reader-chapter');
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        currentNode.firstElementChild.firstElementChild.click()
    }

    // 翻到下一页，返回值表示是否可以继续翻页
    function nextPage(){
        //debugger;
        let btn = document.querySelector("#button-next-chapter").firstElementChild
        btn.click()
    }
    function hasNextPage(){
        let btn = document.querySelector("#button-next-chapter").firstElementChild
        return !btn.classList.contains("disabled")
    }

    async function getContent() {
        let contentNode = null;
        while (!contentNode) {
            contentNode = document.querySelector('.reader-chapter-content').getElementsByTagName('section')[0];
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        // 获取到节点后再额外等待200ms，防止出现意外情况
        // await new Promise(resolve => setTimeout(resolve, 200));
        return contentNode.innerHTML;
    }

    function savePages(){
        let saveReq = setInterval( ()=>{
            let chapter_uid = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1)
            if(window.chapters[window.chapters.length - 1][2] && !hasNextPage()) {
                clearInterval(saveReq);
                packZip()
            }
            getContent().then( (content)=>{
                //console.log(content)
                window.chapters.forEach( (item, index) => {
                    if (item[1] === chapter_uid){
                        item[2] = content;
                    }
                })
                nextPage()
            })
        },1000)
        }

    function downloadThread(){
        // get book id from url
        const urlRegex = /\/reader\/(\d+)\/chapter/;
        const match = window.location.href.match(urlRegex);
        const bookId = match ? match[1] : null;
        window.packZip = packZip
        if (!bookId) {
            console.log('Failed to get book id from url.');
            return;
        }

        // get chapter list from API
        const chapterUrl = `https://www.zhihu.com/api/v3/books/${bookId}/chapters`;
        if(!window.chapters){
            fetch(chapterUrl)
                .then(response => response.json())
                .then(data => {
                console.log('读取到章节信息：', data);
                let chapters = []
                // 提升为全局变量，方便其他函数操作
                window.chapters = chapters;
                data.updated.forEach( (item, index) =>{
                    chapters.push([item.title, item.chapter_uid, null])
                } )
                // 翻到第一页
                backToFirstPage().then((e)=>{console.log(chapters); savePages()}).catch(error => console.error(error))
                //savePages()

            })
                .catch(error => console.error('Failed to fetch chapter list:', error));
        }else{
            // 全局变量中存在记录，说明不是第一次点击下载，直接从当前位置开始
            savePages()
        }
    }

    const button = document.createElement('button');
    button.style.position = 'fixed';
    button.style.bottom = '100px';
    button.style.right = '100px';
    button.textContent = '下载图书';
    button.title = "提示：如果得到的zip有部分空白文件，可以通过目录树定位到空白处并再次点击本按钮以修补"
    document.body.appendChild(button);
    // 给按钮添加点击事件
    button.addEventListener('click', function() {
        // 自执行函数
        button.textContent = '正在处理...'
        button.disabled = true
        downloadThread();
    });

})();
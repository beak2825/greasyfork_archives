// ==UserScript==
// @name         知乎专栏导出
// @namespace    http://tampermonkey.net/
// @version      0.5
// @license MIT
// @description  导出知乎的专栏到一个压缩包中，需要有阅读权限
// @author       kbtx
// @match        https://www.zhihu.com/xen/market/remix/paid_column/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @require https://cdn.bootcdn.net/ajax/libs/jszip/3.7.1/jszip.min.js
// @require https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/462118/%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/462118/%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

/*
    在windows中使用如下脚本可以将子目录中的html文件转为epub，注意需要先安装pandoc
    // compile.bat
    @echo off

    REM 获取当前目录的路径
    set "BASE_DIR=%cd%"

    REM 遍历当前目录下的所有子文件夹
    for /d %%D in (*) do (
        REM 进入子文件夹
        cd "%%D"
        REM 合并所有 HTML 文件为一个文件
        copy /b *.html "%%D.html"
        REM 调用 pandoc 转换为 EPUB
        pandoc "%%D.html" -o "%%D.epub"  --metadata title="%%D"
        REM 返回上级目录
        cd "%BASE_DIR%"
    )
    */
(function() {
    'use strict';
    function fetchChapterUrl(){
        const catalogDiv = document.querySelector("[class^='CatalogModule-title']");
        const catalogChildren = catalogDiv.parentNode.children[2].children;
        let tmp = "";
        let result = []
        for (let i = 0; i < catalogChildren.length; i++) {
            const child = catalogChildren[i];
            if (child.className.startsWith("CatalogModule-chapterCommonTitle")) {
                tmp = child.innerHTML;
            } else if (child.className.startsWith("ChapterItem-root")) {
                const name = tmp + child.getAttribute("data-za-detail-view-path-module_name");
                const extraModule = child.getAttribute('data-za-extra-module');
                const extraData = JSON.parse(extraModule);
                const id = extraData.card.content.id;
                const link = "https://www.zhihu.com/market/paid_column" + window.location.pathname.substring(window.location.pathname.lastIndexOf('/')) + "/section/" + id;
                //console.log(name, link);
                result.push([name,link])
            } else {
                console.log(child.className)
            }
        }
        //console.log(result)
        return result
    }

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
        window.responses.forEach( (item, index)=>{
            let fileName = item[0] + ".html"
            let fileContent = item[1].replaceAll(".webp",".jpg").replaceAll("data-src","src").replaceAll("加载中...", "")
                // 给所有标题降级，防止pandoc编译时目录层级关系错乱
                .replaceAll("<h5>","<h6>").replaceAll("</h5>","</h6>").replaceAll("<h4>","<h5>").replaceAll("</h4>","</h5>")
                .replaceAll("<h3>","<h4>").replaceAll("</h3>","</h4>").replaceAll("<h2>","<h3>").replaceAll("</h2>","</h3>")
                .replaceAll("<h1>","<h2>").replaceAll("</h1>","</h2>")
            zip.file(replaceIllegalPathChars(fileName), "<h1>" + item[0] + "</h1>" + fileContent);
        } )

        zip.generateAsync({ type: 'blob' }).then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = document.title + ".zip";
            link.click();
        });
    }

    function fetchChapterContent(chapters){
        window.responses = []
        const responses = window.responses
        chapters.forEach((item, index)=>{
            let name = (index+1).toString().padStart(2, "0") + "_" + item[0]
            let url = item[1]
            fetch(url)
                .then(response => response.text())
                .then(text => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                const manuscriptNode = doc.getElementById('manuscript');
                // 保存响应结果到对象中
                responses.push([name, manuscriptNode.innerHTML])
            }).catch(error => {
                // 发生错误时，打印错误信息并继续执行下一个URL
                console.error(`Error fetching ${url}: ${error}`);
            });
        })
        let checkPack = setInterval( ()=>{
            if(responses.length == chapters.length){
                clearInterval(checkPack)
                button.textContent = '下载专栏'
                button.disabled = false
                packZip()
            }
        }, 100 )
        }

    // Your code here...
    // 创建悬浮按钮
    const button = document.createElement('button');
    button.style.position = 'fixed';
    button.style.bottom = '50px';
    button.style.right = '10px';
    button.textContent = '下载专栏';
    document.body.appendChild(button);
    window.packZip = packZip;

    // 给按钮添加点击事件
    button.addEventListener('click', function() {
        // 自执行函数
        (function() {
            button.textContent = '正在处理...'
            button.disabled = true
            const allSection = document.querySelector("[class^='CatalogModule-allSection']");
            if (allSection && allSection.innerHTML === '查看更多章节') {
                const timerId = setInterval(() => {
                    // 不断点击按钮，以展开全部章节
                    allSection.click();
                    if (!document.querySelector("[class^='CatalogModule-allSection']")) {
                        clearInterval(timerId);
                        // 获取章节
                        let chapters = fetchChapterUrl();
                        fetchChapterContent(chapters)
                    }}, 1000)
                }else{
                    // 按钮不存在，说明章节已全部展开，直接获取
                    let chapters = fetchChapterUrl();
                    fetchChapterContent(chapters)
                }
        })();
    });
})();
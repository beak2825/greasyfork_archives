// ==UserScript==
// @name         文泉epub下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  下载文泉学堂的epub格式图书，将内容保存在一个压缩包中，后续可以用pandoc处理
// @author       kbtx
// @match        https://*.wqxuetang.com/deep/read/epub?bid=*
// @match        http://*.wqxuetang.com/deep/read/epub?bid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wqxuetang.com
// @require https://cdn.bootcdn.net/ajax/libs/jszip/3.7.1/jszip.min.js
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466684/%E6%96%87%E6%B3%89epub%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/466684/%E6%96%87%E6%B3%89epub%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let button = document.createElement('button');
    button.textContent = '正在初始化...';
    // 设置按钮的样式
    button.style.position = 'fixed';
    button.style.bottom = '150px';
    button.style.right = '50px';
    document.body.appendChild(button);
    // 设置延迟，防止网页未加载导致的问题
    setTimeout( ()=>{
        let btn_prev = document.querySelector("#pagebox > div.read-content-btn-wrapper > a:nth-child(1)")
        let btn_next = document.querySelector("#pagebox > div.read-content-btn-wrapper > a:nth-child(2)")
        let current_page_count = 0;
        let zip = new JSZip();
        // 打包并下载zip
        function packZip(){
            zip.generateAsync({ type: 'blob' }).then(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                // 将文件命名为 "当前书名.zip"
                link.download = document.querySelector("#app > div.page > div.read-header > div > div.read-header-title").innerText + ".zip";
                link.click();
            });
        }
        button.textContent = '立即导出已有内容';
        button.addEventListener('click', packZip);

        let page_switcher = setInterval( ()=>{
            current_page_count++;
            if(btn_next.classList[0] === 'disabled'){
                // 已经到达最后一页，清理定时器
                clearInterval(page_switcher);
                packZip();
            }else{
                // 获取到的页面数据，格式为html
                let page_data = document.querySelector("#iFrame").contentDocument.documentElement.ownerDocument.querySelector("body").innerHTML;
                // 将data-src中的图片地址替换掉src的
                page_data = page_data.replaceAll('data-src', 'data-sss')
                    .replaceAll(/src="([^"]*)"/g, '')
                    .replaceAll('data-sss', 'src');
                // 将数据存入压缩包中
                zip.file(current_page_count.toString().padStart(4, '0')+'.html', page_data)
                // 先获取数据再翻页，可以确保所需数据已经加载
                btn_next.click();
            }
        }, 5000 )
        }, 5000 )

})();
// ==UserScript==
// @name         BoxMap
// @name:de      Box3-pro-Map
// @namespace    https://bcmcreator.cn/
// @version      0.4
// @description  新版GUI
// @description:de  新版GUI
// @author       soul
// @match        https://box3.codemao.cn/*
// @match        https://preprod.box3.codemao.cn/*
// @match        https://dao3.fun/*
// @icon         https://static.box3.codemao.cn/img/QmUX51Fo1NTRP5H4cQa4UMcTCP7ZhyDwLvQsKM2zbStdMJ_520_216_cover.avif
// @grant        none
// @require        https://cdn.jsdelivr.net/npm/lil-gui@0.16
// @require        https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js
// @require        https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @require        https://unpkg.com/mdui@1.0.2/dist/js/mdui.min.js
// @resource       swalStyle https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.css
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/478471/BoxMap.user.js
// @updateURL https://update.greasyfork.org/scripts/478471/BoxMap.meta.js
// ==/UserScript==
'use strict';

(async function main() {

    var main_Map = {
        "原版" : ()=>{
            window.location.href = 'https://box3.codemao.cn/?filter=common';
        },
        "旧版" : ()=>{
            window.location.href = 'https://preprod.box3.codemao.cn/?filter=common';
        },
        "pro版" : ()=>{
            window.location.href = 'https://dao3.fun/?filter=common';
        },
    };

    // 创建 GUI 对象
    window.gui = new lil.GUI({ title: 'Box pro工具箱' });
    window.gui.domElement.style.userSelect = 'none';

    // 创建版本切换的文件夹
    var page = gui.addFolder('版本');
    var currentUrl = window.location.href;
    var storedVersion = localStorage.getItem('boxMap_version');
    if (currentUrl.includes('https://box3.codemao.cn/')) {
        page.add(main_Map, '旧版').name('旧版');
        page.add(main_Map, 'pro版').name('pro版');
    }
    if (currentUrl.includes('https://preprod.box3.codemao.cn/')) {
        page.add(main_Map, '原版').name('原版');
        page.add(main_Map, 'pro版').name('pro版');
    }
    if (currentUrl.includes('https://dao3.fun/')) {
        page.add(main_Map, '原版').name('原版');
        page.add(main_Map, '旧版').name('旧版');
    }
    // 添加快捷键
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'b') {
            var html = ``;
            if (currentUrl.includes('https://box3.codemao.cn/p/')) {
                html += `
<div style="font-size: 1em;font-family:楷体;">
    <h1>Box3 Game 原版配置</h1>
</div>
`;
            }
            Swal.fire({
                title: 'BoxMap puls ++设置',
                icon: 'question',
                html: html,
                showCloseButton: false,
                width: 1400,
                padding: 300,
            }).then((res) => {
                const resolution = localStorage.getItem("resolution"); // Retrieve the stored value from browser's local storage
                window.location.reload();
            });

        }
        if (event.ctrlKey && event.key === 'm') {
            // 当页面加载时，检查是否已经存储了字体选择
            window.onload = function() {
                const savedFont = localStorage.getItem('font');
                if (savedFont) {
                    document.body.style.fontFamily = savedFont; // 应用保存的字体
                }
            }

            Swal.fire({
                title: '字体',
                input: 'select',
                inputOptions: {
                    'Arial': 'Arial',
                    'Courier New': 'Courier New',
                    'Times New Roman': 'Times New Roman',
                    'Verdana': 'Verdana'
                },
                inputPlaceholder: '选择你要的字体',
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    Swal.fire(`你选择的字体是: ${result.value}`);
                    document.body.style.fontFamily = result.value; // 设置页面字体
                    localStorage.setItem('font', result.value); // 保存字体选择到LocalStorage
                    console.log(localStorage)
                }
            });


        }
    });
})();

// ==UserScript==
// @name         戴森球蓝图 增强
// @namespace    https://blog.rhilip.info/
// @version      0.0.3
// @description  Extend the website Dyson Sphere Blueprints
// @author       Rhilip
// @match        https://www.dysonsphereblueprints.com/*
// @require      https://unpkg.com/jquery@3.3.1/dist/jquery.min.js
// @require      https://unpkg.com/jszip@3.7.0/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429878/%E6%88%B4%E6%A3%AE%E7%90%83%E8%93%9D%E5%9B%BE%20%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/429878/%E6%88%B4%E6%A3%AE%E7%90%83%E8%93%9D%E5%9B%BE%20%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // 清理文件名中的特殊字符
    function sanitizeFileName(input) {
        if (typeof input !== 'string') {
            throw new Error('Input must be string');
        }
        return input
            .replace(/[\/\?<>\\:\*\|":]/g, '_')
            .replace(/[\x00-\x1f\x80-\x9f]/g, '_')
            .replace(/^\.+$/, '_')
            .replace(/^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i, '_')
            .replace(/[\. ]+$/, '_');;
    }

    function getBlueprintNameFromAnother(another) {
        return another.find('div.o-blueprint-card__content h2 a').text().trim();
    }

    function getBlueprintTextFromAnother(another) {
        return another.find('button[data-clipboard-text]').data('clipboard-text');
    }

    function getBlueprintDataFromAnother(another) {
        return [getBlueprintNameFromAnother(another), getBlueprintTextFromAnother(another)]
    }

    // 给列表的单个蓝图加上下载按钮
    function addBlueprintDownloadBtn() {
        $('.o-blueprint-card__copy').each(function () {
            const that = $(this);
            const blueprintString = that.data('clipboard-text');
            const blueprintAnother = that.parents('li.o-blueprint-card');
            const blueprintName = getBlueprintNameFromAnother(blueprintAnother);

            const downloadBtn = $('<button class="o-blueprint-card__copy uj_added uj_download_this" style="left:80px">Download</button>');
            downloadBtn.click(function () {
                saveAs(new Blob([blueprintString]), `${sanitizeFileName(blueprintName)}.txt`);
            })

            if (blueprintAnother.find('button.uj_download_this').length === 0) {
                that.after(downloadBtn);
            }
        })
    }

    function addDownloadThisPageBtn() {
        const downloadThisPageBtn = $('<button class="o-blueprint-card__copy uj_added uj_download_page" style="position: static;">Download This Page</button>');
        downloadThisPageBtn.click(function () {
            const allBlueprintInThisPage = $('li.o-blueprint-card').map(function () {
                return [getBlueprintDataFromAnother($(this))];
            }).get();

            if (allBlueprintInThisPage.length > 1) {
                const jszip = new JSZip();
                for (const getBlueprintDataFromAnother of allBlueprintInThisPage) {
                    const [blueprintName, blueprintString] = getBlueprintDataFromAnother
                    jszip.file(`${sanitizeFileName(blueprintName)}.txt`, blueprintString)
                }

                jszip.generateAsync({ type: "blob" })
                    .then(function (content) {
                        saveAs(content, "blueprint.zip");
                    });
            } else {
                const [blueprintName, blueprintString] = allBlueprintInThisPage[0];
                saveAs(new Blob([blueprintString]), `${sanitizeFileName(blueprintName)}.txt`);
            }
        })

        if ($('button.uj_download_page').length === 0) {
            $('div.t-blueprint-list').prepend(downloadThisPageBtn);
        }
    }

    function main() {
        $('.uj_added').remove();  // 清空所有我们添加的DOM，防止 turbolinks 切换时出现重复按钮

        if (
            location.pathname === '/' // 首页
            || (location.pathname === '/blueprints' && location.search.includes('search='))  // 搜索页
        ) {
            console.log('首页以及蓝图搜索页');
            addBlueprintDownloadBtn();
            addDownloadThisPageBtn();
        } else if (
            location.pathname === '/collections'
        ) {
            console.log('合集搜索页面');

            // TODO 直接在合集搜索页面搜索下载整个合集

        } else if (
            location.pathname.startsWith('/blueprints/')
        ) {
            console.log('蓝图详细页面');
            
            const downloadBtn = $('<button class="t-blueprint__copy uj_added" style="margin-right: 10px;"><i class="fas fa-download"></i>Download</button>');
            downloadBtn.click(function () {
                const bpText = $('div.t-blueprint__blueprint > textarea').text();
                const bpName = $('div.t-blueprint__title h2').text().trim();
                saveAs(new Blob([bpText]), `${sanitizeFileName(bpName)}.txt`);
            });

            $('.t-blueprint__blueprint button.t-blueprint__copy').after(downloadBtn);
        } else if (
            location.pathname.startsWith('/collections/')
            || /^\/users(\/\d+)?\/blueprints/.test(location.pathname)  // 用户列表页（包括自己和他人）
        ) {
            console.log('合集详细页面');
            addBlueprintDownloadBtn();
            addDownloadThisPageBtn();
        }
    }

    // 运行主方法，并在页面切换时同样运行
    main();
    document.addEventListener("turbolinks:load", function () {
        main();
    })
})();
// ==UserScript==
// @name         Easy Web Page to Markdown
// @name:zh      网页转Markdown工具
// @namespace    http://tampermonkey.net/
// @version      0.3.6
// @description  Convert selected HTML to Markdown
// @description:zh 将选定的HTML转换为Markdown
// @author       shiquda
// @match        *://*/*
// @namespace    https://github.com/shiquda/shiquda_UserScript
// @supportURL   https://github.com/shiquda/shiquda_UserScript/issues
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @require      https://unpkg.com/turndown/dist/turndown.js
// @require      https://unpkg.com/@guyplusplus/turndown-plugin-gfm/dist/turndown-plugin-gfm.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.0/marked.min.js
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/486888/Easy%20Web%20Page%20to%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/486888/Easy%20Web%20Page%20to%20Markdown.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // User Config
    // Short cut

    const shortCutUserConfig = {
        /* Example:
        "Shift": false,
        "Ctrl": true,
        "Alt": false,
        "Key": "m"
        */
    }

    // Obsidian
    const obsidianUserConfig = {
        /* Example:
            "my note": [
                "Inbox/Web/",
                "Collection/Web/Reading/"
            ]
        */
    }

    const guide = `
- 使用**方向键**选择元素
    - 上：选择父元素
    - 下：选择第一个子元素
    - 左：选择上一个兄弟元素
    - 右：选择下一个兄弟元素
- 使用**滚轮**放大缩小
    - 上：选择父元素
    - 下：选择第一个子元素
- 点击元素选择
- 按下 \`Esc\` 键取消选择
    `

    // 全局变量
    var isSelecting = false;
    var selectedElement = null;
    let shortCutConfig, obsidianConfig;
    // 读取配置
    // 初始化快捷键配置
    let storedShortCutConfig = GM_getValue('shortCutConfig');
    if (Object.keys(shortCutUserConfig).length !== 0) {
        GM_setValue('shortCutConfig', JSON.stringify(shortCutUserConfig));
        shortCutConfig = shortCutUserConfig;
    } else if (storedShortCutConfig) {
        shortCutConfig = JSON.parse(storedShortCutConfig);
    }

    // 初始化Obsidian配置
    let storedObsidianConfig = GM_getValue('obsidianConfig');
    if (Object.keys(obsidianUserConfig).length !== 0) {
        GM_setValue('obsidianConfig', JSON.stringify(obsidianUserConfig));
        obsidianConfig = obsidianUserConfig;
    } else if (storedObsidianConfig) {
        obsidianConfig = JSON.parse(storedObsidianConfig);
    }



    // HTML2Markdown
    function convertToMarkdown(element) {
        var html = element.outerHTML;
        let turndownMd = turndownService.turndown(html);
        turndownMd = turndownMd.replaceAll('[\n\n]', '[]'); // 防止 <a> 元素嵌套的暂时方法，并不完善
        return turndownMd;
    }


    // 预览
    function showMarkdownModal(markdown) {
        var $modal = $(`
                    <div class="h2m-modal-overlay">
                        <div class="h2m-modal">
                            <textarea>${markdown}</textarea>
                            <div class="h2m-preview">${marked.parse(markdown)}</div>
                            <div class="h2m-buttons">
                                <button class="h2m-copy">Copy to clipboard</button>
                                <button class="h2m-download">Download as MD</button>
                                <select class="h2m-obsidian-select">Send to Obsidian</select>
                            </div>
                            <button class="h2m-close">X</button>
                        </div>
                    </div>
                `);


        $modal.find('.h2m-obsidian-select').append($('<option>').val('').text('Send to Obsidian'));
        for (const vault in obsidianConfig) {
            for (const path of obsidianConfig[vault]) {
                // 插入元素
                const $option = $('<option>')
                    .val(`obsidian://advanced-uri?vault=${vault}&filepath=${path}`)
                    .text(`${vault}: ${path}`);
                $modal.find('.h2m-obsidian-select').append($option);
            }
        }

        $modal.find('textarea').on('input', function () {
            // console.log("Input event triggered");
            var markdown = $(this).val();
            var html = marked.parse(markdown);
            // console.log("Markdown:", markdown);
            // console.log("HTML:", html);
            $modal.find('.h2m-preview').html(html);
        });

        $modal.on('keydown', function (e) {
            if (e.key === 'Escape') {
                $modal.remove();
            }
        });


        $modal.find('.h2m-copy').on('click', function () { // 复制到剪贴板
            GM_setClipboard($modal.find('textarea').val());
            $modal.find('.h2m-copy').text('Copied!');
            setTimeout(() => {
                $modal.find('.h2m-copy').text('Copy to clipboard');
            }, 1000);
        });

        $modal.find('.h2m-download').on('click', function () { // 下载
            var markdown = $modal.find('textarea').val();
            var blob = new Blob([markdown], { type: 'text/markdown' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            // 当前页面标题 + 时间
            a.download = `${document.title}-${new Date().toISOString().replace(/:/g, '-')}.md`;
            a.click();
        });

        $modal.find('.h2m-obsidian-select').on('change', function () { // 发送到 Obsidian
            const val = $(this).val();
            if (!val) return;
            const markdown = $modal.find('textarea').val();
            GM_setClipboard(markdown);
            const title = document.title.replaceAll(/[\\/:*?"<>|]/g, '_'); // File name cannot contain any of the following characters: * " \ / < > : | ?
            const url = `${val}${title}.md&clipboard=true`;
            window.open(url);
        });

        $modal.find('.h2m-close').on('click', function () { // 关闭按钮 X
            $modal.remove();
        });

        // 同步滚动
        // 获取两个元素
        var $textarea = $modal.find('textarea');
        var $preview = $modal.find('.h2m-preview');
        var isScrolling = false;

        // 当 textarea 滚动时，设置 preview 的滚动位置
        $textarea.on('scroll', function () {
            if (isScrolling) {
                isScrolling = false;
                return;
            }
            var scrollPercentage = this.scrollTop / (this.scrollHeight - this.offsetHeight);
            $preview[0].scrollTop = scrollPercentage * ($preview[0].scrollHeight - $preview[0].offsetHeight);
            isScrolling = true;
        });

        // 当 preview 滚动时，设置 textarea 的滚动位置
        $preview.on('scroll', function () {
            if (isScrolling) {
                isScrolling = false;
                return;
            }
            var scrollPercentage = this.scrollTop / (this.scrollHeight - this.offsetHeight);
            $textarea[0].scrollTop = scrollPercentage * ($textarea[0].scrollHeight - $textarea[0].offsetHeight);
            isScrolling = true;
        });

        $(document).on('keydown', function (e) {
            if (e.key === 'Escape' && $('.h2m-modal-overlay').length > 0) {
                $('.h2m-modal-overlay').remove();
            }
        });

        $('body').append($modal);
    }

    // 开始选择
    function startSelecting() {
        $('body').addClass('h2m-no-scroll'); // 防止页面滚动
        isSelecting = true;
        // 操作指南
        tip(marked.parse(guide));
    }

    // 结束选择
    function endSelecting() {
        isSelecting = false;
        $('.h2m-selection-box').removeClass('h2m-selection-box');
        $('body').removeClass('h2m-no-scroll');
        $('.h2m-tip').remove();
    }

    function tip(message, timeout = null) {
        var $tipElement = $('<div>')
            .addClass('h2m-tip')
            .html(message)
            .appendTo('body')
            .hide()
            .fadeIn(200);
        if (timeout === null) {
            return;
        }
        setTimeout(function () {
            $tipElement.fadeOut(200, function () {
                $tipElement.remove();
            });
        }, timeout);
    }

    // Turndown 配置
    var turndownPluginGfm = TurndownPluginGfmService;
    var turndownService = new TurndownService({ codeBlockStyle: 'fenced' });

    turndownPluginGfm.gfm(turndownService); // 引入全部插件
    // turndownService.addRule('strikethrough', {
    //     filter: ['del', 's', 'strike'],
    //     replacement: function (content) {
    //         return '~' + content + '~'
    //     }
    // });

    // turndownService.addRule('latex', {
    //     filter: ['mjx-container'],
    //     replacement: function (content, node) {
    //         const text = node.querySelector('img')?.title;
    //         const isInline = !node.getAttribute('display');
    //         if (text) {
    //             if (isInline) {
    //                 return '$' + text + '$'
    //             }
    //             else {
    //                 return '$$' + text + '$$'
    //             }
    //         }
    //         return '';
    //     }
    // });




    // 添加CSS样式
    GM_addStyle(`
        .h2m-selection-box {
            border: 2px dashed #f00;
            background-color: rgba(255, 0, 0, 0.2);
        }
        .h2m-no-scroll {
            overflow: hidden;
            z-index: 9997;
        }
        .h2m-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            height: 80%;
            background: white;
            border-radius: 10px;
            display: flex;
            flex-direction: row;
            z-index: 9999;
        }
        .h2m-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9998;
        }
        .h2m-modal textarea,
        .h2m-modal .h2m-preview {
            width: 50%;
            height: 100%;
            padding: 20px;
            box-sizing: border-box;
            overflow-y: auto;
        }
        .h2m-modal .h2m-buttons {
            position: absolute;
            bottom: 10px;
            right: 10px;
        }
        .h2m-modal .h2m-buttons button,
        .h2m-modal .h2m-obsidian-select {
            margin-left: 10px;
            background-color: #4CAF50; /* Green */
            border: none;
            color: white;
            padding: 13px 16px;
            border-radius: 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            transition-duration: 0.4s;
            cursor: pointer;
        }
        .h2m-modal .h2m-buttons button:hover,
        .h2m-modal .h2m-obsidian-select:hover {
            background-color: #45a049;
        }
        .h2m-modal .h2m-close {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
            width: 25px;
            height: 25px;
            background-color: #f44336;
            color: white;
            font-size: 16px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .h2m-tip {
            position: fixed;
            top: 22%;
            left: 82%;
            transform: translate(-50%, -50%);
            background-color: white;
            border: 1px solid black;
            padding: 8px;
            z-index: 9999;
            border-radius: 10px;
            box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
            background-color: rgba(255, 255, 255, 0.7);
        }
    `);

    // 注册触发器
    shortCutConfig = shortCutConfig ? shortCutConfig : {
        "Shift": false,
        "Ctrl": true,
        "Alt": false,
        "Key": "m"
    };
    $(document).on('keydown', function (e) {
        if (e.ctrlKey === shortCutConfig['Ctrl'] &&
            e.altKey === shortCutConfig['Alt'] &&
            e.shiftKey === shortCutConfig['Shift'] &&
            e.key.toUpperCase() === shortCutConfig['Key'].toUpperCase()) {
            e.preventDefault();
            startSelecting();
        }
        // else {
        //     console.log(e.ctrlKey, e.altKey, e.shiftKey, e.key.toUpperCase());
        // }
    });
    // $(document).on('keydown', function (e) {
    //     if (e.ctrlKey && e.key === 'm') {
    //         e.preventDefault();
    //         startSelecting()
    //     }
    // });

    GM_registerMenuCommand('Convert to Markdown', function () {
        startSelecting()
    });



    $(document).on('mouseover', function (e) { // 开始选择
        if (isSelecting) {
            $(selectedElement).removeClass('h2m-selection-box');
            selectedElement = e.target;
            $(selectedElement).addClass('h2m-selection-box');
        }
    }).on('wheel', function (e) { // 滚轮事件
        if (isSelecting) {
            e.preventDefault();
            if (e.originalEvent.deltaY < 0) {
                selectedElement = selectedElement.parentElement ? selectedElement.parentElement : selectedElement; // 扩大
                if (selectedElement.tagName === 'HTML' || selectedElement.tagName === 'BODY') {
                    selectedElement = selectedElement.firstElementChild;
                }
            } else {
                selectedElement = selectedElement.firstElementChild ? selectedElement.firstElementChild : selectedElement; // 缩小
            }
            $('.h2m-selection-box').removeClass('h2m-selection-box');
            $(selectedElement).addClass('h2m-selection-box');
        }
    }).on('keydown', function (e) { // 键盘事件
        if (isSelecting) {
            e.preventDefault();
            if (e.key === 'Escape') {
                endSelecting();
                return;
            }
            switch (e.key) { // 方向键：上下左右
                case 'ArrowUp':
                    selectedElement = selectedElement.parentElement ? selectedElement.parentElement : selectedElement; // 扩大
                    if (selectedElement.tagName === 'HTML' || selectedElement.tagName === 'BODY') { // 排除HTML 和 BODY
                        selectedElement = selectedElement.firstElementChild;
                    }
                    break;
                case 'ArrowDown':
                    selectedElement = selectedElement.firstElementChild ? selectedElement.firstElementChild : selectedElement; // 缩小
                    break;
                case 'ArrowLeft': // 寻找上一个元素，若是最后一个子元素则选择父元素的下一个兄弟元素，直到找到一个元素
                    var prev = selectedElement.previousElementSibling;
                    while (prev === null && selectedElement.parentElement !== null) {
                        selectedElement = selectedElement.parentElement;
                        prev = selectedElement.previousElementSibling ? selectedElement.previousElementSibling.lastChild : null;
                    }
                    if (prev !== null) {
                        if (selectedElement.tagName === 'HTML' || selectedElement.tagName === 'BODY') {
                            selectedElement = selectedElement.firstElementChild;
                        }
                        selectedElement = prev;
                    }
                    break;
                case 'ArrowRight':
                    var next = selectedElement.nextElementSibling;
                    while (next === null && selectedElement.parentElement !== null) {
                        selectedElement = selectedElement.parentElement;
                        next = selectedElement.nextElementSibling ? selectedElement.nextElementSibling.firstElementChild : null;
                    }
                    if (next !== null) {
                        if (selectedElement.tagName === 'HTML' || selectedElement.tagName === 'BODY') {
                            selectedElement = selectedElement.firstElementChild;
                        }
                        selectedElement = next;
                    }
                    break;
            }

            $('.h2m-selection-box').removeClass('h2m-selection-box');
            $(selectedElement).addClass('h2m-selection-box'); // 更新选中元素的样式
        }
    }
    ).on('mousedown', function (e) { // 鼠标事件，选择 mousedown 是因为防止点击元素后触发其他事件
        if (isSelecting) {
            e.preventDefault();
            var markdown = convertToMarkdown(selectedElement);
            showMarkdownModal(markdown);
            endSelecting();
        }
    });

})();

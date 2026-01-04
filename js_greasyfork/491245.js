// ==UserScript==
// @name         Search++：为百度与谷歌搜索结果页添加其他网站的快捷搜索按钮
// @description  为百度与谷歌搜索页面添加其他网站的快速搜索按钮，你再也不用重新打开网站重复输入搜索词啦。使用同一个搜索词，即点即达，快速度跳转
// @icon         https://www.baidu.com/cache/icon/favicon.ico
// @namespace    http://tampermonkey.net/
// @license GPL-3.0-only
// @version      0.4
// @author       fyypll
// @include      http*://*baidu.com/s*
// @include      http*://*baidu.com/baidu*
// @include      *://www.google.com/search?*
// @note    2024.04-02-V0.4 添加了KimiAI文档助手，并优化了按钮样式，现在鼠标悬浮在按钮上可以弹出相关网站说明了
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/491245/Search%2B%2B%EF%BC%9A%E4%B8%BA%E7%99%BE%E5%BA%A6%E4%B8%8E%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%A1%B5%E6%B7%BB%E5%8A%A0%E5%85%B6%E4%BB%96%E7%BD%91%E7%AB%99%E7%9A%84%E5%BF%AB%E6%8D%B7%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/491245/Search%2B%2B%EF%BC%9A%E4%B8%BA%E7%99%BE%E5%BA%A6%E4%B8%8E%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%A1%B5%E6%B7%BB%E5%8A%A0%E5%85%B6%E4%BB%96%E7%BD%91%E7%AB%99%E7%9A%84%E5%BF%AB%E6%8D%B7%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function ($) {
    'use strict';

    // 预设样式
    var defaultCss = `
    /* 百度搜索类目栏 */
    .wrapper_new {
        /* ac-baidu插件用户需要解除注释使其生效  */
        /* margin-top: 50px; */
    }
    
    /* 搜索按钮通用样式 */
    .custom-button {
        display: block;
        width: 90px;
        height: 34px;
        border: none;
        border-radius: 4px;
        background-color: #00aeec;
        color: #fff;
        text-align: center;
        font-size: 14px;
        line-height: 20px;
        cursor: pointer;
        transition: background-color .3s;
    }
    
    /* 隐藏按钮 */
    .custom-button.hide {
        display: none;
    }
    
    /* 磁力搜索 */
    #Torrents{
        background-color: #594C2D;
        border: 1px solid #554829;
        color: #F7E277;
    }
    #Torrents:hover{
        background-color: #2c240f
    }
    #BiliBili:hover{
        background-color: #40C5F1;
        border: 1px solid #00aeec;
    }
    /* #Google{
        background-color: #f8f9fa;
        color: #3c4043;
        border: 1px solid #dadce0;
    }
    #Google:hover{
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
        background-color: #f8f9fa;
        color: #202124
    } */
    #Github{
        background-color: #f6f8fa;
        border: 1px solid #d0d7de;
        color: #24292f;
    }
    #Github:hover{
        background-color: #eef1f4;
    }
    #MDN{
        background-color: #1b1b1b;
        border: 1px solid #1b1b1b;
        color: #fff;
    }
    #MDN:hover{
        background-color: #696969;
    }
    #ChatGLM{
        background-color: #2454ff;
    }
    #ChatGLM:hover{
        background-color: #204ce5;;
    }
    #Zhihu{
        background-color: #0965ea;
        border: 1px solid #0965ea;
        color: #fff;
    }
    #Zhihu:hover{
        background-color: #1772F6;
    }
    #Douyin{
        background-color: #393A44;
        border: 1px solid #393A44;
        color: rgba(255,255,255, .9);
    }
    #Douyin:hover{
        color: #E52A50;
    }
    
    /* 自定义按钮样式 */
    #Settings{
        display:flex;
        align-items:center;
    }
    #Settings>svg {
        width: 24px;
        height: 24px;
        fill: #1296db;
        cursor: pointer;
    }
    
    /* 按钮外层div样式 */
    #buttonWrapper {
        display: grid;
        grid-auto-flow: column;
        gap: 4px;
        padding: 4px;
        background-color: transparent;
    }
    
    /* 面板样式 */
    #SettingPanel {}
    
    
    /* 谷歌搜索类目栏 */
    .e9EfHf {
        padding-top: 50px !important;
    }
`;
    // 获取当前页面的 URL
    var currentPageUrl = window.location.hostname;
    // 弹窗面板打开状态，默认关闭
    var isPanelOpen = false;
    // 搜索关键字
    var keyword = "";

    // 齿轮svg图标
    var gearIcon = '<svg t="1711634029616" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3214" width="32" height="32"><path d="M645.5296 932.62336h-0.01024c-16.19968 0-31.9488-6.70208-42.12224-17.92512-13.86496-15.20128-57.7792-54.72256-93.73184-54.72256-35.70176 0-80.29696 39.75168-93.1072 53.67296-10.14784 11.02848-25.78944 17.61792-41.84064 17.61792-7.63904 0-14.85824-1.46944-21.44256-4.36224l-1.14688-0.50688-109.27616-61.1072-1.08032-0.75776c-19.89632-13.93152-27.45856-41.1648-17.60768-63.35488 0.0768-0.17408 10.07616-23.24992 10.07616-44.29824 0-63.86688-51.95264-115.82464-115.83488-115.82464h-3.8656l-0.71168 0.01024c-18.28864 0-33.18784-16.256-37.94944-41.41568-0.37376-1.99168-9.3184-49.69984-9.3184-87.29088 0-37.59104 8.94464-85.2992 9.3184-87.31648 4.81792-25.472 20.03968-41.83552 38.66112-41.38496h3.8656c63.87712 0 115.83488-51.968 115.83488-115.84 0-21.03296-9.98912-44.11904-10.09664-44.3392-9.84576-22.17984-2.2272-49.40288 17.74592-63.28832l1.13152-0.78336 115.32288-63.34976 1.19808-0.50688c6.49216-2.76992 13.60896-4.1728 21.14048-4.1728 16.01536 0 31.67744 6.44096 41.92256 17.23904 13.64992 14.28992 56.79616 51.456 91.7248 51.456 34.57536 0 77.45536-36.43392 91.06944-50.47296 10.17856-10.5728 25.74848-16.90624 41.6-16.90624 7.69024 0 14.93504 1.45408 21.5296 4.3264l1.16736 0.50688 111.3856 61.88544 1.1008 0.76288c19.92704 13.91104 27.50464 41.14432 17.65888 63.35488-0.08704 0.16384-10.08128 23.25504-10.08128 44.29312 0 63.872 51.95264 115.84 115.82464 115.84h3.87584c18.59072-0.42496 33.82784 15.90784 38.65088 41.38496 0.37888 2.01216 9.32864 49.72032 9.32864 87.31136 0 37.5808-8.94976 85.2992-9.32864 87.30112-4.81792 25.48224-20.06016 41.7792-38.65088 41.40544h-3.87584c-63.872 0-115.82464 51.95776-115.82464 115.82464 0 21.0432 9.99424 44.11392 10.09664 44.34944 9.8304 22.14912 2.24256 49.38752-17.70496 63.28832l-1.12128 0.77312-113.25952 62.60224-1.1776 0.50688c-6.48192 2.80064-13.57312 4.21376-21.06368 4.21376z m-3.44064-53.36576c0.51712 0.33792 1.94048 0.90112 3.44064 0.90112l0.16896-0.00512 105.8304-58.48576c-2.55488-5.9392-14.24384-34.72896-14.24384-64.768 0-89.84064 70.76352-163.47136 159.47776-168.06912 1.26976-7.05024 8.20224-46.70976 8.20224-76.47232 0-29.75744-6.93248-69.4016-8.20224-76.47232-88.71424-4.60288-159.47776-78.22848-159.47776-168.06912 0-30.08 11.71456-58.91072 14.25408-64.79872l-104.10496-57.84064c-0.11264-0.00512-0.27136-0.01536-0.4352-0.01536-1.77152 0-3.4304 0.64-3.97312 1.01376-1.75616 1.79712-16.8448 17.09568-38.51264 32.34816-32.09216 22.5792-62.42816 34.0224-90.17856 34.0224-28.032 0-58.624-11.6736-90.91072-34.69824-21.79584-15.54432-36.97152-31.13472-38.71232-32.96256-0.55808-0.37888-2.23232-1.03936-4.02432-1.03936l-0.37888 0.01024-107.8272 59.22304c2.58048 6.01088 14.22848 34.74944 14.22848 64.73728 0 89.84064-70.75328 163.46624-159.47264 168.07424-1.28 7.05536-8.21248 46.70976-8.21248 76.47232 0 29.75232 6.93248 69.39136 8.21248 76.47232 88.71936 4.59776 159.47264 78.21824 159.47264 168.05888 0 30.14656-11.76064 59.0336-14.26944 64.8448l102.05696 57.06752a7.1168 7.1168 0 0 0 3.63008-0.8704c1.90976-2.048 17.15712-18.18112 39.1168-34.26816 32.72192-23.9872 63.8208-36.1472 92.42624-36.1472 28.88192 0 60.22144 12.3904 93.1328 36.82816 22.08256 16.39936 37.39648 32.83968 39.28576 34.90816z" p-id="3215"></path><path d="M510.03904 666.03008c-85.05344 0-154.25024-69.20192-154.25024-154.25536 0-85.05344 69.1968-154.25024 154.25024-154.25024 85.0688 0 154.26048 69.1968 154.26048 154.25024s-69.19168 154.25536-154.26048 154.25536z m0-256.04608c-56.12032 0-101.7856 45.66528-101.7856 101.7856 0 56.12544 45.66016 101.7856 101.7856 101.7856 56.13568 0 101.80096-45.66016 101.80096-101.7856 0-56.12032-45.66528-101.7856-101.80096-101.7856z" p-id="3216"></path></svg>';

    // 创建搜索元素
    var buttonDiv = $('<div></div>').attr('id', 'buttonWrapper').append(
        $('<input>', { type: 'button', value: '磁力搜索', id: 'Torrents', class: 'custom-button', title: '磁力搜索' }),
        $('<input>', { type: 'button', value: 'BiliBili', id: 'BiliBili', class: 'custom-button', title: 'B站搜索' }),
        $('<input>', { type: 'button', value: '抖音', id: 'Douyin', class: 'custom-button', title: '抖音搜索' }),
        $('<input>', { type: 'button', value: '知乎', id: 'Zhihu', class: 'custom-button', title: '知乎搜索' }),
        $('<input>', { type: 'button', value: 'Google', id: 'Google', class: 'custom-button', title: '谷歌搜索' }),
        $('<input>', { type: 'button', value: 'Baidu', id: 'Baidu', class: 'custom-button', title: '百度搜索' }),
        $('<input>', { type: 'button', value: 'Github', id: 'Github', class: 'custom-button', title: '程序员的代码仓库' }),
        $('<input>', { type: 'button', value: 'ChatGLM', id: 'ChatGLM', class: 'custom-button', title: '智谱清言，免费的人工智能助手' }),
        $('<input>', { type: 'button', value: 'MDN', id: 'MDN', class: 'custom-button', title: 'Web相关技术文档库' }),
        $('<input>', { type: 'button', value: 'KimiAI', id: 'KimiAI', class: 'custom-button', title: '免费的文档内容总结AI，支持文档、图片、网页...' }),
        $('<div></div>').attr('id', 'Settings').append(gearIcon)
    );
    // 将gearIcon添加到按钮
    $('#Settings', buttonDiv).html(gearIcon);

    // 给几个搜索按钮绑定点击事件
    $(document).on('click', '.custom-button', function () {
        if (currentPageUrl.match(RegExp(/baidu.com/))) {
            keyword = $('#kw').val();
        } else {
            keyword = $('#APjFqb').val();
        }
        var searchName = $(this).attr('id');

        openSearch(keyword, searchName);
    });

    // 打开自定义面板
    $(document).on('click', '#Settings', function () {
        if (!isPanelOpen) {
            showPanel();
            isPanelOpen = true;
        }
    });

    // 根据网站决定按钮插入位置
    if (currentPageUrl.match(RegExp(/baidu.com/))) {
        $('#form').append(buttonDiv);
        $('#Baidu').addClass('hide')
        $('#Google').removeClass('hide')
    }
    if (currentPageUrl.match(RegExp(/google.com/))) {
        $('#tsf div.A8SBwf').append(buttonDiv);
        $('#Google').addClass('hide')
        $('#Baidu').removeClass('hide')
    }

    // 打开新窗口进行搜索
    function openSearch (keyword, searchName) {
        var searchList = {
            "Baidu": "https://www.baidu.com/s?wd=",
            "Google": "https://www.google.com/search?&q=",
            "BiliBili": "https://search.bilibili.com/all?keyword=",
            "Github": "https://github.com/search?q=",
            "StackOverflow": "https://stackoverflow.com/search?q=",
            "Zhihu": "https://www.zhihu.com/search?type=content&q=",
            "MDN": "https://developer.mozilla.org/zh-CN/search?q=",
            "ChatGLM": "https://chatglm.cn/main/detail",
            "Bing": "https://www.so.com/s?q=",
            "Torrents": "https://kickass.sx/usearch/",
            "Douyin": "https://www.douyin.com/search/",
            "KimiAI": "https://kimi.moonshot.cn/",
        };
        var searchUrl = searchList[searchName] + encodeURIComponent(keyword);
        window.open(searchUrl, '_blank');
    }

    // 显示面板
    function showPanel () {
        var panel = $('<div></div>').attr('id', 'SettingPanel').css({
            'position': 'fixed',
            'top': '50%',
            'left': '50%',
            'transform': 'translate(-50%, -50%)',
            'background-color': '#fff',
            'padding': '20px',
            'box-shadow': '0 0 10px rgba(0, 0, 0, 0.2)',
            'z-index': '9999',
            'opacity': '0.9'
        }).appendTo('body');

        // 添加一个文本框和按钮
        panel.append(
            $('<textarea>', { id: 'cssTextarea', placeholder: '输入 CSS 样式...' }).css({
                'width': '400px',
                'height': '300px',
                'margin-bottom': '10px'
            }),
            $('<div></div>').append(
                $('<input>', { type: 'button', value: '取消', id: 'cancelButton' }).css({
                    'width': '48%',
                    'padding': '5px',
                    'border': 'none',
                    'background-color': '#dc3545',
                    'color': '#fff',
                    'cursor': 'pointer'
                }),
                $('<input>', { type: 'button', value: '保存', id: 'saveButton' }).css({
                    'width': '48%',
                    'padding': '5px',
                    'border': 'none',
                    'background-color': '#007bff',
                    'color': '#fff',
                    'cursor': 'pointer',
                    'margin-left': '4%'
                }),
                $('<input>', { type: 'button', value: '重置CSS', id: 'resetButton' }).css({
                    'width': '100%',
                    'padding': '5px',
                    'border': 'none',
                    'background-color': '#ffc107',
                    'color': '#212529',
                    'cursor': 'pointer',
                    'margin-top': '10px'
                }),
            )
        );

        // 如果油猴中有样式，则将其显示在文本框中
        var storedStyle = GM_getValue('customStyle', '');
        $('#cssTextarea').val(storedStyle);

        // 取消按钮点击事件
        $('#cancelButton').click(function () {
            isPanelOpen = false;
            panel.remove();
        });

        // 保存按钮点击事件
        $('#saveButton').click(function () {
            applyStyle($('#cssTextarea').val());
            // 将输入的样式保存到油猴中
            GM_setValue('customStyle', $('#cssTextarea').val());

            isPanelOpen = false;
            panel.remove();
        });

        // 重置按钮点击事件
        $('#resetButton').click(function () {
            var confirmReset = confirm('确定要重置回默认样式吗？你自定义的样式将会丢失，请注意备份！');
            if (confirmReset) {
                $('#cssTextarea').val(defaultCss);
                applyStyle(defaultCss);
                GM_setValue('customStyle', defaultCss);
            }
        });

    }

    // 将样式插入网页
    function applyStyle (css) {
        $('<style></style>').text(css).appendTo('#buttonWrapper');
    }

    // 在页面加载完成后应用保存的样式
    $(document).ready(function () {
        applyStyle(GM_getValue('customStyle', defaultCss));
    });

    // 给脚本添加菜单选项
    GM_registerMenuCommand("建议与反馈", menu_func, "");
    function menu_func () {
        window.open("https://greasyfork.org/zh-CN/scripts/491245/feedback");
    }

})(jQuery);

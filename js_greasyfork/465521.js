// ==UserScript==
// @name         水墨图床妖火快捷上传插件
// @namespace    https://img.ink/
// @version      0.25
// @description  上传图片并一键插入BBCode图片代码
// @author       You
// @match        *://yaohuo.me/*
// @match        *://*.yaohuo.me/*
// @icon         https://img.ink/favicon.ico
// @run-at       document-end
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.js
// @require      https://cdn.staticfile.org/layui/2.8.2/layui.min.js
// @require      https://cdn.staticfile.org/layer/3.5.1/layer.min.js
// @downloadURL https://update.greasyfork.org/scripts/465521/%E6%B0%B4%E5%A2%A8%E5%9B%BE%E5%BA%8A%E5%A6%96%E7%81%AB%E5%BF%AB%E6%8D%B7%E4%B8%8A%E4%BC%A0%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/465521/%E6%B0%B4%E5%A2%A8%E5%9B%BE%E5%BA%8A%E5%A6%96%E7%81%AB%E5%BF%AB%E6%8D%B7%E4%B8%8A%E4%BC%A0%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==



var token = ''; //这里输入你的token，如果希望以游客身份上传，请留空。
//token获取方式：进入https://img.ink/user/settings.html，第四行即是token，复制粘贴到上方即可
//示例： 原本的 ''  修改为   '25d9e338dd539b8f5cb222d8e662be5d'
//即在''中添加即可



(function() {
    'use strict';
    // 在<head>标签内插入layui CSS
    const layuiCssLink = '<link rel="stylesheet" href="https://cdn.staticfile.org/layui/2.8.2/css/layui.min.css"><link rel="stylesheet" href="https://cdn.staticfile.org/layer/3.5.1/mobile/need/layer.min.css">';
    // 在<head>标签内插入layui CSS
    $('link[href="/template/default/xqx.css"]').before(layuiCssLink);

    $('head').append(layuiCssLink);
    // 添加样式
    const style = `

    <style>
    body {
        font: inherit !important;
        line-height: 32px !important;
        margin: 0 auto;
    }
    .container {
        display: flex;
    }

    .textarea-container {
        width: 70%;
    }

    .upload-container {
        width: 30%;
        display: flex;
        align-items: center; // 垂直居中
        justify-content: center; // 水平居中
    }

    .layui-upload-drag {
        height: 80px;
        padding: 0;
        line-height: 1;
    }

    .textarea-container textarea {
        width: 100%;
    }
    a {
        color: #3d68a8 !important;
        text-decoration: none !important;
        font-size: 17px !important;
    }
    div.justify5213 {
        letter-spacing: .7px;
        overflow: hidden;
        height: 31px;
        padding: 5px 0 0 5px;
    }
    div.justify5213 > span {
        display: inline-block;
        padding-left: 100%;
    }
    a.topic-link:visited, div.list a:visited {
        color: #A3A3A3 !important;
    }
    .border-solid img {
        border: 1px solid #d3d3d3 !important;
    }
    .border-solid2 img {
        border: 2px solid #d3d3d3 !important;
        max-width: 99% !important;
    }
    .listdata img {
        padding-right: 0.1em !important;
    }
    .number {
        line-break: auto !important;
    }
    @font-face {
        font-family: "LxgwWenKai";
        font-display: swap;
        src: url(./css/font/LXGWWenKai5.ttf);
    }
    .LXGW {
        text-align: center;
        font: 21px/2.2 'LxgwWenKai';
        font-weight: 700;
    }
    .LxgwWenKai {
        font-family: "LxgwWenKai" !important;
    }
    </style>
    `;

    // 添加拖拽上传HTML
    const uploadHtml = `
    <div class="upload-container">
        <div class="layui-upload-drag" id="uploadDrag">
            <i class="layui-icon"></i>
            <p>点击上传，或将图片拖拽到此处</p>
        </div>
    </div>

    `;
    // 调整输入框高度
    const uploadContainerHeight = $('.upload-container .layui-upload-drag').outerHeight();
    $('.textarea-container textarea').css('height', uploadContainerHeight + 'px');

    $('head').append(style);
    $('.retextarea').wrap('<div class="container"></div>');
    $('.retextarea').wrap('<div class="textarea-container"></div>');
    $(uploadHtml).insertAfter('.textarea-container');
    const creditText = `
<div style="font-size: 9px; color: #888; text-align: center; margin-top: 8px;">
    图片上传接口由
    <a href="https://img.ink/" target="_blank" style="font-weight: bold; color: #888;">
        水墨图床
    </a>
    提供
</div>
`;
    $('.container').after(creditText);
    const layer = layui.layer;
    layui.use('upload', function () {
    var upload = layui.upload;
    var element = layui.element;
    upload.render({
        elem: '#uploadDrag',
        url: 'https://img.ink/api/upload',
        accept: 'images',
        acceptMime: '.jpg,.jpeg,.gif,.png,.ico,.bmp',
        multiple: true,
        field: ['image'],
        exts: 'jpg|jpeg|gif|png|ico|bmp',
        headers: token ? {'token': token} : {},
        done: function (res) {
            if (res.code === 200) {
                    const bbcode = `[img]${res.data.url}[/img]\n`;
                    const $textarea = $('textarea[name="content"]');
                    $textarea.val($textarea.val() + bbcode);
                } else {
                    layer.msg('上传失败：' + res.msg);
                }
        },
        error: function () {
            layer.msg('上传失败');
        },
    });
});
})();
(function() {
    'use strict';
    $(document).ready(function() {
        // 调整输入框高度
        setTimeout(function() {
            const uploadContainerHeight = $('.upload-container .layui-upload-drag').outerHeight();
            $('.textarea-container textarea').css('height', uploadContainerHeight + 'px');
            $('.textarea-container textarea').css('width', '100%');
        }, 500);
    });
})();

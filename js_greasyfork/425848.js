// ==UserScript==
// @name         【编程猫社区】多语法支持
// @namespace    codemao
// @version      1.2.0
// @description  在编程猫社区使用Markdown/LaTeX语法发布帖子
// @author       简单得不简单
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @require      https://greasyfork.org/scripts/425827-editormd-js/code/editormdjs.js
// @require      https://greasyfork.org/scripts/34138-marked-js/code/markedjs.js
// @require      https://greasyfork.org/scripts/425847-prettify-js/code/prettifyjs.js
// @resource     editormd https://jddbjd.gitee.io/editor.md/css/editormd.preview.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @include      *://shequ.codemao.cn/community
// @include      *://shequ.codemao.cn/community/*
// @include      *://shequ.codemao.cn/work_shop/*
// @downloadURL https://update.greasyfork.org/scripts/425848/%E3%80%90%E7%BC%96%E7%A8%8B%E7%8C%AB%E7%A4%BE%E5%8C%BA%E3%80%91%E5%A4%9A%E8%AF%AD%E6%B3%95%E6%94%AF%E6%8C%81.user.js
// @updateURL https://update.greasyfork.org/scripts/425848/%E3%80%90%E7%BC%96%E7%A8%8B%E7%8C%AB%E7%A4%BE%E5%8C%BA%E3%80%91%E5%A4%9A%E8%AF%AD%E6%B3%95%E6%94%AF%E6%8C%81.meta.js
// ==/UserScript==

(function () {
    // 粘贴文本
    function edit(type) {
        // 内容发生变化
        function onchange() {
            iframeDoc.body.innerHTML = '';
            console.log(select.value);
            // 显示/隐藏相应内容
            if (select.value == '编程猫富文本') {
                editTextarea.style.display = 'none';
                editBCM.style.display = 'block';
            } else {
                editTextarea.style.display = 'block';
                editBCM.style.display = 'none';
                // 标识帖子属于相应语法
                var sign = document.createElement('pre');
                sign.style = 'display: none;';
                sign.innerText = select.value;
                // 对没安装脚本的友好提示
                var explain = document.createElement('p');
                explain.innerHTML = '本文使用了由社区用户简单得不简单（https://shequ.codemao.cn/user/2776410）提供的油猴脚本：多语法支持<br>内容预览（安装脚本后获得更好的体验）：';
                var code = document.createElement('pre');
                // 存放代码
                console.log(editTextarea.value);
                code.appendChild(document.createTextNode(editTextarea.value));
                iframeDoc.body.appendChild(sign);
                iframeDoc.body.appendChild(explain);
                iframeDoc.body.appendChild(code);
            }
        }

        // 内容编辑表单
        var editBCM = document.getElementsByClassName(type + '-forum_sender--form_item')[1];
        // 贴子发布表单
        var forumContainer = document.getElementsByClassName(type + '-forum_sender--container')[0];
        // 帖子编辑 iframe
        var iframeDoc = document.getElementById('react-tinymce-0_ifr').contentDocument;
        iframeDoc.body.innerHTML = '';

        // 选择语法
        var select = document.createElement('select');
        var values = new Array('编程猫富文本', 'Markdown', 'LaTeX');
        for (var i = 0; i < values.length; i++) {
            var option = document.createElement("option");
            option.value = values[i];
            option.appendChild(document.createTextNode(values[i]));
            select.appendChild(option);
        }
        select.options[0].selected = true;
        select.onchange = onchange;
        select.style.width = '100%';
        select.style.border = '1px solid hsla(0,0%,40%,.28)';
        select.style.borderRadius = '4px';
        forumContainer.insertBefore(select, editBCM);

        // 帖子内容编辑器
        var editTextarea = document.createElement('textarea');
        editTextarea.id = 'editTextarea';
        editTextarea.onkeyup = onchange;
        editTextarea.style.display = 'none';
        editTextarea.style.width = '100%';
        editTextarea.style.height = '300px';
        editTextarea.style.resize = 'none';
        editTextarea.style.border = '1px solid hsla(0,0%,40%,.28)';
        editTextarea.style.borderRadius = '4px';
        forumContainer.insertBefore(editTextarea, editBCM);
    }

    // 修改帖子页面的 HTML 为 Markdown 渲染后的 HTML
    function modify() {
        // 获取帖子内容
        var forumContent = document.getElementsByClassName('r-community-r-detail--forum_content')[0];
        var sign = forumContent.getElementsByTagName('pre')[0].innerText;
        var forumText;
        if (sign == 'Markdown') {
            // 注入 CSS
            var editormdcss = GM_getResourceText('editormd');
            GM_addStyle(editormdcss);
            // 提取 <pre> 中的文本
            forumText = forumContent.getElementsByTagName('pre')[1].innerText;
            // 修改其 HTML 为 Markdown
            var textarea = document.createElement('textarea');
            textarea.style = 'display: none;';
            textarea.appendChild(document.createTextNode(forumText));
            forumContent.innerHTML = '';
            forumContent.appendChild(textarea);
            forumContent.className = 'markdown-body editormd-html-preview';
            forumContent.id = 'markdown';

            $(function () {
                // 渲染 Markdown
                var editor = editormd.markdownToHTML("markdown", {
                    htmlDecode: true,
                });
            });
        } else if (sign == 'LaTeX') {
            var script = document.createElement('script');
            script.type = 'module';
            script.innerText = `import { LaTeXJSComponent } from "https://cdn.jsdelivr.net/npm/latex.js/dist/latex.mjs";customElements.define("latex-js", LaTeXJSComponent);`
            document.head.appendChild(script);
            // 提取 <pre> 中的文本
            forumText = forumContent.getElementsByTagName('pre')[1].innerText;
            // 修改内容
            var latex = document.createElement('latex-js');
            latex.setAttribute('baseURL', 'https://cdn.jsdelivr.net/npm/latex.js/dist/');
            latex.appendChild(document.createTextNode(forumText));
            forumContent.innerHTML = '';
            forumContent.appendChild(latex);
        }
    }

    // 程序入口
    function main() {
        var path = location.pathname;
        // 判断当前页是论坛首页还是帖子页s
        if (/^\/community\/\d+\/?$/.test(path)) {
            // 帖子页
            modify();
        } else if (/^\/community\/?$/.test(path)) {
            // 论坛首页
            edit('r-community-c');
        } else if (/^\/work_shop\/\d+\/?$/.test(path)) {
            // 工作室
            edit('c-post_box');
        }
    }


    // 设置延时，在文档加载完后渲染，否则不会渲染成功
    setTimeout(main, 1000);
})();
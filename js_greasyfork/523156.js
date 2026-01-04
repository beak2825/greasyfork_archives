// ==UserScript==
// @name         github md文件图片无法加载
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  解决github md文件中图片无法加载问题，使用镜像网址重新生成一个图片地址可用的md文件
// @author       口吃者
// @match        https://github.com/*
// @match        https://www.toolhelper.cn/Code/Markdown*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @require      https://update.greasyfork.org/scripts/498507/1398070/sweetalert2.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523156/github%20md%E6%96%87%E4%BB%B6%E5%9B%BE%E7%89%87%E6%97%A0%E6%B3%95%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/523156/github%20md%E6%96%87%E4%BB%B6%E5%9B%BE%E7%89%87%E6%97%A0%E6%B3%95%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==
var markdown01Url = 'https://www.toolhelper.cn/Code/Markdown';
(function () {
    'use strict';
    /* 匹配 github.com 加 plain=1末尾 地址*/
    var currentUrl = window.location.href;
    var engineUrl = [
        markdown01Url
    ];
    if (!(engineUrl.includes(currentUrl))) {
        window.addEventListener('load', addPanel);
    }
    window.addEventListener('load', () => {
        checkUrlAndExecute(async function auto() {
            var textareaEle = document.querySelector("div.CodeMirror.cm-s-default.CodeMirror-wrap > div:nth-child(1) > textarea");
            // 创建一个 keydown 事件对象
            const eventSelectAll = new KeyboardEvent('keydown', {
                key: 'a', // 表示按下的键是 'a'
                code: 'KeyA', // 对应的物理键码
                keyCode: 65, // 'A' 的键码
                charCode: 0, // 非打印字符的 charCode 为 0
                ctrlKey: true, // 表示同时按下了 Ctrl 键
                bubbles: true, // 事件冒泡
                cancelable: true // 事件可取消
            });
            const eventBackSpace = new KeyboardEvent('keydown', {
                key: 'Backspace',
                code: 'Backspace',
                keyCode: 8,
                charCode: 0,
                bubbles: true,
                cancelable: true
            });
            // 触发事件到 textarea 元素
            textareaEle.dispatchEvent(eventSelectAll);
            await new Promise(resolve => setTimeout(resolve, 200));
            textareaEle.dispatchEvent(eventBackSpace);
        }, markdown01Url)
    });

    // Your code here...
})();
/** 弹出居中窗口 */
function popupCenter(url, title = '_blank', w, h) {
    // 检查参数有效性
    if (!url || typeof url !== 'string') {
        console.error('Invalid URL provided');
        return null;
    }

    // 设置默认标题和窗口尺寸
    title = title || '_blank';
    w = Math.min(w, screen.availWidth);
    h = Math.min(h, screen.availHeight);

    // 计算居中位置
    let x = (screen.availWidth - w) / 2;
    let y = (screen.availHeight - h) / 2;

    // 确保窗口不会超出屏幕边界
    x = Math.max(x, 0);
    y = Math.max(y, 0);

    // 打开新窗口
    let win;
    try {
        win = window.open(url, title, `width=${w},height=${h},left=${x},top=${y}`);
        if (win) {
            win.focus();
            // let closeNewWindow =  window.addEventListener('focus', function() {
            //     win.close();
            //     window.removeEventListener('focus', closeNewWindow);
            // });
        } else {
            throw new Error('Failed to open the window');
        }
    } catch (e) {
        console.error('Error opening the window:', e);
    }

    return win;
}
/* markdown解析网址1 */
async function markDownResolve01Popup() {
    try {
        await new Promise(resolve => setTimeout(resolve, 100));
        popupCenter(markdown01Url, 'markdown01', 1024, 800);
    } catch (error) { }
}
/* 新窗口自动化操作 */
function checkUrlAndExecute(customFunction, targetUrl) {
    // 获取当前页面的完整URL
    const currentUrl = window.location.href;
    // 检查当前URL是否与目标URL相等
    if (currentUrl === targetUrl) {
        // 如果URL匹配，则执行自定义函数
        customFunction();
    }
}
async function copyToClipboard(text) {
    try {
        // 使用 navigator.clipboard.writeText() 方法复制文本
        await navigator.clipboard.writeText(text);
        console.log('文本已复制到剪切板：', text);
    } catch (error) {
        console.error('复制失败：', error);
    }
}
async function pasteFromClipboard() {
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const text = await navigator.clipboard.readText();
        console.log('从剪切板读取的文本：', text);
    } catch (error) {
        console.error('读取剪切板失败：', error);
    }
}
function addPanel() {
    function genButton(text, foo, id, fooParams = {}) {
        let b = document.createElement('button');
        b.textContent = text;
        b.style.verticalAlign = 'inherit';
        // 使用箭头函数创建闭包来保存 fooParams 并传递给 foo
        b.addEventListener('click', () => {
            foo.call(b, ...Object.values(fooParams)); // 使用 call 方法确保 this 指向按钮对象
        });
        if (id) { b.id = id };
        return b;
    }
    async function openPanelFunc() {
        var currentUrl = window.location.href;
        if(!currentUrl.endsWith('plain=1')){
            Swal.fire({
                position: "top",
                icon: "warning",
                title: "请先点击/切换到 Code",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }
        const markdownEle = document.querySelector('#read-only-cursor-text-area');
        const markdownText = markdownEle.value;
        const regex = /!\[(.*?)\]\((.*?)\)|<img[^>]+src="([^"]+)"[^>]*>/g;
        let match;
        const imagePaths = [];

        while ((match = regex.exec(markdownText)) !== null) {
            if (match[2]) {
                // Markdown 格式
                imagePaths.push(match[2]);
            } else if (match[3]) {
                // HTML 格式
                imagePaths.push(match[3]);
            }
        }
        

        var imgUrlArray01 = window.location.href.split('/').filter((part, index, array) => {
            // 筛选条件：不是'https:', 不是空字符串, 不是'github.com', 并且不是最后一个元素
            return part !== 'https:' && part !== '' && part !== 'github.com' && index !== array.length - 1;
        });

        // 查找'blob'的索引
        const indexBlog = imgUrlArray01.indexOf('blob');

        // 如果找到了'blob'
        if (indexBlog !== -1) {
            // 使用 splice 方法在'blob'的位置删除1个元素，并插入'refs'和'heads'
            imgUrlArray01.splice(indexBlog, 1, 'refs', 'heads');
        }

        var imgUrlPreFix = imgUrlArray01.join('/');
        var finalImgUrlArray = imagePaths.map(item => {
            return `https://raw.gitmirror.com/${imgUrlPreFix}/${item}`
        })

        let finalMarkdownText = markdownText;
        let index = 0;

        finalMarkdownText = finalMarkdownText.replace(regex, (match, p1) => {
            return `![image](${finalImgUrlArray[index++]})`;
        });
        await new Promise(resolve => setTimeout(resolve, 200));
        copyToClipboard(finalMarkdownText);
        await GM.setValue('wordCloudStr', finalMarkdownText);
        markDownResolve01Popup()
    }

    let myButton = genButton('markdown', openPanelFunc, 'myButton');
    document.body.appendChild(myButton);

    var css_text = `
        #myButton {
            position: fixed;
            top: 50%;
            right: -80px; /* 修改为右侧 */
            transform: translateY(-50%);
            z-index: 1000; /* 确保按钮在最前面 */
            padding: 10px 24px;
            border-radius: 5px;
            cursor: pointer;
            border: 0;
            color: #000;
            background-color: white;
            box-shadow: rgb(0 0 0 / 5%) 0 0 8px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            font-size: 9px;
            transition: all 0.5s ease;
        }
        #myButton:hover {
            right: -20px; /* 修改为右侧显示 */
            letter-spacing: 3px;
            background-color: hsl(261deg 80% 48%);
            color: hsl(0, 0%, 100%);
            box-shadow: rgb(93 24 220) 0px 7px 29px 0px;
        }
        #myButton:active {
            letter-spacing: 3px;
            background-color: hsl(261deg 80% 48%);
            color: hsl(0, 0%, 100%);
            box-shadow: rgb(93 24 220) 0px 0px 0px 0px;
            transition: 100ms;
        }
    `
    GMaddStyle(css_text);
}
function GMaddStyle(css) {
    var myStyle = document.createElement('style');
    myStyle.textContent = css;
    var doc = document.head || document.documentElement;
    doc.appendChild(myStyle);
}
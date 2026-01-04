// ==UserScript==
// @name         蓝湖样式代码转原子化类名
// @namespace    kk
// @version      0.1
// @description  蓝湖样式代码转原子化类名，为了更方便开发时使用windicss
// @author       Sweet_KK
// @require     https://cdn.bootcss.com/jquery/2.1.2/jquery.min.js
// @match        *://lanhuapp.com/web/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lanhuapp.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454847/%E8%93%9D%E6%B9%96%E6%A0%B7%E5%BC%8F%E4%BB%A3%E7%A0%81%E8%BD%AC%E5%8E%9F%E5%AD%90%E5%8C%96%E7%B1%BB%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/454847/%E8%93%9D%E6%B9%96%E6%A0%B7%E5%BC%8F%E4%BB%A3%E7%A0%81%E8%BD%AC%E5%8E%9F%E5%AD%90%E5%8C%96%E7%B1%BB%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const main = () => {

        // 把css代码转换成class并归类
        const transformCss = (css) => {
            const windiClass = []
            const unSurport = []
            css.map(item => {
                const [name, value] = item.split(': ')
                const findRule = rules.find(rule => rule[0] === name)
                if (findRule) {
                    const findRuleValue = findRule[1]
                    if (typeof findRuleValue === 'string') {
                        windiClass.push(findRuleValue.replace('#', value))
                    } else {
                        windiClass.push(findRuleValue(value))
                    }
                } else {
                    unSurport.push(item)
                }
            })
            return {
                windiClass,
                unSurport
            }
        }

        // 把转换后的json转换成显示的html内容
        const parseHtml = (json) => {
            let classText = '';
            let unSurportText = '';
            json.windiClass.map(item => {
                classText += `${item} `
            })
            json.unSurport.map(item => {
                unSurportText += `<div class="un-surport"><input type="text" value="${item};" style="width:100%;"/></div>`
            })
            return `<h3>转化后的类名</h3><textarea id="classText" style="width:100%;padding:0;" rows="3">${classText.trim()}</textarea><button id="copyClass" style="background:#67c23a;color:#fff;padding: 7px 15px;cursor:pointer;">复制</button><p> </p><h3>暂不支持转换的样式(选中即复制)</h3><div>${unSurportText}</div>`
        }

        // 转换规则
        const rules = [
            ['width', 'w-[#]'],
            ['height', 'h-[#]'],
            ['font-size', 'text-[#]'],
            ['font-style', '#'],
            ['font-weight', 'font-#'],
            ['color', 'text-[#]'],
            ['line-height', 'leading-[#]'],
            ['border-radius', 'rounded-[#]'],
            ['border', (value) => {
                const [width, style, color] = value.split(' ')
                return `border-[${width}] border-${style} border-[${color}]`
            }],
            ['letter-spacing', 'tracking-[#]'],
            ['opacity', (value) => `opacity-${value * 100}`],
            ['text-decoration', '#'],
            ['text-align', 'text-#'],
            // ['background', ''],
            // ['font-family', ''],
            // ['-webkit-background-clip', ''],
            // ['-webkit-text-fill-color', ''],
            // ['box-shadow', ''],
        ]

        if (document.getElementById('transformCssDialog')) return

        // 按钮点击事件定义
        const action = () => {
            if (!location.hash.startsWith('#/item/project/detailDetach?')) {
                alert('没有打开设计稿')
                return
            }
            const isIOSOrAndroid = document.querySelector('.title.type.phone');
            if (isIOSOrAndroid) {
                alert('请先选择元素并把平台切换到Web')
                return
            }
            const code = document.querySelector('code.language-css');
            if (!code) {
                alert('没有选择元素 或 所选元素没有样式')
                return
            }
            const styles = code.innerText.split(';\n').filter(item => item)

            const dialog = $('#transformCssDialog')[0];
            document.querySelector('#dialogContent').innerHTML = parseHtml(transformCss(styles))
            dialog.showModal()
        }

        // 创建一个dialog
        const dialog = document.createElement('dialog');
        dialog.id = 'transformCssDialog';
        dialog.style = 'margin:0 auto;top:10vh;width:30%;border:none;';
        dialog.innerHTML = '<div id="dialogContent" style="min-height:200px;margin-bottom:20px;white-space: pre-wrap;">显示原子化class</div><form method="dialog" style="text-align:center;"><button value="cancel" style="background:#409eff;color:#fff;padding: 7px 15px;">关闭</button></form>';
        document.body.append(dialog)

        // 创建一个操作按钮
        const btn = document.createElement('button');
        btn.innerText = '显示原子化class';
        btn.style = "position:fixed;z-index:9999;bottom:30px;right:20px;cursor:pointer;background:#f56c6c;color:#fff;padding: 3px 6px;";
        document.body.append(btn)
        btn.onclick = action

        // 复制全部class
        $('#transformCssDialog').on('click', '#copyClass', () => {
            document.getElementById('classText').select()
            document.execCommand('Copy')
        })

        // 复制单条样式
        $('#transformCssDialog').on('click', '.un-surport input', (event) => {
            event.target.select()
            document.execCommand('Copy')
        })
    }

    setTimeout(() => {
        main();
    }, 500)
})();
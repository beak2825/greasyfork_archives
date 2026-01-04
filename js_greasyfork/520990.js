// ==UserScript==
// @name         bye-dude
// @namespace    https://greasyfork.org/users/866159
// @version      0.0.4
// @description  百度拜拜。功能 1、搜索时排除百家号； 2、阻止搜索框占位关键词推广。 启用或者禁用百度拜拜： 1、白名单包括 放假、万年历、[快递单号] ； 2、输入框内使用快捷键 【Ctrl+K】切换启用或者禁用。
// @author       Song
// @match        *://www.baidu.com
// @match        *://www.baidu.com/s?*
// @icon         https://www.baidu.com/favicon.ico
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520990/bye-dude.user.js
// @updateURL https://update.greasyfork.org/scripts/520990/bye-dude.meta.js
// ==/UserScript==
(function () {
    'use strict';


    // -(site:baijiahao.baidu.com)
    const excludeSites = ['baijiahao.baidu.com', 'csdn.net'];
    const ignoreWords = ['假期', '放假', '万年历'];

    /**
     *  常见快递单号特征：纯数字12-18位 / 字母+数字组合10-20位
     * @type {RegExp[]}
     */
    const expressPatterns = [
        /^\d{12,18}$/,            // 纯数字型（如顺丰、韵达）
        /^[A-Za-z0-9]{10,20}$/,   // 字母数字混合（如EMS、京东）
        /^[A-Za-z]{2}\d{9,11}$/,  // 2字母开头+数字（如圆通YT开头）
        /^SF\d{12}$/              // 顺丰特殊格式
    ];
    const byeDu = {
        enabled: true,
        toggle() {
            this.setEnabled(!this.enabled)
            return this.enabled;
        },
        setEnabled(enabled) {
            this.enabled = enabled;
            let btn = document.querySelector('.s_btn')
            if (btn) {
                btn.style.transition = 'background-color 0.4s ease';
                btn.style.borderColor = btn.style.backgroundColor = enabled ? '#04AA6D' : '#3385ff';
                setTimeout(() => btn.value = enabled ? '百度两下' : '百度一下', 300)
            } else {
                console.warn('[bye-du]', '未找到搜索按钮')
            }

        }
    }


    /**
     * 疑似快递单号
     * @param {string} num 待检测字符串
     * @returns {boolean} 是否为疑似快递单号
     */
    function likeExpressNumber(num) {
        if (num.length < 10) return false;
        return expressPatterns.some(pattern => pattern.test(num));
    }

    /**
     *
     * @param {string} word
     * @return {boolean}
     */
    function shouldIgnore(word) {
        for (let w of ignoreWords) {
            if (word.indexOf(w) > -1) {
                return true;
            }
        }
        return likeExpressNumber(word);
    }


    function beforeSubmit() {
        const input = document.querySelector('#kw');
        input.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault(); // 阻止默认行为（如浏览器搜索快捷键）
                byeDu.toggle();
                console.log('Ctrl+K 被按下');
                // 在这里添加你的自定义逻辑
            }
        })
        input.addEventListener('focus', () => {
            let w = input.value;
            if (w.length > 7) {
                excludeSites.forEach(s => {
                    w = w.replaceAll(` -site:${s}`, '');
                });
                console.info('focus 处理后', w)
                input.value = w;
            } else {
                console.info('focus value', w.length, w)
            }
        });
        document.querySelector('#form')
            .addEventListener('submit', (_e) => {
                const w = input.value;
                if (!byeDu.enabled) return;
                if (shouldIgnore(w)) return;
                const sites = excludeSites.map(s => `-site:${s}`).filter(s => w.indexOf(s) < 0);
                if (sites.length > 0) {
                    input.value = w.trim() + ' ' + sites.join(' ');
                }

            }, {capture: true});
    }

    function clearPlace() {
        const input = document.querySelector('#kw');
        input.placeholder = '';
        Object.defineProperty(input, 'placeholder', {
            set(value) {
                console.info('prevent set placeholder to', value)
            },
            get() {
                return '';
            }
        })
    }

    clearPlace();
    byeDu.setEnabled(true);
    beforeSubmit();
})();
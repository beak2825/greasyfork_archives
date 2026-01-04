// ==UserScript==
// @name         【百度百科】百科复制优化
// @namespace    http://tampermonkey.net/
// @version      2025/12/03-22:51:03
// @description  【百科】复制优化.
// @author       Youf
// @match        https://baike.baidu.com/item/*
// @match        https://baike.baidu.com/pic/*
// @match        https://baike.baidu.com/item/*?adplus
// @match        https://bkimg.cdn.bcebos.com/*autodownload*
// @match        https://baike.baidu.com/*?areyousuper
// @match        https://baike.baidu.com/item/*?fromtitle=*
// @match        https://baike.baidu.com/item/*?nothing
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license      All rights reserved
// @downloadURL https://update.greasyfork.org/scripts/493846/%E3%80%90%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E3%80%91%E7%99%BE%E7%A7%91%E5%A4%8D%E5%88%B6%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/493846/%E3%80%90%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E3%80%91%E7%99%BE%E7%A7%91%E5%A4%8D%E5%88%B6%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';


    //*************************************************************************************
    //----------------------------------------全局辅助函数
    //*************************************************************************************
    // 创建一个新的元素
    function createWebElement(tagName, id, insertPosition, options = {}) {
        /**
        * 创建网页元素
        * @param {string} tagName - 元素标签名
        * @param {string} id - 元素ID
        * @param {string|HTMLElement} insertPosition - 插入位置（选择器或DOM元素）
        * @param {Object} options - 其他选项（可选）
        * @returns {HTMLElement} 创建的元素（已存在则返回现有元素）
        */

        // 检查是否已存在同ID同类型的元素
        const existingElement = document.getElementById(id);
        if (existingElement && existingElement.tagName.toLowerCase() === tagName.toLowerCase()) {
            console.log(`元素已存在: <${tagName} id="${id}">`);
            return existingElement;
        }

        // 创建新元素
        const element = document.createElement(tagName);
        element.id = id;

        // 设置其他属性
        if (options.attributes) {
            Object.keys(options.attributes).forEach(key => {
                element.setAttribute(key, options.attributes[key]);
            });
        }

        // 设置样式
        if (options.styles) {
            Object.assign(element.style, options.styles);
        }

        // 设置类名
        if (options.className) {
            element.className = options.className;
        }

        // 设置内容
        if (options.innerHTML) {
            element.innerHTML = options.innerHTML;
        } else if (options.textContent) {
            element.textContent = options.textContent;
        }

        // 设置事件监听器
        if (options.events) {
            Object.keys(options.events).forEach(eventName => {
                element.addEventListener(eventName, options.events[eventName]);
            });
        }

        // 插入到指定位置
        let parentElement;
        if (typeof insertPosition === 'string') {
            parentElement = document.querySelector(insertPosition);
        } else if (insertPosition instanceof HTMLElement) {
            parentElement = insertPosition;
        }

        if (parentElement) {
            // 插入位置选项
            const position = options.insertPosition || 'append'; // 'append', 'prepend', 'before', 'after'

            switch (position) {
                case 'prepend':
                    parentElement.prepend(element);
                    break;
                case 'before':
                    parentElement.parentNode.insertBefore(element, parentElement);
                    break;
                case 'after':
                    parentElement.parentNode.insertBefore(element, parentElement.nextSibling);
                    break;
                case 'append':
                default:
                    parentElement.appendChild(element);
                    break;
            }
        } else {
            console.warn('未找到插入位置的元素');
        }

        return element;
    }


    // 右下按键样式
    function addButton(innerHTML, bottom, right, where, onClick) {
        var mybutton = document.createElement("div");
        // var tag = document.querySelector(where);
        where.appendChild(mybutton);
        mybutton.id = innerHTML;
        mybutton.innerHTML = innerHTML;
        // mybutton.style.position = 'absolute';
        mybutton.style.position = "fixed";
        mybutton.style.bottom = bottom;
        mybutton.style.right = right;
        mybutton.style.width = "50px";
        mybutton.style.height = "45px";
        mybutton.style.background = "black";
        mybutton.style.opacity = "1";
        mybutton.style.color = "white";
        mybutton.style.textAlign = "center";
        mybutton.style.lineHeight = "45px";
        mybutton.style.fontSize = "30px";//按钮元素的字体大小
        mybutton.style.cursor = "pointer";
        mybutton.style.zIndex = "999999";
        // 设置点击事件
        mybutton.onclick = onClick;
    }

    // 函数运行次数、时间设置函数
    function runFunction(func, interval, count) {
        let currentCount = 0;
        const intervalID = setInterval(() => {
            func();
            currentCount++;
            if (currentCount === count) {
                clearInterval(intervalID);
            }
        }, interval);
    }

    // 复制指定标签下的内容，像鼠标划选复制一样连带格式一同复制到剪切板
    function copyElementContentToClipboard(elementSelector) {
        const element = document.querySelector(elementSelector);
        if (!element) {
            console.log('[复制]未找到要复制的内容');
            return;
        }
        console.log('element',element);

        // 创建一个临时的可编辑的div元素
        const tempDiv = document.createElement('div');
        tempDiv.contentEditable = 'true';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        document.body.appendChild(tempDiv);

        // 将目标元素的内容复制到临时div中
        tempDiv.innerHTML = element.innerHTML;

        // 选择临时div的内容
        tempDiv.focus();
        document.execCommand('selectall');

        // 执行复制命令
        document.execCommand('copy');

        // 移除临时div
        document.body.removeChild(tempDiv);

        console.log('[复制]带格式正文内容已复制');
    }

    // 展开角色列表等
    function 函数_展开角色列表() {
        // 获取所有具有指定类名的元素
        let elements = document.querySelectorAll('div[class*="showAll_"]');

        // 遍历每个元素并为其添加点击事件监听器
        elements.forEach(function(element) {
            element.click();
            console.log('[展开角色列表]');
        });

    }



    //*************************************************************************************
    //----------------------------------------改杂函数
    // 清理百度百科页面中的冗余元素
    // 包括编辑按钮、多余目录、广告内容等
    // Redundant:多余的，不需要的，累赘的
    //*************************************************************************************
    function cleanRedundant() {
        const contentContainer = document.querySelector('div#J-lemma-main-wrapper');
        if (!contentContainer) {
            console.warn('未找到百科内容容器');
            return;
        }

        // 执行各项清理任务
        removeRedundantModules(contentContainer);

        /**
         * 移除冗余的功能模块
         */
        function removeRedundantModules(container) {
            const modulesToRemove = [
                // selector: 选择器, action: 操作，'hide'隐藏，''删除

                // 去除目录右侧播报按钮
                { selector: 'div[data-level="1"] span[data-tts-catalog]', action: '' },
                // 去除目录右侧编辑按钮
                { selector: 'div[data-level="1"] div[class*="editLemma_"]', action: '' },

                // 分集剧情-标题
                { selector: 'div[data-level][data-name="分集剧情"]', action: '' },
                // 分集剧情
                { selector: 'div[data-tag="module"][data-module-type="plot"]', action: 'hide' },
                // 杂志写真-标题
                { selector: 'div[data-level][data-name="杂志写真"]', action: '' },
                // 杂志写真-模块
                { selector: 'div[data-module-type="magazine"]', action: '' },

                // 所有图集类图册标签
                { selector: 'div[data-module-type="albumCollection"][data-tag="module"]', action: '' },
                // 所有视频
                { selector: 'div[data-tag="module"][data-module-type="video"]', action: '' },

                // 去除多余内容-海报
                { selector: 'div[class*="posterBottom_"]', action: '' },
                // 去除多余内容-海报
                { selector: 'div[class*="worksAndRelation_"]', action: '' },
                // 去除多余内容-词条名下的秒懂百科视频
                { selector: 'div[class*="secondContent_"] div[class*="contentBottom_"]', action: '' },
                // 去除多余内容-词条名下的秒懂百科视频
                { selector: 'div#J-related-search', action: '' },
                // 去除多余内容-右侧他说
                { selector: 'div#J-lemma-main-wrapper div#J-right-tashuo', action: '' },
                // 去除多余内容-底部他说
                { selector: 'div#J-lemma-main-wrapper div#J-bottom-tashuo', action: '' },
                // 去除多余内容-右侧广告
                // { selector: 'div[class="swiper swiper-initialized swiper-horizontal swiper-pointer-events swiper-backface-hidden"]', action: '' },
            ];

            modulesToRemove.forEach(({ selector, action }) => {
                const elements = container.querySelectorAll(selector);
                if (!elements) return;

                elements.forEach((element) => {
                    if (action === 'hide') {
                        element.style.display = 'none';
                    } else {
                        element.remove();
                    }
                });
            });
        }


        // 信息栏文字去空格
        let 信息栏 = document.querySelector('div[class*="basicInfo_"]');
        if (信息栏) {
            let dtElements = 信息栏.querySelectorAll('dt');
            dtElements.forEach(dt => {
                // 获取 dt 元素的文本内容
                let text = dt.textContent;
                // 删除中文文字中间的空格
                let processedText = text.replace(/(\S)\s+(\S)/g, '$1$2');
                // 将处理后的文本内容设置回 dt 元素
                dt.textContent = processedText;
            });
        }

    }

    //*************************************************************************************
    //----------------------------------------跳转完整url
    //*************************************************************************************
    function goAllUrl() {

        // 获取当前网页的URL
        const currentUrl = window.location.href;

        // 查询hreflang为"x-default"的link标签
        const defaultLink = document.querySelector('head > link[hreflang="x-default"]');

        // 检查是否找到了对应的link标签
        if (defaultLink) {
            const defaultHref = defaultLink.href;

            // 比较当前页面URL与查找到的href
            if (!currentUrl.includes('?adplus')
                && currentUrl !== defaultHref) {
                // 如果两者不一致，则跳转到href链接
                window.location.href = defaultHref;
            } else {
                console.log("当前页面已经是默认语言页面。");
            }
        } else {
            console.log("没有找到hreflang为'x-default'的链接。");
        }

    }




    //*************************************************************************************
    //----------------------------------------处理上下标函数
    // format：格式化
    //*************************************************************************************
    function formatSupSub(type) {
        // 获取所有参考资料上标sup元素
        let refSupList = document.querySelectorAll('span[class*="supWrap"][class*="J-supWrap"] > sup[data-tag="ref"]');

        // 遍历并隐藏这些元素
        for (let i = 0; i < refSupList.length; i++) {
            if (type === 'none') {
                refSupList[i].style.display = 'none';
            } else if (type === '') {
                refSupList[i].style.display = '';
            }
        }
        refSupList = '';

        // 下标 class中含sup_的span
        let supTagList = document.querySelectorAll('span[class*="text_"][class*="sup_"]');
        // 上标 class中含sub_的span
        let subTagList = document.querySelectorAll('span[class*="text_"][class*="sub_"]');

        // 过滤出文本内容为空格的元素，不为空的可能是上下标
        let refList = Array.from(supTagList).filter(span => span.textContent.trim() === "");

        // 遍历并隐藏这些元素r
        for (let i = 0; i < refList.length; i++) {
            if (type === 'notsee') {
                refList[i].style.display = 'none';
            } else if (type === 'cansee') {
                refList[i].style.display = '';
            }
        }
        refList = '';

        //********************
        // 角标修改
        //********************
        // 定义角标字符映射
        const superscriptMap = {
            // 数字
            '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
            '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
            // 符号
            '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
            // 小写字母
            'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ',
            'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ',
            'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ',
            'p': 'ᵖ', 'q': '۹', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ',
            'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ',
            'z': 'ᶻ',
            // 大写字母
            'A': 'ᴬ', 'B': 'ᴮ', 'C': 'ᶜ', 'D': 'ᴰ', 'E': 'ᴱ',
            'F': 'ᶠ', 'G': 'ᴳ', 'H': 'ᴴ', 'I': 'ᴵ', 'J': 'ᴶ',
            'K': 'ᴷ', 'L': 'ᴸ', 'M': 'ᴹ', 'N': 'ᴺ', 'O': 'ᴼ',
            'P': 'ᴾ', 'Q': 'Q', 'R': 'ᴿ', 'S': 'ˢ', 'T': 'ᵀ',
            'U': 'ᵁ', 'V': 'ⱽ', 'W': 'ᵂ', 'X': 'ˣ', 'Y': 'ʸ',
            'Z': 'ᶻ',
            // 希腊字母
            'α': 'ᵅ', 'β': 'ᵝ', 'γ': 'ᵞ', 'δ': 'ᵟ', 'ε': 'ᵋ',
            'θ': 'ᶿ', 'ι': 'ᶥ', 'φ': 'ᵠ', 'χ': 'ᵡ', 'ω': 'ᵚ'
        };

        const subscriptMap = {
            // 数字
            '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
            '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
            // 符号
            '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
            // 小写字母
            'a': 'ₐ', 'b': 'ᵦ', 'c': '꜀', 'd': 'ᑯ', 'e': 'ₑ',
            'f': 'բ', 'g': 'ᵧ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ',
            'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ',
            'p': 'ₚ', 'q': '૧', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ',
            'u': 'ᵤ', 'v': 'ᵥ', 'w': 'w', 'x': 'ₓ', 'y': 'ᵧ',
            'z': '₂',
            // 大写字母
            'A': 'ₐ', 'B': 'ᵦ', 'C': '꜀', 'D': 'ᑯ', 'E': 'ₑ',
            'F': 'բ', 'G': 'ᵧ', 'H': 'ₕ', 'I': 'ᵢ', 'J': 'ⱼ',
            'K': 'ₖ', 'L': 'ₗ', 'M': 'ₘ', 'N': 'ₙ', 'O': 'ₒ',
            'P': 'ₚ', 'Q': '૧', 'R': 'ᵣ', 'S': 'ₛ', 'T': 'ₜ',
            'U': 'ᵤ', 'V': 'ᵥ', 'W': 'w', 'X': 'ₓ', 'Y': 'ᵧ',
            'Z': '₂',
            // 希腊字母
            'α': 'ᵅ', 'β': 'ᵝ', 'γ': 'ᵞ', 'δ': 'ᵟ', 'ε': 'ᵋ',
            'θ': 'ᶿ', 'ι': 'ᶥ', 'φ': 'ᵠ', 'χ': 'ᵡ', 'ω': 'ᵚ'
        };

        // 处理上标
        let supList = Array.from(supTagList).filter(span => /^[0-9a-zA-Zα-ω+-=()]+$/.test(span.textContent.trim()));
        supList.forEach(span => {
            const originalText = span.textContent.trim();
            let superscriptText = '';

            // 遍历每个字符并替换为上标字符
            for (let char of originalText) {
                superscriptText += superscriptMap[char] || char;
            }

            span.textContent = superscriptText; // 替换内容
            span.className = span.className.replace(/\bsup_[0-9a-zA-Z_]{5}\b/, '').trim(); // 移除 sup_ 部分
        });

        // 处理下标
        let subList = Array.from(subTagList).filter(span => /^[0-9a-zA-Zα-ω+-=()]+$/.test(span.textContent.trim()));
        subList.forEach(span => {
            const originalText = span.textContent.trim();
            let subscriptText = '';

            // 遍历每个字符并替换为下标字符
            for (let char of originalText) {
                subscriptText += subscriptMap[char] || char;
            }

            span.textContent = subscriptText; // 替换内容
            span.className = span.className.replace(/\bsub_[0-9a-zA-Z_]{5}\b/, '').trim(); // 移除 sub_ 部分
        });

        // 本人 personalTag_Allop J-psl-tag
        let sups = document.querySelectorAll('sup[class*="personalTag_"]');

        // 遍历并隐藏这些元素
        for (let i = 0; i < sups.length; i++) {
            if (type === 'notsee') {
                sups[i].style.display = 'none';
            } else if (type === 'cansee') {
                sups[i].style.display = '';
            }
        }
        sups = '';

    }

    //*************************************************************************************
    //----------------------------------------隐函数;有序目录切换序号可见性
    // toggleOrderNumberVisibility切换序号可见性
    //*************************************************************************************
    function toggleOrderNumberVisibility(type) {
        // 切换序号可见性
        // type:0隐藏，1展示
        // 获取所有class包含 'supWrap_xbcoi' 和 'J-supWrap' 的span元素
        let spans = document.querySelectorAll('span[class*="orderNum_"]');

        // 遍历并隐藏这些元素
        if (type == 0) {//0隐藏
            for (let i = 0; i < spans.length; i++) {

                if (spans[i].style.display != 'none') {
                    spans[i].style.display = 'none';
                }
            }
        }
        else if (type == 1) {//1展示
            for (let i = 0; i < spans.length; i++) {
                if (spans[i].style.display = 'none') {
                    spans[i].style.display = '';
                }

            }
        }
        else {//反转
            for (let i = 0; i < spans.length; i++) {
                if (spans[i].style.display != 'none') {
                    spans[i].style.display = 'none';
                }else if (spans[i].style.display = 'none') {
                    spans[i].style.display = '';
                }

            }
        }
        spans = '';

    }

    //*************************************************************************************
    //----------------------------------------切换边栏目录属性
    //*************************************************************************************
    function toggleSideCatalog() {
        let sideCatalog = document.querySelector("div#J-side-catalog");
        sideCatalog.style.display = 'block';
        sideCatalog.style.height = '80%';

        let listWrapper = sideCatalog.querySelector('div[class*="listWrapper_"]');
        listWrapper.style.height = '100%';

        let list = listWrapper.querySelector('div[class*="list_"]');
        list.style.height = '100%';
    }



    //*************************************************************************************
    //----------------------------------------内容修正函数
    //*************************************************************************************
    function formatTextContent(tag) {
        let contentTag = tag;
        console.log('formatTextContent contentTag',contentTag)

        // 定义标点符号常量
        const BDFH_B = '。，！？；：“”‘’、【】《》（）～…';
        const BDFH_S = '+%\\/';
        const BDFH_N = '0-9';
        const BDFH_E = 'a-zA-Z';
        const BDFH_C = '\u4e00-\u9fa5';
        const BDFH_L = '+%\\/';

        const BDFH_BSNE = BDFH_B + BDFH_S + BDFH_N + BDFH_E;
        const PUNCTUATION = '。，！？；：“”‘’、【】《》（）～%…';

        const symbolMap = {
            ':': '：',
            ',': '，',
            '.': '。',
            ';': '；',
            '?': '？',
            '!': '！'
        };

        // 配置对象：便于维护的正则规则列表
        const regexRules = [
            // 匹配半角括号内存在中文的情况
            {
                // pattern: /\s*\(\s*([^)]*[${PUNCTUATION}]+[^)]*)\s*\)\s*/g,
                // pattern: new RegExp(`\\s*\(\s*([^)]*[${BDFH_CN}]+[^)]*)\s*\)\s*`, 'g'),
                pattern: new RegExp(`\\s*\\(\\s*([^)]*[${BDFH_C}]+[^)]*)\\s*\\)\\s*`, 'g'),
                replacement: '（$1）'
            },
            // 匹配书名号之间的空格
            {
                pattern: /《([^》]+)》\s+《([^》]+)》/g,
                replacement: '《$1》《$2》'
            },
            // 标点符号前后有空格
            {
                pattern: new RegExp(`\\s+([${BDFH_B}${BDFH_S}])`, 'g'),
                replacement: '$1'
            },
            {
                pattern: new RegExp(`([${BDFH_B}${BDFH_S}])\\s+`, 'g'),
                replacement: '$1'
            },

            // 数字与其他之间有空格
            {
                pattern: new RegExp(`([${BDFH_C}${BDFH_B}${BDFH_S}])\\s+([${BDFH_N}])`, 'g'),
                replacement: '$1$2'
            },
            {
                pattern: new RegExp(`([${BDFH_N}])\\s+([${BDFH_E}${BDFH_B}${BDFH_S}])`, 'g'),
                replacement: '$1$2'
            },

            // 汉字与其他之间有空格
            {
                pattern: new RegExp(`([${BDFH_BSNE}])\\s+([${BDFH_C}])`, 'g'),
                replacement: '$1$2'
            },
            {
                pattern: new RegExp(`([${BDFH_C}])\\s+([${BDFH_BSNE}])`, 'g'),
                replacement: '$1$2'
            },


            // 匹配连续多个空格
            {
                pattern: /\s{2,}/g,
                replacement: ' '
            },

            // 匹配【李玟: 】
            // 将中文后的半角符号转换为全角
            {
                pattern: new RegExp(`([${BDFH_C}])\\s*([:,;.!?])\\s*`, 'g'),
                replacement: function(match, chineseChar, symbol) {
                    return chineseChar + (symbolMap[symbol] || symbol);
                }
            },
            //             {
            //                 pattern: new RegExp(`\\s*([:,;.!?])\\s*([${BDFH_C}])`, 'g'),
            //                 replacement: function(match, chineseChar, symbol) {
            //                     return (symbolMap[symbol] || symbol) + chineseChar;
            //                 }
            //             },
        ];


        let startTags = contentTag?.querySelectorAll(
            'div[class*="MARK_MODULE"][data-tag="paragraph"][data-idx]' // 信息栏、正文
        );
        console.log('formatTextContent startTags',startTags)

        // 优化1：提前检查规则是否需要应用
        const shouldApplyRules = (text) => {
            return regexRules.some(rule => rule.pattern.test(text));
        };

        startTags?.forEach(tagElement => {
            let originalText = tagElement.innerText || '';
            // console.log('内容修正text 前: ', originalText);

            // 优化2：只有需要处理时才应用所有规则
            if (shouldApplyRules(originalText)) {
                let text = originalText;
                regexRules.forEach(rule => {
                    text = text.replace(rule.pattern, rule.replacement);
                });

                // 优化3：只有真正改变时才更新DOM
                if (text !== originalText) {
                    tagElement.innerText = text;
                }
            }
            // console.log('内容修正text 后: ', tagElement.innerText);

            // 优化4：使用更高效的空白检查
            if (tagElement.innerText.trim() === '') {
                tagElement.remove();
            }
        });
    }


    //*************************************************************************************
    //----------------------------------------改参函数
    //*************************************************************************************
    // 对url中的一些内容进行修改格式化
    function formatReferenceUrl(url) {
        if (!url) return url;

        let formattedUrl = url.replace(/^"([^"]*)"$/,`$1`).trim();

        // 修改后的内容
        let fromContent = 'GCS';

        // URL格式化规则配置表
        const urlFormatRules = [
            {
                // 规则描述：修改时光网旧链接
                urlPattern: /^http:\/\/movie\.mtime\.com.*\.html/,
                replacePattern: /\.html.*/,
                replacement: ''
            },
            {
                // 规则描述：更新国家统计局域名路径
                urlPattern: /^https?:\/\/www\.stats\.gov\.cn\/tjsj\/tjbz/,
                replacePattern: /www\.stats\.gov\.cn\/tjsj\/tjbz/,
                replacement: 'www.stats.gov.cn/sj/tjbz'
            },
            {
                // 规则描述：追踪链接去除
                urlPattern: new RegExp(`
                    ^https?:\\/\\/
                    [a-zA-Z]+\\.bilibili\\.com
                    |tv\\.cctv\\.com
                    |www\\.iqiyi\\.com
                    |www\\.le\\.com
                    |v\\.qq\\.com
                    |y\\.qq\\.com
                    |www\\.1905\\.com
                    |www\\.ixigua\\.com
                    |v\\.youku\\.com
                    |weibo\\.com
                    |ent\\.sina\\.com\\.cn
                    .*[\\?&]
                `.replace(/\s+/g, '')),
                replacePattern: new RegExp(`
                    ([\\?&])(
                        (api_source
                        |c
                        |ch
                        |event2
                        |from
                        |fr
                        |fv
                        |ptag
                        |pagetype
                        |refer_flag
                        |srcfrom
                        |site
                        |spm
                        |spm_id_from
                        |s
                        |songtype
                        |tpa
                        |topnav
                        |topsug
                        |utm_source
                        |vfm
                        |vfrm
                        |vfrmblk
                        |vfrmrs
                        |wvr
                        |__hz
                        |__t
                        |_out
                        |_k
                        )=(?!${fromContent})[0-9a-zA-Z_\\-\\.]*
                    |
                        rfr
                        =(?!${fromContent})[0-9a-zA-Z_\\-\\.\\/:]*
                    )`.replace(/\s+/g, ''), 'g'
                                          ),
                replacement: function(match, $1, $2, $3, $4) {
                    const paramName = $3 || $4; // 获取有效的参数名
                    return $1 + paramName + '=' + fromContent;
                }
            },
            {
                // 规则描述：追踪链接去除
                urlPattern: new RegExp(`
                    ^https?:\\/\\/
                    |ent\\.sina\\.com\\.cn
                    .*[\\?&]
                `.replace(/\s+/g, '')),
                replacePattern: new RegExp(`
                    ([\\?&])(
                        from
                        |c
                        |wm
                        )=(?!${fromContent})[0-9a-zA-Z_\\-\\.]*
                   `.replace(/\s+/g, ''), 'g'
                                          ),
                replacement: `$1$2=${fromContent}`
            },
            {
                // 规则描述：追踪链接去除
                urlPattern: new RegExp(`
                    ^https?:\\/\\/
                    content-static\\.cctvnews\\.cctv\\.com
                    .*[\\?&]
                `.replace(/\s+/g, '')),
                replacePattern: new RegExp(`
                    ([\\?&])(
                        toc_style_id
                        |share_to
                        |track_id
                        )=(?!${fromContent})[0-9a-zA-Z_]*
                    `.replace(/\s+/g, ''), 'g'
                                          ),
                replacement: `$1$2=${fromContent}`
            },
            {
                // 规则描述：追踪链接去除
                urlPattern: new RegExp(`
                    ^https?:\\/\\/
                    wenhui\\.whb\\.cn
                    .*[\\?&]
                `.replace(/\s+/g, '')),
                replacePattern: new RegExp(`
                    ([\\?&])(
                        tt_group_id
                        )=(?!${fromContent})[0-9a-zA-Z_]*
                    `.replace(/\s+/g, ''), 'g'
                                          ),
                replacement: `$1$2=${fromContent}`
            },
        ];


        // 遍历所有规则，应用匹配的规则
        for (const rule of urlFormatRules) {
            if (rule.urlPattern.test(formattedUrl)) {
                let previousUrl;
                do {
                    previousUrl = formattedUrl;
                    formattedUrl = formattedUrl.replace(rule.replacePattern, rule.replacement);
                } while (formattedUrl !== previousUrl); // 直到不再变化
            }
        }

        return formattedUrl;
    }


    function changeReference_ready() {//修改参考资料的准备工作
        //定义一个window.PAGE_DATA.userReferenceData
        window.Reference_DATA = {
            userReferenceData: [
                { },
            ]
        };
        //定义的window.PAGE_DATA.userReferenceData使用window.PAGE_DATA.reference的数据
        window.Reference_DATA.userReferenceData = window.PAGE_DATA.reference;

        function getUrl() {
            // 假设 dataReference 已经存在
            let dataReference = window.PAGE_DATA.reference;

            // 使用异步函数来处理每一项的请求
            async function updateRefUrl() {
                for (let i = 0; i < dataReference.length; i++) {
                    let encodeUrl = dataReference[i].encodeUrl;
                    let apiUrl = `https://baike.baidu.com/lemma/api/reference/check?encodeUrl=${encodeUrl}`;

                    try {
                        // 发起异步请求
                        let response = await fetch(apiUrl);
                        if (response.ok) {

                            let json = await response.json();

                            // 获取 refUrl 并动态添加到 dataReference 中
                            if (json && json.data.refUrl) {
                                //dataReference[i].refUrl = json.data.refUrl;

                                window.Reference_DATA.userReferenceData[i].baseUrl = json.data.refUrl;
                                window.Reference_DATA.userReferenceData[i].trueUrl = formatReferenceUrl(json.data.refUrl);

                                // console.log(`json.data.refUrl`, json.data.refUrl);
                            }
                        } else {
                            console.error(`Error fetching data for ${encodeUrl}`);
                        }
                    } catch (error) {
                        console.error(`Error fetching data for ${encodeUrl}:`, error);
                    }
                }

            }

            // 执行函数
            updateRefUrl();


        }


        /*    "reference":[
        {"type":3,"text":"中",                                                "index":1,"uuid":"sVFqjecyY0sZ"},
        {"type":1,            "title":"朗","site":"中","refDate":"2022-01-27","index":2,"uuid":"sVFr1hxWqq7C","encodeUrl":"53"},
        {"type":3,"text":"国",                                                "index":3,"uuid":"sVFr5ySeXXJs"}
        ]
         */
        getUrl();


        console.log('window.Reference_DATA.userReferenceData:',window.Reference_DATA.userReferenceData);
        console.log('window.PAGE_DATA.reference:',window.PAGE_DATA.reference);


    }


    // 创建网页存放数据的元素
    function changeReference(){
        // 把数据放到网页标签中方便获取
        function changeReference_addData() {
            // 1. 创建一个新的 div 元素
            let newDiv = document.createElement("script");
            // 2. 为新 div 设置属性、内容或者样式（可选）
            newDiv.id = "addData"; // 设置 id
            //newDiv.innerHTML = window.Reference_DATA.userReferenceData; // 设置div的内容
            // let addDataText = JSON.stringify(window.Reference_DATA.userReferenceData, null, 2); // 将对象转为 JSON 字符串，并格式化
            let addDataText = window.Reference_DATA.userReferenceData.map(item => {
                return `"type": ${item.type}, "title": "${item.title}", "site": "${item.site}", "refDate": "${item.refDate}", "index": ${item.index}, "uuid": "${item.uuid}", "encodeUrl": "${item.encodeUrl}", "baseUrl": "${item.baseUrl}", "trueUrl": "${item.trueUrl}"`;
            }).join("\n");

            newDiv.innerHTML = addDataText;

            let addDataTag = document.querySelector("#addData");
            if(addDataTag) {
                addDataTag.remove();
            }

            // 3. 将新 div 添加到页面中的某个父元素
            document.body.appendChild(newDiv); // 将 div 添加到 body 元素的末尾

        }
        changeReference_addData();


        function changeReference_addTable(ckzl_supTag_this) {
            //参考资料序号
            let ckzl_ListNum = parseInt(ckzl_supTag_this.id, 10) - 1;


            //获取当前参考资料信息
            /*    "reference":[
        {"type":3,"text":"中",                                                "index":1,"uuid":"sVFqjecyY0sZ"},
        {"type":1,            "title":"朗","site":"中","refDate":"2022-01-27","index":2,"uuid":"sVFr1hxWqq7C","encodeUrl":"53"},baseUrl trueUrl
        {"type":3,"text":"国",                                                "index":3,"uuid":"sVFr5ySeXXJs"}
        ]
         */

            if (window.Reference_DATA.userReferenceData[ckzl_ListNum].type === 1 &&//是网络参考资料
                typeof window.Reference_DATA.userReferenceData[ckzl_ListNum].trueUrl !== 'undefined' &&//参考资料网址不为空
                !window.Reference_DATA.userReferenceData[ckzl_ListNum].trueUrl.includes('baidu')//参考资料网址不含百度
               ) {

                let ckzl_thisTag_title = window.Reference_DATA.userReferenceData[ckzl_ListNum].title;//文章标题
                let ckzl_thisTag_trueUrl = window.Reference_DATA.userReferenceData[ckzl_ListNum].trueUrl;//来源网址
                let ckzl_thisTag_site = window.Reference_DATA.userReferenceData[ckzl_ListNum].site;//网站名称

                // 打印参考资料信息
                console.log('ckzl_thisTag_trueUrl:',ckzl_thisTag_trueUrl)
                console.log('ckzl_thisTag_title:',ckzl_thisTag_title)
                console.log('ckzl_thisTag_site:',ckzl_thisTag_site)

                //当前参考资料信息
                let text = [, ckzl_thisTag_trueUrl, ckzl_thisTag_title, ckzl_thisTag_site]

                // 如果已有div则删除
                if (ckzl_supTag_this.parentNode.querySelector(`div[id="\[${ckzl_ListNum + 1}\]"]`)) {
                    ckzl_supTag_this.parentNode.querySelector(`div[id="\[${ckzl_ListNum + 1}\]"]`).remove();
                }

                // 创建容器div
                var newContainerDiv = document.createElement('div');
                newContainerDiv.style.display = 'flex'; // 使用Flex布局使子元素在同一行显示
                newContainerDiv.id = `\[${ckzl_ListNum + 1}\]`;

                for (let m = 0; m < 4; m++) {
                    let childDiv = document.createElement('div');
                    childDiv.style.border = '1px solid #000'; // 设置样式
                    childDiv.style.padding = '8px';
                    childDiv.style.width = '150px'; // 新增这一行来设定宽度
                    childDiv.style.zIndex = "999999";
                    childDiv.textContent = text[m]; // 文本内容
                    childDiv.sandbox = "allow-scripts allow-top-navigation-by-user-activation";
                    newContainerDiv.appendChild(childDiv);

                    // 定义一个变量来存储最后一个被点击的按钮
                    let lastClickedButton = null;

                    if (m === 0) {
                        // 创建按钮元素
                        const 按钮 = document.createElement('button');
                        按钮.textContent = '点击打开';
                        按钮.style.width = '100px'; // 设置宽度为100像素
                        按钮.style.height = '40px'; // 设置高度为50像素

                        // 给按钮添加点击事件处理程序
                        按钮.addEventListener('click', function(event) {
                            event.preventDefault(); // 阻止默认行为

                            const newWindow = window.open(ckzl_thisTag_trueUrl, '_blank', 'width=500,height=500');

                            // 关闭新窗口
                            setTimeout(function() {
                                newWindow.close();
                            }, 3500);

                            // 更新按钮颜色
                            if (lastClickedButton !== this) {
                                // 记录当前点击的按钮
                                lastClickedButton = this;
                                // 将当前点击的按钮背景设为红色
                                lastClickedButton.style.backgroundColor = 'red';
                            }

                            // 阻止滚动到按钮位置
                            event.stopPropagation(); // 阻止事件冒泡可能导致的滚动
                        });

                        // 将按钮添加到页面中的某个元素中
                        childDiv.appendChild(按钮);
                    } else if (m >= 1 && m <= 3) {
                        // 创建按钮元素
                        const 按钮 = document.createElement('button');
                        按钮.textContent = '复制文本';
                        按钮.style.width = '100px'; // 设置宽度为100像素

                        // 给按钮添加点击事件处理程序
                        按钮.addEventListener('click', function(event) {
                            event.preventDefault(); // 阻止默认行为

                            // 创建一个新的 textarea 元素，用于复制文本
                            const textarea = document.createElement('textarea');
                            textarea.value = text[m]; // 设置文本内容

                            // 将 textarea 添加到页面中，但是在视觉上隐藏它
                            textarea.style.position = 'absolute';
                            textarea.style.left = '-9999px';
                            document.body.appendChild(textarea);

                            // 选择并复制文本
                            textarea.select();
                            document.execCommand('copy');

                            // 删除 textarea 元素
                            document.body.removeChild(textarea);

                            // 提示复制成功
                            console.log('文本已复制: ' + text[m]);

                            // 更新按钮颜色
                            if (lastClickedButton !== this) {
                                // 记录当前点击的按钮
                                lastClickedButton = this;
                                // 将当前点击的按钮背景设为红色
                                lastClickedButton.style.backgroundColor = 'red';
                            }

                            // 阻止滚动到按钮位置
                            event.stopPropagation(); // 阻止事件冒泡可能导致的滚动
                        });

                        // 创建一个新的 div 元素用于放置按钮
                        const buttonDiv = document.createElement('div');
                        buttonDiv.style.zIndex = "999999";
                        buttonDiv.appendChild(按钮);

                        // 将按钮添加到页面中的某个元素中
                        childDiv.appendChild(buttonDiv);
                    }
                }

                // 将新创建的div插入到目标元素的父元素之后
                ckzl_supTag_this.parentNode.insertBefore(newContainerDiv, ckzl_supTag_this.nextSibling);
            }
        }


        // 获取所有sup  em元素
        let ckzl_supTag = document.querySelectorAll('span[class*="supWrap"][class*="J-supWrap"] > sup > em');
        for (let i = 0; i < ckzl_supTag.length; i++) {
            ckzl_supTag[i].id = ckzl_supTag[i].id.replace('sup-', '');//参考资料引用的id
            let ckzl_ListNum = parseInt(ckzl_supTag[i].id, 10) - 1;

            //如果是网络参考资料才添加按钮
            if (window.Reference_DATA.userReferenceData[ckzl_ListNum].type === 1) {
                changeReference_addTable(ckzl_supTag[i]);
            }
        };
    }






    //*************************************************************************************
    //----------------------------------------显示图片、参考资料数量
    // createContentStatsHeader 创建内容统计头部信息
    //*************************************************************************************
    function createContentStatsHeader() {
        // 显示图片数量
        let main = document.querySelector("div.J-lemma-content");
        //  console.log('main',main);

        // 图册中的图片数量
        function numCanSee_imgsTag() {
            let images_card_list = main.querySelectorAll('div[data-module-type="album"]');
            // console.log('images_card_list',images_card_list);

            let images_num_imgsTag = 0;

            if (images_card_list) {

                images_card_list.forEach((image_card) => {
                    let image_num_this = 0;

                    let image_num_this_many = image_card.querySelector('span[class*="total_"]');
                    let image_num_this_many_hen = image_card.querySelector('div[class*="albumSwiper_"]');
                    if (image_num_this_many) {
                        image_num_this = image_num_this_many.textContent.trim().replace(/^\(/,'').replace(/张\)$/,'');
                        // 将字符串转换为数字
                        image_num_this = parseInt(image_num_this, 10);
                    }
                    else if (image_num_this_many_hen) {
                        let image_num_this_many_hen_num = image_num_this_many_hen.querySelectorAll('img');
                        image_num_this = image_num_this_many_hen_num.length;
                    }

                    images_num_imgsTag = images_num_imgsTag + image_num_this;
                });
            }
            // 返回计算所得的总数
            return images_num_imgsTag;
        }

        // 图片中的图片数量
        function numCanSee_imgTag() {
            let image_card_list = main.querySelectorAll('div[class*="lemmaPicture_"]');
            // console.log('image_card_list',image_card_list);

            let image_num_imgTag = 0;

            if (image_card_list) {

                image_card_list.forEach((image_card) => {
                    let image_num_this = 0;

                    image_num_this = 1;

                    image_num_imgTag = image_num_imgTag + image_num_this;
                    //  console.log('image_num_this',image_num_this);
                    // console.log('image_num_imgTag',image_num_imgTag);

                });
            }
            // 返回计算所得的总数
            return image_num_imgTag;
        }

        // 表格中的图片数量
        function numCanSee_tableTag() {
            let table_card_list = main.querySelectorAll('div[class="table-baike-wrap"]');

            let table_num_imgTag = 0;

            if (table_card_list) {

                table_card_list.forEach((table_card) => {
                    let image_num_this = 0;

                    let image_num_this_many = table_card.querySelectorAll("div.table-image-wrap > div.poster-wrap > div.poster-image");
                    if (image_num_this_many) {
                        image_num_this += image_num_this_many.length;
                    }
                    else{
                        image_num_this += 0;
                    }

                    table_num_imgTag = table_num_imgTag + image_num_this;
                    //  console.log('image_num_this',image_num_this);
                    //  console.log('table_num_imgTag',table_num_imgTag);

                });
            }
            // 返回计算所得的总数
            return table_num_imgTag;
        }

        // 模板的类型
        function getModuleTypes() {
            const excludeSet = new Set(['album', 'albumCollection', 'actor', 'staff', 'table', 'video', 'magazine', 'award', 'map']);

            return Array.from(
                document.querySelectorAll('.J-lemma-content [data-tag="module"]')
            )
                .filter(element => element.hasAttribute('data-module-type'))
                .map(element => element.getAttribute('data-module-type'))
                .filter(value => !excludeSet.has(value));
        }


        // 模板的数量
        function numCanSee_modeTag() {
            let mode_card_list = main.querySelectorAll('div[class="imagetextlist-card-inner"]');
            //  console.log('mode_card_list',mode_card_list);
            let mode_num_imgTag = 0;

            if (mode_card_list) {
                mode_card_list.forEach((mode_card) => {
                    let mode_num_this = 0;

                    let mode_type_tag = mode_card.querySelector('div[class*="card-content-type"]');
                    let mode_type = mode_type_tag.classList.value;
                    switch (mode_type) {
                        case 'card-content-type1':
                            mode_num_this = mode_type_tag.querySelectorAll('div[class="cardinfo-image"]').length;
                            break;
                        case 'card-content-type2':
                            mode_num_this = mode_type_tag.querySelectorAll('div[class="cardinfo-image"]').length;
                            break;
                        case 'card-content-type3':
                            mode_num_this = mode_type_tag.querySelectorAll('div[class="cardinfo-image"]').length;
                            break;
                        default:
                            mode_num_this += 0;
                    }

                    mode_num_imgTag = mode_num_imgTag + mode_num_this;
                    //  console.log('image_num_this',image_num_this);
                    //  console.log('mode_num_imgTag',mode_num_imgTag);
                });
            }
            // 返回计算所得的总数
            return mode_num_imgTag;
        }


        // 参考资料数量
        function numCanSee_referencesTag() {
            // 显示参考资料数量
            let references_num = window.PAGE_DATA?.reference?.length;
            // 返回计算所得的总数
            return references_num;
        }


        // 信息栏数量window.PAGE_DATA?.card
        function numCanSee_basicTag() {
            // 获取左右两侧数据
            const leftData = window.PAGE_DATA?.card?.left || [];
            const rightData = window.PAGE_DATA?.card?.right || [];

            // 合并两侧数据
            const allData = [...leftData, ...rightData];

            // 使用Set来存储唯一的key-title组合
            const uniqueCombinations = new Set();

            // 遍历所有项目，将key-title组合添加到Set中
            allData.forEach(item => {
                if (item && item.key !== undefined && item.title !== undefined) {
                    const combination = `${item.key}|${item.title}`;
                    uniqueCombinations.add(combination);
                }
            });

            // 返回不同key-title组合的数量
            return uniqueCombinations.size;
        }


        let image_num_imgs = numCanSee_imgsTag();
        let image_num_img = numCanSee_imgTag();
        let image_num_table = numCanSee_tableTag();
        let image_num_mode = numCanSee_modeTag();


        let image_num_all = numCanSee_imgsTag() + numCanSee_imgTag() + numCanSee_tableTag() + numCanSee_modeTag();


        // 信息栏数量window.PAGE_DATA?.card
        function numCanSee_updateTimeTag() {
            // 时间转换函数
            function timestampToLocalTime(timestamp) {
                const date = new Date(timestamp * 1000);
                return date.toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                }).replace(/\//g, '-');
            }

            // 获取更新时间
            let updateTimeUnix = window.PAGE_DATA?.updateTime;
            let updateTime = timestampToLocalTime(updateTimeUnix);

            // 返回更新时间
            return updateTime;
        }


        //显示

        // 监听#J-lemma-main-wrapper的变化并更新顶栏内容
        function setupHeaderObserver() {
            const fixedWrapper = document.querySelector('.fixedWrapper');
            if (!fixedWrapper) return;

            // 1. 强制显示顶栏
            fixedWrapper.classList.remove('hide', 'fadeOut');
            fixedWrapper.classList.add('show', 'fadeIn');

            // 2. 移除userInfo_区域
            const userInfo = fixedWrapper.querySelector('[class*="userInfo_"]');
            //if (userInfo) userInfo.remove();

            // 3. 创建全新的自定义容器（不干扰原有toolBtns_）
            const originalToolBtns = fixedWrapper.querySelector('[class*="toolBtns_"]');
            let customContainer = document.querySelector('#my-custom-tool-container');

            // 如果自定义容器不存在，创建新的
            if (!customContainer) {
                customContainer = document.createElement('div');
                customContainer.id = 'my-custom-tool-container';
                customContainer.className = 'my-custom-tool-container';

                // 复制原toolBtns的样式和位置
                if (originalToolBtns) {
                    // 复制内联样式
                    const computedStyle = window.getComputedStyle(originalToolBtns);
                    for (let i = 0; i < computedStyle.length; i++) {
                        const prop = computedStyle[i];
                        customContainer.style[prop] = computedStyle[prop];
                    }

                    // 确保显示和定位
                    customContainer.style.display = 'flex';
                    customContainer.style.alignItems = 'center';
                    customContainer.style.marginLeft = 'auto';

                    // 插入到原toolBtns的位置
                    originalToolBtns.parentNode.insertBefore(customContainer, originalToolBtns.nextSibling);
                } else {
                    // 如果没有原toolBtns，添加到fixedWrapper末尾
                    fixedWrapper.appendChild(customContainer);
                }
            }

            // 4. 初始更新内容
            updateHeaderContent();

            // 5. 监听#J-lemma-main-wrapper的变化
            const lemmaWrapper = document.querySelector('#J-lemma-main-wrapper');
            if (lemmaWrapper) {
                const observer = new MutationObserver(function(mutations) {
                    // 防抖处理，避免频繁更新
                    clearTimeout(window.headerUpdateTimeout);
                    window.headerUpdateTimeout = setTimeout(() => {
                        updateHeaderContent();
                    }, 100);
                });

                observer.observe(lemmaWrapper, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    characterData: true
                });
            }

            // 6. 添加样式
            addHeaderStyles();
        }

        // 获取更新时间背景色
        function getUpdateTimeColor(updateTime) {
            if (!updateTime || updateTime === '未知') return '';

            try {
                const now = new Date();
                const currentYear = now.getFullYear();
                const currentMonth = now.getMonth() + 1;
                const currentDay = now.getDate();

                // 解析更新时间
                const updateDate = new Date(updateTime);
                if (isNaN(updateDate.getTime())) return '';

                // 计算当前周期
                let cycleStart, cycleEnd;
                let warningStart, warningEnd;

                if (currentDay >= 11) {
                    // 当前是11日到月底：当前周期为本月11日到下月10日
                    cycleStart = new Date(currentYear, currentMonth - 1, 11);
                    cycleEnd = new Date(currentYear, currentMonth, 10);
                    // 警告周期为本月1-10日
                    warningStart = new Date(currentYear, currentMonth - 1, 1);
                    warningEnd = new Date(currentYear, currentMonth - 1, 10);
                } else {
                    // 当前是1日到10日：当前周期为上月11日到本月10日
                    cycleStart = new Date(currentYear, currentMonth - 2, 11);
                    cycleEnd = new Date(currentYear, currentMonth - 1, 10);
                    // 警告周期为上月1-10日
                    warningStart = new Date(currentYear, currentMonth - 2, 1);
                    warningEnd = new Date(currentYear, currentMonth - 2, 10);
                }

                // 检查更新时间是否在当前周期内
                if (updateDate >= cycleStart && updateDate <= cycleEnd) {
                    return 'background: #FF0000; color: white;'; // 红色危险色
                }

                // 检查是否在警告周期内（周期之前的1-10日）
                if (updateDate >= warningStart && updateDate <= warningEnd) {
                    return 'background: #FF9900; color: white;'; // 橙色警告色
                }

                // 更早的时间显示蓝色安全色
                return 'background: #00FF00; color: white;'; // 绿色安全色

            } catch (error) {
                console.error('解析更新时间出错:', error);
                return '';
            }
        }

        // 更新顶栏内容
        function updateHeaderContent() {
            const customContainer = document.querySelector('#my-custom-tool-container');
            const updateTime = numCanSee_updateTimeTag() || '未知';
            const timeColorStyle = getUpdateTimeColor(updateTime);

            if (customContainer) {
                customContainer.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1px; font-size: 14px; color: #333; flex-wrap: wrap;">
                <span title="信息数量">信息:${numCanSee_basicTag() || 0}</span>
                <span title="图片数量">图片:${image_num_all || 0}</span>
                <span title="参考资料数量">参考:${numCanSee_referencesTag() || 0}</span>
                <span title="模块数量">模块:${image_num_mode || 0}</span>
                <span title="更新时间" style="${timeColorStyle}">${updateTime}</span>
            </div>
        `;
                //<span title="模板类型">${getModuleTypes() || 0}</span>
            }
        }

        // 添加样式
        function addHeaderStyles() {
            const styleId = 'my-custom-header-styles';
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.textContent = `
            #my-custom-tool-container {
                display: flex !important;
                align-items: center !important;
                margin-left: auto !important;
                margin-right: 20px !important;
                z-index: 10000 !important;
            }
            #my-custom-tool-container span {
                padding: 6px 12px;
                background: rgba(200, 255, 255, 0.95);
                border-radius: 16px;
                border: 1px solid #e0e0e0;
                font-weight: 500;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                transition: all 0.2s ease;
                white-space: nowrap;
            }
            #my-custom-tool-container span:hover {
                background: #f8f9fa;
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            }
            .fixedWrapper {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                z-index: 9999 !important;
                opacity: 1 !important;
                visibility: visible !important;
            }
        `;
                document.head.appendChild(style);
            }
        }

        // 启动监听
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupHeaderObserver);
        } else {
            setupHeaderObserver();
        }

    }



    //*************************************************************************************
    //----------------------------------------改图函数：修改图片src
    //*************************************************************************************
    function formatImgSrc() {
        let rules = [];

        rules = [
            //?x-bce-process=
            ['img','src',/\?x-bce-process=[\s\S]*/, "?x-bce-process=image/format,f_auto/resize,m_lfit,limit_1,w_1080"],//去一切
        ];


        // 获取img
        function getTags(tagType, styleType, beforeText, afterText) {
            let tags = document.querySelectorAll(tagType);

            tags.forEach(function(tag){
                let tagText = tag.getAttribute(styleType);
                // console.log('imgText的旧内容为：' + tagText);

                if (tagText) {
                    tagText = tagText.replace(beforeText, afterText);
                    tag.setAttribute(styleType, tagText);
                    // console.log('imgText的新内容为：' + tagText);
                }
            });
        }


        function goGetTags() {
            for (let i = 0; i < rules.length; i++) {
                let rule = rules[i];
                getTags(rule[0], rule[1], rule[2], rule[3]);
            }
        }
        goGetTags();
    }
    // 修改不显示概述图的词
    function formatAbstractAlbum() {
        // 正常概述图img
        let formatAbstractAlbum_img = document.querySelector('head > meta[name="image"]').content;

        // 正常概述图图册链接
        let formatAbstractAlbum_urlA = document.querySelector('head > link[hreflang="x-default"]').href.replace('https://baike.baidu.com/item/','https://baike.baidu.com/pic/');
        let formatAbstractAlbum_urlB = document.querySelector('head > meta[name="image"]').content.replace('https://bkimg.cdn.bcebos.com/pic/','').replace(/\?x-bce-process=.*/,'');
        let formatAbstractAlbum_url = formatAbstractAlbum_urlA + '/1/' + formatAbstractAlbum_urlB;

        if (!formatAbstractAlbum_url.includes('https://bkssl.bdimg.com/cms/static/baike.png')) {
            // 创建包含图片链接的 img 元素
            let imgElement = document.createElement('img');
            imgElement.setAttribute('width', '100%');
            imgElement.setAttribute('style', 'display: block;');
            imgElement.setAttribute('src', formatAbstractAlbum_img);

            // 创建包含 img 元素的 a 元素
            let aElement = document.createElement('a');
            aElement.setAttribute('href', formatAbstractAlbum_url);
            aElement.setAttribute('target', '_blank'); // 在新标签页打开链接
            aElement.appendChild(imgElement);

            // 创建包含 a 元素的 div 元素
            let divElement = document.createElement('div');
            divElement.classList.add('abstractAlbum_add');
            divElement.appendChild(aElement);

            // 将 div 元素插入到 div#side 的最前面
            let sideDiv = document.querySelector('div#side');
            sideDiv.insertBefore(divElement, sideDiv.firstChild);
        }
    }



    //*************************************************************************************
    //----------------------------------------改表函数
    //*************************************************************************************
    function formatTable() {

        //改表函数：引用函数
        function findFollowingDDByText(textTag, searchText) {
            let dtElements = textTag.getElementsByTagName('dt');
            for(let i = 0; i < dtElements.length; i++) {
                if(dtElements[i].textContent.trim() === searchText) {
                    let nextSibling = dtElements[i].nextElementSibling;
                    while (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
                        // 跳过空白文本节点，直到找到下一个元素节点
                        nextSibling = nextSibling.nextSibling;
                    }
                    if (nextSibling && nextSibling.tagName.toLowerCase() === 'dd') {
                        return nextSibling.textContent;
                    }
                    break; // 找到匹配的dt后停止循环
                }
            }
            return null; // 如果未找到匹配项，则返回null
        }


        // 如果已有则删除
        //                 if (teleplay.parentNode.querySelector(`table#formatTablef_actor_${tagName}`)) {
        //                     teleplay.parentNode.querySelector(`table#formatTablef_actor_${tagName}`).remove();
        //                 }



        //*************************************************************************************
        //----------------------------------------改表函数：杂志写真/已优化
        //*************************************************************************************
        function formatTablef_magazine() {
            let tagName = 'magazine';
            const tagDivs = document.querySelectorAll(`div[data-module-type="${tagName}"]`);
            tagDivs.forEach((teleplay) => {
                // 创建一个新的表格
                const table = document.createElement('table');
                table.id = `formatTablef_magazine_${tagName}`;
                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');

                // 初始化列数据数组
                const columns = [
                    { header: '杂志名称', data: [] },
                    { header: '杂志期数', data: [] },
                    { header: '图片位置', data: [] },
                    { header: '备注', data: [] }
                ];


                // 遍历teleplay内的符合条件的子元素并填充表格数据
                let listTags = teleplay.querySelectorAll('div[class*="magazineItem_"]');//class="magazineItem_aYGRC"
                for (let i = 0; i < listTags.length; i++) {
                    const row = document.createElement('tr');


                    // 杂志名称
                    const nameTd = document.createElement('td');
                    let nameText = listTags[i].querySelector('div[class*="name_"]')?.textContent?.replace(/[[0-9-]+]/g,'')?.trim();
                    nameText = nameText === '' ? '-': nameText === undefined ? '-' : nameText;
                    nameTd.textContent = nameText;
                    columns[0].data.push(nameText);

                    // 杂志期数
                    const timeTd = document.createElement('td');
                    let timeText = listTags[i].querySelector('div[class*="time_"] > span')?.textContent?.replace(/[[0-9-]+]/g,'')?.trim();
                    timeText = timeText === '' ? '-': timeText === undefined ? '-' : timeText;
                    timeTd.textContent = timeText;
                    columns[1].data.push(timeText);

                    // 图片位置
                    const locationTd = document.createElement('td');
                    let locationText = listTags[i].querySelector('div[class*="location_"] > span')?.textContent?.replace(/[[0-9-]+]/g,'')?.trim();
                    locationText = locationText === '' ? '-': locationText === undefined ? '-' : locationText;
                    locationTd.textContent = locationText;
                    columns[2].data.push(locationText);

                    // 备注
                    const tipsTd = document.createElement('td');
                    let tipsText = listTags[i].querySelector('div[class*="tips_"] > span')?.textContent?.replace(/[[0-9-]+]/g,'')?.trim();
                    tipsText = tipsText === '' ? '-' : tipsText === undefined ? '-' : tipsText;
                    tipsTd.textContent = tipsText;
                    columns[3].data.push(tipsText);


                    row.appendChild(nameTd);// 杂志名称
                    row.appendChild(timeTd);// 杂志期数
                    row.appendChild(locationTd);// 图片位置
                    row.appendChild(tipsTd);// 备注
                    tbody.appendChild(row);
                }

                // 创建一个数组来跟踪需要删除的列的索引
                let deletedColumns = [];

                // 遍历列数据数组，添加需要删除的列索引到 deletedColumns 数组中
                columns.forEach((column, index) => {
                    if (column.data.every(text => text === '-')) {
                        deletedColumns.push(index);
                    }
                });

                // 创建表头
                const headerRow = document.createElement('tr');
                columns.forEach((column, index) => {
                    if (!deletedColumns.includes(index)) {
                        const th = document.createElement('th');

                        // 设置完整的表头样式
                        Object.assign(th.style, {
                            backgroundColor: '#f4f4f4',
                            fontWeight: 'bold',
                            color: '#333333',
                            borderBottom: '1px solid #000000',
                            padding: '4px 15px',
                            textAlign: 'left',
                            fontSize: '14px'
                        });

                        th.textContent = column.header;
                        headerRow.appendChild(th);
                    }
                });
                thead.appendChild(headerRow);

                // 遍历表格行并删除列
                Array.from(tbody.rows).forEach(row => {
                    // 按相反的顺序删除列
                    for (let i = deletedColumns.length - 1; i >= 0; i--) {
                        row.deleteCell(deletedColumns[i]);
                    }
                });

                table.appendChild(thead);
                table.appendChild(tbody);

                // 如果已有则删除
                if (teleplay.parentNode.querySelector(`table#formatTablef_magazine_${tagName}`)) {
                    teleplay.parentNode.querySelector(`table#formatTablef_magazine_${tagName}`).remove();
                }
                // 在teleplay div的末尾插入表格
                teleplay.appendChild(table);
            });
        }

        //*************************************************************************************
        //----------------------------------------改表函数：演唱会记录
        //*************************************************************************************
        function formatTablef_concert() {
            let tagName = 'concert';
            const tagDivs = document.querySelectorAll(`div[data-module-type="${tagName}"]`);
            tagDivs.forEach((tag) => {
                // 表头
                let trsT = tag.querySelectorAll('table thead tr th[width="45"]');
                if (trsT) {
                    trsT.forEach((trT) => {
                        trT.remove();
                    });
                }

                // 表格
                let trs = tag.querySelectorAll('table tbody tr td a[class*="Toggle_"]');
                trs.forEach((tr) => {
                    tr.parentNode.remove();
                });

                // 底色
                let divs = tag.querySelectorAll('div[class*="concertRecord_"]');
                divs.forEach((div) => {
                    div.className = '';
                });

                // 重新设置完整的表头样式
                const ths = tag?.querySelectorAll('table > thead > tr > th');
                ths.forEach(th => {
                    Object.assign(th.style, {
                        backgroundColor: '#f4f4f4',
                        fontWeight: 'bold',
                        color: '#333333',
                        borderBottom: '1px solid #000000',
                        padding: '4px 15px',
                        textAlign: 'left',
                        fontSize: '14px'
                    });
                });
            });
        }
        //*************************************************************************************
        //----------------------------------------改表函数：获奖记录
        //*************************************************************************************
        function formatTablef_award() {
            let tagName = 'award';
            const tagDivs = document.querySelectorAll(`div[data-module-type="${tagName}"]`);

            tagDivs.forEach(tagDiv => {
                // 去除旧标题，添加新标题
                let rowsTable = tagDiv.querySelectorAll('div[class*="awardRecord_"] > table > tbody > tr > td > table');
                rowsTable.forEach(row => {
                    // 旧表格标题
                    let titleTag = row.parentNode.parentNode.previousElementSibling;
                    let title = titleTag.textContent.trim();
                    // 创建新的 <caption> 元素
                    let caption = document.createElement('caption');
                    caption.textContent = title;
                    // 在row的开头插入表格标题
                    let captionList = row.querySelectorAll('caption');
                    if (captionList.length > 0) {
                        captionList.forEach(no => {
                            no.remove();
                        });
                    }
                    row.prepend(caption);
                    // 删除旧表格标题
                    titleTag.remove();
                });


                // 去除外框表格
                let rowsBig = tagDiv.querySelectorAll('div[class*="awardRecord_"] > table[width="100%"]');
                rowsBig.forEach(table => {
                    // 创建新的 <div> 元素
                    let div = document.createElement('div');
                    // 复制 <table> 的所有内容
                    while (table.firstChild) {
                        div.appendChild(table.firstChild);
                    }
                    // 用 <div> 替换 <table>
                    table.parentNode.replaceChild(div, table);
                });


                // 去除表格底色、表头宽度
                let rows = tagDiv.querySelectorAll('tr > td[class*="innerTable_"]');
                rows.forEach(row => {
                    //  row.style.width = "";
                    row.className = '';
                });



                // 重新设置完整的表头样式
                const ths = tagDiv.querySelectorAll('tbody > tr > td > table > thead > tr > td');
                ths.forEach(th => {
                    Object.assign(th.style, {
                        backgroundColor: '#f4f4f4',
                        fontWeight: 'bold',
                        color: '#333333',
                        borderBottom: '1px solid #000000',
                        padding: '4px 15px',
                        textAlign: 'left',
                        fontSize: '14px'
                    });
                });

            });


            /*
                title = caption.textContent.trim();
                title = table.parentNode.parentNode.previousElementSibling.textContent.trim();
             */




        }
        //*************************************************************************************
        //----------------------------------------改表函数：职员表
        //*************************************************************************************
        function formatTablef_staff() {
            let tagName = 'staff';
            const tagDivs = document.querySelectorAll(`div[data-module-type="${tagName}"]`);

            tagDivs.forEach(tagDiv => {
                // 去除表格底色
                let rows = tagDiv.querySelectorAll('table[class*="staffList_"]');
                rows.forEach(row => {
                    row.className = '';
                });

                // 重新设置完整的表头样式
                const ths = tagDiv.querySelectorAll('table > tbody > tr > td[class*="listKey_"]');
                ths.forEach(th => {
                    Object.assign(th.style, {
                        backgroundColor: '#f4f4f4',
                        fontWeight: 'bold',
                        color: '#333333',
                        borderBottom: '1px solid #000000',
                        padding: '4px 15px',
                        textAlign: 'left',
                        fontSize: '14px'
                    });
                });
            });
        }






        //         formatTablef_role()
        //         // 电影
        //         formatTablef('movie');
        //         // 电视剧
        //         formatTablef('teleplay');
        //         // 演员表
        //         formatTablef_actor();
        //         // 音乐专辑
        //         formatTablef_musicAlbum();
        //         // 杂志写真
        //         formatTablef_magazine();
        //         // 出版图书
        //         formatTablef_publication();
        // 演唱会记录
        formatTablef_concert();
        // 获奖记录
        formatTablef_award();
        // 职员表
        formatTablef_staff();
    }
    // 修改特殊表格
    function formatTable_haveimg() {
        // 获取页面中所有的表格
        let tables = document.getElementsByTagName('table');

        // 遍历每个表格
        for (let i = 0; i < tables.length; i++) {
            let table = tables[i];
            let headers = table.querySelectorAll('tr th');

            // 检查表头是否符合要求：名称 图片 名称 图片
            if (headers.length === 4 &&
                headers[0].innerText.trim() === '名称' &&
                headers[1].innerText.trim() === '图片' &&
                headers[2].innerText.trim() === '名称' &&
                headers[3].innerText.trim() === '图片') {

                // 将每一行复制
                let rows = table.querySelectorAll('tr'); // 获取表格中所有行

                for (let j = 1; j < rows.length; j++) {
                    let row = rows[j];
                    let cells = row.querySelectorAll('td'); // 获取当前行的所有单元格

                    // 复制当前行
                    let clonedRow = row.cloneNode(true);

                    // 插入复制的行到当前行的后面
                    row.parentNode.insertBefore(clonedRow, row.nextSibling);
                }



                // 修改表头，变为两列
                headers[2].remove();
                headers[3].remove();

                let rows_new = table.querySelectorAll('tr'); // 获取表格中所有行

                for (let row_no = 1; row_no < rows_new.length; row_no++) {
                    let row_new = rows_new[row_no];
                    let cells_new = row_new.querySelectorAll('td'); // 获取当前行的所有单元格

                    if (row_no % 2 === 0) {
                        // row_no 是偶数
                        cells_new[0].remove();
                        cells_new[1].remove();
                    } else {
                        // row_no 是奇数
                        cells_new[2].remove();
                        cells_new[3].remove();
                    }
                }
            }


            // 检查
            if (headers.length === 3 &&
                headers[0].innerText.trim() !== '名称' && headers[0].innerText.trim() !== '图片' &&
                headers[1].innerText.trim() !== '名称' && headers[1].innerText.trim() !== '图片' &&
                headers[2].innerText.trim() !== '名称' && headers[2].innerText.trim() !== '图片') {
                // 将每一行复制
                let rows = table.querySelectorAll('tr'); // 获取表格中所有行

                for (let j = 1; j < rows.length; j++) {
                    let row = rows[j];
                    let cells = row.querySelectorAll('td'); // 获取当前行的所有单元格

                    // 复制当前行
                    let clonedRow = row.cloneNode(true);

                    // 插入复制的行到当前行的后面
                    row.parentNode.insertBefore(clonedRow, row.nextSibling);

                    // 再次复制当前行
                    let clonedRow2 = row.cloneNode(true);

                    // 插入第二个复制的行到当前行的后面
                    row.parentNode.insertBefore(clonedRow2, row.nextSibling);

                }



                let rows_new = table.querySelectorAll('tr'); // 获取表格中所有行

                for (let row_no = 1; row_no < rows_new.length; row_no++) {
                    let row_new = rows_new[row_no];
                    let cells_new = row_new.querySelectorAll('td'); // 获取当前行的所有列

                    if (row_no) {

                        for (let m = 0; m < cells_new.length; m++) {
                            cells_new[m].innerHTML=cells_new[row_no-1].innerHTML;//修改图片
                        }
                        for (let m = 0; m < cells_new.length; m++) {
                            cells_new[0].innerHTML=headers[row_no-1].innerHTML;//修改图片
                            cells_new[2].remove();
                        }

                    }


                }
                // 修改表头，变为两列
                headers[0].textContent = '名称';
                headers[1].textContent = '图片';
                headers[2].remove();

            }
        }
    }

    // 新的表格修改函数
    function formatTables(contentTag, type) {
        // 工具函数：删除标签
        function editDirectoryFunc_delOther(tagList){
            // 遍历所有标签并将其删除
            tagList.forEach(function(tagElement) {
                // 删除
                tagElement.remove();

            });
        }

        // ================== 安全访问函数 ==================
        const getValueByPath = (obj, path) => {
            return path
                .replace(/\[(\d+)\]/g, '.$1') // 转换 [0] 为 .0
                .split('.') // 拆分成路径数组
                .reduce((acc, key) => acc?.[key], obj); // 逐级访问
        };
        // ================== 表格构建通用函数 ==================
        function createDynamicTable(config, contentTag) {
            // 定位目标容器
            let baseDiv = document.querySelector("#root").querySelector(config.baseSelector);
            let targetDiv = contentTag.querySelector(config.targetSelector);
            let baseDiv_children = baseDiv?.querySelector(`.module-${config.fname}`);
            if (baseDiv_children) {
                baseDiv = baseDiv_children;
            }

            // 错误处理
            if (!targetDiv) {
                console.warn(config.warnMessage);
                if (config.onError) config.onError();
                return;
            }

            // 动态获取React属性
            const reactPropKeys = Object.keys(baseDiv).filter(key => key.startsWith('__reactProps'));
            if (reactPropKeys.length === 0) {
                console.error('找不到React属性');
                return;
            }

            // 安全获取数据
            let moduleData;
            try {
                const reactProps = baseDiv[reactPropKeys[0]];
                moduleData = reactProps?.children?.props?.moduleData;

                if (config.spPath) {
                    moduleData = getValueByPath(reactProps, config.spPath);
                    // 或者如果已存在 moduleData：
                    // moduleData = getValueByPath(moduleData, config.spPath);
                }


                if (!moduleData || !Array.isArray(moduleData)) {
                    throw new Error('无效的数据格式');
                }
            } catch (e) {
                console.error('数据解析失败:', e);
                return;
            }

            // 过滤有效列
            const validColumns = config.columns.filter(column =>
                                                       moduleData.some(item => {
                const value = column.getter(item);
                return value?.trim() !== '' && value !== '-';
            })
                                                      );

            if (!validColumns.length) {
                console.error('所有列都无有效内容');
                return;
            }

            // 构建表格HTML
            const tableHTML = `
                    ${config.styles || ''}
            <div class="insertTable_${config.fname}-container" id="insertTable_${config.fname}-container">
                <table class="insertTable_${config.fname}" id="insertTable_${config.fname}">
                    <thead>
                        <tr>
                            ${validColumns.map(c => `<th style="
                                background-color: #f4f4f4;
                                font-weight: bold;
                                color: #333333;
                                border-bottom: 1px solid #000000;
                                padding: 4px 15px;
                                text-align: left;
                                font-size: 14px;
                            ">${c.title}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${moduleData.map(item => `
                            <tr>
                                ${validColumns.map(c => `<td>${c.getter(item)}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
                    `;
            console.log('构建表格HTML无误');



            // 插入DOM
            targetDiv.insertAdjacentHTML('afterend', tableHTML);

            switch (config.end) {
                case 'del':
                    // 当 expression === value2 时执行
                    targetDiv.remove();
                    break;
                default:
                    // 没有匹配的 case 时执行
                    break;
            }

        }



        // ================== 表格配置中心 ==================
        const TABLE_CONFIGS = {
            // 演员表
            actor: {
                //selector: `div[data-tag="module"][data-module-type="actor"]:has(div[class*="actor_"])`,
                selector: `div[data-tag="module"][data-module-type="actor"]`,
                warnMessage: '❔找不到演员表模块',
                //onError: () => editDirectoryFunc_delOther(actorTag),
                end: 'del',
                columns: [
                    {
                        title: '角色',
                        getter: item => item.actorRole
                        ?.map(singer => singer.text?.find(t => t.tag === 'innerlink')?.text || singer.value?.title)
                        .filter(Boolean).join('、') || '-'
                    },
                    {
                        title: '演员',
                        getter: item => item.actor?.text?.[0]?.text
                        || item.actor?.text?.find(t => t.tag === 'innerlink')?.text
                        || '-'
                    },
                    {
                        title: '配音',
                        getter: item => item.actorVoice
                        ?.map(album => album.text?.[0]?.text || album.value?.title)
                        .filter(Boolean).join('、') || '-'
                    },
                    {
                        title: '备注',
                        getter: item => item.actorNote?.text?.[0]?.text
                        || item.actorNote?.text?.find(t => t.tag === 'innerlink')?.text
                        || '-'
                    }
                ]
            },

            // 角色介绍
            role: {
                // selector: `div[data-tag="module"][data-module-type="staff"]:has(div[class*="staff_"])`,
                selector: `div[data-tag="module"][data-module-type="role"]`,
                warnMessage: '找不到角色介绍模块',
                columns: [
                    {
                        title: '角色名称',
                        getter: item => item.roleName?.text?.flatMap(t => t.text).join('')
                        || '-'
                    },
                    {
                        title: '演员',
                        getter: item => item.roleActor?.flatMap(a => a.text?.map(t => t.text)).join('')
                        || '-'
                    },
                    {
                        title: '配音',
                        getter: item => item.roleVoice?.flatMap(v => v.text?.map(t => t.text)).join('')
                        || '-'
                    },
                    {
                        title: '角色介绍',
                        getter: item => item.roleDesc?.text?.map(d => d.content?.map(c => c.text).join('')).join('\n')
                        || '-'
                    }
                ]
            },

            // 参演电视剧
            teleplay: {
                //selector: `div[data-tag="module"][data-module-type="teleplay"]:has(div[class*="movieAndTvCellWrapper_"])`,
                selector: `div[data-tag="module"][data-module-type="teleplay"]`,
                warnMessage: '找不到参演电视剧模块',
                columns: [
                    {
                        title: '作品名称',
                        getter: item => item.teleplay?.text?.[0]?.text
                        || item.teleplay?.text?.find(t => t.tag === 'innerlink')?.text
                        || '-'
                    },
                    {
                        title: '首播时间',
                        getter: item => item.teleplayDateOfRelease?.text?.map(o => o.text).join('')
                        + (item.teleplayDateOfRelease?.note ? `（${item.teleplayDateOfRelease.note}）` : '')
                        || '-'
                    },
                    {
                        title: '饰演角色',
                        getter: item => item.teleplayRole
                        ?.map(role => role.text?.[0]?.text || role.value?.title)
                        .filter(Boolean).join('、') || '-'
                    },
                    //                 {
                    //                     title: '导演',
                    //                     getter: item => item.teleplayDirector
                    //                     ?.map(d => d.text?.find(t => t.tag === 'innerlink')?.text || d.value?.title)
                    //                     .filter(Boolean).join('、') || '-'
                    //                 },
                    //                 {
                    //                     title: '合作演员',
                    //                     getter: item => item.teleplayStarring
                    //                     ?.map(s => s.text?.[0]?.text || s.value?.title)
                    //                     .filter(Boolean).join('、') || '-'
                    //                 }
                ]
            },

            // 参演电影
            movie: {
                //selector: `div[data-tag="module"][data-module-type="movie"]:has(div[class*="movieAndTvCellWrapper_"])`,
                selector: `div[data-tag="module"][data-module-type="movie"]`,
                warnMessage: '找不到参演电影模块',
                columns: [
                    {
                        title: '作品名称',
                        getter: item => item.movie?.text?.[0]?.text
                        || item.movie?.text?.find(t => t.tag === 'innerlink')?.text
                        || '-'
                    },
                    {
                        title: '上映时间',
                        getter: item => item.movieDateOfRelease?.text?.map(o => o.text).join('')
                        + (item.movieDateOfRelease?.note ? `（${item.movieDateOfRelease.note}）` : '')
                        || '-'
                    },
                    {
                        title: '饰演角色',
                        getter: item => item.movieRole
                        ?.map(role => role.text?.[0]?.text || role.value?.title)
                        .filter(Boolean).join('、') || '-'
                    },
                    //                 {
                    //                     title: '导演',
                    //                     getter: item => item.movieDirector
                    //                     ?.map(d => d.text?.find(t => t.tag === 'innerlink')?.text || d.value?.title)
                    //                     .filter(Boolean).join('、') || '-'
                    //                 },
                    //                 {
                    //                     title: '合作演员',
                    //                     getter: item => item.movieStarring
                    //                     ?.map(s => s.text?.[0]?.text || s.value?.title)
                    //                     .filter(Boolean).join('、') || '-'
                    //                 }
                ]
            },

            // 音乐单曲
            musicSingle: {
                selector: `div[data-tag="module"][data-module-type="musicSingle"]`,
                warnMessage: '找不到音乐单曲模块',
                end: 'del',
                columns: [
                    {
                        title: '歌曲名称',
                        getter: item => item.musicSingle?.text?.find(t => t.tag === 'innerlink')?.text
                        || item.musicSingle?.text?.[0]?.text
                        || '-'
                    },
                    {
                        title: '歌曲风格',
                        getter: item => item.musicSingleGenre?.text?.[0]?.text
                        || item.musicSingleGenre?.text?.find(t => t.tag === 'innerlink')?.text
                        || '-'
                    },
                    {
                        title: '发行时间',
                        getter: item => item.musicSingleDateOfPublication?.text?.[0]?.text || '-'
                    },
                    {
                        title: '歌曲简介',
                        getter: item => item.musicSingleIntro?.text?.map(t => t.text).join('')
                        || item.musicSingleIntro?.text?.[0]?.text
                        || '-'
                    }
                ]
            },

            // 音乐专辑
            musicAlbum: {
                selector: `div[data-tag="module"][data-module-type="musicAlbum"]`,
                warnMessage: '找不到音乐单曲模块',
                spPath: 'children.props.songList',
                columns: [
                    {
                        title: '专辑名称',
                        getter: item => item.musicAlbum?.value?.title
                        || '-'
                    },
                    {
                        title: '发行时间',
                        getter: item => {
                            const dateObj = item.musicAlbumDateOfPublication;
                            if (!dateObj) return '-';
                            if (dateObj.text) return dateObj.text.map(t => t.text).join('') || '-';
                            const { year, month, day } = dateObj.value || {};
                            return [year, month, day].filter(Boolean).join('-') || '-';
                        },
                    },
                ]
            },

            // 为他人创作
            musicForOthers: {
                selector: `div[data-tag="module"][data-module-type="musicForOthers"]`,
                warnMessage: '找不到为他人创作模块',
                end: 'del',
                columns: [
                    {
                        title: '歌曲名称',
                        getter: item => item.otherMusic?.text?.[0]?.text
                        || item.otherMusic?.text?.find(t => t.tag === 'innerlink')?.text
                        || '-'
                    },
                    {
                        title: '职能',
                        getter: item => item.functionInOtherMusic
                        ?.map(f => f.text?.[0]?.text || f.value)
                        .filter(Boolean).join('、') || '-'
                    },
                    {
                        title: '演唱者',
                        getter: item => item.otherMusicSinger
                        ?.map(singer => singer.text?.find(t => t.tag === 'innerlink')?.text || singer.value?.title)
                        .filter(Boolean).join('、') || '-'
                    },
                    {
                        title: '所属专辑',
                        getter: item => item.otherMusicAlbum
                        ?.map(item =>
                              item.text
                              ?.map(t => t.text) // 提取每个文本段的text
                              .filter(Boolean) // 过滤空值
                              .join('') // 拼接单个项目的完整文本
                             )
                        .filter(Boolean) // 过滤掉空项目
                        .join('、') // 用顿号连接所有项目
                        || '-'

                    },
                    {
                        title: '发行时间',
                        getter: item => {
                            const dateObj = item.otherMusicDateOfPublication;
                            if (!dateObj) return '-';
                            if (dateObj.text) return dateObj.text.map(t => t.text).join('') || '-';
                            const { year, month, day } = dateObj.value || {};
                            return [year, month, day].filter(Boolean).join('-') || '-';
                        }
                    }
                ]
            },

            // 综艺节目
            varietyShow: {
                selector: `div[data-tag="module"][data-module-type="varietyShow"]`,
                warnMessage: '找不到综艺节目模块',
                end: 'del',
                columns: [
                    {
                        title: '播出时间',
                        getter: item => {
                            const dateObj = item.varietyShowBroadcastingTime;
                            if (!dateObj) return '-';
                            if (dateObj.text) return dateObj.text.map(t => t.text).join('') || '-';
                            const { year, month, day } = dateObj.value || {};
                            return [year, month, day].filter(Boolean).join('-') || '-';
                        }
                    },
                    {
                        title: '节目名称',
                        getter:  item => item.varietyShow?.text?.[0]?.text
                        || item.varietyShow?.text?.find(t => t.tag === 'innerlink')?.text
                        || '-'
                    },
                    {
                        title: '简介',
                        getter: item => item.varietyShowAbstract?.text?.flatMap(t => t.content?.map(c => c.text).filter(Boolean)
                                                                               ).join('') ?? '-'
                    },
                ]
            },


            // 出版图书
            publication: {
                selector: `div[data-tag="module"][data-module-type="publication"]`,
                warnMessage: '找不到出版图书模块',
                columns: [
                    {
                        title: '作品名称',
                        getter: item => item.publicationName?.value?.title
                        || '-'
                    },
                    {
                        title: '作者名称',
                        getter: item => item.publicationAuthor?.flatMap(a => a.text?.flatMap(b => b.text)).join(' ')
                        || '-'
                    },
                    {
                        title: '作品时间',
                        getter: item => item.publicationTime?.text?.map(o => o.text).join('')
                        || '-'
                    },
                    {
                        title: '作品简介',
                        getter: item => item.publicationSynopsis?.text?.map(m => m.content?.map(n => n.text).join('')).join('\n')
                        || '-'
                    },
                ]
            },


            // 大事记
            timeAxis: {
                selector: `div[data-tag="module"][data-module-type="timeAxis"]`,
                warnMessage: '找不到大事记模块',
                end: 'del',
                spPath: 'children.props.moduleData[0].timeAxisEvents',
                columns: [
                    {
                        title: '时间',
                        getter: item => {
                            const dateObj = item.eventTime;
                            if (!dateObj) return '-';
                            if (dateObj.text) return dateObj.text.map(t => t.text).join('') || '-';
                            const { year, month, day } = dateObj.value || {};
                            return [year, month, day].filter(Boolean).join('-') || '-';
                        }
                    },
                    {
                        title: '事件',
                        getter: item => item.eventTitle?.text?.flatMap(c => c.text).filter(Boolean).join('') ?? '-'
                    },
                    {
                        title: '简介',
                        getter: item => item.eventDetails?.text?.flatMap(t => t.content?.map(c => c.text).filter(Boolean)).join('') ?? '-'
                    }
                ]
            }
        };

        // ================== 表格统一执行器 ==================
        function initializeAllTables(contentTag, type) {
            Object.entries(TABLE_CONFIGS).forEach(([fname, config]) => {
                try {
                    createDynamicTable({
                        fname,
                        baseSelector: config.selector,
                        targetSelector: config.selector,
                        warnMessage: config.warnMessage,
                        onError: config.onError,
                        spPath: config.spPath,
                        columns: config.columns
                    },contentTag);
                    console.log(`✅ ${fname} 表格初始化成功`);
                } catch (error) {
                    console.error(`❌ ${fname} 表格初始化失败:`, error);
                }
            });
        }

        // ================== 执行 ==================
        initializeAllTables(contentTag, type)
    }




    //*************************************************************************************
    //----------------------------------------表格复制按钮
    //*************************************************************************************
    function createTableButton() {
        function CopyTable(table) {
            // 确保table在DOM中存在
            if (table.parentNode) {

                async function copyTableWithoutSupTags(table) {
                    try {
                        // 克隆表格，避免修改原始DOM
                        const tableClone = table.cloneNode(true);

                        // 移除所有 <sup> 标签
                        const supTags = tableClone.querySelectorAll('sup');
                        supTags.forEach(sup => {
                            sup.remove(); // 直接移除<sup>标签及其内容
                            // 或者替换成空字符串（可选）
                            // sup.replaceWith('');
                        });

                        // 移除所有 <span> 标签
                        const spanTags = tableClone.querySelectorAll('span[class*="total_"]');
                        spanTags.forEach(span => {
                            span.remove(); // 直接移除<sup>标签及其内容
                            // 或者替换成空字符串（可选）
                            // sup.replaceWith('');
                        });

                        // 获取处理后的HTML
                        const html = tableClone.outerHTML;
                        const blob = new Blob([html], { type: 'text/html' });
                        const clipboardItem = new ClipboardItem({ 'text/html': blob });

                        await navigator.clipboard.write([clipboardItem]);
                        console.log('【表格】已复制到剪贴板！（已移除<sup>标注）');
                    } catch (err) {
                        console.error('无法复制表格：', err);
                        // 降级方案：使用旧方法（execCommand）
                        const range = document.createRange();
                        range.selectNode(table);
                        window.getSelection().removeAllRanges();
                        window.getSelection().addRange(range);
                        document.execCommand('copy');
                        window.getSelection().removeAllRanges();
                    }
                }

                // 调用方式
                copyTableWithoutSupTags(table);

            } else {
                console.error('表格没有找到合适的父节点');
            }
        }
        function CopyTable_noImgTitle(table) {
            // 确保table在DOM中存在
            if (table.parentNode) {
                let range = document.createRange();
                range.selectNode(table);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);

                try {
                    document.execCommand('copy'); // 将选中内容复制到剪贴板
                    console.log('【表格】已复制到剪贴板！');
                } catch (err) {
                    console.error('无法复制表格：', err);
                }
                window.getSelection().removeAllRanges();

            } else {
                console.error('表格没有找到合适的父节点');
            }
        }
        function CopyTable_T(table) {
            // 确保table在DOM中存在
            if (table.parentNode.parentNode) {
                let title;
                let caption = table.querySelector('caption');
                if (caption) {
                    title = caption.textContent.trim();
                } else {
                    title = table.parentNode.parentNode.previousElementSibling.textContent.trim();
                }

                navigator.clipboard.writeText(title)
                    .then(() => console.log('【表格标题】已复制到剪贴板：' + title))
                    .catch(err => console.warning('【表格标题】复制失败：', err));

                window.getSelection().removeAllRanges();

            } else {
                console.error('表格没有找到合适的父节点');
            }
        }



        function addCopyButtonToTable() {

            let tables = document.querySelectorAll('table');
            tables.forEach(function(table) {
                let tableFromType = table.parentNode.parentNode.dataset.moduleType;
                if (tableFromType && tableFromType.includes('staff')) {
                    let emTag = table.parentNode.querySelector('em[class*="more_"]');
                    if (emTag) {
                        emTag.click();
                        emTag.remove();
                    }
                }

                // 创建按钮元素==表格标题
                let buttonTitle = document.createElement('button');
                buttonTitle.textContent = '表格标题';
                buttonTitle.id = '表格标题';
                buttonTitle.style.position = 'absolute';
                buttonTitle.style.top = '5px';
                buttonTitle.style.right = '115px';
                buttonTitle.style.zIndex = "999999";

                // 添加按钮点击事件处理程序
                buttonTitle.addEventListener('click', function() {
                    CopyTable_T(table);
                    // 修改按钮样式为橙色
                    buttonTitle.style.backgroundColor = 'orange';
                });

                // 将按钮添加到页面中
                let tableContainerTitle = table.parentNode;
                if (tableContainerTitle.querySelector('#表格标题')) {
                    tableContainerTitle.querySelector('#表格标题').remove();
                }
                if (tableContainerTitle) {
                    tableContainerTitle.style.position = 'relative'; // 确保图片的父元素是相对定位的
                    tableContainerTitle.insertBefore(buttonTitle, tableContainerTitle.firstChild);
                }


                // 创建按钮元素==复制无图
                let buttonNo = document.createElement('button');
                buttonNo.textContent = '复制无图';
                buttonNo.id = '复制无图';
                buttonNo.style.position = 'absolute';
                buttonNo.style.top = '5px';
                buttonNo.style.right = '60px';
                buttonNo.style.zIndex = "999999";

                // 添加按钮点击事件处理程序
                buttonNo.addEventListener('click', function() {
                    CopyTable_noImgTitle(table);
                    // 修改按钮样式为橙色
                    buttonNo.style.backgroundColor = 'orange';
                });

                // 将按钮添加到页面中
                let tableContainerNo = table.parentNode;
                if (tableContainerNo.querySelector('#复制无图')) {
                    tableContainerNo.querySelector('#复制无图').remove();
                }
                if (tableContainerNo) {
                    tableContainerNo.style.position = 'relative'; // 确保图片的父元素是相对定位的
                    tableContainerNo.insertBefore(buttonNo, tableContainerNo.firstChild);
                }


                // 创建按钮元素==复制表格
                let button = document.createElement('button');
                button.textContent = '复制表格';
                button.id = '复制表格';
                button.style.position = 'absolute';
                button.style.top = '5px';
                button.style.right = '5px';
                button.style.zIndex = "999999";

                // 添加按钮点击事件处理程序
                button.addEventListener('click', function() {
                    CopyTable(table);
                    // 修改按钮样式为橙色
                    button.style.backgroundColor = 'orange';
                });

                // 将按钮添加到页面中
                let tableContainer = table.parentNode;
                if (tableContainer.querySelector('#复制表格')) {
                    tableContainer.querySelector('#复制表格').remove();
                }
                if (tableContainer) {
                    tableContainer.style.position = 'relative'; // 确保图片的父元素是相对定位的
                    tableContainer.insertBefore(button, tableContainer.firstChild);
                }

            });
        }

        // ================== 执行 ==================
        addCopyButtonToTable();
    }

    //*************************************************************************************
    //----------------------------------------修改信息栏
    //*************************************************************************************
    function formatBasicInfo() {
        let basics = document.querySelector("div.J-basic-info");
        let sups = basics.querySelectorAll("sup");
        let basics_box_list = basics.querySelectorAll("div[class*='itemWrapper_']");//信息栏
        let basics_list = [[],[]];

        //删除参考资料
        sups.forEach(function(sup){
            sup.remove();
        });


        for (let i = 0;i< basics_box_list.length;i++) {
            let dtTag = basics_box_list[i].querySelector("dt");
            let dt = dtTag.innerText.trim().replace(/    /g,'');
            //let dd = basics_box_list[i].querySelector("dd").innerText.trim().replace(/\n/g,'、');
            let ddTag = dtTag.nextElementSibling;
            let dd = ddTag.innerText.trim().replace(/\n/g,'、');

            let dddiv = ddTag.querySelectorAll('div[class*="basicInfoOverlap_"]');

            // 对部分需要展开的内容进行获取
            if (dddiv.length > 0) {
                ddTag = dddiv[0].querySelector("dl > dd");
                let spanList = ddTag.querySelectorAll('span[class*="text_"]');
                let spanText = [];

                spanList.forEach(function(span){
                    spanText.push(span.textContent.trim()); // 将每个 span 的文本内容添加到数组中
                });

                // 信息栏xxl使用\n分隔，要改改这里【信息栏】
                // 使用 join 方法将数组元素合并成一个用\n分隔的字符串
                let combinedText = spanText.join('\n');
                dd = combinedText.trim();

            }


            // 将获取的内容添加到basics_list中
            if (basics_list[0].includes(dt)) {
                // 如果存在，找到索引并更新对应的dd
                let index = basics_list[0].indexOf(dt);
                // 合并dd内容
                basics_list[1][index] += '、' + dd;
            } else {
                // 如果不存在，将dt和dd添加到basics_list
                basics_list[0].push(dt);
                basics_list[1].push(dd);
            }


        }
        // 不适宜写入模板的内容处理
        for (let m = 0;m< basics_list[0].length;m++) {
            let other_A = ['集数','每集时长','片长','票房']
            for (let j = 0;j< other_A.length;j++) {
                if (basics_list[0][m]===other_A[j]) {
                    // 如果存在，修改
                    // console.log('basics_list[0][i]：',basics_list[0][m]);
                    basics_list[0][m] = basics_list[0][m]+' ';
                }
            }
        }


        //let regexStr = `"lemmaId":([0-9]+),"lemmaTitle":"${keyword}"`;
        //  let regex = new RegExp(regexStr, 'g');

        // let match_2 = match_contentItemChildren[1].match(regex);

        for (let m = 0;m< basics_list[0].length;m++) {
            let other_B = [['上映时间', '^((\\d{1,4}年)?(\\d{1,2}月)?(\\d{1,2}日)?)$'],
                           ['首播时间', '^((\\d{1,4}年)?(\\d{1,2}月)?(\\d{1,2}日)?)$'],
                           ['播出时间', '^((\\d{1,4}年)?(\\d{1,2}月)?(\\d{1,2}日)?)$'],
                           ['拍摄日期', '^((\\d{1,4}年)?(\\d{1,2}月)?(\\d{1,2}日)?)$'],
                           ['出生日期', '^((\\d{1,4}年)?(\\d{1,2}月)?(\\d{1,2}日)?)$'],
                           ['逝世日期', '^((\\d{1,4}年)?(\\d{1,2}月)?(\\d{1,2}日)?)$'],


                          ]
            for (let j = 0;j< other_B.length;j++) {
                // 获取规则

                //let regexStr = `\`${other_B[j][1]}\`s`;
                let regexStr = other_B[j][1];
                let regex = new RegExp(regexStr, 'g');
                if (basics_list[0][m] === other_B[j][0] &&
                    !basics_list[1][m].match(regex)
                   ) {
                    // 如果存在，修改
                    // console.log('basics_list[0][i]：',basics_list[0][m]);
                    basics_list[0][m] = basics_list[0][m]+' ';
                }
            }
        }
        // });拍摄日期

        console.log('basics_list：',basics_list);

        //
        function addBasics() {
            // 创建一个表格元素
            let table = document.createElement("table");
            table.id = 'addBasics';

            // 样式定义
            let purpleColor = "#dcd0ff";
            let blueColor = "#d0dcff";
            let orangeColor = "#ffa500";
            let redColor = "#000000";

            // 遍历基本信息数据，创建表格行和单元格
            for (let i = 0; i < basics_list.length; i++) {
                let row = table.insertRow();

                for (let j = 0; j < basics_list[0].length; j++) {
                    let cell = row.insertCell();
                    let button = document.createElement("button");
                    let buttonText = document.createTextNode("CC");
                    button.style.width = "25px";
                    button.style.height = "25px";
                    button.style.textAlign = "center";
                    button.style.lineHeight = "25px";
                    button.style.fontSize = "15px";//按钮元素的字体大小
                    button.style.zIndex = "999999";

                    // 添加 copyText 属性
                    button.setAttribute('copyText', basics_list[i][j]);
                    button.appendChild(buttonText);// 将文本内容添加到按钮
                    cell.appendChild(button);// 将按钮添加到单元格


                    // 设置按钮初始颜色
                    button.style.backgroundColor = (i === 0 && j === 0) ? orangeColor : (i === 0 ? purpleColor : blueColor);

                    // 按钮点击事件处理函数，复制对应数据并修改颜色
                    button.addEventListener('click', function() {
                        // 复制对应的基本信息数据
                        let dataToCopy = basics_list[i][j];
                        // 创建一个临时的 textarea 元素，用于复制文本
                        let tempTextarea = document.createElement('textarea');
                        tempTextarea.value = dataToCopy;
                        document.body.appendChild(tempTextarea);
                        tempTextarea.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempTextarea);

                        // 修改按钮颜色为红色
                        button.style.backgroundColor = redColor;

                        // 找到同列的下一行按钮，并将其颜色设置为橙色
                        if (i < basics_list.length - 1) { // 检查是否有下一行
                            table.rows[i + 1].cells[j].querySelector("button").style.backgroundColor = orangeColor;
                        } else { // 如果没有下一行，则找下一列的第一行按钮
                            if (j < basics_list[0].length - 1) { // 检查是否有下一列
                                table.rows[0].cells[j + 1].querySelector("button").style.backgroundColor = orangeColor;
                            }
                        }
                    });

                    button.appendChild(buttonText);
                    cell.appendChild(button);
                }
            }

            // 将表格添加到指定的 div 元素末尾
            basics.appendChild(table);



        }
        // 如果已有table则删除
        if (basics.querySelector('table#addBasics')) {
            basics.querySelector('table#addBasics').remove();
        }
        addBasics();

    }




    //*************************************************************************************
    //----------------------------------------显示图片名称复制按钮
    //*************************************************************************************
    function createImgButton_semantPage(){
        // 获取所有图片元素
        let imageTitle = document.querySelector("#side > div.abstractAlbum_add > a > img"); // 创建的概述图
        let imagesAll = document.querySelectorAll('.J-lemma-content img:not([src$=".svg"]):not([src$=".png"]):not([src*="apimaponline"]):not([src*="api.map.baidu.com"])');
        let images = [...imagesAll, imageTitle];

        // 循环处理每张图片
        images.forEach(img => {
            // 创建按钮元素
            let button = document.createElement('button');
            //button.textContent = 'C';
            button.id = 'createImgButton_semantPage';
            button.style.position = 'absolute';
            button.style.bottom = '10px'; // 与底部边距
            button.style.right = '10px'; // 与右侧边距
            button.style.padding = '18px'; // 内边距
            button.style.backgroundColor = 'rgba(255, 0, 255, 0.5)'; // 半透明背景
            button.style.color = 'white'; // 白色文本
            button.style.border = 'none'; // 无边框
            button.style.cursor = 'pointer'; // 指针样式
            button.style.zIndex = '9999999'; // 较高的 z-index
            button.style.fontFamily = 'inherit'; // 继承字体
            button.style.fontSize = 'inherit'; // 继承字体大小
            button.style.userSelect = 'none'; // 防止文本被选中复制



            // 按钮点击事件处理程序-名称
            button.addEventListener('click', function(event) {
                event.stopPropagation();
                event.preventDefault();
                // 获取图片的 src
                const src = img.src;
                // 提取图片路径中的参数

                // 旧的，图片名
                // let picPath = src.replace('https://bkimg.cdn.bcebos.com/pic/','').replace(/\?x-bce-process.*/,'').trim() + '.png';

                // 新的，完整路径
                const baiduID = window.PAGE_DATA.lemmaId;
                const mainPath = 'Z:\\' + baiduID + '\\';
                const imgName = src.replace('https://bkimg.cdn.bcebos.com/pic/','').replace(/\?x-bce-process.*/,'').trim() + '.png';

                const picPath = mainPath + imgName;

                // 复制图片路径中的内容到剪贴板
                navigator.clipboard.writeText(picPath)
                    .then(() => console.log('【图片路径】已复制到剪贴板：' + picPath))
                    .catch(err => console.warning('【图片路径】复制失败：', err));
            });

            // 将按钮添加到图片的父元素中
            img.parentNode.style.position = 'relative'; // 确保图片的父元素是相对定位的
            // 如果已有button则删除
            if (img.parentNode.querySelector('button#createImgButton_semantPage')) {
                img.parentNode.querySelector('button#createImgButton_semantPage').remove();
            }
            // 专辑图片格式调整
            if (img.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.classList.contains("module-musicAlbum")
                && img.parentNode.parentNode.querySelector('em[class*="bg_"]')
               ) {
                img.parentNode.parentNode.querySelector('em[class*="bg_"]').remove();
            }
            img.parentNode.appendChild(button);




            // 创建按钮元素2-标题
            let button_title = document.createElement('button');
            //button_title.textContent = 'T';
            button_title.id = 'createImgButton_semantPage_title';
            button_title.style.position = 'absolute';
            button_title.style.bottom = '10px'; // 与底部边距
            button_title.style.right = '50px'; // 与右侧边距
            button_title.style.padding = '18px'; // 内边距
            button_title.style.backgroundColor = 'rgba(255, 0, 0, 0.5)'; // 半透明背景
            button_title.style.color = 'white'; // 白色文本
            button_title.style.border = 'none'; // 无边框
            button_title.style.cursor = 'pointer'; // 指针样式
            button_title.style.zIndex = '9999999'; // 较高的 z-index
            button_title.style.fontFamily = 'inherit'; // 继承字体
            button_title.style.fontSize = 'inherit'; // 继承字体大小
            button_title.style.userSelect = 'none'; // 防止文本被选中复制

            // 按钮点击事件处理程序
            button_title.addEventListener('click', function(event) {
                event.stopPropagation();
                event.preventDefault();
                // 获取图片的 标题
                let title_one = img.parentNode.title;
                let title_list = img.parentNode.parentNode.title;
                let title_alt = img.alt;
                let title = title_one || title_list || title_alt;


                // 复制图片路径中的内容到剪贴板
                navigator.clipboard.writeText(title)
                    .then(() => console.log('【图片名称】已复制到剪贴板：' + title))
                    .catch(err => console.warning('【图片名称】复制失败：', err));
            });

            // 将按钮添加到图片的父元素中
            img.parentNode.style.position = 'relative'; // 确保图片的父元素是相对定位的
            // 如果已有button则删除
            if (img.parentNode.querySelector('button#createImgButton_semantPage_title')) {
                img.parentNode.querySelector('button#createImgButton_semantPage_title').remove();
            }
            img.parentNode.appendChild(button_title);
        });

    }
    function createImgButton_albumPage(){
        // 获取所有图片元素
        const images = document.querySelectorAll('div[class*="thumbItem_"]');

        // 循环处理每张图片
        images.forEach(img => {
            // 创建按钮元素
            const button = document.createElement('button');
            button.textContent = 'C';
            button.style.position = 'absolute';
            button.style.bottom = '10px'; // 与底部边距
            button.style.right = '10px'; // 与右侧边距
            button.style.padding = '10px'; // 内边距
            button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // 半透明背景
            button.style.color = 'white'; // 白色文本
            button.style.border = 'none'; // 无边框
            button.style.cursor = 'pointer'; // 指针样式
            button.style.zIndex = '9999999'; // 较高的 z-index
            button.style.fontFamily = 'inherit'; // 继承字体
            button.style.fontSize = 'inherit'; // 继承字体大小
            button.style.userSelect = 'none'; // 防止文本被选中复制


            // 按钮点击事件处理程序
            button.addEventListener('click', function(event) {
                event.stopPropagation();
                event.preventDefault();
                // 获取图片的样式中的背景图片链接
                const backgroundImage = img.style.backgroundImage;
                // 提取图片链接中的路径
                const matches = backgroundImage.match(/url\("(.+)"\)/);
                if (matches && matches.length > 1) {
                    const imageUrl = matches[1];
                    // 在这里对图片链接进行操作，比如提取路径中的参数等

                    // 旧的，图片名
                    // const picPath = imageUrl.replace('https://bkimg.cdn.bcebos.com/pic/','').replace(/\?x-bce-process.*/,'').trim() + '.png';

                    // 新的，完整路径
                    const baiduID = window.PAGE_DATA.lemmaId;
                    const mainPath = 'Z:\\' + baiduID + '\\';
                    const imgName = imageUrl.replace('https://bkimg.cdn.bcebos.com/pic/','').replace(/\?x-bce-process.*/,'').trim() + '.png';

                    const picPath = mainPath + imgName;

                    // 复制图片路径中的内容到剪贴板
                    navigator.clipboard.writeText(picPath)
                        .then(() => console.log('【图片路径】已复制到剪贴板：' + picPath))
                        .catch(err => console.warning('【图片路径】复制失败：', err));
                } else {
                    console.warning('未找到背景图片链接');
                }
            });


            // 创建按钮元素
            const button_down = document.createElement('button_down');
            button_down.textContent = 'D';
            button_down.style.position = 'absolute';
            button_down.style.bottom = '10px'; // 与底部边距
            button_down.style.right = '40px'; // 与右侧边距
            button_down.style.padding = '10px'; // 内边距
            button_down.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // 半透明背景
            button_down.style.color = 'white'; // 白色文本
            button_down.style.border = 'none'; // 无边框
            button_down.style.cursor = 'pointer'; // 指针样式
            button_down.style.zIndex = '9999999'; // 较高的 z-index
            button_down.style.fontFamily = 'inherit'; // 继承字体
            button_down.style.fontSize = 'inherit'; // 继承字体大小
            button_down.style.userSelect = 'none'; // 防止文本被选中复制


            // 按钮点击事件处理程序
            button_down.addEventListener('click', function(event) {
                event.stopPropagation();
                event.preventDefault();
                // 获取图片的样式中的背景图片链接
                const backgroundImage = img.style.backgroundImage;
                // 提取图片链接中的路径
                const matches = backgroundImage.match(/url\("(.+)"\)/);
                if (matches && matches.length > 1) {
                    const imageUrl = matches[1];
                    // 在这里对图片链接进行操作，比如提取路径中的参数等

                    // 原图url路径
                    const imgUrl = imageUrl.replace(/\?x-bce-process.*/,'').trim();

                    // 新的，完整路径
                    const baiduID = window.PAGE_DATA.lemmaId;
                    const mainPath = 'Z:\\' + baiduID + '\\';
                    const imgName = imageUrl.replace('https://bkimg.cdn.bcebos.com/pic/','').replace(/\?x-bce-process.*/,'').trim() + '.png';
                    const picPath = mainPath + imgName;

                    // 复制图片路径中的内容到剪贴板
                    navigator.clipboard.writeText(imgName)
                        .then(() => console.log('【图片路径】已复制到剪贴板：' + imgName))
                        .catch(err => console.warning('【图片路径】复制失败：', err));

                    // 下载图片
                    fetch(imgUrl)
                        .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.blob();
                    })
                        .then(blob => {
                        // 创建下载链接
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;

                        // 从URL中提取图片名称
                        const fileName = imgUrl.split('/').pop().split('?')[0]+'.png' || 'image.png';
                        a.download = fileName;

                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);

                    })
                        .catch(error => {
                        console.error('下载失败:', error);
                    });

                } else {
                    console.warning('未找到背景图片链接');
                }
            });



            // 将按钮添加到图片的父元素中
            img.parentNode.style.position = 'relative'; // 确保图片的父元素是相对定位的
            img.parentNode.appendChild(button);

            img.parentNode.appendChild(button_down);
        });



    }




    //*************************************************************************************
    //----------------------------------------地图增加下载按钮
    //*************************************************************************************
    function createMapButton(BMaps){
        // 循环处理每个大地图
        BMaps.forEach(BMap => {
            // 创建按钮元素
            let button = document.createElement('button');
            //button.textContent = '截图';
            button.id = 'downloadMapImg';
            button.style.position = 'absolute';
            button.style.bottom = '10px'; // 与底部边距
            button.style.right = '10px'; // 与右侧边距
            button.style.padding = '18px'; // 内边距
            button.style.backgroundColor = 'rgba(255, 0, 255, 0.5)'; // 半透明背景
            button.style.border = 'none'; // 无边框
            button.style.cursor = 'pointer'; // 指针样式
            button.style.zIndex = '9999999'; // 较高的 z-index
            button.style.fontFamily = 'inherit'; // 继承字体
            button.style.fontSize = 'inherit'; // 继承字体大小
            button.style.userSelect = 'none'; // 防止文本被选中复制



            // 按钮点击事件处理程序-修改样式并截图
            button.addEventListener('click', function(event) {
                event.stopPropagation();
                event.preventDefault();

                // 修改样式：去除多余东西
                const selectors = [
                    'a[title="到百度地图查看此区域"]', // 左下Logo
                    'div[class="BMap_stdMpPan"]', // 左上轮盘
                    'div[class="BMap_stdMpZoom"]', // 左上缩放
                    'div[class*="BMap_cpyCtrl"]', // 左下版权
                    'a[class="addressLink"]', // 中间“详情”
                    'img[src="https://api.map.baidu.com/images/iw_close1d3.gif"]', // 中间叉号
                    'img[title="进入全景"]',
                    'img[title="发送到手机"]',
                    'img[src="https://api.map.baidu.com/images/iw_plus1d3.gif"]',
                ];

                const ljs = BMap.querySelectorAll(selectors.join(', '));

                ljs.forEach(lj => {
                    lj.style.visibility = 'hidden';
                });

                // 获取时间戳
                const now = new Date();// 创建当前时间的Date对象
                const timestamp = Date.now(); // 毫秒时间戳

                // 新的，完整路径
                const mainPath = 'D:\\Baike\\quark\\';
                const imgName = `BMap_${timestamp}.png`;

                // 截图
                // 在用户脚本中使用的简化版本
                function captureNodeScreenshot(BMap) {
                    const node = BMap;
                    if (!node) return;

                    html2canvas(node, {
                        scale: 2,
                        useCORS: true,
                        allowTaint: false,
                        backgroundColor: '#ffffff',
                    }).then(canvas => {
                        canvas.toBlob(blob => {
                            const link = document.createElement('a');
                            link.download = imgName;
                            link.href = URL.createObjectURL(blob);
                            link.click();
                        });
                    });
                }

                // 如果还没有html2canvas，需要先注入
                function injectHtml2Canvas() {
                    return new Promise((resolve, reject) => {
                        if (window.html2canvas) {
                            resolve();
                            return;
                        }

                        const script = document.createElement('script');
                        script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
                        script.onload = resolve;
                        script.onerror = reject;
                        document.head.appendChild(script);
                    });
                }

                // 使用示例
                injectHtml2Canvas().then(() => {
                    captureNodeScreenshot(BMap)
                });




                const picPath = mainPath + imgName;

                // 复制图片路径中的内容到剪贴板
                navigator.clipboard.writeText(picPath)
                    .then(() => console.log('【图片路径】已复制到剪贴板：' + picPath))
                    .catch(err => console.warning('【图片路径】复制失败：', err));
            });

            // 将按钮添加到图片的父元素中
            BMap.parentNode.style.position = 'relative'; // 确保图片的父元素是相对定位的
            // 如果已有button则删除
            if (BMap.parentNode.querySelector('button#downloadMapImg')) {
                BMap.parentNode.querySelector('button#downloadMapImg').remove();
            }
            BMap.parentNode.appendChild(button);

        });




    }



    //*************************************************************************************
    //----------------------------------------打开所有义项并保留特色义项
    // Semant语义
    // ploysemant多义
    // validate验证
    //*************************************************************************************
    function openAllSemant() {

        const parts = document.querySelector('head > meta[property="og:title"]').content;
        if (parts) {
            const keyword = parts.trim();

            // 构建百度百科搜索链接
            const searchUrl = `https://baike.baidu.com/item/${encodeURIComponent(keyword)}`;
            console.log('searchUrl',searchUrl);


            // 访问百度百科搜索链接
            fetch(searchUrl)
                .then(response => response.text())
                .then(html => {


                // 使用正则表达式从 HTML 中提取 window.PAGE_DATA 开头的 script 数据
                // "disamLemma":{"lemmaId":21443771,"lemmaTitle":"计算机",
                const match = html.match(/"disamLemma":{"lemmaId":(\d+),/);
                // console.log('match',match);

                if (match) {
                    const jsonData = JSON.parse(match[1]);
                    const lemmaId = JSON.parse(match[1]);
                    const finalUrl = `${searchUrl}/${lemmaId}`;
                    console.log('义项页面:', finalUrl);

                    // 访问义项页面
                    fetch(finalUrl)
                        .then(response_finalUrl => response_finalUrl.text())
                        .then(html_finalUrl => {
                        // console.log('html_finalUrl',html_finalUrl);

                        //黄雀	卢伦常执导的刑电视剧侦
                        //"lemmaId":63278774,"lemmaTitle":"黄雀","lemmaDesc":"卢伦常执导的刑侦电视剧"


                        let match_contentItemChildren = html_finalUrl.match(/"lemmas":(.+),"encodeLemmaId"/);
                        console.log('match_contentItemChildren[1]:', match_contentItemChildren[1]);



                        let regexStr = `"lemmaId":([0-9]+),"lemmaTitle":"${keyword}"`;
                        let regex = new RegExp(regexStr, 'g');

                        let match_2 = match_contentItemChildren[1].match(regex);

                        if (match_2) {
                            console.log('All matches:', match_2);
                            // 如果需要获取每个匹配的第一个捕获组（即 lemmaId 的值）
                            for (let i = 0; i < match_2.length; i++) {
                                console.log(`Match ${i + 1}:`, match_2[i]);
                                console.log(`lemmaId value:`, match_2[i][1]);

                                //"lemmaId":23360414,"lemmaTitle":"余亚军"
                                let lemmaId = match_2[i].split('"lemmaId":')[1].split(`,"lemmaTitle":"${keyword}"`)[0];

                                let trueUrl = searchUrl + '/' + lemmaId + '?areyousuper';
                                console.log('trueUrl:', trueUrl);

                                window.open(trueUrl, '_blank');
                            }
                        } else {
                            console.log('No matches found.');
                        }




                    })
                        .catch(error => {
                        console.error('请求错误:', error);
                    });



                } else {
                    console.log('找不到符合条件的 script 数据');
                    window.open(`${searchUrl}?adplus`, '_blank');
                }
            })
                .catch(error => {
                console.error('请求错误:', error);

            });

        }

        let home = document.querySelector("#J-lemma-main-wrapper")
        let tag = home.querySelector("div[class*='posterFlag_']")

        }

    function validateSemantPage() {
        setTimeout(function() {

            let home = document.querySelector("#J-lemma-main-wrapper")
            let tag = home.querySelector("div[class*='posterFlag_']")

            if (tag) {
                let url = window.location.href;
                let new_url = url.replace('?areyousuper','');
                // 跳转到新的 URL
                window.location.href = new_url;
            }
            else {
                window.close();
            }
        }, 5000); // 延迟一段时间
    }



    //*************************************************************************************
    //----------------------------------------按钮：隐藏目录目录修改
    //*************************************************************************************
    // 删除参考资料
    function cleanRef(tag) {
        // 正文位置
        let contentTag = document.querySelector(`${tag}`);//正文所在标签
        // 获取所有参考资料上标sup元素
        let refSupList = contentTag.querySelectorAll('span[class*="supWrap"][class*="J-supWrap"] > sup[data-tag="ref"]');

        // 遍历并删除这些元素
        for (let i = 0; i < refSupList.length; i++) {
            if (refSupList[i].parentElement) {
                refSupList[i].parentElement.remove();
            }
        }

        // 本人 personalTag_Allop J-psl-tag
        let sups = contentTag.querySelectorAll('sup[class*="personalTag_"]');

        // 遍历并删除这些元素
        for (let i = 0; i < sups.length; i++) {
            sups[i].remove();
        }
    };

    function editDirectory(flag,tag){

        // 元素复制
        function editDirectoryFunc(tagList, newTagName){
            // 遍历所有标签并将其修改为newTagName
            tagList.forEach(function(tagElement) {
                // 创建一个新的newTagName元素
                let h1Element = document.createElement(`${newTagName}`);

                // 复制元素的内容和属性到newTagName元素
                h1Element.innerHTML = tagElement.innerHTML;
                Array.from(tagElement.attributes).forEach(function(attr) {
                    h1Element.setAttribute(attr.name, attr.value);
                });

                // 替换newTagName元素为yuan元素
                tagElement.parentNode.replaceChild(h1Element, tagElement);
            });
        }


        // 正文位置
        let contentTag = document.querySelector(`${tag}`);//正文所在标签


        // 获取所有一级目录（h2）标签
        let L1Tag = contentTag?.querySelectorAll("h2");
        editDirectoryFunc(L1Tag, "h1");

        // 获取所有二级目录（h3）标签
        let L2Tag = contentTag?.querySelectorAll("h3");
        editDirectoryFunc(L2Tag, "h2");

        // 获取所有二级目录（h3）标签
        let ListTag = document?.querySelectorAll(`${tag} ul`);
        editDirectoryFunc(ListTag, "div");

        // 获取所有加粗目录（B）标签
        //let BTag = contentTag.querySelectorAll("span[class*='text_'][class*='bold_']");
        //editDirectoryFunc(BTag, "h3");






        /**
         * 替换指定网页元素 - 移除原元素并在相同位置创建新元素
         * @param {string} mapTag - 目标网页元素
         * @param {string} newTag - 要写入的新HTML内容
         */
        function replaceContent(mapTag, newTag) {
            // 获取目标元素
            const targetElement = mapTag;

            // 检查元素是否存在
            if (!targetElement) {
                console.error(`元素 ${mapTag} 未找到`);
                return;
            }

            // 获取父元素
            const parentElement = targetElement.parentElement;
            if (!parentElement) {
                console.error(`元素 ${mapTag} 没有父元素`);
                return;
            }

            // 创建新的HTML元素
            const newElement = document.createElement('div');
            newElement.innerHTML = newTag;

            // 用新元素替换原元素（在原位替换）
            parentElement.replaceChild(newElement, targetElement);
        }

        /**
         * 构建无表头表格的HTML
         * @param {Array} contentList - 内容列表，包含所有要填入表格的数据
         * @param {number} columnCount - 表格列数
         * @param {string} [tableClass=''] - 表格的CSS类名
         * @returns {string} 表格的HTML字符串
         */
        function buildHeadlessTable(contentList, columnCount, tableClass = '') {
            // 计算需要的行数
            const rowCount = Math.ceil(contentList.length / columnCount);

            let tableHTML = '<table';

            // 添加表格类名
            if (tableClass) {
                tableHTML += ` class="${tableClass}"`;
            }

            tableHTML += '><tbody>';

            // 构建表格行和列
            for (let row = 0; row < rowCount; row++) {
                tableHTML += '<tr>';

                for (let col = 0; col < columnCount; col++) {
                    const contentIndex = row * columnCount + col;

                    // 检查是否有内容，没有则留空
                    if (contentIndex < contentList.length) {
                        tableHTML += `<td>${contentList[contentIndex]}</td>`;
                    } else {
                        tableHTML += '<td></td>'; // 空单元格
                    }
                }

                tableHTML += '</tr>';
            }

            tableHTML += '</tbody></table>';

            return tableHTML;
        }

        /**
         * 处理设施文本，根据图标类型添加前缀
         * @param {string} iconName - 图标名称
         * @param {string} text - 原始文本
         * @returns {string} 处理后的文本
         */
        function getSchoolTableDate(type) {
            function processFacilityText(iconName, text) {
                const prefixMap = {
                    'subway': '地铁',
                    'canteens': '食堂'
                    // 可以在这里添加更多的映射关系
                };

                const prefix = prefixMap[iconName];
                if (prefix) {
                    return `${prefix}：${text}`;
                }

                return text; // 如果没有特殊处理，返回原文本
            }

            // 使用处理函数
            const contentList = Array.from(type?.querySelectorAll('[class*="facilityListWrap_"] .facilityListItem_aAPhz') || [])
            .map(element => {
                const iconElement = element.querySelector('[class*="facilityItemIcon_"]');
                const textElement = element.querySelector('[class*="facilityItemText_"]');

                let iconName = '';
                if (iconElement) {
                    const style = iconElement.getAttribute('style');
                    const match = style?.match(/url\([^)]+\/([^\.]+)\.svg/);
                    iconName = match ? match[1] : '';
                }

                const displayText = textElement?.textContent?.trim() || '';
                const processedText = processFacilityText(iconName, displayText);

                return {
                    icon: iconName,
                    text: displayText,
                    processedText: processedText
                };
            });

            const processedContentList = contentList.map(item => item.processedText);

            return processedContentList;
        }


        // 工具函数：地图
        function editDirectoryFunc_map(mapTagList){
            // 遍历所有标签
            mapTagList.forEach(function(mapTag) {

                // 大地图
                const BMap = mapTag?.querySelector('.BMap_bubble_content');
                if(BMap){
                    const BMap_Title = BMap?.querySelector('[class*="addressTitle"]')?.childNodes[0]?.textContent?.trim();
                    const BMap_Detail = BMap?.querySelector('[class*="addressDetail"]')?.innerText?.trim();

                    const BMap_mapTrueText = '<div class="new-content-BMap">' + BMap_Title + '：' + BMap_Detail + '</div>';

                    replaceContent(mapTag, BMap_mapTrueText);
                    return; // 如果大地图处理成功，直接返回，避免重复处理
                }

                // 小地图
                const SMap = mapTag?.querySelector('[class*="mapSmallInfo_"]');
                if(SMap){
                    const SMap_Title = SMap?.querySelector('[class*="addressTitle_"]')?.innerText?.trim();
                    const SMap_Detail = SMap?.querySelector('[class*="addressDetail_"]')?.innerText?.trim();

                    const SMap_mapTrueText = '<div class="new-content-SMap">' + SMap_Title + '：' + SMap_Detail + '</div>';

                    replaceContent(mapTag, SMap_mapTrueText);
                }

            });
        }

        // 获取所有地图标签
        const mapTagList = contentTag.querySelectorAll('div[data-module-type="map"]');
        console.log('mapTagList:',mapTagList);
        if(mapTagList.length > 0){
            editDirectoryFunc_map(mapTagList);
        }



        // 工具函数：校园设施
        function editDirectoryFunc_school(schoolTagList){
            // 遍历所有标签
            schoolTagList.forEach(function(schoolTag) {

                // 百科校园大使协作认证（更新于2024.05.29）
                const school_dec = schoolTag?.querySelector('[class*="facilityDeclare_"]');
                if(school_dec){
                    school_dec.remove();
                }

                /**
                 * 宿舍条件
                 */
                const school_Dormitory = schoolTag?.querySelector('[data-index="collegeFacilitiesDormitory"]').parentElement;

                // 宿舍条件 图册删除
                const school_Dormitory_Album = school_Dormitory?.querySelector('[class*="facilityAlbumWrap_"]');
                if(school_Dormitory_Album){
                    school_Dormitory_Album.remove();
                }

                // 宿舍条件 表格
                const school_Dormitory_columnCount = 4;

                // 获取包含图标和文本信息的对象列表
                const school_Dormitory_facilityListWrap = school_Dormitory?.querySelector('[class*="facilityListWrap_"]');
                const school_Dormitory_contentList = getSchoolTableDate(school_Dormitory_facilityListWrap);

                const school_Dormitory_newTag = buildHeadlessTable(school_Dormitory_contentList, school_Dormitory_columnCount);
                replaceContent(school_Dormitory_facilityListWrap, school_Dormitory_newTag);


                /**
                 * 校园环境
                 */
                const school_Campus = schoolTag?.querySelector('[data-index="collegeFacilitiesCampus"]').parentElement;

                // 校园环境 图册删除
                const school_Campus_Album = school_Campus?.querySelector('[class*="facilityAlbumWrap_"]');
                if(school_Campus_Album){
                    school_Campus_Album.remove();
                }

                // 宿舍条件 表格
                const school_Campus_columnCount = 4;

                // 获取包含图标和文本信息的对象列表
                const school_Campus_facilityListWrap = school_Campus?.querySelector('[class*="facilityListWrap_"]');
                const school_Campus_contentList = getSchoolTableDate(school_Campus_facilityListWrap);

                let school_Campus_newTag = buildHeadlessTable(school_Campus_contentList, school_Campus_columnCount);
                replaceContent(school_Campus_facilityListWrap, school_Campus_newTag);


            });
        }

        // 获取所有校园设施标签
        const schoolTagList = contentTag.querySelectorAll('div[class*="J-collegeFacilities"]');
        console.log('schoolTagList:',schoolTagList);
        if(schoolTagList.length > 0){
            editDirectoryFunc_school(schoolTagList);
        }






        // 获取所有合并类图册标签
        let albumTag = contentTag.querySelectorAll('div[data-module-type="album"] a[class*="albumWrapper_"]');


        // 获取所有展开图册标签
        let galleryAlbumTag = contentTag.querySelectorAll('div[class*="galleryWrapper_"]');

        // 获取所有单张图片标签，排除居中大图
        let lemmaPictureTag = contentTag.querySelectorAll('div[class*="lemmaPicture_"]');



        // 获取所有按钮
        let buttonTag = contentTag.querySelectorAll('button');
        console.log('buttonTag:',buttonTag);
        editDirectoryFunc_delOther(buttonTag);

        // 获取所有模板-演员表
        let actorTag = contentTag.querySelectorAll('div[data-module-type="actor"] div');

        // 获取所有模板-角色介绍
        let roleTag = contentTag.querySelectorAll('div[class*="roleWrap_"]');

        // 获取所有模板-出版图书
        let bookTag = contentTag.querySelectorAll('div[data-module-type="publication"] div');



        // 获取所有模板-参演电影movieAndTvPosterWrapper_
        let movieTag = contentTag.querySelectorAll('[data-module-type="movie"] > div[class*="movieAndTvPosterWrapper_"]');
        console.log('movieTag:',movieTag);
        // editDirectoryFunc_delOther(movieTag);

        // 获取所有模板-参演电影movieAndTvPosterWrapper_
        let teleplayTag = contentTag.querySelectorAll('[data-module-type="teleplay"] > div[class*="movieAndTvPosterWrapper_"]');
        console.log('teleplayTag:',teleplayTag);
        // editDirectoryFunc_delOther(teleplayTag);


        // 获取所有模板-音乐专辑
        let musicAlbumTag = contentTag.querySelectorAll('div[class*="module-musicAlbum"]');
        console.log('buttonTag:',musicAlbumTag);
        editDirectoryFunc_delOther(musicAlbumTag);





        if (flag === 'TT') {//暗中复制

            // 合并类图册标签
            console.log('albumTag合并类图:',albumTag);
            // 遍历所有标签
            albumTag.forEach(function(tagElement) {
                if (tagElement && tagElement.href) {
                    // 获取图册的 href
                    let href = tagElement.href;
                    // 提取图片路径中的参数
                    let name = decodeURIComponent(href);

                    // 获取词条的 title
                    let titleContent = document.querySelector('head > meta[property="og:title"]').content;
                    // 获取图册的 title
                    let titleAlbum = tagElement.title;

                    let title = titleAlbum || titleContent;

                    console.log(title ,'href: ',name);

                    // 添加图片信息
                    let newTag = document.createElement('div');
                    // newTag.textContent = '【【' + name + '|【Album】|' + title + '】】';
                    // 将新的 div 元素插入到原始图册标签的父节点之前
                    tagElement.parentNode.parentNode.insertBefore(newTag, tagElement.parentNode);
                }

                // 删除
                tagElement.remove();
            });


            // 展开图册标
            console.log('albumTag展开类图:',galleryAlbumTag);
            // 遍历所有标签
            galleryAlbumTag.forEach(function(tagElement) {
                if (tagElement.querySelector('div[class*="galleryView_"]') && tagElement.querySelector('div[class*="galleryView_"]').getAttribute('data-gallery')) {

                    let tagA = tagElement.querySelector('div[class*="galleryView_"]');
                    let tagB = tagElement.querySelector('div[class*="galleryDesc_"]');

                    // 获取带ID的URL
                    let itemTitle = document.querySelector('head > link[hreflang="x-default"]').href;

                    // 获取图册的 dataGallery
                    let dataGallery = tagA.getAttribute('data-gallery');

                    // 获取图册的 dataImg
                    let tagList = tagA.querySelectorAll('img');
                    console.log('albumTag展开类图tagList:',tagList);
                    let dataImg = tagList[0]?.src?.replace('https://bkimg.cdn.bcebos.com/pic/','')?.replace(/\?x-bce-process.*/,'')?.trim();

                    let name = itemTitle.replace('baike.baidu.com/item','baike.baidu.com/pic') + '/' + dataGallery + '/' + dataImg;
                    name = decodeURIComponent(name);
                    console.log('albumTag展开类图name:',name);

                    // 获取词条的 title
                    let titleContent = document.querySelector('head > meta[property="og:title"]').content;
                    // 获取图册的 title
                    let titleAlbum;
                    if (tagB && tagB.textContent) {
                        titleAlbum = tagB.textContent;
                    }

                    let title = titleAlbum || titleContent;

                    console.log('albumTag展开类图name:',name);
                    console.log('albumTag展开类图title:',title);

                    // 添加图片信息
                    let newTag = document.createElement('div');
                    // newTag.textContent = '【【' + name + '|【Album】|' + title + '】】';
                    tagElement.parentNode.appendChild(newTag);
                }


                // 删除
                tagElement.remove();
            });

            // 单张图片标签，排除居中大图
            console.log('lemmaPictureTag:',lemmaPictureTag);
            // 遍历所有标签
            lemmaPictureTag.forEach(function(tagElement) {
                // 获取图片的 src
                let src = tagElement.querySelector('a img').src;
                // 提取图片路径中的参数
                let name = src.replace('https://bkimg.cdn.bcebos.com/pic/','').replace(/\?x-bce-process.*/,'').trim() + '.png';

                // 获取图片的 title
                let title = tagElement.querySelector('a').title || '';

                // 添加图片信息
                let newTag = document.createElement('div');
                //newTag.textContent = '【【' + name + '|【imgisthis】|' + title + '】】';

                // 使用正则表达式判断
                let hasLayoutRightClass = /\blayoutRight_[\w-]*\b/.test(tagElement.className);

                if (hasLayoutRightClass) {
                    // 将新的 div 元素插入到原始图册标签的父节点之前
                    tagElement.parentNode.parentNode.insertBefore(newTag, tagElement.parentNode);
                } else {
                    tagElement.parentNode.appendChild(newTag);
                }


                // 删除
                tagElement.remove();
            });



            //有序目录修改
            toggleOrderNumberVisibility(0);


            // 获取所有模板-角色介绍
            console.log('roleTag:',roleTag);
            // 遍历所有标签
            roleTag.forEach(function(tagElement) {
                // 添加信息
                let newTag = document.createElement('div');
                newTag.textContent = '【角色介绍】';
                tagElement.parentNode.appendChild(newTag);

                // 删除
                tagElement.remove();
                // 删除表格
                let del_role = contentTag.querySelectorAll('table#formatTablef_actor_role, table#insertTable_role');
                if (del_role.length > 0) {
                    del_role.forEach(function(tagElement) {
                        tagElement.remove();
                    });
                }
            });


            // 获取所有模板-出版图书
            console.log('bookTag:',bookTag);
            // 遍历所有标签
            bookTag.forEach(function(tagElement) {
                // 添加信息
                let newTag = document.createElement('div');
                newTag.textContent = '【出版图书】';
                tagElement.parentNode.prepend(newTag);

                // 删除
                tagElement.remove();
            });


            // 获取所有模板-影视
            console.log('movieTag:',movieTag);
            movieTag.forEach(function(tagElement) {
                // 添加信息
                // 直接在元素前面插入HTML
                tagElement.parentNode.insertAdjacentHTML('afterend', '<div>【参演电影】</div>');

                // 删除
                tagElement.remove();
            });
            // 获取所有模板-影视
            teleplayTag.forEach(function(tagElement) {
                // 添加信息
                // 直接在元素前面插入HTML
                tagElement.parentNode.insertAdjacentHTML('afterend', '<div>【参演电视剧】</div>');

                // 删除
                tagElement.remove();
            });


            // 删除：原演员表
            actorTag.forEach(function(tagElement) {
                tagElement.remove();
            });

            // 通用处理函数：存在新表格则删除旧模板
            function removeOldModules(contentTag) {
                // 查找所有以 insertTable_ 开头的元素
                const newTables = contentTag.querySelectorAll('[id^="insertTable_"]');

                newTables.forEach(newTable => {
                    // 获取下划线后的模块类型
                    const moduleType = newTable.id.split('_')[1];

                    if (moduleType) {
                        // 查找对应的旧模块并删除
                        const oldModule = contentTag.querySelector(`[data-tag="module"][data-module-type="${moduleType}"]`);
                        oldModule?.remove();
                    }
                });
            }

            // 使用方式
            removeOldModules(contentTag);


            // 转义特殊字符（避免正则语法错误）
            function escapeRegExp(string) {
                return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            }




            // 获取目录【分集剧情】
            let refRegexList = []; // 改为动态生成的数组
            let refHeadRegexList = [
                '参考资料',
                '参考资料来源',
                '参考资料来源于',
                '资料来源',
                '以上资料来源',
                '信息来自',
                '部分信息来源',
                '信息来源',

            ];

            // 获取所有一级目录（h1）标签
            let L1Tag = contentTag.querySelectorAll("h1");
            L1Tag.forEach(function(tagElement) {
                const baseText = tagElement?.textContent?.trim() || '';
                // 删除原始标签
                if (baseText === '分集剧情') {
                    tagElement.remove();
                }
                // 自动遍历refHeadRegexList拼接
                refHeadRegexList.forEach(refHead => {
                    // 标题+参考资料后缀（如"剧情简介参考资料"）
                    refRegexList.push(new RegExp(`^${escapeRegExp(baseText)}${refHead}$`, 'i'));
                });
            });

            // 获取所有二级目录（h2）标签
            let L2Tag = contentTag.querySelectorAll("h2");
            L2Tag.forEach(function(tagElement) {
                const baseText = tagElement?.textContent?.trim() || '';
                if (baseText === '分集剧情'
                    || baseText === '杂志写真'
                   ) {
                    tagElement?.parentNode?.remove();
                }

                refHeadRegexList.forEach(refHead => {
                    refRegexList.push(new RegExp(`^${escapeRegExp(baseText)}${refHead}$`, 'i'));
                });
            });

            // 添加原始正则表达式
            refRegexList.push(
                /^参考资料$/i,
                /^参考资料来源$/i,
                /^参考资料来源于$/i,
                /^来源$/i,
                /^来源于$/i,
                /^资料来源$/i,
                /^参考来源$/i,
                /^以上资料来源$/i,
                /^以上参考资料$/i,
                /^信息来自$/i,
                /^信息来源$/i,
                /^以上参考来源$/i,
                /^以上参考资料来源$/i,
                /^以上演职人员参考来源$/i,
                /^以上内容来自$/i,
                /^以上内容参考来源$/i,
                /^音乐模块参考资料$/i,
                /^分集剧情来源$/i,
                /^注参考来源$/i,
                /^部分参考资料为$/i,
                /^电影电视剧参考资料$/i,
                /^以上引用参考资料$/i,
                /^图册参考资料$/i,
                /^资料参考$/i,
                /^参考资料链接$/i,

            );

            // 去重正则表达式
            refRegexList = [...new Set(refRegexList)];


            // 获取所有正文参考资料行
            function TTdelRef(){
                // 选择目标元素
                let refTags = contentTag.querySelectorAll(
                    'div[class*="MARK_MODULE"][data-tag="paragraph"][data-idx*="-"]'
                );

                if (!contentTag?.querySelectorAll) return;
                // 遍历并过滤
                refTags.forEach(tagElement => {
                    console.log('tagElement: ',tagElement);
                    const text = tagElement?.textContent?.replace(/[[0-9-]+]/g,'')?.replace(/[():（）：.,。，;；\[\]【】]+/g,'')?.trim() || '';
                    console.log('text: ',text);
                    // 检查是否匹配任一正则
                    console.log('refRegexList: ',refRegexList);
                    if (refRegexList.some(re => re.test(text))) {
                        tagElement.remove();
                    }
                });
            };
            //TTdelRef();
            // ================== 新：无用内容去除函数 ==================
            let catalogH1 = contentTag.getElementsByTagName('h1');
            let catalogH2 = contentTag.getElementsByTagName('h2');
            let catalogList = [...catalogH1, ...catalogH2]; // 合并为数组


            catalogList.forEach(function(tagElement) {
                const baseText = tagElement?.textContent?.trim() || '';
                // 删除原始标签
                if (baseText === '分集剧情'
                    || baseText === '杂志写真'
                   ) {
                    tagElement?.parentNode?.remove();
                }
            });


            // ================== 新：正文参考资料行去除函数 ==================
            const catalogTextList = [
                ...Array.from(catalogH1).map(h => h.textContent?.trim()).filter(Boolean),
                ...Array.from(catalogH2).map(h => h.textContent?.trim()).filter(Boolean)
            ];


            // 构造目录组正则表达式
            // 正确的做法：对数组中的每个元素单独转义
            const escapedCatalogList = catalogTextList.map(item => escapeRegExp(item));
            const newDelRefRow_catalog = new RegExp(
                `(${escapedCatalogList.join('|')})`,
                'gi'
            );
            console.log('newDelRefRow_catalog: ',newDelRefRow_catalog);

            // 构造关键词正则表达式
            let newDelRefRow_keywords = [
                /参考资料|资料|信息|图册|图片|内容|演职人员/gi,
                /来源|来自|于/gi,
                /以上/gi,
                /部分|链接|模块|注|为/gi,
            ];

            function newDelRefRow() {
                // 选择目标元素
                let refTags = contentTag.querySelectorAll(
                    'div[class*="MARK_MODULE"][data-tag="paragraph"][data-idx*="-"]'
                );

                if (!contentTag?.querySelectorAll) return;

                // 移除所有匹配的关键词
                refTags.forEach(tagElement => {
                    let text = tagElement?.textContent?.replace(/[[0-9-]+]/gi, '')?.replace(/[():（）：.,。，;；、\[\]【】]+/g,'')?.trim() || '';
                    //  console.log('text start: ',text);

                    // 移除所有匹配的目录组正则表达式
                    text = text.replace(newDelRefRow_catalog, '');

                    // 循环应用所有正则替换；关键词正则表达式
                    newDelRefRow_keywords.forEach(regex => {
                        text = text.replace(regex, '');
                    });

                    text = text.trim();
                    // console.log('text end: ',text);

                    if (text === '') {
                        tagElement.remove();
                    }
                });
            };
            newDelRefRow();


            cleanRef(tag);


            // 内容修正函数
            formatTextContent(contentTag);


        }


        else if (flag === 'FF') {
            // 合并类图册标签
            // console.log('albumTag:',albumTag);
            editDirectoryFunc_delOther(albumTag);

            // 展开图册标
            // console.log('albumTag:',albumTag);
            editDirectoryFunc_delOther(galleryAlbumTag);

            //<div class="lemmaPicture_beXHo layoutCenter_QrcSG disable-select" style="float: none; display: block; margin: 0px auto; clear: both; width: 640px;">
            //<div class="lemmaPicture_beXHo layoutRight_VmmaI disable-select" style="float: right; width: 194px;">
            // 单张图片标签，排除居中大图
            console.log('lemmaPictureTag:',lemmaPictureTag);
            editDirectoryFunc_delOther(lemmaPictureTag);


            // 获取所有模板-演员表
            console.log('buttonTag:',actorTag);
            editDirectoryFunc_delOther(actorTag);

            // 获取所有模板-角色介绍
            console.log('buttonTag:',roleTag);
            editDirectoryFunc_delOther(roleTag);
        }










    }





    // 新建隐藏tag并写入内容
    function createCopyNewTag(){
        // createMainDiv();
        createWebElement('div', 'main-add-div', 'body');

        // 如果div#copyNewTag存在，删除它
        if (document.querySelector("div#copyNewTag")) {
            document.querySelector("div#copyNewTag").remove();
        }

        let mainDiv = document.querySelector("div#main-add-div");

        function addNewContentTag() {
            // 获取目标元素
            const sourceDiv = document.querySelector("div.J-lemma-content"); // 正文
            const summaryDiv = document.querySelector("*[class*='J-summary']"); // 概述

            // 创建新的div元素
            //document.querySelector("div#main-add-div")
            const newDiv = document.createElement('div');
            newDiv.id = 'copyNewTag';

            const newDiv_Content = document.createElement('div');
            newDiv_Content.id = 'copy_J-lemma-content';

            const newDiv_summary = document.createElement('div');
            newDiv_summary.id = 'copy_J-summary';


            // 将目标元素的内容复制到新元素
            sourceDiv.childNodes.forEach(child => {
                newDiv_Content.appendChild(child.cloneNode(true));
            });


            summaryDiv.querySelectorAll('div[class*="MARK_MODULE"][data-tag="paragraph"][data-idx]').forEach(child => {
                let newDiv_summary_child = document.createElement('div');
                newDiv_summary_child.id = 'copy_J-summary_child';
                newDiv_summary_child.setAttribute('class', 'MARK_MODULE');
                newDiv_summary_child.setAttribute('data-tag', 'paragraph');
                newDiv_summary_child.setAttribute('data-idx', '');
                newDiv_summary.appendChild(newDiv_summary_child);

                if (child?.innerText) {
                    newDiv_summary_child.innerText = child?.innerText;
                }
            });



            // 将新元素添加到网页中
            mainDiv.appendChild(newDiv);
            newDiv.appendChild(newDiv_Content);
            newDiv.appendChild(newDiv_summary);
            // newDiv_summary.appendChild(newDiv_summary_child);

            // 设置新元素为隐藏
            newDiv.style.display = 'none';
        }


        addNewContentTag();
    }


    function auto() {
        console.log('auto');
        //自动化词条页面
        if (url.includes("?areyousuper") && !url.includes("?fromtitle=")) {
            console.log('自动化词条页面');

            validateSemantPage();
        }
        //自动化词条页面，小问题
        else if (url.includes("?fromtitle=") && !url.includes("?areyousuper")) {
            console.log('自动化词条页面');

            // 使用 URL 对象解析当前的 URL
            let urlParams = new URLSearchParams(window.location.search);

            // 获取查询参数 fromtitle 和 fromid 的值
            let fromtitle = urlParams.get('fromtitle');
            // let fromid = urlParams.get('fromid');

            // 打印结果

            // let new_url = 'https://baike.baidu.com/item/' + fromtitle + '/' + fromid;

            let lemmaId = window.PAGE_DATA.navigation.disamLemma.lemmaId;

            let list_url = 'https://baike.baidu.com/item/' + fromtitle + '/' + lemmaId;

            console.log('lemmaId:', lemmaId);
            console.log('new_url:', list_url);

            // 跳转到新的 URL
            window.location.href = list_url;
        }


        // 聚焦加载图册
        let galleryAlbumTag = document.querySelector("div.J-lemma-content").querySelectorAll('div[class*="galleryWrapper_"]');
        console.log('galleryAlbumTag',galleryAlbumTag);
        // 当前索引
        let currentIndex = 0;
        let time = 500;

        // 定义函数来聚焦到下一个元素
        function focusNextElement() {

            console.log('lemmaIdfocusNextElement');
            if (currentIndex < galleryAlbumTag.length) {
                // 当前元素
                let element = galleryAlbumTag[currentIndex];

                // 将当前元素滚动到视图中
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // 增加索引以便下次调用
                currentIndex++;

                // 设置定时器，1秒后调用下一个元素
                setTimeout(focusNextElement, time);
            }
            else if (currentIndex = galleryAlbumTag.length){
                let titleTag = document.querySelector("h1.J-lemma-title");

                // 将当前元素滚动到视图中
                titleTag.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        // 启动函数
        focusNextElement();


        // 显示图片、参考资料数量
        setInterval(createContentStatsHeader, 1000);
        setInterval(window.gc, 1000); // 尝试强制执行垃圾回收

        // 不显示概述图则显示
        setTimeout(function() {
            if (!document.querySelector('#side > div[class*="abstractAlbum_"]')
                && !document.querySelector('div[class^="posterRight_"] > div[class^="abstractAlbum_"] > img')) {
                formatAbstractAlbum();
            }
        }, 3000);

        // 去杂
        runFunction(cleanRedundant, 1000, 5);


        // 展开角色列表
        setTimeout(function() {
            函数_展开角色列表();
        }, 5000);

        // 参考资料预备处理
        setTimeout(function() {
            changeReference_ready();
        }, 1000);


        // 更新img
        runFunction(formatImgSrc, 2000, 3);
    }


    //*************************************************************************************
    //----------------------------------------创建按钮：页面
    //*************************************************************************************
    function createButton_semantPage() {
        const createButton_semantPage_Element = createWebElement('div', 'createButton_semantPage', main_add_div);

        //*************************************************************************************
        //----------------------------------------按钮：去参/显参/改参
        //*************************************************************************************
        let type = '';
        addButton("隐", "120px", "80px", createButton_semantPage_Element, function() {
            // 创建并显示弹窗
            type = 'none';
            formatSupSub(type);
            setInterval(() => formatSupSub(type), 1000);
        });
        addButton("显", "70px", "80px", createButton_semantPage_Element, function() {
            // 创建并显示弹窗
            type = '';
            formatSupSub(type);
        });
        addButton("改", "20px", "80px", createButton_semantPage_Element, function() {
            // 创建并显示弹窗
            changeReference()
        });


        //*************************************************************************************
        //----------------------------------------按钮：下图/表格/显图
        //*************************************************************************************
        addButton("图", "300px", "10px", createButton_semantPage_Element, function() {
            createImgButton_semantPage();
        });
        addButton("表", "250px", "10px", createButton_semantPage_Element, function() {
            formatSupSub('none');
            formatTable();

            // 在页面加载完成后调用函数
            setTimeout(function() {
                createTableButton();
            }, 1000);
        });


        //*************************************************************************************
        //----------------------------------------按钮：URL/词条名/义项名
        //*************************************************************************************

        addButton("名", "500px", "10px", createButton_semantPage_Element, function() {
            let titleContent = document.querySelector('head > meta[property="og:title"]').content;

            navigator.clipboard.writeText(titleContent)
                .then(() => console.log('【词条名】已复制到剪贴板：' + titleContent))
                .catch(err => console.warning('【词条名】复制失败：', err));
        });
        addButton("义", "450px", "10px", createButton_semantPage_Element, function() {
            let titleContent = window.PAGE_DATA?.lemmaDesc?.trim();

            navigator.clipboard.writeText(titleContent)
                .then(() => console.log('【义项名】已复制到剪贴板：' + titleContent))
                .catch(err => console.warning('【义项名】复制失败：', err));
        });
        addButton("概", "400px", "10px", createButton_semantPage_Element, function() {
            //新建隐藏tag并写入内容
            createCopyNewTag();

            const tag = 'div#copy_J-summary';
            let contentTag = document.querySelector(`${tag}`)
            console.log(contentTag)

            //删除参考资料
            cleanRef(tag);
            // 内容修正函数
            formatTextContent(contentTag);

            // 复制指定标签下的内容，像鼠标划选复制一样连带格式一同复制到剪切板
            setTimeout(function() {
                copyElementContentToClipboard(tag);
            }, 200);

        });


        addButton("头", "600px", "10px", createButton_semantPage_Element, function() {
            // 概述图图册封面
            const img_many = document.querySelector("#side div[class*='abstractAlbum_'] img");
            // https://baike.baidu.com/item/烈火雄心/52232
            // 图集封面
            const img_a = document.querySelector("div[class*='smallFeatureWrap_'] div[class*='poster_'] div[class*='posterRight_'] div[class*='abstractAlbum_'] img");
            const img = img_many || img_a;


            event.stopPropagation();
            event.preventDefault();

            // 新的，完整路径
            const baiduID = window.PAGE_DATA.lemmaId;
            const mainPath = 'Z:\\' + baiduID + '\\';
            // 获取图片的 src
            const src = img.src;
            // 提取图片路径中的参数
            const imgName = src.replace('https://bkimg.cdn.bcebos.com/pic/','').replace(/\?x-bce-process.*/,'').trim() + '.png';

            const picPath = mainPath + imgName;
            // 复制图片路径中的内容到剪贴板
            navigator.clipboard.writeText(picPath)
                .then(() => console.log('【图片路径】已复制到剪贴板：' + picPath))
                .catch(err => console.warning('【图片路径】复制失败：', err));
        });
        addButton("U", "650px", "10px", createButton_semantPage_Element, function() {
            const titleContent = document.querySelector('head > link[hreflang="x-default"]').href;

            // 复制图片路径中的内容到剪贴板
            navigator.clipboard.writeText(titleContent)
                .then(() => console.log('【URL】已复制到剪贴板：' + titleContent))
                .catch(err => console.warning('【URL】复制失败：', err));
        });
        addButton("模", "700px", "10px", createButton_semantPage_Element, function() {
            // 假设使用可选链操作符安全地获取第一个元素的 name 属性
            let mod_type = window.PAGE_DATA?.extData?.kpdClassify?.[0]?.name;
            mod_type = mod_type
                ?.replace('行政区划','行政规划')
            if(!mod_type){
                mod_type = '其他';
            }
            console.log("mod_type",mod_type);

            navigator.clipboard.writeText(mod_type)
                .then(() => console.log('【信息栏模板类型】已复制到剪贴板：' + mod_type))
                .catch(err => console.warning('【信息栏模板类型】复制失败：', err));
        });


        addButton("FF", "600px", "80px", createButton_semantPage_Element, function() {
            const flag = 'FF';
            const tag = 'div.J-lemma-content';
            editDirectory(flag,tag);
        });
        addButton("TT", "650px", "80px", createButton_semantPage_Element, function() {

            // 新建隐藏tag并写入内容
            createCopyNewTag();

            // 修改隐藏tag的内容
            const flag = 'TT';
            const tag = 'div#copy_J-lemma-content';
            editDirectory(flag,tag);

            // 复制指定标签下的内容，像鼠标划选复制一样连带格式一同复制到剪切板
            setTimeout(function() {
                copyElementContentToClipboard(tag);
            }, 200);
        });


        const targetDiv = document.querySelector('body');



        //*************************************************************************************
        //----------------------------------------按钮：🔄/⏫/⏬
        //*************************************************************************************
        addButton("⏫", "120px", "10px", createButton_semantPage_Element, function() {
            // 滚动到顶部
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        addButton("🔄", "70px", "10px", createButton_semantPage_Element, function() {
            // 刷新网页
            location.reload();
        });
        addButton("⏬", "20px", "10px", createButton_semantPage_Element, function() {
            // 滚动到底部
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        });

        //*************************************************************************************
        //----------------------------------------按钮：特/序/xxl
        //*************************************************************************************
        addButton("特", "200px", "80px", createButton_semantPage_Element, function() {
            // 该词所有特色义项
            openAllSemant();
        });
        addButton("序", "250px", "80px", createButton_semantPage_Element, function() {
            // 修改序号
            toggleOrderNumberVisibility(2);
        });
        addButton("xxl", "300px", "80px", createButton_semantPage_Element, function() {
            // 信息栏
            formatBasicInfo();
        });
    }

    function createButton_albumPage() {
        addButton("词", "500px", "10px", main_add_div, function() {
            let lemmaTitle = window.PAGE_DATA?.lemmaTitle.trim();

            navigator.clipboard.writeText(lemmaTitle)
                .then(() => console.log('【词条名】已复制到剪贴板：' + lemmaTitle))
                .catch(err => console.warning('【词条名】复制失败：', err));
        });

        addButton("册", "400px", "10px", main_add_div, function() {
            // let albumDesc = document.querySelector("#root > div > div > div > span").textContent.replace('图片_百度百科','');
            let albumDesc = document.querySelector("#root > div > div[class*='header_'] > div > span.album-desc").textContent?.replace('图片_百度百科','')?.trim();

            navigator.clipboard.writeText(albumDesc)
                .then(() => console.log('【图册名】已复制到剪贴板：' + albumDesc))
                .catch(err => console.warning('【图册名】复制失败：', err));
        });
    }






    //*************************************************************************************
    //*************************************************************************************
    //----------------------------------------页面
    //*************************************************************************************
    //*************************************************************************************
    let url = window.location.href;
    console.log('url：'+url);
    let main_add_div = createWebElement('div', 'main-add-div', 'body');

    // 词条页面semantPage
    if (
        url.includes("baike.baidu.com/item")
        && !url.includes("baike.baidu.com/pic")
        && !url.includes('?adplus')
    ) {
        console.log('词条页面');

        // auto();
        setTimeout(function() {
            auto();
        }, 1000);

        formatSupSub('none');

        toggleSideCatalog();

        // 创建所有大地图标签按钮
        const BMaps = document.querySelectorAll('div[data-module-type="map"] div[class*="lemmaMap_"][class*="big_"]');
        if(BMaps.length > 0){
            createMapButton(BMaps);
        }

        // 创建按钮
        createButton_semantPage();
    }
    // 图册页面albumPage
    else if (
        url.includes('baike.baidu.com/pic')
        && !url.includes('baike.baidu.com/item')
        && !url.includes('autodownload')
        && !url.includes('?adi')
    ) {
        console.log('图册页面');

        // 更新img
        runFunction(formatImgSrc, 500, 100);

        setTimeout(function() {
            createImgButton_albumPage();
        }, 1000); // 延迟一段时间

        createButton_albumPage();
    }

    //无运行
    else if (
        !url.includes('?adi')
        && url.includes('?nothing')
    ) {
        //
    }
})();
// ==UserScript==
// @name         CRABPT Combined Tools（发种和有声书）
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Combined tools for CRABPT including Ximalaya Information Extractor and Auto Selector
// @author       @Crabpt @Leon
// @license      Crabpt
// @match        https://www.ximalaya.com/*
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crabpt.vip
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/539033/CRABPT%20Combined%20Tools%EF%BC%88%E5%8F%91%E7%A7%8D%E5%92%8C%E6%9C%89%E5%A3%B0%E4%B9%A6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/539033/CRABPT%20Combined%20Tools%EF%BC%88%E5%8F%91%E7%A7%8D%E5%92%8C%E6%9C%89%E5%A3%B0%E4%B9%A6%EF%BC%89.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 声明信息
    const DISCLAIMER = `
[size=4][color=#FF0000][b]郑重声明：[/b][/color][/size]
[quote][color=#666666]
本站提供的所有影视作品均是在网上搜集，任何涉及商业盈利目的均不得使用，否则产生的一切后果将由您自己承担！
本站不对本站的任何内容负任何法律责任！该下载内容仅做宽带测试使用，请在下载后24小时内删除。请购买正版！
本站列出的文件没有保存在本站的服务器上，本站仅负责连接，本站对被传播文件的内容一无所知。
本站的链接均由用户自发提供，管理员无法对用户的提交内容或其他行为负责。
[/color][/quote]`;

    // 创建复制按钮
    function createCopyButton() {
        const button = document.createElement('button');
        button.textContent = '复制信息';
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '10px';
        button.style.backgroundColor = '#fc5832';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', extractAndCopyInfo);
        document.body.appendChild(button);
    }

    // 处理文本内容
    function processText(text) {
        if (!text) return '';

        const sections = text.split('\n\n');
        const processedSections = [];
        let skipSection = false;

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i].trim();

            if (!section) continue;

            if (section.includes('购买须知') ||
                section.includes('本作品为付费有声书') ||
                section.includes('版权归原作者所有') ||
                section.includes('如在充值／购买环节遇到问题') ||
                section.includes('在购买过程中')) {
                skipSection = true;
                continue;
            }

            if (section === 'staff' || section === 'cast' || section.includes('内容简介')) {
                skipSection = false;
            }

            if (skipSection) continue;

            if (section.includes('【冒泡有奖】')) {
                processedSections.push(`[quote][color=#FF6B6B]${section}[/color][/quote]`);
            } else if (section.startsWith('版权方：') || section.startsWith('作  者：') ||
                       section.startsWith('策  划：') || section.startsWith('画  本：')) {
                processedSections.push(`[*]${section}`);
            } else if (section.startsWith('男：') || section.startsWith('女：')) {
                const lines = section.split('\n').filter(line => line.trim());
                processedSections.push(lines.join('\n'));
            } else {
                processedSections.push(section);
            }
        }

        return processedSections.join('\n');
    }

    // 提取并复制信息
    function extractAndCopyInfo() {
        const currentUrl = window.location.href;
        let mainImageUrl, displayImageUrl, titleText, introText;

        // 根据不同平台提取信息
        if (window.location.hostname.includes('ximalaya.com')) {
            // 喜马拉雅
            const mainImage = document.querySelector('.img.z_i');
            mainImageUrl = mainImage ? mainImage.src : '';
            const articleImage = document.querySelector('article.intro img');
            displayImageUrl = articleImage ? articleImage.src : '';
            const title = document.querySelector('h1.title.z_i');
            titleText = title ? title.textContent.trim() : '';

            const article = document.querySelector('article.intro');
            if (article) {
                const paragraphs = article.querySelectorAll('p');
                introText = Array.from(paragraphs)
                    .map(p => p.textContent.trim())
                    .filter(text => text)
                    .join('\n\n');
            }
        } else if (window.location.hostname.includes('qtfm.cn')) {
            // 蜻蜓FM
            const bgImgStyle = getComputedStyle(document.querySelector('.bgImg')).backgroundImage;
            mainImageUrl = bgImgStyle.match(/url\(['"]?(.*?)['"]?\)/)[1];
            displayImageUrl = mainImageUrl;
            const title = document.querySelector('.info.right h1.title');
            titleText = title ? title.textContent.trim() : '';

            const contentDiv = document.querySelector('.desc > span:last-child > section > div.content');
            introText = contentDiv ? contentDiv.textContent.trim() : '';
        } else if (window.location.hostname.includes('lrts.me')) {
            // 懒人听书
            const coverImage = document.querySelector('.d-cover.d-book-cover img');
            mainImageUrl = coverImage ? coverImage.src : '';
            displayImageUrl = mainImageUrl;
            const title = document.querySelector('.d-r h1.nowrap');
            titleText = title ? title.textContent.replace(/\s+\|\s+/g, ' ').replace(/\s+$/, '').trim() : '';

            const descDiv = document.querySelector('.d-desc.f14 p');
            introText = descDiv ? descDiv.textContent.trim() : '';
        }

        // 格式化输出文本
        const formattedText = `[center][size=6][color=#FC5832][b]${titleText}[/b][/color][/size][/center]

[center][size=5][color=#2C3E50][b]━━━━━ 封面展示 ━━━━━[/b][/color][/size][/center]
[center][img]${mainImageUrl}[/img][/center]

[center][size=5][color=#2C3E50][b]━━━━━ 详情介绍 ━━━━━[/b][/color][/size][/center]
[center][img]${displayImageUrl}[/img][/center]

[quote][size=4][color=#2C3E50][b]内容简介[/b][/color][/size]
${processText(introText)}[/quote]

[size=4][color=#2C3E50][b]资源信息[/b][/color][/size]
[quote][color=#666666]原网址：[url=${currentUrl}]${currentUrl}[/url][/color][/quote]

${DISCLAIMER}

[center][size=3][color=#999999]━━━━━ CRABPT ━━━━━[/color][/size][/center]`;

        // 复制到剪贴板
        navigator.clipboard.writeText(formattedText).then(() => {
            alert('信息已复制到剪贴板！');
        }).catch(err => {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制');
        });
    }

    // 自动选择器配置
    const TARGETS = [
        {
            selector: 'select[name="team_sel[6]"]',
            targetValue: "",
            targetText: "红叶",
            eventName: "change"
        },
        {
            selector: 'select[name="type"][id="specialcat"]',
            targetValue: "411",
            targetText: "有声书 / Audiobook",
            eventName: "change",
            customHandler: "disableother('specialcat','browsecat')"
        },
        {
            selector: 'input[type="checkbox"][name="tags[6][]"][value="1"]',
            targetValue: "1",
            targetText: "禁转",
            eventName: "click",
            enforceChecked: true
        }
    ];

    // 自动选择功能
    function autoSelect(target) {
        const el = document.querySelector(target.selector);
        if (!el) return false;

        if (el.type === 'checkbox' && target.enforceChecked) {
            if (el.checked !== true) {
                el.click();
                const event = new Event('change', { bubbles: true });
                el.dispatchEvent(event);
            }
            return true;
        }
        if (el.tagName.toLowerCase() === 'select') {
            const option = Array.from(el.options).find(opt =>
                                                       (target.targetValue && opt.value === target.targetValue) ||
                                                       opt.text.includes(target.targetText)
                                                      );

            if (option) {
                el.value = option.value;
                const event = new Event(target.eventName, {
                    bubbles: true,
                    cancelable: true
                });
                el.dispatchEvent(event);

                if (target.customHandler) {
                    new Function(target.customHandler)();
                }
                return true;
            }
        }
        return false;
    }

    function isDomainWhitelisted(whitelist) {
        return whitelist.some(domain => window.location.hostname.includes(domain));
    }

    // 执行选择
    function executeSelections() {
        if (!isDomainWhitelisted(['crabpt.vip'])) {
            console.log('当前域名不在白名单中，跳过自动选择');
            return;
        }
        TARGETS.forEach(target => {
            const success = autoSelect(target);
            console.log(`${target.targetText}: ${success ? '成功' : '失败'}`);
        });
    }

    // 初始化函数
    function init() {
        // 在支持的网站上创建复制按钮
        if (window.location.hostname.includes('ximalaya.com') ||
            window.location.hostname.includes('qtfm.cn') ||
            window.location.hostname.includes('lrts.me')) {
            createCopyButton();
        }

        // 设置自动选择器的观察器
        const observer = new MutationObserver(mutations => {
            if (TARGETS.some(t => document.querySelector(t.selector))) {
                executeSelections();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        if (document.readyState === 'complete') {
            setTimeout(executeSelections, 800);
        }
    }

    // 事件监听器
    window.addEventListener('DOMContentLoaded', init);
    window.addEventListener('load', init);
})();